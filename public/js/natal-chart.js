// natal-chart.js
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('natalChartForm');
    const canvas = document.getElementById('natalChartCanvas');
    const resultSection = document.getElementById('resultSection');
    const newBtn = document.getElementById('newCalculationBtn');

    let chartDraw = null;
    let dateMask = null;
    let searchTimeout = null;

    if (canvas) {
        chartDraw = new NatalChartDraw('natalChartCanvas');
    }

    // ==================== МАСКА ДЛЯ ДАТЫ ====================
    const birthDateInput = document.getElementById('birthDate');
    if (birthDateInput && typeof IMask !== 'undefined') {
        dateMask = IMask(birthDateInput, {
            mask: '00.00.0000',
            blocks: {
                dd: { // день
                    mask: IMask.MaskedRange,
                    from: 1,
                    to: 31,
                    maxLength: 2
                },
                mm: { // месяц
                    mask: IMask.MaskedRange,
                    from: 1,
                    to: 12,
                    maxLength: 2
                },
                yyyy: { // год
                    mask: IMask.MaskedRange,
                    from: 1900,
                    to: 2100,
                    maxLength: 4
                }
            },
            lazy: false, // показывать плейсхолдер
            autofix: true, // автоматически исправлять неверные значения
            placeholderChar: '_'
        });

        // Оставляем поле пустым
        birthDateInput.value = '';
    }

    // ==================== АВТОМАТИЧЕСКИЙ ПОИСК ГОРОДА ====================
    const birthPlaceInput = document.getElementById('birthPlace');
    const suggestionsContainer = document.getElementById('citySuggestions');
    const latitudeInput = document.getElementById('latitude');
    const longitudeInput = document.getElementById('longitude');
    const searchButton = document.getElementById('searchCity');

    // Функция поиска города
    async function searchCity(query) {
        if (!query || query.length < 2) {
            if (suggestionsContainer) {
                suggestionsContainer.style.display = 'none';
            }
            return;
        }

        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`);
            const data = await response.json();

            if (data && data.length > 0) {
                displaySuggestions(data);
            } else {
                if (suggestionsContainer) {
                    suggestionsContainer.style.display = 'none';
                }
            }
        } catch (error) {
            console.error('Ошибка поиска города:', error);
            if (suggestionsContainer) {
                suggestionsContainer.style.display = 'none';
            }
        }
    }

    // Отображение подсказок
    function displaySuggestions(cities) {
        if (!suggestionsContainer) return;

        suggestionsContainer.innerHTML = '';

        cities.forEach(city => {
            const cityName = city.display_name.split(',')[0];
            const country = city.address?.country || '';
            const region = city.address?.state || city.address?.region || '';

            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.innerHTML = `
                <div class="suggestion-main">${cityName}</div>
                <div class="suggestion-detail">${region} ${country}</div>
            `;

            item.addEventListener('click', () => {
                birthPlaceInput.value = cityName;
                latitudeInput.value = parseFloat(city.lat).toFixed(6);
                longitudeInput.value = parseFloat(city.lon).toFixed(6);
                suggestionsContainer.style.display = 'none';

            });

            suggestionsContainer.appendChild(item);
        });

        suggestionsContainer.style.display = 'block';
    }

    if (birthPlaceInput) {
        // Обработчик ввода города с debounce
        birthPlaceInput.addEventListener('input', function(e) {
            const query = e.target.value.trim();

            // Очищаем координаты при изменении города
            if (latitudeInput) latitudeInput.value = '';
            if (longitudeInput) longitudeInput.value = '';

            // Очищаем предыдущий таймаут
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }

            // Устанавливаем новый таймаут
            if (query.length >= 2) {
                searchTimeout = setTimeout(() => {
                    searchCity(query);
                }, 500);
            } else {
                if (suggestionsContainer) {
                    suggestionsContainer.style.display = 'none';
                }
            }
        });

        // Закрытие подсказок при клике вне
        document.addEventListener('click', function(e) {
            if (suggestionsContainer &&
                !birthPlaceInput.contains(e.target) &&
                !suggestionsContainer.contains(e.target)) {
                suggestionsContainer.style.display = 'none';
            }
        });
    }

    // Кнопка поиска (ручной поиск)
    if (searchButton) {
        searchButton.addEventListener('click', async function() {
            const city = birthPlaceInput?.value.trim();
            if (!city || city.length < 2) {
                showNotification('❌ Введите название города (минимум 2 символа)', 'error');
                return;
            }

            try {
                showNotification('🔍 Ищем город...', 'info');
                const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}&limit=1`);
                const data = await response.json();

                if (data && data[0]) {
                    if (latitudeInput) latitudeInput.value = parseFloat(data[0].lat).toFixed(6);
                    if (longitudeInput) longitudeInput.value = parseFloat(data[0].lon).toFixed(6);
                    showNotification(`✅ Найдены координаты для ${data[0].display_name.split(',')[0]}`, 'success');
                    if (suggestionsContainer) {
                        suggestionsContainer.style.display = 'none';
                    }
                } else {
                    showNotification('❌ Город не найден', 'error');
                }
            } catch (error) {
                console.error('Ошибка поиска города:', error);
                showNotification('❌ Ошибка при поиске города', 'error');
            }
        });
    }

    // ==================== ВАЛИДАЦИЯ ФОРМЫ ====================
    function validateForm(data) {
        if (!data.fullName) {
            showNotification('❌ Укажите имя', 'error');
            return false;
        }

        // Проверка даты через маску
        if (!dateMask || !dateMask.value || dateMask.value.length !== 10) {
            showNotification('❌ Введите корректную дату в формате ДД.ММ.ГГГГ', 'error');
            return false;
        }

        const [day, month, year] = dateMask.value.split('.').map(Number);
        if (!isValidDate(day, month, year)) {
            showNotification('❌ Проверьте правильность даты', 'error');
            return false;
        }

        // Проверка времени
        const timeInput = document.getElementById('birthTime');
        if (!timeInput || !timeInput.value || !timeInput.value.match(/^\d{2}:\d{2}$/)) {
            showNotification('❌ Укажите время рождения', 'error');
            return false;
        }

        return true;
    }

    function isValidDate(day, month, year) {
        if (month < 1 || month > 12) return false;
        if (day < 1 || day > 31) return false;

        const date = new Date(year, month - 1, day);
        return date.getDate() === day &&
            date.getMonth() === month - 1 &&
            date.getFullYear() === year;
    }

    // ==================== ОБРАБОТКА ФОРМЫ ====================
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = {
                fullName: document.getElementById('fullName')?.value || '',
                gender: document.getElementById('gender')?.value || 'male',
                birthDate: document.getElementById('birthDate')?.value || '',
                birthTime: document.getElementById('birthTime')?.value || '12:00',
                latitude: parseFloat(document.getElementById('latitude')?.value) || 55.7558,
                longitude: parseFloat(document.getElementById('longitude')?.value) || 37.6173,
                houseSystem: document.getElementById('houseSystem')?.value || 'placidus'
            };

            if (!validateForm(formData)) return;


            try {
                const response = await fetch('/api/calculate/astrology', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (result.success) {
                    displayResults(formData, result.data);
                } else {
                    showNotification('❌ Ошибка расчета: ' + result.error, 'error');
                }
            } catch (error) {
                console.error('Ошибка:', error);
                showNotification('❌ Ошибка при подключении к серверу', 'error');
            }
        });
    }

    // ==================== ОТОБРАЖЕНИЕ РЕЗУЛЬТАТОВ ====================

    function displayResults(formData, chartData) {
        window.currentNatalChartData = chartData;
        const resultName = document.getElementById('resultName');
        const resultDate = document.getElementById('resultDate');
        const resultTime = document.getElementById('resultTime');

        if (resultName) resultName.textContent = formData.fullName || '—';
        if (resultDate) resultDate.textContent = formData.birthDate || '—';
        if (resultTime) resultTime.textContent = formData.birthTime || '—';

        // Проверяем наличие данных
        if (!chartData) {
            console.error('Нет данных для отображения');
            return;
        }

        // Безопасно преобразуем данные для отрисовки
        const planetsForDraw = chartData.planets ? transformPlanetsData(chartData.planets) : {};
        const housesForDraw = Array.isArray(chartData.houses) ? chartData.houses : [];
        const ascendant = chartData.ascendant?.degree || chartData.ascendant || 0;

        // Генерируем аспекты, если их нет
        const aspects = Array.isArray(chartData.aspects) ? chartData.aspects : generateAspects(planetsForDraw);

        // Данные для отрисовки канваса
        const drawData = {
            planets: planetsForDraw,
            houses: housesForDraw,
            ascendant: ascendant,
            aspects: aspects
        };

        if (chartDraw) {
            try {
                chartDraw.draw(drawData);
            } catch (e) {
                console.error('Ошибка отрисовки канваса:', e);
            }
        }

        // Отображаем легенду планет
        displayLegend(planetsForDraw);

        // Расширенная информация о планетах
        if (chartData.planets) {
            displayEnrichedPlanetsInfo(chartData.planets);
        }

        // Информация о домах
        if (housesForDraw.length > 0) {
            displayEnrichedHousesInfo(housesForDraw);
        }

        // Информация об аспектах
        if (aspects.length > 0) {
            displayEnrichedAspectsInfo(aspects);
        }

        // Отображаем позиции планет
        displayPlanetPositions(planetsForDraw);

        // Отображаем аспекты
        displayAspects(aspects);

        // Основная интерпретация
        const interpretation = generateInterpretation(planetsForDraw, housesForDraw, ascendant, aspects);

        let interpretationContainer = document.getElementById('natalInterpretation');
        if (!interpretationContainer) {
            interpretationContainer = document.createElement('div');
            interpretationContainer.id = 'natalInterpretation';
            interpretationContainer.className = 'natal-interpretation';
            const resultCard = document.querySelector('.result-card');
            if (resultCard) {
                resultCard.appendChild(interpretationContainer);
            }
        }
        interpretationContainer.innerHTML = interpretation;

        // Расширенный отчет
        const expandedReport = generateExpandedReport(planetsForDraw, ascendant);

        let reportContainer = document.getElementById('expandedReport');
        if (!reportContainer) {
            reportContainer = document.createElement('div');
            reportContainer.id = 'expandedReport';
            reportContainer.className = 'expanded-report-container';
            const resultCard = document.querySelector('.result-card');
            if (resultCard) {
                resultCard.appendChild(reportContainer);
            }
        }
        reportContainer.innerHTML = expandedReport;

        if (resultSection) {
            resultSection.style.display = 'block';
        }

        setTimeout(() => {
            resultSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }

// ==================== ИСПРАВЛЕННЫЕ ФУНКЦИИ С ПРОВЕРКАМИ ====================

    /**
     * Отображает расширенную информацию о планетах
     */
    function displayEnrichedPlanetsInfo(planets) {
        if (!planets || typeof planets !== 'object') {
            console.warn('Нет данных о планетах для отображения');
            return;
        }

        // Создаем или находим контейнер
        let container = document.getElementById('enrichedPlanetsInfo');
        if (!container) {
            container = document.createElement('div');
            container.id = 'enrichedPlanetsInfo';
            container.className = 'enriched-planets-section';

            const resultCard = document.querySelector('.result-card');
            if (resultCard) {
                const chartWrapper = document.querySelector('.natal-chart-wrapper');
                if (chartWrapper) {
                    chartWrapper.parentNode.insertBefore(container, chartWrapper.nextSibling);
                } else {
                    resultCard.appendChild(container);
                }
            } else {
                return; // Нет места для вставки
            }
        }

        let html = `
        <h3>🪐 ЗНАЧЕНИЕ ПЛАНЕТ</h3>
        <div class="enriched-planets-grid">
    `;

        // Сортируем планеты в определенном порядке
        const planetOrder = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
        let hasPlanets = false;

        planetOrder.forEach(key => {
            const planet = planets[key];
            if (!planet) return;

            hasPlanets = true;

            // Безопасно получаем значения с проверками
            const planetName = planet.name || key;
            const planetSign = planet.sign || 'Неизвестно';
            const planetDegree = planet.degreeInSign || (planet.longitude ? (planet.longitude % 30).toFixed(1) : '?');
            const planetMeaning = planet.planetMeaning || 'Значение планеты будет добавлено позже.';
            const signDescription = planet.signDescription || 'Описание знака будет добавлено позже.';

            html += `
            <div class="enriched-planet-card">
                <div class="enriched-planet-header">
                    <span class="enriched-planet-symbol">${getPlanetSymbol(key)}</span>
                    <span class="enriched-planet-name">${planetName}</span>
                </div>
                <div class="enriched-planet-position">
                    <span class="enriched-planet-sign">${planetSign}</span>
                    <span class="enriched-planet-degree">${planetDegree}°</span>
                </div>
                <div class="enriched-planet-meaning">
                    <strong>Значение:</strong> ${planetMeaning}
                </div>
                <div class="enriched-planet-sign-desc">
                    <strong>В знаке ${planetSign}:</strong> ${signDescription}
                </div>
            </div>
        `;
        });

        html += `</div>`;

        if (hasPlanets) {
            container.innerHTML = html;
        } else {
            container.style.display = 'none';
        }
    }

    /**
     * Отображает расширенную информацию о домах
     */
    function displayEnrichedHousesInfo(houses) {
        if (!houses || !Array.isArray(houses) || houses.length === 0) {
            console.warn('Нет данных о домах для отображения');
            return;
        }

        // Создаем или находим контейнер
        let container = document.getElementById('enrichedHousesInfo');
        if (!container) {
            container = document.createElement('div');
            container.id = 'enrichedHousesInfo';
            container.className = 'enriched-houses-section';

            const resultCard = document.querySelector('.result-card');
            if (resultCard) {
                const planetsSection = document.getElementById('enrichedPlanetsInfo');
                if (planetsSection) {
                    planetsSection.parentNode.insertBefore(container, planetsSection.nextSibling);
                } else {
                    const chartWrapper = document.querySelector('.natal-chart-wrapper');
                    if (chartWrapper) {
                        chartWrapper.parentNode.insertBefore(container, chartWrapper.nextSibling);
                    } else {
                        resultCard.appendChild(container);
                    }
                }
            } else {
                return;
            }
        }

        let html = `
        <h3>🏠 ЗНАЧЕНИЕ ДОМОВ</h3>
        <div class="enriched-houses-grid">
    `;

        // Сортируем дома по номеру
        const sortedHouses = [...houses].sort((a, b) => (a.number || 0) - (b.number || 0));

        sortedHouses.forEach(house => {
            if (!house) return;

            const houseNumber = house.number || '?';
            const houseSign = house.sign || getSignFromLongitude(house.cusp || 0);
            const houseDesc = house.houseDescription || 'Описание дома будет добавлено позже.';
            const signDesc = house.signDescription || 'Описание знака будет добавлено позже.';

            const planetsList = Array.isArray(house.planets) && house.planets.length > 0
                ? house.planets.join(', ')
                : 'нет планет';

            html += `
            <div class="enriched-house-card">
                <div class="enriched-house-header">
                    <span class="enriched-house-number">${houseNumber} дом</span>
                    <span class="enriched-house-cusp">Куспид в ${houseSign}</span>
                </div>
                <div class="enriched-house-desc">
                    <strong>Значение:</strong> ${houseDesc}
                </div>
                <div class="enriched-house-sign-desc">
                    <strong>Куспид в ${houseSign}:</strong> ${signDesc}
                </div>
                <div class="enriched-house-planets">
                    <strong>Планеты:</strong> ${planetsList}
                </div>
            </div>
        `;
        });

        html += `</div>`;
        container.innerHTML = html;
    }

    /**
     * Отображает расширенную информацию об аспектах
     */
    function displayEnrichedAspectsInfo(aspects) {
        if (!aspects || !Array.isArray(aspects) || aspects.length === 0) {
            console.warn('Нет данных об аспектах для отображения');
            return;
        }

        // Создаем или находим контейнер
        let container = document.getElementById('enrichedAspectsInfo');
        if (!container) {
            container = document.createElement('div');
            container.id = 'enrichedAspectsInfo';
            container.className = 'enriched-aspects-section';

            const resultCard = document.querySelector('.result-card');
            if (resultCard) {
                const housesSection = document.getElementById('enrichedHousesInfo');
                if (housesSection) {
                    housesSection.parentNode.insertBefore(container, housesSection.nextSibling);
                } else {
                    const planetsSection = document.getElementById('enrichedPlanetsInfo');
                    if (planetsSection) {
                        planetsSection.parentNode.insertBefore(container, planetsSection.nextSibling);
                    } else {
                        const chartWrapper = document.querySelector('.natal-chart-wrapper');
                        if (chartWrapper) {
                            chartWrapper.parentNode.insertBefore(container, chartWrapper.nextSibling);
                        } else {
                            resultCard.appendChild(container);
                        }
                    }
                }
            } else {
                return;
            }
        }

        let html = `
        <h3>⚡ КЛЮЧЕВЫЕ АСПЕКТЫ</h3>
        <div class="enriched-aspects-grid">
    `;

        aspects.forEach(aspect => {
            if (!aspect) return;

            // Безопасно получаем значения
            const type = aspect.type || 'unknown';
            const name = aspect.name || aspect.type || 'Аспект';
            const orb = aspect.orb || '?';
            const planet1 = aspect.planet1 || 'Планета 1';
            const planet2 = aspect.planet2 || 'Планета 2';
            const description = aspect.description || 'Описание аспекта будет добавлено позже.';

            // Определяем цвет для типа аспекта
            let aspectColor = '#c9a54b';
            switch(type) {
                case 'conjunction': aspectColor = '#ff4d4d'; break;
                case 'opposition': aspectColor = '#4d4dff'; break;
                case 'trine': aspectColor = '#4dff4d'; break;
                case 'square': aspectColor = '#ff4dff'; break;
                case 'sextile': aspectColor = '#ffff4d'; break;
            }

            html += `
            <div class="enriched-aspect-card" style="border-left-color: ${aspectColor}">
                <div class="enriched-aspect-header">
                    <span class="enriched-aspect-name">${name}</span>
                    <span class="enriched-aspect-orb">Орб: ${orb}°</span>
                </div>
                <div class="enriched-aspect-planets">
                    <span class="enriched-aspect-planet">${planet1}</span>
                    <span class="enriched-aspect-symbol">↔</span>
                    <span class="enriched-aspect-planet">${planet2}</span>
                </div>
                <div class="enriched-aspect-desc">
                    ${description}
                </div>
            </div>
        `;
        });

        html += `</div>`;
        container.innerHTML = html;
    }

    /**
     * Получает символ планеты по ключу
     */
    function getPlanetSymbol(key) {
        const symbols = {
            sun: '☉', moon: '☽', mercury: '☿', venus: '♀',
            mars: '♂', jupiter: '♃', saturn: '♄',
            uranus: '♅', neptune: '♆', pluto: '♇'
        };
        return symbols[key] || '●';
    }

    // ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================

    function getSignFromLongitude(long) {
        const signs = ['Овен', 'Телец', 'Близнецы', 'Рак', 'Лев', 'Дева',
            'Весы', 'Скорпион', 'Стрелец', 'Козерог', 'Водолей', 'Рыбы'];
        const index = Math.floor(long / 30) % 12;
        return signs[index];
    }

    function transformPlanetsData(serverPlanets) {
        const planets = {};
        const signNames = ['Овен', 'Телец', 'Близнецы', 'Рак', 'Лев', 'Дева',
            'Весы', 'Скорпион', 'Стрелец', 'Козерог', 'Водолей', 'Рыбы'];

        const symbols = {
            sun: '☉', moon: '☽', mercury: '☿', venus: '♀',
            mars: '♂', jupiter: '♃', saturn: '♄',
            uranus: '♅', neptune: '♆', pluto: '♇'
        };

        const nameMap = {
            sun: 'Солнце', moon: 'Луна', mercury: 'Меркурий',
            venus: 'Венера', mars: 'Марс', jupiter: 'Юпитер', saturn: 'Сатурн',
            uranus: 'Уран', neptune: 'Нептун', pluto: 'Плутон'
        };

        Object.entries(serverPlanets).forEach(([key, data]) => {
            if (!data || data.longitude === undefined) return;

            const signIndex = Math.floor(data.longitude / 30) % 12;
            planets[key] = {
                name: nameMap[key] || key,
                symbol: symbols[key] || '●',
                longitude: data.longitude,
                sign: signNames[signIndex],
                house: Math.floor(data.longitude / 30) + 1
            };
        });

        return planets;
    }

    function generateAspects(planets) {
        const aspects = [];
        const planetList = Object.values(planets);

        for (let i = 0; i < planetList.length; i++) {
            for (let j = i + 1; j < planetList.length; j++) {
                const diff = Math.abs(planetList[i].longitude - planetList[j].longitude);
                const orb = Math.min(diff, 360 - diff);

                let type = null;
                let description = '';

                if (orb < 10) {
                    type = 'conjunction';
                    description = `${planetList[i].name} в соединении с ${planetList[j].name}`;
                } else if (Math.abs(orb - 180) < 10) {
                    type = 'opposition';
                    description = `${planetList[i].name} в оппозиции с ${planetList[j].name}`;
                } else if (Math.abs(orb - 120) < 8) {
                    type = 'trine';
                    description = `${planetList[i].name} в трине с ${planetList[j].name}`;
                } else if (Math.abs(orb - 90) < 8) {
                    type = 'square';
                    description = `${planetList[i].name} в квадратуре с ${planetList[j].name}`;
                } else if (Math.abs(orb - 60) < 6) {
                    type = 'sextile';
                    description = `${planetList[i].name} в секстиле с ${planetList[j].name}`;
                }

                if (type) {
                    aspects.push({
                        planet1: planetList[i].name,
                        planet2: planetList[j].name,
                        type: type,
                        orb: orb.toFixed(1),
                        description: description
                    });
                }
            }
        }

        return aspects;
    }

    function displayLegend(planets) {
        const legend = document.getElementById('planetLegend');
        if (!legend) return;
        legend.innerHTML = '';

        Object.values(planets).forEach(planet => {
            if (!planet || !planet.name) return;

            const item = document.createElement('div');
            item.className = 'legend-item';
            item.innerHTML = `
                <span class="planet-symbol">${planet.symbol || '●'}</span>
                <span class="planet-name">${planet.name}</span>
                <span class="planet-sign">${planet.sign || 'Неизвестно'}</span>
            `;
            legend.appendChild(item);
        });
    }

    function displayPlanetPositions(planets) {
        const grid = document.getElementById('planetPositions');
        if (!grid) return;
        grid.innerHTML = '';

        Object.values(planets).forEach(planet => {
            if (!planet || !planet.name) return;

            const item = document.createElement('div');
            item.className = 'position-item';

            const degree = (planet.longitude % 30).toFixed(1);
            const signIndex = Math.floor(planet.longitude / 30);
            const signSymbol = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'][signIndex] || '';

            item.innerHTML = `
                <div class="position-header">
                    <span class="position-symbol">${planet.symbol || '●'}</span>
                    <span class="position-name">${planet.name}</span>
                </div>
                <div class="position-detail">
                    <span>Знак:</span>
                    <span class="position-value">${planet.sign || 'Неизвестно'} ${signSymbol}</span>
                </div>
                <div class="position-detail">
                    <span>Градус:</span>
                    <span class="position-value">${degree}°</span>
                </div>
                <div class="position-detail">
                    <span>Дом:</span>
                    <span class="position-value">${planet.house || '?'}</span>
                </div>
            `;

            grid.appendChild(item);
        });
    }

    function displayAspects(aspects) {
        const list = document.getElementById('aspectsList');
        if (!list) return;
        list.innerHTML = '';

        if (!aspects || aspects.length === 0) {
            list.innerHTML = '<p>Нет значимых аспектов</p>';
            return;
        }

        aspects.forEach(aspect => {
            const item = document.createElement('div');
            item.className = `aspect-item ${aspect.type}`;
            item.textContent = aspect.description;
            list.appendChild(item);
        });
    }

    if (newBtn) {
        newBtn.addEventListener('click', function() {
            if (resultSection) {
                resultSection.style.display = 'none';
            }
            if (form) {
                form.reset();
                // Восстанавливаем значение времени по умолчанию
                const timeInput = document.getElementById('birthTime');
                if (timeInput) timeInput.value = '12:00';
                // Восстанавливаем текущую дату
                if (dateMask) {
                    const today = new Date();
                    dateMask.value = today;
                }
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    function showNotification(message, type) {
        console.log(`[${type}] ${message}`);
        // Можно заменить на более красивую нотификацию
        alert(`${type === 'error' ? '❌' : type === 'success' ? '✅' : '🔮'} ${message}`);
    }

    // ==================== ОСНОВНАЯ ИНТЕРПРЕТАЦИЯ ====================

    function generateInterpretation(planets, houses, ascendant, aspects) {
        const ascSign = getSignFromLongitude(ascendant);
        const ascDegree = (ascendant % 30).toFixed(1);

        const sunSign = planets.sun?.sign || 'Неизвестно';
        const sunHouse = planets.sun?.house || 1;
        const sunLong = planets.sun?.longitude || 0;
        const sunDegree = (sunLong % 30).toFixed(1);

        const moonSign = planets.moon?.sign || 'Неизвестно';
        const moonHouse = planets.moon?.house || 1;
        const moonLong = planets.moon?.longitude || 0;
        const moonDegree = (moonLong % 30).toFixed(1);

        // Получаем управителя асцендента
        const ascendantRuler = getRulerOfSign(ascSign);

        // Определяем стихии
        const sunElement = getElement(sunSign);
        const moonElement = getElement(moonSign);
        const ascElement = getElement(ascSign);

        // Анализируем баланс стихий
        const elementBalance = analyzeElementBalance(planets);

        // Анализируем распределение по домам
        const houseAnalysis = analyzeHouseDistribution(planets);

        return `
        <div class="interpretation-container">
            <!-- ВСТУПЛЕНИЕ -->
            <div class="interpretation-section intro-section">
                <h4>🌟 ВАШ АСТРОЛОГИЧЕСКИЙ ПОРТРЕТ</h4>
                <p class="section-content">
                    В момент вашего рождения, ${getFormattedDate()} в ${getFormattedTime()}, небесные тела выстроились в уникальную конфигурацию, которая сформировала ваш характер, таланты и жизненный путь. Анализ вашей натальной карты позволяет заглянуть в самые глубокие слои вашей личности и понять, какие энергии определяют вашу судьбу.
                </p>
                <p class="section-content">
                    В этом астрологическом портрете мы рассмотрим положение планет в знаках и домах, их взаимодействие друг с другом, а также ключевые точки вашей карты, которые оказывают наибольшее влияние на вашу жизнь.
                </p>
            </div>
            
            <!-- РАЗДЕЛ 1: АСЦЕНДЕНТ -->
            <div class="interpretation-section ascendant-section">
                <h4>🌅 АСЦЕНДЕНТ (Восходящий знак) — ${ascSign} ${ascDegree}°</h4>
                <p class="section-content">
                    <strong>${getAscendantDescription(ascSign)}</strong>
                </p>
                <p class="section-detail">
                    ${getAscendantDetailed(ascSign)} Асцендент — это ваша внешняя маска, то, как вы проявляетесь в мире, как вас воспринимают окружающие при первой встрече. Он определяет вашу внешность, манеру поведения и первый импульс в любой ситуации.
                </p>
                <p class="section-detail">
                    Ваш асцендент находится в знаке ${ascSign}, что делает вас ${getAscendantNature(ascSign)}. Управитель вашего асцендента — ${ascendantRuler}, который играет особую роль в вашей жизни, указывая на сферу, где вы можете проявить себя наиболее ярко.
                </p>
                <p class="section-detail">
                    <em>Рекомендация:</em> ${getAscendantAdvice(ascSign)}
                </p>
            </div>
            
            <!-- РАЗДЕЛ 2: СОЛНЦЕ -->
            <div class="interpretation-section sun-section">
                <h4>☀️ СОЛНЦЕ (Сущность, эго, жизненная сила) — ${sunSign} ${sunDegree}° в ${sunHouse} доме</h4>
                <p class="section-content">
                    <strong>${getSunDescription(sunSign)}</strong>
                </p>
                <p class="section-detail">
                    Солнце — это ваше истинное "Я", ваша жизненная цель и источник энергии. Оно показывает, кем вы становитесь, когда раскрываете свой потенциал, и что приносит вам наибольшее удовлетворение.
                </p>
                <p class="section-detail">
                    ${getSunInHouseDescription(sunSign, sunHouse)} В ${sunHouse} доме Солнце проявляется особенно ярко, указывая на сферу жизни, где вы можете реализовать свои лидерские качества и получить признание.
                </p>
                <p class="section-detail">
                    Ваше Солнце в стихии ${getElement(sunSign)} дает вам ${getElementQuality(sunSign)}. Это означает, что в достижении целей вы полагаетесь на ${getElementApproach(sunSign)}.
                </p>
                <p class="section-detail">
                    <em>Совет для самореализации:</em> ${getSunAdvice(sunSign, sunHouse)}
                </p>
            </div>
            
            <!-- РАЗДЕЛ 3: ЛУНА -->
            <div class="interpretation-section moon-section">
                <h4>🌙 ЛУНА (Душа, эмоции, подсознание) — ${moonSign} ${moonDegree}° в ${moonHouse} доме</h4>
                <p class="section-content">
                    <strong>${getMoonDescription(moonSign)}</strong>
                </p>
                <p class="section-detail">
                    Луна отражает вашу эмоциональную природу, то, как вы реагируете на мир, что дает вам чувство безопасности и комфорта. Это ваша душа, ваши привычки и инстинкты.
                </p>
                <p class="section-detail">
                    ${getMoonInHouseDescription(moonSign, moonHouse)} Положение Луны в ${moonHouse} доме показывает, где вы ищете эмоциональную защиту и в какой сфере жизни ваши чувства проявляются наиболее интенсивно.
                </p>
                <p class="section-detail">
                    Ваша Луна в стихии ${getElement(moonSign)} делает ваши эмоции ${getEmotionalQuality(moonSign)}. В стрессовых ситуациях вы склонны ${getEmotionalReaction(moonSign)}.
                </p>
                <p class="section-detail">
                    <em>Как обрести эмоциональный комфорт:</em> ${getMoonAdvice(moonSign, moonHouse)}
                </p>
            </div>
            
            <!-- РАЗДЕЛ 4: БАЛАНС СТИХИЙ -->
            <div class="interpretation-section elements-section">
                <h4>🔥💧🌍💨 БАЛАНС СТИХИЙ В ВАШЕЙ КАРТЕ</h4>
                <p class="section-detail">
                    ${elementBalance}
                </p>
                <div class="elements-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 20px 0;">
                    <div style="text-align: center; padding: 10px; background: rgba(255, 77, 77, 0.1); border-radius: 8px;">
                        <span style="font-size: 24px;">🔥</span>
                        <div><strong>Огонь</strong></div>
                        <div>${countElement('fire', planets)}%</div>
                    </div>
                    <div style="text-align: center; padding: 10px; background: rgba(77, 255, 77, 0.1); border-radius: 8px;">
                        <span style="font-size: 24px;">🌍</span>
                        <div><strong>Земля</strong></div>
                        <div>${countElement('earth', planets)}%</div>
                    </div>
                    <div style="text-align: center; padding: 10px; background: rgba(77, 77, 255, 0.1); border-radius: 8px;">
                        <span style="font-size: 24px;">💨</span>
                        <div><strong>Воздух</strong></div>
                        <div>${countElement('air', planets)}%</div>
                    </div>
                    <div style="text-align: center; padding: 10px; background: rgba(77, 255, 255, 0.1); border-radius: 8px;">
                        <span style="font-size: 24px;">💧</span>
                        <div><strong>Вода</strong></div>
                        <div>${countElement('water', planets)}%</div>
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
                    ${generateDetailedPlanetsInHousesInterpretation(planets)}
                </div>
                <p class="section-detail" style="margin-top: 20px;">
                    ${houseAnalysis}
                </p>
            </div>
            
            <!-- РАЗДЕЛ 6: КЛЮЧЕВЫЕ АСПЕКТЫ -->
            <div class="interpretation-section aspects-section">
                <h4>⚡ ВЗАИМОДЕЙСТВИЕ ПЛАНЕТ: АСПЕКТЫ</h4>
                <p class="section-detail">
                    Аспекты — это угловые расстояния между планетами, показывающие, как различные части вашей личности взаимодействуют друг с другом. Одни аспекты создают гармонию и таланты, другие — напряжение и вызовы, которые становятся точками роста.
                </p>
                <div class="aspects-interpretation">
                    ${generateDetailedAspectsInterpretation(aspects, planets)}
                </div>
            </div>
            
            <!-- РАЗДЕЛ 7: ОБЩИЙ ПОРТРЕТ -->
            <div class="interpretation-section summary-section">
                <h4>🌟 СИНТЕЗ: ВАША УНИКАЛЬНАЯ ЛИЧНОСТЬ</h4>
                <p class="summary-text">
                    ${generateDetailedOverallPortrait(ascSign, sunSign, moonSign, planets, aspects)}
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

// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ

    function getFormattedDate() {
        const dateInput = document.getElementById('birthDate')?.value;
        return dateInput || 'указанную дату';
    }

    function getFormattedTime() {
        const timeInput = document.getElementById('birthTime')?.value;
        return timeInput || 'указанное время';
    }

    function getRulerOfSign(sign) {
        const rulers = {
            'Овен': 'Марс', 'Телец': 'Венера', 'Близнецы': 'Меркурий',
            'Рак': 'Луна', 'Лев': 'Солнце', 'Дева': 'Меркурий',
            'Весы': 'Венера', 'Скорпион': 'Плутон', 'Стрелец': 'Юпитер',
            'Козерог': 'Сатурн', 'Водолей': 'Уран', 'Рыбы': 'Нептун'
        };
        return rulers[sign] || '—';
    }

    function getElement(sign) {
        const elements = {
            'Овен': 'Огонь', 'Лев': 'Огонь', 'Стрелец': 'Огонь',
            'Телец': 'Земля', 'Дева': 'Земля', 'Козерог': 'Земля',
            'Близнецы': 'Воздух', 'Весы': 'Воздух', 'Водолей': 'Воздух',
            'Рак': 'Вода', 'Скорпион': 'Вода', 'Рыбы': 'Вода'
        };
        return elements[sign] || '—';
    }

    function getAscendantNature(sign) {
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

    function getAscendantAdvice(sign) {
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

    function getElementQuality(sign) {
        const qualities = {
            'Овен': 'страстность и инициативность', 'Лев': 'щедрость и креативность', 'Стрелец': 'оптимизм и энтузиазм',
            'Телец': 'упорство и практичность', 'Дева': 'аналитичность и усердие', 'Козерог': 'дисциплину и целеустремленность',
            'Близнецы': 'гибкость и коммуникабельность', 'Весы': 'дипломатичность и чувство гармонии', 'Водолей': 'оригинальность и независимость',
            'Рак': 'эмоциональность и заботливость', 'Скорпион': 'страстность и глубину', 'Рыбы': 'интуицию и сострадание'
        };
        return qualities[sign] || 'уникальные качества';
    }

    function getElementApproach(sign) {
        const approaches = {
            'Овен': 'интуицию и спонтанность', 'Лев': 'творчество и самовыражение', 'Стрелец': 'философский подход и поиск смысла',
            'Телец': 'терпение и настойчивость', 'Дева': 'анализ и планирование', 'Козерог': 'дисциплину и стратегию',
            'Близнецы': 'общение и сбор информации', 'Весы': 'дипломатию и поиск компромиссов', 'Водолей': 'инновации и нестандартные решения',
            'Рак': 'эмпатию и интуитивное понимание', 'Скорпион': 'глубокое исследование и трансформацию', 'Рыбы': 'интуицию и творческое воображение'
        };
        return approaches[sign] || 'свой уникальный подход';
    }

    function getSunAdvice(sign, house) {
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

    function getEmotionalQuality(sign) {
        const qualities = {
            'Овен': 'импульсивными и страстными', 'Лев': 'яркими и драматичными', 'Стрелец': 'оптимистичными и открытыми',
            'Телец': 'стабильными и глубокими', 'Дева': 'аналитичными и тревожными', 'Козерог': 'сдержанными и ответственными',
            'Близнецы': 'изменчивыми и любопытными', 'Весы': 'гармоничными и дипломатичными', 'Водолей': 'необычными и отстраненными',
            'Рак': 'глубокими и чувствительными', 'Скорпион': 'интенсивными и страстными', 'Рыбы': 'безграничными и сострадательными'
        };
        return qualities[sign] || 'уникальными';
    }

    function getEmotionalReaction(sign) {
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

    function getMoonAdvice(sign, house) {
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

    function countElement(element, planets) {
        const elementMap = {
            'fire': ['Овен', 'Лев', 'Стрелец'],
            'earth': ['Телец', 'Дева', 'Козерог'],
            'air': ['Близнецы', 'Весы', 'Водолей'],
            'water': ['Рак', 'Скорпион', 'Рыбы']
        };

        let count = 0;
        let total = 0;

        Object.values(planets).forEach(planet => {
            if (planet && planet.sign) {
                total++;
                if (elementMap[element].includes(planet.sign)) count++;
            }
        });

        return total > 0 ? Math.round((count / total) * 100) : 0;
    }

    function analyzeElementBalance(planets) {
        const fire = countElement('fire', planets);
        const earth = countElement('earth', planets);
        const air = countElement('air', planets);
        const water = countElement('water', planets);

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

    function analyzeHouseDistribution(planets) {
        const houseCount = {};
        Object.values(planets).forEach(planet => {
            if (planet && planet.house) {
                houseCount[planet.house] = (houseCount[planet.house] || 0) + 1;
            }
        });

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

        return `Наибольшее скопление планет наблюдается в ${maxHouse} доме (${houseMeanings[maxHouse] || '—'}). Это указывает на то, что сфера жизни, связанная с этим домом, будет для вас наиболее важной и насыщенной событиями. Здесь вы можете реализовать свой потенциал и получить наибольший опыт.`;
    }

    function generateDetailedPlanetsInHousesInterpretation(planets) {
        let html = '';
        const planetOrder = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];

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

        const planetNames = {
            sun: 'Солнце', moon: 'Луна', mercury: 'Меркурий', venus: 'Венера',
            mars: 'Марс', jupiter: 'Юпитер', saturn: 'Сатурн',
            uranus: 'Уран', neptune: 'Нептун', pluto: 'Плутон'
        };

        planetOrder.forEach(key => {
            const planet = planets[key];
            if (planet && planet.symbol && planet.house && planet.sign) {
                const houseNum = planet.house;
                const houseDesc = houseMeanings[houseNum] || 'жизни';
                const planetMeaning = planetMeanings[key] || 'вашу жизнь';
                const planetName = planetNames[key] || key;

                html += `
                <div class="planet-house-item" style="margin-bottom: 15px; padding: 15px; background: rgba(0,0,0,0.2); border-radius: 8px; border-left: 3px solid #c9a54b;">
                    <div style="display: flex; align-items: center; margin-bottom: 8px;">
                        <span class="planet-symbol" style="font-size: 1.5rem; color: #c9a54b; min-width: 40px;">${planet.symbol}</span>
                        <span style="font-weight: 600; color: #fff;">${planetName}</span>
                        <span style="margin-left: 10px; color: #c9a54b;">в ${houseNum} доме</span>
                    </div>
                    <div style="color: #a0a0b0; line-height: 1.6;">
                        ${planetName} в ${houseNum} доме (${houseDesc}) влияет на ${planetMeaning}. Это означает, что в сфере ${houseDesc} вы проявляете качества знака ${planet.sign} — ${getSignShortDescription(planet.sign)}. 
                        ${getHousePlanetAdvice(key, houseNum)}
                    </div>
                </div>
            `;
            }
        });

        return html;
    }

    function getSignShortDescription(sign) {
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

    function getHousePlanetAdvice(planet, house) {
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

    function generateDetailedAspectsInterpretation(aspects, planets) {
        if (!aspects || aspects.length === 0) {
            return '<p>Нет значимых аспектов в вашей карте.</p>';
        }

        let html = '';
        const sortedAspects = aspects.slice(0, 8); // Берем 8 наиболее важных

        sortedAspects.forEach(aspect => {
            const typeDesc = {
                conjunction: 'соединение — энергии планет сливаются, создавая мощный фокус. Это ваша ключевая точка силы, где таланты проявляются наиболее ярко.',
                opposition: 'оппозиция — напряжение и противостояние двух начал. Это вызов, требующий осознания и поиска баланса.',
                trine: 'трин — гармоничный поток энергии. Природный талант, дающийся без усилий.',
                square: 'квадратура — конфликт и вызов, движущая сила развития. Преодолевая препятствия, вы растете.',
                sextile: 'секстиль — возможность и потенциал. Талант, который нужно развивать осознанно.'
            };

            const planet1Meaning = getPlanetMeaning(aspect.planet1);
            const planet2Meaning = getPlanetMeaning(aspect.planet2);

            html += `
            <div class="aspect-item-detailed ${aspect.type}" style="margin-bottom: 20px; padding: 15px; background: rgba(0,0,0,0.2); border-radius: 8px; border-left: 4px solid ${getAspectColor(aspect.type)};">
                <div style="display: flex; align-items: center; margin-bottom: 8px;">
                    <span style="font-weight: 600; color: #fff;">${aspect.planet1}</span>
                    <span style="margin: 0 10px; color: #c9a54b;">↔</span>
                    <span style="font-weight: 600; color: #fff;">${aspect.planet2}</span>
                    <span style="margin-left: 10px; color: #c9a54b;">${aspect.name} (орб: ${aspect.orb}°)</span>
                </div>
                <p style="color: #a0a0b0; line-height: 1.6; margin-bottom: 8px;">
                    <strong>${aspect.planet1}</strong> (${planet1Meaning}) и <strong>${aspect.planet2}</strong> (${planet2Meaning}) образуют ${typeDesc[aspect.type] || 'аспект'}.
                </p>
                <p style="color: #a0a0b0; line-height: 1.6; font-style: italic;">
                    ${aspect.description || 'Этот аспект создает уникальную динамику в вашей личности.'}
                </p>
            </div>
        `;
        });

        return html;
    }

    function getPlanetMeaning(planet) {
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

    function getAspectColor(type) {
        const colors = {
            'conjunction': '#ff4d4d',
            'opposition': '#4d4dff',
            'trine': '#4dff4d',
            'square': '#ff4dff',
            'sextile': '#ffff4d'
        };
        return colors[type] || '#c9a54b';
    }

    function generateDetailedOverallPortrait(ascSign, sunSign, moonSign, planets, aspects) {
        const elements = {
            'Овен': 'огонь', 'Лев': 'огонь', 'Стрелец': 'огонь',
            'Телец': 'земля', 'Дева': 'земля', 'Козерог': 'земля',
            'Близнецы': 'воздух', 'Весы': 'воздух', 'Водолей': 'воздух',
            'Рак': 'вода', 'Скорпион': 'вода', 'Рыбы': 'вода'
        };

        const ascElement = elements[ascSign] || '—';
        const sunElement = elements[sunSign] || '—';
        const moonElement = elements[moonSign] || '—';

        let portrait = `Вы — человек, в котором сочетаются `;

        if (ascElement === sunElement && sunElement === moonElement) {
            portrait += `трижды усиленная стихия ${ascElement}. Это дает мощную концентрацию энергии и целостность натуры. Вы последовательны в своих проявлениях — то, что вы есть внутри, то, как вы чувствуете и как проявляетесь внешне, находится в гармонии. Однако остерегайтесь стать слишком однобоким — иногда полезно выходить за рамки своей стихии.`;
        } else if (ascElement === sunElement) {
            portrait += `стихия ${ascElement} в личности и сущности, но эмоции на волнах ${moonElement}. Вы целостны в действиях и самовыражении, но чувствуете по-другому. Это может создавать внутреннее напряжение: вы можете действовать уверенно, но внутри испытывать совсем иные эмоции.`;
        } else if (sunElement === moonElement) {
            portrait += `гармонию сущности и эмоций в стихии ${sunElement}, но внешне проявляете себя как ${ascElement}. Вы чувствуете и осознаете себя в одном ключе, но внешняя маска часто не соответствует внутреннему содержанию. Людям может быть сложно понять вас сразу.`;
        } else {
            portrait += `разные стихии: внешность ${ascElement}, сущность ${sunElement}, эмоции ${moonElement}. Вы многогранны и сложны. Это дает вам уникальную способность адаптироваться к разным ситуациям и понимать разных людей, но может создавать внутренние конфликты между тем, кто вы есть, кем хотите быть и как вас воспринимают.`;
        }

        // Добавляем анализ аспектов
        const majorAspects = aspects?.length || 0;
        if (majorAspects > 5) {
            portrait += ` В вашей карте много аспектов, что указывает на насыщенную внутреннюю жизнь и множество талантов. Вы сложная и многогранная личность, постоянно находящаяся в процессе развития.`;
        } else if (majorAspects < 3) {
            portrait += ` В вашей карте немного аспектов, что говорит о целостности и простоте вашей натуры. Вы не склонны к внутренним конфликтам и действуете прямо.`;
        }

        portrait += ` Ваш асцендент в ${ascSign} говорит о том, что ${getAscendantDescription(ascSign).toLowerCase()}`;
        portrait += `. Ваша сущность (Солнце) в ${sunSign}: ${getSunDescription(sunSign).toLowerCase()}`;
        portrait += `. Ваши эмоции (Луна) в ${moonSign}: ${getMoonDescription(moonSign).toLowerCase()}`;

        return portrait;
    }

    // ==================== ФУНКЦИИ ДЛЯ ОСНОВНОЙ ИНТЕРПРЕТАЦИИ ====================

    function getSunInHouseDescription(sign, house) {
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

    function getMoonInHouseDescription(sign, house) {
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

    function getAscendantDescription(sign) {
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

    function getAscendantDetailed(sign) {
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

    function getSunDescription(sign) {
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

    function getMoonDescription(sign) {
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

    function getPlanetInHouseDescription(planet, sign, house) {
        const planetNames = {
            sun: 'Солнце', moon: 'Луна', mercury: 'Меркурий', venus: 'Венера',
            mars: 'Марс', jupiter: 'Юпитер', saturn: 'Сатурн',
            uranus: 'Уран', neptune: 'Нептун', pluto: 'Плутон'
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

        if (!planetNames[planet]) {
            return `${planet} в ${house} доме (${houseMeanings[house]}) оказывает влияние на вашу жизнь.`;
        }

        return `${planetNames[planet]} в ${house} доме (${houseMeanings[house]}) влияет на ${planetMeanings[planet] || 'вашу жизнь'}.`;
    }

    function generatePlanetsInHousesInterpretation(planets) {
        let html = '<div class="planets-houses">';

        Object.entries(planets).forEach(([key, planet]) => {
            if (planet && planet.symbol && planet.house && planet.sign) {
                const description = getPlanetInHouseDescription(key, planet.sign, planet.house);
                html += `
                    <div class="planet-house-item">
                        <span class="planet-symbol">${planet.symbol}</span>
                        <span class="planet-desc">${description}</span>
                    </div>
                `;
            }
        });

        html += '</div>';
        return html;
    }

    function generateAspectsInterpretation(aspects, planets) {
        if (!aspects || aspects.length === 0) {
            return '<p>Нет значимых аспектов в вашей карте.</p>';
        }

        let html = '<div class="aspects-interpretation">';

        aspects.slice(0, 5).forEach(aspect => {
            const typeDesc = {
                conjunction: 'соединение — энергии сливаются, усиливая друг друга',
                opposition: 'оппозиция — напряжение, требующее баланса',
                trine: 'трин — гармоничный поток энергии, талант',
                square: 'квадратура — вызов, конфликт, развитие',
                sextile: 'секстиль — возможность, потенциал'
            };

            html += `
                <div class="aspect-item-detailed ${aspect.type}">
                    <strong>${aspect.planet1} - ${aspect.planet2}</strong>
                    <p>${typeDesc[aspect.type]}</p>
                    <small>Орб: ${aspect.orb}°</small>
                </div>
            `;
        });

        html += '</div>';
        return html;
    }

    function generateHousesInterpretation(houses, planets) {
        const houseRulers = {
            1: 'Марс', 2: 'Венера', 3: 'Меркурий', 4: 'Луна',
            5: 'Солнце', 6: 'Меркурий', 7: 'Венера', 8: 'Плутон',
            9: 'Юпитер', 10: 'Сатурн', 11: 'Уран', 12: 'Нептун'
        };

        const houseKeywords = {
            1: 'Личность, внешность, начало',
            2: 'Финансы, ресурсы, самооценка',
            3: 'Общение, обучение, окружение',
            4: 'Дом, семья, корни',
            5: 'Творчество, любовь, дети',
            6: 'Работа, здоровье, служение',
            7: 'Партнерство, брак',
            8: 'Трансформация, кризисы, секс',
            9: 'Путешествия, философия, образование',
            10: 'Карьера, призвание, авторитет',
            11: 'Друзья, надежды, сообщества',
            12: 'Подсознание, тайны, уединение'
        };

        let html = '<div class="houses-interpretation">';

        for (let i = 1; i <= 12; i++) {
            const cusp = houses.find(h => h.number === i)?.cusp || 0;
            const cuspSign = getSignFromLongitude(cusp);
            const planetsInHouse = Object.values(planets).filter(p => p.house === i);

            html += `
                <div class="house-item">
                    <div class="house-header">
                        <span class="house-number">${i} дом</span>
                        <span class="house-sign">Куспид в ${cuspSign}</span>
                        <span class="house-ruler">Управитель: ${houseRulers[i]}</span>
                    </div>
                    <div class="house-keywords">${houseKeywords[i]}</div>
                    ${planetsInHouse.length > 0 ?
                `<div class="house-planets">
                            Планеты: ${planetsInHouse.map(p => `${p.name} (${p.symbol})`).join(', ')}
                        </div>` : ''}
                </div>
            `;
        }

        html += '</div>';
        return html;
    }

    function generateOverallPortrait(ascSign, sunSign, moonSign, planets) {
        const elements = {
            'Овен': 'огонь', 'Лев': 'огонь', 'Стрелец': 'огонь',
            'Телец': 'земля', 'Дева': 'земля', 'Козерог': 'земля',
            'Близнецы': 'воздух', 'Весы': 'воздух', 'Водолей': 'воздух',
            'Рак': 'вода', 'Скорпион': 'вода', 'Рыбы': 'вода'
        };

        const ascElement = elements[ascSign];
        const sunElement = elements[sunSign];
        const moonElement = elements[moonSign];

        let portrait = `Вы — человек, в котором сочетаются `;

        if (ascElement === sunElement && sunElement === moonElement) {
            portrait += `трижды усиленная стихия ${ascElement}. Это дает мощную концентрацию энергии, но может делать вас слишком однобоким.`;
        } else if (ascElement === sunElement) {
            portrait += `стихия ${ascElement} в личности и сущности, но эмоции на волнах ${moonElement}. Вы целостны в действиях, но чувствуете по-другому.`;
        } else if (sunElement === moonElement) {
            portrait += `гармонию сущности и эмоций в стихии ${sunElement}, но внешне проявляете себя как ${ascElement}.`;
        } else {
            portrait += `разные стихии: внешность ${ascElement}, сущность ${sunElement}, эмоции ${moonElement}. Вы многогранны и сложны.`;
        }

        portrait += ` Ваш асцендент в ${ascSign} говорит о том, что ${getAscendantDescription(ascSign).toLowerCase()}`;
        portrait += `. Ваша сущность (Солнце) в ${sunSign}: ${getSunDescription(sunSign).toLowerCase()}`;
        portrait += `. Ваши эмоции (Луна) в ${moonSign}: ${getMoonDescription(moonSign).toLowerCase()}`;

        return portrait;
    }

    // ==================== РАСШИРЕННЫЙ ОТЧЕТ ====================

    function generateExpandedReport(planets, ascendant) {
        const sunSign = planets.sun?.sign || 'Неизвестно';
        const moonSign = planets.moon?.sign || 'Неизвестно';
        const ascSign = getSignFromLongitude(ascendant || 0);

        return `
            <div class="expanded-report">
                <h3 class="report-section-title">🧠 ПСИХОЛОГИЧЕСКИЙ ПОРТРЕТ</h3>
                <div class="report-section">
                    ${generatePsychologicalProfile(sunSign, moonSign, ascSign)}
                </div>

                <h3 class="report-section-title">🎯 ВРОЖДЕННЫЕ ТАЛАНТЫ</h3>
                <div class="report-section">
                    ${generateTalents(sunSign, moonSign, planets)}
                </div>

                <h3 class="report-section-title">📊 ПИРАМИДА ПОТРЕБНОСТЕЙ</h3>
                <div class="report-section">
                    ${generateMaslowPyramid(planets)}
                </div>

                <h3 class="report-section-title">🔄 ЖИЗНЕННЫЕ СЦЕНАРИИ</h3>
                <div class="report-section">
                    ${generateLifeScenarios(planets)}
                </div>

                <h3 class="report-section-title">💼 БИЗНЕС И КАРЬЕРА</h3>
                <div class="report-section">
                    ${generateBusinessAdvice(planets)}
                </div>

                <h3 class="report-section-title">⚕️ ЗДОРОВЬЕ И РИСКИ</h3>
                <div class="report-section">
                    ${generateHealthRisks(planets)}
                </div>

                <h3 class="report-section-title">🌟 ЗАДАЧА ТЕКУЩЕГО ВОПЛОЩЕНИЯ</h3>
                <div class="report-section">
                    ${generateLifeTask(planets)}
                </div>
            </div>
        `;
    }

    function generatePsychologicalProfile(sunSign, moonSign, ascSign) {
        const profiles = {
            'Овен': 'Вы энергичны и импульсивны, склонны к лидерству и конкуренции. Ваш напор может пугать окружающих, но именно он помогает достигать целей.',
            'Телец': 'Вы стабильны и надежны, цените комфорт и материальную безопасность. Вам важно чувствовать твердую почву под ногами.',
            'Близнецы': 'Вы любознательны и общительны, легко адаптируетесь к новым условиям. Ваш ум требует постоянной интеллектуальной стимуляции.',
            'Рак': 'Вы эмоциональны и заботливы, глубоко привязаны к семье и дому. Ваша интуиция часто подсказывает верные решения.',
            'Лев': 'Вы щедры и великодушны, любите быть в центре внимания. Ваше творческое начало ищет признания и восхищения.',
            'Дева': 'Вы аналитичны и практичны, стремитесь к совершенству во всем. Ваша критичность может быть направлена как на себя, так и на других.',
            'Весы': 'Вы дипломатичны и обаятельны, ищете гармонию во всем. Вам важно находиться в красивой и уравновешенной среде.',
            'Скорпион': 'Вы страстны и проницательны, обладаете огромной внутренней силой. Ваша способность к трансформации помогает преодолевать любые кризисы.',
            'Стрелец': 'Вы оптимистичны и свободолюбивы, стремитесь к расширению горизонтов. Ваша философия жизни вдохновляет окружающих.',
            'Козерог': 'Вы амбициозны и дисциплинированы, способны достигать любых высот. Ваша ответственность и упорство вызывают уважение.',
            'Водолей': 'Вы независимы и оригинальны, мыслите нестандартно. Ваши идеи часто опережают время.',
            'Рыбы': 'Вы мечтательны и сострадательны, обладаете развитой интуицией. Ваша эмпатия позволяет чувствовать других людей на глубоком уровне.'
        };

        return `
            <p><strong>Солнце в ${sunSign}:</strong> ${profiles[sunSign] || 'Ваша солнечная природа уникальна.'}</p>
            <p><strong>Луна в ${moonSign}:</strong> ${getMoonDescription(moonSign)}</p>
            <p><strong>Асцендент в ${ascSign}:</strong> ${getAscendantDescription(ascSign)}</p>
            <p class="section-detail">${getAscendantDetailed(ascSign)}</p>
        `;
    }

    function generateTalents(sunSign, moonSign, planets) {
        const talents = [];

        const sunLong = planets.sun?.longitude || 0;
        const moonLong = planets.moon?.longitude || 0;
        const mercuryLong = planets.mercury?.longitude || 0;
        const venusLong = planets.venus?.longitude || 0;
        const marsLong = planets.mars?.longitude || 0;

        if (sunSign === 'Лев' || sunSign === 'Овен' || sunSign === 'Стрелец') {
            const fireStrength = Math.floor((sunLong % 30) / 3) + 1;
            talents.push(`🔥 Лидерские качества, умение вдохновлять и вести за собой (уровень ${fireStrength}/10)`);
        }
        if (sunSign === 'Телец' || sunSign === 'Дева' || sunSign === 'Козерог') {
            const earthStrength = Math.floor((sunLong % 30) / 3) + 1;
            talents.push(`🌱 Практичность, выносливость, умение создавать стабильность (уровень ${earthStrength}/10)`);
        }
        if (sunSign === 'Близнецы' || sunSign === 'Весы' || sunSign === 'Водолей') {
            const airStrength = Math.floor((sunLong % 30) / 3) + 1;
            talents.push(`💬 Коммуникабельность, дипломатичность, умение находить общий язык (уровень ${airStrength}/10)`);
        }
        if (sunSign === 'Рак' || sunSign === 'Скорпион' || sunSign === 'Рыбы') {
            const waterStrength = Math.floor((sunLong % 30) / 3) + 1;
            talents.push(`💧 Эмпатия, интуиция, глубокая эмоциональная чувствительность (уровень ${waterStrength}/10)`);
        }

        const sunMoonDiff = Math.abs(sunLong - moonLong);
        if (sunMoonDiff < 30 || Math.abs(sunMoonDiff - 360) < 30) {
            talents.push('✨ Гармоничное сочетание сознания и эмоций — вы чувствуете свои истинные желания');
        }

        if (mercuryLong && Math.abs(mercuryLong - sunLong) < 30) {
            talents.push('📚 Острый ум, способность ясно выражать мысли, талант к обучению');
        }

        if (venusLong && Math.abs(venusLong - sunLong) < 30) {
            talents.push('🎨 Художественный вкус, чувство прекрасного, творческие способности');
        }

        if (marsLong && Math.abs(marsLong - sunLong) < 30) {
            talents.push('⚔️ Решительность, смелость, способность преодолевать препятствия');
        }

        talents.push('🎯 Стратегическое мышление, способность видеть общую картину');
        talents.push('⚡ Выносливость, способность восстанавливаться из любых кризисов');

        const uniqueIndex = Math.floor(sunLong + moonLong) % 5;
        const uniqueTalents = [
            '🔮 Интуитивное понимание скрытых закономерностей',
            '🌈 Умение находить нестандартные решения',
            '🎭 Природная харизма и артистизм',
            '🧩 Способность соединять разрозненные идеи',
            '🌉 Талант быть связующим звеном между людьми'
        ];
        talents.push(uniqueTalents[uniqueIndex]);

        let html = '<ul class="talents-list">';
        talents.slice(0, 7).forEach(talent => {
            html += `<li>✨ ${talent}</li>`;
        });
        html += '</ul>';

        return html;
    }

    function generateMaslowPyramid(planets) {
        let physiology = 50;
        let safety = 50;
        let belonging = 50;
        let esteem = 50;
        let selfActualization = 50;

        if (planets.sun) {
            const sunInfluence = (planets.sun.longitude % 30) / 30 * 30;
            selfActualization += sunInfluence;
            esteem += sunInfluence / 2;
        }

        if (planets.moon) {
            const moonInfluence = (planets.moon.longitude % 30) / 30 * 25;
            belonging += moonInfluence;
            safety += moonInfluence / 2;
        }

        if (planets.venus) {
            const venusInfluence = (planets.venus.longitude % 30) / 30 * 20;
            belonging += venusInfluence;
            esteem += venusInfluence;
        }

        if (planets.mars) {
            const marsInfluence = (planets.mars.longitude % 30) / 30 * 25;
            esteem += marsInfluence;
            physiology += marsInfluence / 2;
        }

        if (planets.saturn) {
            const saturnInfluence = (planets.saturn.longitude % 30) / 30 * 30;
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

    function generateLifeScenarios(planets) {
        let family = 20;
        let info = 20;
        let social = 20;
        let creative = 20;
        let spiritual = 20;

        if (planets.moon) family += (planets.moon.longitude % 30) / 30 * 25;
        if (planets.venus) {
            family += (planets.venus.longitude % 30) / 30 * 15;
            creative += (planets.venus.longitude % 30) / 30 * 15;
        }
        if (planets.mercury) info += (planets.mercury.longitude % 30) / 30 * 30;
        if (planets.jupiter) social += (planets.jupiter.longitude % 30) / 30 * 25;
        if (planets.saturn) social += (planets.saturn.longitude % 30) / 30 * 20;
        if (planets.sun) creative += (planets.sun.longitude % 30) / 30 * 25;

        const total = family + info + social + creative + spiritual;
        family = Math.round(family / total * 100);
        info = Math.round(info / total * 100);
        social = Math.round(social / total * 100);
        creative = Math.round(creative / total * 100);
        spiritual = Math.round(spiritual / total * 100);

        const scenarios = [
            { name: 'семейно-бытовой', value: family },
            { name: 'информационный', value: info },
            { name: 'социальный', value: social },
            { name: 'творческий', value: creative },
            { name: 'духовный', value: spiritual }
        ];
        const dominant = scenarios.reduce((max, item) => item.value > max.value ? item : max);

        return `
            <div class="scenarios-container">
                <table class="scenarios-table">
                    <tr>
                        <td class="scenario-color" style="background: #c9a54b;"></td>
                        <td class="scenario-name">Семейно-бытовой</td>
                        <td class="scenario-desc">еда, быт, отношения, уют</td>
                        <td class="scenario-value">${family}%</td>
                    </tr>
                    <tr>
                        <td class="scenario-color" style="background: #4d4dff;"></td>
                        <td class="scenario-name">Информационный</td>
                        <td class="scenario-desc">учёба, общение, новые знакомства</td>
                        <td class="scenario-value">${info}%</td>
                    </tr>
                    <tr>
                        <td class="scenario-color" style="background: #4dff4d;"></td>
                        <td class="scenario-name">Социальный</td>
                        <td class="scenario-desc">карьера, власть, достижения</td>
                        <td class="scenario-value">${social}%</td>
                    </tr>
                    <tr>
                        <td class="scenario-color" style="background: #ff4dff;"></td>
                        <td class="scenario-name">Творческий</td>
                        <td class="scenario-desc">самовыражение, хобби, искусство</td>
                        <td class="scenario-value">${creative}%</td>
                    </tr>
                    <tr>
                        <td class="scenario-color" style="background: #ff4d4d;"></td>
                        <td class="scenario-name">Духовный</td>
                        <td class="scenario-desc">поиск смысла, саморазвитие</td>
                        <td class="scenario-value">${spiritual}%</td>
                    </tr>
                </table>
                <p class="scenarios-summary">Преобладает <strong>${dominant.name} сценарий</strong> (${dominant.value}%).</p>
            </div>
        `;
    }

    function generateBusinessAdvice(planets) {
        const sunSign = planets.sun?.sign || 'Неизвестно';
        const moonSign = planets.moon?.sign || 'Неизвестно';
        const mercurySign = planets.mercury?.sign || 'Неизвестно';
        const venusSign = planets.venus?.sign || 'Неизвестно';
        const marsSign = planets.mars?.sign || 'Неизвестно';

        const sunLong = planets.sun?.longitude || 0;

        let advice = '';
        let directions = [];
        let incomeSources = [];

        const sunVariation = Math.floor(sunLong % 10) + 1;

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

        if (moonSign === 'Рак' || moonSign === 'Рыбы') {
            directions.push('🏥 Медицинская клиника', '💊 Товары для здоровья');
        }
        if (mercurySign === 'Близнецы' || mercurySign === 'Дева') {
            directions.push('📚 Образовательные проекты', '✍️ Писательская деятельность');
        }
        if (venusSign === 'Телец' || venusSign === 'Весы') {
            directions.push('🎨 Дизайн и искусство', '💄 Индустрия красоты');
        }
        if (marsSign === 'Овен' || marsSign === 'Скорпион') {
            directions.push('🏋️‍♂️ Спорт и фитнес', '🔧 Инжиниринг');
        }

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

        const specificAdvice = sunAdvice[sunVariation - 1] || 'Следуйте своей интуиции';

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

    function generateHealthRisks(planets) {
        const risks = [];
        const strengths = [];
        const tips = [];

        const sunSign = planets.sun?.sign || 'Неизвестно';
        const moonSign = planets.moon?.sign || 'Неизвестно';
        const marsSign = planets.mars?.sign || 'Неизвестно';
        const venusSign = planets.venus?.sign || 'Неизвестно';
        const saturnSign = planets.saturn?.sign || 'Неизвестно';

        const sunLong = planets.sun?.longitude || 0;
        const marsLong = planets.mars?.longitude || 0;

        if (sunSign === 'Лев' || sunSign === 'Овен') {
            strengths.push('Сильное сердце и иммунитет');
        }
        if (moonSign === 'Рак' || moonSign === 'Телец') {
            strengths.push('Хорошая пищеварительная система');
        }
        if (marsSign === 'Овен' || marsSign === 'Стрелец') {
            strengths.push('Высокая физическая выносливость');
        }

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

        const healthIndex = Math.floor((sunLong + marsLong) % 5);
        const healthTips = [
            'Рекомендуется утренняя гимнастика и контрастный душ',
            'Полезны прогулки на свежем воздухе и медитация',
            'Важно соблюдать режим сна и отдыха',
            'Рекомендуется регулярно посещать профилактические осмотры',
            'Полезно заниматься дыхательными практиками'
        ];

        strengths.push('Позвоночник и суставы');
        risks.push('⚡ Шейный отдел (риск ангин, проблем с щитовидкой)');

        tips.push('Регулярные профилактические обследования');
        tips.push('Умеренные физические нагрузки, здоровый сон');

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

    function generateLifeTask(planets) {
        const sunSign = planets.sun?.sign || 'Неизвестно';
        const moonSign = planets.moon?.sign || 'Неизвестно';
        const saturnSign = planets.saturn?.sign || 'Неизвестно';

        const sunLong = planets.sun?.longitude || 0;
        const saturnLong = planets.saturn?.longitude || 0;

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
        if (planets.saturn) {
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


// ==================== СОХРАНЕНИЕ В PDF ====================

    document.getElementById('savePdfBtn')?.addEventListener('click', function() {
        const resultSection = document.getElementById('resultSection');
        if (resultSection.style.display !== 'block') {
            showNotification('❌ Сначала выполните расчет', 'error');
            return;
        }

        showNotification('📄 Создаю официальный отчет...', 'info');

        // Получаем данные
        const fullName = document.getElementById('resultName')?.textContent || '—';
        const birthDate = document.getElementById('resultDate')?.textContent || '—';
        const birthTime = document.getElementById('resultTime')?.textContent || '—';

        // Получаем canvas с натальной картой
        const canvas = document.getElementById('natalChartCanvas');
        const chartImage = canvas ? canvas.toDataURL('image/png') : null;

        // Собираем данные из страницы
        const ascendantSign = document.querySelector('.astro-sign')?.textContent || '—';
        const sunSign = document.getElementById('sunSign')?.textContent || '—';
        const moonSign = document.getElementById('moonSign')?.textContent || '—';

        // Получаем интерпретацию
        const interpretationEl = document.getElementById('natalInterpretation');
        const interpretation = interpretationEl ? interpretationEl.innerText : '';

        // Создаем элемент для PDF с правильными размерами A4
        const element = document.createElement('div');
        element.style.width = '210mm';
        element.style.minHeight = '297mm';
        element.style.background = '#0a0a0f';
        element.style.padding = '15mm';
        element.style.color = '#e5e5e5';
        element.style.fontFamily = 'Playfair Display, serif';
        element.style.boxSizing = 'border-box';
        element.style.position = 'relative';
        element.style.margin = '0 auto';

        // Формируем HTML для PDF
        element.innerHTML = generatePDFHTML(
            fullName, birthDate, birthTime,
            ascendantSign, sunSign, moonSign,
            chartImage, interpretation
        );

        // Опции для html2pdf
        const opt = {
            margin:        [0, 0, 0, 0],
            filename:      `natalnaya-karta-${fullName.replace(/\s+/g, '_')}.pdf`,
            image:         { type: 'jpeg', quality: 0.98 },
            html2canvas:  {
                scale: 2,
                backgroundColor: '#0a0a0f',
                letterRendering: true,
                allowTaint: true,
                useCORS: true
            },
            jsPDF:        {
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait',
                putOnlyUsedFonts: true
            }
        };

        // Генерируем PDF
        html2pdf().set(opt).from(element).save();

        showNotification('✅ Отчет создается...', 'success');
    });

    function generatePDFHTML(fullName, birthDate, birthTime, ascendant, sun, moon, chartImage, interpretation) {

        // Собираем все планеты
        let planetsHTML = '';
        document.querySelectorAll('.position-item').forEach(item => {
            const name = item.querySelector('.position-name')?.textContent || '';
            const signElement = item.querySelectorAll('.position-detail .position-value')[0];
            const degreeElement = item.querySelectorAll('.position-detail .position-value')[1];
            const houseElement = item.querySelectorAll('.position-detail .position-value')[2];

            const sign = signElement ? signElement.textContent : '—';
            const degree = degreeElement ? degreeElement.textContent : '—';
            const house = houseElement ? houseElement.textContent : '—';

            planetsHTML += `
            <div style="display: flex; padding: 8px 0; border-bottom: 1px solid rgba(201,165,75,0.2);">
                <div style="width: 30%; color: #c9a54b; font-weight: bold;">${name}</div>
                <div style="width: 25%; color: #fff;">${sign}</div>
                <div style="width: 20%; color: #fff;">${degree}</div>
                <div style="width: 15%; color: #fff;">${house}</div>
            </div>
        `;
        });

        // Собираем аспекты
        let aspectsHTML = '';
        document.querySelectorAll('.aspect-item').forEach(item => {
            aspectsHTML += `<div style="margin-bottom: 8px; color: #a0a0b0; font-size: 11px;">• ${item.textContent}</div>`;
        });

        // Парсим интерпретацию для получения секций
        const sections = interpretation.split('\n\n').filter(s => s.trim());

        // Персонализированное заключение на основе данных
        const conclusion = generatePersonalizedConclusion(fullName, ascendant, sun, moon);

        return `
        <div style="width: 100%; max-width: 180mm; margin: 0 auto;">
            <!-- СТРАНИЦА 1: ТИТУЛЬНЫЙ ЛИСТ -->
            <div style="page-break-after: always; min-height: 267mm; display: flex; flex-direction: column; justify-content: space-between;">
                <!-- Верхняя часть с символом -->
                <div style="text-align: center; margin-top: 20mm;">
                    <div style="font-size: 60px; color: #c9a54b; margin-bottom: 10mm;">⛤</div>
                    <h1 style="font-size: 32px; color: #c9a54b; margin: 0 0 5mm 0; letter-spacing: 2px;">АЛГОРИТМ СУДЬБЫ</h1>
                    <h2 style="font-size: 20px; color: #fff; margin: 0 0 15mm 0; font-weight: 400;">Астрологический портрет личности</h2>
                </div>
                
                <!-- Имя в рамке -->
                <div style="border-top: 2px solid #c9a54b; border-bottom: 2px solid #c9a54b; padding: 10mm 0; margin: 0 10mm; text-align: center;">
                    <h3 style="font-size: 24px; color: #fff; margin: 0; line-height: 1.4; word-wrap: break-word;">${fullName}</h3>
                </div>
                
                <!-- Дата рождения -->
                <div style="text-align: center;">
                    <p style="font-size: 16px; color: #c9a54b; margin: 0;">${birthDate} • ${birthTime}</p>
                </div>
                
                <!-- Печать и подпись -->
                <div style="text-align: center; margin-top: 20mm;">
                    <div style="width: 70px; height: 70px; border: 2px solid #c9a54b; border-radius: 50%; margin: 0 auto 5mm; display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 35px; color: #c9a54b;">⛤</span>
                    </div>
                    <p style="font-size: 10px; color: #c9a54b; letter-spacing: 2px; margin: 0 0 15mm 0;">ОФИЦИАЛЬНАЯ ПЕЧАТЬ</p>
                    
                    <p style="font-size: 14px; color: #fff; margin: 0 0 2mm 0;">Доктор астрологических наук</p>
                    <p style="font-size: 20px; color: #c9a54b; font-weight: bold; margin: 0;">А.Л. Горизонтов</p>
                </div>
            </div>
            
            <!-- СТРАНИЦА 2: НАТАЛЬНАЯ КАРТА И ОСНОВНЫЕ ДАННЫЕ -->
            <div style="page-break-after: always; min-height: 267mm;">
                <h2 style="font-size: 24px; color: #c9a54b; text-align: center; margin: 5mm 0 10mm 0;">НАТАЛЬНАЯ КАРТА</h2>
                
                <!-- Астрологическая карта -->
                ${chartImage ? `
                <div style="text-align: center; margin-bottom: 10mm;">
                    <img src="${chartImage}" style="max-width: 120mm; max-height: 120mm; border: 1px solid #c9a54b; border-radius: 10px; padding: 5px;">
                </div>
                ` : ''}
                
                <!-- Асцендент, Солнце, Луна в ряд -->
                <div style="display: flex; justify-content: space-between; margin-bottom: 10mm;">
                    <div style="flex: 1; background: rgba(18,18,26,0.8); border: 1px solid #c9a54b; border-radius: 8px; padding: 5mm; margin-right: 3mm; text-align: center;">
                        <div style="font-size: 14px; color: #c9a54b; margin-bottom: 3mm;">АСЦЕНДЕНТ</div>
                        <div style="font-size: 18px; color: #fff; font-weight: bold;">${ascendant}</div>
                    </div>
                    <div style="flex: 1; background: rgba(18,18,26,0.8); border: 1px solid #c9a54b; border-radius: 8px; padding: 5mm; margin: 0 3mm; text-align: center;">
                        <div style="font-size: 14px; color: #c9a54b; margin-bottom: 3mm;">☀️ СОЛНЦЕ</div>
                        <div style="font-size: 18px; color: #fff; font-weight: bold;">${sun}</div>
                    </div>
                    <div style="flex: 1; background: rgba(18,18,26,0.8); border: 1px solid #c9a54b; border-radius: 8px; padding: 5mm; margin-left: 3mm; text-align: center;">
                        <div style="font-size: 14px; color: #c9a54b; margin-bottom: 3mm;">🌙 ЛУНА</div>
                        <div style="font-size: 18px; color: #fff; font-weight: bold;">${moon}</div>
                    </div>
                </div>
                
                <!-- Таблица планет -->
                <h3 style="font-size: 18px; color: #c9a54b; margin: 5mm 0 3mm 0;">ПЛАНЕТЫ В ЗНАКАХ</h3>
                
                <!-- Заголовок таблицы -->
                <div style="display: flex; background: #c9a54b; padding: 3mm 0; border-radius: 4px 4px 0 0;">
                    <div style="width: 30%; color: #0a0a0f; font-weight: bold; padding-left: 3mm;">Планета</div>
                    <div style="width: 25%; color: #0a0a0f; font-weight: bold;">Знак</div>
                    <div style="width: 20%; color: #0a0a0f; font-weight: bold;">Градус</div>
                    <div style="width: 15%; color: #0a0a0f; font-weight: bold;">Дом</div>
                </div>
                
                <!-- Данные планет -->
                <div style="border: 1px solid #c9a54b; border-top: none; border-radius: 0 0 4px 4px; padding: 0 3mm; max-height: 100mm; overflow-y: auto;">
                    ${planetsHTML}
                </div>
            </div>
            
            <!-- СТРАНИЦА 3: АСПЕКТЫ -->
            <div style="page-break-after: always; min-height: 267mm;">
                <h2 style="font-size: 24px; color: #c9a54b; text-align: center; margin: 5mm 0 10mm 0;">АСПЕКТЫ ПЛАНЕТ</h2>
                
                <div style="background: rgba(18,18,26,0.8); border: 1px solid #c9a54b; border-radius: 8px; padding: 5mm;">
                    ${aspectsHTML || '<p style="color: #a0a0b0;">Нет значимых аспектов</p>'}
                </div>
            </div>
            
            <!-- СТРАНИЦА 4: ИНТЕРПРЕТАЦИЯ -->
            <div style="page-break-after: always; min-height: 267mm;">
                <h2 style="font-size: 24px; color: #c9a54b; text-align: center; margin: 5mm 0 10mm 0;">ИНТЕРПРЕТАЦИЯ</h2>
                
                <div style="background: rgba(18,18,26,0.8); border: 1px solid #c9a54b; border-radius: 8px; padding: 5mm;">
                    ${sections.map(section => `
                        <div style="margin-bottom: 5mm;">
                            ${section.split('\n').map(line => {
            if (line.includes(':')) {
                const [title, ...rest] = line.split(':');
                return `<p><strong style="color: #c9a54b;">${title}:</strong>${rest.join(':')}</p>`;
            }
            return `<p>${line}</p>`;
        }).join('')}
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- СТРАНИЦА 5: ЗАКЛЮЧЕНИЕ -->
            <div style="min-height: 267mm;">
                <h2 style="font-size: 24px; color: #c9a54b; text-align: center; margin: 5mm 0 10mm 0;">ЗАКЛЮЧЕНИЕ</h2>
                
                <div style="background: rgba(18,18,26,0.8); border: 1px solid #c9a54b; border-radius: 8px; padding: 5mm;">
                    ${conclusion}
                </div>
            </div>
        </div>
    `;
    }

    function generatePersonalizedConclusion(fullName, ascendant, sun, moon) {
        // Функция для извлечения знака из строки (например, "Лев 16.0°" -> "Лев")
        function extractSign(input) {
            if (!input || input === '—') return null;
            // Ищем слово, которое может быть знаком зодиака
            const possibleSigns = ['Овен', 'Телец', 'Близнецы', 'Рак', 'Лев', 'Дева',
                'Весы', 'Скорпион', 'Стрелец', 'Козерог', 'Водолей', 'Рыбы'];

            for (let sign of possibleSigns) {
                if (input.includes(sign)) return sign;
            }
            return null;
        }

        const ascSign = extractSign(ascendant);
        const sunSign = extractSign(sun);
        const moonSign = extractSign(moon);

        const signMeanings = {
            'Овен': 'инициативность и напор, стремление быть первым',
            'Телец': 'стабильность, надежность и любовь к комфорту',
            'Близнецы': 'коммуникабельность, любознательность и гибкость ума',
            'Рак': 'эмоциональность, заботливость и глубокую привязанность',
            'Лев': 'творчество, лидерство и щедрость',
            'Дева': 'аналитичность, практичность и внимание к деталям',
            'Весы': 'дипломатичность, стремление к гармонии и красоте',
            'Скорпион': 'страстность, глубину и способность к трансформации',
            'Стрелец': 'оптимизм, свободолюбие и философский склад ума',
            'Козерог': 'амбициозность, ответственность и целеустремленность',
            'Водолей': 'оригинальность, независимость и гуманизм',
            'Рыбы': 'интуицию, сострадание и творческое воображение'
        };

        const elementMap = {
            'Овен': 'Огня', 'Лев': 'Огня', 'Стрелец': 'Огня',
            'Телец': 'Земли', 'Дева': 'Земли', 'Козерог': 'Земли',
            'Близнецы': 'Воздуха', 'Весы': 'Воздуха', 'Водолей': 'Воздуха',
            'Рак': 'Воды', 'Скорпион': 'Воды', 'Рыбы': 'Воды'
        };

        const elementRus = {
            'Огня': 'огненная',
            'Земли': 'земная',
            'Воздуха': 'воздушная',
            'Воды': 'водная'
        };

        // Безопасное получение значений с проверкой
        const ascMeaning = ascSign ? signMeanings[ascSign] : 'уникальные качества';
        const sunMeaning = sunSign ? signMeanings[sunSign] : 'вашу истинную природу';
        const moonMeaning = moonSign ? signMeanings[moonSign] : 'глубокие эмоциональные переживания';

        const ascElement = ascSign ? elementMap[ascSign] : null;
        const sunElement = sunSign ? elementMap[sunSign] : null;
        const moonElement = moonSign ? elementMap[moonSign] : null;

        // Формируем текст о стихиях
        let elementText = '';
        if (ascSign && sunSign && moonSign) {
            if (ascElement === sunElement && sunElement === moonElement) {
                elementText = `интересно, что все три ключевых элемента вашей карты принадлежат стихии ${ascElement?.toLowerCase()}. Это дает вам целостность, мощную концентрацию энергии и позволяет легко находить баланс между разумом, чувствами и действиями.`;
            } else {
                const elements = [ascElement, sunElement, moonElement].filter(e => e);
                const uniqueElements = [...new Set(elements)];

                if (uniqueElements.length === 2) {
                    elementText = `в вашей карте гармонично сочетаются две стихии: ${uniqueElements.join(' и ').toLowerCase()}. Это дает вам многогранность и способность адаптироваться к разным ситуациям.`;
                } else {
                    elementText = `в вашей карте представлены три разные стихии: ${ascElement?.toLowerCase()} (внешность), ${sunElement?.toLowerCase()} (сущность) и ${moonElement?.toLowerCase()} (эмоции). Это делает вас чрезвычайно многогранной личностью, способной сочетать, казалось бы, несочетаемые качества.`;
                }
            }
        } else {
            elementText = 'в вашей карте представлено уникальное сочетание энергий, которое делает вашу личность многогранной и неповторимой.';
        }

        return `
        <p style="font-size: 12px; line-height: 1.6; color: #fff; margin-bottom: 4mm;">
            Уважаемый(ая) <strong style="color: #c9a54b;">${fullName}</strong>!
        </p>
        
        <p style="font-size: 12px; line-height: 1.6; color: #fff; margin-bottom: 4mm;">
            Проведя глубокий анализ вашей натальной карты, я могу сделать следующие выводы о вашей личности и жизненном пути.
        </p>
        
        ${ascSign ? `
        <p style="font-size: 12px; line-height: 1.6; color: #fff; margin-bottom: 4mm;">
            Ваш асцендент в знаке <strong style="color: #c9a54b;">${ascSign}</strong> указывает на то, что в мире вы проявляетесь через ${ascMeaning}. Это ваша визитная карточка — то, как вас воспринимают окружающие при первой встрече.
        </p>
        ` : ''}
        
        ${sunSign ? `
        <p style="font-size: 12px; line-height: 1.6; color: #fff; margin-bottom: 4mm;">
            Ваша внутренняя сущность, отраженная Солнцем в знаке <strong style="color: #c9a54b;">${sunSign}</strong>, стремится к ${sunMeaning}. Это ваша жизненная цель, источник энергии и то, кем вы становитесь, раскрывая свой потенциал.
        </p>
        ` : ''}
        
        ${moonSign ? `
        <p style="font-size: 12px; line-height: 1.6; color: #fff; margin-bottom: 4mm;">
            Эмоционально вы настроены на волну <strong style="color: #c9a54b;">${moonSign}</strong>, что дает вам ${moonMeaning}. Это ваша эмоциональная природа, то, как вы реагируете на мир и ищете комфорт.
        </p>
        ` : ''}
        
        <p style="font-size: 12px; line-height: 1.6; color: #fff; margin-bottom: 4mm;">
            Особо стоит отметить, что ${elementText}
        </p>
        
        <p style="font-size: 12px; line-height: 1.6; color: #fff; margin-bottom: 4mm;">
            Анализ аспектов между планетами показывает, что в вашей жизни будут периоды, когда ${getAspectAdvice()}
        </p>
        
        <p style="font-size: 12px; line-height: 1.6; color: #fff; margin-bottom: 4mm;">
            Рекомендую вам обратить особое внимание на развитие качеств, связанных с вашим Солнцем, и учиться принимать свою эмоциональную природу через Луну. Асцендент подскажет, как лучше взаимодействовать с миром и производить нужное впечатление.
        </p>
        
        <div style="margin-top: 10mm; text-align: right;">
            <p style="font-size: 14px; color: #fff; margin: 0 0 2mm 0;">С уважением и верой в вашу звезду,</p>
            <p style="font-size: 18px; color: #c9a54b; font-weight: bold; margin: 0 0 2mm 0;">Доктор астрологических наук</p>
            <p style="font-size: 24px; color: #c9a54b; font-family: 'Times New Roman', cursive; margin: 0;">А.Л. Горизонтов</p>
        </div>
    `;
    }

    function getAspectAdvice() {
        const advices = [
            'вам стоит быть внимательнее к знакам судьбы и доверять своей интуиции.',
            'важно научиться балансировать между разумом и чувствами.',
            'перед вами откроются новые возможности, если вы сможете преодолеть внутренние сомнения.',
            'ваша сила — в умении объединять, казалось бы, несовместимые качества.',
            'ключ к успеху лежит через принятие своих теневых сторон.',
            'вам предстоят важные трансформации, которые приведут к росту.',
            'звезды указывают на период, благоприятный для самореализации.',
            'в сложных ситуациях опирайтесь на свою интуицию — она редко вас подводит.',
            'важно научиться говорить "нет" и выстраивать личные границы.',
            'удача придет через творческую самореализацию и следование за своими увлечениями.'
        ];
        return advices[Math.floor(Math.random() * advices.length)];
    }


});