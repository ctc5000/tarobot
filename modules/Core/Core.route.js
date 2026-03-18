// modules/Core/Core.route.js
const tokenService = new (require('./Services/TokenService'))();
const path = require('path');
const { static } = require("express");

const CoreRoute = (app, routeName, routeController, makeHandlerAwareOfAsyncErrors) => {
    const authMiddleware = tokenService.authMiddleware();
    const adminMiddleware = tokenService.authMiddleware('admin');

    // ========== СТАТИЧЕСКИЕ ФАЙЛЫ ==========
    app.use('/core', static(path.join(__dirname, 'web')));

    // ========== ПУБЛИЧНЫЕ СТРАНИЦЫ ==========
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'web', 'index.html'));
    });

    app.get('/login', (req, res) => {
        res.sendFile(path.join(__dirname, 'web', 'auth', 'login.html'));
    });

    app.get('/register', (req, res) => {
        res.sendFile(path.join(__dirname, 'web', 'auth', 'register.html'));
    });

    app.get('/reset-password', (req, res) => {
        res.sendFile(path.join(__dirname, 'web', 'auth', 'reset-password.html'));
    });

    // ========== ЗАЩИЩЕННЫЕ СТРАНИЦЫ ==========
    app.get('/cabinet', (req, res) => {
        console.log('🔥 Отдаем страницу кабинета');
        res.sendFile(path.join(__dirname, 'web', 'cabinet', 'index.html'));
    });

    app.get('/cabinet/profile', (req, res) => {
        res.sendFile(path.join(__dirname, 'web', 'cabinet', 'profile.html'));
    });

    app.get('/cabinet/balance', (req, res) => {
        res.sendFile(path.join(__dirname, 'web', 'cabinet', 'balance.html'));
    });

    app.get('/cabinet/history', (req, res) => {
        res.sendFile(path.join(__dirname, 'web', 'cabinet', 'history.html'));
    });

    app.get('/cabinet/subscriptions', (req, res) => {
        res.sendFile(path.join(__dirname, 'web', 'cabinet', 'subscriptions.html'));
    });

    // ========== ПУБЛИЧНЫЕ API ==========
    // Регистрация и авторизация (оба варианта - с core и без)
    if (routeController.register) {
        app.post('/api/auth/register', makeHandlerAwareOfAsyncErrors(routeController.register));
        app.post('/api/core/auth/register', makeHandlerAwareOfAsyncErrors(routeController.register)); // для совместимости
    }

    if (routeController.login) {
        app.post('/api/auth/login', makeHandlerAwareOfAsyncErrors(routeController.login));
        app.post('/api/core/auth/login', makeHandlerAwareOfAsyncErrors(routeController.login)); // для совместимости
    }

    if (routeController.telegramLogin) {
        app.post('/api/auth/telegram', makeHandlerAwareOfAsyncErrors(routeController.telegramLogin));
        app.post('/api/core/auth/telegram', makeHandlerAwareOfAsyncErrors(routeController.telegramLogin));
    }

    if (routeController.refreshToken) {
        app.post('/api/auth/refresh', makeHandlerAwareOfAsyncErrors(routeController.refreshToken));
        app.post('/api/core/auth/refresh', makeHandlerAwareOfAsyncErrors(routeController.refreshToken));
    }

    if (routeController.verifyEmail) {
        app.get('/api/auth/verify/:token', makeHandlerAwareOfAsyncErrors(routeController.verifyEmail));
        app.get('/api/core/auth/verify/:token', makeHandlerAwareOfAsyncErrors(routeController.verifyEmail));
    }

    if (routeController.requestPasswordReset) {
        app.post('/api/auth/reset-request', makeHandlerAwareOfAsyncErrors(routeController.requestPasswordReset));
        app.post('/api/core/auth/reset-request', makeHandlerAwareOfAsyncErrors(routeController.requestPasswordReset));
    }

    if (routeController.resetPassword) {
        app.post('/api/auth/reset', makeHandlerAwareOfAsyncErrors(routeController.resetPassword));
        app.post('/api/core/auth/reset', makeHandlerAwareOfAsyncErrors(routeController.resetPassword));
    }

    // Публичные услуги
    if (routeController.getServices) {
        app.get('/api/services', makeHandlerAwareOfAsyncErrors(routeController.getServices));
        app.get('/api/core/services', makeHandlerAwareOfAsyncErrors(routeController.getServices));
    }

    if (routeController.getServiceByCode) {
        app.get('/api/services/:code', makeHandlerAwareOfAsyncErrors(routeController.getServiceByCode));
        app.get('/api/core/services/:code', makeHandlerAwareOfAsyncErrors(routeController.getServiceByCode));
    }

    // ========== ЗАЩИЩЕННЫЕ API ==========

    // Профиль
    if (routeController.getCurrentUser) {
        app.get('/api/profile', authMiddleware, makeHandlerAwareOfAsyncErrors(routeController.getCurrentUser));
        app.get('/api/core/profile', authMiddleware, makeHandlerAwareOfAsyncErrors(routeController.getCurrentUser));
    }

    if (routeController.updateUser) {
        app.put('/api/profile', authMiddleware, makeHandlerAwareOfAsyncErrors(routeController.updateUser));
        app.put('/api/core/profile', authMiddleware, makeHandlerAwareOfAsyncErrors(routeController.updateUser));
    }

    if (routeController.changePassword) {
        app.post('/api/profile/change-password', authMiddleware, makeHandlerAwareOfAsyncErrors(routeController.changePassword));
        app.post('/api/core/profile/change-password', authMiddleware, makeHandlerAwareOfAsyncErrors(routeController.changePassword));
    }

    // Баланс
    if (routeController.getBalance) {
        app.get('/api/balance', authMiddleware, makeHandlerAwareOfAsyncErrors(routeController.getBalance));
        app.get('/api/core/balance', authMiddleware, makeHandlerAwareOfAsyncErrors(routeController.getBalance));
    }

    if (routeController.getTransactions) {
        app.get('/api/transactions', authMiddleware, makeHandlerAwareOfAsyncErrors(routeController.getTransactions));
        app.get('/api/core/transactions', authMiddleware, makeHandlerAwareOfAsyncErrors(routeController.getTransactions));
    }

    if (routeController.getTransactionStats) {
        app.get('/api/transactions/stats', authMiddleware, makeHandlerAwareOfAsyncErrors(routeController.getTransactionStats));
        app.get('/api/core/transactions/stats', authMiddleware, makeHandlerAwareOfAsyncErrors(routeController.getTransactionStats));
    }

    // Подписки
    if (routeController.getSubscriptions) {
        app.get('/api/subscriptions', authMiddleware, makeHandlerAwareOfAsyncErrors(routeController.getSubscriptions));
        app.get('/api/core/subscriptions', authMiddleware, makeHandlerAwareOfAsyncErrors(routeController.getSubscriptions));
    }

    if (routeController.getActiveSubscription) {
        app.get('/api/subscriptions/active', authMiddleware, makeHandlerAwareOfAsyncErrors(routeController.getActiveSubscription));
        app.get('/api/core/subscriptions/active', authMiddleware, makeHandlerAwareOfAsyncErrors(routeController.getActiveSubscription));
    }

    if (routeController.cancelSubscription) {
        app.post('/api/subscriptions/:id/cancel', authMiddleware, makeHandlerAwareOfAsyncErrors(routeController.cancelSubscription));
        app.post('/api/core/subscriptions/:id/cancel', authMiddleware, makeHandlerAwareOfAsyncErrors(routeController.cancelSubscription));
    }
    if (routeController.buySubscription) {  // ← ДОБАВИТЬ ЭТОТ БЛОК
        app.post('/api/subscriptions/buy', authMiddleware, makeHandlerAwareOfAsyncErrors(routeController.buySubscription));
        app.post('/api/core/subscriptions/buy', authMiddleware, makeHandlerAwareOfAsyncErrors(routeController.buySubscription));
    }

    if (routeController.cancelSubscription) {
        app.post('/api/subscriptions/:id/cancel', authMiddleware, makeHandlerAwareOfAsyncErrors(routeController.cancelSubscription));
        app.post('/api/core/subscriptions/:id/cancel', authMiddleware, makeHandlerAwareOfAsyncErrors(routeController.cancelSubscription));
    }
    // ========== АДМИНИСТРАТИВНЫЕ API ==========
    if (routeController.getUsers) {
        app.get('/api/admin/users', adminMiddleware, makeHandlerAwareOfAsyncErrors(routeController.getUsers));
        app.get('/api/core/admin/users', adminMiddleware, makeHandlerAwareOfAsyncErrors(routeController.getUsers));
    }

    if (routeController.getUserById) {
        app.get('/api/admin/users/:id', adminMiddleware, makeHandlerAwareOfAsyncErrors(routeController.getUserById));
        app.get('/api/core/admin/users/:id', adminMiddleware, makeHandlerAwareOfAsyncErrors(routeController.getUserById));
    }

    if (routeController.updateUser) {
        app.put('/api/admin/users/:id', adminMiddleware, makeHandlerAwareOfAsyncErrors(routeController.updateUser));
        app.put('/api/core/admin/users/:id', adminMiddleware, makeHandlerAwareOfAsyncErrors(routeController.updateUser));
    }

    if (routeController.deleteUser) {
        app.delete('/api/admin/users/:id', adminMiddleware, makeHandlerAwareOfAsyncErrors(routeController.deleteUser));
        app.delete('/api/core/admin/users/:id', adminMiddleware, makeHandlerAwareOfAsyncErrors(routeController.deleteUser));
    }

    if (routeController.toggleUserStatus) {
        app.post('/api/admin/users/:id/toggle-status', adminMiddleware, makeHandlerAwareOfAsyncErrors(routeController.toggleUserStatus));
        app.post('/api/core/admin/users/:id/toggle-status', adminMiddleware, makeHandlerAwareOfAsyncErrors(routeController.toggleUserStatus));
    }

    if (routeController.adminAdjustBalance) {
        app.post('/api/admin/balance/adjust', adminMiddleware, makeHandlerAwareOfAsyncErrors(routeController.adminAdjustBalance));
        app.post('/api/core/admin/balance/adjust', adminMiddleware, makeHandlerAwareOfAsyncErrors(routeController.adminAdjustBalance));
    }

    if (routeController.createService) {
        app.post('/api/admin/services', adminMiddleware, makeHandlerAwareOfAsyncErrors(routeController.createService));
        app.post('/api/core/admin/services', adminMiddleware, makeHandlerAwareOfAsyncErrors(routeController.createService));
    }

    if (routeController.updateService) {
        app.put('/api/admin/services/:id', adminMiddleware, makeHandlerAwareOfAsyncErrors(routeController.updateService));
        app.put('/api/core/admin/services/:id', adminMiddleware, makeHandlerAwareOfAsyncErrors(routeController.updateService));
    }

    if (routeController.deleteService) {
        app.delete('/api/admin/services/:id', adminMiddleware, makeHandlerAwareOfAsyncErrors(routeController.deleteService));
        app.delete('/api/core/admin/services/:id', adminMiddleware, makeHandlerAwareOfAsyncErrors(routeController.deleteService));
    }
    // ========== РАСЧЕТЫ (нужны для истории) ==========
    if (routeController.getUserCalculations) {
        app.get('/api/calculations', authMiddleware, makeHandlerAwareOfAsyncErrors(routeController.getUserCalculations));
        app.get('/api/core/calculations', authMiddleware, makeHandlerAwareOfAsyncErrors(routeController.getUserCalculations));
    }

    if (routeController.getCalculationById) {
        app.get('/api/calculations/:id', authMiddleware, makeHandlerAwareOfAsyncErrors(routeController.getCalculationById));
        app.get('/api/core/calculations/:id', authMiddleware, makeHandlerAwareOfAsyncErrors(routeController.getCalculationById));
    }

};

module.exports = CoreRoute;