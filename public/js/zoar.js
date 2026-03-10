document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('zoarForm');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const resultSection = document.getElementById('resultSection');
    const newCalculationBtn = document.getElementById('newCalculationBtn');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = {
            question: document.getElementById('question').value,
            sefiraNumber: document.getElementById('sefiraNumber').value ?
                parseInt(document.getElementById('sefiraNumber').value) : null,
            birthDate: document.getElementById('birthDate').value,
            name: document.getElementById('name').value
        };

        loadingSpinner.style.display = 'block';
        form.style.opacity = '0.5';
        form.style.pointerEvents = 'none';

        try {
            const response = await fetch('/api/calculate/zoar', {
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
    document.getElementById('sefiraName').textContent = `${data.centralSefira.name} (${data.centralSefira.meaning})`;
    document.getElementById('sefiraNumber').textContent = data.centralSefira.number;
    document.getElementById('sefiraDescription').textContent = data.centralSefira.description;
    document.getElementById('sefiraColor').textContent = data.centralSefira.color;
    document.getElementById('sefiraPlanet').textContent = data.centralSefira.planet;
    document.getElementById('sefiraArchangel').textContent = data.centralSefira.archangel;
    document.getElementById('sefiraVirtue').textContent = data.centralSefira.virtue;
    document.getElementById('sefiraVice').textContent = data.centralSefira.vice;

    const pathsInfo = document.getElementById('pathsInfo');
    pathsInfo.innerHTML = `
        <h5>Входящие пути:</h5>
        ${data.path.incoming.map(p => `<p>• Из ${p.from} (буква ${p.letter}, ${p.element})</p>`).join('') || '<p>Нет входящих путей</p>'}
        <h5>Исходящие пути:</h5>
        ${data.path.outgoing.map(p => `<p>• К ${p.to} (буква ${p.letter}, ${p.element})</p>`).join('') || '<p>Нет исходящих путей</p>'}
    `;

    const balanceInfo = document.getElementById('balanceInfo');
    balanceInfo.innerHTML = '';
    data.balance.slice(0, 5).forEach(b => {
        const p = document.createElement('p');
        p.innerHTML = `<strong>${b.sefira}:</strong> ${b.level}`;
        balanceInfo.appendChild(p);
    });

    document.getElementById('archangelsInfo').innerHTML = `
        <p><strong>Главный архангел:</strong> ${data.archangels.main}</p>
        <p><strong>Помощники:</strong> ${data.archangels.helpers.join(', ')}</p>
        <p><em>${data.archangels.message}</em></p>
    `;

    document.getElementById('meditationText').innerHTML = data.meditation;
    document.getElementById('interpretationText').innerHTML = data.interpretation;
}