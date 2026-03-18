// modules/Logs/Logs.init.js
const { models } = require('../../sequelize');
const LoggerService = require('./Services/LoggerService');
const {Op} = require("sequelize");

module.exports = {
    /**
     * Основная функция инициализации модуля
     * Вызывается после загрузки всех моделей
     */
    init: async () => {
      //  console.log('[Logs Init]', '🔄 Инициализация модуля логирования...');

        try {
            // Проверяем наличие таблицы логов
            const logsCount = await models.Log.count();
        //    console.log('[Logs Init]', `📊 Всего записей в логах: ${logsCount}`);

            // Очистка старых логов при запуске (опционально)
            const logger = new LoggerService();
            const cleanedCount = await logger.cleanup();

            if (cleanedCount > 0) {
                console.log('[Logs Init]', `🧹 Очищено ${cleanedCount} старых логов`);
            }

            // Проверяем, есть ли непрочитанные ошибки
            const unreadErrors = await models.Log.count({
                where: {
                    level: { [Op.in]: ['error', 'critical'] },
                    isRead: false
                }
            });


          //  console.log('[Logs Init]', '✅ Модуль логирования успешно инициализирован');

            // Возвращаем публичный API модуля для использования в других модулях
            return {
                logger: new LoggerService(),
                success: true
            };

        } catch (error) {
            console.error('[Logs Init]', '❌ Ошибка инициализации модуля логирования:', error);
            throw error;
        }
    },

    /**
     * Функция для проверки зависимостей
     * Может использоваться для проверки наличия необходимых модулей
     */
    checkDependencies: () => {
        const requiredDeps = ['Core']; // Зависит от Core (модель User)
        const missing = [];

        requiredDeps.forEach(dep => {
            try {
                require.resolve(`../${dep}/${dep}.init.js`);
            } catch (e) {
                missing.push(dep);
            }
        });

        if (missing.length > 0) {
            console.warn('[Logs Init]', `⚠️ Отсутствуют зависимости: ${missing.join(', ')}`);
            return false;
        }

        return true;
    }
};