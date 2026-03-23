// modules/Astropsychology/Models/AstropsychologyInterpretation.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const AstropsychologyInterpretation = sequelize.define('AstropsychologyInterpretation', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        category: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        planet_code: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        sign_code: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        house_number: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        aspect_code: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        title: {
            type: DataTypes.STRING(200),
            allowNull: true
        },
        short_text: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        full_text: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        keywords: {
            type: DataTypes.TEXT,
            allowNull: true,
            get() {
                const value = this.getDataValue('keywords');
                return value ? JSON.parse(value) : [];
            },
            set(value) {
                this.setDataValue('keywords', JSON.stringify(value));
            }
        },
        is_positive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        sort_order: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    }, {
        tableName: 'astropsychology_interpretations',
        timestamps: true,
        underscored: true
    });

    return AstropsychologyInterpretation;
};