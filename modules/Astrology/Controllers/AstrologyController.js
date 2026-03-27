// modules/Astrology/Controllers/AstrologyController.js
const NatalChartService = require('../Services/NatalChartService');
const AstrologyPdfService = require('../Services/AstrologyPdfService');
const AstrologyRenderService = require('../Services/AstrologyRenderService');
const BalanceService = require('../../Core/Services/BalanceService');

const natalChartService = new NatalChartService();
const pdfService = new AstrologyPdfService();
const renderService = new AstrologyRenderService();
const balanceService = new BalanceService();

// Цены для тарифов
const tariffPrices = {
    'natal_basic': 0,
    'natal_standard': 400,
    'natal_full': 700,
    'natal_premium': 1200
};

// Описания тарифов
const tariffDescriptions = {
    'natal_basic': 'Основные положения планет, асцендент, базовая интерпретация',
    'natal_standard': 'Полный разбор натальной карты с домами и аспектами',
    'natal_full': 'Глубокий анализ личности, аспекты, дома, расширенный отчет',
    'natal_premium': 'Максимально полный разбор + кармический анализ + PDF отчет'
};

function getTariffName(code) {
    const names = {
        'natal_basic': 'Базовый портрет',
        'natal_standard': 'Стандартный портрет',
        'natal_full': 'Глубокий анализ',
        'natal_premium': 'Премиум-портрет'
    };
    return names[code] || code;
}

// ========== ПУБЛИЧНЫЕ API ==========

async function getTariffs(req, res) {
    try {
        const tariffs = Object.entries(tariffPrices).map(([code, price]) => ({
            code,
            name: getTariffName(code),
            price,
            description: tariffDescriptions[code],
            section: 'astrology'
        }));
        res.json({ success: true, data: tariffs });
    } catch (error) {
        console.error('Error in getTariffs:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}

// ========== ЗАЩИЩЕННЫЕ API ==========

async function calculateNatalChart(req, res) {
    try {
        const { fullName, birthDate, birthTime, latitude, longitude, houseSystem, tariffCode } = req.body;
        const userId = req.user.id;

        console.log('[AstrologyController] Расчет:', { fullName, birthDate, birthTime, tariffCode, userId });

        // Валидация
        if (!fullName || !birthDate || !birthTime) {
            return res.status(400).json({
                success: false,
                error: 'Необходимо указать ФИО, дату и время рождения'
            });
        }

        const price = tariffPrices[tariffCode] || 500;

        // Для базового тарифа списание не требуется
        let chargeResult = null;
        if (price > 0) {
            const check = await balanceService.hasEnoughBalance(userId, tariffCode);
            if (!check.success) {
                return res.status(402).json({
                    success: false,
                    error: 'Недостаточно средств на балансе',
                    required: check.required,
                    balance: check.balance,
                    price: check.price
                });
            }
            chargeResult = await balanceService.chargeForService(userId, tariffCode, {
                fullName, birthDate, birthTime, latitude, longitude
            });
            if (!chargeResult.success) {
                return res.status(500).json({ success: false, error: 'Ошибка при списании средств' });
            }
        }

        // Выполняем расчет
        const result = await natalChartService.calculate({
            fullName,
            birthDate,
            birthTime,
            latitude: latitude || 55.7558,
            longitude: longitude || 37.6173,
            houseSystem: houseSystem || 'placidus',
            userId,
            tariffCode  // ← обязательно передаем tariffCode
        });

        if (!result.success) {
            return res.status(500).json({ success: false, error: result.error || 'Ошибка расчета' });
        }

        // Сохраняем расчет
        const { models } = require('../../../sequelize');
        const service = await models.Service.findOne({
            where: { code: tariffCode }
        });

        const calculation = await natalChartService.saveCalculation(
            userId,
            tariffCode,
            result.data,
            price,
            null,
            service?.id || null
        );

        // Генерируем HTML блоки в зависимости от тарифа
        const htmlBlocks = {
            enrichedPlanetsInfo: renderService.renderEnrichedPlanetsInfo(result.data.planets, tariffCode),
            enrichedHousesInfo: renderService.renderEnrichedHousesInfo(result.data.houses, tariffCode),
            enrichedAspectsInfo: renderService.renderEnrichedAspectsInfo(result.data.aspects, tariffCode),
            legend: renderService.renderLegend(result.data.planets),
            planetPositions: renderService.renderPlanetPositions(result.data.planets),
            aspectsList: renderService.renderAspectsList(result.data.aspects),
            interpretation: renderService.renderInterpretation(result.data, tariffCode),
            expandedReport: renderService.renderExpandedReport(result.data, tariffCode)
        };

        result.data.htmlBlocks = htmlBlocks;
        result.calculationId = calculation.id;
        if (chargeResult?.newBalance) result.newBalance = chargeResult.newBalance;

        res.json(result);

    } catch (error) {
        console.error('Error in calculateNatalChart:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}

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

        // Проверяем, что расчет платный (только для платных тарифов)
        const paidTariffs = ['natal_standard', 'natal_full', 'natal_premium'];
        if (paidTariffs.includes(calculation.calculationType) && calculation.price === 0) {
            return res.status(403).json({
                success: false,
                error: 'PDF доступен только для платных расчетов'
            });
        }

        const pdfBuffer = await pdfService.generatePdf(calculation);

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

async function getAdminStats(req, res) {
    try {
        const { models } = require('../../../sequelize');

        const totalCalculations = await models.Calculation.count({
            where: {
                calculationType: ['natal_basic', 'natal_standard', 'natal_full', 'natal_premium']
            }
        });

        const uniqueUsers = await models.Calculation.count({
            where: {
                calculationType: ['natal_basic', 'natal_standard', 'natal_full', 'natal_premium']
            },
            distinct: true,
            col: 'userId'
        });

        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        const recentCalculations = await models.Calculation.count({
            where: {
                calculationType: ['natal_basic', 'natal_standard', 'natal_full', 'natal_premium'],
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
    getTariffs,
    calculateNatalChart,
    getHistory,
    getCalculation,
    downloadPdf,
    getAdminStats
};