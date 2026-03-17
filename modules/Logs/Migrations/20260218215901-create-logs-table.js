'use strict';
const { DataTypes } = require('sequelize');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('apilogs', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },

            level: {
                type: Sequelize.ENUM('debug', 'info', 'warning', 'error', 'critical'),
                allowNull: false,
                defaultValue: 'info'
            },

            type: {
                type: Sequelize.STRING(50),
                allowNull: false
            },

            message: {
                type: Sequelize.TEXT,
                allowNull: false
            },

            details: {
                type: Sequelize.JSON,
                allowNull: true
            },

            module: {
                type: Sequelize.STRING(50),
                allowNull: true
            },

            userId: {
                type: DataTypes.UUID,
                allowNull: true,
                references: {
                    model: 'Users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },


            ip: {
                type: Sequelize.STRING(45),
                allowNull: true
            },

            userAgent: {
                type: Sequelize.TEXT,
                allowNull: true
            },

            url: {
                type: Sequelize.STRING(500),
                allowNull: true
            },

            method: {
                type: Sequelize.STRING(10),
                allowNull: true
            },

            statusCode: {
                type: Sequelize.INTEGER,
                allowNull: true
            },

            responseTime: {
                type: Sequelize.INTEGER,
                allowNull: true
            },

            isRead: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },

            isResolved: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },

            resolvedBy: {
                type: DataTypes.UUID,
                allowNull: true,
                references: {
                    model: 'Users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },

            resolvedAt: {
                type: Sequelize.DATE,
                allowNull: true
            },

            resolutionComment: {
                type: Sequelize.TEXT,
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
            }
        });

        // Добавляем индексы
        await queryInterface.addIndex('apilogs', ['level']);
        await queryInterface.addIndex('apilogs', ['type']);
        await queryInterface.addIndex('apilogs', ['module']);
        await queryInterface.addIndex('apilogs', ['userId']);
        await queryInterface.addIndex('apilogs', ['isRead']);
        await queryInterface.addIndex('apilogs', ['isResolved']);
        await queryInterface.addIndex('apilogs', ['createdAt']);

        // Составные индексы для частых запросов
        await queryInterface.addIndex('apilogs', ['level', 'createdAt']);
        await queryInterface.addIndex('apilogs', ['type', 'createdAt']);
        await queryInterface.addIndex('apilogs', ['module', 'createdAt']);
    },

    down: async (queryInterface, Sequelize) => {
        // Удаляем индексы
        await queryInterface.removeIndex('apilogs', ['level', 'createdAt']).catch(() => {});
        await queryInterface.removeIndex('apilogs', ['type', 'createdAt']).catch(() => {});
        await queryInterface.removeIndex('apilogs', ['module', 'createdAt']).catch(() => {});
        await queryInterface.removeIndex('apilogs', ['level']).catch(() => {});
        await queryInterface.removeIndex('apilogs', ['type']).catch(() => {});
        await queryInterface.removeIndex('apilogs', ['module']).catch(() => {});
        await queryInterface.removeIndex('apilogs', ['userId']).catch(() => {});
        await queryInterface.removeIndex('apilogs', ['isRead']).catch(() => {});
        await queryInterface.removeIndex('apilogs', ['isResolved']).catch(() => {});
        await queryInterface.removeIndex('apilogs', ['createdAt']).catch(() => {});

        // Удаляем таблицу
        await queryInterface.dropTable('apilogs');

        // Удаляем ENUM тип (для PostgreSQL)
        if (queryInterface.sequelize.options.dialect === 'postgres') {
            await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_apilogs_level";');
        }
    }
};