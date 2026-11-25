import "./kids-world.css";

const THREE_URL = "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";
let THREE;

export function mountKidsWorld() {
  const topbar = document.querySelector(".topbar");
  const sceneRoot = document.querySelector(".scene");
  if (!topbar || !sceneRoot || document.querySelector("#kids-world")) return;

  const launch = document.createElement("button");
  launch.id = "kids-world-launch";
  launch.className = "kids-world-launch";
  launch.type = "button";
  launch.textContent = "🌟 3D የልጆች ዓለም";
  topbar.append(launch);
  launch.hidden = true;

  const world = document.createElement("section");
  world.id = "kids-world";
  world.className = "kids-world";
  world.setAttribute("aria-label", "Kabu 3D animated world");
  world.innerHTML = `
    <header class="kw-head">
      <div><p class="kw-kicker">KABU 3D ADVENTURE WORLD</p><h2>🌍 ሕያው 3D ዓለም እንስሳት</h2><p>እንስሳት ይዛረቡ፣ ይራኸቡ፣ ብሓባር ይጉዓዙ!</p></div>
      <button class="kw-close" type="button" aria-label="ዕጸው">✕</button>
    </header>
    <nav class="kw-story-tabs" aria-label="ቦታ ምረጽ">
      <button type="button" data-scene="town" class="active">🏙️ ከተማ</button>
      <button type="button" data-scene="forest">🌳 ዱርን ሜዳን</button>
      <button type="button" data-scene="beach">🏖️ ባሕሪ</button>
    </nav>
    <div class="kw-stage" role="img" aria-label="ብሓቂ 3D ዝተሰርሐ ዓለም ካቡ">
      <div class="kw-loading"><span class="kw-loader"></span><b>3D ዓለም ይዳሎ ኣሎ…</b><small>ንቑሩብ ጽናሕ</small></div>
      <div class="kw-canvas"></div>
      <div class="kw-stage-label">✨ KABU 3D WORLD</div>
      <div class="kw-stage-error" hidden>3D ዓለም ክኸፍት ኣይከኣለን። ኢንተርነትካ ኣረጋግጽ እሞ ደጊምካ ፈትን።</div>
    </div>
    <div class="kw-story-caption" aria-live="polite"><span>✨</span><span id="kw-message">ቦቢ ውሻን ሮሚ ፈረስን ኣብ 3D ዓለም ክትራኸቦም ድሉው ዲኻ?</span></div>
    <div class="kw-controls">
      <button type="button" data-action="play">⏸️ ዕረፍቲ</button>
      <button type="button" data-action="story">📖 ታሪኽ ጀምር</button>
      <button type="button" data-action="dance">💃 ሳዕስዕ</button>
      <button type="button" data-action="camera">🎥 ካሜራ ኣንቀሳቕስ</button>
      <button type="button" data-action="sound">🔊 ድምጺ</button>
    </div>
    <footer class="kw-footer"><span>ብምሉእ ልቢ ንካቡ · 3D CARTOON WORLD 💛</span><strong id="kw-status">● LIVE 3D</strong></footer>
  `;
  sceneRoot.insertBefore(world, sceneRoot.querySelector(".welcome"));

  const stage = world.querySelector(".kw-stage");
  const canvasHost = world.querySelector(".kw-canvas");
  const message = world.querySelector("#kw-message");
  const loading = world.querySelector(".kw-loading");
  const errorBox = world.querySelector(".kw-stage-error");
  const status = world.querySelector("#kw-status");
  let renderer, scene, camera, clock, animationId;
  let paused = false, dancing = false, cameraMoving = false, soundOn = true;
  let currentPlace = "town", storyTimer = null, audio = null, disposed = false;
  const movers = [], animalParts = [], cars = [];
  const mats = {};

  const say = async (line) => {
    message.textContent = line;
    if (!soundOn) return;
    if (audio) { audio.pause(); audio = null; }
    if ("speechSynthesis" in window) speechSynthesis.cancel();
    try {
      const response = await fetch("/api/speech", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:line.slice(0,240)})});
      const data = await response.json();
      if (!response.ok || !data.audio) throw new Error("speech unavailable");
      const bytes = Uint8Array.from(atob(data.audio), c => c.charCodeAt(0));
      const url = URL.createObjectURL(new Blob([bytes],{type:data.mimeType || "audio/wav"}));
      audio = new Audio(url);
      audio.onended = () => { URL.revokeObjectURL(url); audio = null; };
      await audio.play();
    } catch {
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(line);
        utterance.lang = "ti-ER";
        speechSynthesis.speak(utterance);
      }
    }
  };

  const material = (color, roughness=.78) => new THREE.MeshStandardMaterial({color,roughness});
  const mesh = (geometry, mat, parent, x=0,y=0,z=0) => {
    const obj = new THREE.Mesh(geometry,mat);
    obj.position.set(x,y,z);
    obj.castShadow = true;
    obj.receiveShadow = true;
    parent.add(obj);
    return obj;
  };
  const box = (w,h,d,mat,parent,x,y,z) => mesh(new THREE.BoxGeometry(w,h,d),mat,parent,x,y,z);
  const sphere = (rx,ry,rz,mat,parent,x,y,z) => {
    const obj=mesh(new THREE.SphereGeometry(1,24,16),mat,parent,x,y,z);
    obj.scale.set(rx,ry,rz);
    return obj;
  };
  const cylinder = (rt,rb,h,mat,parent,x,y,z,segments=16) => mesh(new THREE.CylinderGeometry(rt,rb,h,segments),mat,parent,x,y,z);

  function makeTree(parent,x,z,scale=1) {
    const tree=new THREE.Group(); tree.position.set(x,0,z); tree.scale.setScalar(scale); parent.add(tree);
    cylinder(.16,.23,1.25,material("#85502e"),tree,0,.62,0);
    sphere(.72,.78,.72,material("#39a85c"),tree,0,1.62,0);
    sphere(.5,.56,.52,material("#62c96d"),tree,-.34,1.86,.08);
    sphere(.48,.52,.5,material("#248d50"),tree,.35,1.82,-.05);
    return tree;
  }

  function makeBuilding(parent,x,z,w,h,d,color) {
    const g=new THREE.Group(); g.position.set(x,0,z); parent.add(g);
    box(w,h,d,material(color),g,0,h/2,0);
    box(w*1.06,.18,d*1.06,material("#f8d9a5"),g,0,h+.08,0);
    const windowMat=material("#a9e6ff",.25);
    const cols=Math.max(2,Math.floor(w/.75)), rows=Math.max(2,Math.floor(h/1.05));
    for(let row=0;row<rows;row++) for(let col=0;col<cols;col++){
      const wx=(col-(cols-1)/2)*(w/(cols+.2));
      const wy=.62+row*(h/(rows+.25));
      box(.25,.32,.035,windowMat,g,wx,wy,d/2+.02);
    }
    return g;
  }

  function makeCar(parent,color,x,z,direction=1) {
    const car=new THREE.Group(); car.position.set(x,.25,z); car.userData.direction=direction; parent.add(car);
    box(1.65,.48,.86,material(color),car,0,.28,0);
    box(.9,.48,.72,material("#d9f5ff",.25),car,-.05,.68,0);
    const tireMat=material("#29323a"), hub=material("#dce5eb",.35);
    for(const wx of [-.52,.55]) for(const wz of [-.46,.46]){
      const wheel=mesh(new THREE.CylinderGeometry(.22,.22,.13,18),tireMat,car,wx,.13,wz);
      wheel.rotation.x=Math.PI/2;
      const cap=mesh(new THREE.CylinderGeometry(.1,.1,.14,16),hub,car,wx,.13,wz);
      cap.rotation.x=Math.PI/2;
      movers.push({kind:"wheel",object:wheel});
    }
    cars.push(car);
    return car;
  }

  function makeDog(parent,x,z) {
    const dog=new THREE.Group(); dog.position.set(x,0,z); parent.add(dog);
    const fur=material("#c98249"), cream=material("#ffe0b2"), dark=material("#573629"), eye=material("#241b19");
    sphere(.58,.56,.72,fur,dog,0,.82,0);
    sphere(.48,.46,.46,fur,dog,0,1.52,.08);
    sphere(.35,.28,.28,cream,dog,0,1.34,.43);
    sphere(.12,.1,.1,dark,dog,0,1.42,.7);
    for(const s of [-1,1]){
      const ear=sphere(.16,.37,.13,dark,dog,s*.36,1.7,.03); ear.rotation.z=s*-.35;
      sphere(.065,.085,.055,eye,dog,s*.16,1.59,.31);
      sphere(.025,.03,.02,material("#ffffff"),dog,s*.17,1.62,.36);
      const leg=new THREE.Group(); leg.position.set(s*.31,.58,.05); dog.add(leg);
      sphere(.14,.4,.14,fur,leg,0,-.28,0); animalParts.push({part:leg,phase:s*.9});
    }
    const tail=sphere(.11,.38,.12,fur,dog,0,1.04,-.68); tail.rotation.x=-.7;
    animalParts.push({part:tail,tail:true});
    dog.userData.kind="dog";
    return dog;
  }

  function makeHorse(parent,x,z) {
    const horse=new THREE.Group(); horse.position.set(x,0,z); parent.add(horse);
    const coat=material("#a95d35"), mane=material("#49302a"), cream=material("#e7b58b"), black=material("#261d1b");
    sphere(.62,.53,1.0,coat,horse,0,1.0,0);
    const neck=sphere(.34,.82,.38,coat,horse,0,1.65,.55); neck.rotation.x=-.3;
    sphere(.4,.37,.4,coat,horse,0,2.18,.72);
    sphere(.33,.19,.25,cream,horse,0,2.02,1.0);
    sphere(.09,.09,.08,black,horse,-.2,2.23,1.02); sphere(.09,.09,.08,black,horse,.2,2.23,1.02);
    sphere(.18,.45,.2,mane,horse,0,2.48,.53);
    for(const s of [-1,1]){
      const ear=sphere(.1,.27,.1,coat,horse,s*.23,2.52,.66); ear.rotation.z=s*-.25;
      const leg=new THREE.Group(); leg.position.set(s*.34,.75,s*.55); horse.add(leg);
      cylinder(.1,.13,.72,coat,leg,0,-.34,0);
      animalParts.push({part:leg,phase:s*.7});
    }
    const tail=sphere(.12,.53,.13,mane,horse,0,1.13,-.98); tail.rotation.x=-.4;
    animalParts.push({part:tail,tail:true});
    horse.userData.kind="horse";
    return horse;
  }

  function makeBird(parent,x,y,z,color) {
    const bird=new THREE.Group(); bird.position.set(x,y,z); parent.add(bird);
    sphere(.16,.12,.22,material(color),bird,0,0,0);
    const wing=sphere(.22,.045,.12,material("#fff0c8"),bird,0,.1,0);
    bird.userData.wing=wing;
    movers.push({kind:"bird",object:bird,phase:Math.random()*6});
    return bird;
  }

  function makeAnimal(parent, type, x, z, scale=1) {
    const root=new THREE.Group(); root.position.set(x,0,z); root.scale.setScalar(scale); parent.add(root);
    const palette={dog:["#bd7a45","#f2d1a6","#493027"],lion:["#d99a3e","#f5d18a","#8a4b24"],elephant:["#8796a5","#c4cdd3","#596a79"],zebra:["#f2f0e8","#ffffff","#252a31"],giraffe:["#e8b34e","#ffe0a0","#9a612e"],rabbit:["#e5d5c9","#fff1e8","#b77b7b"],deer:["#b87949","#f2d3aa","#63402d"],bear:["#74503d","#c89c73","#3d2922"]}[type];
    const coat=material(palette[0]), light=material(palette[1]), dark=material(palette[2]), black=material("#211b1a"), white=material("#ffffff");
    sphere(.62,.52,.94,coat,root,0,1.05,0);
    const head=new THREE.Group(); head.position.set(0,1.95,.78); root.add(head);
    sphere(.39,.36,.4,coat,head,0,0,0); sphere(.28,.19,.24,light,head,0,-.13,.32);
    const jaw=sphere(.23,.07,.18,dark,head,0,-.29,.31);
    for(const s of [-1,1]){sphere(.075,.09,.055,black,head,s*.17,.06,.34);sphere(.027,.03,.02,white,head,s*.19,.09,.38);}
    const legs=[];
    for(const sx of [-1,1]) for(const sz of [-1,1]){
      const leg=new THREE.Group(); leg.position.set(sx*.37,.82,sz*.57); root.add(leg);
      const length=type==="elephant"?.58:type==="giraffe"?.82:type==="rabbit"?.5:.68;
      cylinder(type==="elephant"?.15:.105,type==="elephant"?.17:.12,length,coat,leg,0,-length/2,0,14);
      sphere(.13,.1,.16,light,leg,0,-length+.03,.04); legs.push(leg);
    }
    const tail=sphere(type==="lion"?.09:.07,type==="lion"?.5:.34,.08,type==="lion"?dark:coat,root,0,1.2,-.95);
    if(type==="lion") sphere(.55,.52,.46,dark,root,0,1.95,.62);
    if(type==="elephant"){const trunk=cylinder(.12,.17,.78,coat,head,0,-.4,.43,18);trunk.rotation.x=-.55;for(const s of [-1,1])sphere(.3,.38,.12,light,head,s*.42,0,-.02);}
    if(type==="giraffe"){for(let i=0;i<9;i++)sphere(.11,.13,.1,dark,root,Math.sin(i*7)*.43,.8+(i%4)*.25,Math.cos(i*7)*.66);for(const s of [-1,1])cylinder(.045,.05,.38,dark,head,s*.17,.47,0,10);}
    if(type==="zebra"){for(let i=0;i<7;i++){const stripe=box(.055,.62,.035,dark,root,-.48+i*.16,1.08,.78);stripe.rotation.z=(i-3)*-.12;}for(const s of [-1,1])sphere(.09,.22,.07,coat,head,s*.24,.35,0);}
    if(type==="rabbit")for(const s of [-1,1]){const ear=sphere(.12,.48,.09,coat,head,s*.19,.53,-.02);ear.rotation.z=s*-.18;sphere(.065,.34,.025,light,head,s*.19,.54,.065);}
    if(type==="deer")for(const s of [-1,1]){const antler=cylinder(.035,.055,.55,light,head,s*.24,.52,-.02,8);antler.rotation.z=s*.25;}
    root.userData={type,legs,head,jaw,tail,phase:Math.random()*6};
    return root;
  }

  function buildWorld() {
    scene=new THREE.Scene();
    scene.background=new THREE.Color("#8bdcff");
    scene.fog=new THREE.Fog("#b8e7f6",24,55);
    camera=new THREE.PerspectiveCamera(43,1,.1,120);
    camera.position.set(13,11,17); camera.lookAt(0,1,0);
    renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
    renderer.shadowMap.enabled=true;
    renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    renderer.toneMapping=THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure=1.12;
    canvasHost.replaceChildren(renderer.domElement);
    clock=new THREE.Clock();

    scene.add(new THREE.HemisphereLight("#e8f8ff","#67824a",2.1));
    const sun=new THREE.DirectionalLight("#fff2cf",3.1); sun.position.set(-8,15,9); sun.castShadow=true;
    sun.shadow.mapSize.set(1024,1024); scene.add(sun);

    const world=new THREE.Group(); scene.add(world);
    const grass=material("#80ca70"), road=material("#596b79"), line=material("#fff4d2"), sidewalk=material("#e6d6bd");
    box(38,.3,30,grass,world,0,-.2,0);
    box(38,.12,5.6,road,world,0,-.01,1.2);
    box(38,.1,.35,sidewalk,world,0,.04,-1.75);
    box(38,.1,.35,sidewalk,world,0,.04,4.15);
    for(let x=-18;x<19;x+=3.5) box(1.7,.025,.13,line,world,x,.06,1.2);

    const town=new THREE.Group(); world.add(town);
    const palette=["#f7b267","#8ecae6","#f28482","#b8a1e3","#f6d365","#85c9a5"];
    for(let i=0;i<9;i++){
      const x=-16+i*4;
      makeBuilding(town,x,-7,2.8,3.5+(i%4)*1.35,2.6,palette[i%palette.length]);
      makeTree(town,x+1.55,-3.6,.7);
    }
    const forest=new THREE.Group(); world.add(forest);
    for(let i=0;i<22;i++) makeTree(forest,-17+(i%8)*4.7,-8+Math.floor(i/8)*5,.8+(i%3)*.15);
    const beach=new THREE.Group(); world.add(beach);
    box(38,.22,12,material("#f4d58c"),beach,0,-.02,-6);
    box(38,.3,8,material("#39bde8",.35),beach,0,-.12,8);
    for(let i=0;i<7;i++) makeTree(beach,-16+i*5,-2,.9);

    const sunBall=sphere(1.35,1.35,1.35,material("#ffd45c"),world,-11,9,-10);
    const cloudMat=material("#ffffff");
    for(let i=0;i<5;i++){
      const cloud=new THREE.Group(); cloud.position.set(-12+i*6,7+(i%2),-9); world.add(cloud);
      sphere(.8,.4,.55,cloudMat,cloud,0,0,0);
      sphere(.55,.34,.48,cloudMat,cloud,.65,-.06,.04);
      sphere(.5,.32,.45,cloudMat,cloud,-.58,-.07,.05);
      movers.push({kind:"cloud",object:cloud,phase:i*1.4});
    }
    makeCar(world,"#ef476f",0,0);
    makeCar(world,"#3a86ff",-13,2.35,-1);
    makeCar(world,"#ffbe0b",13,-.05,1);
    const animals=new THREE.Group(); world.add(animals);
    const herdTypes=["dog","lion","elephant","zebra","giraffe","rabbit","deer","bear"];
    const herd=herdTypes.map((type,i)=>makeAnimal(animals,type,-7+(i%4)*4.5,5+Math.floor(i/4)*3.2,type==="rabbit"?.9:1));
    for(let i=0;i<6;i++) makeBird(world,-10+i*4,5+(i%2),-2-i,"#f3a85d");
    world.userData={town,forest,beach,animals,herd,world};
    resize();
    return world;
  }

  let worldGroup;
  function applyPlace(place) {
    currentPlace=place;
    if(!worldGroup) return;
    worldGroup.userData.town.visible=place==="town";
    worldGroup.userData.forest.visible=place==="forest";
    worldGroup.userData.beach.visible=place==="beach";
    worldGroup.userData.animals.visible=true;
    const colors={town:"#8bdcff",forest:"#9ee5bb",beach:"#8bdcff"};
    scene.background=new THREE.Color(colors[place]);
    scene.fog.color=new THREE.Color(place==="forest"?"#c5edce":place==="beach"?"#c5edfa":"#b8e7f6");
    world.querySelectorAll("[data-scene]").forEach(b=>b.classList.toggle("active",b.dataset.scene===place));
    const lines={town:"እንኳዕ ናብ ከተማ ካቡ መጻእካ! መካይን ይንቀሳቐሳ ኣለዋ፣ እንስሳት ይጻወቱ ኣለዉ!",forest:"ኣብ ሓምለዋይ ጫካ ኢና! ኣእዋም፣ ወፍታትን እንስሳትን!",beach:"ዋው! ኣብ ገምገም ባሕሪ ማዕበል ይንቀሳቐስ ኣሎ!"};
    say(lines[place]);
  }

  function resize() {
    if(!renderer || !camera) return;
    const w=Math.max(1,canvasHost.clientWidth),h=Math.max(1,canvasHost.clientHeight);
    renderer.setSize(w,h,false); camera.aspect=w/h; camera.updateProjectionMatrix();
  }
  function animate() {
    if(disposed) return;
    animationId=requestAnimationFrame(animate);
    const delta=Math.min(clock.getDelta(),.04), t=clock.elapsedTime;
    if(!paused) {
      for(const car of cars){car.position.x+=car.userData.direction*delta*(car.userData.direction>0?3.4:2.6);if(car.position.x>21)car.position.x=-21;if(car.position.x< -21)car.position.x=21;}
      for(const item of animalParts){if(item.tail){item.part.rotation.z=Math.sin(t*5)*.28;}else item.part.rotation.x=Math.sin(t*7+item.phase)*(dancing?.75:.3);}
      for(const item of movers){if(item.kind==="cloud")item.object.position.x+=Math.sin(t*.35+item.phase)*delta*.25;if(item.kind==="bird"){item.object.position.y+=Math.sin(t*4+item.phase)*delta*.45;item.object.rotation.z=Math.sin(t*2+item.phase)*.15;}}
      worldGroup.userData.herd.forEach((animal,i)=>{
        const phase=t*1.25+animal.userData.phase+i*.72;
        animal.position.x=-7+(i%4)*4.5+Math.sin(t*.24+i*.45)*.9;
        animal.position.z=5+Math.floor(i/4)*3.2+Math.cos(t*.28+i*.6)*.65;
        animal.position.y=Math.abs(Math.sin(phase*2))*(dancing?.42:.055);
        animal.rotation.y=Math.sin(t*.38+i*.7)*.18;
        animal.userData.legs.forEach((leg,j)=>{leg.rotation.x=Math.sin(phase*5+(j%2)*Math.PI+(j>1?Math.PI:0))*(dancing?.65:.38);});
        animal.userData.tail.rotation.x=-.6+Math.sin(t*4+i)*.2;
        animal.userData.head.rotation.y=Math.sin(t*.8+i*1.7)*.22;
        animal.userData.jaw.scale.y=.07+(Math.sin(t*7+i*2)>.65?.11:0);
      });
      if(cameraMoving){camera.position.x=13+Math.sin(t*.25)*3;camera.position.z=17+Math.cos(t*.25)*2;camera.lookAt(0,1,0);}
      renderer.render(scene,camera);
    } else renderer.render(scene,camera);
  }

  async function initialize() {
    try {
      THREE=await import(/* @vite-ignore */ THREE_URL);
      if(disposed) return;
      window.THREE=THREE;
      worldGroup=buildWorld();
      applyPlace("town");
      loading.hidden=true;
      status.textContent="● LIVE 3D";
      animate();
      if("ResizeObserver" in window){new ResizeObserver(resize).observe(canvasHost);}else window.addEventListener("resize",resize);
    } catch(err) {
      console.error("Kabu 3D world failed to initialize",err);
      loading.hidden=true; errorBox.hidden=false; status.textContent="● 3D OFFLINE";
    }
  }

  function stopStory(){clearInterval(storyTimer);storyTimer=null;}
  function startStory(){
    stopStory();
    const scenes=[
      ["town","ሓደ መዓልቲ ቦቢ ውሻን ሮሚ ፈረስን ኣብ ከተማ ተራኸቡ።"],
      ["forest","እቶም ክልተ ኣዕሩኽ ኣብ ጫካ ኮኾብ ክደልዩ ከዱ።"],
      ["beach","ኣብ ባሕሪ ተጻወቱ፣ ሳዕስዑን ብሓባር ተሓጎሱን!"]
    ];
    let i=0;
    const next=()=>{const [place,line]=scenes[i];applyPlace(place);say(line);i++;if(i===scenes.length){stopStory();setTimeout(()=>{if(!disposed)message.textContent="ታሪኽና ብደስታ ተዛዚሙ! 🎉";},4200);}};
    next();storyTimer=setInterval(()=>{if(i<scenes.length)next();else stopStory();},6500);
  }

  world.querySelector(".kw-close").addEventListener("click",()=>{
    world.hidden=true;launch.hidden=false;stopStory();paused=true;
    if(audio)audio.pause();if("speechSynthesis"in window)speechSynthesis.cancel();
  });
  launch.addEventListener("click",()=>{world.hidden=false;launch.hidden=true;paused=false;say("ሰላም ካቡየ! ናብ 3D ዓለምና ብደሓን መጻእካ!");});
  world.querySelectorAll("[data-scene]").forEach(button=>button.addEventListener("click",()=>{stopStory();applyPlace(button.dataset.scene);}));
  world.querySelectorAll("[data-action]").forEach(button=>button.addEventListener("click",()=>{
    const action=button.dataset.action;
    if(action==="play"){paused=!paused;button.textContent=paused?"▶️ ቀጽል":"⏸️ ዕረፍቲ";status.textContent=paused?"Ⅱ PAUSED":"● LIVE 3D";}
    if(action==="story")startStory();
    if(action==="dance"){dancing=!dancing;button.textContent=dancing?"🕺 ሳዕስዕ ኣቋርጽ":"💃 ሳዕስዕ";say(dancing?"ቦቢን ሮሚን ሓቢሮም ይስዕስዑ ኣለዉ!":"ደስ ዝብል ሳዕስዕ ነይሩ!");}
    if(action==="camera"){cameraMoving=!cameraMoving;say(cameraMoving?"ካሜራ ኣብ 3D ዓለም ይዘውር ኣሎ!":"ካሜራ ተረጋጊኡ ኣሎ።");}
    if(action==="sound"){soundOn=!soundOn;button.textContent=soundOn?"🔊 ድምጺ":"🔇 ድምጺ";if(!soundOn){if(audio)audio.pause();if("speechSynthesis"in window)speechSynthesis.cancel();}else say("ድምጺ ካቡ ተኸፊቱ ኣሎ!");}
  }));
  initialize();

  const cleanup=()=>{disposed=true;stopStory();cancelAnimationFrame(animationId);if(renderer)renderer.dispose();if(audio)audio.pause();if("speechSynthesis"in window)speechSynthesis.cancel();};
  window.addEventListener("pagehide",cleanup,{once:true});
}
