// modules/Core/Migrations/20260321000000-add-astrology-services.js
'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        console.log('[Services Migration] 🔄 Добавление сервиса натальной карты...');

        try {
            const now = new Date();

            const existing = await queryInterface.sequelize.query(
                'SELECT id FROM "Services" WHERE code = :code',
                {
                    replacements: { code: 'natal_chart' },
                    type: Sequelize.QueryTypes.SELECT
                }
            );

            if (existing.length === 0) {
                await queryInterface.sequelize.query(
                    `INSERT INTO "Services" 
                     ("code", "name", "description", "price", "currency", "type", 
                      "category", "sortOrder", "isActive", "meta", 
                      "createdAt", "updatedAt")
                     VALUES 
                     (:code, :name, :description, :price, :currency, :type,
                      :category, :sortOrder, :isActive, :meta,
                      :createdAt, :updatedAt)`,
                    {
                        replacements: {
                            code: 'natal_chart',
                            name: 'Натальная карта',
                            description: 'Построение натальной карты с полной интерпретацией: положение планет в знаках и домах, аспекты, психологический портрет.',
                            price: 200.00,
                            currency: 'RUB',
                            type: 'one-time',
                            category: 'forecast',
                            sortOrder: 55,
                            isActive: true,
                            meta: '{}',
                            createdAt: now,
                            updatedAt: now
                        },
                        type: Sequelize.QueryTypes.INSERT
                    }
                );
                console.log('   ✅ Добавлен сервис: natal_chart');
            } else {
                console.log('   📌 Сервис natal_chart уже существует');
            }

        } catch (error) {
            console.error('[Services Migration] ❌ Ошибка:', error);
            throw error;
        }
    },

    down: async (queryInterface, Sequelize) => {
        try {
            await queryInterface.sequelize.query(
                'DELETE FROM "Services" WHERE code = :code',
                {
                    replacements: { code: 'natal_chart' },
                    type: Sequelize.QueryTypes.DELETE
                }
            );
            console.log('   ✅ Удален сервис: natal_chart');
        } catch (error) {
            console.error('[Services Migration] ❌ Ошибка при откате:', error);
            throw error;
        }
    }
};