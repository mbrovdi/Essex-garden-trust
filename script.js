// Optional UI helpers used on pages that include these elements.
// This script is shared by all pages, so every feature checks for required DOM nodes
// and exits early when the page does not contain them.
const yearNode = document.getElementById("year"); // Define local constant for this feature flow.
const cookieBar = document.getElementById("cookieBar"); // Define local constant for this feature flow.
const cookieButton = document.getElementById("cookieOk"); // Define local constant for this feature flow.

if (yearNode){
    yearNode.textContent = new Date().getFullYear(); // Auto-updates footer year without manual edits.
}

if(cookieButton && cookieBar){
    // Hide cookie notice for the current visit when user accepts.
    cookieButton.addEventListener("click", () => {
        cookieBar.style.display = "none"; // Removes banner from layout after consent action.
    });
}

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

// Volunteer gallery slider with desktop + touch support.
// Behavior summary:
// - Desktop: show current + next card side by side.
// - Mobile: show one full-width card and slide the track with translateX.
function setupVolunteerSlider() {
    const slider = document.querySelector("[data-volunteer-slider]"); // Define local constant for this feature flow.

    // Keep backward compatibility with the previous volunteer markup.
    if (!slider) {
        const legacyCards = Array.from(document.querySelectorAll(".volunteering-images .volunteering")); // Define local constant for this feature flow.

        if (legacyCards.length > 0) {
            let legacyIndex = 0; // Keep mutable state used by later interactions.
            let legacyStartX = 0; // Keep mutable state used by later interactions.
            let legacyEndX = 0; // Keep mutable state used by later interactions.

            const showLegacyCard = () => {
                // Legacy mode shows one card at a time.
                legacyCards.forEach((card, index) => {
                    card.style.display = index === legacyIndex ? "block" : "none"; // Show current card only.
                });
            };

            const goLegacyNext = () => {
                legacyIndex = (legacyIndex + 1) % legacyCards.length; // Execute this step as part of the current feature logic.
                showLegacyCard(); // Execute this step as part of the current feature logic.
            };

            const goLegacyPrev = () => {
                legacyIndex = (legacyIndex - 1 + legacyCards.length) % legacyCards.length; // Execute this step as part of the current feature logic.
                showLegacyCard(); // Execute this step as part of the current feature logic.
            };

            legacyCards.forEach((card) => {
                const nextButton = card.querySelector(".volunteering-button"); // Define local constant for this feature flow.
                if (nextButton) {
                    nextButton.addEventListener("click", goLegacyNext); // Bind user interaction handler.
                }
            });

            const legacyContainer = document.querySelector(".volunteering-images"); // Define local constant for this feature flow.
            if (legacyContainer) {
                legacyContainer.addEventListener("touchstart", (event) => {
                    legacyStartX = event.changedTouches[0].clientX; // Execute this step as part of the current feature logic.
                }, { passive: true });

                legacyContainer.addEventListener("touchend", (event) => {
                    legacyEndX = event.changedTouches[0].clientX; // Execute this step as part of the current feature logic.
                    const difference = legacyStartX - legacyEndX; // Define local constant for this feature flow.

                    if (Math.abs(difference) < 40) {
                        return; // Execute this step as part of the current feature logic.
                    }

                    if (difference > 0) {
                        goLegacyNext(); // Execute this step as part of the current feature logic.
                    } else {
                        goLegacyPrev(); // Execute this step as part of the current feature logic.
                    }
                }, { passive: true });
            }

            showLegacyCard(); // Execute this step as part of the current feature logic.
        }

        return; // Execute this step as part of the current feature logic.
    }

    const track = slider.querySelector(".volunteering-list"); // Define local constant for this feature flow.
    const slides = Array.from(slider.querySelectorAll(".volunteering-item")); // Define local constant for this feature flow.
    const prevButton = slider.querySelector(".volunteer-prev"); // Define local constant for this feature flow.
    const nextButton = slider.querySelector(".volunteer-next"); // Define local constant for this feature flow.
    const dotsContainer = slider.querySelector(".volunteer-dots"); // Define local constant for this feature flow.

    if (!track || slides.length === 0 || !prevButton || !nextButton || !dotsContainer) {
        return; // Execute this step as part of the current feature logic.
    }

    let currentIndex = 0; // Keep mutable state used by later interactions.
    let startX = 0; // Keep mutable state used by later interactions.
    let endX = 0; // Keep mutable state used by later interactions.

    dotsContainer.innerHTML = ""; // Execute this step as part of the current feature logic.
    // One dot per slide; the active dot tracks the left visible card on desktop.
    slides.forEach((_, index) => {
        const dot = document.createElement("button"); // Define local constant for this feature flow.
        dot.type = "button"; // Execute this step as part of the current feature logic.
        dot.className = "volunteer-dot"; // Execute this step as part of the current feature logic.
        dot.setAttribute("aria-label", `Go to image ${index + 1}`); // Improves keyboard/screen-reader slider navigation.
        dot.addEventListener("click", () => {
            currentIndex = index; // Execute this step as part of the current feature logic.
            updateSlider(); // Execute this step as part of the current feature logic.
        });
        dotsContainer.appendChild(dot); // Insert generated element into the document.
    });

    const dots = Array.from(dotsContainer.querySelectorAll(".volunteer-dot")); // Define local constant for this feature flow.

    function updateSlider() {
        // One function controls all visual states so arrows, dots, and swipe stay in sync.
        const isMobile = window.innerWidth <= 980; // Define local constant for this feature flow.

        // Mobile uses a single-card horizontal swipe track.
        if (isMobile) {
            track.style.transform = `translateX(-${currentIndex * 100}%)`; // Move track by one full slide width.
            slides.forEach((slide) => {
                slide.classList.remove("active", "prev", "next"); // Remove CSS state class when no longer needed.
            });
        } else {
            // Desktop shows two cards at once: current (left) and next (right).
            track.style.transform = ""; // Execute this step as part of the current feature logic.
            slides.forEach((slide) => {
                slide.classList.remove("active", "prev", "next"); // Remove CSS state class when no longer needed.
            });

            const nextIndex = (currentIndex + 1) % slides.length; // Define local constant for this feature flow.

            slides[currentIndex].classList.add("active"); // Left visible slide.
            slides[nextIndex].classList.add("next"); // Right visible slide.
        }

        dots.forEach((dot, index) => {
            dot.classList.toggle("active", index === currentIndex); // Keeps dot indicator aligned with visible slide.
        });
    }

    // Arrow controls cycle through slides in a loop.
    prevButton.addEventListener("click", () => {
        currentIndex = currentIndex === 0 ? slides.length - 1 : currentIndex - 1; // Execute this step as part of the current feature logic.
        updateSlider(); // Execute this step as part of the current feature logic.
    });

    nextButton.addEventListener("click", () => {
        currentIndex = currentIndex === slides.length - 1 ? 0 : currentIndex + 1; // Execute this step as part of the current feature logic.
        updateSlider(); // Execute this step as part of the current feature logic.
    });

    // Swipe gestures for touch devices.
    track.addEventListener("touchstart", (event) => {
        startX = event.changedTouches[0].clientX; // Capture initial finger X coordinate.
    }, { passive: true });

    track.addEventListener("touchend", (event) => {
        endX = event.changedTouches[0].clientX; // Capture final finger X coordinate.
        const difference = startX - endX; // Positive means swipe left, negative means swipe right.

        if (Math.abs(difference) < 40) {
            // Ignore small finger movement to prevent accidental slide changes.
            return; // Execute this step as part of the current feature logic.
        }

        if (difference > 0) {
            currentIndex = currentIndex === slides.length - 1 ? 0 : currentIndex + 1; // Execute this step as part of the current feature logic.
        } else {
            currentIndex = currentIndex === 0 ? slides.length - 1 : currentIndex - 1; // Execute this step as part of the current feature logic.
        }

        updateSlider(); // Execute this step as part of the current feature logic.
    }, { passive: true });

    window.addEventListener("resize", updateSlider); // React to browser events to keep UI state updated.

    updateSlider(); // Execute this step as part of the current feature logic.
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

// Donation page: frontend-only payment flow with method/frequency selectors.
// No backend is required here:
// - If real hosted checkout links exist, open them in a new tab.
// - Otherwise, show a demo modal to simulate payment completion.
function setupDonationPayments() {
    const donationSection = document.querySelector("#donation-options"); // Define local constant for this feature flow.

    if (!donationSection) {
        return; // Execute this step as part of the current feature logic.
    }

    const frequencyButtons = Array.from(donationSection.querySelectorAll(".freq-btn")); // Define local constant for this feature flow.
    const methodButtons = Array.from(donationSection.querySelectorAll(".payment-method-btn")); // Define local constant for this feature flow.
    const donateButtons = Array.from(document.querySelectorAll(".donate-btn[data-donation-amount]")); // Define local constant for this feature flow.

    if (donateButtons.length === 0 || methodButtons.length === 0 || frequencyButtons.length === 0) {
        return; // Execute this step as part of the current feature logic.
    }

    let selectedFrequency = "one-time"; // Default billing interval.
    let selectedMethod = "paypal"; // Default payment method.
    // Stores the current transaction preview while modal is open.
    let pendingPayment = null; // Keep mutable state used by later interactions.

    const demoModal = document.getElementById("paymentDemoModal"); // Define local constant for this feature flow.
    const demoAmount = document.getElementById("paymentDemoAmount"); // Define local constant for this feature flow.
    const demoMethod = document.getElementById("paymentDemoMethod"); // Define local constant for this feature flow.
    const demoFrequency = document.getElementById("paymentDemoFrequency"); // Define local constant for this feature flow.
    const demoConfirm = document.getElementById("paymentDemoConfirm"); // Define local constant for this feature flow.
    const demoCloseButtons = Array.from(document.querySelectorAll("[data-payment-demo-close]")); // Define local constant for this feature flow.

    const paymentLinks = {
        // Real links can be inserted here later; placeholders trigger demo modal flow.
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

    const hasRealLink = (url) => {
        return Boolean(url) && !url.includes("placeholder"); // Treat placeholder URLs as demo-mode only.
    };

    const closeDemoModal = () => {
        if (!demoModal) {
            return; // Execute this step as part of the current feature logic.
        }

        demoModal.hidden = true; // Hide modal in the DOM.
        pendingPayment = null; // Execute this step as part of the current feature logic.
    };

    const openDemoModal = (amount, method, frequency) => {
        // Fallback path for assignment/demo mode when real checkout links are unavailable.
        if (!demoModal || !demoAmount || !demoMethod || !demoFrequency) {
            alert("Demo payment: £" + amount + " via " + method + " (" + frequency + ")"); // Provide immediate user feedback for this action.
            return; // Execute this step as part of the current feature logic.
        }

        pendingPayment = { amount, method, frequency }; // Save selection so confirm button can finalize same values.
        // Mirror selected values in modal so user can verify before confirming.
        demoAmount.textContent = amount; // Write computed text into the target element.
        demoMethod.textContent = method === "stripe" ? "Card (Stripe)" : "PayPal"; // Write computed text into the target element.
        demoFrequency.textContent = frequency === "monthly" ? "Monthly" : "One-time"; // Write computed text into the target element.
        demoModal.hidden = false; // Show modal only after all summary values are populated.
    };

    frequencyButtons.forEach((button) => {
        // Persist selected donation cadence (one-time or monthly).
        button.addEventListener("click", () => {
            frequencyButtons.forEach((item) => item.classList.remove("active")); // Ensure only one frequency looks selected.
            button.classList.add("active"); // Apply CSS state class for visual feedback.
            selectedFrequency = button.textContent.trim().toLowerCase() === "monthly" ? "monthly" : "one-time"; // Execute this step as part of the current feature logic.
        });
    });

    methodButtons.forEach((button) => {
        // Persist selected payment method.
        button.addEventListener("click", () => {
            methodButtons.forEach((item) => item.classList.remove("active")); // Ensure only one payment method looks selected.
            button.classList.add("active"); // Apply CSS state class for visual feedback.
            selectedMethod = button.getAttribute("data-payment-method") || "paypal"; // Read selected payment method.
        });
    });

    donateButtons.forEach((button) => {
        // Route donation action to either real checkout URL or local demo modal.
        button.addEventListener("click", () => {
            const amount = button.getAttribute("data-donation-amount"); // Donation amount from button data attribute.
            const url = paymentLinks[selectedMethod]?.[selectedFrequency]?.[amount || ""]; // Resolve checkout URL from current method+frequency+amount.

            if (!amount) {
                return; // Execute this step as part of the current feature logic.
            }

            if (!hasRealLink(url)) {
                // In assignment/demo mode, use modal confirmation instead of external checkout.
                openDemoModal(amount, selectedMethod, selectedFrequency); // Execute this step as part of the current feature logic.
                return; // Execute this step as part of the current feature logic.
            }

            // Open external hosted checkout in a safe new tab.
            window.open(url, "_blank", "noopener,noreferrer"); // Open external checkout securely in new tab.
        });
    });

    if (demoConfirm) {
        demoConfirm.addEventListener("click", () => {
            if (!pendingPayment) {
                closeDemoModal(); // Reset modal state when no pending transaction exists.
                return; // Execute this step as part of the current feature logic.
            }

            // Simulate successful payment confirmation for frontend-only assignments.
            alert(
                "Demo payment confirmed: £" + pendingPayment.amount +
                " via " + (pendingPayment.method === "stripe" ? "Card (Stripe)" : "PayPal") +
                " (" + (pendingPayment.frequency === "monthly" ? "Monthly" : "One-time") + ")"
            ); // Execute this step as part of the current feature logic.
            closeDemoModal(); // Hide modal and clear pending transaction after confirmation.
        });
    }

    // Close modal from cancel button or backdrop click.
    demoCloseButtons.forEach((button) => {
        button.addEventListener("click", closeDemoModal); // Bind user interaction handler.
    });
}

setupDonationPayments(); // Initialize this page feature immediately.

// Membership page: collect form details, then simulate hosted payment checkout.
function setupMembershipPayments() {
    const membershipForm = document.getElementById("membershipJoinForm");
    const paymentCard = document.getElementById("membership-payment");

    if (!membershipForm || !paymentCard) {
        return;
    }

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

    let selectedPlan = "Individual";
    let selectedAmount = "25";
    let selectedMethod = "paypal";
    let pendingMembershipPayment = null;

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

    const hasRealLink = (url) => {
        return Boolean(url) && !url.includes("placeholder");
    };

    const updateSummary = () => {
        if (selectedPlanText) {
            selectedPlanText.textContent = selectedPlan;
        }

        if (selectedAmountText) {
            selectedAmountText.textContent = selectedAmount;
        }
    };

    const closeDemoModal = () => {
        if (!demoModal) {
            return;
        }

        demoModal.hidden = true;
        pendingMembershipPayment = null;
    };

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
            selectedPlan = button.getAttribute("data-membership-plan") || "Individual";
            selectedAmount = button.getAttribute("data-membership-price") || "25";
            updateSummary();
        });
    });

    methodButtons.forEach((button) => {
        button.addEventListener("click", () => {
            methodButtons.forEach((item) => item.classList.remove("active"));
            button.classList.add("active");
            selectedMethod = button.getAttribute("data-membership-payment-method") || "paypal";
        });
    });

    membershipForm.addEventListener("submit", (event) => {
        event.preventDefault();
        paymentCard.hidden = false;
        paymentCard.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    if (payNowButton) {
        payNowButton.addEventListener("click", () => {
            const url = membershipPaymentLinks[selectedMethod]?.[selectedAmount];

            if (!hasRealLink(url)) {
                openDemoModal();
                return;
            }

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


