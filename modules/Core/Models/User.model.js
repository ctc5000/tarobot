// modules/Core/Models/User.model.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        birthDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true
        },
        balance: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0.00,
            allowNull: false,
            validate: {
                min: 0
            }
        },
        role: {
            type: DataTypes.ENUM('user', 'admin'),
            defaultValue: 'user'
        },
        telegramId: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        },
        telegramUsername: {
            type: DataTypes.STRING,
            allowNull: true
        },
        settings: {
            type: DataTypes.JSONB,
            defaultValue: {
                notifications: {
                    email: true,
                    telegram: false,
                    forecast: true
                },
                language: 'ru',
                theme: 'light'
            }
        },
        numerologyData: {
            type: DataTypes.JSONB,
            allowNull: true,
            comment: 'Кешированные базовые нумерологические данные'
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        lastLogin: {
            type: DataTypes.DATE,
            allowNull: true
        },
        emailVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        emailVerificationToken: {
            type: DataTypes.STRING,
            allowNull: true
        },
        passwordResetToken: {
            type: DataTypes.STRING,
            allowNull: true
        },
        passwordResetExpires: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        freezeTableName: true,
        tableName: 'Users',
        timestamps: true,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        paranoid: true,
        deletedAt: 'deletedAt',
        indexes: [
            {
                fields: ['email']
            },
            {
                fields: ['telegramId']
            },
            {
                fields: ['role']
            },
            {
                fields: ['isActive']
            }
        ]
    });

    User.associate = (models) => {
        User.hasMany(models.Calculation, {
            foreignKey: 'userId',
            as: 'calculations'
        });

        User.hasMany(models.Transaction, {
            foreignKey: 'userId',
            as: 'transactions'
        });

        User.hasMany(models.Subscription, {
            foreignKey: 'userId',
            as: 'subscriptions'
        });
    };

    return User;
};