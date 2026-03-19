// modules/Numerology/Services/WeekForecastService.js

const NumerologyService = require('../../../services/numerology');
const TarotService = require('../../../services/tarotService');

class WeekForecastService {
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
        const [year, month, day] = dateStr.split('-');
        return `${day}.${month}.${year}`;
    }

    /**
     * Форматирование даты для отображения
     */
    formatDate(d) {
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
        if (num === 11 || num === 22) return num;
        while (num > 9) {
            num = String(num).split('').reduce((sum, digit) => sum + parseInt(digit), 0);
        }
        return num;
    }

    /**
     * Полный расчет недельного прогноза
     */
    async calculateWeekForecast(fullName, birthDate, targetDate, userId = null) {
        try {
            const nameParts = fullName.trim().split(/\s+/);
            const [surname, firstName, patronymic] = nameParts;

            const formattedBirthDate = this.formatDateForCalculation(birthDate);
            const formattedTargetDate = this.formatDateForCalculation(targetDate);

            // Получаем базовую нумерологию человека
            const numerology = this.numerologyService.calculate(surname, firstName, patronymic, formattedBirthDate);

            const personNumbers = {
                fate: numerology.base.fate,
                name: numerology.base.name,
                surname: numerology.base.surname,
                patronymic: numerology.base.patronymic
            };

            // Получаем даты начала и конца недели
            const weekDates = this.getWeekDates(formattedTargetDate);
            const weekStart = weekDates.start;
            const weekEnd = weekDates.end;

            // 1. ЧИСЛО НЕДЕЛИ (общая вибрация недели)
            const weekNumber = this.calculateWeekNumber(weekStart, personNumbers);

            // 2. ЧИСЛО МЕСЯЦА (месяц, в который попадает неделя)
            const monthNumber = this.calculateMonthNumber(weekStart, personNumbers);

            // 3. ЧИСЛО ГОДА (год недели)
            const yearNumber = this.calculateYearNumber(weekStart, personNumbers);

            // 4. ПОКРОВИТЕЛЬ НЕДЕЛИ (планета)
            const weekRuler = this.getWeekRuler(weekNumber);

            // 5. ЭНЕРГЕТИЧЕСКИЙ ТИП НЕДЕЛИ
            const weekEnergy = this.getWeekEnergy(weekNumber);

            // 6. ПОЛНЫЙ АНАЛИЗ НЕДЕЛИ
            const weekAnalysis = this.getWeekAnalysis(weekNumber, monthNumber, yearNumber, personNumbers);

            // 7. ПРОГНОЗ ПО СФЕРАМ ЖИЗНИ
            const lifeAreas = this.getLifeAreasForecast(weekNumber, personNumbers);

            // 8. БЛАГОПРИЯТНЫЕ И НЕБЛАГОПРИЯТНЫЕ ДНИ
            const favorableDays = this.getFavorableDays(weekDates, personNumbers);

            // 9. ДНЕВНАЯ РАЗБИВКА (для каждого дня недели)
            const dailyBreakdown = this.getDailyBreakdown(weekDates, personNumbers, fullName);

            // 10. КАРТА ТАРО НЕДЕЛИ
            const tarotCard = this.getWeekTarot(weekNumber, monthNumber, personNumbers);

            // 11. ФЕН-ШУЙ НА НЕДЕЛЮ
            const fengShui = this.getWeekFengShui(weekNumber, personNumbers);

            // 12. ЦВЕТА НЕДЕЛИ
            const colors = this.getWeekColors(weekNumber);

            // 13. КАМНИ НЕДЕЛИ
            const crystals = this.getWeekCrystals(weekNumber);

            // 14. АРОМАТЫ НЕДЕЛИ
            const scents = this.getWeekScents(weekNumber);

            // 15. АФФИРМАЦИЯ НА НЕДЕЛЮ
            const affirmation = this.getWeekAffirmation(weekNumber, personNumbers, firstName);

            // 16. ГЛУБИННАЯ ИНТЕРПРЕТАЦИЯ НЕДЕЛИ
            const interpretation = this.generateWeekInterpretation(
                fullName, weekStart, weekEnd, weekNumber, weekAnalysis, lifeAreas, dailyBreakdown, personNumbers
            );

            // 17. ГЛУБИННЫЙ ПОРТРЕТ НЕДЕЛИ
            const deepPortrait = this.generateWeekDeepPortrait(
                fullName, weekStart, weekEnd, weekNumber, weekEnergy, dailyBreakdown, personNumbers, tarotCard
            );

            return {
                success: true,
                data: {
                    fullName,
                    birthDate,
                    weekRange: {
                        start: weekStart,
                        end: weekEnd
                    },
                    forecast: {
                        type: 'week',
                        weekNumber: weekNumber,
                        monthNumber: monthNumber,
                        yearNumber: yearNumber,
                        weekRuler: weekRuler,
                        weekEnergy: weekEnergy,
                        weekAnalysis: weekAnalysis,
                        lifeAreas: lifeAreas,
                        favorableDays: favorableDays,
                        dailyBreakdown: dailyBreakdown,
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
            console.error('Error in calculateWeekForecast:', error);
            throw error;
        }
    }

    /**
     * Получение дат недели
     */
    getWeekDates(targetDate) {
        const [day, month, year] = targetDate.split('.');
        const date = new Date(year, month - 1, day);

        // Находим понедельник
        const monday = new Date(date);
        const dayOfWeek = monday.getDay();
        const diff = monday.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        monday.setDate(diff);

        // Находим воскресенье
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);

        const result = {
            start: this.formatDate(monday),
            end: this.formatDate(sunday),
            monday: this.formatDate(monday)
        };

        // Добавляем остальные дни
        const days = ['tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        let currentDate = new Date(monday);

        for (let i = 0; i < days.length; i++) {
            currentDate.setDate(monday.getDate() + i + 1);
            result[days[i]] = this.formatDate(currentDate);
        }

        return result;
    }

    /**
     * Расчет числа недели
     */
    calculateWeekNumber(weekStart, personNumbers) {
        const [day, month, year] = weekStart.split('.');

        // Номер недели в году
        const date = new Date(year, month - 1, day);
        const startOfYear = new Date(year, 0, 1);
        const days = Math.floor((date - startOfYear) / (24 * 60 * 60 * 1000));
        const weekOfYear = Math.ceil((days + startOfYear.getDay() + 1) / 7);

        // Суммируем номер недели, месяц, год и число судьбы
        const sum = weekOfYear + parseInt(month) + parseInt(year) + personNumbers.fate;
        return this.reduceNumber(sum);
    }

    /**
     * Расчет числа месяца
     */
    calculateMonthNumber(weekStart, personNumbers) {
        const [day, month, year] = weekStart.split('.');
        const sum = parseInt(month) + parseInt(year) + personNumbers.fate;
        return this.reduceNumber(sum);
    }

    /**
     * Расчет числа года
     */
    calculateYearNumber(weekStart, personNumbers) {
        const [day, month, year] = weekStart.split('.');
        const sum = parseInt(year) + personNumbers.fate;
        return this.reduceNumber(sum);
    }

    /**
     * Получение покровителя недели
     */
    getWeekRuler(weekNumber) {
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
        return rulers[weekNumber] || { planet: 'Меркурий', element: 'Воздух', quality: 'Адаптивность' };
    }

    /**
     * Получение энергетического типа недели
     */
    getWeekEnergy(weekNumber) {
        const energies = {
            1: '🔴 Неделя активного начала',
            2: '🔵 Неделя гармонии и сотрудничества',
            3: '🟡 Творческая неделя',
            4: '🟢 Неделя порядка и структуры',
            5: '🟣 Неделя перемен и возможностей',
            6: '💗 Неделя любви и заботы',
            7: '🔮 Неделя анализа и мудрости',
            8: '💰 Неделя успеха и изобилия',
            9: '🔄 Неделя завершения и трансформации',
            11: '✨ Неделя духовного роста',
            22: '🏗️ Неделя великих свершений'
        };
        return energies[weekNumber] || '🌀 Нейтральная неделя';
    }

    /**
     * Полный анализ недели
     */
    getWeekAnalysis(weekNumber, monthNumber, yearNumber, personNumbers) {
        const analyses = {
            1: {
                theme: '🌟 НОВЫЕ НАЧАЛА',
                description: 'Неделя идеально подходит для старта новых проектов, инициатив и важных решений. Энергия лидерства и уверенности.',
                advice: 'Начинайте то, что давно откладывали. Берите инициативу в свои руки.',
                opportunities: ['Новые проекты', 'Лидерские позиции', 'Важные решения'],
                challenges: ['Излишняя самоуверенность', 'Конфликты из-за амбиций']
            },
            2: {
                theme: '🤝 ГАРМОНИЯ И ПАРТНЕРСТВО',
                description: 'Неделя сотрудничества и дипломатии. Удачное время для переговоров, укрепления отношений и командной работы.',
                advice: 'Слушайте партнеров, ищите компромиссы. Вместе вы сильнее.',
                opportunities: ['Партнерства', 'Переговоры', 'Командные проекты'],
                challenges: ['Нерешительность', 'Зависимость от чужого мнения']
            },
            3: {
                theme: '🎨 ТВОРЧЕСТВО И РАДОСТЬ',
                description: 'Креативная неделя. Вдохновение и оптимизм будут вашими спутниками. Хорошо для самовыражения и общения.',
                advice: 'Творите, общайтесь, делитесь идеями. Радость притягивает удачу.',
                opportunities: ['Творческие проекты', 'Новые знакомства', 'Презентации'],
                challenges: ['Поверхностность', 'Разбросанность']
            },
            4: {
                theme: '🏛️ СТРУКТУРА И ПОРЯДОК',
                description: 'Неделя организации и планирования. Создавайте системы, наводите порядок, стройте планы на будущее.',
                advice: 'Порядок в делах создает порядок в жизни. Структурируйте задачи.',
                opportunities: ['Планирование', 'Организация', 'Завершение дел'],
                challenges: ['Ригидность', 'Застой']
            },
            5: {
                theme: '🦋 ПЕРЕМЕНЫ И СВОБОДА',
                description: 'Динамичная неделя. Возможности, путешествия, новые впечатления. Будьте открыты к изменениям.',
                advice: 'Не бойтесь перемен. Спонтанные решения могут привести к успеху.',
                opportunities: ['Путешествия', 'Новые знакомства', 'Быстрые решения'],
                challenges: ['Непостоянство', 'Рискованные действия']
            },
            6: {
                theme: '💖 ЛЮБОВЬ И ЗАБОТА',
                description: 'Семейная неделя. Время для близких, домашнего уюта и заботы о других. Гармония в отношениях.',
                advice: 'Уделите время семье. Забота о других вернется сторицей.',
                opportunities: ['Семейные дела', 'Укрепление отношений', 'Благотворительность'],
                challenges: ['Гиперопека', 'Растворение в других']
            },
            7: {
                theme: '🔍 МУДРОСТЬ И АНАЛИЗ',
                description: 'Неделя познания. Углубляйтесь в исследования, учитесь, анализируйте. Интуиция особенно сильна.',
                advice: 'Ищите ответы внутри. Медитация и уединение принесут инсайты.',
                opportunities: ['Обучение', 'Исследования', 'Духовные практики'],
                challenges: ['Изоляция', 'Подозрительность']
            },
            8: {
                theme: '⚖️ УСПЕХ И ИЗОБИЛИЕ',
                description: 'Неделя достижений. Хорошо для финансовых вопросов, карьеры, крупных сделок. Энергия власти и успеха.',
                advice: 'Действуйте решительно. Ваши усилия приведут к материальным результатам.',
                opportunities: ['Финансы', 'Карьера', 'Крупные сделки'],
                challenges: ['Властность', 'Меркантильность']
            },
            9: {
                theme: '🔄 ЗАВЕРШЕНИЕ И ТРАНСФОРМАЦИЯ',
                description: 'Неделя подведения итогов. Отпускайте старое, завершайте проекты, прощайте. Освобождайте место для нового.',
                advice: 'Благодарите за опыт и отпускайте. Завершение - это новое начало.',
                opportunities: ['Завершение проектов', 'Прощение', 'Очищение'],
                challenges: ['Фатализм', 'Потери']
            },
            11: {
                theme: '💫 ПРОЗРЕНИЕ И ВДОХНОВЕНИЕ',
                description: 'Духовная неделя. Интуиция и прозрения. Слушайте знаки судьбы.',
                advice: 'Доверяйте внутреннему голосу. Он приведет к важным открытиям.',
                opportunities: ['Интуитивные решения', 'Творчество', 'Духовность'],
                challenges: ['Иллюзии', 'Нервное напряжение']
            },
            22: {
                theme: '🏗️ ВЕЛИКИЕ СВЕРШЕНИЯ',
                description: 'Масштабная неделя. Ваши идеи могут воплотиться в реальность. Стройте планы на будущее.',
                advice: 'Мыслите масштабно. Ваши мечты имеют силу стать реальностью.',
                opportunities: ['Масштабные проекты', 'Долгосрочное планирование', 'Реализация'],
                challenges: ['Грандиозные планы без подготовки', 'Перегрузка']
            }
        };

        const base = analyses[weekNumber] || {
            theme: '🌀 РАЗВИТИЕ',
            description: 'Неделя гармоничного развития. Следуйте за энергией.',
            advice: 'Будьте внимательны к возможностям.',
            opportunities: ['Новые возможности', 'Развитие'],
            challenges: ['Неопределенность']
        };

        // Добавляем персонализацию
        base.personalNote = this.getPersonalWeekNote(weekNumber, personNumbers);

        return base;
    }

    /**
     * Персональная заметка к неделе
     */
    getPersonalWeekNote(weekNumber, personNumbers) {
        const notes = {
            1: `Ваше число судьбы ${personNumbers.fate} усиливает лидерские качества на этой неделе.`,
            2: `Число имени ${personNumbers.name} помогает в дипломатии и партнерстве.`,
            3: `Ваша креативность (число ${personNumbers.name}) особенно сильна на этой неделе.`,
            4: `Число фамилии ${personNumbers.surname} дает структурность и организованность.`,
            5: `Число судьбы ${personNumbers.fate} зовет к переменам и приключениям.`,
            6: `Число отчества ${personNumbers.patronymic} усиливает заботу и эмпатию.`,
            7: `Ваш аналитический ум (число ${personNumbers.name}) особенно остр.`,
            8: `Число фамилии ${personNumbers.surname} ведет к успеху и изобилию.`,
            9: `Число судьбы ${personNumbers.fate} помогает в завершении циклов.`
        };
        return notes[weekNumber] || `Ваши личные числа (${personNumbers.fate}-${personNumbers.name}-${personNumbers.surname}-${personNumbers.patronymic}) создают уникальную вибрацию.`;
    }

    /**
     * Прогноз по сферам жизни на неделю
     */
    getLifeAreasForecast(weekNumber, personNumbers) {
        const forecasts = {
            1: {
                career: '🌟 Карьера: Время для лидерства и новых начинаний. Берите инициативу.',
                love: '❤️ Любовь: Проявляйте активность в отношениях. Для одиноких - отличная неделя для знакомств.',
                health: '🌿 Здоровье: Высокая энергия. Займитесь спортом, активным отдыхом.',
                finance: '💰 Финансы: Благоприятно для инвестиций и крупных покупок.'
            },
            2: {
                career: '🤝 Карьера: Успех в командной работе. Проводите переговоры, ищите партнеров.',
                love: '💕 Любовь: Время для романтики и чувственных разговоров. Укрепляйте связь с партнером.',
                health: '💧 Здоровье: Обратите внимание на эмоциональное состояние. Водные процедуры, медитация.',
                finance: '📊 Финансы: Консультируйтесь со специалистами. Избегайте рискованных вложений.'
            },
            3: {
                career: '🎨 Карьера: Творческий подход принесет успех. Генерируйте идеи, презентуйте проекты.',
                love: '💞 Любовь: Легкость и флирт. Отличная неделя для свиданий и романтических сюрпризов.',
                health: '🩰 Здоровье: Энергия на подъеме. Танцы, йога, творчество.',
                finance: '🎲 Финансы: Спонтанные решения могут быть удачными. Неожиданные поступления.'
            },
            4: {
                career: '📋 Карьера: Время порядка и структуры. Планируйте, организуйте, завершайте.',
                love: '🏡 Любовь: Стабильность в отношениях. Семейные дела, совместное планирование.',
                health: '💪 Здоровье: Обратите внимание на спину и суставы. Умеренные нагрузки.',
                finance: '💰 Финансы: Накопление и экономия. Планируйте бюджет.'
            },
            5: {
                career: '✈️ Карьера: Командировки, новые проекты, расширение горизонтов. Будьте открыты.',
                love: '🦋 Любовь: Новые знакомства. Для пар - внесите разнообразие в отношения.',
                health: '🚴 Здоровье: Высокая подвижность. Путешествия, активный отдых.',
                finance: '💸 Финансы: Неожиданные доходы, но и траты. Будьте внимательны.'
            },
            6: {
                career: '🤲 Карьера: Успех в сфере услуг, образования, помощи другим.',
                love: '💖 Любовь: Гармония и романтика. Семейные ужины, признания в любви.',
                health: '🍲 Здоровье: Обратите внимание на питание. Домашняя еда, релаксация.',
                finance: '🏠 Финансы: Траты на семью и дом. Покупки для близких.'
            },
            7: {
                career: '🔬 Карьера: Успех в науке, аналитике, IT. Глубокие исследования.',
                love: '💭 Любовь: Глубокие разговоры. Поймите истинные желания партнера.',
                health: '🧘 Здоровье: Нервная система. Медитация, тишина, прогулки.',
                finance: '📈 Финансы: Анализ финансов. Проверка счетов, планирование инвестиций.'
            },
            8: {
                career: '💼 Карьера: Успех в бизнесе, финансах, управлении. Заключайте сделки.',
                love: '💍 Любовь: Статус и отношения. Обсуждайте совместные цели и планы.',
                health: '🧘‍♂️ Здоровье: Позвоночник и суставы. Умеренные нагрузки.',
                finance: '💰 Финансы: Крупные деньги. Инвестиции, крупные покупки.'
            },
            9: {
                career: '🎯 Карьера: Завершение проектов. Передача дел, подведение итогов.',
                love: '🕊️ Любовь: Отпустите прошлые отношения. Простите и отпустите обиды.',
                health: '🌱 Здоровье: Очищение. Детокс, голодание, очистительные процедуры.',
                finance: '💳 Финансы: Завершение финансовых циклов. Отдача долгов.'
            }
        };

        return forecasts[weekNumber] || {
            career: '🔄 Карьера: Обычная рабочая неделя. Будьте внимательны к деталям.',
            love: '💗 Любовь: Уделите внимание партнеру.',
            health: '🌿 Здоровье: Следите за самочувствием.',
            finance: '📊 Финансы: Будьте внимательны с деньгами.'
        };
    }

    /**
     * Благоприятные и неблагоприятные дни недели
     */
    getFavorableDays(weekDates, personNumbers) {
        const days = [
            { name: 'Понедельник', date: weekDates.monday },
            { name: 'Вторник', date: weekDates.tuesday },
            { name: 'Среда', date: weekDates.wednesday },
            { name: 'Четверг', date: weekDates.thursday },
            { name: 'Пятница', date: weekDates.friday },
            { name: 'Суббота', date: weekDates.saturday },
            { name: 'Воскресенье', date: weekDates.sunday }
        ];

        // Рассчитываем число для каждого дня
        const daysWithNumbers = days.map(day => {
            const [d, m, y] = day.date.split('.');
            const daySum = parseInt(d) + parseInt(m) + parseInt(y) + personNumbers.fate;
            const dayNumber = this.reduceNumber(daySum);

            return {
                ...day,
                number: dayNumber,
                quality: this.getDayQuality(dayNumber)
            };
        });

        // Сортируем по качеству
        const favorable = daysWithNumbers.filter(d => d.quality.score >= 7);
        const neutral = daysWithNumbers.filter(d => d.quality.score >= 4 && d.quality.score < 7);
        const challenging = daysWithNumbers.filter(d => d.quality.score < 4);

        return {
            favorable: favorable.map(d => ({ name: d.name, date: d.date, number: d.number, reason: d.quality.reason })),
            neutral: neutral.map(d => ({ name: d.name, date: d.date, number: d.number, reason: d.quality.reason })),
            challenging: challenging.map(d => ({ name: d.name, date: d.date, number: d.number, reason: d.quality.reason }))
        };
    }

    /**
     * Качество дня по числу
     */
    getDayQuality(dayNumber) {
        const qualities = {
            1: { score: 9, reason: 'Отличный день для начинаний' },
            2: { score: 7, reason: 'Хороший день для партнерства' },
            3: { score: 8, reason: 'Творческий день' },
            4: { score: 6, reason: 'День порядка и структуры' },
            5: { score: 7, reason: 'День перемен и возможностей' },
            6: { score: 8, reason: 'Гармоничный день' },
            7: { score: 5, reason: 'День анализа и уединения' },
            8: { score: 9, reason: 'День успеха и достижений' },
            9: { score: 6, reason: 'День завершения' },
            11: { score: 10, reason: 'День прозрения и интуиции' },
            22: { score: 10, reason: 'День великих свершений' }
        };
        return qualities[dayNumber] || { score: 5, reason: 'Нейтральный день' };
    }

    /**
     * Дневная разбивка (детальный прогноз на каждый день)
     */
    getDailyBreakdown(weekDates, personNumbers, fullName) {
        const days = [
            { name: 'Понедельник', date: weekDates.monday, ruler: 'Луна', element: 'Вода' },
            { name: 'Вторник', date: weekDates.tuesday, ruler: 'Марс', element: 'Огонь' },
            { name: 'Среда', date: weekDates.wednesday, ruler: 'Меркурий', element: 'Воздух' },
            { name: 'Четверг', date: weekDates.thursday, ruler: 'Юпитер', element: 'Воздух' },
            { name: 'Пятница', date: weekDates.friday, ruler: 'Венера', element: 'Земля' },
            { name: 'Суббота', date: weekDates.saturday, ruler: 'Сатурн', element: 'Земля' },
            { name: 'Воскресенье', date: weekDates.sunday, ruler: 'Солнце', element: 'Огонь' }
        ];

        const breakdown = [];

        for (const day of days) {
            const [d, m, y] = day.date.split('.');

            // Универсальное число дня
            const universalSum = parseInt(d) + parseInt(m) + parseInt(y);
            const universalNumber = this.reduceNumber(universalSum);

            // Личное число дня (с учетом числа судьбы)
            const personalSum = universalSum + personNumbers.fate;
            const personalNumber = this.reduceNumber(personalSum);

            breakdown.push({
                dayName: day.name,
                date: day.date,
                universalNumber: universalNumber,
                personalNumber: personalNumber,
                ruler: day.ruler,
                element: day.element,
                energy: this.getDayEnergy(universalNumber),
                focus: this.getDayFocus(universalNumber, personNumbers),
                advice: this.getDayAdvice(universalNumber),
                color: this.getWeekColors(universalNumber)[0],
                crystal: this.getWeekCrystals(universalNumber)[0],
                favorableHours: this.getFavorableHours(universalNumber),
                isToday: this.isToday(day.date)
            });
        }

        return breakdown;
    }

    /**
     * Энергия дня
     */
    getDayEnergy(number) {
        const energies = {
            1: '⚡⚡⚡⚡⚡ Высокая',
            2: '⚡⚡⚡ Средняя',
            3: '⚡⚡⚡⚡ Высокая',
            4: '⚡⚡⚡ Средняя',
            5: '⚡⚡⚡⚡ Высокая',
            6: '⚡⚡⚡⚡ Гармоничная',
            7: '⚡⚡ Низкая',
            8: '⚡⚡⚡⚡⚡ Максимальная',
            9: '⚡⚡⚡ Умеренная'
        };
        return energies[number] || '⚡⚡⚡ Средняя';
    }

    /**
     * Фокус дня
     */
    getDayFocus(number, personNumbers) {
        const focuses = {
            1: `Лидерство и новые начинания. Число судьбы ${personNumbers.fate} усиливает инициативу.`,
            2: `Партнерство и дипломатия. Число имени ${personNumbers.name} помогает в общении.`,
            3: `Творчество и самовыражение. Ваша креативность на высоте.`,
            4: `Порядок и структура. Число фамилии ${personNumbers.surname} дает организованность.`,
            5: `Перемены и свобода. Число судьбы ${personNumbers.fate} зовет к приключениям.`,
            6: `Забота и гармония. Число отчества ${personNumbers.patronymic} усиливает эмпатию.`,
            7: `Анализ и познание. Ваш ум сегодня особенно остр.`,
            8: `Успех и достижения. Число фамилии ${personNumbers.surname} ведет к победе.`,
            9: `Завершение и отпускание. Число судьбы ${personNumbers.fate} помогает трансформироваться.`
        };
        return focuses[number] || 'Гармоничное развитие';
    }

    /**
     * Совет дня
     */
    getDayAdvice(number) {
        const advices = {
            1: 'Действуйте смело, но не давите на других.',
            2: 'Слушайте и слышьте. Дипломатия - ключ к успеху.',
            3: 'Творите и делитесь. Ваши идеи вдохновляют.',
            4: 'Порядок создает свободу. Организуйте пространство.',
            5: 'Будьте открыты новому. Перемены ведут к росту.',
            6: 'Забота о других вернется сторицей.',
            7: 'Ищите ответы внутри. Медитируйте.',
            8: 'Действуйте решительно. Успех близко.',
            9: 'Отпускайте с благодарностью. Освобождайте место.'
        };
        return advices[number] || 'Доверяйте своей интуиции.';
    }

    /**
     * Проверка на сегодняшний день
     */
    isToday(dateStr) {
        const [day, month, year] = dateStr.split('.');
        const today = new Date();
        return parseInt(day) === today.getDate() &&
            parseInt(month) === today.getMonth() + 1 &&
            parseInt(year) === today.getFullYear();
    }

    /**
     * Благоприятные часы
     */
    getFavorableHours(number) {
        const hours = {
            1: ['11:00 - 13:00', '15:00 - 17:00'],
            2: ['09:00 - 11:00', '14:00 - 16:00'],
            3: ['10:00 - 12:00', '16:00 - 18:00'],
            4: ['08:00 - 10:00', '13:00 - 15:00'],
            5: ['11:00 - 13:00', '15:00 - 17:00'],
            6: ['10:00 - 12:00', '17:00 - 19:00'],
            7: ['09:00 - 11:00', '14:00 - 16:00'],
            8: ['11:00 - 13:00', '15:00 - 17:00'],
            9: ['10:00 - 12:00', '16:00 - 18:00']
        };
        return hours[number] || ['11:00 - 13:00', '15:00 - 17:00'];
    }

    /**
     * Карта Таро на неделю
     */
    getWeekTarot(weekNumber, monthNumber, personNumbers) {
        try {
            const tarotIndex = (weekNumber + monthNumber + personNumbers.fate) % 22;

            const fakeNumbers = {
                fate: tarotIndex === 0 ? 22 : tarotIndex,
                name: personNumbers.name,
                surname: personNumbers.surname,
                patronymic: personNumbers.patronymic
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
                number: weekNumber,
                name: 'Карта недели',
                description: 'Следуйте за энергией недели.',
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
        return descriptions[index] || 'Энергия недели';
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
     * Фен-шуй на неделю
     */
    getWeekFengShui(weekNumber, personNumbers) {
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

        const base = elements[weekNumber] || { element: 'Воздух', zone: 'Восток', activation: 'Проветривание, легкие ткани' };

        return {
            ...base,
            advice: `На этой неделе активируйте ${base.zone} сектор. Используйте ${base.activation}. Ваше число судьбы ${personNumbers.fate} усилит эффект.`,
            personalElement: this.getElementByNumber(personNumbers.fate)
        };
    }

    /**
     * Получение элемента по числу
     */
    getElementByNumber(number) {
        const elements = {
            1: 'Огонь', 2: 'Вода', 3: 'Воздух', 4: 'Земля',
            5: 'Воздух', 6: 'Земля', 7: 'Вода', 8: 'Земля',
            9: 'Огонь', 11: 'Дух', 22: 'Материя'
        };
        return elements[number] || 'Воздух';
    }

    /**
     * Цвета недели
     */
    getWeekColors(weekNumber) {
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
        return colors[weekNumber] || ['Белый', 'Золотой'];
    }

    /**
     * Камни недели
     */
    getWeekCrystals(weekNumber) {
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
        return crystals[weekNumber] || ['Горный хрусталь', 'Янтарь'];
    }

    /**
     * Ароматы недели
     */
    getWeekScents(weekNumber) {
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
        return scents[weekNumber] || ['Лаванда', 'Сандал'];
    }

    /**
     * Аффирмация на неделю
     */
    getWeekAffirmation(weekNumber, personNumbers, firstName) {
        const affirmations = {
            1: `Я, ${firstName}, лидер своей жизни. На этой неделе я начинаю новые проекты с уверенностью.`,
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
        return affirmations[weekNumber] || `Я, ${firstName}, в гармонии с потоком жизни.`;
    }

    /**
     * Генерация интерпретации недели
     */
    generateWeekInterpretation(fullName, weekStart, weekEnd, weekNumber, weekAnalysis, lifeAreas, dailyBreakdown, personNumbers) {
        const [startDay, startMonth, startYear] = weekStart.split('.');
        const [endDay, endMonth, endYear] = weekEnd.split('.');
        const firstName = fullName.split(' ')[1] || fullName.split(' ')[0] || '';

        let interpretation = `
📜 **СВИТОК СУДЬБЫ НА НЕДЕЛЮ**
🗓️ **${startDay}.${startMonth}.${startYear} — ${endDay}.${endMonth}.${endYear}**

🌟 **ДЛЯ ${fullName.toUpperCase()}**

🔢 **ЧИСЛО НЕДЕЛИ: ${weekNumber}**
${weekAnalysis.theme}

📊 **ОБЩИЙ ПРОГНОЗ**
${weekAnalysis.description}

💫 **ПЕРСОНАЛЬНАЯ НОТА**
${weekAnalysis.personalNote}

${weekAnalysis.advice}

🌅 **ПРОГНОЗ ПО СФЕРАМ ЖИЗНИ**
${lifeAreas.career}
${lifeAreas.love}
${lifeAreas.health}
${lifeAreas.finance}

📅 **КЛЮЧЕВЫЕ ВОЗМОЖНОСТИ НЕДЕЛИ**
${weekAnalysis.opportunities.map(o => `• ${o}`).join('\n')}

⚠️ **НА ЧТО ОБРАТИТЬ ВНИМАНИЕ**
${weekAnalysis.challenges.map(c => `• ${c}`).join('\n')}

🗓️ **ДНЕВНАЯ РАЗБИВКА**
`;

        // Добавляем разбивку по дням
        dailyBreakdown.forEach(day => {
            const todayMarker = day.isToday ? ' (СЕГОДНЯ)' : '';
            interpretation += `
${day.dayName}${todayMarker} (${day.date})
• Число дня: ${day.universalNumber} (личное: ${day.personalNumber})
• Энергия: ${day.energy}
• Фокус: ${day.focus}
• Совет: ${day.advice}
• Цвет: ${day.color}
• Камень: ${day.crystal}
• Благоприятные часы: ${day.favorableHours.join(', ')}
`;
        });

        // Добавляем благоприятные дни
        interpretation += `
\n🌟 **НАИБОЛЕЕ БЛАГОПРИЯТНЫЕ ДНИ**
`;
        dailyBreakdown.forEach(day => {
            if ([1, 3, 6, 8, 11, 22].includes(day.universalNumber)) {
                interpretation += `• ${day.dayName} (${day.date}) — число ${day.universalNumber}\n`;
            }
        });

        interpretation += `
\n💫 **СОВЕТ НА НЕДЕЛЮ**
${weekAnalysis.advice}

🔮 **ИНТУИТИВНОЕ ПОСЛАНИЕ**
На этой неделе ваша задача — интегрировать энергию числа ${weekNumber} в свою жизнь. 
Учитывая ваши личные числа (${personNumbers.fate}-${personNumbers.name}-${personNumbers.surname}-${personNumbers.patronymic}), 
наиболее гармонично это проявится в сферах, где вы можете использовать свои сильные стороны.
    `;

        return interpretation;
    }

    /**
     * Генерация глубинного портрета недели
     */
    generateWeekDeepPortrait(fullName, weekStart, weekEnd, weekNumber, weekEnergy, dailyBreakdown, personNumbers, tarotCard) {
        const [startDay, startMonth, startYear] = weekStart.split('.');
        const [endDay, endMonth, endYear] = weekEnd.split('.');
        const firstName = fullName.split(' ')[1] || fullName.split(' ')[0] || '';

        // Находим день с максимальной энергией
        const maxEnergyDay = dailyBreakdown.reduce((max, day) =>
            (day.universalNumber === 8 || day.universalNumber === 1) ? day : max, dailyBreakdown[0]);

        // Находим день для отдыха
        const restDay = dailyBreakdown.find(day => day.universalNumber === 7) || dailyBreakdown[6];

        return `
🌌 **ГЛУБИННЫЙ ПОРТРЕТ НЕДЕЛИ**
🗓️ **${startDay}.${startMonth}.${startYear} — ${endDay}.${endMonth}.${endYear}**

**ДЛЯ: ${fullName}**

🌟 **ВАША УНИКАЛЬНАЯ ЭНЕРГЕТИКА НА ЭТУ НЕДЕЛЮ**
${weekEnergy}

🔮 **АРХЕТИП НЕДЕЛИ**
Эта неделя активирует в вас архетип ${this.getArchetype(weekNumber)}. 
Это значит, что вам предстоит ${this.getArchetypeDescription(weekNumber, firstName)}.

⚡ **ПИК ЭНЕРГИИ**
Наибольший энергетический подъем ожидает вас в **${maxEnergyDay.dayName} (${maxEnergyDay.date})**. 
В этот день ваша продуктивность будет максимальной. Запланируйте важные дела на это время.

🕊️ **ДЛЯ ВОССТАНОВЛЕНИЯ**
${restDay.dayName} (${restDay.date}) — лучший день для отдыха и восстановления. 
Энергия этого дня располагает к уединению и анализу.

🎴 **АРХЕТИПИЧЕСКОЕ ПОСЛАНИЕ**
Карта Таро недели — **${tarotCard.name}** — призывает вас: "${tarotCard.advice.toLowerCase()}"
Для вас, ${firstName}, это означает, что на этой неделе особенно важно ${this.getPersonalTarotAdvice(tarotCard.number, personNumbers)}.

🔄 **ЦИКЛЫ НЕДЕЛИ**
• Начало недели (Пн-Ср): ${this.getPhaseAdvice('start', weekNumber)}
• Середина недели (Чт-Пт): ${this.getPhaseAdvice('middle', weekNumber)}
• Выходные (Сб-Вс): ${this.getPhaseAdvice('end', weekNumber)}

💫 **ИНТЕГРАЛЬНЫЙ СОВЕТ**
${firstName}, на этой неделе ваша уникальная комбинация чисел (${personNumbers.fate}-${personNumbers.name}-${personNumbers.surname}-${personNumbers.patronymic}) 
создает особый паттерн возможностей. Главное — не распыляться, а следовать главной теме недели: ${this.getMainTheme(weekNumber)}.

Помните: неделя — это мини-жизненный цикл. Проживите его осознанно, и вы увидите, как синхронизируетесь с ритмами вселенной.
    `;
    }

    /**
     * Получение архетипа недели
     */
    getArchetype(weekNumber) {
        const archetypes = {
            1: 'Лидера', 2: 'Дипломата', 3: 'Творца', 4: 'Строителя',
            5: 'Исследователя', 6: 'Заботливого', 7: 'Мудреца', 8: 'Магната',
            9: 'Завершителя', 11: 'Проводника', 22: 'Архитектора реальности'
        };
        return archetypes[weekNumber] || 'Искателя';
    }

    /**
     * Получение описания архетипа
     */
    getArchetypeDescription(weekNumber, firstName) {
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
        return descriptions[weekNumber] || `${firstName}, следовать своей уникальной природе.`;
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
     * Совет по фазе недели
     */
    getPhaseAdvice(phase, weekNumber) {
        const advices = {
            start: {
                1: 'активно начинайте новые проекты',
                2: 'налаживайте контакты и договаривайтесь',
                3: 'генерируйте идеи и творите',
                4: 'планируйте и структурируйте',
                5: 'будьте открыты к спонтанным решениям',
                6: 'уделите внимание близким',
                7: 'анализируйте и исследуйте',
                8: 'закладывайте основу для успеха',
                9: 'завершайте старые дела'
            },
            middle: {
                1: 'реализуйте намеченные планы',
                2: 'укрепляйте партнерские связи',
                3: 'делитесь идеями и презентуйте',
                4: 'работайте над текущими задачами',
                5: 'вносите разнообразие в рутину',
                6: 'создавайте гармонию в отношениях',
                7: 'углубляйтесь в детали',
                8: 'заключайте сделки и достигайте целей',
                9: 'подводите промежуточные итоги'
            },
            end: {
                1: 'анализируйте результаты',
                2: 'отдыхайте в кругу близких',
                3: 'радуйтесь и наслаждайтесь',
                4: 'приводите дела в порядок',
                5: 'планируйте следующую неделю',
                6: 'проводите время с семьей',
                7: 'медитируйте и восстанавливайтесь',
                8: 'празднуйте достижения',
                9: 'отпускайте и прощайте'
            }
        };

        return advices[phase]?.[weekNumber] || 'будьте внимательны к знакам';
    }

    /**
     * Главная тема недели
     */
    getMainTheme(weekNumber) {
        const themes = {
            1: 'начало и инициатива',
            2: 'гармония и партнерство',
            3: 'творчество и радость',
            4: 'порядок и структура',
            5: 'перемены и свобода',
            6: 'любовь и забота',
            7: 'анализ и мудрость',
            8: 'успех и изобилие',
            9: 'завершение и трансформация',
            11: 'интуиция и вдохновение',
            22: 'масштабные свершения'
        };
        return themes[weekNumber] || 'гармоничное развитие';
    }
}

module.exports = WeekForecastService;