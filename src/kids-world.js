import "./kids-world.css";

export function mountKidsWorld() {
  const topbar = document.querySelector(".topbar");
  const scene = document.querySelector(".scene");
  if (!topbar || !scene || document.querySelector("#kids-world-launch")) return;

  const launch = document.createElement("button");
  launch.id = "kids-world-launch";
  launch.className = "kids-world-launch";
  launch.type = "button";
  launch.textContent = "🎬 የካቡ ካርቱን ዓለም";
  topbar.append(launch);
  launch.hidden = true;

  const world = document.createElement("section");
  world.id = "kids-world";
  world.className = "kids-world";
  world.hidden = false;
  world.setAttribute("aria-label", "የካቡ የልጆች ካርቱን መጫወቻ ዓለም");
  world.innerHTML = `
    <header class="kw-head">
      <div><p class="kw-kicker">KABU'S CARTOON ADVENTURE</p><h2>🌈 ናብ ኣስደናቒት ዓለም ካቡ ብደሓን መጻእካ!</h2><p>ታሪኽ ምረጽ፣ ኣዕሩኽካ ኣንቀሳቕስ፣ ብሓባር ተጻወት!</p></div>
      <button class="kw-close" type="button" aria-label="ዕጸው">✕</button>
    </header>
    <nav class="kw-story-tabs" aria-label="ትዕይንቲ ምረጽ">
      <button type="button" data-scene="town" class="active">🏡 ከተማ</button>
      <button type="button" data-scene="forest">🌳 ጫካ</button>
      <button type="button" data-scene="beach">🏖️ ባሕሪ</button>
    </nav>
    <div class="kw-stage kw-town" role="img" aria-label="ተንቀሳቓሲ ካርቱን ትዕይንቲ">
      <div class="kw-sun">☀️</div><div class="kw-rainbow">🌈</div>
      <div class="kw-cloud kw-cloud-a">☁️</div><div class="kw-cloud kw-cloud-b">☁️</div>
      <div class="kw-birds">🐦　🦋　🐦</div>
      <div class="kw-backdrop"><i></i><i></i><i></i><i></i><i></i></div>
      <div class="kw-road"><span class="kw-car kw-car-one">🚗</span><span class="kw-car kw-car-two">🚙</span><span class="kw-road-dashes"></span></div>
      <div class="kw-hills"><span></span><span></span></div>
      <div class="kw-characters">
        <button class="kw-character kw-dog" type="button" data-friend="dog" aria-label="ቦቢ ውሻ ኣዘራርብ">
          <span class="kw-bubble">ሰላም!</span>
          <svg viewBox="0 0 180 190" aria-hidden="true">
            <ellipse cx="90" cy="177" rx="48" ry="7" fill="#456c3c" opacity=".22"/>
            <g class="kw-dog-body"><path d="M49 72Q10 34 25 111Q33 139 59 117Z" fill="#94512e" stroke="#65351f" stroke-width="4"/><path d="M131 72Q170 34 155 111Q147 139 121 117Z" fill="#94512e" stroke="#65351f" stroke-width="4"/><ellipse cx="90" cy="112" rx="62" ry="57" fill="#d98c4c" stroke="#8b4a27" stroke-width="4"/><ellipse cx="90" cy="135" rx="37" ry="25" fill="#ffe0ae"/><path d="M51 151q-11 22-25 8m103-8q11 22 25 8" fill="none" stroke="#8b4a27" stroke-width="10" stroke-linecap="round"/></g>
            <g class="kw-dog-face"><ellipse cx="68" cy="103" rx="7" ry="10" fill="#34251f"/><ellipse cx="112" cy="103" rx="7" ry="10" fill="#34251f"/><circle cx="70" cy="100" r="2.5" fill="white"/><circle cx="114" cy="100" r="2.5" fill="white"/><ellipse cx="90" cy="124" rx="10" ry="7" fill="#34251f"/><path d="M90 131q-1 12-13 11m13-11q1 12 13 11" fill="none" stroke="#68351f" stroke-width="3" stroke-linecap="round"/><ellipse class="kw-mouth" cx="90" cy="145" rx="8" ry="3" fill="#9b263e"/></g>
          </svg><b>🐶 ቦቢ</b><small>ጠውቐኒ!</small>
        </button>
        <button class="kw-character kw-horse" type="button" data-friend="horse" aria-label="ሮሚ ፈረስ ኣዘራርብ">
          <span class="kw-bubble">እየ እጎዪ!</span>
          <svg viewBox="0 0 180 190" aria-hidden="true">
            <ellipse cx="90" cy="177" rx="49" ry="7" fill="#456c3c" opacity=".22"/>
            <g class="kw-horse-body"><path d="M53 83Q24 61 25 110Q30 136 62 123M127 83Q156 61 155 110Q150 136 118 123" fill="#a85d36" stroke="#68351f" stroke-width="4"/><path d="M43 105Q37 68 67 54Q95 39 125 58Q151 77 137 128L124 155Q90 170 58 151Z" fill="#b96d3d" stroke="#713c27" stroke-width="4"/><path d="M58 65Q43 23 79 38Q103 8 116 48Q145 29 137 73Q119 64 109 80Q85 65 58 83Z" fill="#3d2929"/><path d="M67 153l-8 17m57-17l9 17" stroke="#713c27" stroke-width="10" stroke-linecap="round"/></g>
            <g class="kw-horse-face"><ellipse cx="75" cy="99" rx="6" ry="9" fill="#2b201c"/><ellipse cx="116" cy="99" rx="6" ry="9" fill="#2b201c"/><circle cx="77" cy="96" r="2.5" fill="white"/><circle cx="118" cy="96" r="2.5" fill="white"/><ellipse cx="96" cy="132" rx="29" ry="19" fill="#e9b17f"/><ellipse cx="85" cy="132" rx="3" ry="4" fill="#59352a"/><ellipse cx="107" cy="132" rx="3" ry="4" fill="#59352a"/><ellipse class="kw-mouth" cx="96" cy="146" rx="7" ry="2.5" fill="#7b2830"/></g>
          </svg><b>🐴 ሮሚ</b><small>ጠውቐኒ!</small>
        </button>
      </div>
      <div class="kw-flowers">🌼　🌷　🌻　🌼　🌷</div>
      <div class="kw-star-layer" aria-label="ኮኾብ ኣክብ"></div>
    </div>
    <div class="kw-story-caption" aria-live="polite"><span class="kw-caption-icon">✨</span><span id="kw-message">ቦቢን ሮሚን ክትላለዮም ድሉው ዲኻ?</span></div>
    <div class="kw-controls">
      <button type="button" data-action="story">▶️ ታሪኽ ጀምር</button>
      <button type="button" data-action="dog">🐶 ቦቢ ኣዘራርብ</button>
      <button type="button" data-action="horse">🐴 ሮሚ ኣንቀሳቕስ</button>
      <button type="button" data-action="dance">💃 ሓቢርና ንስዕስዕ</button>
      <button type="button" data-action="stars">⭐ ኮኾብ ኣክብ</button>
    </div>
    <footer class="kw-footer"><span>ካቡ ኩሉ ግዜ ምሳኻ እዩ! 💛</span><strong id="kw-score">⭐ 0</strong></footer>
  `;
  scene.insertBefore(world, scene.querySelector(".welcome"));

  const message = world.querySelector("#kw-message");
  const score = world.querySelector("#kw-score");
  const stage = world.querySelector(".kw-stage");
  const starLayer = world.querySelector(".kw-star-layer");
  let points = 0, starTimer = null, storyTimer = null, audio = null, storyStep = 0;

  async function speak(line) {
    message.textContent = line;
    if (audio) { audio.pause(); audio = null; }
    if ("speechSynthesis" in window) speechSynthesis.cancel();
    world.classList.add("kw-speaking");
    try {
      const response = await fetch("/api/speech", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: line.slice(0, 240) }) });
      const data = await response.json();
      if (!response.ok || !data.audio) throw new Error("speech unavailable");
      const bytes = Uint8Array.from(atob(data.audio), c => c.charCodeAt(0));
      const url = URL.createObjectURL(new Blob([bytes], { type: data.mimeType || "audio/wav" }));
      audio = new Audio(url);
      audio.onended = () => { world.classList.remove("kw-speaking"); URL.revokeObjectURL(url); };
      await audio.play();
    } catch {
      world.classList.remove("kw-speaking");
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(line);
        utterance.lang = "ti-ER";
        speechSynthesis.speak(utterance);
      }
    }
  }

  function stopStory() { clearInterval(storyTimer); storyTimer = null; }
  function changeScene(name) {
    stage.classList.remove("kw-town", "kw-forest", "kw-beach");
    stage.classList.add("kw-" + name);
    world.querySelectorAll("[data-scene]").forEach(b => b.classList.toggle("active", b.dataset.scene === name));
    const lines = { town: "ኣብ ከተማ ካቡ ብዙሕ ዝገርም ነገር ኣሎ!", forest: "ዋው! ኣብ ሓምለዋይ ጫካ ኣብ መንጎ እንስሳታት ኢና!", beach: "ይሕ! ኣብ ገምገም ባሕሪ ንጻወት ኣለና!" };
    speak(lines[name]);
  }
  function startStory() {
    stopStory();
    const scenes = [
      ["town", "ሓደ መዓልቲ ቦቢ ውሻን ሮሚ ፈረስን ኣብ ከተማ ካቡ ተራኸቡ።"],
      ["forest", "እቶም ክልተ ኣዕሩኽ ኣብ ጫካ ኮኾብ ክደልዩ ከዱ።"],
      ["beach", "ኮኾብ ረኸቡ! ኣብ ባሕሪ ደስ ኢልዎም ሳዕስዑ።"]
    ];
    storyStep = 0;
    const next = () => {
      const [place, line] = scenes[storyStep];
      stage.classList.remove("kw-dancing");
      changeScene(place);
      speak(line);
      if (storyStep === 2) {
        world.querySelector(".kw-dog").classList.add("kw-jumping");
        world.querySelector(".kw-horse").classList.add("kw-jumping");
      }
      storyStep += 1;
      if (storyStep >= scenes.length) { stopStory(); message.textContent = "ታሪኽና ብደስታ ተዛዚሙ! ኣብ ካልእ ግዜ እንደገና ንጻወት! 🎉"; }
    };
    next();
    storyTimer = setInterval(() => { if (storyStep < scenes.length) next(); else stopStory(); }, 6500);
  }
  function runStars() {
    starLayer.innerHTML = "";
    clearInterval(starTimer);
    message.textContent = "ኮኾባት ጠውቕ እሞ ኣክብ! ⭐";
    const add = () => {
      const star = document.createElement("button");
      star.type = "button"; star.className = "kw-floating-star"; star.textContent = "⭐";
      star.style.left = (8 + Math.random() * 82) + "%";
      star.style.top = (8 + Math.random() * 68) + "%";
      star.setAttribute("aria-label", "ኮኾብ ኣክብ");
      star.addEventListener("click", () => {
        points += 1; score.textContent = "⭐ " + points; star.remove();
        message.textContent = "ብሉጽ! ኮኾብ ኣኪብካ! 🎉";
        if (!starLayer.children.length) for (let i = 0; i < 5; i++) add();
      });
      starLayer.append(star);
    };
    for (let i = 0; i < 5; i++) add();
    starTimer = setInterval(() => { if (starLayer.children.length < 5) add(); }, 1800);
  }

  world.querySelector(".kw-close").addEventListener("click", () => {
    world.hidden = true; launch.hidden = false; stopStory(); clearInterval(starTimer);
    if (audio) audio.pause();
    if ("speechSynthesis" in window) speechSynthesis.cancel();
    world.classList.remove("kw-speaking");
  });
  launch.addEventListener("click", () => {
    world.hidden = false; launch.hidden = true;
    speak("ሰላም ካቡየ! ናብ ካርቱን ዓለምና ብደሓን መጻእካ!");
  });
  world.querySelectorAll("[data-scene]").forEach(button => button.addEventListener("click", () => { stopStory(); changeScene(button.dataset.scene); }));
  world.querySelectorAll("[data-friend]").forEach(button => button.addEventListener("click", () => {
    button.classList.remove("kw-jumping"); void button.offsetWidth; button.classList.add("kw-jumping");
    if (button.dataset.friend === "dog") speak("ሰላም ካቡየ! ኣነ ቦቢ ውሻ እየ። ዋው ዋው! ክንጻወት ዲና?");
    else speak("ሰላም ካቡ! ኣነ ሮሚ ፈረስ እየ። እየ እጎዪ ኣለኹ! ምሳይ ክትመጽእ ዲኻ?");
  }));
  world.querySelectorAll("[data-action]").forEach(button => button.addEventListener("click", () => {
    const action = button.dataset.action;
    if (action === "story") startStory();
    if (action === "dog") world.querySelector('[data-friend="dog"]').click();
    if (action === "horse") world.querySelector('[data-friend="horse"]').click();
    if (action === "dance") {
      stopStory(); stage.classList.toggle("kw-dancing");
      world.querySelectorAll(".kw-character").forEach(el => { el.classList.remove("kw-jumping"); void el.offsetWidth; el.classList.add("kw-jumping"); });
      speak("ሓቢርና ንስዕስዕ! ኣንደ ሁለት ሰለስተ! 💃");
    }
    if (action === "stars") runStars();
  }));
}
