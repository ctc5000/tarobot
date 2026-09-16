// modules/Numerology/Services/NumerologyCore.js
/**
 * NumerologyCore.js — единый движок расчётов с пифагорейской системой
 * Объединяет все калькуляторы в простой API для использования в сервисах
 */

const NumerologyService = require('./index');

class NumerologyCore {
    constructor() {
        this.service = new NumerologyService('pythagorean');
    }

    /**
     * Полный нумерологический расчёт
     * @param {string} surname - фамилия
     * @param {string} firstName - имя
     * @param {string} patronymic - отчество
     * @param {string} birthDate - дата в формате ДД.ММ.ГГГГ
     * @returns {Object} все числа и расчёты
     */
    calculate(surname, firstName, patronymic, birthDate) {
        const fullName = `${surname} ${firstName} ${patronymic}`;
        const result = this.service.calculate(surname, firstName, patronymic, birthDate);

        return {
            // Базовые числа
            lifePath: result.base.lifePath,
            birthDay: result.base.birthDay,
            expression: result.base.expression,
            soulUrge: result.base.soulUrge,
            personality: result.base.personality,
            maturity: result.base.maturity,
            balance: result.base.balance,
            hiddenPassion: result.base.hiddenPassion,

            // Значения отдельных частей имени
            name: result.base.name,
            surname: result.base.surname,
            patronymic: result.base.patronymic,

            // Челленджи (4 испытания)
            challenges: result.achilles,

            // Число зрелости
            maturityNumber: result.control,

            // Социальные оклики
            calls: result.calls,

            // Пинакли (4 жизненных этапа)
            pinnacles: result.pinnacles,

            // Квадрат Пифагора
            pythagoreanSquare: result.pythagoreanSquare,

            // Кармические долги
            karmicDebt: result.karmicDebt,

            // Система
            system: result.system,

            // Полный объект base для обратной совместимости
            base: result.base,

            // Полные объекты для обратной совместимости
            achilles: result.achilles,
            control: result.control
        };
    }

    /**
     * Получение интерпретаций для всех сфер жизни
     * @param {Object} baseNumbers - базовые числа
     * @returns {Object} интерпретации
     */
    getInterpretations(baseNumbers) {
        return this.service.getInterpretations(baseNumbers);
    }

    /**
     * Разбор ФИО на составляющие
     * @param {string} fullName - полное имя
     * @returns {Object} фамилия, имя, отчество
     */
    parseFullName(fullName) {
        return this.service.parseFullName(fullName);
    }

    /**
     * Форматирование даты из YYYY-MM-DD в DD.MM.YYYY
     */
    formatDate(dateStr) {
        if (!dateStr) return null;
        if (dateStr.includes('.')) return dateStr;
        const [year, month, day] = dateStr.split('-');
        return `${day}.${month}.${year}`;
    }
}

module.exports = NumerologyCore;