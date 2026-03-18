// modules/Core/Migrations/20260325000000-add-full-to-calculation-type.js
'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        console.log('[Migration] 🔄 Добавление значения "full" в enum_Calculations_calculationType...');

        try {
            // Проверяем существование ENUM типа
            const [enumTypeExists] = await queryInterface.sequelize.query(
                `SELECT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_Calculations_calculationType');`
            );

            if (enumTypeExists[0].exists) {
                // Добавляем новое значение 'full' в ENUM
                await queryInterface.sequelize.query(
                    `ALTER TYPE "enum_Calculations_calculationType" ADD VALUE IF NOT EXISTS 'full';`
                );

                console.log('[Migration] ✅ Значение "full" добавлено в enum_Calculations_calculationType');
            } else {
                console.log('[Migration] ❌ ENUM тип enum_Calculations_calculationType не найден');
            }

            // Обновляем индекс
            try {
                await queryInterface.removeIndex('Calculations', 'calculations_type_idx');
            } catch (e) {
                // Индекс может не существовать
            }

            await queryInterface.addIndex('Calculations', ['calculationType'], {
                name: 'calculations_type_idx'
            });

        } catch (error) {
            console.error('[Migration] ❌ Ошибка при добавлении "full" в ENUM:', error.message);
            throw error;
        }
    },

    down: async (queryInterface, Sequelize) => {
        console.log('[Migration] ⚠️ PostgreSQL не поддерживает удаление значений из ENUM');
        console.log('[Migration] 📌 Для полного отката требуется создать новый тип и перенести данные');
    }
};