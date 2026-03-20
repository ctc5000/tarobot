// modules/Tarot/Models/TarotReading.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const TarotReading = sequelize.define('TarotReading', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        question: {
            type: DataTypes.TEXT,
            allowNull: false,
            comment: 'Вопрос пользователя'
        },
        spreadType: {
            type: DataTypes.STRING(50),
            allowNull: false,
            comment: 'Тип расклада (single, three, five, celtic)'
        },
        spreadName: {
            type: DataTypes.STRING(100),
            comment: 'Название расклада'
        },
        cards: {
            type: DataTypes.TEXT,
            allowNull: false,
            comment: 'JSON с данными выпавших карт'
        },
        interpretation: {
            type: DataTypes.TEXT,
            comment: 'Полная интерпретация расклада'
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'tarot_readings',
        timestamps: true,
        underscored: true
    });

    TarotReading.associate = (models) => {
        TarotReading.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user'
        });
        TarotReading.belongsTo(models.TarotCard, {
            foreignKey: 'cardId',
            as: 'card'
        });
    };

    return TarotReading;
};