// modules/Core/Migrations/20260318150000-add-basic-to-calculation-type.js
'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        try {
            // Проверяем существование ENUM типа
            const enumTypeExists = await queryInterface.sequelize.query(
                `SELECT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_Calculations_calculationType');`,
                { type: Sequelize.QueryTypes.SELECT }
            );

            if (enumTypeExists[0].exists) {
                // Добавляем новое значение 'basic' в ENUM
                await queryInterface.sequelize.query(
                    `ALTER TYPE "enum_Calculations_calculationType" ADD VALUE IF NOT EXISTS 'basic';`
                );

                console.log(`[Core Migration]`, `✅ Значение 'basic' добавлено в enum_Calculations_calculationType`);
            } else {
                console.log(`[Core Migration]`, `❌ ENUM тип enum_Calculations_calculationType не найден`);
            }

            // Также обновляем индекс для нового типа
            await queryInterface.sequelize.query(
                `DROP INDEX IF EXISTS "calculations_type_idx";`
            );

            await queryInterface.addIndex('Calculations', ['calculationType'], {
                name: 'calculations_type_idx'
            });

        } catch (error) {
            console.error(`[Core Migration]`, `❌ Ошибка при добавлении 'basic' в ENUM:`, error.message);
            throw error;
        }
    },

    down: async (queryInterface, Sequelize) => {
        try {
            // PostgreSQL не поддерживает прямое удаление значения из ENUM
            // Поэтому для отката нужно создать новый тип и перенести данные

            console.log(`[Core Migration]`, `⚠️ Внимание: Откат миграции по добавлению 'basic' в ENUM`);
            console.log(`[Core Migration]`, `📌 PostgreSQL не поддерживает удаление значений из ENUM`);
            console.log(`[Core Migration]`, `📌 Если нужен полный откат, выполните следующие действия вручную:`);
            console.log(`[Core Migration]`, `📌 1. Создайте временный ENUM без значения 'basic'`);
            console.log(`[Core Migration]`, `📌 2. Обновите все записи, использующие 'basic'`);
            console.log(`[Core Migration]`, `📌 3. Удалите старый ENUM и переименуйте временный`);

        } catch (error) {
            console.error(`[Core Migration]`, `❌ Ошибка при откате миграции:`, error.message);
            throw error;
        }
    }
};