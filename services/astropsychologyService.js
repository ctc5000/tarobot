class AstropsychologyService {
    constructor() {
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
        const { birthDate, birthTime, birthPlace, question } = data;

        // Расчет положений планет (упрощенно)
        const planets = this.calculatePlanets(birthDate, birthTime);

        // Определение асцендента (упрощенно)
        const ascendant = this.calculateAscendant(birthDate, birthTime);

        // Определение знаков
        const sunSign = this.getSunSign(birthDate);
        const moonSign = this.getMoonSign(birthDate);

        // Психологический портрет на основе астрологии
        const psychology = this.getAstroPsychology(planets, ascendant);

        // Прогноз на текущий период
        const forecast = this.getForecast(planets);

        // Анализ отношений (если есть запрос)
        const relationship = question ? this.analyzeRelationship(planets, question) : null;

        return {
            birthData: {
                date: birthDate,
                time: birthTime || 'не указано',
                place: birthPlace || 'не указано'
            },
            ascendant: {
                sign: ascendant.sign,
                degree: ascendant.degree,
                description: this.getAscendantDescription(ascendant.sign)
            },
            sun: {
                sign: sunSign,
                planet: this.planets.sun,
                description: this.getSunDescription(sunSign)
            },
            moon: {
                sign: moonSign,
                planet: this.planets.moon,
                description: this.getMoonDescription(moonSign)
            },
            planets: this.formatPlanets(planets),
            psychology,
            forecast,
            relationship,
            question: question || 'Самопознание',
            interpretation: this.generateInterpretation(planets, ascendant, sunSign, moonSign, psychology, forecast, question)
        };
    }

    calculatePlanets(birthDate, birthTime) {
        // Упрощенный расчет для демонстрации
        const planets = {};
        const date = new Date(birthDate.split('.').reverse().join('-'));
        const dayOfYear = this.getDayOfYear(date);

        // Солнце меняет знак примерно каждые 30 дней
        planets.sun = { sign: this.getSunSign(birthDate), degree: dayOfYear % 30 };

        // Луна меняет знак каждые 2.5 дня
        const moonSignIndex = Math.floor(dayOfYear / 2.5) % 12;
        planets.moon = { sign: this.getSignByIndex(moonSignIndex), degree: (dayOfYear * 12) % 30 };

        // Остальные планеты для демо
        const planetList = ['mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
        planetList.forEach((planet, index) => {
            const signIndex = (dayOfYear + index * 30) % 12;
            planets[planet] = {
                sign: this.getSignByIndex(signIndex),
                degree: (dayOfYear + index * 7) % 30,
                retrograde: Math.random() > 0.7 // 30% планет ретроградны
            };
        });

        return planets;
    }

    getDayOfYear(date) {
        const start = new Date(date.getFullYear(), 0, 0);
        const diff = date - start;
        const oneDay = 1000 * 60 * 60 * 24;
        return Math.floor(diff / oneDay);
    }

    getSignByIndex(index) {
        const signs = ['Овен', 'Телец', 'Близнецы', 'Рак', 'Лев', 'Дева',
            'Весы', 'Скорпион', 'Стрелец', 'Козерог', 'Водолей', 'Рыбы'];
        return signs[index % 12];
    }

    getSunSign(birthDate) {
        const [day, month] = birthDate.split('.').map(Number);

        if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return 'Овен';
        if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return 'Телец';
        if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) return 'Близнецы';
        if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) return 'Рак';
        if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return 'Лев';
        if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return 'Дева';
        if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) return 'Весы';
        if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) return 'Скорпион';
        if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) return 'Стрелец';
        if ((month == 12 && day >= 22) || (month == 1 && day <= 19)) return 'Козерог';
        if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) return 'Водолей';
        return 'Рыбы';
    }

    getMoonSign(birthDate) {
        // Упрощенно, для демо
        const day = parseInt(birthDate.split('.')[0]);
        const signs = ['Овен', 'Телец', 'Близнецы', 'Рак', 'Лев', 'Дева',
            'Весы', 'Скорпион', 'Стрелец', 'Козерог', 'Водолей', 'Рыбы'];
        return signs[day % 12];
    }

    calculateAscendant(birthDate, birthTime) {
        // Упрощенный расчет
        const hour = birthTime ? parseInt(birthTime.split(':')[0]) : 12;
        const day = parseInt(birthDate.split('.')[0]);

        const signs = ['Овен', 'Телец', 'Близнецы', 'Рак', 'Лев', 'Дева',
            'Весы', 'Скорпион', 'Стрелец', 'Козерог', 'Водолей', 'Рыбы'];

        // Асцендент меняется примерно каждые 2 часа
        const index = Math.floor(hour / 2) % 12;

        return {
            sign: signs[(index + day) % 12],
            degree: (hour * 15) % 30
        };
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

    formatPlanets(planets) {
        const result = [];

        for (let [planet, data] of Object.entries(planets)) {
            const planetInfo = this.planets[planet];
            if (planetInfo) {
                result.push({
                    name: planetInfo.name,
                    symbol: planetInfo.symbol,
                    sign: data.sign,
                    degree: data.degree,
                    retrograde: data.retrograde || false,
                    meaning: planetInfo.meaning,
                    role: planetInfo.role
                });
            }
        }

        return result;
    }

    getAstroPsychology(planets, ascendant) {
        // Психологический анализ на основе астрологии
        return {
            ego: `Ваше эго (Солнце в ${planets.sun.sign}) проявляется как ${this.getSunDescription(planets.sun.sign).toLowerCase()}`,
            emotions: `Ваши эмоции (Луна в ${planets.moon.sign}) ${this.getMoonDescription(planets.moon.sign).toLowerCase()}`,
            personality: `Ваша личность (Асцендент в ${ascendant.sign}) ${this.getAscendantDescription(ascendant.sign).toLowerCase()}`,
            strengths: this.getStrengths(planets),
            challenges: this.getChallenges(planets),
            growthPath: this.getGrowthPath(planets)
        };
    }

    getStrengths(planets) {
        const strengths = [];

        if (planets.sun.sign === 'Лев' || planets.sun.sign === 'Овен')
            strengths.push('Сильная воля и инициативность');
        if (planets.moon.sign === 'Рак' || planets.moon.sign === 'Рыбы')
            strengths.push('Глубокая эмпатия и интуиция');
        if (planets.mercury && ['Близнецы', 'Дева'].includes(planets.mercury.sign))
            strengths.push('Острый ум и коммуникабельность');
        if (planets.venus && ['Телец', 'Весы'].includes(planets.venus.sign))
            strengths.push('Художественный вкус и дипломатичность');
        if (planets.mars && ['Овен', 'Скорпион'].includes(planets.mars.sign))
            strengths.push('Энергия и страстность');

        if (strengths.length < 3) {
            strengths.push('Способность к трансформации');
            strengths.push('Внутренняя мудрость');
        }

        return strengths.slice(0, 4);
    }

    getChallenges(planets) {
        const challenges = [];

        if (planets.saturn && planets.saturn.retrograde)
            challenges.push('Склонность к самокритике и ограничениям');
        if (planets.mars && planets.mars.sign === 'Рак')
            challenges.push('Эмоциональная нестабильность и обидчивость');
        if (planets.venus && planets.venus.sign === 'Скорпион')
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

        return paths[Object.keys(planets).length % paths.length];
    }

    getForecast(planets) {
        const now = new Date();
        const dayOfYear = this.getDayOfYear(now);

        return {
            general: dayOfYear % 2 === 0 ? 'Благоприятный день для начинаний' : 'День для завершения и отдыха',
            love: planets.venus && planets.venus.sign === 'Весы' ? 'Время для романтики' : 'Отношения требуют внимания',
            career: planets.mars && planets.mars.sign === 'Козерог' ? 'Карьерный рост' : 'Время планирования',
            health: planets.moon && planets.moon.sign === 'Рак' ? 'Обратите внимание на питание' : 'Энергия в норме'
        };
    }

    analyzeRelationship(planets, question) {
        return {
            compatibility: Math.floor(Math.random() * 100),
            advice: 'В отношениях важно сохранять баланс между давать и брать. Слушайте не только слова, но и чувства.',
            challenge: 'Научитесь говорить о своих потребностях, не боясь быть отвергнутым.',
            opportunity: 'Этот период благоприятен для углубления эмоциональной связи.'
        };
    }

    generateInterpretation(planets, ascendant, sunSign, moonSign, psychology, forecast, question) {
        return `
🌞 **АСТРОПСИХОЛОГИЧЕСКИЙ ПОРТРЕТ** 🌞

**АСЦЕНДЕНТ (МАСКА)**
${ascendant.sign} ${ascendant.degree}°
${this.getAscendantDescription(ascendant.sign)}

**СОЛНЦЕ (СУЩНОСТЬ)**
${sunSign} в ${planets.sun.degree}°
${this.getSunDescription(sunSign)}

**ЛУНА (ДУША)**
${moonSign} в ${planets.moon.degree}°
${this.getMoonDescription(moonSign)}

**ПЛАНЕТЫ В ЗНАКАХ**

${planets.mercury ? `• ☿ Меркурий в ${planets.mercury.sign} ${planets.mercury.retrograde ? '(ретроградный)' : ''} — ${this.planets.mercury.role}` : ''}
${planets.venus ? `• ♀ Венера в ${planets.venus.sign} ${planets.venus.retrograde ? '(ретроградная)' : ''} — ${this.planets.venus.role}` : ''}
${planets.mars ? `• ♂ Марс в ${planets.mars.sign} ${planets.mars.retrograde ? '(ретроградный)' : ''} — ${this.planets.mars.role}` : ''}
${planets.jupiter ? `• ♃ Юпитер в ${planets.jupiter.sign} — ${this.planets.jupiter.role}` : ''}
${planets.saturn ? `• ♄ Сатурн в ${planets.saturn.sign} ${planets.saturn.retrograde ? '(ретроградный)' : ''} — ${this.planets.saturn.role}` : ''}

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