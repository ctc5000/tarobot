// modules/Astropsychology/web/js/previewRenderer.js

class AstropsychologyPreviewRenderer {
    constructor() {
        this.userName = 'Иванов Иван Иванович';
        this.birthDate = '02.06.1993';
        this.birthTime = '08:05';
    }

    generateFullReportHTML(data, tariffCode) {
        if (!data || !data.data) {
            return '<p style="color: var(--text-secondary); text-align: center; padding: 40px;">Ошибка загрузки данных</p>';
        }

        const reportData = data.data;

        if (tariffCode === 'astro_basic') {
            return this.generateBasicReportHTML(reportData);
        }
        if (tariffCode === 'astro_quick' || tariffCode === 'quick') {  // ← ДОБАВИТЬ
            return this.generateQuickReportHTML(reportData);
        }
        if (tariffCode === 'astro_standard') {
            return this.generateStandardReportHTML(reportData);
        }
        if (tariffCode === 'astro_full') {
            return this.generateFullReportHTMLFull(reportData);
        }
        if (tariffCode === 'astro_premium') {
            return this.generatePremiumReportHTML(reportData);
        }
        return '<p style="color: var(--text-secondary); text-align: center; padding: 40px;">Отчет формируется...</p>';
    }

    generateBasicReportHTML(data) {
        const ascendant = data.ascendant || {};
        const sun = data.sun || {};
        const moon = data.moon || {};
        const psychology = data.psychology || {};
        const strengths = psychology.strengths || [];
        const challenges = psychology.challenges || [];
        const growthPath = psychology.growthPath || '';
        const forecast = data.forecast || {};

        return `
        <div class="result-card" style="background: transparent;">
            <div class="result-header">
                <h2>🌟 БАЗОВЫЙ АСТРОПСИХОЛОГИЧЕСКИЙ ПОРТРЕТ</h2>
                <span class="result-badge basic">Базовый анализ</span>
            </div>
            
            <div class="result-person-info">
                <div class="person-detail">
                    <span class="label">Имя:</span>
                    <span class="value">${this.userName}</span>
                </div>
                <div class="person-detail">
                    <span class="label">Дата рождения:</span>
                    <span class="value">${this.birthDate} ${this.birthTime}</span>
                </div>
            </div>
            
            <div class="astro-section ascendant">
                <h3><i class="fas fa-sun"></i> АСЦЕНДЕНТ</h3>
                <div class="astro-sign">${ascendant.sign || 'Близнецы'} ${ascendant.degree || ''}°</div>
                <p>${ascendant.description || ''}</p>
            </div>
            
            <div class="astro-grid">
                <div class="astro-item sun">
                    <h4><i class="fas fa-sun"></i> СОЛНЦЕ (Сущность)</h4>
                    <div class="astro-sign">${sun.sign || 'Стрелец'} ${sun.degree || ''}°</div>
                    <p>${sun.description || ''}</p>
                </div>
                <div class="astro-item moon">
                    <h4><i class="fas fa-moon"></i> ЛУНА (Душа)</h4>
                    <div class="astro-sign">${moon.sign || 'Овен'} ${moon.degree || ''}°</div>
                    <p>${moon.description || ''}</p>
                </div>
            </div>
            
            <div class="astro-strengths-weaknesses">
                <div class="strengths-box">
                    <h4><i class="fas fa-star"></i> СИЛЬНЫЕ СТОРОНЫ</h4>
                    <ul>${strengths.map(s => `<li>✨ ${s}</li>`).join('')}</ul>
                </div>
                <div class="weaknesses-box">
                    <h4><i class="fas fa-leaf"></i> ЗОНЫ РОСТА</h4>
                    <ul>${challenges.map(c => `<li>🌙 ${c}</li>`).join('')}</ul>
                </div>
            </div>
            
            <div class="astro-section">
                <h4><i class="fas fa-road"></i> ПУТЬ РАЗВИТИЯ</h4>
                <p>${growthPath}</p>
            </div>
            
            <div class="astro-forecast">
                <h3><i class="fas fa-calendar-alt"></i> ПРОГНОЗ</h3>
                <div class="forecast-grid">
                    <div class="forecast-item"><strong>💼 Карьера</strong><br>${forecast.career || '—'}</div>
                    <div class="forecast-item"><strong>❤️ Любовь</strong><br>${forecast.love || '—'}</div>
                    <div class="forecast-item"><strong>🌿 Здоровье</strong><br>${forecast.health || '—'}</div>
                    <div class="forecast-item"><strong>✨ Общий</strong><br>${forecast.general || '—'}</div>
                </div>
            </div>
            
            <div class="full-interpretation">
                <h3><i class="fas fa-scroll"></i> ПОЛНОЕ ТОЛКОВАНИЕ</h3>
                <div class="interpretation-text">${(data.interpretation || '').replace(/\n/g, '<br>')}</div>
            </div>
        </div>
        `;
    }
    generateQuickReportHTML(data) {
        const ascendant = data.ascendant || {};
        const sun = data.sun || {};
        const moon = data.moon || {};
        const planets = data.planets || [];
        const psychology = data.psychology || {};
        const strengths = psychology.strengths || [];
        const challenges = psychology.challenges || [];
        const forecast = data.forecast || {};

        const planetsHTML = planets.map(planet => `
        <div class="planet-item">
            <div class="planet-symbol">${planet.symbol || '●'}</div>
            <div class="planet-name">${planet.name || ''}</div>
            <div>${planet.sign || ''} ${planet.degree || ''}°</div>
            ${planet.description ? `<div class="planet-desc" style="font-size: 0.7rem; color: var(--text-muted);">${planet.description}</div>` : ''}
        </div>
    `).join('');

        return `
    <div class="result-card" style="background: transparent;">
        <div class="result-header">
            <h2>⚡ ЭКСПРЕСС-АНАЛИЗ ЛИЧНОСТИ</h2>
            <span class="result-badge quick">Экспресс-анализ</span>
        </div>
        
        <div class="result-person-info">
            <div class="person-detail">
                <span class="label">Имя:</span>
                <span class="value">${this.userName}</span>
            </div>
            <div class="person-detail">
                <span class="label">Дата рождения:</span>
                <span class="value">${this.birthDate} ${this.birthTime}</span>
            </div>
        </div>
        
        <div class="astro-section ascendant">
            <h3><i class="fas fa-sun"></i> АСЦЕНДЕНТ</h3>
            <div class="astro-sign">${ascendant.sign || 'Близнецы'} ${ascendant.degree || ''}°</div>
            <p>${ascendant.description || ''}</p>
        </div>
        
        <div class="astro-grid">
            <div class="astro-item sun">
                <h4><i class="fas fa-sun"></i> СОЛНЦЕ (Сущность)</h4>
                <div class="astro-sign">${sun.sign || 'Стрелец'} ${sun.degree || ''}°</div>
                <p>${sun.description || ''}</p>
            </div>
            <div class="astro-item moon">
                <h4><i class="fas fa-moon"></i> ЛУНА (Душа)</h4>
                <div class="astro-sign">${moon.sign || 'Овен'} ${moon.degree || ''}°</div>
                <p>${moon.description || ''}</p>
            </div>
        </div>
        
        <div class="astro-section planets">
            <h3><i class="fas fa-globe"></i> КЛЮЧЕВЫЕ ПЛАНЕТЫ</h3>
            <div class="planets-grid">${planetsHTML}</div>
        </div>
        
        <div class="astro-strengths-weaknesses">
            <div class="strengths-box">
                <h4><i class="fas fa-star"></i> СИЛЬНЫЕ СТОРОНЫ</h4>
                <ul>${strengths.map(s => `<li>✨ ${s}</li>`).join('')}</ul>
            </div>
            <div class="weaknesses-box">
                <h4><i class="fas fa-leaf"></i> ЗОНЫ РОСТА</h4>
                <ul>${challenges.map(c => `<li>🌙 ${c}</li>`).join('')}</ul>
            </div>
        </div>
        
        <div class="astro-forecast">
            <h3><i class="fas fa-calendar-alt"></i> ПРОГНОЗ</h3>
            <div class="forecast-grid">
                <div class="forecast-item"><strong>💼 Карьера</strong><br>${forecast.career || '—'}</div>
                <div class="forecast-item"><strong>❤️ Любовь</strong><br>${forecast.love || '—'}</div>
                <div class="forecast-item"><strong>🌿 Здоровье</strong><br>${forecast.health || '—'}</div>
                <div class="forecast-item"><strong>✨ Общий</strong><br>${forecast.general || '—'}</div>
            </div>
            ${forecast.week ? `<div class="forecast-item full"><strong>📅 Недельный прогноз</strong><br>${forecast.week}</div>` : ''}
        </div>
        
        <div class="full-interpretation">
            <h3><i class="fas fa-scroll"></i> ПОЛНОЕ ТОЛКОВАНИЕ</h3>
            <div class="interpretation-text">${(data.interpretation || '').replace(/\n/g, '<br>')}</div>
        </div>
    </div>
    `;
    }
    generateStandardReportHTML(data) {
        const ascendant = data.ascendant || {};
        const sun = data.sun || {};
        const moon = data.moon || {};
        const planets = data.planets || [];
        const psychology = data.psychology || {};
        const strengths = psychology.strengths || [];
        const challenges = psychology.challenges || [];
        const growthPath = psychology.growthPath || '';
        const forecast = data.forecast || {};

        const planetsHTML = planets.slice(0, 10).map(planet => `
            <div class="planet-item">
                <div class="planet-symbol">${planet.symbol || '●'}</div>
                <div class="planet-name">${planet.name || ''}</div>
                <div>${planet.sign || ''} ${planet.degree || ''}°</div>
                ${planet.description ? `<div class="planet-desc" style="font-size: 0.7rem; color: var(--text-muted); margin-top: 5px;">${planet.description.substring(0, 60)}...</div>` : ''}
            </div>
        `).join('');

        return `
        <div class="result-card" style="background: transparent;">
            <div class="result-header">
                <h2>📊 СТАНДАРТНЫЙ АСТРОПСИХОЛОГИЧЕСКИЙ ПОРТРЕТ</h2>
                <span class="result-badge full">Стандартный портрет</span>
            </div>
            
            <div class="result-person-info">
                <div class="person-detail">
                    <span class="label">Имя:</span>
                    <span class="value">${this.userName}</span>
                </div>
                <div class="person-detail">
                    <span class="label">Дата рождения:</span>
                    <span class="value">${this.birthDate} ${this.birthTime}</span>
                </div>
            </div>
            
            <div class="astro-section ascendant">
                <h3><i class="fas fa-sun"></i> АСЦЕНДЕНТ</h3>
                <div class="astro-sign">${ascendant.sign || 'Близнецы'} ${ascendant.degree || ''}°</div>
                <p>${ascendant.description || ''}</p>
            </div>
            
            <div class="astro-grid">
                <div class="astro-item sun">
                    <h4><i class="fas fa-sun"></i> СОЛНЦЕ (Сущность)</h4>
                    <div class="astro-sign">${sun.sign || 'Стрелец'} ${sun.degree || ''}°</div>
                    <p>${sun.description || ''}</p>
                </div>
                <div class="astro-item moon">
                    <h4><i class="fas fa-moon"></i> ЛУНА (Душа)</h4>
                    <div class="astro-sign">${moon.sign || 'Овен'} ${moon.degree || ''}°</div>
                    <p>${moon.description || ''}</p>
                </div>
            </div>
            
            <div class="astro-section planets">
                <h3><i class="fas fa-globe"></i> ПЛАНЕТЫ В ЗНАКАХ</h3>
                <div class="planets-grid">${planetsHTML}</div>
            </div>
            
            <div class="astro-section psychology">
                <h3><i class="fas fa-brain"></i> ПСИХОЛОГИЧЕСКИЙ АНАЛИЗ</h3>
                <div class="psychology-item">
                    <h4>ЭГО (Солнце)</h4>
                    <p>${psychology.ego || ''}</p>
                </div>
                <div class="psychology-item">
                    <h4>ЭМОЦИИ (Луна)</h4>
                    <p>${psychology.emotions || ''}</p>
                </div>
                <div class="psychology-item">
                    <h4>ЛИЧНОСТЬ (Асцендент)</h4>
                    <p>${psychology.personality || ''}</p>
                </div>
                ${psychology.communicationStyle ? `
                <div class="psychology-item">
                    <h4>СТИЛЬ ОБЩЕНИЯ (Меркурий)</h4>
                    <p>${psychology.communicationStyle}</p>
                </div>
                ` : ''}
                ${psychology.loveStyle ? `
                <div class="psychology-item">
                    <h4>СТИЛЬ ЛЮБВИ (Венера)</h4>
                    <p>${psychology.loveStyle}</p>
                </div>
                ` : ''}
            </div>
            
            <div class="astro-strengths-weaknesses">
                <div class="strengths-box">
                    <h4><i class="fas fa-star"></i> СИЛЬНЫЕ СТОРОНЫ</h4>
                    <ul>${strengths.map(s => `<li>✨ ${s}</li>`).join('')}</ul>
                </div>
                <div class="weaknesses-box">
                    <h4><i class="fas fa-leaf"></i> ЗОНЫ РОСТА</h4>
                    <ul>${challenges.map(c => `<li>🌙 ${c}</li>`).join('')}</ul>
                </div>
            </div>
            
            <div class="astro-section">
                <h4><i class="fas fa-road"></i> ПУТЬ РАЗВИТИЯ</h4>
                <p>${growthPath}</p>
            </div>
            
            <div class="astro-forecast">
                <h3><i class="fas fa-calendar-alt"></i> ПРОГНОЗ</h3>
                <div class="forecast-grid">
                    <div class="forecast-item"><strong>💼 Карьера</strong><br>${forecast.career || '—'}</div>
                    <div class="forecast-item"><strong>❤️ Любовь</strong><br>${forecast.love || '—'}</div>
                    <div class="forecast-item"><strong>🌿 Здоровье</strong><br>${forecast.health || '—'}</div>
                    <div class="forecast-item"><strong>✨ Общий</strong><br>${forecast.general || '—'}</div>
                </div>
                ${forecast.month ? `<div class="forecast-item full" style="margin-top: 15px;"><strong>📅 Месячный прогноз</strong><br>${forecast.month}</div>` : ''}
            </div>
            
            <div class="full-interpretation">
                <h3><i class="fas fa-scroll"></i> ПОЛНОЕ ТОЛКОВАНИЕ</h3>
                <div class="interpretation-text">${(data.interpretation || '').replace(/\n/g, '<br>')}</div>
            </div>
        </div>
        `;
    }

    generateFullReportHTMLFull(data) {
        const ascendant = data.ascendant || {};
        const sun = data.sun || {};
        const moon = data.moon || {};
        const planets = data.planets || [];
        const houses = data.houses || [];
        const aspects = data.aspects || [];
        const psychology = data.psychology || {};
        const strengths = psychology.strengths || [];
        const challenges = psychology.challenges || [];
        const growthPath = psychology.growthPath || '';
        const forecast = data.forecast || {};
        const emotionalNeeds = psychology.emotionalNeeds || '';
        const shadowAspects = psychology.shadowAspects || '';
        const lifePurpose = psychology.lifePurpose || '';

        const planetsHTML = planets.slice(0, 10).map(planet => `
            <div class="planet-item">
                <div class="planet-symbol">${planet.symbol || '●'}</div>
                <div class="planet-name">${planet.name || ''}</div>
                <div>${planet.sign || ''} ${planet.degree || ''}°</div>
                ${planet.meaning ? `<div class="planet-desc" style="font-size: 0.7rem; color: var(--text-muted);">${planet.meaning.substring(0, 50)}...</div>` : ''}
            </div>
        `).join('');

        const housesHTML = houses.slice(0, 12).map(house => `
            <div class="house-item">
                <strong>${house.number} дом (${house.sign || '—'})</strong><br>
                ${house.description?.substring(0, 100) || ''}...
                ${house.planets?.length ? `<br><small>⭐ Планеты: ${house.planets.join(', ')}</small>` : ''}
            </div>
        `).join('');

        const aspectsHTML = aspects.slice(0, 15).map(aspect => `
            <div class="aspect-item ${aspect.type || ''}">
                ${aspect.planet1} — ${aspect.planet2}: ${aspect.description || '—'}
            </div>
        `).join('');

        return `
        <div class="result-card" style="background: transparent;">
            <div class="result-header">
                <h2>🔮 ГЛУБОКИЙ АСТРОПСИХОЛОГИЧЕСКИЙ АНАЛИЗ</h2>
                <span class="result-badge full">Глубокий анализ</span>
            </div>
            
            <div class="result-person-info">
                <div class="person-detail">
                    <span class="label">Имя:</span>
                    <span class="value">${this.userName}</span>
                </div>
                <div class="person-detail">
                    <span class="label">Дата рождения:</span>
                    <span class="value">${this.birthDate} ${this.birthTime}</span>
                </div>
            </div>
            
            <div class="astro-section ascendant">
                <h3><i class="fas fa-sun"></i> АСЦЕНДЕНТ</h3>
                <div class="astro-sign">${ascendant.sign || 'Близнецы'} ${ascendant.degree || ''}°</div>
                <p>${ascendant.description || ''}</p>
            </div>
            
            <div class="astro-grid">
                <div class="astro-item sun">
                    <h4><i class="fas fa-sun"></i> СОЛНЦЕ (Сущность)</h4>
                    <div class="astro-sign">${sun.sign || 'Стрелец'} ${sun.degree || ''}°</div>
                    <p>${sun.description || ''}</p>
                </div>
                <div class="astro-item moon">
                    <h4><i class="fas fa-moon"></i> ЛУНА (Душа)</h4>
                    <div class="astro-sign">${moon.sign || 'Овен'} ${moon.degree || ''}°</div>
                    <p>${moon.description || ''}</p>
                </div>
            </div>
            
            <div class="astro-section planets">
                <h3><i class="fas fa-globe"></i> ПЛАНЕТЫ В ЗНАКАХ</h3>
                <div class="planets-grid">${planetsHTML}</div>
            </div>
            
            <div class="natal-chart-container">
                <h3><i class="fas fa-chart-pie"></i> НАТАЛЬНАЯ КАРТА</h3>
                <canvas id="previewNatalChartCanvas" width="400" height="400" style="width: 100%; max-width: 400px; height: auto; margin: 0 auto; display: block;"></canvas>
            </div>
            
            <div class="astro-section houses">
                <h3><i class="fas fa-building"></i> ДОМА</h3>
                <div class="houses-list">${housesHTML}</div>
            </div>
            
            <div class="astro-section aspects">
                <h3><i class="fas fa-share-alt"></i> АСПЕКТЫ</h3>
                <div class="aspects-list">${aspectsHTML}</div>
            </div>
            
            <div class="astro-section psychology">
                <h3><i class="fas fa-brain"></i> ПСИХОЛОГИЧЕСКИЙ АНАЛИЗ</h3>
                <div class="psychology-item">
                    <h4>ЭГО (Солнце)</h4>
                    <p>${psychology.ego || ''}</p>
                </div>
                <div class="psychology-item">
                    <h4>ЭМОЦИИ (Луна)</h4>
                    <p>${psychology.emotions || ''}</p>
                </div>
                <div class="psychology-item">
                    <h4>ЛИЧНОСТЬ (Асцендент)</h4>
                    <p>${psychology.personality || ''}</p>
                </div>
                ${psychology.communicationStyle ? `
                <div class="psychology-item">
                    <h4>СТИЛЬ ОБЩЕНИЯ</h4>
                    <p>${psychology.communicationStyle}</p>
                </div>
                ` : ''}
                ${psychology.loveStyle ? `
                <div class="psychology-item">
                    <h4>СТИЛЬ ЛЮБВИ</h4>
                    <p>${psychology.loveStyle}</p>
                </div>
                ` : ''}
                ${emotionalNeeds ? `
                <div class="psychology-item">
                    <h4>ЭМОЦИОНАЛЬНЫЕ ПОТРЕБНОСТИ</h4>
                    <p>${emotionalNeeds}</p>
                </div>
                ` : ''}
                ${shadowAspects ? `
                <div class="psychology-item">
                    <h4>ТЕНЕВЫЕ АСПЕКТЫ</h4>
                    <p>${shadowAspects}</p>
                </div>
                ` : ''}
                ${lifePurpose ? `
                <div class="psychology-item">
                    <h4>ЖИЗНЕННАЯ МИССИЯ</h4>
                    <p>${lifePurpose}</p>
                </div>
                ` : ''}
            </div>
            
            <div class="astro-strengths-weaknesses">
                <div class="strengths-box">
                    <h4><i class="fas fa-star"></i> СИЛЬНЫЕ СТОРОНЫ</h4>
                    <ul>${strengths.map(s => `<li>✨ ${s}</li>`).join('')}</ul>
                </div>
                <div class="weaknesses-box">
                    <h4><i class="fas fa-leaf"></i> ЗОНЫ РОСТА</h4>
                    <ul>${challenges.map(c => `<li>🌙 ${c}</li>`).join('')}</ul>
                </div>
            </div>
            
            <div class="astro-section">
                <h4><i class="fas fa-road"></i> ПУТЬ РАЗВИТИЯ</h4>
                <p>${growthPath}</p>
            </div>
            
            <div class="astro-forecast">
                <h3><i class="fas fa-calendar-alt"></i> ПРОГНОЗ</h3>
                <div class="forecast-grid">
                    <div class="forecast-item"><strong>💼 Карьера</strong><br>${forecast.career || '—'}</div>
                    <div class="forecast-item"><strong>❤️ Любовь</strong><br>${forecast.love || '—'}</div>
                    <div class="forecast-item"><strong>🌿 Здоровье</strong><br>${forecast.health || '—'}</div>
                    <div class="forecast-item"><strong>✨ Общий</strong><br>${forecast.general || '—'}</div>
                </div>
                ${forecast.week ? `<div class="forecast-item full"><strong>📅 Недельный прогноз</strong><br>${forecast.week}</div>` : ''}
                ${forecast.month ? `<div class="forecast-item full"><strong>📅 Месячный прогноз</strong><br>${forecast.month}</div>` : ''}
                ${forecast.year ? `<div class="forecast-item full"><strong>📅 Годовой прогноз</strong><br>${forecast.year}</div>` : ''}
            </div>
            
            <div class="full-interpretation">
                <h3><i class="fas fa-scroll"></i> ПОЛНОЕ ТОЛКОВАНИЕ</h3>
                <div class="interpretation-text">${(data.interpretation || '').replace(/\n/g, '<br>')}</div>
            </div>
        </div>
        `;
    }

    generatePremiumReportHTML(data) {
        const ascendant = data.ascendant || {};
        const sun = data.sun || {};
        const moon = data.moon || {};
        const planets = data.planets || [];
        const houses = data.houses || [];
        const aspects = data.aspects || [];
        const psychology = data.psychology || {};
        const strengths = psychology.strengths || [];
        const challenges = psychology.challenges || [];
        const growthPath = psychology.growthPath || '';
        const forecast = data.forecast || {};
        const emotionalNeeds = psychology.emotionalNeeds || '';
        const shadowAspects = psychology.shadowAspects || '';
        const lifePurpose = psychology.lifePurpose || '';
        const karma = data.karma || {};
        const recommendations = data.recommendations || [];

        const planetsHTML = planets.map(planet => `
            <div class="planet-item">
                <div class="planet-symbol">${planet.symbol || '●'}</div>
                <div class="planet-name">${planet.name || ''}</div>
                <div>${planet.sign || ''} ${planet.degree || ''}°</div>
                ${planet.meaning ? `<div class="planet-desc" style="font-size: 0.7rem; color: var(--text-muted);">${planet.meaning}</div>` : ''}
            </div>
        `).join('');

        const housesHTML = houses.slice(0, 12).map(house => `
            <div class="house-item">
                <strong>${house.number} дом (${house.sign || '—'})</strong><br>
                ${house.description?.substring(0, 150) || ''}...
                ${house.planets?.length ? `<br><small>⭐ Планеты: ${house.planets.join(', ')}</small>` : ''}
            </div>
        `).join('');

        const aspectsHTML = aspects.slice(0, 20).map(aspect => `
            <div class="aspect-item ${aspect.type || ''}">
                ${aspect.planet1} — ${aspect.planet2}: ${aspect.description || '—'}
            </div>
        `).join('');

        return `
        <div class="result-card" style="background: transparent;">
            <div class="result-header">
                <h2>💎 ПРЕМИУМ-ПОРТРЕТ ЛИЧНОСТИ</h2>
                <span class="result-badge full">Премиум</span>
            </div>
            
            <div class="result-person-info">
                <div class="person-detail">
                    <span class="label">Имя:</span>
                    <span class="value">${this.userName}</span>
                </div>
                <div class="person-detail">
                    <span class="label">Дата рождения:</span>
                    <span class="value">${this.birthDate} ${this.birthTime}</span>
                </div>
            </div>
            
            <div class="astro-section ascendant">
                <h3><i class="fas fa-sun"></i> АСЦЕНДЕНТ</h3>
                <div class="astro-sign">${ascendant.sign || 'Близнецы'} ${ascendant.degree || ''}°</div>
                <p>${ascendant.description || ''}</p>
            </div>
            
            <div class="astro-grid">
                <div class="astro-item sun">
                    <h4><i class="fas fa-sun"></i> СОЛНЦЕ (Сущность)</h4>
                    <div class="astro-sign">${sun.sign || 'Стрелец'} ${sun.degree || ''}°</div>
                    <p>${sun.description || ''}</p>
                </div>
                <div class="astro-item moon">
                    <h4><i class="fas fa-moon"></i> ЛУНА (Душа)</h4>
                    <div class="astro-sign">${moon.sign || 'Овен'} ${moon.degree || ''}°</div>
                    <p>${moon.description || ''}</p>
                </div>
            </div>
            
            <div class="astro-section planets">
                <h3><i class="fas fa-globe"></i> ПЛАНЕТЫ В ЗНАКАХ</h3>
                <div class="planets-grid">${planetsHTML}</div>
            </div>
            
            <div class="natal-chart-container">
                <h3><i class="fas fa-chart-pie"></i> НАТАЛЬНАЯ КАРТА</h3>
                <canvas id="previewNatalChartCanvas" width="400" height="400" style="width: 100%; max-width: 400px; height: auto; margin: 0 auto; display: block;"></canvas>
            </div>
            
            <div class="astro-section houses">
                <h3><i class="fas fa-building"></i> ДОМА</h3>
                <div class="houses-list">${housesHTML}</div>
            </div>
            
            <div class="astro-section aspects">
                <h3><i class="fas fa-share-alt"></i> АСПЕКТЫ</h3>
                <div class="aspects-list">${aspectsHTML}</div>
            </div>
            
            <div class="astro-section psychology">
                <h3><i class="fas fa-brain"></i> ПСИХОЛОГИЧЕСКИЙ АНАЛИЗ</h3>
                <div class="psychology-item">
                    <h4>ЭГО (Солнце)</h4>
                    <p>${psychology.ego || ''}</p>
                </div>
                <div class="psychology-item">
                    <h4>ЭМОЦИИ (Луна)</h4>
                    <p>${psychology.emotions || ''}</p>
                </div>
                <div class="psychology-item">
                    <h4>ЛИЧНОСТЬ (Асцендент)</h4>
                    <p>${psychology.personality || ''}</p>
                </div>
                ${psychology.communicationStyle ? `
                <div class="psychology-item">
                    <h4>СТИЛЬ ОБЩЕНИЯ</h4>
                    <p>${psychology.communicationStyle}</p>
                </div>
                ` : ''}
                ${psychology.loveStyle ? `
                <div class="psychology-item">
                    <h4>СТИЛЬ ЛЮБВИ</h4>
                    <p>${psychology.loveStyle}</p>
                </div>
                ` : ''}
                ${psychology.thinkingStyle ? `
                <div class="psychology-item">
                    <h4>СТИЛЬ МЫШЛЕНИЯ</h4>
                    <p>${psychology.thinkingStyle}</p>
                </div>
                ` : ''}
                ${emotionalNeeds ? `
                <div class="psychology-item">
                    <h4>ЭМОЦИОНАЛЬНЫЕ ПОТРЕБНОСТИ</h4>
                    <p>${emotionalNeeds}</p>
                </div>
                ` : ''}
                ${shadowAspects ? `
                <div class="psychology-item">
                    <h4>ТЕНЕВЫЕ АСПЕКТЫ</h4>
                    <p>${shadowAspects}</p>
                </div>
                ` : ''}
                ${lifePurpose ? `
                <div class="psychology-item">
                    <h4>ЖИЗНЕННАЯ МИССИЯ</h4>
                    <p>${lifePurpose}</p>
                </div>
                ` : ''}
            </div>
            
            <div class="astro-strengths-weaknesses">
                <div class="strengths-box">
                    <h4><i class="fas fa-star"></i> СИЛЬНЫЕ СТОРОНЫ</h4>
                    <ul>${strengths.map(s => `<li>✨ ${s}</li>`).join('')}</ul>
                </div>
                <div class="weaknesses-box">
                    <h4><i class="fas fa-leaf"></i> ЗОНЫ РОСТА</h4>
                    <ul>${challenges.map(c => `<li>🌙 ${c}</li>`).join('')}</ul>
                </div>
            </div>
            
            <div class="astro-section">
                <h4><i class="fas fa-road"></i> ПУТЬ РАЗВИТИЯ</h4>
                <p>${growthPath}</p>
            </div>
            
            <div class="astro-forecast">
                <h3><i class="fas fa-calendar-alt"></i> ПРОГНОЗ</h3>
                <div class="forecast-grid">
                    <div class="forecast-item"><strong>💼 Карьера</strong><br>${forecast.career || '—'}</div>
                    <div class="forecast-item"><strong>❤️ Любовь</strong><br>${forecast.love || '—'}</div>
                    <div class="forecast-item"><strong>🌿 Здоровье</strong><br>${forecast.health || '—'}</div>
                    <div class="forecast-item"><strong>✨ Общий</strong><br>${forecast.general || '—'}</div>
                </div>
                ${forecast.week ? `<div class="forecast-item full"><strong>📅 Недельный прогноз</strong><br>${forecast.week}</div>` : ''}
                ${forecast.month ? `<div class="forecast-item full"><strong>📅 Месячный прогноз</strong><br>${forecast.month}</div>` : ''}
                ${forecast.year ? `<div class="forecast-item full"><strong>📅 Годовой прогноз</strong><br>${forecast.year}</div>` : ''}
                ${forecast.transits ? `<div class="forecast-item full"><strong>🔄 Транзитный прогноз</strong><br>${forecast.transits}</div>` : ''}
                ${forecast.auspiciousDates ? `<div class="forecast-item full"><strong>📅 Благоприятные даты</strong><br>${forecast.auspiciousDates}</div>` : ''}
                ${forecast.warnings?.length ? `<div class="forecast-item full"><strong>⚠️ Предостережения</strong><br>${forecast.warnings.join(', ')}</div>` : ''}
            </div>
            
            <div class="astro-section karma-section">
                <h3><i class="fas fa-yin-yang"></i> КАРМИЧЕСКИЙ АНАЛИЗ</h3>
                <div style="margin-bottom: 15px;"><strong>📜 Уроки прошлых жизней:</strong><br>${karma.pastLifeLessons || '—'}</div>
                <div style="margin-bottom: 15px;"><strong>🎯 Задача текущего воплощения:</strong><br>${karma.currentTask || '—'}</div>
                <div><strong>⚡ Главный кармический урок:</strong><br>${karma.saturnLesson || '—'}</div>
            </div>
            
            <div class="astro-section recommendations-section">
                <h3><i class="fas fa-lightbulb"></i> ПЕРСОНАЛЬНЫЕ РЕКОМЕНДАЦИИ</h3>
                <ul>${recommendations.map(r => `<li>✨ ${r}</li>`).join('')}</ul>
            </div>
            
            <div class="astro-section affirmation-section">
                <h3><i class="fas fa-quote-right"></i> АФФИРМАЦИЯ ДНЯ</h3>
                <p>"${forecast.affirmations || 'Я доверяю себе и своему пути.'}"</p>
            </div>
            
            <div class="full-interpretation">
                <h3><i class="fas fa-scroll"></i> ПОЛНОЕ ТОЛКОВАНИЕ</h3>
                <div class="interpretation-text">${(data.interpretation || '').replace(/\n/g, '<br>')}</div>
            </div>
        </div>
        `;
    }

    getTariffName(code) {
        const names = {
            'astro_basic': '🌟 БАЗОВЫЙ АСТРОПСИХОЛОГИЧЕСКИЙ АНАЛИЗ',
            'astro_standard': '📊 СТАНДАРТНЫЙ АСТРОПСИХОЛОГИЧЕСКИЙ ПОРТРЕТ',
            'astro_full': '🔮 ГЛУБОКИЙ АСТРОПСИХОЛОГИЧЕСКИЙ АНАЛИЗ',
            'astro_premium': '💎 ПРЕМИУМ-ПОРТРЕТ ЛИЧНОСТИ'
        };
        return names[code] || '🌟 АСТРОПСИХОЛОГИЧЕСКИЙ ПОРТРЕТ';
    }
}

window.astropsychologyPreviewRenderer = new AstropsychologyPreviewRenderer();