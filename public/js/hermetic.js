document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('hermeticForm');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const resultSection = document.getElementById('resultSection');
    const newCalculationBtn = document.getElementById('newCalculationBtn');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = {
            principleNumber: document.getElementById('principleNumber').value ?
                parseInt(document.getElementById('principleNumber').value) : null,
            question: document.getElementById('question').value,
            birthDate: document.getElementById('birthDate').value
        };

        loadingSpinner.style.display = 'block';
        form.style.opacity = '0.5';
        form.style.pointerEvents = 'none';

        try {
            const response = await fetch('/api/calculate/hermetic', {
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
    document.getElementById('principleName').textContent = `${data.principle.number}. ${data.principle.name}`;
    document.getElementById('principleLatin').textContent = data.principle.latin;
    document.getElementById('principleDescription').textContent = data.principle.description;
    document.getElementById('principleTeaching').textContent = data.principle.teaching;
    document.getElementById('principleApplication').textContent = data.principle.application;
    document.getElementById('principleAffirmation').textContent = `"${data.principle.affirmation}"`;

    document.getElementById('rhythmInfo').innerHTML = `
        <p><strong>Фаза:</strong> ${data.rhythm.phase}</p>
        <p><strong>Направление:</strong> ${data.rhythm.direction}</p>
        <p>${data.rhythm.advice}</p>
    `;

    document.getElementById('polarityInfo').innerHTML = `
        <p>${data.polarity.explanation || 'Осознайте единство противоположностей в вашей ситуации.'}</p>
    `;

    document.getElementById('causalityInfo').innerHTML = `
        <p>${data.causality.explanation || 'Всё, что происходит в вашей жизни, имеет причину.'}</p>
    `;

    document.getElementById('interpretationText').innerHTML = data.interpretation;
}