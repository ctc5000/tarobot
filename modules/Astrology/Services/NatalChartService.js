// modules/astrology/Services/NatalChartService.js
const Astronomy = require('astronomy-engine');

class NatalChartService {
    constructor() {
        // Описания планет (значение в карте)
        this.planetMeanings = {
            sun:   'Ваше внутреннее «Я», самоуважение и уверенность в себе, способность идти своим уникальным путём.',
            moon:  'Ощущение внешнего мира и реакция на него, формирование мироощущения, потребность в комфорте и безопасности.',
            mercury: 'Обработка информации, анализ, речь, посредничество, обучение, то, как мы думаем и общаемся.',
            venus: 'Оценка и выбор, способность любить, проявление симпатии, чувство прекрасного, гармония и ценности.',
            mars:  'Решительность, действие, инициатива, страсть, способность преодолевать препятствия.',
            jupiter: 'Постановка целей, экспансия, удача, оптимизм, тяга к признанию и расширению горизонтов.',
            saturn: 'Дисциплина, ограничение, ответственность, достижение результатов, создание структуры и правил.',
            uranus: 'Свобода, независимость, оригинальность, революционность, нестандартное мышление.',
            neptune: 'Интуиция, иллюзии, мечты, духовность, размывание границ, связь с высшим.',
            pluto:  'Трансформация, власть, разрушение старого, возрождение, глубинная энергия.'
        };

        // Описания знаков зодиака (как проявляется энергия)
        this.signDescriptions = {
            'Овен':       'Энергия прорыва и инициативы. Действует напористо, спонтанно, соревновательно. Стремится быть первым.',
            'Телец':      'Энергия накопления и устойчивости. Действует неторопливо, продуктивно, ценит комфорт и результат.',
            'Близнецы':   'Энергия коммуникации и обмена. Действует контактно, любопыдно, легко переключается между задачами.',
            'Рак':        'Энергия защиты и заботы. Действует эмоционально, чутко, через создание безопасности и уюта.',
            'Лев':        'Энергия творчества и самовыражения. Действует щедро, публично, авторитетно, ищет признания.',
            'Дева':       'Энергия анализа и порядка. Действует практично, скромно, уделяя внимание деталям и служению.',
            'Весы':       'Энергия гармонии и партнерства. Действует дипломатично, взвешенно, стремясь к балансу и красоте.',
            'Скорпион':   'Энергия трансформации и глубины. Действует страстно, интенсивно, проникая в самую суть.',
            'Стрелец':    'Энергия расширения и поиска смысла. Действует оптимистично, независимо, устремляясь к новым горизонтам.',
            'Козерог':    'Энергия цели и структуры. Действует ответственно, дисциплинированно, целенаправленно, достигая вершин.',
            'Водолей':    'Энергия свободы и будущего. Действует оригинально, демократично, генерируя новые идеи.',
            'Рыбы':       'Энергия сострадания и единения. Действует интуитивно, загадочно, стирая границы между собой и миром.'
        };

        // Описания домов (сферы жизни)
        this.houseMeanings = {
            1:  'Личность, внешность, самовыражение, начало. Как вы проявляете себя в мире.',
            2:  'Финансы, материальные ценности, самооценка, таланты, ресурсы.',
            3:  'Общение, обучение, братья/сестры, короткие поездки, информация, контакты.',
            4:  'Дом, семья, корни, прошлое, внутренняя безопасность, род.',
            5:  'Творчество, любовь, дети, хобби, удовольствия, самовыражение, романтика.',
            6:  'Работа по найму, здоровье, служение, повседневные обязанности, дисциплина.',
            7:  'Партнерство, брак, открытые враги, отношения один на один, сотрудничество.',
            8:  'Трансформация, кризисы, чужие деньги, секс, возрождение, тайны.',
            9:  'Путешествия, философия, высшее образование, смысл жизни, дальние страны.',
            10: 'Карьера, социальный статус, призвание, авторитет, достижения.',
            11: 'Друзья, единомышленники, надежды, коллективы, будущее, идеи.',
            12: 'Подсознание, тайны, уединение, эзотерика, карма, внутренний мир.'
        };
    }

    /**
     * Получение названия знака по долготе
     */
    getSignFromLongitude(longitude) {
        if (longitude === undefined || longitude === null) return 'Неизвестно';
        const signs = ['Овен', 'Телец', 'Близнецы', 'Рак', 'Лев', 'Дева', 'Весы', 'Скорпион', 'Стрелец', 'Козерог', 'Водолей', 'Рыбы'];
        const index = Math.floor(longitude / 30) % 12;
        return signs[index];
    }

    /**
     * Получение элемента по знаку
     */
    getElement(sign) {
        const elements = {
            'Овен': 'Огонь', 'Лев': 'Огонь', 'Стрелец': 'Огонь',
            'Телец': 'Земля', 'Дева': 'Земля', 'Козерог': 'Земля',
            'Близнецы': 'Воздух', 'Весы': 'Воздух', 'Водолей': 'Воздух',
            'Рак': 'Вода', 'Скорпион': 'Вода', 'Рыбы': 'Вода'
        };
        return elements[sign] || '—';
    }

    /**
     * Расчет позиций планет
     */
    getPlanetPositions(time) {
        const positions = {};

        try {
            const observer = new Astronomy.Observer(0, 0, 0);

            const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
            const planetKeys = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];

            for (let i = 0; i < planets.length; i++) {
                try {
                    const body = Astronomy.Body[planets[i]];
                    const equ = Astronomy.Equator(body, time, observer, true, true);
                    if (equ && equ.ra !== undefined) {
                        positions[planetKeys[i]] = {
                            longitude: this.radiansToDegrees(equ.ra),
                            latitude: this.radiansToDegrees(equ.dec)
                        };
                    }
                } catch (e) {
                    console.warn(`Ошибка ${planets[i]}:`, e.message);
                }
            }
        } catch (error) {
            console.error('Ошибка при расчете планет:', error);
        }

        return positions;
    }

    /**
     * Расчет асцендента
     */
    calculateAscendant(time, lat, lon) {
        try {
            const siderealTime = Astronomy.SiderealTime(time);
            let ascendant = (siderealTime * 15 + lon) % 360;
            ascendant += (lat / 90) * 15;
            return (ascendant + 360) % 360;
        } catch (e) {
            console.warn('Ошибка расчета асцендента:', e.message);
            const hour = time.date.getUTCHours();
            const minute = time.date.getUTCMinutes();
            const dayOfYear = this.getDayOfYear(time.date);
            return (dayOfYear / 365 * 360 + hour * 15 + minute * 0.25) % 360;
        }
    }

    /**
     * Расчет домов
     */
    calculateHouses(ascendant) {
        const houses = [];
        for (let i = 0; i < 12; i++) {
            houses.push({
                number: i + 1,
                cusp: (ascendant + i * 30) % 360
            });
        }
        return houses;
    }

    /**
     * Радианы в градусы
     */
    radiansToDegrees(radians) {
        if (Math.abs(radians) > 2 * Math.PI) {
            return radians % 360;
        }
        return (radians * 180 / Math.PI + 360) % 360;
    }

    /**
     * День года
     */
    getDayOfYear(date) {
        const start = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
        const diff = date - start;
        const oneDay = 1000 * 60 * 60 * 24;
        return Math.floor(diff / oneDay);
    }

    /**
     * Обогащение данных планет
     */
    enrichPlanetsData(planets) {
        if (!planets || typeof planets !== 'object') return {};

        const planetNameMap = {
            sun: 'Солнце', moon: 'Луна', mercury: 'Меркурий', venus: 'Венера',
            mars: 'Марс', jupiter: 'Юпитер', saturn: 'Сатурн',
            uranus: 'Уран', neptune: 'Нептун', pluto: 'Плутон'
        };

        const enriched = {};

        Object.entries(planets).forEach(([key, data]) => {
            if (!data || data.longitude === undefined) return;

            const sign = this.getSignFromLongitude(data.longitude);
            const degreeInSign = (data.longitude % 30).toFixed(1);

            enriched[key] = {
                ...data,
                name: planetNameMap[key] || key,
                sign: sign,
                degreeInSign: degreeInSign,
                element: this.getElement(sign),
                signDescription: this.signDescriptions[sign] || 'Описание знака отсутствует.',
                planetMeaning: this.planetMeanings[key] || 'Значение планеты отсутствует.'
            };
        });

        return enriched;
    }

    /**
     * Обогащение данных домов
     */
    enrichHousesData(houses, planets) {
        if (!houses || !Array.isArray(houses)) return [];

        const enrichedHouses = [];

        houses.forEach(house => {
            if (!house || house.cusp === undefined) return;

            const sign = this.getSignFromLongitude(house.cusp);
            const planetsInHouse = [];

            if (planets && typeof planets === 'object') {
                Object.values(planets).forEach(p => {
                    if (p && p.longitude !== undefined && Math.floor(p.longitude / 30) + 1 === house.number) {
                        planetsInHouse.push(p.name || 'Планета');
                    }
                });
            }

            enrichedHouses.push({
                number: house.number,
                cusp: house.cusp,
                sign: sign,
                element: this.getElement(sign),
                signDescription: this.signDescriptions[sign] || 'Описание знака отсутствует.',
                houseDescription: this.houseMeanings[house.number] || 'Описание дома отсутствует.',
                planets: planetsInHouse
            });
        });

        return enrichedHouses;
    }

    /**
     * Расчет аспектов
     */
    calculateAspects(planets) {
        if (!planets || typeof planets !== 'object') return [];

        const aspects = [];
        const planetList = Object.values(planets).filter(p => p && p.longitude !== undefined);

        const aspectConfigs = [
            { type: 'conjunction', angle: 0, orb: 10, name: 'Соединение' },
            { type: 'opposition', angle: 180, orb: 8, name: 'Оппозиция' },
            { type: 'trine', angle: 120, orb: 8, name: 'Трин' },
            { type: 'square', angle: 90, orb: 8, name: 'Квадратура' },
            { type: 'sextile', angle: 60, orb: 6, name: 'Секстиль' }
        ];

        for (let i = 0; i < planetList.length; i++) {
            for (let j = i + 1; j < planetList.length; j++) {
                const p1 = planetList[i];
                const p2 = planetList[j];

                const diff = Math.abs(p1.longitude - p2.longitude);
                const orb = Math.min(diff, 360 - diff);

                for (let config of aspectConfigs) {
                    if (Math.abs(orb - config.angle) < config.orb) {
                        aspects.push({
                            planet1: p1.name,
                            planet2: p2.name,
                            type: config.type,
                            name: config.name,
                            orb: orb.toFixed(1),
                            description: this.getAspectDescription(p1.name, p2.name, config.type)
                        });
                        break;
                    }
                }
            }
        }

        return aspects;
    }

    /**
     * Получение описания аспекта
     */
    getAspectDescription(planet1, planet2, type) {
        const descriptions = {
            conjunction: `${planet1} и ${planet2} в соединении — энергии планет сливаются, создавая мощный фокус в вашей личности. Это ваша ключевая точка силы.`,
            opposition: `${planet1} в оппозиции к ${planet2} — напряжение и противостояние двух начал. Важно найти баланс и компромисс.`,
            trine: `${planet1} в трине с ${planet2} — гармоничный, легкий поток энергии. Природный талант, дающийся без усилий.`,
            square: `${planet1} в квадрате с ${planet2} — конфликт и вызов, движущая сила развития. Преодолевая препятствия, вы растете.`,
            sextile: `${planet1} в секстиле с ${planet2} — возможность и потенциал. Талант, который нужно развивать осознанно.`
        };
        return descriptions[type] || `${planet1} и ${planet2} в аспекте ${type}`;
    }

    /**
     * Получение описания асцендента
     */
    getAscendantDescription(ascendant) {
        if (ascendant === undefined || ascendant === null) {
            return {
                degree: 0,
                sign: 'Неизвестно',
                description: 'Асцендент не удалось рассчитать.',
                degreeInSign: '0'
            };
        }

        const sign = this.getSignFromLongitude(ascendant);
        return {
            degree: ascendant,
            sign: sign,
            element: this.getElement(sign),
            description: this.signDescriptions[sign] || 'Описание знака отсутствует.',
            degreeInSign: (ascendant % 30).toFixed(1)
        };
    }

    /**
     * Форматирование данных для отрисовки
     */
    formatForDraw(planets, houses) {
        const points = [];
        const cusps = [];

        const symbols = {
            sun: '☉', moon: '☽', mercury: '☿', venus: '♀',
            mars: '♂', jupiter: '♃', saturn: '♄',
            uranus: '♅', neptune: '♆', pluto: '♇'
        };

        Object.entries(planets).forEach(([name, data]) => {
            if (data && data.longitude !== undefined) {
                points.push({
                    name: symbols[name] || name.substring(0, 2).toUpperCase(),
                    angle: data.longitude || 0
                });
            }
        });

        houses.forEach(house => {
            if (house && house.cusp !== undefined) {
                cusps.push({ angle: house.cusp });
            }
        });

        return { points, cusps };
    }

    /**
     * Полный расчет натальной карты
     */
    async calculate(data) {
        try {
            const { fullName, birthDate, birthTime, latitude, longitude, houseSystem, userId } = data;

            const [day, month, year] = birthDate.split('.').map(Number);
            const [hour, minute] = birthTime.split(':').map(Number);

            // Валидация
            if (isNaN(day) || isNaN(month) || isNaN(year) || isNaN(hour) || isNaN(minute)) {
                throw new Error('Неверный формат даты или времени');
            }

            // Создаем дату в UTC
            const date = new Date(Date.UTC(year, month - 1, day, hour, minute));
            const time = new Astronomy.AstroTime(date);

            // Получаем позиции планет
            const planets = this.getPlanetPositions(time);

            // Рассчитываем асцендент и дома
            const ascendant = this.calculateAscendant(time, latitude || 55.7558, longitude || 37.6173);
            const houses = this.calculateHouses(ascendant);

            // Обогащаем данные
            const enrichedPlanets = this.enrichPlanetsData(planets);
            const enrichedHouses = this.enrichHousesData(houses, enrichedPlanets);
            const aspects = this.calculateAspects(enrichedPlanets);
            const ascendantDesc = this.getAscendantDescription(ascendant);

            // Данные для отрисовки
            const chartData = this.formatForDraw(enrichedPlanets, houses);

            // Генерация интерпретации
            const interpretation = this.generateInterpretation(
                ascendantDesc,
                enrichedPlanets.sun,
                enrichedPlanets.moon,
                enrichedPlanets,
                aspects
            );

            return {
                success: true,
                data: {
                    fullName,
                    birthDate,
                    birthTime,
                    latitude,
                    longitude,
                    houseSystem,
                    ascendant: ascendantDesc,
                    planets: enrichedPlanets,
                    houses: enrichedHouses,
                    aspects: aspects,
                    chartData: chartData,
                    interpretation: interpretation
                }
            };

        } catch (error) {
            console.error('Ошибка в сервисе:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Генерация интерпретации
     */
    generateInterpretation(ascendant, sun, moon, planets, aspects) {
        const ascSign = ascendant.sign;
        const sunSign = sun?.sign || 'Неизвестно';
        const moonSign = moon?.sign || 'Неизвестно';
        const ascElement = ascendant.element;
        const sunElement = sun?.element || '—';
        const moonElement = moon?.element || '—';

        // Базовый портрет
        let portrait = `
🌟 **ВАШ АСТРОЛОГИЧЕСКИЙ ПОРТРЕТ**

**Асцендент (${ascSign}, ${ascElement})**
${ascendant.description}

**Солнце (${sunSign}, ${sunElement})**
${sun?.signDescription || 'Описание отсутствует'}

**Луна (${moonSign}, ${moonElement})**
${moon?.signDescription || 'Описание отсутствует'}
`;

        // Анализ стихий
        if (ascElement === sunElement && sunElement === moonElement) {
            portrait += `
✨ **Стихийный портрет**
В вашей карте трижды усилена стихия ${ascElement}. Это дает мощную концентрацию энергии и целостность натуры.`;
        } else {
            portrait += `
✨ **Стихийный портрет**
В вашей карте сочетаются разные стихии: внешность ${ascElement}, сущность ${sunElement}, эмоции ${moonElement}. Это делает вас многогранной личностью.`;
        }

        // Ключевые аспекты
        if (aspects && aspects.length > 0) {
            portrait += `\n\n⚡ **КЛЮЧЕВЫЕ АСПЕКТЫ**\n`;
            const topAspects = aspects.slice(0, 5);
            topAspects.forEach(aspect => {
                portrait += `• ${aspect.planet1} — ${aspect.planet2}: ${aspect.description}\n`;
            });
        }

        return portrait;
    }

    // ========== МЕТОДЫ ДЛЯ РАБОТЫ С ИСТОРИЕЙ ==========

    async saveCalculation(userId, calculationType, resultData, price = 0, targetDate = null, serviceId = null) {
        try {
            const { models } = require('../../../sequelize');

            if (!serviceId) {
                const service = await models.Service.findOne({
                    where: { code: calculationType }
                });

                if (service) {
                    serviceId = service.id;
                } else {
                    const anyService = await models.Service.findOne();
                    if (anyService) {
                        serviceId = anyService.id;
                    } else {
                        throw new Error('В базе данных нет ни одного сервиса');
                    }
                }
            }

            const calculation = await models.Calculation.create({
                userId,
                serviceId,
                calculationType: calculationType,
                result: resultData || {},
                price,
                targetDate: targetDate || null,
                status: 'completed',
                createdAt: new Date(),
                updatedAt: new Date()
            });

            return calculation;

        } catch (error) {
            console.error('❌ Ошибка сохранения расчета:', error);
            throw error;
        }
    }

    async getUserCalculations(userId, limit = 10, offset = 0) {
        const { models } = require('../../../sequelize');

        try {
            const calculations = await models.Calculation.findAndCountAll({
                where: {
                    userId,
                    calculationType: 'natal_chart'
                },
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [['createdAt', 'DESC']],
                include: [{
                    model: models.Service,
                    as: 'service',
                    attributes: ['id', 'name', 'code', 'price']
                }]
            });

            return {
                total: calculations.count,
                calculations: calculations.rows,
                limit: parseInt(limit),
                offset: parseInt(offset)
            };

        } catch (error) {
            console.error('Ошибка получения истории:', error);
            throw error;
        }
    }

    async getCalculationById(id, userId) {
        const { models } = require('../../../sequelize');

        try {
            const calculation = await models.Calculation.findOne({
                where: { id, userId },
                include: [{
                    model: models.Service,
                    as: 'service',
                    attributes: ['id', 'name', 'code', 'price']
                }]
            });

            return calculation;

        } catch (error) {
            console.error('Ошибка получения расчета:', error);
            throw error;
        }
    }
}

module.exports = NatalChartService;