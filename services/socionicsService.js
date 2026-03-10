class SocionicsService {
    constructor() {
        this.types = {
            'ILE': {
                name: 'Дон Кихот',
                fullName: 'Интуитивно-логический экстраверт',
                description: 'Генератор идей, энтузиаст, исследователь. Видит возможности там, где другие видят только стены.',
                strengths: 'Интуиция возможностей, структурная логика',
                weaknesses: 'Сенсорика ощущений, этика отношений',
                traits: ['изобретательный', 'непрактичный', 'увлеченный', 'непредсказуемый'],
                quadra: 'Альфа',
                role: 'Искатель',
                communication: 'Легко увлекается новыми идеями, может перескакивать с темы на тему. Ценит интеллектуальные беседы.',
                career: 'Научный сотрудник, изобретатель, программист, журналист',
                partners: 'SEE (Наполеон) — дуал',
                motto: 'Нет ничего невозможного для того, кто не обязан делать это сам.'
            },
            'SEI': {
                name: 'Дюма',
                fullName: 'Сенсорно-этический интроверт',
                description: 'Душа компании, гедонист, ценитель комфорта. Создает уют и гармонию вокруг.',
                strengths: 'Этика эмоций, сенсорика ощущений',
                weaknesses: 'Интуиция возможностей, деловая логика',
                traits: ['дружелюбный', 'комфортный', 'артистичный', 'неамбициозный'],
                quadra: 'Альфа',
                role: 'Миротворец',
                communication: 'Мягкий, тактичный, избегает конфликтов. Создает приятную атмосферу.',
                career: 'Дизайнер, психолог, актер, ресторатор',
                partners: 'ILE (Дон Кихот) — дуал',
                motto: 'Жизнь прекрасна, если знать, как её украсить.'
            },
            'ESE': {
                name: 'Гюго',
                fullName: 'Этико-сенсорный экстраверт',
                description: 'Эмоциональный лидер, оптимист, зажигатель. Заряжает всех своей энергией.',
                strengths: 'Этика эмоций, сенсорика волевая',
                weaknesses: 'Интуиция времени, структурная логика',
                traits: ['эмоциональный', 'активный', 'заботливый', 'нетерпеливый'],
                quadra: 'Бета',
                role: 'Энтузиаст',
                communication: 'Яркий, экспрессивный, заражает своим настроением. Любит быть в центре.',
                career: 'Учитель, организатор мероприятий, актер, политик',
                partners: 'LII (Робеспьер) — дуал',
                motto: 'Радостью нужно делиться, иначе она теряет смысл.'
            },
            'LII': {
                name: 'Робеспьер',
                fullName: 'Логико-интуитивный интроверт',
                description: 'Аналитик, справедливый, принципиальный. Стремится к истине и порядку.',
                strengths: 'Структурная логика, интуиция возможностей',
                weaknesses: 'Этика эмоций, сенсорика волевая',
                traits: ['логичный', 'принципиальный', 'сдержанный', 'справедливый'],
                quadra: 'Бета',
                role: 'Аналитик',
                communication: 'Спокойный, рассудительный. Говорит по делу, не любит пустых эмоций.',
                career: 'Ученый, аналитик, программист, судья',
                partners: 'ESE (Гюго) — дуал',
                motto: 'Справедливость превыше всего, даже если весь мир против.'
            },
            'EIE': {
                name: 'Гамлет',
                fullName: 'Этико-интуитивный экстраверт',
                description: 'Актер, драматический, проницательный. Видит скрытые мотивы и играет роли.',
                strengths: 'Этика эмоций, интуиция времени',
                weaknesses: 'Сенсорика ощущений, деловая логика',
                traits: ['артистичный', 'драматичный', 'проницательный', 'мнительный'],
                quadra: 'Бета',
                role: 'Наставник',
                communication: 'Выразительный, эмоциональный, любит драматизировать. Хорошо чувствует людей.',
                career: 'Актер, психолог, писатель, режиссер',
                partners: 'LSI (Максим) — дуал',
                motto: 'Вся жизнь — театр, и я в нем главный режиссер.'
            },
            'LSI': {
                name: 'Максим',
                fullName: 'Логико-сенсорный интроверт',
                description: 'Систематизатор, хранитель порядка, реалист. Строит структуры и следит за их соблюдением.',
                strengths: 'Структурная логика, сенсорика волевая',
                weaknesses: 'Этика эмоций, интуиция возможностей',
                traits: ['системный', 'дисциплинированный', 'реалистичный', 'упрямый'],
                quadra: 'Бета',
                role: 'Инспектор',
                communication: 'Четкий, конкретный, не любит абстракций. Ценит порядок и дисциплину.',
                career: 'Администратор, военный, инженер, бухгалтер',
                partners: 'EIE (Гамлет) — дуал',
                motto: 'Порядок бьет класс.'
            },
            'SEE': {
                name: 'Наполеон',
                fullName: 'Сенсорно-этический экстраверт',
                description: 'Лидер, прагматик, завоеватель. Знает, чего хочет, и умеет этого добиться.',
                strengths: 'Сенсорика волевая, этика отношений',
                weaknesses: 'Интуиция возможностей, структурная логика',
                traits: ['властный', 'прагматичный', 'обаятельный', 'целеустремленный'],
                quadra: 'Гамма',
                role: 'Политик',
                communication: 'Уверенный, влиятельный. Умеет убеждать и вести за собой.',
                career: 'Руководитель, политик, бизнесмен, дипломат',
                partners: 'ILI (Бальзак) — дуал',
                motto: 'Если цель поставлена, препятствия — это просто детали.'
            },
            'ILI': {
                name: 'Бальзак',
                fullName: 'Интуитивно-логический интроверт',
                description: 'Критик, скептик, стратег. Видит негативные сценарии и готовится к ним.',
                strengths: 'Интуиция времени, структурная логика',
                weaknesses: 'Этика отношений, сенсорика волевая',
                traits: ['скептичный', 'стратегичный', 'наблюдательный', 'пессимистичный'],
                quadra: 'Гамма',
                role: 'Критик',
                communication: 'Спокойный, ироничный. Видит недостатки, но не всегда говорит о них.',
                career: 'Аналитик, программист, писатель, философ',
                partners: 'SEE (Наполеон) — дуал',
                motto: 'Хочешь мира — готовься к худшему.'
            },
            'SLE': {
                name: 'Жуков',
                fullName: 'Сенсорно-логический экстраверт',
                description: 'Завоеватель, стратег, реализатор. Действует быстро, решительно, без сантиментов.',
                strengths: 'Сенсорика волевая, деловая логика',
                weaknesses: 'Этика эмоций, интуиция возможностей',
                traits: ['решительный', 'бескомпромиссный', 'энергичный', 'нетерпеливый'],
                quadra: 'Гамма',
                role: 'Легионер',
                communication: 'Прямой, резкий, по делу. Не терпит пустых разговоров.',
                career: 'Военный, спортсмен, предприниматель, менеджер',
                partners: 'IEI (Есенин) — дуал',
                motto: 'Победа любой ценой.'
            },
            'IEI': {
                name: 'Есенин',
                fullName: 'Интуитивно-этический интроверт',
                description: 'Лирик, мечтатель, романтик. Чувствует красоту и гармонию мира.',
                strengths: 'Интуиция времени, этика эмоций',
                weaknesses: 'Деловая логика, сенсорика волевая',
                traits: ['романтичный', 'мечтательный', 'чувствительный', 'непрактичный'],
                quadra: 'Гамма',
                role: 'Лирик',
                communication: 'Мягкий, поэтичный, вдохновляющий. Говорит образами.',
                career: 'Поэт, художник, психолог, дизайнер',
                partners: 'SLE (Жуков) — дуал',
                motto: 'Красота спасет мир, если мы ее сохраним.'
            },
            'LIE': {
                name: 'Джек Лондон',
                fullName: 'Логико-интуитивный экстраверт',
                description: 'Предприниматель, новатор, деятельный. Всегда в поиске новых возможностей.',
                strengths: 'Деловая логика, интуиция возможностей',
                weaknesses: 'Этика отношений, сенсорика ощущений',
                traits: ['деятельный', 'предприимчивый', 'оптимистичный', 'бескомпромиссный'],
                quadra: 'Дельта',
                role: 'Предприниматель',
                communication: 'Деловой, быстрый, по существу. Ценит время.',
                career: 'Бизнесмен, изобретатель, путешественник, журналист',
                partners: 'ESI (Драйзер) — дуал',
                motto: 'Время — деньги, не трать его зря.'
            },
            'ESI': {
                name: 'Драйзер',
                fullName: 'Этико-сенсорный интроверт',
                description: 'Хранитель морали, защитник, принципиальный. Отстаивает свои ценности.',
                strengths: 'Этика отношений, сенсорика ощущений',
                weaknesses: 'Интуиция возможностей, деловая логика',
                traits: ['принципиальный', 'преданный', 'осторожный', 'моральный'],
                quadra: 'Дельта',
                role: 'Хранитель',
                communication: 'Сдержанный, этичный. Не терпит аморальности.',
                career: 'Учитель, юрист, психолог, священник',
                partners: 'LIE (Джек Лондон) — дуал',
                motto: 'Есть вещи, которые нельзя продавать.'
            },
            'FLE': {
                name: 'Штирлиц',
                fullName: 'Логико-сенсорный экстраверт',
                description: 'Администратор, трудоголик, ответственный. Организует процессы и доводит до результата.',
                strengths: 'Деловая логика, сенсорика волевая',
                weaknesses: 'Интуиция времени, этика эмоций',
                traits: ['трудолюбивый', 'ответственный', 'системный', 'пунктуальный'],
                quadra: 'Дельта',
                role: 'Администратор',
                communication: 'Конкретный, деловой, без лишних эмоций. Ценит факты.',
                career: 'Менеджер, администратор, инженер, следователь',
                partners: 'SEI (Дюма) — дуал',
                motto: 'Работа — лучший способ отдохнуть от работы.'
            },
            'SE': {
                name: 'Достоевский',
                fullName: 'Этико-интуитивный интроверт',
                description: 'Гуманист, эмпат, психолог. Глубоко чувствует людей и их проблемы.',
                strengths: 'Этика отношений, интуиция возможностей',
                weaknesses: 'Деловая логика, сенсорика волевая',
                traits: ['эмпатичный', 'гуманный', 'жертвенный', 'чувствительный'],
                quadra: 'Дельта',
                role: 'Гуманист',
                communication: 'Мягкий, понимающий, вникающий. Слушает и сочувствует.',
                career: 'Психолог, врач, педагог, писатель',
                partners: 'FLE (Штирлиц) — дуал',
                motto: 'Человек — это звучит гордо, но иногда очень больно.'
            }
        };

        this.intertypeRelations = {
            'дуал': 'Самые гармоничные отношения. Полное дополнение, взаимопонимание без слов.',
            'активатор': 'Отношения взаимной активации. Интересно, но быстро утомляют.',
            'зеркальные': 'Похожи, но видят друг в друге недостатки. Хорошо для работы.',
            'тождественные': 'Одинаковые типы. Понимание, но скука от предсказуемости.',
            'деловые': 'Хорошо для совместной работы, но в личном могут быть проблемы.',
            'миражные': 'Приятно, расслабленно, но нет глубины.',
            'квазитождество': 'Непонимание, раздражение. Трудно найти общий язык.',
            'конфликт': 'Самые тяжелые отношения. Постоянное напряжение.'
        };
    }

    calculate(data) {
        const { answers, method, question } = data;

        let typeCode;

        if (method === 'test' && answers) {
            typeCode = this.determineTypeByTest(answers);
        } else {
            // Случайный тип для демонстрации
            const codes = Object.keys(this.types);
            typeCode = codes[Math.floor(Math.random() * codes.length)];
        }

        const type = this.types[typeCode];

        // Определяем совместимость с другими типами
        const compatibility = this.getCompatibility(typeCode);

        // Рекомендации по развитию
        const development = this.getDevelopmentAdvice(type);

        // Прогноз на день
        const dailyForecast = this.getDailyForecast(typeCode);

        return {
            type: {
                code: typeCode,
                name: type.name,
                fullName: type.fullName,
                description: type.description,
                strengths: type.strengths,
                weaknesses: type.weaknesses,
                traits: type.traits,
                quadra: type.quadra,
                role: type.role,
                communication: type.communication,
                career: type.career,
                motto: type.motto
            },
            compatibility,
            development,
            dailyForecast,
            question: question || 'Самопознание',
            interpretation: this.generateInterpretation(type, compatibility, development, question)
        };
    }

    determineTypeByTest(answers) {
        // Упрощенный алгоритм определения типа
        // В реальности нужна полноценная система с 4 шкалами

        let extrovert = 0; // 1 - экстраверт, 0 - интроверт
        let sensing = 0; // 1 - сенсорик, 0 - интуит
        let logic = 0; // 1 - логик, 0 - этик
        let rational = 0; // 1 - рационал, 0 - иррационал

        if (answers.q1) extrovert = answers.q1 > 3 ? 1 : 0;
        if (answers.q2) sensing = answers.q2 > 3 ? 1 : 0;
        if (answers.q3) logic = answers.q3 > 3 ? 1 : 0;
        if (answers.q4) rational = answers.q4 > 3 ? 1 : 0;

        // Таблица типов
        const typeTable = {
            '1111': 'ILE', // Дон Кихот
            '0111': 'SEI', // Дюма
            '1011': 'ESE', // Гюго
            '0011': 'LII', // Робеспьер
            '1101': 'EIE', // Гамлет
            '0101': 'LSI', // Максим
            '1001': 'SEE', // Наполеон
            '0001': 'ILI', // Бальзак
            '1110': 'SLE', // Жуков
            '0110': 'IEI', // Есенин
            '1010': 'LIE', // Джек Лондон
            '0010': 'ESI', // Драйзер
            '1100': 'FLE', // Штирлиц
            '0100': 'SEI', // Достоевский
            '1000': 'IEE', // Гексли
            '0000': 'SLI'  // Габен
        };

        const key = `${extrovert}${sensing}${logic}${rational}`;
        return typeTable[key] || 'ILE';
    }

    getCompatibility(typeCode) {
        const compatibilityTable = {
            'ILE': { dual: 'SEI', activator: 'LII', mirror: 'SEE', conflict: 'LSI' },
            'SEI': { dual: 'ILE', activator: 'ESE', mirror: 'IEI', conflict: 'SLE' },
            'ESE': { dual: 'LII', activator: 'SEI', mirror: 'EIE', conflict: 'ILI' },
            'LII': { dual: 'ESE', activator: 'ILE', mirror: 'LSI', conflict: 'SEE' },
            'EIE': { dual: 'LSI', activator: 'IEI', mirror: 'ESE', conflict: 'SLI' },
            'LSI': { dual: 'EIE', activator: 'LII', mirror: 'SLE', conflict: 'ILE' },
            'SEE': { dual: 'ILI', activator: 'SLE', mirror: 'ILE', conflict: 'LII' },
            'ILI': { dual: 'SEE', activator: 'SLI', mirror: 'IEI', conflict: 'ESE' },
            'SLE': { dual: 'IEI', activator: 'SEE', mirror: 'LSI', conflict: 'SEI' },
            'IEI': { dual: 'SLE', activator: 'EIE', mirror: 'SEI', conflict: 'FLE' },
            'LIE': { dual: 'ESI', activator: 'FLE', mirror: 'IEE', conflict: 'SEI' },
            'ESI': { dual: 'LIE', activator: 'EII', mirror: 'SEE', conflict: 'ILE' },
            'FLE': { dual: 'SEI', activator: 'LIE', mirror: 'SLI', conflict: 'IEI' },
            'SLI': { dual: 'IEE', activator: 'ILI', mirror: 'FLE', conflict: 'EIE' },
            'IEE': { dual: 'SLI', activator: 'EII', mirror: 'LIE', conflict: 'LSI' },
            'EII': { dual: 'FLE', activator: 'ESI', mirror: 'IEI', conflict: 'SLE' }
        };

        const comp = compatibilityTable[typeCode] || {};

        return {
            dual: {
                code: comp.dual,
                name: this.types[comp.dual]?.name || 'Не определен',
                description: this.intertypeRelations['дуал']
            },
            activator: {
                code: comp.activator,
                name: this.types[comp.activator]?.name || 'Не определен',
                description: this.intertypeRelations['активатор']
            },
            mirror: {
                code: comp.mirror,
                name: this.types[comp.mirror]?.name || 'Не определен',
                description: this.intertypeRelations['зеркальные']
            },
            conflict: {
                code: comp.conflict,
                name: this.types[comp.conflict]?.name || 'Не определен',
                description: this.intertypeRelations['конфликт']
            }
        };
    }

    getDevelopmentAdvice(type) {
        return [
            `Развивайте свою сильную функцию: ${type.strengths}`,
            `Обратите внимание на слабую функцию: ${type.weaknesses}. Там скрыт ваш потенциал роста.`,
            `Вам полезно общаться с представителями типа ${this.getRecommendedTypeForGrowth(type)}`,
            `Ваша квадровая миссия: ${this.getQuadraMission(type.quadra)}`
        ];
    }

    getRecommendedTypeForGrowth(type) {
        const recommendations = {
            'Альфа': 'Бета',
            'Бета': 'Гамма',
            'Гамма': 'Дельта',
            'Дельта': 'Альфа'
        };
        return recommendations[type.quadra] || 'другой квадры';
    }

    getQuadraMission(quadra) {
        const missions = {
            'Альфа': 'Исследование нового, создание теорий, интеллектуальное развитие',
            'Бета': 'Власть, иерархия, борьба идей, защита ценностей',
            'Гамма': 'Практическая реализация, накопление ресурсов, эффективность',
            'Дельта': 'Гармонизация, улучшение качества жизни, забота о будущем'
        };
        return missions[quadra] || 'Самореализация';
    }

    getDailyForecast(typeCode) {
        const forecasts = {
            'ILE': 'Сегодня вас посетят гениальные идеи. Запишите их, но не спешите реализовывать.',
            'SEI': 'День для наслаждения простыми радостями. Устройте себе комфортный вечер.',
            'ESE': 'Ваша энергия заразительна. Соберите друзей и устройте праздник.',
            'LII': 'День для анализа и размышлений. Побудьте в тишине.',
            'EIE': 'Ваша интуиция обострена. Следуйте предчувствиям.',
            'LSI': 'Порядок во всем — залог успеха сегодня. Разложите дела по полочкам.',
            'SEE': 'Ваше обаяние открывает любые двери. Используйте это.',
            'ILI': 'День для наблюдения. Не вмешивайтесь, смотрите со стороны.',
            'SLE': 'Действуйте решительно. Препятствия созданы, чтобы их преодолевать.',
            'IEI': 'Ваша чувствительность сегодня на пике. Займитесь творчеством.',
            'LIE': 'День для сделок и договоренностей. Ваша деловая хватка обострена.',
            'ESI': 'Доверяйте своему чувству справедливости. Оно не подведет.',
            'FLE': 'Работа спорится. Сделайте больше запланированного.',
            'SLI': 'День для практичных дел. Почините то, что давно просится.',
            'IEE': 'Общение принесет неожиданные открытия. Будьте открыты.',
            'EII': 'Ваша эмпатия поможет кому-то сегодня. Не проходите мимо.'
        };

        return forecasts[typeCode] || 'День благоприятен для самопознания.';
    }

    generateInterpretation(type, compatibility, development, question) {
        return `
🧠 **16 ТИПОВ ЛИЧНОСТИ - СОЦИОНИКА** 🧠

**ВАШ ТИП: ${type.code} - ${type.name}**
*${type.fullName}*

${type.description}

**КЛЮЧЕВЫЕ ЧЕРТЫ**
${type.traits.map(t => `• ${t}`).join('\n')}

**СИЛЬНЫЕ СТОРОНЫ**
${type.strengths}

**СЛАБЫЕ СТОРОНЫ** (зона роста)
${type.weaknesses}

**КВАДРА**
${type.quadra} - ${this.getQuadraMission(type.quadra)}

**РОЛЬ В ОБЩЕСТВЕ**
${type.role}

**СТИЛЬ ОБЩЕНИЯ**
${type.communication}

**ПОДХОДЯЩИЕ ПРОФЕССИИ**
${type.career}

**СОВМЕСТИМОСТЬ**

🔹 **Дуал (идеальный партнер)**: ${compatibility.dual.name} (${compatibility.dual.code})
   ${compatibility.dual.description}

🔸 **Активатор**: ${compatibility.activator.name} (${compatibility.activator.code})
   ${compatibility.activator.description}

🔹 **Зеркальный**: ${compatibility.mirror.name} (${compatibility.mirror.code})
   ${compatibility.mirror.description}

🔸 **Конфликтный**: ${compatibility.conflict.name} (${compatibility.conflict.code})
   ${compatibility.conflict.description}

**РЕКОМЕНДАЦИИ ПО РАЗВИТИЮ**

${development.map((d, i) => `${i+1}. ${d}`).join('\n')}

**ПРОГНОЗ НА СЕГОДНЯ**
${this.dailyForecast}

**ДЕВИЗ ВАШЕГО ТИПА**
"${type.motto}"

${question ? `**ОТВЕТ НА ВАШ ВОПРОС**\n\nВ контексте вашего типа личности, вопрос о "${question}" требует ${this.answerQuestionByType(type, question)}` : ''}

**СОВЕТ СОЦИОНИКИ**

Помните: нет плохих или хороших типов. Каждый тип по-своему ценен и необходим для гармоничного существования общества. Ваша задача — не стать "кем-то другим", а максимально реализовать свой природный потенциал.
        `;
    }

    answerQuestionByType(type, question) {
        const answers = [
            'логического подхода, а не эмоциональных решений',
            'доверия интуиции, а не сухим фактам',
            'конкретных действий, а не абстрактных размышлений',
            'эмпатии и понимания чувств других',
            'системного анализа всех возможных вариантов',
            'быстрого решительного действия',
            'терпения и наблюдения за развитием ситуации',
            'творческого нестандартного подхода'
        ];

        return answers[type.code.length % answers.length];
    }
}

module.exports = SocionicsService;