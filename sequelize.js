// sequelize.js
const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');
const config = require('./sequelize/config');

// Определяем окружение
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Создаем экземпляр Sequelize
const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    {
        host: dbConfig.host,
        port: dbConfig.port,
        dialect: dbConfig.dialect,
        logging: dbConfig.logging,
        pool: dbConfig.pool,
        define: {
            timestamps: true,
            underscored: false,
            freezeTableName: true
        }
    }
);

// Функция для установки ассоциаций между моделями
function setupAssociations(models) {
    Object.keys(models).forEach(modelName => {
        if (models[modelName].associate) {
            try {
                models[modelName].associate(models);
                console.log('[Sequelize]', `🔗 Ассоциации для ${modelName} установлены`);
            } catch (error) {
                console.error(`[Sequelize] ❌ Ошибка ассоциаций для ${modelName}:`, error.message);
            }
        }
    });
}

// Загружаем модели из модулей
const { loadAllModels } = require('./sequelize/models');
const models = loadAllModels(sequelize);

// Устанавливаем ассоциации
setupAssociations(models);

// Добавляем модели в экземпляр sequelize
Object.assign(sequelize.models, models);

// Экспортируем всё вместе
module.exports = {
    sequelize,
    Sequelize,
    models: sequelize.models,
    ...sequelize.models // Для прямого доступа: const { User } = require('./sequelize');
};