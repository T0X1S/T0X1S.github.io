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
        // Pointer down - нажатие
        element.addEventListener('pointerdown', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        // Pointer up - отпускание
        element.addEventListener('pointerup', function() {
            this.style.transform = 'scale(1)';
        });
        
        // Pointer enter - наведение
        element.addEventListener('pointerenter', function() {
            this.style.transition = 'all 0.2s ease';
        });
        
        // Pointer leave - уход курсора
        element.addEventListener('pointerleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Долгое нажатие для дополнительной информации
    let longPressTimer;
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