// modules/Tarot/TarotController.js
const TarotService = require('./services/tarotService');
const { models } = require('../../sequelize');
const { Op } = require('sequelize');

class TarotController {
    constructor() {
        this.tarotService = new TarotService();
    }

    /**
     * Получить все карты Таро
     */
    async getAllCards(req, res) {
        try {
            const cards = Object.values(this.tarotService.majorArcana).map(card => ({
                number: card.number,
                name: card.name,
                keywords: card.keywords,
                image: card.image
            }));

            res.json({
                success: true,
                data: cards
            });
        } catch (error) {
            console.error('Error in getAllCards:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * Получить карту по номеру
     */
    async getCardByNumber(req, res) {
        try {
            const { number } = req.params;
            const num = parseInt(number);

            const card = this.tarotService.getArcanaData(num);

            if (!card) {
                return res.status(404).json({
                    success: false,
                    error: 'Карта не найдена'
                });
            }

            res.json({
                success: true,
                data: card
            });
        } catch (error) {
            console.error('Error in getCardByNumber:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * Сделать расклад
     */
    async makeReading(req, res) {
        try {
            const { question, spread = 'three' } = req.body;

            if (!question) {
                return res.status(400).json({
                    success: false,
                    error: 'Вопрос обязателен'
                });
            }

            const result = this.tarotService.performReading(question, spread);
            res.json(result);
        } catch (error) {
            console.error('Error in makeReading:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * Сохранить расклад в историю (для авторизованных пользователей)
     */
    async saveReading(req, res) {
        try {
            const userId = req.user.id;
            const { question, spread, cards, interpretation } = req.body;

            if (!question || !spread || !cards) {
                return res.status(400).json({
                    success: false,
                    error: 'Недостаточно данных для сохранения'
                });
            }

            const reading = await models.TarotReading.create({
                userId,
                question,
                spreadType: spread.type,
                spreadName: spread.name,
                cards: JSON.stringify(cards),
                interpretation,
                createdAt: new Date()
            });

            res.json({
                success: true,
                data: reading
            });
        } catch (error) {
            console.error('Error in saveReading:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * Получить историю раскладов пользователя
     */
    async getUserReadings(req, res) {
        try {
            const userId = req.user.id;
            const { limit = 20, page = 1 } = req.query;
            const offset = (page - 1) * limit;

            const readings = await models.TarotReading.findAndCountAll({
                where: { userId },
                limit: parseInt(limit),
                offset,
                order: [['createdAt', 'DESC']]
            });

            res.json({
                success: true,
                data: {
                    readings: readings.rows,
                    total: readings.count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(readings.count / limit)
                }
            });
        } catch (error) {
            console.error('Error in getUserReadings:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * Получить расклад по ID
     */
    async getReadingById(req, res) {
        try {
            const userId = req.user.id;
            const { id } = req.params;

            const reading = await models.TarotReading.findOne({
                where: { id, userId }
            });

            if (!reading) {
                return res.status(404).json({
                    success: false,
                    error: 'Расклад не найден'
                });
            }

            // Парсим карты обратно
            reading.cards = JSON.parse(reading.cards);

            res.json({
                success: true,
                data: reading
            });
        } catch (error) {
            console.error('Error in getReadingById:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // ========== АДМИНИСТРАТИВНЫЕ МЕТОДЫ ==========

    /**
     * Создать новую карту (админ)
     */
    async createCard(req, res) {
        try {
            const cardData = req.body;

            // Проверяем, не существует ли уже карта с таким номером
            const existing = await models.TarotCard.findOne({
                where: { number: cardData.number }
            });

            if (existing) {
                return res.status(400).json({
                    success: false,
                    error: 'Карта с таким номером уже существует'
                });
            }

            const card = await models.TarotCard.create(cardData);

            res.status(201).json({
                success: true,
                data: card
            });
        } catch (error) {
            console.error('Error in createCard:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * Обновить карту (админ)
     */
    async updateCard(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;

            const card = await models.TarotCard.findByPk(id);

            if (!card) {
                return res.status(404).json({
                    success: false,
                    error: 'Карта не найдена'
                });
            }

            await card.update(updates);

            res.json({
                success: true,
                data: card
            });
        } catch (error) {
            console.error('Error in updateCard:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * Удалить карту (админ)
     */
    async deleteCard(req, res) {
        try {
            const { id } = req.params;

            const card = await models.TarotCard.findByPk(id);

            if (!card) {
                return res.status(404).json({
                    success: false,
                    error: 'Карта не найдена'
                });
            }

            await card.destroy();

            res.json({
                success: true,
                message: 'Карта удалена'
            });
        } catch (error) {
            console.error('Error in deleteCard:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * Статистика раскладов (админ)
     */
    async getAdminStats(req, res) {
        try {
            const totalReadings = await models.TarotReading.count();
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const todayReadings = await models.TarotReading.count({
                where: {
                    createdAt: { [Op.gte]: today }
                }
            });

            const spreadStats = await models.TarotReading.findAll({
                attributes: [
                    'spreadType',
                    [models.sequelize.fn('COUNT', models.sequelize.col('id')), 'count']
                ],
                group: ['spreadType']
            });

            res.json({
                success: true,
                data: {
                    totalReadings,
                    todayReadings,
                    spreadStats: spreadStats.map(s => ({
                        spread: s.spreadType,
                        count: s.dataValues.count
                    }))
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
}

module.exports = TarotController;