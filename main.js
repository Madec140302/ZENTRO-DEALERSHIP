let money = 250000;

const pages = document.querySelectorAll(".page");
const navButtons = document.querySelectorAll(".nav-btn");
const toast = document.getElementById("toast");

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

function navigate(pageName) {

    pages.forEach(page => {
        page.classList.remove("active-page");
    });

    const target = document.getElementById(pageName);

    if (target) {
        target.classList.add("active-page");
    }

    navButtons.forEach(button => {
        button.classList.remove("active");

        if (button.dataset.page === pageName) {
            button.classList.add("active");
        }
    });
}


/* NAVIGATION */

navButtons.forEach(button => {

    button.addEventListener("click", () => {

        navigate(button.dataset.page);

    });

});


/* DASHBOARD LINKS */

document.querySelectorAll("[data-page-link]").forEach(button => {

    button.addEventListener("click", () => {

        navigate(button.dataset.pageLink);

    });

});


/* VEHICLE */

document.getElementById("viewCar").addEventListener("click", () => {

    navigate("stock");

    showToast("Véhicule sélectionné : BMW M4 Competition");

});


/* BUY */

document.getElementById("buyCar").addEventListener("click", () => {

    const price = 68500;

    if (money >= price) {

        money -= price;

        document.getElementById("money").textContent =
            money.toLocaleString("fr-FR") + " €";

        showToast("🚘 Nouveau véhicule acheté pour 68 500 €");

    } else {

        showToast("Fonds insuffisants.");

    }

});


/* SELL */

document.querySelectorAll(".sell-btn").forEach(button => {

    button.addEventListener("click", () => {

        const salePrice = Math.floor(
            Math.random() * 15000
        ) + 70000;

        money += salePrice;

        document.getElementById("money").textContent =
            money.toLocaleString("fr-FR") + " €";

        showToast(
            "💰 Véhicule vendu pour " +
            salePrice.toLocaleString("fr-FR") +
            " €"
        );

    });

});


/* NOTIFICATION */

document.getElementById("notificationButton")
    .addEventListener("click", () => {

        showToast("🔔 3 nouvelles notifications");

    });


/* INITIALIZATION */

console.log("ZENTRO DEALERSHIP V1 chargé.");
console.log("Système économique : actif.");
console.log("Interface : active.");
