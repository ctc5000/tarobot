// modules/Astropsychology/Services/AstropsychologyService.js
const NatalChartSimpleService = require('../../../services/NatalChartSimpleService');

class AstropsychologyService {
    constructor() {
        this.natalChartService = new NatalChartSimpleService();

        this.planets = {
            sun: {
                name: 'Солнце',
                symbol: '☉',
                meaning: 'Сознание, эго, жизненная сила, творческое начало',
                role: 'Центр личности, то, кем вы становитесь',
                strengths: 'Сила воли, уверенность, щедрость, лидерство',
                weaknesses: 'Эгоцентризм, тщеславие, гордыня, властность',
                bodyPart: 'Сердце, позвоночник'
            },
            moon: {
                name: 'Луна',
                symbol: '☽',
                meaning: 'Подсознание, эмоции, инстинкты, привычки',
                role: 'Ваша эмоциональная природа, как вы реагируете',
                strengths: 'Интуиция, заботливость, адаптивность, чувствительность',
                weaknesses: 'Капризность, зависимость, эмоциональная нестабильность',
                bodyPart: 'Желудок, грудь, лимфатическая система'
            },
            mercury: {
                name: 'Меркурий',
                symbol: '☿',
                meaning: 'Интеллект, коммуникация, мышление, обучение',
                role: 'Как вы думаете, говорите, учитесь',
                strengths: 'Любознательность, остроумие, логика, дипломатичность',
                weaknesses: 'Хитрость, поверхностность, болтливость, нервозность',
                bodyPart: 'Нервная система, руки, легкие'
            },
            venus: {
                name: 'Венера',
                symbol: '♀',
                meaning: 'Любовь, красота, гармония, ценности',
                role: 'Как вы любите, что цените, как привлекаете',
                strengths: 'Обаяние, художественный вкус, романтичность, гармония',
                weaknesses: 'Лень, тщеславие, потакание себе, ревность',
                bodyPart: 'Почки, вены, горло'
            },
            mars: {
                name: 'Марс',
                symbol: '♂',
                meaning: 'Энергия, действие, страсть, агрессия',
                role: 'Как вы действуете, защищаетесь, проявляете волю',
                strengths: 'Смелость, инициативность, страстность, сила',
                weaknesses: 'Агрессия, импульсивность, гнев, безрассудство',
                bodyPart: 'Мышцы, голова, надпочечники'
            },
            jupiter: {
                name: 'Юпитер',
                symbol: '♃',
                meaning: 'Удача, расширение, изобилие, мудрость',
                role: 'Ваше счастье, удача, возможности роста',
                strengths: 'Оптимизм, щедрость, мудрость, справедливость',
                weaknesses: 'Расточительность, догматизм, фанатизм, лицемерие',
                bodyPart: 'Печень, бедра, гипофиз'
            },
            saturn: {
                name: 'Сатурн',
                symbol: '♄',
                meaning: 'Дисциплина, ограничение, ответственность, время',
                role: 'Ваши уроки, границы, кармические задачи',
                strengths: 'Дисциплина, терпение, ответственность, мудрость',
                weaknesses: 'Пессимизм, жесткость, холодность, страхи',
                bodyPart: 'Кости, зубы, кожа, колени'
            },
            uranus: {
                name: 'Уран',
                symbol: '♅',
                meaning: 'Оригинальность, свобода, революция, интуиция',
                role: 'Где вы ищете свободу, где проявляется гениальность',
                strengths: 'Изобретательность, независимость, оригинальность',
                weaknesses: 'Бунтарство, непредсказуемость, эксцентричность',
                bodyPart: 'Голени, нервная система'
            },
            neptune: {
                name: 'Нептун',
                symbol: '♆',
                meaning: 'Иллюзия, мечты, духовность, растворение',
                role: 'Ваши идеалы, где вы убегаете от реальности',
                strengths: 'Воображение, эмпатия, духовность, артистизм',
                weaknesses: 'Обман, иллюзии, зависимости, жертвенность',
                bodyPart: 'Стопы, эпифиз'
            },
            pluto: {
                name: 'Плутон',
                symbol: '♇',
                meaning: 'Трансформация, власть, глубина, возрождение',
                role: 'Где вы проходите через кризисы и возрождаетесь',
                strengths: 'Глубина, сила, способность к трансформации',
                weaknesses: 'Властность, манипуляции, деспотизм',
                bodyPart: 'Репродуктивная система'
            }
        };

        this.houses = [
            { number: 1, name: 'Дом личности', area: 'Внешность, характер, начало', keywords: 'Я, маска, поведение' },
            { number: 2, name: 'Дом финансов', area: 'Деньги, ресурсы, самооценка', keywords: 'Ценности, доход, таланты' },
            { number: 3, name: 'Дом коммуникации', area: 'Общение, обучение, братья/сестры', keywords: 'Речь, информация, контакты' },
            { number: 4, name: 'Дом семьи', area: 'Дом, семья, корни, прошлое', keywords: 'Род, недвижимость, безопасность' },
            { number: 5, name: 'Дом творчества', area: 'Любовь, дети, хобби, творчество', keywords: 'Самовыражение, удовольствия, романтика' },
            { number: 6, name: 'Дом здоровья', area: 'Работа, здоровье, служение', keywords: 'Долг, забота, рутина' },
            { number: 7, name: 'Дом партнерства', area: 'Брак, партнеры, отношения', keywords: 'Союз, контракты, открытые враги' },
            { number: 8, name: 'Дом трансформации', area: 'Кризисы, секс, чужие деньги', keywords: 'Смерть, возрождение, наследство' },
            { number: 9, name: 'Дом мудрости', area: 'Путешествия, философия, высшее образование', keywords: 'Смысл, дальние страны, вера' },
            { number: 10, name: 'Дом карьеры', area: 'Карьера, призвание, авторитет', keywords: 'Успех, статус, амбиции' },
            { number: 11, name: 'Дом друзей', area: 'Друзья, единомышленники, надежды', keywords: 'Коллективы, идеалы, будущее' },
            { number: 12, name: 'Дом тайн', area: 'Подсознание, тайны, изоляция', keywords: 'Карма, уединение, эзотерика' }
        ];
    }

    calculate(data) {
        try {
            const { fullName, birthDate, birthTime, birthPlace, question, latitude, longitude, type = 'astro_standard' } = data;

            console.log('Астропсихология расчет для:', { fullName, birthDate, birthTime, type });

            const natalResult = this.natalChartService.calculate({
                fullName,
                birthDate,
                birthTime,
                latitude: latitude || 55.7558,
                longitude: longitude || 37.6173,
                houseSystem: 'placidus'
            });

            if (!natalResult.success) {
                throw new Error(natalResult.error || 'Ошибка расчета натальной карты');
            }

            const chartData = natalResult.data;
            const ascendantData = chartData.ascendant || {};
            const planetsData = chartData.planets || {};
            const housesData = chartData.houses || [];
            const aspectsData = chartData.aspects || [];

            const sunSign = planetsData.sun?.sign || this.getSignFromLongitude(planetsData.sun?.longitude);
            const moonSign = planetsData.moon?.sign || this.getSignFromLongitude(planetsData.moon?.longitude);
            const ascendantSign = ascendantData.sign || this.getSignFromLongitude(ascendantData.degree || 0);

            // Данные для отрисовки натальной карты (только для полных версий)
            const chartDrawData = (type === 'astro_full' || type === 'astro_premium') ? {
                points: this.formatForDraw(planetsData),
                cusps: this.formatHousesForDraw(housesData)
            } : null;

            // Формируем результат в зависимости от типа расчета
            const result = this.buildResultByType(
                type,
                fullName,
                birthDate,
                birthTime,
                birthPlace,
                ascendantData,
                ascendantSign,
                planetsData,
                sunSign,
                moonSign,
                housesData,
                aspectsData,
                question,
                chartDrawData
            );

            return {
                success: true,
                data: result
            };
        } catch (error) {
            console.error('Ошибка в AstropsychologyService:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    buildResultByType(type, fullName, birthDate, birthTime, birthPlace, ascendantData, ascendantSign, planetsData, sunSign, moonSign, housesData, aspectsData, question, chartDrawData) {
        const baseResult = {
            fullName,
            birthData: {
                date: birthDate,
                time: birthTime || '12:00',
                place: birthPlace || 'не указано'
            },
            calculationType: type,
            ascendant: {
                sign: ascendantSign,
                degree: ascendantData.degreeInSign || (ascendantData.degree % 30).toFixed(1),
                description: this.getAscendantDescription(ascendantSign)
            },
            sun: {
                sign: sunSign,
                degree: planetsData.sun?.degreeInSign || (planetsData.sun?.longitude % 30).toFixed(1),
                planet: this.planets.sun,
                description: this.getSunDescription(sunSign)
            },
            moon: {
                sign: moonSign,
                degree: planetsData.moon?.degreeInSign || (planetsData.moon?.longitude % 30).toFixed(1),
                planet: this.planets.moon,
                description: this.getMoonDescription(moonSign)
            }
        };

        switch (type) {
            case 'astro_basic':
                return {
                    ...baseResult,
                    planets: this.formatPlanetsByType(planetsData, ['sun', 'moon']),
                    psychology: this.getBasicPsychology(planetsData, ascendantSign),
                    interpretation: this.generateBasicInterpretation(baseResult)  // Только базовый, без вложенности
                };

            case 'astro_quick':
                return {
                    ...baseResult,
                    planets: this.formatPlanetsByType(planetsData, ['sun', 'moon', 'mercury', 'venus', 'mars']),
                    psychology: this.getQuickPsychology(planetsData, ascendantSign),
                    forecast: this.getQuickForecast(planetsData),
                    interpretation: this.generateQuickInterpretation(baseResult, planetsData)  // Только экспресс
                };

            case 'astro_standard':
                return {
                    ...baseResult,
                    planets: this.formatPlanetsByType(planetsData, ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn']),
                    psychology: this.getStandardPsychology(planetsData, ascendantSign),
                    houses: this.formatHousesByType(housesData, ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']),
                    forecast: this.getStandardForecast(planetsData),
                    interpretation: this.generateStandardInterpretation(baseResult, planetsData, housesData)  // Только стандартный
                };

            case 'astro_full':
                return {
                    ...baseResult,
                    planets: this.formatAllPlanets(planetsData),
                    psychology: this.getFullPsychology(planetsData, ascendantSign),
                    houses: this.formatAllHouses(housesData, planetsData),
                    aspects: this.formatAspects(aspectsData),
                    chartDrawData,
                    forecast: this.getFullForecast(planetsData, aspectsData),
                    relationship: question ? this.analyzeRelationship(planetsData, question) : null,
                    interpretation: this.generateFullInterpretation(baseResult, planetsData, housesData, aspectsData, question)  // Только полный
                };

            case 'astro_premium':
                return {
                    ...baseResult,
                    planets: this.formatAllPlanets(planetsData),
                    psychology: this.getPremiumPsychology(planetsData, ascendantSign),
                    houses: this.formatAllHouses(housesData, planetsData),
                    aspects: this.formatAspects(aspectsData),
                    chartDrawData,
                    forecast: this.getPremiumForecast(planetsData, aspectsData),
                    relationship: question ? this.analyzeRelationship(planetsData, question) : null,
                    karma: this.getKarmaAnalysis(planetsData),
                    transits: this.getDetailedTransitForecast(planetsData),
                    recommendations: this.getPersonalRecommendations(planetsData, ascendantSign),
                    interpretation: this.generatePremiumInterpretation(baseResult, planetsData, housesData, aspectsData, question)  // Только премиум
                };

            default:
                return baseResult;
        }
    }

    formatPlanetsByType(planetsData, keys) {
        const result = [];
        keys.forEach(key => {
            const planetData = planetsData[key];
            if (planetData && planetData.longitude !== undefined) {
                const planetInfo = this.planets[key];
                if (planetInfo) {
                    result.push({
                        name: planetInfo.name,
                        symbol: planetInfo.symbol,
                        sign: planetData.sign || this.getSignFromLongitude(planetData.longitude),
                        degree: planetData.degreeInSign || (planetData.longitude % 30).toFixed(1),
                        retrograde: false,
                        meaning: planetInfo.meaning,
                        role: planetInfo.role
                    });
                }
            }
        });
        return result;
    }

    formatAllPlanets(planetsData) {
        const allKeys = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
        return this.formatPlanetsByType(planetsData, allKeys);
    }

    formatHousesByType(housesData, numbers) {
        return housesData.filter(h => numbers.includes(String(h.number))).map(house => ({
            number: house.number,
            sign: house.sign,
            cusp: house.cusp,
            description: this.houses[house.number - 1]?.area || ''
        }));
    }

    formatAllHouses(housesData, planetsData) {
        return housesData.map(house => {
            const planetsInHouse = [];
            Object.values(planetsData).forEach(p => {
                if (p && p.longitude !== undefined && Math.floor(p.longitude / 30) + 1 === house.number) {
                    planetsInHouse.push(p.name || 'Планета');
                }
            });
            return {
                number: house.number,
                sign: house.sign,
                cusp: house.cusp,
                description: this.houses[house.number - 1]?.area || '',
                planets: planetsInHouse,
                keywords: this.houses[house.number - 1]?.keywords || ''
            };
        });
    }

    formatAspects(aspectsData) {
        return aspectsData.slice(0, 15).map(aspect => ({
            planet1: aspect.planet1,
            planet2: aspect.planet2,
            type: aspect.type,
            name: aspect.name,
            orb: aspect.orb,
            description: aspect.description
        }));
    }

    formatForDraw(planetsData) {
        const symbols = {
            sun: '☉', moon: '☽', mercury: '☿', venus: '♀',
            mars: '♂', jupiter: '♃', saturn: '♄',
            uranus: '♅', neptune: '♆', pluto: '♇'
        };
        const points = [];
        Object.entries(planetsData).forEach(([key, data]) => {
            if (data && data.longitude !== undefined) {
                points.push({
                    name: symbols[key] || key.substring(0, 2).toUpperCase(),
                    angle: data.longitude || 0
                });
            }
        });
        return points;
    }

    formatHousesForDraw(housesData) {
        return housesData.map(house => ({ angle: house.cusp }));
    }

    // ========== ПСИХОЛОГИЧЕСКИЕ ПОРТРЕТЫ ==========

    getBasicPsychology(planets, ascendantSign) {
        const sunSign = planets.sun?.sign || this.getSignFromLongitude(planets.sun?.longitude);
        const moonSign = planets.moon?.sign || this.getSignFromLongitude(planets.moon?.longitude);
        return {
            ego: `Ваше эго (Солнце в ${sunSign}) проявляется как ${this.getSunDescription(sunSign).toLowerCase()}`,
            emotions: `Ваши эмоции (Луна в ${moonSign}) ${this.getMoonDescription(moonSign).toLowerCase()}`,
            personality: `Ваша личность (Асцендент в ${ascendantSign}) ${this.getAscendantDescription(ascendantSign).toLowerCase()}`,
            strengths: this.getBasicStrengths(planets),
            challenges: this.getBasicChallenges(planets)
        };
    }

    getQuickPsychology(planets, ascendantSign) {
        const base = this.getBasicPsychology(planets, ascendantSign);
        return {
            ...base,
            growthPath: this.getGrowthPath(planets),
            communicationStyle: this.getCommunicationStyle(planets),
            loveStyle: this.getLoveStyle(planets)
        };
    }

    getStandardPsychology(planets, ascendantSign) {
        const base = this.getQuickPsychology(planets, ascendantSign);
        const sunSign = planets.sun?.sign;
        const moonSign = planets.moon?.sign;
        return {
            ...base,
            strengths: this.getStrengths(planets),
            challenges: this.getChallenges(planets),
            coreMotivation: this.getCoreMotivation(sunSign, moonSign),
            stressReaction: this.getStressReaction(planets)
        };
    }

    getFullPsychology(planets, ascendantSign) {
        const base = this.getStandardPsychology(planets, ascendantSign);
        const mercurySign = planets.mercury?.sign;
        const venusSign = planets.venus?.sign;
        const marsSign = planets.mars?.sign;
        return {
            ...base,
            thinkingStyle: this.getThinkingStyle(mercurySign),
            emotionalNeeds: this.getEmotionalNeeds(planets),
            shadowAspects: this.getShadowAspects(planets),
            lifePurpose: this.getLifePurpose(planets)
        };
    }

    getPremiumPsychology(planets, ascendantSign) {
        const base = this.getFullPsychology(planets, ascendantSign);
        return {
            ...base,
            karmicTasks: this.getKarmicTasks(planets),
            soulPurpose: this.getSoulPurpose(planets),
            subconsciousPatterns: this.getSubconsciousPatterns(planets),
            archetypes: this.getArchetypes(planets),
            integration: this.getIntegrationAdvice(planets)
        };
    }

    // ========== ПРОГНОЗЫ ==========

    getQuickForecast(planets) {
        const now = new Date();
        const dayOfYear = this.getDayOfYear(now);
        const moonSign = planets.moon?.sign || this.getSignFromLongitude(planets.moon?.longitude);
        const venusSign = planets.venus?.sign;
        const marsSign = planets.mars?.sign;
        return {
            general: dayOfYear % 2 === 0 ? 'Благоприятный день для начинаний' : 'День для завершения и отдыха',
            love: venusSign === 'Весы' ? 'Время для романтики' : 'Отношения требуют внимания',
            career: marsSign === 'Козерог' ? 'Карьерный рост' : 'Время планирования',
            health: moonSign === 'Рак' ? 'Обратите внимание на питание' : 'Энергия в норме'
        };
    }

    getStandardForecast(planets) {
        const base = this.getQuickForecast(planets);
        return {
            ...base,
            week: this.getWeeklyForecast(planets),
            month: this.getMonthlyForecast(planets),
            favorableActivities: this.getFavorableActivities(planets)
        };
    }

    getFullForecast(planets, aspects) {
        const base = this.getStandardForecast(planets);
        return {
            ...base,
            aspects: this.getAspectForecast(aspects),
            year: this.getYearlyForecast(planets),
            career: this.getDetailedCareerForecast(planets),
            love: this.getDetailedLoveForecast(planets)
        };
    }

    getPremiumForecast(planets, aspects) {
        const base = this.getFullForecast(planets, aspects);
        return {
            ...base,
            transits: this.getDetailedTransitForecast(planets),
            auspiciousDates: this.getAuspiciousDates(planets),
            warnings: this.getWarnings(planets),
            affirmations: this.getAffirmations(planets)
        };
    }

    // ========== ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ ==========

    getSignFromLongitude(longitude) {
        if (longitude === undefined || longitude === null || isNaN(longitude)) return 'Неизвестно';
        const signs = ['Овен', 'Телец', 'Близнецы', 'Рак', 'Лев', 'Дева', 'Весы', 'Скорпион', 'Стрелец', 'Козерог', 'Водолей', 'Рыбы'];
        const index = Math.floor(longitude / 30) % 12;
        return signs[index];
    }

    getDayOfYear(date) {
        const start = new Date(date.getFullYear(), 0, 0);
        const diff = date - start;
        const oneDay = 1000 * 60 * 60 * 24;
        return Math.floor(diff / oneDay);
    }

    // ========== ОПИСАНИЯ ЗНАКОВ ==========

    getAscendantDescription(sign) {
        const descriptions = {
            'Овен': 'Вы производите впечатление энергичного, прямолинейного человека. Ваша внешность активная, движения быстрые.',
            'Телец': 'Вы кажетесь спокойным, надежным, основательным. Вас воспринимают как человека с устойчивыми ценностями.',
            'Близнецы': 'Вы производите впечатление общительного, любознательного человека. Вас видят моложавым и подвижным.',
            'Рак': 'Вы кажетесь мягким, заботливым, чувствительным. Люди чувствуют в вас защиту и понимание.',
            'Лев': 'Вы производите впечатление гордого, щедрого, уверенного. Вас замечают, когда вы входите в комнату.',
            'Дева': 'Вы кажетесь скромным, аналитичным, практичным. Люди видят в вас помощника и советчика.',
            'Весы': 'Вы производите впечатление дипломатичного, обаятельного человека. Вас воспринимают как эстета.',
            'Скорпион': 'Вы кажетесь интенсивным, загадочным, проницательным. Люди чувствуют вашу глубину.',
            'Стрелец': 'Вы производите впечатление оптимистичного, свободолюбивого человека. Вас видят искателем приключений.',
            'Козерог': 'Вы кажетесь ответственным, серьезным, амбициозным. Люди perciben вас как зрелого человека.',
            'Водолей': 'Вы производите впечатление оригинального, независимого человека. Вас видят немного эксцентричным.',
            'Рыбы': 'Вы кажетесь мечтательным, сострадательным, загадочным. Люди чувствуют вашу эмпатию.'
        };
        return descriptions[sign] || 'У вас уникальное первое впечатление';
    }

    getSunDescription(sign) {
        const descriptions = {
            'Овен': 'Ваше эго — первопроходец. Вы хотите быть первым, начинать новое, проявлять инициативу.',
            'Телец': 'Ваше эго — строитель. Вы хотите стабильности, комфорта, материальных благ.',
            'Близнецы': 'Ваше эго — коммуникатор. Вы хотите информации, общения, разнообразия.',
            'Рак': 'Ваше эго — заботливый. Вы хотите безопасности, семьи, эмоциональной связи.',
            'Лев': 'Ваше эго — творец. Вы хотите признания, любви, самовыражения.',
            'Дева': 'Ваше эго — аналитик. Вы хотите порядка, пользы, совершенства.',
            'Весы': 'Ваше эго — дипломат. Вы хотите гармонии, партнерства, красоты.',
            'Скорпион': 'Ваше эго — исследователь глубин. Вы хотите трансформации, истины, страсти.',
            'Стрелец': 'Ваше эго — философ. Вы хотите свободы, смысла, приключений.',
            'Козерог': 'Ваше эго — лидер. Вы хотите достижений, статуса, ответственности.',
            'Водолей': 'Ваше эго — реформатор. Вы хотите свободы, инноваций, независимости.',
            'Рыбы': 'Ваше эго — мистик. Вы хотите единения, духовности, растворения.'
        };
        return descriptions[sign] || 'Ваша солнечная природа уникальна';
    }

    getMoonDescription(sign) {
        const descriptions = {
            'Овен': 'Ваши эмоции быстры и импульсивны. Вы остро реагируете, но быстро остываете.',
            'Телец': 'Ваши эмоции стабильны. Вам нужно чувство безопасности и комфорта.',
            'Близнецы': 'Ваши эмоции изменчивы. Вы реагируете интеллектуально, ищете понимания.',
            'Рак': 'Ваши эмоции глубоки. Вы очень чувствительны и нуждаетесь в защите.',
            'Лев': 'Ваши эмоции ярки. Вам нужно признание и восхищение.',
            'Дева': 'Ваши эмоции аналитичны. Вы тревожитесь о мелочах, ищете порядок.',
            'Весы': 'Ваши эмоции гармоничны. Вам нужны мир и красивое окружение.',
            'Скорпион': 'Ваши эмоции интенсивны. Вы чувствуете глубоко, не прощаете предательства.',
            'Стрелец': 'Ваши эмоции оптимистичны. Вам нужна свобода и новые впечатления.',
            'Козерог': 'Ваши эмоции сдержаны. Вы контролируете чувства, боитесь уязвимости.',
            'Водолей': 'Ваши эмоции необычны. Вы реагируете нестандартно, цените свободу.',
            'Рыбы': 'Ваши эмоции безграничны. Вы эмпатичны, чувствуете всех и всё.'
        };
        return descriptions[sign] || 'Ваша эмоциональная природа глубока';
    }

    // ========== СИЛЬНЫЕ СТОРОНЫ И ВЫЗОВЫ ==========

    getBasicStrengths(planets) {
        const strengths = [];
        const sunSign = planets.sun?.sign;
        if (sunSign === 'Лев' || sunSign === 'Овен') strengths.push('Сильная воля и инициативность');
        if (strengths.length < 2) strengths.push('Внутренняя мудрость');
        return strengths.slice(0, 2);
    }

    getBasicChallenges(planets) {
        return ['Умение балансировать между разумом и чувствами'];
    }

    getStrengths(planets) {
        const strengths = [];
        const sunSign = planets.sun?.sign;
        const moonSign = planets.moon?.sign;
        const mercurySign = planets.mercury?.sign;
        const venusSign = planets.venus?.sign;
        const marsSign = planets.mars?.sign;

        if (sunSign === 'Лев' || sunSign === 'Овен') strengths.push('Сильная воля и инициативность');
        if (moonSign === 'Рак' || moonSign === 'Рыбы') strengths.push('Глубокая эмпатия и интуиция');
        if (mercurySign === 'Близнецы' || mercurySign === 'Дева') strengths.push('Острый ум и коммуникабельность');
        if (venusSign === 'Телец' || venusSign === 'Весы') strengths.push('Художественный вкус и дипломатичность');
        if (marsSign === 'Овен' || marsSign === 'Скорпион') strengths.push('Энергия и страстность');

        if (strengths.length < 3) {
            strengths.push('Способность к трансформации');
            strengths.push('Внутренняя мудрость');
        }
        return strengths.slice(0, 4);
    }

    getChallenges(planets) {
        const challenges = [];
        const saturnSign = planets.saturn?.sign;
        const marsSign = planets.mars?.sign;
        const venusSign = planets.venus?.sign;

        if (saturnSign === 'Козерог' || saturnSign === 'Водолей') challenges.push('Склонность к самокритике и ограничениям');
        if (marsSign === 'Рак') challenges.push('Эмоциональная нестабильность и обидчивость');
        if (venusSign === 'Скорпион') challenges.push('Ревность и страстность, требующая контроля');

        challenges.push('Умение балансировать между разумом и чувствами');
        challenges.push('Принятие своей уязвимости');
        return challenges.slice(0, 3);
    }

    getGrowthPath(planets) {
        const paths = [
            'Развивать осознанность и наблюдать за своими реакциями',
            'Учиться принимать неопределенность и доверять потоку жизни',
            'Находить баланс между действием и принятием',
            'Интегрировать свою тень и принимать все части себя',
            'Слушать свою интуицию и доверять внутреннему голосу',
            'Практиковать благодарность и радоваться простым вещам'
        ];
        const sunLong = planets.sun?.longitude || 0;
        return paths[Math.floor(sunLong / 60) % paths.length];
    }

    getCommunicationStyle(planets) {
        const mercurySign = planets.mercury?.sign;
        const styles = {
            'Овен': 'Прямолинейный, импульсивный. Любите спорить и отстаивать свою точку зрения.',
            'Телец': 'Спокойный, обстоятельный. Не любите спешить в разговоре.',
            'Близнецы': 'Живой, быстрый. Легко переключаетесь между темами.',
            'Рак': 'Эмоциональный, с оттенками настроения. Говорите то, что чувствуете.',
            'Лев': 'Яркий, выразительный. Любите быть в центре внимания.',
            'Дева': 'Точный, детальный. Склонны к анализу и критике.',
            'Весы': 'Дипломатичный, тактичный. Избегаете конфликтов.',
            'Скорпион': 'Глубокий, проницательный. Слова имеют скрытый смысл.',
            'Стрелец': 'Открытый, прямолинейный. Любите философствовать.',
            'Козерог': 'Сдержанный, деловой. Говорите по делу.',
            'Водолей': 'Оригинальный, неожиданный. Мыслите нестандартно.',
            'Рыбы': 'Мягкий, мечтательный. Иногда уходите от темы.'
        };
        return styles[mercurySign] || 'Уникальный стиль общения';
    }

    getLoveStyle(planets) {
        const venusSign = planets.venus?.sign;
        const styles = {
            'Овен': 'Страстный, импульсивный. Быстро влюбляетесь и быстро остываете.',
            'Телец': 'Верный, чувственный. Цените стабильность и физический комфорт.',
            'Близнецы': 'Легкий, игривый. Нуждаетесь в умственном стимулировании.',
            'Рак': 'Нежный, заботливый. Ищете эмоциональную безопасность.',
            'Лев': 'Щедрый, романтичный. Любите ухаживания и внимание.',
            'Дева': 'Практичный, внимательный. Выражаете любовь через заботу.',
            'Весы': 'Романтичный, дипломатичный. Стремитесь к гармонии.',
            'Скорпион': 'Страстный, глубокий. Интенсивные, трансформирующие отношения.',
            'Стрелец': 'Свободолюбивый, оптимистичный. Цените независимость.',
            'Козерог': 'Серьезный, ответственный. Ищете надежного партнера.',
            'Водолей': 'Нестандартный, дружеский. Цените интеллектуальную связь.',
            'Рыбы': 'Идеалистичный, романтичный. Мечтаете о сказочной любви.'
        };
        return styles[venusSign] || 'Уникальный стиль любви';
    }

    getCoreMotivation(sunSign, moonSign) {
        const motivations = {
            'Овен': 'Быть первым, проявлять инициативу',
            'Телец': 'Достичь стабильности и комфорта',
            'Близнецы': 'Узнавать новое и общаться',
            'Рак': 'Создать безопасное пространство',
            'Лев': 'Получить признание и восхищение',
            'Дева': 'Быть полезным и совершенным',
            'Весы': 'Найти гармонию и красоту',
            'Скорпион': 'Познать глубину и трансформироваться',
            'Стрелец': 'Расширить горизонты и найти смысл',
            'Козерог': 'Достичь успеха и признания',
            'Водолей': 'Изобретать и менять мир',
            'Рыбы': 'Соединиться с высшим, творить'
        };
        return `Ваша глубинная мотивация — ${motivations[sunSign] || 'самореализация'}, а эмоциональный комфорт приносит ${motivations[moonSign]?.toLowerCase() || 'забота о близких'}`;
    }

    getStressReaction(planets) {
        const marsSign = planets.mars?.sign;
        const reactions = {
            'Овен': 'реагируете импульсивно, можете вспылить, но быстро остываете',
            'Телец': 'замыкаетесь в себе, ищете утешение в еде или комфорте',
            'Близнецы': 'начинаете много говорить, искать информацию',
            'Рак': 'уходите в свою скорлупу, можете расплакаться',
            'Лев': 'ищете поддержки и признания, можете драматизировать',
            'Дева': 'начинаете анализировать, критиковать, наводить порядок',
            'Весы': 'ищете компромисс, можете уходить от конфликта',
            'Скорпион': 'погружаетесь в себя, можете быть язвительным',
            'Стрелец': 'ищете выход через путешествия или новые впечатления',
            'Козерог': 'становитесь более сдержанным, берете на себя больше ответственности',
            'Водолей': 'отстраняетесь, ищете нестандартные решения',
            'Рыбы': 'уходите в мечты, можете искать утешение в искусстве'
        };
        return `В стрессовых ситуациях вы ${reactions[marsSign] || 'реагируете по-своему'}`;
    }

    getThinkingStyle(mercurySign) {
        const styles = {
            'Овен': 'Быстро принимаете решения, мыслите прямо и напористо.',
            'Телец': 'Мыслите основательно, не любите спешить с выводами.',
            'Близнецы': 'Мыслите быстро, легко переключаетесь, схватываете на лету.',
            'Рак': 'Мыслите эмоционально, решения принимаете сердцем.',
            'Лев': 'Мыслите творчески, любите грандиозные идеи.',
            'Дева': 'Мыслите аналитически, замечаете детали и нюансы.',
            'Весы': 'Мыслите дипломатично, взвешиваете все "за" и "против".',
            'Скорпион': 'Мыслите глубоко, проникаете в суть вещей.',
            'Стрелец': 'Мыслите философски, ищете смысл и закономерности.',
            'Козерог': 'Мыслите прагматично, просчитываете последствия.',
            'Водолей': 'Мыслите нестандартно, генерируете оригинальные идеи.',
            'Рыбы': 'Мыслите интуитивно, доверяете внутреннему голосу.'
        };
        return styles[mercurySign] || 'У вас уникальный стиль мышления';
    }

    getEmotionalNeeds(planets) {
        const moonSign = planets.moon?.sign;
        const needs = {
            'Овен': 'Вам нужно чувствовать себя независимым и иметь пространство для самовыражения.',
            'Телец': 'Вам нужна стабильность, комфорт и физическая безопасность.',
            'Близнецы': 'Вам нужно общение, новая информация и интеллектуальная стимуляция.',
            'Рак': 'Вам нужна эмоциональная безопасность, забота и дом.',
            'Лев': 'Вам нужно признание, восхищение и творческое самовыражение.',
            'Дева': 'Вам нужен порядок, чистота и чувство полезности.',
            'Весы': 'Вам нужна гармония, красота и партнерство.',
            'Скорпион': 'Вам нужна глубокая эмоциональная связь и возможность трансформации.',
            'Стрелец': 'Вам нужна свобода, приключения и философский смысл.',
            'Козерог': 'Вам нужен статус, достижения и уважение.',
            'Водолей': 'Вам нужна свобода, независимость и интеллектуальная дружба.',
            'Рыбы': 'Вам нужно творчество, уединение и духовная связь.'
        };
        return needs[moonSign] || 'У вас уникальные эмоциональные потребности';
    }

    getShadowAspects(planets) {
        const plutoSign = planets.pluto?.sign;
        const shadows = {
            'Скорпион': 'Склонность к контролю и ревности',
            'Овен': 'Импульсивность и агрессивность',
            'Телец': 'Упрямство и материализм',
            'Близнецы': 'Поверхностность и непостоянство',
            'Рак': 'Эмоциональная зависимость',
            'Лев': 'Эгоцентризм и тщеславие',
            'Дева': 'Перфекционизм и самокритика',
            'Весы': 'Неумение принимать решения',
            'Стрелец': 'Безответственность',
            'Козерог': 'Черствость и карьеризм',
            'Водолей': 'Отстраненность',
            'Рыбы': 'Эскапизм и самообман'
        };
        return shadows[plutoSign] || 'Скрытые тенденции, требующие осознания';
    }

    getLifePurpose(planets) {
        const northNode = planets.northNode?.sign || this.getSignFromLongitude((planets.moon?.longitude || 0) + 180);
        const purposes = {
            'Овен': 'Научиться действовать самостоятельно, проявлять инициативу.',
            'Телец': 'Научиться ценить себя и создавать устойчивую ценность.',
            'Близнецы': 'Научиться коммуникации и обмену информацией.',
            'Рак': 'Научиться заботиться о себе и создавать эмоциональную безопасность.',
            'Лев': 'Научиться творческому самовыражению и лидерству.',
            'Дева': 'Научиться служить и совершенствовать.',
            'Весы': 'Научиться строить гармоничные отношения.',
            'Скорпион': 'Научиться трансформации и глубокому познанию.',
            'Стрелец': 'Научиться искать смысл и расширять горизонты.',
            'Козерог': 'Научиться ответственности и достижению целей.',
            'Водолей': 'Научиться быть уникальным и вносить вклад в общество.',
            'Рыбы': 'Научиться доверять интуиции и соединяться с высшим.'
        };
        return purposes[northNode] || 'Раскрыть свой уникальный потенциал';
    }

    getKarmicTasks(planets) {
        const saturnSign = planets.saturn?.sign;
        const tasks = {
            'Овен': 'Научиться действовать без оглядки на других, проявлять лидерство.',
            'Телец': 'Научиться ценить себя и свои ресурсы.',
            'Близнецы': 'Научиться ясно выражать мысли и слушать других.',
            'Рак': 'Научиться заботиться о себе так же, как о других.',
            'Лев': 'Научиться принимать себя и не ждать постоянного признания.',
            'Дева': 'Научиться принимать несовершенство.',
            'Весы': 'Научиться принимать решения и нести за них ответственность.',
            'Скорпион': 'Научиться отпускать контроль и доверять.',
            'Стрелец': 'Научиться ответственности и завершению начатого.',
            'Козерог': 'Научиться радоваться жизни без погони за статусом.',
            'Водолей': 'Научиться балансу между свободой и близостью.',
            'Рыбы': 'Научиться различать интуицию и иллюзии.'
        };
        return tasks[saturnSign] || 'Осознать свои ограничения и трансформировать их';
    }

    getSoulPurpose(planets) {
        const sunSign = planets.sun?.sign;
        const purposes = {
            'Овен': 'Быть пионером, открывать новые пути.',
            'Телец': 'Создавать устойчивую красоту и ценность.',
            'Близнецы': 'Быть проводником информации и идей.',
            'Рак': 'Исцелять через заботу и эмоциональную поддержку.',
            'Лев': 'Вдохновлять других своим творчеством и светом.',
            'Дева': 'Служить, исцелять, совершенствовать.',
            'Весы': 'Создавать гармонию и справедливость.',
            'Скорпион': 'Трансформировать, исцелять через глубину.',
            'Стрелец': 'Искать истину и делиться мудростью.',
            'Козерог': 'Строить структуры, достигать вершин.',
            'Водолей': 'Изобретать, менять мир к лучшему.',
            'Рыбы': 'Творить, вдохновлять, соединять с высшим.'
        };
        return purposes[sunSign] || 'Реализовать свой уникальный потенциал';
    }

    getSubconsciousPatterns(planets) {
        const moonSign = planets.moon?.sign;
        const patterns = {
            'Овен': 'Импульсивные реакции, нужно научиться паузе.',
            'Телец': 'Привязанность к материальному, нужно отпускать.',
            'Близнецы': 'Поверхностность, нужно учиться глубине.',
            'Рак': 'Эмоциональная зависимость, нужно учиться границам.',
            'Лев': 'Потребность в признании, нужно учиться самодостаточности.',
            'Дева': 'Самокритика, нужно учиться принятию.',
            'Весы': 'Неумение выбирать, нужно учиться решительности.',
            'Скорпион': 'Страх потери, нужно учиться доверию.',
            'Стрелец': 'Бегство от ответственности, нужно учиться стабильности.',
            'Козерог': 'Страх уязвимости, нужно учиться открытости.',
            'Водолей': 'Страх близости, нужно учиться контакту.',
            'Рыбы': 'Эскапизм, нужно учиться заземлению.'
        };
        return patterns[moonSign] || 'Осознание своих подсознательных шаблонов';
    }

    getArchetypes(planets) {
        const sunSign = planets.sun?.sign;
        const archetypes = {
            'Овен': 'Воин, первопроходец, герой',
            'Телец': 'Строитель, садовник, хранитель',
            'Близнецы': 'Посланник, ученик, рассказчик',
            'Рак': 'Мать, хранительница очага, эмпат',
            'Лев': 'Король, творец, шоумен',
            'Дева': 'Целитель, аналитик, служитель',
            'Весы': 'Дипломат, миротворец, эстет',
            'Скорпион': 'Следователь, маг, трансформатор',
            'Стрелец': 'Философ, учитель, странник',
            'Козерог': 'Лидер, стратег, архитектор',
            'Водолей': 'Реформатор, изобретатель, гуманист',
            'Рыбы': 'Мистик, художник, провидец'
        };
        return archetypes[sunSign] || 'Уникальная комбинация архетипов';
    }

    getIntegrationAdvice(planets) {
        const sunSign = planets.sun?.sign;
        const moonSign = planets.moon?.sign;
        const advice = {
            'Овен-Рак': 'Соедините смелость с заботой. Будьте сильным, но не забывайте о чувствах.',
            'Телец-Скорпион': 'Соедините стабильность с трансформацией. Учитесь отпускать.',
            'Близнецы-Стрелец': 'Соедините легкость с глубиной. Не бойтесь ответственности.',
            'Рак-Козерог': 'Соедините чувства с долгом. Разрешите себе быть уязвимым.',
            'Лев-Водолей': 'Соедините личное с коллективным. Делитесь светом, не ослепляя.',
            'Дева-Рыбы': 'Соедините анализ с интуицией. Доверяйте себе больше.'
        };
        const key = `${sunSign}-${moonSign}`;
        return advice[key] || 'Интегрируйте свою солнечную и лунную природу для целостности';
    }

    // ========== ПРОГНОЗЫ ==========

    getWeeklyForecast(planets) {
        const marsSign = planets.mars?.sign;
        const mercurySign = planets.mercury?.sign;
        const venusSign = planets.venus?.sign;
        return `Неделя будет динамичной. ${marsSign === 'Овен' ? 'Энергия на подъеме' : 'Распределяйте силы равномерно'}. ${mercurySign === 'Близнецы' ? 'Хорошее время для переговоров' : 'Будьте внимательны в общении'}. ${venusSign === 'Весы' ? 'Возможны романтические встречи' : 'Отношения требуют внимания'}.`;
    }

    getMonthlyForecast(planets) {
        const jupiterSign = planets.jupiter?.sign;
        const saturnSign = planets.saturn?.sign;
        return `Месяц принесет ${jupiterSign === 'Стрелец' ? 'удачу в новых начинаниях' : 'возможности для роста'}. ${saturnSign === 'Козерог' ? 'Важны дисциплина и терпение' : 'Сосредоточьтесь на главном'}.`;
    }

    getYearlyForecast(planets) {
        const jupiterSign = planets.jupiter?.sign;
        const saturnSign = planets.saturn?.sign;
        const uranusSign = planets.uranus?.sign;
        return `Год обещает ${jupiterSign === 'Стрелец' ? 'расширение горизонтов' : 'стабильный рост'}. ${saturnSign === 'Козерог' ? 'Время строить фундамент' : 'Время достижений'}. ${uranusSign === 'Водолей' ? 'Ждите неожиданных поворотов' : 'Год без резких перемен'}.`;
    }

    getFavorableActivities(planets) {
        const mercurySign = planets.mercury?.sign;
        const venusSign = planets.venus?.sign;
        const marsSign = planets.mars?.sign;
        const activities = [];
        if (mercurySign === 'Близнецы') activities.push('Обучение, переговоры, написание текстов');
        if (venusSign === 'Телец') activities.push('Творчество, финансы, отношения');
        if (marsSign === 'Овен') activities.push('Спорт, бизнес, новые проекты');
        if (activities.length === 0) activities.push('Планирование, анализ, отдых');
        return activities;
    }

    getAspectForecast(aspects) {
        const positive = aspects.filter(a => a.type === 'trine' || a.type === 'sextile');
        const challenging = aspects.filter(a => a.type === 'square' || a.type === 'opposition');
        if (positive.length > challenging.length) {
            return 'Преобладают гармоничные аспекты. Время благоприятно для начинаний.';
        } else if (challenging.length > positive.length) {
            return 'Есть напряженные аспекты. Будьте внимательны, но не бойтесь вызовов.';
        }
        return 'Баланс гармонии и напряжения. Используйте вызовы для роста.';
    }

    getDetailedCareerForecast(planets) {
        const sunSign = planets.sun?.sign;
        const marsSign = planets.mars?.sign;
        const saturnSign = planets.saturn?.sign;
        const jupiterSign = planets.jupiter?.sign;

        let forecast = `В карьере вам поможет `;
        if (sunSign === 'Лев') forecast += `ваше лидерство и харизма. `;
        else if (sunSign === 'Козерог') forecast += `ваше упорство и амбиции. `;
        else if (sunSign === 'Близнецы') forecast += `ваша коммуникабельность и гибкость. `;
        else forecast += `ваш уникальный подход. `;

        if (marsSign === 'Овен') forecast += `Действуйте быстро и решительно. `;
        else if (marsSign === 'Телец') forecast += `Двигайтесь к цели методично. `;

        if (saturnSign === 'Козерог') forecast += `Дисциплина приведет к успеху. `;
        if (jupiterSign === 'Стрелец') forecast += `Возможны командировки или расширение деятельности.`;

        return forecast;
    }

    getDetailedLoveForecast(planets) {
        const venusSign = planets.venus?.sign;
        const marsSign = planets.mars?.sign;
        const moonSign = planets.moon?.sign;

        let forecast = `В любви `;
        if (venusSign === 'Весы') forecast += `вам важно равноправие и гармония. `;
        else if (venusSign === 'Скорпион') forecast += `вы ищете глубину и страсть. `;
        else if (venusSign === 'Рыбы') forecast += `вы романтичны и мечтательны. `;
        else forecast += `вы цените искренность. `;

        if (marsSign === 'Овен') forecast += `Проявляйте инициативу. `;
        else if (marsSign === 'Рак') forecast += `Будьте нежны и заботливы. `;

        if (moonSign === 'Рак') forecast += `Эмоциональная близость для вас важнее всего.`;
        else if (moonSign === 'Водолей') forecast += `Цените свободу в отношениях.`;

        return forecast;
    }

    getDetailedTransitForecast(planets) {
        const now = new Date();
        const month = now.getMonth();
        const seasons = ['зиму', 'весну', 'лето', 'осень'];
        const season = seasons[Math.floor(month / 3)];
        return `В ближайшие три месяца ожидается ${season}й период активности. ${month < 3 ? 'Зимой' : month < 6 ? 'Весной' : month < 9 ? 'Летом' : 'Осенью'} возможны важные события в сфере ${['карьеры', 'отношений', 'финансов', 'личного роста'][month % 4]}.`;
    }

    getAuspiciousDates(planets) {
        const moonPhase = (planets.moon?.longitude || 0) % 360;
        const phases = ['Новолуние', 'Растущая Луна', 'Полнолуние', 'Убывающая Луна'];
        const phaseIndex = Math.floor(moonPhase / 90);
        return `Благоприятные дни для начинаний: ${phaseIndex === 0 ? 'первые дни после новолуния' : phaseIndex === 1 ? 'первая половина лунного цикла' : phaseIndex === 2 ? 'дни после полнолуния' : 'перед новолунием'}.`;
    }

    getWarnings(planets) {
        const saturnSign = planets.saturn?.sign;
        const marsSign = planets.mars?.sign;
        const warnings = [];
        if (saturnSign === 'Козерог') warnings.push('Не берите на себя слишком много обязательств');
        if (marsSign === 'Овен') warnings.push('Контролируйте импульсивность');
        if (warnings.length === 0) warnings.push('Будьте внимательны к своему здоровью');
        return warnings;
    }

    getAffirmations(planets) {
        const sunSign = planets.sun?.sign;
        const affirmations = {
            'Овен': 'Я действую смело и уверенно. Я начинаю новое с радостью.',
            'Телец': 'Я ценю себя и свои ресурсы. Я в безопасности и изобилии.',
            'Близнецы': 'Я открыт к новым знаниям. Мои слова имеют силу.',
            'Рак': 'Я забочусь о себе с любовью. Мои чувства важны.',
            'Лев': 'Я сияю своим светом. Моя уникальность прекрасна.',
            'Дева': 'Я принимаю себя таким, какой я есть. Мое служение ценно.',
            'Весы': 'Я в гармонии с собой и миром. Мои отношения полны любви.',
            'Скорпион': 'Я прохожу через трансформацию с доверием. Я силен духом.',
            'Стрелец': 'Я открыт для приключений. Истина ведет меня.',
            'Козерог': 'Я достигаю целей с легкостью. Мой успех заслужен.',
            'Водолей': 'Я свободен и уникален. Мои идеи меняют мир.',
            'Рыбы': 'Я доверяю своей интуиции. Я соединен с высшим.'
        };
        return affirmations[sunSign] || 'Я доверяю себе и своему пути. Я расту и развиваюсь каждый день.';
    }

    getKarmaAnalysis(planets) {
        const saturnSign = planets.saturn?.sign || this.getSignFromLongitude(planets.saturn?.longitude);

        // Получаем Южный узел (southNode)
        // Если в данных нет южного узла, вычисляем его как противоположную точку северного узла
        let southNodeSign = '—';
        let northNodeSign = '—';

        if (planets.southNode?.sign) {
            southNodeSign = planets.southNode.sign;
        } else if (planets.northNode?.sign) {
            // Если есть северный узел, южный находится в противоположном знаке
            const northSign = planets.northNode.sign;
            const signs = ['Овен', 'Телец', 'Близнецы', 'Рак', 'Лев', 'Дева', 'Весы', 'Скорпион', 'Стрелец', 'Козерог', 'Водолей', 'Рыбы'];
            const northIndex = signs.indexOf(northSign);
            if (northIndex !== -1) {
                const southIndex = (northIndex + 6) % 12;
                southNodeSign = signs[southIndex];
            }
        } else if (planets.moon?.longitude !== undefined) {
            // Если нет данных об узлах, вычисляем приблизительно по положению Луны
            // Южный узел обычно на 180° от северного
            const moonLong = planets.moon.longitude;
            const approxNorthLong = (moonLong + 180) % 360;
            southNodeSign = this.getSignFromLongitude(approxNorthLong);
        }

        // Получаем Северный узел
        if (planets.northNode?.sign) {
            northNodeSign = planets.northNode.sign;
        } else if (planets.moon?.longitude !== undefined) {
            const moonLong = planets.moon.longitude;
            const approxNorthLong = moonLong;
            northNodeSign = this.getSignFromLongitude(approxNorthLong);
        }

        return {
            pastLifeLessons: `В прошлых жизнях вы освоили качества знака ${southNodeSign}. Это ваша база, то, что дается легко и естественно.`,
            currentTask: `В этом воплощении вам предстоит развить качества знака ${northNodeSign}. Это ваш путь роста и развития.`,
            saturnLesson: this.getKarmicLesson(saturnSign)
        };
    }


    getKarmicLesson(sign) {
        const lessons = {
            'Овен': 'научиться действовать самостоятельно, не оглядываясь на других',
            'Телец': 'научиться ценить себя и свои ресурсы',
            'Близнецы': 'научиться ясно выражать мысли и слушать',
            'Рак': 'научиться заботиться о себе так же, как о других',
            'Лев': 'научиться принимать себя и не ждать постоянного признания',
            'Дева': 'научиться принимать несовершенство',
            'Весы': 'научиться принимать решения и нести за них ответственность',
            'Скорпион': 'научиться отпускать контроль и доверять',
            'Стрелец': 'научиться ответственности и завершению начатого',
            'Козерог': 'научиться радоваться жизни без погони за статусом',
            'Водолей': 'научиться балансу между свободой и близостью',
            'Рыбы': 'научиться различать интуицию и иллюзии'
        };
        return lessons[sign] || 'интегрировать свои уроки и стать более целостной личностью';
    }

    getTransitForecast(planets) {
        return this.getDetailedTransitForecast(planets);
    }

    getPersonalRecommendations(planets, ascendantSign) {
        const sunSign = planets.sun?.sign;
        const moonSign = planets.moon?.sign;
        return [
            `Раскрывайте свою солнечную природу (${sunSign}) через ${this.getSunPath(sunSign)}`,
            `Заботьтесь о своей лунной потребности (${moonSign}) через ${this.getMoonPath(moonSign)}`,
            `Используйте силу асцендента (${ascendantSign}) для ${this.getAscendantPath(ascendantSign)}`
        ];
    }

    getSunPath(sign) {
        const paths = {
            'Овен': 'спорт, соревнования, лидерство',
            'Телец': 'творчество, природа, накопление',
            'Близнецы': 'общение, обучение, путешествия',
            'Рак': 'заботу о близких, дом',
            'Лев': 'творчество, выступления, хобби',
            'Дева': 'работу, служение, порядок',
            'Весы': 'искусство, партнерство, гармонию',
            'Скорпион': 'исследования, психологию, трансформацию',
            'Стрелец': 'путешествия, философию, обучение',
            'Козерог': 'карьеру, достижения, структуру',
            'Водолей': 'инновации, друзей, социальную активность',
            'Рыбы': 'искусство, музыку, духовные практики'
        };
        return paths[sign] || 'самовыражение';
    }

    getMoonPath(sign) {
        const paths = {
            'Овен': 'физическую активность',
            'Телец': 'создание уюта и комфорта',
            'Близнецы': 'общение и новую информацию',
            'Рак': 'время с семьей и близкими',
            'Лев': 'творчество и внимание к себе',
            'Дева': 'порядок и заботу о здоровье',
            'Весы': 'красоту и гармонию',
            'Скорпион': 'глубокие чувства и трансформацию',
            'Стрелец': 'свободу и новые впечатления',
            'Козерог': 'достижения и структуру',
            'Водолей': 'друзей и единомышленников',
            'Рыбы': 'творчество и уединение'
        };
        return paths[sign] || 'эмоциональный комфорт';
    }

    getAscendantPath(sign) {
        const paths = {
            'Овен': 'проявления себя в мире',
            'Телец': 'создания устойчивости',
            'Близнецы': 'коммуникации',
            'Рак': 'эмпатии и заботы',
            'Лев': 'самопрезентации',
            'Дева': 'служения и порядка',
            'Весы': 'дипломатии',
            'Скорпион': 'глубины и проницательности',
            'Стрелец': 'расширения горизонтов',
            'Козерог': 'достижения целей',
            'Водолей': 'оригинальности',
            'Рыбы': 'интуиции и творчества'
        };
        return paths[sign] || 'личностного роста';
    }

    analyzeRelationship(planets, question) {
        const venusSign = planets.venus?.sign;
        const marsSign = planets.mars?.sign;
        const moonSign = planets.moon?.sign;

        const compatibility = venusSign === marsSign ? 85 :
            venusSign && marsSign ? 65 : 50;

        return {
            compatibility,
            advice: `В отношениях вам важно ${this.getLoveAdvice(venusSign)}. ${this.getMarsAdvice(marsSign)}`,
            challenge: `Ваша главная задача в любви — ${this.getLoveChallenge(moonSign)}`,
            opportunity: `Сейчас благоприятно для ${this.getLoveOpportunity(venusSign, marsSign)}`
        };
    }

    getLoveAdvice(sign) {
        const advice = {
            'Овен': 'проявлять инициативу, но уважать границы партнера',
            'Телец': 'ценить стабильность, но не бояться перемен',
            'Близнецы': 'находить баланс между свободой и близостью',
            'Рак': 'заботиться, но не растворяться в партнере',
            'Лев': 'дарить любовь, не требуя постоянного восхищения',
            'Дева': 'принимать несовершенства',
            'Весы': 'искать гармонию, но не терять себя',
            'Скорпион': 'доверять и не контролировать',
            'Стрелец': 'быть верным, сохраняя свободу',
            'Козерог': 'проявлять чувства, не боясь уязвимости',
            'Водолей': 'сочетать дружбу и страсть',
            'Рыбы': 'различать любовь и иллюзию'
        };
        return advice[sign] || 'быть искренним';
    }

    getMarsAdvice(sign) {
        return sign === 'Овен' ? 'Действуйте смело, но не агрессивно.' :
            sign === 'Рак' ? 'Проявляйте инициативу мягко.' :
                'Проявляйте свои желания открыто.';
    }

    getLoveChallenge(sign) {
        const challenges = {
            'Овен': 'научиться терпению',
            'Телец': 'отпускать контроль',
            'Близнецы': 'быть последовательным',
            'Рак': 'не зависеть эмоционально',
            'Лев': 'не требовать постоянного внимания',
            'Дева': 'не критиковать',
            'Весы': 'принимать решения',
            'Скорпион': 'доверять',
            'Стрелец': 'брать ответственность',
            'Козерог': 'проявлять чувства',
            'Водолей': 'быть эмоционально открытым',
            'Рыбы': 'видеть реальность'
        };
        return challenges[sign] || 'быть собой';
    }

    getLoveOpportunity(venusSign, marsSign) {
        if (venusSign === marsSign) return 'углубления существующих отношений';
        if (venusSign === 'Весы' && marsSign === 'Овен') return 'примирения противоположностей';
        if (venusSign === 'Телец' && marsSign === 'Скорпион') return 'трансформации отношений';
        return 'новых знакомств и романтики';
    }

    // ========== ИНТЕРПРЕТАЦИИ ==========

    generateBasicInterpretation(data) {
        const psychology = data.psychology || {};
        const strengths = psychology.strengths || [];
        const challenges = psychology.challenges || [];

        return `🌟 **АСТРОПСИХОЛОГИЧЕСКИЙ ПОРТРЕТ (БАЗОВЫЙ)**

**АСЦЕНДЕНТ (${data.ascendant?.sign || '—'})**
${data.ascendant?.description || '—'}

**СОЛНЦЕ (${data.sun?.sign || '—'})**
${data.sun?.description || '—'}

**ЛУНА (${data.moon?.sign || '—'})**
${data.moon?.description || '—'}

**СИЛЬНЫЕ СТОРОНЫ**
${strengths.map(s => `• ${s}`).join('\n') || '• —'}

**ЗОНЫ РОСТА**
${challenges.map(c => `• ${c}`).join('\n') || '• —'}

*Это ваш базовый астропсихологический портрет. Для более глубокого анализа выберите расширенный расчет.*`;
    }

    generateQuickInterpretation(data, planets) {
        const psychology = data.psychology || {};
        const strengths = psychology.strengths || [];
        const challenges = psychology.challenges || [];
        const forecast = data.forecast || {};

        return `🌟 **АСТРОПСИХОЛОГИЧЕСКИЙ ПОРТРЕТ (ЭКСПРЕСС-АНАЛИЗ)**

**АСЦЕНДЕНТ (${data.ascendant?.sign || '—'})**
${data.ascendant?.description || '—'}

**СОЛНЦЕ (${data.sun?.sign || '—'})**
${data.sun?.description || '—'}

**ЛУНА (${data.moon?.sign || '—'})**
${data.moon?.description || '—'}

**МЕРКУРИЙ (${planets.mercury?.sign || '—'})**
${psychology.communicationStyle || '—'}

**ВЕНЕРА (${planets.venus?.sign || '—'})**
${psychology.loveStyle || '—'}

**МАРС (${planets.mars?.sign || '—'})**
${psychology.stressReaction || '—'}

**СИЛЬНЫЕ СТОРОНЫ**
${strengths.map(s => `• ${s}`).join('\n') || '• —'}

**ЗОНЫ РОСТА**
${challenges.map(c => `• ${c}`).join('\n') || '• —'}

**КРАТКОСРОЧНЫЙ ПРОГНОЗ**
💼 Карьера: ${forecast.career || '—'}
❤️ Любовь: ${forecast.love || '—'}
🌿 Здоровье: ${forecast.health || '—'}
✨ Общий: ${forecast.general || '—'}

${forecast.week ? `**НЕДЕЛЬНЫЙ ПРОГНОЗ**\n${forecast.week}` : ''}

**СОВЕТ**
${psychology.growthPath || 'Развивайте осознанность и доверяйте своей интуиции.'}`;
    }


    generateStandardInterpretation(data, planets, houses) {
        const psychology = data.psychology || {};
        const strengths = psychology.strengths || [];
        const challenges = psychology.challenges || [];
        const forecast = data.forecast || {};

        const activeHouses = (houses || []).filter(h => h.planets?.length > 0).slice(0, 5);

        return `🌟 **АСТРОПСИХОЛОГИЧЕСКИЙ ПОРТРЕТ (СТАНДАРТНЫЙ)**

**АСЦЕНДЕНТ (${data.ascendant?.sign || '—'})**
${data.ascendant?.description || '—'}

**СОЛНЦЕ (${data.sun?.sign || '—'})**
${data.sun?.description || '—'}

**ЛУНА (${data.moon?.sign || '—'})**
${data.moon?.description || '—'}

**МЕРКУРИЙ (${planets.mercury?.sign || '—'})**
${psychology.communicationStyle || '—'}

**ВЕНЕРА (${planets.venus?.sign || '—'})**
${psychology.loveStyle || '—'}

**МАРС (${planets.mars?.sign || '—'})**
${psychology.stressReaction || '—'}

**ПСИХОЛОГИЧЕСКИЙ АНАЛИЗ**

**ЭГО (Солнце в ${planets.sun?.sign || '—'}):**
${psychology.ego || '—'}

**ЭМОЦИИ (Луна в ${planets.moon?.sign || '—'}):**
${psychology.emotions || '—'}

**ЛИЧНОСТЬ (Асцендент в ${data.ascendant?.sign || '—'}):**
${psychology.personality || '—'}

**СИЛЬНЫЕ СТОРОНЫ**
${strengths.map(s => `• ${s}`).join('\n') || '• —'}

**ЗОНЫ РОСТА**
${challenges.map(c => `• ${c}`).join('\n') || '• —'}

**КЛЮЧЕВЫЕ СФЕРЫ ЖИЗНИ**
${activeHouses.map(h => `• ${h.number} дом (${h.description || '—'}): ${h.planets?.join(', ') || 'активен'}`).join('\n') || '• —'}

**ПУТЬ РАЗВИТИЯ**
${psychology.growthPath || '—'}

**ПРОГНОЗ**
💼 Карьера: ${forecast.career || '—'}
❤️ Любовь: ${forecast.love || '—'}
🌿 Здоровье: ${forecast.health || '—'}
✨ Общий: ${forecast.general || '—'}

${forecast.week ? `**НЕДЕЛЬНЫЙ ПРОГНОЗ**\n${forecast.week}` : ''}
${forecast.month ? `**МЕСЯЧНЫЙ ПРОГНОЗ**\n${forecast.month}` : ''}

**СОВЕТ**
${psychology.coreMotivation || 'Следуйте за своей интуицией и доверяйте себе.'}`;
    }

    generateFullInterpretation(data, planets, houses, aspects, question) {
        const psychology = data.psychology || {};
        const strengths = psychology.strengths || [];
        const challenges = psychology.challenges || [];
        const forecast = data.forecast || {};

        const activeHouses = (houses || []).filter(h => h.planets?.length > 0);
        const topAspects = (aspects || []).slice(0, 8);

        return `🌟 **АСТРОПСИХОЛОГИЧЕСКИЙ ПОРТРЕТ (ПОЛНЫЙ АНАЛИЗ)**

**АСЦЕНДЕНТ (${data.ascendant?.sign || '—'})**
${data.ascendant?.description || '—'}

**СОЛНЦЕ (${data.sun?.sign || '—'})**
${data.sun?.description || '—'}

**ЛУНА (${data.moon?.sign || '—'})**
${data.moon?.description || '—'}

**ПЛАНЕТЫ В ЗНАКАХ**
${data.planets?.map(p => `• ${p.symbol || ''} ${p.name}: ${p.sign || '—'} ${p.degree || ''}°`).join('\n') || '• —'}

**ПСИХОЛОГИЧЕСКИЙ АНАЛИЗ**

**ЭГО (Солнце в ${planets.sun?.sign || '—'}):**
${psychology.ego || '—'}

**ЭМОЦИИ (Луна в ${planets.moon?.sign || '—'}):**
${psychology.emotions || '—'}

**ЛИЧНОСТЬ (Асцендент в ${data.ascendant?.sign || '—'}):**
${psychology.personality || '—'}

**СТИЛЬ МЫШЛЕНИЯ (Меркурий в ${planets.mercury?.sign || '—'}):**
${psychology.thinkingStyle || '—'}

**ЭМОЦИОНАЛЬНЫЕ ПОТРЕБНОСТИ (Луна в ${planets.moon?.sign || '—'}):**
${psychology.emotionalNeeds || '—'}

**ТЕНЕВЫЕ АСПЕКТЫ (Плутон в ${planets.pluto?.sign || '—'}):**
${psychology.shadowAspects || '—'}

**ЖИЗНЕННАЯ МИССИЯ (Солнце в ${planets.sun?.sign || '—'}):**
${psychology.lifePurpose || '—'}

**СИЛЬНЫЕ СТОРОНЫ**
${strengths.map(s => `• ${s}`).join('\n') || '• —'}

**ЗОНЫ РОСТА**
${challenges.map(c => `• ${c}`).join('\n') || '• —'}

**КЛЮЧЕВЫЕ АСПЕКТЫ**
${topAspects.map(a => `• ${a.planet1} — ${a.planet2}: ${a.description || '—'}`).join('\n') || '• —'}

**ДОМА С ПЛАНЕТАМИ**
${activeHouses.map(h => `• ${h.number} дом (${h.description || '—'}): ${h.planets?.join(', ') || '—'}`).join('\n') || '• —'}

**ПРОГНОЗ**
💼 Карьера: ${forecast.career || '—'}
❤️ Любовь: ${forecast.love || '—'}
🌿 Здоровье: ${forecast.health || '—'}
✨ Общий: ${forecast.general || '—'}

${forecast.week ? `**НЕДЕЛЬНЫЙ ПРОГНОЗ**\n${forecast.week}` : ''}
${forecast.month ? `**МЕСЯЧНЫЙ ПРОГНОЗ**\n${forecast.month}` : ''}
${forecast.year ? `**ГОДОВОЙ ПРОГНОЗ**\n${forecast.year}` : ''}

${question ? `**ОТВЕТ НА ВАШ ВОПРОС**\n${question}\n${data.relationship?.advice || 'В вашей ситуации важно доверять интуиции.'}` : ''}

**СОВЕТ**
Интегрируйте свою солнечную и лунную природу для целостности. ${psychology.integration || 'Будьте собой.'}`;
    }

    generatePremiumInterpretation(data, planets, houses, aspects, question) {
        const psychology = data.psychology || {};
        const strengths = psychology.strengths || [];
        const challenges = psychology.challenges || [];
        const forecast = data.forecast || {};
        const karma = data.karma || {};

        const activeHouses = (houses || []).filter(h => h.planets?.length > 0);

        return `🌟 **АСТРОПСИХОЛОГИЧЕСКИЙ ПОРТРЕТ (ПРЕМИУМ)**

**АСЦЕНДЕНТ (${data.ascendant?.sign || '—'})**
${data.ascendant?.description || '—'}

**СОЛНЦЕ (${data.sun?.sign || '—'})**
${data.sun?.description || '—'}

**ЛУНА (${data.moon?.sign || '—'})**
${data.moon?.description || '—'}

**ПЛАНЕТЫ В ЗНАКАХ**
${data.planets?.map(p => `• ${p.symbol || ''} ${p.name}: ${p.sign || '—'} ${p.degree || ''}°`).join('\n') || '• —'}

**ПСИХОЛОГИЧЕСКИЙ ПОРТРЕТ**

**ЭГО (Солнце в ${planets.sun?.sign || '—'}):**
${psychology.ego || '—'}

**ЭМОЦИИ (Луна в ${planets.moon?.sign || '—'}):**
${psychology.emotions || '—'}

**ЛИЧНОСТЬ (Асцендент в ${data.ascendant?.sign || '—'}):**
${psychology.personality || '—'}

**СТИЛЬ МЫШЛЕНИЯ (Меркурий в ${planets.mercury?.sign || '—'}):**
${psychology.thinkingStyle || '—'}

**ЭМОЦИОНАЛЬНЫЕ ПОТРЕБНОСТИ (Луна в ${planets.moon?.sign || '—'}):**
${psychology.emotionalNeeds || '—'}

**ТЕНЕВЫЕ АСПЕКТЫ (Плутон в ${planets.pluto?.sign || '—'}):**
${psychology.shadowAspects || '—'}

**ЖИЗНЕННАЯ МИССИЯ (Солнце в ${planets.sun?.sign || '—'}):**
${psychology.lifePurpose || '—'}

**АРХЕТИПЫ ЛИЧНОСТИ**
${psychology.archetypes || '—'}

**СИЛЬНЫЕ СТОРОНЫ**
${strengths.map(s => `• ${s}`).join('\n') || '• —'}

**ЗОНЫ РОСТА**
${challenges.map(c => `• ${c}`).join('\n') || '• —'}

**ПУТЬ РАЗВИТИЯ**
${psychology.growthPath || '—'}

**КАРМИЧЕСКИЙ АНАЛИЗ**

**Уроки прошлых жизней:**
${karma.pastLifeLessons || '—'}

**Задача текущего воплощения:**
${karma.currentTask || '—'}

**Главный кармический урок:**
${karma.saturnLesson || '—'}

**ПОДСОЗНАТЕЛЬНЫЕ ПАТТЕРНЫ**
${psychology.subconsciousPatterns || '—'}

**КЛЮЧЕВЫЕ АСПЕКТЫ**
${(aspects || []).slice(0, 10).map(a => `• ${a.planet1} — ${a.planet2}: ${a.description || '—'}`).join('\n') || '• —'}

**ДОМА С ПЛАНЕТАМИ**
${activeHouses.map(h => `• ${h.number} дом (${h.description || '—'}): ${h.planets?.join(', ') || '—'}`).join('\n') || '• —'}

**ПРОГНОЗ**
💼 Карьера: ${forecast.career || '—'}
❤️ Любовь: ${forecast.love || '—'}
🌿 Здоровье: ${forecast.health || '—'}
✨ Общий: ${forecast.general || '—'}

${forecast.week ? `**НЕДЕЛЬНЫЙ ПРОГНОЗ**\n${forecast.week}` : ''}
${forecast.month ? `**МЕСЯЧНЫЙ ПРОГНОЗ**\n${forecast.month}` : ''}
${forecast.year ? `**ГОДОВОЙ ПРОГНОЗ**\n${forecast.year}` : ''}
${data.transits ? `**ТРАНЗИТНЫЙ ПРОГНОЗ (3 МЕСЯЦА)**\n${data.transits}` : ''}

${forecast.auspiciousDates ? `**БЛАГОПРИЯТНЫЕ ДАТЫ**\n${forecast.auspiciousDates}` : ''}
${forecast.warnings?.length ? `**ПРЕДОСТЕРЕЖЕНИЯ**\n${forecast.warnings.map(w => `• ${w}`).join('\n')}` : ''}

**АФФИРМАЦИЯ ДНЯ**
"${forecast.affirmations || 'Я доверяю себе и своему пути.'}"

**ПЕРСОНАЛЬНЫЕ РЕКОМЕНДАЦИИ**
${(data.recommendations || []).map(r => `• ${r}`).join('\n') || '• Следуйте за своей интуицией\n• Доверяйте процессу жизни'}

${question ? `**ОТВЕТ НА ВАШ ВОПРОС**\n"${question}"\n${data.relationship?.advice || 'В вашей ситуации важно доверять интуиции.'}` : ''}

**СОВЕТ АСТРОПСИХОЛОГА**
${psychology.integration || 'Примите все части себя. Ваша уникальность — ваша сила.'}

*Звезды указывают направление, но выбор пути всегда за вами.*`;
    }



    // ========== PDF ГЕНЕРАЦИЯ ==========

    async generatePdf(calculation) {
        try {
            const data = calculation.result;
            const html = this.generatePdfHtml(data);
            const puppeteer = require('puppeteer');
            const browser = await puppeteer.launch({
                headless: 'new',
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            const page = await browser.newPage();
            await page.setContent(html, { waitUntil: 'networkidle0' });
            const pdf = await page.pdf({
                format: 'A4',
                printBackground: true,
                margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' }
            });
            await browser.close();
            return pdf;
        } catch (error) {
            console.error('Error generating PDF:', error);
            throw error;
        }
    }

    generatePdfHtml(data) {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Астропсихологический портрет - ${data.fullName}</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: 'Times New Roman', Times, serif; background: #fff; color: #000; line-height: 1.5; }
                .container { max-width: 180mm; margin: 0 auto; padding: 20px; }
                .title-page { text-align: center; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; }
                .title-page h1 { font-size: 28pt; margin-bottom: 10mm; }
                .section { margin: 10mm 0; }
                .section-title { font-size: 18pt; font-weight: bold; border-bottom: 1px solid #000; margin-bottom: 5mm; }
                .subsection-title { font-size: 14pt; font-weight: bold; margin: 5mm 0 3mm 0; }
                table { width: 100%; border-collapse: collapse; margin: 5mm 0; }
                th, td { border: 1px solid #000; padding: 3mm; text-align: left; }
                th { background: #f0f0f0; }
                .footer { margin-top: 10mm; text-align: right; font-size: 10pt; color: #666; }
                .planet-list { display: grid; grid-template-columns: repeat(2, 1fr); gap: 5mm; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="title-page">
                    <h1>АЛГОРИТМ СУДЬБЫ</h1>
                    <h2>Астропсихологический портрет</h2>
                    <div class="name">${data.fullName || '—'}</div>
                    <div class="date">Дата рождения: ${data.birthData?.date || '—'} в ${data.birthData?.time || '—'}</div>
                </div>
                
                <div class="section">
                    <div class="section-title">АСЦЕНДЕНТ</div>
                    <p><strong>${data.ascendant?.sign || '—'}</strong> ${data.ascendant?.degree || ''}°</p>
                    <p>${data.ascendant?.description || ''}</p>
                </div>
                
                <div class="section">
                    <div class="section-title">СОЛНЦЕ (Сущность)</div>
                    <p><strong>${data.sun?.sign || '—'}</strong> ${data.sun?.degree || ''}°</p>
                    <p>${data.sun?.description || ''}</p>
                </div>
                
                <div class="section">
                    <div class="section-title">ЛУНА (Душа)</div>
                    <p><strong>${data.moon?.sign || '—'}</strong> ${data.moon?.degree || ''}°</p>
                    <p>${data.moon?.description || ''}</p>
                </div>
                
                <div class="section">
                    <div class="section-title">ПЛАНЕТЫ В ЗНАКАХ</div>
                    <div class="planet-list">
                        ${data.planets?.map(p => `<div><strong>${p.symbol || ''} ${p.name || ''}</strong> в ${p.sign || '—'} ${p.degree || ''}°</div>`).join('') || '<div>—</div>'}
                    </div>
                </div>
                
                <div class="section">
                    <div class="section-title">ПСИХОЛОГИЧЕСКИЙ ПОРТРЕТ</div>
                    <p><strong>Эго:</strong> ${data.psychology?.ego || ''}</p>
                    <p><strong>Эмоции:</strong> ${data.psychology?.emotions || ''}</p>
                    <p><strong>Личность:</strong> ${data.psychology?.personality || ''}</p>
                </div>
                
                <div class="section">
                    <div class="section-title">СИЛЬНЫЕ СТОРОНЫ</div>
                    <ul>
                        ${data.psychology?.strengths?.map(s => `<li>${s}</li>`).join('') || '<li>—</li>'}
                    </ul>
                </div>
                
                <div class="section">
                    <div class="section-title">ЗОНЫ РОСТА</div>
                    <ul>
                        ${data.psychology?.challenges?.map(c => `<li>${c}</li>`).join('') || '<li>—</li>'}
                    </ul>
                </div>
                
                <div class="footer">
                    <p>© 2026 АЛГОРИТМ СУДЬБЫ. Все права защищены.</p>
                </div>
            </div>
        </body>
        </html>
        `;
    }
}

module.exports = AstropsychologyService;