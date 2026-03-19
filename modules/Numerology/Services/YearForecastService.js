// modules/Numerology/Services/YearForecastService.js

const NumerologyService = require('../../../services/numerology');
const TarotService = require('../../../services/tarotService');

class YearForecastService {
    constructor() {
        this.numerologyService = new NumerologyService();
        this.tarotService = new TarotService();
    }

    /**
     * Преобразование даты из YYYY-MM-DD в DD.MM.YYYY
     */
    formatDateForCalculation(dateStr) {
        if (!dateStr) return null;
        if (dateStr.includes('.')) return dateStr;
        if (dateStr.includes('-')) {
            const [year, month, day] = dateStr.split('-');
            return `${day}.${month}.${year}`;
        }
        return dateStr;
    }

    /**
     * Форматирование даты для отображения
     */
    formatDate(d) {
        if (!d) return '';
        if (typeof d === 'string' && d.includes('-')) {
            const [year, month, day] = d.split('-');
            return `${day}.${month}.${year}`;
        }
        if (d instanceof Date) {
            return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
        }
        return d;
    }

    /**
     * Редукция числа
     */
    reduceNumber(num) {
        if (num === null || num === undefined || isNaN(num)) return null;
        if (num === 11 || num === 22) return num;
        while (num > 9) {
            num = String(num).split('').reduce((sum, digit) => sum + parseInt(digit), 0);
        }
        return num;
    }

    /**
     * Полный расчет годового прогноза
     */
    async calculateYearForecast(fullName, birthDate, targetDate, userId = null) {
        try {
            console.log('📥 YearForecastService received:', { fullName, birthDate, targetDate, userId });

            const nameParts = fullName.trim().split(/\s+/);
            const [surname, firstName, patronymic] = nameParts;

            const formattedBirthDate = this.formatDateForCalculation(birthDate);

            // Извлекаем год из targetDate
            let year = null;
            if (targetDate) {
                if (typeof targetDate === 'string') {
                    // Пробуем разные форматы
                    if (targetDate.includes('-')) {
                        const parts = targetDate.split('-');
                        // Ищем первое число, похожее на год (4 цифры)
                        for (const part of parts) {
                            if (part && part.length === 4 && !isNaN(parseInt(part))) {
                                year = parseInt(part);
                                break;
                            }
                        }
                    } else if (targetDate.includes('.')) {
                        const parts = targetDate.split('.');
                        for (const part of parts) {
                            if (part && part.length === 4 && !isNaN(parseInt(part))) {
                                year = parseInt(part);
                                break;
                            }
                        }
                    } else if (targetDate.length === 4 && !isNaN(parseInt(targetDate))) {
                        year = parseInt(targetDate);
                    }
                }
            }

            // Если год не найден, используем текущий
            if (!year) {
                year = new Date().getFullYear();
            }

            console.log('📅 Extracted year:', year);

            // Получаем базовую нумерологию человека
            const numerology = this.numerologyService.calculate(surname, firstName, patronymic, formattedBirthDate);

            const personNumbers = {
                fate: numerology.base.fate || 1,
                name: numerology.base.name || 1,
                surname: numerology.base.surname || 1,
                patronymic: numerology.base.patronymic || 1
            };

            // Получаем информацию о годе
            const yearInfo = this.getYearInfo(year);

            // 1. ЧИСЛО ГОДА (основная вибрация года)
            const personalYearNumber = this.calculatePersonalYearNumber(year, personNumbers);

            // 2. УНИВЕРСАЛЬНОЕ ЧИСЛО ГОДА
            const universalYearNumber = yearInfo.universalYearNumber;

            // 3. ЦИКЛ ГОДА
            const yearCycle = this.getYearCycle(year, personNumbers.fate);

            // 4. СТИХИЯ ГОДА
            const chineseZodiac = this.getChineseZodiac(year);

            // 5. ПЛАНЕТА-ПОКРОВИТЕЛЬ
            const yearRuler = this.getYearRuler(personalYearNumber);

            // 6. ЭНЕРГЕТИЧЕСКИЙ ТИП
            const yearEnergy = this.getYearEnergy(personalYearNumber);

            // 7. ПОЛНЫЙ АНАЛИЗ
            const yearAnalysis = this.getYearAnalysis(personalYearNumber, universalYearNumber, personNumbers);

            // 8. КВАРТАЛЬНАЯ РАЗБИВКА
            const quarterlyBreakdown = this.getQuarterlyBreakdown(year, personNumbers);

            // 9. МЕСЯЧНАЯ РАЗБИВКА
            const monthlyHighlights = this.getMonthlyHighlights(year, personNumbers);

            // 10. ВАЖНЫЕ ДАТЫ
            const importantDates = this.getImportantDates(year, personNumbers);

            // 11. КАРТА ТАРО
            const tarotCard = this.getYearTarot(personalYearNumber, universalYearNumber, personNumbers);

            // 12. ФЕН-ШУЙ
            const fengShui = this.getYearFengShui(personalYearNumber, chineseZodiac.element, personNumbers);

            // 13. ЦВЕТА
            const colors = this.getYearColors(personalYearNumber);

            // 14. КАМНИ
            const crystals = this.getYearCrystals(personalYearNumber);

            // 15. АРОМАТЫ
            const scents = this.getYearScents(personalYearNumber);

            // 16. АФФИРМАЦИЯ
            const affirmation = this.getYearAffirmation(personalYearNumber, personNumbers, firstName);

            // 17. ТЕМА ГОДА
            const yearTheme = this.getYearTheme(personalYearNumber);

            // 18. ИНТЕРПРЕТАЦИЯ
            const interpretation = this.generateYearInterpretation(
                fullName, year, personalYearNumber, universalYearNumber, yearAnalysis,
                quarterlyBreakdown, monthlyHighlights, importantDates, personNumbers, yearTheme
            );

            // 19. ГЛУБИННЫЙ ПОРТРЕТ
            const deepPortrait = this.generateYearDeepPortrait(
                fullName, year, personalYearNumber, yearEnergy, yearCycle,
                quarterlyBreakdown, personNumbers, tarotCard, chineseZodiac
            );

            return {
                success: true,
                data: {
                    fullName,
                    birthDate,
                    yearInfo: {
                        year: year,
                        yearNumber: universalYearNumber,
                        personalYearNumber: personalYearNumber,
                        universalYearNumber: universalYearNumber,
                        chineseZodiac: chineseZodiac
                    },
                    forecast: {
                        type: 'year',
                        year: year,
                        yearNumber: personalYearNumber,
                        universalYearNumber: universalYearNumber,
                        yearTheme: yearTheme,
                        yearCycle: yearCycle,
                        yearRuler: yearRuler,
                        yearEnergy: yearEnergy,
                        yearAnalysis: yearAnalysis,
                        quarterlyBreakdown: quarterlyBreakdown,
                        monthlyHighlights: monthlyHighlights,
                        importantDates: importantDates,
                        tarot: tarotCard,
                        fengShui: fengShui,
                        colors: colors,
                        crystals: crystals,
                        scents: scents,
                        affirmation: affirmation,
                        personNumbers: personNumbers
                    },
                    interpretation: interpretation,
                    deepPortrait: deepPortrait
                }
            };

        } catch (error) {
            console.error('Error in calculateYearForecast:', error);
            throw error;
        }
    }

    /**
     * Получение информации о годе
     */
    getYearInfo(year) {
        if (!year || isNaN(year)) {
            year = new Date().getFullYear();
        }

        // Универсальное число года (сумма всех цифр года)
        const yearDigits = String(year).split('').map(Number);
        const universalYearNumber = this.reduceNumber(yearDigits.reduce((a, b) => a + b, 0));

        return {
            year: year,
            yearNumber: universalYearNumber,
            universalYearNumber: universalYearNumber
        };
    }

    /**
     * Расчет персонального числа года
     */
    calculatePersonalYearNumber(year, personNumbers) {
        if (!year || isNaN(year)) return null;
        // Используем число судьбы как основу для персонального года
        const sum = year + (personNumbers.fate || 1);
        return this.reduceNumber(sum);
    }

    /**
     * Получение цикла года
     */
    getYearCycle(year, fateNumber) {
        if (!year || isNaN(year)) year = new Date().getFullYear();
        const cycleYear = ((year + (fateNumber || 1)) % 9) || 9;
        const cycles = {
            1: {
                name: 'Цикл Начала',
                description: 'Год новых начинаний и возможностей. Закладывается фундамент на следующие 9 лет.',
                energy: '🚀 Энергия старта'
            },
            2: {
                name: 'Цикл Развития',
                description: 'Год роста и укрепления. Развивайте то, что начали в прошлом году.',
                energy: '🌱 Энергия роста'
            },
            3: {
                name: 'Цикл Экспансии',
                description: 'Год расширения и новых связей. Время для коммуникации и творчества.',
                energy: '🦋 Энергия расширения'
            },
            4: {
                name: 'Цикл Стабилизации',
                description: 'Год укрепления позиций. Стройте прочные основы.',
                energy: '🏛️ Энергия стабильности'
            },
            5: {
                name: 'Цикл Перемен',
                description: 'Год трансформаций и свободы. Будьте готовы к изменениям.',
                energy: '⚡ Энергия перемен'
            },
            6: {
                name: 'Цикл Гармонии',
                description: 'Год любви и семьи. Фокус на отношениях и доме.',
                energy: '💖 Энергия гармонии'
            },
            7: {
                name: 'Цикл Познания',
                description: 'Год обучения и духовного роста. Углубляйтесь в знания.',
                energy: '🔮 Энергия мудрости'
            },
            8: {
                name: 'Цикл Успеха',
                description: 'Год достижений и изобилия. Время пожинать плоды.',
                energy: '💰 Энергия успеха'
            },
            9: {
                name: 'Цикл Завершения',
                description: 'Год подведения итогов. Завершайте циклы, готовьтесь к новому.',
                energy: '🔄 Энергия завершения'
            }
        };

        return cycles[cycleYear] || cycles[1];
    }

    /**
     * Получение китайского гороскопа
     */
    getChineseZodiac(year) {
        if (!year || isNaN(year)) year = new Date().getFullYear();

        const animals = [
            'Крыса', 'Бык', 'Тигр', 'Кролик', 'Дракон', 'Змея',
            'Лошадь', 'Коза', 'Обезьяна', 'Петух', 'Собака', 'Свинья'
        ];

        const elements = [
            { name: 'Дерево', color: 'Зеленый' },
            { name: 'Огонь', color: 'Красный' },
            { name: 'Земля', color: 'Желтый' },
            { name: 'Металл', color: 'Белый' },
            { name: 'Вода', color: 'Синий' }
        ];

        const startYear = 1984;
        let animalIndex = (year - startYear) % 12;
        let elementIndex = Math.floor(((year - startYear) % 10) / 2);

        if (animalIndex < 0) animalIndex += 12;
        if (elementIndex < 0) elementIndex += 5;

        const animal = animals[animalIndex] || 'Дракон';
        const element = elements[elementIndex] || { name: 'Земля', color: 'Желтый' };

        const compatibility = this.getChineseCompatibility(animal);

        return {
            animal: animal,
            element: element.name,
            elementColor: element.color,
            compatibility: compatibility,
            description: `Год ${element.name} ${animal}. ${compatibility.advice}`
        };
    }

    /**
     * Совместимость с китайским гороскопом
     */
    getChineseCompatibility(animal) {
        const compatibilities = {
            'Крыса': { score: 85, advice: 'Год благоприятен для новых знакомств и финансовых начинаний.' },
            'Бык': { score: 90, advice: 'Год принесет стабильность и карьерный рост.' },
            'Тигр': { score: 75, advice: 'Год требует осторожности в принятии решений, но сулит приключения.' },
            'Кролик': { score: 80, advice: 'Год гармонии в отношениях и творческих успехов.' },
            'Дракон': { score: 95, advice: 'Год великих свершений и удачи во всех начинаниях.' },
            'Змея': { score: 70, advice: 'Год мудрости и стратегического планирования.' },
            'Лошадь': { score: 85, advice: 'Год путешествий и новых горизонтов.' },
            'Коза': { score: 75, advice: 'Год требует внимания к здоровью и семейным делам.' },
            'Обезьяна': { score: 90, advice: 'Год креативных решений и финансового успеха.' },
            'Петух': { score: 80, advice: 'Год карьерного роста и общественного признания.' },
            'Собака': { score: 85, advice: 'Год верных друзей и справедливости.' },
            'Свинья': { score: 95, advice: 'Год изобилия и гармонии во всех сферах.' }
        };

        return compatibilities[animal] || { score: 80, advice: 'Год несет гармоничную энергию.' };
    }

    /**
     * Получение покровителя года
     */
    getYearRuler(yearNumber) {
        if (!yearNumber) yearNumber = 1;
        const rulers = {
            1: { planet: 'Солнце', element: 'Огонь', quality: 'Лидерство, энергия' },
            2: { planet: 'Луна', element: 'Вода', quality: 'Чувствительность, интуиция' },
            3: { planet: 'Юпитер', element: 'Воздух', quality: 'Экспансия, оптимизм' },
            4: { planet: 'Уран', element: 'Земля', quality: 'Стабильность, структура' },
            5: { planet: 'Меркурий', element: 'Воздух', quality: 'Коммуникация, движение' },
            6: { planet: 'Венера', element: 'Земля', quality: 'Гармония, любовь' },
            7: { planet: 'Нептун', element: 'Вода', quality: 'Духовность, мечты' },
            8: { planet: 'Сатурн', element: 'Земля', quality: 'Дисциплина, карма' },
            9: { planet: 'Марс', element: 'Огонь', quality: 'Действие, страсть' },
            11: { planet: 'Прозерпина', element: 'Дух', quality: 'Трансформация' },
            22: { planet: 'Вулкан', element: 'Материя', quality: 'Великие свершения' }
        };
        return rulers[yearNumber] || { planet: 'Меркурий', element: 'Воздух', quality: 'Адаптивность' };
    }

    /**
     * Получение темы года
     */
    getYearTheme(yearNumber) {
        if (!yearNumber) return '🌀 ГОД РАЗВИТИЯ';
        const themes = {
            1: '🌟 ГОД НОВЫХ НАЧАЛ',
            2: '🤝 ГОД ПАРТНЕРСТВА',
            3: '🎨 ГОД ТВОРЧЕСТВА',
            4: '🏛️ ГОД СТРОИТЕЛЬСТВА',
            5: '🦋 ГОД ПЕРЕМЕН',
            6: '💖 ГОД ЛЮБВИ',
            7: '🔍 ГОД ПОЗНАНИЯ',
            8: '💰 ГОД УСПЕХА',
            9: '🔄 ГОД ЗАВЕРШЕНИЯ',
            11: '💫 ГОД ПРОЗРЕНИЯ',
            22: '🏗️ ГОД ВЕЛИКИХ СВЕРШЕНИЙ'
        };
        return themes[yearNumber] || '🌀 ГОД РАЗВИТИЯ';
    }

    /**
     * Получение энергетического типа года
     */
    getYearEnergy(yearNumber) {
        if (!yearNumber) return '🌀 Нейтральный год';
        const energies = {
            1: '🔴 Год активного начала и лидерства',
            2: '🔵 Год гармонии и партнерства',
            3: '🟡 Творческий год',
            4: '🟢 Год порядка и структуры',
            5: '🟣 Год перемен и возможностей',
            6: '💗 Год любви и заботы',
            7: '🔮 Год анализа и мудрости',
            8: '💰 Год успеха и изобилия',
            9: '🔄 Год завершения и трансформации',
            11: '✨ Год духовного роста',
            22: '🏗️ Год великих свершений'
        };
        return energies[yearNumber] || '🌀 Нейтральный год';
    }

    /**
     * Полный анализ года
     */
    getYearAnalysis(yearNumber, universalYearNumber, personNumbers) {
        const analyses = {
            1: {
                theme: '🌟 НОВЫЕ НАЧАЛА',
                description: 'Год идеально подходит для старта новых проектов, кардинальных перемен и важных решений. Энергия лидерства и уверенности.',
                advice: 'Начинайте то, что давно откладывали. Берите инициативу в свои руки.',
                opportunities: ['Новые проекты', 'Смена работы', 'Открытие бизнеса', 'Переезд'],
                challenges: ['Излишняя самоуверенность', 'Конфликты с начальством', 'Поспешные решения']
            },
            2: {
                theme: '🤝 ГАРМОНИЯ И ПАРТНЕРСТВО',
                description: 'Год сотрудничества и дипломатии. Удачное время для партнерств, укрепления отношений и командной работы.',
                advice: 'Слушайте партнеров, ищите компромиссы. Вместе вы сильнее.',
                opportunities: ['Партнерства', 'Переговоры', 'Командные проекты', 'Брак'],
                challenges: ['Нерешительность', 'Зависимость от чужого мнения', 'Конфликты']
            },
            3: {
                theme: '🎨 ТВОРЧЕСТВО И РАДОСТЬ',
                description: 'Креативный год. Вдохновение и оптимизм будут вашими спутниками.',
                advice: 'Творите, общайтесь, делитесь идеями. Радость притягивает удачу.',
                opportunities: ['Творческие проекты', 'Новые знакомства', 'Презентации', 'Путешествия'],
                challenges: ['Поверхностность', 'Разбросанность', 'Легкомыслие']
            },
            4: {
                theme: '🏛️ СТРУКТУРА И ПОРЯДОК',
                description: 'Год организации и планирования. Создавайте системы, наводите порядок.',
                advice: 'Порядок в делах создает порядок в жизни. Структурируйте задачи.',
                opportunities: ['Планирование', 'Организация', 'Завершение дел', 'Накопления'],
                challenges: ['Ригидность', 'Застой', 'Выгорание']
            },
            5: {
                theme: '🦋 ПЕРЕМЕНЫ И СВОБОДА',
                description: 'Динамичный год перемен и свободы. Возможности, путешествия, новые впечатления.',
                advice: 'Не бойтесь перемен. Спонтанные решения могут привести к успеху.',
                opportunities: ['Путешествия', 'Новые знакомства', 'Быстрые решения', 'Обучение'],
                challenges: ['Непостоянство', 'Рискованные действия', 'Нестабильность']
            },
            6: {
                theme: '💖 ЛЮБОВЬ И ЗАБОТА',
                description: 'Год семьи, любви и гармонии. Время для близких, домашнего уюта.',
                advice: 'Уделите время семье. Забота о других вернется сторицей.',
                opportunities: ['Семейные дела', 'Укрепление отношений', 'Благотворительность', 'Покупка жилья'],
                challenges: ['Гиперопека', 'Растворение в других', 'Быт']
            },
            7: {
                theme: '🔍 МУДРОСТЬ И АНАЛИЗ',
                description: 'Год познания и мудрости. Углубляйтесь в исследования, учитесь, анализируйте.',
                advice: 'Ищите ответы внутри. Медитация и уединение принесут инсайты.',
                opportunities: ['Обучение', 'Исследования', 'Духовные практики', 'Написание книг'],
                challenges: ['Изоляция', 'Подозрительность', 'Скептицизм']
            },
            8: {
                theme: '💰 УСПЕХ И ИЗОБИЛИЕ',
                description: 'Год успеха и изобилия. Идеально для финансовых вопросов, карьеры, крупных сделок.',
                advice: 'Действуйте решительно. Ваши усилия приведут к материальным результатам.',
                opportunities: ['Финансы', 'Карьера', 'Крупные сделки', 'Инвестиции'],
                challenges: ['Властность', 'Меркантильность', 'Выгорание']
            },
            9: {
                theme: '🔄 ЗАВЕРШЕНИЕ И ТРАНСФОРМАЦИЯ',
                description: 'Год завершения и трансформации. Отпускайте старое, завершайте проекты.',
                advice: 'Благодарите за опыт и отпускайте. Завершение - это новое начало.',
                opportunities: ['Завершение проектов', 'Прощение', 'Очищение', 'Подведение итогов'],
                challenges: ['Фатализм', 'Потери', 'Депрессия']
            },
            11: {
                theme: '💫 ПРОЗРЕНИЕ И ВДОХНОВЕНИЕ',
                description: 'Год прозрения и духовного роста. Интуиция и прозрения.',
                advice: 'Доверяйте внутреннему голосу. Он приведет к важным открытиям.',
                opportunities: ['Интуитивные решения', 'Творчество', 'Духовность', 'Эзотерика'],
                challenges: ['Иллюзии', 'Нервное напряжение', 'Фантазии']
            },
            22: {
                theme: '🏗️ ВЕЛИКИЕ СВЕРШЕНИЯ',
                description: 'Год великих свершений. Ваши идеи могут воплотиться в реальность.',
                advice: 'Мыслите масштабно. Ваши мечты имеют силу стать реальностью.',
                opportunities: ['Масштабные проекты', 'Долгосрочное планирование', 'Реализация', 'Строительство'],
                challenges: ['Грандиозные планы без подготовки', 'Перегрузка', 'Стресс']
            }
        };

        const base = analyses[yearNumber] || {
            theme: '🌀 РАЗВИТИЕ',
            description: 'Год гармоничного развития. Следуйте за энергией.',
            advice: 'Будьте внимательны к возможностям.',
            opportunities: ['Новые возможности', 'Развитие'],
            challenges: ['Неопределенность']
        };

        base.personalNote = this.getPersonalYearNote(yearNumber, personNumbers);
        return base;
    }

    /**
     * Персональная заметка к году
     */
    getPersonalYearNote(yearNumber, personNumbers) {
        const notes = {
            1: `Ваше число судьбы ${personNumbers.fate} усиливает лидерские качества. Год идеален для реализации ваших амбиций.`,
            2: `Число имени ${personNumbers.name} помогает в дипломатии. Год благоприятен для партнерств.`,
            3: `Ваша креативность (число ${personNumbers.name}) особенно сильна. Творите!`,
            4: `Число фамилии ${personNumbers.surname} дает структурность. Стройте долгосрочные планы.`,
            5: `Число судьбы ${personNumbers.fate} зовет к переменам. Не бойтесь нового.`,
            6: `Число отчества ${personNumbers.patronymic} усиливает заботу. Год семьи.`,
            7: `Ваш аналитический ум (число ${personNumbers.name}) особенно остр. Учитесь.`,
            8: `Число фамилии ${personNumbers.surname} ведет к успеху. Действуйте.`,
            9: `Число судьбы ${personNumbers.fate} помогает завершать циклы. Отпускайте.`
        };
        return notes[yearNumber] || `Ваши личные числа (${personNumbers.fate}-${personNumbers.name}-${personNumbers.surname}-${personNumbers.patronymic}) создают уникальную вибрацию.`;
    }

    /**
     * Квартальная разбивка
     */
    getQuarterlyBreakdown(year, personNumbers) {
        const seasons = [
            { name: 'Весна', months: [3, 4, 5], element: 'Воздух', energy: 'Рост и обновление' },
            { name: 'Лето', months: [6, 7, 8], element: 'Огонь', energy: 'Активность и страсть' },
            { name: 'Осень', months: [9, 10, 11], element: 'Земля', energy: 'Сбор урожая' },
            { name: 'Зима', months: [12, 1, 2], element: 'Вода', energy: 'Покой и накопление' }
        ];

        return seasons.map(season => {
            const seasonMonths = season.months;
            const seasonSum = seasonMonths.reduce((a, b) => a + b, 0) + year + (personNumbers.fate || 1);
            const seasonNumber = this.reduceNumber(seasonSum);

            return {
                season: season.name,
                months: season.months.map(m => this.getMonthName(m)),
                element: season.element,
                energy: season.energy,
                number: seasonNumber,
                focus: this.getSeasonFocus(season.name, seasonNumber, personNumbers),
                advice: this.getSeasonAdvice(season.name)
            };
        });
    }

    /**
     * Получение названия месяца
     */
    getMonthName(monthNum) {
        const months = [
            'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
            'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
        ];
        return months[monthNum - 1] || '';
    }

    /**
     * Фокус сезона
     */
    getSeasonFocus(season, seasonNumber, personNumbers) {
        const focuses = {
            'Весна': `Обновление и рост. Число судьбы ${personNumbers.fate} усиливает новые начинания.`,
            'Лето': `Активность и реализация. Число имени ${personNumbers.name} помогает в общении.`,
            'Осень': `Подведение итогов. Число фамилии ${personNumbers.surname} дает структурность.`,
            'Зима': `Покой и планирование. Число отчества ${personNumbers.patronymic} усиливает интуицию.`
        };
        return focuses[season] || 'Гармоничное развитие';
    }

    /**
     * Совет для сезона
     */
    getSeasonAdvice(season) {
        const advices = {
            'Весна': 'Сажайте семена будущих проектов. Начинайте новое.',
            'Лето': 'Действуйте активно. Реализуйте планы, путешествуйте.',
            'Осень': 'Собирайте плоды своих трудов. Анализируйте результаты.',
            'Зима': 'Отдыхайте, копите силы, планируйте следующий год.'
        };
        return advices[season] || 'Следуйте ритмам природы.';
    }

    /**
     * Ключевые месяцы года
     */
    getMonthlyHighlights(year, personNumbers) {
        const months = [];

        for (let month = 1; month <= 12; month++) {
            const monthSum = month + year + (personNumbers.fate || 1);
            const monthNumber = this.reduceNumber(monthSum);

            let importance = 'обычный';
            let reason = '';

            if (monthNumber === 1 || monthNumber === 5 || monthNumber === 8) {
                importance = 'важный';
                reason = 'Ключевой месяц для начинаний и решений';
            } else if (monthNumber === 2 || monthNumber === 6) {
                importance = 'благоприятный';
                reason = 'Хороший месяц для отношений и гармонии';
            } else if (monthNumber === 3 || monthNumber === 7) {
                importance = 'творческий';
                reason = 'Месяц для творчества и обучения';
            } else if (monthNumber === 4 || monthNumber === 9) {
                importance = 'стабильный';
                reason = 'Месяц для завершения и порядка';
            }

            if (monthNumber === 11 || monthNumber === 22) {
                importance = 'судьбоносный';
                reason = monthNumber === 11 ? 'Месяц прозрения' : 'Месяц великих свершений';
            }

            months.push({
                month: month,
                monthName: this.getMonthName(month),
                number: monthNumber,
                importance: importance,
                reason: reason,
                element: this.getElementByNumber(monthNumber)
            });
        }

        const importanceOrder = { 'судьбоносный': 1, 'важный': 2, 'благоприятный': 3, 'творческий': 4, 'стабильный': 5, 'обычный': 6 };
        return months.sort((a, b) => importanceOrder[a.importance] - importanceOrder[b.importance]);
    }

    /**
     * Получение элемента по числу
     */
    getElementByNumber(number) {
        if (!number) return 'Воздух';
        const elements = {
            1: 'Огонь', 2: 'Вода', 3: 'Воздух', 4: 'Земля',
            5: 'Воздух', 6: 'Земля', 7: 'Вода', 8: 'Земля',
            9: 'Огонь', 11: 'Дух', 22: 'Материя'
        };
        return elements[number] || 'Воздух';
    }

    /**
     * Важные даты года
     */
    getImportantDates(year, personNumbers) {
        if (!year || isNaN(year)) year = new Date().getFullYear();

        const dates = [];

        const astronomicalDates = [
            { month: 3, day: 20, name: 'Весеннее равноденствие', reason: 'Баланс дня и ночи, время для начинаний' },
            { month: 6, day: 21, name: 'Летнее солнцестояние', reason: 'Пик солнечной энергии, время активности' },
            { month: 9, day: 22, name: 'Осеннее равноденствие', reason: 'Время сбора урожая и подведения итогов' },
            { month: 12, day: 21, name: 'Зимнее солнцестояние', reason: 'Время покоя и планирования' }
        ];

        astronomicalDates.forEach(item => {
            const dateStr = `${item.day}.${item.month}.${year}`;
            const dateSum = item.day + item.month + year + (personNumbers.fate || 1);
            const dateNumber = this.reduceNumber(dateSum);

            dates.push({
                date: dateStr,
                name: item.name,
                number: dateNumber,
                reason: item.reason,
                type: 'astronomical'
            });
        });

        // Личные даты
        const personalDates = [
            { name: 'Ваш день рождения', getDate: () => `15.06.${year}` }, // В реальности нужно брать из данных
            { name: 'Новый год', getDate: () => `01.01.${year}` },
            { name: 'Ваш личный новый год', getDate: () => `15.06.${year}` }
        ];

        personalDates.forEach(item => {
            const dateStr = item.getDate();
            const [day, month, y] = dateStr.split('.').map(Number);
            const dateSum = day + month + y + (personNumbers.fate || 1);
            const dateNumber = this.reduceNumber(dateSum);

            let reason = '';
            if (item.name === 'Ваш день рождения') {
                reason = `Начало вашего персонального года. Энергия числа ${dateNumber} будет влиять на следующие 12 месяцев.`;
            } else if (item.name === 'Новый год') {
                reason = 'Планетарный новый год. Время загадывать желания.';
            } else {
                reason = 'День вашего личного обновления. Подведите итоги и стройте планы.';
            }

            dates.push({
                date: dateStr,
                name: item.name,
                number: dateNumber,
                reason: reason,
                type: 'personal'
            });
        });

        return dates.sort((a, b) => {
            const [d1, m1, y1] = a.date.split('.').map(Number);
            const [d2, m2, y2] = b.date.split('.').map(Number);
            return (y1 - y2) || (m1 - m2) || (d1 - d2);
        });
    }

    /**
     * Карта Таро года
     */
    getYearTarot(yearNumber, universalYearNumber, personNumbers) {
        try {
            const tarotIndex = ((yearNumber || 1) + (universalYearNumber || 1) + (personNumbers.fate || 1)) % 22;

            const fakeNumbers = {
                fate: tarotIndex === 0 ? 22 : tarotIndex,
                name: personNumbers.name || 1,
                surname: personNumbers.surname || 1,
                patronymic: personNumbers.patronymic || 1
            };

            if (this.tarotService && typeof this.tarotService.calculateFromNumbers === 'function') {
                const tarotResult = this.tarotService.calculateFromNumbers(fakeNumbers);
                return tarotResult.fate || {
                    number: tarotIndex === 0 ? 22 : tarotIndex,
                    name: this.getTarotName(tarotIndex),
                    description: this.getTarotDescription(tarotIndex),
                    advice: this.getTarotAdvice(tarotIndex)
                };
            } else {
                return {
                    number: tarotIndex === 0 ? 22 : tarotIndex,
                    name: this.getTarotName(tarotIndex),
                    description: this.getTarotDescription(tarotIndex),
                    advice: this.getTarotAdvice(tarotIndex)
                };
            }
        } catch (error) {
            return {
                number: yearNumber || 1,
                name: 'Карта года',
                description: 'Следуйте за энергией года.',
                advice: 'Доверяйте своей интуиции.'
            };
        }
    }

    /**
     * Получение имени Таро по индексу
     */
    getTarotName(index) {
        const names = [
            'Шут', 'Маг', 'Верховная Жрица', 'Императрица', 'Император',
            'Иерофант', 'Влюбленные', 'Колесница', 'Сила', 'Отшельник',
            'Колесо Фортуны', 'Справедливость', 'Повешенный', 'Смерть',
            'Умеренность', 'Дьявол', 'Башня', 'Звезда', 'Луна', 'Солнце',
            'Суд', 'Мир'
        ];
        return names[index] || 'Шут';
    }

    /**
     * Получение описания Таро
     */
    getTarotDescription(index) {
        const descriptions = [
            'Новые начала, спонтанность',
            'Сила воли, мастерство',
            'Интуиция, тайна',
            'Плодородие, изобилие',
            'Власть, структура',
            'Традиции, мудрость',
            'Выбор, любовь',
            'Воля, победа',
            'Внутренняя сила',
            'Мудрость, поиск',
            'Циклы, судьба',
            'Равновесие, правда',
            'Жертва, новый взгляд',
            'Трансформация',
            'Баланс, гармония',
            'Зависимость, тень',
            'Разрушение, кризис',
            'Надежда, вдохновение',
            'Иллюзии, интуиция',
            'Радость, успех',
            'Пробуждение',
            'Завершение, целостность'
        ];
        return descriptions[index] || 'Энергия года';
    }

    /**
     * Получение совета Таро
     */
    getTarotAdvice(index) {
        const advices = [
            'Начинайте новое с открытым сердцем',
            'Действуйте, у вас есть все ресурсы',
            'Доверяйте своей интуиции',
            'Сейте семена желаний',
            'Стройте структуры и системы',
            'Ищите знания в традициях',
            'Слушайте свое сердце',
            'Контролируйте эмоции',
            'Действуйте из любви',
            'Уйдите в себя для поиска ответов',
            'Примите перемены',
            'Будьте честны',
            'Посмотрите с другой стороны',
            'Отпустите прошлое',
            'Ищите баланс',
            'Осознайте свои тени',
            'Не цепляйтесь за рушащееся',
            'Верьте в лучшее',
            'Доверяйте интуиции, но проверяйте',
            'Радуйтесь жизни',
            'Прислушайтесь к внутреннему зову',
            'Празднуйте достижения'
        ];
        return advices[index] || 'Доверяйте процессу';
    }

    /**
     * Фен-шуй на год
     */
    getYearFengShui(yearNumber, chineseElement, personNumbers) {
        const elements = {
            1: { element: 'Огонь', zone: 'Юг', activation: 'Красный цвет, свечи' },
            2: { element: 'Вода', zone: 'Север', activation: 'Синий цвет, вода, зеркала' },
            3: { element: 'Дерево', zone: 'Восток', activation: 'Зеленый цвет, растения' },
            4: { element: 'Дерево', zone: 'Юго-Восток', activation: 'Деревянные предметы' },
            5: { element: 'Земля', zone: 'Центр', activation: 'Желтый цвет, кристаллы' },
            6: { element: 'Металл', zone: 'Северо-Запад', activation: 'Металлические предметы' },
            7: { element: 'Металл', zone: 'Запад', activation: 'Белый цвет, металл' },
            8: { element: 'Земля', zone: 'Северо-Восток', activation: 'Терракотовый цвет' },
            9: { element: 'Огонь', zone: 'Юг', activation: 'Красный цвет, свечи' },
            11: { element: 'Дух', zone: 'Центр', activation: 'Медитация, свечи' },
            22: { element: 'Земля', zone: 'Все зоны', activation: 'Гармония во всем' }
        };

        const base = elements[yearNumber] || { element: 'Воздух', zone: 'Восток', activation: 'Проветривание, легкие ткани' };

        return {
            ...base,
            chineseElement: chineseElement || 'Земля',
            advice: `В этом году активируйте ${base.zone} сектор. Используйте ${base.activation}. Год ${chineseElement || 'Земля'} усиливает энергию ${base.element}.`,
            personalElement: this.getElementByNumber(personNumbers.fate)
        };
    }

    /**
     * Цвета года
     */
    getYearColors(yearNumber) {
        if (!yearNumber) return ['Белый', 'Золотой'];
        const colors = {
            1: ['Красный', 'Золотой', 'Оранжевый'],
            2: ['Голубой', 'Серебряный', 'Белый'],
            3: ['Желтый', 'Зеленый', 'Бирюзовый'],
            4: ['Зеленый', 'Коричневый', 'Бежевый'],
            5: ['Бирюзовый', 'Фиолетовый', 'Синий'],
            6: ['Розовый', 'Синий', 'Голубой'],
            7: ['Фиолетовый', 'Индиго', 'Серебряный'],
            8: ['Золотой', 'Коричневый', 'Оранжевый'],
            9: ['Белый', 'Серебряный', 'Красный'],
            11: ['Лавандовый', 'Жемчужный', 'Белый'],
            22: ['Пурпурный', 'Золотой', 'Красный']
        };
        return colors[yearNumber] || ['Белый', 'Золотой'];
    }

    /**
     * Камни года
     */
    getYearCrystals(yearNumber) {
        if (!yearNumber) return ['Горный хрусталь', 'Янтарь'];
        const crystals = {
            1: ['Рубин', 'Гранат', 'Цитрин'],
            2: ['Лунный камень', 'Жемчуг', 'Аквамарин'],
            3: ['Цитрин', 'Топаз', 'Аметист'],
            4: ['Изумруд', 'Нефрит', 'Яшма'],
            5: ['Бирюза', 'Аметист', 'Лазурит'],
            6: ['Розовый кварц', 'Сапфир', 'Родонит'],
            7: ['Аметист', 'Лабрадор', 'Малахит'],
            8: ['Тигровый глаз', 'Оникс', 'Гематит'],
            9: ['Алмаз', 'Горный хрусталь', 'Сердолик'],
            11: ['Лабрадор', 'Селенит', 'Ангелит'],
            22: ['Александрит', 'Сапфир', 'Пирит']
        };
        return crystals[yearNumber] || ['Горный хрусталь', 'Янтарь'];
    }

    /**
     * Ароматы года
     */
    getYearScents(yearNumber) {
        if (!yearNumber) return ['Лаванда', 'Сандал'];
        const scents = {
            1: ['Кедр', 'Сандал', 'Розмарин'],
            2: ['Лаванда', 'Роза', 'Ромашка'],
            3: ['Цитрус', 'Мята', 'Бергамот'],
            4: ['Пачули', 'Ветивер', 'Кедр'],
            5: ['Эвкалипт', 'Лимон', 'Мята'],
            6: ['Иланг-иланг', 'Жасмин', 'Роза'],
            7: ['Ладан', 'Мирра', 'Сандал'],
            8: ['Кедр', 'Сосна', 'Пачули'],
            9: ['Шалфей', 'Полынь', 'Лаванда'],
            11: ['Ладан', 'Сандал', 'Мирра'],
            22: ['Кедр', 'Сандал', 'Ладан']
        };
        return scents[yearNumber] || ['Лаванда', 'Сандал'];
    }

    /**
     * Аффирмация на год
     */
    getYearAffirmation(yearNumber, personNumbers, firstName) {
        if (!yearNumber) yearNumber = 1;
        const affirmations = {
            1: `Я, ${firstName}, лидер своей жизни. В этом году я начинаю новые проекты с уверенностью.`,
            2: `Я, ${firstName}, в гармонии с собой и миром. Я доверяю своей интуиции в партнерстве.`,
            3: `Я, ${firstName}, выражаю себя свободно. Моя креативность безгранична.`,
            4: `Я, ${firstName}, создаю порядок в жизни. Дисциплина ведет к свободе.`,
            5: `Я, ${firstName}, открыт переменам. Они ведут меня к росту.`,
            6: `Я, ${firstName}, окружен любовью. Я дарю тепло близким.`,
            7: `Я, ${firstName}, познаю мир. Моя мудрость растет.`,
            8: `Я, ${firstName}, достигаю успеха. Изобилие приходит ко мне.`,
            9: `Я, ${firstName}, отпускаю прошлое. Я готов к новому.`,
            11: `Я, ${firstName}, слышу голос интуиции. Я на правильном пути.`,
            22: `Я, ${firstName}, воплощаю мечты. Мои возможности безграничны.`
        };
        return affirmations[yearNumber] || `Я, ${firstName}, в гармонии с потоком жизни.`;
    }

    /**
     * Генерация интерпретации года
     */
    generateYearInterpretation(fullName, year, yearNumber, universalYearNumber, yearAnalysis,
                               quarterlyBreakdown, monthlyHighlights, importantDates, personNumbers, yearTheme) {
        const firstName = fullName.split(' ')[1] || fullName.split(' ')[0] || '';

        let interpretation = `
📜 **СВИТОК СУДЬБЫ НА ${year || '????'} ГОД**

🌟 **ДЛЯ ${fullName.toUpperCase()}**

🔢 **ЧИСЛО ГОДА: ${yearNumber || '?'}**
${yearTheme || '🌀 ГОД РАЗВИТИЯ'}

🌍 **УНИВЕРСАЛЬНОЕ ЧИСЛО ГОДА: ${universalYearNumber || '?'}**
Это число, под которым пройдет год для всего человечества.

📊 **ОБЩИЙ ПРОГНОЗ**
${yearAnalysis.description || 'Год гармоничного развития.'}

💫 **ПЕРСОНАЛЬНАЯ НОТА**
${yearAnalysis.personalNote || 'Уникальная вибрация ваших чисел.'}

💡 **ГЛАВНЫЙ СОВЕТ НА ГОД**
${yearAnalysis.advice || 'Будьте внимательны к возможностям.'}

🌟 **КЛЮЧЕВЫЕ ВОЗМОЖНОСТИ ГОДА**
${(yearAnalysis.opportunities || ['Новые возможности']).map(o => `• ${o}`).join('\n')}

⚠️ **НА ЧТО ОБРАТИТЬ ВНИМАНИЕ**
${(yearAnalysis.challenges || ['Неопределенность']).map(c => `• ${c}`).join('\n')}

🗓️ **КВАРТАЛЬНАЯ РАЗБИВКА**
`;

        quarterlyBreakdown.forEach(quarter => {
            interpretation += `
\n**${quarter.season} (${quarter.months.join(', ')})**
• Число сезона: ${quarter.number || '?'}
• Энергия: ${quarter.energy}
• Фокус: ${quarter.focus}
• Совет: ${quarter.advice}
`;
        });

        interpretation += `\n\n📅 **КЛЮЧЕВЫЕ МЕСЯЦЫ**\n`;

        monthlyHighlights.filter(m => m.importance !== 'обычный').slice(0, 6).forEach(month => {
            interpretation += `
• ${month.monthName}: число ${month.number || '?'} — ${month.reason || ''} (${month.importance})
`;
        });

        interpretation += `\n\n⭐ **ВАЖНЫЕ ДАТЫ ГОДА**\n`;

        importantDates.slice(0, 10).forEach(date => {
            interpretation += `
• ${date.date} — ${date.name} (число ${date.number || '?'})
  ${date.reason}
`;
        });

        interpretation += `
\n💫 **ИНТУИТИВНОЕ ПОСЛАНИЕ**
${firstName}, в этом году ваша задача — интегрировать энергию числа ${yearNumber || '?'} в свою жизнь. 
Учитывая ваши личные числа (${personNumbers.fate}-${personNumbers.name}-${personNumbers.surname}-${personNumbers.patronymic}), 
наиболее гармонично это проявится в сферах, где вы можете использовать свои сильные стороны.

Этот год — важная глава вашей жизни. Проживите его осознанно, и вы увидите, 
как синхронизируетесь с ритмами вселенной и откроете новые горизонты.
    `;

        return interpretation;
    }

    /**
     * Генерация глубинного портрета года
     */
    generateYearDeepPortrait(fullName, year, yearNumber, yearEnergy, yearCycle,
                             quarterlyBreakdown, personNumbers, tarotCard, chineseZodiac) {
        const firstName = fullName.split(' ')[1] || fullName.split(' ')[0] || '';

        return `
🌌 **ГЛУБИННЫЙ ПОРТРЕТ ${year || '????'} ГОДА**

**ДЛЯ: ${fullName}**

🌟 **ВАША УНИКАЛЬНАЯ ЭНЕРГЕТИКА В ЭТОМ ГОДУ**
${yearEnergy || '🌀 Нейтральный год'}

🔄 **9-ЛЕТНИЙ ЦИКЛ**
${yearCycle.name || 'Цикл'}: ${yearCycle.description || ''}
Энергия цикла: ${yearCycle.energy || ''}

🐉 **КИТАЙСКИЙ ГОРОСКОП**
Год ${chineseZodiac.element || ''} ${chineseZodiac.animal || ''}
Совместимость: ${chineseZodiac.compatibility?.score || 0}%
${chineseZodiac.description || ''}

🔮 **АРХЕТИП ГОДА**
Этот год активирует в вас архетип ${this.getArchetype(yearNumber)}. 
Это значит, что вам предстоит ${this.getArchetypeDescription(yearNumber, firstName)}.

📊 **ЭНЕРГЕТИЧЕСКИЙ ПРОГНОЗ ПО СЕЗОНАМ**
${quarterlyBreakdown.map(q => `• ${q.season}: ${q.energy} — число ${q.number || '?'}`).join('\n')}

🎴 **АРХЕТИПИЧЕСКОЕ ПОСЛАНИЕ**
Карта Таро года — **${tarotCard.name || 'Шут'}** — призывает вас: "${tarotCard.advice || ''}"
Для вас, ${firstName}, это означает, что в этом году особенно важно ${this.getPersonalTarotAdvice(tarotCard.number, personNumbers)}.

⚡ **ГЛАВНЫЙ ВЫЗОВ ГОДА**
${this.getMainChallenge(yearNumber, personNumbers)}

✨ **ГЛАВНАЯ ВОЗМОЖНОСТЬ ГОДА**
${this.getMainOpportunity(yearNumber, personNumbers)}

💫 **ИНТЕГРАЛЬНЫЙ СОВЕТ**
${firstName}, в этом году ваша уникальная комбинация чисел (${personNumbers.fate}-${personNumbers.name}-${personNumbers.surname}-${personNumbers.patronymic}) 
создает особый паттерн возможностей. Главная тема года: ${this.getYearTheme(yearNumber)}.

Помните: год — это важный этап вашего жизненного пути. Проживите его осознанно, 
и вы увидите, как синхронизируетесь с ритмами вселенной и откроете новые горизонты.
    `;
    }

    /**
     * Получение персонального совета Таро
     */
    getPersonalTarotAdvice(tarotNumber, personNumbers) {
        const advices = {
            0: 'доверять своей спонтанности',
            1: 'использовать свою внутреннюю силу',
            2: 'доверять интуиции',
            3: 'проявлять креативность',
            4: 'создавать структуры',
            5: 'следовать традициям',
            6: 'слушать сердце',
            7: 'контролировать эмоции',
            8: 'действовать из любви',
            9: 'уединиться для поиска ответов',
            10: 'принять перемены',
            11: 'быть честным с собой',
            12: 'посмотреть с другой стороны',
            13: 'отпустить прошлое',
            14: 'искать баланс',
            15: 'осознать свои тени',
            16: 'не цепляться за рушащееся',
            17: 'верить в лучшее',
            18: 'доверять интуиции, но проверять',
            19: 'радоваться жизни',
            20: 'прислушаться к внутреннему зову',
            21: 'праздновать достижения',
            22: 'начинать новое'
        };
        return advices[tarotNumber] || 'доверять своей интуиции';
    }

    /**
     * Получение архетипа
     */
    getArchetype(number) {
        if (!number) return 'Искателя';
        const archetypes = {
            1: 'Лидера', 2: 'Дипломата', 3: 'Творца', 4: 'Строителя',
            5: 'Исследователя', 6: 'Заботливого', 7: 'Мудреца', 8: 'Магната',
            9: 'Завершителя', 11: 'Проводника', 22: 'Архитектора реальности'
        };
        return archetypes[number] || 'Искателя';
    }

    /**
     * Получение описания архетипа
     */
    getArchetypeDescription(number, firstName) {
        if (!number) return `${firstName}, следовать своей уникальной природе.`;
        const descriptions = {
            1: `${firstName}, проявлять инициативу и вести за собой других.`,
            2: `${firstName}, быть дипломатичным и создавать гармонию вокруг.`,
            3: `${firstName}, творить и выражать себя через творчество.`,
            4: `${firstName}, создавать структуры и наводить порядок.`,
            5: `${firstName}, исследовать новое и быть открытым переменам.`,
            6: `${firstName}, заботиться о близких и создавать уют.`,
            7: `${firstName}, углубляться в знания и искать мудрость.`,
            8: `${firstName}, достигать успеха и управлять ресурсами.`,
            9: `${firstName}, завершать циклы и отпускать прошлое.`,
            11: `${firstName}, слушать интуицию и вдохновлять других.`,
            22: `${firstName}, воплощать мечты в реальность и строить будущее.`
        };
        return descriptions[number] || `${firstName}, следовать своей уникальной природе.`;
    }

    /**
     * Главный вызов года
     */
    getMainChallenge(yearNumber, personNumbers) {
        const challenges = {
            1: 'Не поддаться самоуверенности и не игнорировать помощь других.',
            2: 'Не раствориться в чужих интересах, сохранить себя.',
            3: 'Не распыляться на множество проектов, найти фокус.',
            4: 'Не закостенеть, сохранить гибкость и способность к переменам.',
            5: 'Не потерять фокус в погоне за новизной.',
            6: 'Не забыть о себе, заботясь о других.',
            7: 'Не уйти в изоляцию от мира.',
            8: 'Не поставить деньги выше человеческих отношений.',
            9: 'Не застрять в прошлом, не бояться отпускать.'
        };
        return challenges[yearNumber] || 'Найти баланс между разными сферами жизни.';
    }

    /**
     * Главная возможность года
     */
    getMainOpportunity(yearNumber, personNumbers) {
        const opportunities = {
            1: 'Начать что-то действительно важное, что изменит вашу жизнь.',
            2: 'Найти настоящего партнера или укрепить существующие отношения.',
            3: 'Раскрыть свой творческий потенциал.',
            4: 'Создать прочный фундамент для будущего.',
            5: 'Совершить прорыв в новой сфере.',
            6: 'Создать гармоничную семейную жизнь.',
            7: 'Получить важные знания и мудрость.',
            8: 'Достичь финансовой независимости.',
            9: 'Освободиться от всего, что тянет назад.'
        };
        return opportunities[yearNumber] || 'Раскрыть свой потенциал.';
    }
}

module.exports = YearForecastService;