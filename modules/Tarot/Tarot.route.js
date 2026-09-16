// modules/Tarot/Tarot.route.js
const express = require("express");

const TarotRoute = (app, routeName, routeController, makeHandlerAwareOfAsyncErrors) => {

    // ========== ПУБЛИЧНЫЕ API ==========

    // Получить все карты Таро из БД
    if (routeController.getAllCards) {
        app.get(
            '/api/tarot/cards',
            makeHandlerAwareOfAsyncErrors(routeController.getAllCards)
        );
    }

    // Получить карту по номеру
    if (routeController.getCardByNumber) {
        app.get(
            '/api/tarot/cards/:number',
            makeHandlerAwareOfAsyncErrors(routeController.getCardByNumber)
        );
    }

    // Сделать расклад (публичный - может быть без авторизации)
    if (routeController.makeReading) {
        app.post(
            '/api/tarot/reading',
            makeHandlerAwareOfAsyncErrors(routeController.makeReading)
        );
    }

    // ========== ЗАЩИЩЕННЫЕ API (ТРЕБУЕТСЯ АВТОРИЗАЦИЯ) ==========

    // Сохранить расклад в историю
    if (routeController.saveReading) {
        app.post(
            '/api/tarot/reading/save',
            (req, res, next) => {
                const tokenService = new (require('../Core/Services/TokenService'))();
                return tokenService.authMiddleware()(req, res, next);
            },
            makeHandlerAwareOfAsyncErrors(routeController.saveReading)
        );
    }

    // История раскладов пользователя
    if (routeController.getUserReadings) {
        app.get(
            '/api/tarot/readings/history',
            (req, res, next) => {
                const tokenService = new (require('../Core/Services/TokenService'))();
                return tokenService.authMiddleware()(req, res, next);
            },
            makeHandlerAwareOfAsyncErrors(routeController.getUserReadings)
        );
    }

    // Получить конкретный расклад по ID
    if (routeController.getReadingById) {
        app.get(
            '/api/tarot/readings/:id',
            (req, res, next) => {
                const tokenService = new (require('../Core/Services/TokenService'))();
                return tokenService.authMiddleware()(req, res, next);
            },
            makeHandlerAwareOfAsyncErrors(routeController.getReadingById)
        );
    }

    // ========== АДМИНИСТРАТИВНЫЕ API ==========

    // Создать новую карту (для админов)
    if (routeController.createCard) {
        app.post(
            '/api/tarot/admin/cards',
            (req, res, next) => {
                const tokenService = new (require('../Core/Services/TokenService'))();
                return tokenService.authMiddleware('admin')(req, res, next);
            },
            makeHandlerAwareOfAsyncErrors(routeController.createCard)
        );
    }

    // Обновить карту
    if (routeController.updateCard) {
        app.put(
            '/api/tarot/admin/cards/:id',
            (req, res, next) => {
                const tokenService = new (require('../Core/Services/TokenService'))();
                return tokenService.authMiddleware('admin')(req, res, next);
            },
            makeHandlerAwareOfAsyncErrors(routeController.updateCard)
        );
    }

    // Удалить карту
    if (routeController.deleteCard) {
        app.delete(
            '/api/tarot/admin/cards/:id',
            (req, res, next) => {
                const tokenService = new (require('../Core/Services/TokenService'))();
                return tokenService.authMiddleware('admin')(req, res, next);
            },
            makeHandlerAwareOfAsyncErrors(routeController.deleteCard)
        );
    }

    // Статистика раскладов
    if (routeController.getAdminStats) {
        app.get(
            '/api/tarot/admin/stats',
            (req, res, next) => {
                const tokenService = new (require('../Core/Services/TokenService'))();
                return tokenService.authMiddleware('admin')(req, res, next);
            },
            makeHandlerAwareOfAsyncErrors(routeController.getAdminStats)
        );
    }
};

module.exports = TarotRoute;