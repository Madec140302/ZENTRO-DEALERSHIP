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
    },
    {
        name: "Gwenolé",
        type: "Client particulier",
        budget: 350000,
        tolerance: 0.15
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
function normalizeCarName(name) {
    return String(name || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
}

const CAR_IMAGE_ALIASES = {
    "bmwm2competition2025": "BMW M2 2025.jpeg",
    "bmwm3competition2025": "BMW M3 2025.jpeg",
    "bmwm4competition2025": "BMW M4 2025.jpeg",
    "bmwm8competition2025": "BMW M8 2025.jpeg",
    "mclaren750s": "Mclaren 720S.jpeg",
    "mercedesamge53hybrid2025": "Mercedes-AMG E63 Hybride 2025.jpeg"
};

function getCarImage(carName) {
    const name = normalizeCarName(carName);

    if (CAR_IMAGE_ALIASES[name]) {
        return "images/" + CAR_IMAGE_ALIASES[name];
    }

    const files = [
        "Aston Martin Vantage 2025.jpeg",
        "Audi R8 V10 Performance.jpeg",
        "Audi RS Q8 Performance.jpeg",
        "Audi RS e-tron GT.jpeg",
        "Audi RS3 2025.jpeg",
        "Audi RS5 2025.jpeg",
        "Audi RS6 Avant 2025.jpeg",
        "Audi RS7 Sportback 2025.jpeg",
        "BMW XM Label.jpeg",
        "BMW i7 M70.jpeg",
        "BMW M2 2025.jpeg",
        "BMW M3 2025.jpeg",
        "BMW M4 2025.jpeg",
        "BMW M5 2025.jpeg",
        "BMW M8 2025.jpeg",
        "Ferrari 12Cilindri.jpeg",
        "Ferrari 296 GTB 2025.jpeg",
        "Ferrari SF90 Stradale.jpeg",
        "Lamborghini Huracan EVO.jpeg",
        "Lamborghini Huracan Tecnica.jpeg",
        "Lamborghini Revuelto.jpeg",
        "Lamborghini Temerario.jpeg",
        "Lamborghini Urus S.jpeg",
        "Mclaren 720S.jpeg",
        "Mclaren Artura.jpeg",
        "Mercedes-AMG A45 S 2025.jpeg",
        "Mercedes-AMG C63 S E Performance 2025.jpeg",
        "Mercedes-AMG E63 Hybride 2025.jpeg",
        "Mercedes-AMG G63.jpeg",
        "Mercedes-AMG GT 63 S 2025.jpeg",
        "Porsche 718 Cayman GT4 RS.jpeg",
        "Porsche 911 Carrera 2025.jpeg",
        "Porsche 911 Carrera GTS 2025.jpeg",
        "Porsche 911 Turbo S 2025.jpeg",
        "Porsche Cayenne Turbo GT.jpeg",
        "Porsche Taycan Turbo GT.jpeg"
    ];

    const match = files.find(file =>
        normalizeCarName(file.replace(/\.jpeg$/i, "")) === name
    );

    return new URL(
    "images/" + (match || "Aston Martin Vantage 2025.jpeg"),
    document.baseURI
).href;
}
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

console.log("Voiture :", getCarName(car));
console.log("Image :", getCarImage(getCarName(car)));
       
       card.innerHTML = `

           <div class="inventory-image">

    <img
        src="${getCarImage(getCarName(car))}"
        alt="${getCarName(car)}"
        class="car-photo"
        onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
    >

    <div class="car-placeholder" style="display:none;">
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
        name: "BMW M2 Competition 2025",
        km: 7200,
        price: 79500,
        category: "Sportive"
    },

    {
        name: "BMW M3 Competition 2025",
        km: 8200,
        price: 91500,
        category: "Sportive"
    },

    {
        name: "BMW M4 Competition 2025",
        km: 6500,
        price: 94900,
        category: "Sportive"
    },

    {
        name: "BMW M5 2025",
        km: 6100,
        price: 124900,
        category: "Sportive"
    },

    {
        name: "BMW M8 Competition 2025",
        km: 9800,
        price: 145000,
        category: "Sportive"
    },

    {
        name: "Audi RS3 2025",
        km: 5400,
        price: 69900,
        category: "Sportive"
    },

    {
        name: "Audi RS5 2025",
        km: 12400,
        price: 84900,
        category: "Sportive"
    },

    {
        name: "Audi RS6 Avant 2025",
        km: 7600,
        price: 119900,
        category: "Premium"
    },

    {
        name: "Audi RS7 Sportback 2025",
        km: 6800,
        price: 129900,
        category: "Premium"
    },

    {
        name: "Audi R8 V10 Performance",
        km: 11200,
        price: 185000,
        category: "Supercar"
    },

    {
        name: "Mercedes-AMG A45 S 2025",
        km: 8300,
        price: 73500,
        category: "Sportive"
    },

    {
        name: "Mercedes-AMG C63 S E Performance 2025",
        km: 5400,
        price: 109900,
        category: "Sportive"
    },

    {
        name: "Mercedes-AMG E53 Hybrid 2025",
        km: 7200,
        price: 112000,
        category: "Premium"
    },

    {
        name: "Mercedes-AMG GT 63 S 2025",
        km: 4900,
        price: 189900,
        category: "Supercar"
    },

    {
        name: "Porsche 911 Carrera 2025",
        km: 5400,
        price: 139900,
        category: "Sportive"
    },

    {
        name: "Porsche 911 Carrera GTS 2025",
        km: 3800,
        price: 169900,
        category: "Sportive"
    },

    {
        name: "Porsche 911 Turbo S 2025",
        km: 2900,
        price: 249900,
        category: "Supercar"
    },

    {
        name: "Porsche 718 Cayman GT4 RS",
        km: 4100,
        price: 179900,
        category: "Sportive"
    },

    {
        name: "Lamborghini Huracán EVO",
        km: 8200,
        price: 239900,
        category: "Supercar"
    },

    {
        name: "Lamborghini Huracán Tecnica",
        km: 5100,
        price: 279900,
        category: "Supercar"
    },

    {
        name: "Lamborghini Temerario",
        km: 1800,
        price: 299900,
        category: "Supercar"
    },

    {
        name: "Lamborghini Revuelto",
        km: 1200,
        price: 519900,
        category: "Supercar"
    },

    {
        name: "Ferrari 296 GTB 2025",
        km: 3200,
        price: 329900,
        category: "Supercar"
    },

    {
        name: "Ferrari SF90 Stradale",
        km: 4500,
        price: 479900,
        category: "Supercar"
    },

    {
        name: "Ferrari 12Cilindri",
        km: 2100,
        price: 449900,
        category: "Supercar"
    },

    {
        name: "McLaren 750S",
        km: 3600,
        price: 319900,
        category: "Supercar"
    },

    {
        name: "McLaren Artura",
        km: 5900,
        price: 249900,
        category: "Supercar"
    },

    {
        name: "Aston Martin Vantage 2025",
        km: 4700,
        price: 199900,
        category: "Sportive"
    },

    {
        name: "Lamborghini Urus S",
        km: 6800,
        price: 259900,
        category: "SUV"
    },

    {
        name: "Porsche Cayenne Turbo GT",
        km: 7500,
        price: 189900,
        category: "SUV"
    },

    {
        name: "BMW XM Label",
        km: 6200,
        price: 169900,
        category: "SUV"
    },

    {
        name: "Audi RS Q8 Performance",
        km: 5800,
        price: 154900,
        category: "SUV"
    },

    {
        name: "Mercedes-AMG G63",
        km: 9200,
        price: 219900,
        category: "SUV"
    },

    {
        name: "Porsche Taycan Turbo GT",
        km: 2700,
        price: 209900,
        category: "Électrique"
    },

    {
        name: "Audi RS e-tron GT",
        km: 4900,
        price: 139900,
        category: "Électrique"
    },

    {
        name: "BMW i7 M70",
        km: 5300,
        price: 159900,
        category: "Électrique"
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

    <img
       src="images/BMW%20M4%202025.jpeg"
        alt="BMW M4 Competition"
        class="car-photo"
        loading="lazy"
        onerror="this.style.display='none'"
    >

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

                </div>

            </div>

        </div>

    `;


    renderWorkshopVehicles();
}


function renderWorkshopVehicles() {

    const container =
        document.getElementById(
            "workshopVehicleList"
        );

    if (!container) return;


    container.innerHTML = "";


    if (inventory.length === 0) {

        container.innerHTML = `

            <p class="empty-workshop">

                Aucun véhicule en stock.

            </p>

        `;

        return;
    }


    inventory.forEach(car => {

        const button =
            document.createElement(
                "button"
            );


        button.className =
            "workshop-car";


        button.dataset.workshopId =
            car.id;


        button.innerHTML = `

            <strong>
                ${getCarName(car)}
            </strong>

            <span>
                ${Math.round(car.condition)}% état
            </span>

        `;


        container.appendChild(
            button
        );
    });


    container
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

    if (!car) return;


    const details =
        document.getElementById(
            "workshopDetails"
        );

    if (!details) return;


    const repairCost =
        repairPrice(car);


    details.innerHTML = `

        <h2>
            ${getCarName(car)}
        </h2>


        <div class="workshop-stats">

            <p>
                Kilométrage :
                <strong>
                    ${car.km.toLocaleString("fr-FR")} km
                </strong>
            </p>

            <p>
                État :
                <strong>
                    ${Math.round(car.condition)}%
                </strong>
            </p>

            <p>
                Performance :
                <strong>
                    ${car.performance}%
                </strong>
            </p>

            <p>
                Préparation :
                <strong>
                    ${car.detailing}%
                </strong>
            </p>

            <p>
                Valeur :
                <strong>
                    ${formatMoney(car.price)}
                </strong>
            </p>

        </div>


        <div class="workshop-actions">

            <button
                id="repairButton"
                class="workshop-action">

                Réparer
                ${repairCost > 0
                    ? `(${formatMoney(repairCost)})`
                    : "(Aucune réparation)"}

            </button>


            <button
                id="performanceButton"
                class="workshop-action">

                Performance
                (7 500 €)

            </button>


            <button
                id="detailButton"
                class="workshop-action">

                Préparation esthétique
                (2 500 €)

            </button>

        </div>

    `;


    const repairButton =
        document.getElementById(
            "repairButton"
        );


    if (repairButton) {

        repairButton.addEventListener(
            "click",
            () => {

                repairVehicle(id);

            }
        );
    }


    const performanceButton =
        document.getElementById(
            "performanceButton"
        );


    if (performanceButton) {

        performanceButton.addEventListener(
            "click",
            () => {

                upgradeVehicle(id);

            }
        );
    }


    const detailButton =
        document.getElementById(
            "detailButton"
        );


    if (detailButton) {

        detailButton.addEventListener(
            "click",
            () => {

                detailVehicle(id);

            }
        );
    }
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


    car.condition =
        100;


    car.price +=
        Math.round(
            cost * 0.65
        );


    saveGame();

    updateUI();

    renderInventory();

    renderWorkshopVehicles();

    renderStats();


    selectWorkshopCar(id);


    showToast(
        `${getCarName(car)} réparé.`
    );
}


function upgradeVehicle(id) {

    const car =
        inventory.find(
            item => item.id === id
        );

    if (!car) return;


    const cost =
        7500;


    if (
        car.performance >= 25
    ) {

        showToast(
            "Performance maximale atteinte."
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


    car.performance =
        Math.min(
            25,
            car.performance + 5
        );


    car.price +=
        10000;


    saveGame();

    updateUI();

    renderInventory();

    renderWorkshopVehicles();

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


    const cost =
        2500;


    if (
        car.detailing >= 100
    ) {

        showToast(
            "Préparation esthétique maximale."
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


    car.detailing =
        Math.min(
            100,
            car.detailing + 25
        );


    car.price +=
        3000;


    saveGame();

    updateUI();

    renderInventory();

    renderWorkshopVehicles();

    renderStats();


    selectWorkshopCar(id);


    showToast(
        `${getCarName(car)} préparé.`
    );
}


/* =========================================================
   VENTES
========================================================= */

function generateClient() {

    if (inventory.length === 0) {

        showToast(
            "Vous n'avez aucun véhicule à proposer."
        );

        return;
    }


    const compatibleCars =
        inventory.filter(
            car => {

                return clientProfiles.some(
                    client =>
                        car.price <=
                        client.budget * 1.15
                );

            }
        );


    if (compatibleCars.length === 0) {

        showToast(
            "Aucun client compatible avec votre stock."
        );

        return;
    }


    const profile =
        clientProfiles[
            Math.floor(
                Math.random() *
                clientProfiles.length
            )
        ];


    const possibleCars =
        compatibleCars.filter(
            car =>
                car.price <=
                profile.budget * 1.15
        );


    if (possibleCars.length === 0) {

        showToast(
            "Aucun client intéressé."
        );

        return;
    }


    const car =
        possibleCars[
            Math.floor(
                Math.random() *
                possibleCars.length
            )
        ];


    currentClient = {

        ...profile,

        carId:
            car.id
    };


    currentOffer =
        Math.round(
            car.price *
            (
                0.88 +
                Math.random() * 0.08
            )
        );


    negotiationStep =
        0;


    renderSales();


    showToast(
        `${profile.name} est intéressé par ${getCarName(car)}.`
    );
}


function renderSales() {

    const sales =
        document.getElementById(
            "sales"
        );

    if (!sales) return;


    sales.innerHTML = `

        <div class="sales-header">

            <div>

                <h2>
                    Ventes
                </h2>

                <p>
                    Gérez vos clients et vos transactions.
                </p>

            </div>


            <button
                id="newClientButton"
                class="primary-btn">

                Trouver un client

            </button>

        </div>


        <div class="sales-summary">

            <div class="summary-card">

                <span>
                    Ventes
                </span>

                <strong>
                    ${salesHistory.length}
                </strong>

            </div>


            <div class="summary-card">

                <span>
                    Chiffre d'affaires
                </span>

                <strong>
                    ${formatMoney(
                        salesHistory.reduce(
                            (sum, sale) =>
                                sum +
                                sale.salePrice,
                            0
                        )
                    )}
                </strong>

            </div>


            <div class="summary-card">

                <span>
                    Bénéfices
                </span>

                <strong>
                    ${formatMoney(
                        salesHistory.reduce(
                            (sum, sale) =>
                                sum +
                                sale.profit,
                            0
                        )
                    )}
                </strong>

            </div>

        </div>


        <div id="salesClient">

        </div>


        <div class="sales-history">

            <h2>
                Historique des ventes
            </h2>


            <div id="salesHistoryList">

            </div>

        </div>

    `;


    const newClientButton =
        document.getElementById(
            "newClientButton"
        );


    if (newClientButton) {

        newClientButton.addEventListener(
            "click",
            generateClient
        );
    }


    renderSalesClient();

    renderSalesHistory();
}


function renderSalesClient() {

    const container =
        document.getElementById(
            "salesClient"
        );

    if (!container) return;


    if (
        !currentClient ||
        !currentOffer
    ) {

        container.innerHTML = `

            <div class="no-client">

                <h3>
                    Aucun client actuellement
                </h3>

                <p>
                    Cliquez sur "Trouver un client"
                    pour générer une opportunité de vente.
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

        currentClient = null;

        currentOffer = null;

        renderSalesClient();

        return;
    }


    const margin =
        currentOffer -
        car.price;


    container.innerHTML = `

        <div class="client-card">

            <div class="client-information">

                <span class="client-label">
                    Client
                </span>

                <h3>
                    ${currentClient.name}
                </h3>

                <p>
                    ${currentClient.type}
                </p>

                <p>
                    Budget :
                    <strong>
                        ${formatMoney(
                            currentClient.budget
                        )}
                    </strong>
                </p>

            </div>


            <div class="client-vehicle">

                <span class="client-label">
                    Véhicule recherché
                </span>

                <h3>
                    ${getCarName(car)}
                </h3>

                <p>
                    ${car.km.toLocaleString("fr-FR")}
                    km
                </p>

                <p>
                    Valeur :
                    ${formatMoney(car.price)}
                </p>

            </div>


            <div class="client-offer">

                <span class="client-label">
                    Offre actuelle
                </span>

                <strong>
                    ${formatMoney(currentOffer)}
                </strong>

                <p>
                    Marge :
                    ${formatMoney(margin)}
                </p>

            </div>


            <div class="negotiation-actions">

                <button
                    id="negotiateButton"
                    class="secondary-btn">

                    Négocier

                </button>


                <button
                    id="acceptOfferButton"
                    class="primary-btn">

                    Accepter

                </button>


                <button
                    id="rejectOfferButton"
                    class="danger-btn">

                    Refuser

                </button>

            </div>

        </div>

    `;


    const negotiateButton =
        document.getElementById(
            "negotiateButton"
        );


    if (negotiateButton) {

        negotiateButton.addEventListener(
            "click",
            negotiateOffer
        );
    }


    const acceptButton =
        document.getElementById(
            "acceptOfferButton"
        );


    if (acceptButton) {

        acceptButton.addEventListener(
            "click",
            acceptOffer
        );
    }


    const rejectButton =
        document.getElementById(
            "rejectOfferButton"
        );


    if (rejectButton) {

        rejectButton.addEventListener(
            "click",
            rejectOffer
        );
    }
}


function negotiateOffer() {

    if (
        !currentClient ||
        !currentOffer
    ) {

        return;
    }


    const car =
        inventory.find(
            item =>
                item.id ===
                currentClient.carId
        );


    if (!car) return;


    negotiationStep++;


    const increase =
        0.015 +
        Math.random() * 0.025;


    currentOffer =
        Math.round(
            currentOffer *
            (1 + increase)
        );


    const interestLoss =
        0.03 +
        Math.random() * 0.06;


    currentClient.tolerance -=
        interestLoss;


    if (
        currentClient.tolerance <= 0
    ) {

        showToast(
            `${currentClient.name} a quitté la négociation.`
        );


        currentClient = null;

        currentOffer = null;

        negotiationStep = 0;


        renderSales();

        return;
    }


    renderSalesClient();


    showToast(
        `${currentClient.name} accepte de monter à ${formatMoney(currentOffer)}.`
    );
}


function acceptOffer() {

    if (
        !currentClient ||
        !currentOffer
    ) {

        return;
    }


    const car =
        inventory.find(
            item =>
                item.id ===
                currentClient.carId
        );


    if (!car) return;


    money +=
        currentOffer;


    const profit =
        currentOffer -
        car.price;


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
            currentOffer,

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


    reputation =
        Math.min(
            5,
            reputation +
            (
                profit >= 0
                    ? 0.04
                    : 0.01
            )
        );


    saveGame();

    updateUI();

    renderInventory();

    renderWorkshopVehicles();

    renderSales();

    renderStats();


    currentClient = null;

    currentOffer = null;

    negotiationStep = 0;


    showToast(
        `${getCarName(car)} vendu pour ${formatMoney(currentOffer)}.`
    );
}


function rejectOffer() {

    currentClient = null;

    currentOffer = null;

    negotiationStep = 0;


    renderSales();


    showToast(
        "Client refusé."
    );
}


function renderSalesHistory() {

    const container =
        document.getElementById(
            "salesHistoryList"
        );

    if (!container) return;


    if (salesHistory.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <h3>
                    Aucune vente
                </h3>

                <p>
                    Votre historique apparaîtra ici.
                </p>

            </div>

        `;

        return;
    }


    container.innerHTML = `

        <div class="sales-table">

            <div class="sales-row sales-head">

                <span>
                    Date
                </span>

                <span>
                    Client
                </span>

                <span>
                    Véhicule
                </span>

                <span>
                    Prix
                </span>

                <span>
                    Bénéfice
                </span>

            </div>


            ${salesHistory
                .slice()
                .reverse()
                .map(
                    sale => `

                    <div class="sales-row">

                        <span>
                            ${sale.date}
                        </span>

                        <span>
                            ${sale.clientName}
                        </span>

                        <span>
                            ${sale.carName}
                        </span>

                        <span>
                            ${formatMoney(
                                sale.salePrice
                            )}
                        </span>

                        <span>
                            ${formatMoney(
                                sale.profit
                            )}
                        </span>

                    </div>

                `
                )
                .join("")}

        </div>

    `;
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
                sale.salePrice,
            0
        );


    const profit =
        salesHistory.reduce(
            (sum, sale) =>
                sum +
                sale.profit,
            0
        );


    const stockValue =
        inventory.reduce(
            (sum, car) =>
                sum +
                car.price,
            0
        );


    stats.innerHTML = `

        <div class="stats-header">

            <h2>
                Statistiques
            </h2>

            <p>
                Vue d'ensemble de votre concession.
            </p>

        </div>


        <div class="stats-grid">

            <div class="stat-card">

                <span>
                    Capital
                </span>

                <strong>
                    ${formatMoney(money)}
                </strong>

            </div>


            <div class="stat-card">

                <span>
                    Valeur du stock
                </span>

                <strong>
                    ${formatMoney(stockValue)}
                </strong>

            </div>


            <div class="stat-card">

                <span>
                    Véhicules en stock
                </span>

                <strong>
                    ${inventory.length}
                </strong>

            </div>


            <div class="stat-card">

                <span>
                    Nombre de ventes
                </span>

                <strong>
                    ${salesHistory.length}
                </strong>

            </div>


            <div class="stat-card">

                <span>
                    Chiffre d'affaires
                </span>

                <strong>
                    ${formatMoney(revenue)}
                </strong>

            </div>


            <div class="stat-card">

                <span>
                    Bénéfices
                </span>

                <strong>
                    ${formatMoney(profit)}
                </strong>

            </div>


            <div class="stat-card">

                <span>
                    Réputation
                </span>

                <strong>
                    ⭐ ${reputation.toFixed(1)}
                </strong>

            </div>

        </div>

    `;
}


/* =========================================================
   DASHBOARD
========================================================= */

function renderDashboard() {

    const dashboard =
        document.getElementById(
            "dashboard"
        );

    if (!dashboard) return;


    const totalProfit =
        salesHistory.reduce(
            (sum, sale) =>
                sum +
                sale.profit,
            0
        );


    dashboard.innerHTML = `

        <div class="dashboard-hero">

            <div>

                <span class="eyebrow">
                    ZENTRO DEALERSHIP
                </span>

                <h2>
                    Votre concession,
                    votre business.
                </h2>

                <p>
                    Achetez, préparez et revendez
                    des véhicules premium.
                </p>

            </div>


            <button
                id="dashboardClientButton"
                class="primary-btn">

                Trouver un client

            </button>

        </div>


        <div class="dashboard-cards">

            <div class="dashboard-card">

                <span>
                    Capital disponible
                </span>

                <strong>
                    ${formatMoney(money)}
                </strong>

            </div>


            <div class="dashboard-card">

                <span>
                    Véhicules en stock
                </span>

                <strong>
                    ${inventory.length}
                </strong>

            </div>


            <div class="dashboard-card">

                <span>
                    Bénéfices cumulés
                </span>

                <strong>
                    ${formatMoney(totalProfit)}
                </strong>

            </div>


            <div class="dashboard-card">

                <span>
                    Réputation
                </span>

                <strong>
                    ⭐ ${reputation.toFixed(1)}
                </strong>

            </div>

        </div>


        <div class="dashboard-section">

            <h2>
                Actions rapides
            </h2>


            <div class="quick-actions">

                <button
                    class="quick-action"
                    data-page-link="market">

                    <strong>
                        Acheter un véhicule
                    </strong>

                    <span>
                        Explorer le marché
                    </span>

                </button>


                <button
                    class="quick-action"
                    data-page-link="workshop">

                    <strong>
                        Ouvrir l'atelier
                    </strong>

                    <span>
                        Préparer vos véhicules
                    </span>

                </button>


                <button
                    class="quick-action"
                    data-page-link="stock">

                    <strong>
                        Voir le stock
                    </strong>

                    <span>
                        Gérer vos véhicules
                    </span>

                </button>


                <button
                    class="quick-action"
                    data-page-link="sales">

                    <strong>
                        Gérer les ventes
                    </strong>

                    <span>
                        Trouver de nouveaux clients
                    </span>

                </button>

            </div>

        </div>

    `;


    const clientButton =
        document.getElementById(
            "dashboardClientButton"
        );


    if (clientButton) {

        clientButton.addEventListener(
            "click",
            () => {

                openPage("sales");

                generateClient();

            }
        );
    }


    dashboard
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

renderDashboard();

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


/* =========================================================
   SHOWROOM 3D
   V1 — THREE.JS
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
let showroomPitch = 0.25;
let showroomDistance = 15;

let showroomDragging = false;

let showroomLastX = 0;
let showroomLastY = 0;


/* =========================================================
   CHARGEMENT THREE.JS
========================================================= */

function loadThreeJS(callback) {

    if (
        typeof THREE !==
        "undefined"
    ) {

        callback();

        return;
    }


    const script =
        document.createElement(
            "script"
        );


    script.src =
        "https://cdn.jsdelivr.net/npm/three@0.179.1/build/three.min.js";


    script.onload = () => {

        callback();

    };


    script.onerror = () => {

        showToast(
            "Impossible de charger le moteur 3D."
        );

    };


    document.head.appendChild(
        script
    );
}


/* =========================================================
   OUVERTURE SHOWROOM
========================================================= */

function openShowroom() {

    openPage(
        "showroom"
    );


    loadThreeJS(
        () => {

            initializeShowroom();

        }
    );
}


/* =========================================================
   INITIALISATION SHOWROOM
========================================================= */

function initializeShowroom() {

    const container =
        document.getElementById(
            "showroom"
        );

    if (!container) return;


    if (showroomReady) {

        return;
    }


    createShowroom(
        container
    );
}


/* =========================================================
   CRÉATION SHOWROOM
========================================================= */

function createShowroom(
    container
) {

    container.innerHTML = `

        <div
            id="showroomCanvas"
            class="showroom-canvas">

        </div>


        <div
            id="showroomInfo"
            class="showroom-info">

            <h3>
                Sélectionnez un véhicule
            </h3>

            <p>
                Cliquez sur une voiture
                pour afficher ses informations.
            </p>

        </div>


        <div
            class="showroom-help">

            <span>
                🖱️ Glisser :
                tourner
            </span>

            <span>
                🖱️ Molette :
                zoomer
            </span>

            <span>
                Cliquer :
                sélectionner
            </span>

        </div>

    `;


    const canvas =
        document.getElementById(
            "showroomCanvas"
        );


    if (!canvas) return;


    showroomScene =
        new THREE.Scene();


    showroomScene.background =
        new THREE.Color(
            0x101218
        );


    showroomCamera =
        new THREE.PerspectiveCamera(
            50,
            canvas.clientWidth /
                Math.max(
                    canvas.clientHeight,
                    1
                ),
            0.1,
            1000
        );


    showroomCamera.position.set(
        0,
        4,
        showroomDistance
    );


    showroomRenderer =
        new THREE.WebGLRenderer({
            antialias: true
        });


    showroomRenderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio || 1,
            2
        )
    );


    showroomRenderer.setSize(
        canvas.clientWidth,
        canvas.clientHeight
    );


    showroomRenderer.shadowMap.enabled =
        true;


    canvas.appendChild(
        showroomRenderer.domElement
    );


    const ambient =
        new THREE.AmbientLight(
            0xffffff,
            1.4
        );


    showroomScene.add(
        ambient
    );


    const mainLight =
        new THREE.DirectionalLight(
            0xffffff,
            2.5
        );


    mainLight.position.set(
        8,
        12,
        8
    );


    mainLight.castShadow =
        true;


    showroomScene.add(
        mainLight
    );


    const fillLight =
        new THREE.DirectionalLight(
            0x6688ff,
            1.2
        );


    fillLight.position.set(
        -8,
        5,
        -5
    );


    showroomScene.add(
        fillLight
    );


    createShowroomEnvironment();


    showroomCars = [];


    inventory.forEach(
        (car, index) => {

            const object =
                createPlaceholderCar(
                    car,
                    index
                );


            showroomCars.push(
                object
            );


            showroomScene.add(
                object
            );

        }
    );


    showroomRaycaster =
        new THREE.Raycaster();


    showroomMouse =
        new THREE.Vector2();


    setupShowroomControls(
        canvas
    );


    window.addEventListener(
        "resize",
        resizeShowroom
    );


    showroomReady =
        true;


    animateShowroom();
}


/* =========================================================
   ENVIRONNEMENT SHOWROOM
========================================================= */

function createShowroomEnvironment() {

    const floorGeometry =
        new THREE.PlaneGeometry(
            80,
            80
        );


    const floorMaterial =
        new THREE.MeshStandardMaterial({

            color:
                0x20242b,

            roughness:
                0.55,

            metalness:
                0.25

        });


    const floor =
        new THREE.Mesh(
            floorGeometry,
            floorMaterial
        );


    floor.rotation.x =
        -Math.PI / 2;


    floor.receiveShadow =
        true;


    showroomScene.add(
        floor
    );


    const wallMaterial =
        new THREE.MeshStandardMaterial({

            color:
                0x15181e,

            roughness:
                0.75,

            metalness:
                0.15

        });


    const backWall =
        new THREE.Mesh(

            new THREE.BoxGeometry(
                80,
                15,
                0.5
            ),

            wallMaterial

        );


    backWall.position.set(
        0,
        7.5,
        -30
    );


    backWall.receiveShadow =
        true;


    showroomScene.add(
        backWall
    );


    const leftWall =
        new THREE.Mesh(

            new THREE.BoxGeometry(
                0.5,
                15,
                60
            ),

            wallMaterial

        );


    leftWall.position.set(
        -40,
        7.5,
        0
    );


    showroomScene.add(
        leftWall
    );


    const rightWall =
        new THREE.Mesh(

            new THREE.BoxGeometry(
                0.5,
                15,
                60
            ),

            wallMaterial

        );


    rightWall.position.set(
        40,
        7.5,
        0
    );


    showroomScene.add(
        rightWall
    );


    const platform =
        new THREE.Mesh(

            new THREE.CylinderGeometry(
                18,
                18,
                0.35,
                64
            ),

            new THREE.MeshStandardMaterial({

                color:
                    0x30343b,

                roughness:
                    0.35,

                metalness:
                    0.5

            })

        );


    platform.position.y =
        0.18;


    platform.receiveShadow =
        true;


    showroomScene.add(
        platform
    );


    const ring =
        new THREE.Mesh(

            new THREE.TorusGeometry(
                18,
                0.08,
                12,
                128
            ),

            new THREE.MeshBasicMaterial({

                color:
                    0x5f7cff

            })

        );


    ring.rotation.x =
        Math.PI / 2;


    ring.position.y =
        0.4;


    showroomScene.add(
        ring
    );
}


/* =========================================================
   VOITURES SHOWROOM
========================================================= */

function createPlaceholderCar(
    car,
    index
) {

    const group =
        new THREE.Group();


    const bodyColor =
        getCarColor(
            car
        );


    const bodyMaterial =
        new THREE.MeshStandardMaterial({

            color:
                bodyColor,

            metalness:
                0.75,

            roughness:
                0.22

        });


    const body =
        new THREE.Mesh(

            new THREE.BoxGeometry(
                4.4,
                1.05,
                2
            ),

            bodyMaterial

        );


    body.position.y =
        1.05;


    body.castShadow =
        true;


    group.add(
        body
    );


    const cabinMaterial =
        new THREE.MeshStandardMaterial({

            color:
                0x11151c,

            metalness:
                0.2,

            roughness:
                0.15,

            transparent:
                true,

            opacity:
                0.88

        });


    const cabin =
        new THREE.Mesh(

            new THREE.BoxGeometry(
                2.35,
                0.85,
                1.7
            ),

            cabinMaterial

        );


    cabin.position.set(
        -0.15,
        1.72,
        0
    );


    cabin.rotation.z =
        0;


    cabin.castShadow =
        true;


    group.add(
        cabin
    );


    const wheelMaterial =
        new THREE.MeshStandardMaterial({

            color:
                0x090a0c,

            metalness:
                0.85,

            roughness:
                0.22

        });


    const wheelPositions = [

        [-1.45, 0.55, 1.02],

        [1.45, 0.55, 1.02],

        [-1.45, 0.55, -1.02],

        [1.45, 0.55, -1.02]

    ];


    wheelPositions.forEach(
        position => {

            const wheel =
                new THREE.Mesh(

                    new THREE.CylinderGeometry(
                        0.48,
                        0.48,
                        0.35,
                        32
                    ),

                    wheelMaterial

                );


            wheel.rotation.z =
                Math.PI / 2;


            wheel.position.set(
                position[0],
                position[1],
                position[2]
            );


            wheel.castShadow =
                true;


            group.add(
                wheel
            );

        }
    );


    const headlightMaterial =
        new THREE.MeshBasicMaterial({

            color:
                0xffffff

        });


    const headlights = [

        [-2.22, 1.12, 0.65],

        [-2.22, 1.12, -0.65]

    ];


    headlights.forEach(
        position => {

            const light =
                new THREE.Mesh(

                    new THREE.BoxGeometry(
                        0.12,
                        0.18,
                        0.42
                    ),

                    headlightMaterial

                );


            light.position.set(
                position[0],
                position[1],
                position[2]
            );


            group.add(
                light
            );

        }
    );


    group.position.set(
        (index % 3 - 1) * 8,
        0,
        Math.floor(index / 3) * -7
    );


    group.userData =
        {

            car:
                car

        };


    return group;
}


function getCarColor(
    car
) {

    const name =
        getCarName(car)
            .toLowerCase();


    if (
        name.includes("bmw")
    ) {

        return 0x15171a;
    }


    if (
        name.includes("audi")
    ) {

        return 0x73777d;
    }


    if (
        name.includes("mercedes")
    ) {

        return 0x111317;
    }


    if (
        name.includes("porsche")
    ) {

        return 0xb40000;
    }


    return 0x2f5f9e;
}


/* =========================================================
   CONTRÔLES SHOWROOM
========================================================= */

function setupShowroomControls(
    canvas
) {

    canvas.addEventListener(
        "pointerdown",
        event => {

            showroomDragging =
                true;


            showroomLastX =
                event.clientX;


            showroomLastY =
                event.clientY;


            canvas.setPointerCapture(
                event.pointerId
            );
        }
    );


    canvas.addEventListener(
        "pointermove",
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
                deltaX *
                0.008;


            showroomPitch -=
                deltaY *
                0.005;


            showroomPitch =
                Math.max(
                    -0.2,
                    Math.min(
                        1.1,
                        showroomPitch
                    )
                );
        }
    );


    canvas.addEventListener(
        "pointerup",
        event => {

            showroomDragging =
                false;


            canvas.releasePointerCapture(
                event.pointerId
            );
        }
    );


    canvas.addEventListener(
        "pointercancel",
        () => {

            showroomDragging =
                false;

        }
    );


    canvas.addEventListener(
        "wheel",
        event => {

            event.preventDefault();


            showroomDistance +=
                event.deltaY *
                0.015;


            showroomDistance =
                Math.max(
                    7,
                    Math.min(
                        30,
                        showroomDistance
                    )
                );
        },
        {
            passive: false
        }
    );


    canvas.addEventListener(
        "click",
        event => {

            if (
                showroomDragging
            ) {

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
                ) *
                2 -
                1;


            showroomMouse.y =
                -(
                    (
                        event.clientY -
                        rect.top
                    ) /
                    rect.height
                ) *
                2 +
                1;


            showroomRaycaster.setFromCamera(
                showroomMouse,
                showroomCamera
            );


            const meshes = [];


            showroomCars.forEach(
                carObject => {

                    carObject.traverse(
                        child => {

                            if (
                                child.isMesh
                            ) {

                                meshes.push(
                                    child
                                );

                            }

                        }
                    );

                }
            );


            const intersections =
                showroomRaycaster.intersectObjects(
                    meshes,
                    false
                );


            if (
                intersections.length ===
                0
            ) {

                return;
            }


            let selected =
                intersections[0]
                    .object;


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
}


/* =========================================================
   INFO VÉHICULE
========================================================= */

function showShowroomInfo(
    car
) {

    const info =
        document.getElementById(
            "showroomInfo"
        );


    if (!info) return;


    info.innerHTML = `

        <div class="showroom-selected">

            <span>
                VÉHICULE
            </span>

            <h3>
                ${getCarName(car)}
            </h3>

            <p>
                ${formatMoney(car.price)}
            </p>

            <p>
                ${car.km.toLocaleString("fr-FR")}
                km
            </p>

            <p>
                État :
                ${Math.round(car.condition)}%
            </p>

            <p>
                Performance :
                +${car.performance}%
            </p>

            <p>
                Préparation :
                ${car.detailing}%
            </p>

        </div>

    `;
}


/* =========================================================
   ANIMATION SHOWROOM
========================================================= */

function animateShowroom() {

    if (
        !showroomReady
    ) {

        return;
    }


    showroomAnimation =
        requestAnimationFrame(
            animateShowroom
        );


    const target =
        new THREE.Vector3(
            0,
            1,
            0
        );


    const horizontalDistance =
        showroomDistance *
        Math.cos(
            showroomPitch
        );


    showroomCamera.position.x =
        Math.sin(
            showroomYaw
        ) *
        horizontalDistance;


    showroomCamera.position.z =
        Math.cos(
            showroomYaw
        ) *
        horizontalDistance;


    showroomCamera.position.y =
        1 +
        Math.sin(
            showroomPitch
        ) *
        showroomDistance;


    showroomCamera.lookAt(
        target
    );


    showroomCars.forEach(
        (car, index) => {

            car.rotation.y =
                Math.sin(
                    Date.now() *
                    0.0003
                ) *
                0.015;

        }
    );


    showroomRenderer.render(
        showroomScene,
        showroomCamera
    );
}


/* =========================================================
   RESIZE SHOWROOM
========================================================= */

function resizeShowroom() {

    if (
        !showroomRenderer ||
        !showroomCamera
    ) {

        return;
    }


    const canvas =
        document.getElementById(
            "showroomCanvas"
        );


    if (!canvas) return;


    const width =
        Math.max(
            canvas.clientWidth,
            1
        );


    const height =
        Math.max(
            canvas.clientHeight,
            1
        );


    showroomCamera.aspect =
        width /
        height;


    showroomCamera.updateProjectionMatrix();


    showroomRenderer.setSize(
        width,
        height
    );
}


/* =========================================================
   NAVIGATION SHOWROOM
========================================================= */

document
    .querySelectorAll(
        '.nav-btn[data-page="showroom"]'
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    setTimeout(
                        openShowroom,
                        50
                    );

                }
            );

        }
    );
