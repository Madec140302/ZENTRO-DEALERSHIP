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
            "BMW M4 Competition 2025",

        km:
            5400,

        price:
            94900,

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
            "Audi RS3 2025",

        km:
            7200,

        price:
            69900,

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
            "Audi RS6 Avant 2025",

        km:
            7600,

        price:
            128500,

        category:
            "Premium"
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
            "Mercedes-AMG C63 S E Performance 2025",

        km:
            6800,

        price:
            112900,

        category:
            "Sportive"
    },


    {
        name:
            "Mercedes-AMG GT 63 S 2025",

        km:
            4900,

        price:
            189900,

        category:
            "Supercar"
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
    },


    {
        name:
            "Porsche 911 Turbo S 2025",

        km:
            3200,

        price:
            249900,

        category:
            "Supercar"
    },


    {
        name:
            "Porsche 718 Cayman GT4 RS 2025",

        km:
            4100,

        price:
            169900,

        category:
            "Sportive"
    },


    {
        name:
            "Ferrari 296 GTB 2025",

        km:
            2800,

        price:
            329900,

        category:
            "Supercar"
    },


    {
        name:
            "Ferrari SF90 Stradale 2025",

        km:
            1900,

        price:
            489900,

        category:
            "Supercar"
    },


    {
        name:
            "Lamborghini Huracán EVO",

        km:
            5200,

        price:
            259900,

        category:
            "Supercar"
    },


    {
        name:
            "Lamborghini Revuelto 2025",

        km:
            1200,

        price:
            589900,

        category:
            "Supercar"
    },


    {
        name:
            "Lamborghini Temerario 2025",

        km:
            900,

        price:
            389900,

        category:
            "Supercar"
    },


    {
        name:
            "McLaren 750S 2025",

        km:
            2300,

        price:
            379900,

        category:
            "Supercar"
    },


    {
        name:
            "Aston Martin Vantage 2025",

        km:
            6200,

        price:
            189900,

        category:
            "Premium"
    }
];


function renderMarket() {

    const marketPage =
        document.getElementById(
            "market"
        );

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
// ============================================================
// ZENTRO DEALERSHIP V6
// PARTIE 2 / 2
// ============================================================

// ------------------------------------------------------------
// WORKSHOP
// ------------------------------------------------------------

function selectWorkshopCar(index) {
    const car = inventory[index];

    if (!car) return;

    selectedWorkshopCar = index;

    const workshopTitle = document.getElementById("workshopTitle");
    const workshopInfo = document.getElementById("workshopInfo");
    const workshopActions = document.getElementById("workshopActions");

    if (workshopTitle) {
        workshopTitle.textContent = car.name;
    }

    if (workshopInfo) {
        workshopInfo.innerHTML = `
            <div class="workshop-car-card">
                <h3>${car.name}</h3>
                <p>Prix actuel : <strong>${formatMoney(car.price)}</strong></p>
                <p>État : <strong>${car.condition}%</strong></p>
                <p>Kilométrage : <strong>${car.km.toLocaleString("fr-FR")} km</strong></p>
                <p>Puissance : <strong>${car.hp} ch</strong></p>
            </div>
        `;
    }

    if (workshopActions) {
        workshopActions.style.display = "flex";
    }
}


// ------------------------------------------------------------
// REPARATION
// ------------------------------------------------------------

function repairVehicle() {

    if (selectedWorkshopCar === null) {
        showNotification("Sélectionne d'abord une voiture.", "warning");
        return;
    }

    const car = inventory[selectedWorkshopCar];

    if (!car) return;

    if (car.condition >= 100) {
        showNotification("Cette voiture est déjà en parfait état.", "info");
        return;
    }

    const missingCondition = 100 - car.condition;
    const repairPrice = Math.max(250, missingCondition * 35);

    if (money < repairPrice) {
        showNotification("Fonds insuffisants pour cette réparation.", "error");
        return;
    }

    money -= repairPrice;
    car.condition = 100;

    saveGame();
    updateMoney();

    showNotification(
        `${car.name} réparée pour ${formatMoney(repairPrice)}.`,
        "success"
    );

    selectWorkshopCar(selectedWorkshopCar);
    renderInventory();
}


// ------------------------------------------------------------
// AMELIORATION
// ------------------------------------------------------------

function upgradeVehicle() {

    if (selectedWorkshopCar === null) {
        showNotification("Sélectionne d'abord une voiture.", "warning");
        return;
    }

    const car = inventory[selectedWorkshopCar];

    if (!car) return;

    const upgradePrice = 5000;

    if (money < upgradePrice) {
        showNotification("Fonds insuffisants pour cette amélioration.", "error");
        return;
    }

    money -= upgradePrice;

    car.hp += 25;

    if (!car.upgrades) {
        car.upgrades = [];
    }

    car.upgrades.push("Performance Stage " + car.upgrades.length + 1);

    saveGame();
    updateMoney();

    showNotification(
        `${car.name} améliorée : +25 ch.`,
        "success"
    );

    selectWorkshopCar(selectedWorkshopCar);
    renderInventory();
}


// ------------------------------------------------------------
// DETAILS VEHICULE
// ------------------------------------------------------------

function detailVehicle(index) {

    const car = inventory[index];

    if (!car) return;

    const modal = document.getElementById("vehicleModal");

    if (!modal) return;

    modal.innerHTML = `
        <div class="modal-content">

            <button class="close-modal" onclick="closeVehicleModal()">
                ×
            </button>

            <h2>${car.name}</h2>

            <div class="vehicle-details">

                <p>
                    <strong>Prix :</strong>
                    ${formatMoney(car.price)}
                </p>

                <p>
                    <strong>Puissance :</strong>
                    ${car.hp} ch
                </p>

                <p>
                    <strong>Kilométrage :</strong>
                    ${car.km.toLocaleString("fr-FR")} km
                </p>

                <p>
                    <strong>État :</strong>
                    ${car.condition}%
                </p>

                <p>
                    <strong>Année :</strong>
                    ${car.year}
                </p>

                <p>
                    <strong>Transmission :</strong>
                    ${car.transmission || "Automatique"}
                </p>

                <p>
                    <strong>Carburant :</strong>
                    ${car.fuel || "Essence"}
                </p>

            </div>

            <div class="modal-actions">

                <button onclick="sellVehicle(${index})">
                    Vendre
                </button>

                <button onclick="closeVehicleModal()">
                    Fermer
                </button>

            </div>

        </div>
    `;

    modal.classList.add("active");
}


function closeVehicleModal() {

    const modal = document.getElementById("vehicleModal");

    if (modal) {
        modal.classList.remove("active");
    }
}


// ------------------------------------------------------------
// VENTE VEHICULE
// ------------------------------------------------------------

function sellVehicle(index) {

    const car = inventory[index];

    if (!car) return;

    const salePrice = Math.floor(
        car.price * (car.condition / 100) * 0.85
    );

    money += salePrice;

    inventory.splice(index, 1);

    selectedWorkshopCar = null;

    saveGame();
    updateMoney();

    renderInventory();
    renderWorkshop();

    closeVehicleModal();

    showNotification(
        `${car.name} vendue pour ${formatMoney(salePrice)}.`,
        "success"
    );
}


// ------------------------------------------------------------
// STOCK
// ------------------------------------------------------------

function renderInventory() {

    const container = document.getElementById("inventoryList");

    if (!container) return;

    container.innerHTML = "";

    if (inventory.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                <h3>Stock vide</h3>
                <p>Aucun véhicule actuellement en stock.</p>
            </div>
        `;

        return;
    }

    inventory.forEach((car, index) => {

        const card = document.createElement("div");

        card.className = "vehicle-card";

        card.innerHTML = `
            <div class="vehicle-card-header">
                <span class="vehicle-brand">
                    ${car.brand || "Zentro"}
                </span>

                <span class="vehicle-year">
                    ${car.year}
                </span>
            </div>

            <h3>${car.name}</h3>

            <div class="vehicle-stats">

                <span>
                    ${car.hp} ch
                </span>

                <span>
                    ${car.km.toLocaleString("fr-FR")} km
                </span>

                <span>
                    État ${car.condition}%
                </span>

            </div>

            <div class="vehicle-price">
                ${formatMoney(car.price)}
            </div>

            <div class="vehicle-buttons">

                <button onclick="detailVehicle(${index})">
                    Détails
                </button>

                <button onclick="selectWorkshopCar(${index})">
                    Atelier
                </button>

            </div>
        `;

        container.appendChild(card);
    });
}


// ------------------------------------------------------------
// ATELIER
// ------------------------------------------------------------

function renderWorkshop() {

    const container = document.getElementById("workshopList");

    if (!container) return;

    container.innerHTML = "";

    if (inventory.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                <h3>Aucune voiture</h3>
                <p>Achète un véhicule pour accéder à l'atelier.</p>
            </div>
        `;

        return;
    }

    inventory.forEach((car, index) => {

        const card = document.createElement("div");

        card.className = "workshop-card";

        card.innerHTML = `

            <div>

                <h3>${car.name}</h3>

                <p>
                    État :
                    <strong>${car.condition}%</strong>
                </p>

                <p>
                    Puissance :
                    <strong>${car.hp} ch</strong>
                </p>

            </div>

            <button onclick="selectWorkshopCar(${index})">
                Sélectionner
            </button>
        `;

        container.appendChild(card);
    });
}


// ------------------------------------------------------------
// MARCHE AUTOMOBILE
// ------------------------------------------------------------

function renderMarket() {

    const container = document.getElementById("marketList");

    if (!container) return;

    container.innerHTML = "";

    marketCars.forEach((car, index) => {

        const card = document.createElement("div");

        card.className = "market-card";

        card.innerHTML = `

            <div class="market-header">

                <span>
                    ${car.brand}
                </span>

                <span>
                    ${car.year}
                </span>

            </div>

            <h3>${car.name}</h3>

            <div class="market-specs">

                <p>${car.hp} ch</p>

                <p>${car.km.toLocaleString("fr-FR")} km</p>

                <p>${car.transmission}</p>

            </div>

            <div class="market-price">
                ${formatMoney(car.price)}
            </div>

            <button
                onclick="buyMarketVehicle(${index})"
                ${money < car.price ? "disabled" : ""}
            >
                Acheter
            </button>
        `;

        container.appendChild(card);
    });
}


// ------------------------------------------------------------
// ACHAT VEHICULE
// ------------------------------------------------------------

function buyMarketVehicle(index) {

    const car = marketCars[index];

    if (!car) return;

    if (money < car.price) {

        showNotification(
            "Tu n'as pas assez d'argent.",
            "error"
        );

        return;
    }

    money -= car.price;

    const purchasedCar = {
        ...car,
        condition: 100,
        id: Date.now() + Math.random(),
        upgrades: []
    };

    inventory.push(purchasedCar);

    marketCars.splice(index, 1);

    saveGame();

    updateMoney();

    renderMarket();
    renderInventory();
    renderWorkshop();

    showNotification(
        `${car.name} ajoutée à ton stock.`,
        "success"
    );
}


// ------------------------------------------------------------
// CLIENTS
// ------------------------------------------------------------

function renderClients() {

    const container = document.getElementById("clientsList");

    if (!container) return;

    container.innerHTML = "";

    clients.forEach((client, index) => {

        const card = document.createElement("div");

        card.className = "client-card";

        card.innerHTML = `

            <div class="client-avatar">
                ${client.name.charAt(0)}
            </div>

            <div class="client-info">

                <h3>${client.name}</h3>

                <p>
                    Budget :
                    ${formatMoney(client.budget)}
                </p>

                <p>
                    Recherche :
                    ${client.preference}
                </p>

            </div>

            <button onclick="contactClient(${index})">
                Contacter
            </button>
        `;

        container.appendChild(card);
    });
}


// ------------------------------------------------------------
// CONTACT CLIENT
// ------------------------------------------------------------

function contactClient(index) {

    const client = clients[index];

    if (!client) return;

    const availableCar = inventory.find(car => {

        return (
            car.price <= client.budget &&
            car.condition >= 70
        );

    });

    if (!availableCar) {

        showNotification(
            `${client.name} n'a trouvé aucun véhicule adapté.`,
            "warning"
        );

        return;
    }

    const salePrice = Math.floor(
        availableCar.price * 1.08
    );

    money += salePrice;

    const carIndex = inventory.indexOf(availableCar);

    inventory.splice(carIndex, 1);

    clients.splice(index, 1);

    saveGame();

    updateMoney();

    renderInventory();
    renderClients();
    renderWorkshop();

    showNotification(
        `Vente réalisée avec ${client.name} pour ${formatMoney(salePrice)}.`,
        "success"
    );
}


// ------------------------------------------------------------
// NAVIGATION
// ------------------------------------------------------------

function openPage(page) {

    const pages = document.querySelectorAll(".page");

    pages.forEach(section => {
        section.classList.remove("active");
    });

    const target = document.getElementById(page);

    if (target) {
        target.classList.add("active");
    }

    const navButtons = document.querySelectorAll("[data-page]");

    navButtons.forEach(button => {

        button.classList.remove("active");

        if (button.dataset.page === page) {
            button.classList.add("active");
        }
    });

    if (page === "stock") {
        renderInventory();
    }

    if (page === "market") {
        renderMarket();
    }

    if (page === "workshop") {
        renderWorkshop();
    }

    if (page === "clients") {
        renderClients();
    }
}


// ------------------------------------------------------------
// ARGENT
// ------------------------------------------------------------

function updateMoney() {

    const elements = document.querySelectorAll(
        "#money, .money-value, [data-money]"
    );

    elements.forEach(element => {

        element.textContent = formatMoney(money);

    });
}


function formatMoney(value) {

    return new Intl.NumberFormat(
        "fr-FR",
        {
            style: "currency",
            currency: "EUR",
            maximumFractionDigits: 0
        }
    ).format(value);
}


// ------------------------------------------------------------
// NOTIFICATIONS
// ------------------------------------------------------------

function showNotification(message, type = "info") {

    let container =
        document.getElementById("notificationContainer");

    if (!container) {

        container = document.createElement("div");

        container.id = "notificationContainer";

        document.body.appendChild(container);
    }

    const notification = document.createElement("div");

    notification.className =
        `notification notification-${type}`;

    notification.textContent = message;

    container.appendChild(notification);

    setTimeout(() => {

        notification.classList.add("hide");

        setTimeout(() => {
            notification.remove();
        }, 300);

    }, 3000);
}


// ------------------------------------------------------------
// SAUVEGARDE
// ------------------------------------------------------------

function saveGame() {

    const saveData = {

        money: money,

        inventory: inventory,

        marketCars: marketCars,

        clients: clients,

        selectedWorkshopCar:
            selectedWorkshopCar

    };

    localStorage.setItem(
        "zentroDealershipV6",
        JSON.stringify(saveData)
    );
}


// ------------------------------------------------------------
// CHARGEMENT
// ------------------------------------------------------------

function loadGame() {

    const saved =
        localStorage.getItem("zentroDealershipV6");

    if (!saved) return;

    try {

        const data = JSON.parse(saved);

        if (typeof data.money === "number") {
            money = data.money;
        }

        if (Array.isArray(data.inventory)) {
            inventory = data.inventory;
        }

        if (Array.isArray(data.marketCars)) {
            marketCars = data.marketCars;
        }

        if (Array.isArray(data.clients)) {
            clients = data.clients;
        }

        if (
            typeof data.selectedWorkshopCar === "number"
        ) {
            selectedWorkshopCar =
                data.selectedWorkshopCar;
        }

    } catch (error) {

        console.error(
            "Erreur lors du chargement de la sauvegarde :",
            error
        );
    }
}


// ------------------------------------------------------------
// INITIALISATION
// ------------------------------------------------------------

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadGame();

        updateMoney();

        renderInventory();
        renderMarket();
        renderWorkshop();
        renderClients();

        document
            .querySelectorAll("[data-page]")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const page =
                            button.dataset.page;

                        openPage(page);
                    }
                );
            });

        const closeModal =
            document.getElementById("vehicleModal");

        if (closeModal) {

            closeModal.addEventListener(
                "click",
                event => {

                    if (
                        event.target === closeModal
                    ) {
                        closeVehicleModal();
                    }

                }
            );
        }

        updateMoney();
    }
);


// ------------------------------------------------------------
// RACCOURCIS CLAVIER
// ------------------------------------------------------------

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            closeVehicleModal();
        }

    }
);


// ------------------------------------------------------------
// AUTO-SAVE
// ------------------------------------------------------------

setInterval(
    () => {
        saveGame();
    },
    30000
);


// ------------------------------------------------------------
// FIN ZENTRO DEALERSHIP V6
// ------------------------------------------------------------
