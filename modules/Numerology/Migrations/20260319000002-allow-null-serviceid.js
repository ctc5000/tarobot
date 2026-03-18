// modules/Core/Migrations/20260319000002-allow-null-serviceid.js
'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        console.log('[Migration] 🔄 Изменение поля serviceId в таблице Calculations...');

        try {
            // Меняем поле serviceId, разрешая NULL
            await queryInterface.changeColumn('Calculations', 'serviceId', {
                type: Sequelize.UUID,
                allowNull: true,
                references: {
                    model: 'Services',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT'
            });

            console.log('[Migration] ✅ Поле serviceId теперь может быть NULL');
        } catch (error) {
            console.error('[Migration] ❌ Ошибка при изменении поля:', error);
            throw error;
        }
    },

    down: async (queryInterface, Sequelize) => {
        // Возвращаем как было
        await queryInterface.changeColumn('Calculations', 'serviceId', {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
                model: 'Services',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
        });
    }
};