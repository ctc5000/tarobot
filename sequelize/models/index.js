// sequelize/models/index.js
const fs = require('fs');
const path = require('path');
const { DataTypes } = require('sequelize');

/**
 * Автоматическая загрузка всех моделей из папки modules/Models/
* @param {Sequelize} sequelize - экземпляр Sequelize
* @returns {Object} - объект со всеми загруженными моделями
*/
function loadAllModels(sequelize) {
    const models = {};
    const modulesPath = path.join(__dirname, '../../modules');

    if (!fs.existsSync(modulesPath)) {
        console.warn('[ModelsLoader]', '⚠️ Папка modules не найдена');
        return models;
    }

    // Проходим по всем модулям
    const moduleDirs = fs.readdirSync(modulesPath);

    moduleDirs.forEach(moduleDir => {
        const modelsPath = path.join(modulesPath, moduleDir, 'Models');

        if (fs.existsSync(modelsPath) && fs.statSync(modelsPath).isDirectory()) {
            // Ищем все .model.js файлы
            const modelFiles = fs.readdirSync(modelsPath)
                .filter(file => file.endsWith('.model.js'));

            modelFiles.forEach(file => {
                try {
                    const modelPath = path.join(modelsPath, file);
                    const modelDef = require(modelPath);

                    if (typeof modelDef === 'function') {
                        const model = modelDef(sequelize, DataTypes);
                        if (model && model.name) {
                            models[model.name] = model;
                            console.log('[ModelsLoader]', `✅ Модель ${model.name} загружена из ${moduleDir}/${file}`);
                        }
                    } else if (modelDef && typeof modelDef === 'object' && modelDef.name) {
                        // Если модель уже определена как объект
                        models[modelDef.name] = modelDef;
                        console.log('[ModelsLoader]', `✅ Модель ${modelDef.name} загружена из ${moduleDir}/${file}`);
                    }
                } catch (error) {
                    console.error(`[ModelsLoader] ❌ Ошибка загрузки ${file}:`, error.message);
                }
            });
        }
    });

    return models;
}

module.exports = { loadAllModels };