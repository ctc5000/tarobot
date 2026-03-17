// modules/Core/Models/Transaction.model.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Transaction = sequelize.define('Transaction', {
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
        calculationId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'Calculations',
                key: 'id'
            }
        },
        type: {
            type: DataTypes.ENUM('deposit', 'withdrawal', 'payment', 'refund'),
            allowNull: false
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        balanceBefore: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        balanceAfter: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        currency: {
            type: DataTypes.STRING,
            defaultValue: 'RUB'
        },
        status: {
            type: DataTypes.ENUM('pending', 'completed', 'failed', 'cancelled'),
            defaultValue: 'pending'
        },
        paymentMethod: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'card, sbp, crypto, etc'
        },
        paymentId: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'ID транзакции в платежной системе'
        },
        paymentDetails: {
            type: DataTypes.JSONB,
            allowNull: true,
            comment: 'Детали платежа от платежной системы'
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        },
        ipAddress: {
            type: DataTypes.STRING,
            allowNull: true
        },
        meta: {
            type: DataTypes.JSONB,
            defaultValue: {}
        }
    }, {
        freezeTableName: true,
        tableName: 'Transactions',
        timestamps: true,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        indexes: [
            {
                fields: ['userId']
            },
            {
                fields: ['calculationId']
            },
            {
                fields: ['status']
            },
            {
                fields: ['paymentId']
            },
            {
                fields: ['createdAt']
            }
        ]
    });

    Transaction.associate = (models) => {
        Transaction.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user'
        });

        Transaction.belongsTo(models.Calculation, {
            foreignKey: 'calculationId',
            as: 'calculation'
        });
    };

    return Transaction;
};