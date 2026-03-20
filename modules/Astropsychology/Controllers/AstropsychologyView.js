// modules/Astropsychology/Controllers/AstropsychologyView.js
const AstropsychologyService = require('../Services/AstropsychologyService');
const BalanceService = require('../../Core/Services/BalanceService');
const { models } = require('../../../sequelize');

const astropsychologyService = new AstropsychologyService();
const balanceService = new BalanceService();

const types = {
    'astro_basic': { price: 0, name: 'Базовый анализ', free: true, description: 'Базовый психологический портрет по Солнцу, Луне и Асценденту' },
    'astro_quick': { price: 100, name: 'Экспресс-анализ', free: false, description: 'Быстрый анализ ключевых планет + прогноз на неделю' },
    'astro_standard': { price: 300, name: 'Стандартный портрет', free: false, description: 'Полный психологический портрет личности' },
    'astro_full': { price: 500, name: 'Полный анализ', free: false, description: 'Глубокий анализ личности, аспекты, совместимость, натальная карта' },
    'astro_premium': { price: 1000, name: 'Премиум-портрет', free: false, description: 'Максимально полный разбор личности + транзитный прогноз + натальная карта' }
};

const getTypeDescription = (type) => types[type]?.description || 'Астропсихологический расчет';
const formatDateForDB = (dateStr) => {
    const [day, month, year] = dateStr.split('.');
    return `${year}-${month}-${day}`;
};

// ========== ПУБЛИЧНЫЕ API ==========

async function getCalculationTypes(req, res) {
    console.log('[AstropsychologyView] getCalculationTypes вызван');
    try {
        const result = Object.entries(types).map(([key, value]) => ({
            code: key,
            name: value.name,
            price: value.price,
            free: value.free,
            description: value.description
        }));
        res.json({ success: true, data: result });
    } catch (error) {
        console.error('[AstropsychologyView] Ошибка:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}

// ========== ЗАЩИЩЕННЫЕ API ==========

async function calculate(req, res) {
    try {
        const userId = req.user.id;
        const { type } = req.params;
        const { fullName, birthDate, birthTime, latitude, longitude, question } = req.body;

        if (!fullName || !birthDate || !birthTime) {
            return res.status(400).json({ success: false, error: 'Необходимо указать ФИО, дату и время рождения' });
        }

        const typeInfo = types[type];
        if (!typeInfo) {
            return res.status(400).json({ success: false, error: 'Неверный тип расчета' });
        }

        let chargeResult = null;
        if (typeInfo.price > 0) {
            const check = await balanceService.hasEnoughBalance(userId, type);
            if (!check.success) {
                return res.status(402).json({
                    success: false,
                    error: 'Недостаточно средств на балансе',
                    required: check.required,
                    balance: check.balance,
                    price: check.price
                });
            }
            chargeResult = await balanceService.chargeForService(userId, type, { fullName, birthDate, birthTime, latitude, longitude });
            if (!chargeResult.success) {
                return res.status(500).json({ success: false, error: 'Ошибка при списании средств' });
            }
        }

        const result = await astropsychologyService.calculate({
            fullName, birthDate, birthTime,
            latitude: latitude || 55.7558,
            longitude: longitude || 37.6173,
            question, type
        });

        if (!result.success) {
            return res.status(500).json({ success: false, error: result.error || 'Ошибка расчета' });
        }

        const service = await models.Service.findOne({ where: { code: type } });
        const calculation = await models.Calculation.create({
            userId,
            serviceId: service?.id || null,
            calculationType: type,
            result: result.data,
            price: typeInfo.price,
            status: 'completed',
            createdAt: new Date()
        });

        let profile = await models.AstropsychologyProfile.findOne({ where: { userId } });
        if (!profile) {
            await models.AstropsychologyProfile.create({
                userId, fullName, birthDate: formatDateForDB(birthDate), birthTime,
                latitude: latitude || 55.7558, longitude: longitude || 37.6173,
                calculationCount: 1, lastCalculation: new Date()
            });
        } else {
            await profile.update({
                fullName, birthDate: formatDateForDB(birthDate), birthTime,
                latitude: latitude || 55.7558, longitude: longitude || 37.6173,
                calculationCount: profile.calculationCount + 1, lastCalculation: new Date()
            });
        }

        result.calculationId = calculation.id;
        if (chargeResult?.newBalance) result.newBalance = chargeResult.newBalance;

        res.json(result);
    } catch (error) {
        console.error('Error in calculate:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}

async function getHistory(req, res) {
    try {
        const userId = req.user.id;
        const { limit = 20, offset = 0 } = req.query;
        const calculations = await models.Calculation.findAndCountAll({
            where: { userId, calculationType: ['astro_basic', 'astro_quick', 'astro_standard', 'astro_full', 'astro_premium'] },
            limit: parseInt(limit), offset: parseInt(offset),
            order: [['createdAt', 'DESC']],
            include: [{ model: models.Service, as: 'service', attributes: ['id', 'name', 'code', 'price'] }]
        });
        res.json({ success: true, data: { calculations: calculations.rows, total: calculations.count, limit: parseInt(limit), offset: parseInt(offset) } });
    } catch (error) {
        console.error('Error in getHistory:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}

async function getCalculation(req, res) {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const calculation = await models.Calculation.findOne({ where: { id, userId } });
        if (!calculation) return res.status(404).json({ success: false, error: 'Расчет не найден' });
        res.json({ success: true, data: calculation });
    } catch (error) {
        console.error('Error in getCalculation:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}

async function downloadPdf(req, res) {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const calculation = await models.Calculation.findOne({ where: { id, userId } });
        if (!calculation) return res.status(404).json({ success: false, error: 'Расчет не найден' });
        const pdfBuffer = await astropsychologyService.generatePdf(calculation);
        const filename = `astropsychology-${calculation.createdAt.toISOString().split('T')[0]}.pdf`;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error in downloadPdf:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}

async function getAdminStats(req, res) {
    try {
        const totalBasic = await models.Calculation.count({ where: { calculationType: 'astro_basic' } });
        const totalQuick = await models.Calculation.count({ where: { calculationType: 'astro_quick' } });
        const totalStandard = await models.Calculation.count({ where: { calculationType: 'astro_standard' } });
        const totalFull = await models.Calculation.count({ where: { calculationType: 'astro_full' } });
        const totalPremium = await models.Calculation.count({ where: { calculationType: 'astro_premium' } });
        const uniqueUsers = await models.Calculation.count({ where: { calculationType: ['astro_basic', 'astro_quick', 'astro_standard', 'astro_full', 'astro_premium'] }, distinct: true, col: 'userId' });
        const lastMonth = new Date(); lastMonth.setMonth(lastMonth.getMonth() - 1);
        const recentCalculations = await models.Calculation.count({ where: { calculationType: ['astro_basic', 'astro_quick', 'astro_standard', 'astro_full', 'astro_premium'], createdAt: { [models.Sequelize.Op.gte]: lastMonth } } });
        res.json({ success: true, data: { totalBasic, totalQuick, totalStandard, totalFull, totalPremium, totalCalculations: totalBasic + totalQuick + totalStandard + totalFull + totalPremium, uniqueUsers, recentCalculations } });
    } catch (error) {
        console.error('Error in getAdminStats:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}

module.exports = { getCalculationTypes, calculate, getHistory, getCalculation, downloadPdf, getAdminStats };