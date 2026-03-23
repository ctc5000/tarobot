// modules/Astropsychology/Migrations/20260325000006-create-astropsychology-psychological-traits.js
'use strict';

const TRAITS_DATA = [];

// Сильные стороны по знакам
const strengthsBySign = {
    aries: ['Смелость', 'Инициативность', 'Энергичность', 'Честность', 'Оптимизм'],
    taurus: ['Надежность', 'Терпеливость', 'Практичность', 'Чувственность', 'Верность'],
    gemini: ['Общительность', 'Любознательность', 'Адаптивность', 'Остроумие', 'Гибкость'],
    cancer: ['Заботливость', 'Интуитивность', 'Эмпатия', 'Верность', 'Творческость'],
    leo: ['Щедрость', 'Уверенность', 'Творческость', 'Великодушие', 'Лидерство'],
    virgo: ['Аналитичность', 'Практичность', 'Внимательность', 'Трудолюбие', 'Скромность'],
    libra: ['Дипломатичность', 'Обаяние', 'Справедливость', 'Гармоничность', 'Тактичность'],
    scorpio: ['Страстность', 'Глубина', 'Проницательность', 'Сила воли', 'Преданность'],
    sagittarius: ['Оптимизм', 'Свободолюбие', 'Честность', 'Философский склад ума', 'Энтузиазм'],
    capricorn: ['Ответственность', 'Дисциплина', 'Амбициозность', 'Практичность', 'Терпение'],
    aquarius: ['Оригинальность', 'Независимость', 'Гуманизм', 'Изобретательность', 'Дружелюбие'],
    pisces: ['Эмпатия', 'Творческость', 'Интуитивность', 'Сострадание', 'Духовность']
};

// Зоны роста по знакам
const challengesBySign = {
    aries: ['Импульсивность', 'Эгоцентризм', 'Нетерпеливость', 'Агрессивность'],
    taurus: ['Упрямство', 'Консерватизм', 'Собственничество', 'Лень'],
    gemini: ['Поверхностность', 'Непостоянство', 'Болтливость', 'Двойственность'],
    cancer: ['Обидчивость', 'Мнительность', 'Зависимость', 'Капризность'],
    leo: ['Эгоцентризм', 'Тщеславие', 'Властность', 'Драматичность'],
    virgo: ['Критичность', 'Перфекционизм', 'Мнительность', 'Склонность к тревоге'],
    libra: ['Нерешительность', 'Зависимость от мнения других', 'Поверхностность'],
    scorpio: ['Ревность', 'Мстительность', 'Скрытность', 'Контроль'],
    sagittarius: ['Нетерпеливость', 'Тактичность', 'Безответственность', 'Фанатизм'],
    capricorn: ['Пессимизм', 'Сдержанность', 'Черствость', 'Трудоголизм'],
    aquarius: ['Эксцентричность', 'Отстраненность', 'Непредсказуемость', 'Бунтарство'],
    pisces: ['Эскапизм', 'Иллюзорность', 'Жертвенность', 'Зависимость']
};

// Путь развития по знакам
const growthPaths = {
    aries: 'Развивать терпение и учиться учитывать чувства других. Ваш путь — от импульсивности к мудрому лидерству.',
    taurus: 'Учиться гибкости и отпускать контроль. Ваш путь — от привязанности к материальному к внутренней свободе.',
    gemini: 'Учиться глубине и последовательности. Ваш путь — от поверхностности к мудрости и целостности.',
    cancer: 'Учиться здоровым границам и эмоциональной независимости. Ваш путь — от зависимости к внутренней опоре.',
    leo: 'Учиться смирению и принятию без постоянного признания. Ваш путь — от эгоцентризма к служению.',
    virgo: 'Учиться принимать несовершенство и доверять жизни. Ваш путь — от перфекционизма к принятию.',
    libra: 'Учиться принимать решения и нести ответственность. Ваш путь — от нерешительности к уверенности.',
    scorpio: 'Учиться доверию и отпусканию контроля. Ваш путь — от страха к трансформации через принятие.',
    sagittarius: 'Учиться ответственности и завершению начатого. Ваш путь — от бегства к осознанному действию.',
    capricorn: 'Учиться радости и открытости чувствам. Ваш путь — от контроля к свободе самовыражения.',
    aquarius: 'Учиться близости и эмоциональной открытости. Ваш путь — от отстраненности к сердечной связи.',
    pisces: 'Учиться различать реальность и иллюзию. Ваш путь — от эскапизма к осознанному творчеству.'
};

// Стили общения по знакам
const communicationStyles = {
    aries: 'Прямолинейный, импульсивный. Любите спорить и отстаивать свою точку зрения.',
    taurus: 'Спокойный, обстоятельный. Не любите спешить в разговоре.',
    gemini: 'Живой, быстрый. Легко переключаетесь между темами.',
    cancer: 'Эмоциональный, с оттенками настроения. Говорите то, что чувствуете.',
    leo: 'Яркий, выразительный. Любите быть в центре внимания.',
    virgo: 'Точный, детальный. Склонны к анализу и критике.',
    libra: 'Дипломатичный, тактичный. Избегаете конфликтов.',
    scorpio: 'Глубокий, проницательный. Слова имеют скрытый смысл.',
    sagittarius: 'Открытый, прямолинейный. Любите философствовать.',
    capricorn: 'Сдержанный, деловой. Говорите по делу.',
    aquarius: 'Оригинальный, неожиданный. Мыслите нестандартно.',
    pisces: 'Мягкий, мечтательный. Иногда уходите от темы.'
};

// Стили любви по знакам
const loveStyles = {
    aries: 'Страстный, импульсивный. Быстро влюбляетесь и быстро остываете.',
    taurus: 'Верный, чувственный. Цените стабильность и физический комфорт.',
    gemini: 'Легкий, игривый. Нуждаетесь в умственном стимулировании.',
    cancer: 'Нежный, заботливый. Ищете эмоциональную безопасность.',
    leo: 'Щедрый, романтичный. Любите ухаживания и внимание.',
    virgo: 'Практичный, внимательный. Выражаете любовь через заботу.',
    libra: 'Романтичный, дипломатичный. Стремитесь к гармонии.',
    scorpio: 'Страстный, глубокий. Интенсивные, трансформирующие отношения.',
    sagittarius: 'Свободолюбивый, оптимистичный. Цените независимость.',
    capricorn: 'Серьезный, ответственный. Ищете надежного партнера.',
    aquarius: 'Нестандартный, дружеский. Цените интеллектуальную связь.',
    pisces: 'Идеалистичный, романтичный. Мечтаете о сказочной любви.'
};

// Добавляем сильные стороны
for (const [signCode, strengths] of Object.entries(strengthsBySign)) {
    for (const strength of strengths) {
        TRAITS_DATA.push({
            category: 'strength',
            sign_code: signCode,
            title: 'Сильная сторона',
            description: strength,
            sort_order: 0
        });
    }
}

// Добавляем зоны роста
for (const [signCode, challenges] of Object.entries(challengesBySign)) {
    for (const challenge of challenges) {
        TRAITS_DATA.push({
            category: 'challenge',
            sign_code: signCode,
            title: 'Зона роста',
            description: challenge,
            sort_order: 0
        });
    }
}

// Добавляем пути развития
for (const [signCode, growthPath] of Object.entries(growthPaths)) {
    TRAITS_DATA.push({
        category: 'growth_path',
        sign_code: signCode,
        title: 'Путь развития',
        description: growthPath,
        sort_order: 0
    });
}

// Добавляем стили общения
for (const [signCode, style] of Object.entries(communicationStyles)) {
    TRAITS_DATA.push({
        category: 'communication_style',
        sign_code: signCode,
        title: 'Стиль общения',
        description: style,
        sort_order: 0
    });
}

// Добавляем стили любви
for (const [signCode, style] of Object.entries(loveStyles)) {
    TRAITS_DATA.push({
        category: 'love_style',
        sign_code: signCode,
        title: 'Стиль любви',
        description: style,
        sort_order: 0
    });
}

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tables = await queryInterface.showAllTables();

        if (!tables.includes('astropsychology_psychological_traits')) {
            await queryInterface.createTable('astropsychology_psychological_traits', {
                id: {
                    type: Sequelize.INTEGER,
                    autoIncrement: true,
                    primaryKey: true
                },
                category: {
                    type: Sequelize.STRING(50),
                    allowNull: false,
                    comment: 'Категория: strengths, challenges, growth_path, etc'
                },
                sign_code: {
                    type: Sequelize.STRING(20),
                    allowNull: true,
                    comment: 'Код знака'
                },
                planet_code: {
                    type: Sequelize.STRING(20),
                    allowNull: true,
                    comment: 'Код планеты'
                },
                house_number: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                    comment: 'Номер дома'
                },
                title: {
                    type: Sequelize.STRING(200),
                    allowNull: true,
                    comment: 'Заголовок'
                },
                description: {
                    type: Sequelize.TEXT,
                    allowNull: false,
                    comment: 'Описание характеристики'
                },
                combination_key: {
                    type: Sequelize.STRING(100),
                    allowNull: true,
                    comment: 'Ключ для комбинаций (например: sun+moon)'
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

            await queryInterface.addIndex('astropsychology_psychological_traits', ['category', 'sign_code']);
            await queryInterface.addIndex('astropsychology_psychological_traits', ['category', 'planet_code']);
            await queryInterface.addIndex('astropsychology_psychological_traits', ['combination_key']);

            console.log('[Astropsychology Migration] ✅ Таблица astropsychology_psychological_traits создана');

            await queryInterface.bulkInsert('astropsychology_psychological_traits', TRAITS_DATA);
            console.log('[Astropsychology Migration] ✅ Данные психологических характеристик загружены');
        } else {
            console.log('[Astropsychology Migration] 📌 Таблица astropsychology_psychological_traits уже существует');
        }
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('astropsychology_psychological_traits');
        console.log('[Astropsychology Migration] 🗑️ Таблица astropsychology_psychological_traits удалена');
    }
};