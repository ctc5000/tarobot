// modules/Astropsychology/Services/AstropsychologyService.js
const NatalChartSimpleService = require('../../../services/natalChartSimpleService');
const { models } = require('../../../sequelize');

class AstropsychologyService {
    constructor() {
        this.natalChartService = new NatalChartSimpleService();
        this.signsMap = null;
        this.planetsMap = null;
        this.housesMap = null;
    }

    async loadSigns() {
        if (!this.signsMap) {
            const signs = await models.AstropsychologySign.findAll({
                order: [['sort_order', 'ASC']]
            });
            this.signsMap = new Map();
            signs.forEach(sign => {
                this.signsMap.set(sign.code, sign);
            });
        }
        return this.signsMap;
    }

    async loadPlanets() {
        if (!this.planetsMap) {
            const planets = await models.AstropsychologyPlanet.findAll({
                order: [['sort_order', 'ASC']]
            });
            this.planetsMap = new Map();
            planets.forEach(planet => {
                this.planetsMap.set(planet.code, planet);
            });
        }
        return this.planetsMap;
    }

    async loadHouses() {
        if (!this.housesMap) {
            const houses = await models.AstropsychologyHouse.findAll({
                order: [['number', 'ASC']]
            });
            this.housesMap = new Map();
            houses.forEach(house => {
                this.housesMap.set(house.number, house);
            });
        }
        return this.housesMap;
    }

    getSignFromLongitude(longitude) {
        if (longitude === undefined || longitude === null || isNaN(longitude)) return null;
        const index = Math.floor(longitude / 30) % 12;
        const signs = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
        return signs[index];
    }

    getSignNameByCode(code) {
        if (!code || !this.signsMap) return '—';
        const sign = this.signsMap.get(code);
        return sign ? sign.name_ru : '—';
    }

    getSignDescription(code, type) {
        if (!code || !this.signsMap) return '—';
        const sign = this.signsMap.get(code);
        if (!sign) return '—';

        if (type === 'ascendant') return sign.ascendant_description || '—';
        if (type === 'sun') return sign.sun_description || '—';
        if (type === 'moon') return sign.moon_description || '—';
        return sign.description || '—';
    }

    async formatAllPlanets(planetsData) {
        await this.loadPlanets();
        await this.loadSigns();

        const result = [];
        const planetCodes = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];

        for (const code of planetCodes) {
            const planetData = planetsData[code];
            if (planetData && planetData.longitude !== undefined) {
                const planet = this.planetsMap.get(code);
                if (!planet) continue;

                const signCode = this.getSignFromLongitude(planetData.longitude);
                const signName = this.getSignNameByCode(signCode);

                result.push({
                    code: code,
                    name: planet.name_ru,
                    symbol: planet.symbol,
                    sign: signName,
                    signCode: signCode || '—',
                    degree: (planetData.longitude % 30).toFixed(1),
                    longitude: planetData.longitude,
                    meaning: planet.meaning,
                    role: planet.role
                });
            }
        }

        return result;
    }

    async formatHouses(housesData, planetsData) {
        await this.loadHouses();
        await this.loadSigns();

        const result = [];

        for (let i = 0; i < housesData.length; i++) {
            const houseData = housesData[i];
            const house = this.housesMap.get(houseData.number);
            if (!house) continue;

            const signCode = this.getSignFromLongitude(houseData.cusp);
            const signName = this.getSignNameByCode(signCode);

            // Находим планеты в этом доме
            const planetsInHouse = [];
            for (const [code, planet] of Object.entries(planetsData)) {
                if (planet && planet.longitude !== undefined) {
                    const houseNum = Math.floor(planet.longitude / 30) + 1;
                    if (houseNum === houseData.number) {
                        const planetInfo = this.planetsMap.get(code);
                        if (planetInfo) planetsInHouse.push(planetInfo.name_ru);
                    }
                }
            }

            result.push({
                number: house.number,
                name: house.name_ru,
                sign: signName,
                signCode: signCode || '—',
                cusp: houseData.cusp,
                description: house.description,
                area: house.area,
                keywords: house.keywords,
                planets: planetsInHouse
            });
        }

        return result;
    }

    async formatAspects(aspectsData) {
        const result = [];

        for (const aspect of aspectsData.slice(0, 20)) {
            result.push({
                planet1: aspect.planet1,
                planet2: aspect.planet2,
                type: aspect.type,
                name: this.getAspectName(aspect.type),
                orb: aspect.orb,
                description: aspect.description || `${aspect.planet1} — ${aspect.planet2}`,
                nature: this.getAspectNature(aspect.type),
                color: this.getAspectColor(aspect.type)
            });
        }

        return result;
    }

    getAspectName(type) {
        const names = {
            conjunction: 'Соединение',
            opposition: 'Оппозиция',
            trine: 'Трин',
            square: 'Квадрат',
            sextile: 'Секстиль',
            quincunx: 'Квиконс',
            semisextile: 'Полусекстиль'
        };
        return names[type] || type;
    }

    getAspectNature(type) {
        const natures = {
            conjunction: 'neutral',
            opposition: 'challenging',
            trine: 'harmonious',
            square: 'challenging',
            sextile: 'harmonious',
            quincunx: 'challenging',
            semisextile: 'neutral'
        };
        return natures[type] || 'neutral';
    }

    getAspectColor(type) {
        const colors = {
            conjunction: '#ff4d4d',
            opposition: '#4d4dff',
            trine: '#4dff4d',
            square: '#ff4dff',
            sextile: '#ffff4d',
            quincunx: '#ffaa66',
            semisextile: '#66aaff'
        };
        return colors[type] || '#ffffff';
    }

    async buildPsychology(sunSignCode, moonSignCode, ascendantSignCode, planetsData) {
        await this.loadSigns();

        const sunSign = this.signsMap.get(sunSignCode);
        const moonSign = this.signsMap.get(moonSignCode);
        const ascendantSign = this.signsMap.get(ascendantSignCode);

        // Получаем знаки планет
        const mercuryLongitude = planetsData.mercury?.longitude;
        const venusLongitude = planetsData.venus?.longitude;
        const marsLongitude = planetsData.mars?.longitude;
        const plutoLongitude = planetsData.pluto?.longitude;

        const mercurySignCode = mercuryLongitude ? this.getSignFromLongitude(mercuryLongitude) : null;
        const venusSignCode = venusLongitude ? this.getSignFromLongitude(venusLongitude) : null;
        const marsSignCode = marsLongitude ? this.getSignFromLongitude(marsLongitude) : null;
        const plutoSignCode = plutoLongitude ? this.getSignFromLongitude(plutoLongitude) : null;

        const mercurySign = this.signsMap.get(mercurySignCode);
        const venusSign = this.signsMap.get(venusSignCode);
        const marsSign = this.signsMap.get(marsSignCode);
        const plutoSign = this.signsMap.get(plutoSignCode);

        // Получаем психологические характеристики
        const strengths = await this.getStrengthsFromDB(sunSignCode);
        const challenges = await this.getChallengesFromDB(sunSignCode);
        const growthPath = await this.getGrowthPathFromDB(sunSignCode);
        const communicationStyle = await this.getCommunicationStyleFromDB(mercurySignCode);
        const loveStyle = await this.getLoveStyleFromDB(venusSignCode);
        const thinkingStyle = await this.getThinkingStyleFromDB(mercurySignCode);

        return {
            ego: sunSign ? `Ваше эго (Солнце в ${sunSign.name_ru}) проявляется как ${sunSign.sun_description || '—'}` : '—',
            emotions: moonSign ? `Ваши эмоции (Луна в ${moonSign.name_ru}) ${moonSign.moon_description || '—'}` : '—',
            personality: ascendantSign ? `Ваша личность (Асцендент в ${ascendantSign.name_ru}) ${ascendantSign.ascendant_description || '—'}` : '—',
            strengths: strengths.length > 0 ? strengths : ['Внутренняя сила', 'Способность к адаптации'],
            challenges: challenges.length > 0 ? challenges : ['Умение балансировать между разумом и чувствами'],
            growthPath: growthPath,
            communicationStyle: communicationStyle,
            loveStyle: loveStyle,
            thinkingStyle: thinkingStyle,
            emotionalNeeds: this.getEmotionalNeedsBySign(moonSignCode),
            shadowAspects: this.getShadowAspectsBySign(plutoSignCode),
            lifePurpose: this.getLifePurposeBySign(sunSignCode)
        };
    }

    async getStrengthsFromDB(signCode) {
        if (!signCode) return [];
        const traits = await models.AstropsychologyPsychologicalTrait.findAll({
            where: { category: 'strength', sign_code: signCode }
        });
        return traits.map(t => t.description);
    }

    async getChallengesFromDB(signCode) {
        if (!signCode) return [];
        const traits = await models.AstropsychologyPsychologicalTrait.findAll({
            where: { category: 'challenge', sign_code: signCode }
        });
        return traits.map(t => t.description);
    }

    async getGrowthPathFromDB(signCode) {
        if (!signCode) return 'Развивайте осознанность и доверяйте своей интуиции.';
        const trait = await models.AstropsychologyPsychologicalTrait.findOne({
            where: { category: 'growth_path', sign_code: signCode }
        });
        return trait ? trait.description : 'Развивайте осознанность и доверяйте своей интуиции.';
    }

    async getCommunicationStyleFromDB(signCode) {
        if (!signCode) return 'У вас уникальный стиль общения.';
        const trait = await models.AstropsychologyPsychologicalTrait.findOne({
            where: { category: 'communication_style', sign_code: signCode }
        });
        return trait ? trait.description : 'У вас уникальный стиль общения.';
    }

    async getLoveStyleFromDB(signCode) {
        if (!signCode) return 'У вас уникальный стиль любви.';
        const trait = await models.AstropsychologyPsychologicalTrait.findOne({
            where: { category: 'love_style', sign_code: signCode }
        });
        return trait ? trait.description : 'У вас уникальный стиль любви.';
    }

    async getThinkingStyleFromDB(signCode) {
        if (!signCode) return 'У вас уникальный стиль мышления.';
        const trait = await models.AstropsychologyPsychologicalTrait.findOne({
            where: { category: 'communication_style', sign_code: signCode }
        });
        return trait ? trait.description : 'У вас уникальный стиль мышления.';
    }

    getEmotionalNeedsBySign(signCode) {
        const needs = {
            aries: 'Вам нужно чувствовать себя независимым и иметь пространство для самовыражения.',
            taurus: 'Вам нужна стабильность, комфорт и физическая безопасность.',
            gemini: 'Вам нужно общение, новая информация и интеллектуальная стимуляция.',
            cancer: 'Вам нужна эмоциональная безопасность, забота и дом.',
            leo: 'Вам нужно признание, восхищение и творческое самовыражение.',
            virgo: 'Вам нужен порядок, чистота и чувство полезности.',
            libra: 'Вам нужна гармония, красота и партнерство.',
            scorpio: 'Вам нужна глубокая эмоциональная связь и возможность трансформации.',
            sagittarius: 'Вам нужна свобода, приключения и философский смысл.',
            capricorn: 'Вам нужен статус, достижения и уважение.',
            aquarius: 'Вам нужна свобода, независимость и интеллектуальная дружба.',
            pisces: 'Вам нужно творчество, уединение и духовная связь.'
        };
        return needs[signCode] || 'У вас уникальные эмоциональные потребности';
    }

    getShadowAspectsBySign(signCode) {
        const shadows = {
            aries: 'Импульсивность и агрессивность',
            taurus: 'Упрямство и материализм',
            gemini: 'Поверхностность и непостоянство',
            cancer: 'Эмоциональная зависимость',
            leo: 'Эгоцентризм и тщеславие',
            virgo: 'Перфекционизм и самокритика',
            libra: 'Неумение принимать решения',
            scorpio: 'Склонность к контролю и ревности',
            sagittarius: 'Безответственность и нетерпеливость',
            capricorn: 'Черствость и трудоголизм',
            aquarius: 'Отстраненность и эксцентричность',
            pisces: 'Эскапизм и самообман'
        };
        return shadows[signCode] || 'Скрытые тенденции, требующие осознания';
    }

    getLifePurposeBySign(signCode) {
        const purposes = {
            aries: 'Научиться действовать самостоятельно, проявлять инициативу.',
            taurus: 'Научиться ценить себя и создавать устойчивую ценность.',
            gemini: 'Научиться коммуникации и обмену информацией.',
            cancer: 'Научиться заботиться о себе и создавать эмоциональную безопасность.',
            leo: 'Научиться творческому самовыражению и лидерству.',
            virgo: 'Научиться служить и совершенствовать.',
            libra: 'Научиться строить гармоничные отношения.',
            scorpio: 'Научиться трансформации и глубокому познанию.',
            sagittarius: 'Научиться искать смысл и расширять горизонты.',
            capricorn: 'Научиться ответственности и достижению целей.',
            aquarius: 'Научиться быть уникальным и вносить вклад в общество.',
            pisces: 'Научиться доверять интуиции и соединяться с высшим.'
        };
        return purposes[signCode] || 'Раскрыть свой уникальный потенциал';
    }

    async buildForecast(planetsData, type = 'basic') {
        const now = new Date();
        const dayOfYear = this.getDayOfYear(now);

        const sunLongitude = planetsData.sun?.longitude;
        const moonLongitude = planetsData.moon?.longitude;
        const mercuryLongitude = planetsData.mercury?.longitude;
        const venusLongitude = planetsData.venus?.longitude;
        const marsLongitude = planetsData.mars?.longitude;
        const jupiterLongitude = planetsData.jupiter?.longitude;
        const saturnLongitude = planetsData.saturn?.longitude;
        const uranusLongitude = planetsData.uranus?.longitude;

        const sunSignCode = sunLongitude ? this.getSignFromLongitude(sunLongitude) : null;
        const moonSignCode = moonLongitude ? this.getSignFromLongitude(moonLongitude) : null;
        const mercurySignCode = mercuryLongitude ? this.getSignFromLongitude(mercuryLongitude) : null;
        const venusSignCode = venusLongitude ? this.getSignFromLongitude(venusLongitude) : null;
        const marsSignCode = marsLongitude ? this.getSignFromLongitude(marsLongitude) : null;
        const jupiterSignCode = jupiterLongitude ? this.getSignFromLongitude(jupiterLongitude) : null;
        const saturnSignCode = saturnLongitude ? this.getSignFromLongitude(saturnLongitude) : null;
        const uranusSignCode = uranusLongitude ? this.getSignFromLongitude(uranusLongitude) : null;

        const general = dayOfYear % 2 === 0 ? 'Благоприятный день для начинаний' : 'День для завершения и отдыха';

        let love = 'В любви вы цените искренность. ';
        if (venusSignCode === 'libra') love = 'Время для романтики и новых знакомств. ';
        else if (venusSignCode === 'scorpio') love = 'Глубокие чувства и страсть в отношениях. ';
        else if (venusSignCode === 'pisces') love = 'Романтические встречи и вдохновение. ';

        if (marsSignCode === 'aries') love += 'Проявляйте инициативу. ';
        else if (marsSignCode === 'cancer') love += 'Будьте нежны и заботливы. ';
        else love += 'Открыто выражайте свои чувства. ';

        let career = 'В карьере вам поможет ваш уникальный подход. ';
        if (sunSignCode === 'leo') career = 'В карьере вам поможет лидерство и харизма. ';
        else if (sunSignCode === 'capricorn') career = 'В карьере вам поможет упорство и амбиции. ';
        else if (sunSignCode === 'gemini') career = 'В карьере вам поможет коммуникабельность и гибкость. ';

        if (marsSignCode === 'aries') career += 'Действуйте быстро и решительно. ';
        else if (marsSignCode === 'taurus') career += 'Двигайтесь к цели методично. ';
        else if (marsSignCode === 'capricorn') career += 'Планируйте стратегически. ';

        let health = 'Энергия в норме';
        if (moonSignCode === 'cancer') health = 'Обратите внимание на питание и эмоциональное состояние. ';
        else if (moonSignCode === 'virgo') health = 'Уделите внимание режиму и здоровому образу жизни. ';

        const forecast = { general, love, career, health };

        if (type !== 'basic') {
            forecast.week = this.getWeeklyForecast(marsSignCode, mercurySignCode, venusSignCode);
            forecast.month = this.getMonthlyForecast(jupiterSignCode, saturnSignCode);
        }

        if (type === 'full' || type === 'premium') {
            forecast.year = this.getYearlyForecast(jupiterSignCode, saturnSignCode, uranusSignCode);
        }

        if (type === 'premium') {
            forecast.transits = this.getDetailedTransitForecast();
            forecast.auspiciousDates = this.getAuspiciousDates(moonLongitude);
            forecast.warnings = this.getWarnings(marsSignCode, saturnSignCode);
            forecast.affirmations = this.getAffirmations(sunSignCode);
        }

        return forecast;
    }

    getWeeklyForecast(marsSignCode, mercurySignCode, venusSignCode) {
        let text = 'Неделя будет динамичной. ';
        text += marsSignCode === 'aries' ? 'Энергия на подъеме. ' : 'Распределяйте силы равномерно. ';
        text += mercurySignCode === 'gemini' ? 'Хорошее время для переговоров. ' : 'Будьте внимательны в общении. ';
        text += venusSignCode === 'libra' ? 'Возможны романтические встречи.' : 'Отношения требуют внимания.';
        return text;
    }

    getMonthlyForecast(jupiterSignCode, saturnSignCode) {
        let text = 'Месяц принесет ';
        text += jupiterSignCode === 'sagittarius' ? 'удачу в новых начинаниях. ' : 'возможности для роста. ';
        text += saturnSignCode === 'capricorn' ? 'Важны дисциплина и терпение.' : 'Сосредоточьтесь на главном.';
        return text;
    }

    getYearlyForecast(jupiterSignCode, saturnSignCode, uranusSignCode) {
        let text = 'Год обещает ';
        text += jupiterSignCode === 'sagittarius' ? 'расширение горизонтов. ' : 'стабильный рост. ';
        text += saturnSignCode === 'capricorn' ? 'Время строить фундамент. ' : 'Время достижений. ';
        text += uranusSignCode === 'aquarius' ? 'Ждите неожиданных поворотов.' : 'Год без резких перемен.';
        return text;
    }

    getDetailedTransitForecast() {
        const now = new Date();
        const month = now.getMonth();
        const seasons = ['зиму', 'весну', 'лето', 'осень'];
        const season = seasons[Math.floor(month / 3)];
        const areas = ['карьеры', 'отношений', 'финансов', 'личного роста'];
        return `В ближайшие три месяца ожидается ${season}й период активности. ${month < 3 ? 'Зимой' : month < 6 ? 'Весной' : month < 9 ? 'Летом' : 'Осенью'} возможны важные события в сфере ${areas[month % 4]}.`;
    }

    getAuspiciousDates(moonLongitude) {
        const moonPhase = (moonLongitude || 0) % 360;
        const phaseIndex = Math.floor(moonPhase / 90);
        const phases = ['первые дни после новолуния', 'первая половина лунного цикла', 'дни после полнолуния', 'перед новолунием'];
        return `Благоприятные дни для начинаний: ${phases[phaseIndex]}.`;
    }

    getWarnings(marsSignCode, saturnSignCode) {
        const warnings = [];
        if (marsSignCode === 'aries') warnings.push('Контролируйте импульсивность');
        if (saturnSignCode === 'capricorn') warnings.push('Не берите на себя слишком много обязательств');
        if (warnings.length === 0) warnings.push('Будьте внимательны к своему здоровью');
        return warnings;
    }

    getAffirmations(sunSignCode) {
        const affirmations = {
            aries: 'Я действую смело и уверенно. Я начинаю новое с радостью.',
            taurus: 'Я ценю себя и свои ресурсы. Я в безопасности и изобилии.',
            gemini: 'Я открыт к новым знаниям. Мои слова имеют силу.',
            cancer: 'Я забочусь о себе с любовью. Мои чувства важны.',
            leo: 'Я сияю своим светом. Моя уникальность прекрасна.',
            virgo: 'Я принимаю себя таким, какой я есть. Мое служение ценно.',
            libra: 'Я в гармонии с собой и миром. Мои отношения полны любви.',
            scorpio: 'Я прохожу через трансформацию с доверием. Я силен духом.',
            sagittarius: 'Я открыт для приключений. Истина ведет меня.',
            capricorn: 'Я достигаю целей с легкостью. Мой успех заслужен.',
            aquarius: 'Я свободен и уникален. Мои идеи меняют мир.',
            pisces: 'Я доверяю своей интуиции. Я соединен с высшим.'
        };
        return affirmations[sunSignCode] || 'Я доверяю себе и своему пути. Я расту и развиваюсь каждый день.';
    }

    async getKarmaAnalysis(planetsData) {
        const saturnLongitude = planetsData.saturn?.longitude;
        const northNodeLongitude = planetsData.northNode?.longitude;

        const saturnSignCode = saturnLongitude ? this.getSignFromLongitude(saturnLongitude) : null;
        const northNodeSignCode = northNodeLongitude ? this.getSignFromLongitude(northNodeLongitude) : null;
        const southNodeSignCode = northNodeSignCode ? this.getOppositeSignCode(northNodeSignCode) : null;

        const saturnSign = this.signsMap.get(saturnSignCode);
        const northNodeSign = this.signsMap.get(northNodeSignCode);
        const southNodeSign = this.signsMap.get(southNodeSignCode);

        return {
            pastLifeLessons: southNodeSign ? `В прошлых жизнях вы освоили качества знака ${southNodeSign.name_ru}. Это ваша база, то, что дается легко и естественно.` : '—',
            currentTask: northNodeSign ? `В этом воплощении вам предстоит развить качества знака ${northNodeSign.name_ru}. Это ваш путь роста и развития.` : '—',
            saturnLesson: saturnSign ? `Главный урок Сатурна: ${this.getSaturnLesson(saturnSignCode)}` : '—'
        };
    }

    getOppositeSignCode(signCode) {
        const signs = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
        const index = signs.indexOf(signCode);
        if (index !== -1) {
            return signs[(index + 6) % 12];
        }
        return null;
    }

    getSaturnLesson(signCode) {
        const lessons = {
            aries: 'научиться действовать самостоятельно, не оглядываясь на других',
            taurus: 'научиться ценить себя и свои ресурсы',
            gemini: 'научиться ясно выражать мысли и слушать',
            cancer: 'научиться заботиться о себе так же, как о других',
            leo: 'научиться принимать себя и не ждать постоянного признания',
            virgo: 'научиться принимать несовершенство',
            libra: 'научиться принимать решения и нести за них ответственность',
            scorpio: 'научиться отпускать контроль и доверять',
            sagittarius: 'научиться ответственности и завершению начатого',
            capricorn: 'научиться радоваться жизни без погони за статусом',
            aquarius: 'научиться балансу между свободой и близостью',
            pisces: 'научиться различать интуицию и иллюзии'
        };
        return lessons[signCode] || 'интегрировать свои уроки и стать более целостной личностью';
    }

    async getPersonalRecommendations(sunSignCode, moonSignCode, ascendantSignCode) {
        const sunSign = this.signsMap.get(sunSignCode);
        const moonSign = this.signsMap.get(moonSignCode);
        const ascendantSign = this.signsMap.get(ascendantSignCode);

        return [
            `Раскрывайте свою солнечную природу (${sunSign?.name_ru || '—'}) через ${this.getSunPath(sunSignCode)}`,
            `Заботьтесь о своей лунной потребности (${moonSign?.name_ru || '—'}) через ${this.getMoonPath(moonSignCode)}`,
            `Используйте силу асцендента (${ascendantSign?.name_ru || '—'}) для ${this.getAscendantPath(ascendantSignCode)}`
        ];
    }

    getSunPath(signCode) {
        const paths = {
            aries: 'спорт, соревнования, лидерство',
            taurus: 'творчество, природа, накопление',
            gemini: 'общение, обучение, путешествия',
            cancer: 'заботу о близких, дом',
            leo: 'творчество, выступления, хобби',
            virgo: 'работу, служение, порядок',
            libra: 'искусство, партнерство, гармонию',
            scorpio: 'исследования, психологию, трансформацию',
            sagittarius: 'путешествия, философию, обучение',
            capricorn: 'карьеру, достижения, структуру',
            aquarius: 'инновации, друзей, социальную активность',
            pisces: 'искусство, музыку, духовные практики'
        };
        return paths[signCode] || 'самовыражение';
    }

    getMoonPath(signCode) {
        const paths = {
            aries: 'физическую активность',
            taurus: 'создание уюта и комфорта',
            gemini: 'общение и новую информацию',
            cancer: 'время с семьей и близкими',
            leo: 'творчество и внимание к себе',
            virgo: 'порядок и заботу о здоровье',
            libra: 'красоту и гармонию',
            scorpio: 'глубокие чувства и трансформацию',
            sagittarius: 'свободу и новые впечатления',
            capricorn: 'достижения и структуру',
            aquarius: 'друзей и единомышленников',
            pisces: 'творчество и уединение'
        };
        return paths[signCode] || 'эмоциональный комфорт';
    }

    getAscendantPath(signCode) {
        const paths = {
            aries: 'проявления себя в мире',
            taurus: 'создания устойчивости',
            gemini: 'коммуникации',
            cancer: 'эмпатии и заботы',
            leo: 'самопрезентации',
            virgo: 'служения и порядка',
            libra: 'дипломатии',
            scorpio: 'глубины и проницательности',
            sagittarius: 'расширения горизонтов',
            capricorn: 'достижения целей',
            aquarius: 'оригинальности',
            pisces: 'интуиции и творчества'
        };
        return paths[signCode] || 'личностного роста';
    }

    getDayOfYear(date) {
        const start = new Date(date.getFullYear(), 0, 0);
        const diff = date - start;
        const oneDay = 1000 * 60 * 60 * 24;
        return Math.floor(diff / oneDay);
    }

    formatForDraw(planetsData) {
        const symbols = {
            sun: '☉', moon: '☽', mercury: '☿', venus: '♀',
            mars: '♂', jupiter: '♃', saturn: '♄',
            uranus: '♅', neptune: '♆', pluto: '♇'
        };
        const points = [];
        for (const [key, data] of Object.entries(planetsData)) {
            if (data && data.longitude !== undefined) {
                points.push({
                    name: symbols[key] || key.substring(0, 2).toUpperCase(),
                    angle: data.longitude || 0
                });
            }
        }
        return points;
    }

    formatHousesForDraw(housesData) {
        return housesData.map(house => ({ angle: house.cusp }));
    }

    async generateInterpretation(data) {
        const psychology = data.psychology || {};
        const strengths = psychology.strengths || [];
        const challenges = psychology.challenges || [];
        const forecast = data.forecast || {};

        let text = `🌟 **АСТРОПСИХОЛОГИЧЕСКИЙ ПОРТРЕТ (${data.calculationType === 'astro_premium' ? 'ПРЕМИУМ' :
            data.calculationType === 'astro_full' ? 'ПОЛНЫЙ АНАЛИЗ' :
                data.calculationType === 'astro_standard' ? 'СТАНДАРТНЫЙ' :
                    data.calculationType === 'astro_quick' ? 'ЭКСПРЕСС-АНАЛИЗ' : 'БАЗОВЫЙ'})**\n\n`;

        text += `**АСЦЕНДЕНТ (${data.ascendant.sign})**\n${data.ascendant.description}\n\n`;
        text += `**СОЛНЦЕ (${data.sun.sign})**\n${data.sun.description}\n\n`;
        text += `**ЛУНА (${data.moon.sign})**\n${data.moon.description}\n\n`;

        if (data.planets && data.planets.length > 0) {
            text += `**ПЛАНЕТЫ В ЗНАКАХ**\n${data.planets.map(p => `• ${p.symbol} ${p.name}: ${p.sign} ${p.degree}°`).join('\n')}\n\n`;
        }

        text += `**ПСИХОЛОГИЧЕСКИЙ ПОРТРЕТ**\n\n`;
        text += `**ЭГО (Солнце в ${data.sun.sign}):**\n${psychology.ego}\n\n`;
        text += `**ЭМОЦИИ (Луна в ${data.moon.sign}):**\n${psychology.emotions}\n\n`;
        text += `**ЛИЧНОСТЬ (Асцендент в ${data.ascendant.sign}):**\n${psychology.personality}\n\n`;

        if (psychology.communicationStyle) {
            text += `**СТИЛЬ ОБЩЕНИЯ (Меркурий):**\n${psychology.communicationStyle}\n\n`;
        }

        if (psychology.loveStyle) {
            text += `**СТИЛЬ ЛЮБВИ (Венера):**\n${psychology.loveStyle}\n\n`;
        }

        if (psychology.thinkingStyle && psychology.thinkingStyle !== psychology.communicationStyle) {
            text += `**СТИЛЬ МЫШЛЕНИЯ:**\n${psychology.thinkingStyle}\n\n`;
        }

        if (psychology.emotionalNeeds) {
            text += `**ЭМОЦИОНАЛЬНЫЕ ПОТРЕБНОСТИ:**\n${psychology.emotionalNeeds}\n\n`;
        }

        if (psychology.shadowAspects) {
            text += `**ТЕНЕВЫЕ АСПЕКТЫ:**\n${psychology.shadowAspects}\n\n`;
        }

        if (psychology.lifePurpose) {
            text += `**ЖИЗНЕННАЯ МИССИЯ:**\n${psychology.lifePurpose}\n\n`;
        }

        text += `**СИЛЬНЫЕ СТОРОНЫ**\n${strengths.map(s => `• ${s}`).join('\n')}\n\n`;
        text += `**ЗОНЫ РОСТА**\n${challenges.map(c => `• ${c}`).join('\n')}\n\n`;
        text += `**ПУТЬ РАЗВИТИЯ**\n${psychology.growthPath}\n\n`;

        if (forecast) {
            text += `**ПРОГНОЗ**\n`;
            text += `💼 Карьера: ${forecast.career || '—'}\n`;
            text += `❤️ Любовь: ${forecast.love || '—'}\n`;
            text += `🌿 Здоровье: ${forecast.health || '—'}\n`;
            text += `✨ Общий: ${forecast.general || '—'}\n\n`;

            if (forecast.week) text += `**НЕДЕЛЬНЫЙ ПРОГНОЗ**\n${forecast.week}\n\n`;
            if (forecast.month) text += `**МЕСЯЧНЫЙ ПРОГНОЗ**\n${forecast.month}\n\n`;
            if (forecast.year) text += `**ГОДОВОЙ ПРОГНОЗ**\n${forecast.year}\n\n`;
            if (forecast.transits) text += `**ТРАНЗИТНЫЙ ПРОГНОЗ**\n${forecast.transits}\n\n`;
        }

        if (data.karma) {
            text += `**КАРМИЧЕСКИЙ АНАЛИЗ**\n`;
            text += `${data.karma.pastLifeLessons}\n`;
            text += `${data.karma.currentTask}\n`;
            text += `${data.karma.saturnLesson}\n\n`;
        }

        if (data.recommendations && data.recommendations.length > 0) {
            text += `**ПЕРСОНАЛЬНЫЕ РЕКОМЕНДАЦИИ**\n${data.recommendations.map(r => `• ${r}`).join('\n')}\n\n`;
        }

        if (forecast.affirmations) {
            text += `**АФФИРМАЦИЯ ДНЯ**\n"${forecast.affirmations}"\n\n`;
        }

        text += `*Звезды указывают направление, но выбор пути всегда за вами.*`;

        return text;
    }

    async calculate(data) {
        try {
            await this.loadSigns();
            await this.loadPlanets();
            await this.loadHouses();

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

            const sunLongitude = planetsData.sun?.longitude;
            const moonLongitude = planetsData.moon?.longitude;
            const ascendantLongitude = ascendantData.degree;

            const sunSignCode = sunLongitude ? this.getSignFromLongitude(sunLongitude) : null;
            const moonSignCode = moonLongitude ? this.getSignFromLongitude(moonLongitude) : null;
            const ascendantSignCode = ascendantLongitude ? this.getSignFromLongitude(ascendantLongitude) : null;

            // Получаем названия знаков
            const sunSignName = this.getSignNameByCode(sunSignCode);
            const moonSignName = this.getSignNameByCode(moonSignCode);
            const ascendantSignName = this.getSignNameByCode(ascendantSignCode);

            // Получаем описания
            const sunDescription = this.getSignDescription(sunSignCode, 'sun');
            const moonDescription = this.getSignDescription(moonSignCode, 'moon');
            const ascendantDescription = this.getSignDescription(ascendantSignCode, 'ascendant');

            const psychology = await this.buildPsychology(sunSignCode, moonSignCode, ascendantSignCode, planetsData);
            const forecastType = type === 'astro_premium' ? 'premium' : (type === 'astro_full' ? 'full' : (type === 'astro_standard' ? 'standard' : 'basic'));
            const forecast = await this.buildForecast(planetsData, forecastType);
            const planets = await this.formatAllPlanets(planetsData);
            const houses = await this.formatHouses(housesData, planetsData);
            const aspects = await this.formatAspects(aspectsData);

            const chartDrawData = {
                points: this.formatForDraw(planetsData),
                cusps: this.formatHousesForDraw(housesData)
            };

            let karma = null;
            let recommendations = null;

            if (type === 'astro_premium') {
                karma = await this.getKarmaAnalysis(planetsData);
                recommendations = await this.getPersonalRecommendations(sunSignCode, moonSignCode, ascendantSignCode);
            }

            const result = {
                fullName,
                birthData: {
                    date: birthDate,
                    time: birthTime || '12:00',
                    place: birthPlace || 'не указано'
                },
                calculationType: type,
                ascendant: {
                    sign: ascendantSignName,
                    signCode: ascendantSignCode || '—',
                    degree: ascendantData.degreeInSign || (ascendantLongitude ? (ascendantLongitude % 30).toFixed(1) : '—'),
                    description: ascendantDescription
                },
                sun: {
                    sign: sunSignName,
                    signCode: sunSignCode || '—',
                    degree: sunLongitude ? (sunLongitude % 30).toFixed(1) : '—',
                    description: sunDescription
                },
                moon: {
                    sign: moonSignName,
                    signCode: moonSignCode || '—',
                    degree: moonLongitude ? (moonLongitude % 30).toFixed(1) : '—',
                    description: moonDescription
                },
                planets,
                psychology,
                forecast,
                houses,
                aspects,
                chartDrawData,
                karma,
                recommendations
            };

            result.interpretation = await this.generateInterpretation(result);

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
        const psychology = data.psychology || {};
        const strengths = psychology.strengths || [];
        const challenges = psychology.challenges || [];

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
                .planet-list { display: grid; grid-template-columns: repeat(2, 1fr); gap: 5mm; }
                .footer { margin-top: 10mm; text-align: right; font-size: 10pt; color: #666; }
            </style>
        
<!-- Yandex.Metrika counter -->
<script type="text/javascript">
    (function(m,e,t,r,i,k,a){
        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
    })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=107722589', 'ym');

    ym(107722589, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
</script>
<noscript><div><img src="https://mc.yandex.ru/watch/107722589" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
<!-- /Yandex.Metrika counter -->
</head>


        <body>
            <div class="container">
                <div class="title-page">
                    <h1>АЛГОРИТМ СУДЬБЫ</h1>
                    <h2>Астропсихологический портрет</h2>
                    <div class="name">${this.escapeHtml(data.fullName || '—')}</div>
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
                        ${(data.planets || []).map(p => `<div><strong>${p.symbol || ''} ${p.name || ''}</strong> в ${p.sign || '—'} ${p.degree || ''}°</div>`).join('') || '<div>—</div>'}
                    </div>
                </div>
                
                <div class="section">
                    <div class="section-title">ПСИХОЛОГИЧЕСКИЙ ПОРТРЕТ</div>
                    <p><strong>Эго:</strong> ${psychology.ego || ''}</p>
                    <p><strong>Эмоции:</strong> ${psychology.emotions || ''}</p>
                    <p><strong>Личность:</strong> ${psychology.personality || ''}</p>
                </div>
                
                <div class="section">
                    <div class="section-title">СИЛЬНЫЕ СТОРОНЫ</div>
                    <ul>
                        ${strengths.map(s => `<li>${this.escapeHtml(s)}</li>`).join('') || '<li>—</li>'}
                    </ul>
                </div>
                
                <div class="section">
                    <div class="section-title">ЗОНЫ РОСТА</div>
                    <ul>
                        ${challenges.map(c => `<li>${this.escapeHtml(c)}</li>`).join('') || '<li>—</li>'}
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

    escapeHtml(str) {
        if (!str) return '';
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
}

module.exports = AstropsychologyService;