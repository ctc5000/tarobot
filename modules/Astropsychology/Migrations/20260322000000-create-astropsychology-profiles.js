// modules/Astropsychology/Migrations/20260322000000-create-astropsychology-profiles.js
'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tables = await queryInterface.showAllTables();

        if (!tables.includes('astropsychology_profiles')) {
            await queryInterface.createTable('astropsychology_profiles', {
                id: {
                    type: Sequelize.UUID,
                    defaultValue: Sequelize.UUIDV4,
                    primaryKey: true
                },
                user_id: {
                    type: Sequelize.UUID,  // ИСПРАВЛЕНО: INTEGER -> UUID
                    allowNull: false,
                    comment: 'ID пользователя'
                },
                full_name: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                birth_date: {
                    type: Sequelize.DATEONLY,
                    allowNull: false
                },
                birth_time: {
                    type: Sequelize.TIME,
                    allowNull: false,
                    defaultValue: '12:00:00'
                },
                latitude: {
                    type: Sequelize.DECIMAL(10, 6),
                    allowNull: true,
                    defaultValue: 55.7558
                },
                longitude: {
                    type: Sequelize.DECIMAL(10, 6),
                    allowNull: true,
                    defaultValue: 37.6173
                },
                last_calculation: {
                    type: Sequelize.DATE,
                    allowNull: true
                },
                calculation_count: {
                    type: Sequelize.INTEGER,
                    defaultValue: 0
                },
                meta: {
                    type: Sequelize.JSONB,
                    defaultValue: {}
                },
                created_at: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
                },
                updated_at: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
                }
            });

            // Добавляем индекс
            await queryInterface.addIndex('astropsychology_profiles', ['user_id'], {
                name: 'astropsychology_profiles_user_id_idx'
            });

            // Добавляем внешний ключ
            try {
                await queryInterface.addConstraint('astropsychology_profiles', {
                    fields: ['user_id'],
                    type: 'foreign key',
                    name: 'astropsychology_profiles_user_id_fk',
                    references: {
                        table: 'users',
                        field: 'id'
                    },
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE'
                });
                console.log('[Astropsychology Migration] ✅ Внешний ключ добавлен');
            } catch (err) {
                console.warn('[Astropsychology Migration] ⚠️ Не удалось создать внешний ключ:', err.message);
            }

            console.log('[Astropsychology Migration] ✅ Таблица astropsychology_profiles создана');
        } else {
            console.log('[Astropsychology Migration] 📌 Таблица astropsychology_profiles уже существует');

            // Если таблица существует, проверяем и исправляем тип user_id
            try {
                // Проверяем текущий тип поля user_id
                const [columnInfo] = await queryInterface.sequelize.query(`
                    SELECT data_type 
                    FROM information_schema.columns 
                    WHERE table_name = 'astropsychology_profiles' 
                    AND column_name = 'user_id'
                `);

                const currentType = columnInfo[0]?.data_type;

                if (currentType !== 'uuid') {
                    console.log(`[Astropsychology Migration] 📌 Текущий тип user_id: ${currentType}, меняем на UUID...`);

                    // Проверяем, есть ли данные в таблице
                    const [countResult] = await queryInterface.sequelize.query(
                        'SELECT COUNT(*) as count FROM astropsychology_profiles'
                    );
                    const hasData = parseInt(countResult[0].count) > 0;

                    if (hasData) {
                        console.log('[Astropsychology Migration] ⚠️ В таблице есть данные, нужно их обновить вручную');
                        console.log('[Astropsychology Migration] ℹ️ Рекомендуется очистить таблицу или выполнить миграцию вручную');
                    } else {
                        // Удаляем старый внешний ключ, если есть
                        try {
                            await queryInterface.removeConstraint('astropsychology_profiles', 'astropsychology_profiles_user_id_fk');
                        } catch (e) {
                            // Игнорируем
                        }

                        // Меняем тип поля
                        await queryInterface.changeColumn('astropsychology_profiles', 'user_id', {
                            type: Sequelize.UUID,
                            allowNull: false
                        });

                        // Добавляем внешний ключ
                        try {
                            await queryInterface.addConstraint('astropsychology_profiles', {
                                fields: ['user_id'],
                                type: 'foreign key',
                                name: 'astropsychology_profiles_user_id_fk',
                                references: {
                                    table: 'users',
                                    field: 'id'
                                },
                                onDelete: 'CASCADE',
                                onUpdate: 'CASCADE'
                            });
                            console.log('[Astropsychology Migration] ✅ Внешний ключ добавлен');
                        } catch (err) {
                            console.warn('[Astropsychology Migration] ⚠️ Не удалось создать внешний ключ:', err.message);
                        }

                        console.log('[Astropsychology Migration] ✅ Тип user_id исправлен на UUID');
                    }
                }
            } catch (error) {
                console.error('[Astropsychology Migration] ❌ Ошибка при проверке типа:', error.message);
            }
        }
    },

    down: async (queryInterface, Sequelize) => {
        // Удаляем внешний ключ, если существует
        try {
            await queryInterface.removeConstraint('astropsychology_profiles', 'astropsychology_profiles_user_id_fk');
        } catch (e) {
            // Игнорируем
        }

        await queryInterface.dropTable('astropsychology_profiles');
        console.log('[Astropsychology Migration] 🗑️ Таблица astropsychology_profiles удалена');
    }
};