// modules/Numerology/Migrations/20260319000000-create-numerology-profiles.js
'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tables = await queryInterface.showAllTables();

        if (!tables.includes('numerology_profiles')) {
            await queryInterface.createTable('numerology_profiles', {
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
                baseNumbers: {
                    type: Sequelize.JSONB,
                    allowNull: true
                },
                freeCalculations: {
                    type: Sequelize.INTEGER,
                    defaultValue: 0
                },
                hasFreeCalculation: {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false
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

            await queryInterface.addIndex('numerology_profiles', ['userId'], {
                name: 'numerology_profiles_user_id_idx'
            });

            console.log('[Numerology Migration] ✅ Таблица numerology_profiles создана');
        } else {
            console.log('[Numerology Migration] 📌 Таблица numerology_profiles уже существует');
        }
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('numerology_profiles');
        console.log('[Numerology Migration] 🗑️ Таблица numerology_profiles удалена');
    }
};