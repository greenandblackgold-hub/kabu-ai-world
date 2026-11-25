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
        <span class="kabu-arm arm-left"><span class="kabu-hand"></span></span>
        <span class="kabu-arm arm-right"><span class="kabu-hand"></span></span>
        <span class="kabu-body"><span class="fur-shine"></span>
          <span class="kabu-face"><i class="eye"></i><i class="eye"></i><i class="cheek cheek-left"></i><i class="cheek cheek-right"></i><i class="smile"></i></span>
        </span>
        <span class="kabu-leg leg-left"><i class="kabu-foot"></i></span><span class="kabu-leg leg-right"><i class="kabu-foot"></i></span>
      </button><div class="floor-shadow"></div>
    </section>
    <section class="interaction">
      <p id="kabu-message" class="message" aria-live="polite">ሰላም ካቡየ፣ ደሓን ዲኻ?</p>
      <div id="transcript" class="transcript" aria-live="polite"></div>
      <button id="listen" class="listen-button" type="button"><span class="mic">🎤</span><span id="button-label">ካቡ፡ ስምዓኒ!</span></button>
      <p id="status" class="status">ንምጅማር ኣብቲ ማይክሮፎን ጠውቕ።</p>
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
let greetingAudio = null;
let recorder = null;
let stream = null;
let chunks = [];
let recordingTimer = null;
let busy = false;
let history = [];
let currentAudio = null;

const setStatus = (text) => { status.textContent = text; };
const setBusy = (value) => {
  busy = value;
  listenButton.disabled = value;
  listenButton.classList.toggle("working", value);
};
const stopTracks = () => {
  if (stream) stream.getTracks().forEach((track) => track.stop());
  stream = null;
};
const stopRecording = () => {
  if (recordingTimer) clearTimeout(recordingTimer);
  recordingTimer = null;
  if (recorder && recorder.state === "recording") recorder.stop();
};

listenButton.addEventListener("click", async () => {
  if (busy) return;
  playGreetingIfReady();
  if (recorder?.state === "recording") {
    stopRecording();
    return;
  }
  try {
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      throw new Error("እዚ ብራውዘር ማይክሮፎን ኣይድግፍን። Chrome ኣብ HTTPS ክፈት።");
    }
    stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      video: false
    });
    const mimeType = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"].find((type) => MediaRecorder.isTypeSupported(type));
    recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
    chunks = [];
    recorder.ondataavailable = (event) => { if (event.data?.size) chunks.push(event.data); };
    recorder.onerror = () => {
      stopTracks();
      setStatus("ማይክሮፎን ኣብ ምጥቃም ጸገም ተፈጢሩ። እንደገና ፈትን።");
      listenButton.classList.remove("recording");
      buttonLabel.textContent = "ካቡ፡ ስምዓኒ!";
    };
    recorder.onstop = async () => {
      stopTracks();
      listenButton.classList.remove("recording");
      buttonLabel.textContent = "ካቡ፡ ስምዓኒ!";
      const audioBlob = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
      if (!audioBlob.size) { setStatus("ድምጺ ኣይተቐርጸን። እንደገና ፈትን።"); return; }
      await sendVoice(audioBlob);
    };
    recorder.start(250);
    listenButton.classList.add("recording");
    buttonLabel.textContent = "ደው ኣብል";
    setStatus("ካቡ ይሰምዕ ኣሎ… ምስ ወዳእካ ደጊምካ ጠውቕ።");
    recordingTimer = setTimeout(stopRecording, 20000);
  } catch (error) {
    stopTracks();
    setStatus(error.message || "ማይክሮፎን ኣይተኸፍተን። ፍቓድ ሃብ።");
  }
});

async function sendVoice(blob) {
  setBusy(true);
  balloon.classList.add("thinking");
  message.textContent = "ካቡ ይሓስብ ኣሎ…";
  setStatus("ድምጽኻ እናተረድአ እዩ። ቁሩብ ተጸበ።");
  try {
    const form = new FormData();
    const extension = blob.type.includes("mp4") ? "m4a" : "webm";
    form.append("audio", blob, `kabu-voice.${extension}`);
    form.append("history", JSON.stringify(history.slice(-8)));
    const response = await fetch("/api/voice-turn", { method: "POST", body: form });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || "ካቡ ኣብዚ ግዜ ክምልስ ኣይከኣለን።");
    transcript.textContent = result.transcript ? "ንስኻ፡ " + result.transcript : "";
    message.textContent = result.reply;
    history.push({ role: "user", content: result.transcript }, { role: "assistant", content: result.reply });
    history = history.slice(-8);
    if (result.audio) {
      if (currentAudio) { currentAudio.pause(); URL.revokeObjectURL(currentAudio.src); }
      currentAudio = new Audio(result.audio);
      currentAudio.onplay = () => balloon.classList.add("talking");
      currentAudio.onended = () => balloon.classList.remove("talking");
      currentAudio.onerror = () => balloon.classList.remove("talking");
      await currentAudio.play();
    }
    setStatus("ካቡ መልሲ ሂቡካ ኣሎ። እንደገና ክትዛረብ ትኽእል ኢኻ።");
  } catch (error) {
    message.textContent = "ካቡ ኣብዚ ግዜ ኣይሰምዓካን።";
    setStatus(error.message || "ጸገም ተፈጢሩ። እንደገና ፈትን።");
  } finally {
    balloon.classList.remove("thinking");
    setBusy(false);
  }
}

async function loadGreeting() {
  try {
    const response = await fetch("/api/greeting");
    if (!response.ok) return;
    const data = await response.json();
    if (data.audio) { greetingAudio = new Audio(data.audio); greetingAudio.preload = "auto"; playGreetingIfReady(); }
  } catch { /* Greeting animation remains available if audio is not configured. */ }
}
function playGreetingIfReady() {
  if (!greetingAudio) return;
  greetingAudio.currentTime = 0;
  greetingAudio.play().then(() => {
    balloon.classList.add("talking", "waving");
    greetingAudio.onended = () => balloon.classList.remove("talking", "waving");
  }).catch(() => { /* Chrome may require a click before playing sound. */ });
}
balloon.addEventListener("click", () => { balloon.classList.add("waving"); playGreetingIfReady(); });
window.addEventListener("DOMContentLoaded", () => { balloon.classList.add("waving"); setTimeout(() => balloon.classList.remove("waving"), 2400); });
loadGreeting();

resetButton.addEventListener("click", () => {
  if (busy || recorder?.state === "recording") return;
  history = [];
  transcript.textContent = "";
  message.textContent = "ሰላም! ካቡ እዚ ኣሎ።";
  setStatus("ሓድሽ ዕላል ተጀሚሩ።");
  if (currentAudio) { currentAudio.pause(); URL.revokeObjectURL(currentAudio.src); currentAudio = null; }
});
