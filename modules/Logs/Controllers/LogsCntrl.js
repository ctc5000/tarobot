const LoggerService = require('../Services/LoggerService');
const {fn, Op, col} = require("sequelize");

class LogsCntrl {
    constructor() {
        this.logger = new LoggerService();
    }

    // ========== ПОЛУЧЕНИЕ ЛОГОВ ==========

    async getLogs(filters = {}, pagination = {}) {
        return await this.logger.getLogs(filters, pagination);
    }

    async getLogById(id) {
        const logs = await this.logger.getLogs({id:id });
        return logs.data[0] || null;
    }

    // ========== СТАТИСТИКА ==========

    async getStats(days = 7) {
        return await this.logger.getStats(days);
    }

    // ========== УПРАВЛЕНИЕ ЛОГАМИ ==========

    async markAsRead(logIds) {
        return await this.logger.markAsRead(logIds);
    }

    async markAsResolved(logIds, comment = null) {
        return await this.logger.markAsResolved(logIds, null, comment);
    }

    async deleteLogs(logIds) {
        return await this.logger.deleteLogs(logIds);
    }

    async cleanup(olderThanDays) {
        return await this.logger.cleanup(olderThanDays);
    }

    // ========== ЭКСПОРТ ==========

    async exportLogs(filters = {}) {
        const { models } = require('../../../sequelize');

        const logs = await models.Log.findAll({
            where: filters,
            order: [['createdAt', 'DESC']],
            limit: 10000
        });

        return logs.map(log => ({
            id: log.id,
            timestamp: log.createdAt,
            level: log.level,
            type: log.type,
            module: log.module,
            message: log.message,
            userId: log.userId,
            ip: log.ip,
            method: log.method,
            url: log.url,
            statusCode: log.statusCode,
            responseTime: log.responseTime,
            details: log.details
        }));
    }

    // ========== ДОСТУПНЫЕ ФИЛЬТРЫ ==========

    async getAvailableFilters() {
        const { models } = require('../../../sequelize');

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
}

module.exports = LogsCntrl;