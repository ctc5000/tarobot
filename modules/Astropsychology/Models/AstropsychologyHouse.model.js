// modules/Astropsychology/Models/AstropsychologyHouse.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const AstropsychologyHouse = sequelize.define('AstropsychologyHouse', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        number: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        },
        name_ru: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        name_en: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        area: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        keywords: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        planets_in_house_meaning: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        sign_on_cusp_meaning: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        natural_sign: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        natural_planet: {
            type: DataTypes.STRING(50),
            allowNull: true
        }
    }, {
        tableName: 'astropsychology_houses',
        timestamps: true,
        underscored: true
    });

    return AstropsychologyHouse;
};