// Задайте user_id пользователя (например, полученный из авторизации)

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
        window.Telegram.WebApp.requestFullscreen();
    }
} catch (e) {
    console.error("Could not get user ID from Telegram Web App");
}



function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Проверяем, начинается ли строка cookie с "name="
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


document.addEventListener('DOMContentLoaded', () => {
  fetchOrders();
});

// Получение заказов по user_id
function fetchOrders() {
  fetch(`/exchange/user/orders/${user_id}/`)
    .then(response => response.json())
    .then(data => {
      renderOrders(data.orders);
    })
    .catch(error => {
      console.error('Ошибка при получении заказов:', error);
    });
}

// Отрисовка карточек заказов
function renderOrders(orders) {
  const ordersList = document.getElementById('orders-list');
  ordersList.innerHTML = '';
  if (!orders.length) {
    ordersList.innerHTML = '<p>Заказы не найдены.</p>';
    return;
  }
  const truncate = (str, num) => {
    return str.length > num ? str.slice(0, num) + "..." : str;
};
  orders.forEach(order => {
    const orderCard = document.createElement('div');
    orderCard.className = 'order-card';
    orderCard.setAttribute('data-order-id', order.id);
    orderCard.innerHTML = `
      <div class="order-header">
        <h3>${order.name}</h3>
        <span class="order-price">${parseFloat(order.price).toFixed(0)} ₽</span>
      </div>
      <p class="order-description">${truncate(order.description, 100)}</p>
      <div class="order-meta">
        <span class="order-responses">откликов: ${order.response_count || 0}</span>
        <span class="order-time">${order.created_at}</span>
      </div>
      <div class="tags">
        ${order.tags.map(tag => `<span class="tag">${tag}</span>`).join(' ')}
      </div>
      <div class="order-actions">
        <button onclick="editOrder(${order.id})">Редактировать</button>
        <button onclick="deleteOrder(${order.id})">Удалить</button>
      </div>
    `;
    ordersList.appendChild(orderCard);
  });
}

// Редактирование заказа – перенаправление на страницу редактирования
function editOrder(orderId) {
  window.location.href = `/exchange/order/edit/${orderId}/`;
}

// Удаление заказа
function deleteOrder(orderId) {
  if (confirm('Вы уверены, что хотите удалить этот заказ?')) {
    const csrftoken = getCookie('csrftoken');
    fetch(`/exchange/user/orders/delete/${orderId}/`, { method: 'DELETE', headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken
            },credentials: "include"})
      .then(response => {
        if (response.ok) {
          fetchOrders(); // Обновление списка заказов после удаления
        } else {
          alert('Не удалось удалить заказ.');
        }
      })
      .catch(error => {
        console.error('Ошибка при удалении заказа:', error);
      });
  }
}
