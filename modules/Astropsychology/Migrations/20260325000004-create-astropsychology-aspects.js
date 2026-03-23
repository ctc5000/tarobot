// modules/Astropsychology/Migrations/20260325000004-create-astropsychology-aspects.js
'use strict';

const ASPECTS_DATA = [
    { code: 'conjunction', name_ru: 'Соединение', name_en: 'Conjunction', symbol: '☌', angle: 0, orb_max: 8, aspect_type: 'major', nature: 'neutral',
        description: 'Соединение — это слияние энергий двух планет. Они действуют как одно целое, усиливая друг друга. Это самый мощный аспект, дающий концентрацию энергии в одной точке.',
        color: '#ff4d4d', sort_order: 1 },
    { code: 'opposition', name_ru: 'Оппозиция', name_en: 'Opposition', symbol: '☍', angle: 180, orb_max: 8, aspect_type: 'major', nature: 'challenging',
        description: 'Оппозиция создает напряжение между двумя противоположными силами. Это аспект баланса — нужно научиться объединять противоположности, находить золотую середину.',
        color: '#4d4dff', sort_order: 2 },
    { code: 'trine', name_ru: 'Трин', name_en: 'Trine', symbol: '△', angle: 120, orb_max: 8, aspect_type: 'major', nature: 'harmonious',
        description: 'Трин — гармоничный аспект, дающий легкое течение энергии, таланты и удачу. Энергия течет свободно, все получается естественно.',
        color: '#4dff4d', sort_order: 3 },
    { code: 'square', name_ru: 'Квадрат', name_en: 'Square', symbol: '□', angle: 90, orb_max: 8, aspect_type: 'major', nature: 'challenging',
        description: 'Квадрат создает напряжение и препятствия, которые заставляют действовать и развиваться. Это аспект вызова и роста через преодоление.',
        color: '#ff4dff', sort_order: 4 },
    { code: 'sextile', name_ru: 'Секстиль', name_en: 'Sextile', symbol: '⚹', angle: 60, orb_max: 6, aspect_type: 'major', nature: 'harmonious',
        description: 'Секстиль дает возможности и таланты, которые нужно осознанно использовать. Это аспект потенциала — дается шанс, но нужно приложить усилие.',
        color: '#ffff4d', sort_order: 5 },
    { code: 'quincunx', name_ru: 'Квиконс', name_en: 'Quincunx', symbol: '⚻', angle: 150, orb_max: 4, aspect_type: 'minor', nature: 'challenging',
        description: 'Квиконс создает напряжение несовместимости. Нужна корректировка и адаптация, чтобы интегрировать разные энергии.',
        color: '#ffaa66', sort_order: 6 },
    { code: 'semisextile', name_ru: 'Полусекстиль', name_en: 'Semisextile', symbol: '⚺', angle: 30, orb_max: 3, aspect_type: 'minor', nature: 'neutral',
        description: 'Полусекстиль дает возможность для развития, но требует осознанного усилия для использования.',
        color: '#66aaff', sort_order: 7 }
];

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tables = await queryInterface.showAllTables();

        if (!tables.includes('astropsychology_aspects')) {
            await queryInterface.createTable('astropsychology_aspects', {
                id: {
                    type: Sequelize.INTEGER,
                    autoIncrement: true,
                    primaryKey: true
                },
                code: {
                    type: Sequelize.STRING(20),
                    allowNull: false,
                    unique: true,
                    comment: 'Код аспекта (conjunction, opposition, etc)'
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
                    allowNull: true,
                    comment: 'Символ аспекта'
                },
                angle: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    comment: 'Угол аспекта в градусах'
                },
                orb_max: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    defaultValue: 8,
                    comment: 'Максимальный орбис'
                },
                aspect_type: {
                    type: Sequelize.STRING(20),
                    allowNull: false,
                    comment: 'Тип: major, minor'
                },
                nature: {
                    type: Sequelize.STRING(20),
                    allowNull: false,
                    comment: 'Природа: harmonious, challenging, neutral'
                },
                description: {
                    type: Sequelize.TEXT,
                    allowNull: true,
                    comment: 'Общее описание аспекта'
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

            await queryInterface.addIndex('astropsychology_aspects', ['code'], { unique: true });
            console.log('[Astropsychology Migration] ✅ Таблица astropsychology_aspects создана');

            await queryInterface.bulkInsert('astropsychology_aspects', ASPECTS_DATA);
            console.log('[Astropsychology Migration] ✅ Данные аспектов загружены');
        } else {
            console.log('[Astropsychology Migration] 📌 Таблица astropsychology_aspects уже существует');
        }
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('astropsychology_aspects');
        console.log('[Astropsychology Migration] 🗑️ Таблица astropsychology_aspects удалена');
    }
};