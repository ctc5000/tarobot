// modules/Astrology/Migrations/20260329000000-add-astrology-services.js
'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        console.log('[Astrology Migration] 🔄 Добавление/обновление услуг астрологии...');

        // Проверяем существование поля section в таблице Services
        try {
            const [columns] = await queryInterface.sequelize.query(
                `SELECT column_name FROM information_schema.columns WHERE table_name = 'Services' AND column_name = 'section';`
            );

            if (columns.length === 0) {
                console.log('[Astrology Migration] 📌 Добавляем поле section в таблицу Services...');
                await queryInterface.addColumn('Services', 'section', {
                    type: Sequelize.STRING(50),
                    allowNull: true,
                    defaultValue: 'general',
                    comment: 'Секция/модуль, к которому относится услуга'
                });
            }
        } catch (error) {
            console.warn('[Astrology Migration] ⚠️ Не удалось проверить/добавить поле section:', error.message);
        }

        const existingServices = await queryInterface.sequelize.query(
            'SELECT code FROM "Services" WHERE code IN (:codes)',
            {
                replacements: { codes: ['natal_basic', 'natal_standard', 'natal_full', 'natal_premium'] },
                type: Sequelize.QueryTypes.SELECT
            }
        );

        const existingCodes = existingServices.map(s => s.code);
        const now = new Date();

        // Базовый анализ (бесплатный)
        if (!existingCodes.includes('natal_basic')) {
            await queryInterface.bulkInsert('Services', [{
                code: 'natal_basic',
                name: 'Базовый астрологический портрет',
                description: 'Основные положения планет, асцендент, базовая интерпретация',
                price: 0,
                currency: 'RUB',
                type: 'one-time',
                category: 'forecast',
                section: 'astrology',
                sortOrder: 100,
                meta: JSON.stringify({ type: 'natal_basic', features: ['ascendant', 'sun', 'moon'] }),
                createdAt: now,
                updatedAt: now
            }]);
            console.log(`   ✅ Добавлена услуга: natal_basic`);
        } else {
            await queryInterface.sequelize.query(
                `UPDATE "Services" SET 
                    price = 0,
                    description = 'Основные положения планет, асцендент, базовая интерпретация',
                    section = 'astrology',
                    "updatedAt" = NOW()
                WHERE code = 'natal_basic'`
            );
            console.log(`   📌 Обновлена услуга: natal_basic`);
        }

        // Стандартный портрет (400 руб)
        if (!existingCodes.includes('natal_standard')) {
            await queryInterface.bulkInsert('Services', [{
                code: 'natal_standard',
                name: 'Стандартный астрологический портрет',
                description: 'Полный разбор натальной карты с домами и аспектами',
                price: 400,
                currency: 'RUB',
                type: 'one-time',
                category: 'forecast',
                section: 'astrology',
                sortOrder: 110,
                meta: JSON.stringify({ type: 'natal_standard', features: ['all_planets', 'houses', 'aspects'] }),
                createdAt: now,
                updatedAt: now
            }]);
            console.log(`   ✅ Добавлена услуга: natal_standard`);
        } else {
            await queryInterface.sequelize.query(
                `UPDATE "Services" SET 
                    price = 400,
                    description = 'Полный разбор натальной карты с домами и аспектами',
                    section = 'astrology',
                    "updatedAt" = NOW()
                WHERE code = 'natal_standard'`
            );
        }

        // Глубокий анализ (700 руб)
        if (!existingCodes.includes('natal_full')) {
            await queryInterface.bulkInsert('Services', [{
                code: 'natal_full',
                name: 'Глубокий астрологический анализ',
                description: 'Глубокий анализ личности, аспекты, дома, расширенный отчет',
                price: 700,
                currency: 'RUB',
                type: 'one-time',
                category: 'full_report',
                section: 'astrology',
                sortOrder: 120,
                meta: JSON.stringify({ type: 'natal_full', features: ['aspects', 'houses', 'expanded_report'] }),
                createdAt: now,
                updatedAt: now
            }]);
            console.log(`   ✅ Добавлена услуга: natal_full`);
        } else {
            await queryInterface.sequelize.query(
                `UPDATE "Services" SET 
                    price = 700,
                    description = 'Глубокий анализ личности, аспекты, дома, расширенный отчет',
                    section = 'astrology',
                    "updatedAt" = NOW()
                WHERE code = 'natal_full'`
            );
        }

        // Премиум-портрет (1200 руб)
        if (!existingCodes.includes('natal_premium')) {
            await queryInterface.bulkInsert('Services', [{
                code: 'natal_premium',
                name: 'Премиум-портрет личности',
                description: 'Максимально полный разбор + кармический анализ + PDF отчет',
                price: 1200,
                currency: 'RUB',
                type: 'one-time',
                category: 'full_report',
                section: 'astrology',
                sortOrder: 130,
                meta: JSON.stringify({ type: 'natal_premium', features: ['karma', 'transits', 'recommendations'] }),
                createdAt: now,
                updatedAt: now
            }]);
            console.log(`   ✅ Добавлена услуга: natal_premium`);
        } else {
            await queryInterface.sequelize.query(
                `UPDATE "Services" SET 
                    price = 1200,
                    description = 'Максимально полный разбор + кармический анализ + PDF отчет',
                    section = 'astrology',
                    "updatedAt" = NOW()
                WHERE code = 'natal_premium'`
            );
        }

        // Обновляем ENUM в Calculations
        try {
            const [enumTypeExists] = await queryInterface.sequelize.query(
                `SELECT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_Calculations_calculationType');`
            );

            if (enumTypeExists && enumTypeExists[0] && enumTypeExists[0].exists) {
                const enumValues = ['natal_basic', 'natal_standard', 'natal_full', 'natal_premium'];
                for (const value of enumValues) {
                    try {
                        await queryInterface.sequelize.query(
                            `ALTER TYPE "enum_Calculations_calculationType" ADD VALUE IF NOT EXISTS '${value}';`
                        );
                    } catch (e) {
                        // Игнорируем
                    }
                }
                console.log(`   ✅ ENUM значения обновлены`);
            }
        } catch (error) {
            console.warn(`   ⚠️ Не удалось обновить ENUM: ${error.message}`);
        }

        console.log('[Astrology Migration] ✅ Услуги астрологии обновлены');
    },

    down: async (queryInterface, Sequelize) => {
        console.log('[Astrology Migration] ⚠️ Удаление услуг астрологии...');
        const codes = ['natal_basic', 'natal_standard', 'natal_full', 'natal_premium'];
        for (const code of codes) {
            await queryInterface.sequelize.query(
                'DELETE FROM "Services" WHERE code = :code',
                { replacements: { code } }
            );
        }
        console.log('[Astrology Migration] 🗑️ Услуги астрологии удалены');
    }
};