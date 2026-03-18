// modules/Core/Migrations/20260318000000-create-users.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Проверяем, существует ли уже таблица
    const tables = await queryInterface.showAllTables();

    if (!tables.includes('Users')) {
      await queryInterface.createTable('Users', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false
        },
        fullName: {
          type: Sequelize.STRING,
          allowNull: false
        },
        birthDate: {
          type: Sequelize.DATEONLY,
          allowNull: false
        },
        phone: {
          type: Sequelize.STRING,
          allowNull: true
        },
        balance: {
          type: Sequelize.DECIMAL(10, 2),
          defaultValue: 0.00,
          allowNull: false
        },
        role: {
          type: Sequelize.ENUM('user', 'admin'),
          defaultValue: 'user'
        },
        telegramId: {
          type: Sequelize.STRING,
          allowNull: true,
          unique: true
        },
        telegramUsername: {
          type: Sequelize.STRING,
          allowNull: true
        },
        settings: {
          type: Sequelize.JSONB,
          defaultValue: {}
        },
        numerologyData: {
          type: Sequelize.JSONB,
          allowNull: true
        },
        isActive: {
          type: Sequelize.BOOLEAN,
          defaultValue: true
        },
        lastLogin: {
          type: Sequelize.DATE,
          allowNull: true
        },
        emailVerified: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },
        emailVerificationToken: {
          type: Sequelize.STRING,
          allowNull: true
        },
        passwordResetToken: {
          type: Sequelize.STRING,
          allowNull: true
        },
        passwordResetExpires: {
          type: Sequelize.DATE,
          allowNull: true
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
        },
        deletedAt: {
          type: Sequelize.DATE,
          allowNull: true
        }
      });

      // Добавляем индексы
      await queryInterface.addIndex('Users', ['email'], {
        name: 'users_email_idx'
      });

      await queryInterface.addIndex('Users', ['telegramId'], {
        name: 'users_telegram_id_idx'
      });

      await queryInterface.addIndex('Users', ['role'], {
        name: 'users_role_idx'
      });

      await queryInterface.addIndex('Users', ['isActive'], {
        name: 'users_is_active_idx'
      });

      console.log(`[Core Migration]`, '✅ Таблица Users создана');
    } else {
      console.log(`[Core Migration]`, '📌 Таблица Users уже существует');
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Users_role";');
    console.log(`[Core Migration]`, '🗑️ Таблица Users удалена');
  }
};