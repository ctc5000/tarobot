// modules/Numerology/Numerology.route.js
const path = require('path');
const express = require("express");

const NumerologyRoute = (app, routeName, routeController, makeHandlerAwareOfAsyncErrors) => {
    // ========== СТАТИЧЕСКИЕ ФАЙЛЫ ==========
    app.use('/numerology', express.static(path.join(__dirname, 'web')));

    // ========== ВЕБ-ИНТЕРФЕЙС ==========
    app.get('/numerology', (req, res) => {
        res.sendFile(path.join(__dirname, 'web', 'index.html'));
    });

    // ========== ПУБЛИЧНЫЕ API ==========

    // Бесплатный базовый расчет (может быть без авторизации)
    if (routeController.calculateBasic) {
        app.post(
            '/api/numerology/calculate/basic',
            makeHandlerAwareOfAsyncErrors(routeController.calculateBasic)
        );
    }

    // ========== ЗАЩИЩЕННЫЕ API (ТРЕБУЕТСЯ АВТОРИЗАЦИЯ) ==========

    // Полный расчет
    if (routeController.calculateFull) {
        app.post(
            '/api/numerology/calculate/full',
            (req, res, next) => {
                const tokenService = new (require('../Core/Services/TokenService'))();
                return tokenService.authMiddleware()(req, res, next);
            },
            makeHandlerAwareOfAsyncErrors(routeController.calculateFull)
        );
    }

    // Прогнозы
    if (routeController.calculateForecast) {
        app.post(
            '/api/numerology/forecast/:type',
            (req, res, next) => {
                const tokenService = new (require('../Core/Services/TokenService'))();
                return tokenService.authMiddleware()(req, res, next);
            },
            makeHandlerAwareOfAsyncErrors(routeController.calculateForecast)
        );
    }

    // История расчетов
    if (routeController.getHistory) {
        app.get(
            '/api/numerology/history',
            (req, res, next) => {
                const tokenService = new (require('../Core/Services/TokenService'))();
                return tokenService.authMiddleware()(req, res, next);
            },
            makeHandlerAwareOfAsyncErrors(routeController.getHistory)
        );
    }

    // Получение конкретного расчета
    if (routeController.getCalculation) {
        app.get(
            '/api/numerology/calculations/:id',
            (req, res, next) => {
                const tokenService = new (require('../Core/Services/TokenService'))();
                return tokenService.authMiddleware()(req, res, next);
            },
            makeHandlerAwareOfAsyncErrors(routeController.getCalculation)
        );
    }

    // Скачать PDF
    if (routeController.downloadPdf) {
        app.get(
            '/api/numerology/pdf/:id',
            (req, res, next) => {
                const tokenService = new (require('../Core/Services/TokenService'))();
                return tokenService.authMiddleware()(req, res, next);
            },
            makeHandlerAwareOfAsyncErrors(routeController.downloadPdf)
        );
    }

    // ========== АДМИНИСТРАТИВНЫЕ API ==========
    if (routeController.getAdminStats) {
        app.get(
            '/api/numerology/admin/stats',
            (req, res, next) => {
                const tokenService = new (require('../Core/Services/TokenService'))();
                return tokenService.authMiddleware('admin')(req, res, next);
            },
            makeHandlerAwareOfAsyncErrors(routeController.getAdminStats)
        );
    }
};

module.exports = NumerologyRoute;