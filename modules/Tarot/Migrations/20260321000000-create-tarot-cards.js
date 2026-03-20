// modules/Tarot/Migrations/20260321000000-create-tarot-cards.js
'use strict';

const cardsData = [
    { number: 0, name: 'Шут', nameEn: 'The Fool', image: '/images/tarot/00-fool.jpg', keywords: 'Новое начало, спонтанность, вера, свобода', meaningUpright: 'Новое начало, спонтанность, вера в лучшее', meaningReversed: 'Безрассудство, глупость, рискованные решения', description: 'Шут — это чистая энергия нового начала, готовность идти в неизвестность с открытым сердцем. Вы на пороге приключения, не зная, что ждет впереди. Ваша сила — в доверии миру, ваша мудрость — в спонтанности.', advice: 'Не бойтесь начинать с чистого листа. Будьте спонтанны, доверяйте потоку. Сейчас лучшее время для нового.', element: 'Воздух', planet: 'Уран' },
    { number: 1, name: 'Маг', nameEn: 'The Magician', image: '/images/tarot/01-magician.jpg', keywords: 'Воля, мастерство, концентрация, ресурсы', meaningUpright: 'Мастерство, сила воли, проявление желаний', meaningReversed: 'Манипуляции, неиспользованный потенциал', description: 'Маг — это вы в моменты, когда вся вселенная служит вашему замыслу. Вы обладаете всеми необходимыми инструментами для реализации желаний. Ваша сила — в концентрации намерения, ваша магия — в действии.', advice: 'Не ждите идеального момента — создавайте его своей волей. Ваши мысли материальны, ваши действия формируют реальность.', element: 'Воздух', planet: 'Меркурий' },
    { number: 2, name: 'Верховная Жрица', nameEn: 'The High Priestess', image: '/images/tarot/02-high-priestess.jpg', keywords: 'Интуиция, тайна, подсознание, мудрость', meaningUpright: 'Интуиция, тайна, внутренний голос', meaningReversed: 'Секреты, подавленная интуиция', description: 'Жрица — это ваша внутренняя тишина, где рождаются все ответы. Вы знаете больше, чем можете объяснить словами. Ваша сила — в интуиции, ваша мудрость — в умении ждать.', advice: 'Доверьтесь своей интуиции. То, что приходит во сне или как внезапное озарение — истинно. Сейчас время слушать, а не говорить.', element: 'Вода', planet: 'Луна' },
    { number: 3, name: 'Императрица', nameEn: 'The Empress', image: '/images/tarot/03-empress.jpg', keywords: 'Плодородие, изобилие, творчество, природа', meaningUpright: 'Плодородие, изобилие, творчество', meaningReversed: 'Творческий блок, зависимость', description: 'Императрица — это ваша способность творить и взращивать. Все, к чему вы прикасаетесь с любовью, расцветает. Ваша сила — в принятии, ваша мудрость — в терпении природы.', advice: 'Сейте семена своих желаний сейчас. Ухаживайте за ними с любовью, и они дадут плоды. Окружите себя красотой и природой.', element: 'Земля', planet: 'Венера' },
    { number: 4, name: 'Император', nameEn: 'The Emperor', image: '/images/tarot/04-emperor.jpg', keywords: 'Власть, структура, порядок, авторитет', meaningUpright: 'Власть, структура, авторитет', meaningReversed: 'Тирания, жесткость, отсутствие контроля', description: 'Император — это ваша способность создавать порядок из хаоса. Вы — творец своей реальности, устанавливающий законы и границы.', advice: 'Наведите порядок в доме и в делах. Структура и дисциплина сейчас — ваши лучшие союзники.', element: 'Огонь', planet: 'Марс' },
    { number: 5, name: 'Иерофант', nameEn: 'The Hierophant', image: '/images/tarot/05-hierophant.jpg', keywords: 'Традиции, обучение, вера, наставничество', meaningUpright: 'Традиции, обучение, наставничество', meaningReversed: 'Бунтарство, отказ от традиций', description: 'Иерофант — это ваша связь с традициями и мудростью предков. Вы — часть цепи знаний, передающихся из поколения в поколение.', advice: 'Ищите мудрость в проверенных источниках. Обратитесь к наставнику или станьте им для кого-то.', element: 'Земля', planet: 'Юпитер' },
    { number: 6, name: 'Влюбленные', nameEn: 'The Lovers', image: '/images/tarot/06-lovers.jpg', keywords: 'Выбор, отношения, любовь, гармония', meaningUpright: 'Любовь, выбор, гармония', meaningReversed: 'Разлад, неправильный выбор', description: 'Влюбленные — это момент истины, когда сердце должно выбрать. Вы стоите на перепутье, и ваш выбор определит судьбу.', advice: 'Прислушайтесь к сердцу в вопросах выбора. Любовь — лучший советчик. Но помните: любой выбор закрывает другие двери.', element: 'Воздух', planet: 'Меркурий' },
    { number: 7, name: 'Колесница', nameEn: 'The Chariot', image: '/images/tarot/07-chariot.jpg', keywords: 'Победа, воля, контроль, преодоление', meaningUpright: 'Победа, воля, контроль', meaningReversed: 'Потеря контроля, агрессия', description: 'Колесница — это ваша способность двигаться к цели, преодолевая препятствия. Вы управляете своей судьбой, даже когда дорога трудна.', advice: 'Двигайтесь к цели, не отвлекаясь. Контролируйте эмоции — они не должны управлять вами. Победа близка.', element: 'Вода', planet: 'Луна' },
    { number: 8, name: 'Сила', nameEn: 'Strength', image: '/images/tarot/08-strength.jpg', keywords: 'Внутренняя сила, мужество, страсть, власть', meaningUpright: 'Внутренняя сила, мужество, страсть', meaningReversed: 'Слабость, неуверенность', description: 'Сила — это не мышцы, а умение укрощать зверя внутри. Вы способны на многое, когда действуете из любви, а не из страха.', advice: 'Действуйте из любви, а не из страха. Ваша мягкость сейчас — ваше главное оружие.', element: 'Огонь', planet: 'Солнце' },
    { number: 9, name: 'Отшельник', nameEn: 'The Hermit', image: '/images/tarot/09-hermit.jpg', keywords: 'Мудрость, уединение, поиск, свет', meaningUpright: 'Мудрость, уединение, поиск', meaningReversed: 'Изоляция, одиночество', description: 'Отшельник — это время уйти внутрь, чтобы найти свет. Вы ищете ответы не вовне, а в глубине себя.', advice: 'Сейчас время уединения и рефлексии. Не бойтесь одиночества — оно принесет ответы. Свет внутри ярче, чем снаружи.', element: 'Земля', planet: 'Сатурн' },
    { number: 10, name: 'Колесо Фортуны', nameEn: 'Wheel of Fortune', image: '/images/tarot/10-wheel.jpg', keywords: 'Судьба, перемены, циклы, удача', meaningUpright: 'Удача, перемены, судьба', meaningReversed: 'Неудача, сопротивление переменам', description: 'Колесо Фортуны — это напоминание о том, что все течет, все меняется. Вы в потоке жизни, и удача улыбается тем, кто плывет по течению.', advice: 'Доверьтесь судьбе. Сейчас все идет так, как должно. Даже неожиданные повороты ведут к лучшему.', element: 'Огонь', planet: 'Юпитер' },
    { number: 11, name: 'Справедливость', nameEn: 'Justice', image: '/images/tarot/11-justice.jpg', keywords: 'Баланс, закон, карма, честность', meaningUpright: 'Справедливость, честность, баланс', meaningReversed: 'Несправедливость, дисбаланс', description: 'Справедливость — это момент истины, когда все тайное становится явным. Вы пожинаете плоды своих поступков.', advice: 'Будьте предельно честны сейчас. Любая несправедливость вернется бумерангом. Примите ответственность за свои решения.', element: 'Воздух', planet: 'Венера' },
    { number: 12, name: 'Повешенный', nameEn: 'The Hanged Man', image: '/images/tarot/12-hanged-man.jpg', keywords: 'Жертва, новый взгляд, пауза, принятие', meaningUpright: 'Жертва, новый взгляд, пауза', meaningReversed: 'Застой, нежелание меняться', description: 'Повешенный — это время остановиться и посмотреть на мир иначе. Вы в подвешенном состоянии, но именно сейчас открывается истина.', advice: 'Не боритесь с течением. Примите паузу. Смените угол зрения — ответ придет оттуда, откуда не ждали.', element: 'Вода', planet: 'Нептун' },
    { number: 13, name: 'Смерть', nameEn: 'Death', image: '/images/tarot/13-death.jpg', keywords: 'Трансформация, конец, новое начало', meaningUpright: 'Трансформация, конец, новое начало', meaningReversed: 'Сопротивление переменам', description: 'Смерть — это не конец, а трансформация. Что-то в вашей жизни должно уйти, чтобы освободить место для нового.', advice: 'Завершайте то, что просит завершения. Не бойтесь перемен — они несут обновление.', element: 'Вода', planet: 'Плутон' },
    { number: 14, name: 'Умеренность', nameEn: 'Temperance', image: '/images/tarot/14-temperance.jpg', keywords: 'Баланс, гармония, терпение, золотая середина', meaningUpright: 'Баланс, гармония, терпение', meaningReversed: 'Дисбаланс, конфликты', description: 'Умеренность — это искусство быть в балансе, не впадать в крайности. Вы учитесь смешивать противоположности, находить середину.', advice: 'Ищите золотую середину во всем. Не перегибайте палку. Время лечит, терпение вознаграждается.', element: 'Огонь', planet: 'Сатурн' },
    { number: 15, name: 'Дьявол', nameEn: 'The Devil', image: '/images/tarot/15-devil.jpg', keywords: 'Искушение, зависимость, материальность, тень', meaningUpright: 'Искушение, зависимость, тень', meaningReversed: 'Освобождение, прозрение', description: 'Дьявол — это встреча со своей тенью, со своими зависимостями и страхами. Вы видите то, что держит вас в плену.', advice: 'Честно посмотрите на свои зависимости — от людей, веществ, мнений, денег. Осознание — первый шаг к свободе.', element: 'Земля', planet: 'Сатурн' },
    { number: 16, name: 'Башня', nameEn: 'The Tower', image: '/images/tarot/16-tower.jpg', keywords: 'Разрушение, прорыв, кризис, освобождение', meaningUpright: 'Разрушение, кризис, прорыв', meaningReversed: 'Избегание перемен', description: 'Башня — это момент крушения старых структур. То, что казалось незыблемым, рушится, освобождая место для нового.', advice: 'Не пытайтесь удержать то, что рушится. Примите кризис как очищение. После бури всегда наступает ясность.', element: 'Огонь', planet: 'Марс' },
    { number: 17, name: 'Звезда', nameEn: 'The Star', image: '/images/tarot/17-star.jpg', keywords: 'Надежда, вдохновение, исцеление, свет', meaningUpright: 'Надежда, вдохновение, исцеление', meaningReversed: 'Отчаяние, потеря веры', description: 'Звезда — это свет в конце туннеля, надежда после кризиса. Вы открыты для вдохновения, верите в лучшее.', advice: 'Верьте в лучшее. Мечтайте, вдохновляйтесь, творите. Сейчас время загадывать желания — они сбудутся.', element: 'Воздух', planet: 'Уран' },
    { number: 18, name: 'Луна', nameEn: 'The Moon', image: '/images/tarot/18-moon.jpg', keywords: 'Иллюзии, подсознание, страхи, интуиция', meaningUpright: 'Иллюзии, подсознание, интуиция', meaningReversed: 'Прояснение, выход из иллюзий', description: 'Луна — это мир снов, интуиции, подсознательных страхов. Вы входите в темный лес своей души.', advice: 'Доверьтесь интуиции, даже если разум противится. Обратите внимание на сны. Страхи — это просто тени, за ними скрыт свет.', element: 'Вода', planet: 'Нептун' },
    { number: 19, name: 'Солнце', nameEn: 'The Sun', image: '/images/tarot/19-sun.jpg', keywords: 'Радость, успех, энергия, ясность', meaningUpright: 'Радость, успех, энергия', meaningReversed: 'Временные трудности', description: 'Солнце — это свет, радость, ясность после тьмы. Вы в периоде расцвета, когда все получается легко и радостно.', advice: 'Радуйтесь жизни, делитесь светом с другими. Сейчас все получается легко. Наслаждайтесь успехом и теплом.', element: 'Огонь', planet: 'Солнце' },
    { number: 20, name: 'Суд', nameEn: 'Judgement', image: '/images/tarot/20-judgement.jpg', keywords: 'Возрождение, призвание, прощение, пробуждение', meaningUpright: 'Возрождение, прощение, призвание', meaningReversed: 'Сожаление, нежелание прощать', description: 'Суд — это момент пробуждения, когда вы слышите зов своей души. Прошлое прощено, вы готовы к новой жизни.', advice: 'Прислушайтесь к зову души. Простите себя и других. Начните новую главу — вы к ней готовы.', element: 'Огонь', planet: 'Плутон' },
    { number: 21, name: 'Мир', nameEn: 'The World', image: '/images/tarot/21-world.jpg', keywords: 'Завершение, целостность, единение, награда', meaningUpright: 'Завершение, целостность, награда', meaningReversed: 'Незавершенность, застой', description: 'Мир — это завершение большого цикла, достижение цели, чувство единства со всем сущим. Вы дошли до точки, где виден весь путь.', advice: 'Наслаждайтесь результатами. Вы завершили важный этап. Чувствуйте свою связь со всем миром.', element: 'Земля', planet: 'Сатурн' }
];

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tables = await queryInterface.showAllTables();

        if (!tables.includes('tarot_cards')) {
            await queryInterface.createTable('tarot_cards', {
                id: {
                    type: Sequelize.INTEGER,
                    autoIncrement: true,
                    primaryKey: true
                },
                number: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    unique: true,
                    comment: 'Номер карты (0-21)'
                },
                name: {
                    type: Sequelize.STRING(100),
                    allowNull: false,
                    comment: 'Название карты'
                },
                name_en: {
                    type: Sequelize.STRING(100),
                    comment: 'Название на английском'
                },
                image: {
                    type: Sequelize.STRING(255),
                    defaultValue: '/images/tarot/back.jpg'
                },
                keywords: {
                    type: Sequelize.TEXT,
                    comment: 'Ключевые слова'
                },
                meaning_upright: {
                    type: Sequelize.TEXT,
                    comment: 'Значение в прямом положении'
                },
                meaning_reversed: {
                    type: Sequelize.TEXT,
                    comment: 'Значение в перевернутом положении'
                },
                description: {
                    type: Sequelize.TEXT,
                    comment: 'Подробное описание карты'
                },
                advice: {
                    type: Sequelize.TEXT,
                    comment: 'Совет карты'
                },
                element: {
                    type: Sequelize.STRING(50),
                    comment: 'Стихия'
                },
                planet: {
                    type: Sequelize.STRING(50),
                    comment: 'Планета'
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

            await queryInterface.addIndex('tarot_cards', ['number'], {
                name: 'tarot_cards_number_idx'
            });

            console.log('[Tarot Migration] ✅ Таблица tarot_cards создана');

            // Заполняем таблицу данными
            const now = new Date();
            const cardsToInsert = cardsData.map(card => ({
                number: card.number,
                name: card.name,
                name_en: card.nameEn,
                image: card.image,
                keywords: card.keywords,
                meaning_upright: card.meaningUpright,
                meaning_reversed: card.meaningReversed,
                description: card.description,
                advice: card.advice,
                element: card.element,
                planet: card.planet,
                created_at: now,
                updated_at: now
            }));

            await queryInterface.bulkInsert('tarot_cards', cardsToInsert);
            console.log('[Tarot Migration] ✅ 22 карты Таро добавлены в базу данных');

        } else {
            console.log('[Tarot Migration] 📌 Таблица tarot_cards уже существует');

            // Проверяем, есть ли данные в таблице
            const existingCards = await queryInterface.sequelize.query(
                'SELECT COUNT(*) as count FROM tarot_cards',
                { type: Sequelize.QueryTypes.SELECT }
            );

            if (existingCards[0].count === 0) {
                console.log('[Tarot Migration] 📌 Таблица пуста, заполняем данными...');
                const now = new Date();
                const cardsToInsert = cardsData.map(card => ({
                    number: card.number,
                    name: card.name,
                    name_en: card.nameEn,
                    image: card.image,
                    keywords: card.keywords,
                    meaning_upright: card.meaningUpright,
                    meaning_reversed: card.meaningReversed,
                    description: card.description,
                    advice: card.advice,
                    element: card.element,
                    planet: card.planet,
                    created_at: now,
                    updated_at: now
                }));
                await queryInterface.bulkInsert('tarot_cards', cardsToInsert);
                console.log('[Tarot Migration] ✅ 22 карты Таро добавлены в базу данных');
            }
        }
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('tarot_cards');
        console.log('[Tarot Migration] 🗑️ Таблица tarot_cards удалена');
    }
};