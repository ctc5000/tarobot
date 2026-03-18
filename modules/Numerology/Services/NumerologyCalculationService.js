// modules/Numerology/Services/NumerologyCalculationService.js

// Импортируем существующие сервисы
const NumerologyService = require('../../../services/numerology');
const ZodiacService = require('../../../services/zodiacService');
const FengShuiService = require('../../../services/fengShuiService');
const TarotService = require('../../../services/tarotService');
const PsychologyService = require('../../../services/psychologyService');

// Инициализация сервисов
const numerologyService = new NumerologyService();
const zodiacService = new ZodiacService();
const fengShuiService = new FengShuiService();
const tarotService = new TarotService();
const psychologyService = new PsychologyService();

class NumerologyCalculationService {
    constructor() {
        this.logger = global.log; // Глобальный логгер
    }

    /**
     * Базовый расчет (бесплатный)
     */
    async calculateBasic(fullName, birthDate, userId = null) {
        try {
            this.logger.info('numerology', 'Базовый расчет', { fullName, birthDate, userId });

            const nameParts = fullName.trim().split(/\s+/);
            const [surname, firstName, patronymic] = nameParts;

            // Базовый нумерологический расчет
            const numerology = numerologyService.calculate(surname, firstName, patronymic, birthDate);

            // Только базовая информация для бесплатного расчета
            return {
                success: true,
                data: {
                    fullName,
                    birthDate,
                    numerology: {
                        base: numerology.base,
                        achilles: numerology.achilles,
                        control: numerology.control,
                        calls: numerology.calls
                    }
                },
                isFree: true,
                message: 'Бесплатный базовый расчет'
            };

        } catch (error) {
            this.logger.error('numerology', 'Ошибка базового расчета', { error: error.message });
            throw error;
        }
    }

    /**
     * Полный расчет (платный)
     */
    async calculateFull(fullName, birthDate, userId = null) {
        try {
            this.logger.info('numerology', 'Полный расчет', { fullName, birthDate, userId });

            const nameParts = fullName.trim().split(/\s+/);
            const [surname, firstName, patronymic] = nameParts;

            // 1. Базовый нумерологический расчет
            const numerology = numerologyService.calculate(surname, firstName, patronymic, birthDate);

            // 2. Расчет знака зодиака
            const zodiac = zodiacService.calculate(birthDate);

            // 3. Расчет фен-шуй
            const fengShui = fengShuiService.calculate(birthDate);

            // 4. Расчет карт Таро
            const tarot = tarotService.calculateFromNumbers({
                fate: numerology.base.fate,
                name: numerology.base.name,
                surname: numerology.base.surname,
                patronymic: numerology.base.patronymic
            });

            // 5. Психологический портрет
            const psychology = psychologyService.generatePortrait(numerology, zodiac, fengShui, tarot);

            // 6. Паттерны личности
            const patterns = numerologyService.generatePatterns(
                numerology,
                zodiac,
                fengShui,
                tarot,
                psychology
            );

            // 7. Дополнительные интерпретации
            const interpretations = numerologyService.getInterpretations(numerology.base);

            return {
                success: true,
                data: {
                    fullName,
                    birthDate,
                    numerology: {
                        base: numerology.base,
                        achilles: numerology.achilles,
                        control: numerology.control,
                        calls: numerology.calls,
                        interpretations
                    },
                    zodiac,
                    fengShui,
                    tarot,
                    psychology,
                    patterns
                },
                isFull: true
            };

        } catch (error) {
            this.logger.error('numerology', 'Ошибка полного расчета', { error: error.message });
            throw error;
        }
    }

    /**
     * Проверка возможности бесплатного расчета
     */
    async checkFreeCalculation(userId, fullName, birthDate) {
        const { models } = require('../../../sequelize');

        try {
            // Ищем профиль
            let profile = await models.NumerologyProfile.findOne({
                where: { userId }
            });

            // Если профиля нет, создаем
            if (!profile) {
                profile = await models.NumerologyProfile.create({
                    userId,
                    fullName,
                    birthDate,
                    freeCalculations: 0,
                    hasFreeCalculation: false
                });
            }

            // Проверяем, был ли уже бесплатный расчет
            if (profile.hasFreeCalculation) {
                return {
                    allowed: false,
                    message: 'Бесплатный расчет уже использован',
                    profile
                };
            }

            return {
                allowed: true,
                message: 'Бесплатный расчет доступен',
                profile
            };

        } catch (error) {
            this.logger.error('numerology', 'Ошибка проверки бесплатного расчета', { error: error.message });
            throw error;
        }
    }

    /**
     * Обновление профиля после расчета
     */
    async updateProfileAfterCalculation(userId, fullName, birthDate, isFree = true) {
        const { models } = require('../../../sequelize');

        try {
            const profile = await models.NumerologyProfile.findOne({
                where: { userId }
            });

            if (profile) {
                const updates = {
                    lastCalculation: new Date(),
                    freeCalculations: profile.freeCalculations + (isFree ? 1 : 0)
                };

                if (isFree) {
                    updates.hasFreeCalculation = true;
                }

                await profile.update(updates);
            }

        } catch (error) {
            this.logger.error('numerology', 'Ошибка обновления профиля', { error: error.message });
        }
    }

    /**
     * Получение истории расчетов пользователя
     */
    async getUserCalculations(userId, limit = 10, offset = 0) {
        const { models } = require('../../../sequelize');

        try {
            const calculations = await models.Calculation.findAndCountAll({
                where: {
                    userId,
                    calculationType: {
                        [models.Sequelize.Op.in]: ['full', 'day', 'week', 'month', 'year', 'compatibility']
                    }
                },
                limit,
                offset,
                order: [['createdAt', 'DESC']],
                include: [
                    {
                        model: models.Service,
                        as: 'service',
                        attributes: ['id', 'name', 'code', 'price']
                    }
                ]
            });

            return {
                total: calculations.count,
                calculations: calculations.rows,
                limit,
                offset
            };

        } catch (error) {
            this.logger.error('numerology', 'Ошибка получения истории', { error: error.message });
            throw error;
        }
    }

    /**
     * Сохранение результата расчета
     */
    // modules/Numerology/Services/NumerologyCalculationService.js

    async saveCalculation(userId, calculationType, resultData, price = 0, targetDate = null, serviceId = null) {
        try {
            const { models } = require('../../../sequelize');

            // Для бесплатных расчетов (basic) нужно получить serviceId для бесплатной услуги
            if (calculationType === 'basic' && !serviceId) {
                const service = await models.Service.findOne({
                    where: { code: 'forecast_basic' }
                });
                if (service) {
                    serviceId = service.id;
                }
            }

            // Проверяем, что serviceId не null (кроме случаев, когда это действительно не нужно)
            if (!serviceId) {
                console.warn(`Warning: serviceId is null for calculation type ${calculationType}`);
                // Можно либо вернуть ошибку, либо попытаться найти service по умолчанию
                const defaultService = await models.Service.findOne({
                    where: { code: 'forecast_basic' }
                });
                serviceId = defaultService?.id;

                if (!serviceId) {
                    throw new Error('Service not found and cannot be determined');
                }
            }

            const calculation = await models.Calculation.create({
                userId,
                serviceId,
                calculationType,
                result: resultData || {},
                price,
                targetDate: targetDate || null,
                createdAt: new Date()
            });

            return calculation;
        } catch (error) {
            console.error('Error saving calculation:', error);
            throw error;
        }
    }
    /**
     * Получение расчета по ID
     */
    async getCalculationById(id, userId) {
        const { models } = require('../../../sequelize');

        try {
            const calculation = await models.Calculation.findOne({
                where: { id, userId },
                include: [
                    {
                        model: models.Service,
                        as: 'service',
                        attributes: ['id', 'name', 'code', 'price']
                    }
                ]
            });

            return calculation;

        } catch (error) {
            this.logger.error('numerology', 'Ошибка получения расчета', { error: error.message });
            throw error;
        }
    }
}

module.exports = NumerologyCalculationService;