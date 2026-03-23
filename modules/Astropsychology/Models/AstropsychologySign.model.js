// modules/Astropsychology/Models/AstropsychologySign.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const AstropsychologySign = sequelize.define('AstropsychologySign', {
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
        symbol: {
            type: DataTypes.STRING(5),
            allowNull: false
        },
        element: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        quality: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        ruling_planet: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        start_degree: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        end_degree: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        positive_traits: {
            type: DataTypes.TEXT,
            allowNull: true,
            get() {
                const value = this.getDataValue('positive_traits');
                return value ? JSON.parse(value) : [];
            },
            set(value) {
                this.setDataValue('positive_traits', JSON.stringify(value));
            }
        },
        negative_traits: {
            type: DataTypes.TEXT,
            allowNull: true,
            get() {
                const value = this.getDataValue('negative_traits');
                return value ? JSON.parse(value) : [];
            },
            set(value) {
                this.setDataValue('negative_traits', JSON.stringify(value));
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        sun_description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        moon_description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        ascendant_description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        sort_order: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    }, {
        tableName: 'astropsychology_signs',
        timestamps: true,
        underscored: true
    });

    return AstropsychologySign;
};