// modules/Astropsychology/Models/AstropsychologyAspect.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const AstropsychologyAspect = sequelize.define('AstropsychologyAspect', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        code: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true
        },
        name_ru: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        name_en: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        symbol: {
            type: DataTypes.STRING(10),
            allowNull: true
        },
        angle: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        orb_max: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 8
        },
        aspect_type: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        nature: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        color: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        sort_order: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    }, {
        tableName: 'astropsychology_aspects',
        timestamps: true,
        underscored: true
    });

    return AstropsychologyAspect;
};