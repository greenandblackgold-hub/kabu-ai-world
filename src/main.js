import "./style.css";

const app = document.querySelector("#app");
app.innerHTML = `
  <main class="scene">
    <header class="topbar">
      <div class="brand"><span class="brand-dot"></span><span>KABU AI</span></div>
      <span class="language">ትግርኛ · Tigrinya</span>
    </header>
    <section class="welcome">
      <p class="eyebrow">የካቡ የመጫወቻ ዓለም</p>
      <h1>ሰላም! ካቡ እዚ ኣሎ።</h1>
      <p class="sub">እንታይ ክንጻወት?</p>
    </section>
    <section class="play-area" aria-label="Kabu character">
      <div class="sparkle sparkle-one">✦</div><div class="sparkle sparkle-two">✧</div>
      <button class="kabu-character" id="kabu" type="button" aria-label="ካቡ ሰላምታ ይህብ">
        <svg class="kabu-art" viewBox="0 0 360 400" role="img" aria-label="ወፍራም ቀይ ጸጉራም ካቡ፣ ቦርጫም ሆድ፣ ክልተ ኣእዳውን ክልተ ኣእጋርን" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="kabuRed" cx="32%" cy="23%" r="78%"><stop offset="0" stop-color="#ff8580"/><stop offset=".38" stop-color="#fa2935"/><stop offset=".78" stop-color="#e50925"/><stop offset="1" stop-color="#a90020"/></radialGradient>
            <radialGradient id="kabuBelly" cx="48%" cy="28%" r="75%"><stop offset="0" stop-color="#ff6860"/><stop offset=".7" stop-color="#f32432"/><stop offset="1" stop-color="#cf001f"/></radialGradient>
            <linearGradient id="kabuLimb" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ff7770"/><stop offset=".45" stop-color="#f21b2d"/><stop offset="1" stop-color="#b80022"/></linearGradient>
            <filter id="kabuFur" x="-12%" y="-12%" width="124%" height="124%"><feTurbulence type="fractalNoise" baseFrequency=".075" numOctaves="2" seed="8" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G"/></filter>
            <pattern id="furLines" width="13" height="15" patternUnits="userSpaceOnUse"><path d="M2 2l-1 5m7-4l-1 6m5-2l-2 6" stroke="#8d001b" stroke-opacity=".32" stroke-width="1.2" stroke-linecap="round"/><path d="M4 10l1 3m6-11l1 3" stroke="#ffb1a4" stroke-opacity=".6" stroke-width="1" stroke-linecap="round"/></pattern>
            <clipPath id="bodyClip"><path d="M180 66C125 66 82 91 65 137C45 190 55 273 82 313C104 346 142 356 180 356C218 356 256 346 278 313C305 273 315 190 295 137C278 91 235 66 180 66Z"/></clipPath>
          </defs>
          <ellipse cx="180" cy="378" rx="92" ry="12" fill="#8e2430" opacity=".13"/>
          <g class="kabu-leg leg-left"><path d="M125 298C118 323 119 348 124 367Q140 383 160 371L165 315Z" fill="url(#kabuLimb)" stroke="#b80021" stroke-width="2"/><path d="M121 357Q105 366 105 380Q125 392 160 381Q170 372 158 363Z" fill="url(#kabuLimb)"/><path d="M116 371l7 5m8-6l3 7m9-8l1 7" stroke="#ff9b8e" stroke-width="2" stroke-linecap="round"/></g>
          <g class="kabu-leg leg-right"><path d="M195 315L200 367Q220 383 236 367C241 348 242 323 235 298Z" fill="url(#kabuLimb)" stroke="#b80021" stroke-width="2"/><path d="M202 363Q190 372 202 381Q237 392 255 380Q255 366 235 357Z" fill="url(#kabuLimb)"/><path d="M205 371l1 7m12-8l3 7m11-7l5 6" stroke="#ff9b8e" stroke-width="2" stroke-linecap="round"/></g>
          <g class="kabu-arm arm-left"><path d="M91 169C64 160 43 173 34 196C25 219 34 237 54 237C76 235 89 214 106 201Z" fill="url(#kabuLimb)" stroke="#bd001f" stroke-width="3"/><path d="M39 210Q20 208 17 226Q19 245 38 247Q52 248 57 233Z" fill="url(#kabuLimb)"/><path d="M25 224l-9-8m12 20l-11 1m24 4l-2 9" stroke="#ff9b8e" stroke-width="5" stroke-linecap="round"/></g>
          <g class="kabu-arm arm-right"><path d="M269 169C296 160 317 173 326 196C335 219 326 237 306 237C284 235 271 214 254 201Z" fill="url(#kabuLimb)" stroke="#bd001f" stroke-width="3"/><path d="M321 210Q340 208 343 226Q341 245 322 247Q308 248 303 233Z" fill="url(#kabuLimb)"/><path d="M335 224l9-8m-12 20l11 1m-24 4l2 9" stroke="#ff9b8e" stroke-width="5" stroke-linecap="round"/></g>
          <g class="kabu-torso" filter="url(#kabuFur)">
            <path d="M180 66C125 66 82 91 65 137C45 190 55 273 82 313C104 346 142 356 180 356C218 356 256 346 278 313C305 273 315 190 295 137C278 91 235 66 180 66Z" fill="url(#kabuRed)" stroke="#bd001f" stroke-width="3"/>
            <g clip-path="url(#bodyClip)"><rect x="45" y="60" width="270" height="305" fill="url(#furLines)"/><ellipse cx="180" cy="263" rx="93" ry="83" fill="url(#kabuBelly)" opacity=".48"/><path d="M104 108q-14 14-17 36m168-35q15 18 17 36M82 260q-2 22 7 39m180-39q2 22-7 39" fill="none" stroke="#ffaaa0" stroke-opacity=".7" stroke-width="5" stroke-linecap="round"/></g>
            <path d="M112 104q-9-15-15 1m38-27q-4-17-13-6m65-9q-1-17-12-8m53 17q7-17 15-4m39 33q13-12 17 3M67 169q-16 4-10 17m236-17q16 4 10 17M74 290q-13 13 0 21m212-21q13 13 0 21" fill="none" stroke="#ff8a82" stroke-width="4" stroke-linecap="round"/>
          </g>
          <g class="kabu-face">
            <ellipse cx="139" cy="185" rx="10" ry="14" fill="#4b1e2b"/><ellipse cx="221" cy="185" rx="10" ry="14" fill="#4b1e2b"/>
            <circle cx="142" cy="180" r="3" fill="#fff"/><circle cx="224" cy="180" r="3" fill="#fff"/>
            <ellipse cx="111" cy="218" rx="16" ry="8" fill="#ffaaa2" opacity=".72"/><ellipse cx="249" cy="218" rx="16" ry="8" fill="#ffaaa2" opacity=".72"/>
            <path class="mouth-smile" d="M158 222Q180 242 202 222" fill="none" stroke="#54202d" stroke-width="6" stroke-linecap="round"/>
            <ellipse class="mouth-open" cx="180" cy="229" rx="16" ry="4" fill="#641327"/>
            <path d="M166 231Q180 238 194 231" fill="#ff9b9b"/>
          </g>
        </svg>
      </button>
    </section>
    <section class="interaction">
      <p id="kabu-message" class="message" aria-live="polite">ሰላም ካቡየ፣ ደሓን ዲኻ?</p>
      <div id="transcript" class="transcript" aria-live="polite"></div>
      <form id="text-form" class="text-form">
        <input id="child-text" class="child-input" type="text" maxlength="240" autocomplete="off" placeholder="ካቡ እንታይ ክትብሎ ትደሊ?" aria-label="ንካቡ መልእኽቲ ጽሓፍ">
        <button class="send-button" type="submit">ስደድ</button>
      </form>
      <button id="listen" class="listen-button" type="button"><span class="mic">🎤</span><span id="button-label">ካቡ፡ ስምዓኒ!</span></button>
      <p id="status" class="status">ካቡ ሰላምታ ይህበካ ኣሎ። ድምጹ እንተዘይተሰሚዑ ካቡ ጠውቕ።</p>
      <button id="reset" class="reset-button" type="button">ዕላል ኣሕድስ</button>
    </section>
    <footer>ብፍቕሪ ንካቡ · KABU AI</footer>
  </main>`;


const listenButton = document.querySelector("#listen");
const buttonLabel = document.querySelector("#button-label");
const status = document.querySelector("#status");
const message = document.querySelector("#kabu-message");
const transcript = document.querySelector("#transcript");
const balloon = document.querySelector("#kabu");
const resetButton = document.querySelector("#reset");
const textForm = document.querySelector("#text-form");
const textInput = document.querySelector("#child-text");
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
let listening = false;
let history = [];
let busy = false;
let voices = [];

function setStatus(value) { status.textContent = value; }
function setTalking(value) {
  balloon.classList.toggle("talking", value);
}
function refreshVoices() {
  voices = window.speechSynthesis ? speechSynthesis.getVoices() : [];
}
if ("speechSynthesis" in window) {
  refreshVoices();
  speechSynthesis.onvoiceschanged = refreshVoices;
}
let kabuAudio = null;
async function speak(text) {
  if (kabuAudio) { kabuAudio.pause(); kabuAudio = null; }
  if ("speechSynthesis" in window) speechSynthesis.cancel();
  setTalking(true);
  balloon.classList.add("waving");
  try {
    const response = await fetch("/api/speech", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: String(text || "").slice(0, 500) })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.audio) throw new Error("speech_unavailable");
    const audioBytes = Uint8Array.from(atob(data.audio), ch => ch.charCodeAt(0));
    const audioBlob = new Blob([audioBytes], { type: data.mimeType || "audio/wav" });
    kabuAudio = new Audio(URL.createObjectURL(audioBlob));
    kabuAudio.onended = () => { setTalking(false); balloon.classList.remove("waving"); };
    kabuAudio.onerror = () => { setTalking(false); balloon.classList.remove("waving"); setStatus("ድምጺ ካቡ ኣይተሰምዐን። እንደገና ፈትን።"); };
    await kabuAudio.play();
  } catch {
    setTalking(false);
    balloon.classList.remove("waving");
    setStatus("ድምጺ ካቡ ንግዚኡ ኣይተሳኸዐን። ጽሑፍ ግን ይሰርሕ።");
  }
}
async function respond(raw) {
  const text = String(raw || "").trim();
  if (!text || busy) return;
  busy = true;
  balloon.classList.add("thinking");
  transcript.textContent = "ንስኻ፡ " + text;
  message.textContent = "ካቡ ይሓስብ ኣሎ…";
  setStatus("ካቡ መልሲ የዳሉ ኣሎ።");
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, history: history.slice(-10) })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const errorText = response.status === 503
        ? "ካቡ ናይ AI መፍትሕ ክሳብ ዝተቐናበረ ኣይተኣሳሰረን። በጃኻ ንወላዲ ንገር።"
        : response.status === 429
          ? "ካቡ ብዙሕ ሕቶታት ተቐቢሉ ኣሎ። ቁሩብ ጽናሕ እሞ ደጊምካ ፈትን።"
          : "ካቡ ሕጂ መልሲ ክህብ ኣይከኣለን። ቁሩብ ጸኒሕካ ደጊምካ ፈትን።";
      message.textContent = errorText;
      setStatus("AI ኣገልግሎት ንግዚኡ ኣይሰርሕን ኣሎ።");
      return;
    }
    const reply = String(data.reply || "").trim();
    if (!reply) throw new Error("Empty AI response");
    history.push({ role: "user", content: text }, { role: "assistant", content: reply });
    history = history.slice(-12);
    message.textContent = reply;
    setStatus("ካቡ ብAI መልሲ ሂቡካ ኣሎ።");
    speak(reply);
  } catch {
    message.textContent = "ካቡ ሕጂ ክሰርሕ ኣይከኣለን። እንደገና ፈትን።";
    setStatus("ናይ ኢንተርነት ወይ AI ጸገም ኣሎ።");
  } finally {
    balloon.classList.remove("thinking");
    busy = false;
  }
}
function stopListening() {
  if (recognition && listening) {
    try { recognition.stop(); } catch {}
  }
  listening = false;
  listenButton.classList.remove("recording");
  buttonLabel.textContent = "ካቡ፡ ስምዓኒ!";
}
listenButton.addEventListener("click", () => {
  if (!SpeechRecognition) {
    setStatus("እዚ Chrome ናይ ድምጺ ምርዳእ ኣይድግፍን። ኣብ ታሕቲ ብጽሑፍ ስደድ።");
    textInput.focus();
    return;
  }
  if (listening) { stopListening(); return; }
  try {
    recognition = new SpeechRecognition();
    recognition.lang = "ti-ER";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => {
      listening = true;
      listenButton.classList.add("recording");
      buttonLabel.textContent = "ይሰምዕ ኣሎ…";
      setStatus("ካቡ ይሰምዕ ኣሎ። ሕጂ ተዛረብ።");
    };
    recognition.onresult = event => {
      const heard = event.results?.[0]?.[0]?.transcript || "";
      stopListening();
      if (heard.trim()) respond(heard);
      else setStatus("ድምጽኻ ኣይተረድአን። እንደገና ፈትን ወይ ጽሓፍ።");
    };
    recognition.onerror = event => {
      stopListening();
      const msg = event.error === "not-allowed"
        ? "ማይክሮፎን ፍቓድ ኣይተዋህበን። ኣብ Chrome ፍቓድ ሃብ።"
        : "ናይ ድምጺ ምርዳእ ኣይተሳኸዐን። ትግርኛ ኣብ ዚ መሳርሒ ክድገፍ ኣይክእልን ይኸውን። ብጽሑፍ ፈትን።";
      setStatus(msg);
    };
    recognition.onend = () => stopListening();
    recognition.start();
  } catch {
    stopListening();
    setStatus("ማይክሮፎን ኣይተኸፍተን። ብጽሑፍ ፈትን።");
  }
});
textForm.addEventListener("submit", event => {
  event.preventDefault();
  const value = textInput.value;
  if (!value.trim()) return;
  textInput.value = "";
  respond(value);
});
balloon.addEventListener("click", () => {
  balloon.classList.add("waving");
  speak("ሰላም ካቡየ፣ ደሓን ዲኻ?");
});
window.addEventListener("load", () => {
  balloon.classList.add("waving");
  setTimeout(() => balloon.classList.remove("waving"), 2400);
  setStatus("ካቡ ድሉው እዩ። ማይክሮፎን ወይ ጽሑፍ ተጠቐም። እዚ ስሪት ብነጻ ኣብ ብራውዘር ይሰርሕ።");
  setStatus("ካቡ ድሉው እዩ። ካቡ ጠውቕ እሞ ብድምጺ ሰላም ክብለካ እዩ።");
});
resetButton.addEventListener("click", () => {
  if (listening) stopListening();
  history = [];
  transcript.textContent = "";
  message.textContent = "ሰላም! ካቡ እዚ ኣሎ።";
  setStatus("ሓድሽ ዕላል ተጀሚሩ።");
  if (window.speechSynthesis) speechSynthesis.cancel();
  if (kabuAudio) { kabuAudio.pause(); kabuAudio = null; }
  setTalking(false);
});
