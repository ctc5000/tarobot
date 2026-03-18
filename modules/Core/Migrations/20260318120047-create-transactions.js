// modules/Core/Migrations/20260318000003-create-transactions.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tables = await queryInterface.showAllTables();

    if (!tables.includes('Transactions')) {
      await queryInterface.createTable('Transactions', {
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
        calculationId: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'Calculations',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        },
        type: {
          type: Sequelize.ENUM('deposit', 'withdrawal', 'payment', 'refund'),
          allowNull: false
        },
        amount: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false
        },
        balanceBefore: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false
        },
        balanceAfter: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false
        },
        currency: {
          type: Sequelize.STRING,
          defaultValue: 'RUB'
        },
        status: {
          type: Sequelize.ENUM('pending', 'completed', 'failed', 'cancelled'),
          defaultValue: 'pending'
        },
        paymentMethod: {
          type: Sequelize.STRING,
          allowNull: true
        },
        paymentId: {
          type: Sequelize.STRING,
          allowNull: true
        },
        paymentDetails: {
          type: Sequelize.JSONB,
          allowNull: true
        },
        description: {
          type: Sequelize.STRING,
          allowNull: true
        },
        ipAddress: {
          type: Sequelize.STRING,
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

      await queryInterface.addIndex('Transactions', ['userId'], {
        name: 'transactions_user_id_idx'
      });

      await queryInterface.addIndex('Transactions', ['calculationId'], {
        name: 'transactions_calculation_id_idx'
      });

      await queryInterface.addIndex('Transactions', ['status'], {
        name: 'transactions_status_idx'
      });

      await queryInterface.addIndex('Transactions', ['paymentId'], {
        name: 'transactions_payment_id_idx'
      });

      await queryInterface.addIndex('Transactions', ['createdAt'], {
        name: 'transactions_created_at_idx'
      });

      console.log(`[Core Migration]`, '✅ Таблица Transactions создана');
    } else {
      console.log(`[Core Migration]`, '📌 Таблица Transactions уже существует');
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Transactions');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Transactions_type";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Transactions_status";');
    console.log(`[Core Migration]`, '🗑️ Таблица Transactions удалена');
  }
};