const { models } = require('../../sequelize');
const AstropsychologyService = require('./Services/AstropsychologyService');

module.exports = {
    init: async () => {
        console.log('[Astropsychology Init] 🔄 Инициализация модуля астропсихологии...');

        try {
            // Инициализируем сервис
            const service = new AstropsychologyService();
            console.log('[Astropsychology Init] ✅ Сервис астропсихологии инициализирован');

            return { success: true, service };

        } catch (error) {
            console.error('[Astropsychology Init] ❌ Ошибка инициализации:', error);
            throw error;
        }
    }
};