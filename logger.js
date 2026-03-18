/**
 * Глобальный логгер с ленивой инициализацией
 */

let LoggerService = null;
let loggerInstance = null;
let moduleAvailable = true;

// Пытаемся загрузить модуль логов
try {
    LoggerService = require('./modules/Logs/Services/LoggerService');
    //console.log(`[logger.js] `, '📝 Модуль логирования доступен');
} catch (error) {
    console.warn('⚠️ Модуль логирования не найден, логгер будет использовать console');
    moduleAvailable = false;
}

class AppLogger {
    constructor() {
        if (!AppLogger.instance) {
            // Пытаемся создать экземпляр логгера если модуль доступен
            if (moduleAvailable && LoggerService) {
                try {
                    this.logger = new LoggerService();
                    console.log(`[logger.js] `, '✅ Логгер инициализирован');
                } catch (e) {
                    console.warn('⚠️ Не удалось инициализировать логгер:', e.message);
                    moduleAvailable = false;
                }
            }
            AppLogger.instance = this;
        }
        return AppLogger.instance;
    }

    _getCallerModule() {
        try {
            const stack = new Error().stack;
            const callerLine = stack.split('\n')[3] || '';

            const match = callerLine.match(/[\\/]modules[\\/]([^\\/]+)[\\/]/);
            if (match) {
                return match[1];
            }

            // Пытаемся определить по пути файла
            const fileMatch = callerLine.match(/[\\/]([^\\/]+)\.js/);
            if (fileMatch) {
                return fileMatch[1];
            }
        } catch (e) {
            // Игнорируем ошибки определения модуля
        }
        return 'App';
    }

    _enrichOptions(options = {}) {
        return {
            ...options,
            module: this._getCallerModule(),
            timestamp: new Date().toISOString()
        };
    }

    // Безопасные методы логирования
    async debug(type, message, options = {}) {
        if (moduleAvailable && this.logger) {
            try {
                return await this.logger.debug(type, message, this._enrichOptions(options));
            } catch (error) {
                console.error('Ошибка при логировании:', error);
            }
        }
        // Fallback на console.log
        console.log(`[logger.js] `, `[DEBUG] [${type}] [${this._getCallerModule()}] ${message}`, options.details || '');
        return { success: true, fallback: true };
    }

    async info(type, message, options = {}) {
        if (moduleAvailable && this.logger) {
            try {
                return await this.logger.info(type, message, this._enrichOptions(options));
            } catch (error) {
                console.error('Ошибка при логировании:', error);
            }
        }
        console.log(`[logger.js] `, `[INFO] [${type}] [${this._getCallerModule()}] ${message}`, options.details || '');
        return { success: true, fallback: true };
    }

    async warn(type, message, options = {}) {
        if (moduleAvailable && this.logger) {
            try {
                return await this.logger.warning(type, message, this._enrichOptions(options));
            } catch (error) {
                console.error('Ошибка при логировании:', error);
            }
        }
        console.warn(`[WARN] [${type}] [${this._getCallerModule()}] ${message}`, options.details || '');
        return { success: true, fallback: true };
    }

    async error(type, message, options = {}) {
        if (moduleAvailable && this.logger) {
            try {
                return await this.logger.error(type, message, this._enrichOptions(options));
            } catch (error) {
                console.error('Ошибка при логировании:', error);
            }
        }
        console.error(`[ERROR] [${type}] [${this._getCallerModule()}] ${message}`, options.details || '');
        return { success: true, fallback: true };
    }

    async critical(type, message, options = {}) {
        if (moduleAvailable && this.logger) {
            try {
                return await this.logger.critical(type, message, this._enrichOptions(options));
            } catch (error) {
                console.error('Ошибка при логировании:', error);
            }
        }
        console.error(`[CRITICAL] [${type}] [${this._getCallerModule()}] ${message}`, options.details || '');
        return { success: true, fallback: true };
    }

    // Синхронные версии для случаев, где async неудобен
    debugSync(type, message, options = {}) {
        console.log(`[logger.js] `, `[DEBUG] [${type}] [${this._getCallerModule()}] ${message}`, options.details || '');
    }

    infoSync(type, message, options = {}) {
        console.log(`[logger.js] `, `[INFO] [${type}] [${this._getCallerModule()}] ${message}`, options.details || '');
    }

    warnSync(type, message, options = {}) {
        console.warn(`[WARN] [${type}] [${this._getCallerModule()}] ${message}`, options.details || '');
    }

    errorSync(type, message, options = {}) {
        console.error(`[ERROR] [${type}] [${this._getCallerModule()}] ${message}`, options.details || '');
    }

    // Проверка доступности
    isAvailable() {
        return moduleAvailable && this.logger !== null;
    }

    // Перезагрузка логгера
    async reload() {
        if (!moduleAvailable) {
            try {
                LoggerService = require('./modules/Logs/Services/LoggerService');
                this.logger = new LoggerService();
                moduleAvailable = true;
                console.log(`[logger.js] `, '📝 Логгер успешно перезагружен');
                return true;
            } catch (error) {
                console.warn('⚠️ Не удалось перезагрузить логгер:', error.message);
                return false;
            }
        }
        return true;
    }
}

// Создаем глобальный экземпляр
const logger = new AppLogger();
global.log = logger;

module.exports = logger;