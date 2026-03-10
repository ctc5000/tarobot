document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('rodologyForm');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const resultSection = document.getElementById('resultSection');
    const newCalculationBtn = document.getElementById('newCalculationBtn');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = {
            fullName: document.getElementById('fullName').value,
            birthDate: document.getElementById('birthDate').value,
            gender: document.getElementById('gender').value,
            birthOrder: document.getElementById('birthOrder').value,
            siblingsCount: document.getElementById('siblingsCount').value,
            parentsInfo: {
                father: {
                    name: document.getElementById('fatherName').value,
                    birthDate: document.getElementById('fatherBirth').value
                },
                mother: {
                    name: document.getElementById('motherName').value,
                    birthDate: document.getElementById('motherBirth').value
                }
            },
            grandparentsInfo: {
                paternal: {
                    grandfather: document.getElementById('paternalGrandfather').value,
                    grandmother: document.getElementById('paternalGrandmother').value
                },
                maternal: {
                    grandfather: document.getElementById('maternalGrandfather').value,
                    grandmother: document.getElementById('maternalGrandmother').value
                }
            }
        };

        if (!isValidDate(formData.birthDate)) {
            alert('Пожалуйста, введите корректную дату рождения');
            return;
        }

        loadingSpinner.style.display = 'block';
        form.style.opacity = '0.5';
        form.style.pointerEvents = 'none';

        try {
            const response = await fetch('/api/calculate/rodology', {
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
    if (!dateStr) return true;
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
    document.getElementById('resultBirthDate').textContent = data.birthDate;

    document.getElementById('birthOrderInfo').innerHTML = `
        <p><strong>Порядок рождения:</strong> ${data.birthOrder.role}</p>
        <p>${data.birthOrder.description}</p>
    `;

    const programsList = document.getElementById('programsList');
    programsList.innerHTML = '';
    data.programs.forEach(program => {
        const p = document.createElement('p');
        p.innerHTML = `<strong>${program.type}:</strong> ${program.description}`;
        programsList.appendChild(p);
    });

    const strengthsList = document.getElementById('strengthsList');
    strengthsList.innerHTML = '';
    data.strengths.forEach(strength => {
        const p = document.createElement('p');
        p.innerHTML = `✓ ${strength}`;
        strengthsList.appendChild(p);
    });

    const karmicList = document.getElementById('karmicNodes');
    karmicList.innerHTML = '';
    data.karmicNodes.forEach(node => {
        const p = document.createElement('p');
        p.innerHTML = `<strong>${node.node}:</strong> ${node.description}`;
        karmicList.appendChild(p);
    });

    const tasksList = document.getElementById('tasksList');
    tasksList.innerHTML = '';
    data.tasks.forEach(task => {
        const p = document.createElement('p');
        p.innerHTML = `<strong>${task.task}:</strong> ${task.description}`;
        tasksList.appendChild(p);
    });

    document.getElementById('ancestorsMessage').innerHTML = data.ancestors.connection;
    document.getElementById('interpretationText').innerHTML = data.interpretation;
}