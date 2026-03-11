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

    const { base } = data.numerology;
    if (!base) return patterns;

    const counts = {};
    const numbers = [base.fate, base.name, base.surname, base.patronymic].filter(n => n);

    numbers.forEach(n => counts[n] = (counts[n] || 0) + 1);

    Object.entries(counts).forEach(([num, count]) => {
        if (count >= 2) {
            if (num == 8) patterns.push('⚖️ **Усиленная родовая карма** — тема справедливости и закона проходит красной нитью через всю вашу жизнь.');
            else if (num == 11) patterns.push('🔥 **Двойная харизма** — мощный лидерский потенциал, требующий мудрого управления.');
            else if (num == 3) patterns.push('🎨 **Творческая энергия в избытке** — потребность в самовыражении ищет выхода.');
            else if (num == 6) patterns.push('💝 **Гиперответственность** — склонность заботиться о других в ущерб себе.');
            else if (num == 22) patterns.push('🦋 **Свободный дух** — вы не терпите ограничений, постоянно ищете новые пути.');
            else patterns.push(`🔮 **Число ${num} повторяется** — энергия этого числа требует особого внимания.`);
        }
    });

    if (patterns.length === 0) patterns.push('✨ **Уникальная комбинация энергий** — вы — творец собственного пути.');

    return patterns;
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