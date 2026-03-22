// modules/Numerology/Controllers/NumerologyView.js
const NumerologyCalculationService = require('../Services/NumerologyCalculationService');
const NumerologyPdfService = require('../Services/NumerologyPdfService');
const BalanceService = require('../../Core/Services/BalanceService');

const calculationService = new NumerologyCalculationService();
const pdfService = new NumerologyPdfService();
const balanceService = new BalanceService();

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
                return res.status(402).json({
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

// ========== ПОЛНЫЙ РАСЧЕТ ==========

async function calculateFull(req, res) {
    try {
        const { fullName, birthDate } = req.body;
        const userId = req.user.id;

        let userFullName = fullName;
        let userBirthDate = birthDate;

        if (!userFullName || !userBirthDate) {
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
            userFullName = profile.fullName;
            userBirthDate = profile.birthDate;
        }

        if (!userFullName || !userBirthDate) {
            return res.status(400).json({
                success: false,
                error: 'Необходимо указать ФИО и дату рождения'
            });
        }

        const nameParts = userFullName.trim().split(/\s+/);
        if (nameParts.length < 3) {
            return res.status(400).json({
                success: false,
                error: 'Необходимо указать фамилию, имя и отчество'
            });
        }

        // Проверяем наличие активной подписки
        const hasSubscription = await balanceService.hasActiveSubscription(userId);

        // Используем метод chargeForServiceWithSubscription
        const charge = await balanceService.chargeForServiceWithSubscription(userId, 'forecast_full', {
            fullName: userFullName,
            birthDate: userBirthDate
        });

        if (!charge.success) {
            return res.status(402).json({
                success: false,
                error: charge.error || 'Недостаточно средств',
                balance: charge.balance,
                price: charge.price,
                required: charge.required
            });
        }

        // Выполняем расчет
        const result = await calculationService.calculateFull(userFullName, userBirthDate, userId);

        // Сохраняем расчет в историю
        let finalPrice = charge.free ? 0 : charge.price;
        const calculation = await calculationService.saveCalculation(
            userId,
            'full',
            result.data,
            finalPrice,
            null,
            null
        );

        result.calculationId = calculation.id;
        if (charge.newBalance !== undefined) {
            result.newBalance = charge.newBalance;
        }
        result.discount = charge.discount || 0;
        result.hasSubscription = hasSubscription;
        result.finalPrice = finalPrice;
        result.free = charge.free || false;

        if (charge.free) {
            result.message = 'Полный отчет предоставлен бесплатно по подписке';
        }

        res.json(result);

    } catch (error) {
        console.error('Error in calculateFull:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

// ========== ПРОГНОЗЫ ==========

async function calculateForecast(req, res) {
    try {
        const { targetDate, fullName, birthDate } = req.body;
        const userId = req.user.id;
        const forecastType = req.params.type; // day, week, month, year

        let userFullName = fullName;
        let userBirthDate = birthDate;

        if (!userFullName || !userBirthDate) {
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
            userFullName = profile.fullName;
            userBirthDate = profile.birthDate;
        }

        if (!targetDate) {
            return res.status(400).json({
                success: false,
                error: 'Необходимо указать целевую дату'
            });
        }

        const serviceCode = `forecast_${forecastType}`;

        // Используем метод chargeForServiceWithSubscription
        const charge = await balanceService.chargeForServiceWithSubscription(userId, serviceCode, {
            targetDate,
            forecastType
        });

        if (!charge.success) {
            return res.status(402).json({
                success: false,
                error: charge.error || 'Недостаточно средств',
                balance: charge.balance,
                price: charge.price,
                required: charge.required
            });
        }

        // Выполняем расчет прогноза
        const result = await calculationService.calculateForecast(
            userFullName,
            userBirthDate,
            forecastType,
            targetDate,
            userId
        );

        // Сохраняем расчет
        let finalPrice = charge.free ? 0 : charge.price;
        await calculationService.saveCalculation(
            userId,
            forecastType,
            result.data,
            finalPrice,
            targetDate,
            null
        );

        if (charge.newBalance !== undefined) {
            result.newBalance = charge.newBalance;
        }
        if (charge.discount) {
            result.discount = charge.discount;
            result.originalPrice = charge.originalPrice;
        }
        result.finalPrice = finalPrice;
        result.hasSubscription = charge.hasSubscription;

        if (charge.free) {
            result.free = true;
            result.message = 'Прогноз предоставлен бесплатно по подписке';
        }

        res.json(result);

    } catch (error) {
        console.error('Error in calculateForecast:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

// ========== СОВМЕСТИМОСТЬ ==========

async function calculateCompatibility(req, res) {
    try {
        const { partnerName, partnerBirthDate, fullName, birthDate } = req.body;
        const userId = req.user.id;

        let userFullName = fullName;
        let userBirthDate = birthDate;

        if (!userFullName || !userBirthDate) {
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
            userFullName = profile.fullName;
            userBirthDate = profile.birthDate;
        }

        if (!partnerName || !partnerBirthDate) {
            return res.status(400).json({
                success: false,
                error: 'Необходимо указать имя и дату рождения партнера'
            });
        }

        // Используем метод chargeForServiceWithSubscription
        const charge = await balanceService.chargeForServiceWithSubscription(userId, 'compatibility', {
            partnerName,
            partnerBirthDate
        });

        if (!charge.success) {
            return res.status(402).json({
                success: false,
                error: charge.error || 'Недостаточно средств',
                balance: charge.balance,
                price: charge.price,
                required: charge.required
            });
        }

        // Выполняем расчет совместимости
        const result = await calculationService.calculateCompatibility(
            userFullName,
            userBirthDate,
            partnerName,
            partnerBirthDate,
            userId
        );

        // Сохраняем расчет
        let finalPrice = charge.free ? 0 : charge.price;
        await calculationService.saveCalculation(
            userId,
            'compatibility',
            result.data,
            finalPrice,
            null,
            null
        );

        if (charge.newBalance !== undefined) {
            result.newBalance = charge.newBalance;
        }
        if (charge.discount) {
            result.discount = charge.discount;
            result.originalPrice = charge.originalPrice;
        }
        result.finalPrice = finalPrice;
        result.hasSubscription = charge.hasSubscription;

        if (charge.free) {
            result.free = true;
            result.message = 'Совместимость предоставлена бесплатно по подписке';
        }

        res.json(result);

    } catch (error) {
        console.error('Error in calculateCompatibility:', error);
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

        const pdfData = {
            fullName: calculation.result?.fullName || 'Не указано',
            birthDate: calculation.result?.birthDate || 'Не указана',
            numerology: calculation.result?.numerology || {},
            zodiac: calculation.result?.zodiac || {},
            fengShui: calculation.result?.fengShui || {},
            tarot: calculation.result?.tarot || {},
            psychology: calculation.result?.psychology || {},
            patterns: calculation.result?.patterns || []
        };

        const pdfBuffer = await pdfService.generateNumerologyPDF(pdfData);
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

async function generatePdf(req, res) {
    try {
        const userId = req.user.id;
        const { fullName, birthDate, data } = req.body;

        if (!fullName || !birthDate || !data) {
            return res.status(400).json({
                success: false,
                error: 'Недостаточно данных для генерации PDF'
            });
        }

        const calculation = {
            id: 'temp-' + Date.now(),
            userId,
            calculationType: 'full',
            result: data,
            price: 0,
            targetDate: null,
            createdAt: new Date(),
            fullName,
            birthDate
        };

        const pdfBuffer = await pdfService.generatePdf(calculation);
        const filename = `numerology-report-${new Date().toISOString().split('T')[0]}.pdf`;

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(pdfBuffer);

    } catch (error) {
        console.error('Error in generatePdf:', error);
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
    calculateCompatibility,
    getHistory,
    getCalculation,
    downloadPdf,
    generatePdf
};