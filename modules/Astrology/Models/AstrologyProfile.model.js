// modules/astrology/Models/astrologyProfile.model.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const AstrologyProfile = sequelize.define('AstrologyProfile', {
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
        birthTime: {
            type: DataTypes.TIME,
            allowNull: false,
            defaultValue: '12:00:00'
        },
        latitude: {
            type: DataTypes.DECIMAL(10, 6),
            allowNull: true
        },
        longitude: {
            type: DataTypes.DECIMAL(10, 6),
            allowNull: true
        },
        houseSystem: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 'placidus'
        },
        ascendant: {
            type: DataTypes.JSONB,
            allowNull: true
        },
        lastCalculation: {
            type: DataTypes.DATE,
            allowNull: true
        },
        meta: {
            type: DataTypes.JSONB,
            defaultValue: {}
        }
    }, {
        tableName: 'astrology_profiles',
        freezeTableName: true,
        timestamps: true,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        indexes: [
            { fields: ['userId'] }
        ]
    });

    AstrologyProfile.associate = (models) => {
        AstrologyProfile.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user'
        });
    };

    return AstrologyProfile;
};