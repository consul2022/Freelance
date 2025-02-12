document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search");
    const orderCards = document.querySelectorAll(".order-card");
    const categoryCheckboxes = document.querySelectorAll(".category-checkbox");
    const subcategoryCheckboxes = document.querySelectorAll(".subcategory-checkbox");

    // Поиск по заказам
    searchInput.addEventListener("input", function () {
        const searchText = this.value.toLowerCase();
        orderCards.forEach(card => {
            const title = card.querySelector("h3").textContent.toLowerCase();
            card.style.display = title.includes(searchText) ? "block" : "none";
        });
    });

    // Фильтрация заказов по категориям и подкатегориям
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
});

// Переключение видимости фильтров на мобильных устройствах
function toggleFilters() {
    const sidebar = document.querySelector(".sidebar");
    const overlay = document.querySelector(".sidebar-overlay");
    sidebar.classList.toggle("active");
    overlay.style.display = sidebar.classList.contains("active") ? "block" : "none";
}

// Сворачивание/разворачивание списка подкатегорий без изменения текста пункта
function toggleSubcategories(labelElement) {
    const categoryItem = labelElement.closest(".category");
    const subcategoriesList = categoryItem.querySelector(".subcategories");
    subcategoriesList.classList.toggle("active");
//    if (subcategoriesList.style.display === "none" || subcategoriesList.style.display === "") {
//        subcategoriesList.style.display = "block";
//    } else {
//        subcategoriesList.style.display = "none";
//    }
}
