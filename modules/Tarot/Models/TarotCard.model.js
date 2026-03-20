// modules/Tarot/Models/TarotCard.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const TarotCard = sequelize.define('TarotCard', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        number: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            comment: 'Номер карты (0-21)'
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            comment: 'Название карты'
        },
        nameEn: {
            type: DataTypes.STRING(100),
            comment: 'Название на английском'
        },
        image: {
            type: DataTypes.STRING(255),
            defaultValue: '/images/tarot/back.jpg'
        },
        keywords: {
            type: DataTypes.TEXT,
            comment: 'Ключевые слова'
        },
        meaningUpright: {
            type: DataTypes.TEXT,
            comment: 'Значение в прямом положении'
        },
        meaningReversed: {
            type: DataTypes.TEXT,
            comment: 'Значение в перевернутом положении'
        },
        description: {
            type: DataTypes.TEXT,
            comment: 'Подробное описание карты'
        },
        advice: {
            type: DataTypes.TEXT,
            comment: 'Совет карты'
        },
        element: {
            type: DataTypes.STRING(50),
            comment: 'Стихия'
        },
        planet: {
            type: DataTypes.STRING(50),
            comment: 'Планета'
        }
    }, {
        tableName: 'tarot_cards',
        timestamps: true,
        underscored: true
    });

    TarotCard.associate = (models) => {
        TarotCard.hasMany(models.TarotReading, {
            as: 'readings',
            foreignKey: 'cardId'
        });
    };

    return TarotCard;
};