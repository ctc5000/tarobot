// services/numerology/baseCalculator.js

/**
 * Базовый калькулятор для нумерологии
 * Содержит основные функции редукции чисел и расчета базовых значений
 */
class BaseCalculator {
    constructor() {
        this.letterMap = {
            'а': 1, 'б': 2, 'в': 3, 'г': 4, 'д': 5, 'е': 6, 'ё': 7, 'ж': 8, 'з': 9,
            'и': 10, 'й': 11, 'к': 12, 'л': 13, 'м': 14, 'н': 15, 'о': 16, 'п': 17,
            'р': 18, 'с': 19, 'т': 20, 'у': 21, 'ф': 22, 'х': 23, 'ц': 24, 'ч': 25,
            'ш': 26, 'щ': 27, 'ъ': 28, 'ы': 29, 'ь': 30, 'э': 31, 'ю': 32, 'я': 33
        };
    }

    /**
     * Редукция числа до диапазона 1-22 (с сохранением мастер-чисел)
     * @param {number} num - исходное число
     * @returns {number} редуцированное число
     */
    reduceToRange(num) {
        // Сохраняем мастер-числа 11, 22
        if (num === 11 || num === 22) return num;

        while (num > 22) {
            num = String(num).split('').reduce((sum, digit) => sum + parseInt(digit), 0);
        }
        return num;
    }

    /**
     * Редукция до однозначного числа (1-9)
     * @param {number} num - исходное число
     * @returns {number} редуцированное число
     */
    reduceToSingle(num) {
        while (num > 9 && num !== 11 && num !== 22) {
            num = String(num).split('').reduce((sum, digit) => sum + parseInt(digit), 0);
        }
        return num;
    }

    /**
     * Вычисление числового значения слова
     * @param {string} word - слово для расчета
     * @returns {number} числовое значение
     */
    calculateWordValue(word) {
        const cleaned = word.toLowerCase().replace(/[^а-яё]/g, '');
        let sum = 0;
        for (let char of cleaned) {
            sum += this.letterMap[char] || 0;
        }
        return this.reduceToRange(sum);
    }

    /**
     * Вычисление числа судьбы из даты рождения
     * @param {string} birthDate - дата в формате ДД.ММ.ГГГГ
     * @returns {number} число судьбы
     */
    calculateFateNumber(birthDate) {
        let sum = birthDate.split('.').join('').split('')
            .reduce((s, d) => s + parseInt(d), 0);
        return this.reduceToRange(sum);
    }

    /**
     * Разбор ФИО на составляющие
     * @param {string} fullName - полное имя
     * @returns {Object} объект с фамилией, именем и отчеством
     */
    parseFullName(fullName) {
        const parts = fullName.trim().split(/\s+/);
        if (parts.length < 3) {
            throw new Error('Необходимо указать фамилию, имя и отчество');
        }
        return {
            surname: parts[0],
            firstName: parts[1],
            patronymic: parts[2]
        };
    }
}

module.exports = BaseCalculator;