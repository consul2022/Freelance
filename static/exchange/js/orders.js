let user_id;
document.addEventListener('touchstart', function(event) {
    const activeElement = document.activeElement;
    if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
        if (!activeElement.contains(event.target)) {
            activeElement.blur();
        }
        if (event.target.tagName === 'BUTTON') {
            event.target.click();
        }
    }
});

try {
    user_id = window.Telegram.WebApp.initDataUnsafe.user.id;
    function isDesktop() {
        const userAgent = navigator.userAgent.toLowerCase();
        return userAgent.includes("windows") || userAgent.includes("macintosh") || userAgent.includes("linux");
    }
    console.log(isDesktop());
    if (!isDesktop()) {
        document.body.style.marginTop = "90px";
        document.querySelector(".sidebar").style.paddingTop = "90px";
        window.Telegram.WebApp.requestFullscreen();
    }
} catch (e) {
    console.error("Could not get user ID from Telegram Web App");
}

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search");
    const orderCards = document.querySelectorAll(".order-card");
    const categoryCheckboxes = document.querySelectorAll(".category-checkbox");
    const subcategoryCheckboxes = document.querySelectorAll(".subcategory-checkbox");

    // Функция обновления счетчика отображаемых заказов
    function updateOrdersCount() {
        let visibleCount = 0;
        orderCards.forEach(card => {
            const parent = card.closest('a');
            if (parent.style.display !== "none") {
                visibleCount++;
            }
        });
        const ordersHeader = document.querySelector(".orders-header h2");
        ordersHeader.textContent = `Заказы (${visibleCount})`;
    }

    // Функция фильтрации заказов
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
            const parent = card.closest('a');
            if (
                (activeCategories.size === 0 || activeCategories.has(category)) &&
                (activeSubcategories.size === 0 || activeSubcategories.has(subcategory))
            ) {
                parent.style.display = "block";
            } else {
                parent.style.display = "none";
            }
        });
        updateOrdersCount();
    }

    // При изменении чекбокса категории — обновляем подкатегории
    categoryCheckboxes.forEach(checkbox => {
        checkbox.addEventListener("change", function () {
            const parentCategory = this.closest(".category");
            const childSubCheckboxes = parentCategory.querySelectorAll(".subcategory-checkbox");
            childSubCheckboxes.forEach(sub => sub.checked = this.checked);
            applyFilters();
        });
    });

    // При изменении чекбокса подкатегории — обновляем состояние родительской категории
    subcategoryCheckboxes.forEach(checkbox => {
        checkbox.addEventListener("change", function () {
            const parentCategory = this.closest(".category");
            const categoryCheckbox = parentCategory.querySelector(".category-checkbox");
            const childSubCheckboxes = parentCategory.querySelectorAll(".subcategory-checkbox");
            // Если все подкатегории отмечены, то отмечаем и категорию
            let allChecked = true;
            childSubCheckboxes.forEach(sub => {
                if (!sub.checked) allChecked = false;
            });
            categoryCheckbox.checked = allChecked;
            applyFilters();
        });
    });

    // Поиск по заказам
    searchInput.addEventListener("input", function () {
        const searchText = this.value.toLowerCase();
        orderCards.forEach(card => {
            const title = card.querySelector("h3").textContent.toLowerCase();
            const parent = card.closest('a');
            parent.style.display = title.includes(searchText) ? "block" : "none";
        });
        updateOrdersCount();
    });
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
}
