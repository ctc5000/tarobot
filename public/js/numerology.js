document.addEventListener('DOMContentLoaded', function() {
    console.log('Numerology.js загружен'); // Для отладки

    const form = document.getElementById('numerologyForm');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const resultSection = document.getElementById('resultSection');
    const newCalculationBtn = document.getElementById('newCalculationBtn');

    // Проверяем, найден ли form
    if (!form) {
        console.error('Форма с id="numerologyForm" не найдена!');
        return;
    }

    // Обработка отправки формы
    form.addEventListener('submit', async function(e) {
        e.preventDefault(); // ОСТАНОВКА ПЕРЕЗАГРУЗКИ
        console.log('Форма отправлена'); // Для отладки

        const fullName = document.getElementById('fullName').value;
        const birthDate = document.getElementById('birthDate').value;

        console.log('Данные:', { fullName, birthDate }); // Для отладки

        // Валидация
        if (!fullName || !birthDate) {
            alert('Пожалуйста, заполните все поля');
            return;
        }

        if (!isValidDate(birthDate)) {
            alert('Пожалуйста, введите дату в формате ДД.ММ.ГГГГ');
            return;
        }

        if (fullName.split(/\s+/).length < 3) {
            alert('Пожалуйста, введите полное ФИО (фамилия, имя, отчество)');
            return;
        }

        // Показываем загрузку
        loadingSpinner.style.display = 'block';
        form.style.opacity = '0.5';
        form.style.pointerEvents = 'none';

        try {
            const response = await fetch('/api/calculate/numerology', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ fullName, birthDate })
            });

            console.log('Ответ получен:', response.status); // Для отладки

            const data = await response.json();
            console.log('Данные:', data); // Для отладки

            if (data.success) {
                displayResults(data.data);
                resultSection.style.display = 'block';
                resultSection.scrollIntoView({ behavior: 'smooth' });

                // Скрываем форму
                form.style.display = 'none';
            } else {
                alert('Ошибка: ' + (data.error || 'Неизвестная ошибка'));
                form.style.opacity = '1';
                form.style.pointerEvents = 'auto';
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при подключении к серверу. Проверьте консоль для деталей.');
        } finally {
            loadingSpinner.style.display = 'none';
            form.style.opacity = '1';
            form.style.pointerEvents = 'auto';
        }
    });

    // Кнопка нового расчета
    if (newCalculationBtn) {
        newCalculationBtn.addEventListener('click', function() {
            resultSection.style.display = 'none';
            form.style.display = 'block';
            form.reset();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Переключение табов
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.dataset.tab;

            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

            this.classList.add('active');
            const tabElement = document.getElementById('tab' + tabId.charAt(0).toUpperCase() + tabId.slice(1));
            if (tabElement) {
                tabElement.classList.add('active');
            }
        });
    });
});

function isValidDate(dateStr) {
    const pattern = /^\d{2}\.\d{2}\.\d{4}$/;
    if (!pattern.test(dateStr)) return false;

    const [day, month, year] = dateStr.split('.').map(Number);
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;

    const daysInMonth = new Date(year, month, 0).getDate();
    if (day > daysInMonth) return false;

    // Проверка на разумный год
    if (year < 1900 || year > 2100) return false;

    return true;
}

function displayResults(data) {
    console.log('Отображение результатов:', data);

    try {
        // Основная информация
        document.getElementById('resultFullName').textContent = data.fullName || '—';
        document.getElementById('resultBirthDate').textContent = data.birthDate || '—';

        // Базовые числа
        if (data.numerology && data.numerology.base) {
            document.getElementById('fateNumber').textContent = data.numerology.base.fate || '—';
            document.getElementById('nameNumber').textContent = data.numerology.base.name || '—';
            document.getElementById('surnameNumber').textContent = data.numerology.base.surname || '—';
            document.getElementById('patronymicNumber').textContent = data.numerology.base.patronymic || '—';
        }

        // Специальные числа
        if (data.numerology) {
            document.getElementById('achillesNumber').textContent = data.numerology.achilles?.number || '—';
            document.getElementById('controlNumber').textContent = data.numerology.control?.number || '—';
        }

        // Оклики
        if (data.numerology && data.numerology.calls) {
            document.getElementById('callClose').textContent = data.numerology.calls.close || '—';
            document.getElementById('callSocial').textContent = data.numerology.calls.social || '—';
            document.getElementById('callWorld').textContent = data.numerology.calls.world || '—';

            document.getElementById('callCloseDesc').textContent = getCallDescription(data.numerology.calls.close, 'close');
            document.getElementById('callSocialDesc').textContent = getCallDescription(data.numerology.calls.social, 'social');
            document.getElementById('callWorldDesc').textContent = getCallDescription(data.numerology.calls.world, 'world');
        }

        // Отображаем дополнительные данные
        if (data.zodiac) displayZodiac(data.zodiac);
        if (data.fengShui) displayFengShui(data.fengShui);
        if (data.tarot) displayTarot(data.tarot);
        if (data.psychology) displayPsychology(data.psychology);

        // Паттерны
        const patterns = generatePatterns(data);
        displayPatterns(patterns);

        // Полная интерпретация
        const interpretation = generateFullInterpretation(data);
        document.getElementById('interpretationText').innerHTML = interpretation;

        // Глубинный портрет
        if (data.psychology && data.psychology.portrait) {
            document.getElementById('deepPortrait').innerHTML = formatPortrait(data.psychology.portrait);
        }
    } catch (error) {
        console.error('Ошибка при отображении результатов:', error);
    }
}

function displayZodiac(zodiac) {
    const elements = {
        zodiacSymbol: getZodiacSymbol(zodiac.name),
        zodiacName: zodiac.name,
        zodiacElement: zodiac.element,
        zodiacQuality: zodiac.quality || 'Кардинальный',
        zodiacPlanet: zodiac.planet || 'Марс',
        zodiacDescription: zodiac.description,
        zodiacStrengths: zodiac.strengths,
        zodiacWeaknesses: zodiac.weaknesses,
        zodiacMission: zodiac.lifeMission,
        zodiacDeepInsight: zodiac.deepInsight
    };

    Object.entries(elements).forEach(([id, value]) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    });
}

function displayFengShui(fengShui) {
    const elements = {
        fengshuiElementSymbol: getElementSymbol(fengShui.elementKey || fengShui.element),
        fengshuiElementName: fengShui.element,
        fengshuiColor: fengShui.color,
        fengshuiDirection: fengShui.direction,
        fengshuiSeason: fengShui.season,
        fengshuiShape: fengShui.shape || 'Разнообразные',
        fengshuiMeaning: fengShui.meaning || 'Гармония с природой',
        fengshuiDescription: fengShui.description,
        fengshuiActivation: fengShui.activation,
        fengshuiPersonalAdvice: fengShui.personalAdvice,
        fengshuiAffirmation: fengShui.affirmation || 'Я в гармонии с потоками вселенной'
    };

    Object.entries(elements).forEach(([id, value]) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    });
}

function displayTarot(tarot) {
    if (!tarot) return;

    const tarotElements = [
        { prefix: 'Fate', data: tarot.fate },
        { prefix: 'Personality', data: tarot.personality },
        { prefix: 'Control', data: tarot.control }
    ];

    tarotElements.forEach(({ prefix, data }) => {
        if (data) {
            const numberEl = document.getElementById(`tarot${prefix}Number`);
            const nameEl = document.getElementById(`tarot${prefix}Name`);
            const keywordsEl = document.getElementById(`tarot${prefix}Keywords`);
            const descEl = document.getElementById(`tarot${prefix}Description`);
            const adviceEl = document.getElementById(`tarot${prefix}Advice`);

            if (numberEl) numberEl.textContent = data.number || 'X';
            if (nameEl) nameEl.textContent = data.name || '—';
            if (keywordsEl) keywordsEl.textContent = data.keywords || '—';
            if (descEl) descEl.textContent = data.description || '—';
            if (adviceEl) adviceEl.textContent = data.advice || '—';
        }
    });
}

function displayPsychology(psychology) {
    if (!psychology) return;

    if (psychology.modality) {
        document.getElementById('modalityTitle').textContent = psychology.modality.title || '—';
        document.getElementById('modalityDescription').textContent = psychology.modality.description || '—';
        document.getElementById('modalityPredicates').textContent = psychology.modality.predicates ?
            psychology.modality.predicates.join(', ') : '—';
        document.getElementById('modalityAccessKeys').textContent = psychology.modality.accessKeys || '—';
    }

    if (psychology.archetype) {
        document.getElementById('archetypeName').textContent = psychology.archetype.name || '—';
        document.getElementById('archetypeDescription').textContent = psychology.archetype.description || '—';
        document.getElementById('archetypeGift').textContent = psychology.archetype.gift || '—';
        document.getElementById('archetypeChallenge').textContent = psychology.archetype.challenge || '—';
        document.getElementById('archetypeMantra').textContent = psychology.archetype.mantra || '—';
    }

    if (psychology.attachment) {
        document.getElementById('attachmentName').textContent = psychology.attachment.name || '—';
        document.getElementById('attachmentDescription').textContent = psychology.attachment.description || '—';
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

function getCallDescription(num, type) {
    const base = {
        1: 'волевой лидер, инициатор',
        2: 'дипломат, миротворец',
        3: 'творческая натура, душа компании',
        4: 'надежный партнер, строитель',
        5: 'коммуникатор, исследователь',
        6: 'заботливый, ответственный',
        7: 'целеустремленный, победитель',
        8: 'справедливый, авторитетный',
        9: 'мудрый, загадочный',
        10: 'харизматичный лидер',
        11: 'вдохновляющий, сильный',
        12: 'понимающий, принимающий',
        13: 'меняющийся, обновляющийся',
        14: 'гармоничный, уравновешенный',
        15: 'притягательный, страстный',
        16: 'основательный, мощный',
        17: 'окрыленный, верящий',
        18: 'интуитивный, загадочный',
        19: 'солнечный, щедрый',
        20: 'пробуждающий',
        21: 'целостный, завершенный',
        22: 'свободный, легкий'
    };

    const typePrefix = {
        close: 'В кругу семьи вы — ',
        social: 'В коллективе вас видят как ',
        world: 'Незнакомцы воспринимают вас как '
    };

    return typePrefix[type] + (base[num] || 'многогранная личность');
}

function formatPortrait(portrait) {
    if (!portrait) return '<p>Портрет формируется...</p>';

    let formatted = portrait.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\n/g, '<br>');

    const paragraphs = formatted.split('<br><br>');
    return paragraphs.map(p => `<p>${p}</p>`).join('');
}

function generatePatterns(data) {
    const patterns = [];

    if (!data || !data.numerology) {
        patterns.push('💫 Ваш уникальный паттерн формируется...');
        return patterns;
    }

    const { numerology, zodiac, fengShui } = data;
    const { base, achilles, control } = numerology;

    if (!base) return patterns;

    // Анализ дублей
    const counts = {};
    const numbers = [base.fate, base.name, base.surname, base.patronymic].filter(n => n);
    numbers.forEach(n => {
        counts[n] = (counts[n] || 0) + 1;
    });

    Object.entries(counts).forEach(([num, count]) => {
        if (count >= 2) {
            if (num == 8) {
                patterns.push('⚖️ **Усиленная родовая карма** — тема справедливости и закона проходит красной нитью через всю вашу жизнь.');
            } else if (num == 11) {
                patterns.push('🔥 **Двойная харизма** — мощный лидерский потенциал, требующий мудрого управления.');
            } else if (num == 3) {
                patterns.push('🎨 **Творческая энергия в избытке** — потребность в самовыражении ищет выхода.');
            } else {
                patterns.push(`🔮 **Число ${num} повторяется** — энергия этого числа требует особого внимания.`);
            }
        }
    });

    if (patterns.length === 0) {
        patterns.push('✨ **Уникальная комбинация энергий** — вы — творец собственного пути.');
    }

    return patterns;
}

function generateFullInterpretation(data) {
    const { numerology, zodiac } = data;
    const { base, calls } = numerology || {};

    return `
        <div class="interpretation-section">
            <h4>🌟 ЗВЕЗДНЫЙ КОД ЛИЧНОСТИ</h4>
            <p>Твоя душа выбрала этот мир в момент <strong>${data.birthDate || '—'}</strong>. 
            Твое имя <strong>${data.fullName || '—'}</strong> — не случайный набор звуков, а вибрация, которая определяет твой путь.</p>
        </div>
        
        <div class="interpretation-section">
            <h4>🔢 ЧИСЛОВАЯ МАТРИЦА</h4>
            <p>Число судьбы: <strong>${base?.fate || '—'}</strong> — твой компас. 
            Число имени: <strong>${base?.name || '—'}</strong> — твой инструмент. 
            Число рода: <strong>${base?.surname || '—'}</strong> — багаж из прошлого.</p>
        </div>
        
        ${zodiac ? `
        <div class="interpretation-section">
            <h4>♈ АСТРОЛОГИЧЕСКИЙ ПРОФИЛЬ</h4>
            <p>Ты — <strong>${zodiac.name || '—'}</strong> (${zodiac.element || '—'}). 
            ${zodiac.lifeMission || ''}</p>
        </div>
        ` : ''}
        
        <div class="interpretation-section">
            <h4>🎭 ТВОИ СОЦИАЛЬНЫЕ МАСКИ</h4>
            <p>✨ Для близких: ${getCallDescription(calls?.close, 'close')}</p>
            <p>✨ Для социума: ${getCallDescription(calls?.social, 'social')}</p>
            <p>✨ Для мира: ${getCallDescription(calls?.world, 'world')}</p>
        </div>
    `;
}