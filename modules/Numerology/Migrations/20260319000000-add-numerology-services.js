// modules/Core/Migrations/20260319000000-add-numerology-services.js
'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        console.log('[Services Migration] 🔄 Добавление/обновление сервисов нумерологии...');

        try {
            const now = new Date();
            const results = {
                added: 0,
                updated: 0,
                skipped: 0
            };

            // Массив всех сервисов
            const services = [
                // Полный отчет
                {
                    code: 'forecast_full',
                    name: 'Полный нумерологический отчет',
                    description: 'Детальный анализ всех аспектов личности: судьба, имя, род, социальные оклики, ахиллесова пята, число управления, психологический портрет, карты Таро, знак зодиака, фен-шуй и полная интерпретация всех сфер жизни.',
                    price: 500.00,
                    currency: 'RUB',
                    type: 'one-time',
                    category: 'full_report',
                    sortOrder: 60,
                    isActive: true,
                    meta: '{}',
                    createdAt: now,
                    updatedAt: now
                },

                // Прогнозы
                {
                    code: 'forecast_day',
                    name: 'Прогноз на день',
                    description: 'Персональный нумерологический прогноз на текущий день. Узнайте, какая энергия будет влиять на вас сегодня, благоприятные часы, цвета и рекомендации.',
                    price: 50.00,
                    currency: 'RUB',
                    type: 'one-time',
                    category: 'forecast',
                    sortOrder: 10,
                    isActive: true,
                    meta: '{}',
                    createdAt: now,
                    updatedAt: now
                },
                {
                    code: 'forecast_week',
                    name: 'Прогноз на неделю',
                    description: 'Персональный нумерологический прогноз на предстоящую неделю. Поймите основные тенденции, благоприятные дни для важных дел и сферы, требующие особого внимания.',
                    price: 150.00,
                    currency: 'RUB',
                    type: 'one-time',
                    category: 'forecast',
                    sortOrder: 20,
                    isActive: true,
                    meta: '{}',
                    createdAt: now,
                    updatedAt: now
                },
                {
                    code: 'forecast_month',
                    name: 'Прогноз на месяц',
                    description: 'Персональный нумерологический прогноз на месяц. Узнайте, какие задачи лучше решать в этом месяце, а что отложить. Поймите энергетику каждого периода.',
                    price: 300.00,
                    currency: 'RUB',
                    type: 'one-time',
                    category: 'forecast',
                    sortOrder: 30,
                    isActive: true,
                    meta: '{}',
                    createdAt: now,
                    updatedAt: now
                },
                {
                    code: 'forecast_year',
                    name: 'Прогноз на год',
                    description: 'Персональный нумерологический прогноз на год. Узнайте главные тенденции года, сферы роста, возможные вызовы и благоприятные периоды для важных решений.',
                    price: 500.00,
                    currency: 'RUB',
                    type: 'one-time',
                    category: 'forecast',
                    sortOrder: 40,
                    isActive: true,
                    meta: '{}',
                    createdAt: now,
                    updatedAt: now
                },

                // Совместимость
                {
                    code: 'compatibility',
                    name: 'Совместимость с партнером',
                    description: 'Нумерологический расчет совместимости с партнером. Узнайте сильные и слабые стороны вашего союза, зоны роста и потенциал отношений.',
                    price: 400.00,
                    currency: 'RUB',
                    type: 'one-time',
                    category: 'compatibility',
                    sortOrder: 50,
                    isActive: true,
                    meta: '{}',
                    createdAt: now,
                    updatedAt: now
                },

                // Подписки
                {
                    code: 'subscription_monthly',
                    name: 'Подписка на месяц',
                    description: 'Неограниченные прогнозы на день, неделю и месяц в течение 30 дней. Экономьте до 70% при регулярных расчетах.',
                    price: 1000.00,
                    currency: 'RUB',
                    type: 'subscription',
                    category: 'subscription',
                    duration: 30,
                    sortOrder: 70,
                    isActive: true,
                    meta: '{}',
                    createdAt: now,
                    updatedAt: now
                },
                {
                    code: 'subscription_yearly',
                    name: 'Подписка на год',
                    description: 'Неограниченные прогнозы на день, неделю и месяц в течение 365 дней. Максимальная выгода для тех, кто регулярно следит за своей нумерологией.',
                    price: 6000.00,
                    currency: 'RUB',
                    type: 'subscription',
                    category: 'subscription',
                    duration: 365,
                    sortOrder: 80,
                    isActive: true,
                    meta: '{}',
                    createdAt: now,
                    updatedAt: now
                },
                {
                    code: 'forecast_basic',
                    name: 'Базовый расчет',
                    description: 'Персональный нумерологический  базовый',
                    price: 0,
                    currency: 'RUB',
                    type: 'one-time',
                    category: 'forecast',
                    sortOrder: 10,
                    isActive: true,
                    meta: '{}',
                    createdAt: now,
                    updatedAt: now
                },
            ];

            // Обрабатываем каждый сервис по отдельности
            for (const service of services) {
                // Проверяем, существует ли сервис
                const existing = await queryInterface.sequelize.query(
                    'SELECT id FROM "Services" WHERE code = :code',
                    {
                        replacements: { code: service.code },
                        type: Sequelize.QueryTypes.SELECT
                    }
                );

                if (existing.length > 0) {
                    // Сервис существует - обновляем
                    await queryInterface.sequelize.query(
                        `UPDATE "Services" SET 
                         name = :name,
                         description = :description,
                         price = :price,
                         currency = :currency,
                         type = :type,
                         category = :category,
                         "sortOrder" = :sortOrder,
                         "isActive" = :isActive,
                         meta = :meta,
                         duration = :duration,
                         "updatedAt" = :updatedAt
                         WHERE code = :code`,
                        {
                            replacements: {
                                code: service.code,
                                name: service.name,
                                description: service.description,
                                price: service.price,
                                currency: service.currency,
                                type: service.type,
                                category: service.category,
                                sortOrder: service.sortOrder,
                                isActive: service.isActive,
                                meta: service.meta,
                                duration: service.duration || null,
                                updatedAt: service.updatedAt
                            },
                            type: Sequelize.QueryTypes.UPDATE
                        }
                    );
                    results.updated++;
                    console.log(`   🔄 Обновлен: ${service.code}`);
                } else {
                    // Сервиса нет - добавляем
                    await queryInterface.sequelize.query(
                        `INSERT INTO "Services" 
                         ("code", "name", "description", "price", "currency", "type", 
                          "category", "sortOrder", "isActive", "meta", "duration", 
                          "createdAt", "updatedAt")
                         VALUES 
                         (:code, :name, :description, :price, :currency, :type,
                          :category, :sortOrder, :isActive, :meta, :duration,
                          :createdAt, :updatedAt)`,
                        {
                            replacements: {
                                code: service.code,
                                name: service.name,
                                description: service.description,
                                price: service.price,
                                currency: service.currency,
                                type: service.type,
                                category: service.category,
                                sortOrder: service.sortOrder,
                                isActive: service.isActive,
                                meta: service.meta,
                                duration: service.duration || null,
                                createdAt: service.createdAt,
                                updatedAt: service.updatedAt
                            },
                            type: Sequelize.QueryTypes.INSERT
                        }
                    );
                    results.added++;
                    console.log(`   ✅ Добавлен: ${service.code}`);
                }
            }

            // Проверяем общее количество сервисов
            const totalCount = await queryInterface.sequelize.query(
                'SELECT COUNT(*) as count FROM "Services"',
                { type: Sequelize.QueryTypes.SELECT }
            );

            console.log(`[Services Migration] 📊 Результаты:`);
            console.log(`   ✅ Добавлено: ${results.added}`);
            console.log(`   🔄 Обновлено: ${results.updated}`);
            console.log(`   📊 Всего сервисов: ${totalCount[0].count}`);

        } catch (error) {
            console.error('[Services Migration] ❌ Ошибка при добавлении сервисов:', error);
            throw error;
        }
    },

    down: async (queryInterface, Sequelize) => {
        console.log('[Services Migration] 🔄 Откат миграции...');

        try {
            // Удаляем добавленные сервисы
            const codes = [
                'forecast_full',
                'forecast_day',
                'forecast_week',
                'forecast_month',
                'forecast_year',
                'compatibility',
                'subscription_monthly',
                'subscription_yearly'
            ];

            for (const code of codes) {
                await queryInterface.sequelize.query(
                    'DELETE FROM "Services" WHERE code = :code',
                    {
                        replacements: { code },
                        type: Sequelize.QueryTypes.DELETE
                    }
                );
            }

            console.log(`[Services Migration] ✅ Удалено сервисов: ${codes.length}`);

        } catch (error) {
            console.error('[Services Migration] ❌ Ошибка при откате:', error);
            throw error;
        }
    }
};