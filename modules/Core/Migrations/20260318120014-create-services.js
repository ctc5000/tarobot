// modules/Core/Migrations/20260318000001-create-services.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tables = await queryInterface.showAllTables();

    if (!tables.includes('Services')) {
      await queryInterface.createTable('Services', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        code: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        price: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false
        },
        currency: {
          type: Sequelize.STRING,
          defaultValue: 'RUB'
        },
        type: {
          type: Sequelize.ENUM('one-time', 'subscription'),
          defaultValue: 'one-time'
        },
        category: {
          type: Sequelize.ENUM('forecast', 'compatibility', 'full_report', 'subscription'),
          allowNull: false
        },
        duration: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        isActive: {
          type: Sequelize.BOOLEAN,
          defaultValue: true
        },
        sortOrder: {
          type: Sequelize.INTEGER,
          defaultValue: 0
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

      await queryInterface.addIndex('Services', ['code'], {
        name: 'services_code_idx'
      });

      await queryInterface.addIndex('Services', ['category'], {
        name: 'services_category_idx'
      });

      await queryInterface.addIndex('Services', ['isActive'], {
        name: 'services_is_active_idx'
      });

      // Добавляем начальные услуги
      await queryInterface.bulkInsert('Services', [
        {
          code: 'forecast_day',
          name: 'Прогноз на день',
          description: 'Персональный нумерологический прогноз на текущий день',
          price: 50.00,
          currency: 'RUB',
          type: 'one-time',
          category: 'forecast',
          sortOrder: 10,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          code: 'forecast_week',
          name: 'Прогноз на неделю',
          description: 'Персональный нумерологический прогноз на предстоящую неделю',
          price: 150.00,
          currency: 'RUB',
          type: 'one-time',
          category: 'forecast',
          sortOrder: 20,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          code: 'forecast_month',
          name: 'Прогноз на месяц',
          description: 'Персональный нумерологический прогноз на месяц',
          price: 300.00,
          currency: 'RUB',
          type: 'one-time',
          category: 'forecast',
          sortOrder: 30,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          code: 'forecast_year',
          name: 'Прогноз на год',
          description: 'Персональный нумерологический прогноз на год',
          price: 500.00,
          currency: 'RUB',
          type: 'one-time',
          category: 'forecast',
          sortOrder: 40,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          code: 'compatibility',
          name: 'Совместимость с партнером',
          description: 'Нумерологический расчет совместимости с партнером',
          price: 400.00,
          currency: 'RUB',
          type: 'one-time',
          category: 'compatibility',
          sortOrder: 50,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          code: 'full_report',
          name: 'Полный нумерологический отчет',
          description: 'Детальный анализ всех аспектов личности',
          price: 1000.00,
          currency: 'RUB',
          type: 'one-time',
          category: 'full_report',
          sortOrder: 60,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          code: 'subscription_monthly',
          name: 'Подписка на месяц',
          description: 'Неограниченные прогнозы на день, неделю, месяц в течение 30 дней',
          price: 1000.00,
          currency: 'RUB',
          type: 'subscription',
          category: 'subscription',
          duration: 30,
          sortOrder: 70,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          code: 'subscription_yearly',
          name: 'Подписка на год',
          description: 'Неограниченные прогнозы на день, неделю, месяц в течение 365 дней',
          price: 6000.00,
          currency: 'RUB',
          type: 'subscription',
          category: 'subscription',
          duration: 365,
          sortOrder: 80,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);

      console.log(`[Core Migration]`, '✅ Таблица Services создана и заполнена начальными данными');
    } else {
      console.log(`[Core Migration]`, '📌 Таблица Services уже существует');
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Services');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Services_type";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Services_category";');
    console.log(`[Core Migration]`, '🗑️ Таблица Services удалена');
  }
};