// ==========================================
// ZENTRO DEALERSHIP — STOCK SYSTEM V2
// ==========================================

let money = Number(localStorage.getItem("zentro_money")) || 684500;
let reputation = Number(localStorage.getItem("zentro_reputation")) || 4.8;

let inventory = JSON.parse(
    localStorage.getItem("zentro_inventory")
) || [
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
        type: "Break"
    },
    {
        id: 3,
        brand: "Mercedes-AMG",
        model: "C63",
        year: 2024,
        km: 24100,
        price: 89900,
        type: "Sportive"
    }
];

// ==========================================
// SAUVEGARDE
// ==========================================

function saveGame() {
    localStorage.setItem("zentro_money", money);
    localStorage.setItem("zentro_reputation", reputation);
    localStorage.setItem("zentro_inventory", JSON.stringify(inventory));
}

// ==========================================
// NOTIFICATIONS
// ==========================================

function showToast(message) {
    const toast = document.getElementById("toast");

    if (!toast) {
        alert(message);
        return;
    }

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

// ==========================================
// NAVIGATION
// ==========================================

function navigateTo(page) {

    document.querySelectorAll(".page").forEach(section => {
        section.classList.remove("active");
    });

    const target = document.getElementById(page);

    if (target) {
        target.classList.add("active");
    }

    document.querySelectorAll(".nav-button").forEach(button => {
        button.classList.remove("active");

        if (button.dataset.page === page) {
            button.classList.add("active");
        }
    });

    if (page === "stock") {
        renderStock();
    }

    updateDashboard();
}

// ==========================================
// DASHBOARD
// ==========================================

function updateDashboard() {

    document.querySelectorAll("[data-money]").forEach(element => {
        element.textContent =
            money.toLocaleString("fr-FR") + " €";
    });

    document.querySelectorAll("[data-stock]").forEach(element => {
        element.textContent = inventory.length;
    });

    document.querySelectorAll("[data-reputation]").forEach(element => {
        element.textContent = reputation.toFixed(1) + "/5";
    });
}

// ==========================================
// STOCK
// ==========================================

function renderStock() {

    const container =
        document.getElementById("stockVehicles");

    if (!container) return;

    container.innerHTML = "";

    if (inventory.length === 0) {

        container.innerHTML = `
            <div class="empty-stock">
                <h2>Stock vide</h2>
                <p>Votre concession ne possède actuellement aucun véhicule.</p>
            </div>
        `;

        return;
    }

    inventory.forEach(car => {

        const card = document.createElement("div");

        card.className = "inventory-card";

        card.innerHTML = `
            <div class="inventory-car-image">
                <span>${car.brand}</span>
            </div>

            <div class="inventory-car-info">

                <div>
                    <small>${car.year} • ${car.type}</small>
                    <h3>${car.brand} ${car.model}</h3>
                    <p>${car.km.toLocaleString("fr-FR")} km</p>
                </div>

                <div class="inventory-price">
                    ${car.price.toLocaleString("fr-FR")} €
                </div>

                <div class="inventory-actions">

                    <button onclick="sellCar(${car.id})">
                        Vendre
                    </button>

                    <button onclick="showCarDetails(${car.id})">
                        Détails
                    </button>

                </div>

            </div>
        `;

        container.appendChild(card);
    });
}

// ==========================================
// DÉTAILS
// ==========================================

function showCarDetails(id) {

    const car = inventory.find(vehicle => vehicle.id === id);

    if (!car) return;

    showToast(
        `${car.brand} ${car.model} • ${car.year} • ${car.km.toLocaleString("fr-FR")} km`
    );
}

// ==========================================
// VENDRE
// ==========================================

function sellCar(id) {

    const index = inventory.findIndex(
        vehicle => vehicle.id === id
    );

    if (index === -1) return;

    const car = inventory[index];

    const sellingPrice =
        Math.round(car.price * (0.92 + Math.random() * 0.12));

    inventory.splice(index, 1);

    money += sellingPrice;

    reputation = Math.min(5, reputation + 0.02);

    saveGame();
    renderStock();
    updateDashboard();

    showToast(
        `${car.brand} ${car.model} vendu pour ${sellingPrice.toLocaleString("fr-FR")} €`
    );
}

// ==========================================
// ACHETER UN VÉHICULE
// ==========================================

function buyCar(brand, model, year, km, price, type) {

    if (money < price) {

        showToast("Fonds insuffisants.");

        return;
    }

    const newCar = {

        id: Date.now(),

        brand,
        model,
        year,
        km,
        price,
        type
    };

    money -= price;

    inventory.push(newCar);

    saveGame();

    renderStock();
    updateDashboard();

    showToast(
        `${brand} ${model} ajouté au stock.`
    );
}

// ==========================================
// VÉHICULES DU MARCHÉ
// ==========================================

function buyMarketCar(car) {

    buyCar(
        car.brand,
        car.model,
        car.year,
        car.km,
        car.price,
        car.type
    );
}

// ==========================================
// RECHERCHE
// ==========================================

function searchStock() {

    const input =
        document.getElementById("stockSearch");

    if (!input) return;

    const search =
        input.value.toLowerCase().trim();

    document.querySelectorAll(".inventory-card").forEach(card => {

        const text =
            card.textContent.toLowerCase();

        card.style.display =
            text.includes(search) ? "" : "none";
    });
}

// ==========================================
// INITIALISATION
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    // Navigation
    document.querySelectorAll(".nav-button").forEach(button => {

        button.addEventListener("click", () => {

            const page = button.dataset.page;

            if (page) {
                navigateTo(page);
            }

        });

    });

    // Recherche
    const search =
        document.getElementById("stockSearch");

    if (search) {
        search.addEventListener("input", searchStock);
    }

    // Initialisation
    saveGame();
    updateDashboard();
    renderStock();

    console.log("ZENTRO DEALERSHIP V2 chargé.");
});
