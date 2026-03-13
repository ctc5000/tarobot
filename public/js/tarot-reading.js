// Колода Таро (Старшие Арканы)
const tarotDeck = [{
    id: 0, name: 'Шут', nameEn: 'The Fool', image: '/images/tarot/00-fool.jpg', meaning: {
        upright: 'Новое начало, спонтанность, вера в лучшее', reversed: 'Безрассудство, глупость, рискованные решения'
    }, description: 'Шут — это чистая энергия нового начала, готовность идти в неизвестность с открытым сердцем.'
}, {
    id: 1, name: 'Маг', nameEn: 'The Magician', image: '/images/tarot/01-magician.jpg', meaning: {
        upright: 'Мастерство, сила воли, проявление желаний', reversed: 'Манипуляции, неиспользованный потенциал'
    }, description: 'Маг — это вы в моменты, когда вся вселенная служит вашему замыслу.'
}, {
    id: 2,
    name: 'Верховная Жрица',
    nameEn: 'The High Priestess',
    image: '/images/tarot/02-high-priestess.jpg',
    meaning: {
        upright: 'Интуиция, тайна, внутренний голос', reversed: 'Секреты, подавленная интуиция'
    },
    description: 'Жрица — это ваша внутренняя тишина, где рождаются все ответы.'
}, {
    id: 3, name: 'Императрица', nameEn: 'The Empress', image: '/images/tarot/03-empress.jpg', meaning: {
        upright: 'Плодородие, изобилие, творчество', reversed: 'Творческий блок, зависимость'
    }, description: 'Императрица — это ваша способность творить и взращивать.'
}, {
    id: 4, name: 'Император', nameEn: 'The Emperor', image: '/images/tarot/04-emperor.jpg', meaning: {
        upright: 'Власть, структура, авторитет', reversed: 'Тирания, жесткость, отсутствие контроля'
    }, description: 'Император — это ваша способность создавать порядок из хаоса.'
}, {
    id: 5, name: 'Иерофант', nameEn: 'The Hierophant', image: '/images/tarot/05-hierophant.jpg', meaning: {
        upright: 'Традиции, обучение, наставничество', reversed: 'Бунтарство, отказ от традиций'
    }, description: 'Иерофант — это ваша связь с традициями и мудростью предков.'
}, {
    id: 6, name: 'Влюбленные', nameEn: 'The Lovers', image: '/images/tarot/06-lovers.jpg', meaning: {
        upright: 'Любовь, выбор, гармония', reversed: 'Разлад, неправильный выбор'
    }, description: 'Влюбленные — это момент истины, когда сердце должно выбрать.'
}, {
    id: 7, name: 'Колесница', nameEn: 'The Chariot', image: '/images/tarot/07-chariot.jpg', meaning: {
        upright: 'Победа, воля, контроль', reversed: 'Потеря контроля, агрессия'
    }, description: 'Колесница — это ваша способность двигаться к цели, преодолевая препятствия.'
}, {
    id: 8, name: 'Сила', nameEn: 'Strength', image: '/images/tarot/08-strength.jpg', meaning: {
        upright: 'Внутренняя сила, мужество, страсть', reversed: 'Слабость, неуверенность'
    }, description: 'Сила — это не мышцы, а умение укрощать зверя внутри.'
}, {
    id: 9, name: 'Отшельник', nameEn: 'The Hermit', image: '/images/tarot/09-hermit.jpg', meaning: {
        upright: 'Мудрость, уединение, поиск', reversed: 'Изоляция, одиночество'
    }, description: 'Отшельник — это время уйти внутрь, чтобы найти свет.'
}, {
    id: 10, name: 'Колесо Фортуны', nameEn: 'Wheel of Fortune', image: '/images/tarot/10-wheel.jpg', meaning: {
        upright: 'Удача, перемены, судьба', reversed: 'Неудача, сопротивление переменам'
    }, description: 'Колесо Фортуны — напоминание, что все течет, все меняется.'
}, {
    id: 11, name: 'Справедливость', nameEn: 'Justice', image: '/images/tarot/11-justice.jpg', meaning: {
        upright: 'Справедливость, честность, баланс', reversed: 'Несправедливость, дисбаланс'
    }, description: 'Справедливость — момент истины, когда все тайное становится явным.'
}, {
    id: 12, name: 'Повешенный', nameEn: 'The Hanged Man', image: '/images/tarot/12-hanged-man.jpg', meaning: {
        upright: 'Жертва, новый взгляд, пауза', reversed: 'Застой, нежелание меняться'
    }, description: 'Повешенный — время остановиться и посмотреть на мир иначе.'
}, {
    id: 13, name: 'Смерть', nameEn: 'Death', image: '/images/tarot/13-death.jpg', meaning: {
        upright: 'Трансформация, конец, новое начало', reversed: 'Сопротивление переменам'
    }, description: 'Смерть — это не конец, а трансформация.'
}, {
    id: 14, name: 'Умеренность', nameEn: 'Temperance', image: '/images/tarot/14-temperance.jpg', meaning: {
        upright: 'Баланс, гармония, терпение', reversed: 'Дисбаланс, конфликты'
    }, description: 'Умеренность — искусство быть в балансе, не впадать в крайности.'
}, {
    id: 15, name: 'Дьявол', nameEn: 'The Devil', image: '/images/tarot/15-devil.jpg', meaning: {
        upright: 'Искушение, зависимость, тень', reversed: 'Освобождение, прозрение'
    }, description: 'Дьявол — встреча со своей тенью, со своими зависимостями и страхами.'
}, {
    id: 16, name: 'Башня', nameEn: 'The Tower', image: '/images/tarot/16-tower.jpg', meaning: {
        upright: 'Разрушение, кризис, прорыв', reversed: 'Избегание перемен'
    }, description: 'Башня — момент крушения старых структур, освобождающих место для нового.'
}, {
    id: 17, name: 'Звезда', nameEn: 'The Star', image: '/images/tarot/17-star.jpg', meaning: {
        upright: 'Надежда, вдохновение, исцеление', reversed: 'Отчаяние, потеря веры'
    }, description: 'Звезда — свет в конце туннеля, надежда после кризиса.'
}, {
    id: 18, name: 'Луна', nameEn: 'The Moon', image: '/images/tarot/18-moon.jpg', meaning: {
        upright: 'Иллюзии, подсознание, интуиция', reversed: 'Прояснение, выход из иллюзий'
    }, description: 'Луна — мир снов, интуиции, подсознательных страхов.'
}, {
    id: 19, name: 'Солнце', nameEn: 'The Sun', image: '/images/tarot/19-sun.jpg', meaning: {
        upright: 'Радость, успех, энергия', reversed: 'Временные трудности'
    }, description: 'Солнце — свет, радость, ясность после тьмы.'
}, {
    id: 20, name: 'Суд', nameEn: 'Judgement', image: '/images/tarot/20-judgement.jpg', meaning: {
        upright: 'Возрождение, прощение, призвание', reversed: 'Сожаление, нежелание прощать'
    }, description: 'Суд — момент пробуждения, когда вы слышите зов своей души.'
}, {
    id: 21, name: 'Мир', nameEn: 'The World', image: '/images/tarot/21-world.jpg', meaning: {
        upright: 'Завершение, целостность, награда', reversed: 'Незавершенность, застой'
    }, description: 'Мир — завершение большого цикла, достижение цели, чувство единства.'
}];

// Определения раскладов
const spreads = {
    single: {
        name: 'Одна карта', positions: ['Ответ'], description: 'Быстрый ответ на конкретный вопрос', cardCount: 1
    },
    three: {
        name: 'Три карты',
        positions: ['Прошлое', 'Настоящее', 'Будущее'],
        description: 'Анализ ситуации во времени',
        cardCount: 3
    },
    five: {
        name: 'Пять карт',
        positions: ['Ситуация', 'Препятствие', 'Совет', 'Внешнее влияние', 'Итог'],
        description: 'Глубокий анализ ситуации',
        cardCount: 5
    },
    celtic: {
        name: 'Кельтский крест',
        positions: ['Суть вопроса', 'Препятствие', 'Цель', 'Прошлое', 'Будущее', 'Сознание', 'Подсознание', 'Внешнее влияние', 'Надежды и страхи', 'Итог'],
        description: 'Полный анализ ситуации',
        cardCount: 10
    }
};

let currentDeck = [];
let selectedSpread = 'three';
let isAnimating = false;

document.addEventListener('DOMContentLoaded', function () {
    console.log('🔮 Tarot.js загружен');

    const form = document.getElementById('tarotForm');
    const shuffleBtn = document.getElementById('shuffleBtn');
    const readingBtn = document.getElementById('readingBtn');
    const newReadingBtn = document.getElementById('newReadingBtn');
    const spreadCards = document.querySelectorAll('.spread-card');
    const cardDeckContainer = document.getElementById('cardDeckContainer');
    const resultSection = document.getElementById('resultSection');
    const loadingSpinner = document.getElementById('loadingSpinner');

    if (!form || !shuffleBtn || !readingBtn) {
        console.error('❌ Не найдены необходимые элементы на странице');
        return;
    }

    // Инициализация колоды
    initializeDeck();

    // Выбор расклада
    spreadCards.forEach(card => {
        card.addEventListener('click', function () {
            spreadCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            selectedSpread = this.dataset.spread;
        });
    });

    // Перетасовка карт
    shuffleBtn.addEventListener('click', function () {
        shuffleDeck();
    });

    // Сделать расклад
    readingBtn.addEventListener('click', function () {
        const question = document.getElementById('question').value.trim();

        if (!question) {
            showNotification('❌ Задайте вопрос', 'error');
            return;
        }

        performReading(question);
    });

    // Новое гадание
    if (newReadingBtn) {
        newReadingBtn.addEventListener('click', function () {
            resetReading();
        });
    }

    function resetReading() {
        resultSection.style.display = 'none';
        document.getElementById('question').value = '';

        const container = document.getElementById('cardDeckContainer');
        const deck = document.getElementById('cardDeck');

        container.style.display = 'flex';
        deck.style.display = 'block';
        deck.style.opacity = '1';

        // Удаляем все классы позиций
        document.querySelectorAll('#cardDeck li').forEach(card => {
            card.classList.remove('fly-card', 'flipped');
            card.style.removeProperty('transform');
            card.style.removeProperty('left');
            card.style.removeProperty('top');
            card.style.opacity = '1';

            const cardBack = card.querySelector('.card-back');
            const cardImg = card.querySelector('img');
            if (cardBack && cardImg) {
                cardBack.style.opacity = '1';
                cardImg.style.display = 'none';
                cardImg.style.transform = '';
            }
        });

        initializeDeck();
    }

    // Инициализация колоды
    function initializeDeck() {
        console.log('🃏 Инициализация колоды...');

        isAnimating = false;
        currentDeck = [...tarotDeck];

        const container = document.getElementById('cardDeckContainer');
        const deck = document.getElementById('cardDeck');

        if (!deck || !container) {
            console.error('❌ Контейнеры не найдены');
            return;
        }

        // Показываем контейнер и очищаем
        container.style.display = 'flex';
        container.style.justifyContent = 'center';
        container.style.alignItems = 'center';
        container.style.minHeight = window.innerWidth <= 768 ? '300px' : '400px';

        deck.innerHTML = '';
        deck.style.position = 'relative';
        deck.style.width = window.innerWidth <= 768 ? '100px' : '150px';
        deck.style.height = window.innerWidth <= 768 ? '166px' : '250px';

        // Создаем все карты колоды
        for (let i = 0; i < currentDeck.length; i++) {
            const card = createCardElement(currentDeck[i], i);
            card.style.position = 'absolute';
            card.style.left = '0';
            card.style.top = i * 2 + 'px';
            card.style.zIndex = i;
            card.style.transform = 'rotate(0deg)';
            deck.appendChild(card);
        }

        console.log('✅ Колода инициализирована, карт:', deck.children.length);
    }

    // Создание элемента карты
    function createCardElement(card, index) {
        const li = document.createElement('li');
        li.dataset.index = index;
        li.dataset.id = card.id;
        li.style.width = window.innerWidth <= 768 ? '100px' : '150px';
        li.style.height = window.innerWidth <= 768 ? '166px' : '250px';
        li.style.borderRadius = '12px';
        li.style.overflow = 'hidden';
        li.style.boxShadow = '0 10px 20px rgba(0,0,0,0.5)';
        li.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
        li.style.cursor = 'pointer';
        li.style.position = 'absolute';
        li.style.backgroundColor = '#2a241e';

        // Изображение карты (скрыто изначально)
        const img = document.createElement('img');
        img.src = card.image;
        img.alt = card.name;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        img.style.display = 'none';

        // Рубашка карты
        const back = document.createElement('div');
        back.className = 'card-back';
        back.style.position = 'absolute';
        back.style.top = '0';
        back.style.left = '0';
        back.style.width = '100%';
        back.style.height = '100%';
        back.style.background = 'linear-gradient(145deg, #2a241e, #1a1510)';
        back.style.border = '2px solid var(--accent-gold)';
        back.style.borderRadius = '12px';
        back.style.display = 'flex';
        back.style.justifyContent = 'center';
        back.style.alignItems = 'center';
        back.style.transition = 'opacity 0.5s ease';
        back.style.pointerEvents = 'none';

        const span = document.createElement('span');
        span.style.fontSize = window.innerWidth <= 768 ? '2rem' : '3rem';
        span.style.color = 'var(--accent-gold)';
        span.textContent = '⛤';
        back.appendChild(span);

        li.appendChild(img);
        li.appendChild(back);

        return li;
    }

    // Перетасовка колоды
    function shuffleDeck() {
        if (isAnimating) return;

        console.log('🔄 Перетасовка колоды...');
        isAnimating = true;

        if (loadingSpinner) loadingSpinner.style.display = 'block';

        const deck = document.getElementById('cardDeck');
        const cards = Array.from(deck.children);

        // Анимация перетасовки
        cards.forEach((card, i) => {
            card.style.transition = 'all 0.5s ease';
            card.style.transform = `translateX(${Math.random() * 100 - 50}px) translateY(${Math.random() * 50 - 25}px) rotate(${Math.random() * 30 - 15}deg)`;
            card.style.zIndex = i + 10;
        });

        setTimeout(() => {
            // Перемешиваем массив
            for (let i = currentDeck.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [currentDeck[i], currentDeck[j]] = [currentDeck[j], currentDeck[i]];
            }

            // Возвращаем карты в стопку
            cards.forEach((card, i) => {
                setTimeout(() => {
                    card.style.transition = 'all 0.3s ease';
                    card.style.transform = 'translateX(0) translateY(0) rotate(0deg)';
                    card.style.left = '0';
                    card.style.top = i * 2 + 'px';
                    card.style.zIndex = i;
                }, i * 50);
            });

            if (loadingSpinner) loadingSpinner.style.display = 'none';
            isAnimating = false;
            showNotification('🔄 Колода перетасована', 'success');
        }, 500);
    }

    // Выполнение расклада
    function performReading(question) {
        if (isAnimating) return;

        console.log('🔮 Выполнение расклада...');
        isAnimating = true;

        if (loadingSpinner) loadingSpinner.style.display = 'block';

        // Сначала показываем контейнер с картами
        const container = document.getElementById('cardDeckContainer');
        const deck = document.getElementById('cardDeck');

        if (container) {
            container.style.display = 'flex';
        }

        if (deck) {
            deck.style.display = 'block';
            deck.style.opacity = '1';
        }

        // Запрос к серверу
        fetchReadingFromServer(question);
    }

    // Запрос к серверу
    async function fetchReadingFromServer(question) {
        try {
            const response = await fetch('/api/tarot/reading', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    question: question,
                    spread: selectedSpread
                })
            });

            const data = await response.json();

            if (data.success) {
                console.log('📦 Получены данные:', data);

                // Обогащаем карты данными
                if (data.data.cards) {
                    data.data.cards.forEach(card => {
                        const deckCard = tarotDeck.find(c => c.id === card.number || c.name === card.name);
                        if (deckCard) {
                            card.image = deckCard.image;
                            card.meaning = deckCard.meaning;
                            card.description = deckCard.description;
                            card.id = deckCard.id;
                        }
                    });
                }

                // Анимация вылета карт
                await animateCardsFlyOut(data.data.cards);

                // Отображаем результаты
                displayResults(data.data);

            } else {
                showNotification('❌ Ошибка: ' + (data.error || 'Неизвестная ошибка'), 'error');
                isAnimating = false;
                if (loadingSpinner) loadingSpinner.style.display = 'none';
            }
        } catch (error) {
            console.error('Ошибка:', error);
            showNotification('❌ Ошибка при подключении к серверу', 'error');
            isAnimating = false;
            if (loadingSpinner) loadingSpinner.style.display = 'none';
        }
    }

    // Анимация вылета карт
    function animateCardsFlyOut(selectedCards) {
        return new Promise((resolve) => {
            console.log('🎬 Анимация вылета карт, выбрано карт:', selectedCards.length);

            const deck = document.getElementById('cardDeck');
            const container = document.getElementById('cardDeckContainer');

            if (!deck || !container) {
                console.error('❌ Контейнеры не найдены');
                resolve();
                return;
            }

            const cards = Array.from(deck.children);

            if (cards.length === 0) {
                console.error('❌ Нет карт в колоде');
                resolve();
                return;
            }

            // Находим индексы выбранных карт в текущей колоде
            const selectedIndices = [];

            selectedCards.forEach(selectedCard => {
                const index = cards.findIndex(c =>
                    parseInt(c.dataset.id) === selectedCard.id ||
                    parseInt(c.dataset.id) === selectedCard.number
                );
                if (index !== -1) {
                    selectedIndices.push(index);
                    console.log(`✅ Найдена карта ${selectedCard.name} с индексом ${index}`);
                } else {
                    console.warn(`⚠️ Карта ${selectedCard.name} не найдена в колоде`);
                }
            });

            if (selectedIndices.length === 0) {
                console.error('❌ Ни одна карта не найдена в колоде');
                resolve();
                return;
            }

            // Сбрасываем позиции всех карт
            cards.forEach(card => {
                card.style.transition = 'none';
                card.style.left = '0';
                card.style.top = '0';
            });

            // Небольшая задержка для применения сброса
            setTimeout(() => {
                // Анимируем каждую карту
                selectedIndices.forEach((index, i) => {
                    setTimeout(() => {
                        if (index >= 0 && index < cards.length) {
                            const card = cards[index];
                            const selectedCard = selectedCards[i];

                            // Добавляем класс с предопределенной позицией
                            card.classList.add('fly-card', `fly-position-${i}`);

                            // Переворачиваем карту через полсекунды
                            setTimeout(() => {
                                const cardBack = card.querySelector('.card-back');
                                const cardImg = card.querySelector('img');

                                if (cardBack && cardImg) {
                                    cardBack.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                                    cardBack.style.opacity = '0';
                                    cardImg.style.display = 'block';

                                    // Если карта перевернута, поворачиваем изображение
                                    if (selectedCard.isReversed) {
                                        cardImg.style.transform = 'rotate(180deg)';
                                    }
                                }
                            }, 500);
                        }
                    }, i * 400);
                });

                // Скрываем оставшиеся карты
                setTimeout(() => {
                    cards.forEach((card, index) => {
                        if (!selectedIndices.includes(index)) {
                            card.style.transition = 'opacity 0.5s ease';
                            card.style.opacity = '0';
                        }
                    });

                    // Завершаем анимацию
                    setTimeout(() => {
                        isAnimating = false;
                        if (loadingSpinner) loadingSpinner.style.display = 'none';
                        console.log('✅ Анимация завершена');
                        resolve();
                    }, 1000);

                }, selectedIndices.length * 400 + 1000);

            }, 50);
        });
    }

    // Отображение результатов
    function displayResults(data) {
        if (!data) return;

        // Обновляем заголовки
        const displayQuestion = document.getElementById('displayQuestion');
        const displaySpread = document.getElementById('displaySpread');
        const interpretationQuestion = document.getElementById('interpretationQuestion');

        if (displayQuestion) displayQuestion.textContent = data.question || '—';
        if (displaySpread) displaySpread.textContent = data.spread?.name || '—';
        if (interpretationQuestion) interpretationQuestion.textContent = `"${data.question || ''}"`;

        // Отображаем карты
        const cardsResults = document.getElementById('cardsResults');
        if (cardsResults && data.cards) {
            cardsResults.innerHTML = '';
            cardsResults.style.opacity = '0';
            cardsResults.style.transform = 'translateY(20px)';

            data.cards.forEach((card, index) => {
                const cardDiv = document.createElement('div');
                cardDiv.className = `card-result-item ${card.isReversed ? 'reversed' : ''}`;
                cardDiv.style.animation = `slideInCard 0.5s ease ${index * 0.15}s forwards`;
                cardDiv.style.opacity = '0';

                const meaning = card.isReversed ?
                    (card.meaning?.reversed || card.keywords) :
                    (card.meaning?.upright || card.keywords);

                const orientation = card.isReversed ? 'Перевернутое положение' : 'Прямое положение';

                cardDiv.innerHTML = `
                    <div class="card-header">
                        <span class="card-name">${card.name || 'Карта'}</span>
                        <span class="card-position">${card.position || ''}</span>
                    </div>
                    <div class="card-meaning">${meaning || ''}</div>
                    <div class="card-orientation">${orientation}</div>
                `;

                cardDiv.addEventListener('click', () => {
                    showCardDetail(card);
                });

                cardsResults.appendChild(cardDiv);
            });

            setTimeout(() => {
                cardsResults.style.transition = 'all 0.6s ease';
                cardsResults.style.opacity = '1';
                cardsResults.style.transform = 'translateY(0)';
            }, 100);
        }

        // Отображаем интерпретацию
        const interpretationAnswer = document.getElementById('interpretationAnswer');
        if (interpretationAnswer) {
            interpretationAnswer.innerHTML = data.interpretation
                ? data.interpretation.replace(/\n/g, '<br>')
                : 'Интерпретация отсутствует';
        }

        // Показываем результаты
        if (resultSection) {
            resultSection.style.display = 'block';
            resultSection.style.opacity = '0';
            resultSection.style.transform = 'translateY(30px)';

            setTimeout(() => {
                resultSection.style.transition = 'all 0.8s ease';
                resultSection.style.opacity = '1';
                resultSection.style.transform = 'translateY(0)';
            }, 100);

            setTimeout(() => {
                resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 600);
        }
    }

    // Показ детальной информации о карте
    function showCardDetail(card) {
        const orientation = card.isReversed ? 'перевернутом' : 'прямом';
        const meaning = card.isReversed ?
            (card.meaning?.reversed || card.keywords) :
            (card.meaning?.upright || card.keywords);
        const description = card.description || 'Описание отсутствует';
        const advice = card.advice || '';

        const modal = document.createElement('div');
        modal.className = 'card-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            backdrop-filter: blur(10px);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
            animation: modalFadeIn 0.3s ease;
        `;

        modal.innerHTML = `
            <div style="
                background: linear-gradient(145deg, #1a1510, #2a241e);
                border: 2px solid var(--accent-gold);
                border-radius: 24px;
                max-width: 800px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                position: relative;
                box-shadow: 0 30px 60px rgba(0,0,0,0.5);
                animation: modalSlideUp 0.4s ease;
            ">
                <div style="
                    padding: 20px 30px;
                    border-bottom: 1px solid rgba(201,165,75,0.3);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 10px;
                ">
                    <h2 style="color: var(--accent-gold); font-size: 2rem; margin: 0;">${card.name}</h2>
                    <span style="
                        font-size: 0.9rem;
                        padding: 5px 15px;
                        border-radius: 30px;
                        background: ${card.isReversed ? 'rgba(139,0,0,0.1)' : 'rgba(201,165,75,0.1)'};
                        border: 1px solid ${card.isReversed ? '#8b0000' : 'var(--accent-gold)'};
                        color: ${card.isReversed ? '#ff6b6b' : 'var(--accent-gold)'};
                    ">
                        ${card.isReversed ? '⚡ Перевернутое положение' : '✨ Прямое положение'}
                    </span>
                    <button class="modal-close" style="
                        background: none;
                        border: none;
                        color: var(--text-secondary);
                        font-size: 2.5rem;
                        cursor: pointer;
                        line-height: 1;
                        padding: 0 10px;
                    ">&times;</button>
                </div>
                <div style="
                    padding: 30px;
                    display: grid;
                    grid-template-columns: ${window.innerWidth <= 768 ? '1fr' : '250px 1fr'};
                    gap: 30px;
                ">
                    <div style="
                        border-radius: 12px;
                        overflow: hidden;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                        border: 1px solid var(--accent-gold);
                        ${window.innerWidth <= 768 ? 'max-width: 200px; margin: 0 auto;' : ''}
                    ">
                        <img src="${card.image}" alt="${card.name}" style="width: 100%; height: auto; display: block;">
                    </div>
                    <div>
                        <div>
                            <h3 style="color: var(--accent-gold); margin: 0 0 10px 0;">Значение</h3>
                            <p style="color: var(--text-secondary); line-height: 1.8; margin: 0 0 20px 0;">${meaning}</p>
                        </div>
                        <div>
                            <h3 style="color: var(--accent-gold); margin: 20px 0 10px 0;">Описание</h3>
                            <p style="color: var(--text-secondary); line-height: 1.8; margin: 0;">${description}</p>
                        </div>
                        ${advice ? `
                            <div style="
                                margin-top: 20px;
                                padding: 15px;
                                background: rgba(201,165,75,0.05);
                                border-left: 4px solid var(--accent-gold);
                                border-radius: 8px;
                            ">
                                <h3 style="color: var(--accent-gold); margin: 0 0 10px 0;">💫 Совет</h3>
                                <p style="color: var(--text-secondary); line-height: 1.8; margin: 0;">${advice}</p>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => {
            modal.style.animation = 'modalFadeOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.animation = 'modalFadeOut 0.3s ease';
                setTimeout(() => {
                    document.body.removeChild(modal);
                }, 300);
            }
        });
    }

    // Уведомления
    function showNotification(message, type = 'info') {
        console.log(`[${type}] ${message}`);

        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            background: ${type === 'error' ? 'rgba(255, 69, 58, 0.9)' :
            type === 'success' ? 'rgba(50, 205, 50, 0.9)' :
                'rgba(201, 165, 75, 0.9)'};
            color: #fff;
            border-radius: 8px;
            z-index: 9999;
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease;
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        notification.innerHTML = `
            <span>${type === 'error' ? '❌' : type === 'success' ? '✅' : '🔮'}</span>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
});