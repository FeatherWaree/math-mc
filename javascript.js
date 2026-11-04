(() => {
  const ID = 'sparx-3d-game';
  try{window.__featherMCCleanup?.();}catch(e){}
  document.getElementById(ID)?.remove();

  const loadScript = (url, done) => {
    const s = document.createElement('script');
    s.src = url;
    s.onload = done;
    s.onerror = () => alert('A FeatherMC library could not load. Check whether the network allows the CDN.');
    document.head.appendChild(s);
  };
  const boot = () => {
    if (!window.THREE) return alert('FeatherMC could not load its 3D library. Check whether the network allows the CDN.');
    run();
  };
  if (window.THREE) boot();
  else loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.min.js', boot);

  function run() {
    const THREE = window.THREE;
    const ROOT = document.createElement('div');
    ROOT.id = ID;
    Object.assign(ROOT.style, {position:'fixed',inset:'0',zIndex:'999999',overflow:'hidden',background:'#87ceeb',fontFamily:'Arial,sans-serif'});
    document.body.appendChild(ROOT);

    const style = document.createElement('style');
    style.textContent = `
      #${ID} *{box-sizing:border-box}#${ID} button,#${ID} input,#${ID} select{font:inherit}#${ID} button{cursor:pointer}
      .fm-screen{position:absolute;inset:0;z-index:30;display:flex;align-items:center;justify-content:center;background:#071523;color:#fff;background-size:cover;background-position:center;isolation:isolate}.fm-screen::before{content:'';position:absolute;inset:-12px;z-index:0;background-image:var(--fm-backdrop);background-size:cover;background-position:center;filter:blur(5px) brightness(.70);pointer-events:none}.fm-screen>.fm-box{position:relative;z-index:2}
      .fm-box{width:min(500px,93vw);max-height:92vh;overflow:auto;padding:25px;background:#101d1be9;border:3px solid #536d58;box-shadow:0 15px 70px #000d, inset 0 0 24px #395f3620;backdrop-filter:blur(10px);border-radius:3px}
      .fm-logo{text-align:center;font-size:clamp(32px,7vw,53px);font-weight:1000;letter-spacing:2px;text-shadow:4px 4px #111,0 0 20px #69c28b80;margin:5px 0 25px;color:#efffed}
      .fm-button{display:block;width:100%;padding:13px;margin:9px 0;border:2px solid #29431f;background:#579b3b;color:white;font-weight:bold;font-size:16px;box-shadow:0 3px #1e3119}
      .fm-button:hover{background:#70b84b}.fm-secondary{background:#555e58;border-color:#333;box-shadow:0 3px #222}
      .fm-input{width:100%;padding:11px;margin:7px 0;border:2px solid #777;background:#eee;color:#222}.fm-label{display:block;text-align:left;margin-top:12px;font-size:13px;color:#ddd}.fm-row{display:flex;gap:10px}.fm-row>*{flex:1;min-width:0}.fm-small{color:#bbb;font-size:12px;line-height:1.45}
      .fm-crosshair{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:24px;height:24px;z-index:8;pointer-events:none}
      .fm-hotbar{position:absolute;left:50%;bottom:18px;transform:translateX(-50%);display:flex;gap:3px;z-index:8;pointer-events:auto}
      .fm-slot{width:48px;height:48px;position:relative;display:flex;align-items:center;justify-content:center;background:#222b;border:2px solid #999;box-shadow:inset 2px 2px #ffffff25,inset -2px -2px #0008}
      .fm-slot.selected{width:52px;height:52px;margin-top:-2px;border:3px solid white;background:#ffffff55}.fm-item-icon{width:25px;height:25px;border:2px solid #ffffff70;box-shadow:inset -3px -3px #0003;image-rendering:pixelated}
      .fm-slot-number{position:absolute;top:1px;left:3px;color:white;font-size:9px;text-shadow:1px 1px black}.fm-item-count{position:absolute;right:3px;bottom:0;color:white;font-size:12px;font-weight:bold;text-shadow:2px 2px black}
      .fm-health{position:absolute;left:calc(50% - 200px);bottom:76px;transform:none;display:flex;gap:2px;z-index:8;pointer-events:none}.fm-heart{width:18px;height:18px;image-rendering:pixelated;filter:drop-shadow(1px 1px 1px #000)}
      .fm-hunger{position:absolute;left:calc(50% + 2px);bottom:76px;display:flex;gap:2px;z-index:8;pointer-events:none}.fm-food{width:18px;height:18px;filter:drop-shadow(1px 1px 1px #000)}
      .fm-damage-flash{position:absolute;inset:0;z-index:7;pointer-events:none;background:radial-gradient(ellipse at center,transparent 45%,rgba(210,0,0,.68) 100%);opacity:0}
      .fm-damage-flash.active{animation:fm-red-flash .42s ease-out}@keyframes fm-red-flash{0%{opacity:0}25%{opacity:.85}100%{opacity:0}}
      .fm-debug{position:absolute;left:10px;top:10px;z-index:18;color:#fff;background:#0008;padding:6px 9px;font:12px monospace;white-space:pre;pointer-events:none;display:none}
      .fm-heart.damage{animation:fm-hit .38s ease-in-out 2}.fm-heart.low{animation:fm-low .8s steps(2,end) infinite}@keyframes fm-hit{0%,100%{transform:translateY(0) scale(1);opacity:1}25%{transform:translateY(-4px) scale(1.16);opacity:.4}60%{transform:translateY(1px) scale(.9);opacity:1}}@keyframes fm-low{50%{opacity:.45}}
      .fm-overlay{position:absolute;inset:0;display:none;align-items:center;justify-content:center;z-index:25;background:#0009}.fm-inventory{width:min(850px,95vw);max-height:92vh;overflow:auto;padding:20px;background:#c6c6c6;border:4px solid #fff;border-right-color:#555;border-bottom-color:#555;color:#303030;box-shadow:0 10px 40px #0008;font-family:monospace;font-weight:bold;image-rendering:pixelated}.fm-inventory button{font-family:monospace;image-rendering:pixelated}
      .fm-inv-grid{display:grid;grid-template-columns:repeat(9,minmax(22px,1fr));gap:4px}.fm-inv-slot{aspect-ratio:1;min-width:0;position:relative;display:flex;align-items:center;justify-content:center;background:#8b8b8b;border:3px solid #373737;border-right-color:#fff;border-bottom-color:#fff;image-rendering:pixelated}.fm-inv-slot:hover{background:#a4a4a4}.fm-inv-slot.selected{outline:3px solid #f1d77b}.fm-inv-slot .fm-item-icon{width:62%;height:62%}.fm-inv-slot .fm-item-count{right:2px;bottom:0}
      .fm-craft-grid{display:grid;grid-template-columns:repeat(3,38px);gap:4px}.fm-craft-cell{width:38px;height:38px;position:relative;display:flex;align-items:center;justify-content:center;background:#777;border:3px solid #eee;border-right-color:#444;border-bottom-color:#444}.fm-craft-output{width:42px;height:42px;margin-left:8px;background:#777;border:3px solid #eee;border-right-color:#444;border-bottom-color:#444;display:flex;align-items:center;justify-content:center}
      .fm-chat{position:absolute;right:14px;top:14px;width:min(360px,75vw);z-index:12;color:white;pointer-events:none;text-shadow:1px 1px black}.fm-chat-log{max-height:190px;overflow:hidden;font-size:13px;line-height:1.5;background:#0005;padding:6px}.fm-chat-input{display:none;width:100%;padding:9px;border:1px solid #ddd;background:#111d;color:white;pointer-events:auto;outline:none}
      .fm-toast{position:absolute;top:14%;left:50%;transform:translateX(-50%);z-index:15;display:none;padding:12px 18px;min-width:220px;color:white;background:#242d29ee;border:2px solid #b5a45d;box-shadow:0 4px 15px #0008;text-align:center;pointer-events:none}.fm-toast strong{display:block;color:#f0d77c;margin-bottom:3px}
      .fm-meter-wrap{position:absolute;left:50%;bottom:136px;transform:translateX(-50%);width:104px;height:7px;background:#0009;border:1px solid #fff8;z-index:8;pointer-events:none}.fm-meter{height:100%;width:0;background:#f5d66b}.fm-progress-wrap{position:absolute;left:50%;top:calc(50% + 18px);transform:translateX(-50%);width:100px;height:5px;background:#0009;z-index:8;pointer-events:none}.fm-progress{height:100%;width:0;background:white}
      .fm-air{position:absolute;left:50%;bottom:113px;transform:translateX(-50%);display:none;gap:2px;z-index:8;pointer-events:none}.fm-bubble{width:17px;height:17px;border:2px solid #c8efff;border-radius:50%;background:#2d79ad99;box-shadow:inset 2px 2px #ffffff77,0 1px 2px #0009}.fm-bubble.empty{opacity:.2;background:#172b49}
      .fm-invite-alert{position:absolute;inset:0;z-index:120;display:flex;align-items:center;justify-content:center;background:#000a;backdrop-filter:blur(6px)}.fm-invite-alert .fm-box{max-height:90vh}.fm-info{position:absolute;left:14px;top:14px;color:white;text-shadow:2px 2px black;z-index:8;pointer-events:none;font-size:13px}
      @media(max-width:650px){.fm-logo{font-size:36px}.fm-slot{width:34px;height:38px}.fm-slot.selected{width:38px;height:42px}.fm-hotbar{gap:2px}.fm-heart{width:15px;height:15px}.fm-inventory{padding:10px}.fm-inv-grid{gap:2px}}
    `;
    ROOT.appendChild(style);

    // FeatherMC v11: queued chunk streaming, IndexedDB account/world persistence, parties.
    // -------------------- data and runtime state --------------------
    const items = {
      bedrock:['Bedrock','#252525'], grass:['Grass Block','#55a63c'], dirt:['Dirt','#79502b'], stone:['Stone','#888888'],
      oak_log:['Oak Log','#80502c'], oak_leaves:['Oak Leaves','#267b32'], sand:['Sand','#d9c17a'],
      oak_planks:['Oak Planks','#bc8a50'], sandstone:['Sandstone','#d8bd84'], red_sandstone:['Red Sandstone','#bc7844'], crafting_table:['Crafting Table','#90613a'], furnace:['Furnace','#666666'],
      stick:['Stick','#aa8150'], wooden_pickaxe:['Wooden Pickaxe','#a37b42'],
      wooden_axe:['Wooden Axe','#a37b42'], stone_axe:['Stone Axe','#858585'], iron_axe:['Iron Axe','#d7dce2'], diamond_axe:['Diamond Axe','#58e4e0'], wooden_sword:['Wooden Sword','#a37b42'], rotten_flesh:['Rotten Flesh','#845044'],
      coal_ore:['Coal Ore','#454545'], coal:['Coal','#222222'], iron_ore:['Iron Ore','#a78f82'], diamond_ore:['Diamond Ore','#49d8d4'],
      raw_iron:['Raw Iron','#b7a18c'], iron_ingot:['Iron Ingot','#ddd6c9'], diamond:['Diamond','#50e5df'],
      stone_pickaxe:['Stone Pickaxe','#858585'], iron_pickaxe:['Iron Pickaxe','#d7dce2'], diamond_pickaxe:['Diamond Pickaxe','#58e4e0'],
      iron_sword:['Iron Sword','#d7dce2'], diamond_sword:['Diamond Sword','#58e4e0'],
      leather_helmet:['Leather Helmet','#9b6844'], leather_chestplate:['Leather Chestplate','#9b6844'], leather_leggings:['Leather Leggings','#9b6844'], leather_boots:['Leather Boots','#9b6844'],
      iron_helmet:['Iron Helmet','#c7cbd0'], iron_chestplate:['Iron Chestplate','#c7cbd0'], iron_leggings:['Iron Leggings','#c7cbd0'], iron_boots:['Iron Boots','#c7cbd0'],
      diamond_helmet:['Diamond Helmet','#4bd3d1'], diamond_chestplate:['Diamond Chestplate','#4bd3d1'], diamond_leggings:['Diamond Leggings','#4bd3d1'], diamond_boots:['Diamond Boots','#4bd3d1'],
      raw_porkchop:['Raw Porkchop','#d77a79'], cooked_porkchop:['Cooked Porkchop','#9d5142'], raw_beef:['Raw Beef','#c87868'], cooked_beef:['Cooked Beef','#995444'], raw_chicken:['Raw Chicken','#d6b6a0'], cooked_chicken:['Cooked Chicken','#c28b43'], feather:['Feather','#eeeeea'], leather:['Leather','#9b6844'], water:['Water','#3b85e8'], lava:['Lava','#ff641c'], bucket:['Bucket','#bfc5ca'], water_bucket:['Water Bucket','#3985e5'], lava_bucket:['Lava Bucket','#f46a23'], torch:['Torch','#e9b34a'], chest:['Chest','#a66b32']
    };
    const placeable = ['bedrock','grass','dirt','stone','oak_log','oak_leaves','sand','oak_planks','sandstone','red_sandstone','crafting_table','furnace','coal_ore','iron_ore','diamond_ore','chest','water','lava','torch'];
    const avatars = {
      Steve:{shirt:0x2464c4,pants:0x303b75,skin:0xe0aa78}, Alex:{shirt:0xd47c36,pants:0x447245,skin:0xe0aa78},
      Knight:{shirt:0x727b88,pants:0x343c49,skin:0xd9a77f}, Explorer:{shirt:0x477e55,pants:0x604b39,skin:0xc99062}
    };
    let running=false,paused=false,inventoryOpen=false,chatOpen=false,isHost=false;
    let peer=null,hostConn=null,roomCode='',networkHostId='',playerId='local',playerName='Falleen',avatarChoice='Steve',avatarAppearance={shirt:0x2464c4,pants:0x303b75,skin:0xe0aa78,cape:null};
    let worldName='My World',seed='12345',seedHash=1;
    let difficulty='Normal',mobsEnabled=true,pvpEnabled=false,chatEnabled=true;
    let renderDistance=1,fov=75,sensitivity=1,quality='Low',weather='Clear',dayLength=600,worldTime=0.27,gameMode='Survival';
    let firstPerson=true,cameraDistance=7,yaw=0,pitch=.12,velocityY=0,grounded=false,walking=0;
    let hp=20,lastHp=20,hunger=20,lastHunger=20,foodTimer=0,starveTimer=0,attackCharge=1,attackCooldown=0,attackAnim=0,placeAnim=0,mineSwingPhase=0,eatAnim=0,miningKey=null,miningProgress=0,placeCooldown=0,pendingMine=null,pendingMineAt=0;
    let f5Debug=false,weatherParticles=null,cloudGroup=null,redFlash=null,redFlashTimer=0;
    let fallPeakY=0,dropCounter=1,lavaDamageTimer=0,oxygen=15,drownTimer=0,regenTimer=0,hitTintTimer=0,knockbackX=0,knockbackZ=0;
    const droppedItems=new Map();
    let roleById=new Set(),chestInventories=new Map(),openChestKey=null,offhand=null,armour={head:null,chest:null,legs:null,feet:null};
    let mobSpawnTimer=0,lastMobSync=0,lastNetSend=0,lastChunkX=null,lastChunkZ=null,mobCounter=1,minedCount=0,toastTimer=0;
    const inventory=Array(36).fill(null),craftingGrid=Array(9).fill(null),unlocked=new Set(),keys={},held={left:false,right:false};
    const defaultKeybinds={forward:'KeyW',back:'KeyS',left:'KeyA',right:'KeyD',jump:'Space',sprint:'ShiftLeft',inventory:'KeyE',chat:'Slash'};
    const keybinds={...defaultKeybinds};
    let waitingBind=null,settingsReturn='home',fallbackPointerId=null,fallbackLook=false,fallbackMoved=false,fallbackStartX=0,fallbackStartY=0,fallbackLastX=0,fallbackLastY=0;
    let sandTimer=0,dropSyncTimer=0;
    let fluidTimer=0,fluidCursor=0;
    const fluidQueue=[],fluidQueued=new Set(),flowDepth=new Map();
    const waterDirs=[[0,-1,0],[1,0,0],[-1,0,0],[0,0,1],[0,0,-1]];
    function queueWater(x,y,z){
      if(world.get(k3(x,y,z))!=='water')return;
      const key=k3(x,y,z);
      if(fluidQueued.has(key)||fluidQueue.length>7000)return;
      fluidQueued.add(key);fluidQueue.push([x,y,z]);
    }
    function wakeNearbyWater(x,y,z){
      queueWater(x,y,z);
      for(const [dx,dy,dz] of waterDirs)queueWater(x+dx,y+dy,z+dz);
      queueWater(x,y+1,z);
    }
    function updateFlowingWater(dt){
      if(!hasAuthority())return;
      fluidTimer+=dt;
      if(fluidTimer<.17)return;
      fluidTimer=0;
      let changed=0,steps=0;
      while(fluidQueue.length&&steps<28&&changed<7){
        steps++;
        const [x,y,z]=fluidQueue.shift(),key=k3(x,y,z);
        fluidQueued.delete(key);
        if(world.get(key)!=='water'||y<=BEDROCK_Y+1)continue;
        const level=flowDepth.get(key)||0;
        const below=k3(x,y-1,z);
        // Water prioritises vertical flow. Horizontal spread is limited to 4 blocks.
        const targets=[];
        if(!world.has(below))targets.push([x,y-1,z,0]);
        else if(level<4){
          const start=(Math.abs(x*13+z*31+y*7)%4);
          for(let i=0;i<4;i++){
            const d=waterDirs[1+(start+i)%4];
            targets.push([x+d[0],y,z+d[2],level+1]);
          }
        }
        for(const [tx,ty,tz,nextLevel] of targets){
          if(changed>=7)break;
          if(!chunks.has(ck(Math.floor(tx/16),Math.floor(tz/16))))continue;
          const dest=k3(tx,ty,tz);
          if(world.has(dest))continue;
          flowDepth.set(dest,nextLevel);
          if(changeBlock(tx,ty,tz,'water')){
            if(isHost)broadcast({type:'block',x:tx,y:ty,z:tz,block:'water',actor:'fluid'});
            queueWater(tx,ty,tz);
            changed++;
          }
        }
      }
    }
    let selectedSlot=0,craftingSize=2,cursorStack=null,spawnPoint={x:.5,y:8,z:.5};
    const chunks=new Map(),world=new Map(),mods=new Map(),mobs=new Map(),connections=new Map(),remotePlayers=new Map();
    const chunkQueue=[],queuedChunkKeys=new Set(),dirtyChunkQueue=[],dirtyChunkKeys=new Set();let desiredChunkKeys=new Set();
    const sandCandidateKeys=new Set();let sandCandidateList=[],sandCursor=0;
    const fallingSandQueue=[],fallingSandQueued=new Set();
    function wakeSand(x,y,z){const key=k3(x,y,z);if(world.get(key)!=='sand'||fallingSandQueued.has(key))return;fallingSandQueued.add(key);fallingSandQueue.push(key);}

    const hasAuthority=()=>isHost||!peer;
    function ensurePeer(callback){if(window.Peer){callback();return;}const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/peerjs@1.5.5/dist/peerjs.min.js';s.onload=()=>{if(window.Peer)callback();else showMenuMessage('Multiplayer library did not load.');};s.onerror=()=>showMenuMessage('Multiplayer is blocked because PeerJS could not load.');document.head.appendChild(s);}

    // -------------------- Three.js scene --------------------
    const scene=new THREE.Scene();scene.background=new THREE.Color(0x87ceeb);scene.fog=new THREE.Fog(0x87ceeb,30,110);
    const handTorchLight=new THREE.PointLight(0xffb45b,0,12);scene.add(handTorchLight);
    const camera=new THREE.PerspectiveCamera(fov,innerWidth/innerHeight,.1,300);
    const renderer=new THREE.WebGLRenderer({antialias:false,powerPreference:'low-power',depth:true,stencil:false,precision:'mediump'});renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,.55));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.info.autoReset=true;ROOT.appendChild(renderer.domElement);scene.add(camera);
    const hemisphere=new THREE.HemisphereLight(0xffffff,0x65734b,2);scene.add(hemisphere);const sun=new THREE.DirectionalLight(0xffffff,1.5);sun.position.set(30,50,20);scene.add(sun);
    cloudGroup=new THREE.Group();scene.add(cloudGroup);{const cloudGeo=new THREE.BoxGeometry(1,1,1),cloudMat=new THREE.MeshLambertMaterial({color:0xffffff,transparent:true,opacity:.88}),clouds=new THREE.InstancedMesh(cloudGeo,cloudMat,96),dummy=new THREE.Object3D();for(let i=0;i<96;i++){const cloud=Math.floor(i/4),part=i%4;dummy.position.set((cloud%8-3.5)*19+(part-1.5)*2,27+(cloud%3)*2+Math.random()*.4, (Math.floor(cloud/8)-1)*42+(Math.random()-.5)*8);dummy.scale.set(5+Math.random()*4,1.2,3+Math.random()*2);dummy.updateMatrix();clouds.setMatrixAt(i,dummy.matrix);}clouds.instanceMatrix.needsUpdate=true;cloudGroup.add(clouds);}
    const rainCount=1900,rainPositions=new Float32Array(rainCount*3);for(let i=0;i<rainCount;i++){rainPositions[i*3]=(Math.random()-.5)*76;rainPositions[i*3+1]=Math.random()*48-8;rainPositions[i*3+2]=(Math.random()-.5)*76;}const rainGeo=new THREE.BufferGeometry();rainGeo.setAttribute('position',new THREE.BufferAttribute(rainPositions,3));weatherParticles=new THREE.Points(rainGeo,new THREE.PointsMaterial({color:0xc4e2ff,size:.13,transparent:true,opacity:.9,depthWrite:false}));weatherParticles.visible=false;scene.add(weatherParticles);
    // Procedural 16x16 pixel art. Built once per session, not per chunk.
    // All graphics are original and require no external texture downloads.
    const pixelImages=new Map(),pixelCanvases=new Map(),pixelTextures=new Map();
    function pixelArt(id){
      if(pixelImages.has(id))return pixelImages.get(id);
      const canvas=document.createElement('canvas');canvas.width=16;canvas.height=16;
      const ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;
      const base=id.endsWith('_ore')?'#85888d':(items[id]?.[1]||'#999999');
      let h=2166136261;for(const letter of id){h=Math.imul(h^letter.charCodeAt(0),16777619);}
      const random=()=>{h=(Math.imul(h^h>>>13,1664525)+1013904223)|0;return(h>>>0)/4294967296;};
      const rect=(x,y,w,t,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,w,t);};
      const shade=(hex,amount)=>{const color=new THREE.Color(hex);const v=color.toArray().map(n=>Math.min(1,Math.max(0,n*amount)));return '#'+v.map(n=>Math.round(n*255).toString(16).padStart(2,'0')).join('');};
      rect(0,0,16,16,base);
      const noisy=['grass','dirt','stone','sand','sandstone','red_sandstone','bedrock','oak_log','oak_leaves','coal_ore','iron_ore','diamond_ore','water','lava','oak_planks','furnace','chest','crafting_table'];
      if(noisy.includes(id)){
        for(let y=0;y<16;y++)for(let x=0;x<16;x++){
          const r=random(); if(r<.28)rect(x,y,1,1,shade(base,.65+random()*.21));
          else if(r>.76)rect(x,y,1,1,shade(base,1.08+random()*.34));
        }
      }
      if(id==='grass'){for(let x=0;x<16;x++){if(random()>.24)rect(x,14+Math.floor(random()*2),1,1,'#2e7524');if(random()>.65)rect(x,1,1,1,'#9ada58');}}
      if(id==='dirt'){for(let i=0;i<19;i++)rect(Math.floor(random()*16),Math.floor(random()*16),2,1,random()>.5?'#aa7845':'#4b351e');}
      if(id==='sandstone'||id==='red_sandstone'){for(const y of [0,7,15])rect(0,y,16,1,'#8f714b');for(const x of [4,12])rect(x,1,1,6,'#b08a56');}
      if(id==='sand'){for(let i=0;i<22;i++)rect(Math.floor(random()*16),Math.floor(random()*16),1,1,random()>.5?'#fff2ae':'#bba268');}
      if(id==='stone'||id==='bedrock'){for(let i=0;i<10;i++){const x=Math.floor(random()*15),y=Math.floor(random()*15);rect(x,y,1+Math.floor(random()*2),1,shade(base,.48));}}
      if(id.endsWith('_ore')){
        const ore=id.startsWith('diamond')?'#35f3eb':id.startsWith('iron')?'#ddb08b':'#18191d';
        for(let i=0;i<13;i++){const x=2+Math.floor(random()*12),y=2+Math.floor(random()*12);rect(x,y,2,2,shade(ore,.55+random()*.5));rect(x,y,1,1,shade(ore,1.24));}
      }
      if(id==='oak_log'){for(const x of [2,6,10,14]){rect(x,0,1,16,'#563619');for(let y=1;y<16;y+=5)rect(x+1,y,2,1,'#a87943');}}
      if(id==='oak_planks'){for(const y of [0,5,10,15]){rect(0,y,16,1,'#69452b');rect(2,y+2,3,1,'#d8ad69');}rect(7,1,1,3,'#805b35');rect(11,7,1,2,'#805b35');}
      if(id==='oak_leaves'){for(let i=0;i<30;i++){const x=Math.floor(random()*16),y=Math.floor(random()*16);rect(x,y,2,2,random()>.5?'#3d9e38':'#1a5b24');}}
      if(id==='water'){for(let y=2;y<16;y+=4)for(let x=(y%3);x<15;x+=5)rect(x,y,3,1,'#65c7ed');}
      if(id==='lava'){for(let y=1;y<16;y+=3)for(let x=0;x<16;x+=5)rect(x+Math.floor(random()*3),y,3,2,random()>.5?'#ffb333':'#f23c16');}
      if(id==='chest'){rect(1,2,14,12,'#8e5a29');for(const y of [2,7,13])rect(1,y,14,2,'#543216');rect(7,6,3,5,'#e4cb70');}
      if(id==='crafting_table'){rect(2,2,12,12,'#9a6133');rect(2,2,12,2,'#4b2d1b');rect(3,6,10,2,'#c09a62');rect(7,3,2,10,'#553824');rect(3,11,10,2,'#553824');}
      if(id==='furnace'){rect(3,4,10,9,'#333438');rect(4,7,8,5,'#19191b');rect(5,9,6,2,'#e79238');}
      if(id==='torch'){rect(7,7,3,9,'#865329');rect(6,2,5,6,'#ffbd4c');rect(7,1,3,4,'#fff2a4');}
      // Distinct silhouettes for items; flat swatches made tools impossible to recognise.
      const tools=/_pickaxe$|_axe$|_sword$/.test(id);
      if(tools){ctx.clearRect(0,0,16,16);const metal=id.startsWith('diamond')?'#3eece2':id.startsWith('iron')?'#e3e6ec':id.startsWith('stone')?'#8e9296':'#b58a4d';for(let i=3;i<15;i++)rect(14-i,i-1,2,2,'#6a4224');if(id.endsWith('pickaxe')){rect(1,2,12,3,metal);rect(1,3,2,4,metal);rect(11,3,2,4,metal);}else if(id.endsWith('axe')){rect(2,2,7,6,metal);rect(1,3,2,4,shade(metal,.7));}else{ctx.clearRect(0,0,16,16);for(let i=1;i<11;i++)rect(12-i,i,3,3,metal);rect(2,11,9,2,'#594125');rect(5,9,2,6,'#61462b');}}
      else if(id.endsWith('_helmet')||id.endsWith('_chestplate')||id.endsWith('_leggings')||id.endsWith('_boots')){
        const c=id.startsWith('diamond')?'#42e0d9':id.startsWith('iron')?'#cfd4df':'#8d6342';ctx.clearRect(0,0,16,16);
        if(id.endsWith('_helmet')){rect(3,3,10,9,c);rect(5,9,6,4,'#222');rect(2,7,2,5,c);rect(12,7,2,5,c);}
        else if(id.endsWith('_chestplate')){rect(3,4,10,9,c);rect(1,5,3,5,c);rect(12,5,3,5,c);rect(6,10,4,5,c);}
        else if(id.endsWith('_leggings')){rect(3,3,10,5,c);rect(3,8,4,7,c);rect(9,8,4,7,c);}
        else{rect(2,7,5,7,c);rect(9,7,5,7,c);rect(1,12,6,3,shade(c,.8));rect(9,12,6,3,shade(c,.8));}
      } else if(id==='stick'){ctx.clearRect(0,0,16,16);rect(5,4,3,11,'#6d492b');rect(4,3,3,4,'#c69b57');}
      else if(id==='diamond'||id==='coal'||id==='iron_ingot'||id==='raw_iron'){
        ctx.clearRect(0,0,16,16);const c=id==='diamond'?'#5ceee5':id==='coal'?'#2c2b33':id==='iron_ingot'?'#dadfe5':'#b9a38a';rect(4,4,9,8,c);rect(5,3,7,2,shade(c,1.2));rect(3,6,11,3,c);rect(7,5,2,3,shade(c,.75));
      }else if(id.includes('porkchop')||id.includes('beef')||id.includes('chicken')||id==='rotten_flesh'){
        ctx.clearRect(0,0,16,16);const c=id.startsWith('cooked')?'#8c472e':id==='rotten_flesh'?'#69703d':'#d88e88';rect(4,3,8,10,c);rect(2,6,12,5,c);rect(6,5,3,3,'#f6baa7');
      }else if(id==='feather'){ctx.clearRect(0,0,16,16);rect(7,2,5,9,'#f3f4f0');rect(5,6,6,6,'#dce0dc');rect(6,9,2,6,'#9eaaab');}
      else if(id==='leather'){ctx.clearRect(0,0,16,16);rect(3,2,10,12,'#895333');rect(1,4,3,8,'#b37c53');rect(12,4,3,8,'#b37c53');}
      else if(id.endsWith('bucket')||id==='bucket'){
        ctx.clearRect(0,0,16,16);rect(3,3,10,3,'#dce4eb');rect(4,5,8,9,'#87949f');rect(5,7,6,5,id==='water_bucket'?'#238ce8':id==='lava_bucket'?'#ff7b1f':'#414c5b');rect(3,12,10,2,'#dce4eb');
      }
      const url=canvas.toDataURL('image/png');pixelImages.set(id,url);pixelCanvases.set(id,canvas);return url;
    }
    function textureFor(id){
      if(pixelTextures.has(id))return pixelTextures.get(id);
      pixelArt(id);
      // Use the actual in-memory canvas. No image URL load or CSP dependency.
      const texture=new THREE.CanvasTexture(pixelCanvases.get(id));
      texture.magFilter=THREE.NearestFilter;
      texture.minFilter=THREE.NearestMipmapNearestFilter;
      texture.colorSpace=THREE.SRGBColorSpace;
      pixelTextures.set(id,texture);
      return texture;
    }
    const blockMats={};for(const id of placeable){
      const opts={map:textureFor(id),side:THREE.DoubleSide};
      if(id==='water')Object.assign(opts,{transparent:true,opacity:.64,depthWrite:false});
      if(id==='lava')Object.assign(opts,{emissive:0x6a2100,emissiveIntensity:.65});
      if(id==='torch')Object.assign(opts,{emissive:0x85501d,emissiveIntensity:.8});
      blockMats[id]=new THREE.MeshLambertMaterial(opts);
    }
    const faces=[
      {n:[0,1,0],c:[[0,1,0],[0,1,1],[1,1,1],[1,1,0]]},{n:[0,-1,0],c:[[0,0,1],[0,0,0],[1,0,0],[1,0,1]]},
      {n:[1,0,0],c:[[1,0,0],[1,1,0],[1,1,1],[1,0,1]]},{n:[-1,0,0],c:[[0,0,1],[0,1,1],[0,1,0],[0,0,0]]},
      {n:[0,0,1],c:[[1,0,1],[1,1,1],[0,1,1],[0,0,1]]},{n:[0,0,-1],c:[[0,0,0],[0,1,0],[1,1,0],[1,0,0]]}
    ];
    const tri=[0,1,2,0,2,3];
    const k3=(x,y,z)=>`${x},${y},${z}`, ck=(x,z)=>`${x},${z}`;
    const hashSeed=s=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;};
    function hash2(x,z){let h=(seedHash+Math.imul(x|0,374761393)+Math.imul(z|0,668265263))|0;h=Math.imul(h^(h>>>13),1274126177);return ((h^(h>>>16))>>>0)/4294967295;}
    const smooth=t=>t*t*(3-2*t);
    function noise(x,z){const x0=Math.floor(x),z0=Math.floor(z),fx=smooth(x-x0),fz=smooth(z-z0),a=hash2(x0,z0),b=hash2(x0+1,z0),c=hash2(x0,z0+1),d=hash2(x0+1,z0+1),u=a+(b-a)*fx,v=c+(d-c)*fx;return u+(v-u)*fz;}
    function hash3(x,y,z){let h=(seedHash+Math.imul(x|0,374761393)+Math.imul(y|0,668265263)+Math.imul(z|0,2246822519))|0;h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967295;}
    function noise3(x,y,z){const x0=Math.floor(x),y0=Math.floor(y),z0=Math.floor(z),u=smooth(x-x0),v=smooth(y-y0),w=smooth(z-z0);const a=hash3(x0,y0,z0),b=hash3(x0+1,y0,z0),c=hash3(x0,y0+1,z0),d=hash3(x0+1,y0+1,z0),e=hash3(x0,y0,z0+1),f=hash3(x0+1,y0,z0+1),g=hash3(x0,y0+1,z0+1),h=hash3(x0+1,y0+1,z0+1);const x00=a+(b-a)*u,x10=c+(d-c)*u,x01=e+(f-e)*u,x11=g+(h-g)*u;const y0v=x00+(x10-x00)*v,y1v=x01+(x11-x01)*v;return y0v+(y1v-y0v)*w;}
    function isSolidBlock(type){return !!type&&type!=='water'&&type!=='lava';}
    const biome=(x,z)=>noise(x*.012+400,z*.012+400);
    const BEDROCK_Y=-64;const heightAt=(x,z)=>Math.max(7,Math.floor(7+noise(x*.035,z*.035)*15+noise(x*.11,z*.11)*5));

    function storeGenerated(x,y,z,type,c){const key=k3(x,y,z);c.blocks.set(key,{x,y,z,type});world.set(key,type);if(type==='sand'&&!sandCandidateKeys.has(key)){sandCandidateKeys.add(key);sandCandidateList.push(key);}}
    function* generateChunkSteps(cx,cz){
      const c={cx,cz,blocks:new Map(),mesh:null};chunks.set(ck(cx,cz),c);const sx=cx*16,sz=cz*16;
      for(let lx=0;lx<16;lx++)for(let lz=0;lz<16;lz++){
        const x=sx+lx,z=sz+lz,h=heightAt(x,z),desert=biome(x,z)>.79;
        for(let y=BEDROCK_Y;y<=h;y++){let type='stone';if(y===BEDROCK_Y||(y<BEDROCK_Y+4&&hash3(x,y,z)>.76))type='bedrock';else if(y===h)type=desert?'sand':'grass';else if(y>=h-3)type=desert?'sand':'dirt';else if(y<-43&&hash2(x*17+y,z*23-y)>.989)type='diamond_ore';else if(y<-18&&hash2(x*31+y,z*19-y)>.972)type='iron_ore';else if(y<18&&hash2(x*13+y,z*11-y)>.93)type='coal_ore';const caveBand=y>BEDROCK_Y+1&&y<h-3;const cave=caveBand&&noise3(x*.052,y*.061,z*.052)>.685&&noise3(x*.105+31,y*.125+17,z*.105-19)>.48;if(cave){if(y<-56)storeGenerated(x,y,z,'lava',c);else if(y<-36)storeGenerated(x,y,z,'water',c);continue;}storeGenerated(x,y,z,type,c);}if(!desert&&h<=9){for(let wy=h+1;wy<=9;wy++)storeGenerated(x,wy,z,'water',c);}
        yield; // One terrain column per slice. Keeps browser responsive.
      }
      for(let lx=3;lx<13;lx+=5)for(let lz=3;lz<13;lz+=5){
        const x=sx+lx,z=sz+lz;if(hash2(x+1500,z+2900)<.52||biome(x,z)>.79||Math.hypot(x,z)<7)continue;
        const h=heightAt(x,z),th=3+Math.floor(hash2(x+10,z+20)*2);
        for(let y=1;y<=th;y++)storeGenerated(x,h+y,z,'oak_log',c);
        for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++)for(let dy=0;dy<=2;dy++)if(Math.abs(dx)+Math.abs(dz)+Math.abs(dy-1)<=4)storeGenerated(x+dx,h+th+dy,z+dz,'oak_leaves',c);
      }
      // Stable, seed-dependent structures. Each chunk draws only its own coordinates.
      // Using global coordinates prevents seams and duplicates at chunk boundaries.
      const putStructure=(x,y,z,type)=>{
        if(x<sx||x>=sx+16||z<sz||z>=sz+16||y<BEDROCK_Y+1||y>85)return;
        const key=k3(x,y,z);if(type===null){c.blocks.delete(key);world.delete(key);return;}
        storeGenerated(x,y,z,type,c);
      };
      const village=(vx,vz)=>{
        const base=heightAt(vx,vz)+1;
        for(let dx=-20;dx<=20;dx++)for(let dz=-20;dz<=20;dz++){
          const x=vx+dx,z=vz+dz;if(Math.abs(dx)<=2||Math.abs(dz)<=2){
            putStructure(x,base-1,z,'dirt');putStructure(x,base,z,'oak_planks');
            for(let y=base+1;y<=base+4;y++)putStructure(x,y,z,null);
          }
        }
        // Four simple village houses with doors, windows, and pitched roofs.
        for(const [ox,oz] of [[-12,-12],[12,-12],[-12,12],[12,12]]){
          const px=vx+ox,pz=vz+oz;
          for(let dx=-4;dx<=4;dx++)for(let dz=-4;dz<=4;dz++){
            const x=px+dx,z=pz+dz;
            for(let dy=0;dy<=7;dy++){
              const edge=Math.abs(dx)===4||Math.abs(dz)===4;
              let type=null;
              if(dy===0)type='oak_planks';
              else if(dy<=4&&edge){
                const door=dz===(oz<0?4:-4)&&dx===0&&dy<=2;
                const window=dy===2&&((Math.abs(dx)===4&&dz===0)||(Math.abs(dz)===4&&Math.abs(dx)===2));
                type=door||window?null:(Math.abs(dx)===4&&Math.abs(dz)===4?'oak_log':'oak_planks');
              }else if(dy===5&&Math.abs(dx)<=4&&Math.abs(dz)<=4)type='oak_planks';
              else if(dy===6&&Math.abs(dx)<=3&&Math.abs(dz)<=3)type='oak_planks';
              else if(dy===7&&Math.abs(dx)<=1&&Math.abs(dz)<=2)type='oak_planks';
              putStructure(x,base+dy,z,type);
            }
          }
          putStructure(px,base-1,pz,'dirt');
        }
        // Central stone well.
        for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++){
          putStructure(vx+dx,base,vz+dz,Math.abs(dx)===2||Math.abs(dz)===2?'stone':'water');
          for(let y=base+1;y<=base+2;y++)if(Math.abs(dx)===2&&Math.abs(dz)===2)putStructure(vx+dx,y,vz+dz,'stone');
          putStructure(vx+dx,base+4,vz+dz,'oak_planks');
        }
      };
      const temple=(tx,tz)=>{
        const base=heightAt(tx,tz)+1;
        for(let dx=-12;dx<=12;dx++)for(let dz=-12;dz<=12;dz++){
          const x=tx+dx,z=tz+dz;
          for(let dy=0;dy<=10;dy++){
            const rad=11-dy,inside=Math.abs(dx)<=rad&&Math.abs(dz)<=rad;
            let type=null;
            if(inside){const edge=Math.abs(dx)>=rad-1||Math.abs(dz)>=rad-1;
              if(dy===0||edge||dy===9)type=((Math.abs(dx)+Math.abs(dz))%8===0&&dy<6)?'red_sandstone':'sandstone';
            }
            const entry=(dx===0||dx===1)&&dz===11-dy&&dy>=1&&dy<=4;
            if(inside||entry)putStructure(x,base+dy,z,entry?null:type);
          }
        }
        for(const ox of [-8,8])for(const oz of [-8,8])for(let dy=1;dy<=7;dy++){
          for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++)putStructure(tx+ox+dx,base+dy,tz+oz+dz,(dy%3===0)?'red_sandstone':'sandstone');
        }
        for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++)putStructure(tx+dx,base+1,tz+dz,'red_sandstone');
        putStructure(tx,base+2,tz,'chest');
      };
      // Check nearby 128x128 regions. Terrain and structure layout share the world seed.
      for(let rx=Math.floor((sx-52)/128);rx<=Math.floor((sx+68)/128);rx++)
      for(let rz=Math.floor((sz-52)/128);rz<=Math.floor((sz+68)/128);rz++){
        const vx=rx*128+24+Math.floor(hash2(rx*53+1201,rz*97+309)*80);
        const vz=rz*128+24+Math.floor(hash2(rx*113-498,rz*59+851)*80);
        if(Math.hypot(vx,vz)>25&&hash2(rx*17+712,rz*29+455)>.64){
          if(biome(vx,vz)<.73&&Math.abs(heightAt(vx-15,vz)-heightAt(vx+15,vz))<7&&Math.abs(heightAt(vx,vz-15)-heightAt(vx,vz+15))<7)village(vx,vz);
          else if(biome(vx,vz)>.77)temple(vx,vz);
        }
      }
      for(const [key,type] of mods){const [x,y,z]=key.split(',').map(Number);if(Math.floor(x/16)!==cx||Math.floor(z/16)!==cz)continue;if(type===null){c.blocks.delete(key);world.delete(key);}else storeGenerated(x,y,z,type,c);}
    }
    function generateChunk(cx,cz){for(const _ of generateChunkSteps(cx,cz)){} }
    function disposeChunk(c){if(c.mesh){scene.remove(c.mesh);c.mesh.geometry.dispose();c.mesh=null;}}
    function* buildChunkSteps(c){
      // Keep the previous mesh visible while the replacement is built.
const byType=placeable.map(()=>[]),normByType=placeable.map(()=>[]),idx=Object.fromEntries(placeable.map((id,i)=>[id,i]));
      let meshWork=0;
      for(const b of c.blocks.values()){
        if(++meshWork%500===0)yield;
        for(const f of faces){const neighbour=world.get(k3(b.x+f.n[0],b.y+f.n[1],b.z+f.n[2]));const currentSolid=isSolidBlock(b.type),neighbourSolid=isSolidBlock(neighbour);if(neighbour&&!(currentSolid&&!neighbourSolid))continue;const p=byType[idx[b.type]],n=normByType[idx[b.type]];for(const j of tri){const v=f.c[j];p.push(b.x-c.cx*16+v[0],b.y+v[1],b.z-c.cz*16+v[2]);n.push(f.n[0],f.n[1],f.n[2]);}}}
      if(chunks.get(ck(c.cx,c.cz))!==c)return;
      disposeChunk(c);
      const pos=[],norm=[],geo=new THREE.BufferGeometry();let offset=0;
      for(let i=0;i<placeable.length;i++){const p=byType[i],n=normByType[i];if(!p.length)continue;geo.addGroup(offset,p.length/3,i);for(let j=0;j<p.length;j++)pos.push(p[j]);for(let j=0;j<n.length;j++)norm.push(n[j]);offset+=p.length/3;}
      if(!pos.length)return;geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setAttribute('normal',new THREE.Float32BufferAttribute(norm,3));c.mesh=new THREE.Mesh(geo,placeable.map(id=>blockMats[id]));c.mesh.position.set(c.cx*16,0,c.cz*16);scene.add(c.mesh);
    }
    function buildChunk(c){for(const _ of buildChunkSteps(c)){} }
    function rebuildAll(){for(const c of chunks.values())buildChunk(c);}
    function removeChunk(cx,cz){const key=ck(cx,cz),c=chunks.get(key);if(!c)return;disposeChunk(c);for(const [blockKey,b] of c.blocks){world.delete(blockKey);if(b.type==='sand')sandCandidateKeys.delete(blockKey);}dirtyChunkKeys.delete(key);chunks.delete(key);}
    function updateChunks(force=false){
      const cx=Math.floor(player.position.x/16),cz=Math.floor(player.position.z/16);
      if(!force&&cx===lastChunkX&&cz===lastChunkZ)return;
      lastChunkX=cx;lastChunkZ=cz;
      const keep=new Set();
      for(let x=-renderDistance;x<=renderDistance;x++){
        for(let z=-renderDistance;z<=renderDistance;z++){
          if(x*x+z*z<=renderDistance*renderDistance+1)keep.add(ck(cx+x,cz+z));
        }
      }
      desiredChunkKeys=keep;
      if(activeMeshBuild&&!keep.has(activeMeshKey)){activeMeshBuild=null;activeMeshKey=null;}
      if(activeChunkBuild&&!keep.has(activeChunkKey)){
        const old=chunks.get(activeChunkKey);
        if(old)removeChunk(old.cx,old.cz);
        activeChunkBuild=null;activeChunkKey=null;
      }
      for(let i=chunkQueue.length-1;i>=0;i--){
        if(!keep.has(chunkQueue[i].key)){
          queuedChunkKeys.delete(chunkQueue[i].key);
          chunkQueue.splice(i,1);
        }
      }
      for(const c of [...chunks.values()]){
        if(!keep.has(ck(c.cx,c.cz)))removeChunk(c.cx,c.cz);
      }
      const pending=[];
      for(let x=-renderDistance;x<=renderDistance;x++){
        for(let z=-renderDistance;z<=renderDistance;z++){
          if(x*x+z*z>renderDistance*renderDistance+1)continue;
          const nx=cx+x,nz=cz+z,key=ck(nx,nz);
          if(!chunks.has(key)&&!queuedChunkKeys.has(key))pending.push({cx:nx,cz:nz,key,d:x*x+z*z});
        }
      }
      pending.sort((a,b)=>a.d-b.d);
      for(const entry of pending){chunkQueue.push(entry);queuedChunkKeys.add(entry.key);}
      // Always load the player's own chunk immediately so the spawn floor exists.
      const centerKey=ck(cx,cz);
      if(!chunks.has(centerKey)){
        queuedChunkKeys.delete(centerKey);
        const i=chunkQueue.findIndex(q=>q.key===centerKey);
        if(i>=0)chunkQueue.splice(i,1);
        generateChunk(cx,cz);
        const center=chunks.get(centerKey);
        if(center)buildChunk(center);
      }
    }
    function markChunkDirty(cx,cz){const key=ck(cx,cz);if(chunks.has(key)&&!dirtyChunkKeys.has(key)){dirtyChunkKeys.add(key);dirtyChunkQueue.push(key);}}
    let activeChunkBuild=null,activeChunkKey=null,lastChunkMeshAt=0,activeMeshBuild=null,activeMeshKey=null;
    function processChunkQueue(){
      // Generate only 10-24 terrain columns in a frame. No full-chunk spike.
      let columns=quality==='High'?24:quality==='Medium'?16:10;
      const deadline=performance.now()+ (quality==='Low'?3.5:quality==='Medium'?5:7);
      while(columns>0&&performance.now()<deadline){
        if(!activeChunkBuild){
          if(!chunkQueue.length)break;
          const q=chunkQueue.shift();queuedChunkKeys.delete(q.key);
          if(!desiredChunkKeys.has(q.key)||chunks.has(q.key))continue;
          activeChunkKey=q.key;
          activeChunkBuild=generateChunkSteps(q.cx,q.cz);
        }
        const result=activeChunkBuild.next();columns--;
        if(result.done){
          const key=activeChunkKey;
          activeChunkBuild=null;activeChunkKey=null;
          const c=chunks.get(key);
          if(c){
            markChunkDirty(c.cx,c.cz);
            for(const [nx,nz] of [[c.cx-1,c.cz],[c.cx+1,c.cz],[c.cx,c.cz-1],[c.cx,c.cz+1]])markChunkDirty(nx,nz);
          }
        }
      }
      // Split expensive chunk meshing across rendering frames too.
      const meshDeadline=performance.now()+(quality==='Low'?2.5:quality==='Medium'?3.5:5);
      let meshSlices=quality==='High'?10:quality==='Medium'?6:4;
      while(meshSlices-->0&&performance.now()<meshDeadline){
        if(!activeMeshBuild){
          if(!dirtyChunkQueue.length)break;
          const key=dirtyChunkQueue.shift();dirtyChunkKeys.delete(key);
          const c=chunks.get(key);
          if(!c||!desiredChunkKeys.has(key))continue;
          activeMeshKey=key;
          activeMeshBuild=buildChunkSteps(c);
        }
        if(activeMeshBuild.next().done){
          activeMeshBuild=null;
          activeMeshKey=null;
        }
      }
      if(sandCursor>2048){sandCandidateList=sandCandidateList.slice(sandCursor).filter(key=>sandCandidateKeys.has(key));sandCursor=0;}
    }
        function ensureChunkAt(x,z){const cx=Math.floor(x/16),cz=Math.floor(z/16),key=ck(cx,cz);queuedChunkKeys.delete(key);const qi=chunkQueue.findIndex(q=>q.key===key);if(qi>=0)chunkQueue.splice(qi,1);let c=chunks.get(key);if(!c){generateChunk(cx,cz);c=chunks.get(key);if(c){markChunkDirty(cx,cz);for(const [nx,nz] of [[cx-1,cz],[cx+1,cz],[cx,cz-1],[cx,cz+1]])markChunkDirty(nx,nz);}}return c;}
    function changeBlock(x,y,z,type){x=Math.floor(x);y=Math.floor(y);z=Math.floor(z);const key=k3(x,y,z),c=chunks.get(ck(Math.floor(x/16),Math.floor(z/16)));if(!c)return false;if(type===null){c.blocks.delete(key);world.delete(key);sandCandidateKeys.delete(key);}else{c.blocks.set(key,{x,y,z,type});world.set(key,type);if(type==='sand'&&!sandCandidateKeys.has(key)){sandCandidateKeys.add(key);sandCandidateList.push(key);}else if(type!=='sand')sandCandidateKeys.delete(key);}mods.set(key,type);markChunkDirty(c.cx,c.cz);if(x%16===0)markChunkDirty(c.cx-1,c.cz);if((x+1)%16===0)markChunkDirty(c.cx+1,c.cz);if(z%16===0)markChunkDirty(c.cx,c.cz-1);if((z+1)%16===0)markChunkDirty(c.cx,c.cz+1);if(type==='water'&&!flowDepth.has(key))flowDepth.set(key,0);
      if(type!=='water')flowDepth.delete(key);
      if(type===null||type==='water')wakeNearbyWater(x,y,z);wakeSand(x,y+1,z);wakeSand(x,y,z);
      return true;}
    function groundAt(x,z,maxFeet=Infinity){const bx=Math.floor(x),bz=Math.floor(z);const top=Math.min(120,Math.floor(maxFeet-0.001));for(let y=top;y>=BEDROCK_Y;y--)if(isSolidBlock(world.get(k3(bx,y,bz))))return y+1;return BEDROCK_Y+1;}
    function floorAt(x,z,maxFeet=Infinity){return groundAt(x,z,maxFeet);}
    function collides(x,y,z){if(y<=BEDROCK_Y)return true;for(let a=Math.floor(x-.3);a<=Math.floor(x+.3);a++)for(let b=Math.floor(y+.001);b<=Math.floor(y+1.799);b++)for(let c=Math.floor(z-.3);c<=Math.floor(z+.3);c++)if(isSolidBlock(world.get(k3(a,b,c))))return true;return false;}
    function fluidAt(x,y,z){return world.get(k3(Math.floor(x),Math.floor(y),Math.floor(z)));}
    function playerFluid(){const samples=[.15,.75,1.35,1.7].map(h=>fluidAt(player.position.x,player.position.y+h,player.position.z));return{water:samples.includes('water'),lava:samples.includes('lava')};}

    // Models
    function box(parent,w,h,d,mat,x,y,z){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);parent.add(m);return m;}
    const viewmodel=new THREE.Group();camera.add(viewmodel);
    const vmSleeveMat=new THREE.MeshBasicMaterial({color:avatars[avatarChoice].shirt}),vmSkinMat=new THREE.MeshBasicMaterial({color:avatars[avatarChoice].skin}),vmDarkMat=new THREE.MeshBasicMaterial({color:0x393939});
    const vmArm=new THREE.Group();viewmodel.add(vmArm);box(vmArm,.24,.48,.27,vmSleeveMat,.38,-.39,-.73);box(vmArm,.21,.25,.24,vmSkinMat,.38,-.68,-.76);
    const vmHeld=new THREE.Group();viewmodel.add(vmHeld);vmHeld.position.set(.55,-.48,-.86);vmHeld.rotation.set(-.18,-.1,-.25);
    function updateViewmodel(){while(vmHeld.children.length){const child=vmHeld.children[0];vmHeld.remove(child);child.geometry?.dispose();if(child.material?.dispose)child.material.dispose();}const id=inventory[selectedSlot]?.id;if(id){const color=new THREE.MeshBasicMaterial({map:textureFor(id),side:THREE.DoubleSide});if(placeable.includes(id)){box(vmHeld,.27,.27,.27,color,0,0,0);}else if(id.includes('sword')){box(vmHeld,.075,.5,.09,color,0,.25,0);box(vmHeld,.25,.07,.11,vmDarkMat,0,-.02,0);box(vmHeld,.08,.22,.08,vmDarkMat,0,-.16,0);}else if(id.includes('pickaxe')||id.includes('axe')){box(vmHeld,.07,.52,.07,vmDarkMat,0,-.05,0);box(vmHeld,.36,.10,.12,color,0,.22,0);}else{box(vmHeld,.16,.36,.16,color,0,0,0);}}viewmodel.visible=firstPerson&&!paused&&!inventoryOpen&&!chatOpen;vmSleeveMat.color.setHex(avatarAppearance?.shirt??(avatars[avatarChoice]||avatars.Steve).shirt);vmSkinMat.color.setHex(avatarAppearance?.skin??(avatars[avatarChoice]||avatars.Steve).skin);}
    function makeAvatar(name,preset,appearance=null){const colors={...(avatars[preset]||avatars.Steve),...(appearance||{})},g=new THREE.Group(),body=new THREE.Group();g.add(body);const skin=new THREE.MeshLambertMaterial({color:colors.skin}),shirt=new THREE.MeshLambertMaterial({color:colors.shirt}),pants=new THREE.MeshLambertMaterial({color:colors.pants}),dark=new THREE.MeshLambertMaterial({color:0x222222});const ll=new THREE.Group();ll.position.set(-.23,.85,0);body.add(ll);box(ll,.35,.85,.4,pants,0,-.4,0);const rl=new THREE.Group();rl.position.set(.23,.85,0);body.add(rl);box(rl,.35,.85,.4,pants,0,-.4,0);box(body,.9,.9,.45,shirt,0,1.25,0);const head=new THREE.Group();head.position.set(0,2.1,0);body.add(head);box(head,.7,.7,.7,skin,0,0,0);box(head,.12,.12,.05,dark,-.17,.1,-.36);box(head,.12,.12,.05,dark,.17,.1,-.36);const la=new THREE.Group();la.position.set(-.57,1.65,0);body.add(la);box(la,.3,.9,.35,shirt,0,-.4,0);const ra=new THREE.Group();ra.position.set(.57,1.65,0);body.add(ra);box(ra,.3,.9,.35,shirt,0,-.4,0);const canvas=document.createElement('canvas');canvas.width=512;canvas.height=128;const ctx=canvas.getContext('2d');ctx.fillStyle='#0009';ctx.fillRect(0,0,512,128);ctx.font='bold 64px Arial';ctx.textAlign='center';ctx.fillStyle='white';ctx.fillText(String(name||'Player').slice(0,18),256,84);const tag=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(canvas),transparent:true,depthTest:false}));tag.scale.set(2.25,.56,1);tag.position.y=3.15;g.add(tag);if(colors.cape){const cape=new THREE.Mesh(new THREE.BoxGeometry(.72,1.12,.06),new THREE.MeshLambertMaterial({color:colors.cape}));cape.position.set(0,1.48,.29);body.add(cape);}return{group:g,head,leftLeg:ll,rightLeg:rl,leftArm:la,rightArm:ra,name,preset,appearance:colors};}
    function pose(model,s){model.group.position.set(s.x||0,s.y||0,s.z||0);model.group.rotation.y=s.yaw||0;model.head.rotation.x=s.pitch||0;const swing=s.moving?Math.sin((s.walk||0)*1)*.45:0;model.leftLeg.rotation.x=swing;model.rightLeg.rotation.x=-swing;model.leftArm.rotation.x=-swing;model.rightArm.rotation.x=swing;}
    let localAvatar=makeAvatar(playerName,avatarChoice),player=localAvatar.group;scene.add(player);player.visible=false;
    function addRemote(id,data){if(remotePlayers.has(id))return remotePlayers.get(id);const model=makeAvatar(data.name||'Player',data.avatar||'Steve',data.appearance||null);model.group.traverse(o=>{if(o.isMesh)o.userData.remotePlayer=id;});scene.add(model.group);const r={id,model,state:{x:player.position.x+2,y:player.position.y,z:player.position.z,yaw:0,pitch:0,hp:20,moving:false,walk:0}};remotePlayers.set(id,r);return r;}
    function removeRemote(id){const r=remotePlayers.get(id);if(r){scene.remove(r.model.group);remotePlayers.delete(id);}}

    // HUD
    const crosshair=document.createElement('div');crosshair.className='fm-crosshair';crosshair.innerHTML='<svg width="24" height="24" viewBox="0 0 24 24" shape-rendering="crispEdges"><path d="M12 2V9 M12 15V22 M2 12H9 M15 12H22" stroke="#151515" stroke-width="5"/><path d="M12 2V9 M12 15V22 M2 12H9 M15 12H22" stroke="white" stroke-width="3"/></svg>';ROOT.appendChild(crosshair);
    const health=document.createElement('div');health.className='fm-health';ROOT.appendChild(health);
    const airHud=document.createElement('div');airHud.className='fm-air';ROOT.appendChild(airHud);
    function updateAirHud(submerged){airHud.style.display=submerged?'flex':'none';if(!submerged)return;airHud.innerHTML='';for(let i=0;i<10;i++){const cell=document.createElement('span');cell.className='fm-bubble'+(oxygen<=i*1.5?' empty':'');airHud.appendChild(cell);}}
    let lastAirDisplay=-1;
    function updateBreathing(dt){
      const headFluid=fluidAt(player.position.x,player.position.y+1.65,player.position.z);
      const submerged=headFluid==='water';
      if(submerged&&gameMode!=='Creative'){
        const previousAir=oxygen;oxygen=Math.max(0,oxygen-dt);
        if(oxygen<=0){drownTimer+=Math.max(0,dt-previousAir);while(drownTimer>=1){drownTimer-=1;damagePlayer(2,true);}}
      }else{oxygen=15;drownTimer=0;}
      const display=submerged?Math.floor(oxygen*2):-1;if(display!==lastAirDisplay){updateAirHud(submerged);lastAirDisplay=display;}else if(!submerged)airHud.style.display='none';
    }

    const hungerHud=document.createElement('div');hungerHud.className='fm-hunger';ROOT.appendChild(hungerHud);
    redFlash=document.createElement('div');redFlash.className='fm-damage-flash';ROOT.appendChild(redFlash);
    const debugHud=document.createElement('div');debugHud.className='fm-debug';ROOT.appendChild(debugHud);
    function heartSVG(kind){const clip=kind==='half'?'style="clip-path:inset(0 50% 0 0)"':'';const color=kind==='empty'?'#555':'#e43b3b';return `<svg class="fm-heart" viewBox="0 0 18 18" shape-rendering="crispEdges"><path d="M3 2H7V3H11V2H15V4H16V8H15V10H13V12H11V14H9V16H7V14H5V12H3V10H1V4H3Z" fill="#222"/><path ${clip} d="M3 3H7V4H11V3H14V5H15V8H14V10H12V12H10V14H8V15H7V13H5V11H3V9H2V5H3Z" fill="${color}"/></svg>`;}
    function updateHealth(animated=false){const previous=lastHp;health.innerHTML='';for(let i=0;i<10;i++){const v=hp-i*2,k=v>=2?'full':v>=1?'half':'empty',wrap=document.createElement('span');wrap.innerHTML=heartSVG(k);const h=wrap.firstElementChild;if(hp<=6)h.classList.add('low');if(animated&&hp<previous&&i>=Math.floor(hp/2)&&i<Math.ceil(previous/2))h.classList.add('damage');health.appendChild(h);}if(animated&&hp<previous){redFlash.classList.remove('active');void redFlash.offsetWidth;redFlash.classList.add('active');}lastHp=hp;updateHunger();}
    function updateHunger(){hungerHud.innerHTML='';for(let i=0;i<10;i++){const n=hunger-i*2,full=n>=2,half=n>=1;const s=document.createElement('span');s.className='fm-food';s.innerHTML=`<svg viewBox="0 0 18 18" shape-rendering="crispEdges"><path d="M3 2H7V4H10V6H13V9H15V13H12V15H7V13H4V10H2V6H3Z" fill="#222"/><path d="M4 4H7V6H10V8H13V12H11V13H7V11H5V9H3V6H4Z" fill="${full?'#b97848':half?'#a47a62':'#555'}"/></svg>`;hungerHud.appendChild(s);}}
    const hotbar=document.createElement('div');hotbar.className='fm-hotbar';ROOT.appendChild(hotbar);
    function drawIcon(id){const d=document.createElement('div');d.className='fm-item-icon';d.style.backgroundImage=`url(${pixelArt(id)})`;d.style.backgroundSize='100% 100%';d.style.backgroundRepeat='no-repeat';d.style.border='0';d.title=items[id]?.[0]||id;return d;}
    function updateHotbar(){hotbar.innerHTML='';for(let i=0;i<9;i++){const s=inventory[i],cell=document.createElement('div');cell.className='fm-slot'+(i===selectedSlot?' selected':'');cell.title=s?(items[s.id]?.[0]||s.id):`Slot ${i+1}`;cell.setAttribute('aria-label',cell.title);if(s)wireItemHover(cell,s.id);const n=document.createElement('span');n.className='fm-slot-number';n.textContent=i+1;cell.appendChild(n);if(s){cell.appendChild(drawIcon(s.id));const c=document.createElement('span');c.className='fm-item-count';if(s.count>1){c.textContent=s.count;cell.appendChild(c);}}hotbar.appendChild(cell);}if(typeof viewmodel!=='undefined')updateViewmodel();}
    const meterWrap=document.createElement('div');meterWrap.className='fm-meter-wrap';const meter=document.createElement('div');meter.className='fm-meter';meterWrap.appendChild(meter);ROOT.appendChild(meterWrap);
    const progressWrap=document.createElement('div');progressWrap.className='fm-progress-wrap';const progressFill=document.createElement('div');progressFill.className='fm-progress';progressWrap.appendChild(progressFill);ROOT.appendChild(progressWrap);
    const toast=document.createElement('div');toast.className='fm-toast';ROOT.appendChild(toast);function showToast(title,detail=''){toast.innerHTML=`<strong>${escapeHTML(title)}</strong>${escapeHTML(detail)}`;toast.style.display='block';toastTimer=3;}
    function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
    const info=document.createElement('div');info.className='fm-info';ROOT.appendChild(info);
    const playerListHud=document.createElement('div');Object.assign(playerListHud.style,{position:'absolute',left:'50%',top:'12px',transform:'translateX(-50%)',display:'none',minWidth:'260px',maxWidth:'min(520px,90vw)',padding:'12px 18px',background:'#101820dd',border:'2px solid #8b969b',color:'#fff',font:'14px Arial',zIndex:'22',pointerEvents:'none',boxShadow:'0 4px 15px #0008'});ROOT.appendChild(playerListHud);
    function updatePlayerList(){const rows=[{name:playerName,role:isHost?'Leader':roleById.has(playerId)?'Commander':'Player',local:true},...[...remotePlayers.values()].map(r=>({name:r.model.name,role:r.id===networkHostId?'Leader':roleById.has(r.id)?'Commander':'Player'}))];playerListHud.innerHTML=`<div style="text-align:center;font-weight:bold;margin-bottom:8px">Players (${rows.length}/5)</div>${rows.map(r=>`<div style="display:flex;justify-content:space-between;padding:4px 2px;border-top:1px solid #ffffff22"><span>${escapeHTML(r.name)}${r.local?' (You)':''}</span><span style="color:#b9d2a9">${r.role}</span></div>`).join('')}`;}
    const chat=document.createElement('div');chat.className='fm-chat';const chatLog=document.createElement('div');chatLog.className='fm-chat-log';const chatInput=document.createElement('input');chatInput.className='fm-chat-input';chatInput.maxLength=180;chatInput.placeholder='Message';chat.append(chatLog,chatInput);ROOT.appendChild(chat);
    function addChat(name,text){const line=document.createElement('div');line.textContent=`${name}: ${text}`;chatLog.appendChild(line);while(chatLog.children.length>8)chatLog.removeChild(chatLog.firstChild);}
    const itemTooltip=document.createElement('div');Object.assign(itemTooltip.style,{position:'fixed',zIndex:'1000005',display:'none',padding:'5px 8px',background:'#100e18',border:'1px solid #aaa',color:'#fff',font:'13px Arial',pointerEvents:'none',whiteSpace:'nowrap',boxShadow:'2px 2px #0008'});ROOT.appendChild(itemTooltip);
    const cursorGhost=document.createElement('div');Object.assign(cursorGhost.style,{position:'fixed',zIndex:'1000006',display:'none',pointerEvents:'none',width:'42px',height:'42px',filter:'drop-shadow(2px 2px 2px #000)',transform:'translate(10px,10px)'});ROOT.appendChild(cursorGhost);
    let cursorX=Math.floor(innerWidth/2),cursorY=Math.floor(innerHeight/2);document.addEventListener('mousemove',e=>{cursorX=e.clientX;cursorY=e.clientY;if(cursorStack&&inventoryOpen){cursorGhost.style.left=cursorX+'px';cursorGhost.style.top=cursorY+'px';}});
    function wireItemHover(el,id){if(!el||!id)return;el.addEventListener('mouseenter',e=>{itemTooltip.textContent=items[id]?.[0]||id;itemTooltip.style.display='block';itemTooltip.style.left=Math.min(innerWidth-210,e.clientX+14)+'px';itemTooltip.style.top=Math.min(innerHeight-40,e.clientY+14)+'px';});el.addEventListener('mousemove',e=>{itemTooltip.style.left=Math.min(innerWidth-210,e.clientX+14)+'px';itemTooltip.style.top=Math.min(innerHeight-40,e.clientY+14)+'px';});el.addEventListener('mouseleave',()=>{itemTooltip.style.display='none';});}
    function updateCursorGhost(){if(!cursorStack||!inventoryOpen){cursorGhost.style.display='none';return;}cursorGhost.innerHTML='';const icon=drawIcon(cursorStack.id);icon.style.width='32px';icon.style.height='32px';icon.style.display='block';cursorGhost.appendChild(icon);if(cursorStack.count>1){const count=document.createElement('span');count.textContent=cursorStack.count;Object.assign(count.style,{position:'absolute',right:'0',bottom:'-2px',color:'white',font:'bold 13px Arial',textShadow:'2px 2px black'});cursorGhost.appendChild(count);}cursorGhost.style.left=cursorX+'px';cursorGhost.style.top=cursorY+'px';cursorGhost.style.display='block';}

    // Inventory and crafting
    function countItem(id){return inventory.reduce((n,s)=>n+(s?.id===id?s.count:0),0);}
    function addItem(id,n=1){if(!items[id]||n<=0)return;const max=(id.includes('pickaxe')||id.includes('sword')||id.includes('axe')||id.includes('helmet')||id.includes('chestplate')||id.includes('leggings')||id.includes('boots'))?1:64;for(const s of inventory){if(s&&s.id===id&&s.count<max){const a=Math.min(max-s.count,n);s.count+=a;n-=a;if(!n)break;}}for(let i=0;i<inventory.length&&n>0;i++)if(!inventory[i]){const a=Math.min(max,n);inventory[i]={id,count:a};n-=a;}updateHotbar();if(inventoryOpen)renderInventory();}
    function nearbyTable(){const x=Math.floor(player.position.x),y=Math.floor(player.position.y),z=Math.floor(player.position.z);for(let a=x-4;a<=x+4;a++)for(let b=z-4;b<=z+4;b++)for(let c=y-2;c<=y+2;c++)if(world.get(k3(a,c,b))==='crafting_table')return true;return false;}
    // Recipes inspect occupied squares, not stack sizes: 2 logs in one
    // crafting square still give 4 planks, leaving 1 log behind.
    const craftingPatterns=[
      {lines:['oak_log'],id:'oak_planks',count:4,name:'Oak Planks'},
      {lines:['oak_planks','oak_planks'],id:'stick',count:4,name:'Sticks'},
      {lines:['oak_planks oak_planks','oak_planks oak_planks'],id:'crafting_table',count:1,name:'Crafting Table'},
      {lines:['coal','stick'],id:'torch',count:4,name:'Torches'},
      {lines:['stone stone stone','stone _ stone','stone stone stone'],id:'furnace',count:1,name:'Furnace',bench:true},
      {lines:['oak_planks oak_planks oak_planks','oak_planks _ oak_planks','oak_planks oak_planks oak_planks'],id:'chest',count:1,name:'Chest',bench:true},
      {lines:['iron_ingot _ iron_ingot','_ iron_ingot _'],id:'bucket',count:1,name:'Bucket',bench:true}
    ];
    for(const [material,prefix] of [['oak_planks','wooden'],['stone','stone'],['iron_ingot','iron'],['diamond','diamond']]){
      const prefixName=prefix.charAt(0).toUpperCase()+prefix.slice(1);
      craftingPatterns.push({lines:[`${material} ${material} ${material}` , '_ stick _','_ stick _'],id:`${prefix}_pickaxe`,count:1,name:`${prefixName} Pickaxe`,bench:true});
      if(prefix!=='stone')craftingPatterns.push({lines:[`_ ${material} _`,`_ ${material} _`,'_ stick _'],id:`${prefix}_sword`,count:1,name:`${prefixName} Sword`,bench:true});
      craftingPatterns.push({lines:[`${material} ${material} _`,`${material} stick _`,'_ stick _'],id:`${prefix}_axe`,count:1,name:`${prefixName} Axe`,bench:true});
      if(prefix==='iron'||prefix==='diamond'){
        const list=[['helmet',[`${material} ${material} ${material}`,`${material} _ ${material}`]],['chestplate',[`${material} _ ${material}`,`${material} ${material} ${material}`,`${material} ${material} ${material}`]],['leggings',[`${material} ${material} ${material}`,`${material} _ ${material}`,`${material} _ ${material}`]],['boots',[`${material} _ ${material}`,`${material} _ ${material}`]]];
        for(const [kind,lines] of list)craftingPatterns.push({lines,id:`${prefix}_${kind}`,count:1,name:`${prefixName} ${kind.charAt(0).toUpperCase()+kind.slice(1)}`,bench:true});
      }
    }
    function craftShape(cells,side){
      let minX=side,minY=side,maxX=-1,maxY=-1;
      for(let i=0;i<side*side;i++)if(cells[i]){const x=i%side,y=Math.floor(i/side);minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);}
      if(maxX<0)return'';
      const rows=[];for(let y=minY;y<=maxY;y++){const parts=[];for(let x=minX;x<=maxX;x++)parts.push(cells[y*side+x]||'_');rows.push(parts.join(' '));}return rows.join('|');
    }
    function patternShape(lines){
      const rows=lines.map(line=>line.split(' '));
      const size=Math.max(rows.length,...rows.map(row=>row.length));
      const cells=Array(size*size).fill(null);
      for(let y=0;y<rows.length;y++)for(let x=0;x<rows[y].length;x++){
        const value=rows[y][x];cells[y*size+x]=value==='_'?null:value;
      }
      return craftShape(cells,size);
    }
    function matchRecipe(){
      const size=craftingSize;
      const cells=craftingGrid.slice(0,size*size).map(s=>s?.id||null);
      const shape=craftShape(cells,size);
      if(!shape)return null;
      for(const r of craftingPatterns){if(r.bench&&size<3)continue;if(patternShape(r.lines)===shape){return{id:r.id,count:r.count,name:r.name};}}
      return null;
    }
    function consumeGrid(){
      const recipe=matchRecipe();if(!recipe)return false;
      for(let i=0;i<craftingSize*craftingSize;i++){
        const slot=craftingGrid[i];if(!slot)continue;
        slot.count--;if(slot.count<=0)craftingGrid[i]=null;
      }
      return true;
    }
    const invOverlay=document.createElement('div');invOverlay.className='fm-overlay';ROOT.appendChild(invOverlay);
    function putCursorBack(){
      if(!cursorStack)return;
      let left=cursorStack.count;const id=cursorStack.id;cursorStack=null;
      for(const slot of inventory){if(slot&&slot.id===id&&slot.count<64){const n=Math.min(64-slot.count,left);slot.count+=n;left-=n;if(!left)break;}}
      for(let i=0;i<inventory.length&&left>0;i++)if(!inventory[i]){const n=Math.min(64,left);inventory[i]={id,count:n};left-=n;}
      if(left>0)spawnDroppedItem(id,left,player.position.x,player.position.y,player.position.z);
      updateCursorGhost();
    }
    function moveStack(get,set,e){
      e.preventDefault();const right=e.button===2;const target=get();
      if(!cursorStack){
        if(!target)return;
        if(right){const n=Math.ceil(target.count/2);cursorStack={id:target.id,count:n};target.count-=n;if(target.count<=0)set(null);}
        else{cursorStack=target;set(null);}
      }else if(!target){
        if(right){set({id:cursorStack.id,count:1});cursorStack.count--;if(cursorStack.count<=0)cursorStack=null;}
        else{set(cursorStack);cursorStack=null;}
      }else if(target.id===cursorStack.id){
        const n=Math.min(64-target.count,right?1:cursorStack.count);target.count+=n;cursorStack.count-=n;if(cursorStack.count<=0)cursorStack=null;
      }else if(!right){set(cursorStack);cursorStack=target;}
      updateHotbar();updateCursorGhost();
      if(inventoryOpen)renderInventory();
    }
    function renderInventory(){
      craftingSize=nearbyTable()?3:2;
      invOverlay.innerHTML=`<div class="fm-inventory"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px"><b style="font-size:22px">Inventory</b><button id="fm-close">✕</button></div><div style="display:grid;grid-template-columns:minmax(0,1.2fr) minmax(230px,.8fr);gap:20px"><section><b>Equipment</b><div id="fm-equipment" style="display:grid;grid-template-columns:repeat(5,1fr);gap:4px;margin:8px 0 14px"></div><b>Inventory</b><div class="fm-inv-grid" id="fm-main" style="margin-top:8px"></div><b style="display:block;margin-top:12px">Hotbar</b><div class="fm-inv-grid" id="fm-hot" style="margin-top:8px"></div><div class="fm-small" style="color:#333;margin-top:8px">Left click: pick up/place. Right click: split/place one.</div></section><section><b>${craftingSize===3?'Crafting Table':'Crafting'}</b><div style="display:flex;align-items:center;margin:12px 0"><div class="fm-craft-grid" id="fm-craft"></div><span style="font-size:22px;margin:0 5px">➜</span><button class="fm-craft-output" id="fm-output"></button></div><div class="fm-small" style="color:#333">${craftingSize===3?'3 × 3 crafting':'2 × 2 crafting'}${craftingSize===2?' · Place a crafting table nearby to unlock tools.':''}</div><div id="fm-recipe-name" style="font-weight:bold;margin-top:12px"></div><button class="fm-button" id="fm-craft-button">Craft</button><button class="fm-button fm-secondary" id="fm-book">Recipe Book</button><div class="fm-small" id="fm-hint" style="color:#333"></div><div id="fm-book-list" style="display:none;margin-top:8px;max-height:170px;overflow:auto"></div></section></div></div>`;
      const equipment=invOverlay.querySelector('#fm-equipment');
      const equipSlots=[['head','Helmet'],['chest','Chest'],['legs','Legs'],['feet','Boots'],['offhand','Offhand']];
      for(const [key,label] of equipSlots){
        const get=()=>key==='offhand'?offhand:armour[key];
        const set=v=>{if(key==='offhand')offhand=v;else armour[key]=v;};
        const slot=get(),b=document.createElement('button');b.className='fm-inv-slot';b.style.aspectRatio='1';b.title=label;
        if(slot){b.appendChild(drawIcon(slot.id));wireItemHover(b,slot.id);const n=document.createElement('span');n.className='fm-item-count';n.textContent=slot.count||1;b.appendChild(n);}
        b.addEventListener('click',e=>{if(cursorStack){const good=key==='offhand'||(key==='head'&&cursorStack.id.endsWith('_helmet'))||(key==='chest'&&cursorStack.id.endsWith('_chestplate'))||(key==='legs'&&cursorStack.id.endsWith('_leggings'))||(key==='feet'&&cursorStack.id.endsWith('_boots'));if(!good){showToast('Wrong slot','That item does not fit here.');return;}if(get()){const old=get();set(cursorStack);cursorStack=old;}else{set(cursorStack);cursorStack=null;}}else if(get()){cursorStack=get();set(null);}updateHotbar();updateCursorGhost();renderInventory();});
        equipment.appendChild(b);
      }
      const main=invOverlay.querySelector('#fm-main'),hot=invOverlay.querySelector('#fm-hot');
      function invCell(index,selected){
        const cell=document.createElement('button');cell.className='fm-inv-slot'+(selected?' selected':'');
        const slot=inventory[index];
        if(slot){cell.appendChild(drawIcon(slot.id));wireItemHover(cell,slot.id);const c=document.createElement('span');c.className='fm-item-count';c.textContent=slot.count;cell.appendChild(c);cell.title=items[slot.id]?.[0]||slot.id;}
        cell.addEventListener('pointerdown',e=>{if(e.button===0||e.button===2)moveStack(()=>inventory[index],v=>inventory[index]=v,e);});cell.addEventListener('contextmenu',e=>e.preventDefault());return cell;
      }
      for(let i=9;i<36;i++)main.appendChild(invCell(i,false));
      for(let i=0;i<9;i++)hot.appendChild(invCell(i,i===selectedSlot));
      const grid=invOverlay.querySelector('#fm-craft');grid.style.gridTemplateColumns=`repeat(${craftingSize},38px)`;
      for(let i=0;i<craftingSize*craftingSize;i++){
        const cell=document.createElement('button');cell.className='fm-craft-cell';const slot=craftingGrid[i];
        if(slot){cell.appendChild(drawIcon(slot.id));wireItemHover(cell,slot.id);const c=document.createElement('span');c.className='fm-item-count';c.textContent=slot.count;cell.appendChild(c);}
        cell.addEventListener('pointerdown',e=>{if(e.button===0||e.button===2)moveStack(()=>craftingGrid[i],v=>craftingGrid[i]=v,e);});cell.addEventListener('contextmenu',e=>e.preventDefault());grid.appendChild(cell);
      }
      const recipe=matchRecipe(),out=invOverlay.querySelector('#fm-output');
      if(recipe){out.appendChild(drawIcon(recipe.id));wireItemHover(out,recipe.id);const c=document.createElement('span');c.className='fm-item-count';c.textContent=recipe.count;out.appendChild(c);}
      invOverlay.querySelector('#fm-recipe-name').textContent=recipe?.name||'No recipe';
      const craft=invOverlay.querySelector('#fm-craft-button');craft.disabled=!recipe;
      craft.onclick=()=>{const r=matchRecipe();if(!r||!canCollectDrop(r.id,r.count))return;if(!consumeGrid())return;addItem(r.id,r.count);if(r.id==='crafting_table')unlock('table');renderInventory();};
      invOverlay.querySelector('#fm-hint').textContent=recipe?'Click Craft to collect the output.':'Right-click to place one ingredient at a time.';
      invOverlay.querySelector('#fm-book').onclick=()=>{
        const list=invOverlay.querySelector('#fm-book-list');list.style.display=list.style.display==='none'?'block':'none';
        list.innerHTML=[['Oak Planks','1 Oak Log → 4'],['Sticks','2 Oak Planks → 4'],['Crafting Table','4 Oak Planks'],['Torches','1 Stick + 1 Coal → 4'],['Wooden Pickaxe','3 Planks + 2 Sticks'],['Stone Pickaxe','3 Stone + 2 Sticks'],['Iron Pickaxe','3 Ingots + 2 Sticks'],['Diamond Pickaxe','3 Diamonds + 2 Sticks'],['Wooden / Stone / Iron / Diamond Axes','3 Material + 2 Sticks'],['Swords','2 Material + 1 Stick'],['Iron / Diamond Armour','5–8 Ingots or Diamonds'],['Furnace','8 Stone'],['Chest','8 Oak Planks']].map(([a,b])=>`<div style="padding:6px;border-bottom:1px solid #999"><b>${escapeHTML(a)}</b><div style="font-size:11px;color:#555">${escapeHTML(b)}</div></div>`).join('');
      };
      invOverlay.querySelector('#fm-close').onclick=closeInventory;updateCursorGhost();
    }
    function relockGameMouse(){if(running&&!paused&&!chatOpen){try{const result=renderer.domElement.requestPointerLock();if(result?.catch)result.catch(()=>showLockHint());}catch(e){}}}
    function openInventory(){if(!running||paused)return;inventoryOpen=true;held.left=false;held.right=false;document.exitPointerLock?.();renderInventory();invOverlay.style.display='flex';updateCursorGhost();}
    function closeInventory(){putCursorBack();inventoryOpen=false;for(let i=0;i<craftingGrid.length;i++){const s=craftingGrid[i];if(s){craftingGrid[i]=null;addItem(s.id,s.count);}}invOverlay.style.display='none';itemTooltip.style.display='none';cursorGhost.style.display='none';updateHotbar();relockGameMouse();}
    const chestOverlay=document.createElement('div');chestOverlay.className='fm-overlay';ROOT.appendChild(chestOverlay);
    function syncChest(key){const data=chestInventories.get(key)||Array(27).fill(null);if(isHost){broadcast({type:'chestData',key,items:data});}else if(peer){sendHost({type:'chestUpdate',key,items:data});}}
    function openChest(key,request=true){const firstOpen=openChestKey!==key;openChestKey=key;let data=chestInventories.get(key);if(!data){data=Array(27).fill(null);chestInventories.set(key,data);}if(firstOpen&&request&&!isHost&&peer)sendHost({type:'chestRequest',key});inventoryOpen=true;document.exitPointerLock?.();chestOverlay.innerHTML=`<div class="fm-inventory"><div style="display:flex;justify-content:space-between"><b>Chest</b><button id="fm-chest-close">✕</button></div><div class="fm-inv-grid" id="fm-chest-grid" style="margin:12px 0"></div><b>Inventory</b><div class="fm-inv-grid" id="fm-chest-player" style="margin-top:8px"></div></div>`;const cg=chestOverlay.querySelector('#fm-chest-grid'),pg=chestOverlay.querySelector('#fm-chest-player');function cell(list,i,isChest){const b=document.createElement('button');b.className='fm-inv-slot';const s=list[i];if(s){b.appendChild(drawIcon(s.id));const n=document.createElement('span');n.className='fm-item-count';n.textContent=s.count;b.appendChild(n);}b.onclick=()=>{const stack=list[i];if(cursorStack){if(!stack){list[i]=cursorStack;cursorStack=null;}else if(stack.id===cursorStack.id){const n=Math.min(64-stack.count,cursorStack.count);stack.count+=n;cursorStack.count-=n;if(!cursorStack.count)cursorStack=null;}else{list[i]=cursorStack;cursorStack=stack;}}else if(stack){cursorStack=stack;list[i]=null;}updateHotbar();if(isChest)syncChest(key);openChest(key,false);};return b;}for(let i=0;i<27;i++)cg.appendChild(cell(data,i,true));for(let i=0;i<36;i++)pg.appendChild(cell(inventory,i,false));chestOverlay.querySelector('#fm-chest-close').onclick=()=>{putCursorBack();inventoryOpen=false;openChestKey=null;chestOverlay.style.display='none';updateHotbar();relockGameMouse();};chestOverlay.style.display='flex';}
    function renderChest(key){openChest(key,false);}
    const furnaceOverlay=document.createElement('div');furnaceOverlay.className='fm-overlay';ROOT.appendChild(furnaceOverlay);
    function consumeInventoryItem(id,count=1){if(countItem(id)<count)return false;let left=count;for(let i=0;i<inventory.length;i++){const slot=inventory[i];if(!slot||slot.id!==id)continue;const n=Math.min(left,slot.count);slot.count-=n;left-=n;if(slot.count<=0)inventory[i]=null;if(!left)break;}updateHotbar();return true;}
    function openFurnace(key){inventoryOpen=true;document.exitPointerLock?.();furnaceOverlay.innerHTML=`<div class="fm-inventory"><div style="display:flex;justify-content:space-between;align-items:center"><b>Furnace</b><button id="fm-furnace-close">✕</button></div><div style="margin:15px 0;line-height:1.7">Fuel: <b id="fm-fuel-count">${countItem('coal')} Coal</b><br>Raw iron: <b>${countItem('raw_iron')}</b><br>Raw porkchop: <b>${countItem('raw_porkchop')}</b></div><button class="fm-button" id="fm-smelt-iron">Smelt 1 Iron Ingot</button><button class="fm-button" id="fm-cook-pork">Cook 1 Porkchop</button><div class="fm-small" style="color:#333">Each operation uses one coal. Processing is instant in this prototype.</div></div>`;furnaceOverlay.querySelector('#fm-smelt-iron').onclick=()=>{if(countItem('coal')<1||countItem('raw_iron')<1){showToast('Missing ingredients','You need one coal and raw iron.');return;}consumeInventoryItem('coal');consumeInventoryItem('raw_iron');addItem('iron_ingot',1);openFurnace(key);};furnaceOverlay.querySelector('#fm-cook-pork').onclick=()=>{if(countItem('coal')<1||countItem('raw_porkchop')<1){showToast('Missing ingredients','You need one coal and a raw porkchop.');return;}consumeInventoryItem('coal');consumeInventoryItem('raw_porkchop');addItem('cooked_porkchop',1);openFurnace(key);};furnaceOverlay.querySelector('#fm-furnace-close').onclick=()=>{inventoryOpen=false;furnaceOverlay.style.display='none';updateHotbar();};furnaceOverlay.style.display='flex';}


    // Crack textures and outline
    const crackTextures=[];for(let stage=0;stage<10;stage++){const c=document.createElement('canvas');c.width=64;c.height=64;const ctx=c.getContext('2d');if(stage){ctx.strokeStyle='rgba(15,15,15,.9)';ctx.lineWidth=2;for(let i=0;i<stage+2;i++){const x=8+(i*19+stage*7)%48,y=7+(i*31+stage*11)%48;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+(i%2?12:-13),y+((i%3)-1)*12);ctx.lineTo(x+(i%2?17:-19),y+((i%3)-1)*20);ctx.stroke();}ctx.fillStyle='rgba(0,0,0,.12)';ctx.fillRect(0,0,64,64);}const tex=new THREE.CanvasTexture(c);tex.magFilter=THREE.NearestFilter;tex.minFilter=THREE.NearestFilter;crackTextures.push(tex);}
    const crackMats=crackTextures.map(t=>new THREE.MeshBasicMaterial({map:t,transparent:true,depthWrite:false}));const crackMesh=new THREE.Mesh(new THREE.BoxGeometry(1.006,1.006,1.006),crackMats[0]);crackMesh.visible=false;crackMesh.renderOrder=4;scene.add(crackMesh);
    const outline=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.012,1.012,1.012)),new THREE.LineBasicMaterial({color:0x111111}));outline.visible=false;outline.renderOrder=5;scene.add(outline);

    // Mobs
    function makeZombie(id,x,y,z){const g=new THREE.Group(),green=new THREE.MeshLambertMaterial({color:0x478b43}),purple=new THREE.MeshLambertMaterial({color:0x393b79}),dark=new THREE.MeshLambertMaterial({color:0x111111});box(g,.8,.95,.4,green,0,.95,0);box(g,.58,.58,.58,green,0,1.72,0);box(g,.13,.1,.05,dark,-.14,1.8,-.3);box(g,.13,.1,.05,dark,.14,1.8,-.3);box(g,.3,.9,.35,green,-.55,.95,0);box(g,.3,.9,.35,green,.55,.95,0);box(g,.3,.85,.35,purple,-.2,.42,0);box(g,.3,.85,.35,purple,.2,.42,0);g.position.set(x,y,z);scene.add(g);const m={id,group:g,hp:3,attackTimer:0,hitTimer:0,knockX:0,knockZ:0};for(const child of g.children)child.userData.mob=m;mobs.set(id,m);return m;}
    function removeMob(id){const m=mobs.get(id);if(m){scene.remove(m.group);mobs.delete(id);}}
    function mobSnapshot(){return[...mobs.values()].map(m=>({id:m.id,x:m.group.position.x,y:m.group.position.y,z:m.group.position.z,hp:m.hp,pig:!!m.pig,cow:!!m.cow,chicken:!!m.chicken}));}
    function syncMobs(list){const seen=new Set();for(const d of list){seen.add(d.id);let m=mobs.get(d.id);if(!m)m=d.cow?makeCow(d.id,d.x,d.y,d.z):d.chicken?makeChicken(d.id,d.x,d.y,d.z):d.pig?makePig(d.id,d.x,d.y,d.z):makeZombie(d.id,d.x,d.y,d.z);m.group.position.set(d.x,d.y,d.z);m.hp=d.hp;}for(const id of [...mobs.keys()])if(!seen.has(id))removeMob(id);}
    function spawnMobs(){if(!mobsEnabled||difficulty==='Peaceful')return;for(let i=0;i<3;i++){const a=Math.random()*Math.PI*2,d=14+Math.random()*7,x=Math.floor(player.position.x+Math.cos(a)*d),z=Math.floor(player.position.z+Math.sin(a)*d);ensureChunkAt(x,z);makeZombie(`mob-${mobCounter++}`,x+.5,groundAt(x,z),z+.5);}for(const kind of ['pig','cow','chicken','pig','cow','chicken']){const a=Math.random()*Math.PI*2,d=8+Math.random()*13,x=Math.floor(player.position.x+Math.cos(a)*d),z=Math.floor(player.position.z+Math.sin(a)*d);ensureChunkAt(x,z);const id=`${kind}-${mobCounter++}`,y=groundAt(x,z);if(kind==='pig')makePig(id,x+.5,y,z+.5);else if(kind==='cow')makeCow(id,x+.5,y,z+.5);else makeChicken(id,x+.5,y,z+.5);}}
    function flashMob(m){m.hitTimer=.22;m.group.scale.set(1.06,.94,1.06);for(const mesh of m.group.children){if(!mesh.isMesh||!mesh.material?.color)continue;if(mesh.userData.baseColor===undefined)mesh.userData.baseColor=mesh.material.color.getHex();mesh.material.color.setHex(0xee4242);}}
    const serverAttackTimes=new Map();
    function allowAttack(actor){const now=performance.now(),previous=serverAttackTimes.get(actor)||0;if(now-previous<240)return false;serverAttackTimes.set(actor,now);return true;}
    function weaponDamage(id){return id==='diamond_sword'?7:id==='iron_sword'?6:id==='wooden_sword'?4:id?.endsWith('_axe')?3:id?.endsWith('_pickaxe')?2:1;}
    function attackDamage(actor,critical,claimedCharge=1){const r=remotePlayers.get(actor),item=actor===playerId?inventory[selectedSlot]?.id:r?.state?.selectedItem;
      const charge=THREE.MathUtils.clamp(actor===playerId?attackCharge:claimedCharge,0,1);
      const factor=difficulty==='Hard'?1.2:difficulty==='Easy'?.85:1;
      return Math.max(1,Math.round(weaponDamage(item)*(.22+.78*charge*charge)*(critical&&charge>=.9?1.5:1)*factor*2)/2);
    }
    function setAvatarTint(model,on){model.group.traverse(o=>{if(!o.isMesh||!o.material?.color)return;if(o.userData.originalColor===undefined)o.userData.originalColor=o.material.color.getHex();o.material.color.setHex(on?0xef4242:o.userData.originalColor);});}

    function makePig(id,x,y,z){const g=new THREE.Group(),pink=new THREE.MeshLambertMaterial({color:0xe6a2a0}),dark=new THREE.MeshLambertMaterial({color:0x553b3b});box(g,.95,.7,.65,pink,0,.8,0);box(g,.62,.5,.62,pink,0,1.32,-.12);box(g,.32,.22,.08,dark,0,1.23,-.44);for(const xx of [-.3,.3])for(const zz of [-.2,.2])box(g,.17,.42,.17,dark,xx,.25,zz);g.position.set(x,y,z);scene.add(g);const m={id,group:g,hp:4,attackTimer:0,hitTimer:0,knockX:0,knockZ:0,pig:true};for(const child of g.children)child.userData.mob=m;mobs.set(id,m);return m;}
    function makeCow(id,x,y,z){const g=new THREE.Group(),white=new THREE.MeshLambertMaterial({color:0xe8e2d5}),brown=new THREE.MeshLambertMaterial({color:0x6c4430}),dark=new THREE.MeshLambertMaterial({color:0x28221d});box(g,1.05,.85,.72,white,0,.92,0);box(g,.68,.68,.65,white,0,1.55,-.35);box(g,.34,.26,.12,dark,0,1.36,-.69);for(const xx of [-.22,.22]){box(g,.12,.22,.16,brown,xx,1.9,-.32);box(g,.12,.12,.18,brown,xx,1.2,.02);}for(const xx of [-.34,.34])for(const zz of [-.23,.23])box(g,.18,.48,.18,dark,xx,.28,zz);g.position.set(x,y,z);scene.add(g);const m={id,group:g,hp:5,attackTimer:0,hitTimer:0,knockX:0,knockZ:0,cow:true};for(const child of g.children)child.userData.mob=m;mobs.set(id,m);return m;}
    function makeChicken(id,x,y,z){const g=new THREE.Group(),white=new THREE.MeshLambertMaterial({color:0xf1eee5}),yellow=new THREE.MeshLambertMaterial({color:0xe8c34b}),red=new THREE.MeshLambertMaterial({color:0xc83b35}),dark=new THREE.MeshLambertMaterial({color:0x292929});box(g,.58,.55,.55,white,0,.65,0);box(g,.38,.38,.38,white,0,1.05,-.2);box(g,.22,.16,.2,yellow,0,.99,-.48);box(g,.16,.15,.12,red,0,.81,-.43);for(const xx of [-.15,.15]){box(g,.07,.07,.04,dark,xx,1.1,-.4);box(g,.09,.3,.09,yellow,xx,.22,0);}box(g,.3,.22,.18,white,0,.77,.29);g.position.set(x,y,z);scene.add(g);const m={id,group:g,hp:2,attackTimer:0,hitTimer:0,knockX:0,knockZ:0,chicken:true};for(const child of g.children)child.userData.mob=m;mobs.set(id,m);return m;}


    // Networking helpers
    function sendHost(msg){if(hostConn?.open){try{hostConn.send(msg);return true;}catch(e){return false;}}return false;}
    function broadcast(msg,except=null){for(const [id,c] of connections)if(id!==except&&c.open){try{c.send(msg);}catch(e){}}}
    function disconnect(){for(const c of connections.values()){try{c.close();}catch(e){}}connections.clear();try{hostConn?.close();}catch(e){}hostConn=null;try{peer?.destroy();}catch(e){}peer=null;isHost=false;roomCode='';networkHostId='';playerId='local';}
    const validName=s=>String(s||'Player').replace(/[<>]/g,'').trim().slice(0,18)||'Player';
    const validAvatar=s=>avatars[s]?s:'Steve';
    function playerState(){const selected=inventory[selectedSlot],inventoryCounts={};for(const slot of inventory)if(slot)inventoryCounts[slot.id]=(inventoryCounts[slot.id]||0)+slot.count;return{x:player.position.x,y:player.position.y,z:player.position.z,yaw,pitch,hp,gameMode,inventoryCounts,inventoryEmpty:inventory.filter(s=>!s).length,armour:Object.fromEntries(Object.entries(armour).map(([k,v])=>[k,v?.id||null])),offhand:offhand?.id||null,moving:!!(keys[keybinds.forward]||keys[keybinds.back]||keys[keybinds.left]||keys[keybinds.right]),sprinting:!!keys[keybinds.sprint]&&hunger>6,walk:walking,selectedItem:selected?.id||null,selectedCount:selected?.count||0,selectedSlot};}
    function welcomePacket(){return{type:'welcome',hostId:playerId,seed,worldName,roomCode,difficulty,mobsEnabled,pvpEnabled,chatEnabled,weather,worldTime,dayLength,mods:[...mods],chests:[...chestInventories],players:[{id:playerId,name:playerName,avatar:avatarChoice,appearance:avatarAppearance,...playerState()},...[...remotePlayers.values()].map(r=>({id:r.id,name:r.model.name,avatar:r.model.preset,appearance:r.model.appearance,...r.state}))],mobs:mobSnapshot(),drops:dropSnapshot()};}
    function validReach(s,x,y,z){return [x,y,z].every(Number.isFinite)&&Math.hypot(s.x-(x+.5),s.z-(z+.5))<=7.5&&Math.abs((s.y||0)+1-(y+.5))<=8;}
    function overlaps(x,y,z,s){return s.x+.3>x&&s.x-.3<x+1&&s.y+1.8>y&&s.y<y+1&&s.z+.3>z&&s.z-.3<z+1;}
    function addAchievement(id,name){const names={first_block:'Getting Started',wood:'Tree Hugger',table:'Benchmarking',first_mob:'Monster Hunter',miner:'Dedicated Miner'};showToast('Achievement Get!',`${name}: ${names[id]||id}`);}
    function unlock(id){if(unlocked.has(id))return;unlocked.add(id);if(id==='first_block'||id==='wood'||id==='table'||id==='first_mob'||id==='miner')addAchievement(id,playerName);if(isHost)broadcast({type:'achievement',id,name:playerName});else if(peer)sendHost({type:'achievementRequest',id});}
    function mineAchievement(type,actor){if(actor!==playerId)return;minedCount++;if(minedCount===1)unlock('first_block');if(type==='oak_log')unlock('wood');if(minedCount>=25)unlock('miner');}
    function serverSay(text){addChat('Server',text);broadcast({type:'chat',name:'Server',text});}
    function runServerCommand(actor,raw){const text=String(raw||'').trim();const parts=text.split(/\s+/);const cmd=(parts.shift()||'').toLowerCase();const args=parts;const isLeader=actor===playerId;const allowed=isLeader||roleById.has(actor);const playerFor=id=>id===playerId?{name:playerName,state:{x:player.position.x,y:player.position.y,z:player.position.z}}:remotePlayers.get(id);
      const result=(msg)=>{if(actor===playerId)serverSay(msg);else connections.get(actor)?.send({type:'commandResult',text:msg});};
      if(cmd==='/help'){result('/creative, /survival, /difficulty <peaceful|easy|normal|hard>, /weather <clear|rain>, /time <day|night>, /give <item> [amount], /commander <add|remove> <name>, /pvp <on|off>, /mobs <on|off>');return;}
      if(cmd==='/kick'){if(!isLeader){result('Only the server leader can kick players.');return;}const name=args.join(' ').toLowerCase();for(const [id,c] of connections){const r=remotePlayers.get(id);if(r&&r.model.name.toLowerCase()===name){c.send({type:'kicked'});c.close();connections.delete(id);removeRemote(id);broadcast({type:'playerLeft',id});serverSay(`${r.model.name} was removed.`);return;}}result('Player not found.');return;}
      if(cmd==='/commander'){if(!isLeader){result('Only the server leader can manage Commanders.');return;}const action=(args.shift()||'').toLowerCase(),name=args.join(' ').toLowerCase();let found=null;for(const [id,r] of remotePlayers)if(r.model.name.toLowerCase()===name)found=id;if(action==='add'&&found){roleById.add(found);connections.get(found)?.send({type:'role',role:'Commander'});serverSay(`${remotePlayers.get(found).model.name} is now a Commander.`);}else if(action==='remove'&&found){roleById.delete(found);connections.get(found)?.send({type:'role',role:'Player'});serverSay(`${remotePlayers.get(found).model.name} is no longer a Commander.`);}else result('Usage: /commander add <name> or /commander remove <name>');return;}
      if(!allowed){result('You do not have permission to use that command.');return;}
      if(cmd==='/creative'||cmd==='/survival'){const mode=cmd==='/creative'?'Creative':'Survival';if(actor===playerId){gameMode=mode;serverSay(`${playerName} switched to ${mode}.`);}else{const r=remotePlayers.get(actor);if(r){r.state.gameMode=mode;connections.get(actor)?.send({type:'mode',mode});serverSay(`${r.model.name} switched to ${mode}.`);}}return;}
      if(cmd==='/difficulty'){const d=(args[0]||'').replace(/^./,c=>c.toUpperCase());if(!['Peaceful','Easy','Normal','Hard'].includes(d)){result('Choose Peaceful, Easy, Normal or Hard.');return;}difficulty=d;broadcast({type:'worldSettings',difficulty});serverSay(`Difficulty set to ${d}.`);return;}
      if(cmd==='/weather'){const w=(args[0]||'').toLowerCase();if(!['clear','rain'].includes(w)){result('Use /weather clear or /weather rain.');return;}weather=w==='rain'?'Rain':'Clear';broadcast({type:'worldSettings',weather});serverSay(`Weather set to ${weather}.`);return;}
      if(cmd==='/pvp'){if(!['on','off'].includes((args[0]||'').toLowerCase())){result('Use /pvp on or /pvp off.');return;}pvpEnabled=args[0].toLowerCase()==='on';broadcast({type:'worldSettings',pvpEnabled});serverSay(`PvP ${pvpEnabled?'enabled':'disabled'}.`);return;}
      if(cmd==='/mobs'){if(!['on','off'].includes((args[0]||'').toLowerCase())){result('Use /mobs on or /mobs off.');return;}mobsEnabled=args[0].toLowerCase()==='on';broadcast({type:'worldSettings',mobsEnabled});serverSay(`Mobs ${mobsEnabled?'enabled':'disabled'}.`);return;}
      if(cmd==='/time'){const w=(args[0]||'').toLowerCase();if(w==='day')worldTime=.27;else if(w==='night')worldTime=.78;else{result('Use /time day or /time night.');return;}broadcast({type:'worldSettings',worldTime});serverSay(`Time set to ${w}.`);return;}
      if(cmd==='/give'){const id=(args[0]||'').toLowerCase(),amount=Math.max(1,Math.min(64,Number(args[1])||1));if(!items[id]){result('Unknown item ID.');return;}if(actor===playerId)addItem(id,amount);else connections.get(actor)?.send({type:'give',id,amount});result(`Gave ${amount} ${items[id][0]}.`);return;}
      result('Unknown command. Type /help.');
    }
    // Item entities are world objects, not chunk contents. They survive chunk unloads.
    function makeDropVisual(data){
      if(!data||!items[data.item]||droppedItems.has(data.id))return droppedItems.get(data?.id)||null;
      const material=new THREE.MeshLambertMaterial({map:textureFor(data.item),emissive:0x111111,side:THREE.DoubleSide});
      const mesh=new THREE.Mesh(new THREE.BoxGeometry(.28,.28,.28),material);
      mesh.position.set(data.x,data.y,data.z);mesh.rotation.set(.35,.35,.2);scene.add(mesh);
      const drop={id:data.id,item:data.item,count:data.count||1,x:data.x,y:data.y,z:data.z,age:0,vy:0,mesh};droppedItems.set(data.id,drop);return drop;
    }
    function removeDroppedItem(id){const d=droppedItems.get(id);if(!d)return;scene.remove(d.mesh);d.mesh.geometry.dispose();d.mesh.material.dispose();droppedItems.delete(id);}
    function spawnDroppedItem(item,count,x,y,z){if(!item||!items[item]||count<=0)return null;const data={id:`drop-${roomCode||'local'}-${dropCounter++}`,item,count,x:x+.5,y:y+.65,z:z+.5};const drop=makeDropVisual(data);if(isHost)broadcast({type:'dropSpawn',drop:data});return drop;}
    function dropSnapshot(){return [...droppedItems.values()].map(d=>({id:d.id,item:d.item,count:d.count,x:d.x,y:d.y,z:d.z}));}
    function canCollectDrop(item,count,state=null){const max=(item.includes('pickaxe')||item.includes('sword')||item.includes('axe')||item.includes('helmet')||item.includes('chestplate')||item.includes('leggings')||item.includes('boots'))?1:64;if(!state){let room=inventory.filter(s=>!s).length*max;for(const slot of inventory)if(slot?.id===item)room+=Math.max(0,max-slot.count);return room>=count;}const room=(state.inventoryEmpty||0)*max+Math.max(0,max-(state.inventoryCounts?.[item]||0));return room>=count;}
function updateDroppedItems(dt){
      for(const d of droppedItems.values()){
        d.age+=dt;
        if(hasAuthority()){
          const liquid=fluidAt(d.x,d.y,d.z);
          if(liquid==='water') d.vy=THREE.MathUtils.clamp(d.vy+(2.4-d.vy*2.2)*dt,-.45,1.1);
          else d.vy-=18*dt;
          const floor=groundAt(d.x,d.z,d.y+.1)+.24;
          const next=d.y+d.vy*dt;
          if(next<=floor){d.y=floor;d.vy=0;}else d.y=next;
          d.mesh.position.set(d.x,d.y+Math.sin(d.age*3.2)*.035,d.z);
        } else {
          d.mesh.position.set(d.x,d.y+Math.sin(d.age*3.2)*.06,d.z);
        }
        d.mesh.rotation.y+=dt*.8;
      }
      if(!hasAuthority())return;
      for(const d of [...droppedItems.values()]){
        let collector=null;
        if(Math.hypot(player.position.x-d.x,player.position.z-d.z)<1.2&&Math.abs(player.position.y-d.y)<2.2)collector=playerId;
        if(!collector){
          for(const [id,r] of remotePlayers){
            if(Math.hypot((r.state.x||0)-d.x,(r.state.z||0)-d.z)<1.2&&Math.abs((r.state.y||0)-d.y)<2.2){collector=id;break;}
          }
        }
        if(!collector)continue;
        const remote=collector===playerId?null:remotePlayers.get(collector)?.state;
        if(!canCollectDrop(d.item,d.count,remote))continue;
        if(collector===playerId)addItem(d.item,d.count);
        else connections.get(collector)?.send({type:'item',id:d.item,count:d.count});
        removeDroppedItem(d.id);
        if(isHost)broadcast({type:'dropRemove',id:d.id});
      }
    }
    function dropForBlock(type){if(type==='water'||type==='lava'||type==='bedrock')return null;if(type==='grass')return'dirt';if(type==='iron_ore')return'raw_iron';if(type==='diamond_ore')return'diamond';if(type==='coal_ore')return'coal';if(type==='oak_leaves')return Math.random()<.12?'stick':null;return type;}
    function applyBlockMessage(m){if(pendingMine===k3(m.x,m.y,m.z))pendingMine=null;ensureChunkAt(m.x,m.z);if(!changeBlock(m.x,m.y,m.z,m.block))return;if(m.actor===playerId&&m.block){const s=inventory[m.slot??selectedSlot];if(s&&s.id===m.block&&gameMode!=='Creative'){s.count--;if(s.count<=0)inventory[m.slot??selectedSlot]=null;updateHotbar();}}}
    function hostMine(x,y,z,actor){ensureChunkAt(x,z);const type=world.get(k3(x,y,z));if(!type||type==='water'||type==='lava'||type==='bedrock')return false;const mode=actor===playerId?gameMode:(remotePlayers.get(actor)?.state.gameMode||'Survival');const drop=mode==='Creative'?null:dropForBlock(type);if(!changeBlock(x,y,z,null))return false;broadcast({type:'block',x,y,z,block:null,actor,minedType:type});if(drop)spawnDroppedItem(drop,1,x,y,z);mineAchievement(type,actor);return true;}
    function hostBucketAction(x,y,z,nx,ny,nz,slot,actor){
      x=Math.floor(x);y=Math.floor(y);z=Math.floor(z);slot=Math.max(0,Math.min(35,Number(slot)||0));
      const key=k3(x,y,z),r=remotePlayers.get(actor),heldItem=actor===playerId?inventory[slot]?.id:r?.state.selectedItem;
      if(!heldItem)return false;
      const sendResult=(id)=>{if(actor===playerId){inventory[slot]={id,count:1};updateHotbar();}else connections.get(actor)?.send({type:'bucketResult',slot,item:id});};
      if(heldItem==='bucket'){
        const fluid=world.get(key);if(fluid!=='water'&&fluid!=='lava')return false;
        if(!changeBlock(x,y,z,null))return false;
        if(isHost)broadcast({type:'block',x,y,z,block:null,actor});
        sendResult(fluid+'_bucket');return true;
      }
      if(heldItem==='water_bucket'||heldItem==='lava_bucket'){
        const fluid=heldItem==='water_bucket'?'water':'lava';
        const bx=x+Math.round(nx||0),by=y+Math.round(ny||0),bz=z+Math.round(nz||0);
        ensureChunkAt(bx,bz);const dest=k3(bx,by,bz);
        if(world.has(dest)||by<=BEDROCK_Y)return false;
        const pos=actor===playerId?player.position:r?.state;
        if(pos&&overlaps(bx,by,bz,pos))return false;
        if(!changeBlock(bx,by,bz,fluid))return false;
        if(isHost)broadcast({type:'block',x:bx,y:by,z:bz,block:fluid,actor});
        sendResult('bucket');return true;
      }
      return false;
    }
    function useBucketAt(t){const slot=inventory[selectedSlot];if(!t||!slot||!['bucket','water_bucket','lava_bucket'].includes(slot.id))return false;if(hasAuthority())hostBucketAction(t.x,t.y,t.z,t.normal.x,t.normal.y,t.normal.z,selectedSlot,playerId);else sendHost({type:'bucket',x:t.x,y:t.y,z:t.z,nx:t.normal.x,ny:t.normal.y,nz:t.normal.z,slot:selectedSlot});placeCooldown=.28;return true;}
    function hostPlace(x,y,z,block,actor,slot=selectedSlot){if(!placeable.includes(block))return;ensureChunkAt(x,z);if(world.has(k3(x,y,z)))return;const r=remotePlayers.get(actor),pos=actor===playerId?player.position:r?.state;if(!pos||overlaps(x,y,z,pos))return;if(actor!==playerId&&r?.state.gameMode!=='Creative'&&(r?.state.selectedItem!==block||r?.state.selectedCount<1))return;if(!changeBlock(x,y,z,block))return;broadcast({type:'block',x,y,z,block,actor,slot});if(actor===playerId&&gameMode!=='Creative'){const s=inventory[slot];if(s&&s.id===block){s.count--;if(s.count<=0)inventory[slot]=null;updateHotbar();}}else if(actor!==playerId&&r?.state&&r.state.gameMode!=='Creative'){r.state.selectedCount=Math.max(0,(r.state.selectedCount||1)-1);}}

    function handleNetwork(from,msg){
      if(!msg||typeof msg!=='object')return;
      if(isHost){
        const conn=connections.get(from);if(!conn)return;
        if(msg.type==='hello'){
          if(remotePlayers.size>=4||connections.size>4){conn.send({type:'full'});conn.close();connections.delete(from);return;}
          const r=addRemote(from,{name:validName(msg.name),avatar:validAvatar(msg.avatar),appearance:msg.appearance});r.state={x:player.position.x+2+remotePlayers.size*1.5,y:player.position.y,z:player.position.z,yaw:0,pitch:0,hp:20,moving:false,walk:0};pose(r.model,r.state);
          conn.send(welcomePacket());broadcast({type:'playerJoin',player:{id:from,name:r.model.name,avatar:r.model.preset,appearance:r.model.appearance,...r.state}},from);addChat('Server',`${r.model.name} joined.`);broadcast({type:'chat',name:'Server',text:`${r.model.name} joined.`},from);return;
        }
        const r=remotePlayers.get(from);if(!r)return;
        if(msg.type==='profile'){const nextName=validName(msg.name),nextAvatar=validAvatar(msg.avatar),app=cleanAppearance(msg.appearance);scene.remove(r.model.group);r.model=makeAvatar(nextName,nextAvatar,app);r.model.group.traverse(o=>{if(o.isMesh)o.userData.remotePlayer=from;});scene.add(r.model.group);broadcast({type:'profileUpdate',id:from,name:nextName,avatar:nextAvatar,appearance:app});return;}
        if(msg.type==='state'){r.state={...r.state,...msg.state};pose(r.model,r.state);broadcast({type:'state',id:from,state:r.state},from);return;}
        if(msg.type==='command'){runServerCommand(from,String(msg.text||''));return;}
        if(msg.type==='mine'){ensureChunkAt(msg.x,msg.z);const minedType=world.get(k3(msg.x,msg.y,msg.z));const ok=validReach(r.state,msg.x,msg.y,msg.z)&&!!minedType&&minedType!=='water'&&minedType!=='lava';if(ok){const mined=hostMine(msg.x,msg.y,msg.z,from);conn.send({type:'mineAck',key:k3(msg.x,msg.y,msg.z),ok:!!mined});}else conn.send({type:'mineAck',key:k3(msg.x,msg.y,msg.z),ok:false});return;}
        if(msg.type==='place'){if(validReach(r.state,msg.x,msg.y,msg.z)){ensureChunkAt(msg.x,msg.z);hostPlace(msg.x,msg.y,msg.z,msg.block,from,msg.slot??0);}return;}
        if(msg.type==='bucket'){if(validReach(r.state,msg.x,msg.y,msg.z)){hostBucketAction(msg.x,msg.y,msg.z,msg.nx,msg.ny,msg.nz,msg.slot??0,from);}return;}
        if(msg.type==='chestRequest'||msg.type==='chestUpdate'){const key=String(msg.key||''),parts=key.split(',').map(Number);if(parts.length!==3||!parts.every(Number.isFinite))return;const [x,y,z]=parts;if(!validReach(r.state,x,y,z))return;ensureChunkAt(x,z);if(world.get(key)!=='chest')return;if(msg.type==='chestRequest'){let data=chestInventories.get(key);if(!data){data=Array(27).fill(null);chestInventories.set(key,data);}conn.send({type:'chestData',key,items:data});}else{const data=Array.from({length:27},(_,i)=>{const v=msg.items?.[i];return v&&items[v.id]&&Number.isInteger(v.count)&&v.count>0?{id:v.id,count:Math.min(64,v.count)}:null;});chestInventories.set(key,data);broadcast({type:'chestData',key,items:data},from);if(openChestKey===key&&chestOverlay.style.display==='flex')openChest(key,false);}return;}
        if(msg.type==='hitMob'){const m=mobs.get(msg.id);if(m&&Math.hypot(m.group.position.x-r.state.x,m.group.position.z-r.state.z)<5)damageMob(m,from,!!msg.critical,!!msg.sword,Number(msg.charge)||0);return;}
        if(msg.type==='hitPlayer'&&pvpEnabled){
          const targetId=String(msg.id||''),target=targetId===playerId?null:remotePlayers.get(targetId);
          const tx=targetId===playerId?player.position.x:target?.state.x;
          const tz=targetId===playerId?player.position.z:target?.state.z;
          if(targetId!==from&&Number.isFinite(tx)&&Math.hypot(r.state.x-tx,r.state.z-tz)<4.3&&allowAttack(from)){
            const amount=attackDamage(from,!!msg.critical,Number(msg.charge)||0);
            if(targetId===playerId){damagePlayer(amount);broadcast({type:'playerHit',id:playerId});const dx=player.position.x-r.state.x,dz=player.position.z-r.state.z,dist=Math.hypot(dx,dz)||1;knockbackX=dx/dist*3;knockbackZ=dz/dist*3;}
            else damageRemote(targetId,amount,r.state);
            conn.send({type:'hitConfirmed'});
          }
          return;
        }
        if(msg.type==='chat'){if(chatEnabled){const text=String(msg.text||'').trim().slice(0,180);if(text){addChat(r.model.name,text);broadcast({type:'chat',name:r.model.name,text},from);}}return;}
        if(msg.type==='commanderAction'&&roleById.has(from)){runServerCommand(from,String(msg.text||''));return;}
        if(msg.type==='command'){runServerCommand(from,String(msg.text||''));return;}
        if(msg.type==='achievementRequest'){addAchievement(msg.id,r.model.name);broadcast({type:'achievement',id:msg.id,name:r.model.name},from);return;}
      } else {
        if(msg.type==='welcome'){
          if(running)return;seed=String(msg.seed||'12345');worldName=msg.worldName||'World';roomCode=msg.roomCode||roomCode;networkHostId=String(msg.hostId||'');difficulty=msg.difficulty||'Normal';mobsEnabled=!!msg.mobsEnabled;pvpEnabled=!!msg.pvpEnabled;chatEnabled=msg.chatEnabled!==false;weather=msg.weather||'Clear';worldTime=Number.isFinite(msg.worldTime)?msg.worldTime:.27;dayLength=msg.dayLength||600;
          mods.clear();for(const e of msg.mods||[])mods.set(e[0],e[1]);startWorld({network:true,players:msg.players||[],mobs:msg.mobs||[],chests:msg.chests||[],drops:msg.drops||[]});return;
        }
        if(msg.type==='full'){showMenuMessage('This server is full (maximum 5 players).');disconnect();showMultiplayer();return;}
        if(msg.type==='state'){const r=remotePlayers.get(msg.id)||addRemote(msg.id,msg.state);r.state={...r.state,...msg.state};pose(r.model,r.state);return;}if(msg.type==='profileUpdate'){const r=remotePlayers.get(msg.id);if(r){scene.remove(r.model.group);r.model=makeAvatar(msg.name,msg.avatar,msg.appearance);r.model.group.traverse(o=>{if(o.isMesh)o.userData.remotePlayer=msg.id;});scene.add(r.model.group);pose(r.model,r.state);}return;}
        if(msg.type==='playerJoin'){const p=msg.player;if(p&&p.id!==playerId){const r=addRemote(p.id,{name:p.name,avatar:p.avatar,appearance:p.appearance});r.state={...p};pose(r.model,r.state);}return;}
        if(msg.type==='block'){applyBlockMessage(msg);return;}
        if(msg.type==='chestData'){const key=String(msg.key||'');chestInventories.set(key,Array.isArray(msg.items)?msg.items:Array(27).fill(null));if(openChestKey===key&&chestOverlay.style.display==='flex')openChest(key,false);return;}
        if(msg.type==='item'){addItem(msg.id,msg.count||1);return;}
        if(msg.type==='dropSpawn'){makeDropVisual(msg.drop);return;}
        if(msg.type==='dropRemove'){removeDroppedItem(msg.id);return;}
        if(msg.type==='dropMove'){const d=droppedItems.get(msg.id);if(d&&[msg.x,msg.y,msg.z].every(Number.isFinite)){d.x=msg.x;d.y=msg.y;d.z=msg.z;d.mesh.position.set(d.x,d.y,d.z);}return;}
        if(msg.type==='bucketResult'){const slot=Number(msg.slot);if(Number.isInteger(slot)&&slot>=0&&slot<inventory.length){inventory[slot]={id:msg.item,count:1};updateHotbar();}return;}
        if(msg.type==='mobs'){syncMobs(msg.list||[]);return;}
        if(msg.type==='damage'){hp=Math.max(0,msg.hp);if(Number.isFinite(msg.kx))knockbackX=msg.kx;if(Number.isFinite(msg.kz))knockbackZ=msg.kz;updateHealth(true);if(hp<=0)respawn();return;}
        if(msg.type==='respawn'){player.position.set(msg.x,msg.y,msg.z);hp=20;updateHealth(true);return;}
        if(msg.type==='playerHit'){const r=remotePlayers.get(msg.id);if(r){r.hitUntil=performance.now()+230;setAvatarTint(r.model,true);}return;}
        if(msg.type==='mobHealth'){const m=mobs.get(msg.id);if(m){m.hp=msg.hp;flashMob(m);if(msg.dead)removeMob(msg.id);}return;}
        if(msg.type==='chat'){addChat(msg.name,msg.text);return;}
        if(msg.type==='achievement'){addAchievement(msg.id,msg.name);return;}
        if(msg.type==='playerJoin'){const p=msg.player;if(p&&p.id!==playerId){const r=addRemote(p.id,{name:p.name,avatar:p.avatar,appearance:p.appearance});r.state={...p};pose(r.model,r.state);}return;}
        if(msg.type==='mineAck'){if(pendingMine===msg.key)pendingMine=null;if(!msg.ok){miningKey=null;miningProgress=0;progressFill.style.width='0%';crackMesh.visible=false;}return;}
        if(msg.type==='commandResult'){addChat('Server',msg.text||'');return;}
        if(msg.type==='role'){if(msg.role==='Commander')roleById.add(playerId);else roleById.delete(playerId);showToast('Role',msg.role||'Player');return;}
        if(msg.type==='mode'){gameMode=msg.mode==='Creative'?'Creative':'Survival';showToast('Game Mode',gameMode);return;}
        if(msg.type==='give'){addItem(msg.id,msg.amount||1);return;}
        if(msg.type==='worldSettings'){if(msg.difficulty)difficulty=msg.difficulty;if(msg.weather)weather=msg.weather;if(Number.isFinite(msg.worldTime))worldTime=msg.worldTime;if(msg.dayLength)dayLength=msg.dayLength;if(typeof msg.pvpEnabled==='boolean')pvpEnabled=msg.pvpEnabled;if(typeof msg.mobsEnabled==='boolean')mobsEnabled=msg.mobsEnabled;return;}
        if(msg.type==='playerLeft'){removeRemote(msg.id);addChat('Server','A player left.');return;}
        if(msg.type==='closed'||msg.type==='kicked'){showToast('Disconnected',msg.type==='kicked'?'The host removed you.':'The host closed the server.');disconnect();running=false;setTimeout(showHome,900);return;}
      }
    }

    function damageMob(m,actor,critical,sword,charge=1){
      if(!allowAttack(actor))return;
      m.hp-=attackDamage(actor,critical,charge);flashMob(m);
      const src=actor===playerId?player.position:remotePlayers.get(actor)?.state;
      const dx=m.group.position.x-(src?.x??player.position.x),dz=m.group.position.z-(src?.z??player.position.z),len=Math.hypot(dx,dz)||1;
      m.knockX=dx/len*1.8;m.knockZ=dz/len*1.8;
      if(m.hp<=0){const x=m.group.position.x,y=m.group.position.y,z=m.group.position.z;removeMob(m.id);if(m.cow){spawnDroppedItem('raw_beef',1+Math.floor(Math.random()*2),x,y,z);spawnDroppedItem('leather',1,x+.2,y,z);}else if(m.chicken){spawnDroppedItem('raw_chicken',1+Math.floor(Math.random()*2),x,y,z);spawnDroppedItem('feather',1+Math.floor(Math.random()*2),x-.2,y,z);}else if(m.pig)spawnDroppedItem('raw_porkchop',1+Math.floor(Math.random()*2),x,y,z);else{spawnDroppedItem('rotten_flesh',1,x,y,z);if(actor===playerId)unlock('first_mob');else{const r=remotePlayers.get(actor);broadcast({type:'achievement',id:'first_mob',name:r?.model.name||'Player'});}}}
      broadcast({type:'mobHealth',id:m.id,hp:m.hp,dead:m.hp<=0});
    }
    function damageRemote(id,amount,attacker=null){const r=remotePlayers.get(id),conn=connections.get(id);if(!r||!conn)return;r.state.hp=Math.max(0,(r.state.hp??20)-amount*armorFactor(r.state.armour));const source=attacker||player.position,dx=r.state.x-source.x,dz=r.state.z-source.z,len=Math.hypot(dx,dz)||1;conn.send({type:'damage',hp:r.state.hp,kx:dx/len*3,kz:dz/len*3});r.hitUntil=performance.now()+250;setAvatarTint(r.model,true);broadcast({type:'playerHit',id},id);if(r.state.hp<=0){r.state.x=player.position.x+2;r.state.y=player.position.y;r.state.z=player.position.z;r.state.hp=20;conn.send({type:'respawn',x:r.state.x,y:r.state.y,z:r.state.z,hp:20});}}
    function armorFactor(equipped=armour){let points=0;for(const slot of Object.values(equipped||{})){const id=slot?.id||slot;if(!id)continue;if(id.startsWith('leather_'))points+=1;if(id.startsWith('iron_'))points+=2;if(id.startsWith('diamond_'))points+=3;}return Math.max(.35,1-Math.min(20,points)*.04);}
    function damagePlayer(n,environmental=false){if(gameMode==='Creative'||(difficulty==='Peaceful'&&!environmental))return;hp=Math.max(0,hp-n*armorFactor());updateHealth(true);if(hp<=0)respawn();}
    function respawn(){oxygen=15;drownTimer=0;updateAirHud(false);hp=20;hunger=Math.max(hunger,8);player.position.set(spawnPoint.x,spawnPoint.y,spawnPoint.z);velocityY=0;updateHealth(true);showToast('Respawned','');}
    function updateMobs(dt){
      if(!hasAuthority())return;
      if(mobsEnabled&&difficulty!=='Peaceful'){mobSpawnTimer+=dt;if(mobSpawnTimer>35&&mobs.size<6){mobSpawnTimer=0;const a=Math.random()*Math.PI*2,d=15,x=Math.floor(player.position.x+Math.cos(a)*d),z=Math.floor(player.position.z+Math.sin(a)*d);ensureChunkAt(x,z);makeZombie(`mob-${mobCounter++}`,x+.5,groundAt(x,z),z+.5);}}
      for(const m of [...mobs.values()]){
        const targets=[{id:playerId,x:player.position.x,z:player.position.z}];for(const [id,r] of remotePlayers)targets.push({id,x:r.state.x,z:r.state.z});
        let target=targets[0],best=Infinity;for(const p of targets){const d=Math.hypot(p.x-m.group.position.x,p.z-m.group.position.z);if(d<best){best=d;target=p;}}
        if(m.pig||m.cow||m.chicken){m.attackTimer-=dt;if(m.attackTimer<=0){m.group.rotation.y+=(Math.random()-.5)*.7;m.attackTimer=1.2+Math.random()*2;}const dx=Math.sin(m.group.rotation.y)*.45*dt,dz=Math.cos(m.group.rotation.y)*.45*dt;const nx=m.group.position.x+dx,nz=m.group.position.z+dz;ensureChunkAt(Math.floor(nx),Math.floor(nz));if(!world.has(k3(Math.floor(nx),Math.floor(m.group.position.y),Math.floor(nz)))){m.group.position.x=nx;m.group.position.z=nz;}m.group.position.y=groundAt(Math.floor(nx),Math.floor(nz));}
        else {if(best<27&&best>1.15){const dx=target.x-m.group.position.x,dz=target.z-m.group.position.z,len=Math.hypot(dx,dz)||1,nx=m.group.position.x+dx/len*1.05*dt,nz=m.group.position.z+dz/len*1.05*dt;ensureChunkAt(Math.floor(nx),Math.floor(nz));if(!world.has(k3(Math.floor(nx),Math.floor(m.group.position.y),Math.floor(nz)))){m.group.position.x=nx;m.group.position.z=nz;}m.group.position.y=groundAt(Math.floor(nx),Math.floor(nz));m.group.rotation.y=Math.atan2(-dx,-dz);}
        m.attackTimer-=dt;if(best<1.35&&m.attackTimer<=0){const dmg=difficulty==='Hard'?4:difficulty==='Easy'?1:2;if(target.id===playerId)damagePlayer(dmg);else{const r=remotePlayers.get(target.id);if(r){r.state.hp=Math.max(0,(r.state.hp??20)-dmg*armorFactor(r.state.armour));connections.get(target.id)?.send({type:'damage',hp:r.state.hp});}}m.attackTimer=1.4;}}
        if(m.hitTimer>0){m.hitTimer-=dt;if(m.hitTimer<=0){m.group.scale.set(1,1,1);for(const mesh of m.group.children)if(mesh.isMesh&&mesh.userData.baseColor!==undefined)mesh.material.color.setHex(mesh.userData.baseColor);}}
        if(m.knockX||m.knockZ){m.group.position.x+=m.knockX*dt;m.group.position.z+=m.knockZ*dt;m.knockX*=.8;m.knockZ*=.8;}
      }
    }

    // Menus
    // ---- v11 account system + per-account IndexedDB world storage ----
    let currentAccount=null,activeWorldId=null,activeWorldMode='single',activeRestore=null,lastSaveAt=0,saveBusy=false;
    let presencePeer=null,partyState='solo',partyLeader='',partyConn=null,partyMembers=new Map(),lastInviteAt=0;
    const SAVE_DB='FeatherMC_v11',ENC=new TextEncoder();
    function randomId(){return crypto.randomUUID?crypto.randomUUID():Array.from(crypto.getRandomValues(new Uint32Array(4)),v=>v.toString(16)).join('');}
    function dbOpen(){return new Promise((resolve,reject)=>{
      if(!window.indexedDB)return reject(new Error('This browser blocks IndexedDB.'));
      const r=indexedDB.open(SAVE_DB,1);
      r.onupgradeneeded=()=>{const db=r.result;if(!db.objectStoreNames.contains('accounts'))db.createObjectStore('accounts',{keyPath:'name'});if(!db.objectStoreNames.contains('worlds'))db.createObjectStore('worlds',{keyPath:'id'});};
      r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error||Error('Database failed'));
    });}
    async function dbOperation(store,mode,fn){const db=await dbOpen();return new Promise((resolve,reject)=>{
      let val;const tx=db.transaction(store,mode),os=tx.objectStore(store);
      try{val=fn(os);}catch(e){db.close();reject(e);return;}
      tx.oncomplete=()=>{db.close();resolve(val?.result);};tx.onerror=()=>{db.close();reject(tx.error||Error('Storage failed'));};
    });}
    async function dbGet(store,key){const db=await dbOpen();return new Promise((resolve,reject)=>{const tx=db.transaction(store,'readonly'),r=tx.objectStore(store).get(key);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);tx.oncomplete=()=>db.close();});}
    async function dbPut(store,value){return dbOperation(store,'readwrite',os=>os.put(value));}
    async function dbDelete(store,key){return dbOperation(store,'readwrite',os=>os.delete(key));}
    async function dbAll(store){const db=await dbOpen();return new Promise((resolve,reject)=>{const tx=db.transaction(store,'readonly'),r=tx.objectStore(store).getAll();r.onsuccess=()=>resolve(r.result||[]);r.onerror=()=>reject(r.error);tx.oncomplete=()=>db.close();});}
    function validAccount(s){return /^[a-zA-Z0-9_]{3,16}$/.test(s);}
    async function passwordHash(password,salt){
      if(!crypto.subtle)throw Error('Password hashing needs a secure HTTPS page.');
      const key=await crypto.subtle.importKey('raw',ENC.encode(password),'PBKDF2',false,['deriveBits']);
      const bits=await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:new Uint8Array(salt),iterations:180000},key,256);
      return Array.from(new Uint8Array(bits),n=>n.toString(16).padStart(2,'0')).join('');
    }
    async function showLogin(){menu.style.display='flex';menu.innerHTML=`<div class="fm-box"><div class="fm-logo">FeatherMC</div><p style="text-align:center;color:#b6cfb8">Sign in to your world</p><label class="fm-label">Account name</label><input class="fm-input" id="fm-login-name" maxlength="16" autocomplete="off" placeholder="Your username"><label class="fm-label">Account password</label><input class="fm-input" id="fm-login-pass" type="password" autocomplete="new-password" placeholder="Your password"><button class="fm-button" id="fm-login">Login</button><button class="fm-button fm-secondary" id="fm-register">Make Account</button><div class="fm-small" style="margin-top:14px">Accounts save on this browser only. Choose a new password you do not use anywhere else.</div></div>`;
      const name=menu.querySelector('#fm-login-name'),pw=menu.querySelector('#fm-login-pass'),login=menu.querySelector('#fm-login'),register=menu.querySelector('#fm-register');
      async function submit(create){const n=name.value.trim(),p=pw.value;if(!validAccount(n))return showMenuMessage('Use 3-16 letters, digits or underscores.');if(p.length<8||p.length>128)return showMenuMessage('Password must contain 8-128 characters.');
        login.disabled=register.disabled=true;
        try{let a=await dbGet('accounts',n.toLowerCase());if(create){if(a)throw Error('That account already exists on this browser.');const salt=Array.from(crypto.getRandomValues(new Uint8Array(16)));a={name:n.toLowerCase(),display:n,salt,hash:await passwordHash(p,salt),avatar:'Steve',appearance:null,created:Date.now()};await dbPut('accounts',a);}else{if(!a||await passwordHash(p,a.salt)!==a.hash)throw Error('Incorrect username or password.');}
          currentAccount=a.name;playerName=a.display||n;applyProfile(playerName,a.avatar||'Steve',a.appearance||avatarAppearance);startPresence();showHome();
        }catch(e){showMenuMessage(e?.message||'Could not access saved accounts.');}finally{login.disabled=register.disabled=false;pw.value='';}}
      login.onclick=()=>submit(false);register.onclick=()=>submit(true);pw.onkeydown=e=>{if(e.key==='Enter')submit(false);};
    }
    function saveCurrentWorld(){
      if(!currentAccount||!activeWorldId||!running||(peer&&!isHost)||saveBusy)return Promise.resolve();
      saveBusy=true;const snapshot={id:activeWorldId,owner:currentAccount,mode:activeWorldMode,name:worldName,
        seed,difficulty,gameMode,weather,worldTime,dayLength,mobsEnabled,pvpEnabled,chatEnabled,
        mods:[...mods.entries()],chests:[...chestInventories.entries()],
        inventory:inventory.map(x=>x?{...x}:null),armour:{...armour},offhand:offhand?{...offhand}:null,
        hp,hunger,pos:{x:player.position.x,y:player.position.y,z:player.position.z},yaw,pitch,
        created:activeWorldCreated||Date.now(),updated:Date.now()};
      lastSaveAt=Date.now();return dbPut('worlds',snapshot).catch(e=>{
        showToast('Save failed',e?.message||'Storage is full or blocked.');
      }).finally(()=>{saveBusy=false;});
    }
    let activeWorldCreated=null;
    function resetWorldOwnership(mode){activeWorldMode=mode;activeWorldId=randomId();activeWorldCreated=Date.now();activeRestore=null;}
    function startNewWorld(mode,params){
      disconnect();resetWorldOwnership(mode);worldName=params.name||'My World';seed=params.seed||randomId();difficulty=params.difficulty||'Normal';mobsEnabled=params.mobs??true;pvpEnabled=params.pvp??false;chatEnabled=params.chat??true;gameMode='Survival';
      if(mode==='server'||partyState==='leader'){ensurePeer(()=>createServer());}else{isHost=false;playerId='local';startWorld();saveCurrentWorld();}
    }
    async function showWorldLibrary(){menu.style.display='flex';let saved=[];try{saved=(await dbAll('worlds')).filter(w=>w.owner===currentAccount).sort((a,b)=>b.updated-a.updated);}catch(e){showMenuMessage(e.message);}
      menu.innerHTML=`<div class="fm-box" style="width:min(650px,93vw)"><div style="font-size:30px;font-weight:bold">My Worlds</div><div class="fm-small">Worlds are saved to this browser.</div><div id="fm-worlds" style="max-height:47vh;overflow:auto;margin:14px 0"></div><button class="fm-button" id="fm-world-new">Create World</button><button class="fm-button fm-secondary" id="fm-world-back">Back</button></div>`;
      const holder=menu.querySelector('#fm-worlds');if(!saved.length){const p=document.createElement('p');p.className='fm-small';p.textContent='No saved worlds yet.';holder.appendChild(p);}
      for(const w of saved){const row=document.createElement('div');row.style.cssText='padding:12px;margin:7px 0;border:1px solid #708570;background:#162b23';const label=document.createElement('div');label.textContent=`${w.mode==='server'?'🌐':'🌍'} ${w.name} — ${new Date(w.updated).toLocaleDateString()}`;const note=document.createElement('div');note.className='fm-small';note.textContent=`${w.mode==='server'?'Hosted world':'Singleplayer'} · Seed ${String(w.seed).slice(0,32)}`;
        const play=document.createElement('button');play.className='fm-button';play.textContent=w.mode==='server'?'Host World':'Play World';play.onclick=()=>resumeSavedWorld(w);
        const del=document.createElement('button');del.className='fm-button fm-secondary';del.style.padding='6px';del.textContent='Delete';del.onclick=async()=>{if(!confirm('Delete this world? This cannot be undone.'))return;await dbDelete('worlds',w.id);showWorldLibrary();};const exportBtn=document.createElement('button');exportBtn.className='fm-button fm-secondary';exportBtn.textContent='Export Backup';exportBtn.style.padding='7px';exportBtn.onclick=()=>{const obj={...w};delete obj.owner;const blob=new Blob([JSON.stringify(obj)],{type:'application/json'});const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download='FeatherMC-'+w.name.replace(/[^a-z0-9_-]/gi,'_')+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),1500);};row.append(label,note,play,exportBtn,del);holder.appendChild(row);}
      const importBtn=document.createElement('button');importBtn.className='fm-button fm-secondary';importBtn.textContent='Import World Backup';const fileInput=document.createElement('input');fileInput.type='file';fileInput.accept='.json,application/json';fileInput.style.display='none';
      importBtn.onclick=()=>fileInput.click();fileInput.onchange=async()=>{const f=fileInput.files?.[0];if(!f||f.size>20000000){showMenuMessage('Choose a FeatherMC backup under 20 MB.');return;}try{const obj=JSON.parse(await f.text());if(!obj||typeof obj.name!=='string'||typeof obj.seed!=='string'||!Array.isArray(obj.mods)||obj.mods.length>200000)throw Error('Invalid or oversized world backup.');const imported={...obj,id:randomId(),owner:currentAccount,name:obj.name.slice(0,48),seed:obj.seed.slice(0,100),mode:obj.mode==='server'?'server':'single',created:Date.now(),updated:Date.now()};await dbPut('worlds',imported);showWorldLibrary();}catch(e){showMenuMessage(e.message||'Invalid backup file.');}};
      menu.querySelector('.fm-box').insertBefore(importBtn,menu.querySelector('#fm-world-back'));menu.querySelector('.fm-box').insertBefore(fileInput,menu.querySelector('#fm-world-back'));
      menu.querySelector('#fm-world-new').onclick=showCreateWorld;menu.querySelector('#fm-world-back').onclick=showHome;
    }
    function resumeSavedWorld(w){disconnect();activeWorldId=w.id;activeWorldCreated=w.created||Date.now();activeWorldMode=w.mode;activeRestore=w;worldName=w.name;seed=w.seed;difficulty=w.difficulty;mobsEnabled=w.mobsEnabled;pvpEnabled=w.pvpEnabled;chatEnabled=w.chatEnabled;gameMode=w.gameMode||'Survival';weather=w.weather||'Clear';worldTime=w.worldTime??.27;dayLength=w.dayLength||600;
      if(w.mode==='server'||partyState==='leader'){ensurePeer(()=>createServer());}else{isHost=false;playerId='local';startWorld({restore:w});saveCurrentWorld();}
    }
    function paintMenuBackdrop(){
      const c=document.createElement('canvas');c.width=960;c.height=560;const g=c.getContext('2d');const W=960,H=560;
      let sky=g.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#193b68');sky.addColorStop(.55,'#91a8bb');sky.addColorStop(1,'#e9c2a2');g.fillStyle=sky;g.fillRect(0,0,W,H);
      g.fillStyle='#dbeaf5';for(let i=0;i<20;i++){const x=(i*139)%960,y=35+i*17%165;g.fillRect(x,y,55,13);g.fillRect(x+18,y-9,29,9);}
      for(let layer=0;layer<3;layer++){g.fillStyle=['#48656b','#3c554a','#294a36'][layer];g.beginPath();g.moveTo(0,H);for(let x=0;x<W;x+=12){const y=264+layer*66+Math.sin(x*.012+layer*2)*31+Math.sin(x*.037+layer)*17;g.lineTo(x,y);}g.lineTo(W,H);g.fill();}
      for(let x=0;x<W;x+=20){const y=345+Math.sin(x*.012)*31+Math.sin(x*.036)*15;g.fillStyle='#477c3c';g.fillRect(x,y,20,13);g.fillStyle='#6b5544';g.fillRect(x,y+13,20,H-y);}
      // Exposed caves with softly lit ores, stone pillars and lava pools.
      g.fillStyle='#17212c';g.beginPath();g.moveTo(40,560);g.lineTo(75,437);g.lineTo(169,391);g.lineTo(284,428);g.lineTo(375,385);g.lineTo(500,423);g.lineTo(648,392);g.lineTo(731,444);g.lineTo(868,398);g.lineTo(943,466);g.lineTo(960,560);g.fill();
      for(let i=0;i<170;i++){const x=(i*137+35)%960,y=423+(i*61)%137;g.fillStyle=i%11===0?'#1ad0c2':i%7===0?'#7d8799':'#3e4d56';g.fillRect(x,y,3+i%4,3+i%3);}
      g.fillStyle='#f27f37';g.fillRect(160,535,180,25);g.fillRect(695,549,165,11);g.fillStyle='#fac668';for(let x=167;x<334;x+=15)g.fillRect(x,539,10,5);
      for(const [x,y] of [[120,330],[185,295],[795,331],[870,298]]){g.fillStyle='#342c28';g.fillRect(x-8,y+10,16,74);g.fillStyle='#214c28';g.fillRect(x-30,y-15,61,38);g.fillRect(x-23,y-36,45,24);}
      menu.style.setProperty('--fm-backdrop',`linear-gradient(#06101b40,#05100a95),url("${c.toDataURL('image/jpeg',.82)}")`);
    }
    // ---- Party P2P invitations. A public directory needs a separate backend. ----
    const presenceName=n=>'fm11-pres-'+String(n).toLowerCase();
    function startPresence(){if(!currentAccount)return;try{presencePeer?.destroy();}catch(e){}presencePeer=null;
      ensurePeer(()=>{presencePeer=new window.Peer(presenceName(currentAccount));presencePeer.on('connection',onPartyConnection);presencePeer.on('error',e=>{
        if(['unavailable-id','network','server-error'].includes(e?.type))showMenuMessage('Party online status unavailable. The username may be active elsewhere.');
      });});}
    function onPartyConnection(conn){conn.on('data',msg=>handlePartyMessage(conn,msg));conn.on('close',()=>partyConnectionClosed(conn));}
    function partyConnectionClosed(conn){if(partyState==='leader'){for(const [name,d] of partyMembers)if(d.conn===conn){partyMembers.delete(name);partyBroadcastRoster();break;}}else if(partyConn===conn){partyState='solo';partyLeader='';partyConn=null;showToast('Party','Party leader disconnected.');} }
    function partyBroadcast(packet){if(partyState!=='leader')return;for(const d of partyMembers.values())if(d.conn?.open)try{d.conn.send(packet);}catch(e){}}
    function partyBroadcastRoster(){if(partyState!=='leader')return;partyBroadcast({type:'party_roster',leader:playerName,members:[...partyMembers.keys()]});}
    function partyReset(){if(partyState==='leader'){partyBroadcast({type:'party_disband'});for(const d of partyMembers.values())d.conn?.close();partyMembers.clear();}
      else if(partyConn?.open){partyConn.send({type:'party_leave',name:playerName});partyConn.close();}partyConn=null;partyLeader='';partyState='solo';}
    function sendPartyInvite(name){const target=String(name||'').trim();if(!validAccount(target))return showMenuMessage('Enter a valid account name.');if(target.toLowerCase()===currentAccount)return showMenuMessage('You cannot invite yourself.');if(partyState==='member')return showMenuMessage('Leave your current party first.');
      const now=Date.now();if(now-lastInviteAt<5000)return showMenuMessage(`You can invite again in ${Math.ceil((5000-now+lastInviteAt)/1000)} seconds.`);
      if(!presencePeer?.open)return showMenuMessage('Online party service is not connected yet.');lastInviteAt=now;
      const conn=presencePeer.connect(presenceName(target),{reliable:true,serialization:'json'});let accepted=false,opened=false;
      conn.on('open',()=>{opened=true;conn.send({type:'party_invite',from:playerName,to:target,avatar:avatarChoice,appearance:avatarAppearance,expires:Date.now()+20000});});
      conn.on('data',msg=>{if(msg?.type==='party_accept'){accepted=true;partyState='leader';partyLeader=playerName;partyMembers.set(target.toLowerCase(),{conn,name:target,avatar:msg.avatar,appearance:msg.appearance});partyBroadcastRoster();showToast('Party',`${target} joined your party.`);if(roomCode&&isHost)conn.send({type:'party_world',code:roomCode});}else if(msg?.type==='party_decline'){showToast('Invite',`${target} declined.`);conn.close();}else handlePartyMessage(conn,msg);});
      conn.on('error',()=>{showToast('Invite',`${target} is offline or unreachable.`);});
      setTimeout(()=>{if(!accepted&&conn.open)conn.close();else if(!opened&&!accepted){try{conn.close();}catch(e){}}},20000);
    }
    function showIncomingInvite(conn,msg){msg.expires=Math.min(Date.now()+20000,Number(msg.expires)||0);if(String(msg.to).toLowerCase()!==currentAccount||partyState!=='solo'||Date.now()>msg.expires){conn.send({type:'party_decline'});return;}
      document.exitPointerLock?.();const overlay=document.createElement('div');overlay.className='fm-invite-alert';const avatar=msg.appearance||{};
      overlay.innerHTML=`<div class="fm-box" style="width:min(440px,95vw);color:white"><div class="fm-logo" style="font-size:27px">Party Invitation</div><div style="display:flex;gap:15px;align-items:center"><div style="flex:none;width:65px;height:76px;background:${hexColour(Number(avatar.shirt)||0x2464c4)};border:3px solid #ffffff7a;position:relative"><div style="position:absolute;left:9px;top:0;width:40px;height:34px;background:${hexColour(Number(avatar.skin)||0xe0aa78)};border:3px solid #181818"></div><div style="position:absolute;bottom:0;left:9px;height:21px;width:18px;background:${hexColour(Number(avatar.pants)||0x303b75)}"></div><div style="position:absolute;bottom:0;right:9px;height:21px;width:18px;background:${hexColour(Number(avatar.pants)||0x303b75)}"></div></div><div><b id="fm-invite-from"></b><div class="fm-small">invited you to join their party</div><div class="fm-small">Expires in <b id="fm-invite-time">20</b>s</div></div></div><div class="fm-row" style="margin-top:15px"><button class="fm-button" id="fm-accept">Accept</button><button class="fm-button fm-secondary" id="fm-decline">Decline</button></div></div>`;
      overlay.querySelector('#fm-invite-from').textContent=String(msg.from||'Player');ROOT.appendChild(overlay);
      const close=()=>{clearInterval(ticker);overlay.remove();};const ticker=setInterval(()=>{const sec=Math.ceil((msg.expires-Date.now())/1000);overlay.querySelector('#fm-invite-time').textContent=Math.max(0,sec);if(sec<=0){if(conn.open)conn.send({type:'party_decline'});close();}},200);
      overlay.querySelector('#fm-decline').onclick=()=>{if(conn.open)conn.send({type:'party_decline'});close();};
      overlay.querySelector('#fm-accept').onclick=()=>{if(Date.now()>msg.expires||partyState!=='solo')return close();partyState='member';partyLeader=String(msg.from);partyConn=conn;if(conn.open)conn.send({type:'party_accept',name:playerName,avatar:avatarChoice,appearance:avatarAppearance});close();showToast('Party',`Joined ${partyLeader}'s party.`);};
    }
    function handlePartyMessage(conn,msg){if(!msg||typeof msg!=='object')return;
      if(msg.type==='party_invite'){showIncomingInvite(conn,msg);return;}
      if(msg.type==='party_leave'&&partyState==='leader'){const target=String(msg.name||'').toLowerCase();if(partyMembers.get(target)?.conn===conn){partyMembers.delete(target);partyBroadcastRoster();}return;}
      if(msg.type==='party_kick'||msg.type==='party_disband'){if(partyConn===conn){partyState='solo';partyLeader='';partyConn=null;conn.close();showToast('Party',msg.type==='party_kick'?'Removed by party leader.':'Party disbanded.');}return;}
      if(msg.type==='party_roster'&&partyState==='member'&&partyConn===conn){partyLeader=String(msg.leader||partyLeader);partyMembers=new Map((msg.members||[]).map(n=>[String(n).toLowerCase(),{name:n}]));return;}
      if(msg.type==='party_world'&&partyState==='member'&&partyConn===conn){const code=String(msg.code||'');if(!code||code===roomCode)return;saveCurrentWorld();if(running){running=false;disconnect();}ensurePeer(()=>joinServer(code));showToast('Party','Connecting to the leader’s world.');return;}
    }
    function showParty(){menu.style.display='flex';const isLeader=partyState==='leader',members=isLeader?[...partyMembers.keys()]:[...partyMembers.keys()];
      menu.innerHTML=`<div class="fm-box" style="width:min(570px,92vw)"><div style="font-size:30px;font-weight:bold">Parties</div><p class="fm-small">Invite online players by their account name. Both players must have FeatherMC open.</p><div class="fm-small" id="fm-party-status"></div><div id="fm-party-list" style="margin:12px 0"></div>${partyState!=='member'?'<label class="fm-label">Player name</label><input id="fm-party-name" class="fm-input" placeholder="Friend username" maxlength="16"><button id="fm-party-invite" class="fm-button">Invite Player</button>':''}${partyState!=='solo'?'<button id="fm-party-leave" class="fm-button fm-secondary">Leave Party / Disband</button>':''}<button id="fm-party-back" class="fm-button fm-secondary">Back</button></div>`;
      menu.querySelector('#fm-party-status').textContent=partyState==='solo'?'Not currently in a party':isLeader?'You are the party leader':`Leader: ${partyLeader}`;
      const list=menu.querySelector('#fm-party-list');for(const n of members){const row=document.createElement('div');row.style.cssText='display:flex;align-items:center;justify-content:space-between;gap:10px;margin:6px 0;padding:9px;background:#23352e;border:1px solid #596c5b';const label=document.createElement('span');label.textContent=n;row.appendChild(label);if(isLeader){const kick=document.createElement('button');kick.className='fm-button fm-secondary';kick.textContent='Kick';kick.style.cssText='width:auto;margin:0;padding:6px 16px';kick.onclick=()=>{const entry=partyMembers.get(n);if(entry?.conn?.open)entry.conn.send({type:'party_kick'});entry?.conn?.close();partyMembers.delete(n);partyBroadcastRoster();showParty();};row.appendChild(kick);}list.appendChild(row);}
      menu.querySelector('#fm-party-invite')?.addEventListener('click',()=>{const target=menu.querySelector('#fm-party-name').value;sendPartyInvite(target);});
      menu.querySelector('#fm-party-leave')?.addEventListener('click',()=>{partyReset();showParty();});menu.querySelector('#fm-party-back').onclick=showHome;
    }
    // ---- End v11 account/party support ----
    const menu=document.createElement('div');menu.className='fm-screen';ROOT.appendChild(menu);paintMenuBackdrop();
    function showMenuMessage(text){const p=document.createElement('div');p.textContent=text;Object.assign(p.style,{position:'absolute',bottom:'12px',left:'50%',transform:'translateX(-50%)',background:'#7c2929',padding:'10px 14px',maxWidth:'90%',zIndex:'50',textAlign:'center'});menu.appendChild(p);setTimeout(()=>p.remove(),4500);}
    function hexColour(n){return '#'+Number(n>>>0).toString(16).padStart(6,'0').slice(-6);}
    function cleanAppearance(a){const base=avatars.Steve,pick=(v,d)=>Number.isInteger(v)&&v>=0&&v<=0xffffff?v:d;return{shirt:pick(a?.shirt,base.shirt),pants:pick(a?.pants,base.pants),skin:pick(a?.skin,base.skin),cape:a?.cape==null?null:pick(a.cape,0x315fba)};}
    function applyProfile(name,preset,app){playerName=validName(name);avatarChoice=validAvatar(preset);avatarAppearance=cleanAppearance(app);const pos=player.position.clone(),rot=player.rotation.y;scene.remove(player);localAvatar=makeAvatar(playerName,avatarChoice,avatarAppearance);player=localAvatar.group;player.position.copy(pos);player.rotation.y=rot;scene.add(player);player.visible=!firstPerson;updateViewmodel();updatePlayerList();if(isHost)broadcast({type:'profileUpdate',id:playerId,name:playerName,avatar:avatarChoice,appearance:avatarAppearance});else if(peer)sendHost({type:'profile',name:playerName,avatar:avatarChoice,appearance:avatarAppearance});}
    function readProfile(){const name=menu.querySelector('#fm-profile-name')?.value??playerName,preset=menu.querySelector('#fm-profile-avatar')?.value??avatarChoice;const capeOn=menu.querySelector('#fm-cape-enabled')?.checked??!!avatarAppearance.cape;const app={shirt:parseInt((menu.querySelector('#fm-shirt')?.value||hexColour(avatarAppearance.shirt)).slice(1),16),pants:parseInt((menu.querySelector('#fm-pants')?.value||hexColour(avatarAppearance.pants)).slice(1),16),skin:parseInt((menu.querySelector('#fm-skin')?.value||hexColour(avatarAppearance.skin)).slice(1),16),cape:capeOn?parseInt((menu.querySelector('#fm-cape')?.value||'#315fba').slice(1),16):null};applyProfile(currentAccount?playerName:name,preset,app);if(currentAccount){dbGet('accounts',currentAccount).then(a=>{if(a){a.avatar=avatarChoice;a.appearance=avatarAppearance;return dbPut('accounts',a);}}).catch(()=>{});}} 
    function profileFields(){return '';}

    function showHome(){menu.style.display='flex';const connected=!!peer&&running;menu.innerHTML=`<div class="fm-box"><div class="fm-logo">FeatherMC</div><p style="text-align:center;margin-top:-12px;color:#aec8ac">Welcome, ${escapeHTML(playerName)}</p>${connected?'<button class="fm-button" id="fm-return">Return to Server</button>':'<button class="fm-button" id="fm-single">Singleplayer & Saved Worlds</button><button class="fm-button" id="fm-multi">Multiplayer</button>'}<button class="fm-button fm-secondary" id="fm-party">Parties</button><button class="fm-button fm-secondary" id="fm-settings">Settings</button><button class="fm-button fm-secondary" id="fm-logout">Log Out</button><button class="fm-button fm-secondary" id="fm-exit">Exit Game</button></div>`;
      menu.querySelector('#fm-single')?.addEventListener('click',showWorldLibrary);menu.querySelector('#fm-multi')?.addEventListener('click',showMultiplayer);menu.querySelector('#fm-party').onclick=showParty;menu.querySelector('#fm-settings').onclick=()=>showSettings('home');
      menu.querySelector('#fm-return')?.addEventListener('click',()=>{paused=false;menu.style.display='none';try{renderer.domElement.requestPointerLock();}catch(e){}});
      menu.querySelector('#fm-logout').onclick=async()=>{await saveCurrentWorld();partyReset();presencePeer?.destroy();presencePeer=null;if(isHost)broadcast({type:'closed'});disconnect();running=false;currentAccount=null;activeWorldId=null;showLogin();};
      menu.querySelector('#fm-exit').onclick=async()=>{await saveCurrentWorld();if(isHost)broadcast({type:'closed'});cleanup();ROOT.remove();};}
    function showCreateWorld(){menu.style.display='flex';menu.innerHTML=`<div class="fm-box"><div style="font-size:28px;font-weight:bold">Create World</div><label class="fm-label">World name</label><input class="fm-input" id="fm-world" value="My World"><label class="fm-label">Seed</label><input class="fm-input" id="fm-seed" placeholder="Leave blank for a random seed">${profileFields()}<label class="fm-label">Difficulty</label><select class="fm-input" id="fm-diff"><option>Peaceful</option><option>Easy</option><option selected>Normal</option><option>Hard</option></select><button class="fm-button" id="fm-create">Create World</button><button class="fm-button fm-secondary" id="fm-back">Back</button></div>`;menu.querySelector('#fm-back').onclick=showHome;menu.querySelector('#fm-create').onclick=()=>startNewWorld('single',{name:menu.querySelector('#fm-world').value,seed:menu.querySelector('#fm-seed').value.trim(),difficulty:menu.querySelector('#fm-diff').value});}
    function showMultiplayer(){menu.style.display='flex';menu.innerHTML=`<div class="fm-box"><div style="font-size:28px;font-weight:bold;margin-bottom:18px">Multiplayer</div><button class="fm-button" id="fm-host">Create Server</button><button class="fm-button fm-secondary" id="fm-host-saved">Saved Hosted Worlds</button><button class="fm-button" id="fm-join">Join Server</button><button class="fm-button fm-secondary" id="fm-back">Back</button></div>`;menu.querySelector('#fm-host').onclick=showHostForm;menu.querySelector('#fm-host-saved').onclick=showWorldLibrary;menu.querySelector('#fm-join').onclick=showJoinForm;menu.querySelector('#fm-back').onclick=showHome;}
    function showHostForm(){menu.style.display='flex';menu.innerHTML=`<div class="fm-box"><div style="font-size:27px;font-weight:bold">Create Server</div><label class="fm-label">World name</label><input class="fm-input" id="fm-world" value="My World"><label class="fm-label">Seed</label><input class="fm-input" id="fm-seed" value="${Math.floor(Math.random()*9999999)}">${profileFields()}<label class="fm-label">Difficulty</label><select class="fm-input" id="fm-diff"><option>Peaceful</option><option>Easy</option><option selected>Normal</option><option>Hard</option></select><div class="fm-row"><label class="fm-label"><input type="checkbox" id="fm-mobs" checked> Mobs</label><label class="fm-label"><input type="checkbox" id="fm-pvp"> PvP</label><label class="fm-label"><input type="checkbox" id="fm-chat" checked> Chat</label></div><button class="fm-button" id="fm-create">Create Server</button><button class="fm-button fm-secondary" id="fm-back">Back</button><div class="fm-small">A unique server ID will be generated automatically.</div></div>`;menu.querySelector('#fm-back').onclick=showMultiplayer;menu.querySelector('#fm-create').onclick=()=>startNewWorld('server',{name:menu.querySelector('#fm-world').value,seed:menu.querySelector('#fm-seed').value.trim(),difficulty:menu.querySelector('#fm-diff').value,mobs:menu.querySelector('#fm-mobs').checked,pvp:menu.querySelector('#fm-pvp').checked,chat:menu.querySelector('#fm-chat').checked});}
    function showJoinForm(){menu.style.display='flex';menu.innerHTML=`<div class="fm-box"><div style="font-size:27px;font-weight:bold">Join Server</div><label class="fm-label">Server ID</label><input class="fm-input" id="fm-code" maxlength="100" placeholder="e.g. AB">${profileFields()}<button class="fm-button" id="fm-join">Join</button><button class="fm-button fm-secondary" id="fm-back">Back</button></div>`;menu.querySelector('#fm-back').onclick=showMultiplayer;menu.querySelector('#fm-join').onclick=()=>{const code=menu.querySelector('#fm-code').value.trim();if(!(/^[a-zA-Z]{2}$/.test(code)||code.length>=5&&code.length<=100)){showMenuMessage('Enter the two-letter server ID (or a legacy full ID).');return;}readProfile();menu.querySelector('#fm-join').disabled=true;menu.querySelector('#fm-join').textContent='Connecting...';ensurePeer(()=>joinServer(code));};}
    function displayKey(code){return ({Space:'SPACE',ShiftLeft:'LEFT SHIFT',ShiftRight:'RIGHT SHIFT',ControlLeft:'LEFT CTRL',ControlRight:'RIGHT CTRL',AltLeft:'LEFT ALT',AltRight:'RIGHT ALT',Slash:'/'}[code]||String(code).replace(/^Key/,'').replace(/^Digit/,'').replace(/^Arrow/,'ARROW '));}
    function showSettings(from){settingsReturn=from;menu.style.display='flex';const labels={forward:'Move forward',back:'Move backward',left:'Move left',right:'Move right',jump:'Jump',sprint:'Sprint',inventory:'Inventory',chat:'Chat'};menu.innerHTML=`<div class="fm-box"><div style="font-size:28px;font-weight:bold">Settings</div><label class="fm-label">Render distance: <b id="fm-rv">${renderDistance}</b> chunks</label><input class="fm-input" id="fm-r" type="range" min="1" max="8" value="${renderDistance}"><label class="fm-label">Field of view: <b id="fm-fv">${fov}</b></label><input class="fm-input" id="fm-f" type="range" min="60" max="110" value="${fov}"><label class="fm-label">Mouse sensitivity: <b id="fm-sv">${sensitivity.toFixed(1)}</b></label><input class="fm-input" id="fm-s" type="range" min=".2" max="3" step=".1" value="${sensitivity}"><label class="fm-label">Graphics quality</label><select class="fm-input" id="fm-q"><option ${quality==='Low'?'selected':''}>Low</option><option ${quality==='Medium'?'selected':''}>Medium</option><option ${quality==='High'?'selected':''}>High</option></select><label class="fm-label">Weather</label><select class="fm-input" id="fm-weather"><option ${weather==='Clear'?'selected':''}>Clear</option><option ${weather==='Rain'?'selected':''}>Rain</option></select><label class="fm-label">Day length (seconds)</label><input class="fm-input" id="fm-day" type="range" min="120" max="1200" step="60" value="${dayLength}"><label class="fm-label">Difficulty</label><select class="fm-input" id="fm-difficulty"><option ${difficulty==='Peaceful'?'selected':''}>Peaceful</option><option ${difficulty==='Easy'?'selected':''}>Easy</option><option ${difficulty==='Normal'?'selected':''}>Normal</option><option ${difficulty==='Hard'?'selected':''}>Hard</option></select><hr style="border-color:#58645b;margin:18px 0"><b>Personal</b><label class="fm-label">Player name</label><input class="fm-input" id="fm-profile-name" maxlength="18" disabled title="Your account name cannot be changed" value="${escapeHTML(playerName)}"><label class="fm-label">Avatar style</label><select class="fm-input" id="fm-profile-avatar">${Object.keys(avatars).map(a=>`<option ${a===avatarChoice?'selected':''}>${a}</option>`).join('')}</select><div class="fm-row"><label class="fm-label">Skin<input type="color" class="fm-input" id="fm-skin" value="${hexColour(avatarAppearance.skin)}"></label><label class="fm-label">Shirt<input type="color" class="fm-input" id="fm-shirt" value="${hexColour(avatarAppearance.shirt)}"></label></div><div class="fm-row"><label class="fm-label">Trousers<input type="color" class="fm-input" id="fm-pants" value="${hexColour(avatarAppearance.pants)}"></label><label class="fm-label">Cape<input type="color" class="fm-input" id="fm-cape" value="${hexColour(avatarAppearance.cape||0x315fba)}"></label></div><label class="fm-label"><input type="checkbox" id="fm-cape-enabled" ${avatarAppearance.cape?'checked':''}> Wear cape</label><hr style="border-color:#58645b;margin:18px 0"><b>Controls</b><div class="fm-small">Click a control, then press the key you want to use.</div><div id="fm-bindings" style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:10px">${Object.entries(labels).map(([k,label])=>`<button class="fm-button fm-secondary" data-bind="${k}" style="margin:0;padding:9px;font-size:12px">${label}: ${displayKey(keybinds[k])}</button>`).join('')}</div><button class="fm-button fm-secondary" id="fm-reset">Reset keybinds</button><button class="fm-button" id="fm-done">Done</button></div>`;const r=menu.querySelector('#fm-r'),f=menu.querySelector('#fm-f'),ss=menu.querySelector('#fm-s');r.oninput=()=>{renderDistance=+r.value;menu.querySelector('#fm-rv').textContent=r.value;if(running){lastChunkX=null;updateChunks(true);}};f.oninput=()=>{fov=+f.value;camera.fov=fov;camera.updateProjectionMatrix();menu.querySelector('#fm-fv').textContent=fov;};ss.oninput=()=>{sensitivity=+ss.value;menu.querySelector('#fm-sv').textContent=sensitivity.toFixed(1);};menu.querySelectorAll('[data-bind]').forEach(button=>button.onclick=()=>{waitingBind=button.dataset.bind;button.textContent=`${labels[waitingBind]}: press a key...`;});menu.querySelector('#fm-reset').onclick=()=>{Object.assign(keybinds,defaultKeybinds);showSettings(from);};menu.querySelector('#fm-done').onclick=()=>{quality=menu.querySelector('#fm-q').value;renderer.setPixelRatio(Math.min(devicePixelRatio,quality==='Low'?.55:quality==='Medium'?.8:1));renderer.setSize(innerWidth,innerHeight);weather=menu.querySelector('#fm-weather').value;dayLength=+menu.querySelector('#fm-day').value;difficulty=menu.querySelector('#fm-difficulty').value;readProfile();if(isHost)broadcast({type:'worldSettings',weather,difficulty,worldTime,dayLength});waitingBind=null;if(from==='pause')showPause();else if(from==='home'&&running)showHome();else if(running){paused=false;menu.style.display='none';}else showHome();};}
    function showPause(){paused=true;held.left=false;held.right=false;document.exitPointerLock?.();menu.style.display='flex';menu.innerHTML=`<div class="fm-box"><div style="font-size:34px;font-weight:bold">Paused</div>${isHost?`<div class="fm-small">Server ID: <b>${roomCode}</b></div>`:''}<button class="fm-button" id="fm-resume">Resume</button><button class="fm-button fm-secondary" id="fm-settings">Settings</button>${isHost?'<button class="fm-button fm-secondary" id="fm-kick">Remove other player</button>':''}<button class="fm-button fm-secondary" id="fm-party">Parties</button><button class="fm-button fm-secondary" id="fm-save">Save World</button><button class="fm-button fm-secondary" id="fm-home">Save & Main Menu</button><button class="fm-button fm-secondary" id="fm-exit">Exit Game</button></div>`;menu.querySelector('#fm-resume').onclick=()=>{paused=false;menu.style.display='none';try{renderer.domElement.requestPointerLock();}catch(e){}};menu.querySelector('#fm-settings').onclick=()=>showSettings('pause');menu.querySelector('#fm-party').onclick=showParty;menu.querySelector('#fm-save').onclick=async()=>{await saveCurrentWorld();showToast('World saved',worldName);};menu.querySelector('#fm-home').onclick=async()=>{held.left=false;held.right=false;paused=true;document.exitPointerLock?.();await saveCurrentWorld();if(isHost)broadcast({type:'closed'});disconnect();running=false;showHome();};menu.querySelector('#fm-exit').onclick=async()=>{await saveCurrentWorld();if(isHost)broadcast({type:'closed'});cleanup();ROOT.remove();};menu.querySelector('#fm-kick')?.addEventListener('click',()=>{for(const [id,c] of connections){c.send({type:'kicked'});c.close();connections.delete(id);removeRemote(id);}showToast('Server','Other player removed.');});}

    // Network setup and game start
    function createServer(){
      isHost=true;roomCode='';
      // Human-readable two-letter PeerJS IDs. Retry if another server owns the ID.
      let attempts=0;
      const openCandidate=()=>{
        if(attempts++>=40){showMenuMessage('All short IDs tried were unavailable. Please try again.');return;}
        const bytes=new Uint32Array(2);crypto.getRandomValues(bytes);
        const letters=String.fromCharCode(65+bytes[0]%26,65+bytes[1]%26);
        peer=new window.Peer('feathermc-room-'+letters);
        peer.on('error',e=>{
          if(e?.type==='unavailable-id'){try{peer.destroy();}catch(_){}openCandidate();return;}
          disconnect();showMenuMessage('Could not start server: '+(e?.type||'network error'));showMultiplayer();
        });
        peer.on('open',id=>onServerOpen(id));
        peer.on('connection',conn=>onServerConnection(conn));
      };
      openCandidate();
    }
    function onServerOpen(id){
      playerId=id;roomCode=id.slice('feathermc-room-'.length);networkHostId=id;startWorld(activeRestore?{restore:activeRestore}:{});activeRestore=null;saveCurrentWorld();if(partyState==='leader')partyBroadcast({type:'party_world',code:roomCode});showToast('Server ready',`Share this ID: ${roomCode}`);info.textContent=`Server ID: ${roomCode}`;addChat('Server',`Server ID: ${roomCode}`);
    }
    function onServerConnection(conn){if(connections.size>=4){conn.on('open',()=>{conn.send({type:'full'});conn.close();});return;}connections.set(conn.peer,conn);conn.on('data',msg=>handleNetwork(conn.peer,msg));conn.on('close',()=>{connections.delete(conn.peer);removeRemote(conn.peer);broadcast({type:'playerLeft',id:conn.peer});addChat('Server','A player disconnected.');});conn.on('error',()=>{connections.delete(conn.peer);removeRemote(conn.peer);});}

    function joinServer(code){
      roomCode=code.trim().toUpperCase();isHost=false;peer=new window.Peer();
      peer.on('open',id=>{playerId=id;hostConn=peer.connect(/^[A-Z]{2}$/.test(roomCode)?'feathermc-room-'+roomCode:code,{reliable:true,serialization:'json'});let welcomed=false;hostConn.on('open',()=>hostConn.send({type:'hello',name:playerName,avatar:avatarChoice,appearance:avatarAppearance}));hostConn.on('data',msg=>{if(msg?.type==='welcome')welcomed=true;handleNetwork('host',msg);});hostConn.on('close',()=>{if(running){running=false;showToast('Disconnected','The host left the server.');setTimeout(()=>{disconnect();showHome();},900);}});hostConn.on('error',e=>showMenuMessage(`Connection failed: ${e?.type||'network error'}`));setTimeout(()=>{if(!welcomed&&hostConn&&!hostConn.open){disconnect();showMenuMessage('Could not connect. Check the full server ID and network access.');}},12000);});
      peer.on('error',e=>{const type=e?.type||'unknown';if(type==='network'||type==='socket-error'||type==='server-error')showMenuMessage('The school network may be blocking PeerJS/WebRTC.');else showMenuMessage(`Connection error: ${type}`);});
    }
    function clearWorld(){activeChunkBuild=null;activeChunkKey=null;activeMeshBuild=null;activeMeshKey=null;fluidQueue.length=0;fluidQueued.clear();flowDepth.clear();chunkQueue.length=0;queuedChunkKeys.clear();dirtyChunkQueue.length=0;dirtyChunkKeys.clear();desiredChunkKeys.clear();sandCandidateKeys.clear();sandCandidateList=[];sandCursor=0;fallingSandQueue.length=0;fallingSandQueued.clear();for(const c of chunks.values())disposeChunk(c);chunks.clear();world.clear();for(const id of [...droppedItems.keys()])removeDroppedItem(id);chestInventories.clear();openChestKey=null;for(const id of [...mobs.keys()])removeMob(id);for(const id of [...remotePlayers.keys()])removeRemote(id);lastChunkX=null;lastChunkZ=null;}
    function startWorld(opts={}){if(isHost)networkHostId=playerId;seedHash=hashSeed(seed);clearWorld();if(opts.network){for(const e of opts.chests||[])chestInventories.set(e[0],e[1]);for(const d of opts.drops||[])makeDropVisual(d);}inventory.fill(null);craftingGrid.fill(null);cursorStack=null;unlocked.clear();minedCount=0;hp=20;hunger=20;oxygen=15;drownTimer=0;regenTimer=0;lastAirDisplay=-1;updateAirHud(false);if(!opts.network)mods.clear();else for(const e of opts.mods||[])mods.set(e[0],e[1]);if(opts.restore)for(const [key,type] of opts.restore.mods||[])mods.set(key,type);if(opts.restore?.pos)player.position.set(opts.restore.pos.x,opts.restore.pos.y,opts.restore.pos.z);else player.position.set(.5,18,.5);yaw=opts.restore?.yaw??0;pitch=opts.restore?.pitch??.12;velocityY=0;grounded=false;fallPeakY=18;firstPerson=true;cameraDistance=7;player.visible=false;updateChunks(true);if(!opts.restore?.pos)player.position.y=floorAt(.5,.5);spawnPoint={x:player.position.x,y:player.position.y,z:player.position.z};if(opts.network){const hostPlayer=(opts.players||[]).find(p=>p.id!==playerId);for(const p of opts.players||[]){if(p.id===playerId)continue;const r=addRemote(p.id,{name:p.name,avatar:p.avatar,appearance:p.appearance});r.state={...p};pose(r.model,r.state);}if(hostPlayer){player.position.set(hostPlayer.x+2,hostPlayer.y,hostPlayer.z);updateChunks();player.position.y=floorAt(player.position.x,player.position.z);spawnPoint={x:player.position.x,y:player.position.y,z:player.position.z};}syncMobs(opts.mobs||[]);}else spawnMobs();if(opts.restore){for(let i=0;i<inventory.length;i++)inventory[i]=opts.restore.inventory?.[i]||null;armour={head:null,chest:null,legs:null,feet:null,...(opts.restore.armour||{})};offhand=opts.restore.offhand||null;hp=Number.isFinite(opts.restore.hp)?opts.restore.hp:20;hunger=Number.isFinite(opts.restore.hunger)?opts.restore.hunger:20;for(const [key,data] of opts.restore.chests||[])chestInventories.set(key,data);}running=true;paused=false;inventoryOpen=false;chatOpen=false;menu.style.display='none';invOverlay.style.display='none';updateHotbar();updateHealth();info.textContent=isHost?`Server ID: ${roomCode}`:roomCode?`Server: ${roomCode}`:'';try{const lock=renderer.domElement.requestPointerLock();lock?.catch?.(()=>showLockHint());}catch(e){showLockHint();}clock.start();}
    let lockHint=null;
    function showLockHint(){
      if(!running||paused||inventoryOpen||chatOpen||document.pointerLockElement===renderer.domElement)return;
      if(!lockHint){lockHint=document.createElement('button');lockHint.textContent='Click to lock mouse and play';lockHint.style.cssText='position:absolute;z-index:24;left:50%;top:42%;transform:translate(-50%,-50%);background:#333e;color:white;border:3px solid #aaa;padding:15px 22px;font:bold 16px monospace;cursor:pointer';ROOT.appendChild(lockHint);lockHint.onclick=()=>{renderer.domElement.requestPointerLock()?.catch?.(()=>{});};}
      lockHint.style.display='block';
    }
    document.addEventListener('pointerlockchange',()=>{if(lockHint)lockHint.style.display=document.pointerLockElement===renderer.domElement?'none':(running&&!paused&&!inventoryOpen&&!chatOpen?'block':'none');});
    document.addEventListener('visibilitychange',()=>{if(!document.hidden&&running&&!paused&&!inventoryOpen&&!chatOpen&&document.pointerLockElement!==renderer.domElement)showLockHint();});
    function getPlayerState(){return{x:player.position.x,y:player.position.y,z:player.position.z,yaw,pitch,hp,moving:!!(keys.KeyW||keys.KeyA||keys.KeyS||keys.KeyD),walk:walking};}
    function sendChat(text){text=String(text||'').trim().slice(0,180);if(!text)return;if(text.startsWith('/')){if(isHost)runServerCommand(playerId,text);else sendHost({type:'command',text});return;}if(!chatEnabled)return;addChat(playerName,text);if(isHost)broadcast({type:'chat',name:playerName,text});else sendHost({type:'chat',text});}
    chatInput.addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Enter'){sendChat(chatInput.value);chatInput.value='';chatOpen=false;chatInput.style.display='none';renderer.domElement.requestPointerLock();}if(e.key==='Escape'){chatOpen=false;chatInput.style.display='none';renderer.domElement.requestPointerLock();}});

    // Inputs
    function openChat(initial=''){if(!running||paused||inventoryOpen||!chatEnabled)return;chatOpen=true;held.left=false;held.right=false;document.exitPointerLock?.();chatInput.style.display='block';chatInput.value=initial;chatInput.focus();}
    function keyDown(e){
      if(waitingBind){e.preventDefault();if(!['Escape','Tab'].includes(e.key)){keybinds[waitingBind]=e.code;waitingBind=null;showSettings(settingsReturn);}return;}
      if(!running)return;if(e.code==='Tab'){e.preventDefault();if(!paused&&!inventoryOpen&&!chatOpen){updatePlayerList();playerListHud.style.display='block';}return;}
      if(e.code==='Escape'){e.preventDefault();if(inventoryOpen)closeInventory();else if(chatOpen){chatOpen=false;chatInput.style.display='none';}else if(!paused)showPause();return;}
      if(e.code===keybinds.inventory&&inventoryOpen){closeInventory();return;}
      if(paused||inventoryOpen||chatOpen)return;
      keys[e.code]=true;
      if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();
      if(e.code===keybinds.jump&&(grounded||playerFluid().water)){fallPeakY=player.position.y;velocityY=playerFluid().water?3.5:8;grounded=false;}
      if(e.code===keybinds.inventory){const t=targetBlock();if(t&&t.type==='chest')openChest(t.key);else if(t&&t.type==='furnace')openFurnace(t.key);else openInventory();return;}
      if(e.code===keybinds.chat){openChat();return;}
      if(e.code==='Slash'||e.key==='/'){e.preventDefault();openChat('/');return;}
      if(e.code==='F5'){e.preventDefault();f5Debug=!f5Debug;debugHud.style.display=f5Debug?'block':'none';return;}
      if(e.code==='KeyV'){firstPerson=!firstPerson;player.visible=!firstPerson;return;}
      if(e.code.startsWith('Digit')){const n=Number(e.code.slice(5));if(n>=1&&n<=9){selectedSlot=n-1;updateHotbar();updateViewmodel();}}
    }
    function keyUp(e){keys[e.code]=false;if(e.code==='Tab'){playerListHud.style.display='none';e.preventDefault();}}
    function mouseUp(e){if(e.button===0){held.left=false;pendingMine=null;miningKey=null;miningProgress=0;progressFill.style.width='0%';crackMesh.visible=false;}if(e.button===2)held.right=false;}
    function applyLook(dx,dy){yaw-=THREE.MathUtils.clamp(dx,-180,180)*.0018*sensitivity;pitch=THREE.MathUtils.clamp(pitch-THREE.MathUtils.clamp(dy,-180,180)*.0018*sensitivity,-1.35,1.35);}
    window.addEventListener('keydown',keyDown);window.addEventListener('keyup',keyUp);window.addEventListener('mouseup',mouseUp);
    document.addEventListener('mousemove',e=>{if(document.pointerLockElement===renderer.domElement&&running&&!paused&&!inventoryOpen&&!chatOpen)applyLook(e.movementX,e.movementY);});
    renderer.domElement.addEventListener('pointerdown',e=>{if(!running||paused||inventoryOpen||chatOpen||document.pointerLockElement===renderer.domElement)return;if(e.button===1){e.preventDefault();return;}fallbackPointerId=e.pointerId;fallbackLook=true;fallbackMoved=false;fallbackStartX=fallbackLastX=e.clientX;fallbackStartY=fallbackLastY=e.clientY;try{renderer.domElement.setPointerCapture(e.pointerId);}catch(err){}if(e.button===0)held.left=true;if(e.button===2)held.right=true;});
    renderer.domElement.addEventListener('pointermove',e=>{if(!fallbackLook||e.pointerId!==fallbackPointerId||document.pointerLockElement===renderer.domElement)return;const dx=e.clientX-fallbackLastX,dy=e.clientY-fallbackLastY;fallbackLastX=e.clientX;fallbackLastY=e.clientY;if(Math.hypot(e.clientX-fallbackStartX,e.clientY-fallbackStartY)>4){fallbackMoved=true;held.left=false;held.right=false;applyLook(dx,dy);}});
    function endFallbackPointer(e){if(e.pointerId!==fallbackPointerId)return;fallbackLook=false;fallbackPointerId=null;held.left=false;held.right=false;}
    renderer.domElement.addEventListener('pointerup',endFallbackPointer);renderer.domElement.addEventListener('pointercancel',endFallbackPointer);
    document.addEventListener('pointerlockchange',()=>{if(document.pointerLockElement===renderer.domElement){fallbackLook=false;fallbackPointerId=null;}});
    renderer.domElement.style.touchAction='none';renderer.domElement.style.cursor='crosshair';renderer.domElement.addEventListener('contextmenu',e=>e.preventDefault());renderer.domElement.addEventListener('mousedown',e=>{if(!running||paused||inventoryOpen||chatOpen||document.pointerLockElement!==renderer.domElement)return;if(e.button===0)held.left=true;if(e.button===2)held.right=true;});
    window.addEventListener('blur',()=>{held.left=false;held.right=false;fallbackLook=false;for(const k in keys)keys[k]=false;});
    rootWheel();function rootWheel(){ROOT.addEventListener('wheel',e=>{if(!running||paused||inventoryOpen||chatOpen)return;if(e.deltaY>0){if(firstPerson){firstPerson=false;player.visible=true;cameraDistance=7;}else cameraDistance=THREE.MathUtils.clamp(cameraDistance+e.deltaY*.01,2,12);}else if(!firstPerson){cameraDistance=THREE.MathUtils.clamp(cameraDistance+e.deltaY*.01,0,12);if(cameraDistance<=.7){firstPerson=true;player.visible=false;}}},{passive:true});}

    function cameraSafePosition(eye,desired){
      const delta=desired.clone().sub(eye),length=delta.length();
      if(length<.01)return eye.clone();
      const unit=delta.multiplyScalar(1/length);
      let safe=eye.clone();
      for(let d=.12;d<length;d+=.15){
        const p=eye.clone().addScaledVector(unit,d);
        const b=world.get(k3(Math.floor(p.x),Math.floor(p.y),Math.floor(p.z)));
        if(isSolidBlock(b))return safe;
        safe.copy(p);
      }
      return desired;
    }
    // Mining, placing, combat
    const raycaster=new THREE.Raycaster();raycaster.far=6;
    function targetBlock(){raycaster.far=6;const dir=new THREE.Vector3();camera.getWorldDirection(dir);raycaster.set(camera.position,dir);const meshes=[...chunks.values()].filter(c=>c.mesh).map(c=>c.mesh),hits=raycaster.intersectObjects(meshes,false);if(!hits.length)return null;const hit=hits[0],normal=hit.face.normal.clone().transformDirection(hit.object.matrixWorld),p=hit.point.clone().addScaledVector(normal,-.015);let x=Math.floor(p.x+1e-5),y=Math.floor(p.y+1e-5),z=Math.floor(p.z+1e-5),type=world.get(k3(x,y,z));if(!type){let best=null,bestD=Infinity;for(let ax=-1;ax<=1;ax++)for(let ay=-1;ay<=1;ay++)for(let az=-1;az<=1;az++){const bx=x+ax,by=y+ay,bz=z+az,t=world.get(k3(bx,by,bz));if(!t)continue;const cx=bx+.5,cy=by+.5,cz=bz+.5,d=(cx-hit.point.x)**2+(cy-hit.point.y)**2+(cz-hit.point.z)**2;if(d<bestD){bestD=d;best={x:bx,y:by,z:bz,type:t};}}if(best){({x,y,z,type}=best);}}return type?{hit,normal,x,y,z,type,key:k3(x,y,z)}:null;}
    function targetMob(){raycaster.far=3.5;const dir=new THREE.Vector3();camera.getWorldDirection(dir);raycaster.set(camera.position,dir);const objects=[...mobs.values()].flatMap(m=>m.group.children);if(pvpEnabled)for(const r of remotePlayers.values())r.model.group.traverse(o=>{if(o.isMesh)objects.push(o);});const hits=raycaster.intersectObjects(objects,false);return hits[0]||null;}
    let aimBlockCache=null,aimMobCache=null,aimCacheAt=0;function refreshAimCache(){const now=performance.now();if(now-aimCacheAt<55)return;aimCacheAt=now;aimBlockCache=targetBlock();aimMobCache=targetMob();}
    function miningDuration(type){const tool=inventory[selectedSlot]?.id;let n={grass:.38,dirt:.38,sand:.3,stone:1.25,iron_ore:1.5,diamond_ore:1.7,coal_ore:.95,oak_log:.82,oak_leaves:.2,oak_planks:.55,crafting_table:.55,furnace:.55,chest:.55}[type]||.5;const pick=['wooden_pickaxe','stone_pickaxe','iron_pickaxe','diamond_pickaxe'];if(['stone','iron_ore','diamond_ore','coal_ore','furnace'].includes(type)&&pick.includes(tool))n*=tool==='wooden_pickaxe'?.65:tool==='stone_pickaxe'?.48:tool==='iron_pickaxe'?.32:.22;if(type==='oak_log'&&['wooden_axe','stone_axe','iron_axe','diamond_axe'].includes(tool))n=tool==='wooden_axe'?.36:tool==='stone_axe'?.29:tool==='iron_axe'?.22:.16;if(type==='oak_planks'&&['wooden_axe','stone_axe','iron_axe','diamond_axe'].includes(tool))n*=.45;return n;}
    function mineTarget(t,dt){if(!t||t.type==='water'||t.type==='lava'||t.type==='bedrock'){miningKey=null;miningProgress=0;progressFill.style.width='0%';crackMesh.visible=false;return;}if(pendingMine&&pendingMine!==t.key)pendingMine=null;if(pendingMine===t.key){if(performance.now()-pendingMineAt<1800){progressFill.style.width='100%';return;}pendingMine=null;miningKey=null;miningProgress=0;}if(miningKey!==t.key){miningKey=t.key;miningProgress=0;}const fast=gameMode==='Creative';miningProgress+=dt/(fast?.04:miningDuration(t.type));mineSwingPhase+=dt*13;progressFill.style.width=`${Math.min(100,miningProgress*100)}%`;crackMesh.visible=!fast;crackMesh.position.set(t.x+.5,t.y+.5,t.z+.5);crackMesh.material=crackMats[Math.min(9,Math.floor(miningProgress*10))];if(miningProgress>=1){let sent=false;if(hasAuthority())sent=hostMine(t.x,t.y,t.z,playerId);else if(sendHost({type:'mine',x:t.x,y:t.y,z:t.z})){pendingMine=t.key;pendingMineAt=performance.now();sent=true;}if(!sent){miningKey=null;miningProgress=0;}else if(hasAuthority()){miningKey=null;miningProgress=0;}progressFill.style.width='0%';crackMesh.visible=false;}}
    function placeTarget(t){if(!t||placeCooldown>0)return;if(t.type==='crafting_table'){openInventory();return;}const s=inventory[selectedSlot];if(!s)return;if(['bucket','water_bucket','lava_bucket'].includes(s.id)){useBucketAt(t);return;}if(!placeable.includes(s.id)||s.id==='water'||s.id==='lava')return;const x=t.x+Math.round(t.normal.x),y=t.y+Math.round(t.normal.y),z=t.z+Math.round(t.normal.z);if(world.has(k3(x,y,z))||overlaps(x,y,z,player.position)||!chunks.has(ck(Math.floor(x/16),Math.floor(z/16))))return;if(hasAuthority())hostPlace(x,y,z,s.id,playerId,selectedSlot);else sendHost({type:'place',x,y,z,block:s.id,slot:selectedSlot});placeAnim=.22;placeCooldown=.22;}
    function eatSelected(){if(placeCooldown>0)return false;const s=inventory[selectedSlot];if(!s||!['raw_porkchop','cooked_porkchop'].includes(s.id)||hunger>=20||gameMode==='Creative')return false;hunger=Math.min(20,hunger+(s.id==='cooked_porkchop'?8:3));s.count--;if(s.count<=0)inventory[selectedSlot]=null;updateHotbar();updateHunger();eatAnim=.55;placeCooldown=.55;return true;}
    function tryHit(){const hit=targetMob();if(!hit)return;const mob=hit.object.userData.mob,remoteId=hit.object.userData.remotePlayer;const critical=attackCharge>=.92&&velocityY<-.1,weapon=inventory[selectedSlot]?.id||'',sword=weapon.endsWith('_sword');if(mob){if(hasAuthority())damageMob(mob,playerId,critical,sword);else sendHost({type:'hitMob',id:mob.id,critical,sword,charge:attackCharge});}else if(remoteId&&pvpEnabled){if(isHost){const factor=difficulty==='Hard'?1.35:difficulty==='Easy'?.8:1;if(allowAttack(playerId))damageRemote(remoteId,attackDamage(playerId,critical,attackCharge),player.position);}else sendHost({type:'hitPlayer',id:remoteId,critical,sword,charge:attackCharge});}else return;attackCharge=0;attackCooldown=.24;attackAnim=.24;localAvatar.rightArm.rotation.x=-1.35;if(critical)showToast('Critical Hit','');}

    function updateFallingSand(dt){
      if(!hasAuthority())return;
      sandTimer+=dt;if(sandTimer<.09)return;sandTimer=0;
      let checked=0,moved=0;
      while(checked<90&&moved<18){
        let key;
        if(fallingSandQueue.length){key=fallingSandQueue.shift();fallingSandQueued.delete(key);}
        else if(sandCandidateList.length){if(sandCursor>=sandCandidateList.length)sandCursor=0;key=sandCandidateList[sandCursor++];}
        else break;
        checked++;
        if(!sandCandidateKeys.has(key))continue;
        if(world.get(key)!=='sand'){sandCandidateKeys.delete(key);continue;}
        const [x,y,z]=key.split(',').map(Number);
        if(y<=BEDROCK_Y+1)continue;
        const belowKey=k3(x,y-1,z),below=world.get(belowKey);
        if(isSolidBlock(below)||below==='lava')continue;
        // No falling into chunks that have not loaded yet.
        if(!chunks.has(ck(Math.floor(x/16),Math.floor(z/16))))continue;
        changeBlock(x,y,z,null);
        changeBlock(x,y-1,z,'sand');
        wakeSand(x,y-1,z);wakeSand(x,y+1,z);
        if(isHost){broadcast({type:'block',x,y,z,block:null,actor:'gravity'});broadcast({type:'block',x,y:y-1,z,block:'sand',actor:'gravity'});}
        moved++;
      }
    }

    // Loop and cleanup
    const clock={last:performance.now(),fps:0,start(){this.last=performance.now();this.fps=0;},delta(){const now=performance.now(),raw=Math.max(.001,(now-this.last)/1000);this.last=now;const instant=1/raw;this.fps=this.fps?this.fps*.82+instant*.18:instant;return Math.min(raw,.05);}};
    function cleanup(){saveCurrentWorld();partyReset();try{presencePeer?.destroy();}catch(e){}running=false;paused=false;fallbackLook=false;document.exitPointerLock?.();disconnect();window.removeEventListener('keydown',keyDown);window.removeEventListener('keyup',keyUp);window.removeEventListener('mouseup',mouseUp);for(const c of chunks.values())disposeChunk(c);renderer.dispose();}
    let lastRenderAt=0;function frame(){
      if(!ROOT.isConnected)return;requestAnimationFrame(frame);if(!running)return;const now=performance.now(),frameLimit=quality==='Low'?1000/45:quality==='Medium'?1000/60:1000/75;if(now-lastRenderAt<frameLimit)return;lastRenderAt=now;const dt=clock.delta();
      if(!paused){
        const controlsActive=!inventoryOpen&&!chatOpen;
        let f=controlsActive?((keys[keybinds.forward]?1:0)-(keys[keybinds.back]?1:0)):0,s=controlsActive?((keys[keybinds.right]?1:0)-(keys[keybinds.left]?1:0)):0,moving=!!(f||s);const fluid=playerFluid(),sprinting=!!(keybinds.sprint==='ShiftLeft'?(keys.ShiftLeft||keys.ShiftRight):keys[keybinds.sprint])&&hunger>6&&!fluid.water&&!fluid.lava&&f>0;
        if(moving){const len=Math.hypot(f,s);f/=len;s/=len;const sp=(sprinting?6.5:5.2)*(fluid.water?.62:1);const dx=(-Math.sin(yaw)*f+Math.cos(yaw)*s)*sp*dt,dz=(-Math.cos(yaw)*f-Math.sin(yaw)*s)*sp*dt,nx=player.position.x+dx,nz=player.position.z+dz;if(!collides(nx,player.position.y,player.position.z))player.position.x=nx;if(!collides(player.position.x,player.position.y,nz))player.position.z=nz;walking+=dt*(sprinting?13:10);}
        if(Math.abs(knockbackX)+Math.abs(knockbackZ)>.01){const nx=player.position.x+knockbackX*dt,nz=player.position.z+knockbackZ*dt;if(!collides(nx,player.position.y,player.position.z))player.position.x=nx;if(!collides(player.position.x,player.position.y,nz))player.position.z=nz;knockbackX*=Math.max(0,1-dt*6);knockbackZ*=Math.max(0,1-dt*6);}
        const wasGrounded=grounded,currentY=player.position.y;if(wasGrounded)fallPeakY=currentY;const inWater=playerFluid().water; if(inWater){if(controlsActive&&keys[keybinds.jump])velocityY=Math.min(4.2,velocityY+11*dt);else velocityY=Math.max(-1.8,velocityY-3.2*dt);}else velocityY-=22*dt;const next=player.position.y+velocityY*dt,floor=floorAt(player.position.x,player.position.z,currentY+.05);if(velocityY<=0&&next<=floor){const fallDistance=Math.max(0,fallPeakY-floor);player.position.y=floor;velocityY=0;grounded=true;const landingInWater=playerFluid().water||fluidAt(player.position.x,floor-.05,player.position.z)==='water';if(!wasGrounded&&!landingInWater&&gameMode!=='Creative'&&difficulty!=='Peaceful'&&fallDistance>3)damagePlayer(Math.ceil(fallDistance-3),true);fallPeakY=floor;}else if(collides(player.position.x,next,player.position.z)){velocityY=0;}else{player.position.y=next;grounded=false;fallPeakY=Math.max(fallPeakY,next);}
        updateChunks();processChunkQueue();player.rotation.y=yaw;localAvatar.head.rotation.x=THREE.MathUtils.clamp(pitch,-1.1,1.1);viewmodel.visible=firstPerson&&!paused&&!inventoryOpen&&!chatOpen;placeAnim=Math.max(0,placeAnim-dt);eatAnim=Math.max(0,eatAnim-dt);
        const miningMotion=held.left&&miningKey?Math.sin(mineSwingPhase)*.42:0;
        const placingMotion=placeAnim>0?Math.sin((1-placeAnim/.22)*Math.PI)*.55:0;
        const eatingMotion=eatAnim>0?Math.sin((1-eatAnim/.55)*Math.PI*4)*.16:0;
        const bob=moving?Math.sin(walking)*.035:0;
        vmArm.rotation.x=attackAnim>0?-.65:miningMotion-placingMotion+eatingMotion+bob;
        vmHeld.rotation.x=attackAnim>0?-.85:-.18+miningMotion-placingMotion+eatingMotion;
        viewmodel.position.set(sprinting?-.025:0,sprinting?-.07:0,sprinting?-.09:0);const sw=moving&&grounded?Math.sin(walking)*.5:0;localAvatar.leftLeg.rotation.x=sw;localAvatar.rightLeg.rotation.x=-sw;localAvatar.leftArm.rotation.x=-sw;localAvatar.rightArm.rotation.x=sw;if(attackAnim>0){attackAnim=Math.max(0,attackAnim-dt);localAvatar.rightArm.rotation.x=-1.35*(attackAnim/.24);}
        const targetFov=fov+(sprinting?5:0);camera.fov+= (targetFov-camera.fov)*Math.min(1,dt*5);camera.updateProjectionMatrix();const eye=new THREE.Vector3(player.position.x,player.position.y+1.62,player.position.z),dir=new THREE.Vector3(-Math.sin(yaw)*Math.cos(pitch),Math.sin(pitch),-Math.cos(yaw)*Math.cos(pitch));if(firstPerson){camera.position.copy(eye);camera.lookAt(eye.clone().add(dir));}else{camera.position.copy(cameraSafePosition(eye,eye.clone().addScaledVector(dir,-cameraDistance)));camera.lookAt(eye);}
        attackCharge=Math.min(1,attackCharge+dt/.62);meter.style.width=`${attackCharge*100}%`;placeCooldown=Math.max(0,placeCooldown-dt);attackCooldown=Math.max(0,attackCooldown-dt);
        if(gameMode!=='Creative'&&difficulty!=='Peaceful'){foodTimer+=dt;starveTimer+=dt;regenTimer+=dt;if(foodTimer>=12){foodTimer-=12;hunger=Math.max(0,hunger-1);updateHunger();}if(hunger>=18&&hp<20&&regenTimer>=4){regenTimer=0;hp=Math.min(20,hp+1);updateHealth();}if(hunger===0&&starveTimer>=5){starveTimer=0;damagePlayer(1);}} 
        if(isHost||!peer){worldTime=(worldTime+dt/dayLength)%1;if(isHost&&connections.size&&Math.floor(worldTime*20)!==Math.floor((worldTime-dt/dayLength)*20))broadcast({type:'worldSettings',worldTime,weather,difficulty,dayLength});}const sunAngle=worldTime*Math.PI*2-Math.PI/2;sun.position.set(Math.cos(sunAngle)*55,Math.sin(sunAngle)*55,20);const daylight=Math.max(.12,Math.sin(sunAngle)*.5+.5);const px=Math.floor(player.position.x),pz=Math.floor(player.position.z),surface=heightAt(px,pz),depth=Math.max(0,surface-player.position.y-3),darkness=THREE.MathUtils.clamp(depth/42,0,1);const holdingTorch=inventory[selectedSlot]?.id==='torch'||offhand?.id==='torch';hemisphere.intensity=THREE.MathUtils.lerp(1.5,.10,darkness)+(holdingTorch?.55:0);sun.intensity=THREE.MathUtils.lerp(.15+daylight*1.5,.008,darkness);scene.background.setHSL(.56,.48,THREE.MathUtils.lerp(.12+daylight*.43,holdingTorch?.075:.008,darkness));scene.fog.color.copy(scene.background);scene.fog.near=THREE.MathUtils.lerp(30,5,darkness);scene.fog.far=THREE.MathUtils.lerp(110,35,darkness);handTorchLight.position.set(camera.position.x,camera.position.y-.2,camera.position.z);handTorchLight.intensity=holdingTorch?1.5:0;cloudGroup.position.x+=dt*.35;cloudGroup.position.z+=dt*.08;weatherParticles.visible=weather==='Rain';if(weather==='Rain'){weatherParticles.position.set(camera.position.x,camera.position.y-8,camera.position.z);const a=weatherParticles.geometry.attributes.position.array;for(let i=0;i<a.length;i+=3){a[i+1]-=dt*25;if(a[i+1]<-8){a[i]=(Math.random()-.5)*76;a[i+1]=34+Math.random()*12;a[i+2]=(Math.random()-.5)*76;}}weatherParticles.geometry.attributes.position.needsUpdate=true;} 
        updateBreathing(dt);const feetType=world.get(k3(Math.floor(player.position.x),Math.floor(player.position.y),Math.floor(player.position.z))),bodyFluid=playerFluid();if((feetType==='lava'||bodyFluid.lava)&&gameMode!=='Creative'){lavaDamageTimer+=dt;if(lavaDamageTimer>=1){lavaDamageTimer=0;damagePlayer(4,true);}}else lavaDamageTimer=0;if(f5Debug){debugHud.textContent=`FeatherMC\nXYZ: ${player.position.x.toFixed(2)} / ${player.position.y.toFixed(2)} / ${player.position.z.toFixed(2)}\nChunk: ${Math.floor(player.position.x/16)}, ${Math.floor(player.position.z/16)}\nFPS: ${Math.round(clock.fps)}\nPlayers: ${remotePlayers.size+1}/5\nMode: ${gameMode}`;}
        if(controlsActive&&(document.pointerLockElement===renderer.domElement||(!paused&&!inventoryOpen&&!chatOpen))){refreshAimCache();const t=aimBlockCache,mh=aimMobCache;outline.visible=!!t;if(t)outline.position.set(t.x+.5,t.y+.5,t.z+.5);if(held.left){if(mh&&(!t||mh.distance<t.hit.distance)){miningKey=null;miningProgress=0;progressFill.style.width='0%';crackMesh.visible=false;if(attackCooldown<=0)tryHit();}else mineTarget(t,dt);}else{miningKey=null;miningProgress=0;progressFill.style.width='0%';crackMesh.visible=false;}if(held.right){if(!eatSelected())placeTarget(t);else placeCooldown=.35;}}else{outline.visible=false;crackMesh.visible=false;}
        updateDroppedItems(dt);updateFallingSand(dt);updateFlowingWater(dt);if(isHost){dropSyncTimer+=dt;if(dropSyncTimer>.18){dropSyncTimer=0;for(const d of droppedItems.values())broadcast({type:'dropMove',id:d.id,x:d.x,y:d.y,z:d.z});}}if(hasAuthority()){updateMobs(dt);if(isHost){lastMobSync+=dt;if(lastMobSync>.12){lastMobSync=0;broadcast({type:'mobs',list:mobSnapshot()});}}}else{
          for(const m of mobs.values())if(m.hitTimer>0){m.hitTimer-=dt;if(m.hitTimer<=0){m.group.scale.set(1,1,1);for(const mesh of m.group.children)if(mesh.isMesh&&mesh.userData.baseColor!==undefined)mesh.material.color.setHex(mesh.userData.baseColor);}}
        }
        lastNetSend+=dt;if(lastNetSend>.1){lastNetSend=0;if(isHost&&connections.size)broadcast({type:'state',id:playerId,state:playerState()});else if(!isHost&&hostConn?.open)sendHost({type:'state',state:playerState()});}
        for(const r of remotePlayers.values()){pose(r.model,r.state);if(r.hitUntil&&performance.now()>r.hitUntil){setAvatarTint(r.model,false);r.hitUntil=0;}}
        if(toastTimer>0){toastTimer-=dt;if(toastTimer<=0)toast.style.display='none';}
      }
      if(running&&activeWorldId&&Date.now()-lastSaveAt>12000)saveCurrentWorld();
      renderer.render(scene,camera);
    }
    window.addEventListener('resize',()=>{if(!ROOT.isConnected)return;camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
    window.__featherMCCleanup=()=>{saveCurrentWorld();cleanup();ROOT.remove();};window.addEventListener('pagehide',()=>{saveCurrentWorld();});updateHotbar();updateHealth();showLogin();frame();
  }
})();
