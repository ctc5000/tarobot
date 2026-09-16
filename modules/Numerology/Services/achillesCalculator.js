// services/numerology/achillesCalculator.js

/**
 * Калькулятор челленджей (Challenges) — классические 4 испытания жизни
 * Заменяет авторскую "ахиллесову пяту" на профессиональные челленджи
 */
class AchillesCalculator {
    constructor() {
        this.baseCalculator = null; // будет установлен извне
    }

    setBaseCalculator(calc) {
        this.baseCalculator = calc;
    }

    /**
     * Расчет 4 челленджей из даты рождения
     * @param {Object} baseNumbers - базовые числа (содержит birthDate)
     * @returns {Object} объект с челленджами
     */
    calculate(baseNumbers) {
        if (!baseNumbers.birthDate) {
            return {
                number: 0,
                description: 'Недостаточно данных для расчета'
            };
        }

        const challenges = this.baseCalculator.calculateChallenges(baseNumbers.birthDate);
        
        return {
            number: challenges.main,
            first: challenges.first,
            second: challenges.second,
            third: challenges.third,
            fourth: challenges.fourth,
            main: challenges.main,
            description: this.getDescription(challenges.main),
            allDescriptions: {
                first: this.getChallengeDescription(challenges.first, 'first'),
                second: this.getChallengeDescription(challenges.second, 'second'),
                third: this.getChallengeDescription(challenges.third, 'third'),
                fourth: this.getChallengeDescription(challenges.fourth, 'fourth')
            }
        };
    }

    /**
     * Получение описания для основного челленджа
     */
    getDescription(num) {
        const descriptions = {
            0: 'У вас нет кармических ограничений. Вы обладаете свободой выбора и можете достичь всего, к чему стремитесь.',
            1: 'Испытание уверенностью и независимостью. Вам нужно научиться стоять на своих ногах и доверять своим решениям.',
            2: 'Испытание чувствительностью и сотрудничеством. Вам нужно научиться дипломатии и умению работать с другими.',
            3: 'Испытание самовыражением. Вам нужно преодолеть страх критики и научиться выражать свои таланты.',
            4: 'Испытание дисциплиной и порядком. Вам нужно научиться организованности и трудолюбию.',
            5: 'Испытание свободой и переменами. Вам нужно научиться принимать изменения и не бояться неизвестности.',
            6: 'Испытание ответственностью и совершенством. Вам нужно научиться принимать несовершенство мира.',
            7: 'Испытание верой и доверием. Вам нужно научиться доверять жизни и своей интуиции.',
            8: 'Испытание властью и изобилием. Вам нужно научиться управлять ресурсами и не бояться успеха.',
            9: 'Испытание отпусканием и завершением. Вам нужно научиться отпускать то, что уже не служит вашему высшему благу.'
        };

        return descriptions[num] || this.getDefaultDescription(num);
    }

    /**
     * Получение описания для конкретного периода челленджа
     */
    getChallengeDescription(num, period) {
        const periodNames = {
            first: 'Первый челлендж (0-35 лет)',
            second: 'Второй челлендж (36-53 года)',
            third: 'Третий челлендж (54+ лет)',
            fourth: 'Главный челлендж (вся жизнь)'
        };

        const baseDesc = this.getDescription(num);
        return `${periodNames[period]}: ${baseDesc}`;
    }

    getDefaultDescription(num) {
        return `Челлендж числа ${num} указывает на область, где вас ждут наиболее важные уроки и испытания.`;
    }
}

module.exports = AchillesCalculator;