pour l'instant j'ai que ca et ca na charge pas alors que j'ai des voitures en stocks
ca ouvre ca 

Ahhh 👍 on vient de trouver quelque chose, mais ce n’est PAS l’erreur du showroom.

L'adresse :

https://madec140302.github.io/favicon.ico

correspond simplement à l'icône du site (favicon). GitHub cherche favicon.ico, ne le trouve pas, donc il affiche 404.

➡️ Ça n'empêche absolument pas le showroom 3D de fonctionner. On peut même ignorer cette erreur pour l'instant.

Maintenant, on cherche la vraie erreur 🔎

Retourne sur ton site ZENTRO DEALERSHIP, puis :

Ctrl + Shift + I
Clique sur Console
Clique sur Showroom 3D
Regarde les messages qui apparaissent juste après avoir cliqué.

Tu peux notamment voir quelque chose comme :

Uncaught ReferenceError: THREE is not defined

ou

Uncaught TypeError: ...

ou

Failed to load resource...
Important

Si tu vois seulement :

Failed to load resource: 404
favicon.ico

➡️ ce n'est pas ça qui bloque le showroom.

📸 Envoie-moi une capture de toute la Console après avoir cliqué sur Showroom 3D, même s'il y a plusieurs lignes.

Je vais repérer l'erreur exacte et te donner le correctif à copier-coller, sans toucher aux systèmes Stock, Marché, Atelier et Ventes qui fonctionnent déjà. 🚗🏢🔥

je ne peux pas prendre la conssole en captire d'ecran

Aucun souci 👍 On n’a pas besoin de capture d’écran.

Et maintenant que je vois que le 404 concerne favicon.ico, on peut l’ignorer : ce n’est pas ce qui bloque le showroom.

Le plus simple est de corriger directement le système de chargement Three.js plutôt que de te faire chercher dans la console.

Fais ceci

Dans ton main.js, cherche la partie du Showroom qui contient :

https://cdn.jsdelivr.net/npm/three@0.179.1/build/three.min.js

et envoie-moi ce morceau de ton main.js.

👉 Tu peux aussi faire encore plus simple : envoie-moi ton fichier main.js actuel ici.

Je vais alors te renvoyer une version corrigée qui :

✅ charge Three.js correctement ;
✅ affiche réellement les voitures présentes dans ton stock ;
✅ ne reste plus bloquée sur « Chargement du showroom » ;
✅ garde Stock, Marché, Atelier et Ventes intacts ;
✅ affiche un showroom 3D même si aucun modèle .glb n'est encore installé.

Pas besoin de capture de console. 🚗🏢

Texte collé(2).txt
Document

Oui ! 👍 J’ai vérifié ton main.js actuel. Et là, on a trouvé le vrai problème.

Ton fichier est bien en V5 Stock + Marché + Atelier + Ventes, et il se termine par l’initialisation générale du jeu.

👉 Il n’y a actuellement aucun code Showroom 3D dans ce main.js.

Donc c'est normal que ton écran reste sur :

« Chargement du showroom… Initialisation du moteur 3D »

Le HTML du showroom est présent, mais le JavaScript qui doit créer la scène 3D n'est pas présent.

🔧 On va le réparer

Ne supprime rien de ton main.js.

Va tout en bas du fichier, après :

console.log(
    "ZENTRO DEALERSHIP V5 — système chargé."
);

et colle tout ce bloc à la suite :

/* =========================================================
   SHOWROOM 3D V1
   ========================================================= */

let showroomScene = null;
let showroomCamera = null;
let showroomRenderer = null;
let showroomAnimation = null;
let showroomCars = [];
let showroomRaycaster = null;
let showroomMouse = null;
let showroomReady = false;

let showroomYaw = 0;
let showroomPitch = 0.35;
let showroomDistance = 15;

let showroomDragging = false;
let showroomLastX = 0;
let showroomLastY = 0;


/* =========================================================
   CHARGEMENT THREE.JS
   ========================================================= */

function loadThreeJS(callback) {

    if (window.THREE) {
        callback();
        return;
    }

    const script = document.createElement("script");

    script.src =
        "https://cdn.jsdelivr.net/npm/three@0.179.1/build/three.min.js";

    script.onload = () => {
        console.log("Three.js chargé.");
        callback();
    };

    script.onerror = () => {

        console.error("Impossible de charger Three.js.");

        const loading =
            document.getElementById("showroomLoading");

        if (loading) {
            loading.innerHTML = `
                <div class="showroom-error">
                    <div class="showroom-error-box">
                        <strong>Impossible de charger le moteur 3D</strong>
                        <span>Vérifiez votre connexion puis rechargez la page.</span>
                    </div>
                </div>
            `;
        }
    };

    document.head.appendChild(script);
}


/* =========================================================
   OUVERTURE DU SHOWROOM
   ========================================================= */

function openShowroom() {

    openPage("showroom");

    const loading =
        document.getElementById("showroomLoading");

    if (loading) {
        loading.classList.remove("hidden");
    }

    loadThreeJS(() => {
        initializeShowroom();
    });
}


/* =========================================================
   INITIALISATION
   ========================================================= */

function initializeShowroom() {

    const container =
        document.getElementById("showroom3D");

    if (!container) {
        console.error("Conteneur #showroom3D introuvable.");
        return;
    }

    if (showroomReady) {
        resizeShowroom();

        const loading =
            document.getElementById("showroomLoading");

        if (loading) {
            loading.classList.add("hidden");
        }

        return;
    }

    createShowroom(container);

    showroomReady = true;

    const loading =
        document.getElementById("showroomLoading");

    if (loading) {
        loading.classList.add("hidden");
    }

    animateShowroom();

    console.log("Showroom 3D initialisé.");
}


/* =========================================================
   CRÉATION DE LA SCÈNE
   ========================================================= */

function createShowroom(container) {

    const THREE = window.THREE;

    showroomScene =
        new THREE.Scene();

    showroomScene.background =
        new THREE.Color(0x07090d);


    /* CAMÉRA */

    showroomCamera =
        new THREE.PerspectiveCamera(
            45,
            container.clientWidth /
            Math.max(container.clientHeight, 1),
            0.1,
            1000
        );


    /* RENDERER */

    showroomRenderer =
        new THREE.WebGLRenderer({
            antialias: true,
            alpha: false
        });

    showroomRenderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );

    showroomRenderer.setSize(
        container.clientWidth,
        container.clientHeight
    );

    showroomRenderer.shadowMap.enabled = true;

    showroomRenderer.shadowMap.type =
        THREE.PCFSoftShadowMap;

    container.innerHTML = "";

    container.appendChild(
        showroomRenderer.domElement
    );


    /* LUMIÈRES */

    const ambientLight =
        new THREE.AmbientLight(
            0xffffff,
            1.8
        );

    showroomScene.add(ambientLight);


    const keyLight =
        new THREE.DirectionalLight(
            0xffffff,
            3
        );

    keyLight.position.set(
        8,
        12,
        8
    );

    keyLight.castShadow = true;

    showroomScene.add(keyLight);


    const fillLight =
        new THREE.DirectionalLight(
            0x8ab4ff,
            1.5
        );

    fillLight.position.set(
        -8,
        5,
        4
    );

    showroomScene.add(fillLight);


    const rearLight =
        new THREE.PointLight(
            0x00aaff,
            18,
            25
        );

    rearLight.position.set(
        0,
        5,
        -8
    );

    showroomScene.add(rearLight);


    /* SOL */

    const floor =
        new THREE.Mesh(
            new THREE.PlaneGeometry(
                50,
                50
            ),
            new THREE.MeshStandardMaterial({
                color: 0x15181e,
                roughness: 0.28,
                metalness: 0.35
            })
        );

    floor.rotation.x =
        -Math.PI / 2;

    floor.receiveShadow = true;

    showroomScene.add(floor);


    /* MURS */

    createShowroomWall(
        0,
        5,
        -12,
        32,
        10,
        0.4
    );

    createShowroomWall(
        -16,
        5,
        0,
        0.4,
        10,
        24
    );

    createShowroomWall(
        16,
        5,
        0,
        0.4,
        10,
        24
    );


    /* PLATEFORME CENTRALE */

    const platform =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                5.5,
                5.5,
                0.35,
                64
            ),
            new THREE.MeshStandardMaterial({
                color: 0x20252d,
                metalness: 0.7,
                roughness: 0.22
            })
        );

    platform.position.y =
        0.18;

    platform.receiveShadow = true;

    platform.castShadow = true;

    showroomScene.add(platform);


    /* LIGNE LUMINEUSE */

    const ring =
        new THREE.Mesh(
            new THREE.TorusGeometry(
                5.15,
                0.045,
                12,
                96
            ),
            new THREE.MeshBasicMaterial({
                color: 0x00aaff
            })
        );

    ring.rotation.x =
        Math.PI / 2;

    ring.position.y =
        0.38;

    showroomScene.add(ring);


    /* VOITURES */

    createShowroomCars();


    /* RAYCASTING */

    showroomRaycaster =
        new THREE.Raycaster();

    showroomMouse =
        new THREE.Vector2();


    setupShowroomControls();

    updateShowroomCamera();

    window.addEventListener(
        "resize",
        resizeShowroom
    );
}


/* =========================================================
   MURS
   ========================================================= */

function createShowroomWall(
    x,
    y,
    z,
    width,
    height,
    depth
) {

    const THREE = window.THREE;

    const wall =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                width,
                height,
                depth
            ),
            new THREE.MeshStandardMaterial({
                color: 0x101319,
                roughness: 0.55,
                metalness: 0.25
            })
        );

    wall.position.set(
        x,
        y,
        z
    );

    wall.receiveShadow = true;

    wall.castShadow = true;

    showroomScene.add(wall);
}


/* =========================================================
   CRÉATION DES VOITURES
   ========================================================= */

function createShowroomCars() {

    showroomCars = [];

    const cars =
        inventory.slice(0, 6);

    if (cars.length === 0) {
        return;
    }

    const positions = [
        [-6, 0, 0],
        [0, 0, -1],
        [6, 0, 0],
        [-3, 0, 6],
        [3, 0, 6],
        [0, 0, 9]
    ];

    cars.forEach((car, index) => {

        const position =
            positions[index];

        const vehicle =
            createPlaceholderCar(
                car,
                position[0],
                position[1],
                position[2]
            );

        showroomScene.add(vehicle);

        showroomCars.push({
            object: vehicle,
            car: car
        });
    });
}


/* =========================================================
   MODÈLE 3D PROVISOIRE
   ========================================================= */

function createPlaceholderCar(
    car,
    x,
    y,
    z
) {

    const THREE = window.THREE;

    const group =
        new THREE.Group();

    group.userData.carId =
        car.id;


    const color =
        getCarColor(
            getCarName(car)
        );


    /* CARROSSERIE */

    const body =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                3.8,
                0.65,
                1.75
            ),
            new THREE.MeshStandardMaterial({
                color: color,
                metalness: 0.75,
                roughness: 0.2
            })
        );

    body.position.y =
        0.85;

    body.castShadow = true;

    body.receiveShadow = true;

    group.add(body);


    /* TOIT / HABITACLE */

    const cabin =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                2.0,
                0.65,
                1.45
            ),
            new THREE.MeshStandardMaterial({
                color: 0x10141a,
                metalness: 0.2,
                roughness: 0.15
            })
        );

    cabin.position.set(
        0.25,
        1.42,
        0
    );

    cabin.castShadow = true;

    group.add(cabin);


    /* VITRES */

    const windows =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                1.65,
                0.42,
                1.48
            ),
            new THREE.MeshStandardMaterial({
                color: 0x07121c,
                transparent: true,
                opacity: 0.8,
                metalness: 0.1,
                roughness: 0.05
            })
        );

    windows.position.set(
        0.25,
        1.48,
        0
    );

    group.add(windows);


    /* ROUES */

    const wheelGeometry =
        new THREE.CylinderGeometry(
            0.43,
            0.43,
            0.28,
            24
        );

    const wheelMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x050505,
            metalness: 0.7,
            roughness: 0.3
        });


    [
        [-1.25, 0.45, -0.92],
        [1.25, 0.45, -0.92],
        [-1.25, 0.45, 0.92],
        [1.25, 0.45, 0.92]
    ].forEach(position => {

        const wheel =
            new THREE.Mesh(
                wheelGeometry,
                wheelMaterial
            );

        wheel.rotation.z =
            Math.PI / 2;

        wheel.position.set(
            position[0],
            position[1],
            position[2]
        );

        wheel.castShadow = true;

        group.add(wheel);
    });


    /* PHARES */

    const headlightMaterial =
        new THREE.MeshBasicMaterial({
            color: 0xffffff
        });


    [-0.75, 0.75].forEach(offset => {

        const light =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    0.35,
                    0.16,
                    0.08
                ),
                headlightMaterial
            );

        light.position.set(
            1.92,
            0.95,
            offset
        );

        group.add(light);
    });


    group.position.set(
        x,
        y,
        z
    );

    group.userData.car =
        car;

    return group;
}


/* =========================================================
   COULEURS
   ========================================================= */

function getCarColor(name) {

    const text =
        String(name).toLowerCase();

    if (text.includes("bmw")) {
        return 0x182a45;
    }

    if (text.includes("audi")) {
        return 0x25282d;
    }

    if (text.includes("mercedes")) {
        return 0x30343b;
    }

    if (text.includes("porsche")) {
        return 0x7d1111;
    }

    return 0x20252b;
}


/* =========================================================
   CAMÉRA
   ========================================================= */

function updateShowroomCamera() {

    if (
        !showroomCamera ||
        !showroomScene
    ) {
        return;
    }

    const THREE =
        window.THREE;

    const target =
        new THREE.Vector3(
            0,
            1,
            2
        );

    const yaw =
        showroomYaw;

    const pitch =
        showroomPitch;

    showroomCamera.position.set(
        Math.sin(yaw) *
            Math.cos(pitch) *
            showroomDistance,

        Math.sin(pitch) *
            showroomDistance + 2,

        Math.cos(yaw) *
            Math.cos(pitch) *
            showroomDistance
    );

    showroomCamera.lookAt(
        target
    );
}


/* =========================================================
   CONTRÔLES
   ========================================================= */

function setupShowroomControls() {

    const canvas =
        showroomRenderer.domElement;


    canvas.addEventListener(
        "mousedown",
        event => {

            showroomDragging = true;

            showroomLastX =
                event.clientX;

            showroomLastY =
                event.clientY;
        }
    );


    window.addEventListener(
        "mouseup",
        () => {

            showroomDragging = false;
        }
    );


    window.addEventListener(
        "mousemove",
        event => {

            if (!showroomDragging) {
                return;
            }

            const dx =
                event.clientX -
                showroomLastX;

            const dy =
                event.clientY -
                showroomLastY;

            showroomLastX =
                event.clientX;

            showroomLastY =
                event.clientY;

            showroomYaw -=
                dx * 0.006;

            showroomPitch +=
                dy * 0.004;

            showroomPitch =
                Math.max(
                    0.05,
                    Math.min(
                        1.1,
                        showroomPitch
                    )
                );

            updateShowroomCamera();
        }
    );


    canvas.addEventListener(
        "wheel",
        event => {

            event.preventDefault();

            showroomDistance +=
                event.deltaY * 0.01;

            showroomDistance =
                Math.max(
                    7,
                    Math.min(
                        30,
                        showroomDistance
                    )
                );

            updateShowroomCamera();
        },
        { passive: false }
    );


    canvas.addEventListener(
        "click",
        event => {

            const rect =
                canvas.getBoundingClientRect();

            showroomMouse.x =
                ((event.clientX - rect.left) /
                    rect.width) * 2 - 1;

            showroomMouse.y =
                -((event.clientY - rect.top) /
                    rect.height) * 2 + 1;


            showroomRaycaster.setFromCamera(
                showroomMouse,
                showroomCamera
            );


            const objects = [];

            showroomCars.forEach(item => {

                item.object.traverse(
                    child => {

                        if (child.isMesh) {
                            objects.push(child);
                        }
                    }
                );
            });


            const intersections =
                showroomRaycaster.intersectObjects(
                    objects,
                    false
                );


            if (
                intersections.length === 0
            ) {
                return;
            }


            let selected =
                intersections[0].object;


            while (
                selected &&
                !selected.userData.car
            ) {
                selected =
                    selected.parent;
            }


            if (
                selected &&
                selected.userData.car
            ) {

                showShowroomInfo(
                    selected.userData.car
                );
            }
        }
    );
}


/* =========================================================
   INFOS VÉHICULE
   ========================================================= */

function showShowroomInfo(car) {

    const info =
        document.getElementById(
            "showroomInfo"
        );

    if (!info) return;


    info.innerHTML = `

        <span class="showroom-info-label">
            VÉHICULE SÉLECTIONNÉ
        </span>

        <h3>
            ${getCarName(car)}
        </h3>

        <div class="showroom-info-price">
            ${formatMoney(car.price)}
        </div>

        <div class="showroom-info-stats">

            <div class="showroom-info-stat">
                <span>KILOMÉTRAGE</span>
                <strong>
                    ${car.km.toLocaleString("fr-FR")} km
                </strong>
            </div>

            <div class="showroom-info-stat">
                <span>ÉTAT</span>
                <strong>
                    ${Math.round(car.condition)}%
                </strong>
            </div>

            <div class="showroom-info-stat">
                <span>PERFORMANCE</span>
                <strong>
                    +${car.performance}%
                </strong>
            </div>

            <div class="showroom-info-stat">
                <span>DETAILING</span>
                <strong>
                    ${car.detailing}%
                </strong>
            </div>

        </div>
    `;
}


/* =========================================================
   REDIMENSIONNEMENT
   ========================================================= */

function resizeShowroom() {

    const container =
        document.getElementById(
            "showroom3D"
        );

    if (
        !container ||
        !showroomCamera ||
        !showroomRenderer
    ) {
        return;
    }


    const width =
        container.clientWidth;

    const height =
        Math.max(
            container.clientHeight,
            400
        );


    showroomCamera.aspect =
        width / height;

    showroomCamera.updateProjectionMatrix();


    showroomRenderer.setSize(
        width,
        height
    );
}


/* =========================================================
   ANIMATION
   ========================================================= */

function animateShowroom() {

    showroomAnimation =
        requestAnimationFrame(
            animateShowroom
        );


    if (
        !showroomRenderer ||
        !showroomScene ||
        !showroomCamera
    ) {
        return;
    }


    showroomRenderer.render(
        showroomScene,
        showroomCamera
    );
}


/* =========================================================
   BOUTON SHOWROOM
   ========================================================= */

document
    .querySelectorAll(
        '.nav-btn[data-page="showroom"]'
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                openShowroom();

            }
        );

    });


/* =========================================================
   FIN SHOWROOM
   ========================================================= */
⚠️ Une chose importante

Ton main.js actuel contient bien les données de tes 3 voitures de stock :

BMW M4 Competition 2025
Audi RS6 Avant 2025
Mercedes-AMG C63 S E Performance 2024

Elles sont définies dans ton inventaire au début du fichier.

Donc après avoir ajouté ce bloc, le showroom pourra automatiquement récupérer ces voitures depuis inventory.

Ensuite

Fais :

GitHub → main.js → colle le bloc tout en bas → Commit changes

Puis recharge ton site avec :

Ctrl + F5

et clique sur :

🏢 Showroom 3D

Tu devrais cette fois voir la scène 3D, avec tes voitures disposées dans le showroom. 🚗✨

Et surtout : ne touche pas à ton Stock, Marché, Atelier ou Ventes. On ajoute seulement le Showroom au-dessus de ton V5 actuel.

🔥 Voici la PARTIE 3/3.
Colle-la directement à la suite de la partie 2.

/* =========================================================
   SHOWROOM 3D — THREE.JS
========================================================= */

let showroomScene = null;
let showroomCamera = null;
let showroomRenderer = null;
let showroomAnimation = null;

let showroomCars = [];
let showroomRaycaster = null;
let showroomMouse = null;

let showroomYaw = 0;
let showroomPitch = 0.35;
let showroomDistance = 15;

let showroomDragging = false;
let showroomLastX = 0;
let showroomLastY = 0;


/* =========================================================
   CHARGEMENT THREE.JS
========================================================= */

function loadThreeJS(callback) {

    if (window.THREE) {

        callback();
        return;
    }

    const existing =
        document.querySelector(
            'script[data-zentro-three]'
        );

    if (existing) {

        existing.addEventListener(
            "load",
            callback
        );

        return;
    }

    const script =
        document.createElement("script");

    script.src =
        "https://cdn.jsdelivr.net/npm/three@0.179.1/build/three.min.js";

    script.dataset.zentroThree = "true";

    script.onload = callback;

    script.onerror = () => {

        const loading =
            document.getElementById(
                "showroomLoading"
            );

        if (loading) {

            loading.innerHTML = `
                <div class="showroom-error">
                    <strong>
                        Impossible de charger le moteur 3D
                    </strong>

                    <span>
                        Vérifiez votre connexion
                        internet puis rechargez la page.
                    </span>
                </div>
            `;
        }
    };

    document.head.appendChild(script);
}


/* =========================================================
   OUVERTURE SHOWROOM
========================================================= */

function openShowroom() {

    openPageWithoutShowroomLoop(
        "showroom"
    );

    const loading =
        document.getElementById(
            "showroomLoading"
        );

    if (loading) {
        loading.classList.remove(
            "hidden"
        );
    }

    loadThreeJS(() => {

        setTimeout(() => {

            initializeShowroom();

        }, 100);

    });
}


/* =========================================================
   NAVIGATION SANS BOUCLE
========================================================= */

function openPageWithoutShowroomLoop(page) {

    document
        .querySelectorAll(".page")
        .forEach(section => {

            section.classList.remove(
                "active"
            );

        });

    const target =
        document.getElementById(page);

    if (target) {
        target.classList.add(
            "active"
        );
    }

    document
        .querySelectorAll(".nav-btn")
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.page === page
            );

        });

    const title =
        document.querySelector(
            ".topbar-title"
        );

    if (title) {

        title.textContent =
            pageTitles[page] || page;
    }
}


/* =========================================================
   INITIALISATION
========================================================= */

function initializeShowroom() {

    const container =
        document.getElementById(
            "showroom3D"
        );

    if (!container) return;

    if (!window.THREE) {

        showShowroomError(
            "Three.js n'est pas disponible."
        );

        return;
    }

    if (
        showroomRenderer &&
        showroomScene
    ) {

        resizeShowroom();

        const loading =
            document.getElementById(
                "showroomLoading"
            );

        if (loading) {
            loading.classList.add(
                "hidden"
            );
        }

        return;
    }

    try {

        createShowroom(
            container
        );

        const loading =
            document.getElementById(
                "showroomLoading"
            );

        if (loading) {
            loading.classList.add(
                "hidden"
            );
        }

        animateShowroom();

    } catch (error) {

        console.error(
            "Showroom 3D error:",
            error
        );

        showShowroomError(
            "Une erreur est survenue lors de l'initialisation du showroom."
        );
    }
}


/* =========================================================
   CRÉATION DU SHOWROOM
========================================================= */

function createShowroom(container) {

    const THREE = window.THREE;

    showroomScene =
        new THREE.Scene();

    showroomScene.background =
        new THREE.Color(
            0x080b10
        );


    /* -----------------------------------------------------
       CAMÉRA
    ----------------------------------------------------- */

    showroomCamera =
        new THREE.PerspectiveCamera(
            45,
            container.clientWidth /
                Math.max(
                    container.clientHeight,
                    1
                ),
            0.1,
            1000
        );


    /* -----------------------------------------------------
       RENDERER
    ----------------------------------------------------- */

    showroomRenderer =
        new THREE.WebGLRenderer({
            antialias: true,
            alpha: false
        });

    showroomRenderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio || 1,
            2
        )
    );

    showroomRenderer.setSize(
        Math.max(
            container.clientWidth,
            1
        ),
        Math.max(
            container.clientHeight,
            1
        )
    );

    showroomRenderer.shadowMap.enabled =
        true;

    showroomRenderer.shadowMap.type =
        THREE.PCFSoftShadowMap;

    showroomRenderer.outputColorSpace =
        THREE.SRGBColorSpace;

    container.innerHTML = "";

    container.appendChild(
        showroomRenderer.domElement
    );


    /* -----------------------------------------------------
       LUMIÈRES
    ----------------------------------------------------- */

    const ambient =
        new THREE.AmbientLight(
            0xffffff,
            1.8
        );

    showroomScene.add(
        ambient
    );


    const keyLight =
        new THREE.DirectionalLight(
            0xffffff,
            3.5
        );

    keyLight.position.set(
        8,
        14,
        8
    );

    keyLight.castShadow = true;

    keyLight.shadow.mapSize.width =
        2048;

    keyLight.shadow.mapSize.height =
        2048;

    showroomScene.add(
        keyLight
    );


    const fillLight =
        new THREE.PointLight(
            0x6688ff,
            25,
            40
        );

    fillLight.position.set(
        -10,
        6,
        2
    );

    showroomScene.add(
        fillLight
    );


    const rearLight =
        new THREE.PointLight(
            0xff6633,
            18,
            35
        );

    rearLight.position.set(
        8,
        5,
        -12
    );

    showroomScene.add(
        rearLight
    );


    /* -----------------------------------------------------
       SOL
    ----------------------------------------------------- */

    const floorGeometry =
        new THREE.PlaneGeometry(
            60,
            60
        );

    const floorMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x11151c,
            roughness: 0.32,
            metalness: 0.65
        });

    const floor =
        new THREE.Mesh(
            floorGeometry,
            floorMaterial
        );

    floor.rotation.x =
        -Math.PI / 2;

    floor.receiveShadow = true;

    showroomScene.add(
        floor
    );


    /* -----------------------------------------------------
       PLATEFORME CENTRALE
    ----------------------------------------------------- */

    const platformGeometry =
        new THREE.CylinderGeometry(
            5,
            5,
            0.3,
            64
        );

    const platformMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x1c222c,
            metalness: 0.8,
            roughness: 0.25
        });

    const platform =
        new THREE.Mesh(
            platformGeometry,
            platformMaterial
        );

    platform.position.y =
        0.15;

    platform.receiveShadow = true;

    platform.castShadow = true;

    showroomScene.add(
        platform
    );


    /* -----------------------------------------------------
       ANNEAU LUMINEUX
    ----------------------------------------------------- */

    const ringGeometry =
        new THREE.TorusGeometry(
            4.4,
            0.035,
            12,
            96
        );

    const ringMaterial =
        new THREE.MeshBasicMaterial({
            color: 0x4da3ff
        });

    const ring =
        new THREE.Mesh(
            ringGeometry,
            ringMaterial
        );

    ring.rotation.x =
        Math.PI / 2;

    ring.position.y =
        0.34;

    showroomScene.add(
        ring
    );


    /* -----------------------------------------------------
       MURS
    ----------------------------------------------------- */

    createShowroomWall(
        0,
        6,
        -15,
        30,
        12
    );

    createShowroomWall(
        -15,
        6,
        0,
        0.4,
        12
    );

    createShowroomWall(
        15,
        6,
        0,
        0.4,
        12
    );


    /* -----------------------------------------------------
       VOITURES
    ----------------------------------------------------- */

    createShowroomCars();


    /* -----------------------------------------------------
       RAYCASTER
    ----------------------------------------------------- */

    showroomRaycaster =
        new THREE.Raycaster();

    showroomMouse =
        new THREE.Vector2();


    /* -----------------------------------------------------
       CAMÉRA
    ----------------------------------------------------- */

    showroomYaw = 0;

    showroomPitch =
        0.35;

    showroomDistance =
        15;

    updateShowroomCamera();


    /* -----------------------------------------------------
       CONTRÔLES
    ----------------------------------------------------- */

    setupShowroomControls();


    /* -----------------------------------------------------
       RESIZE
    ----------------------------------------------------- */

    window.addEventListener(
        "resize",
        resizeShowroom
    );
}


/* =========================================================
   MURS
========================================================= */

function createShowroomWall(
    x,
    y,
    z,
    width,
    height
) {

    const THREE = window.THREE;

    const geometry =
        new THREE.BoxGeometry(
            width,
            height,
            0.3
        );

    const material =
        new THREE.MeshStandardMaterial({
            color: 0x0e1218,
            roughness: 0.65,
            metalness: 0.3
        });

    const wall =
        new THREE.Mesh(
            geometry,
            material
        );

    wall.position.set(
        x,
        y,
        z
    );

    wall.receiveShadow = true;

    wall.castShadow = true;

    showroomScene.add(
        wall
    );
}


/* =========================================================
   CRÉATION DES VOITURES
========================================================= */

function createShowroomCars() {

    showroomCars = [];

    const positions = [

        [-6, 0, 0],

        [0, 0, -1],

        [6, 0, 0],

        [-3, 0, 6],

        [3, 0, 6],

        [0, 0, 9]

    ];

    inventory
        .slice(0, 6)
        .forEach(
            (car, index) => {

                const position =
                    positions[index];

                if (!position) return;

                const object =
                    createPlaceholderCar(
                        car,
                        position[0],
                        position[1],
                        position[2]
                    );

                showroomCars.push(
                    object
                );

            }
        );
}


/* =========================================================
   VOITURE 3D
========================================================= */

function createPlaceholderCar(
    car,
    x,
    y,
    z
) {

    const THREE = window.THREE;

    const group =
        new THREE.Group();

    group.position.set(
        x,
        y,
        z
    );


    /* -----------------------------------------------------
       CARROSSERIE
    ----------------------------------------------------- */

    const bodyGeometry =
        new THREE.BoxGeometry(
            3.2,
            0.75,
            1.55
        );

    const bodyMaterial =
        new THREE.MeshStandardMaterial({
            color:
                getCarColor(car),
            metalness: 0.85,
            roughness: 0.2
        });

    const body =
        new THREE.Mesh(
            bodyGeometry,
            bodyMaterial
        );

    body.position.y =
        0.85;

    body.castShadow = true;

    body.receiveShadow = true;

    group.add(
        body
    );


    /* -----------------------------------------------------
       CABINE
    ----------------------------------------------------- */

    const cabinGeometry =
        new THREE.BoxGeometry(
            1.75,
            0.65,
            1.35
        );

    const cabinMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x151a22,
            metalness: 0.45,
            roughness: 0.18
        });

    const cabin =
        new THREE.Mesh(
            cabinGeometry,
            cabinMaterial
        );

    cabin.position.set(
        -0.15,
        1.42,
        0
    );

    cabin.castShadow = true;

    group.add(
        cabin
    );


    /* -----------------------------------------------------
       VITRES
    ----------------------------------------------------- */

    const windowMaterial =
        new THREE.MeshPhysicalMaterial({
            color: 0x111827,
            metalness: 0.15,
            roughness: 0.05,
            transmission: 0.05,
            transparent: true,
            opacity: 0.72
        });


    const frontWindow =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                0.65,
                0.42,
                1.38
            ),
            windowMaterial
        );

    frontWindow.position.set(
        -0.7,
        1.47,
        0
    );

    group.add(
        frontWindow
    );


    const rearWindow =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                0.65,
                0.42,
                1.38
            ),
            windowMaterial
        );

    rearWindow.position.set(
        0.42,
        1.47,
        0
    );

    group.add(
        rearWindow
    );


    /* -----------------------------------------------------
       ROUES
    ----------------------------------------------------- */

    const wheelPositions = [

        [-1.05, 0.52, -0.86],

        [1.05, 0.52, -0.86],

        [-1.05, 0.52, 0.86],

        [1.05, 0.52, 0.86]

    ];

    wheelPositions.forEach(
        position => {

            const wheelGeometry =
                new THREE.CylinderGeometry(
                    0.43,
                    0.43,
                    0.28,
                    24
                );

            const wheelMaterial =
                new THREE.MeshStandardMaterial({
                    color: 0x050505,
                    roughness: 0.3,
                    metalness: 0.75
                });

            const wheel =
                new THREE.Mesh(
                    wheelGeometry,
                    wheelMaterial
                );

            wheel.rotation.z =
                Math.PI / 2;

            wheel.position.set(
                position[0],
                position[1],
                position[2]
            );

            wheel.castShadow = true;

            group.add(
                wheel
            );
        }
    );


    /* -----------------------------------------------------
       PHARES
    ----------------------------------------------------- */

    const headlightMaterial =
        new THREE.MeshBasicMaterial({
            color: 0xffffff
        });


    const leftLight =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                0.08,
                0.18,
                0.4
            ),
            headlightMaterial
        );

    leftLight.position.set(
        -1.63,
        0.98,
        -0.52
    );

    group.add(
        leftLight
    );


    const rightLight =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                0.08,
                0.18,
                0.4
            ),
            headlightMaterial
        );

    rightLight.position.set(
        -1.63,
        0.98,
        0.52
    );

    group.add(
        rightLight
    );


    /* -----------------------------------------------------
       IDENTIFICATION
    ----------------------------------------------------- */

    group.userData.carId =
        car.id;

    group.userData.car =
        car;


    showroomScene.add(
        group
    );

    return group;
}


/* =========================================================
   COULEUR DES VOITURES
========================================================= */

function getCarColor(car) {

    const name =
        String(
            car.name || ""
        ).toLowerCase();

    if (name.includes("bmw")) {
        return 0x1d3557;
    }

    if (name.includes("audi")) {
        return 0x777777;
    }

    if (name.includes("mercedes")) {
        return 0x24272b;
    }

    if (name.includes("porsche")) {
        return 0x7b1113;
    }

    return 0x20242a;
}


/* =========================================================
   CAMÉRA
========================================================= */

function updateShowroomCamera() {

    if (
        !showroomCamera ||
        !window.THREE
    ) {
        return;
    }

    const THREE = window.THREE;

    const target =
        new THREE.Vector3(
            0,
            1,
            2
        );

    const x =
        Math.sin(
            showroomYaw
        ) *
        Math.cos(
            showroomPitch
        ) *
        showroomDistance;

    const y =
        Math.sin(
            showroomPitch
        ) *
        showroomDistance;

    const z =
        Math.cos(
            showroomYaw
        ) *
        Math.cos(
            showroomPitch
        ) *
        showroomDistance;

    showroomCamera.position.set(
        target.x + x,
        target.y + y,
        target.z + z
    );

    showroomCamera.lookAt(
        target
    );
}


/* =========================================================
   CONTRÔLES SHOWROOM
========================================================= */

function setupShowroomControls() {

    const canvas =
        showroomRenderer.domElement;


    canvas.addEventListener(
        "mousedown",
        event => {

            showroomDragging =
                true;

            showroomLastX =
                event.clientX;

            showroomLastY =
                event.clientY;

            canvas.style.cursor =
                "grabbing";
        }
    );


    window.addEventListener(
        "mouseup",
        () => {

            showroomDragging =
                false;

            canvas.style.cursor =
                "grab";
        }
    );


    window.addEventListener(
        "mousemove",
        event => {

            if (
                !showroomDragging
            ) {
                return;
            }

            const deltaX =
                event.clientX -
                showroomLastX;

            const deltaY =
                event.clientY -
                showroomLastY;

            showroomLastX =
                event.clientX;

            showroomLastY =
                event.clientY;

            showroomYaw -=
                deltaX * 0.008;

            showroomPitch -=
                deltaY * 0.005;

            showroomPitch =
                Math.max(
                    0.08,
                    Math.min(
                        1.15,
                        showroomPitch
                    )
                );

            updateShowroomCamera();
        }
    );


    canvas.addEventListener(
        "wheel",
        event => {

            event.preventDefault();

            showroomDistance +=
                event.deltaY * 0.01;

            showroomDistance =
                Math.max(
                    7,
                    Math.min(
                        28,
                        showroomDistance
                    )
                );

            updateShowroomCamera();
        },
        {
            passive: false
        }
    );


    canvas.addEventListener(
        "click",
        event => {

            if (!showroomRaycaster) {
                return;
            }

            const rect =
                canvas.getBoundingClientRect();

            showroomMouse.x =
                (
                    (
                        event.clientX -
                        rect.left
                    ) /
                    rect.width
                ) * 2 - 1;

            showroomMouse.y =
                -(
                    (
                        event.clientY -
                        rect.top
                    ) /
                    rect.height
                ) * 2 + 1;

            showroomRaycaster.setFromCamera(
                showroomMouse,
                showroomCamera
            );

            const objects = [];

            showroomCars.forEach(
                car => {

                    car.traverse(
                        child => {

                            if (
                                child.isMesh
                            ) {
                                objects.push(
                                    child
                                );
                            }

                        }
                    );
                }
            );

            const hits =
                showroomRaycaster.intersectObjects(
                    objects,
                    false
                );

            if (
                hits.length === 0
            ) {
                return;
            }

            let selected =
                hits[0].object;

            while (
                selected.parent &&
                !selected.userData.car
            ) {

                selected =
                    selected.parent;
            }

            if (
                selected.userData &&
                selected.userData.car
            ) {

                showShowroomInfo(
                    selected.userData.car
                );
            }
        }
    );


    canvas.style.cursor =
        "grab";
}


/* =========================================================
   INFOS VÉHICULE
========================================================= */

function showShowroomInfo(car) {

    const info =
        document.getElementById(
            "showroomInfo"
        );

    if (!info) return;

    const condition =
        car.condition ?? 100;

    const performance =
        car.performance ?? 0;

    const detailing =
        car.detailing ?? 0;

    info.innerHTML = `

        <span class="showroom-info-label">
            VÉHICULE
        </span>

        <h3>
            ${car.name}
        </h3>

        <div class="showroom-info-price">
            ${formatMoney(car.price)}
        </div>

        <div class="showroom-info-stats">

            <div class="showroom-info-stat">
                <span>Kilométrage</span>
                <strong>
                    ${car.km.toLocaleString("fr-FR")} km
                </strong>
            </div>

            <div class="showroom-info-stat">
                <span>État</span>
                <strong>
                    ${condition}%
                </strong>
            </div>

            <div class="showroom-info-stat">
                <span>Performance</span>
                <strong>
                    +${performance}%
                </strong>
            </div>

            <div class="showroom-info-stat">
                <span>Detailing</span>
                <strong>
                    ${detailing}%
                </strong>
            </div>

        </div>
    `;
}


/* =========================================================
   ERREUR SHOWROOM
========================================================= */

function showShowroomError(message) {

    const loading =
        document.getElementById(
            "showroomLoading"
        );

    if (!loading) return;

    loading.classList.remove(
        "hidden"
    );

    loading.innerHTML = `

        <div class="showroom-error-box">

            <strong>
                ⚠️ Showroom indisponible
            </strong>

            <span>
                ${message}
            </span>

            <button
                class="primary-btn"
                onclick="location.reload()"
            >
                Recharger
            </button>

        </div>

    `;
}


/* =========================================================
   RESIZE
========================================================= */

function resizeShowroom() {

    const container =
        document.getElementById(
            "showroom3D"
        );

    if (
        !container ||
        !showroomCamera ||
        !showroomRenderer
    ) {
        return;
    }

    const width =
        Math.max(
            container.clientWidth,
            1
        );

    const height =
        Math.max(
            container.clientHeight,
            1
        );

    showroomCamera.aspect =
        width / height;

    showroomCamera.updateProjectionMatrix();

    showroomRenderer.setSize(
        width,
        height
    );
}


/* =========================================================
   ANIMATION
========================================================= */

function animateShowroom() {

    if (!showroomRenderer) {
        return;
    }

    showroomAnimation =
        requestAnimationFrame(
            animateShowroom
        );

    if (
        showroomScene &&
        showroomRenderer &&
        showroomCamera
    ) {

        showroomCars.forEach(
            car => {

                car.rotation.y =
                    Math.sin(
                        Date.now() *
                        0.0003
                    ) * 0.015;

            }
        );

        showroomRenderer.render(
            showroomScene,
            showroomCamera
        );
    }
}


/* =========================================================
   BOUTON SHOWROOM
========================================================= */

if (!pageTitles.showroom) {

    pageTitles.showroom =
        "Showroom 3D";
}

document
    .querySelectorAll(
        '.nav-btn[data-page="showroom"]'
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            event => {

                event.stopImmediatePropagation();

                openShowroom();
            }
        );
    });


/* =========================================================
   FIN ZENTRO DEALERSHIP
========================================================= */

console.log(
    "🏢 ZENTRO DEALERSHIP — SHOWROOM 3D READY"
);
✅ Maintenant tu dois avoir

Partie 1 → Partie 2 → Partie 3

dans un seul main.js.

⚠️ Ensuite, fais Enregistrer / Commit changes sur GitHub et recharge ton site. Le Showroom devrait maintenant charger Three.js et afficher les véhicules de ton stock. 🚗💨

plus aucun bouton ne fonctionnent 

Oui — c’est ma faute. 😕 Les 3 parties que je t’ai données ne devaient pas être assemblées de cette façon avec ton ancien fichier. Il y a très probablement des fonctions/variables en double, ce qui fait que le JavaScript entier ne se charge plus → donc aucun bouton ne répond.

🛑 Ne modifie plus ton fichier pour l'instant

Ne supprime rien d'autre et ne rajoute pas de code.

Le plus propre est que je reprenne ton main.js actuel complet et que je te fasse une version corrigée unique, avec :

✅ Dashboard
✅ Stock
✅ Marché
✅ Atelier
✅ Ventes
✅ sauvegarde LocalStorage
✅ Showroom 3D
✅ boutons fonctionnels
✅ aucun doublon
✅ pas de boucle entre les menus
✅ chargement Three.js propre

Et surtout : un seul main.js final, au lieu de te faire fusionner des morceaux à la main.

👉 Comme ton fichier main.js est déjà disponible dans la conversation, je peux repartir directement dessus et corriger la structure.

au pir renvoie moi le mains que je t'avai envoyer et redonne le moi,on pourra faire des modifs a partir de celui la 

Oui 👍 On repart exactement de ton main.js d’origine, sans ajouter ni supprimer de fonctionnalités.

J’ai récupéré le fichier que tu m’avais envoyé et vérifié qu’il est syntaxiquement valide.

👉 
Télécharger ton main.js original

À partir de maintenant

On fait beaucoup plus proprement :

Tu remplaces ton main.js actuel par celui-ci.
On vérifie que tous les boutons refonctionnent.
Ensuite, on fait les modifications une par une, directement à partir de cette base.
Je ne te demanderai plus de fusionner plusieurs gros morceaux de code. 🔧

Base de départ = ton main.js original, pas le code que j'ai essayé de reconstruire.

main_original_zentro_dealership.js
Code

/* =========================================================
ZENTRO DEALERSHIP
V5 — STOCK + MARCHÉ + ATELIER + VENTES
========================================================= */

let money = Number(localStorage.getItem("zentro_money")) || 250000;

let inventory = JSON.parse(
localStorage.getItem("zentro_inventory") || "null"
) || [
{
id: 1,
name: "BMW M4 Competition 2025",
km: 18420,
price: 94900,
category: "Sportive",
condition: 100,
performance: 0,
detailing: 0
},
{
id: 2,
name: "Audi RS6 Avant 2025",
km: 9820,
price: 128500,
category: "Premium",
condition: 100,
performance: 0,
detailing: 0
},
{
id: 3,
name: "Mercedes-AMG C63 S E Performance 2024",
km: 24100,
price: 89900,
category: "Sportive",
condition: 100,
performance: 0,
detailing: 0
}
];

let reputation =
Number(localStorage.getItem("zentro_reputation")) || 4.8;

let salesHistory = JSON.parse(
localStorage.getItem("zentro_sales_history") || "[]"
);

let currentClient = null;
let currentOffer = null;
let negotiationStep = 0;

/* =========================================================
CLIENTS
========================================================= */

const clientProfiles = [
{
name: "Lucas Martin",
type: "Passionné automobile",
budget: 150000,
tolerance: 0.08
},
{
name: "Thomas Bernard",
type: "Client premium",
budget: 180000,
tolerance: 0.06
},
{
name: "Antoine Dubois",
type: "Acheteur sportif",
budget: 120000,
tolerance: 0.10
},
{
name: "Hugo Morel",
type: "Jeune entrepreneur",
budget: 200000,
tolerance: 0.05
},
{
name: "Maxime Laurent",
type: "Collectionneur",
budget: 300000,
tolerance: 0.12
},
{
name: "Alexandre Petit",
type: "Client particulier",
budget: 100000,
tolerance: 0.07
}
];

/* =========================================================
NETTOYAGE DES ANCIENNES DONNÉES
========================================================= */

function getCarName(car) {

if (!car) {
    return "Véhicule";
}

if (
    typeof car.name === "string" &&
    car.name.trim() !== "" &&
    car.name !== "undefined"
) {
    return car.name;
}

if (
    typeof car.model === "string" &&
    car.model.trim() !== "" &&
    car.model !== "undefined"
) {
    return car.model;
}

if (
    typeof car.title === "string" &&
    car.title.trim() !== "" &&
    car.title !== "undefined"
) {
    return car.title;
}

return "Véhicule";

}

/* =========================================================
SAUVEGARDE
========================================================= */

function saveGame() {

localStorage.setItem(
    "zentro_money",
    money
);

localStorage.setItem(
    "zentro_inventory",
    JSON.stringify(inventory)
);

localStorage.setItem(
    "zentro_reputation",
    reputation
);

localStorage.setItem(
    "zentro_sales_history",
    JSON.stringify(salesHistory)
);

}

/* =========================================================
UTILITAIRES
========================================================= */

function formatMoney(value) {

return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0
}).format(value);

}

function showToast(message) {

const toast =
    document.getElementById("toast");

if (!toast) return;

toast.textContent = message;

toast.classList.add("show");

clearTimeout(window.toastTimer);

window.toastTimer = setTimeout(() => {

    toast.classList.remove("show");

}, 2500);

}

function updateUI() {

const moneyElement =
    document.getElementById("money");

if (moneyElement) {

    moneyElement.textContent =
        formatMoney(money);
}


const stockCount =
    document.getElementById("stockCount");

if (stockCount) {

    stockCount.textContent =
        inventory.length;
}

}

/* =========================================================
PRÉPARATION INVENTAIRE
========================================================= */

function prepareInventory() {

inventory.forEach(car => {

    if (!car.name || car.name === "undefined") {

        if (car.model) {

            car.name = car.model;

        } else {

            car.name = "Véhicule";
        }
    }


    if (typeof car.km !== "number") {

        car.km = 0;
    }


    if (typeof car.price !== "number") {

        car.price = 0;
    }


    if (!car.category) {

        car.category = "Automobile";
    }


    if (typeof car.condition !== "number") {

        car.condition = 100;
    }


    if (typeof car.performance !== "number") {

        car.performance = 0;
    }


    if (typeof car.detailing !== "number") {

        car.detailing = 0;
    }
});

}

/* =========================================================
NETTOYAGE HISTORIQUE
========================================================= */

function prepareSalesHistory() {

salesHistory.forEach(sale => {

    if (
        !sale.carName ||
        sale.carName === "undefined"
    ) {

        if (
            sale.carModel &&
            sale.carModel !== "undefined"
        ) {

            sale.carName =
                sale.carModel;

        } else {

            sale.carName =
                "Véhicule";
        }
    }


    if (
        !sale.clientName ||
        sale.clientName === "undefined"
    ) {

        sale.clientName =
            "Client";
    }


    if (typeof sale.salePrice !== "number") {

        sale.salePrice = 0;
    }


    if (typeof sale.profit !== "number") {

        sale.profit = 0;
    }
});

}

/* =========================================================
NAVIGATION
========================================================= */

const pageTitles = {

dashboard: "Dashboard",

stock: "Stock",

market: "Marché",

workshop: "Atelier",

sales: "Ventes",

stats: "Statistiques"

};

function openPage(pageName) {

document
    .querySelectorAll(".page")
    .forEach(page => {

        page.classList.remove(
            "active-page"
        );
    });


const target =
    document.getElementById(pageName);

if (target) {

    target.classList.add(
        "active-page"
    );
}


document
    .querySelectorAll(".nav-btn")
    .forEach(button => {

        button.classList.remove("active");

        if (
            button.dataset.page ===
            pageName
        ) {

            button.classList.add(
                "active"
            );
        }
    });


const title =
    document.querySelector(
        ".topbar h1"
    );

if (title) {

    title.textContent =
        pageTitles[pageName] ||
        "ZENTRO DEALERSHIP";
}

}

document
.querySelectorAll(".nav-btn")
.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            openPage(
                button.dataset.page
            );
        }
    );
});

document
.querySelectorAll(
"[data-page-link]"
)
.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            openPage(
                button.dataset.pageLink
            );
        }
    );
});

/* =========================================================
STOCK
========================================================= */

function renderInventory() {

const container =
    document.querySelector(
        "#stock .inventory-grid"
    );

if (!container) return;

container.innerHTML = "";


if (inventory.length === 0) {

    container.innerHTML = `

        <div class="empty-state">

            <h3>Stock vide</h3>

            <p>
                Rendez-vous dans le Marché
                pour acheter des véhicules.
            </p>

        </div>

    `;

    return;
}


inventory.forEach(car => {

    const card =
        document.createElement("div");

    card.className =
        "inventory-card";


    card.innerHTML = `

        <div class="inventory-image">

            <div class="car-placeholder">

                ${getCarName(car)}

            </div>

        </div>


        <div class="inventory-info">

            <h3>
                ${getCarName(car)}
            </h3>

            <p>
                ${car.km.toLocaleString("fr-FR")}
                km
            </p>

            <p>
                ${car.category}
            </p>

            <p>
                État :
                <strong>
                    ${Math.round(car.condition)}%
                </strong>
            </p>

            <p>
                Valeur :
                <strong>
                    ${formatMoney(car.price)}
                </strong>
            </p>


            <button
                class="sell-btn"
                data-sell-id="${car.id}">

                Vendre

            </button>

        </div>

    `;


    container.appendChild(card);
});


container
    .querySelectorAll(
        "[data-sell-id]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                sellCar(
                    Number(
                        button.dataset.sellId
                    )
                );
            }
        );
    });

}

/* =========================================================
VENTE DIRECTE STOCK
========================================================= */

function sellCar(id) {

const car =
    inventory.find(
        item => item.id === id
    );

if (!car) return;


const salePrice =
    Math.round(
        car.price *
        (
            0.95 +
            Math.random() * 0.10
        )
    );


money += salePrice;


inventory =
    inventory.filter(
        item => item.id !== id
    );


reputation =
    Math.min(
        5,
        reputation + 0.02
    );


salesHistory.push({

    id: Date.now(),

    clientName:
        "Vente directe",

    carName:
        getCarName(car),

    purchasePrice:
        car.price,

    salePrice:
        salePrice,

    profit:
        salePrice - car.price,

    date:
        new Date()
            .toLocaleDateString(
                "fr-FR"
            )
});


saveGame();

updateUI();

renderInventory();

renderWorkshopVehicles();

renderSales();

renderStats();


showToast(
    `${getCarName(car)} vendu pour ${formatMoney(salePrice)}`
);

}

/* =========================================================
MARCHÉ
========================================================= */

const marketCars = [

{
    name:
        "BMW M3 Competition 2025",

    km:
        8200,

    price:
        91500,

    category:
        "Sportive"
},


{
    name:
        "BMW M5 2025",

    km:
        6100,

    price:
        124900,

    category:
        "Sportive"
},


{
    name:
        "Audi RS5 2025",

    km:
        12400,

    price:
        84900,

    category:
        "Sportive"
},


{
    name:
        "Audi RS7 2025",

    km:
        7600,

    price:
        119900,

    category:
        "Premium"
},


{
    name:
        "Mercedes-AMG C43 2025",

    km:
        10400,

    price:
        72500,

    category:
        "Sportive"
},


{
    name:
        "Porsche 911 Carrera 2025",

    km:
        5400,

    price:
        139900,

    category:
        "Sportive"
}

];

function renderMarket() {

const marketPage =
    document.getElementById("market");

if (!marketPage) return;


let container =
    marketPage.querySelector(
        ".market-cars"
    );


if (!container) {

    container =
        document.createElement("div");

    container.className =
        "market-cars";


    const panel =
        marketPage.querySelector(
            ".market-panel"
        );


    if (panel) {

        panel.after(container);

    } else {

        marketPage.appendChild(
            container
        );
    }
}


container.innerHTML = `

    <div class="market-grid">

        ${marketCars.map(
            (car, index) => `

            <div class="market-car">

                <div class="market-car-image">

                    <span>🚘</span>

                </div>


                <div class="market-car-info">

                    <h3>
                        ${car.name}
                    </h3>

                    <p>
                        ${car.km.toLocaleString("fr-FR")}
                        km
                    </p>

                    <p>
                        ${car.category}
                    </p>

                    <strong>
                        ${formatMoney(car.price)}
                    </strong>


                    <button
                        class="buy-market-btn"
                        data-market-id="${index}">

                        Acheter

                    </button>

                </div>

            </div>

        `
        ).join("")}

    </div>

`;


container
    .querySelectorAll(
        "[data-market-id]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                buyCar(
                    marketCars[
                        Number(
                            button.dataset.marketId
                        )
                    ]
                );
            }
        );
    });

}

function buyCar(car) {

if (money < car.price) {

    showToast(
        "Fonds insuffisants."
    );

    return;
}


money -= car.price;


inventory.push({

    id:
        Date.now(),

    name:
        car.name,

    km:
        car.km,

    price:
        car.price,

    category:
        car.category,

    condition:
        100,

    performance:
        0,

    detailing:
        0
});


saveGame();

updateUI();

renderInventory();

renderWorkshopVehicles();

renderSales();

renderStats();


showToast(
    `${car.name} ajouté au stock.`
);

}

/* =========================================================
ATELIER
========================================================= */

function repairPrice(car) {

if (
    car.condition >= 100
) {

    return 0;
}


return Math.max(

    500,

    Math.round(
        (100 - car.condition) *
        180
    )
);

}

function renderWorkshop() {

const workshop =
    document.getElementById(
        "workshop"
    );

if (!workshop) return;


workshop.innerHTML = `

    <div class="workshop-layout">


        <div class="workshop-vehicles">

            <h2>
                Véhicules disponibles
            </h2>


            <div
                id="workshopVehicleList">
            </div>

        </div>


        <div class="workshop-management">

            <div
                id="workshopDetails">

                <h2>
                    Sélectionnez un véhicule
                </h2>

                <p>
                    Choisissez un véhicule
                    pour accéder aux opérations
                    de l'atelier.
                </p>

            </div>

        </div>

    </div>

`;


renderWorkshopVehicles();

}

function renderWorkshopVehicles() {

const list =
    document.getElementById(
        "workshopVehicleList"
    );

if (!list) return;


if (inventory.length === 0) {

    list.innerHTML = `

        <p>
            Aucun véhicule en stock.
        </p>

    `;

    return;
}


list.innerHTML =
    inventory
        .map(
            car => `

            <button
                class="workshop-car"
                data-workshop-id="${car.id}">

                <strong>
                    ${getCarName(car)}
                </strong>

                <span>
                    État :
                    ${Math.round(car.condition)}%
                </span>

                <span>
                    ${formatMoney(car.price)}
                </span>

            </button>

        `
        )
        .join("");


list
    .querySelectorAll(
        "[data-workshop-id]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                selectWorkshopCar(
                    Number(
                        button.dataset.workshopId
                    )
                );
            }
        );
    });

}

function selectWorkshopCar(id) {

const car =
    inventory.find(
        item => item.id === id
    );


const details =
    document.getElementById(
        "workshopDetails"
    );


if (!car || !details) return;


const repairCost =
    repairPrice(car);


details.innerHTML = `

    <div class="workshop-selected">

        <h2>
            ${getCarName(car)}
        </h2>

        <p>
            ${car.km.toLocaleString("fr-FR")}
            km • ${car.category}
        </p>


        <div class="workshop-stat">

            <span>
                État
            </span>

            <strong>
                ${Math.round(car.condition)}%
            </strong>

        </div>


        <div class="workshop-bar">

            <div
                style="width:${car.condition}%">
            </div>

        </div>


        <div class="workshop-stat">

            <span>
                Performance
            </span>

            <strong>
                +${car.performance}%
            </strong>

        </div>


        <div class="workshop-stat">

            <span>
                Detailing
            </span>

            <strong>
                ${car.detailing}%
            </strong>

        </div>


        <hr>


        <div class="workshop-actions">


            <button
                class="workshop-action"
                data-action="repair">

                🔧 Réparer

                <small>

                    ${
                        repairCost === 0
                            ? "Déjà parfait"
                            : formatMoney(
                                repairCost
                            )
                    }

                </small>

            </button>


            <button
                class="workshop-action"
                data-action="performance">

                ⚡ Performance

                <small>
                    7 500 €
                </small>

            </button>


            <button
                class="workshop-action"
                data-action="detailing">

                ✨ Detailing

                <small>
                    2 500 €
                </small>

            </button>


        </div>

    </div>

`;


details
    .querySelector(
        "[data-action='repair']"
    )
    ?.addEventListener(
        "click",
        () => {

            repairVehicle(
                car.id
            );
        }
    );


details
    .querySelector(
        "[data-action='performance']"
    )
    ?.addEventListener(
        "click",
        () => {

            upgradeVehicle(
                car.id
            );
        }
    );


details
    .querySelector(
        "[data-action='detailing']"
    )
    ?.addEventListener(
        "click",
        () => {

            detailVehicle(
                car.id
            );
        }
    );

}

function repairVehicle(id) {

const car =
    inventory.find(
        item => item.id === id
    );

if (!car) return;


const cost =
    repairPrice(car);


if (cost === 0) {

    showToast(
        "Ce véhicule est déjà en parfait état."
    );

    return;
}


if (money < cost) {

    showToast(
        "Fonds insuffisants."
    );

    return;
}


money -= cost;

car.condition = 100;

car.price +=
    Math.round(
        cost * 0.65
    );


saveGame();

updateUI();

renderInventory();

renderWorkshopVehicles();

renderSales();

renderStats();


selectWorkshopCar(id);


showToast(
    `${getCarName(car)} réparé pour ${formatMoney(cost)}.`
);

}

function upgradeVehicle(id) {

const car =
    inventory.find(
        item => item.id === id
    );

if (!car) return;


const cost = 7500;


if (money < cost) {

    showToast(
        "Fonds insuffisants."
    );

    return;
}


if (car.performance >= 25) {

    showToast(
        "Performance maximale atteinte."
    );

    return;
}


money -= cost;


car.performance += 5;

car.price += 10000;


saveGame();

updateUI();

renderInventory();

renderSales();

renderStats();


selectWorkshopCar(id);


showToast(
    `${getCarName(car)} amélioré.`
);

}

function detailVehicle(id) {

const car =
    inventory.find(
        item => item.id === id
    );

if (!car) return;


const cost = 2500;


if (money < cost) {

    showToast(
        "Fonds insuffisants."
    );

    return;
}


if (car.detailing >= 100) {

    showToast(
        "Detailing maximal atteint."
    );

    return;
}


money -= cost;


car.detailing =
    Math.min(
        100,
        car.detailing + 25
    );


car.price += 3000;


saveGame();

updateUI();

renderInventory();

renderSales();

renderStats();


selectWorkshopCar(id);


showToast(
    `${getCarName(car)} préparé pour la vente.`
);

}

/* =========================================================
VENTES V2
========================================================= */

function generateClient() {

if (inventory.length === 0) {

    currentClient = null;

    currentOffer = null;

    return;
}


const profile =
    clientProfiles[
        Math.floor(
            Math.random() *
            clientProfiles.length
        )
    ];


const compatibleCars =
    inventory.filter(
        car => {

            return (
                car.price <=
                profile.budget * 1.20
            );
        }
    );


const availableCars =
    compatibleCars.length
        ? compatibleCars
        : inventory;


const car =
    availableCars[
        Math.floor(
            Math.random() *
            availableCars.length
        )
    ];


const baseOffer =
    car.price *
    (
        0.88 +
        Math.random() * 0.08
    );


currentClient = {

    ...profile,

    carId:
        car.id,

    interest:
        Math.round(
            65 +
            Math.random() * 30
        )
};


currentOffer =
    Math.round(
        baseOffer
    );


negotiationStep = 0;

}

function renderSales() {

const salesPage =
    document.getElementById(
        "sales"
    );

if (!salesPage) return;


if (!currentClient) {

    generateClient();
}


const soldCount =
    salesHistory.length;


const totalRevenue =
    salesHistory.reduce(
        (sum, sale) =>
            sum +
            Number(
                sale.salePrice || 0
            ),
        0
    );


const totalProfit =
    salesHistory.reduce(
        (sum, sale) =>
            sum +
            Number(
                sale.profit || 0
            ),
        0
    );


salesPage.innerHTML = `

    <div class="sales-dashboard">


        <div class="sales-overview">


            <div class="sales-stat">

                <span>
                    Ventes
                </span>

                <strong>
                    ${soldCount}
                </strong>

            </div>


            <div class="sales-stat">

                <span>
                    Chiffre d'affaires
                </span>

                <strong>
                    ${formatMoney(totalRevenue)}
                </strong>

            </div>


            <div class="sales-stat">

                <span>
                    Bénéfice
                </span>

                <strong>
                    ${formatMoney(totalProfit)}
                </strong>

            </div>


            <div class="sales-stat">

                <span>
                    Réputation
                </span>

                <strong>
                    ${reputation.toFixed(2)} / 5
                </strong>

            </div>


        </div>


        <div id="salesClientArea"></div>


        <div class="sales-history">

            <h2>
                Historique des ventes
            </h2>


            ${
                salesHistory.length === 0

                ? `

                    <p>
                        Aucune vente réalisée
                        pour le moment.
                    </p>

                `

                : `

                    <div class="sales-history-list">

                        ${
                            salesHistory
                                .slice()
                                .reverse()
                                .map(
                                    sale => `

                                    <div
                                        class="sale-row">

                                        <div>

                                            <strong>
                                                ${
                                                    sale.carName &&
                                                    sale.carName !== "undefined"
                                                        ? sale.carName
                                                        : "Véhicule"
                                                }
                                            </strong>

                                            <small>

                                                Client :
                                                ${
                                                    sale.clientName &&
                                                    sale.clientName !== "undefined"
                                                        ? sale.clientName
                                                        : "Client"
                                                }

                                            </small>

                                        </div>


                                        <div>

                                            ${
                                                formatMoney(
                                                    Number(
                                                        sale.salePrice ||
                                                        0
                                                    )
                                                )
                                            }

                                        </div>


                                        <div>

                                            ${
                                                sale.profit >= 0
                                                    ? "+"
                                                    : ""
                                            }${
                                                formatMoney(
                                                    Number(
                                                        sale.profit ||
                                                        0
                                                    )
                                                )
                                            }

                                        </div>

                                    </div>

                                `
                                )
                                .join("")
                        }

                    </div>

                `
            }

        </div>


    </div>

`;


renderSalesClient();

}

/* =========================================================
CLIENT ACTUEL
========================================================= */

function renderSalesClient() {

const area =
    document.getElementById(
        "salesClientArea"
    );

if (!area) return;


if (!currentClient) {

    area.innerHTML = `

        <div class="sales-empty">

            <h2>
                Aucun client disponible
            </h2>

            <p>
                Ajoutez un véhicule au stock
                pour recevoir des clients.
            </p>

        </div>

    `;

    return;
}


const car =
    inventory.find(
        item =>
            item.id ===
            currentClient.carId
    );


if (!car) {

    generateClient();

    renderSalesClient();

    return;
}


const margin =
    currentOffer -
    car.price;


area.innerHTML = `

    <div class="client-card">


        <div class="client-header">


            <div>

                <span class="client-label">
                    NOUVEAU CLIENT
                </span>


                <h2>
                    ${currentClient.name}
                </h2>


                <p>
                    ${currentClient.type}
                </p>

            </div>


            <div class="client-budget">

                Budget :

                <strong>
                    ${formatMoney(
                        currentClient.budget
                    )}
                </strong>

            </div>


        </div>


        <div class="client-request">


            <h3>
                Recherche du client
            </h3>


            <div class="requested-car">


                <strong>
                    ${getCarName(car)}
                </strong>


                <span>

                    ${car.km.toLocaleString(
                        "fr-FR"
                    )}
                    km

                </span>


                <span>

                    État :
                    ${Math.round(
                        car.condition
                    )}%

                </span>


                <span>

                    Valeur :
                    ${formatMoney(
                        car.price
                    )}

                </span>


            </div>


        </div>


        <div class="offer-box">


            <div>

                <span>
                    Offre actuelle
                </span>


                <strong>
                    ${formatMoney(
                        currentOffer
                    )}
                </strong>

            </div>


            <div>

                <span>
                    Marge
                </span>


                <strong
                    class="${
                        margin >= 0
                            ? "positive"
                            : "negative"
                    }">

                    ${
                        margin >= 0
                            ? "+"
                            : ""
                    }${formatMoney(
                        margin
                    )}

                </strong>

            </div>


        </div>


        <div class="negotiation">


            <h3>
                Négociation
            </h3>


            <div class="negotiation-actions">


                <button
                    id="acceptOffer">

                    💰 Accepter

                </button>


                <button
                    id="negotiateOffer">

                    🤝 Négocier

                </button>


                <button
                    id="rejectOffer">

                    ❌ Refuser

                </button>


            </div>


            <div class="client-interest">

                Intérêt :

                <strong>
                    ${currentClient.interest}%
                </strong>

            </div>


        </div>


    </div>

`;


document
    .getElementById(
        "acceptOffer"
    )
    ?.addEventListener(
        "click",
        acceptOffer
    );


document
    .getElementById(
        "negotiateOffer"
    )
    ?.addEventListener(
        "click",
        negotiateOffer
    );


document
    .getElementById(
        "rejectOffer"
    )
    ?.addEventListener(
        "click",
        rejectOffer
    );

}

/* =========================================================
NÉGOCIATION
========================================================= */

function negotiateOffer() {

if (!currentClient) return;


negotiationStep++;


const car =
    inventory.find(
        item =>
            item.id ===
            currentClient.carId
    );


if (!car) return;


const increase =
    Math.round(
        car.price *
        (
            0.015 +
            Math.random() * 0.025
        )
    );


currentOffer +=
    increase;


currentClient.interest -=
    Math.floor(
        3 +
        Math.random() * 7
    );


if (
    currentClient.interest <= 0
) {

    currentClient.interest = 0;


    showToast(
        `${currentClient.name} quitte la concession.`
    );


    generateClient();

} else {

    showToast(
        `Le client accepte de discuter. Offre : ${formatMoney(currentOffer)}`
    );
}


renderSales();

}

function acceptOffer() {

if (!currentClient) return;


const car =
    inventory.find(
        item =>
            item.id ===
            currentClient.carId
    );


if (!car) return;


const salePrice =
    currentOffer;


const profit =
    salePrice -
    car.price;


money +=
    salePrice;


salesHistory.push({

    id:
        Date.now(),

    clientName:
        currentClient.name,

    carName:
        getCarName(car),

    purchasePrice:
        car.price,

    salePrice:
        salePrice,

    profit:
        profit,

    date:
        new Date()
            .toLocaleDateString(
                "fr-FR"
            )
});


inventory =
    inventory.filter(
        item =>
            item.id !==
            car.id
    );


if (profit > 0) {

    reputation =
        Math.min(
            5,
            reputation + 0.03
        );

} else {

    reputation =
        Math.max(
            1,
            reputation - 0.01
        );
}


saveGame();

updateUI();

renderInventory();

renderWorkshopVehicles();


showToast(
    `${getCarName(car)} vendu à ${currentClient.name} pour ${formatMoney(salePrice)}`
);


generateClient();

renderSales();

renderStats();

}

function rejectOffer() {

if (!currentClient) return;


showToast(
    `${currentClient.name} repart sans acheter.`
);


generateClient();

renderSales();

}

/* =========================================================
STATISTIQUES
========================================================= */

function renderStats() {

const stats =
    document.getElementById(
        "stats"
    );

if (!stats) return;


const revenue =
    salesHistory.reduce(
        (sum, sale) =>
            sum +
            Number(
                sale.salePrice || 0
            ),
        0
    );


const profit =
    salesHistory.reduce(
        (sum, sale) =>
            sum +
            Number(
                sale.profit || 0
            ),
        0
    );


stats.innerHTML = `

    <div class="stats-dashboard">


        <div class="stats-card">

            <span>
                Capital disponible
            </span>

            <strong>
                ${formatMoney(money)}
            </strong>

        </div>


        <div class="stats-card">

            <span>
                Véhicules en stock
            </span>

            <strong>
                ${inventory.length}
            </strong>

        </div>


        <div class="stats-card">

            <span>
                Véhicules vendus
            </span>

            <strong>
                ${salesHistory.length}
            </strong>

        </div>


        <div class="stats-card">

            <span>
                Chiffre d'affaires
            </span>

            <strong>
                ${formatMoney(revenue)}
            </strong>

        </div>


        <div class="stats-card">

            <span>
                Bénéfice cumulé
            </span>

            <strong>
                ${formatMoney(profit)}
            </strong>

        </div>


        <div class="stats-card">

            <span>
                Réputation
            </span>

            <strong>
                ${reputation.toFixed(2)} / 5
            </strong>

        </div>


    </div>

`;

}

/* =========================================================
BOUTON VOIR TOUT
========================================================= */

const viewCar =
document.getElementById(
"viewCar"
);

if (viewCar) {

viewCar.addEventListener(
    "click",
    () => {

        if (
            inventory.length === 0
        ) {

            showToast(
                "Votre stock est vide."
            );

            return;
        }


        openPage("stock");
    }
);

}

/* =========================================================
NOTIFICATIONS
========================================================= */

const notificationButton =
document.getElementById(
"notificationButton"
);

if (notificationButton) {

notificationButton.addEventListener(
    "click",
    () => {

        showToast(
            "Aucune nouvelle notification."
        );
    }
);

}

/* =========================================================
INITIALISATION
========================================================= */

prepareInventory();

prepareSalesHistory();

saveGame();

renderMarket();

renderWorkshop();

renderInventory();

renderSales();

renderStats();

updateUI();

saveGame();

console.log(
"ZENTRO DEALERSHIP V5 — système chargé."
);

Fermer
