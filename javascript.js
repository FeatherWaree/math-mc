(() => {
  const ID = 'sparx-3d-game';
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
      .fm-screen{position:absolute;inset:0;z-index:30;display:flex;align-items:center;justify-content:center;background:#000b;color:#fff}
      .fm-box{width:min(440px,92vw);max-height:92vh;overflow:auto;padding:24px;background:#172019f2;border:2px solid #758477;box-shadow:0 12px 45px #0009}
      .fm-logo{text-align:center;font-size:48px;font-weight:1000;letter-spacing:2px;text-shadow:4px 4px #222;margin:5px 0 25px}
      .fm-button{display:block;width:100%;padding:13px;margin:9px 0;border:2px solid #29431f;background:#579b3b;color:white;font-weight:bold;font-size:16px;box-shadow:0 3px #1e3119}
      .fm-button:hover{background:#70b84b}.fm-secondary{background:#555e58;border-color:#333;box-shadow:0 3px #222}
      .fm-input{width:100%;padding:11px;margin:7px 0;border:2px solid #777;background:#eee;color:#222}.fm-label{display:block;text-align:left;margin-top:12px;font-size:13px;color:#ddd}.fm-row{display:flex;gap:10px}.fm-row>*{flex:1;min-width:0}.fm-small{color:#bbb;font-size:12px;line-height:1.45}
      .fm-crosshair{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:16px;height:16px;z-index:8;pointer-events:none}
      .fm-hotbar{position:absolute;left:50%;bottom:18px;transform:translateX(-50%);display:flex;gap:3px;z-index:8;pointer-events:none}
      .fm-slot{width:48px;height:48px;position:relative;display:flex;align-items:center;justify-content:center;background:#222b;border:2px solid #999;box-shadow:inset 2px 2px #ffffff25,inset -2px -2px #0008}
      .fm-slot.selected{width:52px;height:52px;margin-top:-2px;border:3px solid white;background:#ffffff55}.fm-item-icon{width:25px;height:25px;border:2px solid #ffffff70;box-shadow:inset -3px -3px #0003;image-rendering:pixelated}
      .fm-slot-number{position:absolute;top:1px;left:3px;color:white;font-size:9px;text-shadow:1px 1px black}.fm-item-count{position:absolute;right:3px;bottom:0;color:white;font-size:12px;font-weight:bold;text-shadow:2px 2px black}
      .fm-health{position:absolute;left:50%;bottom:76px;transform:translateX(-50%);display:flex;gap:2px;z-index:8;pointer-events:none}.fm-heart{width:18px;height:18px;image-rendering:pixelated;filter:drop-shadow(1px 1px 1px #000)}
      .fm-heart.damage{animation:fm-hit .38s ease-in-out 2}.fm-heart.low{animation:fm-low .8s steps(2,end) infinite}@keyframes fm-hit{0%,100%{transform:translateY(0) scale(1);opacity:1}25%{transform:translateY(-4px) scale(1.16);opacity:.4}60%{transform:translateY(1px) scale(.9);opacity:1}}@keyframes fm-low{50%{opacity:.45}}
      .fm-overlay{position:absolute;inset:0;display:none;align-items:center;justify-content:center;z-index:25;background:#0009}.fm-inventory{width:min(850px,95vw);max-height:92vh;overflow:auto;padding:20px;background:#c6c6c6;border:4px solid #eee;border-right-color:#555;border-bottom-color:#555;color:#222;box-shadow:0 10px 40px #0008}
      .fm-inv-grid{display:grid;grid-template-columns:repeat(9,minmax(22px,1fr));gap:4px}.fm-inv-slot{aspect-ratio:1;min-width:0;position:relative;display:flex;align-items:center;justify-content:center;background:#777;border:3px solid #eee;border-right-color:#444;border-bottom-color:#444}.fm-inv-slot.selected{outline:3px solid #f1d77b}.fm-inv-slot .fm-item-icon{width:62%;height:62%}.fm-inv-slot .fm-item-count{right:2px;bottom:0}
      .fm-craft-grid{display:grid;grid-template-columns:repeat(3,38px);gap:4px}.fm-craft-cell{width:38px;height:38px;position:relative;display:flex;align-items:center;justify-content:center;background:#777;border:3px solid #eee;border-right-color:#444;border-bottom-color:#444}.fm-craft-output{width:42px;height:42px;margin-left:8px;background:#777;border:3px solid #eee;border-right-color:#444;border-bottom-color:#444;display:flex;align-items:center;justify-content:center}
      .fm-chat{position:absolute;right:14px;top:14px;width:min(360px,75vw);z-index:12;color:white;pointer-events:none;text-shadow:1px 1px black}.fm-chat-log{max-height:190px;overflow:hidden;font-size:13px;line-height:1.5;background:#0005;padding:6px}.fm-chat-input{display:none;width:100%;padding:9px;border:1px solid #ddd;background:#111d;color:white;pointer-events:auto;outline:none}
      .fm-toast{position:absolute;top:14%;left:50%;transform:translateX(-50%);z-index:15;display:none;padding:12px 18px;min-width:220px;color:white;background:#242d29ee;border:2px solid #b5a45d;box-shadow:0 4px 15px #0008;text-align:center;pointer-events:none}.fm-toast strong{display:block;color:#f0d77c;margin-bottom:3px}
      .fm-meter-wrap{position:absolute;left:50%;bottom:136px;transform:translateX(-50%);width:104px;height:7px;background:#0009;border:1px solid #fff8;z-index:8;pointer-events:none}.fm-meter{height:100%;width:0;background:#f5d66b}.fm-progress-wrap{position:absolute;left:50%;top:calc(50% + 18px);transform:translateX(-50%);width:100px;height:5px;background:#0009;z-index:8;pointer-events:none}.fm-progress{height:100%;width:0;background:white}
      .fm-info{position:absolute;left:14px;top:14px;color:white;text-shadow:2px 2px black;z-index:8;pointer-events:none;font-size:13px}
      @media(max-width:650px){.fm-logo{font-size:36px}.fm-slot{width:34px;height:38px}.fm-slot.selected{width:38px;height:42px}.fm-hotbar{gap:2px}.fm-heart{width:15px;height:15px}.fm-inventory{padding:10px}.fm-inv-grid{gap:2px}}
    `;
    ROOT.appendChild(style);

    // -------------------- data and runtime state --------------------
    const items = {
      grass:['Grass Block','#55a63c'], dirt:['Dirt','#79502b'], stone:['Stone','#888888'],
      oak_log:['Oak Log','#80502c'], oak_leaves:['Oak Leaves','#267b32'], sand:['Sand','#d9c17a'],
      oak_planks:['Oak Planks','#bc8a50'], crafting_table:['Crafting Table','#90613a'],
      stick:['Stick','#aa8150'], wooden_pickaxe:['Wooden Pickaxe','#a37b42'],
      wooden_axe:['Wooden Axe','#a37b42'], wooden_sword:['Wooden Sword','#a37b42'], rotten_flesh:['Rotten Flesh','#845044']
    };
    const placeable = ['grass','dirt','stone','oak_log','oak_leaves','sand','oak_planks','crafting_table'];
    const avatars = {
      Steve:{shirt:0x2464c4,pants:0x303b75,skin:0xe0aa78}, Alex:{shirt:0xd47c36,pants:0x447245,skin:0xe0aa78},
      Knight:{shirt:0x727b88,pants:0x343c49,skin:0xd9a77f}, Explorer:{shirt:0x477e55,pants:0x604b39,skin:0xc99062}
    };
    let running=false,paused=false,inventoryOpen=false,chatOpen=false,isHost=false;
    let peer=null,hostConn=null,roomCode='',playerId='local',playerName='Falleen',avatarChoice='Steve';
    let worldName='My World',seed='12345',seedHash=1;
    let difficulty='Normal',mobsEnabled=true,pvpEnabled=false,chatEnabled=true;
    let renderDistance=2,fov=75,sensitivity=1,firstPerson=true,cameraDistance=7,yaw=0,pitch=.12,velocityY=0,grounded=false,walking=0;
    let hp=20,lastHp=20,attackCharge=1,attackCooldown=0,miningKey=null,miningProgress=0,placeCooldown=0,pendingMine=null,pendingMineAt=0;
    let mobSpawnTimer=0,lastMobSync=0,lastNetSend=0,lastChunkX=null,lastChunkZ=null,mobCounter=1,minedCount=0,toastTimer=0;
    const inventory=Array(36).fill(null),craftingGrid=Array(9).fill(null),unlocked=new Set(),keys={},held={left:false,right:false};
    let selectedSlot=0,craftingSize=2,cursorStack=null,spawnPoint={x:.5,y:8,z:.5};
    const chunks=new Map(),world=new Map(),mods=new Map(),mobs=new Map(),connections=new Map(),remotePlayers=new Map();
    const hasAuthority=()=>isHost||!peer;
    function ensurePeer(callback){if(window.Peer){callback();return;}const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/peerjs@1.5.5/dist/peerjs.min.js';s.onload=()=>{if(window.Peer)callback();else showMenuMessage('Multiplayer library did not load.');};s.onerror=()=>showMenuMessage('Multiplayer is blocked because PeerJS could not load.');document.head.appendChild(s);}

    // -------------------- Three.js scene --------------------
    const scene=new THREE.Scene();scene.background=new THREE.Color(0x87ceeb);scene.fog=new THREE.Fog(0x87ceeb,30,110);
    const camera=new THREE.PerspectiveCamera(fov,innerWidth/innerHeight,.1,300);
    const renderer=new THREE.WebGLRenderer({antialias:false});renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;ROOT.appendChild(renderer.domElement);
    scene.add(new THREE.HemisphereLight(0xffffff,0x65734b,2));const sun=new THREE.DirectionalLight(0xffffff,1.5);sun.position.set(30,50,20);scene.add(sun);
    const blockMats={};for(const id of placeable)blockMats[id]=new THREE.MeshLambertMaterial({color:items[id][1],side:THREE.DoubleSide});
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
    const biome=(x,z)=>noise(x*.012+400,z*.012+400);
    const heightAt=(x,z)=>Math.max(3,Math.floor(4+noise(x*.04,z*.04)*8+noise(x*.13,z*.13)*3));

    function storeGenerated(x,y,z,type,c){c.blocks.set(k3(x,y,z),{x,y,z,type});world.set(k3(x,y,z),type);}
    function generateChunk(cx,cz){
      const c={cx,cz,blocks:new Map(),mesh:null};chunks.set(ck(cx,cz),c);const sx=cx*16,sz=cz*16;
      for(let lx=0;lx<16;lx++)for(let lz=0;lz<16;lz++){
        const x=sx+lx,z=sz+lz,h=heightAt(x,z),desert=biome(x,z)>.79;
        for(let y=0;y<=h;y++){let type='stone';if(y===h)type=desert?'sand':'grass';else if(y>=h-3)type=desert?'sand':'dirt';storeGenerated(x,y,z,type,c);}
      }
      for(let lx=3;lx<13;lx+=5)for(let lz=3;lz<13;lz+=5){
        const x=sx+lx,z=sz+lz;if(hash2(x+1500,z+2900)<.52||biome(x,z)>.79||Math.hypot(x,z)<7)continue;
        const h=heightAt(x,z),th=3+Math.floor(hash2(x+10,z+20)*2);
        for(let y=1;y<=th;y++)storeGenerated(x,h+y,z,'oak_log',c);
        for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++)for(let dy=0;dy<=2;dy++)if(Math.abs(dx)+Math.abs(dz)+Math.abs(dy-1)<=4)storeGenerated(x+dx,h+th+dy,z+dz,'oak_leaves',c);
      }
      for(const [key,type] of mods){const [x,y,z]=key.split(',').map(Number);if(Math.floor(x/16)!==cx||Math.floor(z/16)!==cz)continue;if(type===null){c.blocks.delete(key);world.delete(key);}else storeGenerated(x,y,z,type,c);}
    }
    function disposeChunk(c){if(c.mesh){scene.remove(c.mesh);c.mesh.geometry.dispose();c.mesh=null;}}
    function buildChunk(c){
      disposeChunk(c);const byType=placeable.map(()=>[]),normByType=placeable.map(()=>[]),idx=Object.fromEntries(placeable.map((id,i)=>[id,i]));
      for(const b of c.blocks.values())for(const f of faces){if(world.has(k3(b.x+f.n[0],b.y+f.n[1],b.z+f.n[2])))continue;const p=byType[idx[b.type]],n=normByType[idx[b.type]];for(const j of tri){const v=f.c[j];p.push(b.x-c.cx*16+v[0],b.y+v[1],b.z-c.cz*16+v[2]);n.push(...f.n);}}
      const pos=[],norm=[],geo=new THREE.BufferGeometry();let offset=0;
      for(let i=0;i<placeable.length;i++){const p=byType[i],n=normByType[i];if(!p.length)continue;geo.addGroup(offset,p.length/3,i);pos.push(...p);norm.push(...n);offset+=p.length/3;}
      if(!pos.length)return;geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setAttribute('normal',new THREE.Float32BufferAttribute(norm,3));c.mesh=new THREE.Mesh(geo,placeable.map(id=>blockMats[id]));c.mesh.position.set(c.cx*16,0,c.cz*16);scene.add(c.mesh);
    }
    function rebuildAll(){for(const c of chunks.values())buildChunk(c);}
    function removeChunk(cx,cz){const c=chunks.get(ck(cx,cz));if(!c)return;disposeChunk(c);for(const key of c.blocks.keys())world.delete(key);chunks.delete(ck(cx,cz));}
    function updateChunks(force=false){const cx=Math.floor(player.position.x/16),cz=Math.floor(player.position.z/16);if(!force&&cx===lastChunkX&&cz===lastChunkZ)return;lastChunkX=cx;lastChunkZ=cz;const keep=new Set();for(let x=-renderDistance;x<=renderDistance;x++)for(let z=-renderDistance;z<=renderDistance;z++)keep.add(ck(cx+x,cz+z));let changed=false;for(const c of [...chunks.values()])if(!keep.has(ck(c.cx,c.cz))){removeChunk(c.cx,c.cz);changed=true;}for(let x=-renderDistance;x<=renderDistance;x++)for(let z=-renderDistance;z<=renderDistance;z++)if(!chunks.has(ck(cx+x,cz+z))){generateChunk(cx+x,cz+z);changed=true;}if(changed)rebuildAll();}
    function ensureChunkAt(x,z){const cx=Math.floor(x/16),cz=Math.floor(z/16),key=ck(cx,cz);let c=chunks.get(key);if(!c){generateChunk(cx,cz);c=chunks.get(key);if(c){buildChunk(c);for(const [nx,nz] of [[cx-1,cz],[cx+1,cz],[cx,cz-1],[cx,cz+1]]){const near=chunks.get(ck(nx,nz));if(near)buildChunk(near);}}}return c;}
    function changeBlock(x,y,z,type){x=Math.floor(x);y=Math.floor(y);z=Math.floor(z);const key=k3(x,y,z),c=chunks.get(ck(Math.floor(x/16),Math.floor(z/16)));if(!c)return false;if(type===null){c.blocks.delete(key);world.delete(key);}else{c.blocks.set(key,{x,y,z,type});world.set(key,type);}mods.set(key,type);const affected=[[c.cx,c.cz]];if(x%16===0)affected.push([c.cx-1,c.cz]);if((x+1)%16===0)affected.push([c.cx+1,c.cz]);if(z%16===0)affected.push([c.cx,c.cz-1]);if((z+1)%16===0)affected.push([c.cx,c.cz+1]);for(const [a,b] of affected){const near=chunks.get(ck(a,b));if(near)buildChunk(near);}return true;}
    function groundAt(x,z){const bx=Math.floor(x),bz=Math.floor(z);for(let y=90;y>=0;y--)if(world.has(k3(bx,y,bz)))return y+1;return 0;}
    function floorAt(x,z){return Math.max(groundAt(x-.25,z-.25),groundAt(x+.25,z-.25),groundAt(x-.25,z+.25),groundAt(x+.25,z+.25));}
    function collides(x,y,z){for(let a=Math.floor(x-.3);a<=Math.floor(x+.3);a++)for(let b=Math.floor(y+.001);b<=Math.floor(y+1.799);b++)for(let c=Math.floor(z-.3);c<=Math.floor(z+.3);c++)if(world.has(k3(a,b,c)))return true;return false;}

    // Models
    function box(parent,w,h,d,mat,x,y,z){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);parent.add(m);return m;}
    function makeAvatar(name,preset){const colors=avatars[preset]||avatars.Steve,g=new THREE.Group(),body=new THREE.Group();g.add(body);const skin=new THREE.MeshLambertMaterial({color:colors.skin}),shirt=new THREE.MeshLambertMaterial({color:colors.shirt}),pants=new THREE.MeshLambertMaterial({color:colors.pants}),dark=new THREE.MeshLambertMaterial({color:0x222222});const ll=new THREE.Group();ll.position.set(-.23,.85,0);body.add(ll);box(ll,.35,.85,.4,pants,0,-.4,0);const rl=new THREE.Group();rl.position.set(.23,.85,0);body.add(rl);box(rl,.35,.85,.4,pants,0,-.4,0);box(body,.9,.9,.45,shirt,0,1.25,0);const head=new THREE.Group();head.position.set(0,2.1,0);body.add(head);box(head,.7,.7,.7,skin,0,0,0);box(head,.12,.12,.05,dark,-.17,.1,-.36);box(head,.12,.12,.05,dark,.17,.1,-.36);const la=new THREE.Group();la.position.set(-.57,1.65,0);body.add(la);box(la,.3,.9,.35,shirt,0,-.4,0);const ra=new THREE.Group();ra.position.set(.57,1.65,0);body.add(ra);box(ra,.3,.9,.35,shirt,0,-.4,0);const canvas=document.createElement('canvas');canvas.width=512;canvas.height=128;const ctx=canvas.getContext('2d');ctx.fillStyle='#0009';ctx.fillRect(0,0,512,128);ctx.font='bold 64px Arial';ctx.textAlign='center';ctx.fillStyle='white';ctx.fillText(String(name||'Player').slice(0,18),256,84);const tag=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(canvas),transparent:true,depthTest:false}));tag.scale.set(2.25,.56,1);tag.position.y=3.15;g.add(tag);return{group:g,head,leftLeg:ll,rightLeg:rl,leftArm:la,rightArm:ra,name,preset};}
    function pose(model,s){model.group.position.set(s.x||0,s.y||0,s.z||0);model.group.rotation.y=s.yaw||0;model.head.rotation.x=s.pitch||0;const swing=s.moving?Math.sin((s.walk||0)*1)*.45:0;model.leftLeg.rotation.x=swing;model.rightLeg.rotation.x=-swing;model.leftArm.rotation.x=-swing;model.rightArm.rotation.x=swing;}
    let localAvatar=makeAvatar(playerName,avatarChoice),player=localAvatar.group;scene.add(player);player.visible=false;
    function addRemote(id,data){if(remotePlayers.has(id))return remotePlayers.get(id);const model=makeAvatar(data.name||'Player',data.avatar||'Steve');model.group.traverse(o=>{if(o.isMesh)o.userData.remotePlayer=id;});scene.add(model.group);const r={id,model,state:{x:player.position.x+2,y:player.position.y,z:player.position.z,yaw:0,pitch:0,hp:20,moving:false,walk:0}};remotePlayers.set(id,r);return r;}
    function removeRemote(id){const r=remotePlayers.get(id);if(r){scene.remove(r.model.group);remotePlayers.delete(id);}}

    // HUD
    const crosshair=document.createElement('div');crosshair.className='fm-crosshair';crosshair.innerHTML='<svg width="16" height="16" viewBox="0 0 16 16"><path d="M8 1V6 M8 10V15 M1 8H6 M10 8H15" stroke="white" stroke-width="2"/><path d="M8 1V6 M8 10V15 M1 8H6 M10 8H15" stroke="black" stroke-width=".7"/></svg>';ROOT.appendChild(crosshair);
    const health=document.createElement('div');health.className='fm-health';ROOT.appendChild(health);
    function heartSVG(kind){const clip=kind==='half'?'clip-path="inset(0 50% 0 0)"':'';const color=kind==='empty'?'#555':'#e43b3b';return `<svg class="fm-heart" viewBox="0 0 18 18" shape-rendering="crispEdges"><path d="M3 2H7V3H11V2H15V4H16V8H15V10H13V12H11V14H9V16H7V14H5V12H3V10H1V4H3Z" fill="#222"/><path ${clip} d="M3 3H7V4H11V3H14V5H15V8H14V10H12V12H10V14H8V15H7V13H5V11H3V9H2V5H3Z" fill="${color}"/></svg>`;}
    function updateHealth(animated=false){health.innerHTML='';for(let i=0;i<10;i++){const v=hp-i*2,k=v>=2?'full':v>=1?'half':'empty',wrap=document.createElement('span');wrap.innerHTML=heartSVG(k);const h=wrap.firstElementChild;if(hp<=6)h.classList.add('low');if(animated&&hp<lastHp)h.classList.add('damage');health.appendChild(h);}if(animated)health.animate([{transform:'translateX(-50%) translateX(-4px)'},{transform:'translateX(-50%) translateX(4px)'},{transform:'translateX(-50%)'}],{duration:260});lastHp=hp;}
    const hotbar=document.createElement('div');hotbar.className='fm-hotbar';ROOT.appendChild(hotbar);
    function drawIcon(id){const d=document.createElement('div');d.className='fm-item-icon';d.style.background=items[id]?.[1]||'#999';return d;}
    function updateHotbar(){hotbar.innerHTML='';for(let i=0;i<9;i++){const s=inventory[i],cell=document.createElement('div');cell.className='fm-slot'+(i===selectedSlot?' selected':'');const n=document.createElement('span');n.className='fm-slot-number';n.textContent=i+1;cell.appendChild(n);if(s){cell.appendChild(drawIcon(s.id));const c=document.createElement('span');c.className='fm-item-count';c.textContent=s.count;cell.appendChild(c);}hotbar.appendChild(cell);}}
    const meterWrap=document.createElement('div');meterWrap.className='fm-meter-wrap';const meter=document.createElement('div');meter.className='fm-meter';meterWrap.appendChild(meter);ROOT.appendChild(meterWrap);
    const progressWrap=document.createElement('div');progressWrap.className='fm-progress-wrap';const progressFill=document.createElement('div');progressFill.className='fm-progress';progressWrap.appendChild(progressFill);ROOT.appendChild(progressWrap);
    const toast=document.createElement('div');toast.className='fm-toast';ROOT.appendChild(toast);function showToast(title,detail=''){toast.innerHTML=`<strong>${escapeHTML(title)}</strong>${escapeHTML(detail)}`;toast.style.display='block';toastTimer=3;}
    function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
    const info=document.createElement('div');info.className='fm-info';ROOT.appendChild(info);
    const chat=document.createElement('div');chat.className='fm-chat';const chatLog=document.createElement('div');chatLog.className='fm-chat-log';const chatInput=document.createElement('input');chatInput.className='fm-chat-input';chatInput.maxLength=180;chatInput.placeholder='Message';chat.append(chatLog,chatInput);ROOT.appendChild(chat);
    function addChat(name,text){const line=document.createElement('div');line.textContent=`${name}: ${text}`;chatLog.appendChild(line);while(chatLog.children.length>8)chatLog.removeChild(chatLog.firstChild);}

    // Inventory and crafting
    function countItem(id){return inventory.reduce((n,s)=>n+(s?.id===id?s.count:0),0);}
    function addItem(id,n=1){if(!items[id]||n<=0)return;const max=id.startsWith('wooden_')?1:64;for(const s of inventory){if(s&&s.id===id&&s.count<max){const a=Math.min(max-s.count,n);s.count+=a;n-=a;if(!n)break;}}for(let i=0;i<inventory.length&&n>0;i++)if(!inventory[i]){const a=Math.min(max,n);inventory[i]={id,count:a};n-=a;}updateHotbar();if(inventoryOpen)renderInventory();}
    function nearbyTable(){const x=Math.floor(player.position.x),y=Math.floor(player.position.y),z=Math.floor(player.position.z);for(let a=x-4;a<=x+4;a++)for(let b=z-4;b<=z+4;b++)for(let c=y-2;c<=y+2;c++)if(world.get(k3(a,c,b))==='crafting_table')return true;return false;}
    function matchRecipe(){const counts={};for(const s of craftingGrid)if(s)counts[s.id]=(counts[s.id]||0)+s.count;const total=Object.values(counts).reduce((a,b)=>a+b,0);if(total===1&&counts.oak_log)return{id:'oak_planks',count:4,cost:{oak_log:1},name:'Oak Planks'};if(total===2&&counts.oak_planks===2)return{id:'stick',count:4,cost:{oak_planks:2},name:'Sticks'};if(total===4&&counts.oak_planks===4)return{id:'crafting_table',count:1,cost:{oak_planks:4},name:'Crafting Table'};if(craftingSize===3){const g=craftingGrid.map(s=>s?.id||'');const patterns=[{p:['oak_planks','oak_planks','oak_planks','','stick','','','stick',''],r:{id:'wooden_pickaxe',count:1,cost:{oak_planks:3,stick:2},name:'Wooden Pickaxe'}},{p:['','oak_planks','','','oak_planks','','','stick',''],r:{id:'wooden_sword',count:1,cost:{oak_planks:2,stick:1},name:'Wooden Sword'}},{p:['oak_planks','oak_planks','','oak_planks','stick','','','stick',''],r:{id:'wooden_axe',count:1,cost:{oak_planks:3,stick:2},name:'Wooden Axe'}}];for(const x of patterns)if(x.p.every((v,i)=>v===g[i]))return x.r;}return null;}
    function consumeGrid(cost){for(const [id,n] of Object.entries(cost))if(craftingGrid.reduce((a,s)=>a+(s?.id===id?s.count:0),0)<n)return false;for(const [id,n] of Object.entries(cost)){let left=n;for(let i=0;i<craftingGrid.length;i++){const s=craftingGrid[i];if(!s||s.id!==id)continue;const a=Math.min(left,s.count);s.count-=a;left-=a;if(s.count<=0)craftingGrid[i]=null;if(!left)break;}}return true;}
    const invOverlay=document.createElement('div');invOverlay.className='fm-overlay';ROOT.appendChild(invOverlay);
    function putCursorBack(){if(!cursorStack)return;const i=inventory.findIndex(s=>!s);if(i>=0)inventory[i]=cursorStack;else addItem(cursorStack.id,cursorStack.count);cursorStack=null;}
    function renderInventory(){
      craftingSize=nearbyTable()?3:2;
      invOverlay.innerHTML=`<div class="fm-inventory"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px"><b style="font-size:22px">Inventory</b><button id="fm-close">✕</button></div><div style="display:grid;grid-template-columns:minmax(0,1.2fr) minmax(230px,.8fr);gap:20px"><section><b>Inventory</b><div class="fm-inv-grid" id="fm-main" style="margin-top:8px"></div><b style="display:block;margin-top:12px">Hotbar</b><div class="fm-inv-grid" id="fm-hot" style="margin-top:8px"></div><div class="fm-small" style="color:#333;margin-top:8px">Click to pick up or move item stacks.</div></section><section><b>${craftingSize===3?'Crafting Table':'Crafting'}</b><div style="display:flex;align-items:center;margin:12px 0"><div class="fm-craft-grid" id="fm-craft"></div><span style="font-size:22px;margin:0 5px">➜</span><button class="fm-craft-output" id="fm-output"></button></div><div class="fm-small" style="color:#333">${craftingSize===3?'3 × 3 crafting':'2 × 2 crafting'}${craftingSize===2?' · Place a crafting table nearby to unlock tools.':''}</div><div id="fm-recipe-name" style="font-weight:bold;margin-top:12px"></div><button class="fm-button" id="fm-craft-button">Craft</button><div class="fm-small" id="fm-hint" style="color:#333"></div></section></div></div>`;
      const main=invOverlay.querySelector('#fm-main'),hot=invOverlay.querySelector('#fm-hot');
      function invCell(index,selected){const cell=document.createElement('button');cell.className='fm-inv-slot'+(selected?' selected':'');const s=inventory[index];if(s){cell.appendChild(drawIcon(s.id));const c=document.createElement('span');c.className='fm-item-count';c.textContent=s.count;cell.appendChild(c);cell.title=items[s.id][0];}cell.onclick=()=>{if(cursorStack){if(!inventory[index]){inventory[index]=cursorStack;cursorStack=null;}else if(inventory[index].id===cursorStack.id){const n=Math.min(64-inventory[index].count,cursorStack.count);inventory[index].count+=n;cursorStack.count-=n;if(cursorStack.count<=0)cursorStack=null;}else{const t=inventory[index];inventory[index]=cursorStack;cursorStack=t;}}else if(inventory[index]){cursorStack=inventory[index];inventory[index]=null;}updateHotbar();renderInventory();};return cell;}
      for(let i=9;i<36;i++)main.appendChild(invCell(i,false));for(let i=0;i<9;i++)hot.appendChild(invCell(i,i===selectedSlot));
      const grid=invOverlay.querySelector('#fm-craft');grid.style.gridTemplateColumns=`repeat(${craftingSize},38px)`;for(let i=0;i<craftingSize*craftingSize;i++){const cell=document.createElement('button');cell.className='fm-craft-cell';const s=craftingGrid[i];if(s){cell.appendChild(drawIcon(s.id));const c=document.createElement('span');c.className='fm-item-count';c.textContent=s.count;cell.appendChild(c);}cell.onclick=()=>{if(cursorStack){if(!craftingGrid[i]){craftingGrid[i]=cursorStack;cursorStack=null;}else if(craftingGrid[i].id===cursorStack.id){craftingGrid[i].count+=cursorStack.count;cursorStack=null;}else{const t=craftingGrid[i];craftingGrid[i]=cursorStack;cursorStack=t;}}else if(craftingGrid[i]){cursorStack=craftingGrid[i];craftingGrid[i]=null;}renderInventory();};grid.appendChild(cell);}
      const recipe=matchRecipe(),out=invOverlay.querySelector('#fm-output');if(recipe){out.appendChild(drawIcon(recipe.id));const c=document.createElement('span');c.className='fm-item-count';c.textContent=recipe.count;out.appendChild(c);}invOverlay.querySelector('#fm-recipe-name').textContent=recipe?.name||'No recipe';const craft=invOverlay.querySelector('#fm-craft-button');craft.disabled=!recipe;craft.onclick=()=>{const r=matchRecipe();if(!r||!consumeGrid(r.cost))return;addItem(r.id,r.count);if(r.id==='crafting_table')unlock('table');renderInventory();};invOverlay.querySelector('#fm-hint').textContent=recipe?'Click Craft to collect the output.':'Place ingredients in the grid.';invOverlay.querySelector('#fm-close').onclick=closeInventory;
    }
    function openInventory(){if(!running||paused)return;inventoryOpen=true;held.left=false;held.right=false;document.exitPointerLock?.();renderInventory();invOverlay.style.display='flex';}
    function closeInventory(){putCursorBack();inventoryOpen=false;invOverlay.style.display='none';updateHotbar();}

    // Crack textures and outline
    const crackTextures=[];for(let stage=0;stage<10;stage++){const c=document.createElement('canvas');c.width=64;c.height=64;const ctx=c.getContext('2d');if(stage){ctx.strokeStyle='rgba(15,15,15,.9)';ctx.lineWidth=2;for(let i=0;i<stage+2;i++){const x=8+(i*19+stage*7)%48,y=7+(i*31+stage*11)%48;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+(i%2?12:-13),y+((i%3)-1)*12);ctx.lineTo(x+(i%2?17:-19),y+((i%3)-1)*20);ctx.stroke();}ctx.fillStyle='rgba(0,0,0,.12)';ctx.fillRect(0,0,64,64);}const tex=new THREE.CanvasTexture(c);tex.magFilter=THREE.NearestFilter;tex.minFilter=THREE.NearestFilter;crackTextures.push(tex);}
    const crackMats=crackTextures.map(t=>new THREE.MeshBasicMaterial({map:t,transparent:true,depthWrite:false}));const crackMesh=new THREE.Mesh(new THREE.BoxGeometry(1.006,1.006,1.006),crackMats[0]);crackMesh.visible=false;crackMesh.renderOrder=4;scene.add(crackMesh);
    const outline=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.012,1.012,1.012)),new THREE.LineBasicMaterial({color:0x111111}));outline.visible=false;outline.renderOrder=5;scene.add(outline);

    // Mobs
    function makeZombie(id,x,y,z){const g=new THREE.Group(),green=new THREE.MeshLambertMaterial({color:0x478b43}),purple=new THREE.MeshLambertMaterial({color:0x393b79}),dark=new THREE.MeshLambertMaterial({color:0x111111});box(g,.8,.95,.4,green,0,.95,0);box(g,.58,.58,.58,green,0,1.72,0);box(g,.13,.1,.05,dark,-.14,1.8,-.3);box(g,.13,.1,.05,dark,.14,1.8,-.3);box(g,.3,.9,.35,green,-.55,.95,0);box(g,.3,.9,.35,green,.55,.95,0);box(g,.3,.85,.35,purple,-.2,.42,0);box(g,.3,.85,.35,purple,.2,.42,0);g.position.set(x,y,z);scene.add(g);const m={id,group:g,hp:3,attackTimer:0,hitTimer:0,knockX:0,knockZ:0};for(const child of g.children)child.userData.mob=m;mobs.set(id,m);return m;}
    function removeMob(id){const m=mobs.get(id);if(m){scene.remove(m.group);mobs.delete(id);}}
    function mobSnapshot(){return[...mobs.values()].map(m=>({id:m.id,x:m.group.position.x,y:m.group.position.y,z:m.group.position.z,hp:m.hp}));}
    function syncMobs(list){const seen=new Set();for(const d of list){seen.add(d.id);let m=mobs.get(d.id);if(!m)m=makeZombie(d.id,d.x,d.y,d.z);m.group.position.set(d.x,d.y,d.z);m.hp=d.hp;}for(const id of [...mobs.keys()])if(!seen.has(id))removeMob(id);}
    function spawnMobs(){if(!mobsEnabled||difficulty==='Peaceful')return;for(let i=0;i<3;i++){const a=Math.random()*Math.PI*2,d=14+Math.random()*7,x=Math.floor(player.position.x+Math.cos(a)*d),z=Math.floor(player.position.z+Math.sin(a)*d);ensureChunkAt(x,z);makeZombie(`mob-${mobCounter++}`,x+.5,groundAt(x,z),z+.5);}}
    function flashMob(m){m.hitTimer=.2;m.group.scale.set(1.1,.9,1.1);m.group.rotation.z=.16;}

    // Networking helpers
    function sendHost(msg){if(hostConn?.open)hostConn.send(msg);}
    function broadcast(msg,except=null){for(const [id,c] of connections)if(id!==except&&c.open){try{c.send(msg);}catch(e){}}}
    function disconnect(){for(const c of connections.values()){try{c.close();}catch(e){}}connections.clear();try{hostConn?.close();}catch(e){}hostConn=null;try{peer?.destroy();}catch(e){}peer=null;isHost=false;roomCode='';playerId='local';}
    const validName=s=>String(s||'Player').replace(/[<>]/g,'').trim().slice(0,18)||'Player';
    const validAvatar=s=>avatars[s]?s:'Steve';
    function playerState(){const selected=inventory[selectedSlot];return{x:player.position.x,y:player.position.y,z:player.position.z,yaw,pitch,hp,moving:!!(keys.KeyW||keys.KeyA||keys.KeyS||keys.KeyD),walk:walking,selectedItem:selected?.id||null,selectedCount:selected?.count||0,selectedSlot};}
    function welcomePacket(){return{type:'welcome',seed,worldName,roomCode,difficulty,mobsEnabled,pvpEnabled,chatEnabled,mods:[...mods],players:[{id:playerId,name:playerName,avatar:avatarChoice,...playerState()}],mobs:mobSnapshot()};}
    function validReach(s,x,y,z){return [x,y,z].every(Number.isFinite)&&Math.hypot(s.x-(x+.5),s.z-(z+.5))<7&&Math.abs(s.y-y)<7;}
    function overlaps(x,y,z,s){return s.x+.3>x&&s.x-.3<x+1&&s.y+1.8>y&&s.y<y+1&&s.z+.3>z&&s.z-.3<z+1;}
    function addAchievement(id,name){const names={first_block:'Getting Started',wood:'Tree Hugger',table:'Benchmarking',first_mob:'Monster Hunter',miner:'Dedicated Miner'};showToast('Achievement Get!',`${name}: ${names[id]||id}`);}
    function unlock(id){if(unlocked.has(id))return;unlocked.add(id);if(id==='first_block'||id==='wood'||id==='table'||id==='first_mob'||id==='miner')addAchievement(id,playerName);if(isHost)broadcast({type:'achievement',id,name:playerName});else if(peer)sendHost({type:'achievementRequest',id});}
    function mineAchievement(type,actor){if(actor!==playerId)return;minedCount++;if(minedCount===1)unlock('first_block');if(type==='oak_log')unlock('wood');if(minedCount>=25)unlock('miner');}
    function applyBlockMessage(m){if(pendingMine===k3(m.x,m.y,m.z))pendingMine=null;ensureChunkAt(m.x,m.z);changeBlock(m.x,m.y,m.z,m.block);if(m.actor===playerId){if(m.block){const s=inventory[m.slot??selectedSlot];if(s&&s.id===m.block){s.count--;if(s.count<=0)inventory[m.slot??selectedSlot]=null;updateHotbar();}}else if(m.drop){addItem(m.drop==='grass'?'dirt':m.drop,1);mineAchievement(m.drop,playerId);}}}
    function hostMine(x,y,z,actor){ensureChunkAt(x,z);const type=world.get(k3(x,y,z));if(!type)return;changeBlock(x,y,z,null);broadcast({type:'block',x,y,z,block:null,actor,drop:type});if(actor===playerId)addItem(type==='grass'?'dirt':type,1);mineAchievement(type,actor);}
    function hostPlace(x,y,z,block,actor,slot=selectedSlot){if(!placeable.includes(block))return;ensureChunkAt(x,z);if(world.has(k3(x,y,z)))return;const r=remotePlayers.get(actor),pos=actor===playerId?player.position:r?.state;if(!pos||overlaps(x,y,z,pos))return;if(actor!==playerId&&(r?.state.selectedItem!==block||r?.state.selectedCount<1))return;if(!changeBlock(x,y,z,block))return;broadcast({type:'block',x,y,z,block,actor,slot});if(actor===playerId){const s=inventory[slot];if(s&&s.id===block){s.count--;if(s.count<=0)inventory[slot]=null;updateHotbar();}}else if(r?.state){r.state.selectedCount=Math.max(0,(r.state.selectedCount||1)-1);}}

    function handleNetwork(from,msg){
      if(!msg||typeof msg!=='object')return;
      if(isHost){
        const conn=connections.get(from);if(!conn)return;
        if(msg.type==='hello'){
          if(remotePlayers.size>=1){conn.send({type:'full'});conn.close();connections.delete(from);return;}
          const r=addRemote(from,{name:validName(msg.name),avatar:validAvatar(msg.avatar)});r.state={x:player.position.x+2,y:player.position.y,z:player.position.z,yaw:0,pitch:0,hp:20,moving:false,walk:0};pose(r.model,r.state);
          conn.send(welcomePacket());addChat('Server',`${r.model.name} joined.`);return;
        }
        const r=remotePlayers.get(from);if(!r)return;
        if(msg.type==='state'){r.state={...r.state,...msg.state};pose(r.model,r.state);broadcast({type:'state',id:from,state:r.state},from);return;}
        if(msg.type==='mine'){if(validReach(r.state,msg.x,msg.y,msg.z)){ensureChunkAt(msg.x,msg.z);hostMine(msg.x,msg.y,msg.z,from);}return;}
        if(msg.type==='place'){if(validReach(r.state,msg.x,msg.y,msg.z)){ensureChunkAt(msg.x,msg.z);hostPlace(msg.x,msg.y,msg.z,msg.block,from,msg.slot??0);}return;}
        if(msg.type==='hitMob'){const m=mobs.get(msg.id);if(m&&Math.hypot(m.group.position.x-r.state.x,m.group.position.z-r.state.z)<5)damageMob(m,from,!!msg.critical,!!msg.sword);return;}
        if(msg.type==='hitPlayer'&&pvpEnabled&&msg.id===playerId&&Math.hypot(r.state.x-player.position.x,r.state.z-player.position.z)<5){const factor=difficulty==='Hard'?1.35:difficulty==='Easy'?.8:1;damagePlayer((msg.sword?4:1)*(msg.critical?1.5:1)*factor);return;}
        if(msg.type==='chat'){if(chatEnabled){const text=String(msg.text||'').trim().slice(0,180);if(text){addChat(r.model.name,text);broadcast({type:'chat',name:r.model.name,text},from);}}return;}
        if(msg.type==='achievementRequest'){addAchievement(msg.id,r.model.name);broadcast({type:'achievement',id:msg.id,name:r.model.name},from);return;}
      } else {
        if(msg.type==='welcome'){
          if(running)return;seed=String(msg.seed||'12345');worldName=msg.worldName||'World';roomCode=msg.roomCode||roomCode;difficulty=msg.difficulty||'Normal';mobsEnabled=!!msg.mobsEnabled;pvpEnabled=!!msg.pvpEnabled;chatEnabled=msg.chatEnabled!==false;
          mods.clear();for(const e of msg.mods||[])mods.set(e[0],e[1]);startWorld({network:true,players:msg.players||[],mobs:msg.mobs||[]});return;
        }
        if(msg.type==='full'){showMenuMessage('This server already has two players.');disconnect();showMultiplayer();return;}
        if(msg.type==='state'){const r=remotePlayers.get(msg.id)||addRemote(msg.id,msg.state);r.state={...r.state,...msg.state};pose(r.model,r.state);return;}
        if(msg.type==='block'){applyBlockMessage(msg);return;}
        if(msg.type==='item'){addItem(msg.id,msg.count||1);return;}
        if(msg.type==='mobs'){syncMobs(msg.list||[]);return;}
        if(msg.type==='damage'){hp=Math.max(0,msg.hp);updateHealth(true);if(hp<=0)respawn();return;}
        if(msg.type==='respawn'){player.position.set(msg.x,msg.y,msg.z);hp=20;updateHealth(true);return;}
        if(msg.type==='mobHealth'){const m=mobs.get(msg.id);if(m){m.hp=msg.hp;flashMob(m);if(msg.dead)removeMob(msg.id);}return;}
        if(msg.type==='chat'){addChat(msg.name,msg.text);return;}
        if(msg.type==='achievement'){addAchievement(msg.id,msg.name);return;}
        if(msg.type==='playerLeft'){removeRemote(msg.id);addChat('Server','A player left.');return;}
        if(msg.type==='closed'||msg.type==='kicked'){showToast('Disconnected',msg.type==='kicked'?'The host removed you.':'The host closed the server.');disconnect();running=false;setTimeout(showHome,900);return;}
      }
    }

    function damageMob(m,actor,critical,sword){
      const factor=difficulty==='Hard'?1.35:difficulty==='Easy'?.8:1;
      m.hp-=(sword?4:1)*(critical?1.5:1)*factor;flashMob(m);
      const src=actor===playerId?player.position:remotePlayers.get(actor)?.state;
      const dx=m.group.position.x-(src?.x??player.position.x),dz=m.group.position.z-(src?.z??player.position.z),len=Math.hypot(dx,dz)||1;
      m.knockX=dx/len*1.8;m.knockZ=dz/len*1.8;
      if(m.hp<=0){removeMob(m.id);if(actor===playerId){addItem('rotten_flesh',1);unlock('first_mob');}else{connections.get(actor)?.send({type:'item',id:'rotten_flesh',count:1});const r=remotePlayers.get(actor);addAchievement('first_mob',r?.model.name||'Player');broadcast({type:'achievement',id:'first_mob',name:r?.model.name||'Player'});}}
      broadcast({type:'mobHealth',id:m.id,hp:m.hp,dead:m.hp<=0});
    }
    function damageRemote(id,amount){const r=remotePlayers.get(id),conn=connections.get(id);if(!r||!conn)return;r.state.hp=Math.max(0,(r.state.hp??20)-amount);conn.send({type:'damage',hp:r.state.hp});if(r.state.hp<=0){r.state.x=player.position.x+2;r.state.y=player.position.y;r.state.z=player.position.z;r.state.hp=20;conn.send({type:'respawn',x:r.state.x,y:r.state.y,z:r.state.z,hp:20});}}
    function damagePlayer(n){hp=Math.max(0,hp-n);updateHealth(true);if(hp<=0)respawn();}
    function respawn(){hp=20;player.position.set(spawnPoint.x,spawnPoint.y,spawnPoint.z);velocityY=0;updateHealth(true);showToast('Respawned','');}
    function updateMobs(dt){
      if(!hasAuthority())return;
      if(mobsEnabled&&difficulty!=='Peaceful'){mobSpawnTimer+=dt;if(mobSpawnTimer>35&&mobs.size<6){mobSpawnTimer=0;const a=Math.random()*Math.PI*2,d=15,x=Math.floor(player.position.x+Math.cos(a)*d),z=Math.floor(player.position.z+Math.sin(a)*d);ensureChunkAt(x,z);makeZombie(`mob-${mobCounter++}`,x+.5,groundAt(x,z),z+.5);}}
      for(const m of [...mobs.values()]){
        const targets=[{id:playerId,x:player.position.x,z:player.position.z}];for(const [id,r] of remotePlayers)targets.push({id,x:r.state.x,z:r.state.z});
        let target=targets[0],best=Infinity;for(const p of targets){const d=Math.hypot(p.x-m.group.position.x,p.z-m.group.position.z);if(d<best){best=d;target=p;}}
        if(best<27&&best>1.15){const dx=target.x-m.group.position.x,dz=target.z-m.group.position.z,len=Math.hypot(dx,dz)||1,nx=m.group.position.x+dx/len*1.05*dt,nz=m.group.position.z+dz/len*1.05*dt;ensureChunkAt(Math.floor(nx),Math.floor(nz));if(!world.has(k3(Math.floor(nx),Math.floor(m.group.position.y),Math.floor(nz)))){m.group.position.x=nx;m.group.position.z=nz;}m.group.position.y=groundAt(Math.floor(nx),Math.floor(nz));m.group.rotation.y=Math.atan2(-dx,-dz);}
        m.attackTimer-=dt;if(best<1.35&&m.attackTimer<=0){const dmg=difficulty==='Hard'?4:difficulty==='Easy'?1:2;if(target.id===playerId)damagePlayer(dmg);else{const r=remotePlayers.get(target.id);if(r){r.state.hp=Math.max(0,(r.state.hp??20)-dmg);connections.get(target.id)?.send({type:'damage',hp:r.state.hp});}}m.attackTimer=1.4;}
        if(m.hitTimer>0){m.hitTimer-=dt;if(m.hitTimer<=0){m.group.scale.set(1,1,1);m.group.rotation.z=0;}}
        if(m.knockX||m.knockZ){m.group.position.x+=m.knockX*dt;m.group.position.z+=m.knockZ*dt;m.knockX*=.8;m.knockZ*=.8;}
      }
    }

    // Menus
    const menu=document.createElement('div');menu.className='fm-screen';ROOT.appendChild(menu);
    function showMenuMessage(text){const p=document.createElement('div');p.textContent=text;Object.assign(p.style,{position:'absolute',bottom:'12px',left:'50%',transform:'translateX(-50%)',background:'#7c2929',padding:'10px 14px',maxWidth:'90%',zIndex:'50',textAlign:'center'});menu.appendChild(p);setTimeout(()=>p.remove(),4500);}
    function profileFields(){return `<label class="fm-label">Name</label><input class="fm-input" id="fm-name" maxlength="18" value="${escapeHTML(playerName)}"><label class="fm-label">Avatar</label><select class="fm-input" id="fm-avatar">${Object.keys(avatars).map(a=>`<option ${a===avatarChoice?'selected':''}>${a}</option>`).join('')}</select>`;}
    function readProfile(){playerName=validName(menu.querySelector('#fm-name')?.value||'Falleen');avatarChoice=avatars[menu.querySelector('#fm-avatar')?.value]?menu.querySelector('#fm-avatar').value:'Steve';scene.remove(player);localAvatar=makeAvatar(playerName,avatarChoice);player=localAvatar.group;scene.add(player);player.visible=false;}
    function showHome(){menu.style.display='flex';menu.innerHTML=`<div class="fm-box"><div class="fm-logo">FeatherMC</div><button class="fm-button" id="fm-single">Singleplayer</button><button class="fm-button" id="fm-multi">Multiplayer</button><button class="fm-button fm-secondary" id="fm-settings">Settings</button><button class="fm-button fm-secondary" id="fm-exit">Exit Game</button></div>`;menu.querySelector('#fm-single').onclick=showCreateWorld;menu.querySelector('#fm-multi').onclick=showMultiplayer;menu.querySelector('#fm-settings').onclick=()=>showSettings('home');menu.querySelector('#fm-exit').onclick=()=>{cleanup();ROOT.remove();};}
    function showCreateWorld(){menu.style.display='flex';menu.innerHTML=`<div class="fm-box"><div style="font-size:28px;font-weight:bold">Create World</div><label class="fm-label">World name</label><input class="fm-input" id="fm-world" value="My World"><label class="fm-label">Seed</label><input class="fm-input" id="fm-seed" value="${Math.floor(Math.random()*9999999)}">${profileFields()}<label class="fm-label">Difficulty</label><select class="fm-input" id="fm-diff"><option>Peaceful</option><option>Easy</option><option selected>Normal</option><option>Hard</option></select><button class="fm-button" id="fm-create">Create World</button><button class="fm-button fm-secondary" id="fm-back">Back</button></div>`;menu.querySelector('#fm-back').onclick=showHome;menu.querySelector('#fm-create').onclick=()=>{readProfile();worldName=menu.querySelector('#fm-world').value||'My World';seed=menu.querySelector('#fm-seed').value||'12345';difficulty=menu.querySelector('#fm-diff').value;mobsEnabled=true;pvpEnabled=false;chatEnabled=true;isHost=false;playerId='local';startWorld();};}
    function showMultiplayer(){menu.style.display='flex';menu.innerHTML=`<div class="fm-box"><div style="font-size:28px;font-weight:bold;margin-bottom:18px">Multiplayer</div><button class="fm-button" id="fm-host">Create Server</button><button class="fm-button" id="fm-join">Join Server</button><button class="fm-button fm-secondary" id="fm-back">Back</button></div>`;menu.querySelector('#fm-host').onclick=showHostForm;menu.querySelector('#fm-join').onclick=showJoinForm;menu.querySelector('#fm-back').onclick=showHome;}
    function showHostForm(){const suggested=String(Math.floor(Math.random()*100)).padStart(2,'0');menu.style.display='flex';menu.innerHTML=`<div class="fm-box"><div style="font-size:27px;font-weight:bold">Create Server</div><label class="fm-label">Server ID (two digits)</label><input class="fm-input" id="fm-code" maxlength="2" inputmode="numeric" value="${suggested}"><label class="fm-label">World name</label><input class="fm-input" id="fm-world" value="My World"><label class="fm-label">Seed</label><input class="fm-input" id="fm-seed" value="${Math.floor(Math.random()*9999999)}">${profileFields()}<label class="fm-label">Difficulty</label><select class="fm-input" id="fm-diff"><option>Peaceful</option><option>Easy</option><option selected>Normal</option><option>Hard</option></select><div class="fm-row"><label class="fm-label"><input type="checkbox" id="fm-mobs" checked> Mobs</label><label class="fm-label"><input type="checkbox" id="fm-pvp"> PvP</label><label class="fm-label"><input type="checkbox" id="fm-chat" checked> Chat</label></div><button class="fm-button" id="fm-create">Create Server</button><button class="fm-button fm-secondary" id="fm-back">Back</button><div class="fm-small">Two players maximum. The ID is public, not a password.</div></div>`;menu.querySelector('#fm-back').onclick=showMultiplayer;menu.querySelector('#fm-create').onclick=()=>{const code=menu.querySelector('#fm-code').value.trim();if(!/^\d{2}$/.test(code)){showMenuMessage('Enter exactly two digits.');return;}readProfile();worldName=menu.querySelector('#fm-world').value||'My World';seed=menu.querySelector('#fm-seed').value||'12345';difficulty=menu.querySelector('#fm-diff').value;mobsEnabled=menu.querySelector('#fm-mobs').checked;pvpEnabled=menu.querySelector('#fm-pvp').checked;chatEnabled=menu.querySelector('#fm-chat').checked;menu.querySelector('#fm-create').disabled=true;menu.querySelector('#fm-create').textContent='Connecting...';ensurePeer(()=>createServer(code));};}
    function showJoinForm(){menu.style.display='flex';menu.innerHTML=`<div class="fm-box"><div style="font-size:27px;font-weight:bold">Join Server</div><label class="fm-label">Server ID</label><input class="fm-input" id="fm-code" maxlength="2" inputmode="numeric" placeholder="00">${profileFields()}<button class="fm-button" id="fm-join">Join</button><button class="fm-button fm-secondary" id="fm-back">Back</button></div>`;menu.querySelector('#fm-back').onclick=showMultiplayer;menu.querySelector('#fm-join').onclick=()=>{const code=menu.querySelector('#fm-code').value.trim();if(!/^\d{2}$/.test(code)){showMenuMessage('Enter exactly two digits.');return;}readProfile();menu.querySelector('#fm-join').disabled=true;menu.querySelector('#fm-join').textContent='Connecting...';ensurePeer(()=>joinServer(code));};}
    function showSettings(from){menu.style.display='flex';menu.innerHTML=`<div class="fm-box"><div style="font-size:28px;font-weight:bold">Settings</div><label class="fm-label">Render distance: <b id="fm-rv">${renderDistance}</b> chunks</label><input class="fm-input" id="fm-r" type="range" min="1" max="4" value="${renderDistance}"><label class="fm-label">Field of view: <b id="fm-fv">${fov}</b></label><input class="fm-input" id="fm-f" type="range" min="60" max="110" value="${fov}"><label class="fm-label">Mouse sensitivity: <b id="fm-sv">${sensitivity.toFixed(1)}</b></label><input class="fm-input" id="fm-s" type="range" min=".2" max="3" step=".1" value="${sensitivity}"><button class="fm-button" id="fm-done">Done</button></div>`;const r=menu.querySelector('#fm-r'),f=menu.querySelector('#fm-f'),s=menu.querySelector('#fm-s');r.oninput=()=>{renderDistance=+r.value;menu.querySelector('#fm-rv').textContent=r.value;if(running){lastChunkX=null;updateChunks(true);}};f.oninput=()=>{fov=+f.value;camera.fov=fov;camera.updateProjectionMatrix();menu.querySelector('#fm-fv').textContent=fov;};s.oninput=()=>{sensitivity=+s.value;menu.querySelector('#fm-sv').textContent=sensitivity.toFixed(1);};menu.querySelector('#fm-done').onclick=()=>from==='pause'?showPause():showHome();}
    function showPause(){paused=true;held.left=false;held.right=false;document.exitPointerLock?.();menu.style.display='flex';menu.innerHTML=`<div class="fm-box"><div style="font-size:34px;font-weight:bold">Paused</div>${isHost?`<div class="fm-small">Server ID: <b>${roomCode}</b></div>`:''}<button class="fm-button" id="fm-resume">Resume</button><button class="fm-button fm-secondary" id="fm-settings">Settings</button>${isHost?'<button class="fm-button fm-secondary" id="fm-kick">Remove other player</button>':''}<button class="fm-button fm-secondary" id="fm-home">Main Menu</button><button class="fm-button fm-secondary" id="fm-exit">Exit Game</button></div>`;menu.querySelector('#fm-resume').onclick=()=>{paused=false;menu.style.display='none';try{renderer.domElement.requestPointerLock();}catch(e){}};menu.querySelector('#fm-settings').onclick=()=>showSettings('pause');menu.querySelector('#fm-home').onclick=()=>{if(isHost)broadcast({type:'closed'});disconnect();running=false;clearWorld();showHome();};menu.querySelector('#fm-exit').onclick=()=>{if(isHost)broadcast({type:'closed'});cleanup();ROOT.remove();};menu.querySelector('#fm-kick')?.addEventListener('click',()=>{for(const [id,c] of connections){c.send({type:'kicked'});c.close();connections.delete(id);removeRemote(id);}showToast('Server','Other player removed.');});}

    // Network setup and game start
    function createServer(code){roomCode=code;isHost=true;peer=new window.Peer(`feathermc-${code}`);peer.on('open',id=>{playerId=id;startWorld();showToast('Server ready',`Server ID: ${code}`);});peer.on('connection',conn=>{if(connections.size>=1){conn.on('open',()=>{conn.send({type:'full'});conn.close();});return;}connections.set(conn.peer,conn);conn.on('data',msg=>handleNetwork(conn.peer,msg));conn.on('close',()=>{connections.delete(conn.peer);removeRemote(conn.peer);broadcast({type:'playerLeft',id:conn.peer});addChat('Server','A player disconnected.');});conn.on('error',()=>{connections.delete(conn.peer);removeRemote(conn.peer);});});peer.on('error',e=>{disconnect();showMenuMessage(e?.type==='unavailable-id'?'That ID is already in use. Choose another two digits.':`Network error: ${e?.type||'unknown'}`);});}
    function joinServer(code){roomCode=code;isHost=false;peer=new window.Peer();peer.on('open',id=>{playerId=id;hostConn=peer.connect(`feathermc-${code}`,{reliable:true});hostConn.on('open',()=>hostConn.send({type:'hello',name:playerName,avatar:avatarChoice}));hostConn.on('data',msg=>handleNetwork('host',msg));hostConn.on('close',()=>{if(running){running=false;showToast('Disconnected','The host left the server.');setTimeout(()=>{disconnect();showHome();},900);}});hostConn.on('error',()=>showMenuMessage('Connection failed. Check the server ID.'));setTimeout(()=>{if(!running&&hostConn&&!hostConn.open){disconnect();showMenuMessage('Could not find that server. Check the ID and try again.');}},9000);});peer.on('error',e=>showMenuMessage(`Network error: ${e?.type||'unknown'}`));}
    function clearWorld(){for(const c of chunks.values())disposeChunk(c);chunks.clear();world.clear();for(const id of [...mobs.keys()])removeMob(id);for(const id of [...remotePlayers.keys()])removeRemote(id);lastChunkX=null;lastChunkZ=null;}
    function startWorld(opts={}){seedHash=hashSeed(seed);clearWorld();inventory.fill(null);craftingGrid.fill(null);cursorStack=null;unlocked.clear();minedCount=0;hp=20;if(!opts.network)mods.clear();else for(const e of opts.mods||[])mods.set(e[0],e[1]);player.position.set(.5,18,.5);yaw=0;pitch=.12;velocityY=0;grounded=false;firstPerson=true;cameraDistance=7;player.visible=false;updateChunks(true);player.position.y=floorAt(.5,.5);spawnPoint={x:player.position.x,y:player.position.y,z:player.position.z};if(opts.network){const hostPlayer=(opts.players||[]).find(p=>p.id!==playerId);for(const p of opts.players||[]){if(p.id===playerId)continue;const r=addRemote(p.id,{name:p.name,avatar:p.avatar});r.state={...p};pose(r.model,r.state);}if(hostPlayer){player.position.set(hostPlayer.x+2,hostPlayer.y,hostPlayer.z);updateChunks();player.position.y=floorAt(player.position.x,player.position.z);spawnPoint={x:player.position.x,y:player.position.y,z:player.position.z};}syncMobs(opts.mobs||[]);}else spawnMobs();running=true;paused=false;inventoryOpen=false;chatOpen=false;menu.style.display='none';invOverlay.style.display='none';updateHotbar();updateHealth();info.textContent=isHost?`Server ID: ${roomCode}`:roomCode?`Server: ${roomCode}`:'';try{renderer.domElement.requestPointerLock();}catch(e){}clock.start();}
    function getPlayerState(){return{x:player.position.x,y:player.position.y,z:player.position.z,yaw,pitch,hp,moving:!!(keys.KeyW||keys.KeyA||keys.KeyS||keys.KeyD),walk:walking};}
    function sendChat(text){text=String(text||'').trim().slice(0,180);if(!text)return;if(text.startsWith('/kick ')&&isHost){const target=text.slice(6).trim().toLowerCase();for(const [id,c] of connections){const r=remotePlayers.get(id);if(r&&r.model.name.toLowerCase()===target){c.send({type:'kicked'});c.close();connections.delete(id);removeRemote(id);broadcast({type:'playerLeft',id});addChat('Server',`${r.model.name} was removed.`);return;}}addChat('Server','Player not found.');return;}if(!chatEnabled)return;addChat(playerName,text);if(isHost)broadcast({type:'chat',name:playerName,text});else sendHost({type:'chat',text});}
    chatInput.addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Enter'){sendChat(chatInput.value);chatInput.value='';chatOpen=false;chatInput.style.display='none';renderer.domElement.requestPointerLock();}if(e.key==='Escape'){chatOpen=false;chatInput.style.display='none';renderer.domElement.requestPointerLock();}});

    // Inputs
    function openChat(){if(!running||paused||inventoryOpen||!chatEnabled)return;chatOpen=true;held.left=false;held.right=false;document.exitPointerLock?.();chatInput.style.display='block';chatInput.focus();}
    function keyDown(e){if(!running)return;if(e.code==='Escape'){e.preventDefault();if(inventoryOpen)closeInventory();else if(chatOpen){chatOpen=false;chatInput.style.display='none';}else if(!paused)showPause();return;}if(paused||inventoryOpen||chatOpen)return;keys[e.code]=true;if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();if(e.code==='Space'&&grounded){velocityY=8;grounded=false;}if(e.code==='KeyE'){openInventory();return;}if(e.code==='KeyT'){openChat();return;}if(e.code==='KeyV'){firstPerson=!firstPerson;player.visible=!firstPerson;return;}if(e.code.startsWith('Digit')){const n=Number(e.code.slice(5));if(n>=1&&n<=9){selectedSlot=n-1;updateHotbar();}}}
    function keyUp(e){keys[e.code]=false;}
    function mouseUp(e){if(e.button===0){held.left=false;pendingMine=null;miningKey=null;miningProgress=0;progressFill.style.width='0%';crackMesh.visible=false;}if(e.button===2)held.right=false;}
    window.addEventListener('keydown',keyDown);window.addEventListener('keyup',keyUp);window.addEventListener('mouseup',mouseUp);
    renderer.domElement.addEventListener('click',()=>{if(running&&!paused&&!inventoryOpen&&!chatOpen)renderer.domElement.requestPointerLock();});
    document.addEventListener('mousemove',e=>{if(document.pointerLockElement!==renderer.domElement||!running||paused||inventoryOpen||chatOpen)return;yaw-=e.movementX*.002*sensitivity;pitch=THREE.MathUtils.clamp(pitch-e.movementY*.002*sensitivity,-1.35,1.35);});
    renderer.domElement.addEventListener('contextmenu',e=>e.preventDefault());renderer.domElement.addEventListener('mousedown',e=>{if(!running||paused||inventoryOpen||chatOpen||document.pointerLockElement!==renderer.domElement)return;if(e.button===0)held.left=true;if(e.button===2)held.right=true;});
    window.addEventListener('blur',()=>{held.left=false;held.right=false;for(const k in keys)keys[k]=false;});
    rootWheel();function rootWheel(){ROOT.addEventListener('wheel',e=>{if(!running||paused||inventoryOpen||chatOpen)return;if(e.deltaY>0){if(firstPerson){firstPerson=false;player.visible=true;cameraDistance=7;}else cameraDistance=THREE.MathUtils.clamp(cameraDistance+e.deltaY*.01,2,12);}else if(!firstPerson){cameraDistance=THREE.MathUtils.clamp(cameraDistance+e.deltaY*.01,0,12);if(cameraDistance<=.7){firstPerson=true;player.visible=false;}}},{passive:true});}

    // Mining, placing, combat
    const raycaster=new THREE.Raycaster();raycaster.far=6;
    function targetBlock(){const dir=new THREE.Vector3();camera.getWorldDirection(dir);raycaster.set(camera.position,dir);const meshes=[...chunks.values()].filter(c=>c.mesh).map(c=>c.mesh),hits=raycaster.intersectObjects(meshes,false);if(!hits.length)return null;const hit=hits[0],normal=hit.face.normal.clone().transformDirection(hit.object.matrixWorld),p=hit.point.clone().addScaledVector(normal,-.001),x=Math.floor(p.x),y=Math.floor(p.y),z=Math.floor(p.z),type=world.get(k3(x,y,z));return type?{hit,normal,x,y,z,type,key:k3(x,y,z)}:null;}
    function targetMob(){const dir=new THREE.Vector3();camera.getWorldDirection(dir);raycaster.set(camera.position,dir);const objects=[...mobs.values()].flatMap(m=>m.group.children);if(pvpEnabled)for(const r of remotePlayers.values())r.model.group.traverse(o=>{if(o.isMesh)objects.push(o);});const hits=raycaster.intersectObjects(objects,false);return hits[0]||null;}
    function miningDuration(type){const tool=inventory[selectedSlot]?.id;let n={grass:.38,dirt:.38,sand:.3,stone:1.25,oak_log:.82,oak_leaves:.2,oak_planks:.55,crafting_table:.55}[type]||.5;if(type==='stone'&&tool==='wooden_pickaxe')n=.58;if(type==='oak_log'&&tool==='wooden_axe')n=.36;return n;}
    function mineTarget(t,dt){if(!t){miningKey=null;miningProgress=0;progressFill.style.width='0%';crackMesh.visible=false;return;}if(pendingMine===t.key&&performance.now()-pendingMineAt<1200){progressFill.style.width='100%';return;}if(pendingMine&&performance.now()-pendingMineAt>=1200)pendingMine=null;if(miningKey!==t.key){miningKey=t.key;miningProgress=0;}miningProgress+=dt/miningDuration(t.type);progressFill.style.width=`${Math.min(100,miningProgress*100)}%`;crackMesh.visible=true;crackMesh.position.set(t.x+.5,t.y+.5,t.z+.5);crackMesh.material=crackMats[Math.min(9,Math.floor(miningProgress*10))];if(miningProgress>=1){if(hasAuthority())hostMine(t.x,t.y,t.z,playerId);else{sendHost({type:'mine',x:t.x,y:t.y,z:t.z});pendingMine=t.key;pendingMineAt=performance.now();}miningKey=null;miningProgress=0;progressFill.style.width='0%';crackMesh.visible=false;}}
    function placeTarget(t){if(!t||placeCooldown>0)return;const s=inventory[selectedSlot];if(!s||!placeable.includes(s.id))return;const x=t.x+Math.round(t.normal.x),y=t.y+Math.round(t.normal.y),z=t.z+Math.round(t.normal.z);if(world.has(k3(x,y,z))||overlaps(x,y,z,player.position)||!chunks.has(ck(Math.floor(x/16),Math.floor(z/16))))return;if(hasAuthority())hostPlace(x,y,z,s.id,playerId,selectedSlot);else sendHost({type:'place',x,y,z,block:s.id,slot:selectedSlot});placeCooldown=.22;}
    function tryHit(){const hit=targetMob();if(!hit)return;const mob=hit.object.userData.mob,remoteId=hit.object.userData.remotePlayer;const critical=attackCharge>=.92&&velocityY<-.1,sword=inventory[selectedSlot]?.id==='wooden_sword';if(mob){if(hasAuthority())damageMob(mob,playerId,critical,sword);else sendHost({type:'hitMob',id:mob.id,critical,sword});}else if(remoteId&&pvpEnabled){if(isHost){const factor=difficulty==='Hard'?1.35:difficulty==='Easy'?.8:1;damageRemote(remoteId,(sword?4:1)*(critical?1.5:1)*factor);}else sendHost({type:'hitPlayer',id:remoteId,critical,sword});}else return;attackCharge=0;attackCooldown=.45;localAvatar.rightArm.rotation.x=-1.2;if(critical)showToast('Critical Hit','');}

    // Loop and cleanup
    const clock={last:performance.now(),start(){this.last=performance.now();},delta(){const now=performance.now(),d=Math.min((now-this.last)/1000,.05);this.last=now;return d;}};
    function cleanup(){running=false;paused=false;document.exitPointerLock?.();disconnect();window.removeEventListener('keydown',keyDown);window.removeEventListener('keyup',keyUp);window.removeEventListener('mouseup',mouseUp);for(const c of chunks.values())disposeChunk(c);renderer.dispose();}
    function frame(){
      if(!ROOT.isConnected)return;requestAnimationFrame(frame);if(!running){renderer.render(scene,camera);return;}const dt=clock.delta();
      if(!paused&&!inventoryOpen&&!chatOpen){
        let f=(keys.KeyW?1:0)-(keys.KeyS?1:0),s=(keys.KeyD?1:0)-(keys.KeyA?1:0),moving=!!(f||s);
        if(moving){const len=Math.hypot(f,s);f/=len;s/=len;const sp=5.2,dx=(-Math.sin(yaw)*f+Math.cos(yaw)*s)*sp*dt,dz=(-Math.cos(yaw)*f-Math.sin(yaw)*s)*sp*dt,nx=player.position.x+dx,nz=player.position.z+dz;if(!collides(nx,player.position.y,player.position.z))player.position.x=nx;else if(!collides(nx,player.position.y+1,player.position.z)&&floorAt(nx,player.position.z)-player.position.y<=1.05)player.position.y+=1;if(!collides(player.position.x,player.position.y,nz))player.position.z=nz;else if(!collides(player.position.x,player.position.y+1,nz)&&floorAt(player.position.x,nz)-player.position.y<=1.05)player.position.y+=1;walking+=dt*10;}
        velocityY-=22*dt;const next=player.position.y+velocityY*dt,floor=floorAt(player.position.x,player.position.z);if(velocityY<=0&&next<=floor){player.position.y=floor;velocityY=0;grounded=true;}else if(collides(player.position.x,next,player.position.z)){velocityY=0;}else{player.position.y=next;grounded=false;}
        updateChunks();player.rotation.y=yaw;localAvatar.head.rotation.x=pitch;const sw=moving&&grounded?Math.sin(walking)*.5:0;localAvatar.leftLeg.rotation.x=sw;localAvatar.rightLeg.rotation.x=-sw;localAvatar.leftArm.rotation.x=-sw;localAvatar.rightArm.rotation.x=sw;
        const eye=new THREE.Vector3(player.position.x,player.position.y+1.62,player.position.z),dir=new THREE.Vector3(-Math.sin(yaw)*Math.cos(pitch),Math.sin(pitch),-Math.cos(yaw)*Math.cos(pitch));if(firstPerson){camera.position.copy(eye);camera.lookAt(eye.clone().add(dir));}else{camera.position.copy(eye.clone().addScaledVector(dir,-cameraDistance));camera.lookAt(eye);}
        attackCharge=Math.min(1,attackCharge+dt/.62);meter.style.width=`${attackCharge*100}%`;placeCooldown=Math.max(0,placeCooldown-dt);attackCooldown=Math.max(0,attackCooldown-dt);
        if(document.pointerLockElement===renderer.domElement){const t=targetBlock(),mh=targetMob();outline.visible=!!t;if(t)outline.position.set(t.x+.5,t.y+.5,t.z+.5);if(held.left){if(mh&&(!t||mh.distance<t.hit.distance)){miningKey=null;miningProgress=0;progressFill.style.width='0%';crackMesh.visible=false;if(attackCharge>=.92&&attackCooldown<=0)tryHit();}else mineTarget(t,dt);}else{miningKey=null;miningProgress=0;progressFill.style.width='0%';crackMesh.visible=false;}if(held.right)placeTarget(t);}else{outline.visible=false;crackMesh.visible=false;}
        if(hasAuthority()){updateMobs(dt);if(isHost){lastMobSync+=dt;if(lastMobSync>.12){lastMobSync=0;broadcast({type:'mobs',list:mobSnapshot()});}}}
        lastNetSend+=dt;if(lastNetSend>.1){lastNetSend=0;if(isHost&&connections.size)broadcast({type:'state',id:playerId,state:playerState()});else if(!isHost&&hostConn?.open)sendHost({type:'state',state:playerState()});}
        for(const r of remotePlayers.values())pose(r.model,r.state);
        if(toastTimer>0){toastTimer-=dt;if(toastTimer<=0)toast.style.display='none';}
      }
      renderer.render(scene,camera);
    }
    window.addEventListener('resize',()=>{if(!ROOT.isConnected)return;camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
    updateHotbar();updateHealth();showHome();frame();
  }
})();
