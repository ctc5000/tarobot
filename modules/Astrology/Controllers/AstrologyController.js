// modules/astrology/Controllers/astrologyController.js
const NatalChartService = require('../Services/NatalChartService');
const AstrologyPdfService = require('../Services/astrologyPdfService');
const BalanceService = require('../../Core/Services/BalanceService');

const natalChartService = new NatalChartService();
const pdfService = new AstrologyPdfService();
const balanceService = new BalanceService();

// ========== РАСЧЕТ НАТАЛЬНОЙ КАРТЫ ==========

async function calculateNatalChart(req, res) {
    try {
        const { fullName, birthDate, birthTime, latitude, longitude, houseSystem } = req.body;
        const userId = req.user.id;

        // Валидация
        if (!fullName || !birthDate || !birthTime) {
            return res.status(400).json({
                success: false,
                error: 'Необходимо указать ФИО, дату и время рождения'
            });
        }

        // Проверяем баланс
        const check = await balanceService.hasEnoughBalance(userId, 'natal_chart');

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
        const charge = await balanceService.chargeForService(userId, 'natal_chart', {
            fullName,
            birthDate,
            birthTime,
            latitude,
            longitude
        });

        if (!charge.success) {
            return res.status(500).json({
                success: false,
                error: 'Ошибка при списании средств'
            });
        }

        // Выполняем расчет натальной карты
        const result = await natalChartService.calculate({
            fullName,
            birthDate,
            birthTime,
            latitude: latitude || 55.7558,
            longitude: longitude || 37.6173,
            houseSystem: houseSystem || 'placidus',
            userId
        });

        if (!result.success) {
            return res.status(500).json({
                success: false,
                error: result.error || 'Ошибка расчета'
            });
        }

        // Сохраняем расчет в историю
        const calculation = await natalChartService.saveCalculation(
            userId,
            'natal_chart',
            result.data,
            charge.service.price,
            null,
            null
        );

        // Добавляем ID расчета в ответ
        result.calculationId = calculation.id;
        result.newBalance = charge.newBalance;

        res.json(result);

    } catch (error) {
        console.error('Error in calculateNatalChart:', error);
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

        const history = await natalChartService.getUserCalculations(
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

        const calculation = await natalChartService.getCalculationById(id, userId);

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

        const calculation = await natalChartService.getCalculationById(id, userId);

        if (!calculation) {
            return res.status(404).json({
                success: false,
                error: 'Расчет не найден'
            });
        }

        // Генерируем PDF
        const pdfBuffer = await pdfService.generatePdf(calculation);

        // Формируем имя файла
        const filename = `natal-chart-${calculation.createdAt.toISOString().split('T')[0]}.pdf`;

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

// ========== АДМИНИСТРАТИВНЫЕ ==========

async function getAdminStats(req, res) {
    try {
        const { models } = require('../../../sequelize');

        const totalCalculations = await models.Calculation.count({
            where: { calculationType: 'natal_chart' }
        });

        const uniqueUsers = await models.Calculation.count({
            where: { calculationType: 'natal_chart' },
            distinct: true,
            col: 'userId'
        });

        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        const recentCalculations = await models.Calculation.count({
            where: {
                calculationType: 'natal_chart',
                createdAt: { [models.Sequelize.Op.gte]: lastMonth }
            }
        });

        res.json({
            success: true,
            data: {
                totalCalculations,
                uniqueUsers,
                recentCalculations
            }
        });

    } catch (error) {
        console.error('Error in getAdminStats:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

module.exports = {
    calculateNatalChart,
    getHistory,
    getCalculation,
    downloadPdf,
    getAdminStats
};