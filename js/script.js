document.getElementById('enrollmentForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Предотвращаем стандартную отправку формы и перезагрузку страницы

    const formData = new FormData(this); // Получаем данные формы
    const data = {};
    // Преобразуем FormData в обычный JavaScript-объект
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }

    // Специально обрабатываем чекбокс, чтобы получить true/false
    data.consent = this.elements.consent.checked;

    try {
        // Отправляем POST-запрос на наш Flask-бэкенд
        const response = await fetch('http://127.0.0.1:5000/send-email', { // !!! ВАЖНО: Убедитесь, что URL правильный !!!
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Указываем, что отправляем JSON
            },
            body: JSON.stringify(data) // Преобразуем JS-объект в JSON-строку
        });

        const result = await response.json(); // Ожидаем JSON-ответ от бэкенда

        if (response.ok) { // Если HTTP-статус 2xx (например, 200 OK)
            alert(result.message); // Показываем сообщение об успехе ("Заявка успешно отправлена!")
            this.reset(); // Очищаем форму
            // Если форма в модальном окне Bootstrap, можно закрыть его
            // const modal = bootstrap.Modal.getInstance(document.getElementById('yourModalModalId'));
            // if (modal) modal.hide();
        } else { // Если HTTP-статус 4xx или 5xx (ошибка)
            alert('Ошибка: ' + result.message); // Показываем сообщение об ошибке
        }
    } catch (error) {
        console.error('Ошибка сети или сервера:', error); // Выводим ошибку в консоль браузера
        alert('Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз.');
    }
});