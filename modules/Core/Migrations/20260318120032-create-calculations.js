// modules/Core/Migrations/20260318000002-create-calculations.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tables = await queryInterface.showAllTables();

    if (!tables.includes('Calculations')) {
      await queryInterface.createTable('Calculations', {
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
        calculationType: {
          type: Sequelize.ENUM('day', 'week', 'month', 'year', 'compatibility'),
          allowNull: false
        },
        targetDate: {
          type: Sequelize.DATEONLY,
          allowNull: true
        },
        result: {
          type: Sequelize.JSONB,
          allowNull: false
        },
        partnerData: {
          type: Sequelize.JSONB,
          allowNull: true
        },
        price: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false
        },
        status: {
          type: Sequelize.ENUM('pending', 'completed', 'failed'),
          defaultValue: 'completed'
        },
        ipAddress: {
          type: Sequelize.STRING,
          allowNull: true
        },
        userAgent: {
          type: Sequelize.TEXT,
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

      await queryInterface.addIndex('Calculations', ['userId'], {
        name: 'calculations_user_id_idx'
      });

      await queryInterface.addIndex('Calculations', ['serviceId'], {
        name: 'calculations_service_id_idx'
      });

      await queryInterface.addIndex('Calculations', ['calculationType'], {
        name: 'calculations_type_idx'
      });

      await queryInterface.addIndex('Calculations', ['targetDate'], {
        name: 'calculations_target_date_idx'
      });

      await queryInterface.addIndex('Calculations', ['createdAt'], {
        name: 'calculations_created_at_idx'
      });

      console.log(`[Core Migration]`, '✅ Таблица Calculations создана');
    } else {
      console.log(`[Core Migration]`, '📌 Таблица Calculations уже существует');
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Calculations');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Calculations_calculationType";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Calculations_status";');
    console.log(`[Core Migration]`, '🗑️ Таблица Calculations удалена');
  }
};