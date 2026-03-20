// modules/astrology/astrology.init.js
const { models } = require('../../sequelize');

module.exports = {
    init: async () => {
        console.log('[Astrology Init] 🔄 Инициализация модуля астрологии...');

        try {
            // Проверяем наличие таблицы профилей
            const profilesCount = await models.AstrologyProfile?.count();
            console.log('[Astrology Init] 📊 Профилей пользователей:', profilesCount || 0);

            console.log('[Astrology Init] ✅ Модуль астрологии успешно инициализирован');

            return { success: true };

        } catch (error) {
            console.error('[Astrology Init] ❌ Ошибка инициализации:', error);
            throw error;
        }
    }
};

