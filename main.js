// ==========================================
// ZENTRO DEALERSHIP
// MAIN.JS — V3 STOCK + MARCHÉ + ATELIER
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // DONNÉES DU JEU
    // ==========================================

    let money = Number(
        localStorage.getItem("zentro_money")
    );

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
                type: "Sportive",
                condition: 100,
                performance: 0,
                detailing: 0
            },

            {
                id: 2,
                brand: "Audi",
                model: "RS6 Avant",
                year: 2025,
                km: 9820,
                price: 128500,
                type: "Premium",
                condition: 100,
                performance: 0,
                detailing: 0
            },

            {
                id: 3,
                brand: "Mercedes-AMG",
                model: "C63 S E Performance",
                year: 2024,
                km: 24100,
                price: 89900,
                type: "Sportive",
                condition: 100,
                performance: 0,
                detailing: 0
            }

        ];

    }


    let reputation =
        Number(
            localStorage.getItem(
                "zentro_reputation"
            )
        );


    if (isNaN(reputation)) {
        reputation = 4.8;
    }


    // ==========================================
    // PRÉPARER LES DONNÉES
    // ==========================================

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

        saveGame();

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
            JSON.stringify(
                inventory
            )
        );


        localStorage.setItem(
            "zentro_reputation",
            reputation
        );

    }


    // ==========================================
    // FORMAT ARGENT
    // ==========================================

    function formatMoney(value) {

        return (
            value.toLocaleString(
                "fr-FR"
            ) + " €"
        );

    }


    // ==========================================
    // NOTIFICATION
    // ==========================================

    function showToast(message) {

        const toast =
            document.getElementById(
                "toast"
            );


        if (!toast) {

            alert(message);

            return;

        }


        toast.textContent =
            message;


        toast.classList.add(
            "show"
        );


        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 2500);

    }


    // ==========================================
    // MISE À JOUR DE L'INTERFACE
    // ==========================================

    function updateUI() {

        // Trésorerie principale

        const moneyElement =
            document.getElementById(
                "money"
            );


        if (moneyElement) {

            moneyElement.textContent =
                formatMoney(
                    money
                );

        }


        // Nombre de véhicules

        const stockCount =
            document.getElementById(
                "stockCount"
            );


        if (stockCount) {

            stockCount.textContent =
                inventory.length;

        }


        // Autres éléments éventuels

        document.querySelectorAll(
            "[data-money]"
        ).forEach(element => {

            element.textContent =
                formatMoney(
                    money
                );

        });


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


        // Afficher la page

        const target =
            document.getElementById(
                page
            );


        if (target) {

            target.classList.add(
                "active-page"
            );

        }


        // Bouton actif

        document.querySelectorAll(
            ".nav-btn"
        ).forEach(button => {

            button.classList.remove(
                "active"
            );


            if (
                button.dataset.page ===
                page
            ) {

                button.classList.add(
                    "active"
                );

            }

        });


        // Titre

        const titles = {

            dashboard:
                "Bonjour, concessionnaire.",

            stock:
                "Votre stock",

            market:
                "Marché automobile",

            workshop:
                "Atelier",

            sales:
                "Ventes",

            stats:
                "Statistiques"

        };


        const title =
            document.querySelector(
                ".topbar h1"
            );


        if (
            title &&
            titles[page]
        ) {

            title.textContent =
                titles[page];

        }


        // Stock

        if (
            page === "stock"
        ) {

            renderInventory();

        }


        // Atelier

        if (
            page === "workshop"
        ) {

            renderWorkshop();

        }


        updateUI();

    }


    // ==========================================
    // BOUTONS DE NAVIGATION
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

                    navigateTo(
                        page
                    );

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


                if (page) {

                    navigateTo(
                        page
                    );

                }

            }
        );

    });


    // ==========================================
    // NOTIFICATIONS
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
                    "🔔 Aucune nouvelle notification."
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

                navigateTo(
                    "stock"
                );


                showToast(
                    "🚘 Véhicule affiché dans votre stock."
                );

            }
        );

    }


    // ==========================================
    // AFFICHAGE DU STOCK
    // ==========================================

    function renderInventory() {

        const grid =
            document.querySelector(
                "#stock .inventory-grid"
            );


        if (!grid) return;


        grid.innerHTML = "";


        // Stock vide

        if (
            inventory.length === 0
        ) {

            grid.innerHTML = `

                <div class="empty-stock">

                    <h3>
                        Stock vide
                    </h3>

                    <p>
                        Votre concession
                        ne possède actuellement
                        aucun véhicule.
                    </p>

                    <button
                        class="primary-btn"
                        id="emptyMarketButton">

                        Aller au marché

                    </button>

                </div>

            `;


            const button =
                document.getElementById(
                    "emptyMarketButton"
                );


            if (button) {

                button.addEventListener(
                    "click",
                    () => {

                        navigateTo(
                            "market"
                        );

                    }
                );

            }


            return;

        }


        // Créer les cartes

        inventory.forEach(car => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "inventory-card";


            card.innerHTML = `

                <div
                    class="inventory-image">

                    <span>
                        ${car.type.toUpperCase()}
                    </span>

                    <strong>
                        ${car.brand}
                    </strong>

                </div>


                <div
                    class="inventory-content">

                    <small>
                        ${car.brand}
                        •
                        ${car.year}
                    </small>

                    <h3>
                        ${car.model}
                    </h3>

                    <p>
                        ${car.km.toLocaleString(
                            "fr-FR"
                        )} km
                    </p>

                    <div
                        class="inventory-bottom">

                        <strong>
                            ${formatMoney(
                                car.price
                            )}
                        </strong>

                        <button
                            class="sell-btn"
                            data-id="${car.id}">

                            Vendre

                        </button>

                    </div>

                </div>

            `;


            grid.appendChild(
                card
            );

        });


        // Boutons vendre

        grid.querySelectorAll(
            ".sell-btn"
        ).forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        Number(
                            button.dataset.id
                        );


                    sellCar(id);

                }
            );

        });

    }


    // ==========================================
    // VENDRE UN VÉHICULE
    // ==========================================

    function sellCar(id) {

        const index =
            inventory.findIndex(
                car =>
                    car.id === id
            );


        if (index === -1) {
            return;
        }


        const car =
            inventory[index];


        // Prix de vente variable

        const salePrice =
            Math.round(
                car.price *
                (
                    0.95 +
                    Math.random() *
                    0.10
                )
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
    // ACHETER UN VÉHICULE
    // ==========================================

    function buyCar(car) {

        if (
            money < car.price
        ) {

            showToast(
                "❌ Vous n'avez pas assez d'argent."
            );

            return;

        }


        money -= car.price;


        inventory.push({

            id:
                Date.now(),

            brand:
                car.brand,

            model:
                car.model,

            year:
                car.year,

            km:
                car.km,

            price:
                car.price,

            type:
                car.type,

            condition:
                100,

            performance:
                0,

            detailing:
                0

        });


        saveGame();

        updateUI();


        showToast(
            `🚗 ${car.brand} ${car.model} ajouté au stock.`
        );

    }


    // ==========================================
    // BOUTON ACHETER
    // ==========================================

    const buyButton =
        document.getElementById(
            "buyCar"
        );


    if (buyButton) {

        buyButton.addEventListener(
            "click",
            () => {

                navigateTo(
                    "market"
                );


                showToast(
                    "📈 Choisissez un véhicule sur le marché."
                );

            }
        );

    }


    // ==========================================
    // VÉHICULES DU MARCHÉ
    // ==========================================

    const marketCars = [

        {
            brand:
                "BMW",

            model:
                "M3 Competition",

            year:
                2025,

            km:
                8200,

            price:
                91500,

            type:
                "Sportive"
        },


        {
            brand:
                "BMW",

            model:
                "M5",

            year:
                2025,

            km:
                6100,

            price:
                124900,

            type:
                "Sportive"
        },


        {
            brand:
                "Audi",

            model:
                "RS5",

            year:
                2025,

            km:
                12400,

            price:
                84900,

            type:
                "Sportive"
        },


        {
            brand:
                "Audi",

            model:
                "RS7",

            year:
                2025,

            km:
                7600,

            price:
                119900,

            type:
                "Premium"
        },


        {
            brand:
                "Mercedes-AMG",

            model:
                "C43 AMG",

            year:
                2025,

            km:
                10400,

            price:
                72500,

            type:
                "Sportive"
        },


        {
            brand:
                "Porsche",

            model:
                "911 Carrera",

            year:
                2025,

            km:
                5400,

            price:
                139900,

            type:
                "Sportive"
        }

    ];


    // ==========================================
    // AFFICHER LE MARCHÉ
    // ==========================================

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
                document.createElement(
                    "div"
                );


            container.className =
                "market-cars";


            const panel =
                marketPage.querySelector(
                    ".market-panel"
                );


            if (panel) {

                panel.after(
                    container
                );

            } else {

                marketPage.appendChild(
                    container
                );

            }

        }


        container.innerHTML = `

            <div
                class="market-section-title">

                <small>
                    VÉHICULES DISPONIBLES
                </small>

                <h3>
                    Opportunités du marché
                </h3>

            </div>

        `;


        marketCars.forEach(
            car => {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "market-car";


                card.innerHTML = `

                    <div>

                        <small>
                            ${car.brand}
                            •
                            ${car.year}
                        </small>

                        <h3>
                            ${car.model}
                        </h3>

                        <p>
                            ${car.km.toLocaleString(
                                "fr-FR"
                            )} km
                        </p>

                    </div>


                    <strong>
                        ${formatMoney(
                            car.price
                        )}
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

                        buyCar(
                            car
                        );

                    }
                );


                container.appendChild(
                    card
                );

            }
        );

    }


    // ==========================================
    // ATELIER V3
    // ==========================================

    function renderWorkshop() {

        const workshop =
            document.getElementById(
                "workshop"
            );


        if (!workshop) return;


        prepareWorkshopData();


        workshop.innerHTML = `

            <div class="page-title">

                <div>

                    <p class="eyebrow">
                        CENTRE TECHNIQUE
                    </p>

                    <h2>
                        Atelier
                    </h2>

                    <p>
                        Entretenez et améliorez
                        les véhicules de votre
                        concession.
                    </p>

                </div>

            </div>


            <div
                class="workshop-layout">

                <div
                    class="workshop-vehicles">

                    <div
                        class="workshop-section-title">

                        <small>
                            VOS VÉHICULES
                        </small>

                        <h3>
                            Sélectionnez
                            un véhicule
                        </h3>

                    </div>

                    <div
                        id="workshopVehicleList">
                    </div>

                </div>


                <div
                    class="workshop-management">

                    <div
                        id="workshopDetails">

                        <div
                            class="workshop-empty">

                            <span>
                                🔧
                            </span>

                            <h3>
                                Aucun véhicule
                                sélectionné
                            </h3>

                            <p>
                                Sélectionnez
                                un véhicule
                                pour commencer.
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        `;


        renderWorkshopVehicles();

    }


    // ==========================================
    // LISTE VÉHICULES ATELIER
    // ==========================================

    function renderWorkshopVehicles() {

        const list =
            document.getElementById(
                "workshopVehicleList"
            );


        if (!list) return;


        // Aucun véhicule

        if (
            inventory.length === 0
        ) {

            list.innerHTML = `

                <div
                    class="workshop-empty">

                    <span>
                        🚗
                    </span>

                    <h3>
                        Votre stock est vide
                    </h3>

                    <p>
                        Achetez d'abord
                        un véhicule
                        sur le marché.
                    </p>

                </div>

            `;

            return;

        }


        list.innerHTML = "";


        inventory.forEach(
            car => {

                const item =
                    document.createElement(
                        "button"
                    );


                item.className =
                    "workshop-car";


                item.innerHTML = `

                    <div
                        class="workshop-car-icon">

                        🚘

                    </div>


                    <div>

                        <strong>
                            ${car.brand}
                            ${car.model}
                        </strong>

                        <small>
                            ${car.year}
                            •
                            ${car.km.toLocaleString(
                                "fr-FR"
                            )} km
                        </small>

                    </div>


                    <span>
                        ${car.condition}%
                    </span>

                `;


                item.addEventListener(
                    "click",
                    () => {

                        selectWorkshopCar(
                            car.id
                        );

                    }
                );


                list.appendChild(
                    item
                );

            }
        );

    }


    // ==========================================
    // SÉLECTIONNER UNE VOITURE
    // ==========================================

    function selectWorkshopCar(id) {

        const car =
            inventory.find(
                vehicle =>
                    vehicle.id === id
            );


        if (!car) return;


        const details =
            document.getElementById(
                "workshopDetails"
            );


        if (!details) return;


        details.innerHTML = `

            <div
                class="workshop-selected">


                <div
                    class="workshop-car-title">

                    <div>

                        <small>
                            ${car.brand}
                            •
                            ${car.year}
                        </small>

                        <h2>
                            ${car.model}
                        </h2>

                    </div>


                    <strong>
                        ${formatMoney(
                            car.price
                        )}
                    </strong>

                </div>


                <div
                    class="condition-box">

                    <div
                        class="condition-header">

                        <span>
                            État du véhicule
                        </span>

                        <strong>
                            ${car.condition}%
                        </strong>

                    </div>


                    <div
                        class="condition-bar">

                        <div
                            style="
                                width:${car.condition}%;
                            ">
                        </div>

                    </div>

                </div>


                <div
                    class="workshop-stats">

                    <div>

                        <small>
                            PERFORMANCE
                        </small>

                        <strong>
                            +${car.performance}%
                        </strong>

                    </div>


                    <div>

                        <small>
                            DETAILING
                        </small>

                        <strong>
                            ${car.detailing}%
                        </strong>

                    </div>


                    <div>

                        <small>
                            KILOMÉTRAGE
                        </small>

                        <strong>
                            ${car.km.toLocaleString(
                                "fr-FR"
                            )} km
                        </strong>

                    </div>

                </div>


                <div
                    class="workshop-actions">


                    <button
                        class="workshop-action"
                        id="repairVehicle">

                        <span>
                            🔧
                        </span>

                        <div>

                            <strong>
                                Réparation complète
                            </strong>

                            <small>
                                Remettre le véhicule
                                à 100%
                            </small>

                        </div>

                        <b>
                            ${repairPrice(
                                car
                            ).toLocaleString(
                                "fr-FR"
                            )} €
                        </b>

                    </button>


                    <button
                        class="workshop-action"
                        id="upgradeVehicle">

                        <span>
                            ⚡
                        </span>

                        <div>

                            <strong>
                                Préparation
                                performance
                            </strong>

                            <small>
                                +5% de performance
                            </small>

                        </div>

                        <b>
                            7 500 €
                        </b>

                    </button>


                    <button
                        class="workshop-action"
                        id="detailVehicle">

                        <span>
                            ✨
                        </span>

                        <div>

                            <strong>
                                Detailing premium
                            </strong>

                            <small>
                                Améliore l'apparence
                                et la valeur
                            </small>

                        </div>

                        <b>
                            2 500 €
                        </b>

                    </button>


                </div>

            </div>

        `;


        // Réparation

        const repairButton =
            document.getElementById(
                "repairVehicle"
            );


        if (repairButton) {

            repairButton.addEventListener(
                "click",
                () => {

                    repairVehicle(
                        car.id
                    );

                }
            );

        }


        // Performance

        const upgradeButton =
            document.getElementById(
                "upgradeVehicle"
            );


        if (upgradeButton) {

            upgradeButton.addEventListener(
                "click",
                () => {

                    upgradeVehicle(
                        car.id
                    );

                }
            );

        }


        // Detailing

        const detailButton =
            document.getElementById(
                "detailVehicle"
            );


        if (detailButton) {

            detailButton.addEventListener(
                "click",
                () => {

                    detailVehicle(
                        car.id
                    );

                }
            );

        }

    }


    // ==========================================
    // PRIX RÉPARATION
    // ==========================================

    function repairPrice(car) {

        if (
            car.condition >= 100
        ) {

            return 0;

        }


        return Math.max(

            500,

            Math.round(
                (
                    100 -
                    car.condition
                ) * 180
            )

        );

    }


    // ==========================================
    // RÉPARATION
    // ==========================================

    function repairVehicle(id) {

        const car =
            inventory.find(
                vehicle =>
                    vehicle.id === id
            );


        if (!car) return;


        if (
            car.condition >= 100
        ) {

            showToast(
                "✅ Ce véhicule est déjà en parfait état."
            );

            return;

        }


        const cost =
            repairPrice(
                car
            );


        if (
            money < cost
        ) {

            showToast(
                "❌ Trésorerie insuffisante."
            );

            return;

        }


        money -= cost;


        car.condition =
            100;


        // La réparation augmente
        // légèrement la valeur

        car.price +=
            Math.round(
                cost * 0.65
            );


        saveGame();

        updateUI();

        renderInventory();

        selectWorkshopCar(
            id
        );


        showToast(
            `🔧 ${car.brand} ${car.model} réparé pour ${formatMoney(cost)}`
        );

    }


    // ==========================================
    // AMÉLIORATION PERFORMANCE
    // ==========================================

    function upgradeVehicle(id) {

        const car =
            inventory.find(
                vehicle =>
                    vehicle.id === id
            );


        if (!car) return;


        const cost =
            7500;


        if (
            money < cost
        ) {

            showToast(
                "❌ Trésorerie insuffisante."
            );

            return;

        }


        if (
            car.performance >= 25
        ) {

            showToast(
                "⚡ Niveau maximum de préparation atteint."
            );

            return;

        }


        money -= cost;


        car.performance += 5;


        // Augmentation de valeur

        car.price +=
            10000;


        saveGame();

        updateUI();

        renderInventory();

        selectWorkshopCar(
            id
        );


        showToast(
            `⚡ ${car.brand} ${car.model} amélioré !`
        );

    }


    // ==========================================
    // DETAILING
    // ==========================================

    function detailVehicle(id) {

        const car =
            inventory.find(
                vehicle =>
                    vehicle.id === id
            );


        if (!car) return;


        const cost =
            2500;


        if (
            money < cost
        ) {

            showToast(
                "❌ Trésorerie insuffisante."
            );

            return;

        }


        if (
            car.detailing >= 100
        ) {

            showToast(
                "✨ Le véhicule possède déjà un detailing premium."
            );

            return;

        }


        money -= cost;


        car.detailing =
            Math.min(
                100,
                car.detailing + 25
            );


        // Augmentation de valeur

        car.price +=
            3000;


        saveGame();

        updateUI();

        renderInventory();

        selectWorkshopCar(
            id
        );


        showToast(
            `✨ ${car.brand} ${car.model} préparé avec succès.`
        );

    }


    // ==========================================
    // BOUTONS ATELIER EXISTANTS
    // ==========================================
    // On ne garde pas les anciens boutons
    // "Ouvrir" puisqu'on reconstruit maintenant
    // entièrement la page Atelier.


    // ==========================================
    // INITIALISATION
    // ==========================================

    prepareWorkshopData();

    renderMarket();

    renderWorkshop();

    updateUI();

    renderInventory();

    saveGame();


    console.log(
        "ZENTRO DEALERSHIP V3 — système chargé."
    );

});
