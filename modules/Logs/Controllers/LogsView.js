// modules/Logs/Controllers/LogsView.js
const LogsCntrl = require('./LogsCntrl');

const controller = new LogsCntrl();

// ========== ПОЛУЧЕНИЕ ЛОГОВ ==========

async function getLogs(req, res) {
    try {
        // Фильтры
        const filters = {};

        if (req.query.level && req.query.level !== 'undefined' && req.query.level !== '') {
            filters.level = req.query.level;
        }

        if (req.query.type && req.query.type !== 'undefined' && req.query.type !== '') {
            filters.type = req.query.type;
        }

        if (req.query.module && req.query.module !== 'undefined' && req.query.module !== '') {
            filters.module = req.query.module;
        }

        if (req.query.userId && req.query.userId !== 'undefined' && req.query.userId !== '') {
            filters.userId = req.query.userId;
        }

        if (req.query.search && req.query.search !== 'undefined' && req.query.search !== '') {
            filters.search = req.query.search;
        }

        // Булевы значения
        if (req.query.isRead === 'true') filters.isRead = true;
        if (req.query.isRead === 'false') filters.isRead = false;

        if (req.query.isResolved === 'true') filters.isResolved = true;
        if (req.query.isResolved === 'false') filters.isResolved = false;

        // Даты
        if (req.query.dateFrom && req.query.dateFrom !== 'undefined' && req.query.dateFrom !== '') {
            filters.dateFrom = req.query.dateFrom;
        }

        if (req.query.dateTo && req.query.dateTo !== 'undefined' && req.query.dateTo !== '') {
            filters.dateTo = req.query.dateTo;
        }

        // Пагинация
        const pagination = {
            page: req.query.page && req.query.page !== 'undefined' ? parseInt(req.query.page) : 1,
            limit: req.query.limit && req.query.limit !== 'undefined' ? parseInt(req.query.limit) : 50
        };

        const result = await controller.getLogs(filters, pagination);
        res.json(result);
    } catch (error) {
        console.error('Error in getLogs:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getLogById(req, res) {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid log ID' });
        }

        const log = await controller.getLogById(id);
        if (!log) {
            return res.status(404).json({ error: 'Log not found' });
        }
        res.json(log);
    } catch (error) {
        console.error('Error in getLogById:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getStats(req, res) {
    try {
        const days = parseInt(req.query.days) || 7;
        const stats = await controller.getStats(days);
        res.json(stats);
    } catch (error) {
        console.error('Error in getStats:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getAvailableFilters(req, res) {
    try {
        const filters = await controller.getAvailableFilters();
        res.json(filters);
    } catch (error) {
        console.error('Error in getAvailableFilters:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function markAsRead(req, res) {
    try {
        const { logIds } = req.body;
        if (!logIds || !Array.isArray(logIds)) {
            return res.status(400).json({ error: 'logIds array required' });
        }

        const count = await controller.markAsRead(logIds);
        res.json({ success: true, count });
    } catch (error) {
        console.error('Error in markAsRead:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function markAsResolved(req, res) {
    try {
        const { logIds, comment } = req.body;
        if (!logIds || !Array.isArray(logIds)) {
            return res.status(400).json({ error: 'logIds array required' });
        }

        const count = await controller.markAsResolved(logIds, null, comment);
        res.json({ success: true, count });
    } catch (error) {
        console.error('Error in markAsResolved:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function deleteLogs(req, res) {
    try {
        const { logIds } = req.body;
        if (!logIds || !Array.isArray(logIds)) {
            return res.status(400).json({ error: 'logIds array required' });
        }

        const count = await controller.deleteLogs(logIds);
        res.json({ success: true, count });
    } catch (error) {
        console.error('Error in deleteLogs:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function cleanup(req, res) {
    try {
        const days = parseInt(req.body.days) || 30;
        const count = await controller.cleanup(days);
        res.json({ success: true, deleted: count });
    } catch (error) {
        console.error('Error in cleanup:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function exportLogs(req, res) {
    try {
        const format = req.query.format || 'json';
        const filters = {
            level: req.query.level && req.query.level !== 'undefined' ? req.query.level : undefined,
            type: req.query.type && req.query.type !== 'undefined' ? req.query.type : undefined,
            module: req.query.module && req.query.module !== 'undefined' ? req.query.module : undefined,
            dateFrom: req.query.dateFrom && req.query.dateFrom !== 'undefined' ? req.query.dateFrom : undefined,
            dateTo: req.query.dateTo && req.query.dateTo !== 'undefined' ? req.query.dateTo : undefined
        };

        const logs = await controller.exportLogs(filters);

        if (format === 'csv') {
            const headers = Object.keys(logs[0] || {}).join(',');
            const rows = logs.map(l =>
                Object.values(l).map(v =>
                    typeof v === 'string' ? `"${v.replace(/"/g, '""')}"` : v
                ).join(',')
            ).join('\n');

            const csv = headers + '\n' + rows;

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=logs.csv');
            res.send(csv);
        } else {
            res.json(logs);
        }
    } catch (error) {
        console.error('Error in exportLogs:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getLogs,
    getLogById,
    getStats,
    getAvailableFilters,
    markAsRead,
    markAsResolved,
    deleteLogs,
    cleanup,
    exportLogs
};