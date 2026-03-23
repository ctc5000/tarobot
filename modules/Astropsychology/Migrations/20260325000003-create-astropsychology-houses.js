// modules/Astropsychology/Migrations/20260325000003-create-astropsychology-houses.js
'use strict';

const HOUSES_DATA = [
    {
        number: 1, name_ru: 'Дом личности', name_en: 'House of Self',
        area: 'Внешность, характер, начало',
        keywords: 'Я, маска, поведение, инициатива',
        natural_sign: 'Овен', natural_planet: 'Марс',
        description: 'Первый дом отвечает за вашу личность, внешность, манеру поведения и то, как вас воспринимают другие. Это ваша "маска", которую вы надеваете при встрече с миром.',
        planets_in_house_meaning: 'Планеты в первом доме сильно влияют на вашу личность и самовыражение, делая эти качества более заметными.',
        sign_on_cusp_meaning: 'Знак на куспиде первого дома описывает вашу внешнюю манеру поведения и первое впечатление.'
    },
    {
        number: 2, name_ru: 'Дом финансов', name_en: 'House of Value',
        area: 'Деньги, ресурсы, самооценка',
        keywords: 'Ценности, доход, таланты, собственность',
        natural_sign: 'Телец', natural_planet: 'Венера',
        description: 'Второй дом показывает ваше отношение к деньгам, материальным ценностям, а также ваши врожденные таланты и самооценку.',
        planets_in_house_meaning: 'Планеты во втором доме указывают на то, как вы зарабатываете и тратите деньги, и что для вас ценно.',
        sign_on_cusp_meaning: 'Знак на куспиде второго дома описывает ваше отношение к деньгам и материальным ценностям.'
    },
    {
        number: 3, name_ru: 'Дом коммуникации', name_en: 'House of Communication',
        area: 'Общение, обучение, братья/сестры',
        keywords: 'Речь, информация, контакты, поездки',
        natural_sign: 'Близнецы', natural_planet: 'Меркурий',
        description: 'Третий дом управляет общением, обучением, ближайшим окружением, братьями и сестрами, а также короткими поездками.',
        planets_in_house_meaning: 'Планеты в третьем доме влияют на ваш стиль общения, мышление и отношения с братьями/сестрами.',
        sign_on_cusp_meaning: 'Знак на куспиде третьего дома описывает ваш стиль общения и способ усвоения информации.'
    },
    {
        number: 4, name_ru: 'Дом семьи', name_en: 'House of Home',
        area: 'Дом, семья, корни, прошлое',
        keywords: 'Род, недвижимость, безопасность, традиции',
        natural_sign: 'Рак', natural_planet: 'Луна',
        description: 'Четвертый дом символизирует дом, семью, корни, родительский дом и то, что дает вам чувство безопасности.',
        planets_in_house_meaning: 'Планеты в четвертом доме указывают на атмосферу в вашем доме, отношения с семьей и ваши корни.',
        sign_on_cusp_meaning: 'Знак на куспиде четвертого дома описывает ваше представление о доме и семейных ценностях.'
    },
    {
        number: 5, name_ru: 'Дом творчества', name_en: 'House of Pleasure',
        area: 'Любовь, дети, хобби, творчество',
        keywords: 'Самовыражение, удовольствия, романтика',
        natural_sign: 'Лев', natural_planet: 'Солнце',
        description: 'Пятый дом отвечает за творчество, любовные увлечения, детей, хобби и все, что приносит радость.',
        planets_in_house_meaning: 'Планеты в пятом доме влияют на ваше творческое самовыражение, романтические увлечения и отношения с детьми.',
        sign_on_cusp_meaning: 'Знак на куспиде пятого дома описывает ваш стиль творчества и то, как вы выражаете любовь.'
    },
    {
        number: 6, name_ru: 'Дом здоровья', name_en: 'House of Health',
        area: 'Работа, здоровье, служение',
        keywords: 'Долг, забота, рутина, гигиена',
        natural_sign: 'Дева', natural_planet: 'Меркурий',
        description: 'Шестой дом управляет работой, здоровьем, повседневными обязанностями и служением другим.',
        planets_in_house_meaning: 'Планеты в шестом доме указывают на ваше отношение к работе, здоровью и повседневным обязанностям.',
        sign_on_cusp_meaning: 'Знак на куспиде шестого дома описывает ваш подход к работе и заботе о здоровье.'
    },
    {
        number: 7, name_ru: 'Дом партнерства', name_en: 'House of Partnership',
        area: 'Брак, партнеры, отношения',
        keywords: 'Союз, контракты, открытые враги',
        natural_sign: 'Весы', natural_planet: 'Венера',
        description: 'Седьмой дом отвечает за брак, партнерские отношения, союзы и открытых врагов. Это дом "других людей".',
        planets_in_house_meaning: 'Планеты в седьмом доме влияют на ваши отношения с партнерами и то, каких партнеров вы привлекаете.',
        sign_on_cusp_meaning: 'Знак на куспиде седьмого дома описывает качества, которые вы ищете в партнере.'
    },
    {
        number: 8, name_ru: 'Дом трансформации', name_en: 'House of Transformation',
        area: 'Кризисы, секс, чужие деньги',
        keywords: 'Смерть, возрождение, наследство',
        natural_sign: 'Скорпион', natural_planet: 'Плутон',
        description: 'Восьмой дом управляет кризисами, трансформацией, сексуальностью, чужими деньгами (наследство, кредиты).',
        planets_in_house_meaning: 'Планеты в восьмом доме указывают на то, как вы проходите через кризисы и трансформации, отношение к сексу и чужим ресурсам.',
        sign_on_cusp_meaning: 'Знак на куспиде восьмого дома описывает ваш подход к трансформации и глубинным изменениям.'
    },
    {
        number: 9, name_ru: 'Дом мудрости', name_en: 'House of Philosophy',
        area: 'Путешествия, философия, высшее образование',
        keywords: 'Смысл, дальние страны, вера',
        natural_sign: 'Стрелец', natural_planet: 'Юпитер',
        description: 'Девятый дом отвечает за высшее образование, путешествия, философию, религию и расширение горизонтов.',
        planets_in_house_meaning: 'Планеты в девятом доме влияют на ваше мировоззрение, отношение к образованию и путешествиям.',
        sign_on_cusp_meaning: 'Знак на куспиде девятого дома описывает ваш путь к мудрости и расширению сознания.'
    },
    {
        number: 10, name_ru: 'Дом карьеры', name_en: 'House of Career',
        area: 'Карьера, призвание, авторитет',
        keywords: 'Успех, статус, амбиции',
        natural_sign: 'Козерог', natural_planet: 'Сатурн',
        description: 'Десятый дом символизирует карьеру, призвание, общественный статус, достижения и отношения с властью.',
        planets_in_house_meaning: 'Планеты в десятом доме указывают на вашу карьеру, амбиции и общественное признание.',
        sign_on_cusp_meaning: 'Знак на куспиде десятого дома описывает ваш путь к успеху и профессиональную реализацию.'
    },
    {
        number: 11, name_ru: 'Дом друзей', name_en: 'House of Friends',
        area: 'Друзья, единомышленники, надежды',
        keywords: 'Коллективы, идеалы, будущее',
        natural_sign: 'Водолей', natural_planet: 'Уран',
        description: 'Одиннадцатый дом управляет друзьями, единомышленниками, социальными группами, надеждами и желаниями.',
        planets_in_house_meaning: 'Планеты в одиннадцатом доме влияют на ваши социальные связи, друзей и осуществление желаний.',
        sign_on_cusp_meaning: 'Знак на куспиде одиннадцатого дома описывает ваши идеалы и то, каких друзей вы привлекаете.'
    },
    {
        number: 12, name_ru: 'Дом тайн', name_en: 'House of Secrets',
        area: 'Подсознание, тайны, изоляция',
        keywords: 'Карма, уединение, эзотерика',
        natural_sign: 'Рыбы', natural_planet: 'Нептун',
        description: 'Двенадцатый дом отвечает за подсознание, тайны, изоляцию, карму и духовное развитие.',
        planets_in_house_meaning: 'Планеты в двенадцатом доме указывают на скрытые таланты, подсознательные паттерны и кармические задачи.',
        sign_on_cusp_meaning: 'Знак на куспиде двенадцатого дома описывает ваши скрытые ресурсы и путь духовного развития.'
    }
];

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tables = await queryInterface.showAllTables();

        if (!tables.includes('astropsychology_houses')) {
            await queryInterface.createTable('astropsychology_houses', {
                id: {
                    type: Sequelize.INTEGER,
                    autoIncrement: true,
                    primaryKey: true
                },
                number: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    unique: true,
                    comment: 'Номер дома (1-12)'
                },
                name_ru: {
                    type: Sequelize.STRING(100),
                    allowNull: false,
                    comment: 'Название дома на русском'
                },
                name_en: {
                    type: Sequelize.STRING(100),
                    allowNull: true,
                    comment: 'Название дома на английском'
                },
                area: {
                    type: Sequelize.TEXT,
                    allowNull: false,
                    comment: 'Сфера жизни'
                },
                keywords: {
                    type: Sequelize.TEXT,
                    allowNull: true,
                    comment: 'Ключевые слова'
                },
                description: {
                    type: Sequelize.TEXT,
                    allowNull: true,
                    comment: 'Описание дома'
                },
                planets_in_house_meaning: {
                    type: Sequelize.TEXT,
                    allowNull: true,
                    comment: 'Значение планет в доме'
                },
                sign_on_cusp_meaning: {
                    type: Sequelize.TEXT,
                    allowNull: true,
                    comment: 'Значение знака на куспиде'
                },
                natural_sign: {
                    type: Sequelize.STRING(50),
                    allowNull: true,
                    comment: 'Естественный знак дома'
                },
                natural_planet: {
                    type: Sequelize.STRING(50),
                    allowNull: true,
                    comment: 'Естественная планета дома'
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

            await queryInterface.addIndex('astropsychology_houses', ['number'], { unique: true });
            console.log('[Astropsychology Migration] ✅ Таблица astropsychology_houses создана');

            await queryInterface.bulkInsert('astropsychology_houses', HOUSES_DATA);
            console.log('[Astropsychology Migration] ✅ Данные домов загружены');
        } else {
            console.log('[Astropsychology Migration] 📌 Таблица astropsychology_houses уже существует');
        }
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('astropsychology_houses');
        console.log('[Astropsychology Migration] 🗑️ Таблица astropsychology_houses удалена');
    }
};