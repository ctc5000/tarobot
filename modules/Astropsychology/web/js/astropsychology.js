// modules/Astropsychology/web/js/astropsychology.js

class AstropsychologyApp {
    constructor() {
        this.user = null;
        this.tariffs = [];
        this.selectedTariff = null;
        this.currentCalculation = null;
        this.chartDraw = null;
        this.init();
    }

    async init() {
        this.form = document.getElementById('astropsychologyForm');
        this.tariffSection = document.getElementById('tariffSection');
        this.inputSection = document.getElementById('inputSection');
        this.resultSection = document.getElementById('resultSection');
        this.guestBlock = document.getElementById('guestBlock');
        this.tariffGrid = document.getElementById('tariffGrid');
        this.loadingSpinner = document.getElementById('loadingSpinner');

        this.initChartDraw();
        await this.loadUserData();
        await this.loadTariffs();
        this.updateAuthUI();
        this.initDateMasks();
        this.initCitySearch();
        this.addEventListeners();
    }

    initChartDraw() {
        const canvas = document.getElementById('natalChartCanvas');
        if (canvas) {
            this.chartDraw = new NatalChartDraw('natalChartCanvas');
        }
    }

    async loadUserData() {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const response = await fetch('/api/profile', { headers: { 'Authorization': `Bearer ${token}` } });
            if (response.ok) {
                const data = await response.json();
                this.user = data.data.user;
            }
        } catch (error) {
            console.error('Ошибка загрузки пользователя:', error);
        }
    }

    async loadTariffs() {
        try {
            const response = await fetch('/api/astropsychology/types');
            if (response.ok) {
                const data = await response.json();
                this.tariffs = data.data;
                this.renderTariffs();
            }
        } catch (error) {
            console.error('Ошибка загрузки тарифов:', error);
        }
    }

    renderTariffs() {
        if (!this.tariffGrid) return;
        let html = '';
        const tariffTypes = {
            'astro_basic': { icon: 'fas fa-star', color: '#c9a54b', desc: 'Основной портрет' },
            'astro_quick': { icon: 'fas fa-bolt', color: '#ff9800', desc: 'Экспресс-анализ' },
            'astro_standard': { icon: 'fas fa-chart-line', color: '#2196f3', desc: 'Полный портрет' },
            'astro_full': { icon: 'fas fa-chart-pie', color: '#4caf50', desc: 'Глубокий анализ + карта' },
            'astro_premium': { icon: 'fas fa-gem', color: '#9c27b0', desc: 'Максимальный разбор + карта' }
        };

        this.tariffs.forEach(tariff => {
            const typeInfo = tariffTypes[tariff.code] || { icon: 'fas fa-calculator', color: '#6a6a7a', desc: '' };
            let cardClass = 'tariff-card';
            let isLocked = false;
            let clickHandler = `astropsychologyApp.selectTariff('${tariff.code}')`;

            if (!this.user && tariff.price > 0) {
                cardClass += ' locked';
                isLocked = true;
                clickHandler = `astropsychologyApp.showAuthModal()`;
            }
            if (tariff.price === 0) cardClass += ' free';
            if (this.selectedTariff?.code === tariff.code) cardClass += ' selected';

            html += `
                <div class="${cardClass}" onclick="${clickHandler}">
                    ${isLocked ? '<div class="lock-overlay-small"><i class="fas fa-lock"></i></div>' : ''}
                    <div class="tariff-icon"><i class="${typeInfo.icon}" style="color: ${typeInfo.color}"></i></div>
                    <h3 class="tariff-name">${tariff.name}</h3>
                    <p class="tariff-description">${tariff.description}</p>
                    <div class="tariff-price">${tariff.price === 0 ? '<span class="price-free">Бесплатно</span>' : `<span class="price-current">${tariff.price} ₽</span>`}</div>
                    <ul class="tariff-features">${this.getTariffFeatures(tariff.code).map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('')}</ul>
                    <button class="btn-select ${isLocked ? 'locked' : ''}">${isLocked ? 'Войти и выбрать' : 'Выбрать'}</button>
                </div>
            `;
        });
        this.tariffGrid.innerHTML = html;
    }

    getTariffFeatures(code) {
        const features = {
            'astro_basic': ['Асцендент', 'Солнце (сущность, эго)', 'Луна (эмоции, подсознание)', 'Базовый психологический портрет', 'Ключевые сильные стороны'],
            'astro_quick': ['Всё из базового', 'Позиции Меркурия, Венеры, Марса', 'Краткий прогноз на неделю', 'Советы по саморазвитию'],
            'astro_standard': ['Всё из экспресс-анализа', 'Все 10 планет в знаках', 'Психологический анализ характера', 'Сильные стороны и зоны роста', 'Путь развития', 'Прогноз на месяц'],
            'astro_full': ['Всё из стандартного портрета', 'Анализ аспектов между планетами', 'Психологический портрет по домам', 'Анализ отношений (совместимость)', 'Годовой прогноз', 'Натальная карта (визуализация)', 'Скачивание PDF-отчета'],
            'astro_premium': ['Всё из полного анализа', 'Детальный разбор всех аспектов', 'Проработка кармических задач', 'Транзитный прогноз на 3 месяца', 'Персональные рекомендации', 'Натальная карта (визуализация)', 'Приоритетная поддержка']
        };
        return features[code] || ['Все основные расчеты'];
    }

    selectTariff(tariffCode) {
        const tariff = this.tariffs.find(t => t.code === tariffCode);
        if (!tariff) return;
        this.selectedTariff = tariff;
        document.getElementById('selectedTariffTitle').textContent = tariff.name;
        document.getElementById('selectedTariffDescription').textContent = tariff.description;
        document.getElementById('selectedTariffPrice').innerHTML = tariff.price === 0 ? '<span class="price-free">Бесплатно</span>' : `<span class="price-current">${tariff.price} ₽</span>`;
        this.tariffSection.style.display = 'none';
        this.inputSection.style.display = 'block';
        this.renderTariffs();
    }

    showAuthModal() {
        const modal = document.createElement('div');
        modal.className = 'auth-modal';
        modal.innerHTML = `
            <div class="auth-modal-content">
                <i class="fas fa-lock modal-lock-icon"></i>
                <h3>Войдите в аккаунт</h3>
                <p>Чтобы получить доступ к платным расчетам, нужно войти или зарегистрироваться</p>
                <div class="auth-modal-actions">
                    <a href="/login" class="btn btn-primary">Войти</a>
                    <a href="/register" class="btn btn-outline">Создать аккаунт</a>
                </div>
                <button class="auth-modal-close" onclick="this.closest('.auth-modal').remove()"><i class="fas fa-times"></i></button>
            </div>
        `;
        document.body.appendChild(modal);
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
    }

    updateAuthUI() {

        if (this.user) {
            if (this.guestBlock) this.guestBlock.style.display = 'none';
            if (this.tariffSection) this.tariffSection.style.display = 'block';
        }


    }

    logout() {
        localStorage.removeItem('token');
        window.location.href = '/';
    }

    initDateMasks() {
        const birthDateInput = document.getElementById('birthDate');
        if (birthDateInput && typeof IMask !== 'undefined') {
            IMask(birthDateInput, {
                mask: Date, pattern: 'd{.}`m{.}`Y',
                blocks: { d: { mask: IMask.MaskedRange, from: 1, to: 31, maxLength: 2 }, m: { mask: IMask.MaskedRange, from: 1, to: 12, maxLength: 2 }, Y: { mask: IMask.MaskedRange, from: 1900, to: 2100, maxLength: 4 } },
                format: function(date) { const day = String(date.getDate()).padStart(2, '0'); const month = String(date.getMonth() + 1).padStart(2, '0'); const year = date.getFullYear(); return `${day}.${month}.${year}`; },
                parse: function(str) { const [day, month, year] = str.split('.'); return new Date(year, month - 1, day); },
                lazy: false, autofix: true
            });
        }
    }

    initCitySearch() {
        const birthPlaceInput = document.getElementById('birthPlace');
        const suggestionsContainer = document.getElementById('citySuggestions');
        const latitudeInput = document.getElementById('latitude');
        const longitudeInput = document.getElementById('longitude');
        const searchButton = document.getElementById('searchCity');
        let searchTimeout = null;

        if (birthPlaceInput) {
            birthPlaceInput.addEventListener('input', (e) => {
                const query = e.target.value.trim();
                if (latitudeInput) latitudeInput.value = '';
                if (longitudeInput) longitudeInput.value = '';
                if (searchTimeout) clearTimeout(searchTimeout);
                if (query.length >= 2) {
                    searchTimeout = setTimeout(() => this.searchCity(query), 500);
                } else {
                    if (suggestionsContainer) suggestionsContainer.style.display = 'none';
                }
            });
            document.addEventListener('click', (e) => {
                if (suggestionsContainer && !birthPlaceInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
                    suggestionsContainer.style.display = 'none';
                }
            });
        }
        if (searchButton) {
            searchButton.addEventListener('click', async () => {
                const city = birthPlaceInput?.value.trim();
                if (!city || city.length < 2) { this.showNotification('Введите название города', 'error'); return; }
                await this.searchCity(city);
            });
        }
    }

    async searchCity(query) {
        const suggestionsContainer = document.getElementById('citySuggestions');
        try {
            const response = await fetch(`/api/geocode/search?q=${encodeURIComponent(query)}&limit=5`);
            if (!response.ok) throw new Error('Ошибка сети');
            const data = await response.json();
            if (data && data.length > 0) {
                this.displaySuggestions(data);
            } else {
                if (suggestionsContainer) suggestionsContainer.style.display = 'none';
                this.showNotification('Город не найден', 'error');
            }
        } catch (error) {
            console.error('Ошибка поиска города:', error);
            if (suggestionsContainer) suggestionsContainer.style.display = 'none';
            this.showNotification('Ошибка при поиске города', 'error');
        }
    }

    displaySuggestions(cities) {
        const suggestionsContainer = document.getElementById('citySuggestions');
        const latitudeInput = document.getElementById('latitude');
        const longitudeInput = document.getElementById('longitude');
        const birthPlaceInput = document.getElementById('birthPlace');
        if (!suggestionsContainer) return;
        suggestionsContainer.innerHTML = '';
        cities.forEach(city => {
            const cityName = city.display_name.split(',')[0];
            const country = city.address?.country || '';
            const region = city.address?.state || city.address?.region || '';
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.innerHTML = `<div class="suggestion-main">${this.escapeHtml(cityName)}</div><div class="suggestion-detail">${this.escapeHtml(region)} ${this.escapeHtml(country)}</div>`;
            item.addEventListener('click', () => {
                if (birthPlaceInput) birthPlaceInput.value = cityName;
                if (latitudeInput) latitudeInput.value = parseFloat(city.lat).toFixed(6);
                if (longitudeInput) longitudeInput.value = parseFloat(city.lon).toFixed(6);
                suggestionsContainer.style.display = 'none';
                this.showNotification(`✅ Выбран город: ${cityName}`, 'success');
            });
            suggestionsContainer.appendChild(item);
        });
        suggestionsContainer.style.display = 'block';
    }

    addEventListeners() {
        if (this.form) this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        document.getElementById('newCalculationBtn')?.addEventListener('click', () => this.resetForm());
        document.getElementById('downloadPdfBtn')?.addEventListener('click', () => this.downloadPDF());
    }

    async handleSubmit(e) {
        e.preventDefault();
        const fullName = document.getElementById('fullName').value.trim();
        const birthDate = document.getElementById('birthDate').value.trim();
        const birthTime = document.getElementById('birthTime').value;
        const latitude = parseFloat(document.getElementById('latitude').value) || 55.7558;
        const longitude = parseFloat(document.getElementById('longitude').value) || 37.6173;
        const question = document.getElementById('question').value.trim();

        if (!fullName || !birthDate || !birthTime) { this.showNotification('Пожалуйста, заполните все поля', 'error'); return; }
        if (!this.isValidDate(birthDate)) { this.showNotification('Введите дату в формате ДД.ММ.ГГГГ', 'error'); return; }
        if (!this.user && this.selectedTariff?.price > 0) { this.showAuthModal(); return; }

        this.showLoading(true);
        try {
            const token = localStorage.getItem('token');
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;
            const response = await fetch(`/api/astropsychology/calculate/${this.selectedTariff.code}`, {
                method: 'POST', headers,
                body: JSON.stringify({ fullName, birthDate, birthTime, latitude, longitude, question })
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                if (response.status === 401) { this.showNotification('Необходимо авторизоваться', 'error'); setTimeout(() => window.location.href = '/login', 2000); return; }
                if (response.status === 402) { this.showPaymentModal(errorData); this.showLoading(false); return; }
                throw new Error(errorData.error || `Ошибка ${response.status}`);
            }
            const result = await response.json();
            if (result.success) {
                this.currentCalculation = result.data;
                window.currentCalculationId = result.calculationId;
                this.displayResults(result.data);
            } else {
                throw new Error(result.error || 'Ошибка расчета');
            }
        } catch (error) {
            console.error('❌ Ошибка:', error);
            this.showNotification(error.message, 'error');
        } finally {
            this.showLoading(false);
        }
    }

    displayResults(data) {
        document.getElementById('resultType').textContent = `🌟 ${this.selectedTariff?.name || 'Астропсихологический портрет'}`;
        document.getElementById('resultBadge').innerHTML = `<span class="result-badge">${this.selectedTariff?.name || 'Расчет'}</span>`;
        document.getElementById('resultFullName').textContent = data.fullName || '—';
        document.getElementById('resultBirthDate').textContent = `${data.birthData?.date || '—'} ${data.birthData?.time || ''}`;

        // Асцендент
        if (data.ascendant) {
            document.getElementById('ascendantSign').textContent = `${data.ascendant.sign || ''} ${data.ascendant.degree || ''}°`;
            document.getElementById('ascendantDescription').textContent = data.ascendant.description || '';
        }

        // Солнце
        if (data.sun) {
            document.getElementById('sunSign').textContent = `${data.sun.sign || ''} ${data.sun.degree || ''}°`;
            document.getElementById('sunDescription').textContent = data.sun.description || '';
        }

        // Луна
        if (data.moon) {
            document.getElementById('moonSign').textContent = `${data.moon.sign || ''} ${data.moon.degree || ''}°`;
            document.getElementById('moonDescription').textContent = data.moon.description || '';
        }

        // Планеты
        const planetsGrid = document.getElementById('planetsGrid');
        if (planetsGrid && data.planets) {
            planetsGrid.innerHTML = '';
            data.planets.forEach(planet => {
                const div = document.createElement('div');
                div.className = 'planet-item';
                div.innerHTML = `<div class="planet-symbol">${planet.symbol || '●'}</div><div class="planet-name">${planet.name || ''}</div><div>${planet.sign || ''} ${planet.degree || ''}°</div>`;
                planetsGrid.appendChild(div);
            });
        }

        // ========== НАТАЛЬНАЯ КАРТА (CANVAS) - ИСПРАВЛЕНО ==========
        const canvasContainer = document.getElementById('natalChartContainer');
        const canvas = document.getElementById('natalChartCanvas');

        // Проверяем, нужно ли отображать натальную карту (для full и premium)
        const showChart = this.selectedTariff?.code === 'astro_full' || this.selectedTariff?.code === 'astro_premium';

        if (showChart && canvas && this.chartDraw) {
            if (canvasContainer) canvasContainer.style.display = 'block';

            // ПРЕОБРАЗУЕМ МАССИВ ПЛАНЕТ В ОБЪЕКТ
            const planetsObject = {};
            const planetNameToKey = {
                'Солнце': 'sun', 'Луна': 'moon', 'Меркурий': 'mercury', 'Венера': 'venus',
                'Марс': 'mars', 'Юпитер': 'jupiter', 'Сатурн': 'saturn',
                'Уран': 'uranus', 'Нептун': 'neptune', 'Плутон': 'pluto'
            };

            if (data.planets && Array.isArray(data.planets)) {
                data.planets.forEach(planet => {
                    const key = planetNameToKey[planet.name];
                    if (key) {
                        // Ищем угол для этой планеты в chartDrawData
                        let angle = null;
                        if (data.chartDrawData?.points) {
                            const point = data.chartDrawData.points.find(p => p.name === planet.symbol);
                            if (point) angle = point.angle;
                        }
                        planetsObject[key] = {
                            name: planet.name,
                            symbol: planet.symbol,
                            sign: planet.sign,
                            degreeInSign: planet.degree,
                            longitude: angle !== null ? angle : (parseFloat(planet.degree) || 0)
                        };
                    }
                });
            }

            // Получаем дома
            const houses = data.houses || [];

            // Получаем аспекты
            const aspects = data.aspects || [];

            // Формируем данные для отрисовки
            const drawData = {
                planets: planetsObject,
                houses: houses,
                aspects: aspects,
                chartData: data.chartDrawData || { points: [], cusps: [] }
            };

            console.log('🎨 Отрисовка натальной карты с планетами:', drawData);

            try {
                this.chartDraw.draw(drawData);
            } catch (error) {
                console.error('Ошибка отрисовки натальной карты:', error);
            }
        } else {
            if (canvasContainer) canvasContainer.style.display = 'none';
        }

        // Дома
        const housesSection = document.getElementById('housesSection');
        const housesList = document.getElementById('housesList');
        if (housesSection && housesList && data.houses && data.houses.length > 0 && showChart) {
            housesSection.style.display = 'block';
            housesList.innerHTML = '';
            data.houses.forEach(house => {
                const div = document.createElement('div');
                div.className = 'house-item';
                div.innerHTML = `
                <strong>${house.number} дом (${house.sign || '—'})</strong><br>
                ${house.description || ''}
                ${house.planets?.length ? `<br><small>⭐ Планеты: ${house.planets.join(', ')}</small>` : ''}
            `;
                housesList.appendChild(div);
            });
        } else if (housesSection) {
            housesSection.style.display = 'none';
        }

        // Аспекты
        const aspectsSection = document.getElementById('aspectsSection');
        const aspectsListEl = document.getElementById('aspectsList');
        if (aspectsSection && aspectsListEl && data.aspects && data.aspects.length > 0 && showChart) {
            aspectsSection.style.display = 'block';
            aspectsListEl.innerHTML = '';
            data.aspects.slice(0, 15).forEach(aspect => {
                const div = document.createElement('div');
                div.className = `aspect-item ${aspect.type || ''}`;
                div.innerHTML = `${aspect.planet1} — ${aspect.planet2}: ${aspect.description || '—'}`;
                aspectsListEl.appendChild(div);
            });
        } else if (aspectsSection) {
            aspectsSection.style.display = 'none';
        }

        // Психология
        if (data.psychology) {
            document.getElementById('psychEgo').textContent = data.psychology.ego || '';
            document.getElementById('psychEmotions').textContent = data.psychology.emotions || '';
            document.getElementById('psychPersonality').textContent = data.psychology.personality || '';
            document.getElementById('astroStrengths').innerHTML = (data.psychology.strengths || []).map(s => `<li>✨ ${s}</li>`).join('') || '<li>—</li>';
            document.getElementById('astroChallenges').innerHTML = (data.psychology.challenges || []).map(c => `<li>🌙 ${c}</li>`).join('') || '<li>—</li>';
            document.getElementById('growthPath').textContent = data.psychology.growthPath || '';

            // Расширенная психология (для полных версий)
            const extendedPsychology = document.getElementById('extendedPsychology');
            if (extendedPsychology && showChart) {
                extendedPsychology.style.display = 'block';

                const thinkingStyleItem = document.getElementById('thinkingStyleItem');
                if (thinkingStyleItem && data.psychology.thinkingStyle) {
                    thinkingStyleItem.style.display = 'block';
                    document.getElementById('thinkingStyle').textContent = data.psychology.thinkingStyle;
                } else if (thinkingStyleItem) thinkingStyleItem.style.display = 'none';

                const emotionalNeedsItem = document.getElementById('emotionalNeedsItem');
                if (emotionalNeedsItem && data.psychology.emotionalNeeds) {
                    emotionalNeedsItem.style.display = 'block';
                    document.getElementById('emotionalNeeds').textContent = data.psychology.emotionalNeeds;
                } else if (emotionalNeedsItem) emotionalNeedsItem.style.display = 'none';

                const shadowAspectsItem = document.getElementById('shadowAspectsItem');
                if (shadowAspectsItem && data.psychology.shadowAspects) {
                    shadowAspectsItem.style.display = 'block';
                    document.getElementById('shadowAspects').textContent = data.psychology.shadowAspects;
                } else if (shadowAspectsItem) shadowAspectsItem.style.display = 'none';

                const lifePurposeItem = document.getElementById('lifePurposeItem');
                if (lifePurposeItem && data.psychology.lifePurpose) {
                    lifePurposeItem.style.display = 'block';
                    document.getElementById('lifePurpose').textContent = data.psychology.lifePurpose;
                } else if (lifePurposeItem) lifePurposeItem.style.display = 'none';
            } else if (extendedPsychology) {
                extendedPsychology.style.display = 'none';
            }
        }

        // Прогноз
        const forecastGrid = document.getElementById('forecastGrid');
        if (forecastGrid && data.forecast) {
            let forecastHtml = `
            <div class="forecast-item"><strong>💼 Карьера</strong><br>${data.forecast.career || '—'}</div>
            <div class="forecast-item"><strong>❤️ Любовь</strong><br>${data.forecast.love || '—'}</div>
            <div class="forecast-item"><strong>🌿 Здоровье</strong><br>${data.forecast.health || '—'}</div>
            <div class="forecast-item"><strong>✨ Общий</strong><br>${data.forecast.general || '—'}</div>
        `;
            if (data.forecast.week) forecastHtml += `<div class="forecast-item full"><strong>📅 Недельный прогноз</strong><br>${data.forecast.week}</div>`;
            if (data.forecast.month) forecastHtml += `<div class="forecast-item full"><strong>📅 Месячный прогноз</strong><br>${data.forecast.month}</div>`;
            if (data.forecast.year) forecastHtml += `<div class="forecast-item full"><strong>📅 Годовой прогноз</strong><br>${data.forecast.year}</div>`;
            forecastGrid.innerHTML = forecastHtml;
        }

        // Расширенный прогноз
        const extendedForecast = document.getElementById('extendedForecast');
        if (extendedForecast && showChart) {
            extendedForecast.style.display = 'block';
            const weeklyEl = document.getElementById('weeklyForecast');
            const monthlyEl = document.getElementById('monthlyForecast');
            const yearlyEl = document.getElementById('yearlyForecast');
            if (weeklyEl) weeklyEl.innerHTML = data.forecast?.week ? `<strong>📆 НЕДЕЛЬНЫЙ ПРОГНОЗ</strong><br>${data.forecast.week}` : '';
            if (monthlyEl) monthlyEl.innerHTML = data.forecast?.month ? `<strong>📆 МЕСЯЧНЫЙ ПРОГНОЗ</strong><br>${data.forecast.month}` : '';
            if (yearlyEl) yearlyEl.innerHTML = data.forecast?.year ? `<strong>📆 ГОДОВОЙ ПРОГНОЗ</strong><br>${data.forecast.year}` : '';
        } else if (extendedForecast) {
            extendedForecast.style.display = 'none';
        }

        // Кармический анализ (премиум)
        const karmaSection = document.getElementById('karmaSection');
        if (karmaSection && this.selectedTariff?.code === 'astro_premium') {
            karmaSection.style.display = 'block';
            document.getElementById('karmaPast').innerHTML = `<strong>📜 Уроки прошлых жизней:</strong><br>${data.karma?.pastLifeLessons || '—'}`;
            document.getElementById('karmaTask').innerHTML = `<strong>🎯 Задача текущего воплощения:</strong><br>${data.karma?.currentTask || '—'}`;
            document.getElementById('karmaLesson').innerHTML = `<strong>⚡ Главный кармический урок:</strong><br>${data.karma?.saturnLesson || '—'}`;
        } else if (karmaSection) {
            karmaSection.style.display = 'none';
        }

        // Рекомендации (премиум)
        const recommendationsSection = document.getElementById('recommendationsSection');
        if (recommendationsSection && this.selectedTariff?.code === 'astro_premium') {
            recommendationsSection.style.display = 'block';
            const recommendationsList = document.getElementById('recommendationsList');
            if (recommendationsList) {
                recommendationsList.innerHTML = (data.recommendations || []).map(r => `<li>✨ ${r}</li>`).join('') || '<li>—</li>';
            }
        } else if (recommendationsSection) {
            recommendationsSection.style.display = 'none';
        }

        // Аффирмация (премиум)
        const affirmationSection = document.getElementById('affirmationSection');
        if (affirmationSection && this.selectedTariff?.code === 'astro_premium') {
            affirmationSection.style.display = 'block';
            document.getElementById('affirmationText').innerHTML = `"${data.forecast?.affirmations || 'Я доверяю себе и своему пути.'}"`;
        } else if (affirmationSection) {
            affirmationSection.style.display = 'none';
        }

        // Полная интерпретация
        const interpretationText = document.getElementById('interpretationText');
        if (interpretationText) {
            interpretationText.innerHTML = data.interpretation?.replace(/\n/g, '<br>') || 'Интерпретация формируется...';
        }

        // Кнопка PDF (только для платных версий)
        const downloadBtn = document.getElementById('downloadPdfBtn');
        if (downloadBtn && this.user && this.selectedTariff?.price > 0) {
            downloadBtn.style.display = 'inline-flex';
        } else if (downloadBtn) {
            downloadBtn.style.display = 'none';
        }

        this.tariffSection.style.display = 'none';
        this.inputSection.style.display = 'none';
        this.resultSection.style.display = 'block';
        this.resultSection.scrollIntoView({ behavior: 'smooth' });
    }

// Вспомогательные методы для конвертации данных
    convertPlanetsToPoints(planets) {
        const points = [];
        if (!planets) return points;

        const symbols = {
            sun: '☉', moon: '☽', mercury: '☿', venus: '♀',
            mars: '♂', jupiter: '♃', saturn: '♄',
            uranus: '♅', neptune: '♆', pluto: '♇'
        };

        Object.entries(planets).forEach(([key, planet]) => {
            if (planet && planet.longitude !== undefined) {
                points.push({
                    name: symbols[key] || key.substring(0, 2).toUpperCase(),
                    angle: planet.longitude || 0
                });
            }
        });
        return points;
    }

    convertHousesToCusps(houses) {
        if (!houses) return [];
        return houses.map(house => ({ angle: house.cusp || 0 }));
    }

    async downloadPDF() {
        try {
            if (!window.currentCalculationId) { this.showNotification('Сначала выполните расчет', 'error'); return; }
            this.showNotification('Генерируем PDF отчет...', 'info');
            const response = await fetch(`/api/astropsychology/pdf/${window.currentCalculationId}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (!response.ok) throw new Error(`Ошибка ${response.status}`);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `astropsychology-${window.currentCalculationId}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            this.showNotification('PDF отчет готов!', 'success');
        } catch (error) {
            console.error('❌ Ошибка скачивания PDF:', error);
            this.showNotification('Ошибка при создании PDF', 'error');
        }
    }

    resetForm() {
        this.resultSection.style.display = 'none';
        this.tariffSection.style.display = 'block';
        this.inputSection.style.display = 'none';
        this.selectedTariff = null;
        if (this.form) this.form.reset();
        const timeInput = document.getElementById('birthTime');
        if (timeInput) timeInput.value = '12:00';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    isValidDate(dateStr) {
        if (!dateStr) return false;
        const pattern = /^\d{2}\.\d{2}\.\d{4}$/;
        if (!pattern.test(dateStr)) return false;
        const [day, month, year] = dateStr.split('.').map(Number);
        if (month < 1 || month > 12) return false;
        if (day < 1 || day > 31) return false;
        const daysInMonth = new Date(year, month, 0).getDate();
        return day <= daysInMonth;
    }

    showLoading(show) {
        if (this.loadingSpinner) this.loadingSpinner.style.display = show ? 'flex' : 'none';
        if (this.form) {
            this.form.style.opacity = show ? '0.5' : '1';
            this.form.style.pointerEvents = show ? 'none' : 'auto';
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `<i class="fas fa-${type === 'error' ? 'exclamation-circle' : type === 'success' ? 'check-circle' : 'info-circle'}"></i><span>${this.escapeHtml(message)}</span>`;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    showPaymentModal(errorData) {
        const modal = document.createElement('div');
        modal.className = 'payment-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <i class="fas fa-coins modal-icon"></i>
                <h3>Недостаточно средств</h3>
                <p class="balance-info">Баланс: <strong>${errorData.balance || 0} ₽</strong><br>Требуется: <strong>${errorData.required || errorData.price || 0} ₽</strong></p>
                <div class="modal-actions">
                    <a href="/cabinet/balance" class="btn btn-primary">Пополнить баланс</a>
                    <button class="btn btn-outline" onclick="this.closest('.payment-modal').remove()">Закрыть</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
    }

    escapeHtml(str) {
        if (!str) return '';
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
}

const astropsychologyApp = new AstropsychologyApp();
window.astropsychologyApp = astropsychologyApp;