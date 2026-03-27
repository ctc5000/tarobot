// modules/Astropsychology/Migrations/20260328000000-add-astropsychology-services-updated.js
'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        console.log('[Astropsychology Migration] 🔄 Добавление/обновление услуг астропсихологии...');

        // Сначала проверяем структуру таблицы Services, чтобы узнать правильные имена колонок
        try {
            const [columns] = await queryInterface.sequelize.query(
                `SELECT column_name FROM information_schema.columns WHERE table_name = 'Services'`
            );
            console.log('[Astropsychology Migration] 📋 Колонки в таблице Services:', columns.map(c => c.column_name).join(', '));
        } catch (error) {
            console.warn('[Astropsychology Migration] ⚠️ Не удалось получить структуру таблицы:', error.message);
        }

        // Проверяем, есть ли уже услуги в таблице Services
        const existingServices = await queryInterface.sequelize.query(
            'SELECT code FROM "Services" WHERE code IN (:codes)',
            {
                replacements: { codes: ['astro_basic', 'astro_standard', 'astro_full', 'astro_premium'] },
                type: Sequelize.QueryTypes.SELECT
            }
        );

        const existingCodes = existingServices.map(s => s.code);
        const now = new Date();

        // Базовый анализ (бесплатный)
        if (!existingCodes.includes('astro_basic')) {
            await queryInterface.bulkInsert('Services', [{
                code: 'astro_basic',
                name: 'Базовый астропсихологический анализ',
                description: 'Основной психологический портрет по Солнцу, Луне и Асценденту. Бесплатно.',
                price: 0,
                currency: 'RUB',
                type: 'one-time',
                category: 'forecast',
                section: 'astropsychology',
                sortOrder: 100,
                meta: JSON.stringify({ type: 'astro_basic', features: ['ascendant', 'sun', 'moon'] }),
                createdAt: now,
                updatedAt: now
            }]);
            console.log(`   ✅ Добавлена услуга: astro_basic`);
        } else {
            // Обновляем существующую
            await queryInterface.sequelize.query(
                `UPDATE "Services" SET 
                    price = 0,
                    description = 'Основной психологический портрет по Солнцу, Луне и Асценденту. Бесплатно.',
                    "updatedAt" = NOW()
                WHERE code = 'astro_basic'`
            );
            console.log(`   📌 Обновлена услуга: astro_basic`);
        }

        // Стандартный портрет (300 руб)
        if (!existingCodes.includes('astro_standard')) {
            await queryInterface.bulkInsert('Services', [{
                code: 'astro_standard',
                name: 'Стандартный астропсихологический портрет',
                description: 'Полный психологический портрет личности (все планеты в знаках)',
                price: 300,
                currency: 'RUB',
                type: 'one-time',
                category: 'forecast',
                section: 'astropsychology',
                sortOrder: 120,
                meta: JSON.stringify({ type: 'astro_standard', features: ['all_planets', 'psychology', 'forecast'] }),
                createdAt: now,
                updatedAt: now
            }]);
            console.log(`   ✅ Добавлена услуга: astro_standard`);
        } else {
            await queryInterface.sequelize.query(
                `UPDATE "Services" SET 
                    price = 300,
                    description = 'Полный психологический портрет личности (все планеты в знаках)',
                    "updatedAt" = NOW()
                WHERE code = 'astro_standard'`
            );
            console.log(`   📌 Обновлена услуга: astro_standard`);
        }

        // Глубокий анализ (500 руб)
        if (!existingCodes.includes('astro_full')) {
            await queryInterface.bulkInsert('Services', [{
                code: 'astro_full',
                name: 'Глубокий астропсихологический анализ',
                description: 'Глубокий анализ личности, аспекты, дома, годовой прогноз',
                price: 500,
                currency: 'RUB',
                type: 'one-time',
                category: 'full_report',
                section: 'astropsychology',
                sortOrder: 130,
                meta: JSON.stringify({ type: 'astro_full', features: ['aspects', 'houses', 'compatibility', 'yearly'] }),
                createdAt: now,
                updatedAt: now
            }]);
            console.log(`   ✅ Добавлена услуга: astro_full`);
        } else {
            await queryInterface.sequelize.query(
                `UPDATE "Services" SET 
                    price = 500,
                    description = 'Глубокий анализ личности, аспекты, дома, годовой прогноз',
                    "updatedAt" = NOW()
                WHERE code = 'astro_full'`
            );
            console.log(`   📌 Обновлена услуга: astro_full`);
        }

        // Премиум-портрет (1000 руб)
        if (!existingCodes.includes('astro_premium')) {
            await queryInterface.bulkInsert('Services', [{
                code: 'astro_premium',
                name: 'Премиум-портрет личности',
                description: 'Максимально полный разбор личности + транзитный прогноз + кармический анализ',
                price: 1000,
                currency: 'RUB',
                type: 'one-time',
                category: 'full_report',
                section: 'astropsychology',
                sortOrder: 140,
                meta: JSON.stringify({ type: 'astro_premium', features: ['karma', 'transits', 'recommendations'] }),
                createdAt: now,
                updatedAt: now
            }]);
            console.log(`   ✅ Добавлена услуга: astro_premium`);
        } else {
            await queryInterface.sequelize.query(
                `UPDATE "Services" SET 
                    price = 1000,
                    description = 'Максимально полный разбор личности + транзитный прогноз + кармический анализ',
                    "updatedAt" = NOW()
                WHERE code = 'astro_premium'`
            );
            console.log(`   📌 Обновлена услуга: astro_premium`);
        }

        // Обновляем ENUM в Calculations, если нужно (только для PostgreSQL)
        try {
            const [enumTypeExists] = await queryInterface.sequelize.query(
                `SELECT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_Calculations_calculationType');`
            );

            if (enumTypeExists[0].exists) {
                const enumValues = ['astro_basic', 'astro_standard', 'astro_full', 'astro_premium'];
                for (const value of enumValues) {
                    await queryInterface.sequelize.query(
                        `ALTER TYPE "enum_Calculations_calculationType" ADD VALUE IF NOT EXISTS '${value}';`
                    );
                }
                console.log(`   ✅ ENUM значения обновлены`);
            }
        } catch (error) {
            console.warn(`   ⚠️ Не удалось обновить ENUM (возможно, не PostgreSQL): ${error.message}`);
        }

        console.log('[Astropsychology Migration] ✅ Услуги астропсихологии обновлены');
    },

    down: async (queryInterface, Sequelize) => {
        console.log('[Astropsychology Migration] ⚠️ Удаление услуг астропсихологии...');
        const codes = ['astro_basic', 'astro_standard', 'astro_full', 'astro_premium'];
        for (const code of codes) {
            await queryInterface.sequelize.query(
                'DELETE FROM "Services" WHERE code = :code',
                { replacements: { code } }
            );
        }
        console.log('[Astropsychology Migration] 🗑️ Услуги астропсихологии удалены');
    }
};