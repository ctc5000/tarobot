// modules/Astropsychology/Migrations/20260325000001-create-astropsychology-signs.js
'use strict';

const SIGNS_DATA = [
    {
        code: 'aries', name_ru: 'Овен', symbol: '♈', element: 'Огонь', quality: 'Кардинальный',
        ruling_planet: 'Марс', start_degree: 0, end_degree: 30,
        positive_traits: JSON.stringify(['Смелость', 'Инициативность', 'Энергичность', 'Честность', 'Оптимизм']),
        negative_traits: JSON.stringify(['Импульсивность', 'Эгоцентризм', 'Нетерпеливость', 'Агрессивность']),
        description: 'Овен — первый знак зодиака, символизирующий начало, рождение, инициативу. Люди этого знака обладают огромной энергией, смелостью и желанием быть первыми во всем.',
        sun_description: 'Ваше эго — первопроходец. Вы хотите быть первым, начинать новое, проявлять инициативу. Ваша жизненная сила проявляется через действие и конкуренцию.',
        moon_description: 'Ваши эмоции быстры и импульсивны. Вы остро реагируете, но быстро остываете. Эмоциональная безопасность для вас — это возможность действовать свободно.',
        ascendant_description: 'Вы производите впечатление энергичного, прямолинейного человека. Ваша внешность активная, движения быстрые. Вас воспринимают как лидера.',
        sort_order: 1
    },
    {
        code: 'taurus', name_ru: 'Телец', symbol: '♉', element: 'Земля', quality: 'Фиксированный',
        ruling_planet: 'Венера', start_degree: 30, end_degree: 60,
        positive_traits: JSON.stringify(['Надежность', 'Терпеливость', 'Практичность', 'Чувственность', 'Верность']),
        negative_traits: JSON.stringify(['Упрямство', 'Консерватизм', 'Собственничество', 'Лень']),
        description: 'Телец — знак стабильности, надежности и чувственности. Люди этого знака ценят комфорт, красоту и материальную безопасность.',
        sun_description: 'Ваше эго — строитель. Вы хотите стабильности, комфорта, материальных благ. Ваша сила в терпении и способности создавать устойчивые ценности.',
        moon_description: 'Ваши эмоции стабильны и предсказуемы. Вам нужно чувство безопасности, комфорта и физического уюта. Вы не любите спешки в эмоциональных вопросах.',
        ascendant_description: 'Вы кажетесь спокойным, надежным, основательным человеком. Вас воспринимают как человека с устойчивыми ценностями и твердым характером.',
        sort_order: 2
    },
    {
        code: 'gemini', name_ru: 'Близнецы', symbol: '♊', element: 'Воздух', quality: 'Мутабельный',
        ruling_planet: 'Меркурий', start_degree: 60, end_degree: 90,
        positive_traits: JSON.stringify(['Общительность', 'Любознательность', 'Адаптивность', 'Остроумие', 'Гибкость']),
        negative_traits: JSON.stringify(['Поверхностность', 'Непостоянство', 'Болтливость', 'Двойственность']),
        description: 'Близнецы — знак коммуникации, интеллекта и адаптивности. Люди этого знака любят общаться, узнавать новое и легко приспосабливаются к изменениям.',
        sun_description: 'Ваше эго — коммуникатор. Вы хотите информации, общения, разнообразия. Ваша сила в способности связывать людей и идеи.',
        moon_description: 'Ваши эмоции изменчивы и подвижны. Вы реагируете интеллектуально, ищете понимания и новых впечатлений. Вам нужно разнообразие в эмоциональной жизни.',
        ascendant_description: 'Вы производите впечатление общительного, любознательного человека. Вас видят моложавым и подвижным, всегда в курсе новостей.',
        sort_order: 3
    },
    {
        code: 'cancer', name_ru: 'Рак', symbol: '♋', element: 'Вода', quality: 'Кардинальный',
        ruling_planet: 'Луна', start_degree: 90, end_degree: 120,
        positive_traits: JSON.stringify(['Заботливость', 'Интуитивность', 'Эмпатия', 'Верность', 'Творческость']),
        negative_traits: JSON.stringify(['Обидчивость', 'Мнительность', 'Зависимость', 'Капризность']),
        description: 'Рак — знак дома, семьи и эмоциональной глубины. Люди этого знака очень чувствительны, заботливы и ценят домашний уют.',
        sun_description: 'Ваше эго — заботливый. Вы хотите безопасности, семьи, эмоциональной связи. Ваша сила в эмпатии и способности создавать уют.',
        moon_description: 'Ваши эмоции глубоки и чувствительны. Вы очень ранимы и нуждаетесь в защите. Эмоциональная безопасность для вас важнее всего.',
        ascendant_description: 'Вы кажетесь мягким, заботливым, чувствительным человеком. Люди чувствуют в вас защиту, понимание и готовность поддержать.',
        sort_order: 4
    },
    {
        code: 'leo', name_ru: 'Лев', symbol: '♌', element: 'Огонь', quality: 'Фиксированный',
        ruling_planet: 'Солнце', start_degree: 120, end_degree: 150,
        positive_traits: JSON.stringify(['Щедрость', 'Уверенность', 'Творческость', 'Великодушие', 'Лидерство']),
        negative_traits: JSON.stringify(['Эгоцентризм', 'Тщеславие', 'Властность', 'Драматичность']),
        description: 'Лев — знак творчества, лидерства и самовыражения. Люди этого знака любят быть в центре внимания, щедры и великодушны.',
        sun_description: 'Ваше эго — творец. Вы хотите признания, любви, самовыражения. Ваша сила в способности вдохновлять и вести за собой.',
        moon_description: 'Ваши эмоции ярки и выразительны. Вам нужно признание и восхищение. Вы эмоционально щедры, но ждете ответной благодарности.',
        ascendant_description: 'Вы производите впечатление гордого, щедрого, уверенного человека. Вас замечают, когда вы входите в комнату. Вы прирожденный лидер.',
        sort_order: 5
    },
    {
        code: 'virgo', name_ru: 'Дева', symbol: '♍', element: 'Земля', quality: 'Мутабельный',
        ruling_planet: 'Меркурий', start_degree: 150, end_degree: 180,
        positive_traits: JSON.stringify(['Аналитичность', 'Практичность', 'Внимательность', 'Трудолюбие', 'Скромность']),
        negative_traits: JSON.stringify(['Критичность', 'Перфекционизм', 'Мнительность', 'Склонность к тревоге']),
        description: 'Дева — знак анализа, порядка и служения. Люди этого знака внимательны к деталям, практичны и стремятся к совершенству.',
        sun_description: 'Ваше эго — аналитик. Вы хотите порядка, пользы, совершенства. Ваша сила в способности видеть детали и улучшать все вокруг.',
        moon_description: 'Ваши эмоции аналитичны и сдержаны. Вы тревожитесь о мелочах, ищете порядок и контроль. Вам важно чувствовать себя полезным.',
        ascendant_description: 'Вы кажетесь скромным, аналитичным, практичным человеком. Люди видят в вас помощника, советчика и надежного исполнителя.',
        sort_order: 6
    },
    {
        code: 'libra', name_ru: 'Весы', symbol: '♎', element: 'Воздух', quality: 'Кардинальный',
        ruling_planet: 'Венера', start_degree: 180, end_degree: 210,
        positive_traits: JSON.stringify(['Дипломатичность', 'Обаяние', 'Справедливость', 'Гармоничность', 'Тактичность']),
        negative_traits: JSON.stringify(['Нерешительность', 'Зависимость от мнения других', 'Поверхностность']),
        description: 'Весы — знак баланса, гармонии и партнерства. Люди этого знака дипломатичны, обаятельны и стремятся к справедливости.',
        sun_description: 'Ваше эго — дипломат. Вы хотите гармонии, партнерства, красоты. Ваша сила в способности находить баланс и объединять людей.',
        moon_description: 'Ваши эмоции направлены на гармонию и красоту. Вам нужны мир, красивое окружение и гармоничные отношения. Вы избегаете конфликтов.',
        ascendant_description: 'Вы производите впечатление дипломатичного, обаятельного человека. Вас воспринимают как эстета, ценящего красоту и гармонию.',
        sort_order: 7
    },
    {
        code: 'scorpio', name_ru: 'Скорпион', symbol: '♏', element: 'Вода', quality: 'Фиксированный',
        ruling_planet: 'Плутон, Марс', start_degree: 210, end_degree: 240,
        positive_traits: JSON.stringify(['Страстность', 'Глубина', 'Проницательность', 'Сила воли', 'Преданность']),
        negative_traits: JSON.stringify(['Ревность', 'Мстительность', 'Скрытность', 'Контроль']),
        description: 'Скорпион — знак трансформации, глубины и страсти. Люди этого знака обладают огромной внутренней силой и способностью к возрождению.',
        sun_description: 'Ваше эго — исследователь глубин. Вы хотите трансформации, истины, страсти. Ваша сила в способности проникать в суть вещей.',
        moon_description: 'Ваши эмоции интенсивны и глубоки. Вы чувствуете очень сильно, долго помните обиды, не прощаете предательства. Вам нужна эмоциональная глубина.',
        ascendant_description: 'Вы кажетесь интенсивным, загадочным, проницательным человеком. Люди чувствуют вашу глубину и внутреннюю силу с первого взгляда.',
        sort_order: 8
    },
    {
        code: 'sagittarius', name_ru: 'Стрелец', symbol: '♐', element: 'Огонь', quality: 'Мутабельный',
        ruling_planet: 'Юпитер', start_degree: 240, end_degree: 270,
        positive_traits: JSON.stringify(['Оптимизм', 'Свободолюбие', 'Честность', 'Философский склад ума', 'Энтузиазм']),
        negative_traits: JSON.stringify(['Нетерпеливость', 'Тактичность', 'Безответственность', 'Фанатизм']),
        description: 'Стрелец — знак путешествий, философии и расширения горизонтов. Люди этого знака оптимистичны, любят приключения и ищут смысл жизни.',
        sun_description: 'Ваше эго — философ. Вы хотите свободы, смысла, приключений. Ваша сила в способности видеть картину целиком и вдохновлять других.',
        moon_description: 'Ваши эмоции оптимистичны и свободолюбивы. Вам нужна свобода, новые впечатления и смысл. Вы эмоционально щедры, но не терпите ограничений.',
        ascendant_description: 'Вы производите впечатление оптимистичного, свободолюбивого человека. Вас видят искателем приключений и философом.',
        sort_order: 9
    },
    {
        code: 'capricorn', name_ru: 'Козерог', symbol: '♑', element: 'Земля', quality: 'Кардинальный',
        ruling_planet: 'Сатурн', start_degree: 270, end_degree: 300,
        positive_traits: JSON.stringify(['Ответственность', 'Дисциплина', 'Амбициозность', 'Практичность', 'Терпение']),
        negative_traits: JSON.stringify(['Пессимизм', 'Сдержанность', 'Черствость', 'Трудоголизм']),
        description: 'Козерог — знак достижений, ответственности и мудрости. Люди этого знака амбициозны, дисциплинированы и стремятся к вершинам.',
        sun_description: 'Ваше эго — лидер. Вы хотите достижений, статуса, ответственности. Ваша сила в терпении и способности строить долгосрочные планы.',
        moon_description: 'Ваши эмоции сдержаны и контролируемы. Вы боитесь уязвимости, поэтому держите чувства под контролем. Вам нужны достижения и признание.',
        ascendant_description: 'Вы кажетесь ответственным, серьезным, амбициозным человеком. Люди воспринимают вас как зрелого, надежного и целеустремленного.',
        sort_order: 10
    },
    {
        code: 'aquarius', name_ru: 'Водолей', symbol: '♒', element: 'Воздух', quality: 'Фиксированный',
        ruling_planet: 'Уран, Сатурн', start_degree: 300, end_degree: 330,
        positive_traits: JSON.stringify(['Оригинальность', 'Независимость', 'Гуманизм', 'Изобретательность', 'Дружелюбие']),
        negative_traits: JSON.stringify(['Эксцентричность', 'Отстраненность', 'Непредсказуемость', 'Бунтарство']),
        description: 'Водолей — знак инноваций, свободы и гуманизма. Люди этого знака оригинальны, независимы и думают о будущем.',
        sun_description: 'Ваше эго — реформатор. Вы хотите свободы, инноваций, независимости. Ваша сила в способности видеть будущее и менять мир.',
        moon_description: 'Ваши эмоции необычны и непредсказуемы. Вы реагируете нестандартно, цените свободу и независимость. Вам нужны единомышленники и друзья.',
        ascendant_description: 'Вы производите впечатление оригинального, независимого человека. Вас видят немного эксцентричным, но интересным собеседником.',
        sort_order: 11
    },
    {
        code: 'pisces', name_ru: 'Рыбы', symbol: '♓', element: 'Вода', quality: 'Мутабельный',
        ruling_planet: 'Нептун, Юпитер', start_degree: 330, end_degree: 360,
        positive_traits: JSON.stringify(['Эмпатия', 'Творческость', 'Интуитивность', 'Сострадание', 'Духовность']),
        negative_traits: JSON.stringify(['Эскапизм', 'Иллюзорность', 'Жертвенность', 'Зависимость']),
        description: 'Рыбы — знак интуиции, творчества и духовности. Люди этого знака очень чувствительны, эмпатичны и имеют богатое воображение.',
        sun_description: 'Ваше эго — мистик. Вы хотите единения, духовности, растворения. Ваша сила в эмпатии, интуиции и творческом воображении.',
        moon_description: 'Ваши эмоции безграничны и всепроникающи. Вы очень эмпатичны, чувствуете всех и всё. Вам нужно творчество, уединение и духовная связь.',
        ascendant_description: 'Вы кажетесь мечтательным, сострадательным, загадочным человеком. Люди чувствуют вашу эмпатию и готовность помочь.',
        sort_order: 12
    }
];

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tables = await queryInterface.showAllTables();

        if (!tables.includes('astropsychology_signs')) {
            await queryInterface.createTable('astropsychology_signs', {
                id: {
                    type: Sequelize.INTEGER,
                    autoIncrement: true,
                    primaryKey: true
                },
                code: {
                    type: Sequelize.STRING(20),
                    allowNull: false,
                    unique: true,
                    comment: 'Код знака (aries, taurus, etc)'
                },
                name_ru: {
                    type: Sequelize.STRING(50),
                    allowNull: false,
                    comment: 'Название на русском'
                },
                symbol: {
                    type: Sequelize.STRING(5),
                    allowNull: false,
                    comment: 'Символ знака (♈, ♉, etc)'
                },
                element: {
                    type: Sequelize.STRING(20),
                    allowNull: false,
                    comment: 'Стихия (Огонь, Земля, Воздух, Вода)'
                },
                quality: {
                    type: Sequelize.STRING(20),
                    allowNull: false,
                    comment: 'Качество (Кардинальный, Фиксированный, Мутабельный)'
                },
                ruling_planet: {
                    type: Sequelize.STRING(50),
                    allowNull: true,
                    comment: 'Управляющая планета'
                },
                start_degree: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    comment: 'Начальный градус (0, 30, 60, etc)'
                },
                end_degree: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    comment: 'Конечный градус (30, 60, 90, etc)'
                },
                positive_traits: {
                    type: Sequelize.TEXT,
                    allowNull: true,
                    comment: 'Положительные черты (JSON)'
                },
                negative_traits: {
                    type: Sequelize.TEXT,
                    allowNull: true,
                    comment: 'Отрицательные черты (JSON)'
                },
                description: {
                    type: Sequelize.TEXT,
                    allowNull: true,
                    comment: 'Общее описание знака'
                },
                sun_description: {
                    type: Sequelize.TEXT,
                    allowNull: true,
                    comment: 'Описание Солнца в знаке'
                },
                moon_description: {
                    type: Sequelize.TEXT,
                    allowNull: true,
                    comment: 'Описание Луны в знаке'
                },
                ascendant_description: {
                    type: Sequelize.TEXT,
                    allowNull: true,
                    comment: 'Описание Асцендента в знаке'
                },
                sort_order: {
                    type: Sequelize.INTEGER,
                    defaultValue: 0
                },
                created_at: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
                },
                updated_at: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
                }
            });

            // Добавляем индексы
            await queryInterface.addIndex('astropsychology_signs', ['code'], { unique: true });
            await queryInterface.addIndex('astropsychology_signs', ['start_degree', 'end_degree']);

            console.log('[Astropsychology Migration] ✅ Таблица astropsychology_signs создана');

            // Заполняем данными
            await queryInterface.bulkInsert('astropsychology_signs', SIGNS_DATA);
            console.log('[Astropsychology Migration] ✅ Данные знаков загружены');
        } else {
            console.log('[Astropsychology Migration] 📌 Таблица astropsychology_signs уже существует');
        }
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('astropsychology_signs');
        console.log('[Astropsychology Migration] 🗑️ Таблица astropsychology_signs удалена');
    }
};