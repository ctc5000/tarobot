const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');
const path = require('path');
const crypto = require('crypto');

// Загружаем переменные окружения
dotenv.config();

const token = process.env.BOT_TOKEN;
let baseWebAppUrl = process.env.WEBAPP_URL || 'https://yournumerology.ru';

// Убираем лишний слеш в конце, если он есть
baseWebAppUrl = baseWebAppUrl.replace(/\/$/, '');

// Функция для генерации уникального параметра версии
function getVersionParam() {
    // Используем timestamp + случайное число для гарантии уникальности
    const timestamp = Date.now();
    const random = crypto.randomBytes(4).toString('hex');
    return `v=${timestamp}-${random}`;
}

// Функция для получения полного URL с версией
/*function getWebAppUrl() {
    const versionParam = getVersionParam();
    return `${baseWebAppUrl}/?${versionParam}`;
}*/
function getWebAppUrl() {
    // Используем прямую ссылку на мини-приложение
    return 'https://t.me/you_desteny_bot/destalgo';
}
// Проверяем наличие токена
if (!token) {
    console.error('❌ ОШИБКА: BOT_TOKEN не найден в .env файле!');
    console.error('📌 Убедитесь, что файл .env содержит BOT_TOKEN=ваш_токен');
    process.exit(1);
}

console.log('🤖 Запуск Telegram бота...');
console.log('📋 Токен:', token.substring(0, 10) + '...');
console.log('🔗 Базовый URL:', baseWebAppUrl);
console.log('📱 Режим: polling');

// Создаем бота с polling (для разработки)
const bot = new TelegramBot(token, {
    polling: {
        interval: 300, // проверка новых сообщений каждые 300ms
        autoStart: true,
        params: {
            timeout: 10
        }
    },
    filepath: false
});

// Обработка ошибок polling
bot.on('polling_error', (error) => {
    console.error('❌ Ошибка polling:', error.message);
    if (error.message.includes('409')) {
        console.error('⚠️ Конфликт: другой экземпляр бота уже запущен!');
        console.error('📌 Остановите другой процесс или используйте другой токен');
    }
});

// Обработка ошибок webhook (если они возникнут)
bot.on('webhook_error', (error) => {
    console.error('❌ Ошибка webhook:', error.message);
});

// Команда /start
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const userName = msg.from.first_name || msg.from.username || 'путник';
    const userLanguage = msg.from.language_code || 'ru';

    console.log(`👤 Пользователь ${userName} (${chatId}) запустил бота [${userLanguage}]`);

    // Приветственное сообщение в зависимости от языка
    let welcomeMessage;
    if (userLanguage.startsWith('ru')) {
        welcomeMessage = `
🌟 *Добро пожаловать в Мистическую Нумерологию, ${userName}!* 🌟

Я — ваш проводник в мире тайных знаний. Здесь вы найдете 9 древних практик для познания себя:

🔢 *Нумерология* — магия чисел и код судьбы
📖 *Натальная карта* —определение личности по звездам
🧠 *Соционика* — 16 типов личности
🌞 *Астропсихология* — психология по звездам
ᚠ *Руны* — Старший Футарк

✨ *Нажмите кнопку ниже, чтобы открыть приложение* ✨
        `;
    } else {
        welcomeMessage = `
🌟 *Welcome to Mystical Numerology, ${userName}!* 🌟

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
        `;
    }

    try {
        // Отправляем сообщение с кнопкой WebApp
        await bot.sendMessage(chatId, welcomeMessage, {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: userLanguage.startsWith('ru') ? '🔮 Открыть портал знаний' : '🔮 Open knowledge portal',
                       // web_app: { url: getWebAppUrl() }
                        web_app: { url: 'https://t.me/you_desteny_bot/destalgo' }
                    }],
                    [
                        { text: userLanguage.startsWith('ru') ? '📚 О проекте' : '📚 About', callback_data: 'about' },
                        { text: userLanguage.startsWith('ru') ? '❓ Помощь' : '❓ Help', callback_data: 'help' }
                    ]
                ]
            }
        });

        console.log(`✅ Приветствие отправлено пользователю ${chatId}`);
    } catch (error) {
        console.error('❌ Ошибка отправки сообщения:', error);
    }
});

// Обработка callback-запросов
bot.on('callback_query', async (callbackQuery) => {
    const msg = callbackQuery.message;
    const chatId = msg.chat.id;
    const data = callbackQuery.data;
    const messageId = msg.message_id;
    const userLanguage = callbackQuery.from.language_code || 'ru';

    console.log(`📞 Callback получен: ${data} от ${chatId}`);

    try {
        if (data === 'about') {
            const aboutText = userLanguage.startsWith('ru') ?
                '*📚 О проекте "АЛГОРИТМ СУДЬБЫ"*\n\n' +
                'Этот проект объединяет 9 древних и современных практик самопознания:\n\n' +
                '• 🔢 Нумерология — код вашей судьбы\n' +
                '• 🌳 Родология — связь с предками\n' +
                '• 📜 И-Цзин — древняя Книга Перемен\n' +
                '• 🌀 Да Лю Жэнь — китайская метафизика\n' +
                '• ⚜️ Герметизм — 7 принципов\n' +
                '• 📖 Зоар — каббалистический АЛГОРИТМ\n' +
                '• 🧠 Соционика — 16 типов личности\n' +
                '• 🌞 Астропсихология — звездный портрет\n' +
                '• ᚠ Руны — древние символы\n\n' +
                '✨ *Все расчеты бесплатны и конфиденциальны* ✨\n\n' +
                '📌 *Как пользоваться:*\n' +
                '1. Нажмите "Открыть портал знаний"\n' +
                '2. Выберите интересующую практику\n' +
                '3. Введите данные для расчета\n' +
                '4. Получите персональный результат' :

                '*📚 About "DESTINY ALGORITHM" Project*\n\n' +
                'This project combines 9 ancient and modern practices for self-discovery:\n\n' +
                '• 🔢 Numerology — your destiny code\n' +
                '• 🌳 Rodology — connection with ancestors\n' +
                '• 📜 I-Ching — ancient Book of Changes\n' +
                '• 🌀 Da Liu Ren — Chinese metaphysics\n' +
                '• ⚜️ Hermeticism — 7 principles\n' +
                '• 📖 Zohar — Kabbalistic ALGORITHM\n' +
                '• 🧠 Socionics — 16 personality types\n' +
                '• 🌞 Astropsychology — star portrait\n' +
                '• ᚠ Runes — ancient symbols\n\n' +
                '✨ *All calculations are free and confidential* ✨\n\n' +
                '📌 *How to use:*\n' +
                '1. Click "Open knowledge portal"\n' +
                '2. Select the practice you are interested in\n' +
                '3. Enter data for calculation\n' +
                '4. Get a personalized result';

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
                '/help — показать это сообщение\n' +
                '/practices — список всех практик\n' +
                '/about — о проекте\n' +
                '/feedback — отправить отзыв\n\n' +
                '*Проблемы с открытием приложения:*\n' +
                '1️⃣ Убедитесь, что у вас последняя версия Telegram\n' +
                '2️⃣ Используйте мобильное приложение (не веб-версию)\n' +
                '3️⃣ Нажмите кнопку "🔮 Открыть портал знаний"\n' +
                '4️⃣ Если не открывается, напишите /feedback' :

                '❓ *Help*\n\n' +
                '*Bot commands:*\n' +
                '/start — start working\n' +
                '/help — show this message\n' +
                '/practices — list of all practices\n' +
                '/about — about the project\n' +
                '/feedback — send feedback\n\n' +
                '*Problems opening the app:*\n' +
                '1️⃣ Make sure you have the latest version of Telegram\n' +
                '2️⃣ Use the mobile app (not web version)\n' +
                '3️⃣ Click "🔮 Open knowledge portal" button\n' +
                '4️⃣ If it doesn\'t open, write /feedback';

            await bot.sendMessage(chatId, helpText, {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: userLanguage.startsWith('ru') ? '🔮 Открыть приложение' : '🔮 Open app',
                            web_app: { url: getWebAppUrl() } }]
                    ]
                }
            });
        }

        // Отвечаем на callback, чтобы убрать "часики"
        await bot.answerCallbackQuery(callbackQuery.id);
        console.log(`✅ Callback ${data} обработан для ${chatId}`);

    } catch (error) {
        console.error('❌ Ошибка обработки callback:', error);
    }
});

// Команда /help
bot.onText(/\/help/, async (msg) => {
    const chatId = msg.chat.id;
    const userLanguage = msg.from.language_code || 'ru';

    try {
        const helpText = userLanguage.startsWith('ru') ?
            '❓ *Команды бота:*\n\n' +
            '/start — начать работу\n' +
            '/help — показать это сообщение\n' +
            '/practices — список всех практик\n' +
            '/about — о проекте\n' +
            '/feedback — отправить отзыв' :

            '❓ *Bot commands:*\n\n' +
            '/start — start working\n' +
            '/help — show this message\n' +
            '/practices — list of all practices\n' +
            '/about — about the project\n' +
            '/feedback — send feedback';

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

// Команда /practices
bot.onText(/\/practices/, async (msg) => {
    const chatId = msg.chat.id;
    const userLanguage = msg.from.language_code || 'ru';

    try {
        const practicesText = userLanguage.startsWith('ru') ?
            '📚 *Доступные практики:*\n\n' +
            '1️⃣ *Нумерология* — расчет по ФИО и дате\n' +
            '2️⃣ *Родология* — исследование родовых программ\n' +
            '3️⃣ *И-Цзин* — ответ на вопрос по гексаграммам\n' +
            '4️⃣ *Да Лю Жэнь* — китайская метафизика\n' +
            '5️⃣ *Герметизм* — 7 принципов\n' +
            '6️⃣ *Зоар* — АЛГОРИТМ СУДЬБЫ\n' +
            '7️⃣ *Соционика* — определение типа личности\n' +
            '8️⃣ *Астропсихология* — натальная карта\n' +
            '9️⃣ *Руны* — гадание на Старшем Футарке' :

            '📚 *Available practices:*\n\n' +
            '1️⃣ *Numerology* — calculation by name and date\n' +
            '2️⃣ *Rodology* — research of ancestral programs\n' +
            '3️⃣ *I-Ching* — answer by hexagrams\n' +
            '4️⃣ *Da Liu Ren* — Chinese metaphysics\n' +
            '5️⃣ *Hermeticism* — 7 principles\n' +
            '6️⃣ *Zohar* — DESTINY ALGORITHM\n' +
            '7️⃣ *Socionics* — 16 personality types\n' +
            '8️⃣ *Astropsychology* — natal chart\n' +
            '9️⃣ *Runes* — Elder Futhark divination';

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

// Команда /feedback
bot.onText(/\/feedback/, async (msg) => {
    const chatId = msg.chat.id;
    const userLanguage = msg.from.language_code || 'ru';

    try {
        const feedbackText = userLanguage.startsWith('ru') ?
            '💬 *Обратная связь*\n\n' +
            'Вы можете отправить свои вопросы, предложения или сообщить об ошибке:\n\n' +
            '📧 Email: support@yournumerology.ru\n' +
            '💬 Telegram: @yournumerology_support\n\n' +
            'Мы ответим в ближайшее время!' :

            '💬 *Feedback*\n\n' +
            'You can send your questions, suggestions or report a bug:\n\n' +
            '📧 Email: support@yournumerology.ru\n' +
            '💬 Telegram: @yournumerology_support\n\n' +
            'We will reply as soon as possible!';

        await bot.sendMessage(chatId, feedbackText, { parse_mode: 'Markdown' });
    } catch (error) {
        console.error('❌ Ошибка отправки feedback:', error);
    }
});

// Обработка обычных сообщений
bot.on('message', async (msg) => {
    // Игнорируем команды (они уже обработаны выше)
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
        console.log(`🌐 Базовый URL: ${baseWebAppUrl}`);
        console.log(`⏱️  Режим: polling`);
        console.log(`👥 Поддержка: @yournumerology_support`);
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