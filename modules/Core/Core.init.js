// modules/Core/Core.init.js
const { models } = require('../../sequelize');

module.exports = {
    init: async () => {
        //console.log('[Core Init]', '🔄 Инициализация модуля Core...');

        try {
            // Проверяем наличие русского языка по умолчанию в настройках пользователей
            const usersCount = await models.User.count();
            //console.log('[Core Init]', `📊 Всего пользователей: ${usersCount}`);

            // Здесь можно добавить любую инициализацию при запуске
            // Например, проверку и обновление статусов подписок

            //console.log('[Core Init]', '✅ Модуль Core успешно инициализирован');
            return { success: true };
        } catch (error) {
            console.error('[Core Init]', '❌ Ошибка инициализации модуля Core:', error);
            throw error;
        }
    }
};