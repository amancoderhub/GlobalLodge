(() => {
    const TAX_RATE = 0.18;
    const taxToggle = document.querySelector("[data-tax-toggle]");
    const listingPrices = document.querySelectorAll("[data-listing-price]");
    const currencyFormatter = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });

    const updateDisplayedPrices = (includeTax) => {
        listingPrices.forEach((priceContainer) => {
            const basePrice = Number(priceContainer.dataset.listingPrice);

            if (!Number.isFinite(basePrice)) return;

            const displayedPrice = includeTax ? basePrice * (1 + TAX_RATE) : basePrice;
            const priceElement = priceContainer.querySelector(".fs-5");
            const card = priceContainer.closest(".listing-card");
            const taxInfo = card?.querySelector(".tax-info");

            if (priceElement) priceElement.textContent = currencyFormatter.format(displayedPrice);
            if (taxInfo) taxInfo.hidden = !includeTax;
        });
    };

    if (taxToggle) {
        taxToggle.addEventListener("change", () => updateDisplayedPrices(taxToggle.checked));
    }

    const filterBox = document.getElementById("filters");
    if (filterBox) {
        filterBox.addEventListener("wheel", (event) => {
            if (event.deltaY === 0) return;

            event.preventDefault();
            filterBox.scrollLeft += event.deltaY;
        }, { passive: false });
    }
})();
