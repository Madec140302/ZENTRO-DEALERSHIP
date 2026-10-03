// ==========================================
// ZENTRO DEALERSHIP
// MAIN.JS — V2 STOCK & NAVIGATION
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // DONNÉES
    // ==========================================

    let money = Number(localStorage.getItem("zentro_money"));

    if (isNaN(money)) {
        money = 250000;
    }

    let inventory = JSON.parse(
        localStorage.getItem("zentro_inventory")
    );

    if (!Array.isArray(inventory)) {

        inventory = [
            {
                id: 1,
                brand: "BMW",
                model: "M4 Competition",
                year: 2025,
                km: 18420,
                price: 94900,
                type: "Sportive"
            },
            {
                id: 2,
                brand: "Audi",
                model: "RS6 Avant",
                year: 2025,
                km: 9820,
                price: 128500,
                type: "Premium"
            },
            {
                id: 3,
                brand: "Mercedes-AMG",
                model: "C63 S E Performance",
                year: 2024,
                km: 24100,
                price: 89900,
                type: "Sportive"
            }
        ];
    }

    let reputation =
        Number(localStorage.getItem("zentro_reputation"));

    if (isNaN(reputation)) {
        reputation = 4.8;
    }


    // ==========================================
    // SAUVEGARDE
    // ==========================================

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
    }


    // ==========================================
    // FORMAT MONNAIE
    // ==========================================

    function formatMoney(value) {

        return value.toLocaleString("fr-FR") + " €";

    }


    // ==========================================
    // TOAST
    // ==========================================

    function showToast(message) {

        const toast =
            document.getElementById("toast");

        if (!toast) return;

        toast.textContent = message;

        toast.classList.add("show");

        setTimeout(() => {

            toast.classList.remove("show");

        }, 2500);

    }


    // ==========================================
    // MISE À JOUR INTERFACE
    // ==========================================

    function updateUI() {

        // Trésorerie
        const moneyElement =
            document.getElementById("money");

        if (moneyElement) {

            moneyElement.textContent =
                formatMoney(money);

        }


        // Stock
        const stockCount =
            document.getElementById("stockCount");

        if (stockCount) {

            stockCount.textContent =
                inventory.length;

        }


        // Mise à jour de toutes les zones argent
        document.querySelectorAll(
            "[data-money]"
        ).forEach(element => {

            element.textContent =
                formatMoney(money);

        });


        // Mise à jour de toutes les zones stock
        document.querySelectorAll(
            "[data-stock]"
        ).forEach(element => {

            element.textContent =
                inventory.length;

        });

    }


    // ==========================================
    // NAVIGATION
    // ==========================================

    function navigateTo(page) {

        // Cacher toutes les pages
        document.querySelectorAll(
            ".page"
        ).forEach(section => {

            section.classList.remove(
                "active-page"
            );

        });


        // Afficher la page demandée
        const target =
            document.getElementById(page);

        if (target) {

            target.classList.add(
                "active-page"
            );

        }


        // Boutons actifs
        document.querySelectorAll(
            ".nav-btn"
        ).forEach(button => {

            button.classList.remove("active");

            if (
                button.dataset.page === page
            ) {

                button.classList.add("active");

            }

        });


        // Titre
        const titles = {

            dashboard: "Bonjour, concessionnaire.",

            stock: "Votre stock",

            market: "Marché automobile",

            workshop: "Atelier",

            sales: "Ventes",

            stats: "Statistiques"

        };


        const title =
            document.querySelector(
                ".topbar h1"
            );

        if (title && titles[page]) {

            title.textContent =
                titles[page];

        }


        // Rafraîchir stock
        if (page === "stock") {

            renderInventory();

        }


        updateUI();

    }


    // ==========================================
    // BOUTONS MENU
    // ==========================================

    document.querySelectorAll(
        ".nav-btn"
    ).forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const page =
                    button.dataset.page;

                if (page) {

                    navigateTo(page);

                }

            }
        );

    });


    // ==========================================
    // LIENS "VOIR TOUT"
    // ==========================================

    document.querySelectorAll(
        "[data-page-link]"
    ).forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const page =
                    button.dataset.pageLink;

                navigateTo(page);

            }
        );

    });


    // ==========================================
    // NOTIFICATION
    // ==========================================

    const notificationButton =
        document.getElementById(
            "notificationButton"
        );

    if (notificationButton) {

        notificationButton.addEventListener(
            "click",
            () => {

                showToast(
                    "🔔 Aucun nouveau message."
                );

            }
        );

    }


    // ==========================================
    // VOIR LE VÉHICULE
    // ==========================================

    const viewCar =
        document.getElementById(
            "viewCar"
        );

    if (viewCar) {

        viewCar.addEventListener(
            "click",
            () => {

                navigateTo("stock");

                showToast(
                    "🚘 Véhicule affiché dans votre stock."
                );

            }
        );

    }


    // ==========================================
    // RENDU DU STOCK
    // ==========================================

    function renderInventory() {

        const grid =
            document.querySelector(
                "#stock .inventory-grid"
            );

        if (!grid) return;


        grid.innerHTML = "";


        if (inventory.length === 0) {

            grid.innerHTML = `

                <div class="empty-stock">

                    <h3>Stock vide</h3>

                    <p>
                        Votre concession ne possède
                        actuellement aucun véhicule.
                    </p>

                    <button
                        class="primary-btn"
                        id="emptyMarketButton">

                        Aller au marché

                    </button>

                </div>

            `;


            const emptyButton =
                document.getElementById(
                    "emptyMarketButton"
                );

            if (emptyButton) {

                emptyButton.onclick = () => {

                    navigateTo("market");

                };

            }

            return;

        }


        inventory.forEach(car => {

            const card =
                document.createElement("div");

            card.className =
                "inventory-card";


            card.innerHTML = `

                <div class="inventory-image">

                    <span>
                        ${car.type.toUpperCase()}
                    </span>

                    <strong>
                        ${car.brand}
                    </strong>

                </div>


                <div class="inventory-content">

                    <small>
                        ${car.brand} • ${car.year}
                    </small>

                    <h3>
                        ${car.model}
                    </h3>

                    <p>
                        ${car.km.toLocaleString("fr-FR")}
                        km
                    </p>


                    <div class="inventory-bottom">

                        <strong>
                            ${formatMoney(car.price)}
                        </strong>

                        <button
                            class="sell-btn"
                            data-id="${car.id}">

                            Vendre

                        </button>

                    </div>

                </div>

            `;


            grid.appendChild(card);

        });


        // Boutons vendre
        grid.querySelectorAll(
            ".sell-btn"
        ).forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        Number(button.dataset.id);

                    sellCar(id);

                }
            );

        });

    }


    // ==========================================
    // VENTE
    // ==========================================

    function sellCar(id) {

        const index =
            inventory.findIndex(
                car => car.id === id
            );


        if (index === -1) return;


        const car =
            inventory[index];


        // Prix de vente légèrement variable
        const salePrice =
            Math.round(
                car.price *
                (0.95 + Math.random() * 0.10)
            );


        // Retirer du stock
        inventory.splice(
            index,
            1
        );


        // Ajouter l'argent
        money += salePrice;


        // Réputation
        reputation =
            Math.min(
                5,
                reputation + 0.02
            );


        saveGame();

        updateUI();

        renderInventory();


        showToast(
            `💰 ${car.brand} ${car.model} vendu pour ${formatMoney(salePrice)}`
        );

    }


    // ==========================================
    // ACHAT
    // ==========================================

    function buyCar(car) {

        if (money < car.price) {

            showToast(
                "❌ Vous n'avez pas assez d'argent."
            );

            return;

        }


        money -= car.price;


        inventory.push({

            id: Date.now(),

            brand: car.brand,

            model: car.model,

            year: car.year,

            km: car.km,

            price: car.price,

            type: car.type

        });


        saveGame();

        updateUI();


        showToast(
            `🚗 ${car.brand} ${car.model} ajouté au stock.`
        );

    }


    // ==========================================
    // BOUTON ACHAT DU STOCK
    // ==========================================

    const buyButton =
        document.getElementById(
            "buyCar"
        );

    if (buyButton) {

        buyButton.addEventListener(
            "click",
            () => {

                navigateTo("market");

                showToast(
                    "📈 Choisissez un véhicule sur le marché."
                );

            }
        );

    }


    // ==========================================
    // MARCHÉ — AJOUT DE VÉHICULES
    // ==========================================

    const marketCars = [

        {
            brand: "BMW",
            model: "M3 Competition",
            year: 2025,
            km: 8200,
            price: 91500,
            type: "Sportive"
        },

        {
            brand: "BMW",
            model: "M5",
            year: 2025,
            km: 6100,
            price: 124900,
            type: "Sportive"
        },

        {
            brand: "Audi",
            model: "RS5",
            year: 2025,
            km: 12400,
            price: 84900,
            type: "Sportive"
        },

        {
            brand: "Audi",
            model: "RS7",
            year: 2025,
            km: 7600,
            price: 119900,
            type: "Premium"
        },

        {
            brand: "Mercedes-AMG",
            model: "C43 AMG",
            year: 2025,
            km: 10400,
            price: 72500,
            type: "Sportive"
        },

        {
            brand: "Porsche",
            model: "911 Carrera",
            year: 2025,
            km: 5400,
            price: 139900,
            type: "Sportive"
        }

    ];


    // ==========================================
    // CRÉER LES BOUTONS DU MARCHÉ
    // ==========================================

    function renderMarket() {

        const marketPage =
            document.getElementById(
                "market"
            );

        if (!marketPage) return;


        let existing =
            marketPage.querySelector(
                ".market-cars"
            );


        if (!existing) {

            existing =
                document.createElement(
                    "div"
                );

            existing.className =
                "market-cars";


            const panel =
                marketPage.querySelector(
                    ".market-panel"
                );


            if (panel) {

                panel.after(existing);

            } else {

                marketPage.appendChild(
                    existing
                );

            }

        }


        existing.innerHTML = `

            <div class="market-section-title">

                <small>
                    VÉHICULES DISPONIBLES
                </small>

                <h3>
                    Opportunités du marché
                </h3>

            </div>

        `;


        marketCars.forEach((car, index) => {

            const card =
                document.createElement("div");

            card.className =
                "market-car";


            card.innerHTML = `

                <div>

                    <small>
                        ${car.brand} • ${car.year}
                    </small>

                    <h3>
                        ${car.model}
                    </h3>

                    <p>
                        ${car.km.toLocaleString("fr-FR")}
                        km
                    </p>

                </div>


                <strong>
                    ${formatMoney(car.price)}
                </strong>


                <button>
                    Acheter
                </button>

            `;


            card.querySelector(
                "button"
            ).addEventListener(
                "click",
                () => {

                    buyCar(car);

                }
            );


            existing.appendChild(card);

        });

    }


    // ==========================================
    // ATELIER
    // ==========================================

    document.querySelectorAll(
        "#workshop button"
    ).forEach(button => {

        button.addEventListener(
            "click",
            () => {

                showToast(
                    "🔧 Atelier bientôt disponible."
                );

            }
        );

    });


    // ==========================================
    // INITIALISATION
    // ==========================================

    renderMarket();

    updateUI();

    renderInventory();


    // Sauvegarde initiale
    saveGame();


    console.log(
        "ZENTRO DEALERSHIP V2 — système chargé."
    );

});
