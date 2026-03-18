// services/numerology/callsCalculator.js

/**
 * Калькулятор социальных окликов
 */
class CallsCalculator {
    /**
     * Расчет всех окликов
     * @param {Object} baseNumbers - базовые числа
     * @returns {Object} объект с окликами
     */
    calculate(baseNumbers) {
        const close = this.reduceNumber(baseNumbers.fate + baseNumbers.name);
        const social = this.reduceNumber(baseNumbers.surname + baseNumbers.patronymic);
        const world = this.reduceNumber(baseNumbers.fate + baseNumbers.patronymic);

        return {
            close,
            social,
            world,
            descriptions: {
                close: this.getDescription(close, 'close'),
                social: this.getDescription(social, 'social'),
                world: this.getDescription(world, 'world')
            }
        };
    }

    /**
     * Редукция числа с сохранением мастер-чисел
     */
    reduceNumber(num) {
        if (num === 11 || num === 22) return num;
        while (num > 22) {
            num = String(num).split('').reduce((sum, digit) => sum + parseInt(digit), 0);
        }
        return num;
    }

    /**
     * Получение описания для оклика
     * @param {number} num - число оклика
     * @param {string} type - тип оклика (close, social, world)
     * @returns {string} описание
     */
    getDescription(num, type) {
        const baseDescriptions = {
            1: 'волевой лидер, инициатор, тот, кто начинает первым',
            2: 'дипломат, миротворец, чувствительный и терпеливый',
            3: 'творческая натура, душа компании, источник вдохновения',
            4: 'надежный партнер, строитель, опора для окружающих',
            5: 'коммуникатор, исследователь, везде свой',
            6: 'заботливый, ответственный, готовый прийти на помощь',
            7: 'целеустремленный, победитель, преодолевающий препятствия',
            8: 'справедливый, авторитетный, внушающий доверие',
            9: 'мудрый, загадочный, немного отстраненный наблюдатель',
            10: 'харизматичный лидер, удачливый и успешный',
            11: 'вдохновляющий, сильный, заряжающий энергией',
            12: 'понимающий, принимающий, готовый выслушать и поддержать',
            13: 'меняющийся, развивающийся, всегда в движении',
            14: 'гармоничный, уравновешенный, спокойный',
            15: 'притягательный, страстный, немного опасный',
            16: 'основательный, мощный, разрушающий стены',
            17: 'окрыленный, верящий, вдохновляющий надеждой',
            18: 'интуитивный, загадочный, чувствующий глубже других',
            19: 'солнечный, щедрый, согревающий своим теплом',
            20: 'пробуждающий, заставляющий задуматься',
            21: 'целостный, завершенный, умиротворяющий',
            22: 'свободный, легкий, начинающий новое'
        };

        const typePrefix = {
            close: 'В кругу семьи вы — ',
            social: 'В коллективе вас видят как ',
            world: 'Незнакомцы воспринимают вас как '
        };

        return typePrefix[type] + (baseDescriptions[num] || 'многогранная личность, которую сложно описать одной фразой');
    }
}

module.exports = CallsCalculator;