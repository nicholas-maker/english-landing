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

    // Получаем элементы тостов
    const successToastElement = document.getElementById('successToast');
    const errorToastElement = document.getElementById('errorToast');
    const successToastBody = successToastElement.querySelector('.toast-body');
    const errorToastBody = errorToastElement.querySelector('.toast-body');

    try {
        // Отправляем POST-запрос на наш Flask-бэкенд
        const response = await fetch('https://defabio.pythonanywhere.com/send-email', { // !!! ВАЖНО: Убедитесь, что URL правильный !!!

            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            successToastBody.textContent = result.message; // Вставляем текст успеха
            const successToast = new bootstrap.Toast(successToastElement); // Инициализируем тост
            successToast.show(); // Показываем тост

            this.reset(); // Очищаем форму

            // Закрываем модальное окно после успешной отправки
            const enrollModal = bootstrap.Modal.getInstance(document.getElementById('enrollModal'));
            if (enrollModal) {
                enrollModal.hide();
            }
        } else {
            errorToastBody.textContent = 'Ошибка: ' + result.message; // Вставляем текст ошибки
            const errorToast = new bootstrap.Toast(errorToastElement); // Инициализируем тост
            errorToast.show(); // Показываем тост
        }
    } catch (error) {
        console.error('Ошибка сети или сервера:', error);
        errorToastBody.textContent = 'Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз.';
        const errorToast = new bootstrap.Toast(errorToastElement);
        errorToast.show();
    }
});
