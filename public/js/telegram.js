// Telegram Web App с анимациями
let tg = window.Telegram?.WebApp;

document.addEventListener('DOMContentLoaded', function() {
    if (!tg) {
        console.warn('Telegram Web App не обнаружен. Приложение работает в автономном режиме.');
        return;
    }

    // Расширяем приложение на весь экран
    tg.expand();

    // Устанавливаем цвета
    tg.setBackgroundColor('#121212');
    tg.setHeaderColor('#2d1b3a');

    // Настраиваем основную кнопку
    tg.MainButton.setText('✨ Начать расчет');
    tg.MainButton.onClick(() => {
        const form = document.querySelector('form');
        if (form) {
            form.dispatchEvent(new Event('submit'));
        }
    });

    // Получаем данные пользователя
    const user = tg.initDataUnsafe?.user;
    if (user) {
        animateWelcome(user.first_name || 'путник');
    }

    // Анимация для карточек при появлении
    animateCards();

    // Кнопка закрытия
    const closeButton = document.getElementById('closeButton');
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            tg.close();
        });
    }

    // Кнопка "Назад"
    tg.BackButton.onClick(function() {
        window.history.back();
    });

    // Показываем/скрываем кнопку "Назад"
    if (window.location.pathname !== '/') {
        tg.BackButton.show();
    } else {
        tg.BackButton.hide();
    }

    // Применяем тему Telegram
    applyTelegramTheme();

    tg.ready();
    console.log('✨ Telegram Mini App с анимациями запущен');
});

function animateWelcome(userName) {
    const welcomeElement = document.getElementById('welcomeMessage');
    if (!welcomeElement) return;

    // Эффект печатающегося текста
    welcomeElement.classList.add('typing-animation');
    welcomeElement.textContent = `Добро пожаловать, ${userName}! ✨`;

    // Убираем анимацию через 3 секунды
    setTimeout(() => {
        welcomeElement.classList.remove('typing-animation');
    }, 3000);
}

function animateCards() {
    const cards = document.querySelectorAll('.practice-card');
    cards.forEach((card, index) => {
        card.style.animation = `fadeIn 0.5s ease forwards ${index * 0.1}s`;
        card.style.opacity = '0';

        // Добавляем эффект свечения при наведении
        card.addEventListener('mouseenter', function() {
            this.style.animation = 'pulse 2s infinite';
        });

        card.addEventListener('mouseleave', function() {
            this.style.animation = '';
        });
    });
}

function applyTelegramTheme() {
    if (!tg) return;

    // Применяем цвета темы Telegram
    const theme = tg.themeParams;
    if (theme) {
        document.documentElement.style.setProperty('--tg-bg-color', theme.bg_color || '#121212');
        document.documentElement.style.setProperty('--tg-text-color', theme.text_color || '#e0e0e0');
        document.documentElement.style.setProperty('--tg-button-color', theme.button_color || '#9b6bc0');
        document.documentElement.style.setProperty('--tg-button-text-color', theme.button_text_color || '#ffffff');
    }
}

// Функция для отправки данных в Telegram
function sendDataToTelegram(data) {
    if (!tg) return;

    try {
        tg.sendData(JSON.stringify(data));

        // Показываем анимацию отправки
        showSendingAnimation();
    } catch (error) {
        console.error('Ошибка отправки данных:', error);
    }
}

function showSendingAnimation() {
    const animation = document.createElement('div');
    animation.className = 'magic-circle active';
    document.body.appendChild(animation);

    setTimeout(() => {
        animation.remove();
    }, 2000);
}

// Функция для показа уведомлений с анимацией
function showNotification(message, type = 'success') {
    if (!tg) {
        if (type === 'error') alert('❌ ' + message);
        else if (type === 'success') alert('✅ ' + message);
        else alert(message);
        return;
    }

    // Создаем кастомное уведомление
    const notification = document.createElement('div');
    notification.className = `glass-card notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 15px 30px;
        z-index: 9999;
        animation: slideDown 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
        max-width: 90%;
        text-align: center;
    `;

    const icon = type === 'success' ? '✨' : '❌';
    notification.innerHTML = `${icon} ${message}`;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Добавляем CSS для уведомлений
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from { transform: translateX(-50%) translateY(-100%); }
        to { transform: translateX(-50%) translateY(0); }
    }
    
    @keyframes fadeOut {
        to { opacity: 0; }
    }
    
    .notification-success {
        background: rgba(76, 175, 80, 0.2);
        border: 1px solid #4CAF50;
    }
    
    .notification-error {
        background: rgba(244, 67, 54, 0.2);
        border: 1px solid #f44336;
    }
`;
document.head.appendChild(style);

// Экспортируем функции
window.telegramApp = {
    sendData: sendDataToTelegram,
    notify: showNotification,
    user: tg?.initDataUnsafe?.user,
    tg: tg
};