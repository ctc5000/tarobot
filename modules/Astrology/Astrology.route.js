// modules/astrology/astrology.route.js
const path = require('path');
const express = require("express");

const AstrologyRoute = (app, routeName, routeController, makeHandlerAwareOfAsyncErrors) => {
    // ========== СТАТИЧЕСКИЕ ФАЙЛЫ ==========
    app.use('/astrology', express.static(path.join(__dirname, 'web')));

    // ========== ВЕБ-ИНТЕРФЕЙС ==========
    app.get('/astrology', (req, res) => {
        res.sendFile(path.join(__dirname, 'web', 'index.html'));
    });

    // ========== ЗАЩИЩЕННЫЕ API (ТРЕБУЕТСЯ АВТОРИЗАЦИЯ) ==========

    // Расчет натальной карты
    if (routeController.calculateNatalChart) {
        app.post(
            '/api/astrology/natal-chart',
            (req, res, next) => {
                const tokenService = new (require('../Core/Services/TokenService'))();
                return tokenService.authMiddleware()(req, res, next);
            },
            makeHandlerAwareOfAsyncErrors(routeController.calculateNatalChart)
        );
    }

    // История расчетов
    if (routeController.getHistory) {
        app.get(
            '/api/astrology/history',
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
            '/api/astrology/calculations/:id',
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
            '/api/astrology/pdf/:id',
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
            '/api/astrology/admin/stats',
            (req, res, next) => {
                const tokenService = new (require('../Core/Services/TokenService'))();
                return tokenService.authMiddleware('admin')(req, res, next);
            },
            makeHandlerAwareOfAsyncErrors(routeController.getAdminStats)
        );
    }
};

module.exports = AstrologyRoute;