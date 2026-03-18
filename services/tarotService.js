// services/tarotService.js

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

        this.positionMeanings = {
            'Ситуация': 'описывает текущее состояние дел, то, что происходит вокруг вашего вопроса прямо сейчас',
            'Препятствие': 'показывает, что стоит на вашем пути, главное препятствие или вызов',
            'Совет': 'дает рекомендацию, как лучше поступить в данной ситуации',
            'Внешнее влияние': 'указывает на внешние силы или людей, которые влияют на ситуацию',
            'Итог': 'прогнозирует вероятный исход, если вы будете действовать согласно текущему курсу',
            'Прошлое': 'отражает события или энергии, которые привели вас к текущей ситуации',
            'Настоящее': 'описывает ваше текущее состояние и положение дел',
            'Будущее': 'показывает вероятное развитие событий в ближайшем будущем',
            'Ответ': 'дает прямой ответ на ваш вопрос',
            'Суть вопроса': 'раскрывает глубинный смысл вашего вопроса, то, что действительно важно',
            'Цель': 'показывает вашу истинную цель, даже если вы ее не осознаете',
            'Сознание': 'отражает то, что вы думаете о ситуации, ваши осознанные мысли',
            'Подсознание': 'раскрывает скрытые мотивы, страхи и желания',
            'Надежды и страхи': 'показывает ваши ожидания и опасения относительно ситуации'
        };

        this.questionCategories = {
            'любов': 'love',
            'отношени': 'love',
            'партнер': 'love',
            'брак': 'love',
            'семь': 'family',
            'работ': 'career',
            'бизнес': 'career',
            'карьер': 'career',
            'деньг': 'money',
            'финанс': 'money',
            'заработ': 'money',
            'здоров': 'health',
            'болезн': 'health',
            'самочувств': 'health',
            'развити': 'personal',
            'себ': 'personal',
            'путь': 'personal',
            'предназначени': 'personal'
        };
    }

    /**
     * Расчет карт Таро на основе нумерологических чисел
     */
    calculateFromNumbers(numbers) {
        if (!numbers || typeof numbers !== 'object') {
            return this.getFallbackCards();
        }

        const fateNum = numbers.fate || 0;
        const nameNum = numbers.name || 0;
        const surnameNum = numbers.surname || 0;
        const patronymicNum = numbers.patronymic || 0;

        const fateArcana = this.normalizeToArcana(fateNum);
        const nameArcana = this.normalizeToArcana(nameNum);

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
     */
    normalizeToArcana(num) {
        if (num === 22) return 0;
        if (num >= 0 && num <= 21) return num;

        let reduced = num;
        while (reduced > 22) {
            reduced = String(reduced).split('').reduce((sum, digit) => sum + parseInt(digit), 0);
        }
        return reduced === 22 ? 0 : reduced;
    }

    /**
     * Вычисляет уникальную карту пути
     */
    calculateUniquePathArcana(fateArcana, nameArcana, fateNum, nameNum, surnameNum, patronymicNum) {
        const usedCards = new Set([fateArcana, nameArcana]);

        if (usedCards.size >= 22) {
            return (fateArcana + 1) % 22;
        }

        const candidates = [
            this.normalizeToArcana(surnameNum),
            this.normalizeToArcana(patronymicNum),
            this.normalizeToArcana(fateNum + nameNum + surnameNum + patronymicNum),
            this.normalizeToArcana((fateNum * nameNum) % 23),
            this.normalizeToArcana(Math.abs(fateNum - nameNum) + surnameNum),
            this.normalizeToArcana((fateNum + nameNum + surnameNum + patronymicNum) * 3),
            this.normalizeToArcana((fateNum * fateNum + nameNum * nameNum) % 23)
        ];

        for (let candidate of candidates) {
            if (!usedCards.has(candidate)) {
                return candidate;
            }
        }

        for (let i = 0; i < 22; i++) {
            if (!usedCards.has(i)) {
                return i;
            }
        }

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
     * Метод для гадания
     */
    performReading(question, spreadType = 'three') {
        try {
            const spreads = {
                single: {
                    name: 'Одна карта',
                    positions: ['Ответ'],
                    description: 'Быстрый ответ на конкретный вопрос',
                    cardCount: 1
                },
                three: {
                    name: 'Три карты',
                    positions: ['Прошлое', 'Настоящее', 'Будущее'],
                    description: 'Анализ ситуации во времени',
                    cardCount: 3
                },
                five: {
                    name: 'Пять карт',
                    positions: ['Ситуация', 'Препятствие', 'Совет', 'Внешнее влияние', 'Итог'],
                    description: 'Глубокий анализ ситуации',
                    cardCount: 5
                },
                celtic: {
                    name: 'Кельтский крест',
                    positions: [
                        'Суть вопроса', 'Препятствие', 'Цель', 'Прошлое', 'Будущее',
                        'Сознание', 'Подсознание', 'Внешнее влияние', 'Надежды и страхи', 'Итог'
                    ],
                    description: 'Полный анализ ситуации',
                    cardCount: 10
                }
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
                    spread: {
                        type: spreadType,
                        name: spread.name,
                        positions: spread.positions,
                        description: spread.description
                    },
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

    /**
     * Определяет категорию вопроса
     */
    detectQuestionCategory(question) {
        const lowerQuestion = question.toLowerCase();

        for (const [keyword, category] of Object.entries(this.questionCategories)) {
            if (lowerQuestion.includes(keyword)) {
                return category;
            }
        }
        return 'general';
    }

    /**
     * Генерирует полную интерпретацию расклада
     */
    generateInterpretation(question, spread, cards) {
        const category = this.detectQuestionCategory(question);
        const uprightCount = cards.filter(c => !c.isReversed).length;
        const reversedCount = cards.filter(c => c.isReversed).length;

        let interpretation = `🔮 **РАСКЛАД ТАРО** 🔮\n\n`;
        interpretation += `**Ваш вопрос:** "${question}"\n`;
        interpretation += `**Расклад:** ${spread.name}\n`;
        interpretation += `_${spread.description}_\n\n`;

        interpretation += `**✨ КАРТЫ ВАШЕГО РАСКЛАДА**\n\n`;

        cards.forEach((card, index) => {
            const orientation = card.isReversed ? 'перевернутом' : 'прямом';
            const meaning = card.isReversed
                ? this.getReversedMeaning(card)
                : card.keywords;

            const positionMeaning = this.positionMeanings[card.position] || `относится к аспекту "${card.position}"`;

            interpretation += `**${index + 1}. ${card.position}** — ${card.name} (${orientation})\n`;
            interpretation += `▸ **Ключевое значение:** ${meaning}\n`;
            interpretation += `▸ **Описание карты:** ${card.description.split('.')[0]}.\n`;
            interpretation += `▸ **Толкование в этой позиции:** Эта карта ${positionMeaning}. `;

            if (card.isReversed) {
                interpretation += `В перевернутом положении она указывает на блокировки, задержки или необходимость пересмотреть свой подход. `;
            } else {
                interpretation += `В прямом положении она несет свою энергию в чистом виде, указывая на благоприятные возможности. `;
            }

            if (index === 0) {
                interpretation += `Это отправная точка вашего расклада, задающая тон всему анализу. `;
            }
            if (index === cards.length - 1) {
                interpretation += `Это финальная карта, подводящая итог и указывающая направление. `;
            }

            interpretation += `\n\n`;
        });

        interpretation += `**📊 БАЛАНС ЭНЕРГИЙ**\n\n`;
        interpretation += `В вашем раскладе **${uprightCount}** карт в прямом положении и **${reversedCount}** в перевернутом. `;

        if (uprightCount === cards.length) {
            interpretation += `Исключительно прямой расклад — мощный знак! Все энергии работают на вас. Ситуация развивается по наиболее благоприятному сценарию.`;
        } else if (reversedCount === cards.length) {
            interpretation += `Все карты в перевернутом положении — это указывает на серьезные вызовы. Возможно, вы идете против течения. Сейчас время переосмыслить ситуацию.`;
        } else if (uprightCount > reversedCount) {
            const ratio = Math.round((uprightCount / cards.length) * 100);
            interpretation += `Преобладают прямые карты (${ratio}%). Это говорит о том, что в ситуации доминируют позитивные энергии.`;
        } else if (reversedCount > uprightCount) {
            const ratio = Math.round((reversedCount / cards.length) * 100);
            interpretation += `Преобладают перевернутые карты (${ratio}%). Это указывает на наличие препятствий и вызовов, но они указывают на зоны роста.`;
        } else {
            interpretation += `Идеальный баланс — равное количество прямых и перевернутых карт. В вашей ситуации есть как поддерживающие, так и мешающие факторы.`;
        }

        interpretation += `\n\n`;

        interpretation += `**💫 ОТВЕТ НА ВАШ ВОПРОС**\n\n`;

        switch(category) {
            case 'love':
                interpretation += this.getLoveInterpretation(cards, question);
                break;
            case 'career':
                interpretation += this.getCareerInterpretation(cards, question);
                break;
            case 'money':
                interpretation += this.getMoneyInterpretation(cards, question);
                break;
            case 'health':
                interpretation += this.getHealthInterpretation(cards, question);
                break;
            case 'family':
                interpretation += this.getFamilyInterpretation(cards, question);
                break;
            case 'personal':
                interpretation += this.getPersonalInterpretation(cards, question);
                break;
            default:
                interpretation += this.getGeneralInterpretation(cards, question);
        }

        interpretation += `\n\n`;

        const significantCard = this.findMostSignificantCard(cards);
        interpretation += `**💡 КЛЮЧЕВОЙ СОВЕТ**\n\n`;
        interpretation += `Наиболее значимая карта этого расклада — **${significantCard.name}**. `;

        if (significantCard.isReversed) {
            interpretation += `В перевернутом положении она призывает вас обратить внимание на теневые аспекты. `;
        } else {
            interpretation += `В прямом положении она несет мощную энергию, которая станет вашим главным союзником. `;
        }

        interpretation += significantCard.advice;

        return interpretation;
    }

    getLoveInterpretation(cards, question) {
        let interpretation = '';

        const firstCard = cards[0];
        const lastCard = cards[cards.length - 1];

        interpretation += `В контексте любовных отношений этот расклад показывает, что `;

        if (!firstCard.isReversed && !lastCard.isReversed) {
            interpretation += `ваши отношения имеют позитивную динамику. Начало и итог отмечены благоприятными картами, что говорит о хороших перспективах. `;
        } else if (firstCard.isReversed && lastCard.isReversed) {
            interpretation += `сейчас в отношениях много сложностей, но помните, что перевернутые карты указывают на зоны роста. Работайте над проблемами. `;
        } else if (!firstCard.isReversed && lastCard.isReversed) {
            interpretation += `несмотря на хорошее начало, в будущем возможны трудности. Будьте внимательны к партнеру. `;
        } else if (firstCard.isReversed && !lastCard.isReversed) {
            interpretation += `даже если сейчас есть сложности, итог будет благоприятным. Не сдавайтесь. `;
        }

        const loveCards = cards.filter(c =>
            c.name === 'Влюбленные' ||
            c.name === 'Императрица' ||
            c.name === 'Император' ||
            c.name === 'Звезда' ||
            c.name === 'Солнце'
        );

        if (loveCards.length > 0) {
            interpretation += `\n\nОсобое значение имеет карта **${loveCards[0].name}** — она указывает на `;
            if (loveCards[0].name === 'Влюбленные') {
                interpretation += `важность выбора в отношениях. Возможно, вам предстоит принять важное решение.`;
            } else if (loveCards[0].name === 'Императрица') {
                interpretation += `период расцвета чувств, гармонии и взаимопонимания.`;
            } else if (loveCards[0].name === 'Император') {
                interpretation += `необходимость взять ответственность за отношения или укрепить их структуру.`;
            } else if (loveCards[0].name === 'Звезда') {
                interpretation += `надежду на лучшее, исцеление после разочарований.`;
            } else if (loveCards[0].name === 'Солнце') {
                interpretation += `светлые, радостные отношения, полные тепла.`;
            }
        }

        return interpretation;
    }

    getCareerInterpretation(cards, question) {
        let interpretation = '';

        const careerCards = cards.filter(c =>
            c.name === 'Маг' ||
            c.name === 'Император' ||
            c.name === 'Колесница' ||
            c.name === 'Отшельник' ||
            c.name === 'Справедливость'
        );

        interpretation += `В вопросах карьеры и работы этот расклад показывает, что `;

        if (careerCards.length > 0) {
            interpretation += `ключевое влияние имеет карта **${careerCards[0].name}**. `;

            switch(careerCards[0].name) {
                case 'Маг':
                    interpretation += `У вас есть все ресурсы для достижения цели. Используйте свои навыки и таланты.`;
                    break;
                case 'Император':
                    interpretation += `Нужно проявить лидерские качества и взять ситуацию под контроль.`;
                    break;
                case 'Колесница':
                    interpretation += `Время двигаться вперед, преодолевая препятствия. Успех близок.`;
                    break;
                case 'Отшельник':
                    interpretation += `Возможно, стоит взять паузу для анализа и переоценки целей.`;
                    break;
                case 'Справедливость':
                    interpretation += `Важно быть честным и справедливым. Результат будет соответствовать вложенным усилиям.`;
                    break;
            }
        } else {
            interpretation += `вам нужно обратить внимание на свои истинные цели. `;
            interpretation += `Карта **${cards[0].name}** в позиции "${cards[0].position}" задает тон вашей карьерной ситуации. `;
        }

        return interpretation;
    }

    getMoneyInterpretation(cards, question) {
        let interpretation = '';

        const moneyCards = cards.filter(c =>
            c.name === 'Императрица' ||
            c.name === 'Император' ||
            c.name === 'Колесо Фортуны' ||
            c.name === 'Мир'
        );

        interpretation += `В финансовых вопросах этот расклад указывает на `;

        if (moneyCards.length > 0) {
            switch(moneyCards[0].name) {
                case 'Императрица':
                    interpretation += `период изобилия и роста. Ваши вложения начнут приносить плоды.`;
                    break;
                case 'Император':
                    interpretation += `необходимость структурировать доходы и расходы. Создайте финансовый план.`;
                    break;
                case 'Колесо Фортуны':
                    interpretation += `перемены в финансовой сфере. Удача на вашей стороне, но не рискуйте безрассудно.`;
                    break;
                case 'Мир':
                    interpretation += `успешное завершение финансовых проектов, достижение целей.`;
                    break;
            }
        } else {
            interpretation += `необходимость более внимательного подхода к деньгам. `;
            interpretation += `Карта **${cards[0].name}** советует ${cards[0].advice.toLowerCase()}`;
        }

        return interpretation;
    }

    getHealthInterpretation(cards, question) {
        let interpretation = '';

        const healthCards = cards.filter(c =>
            c.name === 'Сила' ||
            c.name === 'Отшельник' ||
            c.name === 'Звезда' ||
            c.name === 'Солнце' ||
            c.name === 'Умеренность'
        );

        interpretation += `В вопросах здоровья этот расклад показывает, что `;

        if (healthCards.length > 0) {
            switch(healthCards[0].name) {
                case 'Сила':
                    interpretation += `у вас достаточно внутренних ресурсов для выздоровления. Верьте в себя.`;
                    break;
                case 'Отшельник':
                    interpretation += `важно прислушаться к сигналам тела и, возможно, обратиться к специалисту.`;
                    break;
                case 'Звезда':
                    interpretation += `надежда на исцеление есть. Верьте в лучшее и следуйте рекомендациям.`;
                    break;
                case 'Солнце':
                    interpretation += `отличный прогноз. Ваше здоровье улучшится, энергии прибавится.`;
                    break;
                case 'Умеренность':
                    interpretation += `нужен баланс во всем: питании, отдыхе, нагрузках.`;
                    break;
            }
        } else {
            interpretation += `важно обратить внимание на общее состояние. `;
        }

        return interpretation;
    }

    getFamilyInterpretation(cards, question) {
        let interpretation = '';

        const familyCards = cards.filter(c =>
            c.name === 'Императрица' ||
            c.name === 'Император' ||
            c.name === 'Влюбленные' ||
            c.name === 'Мир'
        );

        interpretation += `В семейных вопросах этот расклад говорит о `;

        if (familyCards.length > 0) {
            switch(familyCards[0].name) {
                case 'Императрица':
                    interpretation += `гармонии и плодородии. Хорошее время для укрепления семейных уз.`;
                    break;
                case 'Император':
                    interpretation += `необходимости установить правила и границы в семье.`;
                    break;
                case 'Влюбленные':
                    interpretation += `важности выбора и принятия решений, касающихся близких.`;
                    break;
                case 'Мир':
                    interpretation += `гармонии и единству в семье. Вы на верном пути.`;
                    break;
            }
        } else {
            interpretation += `том, что семья требует вашего внимания. `;
        }

        return interpretation;
    }

    getPersonalInterpretation(cards, question) {
        let interpretation = '';

        interpretation += `В вопросах личного развития этот расклад показывает, что `;
        interpretation += `ваш путь отмечен картой **${cards[0].name}**. ${cards[0].description.split('.')[0]}. `;

        if (cards.some(c => c.name === 'Отшельник')) {
            interpretation += `\n\nКарта Отшельника говорит о необходимости уединения и поиска ответов внутри себя. Сейчас время для самоанализа.`;
        }

        if (cards.some(c => c.name === 'Шут')) {
            interpretation += `\n\nШут призывает к новым начинаниям. Не бойтесь сделать шаг в неизвестность.`;
        }

        return interpretation;
    }

    getGeneralInterpretation(cards, question) {
        let interpretation = '';

        interpretation += `Рассматривая ваш вопрос в общем контексте, карты указывают на `;

        const firstCard = cards[0];
        const lastCard = cards[cards.length - 1];

        interpretation += `то, что текущая ситуация характеризуется энергией **${firstCard.name}**, а вероятный итог — картой **${lastCard.name}**. `;

        if (firstCard.number === lastCard.number) {
            interpretation += `Интересно, что начало и конец отмечены одной картой — это указывает на циклический процесс. `;
        }

        interpretation += `\n\n**${firstCard.name}** в начале говорит: "${firstCard.advice}" `;
        interpretation += `\n\n**${lastCard.name}** в итоге советует: "${lastCard.advice}" `;

        return interpretation;
    }

    findMostSignificantCard(cards) {
        if (cards.length % 2 === 1) {
            const midIndex = Math.floor(cards.length / 2);
            return cards[midIndex];
        }

        const fool = cards.find(c => c.number === 0);
        if (fool) return fool;

        const world = cards.find(c => c.number === 21);
        if (world) return world;

        return cards[0];
    }

    getReversedMeaning(card) {
        const reversedMeanings = {
            'Шут': 'Безрассудство, глупость, рискованные решения',
            'Маг': 'Манипуляции, неиспользованный потенциал',
            'Верховная Жрица': 'Секреты, подавленная интуиция',
            'Императрица': 'Творческий блок, зависимость',
            'Император': 'Тирания, жесткость, отсутствие контроля',
            'Иерофант': 'Бунтарство, отказ от традиций',
            'Влюбленные': 'Разлад, неправильный выбор',
            'Колесница': 'Потеря контроля, агрессия',
            'Сила': 'Слабость, неуверенность',
            'Отшельник': 'Изоляция, одиночество',
            'Колесо Фортуны': 'Неудача, сопротивление переменам',
            'Справедливость': 'Несправедливость, дисбаланс',
            'Повешенный': 'Застой, нежелание меняться',
            'Смерть': 'Сопротивление переменам',
            'Умеренность': 'Дисбаланс, конфликты',
            'Дьявол': 'Освобождение, прозрение',
            'Башня': 'Избегание перемен',
            'Звезда': 'Отчаяние, потеря веры',
            'Луна': 'Прояснение, выход из иллюзий',
            'Солнце': 'Временные трудности',
            'Суд': 'Сожаление, нежелание прощать',
            'Мир': 'Незавершенность, застой'
        };

        return reversedMeanings[card.name] || 'Негативное проявление энергии карты';
    }
    getCardByNumber(number) {
        const index = number === 22 ? 0 : number - 1;
        return this.cards[index] || this.cards[0];
    }

}

module.exports = TarotService;