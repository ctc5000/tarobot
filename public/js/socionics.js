document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('socionicsForm');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const resultSection = document.getElementById('resultSection');
    const newCalculationBtn = document.getElementById('newCalculationBtn');
    const testTypeSelect = document.getElementById('testType');
    const testQuestions = document.getElementById('testQuestions');

    testTypeSelect.addEventListener('change', function() {
        if (this.value === 'test') {
            testQuestions.style.display = 'block';
        } else {
            testQuestions.style.display = 'none';
        }
    });

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = {
            fullName: document.getElementById('fullName').value,
            birthDate: document.getElementById('birthDate').value,
            method: testTypeSelect.value,
            question: document.getElementById('question').value
        };

        if (formData.method === 'test') {
            formData.answers = {
                q1: parseInt(document.getElementById('q1').value),
                q2: parseInt(document.getElementById('q2').value),
                q3: parseInt(document.getElementById('q3').value),
                q4: parseInt(document.getElementById('q4').value)
            };
        }

        loadingSpinner.style.display = 'block';
        form.style.opacity = '0.5';
        form.style.pointerEvents = 'none';

        try {
            const response = await fetch('/api/calculate/socionics', {
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
        testQuestions.style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

function displayResults(data) {
    document.getElementById('resultFullName').textContent = data.fullName;

    document.getElementById('typeCode').textContent = data.type.code;
    document.getElementById('typeName').textContent = data.type.name;
    document.getElementById('typeFullName').textContent = data.type.fullName;
    document.getElementById('typeDescription').textContent = data.type.description;

    const traitsDiv = document.getElementById('typeTraits');
    traitsDiv.innerHTML = '';
    data.type.traits.forEach(trait => {
        const span = document.createElement('span');
        span.className = 'trait';
        span.textContent = trait;
        traitsDiv.appendChild(span);
    });

    document.getElementById('typeStrengths').textContent = data.type.strengths;
    document.getElementById('typeWeaknesses').textContent = data.type.weaknesses;
    document.getElementById('typeCommunication').textContent = data.type.communication;
    document.getElementById('typeCareer').textContent = data.type.career;

    document.getElementById('quadraInfo').innerHTML = `
        <strong>${data.type.quadra}:</strong> ${data.type.role}
    `;

    const compatibilityGrid = document.getElementById('compatibilityGrid');
    compatibilityGrid.innerHTML = `
        <div class="compatibility-item dual">
            <strong>Дуал:</strong> ${data.compatibility.dual.name} (${data.compatibility.dual.code})<br>
            <small>${data.compatibility.dual.description}</small>
        </div>
        <div class="compatibility-item activator">
            <strong>Активатор:</strong> ${data.compatibility.activator.name} (${data.compatibility.activator.code})<br>
            <small>${data.compatibility.activator.description}</small>
        </div>
        <div class="compatibility-item mirror">
            <strong>Зеркальный:</strong> ${data.compatibility.mirror.name} (${data.compatibility.mirror.code})<br>
            <small>${data.compatibility.mirror.description}</small>
        </div>
        <div class="compatibility-item conflict">
            <strong>Конфликтный:</strong> ${data.compatibility.conflict.name} (${data.compatibility.conflict.code})<br>
            <small>${data.compatibility.conflict.description}</small>
        </div>
    `;

    const developmentDiv = document.getElementById('developmentAdvice');
    developmentDiv.innerHTML = '';
    data.development.forEach(advice => {
        const p = document.createElement('p');
        p.textContent = advice;
        developmentDiv.appendChild(p);
    });

    document.getElementById('dailyForecast').textContent = data.dailyForecast;
    document.getElementById('typeMotto').textContent = `"${data.type.motto}"`;
    document.getElementById('interpretationText').innerHTML = data.interpretation;
}