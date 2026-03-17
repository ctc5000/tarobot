const { models } = require('../../../sequelize');
const { Op, fn, col, literal} = require('sequelize');

class LoggerService {
    constructor() {
        this.logLevels = {
            debug: 0,
            info: 1,
            warning: 2,
            error: 3,
            critical: 4
        };

        this.minLevel = process.env.LOG_LEVEL || 'info';
        this.consoleOutput = false; // process.env.LOG_CONSOLE != 'false';
        this.databaseOutput = process.env.LOG_DATABASE !== 'false';
        this.maxAgeDays = parseInt(process.env.LOG_MAX_AGE_DAYS) || 30;
    }

    // Основной метод логирования
    async log(level, type, message, options = {}) {
        // Проверяем уровень логирования
        if (this.logLevels[level] < this.logLevels[this.minLevel]) {
            return;
        }

        // Преобразуем message в строку
        let messageStr = message;
        if (typeof message !== 'string') {
            try {
                messageStr = JSON.stringify(message);
            } catch (e) {
                messageStr = String(message);
            }
        }

        const logData = {
            level,
            type,
            message: messageStr,
            details: options.details || null,
            module: options.module || null,
            userId: options.userId || null,
            orderId: options.orderId || null,
            ip: options.ip || null,
            userAgent: options.userAgent || null,
            url: options.url || null,
            method: options.method || null,
            statusCode: options.statusCode || null,
            responseTime: options.responseTime || null
        };

        // Вывод в консоль
        if (this.consoleOutput) {
            this._consoleOutput(logData);
        }

        // Сохранение в БД
        if (this.databaseOutput) {
            await this._databaseOutput(logData).catch(err => {
                console.error('Failed to save log to database:', err.message);
            });
        }

        return logData;
    }

    // Уровни логирования
    async debug(type, message, options = {}) {
        return this.log('debug', type, message, options);
    }

    async info(type, message, options = {}) {
        return this.log('info', type, message, options);
    }

    async warning(type, message, options = {}) {
        return this.log('warning', type, message, options);
    }

    async error(type, message, options = {}) {
        return this.log('error', type, message, options);
    }

    async critical(type, message, options = {}) {
        return this.log('critical', type, message, options);
    }

    // Получение логов с фильтрацией
    async getLogs(filters = {}, pagination = {}) {
        const where = {};
        const { models } = require('../../../sequelize');

        // Обработка ID - проверяем что это число
        if (filters.id) {
            const id = parseInt(filters.id);
            if (!isNaN(id)) {
                where.id = id;
            }
        }

        if (filters.level) where.level = filters.level;
        if (filters.type) where.type = filters.type;
        if (filters.module) where.module = filters.module;

        // Проверяем что userId - UUID (не преобразуем в число!)
        if (filters.userId) {
            where.userId = filters.userId; // UUID остается как строка
        }

        if (filters.isRead !== undefined) where.isRead = filters.isRead;
        if (filters.isResolved !== undefined) where.isResolved = filters.isResolved;

        // Поиск по сообщению
        if (filters.search) {
            where.message = { [Op.iLike]: `%${filters.search}%` };
        }

        // Фильтр по дате
        if (filters.dateFrom || filters.dateTo) {
            where.createdAt = {};
            if (filters.dateFrom) {
                const dateFrom = new Date(filters.dateFrom);
                if (!isNaN(dateFrom)) {
                    where.createdAt[Op.gte] = dateFrom;
                }
            }
            if (filters.dateTo) {
                const dateTo = new Date(filters.dateTo);
                if (!isNaN(dateTo)) {
                    dateTo.setHours(23, 59, 59, 999);
                    where.createdAt[Op.lte] = dateTo;
                }
            }
        }

        // Пагинация
        const limit = Math.min(parseInt(pagination.limit) || 50, 1000);
        const offset = ((parseInt(pagination.page) || 1) - 1) * limit;
        const order = pagination.order || [['createdAt', 'DESC']];

        const { count, rows } = await models.Log.findAndCountAll({
            where,
            limit,
            offset,
            order,
            include: [
                {
                    model: models.User,
                    as: 'user',
                    attributes: ['id', 'fullName', 'email'],
                    required: false
                }
            ]
        });

        return {
            total: count,
            page: Math.floor(offset / limit) + 1,
            totalPages: Math.ceil(count / limit),
            limit,
            data: rows
        };
    }

    // Получение одного лога по ID
    async getLogById(id) {
        const logId = parseInt(id);
        if (isNaN(logId)) {
            return null;
        }

        return await models.Log.findByPk(logId, {
            include: [
                {
                    model: models.user,
                    as: 'user',
                    attributes: ['id', 'login', 'displayName'],
                    required: false
                },
                {
                    model: models.preorder,
                    as: 'order',
                    attributes: ['id', 'tableId'],
                    required: false
                }
            ]
        });
    }

    // Получение статистики
    async getStats(days = 7) {
        const since = new Date();
        since.setDate(since.getDate() - days);

        const total = await models.Log.count({
            where: {
                createdAt: { [Op.gte]: since }
            }
        });

        const byLevel = await models.Log.findAll({
            attributes: [
                'level',
                [fn('COUNT', col('id')), 'count']
            ],
            where: {
                createdAt: { [Op.gte]: since }
            },
            group: ['level']
        });

        const byType = await models.Log.findAll({
            attributes: [
                'type',
                [fn('COUNT', col('id')), 'count']
            ],
            where: {
                createdAt: { [Op.gte]: since },
                type: { [Op.ne]: null }
            },
            group: ['type'],
            limit: 10,
            order: [[literal('count'), 'DESC']]
        });

        const byModule = await models.Log.findAll({
            attributes: [
                'module',
                [fn('COUNT', col('id')), 'count']
            ],
            where: {
                createdAt: { [Op.gte]: since },
                module: { [Op.ne]: null }
            },
            group: ['module'],
            limit: 10,
            order: [[literal('count'), 'DESC']]
        });

        return {
            period: `${days} days`,
            since,
            total,
            byLevel,
            byType,
            byModule
        };
    }

    // Получение доступных фильтров
    async getAvailableFilters() {
        const levels = await models.Log.findAll({
            attributes: [[fn('DISTINCT', col('level')), 'level']],
            where: { level: { [Op.ne]: null } }
        });

        const types = await models.Log.findAll({
            attributes: [[fn('DISTINCT', col('type')), 'type']],
            where: { type: { [Op.ne]: null } },
            limit: 100
        });

        const modules = await models.Log.findAll({
            attributes: [[fn('DISTINCT', col('module')), 'module']],
            where: { module: { [Op.ne]: null } }
        });

        return {
            levels: levels.map(l => l.level),
            types: types.map(t => t.type),
            modules: modules.map(m => m.module)
        };
    }

    // Отметить как прочитанное
    async markAsRead(logIds) {
        // Преобразуем все ID в числа и фильтруем валидные
        const validIds = (Array.isArray(logIds) ? logIds : [logIds])
            .map(id => parseInt(id))
            .filter(id => !isNaN(id));

        if (validIds.length === 0) return 0;

        const [count] = await models.Log.update(
            { isRead: true },
            {
                where: {
                    id: validIds,
                    isRead: false
                }
            }
        );
        return count;
    }

    // Отметить как решенное
    async markAsResolved(logIds, resolvedBy = null, comment = null) {
        const validIds = (Array.isArray(logIds) ? logIds : [logIds])
            .map(id => parseInt(id))
            .filter(id => !isNaN(id));

        if (validIds.length === 0) return 0;

        const [count] = await models.Log.update(
            {
                isResolved: true,
                resolvedBy: resolvedBy ? parseInt(resolvedBy) : null,
                resolvedAt: new Date(),
                resolutionComment: comment
            },
            {
                where: {
                    id: validIds,
                    level: { [Op.in]: ['error', 'critical'] },
                    isResolved: false
                }
            }
        );
        return count;
    }

    // Удалить логи
    async deleteLogs(logIds) {
        const validIds = (Array.isArray(logIds) ? logIds : [logIds])
            .map(id => parseInt(id))
            .filter(id => !isNaN(id));

        if (validIds.length === 0) return 0;

        return await models.Log.destroy({
            where: { id: validIds }
        });
    }

    // Очистка старых логов
    async cleanup(olderThanDays = null) {
        const days = olderThanDays || this.maxAgeDays;
        const date = new Date();
        date.setDate(date.getDate() - days);

        return await models.Log.destroy({
            where: {
                createdAt: {
                    [Op.lt]: date
                }
            }
        });
    }

    // Вывод в консоль
    _consoleOutput(log) {
        const colors = {
            debug: '\x1b[36m',
            info: '\x1b[32m',
            warning: '\x1b[33m',
            error: '\x1b[31m',
            critical: '\x1b[41m'
        };
        const reset = '\x1b[0m';

        const timestamp = new Date().toISOString();
        const color = colors[log.level] || '';

        let output = `${color}[${timestamp}] [${log.level.toUpperCase()}] [${log.type}]${reset} ${log.message}`;

        if (log.module) {
            output = `${color}[${timestamp}] [${log.level.toUpperCase()}] [${log.module}] [${log.type}]${reset} ${log.message}`;
        }

        if (log.details) {
            console.log(`[LoggerService.js] `, output, log.details);
        } else {
            console.log(`[LoggerService.js] `, output);
        }
    }

    // Сохранение в БД
    async _databaseOutput(log) {
        try {
            await models.Log.create(log);
            await this._cleanupOldLogs();
        } catch (error) {
            console.error('Failed to save log to database:', error.message);
            throw error; // Пробрасываем ошибку дальше
        }
    }

    // Очистка старых логов (автоматическая)
    async _cleanupOldLogs() {
        try {
            if (Math.random() < 0.01) { // 1% chance
                const deleted = await this.cleanup();
                if (deleted > 0) {
                    console.log(`[LoggerService.js] `, `🧹 Cleaned up ${deleted} old logs`);
                }
            }
        } catch (error) {
            console.error('Failed to cleanup old logs:', error);
        }
    }
}

module.exports = LoggerService;