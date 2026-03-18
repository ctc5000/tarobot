// modules/Numerology/Controllers/NumerologyView.js
const NumerologyCalculationService = require('../Services/NumerologyCalculationService');
const NumerologyPdfService = require('../Services/NumerologyPdfService');

const calculationService = new NumerologyCalculationService();
const pdfService = new NumerologyPdfService();

// ========== БЕСПЛАТНЫЙ БАЗОВЫЙ РАСЧЕТ ==========

async function calculateBasic(req, res) {
    try {
        const { fullName, birthDate } = req.body;

        // Получаем userId из токена (если есть)
        let userId = null;
        if (req.headers.authorization) {
            const tokenService = new (require('../../Core/Services/TokenService'))();
            const token = req.headers.authorization.split(' ')[1];
            const user = await tokenService.getUserFromToken(token);
            if (user) {
                userId = user.id;
            }
        }

        // Валидация
        if (!fullName || !birthDate) {
            return res.status(400).json({
                success: false,
                error: 'Необходимо указать ФИО и дату рождения'
            });
        }

        const nameParts = fullName.trim().split(/\s+/);
        if (nameParts.length < 3) {
            return res.status(400).json({
                success: false,
                error: 'Необходимо указать фамилию, имя и отчество'
            });
        }

        // Если пользователь авторизован, проверяем бесплатный расчет
        if (userId) {
            const check = await calculationService.checkFreeCalculation(userId, fullName, birthDate);

            if (!check.allowed) {
                return res.status(402).json({  // 402 Payment Required
                    success: false,
                    error: 'Бесплатный расчет уже использован. Для полного расчета войдите в аккаунт и оплатите услугу.',
                    requiresPayment: true
                });
            }
        }

        // Выполняем базовый расчет
        const result = await calculationService.calculateBasic(fullName, birthDate, userId);

        // Если пользователь авторизован, обновляем профиль
        if (userId) {
            await calculationService.updateProfileAfterCalculation(userId, fullName, birthDate, true);

            // Сохраняем расчет в историю (бесплатный)
            await calculationService.saveCalculation(
                userId,
                'basic',
                result.data,
                0,
                null,
                null
            );
        } else {
            // Для неавторизованных просто возвращаем результат
            result.message = 'Бесплатный расчет для гостя. Зарегистрируйтесь, чтобы сохранять историю и получать полные отчеты.';
        }

        res.json(result);

    } catch (error) {
        console.error('Error in calculateBasic:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

// ========== ПЛАТНЫЕ РАСЧЕТЫ ==========

async function calculateFull(req, res) {
    try {
        const { fullName, birthDate } = req.body;
        const userId = req.user.id;

        if (!fullName || !birthDate) {
            return res.status(400).json({
                success: false,
                error: 'Необходимо указать ФИО и дату рождения'
            });
        }

        const nameParts = fullName.trim().split(/\s+/);
        if (nameParts.length < 3) {
            return res.status(400).json({
                success: false,
                error: 'Необходимо указать фамилию, имя и отчество'
            });
        }

        // Проверяем баланс (через BalanceService)
        const BalanceService = require('../../Core/Services/BalanceService');
        const balanceService = new BalanceService();

        const check = await balanceService.hasEnoughBalance(userId, 'forecast_full');

        if (!check.success) {
            return res.status(402).json({
                success: false,
                error: 'Недостаточно средств на балансе',
                required: check.required,
                balance: check.balance,
                price: check.price
            });
        }

        // Списываем средства
        const charge = await balanceService.chargeForService(userId, 'forecast_full', {
            fullName,
            birthDate
        });

        if (!charge.success) {
            return res.status(500).json({
                success: false,
                error: 'Ошибка при списании средств'
            });
        }

        // Выполняем полный расчет
        const result = await calculationService.calculateFull(fullName, birthDate, userId);

        // Сохраняем расчет в историю
        const calculation = await calculationService.saveCalculation(
            userId,
            'full',
            result.data,
            charge.service.price,
            null,
            null
        );

        // Добавляем ID расчета в ответ (для PDF)
        result.calculationId = calculation.id;
        result.newBalance = charge.newBalance;

        res.json(result);

    } catch (error) {
        console.error('Error in calculateFull:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

async function calculateForecast(req, res) {
    try {
        const { targetDate } = req.body;
        const userId = req.user.id;
        const forecastType = req.params.type; // day, week, month, year

        // Валидация
        if (!targetDate && forecastType !== 'day') {
            return res.status(400).json({
                success: false,
                error: 'Необходимо указать целевую дату'
            });
        }

        // Проверяем баланс
        const BalanceService = require('../../Core/Services/BalanceService');
        const balanceService = new BalanceService();

        const check = await balanceService.hasEnoughBalance(userId, `forecast_${forecastType}`);

        if (!check.success) {
            return res.status(402).json({
                success: false,
                error: 'Недостаточно средств на балансе',
                required: check.required,
                balance: check.balance,
                price: check.price
            });
        }

        // Списываем средства
        const charge = await balanceService.chargeForService(userId, `forecast_${forecastType}`, {
            targetDate
        });

        if (!charge.success) {
            return res.status(500).json({
                success: false,
                error: 'Ошибка при списании средств'
            });
        }

        // Получаем профиль пользователя
        const { models } = require('../../../sequelize');
        const profile = await models.NumerologyProfile.findOne({
            where: { userId }
        });

        if (!profile) {
            return res.status(400).json({
                success: false,
                error: 'Сначала выполните базовый расчет'
            });
        }

        // TODO: Реализовать логику прогноза
        // Здесь должен быть вызов сервиса прогнозов

        const result = {
            success: true,
            data: {
                type: forecastType,
                targetDate,
                // ... данные прогноза
            },
            newBalance: charge.newBalance
        };

        // Сохраняем расчет
        await calculationService.saveCalculation(
            userId,
            forecastType,
            result.data,
            charge.service.price,
            targetDate,
            null
        );

        res.json(result);

    } catch (error) {
        console.error('Error in calculateForecast:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

// ========== ИСТОРИЯ ==========

async function getHistory(req, res) {
    try {
        const userId = req.user.id;
        const { limit = 20, offset = 0 } = req.query;

        const history = await calculationService.getUserCalculations(
            userId,
            parseInt(limit),
            parseInt(offset)
        );

        res.json({
            success: true,
            data: history
        });

    } catch (error) {
        console.error('Error in getHistory:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

async function getCalculation(req, res) {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const calculation = await calculationService.getCalculationById(id, userId);

        if (!calculation) {
            return res.status(404).json({
                success: false,
                error: 'Расчет не найден'
            });
        }

        res.json({
            success: true,
            data: calculation
        });

    } catch (error) {
        console.error('Error in getCalculation:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

// ========== PDF ==========

async function downloadPdf(req, res) {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const calculation = await calculationService.getCalculationById(id, userId);

        if (!calculation) {
            return res.status(404).json({
                success: false,
                error: 'Расчет не найден'
            });
        }

        // Генерируем PDF
        const pdfBuffer = await pdfService.generatePdf(calculation);

        // Формируем имя файла
        const filename = `numerology-${calculation.calculationType}-${calculation.createdAt.toISOString().split('T')[0]}.pdf`;

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(pdfBuffer);

    } catch (error) {
        console.error('Error in downloadPdf:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

module.exports = {
    calculateBasic,
    calculateFull,
    calculateForecast,
    getHistory,
    getCalculation,
    downloadPdf
};