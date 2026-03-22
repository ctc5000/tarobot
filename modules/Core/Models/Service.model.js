// modules/Core/Models/Service.model.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Service = sequelize.define('Service', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                is: /^[a-z_]+$/
            }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                min: 0
            }
        },
        currency: {
            type: DataTypes.STRING,
            defaultValue: 'RUB'
        },
        type: {
            type: DataTypes.ENUM('one-time', 'subscription'),
            defaultValue: 'one-time'
        },
        category: {
            type: DataTypes.ENUM('forecast', 'compatibility', 'full_report', 'subscription'),
            allowNull: false
        },
        duration: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Длительность подписки в днях (для type=subscription)'
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        sortOrder: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        meta: {
            type: DataTypes.JSONB,
            defaultValue: {}
        },
        section: {
            type: DataTypes.STRING(50),
            allowNull: true,
            comment: 'Раздел услуги: numerology, astrology, astropsychology'
        },
    }, {
        freezeTableName: true,
        tableName: 'Services',
        timestamps: true,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        indexes: [
            {
                fields: ['code']
            },
            {
                fields: ['category']
            },
            {
                fields: ['isActive']
            }
        ]
    });

    Service.associate = (models) => {
        Service.hasMany(models.Calculation, {
            foreignKey: 'serviceId',
            as: 'calculations'
        });

        Service.hasMany(models.Subscription, {
            foreignKey: 'serviceId',
            as: 'subscriptions'
        });
    };

    return Service;
};