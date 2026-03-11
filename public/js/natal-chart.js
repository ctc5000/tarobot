document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('natalChartForm');
    const canvas = document.getElementById('natalChartCanvas');
    const resultSection = document.getElementById('resultSection');
    const newBtn = document.getElementById('newCalculationBtn');

    let chartDraw = null;

    // Инициализация рисовальщика
    if (canvas) {
        chartDraw = new NatalChartDraw('natalChartCanvas');
    }

    // Поиск города
    document.getElementById('searchCity')?.addEventListener('click', async function() {
        const city = document.getElementById('birthPlace').value;
        if (!city) return;

        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${city}`);
            const data = await response.json();

            if (data && data[0]) {
                document.getElementById('latitude').value = parseFloat(data[0].lat).toFixed(6);
                document.getElementById('longitude').value = parseFloat(data[0].lon).toFixed(6);
                showNotification(`✅ Найдены координаты для ${data[0].display_name.split(',')[0]}`, 'success');
            } else {
                showNotification('❌ Город не найден', 'error');
            }
        } catch (error) {
            console.error('Ошибка поиска города:', error);
            showNotification('❌ Ошибка при поиске города', 'error');
        }
    });

    // Обработка формы
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = {
            fullName: document.getElementById('fullName').value,
            gender: document.getElementById('gender').value,
            birthDate: document.getElementById('birthDate').value,
            birthTime: document.getElementById('birthTime').value,
            latitude: parseFloat(document.getElementById('latitude').value),
            longitude: parseFloat(document.getElementById('longitude').value),
            houseSystem: document.getElementById('houseSystem').value
        };

        if (!validateForm(formData)) return;

        showNotification('🔮 Строим натальную карту...', 'info');

        try {
            const chartData = generateTestChartData(formData);
            displayResults(formData, chartData);
        } catch (error) {
            console.error('Ошибка:', error);
            showNotification('❌ Ошибка при построении карты', 'error');
        }
    });

    // Валидация
    function validateForm(data) {
        if (!data.fullName) {
            showNotification('❌ Укажите имя', 'error');
            return false;
        }
        if (!isValidDate(data.birthDate)) {
            showNotification('❌ Неверный формат даты', 'error');
            return false;
        }
        if (!isValidTime(data.birthTime)) {
            showNotification('❌ Неверный формат времени', 'error');
            return false;
        }
        if (isNaN(data.latitude) || data.latitude < -90 || data.latitude > 90) {
            showNotification('❌ Неверная широта', 'error');
            return false;
        }
        if (isNaN(data.longitude) || data.longitude < -180 || data.longitude > 180) {
            showNotification('❌ Неверная долгота', 'error');
            return false;
        }
        return true;
    }

    function isValidDate(dateStr) {
        const pattern = /^\d{2}\.\d{2}\.\d{4}$/;
        if (!pattern.test(dateStr)) return false;
        const [day, month, year] = dateStr.split('.').map(Number);
        if (month < 1 || month > 12) return false;
        if (day < 1 || day > 31) return false;
        const daysInMonth = new Date(year, month, 0).getDate();
        return day <= daysInMonth;
    }

    function isValidTime(timeStr) {
        const pattern = /^\d{2}:\d{2}$/;
        if (!pattern.test(timeStr)) return false;
        const [hour, minute] = timeStr.split(':').map(Number);
        return hour >= 0 && hour < 24 && minute >= 0 && minute < 60;
    }

    // ==================== ГЕНЕРАЦИЯ ТЕСТОВЫХ ДАННЫХ ====================

    function generateTestChartData(formData) {
        const [day, month, year] = formData.birthDate.split('.').map(Number);
        const [hour, minute] = formData.birthTime.split(':').map(Number);

        const dayOfYear = Math.floor((new Date(year, month - 1, day) - new Date(year, 0, 0)) / 86400000);

        const planets = {
            sun: {
                name: 'Солнце',
                symbol: '☉',
                longitude: (dayOfYear / 365) * 360,
                sign: getSignFromLongitude((dayOfYear / 365) * 360),
                house: Math.floor((dayOfYear / 365) * 12) + 1
            },
            moon: {
                name: 'Луна',
                symbol: '☽',
                longitude: (dayOfYear * 13) % 360,
                sign: getSignFromLongitude((dayOfYear * 13) % 360),
                house: Math.floor(((dayOfYear * 13) % 360) / 30) + 1
            },
            mercury: {
                name: 'Меркурий',
                symbol: '☿',
                longitude: (dayOfYear / 365 * 360 + 30) % 360,
                sign: getSignFromLongitude((dayOfYear / 365 * 360 + 30) % 360),
                house: Math.floor(((dayOfYear / 365 * 360 + 30) % 360) / 30) + 1
            },
            venus: {
                name: 'Венера',
                symbol: '♀',
                longitude: (dayOfYear / 365 * 360 + 60) % 360,
                sign: getSignFromLongitude((dayOfYear / 365 * 360 + 60) % 360),
                house: Math.floor(((dayOfYear / 365 * 360 + 60) % 360) / 30) + 1
            },
            mars: {
                name: 'Марс',
                symbol: '♂',
                longitude: (dayOfYear / 365 * 360 + 90) % 360,
                sign: getSignFromLongitude((dayOfYear / 365 * 360 + 90) % 360),
                house: Math.floor(((dayOfYear / 365 * 360 + 90) % 360) / 30) + 1
            },
            jupiter: {
                name: 'Юпитер',
                symbol: '♃',
                longitude: (dayOfYear / 365 * 360 + 120) % 360,
                sign: getSignFromLongitude((dayOfYear / 365 * 360 + 120) % 360),
                house: Math.floor(((dayOfYear / 365 * 360 + 120) % 360) / 30) + 1
            },
            saturn: {
                name: 'Сатурн',
                symbol: '♄',
                longitude: (dayOfYear / 365 * 360 + 150) % 360,
                sign: getSignFromLongitude((dayOfYear / 365 * 360 + 150) % 360),
                house: Math.floor(((dayOfYear / 365 * 360 + 150) % 360) / 30) + 1
            }
        };

        const ascendant = (dayOfYear / 365 * 360 + hour * 15 + minute * 0.25) % 360;

        const houses = [];
        for (let i = 0; i < 12; i++) {
            houses.push({
                number: i + 1,
                cusp: (ascendant + i * 30) % 360
            });
        }

        const aspects = generateAspects(planets);

        return { planets, houses, ascendant, aspects };
    }

    function getSignFromLongitude(long) {
        const signs = ['Овен', 'Телец', 'Близнецы', 'Рак', 'Лев', 'Дева',
            'Весы', 'Скорпион', 'Стрелец', 'Козерог', 'Водолей', 'Рыбы'];
        const index = Math.floor(long / 30) % 12;
        return signs[index];
    }

    function generateAspects(planets) {
        const aspects = [];
        const planetList = Object.values(planets);

        for (let i = 0; i < planetList.length; i++) {
            for (let j = i + 1; j < planetList.length; j++) {
                const diff = Math.abs(planetList[i].longitude - planetList[j].longitude);
                const orb = Math.min(diff, 360 - diff);

                if (orb < 10) {
                    aspects.push({
                        planet1: planetList[i].name,
                        planet2: planetList[j].name,
                        type: 'conjunction',
                        orb: orb.toFixed(1),
                        description: `${planetList[i].name} в соединении с ${planetList[j].name}`
                    });
                } else if (Math.abs(orb - 180) < 10) {
                    aspects.push({
                        planet1: planetList[i].name,
                        planet2: planetList[j].name,
                        type: 'opposition',
                        orb: Math.abs(orb - 180).toFixed(1),
                        description: `${planetList[i].name} в оппозиции с ${planetList[j].name}`
                    });
                } else if (Math.abs(orb - 120) < 8) {
                    aspects.push({
                        planet1: planetList[i].name,
                        planet2: planetList[j].name,
                        type: 'trine',
                        orb: Math.abs(orb - 120).toFixed(1),
                        description: `${planetList[i].name} в трине с ${planetList[j].name}`
                    });
                } else if (Math.abs(orb - 90) < 8) {
                    aspects.push({
                        planet1: planetList[i].name,
                        planet2: planetList[j].name,
                        type: 'square',
                        orb: Math.abs(orb - 90).toFixed(1),
                        description: `${planetList[i].name} в квадратуре с ${planetList[j].name}`
                    });
                } else if (Math.abs(orb - 60) < 6) {
                    aspects.push({
                        planet1: planetList[i].name,
                        planet2: planetList[j].name,
                        type: 'sextile',
                        orb: Math.abs(orb - 60).toFixed(1),
                        description: `${planetList[i].name} в секстиле с ${planetList[j].name}`
                    });
                }
            }
        }

        return aspects;
    }

    // ==================== ОТОБРАЖЕНИЕ РЕЗУЛЬТАТОВ ====================

    function displayResults(formData, chartData) {
        document.getElementById('resultName').textContent = formData.fullName;
        document.getElementById('resultDate').textContent = formData.birthDate;
        document.getElementById('resultTime').textContent = formData.birthTime;

        if (chartDraw) {
            chartDraw.draw(chartData);
        }

        displayLegend(chartData.planets);
        displayPlanetPositions(chartData.planets);
        displayAspects(chartData.aspects);

        // Генерируем и отображаем расшифровку
        const interpretation = generateInterpretation(chartData, formData);

        let interpretationContainer = document.getElementById('natalInterpretation');
        if (!interpretationContainer) {
            interpretationContainer = document.createElement('div');
            interpretationContainer.id = 'natalInterpretation';
            interpretationContainer.className = 'natal-interpretation';
            document.querySelector('.result-card').appendChild(interpretationContainer);
        }
        interpretationContainer.innerHTML = interpretation;

        resultSection.style.display = 'block';
        resultSection.scrollIntoView({ behavior: 'smooth' });
    }

    function displayLegend(planets) {
        const legend = document.getElementById('planetLegend');
        legend.innerHTML = '';

        Object.values(planets).forEach(planet => {
            const item = document.createElement('div');
            item.className = 'legend-item';
            item.innerHTML = `
                <span class="planet-symbol">${planet.symbol}</span>
                <span class="planet-name">${planet.name}</span>
                <span class="planet-sign">${planet.sign}</span>
            `;
            legend.appendChild(item);
        });
    }

    function displayPlanetPositions(planets) {
        const grid = document.getElementById('planetPositions');
        grid.innerHTML = '';

        Object.values(planets).forEach(planet => {
            const item = document.createElement('div');
            item.className = 'position-item';

            const degree = (planet.longitude % 30).toFixed(1);
            const signIndex = Math.floor(planet.longitude / 30);
            const signSymbol = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'][signIndex];

            item.innerHTML = `
                <div class="position-header">
                    <span class="position-symbol">${planet.symbol}</span>
                    <span class="position-name">${planet.name}</span>
                </div>
                <div class="position-detail">
                    <span>Знак:</span>
                    <span class="position-value">${planet.sign} ${signSymbol}</span>
                </div>
                <div class="position-detail">
                    <span>Градус:</span>
                    <span class="position-value">${degree}°</span>
                </div>
                <div class="position-detail">
                    <span>Дом:</span>
                    <span class="position-value">${planet.house}</span>
                </div>
            `;

            grid.appendChild(item);
        });
    }

    function displayAspects(aspects) {
        const list = document.getElementById('aspectsList');
        list.innerHTML = '';

        if (aspects.length === 0) {
            list.innerHTML = '<p>Нет значимых аспектов</p>';
            return;
        }

        aspects.forEach(aspect => {
            const item = document.createElement('div');
            item.className = `aspect-item ${aspect.type}`;
            item.innerHTML = aspect.description;
            list.appendChild(item);
        });
    }

    newBtn.addEventListener('click', function() {
        resultSection.style.display = 'none';
        form.reset();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    function showNotification(message, type) {
        console.log(`[${type}] ${message}`);
        alert(`${type === 'error' ? '❌' : type === 'success' ? '✅' : '🔮'} ${message}`);
    }

    // ==================== РАСШИФРОВКА НАТАЛЬНОЙ КАРТЫ ====================

    function generateInterpretation(chartData, formData) {
        const planets = chartData.planets;
        const houses = chartData.houses;
        const ascendant = chartData.ascendant;
        const aspects = chartData.aspects;

        const ascSign = getSignFromLongitude(ascendant);
        const ascDegree = (ascendant % 30).toFixed(1);

        const sunSign = planets.sun.sign;
        const sunHouse = planets.sun.house;

        const moonSign = planets.moon.sign;
        const moonHouse = planets.moon.house;

        return `
            <div class="interpretation-container">
                <div class="interpretation-section">
                    <h4>🌅 АСЦЕНДЕНТ (Восходящий знак)</h4>
                    <p class="section-content">
                        <strong>${ascSign} ${ascDegree}°</strong> — ${getAscendantDescription(ascSign)}
                    </p>
                    <p class="section-detail">${getAscendantDetailed(ascSign)}</p>
                </div>

                <div class="interpretation-section">
                    <h4>☀️ СОЛНЦЕ (Сущность, эго)</h4>
                    <p class="section-content">
                        <strong>${sunSign} в ${sunHouse} доме</strong> — ${getSunDescription(sunSign)}
                    </p>
                    <p class="section-detail">${getSunInHouseDescription(sunSign, sunHouse)}</p>
                </div>

                <div class="interpretation-section">
                    <h4>🌙 ЛУНА (Душа, эмоции)</h4>
                    <p class="section-content">
                        <strong>${moonSign} в ${moonHouse} доме</strong> — ${getMoonDescription(moonSign)}
                    </p>
                    <p class="section-detail">${getMoonInHouseDescription(moonSign, moonHouse)}</p>
                </div>

                <div class="interpretation-section">
                    <h4>📊 ПОЗИЦИИ ПЛАНЕТ В ДОМАХ</h4>
                    ${generatePlanetsInHousesInterpretation(planets)}
                </div>

                <div class="interpretation-section">
                    <h4>⚡ КЛЮЧЕВЫЕ АСПЕКТЫ</h4>
                    ${generateAspectsInterpretation(aspects, planets)}
                </div>

                <div class="interpretation-section">
                    <h4>🏠 ЗНАЧЕНИЕ ДОМОВ</h4>
                    ${generateHousesInterpretation(houses, planets)}
                </div>

                <div class="interpretation-section summary">
                    <h4>🌟 ОБЩИЙ ПОРТРЕТ</h4>
                    <p class="summary-text">${generateOverallPortrait(ascSign, sunSign, moonSign, planets)}</p>
                </div>
            </div>
        `;
    }

    // ==================== НЕДОСТАЮЩИЕ ФУНКЦИИ ====================

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
            mars: 'Марс', jupiter: 'Юпитер', saturn: 'Сатурн'
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
            saturn: 'ваши ограничения, ответственность, дисциплину'
        };

        return `${planetNames[planet]} в ${house} доме (${houseMeanings[house]}) влияет на ${planetMeanings[planet]}.`;
    }

    function generatePlanetsInHousesInterpretation(planets) {
        let html = '<div class="planets-houses">';

        Object.entries(planets).forEach(([key, planet]) => {
            html += `
                <div class="planet-house-item">
                    <span class="planet-symbol">${planet.symbol}</span>
                    <span class="planet-desc">${getPlanetInHouseDescription(key, planet.sign, planet.house)}</span>
                </div>
            `;
        });

        html += '</div>';
        return html;
    }

    function generateAspectsInterpretation(aspects, planets) {
        if (!aspects || aspects.length === 0) {
            return '<p>Нет значимых аспектов в вашей карте.</p>';
        }

        let html = '<div class="aspects-interpretation">';

        aspects.forEach(aspect => {
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
});