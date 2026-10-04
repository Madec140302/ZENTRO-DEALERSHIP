/* =========================================================
   ZENTRO DEALERSHIP
   V5 — STOCK + MARCHÉ + ATELIER + VENTES + SHOWROOM 3D
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


/* =========================================================
   OUTILS
========================================================= */

function formatMoney(value) {
    return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0
    }).format(value);
}

function saveGame() {
    localStorage.setItem(
        "zentro_money",
        String(money)
    );

    localStorage.setItem(
        "zentro_inventory",
        JSON.stringify(inventory)
    );

    localStorage.setItem(
        "zentro_reputation",
        String(reputation)
    );
}

function showToast(message, type = "success") {

    let toast =
        document.querySelector(".zentro-toast");

    if (!toast) {

        toast = document.createElement("div");

        toast.className = "zentro-toast";

        document.body.appendChild(toast);
    }

    toast.textContent = message;

    toast.className =
        "zentro-toast " + type;

    requestAnimationFrame(() => {
        toast.classList.add("show");
    });

    clearTimeout(toast._timer);

    toast._timer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2800);
}


/* =========================================================
   INTERFACE
========================================================= */

const pageTitles = {
    dashboard: "Dashboard",
    stock: "Stock",
    market: "Marché",
    workshop: "Atelier",
    sales: "Ventes",
    showroom: "Showroom 3D",
    analytics: "Analytics",
    settings: "Paramètres"
};

function updateUI() {

    const moneyElements =
        document.querySelectorAll(
            "[data-money]"
        );

    moneyElements.forEach(element => {
        element.textContent =
            formatMoney(money);
    });

    const stockCount =
        document.querySelector(
            "[data-stock-count]"
        );

    if (stockCount) {
        stockCount.textContent =
            inventory.length;
    }

    const reputationElement =
        document.querySelector(
            "[data-reputation]"
        );

    if (reputationElement) {
        reputationElement.textContent =
            reputation.toFixed(1);
    }
}

function openPage(page) {

    document
        .querySelectorAll(".page")
        .forEach(section => {

            section.classList.remove("active");
        });

    const target =
        document.getElementById(page);

    if (target) {
        target.classList.add("active");
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

    if (page === "stock") {
        renderInventory();
    }

    if (page === "market") {
        renderMarket();
    }

    if (page === "workshop") {
        renderWorkshop();
    }

    if (page === "sales") {
        renderSales();
    }

    if (page === "showroom") {

        setTimeout(() => {

            if (
                typeof openShowroom ===
                "function"
            ) {
                openShowroom();
            }

        }, 50);
    }

    updateUI();
}


/* =========================================================
   NAVIGATION
========================================================= */

document
    .querySelectorAll(".nav-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const page =
                    button.dataset.page;

                if (!page) return;

                openPage(page);
            }
        );
    });


/* =========================================================
   STOCK
========================================================= */

function renderInventory() {

    const grid =
        document.querySelector(
            "#stock .inventory-grid"
        );

    if (!grid) return;

    grid.innerHTML = "";

    if (inventory.length === 0) {

        grid.innerHTML = `
            <div class="empty-state">
                <strong>Stock vide</strong>
                <span>
                    Achetez des véhicules
                    depuis le marché.
                </span>
            </div>
        `;

        return;
    }

    inventory.forEach(car => {

        const card =
            document.createElement("div");

        card.className =
            "inventory-card";

        const condition =
            car.condition ?? 100;

        const performance =
            car.performance ?? 0;

        const detailing =
            car.detailing ?? 0;

        card.innerHTML = `
            <div class="inventory-card-top">
                <span class="vehicle-category">
                    ${car.category}
                </span>

                <span class="vehicle-condition">
                    ${condition}%
                </span>
            </div>

            <h3>${car.name}</h3>

            <div class="inventory-specs">

                <span>
                    <small>KILOMÉTRAGE</small>
                    ${car.km.toLocaleString("fr-FR")} km
                </span>

                <span>
                    <small>VALEUR</small>
                    ${formatMoney(car.price)}
                </span>

                <span>
                    <small>PERFORMANCE</small>
                    +${performance}%
                </span>

            </div>

            <div class="inventory-progress">

                <div>
                    <span>État</span>
                    <strong>${condition}%</strong>
                </div>

                <div class="progress-bar">
                    <span style="width:${condition}%"></span>
                </div>

            </div>

            <div class="inventory-actions">

                <button
                    class="secondary-btn"
                    onclick="openWorkshopForCar(${car.id})"
                >
                    🔧 Atelier
                </button>

                <button
                    class="danger-btn"
                    onclick="sellCar(${car.id})"
                >
                    Vendre
                </button>

            </div>
        `;

        grid.appendChild(card);
    });
}


function openWorkshopForCar(id) {

    openPage("workshop");

    setTimeout(() => {

        if (
            typeof selectWorkshopCar ===
            "function"
        ) {
            selectWorkshopCar(id);
        }

    }, 50);
}


function sellCar(id) {

    const index =
        inventory.findIndex(
            car => car.id === id
        );

    if (index === -1) return;

    const car = inventory[index];

    const multiplier =
        0.95 +
        Math.random() * 0.10;

    const salePrice =
        Math.round(
            car.price * multiplier
        );

    money += salePrice;

    inventory.splice(index, 1);

    reputation = Math.min(
        5,
        reputation + 0.02
    );

    saveGame();
    updateUI();
    renderInventory();

    showToast(
        `${car.name} vendu pour ${formatMoney(salePrice)}.`
    );
}


/* =========================================================
   MARCHÉ
========================================================= */

const marketCars = [

    {
        id: 101,
        name: "BMW M3 Competition 2025",
        km: 8200,
        price: 91500,
        category: "Sportive"
    },

    {
        id: 102,
        name: "BMW M5 2025",
        km: 6100,
        price: 124900,
        category: "Sportive"
    },

    {
        id: 103,
        name: "Audi RS5 2025",
        km: 12400,
        price: 84900,
        category: "Sportive"
    },

    {
        id: 104,
        name: "Audi RS7 2025",
        km: 7600,
        price: 119900,
        category: "Premium"
    },

    {
        id: 105,
        name: "Mercedes-AMG C43 AMG 2025",
        km: 10400,
        price: 72500,
        category: "Sportive"
    },

    {
        id: 106,
        name: "Porsche 911 Carrera 2025",
        km: 5400,
        price: 139900,
        category: "Sportive"
    }

];


function buyCar(car) {

    if (money < car.price) {

        showToast(
            "Fonds insuffisants pour acheter ce véhicule.",
            "error"
        );

        return;
    }

    money -= car.price;

    inventory.push({

        id:
            Date.now() +
            Math.floor(
                Math.random() * 1000
            ),

        name: car.name,

        km: car.km,

        price: car.price,

        category: car.category,

        condition: 100,

        performance: 0,

        detailing: 0

    });

    saveGame();

    updateUI();

    renderInventory();

    showToast(
        `${car.name} ajouté à votre stock.`
    );
}


function renderMarket() {

    const page =
        document.getElementById("market");

    if (!page) return;

    let container =
        page.querySelector(".market-cars");

    if (!container) {

        container =
            document.createElement("div");

        container.className =
            "market-cars";

        const panel =
            page.querySelector(
                ".market-panel"
            );

        if (panel) {
            panel.after(container);
        } else {
            page.appendChild(container);
        }
    }

    container.innerHTML = "";

    marketCars.forEach(car => {

        const card =
            document.createElement("div");

        card.className =
            "market-car-card";

        card.innerHTML = `

            <div class="market-car-image">
                🚘
            </div>

            <div class="market-car-content">

                <span class="vehicle-category">
                    ${car.category}
                </span>

                <h3>${car.name}</h3>

                <div class="market-car-specs">

                    <span>
                        ${car.km.toLocaleString("fr-FR")} km
                    </span>

                    <strong>
                        ${formatMoney(car.price)}
                    </strong>

                </div>

                <button
                    class="primary-btn"
                    data-buy-id="${car.id}"
                >
                    Acheter
                </button>

            </div>
        `;

        const button =
            card.querySelector(
                "[data-buy-id]"
            );

        button.addEventListener(
            "click",
            () => buyCar(car)
        );

        container.appendChild(card);
    });
}


/* =========================================================
   ATELIER — PRÉPARATION
========================================================= */

function prepareWorkshopData() {

    inventory.forEach(car => {

        if (
            typeof car.condition !==
            "number"
        ) {
            car.condition = 100;
        }

        if (
            typeof car.performance !==
            "number"
        ) {
            car.performance = 0;
        }

        if (
            typeof car.detailing !==
            "number"
        ) {
            car.detailing = 0;
        }
    });
}


function repairPrice(car) {

    if (car.condition >= 100) {
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


/* =========================================================
   FIN PARTIE 1
========================================================= */
/* =========================================================
   ATELIER — RENDU
========================================================= */

function renderWorkshop() {

    const page =
        document.getElementById("workshop");

    if (!page) return;

    page.innerHTML = `
        <div class="workshop-layout">

            <div class="workshop-vehicles">

                <div class="section-heading">
                    <span>GARAGE</span>
                    <h2>Vos véhicules</h2>
                    <p>
                        Sélectionnez un véhicule
                        pour accéder aux opérations.
                    </p>
                </div>

                <div
                    id="workshopVehicleList"
                    class="workshop-vehicle-list"
                ></div>

            </div>

            <div
                id="workshopDetails"
                class="workshop-management"
            >
                <div class="workshop-empty">
                    <div>🔧</div>
                    <h3>Aucun véhicule sélectionné</h3>
                    <p>
                        Sélectionnez un véhicule
                        dans votre stock.
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

    list.innerHTML = "";

    if (inventory.length === 0) {

        list.innerHTML = `
            <div class="workshop-empty">
                <h3>Garage vide</h3>
                <p>
                    Achetez un véhicule
                    sur le marché.
                </p>
            </div>
        `;

        return;
    }

    inventory.forEach(car => {

        const condition =
            car.condition ?? 100;

        const item =
            document.createElement("button");

        item.className =
            "workshop-vehicle";

        item.dataset.id = car.id;

        item.innerHTML = `

            <div class="workshop-vehicle-icon">
                🚘
            </div>

            <div class="workshop-vehicle-info">

                <strong>${car.name}</strong>

                <span>
                    ${car.km.toLocaleString("fr-FR")} km
                </span>

                <div class="workshop-condition">

                    <span>
                        État ${condition}%
                    </span>

                    <div class="progress-bar">
                        <span
                            style="width:${condition}%"
                        ></span>
                    </div>

                </div>

            </div>

        `;

        item.addEventListener(
            "click",
            () => selectWorkshopCar(car.id)
        );

        list.appendChild(item);
    });
}


function selectWorkshopCar(id) {

    const car =
        inventory.find(
            vehicle => vehicle.id === id
        );

    if (!car) return;

    const details =
        document.getElementById(
            "workshopDetails"
        );

    if (!details) return;

    const condition =
        car.condition ?? 100;

    const performance =
        car.performance ?? 0;

    const detailing =
        car.detailing ?? 0;

    const repairCost =
        repairPrice(car);

    details.innerHTML = `

        <div class="workshop-detail-header">

            <span>VÉHICULE SÉLECTIONNÉ</span>

            <h2>${car.name}</h2>

            <p>
                ${car.category}
                ·
                ${car.km.toLocaleString("fr-FR")} km
            </p>

        </div>

        <div class="workshop-stat-grid">

            <div class="workshop-stat">

                <span>ÉTAT</span>

                <strong>
                    ${condition}%
                </strong>

                <div class="progress-bar">
                    <span
                        style="width:${condition}%"
                    ></span>
                </div>

            </div>

            <div class="workshop-stat">

                <span>PERFORMANCE</span>

                <strong>
                    +${performance}%
                </strong>

                <div class="progress-bar">
                    <span
                        style="width:${Math.min(
                            performance * 4,
                            100
                        )}%"
                    ></span>
                </div>

            </div>

            <div class="workshop-stat">

                <span>DETAILING</span>

                <strong>
                    ${detailing}%
                </strong>

                <div class="progress-bar">
                    <span
                        style="width:${detailing}%"
                    ></span>
                </div>

            </div>

        </div>

        <div class="workshop-value">

            <span>VALEUR ACTUELLE</span>

            <strong>
                ${formatMoney(car.price)}
            </strong>

        </div>

        <div class="workshop-actions">

            <div class="workshop-action">

                <div>
                    <strong>🔧 Révision & réparation</strong>

                    <span>
                        Remettre le véhicule
                        en parfait état.
                    </span>
                </div>

                <button
                    class="primary-btn"
                    onclick="repairVehicle(${car.id})"
                    ${condition >= 100 ? "disabled" : ""}
                >
                    ${
                        condition >= 100
                            ? "Déjà parfait"
                            : formatMoney(repairCost)
                    }
                </button>

            </div>


            <div class="workshop-action">

                <div>
                    <strong>⚙️ Préparation performance</strong>

                    <span>
                        Améliore les performances
                        et la valeur du véhicule.
                    </span>
                </div>

                <button
                    class="primary-btn"
                    onclick="upgradeVehicle(${car.id})"
                    ${performance >= 25 ? "disabled" : ""}
                >
                    ${performance >= 25
                        ? "MAX"
                        : "7 500 €"}
                </button>

            </div>


            <div class="workshop-action">

                <div>
                    <strong>✨ Detailing premium</strong>

                    <span>
                        Nettoyage et finition
                        haut de gamme.
                    </span>
                </div>

                <button
                    class="primary-btn"
                    onclick="detailVehicle(${car.id})"
                    ${detailing >= 100 ? "disabled" : ""}
                >
                    ${detailing >= 100
                        ? "MAX"
                        : "2 500 €"}
                </button>

            </div>

        </div>

    `;

    document
        .querySelectorAll(
            ".workshop-vehicle"
        )
        .forEach(button => {

            button.classList.toggle(
                "selected",
                Number(button.dataset.id) === id
            );

        });
}


/* =========================================================
   ATELIER — RÉPARATION
========================================================= */

function repairVehicle(id) {

    const car =
        inventory.find(
            vehicle => vehicle.id === id
        );

    if (!car) return;

    if (car.condition >= 100) {

        showToast(
            "Ce véhicule est déjà en parfait état."
        );

        return;
    }

    const cost =
        repairPrice(car);

    if (money < cost) {

        showToast(
            "Fonds insuffisants pour cette réparation.",
            "error"
        );

        return;
    }

    money -= cost;

    car.condition = 100;

    car.price += Math.round(
        cost * 0.65
    );

    saveGame();

    updateUI();

    renderInventory();

    renderWorkshop();

    selectWorkshopCar(id);

    showToast(
        `${car.name} a été entièrement réparé.`
    );
}


/* =========================================================
   ATELIER — PERFORMANCE
========================================================= */

function upgradeVehicle(id) {

    const car =
        inventory.find(
            vehicle => vehicle.id === id
        );

    if (!car) return;

    const performance =
        car.performance ?? 0;

    if (performance >= 25) {

        showToast(
            "La préparation performance est déjà au maximum."
        );

        return;
    }

    const cost = 7500;

    if (money < cost) {

        showToast(
            "Fonds insuffisants pour cette préparation.",
            "error"
        );

        return;
    }

    money -= cost;

    car.performance =
        Math.min(
            25,
            performance + 5
        );

    car.price += 10000;

    saveGame();

    updateUI();

    renderInventory();

    renderWorkshop();

    selectWorkshopCar(id);

    showToast(
        `${car.name} a reçu une amélioration performance.`
    );
}


/* =========================================================
   ATELIER — DETAILING
========================================================= */

function detailVehicle(id) {

    const car =
        inventory.find(
            vehicle => vehicle.id === id
        );

    if (!car) return;

    const detailing =
        car.detailing ?? 0;

    if (detailing >= 100) {

        showToast(
            "Le detailing est déjà au maximum."
        );

        return;
    }

    const cost = 2500;

    if (money < cost) {

        showToast(
            "Fonds insuffisants pour le detailing.",
            "error"
        );

        return;
    }

    money -= cost;

    car.detailing =
        Math.min(
            100,
            detailing + 25
        );

    car.price += 3000;

    saveGame();

    updateUI();

    renderInventory();

    renderWorkshop();

    selectWorkshopCar(id);

    showToast(
        `${car.name} bénéficie maintenant d'un detailing premium.`
    );
}


/* =========================================================
   VENTES — DONNÉES
========================================================= */

let salesHistory =
    JSON.parse(
        localStorage.getItem(
            "zentro_sales_history"
        ) || "[]"
    );


function saveSalesHistory() {

    localStorage.setItem(
        "zentro_sales_history",
        JSON.stringify(
            salesHistory
        )
    );
}


/* =========================================================
   VENTES — RENDU
========================================================= */

function renderSales() {

    const page =
        document.getElementById("sales");

    if (!page) return;

    const soldCount =
        salesHistory.length;

    const totalRevenue =
        salesHistory.reduce(
            (total, sale) =>
                total +
                Number(
                    sale.price || 0
                ),
            0
        );

    const averageSale =
        soldCount > 0
            ? totalRevenue / soldCount
            : 0;

    page.innerHTML = `

        <div class="sales-header">

            <div>
                <span class="sales-label">
                    ZENTRO DEALERSHIP
                </span>

                <h2>
                    Ventes
                </h2>

                <p>
                    Gérez vos transactions
                    et suivez les performances
                    de votre concession.
                </p>
            </div>

        </div>


        <div class="sales-stats">

            <div class="sales-stat-card">

                <span>
                    VÉHICULES VENDUS
                </span>

                <strong>
                    ${soldCount}
                </strong>

            </div>


            <div class="sales-stat-card">

                <span>
                    CHIFFRE D'AFFAIRES
                </span>

                <strong>
                    ${formatMoney(totalRevenue)}
                </strong>

            </div>


            <div class="sales-stat-card">

                <span>
                    VENTE MOYENNE
                </span>

                <strong>
                    ${formatMoney(averageSale)}
                </strong>

            </div>


            <div class="sales-stat-card">

                <span>
                    RÉPUTATION
                </span>

                <strong>
                    ${reputation.toFixed(1)} ★
                </strong>

            </div>

        </div>


        <div class="sales-panel">

            <div class="section-heading">

                <span>
                    HISTORIQUE
                </span>

                <h2>
                    Transactions récentes
                </h2>

            </div>

            <div
                class="sales-list"
                id="salesList"
            ></div>

        </div>

    `;

    renderSalesHistory();
}


/* =========================================================
   VENTES — HISTORIQUE
========================================================= */

function renderSalesHistory() {

    const list =
        document.getElementById(
            "salesList"
        );

    if (!list) return;

    list.innerHTML = "";

    if (salesHistory.length === 0) {

        list.innerHTML = `

            <div class="empty-state">

                <strong>
                    Aucune vente
                </strong>

                <span>
                    Vos futures transactions
                    apparaîtront ici.
                </span>

            </div>

        `;

        return;
    }

    salesHistory
        .slice()
        .reverse()
        .forEach(sale => {

            const row =
                document.createElement(
                    "div"
                );

            row.className =
                "sale-row";

            row.innerHTML = `

                <div class="sale-vehicle">

                    <div class="sale-icon">
                        🚘
                    </div>

                    <div>

                        <strong>
                            ${sale.name || "Véhicule"}
                        </strong>

                        <span>
                            ${
                                sale.date ||
                                "Transaction"
                            }
                        </span>

                    </div>

                </div>


                <div class="sale-category">

                    ${
                        sale.category ||
                        "Automobile"
                    }

                </div>


                <div class="sale-price">

                    <span>
                        Prix de vente
                    </span>

                    <strong>
                        ${formatMoney(
                            Number(
                                sale.price || 0
                            )
                        )}
                    </strong>

                </div>

            `;

            list.appendChild(row);
        });
}


/* =========================================================
   VENTES — ENREGISTREMENT
========================================================= */

function registerSale(
    car,
    salePrice
) {

    salesHistory.push({

        name: car.name,

        category:
            car.category ||
            "Automobile",

        price:
            Number(salePrice) || 0,

        km:
            Number(car.km) || 0,

        date:
            new Date().toLocaleDateString(
                "fr-FR"
            )

    });

    saveSalesHistory();
}


/* =========================================================
   REMPLACEMENT DE LA VENTE
========================================================= */

const originalSellCar =
    sellCar;

sellCar = function(id) {

    const car =
        inventory.find(
            vehicle => vehicle.id === id
        );

    if (!car) return;

    const multiplier =
        0.95 +
        Math.random() * 0.10;

    const salePrice =
        Math.round(
            car.price * multiplier
        );

    registerSale(
        car,
        salePrice
    );

    originalSellCar(id);

    renderSales();
};


/* =========================================================
   INITIALISATION
========================================================= */

prepareWorkshopData();

renderMarket();

renderWorkshop();

renderSales();

updateUI();

renderInventory();

saveGame();


console.log(
    "ZENTRO DEALERSHIP V5 — STOCK / MARCHÉ / ATELIER / VENTES OK"
);


/* =========================================================
   FIN PARTIE 2
========================================================= */
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
