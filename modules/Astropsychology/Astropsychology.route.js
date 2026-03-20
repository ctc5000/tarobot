// modules/Astropsychology/Astropsychology.route.js
const path = require('path');
const express = require("express");

const AstropsychologyRoute = (app, routeName, routeController, makeHandlerAwareOfAsyncErrors) => {

    // ========== СТАТИЧЕСКИЕ ФАЙЛЫ ==========
    app.use('/astropsychology', express.static(path.join(__dirname, 'web')));

    // ========== ВЕБ-ИНТЕРФЕЙС ==========
    app.get('/astropsychology', (req, res) => {
        res.sendFile(path.join(__dirname, 'web', 'index.html'));
    });

    // ========== ПУБЛИЧНЫЕ API ==========

    // Получить список типов расчетов
    if (routeController && routeController.getCalculationTypes) {
        app.get(
            '/api/astropsychology/types',
            makeHandlerAwareOfAsyncErrors(routeController.getCalculationTypes)
        );
    } else {
        console.error('[Astropsychology Route] ❌ routeController.getCalculationTypes не найден!');
    }

    // ========== ЗАЩИЩЕННЫЕ API ==========

    // Расчет астропсихологического портрета (разные типы)
    if (routeController && routeController.calculate) {
        app.post(
            '/api/astropsychology/calculate/:type',
            (req, res, next) => {
                const tokenService = new (require('../Core/Services/TokenService'))();
                return tokenService.authMiddleware()(req, res, next);
            },
            makeHandlerAwareOfAsyncErrors(routeController.calculate)
        );
    }

    // История расчетов
    if (routeController && routeController.getHistory) {
        app.get(
            '/api/astropsychology/history',
            (req, res, next) => {
                const tokenService = new (require('../Core/Services/TokenService'))();
                return tokenService.authMiddleware()(req, res, next);
            },
            makeHandlerAwareOfAsyncErrors(routeController.getHistory)
        );
    }

    // Получение конкретного расчета
    if (routeController && routeController.getCalculation) {
        app.get(
            '/api/astropsychology/calculations/:id',
            (req, res, next) => {
                const tokenService = new (require('../Core/Services/TokenService'))();
                return tokenService.authMiddleware()(req, res, next);
            },
            makeHandlerAwareOfAsyncErrors(routeController.getCalculation)
        );
    }

    // Скачать PDF
    if (routeController && routeController.downloadPdf) {
        app.get(
            '/api/astropsychology/pdf/:id',
            (req, res, next) => {
                const tokenService = new (require('../Core/Services/TokenService'))();
                return tokenService.authMiddleware()(req, res, next);
            },
            makeHandlerAwareOfAsyncErrors(routeController.downloadPdf)
        );
    }

    // ========== АДМИНИСТРАТИВНЫЕ API ==========

    if (routeController && routeController.getAdminStats) {
        app.get(
            '/api/astropsychology/admin/stats',
            (req, res, next) => {
                const tokenService = new (require('../Core/Services/TokenService'))();
                return tokenService.authMiddleware('admin')(req, res, next);
            },
            makeHandlerAwareOfAsyncErrors(routeController.getAdminStats)
        );
    }

};

module.exports = AstropsychologyRoute;