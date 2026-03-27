// modules/Astrology/web/js/previewRenderer.js

class AstrologyPreviewRenderer {
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

        if (tariffCode === 'natal_basic') {
            return this.generateBasicReportHTML(reportData);
        }
        if (tariffCode === 'natal_standard') {
            return this.generateStandardReportHTML(reportData);
        }
        if (tariffCode === 'natal_full') {
            return this.generateFullReportHTMLFull(reportData);
        }
        if (tariffCode === 'natal_premium') {
            return this.generatePremiumReportHTML(reportData);
        }
        return '<p style="color: var(--text-secondary); text-align: center; padding: 40px;">Отчет формируется...</p>';
    }

    generateBasicReportHTML(data) {
        const ascendant = data.ascendant || {};
        const planets = data.planets || {};
        const sun = planets.sun || {};
        const moon = planets.moon || {};
        const interpretation = data.interpretation || '';

        return `
        <div class="result-card" style="background: transparent;">
            <div class="result-header">
                <h2>🌟 БАЗОВЫЙ АСТРОЛОГИЧЕСКИЙ ПОРТРЕТ</h2>
                <span class="result-badge basic">Базовый</span>
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
                <div class="astro-sign">${ascendant.sign || 'Близнецы'} ${ascendant.degreeInSign || ''}°</div>
                <p>${ascendant.description || ''}</p>
            </div>
            
            <div class="astro-grid">
                <div class="astro-item sun">
                    <h4><i class="fas fa-sun"></i> СОЛНЦЕ (Сущность)</h4>
                    <div class="astro-sign">${sun.sign || 'Стрелец'} ${sun.degreeInSign || ''}°</div>
                    <p>${sun.signDescription || ''}</p>
                </div>
                <div class="astro-item moon">
                    <h4><i class="fas fa-moon"></i> ЛУНА (Душа)</h4>
                    <div class="astro-sign">${moon.sign || 'Овен'} ${moon.degreeInSign || ''}°</div>
                    <p>${moon.signDescription || ''}</p>
                </div>
            </div>
            
            <div class="full-interpretation">
                <h3><i class="fas fa-scroll"></i> ИНТЕРПРЕТАЦИЯ</h3>
                <div class="interpretation-text">${interpretation.replace(/\n/g, '<br>')}</div>
            </div>
        </div>
        `;
    }

    generateStandardReportHTML(data) {
        const ascendant = data.ascendant || {};
        const planets = data.planets || {};
        const houses = data.houses || [];
        const aspects = data.aspects || [];
        const interpretation = data.interpretation || '';

        const planetsHTML = Object.values(planets).map(planet => `
            <div class="planet-item">
                <div class="planet-symbol">${planet.symbol || '●'}</div>
                <div class="planet-name">${planet.name}</div>
                <div>${planet.sign} ${planet.degreeInSign}°</div>
                <div class="planet-desc" style="font-size: 0.75rem; color: var(--text-muted);">${planet.description || ''}</div>
            </div>
        `).join('');

        const housesHTML = houses.map(house => `
            <div class="house-item">
                <strong>${house.number} дом (${house.sign})</strong><br>
                ${house.description}
                ${house.planets?.length ? `<br><small>⭐ Планеты: ${house.planets.join(', ')}</small>` : ''}
            </div>
        `).join('');

        const aspectsHTML = aspects.map(aspect => `
            <div class="aspect-item ${aspect.type}">
                ${aspect.planet1} — ${aspect.planet2}: ${aspect.description}
            </div>
        `).join('');

        return `
        <div class="result-card" style="background: transparent;">
            <div class="result-header">
                <h2>📊 СТАНДАРТНЫЙ АСТРОЛОГИЧЕСКИЙ ПОРТРЕТ</h2>
                <span class="result-badge standard">Стандартный</span>
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
                <div class="astro-sign">${ascendant.sign || 'Близнецы'} ${ascendant.degreeInSign || ''}°</div>
                <p>${ascendant.description || ''}</p>
            </div>
            
            <div class="astro-grid">
                <div class="astro-item sun">
                    <h4><i class="fas fa-sun"></i> СОЛНЦЕ (Сущность)</h4>
                    <div class="astro-sign">${planets.sun?.sign || 'Стрелец'} ${planets.sun?.degreeInSign || ''}°</div>
                    <p>${planets.sun?.signDescription || ''}</p>
                </div>
                <div class="astro-item moon">
                    <h4><i class="fas fa-moon"></i> ЛУНА (Душа)</h4>
                    <div class="astro-sign">${planets.moon?.sign || 'Овен'} ${planets.moon?.degreeInSign || ''}°</div>
                    <p>${planets.moon?.signDescription || ''}</p>
                </div>
            </div>
            
            <div class="astro-section planets">
                <h3><i class="fas fa-globe"></i> ПЛАНЕТЫ В ЗНАКАХ</h3>
                <div class="planets-grid">${planetsHTML}</div>
            </div>
            
            <div class="astro-section houses">
                <h3><i class="fas fa-building"></i> ДОМА</h3>
                <div class="houses-list">${housesHTML}</div>
            </div>
            
            <div class="astro-section aspects">
                <h3><i class="fas fa-share-alt"></i> АСПЕКТЫ</h3>
                <div class="aspects-list">${aspectsHTML}</div>
            </div>
            
            <div class="full-interpretation">
                <h3><i class="fas fa-scroll"></i> ПОЛНАЯ ИНТЕРПРЕТАЦИЯ</h3>
                <div class="interpretation-text">${interpretation.replace(/\n/g, '<br>')}</div>
            </div>
        </div>
        `;
    }

    generateFullReportHTMLFull(data) {
        const ascendant = data.ascendant || {};
        const planets = data.planets || {};
        const houses = data.houses || [];
        const aspects = data.aspects || [];
        const expandedReport = data.expandedReport || '';
        const interpretation = data.interpretation || '';

        return this.generateStandardReportHTML(data) + `
            <div class="expanded-report-container">
                ${expandedReport}
            </div>
        `;
    }

    generatePremiumReportHTML(data) {
        const ascendant = data.ascendant || {};
        const planets = data.planets || {};
        const houses = data.houses || [];
        const aspects = data.aspects || [];
        const expandedReport = data.expandedReport || '';
        const karma = data.karma || {};
        const recommendations = data.recommendations || [];
        const transits = data.transits || '';
        const affirmations = data.affirmations || '';
        const interpretation = data.interpretation || '';

        return this.generateFullReportHTMLFull(data) + `
            <div class="astro-section karma-section">
                <h3><i class="fas fa-yin-yang"></i> КАРМИЧЕСКИЙ АНАЛИЗ</h3>
                <div class="karma-item"><strong>📜 Уроки прошлых жизней:</strong><br>${karma.pastLifeLessons || '—'}</div>
                <div class="karma-item"><strong>🎯 Задача текущего воплощения:</strong><br>${karma.currentTask || '—'}</div>
                <div class="karma-item"><strong>⚡ Главный кармический урок:</strong><br>${karma.saturnLesson || '—'}</div>
            </div>
            
            <div class="astro-section transits-section">
                <h3><i class="fas fa-chart-line"></i> ТРАНЗИТНЫЙ ПРОГНОЗ</h3>
                <p>${transits || '—'}</p>
            </div>
            
            <div class="astro-section recommendations-section">
                <h3><i class="fas fa-lightbulb"></i> ПЕРСОНАЛЬНЫЕ РЕКОМЕНДАЦИИ</h3>
                <ul>${recommendations.map(r => `<li>✨ ${r}</li>`).join('')}</ul>
            </div>
            
            <div class="astro-section affirmation-section">
                <h3><i class="fas fa-quote-right"></i> АФФИРМАЦИЯ ДНЯ</h3>
                <p>"${affirmations || 'Я доверяю себе и своему пути.'}"</p>
            </div>
        `;
    }

    getTariffName(code) {
        const names = {
            'natal_basic': '🌟 БАЗОВЫЙ АСТРОЛОГИЧЕСКИЙ ПОРТРЕТ',
            'natal_standard': '📊 СТАНДАРТНЫЙ АСТРОЛОГИЧЕСКИЙ ПОРТРЕТ',
            'natal_full': '🔮 ГЛУБОКИЙ АСТРОЛОГИЧЕСКИЙ АНАЛИЗ',
            'natal_premium': '💎 ПРЕМИУМ-ПОРТРЕТ ЛИЧНОСТИ'
        };
        return names[code] || '🌟 АСТРОЛОГИЧЕСКИЙ ПОРТРЕТ';
    }
}

window.astrologyPreviewRenderer = new AstrologyPreviewRenderer();