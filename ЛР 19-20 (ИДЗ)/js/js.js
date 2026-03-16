// Отладочная информация
console.log('🔧 Загрузка скрипта js.js');
console.log('📁 Текущий URL:', window.location.href);

// Проверяем доступность JSON файла
fetch('products.json')
    .then(response => {
        console.log('📊 Статус JSON:', response.status);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => console.log('✅ JSON загружен успешно'))
    .catch(error => console.error('❌ Ошибка загрузки JSON:', error));
// ========== ЗАДАНИЕ №1: JSON И КОРЗИНА ИНТЕРНЕТ-МАГАЗИНА ==========

let products = [];
let cart = [];

// Встроенные данные товаров на случай если JSON не загрузится
const embeddedProducts = {
  "products": [
    {
      "id": 1,
      "name": "Side Bowls",
      "price": 45,
      "currency": "$",
      "description": "Hand-painted porcelain stackable bowls, designed for plating, eating, and scooping.",
      "image": "images/item1.jpg",
      "colors": ["#e09d81", "#cdc7b3", "#595752"],
      "category": "tableware",
      "inStock": true,
      "rating": 4.5
    },
    {
      "id": 2,
      "name": "Drinking Glasses",
      "price": 50,
      "currency": "$",
      "description": "Hand-made and stackable. Made from recycled glass and natural sand. Naturally colored, without dyes.",
      "image": "images/item2.jpg",
      "colors": ["#ccbd9e", "#b55900", "#5b653b", "#ffffff"],
      "category": "tableware",
      "inStock": true,
      "rating": 4.8
    },
    {
      "id": 3,
      "name": "Main Plates",
      "price": 50,
      "currency": "$",
      "description": "Hand-painted porcelain plates, stackable and designed for big appetites.",
      "image": "images/item3.jpg",
      "colors": ["#e09d81", "#cdc7b3", "#595752"],
      "category": "tableware",
      "inStock": true,
      "rating": 4.6
    },
    {
      "id": 4,
      "name": "Always Pan",
      "price": 145,
      "currency": "$",
      "description": "Thoughtfully designed to be the perfect size and shape to do the work of eight pieces of traditional cookware.",
      "image": "images/item4.jpg",
      "colors": ["#e09d81", "#748ea1", "#b76d47", "#7d836e", "#c33636", "#cdc7b3", "#595752", "#d3c2ca"],
      "category": "cookware",
      "inStock": true,
      "rating": 4.9
    },
    {
      "id": 5,
      "name": "Serving Platter",
      "price": 65,
      "currency": "$",
      "description": "Large ceramic serving platter perfect for family dinners and entertaining guests.",
      "image": "images/item5.jpg",
      "colors": ["#e09d81", "#cdc7b3"],
      "category": "tableware",
      "inStock": true,
      "rating": 4.4
    }
  ]
};

// Загрузка товаров
// Загрузка товаров
async function loadProducts() {
    try {
        console.log('🔄 Загрузка товаров...');
        
        // Пытаемся загрузить из JSON файла
        try {
            const response = await fetch('products.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            products = data.products;
            console.log('✅ JSON загружен успешно');
        } catch (fetchError) {
            console.log('📁 Используем встроенные товары:', fetchError.message);
            products = embeddedProducts.products;
        }
        
        renderProducts();
        
    } catch (error) {
        console.log('❌ Ошибка при загрузке товаров:', error.message);
        products = embeddedProducts.products;
        renderProducts();
    }
    updateCartCount();
}

// Рендеринг товаров из JSON
function renderProductsFromJSON() {
    const productContainer = document.getElementById('products-container');
    if (!productContainer) {
        console.error('❌ Контейнер товаров не найден');
        return;
    }

    if (products && products.length > 0) {
        // Заменяем содержимое контейнера товарами из JSON
        productContainer.innerHTML = `
            <div class="row">
                ${products.map(product => `
                    <div class="main_product-item col-md-6 col-lg-3" data-id="${product.id}">
                        <img class="main_product-img" src="${product.image}" alt="${product.name}" 
                             onerror="this.src='https://via.placeholder.com/250x250/fbf6ea/35312e?text=Product+Image'">
                        <h3 class="main_product-title">${product.name}</h3>
                        <p class="main_product-price">
                            ${product.name.includes('Pan') || product.name.includes('Pot') ? 
                              `${product.currency}${product.price}` : 
                              `SET OF 4 - ${product.currency}${product.price}`}
                        </p>
                        <p class="main_product-text">${product.description}</p>
                        <div class="main_product-colors">
                            ${product.colors.map((color, index) => `
                                <button class="btn-second-main" 
                                        style="background-color: ${color}; 
                                               border: ${color === '#ffffff' || color === '#fff' ? '1px solid #ccc' : 'none'};"
                                        aria-label="Color ${index + 1}"></button>
                            `).join('')}
                        </div>
                        <button class="add-to-cart-btn" data-id="${product.id}">
                            Add to Cart
                        </button>
                    </div>
                `).join('')}
            </div>
        `;

        addCartEventListeners();
        initializeAnimations();
        console.log('✅ Товары из JSON успешно отрисованы');
    }
}

// Добавление кнопок корзины к статическим товарам
function addCartButtonsToStaticProducts() {
    console.log('🛒 Добавляем кнопки корзины к статическим товарам');
    const staticProducts = document.querySelectorAll('.main_product-item');
    
    staticProducts.forEach((item, index) => {
        // Проверяем, есть ли уже кнопка
        if (!item.querySelector('.add-to-cart-btn')) {
            const addBtn = document.createElement('button');
            addBtn.className = 'add-to-cart-btn';
            addBtn.textContent = 'Add to Cart';
            addBtn.setAttribute('data-id', index + 1);
            
            addBtn.addEventListener('click', function() {
                const productId = parseInt(this.dataset.id);
                addToCart(productId);
            });
            
            item.appendChild(addBtn);
        }
    });
    
    // Добавляем обработчики для статических кнопок
    addCartEventListeners();
}

// Отображение товаров 
function renderProducts() {
    console.log('🎨 Отрисовка товаров...');
    
    // Ищем контейнер для товаров
    const productContainer = document.getElementById('products-container');
    if (!productContainer) {
        console.error('❌ Контейнер товаров не найден');
        return;
    }

    if (products && products.length > 0) {
        // Очищаем контейнер
        productContainer.innerHTML = '';
        
        // Создаем строку для Bootstrap
        const productsHTML = `
            <div class="row">
                ${products.map(product => `
                    <div class="main_product-item col-md-6 col-lg-3" data-id="${product.id}">
                        <img class="main_product-img" src="${product.image}" alt="${product.name}" 
                             onerror="this.src='https://via.placeholder.com/250x250/fbf6ea/35312e?text=Product+Image'" 
                             style="width: 250px; height: 250px; border-radius: 50%; object-fit: cover; margin-bottom: 15px;">
                        <h3 class="main_product-title">${product.name}</h3>
                        <p class="main_product-price">
                            ${product.category === 'cookware' ? 
                              `${product.currency}${product.price}` : 
                              `SET OF 4 - ${product.currency}${product.price}`}
                        </p>
                        <p class="main_product-text">${product.description}</p>
                        <div class="main_product-colors">
                            ${product.colors.map((color, index) => `
                                <button class="btn-second-main" 
                                        style="background-color: ${color}; 
                                               width: 20px; 
                                               height: 20px; 
                                               border-radius: 10px;
                                               border: ${color === '#ffffff' || color === '#fff' ? '1px solid #ccc' : 'none'};
                                               margin: 2px;"
                                        aria-label="Color ${index + 1}"
                                        data-color="${color}"></button>
                            `).join('')}
                        </div>
                        <button class="add-to-cart-btn" data-id="${product.id}">
                            Add to Cart
                        </button>
                    </div>
                `).join('')}
            </div>
        `;
        
        productContainer.innerHTML = productsHTML;

        // Добавляем обработчики для новых кнопок
        addCartEventListeners();
        console.log('✅ Товары успешно отрисованы:', products.length);
        
        // Инициализируем анимации для новых элементов
        initializeAnimations();
    } else {
        console.log('📦 Нет товаров для отображения');
        productContainer.innerHTML = '<p class="text-center">No products available</p>';
    }
}

function initializeAnimations() {
    const animateElements = document.querySelectorAll('.main_product-item, .header_description, .main_intro-title');
    
    if (animateElements.length === 0) {
        console.log('⚠️ Элементы для анимации не найдены');
        return;
    }
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    animateElements.forEach(element => {
        observer.observe(element);
    });
}

// Добавление обработчиков к кнопкам "Add to Cart"
function addCartEventListeners() {
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            addToCart(productId);
        });
    });
}

// Добавление кнопок к статическим товарам
function addButtonsToStaticProducts() {
    document.querySelectorAll('.main_product-item').forEach((item, index) => {
        // Проверяем, есть ли уже кнопка
        if (!item.querySelector('.add-to-cart-btn')) {
            const addBtn = document.createElement('button');
            addBtn.className = 'add-to-cart-btn';
            addBtn.textContent = 'Add to Cart';
            addBtn.setAttribute('data-id', index + 1);
            addBtn.style.cssText = 'background-color: var(--c-primary); color: white; border: none; padding: 10px 15px; border-radius: 4px; cursor: pointer; font-weight: 700; font-size: 12px; text-transform: uppercase; margin-top: 15px; width: 100%;';
            
            addBtn.addEventListener('click', function() {
                const productId = parseInt(this.dataset.id);
                addToCart(productId);
            });
            
            item.appendChild(addBtn);
        }
    });
}

// Функции корзины
function addToCart(productId) {
    let product;
    
    // Сначала ищем в загруженных JSON товарах
    if (products.length > 0) {
        product = products.find(p => p.id === productId);
    }
    
    // Если не нашли в JSON, создаем из статических данных
    if (!product) {
        const itemElement = document.querySelector(`.main_product-item[data-id="${productId}"]`) || 
                           document.querySelector(`.main_product-item:nth-child(${productId})`);
        
        if (itemElement) {
            const title = itemElement.querySelector('.main_product-title').textContent;
            const priceText = itemElement.querySelector('.main_product-price').textContent;
            const price = parseFloat(priceText.replace(/[^\d.]/g, ''));
            const image = itemElement.querySelector('.main_product-img').src;
            const description = itemElement.querySelector('.main_product-text').textContent;
            
            product = {
                id: productId,
                name: title,
                price: price,
                currency: '$',
                image: image,
                description: description
            };
        }
    }

    if (!product) {
        console.error('❌ Товар не найден:', productId);
        return;
    }

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCartCount();
    saveCartToStorage();
    showNotification(`"${product.name}" добавлен в корзину!`);
    
    console.log('🛒 Корзина обновлена:', cart);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    saveCartToStorage();
    renderCartModal();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartCount();
            saveCartToStorage();
            renderCartModal();
        }
    }
}

function updateCartCount() {
    const accountBtn = document.querySelector('.header_account-btn');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (accountBtn) {
        accountBtn.textContent = totalItems;
        // Добавляем анимацию
        accountBtn.style.transform = 'scale(1.2)';
        setTimeout(() => {
            accountBtn.style.transform = 'scale(1)';
        }, 300);
    }
}

function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Модальное окно корзины
function createCartModal() {
    const modal = document.createElement('div');
    modal.className = 'cart-modal';
    modal.style.cssText = 'display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 10000; justify-content: center; align-items: center;';
    modal.innerHTML = `
        <div class="cart-modal-content" style="background: white; border-radius: 8px; width: 90%; max-width: 500px; max-height: 80vh; display: flex; flex-direction: column;">
            <div class="cart-modal-header" style="padding: 20px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0; color: var(--c-dark);">Your Cart</h3>
                <button class="close-cart-modal" style="background: none; border: none; font-size: 24px; cursor: pointer; color: var(--c-dark);">&times;</button>
            </div>
            <div class="cart-modal-body" style="flex: 1; overflow-y: auto; padding: 20px;">
                <div class="cart-items"></div>
                <div class="cart-empty" style="display: none; text-align: center; padding: 40px 20px; color: #666;">
                    <p>Your cart is empty</p>
                </div>
            </div>
            <div class="cart-modal-footer" style="padding: 20px; border-top: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
                <div class="cart-total" style="font-weight: bold; font-size: 18px; color: var(--c-dark);">
                    Total: $<span class="total-amount">0</span>
                </div>
                <button class="checkout-btn" style="background-color: var(--c-primary); color: white; border: none; padding: 12px 24px; border-radius: 4px; cursor: pointer; font-weight: 700;">Checkout</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Обработчики для модального окна
    document.querySelector('.close-cart-modal').addEventListener('click', closeCartModal);
    document.querySelector('.checkout-btn').addEventListener('click', checkout);

    // Закрытие при клике вне модального окна
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeCartModal();
        }
    });

    return modal;
}

function renderCartModal() {
    const cartItems = document.querySelector('.cart-items');
    const cartEmpty = document.querySelector('.cart-empty');
    const totalAmount = document.querySelector('.total-amount');

    if (cart.length === 0) {
        cartItems.style.display = 'none';
        cartEmpty.style.display = 'block';
    } else {
        cartItems.style.display = 'block';
        cartEmpty.style.display = 'none';
        
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item" data-id="${item.id}" style="display: flex; align-items: center; padding: 15px 0; border-bottom: 1px solid #eee; gap: 15px;">
                <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;">
                <div class="cart-item-details" style="flex: 1;">
                    <h4 style="margin: 0 0 5px 0; font-size: 14px;">${item.name}</h4>
                    <p style="margin: 0; color: #666; font-size: 12px;">$${item.price} × ${item.quantity}</p>
                </div>
                <div class="cart-item-controls" style="display: flex; align-items: center; gap: 10px;">
                    <button class="quantity-btn minus" data-id="${item.id}" style="background: #f5f5f5; border: 1px solid #ddd; width: 30px; height: 30px; border-radius: 4px; cursor: pointer;">-</button>
                    <span class="quantity" style="font-weight: bold; min-width: 20px; text-align: center;">${item.quantity}</span>
                    <button class="quantity-btn plus" data-id="${item.id}" style="background: #f5f5f5; border: 1px solid #ddd; width: 30px; height: 30px; border-radius: 4px; cursor: pointer;">+</button>
                    <button class="remove-btn" data-id="${item.id}" style="background: #ff4444; color: white; border: none; width: 30px; height: 30px; border-radius: 4px; cursor: pointer;">×</button>
                </div>
            </div>
        `).join('');

        // Добавляем обработчики для кнопок
        document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
            btn.addEventListener('click', function() {
                updateQuantity(parseInt(this.dataset.id), -1);
            });
        });

        document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
            btn.addEventListener('click', function() {
                updateQuantity(parseInt(this.dataset.id), 1);
            });
        });

        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                removeFromCart(parseInt(this.dataset.id));
            });
        });
    }

    totalAmount.textContent = getCartTotal().toFixed(2);
}

function openCartModal() {
    const modal = document.querySelector('.cart-modal') || createCartModal();
    renderCartModal();
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeCartModal() {
    const modal = document.querySelector('.cart-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    
    showNotification(`Order placed! Total: $${getCartTotal().toFixed(2)}`);
    cart = [];
    updateCartCount();
    saveCartToStorage();
    closeCartModal();
}

// Уведомления
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = 'position: fixed; top: 20px; right: 20px; background: var(--c-primary); color: white; padding: 15px 20px; border-radius: 5px; z-index: 10000; box-shadow: 0 4px 12px rgba(0,0,0,0.2); transform: translateX(150%); transition: transform 0.3s ease;';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    setTimeout(() => {
        notification.style.transform = 'translateX(150%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Сохранение корзины в localStorage
function saveCartToStorage() {
    localStorage.setItem('ourplace_cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('ourplace_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

// ========== ЗАДАНИЕ №2: РАБОТА С COOKIE ==========

function setCookie(name, value, days = 365) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + encodeURIComponent(JSON.stringify(value)) + ";" + expires + ";path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) {
            return JSON.parse(decodeURIComponent(c.substring(nameEQ.length, c.length)));
        }
    }
    return null;
}

function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

// ========== ЗАДАНИЕ №3: РАБОТА С LOCAL STORAGE ==========

function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

function removeFromLocalStorage(key) {
    localStorage.removeItem(key);
}

// ========== ОБРАБОТКА ФОРМЫ ==========
// ========== ВАЛИДАЦИЯ ФОРМЫ ==========

function validateForm() {
    console.log('🔍 Начинаем валидацию формы...');
    
    const form = document.querySelector('form');
    const fields = {
        lastname: document.getElementById('lastname'),
        firstname: document.getElementById('firstname'),
        middlename: document.getElementById('middlename'),
        phone: document.getElementById('phone'),
        address: document.getElementById('address'),
        email: document.getElementById('email'),
        message: document.getElementById('message')
    };

    let isValid = true;
    const errors = [];

    // Правила валидации
// Правила валидации
const validationRules = {
    lastname: {
        required: true,
        minLength: 2,
        maxLength: 50,
        pattern: /^[A-Za-zА-Яа-яЁё\s\-']+$/,
        errorMessage: 'Фамилия должна содержать только буквы, дефисы и апострофы (2-50 символов)'
    },
    firstname: {
        required: true,
        minLength: 2,
        maxLength: 50,
        pattern: /^[A-Za-zА-Яа-яЁё\s\-']+$/,
        errorMessage: 'Имя должно содержать только буквы, дефисы и апострофы (2-50 символов)'
    },
    middlename: {
        required: false,
        minLength: 2,
        maxLength: 50,
        pattern: /^[A-Za-zА-Яа-яЁё\s\-']*$/,
        errorMessage: 'Отчество должно содержать только буквы, дефисы и апострофы (до 50 символов)'
    },
    phone: {
        required: true,
        pattern: /^\+375\s\(\d{2}\)\s\d{3}-\d{2}-\d{2}$/,
        errorMessage: 'Формат номера: +375 (XX) XXX-XX-XX'
    },
    address: {
        required: false,
        minLength: 5,
        maxLength: 200,
        errorMessage: 'Адрес должен содержать от 5 до 200 символов'
    },
    email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        errorMessage: 'Введите корректный email адрес'
    },
    message: {
        required: false,
        maxLength: 1000,
        errorMessage: 'Сообщение не должно превышать 1000 символов'
    }
};

    // Проверка каждого поля
    Object.keys(fields).forEach(fieldName => {
        const field = fields[fieldName];
        const value = field.value.trim();
        const rules = validationRules[fieldName];
        
        resetFieldStyle(field);

        // Проверка обязательных полей
        if (rules.required && !value) {
            markFieldAsInvalid(field, 'Это поле обязательно для заполнения');
            isValid = false;
            errors.push(`Поле "${getFieldLabel(fieldName)}" обязательно для заполнения`);
            return;
        }

        // Если поле необязательное и пустое - пропускаем проверки
        if (!rules.required && !value) {
            return;
        }

        // Проверка минимальной длины
        if (rules.minLength && value.length < rules.minLength) {
            markFieldAsInvalid(field, `Минимальная длина: ${rules.minLength} символов`);
            isValid = false;
            errors.push(`Поле "${getFieldLabel(fieldName)}" слишком короткое (мин. ${rules.minLength} символов)`);
            return;
        }

        // Проверка максимальной длины
        if (rules.maxLength && value.length > rules.maxLength) {
            markFieldAsInvalid(field, `Максимальная длина: ${rules.maxLength} символов`);
            isValid = false;
            errors.push(`Поле "${getFieldLabel(fieldName)}" слишком длинное (макс. ${rules.maxLength} символов)`);
            return;
        }

        // Проверка по регулярному выражению
        if (rules.pattern && !rules.pattern.test(value)) {
            markFieldAsInvalid(field, rules.errorMessage);
            isValid = false;
            errors.push(`Поле "${getFieldLabel(fieldName)}": ${rules.errorMessage}`);
            return;
        }

        // Если все проверки пройдены
        markFieldAsValid(field);
    });

    return { isValid, errors };
}

// Вспомогательные функции для валидации
function markFieldAsInvalid(field, message) {
    field.style.borderColor = 'var(--c-red)';
    field.style.backgroundColor = '#fff5f5';
    
    // Удаляем старое сообщение об ошибке
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Добавляем новое сообщение об ошибке
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.style.cssText = 'color: var(--c-red); font-size: 12px; margin-top: 5px;';
    errorElement.textContent = message;
    field.parentNode.appendChild(errorElement);
}

function markFieldAsValid(field) {
    field.style.borderColor = '#4CAF50';
    field.style.backgroundColor = '#f8fff8';
    
    // Удаляем сообщение об ошибке
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}

function resetFieldStyle(field) {
    field.style.borderColor = '#ddd';
    field.style.backgroundColor = '';
    
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}

function getFieldLabel(fieldName) {
    const labels = {
        lastName: 'Фамилия',
        firstName: 'Имя', 
        middleName: 'Отчество',
        phone: 'Телефон',
        address: 'Адрес',
        email: 'Email',
        message: 'Сообщение'
    };
    return labels[fieldName] || fieldName;
}

// ========== ВЫВОД ДАННЫХ ФОРМЫ ==========

function displayFormData(formData) {
    console.log('📋 Вывод данных формы:', formData);
    
    // Создаем модальное окно для отображения данных
    const modal = document.createElement('div');
    modal.className = 'form-data-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        z-index: 10000;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        border-radius: 10px;
        padding: 30px;
        max-width: 500px;
        width: 100%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    `;

    // Заголовок модального окна
    const title = document.createElement('h2');
    title.textContent = '📋 Данные формы';
    title.style.cssText = 'color: var(--c-dark); margin-bottom: 20px; text-align: center;';

    // Контейнер для данных
    const dataContainer = document.createElement('div');
    dataContainer.style.cssText = 'margin-bottom: 20px;';

    // Отображаем данные формы - ИСПРАВЛЕННЫЕ КЛЮЧИ
    const fieldsToDisplay = [
        { key: 'lastName', label: 'Фамилия' },
        { key: 'firstName', label: 'Имя' },
        { key: 'middleName', label: 'Отчество' },
        { key: 'phone', label: 'Телефон' },
        { key: 'address', label: 'Адрес' },
        { key: 'email', label: 'Email' },
        { key: 'message', label: 'Сообщение' }
    ];

    fieldsToDisplay.forEach(field => {
        const value = formData[field.key] || 'Не указано';
        
        const fieldElement = document.createElement('div');
        fieldElement.style.cssText = 'margin-bottom: 15px; padding: 10px; background: #f9f9f9; border-radius: 5px;';
        
        const label = document.createElement('strong');
        label.textContent = field.label + ': ';
        label.style.color = 'var(--c-dark)';
        
        const valueSpan = document.createElement('span');
        valueSpan.textContent = value;
        valueSpan.style.color = '#666';
        
        fieldElement.appendChild(label);
        fieldElement.appendChild(valueSpan);
        dataContainer.appendChild(fieldElement);
    });

    // Кнопка закрытия
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Закрыть';
    closeButton.style.cssText = `
        background-color: var(--c-primary);
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 5px;
        cursor: pointer;
        font-weight: bold;
        width: 100%;
        margin-top: 10px;
    `;
    closeButton.addEventListener('click', () => {
        modal.remove();
    });

    // Собираем модальное окно
    modalContent.appendChild(title);
    modalContent.appendChild(dataContainer);
    modalContent.appendChild(closeButton);
    modal.appendChild(modalContent);
    
    // Добавляем на страницу
    document.body.appendChild(modal);

    // Закрытие по клику вне модального окна
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    // Альтернативный вариант: вывод в консоль
    console.group('📋 Данные формы:');
    Object.keys(formData).forEach(key => {
        console.log(`${getFieldLabel(key)}: ${formData[key]}`);
    });
    console.groupEnd();
}

// ========== ОБНОВЛЕННЫЙ ОБРАБОТЧИК ФОРМЫ ==========

function handleFormSubmit(e) {
    e.preventDefault();
    console.log('🚀 Обработка отправки формы...');
    
    // Валидация формы
    const validationResult = validateForm();
    
    if (!validationResult.isValid) {
        console.error('❌ Ошибки валидации:', validationResult.errors);
        
        // Показываем уведомление об ошибках
        showNotification('❌ Исправьте ошибки в форме перед отправкой!', 'error');
        
        // Показываем ошибки в alert
        const errorMessage = validationResult.errors.join('\n• ');
        alert('Обнаружены ошибки:\n• ' + errorMessage);
        
        return;
    }
    
    // Собираем данные формы
const formData = {
    lastname: document.getElementById('lastname').value.trim(),
    firstname: document.getElementById('firstname').value.trim(), 
    middlename: document.getElementById('middlename').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    address: document.getElementById('address').value.trim(),
    email: document.getElementById('email').value.trim(),
    message: document.getElementById('message').value.trim(),
    timestamp: new Date().toLocaleString('ru-RU')
};

    console.log('✅ Данные формы валидны:', formData);

    // Выводим данные формы
    displayFormData(formData);

    // Сохраняем в Cookie (Задание №2)
    setCookie('user_profile', formData, 30);
    console.log('🍪 Данные сохранены в Cookie:', formData);

    // Сохраняем в Local Storage (Задание №3)
    saveToLocalStorage('user_profile', formData);
    console.log('💾 Данные сохранены в Local Storage:', formData);

    // Показываем уведомление об успехе
    showNotification('✅ Данные успешно сохранены и отправлены!');

    // Очищаем форму
    e.target.reset();
    
    // Сбрасываем стили полей
    document.querySelectorAll('.form_input, .form_textarea').forEach(field => {
        resetFieldStyle(field);
    });
}

// ========== РЕАЛИТИМ ВАЛИДАЦИЮ В РЕАЛЬНОМ ВРЕМЕНИ ==========

function initializeRealTimeValidation() {
    console.log('⏰ Инициализация валидации в реальном времени...');
    
    const formInputs = document.querySelectorAll('.form_input, .form_textarea');
    
    formInputs.forEach(input => {
        // Валидация при потере фокуса
        input.addEventListener('blur', function() {
            validateSingleField(this);
        });
        
        // Сброс стиля при фокусе
        input.addEventListener('focus', function() {
            resetFieldStyle(this);
        });
        
        // Валидация при вводе для некоторых полей
        if (input.type === 'email' || input.id === 'phone') {
            input.addEventListener('input', function() {
                // Не показываем ошибки во время ввода, только сбрасываем стиль
                resetFieldStyle(this);
            });
        }
    });
}

function validateSingleField(field) {
    const fieldName = field.id;
    const value = field.value.trim();
    
    // Правила валидации
const validationRules = {
    lastname: {
        required: true,
        minLength: 2,
        maxLength: 50,
        pattern: /^[A-Za-zА-Яа-яЁё\s\-']+$/,
        errorMessage: 'Фамилия должна содержать только буквы, дефисы и апострофы (2-50 символов)'
    },
    firstname: {
        required: true,
        minLength: 2,
        maxLength: 50,
        pattern: /^[A-Za-zА-Яа-яЁё\s\-']+$/,
        errorMessage: 'Имя должно содержать только буквы, дефисы и апострофы (2-50 символов)'
    },
    middlename: {
        required: false,
        minLength: 2,
        maxLength: 50,
        pattern: /^[A-Za-zА-Яа-яЁё\s\-']*$/,
        errorMessage: 'Отчество должно содержать только буквы, дефисы и апострофы (до 50 символов)'
    },
    phone: {
        required: true,
        pattern: /^\+375\s\(\d{2}\)\s\d{3}-\d{2}-\d{2}$/,
        errorMessage: 'Формат номера: +375 (XX) XXX-XX-XX'
    },
    address: {
        required: false,
        minLength: 5,
        maxLength: 200,
        errorMessage: 'Адрес должен содержать от 5 до 200 символов'
    },
    email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        errorMessage: 'Введите корректный email адрес'
    },
    message: {
        required: false,
        maxLength: 1000,
        errorMessage: 'Сообщение не должно превышать 1000 символов'
    }
};

    const rules = validationRules[fieldName];
    if (!rules) return;

    resetFieldStyle(field);

    // Если поле необязательное и пустое - пропускаем
    if (!rules.required && !value) {
        return;
    }

    // Проверяем поле
    if (rules.required && !value) {
        markFieldAsInvalid(field, 'Это поле обязательно для заполнения');
        return;
    }

    if (rules.minLength && value.length < rules.minLength) {
        markFieldAsInvalid(field, `Минимальная длина: ${rules.minLength} символов`);
        return;
    }

    if (rules.maxLength && value.length > rules.maxLength) {
        markFieldAsInvalid(field, `Максимальная длина: ${rules.maxLength} символов`);
        return;
    }

    if (rules.pattern && !rules.pattern.test(value)) {
        let errorMessage = 'Неверный формат';
        if (fieldName === 'email') errorMessage = 'Введите корректный email';
        if (fieldName === 'phone') errorMessage = 'Введите корректный номер телефона';
        markFieldAsInvalid(field, errorMessage);
        return;
    }

    // Если все проверки пройдены
    markFieldAsValid(field);
}

// ========== ОБНОВЛЕННАЯ ФУНКЦИЯ ПОКАЗА УВЕДОМЛЕНИЙ ==========

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    
    const backgroundColor = type === 'error' ? 'var(--c-red)' : 'var(--c-primary)';
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${backgroundColor};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        transform: translateX(150%);
        transition: transform 0.3s ease;
        font-weight: bold;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    setTimeout(() => {
        notification.style.transform = 'translateX(150%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// ========== ОБНОВЛЕННАЯ ИНИЦИАЛИЗАЦИЯ ==========

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Инициализация приложения с улучшенной валидацией...');

    // Загружаем товары и корзину
    loadProducts();
    loadCartFromStorage();

    // Обработчик для кнопки корзины в header
    const accountBtn = document.querySelector('.header_account-btn');
    if (accountBtn) {
        accountBtn.addEventListener('click', openCartModal);
    }

    // Обработчик формы
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
        
        // Инициализируем валидацию в реальном времени
        initializeRealTimeValidation();
        
        // Добавляем кнопку для очистки данных
        const clearBtn = document.createElement('button');
        clearBtn.type = 'button';
        clearBtn.textContent = 'Очистить мои данные';
        clearBtn.className = 'btn-secondary';
        clearBtn.style.cssText = 'background-color: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; margin-top: 15px; width: 100%;';
        clearBtn.addEventListener('click', clearUserData);
        
        const lastFormGroup = form.querySelector('.form_group:last-child');
        if (lastFormGroup) {
            lastFormGroup.parentNode.insertBefore(clearBtn, lastFormGroup.nextSibling);
        }
    }

    // Загружаем и показываем сохраненные данные при загрузке
    setTimeout(displaySavedData, 1000);

    // Инициализируем остальные функции
    initializeExistingFeatures();
});
// ========== ИНИЦИАЛИЗАЦИЯ ==========

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Инициализация приложения...');

    // Загружаем товары и корзину
    loadProducts();
    loadCartFromStorage();

    // Обработчик для кнопки корзины в header
    const accountBtn = document.querySelector('.header_account-btn');
    if (accountBtn) {
        accountBtn.addEventListener('click', openCartModal);
    }

    // Обработчик формы
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
        
        // Добавляем кнопку для очистки данных
        const clearBtn = document.createElement('button');
        clearBtn.type = 'button';
        clearBtn.textContent = 'Очистить мои данные';
        clearBtn.className = 'btn-secondary';
        clearBtn.style.cssText = 'background-color: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; margin-top: 15px; width: 100%;';
        clearBtn.addEventListener('click', clearUserData);
        
        const lastFormGroup = form.querySelector('.form_group:last-child');
        if (lastFormGroup) {
            lastFormGroup.parentNode.insertBefore(clearBtn, lastFormGroup.nextSibling);
        }
    }

    // Загружаем и показываем сохраненные данные при загрузке
    setTimeout(displaySavedData, 1000);

    // Инициализируем остальные функции
    initializeExistingFeatures();
});

// Функция для инициализации существующих возможностей
function initializeExistingFeatures() {
        
    addCartButtonsToStaticProducts();
}

// Меню бургер (1)
document.addEventListener('DOMContentLoaded', function() {
    const burgerBtn = document.querySelector('.burger-btn');
    const headerLinks = document.querySelector('.header_links');
    const headerGroup = document.querySelector('.header_group');

    // Создаем мобильное меню
    const mobileMenu = document.createElement('div');
    mobileMenu.classList.add('mobile-menu');
    document.body.appendChild(mobileMenu);

    // Клонируем элементы навигации для мобильного меню
    const mobileLinks = headerLinks.cloneNode(true);
    const mobileGroup = headerGroup.cloneNode(true);

    // Добавляем их в мобильное меню
    mobileMenu.innerHTML = '';
    mobileMenu.appendChild(mobileLinks);
    mobileMenu.appendChild(mobileGroup);

    // Обработчик клика по бургеру
    burgerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        burgerBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Закрываем меню при клике на ссылку
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            burgerBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // Закрываем меню при клике вне его
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && e.target !== burgerBtn) {
            burgerBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
});
// Функция для очистки формы
function clearForm() {
    const form = document.querySelector('form');
    if (form) {
        form.reset();
        
        // Сбрасываем стили всех полей
        document.querySelectorAll('.form_input, .form_textarea').forEach(field => {
            resetFieldStyle(field);
        });
        
        showNotification('Форма очищена!');
        console.log('🧹 Форма очищена');
    }
}
//Instagramm + Twitter (2)
document.addEventListener('DOMContentLoaded', function() {
// Находим все ссылки на соцсети в футере
const socialLinks = document.querySelectorAll('.footer_list-item a');

// Добавляем обработчики клика
socialLinks.forEach(link => {
link.addEventListener('click', function(e) {
    // Проверяем, является ли ссылка на соцсеть
    if (this.href.includes('instagram.com') || this.href.includes('twitter.com')) {
        e.preventDefault(); // Отменяем стандартное поведение
        
        // Открываем ссылку в новом окне
        window.open(this.href, '_blank');
        
        // Альтернативный вариант - переход в текущем окне
        // window.location.href = this.href;
    }
});
});
});

//(3) Плавная прокрутка при клике на якорные ссылки
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
});

//(4)  Валидация формы перед отправкой
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            let isValid = true;
            
            // Validate required fields
            const requiredFields = form.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.style.borderColor = 'var(--c-red)';
                    isValid = false;
                } else {
                    field.style.borderColor = '#ddd';
                }
            });

            // Validate email format
            const emailField = form.querySelector('input[type="email"]');
            if (emailField && !/^\S+@\S+\.\S+$/.test(emailField.value)) {
                emailField.style.borderColor = 'var(--c-red)';
                isValid = false;
            }

            if (!isValid) {
                e.preventDefault();
                alert('Please fill in all required fields correctly.');
            } else {
                // Form is valid, could show success message here
                console.log('Form submitted successfully');
            }
        });
    }
});

//(5) Анимация при скролле (появление элементов)
document.addEventListener('DOMContentLoaded', function() {
    const animateElements = document.querySelectorAll('.main_product-item, .header_description, .main_intro-title');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    animateElements.forEach(element => {
        observer.observe(element);
    });
});

//(6)Ленивая загрузка изображений
document.addEventListener('DOMContentLoaded', function() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
        });
    }
});

//(6) Темный/светлый режим переключения
document.addEventListener('DOMContentLoaded', function() {
    const modeToggle = document.createElement('button');
    modeToggle.className = 'btn-main';
    modeToggle.style.position = 'fixed';
    modeToggle.style.bottom = '20px';
    modeToggle.style.right = '20px';
    modeToggle.style.zIndex = '1000';
    modeToggle.textContent = '🌙';
    modeToggle.title = 'Toggle dark mode';
    document.body.appendChild(modeToggle);

    modeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        this.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
        
        // Save preference to localStorage
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    });

    // Check for saved preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        modeToggle.textContent = '☀️';
    }
});

//(7) Обратный отсчет до специального предложения
document.addEventListener('DOMContentLoaded', function() {
    const countdownContainer = document.createElement('div');
    countdownContainer.style.position = 'fixed';
    countdownContainer.style.bottom = '70px';
    countdownContainer.style.right = '20px';
    countdownContainer.style.backgroundColor = 'var(--c-primary)';
    countdownContainer.style.color = 'white';
    countdownContainer.style.padding = '10px 15px';
    countdownContainer.style.borderRadius = '5px';
    countdownContainer.style.zIndex = '1000';
    countdownContainer.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    document.body.appendChild(countdownContainer);

    const endDate = new Date();
    endDate.setHours(endDate.getHours() + 24); // 24 hours from now

    function updateCountdown() {
        const now = new Date();
        const diff = endDate - now;

        if (diff <= 0) {
            countdownContainer.innerHTML = 'Special offer expired!';
            return;
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        countdownContainer.innerHTML = `Special offer ends in:<br>${hours}h ${minutes}m ${seconds}s`;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
});

//(8) Кнопка наверх
document.addEventListener('DOMContentLoaded', function() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.textContent = '↑';
    backToTopBtn.style.position = 'fixed';
    backToTopBtn.style.bottom = '20px';
    backToTopBtn.style.left = '20px'; // Изменено с right на left
    backToTopBtn.style.width = '40px';
    backToTopBtn.style.height = '40px';
    backToTopBtn.style.borderRadius = '50%';
    backToTopBtn.style.backgroundColor = 'var(--c-primary)';
    backToTopBtn.style.color = 'white';
    backToTopBtn.style.border = 'none';
    backToTopBtn.style.cursor = 'pointer';
    backToTopBtn.style.display = 'none';
    backToTopBtn.style.zIndex = '999';
    document.body.appendChild(backToTopBtn);

    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });

    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

//(9) Анимация логотипа
document.addEventListener('DOMContentLoaded', function() {
    const logo = document.querySelector('.header_logo');
    if (logo) {
        logo.addEventListener('mouseenter', function() {
            this.style.transition = 'transform 0.5s ease';
            this.style.transform = 'rotate(15deg)';
        });
        logo.addEventListener('mouseleave', function() {
            this.style.transform = 'rotate(0)';
        });
    }
});

// ========== ДОБАВЛЕННЫЕ ИНТЕРФЕЙСНЫЕ СОБЫТИЯ ==========

// 1. События мыши - Расширенная функциональность
document.addEventListener('DOMContentLoaded', function() {
    console.log('🖱️ Инициализация событий мыши');
    
    const productItems = document.querySelectorAll('.main_product-item');
    
    productItems.forEach((item, index) => {
        console.log(`🖱️ Настройка событий мыши для товара ${index + 1}`);
        
        // Двойной клик
        item.addEventListener('dblclick', function(e) {
            console.log('🖱️🎯 ДВОЙНОЙ КЛИК сработал:', {
                товар: this.querySelector('.main_product-title').textContent,
                координаты: { x: e.clientX, y: e.clientY },
                время: new Date().toLocaleTimeString()
            });
            
            const productName = this.querySelector('.main_product-title').textContent;
            const accountBtn = document.querySelector('.header_account-btn');
            let count = parseInt(accountBtn.textContent) || 0;
            count++;
            accountBtn.textContent = count;
            
            this.style.boxShadow = '0 0 20px var(--c-primary)';
            setTimeout(() => {
                this.style.boxShadow = '';
            }, 500);
            
            console.log(`🛒 Корзина обновлена: ${productName} добавлен. Всего: ${count}`);
        });

        // Контекстное меню (правый клик)
        item.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            console.log('🖱️📋 КОНТЕКСТНОЕ МЕНЮ сработало:', {
                товар: this.querySelector('.main_product-title').textContent,
                цена: this.querySelector('.main_product-price').textContent,
                координаты: { x: e.clientX, y: e.clientY }
            });
            
            alert(`Товар: ${this.querySelector('.main_product-title').textContent}\nЦена: ${this.querySelector('.main_product-price').textContent}`);
        });

        // Дополнительные события мыши для наблюдения
        item.addEventListener('mouseenter', function() {
            console.log('🖱️➡️ КУРСОР НАВЕДЕН на товар:', this.querySelector('.main_product-title').textContent);
            this.style.border = '2px dashed var(--c-primary)';
        });

        item.addEventListener('mouseleave', function() {
            console.log('🖱️⬅️ КУРСОР УБРАН с товара:', this.querySelector('.main_product-title').textContent);
            this.style.border = '2px dashed transparent';
        });

        item.addEventListener('mousedown', function(e) {
            console.log('🖱️⬇️ КНОПКА МЫШИ НАЖАТА:', {
                товар: this.querySelector('.main_product-title').textContent,
                кнопка: e.button === 0 ? 'левая' : e.button === 1 ? 'средняя' : 'правая',
                координаты: { x: e.clientX, y: e.clientY }
            });
        });

        item.addEventListener('mouseup', function(e) {
            console.log('🖱️⬆️ КНОПКА МЫШИ ОТПУЩЕНА:', {
                товар: this.querySelector('.main_product-title').textContent,
                кнопка: e.button === 0 ? 'левая' : e.button === 1 ? 'средняя' : 'правая',
                координаты: { x: e.clientX, y: e.clientY }
            });
        });

        item.addEventListener('click', function(e) {
            console.log('🖱️👆 ОДИНОЧНЫЙ КЛИК:', {
                товар: this.querySelector('.main_product-title').textContent,
                координаты: { x: e.clientX, y: e.clientY }
            });
        });

        // Движение мыши (с ограничением чтобы не засорять консоль)
        item.addEventListener('mousemove', function(e) {
            if (!this.lastMoveLog || Date.now() - this.lastMoveLog > 200) {
                console.log('🖱️🎯 ДВИЖЕНИЕ МЫШИ над товаром:', this.querySelector('.main_product-title').textContent);
                this.lastMoveLog = Date.now();
            }
        });
    });
});

// 2. События клавиатуры
document.addEventListener('DOMContentLoaded', function() {
    // Горячие клавиши для навигации
    document.addEventListener('keydown', function(e) {
        // Ctrl+1 - Перейти к продуктам
        if (e.ctrlKey && e.key === '1') {
            e.preventDefault();
            document.querySelector('.main_products').scrollIntoView({ behavior: 'smooth' });
        }
        
        // Ctrl+2 - Перейти к форме
        if (e.ctrlKey && e.key === '2') {
            e.preventDefault();
            document.querySelector('form').scrollIntoView({ behavior: 'smooth' });
        }
        
        // Escape - Закрыть мобильное меню
        if (e.key === 'Escape') {
            const mobileMenu = document.querySelector('.mobile-menu');
            const burgerBtn = document.querySelector('.burger-btn');
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                burgerBtn.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        }
        
        // Пробел - Прокрутка вниз
        if (e.key === ' ' && !e.target.matches('input, textarea')) {
            e.preventDefault();
            window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
        }
    });

    // Подсветка при фокусе на форме
    const formInputs = document.querySelectorAll('.form_input, .form_textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
});

// 3. Drag&DROP события
document.addEventListener('DOMContentLoaded', function() {
    console.log('📦 Инициализация Drag & Drop событий');
    
    const productItems = document.querySelectorAll('.main_product-item');
    const accountBtn = document.querySelector('.header_account-btn');
    
    // Настраиваем визуальные эффекты для корзины
    accountBtn.style.transition = 'all 0.3s ease';
    
    productItems.forEach((item, index) => {
        console.log(`📦 Настройка drag событий для товара ${index + 1}`);
        
        item.setAttribute('draggable', 'true');
        item.style.cursor = 'grab';
        
        // Начало перетаскивания
        item.addEventListener('dragstart', function(e) {
            const productName = this.querySelector('.main_product-title').textContent;
            console.log('📦🚀 НАЧАЛО ПЕРЕТАСКИВАНИЯ:', {
                товар: productName,
                передаваемые_данные: e.dataTransfer.types,
                время: new Date().toLocaleTimeString()
            });
            
            e.dataTransfer.setData('text/plain', productName);
            e.dataTransfer.effectAllowed = 'copy';
            this.style.opacity = '0.6';
            this.style.cursor = 'grabbing';
            
            // Визуальный эффект
            this.style.border = '2px solid var(--c-primary)';
        });
        
        // Конец перетаскивания
        item.addEventListener('dragend', function(e) {
            console.log('📦🏁 КОНЕЦ ПЕРЕТАСКИВАНИЯ:', {
                товар: this.querySelector('.main_product-title').textContent,
                результат: e.dataTransfer.dropEffect
            });
            
            this.style.opacity = '1';
            this.style.cursor = 'grab';
            this.style.border = '2px dashed transparent';
        });
        
        // Перетаскивание над элементом
        item.addEventListener('dragover', function(e) {
            e.preventDefault();
            console.log('📦↗️ ПЕРЕТАСКИВАНИЕ НАД товаром:', this.querySelector('.main_product-title').textContent);
        });
        
        // Вход в элемент при перетаскивании
        item.addEventListener('dragenter', function(e) {
            e.preventDefault();
            console.log('📦➡️ ВХОД В ТОВАР при перетаскивании:', this.querySelector('.main_product-title').textContent);
            this.style.backgroundColor = 'rgba(211, 118, 87, 0.1)';
        });
        
        // Выход из элемента при перетаскивании
        item.addEventListener('dragleave', function(e) {
            console.log('📦⬅️ ВЫХОД ИЗ ТОВАРА при перетаскивании:', this.querySelector('.main_product-title').textContent);
            this.style.backgroundColor = '';
        });
    });
    
    // Настройка зоны сброса (корзина)
    console.log('📦 Настройка зоны сброса (кнопка корзины)');
    accountBtn.setAttribute('droppable', 'true');
    
    accountBtn.addEventListener('dragover', function(e) {
        e.preventDefault();
        console.log('📦↗️ ПЕРЕТАСКИВАНИЕ НАД КОРЗИНОЙ');
        this.style.transform = 'scale(1.3)';
        this.style.backgroundColor = '#4CAF50';
    });
    
    accountBtn.addEventListener('dragenter', function(e) {
        e.preventDefault();
        console.log('📦➡️ ВХОД В КОРЗИНУ при перетаскивании');
    });
    
    accountBtn.addEventListener('dragleave', function(e) {
        console.log('📦⬅️ ВЫХОД ИЗ КОРЗИНЫ при перетаскивании');
        this.style.transform = 'scale(1)';
        this.style.backgroundColor = 'var(--c-primary)';
    });
    
    accountBtn.addEventListener('drop', function(e) {
        e.preventDefault();
        console.log('📦🎯 СОБЫТИЕ DROP в корзине:', {
            типы_данных: e.dataTransfer.types,
            данные: e.dataTransfer.getData('text/plain')
        });
        
        const productName = e.dataTransfer.getData('text/plain');
        let count = parseInt(this.textContent) || 0;
        count++;
        this.textContent = count;
        
        // Визуальная анимация
        this.style.transform = 'scale(1)';
        this.style.backgroundColor = '#4CAF50';
        
        console.log(`🛒✅ Товар добавлен в корзину: ${productName}. Новое количество: ${count}`);
        
        // Показываем уведомление
        showDropNotification(`${productName} добавлен в корзину!`);
        
        // Возвращаем обычный цвет через секунду
        setTimeout(() => {
            this.style.backgroundColor = 'var(--c-primary)';
        }, 1000);
    });
    
    // Функция для показа уведомления о дропе
    function showDropNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            transform: translateX(150%);
            transition: transform 0.3s ease;
            font-weight: bold;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(150%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    }
});

// 4. События указателя (Pointer Events)
document.addEventListener('DOMContentLoaded', function() {
    // Улучшенные взаимодействия для сенсорных устройств
    const interactiveElements = document.querySelectorAll('.main_color-btn, .btn-second-main, .header_promotion-btn');
    
    interactiveElements.forEach(element => {
        // ... существующий код ...
    });
    
    // Долгое нажатие для дополнительной информации
    let longPressTimer;
    
    // ПЕРЕМЕСТИТЕ ЭТОТ КОД ВНУТРЬ ФУНКЦИИ, ГДЕ ОПРЕДЕЛЕН productItems
    const productItems = document.querySelectorAll('.main_product-item');
    
    productItems.forEach(item => {
        item.addEventListener('pointerdown', function(e) {
            longPressTimer = setTimeout(() => {
                const title = this.querySelector('.main_product-title').textContent;
                const price = this.querySelector('.main_product-price').textContent;
                const description = this.querySelector('.main_product-text').textContent;
                
                // Создаем всплывающее окно
                const tooltip = document.createElement('div');
                tooltip.style.cssText = `
                    position: fixed;
                    top: ${e.clientY}px;
                    left: ${e.clientX}px;
                    background: rgba(0,0,0,0.9);
                    color: white;
                    padding: 10px;
                    border-radius: 5px;
                    z-index: 10000;
                    max-width: 300px;
                    font-size: 14px;
                `;
                tooltip.innerHTML = `<strong>${title}</strong><br>${price}<br>${description}`;
                document.body.appendChild(tooltip);
                
                // Удаляем через 3 секунды
                setTimeout(() => {
                    tooltip.remove();
                }, 3000);
            }, 1000);
        });
        
        item.addEventListener('pointerup', function() {
            clearTimeout(longPressTimer);
        });
        
        item.addEventListener('pointerleave', function() {
            clearTimeout(longPressTimer);
        });
    });
});

// 5. События полосы прокрутки
document.addEventListener('DOMContentLoaded', function() {
    // Прогресс-бар прокрутки
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: var(--c-primary);
        z-index: 10000;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    // Параллакс эффект для header promotion
    const promotionSection = document.querySelector('.header_promotion');
    
    window.addEventListener('scroll', function() {
        // Прогресс-бар
        const winHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight - winHeight;
        const scrolled = (window.scrollY / docHeight) * 100;
        progressBar.style.width = `${scrolled}%`;
        
        // Параллакс эффект
        if (promotionSection) {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            promotionSection.style.backgroundPositionY = `${scrolled * parallaxSpeed}px`;
        }
        
        // Появление/скрытие шапки при скролле
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
    });
});

// 6. События сенсорных экранов
document.addEventListener('DOMContentLoaded', function() {
    // Свайп для карусели продуктов (упрощенная версия)
    let startX = 0;
    let currentX = 0;
    const productList = document.querySelector('.main_product-list');
    
    if (productList) {
        productList.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
        }, { passive: true });
        
        productList.addEventListener('touchmove', function(e) {
            currentX = e.touches[0].clientX;
        }, { passive: true });
        
        productList.addEventListener('touchend', function() {
            const diff = startX - currentX;
            
            // Минимальное расстояние свайпа
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    // Свайп влево - следующая страница
                    console.log('Swipe left - next page');
                } else {
                    // Свайп вправо - предыдущая страница
                    console.log('Swipe right - previous page');
                }
            }
        }, { passive: true });
    }
    
    // Масштабирование жестами для изображений продуктов
    const productImages = document.querySelectorAll('.main_product-img');
    productImages.forEach(img => {
        let initialDistance = 0;
        
        img.addEventListener('touchstart', function(e) {
            if (e.touches.length === 2) {
                initialDistance = Math.hypot(
                    e.touches[0].clientX - e.touches[1].clientX,
                    e.touches[0].clientY - e.touches[1].clientY
                );
            }
        }, { passive: true });
        
        img.addEventListener('touchmove', function(e) {
            if (e.touches.length === 2) {
                e.preventDefault();
                
                const currentDistance = Math.hypot(
                    e.touches[0].clientX - e.touches[1].clientX,
                    e.touches[0].clientY - e.touches[1].clientY
                );
                
                if (initialDistance > 0) {
                    const scale = currentDistance / initialDistance;
                    this.style.transform = `scale(${Math.min(Math.max(scale, 1), 3)})`;
                }
            }
        });
        
        img.addEventListener('touchend', function() {
            this.style.transition = 'transform 0.3s ease';
            this.style.transform = 'scale(1)';
            setTimeout(() => {
                this.style.transition = '';
            }, 300);
        });
    });
});

// 7. События, связанные с таймером
document.addEventListener('DOMContentLoaded', function() {
    // Таймер для автоматического слайд-шоу продуктов
    let currentProductIndex = 0;
    const productItems = document.querySelectorAll('.main_product-item');
    const productInterval = 5000; // 5 секунд
    
    function highlightNextProduct() {
        // Убираем подсветку со всех продуктов
        productItems.forEach(item => {
            item.style.boxShadow = '';
            item.style.transform = '';
        });
        
        // Подсвечиваем текущий продукт
        if (productItems[currentProductIndex]) {
            productItems[currentProductIndex].style.boxShadow = '0 0 25px rgba(211, 118, 87, 0.5)';
            productItems[currentProductIndex].style.transform = 'translateY(-5px)';
        }
        
        // Переходим к следующему продукту
        currentProductIndex = (currentProductIndex + 1) % productItems.length;
    }
    
    // Запускаем таймер, только если есть продукты
    if (productItems.length > 0) {
        setInterval(highlightNextProduct, productInterval);
        highlightNextProduct(); // Начальная подсветка
    }
    
    // Таймер для показа временных уведомлений
    function showTemporaryNotification(message, duration = 3000) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--c-primary);
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            transform: translateX(150%);
            transition: transform 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Показываем уведомление
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Скрываем через указанное время
        setTimeout(() => {
            notification.style.transform = 'translateX(150%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, duration);
    }
    
    // Показываем приветственное уведомление через 2 секунды
    setTimeout(() => {
        showTemporaryNotification('🎉 Welcome to Our Place! Discover our cookware collection.');
    }, 2000);
    
    // Таймер для проверки активности пользователя
    let userInactiveTimer;
    function resetInactiveTimer() {
        clearTimeout(userInactiveTimer);
        userInactiveTimer = setTimeout(() => {
            showTemporaryNotification('👋 Still browsing? Need help choosing?', 5000);
        }, 30000); // 30 секунд неактивности
    }
    
    // Сбрасываем таймер при любом взаимодействии
    ['mousemove', 'keypress', 'click', 'scroll', 'touchstart'].forEach(event => {
        document.addEventListener(event, resetInactiveTimer, { passive: true });
    });
    
    resetInactiveTimer(); // Запускаем таймер
});

