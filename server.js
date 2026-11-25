import express from "express";
import multer from "multer";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const root = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3001;
const API_KEY = process.env.ADDIS_API_KEY;
const API = "https://api.addisassistant.com";
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 12 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    const allowed = /^(audio\/(webm|mp4|ogg|wav|mpeg|mp3|x-wav)|video\/webm)$/i.test(file.mimetype);
    cb(allowed ? null : new Error("የድምጺ ፋይል ቅርጺ ኣይድገፍን።"), allowed);
  }
});
const rateBuckets = new Map();
app.disable("x-powered-by");
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Cache-Control", req.path.startsWith("/api/") ? "no-store" : "public, max-age=300");
  next();
});
app.use(express.json({ limit: "32kb" }));
app.get("/api/health", (_req, res) => res.json({ ok: true, configured: Boolean(API_KEY) }));

function limitRequests(req, res, next) {
  const key = req.ip || "unknown";
  const now = Date.now();
  const bucket = rateBuckets.get(key) || { start: now, count: 0 };
  if (now - bucket.start > 60_000) { bucket.start = now; bucket.count = 0; }
  bucket.count += 1;
  rateBuckets.set(key, bucket);
  if (bucket.count > 20) return res.status(429).json({ error: "ብዙ ጊዜ ሞኪርካ ኣለኻ። ቁሩብ ጸኒሕካ ፈትን።" });
  next();
}
async function addisRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { "x-api-key": API_KEY, ...(options.headers || {}) },
    signal: AbortSignal.timeout(45_000)
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const err = new Error(body?.error?.message || body?.message || "የድምጺ ኣገልግሎት ጸገም ኣጋጢሙ።");
    err.status = response.status;
    throw err;
  }
  return body;
}

app.get("/api/greeting", async (_req, res) => {
  if (!API_KEY) return res.status(503).json({ error: "Greeting voice is not configured yet." });
  try {
    const tts = await addisRequest(API + "/api/v1/voice/generations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ voice_id: "ti-filimon", language: "ti", text: "ሰላም ካቡየ፣ ደሓን ዲኻ?", output_format: "mp3_44100", client_request_id: randomUUID() }) });
    const audio = tts?.data?.audio_url || tts?.audio_url;
    if (!audio) return res.status(502).json({ error: "Greeting audio was not returned." });
    res.json({ audio });
  } catch (error) { console.error("KABU greeting audio failed:", error?.status || "network", error?.message); res.status(502).json({ error: "Greeting audio is temporarily unavailable." }); }
}
app.post("/api/voice-turn", limitRequests, upload.single("audio"), async (req, res) => {
  if (!API_KEY) return res.status(503).json({ error: "ካቡ ንምስራሕ የAddis AI API ቁልፊ ገና ኣይተቐመጠን።" });
  if (!req.file) return res.status(400).json({ error: "ድምጺ ኣይተረኽበን።" });

  try {
    const requestId = randomUUID();
    const form = new FormData();
    form.append("audio", new Blob([req.file.buffer], { type: req.file.mimetype }), req.file.originalname || "kabu.webm");
    const sttUrl = new URL(API + "/api/v1/scribe/transcribe");
    sttUrl.searchParams.set("language", "ti");
    sttUrl.searchParams.set("backend", "turbo");
    sttUrl.searchParams.set("request_id", requestId);
    const stt = await addisRequest(sttUrl, { method: "POST", body: form });
    const transcript = String(stt?.data?.text || stt?.data?.transcription || "").trim();
    if (!transcript) return res.status(422).json({ error: "ካቡ ዝተዛረብካዮ ክርዳእ ኣይከኣለን። ቀስ ኢልካ እንደገና ተዛረብ።" });

    let history = [];
    try {
      const parsed = JSON.parse(req.body.history || "[]");
      if (Array.isArray(parsed)) history = parsed
        .filter((m) => ["user", "assistant"].includes(m?.role) && typeof m?.content === "string")
        .slice(-8).map((m) => ({ role: m.role, content: m.content.slice(0, 500) }));
    } catch {}

    const system = [
      "You are Kabu, a friendly, gentle, playful big red balloon friend for a child who is about two years old.",
      "Speak ONLY in natural, simple Tigrinya (ትግርኛ), using Ge'ez script. Never answer in Amharic or English.",
      "Use very short spoken replies, usually one simple sentence and at most two short sentences. Use warm, playful words and simple questions.",
      "Be patient with unclear toddler speech. If the transcript is unclear, gently ask the child to say it again; do not pretend you understood.",
      "Teach simple colors, animals, counting, greetings, songs you create yourself, and tiny games. Never use copyrighted song lyrics.",
      "Never ask for the child's full name, address, school, phone number, photos, or other identifying details. Do not encourage secrecy from parents.",
      "Never produce frightening, violent, sexual, hateful, manipulative, or adult content. Do not discuss gambling, money, or dangerous activities.",
      "If the child says they are hurt, scared, lost, or in danger, calmly tell them to go to their parent or trusted grown-up immediately.",
      "Do not claim to see, hear, or do things beyond the current conversation. Do not claim to remember after the session ends.",
      "No markdown, lists, emojis, or stage directions. Return only the exact Tigrinya words Kabu should say aloud."
    ].join(" ");
    const chat = await addisRequest(API + "/api/v1/chat_generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: transcript,
        target_language: "ti",
        system,
        persona: "ካቡ፡ ሓጎስ ዝመልኦ፡ ሕያዋይ፡ ትግርኛ ጥራይ ዝዛረብ ቀይሕ ባሎን ዓርኪ ቆልዓ።",
        conversation_history: history,
        generation_config: { temperature: 0.75, maxOutputTokens: 100 }
      })
    });
    const reply = String(chat?.response_text || "").trim();
    if (!reply) throw new Error("ካቡ መልሲ ኣይረኸበን።");

    const tts = await addisRequest(API + "/api/v1/voice/generations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        voice_id: "ti-filimon",
        language: "ti",
        text: reply,
        output_format: "mp3_44100",
        client_request_id: randomUUID()
      })
    });
    const audioUrl = tts?.data?.audio_url || tts?.audio_url;
    res.json({ transcript, reply, audio: audioUrl || null });
  } catch (error) {
    console.error("KABU voice turn failed:", error?.status || "network", error?.message);
    const status = error?.status === 402 ? 402 : error?.status === 429 ? 429 : 502;
    res.status(status).json({
      error: status === 402
        ? "የካቡ የድምጺ ክሬዲት ኣኺሉ። ኣብ Addis AI ሕሳብ ክሬዲት ኣረጋግጽ።"
        : status === 429
          ? "ኣገልግሎቱ ኣብዚ ግዜ ብዙሕ ስራሕ ኣለዎ። ዳግማይ ፈትን።"
          : "ካቡ ኣብዚ ግዜ ክምልስ ኣይከኣለን። እንደገና ፈትን።"
    });
  }
});

app.use(express.static(path.join(root, "dist"), { index: "index.html" }));
app.get("/{*splat}", (_req, res) => res.sendFile(path.join(root, "dist", "index.html")));
app.use((error, _req, res, _next) => {
  console.error("KABU request error:", error.message);
  res.status(error.code === "LIMIT_FILE_SIZE" ? 413 : 400).json({
    error: error.code === "LIMIT_FILE_SIZE" ? "ድምጺ ኣዝዩ ነዊሕ እዩ። ክሳብ 20 ሰከንድ ጥራይ ተዛረብ።" : error.message
  });
});

app.listen(PORT, "0.0.0.0", () => console.log(`KABU AI listening on ${PORT}`));
