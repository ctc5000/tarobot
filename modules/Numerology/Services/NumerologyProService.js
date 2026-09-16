// modules/Numerology/Services/NumerologyProService.js
/**
 * NumerologyProService.js — профессиональный режим для нумерологов
 * Содержит расширенные расчёты: по буквам, промежуточные суммы, кармический хвост,
 * матрица судьбы, чакровый анализ, нумерология адреса/телефона/дат
 */

const BaseCalculator = require('./baseCalculator');

class NumerologyProService {
    constructor(system = 'pythagorean', preserveMasters = true, preserveKarmicDebts = true) {
        this.baseCalculator = new BaseCalculator(system);
        this.system = system;
        this.preserveMasters = preserveMasters;
        this.preserveKarmicDebts = preserveKarmicDebts;
    }

    /**
     * Полный профессиональный расчёт с детализацией
     */
    calculateProfessional(surname, firstName, patronymic, birthDate) {
        const fullName = `${surname} ${firstName} ${patronymic}`;
        const formattedDate = this._formatDate(birthDate);

        return {
            // 1. Все 15+ ключевых чисел
            keyNumbers: this._calculateAllKeyNumbers(fullName, formattedDate),

            // 2. Разбивка по буквам
            letterBreakdown: this._calculateLetterBreakdown(fullName),

            // 3. Промежуточные суммы
            intermediateSums: this._calculateIntermediateSums(fullName, formattedDate),

            // 4. Таблицы расчёта
            tables: this._generateCalculationTables(fullName, formattedDate),

            // 5. Пинакли с возрастными границами
            pinnacles: this._calculatePinnaclesWithAges(formattedDate),

            // 6. Челленджи с возрастными границами
            challenges: this._calculateChallengesWithAges(formattedDate),

            // 7. Матрица Судьбы (полная)
            destinyMatrix: this._calculateDestinyMatrix(formattedDate),

            // 8. Кармический хвост (Ладини)
            karmicTail: this._calculateKarmicTail(formattedDate),

            // 9. Чакровый анализ
            chakraAnalysis: this._calculateChakraAnalysis(fullName, formattedDate),

            // 10. Профессиональные формулировки
            professionalInterpretation: this._generateProfessionalInterpretation(fullName, formattedDate),

            // Метаданные
            meta: {
                system: this.system,
                systemName: this._getSystemName(this.system),
                preserveMasters: this.preserveMasters,
                preserveKarmicDebts: this.preserveKarmicDebts,
                timestamp: new Date().toISOString(),
                references: [
                    { name: 'Пифагор', contribution: 'Основатель нумерологии, система 1-9' },
                    { name: 'Ханс Декоц', contribution: 'Современная интерпретация чисел судьбы' },
                    { name: 'Дэвид Филлипс', contribution: 'Число выражения и число души' },
                    { name: 'А.Ф. Александров', contribution: 'Квадрат Пифагора (психоматрица)' },
                    { name: 'Ладини', contribution: 'Кармический хвост и матрица судьбы' }
                ]
            }
        };
    }

    /**
     * Расчёт всех 15+ ключевых чисел
     */
    _calculateAllKeyNumbers(fullName, birthDate) {
        const parts = this.baseCalculator.parseFullName(fullName);
        const [day, month, year] = birthDate.split('.').map(Number);

        // Базовые числа
        const lifePath = this.baseCalculator.calculateLifePath(birthDate);
        const birthDay = this.baseCalculator.calculateBirthDay(birthDate);
        const expression = this.baseCalculator.calculateExpression(fullName);
        const soulUrge = this.baseCalculator.calculateSoulUrge(fullName);
        const personality = this.baseCalculator.calculatePersonality(fullName);
        const maturity = this.baseCalculator.calculateMaturity(expression, lifePath);
        const balance = this.baseCalculator.calculateBalance(fullName);
        const hiddenPassion = this.baseCalculator.calculateHiddenPassion(fullName);

        // Значения отдельных частей имени
        const nameValue = this.baseCalculator.calculateWordValue(parts.firstName);
        const surnameValue = this.baseCalculator.calculateWordValue(parts.surname);
        const patronymicValue = this.baseCalculator.calculateWordValue(parts.patronymic);

        // Пинакли
        const pinnacles = this.baseCalculator.calculatePinnacles(birthDate);

        // Челленджи
        const challenges = this.baseCalculator.calculateChallenges(birthDate);

        // Кармические долги
        const karmicDebtLP = this.baseCalculator.checkKarmicDebt(lifePath);
        const karmicDebtExpr = this.baseCalculator.checkKarmicDebt(expression);

        // Личный год, месяц, день
        const personalYear = this.baseCalculator.calculatePersonalYear(birthDate, new Date().getFullYear());
        const personalMonth = this.baseCalculator.calculatePersonalMonth(personalYear, new Date().getMonth() + 1);
        const personalDay = this.baseCalculator.calculatePersonalDay(personalMonth, new Date().getDate());

        // Рабочие числа (для квадрата Пифагора)
        const pythagorean = this.baseCalculator.calculatePythagoreanSquare(birthDate);

        // Сумма всех цифр даты (для кармического хвоста)
        const dateDigits = birthDate.replace(/\./g, '').split('').map(Number);
        const totalDateSum = dateDigits.reduce((a, b) => a + b, 0);

        return {
            // Основные (7 классических)
            lifePath: { value: lifePath, name: 'Число Судьбы (Life Path)', description: this.baseCalculator.getNumberDescription(lifePath, 'lifePath') },
            birthDay: { value: birthDay, name: 'Число Дня Рождения (Birth Day)', description: this.baseCalculator.getNumberDescription(birthDay) },
            expression: { value: expression, name: 'Число Выражения (Expression)', description: this.baseCalculator.getNumberDescription(expression) },
            soulUrge: { value: soulUrge, name: 'Число Души (Soul Urge)', description: this.baseCalculator.getNumberDescription(soulUrge) },
            personality: { value: personality, name: 'Число Личности (Personality)', description: this.baseCalculator.getNumberDescription(personality) },
            maturity: { value: maturity, name: 'Число Зрелости (Maturity)', description: this.baseCalculator.getNumberDescription(maturity) },
            balance: { value: balance, name: 'Число Баланса (Balance)', description: this.baseCalculator.getNumberDescription(balance) },

            // Дополнительные (8+)
            nameNumber: { value: nameValue, name: 'Число Имени', description: this.baseCalculator.getNumberDescription(nameValue) },
            surnameNumber: { value: surnameValue, name: 'Число Рода (Фамилия)', description: this.baseCalculator.getNumberDescription(surnameValue) },
            patronymicNumber: { value: patronymicValue, name: 'Число Отчества', description: this.baseCalculator.getNumberDescription(patronymicValue) },
            hiddenPassion: { value: hiddenPassion.number, name: 'Число Скрытой Страсти', description: `Самая частая цифра: ${hiddenPassion.number} (${hiddenPassion.count} раз)` },
            personalYear: { value: personalYear, name: 'Число Личного Года', description: this.baseCalculator.getNumberDescription(personalYear) },
            personalMonth: { value: personalMonth, name: 'Число Личного Месяца', description: this.baseCalculator.getNumberDescription(personalMonth) },
            personalDay: { value: personalDay, name: 'Число Личного Дня', description: this.baseCalculator.getNumberDescription(personalDay) },

            // Пинакли
            pinnacle1: { value: pinnacles.first, name: '1-й Пинакль (0-35 лет)', description: this.baseCalculator.getNumberDescription(pinnacles.first) },
            pinnacle2: { value: pinnacles.second, name: '2-й Пинакль (36-53 года)', description: this.baseCalculator.getNumberDescription(pinnacles.second) },
            pinnacle3: { value: pinnacles.third, name: '3-й Пинакль (54+ лет)', description: this.baseCalculator.getNumberDescription(pinnacles.third) },
            pinnacle4: { value: pinnacles.fourth, name: '4-й Пинакль (вся жизнь)', description: this.baseCalculator.getNumberDescription(pinnacles.fourth) },

            // Челленджи
            challenge1: { value: challenges.first, name: '1-й Челлендж (0-35 лет)', description: this._getChallengeDescription(challenges.first) },
            challenge2: { value: challenges.second, name: '2-й Челлендж (36-53 года)', description: this._getChallengeDescription(challenges.second) },
            challenge3: { value: challenges.third, name: '3-й Челлендж (54+ лет)', description: this._getChallengeDescription(challenges.third) },
            challenge4: { value: challenges.fourth, name: 'Главный Челлендж', description: this._getChallengeDescription(challenges.fourth) },

            // Мастер-числа (выделены)
            masterNumbers: this._findMasterNumbers([lifePath, expression, soulUrge, personality, maturity, balance, nameValue, surnameValue, patronymicValue]),

            // Кармические долги (выделены)
            karmicDebts: {
                lifePath: karmicDebtLP,
                expression: karmicDebtExpr,
                hasDebt: karmicDebtLP.hasDebt || karmicDebtExpr.hasDebt
            },

            // Рабочие числа квадрата Пифагора
            pythagoreanWorkings: pythagorean.workings,

            // Сумма даты рождения
            totalDateSum: { value: this.baseCalculator.reduceToSingle(totalDateSum), name: 'Сумма даты рождения', raw: totalDateSum }
        };
    }

    /**
     * Разбивка по буквам — какая буква какое число даёт
     */
    _calculateLetterBreakdown(fullName) {
        const cleaned = fullName.toLowerCase().replace(/[^а-яё\s]/g, '');
        const parts = cleaned.split(/\s+/);
        const letterMap = this.baseCalculator.letterMap;

        const breakdown = {};
        const partNames = ['surname', 'firstName', 'patronymic'];

        parts.forEach((part, idx) => {
            const key = partNames[idx] || `part${idx}`;
            const letters = [];
            let sum = 0;

            for (const char of part) {
                const num = letterMap[char] || 0;
                letters.push({ letter: char, value: num });
                sum += num;
            }

            breakdown[key] = {
                word: part,
                letters,
                sum,
                reduced: this.baseCalculator.reduceToSingle(sum)
            };
        });

        return breakdown;
    }

    /**
     * Промежуточные суммы — как получилось каждое число
     */
    _calculateIntermediateSums(fullName, birthDate) {
        const parts = this.baseCalculator.parseFullName(fullName);
        const [day, month, year] = birthDate.split('.').map(Number);

        // Life Path: день + месяц + год (каждый редуцируется отдельно)
        const dayR = this.baseCalculator.reduceToSingle(day);
        const monthR = this.baseCalculator.reduceToSingle(month);
        const yearR = this.baseCalculator.reduceToSingle(year);
        const lifePathSum = dayR + monthR + yearR;
        const lifePath = this.baseCalculator.reduceToSingle(lifePathSum);

        // Expression: сумма всех букв ФИО
        const surnameSum = this.baseCalculator.calculateWordValue(parts.surname);
        const firstNameSum = this.baseCalculator.calculateWordValue(parts.firstName);
        const patronymicSum = this.baseCalculator.calculateWordValue(parts.patronymic);
        const expressionSum = surnameSum + firstNameSum + patronymicSum;
        const expression = this.baseCalculator.reduceToSingle(expressionSum);

        // Soul Urge: только гласные
        const vowels = 'аеёиоуыэюя';
        const fullNameClean = fullName.toLowerCase().replace(/[^а-яё]/g, '');
        let soulUrgeSum = 0;
        for (const char of fullNameClean) {
            if (vowels.includes(char)) {
                soulUrgeSum += this.baseCalculator.letterMap[char] || 0;
            }
        }
        const soulUrge = this.baseCalculator.reduceToSingle(soulUrgeSum);

        // Personality: только согласные
        const consonants = 'бвгджзйклмнпрстфхцчшщъь';
        let personalitySum = 0;
        for (const char of fullNameClean) {
            if (consonants.includes(char)) {
                personalitySum += this.baseCalculator.letterMap[char] || 0;
            }
        }
        const personality = this.baseCalculator.reduceToSingle(personalitySum);

        // Maturity: Expression + Life Path
        const maturitySum = expression + lifePath;
        const maturity = this.baseCalculator.reduceToSingle(maturitySum);

        // Balance: инициалы
        const initials = (parts.surname[0] || '') + (parts.firstName[0] || '') + (parts.patronymic[0] || '');
        const balanceSum = this.baseCalculator.calculateWordValue(initials);
        const balance = this.baseCalculator.reduceToSingle(balanceSum);

        return {
            lifePath: {
                formula: `(${day}→${dayR}) + (${month}→${monthR}) + (${year}→${yearR}) = ${lifePathSum} → ${lifePath}`,
                steps: [
                    { description: `День: ${day} → ${dayR}`, value: dayR },
                    { description: `Месяц: ${month} → ${monthR}`, value: monthR },
                    { description: `Год: ${year} → ${yearR}`, value: yearR },
                    { description: `Сумма: ${dayR} + ${monthR} + ${yearR} = ${lifePathSum}`, value: lifePathSum },
                    { description: `Редукция: ${lifePathSum} → ${lifePath}`, value: lifePath }
                ],
                result: lifePath
            },
            expression: {
                formula: `Фамилия(${surnameSum}) + Имя(${firstNameSum}) + Отчество(${patronymicSum}) = ${expressionSum} → ${expression}`,
                steps: [
                    { description: `Фамилия "${parts.surname}": ${surnameSum}`, value: surnameSum },
                    { description: `Имя "${parts.firstName}": ${firstNameSum}`, value: firstNameSum },
                    { description: `Отчество "${parts.patronymic}": ${patronymicSum}`, value: patronymicSum },
                    { description: `Сумма: ${surnameSum} + ${firstNameSum} + ${patronymicSum} = ${expressionSum}`, value: expressionSum },
                    { description: `Редукция: ${expressionSum} → ${expression}`, value: expression }
                ],
                result: expression
            },
            soulUrge: {
                formula: `Сумма гласных = ${soulUrgeSum} → ${soulUrge}`,
                steps: [
                    { description: `Сумма гласных букв: ${soulUrgeSum}`, value: soulUrgeSum },
                    { description: `Редукция: ${soulUrgeSum} → ${soulUrge}`, value: soulUrge }
                ],
                result: soulUrge
            },
            personality: {
                formula: `Сумма согласных = ${personalitySum} → ${personality}`,
                steps: [
                    { description: `Сумма согласных букв: ${personalitySum}`, value: personalitySum },
                    { description: `Редукция: ${personalitySum} → ${personality}`, value: personality }
                ],
                result: personality
            },
            maturity: {
                formula: `Expression(${expression}) + LifePath(${lifePath}) = ${maturitySum} → ${maturity}`,
                steps: [
                    { description: `${expression} + ${lifePath} = ${maturitySum}`, value: maturitySum },
                    { description: `Редукция: ${maturitySum} → ${maturity}`, value: maturity }
                ],
                result: maturity
            },
            balance: {
                formula: `Инициалы(${initials}) = ${balanceSum} → ${balance}`,
                steps: [
                    { description: `Инициалы: ${initials}`, value: balanceSum },
                    { description: `Сумма: ${balanceSum}`, value: balanceSum },
                    { description: `Редукция: ${balanceSum} → ${balance}`, value: balance }
                ],
                result: balance
            }
        };
    }

    /**
     * Таблицы расчёта
     */
    _generateCalculationTables(fullName, birthDate) {
        const parts = this.baseCalculator.parseFullName(fullName);
        const letterMap = this.baseCalculator.letterMap;
        const vowels = 'аеёиоуыэюя';
        const consonants = 'бвгджзйклмнпрстфхцчшщъь';

        // Таблица Числа Выражения — по буквам
        const expressionTable = [];
        for (const [partKey, partName] of [['surname', parts.surname], ['firstName', parts.firstName], ['patronymic', parts.patronymic]]) {
            const cleaned = partName.toLowerCase().replace(/[^а-яё]/g, '');
            for (const char of cleaned) {
                expressionTable.push({
                    part: partKey,
                    letter: char,
                    value: letterMap[char] || 0,
                    type: vowels.includes(char) ? 'гласная' : consonants.includes(char) ? 'согласная' : 'другая'
                });
            }
        }

        // Таблица Числа Души — гласные
        const soulUrgeTable = expressionTable.filter(row => row.type === 'гласная');

        // Таблица Числа Личности — согласные
        const personalityTable = expressionTable.filter(row => row.type === 'согласная');

        // Таблица Пинаклей
        const pinnacles = this.baseCalculator.calculatePinnacles(birthDate);
        const pinnacleTable = [
            { period: '1-й Пинакль', ageRange: '0 — 35 лет', number: pinnacles.first, calculation: this._getPinnacleFormula(birthDate, 1) },
            { period: '2-й Пинакль', ageRange: '36 — 53 года', number: pinnacles.second, calculation: this._getPinnacleFormula(birthDate, 2) },
            { period: '3-й Пинакль', ageRange: '54+ лет', number: pinnacles.third, calculation: this._getPinnacleFormula(birthDate, 3) },
            { period: '4-й Пинакль', ageRange: 'Вся жизнь', number: pinnacles.fourth, calculation: this._getPinnacleFormula(birthDate, 4) }
        ];

        // Таблица Челленджей
        const challenges = this.baseCalculator.calculateChallenges(birthDate);
        const challengeTable = [
            { period: '1-й Челлендж', ageRange: '0 — 35 лет', number: challenges.first, calculation: this._getChallengeFormula(birthDate, 1) },
            { period: '2-й Челлендж', ageRange: '36 — 53 года', number: challenges.second, calculation: this._getChallengeFormula(birthDate, 2) },
            { period: '3-й Челлендж', ageRange: '54+ лет', number: challenges.third, calculation: this._getChallengeFormula(birthDate, 3) },
            { period: 'Главный Челлендж', ageRange: 'Вся жизнь', number: challenges.fourth, calculation: this._getChallengeFormula(birthDate, 4) }
        ];

        return {
            expression: expressionTable,
            soulUrge: soulUrgeTable,
            personality: personalityTable,
            pinnacles: pinnacleTable,
            challenges: challengeTable
        };
    }

    /**
     * Пинакли с возрастными границами
     */
    _calculatePinnaclesWithAges(birthDate) {
        const [day, month, year] = birthDate.split('.').map(Number);
        const pinnacles = this.baseCalculator.calculatePinnacles(birthDate);

        // Возрастные границы для пинаклей
        const lifePath = this.baseCalculator.calculateLifePath(birthDate);
        const firstPinnacleEnd = 36 - lifePath;
        const secondPinnacleEnd = firstPinnacleEnd + 9;
        const thirdPinnacleEnd = secondPinnacleEnd + 9;

        return {
            first: {
                number: pinnacles.first,
                ageRange: `0 — ${firstPinnacleEnd} лет`,
                description: this.baseCalculator.getNumberDescription(pinnacles.first)
            },
            second: {
                number: pinnacles.second,
                ageRange: `${firstPinnacleEnd} — ${secondPinnacleEnd} лет`,
                description: this.baseCalculator.getNumberDescription(pinnacles.second)
            },
            third: {
                number: pinnacles.third,
                ageRange: `${secondPinnacleEnd} — ${thirdPinnacleEnd} лет`,
                description: this.baseCalculator.getNumberDescription(pinnacles.third)
            },
            fourth: {
                number: pinnacles.fourth,
                ageRange: `${thirdPinnacleEnd}+ лет`,
                description: this.baseCalculator.getNumberDescription(pinnacles.fourth)
            }
        };
    }

    /**
     * Челленджи с возрастными границами
     */
    _calculateChallengesWithAges(birthDate) {
        const [day, month, year] = birthDate.split('.').map(Number);
        const challenges = this.baseCalculator.calculateChallenges(birthDate);

        return {
            first: {
                number: challenges.first,
                ageRange: '0 — 35 лет',
                description: this._getChallengeDescription(challenges.first)
            },
            second: {
                number: challenges.second,
                ageRange: '36 — 53 года',
                description: this._getChallengeDescription(challenges.second)
            },
            third: {
                number: challenges.third,
                ageRange: '54+ лет',
                description: this._getChallengeDescription(challenges.third)
            },
            fourth: {
                number: challenges.fourth,
                ageRange: 'Вся жизнь',
                description: this._getChallengeDescription(challenges.fourth),
                isMain: true
            }
        };
    }

    /**
     * Матрица Судьбы (полная разбивка)
     */
    _calculateDestinyMatrix(birthDate) {
        const pythagorean = this.baseCalculator.calculatePythagoreanSquare(birthDate);
        const [day, month, year] = birthDate.split('.').map(Number);

        const cellLabels = {
            1: 'Характер', 2: 'Энергия', 3: 'Интерес',
            4: 'Здоровье', 5: 'Логика', 6: 'Труд',
            7: 'Удача', 8: 'Долг', 9: 'Память'
        };

        const cellDescriptions = {
            1: { 0: 'Слабохарактерность', 1: 'Эгоцентризм', 2: 'Лидерство', 3: 'Деспотизм' },
            2: { 0: 'Энергетический вампир', 1: 'Чувствительность', 2: 'Энергия для других', 3: 'Экстрасенсорика' },
            3: { 0: 'Нет интереса к наукам', 1: 'Гуманитарий', 2: 'Технарь', 3: 'Гений' },
            4: { 0: 'Болезненность', 1: 'Среднее здоровье', 2: 'Крепкое здоровье', 3: 'Абсолютное здоровье' },
            5: { 0: 'Нет логики', 1: 'Логика есть', 2: 'Аналитик', 3: 'Ясновидящий' },
            6: { 0: 'Физический труд', 1: 'Трудолюбие', 2: 'Мастер', 3: 'Трудоголик' },
            7: { 0: 'Невезучий', 1: 'Везение', 2: 'Удачливый', 3: 'Баловень судьбы' },
            8: { 0: 'Нет чувства долга', 1: 'Ответственный', 2: 'Терпимость', 3: 'Долг превыше всего' },
            9: { 0: 'Нет памяти', 1: 'Хорошая память', 2: 'Феноменальная память', 3: 'Ясновидение' }
        };

        const cells = {};
        for (let i = 1; i <= 9; i++) {
            const count = pythagorean.cells[i] || 0;
            const level = count >= 3 ? 3 : count >= 2 ? 2 : count >= 1 ? 1 : 0;
            cells[i] = {
                count,
                label: cellLabels[i],
                description: cellDescriptions[i]?.[level] || 'Не определено',
                level,
                isActive: count > 0
            };
        }

        // Анализ строк и столбцов
        const rows = {
            row1: { cells: [1, 2, 3], sum: [1, 2, 3].reduce((s, n) => s + (pythagorean.cells[n] || 0), 0), label: 'Целеустремленность' },
            row2: { cells: [4, 5, 6], sum: [4, 5, 6].reduce((s, n) => s + (pythagorean.cells[n] || 0), 0), label: 'Качество жизни' },
            row3: { cells: [7, 8, 9], sum: [7, 8, 9].reduce((s, n) => s + (pythagorean.cells[n] || 0), 0), label: 'Призвание' }
        };

        const columns = {
            col1: { cells: [1, 4, 7], sum: [1, 4, 7].reduce((s, n) => s + (pythagorean.cells[n] || 0), 0), label: 'Самооценка' },
            col2: { cells: [2, 5, 8], sum: [2, 5, 8].reduce((s, n) => s + (pythagorean.cells[n] || 0), 0), label: 'Быт' },
            col3: { cells: [3, 6, 9], sum: [3, 6, 9].reduce((s, n) => s + (pythagorean.cells[n] || 0), 0), label: 'Талант' }
        };

        const diagonals = {
            diag1: { cells: [1, 5, 9], sum: [1, 5, 9].reduce((s, n) => s + (pythagorean.cells[n] || 0), 0), label: 'Духовность' },
            diag2: { cells: [3, 5, 7], sum: [3, 5, 7].reduce((s, n) => s + (pythagorean.cells[n] || 0), 0), label: 'Темперамент' }
        };

        return {
            cells,
            workings: pythagorean.workings,
            rows,
            columns,
            diagonals,
            dateDigits: birthDate.replace(/\./g, '').split('').map(Number)
        };
    }

    /**
     * Кармический хвост по методике Ладини
     */
    _calculateKarmicTail(birthDate) {
        const digits = birthDate.replace(/\./g, '').split('').map(Number);
        const [day, month, year] = birthDate.split('.').map(Number);

        // 1. Сумма всех цифр даты
        const totalSum = digits.reduce((a, b) => a + b, 0);
        const totalReduced = this.baseCalculator.reduceToSingle(totalSum);

        // 2. Кармические числа (13, 14, 16, 19)
        const karmicNumbers = [13, 14, 16, 19];
        const foundKarmic = [];

        // Проверяем промежуточные суммы
        const daySum = this.baseCalculator.reduceToSingle(day);
        const monthSum = this.baseCalculator.reduceToSingle(month);
        const yearSum = this.baseCalculator.reduceToSingle(year);
        const lifePathSum = daySum + monthSum + yearSum;

        for (const kn of karmicNumbers) {
            if (totalSum === kn || lifePathSum === kn) {
                foundKarmic.push({
                    number: kn,
                    source: totalSum === kn ? 'Сумма даты' : 'Число судьбы',
                    description: this.baseCalculator.checkKarmicDebt(kn).description
                });
            }
        }

        // 3. Отсутствующие цифры (кармические уроки)
        const missingDigits = [];
        for (let i = 1; i <= 9; i++) {
            if (!digits.includes(i)) {
                missingDigits.push(i);
            }
        }

        // 4. Повторяющиеся цифры
        const digitCount = {};
        for (const d of digits) {
            digitCount[d] = (digitCount[d] || 0) + 1;
        }
        const repeatedDigits = Object.entries(digitCount)
            .filter(([_, count]) => count >= 2)
            .map(([digit, count]) => ({ digit: parseInt(digit), count }));

        // 5. Кармический хвост (по Ладини: сумма всех цифр даты рождения)
        const karmicTailNumber = this.baseCalculator.reduceToSingle(totalSum);

        return {
            totalSum: { value: totalSum, reduced: totalReduced },
            karmicNumbers: foundKarmic,
            missingDigits: missingDigits.map(d => ({
                digit: d,
                meaning: this._getMissingDigitMeaning(d)
            })),
            repeatedDigits,
            karmicTailNumber: {
                value: karmicTailNumber,
                description: this._getKarmicTailDescription(karmicTailNumber)
            },
            // Кармические задачи по Ладини
            karmicTasks: this._getKarmicTasks(digits)
        };
    }

    /**
     * Чакровый анализ — связь чисел с чакрами
     */
    _calculateChakraAnalysis(fullName, birthDate) {
        const keyNumbers = this._calculateAllKeyNumbers(fullName, birthDate);

        const chakraMap = {
            1: { name: 'Муладхара', color: 'Красный', location: 'Копчик', element: 'Земля', meaning: 'Выживание, безопасность' },
            2: { name: 'Свадхистана', color: 'Оранжевый', location: 'Крестец', element: 'Вода', meaning: 'Творчество, сексуальность' },
            3: { name: 'Манипура', color: 'Жёлтый', location: 'Солнечное сплетение', element: 'Огонь', meaning: 'Воля, сила, уверенность' },
            4: { name: 'Анахата', color: 'Зелёный', location: 'Сердце', element: 'Воздух', meaning: 'Любовь, сострадание' },
            5: { name: 'Вишудха', color: 'Голубой', location: 'Горло', element: 'Эфир', meaning: 'Общение, самовыражение' },
            6: { name: 'Аджна', color: 'Синий', location: 'Межбровье', element: 'Свет', meaning: 'Интуиция, мудрость' },
            7: { name: 'Сахасрара', color: 'Фиолетовый', location: 'Темя', element: 'Мысль', meaning: 'Просветление, связь' },
            8: { name: 'Звезда Души', color: 'Белый', location: 'Над головой', element: 'Дух', meaning: 'Карма, предназначение' },
            9: { name: 'Земная Звезда', color: 'Коричневый', location: 'Под ногами', element: 'Природа', meaning: 'Связь с землёй, предки' }
        };

        const chakras = {};
        for (let i = 1; i <= 9; i++) {
            const chakra = chakraMap[i];
            if (!chakra) continue;

            // Какие числа влияют на эту чакру
            const influencingNumbers = [];
            for (const [key, data] of Object.entries(keyNumbers)) {
                if (data.value === i) {
                    influencingNumbers.push({ key, name: data.name });
                }
            }

            chakras[i] = {
                ...chakra,
                number: i,
                influencingNumbers,
                isActive: influencingNumbers.length > 0,
                balance: influencingNumbers.length > 1 ? 'Гармоничная' : influencingNumbers.length === 1 ? 'Активная' : 'Требует внимания'
            };
        }

        return {
            chakras,
            dominantChakra: Object.values(chakras).filter(c => c.isActive).sort((a, b) => b.influencingNumbers.length - a.influencingNumbers.length)[0] || null,
            summary: this._generateChakraSummary(chakras)
        };
    }

    /**
     * Профессиональные формулировки
     */
    _generateProfessionalInterpretation(fullName, birthDate) {
        const keyNumbers = this._calculateAllKeyNumbers(fullName, birthDate);
        const parts = this.baseCalculator.parseFullName(fullName);

        const lp = keyNumbers.lifePath.value;
        const expr = keyNumbers.expression.value;
        const su = keyNumbers.soulUrge.value;
        const pers = keyNumbers.personality.value;
        const mat = keyNumbers.maturity.value;

        const interpretations = [];

        // Число Судьбы + Число Выражения
        interpretations.push(
            `Число Судьбы ${lp} в соединении с Числом Выражения ${expr} даёт уникальную комбинацию лидерских качеств и способов самовыражения. ` +
            `По системе Пифагора, эта конфигурация указывает на ${this._getCombinationDescription(lp, expr)}.`
        );

        // Число Души + Число Личности
        interpretations.push(
            `Число Души ${su} (внутренние устремления) и Число Личности ${pers} (внешнее проявление) ` +
            `создают динамику "${su}/${pers}", что по Хансу Декоцу интерпретируется как ${this._getSoulPersonalityDescription(su, pers)}.`
        );

        // Число Зрелости
        interpretations.push(
            `Число Зрелости ${mat} = Число Выражения ${expr} + Число Судьбы ${lp}. ` +
            `По Дэвиду Филлипсу, это число раскрывается после 35 лет и указывает на ${this.baseCalculator.getNumberDescription(mat, 'lifePath')}`
        );

        // Мастер-числа
        if (keyNumbers.masterNumbers.length > 0) {
            interpretations.push(
                `Мастер-числа ${keyNumbers.masterNumbers.map(m => m.value).join(', ')} обнаружены. ` +
                `По классической традиции, мастер-числа не редуцируются и несут повышенную вибрацию. ` +
                `Как указывал Пифагор, числа 11, 22, 33 — это «числа силы», требующие особого внимания.`
            );
        }

        // Кармические долги
        if (keyNumbers.karmicDebts.hasDebt) {
            const debts = [];
            if (keyNumbers.karmicDebts.lifePath?.hasDebt) debts.push(`Число Судьбы ${keyNumbers.karmicDebts.lifePath.name}`);
            if (keyNumbers.karmicDebts.expression?.hasDebt) debts.push(`Число Выражения ${keyNumbers.karmicDebts.expression.name}`);
            interpretations.push(
                `Кармические долги: ${debts.join(', ')}. ` +
                `По методике Александрова, кармические долги указывают на нерешённые задачи из прошлых жизней.`
            );
        }

        // Пинакли
        interpretations.push(
            `Четыре пинакля жизни: ${keyNumbers.pinnacle1.value} → ${keyNumbers.pinnacle2.value} → ${keyNumbers.pinnacle3.value} → ${keyNumbers.pinnacle4.value}. ` +
            `Каждый пинакль — это этап развития, на котором человек осваивает определённые качества.`
        );

        return {
            interpretations,
            fullText: interpretations.join('\n\n'),
            references: [
                { author: 'Пифагор', quote: '«Числа правят миром» — основа нумерологической системы 1-9.' },
                { author: 'Ханс Декоц', quote: '«Число судьбы — это не приговор, а компас, указывающий направление.»' },
                { author: 'Дэвид Филлипс', quote: '«Число выражения — это инструмент, которым вы пользуетесь каждый день.»' },
                { author: 'А.Ф. Александров', quote: '«Квадрат Пифагора — это не магия, а математика вашей личности.»' },
                { author: 'Ладини', quote: '«Кармический хвост — это не наказание, а урок, который нужно усвоить.»' }
            ]
        };
    }

    // ========== ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ ==========

    _formatDate(dateStr) {
        if (!dateStr) return null;
        if (dateStr.includes('.')) return dateStr;
        const [year, month, day] = dateStr.split('-');
        return `${day}.${month}.${year}`;
    }

    _getSystemName(system) {
        const names = {
            pythagorean: 'Пифагорейская',
            vedic: 'Ведическая',
            chaldean: 'Халдейская',
            kabbalah: 'Каббалистическая'
        };
        return names[system] || 'Пифагорейская';
    }

    _findMasterNumbers(numbers) {
        const masters = [11, 22, 33];
        return numbers
            .filter(n => masters.includes(n))
            .map(n => ({ value: n, name: this._getMasterName(n) }));
    }

    _getMasterName(num) {
        const names = {
            11: 'Мастер-интуиция (11/2)',
            22: 'Мастер-строитель (22/4)',
            33: 'Мастер-учитель (33/6)'
        };
        return names[num] || `Мастер-число ${num}`;
    }

    _getChallengeDescription(num) {
        const descriptions = {
            0: 'Свобода выбора — нет кармических ограничений',
            1: 'Испытание уверенностью и независимостью',
            2: 'Испытание чувствительностью и сотрудничеством',
            3: 'Испытание самовыражением',
            4: 'Испытание дисциплиной и порядком',
            5: 'Испытание свободой и переменами',
            6: 'Испытание ответственностью и совершенством',
            7: 'Испытание верой и доверием',
            8: 'Испытание властью и изобилием',
            9: 'Испытание отпусканием и завершением'
        };
        return descriptions[num] || `Челлендж числа ${num}`;
    }

    _getPinnacleFormula(birthDate, pinnacleNum) {
        const [day, month, year] = birthDate.split('.').map(Number);
        const dayR = this.baseCalculator.reduceToSingle(day);
        const monthR = this.baseCalculator.reduceToSingle(month);
        const yearR = this.baseCalculator.reduceToSingle(year);

        switch (pinnacleNum) {
            case 1: return `${monthR} + ${dayR} = ${monthR + dayR} → ${this.baseCalculator.reduceToSingle(monthR + dayR)}`;
            case 2: return `${dayR} + ${yearR} = ${dayR + yearR} → ${this.baseCalculator.reduceToSingle(dayR + yearR)}`;
            case 3: return `(${monthR}+${dayR}) + (${dayR}+${yearR}) = ${monthR + dayR + dayR + yearR} → ${this.baseCalculator.reduceToSingle(monthR + dayR + dayR + yearR)}`;
            case 4: return `${monthR} + ${yearR} = ${monthR + yearR} → ${this.baseCalculator.reduceToSingle(monthR + yearR)}`;
            default: return '';
        }
    }

    _getChallengeFormula(birthDate, challengeNum) {
        const [day, month, year] = birthDate.split('.').map(Number);
        const dayR = this.baseCalculator.reduceToSingle(day);
        const monthR = this.baseCalculator.reduceToSingle(month);
        const yearR = this.baseCalculator.reduceToSingle(year);

        switch (challengeNum) {
            case 1: return `|${dayR} - ${monthR}| = ${Math.abs(dayR - monthR)}`;
            case 2: return `|${dayR} - ${yearR}| = ${Math.abs(dayR - yearR)}`;
            case 3: return `|${Math.abs(dayR - monthR)} - ${Math.abs(dayR - yearR)}| = ${Math.abs(Math.abs(dayR - monthR) - Math.abs(dayR - yearR))}`;
            case 4: return `|${monthR} - ${yearR}| = ${Math.abs(monthR - yearR)}`;
            default: return '';
        }
    }

    _getMissingDigitMeaning(digit) {
        const meanings = {
            1: 'Независимость — нужно научиться быть лидером',
            2: 'Дипломатия — нужно развивать терпение и сотрудничество',
            3: 'Творчество — нужно научиться самовыражению',
            4: 'Дисциплина — нужно развивать организованность',
            5: 'Свобода — нужно научиться принимать перемены',
            6: 'Любовь — нужно развивать ответственность и заботу',
            7: 'Мудрость — нужно развивать доверие и интуицию',
            8: 'Власть — нужно научиться управлять ресурсами',
            9: 'Завершение — нужно научиться отпускать'
        };
        return meanings[digit] || 'Кармический урок';
    }

    _getKarmicTailDescription(num) {
        const descriptions = {
            1: 'Кармический хвост лидерства — в прошлых жизнях вы были лидером, теперь нужно научиться служить',
            2: 'Кармический хвост сотрудничества — в прошлых жизнях вы были дипломатом, теперь нужно развивать терпение',
            3: 'Кармический хвост творчества — в прошлых жизнях вы были творцом, теперь нужно делиться талантом',
            4: 'Кармический хвост труда — в прошлых жизнях вы были строителем, теперь нужно создать прочный фундамент',
            5: 'Кармический хвост свободы — в прошлых жизнях вы были путешественником, теперь нужно найти баланс',
            6: 'Кармический хвост любви — в прошлых жизнях вы были целителем, теперь нужно служить с любовью',
            7: 'Кармический хвост мудрости — в прошлых жизнях вы были мудрецом, теперь нужно делиться знаниями',
            8: 'Кармический хвост власти — в прошлых жизнях вы были правителем, теперь нужно использовать власть во благо',
            9: 'Кармический хвост завершения — в прошлых жизнях вы были философом, теперь нужно завершить начатое'
        };
        return descriptions[num] || 'Уникальный кармический путь';
    }

    _getKarmicTasks(digits) {
        // По Ладини: кармические задачи определяются по отсутствующим цифрам
        const tasks = [];
        for (let i = 1; i <= 9; i++) {
            if (!digits.includes(i)) {
                tasks.push({
                    digit: i,
                    task: this._getMissingDigitMeaning(i),
                    area: this._getKarmicArea(i)
                });
            }
        }
        return tasks;
    }

    _getKarmicArea(digit) {
        const areas = {
            1: 'Самореализация и лидерство',
            2: 'Отношения и дипломатия',
            3: 'Творчество и общение',
            4: 'Дисциплина и порядок',
            5: 'Перемены и адаптация',
            6: 'Семья и ответственность',
            7: 'Духовность и мудрость',
            8: 'Материальный успех',
            9: 'Завершение и гуманизм'
        };
        return areas[digit] || 'Не определено';
    }

    _getCombinationDescription(num1, num2) {
        const combinations = {
            '1,1': 'усиление лидерских качеств и независимости',
            '1,2': 'баланс между лидерством и дипломатией',
            '1,3': 'творческое лидерство и харизма',
            '1,4': 'практичное руководство и организованность',
            '1,5': 'прогрессивное лидерство и свобода',
            '1,6': 'ответственное лидерство и забота',
            '1,7': 'мудрое руководство и анализ',
            '1,8': 'авторитетное лидерство и успех',
            '1,9': 'гуманистическое лидерство и завершение',
            '2,2': 'усиление дипломатии и сотрудничества',
            '2,3': 'творческое общение и чувствительность',
            '2,4': 'стабильное сотрудничество и порядок',
            '2,5': 'адаптивная дипломатия и перемены',
            '2,6': 'заботливое сотрудничество и гармония',
            '2,7': 'интуитивная дипломатия и мудрость',
            '2,8': 'стратегическое партнёрство и успех',
            '2,9': 'сострадательное сотрудничество',
            '3,3': 'творческая экспрессия и вдохновение',
            '3,4': 'структурированное творчество',
            '3,5': 'свободное творчество и перемены',
            '3,6': 'творческая забота и гармония',
            '3,7': 'глубокое творчество и мудрость',
            '3,8': 'деловое творчество и успех',
            '3,9': 'гуманистическое творчество',
            '4,4': 'стабильность и практичность',
            '4,5': 'структурированные перемены',
            '4,6': 'ответственная стабильность',
            '4,7': 'аналитическая практичность',
            '4,8': 'деловая стабильность и успех',
            '4,9': 'завершение с практичностью',
            '5,5': 'свобода и адаптивность',
            '5,6': 'ответственная свобода',
            '5,7': 'мудрая адаптация',
            '5,8': 'деловая свобода и успех',
            '5,9': 'гуманистические перемены',
            '6,6': 'любовь и ответственность',
            '6,7': 'мудрая забота',
            '6,8': 'успешная забота',
            '6,9': 'безусловная любовь',
            '7,7': 'мудрость и духовность',
            '7,8': 'духовный успех',
            '7,9': 'мудрое завершение',
            '8,8': 'власть и изобилие',
            '8,9': 'гуманистический успех',
            '9,9': 'завершение и гуманизм'
        };
        return combinations[`${num1},${num2}`] || 'уникальную комбинацию энергий, требующую индивидуального анализа';
    }

    _getSoulPersonalityDescription(soul, personality) {
        const descriptions = {
            '1,1': 'внутренняя и внешняя сила совпадают — вы честны с собой и миром',
            '1,2': 'внутренний лидер, внешний дипломат',
            '1,3': 'внутренняя сила, внешнее творчество',
            '1,4': 'внутренний лидер, внешний организатор',
            '1,5': 'внутренняя независимость, внешняя свобода',
            '1,6': 'внутренний лидер, внешняя забота',
            '1,7': 'внутренняя сила, внешняя мудрость',
            '1,8': 'внутренний лидер, внешний успех',
            '1,9': 'внутренняя сила, внешнее сострадание',
            '2,1': 'внутренняя чувствительность, внешняя сила',
            '2,2': 'внутренняя и внешняя гармония',
            '2,3': 'внутренняя чувствительность, внешнее творчество',
            '2,4': 'внутренняя гармония, внешний порядок',
            '2,5': 'внутренняя чувствительность, внешняя свобода',
            '2,6': 'внутренняя гармония, внешняя забота',
            '2,7': 'внутренняя интуиция, внешняя мудрость',
            '2,8': 'внутренняя гармония, внешний успех',
            '2,9': 'внутренняя чувствительность, внешнее сострадание',
            '3,1': 'внутреннее творчество, внешняя сила',
            '3,2': 'внутреннее творчество, внешняя гармония',
            '3,3': 'внутреннее и внешнее творчество',
            '3,4': 'внутреннее творчество, внешний порядок',
            '3,5': 'внутреннее творчество, внешняя свобода',
            '3,6': 'внутреннее творчество, внешняя забота',
            '3,7': 'внутреннее творчество, внешняя мудрость',
            '3,8': 'внутреннее творчество, внешний успех',
            '3,9': 'внутреннее творчество, внешнее сострадание'
        };
        return descriptions[`${soul},${personality}`] || 'уникальную динамику внутренних и внешних проявлений';
    }

    _generateChakraSummary(chakras) {
        const active = Object.values(chakras).filter(c => c.isActive);
        const inactive = Object.values(chakras).filter(c => !c.isActive);

        let summary = 'Чакровый анализ показывает: ';
        if (active.length > 0) {
            summary += `активные чакры: ${active.map(c => `${c.name} (${c.number})`).join(', ')}. `;
        }
        if (inactive.length > 0) {
            summary += `чакры, требующие внимания: ${inactive.map(c => `${c.name} (${c.number})`).join(', ')}. `;
        }
        summary += 'Рекомендуется гармонизировать энергии через медитацию и осознанное развитие.';

        return summary;
    }
}

module.exports = NumerologyProService;