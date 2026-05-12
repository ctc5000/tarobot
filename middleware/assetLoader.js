const fs = require('fs');
const path = require('path');

let assetManifest = {};

// Загрузка манифеста
function loadManifest() {
    try {
        const manifestPath = path.join(__dirname, '..', 'public', 'asset-manifest.json');
        if (fs.existsSync(manifestPath)) {
            assetManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
            console.log('📦 Манифест ассетов загружен');
        }
    } catch (error) {
        console.error('❌ Ошибка загрузки манифеста:', error);
    }
}

// Мидлвар для автоматической подстановки минифицированных файлов
function assetMiddleware(req, res, next) {
    // Сохраняем манифест в res.locals для использования в шаблонах
    res.locals.assetManifest = assetManifest;

    // Функция для получения пути к минифицированному файлу
    res.locals.getAssetPath = (originalPath) => {
        const fileName = path.basename(originalPath);
        return assetManifest[fileName] || originalPath;
    };

    next();
}

// Загружаем манифест при старте
loadManifest();

module.exports = { assetMiddleware, loadManifest };