// services/numerology/baseCalculator.js

/**
 * Базовый калькулятор для нумерологии
 * Содержит основные функции редукции чисел и расчета базовых значений
 * Использует классическую пифагорейскую систему соответствия букв и цифр
 */
class BaseCalculator {
    constructor(system = 'pythagorean') {
        this.system = system;
        this.letterMap = this.getLetterMap(system);
        
        // Доступные системы
        this.systems = {
            pythagorean: {
                name: 'Пифагорейская',
                description: 'Классическая западная нумерология (1-9)',
                letterMap: this.getPythagoreanMap()
            },
            vedic: {
                name: 'Ведическая',
                description: 'Индийская нумерология на санскрите',
                letterMap: this.getVedicMap()
            },
            chaldean: {
                name: 'Халдейская',
                description: 'Древняя халдейская система (без числа 9)',
                letterMap: this.getChaldeanMap()
            },
            kabbalah: {
                name: 'Каббалистическая',
                description: 'Еврейская каббалистическая система',
                letterMap: this.getKabbalahMap()
            }
        };
    }

    /**
     * Получение карты букв для выбранной системы
     */
    getLetterMap(system) {
        const maps = {
            pythagorean: this.getPythagoreanMap(),
            vedic: this.getVedicMap(),
            chaldean: this.getChaldeanMap(),
            kabbalah: this.getKabbalahMap()
        };
        return maps[system] || maps.pythagorean;
    }

    /**
     * Пифагорейская система для русского алфавита (наиболее распространённая)
     * Буквы распределены по числам 1-9 циклически
     */
    getPythagoreanMap() {
        return {
            'а': 1, 'б': 2, 'в': 3, 'г': 4, 'д': 5, 'е': 6, 'ё': 7, 'ж': 8, 'з': 9,
            'и': 1, 'й': 2, 'к': 3, 'л': 4, 'м': 5, 'н': 6, 'о': 7, 'п': 8, 'р': 9,
            'с': 1, 'т': 2, 'у': 3, 'ф': 4, 'х': 5, 'ц': 6, 'ч': 7, 'ш': 8, 'щ': 9,
            'ъ': 1, 'ы': 2, 'ь': 3, 'э': 4, 'ю': 5, 'я': 6
        };
    }

    /**
     * Ведическая система (для справки)
     */
    getVedicMap() {
        return {
            'а': 1, 'б': 2, 'в': 3, 'г': 4, 'д': 5, 'е': 6, 'ё': 7, 'ж': 8, 'з': 9,
            'и': 1, 'й': 2, 'к': 3, 'л': 4, 'м': 5, 'н': 6, 'о': 7, 'п': 8, 'р': 9,
            'с': 1, 'т': 2, 'у': 3, 'ф': 4, 'х': 5, 'ц': 6, 'ч': 7, 'ш': 8, 'щ': 9,
            'ъ': 1, 'ы': 2, 'ь': 3, 'э': 4, 'ю': 5, 'я': 6
        };
    }

    /**
     * Халдейская система (без числа 9)
     */
    getChaldeanMap() {
        return {
            'а': 1, 'б': 2, 'в': 3, 'г': 4, 'д': 5, 'е': 6, 'ё': 7, 'ж': 8, 'з': 1,
            'и': 2, 'й': 3, 'к': 4, 'л': 5, 'м': 6, 'н': 7, 'о': 8, 'п': 1, 'р': 2,
            'с': 3, 'т': 4, 'у': 5, 'ф': 6, 'х': 7, 'ц': 8, 'ч': 1, 'ш': 2, 'щ': 3,
            'ъ': 4, 'ы': 5, 'ь': 6, 'э': 7, 'ю': 8, 'я': 1
        };
    }

    /**
     * Каббалистическая система
     */
    getKabbalahMap() {
        return {
            'а': 1, 'б': 2, 'в': 3, 'г': 4, 'д': 5, 'е': 6, 'ё': 7, 'ж': 8, 'з': 9,
            'и': 10, 'й': 20, 'к': 30, 'л': 40, 'м': 50, 'н': 60, 'о': 70, 'п': 80, 'р': 90,
            'с': 100, 'т': 200, 'у': 300, 'ф': 400, 'х': 500, 'ц': 600, 'ч': 700, 'ш': 800, 'щ': 900,
            'ъ': 1000, 'ы': 2000, 'ь': 3000, 'э': 4000, 'ю': 5000, 'я': 6000
        };
    }

    /**
     * Редукция до однозначного числа с сохранением мастер-чисел
     * @param {number} num - исходное число
     * @param {boolean} preserveMasters - сохранять мастер-числа (11, 22, 33)
     * @returns {number} редуцированное число
     */
    reduceToSingle(num, preserveMasters = true) {
        const masters = preserveMasters ? [11, 22, 33] : [];
        
        // Если число уже мастер-число — возвращаем
        if (masters.includes(num)) return num;
        
        // Редуцируем до однозначного или мастер-числа
        while (num > 9) {
            if (masters.includes(num)) return num;
            num = String(num).split('').reduce((s, d) => s + parseInt(d), 0);
        }
        return num;
    }

    /**
     * Редукция до диапазона 1-22 (для старших арканов Таро)
     * @param {number} num - исходное число
     * @param {number} maxRange - максимальный диапазон
     * @returns {number} редуцированное число
     */
    reduceToRange(num, maxRange = 22) {
        if (num >= 1 && num <= maxRange) return num;
        
        while (num > maxRange) {
            num = String(num).split('').reduce((s, d) => s + parseInt(d), 0);
            if (num >= 1 && num <= maxRange) return num;
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
        return sum;
    }

    /**
     * Вычисление числа судьбы (Life Path Number) — КЛАССИЧЕСКИЙ МЕТОД
     * День, месяц и год редуцируются отдельно, затем складываются
     * @param {string} birthDate - дата в формате ДД.ММ.ГГГГ
     * @returns {number} число судьбы
     */
    calculateLifePath(birthDate) {
        const [day, month, year] = birthDate.split('.').map(Number);
        
        // Редуцируем каждую часть отдельно (сохраняя мастер-числа)
        const dayReduced = this.reduceToSingle(day);
        const monthReduced = this.reduceToSingle(month);
        const yearReduced = this.reduceToSingle(year);
        
        // Складываем и редуцируем итог
        const total = dayReduced + monthReduced + yearReduced;
        return this.reduceToSingle(total);
    }

    /**
     * Вычисление числа дня рождения (Birth Day Number)
     * Просто редуцированный день рождения
     * @param {string} birthDate - дата в формате ДД.ММ.ГГГГ
     * @returns {number} число дня рождения
     */
    calculateBirthDay(birthDate) {
        const day = parseInt(birthDate.split('.')[0]);
        return this.reduceToSingle(day);
    }

    /**
     * Вычисление числа выражения (Expression Number) — сумма всех букв ФИО
     * @param {string} fullName - полное имя
     * @returns {number} число выражения
     */
    calculateExpression(fullName) {
        const parts = this.parseFullName(fullName);
        const total = this.calculateWordValue(parts.surname) + 
                      this.calculateWordValue(parts.firstName) + 
                      this.calculateWordValue(parts.patronymic);
        return this.reduceToSingle(total);
    }

    /**
     * Вычисление числа души (Soul Urge Number) — только гласные
     * @param {string} fullName - полное имя
     * @returns {number} число души
     */
    calculateSoulUrge(fullName) {
        const vowels = 'аеёиоуыэюя';
        const cleaned = fullName.toLowerCase().replace(/[^а-яё]/g, '');
        let sum = 0;
        for (const char of cleaned) {
            if (vowels.includes(char)) {
                sum += this.letterMap[char] || 0;
            }
        }
        return this.reduceToSingle(sum);
    }

    /**
     * Вычисление числа личности (Personality Number) — только согласные
     * @param {string} fullName - полное имя
     * @returns {number} число личности
     */
    calculatePersonality(fullName) {
        const consonants = 'бвгджзйклмнпрстфхцчшщъь';
        const cleaned = fullName.toLowerCase().replace(/[^а-яё]/g, '');
        let sum = 0;
        for (const char of cleaned) {
            if (consonants.includes(char)) {
                sum += this.letterMap[char] || 0;
            }
        }
        return this.reduceToSingle(sum);
    }

    /**
     * Вычисление числа зрелости (Maturity Number) = Expression + Life Path
     * @param {number} expression - число выражения
     * @param {number} lifePath - число судьбы
     * @returns {number} число зрелости
     */
    calculateMaturity(expression, lifePath) {
        return this.reduceToSingle(expression + lifePath);
    }

    /**
     * Вычисление числа баланса (Balance Number) — сумма инициалов
     * @param {string} fullName - полное имя
     * @returns {number} число баланса
     */
    calculateBalance(fullName) {
        const parts = this.parseFullName(fullName);
        const initials = (parts.surname[0] || '') + (parts.firstName[0] || '') + (parts.patronymic[0] || '');
        return this.reduceToSingle(this.calculateWordValue(initials));
    }

    /**
     * Вычисление числа скрытой страсти (Hidden Passion Number)
     * Самая часто встречающаяся цифра в ФИО
     * @param {string} fullName - полное имя
     * @returns {Object} число и количество повторений
     */
    calculateHiddenPassion(fullName) {
        const cleaned = fullName.toLowerCase().replace(/[^а-яё]/g, '');
        const digitCount = {};
        
        for (const char of cleaned) {
            const num = this.letterMap[char];
            if (num) {
                digitCount[num] = (digitCount[num] || 0) + 1;
            }
        }
        
        let maxCount = 0;
        let passionNumber = null;
        for (const [num, count] of Object.entries(digitCount)) {
            if (count > maxCount) {
                maxCount = count;
                passionNumber = parseInt(num);
            }
        }
        
        return {
            number: this.reduceToSingle(passionNumber || 0),
            count: maxCount,
            digitCount
        };
    }

    /**
     * Проверка кармического долга
     * @param {number} number - проверяемое число
     * @returns {Object} информация о кармическом долге
     */
    checkKarmicDebt(number) {
        const debts = {
            13: { hasDebt: true, name: '13/4', description: 'Кармический долг лени и безответственности в прошлых жизнях. Необходимо научиться дисциплине и доводить дела до конца.' },
            14: { hasDebt: true, name: '14/5', description: 'Кармический долг злоупотребления свободой. Необходимо найти баланс между свободой и ответственностью.' },
            16: { hasDebt: true, name: '16/7', description: 'Кармический долг разрушения любви и эгоизма. Необходимо научиться смирению и безусловной любви.' },
            19: { hasDebt: true, name: '19/1', description: 'Кармический долг злоупотребления властью. Необходимо служить другим, а не использовать их.' }
        };
        
        return debts[number] || { hasDebt: false, name: null, description: null };
    }

    /**
     * Расчёт 4 пинаклей (Pinnacles) — жизненных этапов
     * @param {string} birthDate - дата в формате ДД.ММ.ГГГГ
     * @returns {Object} 4 пинакля
     */
    calculatePinnacles(birthDate) {
        const [day, month, year] = birthDate.split('.').map(Number);
        const dayR = this.reduceToSingle(day);
        const monthR = this.reduceToSingle(month);
        const yearR = this.reduceToSingle(year);
        
        // 1-й пинакль: месяц + день (от рождения до ~35 лет)
        const first = this.reduceToSingle(monthR + dayR);
        
        // 2-й пинакль: день + год (~35-44 лет)
        const second = this.reduceToSingle(dayR + yearR);
        
        // 3-й пинакль: сумма 1-го и 2-го (~44-53 лет)
        const third = this.reduceToSingle(first + second);
        
        // 4-й пинакль: месяц + год (53+ лет)
        const fourth = this.reduceToSingle(monthR + yearR);
        
        return { first, second, third, fourth };
    }

    /**
     * Расчёт 4 челленджей (Challenges) — испытаний
     * @param {string} birthDate - дата в формате ДД.ММ.ГГГГ
     * @returns {Object} 4 челленджа
     */
    calculateChallenges(birthDate) {
        const [day, month, year] = birthDate.split('.').map(Number);
        const dayR = this.reduceToSingle(day);
        const monthR = this.reduceToSingle(month);
        const yearR = this.reduceToSingle(year);
        
        const first = Math.abs(dayR - monthR);
        const second = Math.abs(dayR - yearR);
        const third = Math.abs(first - second);
        const fourth = Math.abs(monthR - yearR);
        
        return {
            first,   // 0-35 лет
            second,  // 36-53 года
            third,   // 54+
            fourth,  // Основной
            main: fourth
        };
    }

    /**
     * Расчёт квадрата Пифагора (Психоматрица)
     * @param {string} birthDate - дата в формате ДД.ММ.ГГГГ
     * @returns {Object} ячейки квадрата и рабочие числа
     */
    calculatePythagoreanSquare(birthDate) {
        const [day, month, year] = birthDate.split('.').map(Number);
        
        // 1-е рабочее число: сумма всех цифр даты
        const digits = birthDate.replace(/\./g, '').split('').map(Number);
        const first = digits.reduce((a, b) => a + b, 0);
        
        // 2-е рабочее число: сумма цифр 1-го
        const second = String(first).split('').reduce((a, b) => a + parseInt(b), 0);
        
        // 3-е рабочее число: 1-е минус удвоенная первая цифра дня
        const firstDayDigit = day > 9 ? parseInt(String(day)[0]) : day;
        const third = first - firstDayDigit * 2;
        
        // 4-е рабочее число: сумма цифр 3-го
        const fourth = String(Math.abs(third)).split('').reduce((a, b) => a + parseInt(b), 0);
        
        // Ячейки квадрата
        const allDigits = [
            ...String(day).split(''),
            ...String(month).split(''),
            ...String(year).split(''),
            ...String(first).split(''),
            ...String(second).split(''),
            ...String(Math.abs(third)).split(''),
            ...String(fourth).split('')
        ].map(Number);
        
        const cells = {
            1: allDigits.filter(d => d === 1).length,  // Характер
            2: allDigits.filter(d => d === 2).length,  // Энергия
            3: allDigits.filter(d => d === 3).length,  // Интерес
            4: allDigits.filter(d => d === 4).length,  // Здоровье
            5: allDigits.filter(d => d === 5).length,  // Логика
            6: allDigits.filter(d => d === 6).length,  // Труд
            7: allDigits.filter(d => d === 7).length,  // Удача
            8: allDigits.filter(d => d === 8).length,  // Долг
            9: allDigits.filter(d => d === 9).length   // Память
        };
        
        return {
            cells,
            workings: { first, second, third: Math.abs(third), fourth }
        };
    }

    /**
     * Расчёт личного года (Personal Year)
     * @param {string} birthDate - дата в формате ДД.ММ.ГГГГ
     * @param {number} targetYear - целевой год
     * @returns {number} число личного года
     */
    calculatePersonalYear(birthDate, targetYear) {
        const day = parseInt(birthDate.split('.')[0]);
        const month = parseInt(birthDate.split('.')[1]);
        const dayR = this.reduceToSingle(day);
        const monthR = this.reduceToSingle(month);
        const yearR = this.reduceToSingle(targetYear);
        
        return this.reduceToSingle(dayR + monthR + yearR);
    }

    /**
     * Расчёт личного месяца (Personal Month)
     * @param {number} personalYear - число личного года
     * @param {number} month - номер месяца (1-12)
     * @returns {number} число личного месяца
     */
    calculatePersonalMonth(personalYear, month) {
        return this.reduceToSingle(personalYear + month);
    }

    /**
     * Расчёт личного дня (Personal Day)
     * @param {number} personalMonth - число личного месяца
     * @param {number} day - номер дня
     * @returns {number} число личного дня
     */
    calculatePersonalDay(personalMonth, day) {
        return this.reduceToSingle(personalMonth + day);
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

    /**
     * Получение описания для числа
     * @param {number} num - число
     * @param {string} type - тип числа
     * @returns {string} описание
     */
    getNumberDescription(num, type = 'general') {
        const descriptions = {
            general: {
                1: 'Лидерство, независимость, начало, инициатива',
                2: 'Гармония, сотрудничество, баланс, дипломатия',
                3: 'Творчество, самовыражение, радость, общение',
                4: 'Стабильность, порядок, труд, дисциплина',
                5: 'Свобода, перемены, приключения, адаптивность',
                6: 'Ответственность, любовь, семья, забота',
                7: 'Мудрость, духовность, анализ, интуиция',
                8: 'Власть, успех, изобилие, материальность',
                9: 'Завершение, гуманизм, мудрость, сострадание',
                11: 'Просветление, интуиция, вдохновение, духовный учитель',
                22: 'Мастер-строитель, глобальные проекты, практическая мудрость',
                33: 'Мастер-учитель, безусловная любовь, служение человечеству'
            },
            lifePath: {
                1: 'Ваш путь — быть лидером и первопроходцем. Вы здесь, чтобы научиться самостоятельности и смелости.',
                2: 'Ваш путь — дипломатия и сотрудничество. Вы здесь, чтобы научиться терпению и гармонии.',
                3: 'Ваш путь — творчество и радость. Вы здесь, чтобы выражать себя и вдохновлять других.',
                4: 'Ваш путь — труд и стабильность. Вы здесь, чтобы построить прочный фундамент.',
                5: 'Ваш путь — свобода и перемены. Вы здесь, чтобы познать многогранность жизни.',
                6: 'Ваш путь — любовь и ответственность. Вы здесь, чтобы заботиться о других.',
                7: 'Ваш путь — мудрость и духовность. Вы здесь, чтобы познать глубины бытия.',
                8: 'Ваш путь — власть и изобилие. Вы здесь, чтобы научиться управлять материальным миром.',
                9: 'Ваш путь — завершение и гуманизм. Вы здесь, чтобы отдавать и завершать циклы.',
                11: 'Ваш путь — духовное просветление. Вы здесь, чтобы нести свет и вдохновение.',
                22: 'Ваш путь — великие свершения. Вы здесь, чтобы воплощать мечты в реальность.',
                33: 'Ваш путь — безусловная любовь. Вы здесь, чтобы исцелять и учить.'
            }
        };
        
        return descriptions[type]?.[num] || descriptions.general[num] || `Число ${num} — уникальная вибрация`;
    }
}

module.exports = BaseCalculator;