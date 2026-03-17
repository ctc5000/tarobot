// modules/Core/Models/Subscription.model.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Subscription = sequelize.define('Subscription', {
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
        startDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('active', 'expired', 'cancelled'),
            defaultValue: 'active'
        },
        autoRenew: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        paymentMethod: {
            type: DataTypes.STRING,
            allowNull: true
        },
        cancelledAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        meta: {
            type: DataTypes.JSONB,
            defaultValue: {}
        }
    }, {
        freezeTableName: true,
        tableName: 'Subscriptions',
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
                fields: ['status']
            },
            {
                fields: ['endDate']
            },
            {
                fields: ['userId', 'status']
            }
        ]
    });

    Subscription.associate = (models) => {
        Subscription.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user'
        });

        Subscription.belongsTo(models.Service, {
            foreignKey: 'serviceId',
            as: 'service'
        });
    };

    return Subscription;
};