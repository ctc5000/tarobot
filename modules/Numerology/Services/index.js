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
 * Использует классические профессиональные формулы
 */
class NumerologyService {
    constructor(system = 'pythagorean') {
        // Единый базовый калькулятор
        this.baseCalculator = new BaseCalculator(system);
        
        // Калькуляторы (получают ссылку на baseCalculator)
        this.achillesCalculator = new AchillesCalculator();
        this.achillesCalculator.setBaseCalculator(this.baseCalculator);
        
        this.callsCalculator = new CallsCalculator();
        this.callsCalculator.setBaseCalculator(this.baseCalculator);
        
        this.controlCalculator = new ControlCalculator();
        this.controlCalculator.setBaseCalculator(this.baseCalculator);

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
     * Полный расчет нумерологии (классический профессиональный)
     * @param {string} surname - фамилия
     * @param {string} firstName - имя
     * @param {string} patronymic - отчество
     * @param {string} birthDate - дата рождения ДД.ММ.ГГГГ
     * @returns {Object} полный нумерологический расчет
     */
    calculate(surname, firstName, patronymic, birthDate) {
        const fullName = `${surname} ${firstName} ${patronymic}`;
        
        // 1. Базовые числа (классические)
        const lifePath = this.baseCalculator.calculateLifePath(birthDate);
        const birthDay = this.baseCalculator.calculateBirthDay(birthDate);
        const expression = this.baseCalculator.calculateExpression(fullName);
        const soulUrge = this.baseCalculator.calculateSoulUrge(fullName);
        const personality = this.baseCalculator.calculatePersonality(fullName);
        const maturity = this.baseCalculator.calculateMaturity(expression, lifePath);
        const balance = this.baseCalculator.calculateBalance(fullName);
        const hiddenPassion = this.baseCalculator.calculateHiddenPassion(fullName);
        
        // 2. Значения отдельных частей имени (для совместимости)
        const nameValue = this.baseCalculator.calculateWordValue(firstName);
        const surnameValue = this.baseCalculator.calculateWordValue(surname);
        const patronymicValue = this.baseCalculator.calculateWordValue(patronymic);
        
        const baseNumbers = {
            fate: lifePath, // для обратной совместимости
            lifePath,
            birthDay,
            name: nameValue,
            surname: surnameValue,
            patronymic: patronymicValue,
            expression,
            soulUrge,
            personality,
            maturity,
            balance,
            hiddenPassion: hiddenPassion.number,
            hiddenPassionCount: hiddenPassion.count,
            digitCount: hiddenPassion.digitCount,
            birthDate // передаём дату для других калькуляторов
        };

        // 3. Челленджи (заменяет ахиллесову пяту)
        const achilles = this.achillesCalculator.calculate(baseNumbers);

        // 4. Число зрелости (заменяет число управления)
        const control = this.controlCalculator.calculate(baseNumbers);

        // 5. Социальные оклики (классические)
        const calls = this.callsCalculator.calculate(baseNumbers);

        // 6. Пинакли (4 жизненных этапа)
        const pinnacles = this.baseCalculator.calculatePinnacles(birthDate);

        // 7. Квадрат Пифагора
        const pythagoreanSquare = this.baseCalculator.calculatePythagoreanSquare(birthDate);

        // 8. Кармические долги
        const karmicDebtLifePath = this.baseCalculator.checkKarmicDebt(lifePath);
        const karmicDebtExpression = this.baseCalculator.checkKarmicDebt(expression);
        const karmicDebt = {
            lifePath: karmicDebtLifePath,
            expression: karmicDebtExpression,
            hasDebt: karmicDebtLifePath.hasDebt || karmicDebtExpression.hasDebt
        };

        return {
            base: {
                lifePath,
                birthDay,
                name: nameValue,
                surname: surnameValue,
                patronymic: patronymicValue,
                expression,
                soulUrge,
                personality,
                maturity,
                balance,
                hiddenPassion: hiddenPassion.number
            },
            achilles,
            control,
            calls,
            pinnacles,
            pythagoreanSquare,
            karmicDebt,
            system: this.baseCalculator.system
        };
    }

    /**
     * Получение всех дополнительных интерпретаций
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
     */
    parseFullName(fullName) {
        return this.baseCalculator.parseFullName(fullName);
    }
}

module.exports = NumerologyService;