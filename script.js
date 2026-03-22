const yearNode = document.getElementById("year");
const cookieBar = document.getElementById("cookieBar");
const cookieButton = document.getElementById("cookieOk");

if (yearNode){
    yearNode.textContent = new Date().getFullYear();
}

if(cookieButton && cookieBar){
    cookieButton.addEventListener("click", () => {
        cookieBar.style.display = "none";
    });
}

document.documentElement.classList.add("js-enabled");

function setupMobileMenu() {
    const headerInner = document.querySelector(".header-inner");
    const nav = document.querySelector(".top-nav");

    if (!headerInner || !nav) {
        return;
    }

    let menuButton = document.querySelector(".menu-toggle");

    if (!menuButton) {
        menuButton = document.createElement("button");
        menuButton.type = "button";
        menuButton.className = "menu-toggle";
        menuButton.setAttribute("aria-label", "Open menu");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.innerHTML =
            '<span class="menu-line"></span>' +
            '<span class="menu-line"></span>' +
            '<span class="menu-line"></span>';

        headerInner.insertBefore(menuButton, nav);
    }

    const closeMenu = () => {
        nav.classList.remove("is-open");
        menuButton.classList.remove("is-active");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open menu");
    };

    const openMenu = () => {
        nav.classList.add("is-open");
        menuButton.classList.add("is-active");
        menuButton.setAttribute("aria-expanded", "true");
        menuButton.setAttribute("aria-label", "Close menu");
    };

    menuButton.addEventListener("click", () => {
        if (nav.classList.contains("is-open")) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    nav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            if (window.innerWidth <= 760) {
                closeMenu();
            }
        });
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 760) {
            closeMenu();
        }
    });
}

setupMobileMenu();


