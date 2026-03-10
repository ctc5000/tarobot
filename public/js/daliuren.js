document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('daliurenForm');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const resultSection = document.getElementById('resultSection');
    const newCalculationBtn = document.getElementById('newCalculationBtn');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = {
            question: document.getElementById('question').value,
            year: parseInt(document.getElementById('year').value),
            month: parseInt(document.getElementById('month').value),
            day: parseInt(document.getElementById('day').value),
            hour: document.getElementById('hour').value ? parseInt(document.getElementById('hour').value) : null
        };

        if (formData.month < 1 || formData.month > 12) {
            alert('Месяц должен быть от 1 до 12');
            return;
        }

        if (formData.day < 1 || formData.day > 31) {
            alert('День должен быть от 1 до 31');
            return;
        }

        loadingSpinner.style.display = 'block';
        form.style.opacity = '0.5';
        form.style.pointerEvents = 'none';

        try {
            const response = await fetch('/api/calculate/daliuren', {
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

function displayResults(data) {
    document.getElementById('resultQuestion').textContent = data.question;
    document.getElementById('resultDateTime').textContent = `${data.datetime.year}.${data.datetime.month}.${data.datetime.day} ${data.datetime.hour || ''}`;

    const fourPillarsDiv = document.getElementById('fourPillars');
    fourPillarsDiv.innerHTML = `
        <div class="pillar">
            <div class="pillar-name">${data.fourPillars.year}</div>
            <div class="pillar-label">Год</div>
        </div>
        <div class="pillar">
            <div class="pillar-name">${data.fourPillars.month}</div>
            <div class="pillar-label">Месяц</div>
        </div>
        <div class="pillar">
            <div class="pillar-name">${data.fourPillars.day}</div>
            <div class="pillar-label">День</div>
        </div>
        <div class="pillar">
            <div class="pillar-name">${data.fourPillars.hour || '—'}</div>
            <div class="pillar-label">Час</div>
        </div>
    `;

    document.getElementById('generalInfo').innerHTML = `
        <p><strong>Генерал:</strong> ${data.general.name} (стихия ${data.general.element})</p>
        <p><strong>Зал Света:</strong> направление ${data.brightHall.direction} — ${data.brightHall.meaning}</p>
    `;

    const gongsGrid = document.getElementById('gongsGrid');
    gongsGrid.innerHTML = '';
    data.twelveGongs.slice(0, 6).forEach(gong => {
        const gongDiv = document.createElement('div');
        gongDiv.className = 'gong-item';
        gongDiv.innerHTML = `
            <strong>${gong.branch}</strong><br>
            ${gong.star}<br>
            <small>${gong.element}</small>
        `;
        gongsGrid.appendChild(gongDiv);
    });

    document.getElementById('auspiciousnessInfo').innerHTML = `
        <p><strong>Уровень:</strong> ${data.auspiciousness.level}</p>
        <p><strong>Совет:</strong> ${data.auspiciousness.advice}</p>
    `;

    document.getElementById('interpretationText').innerHTML = data.interpretation;
}