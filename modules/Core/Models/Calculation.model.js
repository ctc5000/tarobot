// modules/Core/Models/Calculation.model.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Calculation = sequelize.define('Calculation', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        serviceId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Services',
                key: 'id'
            }
        },
        calculationType: {
            type: DataTypes.ENUM('day', 'week', 'month', 'year', 'compatibility', 'basic'),
            allowNull: false
        },
        targetDate: {
            type: DataTypes.DATEONLY,
            allowNull: true,
            comment: 'Для day/week/month/year - дата начала периода'
        },
        result: {
            type: DataTypes.JSONB,
            allowNull: false
        },
        partnerData: {
            type: DataTypes.JSONB,
            allowNull: true,
            comment: 'Имя и дата рождения партнера для совместимости'
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('pending', 'completed', 'failed'),
            defaultValue: 'completed'
        },
        ipAddress: {
            type: DataTypes.STRING,
            allowNull: true
        },
        userAgent: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        meta: {
            type: DataTypes.JSONB,
            defaultValue: {}
        }
    }, {
        freezeTableName: true,
        tableName: 'Calculations',
        timestamps: true,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        indexes: [
            {
                fields: ['userId']
            },
            {
                fields: ['serviceId']
            },
            {
                fields: ['calculationType']
            },
            {
                fields: ['targetDate']
            },
            {
                fields: ['createdAt']
            }
        ]
    });

    Calculation.associate = (models) => {
        Calculation.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user'
        });

        Calculation.belongsTo(models.Service, {
            foreignKey: 'serviceId',
            as: 'service'
        });

        Calculation.hasOne(models.Transaction, {
            foreignKey: 'calculationId',
            as: 'transaction'
        });
    };

    return Calculation;
};