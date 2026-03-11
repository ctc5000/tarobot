document.addEventListener('DOMContentLoaded', function() {
    console.log('🔮 Numerology.js загружен');

    const form = document.getElementById('numerologyForm');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const resultSection = document.getElementById('resultSection');
    const newCalculationBtn = document.getElementById('newCalculationBtn');

    if (!form) {
        console.error('❌ Форма с id="numerologyForm" не найдена!');
        return;
    }

    // Проверяем наличие liveCalculator
    if (typeof LiveCalculator !== 'undefined' && !window.liveCalculator) {
        window.liveCalculator = new LiveCalculator();
    } else if (!window.liveCalculator) {
        console.warn('⚠️ LiveCalculator не найден, создаем упрощенную версию');
        window.liveCalculator = {
            calculateWithEffect: async function(form, button, callback) {
                console.log('🔄 Упрощенный расчет');
                button.disabled = true;
                button.innerHTML = '<span class="button-text">🔮 Расчет...</span>';

                await callback();

                button.disabled = false;
                button.innerHTML = '<span class="button-text">✨ Рассчитать судьбу</span>';
            },
            createSparks: function() {},
            sleep: function(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }
        };
    }

    addFormFieldEffects();

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('📤 Форма отправлена');

        const fullName = document.getElementById('fullName').value.trim();
        const birthDate = document.getElementById('birthDate').value.trim();

        if (!validateForm(fullName, birthDate)) return;

        if (loadingSpinner) loadingSpinner.style.display = 'block';

        try {
            await window.liveCalculator.calculateWithEffect(
                form,
                form.querySelector('button[type="submit"]'),
                async () => {
                    try {
                        const response = await fetch('/api/calculate/numerology', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ fullName, birthDate })
                        });

                        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                        const data = await response.json();

                        if (data.success) {
                            await window.liveCalculator.sleep(500);

                            // Сохраняем данные для дополнительных расчетов
                            window.currentNumerologyData = data.data;

                            displayResults(data.data);

                            if (resultSection) {
                                resultSection.style.display = 'block';
                                resultSection.classList.add('fade-in');
                                resultSection.scrollIntoView({ behavior: 'smooth' });
                            }

                            form.style.display = 'none';
                            showNotification('✨ Судьба раскрыта!', 'success');

                            for (let i = 0; i < 5; i++) {
                                window.liveCalculator.createSparks();
                            }
                        } else {
                            showNotification('❌ Ошибка: ' + (data.error || 'Неизвестная ошибка'), 'error');
                        }
                    } catch (error) {
                        console.error('❌ Ошибка:', error);
                        showNotification('❌ Ошибка при подключении к серверу: ' + error.message, 'error');
                    }
                }
            );
        } catch (error) {
            console.error('❌ Ошибка:', error);
            showNotification('❌ Произошла внутренняя ошибка', 'error');
        } finally {
            if (loadingSpinner) loadingSpinner.style.display = 'none';
        }
    });

    if (newCalculationBtn) {
        newCalculationBtn.addEventListener('click', function() {
            if (resultSection) {
                resultSection.classList.remove('fade-in');
                resultSection.style.display = 'none';
            }
            form.style.display = 'block';
            form.reset();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            showNotification('✨ Готов к новым открытиям!', 'info');
        });
    }

    // Добавляем обработчики для кнопок дополнительных расчетов
    setupAdditionalCalculations();

    const tabBtns = document.querySelectorAll('.tab-btn');
    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const tabId = this.dataset.tab;

                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => {
                    c.classList.remove('active');
                    c.classList.remove('fade-in');
                });

                this.classList.add('active');
                const tabElement = document.getElementById('tab' + tabId.charAt(0).toUpperCase() + tabId.slice(1));

                if (tabElement) {
                    tabElement.classList.add('active', 'fade-in');
                    if (window.liveCalculator) {
                        window.liveCalculator.createSparks();
                    }
                }
            });
        });
    }

    addResultCardEffects();
});

// ==================== ФУНКЦИИ РАСЧЕТА ТЕКСТОВЫХ ОПИСАНИЙ ====================

function calculateCareer(numbers) {
    const careerNum = calculateCareerNumber(numbers);
    const successNum = calculateSuccessNumber(numbers);
    const realizationNum = calculateRealizationNumber(numbers);

    const descriptions = {
        1: 'Вы прирожденный лидер. Вам подходят руководящие должности, управление проектами, политика. Ваша карьера будет успешной там, где нужно принимать решения и вести за собой людей.',
        2: 'Вы дипломат и миротворец. Вам подходят профессии, связанные с переговорами, психологией, дипломатией. Вы отлично работаете в команде и умеете сглаживать конфликты.',
        3: 'Вы творческая личность. Вам подходят профессии в сфере искусства, дизайна, журналистики, рекламы. Ваша карьера расцветет там, где есть место самовыражению.',
        4: 'Вы надежный организатор. Вам подходят профессии, требующие системности: бухгалтерия, администрирование, строительство. Вы умеете создавать порядок из хаоса.',
        5: 'Вы исследователь и путешественник. Вам подходят профессии, связанные с поездками, коммуникациями, торговлей. Вам важно разнообразие и свобода в работе.',
        6: 'Вы наставник и заботливый руководитель. Вам подходят профессии в образовании, медицине, социальной сфере. Вы умеете заботиться о других и создавать комфорт.',
        7: 'Вы аналитик и исследователь. Вам подходят профессии в науке, IT, аналитике, философии. Вы любите глубоко изучать вопросы и находить скрытые закономерности.',
        8: 'Вы прирожденный управленец и финансист. Вам подходят профессии в бизнесе, финансах, управлении крупными проектами. Вы умеете зарабатывать и управлять ресурсами.',
        9: 'Вы гуманист и универсал. Вам подходят профессии, где вы можете помогать многим: международные организации, благотворительность, образование. Вы способны охватывать глобальные задачи.'
    };

    return `
        <p><strong>Ваше карьерное число: ${careerNum}</strong></p>
        <p>${descriptions[careerNum] || 'У вас уникальный карьерный путь.'}</p>
        <p><strong>Число успеха (${successNum}):</strong> ${getSuccessDescription(successNum)}</p>
        <p><strong>Число реализации (${realizationNum}):</strong> ${getRealizationDescription(realizationNum)}</p>
    `;
}

function calculateFamily(numbers) {
    const familyNum = calculateFamilyNumber(numbers);
    const partnerNum = calculatePartnerNumber(numbers);
    const childrenNum = calculateChildrenNumber(numbers);

    const descriptions = {
        1: 'В семье вы лидер и глава. Вам важно, чтобы ваше мнение уважали. Склонны принимать решения самостоятельно.',
        2: 'В семье вы хранитель гармонии. Умеете сглаживать конфликты и создавать уют. Цените партнерские отношения.',
        3: 'В семье вы источник радости и вдохновения. Любите праздники, общение с детьми, творческую атмосферу.',
        4: 'В семье вы строитель и опора. Создаете стабильность, традиции, материальную базу. Цените надежность.',
        5: 'В семье вы цените свободу. Вам важно личное пространство. Можете быть непостоянны в быту, но интересны как партнер.',
        6: 'В семье вы заботливый родитель и партнер. Готовы жертвовать собой ради близких. Идеальный семьянин.',
        7: 'В семье вы немного отстранены, погружены в себя. Вам нужно личное пространство. Цените духовную близость.',
        8: 'В семье вы ответственный лидер. Обеспечиваете семью материально, принимаете важные решения. Требовательны к домочадцам.',
        9: 'В семье вы универсальный партнер. Можете быть разным, подстраиваетесь под ситуацию. Цените гармонию и взаимопонимание.'
    };

    return `
        <p><strong>Ваше семейное число: ${familyNum}</strong></p>
        <p>${descriptions[familyNum] || 'У вас уникальный семейный путь.'}</p>
        <p><strong>Число партнера (${partnerNum}):</strong> ${getPartnerDescription(partnerNum)}</p>
        <p><strong>Число детей (${childrenNum}):</strong> ${getChildrenDescription(childrenNum)}</p>
    `;
}

function calculateLove(numbers) {
    const loveNum = calculateLoveNumber(numbers);
    const compatibility = calculateCompatibility(numbers);

    const descriptions = {
        1: 'Вы страстный и инициативный партнер. Любите завоевывать, проявлять инициативу. Вам нужен партнер, который сможет оценить вашу энергию.',
        2: 'Вы нежный и романтичный партнер. Цените гармонию и взаимопонимание. Вам важно чувствовать эмоциональную связь с партнером.',
        3: 'Вы веселый и общительный партнер. Любите флирт, ухаживания, романтику. Вам нужен партнер, с которым интересно.',
        4: 'Вы верный и надежный партнер. Отношения для вас — это ответственность. Цените стабильность и предсказуемость.',
        5: 'Вы свободолюбивый партнер. Боитесь рутины, нуждаетесь в разнообразии. Вам нужен партнер, который даст вам свободу.',
        6: 'Вы заботливый и преданный партнер. Готовы отдавать себя отношениям полностью. Ищете партнера, который оценит вашу заботу.',
        7: 'Вы глубокий и загадочный партнер. Вам нужна духовная близость, общие интересы. Не терпите поверхностных отношений.',
        8: 'Вы ответственный и серьезный партнер. Отношения для вас — проект. Цените партнера, который разделяет ваши цели.',
        9: 'Вы универсальный партнер. Можете быть разным в разных отношениях. Ищете партнера, который примет вас целиком.'
    };

    let compatibilityText = '';
    if (compatibility >= 80) compatibilityText = 'У вас отличная совместимость с большинством партнеров. Вы легко строите отношения.';
    else if (compatibility >= 60) compatibilityText = 'У вас хорошая совместимость. Важно найти партнера, который разделяет ваши ценности.';
    else if (compatibility >= 40) compatibilityText = 'Средняя совместимость. Отношения требуют работы и взаимопонимания.';
    else compatibilityText = 'Сложная совместимость. Вам нужен особенный партнер, который поймет вашу глубину.';

    return `
        <p><strong>Ваше число любви: ${loveNum}</strong></p>
        <p>${descriptions[loveNum] || 'У вас уникальный путь в любви.'}</p>
        <p><strong>Совместимость: ${compatibility}%</strong> — ${compatibilityText}</p>
    `;
}

function calculateMoney(numbers) {
    const moneyNum = calculateMoneyNumber(numbers);
    const abundanceNum = calculateAbundanceNumber(numbers);

    const descriptions = {
        1: 'Вы зарабатываете лидерством и инициативой. Деньги приходят к вам через новые проекты, руководящие должности. Вы можете быть первопроходцем в финансовых вопросах.',
        2: 'Вы зарабатываете через партнерства и дипломатию. Деньги приходят через отношения, сотрудничество, посредничество. Вам важно уметь договариваться.',
        3: 'Вы зарабатываете творчеством и коммуникацией. Деньги приходят через искусство, рекламу, обучение, развлечения. Ваш оптимизм притягивает финансы.',
        4: 'Вы зарабатываете системным трудом и дисциплиной. Деньги приходят через стабильную работу, долгосрочные проекты, недвижимость. Вы умеете накапливать.',
        5: 'Вы зарабатываете через свободу и риски. Деньги приходят через торговлю, путешествия, предпринимательство. Вам важна финансовая свобода.',
        6: 'Вы зарабатываете через заботу и сервис. Деньги приходят через обслуживание, медицину, образование, помощь другим. Вы умеете создавать комфорт за деньги.',
        7: 'Вы зарабатываете через знания и аналитику. Деньги приходят через науку, IT, консалтинг, эзотерику. Вам важно монетизировать свои знания.',
        8: 'Вы прирожденный финансист. Деньги идут к вам легко, если вы управляете крупными проектами, инвестируете, занимаетесь бизнесом. У вас талант к приумножению.',
        9: 'Вы зарабатываете через глобальные проекты и благотворительность. Деньги приходят, когда вы служите обществу, работаете в международных организациях.'
    };

    return `
        <p><strong>Ваше финансовое число: ${moneyNum}</strong></p>
        <p>${descriptions[moneyNum] || 'У вас уникальный финансовый путь.'}</p>
        <p><strong>Число изобилия (${abundanceNum}):</strong> ${getAbundanceDescription(abundanceNum)}</p>
    `;
}

function calculateHealth(numbers) {
    const healthNum = calculateHealthNumber(numbers);
    const energyNum = calculateEnergyNumber(numbers);

    const descriptions = {
        1: 'У вас сильная жизненная энергия. Вы активны и выносливы. Склонны к перегрузкам — важно вовремя отдыхать. Слабое место: сердце, давление.',
        2: 'У вас чувствительная энергетика. Ваше здоровье зависит от эмоционального состояния. Склонны к психосоматике. Слабое место: желудок, лимфа.',
        3: 'У вас подвижная энергия. Вы быстро восстанавливаетесь, но легко истощаетесь. Слабое место: нервная система, горло, щитовидная железа.',
        4: 'У вас устойчивая энергетика. Вы выносливы и стабильны. Склонны к застойным явлениям. Слабое место: опорно-двигательный аппарат, зубы.',
        5: 'У вас переменчивая энергия. То подъем, то спад. Важно соблюдать режим. Слабое место: бронхи, легкие, кожа.',
        6: 'У вас гармоничная энергетика. Вы уравновешены и спокойны. Склонны к перееданию. Слабое место: почки, репродуктивная система.',
        7: 'У вас глубокая энергетика. Вы чувствительны к тонким воздействиям. Склонны к меланхолии. Слабое место: кишечник, нервная система.',
        8: 'У вас мощная энергетика. Вы сильны и выносливы. Склонны к перегрузкам и гипертонии. Слабое место: печень, желчный пузырь.',
        9: 'У вас универсальная энергетика. Вы адаптивны, но можете распыляться. Слабое место: иммунная система, кровь.'
    };

    let energyText = '';
    if (energyNum >= 8) energyText = 'У вас высокий уровень энергии. Вы активны и жизнерадостны.';
    else if (energyNum >= 5) energyText = 'У вас средний уровень энергии. Важно поддерживать баланс.';
    else energyText = 'У вас пониженный уровень энергии. Вам нужно больше отдыхать и восстанавливаться.';

    return `
        <p><strong>Ваше число здоровья: ${healthNum}</strong></p>
        <p>${descriptions[healthNum] || 'У вас уникальная энергетика.'}</p>
        <p><strong>Уровень энергии: ${energyNum}/10</strong> — ${energyText}</p>
    `;
}

function calculateTalent(numbers) {
    const talentNum = calculateTalentNumber(numbers);
    const potentialNum = calculatePotentialNumber(numbers);

    const descriptions = {
        1: 'Ваш талант — лидерство и инициатива. Вы умеете начинать новые проекты, вести за собой людей, принимать решения. Вам подходит руководящая работа.',
        2: 'Ваш талант — дипломатия и эмпатия. Вы умеете сглаживать конфликты, находить общий язык с разными людьми, создавать гармонию. Вам подходит работа с людьми.',
        3: 'Ваш талант — творчество и самовыражение. Вы умеете создавать красивое, вдохновлять, развлекать. Вам подходит искусство, дизайн, журналистика.',
        4: 'Ваш талант — организация и структурирование. Вы умеете создавать порядок, системы, планировать. Вам подходит администрирование, бухгалтерия, строительство.',
        5: 'Ваш талант — коммуникация и адаптация. Вы легко находите общий язык, быстро учитесь, умеете продавать. Вам подходит торговля, PR, путешествия.',
        6: 'Ваш талант — забота и наставничество. Вы умеете помогать, учить, лечить, создавать комфорт. Вам подходит педагогика, медицина, психология.',
        7: 'Ваш талант — анализ и исследование. Вы умеете глубоко изучать вопросы, находить закономерности, видеть скрытое. Вам подходит наука, IT, аналитика.',
        8: 'Ваш талант — управление и финансы. Вы умеете управлять ресурсами, людьми, проектами. Вам подходит бизнес, финансы, крупные проекты.',
        9: 'Ваш талант — универсальность и глобальное мышление. Вы способны охватывать разные сферы, видеть картину целиком. Вам подходят международные проекты.'
    };

    return `
        <p><strong>Ваше число таланта: ${talentNum}</strong></p>
        <p>${descriptions[talentNum] || 'У вас уникальные таланты.'}</p>
        <p><strong>Потенциал реализации: ${potentialNum}%</strong></p>
        <p>${getPotentialDescription(potentialNum)}</p>
    `;
}

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ДЛЯ ОПИСАНИЙ ====================

function getSuccessDescription(num) {
    const descriptions = {
        1: 'Успех приходит через лидерство и самостоятельные проекты',
        2: 'Успех приходит через партнерства и сотрудничество',
        3: 'Успех приходит через творчество и самовыражение',
        4: 'Успех приходит через системный труд и дисциплину',
        5: 'Успех приходит через свободу и перемены',
        6: 'Успех приходит через заботу о других',
        7: 'Успех приходит через глубокие знания',
        8: 'Успех приходит через управление и финансы',
        9: 'Успех приходит через служение обществу'
    };
    return descriptions[num] || 'Успех придет через раскрытие вашего потенциала';
}

function getRealizationDescription(num) {
    const descriptions = {
        1: 'Реализуетесь как лидер, руководитель',
        2: 'Реализуетесь в партнерстве, дипломатии',
        3: 'Реализуетесь в творчестве, искусстве',
        4: 'Реализуетесь в создании структур и порядка',
        5: 'Реализуетесь в путешествиях, коммуникациях',
        6: 'Реализуетесь в заботе, образовании',
        7: 'Реализуетесь в науке, аналитике',
        8: 'Реализуетесь в бизнесе, управлении',
        9: 'Реализуетесь в глобальных проектах'
    };
    return descriptions[num] || 'Реализуетесь, следуя своему призванию';
}

function getPartnerDescription(num) {
    const descriptions = {
        1: 'Вам нужен партнер, который уважает ваше лидерство',
        2: 'Вам нужен нежный и понимающий партнер',
        3: 'Вам нужен веселый и творческий партнер',
        4: 'Вам нужен надежный и стабильный партнер',
        5: 'Вам нужен свободолюбивый партнер',
        6: 'Вам нужен заботливый и преданный партнер',
        7: 'Вам нужен глубокий и понимающий партнер',
        8: 'Вам нужен ответственный и серьезный партнер',
        9: 'Вам нужен универсальный и гибкий партнер'
    };
    return descriptions[num] || 'Партнер, который поймет и примет вас';
}

function getChildrenDescription(num) {
    if (num <= 0) return 'Вам важно найти баланс между свободой и семейными обязательствами';
    if (num === 1) return 'Один ребенок, к которому вы будете очень привязаны';
    if (num === 2) return 'Двое детей — гармоничная семья';
    if (num === 3) return 'Трое детей — большая и дружная семья';
    if (num >= 4) return 'Возможность многодетной семьи или работа с детьми';
    return 'Гармоничные отношения с детьми';
}

function getAbundanceDescription(num) {
    const descriptions = {
        1: 'Изобилие приходит, когда вы проявляете инициативу',
        2: 'Изобилие приходит через партнерства',
        3: 'Изобилие приходит через творчество',
        4: 'Изобилие приходит через стабильность и порядок',
        5: 'Изобилие приходит через свободу и перемены',
        6: 'Изобилие приходит через заботу о других',
        7: 'Изобилие приходит через знания',
        8: 'Изобилие приходит через управление финансами',
        9: 'Изобилие приходит через служение'
    };
    return descriptions[num] || 'Изобилие придет, когда вы будете в гармонии с собой';
}

function getPotentialDescription(percent) {
    if (percent >= 80) return 'У вас огромный потенциал. Главное — не бояться его реализовывать.';
    if (percent >= 60) return 'Хороший потенциал. Развивайте свои сильные стороны.';
    if (percent >= 40) return 'Средний потенциал. Важно найти свою нишу.';
    return 'Потенциал требует раскрытия через развитие и обучение.';
}

// ==================== ФУНКЦИИ ДЛЯ НАСТРОЙКИ ИНТЕРФЕЙСА ====================

function setupAdditionalCalculations() {
    // Создаем контейнер для кнопок дополнительных расчетов, если его нет
    if (!document.getElementById('additionalCalculations')) {
        const resultCard = document.querySelector('.result-card');
        if (resultCard) {
            const additionalDiv = document.createElement('div');
            additionalDiv.id = 'additionalCalculations';
            additionalDiv.className = 'additional-calculations';
            additionalDiv.innerHTML = `
                <h3>🔮 ДОПОЛНИТЕЛЬНЫЕ РАСЧЕТЫ</h3>
                <div class="additional-buttons">
                    <button class="calc-btn" data-calc="career">
                        <span class="calc-icon">💼</span>
                        <span class="calc-title">Карьера</span>
                    </button>
                    <button class="calc-btn" data-calc="family">
                        <span class="calc-icon">👨‍👩‍👧‍👦</span>
                        <span class="calc-title">Семья</span>
                    </button>
                    <button class="calc-btn" data-calc="love">
                        <span class="calc-icon">❤️</span>
                        <span class="calc-title">Любовь</span>
                    </button>
                    <button class="calc-btn" data-calc="money">
                        <span class="calc-icon">💰</span>
                        <span class="calc-title">Финансы</span>
                    </button>
                    <button class="calc-btn" data-calc="health">
                        <span class="calc-icon">🌿</span>
                        <span class="calc-title">Здоровье</span>
                    </button>
                    <button class="calc-btn" data-calc="talent">
                        <span class="calc-icon">⭐</span>
                        <span class="calc-title">Таланты</span>
                    </button>
                </div>
                <div id="additionalResult" class="additional-result"></div>
            `;

            // Вставляем после матрицы чисел
            const numerologyGrid = document.querySelector('.numerology-grid');
            if (numerologyGrid) {
                numerologyGrid.parentNode.insertBefore(additionalDiv, numerologyGrid.nextSibling);
            } else {
                resultCard.appendChild(additionalDiv);
            }

            // Добавляем обработчики для кнопок
            document.querySelectorAll('.calc-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const calcType = this.dataset.calc;
                    performAdditionalCalculation(calcType);
                });
            });
        }
    }
}

// Функция для выполнения дополнительных расчетов
function performAdditionalCalculation(type) {
    if (!window.currentNumerologyData) {
        showNotification('❌ Сначала выполните основной расчет', 'error');
        return;
    }

    const data = window.currentNumerologyData;
    const numbers = data.numerology.base;
    const resultDiv = document.getElementById('additionalResult');

    let result = '';
    let matrix = '';

    switch(type) {
        case 'career':
            result = calculateCareer(numbers);
            matrix = buildCareerMatrix(numbers);
            break;
        case 'family':
            result = calculateFamily(numbers);
            matrix = buildFamilyMatrix(numbers);
            break;
        case 'love':
            result = calculateLove(numbers);
            matrix = buildLoveMatrix(numbers);
            break;
        case 'money':
            result = calculateMoney(numbers);
            matrix = buildMoneyMatrix(numbers);
            break;
        case 'health':
            result = calculateHealth(numbers);
            matrix = buildHealthMatrix(numbers);
            break;
        case 'talent':
            result = calculateTalent(numbers);
            matrix = buildTalentMatrix(numbers);
            break;
    }

    resultDiv.innerHTML = `
        <div class="calculation-result fade-in">
            <h4>${getCalculationTitle(type)}</h4>
            ${matrix}
            <div class="result-text">${result}</div>
        </div>
    `;

    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Функция для получения заголовка расчета
function getCalculationTitle(type) {
    const titles = {
        career: '💼 КАРЬЕРНЫЙ ПОТЕНЦИАЛ',
        family: '👨‍👩‍👧‍👦 СЕМЕЙНАЯ ГАРМОНИЯ',
        love: '❤️ ЛЮБОВНАЯ СОВМЕСТИМОСТЬ',
        money: '💰 ФИНАНСОВЫЙ ПОТОК',
        health: '🌿 ЭНЕРГИЯ ЗДОРОВЬЯ',
        talent: '⭐ СКРЫТЫЕ ТАЛАНТЫ'
    };
    return titles[type] || 'ДОПОЛНИТЕЛЬНЫЙ РАСЧЕТ';
}

// ==================== ФУНКЦИИ ПОСТРОЕНИЯ МАТРИЦ ====================

function buildCareerMatrix(numbers) {
    const careerNum = calculateCareerNumber(numbers);
    const successNum = calculateSuccessNumber(numbers);
    const realizationNum = calculateRealizationNumber(numbers);

    return `
        <div class="number-matrix">
            <div class="matrix-row">
                <div class="matrix-cell ${careerNum === 1 ? 'highlight' : ''}">1<br><small>Лидер</small></div>
                <div class="matrix-cell ${careerNum === 2 ? 'highlight' : ''}">2<br><small>Дипломат</small></div>
                <div class="matrix-cell ${careerNum === 3 ? 'highlight' : ''}">3<br><small>Творец</small></div>
            </div>
            <div class="matrix-row">
                <div class="matrix-cell ${careerNum === 4 ? 'highlight' : ''}">4<br><small>Организатор</small></div>
                <div class="matrix-cell ${careerNum === 5 ? 'highlight' : ''}">5<br><small>Исследователь</small></div>
                <div class="matrix-cell ${careerNum === 6 ? 'highlight' : ''}">6<br><small>Наставник</small></div>
            </div>
            <div class="matrix-row">
                <div class="matrix-cell ${careerNum === 7 ? 'highlight' : ''}">7<br><small>Аналитик</small></div>
                <div class="matrix-cell ${careerNum === 8 ? 'highlight' : ''}">8<br><small>Управленец</small></div>
                <div class="matrix-cell ${careerNum === 9 ? 'highlight' : ''}">9<br><small>Гуманист</small></div>
            </div>
        </div>
        <div class="matrix-footer">
            <span class="matrix-label">Число успеха: <strong>${successNum}</strong></span>
            <span class="matrix-label">Число реализации: <strong>${realizationNum}</strong></span>
        </div>
    `;
}

function buildFamilyMatrix(numbers) {
    const familyNum = calculateFamilyNumber(numbers);
    const partnerNum = calculatePartnerNumber(numbers);
    const childrenNum = calculateChildrenNumber(numbers);

    return `
        <div class="family-matrix">
            <div class="matrix-row">
                <div class="matrix-cell ${familyNum === 1 ? 'highlight' : ''}">1<br><small>Глава</small></div>
                <div class="matrix-cell ${familyNum === 2 ? 'highlight' : ''}">2<br><small>Хранитель</small></div>
                <div class="matrix-cell ${familyNum === 3 ? 'highlight' : ''}">3<br><small>Вдохновитель</small></div>
            </div>
            <div class="matrix-row">
                <div class="matrix-cell ${familyNum === 4 ? 'highlight' : ''}">4<br><small>Строитель</small></div>
                <div class="matrix-cell ${familyNum === 5 ? 'highlight' : ''}">5<br><small>Свободный</small></div>
                <div class="matrix-cell ${familyNum === 6 ? 'highlight' : ''}">6<br><small>Заботливый</small></div>
            </div>
            <div class="matrix-row">
                <div class="matrix-cell ${familyNum === 7 ? 'highlight' : ''}">7<br><small>Мудрец</small></div>
                <div class="matrix-cell ${familyNum === 8 ? 'highlight' : ''}">8<br><small>Справедливый</small></div>
                <div class="matrix-cell ${familyNum === 9 ? 'highlight' : ''}">9<br><small>Универсальный</small></div>
            </div>
        </div>
        <div class="matrix-footer">
            <span class="matrix-label">Партнер: <strong>${partnerNum}</strong></span>
            <span class="matrix-label">Дети: <strong>${childrenNum}</strong></span>
        </div>
    `;
}

function buildLoveMatrix(numbers) {
    const loveNum = calculateLoveNumber(numbers);
    const compatibility = calculateCompatibility(numbers);

    return `
        <div class="love-matrix">
            <div class="matrix-row">
                <div class="matrix-cell ${loveNum === 1 ? 'highlight' : ''}">1<br><small>Страстный</small></div>
                <div class="matrix-cell ${loveNum === 2 ? 'highlight' : ''}">2<br><small>Нежный</small></div>
                <div class="matrix-cell ${loveNum === 3 ? 'highlight' : ''}">3<br><small>Романтик</small></div>
            </div>
            <div class="matrix-row">
                <div class="matrix-cell ${loveNum === 4 ? 'highlight' : ''}">4<br><small>Верный</small></div>
                <div class="matrix-cell ${loveNum === 5 ? 'highlight' : ''}">5<br><small>Свободный</small></div>
                <div class="matrix-cell ${loveNum === 6 ? 'highlight' : ''}">6<br><small>Заботливый</small></div>
            </div>
            <div class="matrix-row">
                <div class="matrix-cell ${loveNum === 7 ? 'highlight' : ''}">7<br><small>Глубокий</small></div>
                <div class="matrix-cell ${loveNum === 8 ? 'highlight' : ''}">8<br><small>Ответственный</small></div>
                <div class="matrix-cell ${loveNum === 9 ? 'highlight' : ''}">9<br><small>Универсальный</small></div>
            </div>
        </div>
        <div class="matrix-footer">
            <span class="matrix-label">Совместимость: <strong>${compatibility}%</strong></span>
        </div>
    `;
}

function buildMoneyMatrix(numbers) {
    const moneyNum = calculateMoneyNumber(numbers);
    const abundanceNum = calculateAbundanceNumber(numbers);

    return `
        <div class="money-matrix">
            <div class="matrix-row">
                <div class="matrix-cell ${moneyNum === 1 ? 'highlight' : ''}">1<br><small>Заработчик</small></div>
                <div class="matrix-cell ${moneyNum === 2 ? 'highlight' : ''}">2<br><small>Накопитель</small></div>
                <div class="matrix-cell ${moneyNum === 3 ? 'highlight' : ''}">3<br><small>Тратящий</small></div>
            </div>
            <div class="matrix-row">
                <div class="matrix-cell ${moneyNum === 4 ? 'highlight' : ''}">4<br><small>Инвестор</small></div>
                <div class="matrix-cell ${moneyNum === 5 ? 'highlight' : ''}">5<br><small>Рисковый</small></div>
                <div class="matrix-cell ${moneyNum === 6 ? 'highlight' : ''}">6<br><small>Щедрый</small></div>
            </div>
            <div class="matrix-row">
                <div class="matrix-cell ${moneyNum === 7 ? 'highlight' : ''}">7<br><small>Философ</small></div>
                <div class="matrix-cell ${moneyNum === 8 ? 'highlight' : ''}">8<br><small>Магнат</small></div>
                <div class="matrix-cell ${moneyNum === 9 ? 'highlight' : ''}">9<br><small>Благотворитель</small></div>
            </div>
        </div>
        <div class="matrix-footer">
            <span class="matrix-label">Число изобилия: <strong>${abundanceNum}</strong></span>
        </div>
    `;
}

function buildHealthMatrix(numbers) {
    const healthNum = calculateHealthNumber(numbers);
    const energyNum = calculateEnergyNumber(numbers);

    return `
        <div class="health-matrix">
            <div class="matrix-row">
                <div class="matrix-cell ${healthNum === 1 ? 'highlight' : ''}">1<br><small>Активный</small></div>
                <div class="matrix-cell ${healthNum === 2 ? 'highlight' : ''}">2<br><small>Гармоничный</small></div>
                <div class="matrix-cell ${healthNum === 3 ? 'highlight' : ''}">3<br><small>Жизнерадостный</small></div>
            </div>
            <div class="matrix-row">
                <div class="matrix-cell ${healthNum === 4 ? 'highlight' : ''}">4<br><small>Выносливый</small></div>
                <div class="matrix-cell ${healthNum === 5 ? 'highlight' : ''}">5<br><small>Подвижный</small></div>
                <div class="matrix-cell ${healthNum === 6 ? 'highlight' : ''}">6<br><small>Уравновешенный</small></div>
            </div>
            <div class="matrix-row">
                <div class="matrix-cell ${healthNum === 7 ? 'highlight' : ''}">7<br><small>Спокойный</small></div>
                <div class="matrix-cell ${healthNum === 8 ? 'highlight' : ''}">8<br><small>Сильный</small></div>
                <div class="matrix-cell ${healthNum === 9 ? 'highlight' : ''}">9<br><small>Универсальный</small></div>
            </div>
        </div>
        <div class="matrix-footer">
            <span class="matrix-label">Энергия: <strong>${energyNum}/10</strong></span>
        </div>
    `;
}

function buildTalentMatrix(numbers) {
    const talentNum = calculateTalentNumber(numbers);
    const potentialNum = calculatePotentialNumber(numbers);

    return `
        <div class="talent-matrix">
            <div class="matrix-row">
                <div class="matrix-cell ${talentNum === 1 ? 'highlight' : ''}">1<br><small>Лидерство</small></div>
                <div class="matrix-cell ${talentNum === 2 ? 'highlight' : ''}">2<br><small>Дипломатия</small></div>
                <div class="matrix-cell ${talentNum === 3 ? 'highlight' : ''}">3<br><small>Творчество</small></div>
            </div>
            <div class="matrix-row">
                <div class="matrix-cell ${talentNum === 4 ? 'highlight' : ''}">4<br><small>Организация</small></div>
                <div class="matrix-cell ${talentNum === 5 ? 'highlight' : ''}">5<br><small>Коммуникация</small></div>
                <div class="matrix-cell ${talentNum === 6 ? 'highlight' : ''}">6<br><small>Забота</small></div>
            </div>
            <div class="matrix-row">
                <div class="matrix-cell ${talentNum === 7 ? 'highlight' : ''}">7<br><small>Аналитика</small></div>
                <div class="matrix-cell ${talentNum === 8 ? 'highlight' : ''}">8<br><small>Управление</small></div>
                <div class="matrix-cell ${talentNum === 9 ? 'highlight' : ''}">9<br><small>Гуманизм</small></div>
            </div>
        </div>
        <div class="matrix-footer">
            <span class="matrix-label">Потенциал: <strong>${potentialNum}%</strong></span>
        </div>
    `;
}

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ДЛЯ РАСЧЕТОВ ====================

function calculateCareerNumber(numbers) {
    // Сумма числа судьбы и имени
    return reduceNumber((numbers.fate + numbers.name) % 9 || 9);
}

function calculateSuccessNumber(numbers) {
    // Число успеха = сумма всех чисел
    return reduceNumber(numbers.fate + numbers.name + numbers.surname + numbers.patronymic);
}

function calculateRealizationNumber(numbers) {
    // Число реализации = число судьбы + число рода
    return reduceNumber(numbers.fate + numbers.surname);
}

function calculateFamilyNumber(numbers) {
    // Семейное число = число рода + число отчества
    return reduceNumber(numbers.surname + numbers.patronymic);
}

function calculatePartnerNumber(numbers) {
    // Число партнера = число имени + 6
    return reduceNumber(numbers.name + 6);
}

function calculateChildrenNumber(numbers) {
    // Число детей = число семьи - 3
    return Math.abs(reduceNumber(calculateFamilyNumber(numbers) - 3));
}

function calculateLoveNumber(numbers) {
    // Число любви = число имени + число судьбы
    return reduceNumber(numbers.name + numbers.fate);
}

function calculateCompatibility(numbers) {
    // Совместимость в процентах
    const love = calculateLoveNumber(numbers);
    const family = calculateFamilyNumber(numbers);
    return Math.min(100, Math.floor((love + family) * 5.5));
}

function calculateMoneyNumber(numbers) {
    // Финансовое число = число судьбы * 2
    return reduceNumber(numbers.fate * 2);
}

function calculateAbundanceNumber(numbers) {
    // Число изобилия = сумма финансового и карьерного
    const money = calculateMoneyNumber(numbers);
    const career = calculateCareerNumber(numbers);
    return reduceNumber(money + career);
}

function calculateHealthNumber(numbers) {
    // Число здоровья = 10 - (число судьбы % 9)
    return 10 - (numbers.fate % 9 || 9);
}

function calculateEnergyNumber(numbers) {
    // Уровень энергии от 1 до 10
    return (numbers.name % 10) + 1;
}

function calculateTalentNumber(numbers) {
    // Число таланта = число имени * 2
    return reduceNumber(numbers.name * 2);
}

function calculatePotentialNumber(numbers) {
    // Потенциал в процентах
    const talent = calculateTalentNumber(numbers);
    return Math.min(100, talent * 11);
}

function reduceNumber(num) {
    while (num > 9 && num !== 11 && num !== 22) {
        num = String(num).split('').reduce((sum, digit) => sum + parseInt(digit), 0);
    }
    return num;
}

// ==================== ФУНКЦИИ ВАЛИДАЦИИ И ЭФФЕКТОВ ====================

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

function showNotification(message, type = 'info') {
    if (window.telegramApp) {
        window.telegramApp.notify(message, type);
        return;
    }
    console.log(`[${type}] ${message}`);
    alert(`${type === 'error' ? '❌' : type === 'success' ? '✅' : '🔮'} ${message}`);
}

// ==================== ФУНКЦИИ ОТОБРАЖЕНИЯ ОСНОВНЫХ РЕЗУЛЬТАТОВ ====================

function displayResults(data) {
    console.log('📊 Отображение результатов:', data);

    try {
        setElementText('resultFullName', data.fullName);
        setElementText('resultBirthDate', data.birthDate);

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

            setElementText('callCloseDesc', getCallDescription(data.numerology.calls.close, 'close'));
            setElementText('callSocialDesc', getCallDescription(data.numerology.calls.social, 'social'));
            setElementText('callWorldDesc', getCallDescription(data.numerology.calls.world, 'world'));
        }

        if (data.zodiac) displayZodiac(data.zodiac);
        if (data.fengShui) displayFengShui(data.fengShui);
        if (data.tarot) displayTarot(data.tarot);
        if (data.psychology) displayPsychology(data.psychology);

        const patterns = generatePatterns(data);
        displayPatterns(patterns);

        const interpretation = generateFullInterpretation(data);
        setElementHTML('interpretationText', interpretation);

        if (data.psychology?.portrait) {
            setElementHTML('deepPortrait', formatPortrait(data.psychology.portrait));
        }

    } catch (error) {
        console.error('❌ Ошибка при отображении результатов:', error);
        showNotification('❌ Ошибка при отображении результатов', 'error');
    }
}

function setElementText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value !== undefined && value !== null ? value : '—';
}

function setElementHTML(id, html) {
    const element = document.getElementById(id);
    if (element) element.innerHTML = html || '<p>—</p>';
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
    if (!tarot) return;

    console.log('Отображение Таро:', tarot); // Для отладки

    // Карта Судьбы
    const fateImage = document.getElementById('tarotFateImage');
    if (fateImage) {
        fateImage.src = tarot.fate.image || '/images/tarot/back.jpg';
        fateImage.alt = tarot.fate.name || 'Карта Судьбы';
    }
    setElementText('tarotFateNumber', tarot.fate.number);
    setElementText('tarotFateName', tarot.fate.name);
    setElementText('tarotFateKeywords', tarot.fate.keywords);
    setElementText('tarotFateDescription', tarot.fate.description);
    setElementText('tarotFateAdvice', tarot.fate.advice);

    // Карта Личности
    const personalityImage = document.getElementById('tarotPersonalityImage');
    if (personalityImage) {
        personalityImage.src = tarot.personality.image || '/images/tarot/back.jpg';
        personalityImage.alt = tarot.personality.name || 'Карта Личности';
    }
    setElementText('tarotPersonalityNumber', tarot.personality.number);
    setElementText('tarotPersonalityName', tarot.personality.name);
    setElementText('tarotPersonalityKeywords', tarot.personality.keywords);
    setElementText('tarotPersonalityDescription', tarot.personality.description);
    setElementText('tarotPersonalityAdvice', tarot.personality.advice);

    // Карта Пути
    const controlImage = document.getElementById('tarotControlImage');
    if (controlImage) {
        controlImage.src = tarot.control.image || '/images/tarot/back.jpg';
        controlImage.alt = tarot.control.name || 'Карта Пути';
    }
    setElementText('tarotControlNumber', tarot.control.number);
    setElementText('tarotControlName', tarot.control.name);
    setElementText('tarotControlKeywords', tarot.control.keywords);
    setElementText('tarotControlDescription', tarot.control.description);
    setElementText('tarotControlAdvice', tarot.control.advice);
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

    if (!data?.numerology) return patterns;

    const { base, achilles, control, calls } = data.numerology;
    if (!base) return patterns;

    // ========== 1. Анализ повторяющихся чисел ==========
    const counts = {};
    const numbers = [base.fate, base.name, base.surname, base.patronymic].filter(n => n);
    numbers.forEach(n => counts[n] = (counts[n] || 0) + 1);

    Object.entries(counts).forEach(([num, count]) => {
        if (count >= 2) {
            if (num == 8) {
                patterns.push('⚖️ **Усиленная родовая карма** — тема справедливости и закона проходит красной нитью через всю вашу жизнь. Вы особенно чувствительны к вопросам чести и баланса, и вам важно научиться прощать несовершенство мира.');
            } else if (num == 11) {
                patterns.push('🔥 **Двойная харизма** — мощный лидерский потенциал, требующий мудрого управления. Вы способны вдохновлять массы, но важно не сгореть самому. Ваша задача — направлять энергию в созидательное русло.');
            } else if (num == 3) {
                patterns.push('🎨 **Творческая энергия в избытке** — потребность в самовыражении ищет выхода. Вам жизненно необходимо творить, иначе энергия застаивается и приводит к апатии.');
            } else if (num == 6) {
                patterns.push('💝 **Гиперответственность** — склонность заботиться о других в ущерб себе. Помните: кислородную маску сначала на себя. Ваша забота ценна, только если вы сами наполнены.');
            } else if (num == 22) {
                patterns.push('🦋 **Свободный дух** — вы не терпите ограничений, постоянно ищете новые пути и начинания. Ваша сила в спонтанности, но важно не терять связь с реальностью.');
            } else if (num == 4) {
                patterns.push('🏛️ **Фундаментальность** — вы строитель и создатель основ. Ваша стабильность — опора для многих, но остерегайтесь закостенелости. Учитесь гибкости.');
            } else if (num == 1) {
                patterns.push('👑 **Прирожденный лидер** — вам важно быть первым. Но помните: настоящее лидерство — не в том, чтобы быть впереди, а в том, чтобы вести за собой.');
            } else if (num == 2) {
                patterns.push('🤝 **Дипломат от природы** — вы чувствуете других людей на клеточном уровне. Ваша задача — использовать этот дар для создания гармонии, а не для манипуляций.');
            } else {
                patterns.push(`🔮 **Число ${num} повторяется** — энергия этого числа требует особого внимания и проработки в текущем воплощении. Это ваш главный ресурс и главный вызов одновременно.`);
            }
        }
    });

    // ========== 2. Анализ контрастов (разрыв между числами) ==========
    const numbersArray = [base.fate, base.name, base.surname, base.patronymic];
    const maxNum = Math.max(...numbersArray);
    const minNum = Math.min(...numbersArray);
    const range = maxNum - minNum;

    if (range > 15) {
        patterns.push('⚡ **Экстремальный диапазон энергий** — в вас сочетаются очень разные, почти противоположные качества. Это делает вас многогранной личностью, но может создавать внутренние конфликты. Учитесь интегрировать свои противоречия.');
    } else if (range > 10) {
        patterns.push('🎭 **Внутренний контраст** — ваши энергии находятся в заметном напряжении. Это дает вам глубину и способность видеть ситуацию с разных сторон.');
    } else if (range < 5) {
        patterns.push('🌈 **Гармоничный профиль** — ваши энергии сбалансированы и дополняют друг друга. Вы целостная личность, но остерегайтесь застоя — иногда нужен вызов для роста.');
    }

    if (Math.abs(base.fate - base.name) > 10) {
        patterns.push('⚖️ **Конфликт предназначения и личности** — ваше число судьбы (предназначение) сильно отличается от числа имени (самовыражение). Вы не всегда позволяете себе быть собой из-за внешних обязательств. Поиск компромисса между долгом и желаниями — ваша главная задача.');
    }

    if (base.surname === base.patronymic) {
        patterns.push('🌳 **Сильная связь с родом** — поддержка предков ощущается на подсознательном уровне. Вы несете мудрость нескольких поколений, но иногда это может быть грузом. Важно отделить свое от навязанного родом.');
    }

    if (achilles && achilles.number === control.number) {
        patterns.push('🔑 **Золотой ключ** — ваша уязвимость (ахиллесова пята) является одновременно вашей суперсилой (числом управления). Приняв свою слабость, вы обретете невероятную мощь. Ваша главная сила — в умении превращать недостатки в достоинства.');
    }

    // ========== 3. Анализ по числу управления ==========
    if (control && control.number) {
        const controlPatterns = {
            1: '🎯 **Ваша сверхспособность: Инициатива** — вы управляете миром через действие. Там, где другие думают, вы делаете. Ваша задача — научиться иногда останавливаться и слушать.',
            2: '🕊️ **Ваша сверхспособность: Дипломатия** — ваша сила в терпении и умении ждать. Вы создаете гармонию из хаоса. Не позволяйте другим использовать вашу мягкость как слабость.',
            3: '✨ **Ваша сверхспособность: Творчество** — вы творите реальность через радость и самовыражение. Ваша энергия заразительна. Научитесь дисциплине, чтобы ваши идеи воплощались.',
            4: '🏗️ **Ваша сверхспособность: Структура** — вы создаете порядок и системы. Вы — архитектор реальности. Но помните: лучшие структуры достаточно гибки, чтобы меняться.',
            5: '🦋 **Ваша сверхспособность: Адаптивность** — вы — ветер перемен. Ваша стихия — движение и свобода. Вы открываете новые двери. Найдите якорь, чтобы не потерять себя в путешествиях.',
            6: '💖 **Ваша сверхспособность: Забота** — вы — сердце. Ваш путь — служение и любовь. Вы исцеляете одним присутствием. Но научитесь заботиться и о себе.',
            7: '🔍 **Ваша сверхспособность: Анализ** — вы — воин света. Ваша сила — в вере и способности преодолевать. Вы не сдаетесь, даже когда весь мир против. Доверяйте своей интуиции.',
            8: '⚖️ **Ваша сверхспособность: Справедливость** — вы — хранитель равновесия. Ваш дар — в чувстве баланса. Вы там, где восстанавливается порядок. Но будьте милосердны.',
            9: '🌍 **Ваша сверхспособность: Мудрость** — вы — мудрец. Ваша глубина пугает и притягивает. Вы видите то, что скрыто от других. Делитесь своей мудростью, не ждите, пока попросят.',
            10: '🍀 **Ваша сверхспособность: Удача** — вы — любимец фортуны. Ваша энергия притягивает успех и возможности. Делитесь удачей с другими — это приумножит вашу.',
            11: '💫 **Ваша сверхспособность: Вдохновение** — вы — источник света. Ваша харизма зажигает сердца. За вами идут, даже не зная куда. Ведите ответственно.',
            12: '🙏 **Ваша сверхспособность: Принятие** — ваш дар — в умении принимать мир. Вы — тихая гавань для уставших душ. Но не позволяйте другим тонуть в вашей гавани — у них свои корабли.',
            13: '🔄 **Ваша сверхспособность: Трансформация** — вы — феникс. Ваша сила — в способности проходить через кризисы и возрождаться. Вы пример для других, как не бояться перемен.',
            14: '🌈 **Ваша сверхспособность: Гармония** — вы — дирижер оркестра жизни. Вы соединяете несоединимое. Создавайте красоту, но помните, что хаос тоже часть гармонии.',
            15: '🌑 **Ваша сверхспособность: Преодоление** — ваша сила — в прохождении через тьму. Вы знаете цену свободы, потому что сами были в плену. Помогите другим увидеть свет.',
            16: '💥 **Ваша сверхспособность: Прорыв** — вы не боитесь рушить старое. Вы расчищаете завалы для будущего. Но разрушайте только то, что действительно отжило.',
            17: '⭐ **Ваша сверхспособность: Надежда** — вы верите, когда верить не во что. Вы — звезда в ночном небе. Светите ярко, даже когда кажется, что вас никто не видит.',
            18: '🌙 **Ваша сверхспособность: Интуиция** — ваша сила — в связи с подсознанием. Вы слышите то, что не сказано. Доверяйте своим снам и предчувствиям.',
            19: '☀️ **Ваша сверхспособность: Свет** — вы радуетесь жизни и заражаете других. Вы — солнце. Но помните: даже солнце иногда уходит за горизонт, чтобы дать место звездам.',
            20: '⏰ **Ваша сверхспособность: Пробуждение** — вы видите истинную суть вещей. Вы — будильник для спящих душ. Будите мягко, не все готовы проснуться.',
            21: '🌐 **Ваша сверхспособность: Целостность** — вы объединяете разрозненное. Вы собираете пазл мира. Завершайте начатое, чтобы освободить место для нового.',
            22: '🦋 **Ваша сверхспособность: Свобода** — ваша сила — в умении начинать с чистого листа. Вы — чистое начало. Не бойтесь ошибаться — каждый лист можно перевернуть.'
        };

        if (controlPatterns[control.number]) {
            patterns.push(controlPatterns[control.number]);
        }
    }

    // ========== 4. Анализ по ахиллесовой пяте ==========
    if (achilles && achilles.number) {
        const achillesPatterns = {
            1: '🦁 **Страх одиночества** — вы боитесь остаться незамеченным, но именно в моменты, когда никто не смотрит, вы обретаете настоящую силу. Учитесь быть собой без зрителей.',
            2: '🤔 **Зависимость от мнения других** — вы слишком чувствительны к оценке окружающих. Помните: чужое мнение — это просто мнение, а не истина. Ваша ценность не зависит от того, сколько лайков вы собрали.',
            3: '🎭 **Страх быть смешным** — вы боитесь нелепости, но именно спонтанность и легкость могут стать вашим главным козырем. Разрешите себе быть неидеальным.',
            4: '🏰 **Страх перемен** — вы держитесь за стабильность, но мир меняется, и ваша гибкость — залог выживания. Самые крепкие стены когда-нибудь рушатся, освобождая место для сада.',
            5: '🕊️ **Страх свободы** — вы боитесь отпустить контроль, но именно в полете расправляются крылья. Доверьтесь потоку — он знает, куда течь.',
            6: '💔 **Чувство вины** — вы всегда кому-то что-то должны. Но правда в том, что вы должны быть счастливы в первую очередь. Ваше "нет" так же ценно, как и "да".',
            7: '⚔️ **Страх поражения** — вы боитесь проиграть, но без поражений нет побед. Каждое падение — это опыт. Величайшие победители проигрывали чаще, чем вы думаете.',
            8: '⚖️ **Непереносимость несправедливости** — вы остро реагируете на нечестность. Но мир не черно-белый, и ваша задача — принять его многогранность. Иногда справедливость одного — несправедливость для другого.',
            9: '🌫️ **Уход в иллюзии** — вы избегаете реальности в мечтах. Но настоящая магия происходит здесь и сейчас. Ваши мечты — это карта, а не территория.',
            10: '🎭 **Страх непризнания** — вам нужно, чтобы вас ценили. Но ваша ценность не зависит от чужого признания. Вы ценны просто потому, что вы есть.',
            11: '🦅 **Внутренняя борьба** — вы разрываетесь между силой и слабостью. Примите обе свои стороны. Ваша сила — в умении быть уязвимым, а слабость — в нежелании это признать.',
            12: '🙏 **Страх отказать** — вы не умеете говорить "нет". Но ваше "да" обесценивается, когда вы соглашаетесь на все подряд. Границы — это не стены, это ворота, которые вы открываете только для тех, кто уважает ваш дом.',
            13: '🌪️ **Страх перемен** — вы боитесь, что привычный мир рухнет. Иногда это именно то, что нужно. За руинами старого сада всегда вырастает новый.',
            14: '🌊 **Эмоциональная нестабильность** — ваши чувства захлестывают вас. Учитесь быть их капитаном, а не пассажиром. Эмоции — это волны, а вы — океан.',
            15: '🔥 **Зависимости** — вы легко поддаетесь искушениям. Осознание — первый шаг к свободе. За каждой зависимостью стоит потребность в любви и принятии. Дайте это себе сами.',
            16: '🏚️ **Страх разрушения** — вы боится, что все пойдет прахом. Но разрушение всегда предшествует новому строительству. Иногда нужно сжечь старый сарай, чтобы построить дом мечты.',
            17: '🌈 **Нереалистичные ожидания** — вы ждете слишком многого от себя и других. Реальность прекрасна по-своему. Идеальность — враг хорошего.',
            18: '🌑 **Страх темноты** — вы боитесь заглядывать вглубь себя. Но там ваши главные сокровища. В пещере своей души вы найдете не монстров, а забытые мечты.',
            19: '☀️ **Страх быть в тени** — вам нужно внимание любой ценой. Но светить можно и не будучи в центре. Иногда самая важная работа делается в тишине.',
            20: '⚖️ **Страх осуждения** — вы боитесь, что вас осудят. Самый строгий судья — внутри вас. Научитесь быть себе адвокатом, а не прокурором.',
            21: '🔄 **Неумение отпускать** — вы держитесь за прошлое. Чтобы принять новое, нужно разжать руки. Прошлое — это багаж, который либо учит, либо тянет на дно.',
            22: '👶 **Страх ответственности** — вы боитесь взрослых решений. Но свобода начинается с ответственности. Взрослеть — не значит становиться скучным, это значит выбирать свой путь.'
        };

        if (achillesPatterns[achilles.number]) {
            patterns.push(`💔 **Ваша ахиллесова пята (число ${achilles.number})**: ${achillesPatterns[achilles.number]}`);
        }
    }

    // ========== 5. Анализ по окликам ==========
    if (calls) {
        if (calls.close === calls.social && calls.close === calls.world) {
            patterns.push('🎯 **Целостность образа** — вы одинаковы в семье, в социуме и для незнакомцев. Это редкая искренность, но иногда вам не хватает гибкости. Не бойтесь быть разным в разных контекстах — это не лицемерие, это адаптация.');
        } else if (calls.close === calls.social) {
            patterns.push('🏠 **Домашний и социальный образ совпадают** — вы искренни и последовательны. Люди видят вас таким, какой вы есть. Это вызывает доверие, но может быть утомительно — иногда полезно менять маски.');
        } else if (calls.close === calls.world) {
            patterns.push('🌍 **Дома и на людях вы одинаковы, но в социуме другой** — возможно, работа или общественные обязанности заставляют вас надевать маску, от которой вы отдыхаете дома и с незнакомцами.');
        } else if (calls.social === calls.world) {
            patterns.push('🎭 **В социуме и для незнакомцев вы одинаковы, но дома другой** — дома вы позволяете себе быть настоящим. Это говорит о глубоком доверии к семье и усталости от социальных ролей.');
        }

        if (calls.close === 22 || calls.social === 22 || calls.world === 22) {
            patterns.push('🆕 **Вечный начинающий** — вы постоянно в начале нового пути. Это дает свежесть восприятия, но мешает завершать начатое. Учитесь ставить точки.');
        }

        if (calls.close === 11 || calls.social === 11 || calls.world === 11) {
            patterns.push('✨ **Харизматичный образ** — где бы вы ни появились, вы привлекаете внимание. Используйте это во благо, но не дайте харизме затмить вашу суть.');
        }

        // Анализ дисбаланса окликов
        const callsArray = [calls.close, calls.social, calls.world];
        const maxCall = Math.max(...callsArray);
        const minCall = Math.min(...callsArray);

        if (maxCall - minCall > 10) {
            patterns.push('🎪 **Сильный разрыв между социальными масками** — вы очень по-разному проявляете себя в разных ситуациях. Это может сбивать с толку окружающих и вас самого. Найдите свою "золотую середину".');
        }
    }

    // ========== 6. Анализ по зодиаку ==========
    if (data.zodiac) {
        const zodiac = data.zodiac;

        // Стихийный баланс
        const fireSigns = ['Овен', 'Лев', 'Стрелец'];
        const earthSigns = ['Телец', 'Дева', 'Козерог'];
        const airSigns = ['Близнецы', 'Весы', 'Водолей'];
        const waterSigns = ['Рак', 'Скорпион', 'Рыбы'];

        if (fireSigns.includes(zodiac.name)) {
            patterns.push('🔥 **Огненная натура** — ваша стихия — огонь. Вы энергичны, страстны и импульсивны. Ваша задача — направлять огонь на созидание, не давая ему сжигать все вокруг.');
        } else if (earthSigns.includes(zodiac.name)) {
            patterns.push('🌱 **Земная натура** — ваша стихия — земля. Вы практичны, надежны и стабильны. Ваша задача — не закостенеть, оставаться плодородной почвой для новых идей.');
        } else if (airSigns.includes(zodiac.name)) {
            patterns.push('💨 **Воздушная натура** — ваша стихия — воздух. Вы коммуникабельны, любознательны и легки на подъем. Ваша задача — находить глубину за множеством интересов.');
        } else if (waterSigns.includes(zodiac.name)) {
            patterns.push('💧 **Водная натура** — ваша стихия — вода. Вы эмоциональны, интуитивны и глубоки. Ваша задача — не растворяться в других, сохранять свои границы.');
        }

        // Крест качества
        if (zodiac.quality) {
            if (zodiac.quality === 'Кардинальный') {
                patterns.push('🚀 **Кардинальный знак** — вы инициатор, лидер, тот, кто начинает новое. Ваша задача — не бросать начатое на полпути.');
            } else if (zodiac.quality === 'Фиксированный') {
                patterns.push('🏔️ **Фиксированный знак** — вы стабильны, упорны, надежны. Ваша задача — не превращать стабильность в застой.');
            } else if (zodiac.quality === 'Мутабельный') {
                patterns.push('🦎 **Мутабельный знак** — вы гибки, адаптивны, легко меняетесь. Ваша задача — не терять себя в этой гибкости.');
            }
        }
    }

    // ========== 7. Анализ по фен-шуй ==========
    if (data.fengShui) {
        const fengShui = data.fengShui;
        patterns.push(`🌿 **Ваш элемент по фен-шуй: ${fengShui.element}**. ${fengShui.element === 'Металл' ? 'Вы цените структуру и порядок, но учитесь гибкости.' :
            fengShui.element === 'Вода' ? 'Вы глубоки и интуитивны, но не позволяйте эмоциям затопить вас.' :
                fengShui.element === 'Дерево' ? 'Вы растете и развиваетесь, но не забывайте укореняться.' :
                    fengShui.element === 'Огонь' ? 'Вы страстны и энергичны, но не сжигайте себя.' :
                        'Вы надежны и стабильны, но не забывайте про движение.'}`);

        if (fengShui.color) {
            patterns.push(`🎨 **Ваш цвет силы: ${fengShui.color}**. Окружите себя этим цветом для гармонизации энергии.`);
        }

        if (fengShui.direction) {
            patterns.push(`🧭 **Ваше направление удачи: ${fengShui.direction}**. В важных делах старайтесь смотреть или двигаться в эту сторону.`);
        }
    }

    // ========== 8. Анализ по Таро ==========
    if (data.tarot) {
        const tarot = data.tarot;

        if (tarot.fate && tarot.personality && tarot.fate.number === tarot.personality.number) {
            patterns.push('🎴 **Кармическая задача** — ваша карта судьбы совпадает с картой личности. Это означает, что ваша главная жизненная задача — стать собой. Никаких масок, только подлинность.');
        }

        if (tarot.fate && [0, 13, 16, 20].includes(tarot.fate.number)) {
            patterns.push('🔄 **Трансформатор** — ваша карта судьбы указывает на глубокие трансформации в жизни. Перемены — ваша стихия, а кризисы — точки роста. Не бойтесь разрушения старого — на его месте вырастет новое.');
        }

        if (tarot.personality && [1, 8, 11, 21].includes(tarot.personality.number)) {
            patterns.push('👑 **Прирожденный лидер** — ваша карта личности говорит о лидерских качествах. Вы не ведомый, вы ведущий. Даже в пассивности чувствуется скрытая сила, готовая проявиться.');
        }

        if (tarot.control && [2, 6, 9, 12].includes(tarot.control.number)) {
            patterns.push('🤲 **Служитель и целитель** — ваша карта пути указывает на предназначение помогать другим. Но помните: чтобы заботиться о других, нужно сначала наполнить себя.');
        }

        // Добавляем краткое описание карт
        if (tarot.fate) {
            patterns.push(`🔮 **Карта Судьбы: ${tarot.fate.name}**. ${tarot.fate.keywords}. ${tarot.fate.advice.split('.')[0]}.`);
        }

        if (tarot.personality && tarot.personality.number !== tarot.fate.number) {
            patterns.push(`🎭 **Карта Личности: ${tarot.personality.name}**. ${tarot.personality.keywords}. ${tarot.personality.advice.split('.')[0]}.`);
        }

        if (tarot.control && tarot.control.number !== tarot.fate.number && tarot.control.number !== tarot.personality.number) {
            patterns.push(`🛤️ **Карта Пути: ${tarot.control.name}**. ${tarot.control.keywords}. ${tarot.control.advice.split('.')[0]}.`);
        }
    }

    // ========== 9. Анализ по психологии ==========
    if (data.psychology) {
        const psych = data.psychology;

        if (psych.modality) {
            patterns.push(`🧠 **Ваша ведущая модальность: ${psych.modality.title}**. ${psych.modality.description.split('.')[0]}. ${psych.modality.accessKeys.split('.')[0]}.`);
        }

        if (psych.archetype) {
            patterns.push(`🏛️ **Ваш архетип: ${psych.archetype.name}**. ${psych.archetype.description.split('.')[0]}. Дар: ${psych.archetype.gift.toLowerCase()}.`);

            if (psych.archetype.mantra) {
                patterns.push(`📿 **Мантра для вас**: "${psych.archetype.mantra}"`);
            }
        }

        if (psych.attachment) {
            patterns.push(`🤝 **Тип привязанности: ${psych.attachment.name}**. ${psych.attachment.description.split('.')[0]}.`);
        }
    }

    // ========== 10. Анализ по дате рождения (нумерологический портрет) ==========
    if (base.fate) {
        const fateDescriptions = {
            1: '🎯 Ваша миссия — быть первым, прокладывать путь, вдохновлять примером. Вы лидер, но помните: за лидером должны идти, а не бежать.',
            2: '🤝 Ваша миссия — создавать гармонию, объединять, быть дипломатом. Вы мост между мирами, но не дайте другим ходить по вам.',
            3: '🎨 Ваша миссия — творить, радоваться, вдохновлять. Вы художник жизни, но не забывайте, что искусство требует дисциплины.',
            4: '🏛️ Ваша миссия — строить, создавать основы, быть надежной опорой. Вы фундамент, но не позволяйте себя замуровать.',
            5: '🦋 Ваша миссия — исследовать, меняться, быть свободным. Вы ветер странствий, но иногда нужно возвращаться домой.',
            6: '💖 Ваша миссия — заботиться, любить, служить. Вы сердце, но помните: сердцу нужен отдых.',
            7: '🔍 Ваша миссия — искать истину, анализировать, углубляться. Вы мудрец, но не забывайте о простых радостях жизни.',
            8: '⚖️ Ваша миссия — управлять, балансировать, достигать. Вы магнат, но истинное богатство не в кошельке, а в душе.',
            9: '🌍 Ваша миссия — завершать, прощать, отпускать. Вы мудрец, завершающий циклы. Но после завершения всегда приходит новое начало.',
            11: '💫 Ваша миссия — вдохновлять, быть проводником высших идей. Вы источник света, но не дайте ему ослепить вас.',
            22: '🏗️ Ваша миссия — строить масштабные проекты, воплощать мечты в реальность. Вы архитектор будущего, но не забывайте о настоящем.'
        };

        if (fateDescriptions[base.fate]) {
            patterns.push(fateDescriptions[base.fate]);
        }
    }

    // ========== 11. Комбинаторные паттерны ==========

    // Сочетание судьбы и имени
    const fateNameSum = (base.fate + base.name) % 9 || 9;
    if (fateNameSum === 1) {
        patterns.push('🌟 **Лидерский тандем** — ваше предназначение и самовыражение работают в унисон на лидерство. Вы рождены, чтобы вести.');
    } else if (fateNameSum === 2) {
        patterns.push('🤲 **Дипломатичный тандем** — ваше предназначение и самовыражение направлены на гармонию и сотрудничество. Вы — прирожденный миротворец.');
    } else if (fateNameSum === 3) {
        patterns.push('🎭 **Творческий тандем** — ваше предназначение и самовыражение сливаются в творчестве. Вы здесь, чтобы создавать красоту.');
    } else if (fateNameSum === 4) {
        patterns.push('🏛️ **Структурный тандем** — ваше предназначение и самовыражение направлены на создание порядка и стабильности. Вы — строитель.');
    } else if (fateNameSum === 5) {
        patterns.push('🦋 **Свободный тандем** — ваше предназначение и самовыражение ищут свободы и перемен. Вы — исследователь жизни.');
    } else if (fateNameSum === 6) {
        patterns.push('💖 **Заботливый тандем** — ваше предназначение и самовыражение направлены на служение и любовь. Вы — целитель.');
    } else if (fateNameSum === 7) {
        patterns.push('🔮 **Аналитический тандем** — ваше предназначение и самовыражение ищут истину. Вы — философ и исследователь.');
    } else if (fateNameSum === 8) {
        patterns.push('⚖️ **Управленческий тандем** — ваше предназначение и самовыражение направлены на власть и баланс. Вы — прирожденный управленец.');
    } else if (fateNameSum === 9) {
        patterns.push('🌐 **Гуманитарный тандем** — ваше предназначение и самовыражение направлены на служение миру. Вы — гуманист.');
    }

    // Сочетание рода и предков
    const surnamePatronymicSum = (base.surname + base.patronymic) % 9 || 9;
    if (surnamePatronymicSum === 1) {
        patterns.push('👑 **Сильный род** — ваш род имеет мощную лидерскую энергию. Вы несете ответственность быть достойным своих предков.');
    } else if (surnamePatronymicSum === 2) {
        patterns.push('🤝 **Гармоничный род** — в вашем роду сильны традиции сотрудничества и дипломатии. Вы — продолжатель дела миротворцев.');
    } else if (surnamePatronymicSum === 3) {
        patterns.push('🎨 **Творческий род** — в вашей семье много талантливых людей. Вы унаследовали творческую искру — не дайте ей погаснуть.');
    } else if (surnamePatronymicSum === 4) {
        patterns.push('🏛️ **Род строителей** — ваши предки создавали фундамент, на котором вы стоите. Ваша задача — продолжать их дело, не разрушая накопленного.');
    } else if (surnamePatronymicSum === 5) {
        patterns.push('🦋 **Род странников** — в вашей семье были путешественники, переселенцы, искатели приключений. Вы несете их жажду свободы.');
    } else if (surnamePatronymicSum === 6) {
        patterns.push('💖 **Род целителей** — в вашей семье сильны традиции заботы и служения. Вы призваны продолжать это дело.');
    } else if (surnamePatronymicSum === 7) {
        patterns.push('🔮 **Род мудрецов** — ваши предки обладали глубокими знаниями. Вы несете их мудрость, но должны применить ее по-своему.');
    } else if (surnamePatronymicSum === 8) {
        patterns.push('⚖️ **Род управленцев** — в вашей семье были лидеры и руководители. Вы призваны нести ответственность за дело рода.');
    } else if (surnamePatronymicSum === 9) {
        patterns.push('🌐 **Род гуманистов** — ваши предки служили людям. Вы продолжаете их миссию, но в новых условиях.');
    }

    // Баланс мужской и женской энергии (на основе фамилии и отчества)
    if (base.surname > base.patronymic) {
        patterns.push('⚔️ **Преобладание мужской энергии рода** — в вашем роду сильна линия отца. Вы можете чувствовать давление патриархальных традиций, но это также дает вам силу и защиту.');
    } else if (base.surname < base.patronymic) {
        patterns.push('🌸 **Преобладание женской энергии рода** — в вашем роду сильна линия матери. Вы можете чувствовать глубокую эмоциональную связь с предками по женской линии.');
    } else {
        patterns.push('⚖️ **Гармония мужской и женской энергии** — в вашем роду баланс. Вы умеете сочетать силу и мягкость, действие и принятие.');
    }

    // Если паттернов слишком мало, добавляем общие, но все равно персонализированные
    if (patterns.length < 5) {
        const defaultPatterns = [
            `✨ У вас уникальное сочетание чисел: Судьба ${base.fate}, Имя ${base.name}, Род ${base.surname}, Предки ${base.patronymic}. Это создает неповторимый энергетический рисунок вашей личности.`,
            `🔢 Ваше число жизненного пути ${base.fate} говорит о том, что вы пришли в этот мир, чтобы ${base.fate === 1 ? 'лидировать и начинать новое' :
                base.fate === 2 ? 'сотрудничать и создавать гармонию' :
                    base.fate === 3 ? 'творить и радоваться жизни' :
                        base.fate === 4 ? 'строить и создавать порядок' :
                            base.fate === 5 ? 'исследовать и быть свободным' :
                                base.fate === 6 ? 'заботиться и любить' :
                                    base.fate === 7 ? 'познавать и анализировать' :
                                        base.fate === 8 ? 'управлять и достигать' :
                                            base.fate === 9 ? 'завершать и служить' :
                                                base.fate === 11 ? 'вдохновлять и вести за собой' :
                                                    'строить масштабные проекты'}.`,
            `🌱 Ваше имя с числом ${base.name} добавляет к этому оттенок ${base.name === 1 ? 'лидерства' :
                base.name === 2 ? 'дипломатичности' :
                    base.name === 3 ? 'креативности' :
                        base.name === 4 ? 'основательности' :
                            base.name === 5 ? 'любознательности' :
                                base.name === 6 ? 'заботливости' :
                                    base.name === 7 ? 'глубины' :
                                        base.name === 8 ? 'авторитетности' :
                                            base.name === 9 ? 'гуманизма' :
                                                base.name === 11 ? 'харизмы' :
                                                    'масштабности'}.`
        ];

        defaultPatterns.forEach(p => patterns.push(p));
    }

    // Убираем дубликаты (если вдруг что-то повторилось)
    const uniquePatterns = [...new Set(patterns)];

    // Ограничиваем количество, но оставляем достаточно для информативности
    return uniquePatterns.slice(0, 15);
}

function generateFullInterpretation(data) {
    const { base, calls } = data.numerology || {};

    return `
        <div class="interpretation-section">
            <h4>🌟 ЗВЕЗДНЫЙ КОД ЛИЧНОСТИ</h4>
            <p>Твоя душа выбрала этот мир в момент <strong>${data.birthDate || '—'}</strong>. 
            Твое имя <strong>${data.fullName || '—'}</strong> — не случайный набор звуков, а вибрация, которая определяет твой путь.</p>
        </div>
        
        <div class="interpretation-section">
            <h4>🔢 ЧИСЛОВАЯ МАТРИЦА</h4>
            <p>Число судьбы: <strong>${base?.fate || '—'}</strong> — твой компас.<br>
            Число имени: <strong>${base?.name || '—'}</strong> — твой инструмент.<br>
            Число рода: <strong>${base?.surname || '—'}</strong> — багаж из прошлого.</p>
        </div>
        
        <div class="interpretation-section">
            <h4>🎭 ТВОИ СОЦИАЛЬНЫЕ МАСКИ</h4>
            <p>✨ Для близких: ${getCallDescription(calls?.close, 'close')}</p>
            <p>✨ Для социума: ${getCallDescription(calls?.social, 'social')}</p>
            <p>✨ Для мира: ${getCallDescription(calls?.world, 'world')}</p>
        </div>
    `;
}