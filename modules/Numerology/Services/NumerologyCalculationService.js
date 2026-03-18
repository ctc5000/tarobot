// modules/Numerology/Services/NumerologyCalculationService.js

// Импортируем существующие сервисы
const NumerologyService = require('../../../services/numerology');
const ZodiacService = require('../../../services/zodiacService');
const FengShuiService = require('../../../services/fengShuiService');
const TarotService = require('../../../services/tarotService');
const ForecastService = require('./ForecastService');


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
        this.forecastService = new ForecastService();
    }

    /**
     * Преобразование даты из YYYY-MM-DD в DD.MM.YYYY
     */
    formatDateForCalculation(dateStr) {
        if (!dateStr) return null;
        // Если дата уже в формате DD.MM.YYYY
        if (dateStr.includes('.')) return dateStr;

        // Преобразуем YYYY-MM-DD в DD.MM.YYYY
        const [year, month, day] = dateStr.split('-');
        return `${day}.${month}.${year}`;
    }

    /**
     * Базовый расчет (бесплатный)
     */
    async calculateBasic(fullName, birthDate, userId = null) {
        try {
            this.logger?.info('numerology', 'Базовый расчет', { fullName, birthDate, userId });

            const nameParts = fullName.trim().split(/\s+/);
            const [surname, firstName, patronymic] = nameParts;

            // Преобразуем дату в нужный формат
            const formattedDate = this.formatDateForCalculation(birthDate);

            // Базовый нумерологический расчет
            const numerology = numerologyService.calculate(surname, firstName, patronymic, formattedDate);

            // Базовая интерпретация
            const interpretation = this.generateBasicInterpretation(numerology);

            // Глубинный портрет (упрощенный)
            const deepPortrait = this.generateBasicPortrait(numerology);

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
                    },
                    interpretation,
                    deepPortrait
                },
                isFree: true,
                message: 'Бесплатный базовый расчет'
            };

        } catch (error) {
            this.logger?.error('numerology', 'Ошибка базового расчета', { error: error.message });
            throw error;
        }
    }

    /**
     * Полный расчет (платный) - КАК В СТАРОЙ ФУНКЦИИ
     */
    async calculateFull(fullName, birthDate, userId = null) {
        try {
            this.logger?.info('numerology', 'Полный расчет', { fullName, birthDate, userId });

            const nameParts = fullName.trim().split(/\s+/);
            const [surname, firstName, patronymic] = nameParts;

            // Преобразуем дату в нужный формат
            const formattedDate = this.formatDateForCalculation(birthDate);

            // 1. Базовый нумерологический расчет
            const numerology = numerologyService.calculate(surname, firstName, patronymic, formattedDate);

            // 2. Расчет знака зодиака
            const zodiac = zodiacService.calculate(formattedDate);

            // 3. Расчет фен-шуй
            const fengShui = fengShuiService.calculate(formattedDate);

            // 4. Расчет карт Таро (ГАРАНТИРОВАННО УНИКАЛЬНЫЕ)
            const tarot = tarotService.calculateFromNumbers({
                fate: numerology.base.fate,
                name: numerology.base.name,
                surname: numerology.base.surname,
                patronymic: numerology.base.patronymic
            });

            // 5. Психологический портрет (ПОЛНЫЙ)
            const psychology = psychologyService.generatePortrait(numerology, zodiac, fengShui, tarot);

            // 6. Паттерны личности (ПОЛНЫЕ)
            const patterns = numerologyService.generatePatterns(
                numerology,
                zodiac,
                fengShui,
                tarot,
                psychology
            );

            // 7. Дополнительные интерпретации (ПОЛНЫЕ)
            const interpretations = numerologyService.getInterpretations(numerology.base);

            // 8. Свиток судьбы (полная интерпретация)
            const interpretation = this.generateFullInterpretation(numerology, zodiac, fengShui, tarot, psychology, interpretations);

            // 9. Глубинный портрет (из psychology)
            const deepPortrait = psychology.portrait || this.generateDeepPortrait(numerology, zodiac, fengShui, tarot, psychology);

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
                    patterns,
                    interpretation,
                    deepPortrait
                },
                isFull: true
            };

        } catch (error) {
            this.logger?.error('numerology', 'Ошибка полного расчета', { error: error.message });
            throw error;
        }
    }

    /**
     * Расчет прогноза
     */
    async calculateForecast(fullName, birthDate, forecastType, targetDate, userId = null) {
        try {
            this.logger?.info('numerology', 'Расчет прогноза', {
                details:{
                    fullName,
                    birthDate,
                    forecastType,
                    targetDate,
                    userId
                }

            });

            // Используем ForecastService для расчета
            const result = await this.forecastService.calculateForecast(
                fullName,
                birthDate,
                forecastType,
                targetDate,
                userId
            );

            return result;

        } catch (error) {
            this.logger?.error('numerology', 'Ошибка расчета прогноза', { error: error.message });
            throw error;
        }
    }

    /**
     * Расчет совместимости
     */
    async calculateCompatibility(fullName, birthDate, partnerName, partnerBirthDate, userId = null) {
        try {
            this.logger?.info('numerology', 'Расчет совместимости', { fullName, birthDate, partnerName, partnerBirthDate, userId });

            const nameParts = fullName.trim().split(/\s+/);
            const [surname, firstName, patronymic] = nameParts;

            const partnerNameParts = partnerName.trim().split(/\s+/);
            const [partnerSurname, partnerFirstName, partnerPatronymic] = partnerNameParts;

            // Преобразуем даты в нужный формат
            const formattedBirthDate = this.formatDateForCalculation(birthDate);
            const formattedPartnerBirthDate = this.formatDateForCalculation(partnerBirthDate);

            // Нумерология первого партнера
            const numerology1 = numerologyService.calculate(surname, firstName, patronymic, formattedBirthDate);

            // Нумерология второго партнера
            const numerology2 = numerologyService.calculate(partnerSurname, partnerFirstName, partnerPatronymic, formattedPartnerBirthDate);

            // Расчет совместимости
            const compatibility = this.calculateCompatibilityScore(numerology1, numerology2);

            // Интерпретация совместимости
            const interpretation = this.generateCompatibilityInterpretation(numerology1, numerology2, compatibility);

            return {
                success: true,
                data: {
                    person1: {
                        fullName,
                        birthDate,
                        numerology: numerology1.base
                    },
                    person2: {
                        fullName: partnerName,
                        birthDate: partnerBirthDate,
                        numerology: numerology2.base
                    },
                    compatibility: {
                        score: compatibility.score,
                        level: compatibility.level,
                        strengths: compatibility.strengths,
                        challenges: compatibility.challenges,
                        advice: compatibility.advice
                    },
                    interpretation
                }
            };

        } catch (error) {
            this.logger?.error('numerology', 'Ошибка расчета совместимости', { error: error.message });
            throw error;
        }
    }

    // ========== ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ ==========

    calculateDayNumber(targetDate, fateNumber) {
        if (!targetDate) return null;
        const [day, month, year] = targetDate.split('.');
        const sum = parseInt(day) + parseInt(month) + parseInt(year) + fateNumber;
        return this.reduceNumber(sum);
    }

    calculateMonthNumber(targetDate, fateNumber) {
        if (!targetDate) return null;
        const [day, month, year] = targetDate.split('.');
        const sum = parseInt(month) + fateNumber;
        return this.reduceNumber(sum);
    }

    calculateYearNumber(targetDate, fateNumber) {
        if (!targetDate) return null;
        const [day, month, year] = targetDate.split('.');
        const sum = parseInt(year) + fateNumber;
        return this.reduceNumber(sum);
    }

    reduceNumber(num) {
        while (num > 9 && num !== 11 && num !== 22) {
            num = String(num).split('').reduce((s, d) => s + parseInt(d), 0);
        }
        return num;
    }

    calculateCompatibilityScore(numerology1, numerology2) {
        const f1 = numerology1.base.fate;
        const f2 = numerology2.base.fate;
        const n1 = numerology1.base.name;
        const n2 = numerology2.base.name;

        let score = 0;

        // Сравнение чисел судьбы
        if (f1 === f2) score += 30;
        else if (Math.abs(f1 - f2) <= 3) score += 20;
        else if (Math.abs(f1 - f2) <= 6) score += 10;

        // Сравнение чисел имени
        if (n1 === n2) score += 20;
        else if (Math.abs(n1 - n2) <= 3) score += 15;
        else if (Math.abs(n1 - n2) <= 6) score += 5;

        // Дополнительные факторы
        if (f1 % 2 === f2 % 2) score += 10; // одинаковая четность

        // Гармоничные пары чисел
        const harmoniousPairs = [
            [1, 5], [1, 7], [2, 4], [2, 6], [3, 9], [4, 8], [5, 9], [6, 9], [7, 9], [8, 4]
        ];

        if (harmoniousPairs.some(pair =>
            (pair[0] === f1 && pair[1] === f2) || (pair[0] === f2 && pair[1] === f1)
        )) {
            score += 25;
        }

        // Определяем уровень совместимости
        let level;
        if (score >= 80) level = '✨ Исключительная совместимость';
        else if (score >= 65) level = '🌟 Высокая совместимость';
        else if (score >= 50) level = '💫 Хорошая совместимость';
        else if (score >= 35) level = '⭐ Средняя совместимость';
        else level = '🌙 Требует работы';

        return {
            score: Math.min(100, score),
            level
        };
    }

    generateForecastInterpretation(type, numerology, targetDate) {
        const interpretations = {
            day: 'Прогноз на день основан на вибрациях текущего дня и вашем числе судьбы. Ожидайте...',
            week: 'Неделя будет отмечена влиянием...',
            month: 'В этом месяце вам стоит обратить внимание на...',
            year: 'Годовой прогноз показывает важные тенденции в сферах...'
        };

        return interpretations[type] || 'Индивидуальный прогноз формируется...';
    }

    generateCompatibilityInterpretation(numerology1, numerology2, compatibility) {
        return `
💑 **АНАЛИЗ СОВМЕСТИМОСТИ**

Общий уровень совместимости: ${compatibility.level} (${compatibility.score}%)

Ваши числа судьбы (${numerology1.base.fate} и ${numerology2.base.fate}) ${numerology1.base.fate === numerology2.base.fate ?
            'совпадают, что говорит о глубоком родстве душ' :
            'создают уникальную динамику в отношениях'}

Числа имени (${numerology1.base.name} и ${numerology2.base.name}) определяют то, как вы проявляете себя в отношениях.

Для гармоничного союза важно...
        `;
    }

    generateBasicInterpretation(numerology) {
        const { base, achilles, control } = numerology;

        return `
🔮 **КОСМОГРАММА ЛИЧНОСТИ**

Ваше число судьбы ${base.fate || '?'} указывает на ваш жизненный путь и предназначение.
Число имени ${base.name} отражает вашу личность и самовыражение.
Число рода ${base.surname} показывает связь с предками и родовые программы.
Число отчества ${base.patronymic} говорит о наследии и кармических задачах.

Ваша ахиллесова пята (число ${achilles.number}) — это зона уязвимости, которая при осознании становится источником силы.
Число управления ${control.number} — ваш внутренний стержень и способ взаимодействия с миром.

Для полного анализа всех сфер жизни (карьера, любовь, финансы, здоровье, таланты) и получения развернутого психологического портрета с картами Таро, знаком зодиака и фен-шуй, выполните полный расчет.
        `;
    }

    generateFullInterpretation(numerology, zodiac, fengShui, tarot, psychology, interpretations) {
        const { base } = numerology;

        let interpretation = `
🔮 **КОСМОГРАММА ЛИЧНОСТИ**

Ваше число судьбы ${base.fate} определяет жизненный путь и главные уроки.
Число имени ${base.name} — это ваша личность и способ самовыражения.
Число рода ${base.surname} — родовые программы и связь с предками.
Число отчества ${base.patronymic} — кармические задачи и наследие.

🌟 **ЗВЕЗДНЫЙ КОД**
Знак зодиака: ${zodiac.name} (${zodiac.element})
Планета-управитель: ${zodiac.planet}
`;

        if (interpretations) {
            if (interpretations.career) {
                interpretation += `\n💼 **КАРЬЕРА**: ${interpretations.career.description}\n`;
            }
            if (interpretations.family) {
                interpretation += `\n👨‍👩‍👧‍👦 **СЕМЬЯ**: ${interpretations.family.description}\n`;
            }
            if (interpretations.love) {
                interpretation += `\n❤️ **ЛЮБОВЬ**: ${interpretations.love.description}\n`;
            }
            if (interpretations.money) {
                interpretation += `\n💰 **ФИНАНСЫ**: ${interpretations.money.description}\n`;
            }
            if (interpretations.health) {
                interpretation += `\n🌿 **ЗДОРОВЬЕ**: ${interpretations.health.description}\n`;
            }
            if (interpretations.talent) {
                interpretation += `\n⭐ **ТАЛАНТЫ**: ${interpretations.talent.description}\n`;
            }
        }

        return interpretation;
    }

    generateBasicPortrait(numerology) {
        return `Ваш психологический портрет формируется на основе чисел судьбы. Для получения полного портрета с анализом архетипов, типа привязанности и НЛП-профиля выполните полный расчет.`;
    }

    generateDeepPortrait(numerology, zodiac, fengShui, tarot, psychology) {
        return psychology.portrait || `Глубинный психологический портрет формируется...`;
    }

    // ========== МЕТОДЫ ДЛЯ РАБОТЫ С ПРОФИЛЕМ И ИСТОРИЕЙ ==========

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
            this.logger?.error('numerology', 'Ошибка проверки бесплатного расчета', { error: error.message });
            throw error;
        }
    }

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
            this.logger?.error('numerology', 'Ошибка обновления профиля', { error: error.message });
        }
    }

    async saveCalculation(userId, calculationType, resultData, price = 0, targetDate = null, serviceId = null) {
        try {
            const { models } = require('../../../sequelize');

            // Маппинг типов расчетов на допустимые значения ENUM
            const calculationTypeMap = {
                'basic': 'basic',
                'full': 'full',
                'day': 'day',
                'week': 'week',
                'month': 'month',
                'year': 'year',
                'compatibility': 'compatibility'
            };

            // Проверяем, что тип расчета допустим
            const dbCalculationType = calculationTypeMap[calculationType] || 'basic';

            // Если serviceId не передан, пытаемся найти по коду услуги
            if (!serviceId) {
                // Маппинг типов расчетов на коды услуг
                const serviceCodeMap = {
                    'basic': 'forecast_basic',
                    'full': 'forecast_full',
                    'day': 'forecast_day',
                    'week': 'forecast_week',
                    'month': 'forecast_month',
                    'year': 'forecast_year',
                    'compatibility': 'compatibility'
                };

                const serviceCode = serviceCodeMap[calculationType];

                if (serviceCode) {
                    const service = await models.Service.findOne({
                        where: { code: serviceCode }
                    });

                    if (service) {
                        serviceId = service.id;
                        console.log(`✅ Найден serviceId ${serviceId} для кода ${serviceCode}`);
                    } else {
                        console.warn(`⚠️ Сервис с кодом ${serviceCode} не найден в БД`);

                        // Если сервис не найден, используем любой существующий сервис как запасной вариант
                        const anyService = await models.Service.findOne();
                        if (anyService) {
                            serviceId = anyService.id;
                            console.log(`⚠️ Использован запасной сервис: ${anyService.code} (${anyService.id})`);
                        } else {
                            throw new Error('В базе данных нет ни одного сервиса');
                        }
                    }
                } else {
                    throw new Error(`Неизвестный тип расчета: ${calculationType}`);
                }
            }

            const calculation = await models.Calculation.create({
                userId,
                serviceId,
                calculationType: dbCalculationType,
                result: resultData || {},
                price,
                targetDate: targetDate || null,
                status: 'completed',
                createdAt: new Date(),
                updatedAt: new Date()
            });

            return calculation;
        } catch (error) {
            console.error('❌ Ошибка сохранения расчета:', error);
            throw error;
        }
    }

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
                limit: parseInt(limit),
                offset: parseInt(offset),
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
                limit: parseInt(limit),
                offset: parseInt(offset)
            };

        } catch (error) {
            this.logger?.error('numerology', 'Ошибка получения истории', { error: error.message });
            throw error;
        }
    }

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
            this.logger?.error('numerology', 'Ошибка получения расчета', { error: error.message });
            throw error;
        }
    }

}

module.exports = NumerologyCalculationService;