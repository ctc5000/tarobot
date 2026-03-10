const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');
const path = require('path');

// Загружаем переменные окружения
dotenv.config();

const token = process.env.BOT_TOKEN;
let webAppUrl = process.env.WEBAPP_URL || 'http://91.218.229.216:3000';

// Убираем лишний слеш в конце, если он есть
webAppUrl = webAppUrl.replace(/\/$/, '');

// Проверяем наличие токена
if (!token) {
    console.error('❌ ОШИБКА: BOT_TOKEN не найден в .env файле!');
    process.exit(1);
}

console.log('🤖 Запуск Telegram бота...');
console.log('📋 Токен:', token.substring(0, 10) + '...');
console.log('🔗 WebApp URL:', webAppUrl);

// Создаем бота с polling (для разработки)
const bot = new TelegramBot(token, {
    polling: true,
    filepath: false
});

// Обработка ошибок polling
bot.on('polling_error', (error) => {
    console.error('❌ Ошибка polling:', error.message);
});

// Команда /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const userName = msg.from.first_name || msg.from.username || 'путник';

    console.log(`👤 Пользователь ${userName} (${chatId}) запустил бота`);

    const welcomeMessage = `
🌟 *Добро пожаловать в Мистическую Нумерологию, ${userName}!* 🌟

Я — ваш проводник в мире тайных знаний. Здесь вы найдете 9 древних практик для познания себя:

🔢 *Нумерология* — магия чисел и код судьбы
🌳 *Родология* — сила рода и память предков
📜 *И-Цзин* — 64 гексаграммы Книги Перемен
🌀 *Да Лю Жэнь* — великое тайное
⚜️ *Герметизм* — 7 принципов мироздания
📖 *Зоар* — каббала и Древо Жизни
🧠 *Соционика* — 16 типов личности
🌞 *Астропсихология* — психология по звездам
ᚠ *Руны* — Старший Футарк

✨ *Нажмите кнопку ниже, чтобы открыть приложение* ✨
    `;

    bot.sendMessage(chatId, welcomeMessage, {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [{ text: '🔮 Открыть портал знаний', web_app: { url: webAppUrl } }],
                [{ text: '📚 О проекте', callback_data: 'about' }],
                [{ text: '❓ Помощь', callback_data: 'help' }]
            ]
        }
    }).catch(error => {
        console.error('❌ Ошибка отправки сообщения:', error);
    });
});

// Обработка callback-запросов
bot.on('callback_query', (callbackQuery) => {
    const msg = callbackQuery.message;
    const chatId = msg.chat.id;
    const data = callbackQuery.data;
    const messageId = msg.message_id;

    console.log(`📞 Callback получен: ${data} от ${chatId}`);

    if (data === 'about') {
        bot.sendMessage(chatId,
            '*📚 О проекте "Древо Жизни"*\n\n' +
            'Этот проект объединяет 9 древних и современных практик самопознания:\n\n' +
            '• Нумерология (метод Локтеоновой)\n' +
            '• Родология\n' +
            '• И-Цзин (Книга Перемен)\n' +
            '• Да Лю Жэнь\n' +
            '• 7 герметических принципов\n' +
            '• Зоар (каббала)\n' +
            '• Соционика (16 типов)\n' +
            '• Астропсихология\n' +
            '• Руны Старшего Футарка\n\n' +
            '✨ *Все расчеты бесплатны и конфиденциальны* ✨',
            { parse_mode: 'Markdown' }
        ).catch(error => {
            console.error('❌ Ошибка отправки about:', error);
        });
    } else if (data === 'help') {
        bot.sendMessage(chatId,
            '❓ *Помощь*\n\n' +
            'Команды бота:\n' +
            '/start — начать работу\n' +
            '/help — показать это сообщение\n' +
            '/practices — список всех практик\n' +
            '/about — о проекте\n\n' +
            'Если у вас возникли проблемы с открытием приложения, убедитесь что:\n' +
            '1️⃣ У вас установлена последняя версия Telegram\n' +
            '2️⃣ Вы используете мобильное приложение (не веб-версию)\n' +
            '3️⃣ Нажмите кнопку "🔮 Открыть портал знаний"',
            { parse_mode: 'Markdown' }
        ).catch(error => {
            console.error('❌ Ошибка отправки help:', error);
        });
    }

    // Отвечаем на callback, чтобы убрать "часики"
    bot.answerCallbackQuery(callbackQuery.id).catch(error => {
        console.error('❌ Ошибка answerCallbackQuery:', error);
    });
});

// Команда /help
bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId,
        '❓ *Команды бота:*\n\n' +
        '/start — начать работу\n' +
        '/help — показать это сообщение\n' +
        '/practices — список всех практик\n' +
        '/about — о проекте',
        { parse_mode: 'Markdown' }
    ).catch(error => {
        console.error('❌ Ошибка отправки help:', error);
    });
});

// Команда /practices
bot.onText(/\/practices/, (msg) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId,
        '📚 *Доступные практики:*\n\n' +
        '1️⃣ *Нумерология* — расчет по ФИО и дате\n' +
        '2️⃣ *Родология* — исследование родовых программ\n' +
        '3️⃣ *И-Цзин* — ответ на вопрос по гексаграммам\n' +
        '4️⃣ *Да Лю Жэнь* — китайская метафизика\n' +
        '5️⃣ *Герметизм* — 7 принципов\n' +
        '6️⃣ *Зоар* — Древо Жизни\n' +
        '7️⃣ *Соционика* — определение типа личности\n' +
        '8️⃣ *Астропсихология* — натальная карта\n' +
        '9️⃣ *Руны* — гадание на Старшем Футарке',
        {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🔮 Открыть приложение', web_app: { url: webAppUrl } }]
                ]
            }
        }
    ).catch(error => {
        console.error('❌ Ошибка отправки practices:', error);
    });
});

// Обработка обычных сообщений
bot.on('message', (msg) => {
    // Игнорируем команды (они уже обработаны выше)
    if (msg.text && !msg.text.startsWith('/')) {
        const chatId = msg.chat.id;
        bot.sendMessage(chatId,
            'Я понимаю только команды. Напишите /start чтобы начать.',
            { reply_to_message_id: msg.message_id }
        ).catch(error => {
            console.error('❌ Ошибка отправки ответа на сообщение:', error);
        });
    }
});

// Выводим информацию о боте после запуска
(async () => {
    try {
        const botInfo = await bot.getMe();
        console.log(`✅ Telegram бот успешно запущен!`);
        console.log(`📱 Имя: ${botInfo.first_name}`);
        console.log(`🔗 Ссылка: https://t.me/${botInfo.username}`);
        console.log(`🌐 WebApp URL: ${webAppUrl}`);
    } catch (error) {
        console.error('❌ Ошибка получения информации о боте:', error);
    }
})();

// Обработка завершения
process.once('SIGINT', () => {
    bot.stopPolling();
    console.log('👋 Бот остановлен');
    process.exit(0);
});

process.once('SIGTERM', () => {
    bot.stopPolling();
    console.log('👋 Бот остановлен');
    process.exit(0);
});