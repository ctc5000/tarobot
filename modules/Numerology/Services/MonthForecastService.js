// modules/Numerology/Services/MonthForecastService.js

const NumerologyService = require('../../../services/numerology');
const TarotService = require('../../../services/tarotService');

class MonthForecastService {
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
     * Полный расчет месячного прогноза
     */
    async calculateMonthForecast(fullName, birthDate, targetDate, userId = null) {
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

            // Получаем даты начала и конца месяца
            const monthDates = this.getMonthDates(formattedTargetDate);
            const monthStart = monthDates.start;
            const monthEnd = monthDates.end;
            const monthName = monthDates.monthName;
            const year = monthDates.year;

            // 1. ЧИСЛО МЕСЯЦА (основная вибрация)
            const monthNumber = this.calculateMonthNumber(monthStart, personNumbers);

            // 2. ЧИСЛО ГОДА (год, в который попадает месяц)
            const yearNumber = this.calculateYearNumber(monthStart, personNumbers);

            // 3. ПОКРОВИТЕЛЬ МЕСЯЦА (планета)
            const monthRuler = this.getMonthRuler(monthNumber);

            // 4. ЭНЕРГЕТИЧЕСКИЙ ТИП МЕСЯЦА
            const monthEnergy = this.getMonthEnergy(monthNumber);

            // 5. СТИХИЯ МЕСЯЦА
            const monthElement = this.getMonthElement(monthNumber);

            // 6. ПОЛНЫЙ АНАЛИЗ МЕСЯЦА
            const monthAnalysis = this.getMonthAnalysis(monthNumber, yearNumber, personNumbers);

            // 7. ПРОГНОЗ ПО СФЕРАМ ЖИЗНИ НА МЕСЯЦ
            const lifeAreas = this.getLifeAreasForecast(monthNumber, personNumbers);

            // 8. НЕДЕЛЬНАЯ РАЗБИВКА (по неделям месяца)
            const weeklyBreakdown = this.getWeeklyBreakdown(monthDates, personNumbers, fullName);

            // 9. ВАЖНЫЕ ДАТЫ МЕСЯЦА
            const importantDates = this.getImportantDates(monthDates, personNumbers);

            // 10. КАРТА ТАРО МЕСЯЦА
            const tarotCard = this.getMonthTarot(monthNumber, yearNumber, personNumbers);

            // 11. ФЕН-ШУЙ НА МЕСЯЦ
            const fengShui = this.getMonthFengShui(monthNumber, personNumbers);

            // 12. ЦВЕТА МЕСЯЦА
            const colors = this.getMonthColors(monthNumber);

            // 13. КАМНИ МЕСЯЦА
            const crystals = this.getMonthCrystals(monthNumber);

            // 14. АРОМАТЫ МЕСЯЦА
            const scents = this.getMonthScents(monthNumber);

            // 15. АФФИРМАЦИЯ НА МЕСЯЦ
            const affirmation = this.getMonthAffirmation(monthNumber, personNumbers, firstName);

            // 16. ГЛУБИННАЯ ИНТЕРПРЕТАЦИЯ МЕСЯЦА
            const interpretation = this.generateMonthInterpretation(
                fullName, monthName, year, monthStart, monthEnd, monthNumber,
                monthAnalysis, lifeAreas, weeklyBreakdown, personNumbers
            );

            // 17. ГЛУБИННЫЙ ПОРТРЕТ МЕСЯЦА
            const deepPortrait = this.generateMonthDeepPortrait(
                fullName, monthName, year, monthNumber, monthEnergy,
                weeklyBreakdown, personNumbers, tarotCard
            );

            return {
                success: true,
                data: {
                    fullName,
                    birthDate,
                    monthRange: {
                        start: monthStart,
                        end: monthEnd,
                        monthName: monthName,
                        year: year
                    },
                    forecast: {
                        type: 'month',
                        monthNumber: monthNumber,
                        yearNumber: yearNumber,
                        monthRuler: monthRuler,
                        monthEnergy: monthEnergy,
                        monthElement: monthElement,
                        monthAnalysis: monthAnalysis,
                        lifeAreas: lifeAreas,
                        weeklyBreakdown: weeklyBreakdown,
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
            console.error('Error in calculateMonthForecast:', error);
            throw error;
        }
    }

    /**
     * Получение дат месяца
     */
    getMonthDates(targetDate) {
        const [day, month, year] = targetDate.split('.');
        const date = new Date(year, month - 1, 1);

        // Название месяца
        const monthNames = [
            'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
            'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
        ];
        const monthName = monthNames[parseInt(month) - 1];

        // Первый день месяца
        const firstDay = new Date(year, month - 1, 1);

        // Последний день месяца
        const lastDay = new Date(year, month, 0);

        // Получаем все дни месяца
        const daysInMonth = lastDay.getDate();
        const allDays = [];

        for (let i = 1; i <= daysInMonth; i++) {
            const currentDate = new Date(year, month - 1, i);
            allDays.push({
                date: this.formatDate(currentDate),
                dayNumber: i,
                dayOfWeek: this.getDayOfWeek(currentDate),
                isWeekend: this.isWeekend(currentDate)
            });
        }

        return {
            start: this.formatDate(firstDay),
            end: this.formatDate(lastDay),
            monthName: monthName,
            year: parseInt(year),
            daysInMonth: daysInMonth,
            allDays: allDays,
            firstDayOfWeek: firstDay.getDay()
        };
    }

    /**
     * Расчет числа месяца
     */
    calculateMonthNumber(monthStart, personNumbers) {
        const [day, month, year] = monthStart.split('.');

        // Суммируем месяц, год и число судьбы
        const sum = parseInt(month) + parseInt(year) + personNumbers.fate;
        return this.reduceNumber(sum);
    }

    /**
     * Расчет числа года
     */
    calculateYearNumber(monthStart, personNumbers) {
        const [day, month, year] = monthStart.split('.');
        const sum = parseInt(year) + personNumbers.fate;
        return this.reduceNumber(sum);
    }

    /**
     * Получение дня недели
     */
    getDayOfWeek(date) {
        const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
        return days[date.getDay()];
    }

    /**
     * Проверка на выходной
     */
    isWeekend(date) {
        const day = date.getDay();
        return day === 0 || day === 6;
    }

    /**
     * Получение покровителя месяца
     */
    getMonthRuler(monthNumber) {
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
        return rulers[monthNumber] || { planet: 'Меркурий', element: 'Воздух', quality: 'Адаптивность' };
    }

    /**
     * Получение энергетического типа месяца
     */
    getMonthEnergy(monthNumber) {
        const energies = {
            1: '🔴 Месяц активного начала и лидерства',
            2: '🔵 Месяц гармонии и партнерства',
            3: '🟡 Творческий месяц',
            4: '🟢 Месяц порядка и структуры',
            5: '🟣 Месяц перемен и возможностей',
            6: '💗 Месяц любви и заботы',
            7: '🔮 Месяц анализа и мудрости',
            8: '💰 Месяц успеха и изобилия',
            9: '🔄 Месяц завершения и трансформации',
            11: '✨ Месяц духовного роста',
            22: '🏗️ Месяц великих свершений'
        };
        return energies[monthNumber] || '🌀 Нейтральный месяц';
    }

    /**
     * Получение стихии месяца
     */
    getMonthElement(monthNumber) {
        const elements = {
            1: 'Огонь', 2: 'Вода', 3: 'Воздух', 4: 'Земля',
            5: 'Воздух', 6: 'Земля', 7: 'Вода', 8: 'Земля',
            9: 'Огонь', 11: 'Дух', 22: 'Материя'
        };
        return elements[monthNumber] || 'Воздух';
    }

    /**
     * Полный анализ месяца
     */
    getMonthAnalysis(monthNumber, yearNumber, personNumbers) {
        const analyses = {
            1: {
                theme: '🌟 НОВЫЕ НАЧАЛА',
                description: 'Месяц идеально подходит для старта новых проектов, карьерных изменений и важных решений. Энергия лидерства и уверенности.',
                advice: 'Начинайте то, что давно откладывали. Берите инициативу в свои руки.',
                opportunities: ['Новые проекты', 'Смена работы', 'Открытие бизнеса'],
                challenges: ['Излишняя самоуверенность', 'Конфликты с начальством']
            },
            2: {
                theme: '🤝 ГАРМОНИЯ И ПАРТНЕРСТВО',
                description: 'Месяц сотрудничества и дипломатии. Удачное время для переговоров, укрепления отношений и командной работы.',
                advice: 'Слушайте партнеров, ищите компромиссы. Вместе вы сильнее.',
                opportunities: ['Партнерства', 'Переговоры', 'Командные проекты'],
                challenges: ['Нерешительность', 'Зависимость от чужого мнения']
            },
            3: {
                theme: '🎨 ТВОРЧЕСТВО И РАДОСТЬ',
                description: 'Креативный месяц. Вдохновение и оптимизм будут вашими спутниками. Хорошо для самовыражения и общения.',
                advice: 'Творите, общайтесь, делитесь идеями. Радость притягивает удачу.',
                opportunities: ['Творческие проекты', 'Новые знакомства', 'Презентации'],
                challenges: ['Поверхностность', 'Разбросанность']
            },
            4: {
                theme: '🏛️ СТРУКТУРА И ПОРЯДОК',
                description: 'Месяц организации и планирования. Создавайте системы, наводите порядок, стройте планы на будущее.',
                advice: 'Порядок в делах создает порядок в жизни. Структурируйте задачи.',
                opportunities: ['Планирование', 'Организация', 'Завершение дел'],
                challenges: ['Ригидность', 'Застой']
            },
            5: {
                theme: '🦋 ПЕРЕМЕНЫ И СВОБОДА',
                description: 'Динамичный месяц. Возможности, путешествия, новые впечатления. Будьте открыты к изменениям.',
                advice: 'Не бойтесь перемен. Спонтанные решения могут привести к успеху.',
                opportunities: ['Путешествия', 'Новые знакомства', 'Быстрые решения'],
                challenges: ['Непостоянство', 'Рискованные действия']
            },
            6: {
                theme: '💖 ЛЮБОВЬ И ЗАБОТА',
                description: 'Семейный месяц. Время для близких, домашнего уюта и заботы о других. Гармония в отношениях.',
                advice: 'Уделите время семье. Забота о других вернется сторицей.',
                opportunities: ['Семейные дела', 'Укрепление отношений', 'Благотворительность'],
                challenges: ['Гиперопека', 'Растворение в других']
            },
            7: {
                theme: '🔍 МУДРОСТЬ И АНАЛИЗ',
                description: 'Месяц познания. Углубляйтесь в исследования, учитесь, анализируйте. Интуиция особенно сильна.',
                advice: 'Ищите ответы внутри. Медитация и уединение принесут инсайты.',
                opportunities: ['Обучение', 'Исследования', 'Духовные практики'],
                challenges: ['Изоляция', 'Подозрительность']
            },
            8: {
                theme: '⚖️ УСПЕХ И ИЗОБИЛИЕ',
                description: 'Месяц достижений. Хорошо для финансовых вопросов, карьеры, крупных сделок. Энергия власти и успеха.',
                advice: 'Действуйте решительно. Ваши усилия приведут к материальным результатам.',
                opportunities: ['Финансы', 'Карьера', 'Крупные сделки'],
                challenges: ['Властность', 'Меркантильность']
            },
            9: {
                theme: '🔄 ЗАВЕРШЕНИЕ И ТРАНСФОРМАЦИЯ',
                description: 'Месяц подведения итогов. Отпускайте старое, завершайте проекты, прощайте. Освобождайте место для нового.',
                advice: 'Благодарите за опыт и отпускайте. Завершение - это новое начало.',
                opportunities: ['Завершение проектов', 'Прощение', 'Очищение'],
                challenges: ['Фатализм', 'Потери']
            },
            11: {
                theme: '💫 ПРОЗРЕНИЕ И ВДОХНОВЕНИЕ',
                description: 'Духовный месяц. Интуиция и прозрения. Слушайте знаки судьбы.',
                advice: 'Доверяйте внутреннему голосу. Он приведет к важным открытиям.',
                opportunities: ['Интуитивные решения', 'Творчество', 'Духовность'],
                challenges: ['Иллюзии', 'Нервное напряжение']
            },
            22: {
                theme: '🏗️ ВЕЛИКИЕ СВЕРШЕНИЯ',
                description: 'Масштабный месяц. Ваши идеи могут воплотиться в реальность. Стройте планы на будущее.',
                advice: 'Мыслите масштабно. Ваши мечты имеют силу стать реальностью.',
                opportunities: ['Масштабные проекты', 'Долгосрочное планирование', 'Реализация'],
                challenges: ['Грандиозные планы без подготовки', 'Перегрузка']
            }
        };

        const base = analyses[monthNumber] || {
            theme: '🌀 РАЗВИТИЕ',
            description: 'Месяц гармоничного развития. Следуйте за энергией.',
            advice: 'Будьте внимательны к возможностям.',
            opportunities: ['Новые возможности', 'Развитие'],
            challenges: ['Неопределенность']
        };

        // Добавляем персонализацию
        base.personalNote = this.getPersonalMonthNote(monthNumber, personNumbers);

        return base;
    }

    /**
     * Персональная заметка к месяцу
     */
    getPersonalMonthNote(monthNumber, personNumbers) {
        const notes = {
            1: `Ваше число судьбы ${personNumbers.fate} усиливает лидерские качества в этом месяце.`,
            2: `Число имени ${personNumbers.name} помогает в дипломатии и партнерстве.`,
            3: `Ваша креативность (число ${personNumbers.name}) особенно сильна в этом месяце.`,
            4: `Число фамилии ${personNumbers.surname} дает структурность и организованность.`,
            5: `Число судьбы ${personNumbers.fate} зовет к переменам и приключениям.`,
            6: `Число отчества ${personNumbers.patronymic} усиливает заботу и эмпатию.`,
            7: `Ваш аналитический ум (число ${personNumbers.name}) особенно остр.`,
            8: `Число фамилии ${personNumbers.surname} ведет к успеху и изобилию.`,
            9: `Число судьбы ${personNumbers.fate} помогает в завершении циклов.`
        };
        return notes[monthNumber] || `Ваши личные числа (${personNumbers.fate}-${personNumbers.name}-${personNumbers.surname}-${personNumbers.patronymic}) создают уникальную вибрацию.`;
    }

    /**
     * Прогноз по сферам жизни на месяц
     */
    getLifeAreasForecast(monthNumber, personNumbers) {
        const forecasts = {
            1: {
                career: '🌟 Карьера: Время для лидерства и новых начинаний. Берите инициативу.',
                love: '❤️ Любовь: Проявляйте активность в отношениях. Для одиноких - отличный месяц для знакомств.',
                health: '🌿 Здоровье: Высокая энергия. Займитесь спортом, активным отдыхом.',
                finance: '💰 Финансы: Благоприятно для инвестиций и крупных покупок.'
            },
            2: {
                career: '🤝 Карьера: Успех в командной работе. Проводите переговоры, ищите партнеров.',
                love: '💕 Любовь: Время для романтики и укрепления связей.',
                health: '💧 Здоровье: Обратите внимание на эмоциональное состояние. Водные процедуры.',
                finance: '📊 Финансы: Консультируйтесь со специалистами. Избегайте рискованных вложений.'
            },
            3: {
                career: '🎨 Карьера: Творческий подход принесет успех. Генерируйте идеи.',
                love: '💞 Любовь: Легкость и флирт. Отличный месяц для свиданий.',
                health: '🩰 Здоровье: Энергия на подъеме. Танцы, йога, творчество.',
                finance: '🎲 Финансы: Спонтанные решения могут быть удачными.'
            },
            4: {
                career: '📋 Карьера: Время порядка и структуры. Планируйте, организуйте.',
                love: '🏡 Любовь: Стабильность в отношениях. Семейные дела.',
                health: '💪 Здоровье: Обратите внимание на спину и суставы.',
                finance: '💰 Финансы: Накопление и экономия. Планируйте бюджет.'
            },
            5: {
                career: '✈️ Карьера: Командировки, новые проекты, расширение горизонтов.',
                love: '🦋 Любовь: Новые знакомства. Внесите разнообразие.',
                health: '🚴 Здоровье: Высокая подвижность. Путешествия.',
                finance: '💸 Финансы: Неожиданные доходы, но и траты.'
            },
            6: {
                career: '🤲 Карьера: Успех в сфере услуг, образования, помощи другим.',
                love: '💖 Любовь: Гармония и романтика. Семейные ужины.',
                health: '🍲 Здоровье: Обратите внимание на питание.',
                finance: '🏠 Финансы: Траты на семью и дом.'
            },
            7: {
                career: '🔬 Карьера: Успех в науке, аналитике, IT. Глубокие исследования.',
                love: '💭 Любовь: Глубокие разговоры. Поймите желания партнера.',
                health: '🧘 Здоровье: Нервная система. Медитация.',
                finance: '📈 Финансы: Анализ финансов. Планирование инвестиций.'
            },
            8: {
                career: '💼 Карьера: Успех в бизнесе, финансах, управлении. Заключайте сделки.',
                love: '💍 Любовь: Статус и отношения. Обсуждайте совместные цели.',
                health: '🧘‍♂️ Здоровье: Позвоночник и суставы.',
                finance: '💰 Финансы: Крупные деньги. Инвестиции.'
            },
            9: {
                career: '🎯 Карьера: Завершение проектов. Передача дел, подведение итогов.',
                love: '🕊️ Любовь: Отпустите прошлые отношения. Простите.',
                health: '🌱 Здоровье: Очищение. Детокс.',
                finance: '💳 Финансы: Завершение финансовых циклов. Отдача долгов.'
            }
        };

        return forecasts[monthNumber] || {
            career: '🔄 Карьера: Обычный рабочий месяц. Будьте внимательны.',
            love: '💗 Любовь: Уделите внимание партнеру.',
            health: '🌿 Здоровье: Следите за самочувствием.',
            finance: '📊 Финансы: Будьте внимательны с деньгами.'
        };
    }

    /**
     * Недельная разбивка месяца
     */
    getWeeklyBreakdown(monthDates, personNumbers, fullName) {
        const weeks = [];
        const allDays = monthDates.allDays;
        const daysInMonth = monthDates.daysInMonth;

        // Группируем дни по неделям
        let weekNumber = 1;
        for (let i = 0; i < daysInMonth; i += 7) {
            const weekDays = allDays.slice(i, Math.min(i + 7, daysInMonth));

            if (weekDays.length > 0) {
                // Рассчитываем число недели
                const weekStart = weekDays[0].date;
                const weekEnd = weekDays[weekDays.length - 1].date;

                const [startDay, startMonth, startYear] = weekStart.split('.');
                const date = new Date(startYear, startMonth - 1, startDay);
                const startOfYear = new Date(startYear, 0, 1);
                const days = Math.floor((date - startOfYear) / (24 * 60 * 60 * 1000));
                const weekOfYear = Math.ceil((days + startOfYear.getDay() + 1) / 7);

                const weekSum = weekOfYear + parseInt(startMonth) + parseInt(startYear) + personNumbers.fate;
                const weekNumberValue = this.reduceNumber(weekSum);

                weeks.push({
                    weekNumber: weekNumber++,
                    weekNumberValue: weekNumberValue,
                    startDate: weekStart,
                    endDate: weekEnd,
                    days: weekDays,
                    focus: this.getWeekFocus(weekNumberValue, personNumbers),
                    energy: this.getWeekEnergy(weekNumberValue)
                });
            }
        }

        return weeks;
    }

    /**
     * Фокус недели
     */
    getWeekFocus(weekNumber, personNumbers) {
        const focuses = {
            1: `Новые начинания. Число судьбы ${personNumbers.fate} усиливает инициативу.`,
            2: `Партнерство и дипломатия. Число имени ${personNumbers.name} помогает в общении.`,
            3: `Творчество и самовыражение. Ваша креативность на высоте.`,
            4: `Порядок и структура. Число фамилии ${personNumbers.surname} дает организованность.`,
            5: `Перемены и свобода. Число судьбы ${personNumbers.fate} зовет к приключениям.`,
            6: `Забота и гармония. Число отчества ${personNumbers.patronymic} усиливает эмпатию.`,
            7: `Анализ и познание. Ваш ум особенно остр.`,
            8: `Успех и достижения. Число фамилии ${personNumbers.surname} ведет к победе.`,
            9: `Завершение и отпускание. Число судьбы ${personNumbers.fate} помогает трансформироваться.`
        };
        return focuses[weekNumber] || 'Гармоничное развитие';
    }

    /**
     * Энергия недели
     */
    getWeekEnergy(weekNumber) {
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
        return energies[weekNumber] || '⚡⚡⚡ Средняя';
    }

    /**
     * Важные даты месяца
     */
    getImportantDates(monthDates, personNumbers) {
        const importantDates = [];
        const allDays = monthDates.allDays;

        allDays.forEach(day => {
            const [d, m, y] = day.date.split('.');
            const daySum = parseInt(d) + parseInt(m) + parseInt(y) + personNumbers.fate;
            const dayNumber = this.reduceNumber(daySum);

            // Дни с особыми числами
            if ([1, 3, 5, 6, 8, 11, 22].includes(dayNumber)) {
                importantDates.push({
                    date: day.date,
                    dayNumber: dayNumber,
                    dayOfWeek: day.dayOfWeek,
                    reason: this.getImportantDateReason(dayNumber),
                    isWeekend: day.isWeekend
                });
            }
        });

        return importantDates;
    }

    /**
     * Причина важности даты
     */
    getImportantDateReason(number) {
        const reasons = {
            1: 'Отличный день для новых начинаний',
            3: 'Творческий день, благоприятный для самовыражения',
            5: 'День перемен и новых возможностей',
            6: 'Гармоничный день для любви и семьи',
            8: 'День успеха и финансовых решений',
            11: 'День прозрения и интуиции',
            22: 'День великих свершений'
        };
        return reasons[number] || 'Благоприятный день';
    }

    /**
     * Карта Таро на месяц
     */
    getMonthTarot(monthNumber, yearNumber, personNumbers) {
        try {
            const tarotIndex = (monthNumber + yearNumber + personNumbers.fate) % 22;

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
                number: monthNumber,
                name: 'Карта месяца',
                description: 'Следуйте за энергией месяца.',
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
        return descriptions[index] || 'Энергия месяца';
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
     * Фен-шуй на месяц
     */
    getMonthFengShui(monthNumber, personNumbers) {
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

        const base = elements[monthNumber] || { element: 'Воздух', zone: 'Восток', activation: 'Проветривание, легкие ткани' };

        return {
            ...base,
            advice: `В этом месяце активируйте ${base.zone} сектор. Используйте ${base.activation}. Ваше число судьбы ${personNumbers.fate} усилит эффект.`,
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
     * Цвета месяца
     */
    getMonthColors(monthNumber) {
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
        return colors[monthNumber] || ['Белый', 'Золотой'];
    }

    /**
     * Камни месяца
     */
    getMonthCrystals(monthNumber) {
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
        return crystals[monthNumber] || ['Горный хрусталь', 'Янтарь'];
    }

    /**
     * Ароматы месяца
     */
    getMonthScents(monthNumber) {
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
        return scents[monthNumber] || ['Лаванда', 'Сандал'];
    }

    /**
     * Аффирмация на месяц
     */
    getMonthAffirmation(monthNumber, personNumbers, firstName) {
        const affirmations = {
            1: `Я, ${firstName}, лидер своей жизни. В этом месяце я начинаю новые проекты с уверенностью.`,
            2: `Я, ${firstName}, в гармонии с собой и миром. Я доверяю своей интуиции.`,
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
        return affirmations[monthNumber] || `Я, ${firstName}, в гармонии с потоком жизни.`;
    }

    /**
     * Генерация интерпретации месяца
     */
    generateMonthInterpretation(fullName, monthName, year, monthStart, monthEnd, monthNumber, monthAnalysis, lifeAreas, weeklyBreakdown, personNumbers) {
        const [startDay, startMonth, startYear] = monthStart.split('.');
        const [endDay, endMonth, endYear] = monthEnd.split('.');
        const firstName = fullName.split(' ')[1] || fullName.split(' ')[0] || '';

        let interpretation = `
📜 **СВИТОК СУДЬБЫ НА МЕСЯЦ**
🗓️ **${monthName} ${year}** (${startDay}.${startMonth}.${startYear} — ${endDay}.${endMonth}.${endYear})

🌟 **ДЛЯ ${fullName.toUpperCase()}**

🔢 **ЧИСЛО МЕСЯЦА: ${monthNumber}**
${monthAnalysis.theme}

📊 **ОБЩИЙ ПРОГНОЗ**
${monthAnalysis.description}

💫 **ПЕРСОНАЛЬНАЯ НОТА**
${monthAnalysis.personalNote}

${monthAnalysis.advice}

🌅 **ПРОГНОЗ ПО СФЕРАМ ЖИЗНИ**
${lifeAreas.career}
${lifeAreas.love}
${lifeAreas.health}
${lifeAreas.finance}

📅 **КЛЮЧЕВЫЕ ВОЗМОЖНОСТИ МЕСЯЦА**
${monthAnalysis.opportunities.map(o => `• ${o}`).join('\n')}

⚠️ **НА ЧТО ОБРАТИТЬ ВНИМАНИЕ**
${monthAnalysis.challenges.map(c => `• ${c}`).join('\n')}

📆 **НЕДЕЛЬНАЯ РАЗБИВКА**
`;

        // Добавляем разбивку по неделям
        weeklyBreakdown.forEach(week => {
            interpretation += `
\n**Неделя ${week.weekNumber} (${week.startDate} — ${week.endDate})**
• Число недели: ${week.weekNumberValue}
• Энергия: ${week.energy}
• Фокус: ${week.focus}
`;
        });

        interpretation += `
\n💫 **СОВЕТ НА МЕСЯЦ**
${monthAnalysis.advice}

🔮 **ИНТУИТИВНОЕ ПОСЛАНИЕ**
В этом месяце ваша задача — интегрировать энергию числа ${monthNumber} в свою жизнь. 
Учитывая ваши личные числа (${personNumbers.fate}-${personNumbers.name}-${personNumbers.surname}-${personNumbers.patronymic}), 
наиболее гармонично это проявится в сферах, где вы можете использовать свои сильные стороны.
    `;

        return interpretation;
    }

    /**
     * Генерация глубинного портрета месяца
     */
    generateMonthDeepPortrait(fullName, monthName, year, monthNumber, monthEnergy, weeklyBreakdown, personNumbers, tarotCard) {
        const firstName = fullName.split(' ')[1] || fullName.split(' ')[0] || '';

        return `
🌌 **ГЛУБИННЫЙ ПОРТРЕТ МЕСЯЦА**
🗓️ **${monthName} ${year}**

**ДЛЯ: ${fullName}**

🌟 **ВАША УНИКАЛЬНАЯ ЭНЕРГЕТИКА НА ЭТОТ МЕСЯЦ**
${monthEnergy}

🔮 **АРХЕТИП МЕСЯЦА**
Этот месяц активирует в вас архетип ${this.getArchetype(monthNumber)}. 
Это значит, что вам предстоит ${this.getArchetypeDescription(monthNumber, firstName)}.

📊 **ЭНЕРГЕТИЧЕСКИЙ ПРОГНОЗ ПО НЕДЕЛЯМ**
${weeklyBreakdown.map(week => `• Неделя ${week.weekNumber}: ${week.energy} — ${week.focus}`).join('\n')}

🎴 **АРХЕТИПИЧЕСКОЕ ПОСЛАНИЕ**
Карта Таро месяца — **${tarotCard.name}** — призывает вас: "${tarotCard.advice.toLowerCase()}"
Для вас, ${firstName}, это означает, что в этом месяце особенно важно ${this.getPersonalTarotAdvice(tarotCard.number, personNumbers)}.

💫 **ИНТЕГРАЛЬНЫЙ СОВЕТ**
${firstName}, в этом месяце ваша уникальная комбинация чисел (${personNumbers.fate}-${personNumbers.name}-${personNumbers.surname}-${personNumbers.patronymic}) 
создает особый паттерн возможностей. Главная тема месяца: ${this.getMainTheme(monthNumber)}.

Помните: месяц — это важный цикл в вашей жизни. Проживите его осознанно, и вы увидите, как синхронизируетесь с ритмами вселенной.
    `;
    }

    /**
     * Получение архетипа
     */
    getArchetype(number) {
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
     * Главная тема
     */
    getMainTheme(number) {
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
        return themes[number] || 'гармоничное развитие';
    }
}

module.exports = MonthForecastService;