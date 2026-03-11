document.addEventListener('DOMContentLoaded', function() {
    // Эффект параллакса для звезд
    window.addEventListener('mousemove', function(e) {
        const stars = document.querySelector('.stars');
        if (stars) {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            stars.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
        }
    });

    // Анимация появления карточек
    const cards = document.querySelectorAll('.practice-card');
    cards.forEach((card, index) => {
        card.style.animation = `fadeInUp 0.5s ease forwards ${index * 0.1}s`;
        card.style.opacity = '0';
    });
});

// Добавляем ключевые кадры анимации
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Валидация даты
function isValidDate(dateStr) {
    const pattern = /^\d{2}\.\d{2}\.\d{4}$/;
    if (!pattern.test(dateStr)) return false;

    const [day, month, year] = dateStr.split('.').map(Number);

    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;

    // Проверка на количество дней в месяце
    const daysInMonth = new Date(year, month, 0).getDate();
    if (day > daysInMonth) return false;

    // Проверка на разумный год (1900-2100)
    if (year < 1900 || year > 2100) return false;

    return true;
}

// Отображение результатов
function displayResults(data) {
    console.log('Данные для отображения:', data); // Для отладки

    // Основная информация
    document.getElementById('resultFullName').textContent = data.fullName;
    document.getElementById('resultBirthDate').textContent = data.birthDate;

    // ===== НУМЕРОЛОГИЯ =====
    // Базовые числа
    document.getElementById('fateNumber').textContent = data.numerology.base.fate;
    document.getElementById('nameNumber').textContent = data.numerology.base.name;
    document.getElementById('surnameNumber').textContent = data.numerology.base.surname;
    document.getElementById('patronymicNumber').textContent = data.numerology.base.patronymic;

    // Специальные числа
    document.getElementById('achillesNumber').textContent = data.numerology.achilles.number;
    document.getElementById('controlNumber').textContent = data.numerology.control.number;

    // Оклики
    document.getElementById('callClose').textContent = data.numerology.calls.close;
    document.getElementById('callSocial').textContent = data.numerology.calls.social;
    document.getElementById('callWorld').textContent = data.numerology.calls.world;

    // Описания окликов
    document.getElementById('callCloseDesc').textContent = getCallDescription(data.numerology.calls.close, 'close');
    document.getElementById('callSocialDesc').textContent = getCallDescription(data.numerology.calls.social, 'social');
    document.getElementById('callWorldDesc').textContent = getCallDescription(data.numerology.calls.world, 'world');

    // ===== АСТРОЛОГИЯ =====
    document.getElementById('zodiacName').textContent = data.zodiac.name;
    document.getElementById('zodiacElement').textContent = data.zodiac.element;
    document.getElementById('zodiacQuality').textContent = data.zodiac.quality || 'Кардинальный';
    document.getElementById('zodiacPlanet').textContent = data.zodiac.planet || 'Планета не определена';
    document.getElementById('zodiacDescription').textContent = data.zodiac.description;
    document.getElementById('zodiacStrengths').textContent = data.zodiac.strengths;
    document.getElementById('zodiacWeaknesses').textContent = data.zodiac.weaknesses;
    document.getElementById('zodiacMission').textContent = data.zodiac.lifeMission;
    document.getElementById('zodiacDeepInsight').textContent = data.zodiac.deepInsight;

    // Символ знака зодиака
    document.getElementById('zodiacSymbol').textContent = getZodiacSymbol(data.zodiac.name);

    // ===== ФЕН-ШУЙ =====
    document.getElementById('fengshuiElementName').textContent = data.fengShui.element;
    document.getElementById('fengshuiColor').textContent = data.fengShui.color;
    document.getElementById('fengshuiDirection').textContent = data.fengShui.direction;
    document.getElementById('fengshuiSeason').textContent = data.fengShui.season;
    document.getElementById('fengshuiShape').textContent = data.fengShui.shape || 'Разнообразные';
    document.getElementById('fengshuiMeaning').textContent = data.fengShui.meaning || 'Гармония с природой';
    document.getElementById('fengshuiDescription').textContent = data.fengShui.description;
    document.getElementById('fengshuiActivation').textContent = data.fengShui.activation;
    document.getElementById('fengshuiPersonalAdvice').textContent = data.fengShui.personalAdvice;
    document.getElementById('fengshuiAffirmation').textContent = data.fengShui.affirmation || 'Я в гармонии с потоками вселенной';

    // Символ элемента
    document.getElementById('fengshuiElementSymbol').textContent = getElementSymbol(data.fengShui.elementKey || data.fengShui.element);

    // ===== ТАРО =====
    // Карта Судьбы
    document.getElementById('tarotFateNumber').textContent = data.tarot.fate.number;
    document.getElementById('tarotFateName').textContent = data.tarot.fate.name;
    document.getElementById('tarotFateKeywords').textContent = data.tarot.fate.keywords;
    document.getElementById('tarotFateDescription').textContent = data.tarot.fate.description;
    document.getElementById('tarotFateAdvice').textContent = data.tarot.fate.advice;

    // Карта Личности
    document.getElementById('tarotPersonalityNumber').textContent = data.tarot.personality.number;
    document.getElementById('tarotPersonalityName').textContent = data.tarot.personality.name;
    document.getElementById('tarotPersonalityKeywords').textContent = data.tarot.personality.keywords;
    document.getElementById('tarotPersonalityDescription').textContent = data.tarot.personality.description;
    document.getElementById('tarotPersonalityAdvice').textContent = data.tarot.personality.advice;

    // Карта Пути
    document.getElementById('tarotControlNumber').textContent = data.tarot.control.number;
    document.getElementById('tarotControlName').textContent = data.tarot.control.name;
    document.getElementById('tarotControlKeywords').textContent = data.tarot.control.keywords;
    document.getElementById('tarotControlDescription').textContent = data.tarot.control.description;
    document.getElementById('tarotControlAdvice').textContent = data.tarot.control.advice;

    // ===== ПСИХОЛОГИЯ И НЛП =====
    if (data.psychology) {
        // Модальность НЛП
        document.getElementById('modalityTitle').textContent = data.psychology.modality.title;
        document.getElementById('modalityDescription').textContent = data.psychology.modality.description;
        document.getElementById('modalityPredicates').textContent = data.psychology.modality.predicates ?
            data.psychology.modality.predicates.join(', ') : 'вижу, слышу, чувствую';
        document.getElementById('modalityAccessKeys').textContent = data.psychology.modality.accessKeys;

        // Архетип
        document.getElementById('archetypeName').textContent = data.psychology.archetype.name;
        document.getElementById('archetypeDescription').textContent = data.psychology.archetype.description;
        document.getElementById('archetypeGift').textContent = data.psychology.archetype.gift;
        document.getElementById('archetypeChallenge').textContent = data.psychology.archetype.challenge;
        document.getElementById('archetypeMantra').textContent = data.psychology.archetype.mantra;

        // Тип привязанности
        document.getElementById('attachmentName').textContent = data.psychology.attachment.name;
        document.getElementById('attachmentDescription').textContent = data.psychology.attachment.description;

        // Глубинный портрет
        document.getElementById('deepPortrait').innerHTML = formatPortrait(data.psychology.portrait);
    }

    // ===== ПАТТЕРНЫ ЛИЧНОСТИ =====
    const patternsList = document.getElementById('patternsList');
    patternsList.innerHTML = '';

// Генерируем паттерны на основе всех данных
    const patterns = generatePatterns(data);

    if (patterns && patterns.length > 0) {
        patterns.forEach(pattern => {
            const p = document.createElement('p');
            // Используем innerHTML вместо textContent для поддержки жирного текста
            p.innerHTML = '✦ ' + pattern;
            patternsList.appendChild(p);
        });
    } else {
        patternsList.innerHTML = '<p>✨ Индивидуальные паттерны формируются в момент вашего запроса</p>';
    }

    // ===== ПОЛНАЯ ИНТЕРПРЕТАЦИЯ =====
    const interpretation = generateFullInterpretation(data);
    document.getElementById('interpretationText').innerHTML = interpretation;
}

// Форматирование портрета с сохранением переносов и жирного текста
function formatPortrait(portrait) {
    if (!portrait) return '<p>Портрет формируется...</p>';

    // Заменяем ** на <strong> для жирного текста
    let formatted = portrait.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Заменяем переносы строк на <br>
    formatted = formatted.replace(/\n/g, '<br>');

    // Разбиваем на абзацы по двойным переносам
    const paragraphs = formatted.split('<br><br>');
    return paragraphs.map(p => `<p>${p}</p>`).join('');
}

// Получить символ знака зодиака
function getZodiacSymbol(signName) {
    const symbols = {
        'Овен': '♈', 'Телец': '♉', 'Близнецы': '♊', 'Рак': '♋',
        'Лев': '♌', 'Дева': '♍', 'Весы': '♎', 'Скорпион': '♏',
        'Стрелец': '♐', 'Козерог': '♑', 'Водолей': '♒', 'Рыбы': '♓'
    };
    return symbols[signName] || '⛤';
}

// Получить символ элемента фен-шуй
function getElementSymbol(element) {
    const elementLower = String(element).toLowerCase();
    const symbols = {
        'металл': '⚜️', 'metal': '⚜️',
        'вода': '🌊', 'water': '🌊',
        'дерево': '🌳', 'wood': '🌳',
        'огонь': '🔥', 'fire': '🔥',
        'земля': '⛰️', 'earth': '⛰️'
    };
    return symbols[elementLower] || '✨';
}

// Описания окликов
function getCallDescription(num, type) {
    const base = {
        1: 'волевой лидер, инициатор, тот, кто начинает первым',
        2: 'дипломат, миротворец, чувствительный и терпеливый',
        3: 'творческая натура, душа компании, источник вдохновения',
        4: 'надежный партнер, строитель, опора для окружающих',
        5: 'коммуникатор, исследователь, везде свой',
        6: 'заботливый, ответственный, готовый прийти на помощь',
        7: 'целеустремленный, победитель, преодолевающий препятствия',
        8: 'справедливый, авторитетный, внушающий доверие',
        9: 'мудрый, загадочный, немного отстраненный наблюдатель',
        10: 'харизматичный лидер, удачливый и успешный',
        11: 'вдохновляющий, сильный, заряжающий энергией',
        12: 'понимающий, принимающий, готовый выслушать и поддержать',
        13: 'меняющийся, развивающийся, всегда в движении',
        14: 'гармоничный, уравновешенный, спокойный',
        15: 'притягательный, страстный, немного опасный',
        16: 'основательный, мощный, разрушающий стены',
        17: 'окрыленный, верящий, вдохновляющий надеждой',
        18: 'интуитивный, загадочный, чувствующий глубже других',
        19: 'солнечный, щедрый, согревающий своим теплом',
        20: 'пробуждающий, заставляющий задуматься',
        21: 'целостный, завершенный, умиротворяющий',
        22: 'свободный, легкий, начинающий новое'
    };

    const typePrefix = {
        close: 'В кругу семьи вы — ',
        social: 'В коллективе вас видят как ',
        world: 'Незнакомцы воспринимают вас как '
    };

    return typePrefix[type] + (base[num] || 'многогранная личность, которую сложно описать одной фразой');
}

// Генерация паттернов личности
function generatePatterns(data) {
    const patterns = [];
    const { numerology, zodiac, fengShui } = data;
    const { base, achilles, control } = numerology;

    // Анализ дублей в базовых числах
    const counts = {};
    [base.fate, base.name, base.surname, base.patronymic].forEach(n => {
        counts[n] = (counts[n] || 0) + 1;
    });

    Object.entries(counts).forEach(([num, count]) => {
        if (count >= 2) {
            if (num == 8) patterns.push('Усиленная родовая карма — тема справедливости и закона проходит красной нитью через всю жизнь');
            else if (num == 11) patterns.push('Двойная харизма — мощный лидерский потенциал, требующий мудрого управления');
            else if (num == 3) patterns.push('Творческая энергия в избытке — потребность в самовыражении ищет выхода');
            else if (num == 6) patterns.push('Гиперответственность — склонность заботиться о других в ущерб себе');
            else patterns.push(`Число ${num} повторяется — эта энергия требует особого внимания`);
        }
    });

    // Анализ контрастов
    if (Math.abs(base.fate - base.name) > 10) {
        patterns.push('Внутренний конфликт между предназначением и личностью — вы не всегда позволяете себе быть собой');
    }

    if (base.surname === base.patronymic) {
        patterns.push('Сильная связь с родом — поддержка предков ощущается на подсознательном уровне');
    }

    if (achilles.number === control.number) {
        patterns.push('Золотой ключ — ваша уязвимость является одновременно вашей суперсилой');
    }

    // Анализ стихий
    if (zodiac.element === 'Огонь' && fengShui.element === 'Вода') {
        patterns.push('Конфликт стихий — огонь и вода внутри создают напряжение, которое может стать источником пара');
    }

    if (zodiac.element === 'Земля' && fengShui.element === 'Земля') {
        patterns.push('Двойная земля — вы опора для многих, но рискуете стать неподвижным. Добавьте движения');
    }

    return patterns;
}

// Полная интерпретация
function generateFullInterpretation(data) {
    const { numerology, zodiac, fengShui, tarot } = data;
    const { base, achilles, control, calls } = numerology;

    return `
        <div class="interpretation-section">
            <h4>🌟 ЗВЕЗДНЫЙ КОД ЛИЧНОСТИ</h4>
            <p>Твоя душа выбрала этот мир в момент <strong>${data.birthDate}</strong>, когда космос выстроился в уникальную конфигурацию, чтобы создать тебя — таким, какой ты есть. Твое имя <strong>${data.fullName}</strong> — не случайный набор звуков, а вибрация, которая определяет твой путь.</p>
        </div>
        
        <div class="interpretation-section">
            <h4>🔢 ЧИСЛОВАЯ МАТРИЦА</h4>
            <p>Твое число судьбы — <strong>${base.fate}</strong>. Это твой компас, указывающий направление. Число имени — <strong>${base.name}</strong> — твой инструмент взаимодействия с миром. Число рода — <strong>${base.surname}</strong> — багаж, который ты несешь из прошлого. Число отчества — <strong>${base.patronymic}</strong> — связь с отцовской линией.</p>
            <p>Твоя ахиллесова пята — <strong>${achilles.number}</strong>. ${achilles.description}</p>
            <p>Твой способ управлять реальностью — <strong>${control.number}</strong>. ${control.description}</p>
        </div>
        
        <div class="interpretation-section">
            <h4>♈ АСТРОЛОГИЧЕСКИЙ ПРОФИЛЬ</h4>
            <p>Ты — <strong>${zodiac.name}</strong> (${zodiac.element}). ${zodiac.description}</p>
            <p><strong>Твоя миссия:</strong> ${zodiac.lifeMission}</p>
        </div>
        
        <div class="interpretation-section">
            <h4>🌀 ЭНЕРГИЯ ФЕН-ШУЙ</h4>
            <p>Твой элемент — <strong>${fengShui.element}</strong>. ${fengShui.description}</p>
            <p><strong>Цвет силы:</strong> ${fengShui.color}</p>
            <p><strong>Направление удачи:</strong> ${fengShui.direction}</p>
        </div>
        
        <div class="interpretation-section">
            <h4>🎴 КАРТЫ ТВОЕЙ СУДЬБЫ</h4>
            <p><strong>Судьба:</strong> ${tarot.fate.name} — ${tarot.fate.keywords}</p>
            <p><strong>Личность:</strong> ${tarot.personality.name} — ${tarot.personality.keywords}</p>
            <p><strong>Путь:</strong> ${tarot.control.name} — ${tarot.control.keywords}</p>
        </div>
        
        <div class="interpretation-section">
            <h4>🎭 ТВОИ СОЦИАЛЬНЫЕ МАСКИ</h4>
            <p>✨ Для близких: ${getCallDescription(calls.close, 'close')}</p>
            <p>✨ Для социума: ${getCallDescription(calls.social, 'social')}</p>
            <p>✨ Для мира: ${getCallDescription(calls.world, 'world')}</p>
        </div>
        
        <div class="interpretation-section">
            <h4>💫 ГЛАВНЫЙ УРОК ЭТОЙ ЖИЗНИ</h4>
            <p>${getLifeLesson(base.fate, achilles.number, zodiac.element)}</p>
        </div>
        
        <div class="interpretation-section">
            <h4>🌌 ПОСЛАНИЕ ОТ ВСЕЛЕННОЙ</h4>
            <p class="universe-message">${getUniverseMessage(base.fate)}</p>
        </div>
    `;
}

// Получение жизненного урока
function getLifeLesson(fate, achilles, element) {
    const lessons = {
        1: 'Научиться быть лидером, не подавляя других. Твоя сила — в умении вдохновлять, а не приказывать.',
        2: 'Научиться слышать себя среди голосов других. Твоя чувствительность — дар, а не слабость.',
        3: 'Научиться выражать себя, не боясь осуждения. Творчество — твоя природа, а не привилегия.',
        4: 'Научиться строить, не становясь застывшим. Порядок важен, но гибкость — это жизнь.',
        5: 'Научиться быть свободным, не теряя связей. Свобода — это не одиночество.',
        6: 'Научиться заботиться о себе так же, как о других. Ты тоже заслуживаешь любви.',
        7: 'Научиться принимать поражения как часть пути. Ты уже победитель, даже когда проигрываешь.',
        8: 'Научиться справедливости без жестокости. Баланс — это не только закон, но и милосердие.',
        9: 'Научиться мудрости, не теряя связи с миром. Твоя глубина нужна другим.',
        10: 'Научиться принимать признание, не зависеть от него. Ты ценен сам по себе.',
        11: 'Научиться управлять своей силой, не боясь ее. Ты — проводник, а не источник.',
        12: 'Научиться служить, не становясь жертвой. Твоя помощь должна начинаться с тебя.',
        13: 'Научиться принимать перемены как обновление. После смерти всегда приходит жизнь.',
        14: 'Научиться балансу, не теряя страсти. Гармония — это танец, а не застывшая поза.',
        15: 'Научиться видеть свою тень и принимать ее. Тьма — это просто отсутствие света.',
        16: 'Научиться проходить через кризисы без страха. Разрушение — всегда начало.',
        17: 'Научиться верить, даже когда не видно пути. Надежда — это выбор.',
        18: 'Научиться доверять своей интуиции. То, что ты чувствуешь, — истинно.',
        19: 'Научиться светить, не ожидая аплодисментов. Твой свет нужен миру, даже если он не виден.',
        20: 'Научиться слышать зов своей души. Твое призвание ждет тебя.',
        21: 'Научиться завершать и отпускать. То, что уходит, освобождает место.',
        22: 'Научиться начинать с чистого листа. Каждый день — новое рождение.'
    };

    return lessons[fate] || 'Принять себя полностью и довериться потоку жизни';
}

// Получение послания от Вселенной
function getUniverseMessage(fate) {
    const messages = [
        '"Ты именно тот, кто нужен этому миру. Прямо сейчас. Таким, какой есть."',
        '"Все, что ты ищешь, уже внутри тебя. Просто позволь себе это увидеть."',
        '"Твой путь уникален. Не сравнивай себя с другими — у них свои дороги."',
        '"Ты не случайно здесь. Каждый твой шаг имеет значение."',
        '"Вселенная поддерживает тебя, даже когда ты этого не чувствуешь."',
        '"Твоя уязвимость — твоя сила. Не бойся быть настоящим."',
        '"То, что тебе суждено, найдет тебя. Даже если сейчас кажется иначе."',
        '"Ты растешь, даже когда думаешь, что стоишь на месте."',
        '"Каждая твоя ошибка — это урок, а не приговор."',
        '"Ты достоин любви просто потому, что ты есть."'
    ];

    return messages[fate % messages.length] || messages[0];
}
// Генерация паттернов личности
function generatePatterns(data) {
    const patterns = [];

    // Проверяем наличие данных
    if (!data || !data.numerology) {
        patterns.push('💫 Ваш уникальный паттерн формируется...');
        return patterns;
    }

    const { numerology, zodiac, fengShui, tarot } = data;
    const { base, achilles, control, calls } = numerology;

    // ===== ПАТТЕРНЫ НА ОСНОВЕ БАЗОВЫХ ЧИСЕЛ =====

    // Анализ дублей в базовых числах
    const counts = {};
    const numbers = [base.fate, base.name, base.surname, base.patronymic];
    numbers.forEach(n => {
        counts[n] = (counts[n] || 0) + 1;
    });

    Object.entries(counts).forEach(([num, count]) => {
        if (count >= 2) {
            if (num == 8) {
                patterns.push('⚖️ **Усиленная родовая карма** — тема справедливости и закона проходит красной нитью через всю вашу жизнь. Вы особенно чувствительны к вопросам чести и баланса.');
            } else if (num == 11) {
                patterns.push('🔥 **Двойная харизма** — мощный лидерский потенциал, требующий мудрого управления. Вы способны вдохновлять массы, но важно не сгореть самому.');
            } else if (num == 3) {
                patterns.push('🎨 **Творческая энергия в избытке** — потребность в самовыражении ищет выхода. Вам жизненно необходимо творить, иначе энергия застаивается.');
            } else if (num == 6) {
                patterns.push('💝 **Гиперответственность** — склонность заботиться о других в ущерб себе. Помните: кислородную маску сначала на себя.');
            } else if (num == 22) {
                patterns.push('🦋 **Свободный дух** — вы не терпите ограничений, постоянно ищете новые пути и начинания. Ваша сила в спонтанности.');
            } else if (num == 4) {
                patterns.push('🏛️ **Фундаментальность** — вы строитель и создатель основ. Ваша стабильность — опора для многих, но остерегайтесь закостенелости.');
            } else {
                patterns.push(`🔮 **Число ${num} повторяется** — энергия этого числа требует особого внимания и проработки в текущем воплощении.`);
            }
        }
    });

    // Анализ контрастов
    if (Math.abs(base.fate - base.name) > 10) {
        patterns.push('⚡ **Внутренний конфликт** — ваше предназначение (число судьбы) расходится с самовыражением (число имени). Вы не всегда позволяете себе быть собой. Поиск компромисса между долгом и желаниями — ваша задача.');
    }

    if (base.surname === base.patronymic) {
        patterns.push('🌳 **Сильная связь с родом** — поддержка предков ощущается на подсознательном уровне. Вы несете мудрость нескольких поколений, но иногда это может быть грузом.');
    }

    if (achilles && achilles.number === control.number) {
        patterns.push('🔑 **Золотой ключ** — ваша уязвимость (ахиллесова пята) является одновременно вашей суперсилой (числом управления). Приняв свою слабость, вы обретете невероятную мощь.');
    }

    // ===== ПАТТЕРНЫ НА ОСНОВЕ ОКЛИКОВ =====

    if (calls) {
        if (calls.close === calls.social) {
            patterns.push('🎭 **Целостность образа** — вы одинаковы в семье и в социуме. Это редкая искренность, но иногда вам не хватает гибкости.');
        }

        if (calls.close === 22 || calls.social === 22 || calls.world === 22) {
            patterns.push('🆕 **Вечный начинающий** — вы постоянно в начале нового пути. Это дает свежесть восприятия, но мешает завершать начатое.');
        }
    }

    // ===== ПАТТЕРНЫ НА ОСНОВЕ СТИХИЙ =====

    if (zodiac && fengShui) {
        const zodiacElement = zodiac.element ? zodiac.element.toLowerCase() : '';
        const fengShuiElement = fengShui.elementKey ? fengShui.elementKey.toLowerCase() :
            (fengShui.element ? fengShui.element.toLowerCase() : '');

        // Конфликт стихий
        if ((zodiacElement === 'огонь' && fengShuiElement === 'вода') ||
            (zodiacElement === 'вода' && fengShuiElement === 'огонь')) {
            patterns.push('🌊🔥 **Конфликт стихий** — огонь и вода внутри вас создают напряжение, которое может стать источником пара (энергии). Вы одновременно страстны и глубоки, эмоциональны и интуитивны. Научитесь использовать это напряжение для движения.');
        } else if ((zodiacElement === 'земля' && fengShuiElement === 'дерево') ||
            (zodiacElement === 'дерево' && fengShuiElement === 'земля')) {
            patterns.push('🌱⛰️ **Рост и опора** — вы одновременно стремитесь к развитию и нуждаетесь в стабильности. Дерево берет силы из земли, а земля укрепляется корнями. Ваш путь — в гармонии роста и устойчивости.');
        } else if ((zodiacElement === 'воздух' && fengShuiElement === 'огонь') ||
            (zodiacElement === 'огонь' && fengShuiElement === 'воздух')) {
            patterns.push('💨🔥 **Ветер и пламя** — ваша идеи (воздух) раздувают страсть (огонь). Вы способны зажечь любого своей мыслью. Главное — чтобы ветер не задул огонь, а огонь не сжег кислород.');
        } else if (zodiacElement === fengShuiElement) {
            patterns.push(`🌀 **Гармония стихий** — ваша солнечная стихия (${zodiacElement}) совпадает с годовой стихией (${fengShuiElement}). Это дает усиление качеств, но требует осторожности — энергии может быть слишком много.`);
        }
    }

    // ===== ПАТТЕРНЫ НА ОСНОВЕ ТАРО =====

    if (tarot) {
        if (tarot.fate && tarot.personality && tarot.fate.number === tarot.personality.number) {
            patterns.push('🎴 **Кармическая задача** — ваша карта судьбы совпадает с картой личности. Это означает, что ваша главная жизненная задача — стать собой. Никаких масок, только подлинность.');
        }

        if (tarot.fate && [13, 16, 20].includes(tarot.fate.number)) {
            patterns.push('🔄 **Трансформатор** — ваша карта судьбы указывает на глубокие трансформации в жизни. Перемены — ваша стихия, а кризисы — точки роста.');
        }

        if (tarot.personality && [1, 8, 11, 21].includes(tarot.personality.number)) {
            patterns.push('👑 **Прирожденный лидер** — ваша карта личности говорит о лидерских качествах. Вы не ведомый, вы ведущий. Даже в пассивности чувствуется скрытая сила.');
        }
    }

    // ===== ПАТТЕРНЫ НА ОСНОВЕ АХИЛЛЕСОВОЙ ПЯТЫ =====

    if (achilles) {
        const achillesNum = achilles.number || achilles;
        const achillesPatterns = {
            1: '🦁 **Страх одиночества** — вы боитесь остаться незамеченным, но именно в моменты, когда никто не смотрит, вы обретаете настоящую силу.',
            2: '🤝 **Зависимость от мнения других** — вы слишком чувствительны к оценке окружающих. Помните: чужое мнение — это просто мнение, а не истина.',
            3: '🎭 **Страх быть смешным** — вы боитесь нелепости, но именно спонтанность и легкость могут стать вашим главным козырем.',
            4: '🏰 **Страх перемен** — вы держитесь за стабильность, но мир меняется, и ваша гибкость — залог выживания.',
            5: '🕊️ **Страх свободы** — вы боитесь отпустить контроль, но именно в полете расправляются крылья.',
            6: '💔 **Чувство вины** — вы всегда кому-то что-то должны. Но правда в том, что вы должны быть счастливы в первую очередь.',
            7: '⚔️ **Страх поражения** — вы боитесь проиграть, но без поражений нет побед. Каждое падение — это опыт.',
            8: '⚖️ **Непереносимость несправедливости** — вы остро реагируете на нечестность. Но мир не черно-белый, и ваша задача — принять его многогранность.',
            9: '🌫️ **Уход в иллюзии** — вы избегаете реальности в мечтах. Но настоящая магия происходит здесь и сейчас.',
            10: '🎭 **Страх непризнания** — вам нужно, чтобы вас ценили. Но ваша ценность не зависит от чужого признания.',
            11: '🦅 **Внутренняя борьба** — вы разрываетесь между силой и слабостью. Примите обе свои стороны.',
            12: '🙏 **Страх отказать** — вы не умеете говорить "нет". Но ваше "да" обесценивается, когда вы соглашаетесь на все подряд.',
            13: '🌪️ **Страх перемен** — вы боитесь, что привычный мир рухнет. Иногда это именно то, что нужно.',
            14: '🌊 **Эмоциональная нестабильность** — ваши чувства захлестывают вас. Учитесь быть их капитаном.',
            15: '🔥 **Зависимости** — вы легко поддаетесь искушениям. Осознание — первый шаг к свободе.',
            16: '🏚️ **Страх разрушения** — вы боитесь, что все пойдет прахом. Но разрушение всегда предшествует новому строительству.',
            17: '🌈 **Нереалистичные ожидания** — вы ждете слишком многого. Реальность прекрасна по-своему.',
            18: '🌑 **Страх темноты** — вы боитесь заглядывать вглубь себя. Но там ваши главные сокровища.',
            19: '☀️ **Страх быть в тени** — вам нужно внимание. Но светить можно и не будучи в центре.',
            20: '⚖️ **Страх осуждения** — вы боитесь, что вас осудят. Самый строгий судья — внутри вас.',
            21: '🔄 **Неумение отпускать** — вы держитесь за прошлое. Чтобы принять новое, нужно разжать руки.',
            22: '👶 **Страх ответственности** — вы боитесь взрослых решений. Но свобода начинается с ответственности.'
        };

        if (achillesPatterns[achillesNum]) {
            patterns.push(achillesPatterns[achillesNum]);
        }
    }

    // ===== ПАТТЕРНЫ НА ОСНОВЕ ЧИСЛА УПРАВЛЕНИЯ =====

    if (control) {
        const controlNum = control.number || control;
        const controlPatterns = {
            1: '💪 **Инициатор** — вы управляете миром через действие. Там, где другие думают, вы делаете.',
            2: '🤲 **Дипломат** — ваша сила в терпении и умении ждать. Вы создаете гармонию из хаоса.',
            3: '🎨 **Творец** — вы творите реальность через радость и самовыражение. Ваша энергия заразительна.',
            4: '🏗️ **Строитель** — вы создаете структуры и порядок. Вы — архитектор реальности.',
            5: '🦋 **Ветер перемен** — ваша стихия — движение и свобода. Вы открываете новые двери.',
            6: '💝 **Сердце** — ваш путь — любовь и забота. Вы исцеляете одним присутствием.',
            7: '⚔️ **Воин света** — вы не сдаетесь, даже когда весь мир против. Вы — доказательство, что невозможное возможно.',
            8: '⚖️ **Хранитель равновесия** — ваш дар в чувстве справедливости. Вы восстанавливаете порядок.',
            9: '🦉 **Мудрец** — вы видите то, что скрыто от других. Вы — проводник между мирами.',
            10: '🍀 **Любимец фортуны** — вы притягиваете удачу. Вы в нужное время в нужном месте.',
            11: '🔥 **Вдохновение** — ваша харизма зажигает сердца. За вами идут, даже не зная куда.',
            12: '🙌 **Принятие** — ваш дар в умении принимать мир. Вы — тихая гавань для других.',
            13: '🦅 **Трансформация** — вы проходите через кризисы и становитесь сильнее. Вы — феникс.',
            14: '🌈 **Гармония** — вы соединяете несоединимое. Вы — дирижер оркестра жизни.',
            15: '🌑 **Преодоление** — ваша сила в прохождении через тьму. Вы знаете цену свободы.',
            16: '💥 **Прорыв** — вы не боитесь рушить старое. Вы расчищаете завалы для будущего.',
            17: '⭐ **Надежда** — вы верите, когда верить не во что. Вы — звезда в ночном небе.',
            18: '🌙 **Интуиция** — ваша сила в связи с подсознанием. Вы слышите то, что не сказано.',
            19: '☀️ **Свет** — вы радуетесь жизни и заражаете других. Вы — солнце.',
            20: '⏰ **Пробуждение** — вы видите истинную суть вещей. Вы — будильник для спящих душ.',
            21: '🌍 **Целостность** — вы объединяете разрозненное. Вы собираете пазл мира.',
            22: '🦋 **Свобода** — ваша сила в умении начинать с чистого листа. Вы — чистое начало.'
        };

        if (controlPatterns[controlNum]) {
            patterns.push(`🎯 **Сверхспособность**: ${controlPatterns[controlNum]}`);
        }
    }

    // Если паттернов нет, добавляем общий
    if (patterns.length === 0) {
        patterns.push('✨ **Уникальная комбинация энергий** — ваш паттерн настолько индивидуален, что выходит за рамки стандартных шаблонов. Вы — творец собственного пути.');
    }

    return patterns;
}
document.addEventListener('DOMContentLoaded', function() {
    // Мобильное меню
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeBtn = document.querySelector('.mobile-menu-close');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        const closeMenu = () => {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        };

        if (closeBtn) {
            closeBtn.addEventListener('click', closeMenu);
        }

        // Закрытие по клику на ссылку
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Закрытие по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                closeMenu();
            }
        });
    }

    // Подсветка активного пункта меню
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
});