document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search");
    const orderCards = document.querySelectorAll(".order-card");
    const categoryCheckboxes = document.querySelectorAll(".category-checkbox");
    const subcategoryCheckboxes = document.querySelectorAll(".subcategory-checkbox");

    searchInput.addEventListener("input", function () {
        const searchText = this.value.toLowerCase();
        orderCards.forEach(card => {
            const title = card.querySelector("h3").textContent.toLowerCase();
            card.style.display = title.includes(searchText) ? "block" : "none";
        });
    });

    function applyFilters() {
        let activeCategories = new Set();
        let activeSubcategories = new Set();

        categoryCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                activeCategories.add(checkbox.dataset.category);
            }
        });

        subcategoryCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                activeSubcategories.add(checkbox.dataset.subcategory);
            }
        });

        orderCards.forEach(card => {
            const category = card.dataset.category;
            const subcategory = card.dataset.subcategory;
            if (
                (activeCategories.size === 0 || activeCategories.has(category)) &&
                (activeSubcategories.size === 0 || activeSubcategories.has(subcategory))
            ) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    }

    categoryCheckboxes.forEach(checkbox => checkbox.addEventListener("change", applyFilters));
    subcategoryCheckboxes.forEach(checkbox => checkbox.addEventListener("change", applyFilters));

    document.querySelector(".mobile-filter-button").addEventListener("click", function () {
        document.querySelector(".sidebar").classList.toggle("active");
    });
});
