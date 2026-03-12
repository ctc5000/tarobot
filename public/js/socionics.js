document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('socionicsForm');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const resultSection = document.getElementById('resultSection');
    const newCalculationBtn = document.getElementById('newCalculationBtn');
    const testTypeSelect = document.getElementById('testType');
    const testQuestions = document.getElementById('testQuestions');

    if (!form) {
        console.error('Форма соционики не найдена!');
        return;
    }
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
    testTypeSelect.addEventListener('change', function() {
        testQuestions.style.display = this.value === 'test' ? 'block' : 'none';
    });

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('📤 Отправка формы соционики');

        const fullName = document.getElementById('fullName').value.trim();
        const birthDate = document.getElementById('birthDate').value.trim();

        if (!fullName || !birthDate) {
            showNotification('❌ Пожалуйста, заполните все поля', 'error');
            return;
        }

        if (!isValidDate(birthDate)) {
            showNotification('❌ Неверный формат даты. Используйте ДД.ММ.ГГГГ', 'error');
            return;
        }

        const formData = {
            fullName: fullName,
            birthDate: birthDate,
            method: testTypeSelect.value,
            question: document.getElementById('question').value.trim()
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
            console.log('📡 Отправка запроса на сервер:', formData);

            const response = await fetch('/api/calculate/socionics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const responseData = await response.json();
            console.log('📊 Данные от сервера:', responseData);

            if (responseData.success && responseData.data) {
                // Сохраняем данные для отладки
                window.lastSocionicsData = responseData.data;

                // ИЗМЕНЕНИЕ: Передаем responseData.data (содержит полные данные)
                // а не responseData.data.data
                displayResults(responseData.data);
                resultSection.style.display = 'block';

                setTimeout(() => {
                    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);

                form.style.display = 'none';
                showNotification('✅ Тип определен!', 'success');
            } else {
                showNotification('❌ Ошибка: ' + (responseData.error || 'Неизвестная ошибка'), 'error');
                form.style.opacity = '1';
                form.style.pointerEvents = 'auto';
            }
        } catch (error) {
            console.error('❌ Ошибка:', error);
            showNotification('❌ Ошибка при подключении к серверу: ' + error.message, 'error');
            form.style.opacity = '1';
            form.style.pointerEvents = 'auto';
        } finally {
            loadingSpinner.style.display = 'none';
        }
    });

    newCalculationBtn.addEventListener('click', function() {
        resultSection.style.display = 'none';
        form.style.display = 'block';
        form.reset();
        testQuestions.style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        showNotification('✨ Готов к новому расчету', 'info');
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

    function showNotification(message, type = 'info') {
        console.log(`[${type}] ${message}`);

        const notification = document.createElement('div');
        notification.className = `notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            background: ${type === 'error' ? 'rgba(244, 67, 54, 0.95)' :
            type === 'success' ? 'rgba(76, 175, 80, 0.95)' :
                'rgba(33, 33, 33, 0.95)'};
            color: white;
            border-radius: 8px;
            z-index: 9999;
            animation: slideIn 0.3s ease;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            backdrop-filter: blur(5px);
            border: 1px solid rgba(255,255,255,0.1);
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
});

function displayResults(data) {
    console.log('📊 Отображение результатов соционики (внутренние данные):', data);

    try {
        // Проверяем, что data существует
        if (!data) {
            console.error('❌ Нет данных для отображения');
            return;
        }

        // ИЗМЕНЕНИЕ: Проверяем, может быть data содержит data внутри себя?
        // Если data.data существует и содержит type, значит структура вложенная
        if (data.data && data.data.type) {
            console.log('📦 Обнаружена вложенная структура, используем data.data');
            data = data.data;
        }

        // Основная информация
        setElementText('resultFullName', data.fullName);

        // Проверяем наличие type
        if (data.type) {
            console.log('✅ Данные типа найдены:', data.type);

            const typeCode = data.type.code || '—';
            const typeName = data.type.name || '—';
            const typeFullName = data.type.fullName || '—';
            const typeDescription = data.type.description || 'Описание отсутствует';
            const typeStrengths = data.type.strengths || '—';
            const typeWeaknesses = data.type.weaknesses || '—';
            const typeCommunication = data.type.communication || '—';
            const typeCareer = data.type.career || '—';
            const dailyForecast = data.dailyForecast || 'Прогноз отсутствует';
            const typeMotto = data.type.motto ? `"${data.type.motto}"` : '—';

            setElementText('typeCode', typeCode);
            setElementText('typeName', typeName);
            setElementText('typeFullName', typeFullName);
            setElementText('typeDescription', typeDescription);
            setElementText('typeStrengths', typeStrengths);
            setElementText('typeWeaknesses', typeWeaknesses);
            setElementText('typeCommunication', typeCommunication);
            setElementText('typeCareer', typeCareer);
            setElementText('dailyForecast', dailyForecast);
            setElementText('typeMotto', typeMotto);

            // Ключевые черты
            const traitsDiv = document.getElementById('typeTraits');
            if (traitsDiv) {
                traitsDiv.innerHTML = '';
                if (data.type.traits && Array.isArray(data.type.traits) && data.type.traits.length > 0) {
                    data.type.traits.forEach(trait => {
                        const span = document.createElement('span');
                        span.className = 'trait';
                        span.textContent = trait;
                        span.style.cssText = `
                            display: inline-block;
                            background: rgba(201, 165, 75, 0.1);
                            border: 1px solid rgba(201, 165, 75, 0.3);
                            padding: 5px 12px;
                            margin: 4px;
                            border-radius: 20px;
                            font-size: 0.9rem;
                            color: #e5e5e5;
                        `;
                        traitsDiv.appendChild(span);
                    });
                } else {
                    traitsDiv.innerHTML = '<p>—</p>';
                }
            }

            // Квадра
            const quadraInfo = document.getElementById('quadraInfo');
            if (quadraInfo) {
                const quadra = data.type.quadra || '';
                const role = data.type.role || '';
                quadraInfo.innerHTML = quadra ? `<strong>${quadra}:</strong> ${role}` : '—';
            }

            // Модель А
            const modelASection = document.getElementById('modelASection');
            const modelAContent = document.getElementById('modelAContent');
            if (modelASection && modelAContent) {
                const functions = [
                    data.type.function1,
                    data.type.function2,
                    data.type.function3,
                    data.type.function4,
                    data.type.function5,
                    data.type.function6,
                    data.type.function7,
                    data.type.function8
                ].filter(f => f && f.trim() !== '');

                if (functions.length > 0) {
                    modelASection.style.display = 'block';
                    modelAContent.innerHTML = functions.map(f => `<p>${f}</p>`).join('');
                } else {
                    modelASection.style.display = 'none';
                }
            }

            // Известные представители
            const famousSection = document.getElementById('famousSection');
            const famousList = document.getElementById('famousList');
            if (famousSection && famousList && data.type.famous) {
                famousSection.style.display = 'block';
                famousList.textContent = data.type.famous;
            }
        } else {
            console.warn('⚠️ В данных отсутствует поле type. Доступные поля:', Object.keys(data));
        }

        // Совместимость
        if (data.compatibility) {
            const compatibilityGrid = document.getElementById('compatibilityGrid');
            if (compatibilityGrid) {
                const dual = data.compatibility.dual || {};
                const activator = data.compatibility.activator || {};
                const mirror = data.compatibility.mirror || {};
                const conflict = data.compatibility.conflict || {};

                compatibilityGrid.innerHTML = `
                    <div class="compatibility-item dual">
                        <strong>✨ Дуал:</strong> ${dual.name || '—'} (${dual.code || '—'})<br>
                        <small>${dual.description || 'Нет описания'}</small>
                    </div>
                    <div class="compatibility-item activator">
                        <strong>⚡ Активатор:</strong> ${activator.name || '—'} (${activator.code || '—'})<br>
                        <small>${activator.description || 'Нет описания'}</small>
                    </div>
                    <div class="compatibility-item mirror">
                        <strong>🪞 Зеркальный:</strong> ${mirror.name || '—'} (${mirror.code || '—'})<br>
                        <small>${mirror.description || 'Нет описания'}</small>
                    </div>
                    <div class="compatibility-item conflict">
                        <strong>⚠️ Конфликтный:</strong> ${conflict.name || '—'} (${conflict.code || '—'})<br>
                        <small>${conflict.description || 'Нет описания'}</small>
                    </div>
                `;
            }
        }

        // Рекомендации по развитию
        const developmentDiv = document.getElementById('developmentAdvice');
        if (developmentDiv && data.development && Array.isArray(data.development)) {
            developmentDiv.innerHTML = '';
            data.development.forEach((advice, index) => {
                if (advice) {
                    const p = document.createElement('p');
                    p.textContent = `${index + 1}. ${advice}`;
                    p.style.cssText = `
                        margin: 10px 0;
                        padding: 12px 15px;
                        background: rgba(201, 165, 75, 0.05);
                        border-radius: 8px;
                        border-left: 3px solid #c9a54b;
                        color: #e5e5e5;
                    `;
                    developmentDiv.appendChild(p);
                }
            });
        }

        // Интерпретация (если нужно показать)
        const interpretationText = document.getElementById('interpretationText');
        if (interpretationText && data.interpretation) {
            interpretationText.innerHTML = data.interpretation.replace(/\n/g, '<br>');
        }

    } catch (error) {
        console.error('❌ Ошибка при отображении результатов:', error);
        console.error('📄 Данные, вызвавшие ошибку:', JSON.stringify(data, null, 2));
        showNotification('❌ Ошибка при отображении результатов. Проверьте консоль.', 'error');
    }
}

function setElementText(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value !== undefined && value !== null ? value : '—';
    } else {
        console.warn(`⚠️ Элемент с id "${id}" не найден`);
    }
}

function showNotification(message, type) {
    console.log(`[${type}] ${message}`);
}