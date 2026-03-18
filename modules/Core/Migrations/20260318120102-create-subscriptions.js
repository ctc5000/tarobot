// modules/Core/Migrations/20260318000004-create-subscriptions.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tables = await queryInterface.showAllTables();

    if (!tables.includes('Subscriptions')) {
      await queryInterface.createTable('Subscriptions', {
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
        serviceId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Services',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT'
        },
        startDate: {
          type: Sequelize.DATE,
          allowNull: false
        },
        endDate: {
          type: Sequelize.DATE,
          allowNull: false
        },
        status: {
          type: Sequelize.ENUM('active', 'expired', 'cancelled'),
          defaultValue: 'active'
        },
        autoRenew: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },
        price: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false
        },
        paymentMethod: {
          type: Sequelize.STRING,
          allowNull: true
        },
        cancelledAt: {
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

      await queryInterface.addIndex('Subscriptions', ['userId'], {
        name: 'subscriptions_user_id_idx'
      });

      await queryInterface.addIndex('Subscriptions', ['serviceId'], {
        name: 'subscriptions_service_id_idx'
      });

      await queryInterface.addIndex('Subscriptions', ['status'], {
        name: 'subscriptions_status_idx'
      });

      await queryInterface.addIndex('Subscriptions', ['endDate'], {
        name: 'subscriptions_end_date_idx'
      });

      await queryInterface.addIndex('Subscriptions', ['userId', 'status'], {
        name: 'subscriptions_user_status_idx'
      });

      console.log(`[Core Migration]`, '✅ Таблица Subscriptions создана');
    } else {
      console.log(`[Core Migration]`, '📌 Таблица Subscriptions уже существует');
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Subscriptions');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Subscriptions_status";');
    console.log(`[Core Migration]`, '🗑️ Таблица Subscriptions удалена');
  }
};