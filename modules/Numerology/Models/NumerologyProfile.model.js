// modules/Numerology/Models/NumerologyProfile.model.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const NumerologyProfile = sequelize.define('NumerologyProfile', {
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
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        birthDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        // Кешированные базовые данные
        baseNumbers: {
            type: DataTypes.JSONB,
            allowNull: true,
            comment: 'Базовые числа: fate, name, surname, patronymic'
        },
        // Количество бесплатных расчетов
        freeCalculations: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        // Флаг, что базовый расчет уже делали
        hasFreeCalculation: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        // Дата последнего расчета
        lastCalculation: {
            type: DataTypes.DATE,
            allowNull: true
        },
        // Мета-данные
        meta: {
            type: DataTypes.JSONB,
            defaultValue: {}
        }
    }, {
        tableName: 'numerology_profiles',
        freezeTableName: true,
        timestamps: true,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        indexes: [
            {
                fields: ['userId']
            }
        ]
    });

    NumerologyProfile.associate = (models) => {
        NumerologyProfile.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user'
        });
    };

    return NumerologyProfile;
};