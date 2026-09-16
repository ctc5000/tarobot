// services/numerology/callsCalculator.js

/**
 * Калькулятор социальных окликов (классические)
 * - Близкие: Число Души (Soul Urge) — как вас знают близкие
 * - Социум: Число Выражения (Expression) — как вас воспринимают в социуме
 * - Мир: Число Судьбы (Life Path) — как вас видит мир
 * - Первое впечатление: Число Личности (Personality) — первое впечатление
 */
class CallsCalculator {
    constructor() {
        this.baseCalculator = null; // будет установлен извне
    }

    setBaseCalculator(calc) {
        this.baseCalculator = calc;
    }

    /**
     * Расчет всех окликов
     * @param {Object} baseNumbers - базовые числа (содержит soulUrge, expression, lifePath, personality)
     * @returns {Object} объект с окликами
     */
    calculate(baseNumbers) {
        const close = baseNumbers.soulUrge || baseNumbers.name || 0;
        const social = baseNumbers.expression || baseNumbers.fate || 0;
        const world = baseNumbers.lifePath || baseNumbers.fate || 0;
        const firstImpression = baseNumbers.personality || 0;

        return {
            close,
            social,
            world,
            firstImpression,
            descriptions: {
                close: this.getDescription(close, 'close'),
                social: this.getDescription(social, 'social'),
                world: this.getDescription(world, 'world'),
                firstImpression: this.getDescription(firstImpression, 'firstImpression')
            }
        };
    }

    /**
     * Получение описания для оклика
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
            11: 'вдохновляющий, интуитивный, несущий свет',
            22: 'масштабный, практичный, воплощающий великие идеи',
            33: 'исцеляющий, сострадательный, безусловно любящий'
        };

        const typePrefix = {
            close: 'В кругу близких вы — ',
            social: 'В социуме вас видят как ',
            world: 'Мир воспринимает вас как ',
            firstImpression: 'Первое впечатление о вас — '
        };

        return typePrefix[type] + (baseDescriptions[num] || 'многогранная личность, которую сложно описать одной фразой');
    }
}

module.exports = CallsCalculator;