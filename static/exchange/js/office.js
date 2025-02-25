// Задайте tg_id пользователя (например, полученный из авторизации)
const tg_id = 123456789;

document.addEventListener('DOMContentLoaded', () => {
  fetchOrders();
});

// Получение заказов по tg_id
function fetchOrders() {
  fetch(`/user/orders/${tg_id}/`)
    .then(response => response.json())
    .then(data => {
      renderOrders(data);
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
  orders.forEach(order => {
    const orderCard = document.createElement('div');
    orderCard.className = 'order-card';
    orderCard.setAttribute('data-order-id', order.id);
    orderCard.innerHTML = `
      <div class="order-header">
        <h3>${order.name}</h3>
        <span class="order-price">${parseFloat(order.price).toFixed(0)} руб.</span>
      </div>
      <p class="order-description">${order.description}</p>
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
  window.location.href = `/edit_order/${orderId}/`;
}

// Удаление заказа
function deleteOrder(orderId) {
  if (confirm('Вы уверены, что хотите удалить этот заказ?')) {
    fetch(`/user/orders/${orderId}/`, { method: 'DELETE' })
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
