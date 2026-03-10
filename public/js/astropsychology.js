document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('astropsychologyForm');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const resultSection = document.getElementById('resultSection');
    const newCalculationBtn = document.getElementById('newCalculationBtn');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = {
            fullName: document.getElementById('fullName').value,
            birthDate: document.getElementById('birthDate').value,
            birthTime: document.getElementById('birthTime').value,
            birthPlace: document.getElementById('birthPlace').value,
            question: document.getElementById('question').value
        };

        if (!isValidDate(formData.birthDate)) {
            alert('Пожалуйста, введите корректную дату рождения');
            return;
        }

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
            } else {
                alert('Ошибка: ' + (data.error || 'Неизвестная ошибка'));
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при подключении к серверу');
        } finally {
            loadingSpinner.style.display = 'none';
            form.style.opacity = '1';
            form.style.pointerEvents = 'auto';
        }
    });

    newCalculationBtn.addEventListener('click', function() {
        resultSection.style.display = 'none';
        form.reset();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

function isValidDate(dateStr) {
    const pattern = /^\d{2}\.\d{2}\.\d{4}$/;
    if (!pattern.test(dateStr)) return false;

    const [day, month, year] = dateStr.split('.').map(Number);
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;

    const daysInMonth = new Date(year, month, 0).getDate();
    return day <= daysInMonth;
}

function displayResults(data) {
    document.getElementById('resultFullName').textContent = data.fullName;
    document.getElementById('resultBirthDate').textContent = `${data.birthData.date} ${data.birthData.time || ''}`;

    document.getElementById('ascendantSign').textContent = `${data.ascendant.sign} ${data.ascendant.degree}°`;
    document.getElementById('ascendantDescription').textContent = data.ascendant.description;

    document.getElementById('sunSign').textContent = `${data.sun.sign} ${data.planets.find(p => p.name === 'Солнце')?.degree || ''}°`;
    document.getElementById('sunDescription').textContent = data.sun.description;

    document.getElementById('moonSign').textContent = `${data.moon.sign} ${data.planets.find(p => p.name === 'Луна')?.degree || ''}°`;
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

    document.getElementById('interpretationText').innerHTML = data.interpretation;
}