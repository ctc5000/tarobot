// astropsychologyService.js
const NatalChartSimpleService = require('./natalChartSimpleService');

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

        this.aspects = {
            conjunction: { name: 'Соединение', degrees: 0, orb: 10, meaning: 'Слияние энергий, усиление' },
            opposition: { name: 'Оппозиция', degrees: 180, orb: 8, meaning: 'Противостояние, напряжение, выбор' },
            trine: { name: 'Трин', degrees: 120, orb: 8, meaning: 'Гармония, легкость, талант' },
            square: { name: 'Квадратура', degrees: 90, orb: 8, meaning: 'Напряжение, конфликт, развитие' },
            sextile: { name: 'Секстиль', degrees: 60, orb: 6, meaning: 'Возможность, дружба, потенциал' }
        };

        this.houses = [
            { number: 1, name: 'Дом личности', area: 'Внешность, характер, начало' },
            { number: 2, name: 'Дом финансов', area: 'Деньги, ресурсы, самооценка' },
            { number: 3, name: 'Дом коммуникации', area: 'Общение, обучение, братья/сестры' },
            { number: 4, name: 'Дом семьи', area: 'Дом, семья, корни, прошлое' },
            { number: 5, name: 'Дом творчества', area: 'Любовь, дети, хобби, творчество' },
            { number: 6, name: 'Дом здоровья', area: 'Работа, здоровье, служение' },
            { number: 7, name: 'Дом партнерства', area: 'Брак, партнеры, отношения' },
            { number: 8, name: 'Дом трансформации', area: 'Кризисы, секс, чужие деньги' },
            { number: 9, name: 'Дом мудрости', area: 'Путешествия, философия, высшее образование' },
            { number: 10, name: 'Дом карьеры', area: 'Карьера, призвание, авторитет' },
            { number: 11, name: 'Дом друзей', area: 'Друзья, единомышленники, надежды' },
            { number: 12, name: 'Дом тайн', area: 'Подсознание, тайны, изоляция' }
        ];
    }

    calculate(data) {
        try {
            const { fullName, birthDate, birthTime, birthPlace, question, latitude, longitude } = data;

            console.log('Астропсихология расчет для:', { fullName, birthDate, birthTime, birthPlace, latitude, longitude });

            // Используем сервис натальной карты для расчета с переданными координатами
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

            // Используем данные из обогащенного ответа натальной карты
            const ascendantData = chartData.ascendant || {};
            const planetsData = chartData.planets || {};

            // Получаем знаки для основных планет
            const sunSign = planetsData.sun?.sign || this.getSignFromLongitude(planetsData.sun?.longitude);
            const moonSign = planetsData.moon?.sign || this.getSignFromLongitude(planetsData.moon?.longitude);
            const ascendantSign = ascendantData.sign || this.getSignFromLongitude(ascendantData.degree || 0);

            // Форматируем планеты для отображения
            const planets = this.formatPlanetsFromNatal(planetsData);

            // Психологический портрет на основе астрологии
            const psychology = this.getAstroPsychology(
                planetsData,
                {
                    sign: ascendantSign,
                    degree: ascendantData.degreeInSign || (ascendantData.degree % 30).toFixed(1)
                }
            );

            // Прогноз на текущий период
            const forecast = this.getForecast(planetsData);

            // Анализ отношений (если есть запрос)
            const relationship = question ? this.analyzeRelationship(planetsData, question) : null;

            return {
                success: true,
                data: {
                    fullName: fullName,
                    birthData: {
                        date: birthDate,
                        time: birthTime || '12:00',
                        place: birthPlace || 'не указано'
                    },
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
                    },
                    planets: planets,
                    psychology,
                    forecast,
                    relationship,
                    question: question || 'Самопознание',
                    interpretation: this.generateInterpretation(
                        chartData,
                        sunSign,
                        moonSign,
                        ascendantSign,
                        psychology,
                        forecast,
                        question
                    )
                }
            };
        } catch (error) {
            console.error('Ошибка в AstropsychologyService:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    getSignFromLongitude(longitude) {
        if (longitude === undefined) return 'Неизвестно';

        const signs = ['Овен', 'Телец', 'Близнецы', 'Рак', 'Лев', 'Дева',
            'Весы', 'Скорпион', 'Стрелец', 'Козерог', 'Водолей', 'Рыбы'];
        const index = Math.floor(longitude / 30) % 12;
        return signs[index];
    }

    formatPlanetsFromNatal(planetPositions) {
        const result = [];
        const planetMap = {
            sun: 'sun',
            moon: 'moon',
            mercury: 'mercury',
            venus: 'venus',
            mars: 'mars',
            jupiter: 'jupiter',
            saturn: 'saturn',
            uranus: 'uranus',
            neptune: 'neptune',
            pluto: 'pluto'
        };

        Object.entries(planetMap).forEach(([key, planetKey]) => {
            const planetData = planetPositions[planetKey];
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
            'Козерог': 'Вы кажетесь ответственным, серьезным, амбициозным. Люди воспринимают вас как зрелого человека.',
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

    getAstroPsychology(planets, ascendant) {
        const sunSign = planets.sun?.sign || this.getSignFromLongitude(planets.sun?.longitude);
        const moonSign = planets.moon?.sign || this.getSignFromLongitude(planets.moon?.longitude);

        return {
            ego: `Ваше эго (Солнце в ${sunSign}) проявляется как ${this.getSunDescription(sunSign).toLowerCase()}`,
            emotions: `Ваши эмоции (Луна в ${moonSign}) ${this.getMoonDescription(moonSign).toLowerCase()}`,
            personality: `Ваша личность (Асцендент в ${ascendant.sign}) ${this.getAscendantDescription(ascendant.sign).toLowerCase()}`,
            strengths: this.getStrengths(planets),
            challenges: this.getChallenges(planets),
            growthPath: this.getGrowthPath(planets)
        };
    }

    getStrengths(planets) {
        const strengths = [];
        const sunSign = planets.sun?.sign || this.getSignFromLongitude(planets.sun?.longitude);
        const moonSign = planets.moon?.sign || this.getSignFromLongitude(planets.moon?.longitude);
        const marsSign = planets.mars?.sign || this.getSignFromLongitude(planets.mars?.longitude);
        const venusSign = planets.venus?.sign || this.getSignFromLongitude(planets.venus?.longitude);

        if (sunSign === 'Лев' || sunSign === 'Овен')
            strengths.push('Сильная воля и инициативность');
        if (moonSign === 'Рак' || moonSign === 'Рыбы')
            strengths.push('Глубокая эмпатия и интуиция');
        if (['Близнецы', 'Дева'].includes(planets.mercury?.sign || this.getSignFromLongitude(planets.mercury?.longitude)))
            strengths.push('Острый ум и коммуникабельность');
        if (venusSign === 'Телец' || venusSign === 'Весы')
            strengths.push('Художественный вкус и дипломатичность');
        if (marsSign === 'Овен' || marsSign === 'Скорпион')
            strengths.push('Энергия и страстность');

        if (strengths.length < 3) {
            strengths.push('Способность к трансформации');
            strengths.push('Внутренняя мудрость');
        }

        return strengths.slice(0, 4);
    }

    getChallenges(planets) {
        const challenges = [];
        const saturnSign = planets.saturn?.sign || this.getSignFromLongitude(planets.saturn?.longitude);
        const marsSign = planets.mars?.sign || this.getSignFromLongitude(planets.mars?.longitude);
        const venusSign = planets.venus?.sign || this.getSignFromLongitude(planets.venus?.longitude);

        if (saturnSign === 'Козерог' || saturnSign === 'Водолей')
            challenges.push('Склонность к самокритике и ограничениям');
        if (marsSign === 'Рак')
            challenges.push('Эмоциональная нестабильность и обидчивость');
        if (venusSign === 'Скорпион')
            challenges.push('Ревность и страстность, требующая контроля');

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

    getForecast(planets) {
        const now = new Date();
        const dayOfYear = this.getDayOfYear(now);
        const moonSign = planets.moon?.sign || this.getSignFromLongitude(planets.moon?.longitude);
        const venusSign = planets.venus?.sign || this.getSignFromLongitude(planets.venus?.longitude);
        const marsSign = planets.mars?.sign || this.getSignFromLongitude(planets.mars?.longitude);

        return {
            general: dayOfYear % 2 === 0 ? 'Благоприятный день для начинаний' : 'День для завершения и отдыха',
            love: venusSign === 'Весы' ? 'Время для романтики' : 'Отношения требуют внимания',
            career: marsSign === 'Козерог' ? 'Карьерный рост' : 'Время планирования',
            health: moonSign === 'Рак' ? 'Обратите внимание на питание' : 'Энергия в норме'
        };
    }

    analyzeRelationship(planets, question) {
        const venusSign = planets.venus?.sign || this.getSignFromLongitude(planets.venus?.longitude);
        const marsSign = planets.mars?.sign || this.getSignFromLongitude(planets.mars?.longitude);

        const compatibility = venusSign === marsSign ? 85 :
            venusSign && marsSign ? 65 : 50;

        return {
            compatibility,
            advice: 'В отношениях важно сохранять баланс между давать и брать. Слушайте не только слова, но и чувства.',
            challenge: 'Научитесь говорить о своих потребностях, не боясь быть отвергнутым.',
            opportunity: 'Этот период благоприятен для углубления эмоциональной связи.'
        };
    }

    getDayOfYear(date) {
        const start = new Date(date.getFullYear(), 0, 0);
        const diff = date - start;
        const oneDay = 1000 * 60 * 60 * 24;
        return Math.floor(diff / oneDay);
    }

    generateInterpretation(chartData, sunSign, moonSign, ascendantSign, psychology, forecast, question) {
        const planets = chartData.planets || {};

        return `
🌞 **АСТРОПСИХОЛОГИЧЕСКИЙ ПОРТРЕТ** 🌞

**АСЦЕНДЕНТ (МАСКА)**
${ascendantSign} ${(chartData.ascendant?.degreeInSign || (chartData.ascendant?.degree % 30) || 0).toFixed(1)}°
${this.getAscendantDescription(ascendantSign)}

**СОЛНЦЕ (СУЩНОСТЬ)**
${sunSign} ${(planets.sun?.degreeInSign || planets.sun?.longitude % 30 || 0).toFixed(1)}°
${this.getSunDescription(sunSign)}

**ЛУНА (ДУША)**
${moonSign} ${(planets.moon?.degreeInSign || planets.moon?.longitude % 30 || 0).toFixed(1)}°
${this.getMoonDescription(moonSign)}

**ПЛАНЕТЫ В ЗНАКАХ**

${planets.mercury ? `• ☿ Меркурий в ${planets.mercury.sign || this.getSignFromLongitude(planets.mercury.longitude)} ${(planets.mercury.degreeInSign || planets.mercury.longitude % 30).toFixed(1)}° — ${this.planets.mercury.role}` : ''}
${planets.venus ? `• ♀ Венера в ${planets.venus.sign || this.getSignFromLongitude(planets.venus.longitude)} ${(planets.venus.degreeInSign || planets.venus.longitude % 30).toFixed(1)}° — ${this.planets.venus.role}` : ''}
${planets.mars ? `• ♂ Марс в ${planets.mars.sign || this.getSignFromLongitude(planets.mars.longitude)} ${(planets.mars.degreeInSign || planets.mars.longitude % 30).toFixed(1)}° — ${this.planets.mars.role}` : ''}
${planets.jupiter ? `• ♃ Юпитер в ${planets.jupiter.sign || this.getSignFromLongitude(planets.jupiter.longitude)} ${(planets.jupiter.degreeInSign || planets.jupiter.longitude % 30).toFixed(1)}° — ${this.planets.jupiter.role}` : ''}
${planets.saturn ? `• ♄ Сатурн в ${planets.saturn.sign || this.getSignFromLongitude(planets.saturn.longitude)} ${(planets.saturn.degreeInSign || planets.saturn.longitude % 30).toFixed(1)}° — ${this.planets.saturn.role}` : ''}

**ПСИХОЛОГИЧЕСКИЙ АНАЛИЗ**

${psychology.ego}
${psychology.emotions}
${psychology.personality}

**СИЛЬНЫЕ СТОРОНЫ**
${psychology.strengths.map(s => `• ${s}`).join('\n')}

**ЗОНЫ РОСТА**
${psychology.challenges.map(c => `• ${c}`).join('\n')}

**ПУТЬ РАЗВИТИЯ**
${psychology.growthPath}

**КРАТКОСРОЧНЫЙ ПРОГНОЗ**

💼 Карьера: ${forecast.career}
❤️ Любовь: ${forecast.love}
🌿 Здоровье: ${forecast.health}
✨ Общий: ${forecast.general}

**СОВЕТ АСТРОПСИХОЛОГА**

Помните: звезды склоняют, но не обязывают. Ваша натальная карта — это карта местности, но маршрут вы выбираете сами. 
Астропсихология помогает понять свои глубинные мотивы, но выбор всегда за вами.

${question ? `**ОТВЕТ НА ВАШ ВОПРОС О "${question.toUpperCase()}"**\n\nВ вашей ситуации важно учитывать, что ${sunSign} интуитивно чувствует правильное решение. Доверьтесь себе, но проверяйте реальностью.` : ''}
        `;
    }
}

module.exports = AstropsychologyService;