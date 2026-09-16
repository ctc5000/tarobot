// modules/Numerology/Numerology.route.js
const express = require("express");

const NumerologyRoute = (app, routeName, routeController, makeHandlerAwareOfAsyncErrors) => {
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

    // Совместимость
    if (routeController.calculateCompatibility) {
        app.post(
            '/api/numerology/compatibility',
            (req, res, next) => {
                const tokenService = new (require('../Core/Services/TokenService'))();
                return tokenService.authMiddleware()(req, res, next);
            },
            makeHandlerAwareOfAsyncErrors(routeController.calculateCompatibility)
        );
    }

    // Профессиональный расчет (для нумерологов)
    if (routeController.calculateProfessional) {
        app.post(
            '/api/numerology/calculate/professional',
            (req, res, next) => {
                const tokenService = new (require('../Core/Services/TokenService'))();
                return tokenService.authMiddleware()(req, res, next);
            },
            makeHandlerAwareOfAsyncErrors(routeController.calculateProfessional)
        );
    }

    // Получение тарифов нумерологии
    if (routeController.getNumerologyServices) {
        app.get(
            '/api/numerology/services',
            makeHandlerAwareOfAsyncErrors(routeController.getNumerologyServices)
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