// /js/numerology.js - ПОЛНАЯ ВЕРСИЯ (без preview)

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔮 Numerology.js загружен');

    const form = document.getElementById('numerologyForm');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const resultSection = document.getElementById('resultSection');
    const newCalculationBtn = document.getElementById('newCalculationBtn');

    if (!form) {
        console.error('❌ Форма не найдена');
        return;
    }

    let dateMask = null;

    // ==================== МАСКА ДЛЯ ДАТЫ ====================
    const birthDateInput = document.getElementById('birthDate');
    if (birthDateInput && typeof IMask !== 'undefined') {
        dateMask = IMask(birthDateInput, {
            mask: '00.00.0000',
            blocks: {
                dd: { mask: IMask.MaskedRange, from: 1, to: 31, maxLength: 2 },
                mm: { mask: IMask.MaskedRange, from: 1, to: 12, maxLength: 2 },
                yyyy: { mask: IMask.MaskedRange, from: 1900, to: 2100, maxLength: 4 }
            },
            lazy: false,
            autofix: true,
            placeholderChar: '_'
        });
        birthDateInput.value = '';
    }

    // ==================== ОБРАБОТКА ФОРМЫ ====================
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('📤 Форма отправлена');

        const fullName = document.getElementById('fullName').value.trim();
        const birthDate = document.getElementById('birthDate').value.trim();

        if (!validateForm(fullName, birthDate)) return;

        if (loadingSpinner) loadingSpinner.style.display = 'block';
        form.style.opacity = '0.5';
        form.style.pointerEvents = 'none';

        try {
            // Отправляем запрос на сервер (БЕЗ preview)
            const response = await fetch('/api/calculate/numerology', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName, birthDate })
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();

            if (data.success) {
                // Сохраняем данные для дополнительных расчетов
                window.currentNumerologyData = data.data;

                // Отображаем результаты
                displayResults(data.data);

                if (resultSection) {
                    resultSection.style.display = 'block';
                    resultSection.classList.add('fade-in');
                    resultSection.scrollIntoView({ behavior: 'smooth' });
                }

                form.style.display = 'none';
                showNotification('✨ Расчет выполнен!', 'success');

                // Создаем эффект искр
                for (let i = 0; i < 5; i++) {
                    if (window.liveCalculator) {
                        window.liveCalculator.createSparks();
                    }
                }

            } else {
                showNotification('❌ Ошибка: ' + (data.error || 'Неизвестная ошибка'), 'error');
                form.style.opacity = '1';
                form.style.pointerEvents = 'auto';
            }
        } catch (error) {
            console.error('❌ Ошибка:', error);
            showNotification('❌ Ошибка при подключении к серверу: ' + error.message, 'error');
            form.style.opacity = '1';
            form.style.pointerEvents = 'auto';
        } finally {
            if (loadingSpinner) loadingSpinner.style.display = 'none';
        }
    });

    // ==================== НОВЫЙ РАСЧЕТ ====================
    if (newCalculationBtn) {
        newCalculationBtn.addEventListener('click', function() {
            if (resultSection) {
                resultSection.classList.remove('fade-in');
                resultSection.style.display = 'none';
            }
            form.style.display = 'block';
            form.style.opacity = '1';
            form.style.pointerEvents = 'auto';
            form.reset();

            if (dateMask) {
                dateMask.value = '';
            }

            window.scrollTo({ top: 0, behavior: 'smooth' });
            showNotification('✨ Готов к новым открытиям!', 'info');
        });
    }

    // ==================== ТАБЫ (основные) ====================
    const tabBtns = document.querySelectorAll('.tab-btn');
    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const tabId = this.dataset.tab;

                // ВАЖНО: проверяем, что tabId существует
                if (!tabId) {
                    console.warn('⚠️ tabId не определен');
                    return;
                }

                // Деактивируем все кнопки
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

                // Деактивируем все контенты
                document.querySelectorAll('.tab-content').forEach(c => {
                    c.classList.remove('active');
                    c.classList.remove('fade-in');
                });

                // Активируем текущую кнопку
                this.classList.add('active');

                // Формируем ID элемента с проверкой
                const formattedTabId = tabId.charAt(0).toUpperCase() + tabId.slice(1).toLowerCase();
                const tabElement = document.getElementById('tab' + formattedTabId);

                if (tabElement) {
                    tabElement.classList.add('active', 'fade-in');
                    if (window.liveCalculator) {
                        window.liveCalculator.createSparks();
                    }
                } else {
                    console.warn(`⚠️ Элемент с id "tab${formattedTabId}" не найден`);

                    // Пробуем альтернативные варианты (на случай несоответствия регистра)
                    const possibleIds = [
                        'tab' + tabId,
                        'tab' + tabId.toLowerCase(),
                        'tab' + tabId.toUpperCase(),
                        'tab' + tabId.charAt(0).toUpperCase() + tabId.slice(1)
                    ];

                    for (let id of possibleIds) {
                        const altElement = document.getElementById(id);
                        if (altElement) {
                            altElement.classList.add('active', 'fade-in');
                            break;
                        }
                    }
                }
            });
        });
    }

    // Добавляем эффекты
    addFormFieldEffects();
    addResultCardEffects();
});

// ==================== ВАЛИДАЦИЯ ====================
function validateForm(fullName, birthDate) {
    if (!fullName || !birthDate) {
        showNotification('❌ Пожалуйста, заполните все поля', 'error');
        return false;
    }

    if (!isValidDate(birthDate)) {
        showNotification('❌ Пожалуйста, введите дату в формате ДД.ММ.ГГГГ', 'error');
        return false;
    }

    if (fullName.split(/\s+/).length < 3) {
        showNotification('❌ Пожалуйста, введите полное ФИО (фамилия, имя, отчество)', 'error');
        return false;
    }

    return true;
}

function isValidDate(dateStr) {
    if (!dateStr) return false;
    const pattern = /^\d{2}\.\d{2}\.\d{4}$/;
    if (!pattern.test(dateStr)) return false;

    const [day, month, year] = dateStr.split('.').map(Number);

    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;

    const daysInMonth = new Date(year, month, 0).getDate();
    return day <= daysInMonth;
}

// ==================== ОТОБРАЖЕНИЕ РЕЗУЛЬТАТОВ ====================
function displayResults(data) {
    console.log('📊 Отображение результатов:', data);

    try {
        // Основная информация
        setElementText('resultFullName', data.fullName);
        setElementText('resultBirthDate', data.birthDate);

        // ===== НУМЕРОЛОГИЯ =====
        if (data.numerology?.base) {
            setElementText('fateNumber', data.numerology.base.fate);
            setElementText('nameNumber', data.numerology.base.name);
            setElementText('surnameNumber', data.numerology.base.surname);
            setElementText('patronymicNumber', data.numerology.base.patronymic);
        }

        if (data.numerology) {
            setElementText('achillesNumber', data.numerology.achilles?.number);
            setElementText('controlNumber', data.numerology.control?.number);
        }

        if (data.numerology?.calls) {
            setElementText('callClose', data.numerology.calls.close);
            setElementText('callSocial', data.numerology.calls.social);
            setElementText('callWorld', data.numerology.calls.world);

            // Полные описания окликов (генерируются на сервере)
            if (data.numerology.calls.descriptions) {
                setElementText('callCloseDesc', data.numerology.calls.descriptions.close);
                setElementText('callSocialDesc', data.numerology.calls.descriptions.social);
                setElementText('callWorldDesc', data.numerology.calls.descriptions.world);
            }
        }

        // ===== ЗОДИАК =====
        if (data.zodiac) {
            displayZodiac(data.zodiac);
        }

        // ===== ФЕН-ШУЙ =====
        if (data.fengShui) {
            displayFengShui(data.fengShui);
        }

        // ===== ТАРО =====
        if (data.tarot) {
            displayTarot(data.tarot);
        }

        // ===== ПСИХОЛОГИЯ =====
        if (data.psychology) {
            displayPsychology(data.psychology);
        }

        // ===== ПАТТЕРНЫ =====
        if (data.patterns) {
            displayPatterns(data.patterns);
        }

        // ===== ИНТЕРПРЕТАЦИИ =====
        if (data.numerology?.interpretations) {
            displayInterpretations(data.numerology.interpretations);

            // Активируем первую вкладку интерпретаций после загрузки
            setTimeout(() => {
                const firstTab = document.querySelector('.interpretation-tabs .tab-btn');
                if (firstTab) {
                    // Имитируем клик по первой вкладке
                    const event = new Event('click');
                    firstTab.dispatchEvent(event);
                }
            }, 100);
        }

        // ===== ГЛУБИННЫЙ ПОРТРЕТ =====
        if (data.psychology?.portrait) {
            setElementHTML('deepPortrait', formatPortrait(data.psychology.portrait));
        }

    } catch (error) {
        console.error('❌ Ошибка при отображении результатов:', error);
        showNotification('❌ Ошибка при отображении результатов', 'error');
    }
}
// ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ОТОБРАЖЕНИЯ =====

function setElementText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value !== undefined && value !== null ? value : '—';
}

function setElementHTML(id, html) {
    const element = document.getElementById(id);
    if (element) element.innerHTML = html || '<p>—</p>';
}

function setElementAttribute(id, attr, value) {
    const element = document.getElementById(id);
    if (element) element.setAttribute(attr, value);
}

function displayZodiac(zodiac) {
    if (!zodiac) return;
    setElementText('zodiacSymbol', getZodiacSymbol(zodiac.name));
    setElementText('zodiacName', zodiac.name);
    setElementText('zodiacElement', zodiac.element);
    setElementText('zodiacQuality', zodiac.quality || 'Кардинальный');
    setElementText('zodiacPlanet', zodiac.planet || 'Марс');
    setElementText('zodiacDescription', zodiac.description);
    setElementText('zodiacStrengths', zodiac.strengths);
    setElementText('zodiacWeaknesses', zodiac.weaknesses);
    setElementText('zodiacMission', zodiac.lifeMission);
    setElementText('zodiacDeepInsight', zodiac.deepInsight);
}

function displayFengShui(fengShui) {
    if (!fengShui) return;
    setElementText('fengshuiElementSymbol', getElementSymbol(fengShui.elementKey || fengShui.element));
    setElementText('fengshuiElementName', fengShui.element);
    setElementText('fengshuiColor', fengShui.color);
    setElementText('fengshuiDirection', fengShui.direction);
    setElementText('fengshuiSeason', fengShui.season);
    setElementText('fengshuiShape', fengShui.shape || 'Разнообразные');
    setElementText('fengshuiMeaning', fengShui.meaning || 'Гармония с природой');
    setElementText('fengshuiDescription', fengShui.description);
    setElementText('fengshuiActivation', fengShui.activation);
    setElementText('fengshuiPersonalAdvice', fengShui.personalAdvice);
    setElementText('fengshuiAffirmation', fengShui.affirmation || 'Я в гармонии с потоками вселенной');
}

function displayTarot(tarot) {
    if (!tarot) {
        console.warn('Нет данных Таро');
        return;
    }

    console.log('Отображение Таро (данные с сервера):', tarot);

    try {
        // Карта Судьбы
        setElementAttribute('tarotFateImage', 'src', tarot.fate?.image || '/images/tarot/back.jpg');
        setElementText('tarotFateNumber', tarot.fate?.number !== undefined ?
            (tarot.fate.number === 0 ? 22 : tarot.fate.number) : '--');
        setElementText('tarotFateName', tarot.fate?.name || '--');
        setElementText('tarotFateKeywords', tarot.fate?.keywords || '--');
        setElementText('tarotFateDescription', tarot.fate?.description || '--');
        setElementText('tarotFateAdvice', tarot.fate?.advice || '--');

        // Карта Личности
        setElementAttribute('tarotPersonalityImage', 'src', tarot.personality?.image || '/images/tarot/back.jpg');
        setElementText('tarotPersonalityNumber', tarot.personality?.number !== undefined ?
            (tarot.personality.number === 0 ? 22 : tarot.personality.number) : '--');
        setElementText('tarotPersonalityName', tarot.personality?.name || '--');
        setElementText('tarotPersonalityKeywords', tarot.personality?.keywords || '--');
        setElementText('tarotPersonalityDescription', tarot.personality?.description || '--');
        setElementText('tarotPersonalityAdvice', tarot.personality?.advice || '--');

        // Карта Пути
        setElementAttribute('tarotControlImage', 'src', tarot.control?.image || '/images/tarot/back.jpg');
        setElementText('tarotControlNumber', tarot.control?.number !== undefined ?
            (tarot.control.number === 0 ? 22 : tarot.control.number) : '--');
        setElementText('tarotControlName', tarot.control?.name || '--');
        setElementText('tarotControlKeywords', tarot.control?.keywords || '--');
        setElementText('tarotControlDescription', tarot.control?.description || '--');
        setElementText('tarotControlAdvice', tarot.control?.advice || '--');

    } catch (error) {
        console.error('Ошибка при отображении Таро:', error);
    }
}

function displayPsychology(psychology) {
    if (!psychology) return;

    if (psychology.modality) {
        setElementText('modalityTitle', psychology.modality.title);
        setElementText('modalityDescription', psychology.modality.description);
        setElementText('modalityPredicates', psychology.modality.predicates?.join(', '));
        setElementText('modalityAccessKeys', psychology.modality.accessKeys);
    }

    if (psychology.archetype) {
        setElementText('archetypeName', psychology.archetype.name);
        setElementText('archetypeDescription', psychology.archetype.description);
        setElementText('archetypeGift', psychology.archetype.gift);
        setElementText('archetypeChallenge', psychology.archetype.challenge);
        setElementText('archetypeMantra', psychology.archetype.mantra);
    }

    if (psychology.attachment) {
        setElementText('attachmentName', psychology.attachment.name);
        setElementText('attachmentDescription', psychology.attachment.description);
    }
}

function displayPatterns(patterns) {
    const patternsList = document.getElementById('patternsList');
    if (!patternsList) return;

    patternsList.innerHTML = '';

    if (patterns && patterns.length > 0) {
        patterns.forEach(pattern => {
            const p = document.createElement('p');
            p.innerHTML = '✦ ' + pattern;
            patternsList.appendChild(p);
        });
    } else {
        patternsList.innerHTML = '<p>✨ Индивидуальные паттерны формируются в момент вашего запроса</p>';
    }
}

function formatPortrait(portrait) {
    if (!portrait) return '<p>Портрет формируется...</p>';

    let formatted = portrait.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\n/g, '<br>');

    const paragraphs = formatted.split('<br><br>');
    return paragraphs.map(p => `<p>${p}</p>`).join('');
}

function getZodiacSymbol(signName) {
    const symbols = {
        'Овен': '♈', 'Телец': '♉', 'Близнецы': '♊', 'Рак': '♋',
        'Лев': '♌', 'Дева': '♍', 'Весы': '♎', 'Скорпион': '♏',
        'Стрелец': '♐', 'Козерог': '♑', 'Водолей': '♒', 'Рыбы': '♓'
    };
    return symbols[signName] || '⛤';
}

function getElementSymbol(element) {
    const elementLower = String(element || '').toLowerCase();
    const symbols = {
        'металл': '⚜️', 'metal': '⚜️',
        'вода': '🌊', 'water': '🌊',
        'дерево': '🌳', 'wood': '🌳',
        'огонь': '🔥', 'fire': '🔥',
        'земля': '⛰️', 'earth': '⛰️'
    };
    return symbols[elementLower] || '✨';
}

// ==================== ЭФФЕКТЫ ====================

function addFormFieldEffects() {
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.borderColor = 'var(--accent-violet)';
            this.style.boxShadow = '0 0 15px var(--glow-color)';
        });
        input.addEventListener('blur', function() {
            this.style.borderColor = 'var(--medium-purple)';
            this.style.boxShadow = 'none';
        });
    });
}

function addResultCardEffects() {
    const cards = document.querySelectorAll('.grid-item, .special-item, .call-item');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
            this.style.transition = 'transform 0.3s ease';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

// ===== УВЕДОМЛЕНИЯ =====
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
// ===== ОТОБРАЖЕНИЕ ИНТЕРПРЕТАЦИЙ =====
// ===== ОТОБРАЖЕНИЕ ИНТЕРПРЕТАЦИЙ =====
function displayInterpretations(interpretations) {
    if (!interpretations) return;

    console.log('📊 Отображение интерпретаций:', interpretations);

    // Карьера
    if (interpretations.career) {
        displayCareerInterpretation(interpretations.career);
    }

    // Семья
    if (interpretations.family) {
        displayFamilyInterpretation(interpretations.family);
    }

    // Любовь
    if (interpretations.love) {
        displayLoveInterpretation(interpretations.love);
    }

    // Финансы
    if (interpretations.money) {
        displayMoneyInterpretation(interpretations.money);
    }

    // Здоровье
    if (interpretations.health) {
        displayHealthInterpretation(interpretations.health);
    }

    // Таланты
    if (interpretations.talent) {
        displayTalentInterpretation(interpretations.talent);
    }

    // Добавляем обработчики для табов интерпретаций
    setupInterpretationTabs();
}

function displayCareerInterpretation(career) {
    if (!career) return;

    console.log('📊 Отображение карьеры:', career);

    // Основная информация
    setElementText('careerNumber', career.careerNumber);
    setElementText('careerTitle', career.title || 'Карьерный потенциал');
    setElementText('careerDescription', career.description || '');

    // Детальное описание
    const detailedDescElement = document.getElementById('careerDetailedDescription');
    if (detailedDescElement) {
        detailedDescElement.innerHTML = career.detailedDescription || career.description || '';
    }

    // Сильные стороны
    const strengthsList = document.getElementById('careerStrengths');
    if (strengthsList && career.strengths) {
        strengthsList.innerHTML = '';
        career.strengths.forEach(s => {
            const li = document.createElement('li');
            li.innerHTML = s;
            strengthsList.appendChild(li);
        });
    } else if (strengthsList) {
        strengthsList.innerHTML = '<li>—</li>';
    }

    // Зоны роста
    const weaknessesList = document.getElementById('careerWeaknesses');
    if (weaknessesList && career.weaknesses) {
        weaknessesList.innerHTML = '';
        career.weaknesses.forEach(w => {
            const li = document.createElement('li');
            li.innerHTML = w;
            weaknessesList.appendChild(li);
        });
    } else if (weaknessesList) {
        weaknessesList.innerHTML = '<li>—</li>';
    }

    // Подходящие профессии
    const suitableList = document.getElementById('careerSuitable');
    if (suitableList && career.suitable) {
        suitableList.innerHTML = '';
        career.suitable.forEach(p => {
            const li = document.createElement('li');
            li.innerHTML = p;
            suitableList.appendChild(li);
        });
    } else if (suitableList) {
        suitableList.innerHTML = '<li>—</li>';
    }

    // Стиль работы
    setElementText('careerWorkStyle', career.workStyle || '');

    // Подход к деньгам
    setElementText('careerMoneyApproach', career.moneyApproach || '');

    // Стиль управления
    setElementText('careerManagementStyle', career.managementStyle || '');

    // Идеальная среда
    setElementText('careerIdealEnvironment', career.idealEnvironment || '');

    // Факторы успеха
    const successFactorsList = document.getElementById('careerSuccessFactors');
    if (successFactorsList && career.successFactors) {
        successFactorsList.innerHTML = '';
        career.successFactors.forEach(f => {
            const li = document.createElement('li');
            li.innerHTML = f;
            successFactorsList.appendChild(li);
        });
    } else if (successFactorsList) {
        successFactorsList.innerHTML = '<li>—</li>';
    }

    // Факторы риска
    const failureFactorsList = document.getElementById('careerFailureFactors');
    if (failureFactorsList && career.failureFactors) {
        failureFactorsList.innerHTML = '';
        career.failureFactors.forEach(f => {
            const li = document.createElement('li');
            li.innerHTML = f;
            failureFactorsList.appendChild(li);
        });
    } else if (failureFactorsList) {
        failureFactorsList.innerHTML = '<li>—</li>';
    }

    // Путь развития
    setElementText('careerDevelopmentPath', career.developmentPath || career.advice || '');

    // Числа успеха и реализации
    setElementText('careerSuccessNum', career.successNumber);
    setElementText('careerSuccessDesc', career.successDescription || '');
    setElementText('careerRealizationNum', career.realizationNumber);
    setElementText('careerRealizationDesc', career.realizationDescription || '');

    // Совет
    setElementText('careerAdvice', career.advice || '');
}

function displayFamilyInterpretation(family) {
    if (!family) return;

    console.log('📊 Отображение семьи:', family);

    // Основная информация
    setElementText('familyNumber', family.familyNumber);
    setElementText('familyTitle', family.title || 'Семейная гармония');
    setElementText('familyDescription', family.description || '');

    // Детальное описание
    const detailedDescElement = document.getElementById('familyDetailedDescription');
    if (detailedDescElement) {
        detailedDescElement.innerHTML = family.detailedDescription || family.description || '';
    }

    // Роль в семье
    setElementText('familyRole', family.role || '');

    // Сильные стороны
    const strengthsList = document.getElementById('familyStrengths');
    if (strengthsList && family.strengths) {
        strengthsList.innerHTML = '';
        family.strengths.forEach(s => {
            const li = document.createElement('li');
            li.innerHTML = s;
            strengthsList.appendChild(li);
        });
    } else if (strengthsList) {
        strengthsList.innerHTML = '<li>—</li>';
    }

    // Зоны роста
    const weaknessesList = document.getElementById('familyWeaknesses');
    if (weaknessesList && family.weaknesses) {
        weaknessesList.innerHTML = '';
        family.weaknesses.forEach(w => {
            const li = document.createElement('li');
            li.innerHTML = w;
            weaknessesList.appendChild(li);
        });
    } else if (weaknessesList) {
        weaknessesList.innerHTML = '<li>—</li>';
    }

    // Стиль семейной жизни (новое)
    setElementText('familyStyle', family.familyStyle || '');

    // Подход к детям (новое)
    setElementText('familyChildrenApproach', family.childrenApproach || '');

    // Тип идеального партнера (новое)
    setElementText('familyPartnerType', family.partnerType || '');

    // Факторы успеха (новое)
    const successFactorsList = document.getElementById('familySuccessFactors');
    if (successFactorsList && family.successFactors) {
        successFactorsList.innerHTML = '';
        family.successFactors.forEach(f => {
            const li = document.createElement('li');
            li.innerHTML = f;
            successFactorsList.appendChild(li);
        });
    } else if (successFactorsList) {
        successFactorsList.innerHTML = '<li>—</li>';
    }

    // Факторы риска (новое)
    const failureFactorsList = document.getElementById('familyFailureFactors');
    if (failureFactorsList && family.failureFactors) {
        failureFactorsList.innerHTML = '';
        family.failureFactors.forEach(f => {
            const li = document.createElement('li');
            li.innerHTML = f;
            failureFactorsList.appendChild(li);
        });
    } else if (failureFactorsList) {
        failureFactorsList.innerHTML = '<li>—</li>';
    }

    // Путь развития (новое)
    setElementText('familyDevelopmentPath', family.developmentPath || family.advice || '');

    // Числа партнера и детей
    setElementText('familyPartnerNum', family.partnerNumber);
    setElementText('familyPartnerDesc', family.partnerDescription || '');
    setElementText('familyChildrenNum', family.childrenNumber);
    setElementText('familyChildrenDesc', family.childrenDescription || '');

    // Совет
    setElementText('familyAdvice', family.advice || '');
}

function displayLoveInterpretation(love) {
    if (!love) return;

    setElementText('loveNumber', love.loveNumber);
    setElementText('loveTitle', love.title || 'Любовная совместимость');
    setElementText('loveDescription', love.description || '');

    // Детальное описание
    const detailedDescElement = document.getElementById('loveDetailedDescription');
    if (detailedDescElement) {
        detailedDescElement.innerHTML = love.detailedDescription || love.description || '';
    }

    setElementText('loveStyle', love.loveStyle || '');

    // Сильные стороны
    const strengthsList = document.getElementById('loveStrengths');
    if (strengthsList && love.strengths) {
        strengthsList.innerHTML = '';
        love.strengths.forEach(s => {
            const li = document.createElement('li');
            li.innerHTML = s;
            strengthsList.appendChild(li);
        });
    }

    // Зоны роста
    const weaknessesList = document.getElementById('loveWeaknesses');
    if (weaknessesList && love.weaknesses) {
        weaknessesList.innerHTML = '';
        love.weaknesses.forEach(w => {
            const li = document.createElement('li');
            li.innerHTML = w;
            weaknessesList.appendChild(li);
        });
    }

    setElementText('idealPartner', love.idealPartner || '');

    // Тип партнера (новое поле)
    setElementText('lovePartnerType', love.partnerType || '');

    // Отношение к браку (новое поле)
    setElementText('loveMarriageView', love.marriageView || '');

    // Совместимость
    if (love.compatibility !== undefined) {
        const progressBar = document.getElementById('compatibilityProgress');
        if (progressBar) {
            progressBar.style.width = love.compatibility + '%';
        }
        setElementText('compatibilityLevel', love.compatibilityLevel || `Совместимость: ${love.compatibility}%`);
    }

    // Путь развития (новое поле)
    setElementText('loveDevelopmentPath', love.developmentPath || love.advice || '');

    // Факторы успеха (новое поле)
    const successFactorsList = document.getElementById('loveSuccessFactors');
    if (successFactorsList && love.successFactors) {
        successFactorsList.innerHTML = '';
        love.successFactors.forEach(f => {
            const li = document.createElement('li');
            li.innerHTML = f;
            successFactorsList.appendChild(li);
        });
    }

    // Факторы риска (новое поле)
    const failureFactorsList = document.getElementById('loveFailureFactors');
    if (failureFactorsList && love.failureFactors) {
        failureFactorsList.innerHTML = '';
        love.failureFactors.forEach(f => {
            const li = document.createElement('li');
            li.innerHTML = f;
            failureFactorsList.appendChild(li);
        });
    }

    setElementText('loveAdvice', love.advice || '');
}

function displayMoneyInterpretation(money) {
    if (!money) return;

    console.log('📊 Отображение финансов:', money);

    // Основная информация
    setElementText('moneyNumber', money.moneyNumber);
    setElementText('moneyTitle', money.title || 'Финансовый поток');
    setElementText('moneyDescription', money.description || '');

    // Детальное описание
    const detailedDescElement = document.getElementById('moneyDetailedDescription');
    if (detailedDescElement) {
        detailedDescElement.innerHTML = money.detailedDescription || money.description || '';
    }

    // Финансовый стиль
    setElementText('moneyStyle', money.moneyStyle || '');

    // Сильные стороны
    const strengthsList = document.getElementById('moneyStrengths');
    if (strengthsList && money.strengths) {
        strengthsList.innerHTML = '';
        money.strengths.forEach(s => {
            const li = document.createElement('li');
            li.innerHTML = s;
            strengthsList.appendChild(li);
        });
    } else if (strengthsList) {
        strengthsList.innerHTML = '<li>—</li>';
    }

    // Зоны роста
    const weaknessesList = document.getElementById('moneyWeaknesses');
    if (weaknessesList && money.weaknesses) {
        weaknessesList.innerHTML = '';
        money.weaknesses.forEach(w => {
            const li = document.createElement('li');
            li.innerHTML = w;
            weaknessesList.appendChild(li);
        });
    } else if (weaknessesList) {
        weaknessesList.innerHTML = '<li>—</li>';
    }

    // Источники дохода
    const sourcesList = document.getElementById('moneySources');
    if (sourcesList && money.sources) {
        sourcesList.innerHTML = '';
        money.sources.forEach(s => {
            const li = document.createElement('li');
            li.innerHTML = s;
            sourcesList.appendChild(li);
        });
    } else if (sourcesList) {
        sourcesList.innerHTML = '<li>—</li>';
    }

    // Финансовая стратегия (новое)
    setElementText('moneyStrategy', money.moneyStrategy || '');

    // Отношение к риску (новое)
    setElementText('moneyRiskAttitude', money.riskAttitude || '');

    // Лучшие инвестиции (новое)
    const investmentsList = document.getElementById('moneyInvestments');
    if (investmentsList && money.bestInvestments) {
        investmentsList.innerHTML = '';
        money.bestInvestments.forEach(i => {
            const li = document.createElement('li');
            li.innerHTML = i;
            investmentsList.appendChild(li);
        });
    } else if (investmentsList) {
        investmentsList.innerHTML = '<li>—</li>';
    }

    // Факторы успеха (новое)
    const successFactorsList = document.getElementById('moneySuccessFactors');
    if (successFactorsList && money.successFactors) {
        successFactorsList.innerHTML = '';
        money.successFactors.forEach(f => {
            const li = document.createElement('li');
            li.innerHTML = f;
            successFactorsList.appendChild(li);
        });
    } else if (successFactorsList) {
        successFactorsList.innerHTML = '<li>—</li>';
    }

    // Факторы риска (новое)
    const failureFactorsList = document.getElementById('moneyFailureFactors');
    if (failureFactorsList && money.failureFactors) {
        failureFactorsList.innerHTML = '';
        money.failureFactors.forEach(f => {
            const li = document.createElement('li');
            li.innerHTML = f;
            failureFactorsList.appendChild(li);
        });
    } else if (failureFactorsList) {
        failureFactorsList.innerHTML = '<li>—</li>';
    }

    // Путь развития (новое)
    setElementText('moneyDevelopmentPath', money.developmentPath || money.advice || '');

    // Число изобилия
    setElementText('moneyAbundanceNum', money.abundanceNumber);
    setElementText('moneyAbundanceDesc', money.abundanceDescription || '');

    // Совет
    setElementText('moneyAdvice', money.advice || '');
}

function displayHealthInterpretation(health) {
    if (!health) return;

    setElementText('healthNumber', health.healthNumber);
    setElementText('healthTitle', health.title || 'Энергия здоровья');
    setElementText('healthDescription', health.description || '');

    // Детальное описание
    const detailedDescElement = document.getElementById('healthDetailedDescription');
    if (detailedDescElement) {
        detailedDescElement.innerHTML = health.detailedDescription || health.description || '';
    }

    // Энергия
    if (health.energyLevel !== undefined) {
        const energyProgress = document.getElementById('energyProgress');
        if (energyProgress) {
            const percent = (health.energyLevel / 10) * 100;
            energyProgress.style.width = percent + '%';
        }
        setElementText('energyLevel', `Уровень энергии: ${health.energyLevel}/10`);
    }

    // Сильные стороны
    const strengthsList = document.getElementById('healthStrengths');
    if (strengthsList && health.strengths) {
        strengthsList.innerHTML = '';
        health.strengths.forEach(s => {
            const li = document.createElement('li');
            li.innerHTML = s;
            strengthsList.appendChild(li);
        });
    }

    // Зоны роста
    const weaknessesList = document.getElementById('healthWeaknesses');
    if (weaknessesList && health.weaknesses) {
        weaknessesList.innerHTML = '';
        health.weaknesses.forEach(w => {
            const li = document.createElement('li');
            li.innerHTML = w;
            weaknessesList.appendChild(li);
        });
    }

    // Уязвимые органы
    const vulnerableList = document.getElementById('healthVulnerable');
    if (vulnerableList && health.vulnerable) {
        vulnerableList.innerHTML = '';
        health.vulnerable.forEach(v => {
            const li = document.createElement('li');
            li.innerHTML = v;
            vulnerableList.appendChild(li);
        });
    }

    // Рекомендации
    const recommendationsList = document.getElementById('healthRecommendations');
    if (recommendationsList && health.recommendations) {
        recommendationsList.innerHTML = '';
        health.recommendations.forEach(r => {
            const li = document.createElement('li');
            li.innerHTML = r;
            recommendationsList.appendChild(li);
        });
    }

    // Тип энергетики (новое поле)
    setElementText('healthEnergyType', health.energyType || '');

    // Риски по сезонам (новое поле)
    setElementText('healthSeasonalRisks', health.seasonalRisks || '');

    // Профилактика (новое поле)
    const preventionList = document.getElementById('healthPrevention');
    if (preventionList && health.prevention) {
        preventionList.innerHTML = '';
        health.prevention.forEach(p => {
            const li = document.createElement('li');
            li.innerHTML = p;
            preventionList.appendChild(li);
        });
    }

    // Путь развития (новое поле)
    setElementText('healthDevelopmentPath', health.developmentPath || health.advice || '');

    // Факторы успеха (новое поле)
    const successFactorsList = document.getElementById('healthSuccessFactors');
    if (successFactorsList && health.successFactors) {
        successFactorsList.innerHTML = '';
        health.successFactors.forEach(f => {
            const li = document.createElement('li');
            li.innerHTML = f;
            successFactorsList.appendChild(li);
        });
    }

    // Факторы риска (новое поле)
    const failureFactorsList = document.getElementById('healthFailureFactors');
    if (failureFactorsList && health.failureFactors) {
        failureFactorsList.innerHTML = '';
        health.failureFactors.forEach(f => {
            const li = document.createElement('li');
            li.innerHTML = f;
            failureFactorsList.appendChild(li);
        });
    }

    setElementText('healthAdvice', health.advice || '');
}

function displayTalentInterpretation(talent) {
    if (!talent) return;

    setElementText('talentNumber', talent.talentNumber);
    setElementText('talentTitle', talent.title || 'Скрытые таланты');
    setElementText('talentDescription', talent.description || '');

    // Детальное описание
    const detailedDescElement = document.getElementById('talentDetailedDescription');
    if (detailedDescElement) {
        detailedDescElement.innerHTML = talent.detailedDescription || talent.description || '';
    }

    // Таланты
    const talentList = document.getElementById('talentList');
    if (talentList && talent.talents) {
        talentList.innerHTML = '';
        talent.talents.forEach(t => {
            const li = document.createElement('li');
            li.innerHTML = t;
            talentList.appendChild(li);
        });
    }

    setElementText('talentDevelopment', talent.development || '');

    // Сферы реализации
    const suitableList = document.getElementById('talentSuitable');
    if (suitableList && talent.suitable) {
        suitableList.innerHTML = '';
        talent.suitable.forEach(s => {
            const li = document.createElement('li');
            li.innerHTML = s;
            suitableList.appendChild(li);
        });
    }

    // Как развивать (новое поле)
    const howToDevelopList = document.getElementById('talentHowToDevelop');
    if (howToDevelopList && talent.howToDevelop) {
        howToDevelopList.innerHTML = '';
        talent.howToDevelop.forEach(h => {
            const li = document.createElement('li');
            li.innerHTML = h;
            howToDevelopList.appendChild(li);
        });
    }

    // С чем сочетается (новое поле)
    setElementText('talentCombinesWith', talent.combinesWith || '');

    // Потенциал
    if (talent.potential !== undefined) {
        const potentialProgress = document.getElementById('potentialProgress');
        if (potentialProgress) {
            potentialProgress.style.width = talent.potential + '%';
        }
        setElementText('potentialDescription', talent.potentialDescription || `Потенциал: ${talent.potential}%`);
    }

    // Путь развития (новое поле)
    setElementText('talentDevelopmentPath', talent.developmentPath || talent.advice || '');

    // Факторы успеха (новое поле)
    const successFactorsList = document.getElementById('talentSuccessFactors');
    if (successFactorsList && talent.successFactors) {
        successFactorsList.innerHTML = '';
        talent.successFactors.forEach(f => {
            const li = document.createElement('li');
            li.innerHTML = f;
            successFactorsList.appendChild(li);
        });
    }

    // Факторы риска (новое поле)
    const failureFactorsList = document.getElementById('talentFailureFactors');
    if (failureFactorsList && talent.failureFactors) {
        failureFactorsList.innerHTML = '';
        talent.failureFactors.forEach(f => {
            const li = document.createElement('li');
            li.innerHTML = f;
            failureFactorsList.appendChild(li);
        });
    }

    setElementText('talentAdvice', talent.advice || '');
}

function setupInterpretationTabs() {
    const tabBtns = document.querySelectorAll('.interpretation-tabs .tab-btn');

    if (!tabBtns.length) return;

    tabBtns.forEach(btn => {
        btn.removeEventListener('click', handleInterpretationTabClick);
        btn.addEventListener('click', handleInterpretationTabClick);
    });

    const hasActive = Array.from(tabBtns).some(btn => btn.classList.contains('active'));
    if (!hasActive && tabBtns.length > 0) {
        tabBtns[0].classList.add('active');
        const firstPane = document.getElementById('interpretation-' + tabBtns[0].dataset.interpretation);
        if (firstPane) {
            firstPane.classList.add('active');
        }
    }
}
function handleInterpretationTabClick(e) {
    const btn = e.currentTarget;
    const interpretation = btn.dataset.interpretation;

    if (!interpretation) return;

    // Деактивируем все кнопки и панели
    document.querySelectorAll('.interpretation-tabs .tab-btn').forEach(b => {
        b.classList.remove('active');
    });
    document.querySelectorAll('.interpretation-pane').forEach(p => {
        p.classList.remove('active');
    });

    // Активируем выбранные
    btn.classList.add('active');
    const pane = document.getElementById('interpretation-' + interpretation);
    if (pane) {
        pane.classList.add('active');

        // Эффект появления
        pane.style.animation = 'none';
        pane.offsetHeight; // reflow
        pane.style.animation = 'fadeIn 0.5s ease';
    }
}

// Добавляем стили для уведомлений
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
