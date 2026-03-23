// modules/Astropsychology/Models/AstropsychologyPsychologicalTrait.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const AstropsychologyPsychologicalTrait = sequelize.define('AstropsychologyPsychologicalTrait', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        category: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        sign_code: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        planet_code: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        house_number: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        title: {
            type: DataTypes.STRING(200),
            allowNull: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        combination_key: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        sort_order: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    }, {
        tableName: 'astropsychology_psychological_traits',
        timestamps: true,
        underscored: true
    });

    return AstropsychologyPsychologicalTrait;
};