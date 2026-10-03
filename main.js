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
