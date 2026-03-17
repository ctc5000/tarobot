/**
 * Модуль: Logs (Логирование)
 * Описание: Маршруты для работы с системой логирования
 * Версия: 1.0.0
 */

const LogsRoute = (app, routeName, routeController, makeHandlerAwareOfAsyncErrors) => {
    // Используем переданный routeController, а не импортируем заново
    console.log(`🔧 Регистрация маршрутов для /api/${routeName}`);
    console.log(`📋 Доступные методы:`, Object.keys(routeController));
    /**
     * =========================================================================
     * API ЭНДПОИНТЫ ДЛЯ РАБОТЫ С ЛОГАМИ
     * =========================================================================
     */

    /**
     * @route   GET /api/logs
     * @desc    Получение списка логов с фильтрацией и пагинацией
     * @access  Private (требуется авторизация)
     */
    if (routeController.getLogs) {
        app.get(
            `/api/${routeName}`,
            makeHandlerAwareOfAsyncErrors(routeController.getLogs)
        );
    }

    /**
     * @route   GET /api/logs/stats
     * @desc    Получение статистики по логам
     * @access  Private
     */
    if (routeController.getStats) {
        app.get(
            `/api/${routeName}/stats`,
            makeHandlerAwareOfAsyncErrors(routeController.getStats)
        );
    }

    /**
     * @route   GET /api/logs/filters
     * @desc    Получение доступных фильтров
     * @access  Private
     */
    if (routeController.getAvailableFilters) {
        app.get(
            `/api/${routeName}/filters`,
            makeHandlerAwareOfAsyncErrors(routeController.getAvailableFilters)
        );
    }

    /**
     * @route   GET /api/logs/export
     * @desc    Экспорт логов
     * @access  Private
     */
    if (routeController.exportLogs) {
        app.get(
            `/api/${routeName}/export`,
            makeHandlerAwareOfAsyncErrors(routeController.exportLogs)
        );
    }

    /**
     * @route   POST /api/logs/mark-read
     * @desc    Отметить логи как прочитанные
     * @access  Private
     */
    if (routeController.markAsRead) {
        app.post(
            `/api/${routeName}/mark-read`,
            makeHandlerAwareOfAsyncErrors(routeController.markAsRead)
        );
    }

    /**
     * @route   POST /api/logs/mark-resolved
     * @desc    Отметить ошибки как решенные
     * @access  Private
     */
    if (routeController.markAsResolved) {
        app.post(
            `/api/${routeName}/mark-resolved`,
            makeHandlerAwareOfAsyncErrors(routeController.markAsResolved)
        );
    }

    /**
     * @route   DELETE /api/logs/batch
     * @desc    Массовое удаление логов
     * @access  Private
     */
    if (routeController.deleteLogs) {
        app.delete(
            `/api/${routeName}/batch`,
            makeHandlerAwareOfAsyncErrors(routeController.deleteLogs)
        );
    }

    /**
     * @route   POST /api/logs/cleanup
     * @desc    Очистка старых логов
     * @access  Private
     */
    if (routeController.cleanup) {
        app.post(
            `/api/${routeName}/cleanup`,
            makeHandlerAwareOfAsyncErrors(routeController.cleanup)
        );
    }

    /**
     * @route   GET /api/logs/:id
     * @desc    Получение лога по ID (ДОЛЖЕН БЫТЬ ПОСЛЕДНИМ!)
     * @access  Private
     */
    if (routeController.getLogById) {
        app.get(
            `/api/${routeName}/:id`,
            makeHandlerAwareOfAsyncErrors(routeController.getLogById)
        );
    }
};

module.exports = LogsRoute;