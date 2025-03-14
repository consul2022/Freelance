
let user_id;
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

document.addEventListener("DOMContentLoaded", function() {
    // Извлекаем order_id из URL. Предполагается, что URL содержит order_id, например: /orders/123/...
    const pathParts = window.location.pathname.split('/');
    // Предполагаем, что order_id находится в одном из сегментов URL и является числом
    const order_id = pathParts.find(part => /^\d+$/.test(part));
    const responseForm = document.getElementById("responseForm");
    const responseText = document.getElementById("responseText");
    const submitButton = responseForm ? responseForm.querySelector("button") : null;

    responseForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const response_message = responseText.value.trim();
        if (!response_message) {
            return;
        }
        // Получаем CSRF-токен для защиты POST-запроса
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

        const csrftoken = getCookie('csrftoken')
        const formData = new URLSearchParams();
        formData.append('response_message', response_message);
        formData.append('user_id', user_id);
        
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
            alert("Отклик успешно отправлен!");
            responseForm.reset();
        })
        .catch(error => {
            console.error("Ошибка при отправке отклика:", error);
            alert("Произошла ошибка при отправке отклика. Попробуйте еще раз.");
        });
    });
    fetch(`/exchange/user/responses/${user_id}/`)
        .then(response => response.json())
       .then(data => {
            let responses = [];
            if (Array.isArray(data)) {
                responses = data;
            } else if (data.responses && Array.isArray(data.responses)) {
                responses = data.responses;
            } else {
                responses = Object.values(data);
            }
            
            // Ищем отклик с нужным order_id
            const userResponse = responses.find(item => item.order_id.toString() === order_id);
            if (userResponse) {
                // Если отклик найден, делаем поле ввода readonly и блокируем кнопку отправки,
                // а также подставляем текст отклика в textarea
                responseText.value = userResponse.message;
                responseText.readOnly = true;
                if (submitButton) {
                    submitButton.disabled = true;
                }
            }
        })
        .catch(error => {
            console.error("Ошибка при получении откликов пользователя:", error);
        });
});

