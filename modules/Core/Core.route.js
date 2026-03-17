// modules/Core/Core.route.js
const tokenService = new (require('./Services/TokenService'))();

const CoreRoute = (app, routeName, routeController, makeHandlerAwareOfAsyncErrors) => {
    const authMiddleware = tokenService.authMiddleware();
    const adminMiddleware = tokenService.authMiddleware('admin');

    /**
     * =========================================================================
     * ПУБЛИЧНЫЕ ЭНДПОИНТЫ (без авторизации)
     * =========================================================================
     */

    // Регистрация и авторизация
    if (routeController.register) {
        app.post(
            `/api/${routeName}/auth/register`,
            makeHandlerAwareOfAsyncErrors(routeController.register)
        );
    }

    if (routeController.login) {
        app.post(
            `/api/${routeName}/auth/login`,
            makeHandlerAwareOfAsyncErrors(routeController.login)
        );
    }

    if (routeController.telegramLogin) {
        app.post(
            `/api/${routeName}/auth/telegram`,
            makeHandlerAwareOfAsyncErrors(routeController.telegramLogin)
        );
    }

    if (routeController.refreshToken) {
        app.post(
            `/api/${routeName}/auth/refresh`,
            makeHandlerAwareOfAsyncErrors(routeController.refreshToken)
        );
    }

    if (routeController.verifyEmail) {
        app.get(
            `/api/${routeName}/auth/verify/:token`,
            makeHandlerAwareOfAsyncErrors(routeController.verifyEmail)
        );
    }

    if (routeController.requestPasswordReset) {
        app.post(
            `/api/${routeName}/auth/reset-request`,
            makeHandlerAwareOfAsyncErrors(routeController.requestPasswordReset)
        );
    }

    if (routeController.resetPassword) {
        app.post(
            `/api/${routeName}/auth/reset`,
            makeHandlerAwareOfAsyncErrors(routeController.resetPassword)
        );
    }

    // Публичные услуги
    if (routeController.getServices) {
        app.get(
            `/api/${routeName}/services`,
            makeHandlerAwareOfAsyncErrors(routeController.getServices)
        );
    }

    if (routeController.getServiceByCode) {
        app.get(
            `/api/${routeName}/services/:code`,
            makeHandlerAwareOfAsyncErrors(routeController.getServiceByCode)
        );
    }

    /**
     * =========================================================================
     * ЗАЩИЩЕННЫЕ ЭНДПОИНТЫ (требуется авторизация)
     * =========================================================================
     */

    // Профиль
    if (routeController.getCurrentUser) {
        app.get(
            `/api/${routeName}/profile`,
            authMiddleware,
            makeHandlerAwareOfAsyncErrors(routeController.getCurrentUser)
        );
    }

    if (routeController.changePassword) {
        app.post(
            `/api/${routeName}/profile/change-password`,
            authMiddleware,
            makeHandlerAwareOfAsyncErrors(routeController.changePassword)
        );
    }

    if (routeController.updateUser) {
        app.put(
            `/api/${routeName}/profile`,
            authMiddleware,
            makeHandlerAwareOfAsyncErrors(routeController.updateUser)
        );
    }

    // Баланс
    if (routeController.getBalance) {
        app.get(
            `/api/${routeName}/balance`,
            authMiddleware,
            makeHandlerAwareOfAsyncErrors(routeController.getBalance)
        );
    }

    if (routeController.getTransactions) {
        app.get(
            `/api/${routeName}/transactions`,
            authMiddleware,
            makeHandlerAwareOfAsyncErrors(routeController.getTransactions)
        );
    }

    if (routeController.getTransactionStats) {
        app.get(
            `/api/${routeName}/transactions/stats`,
            authMiddleware,
            makeHandlerAwareOfAsyncErrors(routeController.getTransactionStats)
        );
    }

    // Подписки
    if (routeController.getSubscriptions) {
        app.get(
            `/api/${routeName}/subscriptions`,
            authMiddleware,
            makeHandlerAwareOfAsyncErrors(routeController.getSubscriptions)
        );
    }

    if (routeController.getActiveSubscription) {
        app.get(
            `/api/${routeName}/subscriptions/active`,
            authMiddleware,
            makeHandlerAwareOfAsyncErrors(routeController.getActiveSubscription)
        );
    }

    if (routeController.cancelSubscription) {
        app.post(
            `/api/${routeName}/subscriptions/:id/cancel`,
            authMiddleware,
            makeHandlerAwareOfAsyncErrors(routeController.cancelSubscription)
        );
    }

    /**
     * =========================================================================
     * АДМИНИСТРАТИВНЫЕ ЭНДПОИНТЫ (требуется роль admin)
     * =========================================================================
     */

    // Управление пользователями
    if (routeController.getUsers) {
        app.get(
            `/api/${routeName}/admin/users`,
            adminMiddleware,
            makeHandlerAwareOfAsyncErrors(routeController.getUsers)
        );
    }

    if (routeController.getUserById) {
        app.get(
            `/api/${routeName}/admin/users/:id`,
            adminMiddleware,
            makeHandlerAwareOfAsyncErrors(routeController.getUserById)
        );
    }

    if (routeController.updateUser) {
        app.put(
            `/api/${routeName}/admin/users/:id`,
            adminMiddleware,
            makeHandlerAwareOfAsyncErrors(routeController.updateUser)
        );
    }

    if (routeController.deleteUser) {
        app.delete(
            `/api/${routeName}/admin/users/:id`,
            adminMiddleware,
            makeHandlerAwareOfAsyncErrors(routeController.deleteUser)
        );
    }

    if (routeController.toggleUserStatus) {
        app.post(
            `/api/${routeName}/admin/users/:id/toggle-status`,
            adminMiddleware,
            makeHandlerAwareOfAsyncErrors(routeController.toggleUserStatus)
        );
    }

    // Управление балансом
    if (routeController.adminAdjustBalance) {
        app.post(
            `/api/${routeName}/admin/balance/adjust`,
            adminMiddleware,
            makeHandlerAwareOfAsyncErrors(routeController.adminAdjustBalance)
        );
    }

    // Управление услугами
    if (routeController.createService) {
        app.post(
            `/api/${routeName}/admin/services`,
            adminMiddleware,
            makeHandlerAwareOfAsyncErrors(routeController.createService)
        );
    }

    if (routeController.updateService) {
        app.put(
            `/api/${routeName}/admin/services/:id`,
            adminMiddleware,
            makeHandlerAwareOfAsyncErrors(routeController.updateService)
        );
    }

    if (routeController.deleteService) {
        app.delete(
            `/api/${routeName}/admin/services/:id`,
            adminMiddleware,
            makeHandlerAwareOfAsyncErrors(routeController.deleteService)
        );
    }
};

module.exports = CoreRoute;