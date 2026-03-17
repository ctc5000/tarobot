// modules/Logs/Models/Log.model.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Log = sequelize.define('Log', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        level: {
            type: DataTypes.ENUM('debug', 'info', 'warning', 'error', 'critical'),
            allowNull: false,
            defaultValue: 'info'
        },
        type: {
            type: DataTypes.STRING(50),
            allowNull: false,
            comment: 'payment, order, user, system, api, etc'
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        details: {
            type: DataTypes.JSON,
            allowNull: true
        },
        module: {
            type: DataTypes.STRING(50),
            allowNull: true,
            comment: 'Payments, Orders, WaiterWeb, etc'
        },
        userId: {
            type: DataTypes.UUID,  // UUID как в модели User
            allowNull: true,
            references: {
                model: 'Users',     // Имя таблицы Users
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        },

        ip: {
            type: DataTypes.STRING(45),
            allowNull: true
        },
        userAgent: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        url: {
            type: DataTypes.STRING(500),
            allowNull: true
        },
        method: {
            type: DataTypes.STRING(10),
            allowNull: true
        },
        statusCode: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        responseTime: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        isRead: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isResolved: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        resolvedBy: {
            type: DataTypes.UUID,  // UUID как в модели User
            allowNull: true,
            references: {
                model: 'Users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        },
        resolvedAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        resolutionComment: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'apilogs',
        freezeTableName: true,
        timestamps: true,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        indexes: [
            { fields: ['level'] },
            { fields: ['type'] },
            { fields: ['module'] },
            { fields: ['userId'] },
            { fields: ['isRead'] },
            { fields: ['isResolved'] },
            { fields: ['createdAt'] },
            { fields: ['level', 'createdAt'] },
            { fields: ['type', 'createdAt'] },
            { fields: ['module', 'createdAt'] }
        ]
    });

    Log.associate = (models) => {
        // Используем проверку наличия моделей
        if (models.User) {
            Log.belongsTo(models.User, {
                foreignKey: 'userId',
                as: 'user',
                constraints: false  // Отключаем constraints для избежания циклических зависимостей
            });

            Log.belongsTo(models.User, {
                foreignKey: 'resolvedBy',
                as: 'resolver',
                constraints: false
            });
        }

    };

    return Log;
};