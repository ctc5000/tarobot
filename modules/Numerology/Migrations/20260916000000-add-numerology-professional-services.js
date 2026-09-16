// modules/Numerology/Migrations/20260916000000-add-numerology-professional-services.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tables = await queryInterface.showAllTables();

    if (tables.includes('Services')) {
      const existing = await queryInterface.sequelize.query(
        `SELECT code FROM "Services" WHERE code IN ('numerology_professional', 'numerology_full_report', 'numerology_basic')`,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );
      const existingCodes = existing.map(r => r.code);

      const services = [];

      if (!existingCodes.includes('numerology_basic')) {
        services.push({
          code: 'numerology_basic',
          name: 'Базовый нумерологический расчет',
          description: 'Бесплатный базовый расчет числа судьбы, ахиллесовой пяты, числа управления и призвания',
          price: 0.00,
          currency: 'RUB',
          type: 'one-time',
          category: 'full_report',
          isActive: true,
          sortOrder: 1,
          section: 'numerology',
          meta: JSON.stringify({ free: true, methods: ['basic'] }),
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }

      if (!existingCodes.includes('numerology_full_report')) {
        services.push({
          code: 'numerology_full_report',
          name: 'Полный нумерологический отчет',
          description: 'Детальный анализ личности: числа судьбы, имени, рода, отчества, психологический портрет, карты Таро, знак зодиака, фен-шуй',
          price: 500.00,
          currency: 'RUB',
          type: 'one-time',
          category: 'full_report',
          isActive: true,
          sortOrder: 2,
          section: 'numerology',
          meta: JSON.stringify({ methods: ['full'] }),
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }

      if (!existingCodes.includes('numerology_professional')) {
        services.push({
          code: 'numerology_professional',
          name: 'Профессиональный нумерологический расчет',
          description: 'Полный профессиональный расчет: 15+ ключевых чисел, разбивка по буквам, промежуточные суммы, пинакли и челленджи, матрица судьбы, кармический хвост, чакровый анализ',
          price: 1500.00,
          currency: 'RUB',
          type: 'one-time',
          category: 'full_report',
          isActive: true,
          sortOrder: 3,
          section: 'numerology',
          meta: JSON.stringify({ methods: ['professional', 'pythagorean', 'vedic', 'chaldean', 'kabbalah'] }),
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }

      if (services.length > 0) {
        await queryInterface.bulkInsert('Services', services);
        console.log(`[Numerology Migration] ✅ Добавлены услуги нумерологии: ${services.map(s => s.code).join(', ')}`);
      } else {
        console.log(`[Numerology Migration] 📌 Услуги нумерологии уже существуют`);
      }
    } else {
      console.log(`[Numerology Migration] ⚠️ Таблица Services не найдена`);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      `DELETE FROM "Services" WHERE code IN ('numerology_professional', 'numerology_full_report', 'numerology_basic')`
    );
    console.log(`[Numerology Migration] 🗑️ Услуги нумерологии удалены`);
  }
};