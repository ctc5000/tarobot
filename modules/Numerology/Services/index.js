// services/numerology/index.js

const BaseCalculator = require('./baseCalculator');
const AchillesCalculator = require('./achillesCalculator');
const CallsCalculator = require('./callsCalculator');
const ControlCalculator = require('./controlCalculator');

const CareerInterpreter = require('./interpreters/careerInterpreter');
const FamilyInterpreter = require('./interpreters/familyInterpreter');
const LoveInterpreter = require('./interpreters/loveInterpreter');
const MoneyInterpreter = require('./interpreters/moneyInterpreter');
const HealthInterpreter = require('./interpreters/healthInterpreter');
const TalentInterpreter = require('./interpreters/talentInterpreter');
const PatternsGenerator = require('./interpreters/patternsGenerator');

/**
 * Главный сервис нумерологии
 * Агрегирует все калькуляторы и интерпретаторы
 */
class NumerologyService {
    constructor() {
        // Калькуляторы
        this.baseCalculator = new BaseCalculator();
        this.achillesCalculator = new AchillesCalculator();
        this.callsCalculator = new CallsCalculator();
        this.controlCalculator = new ControlCalculator();

        // Интерпретаторы
        this.careerInterpreter = new CareerInterpreter();
        this.familyInterpreter = new FamilyInterpreter();
        this.loveInterpreter = new LoveInterpreter();
        this.moneyInterpreter = new MoneyInterpreter();
        this.healthInterpreter = new HealthInterpreter();
        this.talentInterpreter = new TalentInterpreter();

        // Генератор паттернов
        this.patternsGenerator = new PatternsGenerator();
    }

    /**
     * Полный расчет нумерологии
     * @param {string} surname - фамилия
     * @param {string} firstName - имя
     * @param {string} patronymic - отчество
     * @param {string} birthDate - дата рождения ДД.ММ.ГГГГ
     * @returns {Object} полный нумерологический расчет
     */
    calculate(surname, firstName, patronymic, birthDate) {
        // 1. Базовые числа
        const baseNumbers = {
            fate: this.baseCalculator.calculateFateNumber(birthDate),
            name: this.baseCalculator.calculateWordValue(firstName),
            surname: this.baseCalculator.calculateWordValue(surname),
            patronymic: this.baseCalculator.calculateWordValue(patronymic)
        };

        // 2. Ахиллесова пята
        const achilles = this.achillesCalculator.calculate(baseNumbers);

        // 3. Число управления
        const control = this.controlCalculator.calculate(baseNumbers);

        // 4. Социальные оклики
        const calls = this.callsCalculator.calculate(baseNumbers);

        return {
            base: baseNumbers,
            achilles,
            control,
            calls
        };
    }

    /**
     * Получение всех дополнительных интерпретаций
     * @param {Object} baseNumbers - базовые числа
     * @returns {Object} все интерпретации
     */
    getInterpretations(baseNumbers) {
        return {
            career: this.careerInterpreter.interpret(baseNumbers),
            family: this.familyInterpreter.interpret(baseNumbers),
            love: this.loveInterpreter.interpret(baseNumbers),
            money: this.moneyInterpreter.interpret(baseNumbers),
            health: this.healthInterpreter.interpret(baseNumbers),
            talent: this.talentInterpreter.interpret(baseNumbers)
        };
    }

    /**
     * Получение конкретной интерпретации
     * @param {string} type - тип интерпретации
     * @param {Object} baseNumbers - базовые числа
     * @returns {Object} интерпретация
     */
    getInterpretation(type, baseNumbers) {
        switch(type) {
            case 'career':
                return this.careerInterpreter.interpret(baseNumbers);
            case 'family':
                return this.familyInterpreter.interpret(baseNumbers);
            case 'love':
                return this.loveInterpreter.interpret(baseNumbers);
            case 'money':
                return this.moneyInterpreter.interpret(baseNumbers);
            case 'health':
                return this.healthInterpreter.interpret(baseNumbers);
            case 'talent':
                return this.talentInterpreter.interpret(baseNumbers);
            default:
                throw new Error(`Неизвестный тип интерпретации: ${type}`);
        }
    }

    /**
     * Генерация паттернов личности
     * @param {Object} numerology - данные нумерологии
     * @param {Object} zodiac - данные знака зодиака
     * @param {Object} fengShui - данные фен-шуй
     * @param {Object} tarot - данные Таро
     * @param {Object} psychology - данные психологии
     * @returns {Array} массив паттернов
     */
    generatePatterns(numerology, zodiac, fengShui, tarot, psychology) {
        return this.patternsGenerator.generate(
            numerology,
            zodiac,
            fengShui,
            tarot,
            psychology
        );
    }

    /**
     * Сокращенные паттерны для превью
     * @param {Object} numerology - данные нумерологии
     * @param {Object} zodiac - данные знака зодиака
     * @param {Object} fengShui - данные фен-шуй
     * @param {Object} tarot - данные Таро
     * @param {Object} psychology - данные психологии
     * @returns {Array} массив из 3 паттернов
     */
    getPreviewPatterns(numerology, zodiac, fengShui, tarot, psychology) {
        return this.patternsGenerator.getPreviewPatterns(
            numerology,
            zodiac,
            fengShui,
            tarot,
            psychology
        );
    }

    /**
     * Разбор ФИО на составляющие
     * @param {string} fullName - полное имя
     * @returns {Object} объект с фамилией, именем и отчеством
     */
    parseFullName(fullName) {
        return this.baseCalculator.parseFullName(fullName);
    }
}

module.exports = NumerologyService;