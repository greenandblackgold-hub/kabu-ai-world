import "./kids-world.css";

export function mountKidsWorld() {
  const topbar = document.querySelector(".topbar");
  if (!topbar || document.querySelector("#kids-world-launch")) return;

  const launch = document.createElement("button");
  launch.id = "kids-world-launch";
  launch.className = "kids-world-launch";
  launch.type = "button";
  launch.textContent = "🎠 ናብ መጫወቻ ዓለም";
  topbar.append(launch);

  const world = document.createElement("section");
  world.id = "kids-world";
  world.className = "kids-world";
  world.hidden = true;
  world.setAttribute("aria-label", "የካቡ የልጆች መጫወቻ ዓለም");
  world.innerHTML = `
    <div class="kw-head">
      <div><p class="kw-kicker">KABU'S LITTLE WORLD</p><h2>እንኳዕ ናብ ከተማ ካቡ ብደሓን መጻእካ! 🌈</h2><p>እንስሳታት ኣዕሩኽ ካቡ ኣለዉ። ጠውቕዎም እሞ ክዛረቡኻ እዮም!</p></div>
      <button class="kw-close" type="button" aria-label="ዕጸው">✕</button>
    </div>
    <div class="kw-city">
      <div class="kw-sun">☀️</div><div class="kw-cloud kw-cloud-a">☁️</div><div class="kw-cloud kw-cloud-b">☁️</div>
      <div class="kw-buildings"><i></i><i></i><i></i><i></i><i></i></div>
      <div class="kw-road"><span class="kw-car kw-car-red">🚗</span><span class="kw-car kw-car-blue">🚙</span><span class="kw-car kw-car-yellow">🚕</span><span class="kw-road-line"></span></div>
      <div class="kw-grass"></div>
      <div class="kw-friends">
        <button class="kw-friend kw-dog" type="button" data-friend="dog" aria-label="ውሻ ኣዕርኽ"><span class="kw-speech">ሰላም!</span>
          <svg viewBox="0 0 190 190" role="img" aria-label="ቡናዊ ፍቱው ውሻ">
            <ellipse cx="95" cy="174" rx="58" ry="9" fill="#6c7c46" opacity=".22"/>
            <path d="M48 65Q12 37 27 102Q35 130 60 112Z" fill="#9a552b" stroke="#68351f" stroke-width="4"/>
            <path d="M142 65Q178 37 163 102Q155 130 130 112Z" fill="#9a552b" stroke="#68351f" stroke-width="4"/>
            <ellipse cx="95" cy="112" rx="65" ry="58" fill="#d9904c" stroke="#8b4a27" stroke-width="4"/>
            <ellipse cx="95" cy="134" rx="38" ry="26" fill="#ffe0ae"/>
            <ellipse cx="72" cy="103" rx="7" ry="10" fill="#34251f"/><ellipse cx="118" cy="103" rx="7" ry="10" fill="#34251f"/>
            <circle cx="74" cy="100" r="2.5" fill="white"/><circle cx="120" cy="100" r="2.5" fill="white"/>
            <ellipse cx="95" cy="124" rx="10" ry="7" fill="#34251f"/><path d="M95 131q-1 12-13 11m13-11q1 12 13 11" fill="none" stroke="#68351f" stroke-width="3" stroke-linecap="round"/>
            <path d="M83 145Q95 160 107 145" fill="#ed7180"/><path d="M60 158q-12 18-24 7m94-7q12 18 24 7" fill="none" stroke="#8b4a27" stroke-width="9" stroke-linecap="round"/>
            <path d="M143 144q25-10 22-31" fill="none" stroke="#9a552b" stroke-width="8" stroke-linecap="round"/>
          </svg><b>🐶 ቦቢ ውሻ</b><small>ጠውቐኒ!</small></button>
        <button class="kw-friend kw-horse" type="button" data-friend="horse" aria-label="ፈረስ ኣዕርኽ"><span class="kw-speech">እየ እጎዪ!</span>
          <svg viewBox="0 0 190 190" role="img" aria-label="ዝሓምለ ጸጉሪ ዘለዎ ፈረስ">
            <ellipse cx="95" cy="174" rx="62" ry="9" fill="#6c7c46" opacity=".22"/>
            <path d="M58 87Q29 68 30 105Q34 129 65 121M123 89Q155 68 160 104Q157 129 128 121" fill="#a85d36" stroke="#68351f" stroke-width="4"/>
            <path d="M48 103Q40 69 68 54Q94 39 126 58Q151 77 139 126L126 155Q95 170 65 151Z" fill="#b96d3d" stroke="#713c27" stroke-width="4"/>
            <path d="M63 64Q48 23 82 38Q105 8 117 48Q146 29 138 73Q120 64 110 80Q87 65 63 83Z" fill="#3d2929"/>
            <ellipse cx="77" cy="99" rx="6" ry="9" fill="#2b201c"/><ellipse cx="119" cy="99" rx="6" ry="9" fill="#2b201c"/>
            <circle cx="79" cy="96" r="2.5" fill="white"/><circle cx="121" cy="96" r="2.5" fill="white"/>
            <ellipse cx="98" cy="132" rx="29" ry="19" fill="#e9b17f"/><ellipse cx="87" cy="132" rx="3" ry="4" fill="#59352a"/><ellipse cx="109" cy="132" rx="3" ry="4" fill="#59352a"/>
            <path d="M70 154l-7 16m57-16l8 16" stroke="#713c27" stroke-width="10" stroke-linecap="round"/>
          </svg><b>🐴 ሮሚ ፈረስ</b><small>ጠውቐኒ!</small></button>
      </div>
      <div class="kw-birds">🦋　🐦　🦋</div>
    </div>
    <div class="kw-controls">
      <button type="button" data-action="dog">🐶 ውሻ ኣዘራርብ</button>
      <button type="button" data-action="horse">🐴 ፈረስ ኣሕምል</button>
      <button type="button" data-action="cars">🚗 መኪናታት ኣንቀሳቕስ</button>
      <button type="button" data-action="stars">⭐ ኮኾብ ኣክብ</button>
    </div>
    <div class="kw-footer"><span id="kw-message" aria-live="polite">ካቡየ ካቡ! እንታይ ክንጻወት?</span><span id="kw-score">⭐ 0</span></div>
    <div class="kw-stars" aria-label="ኮኾብ ኣክብ"></div>
  `;
  document.querySelector(".scene").append(world);

  const message = world.querySelector("#kw-message");
  const score = world.querySelector("#kw-score");
  const starField = world.querySelector(".kw-stars");
  let points = 0;
  let starTimer = null;
  let activeAudio = null;

  async function speak(line) {
    message.textContent = line;
    if (activeAudio) { activeAudio.pause(); activeAudio = null; }
    try {
      const response = await fetch("/api/speech", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:line.slice(0,240)})});
      const data = await response.json();
      if (!response.ok || !data.audio) throw new Error("speech unavailable");
      const bytes = Uint8Array.from(atob(data.audio), c => c.charCodeAt(0));
      activeAudio = new Audio(URL.createObjectURL(new Blob([bytes],{type:data.mimeType||"audio/wav"})));
      await activeAudio.play();
    } catch {
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(line);
        utterance.lang = "ti-ER";
        speechSynthesis.cancel();
        speechSynthesis.speak(utterance);
      }
    }
  }

  function runStars() {
    starField.innerHTML = "";
    clearInterval(starTimer);
    message.textContent = "⭐ ኮኾባት ጠውቕ እሞ ኣክብ!";
    const makeStar = () => {
      const star = document.createElement("button");
      star.type = "button";
      star.className = "kw-floating-star";
      star.textContent = "⭐";
      star.style.left = (5 + Math.random()*88) + "%";
      star.style.top = (5 + Math.random()*75) + "%";
      star.addEventListener("click", () => {
        points += 1;
        score.textContent = "⭐ " + points;
        star.remove();
        message.textContent = "ደሓን ኣክቢት! ብሉጽ ኢኻ! 🎉";
        if (!starField.children.length) addStars();
      });
      starField.append(star);
    };
    const addStars = () => { for(let i=0;i<5;i++) makeStar(); };
    addStars();
    starTimer = setInterval(() => { if (starField.children.length < 5) makeStar(); }, 1800);
  }

  world.querySelector(".kw-close").addEventListener("click", () => {
    world.hidden = true;
    launch.hidden = false;
    clearInterval(starTimer);
    if (activeAudio) activeAudio.pause();
    if ("speechSynthesis" in window) speechSynthesis.cancel();
  });
  launch.addEventListener("click", () => {
    world.hidden = false;
    launch.hidden = true;
    speak("ሰላም ካቡየ! ናብ ከተማ ካቡ ብደሓን መጻእካ።");
  });
  world.querySelectorAll("[data-friend]").forEach(button => button.addEventListener("click", () => {
    button.classList.add("kw-bounce");
    setTimeout(() => button.classList.remove("kw-bounce"), 850);
    if (button.dataset.friend === "dog") speak("ካቡየ ካቡ! ካቡየ ሽኮር! ደሓን ዲኻ? ዋው ዋው! ኣነ ቦቢ ውሻ እየ!");
    else speak("ካቡ ሽኮር! ኣነ ሮሚ ፈረስ እየ! እየ እጎዪ ኣለኹ!");
  }));
  world.querySelectorAll("[data-action]").forEach(button => button.addEventListener("click", () => {
    const action = button.dataset.action;
    if (action === "dog") world.querySelector('[data-friend="dog"]').click();
    if (action === "horse") world.querySelector('[data-friend="horse"]').click();
    if (action === "cars") {
      world.querySelector(".kw-city").classList.toggle("kw-traffic-fast");
      speak("መኪናታት ይንቀሳቐሳ ኣለዋ! ቢቢቢ! ተጠንቀቕ!");
    }
    if (action === "stars") runStars();
  }));
}
