// modules/Astrology/Services/AstrologyRenderService.js

class AstrologyRenderService {

    // ========== ОСНОВНЫЕ БЛОКИ ==========

    /**
     * Рендеринг блока "Значение планет"
     */
    renderEnrichedPlanetsInfo(planets) {
        if (!planets || Object.keys(planets).length === 0) {
            return '';
        }

        const symbols = {
            sun: '☉', moon: '☽', mercury: '☿', venus: '♀',
            mars: '♂', jupiter: '♃', saturn: '♄',
            uranus: '♅', neptune: '♆', pluto: '♇'
        };

        const names = {
            sun: 'Солнце', moon: 'Луна', mercury: 'Меркурий', venus: 'Венера',
            mars: 'Марс', jupiter: 'Юпитер', saturn: 'Сатурн',
            uranus: 'Уран', neptune: 'Нептун', pluto: 'Плутон'
        };

        const planetOrder = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];

        let html = `
        <h3>🪐 ЗНАЧЕНИЕ ПЛАНЕТ</h3>
        <div class="enriched-planets-grid">
        `;

        for (const key of planetOrder) {
            const planet = planets[key];
            if (!planet) continue;

            html += `
            <div class="enriched-planet-card">
                <div class="enriched-planet-header">
                    <span class="enriched-planet-symbol">${this.escapeHtml(symbols[key])}</span>
                    <span class="enriched-planet-name">${this.escapeHtml(names[key])}</span>
                </div>
                <div class="enriched-planet-position">
                    <span class="enriched-planet-sign">${this.escapeHtml(planet.sign)}</span>
                    <span class="enriched-planet-degree">${this.escapeHtml(planet.degreeInSign)}°</span>
                </div>
                <div class="enriched-planet-meaning">
                    <strong>Значение:</strong> ${this.escapeHtml(planet.planetMeaning || '—')}
                </div>
                <div class="enriched-planet-sign-desc">
                    <strong>В знаке ${this.escapeHtml(planet.sign)}:</strong> ${this.escapeHtml(planet.signDescription || '—')}
                </div>
            </div>
            `;
        }

        html += `</div>`;
        return html;
    }

    /**
     * Рендеринг блока "Значение домов"
     */
    renderEnrichedHousesInfo(houses) {
        if (!houses || houses.length === 0) {
            return '';
        }

        let html = `
        <h3>🏠 ЗНАЧЕНИЕ ДОМОВ</h3>
        <div class="enriched-houses-grid">
        `;

        for (const house of houses) {
            const planetsList = house.planets && house.planets.length > 0
                ? house.planets.join(', ')
                : 'нет планет';

            html += `
            <div class="enriched-house-card">
                <div class="enriched-house-header">
                    <span class="enriched-house-number">${house.number} дом</span>
                    <span class="enriched-house-cusp">Куспид в ${this.escapeHtml(house.sign)}</span>
                </div>
                <div class="enriched-house-desc">
                    <strong>Значение:</strong> ${this.escapeHtml(house.houseDescription || '—')}
                </div>
                <div class="enriched-house-sign-desc">
                    <strong>Куспид в ${this.escapeHtml(house.sign)}:</strong> ${this.escapeHtml(house.signDescription || '—')}
                </div>
                <div class="enriched-house-planets">
                    <strong>Планеты:</strong> ${this.escapeHtml(planetsList)}
                </div>
            </div>
            `;
        }

        html += `</div>`;
        return html;
    }

    /**
     * Рендеринг блока "Ключевые аспекты"
     */
    renderEnrichedAspectsInfo(aspects) {
        if (!aspects || aspects.length === 0) {
            return '';
        }

        const aspectColors = {
            conjunction: '#ff4d4d',
            opposition: '#4d4dff',
            trine: '#4dff4d',
            square: '#ff4dff',
            sextile: '#ffff4d'
        };

        let html = `
        <h3>⚡ КЛЮЧЕВЫЕ АСПЕКТЫ</h3>
        <div class="enriched-aspects-grid">
        `;

        for (const aspect of aspects) {
            const color = aspectColors[aspect.type] || '#c9a54b';
            html += `
            <div class="enriched-aspect-card" style="border-left-color: ${color}">
                <div class="enriched-aspect-header">
                    <span class="enriched-aspect-name">${this.escapeHtml(aspect.name)}</span>
                    <span class="enriched-aspect-orb">Орб: ${this.escapeHtml(aspect.orb)}°</span>
                </div>
                <div class="enriched-aspect-planets">
                    <span class="enriched-aspect-planet">${this.escapeHtml(aspect.planet1)}</span>
                    <span class="enriched-aspect-symbol">↔</span>
                    <span class="enriched-aspect-planet">${this.escapeHtml(aspect.planet2)}</span>
                </div>
                <div class="enriched-aspect-desc">
                    ${this.escapeHtml(aspect.description)}
                </div>
            </div>
            `;
        }

        html += `</div>`;
        return html;
    }

    /**
     * Рендеринг легенды
     */
    renderLegend(planets) {
        if (!planets || Object.keys(planets).length === 0) {
            return '';
        }

        const symbols = {
            sun: '☉', moon: '☽', mercury: '☿', venus: '♀',
            mars: '♂', jupiter: '♃', saturn: '♄',
            uranus: '♅', neptune: '♆', pluto: '♇'
        };

        const names = {
            sun: 'Солнце', moon: 'Луна', mercury: 'Меркурий', venus: 'Венера',
            mars: 'Марс', jupiter: 'Юпитер', saturn: 'Сатурн',
            uranus: 'Уран', neptune: 'Нептун', pluto: 'Плутон'
        };

        const planetOrder = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];

        let html = '';

        for (const key of planetOrder) {
            const planet = planets[key];
            if (!planet) continue;

            html += `
            <div class="legend-item">
                <span class="planet-symbol">${this.escapeHtml(symbols[key])}</span>
                <span class="planet-name">${this.escapeHtml(names[key])}</span>
                <span class="planet-sign">${this.escapeHtml(planet.sign)}</span>
            </div>
            `;
        }

        return html;
    }

    /**
     * Рендеринг позиций планет
     */
    renderPlanetPositions(planets) {
        if (!planets || Object.keys(planets).length === 0) {
            return '<p>Нет данных</p>';
        }

        const symbols = {
            sun: '☉', moon: '☽', mercury: '☿', venus: '♀',
            mars: '♂', jupiter: '♃', saturn: '♄',
            uranus: '♅', neptune: '♆', pluto: '♇'
        };

        const names = {
            sun: 'Солнце', moon: 'Луна', mercury: 'Меркурий', venus: 'Венера',
            mars: 'Марс', jupiter: 'Юпитер', saturn: 'Сатурн',
            uranus: 'Уран', neptune: 'Нептун', pluto: 'Плутон'
        };

        const signSymbols = {
            'Овен': '♈', 'Телец': '♉', 'Близнецы': '♊', 'Рак': '♋',
            'Лев': '♌', 'Дева': '♍', 'Весы': '♎', 'Скорпион': '♏',
            'Стрелец': '♐', 'Козерог': '♑', 'Водолей': '♒', 'Рыбы': '♓'
        };

        const planetOrder = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];

        let html = '';

        for (const key of planetOrder) {
            const planet = planets[key];
            if (!planet) continue;

            const house = Math.floor(planet.longitude / 30) + 1;
            const signSymbol = signSymbols[planet.sign] || '';

            html += `
            <div class="position-item">
                <div class="position-header">
                    <span class="position-symbol">${this.escapeHtml(symbols[key])}</span>
                    <span class="position-name">${this.escapeHtml(names[key])}</span>
                </div>
                <div class="position-detail">
                    <span>Знак:</span>
                    <span class="position-value">${this.escapeHtml(planet.sign)} ${signSymbol}</span>
                </div>
                <div class="position-detail">
                    <span>Градус:</span>
                    <span class="position-value">${this.escapeHtml(planet.degreeInSign)}°</span>
                </div>
                <div class="position-detail">
                    <span>Дом:</span>
                    <span class="position-value">${house}</span>
                </div>
            </div>
            `;
        }

        return html;
    }

    /**
     * Рендеринг списка аспектов
     */
    renderAspectsList(aspects) {
        if (!aspects || aspects.length === 0) {
            return '<p>Нет значимых аспектов</p>';
        }

        let html = '';

        for (const aspect of aspects) {
            html += `
            <div class="aspect-item ${this.escapeHtml(aspect.type)}">
                ${this.escapeHtml(aspect.description)}
            </div>
            `;
        }

        return html;
    }

    // ========== ИНТЕРПРЕТАЦИЯ ==========

    /**
     * Рендеринг полной интерпретации
     */
    renderInterpretation(data) {
        const ascendant = data.ascendant || {};
        const sun = data.planets?.sun;
        const moon = data.planets?.moon;
        const aspects = data.aspects || [];
        const planets = data.planets || {};

        const birthDate = data.birthDate || '';
        const birthTime = data.birthTime || '';

        const ascSign = ascendant.sign || 'Неизвестно';
        const ascDegree = ascendant.degreeInSign || '0';
        const ascDesc = ascendant.description || '';

        const sunSign = sun?.sign || 'Неизвестно';
        const sunDegree = sun?.degreeInSign || '0';
        const sunHouse = Math.floor(sun?.longitude / 30) + 1 || 1;
        const sunDesc = sun?.signDescription || '';

        const moonSign = moon?.sign || 'Неизвестно';
        const moonDegree = moon?.degreeInSign || '0';
        const moonHouse = Math.floor(moon?.longitude / 30) + 1 || 1;
        const moonDesc = moon?.signDescription || '';

        const analysis = this.analyzeElementBalance(planets);

        return `
        <div class="interpretation-container">
            <!-- ВСТУПЛЕНИЕ -->
            <div class="interpretation-section intro-section">
                <h4>🌟 ВАШ АСТРОЛОГИЧЕСКИЙ ПОРТРЕТ</h4>
                <p class="section-content">
                    В момент вашего рождения, ${this.escapeHtml(birthDate)} в ${this.escapeHtml(birthTime)}, небесные тела выстроились в уникальную конфигурацию, которая сформировала ваш характер, таланты и жизненный путь. Анализ вашей натальной карты позволяет заглянуть в самые глубокие слои вашей личности и понять, какие энергии определяют вашу судьбу.
                </p>
                <p class="section-content">
                    В этом астрологическом портрете мы рассмотрим положение планет в знаках и домах, их взаимодействие друг с другом, а также ключевые точки вашей карты, которые оказывают наибольшее влияние на вашу жизнь.
                </p>
            </div>
            
            <!-- РАЗДЕЛ 1: АСЦЕНДЕНТ -->
            <div class="interpretation-section ascendant-section">
                <h4>🌅 АСЦЕНДЕНТ (Восходящий знак) — ${this.escapeHtml(ascSign)} ${this.escapeHtml(ascDegree)}°</h4>
                <p class="section-content">
                    <strong>${this.getAscendantShortDescription(ascSign)}</strong>
                </p>
                <p class="section-detail">
                    ${this.getAscendantDetailed(ascSign)} Асцендент — это ваша внешняя маска, то, как вы проявляетесь в мире, как вас воспринимают окружающие при первой встрече. Он определяет вашу внешность, манеру поведения и первый импульс в любой ситуации.
                </p>
                <p class="section-detail">
                    Ваш асцендент находится в знаке ${this.escapeHtml(ascSign)}, что делает вас ${this.getAscendantNature(ascSign)}. Управитель вашего асцендента — ${this.getRulerOfSign(ascSign)}, который играет особую роль в вашей жизни, указывая на сферу, где вы можете проявить себя наиболее ярко.
                </p>
                <p class="section-detail">
                    <em>Рекомендация:</em> ${this.getAscendantAdvice(ascSign)}
                </p>
            </div>
            
            <!-- РАЗДЕЛ 2: СОЛНЦЕ -->
            <div class="interpretation-section sun-section">
                <h4>☀️ СОЛНЦЕ (Сущность, эго, жизненная сила) — ${this.escapeHtml(sunSign)} ${this.escapeHtml(sunDegree)}° в ${sunHouse} доме</h4>
                <p class="section-content">
                    <strong>${this.getSunDescription(sunSign)}</strong>
                </p>
                <p class="section-detail">
                    Солнце — это ваше истинное "Я", ваша жизненная цель и источник энергии. Оно показывает, кем вы становитесь, когда раскрываете свой потенциал, и что приносит вам наибольшее удовлетворение.
                </p>
                <p class="section-detail">
                    ${this.getSunInHouseDescription(sunSign, sunHouse)} В ${sunHouse} доме Солнце проявляется особенно ярко, указывая на сферу жизни, где вы можете реализовать свои лидерские качества и получить признание.
                </p>
                <p class="section-detail">
                    Ваше Солнце в стихии ${this.getElement(sunSign)} дает вам ${this.getElementQuality(sunSign)}. Это означает, что в достижении целей вы полагаетесь на ${this.getElementApproach(sunSign)}.
                </p>
                <p class="section-detail">
                    <em>Совет для самореализации:</em> ${this.getSunAdvice(sunSign, sunHouse)}
                </p>
            </div>
            
            <!-- РАЗДЕЛ 3: ЛУНА -->
            <div class="interpretation-section moon-section">
                <h4>🌙 ЛУНА (Душа, эмоции, подсознание) — ${this.escapeHtml(moonSign)} ${this.escapeHtml(moonDegree)}° в ${moonHouse} доме</h4>
                <p class="section-content">
                    <strong>${this.getMoonDescription(moonSign)}</strong>
                </p>
                <p class="section-detail">
                    Луна отражает вашу эмоциональную природу, то, как вы реагируете на мир, что дает вам чувство безопасности и комфорта. Это ваша душа, ваши привычки и инстинкты.
                </p>
                <p class="section-detail">
                    ${this.getMoonInHouseDescription(moonSign, moonHouse)} Положение Луны в ${moonHouse} доме показывает, где вы ищете эмоциональную защиту и в какой сфере жизни ваши чувства проявляются наиболее интенсивно.
                </p>
                <p class="section-detail">
                    Ваша Луна в стихии ${this.getElement(moonSign)} делает ваши эмоции ${this.getEmotionalQuality(moonSign)}. В стрессовых ситуациях вы склонны ${this.getEmotionalReaction(moonSign)}.
                </p>
                <p class="section-detail">
                    <em>Как обрести эмоциональный комфорт:</em> ${this.getMoonAdvice(moonSign, moonHouse)}
                </p>
            </div>
            
            <!-- РАЗДЕЛ 4: БАЛАНС СТИХИЙ -->
            <div class="interpretation-section elements-section">
                <h4>🔥💧🌍💨 БАЛАНС СТИХИЙ В ВАШЕЙ КАРТЕ</h4>
                <p class="section-detail">
                    ${analysis}
                </p>
                 <div class="elements-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 20px 0;">
                     <div style="text-align: center; padding: 10px; background: rgba(255, 77, 77, 0.1); border-radius: 8px;">
                        <span style="font-size: 24px;">🔥</span>
                        <div><strong>Огонь</strong></div>
                        <div>${this.countElement('fire', planets)}%</div>
                    </div>
                    <div style="text-align: center; padding: 10px; background: rgba(77, 255, 77, 0.1); border-radius: 8px;">
                        <span style="font-size: 24px;">🌍</span>
                        <div><strong>Земля</strong></div>
                        <div>${this.countElement('earth', planets)}%</div>
                    </div>
                    <div style="text-align: center; padding: 10px; background: rgba(77, 77, 255, 0.1); border-radius: 8px;">
                        <span style="font-size: 24px;">💨</span>
                        <div><strong>Воздух</strong></div>
                        <div>${this.countElement('air', planets)}%</div>
                    </div>
                    <div style="text-align: center; padding: 10px; background: rgba(77, 255, 255, 0.1); border-radius: 8px;">
                        <span style="font-size: 24px;">💧</span>
                        <div><strong>Вода</strong></div>
                        <div>${this.countElement('water', planets)}%</div>
                    </div>
                </div>
            </div>
            
            <!-- РАЗДЕЛ 5: ПЛАНЕТЫ В ДОМАХ -->
            <div class="interpretation-section planets-houses-section">
                <h4>📊 ПЛАНЕТЫ В ДОМАХ: СФЕРЫ ЖИЗНИ</h4>
                <p class="section-detail">
                    Дома в астрологии показывают конкретные сферы жизни, где планеты проявляют свое влияние. Анализ распределения планет по домам позволяет понять, какие области жизни наиболее активны и требуют вашего внимания.
                </p>
                <div class="planets-houses">
                    ${this.renderPlanetsInHouses(planets)}
                </div>
                <p class="section-detail" style="margin-top: 20px;">
                    ${this.analyzeHouseDistribution(planets)}
                </p>
            </div>
            
            <!-- РАЗДЕЛ 6: КЛЮЧЕВЫЕ АСПЕКТЫ -->
            <div class="interpretation-section aspects-section">
                <h4>⚡ ВЗАИМОДЕЙСТВИЕ ПЛАНЕТ: АСПЕКТЫ</h4>
                <p class="section-detail">
                    Аспекты — это угловые расстояния между планетами, показывающие, как различные части вашей личности взаимодействуют друг с другом. Одни аспекты создают гармонию и таланты, другие — напряжение и вызовы, которые становятся точками роста.
                </p>
                <div class="aspects-interpretation">
                    ${this.renderAspectsInterpretation(aspects)}
                </div>
            </div>
            
            <!-- РАЗДЕЛ 7: ОБЩИЙ ПОРТРЕТ -->
            <div class="interpretation-section summary-section">
                <h4>🌟 СИНТЕЗ: ВАША УНИКАЛЬНАЯ ЛИЧНОСТЬ</h4>
                <p class="summary-text">
                    ${this.renderOverallPortrait(ascSign, sunSign, moonSign, planets, aspects)}
                </p>
                <p class="section-detail" style="margin-top: 20px;">
                    Ваша натальная карта — это не приговор, а карта местности. Звезды указывают направление, но выбор пути всегда остается за вами. Используйте знание о своих сильных сторонах, чтобы реализовать потенциал, и работайте над зонами роста, чтобы стать гармоничной личностью.
                </p>
                <p class="section-detail" style="margin-top: 20px; font-style: italic; color: #c9a54b;">
                    "Познай самого себя, и ты познаешь Вселенную и богов" — Гермес Трисмегист
                </p>
            </div>
        </div>
        `;
    }

    /**
     * Рендеринг расширенного отчета
     */
    renderExpandedReport(data) {
        const planets = data.planets || {};
        const ascendant = data.ascendant || {};
        const ascSign = ascendant.sign || 'Неизвестно';
        const sunSign = planets.sun?.sign || 'Неизвестно';
        const moonSign = planets.moon?.sign || 'Неизвестно';

        return `
        <div class="expanded-report">
            <h3 class="report-section-title">🧠 ПСИХОЛОГИЧЕСКИЙ ПОРТРЕТ</h3>
            <div class="report-section">
                ${this.renderPsychologicalProfile(sunSign, moonSign, ascSign)}
            </div>

            <h3 class="report-section-title">🎯 ВРОЖДЕННЫЕ ТАЛАНТЫ</h3>
            <div class="report-section">
                ${this.renderTalents(planets)}
            </div>

            <h3 class="report-section-title">📊 ПИРАМИДА ПОТРЕБНОСТЕЙ</h3>
            <div class="report-section">
                ${this.renderMaslowPyramid(planets)}
            </div>

            <h3 class="report-section-title">🔄 ЖИЗНЕННЫЕ СЦЕНАРИИ</h3>
            <div class="report-section">
                ${this.renderLifeScenarios(planets)}
            </div>

            <h3 class="report-section-title">💼 БИЗНЕС И КАРЬЕРА</h3>
            <div class="report-section">
                ${this.renderBusinessAdvice(planets)}
            </div>

            <h3 class="report-section-title">⚕️ ЗДОРОВЬЕ И РИСКИ</h3>
            <div class="report-section">
                ${this.renderHealthRisks(planets)}
            </div>

            <h3 class="report-section-title">🌟 ЗАДАЧА ТЕКУЩЕГО ВОПЛОЩЕНИЯ</h3>
            <div class="report-section">
                ${this.renderLifeTask(planets)}
            </div>
        </div>
        `;
    }

    // ========== ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ ==========

    escapeHtml(str) {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    getRulerOfSign(sign) {
        const rulers = {
            'Овен': 'Марс', 'Телец': 'Венера', 'Близнецы': 'Меркурий',
            'Рак': 'Луна', 'Лев': 'Солнце', 'Дева': 'Меркурий',
            'Весы': 'Венера', 'Скорпион': 'Плутон', 'Стрелец': 'Юпитер',
            'Козерог': 'Сатурн', 'Водолей': 'Уран', 'Рыбы': 'Нептун'
        };
        return rulers[sign] || '—';
    }

    getElement(sign) {
        const elements = {
            'Овен': 'Огонь', 'Лев': 'Огонь', 'Стрелец': 'Огонь',
            'Телец': 'Земля', 'Дева': 'Земля', 'Козерог': 'Земля',
            'Близнецы': 'Воздух', 'Весы': 'Воздух', 'Водолей': 'Воздух',
            'Рак': 'Вода', 'Скорпион': 'Вода', 'Рыбы': 'Вода'
        };
        return elements[sign] || '—';
    }

    getAscendantShortDescription(sign) {
        const descriptions = {
            'Овен': 'Вы производите впечатление энергичного, прямолинейного человека.',
            'Телец': 'Вы кажетесь спокойным, надежным, основательным.',
            'Близнецы': 'Вы производите впечатление общительного, любознательного человека.',
            'Рак': 'Вы кажетесь мягким, заботливым, чувствительным.',
            'Лев': 'Вы производите впечатление гордого, щедрого, уверенного.',
            'Дева': 'Вы кажетесь скромным, аналитичным, практичным.',
            'Весы': 'Вы производите впечатление дипломатичного, обаятельного человека.',
            'Скорпион': 'Вы кажетесь интенсивным, загадочным, проницательным.',
            'Стрелец': 'Вы производите впечатление оптимистичного, свободолюбивого человека.',
            'Козерог': 'Вы кажетесь ответственным, серьезным, амбициозным.',
            'Водолей': 'Вы производите впечатление оригинального, независимого человека.',
            'Рыбы': 'Вы кажетесь мечтательным, сострадательным, загадочным.'
        };
        return descriptions[sign] || 'У вас уникальное первое впечатление';
    }

    getAscendantDetailed(sign) {
        const details = {
            'Овен': 'Вы быстро принимаете решения, не боитесь конфликтов и всегда готовы отстаивать свои интересы.',
            'Телец': 'Вы цените стабильность и комфорт. Люди доверяют вам, потому что чувствуют вашу надежность.',
            'Близнецы': 'Вы легко адаптируетесь к любым ситуациям. Ваш ум быстр, а речь убедительна.',
            'Рак': 'Вы очень чувствительны к настроению окружающих. Интуитивно понимаете, что нужно другим.',
            'Лев': 'Вы щедры и великодушны. Любите быть в центре внимания.',
            'Дева': 'Вы внимательны к деталям и стремитесь к совершенству. Люди ценят вашу помощь.',
            'Весы': 'Вы дипломатичны и ищете гармонию во всем. Хорошо понимаете обе стороны любого вопроса.',
            'Скорпион': 'Вы видите людей насквозь. Ваша проницательность может пугать.',
            'Стрелец': 'Вы оптимистичны и всегда смотрите в будущее. Заряжаете других своей верой в лучшее.',
            'Козерог': 'Вы серьезны и целеустремленны. Способны достигать любых высот.',
            'Водолей': 'Вы оригинальны и непредсказуемы. Мыслите нестандартно.',
            'Рыбы': 'Вы эмпатичны и творчески одарены. Чувствуете то, что недоступно другим.'
        };
        return details[sign] || 'Ваш асцендент дает вам уникальное восприятие мира.';
    }

    getAscendantNature(sign) {
        const natures = {
            'Овен': 'энергичным, импульсивным и прямолинейным человеком, который всегда готов к действию',
            'Телец': 'спокойным, надежным и основательным человеком, который ценит стабильность',
            'Близнецы': 'общительным, любознательным и адаптивным человеком, который легко находит общий язык с разными людьми',
            'Рак': 'чувствительным, заботливым и эмоциональным человеком, который интуитивно понимает потребности других',
            'Лев': 'уверенным, щедрым и харизматичным человеком, который привлекает внимание',
            'Дева': 'аналитичным, практичным и внимательным к деталям человеком, который стремится к совершенству',
            'Весы': 'дипломатичным, обаятельным и тактичным человеком, который ищет гармонию во всем',
            'Скорпион': 'интенсивным, страстным и проницательным человеком, который видит суть вещей',
            'Стрелец': 'оптимистичным, свободолюбивым и философски настроенным человеком, который стремится к новым горизонтам',
            'Козерог': 'ответственным, амбициозным и дисциплинированным человеком, который умеет достигать целей',
            'Водолей': 'оригинальным, независимым и прогрессивным человеком, который мыслит нестандартно',
            'Рыбы': 'мечтательным, сострадательным и творческим человеком, который тонко чувствует окружающий мир'
        };
        return natures[sign] || 'уникальной личностью';
    }

    getAscendantAdvice(sign) {
        const advices = {
            'Овен': 'учитесь сдерживать свои импульсы и слушать других, прежде чем действовать. Ваша сила — в инициативе, но мудрость — в терпении.',
            'Телец': 'развивайте гибкость и не бойтесь перемен. Ваша стабильность — опора, но иногда нужно позволять себе спонтанность.',
            'Близнецы': 'учитесь глубине и сосредоточенности. Ваш ум быстр, но иногда важно остановиться и погрузиться в одну тему.',
            'Рак': 'выстраивайте здоровые границы и учитесь заботиться о себе так же, как о других. Ваша эмпатия — дар, но не позволяйте ей истощать вас.',
            'Лев': 'помните, что настоящее лидерство — в умении вдохновлять, а не доминировать. Делитесь светом, но не ослепляйте.',
            'Дева': 'учитесь принимать несовершенство мира и себя. Порядок важен, но жизнь часто прекрасна именно в своей спонтанности.',
            'Весы': 'учитесь принимать решения и доверять своему внутреннему голосу. Баланс — это не только гармония, но и умение делать выбор.',
            'Скорпион': 'учитесь отпускать и прощать. Ваша глубина — сила, но застой в прошлом мешает двигаться вперед.',
            'Стрелец': 'учитесь ответственности и завершению начатого. Ваш энтузиазм заразителен, но важно доводить идеи до реализации.',
            'Козерог': 'учитесь отдыхать и радоваться простым вещам. Ваши амбиции двигают горы, но иногда нужно позволить себе быть просто счастливым.',
            'Водолей': 'учитесь соединять свои идеи с реальностью и учитывать чувства других. Ваши инновации ценны, но они должны служить людям.',
            'Рыбы': 'учитесь различать интуицию и иллюзии. Ваша чувствительность — дар, но важно сохранять связь с реальностью.'
        };
        return advices[sign] || 'следуйте за своей интуицией и доверяйте процессу жизни.';
    }

    getSunDescription(sign) {
        const descriptions = {
            'Овен': 'Вы лидер по природе. Ваша цель — быть первым, начинать новое, проявлять инициативу.',
            'Телец': 'Вы цените стабильность и комфорт. Ваша цель — построить надежный фундамент.',
            'Близнецы': 'Вы любите информацию и общение. Ваша цель — учиться и делиться знаниями.',
            'Рак': 'Вы заботливы и эмоциональны. Ваша цель — создать семью и безопасное пространство.',
            'Лев': 'Вы творческий лидер. Ваша цель — самовыражаться и дарить радость.',
            'Дева': 'Вы аналитичны и практичны. Ваша цель — служить и совершенствовать мир.',
            'Весы': 'Вы дипломатичны и ищете гармонию. Ваша цель — строить отношения и создавать красоту.',
            'Скорпион': 'Вы страстны и глубоки. Ваша цель — трансформироваться и исследовать тайны.',
            'Стрелец': 'Вы оптимистичны и ищете смыслы. Ваша цель — путешествовать и учить.',
            'Козерог': 'Вы амбициозны и ответственны. Ваша цель — достигать высот и строить карьеру.',
            'Водолей': 'Вы независимы и оригинальны. Ваша цель — изобретать и менять мир.',
            'Рыбы': 'Вы мечтательны и сострадательны. Ваша цель — творить и соединяться с высшим.'
        };
        return descriptions[sign] || 'Ваша солнечная природа уникальна.';
    }

    getSunInHouseDescription(sign, house) {
        const descriptions = {
            'Овен': `Солнце в ${house} доме усиливает вашу инициативность и лидерские качества в сфере этого дома.`,
            'Телец': `Солнце в ${house} доме дает вам упорство и практичность в делах этого дома.`,
            'Близнецы': `Солнце в ${house} доме наделяет вас коммуникабельностью и любознательностью.`,
            'Рак': `Солнце в ${house} доме делает вас заботливым и эмоционально вовлеченным.`,
            'Лев': `Солнце в ${house} доме приносит творчество, щедрость и желание быть в центре внимания.`,
            'Дева': `Солнце в ${house} доме дает аналитический подход и внимание к деталям.`,
            'Весы': `Солнце в ${house} доме приносит дипломатичность и стремление к гармонии.`,
            'Скорпион': `Солнце в ${house} доме наделяет вас страстностью и глубиной.`,
            'Стрелец': `Солнце в ${house} доме дает оптимизм и стремление к расширению горизонтов.`,
            'Козерог': `Солнце в ${house} доме приносит ответственность и амбициозность.`,
            'Водолей': `Солнце в ${house} доме наделяет вас оригинальностью и независимостью.`,
            'Рыбы': `Солнце в ${house} доме дает сострадательность и творческую чувствительность.`
        };
        return descriptions[sign] || `Солнце в ${house} доме проявляется через энергию знака ${sign}.`;
    }

    getSunAdvice(sign, house) {
        const advices = {
            'Овен': 'не бойтесь быть первым, но помните, что за лидером должны идти, а не бежать.',
            'Телец': 'стройте надежный фундамент, но не забывайте, что истинное богатство — в гармонии с собой.',
            'Близнецы': 'делитесь знаниями, но не распыляйтесь — глубина важнее широты.',
            'Рак': 'создавайте безопасное пространство для себя и близких, но не прячьтесь в раковину от мира.',
            'Лев': 'сияйте ярко, но не ослепляйте. Ваша задача — вдохновлять, а не доминировать.',
            'Дева': 'служите миру своим талантом, но не забывайте о себе. Совершенство — в принятии несовершенства.',
            'Весы': 'стройте гармоничные отношения, но не теряйте себя в партнере. Баланс начинается внутри.',
            'Скорпион': 'трансформируйтесь через кризисы, но не застревайте в драме. Ваша сила — в умении возрождаться.',
            'Стрелец': 'расширяйте горизонты, но возвращайтесь к истокам. Мудрость — в соединении нового с вечным.',
            'Козерог': 'достигайте вершин, но помните, что настоящий успех — в умении радоваться пути.',
            'Водолей': 'меняйте мир своими идеями, но не забывайте о человеческом сердце.',
            'Рыбы': 'плывите по течению интуиции, но держите руль в руках. Мечты должны становиться реальностью.'
        };
        return advices[sign] || 'следуйте за своим сердцем и доверяйте внутреннему свету.';
    }

    getMoonDescription(sign) {
        const descriptions = {
            'Овен': 'Ваши эмоции быстры и импульсивны. Вы остро реагируете, но быстро остываете.',
            'Телец': 'Ваши эмоции стабильны. Вам нужно чувство безопасности и комфорта.',
            'Близнецы': 'Ваши эмоции изменчивы. Вы ищете понимания через общение.',
            'Рак': 'Ваши эмоции глубоки. Вы очень чувствительны и нуждаетесь в защите.',
            'Лев': 'Ваши эмоции ярки. Вам нужно признание и восхищение.',
            'Дева': 'Ваши эмоции аналитичны. Вы тревожитесь о мелочах.',
            'Весы': 'Ваши эмоции гармоничны. Вам нужны мир и красивое окружение.',
            'Скорпион': 'Ваши эмоции интенсивны. Вы чувствуете глубоко, не прощаете предательства.',
            'Стрелец': 'Ваши эмоции оптимистичны. Вам нужна свобода и новые впечатления.',
            'Козерог': 'Ваши эмоции сдержаны. Вы контролируете чувства, боитесь показать уязвимость.',
            'Водолей': 'Ваши эмоции необычны. Вы реагируете нестандартно, цените свободу.',
            'Рыбы': 'Ваши эмоции безграничны. Вы эмпатичны, чувствуете всех и всё.'
        };
        return descriptions[sign] || 'Ваша эмоциональная природа глубока.';
    }

    getMoonInHouseDescription(sign, house) {
        const descriptions = {
            'Овен': `Луна в ${house} доме делает ваши эмоции импульсивными и прямыми.`,
            'Телец': `Луна в ${house} доме дает стабильность и потребность в комфорте.`,
            'Близнецы': `Луна в ${house} доме приносит изменчивость и потребность в общении.`,
            'Рак': `Луна в ${house} доме усиливает чувствительность и потребность в защите.`,
            'Лев': `Луна в ${house} доме делает эмоции яркими и требует признания.`,
            'Дева': `Луна в ${house} доме дает аналитический подход к чувствам.`,
            'Весы': `Луна в ${house} доме приносит потребность в гармонии и партнерстве.`,
            'Скорпион': `Луна в ${house} доме делает эмоции глубокими и интенсивными.`,
            'Стрелец': `Луна в ${house} доме дает оптимизм и потребность в свободе.`,
            'Козерог': `Луна в ${house} доме приносит сдержанность и ответственность.`,
            'Водолей': `Луна в ${house} доме делает эмоции необычными и независимыми.`,
            'Рыбы': `Луна в ${house} доме дает безграничную эмпатию и чувствительность.`
        };
        return descriptions[sign] || `Луна в ${house} доме проявляется через эмоциональность знака ${sign}.`;
    }

    getMoonAdvice(sign, house) {
        const advices = {
            'Овен': 'давайте эмоциям выход через физическую активность, но не действуйте сгоряча.',
            'Телец': 'создавайте уют и окружайте себя приятными вещами, но не привязывайтесь к материальному.',
            'Близнецы': 'общайтесь и делитесь чувствами, но не подменяйте эмоции информацией.',
            'Рак': 'заботьтесь о себе так же, как о других. Ваша чувствительность — дар, а не бремя.',
            'Лев': 'позволяйте себе сиять и получать признание, но не ставьте самооценку в зависимость от чужого мнения.',
            'Дева': 'принимайте свои чувства без анализа. Не все нужно систематизировать.',
            'Весы': 'ищите гармонию в отношениях, но не теряйте себя в партнере.',
            'Скорпион': 'позволяйте себе глубокие чувства, но не зацикливайтесь на негативе.',
            'Стрелец': 'ищите вдохновение в путешествиях и новых впечатлениях, но не убегайте от реальности.',
            'Козерог': 'разрешите себе проявлять эмоции. Сила — не в их подавлении, а в принятии.',
            'Водолей': 'не бойтесь быть непохожим в своих чувствах. Ваша уникальность — ваша сила.',
            'Рыбы': 'доверяйте своей интуиции, но проверяйте реальностью. Не все мечты должны оставаться мечтами.'
        };
        return advices[sign] || 'слушайте свое сердце и доверяйте интуиции.';
    }

    getElementQuality(sign) {
        const qualities = {
            'Овен': 'страстность и инициативность', 'Лев': 'щедрость и креативность', 'Стрелец': 'оптимизм и энтузиазм',
            'Телец': 'упорство и практичность', 'Дева': 'аналитичность и усердие', 'Козерог': 'дисциплину и целеустремленность',
            'Близнецы': 'гибкость и коммуникабельность', 'Весы': 'дипломатичность и чувство гармонии', 'Водолей': 'оригинальность и независимость',
            'Рак': 'эмоциональность и заботливость', 'Скорпион': 'страстность и глубину', 'Рыбы': 'интуицию и сострадание'
        };
        return qualities[sign] || 'уникальные качества';
    }

    getElementApproach(sign) {
        const approaches = {
            'Овен': 'интуицию и спонтанность', 'Лев': 'творчество и самовыражение', 'Стрелец': 'философский подход и поиск смысла',
            'Телец': 'терпение и настойчивость', 'Дева': 'анализ и планирование', 'Козерог': 'дисциплину и стратегию',
            'Близнецы': 'общение и сбор информации', 'Весы': 'дипломатию и поиск компромиссов', 'Водолей': 'инновации и нестандартные решения',
            'Рак': 'эмпатию и интуитивное понимание', 'Скорпион': 'глубокое исследование и трансформацию', 'Рыбы': 'интуицию и творческое воображение'
        };
        return approaches[sign] || 'свой уникальный подход';
    }

    getEmotionalQuality(sign) {
        const qualities = {
            'Овен': 'импульсивными и страстными', 'Лев': 'яркими и драматичными', 'Стрелец': 'оптимистичными и открытыми',
            'Телец': 'стабильными и глубокими', 'Дева': 'аналитичными и тревожными', 'Козерог': 'сдержанными и ответственными',
            'Близнецы': 'изменчивыми и любопытными', 'Весы': 'гармоничными и дипломатичными', 'Водолей': 'необычными и отстраненными',
            'Рак': 'глубокими и чувствительными', 'Скорпион': 'интенсивными и страстными', 'Рыбы': 'безграничными и сострадательными'
        };
        return qualities[sign] || 'уникальными';
    }

    getEmotionalReaction(sign) {
        const reactions = {
            'Овен': 'реагировать импульсивно и быстро остывать',
            'Телец': 'замыкаться в себе и искать комфорт',
            'Близнецы': 'искать информацию и обсуждать с другими',
            'Рак': 'уходить в свою скорлупу и нуждаться в поддержке',
            'Лев': 'искать признания и внимания',
            'Дева': 'анализировать ситуацию и искать решение',
            'Весы': 'искать компромисс и восстанавливать гармонию',
            'Скорпион': 'погружаться в глубину и искать истину',
            'Стрелец': 'искать новые горизонты и возможности',
            'Козерог': 'брать ответственность и действовать',
            'Водолей': 'отстраняться и искать нестандартное решение',
            'Рыбы': 'растворяться в эмоциях и искать утешение'
        };
        return reactions[sign] || 'реагировать своим уникальным способом';
    }

    countElement(element, planets) {
        const elementMap = {
            'fire': ['Овен', 'Лев', 'Стрелец'],
            'earth': ['Телец', 'Дева', 'Козерог'],
            'air': ['Близнецы', 'Весы', 'Водолей'],
            'water': ['Рак', 'Скорпион', 'Рыбы']
        };

        let count = 0;
        let total = 0;

        for (const planet of Object.values(planets)) {
            if (planet && planet.sign) {
                total++;
                if (elementMap[element].includes(planet.sign)) count++;
            }
        }

        return total > 0 ? Math.round((count / total) * 100) : 0;
    }

    analyzeElementBalance(planets) {
        const fire = this.countElement('fire', planets);
        const earth = this.countElement('earth', planets);
        const air = this.countElement('air', planets);
        const water = this.countElement('water', planets);

        let analysis = '';

        if (fire > 40) analysis += 'В вашей карте преобладает стихия Огня. Вы энергичны, страстны и инициативны. Легко загораетесь новыми идеями и увлекаете за собой других.';
        else if (earth > 40) analysis += 'В вашей карте преобладает стихия Земли. Вы практичны, надежны и основательны. Умеете создавать стабильность и достигать материальных целей.';
        else if (air > 40) analysis += 'В вашей карте преобладает стихия Воздуха. Вы коммуникабельны, интеллектуальны и любознательны. Легко усваиваете информацию и находите общий язык с разными людьми.';
        else if (water > 40) analysis += 'В вашей карте преобладает стихия Воды. Вы эмоциональны, интуитивны и чувствительны. Глубоко понимаете себя и других, обладаете богатым внутренним миром.';
        else analysis += 'В вашей карте представлены все стихии в гармоничном сочетании. Это дает вам многогранность и способность адаптироваться к любым ситуациям.';

        if (fire === 0) analysis += ' Недостаток Огня может проявляться как нехватка инициативы и энтузиазма.';
        if (earth === 0) analysis += ' Недостаток Земли может проявляться как оторванность от реальности и практических вопросов.';
        if (air === 0) analysis += ' Недостаток Воздуха может проявляться как трудности в коммуникации и объективной оценке.';
        if (water === 0) analysis += ' Недостаток Воды может проявляться как эмоциональная холодность и нехватка эмпатии.';

        return analysis;
    }

    analyzeHouseDistribution(planets) {
        const houseCount = {};
        for (const planet of Object.values(planets)) {
            if (planet && planet.longitude !== undefined) {
                const house = Math.floor(planet.longitude / 30) + 1;
                houseCount[house] = (houseCount[house] || 0) + 1;
            }
        }

        let maxHouse = null;
        let maxCount = 0;

        for (let i = 1; i <= 12; i++) {
            if (houseCount[i] > maxCount) {
                maxCount = houseCount[i];
                maxHouse = i;
            }
        }

        const houseMeanings = {
            1: 'личности и самовыражения',
            2: 'финансов и самооценки',
            3: 'общения и обучения',
            4: 'дома и семьи',
            5: 'творчества и любви',
            6: 'работы и здоровья',
            7: 'партнерства и брака',
            8: 'трансформации и кризисов',
            9: 'путешествий и философии',
            10: 'карьеры и призвания',
            11: 'друзей и надежд',
            12: 'подсознания и тайн'
        };

        if (maxHouse) {
            return `Наибольшее скопление планет наблюдается в ${maxHouse} доме (${houseMeanings[maxHouse] || '—'}). Это указывает на то, что сфера жизни, связанная с этим домом, будет для вас наиболее важной и насыщенной событиями. Здесь вы можете реализовать свой потенциал и получить наибольший опыт.`;
        }
        return 'Планеты равномерно распределены по домам, что дает вам многогранность интересов.';
    }

    renderPlanetsInHouses(planets) {
        const symbols = {
            sun: '☉', moon: '☽', mercury: '☿', venus: '♀',
            mars: '♂', jupiter: '♃', saturn: '♄',
            uranus: '♅', neptune: '♆', pluto: '♇'
        };

        const names = {
            sun: 'Солнце', moon: 'Луна', mercury: 'Меркурий', venus: 'Венера',
            mars: 'Марс', jupiter: 'Юпитер', saturn: 'Сатурн',
            uranus: 'Уран', neptune: 'Нептун', pluto: 'Плутон'
        };

        const planetMeanings = {
            sun: 'вашу сущность, эго, жизненную силу',
            moon: 'ваши эмоции, подсознание, интуицию',
            mercury: 'ваш ум, речь, способность к обучению',
            venus: 'вашу способность любить, ценности, чувство прекрасного',
            mars: 'вашу энергию, страсть, способность действовать',
            jupiter: 'вашу удачу, расширение, оптимизм',
            saturn: 'ваши ограничения, ответственность, дисциплину',
            uranus: 'вашу оригинальность, независимость, нестандартное мышление',
            neptune: 'вашу интуицию, фантазию, духовные устремления',
            pluto: 'вашу способность к трансформации, глубинную силу'
        };

        const houseMeanings = {
            1: 'личности, внешности, самовыражения',
            2: 'финансов, ценностей, самооценки',
            3: 'общения, обучения, братьев/сестер',
            4: 'дома, семьи, корней, прошлого',
            5: 'творчества, любви, детей, удовольствий',
            6: 'работы, здоровья, служения',
            7: 'партнерства, брака, отношений',
            8: 'трансформации, секса, чужих денег',
            9: 'путешествий, философии, образования',
            10: 'карьеры, призвания, авторитета',
            11: 'друзей, надежд, сообществ',
            12: 'подсознания, тайн, изоляции'
        };

        const planetOrder = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];

        let html = '';

        for (const key of planetOrder) {
            const planet = planets[key];
            if (!planet) continue;

            const houseNum = Math.floor(planet.longitude / 30) + 1;
            const houseDesc = houseMeanings[houseNum] || 'жизни';
            const planetMeaning = planetMeanings[key] || 'вашу жизнь';
            const planetName = names[key];
            const symbol = symbols[key];

            html += `
            <div class="planet-house-item" style="margin-bottom: 15px; padding: 15px; background: rgba(0,0,0,0.2); border-radius: 8px; border-left: 3px solid #c9a54b;">
                <div style="display: flex; align-items: center; margin-bottom: 8px;">
                    <span class="planet-symbol" style="font-size: 1.5rem; color: #c9a54b; min-width: 40px;">${symbol}</span>
                    <span style="font-weight: 600; color: #fff;">${planetName}</span>
                    <span style="margin-left: 10px; color: #c9a54b;">в ${houseNum} доме</span>
                </div>
                <div style="color: #a0a0b0; line-height: 1.6;">
                    ${planetName} в ${houseNum} доме (${houseDesc}) влияет на ${planetMeaning}. Это означает, что в сфере ${houseDesc} вы проявляете качества знака ${planet.sign} — ${this.getSignShortDescription(planet.sign)}. 
                    ${this.getHousePlanetAdvice(key, houseNum)}
                </div>
            </div>
            `;
        }

        return html;
    }

    getSignShortDescription(sign) {
        const desc = {
            'Овен': 'напористость, инициативность, импульсивность',
            'Телец': 'упорство, практичность, любовь к комфорту',
            'Близнецы': 'коммуникабельность, любознательность, гибкость',
            'Рак': 'эмоциональность, заботливость, чувствительность',
            'Лев': 'творчество, лидерство, щедрость',
            'Дева': 'аналитичность, практичность, внимание к деталям',
            'Весы': 'дипломатичность, стремление к гармонии',
            'Скорпион': 'страстность, глубина, проницательность',
            'Стрелец': 'оптимизм, свободолюбие, философский склад ума',
            'Козерог': 'амбициозность, ответственность, дисциплина',
            'Водолей': 'оригинальность, независимость, гуманизм',
            'Рыбы': 'интуиция, сострадание, творческое воображение'
        };
        return desc[sign] || 'уникальные качества';
    }

    getHousePlanetAdvice(planet, house) {
        const advices = {
            'sun': {
                1: 'Здесь важно научиться проявлять себя, не подавляя других.',
                2: 'Развивайте самооценку через материальные достижения, но не привязывайтесь к ним.',
                3: 'Ищите свой голос и учитесь доносить мысли до окружающих.',
                4: 'Создайте прочный фундамент в семье, чтобы чувствовать опору в жизни.',
                5: 'Творчество — ваш путь к самореализации. Не бойтесь проявлять себя.',
                6: 'Найдите дело, которое приносит удовлетворение, и служите ему.',
                7: 'Отношения с партнером помогут вам лучше понять себя.',
                8: 'Не бойтесь кризисов — через них происходит ваше возрождение.',
                9: 'Путешествия и обучение расширят ваше сознание.',
                10: 'Ваше призвание — в достижении социального признания.',
                11: 'Единомышленники и друзья помогут вам реализовать мечты.',
                12: 'Важно находить время для уединения и внутренней работы.'
            },
            'moon': {
                1: 'Ваши эмоции проявляются открыто. Учитесь управлять ими, не подавляя.',
                2: 'Эмоциональный комфорт связан с материальной стабильностью.',
                3: 'Общайтесь и делитесь чувствами — это приносит облегчение.',
                4: 'Дом и семья — ваш главный источник эмоционального комфорта.',
                5: 'Творчество помогает выразить эмоции наилучшим образом.',
                6: 'Забота о здоровье и ежедневный порядок успокаивают вас.',
                7: 'В партнерстве вы ищете эмоциональную защиту.',
                8: 'Глубокие эмоциональные трансформации — ваш путь к целостности.',
                9: 'Новые впечатления питают вашу душу.',
                10: 'Ваша эмоциональная безопасность связана с социальным статусом.',
                11: 'Друзья и единомышленники дают вам чувство принадлежности.',
                12: 'Вам необходимо время от времени уходить в себя для восстановления.'
            }
        };

        if (advices[planet] && advices[planet][house]) {
            return advices[planet][house];
        }

        const generalAdvices = {
            'mercury': 'Развивайте свой ум и учитесь ясно выражать мысли.',
            'venus': 'Учитесь строить гармоничные отношения и ценить красоту.',
            'mars': 'Направляйте свою энергию в конструктивное русло.',
            'jupiter': 'Расширяйте горизонты и верьте в лучшее.',
            'saturn': 'Дисциплина и ответственность приведут к успеху.',
            'uranus': 'Не бойтесь быть оригинальным и менять правила.',
            'neptune': 'Доверяйте интуиции, но проверяйте реальностью.',
            'pluto': 'Трансформации сделают вас сильнее.'
        };

        return generalAdvices[planet] || 'Используйте энергию этой планеты для роста и развития.';
    }

    renderAspectsInterpretation(aspects) {
        if (!aspects || aspects.length === 0) {
            return '<p>Нет значимых аспектов в вашей карте.</p>';
        }

        const aspectColors = {
            conjunction: '#ff4d4d',
            opposition: '#4d4dff',
            trine: '#4dff4d',
            square: '#ff4dff',
            sextile: '#ffff4d'
        };

        const typeDesc = {
            conjunction: 'соединение — энергии планет сливаются, создавая мощный фокус. Это ваша ключевая точка силы, где таланты проявляются наиболее ярко.',
            opposition: 'оппозиция — напряжение и противостояние двух начал. Это вызов, требующий осознания и поиска баланса.',
            trine: 'трин — гармоничный поток энергии. Природный талант, дающийся без усилий.',
            square: 'квадратура — конфликт и вызов, движущая сила развития. Преодолевая препятствия, вы растете.',
            sextile: 'секстиль — возможность и потенциал. Талант, который нужно развивать осознанно.'
        };

        let html = '';
        const sortedAspects = aspects.slice(0, 10);

        for (const aspect of sortedAspects) {
            const color = aspectColors[aspect.type] || '#c9a54b';
            const planet1Meaning = this.getPlanetMeaning(aspect.planet1);
            const planet2Meaning = this.getPlanetMeaning(aspect.planet2);

            html += `
            <div class="aspect-item-detailed ${aspect.type}" style="margin-bottom: 20px; padding: 15px; background: rgba(0,0,0,0.2); border-radius: 8px; border-left: 4px solid ${color};">
                <div style="display: flex; align-items: center; margin-bottom: 8px;">
                    <span style="font-weight: 600; color: #fff;">${this.escapeHtml(aspect.planet1)}</span>
                    <span style="margin: 0 10px; color: #c9a54b;">↔</span>
                    <span style="font-weight: 600; color: #fff;">${this.escapeHtml(aspect.planet2)}</span>
                    <span style="margin-left: 10px; color: #c9a54b;">${this.escapeHtml(aspect.name)} (орб: ${this.escapeHtml(aspect.orb)}°)</span>
                </div>
                <p style="color: #a0a0b0; line-height: 1.6; margin-bottom: 8px;">
                    <strong>${this.escapeHtml(aspect.planet1)}</strong> (${planet1Meaning}) и <strong>${this.escapeHtml(aspect.planet2)}</strong> (${planet2Meaning}) образуют ${typeDesc[aspect.type] || 'аспект'}.
                </p>
                <p style="color: #a0a0b0; line-height: 1.6; font-style: italic;">
                    ${this.escapeHtml(aspect.description)}
                </p>
            </div>
            `;
        }

        return html;
    }

    getPlanetMeaning(planet) {
        const meanings = {
            'Солнце': 'ваша сущность, эго, жизненная сила',
            'Луна': 'ваши эмоции, подсознание, интуиция',
            'Меркурий': 'ваш ум, речь, способность к обучению',
            'Венера': 'способность любить, ценности, чувство прекрасного',
            'Марс': 'энергия, страсть, способность действовать',
            'Юпитер': 'удача, расширение, оптимизм',
            'Сатурн': 'ограничения, ответственность, дисциплина',
            'Уран': 'оригинальность, независимость, нестандартное мышление',
            'Нептун': 'интуиция, фантазия, духовные устремления',
            'Плутон': 'способность к трансформации, глубинная сила'
        };
        return meanings[planet] || 'ваша планета';
    }

    renderOverallPortrait(ascSign, sunSign, moonSign, planets, aspects) {
        const ascElement = this.getElement(ascSign);
        const sunElement = this.getElement(sunSign);
        const moonElement = this.getElement(moonSign);

        let portrait = `Вы — человек, в котором сочетаются `;

        if (ascElement === sunElement && sunElement === moonElement) {
            portrait += `трижды усиленная стихия ${ascElement}. Это дает мощную концентрацию энергии и целостность натуры.`;
        } else if (ascElement === sunElement) {
            portrait += `гармонию сущности и эмоций в стихии ${sunElement}, но внешне проявляете себя как ${ascElement}. Вы чувствуете и осознаете себя в одном ключе, но внешняя маска часто не соответствует внутреннему содержанию. Людям может быть сложно понять вас сразу.`;
        } else if (sunElement === moonElement) {
            portrait += `гармонию сущности и эмоций в стихии ${sunElement}, но внешне проявляете себя как ${ascElement}.`;
        } else {
            portrait += `разные стихии: внешность ${ascElement}, сущность ${sunElement}, эмоции ${moonElement}. Вы многогранны и сложны.`;
        }

        if (aspects && aspects.length > 5) {
            portrait += ` В вашей карте много аспектов, что указывает на насыщенную внутреннюю жизнь и множество талантов. Вы сложная и многогранная личность, постоянно находящаяся в процессе развития.`;
        } else if (aspects && aspects.length < 3) {
            portrait += ` В вашей карте немного аспектов, что говорит о целостности и простоте вашей натуры. Вы не склонны к внутренним конфликтам и действуете прямо.`;
        }

        portrait += ` Ваш асцендент в ${ascSign} говорит о том, что ${this.getAscendantShortDescription(ascSign).toLowerCase()}`;
        portrait += `. Ваша сущность (Солнце) в ${sunSign}: ${this.getSunDescription(sunSign).toLowerCase()}`;
        portrait += `. Ваши эмоции (Луна) в ${moonSign}: ${this.getMoonDescription(moonSign).toLowerCase()}`;

        return portrait;
    }

    renderPsychologicalProfile(sunSign, moonSign, ascSign) {
        return `
            <p><strong>Солнце в ${this.escapeHtml(sunSign)}:</strong> ${this.getSunDescription(sunSign)}</p>
            <p><strong>Луна в ${this.escapeHtml(moonSign)}:</strong> ${this.getMoonDescription(moonSign)}</p>
            <p><strong>Асцендент в ${this.escapeHtml(ascSign)}:</strong> ${this.getAscendantShortDescription(ascSign)}</p>
            <p class="section-detail">${this.getAscendantDetailed(ascSign)}</p>
        `;
    }

    renderTalents(planets) {
        const talents = [];
        const sun = planets.sun;
        const moon = planets.moon;

        if (sun) {
            const sunSign = sun.sign;
            if (sunSign === 'Лев' || sunSign === 'Овен' || sunSign === 'Стрелец') {
                talents.push('🔥 Лидерские качества, умение вдохновлять и вести за собой');
            }
            if (sunSign === 'Телец' || sunSign === 'Дева' || sunSign === 'Козерог') {
                talents.push('🌱 Практичность, выносливость, умение создавать стабильность');
            }
            if (sunSign === 'Близнецы' || sunSign === 'Весы' || sunSign === 'Водолей') {
                talents.push('💬 Коммуникабельность, дипломатичность, умение находить общий язык');
            }
            if (sunSign === 'Рак' || sunSign === 'Скорпион' || sunSign === 'Рыбы') {
                talents.push('💧 Эмпатия, интуиция, глубокая эмоциональная чувствительность');
            }
        }

        talents.push('🎯 Стратегическое мышление, способность видеть общую картину');
        talents.push('⚡ Выносливость, способность восстанавливаться из любых кризисов');

        const sunLong = sun?.longitude || 0;
        const moonLong = moon?.longitude || 0;
        const uniqueIndex = Math.floor((sunLong + moonLong) % 5);
        const uniqueTalents = [
            '🔮 Интуитивное понимание скрытых закономерностей',
            '🌈 Умение находить нестандартные решения',
            '🎭 Природная харизма и артистизм',
            '🧩 Способность соединять разрозненные идеи',
            '🌉 Талант быть связующим звеном между людьми'
        ];
        talents.push(uniqueTalents[uniqueIndex]);

        return `<ul class="talents-list">${talents.slice(0, 5).map(t => `<li>✨ ${t}</li>`).join('')}</ul>`;
    }

    renderMaslowPyramid(planets) {
        let physiology = 50;
        let safety = 50;
        let belonging = 50;
        let esteem = 50;
        let selfActualization = 50;

        const sun = planets.sun;
        const moon = planets.moon;
        const venus = planets.venus;
        const mars = planets.mars;
        const saturn = planets.saturn;

        if (sun) {
            const sunInfluence = (sun.longitude % 30) / 30 * 30;
            selfActualization += sunInfluence;
            esteem += sunInfluence / 2;
        }

        if (moon) {
            const moonInfluence = (moon.longitude % 30) / 30 * 25;
            belonging += moonInfluence;
            safety += moonInfluence / 2;
        }

        if (venus) {
            const venusInfluence = (venus.longitude % 30) / 30 * 20;
            belonging += venusInfluence;
            esteem += venusInfluence;
        }

        if (mars) {
            const marsInfluence = (mars.longitude % 30) / 30 * 25;
            esteem += marsInfluence;
            physiology += marsInfluence / 2;
        }

        if (saturn) {
            const saturnInfluence = (saturn.longitude % 30) / 30 * 30;
            safety += saturnInfluence;
            physiology += saturnInfluence / 2;
        }

        physiology = Math.min(95, Math.max(20, Math.round(physiology)));
        safety = Math.min(95, Math.max(20, Math.round(safety)));
        belonging = Math.min(95, Math.max(20, Math.round(belonging)));
        esteem = Math.min(95, Math.max(20, Math.round(esteem)));
        selfActualization = Math.min(95, Math.max(20, Math.round(selfActualization)));

        const max = Math.max(selfActualization, esteem, belonging, safety, physiology);
        let mainMotivation = '';
        if (max === selfActualization) mainMotivation = 'самореализация и творческое самовыражение';
        else if (max === esteem) mainMotivation = 'признание и уважение';
        else if (max === belonging) mainMotivation = 'отношения и принадлежность к группе';
        else if (max === safety) mainMotivation = 'безопасность и стабильность';
        else mainMotivation = 'физиологические потребности';

        return `
            <div class="pyramid-container">
                <div class="pyramid-bar">
                    <div class="pyramid-level" style="height: ${selfActualization}%">
                        <span class="level-label">Самореализация</span>
                        <span class="level-value">${selfActualization}%</span>
                    </div>
                    <div class="pyramid-level" style="height: ${esteem}%">
                        <span class="level-label">Уважение</span>
                        <span class="level-value">${esteem}%</span>
                    </div>
                    <div class="pyramid-level" style="height: ${belonging}%">
                        <span class="level-label">Принадлежность</span>
                        <span class="level-value">${belonging}%</span>
                    </div>
                    <div class="pyramid-level" style="height: ${safety}%">
                        <span class="level-label">Безопасность</span>
                        <span class="level-value">${safety}%</span>
                    </div>
                    <div class="pyramid-level" style="height: ${physiology}%">
                        <span class="level-label">Физиология</span>
                        <span class="level-value">${physiology}%</span>
                    </div>
                </div>
                <p class="pyramid-desc">Ваша основная мотивация — <strong>${mainMotivation}</strong>.</p>
            </div>
        `;
    }

    renderLifeScenarios(planets) {
        let family = 20;
        let info = 20;
        let social = 20;
        let creative = 20;
        let spiritual = 20;

        const moon = planets.moon;
        const venus = planets.venus;
        const mercury = planets.mercury;
        const jupiter = planets.jupiter;
        const saturn = planets.saturn;
        const sun = planets.sun;

        if (moon) family += (moon.longitude % 30) / 30 * 25;
        if (venus) {
            family += (venus.longitude % 30) / 30 * 15;
            creative += (venus.longitude % 30) / 30 * 15;
        }
        if (mercury) info += (mercury.longitude % 30) / 30 * 30;
        if (jupiter) social += (jupiter.longitude % 30) / 30 * 25;
        if (saturn) social += (saturn.longitude % 30) / 30 * 20;
        if (sun) creative += (sun.longitude % 30) / 30 * 25;

        const total = family + info + social + creative + spiritual;
        family = Math.round(family / total * 100);
        info = Math.round(info / total * 100);
        social = Math.round(social / total * 100);
        creative = Math.round(creative / total * 100);
        spiritual = Math.round(spiritual / total * 100);

        const scenarios = [
            { name: 'Семейно-бытовой', value: family },
            { name: 'Информационный', value: info },
            { name: 'Социальный', value: social },
            { name: 'Творческий', value: creative },
            { name: 'Духовный', value: spiritual }
        ];
        const dominant = scenarios.reduce((max, item) => item.value > max.value ? item : max);

        return `
            <div class="scenarios-container">
                <table class="scenarios-table">
                    <tbody>
                        <tr><td class="scenario-color" style="background: #c9a54b;"></td><td class="scenario-name">Семейно-бытовой</td><td class="scenario-desc">еда, быт, отношения, уют</td><td class="scenario-value">${family}%</td></tr>
                        <tr><td class="scenario-color" style="background: #4d4dff;"></td><td class="scenario-name">Информационный</td><td class="scenario-desc">учёба, общение, новые знакомства</td><td class="scenario-value">${info}%</td></tr>
                        <tr><td class="scenario-color" style="background: #4dff4d;"></td><td class="scenario-name">Социальный</td><td class="scenario-desc">карьера, власть, достижения</td><td class="scenario-value">${social}%</td></tr>
                        <tr><td class="scenario-color" style="background: #ff4dff;"></td><td class="scenario-name">Творческий</td><td class="scenario-desc">самовыражение, хобби, искусство</td><td class="scenario-value">${creative}%</td></tr>
                        <tr><td class="scenario-color" style="background: #ff4d4d;"></td><td class="scenario-name">Духовный</td><td class="scenario-desc">поиск смысла, саморазвитие</td><td class="scenario-value">${spiritual}%</td></tr>
                    </tbody>
                </table>
                <p class="scenarios-summary">Преобладает <strong>${dominant.name} сценарий</strong> (${dominant.value}%).</p>
            </div>
        `;
    }

    renderBusinessAdvice(planets) {
        const sun = planets.sun;
        const moon = planets.moon;
        const mercury = planets.mercury;
        const venus = planets.venus;
        const mars = planets.mars;

        const sunSign = sun?.sign || 'Неизвестно';
        const moonSign = moon?.sign || 'Неизвестно';
        const mercurySign = mercury?.sign || 'Неизвестно';
        const venusSign = venus?.sign || 'Неизвестно';
        const marsSign = mars?.sign || 'Неизвестно';

        let advice = '';
        let directions = [];
        let incomeSources = [];

        if (sunSign === 'Овен' || sunSign === 'Лев' || sunSign === 'Стрелец') {
            advice = 'Вам подходят руководящие должности, собственный бизнес, сферы, где нужна инициатива и лидерство.';
            directions.push('🏢 Управление', '🚀 Стартапы', '🔥 Мотивационные проекты');
            incomeSources.push('Лидерство', 'Инициатива', 'Предпринимательство');
        } else if (sunSign === 'Телец' || sunSign === 'Дева' || sunSign === 'Козерог') {
            advice = 'Вам подходят финансы, недвижимость, стабильные компании с четкой структурой.';
            directions.push('💰 Финансы', '🏛️ Недвижимость', '📊 Аналитика');
            incomeSources.push('Стабильность', 'Накопление', 'Структура');
        } else if (sunSign === 'Близнецы' || sunSign === 'Весы' || sunSign === 'Водолей') {
            advice = 'Вам подходят коммуникации, медиа, IT, сфера услуг и продаж.';
            directions.push('📱 IT', '📞 Коммуникации', '🤝 Продажи');
            incomeSources.push('Информация', 'Общение', 'Инновации');
        } else {
            advice = 'Вам подходят психология, медицина, творческие профессии, эзотерика.';
            directions.push('🧠 Психология', '🌿 Медицина', '🔮 Эзотерика');
            incomeSources.push('Интуиция', 'Забота', 'Творчество');
        }

        if (moonSign === 'Рак' || moonSign === 'Рыбы') directions.push('🏥 Медицинская клиника', '💊 Товары для здоровья');
        if (mercurySign === 'Близнецы' || mercurySign === 'Дева') directions.push('📚 Образовательные проекты', '✍️ Писательская деятельность');
        if (venusSign === 'Телец' || venusSign === 'Весы') directions.push('🎨 Дизайн и искусство', '💄 Индустрия красоты');
        if (marsSign === 'Овен' || marsSign === 'Скорпион') directions.push('🏋️‍♂️ Спорт и фитнес', '🔧 Инжиниринг');

        const sunAdvice = [
            'Начинайте новые проекты в первой половине дня',
            'Лучшее время для переговоров — после обеда',
            'Успех приходит через наставничество',
            'Важно окружать себя единомышленниками',
            'Доверяйте первому впечатлению',
            'Анализируйте свои прошлые успехи',
            'Создавайте долгосрочные планы',
            'Ищите баланс между работой и отдыхом',
            'Развивайте навыки публичных выступлений',
            'Инвестируйте в самообразование'
        ];

        const sunLong = sun?.longitude || 0;
        const specificAdvice = sunAdvice[Math.floor(sunLong % 10)] || 'Следуйте своей интуиции';

        return `
            <div class="business-advice">
                <p><strong>💰 Основные источники дохода:</strong> ${incomeSources.join(' • ')}</p>
                <p><strong>🔍 Рекомендуемые направления:</strong></p>
                <ul class="business-list">
                    ${directions.slice(0, 5).map(d => `<li>${d}</li>`).join('')}
                </ul>
                <p>${advice}</p>
                <p class="health-tip"><strong>💡 Совет:</strong> ${specificAdvice}</p>
            </div>
        `;
    }

    renderHealthRisks(planets) {
        const risks = [];
        const strengths = [];
        const tips = [];

        const sun = planets.sun;
        const moon = planets.moon;
        const mars = planets.mars;
        const venus = planets.venus;
        const saturn = planets.saturn;

        const sunSign = sun?.sign || 'Неизвестно';
        const moonSign = moon?.sign || 'Неизвестно';
        const marsSign = mars?.sign || 'Неизвестно';
        const venusSign = venus?.sign || 'Неизвестно';
        const saturnSign = saturn?.sign || 'Неизвестно';

        if (sunSign === 'Лев' || sunSign === 'Овен') strengths.push('Сильное сердце и иммунитет');
        if (moonSign === 'Рак' || moonSign === 'Телец') strengths.push('Хорошая пищеварительная система');
        if (marsSign === 'Овен' || marsSign === 'Стрелец') strengths.push('Высокая физическая выносливость');

        if (sunSign === 'Овен') risks.push('⚡ Головные боли, гипертония, проблемы с глазами');
        if (sunSign === 'Телец') risks.push('⚡ Горло, шея, голосовые связки');
        if (sunSign === 'Близнецы') risks.push('⚡ Легкие, бронхи, нервная система');
        if (sunSign === 'Рак') risks.push('⚡ Желудок, пищеварение, грудь');
        if (sunSign === 'Лев') risks.push('⚡ Сердце, позвоночник, кровообращение');
        if (sunSign === 'Дева') risks.push('⚡ Кишечник, поджелудочная железа');
        if (sunSign === 'Весы') risks.push('⚡ Почки, поясница, кожа');
        if (sunSign === 'Скорпион') risks.push('⚡ Репродуктивная система, мочевой пузырь');
        if (sunSign === 'Стрелец') risks.push('⚡ Печень, бедра, седалищный нерв');
        if (sunSign === 'Козерог') risks.push('⚡ Колени, суставы, зубы');
        if (sunSign === 'Водолей') risks.push('⚡ Голени, лодыжки, кровь');
        if (sunSign === 'Рыбы') risks.push('⚡ Стопы, лимфатическая система');

        if (marsSign === 'Овен' || marsSign === 'Скорпион') {
            risks.push('⚡ Воспалительные процессы, травмы');
            tips.push('Избегайте экстремальных нагрузок');
        }
        if (saturnSign === 'Козерог' || saturnSign === 'Водолей') {
            risks.push('⚡ Проблемы с суставами, костями');
            tips.push('Занимайтесь плаванием, йогой');
        }

        strengths.push('Позвоночник и суставы');
        risks.push('⚡ Шейный отдел (риск ангин, проблем с щитовидкой)');
        tips.push('Регулярные профилактические обследования');
        tips.push('Умеренные физические нагрузки, здоровый сон');

        const healthIndex = Math.floor((sun?.longitude || 0 + mars?.longitude || 0) % 5);
        const healthTips = [
            'Рекомендуется утренняя гимнастика и контрастный душ',
            'Полезны прогулки на свежем воздухе и медитация',
            'Важно соблюдать режим сна и отдыха',
            'Рекомендуется регулярно посещать профилактические осмотры',
            'Полезно заниматься дыхательными практиками'
        ];

        return `
            <div class="health-risks">
                <p><strong>💪 Сильные стороны:</strong> ${strengths.join(' • ')}</p>
                <p><strong>⚠️ Зоны особого внимания:</strong></p>
                <ul class="health-list">
                    ${risks.map(r => `<li>${r}</li>`).join('')}
                </ul>
                <p class="health-tip">💡 ${healthTips[healthIndex]}</p>
                <p class="health-tip">✨ Дополнительно: ${tips.join(' • ')}</p>
            </div>
        `;
    }

    renderLifeTask(planets) {
        const sun = planets.sun;
        const saturn = planets.saturn;

        const sunSign = sun?.sign || 'Неизвестно';
        const moonSign = planets.moon?.sign || 'Неизвестно';
        const saturnSign = saturn?.sign || 'Неизвестно';

        const sunLong = sun?.longitude || 0;
        const saturnLong = saturn?.longitude || 0;

        let past = '';
        let task = '';
        let mission = '';

        const pastLife = [
            'Вы принесли воинственную энергию, стремление к лидерству и самостоятельности.',
            'Вы принесли практичность, умение зарабатывать и накапливать.',
            'Вы принесли коммуникабельность, любознательность, легкость в общении.',
            'Вы принесли эмпатию, интуицию, глубокую эмоциональность.',
            'Вы принесли творческие способности, стремление к самовыражению.'
        ];
        const pastIndex = Math.floor(sunLong / 72) % 5;
        past = pastLife[pastIndex];

        if (sunSign === 'Овен' || sunSign === 'Лев' || sunSign === 'Стрелец') {
            task = 'Научиться слушать других, не подавлять, а вдохновлять.';
            mission = 'Стать источником света и энергии для окружающих';
        } else if (sunSign === 'Телец' || sunSign === 'Дева' || sunSign === 'Козерог') {
            task = 'Научиться доверять потоку, не зацикливаться на материальном.';
            mission = 'Создать прочный фундамент для будущих поколений';
        } else if (sunSign === 'Близнецы' || sunSign === 'Весы' || sunSign === 'Водолей') {
            task = 'Научиться глубине, не распыляться, находить время для уединения.';
            mission = 'Стать проводником новых идей и знаний';
        } else {
            task = 'Научиться защищать свои границы, не растворяться в других.';
            mission = 'Исцелять и вдохновлять через искусство и сострадание';
        }

        let years = '';
        if (saturn) {
            const saturnPos = saturnLong % 30;
            const year1 = 27 + Math.floor(saturnPos / 2);
            const year2 = 54 + Math.floor(saturnPos / 3);
            years = `${year1} и ${year2} лет`;
        } else {
            years = '29-30, 38-40, 57-60 лет';
        }

        const uniquePhrases = [
            'Ваша задача — найти баланс между материальным и духовным',
            'Главный урок — научиться доверять своей интуиции',
            'Вам предстоит раскрыть свой творческий потенциал',
            'Ваш путь — через служение к лидерству',
            'Истинная цель — обретение внутренней гармонии',
            'Научитесь принимать свою уязвимость как силу',
            'Ваша миссия — объединять людей вокруг общей идеи',
            'Познайте глубину через простые радости жизни',
            'Освободитесь от чужих ожиданий и следуйте своему сердцу',
            'Превратите свои страхи в источник силы'
        ];
        const phraseIndex = Math.floor((sunLong + saturnLong) % 10);
        const uniquePhrase = uniquePhrases[phraseIndex];

        return `
            <div class="life-task">
                <p><strong>🧬 Из прошлого:</strong> ${past}</p>
                <p><strong>🎯 Задача текущего воплощения:</strong> ${task}</p>
                <p><strong>🌟 Жизненная миссия:</strong> ${mission}</p>
                <p><strong>⏳ Ключевые годы трансформации:</strong> ${years}</p>
                <p class="health-tip"><strong>🔮 Глубинный урок:</strong> ${uniquePhrase}</p>
            </div>
        `;
    }
}

module.exports = AstrologyRenderService;