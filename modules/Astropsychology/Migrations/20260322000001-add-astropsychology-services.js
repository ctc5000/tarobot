// modules/Astropsychology/Migrations/20260322000001-add-astropsychology-services.js
'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        console.log('[Astropsychology Migration] 🔄 Добавление услуг астропсихологии...');

        const services = [
            {
                code: 'astro_basic',
                name: 'Базовый астропсихологический анализ',
                description: 'Основной психологический портрет по Солнцу, Луне и Асценденту. Бесплатно.',
                price: 0,
                currency: 'RUB',
                type: 'one-time',
                category: 'forecast',
                sortOrder: 100,
                meta: JSON.stringify({ type: 'astro_basic', features: ['ascendant', 'sun', 'moon'] }),
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                code: 'astro_quick',
                name: 'Экспресс-анализ',
                description: 'Быстрый анализ ключевых планет (Меркурий, Венера, Марс)',
                price: 100,
                currency: 'RUB',
                type: 'one-time',
                category: 'forecast',
                sortOrder: 110,
                meta: JSON.stringify({ type: 'astro_quick', features: ['mercury', 'venus', 'mars'] }),
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                code: 'astro_standard',
                name: 'Стандартный астропсихологический портрет',
                description: 'Полный психологический портрет личности (все планеты в знаках)',
                price: 300,
                currency: 'RUB',
                type: 'one-time',
                category: 'forecast',
                sortOrder: 120,
                meta: JSON.stringify({ type: 'astro_standard', features: ['all_planets', 'psychology', 'forecast'] }),
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                code: 'astro_full',
                name: 'Полный астропсихологический анализ',
                description: 'Глубокий анализ личности, аспекты, совместимость, годовой прогноз',
                price: 500,
                currency: 'RUB',
                type: 'one-time',
                category: 'full_report',
                sortOrder: 130,
                meta: JSON.stringify({ type: 'astro_full', features: ['aspects', 'houses', 'compatibility', 'yearly'] }),
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                code: 'astro_premium',
                name: 'Премиум-портрет личности',
                description: 'Максимально полный разбор личности + транзитный прогноз',
                price: 1000,
                currency: 'RUB',
                type: 'one-time',
                category: 'full_report',
                sortOrder: 140,
                meta: JSON.stringify({ type: 'astro_premium', features: ['karma', 'transits', 'recommendations'] }),
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        for (const service of services) {
            const existing = await queryInterface.sequelize.query(
                'SELECT id FROM "Services" WHERE code = :code',
                {
                    replacements: { code: service.code },
                    type: Sequelize.QueryTypes.SELECT
                }
            );

            if (existing.length === 0) {
                await queryInterface.bulkInsert('Services', [service]);
                console.log(`   ✅ Добавлен сервис: ${service.code}`);
            } else {
                console.log(`   📌 Сервис ${service.code} уже существует`);
            }
        }

        console.log('[Astropsychology Migration] ✅ Услуги астропсихологии добавлены');
    },

    down: async (queryInterface, Sequelize) => {
        const codes = ['astro_basic', 'astro_quick', 'astro_standard', 'astro_full', 'astro_premium'];
        for (const code of codes) {
            await queryInterface.sequelize.query(
                'DELETE FROM "Services" WHERE code = :code',
                { replacements: { code } }
            );
        }
        console.log('[Astropsychology Migration] 🗑️ Услуги астропсихологии удалены');
    }
};