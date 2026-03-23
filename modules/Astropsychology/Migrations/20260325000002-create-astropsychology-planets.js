// modules/Astropsychology/Migrations/20260325000002-create-astropsychology-planets.js
'use strict';

const PLANETS_DATA = [
    {
        code: 'sun', name_ru: 'Солнце', name_en: 'Sun', symbol: '☉',
        ruling_signs: JSON.stringify(['leo']), exaltation_sign: 'Овен', detriment_sign: 'Водолей',
        meaning: 'Сознание, эго, жизненная сила, творческое начало',
        role: 'Центр личности, то, кем вы становитесь',
        strengths: JSON.stringify(['Сила воли', 'Уверенность', 'Щедрость', 'Лидерство']),
        weaknesses: JSON.stringify(['Эгоцентризм', 'Тщеславие', 'Гордыня', 'Властность']),
        body_part: 'Сердце, позвоночник', color: '#ffaa00', sort_order: 1
    },
    {
        code: 'moon', name_ru: 'Луна', name_en: 'Moon', symbol: '☽',
        ruling_signs: JSON.stringify(['cancer']), exaltation_sign: 'Телец', detriment_sign: 'Скорпион',
        meaning: 'Подсознание, эмоции, инстинкты, привычки',
        role: 'Ваша эмоциональная природа, как вы реагируете',
        strengths: JSON.stringify(['Интуиция', 'Заботливость', 'Адаптивность', 'Чувствительность']),
        weaknesses: JSON.stringify(['Капризность', 'Зависимость', 'Эмоциональная нестабильность']),
        body_part: 'Желудок, грудь, лимфатическая система', color: '#c0c0c0', sort_order: 2
    },
    {
        code: 'mercury', name_ru: 'Меркурий', name_en: 'Mercury', symbol: '☿',
        ruling_signs: JSON.stringify(['gemini', 'virgo']), exaltation_sign: 'Дева', detriment_sign: 'Стрелец',
        meaning: 'Интеллект, коммуникация, мышление, обучение',
        role: 'Как вы думаете, говорите, учитесь',
        strengths: JSON.stringify(['Любознательность', 'Остроумие', 'Логика', 'Дипломатичность']),
        weaknesses: JSON.stringify(['Хитрость', 'Поверхностность', 'Болтливость', 'Нервозность']),
        body_part: 'Нервная система, руки, легкие', color: '#88aa88', sort_order: 3
    },
    {
        code: 'venus', name_ru: 'Венера', name_en: 'Venus', symbol: '♀',
        ruling_signs: JSON.stringify(['taurus', 'libra']), exaltation_sign: 'Рыбы', detriment_sign: 'Овен',
        meaning: 'Любовь, красота, гармония, ценности',
        role: 'Как вы любите, что цените, как привлекаете',
        strengths: JSON.stringify(['Обаяние', 'Художественный вкус', 'Романтичность', 'Гармония']),
        weaknesses: JSON.stringify(['Лень', 'Тщеславие', 'Потакание себе', 'Ревность']),
        body_part: 'Почки, вены, горло', color: '#ff88aa', sort_order: 4
    },
    {
        code: 'mars', name_ru: 'Марс', name_en: 'Mars', symbol: '♂',
        ruling_signs: JSON.stringify(['aries']), exaltation_sign: 'Козерог', detriment_sign: 'Весы',
        meaning: 'Энергия, действие, страсть, агрессия',
        role: 'Как вы действуете, защищаетесь, проявляете волю',
        strengths: JSON.stringify(['Смелость', 'Инициативность', 'Страстность', 'Сила']),
        weaknesses: JSON.stringify(['Агрессия', 'Импульсивность', 'Гнев', 'Безрассудство']),
        body_part: 'Мышцы, голова, надпочечники', color: '#ff6666', sort_order: 5
    },
    {
        code: 'jupiter', name_ru: 'Юпитер', name_en: 'Jupiter', symbol: '♃',
        ruling_signs: JSON.stringify(['sagittarius']), exaltation_sign: 'Рак', detriment_sign: 'Близнецы',
        meaning: 'Удача, расширение, изобилие, мудрость',
        role: 'Ваше счастье, удача, возможности роста',
        strengths: JSON.stringify(['Оптимизм', 'Щедрость', 'Мудрость', 'Справедливость']),
        weaknesses: JSON.stringify(['Расточительность', 'Догматизм', 'Фанатизм', 'Лицемерие']),
        body_part: 'Печень, бедра, гипофиз', color: '#88aaff', sort_order: 6
    },
    {
        code: 'saturn', name_ru: 'Сатурн', name_en: 'Saturn', symbol: '♄',
        ruling_signs: JSON.stringify(['capricorn']), exaltation_sign: 'Весы', detriment_sign: 'Рак',
        meaning: 'Дисциплина, ограничение, ответственность, время',
        role: 'Ваши уроки, границы, кармические задачи',
        strengths: JSON.stringify(['Дисциплина', 'Терпение', 'Ответственность', 'Мудрость']),
        weaknesses: JSON.stringify(['Пессимизм', 'Жесткость', 'Холодность', 'Страхи']),
        body_part: 'Кости, зубы, кожа, колени', color: '#aa88aa', sort_order: 7
    },
    {
        code: 'uranus', name_ru: 'Уран', name_en: 'Uranus', symbol: '♅',
        ruling_signs: JSON.stringify(['aquarius']), exaltation_sign: 'Скорпион', detriment_sign: 'Лев',
        meaning: 'Оригинальность, свобода, революция, интуиция',
        role: 'Где вы ищете свободу, где проявляется гениальность',
        strengths: JSON.stringify(['Изобретательность', 'Независимость', 'Оригинальность']),
        weaknesses: JSON.stringify(['Бунтарство', 'Непредсказуемость', 'Эксцентричность']),
        body_part: 'Голени, нервная система', color: '#88ffaa', sort_order: 8
    },
    {
        code: 'neptune', name_ru: 'Нептун', name_en: 'Neptune', symbol: '♆',
        ruling_signs: JSON.stringify(['pisces']), exaltation_sign: 'Лев', detriment_sign: 'Дева',
        meaning: 'Иллюзия, мечты, духовность, растворение',
        role: 'Ваши идеалы, где вы убегаете от реальности',
        strengths: JSON.stringify(['Воображение', 'Эмпатия', 'Духовность', 'Артистизм']),
        weaknesses: JSON.stringify(['Обман', 'Иллюзии', 'Зависимости', 'Жертвенность']),
        body_part: 'Стопы, эпифиз', color: '#66aaff', sort_order: 9
    },
    {
        code: 'pluto', name_ru: 'Плутон', name_en: 'Pluto', symbol: '♇',
        ruling_signs: JSON.stringify(['scorpio']), exaltation_sign: 'Лев', detriment_sign: 'Телец',
        meaning: 'Трансформация, власть, глубина, возрождение',
        role: 'Где вы проходите через кризисы и возрождаетесь',
        strengths: JSON.stringify(['Глубина', 'Сила', 'Способность к трансформации']),
        weaknesses: JSON.stringify(['Властность', 'Манипуляции', 'Деспотизм']),
        body_part: 'Репродуктивная система', color: '#aa88ff', sort_order: 10
    }
];

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tables = await queryInterface.showAllTables();

        if (!tables.includes('astropsychology_planets')) {
            await queryInterface.createTable('astropsychology_planets', {
                id: {
                    type: Sequelize.INTEGER,
                    autoIncrement: true,
                    primaryKey: true
                },
                code: {
                    type: Sequelize.STRING(20),
                    allowNull: false,
                    unique: true,
                    comment: 'Код планеты (sun, moon, mercury, etc)'
                },
                name_ru: {
                    type: Sequelize.STRING(50),
                    allowNull: false,
                    comment: 'Название на русском'
                },
                name_en: {
                    type: Sequelize.STRING(50),
                    allowNull: true,
                    comment: 'Название на английском'
                },
                symbol: {
                    type: Sequelize.STRING(10),
                    allowNull: false,
                    comment: 'Астрологический символ (☉, ☽, etc)'
                },
                ruling_signs: {
                    type: Sequelize.TEXT,
                    allowNull: true,
                    comment: 'Управляемые знаки (JSON)'
                },
                exaltation_sign: {
                    type: Sequelize.STRING(50),
                    allowNull: true,
                    comment: 'Знак экзальтации'
                },
                detriment_sign: {
                    type: Sequelize.STRING(50),
                    allowNull: true,
                    comment: 'Знак падения'
                },
                meaning: {
                    type: Sequelize.TEXT,
                    allowNull: false,
                    comment: 'Значение планеты'
                },
                role: {
                    type: Sequelize.TEXT,
                    allowNull: true,
                    comment: 'Роль в гороскопе'
                },
                strengths: {
                    type: Sequelize.TEXT,
                    allowNull: true,
                    comment: 'Сильные стороны (JSON)'
                },
                weaknesses: {
                    type: Sequelize.TEXT,
                    allowNull: true,
                    comment: 'Слабые стороны (JSON)'
                },
                body_part: {
                    type: Sequelize.STRING(100),
                    allowNull: true,
                    comment: 'Управляемая часть тела'
                },
                color: {
                    type: Sequelize.STRING(20),
                    allowNull: true,
                    comment: 'Цвет для отображения'
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

            await queryInterface.addIndex('astropsychology_planets', ['code'], { unique: true });
            console.log('[Astropsychology Migration] ✅ Таблица astropsychology_planets создана');

            await queryInterface.bulkInsert('astropsychology_planets', PLANETS_DATA);
            console.log('[Astropsychology Migration] ✅ Данные планет загружены');
        } else {
            console.log('[Astropsychology Migration] 📌 Таблица astropsychology_planets уже существует');
        }
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('astropsychology_planets');
        console.log('[Astropsychology Migration] 🗑️ Таблица astropsychology_planets удалена');
    }
};