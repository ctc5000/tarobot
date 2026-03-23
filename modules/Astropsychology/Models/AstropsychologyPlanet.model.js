// modules/Astropsychology/Models/AstropsychologyPlanet.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const AstropsychologyPlanet = sequelize.define('AstropsychologyPlanet', {
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
            allowNull: false
        },
        ruling_signs: {
            type: DataTypes.TEXT,
            allowNull: true,
            get() {
                const value = this.getDataValue('ruling_signs');
                return value ? JSON.parse(value) : [];
            },
            set(value) {
                this.setDataValue('ruling_signs', JSON.stringify(value));
            }
        },
        exaltation_sign: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        detriment_sign: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        meaning: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        role: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        strengths: {
            type: DataTypes.TEXT,
            allowNull: true,
            get() {
                const value = this.getDataValue('strengths');
                return value ? JSON.parse(value) : [];
            },
            set(value) {
                this.setDataValue('strengths', JSON.stringify(value));
            }
        },
        weaknesses: {
            type: DataTypes.TEXT,
            allowNull: true,
            get() {
                const value = this.getDataValue('weaknesses');
                return value ? JSON.parse(value) : [];
            },
            set(value) {
                this.setDataValue('weaknesses', JSON.stringify(value));
            }
        },
        body_part: {
            type: DataTypes.STRING(100),
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
        tableName: 'astropsychology_planets',
        timestamps: true,
        underscored: true
    });

    return AstropsychologyPlanet;
};