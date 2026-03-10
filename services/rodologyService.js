class RodologyService {
    constructor() {
        this.generations = [
            { level: 1, name: 'Я', years: '0-20', task: 'Самоопределение, отделение от рода' },
            { level: 2, name: 'Родители', years: '20-40', task: 'Принятие родителей, сепарация' },
            { level: 3, name: 'Бабушки и дедушки', years: '40-60', task: 'Осознание родовых сценариев' },
            { level: 4, name: 'Прабабушки и прадедушки', years: '60-80', task: 'Трансформация родовых программ' },
            { level: 5, name: 'Пращуры (5 поколение)', years: '80-100', task: 'Связь с глубинными корнями' },
            { level: 6, name: '6 поколение', years: '100-120', task: 'Кармические узлы рода' },
            { level: 7, name: '7 поколение', years: '120-140', task: 'Духовные задачи рода' }
        ];

        this.familyRoles = {
            male: {
                'первенец': 'Хранитель традиций, продолжатель рода',
                'средний': 'Миротворец, связующее звено',
                'младший': 'Свободный художник, новатор',
                'единственный': 'Вся надежда рода, гиперответственность'
            },
            female: {
                'первенец': 'Хранительница очага, ответственность за младших',
                'средняя': 'Дипломат, сглаживающий конфликты',
                'младшая': 'Любимица, свободная от обязательств',
                'единственная': 'Принцесса рода, часто завышенные ожидания'
            }
        };

        this.genericPrograms = {
            'денежный': {
                positive: 'Процветание, изобилие, щедрость',
                negative: 'Бедность, жадность, долги, кредиты'
            },
            'отношенческий': {
                positive: 'Гармоничные браки, любовь, уважение',
                negative: 'Одиночество, разводы, измены, насилие'
            },
            'здоровья': {
                positive: 'Долголетие, сила, выносливость',
                negative: 'Болезни, ранние смерти, слабость'
            },
            'карьерный': {
                positive: 'Успех, признание, достижения',
                negative: 'Неудачничество, низкий статус'
            },
            'талантов': {
                positive: 'Одаренность, творчество, мастерство',
                negative: 'Посредственность, отсутствие способностей'
            }
        };
    }

    calculate(data) {
        const { fullName, birthDate, gender, parentsInfo, grandparentsInfo, knownGenerations } = data;

        // Анализ родового древа
        const tree = this.buildFamilyTree(fullName, birthDate, gender, parentsInfo, grandparentsInfo, knownGenerations);

        // Определение родовых программ
        const programs = this.identifyPrograms(tree);

        // Анализ порядка рождения
        const birthOrder = this.analyzeBirthOrder(data);

        // Кармические узлы
        const karmicNodes = this.findKarmicNodes(tree);

        // Сильные стороны рода
        const strengths = this.findStrengths(tree);

        // Слабые стороны рода
        const weaknesses = this.findWeaknesses(tree);

        // Родовые таланты
        const talents = this.findTalents(tree);

        // Задачи перед родом
        const tasks = this.defineTasks(tree, programs, birthOrder);

        // Связь с предками
        const ancestors = this.analyzeAncestors(tree);

        return {
            fullName,
            birthDate,
            gender: gender || 'Не указан',
            tree,
            birthOrder,
            programs,
            karmicNodes,
            strengths,
            weaknesses,
            talents,
            tasks,
            ancestors,
            interpretation: this.generateInterpretation(tree, programs, birthOrder, tasks)
        };
    }

    buildFamilyTree(fullName, birthDate, gender, parentsInfo, grandparentsInfo, knownGenerations) {
        const tree = [];

        // Поколение 1: сам человек
        tree.push({
            level: 1,
            name: fullName,
            birthDate,
            gender,
            role: 'Я',
            influence: 100
        });

        // Поколение 2: родители
        if (parentsInfo) {
            tree.push({
                level: 2,
                name: parentsInfo.father?.name || 'Неизвестен',
                birthDate: parentsInfo.father?.birthDate,
                gender: 'мужской',
                role: 'Отец',
                influence: 50,
                relation: parentsInfo.father?.relation || 'неизвестно'
            });
            tree.push({
                level: 2,
                name: parentsInfo.mother?.name || 'Неизвестна',
                birthDate: parentsInfo.mother?.birthDate,
                gender: 'женский',
                role: 'Мать',
                influence: 50,
                relation: parentsInfo.mother?.relation || 'неизвестно'
            });
        }

        // Поколение 3: бабушки и дедушки
        if (grandparentsInfo) {
            if (grandparentsInfo.paternal) {
                tree.push({
                    level: 3,
                    name: grandparentsInfo.paternal.grandfather || 'Неизвестен',
                    gender: 'мужской',
                    role: 'Дед по отцу',
                    influence: 25
                });
                tree.push({
                    level: 3,
                    name: grandparentsInfo.paternal.grandmother || 'Неизвестна',
                    gender: 'женский',
                    role: 'Бабушка по отцу',
                    influence: 25
                });
            }
            if (grandparentsInfo.maternal) {
                tree.push({
                    level: 3,
                    name: grandparentsInfo.maternal.grandfather || 'Неизвестен',
                    gender: 'мужской',
                    role: 'Дед по матери',
                    influence: 25
                });
                tree.push({
                    level: 3,
                    name: grandparentsInfo.maternal.grandmother || 'Неизвестна',
                    gender: 'женский',
                    role: 'Бабушка по матери',
                    influence: 25
                });
            }
        }

        // Дополнительные поколения
        if (knownGenerations) {
            knownGenerations.forEach(gen => {
                tree.push({
                    level: gen.level,
                    name: gen.name || 'Неизвестен',
                    gender: gen.gender,
                    role: `Поколение ${gen.level}`,
                    influence: Math.max(0, 100 - (gen.level - 1) * 15),
                    known: gen.known || false
                });
            });
        }

        return tree;
    }

    analyzeBirthOrder(data) {
        const { birthOrder, siblingsCount, siblingsInfo } = data;

        let role = '';
        let description = '';

        if (data.gender === 'мужской') {
            if (birthOrder === 'first') {
                role = 'первенец';
                description = 'Вы старший сын в семье. На вас лежит ответственность за продолжение рода и сохранение традиций. Часто первенцы становятся консерваторами, хранителями устоев.';
            } else if (birthOrder === 'middle') {
                role = 'средний';
                description = 'Вы средний ребенок. Ваша роль — миротворец, дипломат. Вы учитесь лавировать между старшими и младшими, часто становитесь связующим звеном в семье.';
            } else if (birthOrder === 'last') {
                role = 'младший';
                description = 'Вы младший сын. На вас меньше ответственности, больше свободы. Часто младшие дети — новаторы, исследователи, бунтари.';
            } else if (birthOrder === 'only') {
                role = 'единственный';
                description = 'Вы единственный ребенок. Вся надежда рода на вас. Это дает мощную поддержку, но и огромное давление.';
            }
        } else {
            if (birthOrder === 'first') {
                role = 'первенец';
                description = 'Вы старшая дочь. На вас лежит ответственность за младших, вы — вторая мать. Часто старшие дочери становятся гиперответственными и заботливыми.';
            } else if (birthOrder === 'middle') {
                role = 'средняя';
                description = 'Вы средний ребенок. Ваша роль — сглаживать конфликты, объединять. Вы учитесь быть гибкой и дипломатичной.';
            } else if (birthOrder === 'last') {
                role = 'младшая';
                description = 'Вы младшая дочь. Часто вы — любимица семьи, но можете быть инфантильной. Ваша задача — научиться самостоятельности.';
            } else if (birthOrder === 'only') {
                role = 'единственная';
                description = 'Вы единственная дочь. Вся любовь и внимание — вам, но и все ожидания тоже. Важно не стать эгоцентричной.';
            }
        }

        return {
            order: birthOrder,
            role,
            description,
            siblingsCount: siblingsCount || 0,
            siblingsInfo: siblingsInfo || []
        };
    }

    identifyPrograms(tree) {
        const programs = [];

        // Проверяем наличие негативных программ
        const negativeIndicators = {
            'денежный': ['долги', 'бедность', 'кредиты', 'нищета'],
            'отношенческий': ['развод', 'одиночество', 'измена', 'насилие'],
            'здоровья': ['болезнь', 'инвалидность', 'ранняя смерть'],
            'карьерный': ['безработица', 'неудачник', 'пьянство'],
            'талантов': ['бездарность', 'посредственность']
        };

        // Здесь должна быть логика анализа введенных данных
        // Пока генерируем случайные программы для демонстрации

        const randomPrograms = [
            {
                type: 'денежный',
                status: Math.random() > 0.5 ? 'positive' : 'negative',
                description: Math.random() > 0.5
                    ? 'В вашем роду были люди, умеющие зарабатывать и приумножать. Вам передалась способность к финансовому процветанию.'
                    : 'В роду были долги и финансовые трудности. Ваша задача — разорвать этот круг и создать новое денежное мышление.'
            },
            {
                type: 'отношенческий',
                status: Math.random() > 0.5 ? 'positive' : 'negative',
                description: Math.random() > 0.5
                    ? 'В вашем роду крепкие браки и гармоничные отношения. Вам легко строить семью.'
                    : 'В роду были разводы и измены. Осознайте этот сценарий, чтобы не повторять его.'
            },
            {
                type: 'талантов',
                status: Math.random() > 0.5 ? 'positive' : 'negative',
                description: Math.random() > 0.5
                    ? 'У вас творческие предки. Вам передались художественные, музыкальные или литературные способности.'
                    : 'Таланты в роду подавлялись. Ваша задача — раскрыть то, что было скрыто поколениями.'
            }
        ];

        return randomPrograms;
    }

    findKarmicNodes(tree) {
        return [
            {
                node: 'Незавершенные отношения',
                description: 'В роду были люди, не сумевшие простить друг друга. Это может проявляться в ваших отношениях.'
            },
            {
                node: 'Невысказанные слова',
                description: 'Кому-то из предков не дали высказаться. Ваша задача — быть голосом для них.'
            },
            {
                node: 'Повторяющиеся сценарии',
                description: 'В роду повторяются определенные события. Обратите на них внимание.'
            }
        ];
    }

    findStrengths(tree) {
        return [
            'Выносливость и жизнестойкость',
            'Способность преодолевать трудности',
            'Глубокая связь с землей и традициями',
            'Интуитивное понимание семейных ценностей'
        ];
    }

    findWeaknesses(tree) {
        return [
            'Склонность к повторению родовых сценариев',
            'Гиперответственность за других членов рода',
            'Трудности с сепарацией от родительской семьи'
        ];
    }

    findTalents(tree) {
        return [
            {
                area: 'Ремесленные навыки',
                description: 'В роду были мастера своего дела. Вам передалась способность к ручному труду.'
            },
            {
                area: 'Интуиция',
                description: 'Женская линия рода наделила вас сильной интуицией.'
            },
            {
                area: 'Лидерство',
                description: 'По мужской линии передались лидерские качества.'
            }
        ];
    }

    defineTasks(tree, programs, birthOrder) {
        const tasks = [];

        tasks.push({
            task: 'Принять и уважать свой род',
            description: 'Независимо от того, какими были предки, они дали вам жизнь. Примите их с благодарностью.'
        });

        tasks.push({
            task: 'Осознать родовые сценарии',
            description: 'Наблюдайте за повторяющимися паттернами в вашей жизни и жизни родственников.'
        });

        tasks.push({
            task: 'Трансформировать негативные программы',
            description: 'То, что не удалось предкам, можете изменить вы.'
        });

        tasks.push({
            task: 'Передать лучшее следующим поколениям',
            description: 'Сохраните мудрость предков и добавьте свою.'
        });

        return tasks;
    }

    analyzeAncestors(tree) {
        return {
            support: 'Предки поддерживают вас, даже если вы этого не чувствуете. Они хотят вашего счастья и успеха.',
            connection: 'Связь с родом особенно сильна в моменты жизненных переходов: рождение, свадьба, рождение детей.',
            rituals: 'Создайте свои ритуалы почитания предков: семейные альбомы, дни памяти, рассказы о них детям.'
        };
    }

    generateInterpretation(tree, programs, birthOrder, tasks) {
        return `
🌟 **РОДОЛОГИЧЕСКИЙ ПОРТРЕТ** 🌟

**ТВОЕ МЕСТО В РОДУ**

${birthOrder.description || 'Информация о порядке рождения не указана.'}

**СИЛА РОДА**

Ваш род насчитывает как минимум ${tree.length} известных поколений. Каждый из этих людей передал вам частицу себя — внешность, характер, таланты, привычки. Вы — продолжение их историй.

**РОДОВЫЕ ПРОГРАММЫ**

${programs.map(p => `• *${p.type}*: ${p.description}`).join('\n')}

**ЧТО НУЖНО ОСОЗНАТЬ**

В каждом роду есть свои "скелеты в шкафу" — то, о чем не говорят вслух. Но именно молчание делает эти истории токсичными. Ваша задача — не повторять ошибки, а учиться на них.

**ЗАДАЧИ ПЕРЕД РОДОМ**

${tasks.map(t => `• **${t.task}**: ${t.description}`).join('\n')}

**ПОСЛАНИЕ ПРЕДКОВ**

"Ты — наша надежда. Мы жили, страдали, любили и умирали, чтобы ты мог жить своей жизнью. Не повторяй наши ошибки — учись на них. Иди дальше, чем смогли мы. И помни: мы всегда с тобой, даже когда ты нас не чувствуешь."

**ПРАКТИЧЕСКИЕ РЕКОМЕНДАЦИИ**

1. Составьте генеалогическое древо — запишите всех, кого помните
2. Поговорите со старшими родственниками, запишите их истории
3. Создайте семейный альбом или книгу памяти
4. Простите тех, кого не можете принять
5. Благодарите род за свою жизнь
        `;
    }
}

module.exports = RodologyService;