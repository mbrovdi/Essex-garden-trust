// Flag used by CSS to enable JS-only responsive behaviors.
document.documentElement.classList.add("js-enabled"); // Enables CSS rules that depend on JavaScript.

// Highlights the current page in the top navigation.
// It compares the current URL filename to each nav link filename.
// If a submenu item matches, its parent dropdown button is also marked active.
function setupActiveNavigation() {
    const nav = document.querySelector(".top-nav"); // Define local constant for this feature flow.

    if (!nav) {
        return; // Execute this step as part of the current feature logic.
    }

    const currentPath = window.location.pathname.split("/").pop() || "index.html"; // Current file name in URL.
    const allLinks = Array.from(nav.querySelectorAll("a[href]")); // Define local constant for this feature flow.

    allLinks.forEach((link) => {
        const linkPath = link.getAttribute("href"); // Define local constant for this feature flow.

        if (!linkPath || linkPath.startsWith("http") || linkPath.startsWith("#")) {
            return; // Execute this step as part of the current feature logic.
        }

        const normalizedLinkPath = linkPath.split("/").pop(); // Define local constant for this feature flow.

        if (normalizedLinkPath === currentPath) {
            link.classList.add("active"); // Highlights the matching nav link.

            // If this link is inside a dropdown, also highlight its parent button.
            const parentDropdown = link.closest(".droplist"); // Define local constant for this feature flow.
            const parentButton = parentDropdown ? parentDropdown.querySelector(".dropbtn") : null; // Define local constant for this feature flow.

            if (parentButton) {
                parentButton.classList.add("active"); // Highlights parent dropdown button too.
            }
        }
    });
}

setupActiveNavigation(); // Initialize this page feature immediately.

// Adds a hamburger menu and handles open/close behavior on smaller screens.
// The button is created in JS so the same HTML can support both JS and no-JS states.
function setupMobileMenu() {
    const headerInner = document.querySelector(".header-inner"); // Define local constant for this feature flow.
    const nav = document.querySelector(".top-nav"); // Define local constant for this feature flow.

    if (!headerInner || !nav) {
        return; // Execute this step as part of the current feature logic.
    }

    let menuButton = document.querySelector(".menu-toggle"); // Keep mutable state used by later interactions.

    if (!menuButton) {
        // Create the toggle button dynamically so HTML can stay clean and reusable.
        menuButton = document.createElement("button"); // Execute this step as part of the current feature logic.
        menuButton.type = "button"; // Execute this step as part of the current feature logic.
        menuButton.className = "menu-toggle"; // Reuse existing CSS styles for the button.
        menuButton.setAttribute("aria-label", "Open menu"); // Announces action for screen readers.
        menuButton.setAttribute("aria-expanded", "false"); // Initial collapsed accessibility state.
        menuButton.innerHTML =
            '<span class="menu-line"></span>' +
            '<span class="menu-line"></span>' +
            '<span class="menu-line"></span>'; // Execute this step as part of the current feature logic.

        headerInner.insertBefore(menuButton, nav); // Execute this step as part of the current feature logic.
    }

    const closeMenu = () => {
        // Keep these three updates together so visual and ARIA states never drift.
        nav.classList.remove("is-open"); // Collapses mobile navigation.
        menuButton.classList.remove("is-active"); // Remove CSS state class when no longer needed.
        menuButton.setAttribute("aria-expanded", "false"); // Keep ARIA state in sync with collapsed nav.
        menuButton.setAttribute("aria-label", "Open menu"); // Describes next action after close.
    };

    const openMenu = () => {
        // Keep these three updates together so visual and ARIA states never drift.
        nav.classList.add("is-open"); // Expands mobile navigation.
        menuButton.classList.add("is-active"); // Apply CSS state class for visual feedback.
        menuButton.setAttribute("aria-expanded", "true"); // Keep ARIA state in sync with expanded nav.
        menuButton.setAttribute("aria-label", "Close menu"); // Describes next action after open.
    };

    menuButton.addEventListener("click", () => {
        if (nav.classList.contains("is-open")) {
            closeMenu(); // Execute this step as part of the current feature logic.
        } else {
            openMenu(); // Execute this step as part of the current feature logic.
        }
    });

    nav.querySelectorAll("a").forEach((link) => {
        // Close menu after navigation selection on mobile.
        link.addEventListener("click", () => {
            if (window.innerWidth <= 760) {
                closeMenu(); // Execute this step as part of the current feature logic.
            }
        });
    });

    window.addEventListener("resize", () => {
        // Reset mobile menu state when returning to desktop width.
        if (window.innerWidth > 760) {
            closeMenu(); // Execute this step as part of the current feature logic.
        }
    });
}

setupMobileMenu(); // Initialize this page feature immediately.

// Volunteer slider:
// - on desktop it shows two cards
// - on mobile it shows one card and allows swipe
function setupVolunteerSlider() {
    const slider = document.querySelector("[data-volunteer-slider]");

    if (!slider) {
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
    let touchStartX = 0;

    function clearSlideClasses() {
        slides.forEach((slide) => {
            slide.classList.remove("active", "next");
        });
    }

    function updateDots(dots) {
        dots.forEach((dot, index) => {
            dot.classList.toggle("active", index === currentIndex);
        });
    }

    function showSlides(dots) {
        const isMobile = window.innerWidth <= 980;
        clearSlideClasses();

        if (isMobile) {
            // Move the whole row left/right on mobile.
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
        } else {
            // Desktop uses classes to show the current slide and the next slide.
            track.style.transform = "";
            const nextIndex = (currentIndex + 1) % slides.length;
            slides[currentIndex].classList.add("active");
            slides[nextIndex].classList.add("next");
        }

        updateDots(dots);
    }

    function showNextSlide(dots) {
        currentIndex = (currentIndex + 1) % slides.length;
        showSlides(dots);
    }

    function showPreviousSlide(dots) {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        showSlides(dots);
    }

    // Create one dot for each slide.
    dotsContainer.innerHTML = "";
    slides.forEach((_, index) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "volunteer-dot";
        dot.setAttribute("aria-label", `Go to image ${index + 1}`);
        dotsContainer.appendChild(dot);
    });

    const dots = Array.from(dotsContainer.querySelectorAll(".volunteer-dot"));

    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            currentIndex = index;
            showSlides(dots);
        });
    });

    prevButton.addEventListener("click", () => {
        showPreviousSlide(dots);
    });

    nextButton.addEventListener("click", () => {
        showNextSlide(dots);
    });

    track.addEventListener("touchstart", (event) => {
        touchStartX = event.changedTouches[0].clientX;
    }, { passive: true });

    track.addEventListener("touchend", (event) => {
        const touchEndX = event.changedTouches[0].clientX;
        const swipeDistance = touchStartX - touchEndX;

        if (Math.abs(swipeDistance) < 40) {
            return;
        }

        if (swipeDistance > 0) {
            showNextSlide(dots);
        } else {
            showPreviousSlide(dots);
        }
    }, { passive: true });

    window.addEventListener("resize", () => {
        showSlides(dots);
    });

    showSlides(dots);
}

setupVolunteerSlider(); // Initialize this page feature immediately.

// Events page: reveal more cards in batches.
function setupEventsLoadMore() {
    const eventsSection = document.querySelector("[data-events-section]"); // Define local constant for this feature flow.

    if (!eventsSection) {
        return; // Execute this step as part of the current feature logic.
    }

    const cards = Array.from(eventsSection.querySelectorAll(".events-card")); // Define local constant for this feature flow.
    const loadMoreBtn = eventsSection.querySelector("[data-events-load-more]"); // Define local constant for this feature flow.

    if (cards.length === 0 || !loadMoreBtn) {
        return; // Execute this step as part of the current feature logic.
    }

    const step = 6; // Define local constant for this feature flow.
    let visible = 3; // Keep mutable state used by later interactions.

    const renderEvents = () => {
        // Only show the first N cards, then increase N when clicking load more.
        cards.forEach((card, index) => {
            card.style.display = index < visible ? "block" : "none"; // Reveal cards up to visible count.
        });

        loadMoreBtn.style.display = visible >= cards.length ? "none" : "inline-block"; // Hide button when all cards are already visible.
    };

    loadMoreBtn.addEventListener("click", () => {
        // Increase visible window and re-render.
        visible += step; // Execute this step as part of the current feature logic.
        renderEvents(); // Execute this step as part of the current feature logic.
    });

    renderEvents(); // Execute this step as part of the current feature logic.
}

setupEventsLoadMore(); // Initialize this page feature immediately.

// News page: same progressive reveal pattern as events.
function setupNewsLoadMore() {
    const newsSection = document.querySelector("[data-news-section]"); // Define local constant for this feature flow.

    if (!newsSection) {
        return; // Execute this step as part of the current feature logic.
    }

    const cards = Array.from(newsSection.querySelectorAll(".news-card")); // Define local constant for this feature flow.
    const loadMoreBtn = newsSection.querySelector("[data-news-load-more]"); // Define local constant for this feature flow.

    if (cards.length === 0 || !loadMoreBtn) {
        return; // Execute this step as part of the current feature logic.
    }

    const step = 6; // Define local constant for this feature flow.
    let visible = 3; // Keep mutable state used by later interactions.

    const renderNews = () => {
        cards.forEach((card, index) => {
            card.style.display = index < visible ? "block" : "none"; // Reveal cards up to visible count.
        });

        loadMoreBtn.style.display = visible >= cards.length ? "none" : "inline-block"; // Hide button when all cards are already visible.
    };

    loadMoreBtn.addEventListener("click", () => {
        // Increase visible window and re-render.
        visible += step; // Execute this step as part of the current feature logic.
        renderNews(); // Execute this step as part of the current feature logic.
    });

    renderNews(); // Execute this step as part of the current feature logic.
}

setupNewsLoadMore(); // Initialize this page feature immediately.

// Donation page payment flow (beginner-friendly):
// 1) user picks frequency + method
// 2) user clicks amount button
// 3) we find checkout link
// 4) real link opens new tab, otherwise we show demo modal
function setupDonationPayments() {
    // Find the donate area; if this page does not have it, stop safely.
    const donationSection = document.querySelector("#donation-options");
    if (!donationSection) {
        return;
    }

    // Buttons users click to choose frequency, method, and amount.
    const frequencyButtons = Array.from(donationSection.querySelectorAll(".freq-btn"));
    const methodButtons = Array.from(donationSection.querySelectorAll(".payment-method-btn"));
    const donateButtons = Array.from(document.querySelectorAll(".donate-btn[data-donation-amount]"));

    if (frequencyButtons.length === 0 || methodButtons.length === 0 || donateButtons.length === 0) {
        return;
    }

    // Default selected values when page loads.
    let selectedFrequency = "one-time";
    let selectedMethod = "paypal";
    // Saved values while demo modal is open.
    let pendingPayment = null;

    const demoModal = document.getElementById("paymentDemoModal");
    const demoAmount = document.getElementById("paymentDemoAmount");
    const demoMethod = document.getElementById("paymentDemoMethod");
    const demoFrequency = document.getElementById("paymentDemoFrequency");
    const demoConfirm = document.getElementById("paymentDemoConfirm");
    const demoCloseButtons = Array.from(document.querySelectorAll("[data-payment-demo-close]"));

    // Map of method + frequency + amount -> checkout URL.
    // Stripe URLs are placeholders now, so they trigger demo mode.
    const paymentLinks = {
        paypal: {
            "one-time": {
                "10": "https://www.paypal.com/donate",
                "25": "https://www.paypal.com/donate",
                "50": "https://www.paypal.com/donate"
            },
            monthly: {
                "10": "https://www.paypal.com/donate",
                "25": "https://www.paypal.com/donate",
                "50": "https://www.paypal.com/donate"
            }
        },
        stripe: {
            "one-time": {
                "10": "https://buy.stripe.com/test_placeholder_10",
                "25": "https://buy.stripe.com/test_placeholder_25",
                "50": "https://buy.stripe.com/test_placeholder_50"
            },
            monthly: {
                "10": "https://buy.stripe.com/test_placeholder_monthly_10",
                "25": "https://buy.stripe.com/test_placeholder_monthly_25",
                "50": "https://buy.stripe.com/test_placeholder_monthly_50"
            }
        }
    };

    // Helper: show active style on only one button in a group.
    function setActiveButton(buttons, clickedButton) {
        buttons.forEach((button) => button.classList.remove("active"));
        clickedButton.classList.add("active");
    }

    // Helper: placeholder links are treated as demo, not real checkout.
    function isRealCheckoutLink(url) {
        return Boolean(url) && !url.includes("placeholder");
    }

    // Hide the modal and clear saved payment data.
    function closeDemoModal() {
        if (!demoModal) {
            return;
        }

        demoModal.hidden = true;
        pendingPayment = null;
    }

    // Show selected payment details in modal for confirmation.
    function openDemoModal(amount, method, frequency) {
        if (!demoModal || !demoAmount || !demoMethod || !demoFrequency) {
            alert("Demo payment: £" + amount + " via " + method + " (" + frequency + ")");
            return;
        }

        pendingPayment = { amount, method, frequency };
        demoAmount.textContent = amount;
        demoMethod.textContent = method === "stripe" ? "Card (Stripe)" : "PayPal";
        demoFrequency.textContent = frequency === "monthly" ? "Monthly" : "One-time";
        demoModal.hidden = false;
    }

    frequencyButtons.forEach((button) => {
        button.addEventListener("click", () => {
            // Update selected frequency when user clicks a frequency button.
            setActiveButton(frequencyButtons, button);
            const buttonText = button.textContent ? button.textContent.trim().toLowerCase() : "";
            selectedFrequency = buttonText === "monthly" ? "monthly" : "one-time";
        });
    });

    methodButtons.forEach((button) => {
        button.addEventListener("click", () => {
            // Update selected method when user clicks PayPal/Card.
            setActiveButton(methodButtons, button);
            selectedMethod = button.getAttribute("data-payment-method") || "paypal";
        });
    });

    donateButtons.forEach((button) => {
        button.addEventListener("click", () => {
            // Read amount from clicked button (for example: 10, 25, 50).
            const amount = button.getAttribute("data-donation-amount");
            if (!amount) {
                return;
            }

            // Find the right URL for current method + frequency + amount.
            const checkoutUrl = paymentLinks[selectedMethod]?.[selectedFrequency]?.[amount];

            if (!isRealCheckoutLink(checkoutUrl)) {
                // No real checkout yet: use local demo modal.
                openDemoModal(amount, selectedMethod, selectedFrequency);
                return;
            }

            // Real checkout link: open provider page in a new tab.
            window.open(checkoutUrl, "_blank", "noopener,noreferrer");
        });
    });

    if (demoConfirm) {
        demoConfirm.addEventListener("click", () => {
            if (!pendingPayment) {
                closeDemoModal();
                return;
            }

            // Demo success message so user can complete test flow.
            alert(
                "Demo payment confirmed: £" + pendingPayment.amount +
                " via " + (pendingPayment.method === "stripe" ? "Card (Stripe)" : "PayPal") +
                " (" + (pendingPayment.frequency === "monthly" ? "Monthly" : "One-time") + ")"
            );
            closeDemoModal();
        });
    }

    demoCloseButtons.forEach((button) => {
        button.addEventListener("click", closeDemoModal);
    });
}

setupDonationPayments(); // Initialize this page feature immediately.

// Membership page: collect form details, then simulate hosted payment checkout.
function setupMembershipPayments() {
    // Membership form and payment area on membership page.
    const membershipForm = document.getElementById("membershipJoinForm");
    const paymentCard = document.getElementById("membership-payment");

    if (!membershipForm || !paymentCard) {
        return;
    }

    // Membership options and summary fields.
    const planButtons = Array.from(document.querySelectorAll("[data-membership-plan]"));
    const methodButtons = Array.from(paymentCard.querySelectorAll("[data-membership-payment-method]"));
    const selectedPlanText = document.getElementById("membershipSelectedPlan");
    const selectedAmountText = document.getElementById("membershipSelectedAmount");
    const payNowButton = document.getElementById("membershipPayNow");

    const demoModal = document.getElementById("membershipPaymentDemoModal");
    const demoPlan = document.getElementById("membershipPaymentDemoPlan");
    const demoAmount = document.getElementById("membershipPaymentDemoAmount");
    const demoMethod = document.getElementById("membershipPaymentDemoMethod");
    const demoConfirm = document.getElementById("membershipPaymentDemoConfirm");
    const demoCloseButtons = Array.from(document.querySelectorAll("[data-membership-payment-demo-close]"));

    // Default selected plan/method values.
    let selectedPlan = "Individual";
    let selectedAmount = "25";
    let selectedMethod = "paypal";
    let pendingMembershipPayment = null;

    // Real links can replace placeholders later.
    const membershipPaymentLinks = {
        paypal: {
            "25": "https://www.paypal.com/donate",
            "40": "https://www.paypal.com/donate",
            "100": "https://www.paypal.com/donate"
        },
        stripe: {
            "25": "https://buy.stripe.com/test_placeholder_membership_25",
            "40": "https://buy.stripe.com/test_placeholder_membership_40",
            "100": "https://buy.stripe.com/test_placeholder_membership_100"
        }
    };

    // True means we have a live checkout URL.
    const hasRealLink = (url) => {
        return Boolean(url) && !url.includes("placeholder");
    };

    // Keep summary panel in sync with current selections.
    const updateSummary = () => {
        if (selectedPlanText) {
            selectedPlanText.textContent = selectedPlan;
        }

        if (selectedAmountText) {
            selectedAmountText.textContent = selectedAmount;
        }
    };

    // Close modal and clear temporary pending data.
    const closeDemoModal = () => {
        if (!demoModal) {
            return;
        }

        demoModal.hidden = true;
        pendingMembershipPayment = null;
    };

    // Open modal with selected membership payment details.
    const openDemoModal = () => {
        if (!demoModal || !demoPlan || !demoAmount || !demoMethod) {
            alert("Demo membership payment: £" + selectedAmount + " via " + (selectedMethod === "stripe" ? "Card (Stripe)" : "PayPal"));
            return;
        }

        pendingMembershipPayment = {
            plan: selectedPlan,
            amount: selectedAmount,
            method: selectedMethod
        };

        demoPlan.textContent = selectedPlan;
        demoAmount.textContent = selectedAmount;
        demoMethod.textContent = selectedMethod === "stripe" ? "Card (Stripe)" : "PayPal";
        demoModal.hidden = false;
    };

    planButtons.forEach((button) => {
        button.addEventListener("click", () => {
            // Update selected membership type and price.
            selectedPlan = button.getAttribute("data-membership-plan") || "Individual";
            selectedAmount = button.getAttribute("data-membership-price") || "25";
            updateSummary();
        });
    });

    methodButtons.forEach((button) => {
        button.addEventListener("click", () => {
            // Only one payment method can be active at a time.
            methodButtons.forEach((item) => item.classList.remove("active"));
            button.classList.add("active");
            selectedMethod = button.getAttribute("data-membership-payment-method") || "paypal";
        });
    });

    membershipForm.addEventListener("submit", (event) => {
        // Prevent real form submit; reveal payment card on same page.
        event.preventDefault();
        paymentCard.hidden = false;
        paymentCard.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    if (payNowButton) {
        payNowButton.addEventListener("click", () => {
            const url = membershipPaymentLinks[selectedMethod]?.[selectedAmount];

            if (!hasRealLink(url)) {
                // Placeholder URL means demo flow.
                openDemoModal();
                return;
            }

            // Real checkout link available.
            window.open(url, "_blank", "noopener,noreferrer");
        });
    }

    if (demoConfirm) {
        demoConfirm.addEventListener("click", () => {
            if (!pendingMembershipPayment) {
                closeDemoModal();
                return;
            }

            alert(
                "Demo membership payment confirmed: " + pendingMembershipPayment.plan +
                " (£" + pendingMembershipPayment.amount + ") via " +
                (pendingMembershipPayment.method === "stripe" ? "Card (Stripe)" : "PayPal")
            );
            closeDemoModal();
        });
    }

    demoCloseButtons.forEach((button) => {
        button.addEventListener("click", closeDemoModal);
    });

    updateSummary();
}

setupMembershipPayments();

const themeStorageKey = "egt-theme";
const siteSearchPages = [
    {
        title: "Home",
        url: "index.html",
        description: "Overview of Essex Garden Trust, featured places, and upcoming highlights.",
        keywords: "home gardens trust essex featured places upcoming events"
    },
    {
        title: "Conservation",
        url: "conservation.html",
        description: "Conservation casework, heritage landscapes, and protection priorities.",
        keywords: "conservation heritage landscapes casework protection"
    },
    {
        title: "What We Do",
        url: "whatwedo.html",
        description: "Core programmes, community work, and organisational priorities.",
        keywords: "what we do programmes community priorities"
    },
    {
        title: "Education",
        url: "education.html",
        description: "Learning programmes, talks, and opportunities for all ages.",
        keywords: "education learning schools talks workshops"
    },
    {
        title: "Research",
        url: "research.html",
        description: "Research projects, archives, and designed landscape history.",
        keywords: "research archives history landscape"
    },
    {
        title: "Events",
        url: "events.html",
        description: "Upcoming events, lectures, visits, and booking links.",
        keywords: "events calendar lectures visits booking"
    },
    {
        title: "News",
        url: "news.html",
        description: "Latest updates, announcements, and stories from the trust.",
        keywords: "news stories updates announcements"
    },
    {
        title: "Donate",
        url: "donate.html",
        description: "Support current work with one-off or recurring donations.",
        keywords: "donate support funding recurring"
    },
    {
        title: "Corporate Support",
        url: "support.html",
        description: "Partnerships, sponsorship, and corporate support options.",
        keywords: "corporate support partnership sponsorship"
    },
    {
        title: "Contact",
        url: "contact.html",
        description: "Contact details, form, and volunteering enquiries.",
        keywords: "contact phone email volunteer"
    },
    {
        title: "Volunteer",
        url: "volunteer.html",
        description: "Volunteer roles, stories, and ways to get involved.",
        keywords: "volunteer roles get involved community"
    },
    {
        title: "Membership",
        url: "membership.html",
        description: "Membership plans, benefits, and signup flow.",
        keywords: "membership join benefits plans"
    }
];

function safeLocalStorageGet(key) {
    try {
        return window.localStorage.getItem(key);
    } catch {
        return null;
    }
}

function safeLocalStorageSet(key, value) {
    try {
        window.localStorage.setItem(key, value);
    } catch {
        // Ignore storage failures in private browsing or restricted contexts.
    }
}

function applyTheme(theme) {
    const normalizedTheme = theme === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", normalizedTheme);
}

function getPreferredTheme() {
    const savedTheme = safeLocalStorageGet(themeStorageKey);

    if (savedTheme === "light" || savedTheme === "dark") {
        return savedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function setupThemeToggle() {
    applyTheme(getPreferredTheme());
}

function slugifyText(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

function buildLocalSearchSections() {
    const headingSelector = "main h1, main h2, main h3, section h1, section h2, section h3";
    const headings = Array.from(document.querySelectorAll(headingSelector));
    const seenIds = new Set();

    return headings
        .map((heading, index) => {
            const rawTitle = heading.textContent ? heading.textContent.trim() : "";

            if (!rawTitle) {
                return null;
            }

            if (!heading.id) {
                const fallbackId = slugifyText(rawTitle) || `section-${index + 1}`;
                let uniqueId = fallbackId;
                let suffix = 2;

                while (document.getElementById(uniqueId) || seenIds.has(uniqueId)) {
                    uniqueId = `${fallbackId}-${suffix}`;
                    suffix += 1;
                }

                heading.id = uniqueId;
            }

            seenIds.add(heading.id);

            return {
                title: rawTitle,
                url: `#${heading.id}`,
                description: "Jump to this section on the current page.",
                keywords: `${rawTitle.toLowerCase()} section current page`,
                type: "Section"
            };
        })
        .filter(Boolean);
}

function setupHeaderTools() {
    const headerInner = document.querySelector(".header-inner");

    if (!headerInner || headerInner.querySelector(".header-tools")) {
        return;
    }

    const searchOverlay = document.createElement("div");
    searchOverlay.className = "site-search-overlay";
    searchOverlay.hidden = true;
    searchOverlay.innerHTML =
        '<div class="site-search-backdrop" data-search-close></div>' +
        '<div class="site-search-dialog" role="dialog" aria-modal="true" aria-labelledby="siteSearchTitle">' +
            '<div class="site-search-head">' +
                '<div>' +
                    '<p class="site-search-eyebrow">Quick Navigation</p>' +
                    '<h2 id="siteSearchTitle">Search the website</h2>' +
                '</div>' +
                '<button type="button" class="site-search-close" aria-label="Close search" data-search-close>' +
                    '<i class="fa fa-times" aria-hidden="true"></i>' +
                '</button>' +
            '</div>' +
            '<form class="site-search-form">' +
                '<label class="site-search-label" for="siteSearchInput">Find pages, sections, news, and events</label>' +
                '<div class="site-search-input-row">' +
                    '<input id="siteSearchInput" class="site-search-input" type="search" placeholder="Search the site" autocomplete="off">' +
                    '<button type="submit" class="site-search-submit">Open</button>' +
                '</div>' +
            '</form>' +
            '<div class="site-search-results" id="siteSearchResults"></div>' +
        '</div>';

    document.body.appendChild(searchOverlay);

    const tools = document.createElement("div");
    tools.className = "header-tools";
    tools.innerHTML =
        '<button type="button" class="header-tool-btn header-search-btn" aria-label="Search the website">' +
            '<i class="fa fa-search" aria-hidden="true"></i>' +
            '<span class="header-tool-btn-label">Search</span>' +
        '</button>' +
        '<button type="button" class="header-tool-btn header-theme-btn" aria-label="Switch colour mode">' +
            '<i class="fa fa-adjust" aria-hidden="true"></i>' +
            '<span class="header-tool-btn-label">Theme</span>' +
        '</button>';

    headerInner.appendChild(tools);

    const searchButton = tools.querySelector(".header-search-btn");
    const themeButton = tools.querySelector(".header-theme-btn");
    const searchForm = searchOverlay.querySelector(".site-search-form");
    const searchInput = searchOverlay.querySelector(".site-search-input");
    const resultsContainer = searchOverlay.querySelector(".site-search-results");
    const closeButtons = Array.from(searchOverlay.querySelectorAll("[data-search-close]"));

    if (!searchButton || !themeButton || !searchForm || !searchInput || !resultsContainer) {
        return;
    }

    const searchIndex = [
        ...buildLocalSearchSections(),
        ...siteSearchPages.map((page) => ({
            ...page,
            type: "Page"
        }))
    ];

    const getCurrentTheme = () => {
        return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    };

    const updateThemeButtonLabel = () => {
        const currentTheme = getCurrentTheme();
        const label = themeButton.querySelector(".header-tool-btn-label");

        if (label) {
            label.textContent = currentTheme === "dark" ? "Dark" : "Light";
        }

        themeButton.setAttribute(
            "aria-label",
            currentTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"
        );
    };

    const renderResults = (query) => {
        const normalizedQuery = query.trim().toLowerCase();
        const rankedResults = searchIndex
            .map((item) => {
                const haystack = `${item.title} ${item.description} ${item.keywords || ""}`.toLowerCase();
                let score = 0;

                if (!normalizedQuery) {
                    score = item.type === "Section" ? 2 : 1;
                } else if (item.title.toLowerCase().startsWith(normalizedQuery)) {
                    score = 5;
                } else if (item.title.toLowerCase().includes(normalizedQuery)) {
                    score = 4;
                } else if (haystack.includes(normalizedQuery)) {
                    score = 3;
                }

                return { ...item, score };
            })
            .filter((item) => item.score > 0)
            .sort((left, right) => right.score - left.score || left.title.localeCompare(right.title))
            .slice(0, 8);

        if (rankedResults.length === 0) {
            resultsContainer.innerHTML =
                '<div class="site-search-empty">No matches yet. Try terms like events, membership, volunteer, or conservation.</div>';
            return rankedResults;
        }

        resultsContainer.innerHTML = rankedResults
            .map((result) => {
                return (
                    '<a class="site-search-result" href="' + result.url + '">' +
                        '<span class="site-search-result-type">' + result.type + '</span>' +
                        '<strong>' + result.title + '</strong>' +
                        '<p>' + result.description + '</p>' +
                    '</a>'
                );
            })
            .join("");

        return rankedResults;
    };

    const closeSearch = () => {
        searchOverlay.hidden = true;
        document.body.classList.remove("search-open");
    };

    const openSearch = () => {
        searchOverlay.hidden = false;
        document.body.classList.add("search-open");
        renderResults(searchInput.value);

        window.requestAnimationFrame(() => {
            searchInput.focus();
            searchInput.select();
        });
    };

    searchButton.addEventListener("click", openSearch);

    closeButtons.forEach((button) => {
        button.addEventListener("click", closeSearch);
    });

    searchInput.addEventListener("input", () => {
        renderResults(searchInput.value);
    });

    searchForm.addEventListener("submit", (event) => {
        const results = renderResults(searchInput.value);

        if (results.length === 0) {
            event.preventDefault();
            return;
        }

        event.preventDefault();
        window.location.href = results[0].url;
    });

    searchOverlay.addEventListener("click", (event) => {
        const resultLink = event.target.closest(".site-search-result");

        if (resultLink) {
            closeSearch();
        }
    });

    themeButton.addEventListener("click", () => {
        const nextTheme = getCurrentTheme() === "dark" ? "light" : "dark";
        applyTheme(nextTheme);
        safeLocalStorageSet(themeStorageKey, nextTheme);
        updateThemeButtonLabel();
    });

    document.addEventListener("keydown", (event) => {
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
            event.preventDefault();
            openSearch();
            return;
        }

        if (event.key === "Escape" && !searchOverlay.hidden) {
            closeSearch();
        }
    });

    renderResults("");
    updateThemeButtonLabel();
}

function setupSectionReveal() {
    const revealItems = Array.from(document.querySelectorAll(
        "main section, .events-card, .news-card, .membership-card, .donate-card, .google-work-card, .card"
    ));

    if (revealItems.length === 0 || !("IntersectionObserver" in window)) {
        return;
    }

    revealItems.forEach((item) => {
        item.classList.add("reveal-block");
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.14,
        rootMargin: "0px 0px -40px 0px"
    });

    revealItems.forEach((item) => observer.observe(item));
}

setupThemeToggle();
setupHeaderTools();
setupSectionReveal();


