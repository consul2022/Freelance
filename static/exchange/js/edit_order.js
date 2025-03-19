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

// Объект с подкатегориями для каждой сферы деятельности
const subactivities = {
  "development": [
    { value: "development_all_inclusive", label: "Сайты «под ключ»" },
    { value: "development_backend", label: "Бэкенд" },
    { value: "development_frontend", label: "Фронтенд" },
    { value: "development_prototyping", label: "Прототипирование" },
    { value: "development_ios", label: "iOS" },
    { value: "development_android", label: "Android" },
    { value: "development_desktop", label: "Десктопное ПО" },
    { value: "development_bots", label: "Боты и парсинг данных" },
    { value: "development_games", label: "Разработка игр" },
    { value: "development_1c_dev", label: "1С-программирование" },
    { value: "development_scripts", label: "Скрипты и плагины" },
    { value: "development_voice_interfaces", label: "Голосовые интерфейсы" },
    { value: "development_other", label: "Разное" }
  ],
  "testing": [
    { value: "testing_sites", label: "Сайты" },
    { value: "testing_mobile", label: "Мобайл" },
    { value: "testing_software", label: "Софт" }
  ],
  "administration": [
    { value: "admin_servers", label: "Серверы" },
    { value: "admin_network", label: "Компьютерные сети" },
    { value: "admin_databases", label: "Базы данных" },
    { value: "admin_security", label: "Защита ПО и безопасность" },
    { value: "admin_other", label: "Разное" }
  ],
  "design": [
    { value: "design_sites", label: "Сайты" },
    { value: "design_landings", label: "Лендинги" },
    { value: "design_logos", label: "Логотипы" },
    { value: "design_illustrations", label: "Рисунки и иллюстрации" },
    { value: "design_mobile", label: "Мобильные приложения" },
    { value: "design_icons", label: "Иконки" },
    { value: "design_polygraphy", label: "Полиграфия" },
    { value: "design_banners", label: "Баннеры" },
    { value: "design_graphics", label: "Векторная графика" },
    { value: "design_corporate_identity", label: "Фирменный стиль" },
    { value: "design_presentations", label: "Презентации" },
    { value: "design_modeling", label: "3D" },
    { value: "design_animation", label: "Анимация" },
    { value: "design_photo", label: "Обработка фото" },
    { value: "design_other", label: "Разное" }
  ],
  "content": [
    { value: "content_copywriting", label: "Копирайтинг" },
    { value: "content_rewriting", label: "Рерайтинг" },
    { value: "content_audio", label: "Расшифровка аудио и видео" },
    { value: "content_article", label: "Статьи и новости" },
    { value: "content_scenarios", label: "Сценарии" },
    { value: "content_naming", label: "Нейминг и слоганы" },
    { value: "content_correction", label: "Редактура и корректура" },
    { value: "content_translations", label: "Переводы" },
    { value: "content_coursework", label: "Рефераты, дипломы, курсовые" },
    { value: "content_specification", label: "Техническая документация" },
    { value: "content_management", label: "Контент-менеджмент" },
    { value: "content_other", label: "Разное" }
  ],
  "marketing": [
    { value: "marketing_smm", label: "SMM" },
    { value: "marketing_seo", label: "SEO" },
    { value: "marketing_context", label: "Контекстная реклама" },
    { value: "marketing_email", label: "E-mail маркетинг" },
    { value: "marketing_research", label: "Исследования рынка и опросы" },
    { value: "marketing_sales", label: "Продажи и генерация лидов" },
    { value: "marketing_pr", label: "PR-менеджмент" },
    { value: "marketing_other", label: "Разное" }
  ],
  "other": [
    { value: "other_audit_analytics", label: "Аудит и аналитика" },
    { value: "other_consulting", label: "Консалтинг" },
    { value: "other_jurisprudence", label: "Юриспруденция" },
    { value: "other_accounting", label: "Бухгалтерские услуги" },
    { value: "other_audio", label: "Аудио" },
    { value: "other_video", label: "Видео" },
    { value: "other_engineering", label: "Инженерия" },
    { value: "other_other", label: "Разное" }
  ]
};

// Функция загрузки подкатегорий по выбранной сфере
function loadSubactivities(activity, selectedSubactivity = null) {
  const subactivitySelect = document.getElementById('subactivity');
  subactivitySelect.innerHTML = '';
  if (subactivities[activity]) {
    subactivities[activity].forEach(item => {
      const option = document.createElement('option');
      option.value = item.value;
      option.textContent = item.label;
      if (selectedSubactivity && item.value === selectedSubactivity) {
        option.selected = true;
      }
      subactivitySelect.appendChild(option);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Инициализация Telegram WebApp (если используется)
  try {
    user_id = window.Telegram.WebApp.initDataUnsafe.user.id;
    function isDesktop() {
      const userAgent = navigator.userAgent.toLowerCase();
      return userAgent.includes("windows") || userAgent.includes("macintosh") || userAgent.includes("linux");
    }
    if (!isDesktop()) {
      document.body.style.marginTop = "90px";
      window.Telegram.WebApp.requestFullscreen();
    }
  } catch(e) {
    console.error("Could not get user ID from Telegram Web App", e);
  }

  // Инициализация подкатегорий с учётом сохранённого значения
  const activitySelect = document.getElementById('activity');
  loadSubactivities(activitySelect.value, initialSubactivity);
  activitySelect.addEventListener('change', function() {
    loadSubactivities(this.value);
  });

  // Работа с тегами – механизм, аналогичный create_order.js
  const availableTags = Array.from(document.querySelectorAll('#available-tags .tag'))
                             .map(el => el.getAttribute('data-value'));
  const tagSearchInput = document.getElementById('tag-search');
  const tagsDropdown = document.getElementById('tags-dropdown');
  const selectedTagsContainer = document.getElementById('selected-tags');
  const tagsInputHidden = document.getElementById('tags-input');
  let selectedTags = tagsInputHidden.value ? tagsInputHidden.value.split(',') : [];

  function updateTagsInput() {
    tagsInputHidden.value = selectedTags.join(',');
  }

  function renderSelectedTags() {
    selectedTagsContainer.innerHTML = '';
    selectedTags.forEach((tag, index) => {
      const tagEl = document.createElement('span');
      tagEl.className = 'tag';
      tagEl.textContent = tag;
      tagEl.addEventListener('click', () => {
        selectedTags.splice(index, 1);
        renderSelectedTags();
        updateTagsInput();
      });
      selectedTagsContainer.appendChild(tagEl);
    });
  }

  renderSelectedTags();

  function updateDropdown() {
    const query = tagSearchInput.value.trim().toLowerCase();
    const filteredTags = availableTags.filter(tag =>
      tag.toLowerCase().includes(query) && !selectedTags.includes(tag)
    );
    tagsDropdown.innerHTML = '';
    if (filteredTags.length > 0) {
      filteredTags.forEach(tag => {
        const item = document.createElement('div');
        item.className = 'dropdown-item';
        item.textContent = tag;
        item.addEventListener('click', () => {
          selectedTags.push(tag);
          renderSelectedTags();
          updateTagsInput();
          tagSearchInput.value = '';
          tagsDropdown.style.display = 'none';
        });
        tagsDropdown.appendChild(item);
      });
      tagsDropdown.style.display = 'block';
    } else {
      tagsDropdown.style.display = 'none';
    }
  }

  tagSearchInput.addEventListener('input', updateDropdown);
  tagSearchInput.addEventListener('focus', updateDropdown);

  document.addEventListener('click', (e) => {
    if (!tagSearchInput.contains(e.target) && !tagsDropdown.contains(e.target)) {
      tagsDropdown.style.display = 'none';
    }
  });

  // Обработчик кнопки "Назад"
  document.getElementById("back").addEventListener('click', function(event) {
    event.preventDefault();
    window.location.href = "/exchange/office";
  });

  // Обработка отправки формы редактирования заказа
  const editOrderForm = document.getElementById("edit-order-form");
  editOrderForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    const formData = new URLSearchParams();
    formData.append('name', document.getElementById("name").value.trim());
    formData.append('description', document.getElementById("description").value.trim());
    formData.append('price', document.getElementById("price").value.trim());
    formData.append('activity', document.getElementById("activity").value.trim());
    formData.append('subactivity', document.getElementById("subactivity").value.trim());
    formData.append('tags', tagsInputHidden.value);

    fetch(editOrderForm.action, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-CSRFToken": csrfToken
      },
      body: formData.toString(),
      credentials: "include"
    })
    .then(response => {
      if (response.redirected) {
        window.location.href = response.url;
      } else {
        return response.text();
      }
    })
    .then(data => {
      alert("Заказ успешно отредактирован!");
    })
    .catch(error => {
      console.error("Ошибка при редактировании заказа:", error);
      alert("Произошла ошибка при редактировании заказа. Попробуйте ещё раз.");
    });
  });
});
