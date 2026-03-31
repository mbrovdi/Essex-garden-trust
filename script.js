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

function setupVolunteerSlider() {
    const slider = document.querySelector("[data-volunteer-slider]");

    if (!slider) {
        const legacyCards = Array.from(document.querySelectorAll(".volunteering-images .volunteering"));

        if (legacyCards.length > 0) {
            let legacyIndex = 0;
            let legacyStartX = 0;
            let legacyEndX = 0;

            const showLegacyCard = () => {
                legacyCards.forEach((card, index) => {
                    card.style.display = index === legacyIndex ? "block" : "none";
                });
            };

            const goLegacyNext = () => {
                legacyIndex = (legacyIndex + 1) % legacyCards.length;
                showLegacyCard();
            };

            const goLegacyPrev = () => {
                legacyIndex = (legacyIndex - 1 + legacyCards.length) % legacyCards.length;
                showLegacyCard();
            };

            legacyCards.forEach((card) => {
                const nextButton = card.querySelector(".volunteering-button");
                if (nextButton) {
                    nextButton.addEventListener("click", goLegacyNext);
                }
            });

            const legacyContainer = document.querySelector(".volunteering-images");
            if (legacyContainer) {
                legacyContainer.addEventListener("touchstart", (event) => {
                    legacyStartX = event.changedTouches[0].clientX;
                }, { passive: true });

                legacyContainer.addEventListener("touchend", (event) => {
                    legacyEndX = event.changedTouches[0].clientX;
                    const difference = legacyStartX - legacyEndX;

                    if (Math.abs(difference) < 40) {
                        return;
                    }

                    if (difference > 0) {
                        goLegacyNext();
                    } else {
                        goLegacyPrev();
                    }
                }, { passive: true });
            }

            showLegacyCard();
        }

        return;
    }

    const track = slider.querySelector(".volunteering-list");
    const slides = Array.from(slider.querySelectorAll(".volunteering-item"));
    const prevButton = slider.querySelector(".volunteer-prev");
    const nextButton = slider.querySelector(".volunteer-next");
    const dotsContainer = slider.querySelector(".volunteer-dots");

    if (!track || slides.length === 0 || !prevButton || !nextButton || !dotsContainer) {
        return;
    }

    let currentIndex = 0;
    let startX = 0;
    let endX = 0;

    dotsContainer.innerHTML = "";
    slides.forEach((_, index) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "volunteer-dot";
        dot.setAttribute("aria-label", `Go to image ${index + 1}`);
        dot.addEventListener("click", () => {
            currentIndex = index;
            updateSlider();
        });
        dotsContainer.appendChild(dot);
    });

    const dots = Array.from(dotsContainer.querySelectorAll(".volunteer-dot"));

    function updateSlider() {
        const isMobile = window.innerWidth <= 980;

        if (isMobile) {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            slides.forEach((slide) => {
                slide.classList.remove("active", "prev", "next");
            });
        } else {
            track.style.transform = "";
            slides.forEach((slide) => {
                slide.classList.remove("active", "prev", "next");
            });

            const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
            const nextIndex = (currentIndex + 1) % slides.length;

            slides[currentIndex].classList.add("active");
            slides[prevIndex].classList.add("prev");
            slides[nextIndex].classList.add("next");
        }

        dots.forEach((dot, index) => {
            dot.classList.toggle("active", index === currentIndex);
        });
    }

    prevButton.addEventListener("click", () => {
        currentIndex = currentIndex === 0 ? slides.length - 1 : currentIndex - 1;
        updateSlider();
    });

    nextButton.addEventListener("click", () => {
        currentIndex = currentIndex === slides.length - 1 ? 0 : currentIndex + 1;
        updateSlider();
    });

    track.addEventListener("touchstart", (event) => {
        startX = event.changedTouches[0].clientX;
    }, { passive: true });

    track.addEventListener("touchend", (event) => {
        endX = event.changedTouches[0].clientX;
        const difference = startX - endX;

        if (Math.abs(difference) < 40) {
            return;
        }

        if (difference > 0) {
            currentIndex = currentIndex === slides.length - 1 ? 0 : currentIndex + 1;
        } else {
            currentIndex = currentIndex === 0 ? slides.length - 1 : currentIndex - 1;
        }

        updateSlider();
    }, { passive: true });

    window.addEventListener("resize", updateSlider);

    updateSlider();
}

setupVolunteerSlider();


