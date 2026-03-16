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

        this.cardBack = '/images/tarot/back.jpg';
    }

    /**
     * Расчет карт Таро на основе нумерологических данных
     * @param {Object} numerology - объект с нумерологическими данными
     * @returns {Object} карты Таро
     */
    calculate(numerology) {
        if (!numerology || !numerology.base) {
            return {
                fate: this.getDefaultArcana(0),
                personality: this.getDefaultArcana(0),
                control: this.getDefaultArcana(0)
            };
        }

        // Получаем базовые числа
        const fateNumber = numerology.base.fate || 0;
        const personalityNumber = numerology.base.name || 0;

        // Число управления из нумерологии или рассчитываем сами
        let controlNumber;
        if (numerology.control && numerology.control.number) {
            controlNumber = numerology.control.number;
        } else {
            // Рассчитываем число управления как сумму всех базовых чисел
            const sum = fateNumber + personalityNumber +
                (numerology.base.surname || 0) +
                (numerology.base.patronymic || 0);

            // Редуцируем до диапазона 1-22
            controlNumber = this.reduceNumber(sum);
        }

        // Преобразуем числа 1-22 в 0-21 для Старших Арканов
        // (где 1-21 -> 1-21, 22 -> 0)
        const fateArcana = fateNumber === 22 ? 0 : fateNumber;
        const personalityArcana = personalityNumber === 22 ? 0 : personalityNumber;
        let controlArcana = controlNumber === 22 ? 0 : controlNumber;

        // ГАРАНТИРУЕМ УНИКАЛЬНОСТЬ ТРЕТЬЕЙ КАРТЫ
        // Если контрольная карта совпадает с картой судьбы или личности,
        // вычисляем уникальную на основе всех трех чисел
        if (controlArcana === fateArcana || controlArcana === personalityArcana) {
            controlArcana = this.calculateUniquePathCard(
                fateArcana,
                personalityArcana,
                fateNumber,
                personalityNumber,
                controlNumber
            );
        }

        return {
            fate: {
                number: fateArcana,
                ...this.getArcanaData(fateArcana)
            },
            personality: {
                number: personalityArcana,
                ...this.getArcanaData(personalityArcana)
            },
            control: {
                number: controlArcana,
                ...this.getArcanaData(controlArcana)
            }
        };
    }

    /**
     * Вычисляет уникальную карту пути, которая не совпадает с двумя другими
     * Использует детерминированные формулы, не случайные числа
     */
    calculateUniquePathCard(fateArcana, personalityArcana, fateNum, personalityNum, controlNum) {
        // Используем несколько детерминированных формул для получения уникального числа

        // Формула 1: (сумма всех чисел * 3) % 22
        const sum = fateNum + personalityNum + controlNum;
        let candidate1 = (sum * 3) % 22;

        // Формула 2: (произведение чисел) % 22
        const product = (fateNum * personalityNum * (controlNum || 1)) % 22;
        let candidate2 = product;

        // Формула 3: (fateNum^2 + personalityNum^2) % 22
        let candidate3 = (fateNum * fateNum + personalityNum * personalityNum) % 22;

        // Проверяем каждого кандидата на уникальность
        const candidates = [candidate1, candidate2, candidate3];

        for (let candidate of candidates) {
            if (candidate !== fateArcana && candidate !== personalityArcana) {
                return candidate;
            }
        }

        // Если ни один не подошел, используем циклический сдвиг
        let result = (fateArcana + personalityArcana) % 22;
        let attempts = 0;

        while ((result === fateArcana || result === personalityArcana) && attempts < 22) {
            result = (result + 1) % 22;
            attempts++;
        }

        return result;
    }

    /**
     * Редукция числа до диапазона 1-22
     */
    reduceNumber(num) {
        // Сохраняем мастер-числа 11, 22
        if (num === 11 || num === 22) return num;

        let result = num;
        while (result > 22) {
            result = String(result).split('').reduce((sum, digit) => sum + parseInt(digit), 0);
        }
        return result;
    }

    getArcanaData(num) {
        return this.majorArcana[num] || this.getDefaultArcana(num);
    }

    getDefaultArcana(num) {
        return {
            number: num,
            name: `Аркан ${num}`,
            image: this.cardBack,
            keywords: 'Тайна, ожидающая раскрытия',
            description: `Число ${num} несет в себе уникальную энергию, которую предстоит расшифровать лично вам. Это ваша индивидуальная карта, история, которую только вы можете написать.`,
            advice: `Исследуйте значение числа ${num} в своей жизни. Какие события, люди, ситуации связаны с ним? Там скрыт ответ.`
        };
    }
    performReading(question, spreadType = 'three') {
        try {
            // Определения раскладов
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
                        'Суть вопроса',
                        'Препятствие',
                        'Цель',
                        'Прошлое',
                        'Будущее',
                        'Сознание',
                        'Подсознание',
                        'Внешнее влияние',
                        'Надежды и страхи',
                        'Итог'
                    ],
                    description: 'Полный анализ ситуации',
                    cardCount: 10
                }
            };

            const spread = spreads[spreadType] || spreads.three;

            // Получаем случайные карты из колоды
            const cards = this.getRandomCards(spread.cardCount);

            // Добавляем позиции к картам
            cards.forEach((card, index) => {
                card.position = spread.positions[index];
                // Случайная ориентация (50% шанс перевернутой)
                card.isReversed = Math.random() > 0.5;
            });

            // Формируем результат
            const reading = {
                question: question,
                spread: {
                    type: spreadType,
                    name: spread.name,
                    positions: spread.positions,
                    description: spread.description
                },
                cards: cards,
                interpretation: this.generateInterpretation(question, spread, cards)
            };

            return {
                success: true,
                data: reading
            };
        } catch (error) {
            console.error('Ошибка при гадании:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Получение случайных карт из колоды
     * @param {number} count - количество карт
     * @returns {Array} массив карт
     */
    getRandomCards(count) {
        const cards = [];
        const arcanaKeys = Object.keys(this.majorArcana);

        // Перемешиваем
        const shuffled = [...arcanaKeys];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        // Берем первые count карт
        for (let i = 0; i < count; i++) {
            const key = shuffled[i];
            cards.push({ ...this.majorArcana[key] });
        }

        return cards;
    }

    /**
     * Генерация интерпретации
     * @param {string} question - вопрос
     * @param {Object} spread - расклад
     * @param {Array} cards - карты
     * @returns {string} интерпретация
     */
    /**
     * Генерация подробной интерпретации для любого расклада
     * @param {string} question - вопрос пользователя
     * @param {Object} spread - расклад
     * @param {Array} cards - карты
     * @returns {string} подробная интерпретация
     */
    generateInterpretation(question, spread, cards) {
        let interpretation = '';

        // ========== ЗАГОЛОВОК ==========
        interpretation += `🔮 **ВОПРОС:** "${question}"\n\n`;
        interpretation += `📜 **РАСКЛАД:** ${spread.name}\n`;
        interpretation += `_${spread.description || 'Астрологический анализ ситуации'}_\n`;
        interpretation += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

        // ========== ДЕТАЛЬНЫЙ РАЗБОР КАЖДОЙ КАРТЫ ==========
        interpretation += `**✨ КАРТЫ ВАШЕГО РАСКЛАДА**\n\n`;

        cards.forEach((card, index) => {
            const position = card.position || `Позиция ${index + 1}`;
            const orientation = card.isReversed ? 'перевернутом' : 'прямом';
            const orientationEmoji = card.isReversed ? '⚡' : '✨';
            const meaning = card.isReversed
                ? (card.meaning?.reversed || this.getReversedMeaning(card) || card.keywords)
                : (card.meaning?.upright || card.keywords);

            interpretation += `**${index + 1}. ${position}** ${orientationEmoji}\n`;
            interpretation += `▸ **Карта:** ${card.name}\n`;
            interpretation += `▸ **Положение:** ${orientation}\n`;
            interpretation += `▸ **Ключевое значение:** ${meaning}\n`;
            interpretation += `▸ **Описание:** ${card.description.split('.')[0]}.\n`;

            // Добавляем персональное толкование для этой позиции
            interpretation += `▸ **Толкование в данной позиции:** ${this.getPositionInterpretation(card, position, index, cards.length)}\n`;
            interpretation += `\n`;
        });

        interpretation += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

        // ========== ОБЩИЙ АНАЛИЗ ==========
        interpretation += `**🌟 ГЛУБИННЫЙ АНАЛИЗ СИТУАЦИИ**\n\n`;

        // 1. Анализ баланса прямых и перевернутых карт
        interpretation += this.analyzeOrientationBalance(cards);

        // 2. Анализ стихий (для Старших Арканов используем символические стихии)
        interpretation += this.analyzeElements(cards);

        // 3. Анализ числовых паттернов
        interpretation += this.analyzeNumberPatterns(cards);

        // 4. Анализ взаимосвязей между картами
        interpretation += this.analyzeCardRelationships(cards);

        // 5. Специальный анализ для конкретных типов раскладов
        interpretation += this.analyzeSpreadSpecific(spread, cards);

        // 6. Кульминация и совет
        interpretation += this.generateClimaxAndAdvice(cards, question);

        // ========== ЗАКЛЮЧЕНИЕ ==========
        interpretation += `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        interpretation += `*Помните: карты показывают вероятности и тенденции, но окончательный выбор всегда остается за вами. Доверяйте своей интуиции и принимайте решения осознанно.*`;

        return interpretation;
    }

    /**
     * Анализ баланса прямых и перевернутых карт
     */
    analyzeOrientationBalance(cards) {
        const uprightCount = cards.filter(c => !c.isReversed).length;
        const reversedCount = cards.filter(c => c.isReversed).length;
        const total = cards.length;

        let analysis = `**📊 БАЛАНС ЭНЕРГИЙ**\n\n`;
        analysis += `В вашем раскладе **${uprightCount}** из **${total}** карт в прямом положении и **${reversedCount}** в перевернутом. `;

        if (uprightCount === total) {
            analysis += `Исключительно прямой расклад — мощный знак! Все энергии работают на вас в чистом виде. Ситуация развивается по наиболее благоприятному сценарию, и у вас есть все ресурсы для достижения желаемого.\n\n`;
        } else if (reversedCount === total) {
            analysis += `Все карты в перевернутом положении — это указывает на серьезные блокировки и вызовы. Возможно, вы идете против течения или упускаете важные сигналы. Сейчас время остановиться, переосмыслить и заглянуть внутрь себя.\n\n`;
        } else if (uprightCount > reversedCount) {
            const ratio = Math.round((uprightCount / total) * 100);
            analysis += `Преобладают прямые карты (${ratio}%). Это говорит о том, что в ситуации доминируют позитивные энергии и благоприятные возможности. Большинство сил работают на вас, даже если сейчас это не очевидно. Однако не игнорируйте перевернутые карты — они указывают на зоны, требующие особого внимания.\n\n`;
        } else if (reversedCount > uprightCount) {
            const ratio = Math.round((reversedCount / total) * 100);
            analysis += `Преобладают перевернутые карты (${ratio}%). Это указывает на наличие препятствий и вызовов. Перевернутые карты часто сигнализируют о блоках, внутренних конфликтах или нерешенных проблемах. Воспринимайте их не как приговор, а как указатели на то, над чем нужно поработать.\n\n`;
        } else {
            analysis += `Идеальный баланс — равное количество прямых и перевернутых карт. В вашей ситуации есть как поддерживающие, так и мешающие факторы. Вам предстоит найти золотую середину и научиться использовать даже препятствия как возможности для роста.\n\n`;
        }

        return analysis;
    }

    /**
     * Анализ стихий (для Старших Арканов используем символические соответствия)
     */
    analyzeElements(cards) {
        // Символическое соответствие Старших Арканов стихиям
        const elementMap = {
            'Шут': 'Воздух',
            'Маг': 'Воздух',
            'Верховная Жрица': 'Вода',
            'Императрица': 'Земля',
            'Император': 'Огонь',
            'Иерофант': 'Земля',
            'Влюбленные': 'Воздух',
            'Колесница': 'Вода',
            'Сила': 'Огонь',
            'Отшельник': 'Земля',
            'Колесо Фортуны': 'Огонь',
            'Справедливость': 'Воздух',
            'Повешенный': 'Вода',
            'Смерть': 'Вода',
            'Умеренность': 'Огонь',
            'Дьявол': 'Земля',
            'Башня': 'Огонь',
            'Звезда': 'Вода',
            'Луна': 'Вода',
            'Солнце': 'Огонь',
            'Суд': 'Огонь',
            'Мир': 'Земля'
        };

        const elementCount = {
            'Огонь': 0,
            'Вода': 0,
            'Воздух': 0,
            'Земля': 0
        };

        cards.forEach(card => {
            const element = elementMap[card.name];
            if (element) elementCount[element]++;
        });

        let analysis = `**🔥💧🌍💨 СТИХИИ В РАСКЛАДЕ**\n\n`;

        const total = cards.length;
        const fire = Math.round((elementCount['Огонь'] / total) * 100) || 0;
        const water = Math.round((elementCount['Вода'] / total) * 100) || 0;
        const air = Math.round((elementCount['Воздух'] / total) * 100) || 0;
        const earth = Math.round((elementCount['Земля'] / total) * 100) || 0;

        analysis += `🔥 Огонь: ${fire}% — действие, страсть, трансформация\n`;
        analysis += `💧 Вода: ${water}% — эмоции, интуиция, глубина\n`;
        analysis += `🌍 Земля: ${earth}% — стабильность, практичность, материя\n`;
        analysis += `💨 Воздух: ${air}% — интеллект, коммуникация, идеи\n\n`;

        // Определяем доминирующую стихию
        const dominant = Object.entries(elementCount).sort((a, b) => b[1] - a[1])[0];

        if (dominant[1] > 0) {
            const dominantName = dominant[0];
            const dominantCount = dominant[1];
            const percentage = Math.round((dominantCount / total) * 100);

            analysis += `Доминирует стихия **${dominantName}** (${percentage}%). `;

            switch(dominantName) {
                case 'Огонь':
                    analysis += `Это говорит о том, что в ситуации важны активные действия, страсть и готовность к переменам. Вам нужно проявлять инициативу и не бояться рисковать.\n`;
                    break;
                case 'Вода':
                    analysis += `Это указывает на важность эмоций, интуиции и глубинного понимания. Прислушивайтесь к своему сердцу и доверяйте внутренним ощущениям.\n`;
                    break;
                case 'Воздух':
                    analysis += `Это подчеркивает роль интеллекта, коммуникации и ясного мышления. Обдумывайте решения, советуйтесь с другими и ищите информацию.\n`;
                    break;
                case 'Земля':
                    analysis += `Это говорит о необходимости практичности, терпения и стабильности. Стройте прочный фундамент и не торопите события.\n`;
                    break;
            }
            analysis += `\n`;
        }

        // Анализ баланса стихий
        if (fire > 60) analysis += `⚠️ Переизбыток Огня может привести к импульсивности и выгоранию. Добавьте больше Земли — стабильности и терпения.\n\n`;
        if (water > 60) analysis += `⚠️ Переизбыток Воды может вызвать эмоциональную перегрузку. Добавьте больше Воздуха — ясности и объективности.\n\n`;
        if (air > 60) analysis += `⚠️ Переизбыток Воздуха может привести к излишней теоретизации и отрыву от реальности. Добавьте больше Земли — практических действий.\n\n`;
        if (earth > 60) analysis += `⚠️ Переизбыток Земли может привести к застою и ригидности. Добавьте больше Огня — страсти и движения.\n\n`;

        return analysis;
    }

    /**
     * Анализ числовых паттернов
     */
    analyzeNumberPatterns(cards) {
        const numbers = cards.map(c => c.number !== undefined ? c.number : 0);
        const numberCounts = {};

        numbers.forEach(num => {
            numberCounts[num] = (numberCounts[num] || 0) + 1;
        });

        const duplicates = Object.entries(numberCounts).filter(([num, count]) => count > 1);

        let analysis = `**🔢 ЧИСЛОВЫЕ ПАТТЕРНЫ**\n\n`;

        if (duplicates.length > 0) {
            analysis += `В вашем раскладе есть повторяющиеся числа:\n`;
            duplicates.forEach(([num, count]) => {
                analysis += `▸ Число **${num}** встречается **${count}** раза\n`;
            });
            analysis += `\nПовторение чисел указывает на ключевую тему, которая проходит через все аспекты вашего вопроса. Обратите особое внимание на значение этих карт — они несут главное послание.\n\n`;

            // Добавляем значение повторяющихся чисел
            if (duplicates.some(([num]) => num === 0 || num === 22)) {
                analysis += `Число 0 (Шут) призывает к новым начинаниям и доверию к жизни.\n`;
            }
            if (duplicates.some(([num]) => num === 1)) {
                analysis += `Число 1 (Маг) говорит о вашей силе и способности влиять на реальность.\n`;
            }
            if (duplicates.some(([num]) => num === 2)) {
                analysis += `Число 2 (Верховная Жрица) призывает доверять интуиции.\n`;
            }
            if (duplicates.some(([num]) => num === 3)) {
                analysis += `Число 3 (Императрица) говорит о творчестве и изобилии.\n`;
            }
            if (duplicates.some(([num]) => num === 4)) {
                analysis += `Число 4 (Император) указывает на необходимость структуры и порядка.\n`;
            }
            if (duplicates.some(([num]) => num === 5)) {
                analysis += `Число 5 (Иерофант) говорит о важности традиций и наставничества.\n`;
            }
            if (duplicates.some(([num]) => num === 6)) {
                analysis += `Число 6 (Влюбленные) подчеркивает тему выбора и отношений.\n`;
            }
            if (duplicates.some(([num]) => num === 7)) {
                analysis += `Число 7 (Колесница) говорит о движении и преодолении препятствий.\n`;
            }
            if (duplicates.some(([num]) => num === 8)) {
                analysis += `Число 8 (Сила) указывает на внутреннюю силу и мужество.\n`;
            }
            if (duplicates.some(([num]) => num === 9)) {
                analysis += `Число 9 (Отшельник) призывает к уединению и поиску мудрости.\n`;
            }
            if (duplicates.some(([num]) => num === 10)) {
                analysis += `Число 10 (Колесо Фортуны) говорит о переменах и судьбе.\n`;
            }
            if (duplicates.some(([num]) => num === 11)) {
                analysis += `Число 11 (Справедливость) подчеркивает важность честности и баланса.\n`;
            }
            if (duplicates.some(([num]) => num === 12)) {
                analysis += `Число 12 (Повешенный) говорит о необходимости паузы и нового взгляда.\n`;
            }
            if (duplicates.some(([num]) => num === 13)) {
                analysis += `Число 13 (Смерть) указывает на неизбежные трансформации.\n`;
            }
            if (duplicates.some(([num]) => num === 14)) {
                analysis += `Число 14 (Умеренность) призывает к балансу и терпению.\n`;
            }
            if (duplicates.some(([num]) => num === 15)) {
                analysis += `Число 15 (Дьявол) говорит о необходимости встретиться со своей тенью.\n`;
            }
            if (duplicates.some(([num]) => num === 16)) {
                analysis += `Число 16 (Башня) указывает на разрушение старого и освобождение.\n`;
            }
            if (duplicates.some(([num]) => num === 17)) {
                analysis += `Число 17 (Звезда) приносит надежду и вдохновение.\n`;
            }
            if (duplicates.some(([num]) => num === 18)) {
                analysis += `Число 18 (Луна) говорит об иллюзиях и подсознании.\n`;
            }
            if (duplicates.some(([num]) => num === 19)) {
                analysis += `Число 19 (Солнце) несет радость и успех.\n`;
            }
            if (duplicates.some(([num]) => num === 20)) {
                analysis += `Число 20 (Суд) говорит о пробуждении и возрождении.\n`;
            }
            if (duplicates.some(([num]) => num === 21)) {
                analysis += `Число 21 (Мир) указывает на завершение и целостность.\n`;
            }

            analysis += `\n`;
        } else {
            analysis += `Все карты в раскладе имеют уникальные номера — это говорит о разнообразии энергий и отсутствии зацикленности на одной теме. Ситуация многогранна и требует комплексного подхода.\n\n`;
        }

        return analysis;
    }

    /**
     * Анализ взаимосвязей между картами
     */
    analyzeCardRelationships(cards) {
        if (cards.length < 2) return '';

        let analysis = `**🔄 ВЗАИМОСВЯЗИ МЕЖДУ КАРТАМИ**\n\n`;

        // Анализ первой и последней карты (начало и итог)
        const firstCard = cards[0];
        const lastCard = cards[cards.length - 1];

        analysis += `▸ **Начало и итог:** Ваш путь начинается с энергии **${firstCard.name}** и ведет к **${lastCard.name}**. `;

        if (firstCard.number === lastCard.number) {
            analysis += `Интересно, что начало и конец отмечены одной картой — это указывает на циклический процесс или возвращение к истокам на новом уровне.\n`;
        } else if (!firstCard.isReversed && lastCard.isReversed) {
            analysis += `Движение от прямого положения к перевернутому может указывать на то, что в процессе вы столкнетесь с препятствиями или внутренними блоками.\n`;
        } else if (firstCard.isReversed && !lastCard.isReversed) {
            analysis += `Движение от перевернутого положения к прямому — хороший знак! Вы сможете преодолеть препятствия и прийти к гармонии.\n`;
        } else {
            analysis += `Это путешествие от одной энергии к другой. Обратите внимание на то, как меняется характер карт — это подскажет динамику развития ситуации.\n`;
        }

        // Анализ центральной карты (для нечетного количества)
        if (cards.length % 2 === 1) {
            const midIndex = Math.floor(cards.length / 2);
            const midCard = cards[midIndex];
            analysis += `\n▸ **Сердце расклада:** Центральная карта — **${midCard.name}** — отражает самую суть вашего вопроса. `;
            analysis += `Это ключевая энергия, вокруг которой строится вся ситуация. `;
            analysis += midCard.isReversed
                ? `В перевернутом положении она указывает на скрытые аспекты или блокировки в центральной теме.`
                : `В прямом положении она несет ясность и силу в главном вопросе.`;
            analysis += `\n`;
        }

        // Анализ противоположных позиций (для четного количества)
        if (cards.length % 2 === 0 && cards.length >= 4) {
            analysis += `\n▸ **Противоположности:** `;
            for (let i = 0; i < cards.length / 2; i++) {
                const pair1 = cards[i];
                const pair2 = cards[cards.length - 1 - i];
                analysis += `\n   Пара ${i+1}: **${pair1.name}** и **${pair2.name}** — `;

                if (pair1.number === pair2.number) {
                    analysis += `одна и та же карта в разных позициях указывает на зеркальность ситуации: то, что происходит вовне, отражает внутренние процессы.`;
                } else if (!pair1.isReversed && pair2.isReversed) {
                    analysis += `одна карта прямая, другая перевернутая — баланс между проявленным и скрытым.`;
                } else {
                    analysis += `разные энергии, которые дополняют друг друга.`;
                }
            }
            analysis += `\n`;
        }

        analysis += `\n`;
        return analysis;
    }

    /**
     * Специальный анализ для конкретных типов раскладов
     */
    analyzeSpreadSpecific(spread, cards) {
        let analysis = '';

        switch(spread.name) {
            case 'Одна карта':
                analysis = `**🎯 ФОКУС НА ОДНОЙ КАРТЕ**\n\n`;
                analysis += `Этот расклад дает прямой и четкий ответ. Карта **${cards[0].name}** — это квинтэссенция ответа на ваш вопрос. `;
                analysis += cards[0].isReversed
                    ? `В перевернутом положении она предупреждает о возможных трудностях или призывает обратить внимание на теневые аспекты ситуации.`
                    : `В прямом положении она несет ясное послание и указывает направление.`;
                analysis += `\n\n`;
                break;

            case 'Три карты':
                analysis = `**⏳ АНАЛИЗ ВО ВРЕМЕНИ**\n\n`;

                if (cards.length >= 3) {
                    analysis += `▸ **Прошлое (${cards[0].name})** — `;
                    analysis += cards[0].isReversed
                        ? `энергия прошлого создает препятствия или нерешенные вопросы, которые тянутся в настоящее.`
                        : `прошлый опыт поддерживает вас и дает мудрость.`;
                    analysis += `\n\n`;

                    analysis += `▸ **Настоящее (${cards[1].name})** — `;
                    analysis += cards[1].isReversed
                        ? `текущая ситуация содержит вызовы и требует осознанности. Не все очевидно.`
                        : `сейчас вы находитесь в потоке благоприятных энергий. Действуйте!`;
                    analysis += `\n\n`;

                    analysis += `▸ **Будущее (${cards[2].name})** — `;
                    analysis += cards[2].isReversed
                        ? `вероятный исход требует внимания — есть риски, которые можно предотвратить.`
                        : `будущее выглядит светлым и многообещающим. Двигайтесь вперед.`;
                    analysis += `\n\n`;
                }
                break;

            case 'Пять карт':
                analysis = `**🔍 ДЕТАЛЬНЫЙ АНАЛИЗ СИТУАЦИИ**\n\n`;

                if (cards.length >= 5) {
                    analysis += `▸ **Ситуация (${cards[0].name})** — фундамент вашего вопроса. `;
                    analysis += cards[0].isReversed ? `Есть скрытые факторы.` : `Все ясно и прозрачно.`;
                    analysis += `\n\n`;

                    analysis += `▸ **Препятствие (${cards[1].name})** — главный вызов. `;
                    analysis += cards[1].isReversed ? `Препятствие может быть внутренним блоком.` : `Препятствие явное и требует действий.`;
                    analysis += `\n\n`;

                    analysis += `▸ **Совет (${cards[2].name})** — мудрость Вселенной. `;
                    analysis += cards[2].isReversed ? `Будьте осторожны, не следуйте совету буквально.` : `Следуйте этому совету.`;
                    analysis += `\n\n`;

                    analysis += `▸ **Внешнее влияние (${cards[3].name})** — силы, на которые вы не влияете. `;
                    analysis += cards[3].isReversed ? `Влияние может быть негативным.` : `Влияние благоприятно.`;
                    analysis += `\n\n`;

                    analysis += `▸ **Итог (${cards[4].name})** — вероятный результат. `;
                    analysis += cards[4].isReversed ? `Не все потеряно, но нужна работа.` : `Хороший исход при верных действиях.`;
                    analysis += `\n\n`;
                }
                break;

            case 'Кельтский крест':
                analysis = `**🏛️ ГЛУБИННЫЙ АНАЛИЗ КЕЛЬТСКОГО КРЕСТА**\n\n`;
                // Здесь можно добавить подробный анализ для всех 10 позиций
                analysis += `Этот расклад охватывает все аспекты вашей жизни. Обратите особое внимание на пересечение вертикальной линии (сознательное) и горизонтальной (подсознательное).\n\n`;
                break;

            default:
                analysis = `**📊 АНАЛИЗ РАСКЛАДА**\n\n`;
                analysis += `В этом раскладе ${cards.length} карт, каждая из которых освещает определенную грань вашего вопроса. `;
                analysis += `Рассматривайте их не изолированно, а как части единой картины. Особое внимание уделите первой и последней карте — они задают тон и подводят итог.\n\n`;
        }

        return analysis;
    }

    /**
     * Получение интерпретации для конкретной позиции
     */
    getPositionInterpretation(card, position, index, totalCards) {
        // Базовая интерпретация на основе позиции
        const positionMeanings = {
            'Прошлое': 'Эта карта показывает, какие энергии из прошлого влияют на текущую ситуацию.',
            'Настоящее': 'Эта карта отражает текущее состояние дел и ваши ощущения здесь и сейчас.',
            'Будущее': 'Эта карта указывает на вероятное развитие событий, если ничего не менять.',
            'Ситуация': 'Эта карта описывает основную ситуацию вокруг вашего вопроса.',
            'Препятствие': 'Эта карта показывает, что стоит у вас на пути.',
            'Совет': 'Эта карта дает рекомендацию, как лучше поступить.',
            'Внешнее влияние': 'Эта карта показывает, какие внешние силы воздействуют на ситуацию.',
            'Итог': 'Эта карта указывает на наиболее вероятный исход.',
            'Суть вопроса': 'Эта карта раскрывает глубинную суть вашего вопроса.',
            'Цель': 'Эта карта показывает вашу истинную цель.',
            'Сознание': 'Эта карта отражает то, что вы осознаете.',
            'Подсознание': 'Эта карта показывает скрытые мотивы и страхи.',
            'Надежды и страхи': 'Эта карта раскрывает ваши ожидания и опасения.'
        };

        const baseMeaning = positionMeanings[position] || `Эта карта освещает аспект "${position}" вашего вопроса.`;

        // Добавляем специфику карты
        const cardNature = card.isReversed
            ? `В перевернутом положении карта **${card.name}** указывает на блокировки, задержки или необходимость пересмотреть подход.`
            : `В прямом положении карта **${card.name}** несет свою энергию в чистом виде, указывая на благоприятные возможности.`;

        // Учитываем положение в раскладе
        const positionSignificance = index === 0
            ? ' Это отправная точка вашего расклада, задающая тон всему анализу.'
            : index === totalCards - 1
                ? ' Это финальная карта, подводящая итог и указывающая направление.'
                : '';

        return `${baseMeaning} ${cardNature}${positionSignificance}`;
    }

    /**
     * Генерация кульминации и совета
     */
    generateClimaxAndAdvice(cards, question) {
        let climax = `**💫 КУЛЬМИНАЦИЯ И СОВЕТ**\n\n`;

        // Выбираем самую значимую карту (можно по разным критериям)
        const significantCard = this.findMostSignificantCard(cards);

        climax += `Ключевая карта этого расклада — **${significantCard.name}**. `;
        climax += significantCard.isReversed
            ? `В перевернутом положении она призывает вас обратить внимание на теневые аспекты и нерешенные проблемы. `
            : `В прямом положении она несет мощную энергию, которая станет вашим главным союзником. `;

        climax += `Эта карта — центральное послание Вселенной относительно вашего вопроса.\n\n`;

        // Совет от ключевой карты
        climax += `**💡 СОВЕТ ОТ КАРТЫ ${significantCard.name.toUpperCase()}**\n`;
        climax += `«${significantCard.advice || 'Доверяйте своей интуиции и следуйте за сердцем'}»\n\n`;

        // Общий совет на основе расклада
        climax += `**📌 ОБЩАЯ РЕКОМЕНДАЦИЯ**\n`;

        // Анализ первой и последней карты
        const firstCard = cards[0];
        const lastCard = cards[cards.length - 1];

        if (firstCard && lastCard) {
            if (!firstCard.isReversed && !lastCard.isReversed) {
                climax += `Ваш путь начинается с позитивной энергии и ведет к благоприятному итогу. Действуйте уверенно, но не торопите события. `;
            } else if (firstCard.isReversed && lastCard.isReversed) {
                climax += `Сейчас много препятствий, и итог пока туманен. Не форсируйте события, возьмите паузу для размышлений. Возможно, ответ придет позже. `;
            } else if (!firstCard.isReversed && lastCard.isReversed) {
                climax += `Несмотря на хорошее начало, в конце могут возникнуть сложности. Будьте готовы к неожиданностям и сохраняйте гибкость. `;
            } else if (firstCard.isReversed && !lastCard.isReversed) {
                climax += `Даже если сейчас есть трудности, итог будет благоприятным. Не сдавайтесь и продолжайте двигаться вперед. `;
            }
        }

        // Совет по доминирующей стихии
        const dominantElement = this.getDominantElement(cards);
        if (dominantElement) {
            climax += this.getElementAdvice(dominantElement);
        }

        // Персонализированный совет на основе вопроса
        climax += `\n\n**🔮 ОТВЕТ НА ВАШ ВОПРОС**\n`;
        climax += this.generatePersonalizedAnswer(cards, question);

        return climax;
    }

    /**
     * Поиск наиболее значимой карты в раскладе
     */
    findMostSignificantCard(cards) {
        // Приоритет: центральная карта > карта с номером 0 > карта с номером 21 > первая карта
        if (cards.length % 2 === 1) {
            const midIndex = Math.floor(cards.length / 2);
            return cards[midIndex];
        }

        // Ищем Шута (0) или Мир (21) как особые карты
        const fool = cards.find(c => c.number === 0 || c.number === 22);
        if (fool) return fool;

        const world = cards.find(c => c.number === 21);
        if (world) return world;

        // Иначе возвращаем первую карту
        return cards[0];
    }

    /**
     * Получение доминирующей стихии
     */
    getDominantElement(cards) {
        const elementMap = {
            'Шут': 'Воздух',
            'Маг': 'Воздух',
            'Верховная Жрица': 'Вода',
            'Императрица': 'Земля',
            'Император': 'Огонь',
            'Иерофант': 'Земля',
            'Влюбленные': 'Воздух',
            'Колесница': 'Вода',
            'Сила': 'Огонь',
            'Отшельник': 'Земля',
            'Колесо Фортуны': 'Огонь',
            'Справедливость': 'Воздух',
            'Повешенный': 'Вода',
            'Смерть': 'Вода',
            'Умеренность': 'Огонь',
            'Дьявол': 'Земля',
            'Башня': 'Огонь',
            'Звезда': 'Вода',
            'Луна': 'Вода',
            'Солнце': 'Огонь',
            'Суд': 'Огонь',
            'Мир': 'Земля'
        };

        const elementCount = {
            'Огонь': 0,
            'Вода': 0,
            'Воздух': 0,
            'Земля': 0
        };

        cards.forEach(card => {
            const element = elementMap[card.name];
            if (element) elementCount[element]++;
        });

        const dominant = Object.entries(elementCount).sort((a, b) => b[1] - a[1])[0];
        return dominant[1] > 0 ? dominant[0] : null;
    }

    /**
     * Совет по стихии
     */
    getElementAdvice(element) {
        const advices = {
            'Огонь': `Стихия Огня советует вам действовать активно, но не сжигать себя. Направляйте страсть в конструктивное русло и помните о необходимости отдыха.`,
            'Вода': `Стихия Воды призывает доверять интуиции и эмоциям. Позвольте чувствам течь свободно, но не дайте им затопить разум.`,
            'Воздух': `Стихия Воздуха рекомендует больше общаться, искать информацию и анализировать. Ясность мысли сейчас — ваш главный инструмент.`,
            'Земля': `Стихия Земли советует быть практичным, терпеливым и последовательным. Стройте прочный фундамент и не торопите события.`
        };
        return advices[element] || '';
    }

    /**
     * Генерация персонализированного ответа на вопрос
     */
    generatePersonalizedAnswer(cards, question) {
        const lastCard = cards[cards.length - 1];
        const firstCard = cards[0];

        let answer = `Основываясь на раскладе, `;

        // Определяем общий характер ответа
        const positiveCount = cards.filter(c => !c.isReversed).length;
        const totalCards = cards.length;
        const positiveRatio = positiveCount / totalCards;

        if (positiveRatio >= 0.7) {
            answer += `ответ скорее **положительный**. `;
        } else if (positiveRatio <= 0.3) {
            answer += `ответ скорее **сложный**, требующий внимания. `;
        } else {
            answer += `ответ **смешанный** — есть и возможности, и препятствия. `;
        }

        // Добавляем выводы на основе последней карты
        answer += `\n\nФинальная карта — **${lastCard.name}** — указывает, что `;

        if (lastCard.isReversed) {
            answer += `итог зависит от ваших действий. Если не принять меры, результат может быть не таким, как вы ожидаете. `;
        } else {
            answer += `при правильном подходе результат будет благоприятным. `;
        }

        // Добавляем конкретные рекомендации
        answer += `\n\n**✨ ЧТО ДЕЛАТЬ:**\n`;

        const actions = this.generateActions(cards);
        answer += actions;

        return answer;
    }

    /**
     * Генерация конкретных действий на основе карт
     */
    generateActions(cards) {
        let actions = '';
        const uniqueActions = new Set();

        cards.forEach(card => {
            if (!card.isReversed) {
                // Прямые карты дают советы
                switch(card.name) {
                    case 'Шут':
                        uniqueActions.add('• Начните новое с открытым сердцем и доверием к миру');
                        break;
                    case 'Маг':
                        uniqueActions.add('• Проявите волю и используйте все доступные ресурсы');
                        break;
                    case 'Верховная Жрица':
                        uniqueActions.add('• Прислушайтесь к интуиции и внутреннему голосу');
                        break;
                    case 'Императрица':
                        uniqueActions.add('• Творите, взращивайте, окружайте себя красотой');
                        break;
                    case 'Император':
                        uniqueActions.add('• Внесите структуру и порядок, действуйте решительно');
                        break;
                    case 'Иерофант':
                        uniqueActions.add('• Обратитесь к традициям или наставнику за советом');
                        break;
                    case 'Влюбленные':
                        uniqueActions.add('• Сделайте выбор сердцем, примите решение');
                        break;
                    case 'Колесница':
                        uniqueActions.add('• Двигайтесь к цели, контролируя эмоции');
                        break;
                    case 'Сила':
                        uniqueActions.add('• Проявите внутреннюю силу и мягкость одновременно');
                        break;
                    case 'Отшельник':
                        uniqueActions.add('• Возьмите паузу для размышлений и поиска истины');
                        break;
                    case 'Колесо Фортуны':
                        uniqueActions.add('• Доверьтесь течению жизни, скоро все изменится');
                        break;
                    case 'Справедливость':
                        uniqueActions.add('• Будьте честны с собой и другими, восстановите баланс');
                        break;
                    case 'Повешенный':
                        uniqueActions.add('• Посмотрите на ситуацию под другим углом');
                        break;
                    case 'Смерть':
                        uniqueActions.add('• Отпустите старое, освободите место для нового');
                        break;
                    case 'Умеренность':
                        uniqueActions.add('• Ищите золотую середину, будьте терпеливы');
                        break;
                    case 'Дьявол':
                        uniqueActions.add('• Осознайте свои зависимости и отпустите их');
                        break;
                    case 'Башня':
                        uniqueActions.add('• Примите неизбежные перемены, они ведут к освобождению');
                        break;
                    case 'Звезда':
                        uniqueActions.add('• Верьте в лучшее, мечтайте и вдохновляйтесь');
                        break;
                    case 'Луна':
                        uniqueActions.add('• Доверьтесь интуиции, обратите внимание на сны');
                        break;
                    case 'Солнце':
                        uniqueActions.add('• Радуйтесь жизни, делитесь светом с другими');
                        break;
                    case 'Суд':
                        uniqueActions.add('• Простите себя и других, начните новую главу');
                        break;
                    case 'Мир':
                        uniqueActions.add('• Празднуйте завершение этапа, вы на верном пути');
                        break;
                }
            } else {
                // Перевернутые карты дают предупреждения
                switch(card.name) {
                    case 'Шут':
                        uniqueActions.add('• Избегайте безрассудства, не рискуйте понапрасну');
                        break;
                    case 'Маг':
                        uniqueActions.add('• Не пытайтесь манипулировать, используйте силу честно');
                        break;
                    case 'Верховная Жрица':
                        uniqueActions.add('• Не игнорируйте интуицию, она сейчас важна');
                        break;
                    case 'Императрица':
                        uniqueActions.add('• Преодолейте творческий блок, ищите вдохновение');
                        break;
                    case 'Император':
                        uniqueActions.add('• Избегайте жесткости, будьте гибче');
                        break;
                    case 'Иерофант':
                        uniqueActions.add('• Не отвергайте традиции, в них есть мудрость');
                        break;
                    case 'Влюбленные':
                        uniqueActions.add('• Не торопите выбор, дайте себе время');
                        break;
                    case 'Колесница':
                        uniqueActions.add('• Возьмите эмоции под контроль, не теряйте фокус');
                        break;
                    case 'Сила':
                        uniqueActions.add('• Верьте в себя, ваша сила внутри');
                        break;
                    case 'Отшельник':
                        uniqueActions.add('• Не замыкайтесь в себе, ищите баланс');
                        break;
                    case 'Колесо Фортуны':
                        uniqueActions.add('• Не сопротивляйтесь переменам, они неизбежны');
                        break;
                    case 'Справедливость':
                        uniqueActions.add('• Будьте честны, несправедливость вернется бумерангом');
                        break;
                    case 'Повешенный':
                        uniqueActions.add('• Не застревайте в застое, ищите новый взгляд');
                        break;
                    case 'Смерть':
                        uniqueActions.add('• Не бойтесь перемен, они ведут к росту');
                        break;
                    case 'Умеренность':
                        uniqueActions.add('• Избегайте крайностей, ищите баланс');
                        break;
                    case 'Дьявол':
                        uniqueActions.add('• Освобождайтесь от зависимостей, вы сильнее');
                        break;
                    case 'Башня':
                        uniqueActions.add('• Не пытайтесь удержать то, что рушится');
                        break;
                    case 'Звезда':
                        uniqueActions.add('• Не теряйте надежду, свет скоро придет');
                        break;
                    case 'Луна':
                        uniqueActions.add('• Разберитесь с иллюзиями, ищите правду');
                        break;
                    case 'Солнце':
                        uniqueActions.add('• Временные трудности пройдут, верьте в лучшее');
                        break;
                    case 'Суд':
                        uniqueActions.add('• Простите, чтобы двигаться дальше');
                        break;
                    case 'Мир':
                        uniqueActions.add('• Завершите начатое, не бросайте на полпути');
                        break;
                }
            }
        });

        actions = Array.from(uniqueActions).slice(0, 5).join('\n');

        if (!actions) {
            actions = '• Доверяйте своей интуиции\n• Будьте внимательны к знакам\n• Принимайте решения осознанно';
        }

        return actions;
    }


    /**
     * Получение значения для перевернутой карты
     */
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

    /**
     * Получение списка раскладов
     */
    getSpreads() {
        return {
            single: {
                name: 'Одна карта',
                description: 'Быстрый ответ на конкретный вопрос',
                cardCount: 1
            },
            three: {
                name: 'Три карты',
                description: 'Анализ ситуации во времени',
                cardCount: 3
            },
            five: {
                name: 'Пять карт',
                description: 'Глубокий анализ ситуации',
                cardCount: 5
            },
            celtic: {
                name: 'Кельтский крест',
                description: 'Полный анализ ситуации',
                cardCount: 10
            }
        };
    }
}

module.exports = TarotService;