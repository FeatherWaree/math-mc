
(() => {
    document.getElementById("sparx-3d-game")?.remove();

    function load() {
        if (!window.THREE) {
            alert("Could not load the 3D engine.");
            return;
        }
        start();
    }

    if (window.THREE) {
        load();
    } else {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.min.js";
        script.onload = load;
        script.onerror = () => alert("Could not load Three.js.");
        document.head.appendChild(script);
    }

    function start() {
        const THREE = window.THREE;
        const SIZE = 16;

        // -----------------------------------------
        // GAME STATE
        // -----------------------------------------

        const root = document.createElement("div");
        root.id = "sparx-3d-game";

        Object.assign(root.style, {
            position: "fixed",
            inset: "0",
            zIndex: "999999",
            background: "#87ceeb",
            overflow: "hidden",
            fontFamily: "Arial, sans-serif"
        });

        document.body.appendChild(root);

        let running = false;
        let paused = false;
        let inventoryOpen = false;

        let firstPerson = true;
        let cameraDistance = 7;

        let yaw = 0;
        let pitch = 0.15;

        let velocityY = 0;
        let grounded = false;
        let walking = 0;

        let hp = 20;
        let worldName = "My World";
        let seed = "12345";

        let renderDistance = 2;
        let fov = 75;
        let sensitivity = 1;

        const keys = {};
        const held = { left: false, right: false };

        let selectedSlot = 0;

        let miningKey = null;
        let miningProgress = 0;
        let placeCooldown = 0;
        let attackCooldown = 0;

        let lastChunkX = null;
        let lastChunkZ = null;

        // Everything exists in memory only.
        // No localStorage, cookies or save files.

        // -----------------------------------------
        // STYLES
        // -----------------------------------------

        const style = document.createElement("style");

        style.textContent = `
            #sparx-3d-game * {
                box-sizing: border-box;
            }

            #sparx-3d-game button,
            #sparx-3d-game input {
                font-family: Arial, sans-serif;
            }

            #sparx-3d-game button {
                cursor: pointer;
            }

            .fm-screen {
                position:absolute;
                inset:0;
                z-index:20;
                display:flex;
                align-items:center;
                justify-content:center;
                background:#000b;
                color:white;
            }

            .fm-box {
                width:min(400px,90vw);
                text-align:center;
            }

            .fm-logo {
                font-size:50px;
                font-weight:1000;
                text-shadow:4px 4px #222;
                margin-bottom:30px;
            }

            .fm-button {
                display:block;
                width:100%;
                padding:14px;
                margin:10px 0;
                border:2px solid #25401e;
                background:#579b3b;
                color:white;
                font-size:17px;
                font-weight:bold;
                box-shadow:0 4px #182e15;
            }

            .fm-button:hover {
                background:#70b64c;
            }

            .fm-secondary {
                background:#555;
                border-color:#333;
                box-shadow:0 4px #222;
            }

            .fm-input {
                display:block;
                width:100%;
                padding:13px;
                margin:9px 0;
                font-size:16px;
                border:2px solid #777;
            }

            .fm-setting {
                margin:22px 0;
                text-align:left;
            }

            .fm-setting input {
                display:block;
                width:100%;
                margin-top:12px;
            }

            .fm-crosshair {
                position:absolute;
                left:50%;
                top:50%;
                width:16px;
                height:16px;
                transform:translate(-50%,-50%);
                pointer-events:none;
                z-index:5;
            }

            .fm-inventory {
                width:min(850px,95vw);
                max-height:90vh;
                overflow:auto;
                padding:20px;
                background:#c6c6c6;
                border:4px solid #555;
                color:#222;
            }

            .fm-grid {
                display:grid;
                grid-template-columns:repeat(9,minmax(20px,1fr));
                gap:4px;
            }

            .fm-slot {
                aspect-ratio:1;
                min-width:0;
                position:relative;
                display:flex;
                align-items:center;
                justify-content:center;
                background:#777;
                border:3px solid white;
                border-right-color:#444;
                border-bottom-color:#444;
                cursor:pointer;
            }

            .fm-slot.selected {
                border:3px solid #ffe68c;
            }

            .fm-icon {
                width:65%;
                height:65%;
                border:2px solid #ffffff66;
            }

            .fm-count {
                position:absolute;
                right:3px;
                bottom:0;
                font-size:12px;
                font-weight:bold;
                color:white;
                text-shadow:2px 2px black;
            }

            .fm-recipe {
                width:100%;
                padding:10px;
                margin:4px 0;
                text-align:left;
                color:white;
                background:#666;
                border:2px solid #444;
            }

            .fm-recipe:disabled {
                opacity:.4;
                cursor:not-allowed;
            }

            .fm-craft-grid {
                display:grid;
                grid-template-columns:repeat(3,36px);
                gap:4px;
                margin:12px 0;
            }

            .fm-craft-cell {
                width:36px;
                height:36px;
                background:#777;
                border:3px solid white;
                border-right-color:#444;
                border-bottom-color:#444;
            }
        `;

        root.appendChild(style);

        // -----------------------------------------
        // SCENE
        // -----------------------------------------

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x87ceeb);
        scene.fog = new THREE.Fog(0x87ceeb, 30, 95);

        const camera = new THREE.PerspectiveCamera(
            fov, innerWidth / innerHeight, 0.1, 300
        );

        const renderer = new THREE.WebGLRenderer({
            antialias: false
        });

        renderer.setSize(innerWidth, innerHeight);
        renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
        renderer.outputColorSpace = THREE.SRGBColorSpace;

        root.appendChild(renderer.domElement);

        scene.add(new THREE.HemisphereLight(
            0xffffff, 0x65734b, 2
        ));

        const sun = new THREE.DirectionalLight(0xffffff, 1.5);
        sun.position.set(30, 50, 20);
        scene.add(sun);

        // -----------------------------------------
        // ITEMS AND BLOCKS
        // -----------------------------------------

        const items = {
            grass: ["Grass", "#55a63c"],
            dirt: ["Dirt", "#79502b"],
            stone: ["Stone", "#888888"],
            oak_log: ["Oak Log", "#80502c"],
            oak_leaves: ["Oak Leaves", "#267b32"],
            sand: ["Sand", "#d9c17a"],
            oak_planks: ["Oak Planks", "#bc8a50"],
            crafting_table: ["Crafting Table", "#90613a"],
            stick: ["Stick", "#aa8150"],
            wooden_pickaxe: ["Wooden Pickaxe", "#a37b42"],
            wooden_axe: ["Wooden Axe", "#a37b42"],
            wooden_sword: ["Wooden Sword", "#a37b42"],
            rotten_flesh: ["Rotten Flesh", "#845044"]
        };

        const placeable = [
            "grass", "dirt", "stone", "oak_log",
            "oak_leaves", "sand", "oak_planks",
            "crafting_table"
        ];

        const blockMaterials = {};

        for (const id of placeable) {
            blockMaterials[id] = new THREE.MeshLambertMaterial({
                color: items[id][1],
                side: THREE.DoubleSide
            });
        }

        // Face geometry for voxel blocks.
        const faces = [
            {
                n: [0, 1, 0],
                c: [[0,1,0],[0,1,1],[1,1,1],[1,1,0]]
            },
            {
                n: [0,-1,0],
                c: [[0,0,1],[0,0,0],[1,0,0],[1,0,1]]
            },
            {
                n: [1,0,0],
                c: [[1,0,0],[1,1,0],[1,1,1],[1,0,1]]
            },
            {
                n: [-1,0,0],
                c: [[0,0,1],[0,1,1],[0,1,0],[0,0,0]]
            },
            {
                n: [0,0,1],
                c: [[1,0,1],[1,1,1],[0,1,1],[0,0,1]]
            },
            {
                n: [0,0,-1],
                c: [[0,0,0],[0,1,0],[1,1,0],[1,0,0]]
            }
        ];

        const triangleOrder = [0, 1, 2, 0, 2, 3];

        // -----------------------------------------
        // WORLD DATA
        // -----------------------------------------

        const world = new Map();
        const chunks = new Map();
        const modifications = new Map();

        function blockKey(x, y, z) {
            return `${x},${y},${z}`;
        }

        function chunkKey(x, z) {
            return `${x},${z}`;
        }

        function hashSeed(value) {
            let h = 2166136261;

            for (let i = 0; i < value.length; i++) {
                h ^= value.charCodeAt(i);
                h = Math.imul(h, 16777619);
            }

            return h >>> 0;
        }

        let seedHash = 0;

        function hash2(x, z) {
            let h = (
                seedHash +
                Math.imul(x | 0, 374761393) +
                Math.imul(z | 0, 668265263)
            ) | 0;

            h = Math.imul(h ^ (h >>> 13), 1274126177);

            return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
        }

        function smooth(t) {
            return t * t * (3 - 2 * t);
        }

        function noise(x, z) {
            const x0 = Math.floor(x);
            const z0 = Math.floor(z);

            const fx = smooth(x - x0);
            const fz = smooth(z - z0);

            const a = hash2(x0, z0);
            const b = hash2(x0 + 1, z0);
            const c = hash2(x0, z0 + 1);
            const d = hash2(x0 + 1, z0 + 1);

            const top = a + (b - a) * fx;
            const bottom = c + (d - c) * fx;

            return top + (bottom - top) * fz;
        }

        function terrainHeight(x, z) {
            const hills = noise(x * 0.04, z * 0.04);
            const details = noise(x * 0.12, z * 0.12);

            return Math.max(
                3,
                Math.floor(3 + hills * 8 + details * 3)
            );
        }

        function biomeAt(x, z) {
            return noise(x * 0.012 + 400, z * 0.012 + 400);
        }

        function storeBlock(x, y, z, type, chunk) {
            const key = blockKey(x, y, z);

            chunk.blocks.set(key, { x, y, z, type });
            world.set(key, type);
        }

        function generateChunk(cx, cz) {
            const chunk = {
                cx,
                cz,
                blocks: new Map(),
                group: null,
                meshes: []
            };

            chunks.set(chunkKey(cx, cz), chunk);

            const startX = cx * SIZE;
            const startZ = cz * SIZE;

            // Terrain
            for (let lx = 0; lx < SIZE; lx++) {
                for (let lz = 0; lz < SIZE; lz++) {
                    const x = startX + lx;
                    const z = startZ + lz;

                    const height = terrainHeight(x, z);
                    const desert = biomeAt(x, z) > 0.79;

                    for (let y = 0; y <= height; y++) {
                        let type = "stone";

                        if (y === height) {
                            type = desert ? "sand" : "grass";
                        } else if (y >= height - 3) {
                            type = desert ? "sand" : "dirt";
                        }

                        storeBlock(x, y, z, type, chunk);
                    }
                }
            }

            // Oak trees. Keep each tree inside its own chunk.
            for (let lx = 3; lx < SIZE - 3; lx += 5) {
                for (let lz = 3; lz < SIZE - 3; lz += 5) {
                    const x = startX + lx;
                    const z = startZ + lz;

                    if (hash2(x + 1500, z + 2900) < 0.52) continue;
                    if (biomeAt(x, z) > 0.79) continue;
                    if (Math.hypot(x, z) < 7) continue;

                    const h = terrainHeight(x, z);
                    const trunkHeight = 3 + Math.floor(
                        hash2(x + 10, z + 20) * 2
                    );

                    for (let y = 1; y <= trunkHeight; y++) {
                        storeBlock(
                            x, h + y, z, "oak_log", chunk
                        );
                    }

                    for (let dx = -2; dx <= 2; dx++) {
                        for (let dz = -2; dz <= 2; dz++) {
                            for (let dy = 0; dy <= 2; dy++) {
                                if (
                                    Math.abs(dx) +
                                    Math.abs(dz) +
                                    Math.abs(dy - 1) <= 4
                                ) {
                                    storeBlock(
                                        x + dx,
                                        h + trunkHeight + dy,
                                        z + dz,
                                        "oak_leaves",
                                        chunk
                                    );
                                }
                            }
                        }
                    }
                }
            }

            // Apply changes made during this session.
            for (const [key, type] of modifications) {
                const [x, y, z] = key.split(",").map(Number);

                if (
                    Math.floor(x / SIZE) !== cx ||
                    Math.floor(z / SIZE) !== cz
                ) continue;

                if (type === null) {
                    chunk.blocks.delete(key);
                    world.delete(key);
                } else {
                    storeBlock(x, y, z, type, chunk);
                }
            }
        }

        // -----------------------------------------
        // CHUNK MESH BUILDER
        // -----------------------------------------

        function removeChunkMeshes(chunk) {
            if (!chunk.group) return;

            scene.remove(chunk.group);

            for (const mesh of chunk.meshes) {
                mesh.geometry.dispose();
            }

            chunk.meshes = [];
            chunk.group = null;
        }

        function buildChunk(chunk) {
            removeChunkMeshes(chunk);

            const group = new THREE.Group();
            const meshes = [];

            for (const type of placeable) {
                const positions = [];
                const normals = [];

                for (const block of chunk.blocks.values()) {
                    if (block.type !== type) continue;

                    const { x, y, z } = block;

                    for (const face of faces) {
                        const nx = x + face.n[0];
                        const ny = y + face.n[1];
                        const nz = z + face.n[2];

                        // Hide faces touching another block.
                        if (world.has(blockKey(nx, ny, nz))) {
                            continue;
                        }

                        for (const cornerIndex of triangleOrder) {
                            const corner = face.c[cornerIndex];

                            positions.push(
                                x - chunk.cx * SIZE + corner[0],
                                y + corner[1],
                                z - chunk.cz * SIZE + corner[2]
                            );

                            normals.push(
                                face.n[0],
                                face.n[1],
                                face.n[2]
                            );
                        }
                    }
                }

                if (!positions.length) continue;

                const geometry = new THREE.BufferGeometry();

                geometry.setAttribute(
                    "position",
                    new THREE.Float32BufferAttribute(positions, 3)
                );

                geometry.setAttribute(
                    "normal",
                    new THREE.Float32BufferAttribute(normals, 3)
                );

                const mesh = new THREE.Mesh(
                    geometry,
                    blockMaterials[type]
                );

                group.add(mesh);
                meshes.push(mesh);
            }

            group.position.set(
                chunk.cx * SIZE,
                0,
                chunk.cz * SIZE
            );

            scene.add(group);

            chunk.group = group;
            chunk.meshes = meshes;
        }

        function rebuildAllChunks() {
            for (const chunk of chunks.values()) {
                buildChunk(chunk);
            }
        }

        function removeChunk(cx, cz) {
            const key = chunkKey(cx, cz);
            const chunk = chunks.get(key);

            if (!chunk) return;

            removeChunkMeshes(chunk);

            for (const block of chunk.blocks.values()) {
                world.delete(
                    blockKey(block.x, block.y, block.z)
                );
            }

            chunks.delete(key);
        }

        function updateChunks(force = false) {
            const cx = Math.floor(player.position.x / SIZE);
            const cz = Math.floor(player.position.z / SIZE);

            if (
                !force &&
                cx === lastChunkX &&
                cz === lastChunkZ
            ) return;

            lastChunkX = cx;
            lastChunkZ = cz;

            const wanted = new Set();
            const radius = renderDistance;

            for (let x = -radius; x <= radius; x++) {
                for (let z = -radius; z <= radius; z++) {
                    wanted.add(chunkKey(cx + x, cz + z));
                }
            }

            let changed = false;

            for (const chunk of [...chunks.values()]) {
                if (!wanted.has(chunkKey(chunk.cx, chunk.cz))) {
                    removeChunk(chunk.cx, chunk.cz);
                    changed = true;
                }
            }

            for (let x = -radius; x <= radius; x++) {
                for (let z = -radius; z <= radius; z++) {
                    const nx = cx + x;
                    const nz = cz + z;

                    if (!chunks.has(chunkKey(nx, nz))) {
                        generateChunk(nx, nz);
                        changed = true;
                    }
                }
            }

            if (changed) rebuildAllChunks();
        }

        function changeBlock(x, y, z, type) {
            x = Math.floor(x);
            y = Math.floor(y);
            z = Math.floor(z);

            const key = blockKey(x, y, z);

            const cx = Math.floor(x / SIZE);
            const cz = Math.floor(z / SIZE);

            const chunk = chunks.get(chunkKey(cx, cz));

            if (!chunk) return;

            if (type === null) {
                chunk.blocks.delete(key);
                world.delete(key);
            } else {
                chunk.blocks.set(key, { x, y, z, type });
                world.set(key, type);
            }

            modifications.set(key, type);

            const affected = [[cx, cz]];

            if (x % SIZE === 0) affected.push([cx - 1, cz]);
            if ((x + 1) % SIZE === 0) affected.push([cx + 1, cz]);
            if (z % SIZE === 0) affected.push([cx, cz - 1]);
            if ((z + 1) % SIZE === 0) affected.push([cx, cz + 1]);

            for (const [ax, az] of affected) {
                const nearby = chunks.get(chunkKey(ax, az));
                if (nearby) buildChunk(nearby);
            }
        }

        // -----------------------------------------
        // PLAYER CHARACTER
        // -----------------------------------------

        const player = new THREE.Group();
        scene.add(player);

        function part(parent, w, h, d, material, x, y, z) {
            const mesh = new THREE.Mesh(
                new THREE.BoxGeometry(w, h, d),
                material
            );

            mesh.position.set(x, y, z);
            parent.add(mesh);
            return mesh;
        }

        const skin = new THREE.MeshLambertMaterial({
            color: 0xe0aa78
        });

        const shirt = new THREE.MeshLambertMaterial({
            color: 0x2464c4
        });

        const trousers = new THREE.MeshLambertMaterial({
            color: 0x303b75
        });

        const black = new THREE.MeshLambertMaterial({
            color: 0x222222
        });

        const leftLeg = new THREE.Group();
        leftLeg.position.set(-0.23, 0.85, 0);
        player.add(leftLeg);

        part(leftLeg, 0.35, 0.85, 0.4, trousers, 0, -0.4, 0);

        const rightLeg = new THREE.Group();
        rightLeg.position.set(0.23, 0.85, 0);
        player.add(rightLeg);

        part(rightLeg, 0.35, 0.85, 0.4, trousers, 0, -0.4, 0);

        part(player, 0.9, 0.9, 0.45, shirt, 0, 1.25, 0);
        part(player, 0.7, 0.7, 0.7, skin, 0, 2.1, 0);

        part(player, 0.12, 0.12, 0.05, black, -0.17, 2.2, -0.36);
        part(player, 0.12, 0.12, 0.05, black, 0.17, 2.2, -0.36);

        const leftArm = new THREE.Group();
        leftArm.position.set(-0.57, 1.65, 0);
        player.add(leftArm);

        part(leftArm, 0.3, 0.9, 0.35, shirt, 0, -0.4, 0);

        const rightArm = new THREE.Group();
        rightArm.position.set(0.57, 1.65, 0);
        player.add(rightArm);

        part(rightArm, 0.3, 0.9, 0.35, shirt, 0, -0.4, 0);

        // Name tag
        const nameCanvas = document.createElement("canvas");
        nameCanvas.width = 512;
        nameCanvas.height = 128;

        const nameContext = nameCanvas.getContext("2d");

        nameContext.fillStyle = "#0009";
        nameContext.fillRect(0, 0, 512, 128);

        nameContext.font = "bold 65px Arial";
        nameContext.textAlign = "center";
        nameContext.fillStyle = "white";
        nameContext.fillText("Falleen", 256, 85);

        const nameTexture = new THREE.CanvasTexture(nameCanvas);

        const nameTag = new THREE.Sprite(
            new THREE.SpriteMaterial({
                map: nameTexture,
                transparent: true,
                depthTest: false
            })
        );

        nameTag.scale.set(2.3, 0.58, 1);
        nameTag.position.y = 3.15;
        player.add(nameTag);

        player.visible = false;

        // -----------------------------------------
        // COLLISION AND TERRAIN HEIGHT
        // -----------------------------------------

        const playerRadius = 0.3;
        const playerHeight = 1.8;

        function groundAt(x, z) {
            const bx = Math.floor(x);
            const bz = Math.floor(z);

            for (let y = 100; y >= 0; y--) {
                if (world.has(blockKey(bx, y, bz))) {
                    return y + 1;
                }
            }

            return 0;
        }

        function floorAt(x, z) {
            return Math.max(
                groundAt(x - 0.25, z - 0.25),
                groundAt(x + 0.25, z - 0.25),
                groundAt(x - 0.25, z + 0.25),
                groundAt(x + 0.25, z + 0.25)
            );
        }

        function collides(x, y, z) {
            const minX = Math.floor(x - playerRadius);
            const maxX = Math.floor(x + playerRadius);
            const minY = Math.floor(y + 0.001);
            const maxY = Math.floor(y + playerHeight - 0.001);
            const minZ = Math.floor(z - playerRadius);
            const maxZ = Math.floor(z + playerRadius);

            for (let bx = minX; bx <= maxX; bx++) {
                for (let by = minY; by <= maxY; by++) {
                    for (let bz = minZ; bz <= maxZ; bz++) {
                        if (world.has(blockKey(bx, by, bz))) {
                            return true;
                        }
                    }
                }
            }

            return false;
        }

        // -----------------------------------------
        // INVENTORY
        // -----------------------------------------

        let inventory = Array(36).fill(null);

        function countItem(id) {
            return inventory.reduce(
                (total, slot) =>
                    total + (slot?.id === id ? slot.count : 0),
                0
            );
        }

        function addItem(id, amount = 1) {
            if (!items[id]) return;

            const maxStack = id.startsWith("wooden_") ? 1 : 64;

            for (const slot of inventory) {
                if (
                    slot &&
                    slot.id === id &&
                    slot.count < maxStack
                ) {
                    const n = Math.min(
                        maxStack - slot.count,
                        amount
                    );

                    slot.count += n;
                    amount -= n;

                    if (amount <= 0) break;
                }
            }

            for (let i = 0; i < inventory.length && amount > 0; i++) {
                if (!inventory[i]) {
                    const n = Math.min(maxStack, amount);

                    inventory[i] = { id, count: n };
                    amount -= n;
                }
            }

            updateHotbar();

            if (inventoryOpen) renderInventory();
        }

        function consumeItems(costs) {
            for (const [id, amount] of Object.entries(costs)) {
                if (countItem(id) < amount) return false;
            }

            for (const [id, amount] of Object.entries(costs)) {
                let remaining = amount;

                for (let i = 0; i < inventory.length; i++) {
                    const slot = inventory[i];

                    if (!slot || slot.id !== id) continue;

                    const used = Math.min(slot.count, remaining);

                    slot.count -= used;
                    remaining -= used;

                    if (slot.count <= 0) inventory[i] = null;
                    if (remaining <= 0) break;
                }
            }

            return true;
        }

        const recipes = [
            {
                title: "4 Oak Planks",
                output: "oak_planks",
                amount: 4,
                costs: { oak_log: 1 },
                bench: false
            },
            {
                title: "4 Sticks",
                output: "stick",
                amount: 4,
                costs: { oak_planks: 2 },
                bench: false
            },
            {
                title: "Crafting Table",
                output: "crafting_table",
                amount: 1,
                costs: { oak_planks: 4 },
                bench: false
            },
            {
                title: "Wooden Pickaxe",
                output: "wooden_pickaxe",
                amount: 1,
                costs: { oak_planks: 3, stick: 2 },
                bench: true
            },
            {
                title: "Wooden Axe",
                output: "wooden_axe",
                amount: 1,
                costs: { oak_planks: 3, stick: 2 },
                bench: true
            },
            {
                title: "Wooden Sword",
                output: "wooden_sword",
                amount: 1,
                costs: { oak_planks: 2, stick: 1 },
                bench: true
            }
        ];

        function nearCraftingTable() {
            const px = Math.floor(player.position.x);
            const py = Math.floor(player.position.y);
            const pz = Math.floor(player.position.z);

            for (let x = px - 5; x <= px + 5; x++) {
                for (let z = pz - 5; z <= pz + 5; z++) {
                    for (let y = py - 2; y <= py + 2; y++) {
                        if (
                            world.get(blockKey(x, y, z)) ===
                            "crafting_table"
                        ) return true;
                    }
                }
            }

            return false;
        }

        // -----------------------------------------
        // MAIN HUD
        // -----------------------------------------

        const crosshair = document.createElement("div");
        crosshair.className = "fm-crosshair";

        crosshair.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16">
                <path d="M8 1V6 M8 10V15 M1 8H6 M10 8H15"
                stroke="white" stroke-width="2"/>
                <path d="M8 1V6 M8 10V15 M1 8H6 M10 8H15"
                stroke="black" stroke-width=".7"/>
            </svg>
        `;

        root.appendChild(crosshair);

        // Crosshair stays in the middle in both camera modes.

        const hearts = document.createElement("div");

        Object.assign(hearts.style, {
            position: "absolute",
            left: "18px",
            top: "18px",
            fontSize: "24px",
            letterSpacing: "2px",
            textShadow: "2px 2px black",
            zIndex: "5",
            pointerEvents: "none"
        });

        root.appendChild(hearts);

        function updateHearts() {
            let html = "";

            for (let i = 0; i < 10; i++) {
                html += hp >= (i + 1) * 2
                    ? '<span style="color:#ed3737">♥</span>'
                    : hp > i * 2
                        ? '<span style="color:#e69a9a">♥</span>'
                        : '<span style="color:#555">♥</span>';
            }

            hearts.innerHTML = html;
        }

        const hotbar = document.createElement("div");

        Object.assign(hotbar.style, {
            position: "absolute",
            left: "50%",
            bottom: "18px",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "3px",
            zIndex: "6"
        });

        root.appendChild(hotbar);

        function updateHotbar() {
            hotbar.innerHTML = "";

            for (let i = 0; i < 9; i++) {
                const slot = inventory[i];

                const cell = document.createElement("div");

                Object.assign(cell.style, {
                    width: "48px",
                    height: "48px",
                    position: "relative",
                    background: i === selectedSlot ? "#ffffff88" : "#222b",
                    border: i === selectedSlot
                        ? "3px solid white"
                        : "2px solid #999",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                });

                if (slot) {
                    const icon = document.createElement("div");

                    Object.assign(icon.style, {
                        width: "24px",
                        height: "24px",
                        background: items[slot.id][1],
                        border: "2px solid #ffffff77"
                    });

                    cell.appendChild(icon);

                    const count = document.createElement("span");
                    count.textContent = slot.count;

                    Object.assign(count.style, {
                        position: "absolute",
                        right: "2px",
                        bottom: "0",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "12px",
                        textShadow: "2px 2px black"
                    });

                    cell.appendChild(count);
                }

                const number = document.createElement("span");
                number.textContent = i + 1;

                Object.assign(number.style, {
                    position: "absolute",
                    top: "0",
                    left: "3px",
                    color: "white",
                    fontSize: "9px",
                    textShadow: "1px 1px black"
                });

                cell.appendChild(number);
                hotbar.appendChild(cell);
            }
        }

        const miningBar = document.createElement("div");

        Object.assign(miningBar.style, {
            position: "absolute",
            top: "calc(50% + 18px)",
            left: "50%",
            transform: "translateX(-50%)",
            width: "100px",
            height: "5px",
            background: "#0009",
            zIndex: "5",
            pointerEvents: "none"
        });

        const miningFill = document.createElement("div");

        Object.assign(miningFill.style, {
            height: "100%",
            width: "0%",
            background: "white"
        });

        miningBar.appendChild(miningFill);
        root.appendChild(miningBar);

        // -----------------------------------------
        // INVENTORY WINDOW
        // -----------------------------------------

        const inventoryScreen = document.createElement("div");
        inventoryScreen.className = "fm-screen";
        inventoryScreen.style.display = "none";
        inventoryScreen.style.background = "#0009";

        root.appendChild(inventoryScreen);

        function canCraft(recipe, bench) {
            if (recipe.bench && !bench) return false;

            return Object.entries(recipe.costs).every(
                ([id, amount]) => countItem(id) >= amount
            );
        }

        function renderInventory() {
            const bench = nearCraftingTable();

            inventoryScreen.innerHTML = `
                <div class="fm-inventory">
                    <div style="display:flex;justify-content:space-between;
                    align-items:center;margin-bottom:16px">
                        <strong style="font-size:22px">Inventory</strong>
                        <button id="fm-close">X</button>
                    </div>

                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:22px">
                        <section>
                            <div style="font-weight:bold;margin-bottom:8px">
                                Items
                            </div>
                            <div id="fm-item-grid" class="fm-grid"></div>
                        </section>

                        <section>
                            <div style="font-weight:bold">
                                ${bench ? "Crafting Table" : "Crafting"}
                            </div>

                            <div class="fm-craft-grid">
                                ${Array.from(
                                    { length: bench ? 9 : 4 },
                                    () => '<div class="fm-craft-cell"></div>'
                                ).join("")}
                            </div>

                            <div style="font-weight:bold;margin:12px 0 6px">
                                Recipes
                            </div>
                            <div id="fm-recipes"></div>
                        </section>
                    </div>
                </div>
            `;

            const grid = inventoryScreen.querySelector("#fm-item-grid");

            inventory.forEach((slot, index) => {
                const cell = document.createElement("button");
                cell.className = "fm-slot";

                if (index === selectedSlot) {
                    cell.classList.add("selected");
                }

                if (slot) {
                    const icon = document.createElement("div");
                    icon.className = "fm-icon";
                    icon.style.background = items[slot.id][1];
                    cell.appendChild(icon);

                    const count = document.createElement("span");
                    count.className = "fm-count";
                    count.textContent = slot.count;
                    cell.appendChild(count);

                    cell.title = items[slot.id][0];
                }

                cell.onclick = () => {
                    if (index < 9) {
                        selectedSlot = index;
                    } else {
                        const temp = inventory[selectedSlot];
                        inventory[selectedSlot] = inventory[index];
                        inventory[index] = temp;
                    }

                    updateHotbar();
                    renderInventory();
                };

                grid.appendChild(cell);
            });

            const recipeList = inventoryScreen.querySelector(
                "#fm-recipes"
            );

            for (const recipe of recipes) {
                if (recipe.bench && !bench) continue;

                const button = document.createElement("button");
                button.className = "fm-recipe";

                const costText = Object.entries(recipe.costs)
                    .map(([id, count]) =>
                        `${count} × ${items[id][0]}`
                    )
                    .join(" + ");

                button.innerHTML = `
                    <strong>${recipe.title}</strong>
                    <div style="font-size:11px;margin-top:4px">
                        ${costText}
                    </div>
                `;

                button.disabled = !canCraft(recipe, bench);

                button.onclick = () => {
                    if (!canCraft(recipe, bench)) return;

                    consumeItems(recipe.costs);
                    addItem(recipe.output, recipe.amount);

                    renderInventory();
                };

                recipeList.appendChild(button);
            }

            inventoryScreen.querySelector("#fm-close").onclick =
                closeInventory;
        }

        function openInventory() {
            if (!running || paused) return;

            inventoryOpen = true;
            held.left = false;
            held.right = false;

            document.exitPointerLock?.();

            renderInventory();
            inventoryScreen.style.display = "flex";
        }

        function closeInventory() {
            inventoryOpen = false;
            inventoryScreen.style.display = "none";
        }

        // -----------------------------------------
        // ZOMBIES
        // -----------------------------------------

        const mobs = [];

        function spawnZombie(x, z) {
            const zombie = new THREE.Group();

            const green = new THREE.MeshLambertMaterial({
                color: 0x478b43
            });

            const purple = new THREE.MeshLambertMaterial({
                color: 0x393b79
            });

            const eye = new THREE.MeshLambertMaterial({
                color: 0x111111
            });

            part(zombie, .8, .95, .4, green, 0, .95, 0);
            part(zombie, .58, .58, .58, green, 0, 1.72, 0);

            part(zombie, .13, .1, .05, eye, -.14, 1.8, -.3);
            part(zombie, .13, .1, .05, eye, .14, 1.8, -.3);

            part(zombie, .3, .9, .35, green, -.55, .95, 0);
            part(zombie, .3, .9, .35, green, .55, .95, 0);

            part(zombie, .3, .85, .35, purple, -.2, .42, 0);
            part(zombie, .3, .85, .35, purple, .2, .42, 0);

            zombie.position.set(
                x + .5,
                groundAt(x, z),
                z + .5
            );

            const mob = {
                group: zombie,
                hp: 3,
                attackTimer: 0
            };

            for (const child of zombie.children) {
                child.userData.mob = mob;
            }

            scene.add(zombie);
            mobs.push(mob);
        }

        function removeMob(mob) {
            scene.remove(mob.group);

            const index = mobs.indexOf(mob);
            if (index !== -1) mobs.splice(index, 1);
        }

        function attackMob(mob) {
            if (!mob || attackCooldown > 0) return;

            const heldItem = inventory[selectedSlot]?.id;

            mob.hp -= heldItem === "wooden_sword" ? 2 : 1;
            attackCooldown = 0.5;

            if (mob.hp <= 0) {
                removeMob(mob);
                addItem("rotten_flesh", 1);
            }
        }

        let mobSpawnTimer = 0;
        let zombieSpawned = false;

        function damagePlayer(amount) {
            hp = Math.max(0, hp - amount);
            updateHearts();

            if (hp <= 0) {
                hp = 20;
                player.position.set(
                    spawnPoint.x,
                    spawnPoint.y,
                    spawnPoint.z
                );
                velocityY = 0;
                updateHearts();
            }
        }

        function updateMobs(dt) {
            mobSpawnTimer += dt;

            if (!zombieSpawned) {
                for (let i = 0; i < 3; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const distance = 15 + Math.random() * 5;

                    const x = Math.floor(
                        player.position.x + Math.cos(angle) * distance
                    );

                    const z = Math.floor(
                        player.position.z + Math.sin(angle) * distance
                    );

                    spawnZombie(x, z);
                }

                zombieSpawned = true;
            }

            for (const mob of [...mobs]) {
                const dx = player.position.x - mob.group.position.x;
                const dz = player.position.z - mob.group.position.z;
                const distance = Math.hypot(dx, dz);

                if (distance < 28 && distance > 1.3) {
                    const speed = 1.05 * dt;

                    const nx = mob.group.position.x + dx / distance * speed;
                    const nz = mob.group.position.z + dz / distance * speed;

                    if (!collides(nx, mob.group.position.y, nz)) {
                        mob.group.position.x = nx;
                        mob.group.position.z = nz;
                    }

                    mob.group.rotation.y = Math.atan2(-dx, -dz);
                    mob.group.position.y = groundAt(
                        mob.group.position.x,
                        mob.group.position.z
                    );
                }

                mob.attackTimer -= dt;

                if (distance < 1.4 && mob.attackTimer <= 0) {
                    damagePlayer(2);
                    mob.attackTimer = 1.5;
                }
            }
        }

        // -----------------------------------------
        // MINING AND PLACING
        // -----------------------------------------

        const raycaster = new THREE.Raycaster();
        raycaster.far = 6;

        function getBlockTarget() {
            const direction = new THREE.Vector3();

            camera.getWorldDirection(direction);
            raycaster.set(camera.position, direction);

            const meshes = [];

            for (const chunk of chunks.values()) {
                meshes.push(...chunk.meshes);
            }

            const hits = raycaster.intersectObjects(meshes, false);

            if (!hits.length) return null;

            const hit = hits[0];

            const normal = hit.face.normal.clone();
            normal.transformDirection(hit.object.matrixWorld);

            const point = hit.point.clone().addScaledVector(
                normal, -0.001
            );

            const x = Math.floor(point.x);
            const y = Math.floor(point.y);
            const z = Math.floor(point.z);

            const type = world.get(blockKey(x, y, z));

            if (!type) return null;

            return {
                hit,
                normal,
                x,
                y,
                z,
                type,
                key: blockKey(x, y, z)
            };
        }

        function getMobTarget() {
            const direction = new THREE.Vector3();

            camera.getWorldDirection(direction);
            raycaster.set(camera.position, direction);

            const hits = raycaster.intersectObjects(
                mobs.map(mob => mob.group),
                true
            );

            return hits.length ? hits[0] : null;
        }

        function mineDuration(type) {
            const tool = inventory[selectedSlot]?.id;

            let duration = {
                grass: .38,
                dirt: .38,
                sand: .3,
                stone: 1.1,
                oak_log: .8,
                oak_leaves: .2,
                oak_planks: .52,
                crafting_table: .52
            }[type] || .5;

            if (type === "stone" && tool === "wooden_pickaxe") {
                duration = .52;
            }

            if (type === "oak_log" && tool === "wooden_axe") {
                duration = .35;
            }

            return duration;
        }

        function mineBlock(target, dt) {
            if (!target) {
                miningKey = null;
                miningProgress = 0;
                return;
            }

            if (miningKey !== target.key) {
                miningKey = target.key;
                miningProgress = 0;
            }

            miningProgress += dt / mineDuration(target.type);

            miningFill.style.width =
                `${Math.min(100, miningProgress * 100)}%`;

            if (miningProgress >= 1) {
                let drop = target.type;

                if (drop === "grass") drop = "dirt";

                if (
                    target.type !== "oak_leaves" ||
                    Math.random() < .65
                ) {
                    addItem(drop, 1);
                }

                changeBlock(
                    target.x, target.y, target.z, null
                );

                miningKey = null;
                miningProgress = 0;
                miningFill.style.width = "0%";
            }
        }

        function placeBlock(target) {
            if (!target || placeCooldown > 0) return;

            const slot = inventory[selectedSlot];
            if (!slot) return;

            if (!placeable.includes(slot.id)) return;

            const x = target.x + Math.round(target.normal.x);
            const y = target.y + Math.round(target.normal.y);
            const z = target.z + Math.round(target.normal.z);

            if (world.has(blockKey(x, y, z))) return;

            // Prevent placing a block inside the player.
            const overlaps =
                player.position.x + playerRadius > x &&
                player.position.x - playerRadius < x + 1 &&
                player.position.y + playerHeight > y &&
                player.position.y < y + 1 &&
                player.position.z + playerRadius > z &&
                player.position.z - playerRadius < z + 1;

            if (overlaps) return;

            const cx = Math.floor(x / SIZE);
            const cz = Math.floor(z / SIZE);

            if (!chunks.has(chunkKey(cx, cz))) return;

            changeBlock(x, y, z, slot.id);

            slot.count--;

            if (slot.count <= 0) {
                inventory[selectedSlot] = null;
            }

            updateHotbar();
            placeCooldown = .2;
        }

        // -----------------------------------------
        // WORLD MENU
        // -----------------------------------------

        const menu = document.createElement("div");
        menu.className = "fm-screen";
        root.appendChild(menu);

        function showHome() {
            menu.style.display = "flex";

            menu.innerHTML = `
                <div class="fm-box">
                    <div class="fm-logo">FeatherMC</div>

                    <button class="fm-button" id="fm-single">
                        Singleplayer
                    </button>

                    <button class="fm-button fm-secondary" id="fm-settings">
                        Settings
                    </button>

                    <button class="fm-button fm-secondary" id="fm-exit">
                        Exit Game
                    </button>
                </div>
            `;

            menu.querySelector("#fm-single").onclick =
                showCreateWorld;

            menu.querySelector("#fm-settings").onclick =
                () => showSettings("home");

            menu.querySelector("#fm-exit").onclick = () => {
                cleanup();
                root.remove();
            };
        }

        function showCreateWorld() {
            menu.style.display = "flex";

            menu.innerHTML = `
                <div class="fm-box">
                    <div style="font-size:30px;font-weight:bold;margin-bottom:22px">
                        Create World
                    </div>

                    <input id="fm-name" class="fm-input"
                        placeholder="World name" value="My World">

                    <input id="fm-seed" class="fm-input"
                        placeholder="Seed" value="${Math.floor(Math.random() * 99999999)}">

                    <button class="fm-button" id="fm-create">
                        Create World
                    </button>

                    <button class="fm-button fm-secondary" id="fm-back">
                        Back
                    </button>
                </div>
            `;

            menu.querySelector("#fm-create").onclick = () => {
                worldName =
                    menu.querySelector("#fm-name").value ||
                    "My World";

                seed =
                    menu.querySelector("#fm-seed").value ||
                    "12345";

                startWorld();
            };

            menu.querySelector("#fm-back").onclick = showHome;
        }

        // -----------------------------------------
        // SETTINGS
        // -----------------------------------------

        function showSettings(returnTo) {
            menu.style.display = "flex";

            menu.innerHTML = `
                <div class="fm-box" style="text-align:left">
                    <div style="font-size:30px;font-weight:bold;text-align:center">
                        Settings
                    </div>

                    <div class="fm-setting">
                        <label>
                            Render Distance:
                            <strong id="fm-rd-value">${renderDistance}</strong>
                        </label>
                        <input type="range" id="fm-rd"
                            min="1" max="4" value="${renderDistance}">
                    </div>

                    <div class="fm-setting">
                        <label>
                            Field of View:
                            <strong id="fm-fov-value">${fov}</strong>
                        </label>
                        <input type="range" id="fm-fov"
                            min="60" max="110" value="${fov}">
                    </div>

                    <div class="fm-setting">
                        <label>
                            Mouse Sensitivity:
                            <strong id="fm-sens-value">${sensitivity.toFixed(1)}</strong>
                        </label>
                        <input type="range" id="fm-sens"
                            min=".2" max="3" step=".1" value="${sensitivity}">
                    </div>

                    <button class="fm-button" id="fm-done">
                        Done
                    </button>
                </div>
            `;

            const rd = menu.querySelector("#fm-rd");
            const f = menu.querySelector("#fm-fov");
            const s = menu.querySelector("#fm-sens");

            rd.oninput = () => {
                renderDistance = Number(rd.value);
                menu.querySelector("#fm-rd-value").textContent = rd.value;

                if (running) {
                    lastChunkX = null;
                    updateChunks(true);
                }
            };

            f.oninput = () => {
                fov = Number(f.value);
                camera.fov = fov;
                camera.updateProjectionMatrix();

                menu.querySelector("#fm-fov-value").textContent = fov;
            };

            s.oninput = () => {
                sensitivity = Number(s.value);
                menu.querySelector("#fm-sens-value").textContent =
                    sensitivity.toFixed(1);
            };

            menu.querySelector("#fm-done").onclick = () => {
                if (returnTo === "pause") showPause();
                else showHome();
            };
        }

        // -----------------------------------------
        // PAUSE MENU
        // -----------------------------------------

        function openPause() {
            if (!running || paused || inventoryOpen) return;

            paused = true;

            held.left = false;
            held.right = false;

            document.exitPointerLock?.();
            showPause();
        }

        function showPause() {
            menu.style.display = "flex";

            menu.innerHTML = `
                <div class="fm-box">
                    <div style="font-size:36px;font-weight:bold;margin-bottom:22px">
                        Paused
                    </div>

                    <button class="fm-button" id="fm-resume">
                        Resume
                    </button>

                    <button class="fm-button fm-secondary" id="fm-pause-settings">
                        Settings
                    </button>

                    <button class="fm-button fm-secondary" id="fm-home">
                        Main Menu
                    </button>

                    <button class="fm-button fm-secondary" id="fm-pause-exit">
                        Exit Game
                    </button>
                </div>
            `;

            menu.querySelector("#fm-resume").onclick = () => {
                paused = false;
                menu.style.display = "none";
                renderer.domElement.requestPointerLock();
            };

            menu.querySelector("#fm-pause-settings").onclick =
                () => showSettings("pause");

            menu.querySelector("#fm-home").onclick = () => {
                running = false;
                paused = false;
                document.exitPointerLock?.();
                showHome();
            };

            menu.querySelector("#fm-pause-exit").onclick = () => {
                cleanup();
                root.remove();
            };
        }

        // -----------------------------------------
        // START WORLD
        // -----------------------------------------

        let spawnPoint = { x: .5, y: 10, z: .5 };

        function startWorld() {
            seedHash = hashSeed(seed);

            world.clear();
            chunks.clear();
            modifications.clear();

            // Clear old chunk meshes.
            for (const child of [...scene.children]) {
                if (child.userData?.isChunk) {
                    scene.remove(child);
                }
            }

            for (const mob of [...mobs]) {
                removeMob(mob);
            }

            inventory = Array(36).fill(null);
            selectedSlot = 0;

            hp = 20;
            velocityY = 0;

            player.position.set(.5, 20, .5);

            lastChunkX = null;
            lastChunkZ = null;

            updateChunks(true);

            player.position.y = floorAt(
                player.position.x,
                player.position.z
            );

            spawnPoint = {
                x: player.position.x,
                y: player.position.y,
                z: player.position.z
            };

            yaw = 0;
            pitch = .15;
            firstPerson = true;
            cameraDistance = 7;

            player.visible = false;

            zombieSpawned = false;
            mobSpawnTimer = 0;

            running = true;
            paused = false;
            inventoryOpen = false;

            menu.style.display = "none";
            inventoryScreen.style.display = "none";

            updateHotbar();
            updateHearts();

            renderer.domElement.requestPointerLock();

            clock.start();
        }

        // -----------------------------------------
        // INPUT
        // -----------------------------------------

        function keyDown(e) {
            if (!running) return;

            if (e.code === "Escape") {
                if (inventoryOpen) {
                    closeInventory();
                } else if (!paused) {
                    openPause();
                }
                return;
            }

            if (paused || inventoryOpen) return;

            keys[e.code] = true;

            if (e.code === "Space") {
                e.preventDefault();

                if (grounded) {
                    velocityY = 8;
                    grounded = false;
                }
            }

            if (e.code === "KeyE") {
                openInventory();
            }

            if (e.code === "KeyV") {
                firstPerson = !firstPerson;
                player.visible = !firstPerson;
            }

            if (e.code.startsWith("Digit")) {
                const number = Number(e.code.slice(5));

                if (number >= 1 && number <= 9) {
                    selectedSlot = number - 1;
                    updateHotbar();
                }
            }
        }

        function keyUp(e) {
            keys[e.code] = false;
        }

        window.addEventListener("keydown", keyDown);
        window.addEventListener("keyup", keyUp);

        renderer.domElement.addEventListener("click", () => {
            if (running && !paused && !inventoryOpen) {
                renderer.domElement.requestPointerLock();
            }
        });

        document.addEventListener("mousemove", e => {
            if (
                document.pointerLockElement !== renderer.domElement ||
                !running ||
                paused ||
                inventoryOpen
            ) return;

            yaw -= e.movementX * .002 * sensitivity;
            pitch -= e.movementY * .002 * sensitivity;

            pitch = THREE.MathUtils.clamp(
                pitch, -1.45, 1.45
            );
        });

        renderer.domElement.addEventListener("contextmenu", e => {
            e.preventDefault();
        });

        renderer.domElement.addEventListener("mousedown", e => {
            if (
                !running ||
                paused ||
                inventoryOpen ||
                document.pointerLockElement !== renderer.domElement
            ) return;

            if (e.button === 0) held.left = true;
            if (e.button === 2) held.right = true;
        });

        function mouseUp(e) {
            if (e.button === 0) {
                held.left = false;
                miningKey = null;
                miningProgress = 0;
                miningFill.style.width = "0%";
            }

            if (e.button === 2) held.right = false;
        }

        window.addEventListener("mouseup", mouseUp);

        root.addEventListener("wheel", e => {
            if (!running || paused || inventoryOpen) return;

            if (e.deltaY > 0) {
                if (firstPerson) {
                    firstPerson = false;
                    player.visible = true;
                    cameraDistance = 7;
                } else {
                    cameraDistance = THREE.MathUtils.clamp(
                        cameraDistance + e.deltaY * .01,
                        2, 12
                    );
                }
            } else if (!firstPerson) {
                cameraDistance = THREE.MathUtils.clamp(
                    cameraDistance + e.deltaY * .01,
                    0, 12
                );

                if (cameraDistance <= .7) {
                    firstPerson = true;
                    player.visible = false;
                }
            }
        }, { passive: true });

        window.addEventListener("blur", () => {
            held.left = false;
            held.right = false;

            for (const key in keys) keys[key] = false;
        });

        // -----------------------------------------
        // GAME LOOP
        // -----------------------------------------

        const clock = new THREE.Clock();

        function animate() {
            if (!root.isConnected) return;

            requestAnimationFrame(animate);

            if (!running) return;

            const dt = Math.min(clock.getDelta(), .05);

            if (!paused && !inventoryOpen) {
                // Movement
                let forward = 0;
                let sideways = 0;

                if (keys.KeyW) forward++;
                if (keys.KeyS) forward--;
                if (keys.KeyD) sideways++;
                if (keys.KeyA) sideways--;

                const moving = forward !== 0 || sideways !== 0;

                if (moving) {
                    const length = Math.hypot(forward, sideways);

                    forward /= length;
                    sideways /= length;

                    const speed = 5.2;

                    const dx = (
                        -Math.sin(yaw) * forward +
                        Math.cos(yaw) * sideways
                    ) * speed * dt;

                    const dz = (
                        -Math.cos(yaw) * forward -
                        Math.sin(yaw) * sideways
                    ) * speed * dt;

                    if (!collides(
                        player.position.x + dx,
                        player.position.y,
                        player.position.z
                    )) {
                        player.position.x += dx;
                    }

                    if (!collides(
                        player.position.x,
                        player.position.y,
                        player.position.z + dz
                    )) {
                        player.position.z += dz;
                    }

                    walking += dt * 10;
                }

                // Gravity and ground collision
                velocityY -= 22 * dt;

                const nextY = player.position.y + velocityY * dt;
                const floorY = floorAt(
                    player.position.x,
                    player.position.z
                );

                if (velocityY <= 0 && nextY <= floorY) {
                    player.position.y = floorY;
                    velocityY = 0;
                    grounded = true;
                } else if (collides(
                    player.position.x,
                    nextY,
                    player.position.z
                )) {
                    velocityY = 0;
                } else {
                    player.position.y = nextY;
                    grounded = false;
                }

                // Keep world loading around player.
                updateChunks();

                // Walking animation
                const swing = moving && grounded
                    ? Math.sin(walking) * .55
                    : 0;

                leftLeg.rotation.x = swing;
                rightLeg.rotation.x = -swing;
                leftArm.rotation.x = -swing;
                rightArm.rotation.x = swing;

                // Camera direction
                const eye = new THREE.Vector3(
                    player.position.x,
                    player.position.y + 1.62,
                    player.position.z
                );

                const direction = new THREE.Vector3(
                    -Math.sin(yaw) * Math.cos(pitch),
                    Math.sin(pitch),
                    -Math.cos(yaw) * Math.cos(pitch)
                );

                if (firstPerson) {
                    camera.position.copy(eye);
                    camera.lookAt(eye.clone().add(direction));
                } else {
                    const desired = eye.clone().add(
                        direction.clone().multiplyScalar(-cameraDistance)
                    );

                    camera.position.copy(desired);
                    camera.lookAt(eye);
                }

                // Mining / placing / combat
                placeCooldown = Math.max(0, placeCooldown - dt);
                attackCooldown = Math.max(0, attackCooldown - dt);

                if (
                    document.pointerLockElement === renderer.domElement
                ) {
                    const blockTarget = getBlockTarget();
                    const mobHit = getMobTarget();

                    if (held.left) {
                        if (
                            mobHit &&
                            (
                                !blockTarget ||
                                mobHit.distance < blockTarget.hit.distance
                            )
                        ) {
                            miningKey = null;
                            miningProgress = 0;
                            miningFill.style.width = "0%";

                            if (attackCooldown <= 0) {
                                attackMob(mobHit.object.userData.mob);
                            }
                        } else {
                            mineBlock(blockTarget, dt);
                        }
                    } else {
                        miningKey = null;
                        miningProgress = 0;
                        miningFill.style.width = "0%";
                    }

                    if (held.right && placeCooldown <= 0) {
                        placeBlock(blockTarget);
                    }
                }

                updateMobs(dt);
            }

            renderer.render(scene, camera);
        }

        // -----------------------------------------
        // CLEANUP
        // -----------------------------------------

        function cleanup() {
            running = false;
            paused = false;

            document.exitPointerLock?.();

            window.removeEventListener("keydown", keyDown);
            window.removeEventListener("keyup", keyUp);
            window.removeEventListener("mouseup", mouseUp);

            for (const chunk of chunks.values()) {
                removeChunkMeshes(chunk);
            }

            renderer.dispose();
        }

        window.addEventListener("resize", () => {
            if (!root.isConnected) return;

            camera.aspect = innerWidth / innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(innerWidth, innerHeight);
        });

        // -----------------------------------------
        // INITIAL MENU
        // -----------------------------------------

        updateHotbar();
        updateHearts();
        showHome();
        animate();
    }
})();
