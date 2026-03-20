// modules/Tarot/Tarot.init.js
const { models } = require('../../sequelize');
const TarotService = require('./Services/TarotService');

module.exports = {
    init: async () => {
        console.log('[Tarot Init] 🔮 Инициализация модуля Таро...');

        try {
            // Проверяем наличие карт в базе данных
            const cardsCount = await models.TarotCard?.count();

            if (!cardsCount || cardsCount === 0) {
                console.log('[Tarot Init] ⚠️ Карты Таро не найдены в базе данных');
                console.log('[Tarot Init] ℹ️ Выполните миграцию для заполнения карт');
            } else {
                console.log('[Tarot Init] 📊 Найдено карт в базе:', cardsCount);
            }

            // Инициализируем сервис
            const tarotService = new TarotService();
            console.log('[Tarot Init] ✅ Сервис Таро инициализирован');

            return { success: true, service: tarotService };

        } catch (error) {
            console.error('[Tarot Init] ❌ Ошибка инициализации:', error);
            throw error;
        }
    }
};