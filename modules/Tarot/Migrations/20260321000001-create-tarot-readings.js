// modules/Tarot/Migrations/20260321000001-create-tarot-readings.js
'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tables = await queryInterface.showAllTables();

        if (!tables.includes('tarot_readings')) {
            await queryInterface.createTable('tarot_readings', {
                id: {
                    type: Sequelize.INTEGER,
                    autoIncrement: true,
                    primaryKey: true
                },
                user_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    comment: 'ID пользователя'
                },
                question: {
                    type: Sequelize.TEXT,
                    allowNull: false,
                    comment: 'Вопрос пользователя'
                },
                spread_type: {
                    type: Sequelize.STRING(50),
                    allowNull: false,
                    comment: 'Тип расклада (single, three, five, celtic)'
                },
                spread_name: {
                    type: Sequelize.STRING(100),
                    comment: 'Название расклада'
                },
                cards: {
                    type: Sequelize.TEXT,
                    allowNull: false,
                    comment: 'JSON с данными выпавших карт'
                },
                interpretation: {
                    type: Sequelize.TEXT,
                    comment: 'Полная интерпретация расклада'
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

            console.log('[Tarot Migration] ✅ Таблица tarot_readings создана');

            // Добавляем индексы
            await queryInterface.addIndex('tarot_readings', ['user_id'], {
                name: 'tarot_readings_user_id_idx'
            });

            await queryInterface.addIndex('tarot_readings', ['created_at'], {
                name: 'tarot_readings_created_at_idx'
            });

            console.log('[Tarot Migration] ✅ Индексы для tarot_readings созданы');

            // Проверяем существование таблицы users через SQL запрос
            const [usersTableExists] = await queryInterface.sequelize.query(
                "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users')"
            );

            if (usersTableExists[0].exists) {
                try {
                    await queryInterface.addConstraint('tarot_readings', {
                        fields: ['user_id'],
                        type: 'foreign key',
                        name: 'tarot_readings_user_id_fk',
                        references: {
                            table: 'users',
                            field: 'id'
                        },
                        onDelete: 'CASCADE',
                        onUpdate: 'CASCADE'
                    });
                    console.log('[Tarot Migration] ✅ Внешний ключ для tarot_readings создан');
                } catch (error) {
                    console.log('[Tarot Migration] ⚠️ Не удалось создать внешний ключ:', error.message);
                }
            } else {
                console.log('[Tarot Migration] ℹ️ Таблица users не найдена, внешний ключ не создан');
            }
        } else {
            console.log('[Tarot Migration] 📌 Таблица tarot_readings уже существует');
        }
    },

    down: async (queryInterface, Sequelize) => {
        try {
            await queryInterface.removeConstraint('tarot_readings', 'tarot_readings_user_id_fk');
        } catch (e) {
            // Игнорируем
        }
        await queryInterface.dropTable('tarot_readings');
        console.log('[Tarot Migration] 🗑️ Таблица tarot_readings удалена');
    }
};