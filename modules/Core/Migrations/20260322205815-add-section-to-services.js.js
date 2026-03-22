// modules/Core/Migrations/20260323000000-add-section-to-services.js
'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // 1. Проверяем, существует ли уже колонка section
        const tableInfo = await queryInterface.describeTable('Services');

        if (!tableInfo.section) {
            // 2. Добавляем колонку section как STRING
            await queryInterface.addColumn('Services', 'section', {
                type: Sequelize.STRING(50),
                allowNull: true,
                comment: 'Раздел услуги: numerology, astrology, astropsychology'
            });

            // 3. Добавляем индекс для колонки section
            await queryInterface.addIndex('Services', ['section'], {
                name: 'services_section_idx'
            });

            console.log(`[Core Migration]`, '📝 Колонка section добавлена');
        }

        // 4. Проставляем значения для существующих записей

        // Нумерология: все существующие сервисы с категорией forecast, compatibility, full_report
        // кроме тех, которые относятся к астропсихологии
        const numerologyResult = await queryInterface.sequelize.query(`
      UPDATE "Services" 
      SET section = 'numerology'
      WHERE section IS NULL
        AND category IN ('forecast', 'compatibility', 'full_report')
        AND code NOT IN ('natal_chart', 'astro_basic', 'astro_quick', 'astro_standard', 'astro_full', 'astro_premium')
      RETURNING code;
    `);

        console.log(`[Core Migration]`, `📊 Обновлено нумерологических услуг: ${numerologyResult[1] || 0}`);

        // 5. Астропсихология: проставляем для указанных кодов
        const astropsychologyResult = await queryInterface.sequelize.query(`
      UPDATE "Services" 
      SET section = 'astropsychology'
      WHERE section IS NULL
        AND code IN ('natal_chart', 'astro_basic', 'astro_quick', 'astro_standard', 'astro_full', 'astro_premium')
      RETURNING code;
    `);

        console.log(`[Core Migration]`, `📊 Обновлено услуг астропсихологии: ${astropsychologyResult[1] || 0}`);

        // 6. Если есть новые астрологические сервисы, которые нужно добавить
        const astroServices = [
            {
                code: 'natal_chart',
                name: 'Натальная карта',
                description: 'Полный астрологический разбор натальной карты',
                price: 1500.00,
                currency: 'RUB',
                type: 'one-time',
                category: 'full_report',
                sortOrder: 55,
                section: 'astropsychology'
            },
            {
                code: 'astro_basic',
                name: 'Базовый астрологический прогноз',
                description: 'Базовый прогноз на основе астрологических аспектов',
                price: 300.00,
                currency: 'RUB',
                type: 'one-time',
                category: 'forecast',
                sortOrder: 15,
                section: 'astropsychology'
            },
            {
                code: 'astro_quick',
                name: 'Быстрый астрологический анализ',
                description: 'Экспресс-анализ текущего положения планет',
                price: 100.00,
                currency: 'RUB',
                type: 'one-time',
                category: 'forecast',
                sortOrder: 12,
                section: 'astropsychology'
            },
            {
                code: 'astro_standard',
                name: 'Стандартный астрологический прогноз',
                description: 'Подробный астрологический прогноз с рекомендациями',
                price: 500.00,
                currency: 'RUB',
                type: 'one-time',
                category: 'forecast',
                sortOrder: 25,
                section: 'astropsychology'
            },
            {
                code: 'astro_full',
                name: 'Полный астрологический отчет',
                description: 'Детальный астрологический анализ личности',
                price: 2000.00,
                currency: 'RUB',
                type: 'one-time',
                category: 'full_report',
                sortOrder: 65,
                section: 'astropsychology'
            },
            {
                code: 'astro_premium',
                name: 'Премиум астрологический консалтинг',
                description: 'Расширенный астрологический анализ с персональными рекомендациями',
                price: 5000.00,
                currency: 'RUB',
                type: 'one-time',
                category: 'full_report',
                sortOrder: 90,
                section: 'astropsychology'
            }
        ];

        // 7. Добавляем новые астрологические сервисы, если их нет
        for (const service of astroServices) {
            const [existing] = await queryInterface.sequelize.query(
                `SELECT id FROM "Services" WHERE code = :code`,
                {
                    replacements: { code: service.code },
                    type: Sequelize.QueryTypes.SELECT
                }
            );

            if (!existing) {
                await queryInterface.bulkInsert('Services', [{
                    ...service,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }]);
                console.log(`[Core Migration]`, `✅ Добавлен новый сервис: ${service.code} (${service.section})`);
            } else {
                // Если сервис уже существует, но section не проставлен
                await queryInterface.sequelize.query(
                    `UPDATE "Services" 
           SET section = :section 
           WHERE code = :code AND section IS NULL`,
                    {
                        replacements: {
                            code: service.code,
                            section: service.section
                        }
                    }
                );
                console.log(`[Core Migration]`, `📌 Обновлен section для существующего сервиса: ${service.code} -> ${service.section}`);
            }
        }

        // 8. Проверяем, остались ли услуги с NULL section
        const nullSectionCount = await queryInterface.sequelize.query(
            `SELECT COUNT(*) as count FROM "Services" WHERE section IS NULL`,
            {
                type: Sequelize.QueryTypes.SELECT
            }
        );

        if (nullSectionCount[0].count > 0) {
            console.log(`[Core Migration]`, `⚠️ Осталось услуг с NULL section: ${nullSectionCount[0].count}`);
            console.log(`[Core Migration]`, `📌 Подписки (subscription) и возможно другие услуги остаются без раздела`);

            // Выводим список услуг с NULL section для информации
            const nullServices = await queryInterface.sequelize.query(
                `SELECT code, name, category FROM "Services" WHERE section IS NULL`,
                {
                    type: Sequelize.QueryTypes.SELECT
                }
            );

            nullServices.forEach(service => {
                console.log(`[Core Migration]`, `   - ${service.code} (${service.category}): ${service.name}`);
            });
        } else {
            console.log(`[Core Migration]`, `✅ Все услуги имеют проставленный раздел`);
        }

        console.log(`[Core Migration]`, `✅ Миграция завершена успешно`);
    },

    down: async (queryInterface, Sequelize) => {
        // Откат миграции: удаляем колонку section
        await queryInterface.removeColumn('Services', 'section');

        // Удаляем созданные астрологические сервисы (опционально)
        const astroCodes = ['natal_chart', 'astro_basic', 'astro_quick', 'astro_standard', 'astro_full', 'astro_premium'];

        for (const code of astroCodes) {
            await queryInterface.sequelize.query(
                `DELETE FROM "Services" WHERE code = :code`,
                {
                    replacements: { code }
                }
            );
        }

        console.log(`[Core Migration]`, `🗑️ Колонка section удалена, астрологические сервисы удалены`);
    }
};