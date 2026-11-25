import "./style.css";

const app = document.querySelector("#app");

app.innerHTML = `
  <main class="scene">
    <header class="topbar">
      <div class="brand"><span class="brand-dot"></span><span>KABU AI</span></div>
      <span class="language">ትግርኛ · Tigrinya</span>
    </header>
    <section class="welcome" aria-labelledby="greeting">
      <p class="eyebrow">የካቡ የመጫወቻ ዓለም</p>
      <h1 id="greeting">ሰላም! ካቡ እዚ ኣሎ።</h1>
      <p class="sub">እንታይ ክንጻወት?</p>
    </section>
    <section class="play-area" aria-label="Kabu character">
      <div class="sparkle sparkle-one">✦</div>
      <div class="sparkle sparkle-two">✧</div>
      <div class="balloon" role="img" aria-label="A big happy red balloon named Kabu">
        <div class="shine"></div>
        <div class="face">
          <span class="eye"></span><span class="eye"></span>
          <span class="cheek cheek-left"></span><span class="cheek cheek-right"></span>
          <span class="smile"></span>
        </div>
      </div>
      <div class="string"></div><div class="floor-shadow"></div>
    </section>
    <section class="interaction">
      <p id="kabu-message" class="message" aria-live="polite">ካቡ ክሰምዓካ ድሉው እዩ!</p>
      <button id="listen" class="listen-button" type="button"><span class="mic">🎤</span><span>ካቡ፡ ስምዓኒ!</span></button>
      <p id="status" class="status">ማይክሮፎን ገና ኣይተኸፍተን።</p>
    </section>
    <footer>ብፍቕሪ ንካቡ · KABU AI</footer>
  </main>
`;

const listenButton = document.querySelector("#listen");
const status = document.querySelector("#status");
const message = document.querySelector("#kabu-message");

// Tigrinya recognition is not assumed: browser speech engines vary by platform.
listenButton.addEventListener("click", () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    status.textContent = "ኣብዚ መሳርሒ ድምጺ ምስማዕ ኣይድገፍን።";
    message.textContent = "ካቡ ገና ክሰምዓካ ይመሃር ኣሎ!";
    return;
  }
  status.textContent = "ትግርኛ ምስማዕ ኣብዚ ስሪት ገና ኣይተረጋገጸን።";
  message.textContent = "ካቡ ብትኽክል ክሰምዓካ ኣብ ስራሕ ኣሎ!";
});
