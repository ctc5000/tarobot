// modules/astrology/Migrations/20260320000000-create-astrology-profiles.js
'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tables = await queryInterface.showAllTables();

        if (!tables.includes('astrology_profiles')) {
            await queryInterface.createTable('astrology_profiles', {
                id: {
                    type: Sequelize.UUID,
                    defaultValue: Sequelize.UUIDV4,
                    primaryKey: true
                },
                userId: {
                    type: Sequelize.UUID,
                    allowNull: false,
                    references: {
                        model: 'Users',
                        key: 'id'
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE'
                },
                fullName: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                birthDate: {
                    type: Sequelize.DATEONLY,
                    allowNull: false
                },
                birthTime: {
                    type: Sequelize.TIME,
                    allowNull: false,
                    defaultValue: '12:00:00'
                },
                latitude: {
                    type: Sequelize.DECIMAL(10, 6),
                    allowNull: true
                },
                longitude: {
                    type: Sequelize.DECIMAL(10, 6),
                    allowNull: true
                },
                houseSystem: {
                    type: Sequelize.STRING,
                    allowNull: true,
                    defaultValue: 'placidus'
                },
                ascendant: {
                    type: Sequelize.JSONB,
                    allowNull: true
                },
                lastCalculation: {
                    type: Sequelize.DATE,
                    allowNull: true
                },
                meta: {
                    type: Sequelize.JSONB,
                    defaultValue: {}
                },
                createdAt: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
                },
                updatedAt: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
                }
            });

            await queryInterface.addIndex('astrology_profiles', ['userId'], {
                name: 'astrology_profiles_user_id_idx'
            });

            console.log('[Astrology Migration] ✅ Таблица astrology_profiles создана');
        } else {
            console.log('[Astrology Migration] 📌 Таблица astrology_profiles уже существует');
        }
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('astrology_profiles');
        console.log('[Astrology Migration] 🗑️ Таблица astrology_profiles удалена');
    }
};