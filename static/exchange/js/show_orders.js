let user_id = 1357975325
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
    const responseForm = document.getElementById("responseForm");
    const responseText = document.getElementById("responseText");

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
});

