const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');
const path = require('path');
const crypto = require('crypto');

// Загружаем переменные окружения
dotenv.config();

const token = process.env.BOT_TOKEN;
const WEBAPP_URL = 'https://yournumerology.ru'; // Прямой URL вашего сайта

// Проверяем наличие токена
if (!token) {
    console.error('❌ ОШИБКА: BOT_TOKEN не найден в .env файле!');
    console.error('📌 Убедитесь, что файл .env содержит BOT_TOKEN=ваш_токен');
    process.exit(1);
}

console.log('🤖 Запуск Telegram бота...');
console.log('📋 Токен:', token.substring(0, 10) + '...');
console.log('🔗 WebApp URL:', WEBAPP_URL);

// Создаем бота с polling
const bot = new TelegramBot(token, {
    polling: {
        interval: 300,
        autoStart: true,
        params: {
            timeout: 10
        }
    },
    filepath: false
});

// Функция для генерации уникального параметра версии (для борьбы с кешем)
function getVersionParam() {
    const timestamp = Date.now();
    const random = crypto.randomBytes(4).toString('hex');
    return `v=${timestamp}-${random}`;
}

// Функция для получения полного URL с версией
function getWebAppUrl() {
    const versionParam = getVersionParam();
    return `${WEBAPP_URL}/?${versionParam}`;
}

// Установка меню бота (кнопка слева внизу)
async function setBotMenu() {
    try {
        await bot.setMyCommands([
            { command: 'start', description: '🚀 Запустить бота' },
            { command: 'menu', description: '📋 Открыть меню' },
            { command: 'practices', description: '🔮 Список практик' },
            { command: 'about', description: '📚 О проекте' },
            { command: 'help', description: '❓ Помощь' }
        ]);
        console.log('✅ Меню бота установлено');

        // Устанавливаем кнопку меню (в левом нижнем углу)
        await bot.setChatMenuButton({
            text: '🔮 Открыть приложение',
            web_app: { url: WEBAPP_URL }
        });
        console.log('✅ Кнопка меню установлена');
    } catch (error) {
        console.error('❌ Ошибка установки меню:', error.message);
    }
}

// Вызываем установку меню при запуске
setBotMenu();

// Обработка ошибок polling
bot.on('polling_error', (error) => {
    console.error('❌ Ошибка polling:', error.message);
    if (error.message.includes('409')) {
        console.error('⚠️ Конфликт: другой экземпляр бота уже запущен!');
        console.error('📌 Остановите другой процесс или используйте другой токен');
    }
});

// Обработка ошибок webhook
bot.on('webhook_error', (error) => {
    console.error('❌ Ошибка webhook:', error.message);
});

// Команда /start
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const userName = msg.from.first_name || msg.from.username || 'путник';
    const userLanguage = msg.from.language_code || 'ru';

    console.log(`👤 Пользователь ${userName} (${chatId}) запустил бота [${userLanguage}]`);

    const welcomeMessage = userLanguage.startsWith('ru') ?
        `🌟 *Добро пожаловать в Мистическую Нумерологию, ${userName}!* 🌟

Я — ваш проводник в мире тайных знаний. Здесь вы найдете 9 древних практик для познания себя:

🔢 *Нумерология* — магия чисел и код судьбы
🌳 *Родология* — сила рода и память предков
📜 *И-Цзин* — 64 гексаграммы Книги Перемен
🌀 *Да Лю Жэнь* — великое тайное
⚜️ *Герметизм* — 7 принципов мироздания
📖 *Зоар* — каббала и АЛГОРИТМ СУДЬБЫ
🧠 *Соционика* — 16 типов личности
🌞 *Астропсихология* — психология по звездам
ᚠ *Руны* — Старший Футарк

✨ *Нажмите кнопку ниже, чтобы открыть приложение* ✨

💡 *Подсказка:* В левом нижнем углу есть кнопка меню для быстрого доступа к приложению` :

        `🌟 *Welcome to Mystical Numerology, ${userName}!* 🌟

I am your guide in the world of secret knowledge. Here you will find 9 ancient practices for self-discovery:

🔢 *Numerology* — magic of numbers and destiny code
🌳 *Rodology* — power of ancestry and memory
📜 *I-Ching* — 64 hexagrams of the Book of Changes
🌀 *Da Liu Ren* — the great secret
⚜️ *Hermeticism* — 7 principles of the universe
📖 *Zohar* — Kabbalah and DESTINY ALGORITHM
🧠 *Socionics* — 16 personality types
🌞 *Astropsychology* — psychology by the stars
ᚠ *Runes* — Elder Futhark

✨ *Click the button below to open the app* ✨

💡 *Tip:* There's a menu button in the bottom left corner for quick access to the app`;

    try {
        await bot.sendMessage(chatId, welcomeMessage, {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: userLanguage.startsWith('ru') ? '🔮 Открыть портал знаний' : '🔮 Open knowledge portal',
                        web_app: { url: getWebAppUrl() }
                    }],
                    [
                        { text: userLanguage.startsWith('ru') ? '📚 О проекте' : '📚 About', callback_data: 'about' },
                        { text: userLanguage.startsWith('ru') ? '❓ Помощь' : '❓ Help', callback_data: 'help' }
                    ],
                    [
                        { text: userLanguage.startsWith('ru') ? '📋 Меню команд' : '📋 Commands menu', callback_data: 'menu' }
                    ]
                ]
            }
        });
        console.log(`✅ Приветствие отправлено пользователю ${chatId}`);
    } catch (error) {
        console.error('❌ Ошибка отправки сообщения:', error);
    }
});

// Команда /menu
bot.onText(/\/menu/, async (msg) => {
    const chatId = msg.chat.id;
    const userLanguage = msg.from.language_code || 'ru';

    const menuText = userLanguage.startsWith('ru') ?
        '📋 *Меню команд*\n\n' +
        '🔮 /start — начать работу\n' +
        '📋 /menu — открыть это меню\n' +
        '🔢 /practices — список всех практик\n' +
        '📚 /about — о проекте\n' +
        '❓ /help — помощь\n\n' +
        '💡 *Быстрый доступ:* Нажмите кнопку ниже или используйте меню в левом нижнем углу' :

        '📋 *Commands Menu*\n\n' +
        '🔮 /start — start working\n' +
        '📋 /menu — open this menu\n' +
        '🔢 /practices — list of all practices\n' +
        '📚 /about — about the project\n' +
        '❓ /help — help\n\n' +
        '💡 *Quick access:* Click the button below or use the menu in the bottom left corner';

    try {
        await bot.sendMessage(chatId, menuText, {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{ text: userLanguage.startsWith('ru') ? '🔮 Открыть приложение' : '🔮 Open app',
                        web_app: { url: getWebAppUrl() } }]
                ]
            }
        });
    } catch (error) {
        console.error('❌ Ошибка отправки меню:', error);
    }
});

// Обработка callback-запросов
bot.on('callback_query', async (callbackQuery) => {
    const msg = callbackQuery.message;
    const chatId = msg.chat.id;
    const data = callbackQuery.data;
    const userLanguage = callbackQuery.from.language_code || 'ru';

    console.log(`📞 Callback получен: ${data} от ${chatId}`);

    try {
        if (data === 'about') {
            const aboutText = userLanguage.startsWith('ru') ?
                '*📚 О проекте "АЛГОРИТМ СУДЬБЫ"*\n\n' +
                'Этот проект объединяет 9 древних и современных практик самопознания:\n\n' +
                '• 🔢 Нумерология — код вашей судьбы\n' +
                '• 📖 Натальная карта — астрологический портрет\n' +
                '• 🧠 Соционика — 16 типов личности\n' +
                '• 🌞 Астропсихология — звездный портрет\n' +
                '• ᚠ Руны — древние символы\n\n' +
                '✨ *Все расчеты бесплатны и конфиденциальны* ✨' :

                '*📚 About "DESTINY ALGORITHM" Project*\n\n' +
                'This project combines 9 ancient and modern practices for self-discovery:\n\n' +
                '• 🔢 Numerology — your destiny code\n' +
                '• 📖 Natal chart — astrological portrait\n' +
                '• 🧠 Socionics — 16 personality types\n' +
                '• 🌞 Astropsychology — star portrait\n' +
                '• ᚠ Runes — Elder Futhark\n\n' +
                '✨ *All calculations are free and confidential* ✨';

            await bot.sendMessage(chatId, aboutText, {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: userLanguage.startsWith('ru') ? '🔮 Открыть приложение' : '🔮 Open app',
                            web_app: { url: getWebAppUrl() } }]
                    ]
                }
            });

        } else if (data === 'help') {
            const helpText = userLanguage.startsWith('ru') ?
                '❓ *Помощь*\n\n' +
                '*Команды бота:*\n' +
                '/start — начать работу\n' +
                '/menu — открыть меню\n' +
                '/practices — список всех практик\n' +
                '/about — о проекте\n\n' +
                '*Проблемы с открытием приложения:*\n' +
                '1️⃣ Убедитесь, что у вас последняя версия Telegram\n' +
                '2️⃣ Используйте мобильное приложение\n' +
                '3️⃣ Нажмите кнопку "🔮 Открыть приложение" ниже' :

                '❓ *Help*\n\n' +
                '*Bot commands:*\n' +
                '/start — start working\n' +
                '/menu — open menu\n' +
                '/practices — list of all practices\n' +
                '/about — about the project\n\n' +
                '*Problems opening the app:*\n' +
                '1️⃣ Make sure you have the latest version of Telegram\n' +
                '2️⃣ Use the mobile app\n' +
                '3️⃣ Click the "🔮 Open app" button below';

            await bot.sendMessage(chatId, helpText, {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: userLanguage.startsWith('ru') ? '🔮 Открыть приложение' : '🔮 Open app',
                            web_app: { url: getWebAppUrl() } }]
                    ]
                }
            });

        } else if (data === 'menu') {
            // Отправляем меню команд
            const menuText = userLanguage.startsWith('ru') ?
                '📋 *Меню команд*\n\n' +
                '🔮 /start — начать работу\n' +
                '📋 /menu — открыть меню\n' +
                '🔢 /practices — список всех практик\n' +
                '📚 /about — о проекте\n' +
                '❓ /help — помощь' :

                '📋 *Commands Menu*\n\n' +
                '🔮 /start — start working\n' +
                '📋 /menu — open menu\n' +
                '🔢 /practices — list of all practices\n' +
                '📚 /about — about the project\n' +
                '❓ /help — help';

            await bot.sendMessage(chatId, menuText, { parse_mode: 'Markdown' });
        }

        // Отвечаем на callback
        await bot.answerCallbackQuery(callbackQuery.id);
        console.log(`✅ Callback ${data} обработан для ${chatId}`);

    } catch (error) {
        console.error('❌ Ошибка обработки callback:', error);
    }
});

// Команда /practices
bot.onText(/\/practices/, async (msg) => {
    const chatId = msg.chat.id;
    const userLanguage = msg.from.language_code || 'ru';

    const practicesText = userLanguage.startsWith('ru') ?
        '📚 *Доступные практики:*\n\n' +
        '1️⃣ *Нумерология* — расчет по ФИО и дате\n' +
        '2️⃣ *Натальная карта* — астрологический портрет\n' +
        '3️⃣ *Соционика* — 16 типов личности\n' +
        '4️⃣ *Астропсихология* — психология по звездам\n' +
        '5️⃣ *Руны* — гадание на Старшем Футарке\n\n' +
        '✨ *Выберите практику в приложении* ✨' :

        '📚 *Available practices:*\n\n' +
        '1️⃣ *Numerology* — calculation by name and date\n' +
        '2️⃣ *Natal chart* — astrological portrait\n' +
        '3️⃣ *Socionics* — 16 personality types\n' +
        '4️⃣ *Astropsychology* — psychology by the stars\n' +
        '5️⃣ *Runes* — Elder Futhark divination\n\n' +
        '✨ *Choose a practice in the app* ✨';

    try {
        await bot.sendMessage(chatId, practicesText, {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{ text: userLanguage.startsWith('ru') ? '🔮 Открыть приложение' : '🔮 Open app',
                        web_app: { url: getWebAppUrl() } }]
                ]
            }
        });
    } catch (error) {
        console.error('❌ Ошибка отправки practices:', error);
    }
});

// Команда /about
bot.onText(/\/about/, async (msg) => {
    const chatId = msg.chat.id;
    const userLanguage = msg.from.language_code || 'ru';

    const aboutText = userLanguage.startsWith('ru') ?
        '*📚 О проекте "АЛГОРИТМ СУДЬБЫ"*\n\n' +
        'Этот проект объединяет 9 древних и современных практик самопознания.\n\n' +
        '✨ *Все расчеты бесплатны и конфиденциальны* ✨\n\n' +
        '📌 *Как пользоваться:*\n' +
        '1. Нажмите кнопку "🔮 Открыть приложение"\n' +
        '2. Выберите интересующую практику\n' +
        '3. Введите данные для расчета\n' +
        '4. Получите персональный результат' :

        '*📚 About "DESTINY ALGORITHM" Project*\n\n' +
        'This project combines 9 ancient and modern practices for self-discovery.\n\n' +
        '✨ *All calculations are free and confidential* ✨\n\n' +
        '📌 *How to use:*\n' +
        '1. Click the "🔮 Open app" button\n' +
        '2. Select the practice you are interested in\n' +
        '3. Enter data for calculation\n' +
        '4. Get a personalized result';

    try {
        await bot.sendMessage(chatId, aboutText, {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{ text: userLanguage.startsWith('ru') ? '🔮 Открыть приложение' : '🔮 Open app',
                        web_app: { url: getWebAppUrl() } }]
                ]
            }
        });
    } catch (error) {
        console.error('❌ Ошибка отправки about:', error);
    }
});

// Команда /help
bot.onText(/\/help/, async (msg) => {
    const chatId = msg.chat.id;
    const userLanguage = msg.from.language_code || 'ru';

    const helpText = userLanguage.startsWith('ru') ?
        '❓ *Команды бота:*\n\n' +
        '/start — начать работу\n' +
        '/menu — открыть меню\n' +
        '/practices — список всех практик\n' +
        '/about — о проекте\n' +
        '/help — показать это сообщение' :

        '❓ *Bot commands:*\n\n' +
        '/start — start working\n' +
        '/menu — open menu\n' +
        '/practices — list of all practices\n' +
        '/about — about the project\n' +
        '/help — show this message';

    try {
        await bot.sendMessage(chatId, helpText, {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{ text: userLanguage.startsWith('ru') ? '🔮 Открыть приложение' : '🔮 Open app',
                        web_app: { url: getWebAppUrl() } }]
                ]
            }
        });
    } catch (error) {
        console.error('❌ Ошибка отправки help:', error);
    }
});

// Обработка обычных сообщений
bot.on('message', async (msg) => {
    if (msg.text && !msg.text.startsWith('/')) {
        const chatId = msg.chat.id;
        const userLanguage = msg.from.language_code || 'ru';

        try {
            const replyText = userLanguage.startsWith('ru') ?
                'Я понимаю только команды. Напишите /start чтобы начать.' :
                'I only understand commands. Write /start to begin.';

            await bot.sendMessage(chatId, replyText, {
                reply_to_message_id: msg.message_id,
                reply_markup: {
                    inline_keyboard: [
                        [{ text: userLanguage.startsWith('ru') ? '🔮 Открыть приложение' : '🔮 Open app',
                            web_app: { url: getWebAppUrl() } }]
                    ]
                }
            });
        } catch (error) {
            console.error('❌ Ошибка отправки ответа на сообщение:', error);
        }
    }
});

// Выводим информацию о боте после запуска
(async () => {
    try {
        const botInfo = await bot.getMe();
        console.log(`✅ Telegram бот успешно запущен!`);
        console.log(`📱 Имя: ${botInfo.first_name}`);
        console.log(`🔗 Ссылка: https://t.me/${botInfo.username}`);
        console.log(`🌐 WebApp URL: ${WEBAPP_URL}`);
        console.log(`📋 Команды меню установлены`);
        console.log(`👥 Поддержка: @${botInfo.username}`);
    } catch (error) {
        console.error('❌ Ошибка получения информации о боте:', error);
    }
})();

// Обработка завершения
process.once('SIGINT', async () => {
    console.log('\n👋 Получен сигнал SIGINT, останавливаем бота...');
    await bot.stopPolling();
    console.log('✅ Бот успешно остановлен');
    process.exit(0);
});

process.once('SIGTERM', async () => {
    console.log('\n👋 Получен сигнал SIGTERM, останавливаем бота...');
    await bot.stopPolling();
    console.log('✅ Бот успешно остановлен');
    process.exit(0);
});

// Обработка необработанных ошибок
process.on('uncaughtException', (error) => {
    console.error('❌ Необработанное исключение:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('❌ Необработанное отклонение Promise:', error);
});