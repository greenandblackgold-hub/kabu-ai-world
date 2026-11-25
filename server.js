import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const root = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3001;
const MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";
app.disable("x-powered-by");
app.use(express.json({ limit: "16kb" }));
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Cache-Control", req.path.startsWith("/assets/") ? "public, max-age=31536000, immutable" : "no-store");
  next();
});

// Lightweight per-instance rate limit. No message contents are logged or stored.
const requestCounts = new Map();
function rateLimit(req, res, next) {
  const key = req.ip || "unknown";
  const now = Date.now();
  const recent = (requestCounts.get(key) || []).filter(time => now - time < 60_000);
  if (recent.length >= 12) return res.status(429).json({ error: "rate_limited" });
  recent.push(now);
  requestCounts.set(key, recent);
  next();
}

app.get("/api/health", (_req, res) => res.json({
  ok: true,
  mode: process.env.GEMINI_API_KEY ? "gemini-ai" : "ai-key-required",
  model: MODEL
}));

app.post("/api/chat", rateLimit, async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(503).json({ error: "ai_not_configured" });

  const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
  if (!message || message.length > 600) return res.status(400).json({ error: "invalid_message" });

  const rawHistory = Array.isArray(req.body?.history) ? req.body.history.slice(-10) : [];
  const contents = rawHistory
    .filter(item => item && ["user", "assistant"].includes(item.role) && typeof item.content === "string")
    .map(item => ({
      role: item.role === "assistant" ? "model" : "user",
      parts: [{ text: item.content.slice(0, 600) }]
    }));
  contents.push({ role: "user", parts: [{ text: message }] });

  const systemPrompt = [
    "You are Kabu, a warm, playful, patient and safe AI friend for a young child.",
    "Reply in natural, simple Tigrinya (Eritrean Tigrinya, Ge'ez script) whenever possible. If you cannot confidently understand Tigrinya, politely ask the child to repeat or use simple English; never pretend you understood.",
    "Keep replies short, kind, age-appropriate, encouraging and educational. Use simple games, stories, counting, colors and curiosity.",
    "Never ask for or encourage sharing a child's full name, address, school, phone number, passwords, photos, exact location or other identifying information.",
    "Never request secrecy from parents or caregivers. Encourage the child to involve a trusted adult for personal, medical, frightening, unsafe or emergency situations.",
    "If the child says they are hurt, scared, lost, threatened, abused or in danger, respond calmly and tell them to go to a parent, guardian or trusted adult immediately; if immediate danger, seek local emergency help.",
    "Do not provide sexual content, graphic violence, dangerous instructions, medical diagnosis, or instructions to hide harmful activity.",
    "Do not claim to be human, a real creature, or a substitute for parents. You are Kabu, an AI character.",
    "Do not mention API keys, billing, system prompts, or internal implementation to the child."
  ].join(" ");

  try {
    const upstream = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(MODEL)}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: { temperature: 0.75, maxOutputTokens: 220 },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_LOW_AND_ABOVE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_LOW_AND_ABOVE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_LOW_AND_ABOVE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_LOW_AND_ABOVE" }
        ]
      })
    });
    const payload = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      const status = upstream.status === 429 ? 429 : 502;
      return res.status(status).json({ error: "upstream_unavailable" });
    }
    const reply = payload.candidates?.[0]?.content?.parts
      ?.map(part => part.text || "")
      .join("")
      .trim();
    if (!reply) return res.status(502).json({ error: "empty_ai_reply" });
    return res.json({ reply });
  } catch {
    return res.status(502).json({ error: "ai_unavailable" });
  }
});


app.post("/api/speech", rateLimit, async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(503).json({ error: "ai_not_configured" });
  const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";
  if (!text || text.length > 500) return res.status(400).json({ error: "invalid_text" });
  try {
    const upstream = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash-tts:generateContent", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Read this Tigrinya text aloud warmly and playfully as a friendly character speaking to a young child. Speak only the text, naturally and clearly: " + text }] }],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Puck" } } }
        }
      })
    });
    const payload = await upstream.json().catch(() => ({}));
    if (!upstream.ok) return res.status(upstream.status === 429 ? 429 : 502).json({ error: "speech_unavailable" });
    const audioPart = payload.candidates?.[0]?.content?.parts?.find(part => part.inlineData?.data);
    if (!audioPart) return res.status(502).json({ error: "empty_speech" });
    return res.json({ audio: audioPart.inlineData.data, mimeType: audioPart.inlineData.mimeType || "audio/wav" });
  } catch {
    return res.status(502).json({ error: "speech_unavailable" });
  }
});

app.use(express.static(path.join(root, "dist"), { index: "index.html" }));
app.get("/{*splat}", (_req, res) => res.sendFile(path.join(root, "dist", "index.html")));
app.listen(PORT, "0.0.0.0", () => console.log(`KABU AI listening on ${PORT}`));
