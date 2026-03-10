document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('ichingForm');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const resultSection = document.getElementById('resultSection');
    const newCalculationBtn = document.getElementById('newCalculationBtn');
    const methodSelect = document.getElementById('method');
    const coinTossSection = document.getElementById('coinTossSection');

    // Создаем поля для броска монет
    function createCoinTosses() {
        const container = document.getElementById('coinTosses');
        container.innerHTML = '';

        for (let i = 1; i <= 6; i++) {
            const lineDiv = document.createElement('div');
            lineDiv.className = 'coin-line';
            lineDiv.innerHTML = `
                <div class="coin-label">Линия ${i}</div>
                <div class="coin-options">
                    <label class="coin-option">
                        <input type="radio" name="line${i}" value="3,0,0"> 🪙🪙🪙 (3 орла)
                    </label>
                    <label class="coin-option">
                        <input type="radio" name="line${i}" value="2,1,0"> 🪙🪙 (2 орла, 1 решка)
                    </label>
                    <label class="coin-option">
                        <input type="radio" name="line${i}" value="1,2,0"> 🪙 (1 орел, 2 решки)
                    </label>
                    <label class="coin-option">
                        <input type="radio" name="line${i}" value="0,3,0"> 0 орлов (3 решки)
                    </label>
                </div>
            `;
            container.appendChild(lineDiv);
        }
    }

    createCoinTosses();

    methodSelect.addEventListener('change', function() {
        if (this.value === 'coins') {
            coinTossSection.style.display = 'block';
        } else {
            coinTossSection.style.display = 'none';
        }
    });

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = {
            question: document.getElementById('question').value,
            method: methodSelect.value,
            date: document.getElementById('date').value
        };

        if (formData.method === 'coins') {
            const coins = [];
            for (let i = 1; i <= 6; i++) {
                const selected = document.querySelector(`input[name="line${i}"]:checked`);
                if (!selected) {
                    alert(`Пожалуйста, выберите результат для линии ${i}`);
                    return;
                }
                const values = selected.value.split(',').map(Number);
                coins.push(values);
            }
            formData.coins = coins;
        }

        loadingSpinner.style.display = 'block';
        form.style.opacity = '0.5';
        form.style.pointerEvents = 'none';

        try {
            const response = await fetch('/api/calculate/iching', {
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
    document.getElementById('resultDate').textContent = data.date;

    document.getElementById('primaryNumber').textContent = data.primary.number;
    document.getElementById('primaryName').textContent = data.primary.name;
    document.getElementById('primaryChinese').textContent = data.primary.chinese;
    document.getElementById('primaryDescription').textContent = data.primary.description;
    document.getElementById('primaryMeaning').textContent = data.primary.meaning;
    document.getElementById('primaryImage').textContent = data.primary.image;

    if (data.primary.changingLines && data.primary.changingLines.length > 0) {
        const changingLinesDiv = document.getElementById('changingLines');
        changingLinesDiv.innerHTML = '<h4>Изменяющиеся линии:</h4>';
        data.primary.changingLines.forEach(line => {
            const p = document.createElement('p');
            p.innerHTML = `<strong>Линия ${line}:</strong> ${data.primary.lines[line-1]}`;
            changingLinesDiv.appendChild(p);
        });
    }

    if (data.secondary) {
        document.getElementById('secondarySection').style.display = 'block';
        document.getElementById('secondaryNumber').textContent = data.secondary.number;
        document.getElementById('secondaryName').textContent = data.secondary.name;
        document.getElementById('secondaryDescription').textContent = data.secondary.description;
        document.getElementById('secondaryMeaning').textContent = data.secondary.meaning;
    } else {
        document.getElementById('secondarySection').style.display = 'none';
    }

    document.getElementById('interpretationText').innerHTML = data.interpretation;
}