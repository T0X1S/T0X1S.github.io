// ============================================================================
// ЗАДАНИЕ 1: Получение данных из пользовательских форм
// ============================================================================

document.getElementById('getDataBtn').addEventListener('click', function() {
    const form = document.getElementById('userForm');
    const formData = new FormData(form);
    
    // Получаем значения из формы
    const name = formData.get('name') || 'Не указано';
    const email = formData.get('email') || 'Не указано';
    const gender = formData.get('gender') || 'Не указано';
    
    // Получаем массив выбранных интересов
    const interests = formData.getAll('interests');
    const interestsText = interests.length > 0 ? interests.join(', ') : 'Не указаны';
    
    const country = formData.get('country') || 'Не указана';
    const message = formData.get('message') || 'Не указано';
    
    // Формируем вывод
    const output = `
        <h3>Данные формы:</h3>
        <p><strong>Имя:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Пол:</strong> ${gender}</p>
        <p><strong>Интересы:</strong> ${interestsText}</p>
        <p><strong>Страна:</strong> ${country}</p>
        <p><strong>Сообщение:</strong> ${message}</p>
    `;
    
    document.getElementById('formOutput').innerHTML = output;
});

// ============================================================================
// ЗАДАНИЕ 2: Валидация пользовательских форм
// ============================================================================

// 2.1 Валидация через атрибуты HTML5
document.getElementById('html5Form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (this.checkValidity()) {
        document.getElementById('validationOutput').innerHTML = 
            '<p class="success">HTML5 валидация пройдена успешно!</p>';
    } else {
        document.getElementById('validationOutput').innerHTML = 
            '<p class="error">Пожалуйста, заполните все поля корректно.</p>';
    }
});

// 2.2 Валидация через JavaScript с регулярными выражениями
document.getElementById('validateBtn').addEventListener('click', function() {
    const name = document.getElementById('jsName').value.trim();
    const email = document.getElementById('jsEmail').value.trim();
    const password = document.getElementById('jsPassword').value;
    
    let isValid = true;
    let output = '';
    
    // Очистка предыдущих ошибок
    document.getElementById('nameError').textContent = '';
    document.getElementById('emailError').textContent = '';
    document.getElementById('passwordError').textContent = '';
    
    // Проверка имени
    if (!name) {
        document.getElementById('nameError').textContent = 'Имя обязательно для заполнения';
        isValid = false;
    } else if (name.length < 2) {
        document.getElementById('nameError').textContent = 'Имя должно содержать минимум 2 символа';
        isValid = false;
    }
    
    // Проверка email с помощью регулярного выражения
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        document.getElementById('emailError').textContent = 'Email обязателен для заполнения';
        isValid = false;
    } else if (!emailRegex.test(email)) {
        document.getElementById('emailError').textContent = 'Введите корректный email адрес';
        isValid = false;
    }
    
    // Проверка пароля
    if (!password) {
        document.getElementById('passwordError').textContent = 'Пароль обязателен для заполнения';
        isValid = false;
    } else if (password.length < 8) {
        document.getElementById('passwordError').textContent = 'Пароль должен содержать минимум 8 символов';
        isValid = false;
    }
    
    // Вывод результата
    if (isValid) {
        output = '<p class="success">JavaScript валидация пройдена успешно!</p>';
    } else {
        output = '<p class="error">Пожалуйста, исправьте ошибки в форме.</p>';
    }
    
    document.getElementById('validationOutput').innerHTML = output;
});

// ============================================================================
// ЗАДАНИЕ 3: Работа с объектом RegExp и регулярные выражения
// ============================================================================

// 3.1 Метод test() - проверка соответствия строки шаблону
document.getElementById('testBtn').addEventListener('click', function() {
    const input = document.getElementById('testInput').value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const result = emailRegex.test(input);
    
    document.getElementById('testResult').textContent = 
        `Результат проверки: ${result ? 'Соответствует шаблону email' : 'Не соответствует шаблону email'}`;
});

// 3.2 Метод exec() - поиск всех совпадений в тексте
document.getElementById('execBtn').addEventListener('click', function() {
    const text = document.getElementById('execText').value;
    const emailRegex = /[^\s@]+@[^\s@]+\.[^\s@]+/g;
    let matches = [];
    let match;
    
    // Используем цикл для поиска всех совпадений
    while ((match = emailRegex.exec(text)) !== null) {
        matches.push(match[0]);
    }
    
    document.getElementById('execResult').textContent = 
        `Найденные email адреса: ${matches.length > 0 ? matches.join(', ') : 'не найдены'}`;
});

// 3.3 Метод match() - поиск всех вхождений шаблона
document.getElementById('matchBtn').addEventListener('click', function() {
    const text = document.getElementById('matchText').value;
    const numberRegex = /\d+/g;
    const matches = text.match(numberRegex);
    
    document.getElementById('matchResult').textContent = 
        `Найденные числа: ${matches ? matches.join(', ') : 'не найдены'}`;
});

// 3.4 Метод search() - поиск позиции первого совпадения
document.getElementById('searchBtn').addEventListener('click', function() {
    const text = document.getElementById('searchText').value;
    const pattern = document.getElementById('searchPattern').value;
    
    try {
        const regex = new RegExp(pattern);
        const position = text.search(regex);
        
        document.getElementById('searchResult').textContent = 
            position !== -1 
            ? `Шаблон найден на позиции: ${position}` 
            : 'Шаблон не найден в тексте';
    } catch (e) {
        document.getElementById('searchResult').textContent = 
            `Ошибка в регулярном выражении: ${e.message}`;
    }
});

// 3.5 Метод replace() - замена найденных фрагментов
document.getElementById('replaceBtn').addEventListener('click', function() {
    const text = document.getElementById('replaceText').value;
    const digitRegex = /\d/g;
    const result = text.replace(digitRegex, 'X');
    
    document.getElementById('replaceResult').textContent = 
        `Результат замены: ${result}`;
});

// 3.6 Метод split() - разделение строки по шаблону
document.getElementById('splitBtn').addEventListener('click', function() {
    const text = document.getElementById('splitText').value;
    const separatorRegex = /[,;.\s]+/;
    const parts = text.split(separatorRegex);
    
    document.getElementById('splitResult').textContent = 
        `Разделенные элементы:\n${parts.map((item, index) => `${index + 1}. ${item}`).join('\n')}`;
});