// modules/Numerology/Numerology.init.js
const { models } = require('../../sequelize');

module.exports = {
    init: async () => {
        console.log('[Numerology Init] 🔄 Инициализация модуля нумерологии...');

        try {
            // Проверяем наличие таблицы профилей
            const profilesCount = await models.NumerologyProfile?.count();
            console.log('[Numerology Init] 📊 Профилей пользователей:', profilesCount || 0);

            // Проверяем наличие сервисов в таблице Services
            const services = await models.Service?.findAll({
                where: { category: 'forecast' }
            });

            if (!services || services.length === 0) {
                console.log('[Numerology Init] ⚠️ Не найдены услуги прогнозов в таблице Services');
                console.log('[Numerology Init] ℹ️ Убедитесь, что миграции Core выполнены');
            } else {
                console.log('[Numerology Init] 📊 Найдено услуг прогнозов:', services.length);
            }

            console.log('[Numerology Init] ✅ Модуль нумерологии успешно инициализирован');

            return { success: true };

        } catch (error) {
            console.error('[Numerology Init] ❌ Ошибка инициализации:', error);
            throw error;
        }
    }
};