// /js/astropsychology.js (клиентский файл)
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('astropsychologyForm');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const resultSection = document.getElementById('resultSection');
    const newCalculationBtn = document.getElementById('newCalculationBtn');

    let dateMask = null;
    let searchTimeout = null;

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
                if (latitudeInput) latitudeInput.value = parseFloat(city.lat).toFixed(6);
                if (longitudeInput) longitudeInput.value = parseFloat(city.lon).toFixed(6);
                suggestionsContainer.style.display = 'none';

                showNotification(`✅ Найден город: ${cityName}`, 'success');
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
            if (latitudeInput) latitudeInput.value = '55.7558'; // Сбрасываем на Москву по умолчанию
            if (longitudeInput) longitudeInput.value = '37.6173';

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

    // ==================== ОБРАБОТКА ФОРМЫ ====================
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = {
            fullName: document.getElementById('fullName').value,
            birthDate: document.getElementById('birthDate').value,
            birthTime: document.getElementById('birthTime').value,
            birthPlace: document.getElementById('birthPlace').value,
            latitude: parseFloat(document.getElementById('latitude').value) || 55.7558,
            longitude: parseFloat(document.getElementById('longitude').value) || 37.6173,
            question: document.getElementById('question').value
        };

        if (!validateForm(formData)) return;

        loadingSpinner.style.display = 'block';
        form.style.opacity = '0.5';
        form.style.pointerEvents = 'none';

        try {
            const response = await fetch('/api/calculate/astropsychology', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                displayResults(data.data);
                resultSection.style.display = 'block';
                resultSection.scrollIntoView({ behavior: 'smooth' });
                showNotification('✨ Портрет построен!', 'success');
            } else {
                showNotification('❌ Ошибка: ' + (data.error || 'Неизвестная ошибка'), 'error');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            showNotification('❌ Произошла ошибка при подключении к серверу', 'error');
        } finally {
            loadingSpinner.style.display = 'none';
            form.style.opacity = '1';
            form.style.pointerEvents = 'auto';
        }
    });

    newCalculationBtn.addEventListener('click', function() {
        resultSection.style.display = 'none';
        form.reset();

        // Очищаем маску даты
        if (dateMask) {
            dateMask.value = '';
        }

        // Сбрасываем координаты на Москву
        if (latitudeInput) latitudeInput.value = '55.7558';
        if (longitudeInput) longitudeInput.value = '37.6173';

        window.scrollTo({ top: 0, behavior: 'smooth' });
        showNotification('✨ Готов к новому расчету!', 'info');
    });
});

function validateForm(data) {
    if (!data.fullName) {
        showNotification('❌ Укажите имя', 'error');
        return false;
    }

    if (!data.birthDate || data.birthDate.length !== 10) {
        showNotification('❌ Введите дату рождения в формате ДД.ММ.ГГГГ', 'error');
        return false;
    }

    if (!isValidDate(data.birthDate)) {
        showNotification('❌ Проверьте правильность даты', 'error');
        return false;
    }

    if (!data.birthTime || !data.birthTime.match(/^\d{2}:\d{2}$/)) {
        showNotification('❌ Укажите время рождения', 'error');
        return false;
    }

    return true;
}

function isValidDate(dateStr) {
    if (!dateStr || dateStr.length !== 10) return false;

    const pattern = /^\d{2}\.\d{2}\.\d{4}$/;
    if (!pattern.test(dateStr)) return false;

    const [day, month, year] = dateStr.split('.').map(Number);
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;

    const daysInMonth = new Date(year, month, 0).getDate();
    return day <= daysInMonth;
}

function showNotification(message, type = 'info') {
    console.log(`[${type}] ${message}`);

    // Создаем временное уведомление
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span class="notification-icon">${type === 'error' ? '❌' : type === 'success' ? '✅' : '🔮'}</span>
        <span class="notification-message">${message}</span>
    `;

    // Добавляем стили для уведомления
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '12px 20px';
    notification.style.background = type === 'error' ? 'rgba(255, 69, 58, 0.9)' :
        type === 'success' ? 'rgba(50, 205, 50, 0.9)' :
            'rgba(201, 165, 75, 0.9)';
    notification.style.color = '#fff';
    notification.style.borderRadius = '8px';
    notification.style.zIndex = '9999';
    notification.style.backdropFilter = 'blur(10px)';
    notification.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
    notification.style.animation = 'slideIn 0.3s ease';

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function displayResults(data) {
    document.getElementById('resultFullName').textContent = data.fullName;
    document.getElementById('resultBirthDate').textContent = `${data.birthData.date} ${data.birthData.time || ''}`;

    document.getElementById('ascendantSign').textContent = `${data.ascendant.sign} ${data.ascendant.degree}°`;
    document.getElementById('ascendantDescription').textContent = data.ascendant.description;

    document.getElementById('sunSign').textContent = `${data.sun.sign} ${data.sun.degree}°`;
    document.getElementById('sunDescription').textContent = data.sun.description;

    document.getElementById('moonSign').textContent = `${data.moon.sign} ${data.moon.degree}°`;
    document.getElementById('moonDescription').textContent = data.moon.description;

    const planetsGrid = document.getElementById('planetsGrid');
    planetsGrid.innerHTML = '';
    data.planets.forEach(planet => {
        const planetDiv = document.createElement('div');
        planetDiv.className = 'planet-item';
        planetDiv.innerHTML = `
            <div class="planet-symbol">${planet.symbol}</div>
            <div class="planet-name">${planet.name}</div>
            <div>${planet.sign} ${planet.degree}°</div>
            <small>${planet.retrograde ? 'ретроградный' : ''}</small>
        `;
        planetsGrid.appendChild(planetDiv);
    });

    document.getElementById('psychEgo').textContent = data.psychology.ego;
    document.getElementById('psychEmotions').textContent = data.psychology.emotions;
    document.getElementById('psychPersonality').textContent = data.psychology.personality;

    const strengthsList = document.getElementById('astroStrengths');
    strengthsList.innerHTML = '';
    data.psychology.strengths.forEach(strength => {
        const li = document.createElement('li');
        li.textContent = strength;
        strengthsList.appendChild(li);
    });

    const challengesList = document.getElementById('astroChallenges');
    challengesList.innerHTML = '';
    data.psychology.challenges.forEach(challenge => {
        const li = document.createElement('li');
        li.textContent = challenge;
        challengesList.appendChild(li);
    });

    document.getElementById('growthPath').textContent = data.psychology.growthPath;

    const forecastGrid = document.getElementById('forecastGrid');
    forecastGrid.innerHTML = `
        <div class="forecast-item">
            <strong>💼 Карьера</strong><br>
            ${data.forecast.career}
        </div>
        <div class="forecast-item">
            <strong>❤️ Любовь</strong><br>
            ${data.forecast.love}
        </div>
        <div class="forecast-item">
            <strong>🌿 Здоровье</strong><br>
            ${data.forecast.health}
        </div>
        <div class="forecast-item">
            <strong>✨ Общее</strong><br>
            ${data.forecast.general}
        </div>
    `;

    document.getElementById('interpretationText').innerHTML = data.interpretation.replace(/\n/g, '<br>');
}