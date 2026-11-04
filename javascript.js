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
      .fm-crafting-window{width:min(1040px,96vw);max-height:94vh;padding:15px 20px}.fm-craft-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}.fm-craft-head button{border:2px solid #777;padding:4px 12px;background:#ddd}.fm-craft-layout{display:flex;gap:14px;align-items:stretch;justify-content:center}.fm-player-panel{min-width:0;flex:1}.fm-recipe-panel{flex-direction:column;min-width:210px;width:min(290px,32vw);padding:10px;background:#bababa;border:3px solid #888;gap:8px}.fm-recipe-panel input{width:100%;padding:8px;background:#eee;border:2px solid #777;color:#111}.fm-recipes{overflow:auto;max-height:440px;display:grid;align-content:start;gap:4px}.fm-recipe-entry{display:flex;align-items:center;gap:8px;min-width:0;text-align:left;background:#8b8b8b;color:#444;border:2px solid #777;padding:5px;cursor:pointer}.fm-recipe-entry.can-craft{background:#91bd84;color:#214920;border-color:#52774d}.fm-recipe-entry:hover{filter:brightness(1.10)}.fm-recipe-entry small{display:block;font-size:10px;line-height:1.3;overflow-wrap:anywhere}.fm-recipe-entry b{font-size:12px}.fm-recipe-entry .fm-item-icon{flex:0 0 30px;height:30px}.fm-craft-upper{display:grid;grid-template-columns:minmax(175px,1fr) minmax(210px,1fr);gap:16px;align-items:start;margin:0 0 18px}.fm-equipment-panel{display:flex;gap:9px;align-items:center}.fm-armour-slots{display:grid;grid-template-columns:repeat(2,36px);gap:3px}.fm-armour-slots .fm-inv-slot{width:36px;height:36px}.fm-paper-doll{position:relative;flex:1;min-width:75px;max-width:120px;height:166px;background:linear-gradient(#5558,#5553);border:3px inset #aaa}.fm-paper-doll div{position:absolute;border:2px solid #555;box-shadow:inset -5px -5px #0002}.fm-doll-head{left:36%;top:13px;width:30%;height:30px}.fm-doll-body{left:33%;top:45px;width:34%;height:51px}.fm-doll-leftarm{left:17%;top:45px;width:16%;height:52px}.fm-doll-rightarm{right:17%;top:45px;width:16%;height:52px}.fm-doll-leftleg{left:33%;top:96px;width:16%;height:52px}.fm-doll-rightleg{right:33%;top:96px;width:16%;height:52px}.fm-doll-name{position:absolute;bottom:2px;left:0;right:0;text-align:center;font-size:11px;white-space:nowrap;overflow:hidden}.fm-craft-title{display:flex;align-items:center;justify-content:space-between;gap:12px}.fm-book-toggle{font-size:20px;padding:2px 6px;background:#a2a2a2;border:3px solid #eee;box-shadow:2px 2px #555}.fm-book-toggle.active{background:#8ebe82}.fm-craft-row{display:flex;align-items:center;gap:6px;margin:14px 0}.fm-craft-grid{display:grid;gap:3px;flex-shrink:0}.fm-craft-grid .fm-craft-cell{width:40px;height:40px;padding:0}.fm-craft-output{width:48px;height:48px;margin:0;flex-shrink:0;position:relative}.fm-arrow{font-size:25px}.fm-mini-craft{font-size:12px!important;padding:7px!important}.fm-mini-craft:disabled{opacity:.45}.fm-section-title{display:block;margin:9px 0 5px}.fm-inv-help{font-size:10px;color:#555;margin-top:10px}.fm-inventory button{color:#222}.fm-inventory .fm-craft-output:disabled{opacity:.65}
      @media(max-width:750px){.fm-craft-layout{flex-direction:column}.fm-recipe-panel{width:100%;max-height:180px}.fm-recipes{max-height:125px}.fm-craft-upper{grid-template-columns:1fr 1fr}.fm-paper-doll{max-width:92px}}
      @media(max-width:650px){.fm-logo{font-size:36px}.fm-slot{width:34px;height:38px}.fm-slot.selected{width:38px;height:42px}.fm-hotbar{gap:2px}.fm-heart{width:15px;height:15px}.fm-inventory{padding:10px}.fm-inv-grid{gap:2px}}

      .fm-box{border:1px solid #83ac88;border-radius:13px;background:linear-gradient(150deg,#1b3027ef,#101b18f5);box-shadow:0 24px 75px #000c,inset 0 1px #ffffff20;padding:25px}
      .fm-logo{letter-spacing:1.5px;text-shadow:0 4px 0 #142619,0 10px 30px #4abd7b4a}
      .fm-button{border:1px solid #2c6e35;border-radius:9px;padding:12px 15px;box-shadow:inset 0 1px #ffffff4c,0 4px 0 #224522;transition:filter .14s,transform .14s;background:linear-gradient(#65b751,#3f8939)}
      .fm-button:hover{filter:brightness(1.13);transform:translateY(-1px)}.fm-button:active{transform:translateY(2px);box-shadow:inset 0 1px #ffffff33,0 1px #244421}
      .fm-secondary{background:linear-gradient(#687b73,#475e55);border-color:#788a7d;box-shadow:inset 0 1px #ffffff22,0 4px #2a3c34}
      .fm-input{border-radius:8px;border:1px solid #9caf98;background:#e6eee6;color:#23342b;outline:none}.fm-input:focus{box-shadow:0 0 0 3px #69bd65a3;border-color:#6abf62}
      select.fm-input{cursor:pointer}input[type=range].fm-input{padding:7px;accent-color:#70bc59}
      .fm-overlay .fm-inventory{border-radius:13px;box-shadow:0 22px 70px #0009}.fm-recipe-entry{border-radius:6px}
      .fm-party-status{display:flex;align-items:center;justify-content:space-between;background:#243b2e9c;border:1px solid #6d927a;border-radius:9px;padding:9px 11px;gap:9px}
      .fm-party-avatar{display:inline-flex;align-items:center;justify-content:center;border-radius:100%;border:2px solid #9cbda2;background:linear-gradient(#77a1ba,#435c93);color:#fff;font-weight:800;width:28px;height:28px;font-size:12px;margin-left:-6px;box-shadow:0 2px 6px #0007}
      .fm-chest-ui{border-radius:12px;box-shadow:0 20px 55px #000a;background:#c6c4bf}.fm-chest-ui .fm-inv-slot{border-radius:3px}.fm-chest-close{color:#202020;background:#eee;border:2px solid #666;border-radius:6px;padding:4px 12px}
      .fm-deathscreen{position:absolute;inset:0;z-index:500;display:none;flex-direction:column;justify-content:center;align-items:center;gap:22px;background:#3b000069;backdrop-filter:blur(9px) brightness(.65);color:white;text-align:center}
      .fm-deathscreen h1{font-size:clamp(40px,8vw,74px);margin:0;text-shadow:3px 5px #340f11;font-weight:900}.fm-deathscreen p{font-size:clamp(15px,3vw,22px);margin:0;text-shadow:1px 2px #111}
      .fm-deathscreen .fm-button{max-width:300px}
      @media(max-width:680px){.fm-box{padding:16px}.fm-button{padding:11px}.fm-party-status{padding:7px}}
    `;
    ROOT.appendChild(style);

    // FeatherMC v17: procedural clouds, correct player scale, Creative flight, multiplayer player saves and respawns.
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
      red_bed:['Red Bed','#af3838'],white_wool:['White Wool','#ecece6'],tnt:['TNT','#c93c35'],gunpowder:['Gunpowder','#353d36'],flint:['Flint','#454c51'],flint_and_steel:['Flint and Steel','#b5bdc3'],gravel:['Gravel','#898681'],glass:['Glass','#c2edf4'],cobblestone:['Cobblestone','#787878'],oak_button:['Oak Button','#aa7542'],oak_pressure_plate:['Oak Pressure Plate','#b48d5a'],oak_slab:['Oak Slab','#ae804f'],oak_stairs:['Oak Stairs','#b58c54'],ladder:['Ladder','#bd995c'],oak_fence:['Oak Fence','#ae7f49'],oak_door:['Oak Door','#a57842'],stone_sword:['Stone Sword','#929292'],redstone:['Redstone Dust','#a7222c'],bone:['Bone','#d7d0bd'],string:['String','#dbdbd6'],bow:['Bow','#805b30'],arrow:['Arrow','#aeb4aa'],shield:['Shield','#967142'],iron_block:['Block of Iron','#c5c9c9'],diamond_block:['Block of Diamond','#53d4c7'],coal_block:['Block of Coal','#252525'],
      raw_porkchop:['Raw Porkchop','#d77a79'], cooked_porkchop:['Cooked Porkchop','#9d5142'], raw_beef:['Raw Beef','#c87868'], cooked_beef:['Cooked Beef','#995444'], raw_chicken:['Raw Chicken','#d6b6a0'], cooked_chicken:['Cooked Chicken','#c28b43'], feather:['Feather','#eeeeea'], leather:['Leather','#9b6844'], water:['Water','#3b85e8'], lava:['Lava','#ff641c'], bucket:['Bucket','#bfc5ca'], water_bucket:['Water Bucket','#3985e5'], lava_bucket:['Lava Bucket','#f46a23'], torch:['Torch','#e9b34a'], chest:['Chest','#a66b32'], apple:['Apple','#d44334'], golden_apple:['Golden Apple','#e9b82c'], enchanted_golden_apple:['Enchanted Golden Apple','#dd99e9'], gold_ingot:['Gold Ingot','#e9c343'], emerald:['Emerald','#38cc70']
    };
    const placeable = ['bedrock','grass','dirt','stone','oak_log','oak_leaves','sand','oak_planks','sandstone','red_sandstone','crafting_table','furnace','coal_ore','iron_ore','diamond_ore','chest','water','lava','torch','red_bed','white_wool','tnt','gravel','glass','cobblestone','oak_button','oak_pressure_plate','oak_slab','oak_stairs','ladder','oak_fence','oak_door','iron_block','diamond_block','coal_block'];
    const avatars = {
      Steve:{shirt:0x2464c4,pants:0x303b75,skin:0xe0aa78}, Alex:{shirt:0xd47c36,pants:0x447245,skin:0xe0aa78},
      Knight:{shirt:0x727b88,pants:0x343c49,skin:0xd9a77f}, Explorer:{shirt:0x477e55,pants:0x604b39,skin:0xc99062}
    };
    let running=false,paused=false,inventoryOpen=false,chatOpen=false,isHost=false;
    let peer=null,hostConn=null,roomCode='',networkHostId='',playerId='local',playerName='Falleen',avatarChoice='Steve',avatarAppearance={shirt:0x2464c4,pants:0x303b75,skin:0xe0aa78,cape:null};
    let worldName='My World',seed='12345',seedHash=1;
    let difficulty='Normal',mobsEnabled=true,pvpEnabled=false,chatEnabled=true,keepInventory=false,playerSleeping=false,lastDeathCause='generic',lastDeathAttacker='',openWorkbench=false,deathPending=false,deathRespawnTarget=null;
    let renderDistance=1,fov=75,sensitivity=1,quality='Low',weather='Clear',dayLength=600,worldTime=0.27,gameMode='Survival',flySpeed=8,isFlying=false,lastSpaceTap=-10000;
    let firstPerson=true,cameraDistance=7,yaw=0,pitch=.12,velocityY=0,grounded=false,walking=0;
    let hp=20,lastHp=20,hunger=20,lastHunger=20,foodTimer=0,starveTimer=0,attackCharge=1,attackCooldown=0,attackAnim=0,placeAnim=0,mineSwingPhase=0,eatAnim=0,miningKey=null,miningProgress=0,placeCooldown=0,pendingMine=null,pendingMineAt=0;
    let f5Debug=false,weatherParticles=null,cloudGroup=null,redFlash=null,redFlashTimer=0;
    let fallPeakY=0,dropCounter=1,lavaDamageTimer=0,oxygen=15,drownTimer=0,regenTimer=0,hitTintTimer=0,knockbackX=0,knockbackZ=0;
    const droppedItems=new Map();
    let roleById=new Set(),chestInventories=new Map(),openChestKey=null,offhand=null,armour={head:null,chest:null,legs:null,feet:null};
    const chestVersions=new Map(),chestLastAction=new Map();let chestActionSeq=0,chestPending=null;
    const cloneStack=v=>v&&items[v.id]&&Number.isInteger(v.count)&&v.count>0?{id:v.id,count:Math.min(maxStack(v.id),v.count)}:null;
    const validChestStack=v=>v===null||v===undefined||(v&&items[v.id]&&Number.isInteger(v.count)&&v.count>=1&&v.count<=maxStack(v.id));
    function chestInteraction(stack,hand,right){const current=cloneStack(stack),cursor=cloneStack(hand);
      if(!cursor&&!current)return {slot:null,cursor:null,changed:false};
      if(!cursor){const n=right?Math.ceil(current.count/2):current.count;return{slot:current.count>n?{...current,count:current.count-n}:null,cursor:{id:current.id,count:n},changed:true};}
      if(!current)return{slot:{id:cursor.id,count:right?1:cursor.count},cursor:right&&cursor.count>1?{...cursor,count:cursor.count-1}:null,changed:true};
      if(current.id===cursor.id){const n=Math.min(maxStack(current.id)-current.count,right?1:cursor.count);if(!n)return{slot:current,cursor,changed:false};return{slot:{...current,count:current.count+n},cursor:cursor.count>n?{...cursor,count:cursor.count-n}:null,changed:true};}
      if(right)return{slot:current,cursor,changed:false};
      return{slot:cursor,cursor:current,changed:true};
    }
    let mobSpawnTimer=0,lastMobSync=0,lastNetSend=0,lastChunkX=null,lastChunkZ=null,mobCounter=1,minedCount=0,toastTimer=0;
    const inventory=Array(36).fill(null),craftingGrid=Array(9).fill(null),unlocked=new Set(),keys={},held={left:false,right:false};
    const defaultKeybinds={forward:'KeyW',back:'KeyS',left:'KeyA',right:'KeyD',jump:'Space',sprint:'ControlLeft',crouch:'ShiftLeft',inventory:'KeyE',chat:'Slash'};
    const keybinds={...defaultKeybinds};
    let waitingBind=null,settingsReturn='home',fallbackPointerId=null,fallbackLook=false,fallbackMoved=false,fallbackStartX=0,fallbackStartY=0,fallbackLastX=0,fallbackLastY=0;
    let sandTimer=0,dropSyncTimer=0,lastDropSnapshotAt=0;
    const optimisticPlacements=new Map(),optimisticMines=new Map(),pickupRequests=new Map();
    const ENTITY_MAX_DISTANCE=128;const primedTnt=new Map(),sleepingPlayers=new Set();let activeTntId=0;
    const maxEntityDistance=()=>Math.min(ENTITY_MAX_DISTANCE,Math.max(24,(renderDistance+.5)*16));
    const nearEntity=(x,z,range=maxEntityDistance())=>Math.hypot(player.position.x-x,player.position.z-z)<=range;
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
    const chunks=new Map(),world=new Map(),mods=new Map(),mobs=new Map(),connections=new Map(),remotePlayers=new Map(),playerRecords=new Map();let lastPlayerDataSend=0;
    const farTerrain=new Map(),farTerrainQueue=[],farQueuedKeys=new Set(),FAR_NEAR_LIMIT=7;
    const chunkQueue=[],queuedChunkKeys=new Set(),dirtyChunkQueue=[],dirtyChunkKeys=new Set();let desiredChunkKeys=new Set();
    const sandCandidateKeys=new Set();let sandCandidateList=[],sandCursor=0;
    const fallingSandQueue=[],fallingSandQueued=new Set();
    function wakeSand(x,y,z){const key=k3(x,y,z);if(world.get(key)!=='sand'||fallingSandQueued.has(key))return;fallingSandQueued.add(key);fallingSandQueue.push(key);}

    const hasAuthority=()=>isHost||!peer;
    function ensurePeer(callback){if(window.Peer){callback();return;}const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/peerjs@1.5.5/dist/peerjs.min.js';s.onload=()=>{if(window.Peer)callback();else showMenuMessage('Multiplayer library did not load.');};s.onerror=()=>showMenuMessage('Multiplayer is blocked because PeerJS could not load.');document.head.appendChild(s);}

    // -------------------- Three.js scene --------------------
    const scene=new THREE.Scene();scene.background=new THREE.Color(0x87ceeb);scene.fog=new THREE.Fog(0x87ceeb,30,110);
    const handTorchLight=new THREE.PointLight(0xffb45b,0,12);scene.add(handTorchLight);
    const camera=new THREE.PerspectiveCamera(fov,innerWidth/innerHeight,.1,430);
    const renderer=new THREE.WebGLRenderer({antialias:false,powerPreference:'low-power',depth:true,stencil:false,precision:'mediump'});renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,.55));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.info.autoReset=true;ROOT.appendChild(renderer.domElement);scene.add(camera);
    const hemisphere=new THREE.HemisphereLight(0xffffff,0x65734b,2);scene.add(hemisphere);const sun=new THREE.DirectionalLight(0xffffff,1.5);sun.position.set(30,50,20);scene.add(sun);
    cloudGroup=new THREE.Group();scene.add(cloudGroup);
    const cloudGeo=new THREE.BoxGeometry(1,1,1);
    const cloudMat=new THREE.MeshLambertMaterial({color:0xffffff,transparent:true,opacity:.91,depthWrite:false});
    let cloudAreaX=NaN,cloudAreaZ=NaN,cloudInstances=null;
    function rebuildClouds(force=false){
      // Clouds are deterministic for this world seed and region, not repeating camera-centred rows.
      const step=34,centreX=Math.floor(player.position.x/(step*5))*5,centreZ=Math.floor(player.position.z/(step*5))*5;
      if(!force&&centreX===cloudAreaX&&centreZ===cloudAreaZ)return;
      cloudAreaX=centreX;cloudAreaZ=centreZ;
      const patches=[],occupied=[],dummy=new THREE.Object3D(),matrices=[];
      for(let gx=centreX-13;gx<=centreX+13;gx++)for(let gz=centreZ-13;gz<=centreZ+13;gz++){
        const chance=hash2(gx*73+61,gz*43-107);if(chance<.25)continue;
        const x=gx*step+(hash2(gx*71+11,gz*37)-.5)*14;
        const z=gz*step+(hash2(gx*17-58,gz*83+5)-.5)*14;
        const w=10+hash2(gx*11+1,gz*7+5)*12,d=9+hash2(gx*3+19,gz*5+2)*10;
        // Different cloud formations cannot overlap on the XZ plane.
        if(occupied.some(o=>Math.abs(x-o.x)<(w+o.w)/2+2&&Math.abs(z-o.z)<(d+o.d)/2+2))continue;
        occupied.push({x,z,w,d});
        const y=51+Math.round(hash2(gx*7+18,gz*13+9)*5);
        const variant=hash2(gx*21-31,gz*19+8);
        // A cloud formation is a few connected, flat, rectangular voxel puffs.
        const forms=variant<.33?
          [[-.25,0,.50,.76],[.22,.06,.53,.62],[.04,-.25,.53,.51]]:
          variant<.67?[[0,0,.82,.54],[-.22,.23,.38,.48],[.22,-.21,.44,.45]]:
          [[-.13,0,.56,.74],[.25,.04,.46,.46],[-.32,-.18,.32,.40],[.04,.29,.39,.38]];
        for(const [ox,oz,bw,bd] of forms){
          dummy.position.set(x+ox*w,y,z+oz*d);dummy.scale.set(w*bw,1.25,d*bd);dummy.rotation.set(0,0,0);dummy.updateMatrix();matrices.push(dummy.matrix.clone());
        }
      }
      if(cloudInstances){cloudGroup.remove(cloudInstances);cloudInstances.dispose?.();}
      cloudInstances=new THREE.InstancedMesh(cloudGeo,cloudMat,Math.max(matrices.length,1));
      matrices.forEach((m,i)=>cloudInstances.setMatrixAt(i,m));
      cloudInstances.count=matrices.length;cloudInstances.instanceMatrix.needsUpdate=true;cloudInstances.frustumCulled=false;
      cloudGroup.add(cloudInstances);
    }
    const rainCount=1300,rainPositions=new Float32Array(rainCount*6);for(let i=0;i<rainCount;i++){const j=i*6,x=(Math.random()-.5)*76,y=Math.random()*48-8,z=(Math.random()-.5)*76;rainPositions[j]=x;rainPositions[j+1]=y;rainPositions[j+2]=z;rainPositions[j+3]=x+.12;rainPositions[j+4]=y-.72;rainPositions[j+5]=z+.04;}const rainGeo=new THREE.BufferGeometry();rainGeo.setAttribute('position',new THREE.BufferAttribute(rainPositions,3));weatherParticles=new THREE.LineSegments(rainGeo,new THREE.LineBasicMaterial({color:0xa6c5df,transparent:true,opacity:.65,depthWrite:false}));weatherParticles.visible=false;scene.add(weatherParticles);
    // Procedural 16x16 pixel art. Built once per session, not per chunk.
    // All graphics are original and require no external texture downloads.
    const pixelImages=new Map(),pixelCanvases=new Map(),pixelTextures=new Map();
    function pixelArt(id){
      if(pixelImages.has(id))return pixelImages.get(id);
      const canvas=document.createElement('canvas');canvas.width=16;canvas.height=16;
      const ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;
      const base=id==='grass_side'?'#84603c':id==='oak_log_top'?'#ad804b':id.endsWith('_ore')?'#85888d':(items[id]?.[1]||'#999999');
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
      if(id==='grass_side'){for(let y=0;y<16;y++)for(let x=0;x<16;x++){const v=random();rect(x,y,1,1,y<3?(v>.5?'#469b36':'#67b64d'):(v>.65?'#987044':v<.23?'#604127':'#80603b'));}for(let x=0;x<16;x++)if(random()>.4)rect(x,2+Math.floor(random()*3),1,1,'#387c2e');}
      if(id==='oak_log_top'){rect(0,0,16,16,'#694526');for(let ring=1;ring<7;ring++){const v=ring%2?'#c29158':'#87613b';ctx.strokeStyle=v;ctx.lineWidth=1;ctx.strokeRect(ring,ring,16-2*ring,16-2*ring);}rect(7,7,2,2,'#5d391e');}
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
      if(id==='tnt'){rect(0,0,16,16,'#b92e2c');for(let x=0;x<16;x+=4){rect(x,0,2,5,'#ef7974');rect(x+2,12,2,4,'#741e22');}rect(0,6,16,5,'#f8e9dc');rect(3,7,10,3,'#232323');rect(5,7,1,3,'#fafafa');rect(9,7,1,3,'#fafafa');}
      if(id==='red_bed'){rect(1,3,14,10,'#ba3030');rect(1,3,4,10,'#eeeeea');rect(0,13,16,2,'#69432b');}
      if(id==='white_wool'){for(let i=0;i<40;i++)rect(Math.floor(random()*16),Math.floor(random()*16),2,2,random()>.5?'#dededb':'#fafaf8');}
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
    const renderTypes=[...placeable,'grass_side','oak_log_top'];
    const blockMats={};for(const id of renderTypes){
      const opts={map:textureFor(id),side:THREE.DoubleSide};
      if(id==='water'||id==='glass')Object.assign(opts,{transparent:true,opacity:id==='water'?.64:.45,depthWrite:false});
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
        for(let y=BEDROCK_Y;y<=h;y++){let type='stone';if(y===BEDROCK_Y||(y<BEDROCK_Y+4&&hash3(x,y,z)>.76))type='bedrock';else if(y===h)type=desert?'sand':'grass';else if(y>=h-3)type=desert?'sand':'dirt';else if(y<h-5&&y>0&&hash2(x*19+y,z*29-y)>.987)type='gravel';else if(y<-43&&hash2(x*17+y,z*23-y)>.989)type='diamond_ore';else if(y<-18&&hash2(x*31+y,z*19-y)>.972)type='iron_ore';else if(y<18&&hash2(x*13+y,z*11-y)>.93)type='coal_ore';const caveBand=y>BEDROCK_Y+1&&y<h-3;const cave=caveBand&&noise3(x*.052,y*.061,z*.052)>.685&&noise3(x*.105+31,y*.125+17,z*.105-19)>.48;if(cave){if(y<-56)storeGenerated(x,y,z,'lava',c);else if(y<-36)storeGenerated(x,y,z,'water',c);continue;}storeGenerated(x,y,z,type,c);}if(!desert&&h<=9){for(let wy=h+1;wy<=9;wy++)storeGenerated(x,wy,z,'water',c);}
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
        // Level roads and house plots. Smooth the outer edge of the settlement.
        for(let lx=0;lx<16;lx++)for(let lz=0;lz<16;lz++){
          const x=sx+lx,z=sz+lz,edge=Math.max(Math.abs(x-vx),Math.abs(z-vz));
          if(edge>25)continue;
          const natural=heightAt(x,z),blend=Math.min(1,Math.max(0,(edge-20)/5));
          const surface=Math.round((base-1)*(1-blend)+natural*blend);
          for(let y=natural+1;y<=surface;y++)putStructure(x,y,z,'dirt');
          for(let y=surface+1;y<=Math.max(natural+8,base+11);y++){
            const key=k3(x,y,z);if(c.blocks.has(key)){c.blocks.delete(key);world.delete(key);}
          }
          putStructure(x,surface,z,biome(x,z)>.79?'sand':'grass');
        }
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
      const templeChest=(x,y,z,tx,tz,salt)=>{
        putStructure(x,y,z,'chest');const key=k3(x,y,z);
        if(x<sx||x>=sx+16||z<sz||z>=sz+16||mods.has(key)||chestInventories.has(key))return;
        const loot=Array(27).fill(null),roll=(n)=>hash2(tx*17+salt*53+n*19,tz*31+salt*47-n*7);
        const pool=[['bone',1,5],['string',1,4],['iron_ingot',1,4],['gold_ingot',1,4],['apple',1,3],['emerald',1,2],['diamond',1,2]];
        const count=3+Math.floor(roll(100)*3);for(let k=0;k<count;k++){
          const entry=pool[Math.floor(roll(k+23)*pool.length)];
          loot[k*3]={id:entry[0],count:entry[1]+Math.floor(roll(k+50)*(entry[2]-entry[1]+1))};
        }
        if(roll(117)<.22)loot[21]={id:'golden_apple',count:1};
        if(roll(118)<.024)loot[23]={id:'enchanted_golden_apple',count:1};
        chestInventories.set(key,loot);
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
        // Four concealed chests on a stone floor below the centre.
        for(let dx=-5;dx<=5;dx++)for(let dz=-5;dz<=5;dz++){
          putStructure(tx+dx,base-6,tz+dz,'sandstone');
          for(let dy=-5;dy<=-1;dy++)putStructure(tx+dx,base+dy,tz+dz,(Math.abs(dx)===5||Math.abs(dz)===5)?'sandstone':null);
        }
        for(const [ox,oz,index] of [[-3,-3,0],[3,-3,1],[-3,3,2],[3,3,3]])templeChest(tx+ox,base-5,tz+oz,tx,tz,index);
        putStructure(tx,base-1,tz,'red_sandstone');
      };
      const isFlatVillageSite=(vx,vz)=>{
        const base=heightAt(vx,vz);let min=base,max=base;
        // All house footprints, roads and surroundings must stay nearly level.
        for(let x=-21;x<=21;x+=3)for(let z=-21;z<=21;z+=3){
          const h=heightAt(vx+x,vz+z);min=Math.min(min,h);max=Math.max(max,h);
          if(max-min>7||Math.abs(h-base)>7||biome(vx+x,vz+z)>.78)return false;
        }
        return true;
      };
      // Check nearby 128x128 regions. Terrain and structure layout share the world seed.
      for(let rx=Math.floor((sx-52)/128);rx<=Math.floor((sx+68)/128);rx++)
      for(let rz=Math.floor((sz-52)/128);rz<=Math.floor((sz+68)/128);rz++){
        const vx=rx*128+24+Math.floor(hash2(rx*53+1201,rz*97+309)*80);
        const vz=rz*128+24+Math.floor(hash2(rx*113-498,rz*59+851)*80);
        if(Math.hypot(vx,vz)>25&&hash2(rx*17+712,rz*29+455)>.64){
          if(biome(vx,vz)<.73&&isFlatVillageSite(vx,vz))village(vx,vz);
          else if(biome(vx,vz)>.77)temple(vx,vz);
        }
      }
      for(const [key,type] of mods){const [x,y,z]=key.split(',').map(Number);if(Math.floor(x/16)!==cx||Math.floor(z/16)!==cz)continue;if(type===null){c.blocks.delete(key);world.delete(key);}else storeGenerated(x,y,z,type,c);}
    }
    function generateChunk(cx,cz){for(const _ of generateChunkSteps(cx,cz)){} }
    const chestModels=new Map();
    const chestBodyGeometry=new THREE.BoxGeometry(1.035,.73,1.035),chestLidGeometry=new THREE.BoxGeometry(1.055,.26,1.055),chestLockGeometry=new THREE.BoxGeometry(.15,.24,.08),chestBandGeometry=new THREE.BoxGeometry(1.055,.075,1.055),chestStrapGeometry=new THREE.BoxGeometry(.14,.18,1.09);
    const chestBodyMat=new THREE.MeshLambertMaterial({color:0x855023}),chestLidMat=new THREE.MeshLambertMaterial({color:0xb27a39}),chestLockMat=new THREE.MeshLambertMaterial({color:0xd8c775}),chestBandMat=new THREE.MeshLambertMaterial({color:0x493016});
    function makeChestModel(b,c){const key=k3(b.x,b.y,b.z),g=new THREE.Group();g.position.set(b.x+.5,b.y,b.z+.5);
      const lower=new THREE.Mesh(chestBodyGeometry,chestBodyMat);lower.position.y=.37;g.add(lower);
      const band=new THREE.Mesh(chestBandGeometry,chestBandMat);band.position.y=.65;g.add(band);
      const hinge=new THREE.Group();hinge.position.set(0,.78,.51);g.add(hinge);
      const lid=new THREE.Mesh(chestLidGeometry,chestLidMat);lid.position.set(0,.115,-.51);hinge.add(lid);
      const latch=new THREE.Mesh(chestLockGeometry,chestLockMat);latch.position.set(0,-.02,-1.052);hinge.add(latch);
      const strap=new THREE.Mesh(chestStrapGeometry,chestBandMat);strap.position.set(0,.22,-.51);hinge.add(strap);
      hinge.rotation.x=openChestKey===key?-.95:0;scene.add(g);c.chestDecor??=[];c.chestDecor.push(g);chestModels.set(key,{g,hinge});
    }
    function setChestLid(key,open){const obj=chestModels.get(key);if(obj)obj.hinge.rotation.x=open?-.95:0;}
    function disposeChunk(c){if(c.mesh){scene.remove(c.mesh);c.mesh.geometry.dispose();c.mesh=null;}for(const g of c.chestDecor||[]){chestModels.delete(k3(Math.floor(g.position.x),Math.floor(g.position.y),Math.floor(g.position.z)));scene.remove(g);}c.chestDecor=[];}
    function* buildChunkSteps(c){
      const revision=c.revision||0;
      // Keep the previous mesh visible while the replacement is built.
const byType=renderTypes.map(()=>[]),normByType=renderTypes.map(()=>[]),idx=Object.fromEntries(renderTypes.map((id,i)=>[id,i]));
      let meshWork=0;
      for(const b of c.blocks.values()){
        if(++meshWork%500===0)yield;
        for(const f of faces){const neighbour=world.get(k3(b.x+f.n[0],b.y+f.n[1],b.z+f.n[2]));const currentSolid=isSolidBlock(b.type),neighbourSolid=isSolidBlock(neighbour);if(neighbour&&!(currentSolid&&!neighbourSolid))continue;const materialId=b.type==='grass'&&f.n[1]!==1?'grass_side':b.type==='oak_log'&&Math.abs(f.n[1])===1?'oak_log_top':b.type;const p=byType[idx[materialId]],n=normByType[idx[materialId]];for(const j of tri){const v=f.c[j];p.push(b.x-c.cx*16+v[0],b.y+v[1],b.z-c.cz*16+v[2]);n.push(f.n[0],f.n[1],f.n[2]);}}}
      if(chunks.get(ck(c.cx,c.cz))!==c)return;
      if((c.revision||0)!==revision){markChunkDirty(c.cx,c.cz);return;}
      disposeChunk(c);
      const pos=[],norm=[],geo=new THREE.BufferGeometry();let offset=0;
      for(let i=0;i<renderTypes.length;i++){const p=byType[i],n=normByType[i];if(!p.length)continue;geo.addGroup(offset,p.length/3,i);for(let j=0;j<p.length;j++)pos.push(p[j]);for(let j=0;j<n.length;j++)norm.push(n[j]);offset+=p.length/3;}
      if(!pos.length)return;geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setAttribute('normal',new THREE.Float32BufferAttribute(norm,3));c.mesh=new THREE.Mesh(geo,renderTypes.map(id=>blockMats[id]));c.mesh.position.set(c.cx*16,0,c.cz*16);scene.add(c.mesh);for(const block of c.blocks.values())if(block.type==='chest')makeChestModel(block,c);
    }
    function buildChunk(c){for(const _ of buildChunkSteps(c)){} }
    function rebuildAll(){for(const c of chunks.values())buildChunk(c);}
    function removeChunk(cx,cz){const key=ck(cx,cz),c=chunks.get(key);if(!c)return;disposeChunk(c);for(const [blockKey,b] of c.blocks){world.delete(blockKey);if(b.type==='sand')sandCandidateKeys.delete(blockKey);}dirtyChunkKeys.delete(key);chunks.delete(key);}
    const farGeoMat=new THREE.MeshLambertMaterial({vertexColors:true,side:THREE.DoubleSide});
    function removeFarTerrain(key){const mesh=farTerrain.get(key);if(mesh){scene.remove(mesh);mesh.geometry.dispose();farTerrain.delete(key);}}
    function createFarTerrain(cx,cz){
      const key=ck(cx,cz);if(chunks.has(key)||farTerrain.has(key))return;
      // Each low-cost column has a flat block top and genuine vertical walls.
      const positions=[],colors=[],normals=[],step=quality==='High'?2:4,cols=16/step;
      const heights=[];for(let z=0;z<cols;z++){heights[z]=[];for(let x=0;x<cols;x++)heights[z][x]=heightAt(cx*16+x*step+step*.5,cz*16+z*step+step*.5)+1;}
      const writeFace=(coords,hex,shade)=>{const c=new THREE.Color(hex);for(const q of [0,1,2,0,2,3]){const v=coords[q];positions.push(...v);colors.push(c.r*shade,c.g*shade,c.b*shade);}};
      for(let iz=0;iz<cols;iz++)for(let ix=0;ix<cols;ix++){
        const x=cx*16+ix*step,z=cz*16+iz*step,y=heights[iz][ix];
        const desert=biome(x,z)>.79,grass=desert?'#d7bb78':'#699c45',dirt=desert?'#c9a96c':'#785532',noise=.92+hash2(x,z)*.12;
        writeFace([[x,y,z],[x+step,y,z],[x+step,y,z+step],[x,y,z+step]],grass,noise);
        const sides=[[-1,0,[[x,y,z+step],[x,y,z],[x,0,z],[x,0,z+step]]],
          [1,0,[[x+step,y,z],[x+step,y,z+step],[x+step,0,z+step],[x+step,0,z]]],
          [0,-1,[[x,y,z],[x+step,y,z],[x+step,0,z],[x,0,z]]],
          [0,1,[[x+step,y,z+step],[x,y,z+step],[x,0,z+step],[x+step,0,z+step]]]];
        for(const [dx,dz,verts] of sides){const ni=ix+dx,nj=iz+dz;
          const adjacent=ni>=0&&nj>=0&&ni<cols&&nj<cols?heights[nj][ni]:heightAt(x+step*.5+dx*step,z+step*.5+dz*step)+1;
          if(adjacent>=y)continue;
          const lower=Math.max(y-10,adjacent);
          for(const pt of verts)if(pt[1]===0)pt[1]=lower;
          writeFace(verts,dirt,noise*(dx!==0?.75:.84));
        }
      }
      const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geometry.computeVertexNormals();
      const mesh=new THREE.Mesh(geometry,farGeoMat);mesh.frustumCulled=true;scene.add(mesh);farTerrain.set(key,mesh);
    }
    function processFarTerrain(){let budget=quality==='Low'?3:quality==='Medium'?5:7;
      while(budget--&&farTerrainQueue.length){const q=farTerrainQueue.shift();farQueuedKeys.delete(q.key);if(desiredFarKeys.has(q.key)&&!chunks.has(q.key))createFarTerrain(q.cx,q.cz);}
    }
    let desiredFarKeys=new Set();
    function updateChunks(force=false){
      const cx=Math.floor(player.position.x/16),cz=Math.floor(player.position.z/16);
      if(!force&&cx===lastChunkX&&cz===lastChunkZ)return;
      lastChunkX=cx;lastChunkZ=cz;
      const detailRadius=Math.min(renderDistance,FAR_NEAR_LIMIT),keep=new Set(),far=new Set();
      for(let x=-renderDistance;x<=renderDistance;x++)for(let z=-renderDistance;z<=renderDistance;z++){
        const dist=x*x+z*z;if(dist>renderDistance*renderDistance+1)continue;
        const key=ck(cx+x,cz+z);
        if(dist<=detailRadius*detailRadius+1)keep.add(key);else far.add(key);
      }
      desiredChunkKeys=keep;desiredFarKeys=far;
      if(activeMeshBuild&&!keep.has(activeMeshKey)){activeMeshBuild=null;activeMeshKey=null;}
      if(activeChunkBuild&&!keep.has(activeChunkKey)){
        const old=chunks.get(activeChunkKey);if(old)removeChunk(old.cx,old.cz);
        activeChunkBuild=null;activeChunkKey=null;
      }
      for(let i=chunkQueue.length-1;i>=0;i--)if(!keep.has(chunkQueue[i].key)){
        queuedChunkKeys.delete(chunkQueue[i].key);chunkQueue.splice(i,1);
      }
      for(const c of [...chunks.values()])if(!keep.has(ck(c.cx,c.cz)))removeChunk(c.cx,c.cz);
      for(const key of [...farTerrain.keys()])if(!far.has(key)||chunks.has(key))removeFarTerrain(key);
      for(let i=farTerrainQueue.length-1;i>=0;i--)if(!far.has(farTerrainQueue[i].key)){
        farQueuedKeys.delete(farTerrainQueue[i].key);farTerrainQueue.splice(i,1);
      }
      const pending=[];
      for(const key of keep){const [nx,nz]=key.split(',').map(Number);
        if(!chunks.has(key)&&!queuedChunkKeys.has(key))pending.push({cx:nx,cz:nz,key,d:(nx-cx)**2+(nz-cz)**2});
      }
      pending.sort((a,b)=>a.d-b.d);for(const entry of pending){chunkQueue.push(entry);queuedChunkKeys.add(entry.key);}
      for(const key of far)if(!farTerrain.has(key)&&!farQueuedKeys.has(key)){
        const [nx,nz]=key.split(',').map(Number);farTerrainQueue.push({cx:nx,cz:nz,key});farQueuedKeys.add(key);
      }
      farTerrainQueue.sort((a,b)=>(a.cx-cx)**2+(a.cz-cz)**2-(b.cx-cx)**2-(b.cz-cz)**2);
      const centerKey=ck(cx,cz);
      if(!chunks.has(centerKey)){
        queuedChunkKeys.delete(centerKey);const i=chunkQueue.findIndex(q=>q.key===centerKey);
        if(i>=0)chunkQueue.splice(i,1);
        generateChunk(cx,cz);const center=chunks.get(centerKey);if(center)buildChunk(center);
      }
    }
    function markChunkDirty(cx,cz){const key=ck(cx,cz);if(chunks.has(key)&&!dirtyChunkKeys.has(key)){dirtyChunkKeys.add(key);const near=Math.abs(cx-Math.floor(player.position.x/16))<=1&&Math.abs(cz-Math.floor(player.position.z/16))<=1;if(near)dirtyChunkQueue.unshift(key);else dirtyChunkQueue.push(key);}}
    function flushNearbyMesh(x,z){if(Math.hypot(player.position.x-x,player.position.z-z)>9)return;const c=chunks.get(ck(Math.floor(x/16),Math.floor(z/16)));if(!c)return;buildChunk(c);dirtyChunkKeys.delete(ck(c.cx,c.cz));}
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
        function ensureChunkAt(x,z){const cx=Math.floor(x/16),cz=Math.floor(z/16),key=ck(cx,cz);removeFarTerrain(key);queuedChunkKeys.delete(key);const qi=chunkQueue.findIndex(q=>q.key===key);if(qi>=0)chunkQueue.splice(qi,1);let c=chunks.get(key);if(!c){generateChunk(cx,cz);c=chunks.get(key);if(c){markChunkDirty(cx,cz);for(const [nx,nz] of [[cx-1,cz],[cx+1,cz],[cx,cz-1],[cx,cz+1]])markChunkDirty(nx,nz);}}return c;}
    function changeBlock(x,y,z,type){x=Math.floor(x);y=Math.floor(y);z=Math.floor(z);const key=k3(x,y,z),c=chunks.get(ck(Math.floor(x/16),Math.floor(z/16)));if(!c)return false;if(type===null){c.blocks.delete(key);world.delete(key);sandCandidateKeys.delete(key);}else{c.blocks.set(key,{x,y,z,type});world.set(key,type);if(type==='sand'&&!sandCandidateKeys.has(key)){sandCandidateKeys.add(key);sandCandidateList.push(key);}else if(type!=='sand')sandCandidateKeys.delete(key);}mods.set(key,type);c.revision=(c.revision||0)+1;markChunkDirty(c.cx,c.cz);if(x%16===0)markChunkDirty(c.cx-1,c.cz);if((x+1)%16===0)markChunkDirty(c.cx+1,c.cz);if(z%16===0)markChunkDirty(c.cx,c.cz-1);if((z+1)%16===0)markChunkDirty(c.cx,c.cz+1);if(type==='water'&&!flowDepth.has(key))flowDepth.set(key,0);
      if(type!=='water')flowDepth.delete(key);
      if(type===null||type==='water')wakeNearbyWater(x,y,z);wakeSand(x,y+1,z);wakeSand(x,y,z);
      return true;}
    function groundAt(x,z,maxFeet=Infinity){const bx=Math.floor(x),bz=Math.floor(z);const top=Math.min(120,Math.floor(maxFeet-0.001));for(let y=top;y>=BEDROCK_Y;y--)if(isSolidBlock(world.get(k3(bx,y,bz))))return y+1;return BEDROCK_Y+1;}
    function floorAt(x,z,maxFeet=Infinity){
      // Check each corner of a player's feet. Edge contact should support the player.
      return Math.max(groundAt(x-.27,z-.27,maxFeet),groundAt(x+.27,z-.27,maxFeet),groundAt(x-.27,z+.27,maxFeet),groundAt(x+.27,z+.27,maxFeet));
    }
    function collides(x,y,z){if(y<=BEDROCK_Y)return true;if(!chunks.has(ck(Math.floor(x/16),Math.floor(z/16))))return true;for(let a=Math.floor(x-.3);a<=Math.floor(x+.3);a++)for(let b=Math.floor(y+.001);b<=Math.floor(y+(keys[keybinds.crouch]?1.49:1.799));b++)for(let c=Math.floor(z-.3);c<=Math.floor(z+.3);c++)if(isSolidBlock(world.get(k3(a,b,c))))return true;return false;}
    function fluidAt(x,y,z){return world.get(k3(Math.floor(x),Math.floor(y),Math.floor(z)));}
    function playerFluid(){const samples=[.15,.75,1.35,1.7].map(h=>fluidAt(player.position.x,player.position.y+h,player.position.z));return{water:samples.includes('water'),lava:samples.includes('lava')};}

    // Models
    function box(parent,w,h,d,mat,x,y,z){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);parent.add(m);return m;}
    const viewmodel=new THREE.Group();camera.add(viewmodel);
    const vmSleeveMat=new THREE.MeshBasicMaterial({color:avatars[avatarChoice].shirt}),vmSkinMat=new THREE.MeshBasicMaterial({color:avatars[avatarChoice].skin}),vmDarkMat=new THREE.MeshBasicMaterial({color:0x393939});
    const vmArm=new THREE.Group();viewmodel.add(vmArm);box(vmArm,.24,.48,.27,vmSleeveMat,.38,-.39,-.73);box(vmArm,.21,.25,.24,vmSkinMat,.38,-.68,-.76);
    const vmHeld=new THREE.Group();vmArm.add(vmHeld);
    // The item is a child of the arm and shares its swing, bob, mining and eating motions.
    vmHeld.position.set(.48,-.71,-.83);vmHeld.rotation.set(-.25,-.2,-.35);
    function updateViewmodel(){while(vmHeld.children.length){const child=vmHeld.children[0];vmHeld.remove(child);child.geometry?.dispose();if(child.material?.dispose)child.material.dispose();}const id=inventory[selectedSlot]?.id;if(id){const color=new THREE.MeshBasicMaterial({map:textureFor(id),side:THREE.DoubleSide});if(placeable.includes(id)){box(vmHeld,.27,.27,.27,color,0,0,0);}else if(id.includes('sword')){box(vmHeld,.075,.5,.09,color,0,.25,0);box(vmHeld,.25,.07,.11,vmDarkMat,0,-.02,0);box(vmHeld,.08,.22,.08,vmDarkMat,0,-.16,0);}else if(id.includes('pickaxe')||id.includes('axe')){box(vmHeld,.08,.74,.08,vmDarkMat,0,.24,0);box(vmHeld,.45,.12,.14,color,-.04,.56,0);}else{box(vmHeld,.16,.36,.16,color,0,0,0);}}viewmodel.visible=firstPerson&&!paused&&!inventoryOpen&&!chatOpen;vmSleeveMat.color.setHex(avatarAppearance?.shirt??(avatars[avatarChoice]||avatars.Steve).shirt);vmSkinMat.color.setHex(avatarAppearance?.skin??(avatars[avatarChoice]||avatars.Steve).skin);}
    function makeAvatar(name,preset,appearance=null){
      // 1 block == 1 metre. Player visual: 0.45 body wide, 1.8 high;
      // collision: 0.6 wide and 1.8 high, crouched 1.5. Original pixel-style textures.
      const colors={...(avatars[preset]||avatars.Steve),...(appearance||{})};
      const g=new THREE.Group(),body=new THREE.Group();g.add(body);
      const skin=new THREE.MeshLambertMaterial({color:colors.skin}),shirt=new THREE.MeshLambertMaterial({color:colors.shirt}),pants=new THREE.MeshLambertMaterial({color:colors.pants}),dark=new THREE.MeshLambertMaterial({color:0x222222});
      const legLength=.675,shoulderY=1.35;
      const ll=new THREE.Group();ll.position.set(-.1125,legLength,0);body.add(ll);box(ll,.225,legLength,.225,pants,0,-legLength/2,0);
      const rl=new THREE.Group();rl.position.set(.1125,legLength,0);body.add(rl);box(rl,.225,legLength,.225,pants,0,-legLength/2,0);
      box(body,.45,.675,.225,shirt,0,1.0125,0);
      const head=new THREE.Group();head.position.set(0,shoulderY,0);body.add(head);box(head,.45,.45,.45,skin,0,.225,0);
      box(head,.077,.065,.015,dark,-.113,.27,-.232);box(head,.077,.065,.015,dark,.113,.27,-.232);
      const la=new THREE.Group();la.position.set(-.3375,shoulderY,0);body.add(la);box(la,.225,.675,.225,shirt,0,-.3375,0);
      const ra=new THREE.Group();ra.position.set(.3375,shoulderY,0);body.add(ra);box(ra,.225,.675,.225,shirt,0,-.3375,0);
      const canvas=document.createElement('canvas');canvas.width=512;canvas.height=128;const ctx=canvas.getContext('2d');ctx.fillStyle='#0009';ctx.fillRect(0,0,512,128);ctx.font='bold 64px Arial';ctx.textAlign='center';ctx.fillStyle='white';ctx.fillText(String(name||'Player').slice(0,18),256,84);
      const tag=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(canvas),transparent:true,depthTest:false}));tag.scale.set(1.8,.45,1);tag.position.y=2.14;g.add(tag);
      if(colors.cape){const cape=new THREE.Mesh(new THREE.BoxGeometry(.45,.75,.045),new THREE.MeshLambertMaterial({color:colors.cape}));cape.position.set(0,1.03,.14);body.add(cape);}
      return{group:g,body,head,leftLeg:ll,rightLeg:rl,leftArm:la,rightArm:ra,name,preset,appearance:colors};
    }
    function poseCrouch(model,crouching,blend=.35){
      if(!model?.body)return;
      model.body.position.y=THREE.MathUtils.lerp(model.body.position.y,crouching?-.28:0,blend);
      model.body.rotation.x=THREE.MathUtils.lerp(model.body.rotation.x,crouching?-.22:0,blend);
      model.leftLeg.rotation.x+=crouching?-.24:0;
      model.rightLeg.rotation.x+=crouching?-.24:0;
    }
    function pose(model,s){
      const target=new THREE.Vector3(s.x??0,s.y??0,s.z??0);const distance=model.group.position.distanceTo(target);if(!model.posedOnce||distance>6)model.group.position.copy(target);else model.group.position.lerp(target,.38);model.posedOnce=true;const angle=(s.yaw||0)-model.group.rotation.y;model.group.rotation.y+=Math.atan2(Math.sin(angle),Math.cos(angle))*.5;
      model.head.rotation.x=s.pitch||0;
      const swing=s.moving?Math.sin((s.walk||0))*(s.crouching?.22:s.sprinting?.63:.45):0;
      model.leftLeg.rotation.x=swing;model.rightLeg.rotation.x=-swing;
      model.leftArm.rotation.x=-swing;model.rightArm.rotation.x=swing;
      poseCrouch(model,!!s.crouching);
      model.leftArm.rotation.z=THREE.MathUtils.lerp(model.leftArm.rotation.z,s.sprinting?-.14:0,.2);
      model.rightArm.rotation.z=THREE.MathUtils.lerp(model.rightArm.rotation.z,s.sprinting?.14:0,.2);
    }
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
        if(oxygen<=0){drownTimer+=Math.max(0,dt-previousAir);while(drownTimer>=1){drownTimer-=1;damagePlayer(2,true,'drown');}}
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

    // v14 recipe engine: inventory 2x2 and workbench 3x3 are separate.
    // Recipe book lists all supported FeatherMC crafting outputs. Vanilla includes
    // many additional items that cannot be represented by this prototype yet.
    const bookVisible={inventory:false,table:false};
    const craftDrag={active:false,visited:new Set()};
    function maxStack(id){return /(?:pickaxe|sword|axe|shovel|hoe|helmet|chestplate|leggings|boots|bow|shield|flint_and_steel|bed$)/.test(id)?1:64;}
    function countItem(id){return inventory.reduce((n,s)=>n+(s?.id===id?s.count:0),0);}
    function addItem(id,n=1){if(!items[id]||n<=0)return;const max=maxStack(id);for(const s of inventory){if(s&&s.id===id&&s.count<max){const a=Math.min(max-s.count,n);s.count+=a;n-=a;if(!n)break;}}for(let i=0;i<inventory.length&&n>0;i++)if(!inventory[i]){const a=Math.min(max,n);inventory[i]={id,count:a};n-=a;}updateHotbar();if(inventoryOpen&&invOverlay.style.display==='flex')renderInventory();}
    const craftingPatterns=[];
    function recipe(id,count,lines){if(!items[id])return;const rows=lines.map(s=>s.trim().split(/\s+/)),w=Math.max(...rows.map(x=>x.length)),h=rows.length;craftingPatterns.push({id,count,lines,rows,width:w,height:h,name:items[id][0]});}
    recipe('oak_planks',4,['oak_log']);
    recipe('stick',4,['oak_planks','oak_planks']);
    recipe('crafting_table',1,['oak_planks oak_planks','oak_planks oak_planks']);
    recipe('torch',4,['coal','stick']);
    recipe('oak_button',1,['oak_planks']);
    recipe('oak_pressure_plate',1,['oak_planks oak_planks']);
    recipe('oak_slab',6,['oak_planks oak_planks oak_planks']);
    recipe('oak_stairs',4,['oak_planks _ _','oak_planks oak_planks _','oak_planks oak_planks oak_planks']);
    recipe('ladder',3,['stick _ stick','stick stick stick','stick _ stick']);
    recipe('oak_fence',3,['oak_planks stick oak_planks','oak_planks stick oak_planks']);
    recipe('oak_door',3,['oak_planks oak_planks','oak_planks oak_planks','oak_planks oak_planks']);
    recipe('chest',1,['oak_planks oak_planks oak_planks','oak_planks _ oak_planks','oak_planks oak_planks oak_planks']);
    recipe('golden_apple',1,['gold_ingot gold_ingot gold_ingot','gold_ingot apple gold_ingot','gold_ingot gold_ingot gold_ingot']);
    recipe('furnace',1,['cobblestone cobblestone cobblestone','cobblestone _ cobblestone','cobblestone cobblestone cobblestone']);
    recipe('furnace',1,['stone stone stone','stone _ stone','stone stone stone']); // v13 compatibility
    recipe('bucket',1,['iron_ingot _ iron_ingot','_ iron_ingot _']);
    recipe('red_bed',1,['white_wool white_wool white_wool','oak_planks oak_planks oak_planks']);
    recipe('tnt',1,['gunpowder sand gunpowder','sand gunpowder sand','gunpowder sand gunpowder']);
    recipe('flint_and_steel',1,['iron_ingot _','_ flint']);
    recipe('shield',1,['oak_planks iron_ingot oak_planks','oak_planks oak_planks oak_planks','_ oak_planks _']);
    recipe('bow',1,['_ stick string','stick _ string','_ stick string']);
    recipe('arrow',4,['flint','stick','feather']);
    recipe('iron_block',1,['iron_ingot iron_ingot iron_ingot','iron_ingot iron_ingot iron_ingot','iron_ingot iron_ingot iron_ingot']);
    recipe('diamond_block',1,['diamond diamond diamond','diamond diamond diamond','diamond diamond diamond']);
    recipe('coal_block',1,['coal coal coal','coal coal coal','coal coal coal']);
    recipe('iron_ingot',9,['iron_block']);
    recipe('diamond',9,['diamond_block']);
    recipe('coal',9,['coal_block']);
    for(const [material,prefix] of [['oak_planks','wooden'],['cobblestone','stone'],['iron_ingot','iron'],['diamond','diamond']]){
      recipe(`${prefix}_pickaxe`,1,[`${material} ${material} ${material}`,'_ stick _','_ stick _']);
      recipe(`${prefix}_axe`,1,[`${material} ${material} _`,`${material} stick _`,'_ stick _']);
      if(items[`${prefix}_sword`])recipe(`${prefix}_sword`,1,[material,material,'stick']);
      if(prefix==='iron'||prefix==='diamond'){
        recipe(`${prefix}_helmet`,1,[`${material} ${material} ${material}`,`${material} _ ${material}`]);
        recipe(`${prefix}_chestplate`,1,[`${material} _ ${material}`,`${material} ${material} ${material}`,`${material} ${material} ${material}`]);
        recipe(`${prefix}_leggings`,1,[`${material} ${material} ${material}`,`${material} _ ${material}`,`${material} _ ${material}`]);
        recipe(`${prefix}_boots`,1,[`${material} _ ${material}`,`${material} _ ${material}`]);
      }
    }
    // Alternate recipes using existing stone acquired in older worlds.
    recipe('stone_pickaxe',1,['stone stone stone','_ stick _','_ stick _']);
    recipe('stone_axe',1,['stone stone _','stone stick _','_ stick _']);
    recipe('stone_sword',1,['stone','stone','stick']);
    recipe('leather_helmet',1,['leather leather leather','leather _ leather']);
    recipe('leather_chestplate',1,['leather _ leather','leather leather leather','leather leather leather']);
    recipe('leather_leggings',1,['leather leather leather','leather _ leather','leather _ leather']);
    recipe('leather_boots',1,['leather _ leather','leather _ leather']);
    function patternShape(lines){const rows=lines.map(x=>x.trim().split(/\s+/)),side=Math.max(rows.length,...rows.map(r=>r.length)),cells=Array(side*side).fill(null);for(let y=0;y<rows.length;y++)for(let x=0;x<rows[y].length;x++)if(rows[y][x]!=='_')cells[y*side+x]=rows[y][x];return craftShape(cells,side);}
    function craftShape(cells,side){let x0=side,y0=side,x1=-1,y1=-1;for(let i=0;i<side*side;i++)if(cells[i]){const x=i%side,y=Math.floor(i/side);x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}if(x1<0)return '';const rows=[];for(let y=y0;y<=y1;y++){const row=[];for(let x=x0;x<=x1;x++)row.push(cells[y*side+x]||'_');rows.push(row.join(' '));}return rows.join('|');}
    function availableRecipes(){return craftingPatterns.filter(r=>r.width<=craftingSize&&r.height<=craftingSize);}
    function matchRecipe(){const shape=craftShape(craftingGrid.slice(0,craftingSize**2).map(s=>s?.id||null),craftingSize);return shape?availableRecipes().find(r=>patternShape(r.lines)===shape)||null:null;}
    function ingredientCounts(r){const req={};for(const row of r.rows)for(const id of row)if(id!=='_')req[id]=(req[id]||0)+1;return req;}
    function ownedCounts(includeGrid=true){const counts={};for(const s of inventory)if(s)counts[s.id]=(counts[s.id]||0)+s.count;if(includeGrid)for(const s of craftingGrid)if(s)counts[s.id]=(counts[s.id]||0)+s.count;return counts;}
    function howManyCrafts(r){const stock=ownedCounts();return Math.max(0,Math.min(64,...Object.entries(ingredientCounts(r)).map(([id,n])=>Math.floor((stock[id]||0)/n))));}
    function consumeGrid(){if(!matchRecipe())return false;for(let i=0;i<craftingSize**2;i++){const s=craftingGrid[i];if(s){s.count--;if(s.count<=0)craftingGrid[i]=null;}}return true;}
    function canAcceptInventory(id,count){let room=0;for(const s of inventory)room+=!s?maxStack(id):(s.id===id?Math.max(0,maxStack(id)-s.count):0);return room>=count;}
    const invOverlay=document.createElement('div');invOverlay.className='fm-overlay';ROOT.appendChild(invOverlay);
    invOverlay.addEventListener('contextmenu',e=>e.preventDefault());
    function putCursorBack(){if(!cursorStack)return;const stack=cursorStack;cursorStack=null;putBackStack(stack);updateCursorGhost();}
    function putBackStack(stack){if(!stack)return;let left=stack.count;for(const s of inventory){if(s&&s.id===stack.id&&s.count<maxStack(stack.id)){const n=Math.min(maxStack(stack.id)-s.count,left);s.count+=n;left-=n;}}for(let i=0;i<36&&left>0;i++)if(!inventory[i]){const n=Math.min(maxStack(stack.id),left);inventory[i]={id:stack.id,count:n};left-=n;}if(left>0)spawnDroppedItem(stack.id,left,player.position.x,player.position.y,player.position.z);}
    function moveStack(get,set,e){e.preventDefault();const right=e.button===2||(e.button===0&&e.ctrlKey);const target=get();if(!cursorStack){if(!target)return;if(right){const n=Math.ceil(target.count/2);cursorStack={id:target.id,count:n};target.count-=n;if(target.count<=0)set(null);}else{cursorStack=target;set(null);}}else if(!target){if(right){set({id:cursorStack.id,count:1});cursorStack.count--;if(cursorStack.count<=0)cursorStack=null;}else{set(cursorStack);cursorStack=null;}}else if(target.id===cursorStack.id){const n=Math.min(maxStack(target.id)-target.count,right?1:cursorStack.count);if(n>0){target.count+=n;cursorStack.count-=n;if(cursorStack.count<=0)cursorStack=null;}}else if(!right){set(cursorStack);cursorStack=target;}updateHotbar();updateCursorGhost();renderInventory();}
    function paintOneCraftCell(i){if(!cursorStack||i<0||i>=craftingSize**2)return;const s=craftingGrid[i];if(s&&(s.id!==cursorStack.id||s.count>=maxStack(s.id)))return;if(!s)craftingGrid[i]={id:cursorStack.id,count:1};else s.count++;cursorStack.count--;if(cursorStack.count<=0)cursorStack=null;updateCursorGhost();renderInventory();}
    function handleDragOver(e){if(!craftDrag.active||!cursorStack||!(e.buttons&2)&&!(e.ctrlKey&&(e.buttons&1)))return;const cell=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-craft-index]');if(!cell||!invOverlay.contains(cell))return;const i=Number(cell.dataset.craftIndex);if(craftDrag.visited.has(i))return;craftDrag.visited.add(i);paintOneCraftCell(i);}
    // Listen at window level. renderInventory replaces the clicked buttons on every change.
    // A drag that began in the inventory must survive those replacements.
    window.addEventListener('pointermove',handleDragOver,{capture:true});
    window.addEventListener('mousemove',handleDragOver,{capture:true});
    invOverlay.addEventListener('pointerover',handleDragOver);
    window.addEventListener('pointerup',()=>{craftDrag.active=false;craftDrag.visited.clear();});
    function showItemCell(slot,cell){if(!slot)return;cell.appendChild(drawIcon(slot.id));wireItemHover(cell,slot.id);const amount=document.createElement('span');amount.className='fm-item-count';amount.textContent=slot.count>1?String(slot.count):'';cell.appendChild(amount);cell.title=items[slot.id]?.[0]||slot.id;}
    function playerPaperDoll(){const s=avatarAppearance||avatars.Steve;const armourColor=key=>armour[key]?.id?.startsWith('diamond')?'#4acfc8':armour[key]?.id?.startsWith('iron')?'#cbd4db':armour[key]?.id?.startsWith('leather')?'#986544':null;const parts=[['head','head',hexColour(s.skin)],['chest','body',hexColour(s.shirt)],['legs','leftleg',hexColour(s.pants)],['legs','rightleg',hexColour(s.pants)],['chest','leftarm',hexColour(s.shirt)],['chest','rightarm',hexColour(s.shirt)]];return `<div class="fm-paper-doll" aria-label="Player preview with equipped armour">${parts.map(([arm,part,color])=>`<div class="fm-doll-${part}" style="background:${armourColor(arm)||color};border-color:#31312c" title="${armour[arm]?.id||'No '+arm+' armour'}"></div>`).join('')}<span class="fm-doll-name">${escapeHTML(playerName)}</span></div>`;}
    function returnGridToInventory(){for(let i=0;i<craftingGrid.length;i++)if(craftingGrid[i]){putBackStack(craftingGrid[i]);craftingGrid[i]=null;}}
    function fillRecipe(r){if(!r||howManyCrafts(r)<1){showToast('Recipe unavailable','Collect the ingredients first.');return;}returnGridToInventory();const need=ingredientCounts(r);if(Object.entries(need).some(([id,n])=>countItem(id)<n)){showToast('Missing materials','Your inventory changed.');renderInventory();return;}for(let y=0;y<r.height;y++)for(let x=0;x<r.width;x++){const id=r.rows[y][x];if(!id||id==='_')continue;for(let i=0;i<inventory.length;i++){if(inventory[i]?.id!==id)continue;inventory[i].count--;if(!inventory[i].count)inventory[i]=null;craftingGrid[y*craftingSize+x]={id,count:1};break;}}updateHotbar();renderInventory();}
    function takeCraftedOutput(toInventory=false,repeat=false){let made=0;for(let i=0;i<(repeat?64:1);i++){const r=matchRecipe();if(!r)break;if(toInventory&&!canAcceptInventory(r.id,r.count))break;if(!toInventory&&cursorStack&&(cursorStack.id!==r.id||cursorStack.count+r.count>maxStack(r.id)))break;if(!consumeGrid())break;if(toInventory)addItem(r.id,r.count);else if(cursorStack)cursorStack.count+=r.count;else cursorStack={id:r.id,count:r.count};if(r.id==='crafting_table')unlock('table');made++;}if(made){updateHotbar();updateCursorGhost();renderInventory();}else if(toInventory)showToast('Cannot craft','Check your ingredients and inventory space.');}
    function renderInventory(){
      const table=openWorkbench;craftingSize=table?3:2;const bookKey=table?'table':'inventory',open=bookVisible[bookKey];
      invOverlay.innerHTML=`<div class="fm-inventory fm-crafting-window"><div class="fm-craft-head"><b style="font-size:21px">${table?'Crafting Table':'Inventory'}</b><button id="fm-close" aria-label="Close inventory">✕</button></div><div class="fm-craft-layout"><aside class="fm-recipe-panel" id="fm-book-list" style="display:${open?'flex':'none'}"><b>Recipe Book · ${table?'3×3':'2×2'}</b><input id="fm-book-search" placeholder="Search recipes" autocomplete="off"><div class="fm-recipes" id="fm-recipes"></div></aside><section class="fm-player-panel"><div class="fm-craft-upper"><div class="fm-equipment-panel">${playerPaperDoll()}<div id="fm-equipment" class="fm-armour-slots"></div></div><div class="fm-crafting-panel"><div class="fm-craft-title"><b>${table?'3×3 Workbench':'2×2 Crafting'}</b><button id="fm-book" class="fm-book-toggle ${open?'active':''}" aria-label="Toggle recipe book" title="Recipe Book">📖</button></div><div class="fm-craft-row"><div class="fm-craft-grid" id="fm-craft"></div><b class="fm-arrow">➜</b><button class="fm-craft-output" id="fm-output" title="Take crafted result"></button></div><div id="fm-recipe-name" class="fm-small"></div><button id="fm-craft-button" class="fm-button fm-mini-craft">Craft to Inventory</button></div></div><b class="fm-section-title">Inventory</b><div class="fm-inv-grid" id="fm-main"></div><b class="fm-section-title">Hotbar</b><div class="fm-inv-grid" id="fm-hot"></div><div class="fm-inv-help">Right-click: split stack/place one. Hold right-click and drag across crafting slots.</div></section></div></div>`;
      const equipSlots=[['head','Helmet'],['chest','Chestplate'],['legs','Leggings'],['feet','Boots'],['offhand','Offhand']];
      const eq=invOverlay.querySelector('#fm-equipment');for(const [key,label] of equipSlots){const get=()=>key==='offhand'?offhand:armour[key],set=v=>{if(key==='offhand')offhand=v;else armour[key]=v;},slot=get(),b=document.createElement('button');b.className='fm-inv-slot';b.title=label;showItemCell(slot,b);b.onpointerdown=e=>{e.preventDefault();if(cursorStack){const good=key==='offhand'||(key==='head'&&cursorStack.id.endsWith('_helmet'))||(key==='chest'&&cursorStack.id.endsWith('_chestplate'))||(key==='legs'&&cursorStack.id.endsWith('_leggings'))||(key==='feet'&&cursorStack.id.endsWith('_boots'));if(!good)return showToast('Wrong equipment slot','Select the matching armour piece.');const old=get();set(cursorStack);cursorStack=old;}else if(get()){cursorStack=get();set(null);}updateCursorGhost();renderInventory();};eq.appendChild(b);}
      const invCell=i=>{const b=document.createElement('button');b.className='fm-inv-slot';showItemCell(inventory[i],b);if(i===selectedSlot)b.classList.add('selected');b.onpointerdown=e=>{if(e.button===2||(e.ctrlKey&&e.button===0)){
        craftDrag.active=true;craftDrag.visited.clear();
      }if(e.button<=2)moveStack(()=>inventory[i],v=>inventory[i]=v,e);};return b;};
      for(let i=9;i<36;i++)invOverlay.querySelector('#fm-main').appendChild(invCell(i));for(let i=0;i<9;i++)invOverlay.querySelector('#fm-hot').appendChild(invCell(i));
      const grid=invOverlay.querySelector('#fm-craft');grid.style.gridTemplateColumns=`repeat(${craftingSize},40px)`;
      for(let i=0;i<craftingSize**2;i++){const b=document.createElement('button');b.className='fm-craft-cell';b.dataset.craftIndex=String(i);showItemCell(craftingGrid[i],b);b.onpointerdown=e=>{
        if(e.button===2||(e.ctrlKey&&e.button===0)){
          craftDrag.active=true;craftDrag.visited.clear();craftDrag.visited.add(i);
        }
        if(e.button<=2)moveStack(()=>craftingGrid[i],v=>craftingGrid[i]=v,e);
      };grid.appendChild(b);}
      const r=matchRecipe(),output=invOverlay.querySelector('#fm-output');showItemCell(r?{id:r.id,count:r.count}:null,output);output.disabled=!r;output.onclick=e=>takeCraftedOutput(!!e.shiftKey,!!e.shiftKey);output.oncontextmenu=e=>{e.preventDefault();takeCraftedOutput(false,false);};invOverlay.querySelector('#fm-recipe-name').textContent=r?.name||'Place materials in the grid';
      const craftBtn=invOverlay.querySelector('#fm-craft-button');craftBtn.disabled=!r;craftBtn.onclick=()=>takeCraftedOutput(true,false);
      invOverlay.querySelector('#fm-close').onclick=closeInventory;
      invOverlay.querySelector('#fm-book').onclick=()=>{bookVisible[bookKey]=!bookVisible[bookKey];renderInventory();};
      const recipeHost=invOverlay.querySelector('#fm-recipes'),search=invOverlay.querySelector('#fm-book-search');
      function renderBook(q=''){recipeHost.replaceChildren();const recipes=availableRecipes().filter(r=>r.name.toLowerCase().includes(q.toLowerCase())||r.id.includes(q.toLowerCase()));const seen=new Set();for(const item of recipes){const uniq=item.id+'-'+patternShape(item.lines);if(seen.has(uniq))continue;seen.add(uniq);const can=howManyCrafts(item),needs=Object.entries(ingredientCounts(item)).map(([id,n])=>`${n} ${items[id]?.[0]||id}`).join(' · ');const row=document.createElement('button');row.className='fm-recipe-entry'+(can?' can-craft':'');const ico=drawIcon(item.id);row.appendChild(ico);const details=document.createElement('div');details.style.minWidth='0';const title=document.createElement('b');title.textContent=`${item.name}${can?' ×'+can:''}`;const sub=document.createElement('small');sub.textContent=needs;details.append(title,sub);row.appendChild(details);row.title=can?'Click to fill your crafting grid':`Missing: ${needs}`;row.onclick=()=>fillRecipe(item);recipeHost.appendChild(row);}if(!recipeHost.children.length)recipeHost.textContent='No matching recipes.';}
      if(open){renderBook();search.oninput=()=>renderBook(search.value);}
      updateCursorGhost();
    }
    function relockGameMouse(){if(running&&!paused&&!chatOpen){try{const result=renderer.domElement.requestPointerLock();if(result?.catch)result.catch(()=>showLockHint());}catch(e){}}}
    function openInventory(asTable=false){if(!running||paused)return;openWorkbench=!!asTable;craftingSize=openWorkbench?3:2;inventoryOpen=true;held.left=false;held.right=false;document.exitPointerLock?.();renderInventory();invOverlay.style.display='flex';updateCursorGhost();}
    function closeInventory(){putCursorBack();returnGridToInventory();inventoryOpen=false;openWorkbench=false;craftDrag.active=false;craftDrag.visited.clear();invOverlay.style.display='none';itemTooltip.style.display='none';cursorGhost.style.display='none';updateHotbar();relockGameMouse();}
    const deathOverlay=document.createElement('div');deathOverlay.className='fm-deathscreen';ROOT.appendChild(deathOverlay);
    function showDeathScreen(cause,attacker){
      const text=deathLine(playerName,cause,attacker);
      held.left=false;held.right=false;inventoryOpen=false;openWorkbench=false;
      invOverlay.style.display='none';chestOverlay.style.display='none';furnaceOverlay.style.display='none';
      openChestKey=null;chatOpen=false;document.exitPointerLock?.();
      deathOverlay.innerHTML=`<h1>You Died!</h1><p id="fm-death-reason"></p><button class="fm-button" id="fm-respawn" type="button">Respawn</button>`;
      deathOverlay.querySelector('#fm-death-reason').textContent=text;
      deathOverlay.querySelector('#fm-respawn').onclick=finishRespawn;
      deathOverlay.style.display='flex';
    }
    function finishRespawn(){if(!deathPending)return;
      deathPending=false;deathOverlay.style.display='none';
      if(!isHost&&peer)sendHost({type:'respawnRequest'});
      const target=deathRespawnTarget||spawnPoint;deathRespawnTarget=null;
      player.position.set(target.x,target.y,target.z);velocityY=0;fallPeakY=target.y;
      oxygen=15;drownTimer=0;updateAirHud(false);hp=20;hunger=20;playerSleeping=false;sleepingPlayers.delete(playerId);
      updateChunks(true);updateHotbar();updateHealth(true);updateHunger();relockGameMouse();
    }
    const chestOverlay=document.createElement('div');chestOverlay.className='fm-overlay';ROOT.appendChild(chestOverlay);
    function syncChest(key){if(!hasAuthority())return;
      const version=(chestVersions.get(key)||0)+1;chestVersions.set(key,version);
      if(isHost)broadcast({type:'chestData',key,items:chestInventories.get(key)||Array(27).fill(null),version});
    }
    function closeChest(){if(chestPending)return showToast('Chest','Please finish your pending transfer.');putCursorBack();inventoryOpen=false;setChestLid(openChestKey,false);openChestKey=null;chestPending=null;chestOverlay.style.display='none';updateHotbar();relockGameMouse();}
    function openChest(key,request=true){
      if(!running||deathPending)return;
      if(openChestKey&&openChestKey!==key)setChestLid(openChestKey,false);
      const firstOpen=openChestKey!==key;openChestKey=key;let data=chestInventories.get(key);
      if(!data){data=Array(27).fill(null);chestInventories.set(key,data);}
      if(firstOpen&&request&&!hasAuthority())sendHost({type:'chestRequest',key});
      inventoryOpen=true;held.left=false;held.right=false;document.exitPointerLock?.();setChestLid(key,true);
      chestOverlay.innerHTML=`<div class="fm-inventory fm-chest-ui"><div style="display:flex;justify-content:space-between;align-items:center"><b style="font-size:20px">Chest</b><button id="fm-chest-close" class="fm-chest-close">✕</button></div><div class="fm-inv-grid" id="fm-chest-grid" style="margin:12px 0"></div><b>Inventory</b><div class="fm-inv-grid" id="fm-chest-player" style="margin-top:8px"></div></div>`;
      const cg=chestOverlay.querySelector('#fm-chest-grid'),pg=chestOverlay.querySelector('#fm-chest-player');
      function cell(list,i,isChest){const b=document.createElement('button');b.className='fm-inv-slot';const stack=list[i];showItemCell(stack,b);
        b.oncontextmenu=e=>e.preventDefault();b.onpointerdown=e=>{if(e.button!==0&&e.button!==2)return;e.preventDefault();if(chestPending)return;
          if(isChest){if(hasAuthority()){
              const result=chestInteraction(data[i],cursorStack,e.button===2||e.ctrlKey);
              if(!result.changed)return;data[i]=result.slot;cursorStack=result.cursor;syncChest(key);updateHotbar();openChest(key,false);
            }else{
              const tx=++chestActionSeq,version=chestVersions.get(key)||0;
              chestPending={tx,key,at:performance.now()};
              if(!sendHost({type:'chestAction',key,index:i,version,tx,right:e.button===2||e.ctrlKey,cursor:cloneStack(cursorStack)})){chestPending=null;showToast('Chest','Connection unavailable.');}
              else openChest(key,false);
            }
          }else{moveStack(()=>inventory[i],v=>inventory[i]=v,e);openChest(key,false);}
        };return b;}
      for(let i=0;i<27;i++)cg.appendChild(cell(data,i,true));for(let i=0;i<36;i++)pg.appendChild(cell(inventory,i,false));
      const close=chestOverlay.querySelector('#fm-chest-close');close.onclick=closeChest;
      chestOverlay.style.display='flex';updateCursorGhost();
    }
    function renderChest(key){openChest(key,false);}
    const furnaceOverlay=document.createElement('div');furnaceOverlay.className='fm-overlay';ROOT.appendChild(furnaceOverlay);
    function consumeInventoryItem(id,count=1){if(countItem(id)<count)return false;let left=count;for(let i=0;i<inventory.length;i++){const slot=inventory[i];if(!slot||slot.id!==id)continue;const n=Math.min(left,slot.count);slot.count-=n;left-=n;if(slot.count<=0)inventory[i]=null;if(!left)break;}updateHotbar();return true;}
    function openFurnace(key){inventoryOpen=true;document.exitPointerLock?.();furnaceOverlay.innerHTML=`<div class="fm-inventory"><div style="display:flex;justify-content:space-between;align-items:center"><b>Furnace</b><button id="fm-furnace-close">✕</button></div><div style="margin:15px 0;line-height:1.7">Fuel: <b id="fm-fuel-count">${countItem('coal')} Coal</b><br>Raw iron: <b>${countItem('raw_iron')}</b><br>Raw porkchop: <b>${countItem('raw_porkchop')}</b></div><button class="fm-button" id="fm-smelt-iron">Smelt 1 Iron Ingot</button><button class="fm-button" id="fm-cook-pork">Cook 1 Porkchop</button><button class="fm-button" id="fm-smelt-glass">Smelt Sand into Glass</button><button class="fm-button" id="fm-cook-beef">Cook Beef</button><button class="fm-button" id="fm-cook-chicken">Cook Chicken</button><div class="fm-small" style="color:#333">Each operation uses one coal. Processing is instant in this prototype.</div></div>`;furnaceOverlay.querySelector('#fm-smelt-iron').onclick=()=>{if(countItem('coal')<1||countItem('raw_iron')<1){showToast('Missing ingredients','You need one coal and raw iron.');return;}consumeInventoryItem('coal');consumeInventoryItem('raw_iron');addItem('iron_ingot',1);openFurnace(key);};furnaceOverlay.querySelector('#fm-cook-pork').onclick=()=>{if(countItem('coal')<1||countItem('raw_porkchop')<1){showToast('Missing ingredients','You need one coal and a raw porkchop.');return;}consumeInventoryItem('coal');consumeInventoryItem('raw_porkchop');addItem('cooked_porkchop',1);openFurnace(key);};for(const [id,input,output] of [['fm-smelt-glass','sand','glass'],['fm-cook-beef','raw_beef','cooked_beef'],['fm-cook-chicken','raw_chicken','cooked_chicken']])furnaceOverlay.querySelector('#'+id).onclick=()=>{if(countItem('coal')<1||countItem(input)<1){showToast('Missing ingredients','Requires one coal and '+(items[input]?.[0]||input));return;}consumeInventoryItem('coal');consumeInventoryItem(input);addItem(output,1);openFurnace(key);};furnaceOverlay.querySelector('#fm-furnace-close').onclick=()=>{inventoryOpen=false;furnaceOverlay.style.display='none';updateHotbar();};furnaceOverlay.style.display='flex';}


    // Crack textures and outline
    const crackTextures=[];for(let stage=0;stage<10;stage++){const c=document.createElement('canvas');c.width=64;c.height=64;const ctx=c.getContext('2d');if(stage){ctx.strokeStyle='rgba(15,15,15,.9)';ctx.lineWidth=2;for(let i=0;i<stage+2;i++){const x=8+(i*19+stage*7)%48,y=7+(i*31+stage*11)%48;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+(i%2?12:-13),y+((i%3)-1)*12);ctx.lineTo(x+(i%2?17:-19),y+((i%3)-1)*20);ctx.stroke();}ctx.fillStyle='rgba(0,0,0,.12)';ctx.fillRect(0,0,64,64);}const tex=new THREE.CanvasTexture(c);tex.magFilter=THREE.NearestFilter;tex.minFilter=THREE.NearestFilter;crackTextures.push(tex);}
    const crackMats=crackTextures.map(t=>new THREE.MeshBasicMaterial({map:t,transparent:true,depthWrite:false}));const crackMesh=new THREE.Mesh(new THREE.BoxGeometry(1.006,1.006,1.006),crackMats[0]);crackMesh.visible=false;crackMesh.renderOrder=4;scene.add(crackMesh);
    const outline=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.012,1.012,1.012)),new THREE.LineBasicMaterial({color:0x111111}));outline.visible=false;outline.renderOrder=5;scene.add(outline);

    // Mobs
    // Small original procedural pixel surfaces. No external or copied game assets.
    const skinMaterials=new Map();
    function skin(kind,base,accent,frequency=0.18){
      if(skinMaterials.has(kind))return skinMaterials.get(kind).clone();
      const c=document.createElement('canvas');c.width=16;c.height=16;const ctx=c.getContext('2d');
      ctx.fillStyle=base;ctx.fillRect(0,0,16,16);
      let rng=hashSeed(kind);const rand=()=>{rng=(Math.imul(rng,1664525)+1013904223)|0;return(rng>>>0)/4294967296;};
      for(let y=0;y<16;y++)for(let x=0;x<16;x++)if(rand()<frequency){ctx.fillStyle=accent;ctx.fillRect(x,y,1+Math.floor(rand()*2),1+Math.floor(rand()*2));}
      const tex=new THREE.CanvasTexture(c);tex.magFilter=THREE.NearestFilter;tex.minFilter=THREE.NearestFilter;tex.colorSpace=THREE.SRGBColorSpace;
      const material=new THREE.MeshLambertMaterial({map:tex});skinMaterials.set(kind,material);return material.clone();
    }
    function makeCreeper(id,x,y,z){const g=new THREE.Group(),green=skin('creeper-plant','#5ca84b','#2a732c',.23),black=new THREE.MeshLambertMaterial({color:0x182b17});box(g,.68,1,.56,green,0,1.08,0);box(g,.76,.69,.66,green,0,1.85,0);box(g,.1,.17,.04,black,-.17,1.96,-.35);box(g,.1,.17,.04,black,.17,1.96,-.35);box(g,.21,.2,.05,black,0,1.74,-.35);for(const xx of [-.23,.23])for(const zz of [-.24,.24])box(g,.22,.45,.23,green,xx,.28,zz);g.position.set(x,y,z);scene.add(g);const m={id,group:g,hp:5,attackTimer:0,hitTimer:0,knockX:0,knockZ:0,creeper:true};for(const obj of g.children)obj.userData.mob=m;mobs.set(id,m);return m;}
    function makeZombie(id,x,y,z){const g=new THREE.Group(),green=skin('zombie-skin','#559457','#467b4b',.22),purple=skin('zombie-trousers','#424880','#303767',.15),dark=new THREE.MeshLambertMaterial({color:0x111111});box(g,.8,.95,.4,green,0,.95,0);box(g,.58,.58,.58,green,0,1.72,0);box(g,.13,.1,.05,dark,-.14,1.8,-.3);box(g,.13,.1,.05,dark,.14,1.8,-.3);box(g,.3,.9,.35,green,-.55,.95,0);box(g,.3,.9,.35,green,.55,.95,0);box(g,.3,.85,.35,purple,-.2,.42,0);box(g,.3,.85,.35,purple,.2,.42,0);g.position.set(x,y,z);scene.add(g);const m={id,group:g,hp:3,attackTimer:0,hitTimer:0,knockX:0,knockZ:0};for(const child of g.children)child.userData.mob=m;mobs.set(id,m);return m;}
    function removeMob(id){const m=mobs.get(id);if(m){scene.remove(m.group);const seen=new Set();m.group.traverse(o=>{if(!o.isMesh)return;o.geometry?.dispose();if(o.material&&!seen.has(o.material)){seen.add(o.material);o.material.dispose();}});mobs.delete(id);}}
    function mobSnapshot(){return[...mobs.values()].map(m=>({id:m.id,x:m.group.position.x,y:m.group.position.y,z:m.group.position.z,yaw:m.group.rotation.y,walking:!!m.walking,hp:m.hp,pig:!!m.pig,cow:!!m.cow,chicken:!!m.chicken,sheep:!!m.sheep,creeper:!!m.creeper}));}
    function syncMobs(list){const seen=new Set();for(const d of list){seen.add(d.id);let m=mobs.get(d.id);if(!m)m=d.creeper?makeCreeper(d.id,d.x,d.y,d.z):d.sheep?makeSheep(d.id,d.x,d.y,d.z):d.cow?makeCow(d.id,d.x,d.y,d.z):d.chicken?makeChicken(d.id,d.x,d.y,d.z):d.pig?makePig(d.id,d.x,d.y,d.z):makeZombie(d.id,d.x,d.y,d.z);m.group.position.set(d.x,d.y,d.z);m.group.rotation.y=d.yaw||0;m.walking=!!d.walking;m.hp=d.hp;}for(const id of [...mobs.keys()])if(!seen.has(id))removeMob(id);}
    function spawnMobs(){if(!mobsEnabled||difficulty==='Peaceful')return;for(let i=0;i<(isNight()?3:0);i++){const a=Math.random()*Math.PI*2,d=14+Math.random()*7,x=Math.floor(player.position.x+Math.cos(a)*d),z=Math.floor(player.position.z+Math.sin(a)*d);ensureChunkAt(x,z);(Math.random()<.24?makeCreeper:makeZombie)(`mob-${mobCounter++}`,x+.5,groundAt(x,z),z+.5);}for(const kind of ['pig','cow','chicken','sheep','pig','cow','chicken','sheep']){const a=Math.random()*Math.PI*2,d=8+Math.random()*13,x=Math.floor(player.position.x+Math.cos(a)*d),z=Math.floor(player.position.z+Math.sin(a)*d);ensureChunkAt(x,z);const id=`${kind}-${mobCounter++}`,y=groundAt(x,z);if(kind==='pig')makePig(id,x+.5,y,z+.5);else if(kind==='cow')makeCow(id,x+.5,y,z+.5);else if(kind==='sheep')makeSheep(id,x+.5,y,z+.5);else makeChicken(id,x+.5,y,z+.5);}}
    function tintObject(group,owner,on){
      if(!owner.originalMaterials)owner.originalMaterials=new Map();
      group.traverse(mesh=>{
        if(!mesh.isMesh)return;
        const mats=Array.isArray(mesh.material)?mesh.material:[mesh.material];
        for(const mat of mats){if(!mat?.color)continue;
          if(on){if(!owner.originalMaterials.has(mat))owner.originalMaterials.set(mat,mat.color.getHex());mat.color.setHex(0xef4545);}
          else if(owner.originalMaterials.has(mat))mat.color.setHex(owner.originalMaterials.get(mat));
        }
      });
      if(!on)owner.originalMaterials.clear();
    }
    function clearMobFlash(m){m.hitTimer=0;m.group.scale.set(1,1,1);tintObject(m.group,m,false);}
    function flashMob(m){m.hitTimer=.12;m.group.scale.set(1.035,.975,1.035);tintObject(m.group,m,true);}
    const serverAttackTimes=new Map();
    function allowAttack(actor){const now=performance.now(),previous=serverAttackTimes.get(actor)||0;if(now-previous<240)return false;serverAttackTimes.set(actor,now);return true;}
    function weaponDamage(id){return id==='diamond_sword'?7:id==='iron_sword'?6:id==='wooden_sword'?4:id?.endsWith('_axe')?3:id?.endsWith('_pickaxe')?2:1;}
    function attackDamage(actor,critical,claimedCharge=1){const r=remotePlayers.get(actor),item=actor===playerId?inventory[selectedSlot]?.id:r?.state?.selectedItem;
      const charge=THREE.MathUtils.clamp(actor===playerId?attackCharge:claimedCharge,0,1);
      const factor=1;
      return Math.max(.5,Math.round(weaponDamage(item)*(.2+.8*charge*charge)*(critical&&charge>=.848?1.5:1)*factor*2)/2);
    }
    function setAvatarTint(model,on){tintObject(model.group,model,on);}

    function makeSheep(id,x,y,z){const g=new THREE.Group(),wool=skin('sheep-wool','#e9e7e1','#c5c3bc',.26),gray=new THREE.MeshLambertMaterial({color:0x9e9d9b}),dark=new THREE.MeshLambertMaterial({color:0x333333});box(g,1.04,.82,.70,wool,0,.86,0);box(g,.53,.53,.52,gray,0,1.44,-.36);for(const xx of [-.33,.33])for(const zz of [-.25,.22])box(g,.15,.49,.15,gray,xx,.28,zz);for(const xx of [-.17,.17])box(g,.08,.08,.04,dark,xx,1.51,-.63);g.position.set(x,y,z);scene.add(g);const m={id,group:g,hp:4,attackTimer:0,hitTimer:0,knockX:0,knockZ:0,sheep:true};for(const obj of g.children)obj.userData.mob=m;mobs.set(id,m);return m;}
    function makePig(id,x,y,z){const g=new THREE.Group(),pink=skin('pig-skin','#e6a4a5','#d38b8e',.16),dark=new THREE.MeshLambertMaterial({color:0x553b3b});box(g,.95,.7,.65,pink,0,.8,0);box(g,.62,.5,.62,pink,0,1.32,-.12);box(g,.32,.22,.08,dark,0,1.23,-.44);for(const xx of [-.3,.3])for(const zz of [-.2,.2])box(g,.17,.42,.17,dark,xx,.25,zz);g.position.set(x,y,z);scene.add(g);const m={id,group:g,hp:4,attackTimer:0,hitTimer:0,knockX:0,knockZ:0,pig:true};for(const child of g.children)child.userData.mob=m;mobs.set(id,m);return m;}
    function makeCow(id,x,y,z){const g=new THREE.Group(),white=skin('cow-hide','#e8e2d5','#b6a48c',.13),brown=skin('cow-brown','#765039','#5c362b',.25),dark=new THREE.MeshLambertMaterial({color:0x28221d});box(g,1.05,.85,.72,white,0,.92,0);box(g,.68,.68,.65,white,0,1.55,-.35);box(g,.34,.26,.12,dark,0,1.36,-.69);for(const xx of [-.22,.22]){box(g,.12,.22,.16,brown,xx,1.9,-.32);box(g,.12,.12,.18,brown,xx,1.2,.02);}for(const xx of [-.34,.34])for(const zz of [-.23,.23])box(g,.18,.48,.18,dark,xx,.28,zz);g.position.set(x,y,z);scene.add(g);const m={id,group:g,hp:5,attackTimer:0,hitTimer:0,knockX:0,knockZ:0,cow:true};for(const child of g.children)child.userData.mob=m;mobs.set(id,m);return m;}
    function makeChicken(id,x,y,z){const g=new THREE.Group(),white=skin('chicken-feathers','#f1eee5','#dad8cb',.2),yellow=new THREE.MeshLambertMaterial({color:0xe8c34b}),red=new THREE.MeshLambertMaterial({color:0xc83b35}),dark=new THREE.MeshLambertMaterial({color:0x292929});box(g,.58,.55,.55,white,0,.65,0);box(g,.38,.38,.38,white,0,1.05,-.2);box(g,.22,.16,.2,yellow,0,.99,-.48);box(g,.16,.15,.12,red,0,.81,-.43);for(const xx of [-.15,.15]){box(g,.07,.07,.04,dark,xx,1.1,-.4);box(g,.09,.3,.09,yellow,xx,.22,0);}box(g,.3,.22,.18,white,0,.77,.29);g.position.set(x,y,z);scene.add(g);const m={id,group:g,hp:2,attackTimer:0,hitTimer:0,knockX:0,knockZ:0,chicken:true};for(const child of g.children)child.userData.mob=m;mobs.set(id,m);return m;}


    // v14 sleep cycle: real time-of-day already advances in the main loop.
    const isNight=()=>worldTime>=.72||worldTime<.23;
    function tryUseBed(t){if(!t||world.get(k3(t.x,t.y,t.z))!=='red_bed')return;
      if(!isNight()){showToast('Bed','You can only sleep at night.');return;}
      if(playerSleeping)return;
      if(hasAuthority())setPlayerSleeping(playerId,true);else if(sendHost({type:'sleep',x:t.x,y:t.y,z:t.z})){playerSleeping=true;showToast('Sleeping','Waiting for at least half the players...');}
    }
    function setPlayerSleeping(actor,sleep){if(!hasAuthority()||!isNight())return false;
      if(sleep)sleepingPlayers.add(actor);else sleepingPlayers.delete(actor);
      const count=remotePlayers.size+1,required=Math.ceil(count*.5);
      const text=`Sleeping: ${sleepingPlayers.size}/${count} players · Need ${required}`;
      if(isHost)serverSay(text);else addChat('Server',text);
      if(sleepingPlayers.size>=required){worldTime=.27;weather='Clear';sleepingPlayers.clear();playerSleeping=false;
        if(isHost)broadcast({type:'sleepDone',worldTime,weather});
        if(isHost)serverSay('The night has passed.');else addChat('Server','The night has passed.');return true;
      }return false;
    }
    // TNT uses only virtual voxel effects.
    function addPrimedTnt(id,x,y,z,fuse=4){if(primedTnt.has(id))return;const mesh=new THREE.Mesh(new THREE.BoxGeometry(.89,.89,.89),new THREE.MeshLambertMaterial({map:textureFor('tnt')}));mesh.position.set(x+.5,y+.6,z+.5);scene.add(mesh);primedTnt.set(id,{id,x,y,z,fuse,mesh});}
    function primeTNT(x,y,z,fuse=4){if(!hasAuthority()||world.get(k3(x,y,z))!=='tnt')return false;if(!changeBlock(x,y,z,null))return false;flushNearbyMesh(x,z);const id=`tnt-${++activeTntId}-${Math.floor(performance.now())}`;addPrimedTnt(id,x,y,z,fuse);if(isHost)broadcast({type:'block',x,y,z,block:null,actor:'tnt'});if(isHost)broadcast({type:'tntPrime',id,x,y,z,fuse});return true;}
    function removePrimedTnt(id){const t=primedTnt.get(id);if(!t)return;scene.remove(t.mesh);t.mesh.geometry.dispose();t.mesh.material.dispose();primedTnt.delete(id);}
    function detonateTNT(t){if(!hasAuthority())return;const changes=[],radius=3.2;for(let dx=-3;dx<=3;dx++)for(let dy=-3;dy<=3;dy++)for(let dz=-3;dz<=3;dz++){
      if(dx*dx+dy*dy+dz*dz>radius*radius)continue;
      const x=t.x+dx,y=t.y+dy,z=t.z+dz,type=world.get(k3(x,y,z));if(!type||type==='bedrock'||type==='water'||type==='lava')continue;
      if(type==='tnt'){primeTNT(x,y,z,.6+Math.random()*.8);continue;}
      if(changeBlock(x,y,z,null))changes.push({x,y,z,block:null});
    }
      removePrimedTnt(t.id);if(isHost){broadcast({type:'tntGone',id:t.id});for(let i=0;i<changes.length;i+=70)broadcast({type:'blockBatch',changes:changes.slice(i,i+70)});}
      flushNearbyMesh(t.x,t.z);
      const blast=(target,actorId)=>{const distance=Math.hypot(target.x-(t.x+.5),target.y-(t.y+.5),target.z-(t.z+.5));if(distance>5)return;const amount=Math.max(0,Math.ceil((5-distance)*2));if(!amount)return;if(actorId===playerId)damagePlayer(amount,true,'explosion');else damageRemote(actorId,amount,{x:t.x,y:t.y,z:t.z},'explosion');};
      blast(player.position,playerId);for(const [id,r] of remotePlayers)blast(r.state,id);
    }
    function updateTntFuses(dt){for(const t of [...primedTnt.values()]){t.fuse-=dt;const flash=Math.floor(t.fuse*5)%2===0;t.mesh.material.color.setHex(flash?0xffa3a3:0xffffff);t.mesh.scale.setScalar(1+Math.sin(t.fuse*14)*.03);t.mesh.visible=nearEntity(t.x,t.z);if(t.fuse<=0&&hasAuthority())detonateTNT(t);else if(t.fuse<-.8)removePrimedTnt(t.id);}}
    // Networking helpers
    function sendHost(msg){if(hostConn?.open){try{hostConn.send(msg);return true;}catch(e){return false;}}return false;}
    function broadcast(msg,except=null){for(const [id,c] of connections)if(id!==except&&c.open){try{c.send(msg);}catch(e){}}}
    function disconnect(){if(!isHost&&hostConn?.open&&running){sendHost({type:'playerData',record:playerInventoryRecord()});}for(const c of connections.values()){try{c.close();}catch(e){}}connections.clear();try{hostConn?.close();}catch(e){}hostConn=null;try{peer?.destroy();}catch(e){}peer=null;isHost=false;roomCode='';networkHostId='';playerId='local';}
    const validName=s=>String(s||'Player').replace(/[<>]/g,'').trim().slice(0,18)||'Player';
    const validAvatar=s=>avatars[s]?s:'Steve';
    function playerState(){const selected=inventory[selectedSlot],inventoryCounts={};for(const slot of inventory)if(slot)inventoryCounts[slot.id]=(inventoryCounts[slot.id]||0)+slot.count;return{x:player.position.x,y:player.position.y,z:player.position.z,yaw,pitch,hp,gameMode,isFlying:isFlying&&gameMode==='Creative',inventoryCounts,inventoryEmpty:inventory.filter(s=>!s).length,inventoryFree:Object.fromEntries([...new Set(inventory.filter(Boolean).map(s=>s.id))].map(id=>[id,inventory.filter(s=>s?.id===id).reduce((n,s)=>n+Math.max(0,((id.includes('pickaxe')||id.includes('sword')||id.includes('axe')||id.includes('helmet')||id.includes('chestplate')||id.includes('leggings')||id.includes('boots'))?1:64)-s.count),0)])),armour:Object.fromEntries(Object.entries(armour).map(([k,v])=>[k,v?.id||null])),offhand:offhand?.id||null,moving:!!(keys[keybinds.forward]||keys[keybinds.back]||keys[keybinds.left]||keys[keybinds.right]),crouching:!!keys[keybinds.crouch],sprinting:!!keys[keybinds.sprint]&&hunger>6,entityDistance:maxEntityDistance(),walk:walking,selectedItem:selected?.id||null,selectedCount:selected?.count||0,selectedSlot};}
    function welcomePacket(){return{type:'welcome',hostId:playerId,seed,worldName,roomCode,difficulty,mobsEnabled,pvpEnabled,chatEnabled,keepInventory,weather,worldTime,dayLength,mods:[...mods],chests:[...chestInventories],players:[{id:playerId,name:playerName,avatar:avatarChoice,appearance:avatarAppearance,...playerState()},...[...remotePlayers.values()].map(r=>({id:r.id,name:r.model.name,avatar:r.model.preset,appearance:r.model.appearance,...r.state}))],mobs:mobSnapshot(),drops:dropSnapshot()};}
    function validReach(s,x,y,z){return [x,y,z].every(Number.isFinite)&&Math.hypot(s.x-(x+.5),s.z-(z+.5))<=7.5&&Math.abs((s.y||0)+1-(y+.5))<=8;}
    function overlaps(x,y,z,s){const height=s.crouching?1.5:1.8;return s.x+.3>x&&s.x-.3<x+1&&s.y+height>y&&s.y<y+1&&s.z+.3>z&&s.z-.3<z+1;}
    function addAchievement(id,name){const names={first_block:'Getting Started',wood:'Tree Hugger',table:'Benchmarking',first_mob:'Monster Hunter',miner:'Dedicated Miner'};addChat('Advancement',`${name} has made the advancement [${names[id]||id}]`);}
    function unlock(id){if(unlocked.has(id))return;unlocked.add(id);if(id==='first_block'||id==='wood'||id==='table'||id==='first_mob'||id==='miner')addAchievement(id,playerName);if(isHost)broadcast({type:'achievement',id,name:playerName});else if(peer)sendHost({type:'achievementRequest',id});}
    function mineAchievement(type,actor){if(actor!==playerId)return;minedCount++;if(minedCount===1)unlock('first_block');if(type==='oak_log')unlock('wood');if(minedCount>=25)unlock('miner');}
    function serverSay(text){addChat('Server',text);broadcast({type:'chat',name:'Server',text});}
    function runServerCommand(actor,raw){const text=String(raw||'').trim();const parts=text.split(/\s+/);const cmd=(parts.shift()||'').toLowerCase();const args=parts;const isLeader=actor===playerId;const allowed=isLeader||roleById.has(actor);const playerFor=id=>id===playerId?{name:playerName,state:{x:player.position.x,y:player.position.y,z:player.position.z}}:remotePlayers.get(id);
      const result=(msg)=>{if(actor===playerId)serverSay(msg);else connections.get(actor)?.send({type:'commandResult',text:msg});};
      if(cmd==='/help'){result('/creative [player], /uncreative [player], /difficulty <peaceful|easy|normal|hard>, /weather <clear|rain>, /time <day|night>, /give <item> [amount], /commander <add|remove> <name>, /pvp <on|off>, /mobs <on|off>');return;}
      if(cmd==='/kick'){if(!isLeader){result('Only the server leader can kick players.');return;}const name=args.join(' ').toLowerCase();for(const [id,c] of connections){const r=remotePlayers.get(id);if(r&&r.model.name.toLowerCase()===name){c.send({type:'kicked'});c.close();connections.delete(id);removeRemote(id);broadcast({type:'playerLeft',id});serverSay(`${r.model.name} was removed.`);return;}}result('Player not found.');return;}
      if(cmd==='/commander'){if(!isLeader){result('Only the server leader can manage Commanders.');return;}const action=(args.shift()||'').toLowerCase(),name=args.join(' ').toLowerCase();let found=null;for(const [id,r] of remotePlayers)if(r.model.name.toLowerCase()===name)found=id;if(action==='add'&&found){roleById.add(found);connections.get(found)?.send({type:'role',role:'Commander'});serverSay(`${remotePlayers.get(found).model.name} is now a Commander.`);}else if(action==='remove'&&found){roleById.delete(found);connections.get(found)?.send({type:'role',role:'Player'});serverSay(`${remotePlayers.get(found).model.name} is no longer a Commander.`);}else result('Usage: /commander add <name> or /commander remove <name>');return;}
      if(!allowed){result('You do not have permission to use that command.');return;}
      if(['/creative','/uncreative','/survival'].includes(cmd)){
        if(!isLeader){result('Only the world leader can use /creative or /uncreative.');return;}
        const mode=cmd==='/creative'?'Creative':'Survival';const named=args.join(' ').trim();
        if(named&&actor!==playerId){result('Only the world host can change another player’s game mode.');return;}
        let id=actor;
        if(named){if(playerName.toLowerCase()===named.toLowerCase())id=playerId;else id=[...remotePlayers].find(([key,r])=>r.model.name.toLowerCase()===named.toLowerCase())?.[0];if(!id){result('Player not found.');return;}}
        if(id===playerId){gameMode=mode;if(mode!=='Creative')stopFlying();serverSay(`${playerName} is now in ${mode} mode.`);}
        else{const r=remotePlayers.get(id);if(!r){result('Player not found.');return;}r.serverMode=mode;r.state.gameMode=mode;const saved=playerRecords.get(r.model.name.toLowerCase());if(saved)saved.gameMode=mode;connections.get(id)?.send({type:'mode',mode});broadcast({type:'state',id,state:r.state});serverSay(`${r.model.name} is now in ${mode} mode.`);}
        return;
      }
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
    function dropSnapshot(pos=null){const list=[...droppedItems.values()].filter(d=>!pos||Math.hypot(pos.x-d.x,pos.z-d.z)<=Math.min(ENTITY_MAX_DISTANCE,pos.entityDistance||48));return list.map(d=>({id:d.id,item:d.item,count:d.count,x:d.x,y:d.y,z:d.z}));}
    function syncDrops(list){
      const ids=new Set();
      for(const data of list){if(!data||!items[data.item])continue;ids.add(data.id);let d=droppedItems.get(data.id);if(!d)d=makeDropVisual(data);if(!d)continue;
        // Gently correct predicted motion instead of hard-teleporting the drop.
        d.x=data.x;d.z=data.z;d.y+=(data.y-d.y)*.6;d.mesh.position.set(d.x,d.y,d.z);
      }
      for(const id of [...droppedItems.keys()])if(!ids.has(id))removeDroppedItem(id);
    }
    function sendDropSnapshots(){if(!isHost||!connections.size)return;for(const [id,conn] of connections){const r=remotePlayers.get(id);if(conn.open&&r)conn.send({type:'drops',list:dropSnapshot(r.state)});}}
    function collectWorldDrop(drop,collector){
      const remote=collector===playerId?null:remotePlayers.get(collector)?.state;
      if(!drop||!canCollectDrop(drop.item,drop.count,remote))return false;
      if(collector===playerId)addItem(drop.item,drop.count);
      else {const conn=connections.get(collector);if(!conn?.open)return false;conn.send({type:'item',id:drop.item,count:drop.count});if(remote){remote.inventoryFree??={};remote.inventoryFree[drop.item]=Math.max(0,(remote.inventoryFree[drop.item]||0)-drop.count);}}
      removeDroppedItem(drop.id);if(isHost)broadcast({type:'dropRemove',id:drop.id});return true;
    }
    function canCollectDrop(item,count,state=null){const max=(item.includes('pickaxe')||item.includes('sword')||item.includes('axe')||item.includes('helmet')||item.includes('chestplate')||item.includes('leggings')||item.includes('boots'))?1:64;if(!state){let room=inventory.filter(s=>!s).length*max;for(const slot of inventory)if(slot?.id===item)room+=Math.max(0,max-slot.count);return room>=count;}const room=(state.inventoryEmpty||0)*max+(state.inventoryFree?.[item]||0);return room>=count;}
function updateDroppedItems(dt){
      for(const d of droppedItems.values()){
        d.age+=dt;
        // Run drop gravity locally as prediction. The host owns pickup results.
        const loaded=chunks.has(ck(Math.floor(d.x/16),Math.floor(d.z/16)));
        if(loaded){
          const liquid=fluidAt(d.x,d.y,d.z);
          if(liquid==='water')d.vy=THREE.MathUtils.clamp(d.vy+(2.4-d.vy*2.2)*dt,-.45,1.1);
          else d.vy=Math.max(-12,d.vy-18*dt);
          const floor=groundAt(d.x,d.z,d.y+.1)+.24;
          const next=d.y+d.vy*dt;
          if(next<=floor){d.y=floor;d.vy=0;}else d.y=next;
        }
        d.mesh.visible=nearEntity(d.x,d.z,Math.min(64,maxEntityDistance()));
        if(d.mesh.visible)d.mesh.position.set(d.x,d.y+Math.sin(d.age*3.2)*.055,d.z);
        d.mesh.rotation.y+=dt*.8;
      }
      if(hasAuthority()){
        for(const d of [...droppedItems.values()]){
          if(!deathPending&&Math.hypot(player.position.x-d.x,player.position.z-d.z)<1.35&&Math.abs(player.position.y-d.y)<2.2&&collectWorldDrop(d,playerId))continue;
          for(const [id,r] of remotePlayers){
            if(Math.hypot((r.state.x||0)-d.x,(r.state.z||0)-d.z)<1.6&&Math.abs((r.state.y||0)-d.y)<2.4){if(collectWorldDrop(d,id))break;}
          }
        }
      }else if(!deathPending){
        // Explicit pickup request helps when an interpolation frame misses proximity.
        for(const d of droppedItems.values()){
          if(Math.hypot(player.position.x-d.x,player.position.z-d.z)>1.5||Math.abs(player.position.y-d.y)>2.4)continue;
          const at=performance.now();if(at-(pickupRequests.get(d.id)||0)<350)continue;
          pickupRequests.set(d.id,at);sendHost({type:'pickup',id:d.id});
        }
      }
    }
    let lastRemoteChunkPrune=0;
    function pruneUnseenChunks(){
      if(!isHost)return;
      const active=[player.position,...[...remotePlayers.values()].filter(r=>Number.isFinite(r.state.x)).map(r=>r.state)];
      for(const c of [...chunks.values()]){
        if(desiredChunkKeys.has(ck(c.cx,c.cz)))continue;
        const needed=active.some(p=>Math.abs(c.cx-Math.floor(p.x/16))<=2&&Math.abs(c.cz-Math.floor(p.z/16))<=2);
        if(!needed)removeChunk(c.cx,c.cz);
      }
    }
    function dropForBlock(type){if(type==='water'||type==='lava'||type==='bedrock')return null;if(type==='grass')return'dirt';if(type==='stone')return'cobblestone';if(type==='gravel')return Math.random()<.11?'flint':'gravel';if(type==='iron_ore')return'raw_iron';if(type==='diamond_ore')return'diamond';if(type==='coal_ore')return'coal';if(type==='oak_leaves'){const chance=Math.random();return chance<.005?'apple':chance<.125?'stick':null;}return type;}
    function applyBlockMessage(m){
      if(![m.x,m.y,m.z].every(Number.isFinite))return;
      const key=k3(m.x,m.y,m.z);
      if(m.block===null||m.block==='chest'){chestInventories.delete(key);chestVersions.delete(key);}
      if(pendingMine===key)pendingMine=null;
      const localPlace=optimisticPlacements.get(key);const localMine=optimisticMines.get(key);
      if(localPlace&&m.actor===playerId)optimisticPlacements.delete(key);
      if(localMine&&m.block===null)optimisticMines.delete(key);
      const chunkKey=ck(Math.floor(m.x/16),Math.floor(m.z/16));
      // Critical: never synchronously generate remote chunks 1000 blocks away.
      if(!chunks.has(chunkKey))mods.set(key,m.block);
      else if(world.get(key)!==m.block){changeBlock(m.x,m.y,m.z,m.block);flushNearbyMesh(m.x,m.z);}
      if(m.actor===playerId&&m.block&&!localPlace){const s=inventory[m.slot??selectedSlot];if(s&&s.id===m.block&&gameMode!=='Creative'){s.count--;if(s.count<=0)inventory[m.slot??selectedSlot]=null;updateHotbar();}}
    }
    function hostMine(x,y,z,actor){ensureChunkAt(x,z);const type=world.get(k3(x,y,z));if(!type||type==='water'||type==='lava'||type==='bedrock')return false;const mode=actor===playerId?gameMode:(remotePlayers.get(actor)?.state.gameMode||'Survival');const drop=mode==='Creative'?null:dropForBlock(type);if(!changeBlock(x,y,z,null))return false;if(type==='chest'){const key=k3(x,y,z),data=chestInventories.get(key)||[];chestInventories.delete(key);chestVersions.delete(key);for(const stack of data)if(stack)spawnDroppedItem(stack.id,stack.count,x,y,z);broadcast({type:'chestRemoved',key});if(openChestKey===key)closeChest();}flushNearbyMesh(x,z);broadcast({type:'block',x,y,z,block:null,actor,minedType:type});if(drop)spawnDroppedItem(drop,1,x,y,z);mineAchievement(type,actor);return true;}
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
    function hostPlace(x,y,z,block,actor,slot=selectedSlot){if(!placeable.includes(block))return false;ensureChunkAt(x,z);if(world.has(k3(x,y,z)))return false;const r=remotePlayers.get(actor),pos=actor===playerId?player.position:r?.state;if(!pos||overlaps(x,y,z,pos)||[...remotePlayers.values()].some(other=>other.id!==actor&&overlaps(x,y,z,other.state)))return false;if(actor!==playerId&&r?.state.gameMode!=='Creative'&&(r?.state.inventoryCounts?.[block]||0)<1)return false;if(!changeBlock(x,y,z,block))return false;flushNearbyMesh(x,z);broadcast({type:'block',x,y,z,block,actor,slot});if(actor===playerId&&gameMode!=='Creative'){const s=inventory[slot];if(s&&s.id===block){s.count--;if(s.count<=0)inventory[slot]=null;updateHotbar();}}else if(actor!==playerId&&r?.state&&r.state.gameMode!=='Creative'){r.state.selectedCount=Math.max(0,(r.state.selectedCount||1)-1);}return true;}

    function handleNetwork(from,msg){
      if(!msg||typeof msg!=='object')return;
      if(isHost){
        const conn=connections.get(from);if(!conn)return;
        if(msg.type==='hello'){
          if(remotePlayers.size>=4||connections.size>4){conn.send({type:'full'});conn.close();connections.delete(from);return;}
          const incomingName=validName(msg.name);if(incomingName.toLowerCase()===playerName.toLowerCase()||[...remotePlayers.values()].some(p=>p.model.name.toLowerCase()===incomingName.toLowerCase())){conn.send({type:'duplicateName'});conn.close();return;}
          const r=addRemote(from,{name:incomingName,avatar:validAvatar(msg.avatar),appearance:msg.appearance});r.serverMode='Survival';r.state={x:player.position.x+2+remotePlayers.size*1.5,y:player.position.y,z:player.position.z,yaw:0,pitch:0,hp:20,gameMode:'Survival',moving:false,walk:0};pose(r.model,r.state);
          const savedGuest=playerRecords.get(r.model.name.toLowerCase())||null;
          if(savedGuest?.gameMode==='Creative')r.serverMode='Creative';
          conn.send({...welcomePacket(),yourSavedPlayer:savedGuest,yourMode:r.serverMode});broadcast({type:'playerJoin',player:{id:from,name:r.model.name,avatar:r.model.preset,appearance:r.model.appearance,...r.state}},from);addChat('Server',`${r.model.name} joined.`);broadcast({type:'chat',name:'Server',text:`${r.model.name} joined.`},from);return;
        }
        const r=remotePlayers.get(from);if(!r)return;
        if(msg.type==='profile'){const nextName=validName(msg.name),nextAvatar=validAvatar(msg.avatar),app=cleanAppearance(msg.appearance);scene.remove(r.model.group);r.model=makeAvatar(nextName,nextAvatar,app);r.model.group.traverse(o=>{if(o.isMesh)o.userData.remotePlayer=from;});scene.add(r.model.group);broadcast({type:'profileUpdate',id:from,name:nextName,avatar:nextAvatar,appearance:app});return;}
        if(msg.type==='state'){r.state={...r.state,...msg.state,gameMode:r.serverMode||'Survival',isFlying:r.serverMode==='Creative'&&!!msg.state?.isFlying};pose(r.model,r.state);broadcast({type:'state',id:from,state:r.state},from);return;}
        if(msg.type==='playerData'){if(r.dead)return;const record=cleanPlayerRecord(msg.record);if(record){record.gameMode=r.serverMode||'Survival';playerRecords.set(r.model.name.toLowerCase(),record);}return;}
        if(msg.type==='command'){runServerCommand(from,String(msg.text||''));return;}
        if(msg.type==='mine'){ensureChunkAt(msg.x,msg.z);const minedType=world.get(k3(msg.x,msg.y,msg.z));const ok=validReach(r.state,msg.x,msg.y,msg.z)&&!!minedType&&minedType!=='water'&&minedType!=='lava';if(ok){const mined=hostMine(msg.x,msg.y,msg.z,from);conn.send({type:'mineAck',key:k3(msg.x,msg.y,msg.z),ok:!!mined});}else conn.send({type:'mineAck',key:k3(msg.x,msg.y,msg.z),ok:false});return;}
        if(msg.type==='place'){
          const valid=validReach(r.state,msg.x,msg.y,msg.z)&&[msg.x,msg.y,msg.z].every(Number.isInteger);
          const placed=valid?!!hostPlace(msg.x,msg.y,msg.z,msg.block,from,msg.slot??0):false;
          conn.send({type:'placeAck',key:k3(msg.x,msg.y,msg.z),ok:placed});return;
        }
        if(msg.type==='pickup'){
          const d=droppedItems.get(String(msg.id||''));
          if(d&&Math.hypot(r.state.x-d.x,r.state.z-d.z)<2.6&&Math.abs(r.state.y-d.y)<3)collectWorldDrop(d,from);
          return;
        }
        if(msg.type==='sleep'){const x=Number(msg.x),y=Number(msg.y),z=Number(msg.z);if([x,y,z].every(Number.isInteger)&&validReach(r.state,x,y,z)){ensureChunkAt(x,z);if(world.get(k3(x,y,z))==='red_bed')setPlayerSleeping(from,true);}return;}
        if(msg.type==='igniteTnt'){const x=Number(msg.x),y=Number(msg.y),z=Number(msg.z);if([x,y,z].every(Number.isInteger)&&validReach(r.state,x,y,z)&&r.state.selectedItem==='flint_and_steel'){ensureChunkAt(x,z);primeTNT(x,y,z);}return;}
        if(msg.type==='respawnRequest'){
          if(!r.dead)return;
          r.dead=false;r.state.hp=20;const sx=spawnPoint.x+1,sz=spawnPoint.z+1;ensureChunkAt(sx,sz);r.state.x=sx;r.state.z=sz;r.state.y=floorAt(sx,sz);
          conn.send({type:'respawn',x:r.state.x,y:r.state.y,z:r.state.z,hp:20});
          broadcast({type:'state',id:from,state:r.state},from);return;
        }
        if(msg.type==='deathNotice'){r.dead=true;r.state.hp=0;if(!keepInventory)playerRecords.delete(r.model.name.toLowerCase());const cause=String(msg.cause||'generic').slice(0,30),attacker=String(msg.attacker||'').slice(0,20);serverSay(deathLine(r.model.name,cause,attacker));if(!keepInventory&&Array.isArray(msg.items)&&msg.items.length<=52){let drops=0;for(const v of msg.items){if(items[v?.id]&&Number.isInteger(v.count)&&v.count>0&&drops++<52){let n=Math.min(64,v.count);while(n>0){const q=Math.min(maxStack(v.id),n);spawnDroppedItem(v.id,q,r.state.x,r.state.y,r.state.z);n-=q;}}}}return;}
        if(msg.type==='bucket'){if(validReach(r.state,msg.x,msg.y,msg.z)){hostBucketAction(msg.x,msg.y,msg.z,msg.nx,msg.ny,msg.nz,msg.slot??0,from);}return;}
        if(msg.type==='chestRequest'||msg.type==='chestAction'){
          const key=String(msg.key||''),parts=key.split(',').map(Number);
          if(parts.length!==3||!parts.every(Number.isInteger))return;
          const [x,y,z]=parts;
          if(!validReach(r.state,x,y,z))return;
          ensureChunkAt(x,z);if(world.get(key)!=='chest')return;
          let data=chestInventories.get(key);if(!data){data=Array(27).fill(null);chestInventories.set(key,data);}
          const version=chestVersions.get(key)||0;
          if(msg.type==='chestRequest'){conn.send({type:'chestData',key,items:data,version});return;}
          const i=msg.index,tx=msg.tx,last=chestLastAction.get(from)||0;
          if(!Number.isSafeInteger(tx)||tx<=last||!Number.isInteger(i)||i<0||i>26||!validChestStack(msg.cursor))return;
          chestLastAction.set(from,tx);
          if(msg.version!==version){conn.send({type:'chestReceipt',tx,key,ok:false,version,items:data});return;}
          const action=chestInteraction(data[i],msg.cursor,!!msg.right);
          if(action.changed){data[i]=action.slot;chestVersions.set(key,version+1);
            broadcast({type:'chestData',key,version:version+1,items:data},from);
            if(openChestKey===key&&chestOverlay.style.display==='flex')openChest(key,false);
          }
          conn.send({type:'chestReceipt',tx,key,ok:true,version:chestVersions.get(key)||version,items:data,cursor:action.cursor});
          return;
        }
        if(msg.type==='hitMob'){const m=mobs.get(msg.id);if(m&&Math.hypot(m.group.position.x-r.state.x,m.group.position.z-r.state.z)<5)damageMob(m,from,!!msg.critical,!!msg.sword,Number(msg.charge)||0);return;}
        if(msg.type==='hitPlayer'&&pvpEnabled){
          const targetId=String(msg.id||''),target=targetId===playerId?null:remotePlayers.get(targetId);
          const tx=targetId===playerId?player.position.x:target?.state.x;
          const tz=targetId===playerId?player.position.z:target?.state.z;
          if(targetId!==from&&Number.isFinite(tx)&&Math.hypot(r.state.x-tx,r.state.z-tz)<4.3&&allowAttack(from)){
            const amount=attackDamage(from,!!msg.critical,Number(msg.charge)||0);
            if(targetId===playerId){damagePlayer(amount,false,'player',r.model.name);broadcast({type:'playerHit',id:playerId});const dx=player.position.x-r.state.x,dz=player.position.z-r.state.z,dist=Math.hypot(dx,dz)||1;knockbackX=dx/dist*3;knockbackZ=dz/dist*3;}
            else damageRemote(targetId,amount,r.state,'player',r.model.name);
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
          if(running)return;gameMode=msg.yourMode==='Creative'?'Creative':'Survival';seed=String(msg.seed||'12345');worldName=msg.worldName||'World';roomCode=msg.roomCode||roomCode;networkHostId=String(msg.hostId||'');difficulty=msg.difficulty||'Normal';mobsEnabled=!!msg.mobsEnabled;pvpEnabled=!!msg.pvpEnabled;chatEnabled=msg.chatEnabled!==false;keepInventory=!!msg.keepInventory;weather=msg.weather||'Clear';worldTime=Number.isFinite(msg.worldTime)?msg.worldTime:.27;dayLength=msg.dayLength||600;
          mods.clear();for(const e of msg.mods||[])mods.set(e[0],e[1]);startWorld({network:true,restoredPlayer:msg.yourSavedPlayer||null,players:msg.players||[],mobs:msg.mobs||[],chests:msg.chests||[],drops:msg.drops||[]});return;
        }
        if(msg.type==='snapshotRequest'){sendHost({type:'playerData',record:playerInventoryRecord()});return;}
        if(msg.type==='full'||msg.type==='duplicateName'){showMenuMessage(msg.type==='full'?'This server is full (maximum 5 players).':'That username is already in this server.');disconnect();showMultiplayer();return;}
        if(msg.type==='state'){const r=remotePlayers.get(msg.id)||addRemote(msg.id,msg.state);r.state={...r.state,...msg.state};pose(r.model,r.state);return;}if(msg.type==='profileUpdate'){const r=remotePlayers.get(msg.id);if(r){scene.remove(r.model.group);r.model=makeAvatar(msg.name,msg.avatar,msg.appearance);r.model.group.traverse(o=>{if(o.isMesh)o.userData.remotePlayer=msg.id;});scene.add(r.model.group);pose(r.model,r.state);}return;}
        if(msg.type==='playerJoin'){const p=msg.player;if(p&&p.id!==playerId){const r=addRemote(p.id,{name:p.name,avatar:p.avatar,appearance:p.appearance});r.state={...p};pose(r.model,r.state);}return;}
        if(msg.type==='block'){applyBlockMessage(msg);return;}
        if(msg.type==='chestRemoved'){const key=String(msg.key||'');chestInventories.delete(key);chestVersions.delete(key);if(openChestKey===key){chestPending=null;closeChest();}return;}
        if(msg.type==='chestData'){const key=String(msg.key||''),version=Number(msg.version)||0;if(version<(chestVersions.get(key)||0))return;
          chestVersions.set(key,version);chestInventories.set(key,Array.isArray(msg.items)?msg.items.map(cloneStack):Array(27).fill(null));
          if(openChestKey===key&&chestOverlay.style.display==='flex')openChest(key,false);return;}
        if(msg.type==='chestReceipt'){if(!chestPending||msg.tx!==chestPending.tx||msg.key!==chestPending.key)return;
          chestPending=null;const key=String(msg.key||'');chestVersions.set(key,Number(msg.version)||0);
          if(Array.isArray(msg.items))chestInventories.set(key,msg.items.map(cloneStack));
          if(msg.ok){cursorStack=cloneStack(msg.cursor);updateHotbar();}else showToast('Chest changed','A player updated the chest. Please try again.');
          if(openChestKey===key&&chestOverlay.style.display==='flex')openChest(key,false);return;}
        if(msg.type==='item'){addItem(msg.id,msg.count||1);return;}
        if(msg.type==='dropSpawn'){makeDropVisual(msg.drop);return;}
        if(msg.type==='drops'){syncDrops(msg.list||[]);return;}
        if(msg.type==='dropRemove'){removeDroppedItem(msg.id);return;}
        if(msg.type==='dropMove'){const d=droppedItems.get(msg.id);if(d&&[msg.x,msg.y,msg.z].every(Number.isFinite)){d.x=msg.x;d.y=msg.y;d.z=msg.z;d.mesh.position.set(d.x,d.y,d.z);}return;}
        if(msg.type==='bucketResult'){const slot=Number(msg.slot);if(Number.isInteger(slot)&&slot>=0&&slot<inventory.length){inventory[slot]={id:msg.item,count:1};updateHotbar();}return;}
        if(msg.type==='tntPrime'){if(typeof msg.id==='string'&&[msg.x,msg.y,msg.z].every(Number.isFinite))addPrimedTnt(msg.id,msg.x,msg.y,msg.z,msg.fuse||4);return;}
        if(msg.type==='tntGone'){removePrimedTnt(msg.id);return;}
        if(msg.type==='blockBatch'){const changed=new Set();for(const b of msg.changes||[]){if(![b.x,b.y,b.z].every(Number.isInteger))continue;const chunk=ck(Math.floor(b.x/16),Math.floor(b.z/16));if(chunks.has(chunk))changeBlock(b.x,b.y,b.z,b.block);else mods.set(k3(b.x,b.y,b.z),b.block);changed.add(chunk);}for(const c of changed){const [cx,cz]=c.split(',').map(Number);if(Math.abs(cx-Math.floor(player.position.x/16))<=1&&Math.abs(cz-Math.floor(player.position.z/16))<=1){const chunk=chunks.get(c);if(chunk)buildChunk(chunk);}}return;}
        if(msg.type==='sleepDone'){worldTime=msg.worldTime??.27;weather=msg.weather||'Clear';playerSleeping=false;showToast('Morning','The night has passed.');return;}
        if(msg.type==='fatal'){respawn(msg.cause||'generic',msg.attacker||'',true);return;}
        if(msg.type==='mobs'){syncMobs(msg.list||[]);return;}
        if(msg.type==='damage'){hp=Math.max(0,msg.hp);if(Number.isFinite(msg.kx))knockbackX=msg.kx;if(Number.isFinite(msg.kz))knockbackZ=msg.kz;updateHealth(true);if(hp<=0)respawn(msg.cause||'generic',msg.attacker||'');return;}
        if(msg.type==='respawn'){if(deathPending){deathRespawnTarget={x:msg.x,y:msg.y,z:msg.z};}else{player.position.set(msg.x,msg.y,msg.z);hp=20;velocityY=0;fallPeakY=msg.y;updateChunks(true);updateHealth(true);}return;}
        if(msg.type==='playerHit'){const r=remotePlayers.get(msg.id);if(r){r.hitUntil=performance.now()+120;setAvatarTint(r.model,true);}return;}
        if(msg.type==='mobHealth'){const m=mobs.get(msg.id);if(m){m.hp=msg.hp;flashMob(m);if(msg.dead)removeMob(msg.id);}return;}
        if(msg.type==='chat'){addChat(msg.name,msg.text);return;}
        if(msg.type==='achievement'){addAchievement(msg.id,msg.name);return;}
        if(msg.type==='playerJoin'){const p=msg.player;if(p&&p.id!==playerId){const r=addRemote(p.id,{name:p.name,avatar:p.avatar,appearance:p.appearance});r.state={...p};pose(r.model,r.state);}return;}
        if(msg.type==='mineAck'){
          if(pendingMine===msg.key)pendingMine=null;
          const optimistic=optimisticMines.get(msg.key);optimisticMines.delete(msg.key);
          if(!msg.ok){if(optimistic&&chunks.has(ck(Math.floor(optimistic.x/16),Math.floor(optimistic.z/16))))changeBlock(optimistic.x,optimistic.y,optimistic.z,optimistic.block);miningKey=null;miningProgress=0;progressFill.style.width='0%';crackMesh.visible=false;}return;
        }
        if(msg.type==='placeAck'){
          const o=optimisticPlacements.get(msg.key);optimisticPlacements.delete(msg.key);
          if(o&&!msg.ok){if(world.get(msg.key)===o.block)changeBlock(o.x,o.y,o.z,o.original||null);if(o.used&&inventory[o.slot]?.id===o.block)inventory[o.slot].count++;else if(o.used)addItem(o.block,1);updateHotbar();}return;
        }
        if(msg.type==='commandResult'){addChat('Server',msg.text||'');return;}
        if(msg.type==='role'){if(msg.role==='Commander')roleById.add(playerId);else roleById.delete(playerId);showToast('Role',msg.role||'Player');return;}
        if(msg.type==='mode'){gameMode=msg.mode==='Creative'?'Creative':'Survival';if(gameMode!=='Creative')stopFlying();showToast('Game Mode',gameMode);return;}
        if(msg.type==='give'){addItem(msg.id,msg.amount||1);return;}
        if(msg.type==='worldSettings'){if(msg.difficulty)difficulty=msg.difficulty;if(msg.weather)weather=msg.weather;if(Number.isFinite(msg.worldTime))worldTime=msg.worldTime;if(msg.dayLength)dayLength=msg.dayLength;if(typeof msg.pvpEnabled==='boolean')pvpEnabled=msg.pvpEnabled;if(typeof msg.mobsEnabled==='boolean')mobsEnabled=msg.mobsEnabled;if(typeof msg.keepInventory==='boolean')keepInventory=msg.keepInventory;return;}
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
      if(m.pig||m.cow||m.chicken||m.sheep){m.fleeX=dx/len;m.fleeZ=dz/len;m.fleeTimer=2.6;m.walking=true;}
      if(m.hp<=0){const x=m.group.position.x,y=m.group.position.y,z=m.group.position.z;removeMob(m.id);if(m.creeper){spawnDroppedItem('gunpowder',1+Math.floor(Math.random()*2),x,y,z);}else if(m.sheep){spawnDroppedItem('white_wool',1+Math.floor(Math.random()*2),x,y,z);}else if(m.cow){spawnDroppedItem('raw_beef',1+Math.floor(Math.random()*2),x,y,z);spawnDroppedItem('leather',1,x+.2,y,z);}else if(m.chicken){spawnDroppedItem('raw_chicken',1+Math.floor(Math.random()*2),x,y,z);spawnDroppedItem('feather',1+Math.floor(Math.random()*2),x-.2,y,z);}else if(m.pig)spawnDroppedItem('raw_porkchop',1+Math.floor(Math.random()*2),x,y,z);else{spawnDroppedItem('rotten_flesh',1,x,y,z);if(actor===playerId)unlock('first_mob');else{const r=remotePlayers.get(actor);broadcast({type:'achievement',id:'first_mob',name:r?.model.name||'Player'});}}}
      broadcast({type:'mobHealth',id:m.id,hp:m.hp,dead:m.hp<=0});
    }
    function deathLine(name,cause='generic',attacker=''){
      const victim=validName(name),other=validName(attacker||'Unknown');
      if(cause==='player')return `${victim} was slain by ${other}`;
      if(cause==='mob')return `${victim} was slain by ${other==='Unknown'?'Zombie':other}`;
      const messages={starve:'starved to death',drown:'drowned',fall:'fell from a high place',lava:'tried to swim in lava',fire:'went up in flames',suffocate:'suffocated in a wall',explosion:'blew up',void:'fell out of the world'};
      return `${victim} ${messages[cause]||'died'}`;
    }
    let lastDeathAt=0;
    function damageRemote(id,amount,attacker=null,cause='player',attackerName=''){
      const r=remotePlayers.get(id),conn=connections.get(id);if(!r||!conn?.open||r.dead||r.serverMode==='Creative')return;
      r.state.hp=Math.max(0,(r.state.hp??20)-amount*armorFactor(r.state.armour));
      const source=attacker||player.position,dx=r.state.x-source.x,dz=r.state.z-source.z,len=Math.hypot(dx,dz)||1;
      if(r.state.hp>0)conn.send({type:'damage',hp:r.state.hp,kx:dx/len*3,kz:dz/len*3});
      r.hitUntil=performance.now()+120;setAvatarTint(r.model,true);broadcast({type:'playerHit',id},id);
      if(r.state.hp<=0){const name=attackerName||playerName;serverSay(deathLine(r.model.name,cause,name));if(!keepInventory)playerRecords.delete(r.model.name.toLowerCase());
        if(!keepInventory)for(const [item,count] of Object.entries(r.state.inventoryCounts||{})){if(items[item]){let left=Math.min(4096,Math.max(0,count|0));while(left>0){const size=Math.min(maxStack(item),left);spawnDroppedItem(item,size,r.state.x,r.state.y,r.state.z);left-=size;}}}
        r.dead=true;r.state.hp=0;
        conn.send({type:'fatal',cause,attacker:name,keepInventory});
      }
    }
    function armorFactor(equipped=armour){let points=0;for(const slot of Object.values(equipped||{})){const id=slot?.id||slot;if(!id)continue;if(id.startsWith('leather_'))points+=1;if(id.startsWith('iron_'))points+=2;if(id.startsWith('diamond_'))points+=3;}return Math.max(.35,1-Math.min(20,points)*.04);}
    function damagePlayer(n,environmental=false,cause='generic',attacker=''){if(deathPending)return;if(gameMode==='Creative'||(difficulty==='Peaceful'&&!environmental))return;hp=Math.max(0,hp-n*armorFactor());updateHealth(true);if(hp<=0)respawn(cause,attacker);}
    function respawn(cause='generic',attacker='',hostConfirmed=false){
      if(deathPending)return;
      const now=performance.now();if(now-lastDeathAt<400)return;lastDeathAt=now;
      stopFlying();deathPending=true;deathRespawnTarget={...spawnPoint};const msg=deathLine(playerName,cause,attacker),drops=[];
      if(!keepInventory&&gameMode!=='Creative'){
        for(const stack of inventory)if(stack)drops.push({...stack});
        for(const stack of Object.values(armour))if(stack)drops.push({...stack});
        if(offhand)drops.push({...offhand});
        for(const stack of craftingGrid)if(stack)drops.push({...stack});
        if(cursorStack)drops.push({...cursorStack});
        inventory.fill(null);armour={head:null,chest:null,legs:null,feet:null};offhand=null;craftingGrid.fill(null);cursorStack=null;
      }
      if(!hostConfirmed){
        if(isHost){serverSay(msg);for(const stack of drops)spawnDroppedItem(stack.id,stack.count,player.position.x,player.position.y,player.position.z);}
        else if(peer){sendHost({type:'deathNotice',cause,attacker,items:drops});}
        else{addChat('Server',msg);for(const stack of drops)spawnDroppedItem(stack.id,stack.count,player.position.x,player.position.y,player.position.z);}
      }
      showDeathScreen(cause,attacker);
      updateHotbar();updateHealth(true);
    }
    function mobCanWalk(m,nx,nz){
      const radius=m.chicken?.25:m.cow?.48:m.sheep?.46:m.pig?.44:.31;
      const height=m.chicken?1.3:m.cow?1.92:m.sheep?1.72:m.pig?1.55:1.85;
      const points=[[nx-radius,nz-radius],[nx-radius,nz+radius],[nx+radius,nz-radius],[nx+radius,nz+radius],[nx,nz]];
      for(const [x,z] of points)if(!chunks.has(ck(Math.floor(x/16),Math.floor(z/16))))return null;
      const feet=points.map(([x,z])=>groundAt(x,z,m.group.position.y+.75));
      const high=Math.max(...feet),low=Math.min(...feet);
      if(high-low>.65||high>m.group.position.y+.70||high<m.group.position.y-1.05)return null;
      const minX=Math.floor(nx-radius),maxX=Math.floor(nx+radius),minZ=Math.floor(nz-radius),maxZ=Math.floor(nz+radius);
      for(let x=minX;x<=maxX;x++)for(let z=minZ;z<=maxZ;z++)for(let y=Math.floor(high+.07);y<=Math.floor(high+height-.06);y++){
        if(isSolidBlock(world.get(k3(x,y,z))))return null;
      }
      return high;
    }
    function mobMoveTowards(m,dx,dz,speed,dt){
      const length=Math.hypot(dx,dz);if(length<.001)return false;
      const ux=dx/length,uz=dz/length;
      const count=Math.max(1,Math.ceil(speed*dt/.16));let moved=false;
      for(let i=0;i<count;i++){const nx=m.group.position.x+ux*speed*dt/count,nz=m.group.position.z+uz*speed*dt/count;
        const nextY=mobCanWalk(m,nx,nz);if(nextY===null)break;
        m.group.position.x=nx;m.group.position.z=nz;
        m.group.position.y=THREE.MathUtils.lerp(m.group.position.y,nextY,Math.min(1,dt*12));moved=true;}
      if(!moved)return false;
      const heading=Math.atan2(-ux,-uz),diff=Math.atan2(Math.sin(heading-m.group.rotation.y),Math.cos(heading-m.group.rotation.y));
      m.group.rotation.y+=diff*Math.min(1,dt*8);
      return true;
    }
    function animateMobLegs(m,dt){
      if(!m.legParts){m.legParts=m.group.children.filter(o=>o.isMesh&&o.position.y<.55&&o.geometry?.parameters?.height>=.24&&Math.abs(o.position.x)>.05);}
      if(m.walking)m.walkPhase=(m.walkPhase||0)+dt*(m.chicken?15:10);
      for(let i=0;i<m.legParts.length;i++){
        const leg=m.legParts[i],swing=m.walking?Math.sin((m.walkPhase||0)+(i%2?Math.PI:0))*(m.chicken?.48:.35):0;
        leg.rotation.x=THREE.MathUtils.lerp(leg.rotation.x,swing,Math.min(1,dt*14));
      }
    }
    function updateMobs(dt){
      if(!hasAuthority())return;
      if(mobsEnabled&&difficulty!=='Peaceful'&&isNight()){
        mobSpawnTimer+=dt;
        if(mobSpawnTimer>(difficulty==='Hard'?12:difficulty==='Easy'?38:23)&&mobs.size<(difficulty==='Hard'?18:difficulty==='Easy'?8:12)){
          mobSpawnTimer=0;
          const actors=[player.position,...[...remotePlayers.values()].filter(r=>Number.isFinite(r.state.x)).map(r=>r.state)];
          const source=actors[Math.floor(Math.random()*actors.length)],a=Math.random()*Math.PI*2,d=15;
          const x=Math.floor(source.x+Math.cos(a)*d),z=Math.floor(source.z+Math.sin(a)*d);
          ensureChunkAt(x,z);(Math.random()<.24?makeCreeper:makeZombie)(`mob-${mobCounter++}`,x+.5,groundAt(x,z),z+.5);
        }
      }
      const targets=[{id:playerId,x:player.position.x,z:player.position.z},...[...remotePlayers].map(([id,r])=>({id,x:r.state.x,z:r.state.z}))];
      for(const m of [...mobs.values()]){
        let target=targets[0],best=Infinity;
        for(const p of targets){if(!Number.isFinite(p.x)||!Number.isFinite(p.z))continue;
          const d=Math.hypot(p.x-m.group.position.x,p.z-m.group.position.z);
          if(d<best){best=d;target=p;}
        }
        m.walking=false;
        if(best>54){m.awayTime=(m.awayTime||0)+dt;
          if(m.awayTime>14&&!(m.pig||m.cow||m.chicken||m.sheep)){removeMob(m.id);continue;}
        }else m.awayTime=0;
        if(best<=42){
          if(m.pig||m.cow||m.chicken||m.sheep){
            if(m.fleeTimer>0){m.fleeTimer-=dt;
              m.walking=mobMoveTowards(m,m.fleeX||0,m.fleeZ||-1,m.chicken?3.7:3.1,dt);
              if(!m.walking){m.fleeX=-m.fleeZ;m.fleeZ=(Math.random()-.5)*1.5;}
            }else{
              m.attackTimer=(m.attackTimer||0)-dt;
              if(m.attackTimer<=0){m.wanderHeading=(m.wanderHeading||0)+(Math.random()-.5)*1.5;m.attackTimer=1.6+Math.random()*2.6;}
              const heading=m.wanderHeading||0;
              m.walking=mobMoveTowards(m,-Math.sin(heading),-Math.cos(heading),m.chicken?.48:.58,dt);
              if(!m.walking)m.wanderHeading=heading+1.2+Math.random();
            }
          }else{
            if(best<25&&best>1.15){
              m.walking=mobMoveTowards(m,target.x-m.group.position.x,target.z-m.group.position.z,1.1,dt);
            }
            m.attackTimer-=dt;
            if(best<1.35&&m.attackTimer<=0){
              if(m.creeper){const data={id:'mob-explosion-'+m.id,x:Math.floor(m.group.position.x),y:Math.floor(m.group.position.y),z:Math.floor(m.group.position.z)};removeMob(m.id);detonateTNT(data);continue;}
              const dmg=difficulty==='Hard'?4:difficulty==='Easy'?1:2;
              if(target.id===playerId)damagePlayer(dmg,false,'mob','Zombie');else damageRemote(target.id,dmg,m.group.position,'mob','Zombie');
              m.attackTimer=1.4;
            }
          }
        }
        if(m.knockX||m.knockZ){const y=mobCanWalk(m,m.group.position.x+m.knockX*dt,m.group.position.z+m.knockZ*dt);
          if(y!==null){m.group.position.x+=m.knockX*dt;m.group.position.z+=m.knockZ*dt;m.group.position.y=y;}
          m.knockX*=Math.max(0,1-dt*10);m.knockZ*=Math.max(0,1-dt*10);
        }
        if(m.hitTimer>0){m.hitTimer-=dt;if(m.hitTimer<=0)clearMobFlash(m);}
      }
    }

    // Menus
    // ---- v13 upgraded game client, retaining v11 account system + per-account IndexedDB world storage ----
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
    function applyUserPreferences(prefs){
      if(!prefs||typeof prefs!=='object')return;
      renderDistance=Number.isFinite(prefs.renderDistance)?Math.max(1,Math.min(20,Math.round(prefs.renderDistance))):renderDistance;
      fov=Number.isFinite(prefs.fov)?Math.max(60,Math.min(110,prefs.fov)):fov;
      sensitivity=Number.isFinite(prefs.sensitivity)?Math.max(.2,Math.min(3,prefs.sensitivity)):sensitivity;
      flySpeed=Number.isFinite(prefs.flySpeed)?Math.max(2,Math.min(24,prefs.flySpeed)):flySpeed;
      quality=['Low','Medium','High'].includes(prefs.quality)?prefs.quality:quality;
      if(prefs.keybinds&&typeof prefs.keybinds==='object')for(const key of Object.keys(defaultKeybinds)){
        const binding=prefs.keybinds[key];if(typeof binding==='string'&&/^(Key[A-Z]|Digit[0-9]|Control(Left|Right)|Shift(Left|Right)|Space|Arrow(Up|Down|Left|Right)|Slash|Alt(Left|Right))$/.test(binding))keybinds[key]=binding;
      }
      camera.fov=fov;camera.updateProjectionMatrix();renderer.setPixelRatio(Math.min(devicePixelRatio,quality==='Low'?.55:quality==='Medium'?.8:1));renderer.setSize(innerWidth,innerHeight);
    }
    async function saveUserPreferences(){if(!currentAccount)return;
      try{const a=await dbGet('accounts',currentAccount);if(!a)return;
        a.preferences={renderDistance,fov,sensitivity,quality,flySpeed,keybinds:{...keybinds}};
        a.avatar=avatarChoice;a.appearance={...avatarAppearance};await dbPut('accounts',a);
      }catch(err){showToast('Settings not saved',err?.message||'Browser storage is unavailable.');}
    }
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
          currentAccount=a.name;playerName=a.display||n;applyUserPreferences(a.preferences);applyProfile(playerName,a.avatar||'Steve',a.appearance||avatarAppearance);startPresence();showHome();
        }catch(e){showMenuMessage(e?.message||'Could not access saved accounts.');}finally{login.disabled=register.disabled=false;pw.value='';}}
      login.onclick=()=>submit(false);register.onclick=()=>submit(true);pw.onkeydown=e=>{if(e.key==='Enter')submit(false);};
    }
    function playerInventoryRecord(){return{
      inventory:inventory.map(s=>cloneStack(s)),
      armour:Object.fromEntries(Object.entries(armour).map(([slot,s])=>[slot,cloneStack(s)])),
      offhand:cloneStack(offhand),hp:deathPending?20:hp,hunger,
      pos:deathPending?{...spawnPoint}:{x:player.position.x,y:player.position.y,z:player.position.z},
      yaw,pitch,gameMode
    };}
    function cleanPlayerRecord(data){
      if(!data||typeof data!=='object')return null;
      const pos=data.pos&&[data.pos.x,data.pos.y,data.pos.z].every(v=>Number.isFinite(v)&&Math.abs(v)<1000000)
        ?{x:data.pos.x,y:data.pos.y,z:data.pos.z}:null;
      return{inventory:Array.from({length:36},(_,i)=>cloneStack(data.inventory?.[i])),
        armour:Object.fromEntries(['head','chest','legs','feet'].map(k=>[k,cloneStack(data.armour?.[k])])),
        offhand:cloneStack(data.offhand),hp:Number.isFinite(data.hp)?Math.max(1,Math.min(20,data.hp)):20,
        hunger:Number.isFinite(data.hunger)?Math.max(0,Math.min(20,data.hunger)):20,
        pos,yaw:Number.isFinite(data.yaw)?data.yaw:0,pitch:Number.isFinite(data.pitch)?data.pitch:0,
        gameMode:data.gameMode==='Creative'?'Creative':'Survival'};
    }
    function applyPlayerRecord(data){const rec=cleanPlayerRecord(data);if(!rec)return;
      for(let i=0;i<36;i++)inventory[i]=rec.inventory[i];
      armour=rec.armour;offhand=rec.offhand;hp=rec.hp;hunger=rec.hunger;
      if(rec.pos){player.position.set(rec.pos.x,rec.pos.y,rec.pos.z);updateChunks(true);}
      yaw=rec.yaw;pitch=rec.pitch;updateHotbar();updateHealth(true);updateHunger();
    }
    async function saveCurrentWorld(urgent=false){
      if(!currentAccount||!activeWorldId||!running||(peer&&!isHost)||saveBusy)return Promise.resolve();
      saveBusy=true;
      // Ask each guest for a fresh inventory snapshot before saving the hosted world.
      if(isHost&&connections.size&&!urgent){broadcast({type:'snapshotRequest'});await new Promise(resolve=>setTimeout(resolve,280));}
      const snapshot={id:activeWorldId,owner:currentAccount,mode:activeWorldMode,name:worldName,
        seed,difficulty,gameMode,weather,worldTime,dayLength,mobsEnabled,pvpEnabled,chatEnabled,keepInventory,
        mods:[...mods.entries()],chests:[...chestInventories.entries()],drops:dropSnapshot(),
        playerRecords:[...playerRecords.entries()],
        inventory:inventory.map(x=>x?{...x}:null),armour:{...armour},offhand:offhand?{...offhand}:null,
        hp:deathPending?20:hp,hunger,pos:deathPending?{...spawnPoint}:{x:player.position.x,y:player.position.y,z:player.position.z},yaw,pitch,
        created:activeWorldCreated||Date.now(),updated:Date.now()};
      lastSaveAt=Date.now();return dbPut('worlds',snapshot).catch(e=>{
        showToast('Save failed',e?.message||'Storage is full or blocked.');
      }).finally(()=>{saveBusy=false;});
    }
    let activeWorldCreated=null;
    function resetWorldOwnership(mode){activeWorldMode=mode;activeWorldId=randomId();activeWorldCreated=Date.now();activeRestore=null;}
    function startNewWorld(mode,params){
      disconnect();resetWorldOwnership(mode);worldName=params.name||'My World';seed=params.seed||randomId();difficulty=params.difficulty||'Normal';mobsEnabled=params.mobs??true;pvpEnabled=params.pvp??false;chatEnabled=params.chat??true;keepInventory=!!params.keepInventory;gameMode='Survival';
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
    function resumeSavedWorld(w){disconnect();activeWorldId=w.id;activeWorldCreated=w.created||Date.now();activeWorldMode=w.mode;activeRestore=w;worldName=w.name;seed=w.seed;difficulty=w.difficulty;mobsEnabled=w.mobsEnabled;pvpEnabled=w.pvpEnabled;chatEnabled=w.chatEnabled;keepInventory=!!w.keepInventory;gameMode=w.gameMode||'Survival';weather=w.weather||'Clear';worldTime=w.worldTime??.27;dayLength=w.dayLength||600;
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
    const partyHud=document.createElement('div');partyHud.className='fm-party-status';partyHud.style.cssText='position:absolute;top:14px;right:15px;z-index:12;color:white;pointer-events:none;min-width:145px;display:none;background:#1d342de6;backdrop-filter:blur(6px)';ROOT.appendChild(partyHud);
    function updatePartyHud(){if(partyState==='solo'||!running){partyHud.style.display='none';return;}
      const names=partyState==='leader'?[playerName,...partyMembers.keys()]:[partyLeader,playerName,...partyMembers.keys()].filter((n,i,a)=>a.findIndex(x=>x.toLowerCase()===n.toLowerCase())===i);
      const count=Math.min(5,names.length);partyHud.style.display='flex';partyHud.replaceChildren();
      const avatars=document.createElement('span');avatars.style.display='inline-flex';avatars.style.paddingLeft='6px';for(const n of names.slice(0,5)){const avatar=document.createElement('span');avatar.className='fm-party-avatar';avatar.textContent=n.slice(0,1).toUpperCase();avatar.title=n;avatars.appendChild(avatar);}
      const label=document.createElement('strong');label.textContent=count+'/5';label.style.fontSize='13px';partyHud.append(avatars,label);
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
    function readProfile(){const name=menu.querySelector('#fm-profile-name')?.value??playerName,preset=menu.querySelector('#fm-profile-avatar')?.value??avatarChoice;const capeOn=menu.querySelector('#fm-cape-enabled')?.checked??!!avatarAppearance.cape;const app={shirt:parseInt((menu.querySelector('#fm-shirt')?.value||hexColour(avatarAppearance.shirt)).slice(1),16),pants:parseInt((menu.querySelector('#fm-pants')?.value||hexColour(avatarAppearance.pants)).slice(1),16),skin:parseInt((menu.querySelector('#fm-skin')?.value||hexColour(avatarAppearance.skin)).slice(1),16),cape:capeOn?parseInt((menu.querySelector('#fm-cape')?.value||'#315fba').slice(1),16):null};applyProfile(currentAccount?playerName:name,preset,app);if(currentAccount)saveUserPreferences();} 
    function profileFields(){return '';}

    function showHome(){menu.style.display='flex';const connected=!!peer&&running;menu.innerHTML=`<div class="fm-box"><div class="fm-logo">FeatherMC</div><p style="text-align:center;margin-top:-12px;color:#aec8ac">Welcome, ${escapeHTML(playerName)}</p>${connected?'<button class="fm-button" id="fm-return">Return to Server</button>':'<button class="fm-button" id="fm-single">Singleplayer & Saved Worlds</button><button class="fm-button" id="fm-multi">Multiplayer</button>'}<button class="fm-button fm-secondary" id="fm-party">Parties</button><button class="fm-button fm-secondary" id="fm-settings">Settings</button><button class="fm-button fm-secondary" id="fm-logout">Log Out</button><button class="fm-button fm-secondary" id="fm-exit">Exit Game</button></div>`;
      menu.querySelector('#fm-single')?.addEventListener('click',showWorldLibrary);menu.querySelector('#fm-multi')?.addEventListener('click',showMultiplayer);menu.querySelector('#fm-party').onclick=showParty;menu.querySelector('#fm-settings').onclick=()=>showSettings('home');
      menu.querySelector('#fm-return')?.addEventListener('click',()=>{paused=false;menu.style.display='none';try{renderer.domElement.requestPointerLock();}catch(e){}});
      menu.querySelector('#fm-logout').onclick=async()=>{await saveCurrentWorld();partyReset();presencePeer?.destroy();presencePeer=null;if(isHost)broadcast({type:'closed'});disconnect();running=false;currentAccount=null;activeWorldId=null;showLogin();};
      menu.querySelector('#fm-exit').onclick=async()=>{await saveCurrentWorld();if(isHost)broadcast({type:'closed'});cleanup();ROOT.remove();};}
    function showCreateWorld(){menu.style.display='flex';menu.innerHTML=`<div class="fm-box"><div style="font-size:28px;font-weight:bold">Create World</div><label class="fm-label">World name</label><input class="fm-input" id="fm-world" value="My World"><label class="fm-label">Seed</label><input class="fm-input" id="fm-seed" placeholder="Leave blank for a random seed">${profileFields()}<label class="fm-label">Difficulty</label><select class="fm-input" id="fm-diff"><option>Peaceful</option><option>Easy</option><option selected>Normal</option><option>Hard</option></select><label class="fm-label"><input type="checkbox" id="fm-keep"> Keep Inventory on Death</label><button class="fm-button" id="fm-create">Create World</button><button class="fm-button fm-secondary" id="fm-back">Back</button></div>`;menu.querySelector('#fm-back').onclick=showHome;menu.querySelector('#fm-create').onclick=()=>startNewWorld('single',{name:menu.querySelector('#fm-world').value,seed:menu.querySelector('#fm-seed').value.trim(),difficulty:menu.querySelector('#fm-diff').value,keepInventory:menu.querySelector('#fm-keep').checked});}
    function showMultiplayer(){menu.style.display='flex';menu.innerHTML=`<div class="fm-box"><div style="font-size:28px;font-weight:bold;margin-bottom:18px">Multiplayer</div><button class="fm-button" id="fm-host">Create Server</button><button class="fm-button fm-secondary" id="fm-host-saved">Saved Hosted Worlds</button><button class="fm-button" id="fm-join">Join Server</button><button class="fm-button fm-secondary" id="fm-back">Back</button></div>`;menu.querySelector('#fm-host').onclick=showHostForm;menu.querySelector('#fm-host-saved').onclick=showWorldLibrary;menu.querySelector('#fm-join').onclick=showJoinForm;menu.querySelector('#fm-back').onclick=showHome;}
    function showHostForm(){menu.style.display='flex';menu.innerHTML=`<div class="fm-box"><div style="font-size:27px;font-weight:bold">Create Server</div><label class="fm-label">World name</label><input class="fm-input" id="fm-world" value="My World"><label class="fm-label">Seed</label><input class="fm-input" id="fm-seed" value="${Math.floor(Math.random()*9999999)}">${profileFields()}<label class="fm-label">Difficulty</label><select class="fm-input" id="fm-diff"><option>Peaceful</option><option>Easy</option><option selected>Normal</option><option>Hard</option></select><div class="fm-row"><label class="fm-label"><input type="checkbox" id="fm-mobs" checked> Mobs</label><label class="fm-label"><input type="checkbox" id="fm-pvp"> PvP</label><label class="fm-label"><input type="checkbox" id="fm-chat" checked> Chat</label></div><label class="fm-label"><input type="checkbox" id="fm-keep"> Keep Inventory on Death</label><button class="fm-button" id="fm-create">Create Server</button><button class="fm-button fm-secondary" id="fm-back">Back</button><div class="fm-small">A unique server ID will be generated automatically.</div></div>`;menu.querySelector('#fm-back').onclick=showMultiplayer;menu.querySelector('#fm-create').onclick=()=>startNewWorld('server',{name:menu.querySelector('#fm-world').value,seed:menu.querySelector('#fm-seed').value.trim(),difficulty:menu.querySelector('#fm-diff').value,mobs:menu.querySelector('#fm-mobs').checked,pvp:menu.querySelector('#fm-pvp').checked,chat:menu.querySelector('#fm-chat').checked,keepInventory:menu.querySelector('#fm-keep').checked});}
    function showJoinForm(){menu.style.display='flex';menu.innerHTML=`<div class="fm-box"><div style="font-size:27px;font-weight:bold">Join Server</div><label class="fm-label">Server ID</label><input class="fm-input" id="fm-code" maxlength="100" placeholder="e.g. AB">${profileFields()}<button class="fm-button" id="fm-join">Join</button><button class="fm-button fm-secondary" id="fm-back">Back</button></div>`;menu.querySelector('#fm-back').onclick=showMultiplayer;menu.querySelector('#fm-join').onclick=()=>{const code=menu.querySelector('#fm-code').value.trim();if(!(/^[a-zA-Z]{2}$/.test(code)||code.length>=5&&code.length<=100)){showMenuMessage('Enter the two-letter server ID (or a legacy full ID).');return;}readProfile();menu.querySelector('#fm-join').disabled=true;menu.querySelector('#fm-join').textContent='Connecting...';ensurePeer(()=>joinServer(code));};}
    function displayKey(code){return ({Space:'SPACE',ShiftLeft:'LEFT SHIFT',ShiftRight:'RIGHT SHIFT',ControlLeft:'LEFT CTRL',ControlRight:'RIGHT CTRL',AltLeft:'LEFT ALT',AltRight:'RIGHT ALT',Slash:'/'}[code]||String(code).replace(/^Key/,'').replace(/^Digit/,'').replace(/^Arrow/,'ARROW '));}
    function showSettings(from){settingsReturn=from;menu.style.display='flex';const labels={forward:'Move forward',back:'Move backward',left:'Move left',right:'Move right',jump:'Jump',sprint:'Sprint',crouch:'Crouch',inventory:'Inventory',chat:'Chat'};menu.innerHTML=`<div class="fm-box"><div style="font-size:28px;font-weight:bold">Settings</div><label class="fm-label">Render distance: <b id="fm-rv">${renderDistance}</b> chunks</label><input class="fm-input" id="fm-r" type="range" min="1" max="20" value="${renderDistance}"><label class="fm-label">Field of view: <b id="fm-fv">${fov}</b></label><input class="fm-input" id="fm-f" type="range" min="60" max="110" value="${fov}"><label class="fm-label">Mouse sensitivity: <b id="fm-sv">${sensitivity.toFixed(1)}</b></label><input class="fm-input" id="fm-s" type="range" min=".2" max="3" step=".1" value="${sensitivity}"><label class="fm-label">Creative fly speed: <b id="fm-fly-speed-value">${flySpeed.toFixed(1)}</b> blocks/sec</label><input class="fm-input" id="fm-fly-speed" type="range" min="2" max="24" step=".5" value="${flySpeed}"><div class="fm-small">Creative: double-tap Space to toggle flight. Q rises, E descends, I opens inventory while flying.</div><label class="fm-label">Graphics quality</label><select class="fm-input" id="fm-q"><option ${quality==='Low'?'selected':''}>Low</option><option ${quality==='Medium'?'selected':''}>Medium</option><option ${quality==='High'?'selected':''}>High</option></select><hr style="border-color:#58645b;margin:18px 0"><b>Personal</b><label class="fm-label">Player name</label><input class="fm-input" id="fm-profile-name" maxlength="18" disabled title="Your account name cannot be changed" value="${escapeHTML(playerName)}"><label class="fm-label">Avatar style</label><select class="fm-input" id="fm-profile-avatar">${Object.keys(avatars).map(a=>`<option ${a===avatarChoice?'selected':''}>${a}</option>`).join('')}</select><div class="fm-row"><label class="fm-label">Skin<input type="color" class="fm-input" id="fm-skin" value="${hexColour(avatarAppearance.skin)}"></label><label class="fm-label">Shirt<input type="color" class="fm-input" id="fm-shirt" value="${hexColour(avatarAppearance.shirt)}"></label></div><div class="fm-row"><label class="fm-label">Trousers<input type="color" class="fm-input" id="fm-pants" value="${hexColour(avatarAppearance.pants)}"></label><label class="fm-label">Cape<input type="color" class="fm-input" id="fm-cape" value="${hexColour(avatarAppearance.cape||0x315fba)}"></label></div><label class="fm-label"><input type="checkbox" id="fm-cape-enabled" ${avatarAppearance.cape?'checked':''}> Wear cape</label><hr style="border-color:#58645b;margin:18px 0"><b>Controls</b><div class="fm-small">Click a control, then press the key you want to use. Laptop trackpads: two-finger tap is right-click; hold right-click to drag items.</div><div id="fm-bindings" style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:10px">${Object.entries(labels).map(([k,label])=>`<button class="fm-button fm-secondary" data-bind="${k}" style="margin:0;padding:9px;font-size:12px">${label}: ${displayKey(keybinds[k])}</button>`).join('')}</div><button class="fm-button fm-secondary" id="fm-reset">Reset keybinds</button><button class="fm-button" id="fm-done">Done</button></div>`;const r=menu.querySelector('#fm-r'),f=menu.querySelector('#fm-f'),ss=menu.querySelector('#fm-s');r.oninput=()=>{renderDistance=+r.value;menu.querySelector('#fm-rv').textContent=r.value;if(running){lastChunkX=null;updateChunks(true);}};f.oninput=()=>{fov=+f.value;camera.fov=fov;camera.updateProjectionMatrix();menu.querySelector('#fm-fv').textContent=fov;};ss.oninput=()=>{sensitivity=+ss.value;menu.querySelector('#fm-sv').textContent=sensitivity.toFixed(1);};const flySlider=menu.querySelector('#fm-fly-speed');flySlider.oninput=()=>{flySpeed=+flySlider.value;menu.querySelector('#fm-fly-speed-value').textContent=flySpeed.toFixed(1);};menu.querySelectorAll('[data-bind]').forEach(button=>button.onclick=()=>{waitingBind=button.dataset.bind;button.textContent=`${labels[waitingBind]}: press a key...`;});menu.querySelector('#fm-reset').onclick=()=>{Object.assign(keybinds,defaultKeybinds);showSettings(from);};menu.querySelector('#fm-done').onclick=()=>{quality=menu.querySelector('#fm-q').value;renderer.setPixelRatio(Math.min(devicePixelRatio,quality==='Low'?.55:quality==='Medium'?.8:1));renderer.setSize(innerWidth,innerHeight);readProfile();waitingBind=null;if(from==='pause')showPause();else if(from==='home'&&running)showHome();else if(running){paused=false;menu.style.display='none';}else showHome();};}
    function showPause(){if(deathPending)return;paused=true;held.left=false;held.right=false;document.exitPointerLock?.();menu.style.display='flex';menu.innerHTML=`<div class="fm-box"><div style="font-size:34px;font-weight:bold">Paused</div>${isHost?`<div class="fm-small">Server ID: <b>${roomCode}</b></div>`:''}<button class="fm-button" id="fm-resume">Resume</button><button class="fm-button fm-secondary" id="fm-settings">Settings</button>${isHost?'<button class="fm-button fm-secondary" id="fm-kick">Remove other player</button><button class="fm-button fm-secondary" id="fm-modes">Player Game Modes</button>':''}<button class="fm-button fm-secondary" id="fm-party">Parties</button><button class="fm-button fm-secondary" id="fm-save">Save World</button><button class="fm-button fm-secondary" id="fm-home">Save & Main Menu</button><button class="fm-button fm-secondary" id="fm-exit">Exit Game</button></div>`;menu.querySelector('#fm-resume').onclick=()=>{paused=false;menu.style.display='none';try{renderer.domElement.requestPointerLock();}catch(e){}};menu.querySelector('#fm-settings').onclick=()=>showSettings('pause');menu.querySelector('#fm-modes')?.addEventListener('click',showGameModePanel);menu.querySelector('#fm-party').onclick=showParty;menu.querySelector('#fm-save').onclick=async()=>{await saveCurrentWorld();showToast('World saved',worldName);};menu.querySelector('#fm-home').onclick=async()=>{held.left=false;held.right=false;paused=true;document.exitPointerLock?.();await saveCurrentWorld();if(isHost)broadcast({type:'closed'});disconnect();running=false;showHome();};menu.querySelector('#fm-exit').onclick=async()=>{await saveCurrentWorld();if(isHost)broadcast({type:'closed'});cleanup();ROOT.remove();};menu.querySelector('#fm-kick')?.addEventListener('click',()=>{for(const [id,c] of connections){c.send({type:'kicked'});c.close();connections.delete(id);removeRemote(id);}showToast('Server','Other player removed.');});}

    function showGameModePanel(){if(!isHost){showPause();return;}paused=true;menu.style.display='flex';menu.innerHTML=`<div class="fm-box"><h2>Player Game Modes</h2><div class="fm-small">Only the world host can change multiplayer modes.</div><div id="fm-mode-list"></div><button class="fm-button fm-secondary" id="fm-mode-back">Back</button></div>`;const container=menu.querySelector('#fm-mode-list');const roster=[[playerId,playerName,gameMode],...[...remotePlayers].map(([id,r])=>[id,r.model.name,r.serverMode||'Survival'])];for(const [id,name,mode] of roster){const row=document.createElement('div');row.className='fm-row';row.style.cssText='align-items:center;padding:6px 0;border-bottom:1px solid #777';const text=document.createElement('span');text.textContent=`${name} · ${mode}`;const creative=document.createElement('button');creative.className='fm-button';creative.style.padding='8px';creative.textContent='Creative';creative.onclick=()=>{runServerCommand(playerId,`/creative ${name}`);showGameModePanel();};const survival=document.createElement('button');survival.className='fm-button fm-secondary';survival.style.padding='8px';survival.textContent='Survival';survival.onclick=()=>{runServerCommand(playerId,`/uncreative ${name}`);showGameModePanel();};row.append(text,creative,survival);container.appendChild(row);}menu.querySelector('#fm-mode-back').onclick=showPause;}
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
    function clearWorld(){stopFlying();deathPending=false;deathRespawnTarget=null;deathOverlay.style.display='none';for(const key of [...farTerrain.keys()])removeFarTerrain(key);farTerrainQueue.length=0;farQueuedKeys.clear();desiredFarKeys.clear();for(const t of primedTnt.values()){scene.remove(t.mesh);t.mesh.geometry.dispose();t.mesh.material.dispose();}primedTnt.clear();sleepingPlayers.clear();playerSleeping=false;optimisticPlacements.clear();optimisticMines.clear();pickupRequests.clear();activeChunkBuild=null;activeChunkKey=null;activeMeshBuild=null;activeMeshKey=null;fluidQueue.length=0;fluidQueued.clear();flowDepth.clear();chunkQueue.length=0;queuedChunkKeys.clear();dirtyChunkQueue.length=0;dirtyChunkKeys.clear();desiredChunkKeys.clear();sandCandidateKeys.clear();sandCandidateList=[];sandCursor=0;fallingSandQueue.length=0;fallingSandQueued.clear();for(const c of chunks.values())disposeChunk(c);chunks.clear();world.clear();for(const id of [...droppedItems.keys()])removeDroppedItem(id);chestInventories.clear();chestVersions.clear();chestLastAction.clear();chestPending=null;openChestKey=null;for(const id of [...mobs.keys()])removeMob(id);for(const id of [...remotePlayers.keys()])removeRemote(id);lastChunkX=null;lastChunkZ=null;}
    function startWorld(opts={}){if(isHost)networkHostId=playerId;seedHash=hashSeed(seed);clearWorld();cloudAreaX=NaN;rebuildClouds(true);playerRecords.clear();if(opts.restore?.playerRecords)for(const [name,data] of opts.restore.playerRecords)if(typeof name==='string'&&name.length<=24){const rec=cleanPlayerRecord(data);if(rec)playerRecords.set(name.toLowerCase(),rec);}
      if(opts.network){for(const e of opts.chests||[])chestInventories.set(e[0],e[1]);for(const d of opts.drops||[])makeDropVisual(d);}inventory.fill(null);craftingGrid.fill(null);cursorStack=null;openWorkbench=false;unlocked.clear();minedCount=0;hp=20;hunger=20;oxygen=15;drownTimer=0;regenTimer=0;lastAirDisplay=-1;updateAirHud(false);if(!opts.network)mods.clear();else for(const e of opts.mods||[])mods.set(e[0],e[1]);if(opts.restore)for(const [key,type] of opts.restore.mods||[])mods.set(key,type);if(opts.restore?.pos)player.position.set(opts.restore.pos.x,opts.restore.pos.y,opts.restore.pos.z);else player.position.set(.5,18,.5);yaw=opts.restore?.yaw??0;pitch=opts.restore?.pitch??.12;velocityY=0;grounded=false;fallPeakY=18;firstPerson=true;cameraDistance=7;player.visible=false;updateChunks(true);if(!opts.restore?.pos)player.position.y=floorAt(.5,.5);spawnPoint={x:player.position.x,y:player.position.y,z:player.position.z};if(opts.network){const hostPlayer=(opts.players||[]).find(p=>p.id!==playerId);for(const p of opts.players||[]){if(p.id===playerId)continue;const r=addRemote(p.id,{name:p.name,avatar:p.avatar,appearance:p.appearance});r.state={...p};pose(r.model,r.state);}if(hostPlayer){player.position.set(hostPlayer.x+2,hostPlayer.y,hostPlayer.z);updateChunks();player.position.y=floorAt(player.position.x,player.position.z);spawnPoint={x:player.position.x,y:player.position.y,z:player.position.z};}syncMobs(opts.mobs||[]);}else spawnMobs();if(opts.restore?.drops)for(const drop of opts.restore.drops)makeDropVisual(drop);
      if(opts.network&&opts.restoredPlayer)applyPlayerRecord(opts.restoredPlayer);
      if(opts.restore){for(let i=0;i<inventory.length;i++)inventory[i]=opts.restore.inventory?.[i]||null;armour={head:null,chest:null,legs:null,feet:null,...(opts.restore.armour||{})};offhand=opts.restore.offhand||null;hp=Number.isFinite(opts.restore.hp)?opts.restore.hp:20;hunger=Number.isFinite(opts.restore.hunger)?opts.restore.hunger:20;for(const [key,data] of opts.restore.chests||[])chestInventories.set(key,data);}running=true;paused=false;inventoryOpen=false;chatOpen=false;menu.style.display='none';invOverlay.style.display='none';updateHotbar();updateHealth();info.textContent=isHost?`Server ID: ${roomCode}`:roomCode?`Server: ${roomCode}`:'';try{const lock=renderer.domElement.requestPointerLock();lock?.catch?.(()=>showLockHint());}catch(e){showLockHint();}clock.start();}
    let lockHint=null;
    function showLockHint(){
      if(!running||paused||inventoryOpen||chatOpen||document.pointerLockElement===renderer.domElement)return;
      if(!lockHint){lockHint=document.createElement('button');lockHint.textContent='Click to lock mouse and play';lockHint.style.cssText='position:absolute;z-index:24;left:50%;top:42%;transform:translate(-50%,-50%);background:#333e;color:white;border:3px solid #aaa;padding:15px 22px;font:bold 16px monospace;cursor:pointer';ROOT.appendChild(lockHint);lockHint.onclick=()=>{renderer.domElement.requestPointerLock()?.catch?.(()=>{});};}
      lockHint.style.display='block';
    }
    document.addEventListener('pointerlockchange',()=>{if(lockHint)lockHint.style.display=document.pointerLockElement===renderer.domElement?'none':(running&&!paused&&!inventoryOpen&&!chatOpen?'block':'none');});
    document.addEventListener('visibilitychange',()=>{if(!document.hidden&&running&&!paused&&!inventoryOpen&&!chatOpen&&document.pointerLockElement!==renderer.domElement)showLockHint();});
    function getPlayerState(){return{x:player.position.x,y:player.position.y,z:player.position.z,yaw,pitch,hp,moving:!!(keys.KeyW||keys.KeyA||keys.KeyS||keys.KeyD),walk:walking};}
    function sendChat(text){text=String(text||'').trim().slice(0,180);if(!text)return;if(text.startsWith('/')){if(hasAuthority())runServerCommand(playerId,text);else sendHost({type:'command',text});return;}if(!chatEnabled)return;addChat(playerName,text);if(isHost)broadcast({type:'chat',name:playerName,text});else sendHost({type:'chat',text});}
    chatInput.addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Enter'){sendChat(chatInput.value);chatInput.value='';chatOpen=false;chatInput.style.display='none';renderer.domElement.requestPointerLock();}if(e.key==='Escape'){chatOpen=false;chatInput.style.display='none';renderer.domElement.requestPointerLock();}});

    function stopFlying(){isFlying=false;lastSpaceTap=-10000;velocityY=0;fallPeakY=player.position.y;}
    function toggleCreativeFlight(){
      if(gameMode!=='Creative'||deathPending)return;
      isFlying=!isFlying;velocityY=0;grounded=false;fallPeakY=player.position.y;
      showToast('Creative flight',isFlying?'Flying · Q up · E down · I inventory':'Flight disabled');
    }
    // Inputs
    function openChat(initial=''){if(!running||paused||inventoryOpen||!chatEnabled)return;chatOpen=true;held.left=false;held.right=false;document.exitPointerLock?.();chatInput.style.display='block';chatInput.value=initial;chatInput.focus();}
    function keyDown(e){
      if(waitingBind){e.preventDefault();if(!['Escape','Tab'].includes(e.key)){keybinds[waitingBind]=e.code;waitingBind=null;showSettings(settingsReturn);}return;}
      if(!running)return;if(deathPending){if(['Escape','KeyE','Tab'].includes(e.code))e.preventDefault();return;}if(e.code==='Tab'){e.preventDefault();if(!paused&&!inventoryOpen&&!chatOpen){updatePlayerList();playerListHud.style.display='block';}return;}
      if(e.code==='Escape'){e.preventDefault();if(inventoryOpen&&chestOverlay.style.display==='flex')closeChest();else if(inventoryOpen)closeInventory();else if(chatOpen){chatOpen=false;chatInput.style.display='none';}else if(!paused)showPause();return;}
      if(e.code===keybinds.inventory&&inventoryOpen){if(chestOverlay.style.display==='flex')closeChest();else closeInventory();return;}
      if(paused||inventoryOpen||chatOpen)return;
      if(e.code==='KeyI'&&isFlying){e.preventDefault();openInventory();return;}
      if(e.code===keybinds.jump&&gameMode==='Creative'&&!e.repeat){const now=performance.now();if(now-lastSpaceTap<320){toggleCreativeFlight();lastSpaceTap=-10000;e.preventDefault();}else lastSpaceTap=now;}
      keys[e.code]=true;
      if(keybinds.crouch==='ShiftLeft'&&e.code==='ShiftRight')keys.ShiftLeft=true;
      if(keybinds.sprint==='ControlLeft'&&e.code==='ControlRight')keys.ControlLeft=true;
      if(['KeyQ','KeyE','Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','ControlLeft','ShiftLeft','ShiftRight'].includes(e.code))e.preventDefault();
      if(e.code===keybinds.jump&&!isFlying&&(grounded||playerFluid().water)){fallPeakY=player.position.y;velocityY=playerFluid().water?3.5:8;grounded=false;}
      if(e.code===keybinds.inventory&&!isFlying){const t=targetBlock();if(t&&t.type==='chest')openChest(t.key);else if(t&&t.type==='furnace')openFurnace(t.key);else openInventory();return;}
      if(e.code===keybinds.chat){openChat();return;}
      if(e.code==='Slash'||e.key==='/'){e.preventDefault();openChat('/');return;}
      if(e.code==='F5'){e.preventDefault();f5Debug=!f5Debug;debugHud.style.display=f5Debug?'block':'none';return;}
      if(e.code==='KeyV'){firstPerson=!firstPerson;player.visible=!firstPerson;return;}
      if(e.code.startsWith('Digit')){const n=Number(e.code.slice(5));if(n>=1&&n<=9){selectedSlot=n-1;updateHotbar();updateViewmodel();}}
    }
    function keyUp(e){keys[e.code]=false;if(e.code==='ShiftRight'&&keybinds.crouch==='ShiftLeft')keys.ShiftLeft=false;if(e.code==='ControlRight'&&keybinds.sprint==='ControlLeft')keys.ControlLeft=false;if(e.code==='Tab'){playerListHud.style.display='none';e.preventDefault();}}
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
    function targetBlock(){raycaster.far=6;const dir=new THREE.Vector3();camera.getWorldDirection(dir);raycaster.set(camera.position,dir);const meshes=[...chunks.values()].filter(c=>c.mesh).map(c=>c.mesh),hits=raycaster.intersectObjects(meshes,false);if(!hits.length)return null;const hit=hits.find(h=>{const nn=h.face.normal.clone().transformDirection(h.object.matrixWorld),q=h.point.clone().addScaledVector(nn,-.015);return !['water','lava'].includes(world.get(k3(Math.floor(q.x+1e-5),Math.floor(q.y+1e-5),Math.floor(q.z+1e-5))));});if(!hit)return null;const normal=hit.face.normal.clone().transformDirection(hit.object.matrixWorld),p=hit.point.clone().addScaledVector(normal,-.015);let x=Math.floor(p.x+1e-5),y=Math.floor(p.y+1e-5),z=Math.floor(p.z+1e-5),type=world.get(k3(x,y,z));if(!type){let best=null,bestD=Infinity;for(let ax=-1;ax<=1;ax++)for(let ay=-1;ay<=1;ay++)for(let az=-1;az<=1;az++){const bx=x+ax,by=y+ay,bz=z+az,t=world.get(k3(bx,by,bz));if(!t)continue;const cx=bx+.5,cy=by+.5,cz=bz+.5,d=(cx-hit.point.x)**2+(cy-hit.point.y)**2+(cz-hit.point.z)**2;if(d<bestD){bestD=d;best={x:bx,y:by,z:bz,type:t};}}if(best){({x,y,z,type}=best);}}return type?{hit,normal,x,y,z,type,key:k3(x,y,z)}:null;}
    function targetMob(){raycaster.far=3.25;const dir=new THREE.Vector3();camera.getWorldDirection(dir);raycaster.set(camera.position,dir);const objects=[...mobs.values()].filter(m=>nearEntity(m.group.position.x,m.group.position.z,8)).flatMap(m=>m.group.children);if(pvpEnabled)for(const r of remotePlayers.values())if(nearEntity(r.state.x||0,r.state.z||0,8))r.model.group.traverse(o=>{if(o.isMesh)objects.push(o);});const hits=raycaster.intersectObjects(objects,false);return hits[0]||null;}
    let aimBlockCache=null,aimMobCache=null,aimCacheAt=0;function refreshAimCache(){const now=performance.now();if(now-aimCacheAt<55)return;aimCacheAt=now;aimBlockCache=targetBlock();aimMobCache=targetMob();}
    function miningDuration(type){const tool=inventory[selectedSlot]?.id;let n={grass:.38,dirt:.38,sand:.3,stone:1.25,iron_ore:1.5,diamond_ore:1.7,coal_ore:.95,oak_log:.82,oak_leaves:.2,oak_planks:.55,crafting_table:.55,furnace:.55,chest:.55}[type]||.5;const pick=['wooden_pickaxe','stone_pickaxe','iron_pickaxe','diamond_pickaxe'];if(['stone','iron_ore','diamond_ore','coal_ore','furnace'].includes(type)&&pick.includes(tool))n*=tool==='wooden_pickaxe'?.65:tool==='stone_pickaxe'?.48:tool==='iron_pickaxe'?.32:.22;if(type==='oak_log'&&['wooden_axe','stone_axe','iron_axe','diamond_axe'].includes(tool))n=tool==='wooden_axe'?.36:tool==='stone_axe'?.29:tool==='iron_axe'?.22:.16;if(type==='oak_planks'&&['wooden_axe','stone_axe','iron_axe','diamond_axe'].includes(tool))n*=.45;return n;}
    function mineTarget(t,dt){if(!t||t.type==='water'||t.type==='lava'||t.type==='bedrock'){miningKey=null;miningProgress=0;progressFill.style.width='0%';crackMesh.visible=false;return;}if(pendingMine&&pendingMine!==t.key)pendingMine=null;if(pendingMine===t.key){if(performance.now()-pendingMineAt<1800){progressFill.style.width='100%';return;}pendingMine=null;miningKey=null;miningProgress=0;}if(miningKey!==t.key){miningKey=t.key;miningProgress=0;}const fast=gameMode==='Creative';miningProgress+=dt/(fast?.04:miningDuration(t.type));mineSwingPhase+=dt*13;progressFill.style.width=`${Math.min(100,miningProgress*100)}%`;crackMesh.visible=!fast;crackMesh.position.set(t.x+.5,t.y+.5,t.z+.5);crackMesh.material=crackMats[Math.min(9,Math.floor(miningProgress*10))];if(miningProgress>=1){let sent=false;if(hasAuthority())sent=hostMine(t.x,t.y,t.z,playerId);else if(sendHost({type:'mine',x:t.x,y:t.y,z:t.z})){optimisticMines.set(t.key,{x:t.x,y:t.y,z:t.z,block:t.type,at:performance.now()});changeBlock(t.x,t.y,t.z,null);flushNearbyMesh(t.x,t.z);pendingMine=t.key;pendingMineAt=performance.now();sent=true;}if(!sent){miningKey=null;miningProgress=0;}else if(hasAuthority()){miningKey=null;miningProgress=0;}progressFill.style.width='0%';crackMesh.visible=false;}}
    function placeTarget(t){if(!t||placeCooldown>0)return;if(t.type==='crafting_table'){openInventory(true);placeCooldown=.20;return;}if(t.type==='chest'){openChest(t.key);placeCooldown=.20;return;}if(t.type==='red_bed'){tryUseBed(t);placeCooldown=.35;return;}if(t.type==='tnt'&&inventory[selectedSlot]?.id==='flint_and_steel'){if(hasAuthority())primeTNT(t.x,t.y,t.z);else sendHost({type:'igniteTnt',x:t.x,y:t.y,z:t.z});placeCooldown=.5;return;}const s=inventory[selectedSlot];if(!s)return;if(['bucket','water_bucket','lava_bucket'].includes(s.id)){useBucketAt(t);return;}if(!placeable.includes(s.id)||s.id==='water'||s.id==='lava')return;const x=t.x+Math.round(t.normal.x),y=t.y+Math.round(t.normal.y),z=t.z+Math.round(t.normal.z);if(world.has(k3(x,y,z))||overlaps(x,y,z,player.position)||!chunks.has(ck(Math.floor(x/16),Math.floor(z/16))))return;if(hasAuthority())hostPlace(x,y,z,s.id,playerId,selectedSlot);
      else if((sendHost({type:'state',state:playerState()}),sendHost({type:'place',x,y,z,block:s.id,slot:selectedSlot}))){
        // Predict placement locally. The authoritative host can reject and roll it back.
        const key=k3(x,y,z);optimisticPlacements.set(key,{x,y,z,block:s.id,original:world.get(key)||null,slot:selectedSlot,used:gameMode!=='Creative',at:performance.now()});
        changeBlock(x,y,z,s.id);
        if(gameMode!=='Creative'){s.count--;if(s.count<=0)inventory[selectedSlot]=null;updateHotbar();}
      }placeAnim=.22;placeCooldown=.22;}
    function eatSelected(){if(placeCooldown>0)return false;const s=inventory[selectedSlot];if(!s||!['raw_porkchop','cooked_porkchop','apple','golden_apple','enchanted_golden_apple'].includes(s.id)||gameMode==='Creative')return false;if(hunger>=20&&hp>=20)return false;hunger=Math.min(20,hunger+({'raw_porkchop':3,'cooked_porkchop':8,'apple':4,'golden_apple':8,'enchanted_golden_apple':8}[s.id]||3));if(s.id.includes('golden_apple'))hp=Math.min(20,hp+(s.id==='enchanted_golden_apple'?8:4));updateHealth();s.count--;if(s.count<=0)inventory[selectedSlot]=null;updateHotbar();updateHunger();eatAnim=.55;placeCooldown=.55;return true;}
    function tryHit(){const hit=targetMob();if(!hit)return;const mob=hit.object.userData.mob,remoteId=hit.object.userData.remotePlayer;const critical=attackCharge>=.848&&velocityY<-.1&&!keys[keybinds.sprint],weapon=inventory[selectedSlot]?.id||'',sword=weapon.endsWith('_sword');if(mob){if(hasAuthority())damageMob(mob,playerId,critical,sword);else sendHost({type:'hitMob',id:mob.id,critical,sword,charge:attackCharge});}else if(remoteId&&pvpEnabled){if(isHost){const factor=difficulty==='Hard'?1.35:difficulty==='Easy'?.8:1;if(allowAttack(playerId))damageRemote(remoteId,attackDamage(playerId,critical,attackCharge),player.position);}else sendHost({type:'hitPlayer',id:remoteId,critical,sword,charge:attackCharge});}else return;attackCharge=0;attackCooldown=.24;attackAnim=.24;localAvatar.rightArm.rotation.x=-1.35;if(critical)showToast('Critical Hit','');}

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
    const backgroundSimulation=setInterval(()=>{
      if(!ROOT.isConnected||!running||!isHost||!connections.size||(!paused&&!document.hidden))return;
      const dt=.05;
      updateDroppedItems(dt);updateFallingSand(dt);updateFlowingWater(dt);updateMobs(dt);
      dropSyncTimer+=dt;lastMobSync+=dt;
      if(dropSyncTimer>=.48){dropSyncTimer=0;sendDropSnapshots();}
      if(lastMobSync>=.30){lastMobSync=0;for(const [id,conn] of connections){const r=remotePlayers.get(id);if(!r||!conn.open)continue;conn.send({type:'mobs',list:mobSnapshot().filter(m=>Math.hypot(m.x-r.state.x,m.z-r.state.z)<=Math.min(ENTITY_MAX_DISTANCE,r.state.entityDistance||48))});}}
    },50);
    function cleanup(){clearInterval(backgroundSimulation);saveCurrentWorld();partyReset();try{presencePeer?.destroy();}catch(e){}running=false;paused=false;fallbackLook=false;document.exitPointerLock?.();disconnect();window.removeEventListener('keydown',keyDown);window.removeEventListener('keyup',keyUp);window.removeEventListener('mouseup',mouseUp);for(const c of chunks.values())disposeChunk(c);renderer.dispose();}
    let lastRenderAt=0,lastPartyDraw=0;function frame(){
      if(!ROOT.isConnected)return;requestAnimationFrame(frame);if(!running)return;const now=performance.now(),frameLimit=quality==='Low'?1000/45:quality==='Medium'?1000/60:1000/75;if(now-lastRenderAt<frameLimit)return;lastRenderAt=now;const dt=clock.delta();
      if(!paused){
        const controlsActive=!paused&&!inventoryOpen&&!chatOpen&&!deathPending;
        let f=controlsActive?((keys[keybinds.forward]?1:0)-(keys[keybinds.back]?1:0)):0,s=controlsActive?((keys[keybinds.right]?1:0)-(keys[keybinds.left]?1:0)):0,moving=!!(f||s);const fluid=playerFluid(),sprinting=!!keys[keybinds.sprint]&&!keys[keybinds.crouch]&&hunger>6&&!fluid.water&&!fluid.lava&&f>0;
        if(moving){const len=Math.hypot(f,s);f/=len;s/=len;const crouching=!!keys[keybinds.crouch];const sp=(isFlying?flySpeed*(sprinting?1.6:1):crouching?1.9:sprinting?6.5:5.2)*(isFlying?1:fluid.water?.62:1);const dx=(-Math.sin(yaw)*f+Math.cos(yaw)*s)*sp*dt,dz=(-Math.cos(yaw)*f-Math.sin(yaw)*s)*sp*dt,nx=player.position.x+dx,nz=player.position.z+dz;if(!collides(nx,player.position.y,player.position.z)&&(!crouching||!grounded||floorAt(nx,player.position.z,player.position.y+.15)>=player.position.y-.12))player.position.x=nx;if(!collides(player.position.x,player.position.y,nz)&&(!crouching||!grounded||floorAt(player.position.x,nz,player.position.y+.15)>=player.position.y-.12))player.position.z=nz;walking+=dt*(sprinting?13:10);}
        if(Math.abs(knockbackX)+Math.abs(knockbackZ)>.01){const nx=player.position.x+knockbackX*dt,nz=player.position.z+knockbackZ*dt;if(!collides(nx,player.position.y,player.position.z))player.position.x=nx;if(!collides(player.position.x,player.position.y,nz))player.position.z=nz;knockbackX*=Math.max(0,1-dt*6);knockbackZ*=Math.max(0,1-dt*6);}
        if(isFlying&&gameMode!=='Creative')stopFlying();
        if(isFlying){
          velocityY=0;grounded=false;fallPeakY=player.position.y;
          const v=controlsActive?((keys.KeyQ?1:0)-(keys.KeyE?1:0))*flySpeed*dt:0;
          if(v&&!collides(player.position.x,player.position.y+v,player.position.z))player.position.y+=v;
        }else{
          const wasGrounded=grounded,currentY=player.position.y;if(wasGrounded)fallPeakY=currentY;
          const inWater=playerFluid().water;if(inWater){if(controlsActive&&keys[keybinds.jump])velocityY=Math.min(4.2,velocityY+11*dt);else velocityY=Math.max(-1.8,velocityY-3.2*dt);}else velocityY-=22*dt;
          const next=player.position.y+velocityY*dt,floor=floorAt(player.position.x,player.position.z,currentY+.05);
          if(velocityY<=0&&next<=floor){const fallDistance=Math.max(0,fallPeakY-floor);player.position.y=floor;velocityY=0;grounded=true;const landingInWater=playerFluid().water||fluidAt(player.position.x,floor-.05,player.position.z)==='water';if(!wasGrounded&&!landingInWater&&gameMode!=='Creative'&&difficulty!=='Peaceful'&&fallDistance>3)damagePlayer(Math.ceil(fallDistance-3),true,'fall');fallPeakY=floor;}
          else if(collides(player.position.x,next,player.position.z)){velocityY=0;}
          else{player.position.y=next;grounded=false;fallPeakY=Math.max(fallPeakY,next);}
        }
        updateChunks();processChunkQueue();processFarTerrain();player.rotation.y=yaw;localAvatar.head.rotation.x=THREE.MathUtils.clamp(pitch,-1.1,1.1);viewmodel.visible=firstPerson&&!paused&&!inventoryOpen&&!chatOpen;placeAnim=Math.max(0,placeAnim-dt);eatAnim=Math.max(0,eatAnim-dt);
        const miningMotion=held.left&&miningKey?Math.sin(mineSwingPhase)*.42:0;
        const placingMotion=placeAnim>0?Math.sin((1-placeAnim/.22)*Math.PI)*.55:0;
        const eatingMotion=eatAnim>0?Math.sin((1-eatAnim/.55)*Math.PI*4)*.16:0;
        const bob=moving?Math.sin(walking)*.035:0;
        vmArm.rotation.x=attackAnim>0?-.65:miningMotion-placingMotion+eatingMotion+bob;
        vmHeld.rotation.x=-.25; // Arm parent now drives the item's motion.
        viewmodel.position.set(sprinting?-.025:0,sprinting?-.07:0,sprinting?-.09:0);const sw=moving&&(grounded||isFlying)?Math.sin(walking)*(isFlying?.25:.5):0;localAvatar.leftLeg.rotation.x=sw;localAvatar.rightLeg.rotation.x=-sw;localAvatar.leftArm.rotation.x=-sw;localAvatar.rightArm.rotation.x=sw;poseCrouch(localAvatar,!!keys[keybinds.crouch]);if(attackAnim>0){attackAnim=Math.max(0,attackAnim-dt);localAvatar.rightArm.rotation.x=-1.35*(attackAnim/.24);}
        const targetFov=fov+(sprinting?5:0);camera.fov+= (targetFov-camera.fov)*Math.min(1,dt*5);camera.updateProjectionMatrix();const eye=new THREE.Vector3(player.position.x,player.position.y+(keys[keybinds.crouch]?1.28:1.62),player.position.z),dir=new THREE.Vector3(-Math.sin(yaw)*Math.cos(pitch),Math.sin(pitch),-Math.cos(yaw)*Math.cos(pitch));if(firstPerson){camera.position.copy(eye);camera.lookAt(eye.clone().add(dir));}else{camera.position.copy(cameraSafePosition(eye,eye.clone().addScaledVector(dir,-cameraDistance)));camera.lookAt(eye);}
        const currentWeapon=inventory[selectedSlot]?.id||'',attackRate=currentWeapon.endsWith('_sword')?1.6:currentWeapon.endsWith('_axe')?.9:currentWeapon.endsWith('_pickaxe')?1.2:4;attackCharge=Math.min(1,attackCharge+dt*attackRate);meter.style.width=`${attackCharge*100}%`;placeCooldown=Math.max(0,placeCooldown-dt);attackCooldown=Math.max(0,attackCooldown-dt);
        if(gameMode!=='Creative'&&difficulty!=='Peaceful'){foodTimer+=dt;starveTimer+=dt;regenTimer+=dt;if(foodTimer>=12){foodTimer-=12;hunger=Math.max(0,hunger-1);updateHunger();}if(hunger>=18&&hp<20&&regenTimer>=4){regenTimer=0;hp=Math.min(20,hp+1);updateHealth();}if(hunger===0&&starveTimer>=5){starveTimer=0;damagePlayer(1,false,'starve');}} 
        if(isHost||!peer){worldTime=(worldTime+dt/dayLength)%1;if(isHost&&connections.size&&Math.floor(worldTime*20)!==Math.floor((worldTime-dt/dayLength)*20))broadcast({type:'worldSettings',worldTime,weather,difficulty,dayLength,keepInventory});}const sunAngle=worldTime*Math.PI*2-Math.PI/2;sun.position.set(Math.cos(sunAngle)*55,Math.sin(sunAngle)*55,20);const daylight=Math.max(.12,Math.sin(sunAngle)*.5+.5);const px=Math.floor(player.position.x),pz=Math.floor(player.position.z),surface=heightAt(px,pz),depth=Math.max(0,surface-player.position.y-3),darkness=THREE.MathUtils.clamp(depth/42,0,1);const holdingTorch=inventory[selectedSlot]?.id==='torch'||offhand?.id==='torch';hemisphere.intensity=THREE.MathUtils.lerp(1.5,.10,darkness)+(holdingTorch?.55:0);sun.intensity=THREE.MathUtils.lerp(.15+daylight*1.5,.008,darkness);scene.background.setHSL(.56,.48,THREE.MathUtils.lerp(.12+daylight*.43,holdingTorch?.075:.008,darkness));scene.fog.color.copy(scene.background);scene.fog.near=THREE.MathUtils.lerp(30,5,darkness);scene.fog.far=THREE.MathUtils.lerp(Math.max(110,Math.min(360,renderDistance*16+35)),35,darkness);handTorchLight.position.set(camera.position.x,camera.position.y-.2,camera.position.z);handTorchLight.intensity=holdingTorch?1.5:0;rebuildClouds();cloudGroup.position.x=Math.sin(now*.000025)*4;cloudGroup.position.z=Math.cos(now*.000025)*4;weatherParticles.visible=weather==='Rain';if(cloudGroup.children[0]?.material?.color)cloudGroup.children[0].material.color.setHex(weather==='Rain'?0x929aa5:0xffffff);if(weather==='Rain'){weatherParticles.position.set(camera.position.x,camera.position.y-8,camera.position.z);const a=weatherParticles.geometry.attributes.position.array;for(let i=0;i<a.length;i+=6){a[i+1]-=dt*24;a[i+4]=a[i+1]-.72;a[i+3]=a[i]+.12;a[i+5]=a[i+2]+.04;if(a[i+1]<-8){a[i]=(Math.random()-.5)*76;a[i+1]=34+Math.random()*12;a[i+2]=(Math.random()-.5)*76;a[i+3]=a[i]+.12;a[i+4]=a[i+1]-.72;a[i+5]=a[i+2]+.04;}}weatherParticles.geometry.attributes.position.needsUpdate=true;} 
        updateBreathing(dt);const feetType=world.get(k3(Math.floor(player.position.x),Math.floor(player.position.y),Math.floor(player.position.z))),bodyFluid=playerFluid();if((feetType==='lava'||bodyFluid.lava)&&gameMode!=='Creative'){lavaDamageTimer+=dt;if(lavaDamageTimer>=1){lavaDamageTimer=0;damagePlayer(4,true,'lava');}}else lavaDamageTimer=0;if(f5Debug){debugHud.textContent=`FeatherMC\nXYZ: ${player.position.x.toFixed(2)} / ${player.position.y.toFixed(2)} / ${player.position.z.toFixed(2)}\nChunk: ${Math.floor(player.position.x/16)}, ${Math.floor(player.position.z/16)}\nFPS: ${Math.round(clock.fps)}\nPlayers: ${remotePlayers.size+1}/5\nMode: ${gameMode}${isFlying?' (Flying)':''}`;}
        if(controlsActive&&(document.pointerLockElement===renderer.domElement||(!paused&&!inventoryOpen&&!chatOpen))){refreshAimCache();const t=aimBlockCache,mh=aimMobCache;outline.visible=!!t;if(t)outline.position.set(t.x+.5,t.y+.5,t.z+.5);if(held.left){if(mh&&(!t||mh.distance<t.hit.distance)){miningKey=null;miningProgress=0;progressFill.style.width='0%';crackMesh.visible=false;if(attackCooldown<=0)tryHit();}else mineTarget(t,dt);}else{miningKey=null;miningProgress=0;progressFill.style.width='0%';crackMesh.visible=false;}if(held.right){if(!eatSelected())placeTarget(t);else placeCooldown=.35;}}else{outline.visible=false;crackMesh.visible=false;}
        if(!isHost||!document.hidden){updateDroppedItems(dt);updateFallingSand(dt);updateFlowingWater(dt);updateTntFuses(dt);}
        if(isHost){dropSyncTimer+=dt;if(dropSyncTimer>.48){dropSyncTimer=0;sendDropSnapshots();}}
        if(hasAuthority()){if(!isHost||!document.hidden)updateMobs(dt);if(isHost){lastMobSync+=dt;if(lastMobSync>.30){lastMobSync=0;
          for(const [id,conn] of connections){const r=remotePlayers.get(id);if(!r||!conn.open)continue;
            const list=mobSnapshot().filter(m=>Math.hypot(m.x-r.state.x,m.z-r.state.z)<=Math.min(ENTITY_MAX_DISTANCE,r.state.entityDistance||48));
            conn.send({type:'mobs',list});
          }
        }}}else{
          for(const m of mobs.values())if(m.hitTimer>0){m.hitTimer-=dt;if(m.hitTimer<=0)clearMobFlash(m);}
        }
        if(isHost&&now-lastRemoteChunkPrune>4500){lastRemoteChunkPrune=now;pruneUnseenChunks();}
        if(!isHost&&hostConn?.open&&!deathPending){lastPlayerDataSend+=dt;if(lastPlayerDataSend>2){lastPlayerDataSend=0;sendHost({type:'playerData',record:playerInventoryRecord()});}}
        lastNetSend+=dt;if(lastNetSend>.12){lastNetSend=0;if(isHost&&connections.size)broadcast({type:'state',id:playerId,state:playerState()});else if(!isHost&&hostConn?.open)sendHost({type:'state',state:playerState()});}
        for(const [key,p] of [...optimisticPlacements]){
        if(now-(p.at||0)<3200)continue;
        optimisticPlacements.delete(key);
        if(world.get(key)===p.block)changeBlock(p.x,p.y,p.z,p.original||null);
        if(p.used){const stack=inventory[p.slot];if(stack?.id===p.block)stack.count++;else addItem(p.block,1);updateHotbar();}
      }
      for(const [key,p] of [...optimisticMines]){
        if(now-(p.at||0)<3200)continue;
        optimisticMines.delete(key);
        if(chunks.has(ck(Math.floor(p.x/16),Math.floor(p.z/16)))&&world.get(key)===undefined)changeBlock(p.x,p.y,p.z,p.block);
      }
      if(chestPending&&now-chestPending.at>4500){chestPending=null;if(openChestKey&&chestOverlay.style.display==='flex')openChest(openChestKey,false);}
      for(const r of remotePlayers.values()){
        const x=r.state.x||0,z=r.state.z||0;
        r.model.group.visible=nearEntity(x,z);
        if(r.model.group.visible)pose(r.model,r.state);
        if(r.hitUntil&&performance.now()>r.hitUntil){setAvatarTint(r.model,false);r.hitUntil=0;}}
        if(now-lastPartyDraw>700){lastPartyDraw=now;updatePartyHud();}
        if(toastTimer>0){toastTimer-=dt;if(toastTimer<=0)toast.style.display='none';}
      }
      if(running&&activeWorldId&&Date.now()-lastSaveAt>12000)saveCurrentWorld();
      for(const m of mobs.values()){m.group.visible=nearEntity(m.group.position.x,m.group.position.z);if(m.group.visible)animateMobLegs(m,dt);}
      renderer.render(scene,camera);
    }
    window.addEventListener('resize',()=>{if(!ROOT.isConnected)return;camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
    window.__featherMCCleanup=()=>{saveCurrentWorld();cleanup();ROOT.remove();};window.addEventListener('pagehide',()=>{saveCurrentWorld(true);});updateHotbar();updateHealth();showLogin();frame();
  }
})();
