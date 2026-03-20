// modules/Astropsychology/Models/AstropsychologyProfile.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const AstropsychologyProfile = sequelize.define('AstropsychologyProfile', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        userId: {
            type: DataTypes.UUID,  // ИСПРАВЛЕНО: UUID вместо INTEGER
            allowNull: false,
            references: {
                model: 'users',
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
            allowNull: true,
            defaultValue: 55.7558
        },
        longitude: {
            type: DataTypes.DECIMAL(10, 6),
            allowNull: true,
            defaultValue: 37.6173
        },
        lastCalculation: {
            type: DataTypes.DATE,
            allowNull: true
        },
        calculationCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        meta: {
            type: DataTypes.JSONB,
            defaultValue: {}
        }
    }, {
        tableName: 'astropsychology_profiles',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['userId'] }
        ]
    });

    AstropsychologyProfile.associate = (models) => {
        AstropsychologyProfile.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user'
        });
    };

    return AstropsychologyProfile;
};