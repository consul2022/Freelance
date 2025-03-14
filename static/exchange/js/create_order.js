let user_id;

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

document.addEventListener('DOMContentLoaded', () => {
  try{
    user_id = window.Telegram.WebApp.initDataUnsafe.user.id;
    function isDesktop() {
        const userAgent = navigator.userAgent.toLowerCase();
        return userAgent.includes("windows") || userAgent.includes("macintosh") || userAgent.includes("linux");
    }
    console.log(isDesktop());
    if (!isDesktop()) {
        document.body.style.marginTop = "90px";
        window.Telegram.WebApp.requestFullscreen();
    }
   } catch(e){
     console.error(e);
   }
  const activitySelect = document.getElementById('activity');
  const subactivitySelect = document.getElementById('subactivity');

  const responseForm = document.getElementById("create-order-form");
  const nameText = document.getElementById("name");
  const descriptionText  = document.getElementById("description");
  const priceText  = document.getElementById("price");
  const activityText  = document.getElementById("activity");
  const subactivityText  = document.getElementById("subactivity");

  // Инициализация подкатегорий для выбранной сферы
  loadSubactivities(activitySelect.value);

  activitySelect.addEventListener('change', function() {
    loadSubactivities(this.value);
  });
  
  // Логика выбора тегов
  const tagsContainer = document.getElementById('tags-container');
  const tagsInput = document.getElementById('tags-input');
  
  // Назначаем обработчик клика для каждого тега
  tagsContainer.querySelectorAll('.tag').forEach(tagEl => {
    tagEl.addEventListener('click', function() {
      this.classList.toggle('active');
      updateTagsInput();
    });
  });

  // Функция обновления скрытого поля со списком выбранных тегов
  function updateTagsInput() {
    const selectedTags = Array.from(tagsContainer.querySelectorAll('.tag.active'))
      .map(el => el.getAttribute('data-value'));
    tagsInput.value = selectedTags.join(',');
  }

  responseForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const name = nameText.value.trim();
    const description = descriptionText.value.trim();
    const price = priceText.value.trim();
    const activity = activityText.value.trim();
    const subactivity = subactivityText.value.trim();
    const tags = tagsInput.value; // выбранные теги
    console.log(tags)

    // Получаем CSRF-токен для защиты POST-запроса
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    const formData = new URLSearchParams();
    formData.append('user_id', user_id);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('activity', activity);
    formData.append('subactivity', subactivity);
    formData.append('tags', tags);

    fetch(responseForm.action, {
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
      alert("Заказ создан успешно!");
      responseForm.reset();
      // Сброс активных тегов после успешной отправки формы
      tagsContainer.querySelectorAll('.tag.active').forEach(tagEl => tagEl.classList.remove('active'));
      updateTagsInput();
    })
    .catch(error => {
      console.error("Ошибка при создании заказа:", error);
      alert("Произошла ошибка при создании заказа. Попробуйте еще раз.");
    });
  });
});

// Функция загрузки подкатегорий по выбранной сфере
function loadSubactivities(activity) {
  const subactivitySelect = document.getElementById('subactivity');
  subactivitySelect.innerHTML = '';
  if (subactivities[activity]) {
    subactivities[activity].forEach(item => {
      const option = document.createElement('option');
      option.value = item.value;
      option.textContent = item.label;
      subactivitySelect.appendChild(option);
    });
  }
}
document.getElementById("back").addEventListener('click', function(event) {
event.preventDefault();
window.location.href = "/exchange/office"
})
