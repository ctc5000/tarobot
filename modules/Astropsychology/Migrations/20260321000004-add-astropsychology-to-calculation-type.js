// modules/Core/Migrations/20260321000004-add-astropsychology-to-calculation-type.js
'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        console.log('[Migration] 🔄 Добавление типов расчетов астропсихологии в enum_Calculations_calculationType...');

        try {
            // Проверяем существование ENUM типа
            const [enumTypeExists] = await queryInterface.sequelize.query(
                `SELECT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_Calculations_calculationType');`
            );

            if (enumTypeExists[0].exists) {
                // Добавляем новые значения в ENUM
                const newValues = ['astro_basic', 'astro_quick', 'astro_standard', 'astro_full', 'astro_premium'];

                for (const value of newValues) {
                    await queryInterface.sequelize.query(
                        `ALTER TYPE "enum_Calculations_calculationType" ADD VALUE IF NOT EXISTS '${value}';`
                    );
                    console.log(`   ✅ Добавлено значение: ${value}`);
                }

                console.log('[Migration] ✅ Значения астропсихологии добавлены в enum_Calculations_calculationType');
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

            return Promise.resolve();

        } catch (error) {
            console.error('[Migration] ❌ Ошибка при добавлении типов в ENUM:', error.message);
            throw error;
        }
    },

    down: async (queryInterface, Sequelize) => {
        console.log('[Migration] ⚠️ PostgreSQL не поддерживает удаление значений из ENUM');
        console.log('[Migration] 📌 Для полного отката выполните следующие действия вручную:');
        console.log('[Migration] 📌 1. Создайте временный ENUM без значений астропсихологии');
        console.log('[Migration] 📌 2. Обновите все записи, использующие эти значения');
        console.log('[Migration] 📌 3. Удалите старый ENUM и переименуйте временный');

        return Promise.resolve();
    }
};