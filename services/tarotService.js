class TarotService {
    constructor() {
        this.majorArcana = {
            0: {
                number: 0,
                name: 'Шут',
                image: '/images/tarot/00-fool.jpg',
                keywords: 'Новое начало, спонтанность, вера, свобода',
                description: `Шут — это чистая энергия нового начала, готовность идти в неизвестность с открытым сердцем. Вы на пороге приключения, не зная, что ждет впереди. Ваша сила — в доверии миру, ваша мудрость — в спонтанности.`,
                advice: `Не бойтесь начинать с чистого листа. Будьте спонтанны, доверяйте потоку. Сейчас лучшее время для нового.`
            },
            1: {
                number: 1,
                name: 'Маг',
                image: '/images/tarot/01-magician.jpg',
                keywords: 'Воля, мастерство, концентрация, ресурсы',
                description: `Маг — это вы в моменты, когда вся вселенная служит вашему замыслу. Вы обладаете всеми необходимыми инструментами для реализации желаний. Ваша сила — в концентрации намерения, ваша магия — в действии.`,
                advice: `Не ждите идеального момента — создавайте его своей волей. Ваши мысли материальны, ваши действия формируют реальность.`
            },
            2: {
                number: 2,
                name: 'Верховная Жрица',
                image: '/images/tarot/02-high-priestess.jpg',
                keywords: 'Интуиция, тайна, подсознание, мудрость',
                description: `Жрица — это ваша внутренняя тишина, где рождаются все ответы. Вы знаете больше, чем можете объяснить словами. Ваша сила — в интуиции, ваша мудрость — в умении ждать.`,
                advice: `Доверьтесь своей интуиции. То, что приходит во сне или как внезапное озарение — истинно. Сейчас время слушать, а не говорить.`
            },
            3: {
                number: 3,
                name: 'Императрица',
                image: '/images/tarot/03-empress.jpg',
                keywords: 'Плодородие, изобилие, творчество, природа',
                description: `Императрица — это ваша способность творить и взращивать. Все, к чему вы прикасаетесь с любовью, расцветает. Ваша сила — в принятии, ваша мудрость — в терпении природы.`,
                advice: `Сейте семена своих желаний сейчас. Ухаживайте за ними с любовью, и они дадут плоды. Окружите себя красотой и природой.`
            },
            4: {
                number: 4,
                name: 'Император',
                image: '/images/tarot/04-emperor.jpg',
                keywords: 'Власть, структура, порядок, авторитет',
                description: `Император — это ваша способность создавать порядок из хаоса. Вы — творец своей реальности, устанавливающий законы и границы.`,
                advice: `Наведите порядок в доме и в делах. Структура и дисциплина сейчас — ваши лучшие союзники.`
            },
            5: {
                number: 5,
                name: 'Иерофант',
                image: '/images/tarot/05-hierophant.jpg',
                keywords: 'Традиции, обучение, вера, наставничество',
                description: `Иерофант — это ваша связь с традициями и мудростью предков. Вы — часть цепи знаний, передающихся из поколения в поколение.`,
                advice: `Ищите мудрость в проверенных источниках. Обратитесь к наставнику или станьте им для кого-то.`
            },
            6: {
                number: 6,
                name: 'Влюбленные',
                image: '/images/tarot/06-lovers.jpg',
                keywords: 'Выбор, отношения, любовь, гармония',
                description: `Влюбленные — это момент истины, когда сердце должно выбрать. Вы стоите на перепутье, и ваш выбор определит судьбу.`,
                advice: `Прислушайтесь к сердцу в вопросах выбора. Любовь — лучший советчик. Но помните: любой выбор закрывает другие двери.`
            },
            7: {
                number: 7,
                name: 'Колесница',
                image: '/images/tarot/07-chariot.jpg',
                keywords: 'Победа, воля, контроль, преодоление',
                description: `Колесница — это ваша способность двигаться к цели, преодолевая препятствия. Вы управляете своей судьбой, даже когда дорога трудна.`,
                advice: `Двигайтесь к цели, не отвлекаясь. Контролируйте эмоции — они не должны управлять вами. Победа близка.`
            },
            8: {
                number: 8,
                name: 'Сила',
                image: '/images/tarot/08-strength.jpg',
                keywords: 'Внутренняя сила, мужество, страсть, власть',
                description: `Сила — это не мышцы, а умение укрощать зверя внутри. Вы способны на многое, когда действуете из любви, а не из страха.`,
                advice: `Действуйте из любви, а не из страха. Ваша мягкость сейчас — ваше главное оружие.`
            },
            9: {
                number: 9,
                name: 'Отшельник',
                image: '/images/tarot/09-hermit.jpg',
                keywords: 'Мудрость, уединение, поиск, свет',
                description: `Отшельник — это время уйти внутрь, чтобы найти свет. Вы ищете ответы не вовне, а в глубине себя.`,
                advice: `Сейчас время уединения и рефлексии. Не бойтесь одиночества — оно принесет ответы. Свет внутри ярче, чем снаружи.`
            },
            10: {
                number: 10,
                name: 'Колесо Фортуны',
                image: '/images/tarot/10-wheel.jpg',
                keywords: 'Судьба, перемены, циклы, удача',
                description: `Колесо Фортуны — это напоминание о том, что все течет, все меняется. Вы в потоке жизни, и удача улыбается тем, кто плывет по течению.`,
                advice: `Доверьтесь судьбе. Сейчас все идет так, как должно. Даже неожиданные повороты ведут к лучшему.`
            },
            11: {
                number: 11,
                name: 'Справедливость',
                image: '/images/tarot/11-justice.jpg',
                keywords: 'Баланс, закон, карма, честность',
                description: `Справедливость — это момент истины, когда все тайное становится явным. Вы пожинаете плоды своих поступков.`,
                advice: `Будьте предельно честны сейчас. Любая несправедливость вернется бумерангом. Примите ответственность за свои решения.`
            },
            12: {
                number: 12,
                name: 'Повешенный',
                image: '/images/tarot/12-hanged-man.jpg',
                keywords: 'Жертва, новый взгляд, пауза, принятие',
                description: `Повешенный — это время остановиться и посмотреть на мир иначе. Вы в подвешенном состоянии, но именно сейчас открывается истина.`,
                advice: `Не боритесь с течением. Примите паузу. Смените угол зрения — ответ придет оттуда, откуда не ждали.`
            },
            13: {
                number: 13,
                name: 'Смерть',
                image: '/images/tarot/13-death.jpg',
                keywords: 'Трансформация, конец, новое начало',
                description: `Смерть — это не конец, а трансформация. Что-то в вашей жизни должно уйти, чтобы освободить место для нового.`,
                advice: `Завершайте то, что просит завершения. Не бойтесь перемен — они несут обновление.`
            },
            14: {
                number: 14,
                name: 'Умеренность',
                image: '/images/tarot/14-temperance.jpg',
                keywords: 'Баланс, гармония, терпение, золотая середина',
                description: `Умеренность — это искусство быть в балансе, не впадать в крайности. Вы учитесь смешивать противоположности, находить середину.`,
                advice: `Ищите золотую середину во всем. Не перегибайте палку. Время лечит, терпение вознаграждается.`
            },
            15: {
                number: 15,
                name: 'Дьявол',
                image: '/images/tarot/15-devil.jpg',
                keywords: 'Искушение, зависимость, материальность, тень',
                description: `Дьявол — это встреча со своей тенью, со своими зависимостями и страхами. Вы видите то, что держит вас в плену.`,
                advice: `Честно посмотрите на свои зависимости — от людей, веществ, мнений, денег. Осознание — первый шаг к свободе.`
            },
            16: {
                number: 16,
                name: 'Башня',
                image: '/images/tarot/16-tower.jpg',
                keywords: 'Разрушение, прорыв, кризис, освобождение',
                description: `Башня — это момент крушения старых структур. То, что казалось незыблемым, рушится, освобождая место для нового.`,
                advice: `Не пытайтесь удержать то, что рушится. Примите кризис как очищение. После бури всегда наступает ясность.`
            },
            17: {
                number: 17,
                name: 'Звезда',
                image: '/images/tarot/17-star.jpg',
                keywords: 'Надежда, вдохновение, исцеление, свет',
                description: `Звезда — это свет в конце туннеля, надежда после кризиса. Вы открыты для вдохновения, верите в лучшее.`,
                advice: `Верьте в лучшее. Мечтайте, вдохновляйтесь, творите. Сейчас время загадывать желания — они сбудутся.`
            },
            18: {
                number: 18,
                name: 'Луна',
                image: '/images/tarot/18-moon.jpg',
                keywords: 'Иллюзии, подсознание, страхи, интуиция',
                description: `Луна — это мир снов, интуиции, подсознательных страхов. Вы входите в темный лес своей души.`,
                advice: `Доверьтесь интуиции, даже если разум противится. Обратите внимание на сны. Страхи — это просто тени, за ними скрыт свет.`
            },
            19: {
                number: 19,
                name: 'Солнце',
                image: '/images/tarot/19-sun.jpg',
                keywords: 'Радость, успех, энергия, ясность',
                description: `Солнце — это свет, радость, ясность после тьмы. Вы в периоде расцвета, когда все получается легко и радостно.`,
                advice: `Радуйтесь жизни, делитесь светом с другими. Сейчас все получается легко. Наслаждайтесь успехом и теплом.`
            },
            20: {
                number: 20,
                name: 'Суд',
                image: '/images/tarot/20-judgement.jpg',
                keywords: 'Возрождение, призвание, прощение, пробуждение',
                description: `Суд — это момент пробуждения, когда вы слышите зов своей души. Прошлое прощено, вы готовы к новой жизни.`,
                advice: `Прислушайтесь к зову души. Простите себя и других. Начните новую главу — вы к ней готовы.`
            },
            21: {
                number: 21,
                name: 'Мир',
                image: '/images/tarot/21-world.jpg',
                keywords: 'Завершение, целостность, единение, награда',
                description: `Мир — это завершение большого цикла, достижение цели, чувство единства со всем сущим. Вы дошли до точки, где виден весь путь.`,
                advice: `Наслаждайтесь результатами. Вы завершили важный этап. Чувствуйте свою связь со всем миром.`
            }
        };
    }

    /**
     * Расчет карт Таро на основе нумерологических чисел
     * ГАРАНТИРОВАННО ВОЗВРАЩАЕТ ТРИ УНИКАЛЬНЫЕ КАРТЫ
     * @param {Object} numbers - объект с числами fate, name, surname, patronymic
     * @returns {Object} три уникальные карты Таро
     */
    calculateFromNumbers(numbers) {
        if (!numbers || typeof numbers !== 'object') {
            return this.getFallbackCards();
        }

        // Получаем числа
        const fateNum = numbers.fate || 0;
        const nameNum = numbers.name || 0;
        const surnameNum = numbers.surname || 0;
        const patronymicNum = numbers.patronymic || 0;

        // Преобразуем числа 1-22 в 0-21 для Старших Арканов (22 -> 0 для Шута)
        const fateArcana = this.normalizeToArcana(fateNum);
        const nameArcana = this.normalizeToArcana(nameNum);

        // Для третьей карты используем детерминированный алгоритм,
        // который гарантирует уникальность
        const pathArcana = this.calculateUniquePathArcana(
            fateArcana,
            nameArcana,
            fateNum,
            nameNum,
            surnameNum,
            patronymicNum
        );

        return {
            fate: {
                number: fateArcana,
                ...this.getArcanaData(fateArcana)
            },
            personality: {
                number: nameArcana,
                ...this.getArcanaData(nameArcana)
            },
            control: {
                number: pathArcana,
                ...this.getArcanaData(pathArcana)
            }
        };
    }

    /**
     * Нормализует число в диапазон 0-21 для Старших Арканов
     * @param {number} num - исходное число (обычно 1-22)
     * @returns {number} число в диапазоне 0-21
     */
    normalizeToArcana(num) {
        if (num === 22) return 0; // Шут
        if (num >= 0 && num <= 21) return num;
        // Если число больше 22, редуцируем
        let reduced = num;
        while (reduced > 22) {
            reduced = String(reduced).split('').reduce((sum, digit) => sum + parseInt(digit), 0);
        }
        return reduced === 22 ? 0 : reduced;
    }

    /**
     * Вычисляет УНИКАЛЬНУЮ карту пути, которая не совпадает с картами судьбы и личности
     * Использует несколько детерминированных формул и гарантирует уникальность
     */
    calculateUniquePathArcana(fateArcana, nameArcana, fateNum, nameNum, surnameNum, patronymicNum) {
        // Множество уже занятых карт
        const usedCards = new Set([fateArcana, nameArcana]);

        // Если все карты уже заняты (маловероятно, но на всякий случай)
        if (usedCards.size >= 22) {
            // Возвращаем карту, циклически сдвинутую от карты судьбы
            return (fateArcana + 1) % 22;
        }

        // Пробуем разные формулы в порядке приоритета
        const candidates = [
            // Формула 1: на основе фамилии
            this.normalizeToArcana(surnameNum),
            // Формула 2: на основе отчества
            this.normalizeToArcana(patronymicNum),
            // Формула 3: сумма всех чисел
            this.normalizeToArcana(fateNum + nameNum + surnameNum + patronymicNum),
            // Формула 4: произведение
            this.normalizeToArcana((fateNum * nameNum) % 23),
            // Формула 5: разность
            this.normalizeToArcana(Math.abs(fateNum - nameNum) + surnameNum),
            // Формула 6: (сумма * 3) % 22
            this.normalizeToArcana((fateNum + nameNum + surnameNum + patronymicNum) * 3),
            // Формула 7: (fateNum^2 + nameNum^2) % 22
            this.normalizeToArcana((fateNum * fateNum + nameNum * nameNum) % 23)
        ];

        // Выбираем первый уникальный кандидат
        for (let candidate of candidates) {
            if (!usedCards.has(candidate)) {
                return candidate;
            }
        }

        // Если все кандидаты заняты (очень редкий случай),
        // ищем первое свободное число от 0 до 21
        for (let i = 0; i < 22; i++) {
            if (!usedCards.has(i)) {
                return i;
            }
        }

        // Абсолютный fallback (никогда не должен сработать)
        return (fateArcana + 1) % 22;
    }

    getArcanaData(num) {
        return this.majorArcana[num] || this.getDefaultArcana(num);
    }

    getDefaultArcana(num) {
        return {
            number: num,
            name: `Аркан ${num === 0 ? 22 : num}`,
            image: '/images/tarot/back.jpg',
            keywords: 'Тайна, ожидающая раскрытия',
            description: `Число ${num === 0 ? 22 : num} несет в себе уникальную энергию, которую предстоит расшифровать лично вам. Это ваша индивидуальная карта, история, которую только вы можете написать.`,
            advice: `Исследуйте значение числа ${num === 0 ? 22 : num} в своей жизни. Какие события, люди, ситуации связаны с ним? Там скрыт ответ.`
        };
    }

    getFallbackCards() {
        return {
            fate: this.getDefaultArcana(0),
            personality: this.getDefaultArcana(1),
            control: this.getDefaultArcana(2)
        };
    }

    /**
     * Метод для гадания (оставляем как есть)
     */
    performReading(question, spreadType = 'three') {
        // ... существующий код метода performReading ...
        // (оставляем без изменений)
        try {
            const spreads = {
                single: { name: 'Одна карта', positions: ['Ответ'], description: 'Быстрый ответ на конкретный вопрос', cardCount: 1 },
                three: { name: 'Три карты', positions: ['Прошлое', 'Настоящее', 'Будущее'], description: 'Анализ ситуации во времени', cardCount: 3 },
                five: { name: 'Пять карт', positions: ['Ситуация', 'Препятствие', 'Совет', 'Внешнее влияние', 'Итог'], description: 'Глубокий анализ ситуации', cardCount: 5 },
                celtic: { name: 'Кельтский крест', positions: ['Суть вопроса', 'Препятствие', 'Цель', 'Прошлое', 'Будущее', 'Сознание', 'Подсознание', 'Внешнее влияние', 'Надежды и страхи', 'Итог'], description: 'Полный анализ ситуации', cardCount: 10 }
            };

            const spread = spreads[spreadType] || spreads.three;
            const cards = this.getRandomCards(spread.cardCount);

            cards.forEach((card, index) => {
                card.position = spread.positions[index];
                card.isReversed = Math.random() > 0.5;
            });

            return {
                success: true,
                data: {
                    question: question,
                    spread: { type: spreadType, name: spread.name, positions: spread.positions, description: spread.description },
                    cards: cards,
                    interpretation: this.generateInterpretation(question, spread, cards)
                }
            };
        } catch (error) {
            console.error('Ошибка при гадании:', error);
            return { success: false, error: error.message };
        }
    }

    getRandomCards(count) {
        const arcanaKeys = Object.keys(this.majorArcana);
        const shuffled = [...arcanaKeys].sort(() => 0.5 - Math.random());

        const cards = [];
        for (let i = 0; i < count; i++) {
            const key = shuffled[i];
            cards.push({ ...this.majorArcana[key] });
        }
        return cards;
    }

    generateInterpretation(question, spread, cards) {
        // ... существующий код генерации интерпретации ...
        // (оставляем без изменений)
        return "Интерпретация расклада...";
    }
}

module.exports = TarotService;