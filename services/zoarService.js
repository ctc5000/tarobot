class ZoarService {
    constructor() {
        this.sefirot = [
            {
                number: 1,
                name: 'Кетер',
                meaning: 'Корона',
                description: 'Высшая корона, первичная воля, источник всего сущего. Точка начала, где всё едино.',
                color: 'Белый',
                planet: 'Первичный двигатель',
                archangel: 'Метатрон',
                virtue: 'Единство',
                vice: 'Гордыня'
            },
            {
                number: 2,
                name: 'Хохма',
                meaning: 'Мудрость',
                description: 'Мужское начало, активная сила, первичное озарение. Прорыв за пределы формы.',
                color: 'Серый',
                planet: 'Зодиак',
                archangel: 'Рациэль',
                virtue: 'Мудрость',
                vice: 'Хаос'
            },
            {
                number: 3,
                name: 'Бина',
                meaning: 'Понимание',
                description: 'Женское начало, структура, форма. То, что придает форму мудрости.',
                color: 'Черный',
                planet: 'Сатурн',
                archangel: 'Цафкиэль',
                virtue: 'Понимание',
                vice: 'Ограничение'
            },
            {
                number: 4,
                name: 'Хесед',
                meaning: 'Милосердие',
                description: 'Любовь, милость, расширение. Сила, которая дает и прощает.',
                color: 'Синий',
                planet: 'Юпитер',
                archangel: 'Цадкиэль',
                virtue: 'Милосердие',
                vice: 'Фанатизм'
            },
            {
                number: 5,
                name: 'Гебура',
                meaning: 'Суровость',
                description: 'Сила, суд, ограничение. То, что устанавливает границы и выносит приговор.',
                color: 'Красный',
                planet: 'Марс',
                archangel: 'Камаэль',
                virtue: 'Справедливость',
                vice: 'Жестокость'
            },
            {
                number: 6,
                name: 'Тиферет',
                meaning: 'Красота',
                description: 'Гармония, равновесие, центр. Точка баланса между милосердием и суровостью.',
                color: 'Желтый',
                planet: 'Солнце',
                archangel: 'Рафаэль',
                virtue: 'Гармония',
                vice: 'Тщеславие'
            },
            {
                number: 7,
                name: 'Нецах',
                meaning: 'Победа',
                description: 'Вечность, чувства, интуиция. Способность преодолевать через веру.',
                color: 'Зеленый',
                planet: 'Венера',
                archangel: 'Ханиил',
                virtue: 'Победа',
                vice: 'Похоть'
            },
            {
                number: 8,
                name: 'Ход',
                meaning: 'Слава',
                description: 'Величие, интеллект, логика. Способность выражать истину в словах.',
                color: 'Оранжевый',
                planet: 'Меркурий',
                archangel: 'Михаэль',
                virtue: 'Слава',
                vice: 'Ложь'
            },
            {
                number: 9,
                name: 'Йесод',
                meaning: 'Основание',
                description: 'Фундамент, подсознание, сны. Связь между высшим и низшим.',
                color: 'Фиолетовый',
                planet: 'Луна',
                archangel: 'Гавриил',
                virtue: 'Основание',
                vice: 'Иллюзия'
            },
            {
                number: 10,
                name: 'Малкут',
                meaning: 'Царство',
                description: 'Земля, реализация, физический мир. Конечная цель всех путей.',
                color: 'Коричневый',
                planet: 'Земля',
                archangel: 'Сандальфон',
                virtue: 'Реализация',
                vice: 'Материализм'
            }
        ];

        this.paths = [
            { from: 1, to: 2, letter: 'א', meaning: 'Бык', element: 'Воздух' },
            { from: 1, to: 3, letter: 'ב', meaning: 'Дом', element: 'Меркурий' },
            { from: 2, to: 3, letter: 'ג', meaning: 'Верблюд', element: 'Луна' },
            { from: 2, to: 4, letter: 'ד', meaning: 'Дверь', element: 'Венера' },
            { from: 2, to: 6, letter: 'ה', meaning: 'Окно', element: 'Овен' },
            { from: 3, to: 5, letter: 'ו', meaning: 'Гвоздь', element: 'Телец' },
            { from: 3, to: 6, letter: 'ז', meaning: 'Меч', element: 'Близнецы' },
            { from: 4, to: 5, letter: 'ח', meaning: 'Забор', element: 'Рак' },
            { from: 4, to: 6, letter: 'ט', meaning: 'Змей', element: 'Лев' },
            { from: 4, to: 7, letter: 'י', meaning: 'Рука', element: 'Дева' },
            { from: 5, to: 6, letter: 'כ', meaning: 'Ладонь', element: 'Юпитер' },
            { from: 5, to: 8, letter: 'ל', meaning: 'Вол', element: 'Весы' },
            { from: 6, to: 7, letter: 'מ', meaning: 'Вода', element: 'Скорпион' },
            { from: 6, to: 8, letter: 'נ', meaning: 'Рыба', element: 'Стрелец' },
            { from: 6, to: 9, letter: 'ס', meaning: 'Поддержка', element: 'Марс' },
            { from: 7, to: 8, letter: 'ע', meaning: 'Глаз', element: 'Козерог' },
            { from: 7, to: 9, letter: 'פ', meaning: 'Рот', element: 'Водолей' },
            { from: 7, to: 10, letter: 'צ', meaning: 'Крючок', element: 'Рыбы' },
            { from: 8, to: 9, letter: 'ק', meaning: 'Обезьяна', element: 'Сатурн' },
            { from: 8, to: 10, letter: 'ר', meaning: 'Голова', element: 'Солнце' },
            { from: 9, to: 10, letter: 'ש', meaning: 'Зуб', element: 'Огонь' },
            { from: 9, to: 6, letter: 'ת', meaning: 'Крест', element: 'Сатурн' }
        ];
    }

    calculate(data) {
        const { question, birthDate, name, sefiraNumber } = data;

        // Определяем центральную сефиру
        let centralSefira;
        if (sefiraNumber && sefiraNumber >= 1 && sefiraNumber <= 10) {
            centralSefira = this.sefirot[sefiraNumber - 1];
        } else {
            // На основе даты или имени
            const day = birthDate ? parseInt(birthDate.split('.')[0]) : new Date().getDate();
            centralSefira = this.sefirot[(day % 10)];
        }

        // Путь к сефире
        const path = this.getPathToSefira(centralSefira.number);

        // Баланс сефирот в жизни человека
        const balance = this.analyzeBalance(centralSefira.number, birthDate, name);

        // Архангелы-покровители
        const archangels = this.getArchangels(centralSefira.number);

        // Медитация на сефиру
        const meditation = this.getMeditation(centralSefira);

        return {
            centralSefira,
            path,
            balance,
            archangels,
            meditation,
            question: question || 'Общее познание',
            interpretation: this.generateInterpretation(centralSefira, path, balance, archangels, question)
        };
    }

    getPathToSefira(sefiraNumber) {
        // Находим пути, ведущие к сефире
        const incomingPaths = this.paths.filter(p => p.to === sefiraNumber);
        const outgoingPaths = this.paths.filter(p => p.from === sefiraNumber);

        return {
            incoming: incomingPaths.map(p => ({
                from: this.sefirot[p.from - 1].name,
                letter: p.letter,
                meaning: p.meaning,
                element: p.element
            })),
            outgoing: outgoingPaths.map(p => ({
                to: this.sefirot[p.to - 1].name,
                letter: p.letter,
                meaning: p.meaning,
                element: p.element
            }))
        };
    }

    analyzeBalance(sefiraNumber, birthDate, name) {
        // Упрощенный анализ баланса сефирот
        const balance = [];

        for (let i = 1; i <= 10; i++) {
            const sefira = this.sefirot[i - 1];
            let strength = 5; // базовая

            // Сефира центральная сильнее
            if (i === sefiraNumber) strength = 9;

            // Противоположные сефирот слабее
            if (Math.abs(i - sefiraNumber) === 5) strength = 3;

            // Близкие сефирот сильнее
            if (Math.abs(i - sefiraNumber) === 1) strength = 7;

            balance.push({
                sefira: sefira.name,
                number: i,
                strength,
                level: strength >= 8 ? 'очень сильная' :
                    strength >= 6 ? 'сильная' :
                        strength >= 4 ? 'средняя' :
                            strength >= 2 ? 'слабая' : 'очень слабая'
            });
        }

        return balance;
    }

    getArchangels(sefiraNumber) {
        const archangels = {
            1: ['Метатрон'],
            2: ['Рациэль'],
            3: ['Цафкиэль'],
            4: ['Цадкиэль'],
            5: ['Камаэль'],
            6: ['Рафаэль'],
            7: ['Ханиил'],
            8: ['Михаэль'],
            9: ['Гавриил'],
            10: ['Сандальфон']
        };

        return {
            main: archangels[sefiraNumber][0],
            helpers: this.getHelperArchangels(sefiraNumber),
            message: this.getArchangelMessage(sefiraNumber)
        };
    }

    getHelperArchangels(sefiraNumber) {
        const helpers = {
            1: ['Метатрон'],
            2: ['Рациэль', 'Метатрон'],
            3: ['Цафкиэль', 'Рациэль'],
            4: ['Цадкиэль', 'Цафкиэль'],
            5: ['Камаэль', 'Цадкиэль'],
            6: ['Рафаэль', 'Камаэль', 'Цадкиэль', 'Цафкиэль'],
            7: ['Ханиил', 'Рафаэль'],
            8: ['Михаэль', 'Ханиил'],
            9: ['Гавриил', 'Михаэль'],
            10: ['Сандальфон', 'Гавриил']
        };
        return helpers[sefiraNumber] || [];
    }

    getArchangelMessage(sefiraNumber) {
        const messages = {
            1: 'Метатрон говорит: "Ты — искра Божественного. Помни о своем источнике."',
            2: 'Рациэль говорит: "Мудрость приходит к тем, кто готов её принять. Открой сердце."',
            3: 'Цафкиэль говорит: "Понимание требует времени. Не торопи события."',
            4: 'Цадкиэль говорит: "Милосердие начинается с себя. Прости себя первым."',
            5: 'Камаэль говорит: "Сила нужна не для нападения, а для защиты истины."',
            6: 'Рафаэль говорит: "Красота спасет мир, но начни с красоты в своей душе."',
            7: 'Ханиил говорит: "Победа не в том, чтобы победить других, а в том, чтобы победить себя."',
            8: 'Михаэль говорит: "Слава приходит к тем, кто служит, а не к тем, кто ищет её."',
            9: 'Гавриил говорит: "Основание твоей жизни — в вере. Доверяй невидимому."',
            10: 'Сандальфон говорит: "Царство Божие внутри вас. Ищите там."'
        };
        return messages[sefiraNumber] || 'Ангелы наблюдают за вами.';
    }

    getMeditation(sefira) {
        return `
**МЕДИТАЦИЯ НА СЕФИРУ ${sefira.name} (${sefira.meaning})**

Найдите тихое место. Зажгите свечу ${sefira.color.toLowerCase()} цвета. Сядьте удобно, закройте глаза.

Представьте, что вы стоите у подножия великого Древа Жизни. Его корни уходят в землю, а ветви касаются небес. Вы начинаете подниматься вверх, проходя через сферы...

И вот вы достигаете сферы ${sefira.name}. Она сияет ${sefira.color.toLowerCase()} светом. Вы чувствуете вибрацию этой сефиры — ${sefira.description.toLowerCase()}.

Перед вами появляется архангел ${sefira.archangel}. Он протягивает вам светящийся шар и говорит:

*"${sefira.archangel} приветствует тебя в сфере ${sefira.name}. Здесь ты обретешь ${sefira.virtue.toLowerCase()}. Но остерегайся ${sefira.vice.toLowerCase()}. Прими этот дар и неси его в мир."*

Вы принимаете свет, и он наполняет каждую клеточку вашего тела. Вы чувствуете, как ${sefira.virtue} становится частью вас.

Сделайте глубокий вдох. Поблагодарите архангела. Медленно возвращайтесь в реальность, сохраняя это чувство в сердце.
        `;
    }

    generateInterpretation(centralSefira, path, balance, archangels, question) {
        const strongSefirot = balance.filter(b => b.strength >= 7).map(b => b.sefira).join(', ');
        const weakSefirot = balance.filter(b => b.strength <= 3).map(b => b.sefira).join(', ');

        return `
📜 **ЗОАР - КНИГА СИЯНИЯ** 📜

**ЦЕНТРАЛЬНАЯ СЕФИРА: ${centralSefira.number}. ${centralSefira.name} (${centralSefira.meaning})**

*${centralSefira.description}*

Цвет: ${centralSefira.color}
Планета: ${centralSefira.planet}
Архангел: ${centralSefira.archangel}
Добродетель: ${centralSefira.virtue}
Порок: ${centralSefira.vice}

**ПУТИ К ЭТОЙ СЕФИРЕ**

*Входящие пути:*
${path.incoming.map(p => `  • Из ${p.from} через букву ${p.letter} (${p.meaning}, стихия ${p.element})`).join('\n') || '  • Нет входящих путей (Корона)'}

*Исходящие пути:*
${path.outgoing.map(p => `  • К ${p.to} через букву ${p.letter} (${p.meaning}, стихия ${p.element})`).join('\n') || '  • Нет исходящих путей (Царство)'}

**БАЛАНС СЕФИРОТ В ВАШЕЙ ЖИЗНИ**

Сильные сферы: ${strongSefirot || 'нет доминирующих'}
Слабые сферы: ${weakSefirot || 'все в балансе'}

**АРХАНГЕЛЫ-ПОКРОВИТЕЛИ**

Главный архангел: ${archangels.main}
Помощники: ${archangels.helpers.join(', ')}

*${archangels.message}*

**ТОЛКОВАНИЕ ДЛЯ ВАШЕГО ВОПРОСА**

${question ? `Вы спрашиваете о "${question}". ` : ''}Сефира ${centralSefira.name} указывает, что сейчас для вас最重要 всего ${centralSefira.virtue}.

Ваша задача — развивать ${centralSefira.virtue} и остерегаться ${centralSefira.vice}. Путь к этому лежит через понимание того, что ${centralSefira.description.toLowerCase()}

Обратите особое внимание на ${weakSefirot || 'слабые места в своей жизни'}. Именно там скрыт ваш потенциал роста.

**СОВЕТ КАББАЛЫ**

*"Как вверху, так и внизу. Как внутри, так и снаружи."*

То, что происходит в высших сферах, отражается в вашей жизни. Работая над собой, вы влияете на весь космос. Сефира ${centralSefira.name} — это не просто абстракция. Это живая энергия, которая течет через вас прямо сейчас.

Примите её. Осознайте её. Станьте ею.

${centralSefira.archangel} благословляет вас на этом пути.
        `;
    }
}

module.exports = ZoarService;