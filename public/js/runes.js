document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('runesForm');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const resultSection = document.getElementById('resultSection');
    const newCalculationBtn = document.getElementById('newCalculationBtn');
    const methodSelect = document.getElementById('method');
    const questionGroup = document.getElementById('questionGroup');
    const runeNumberGroup = document.getElementById('runeNumberGroup');
    const birthDateGroup = document.getElementById('birthDateGroup');

    methodSelect.addEventListener('change', function() {
        questionGroup.style.display = 'block';
        runeNumberGroup.style.display = 'none';
        birthDateGroup.style.display = 'none';

        if (this.value === 'single') {
            runeNumberGroup.style.display = 'block';
        } else if (this.value === 'birth') {
            birthDateGroup.style.display = 'block';
        }
    });

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = {
            method: methodSelect.value,
            question: document.getElementById('question').value
        };

        if (formData.method === 'single') {
            formData.runeNumber = parseInt(document.getElementById('runeNumber').value);
            if (isNaN(formData.runeNumber) || formData.runeNumber < 1 || formData.runeNumber > 24) {
                alert('Пожалуйста, введите номер руны от 1 до 24');
                return;
            }
        } else if (formData.method === 'birth') {
            formData.birthDate = document.getElementById('birthDate').value;
            if (!formData.birthDate) {
                alert('Пожалуйста, введите дату рождения');
                return;
            }
        }

        loadingSpinner.style.display = 'block';
        form.style.opacity = '0.5';
        form.style.pointerEvents = 'none';

        try {
            const response = await fetch('/api/calculate/runes', {
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
        questionGroup.style.display = 'block';
        runeNumberGroup.style.display = 'none';
        birthDateGroup.style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

function displayResults(data) {
    document.getElementById('resultMethod').textContent = data.method;
    document.getElementById('resultQuestion').textContent = data.question || '—';

    const runesDisplay = document.getElementById('runesDisplay');
    runesDisplay.innerHTML = '';

    data.runes.forEach((rune, index) => {
        const runeCard = document.createElement('div');
        runeCard.className = 'rune-card';
        runeCard.innerHTML = `
            <div class="rune-symbol">${rune.symbol}</div>
            <div class="rune-name">${rune.name}</div>
            <div class="rune-meaning">${rune.meaning}</div>
        `;
        runesDisplay.appendChild(runeCard);
    });

    const runesInterpretation = document.getElementById('runesInterpretation');
    runesInterpretation.innerHTML = '';

    data.runes.forEach((rune, index) => {
        const runeDetail = document.createElement('div');
        runeDetail.className = 'rune-detail';
        runeDetail.innerHTML = `
            <h4>${rune.symbol} ${rune.name} — ${rune.meaning}</h4>
            <p><strong>Толкование:</strong> ${rune.interpretation}</p>
            <p><strong>В гадании:</strong> ${rune.divination}</p>
            <p><strong>Совет:</strong> ${rune.advice}</p>
        `;
        runesInterpretation.appendChild(runeDetail);
    });

    document.getElementById('layoutDescription').textContent = data.layout;
    document.getElementById('interpretationText').innerHTML = data.interpretation;
}