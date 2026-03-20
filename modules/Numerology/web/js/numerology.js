// /numerology/js/numerology.js

class NumerologyApp {
    constructor() {
        this.user = null;
        this.activeSubscription = null;
        this.tariffs = [];
        this.selectedTariff = null;
        this.currentCalculation = null;
        this.hasFullAccess = false;

        this.init();
    }

    async init() {
        console.log('🔮 NumerologyApp инициализация...');

        // Получаем ссылки на элементы
        this.form = document.getElementById('numerologyForm');
        this.tariffSection = document.getElementById('tariffSection');
        this.inputSection = document.getElementById('inputSection');
        this.resultSection = document.getElementById('resultSection');
        this.subscriptionInfo = document.getElementById('subscriptionInfo');
        this.tariffGrid = document.getElementById('tariffGrid');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        this.compatibilityFields = document.getElementById('compatibilityFields');
        this.targetDateField = document.getElementById('targetDateField');
        this.guestBlock = document.getElementById('guestBlock');

        if (!this.form) {
            console.error('❌ Форма не найдена');
            return;
        }

        // Инициализируем пикеры
        this.initWeekPicker();
        this.initMonthPicker();
        this.initYearPicker();

        // Инициализируем маски для дат
        this.initDateMasks();

        // Загружаем данные пользователя
        await this.loadUserData();

        // Загружаем тарифы
        await this.loadTariffs();

        // Проверяем подписку
        await this.checkSubscription();

        // Обновляем UI в зависимости от авторизации
        this.updateAuthUI();

        // Добавляем обработчики событий
        this.addEventListeners();

        // Автоматически заполняем ФИО если есть пользователь
        if (this.user && this.user.fullName) {
            document.getElementById('fullName').value = this.user.fullName;
        }
    }

    initDateMasks() {
        const dateInputs = ['birthDate', 'partnerBirthDate', 'targetDate'];

        dateInputs.forEach(id => {
            const input = document.getElementById(id);
            if (input && typeof IMask !== 'undefined') {
                IMask(input, {
                    mask: Date,
                    pattern: 'd{.}`m{.}`Y',
                    blocks: {
                        d: {mask: IMask.MaskedRange, from: 1, to: 31, maxLength: 2},
                        m: {mask: IMask.MaskedRange, from: 1, to: 12, maxLength: 2},
                        Y: {mask: IMask.MaskedRange, from: 1900, to: 2100, maxLength: 4}
                    },
                    format: function (date) {
                        const day = String(date.getDate()).padStart(2, '0');
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const year = date.getFullYear();
                        return `${day}.${month}.${year}`;
                    },
                    parse: function (str) {
                        const [day, month, year] = str.split('.');
                        return new Date(year, month - 1, day);
                    },
                    lazy: false,
                    autofix: true,
                    placeholderChar: '_'
                });
            }
        });
    }

    async loadUserData() {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch('/api/profile', {
                headers: {'Authorization': `Bearer ${token}`}
            });

            if (response.ok) {
                const data = await response.json();
                this.user = data.data.user;
            }
        } catch (error) {
            console.error('Ошибка загрузки пользователя:', error);
        }
    }

    async loadTariffs() {
        try {
            const response = await fetch('/api/services?active=true');

            if (response.ok) {
                const data = await response.json();
                this.tariffs = data.data;
                this.renderTariffs();
            }
        } catch (error) {
            console.error('Ошибка загрузки тарифов:', error);
            if (this.tariffGrid) {
                this.tariffGrid.innerHTML = '<p class="error-message">Ошибка загрузки тарифов</p>';
            }
        }
    }

    async checkSubscription() {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch('/api/subscriptions/active', {
                headers: {'Authorization': `Bearer ${token}`}
            });

            if (response.ok) {
                const data = await response.json();
                this.activeSubscription = data.data;
                this.hasFullAccess = true;
                this.renderSubscriptionInfo();
            }
        } catch (error) {
            console.error('Ошибка проверки подписки:', error);
        }
    }

    renderSubscriptionInfo() {
        if (!this.subscriptionInfo || !this.activeSubscription) return;

        const endDate = new Date(this.activeSubscription.endDate);
        const daysLeft = Math.ceil((endDate - new Date()) / (1000 * 60 * 60 * 24));

        this.subscriptionInfo.style.display = 'block';
        this.subscriptionInfo.innerHTML = `
            <div class="subscription-badge">
                <i class="fas fa-crown"></i>
                <span>Активная подписка</span>
            </div>
            <div class="subscription-dates">
                <div class="date-item">
                    <i class="fas fa-calendar-check"></i>
                    <span>Действует до: <strong>${endDate.toLocaleDateString()}</strong></span>
                </div>
                <div class="date-item">
                    <i class="fas fa-hourglass-half"></i>
                    <span>Осталось: <strong>${daysLeft} дн.</strong></span>
                </div>
            </div>
            <div class="subscription-benefits">
                <span class="benefit-tag"><i class="fas fa-check"></i> Прогноз на день</span>
                <span class="benefit-tag"><i class="fas fa-check"></i> Прогноз на неделю</span>
                <span class="benefit-tag"><i class="fas fa-check"></i> Прогноз на месяц</span>
                <span class="benefit-tag"><i class="fas fa-check"></i> Прогноз на год</span>
                <span class="benefit-tag discount"><i class="fas fa-tag"></i> Скидка 50% на полный расчет</span>
            </div>
        `;
    }

    updateAuthUI() {


        if (this.user) {
            // Для авторизованных: показываем блок приветствия для гостей? НЕТ, скрываем
            if (this.guestBlock) this.guestBlock.style.display = 'none';
            // Тарифы всегда видны
            if (this.tariffSection) this.tariffSection.style.display = 'block';

        } else {
            // Для неавторизованных: показываем блок приветствия
            if (this.guestBlock) this.guestBlock.style.display = 'block';
            // ТАРИФЫ ТОЖЕ ПОКАЗЫВАЕМ! (но они будут с замочками)
            if (this.tariffSection) this.tariffSection.style.display = 'block';
        }

    }

    logout() {
        localStorage.removeItem('token');
        window.location.href = '/';
    }

    renderTariffs() {
        if (!this.tariffGrid) return;

        const forecastTypes = {
            'forecast_basic': {
                icon: 'fas fa-star',
                name: 'Базовый расчет',
                description: 'Основные числа судьбы, свиток судьбы и глубинный портрет',
                features: [
                    'Число судьбы, имени, рода',
                    'Ахиллесова пята',
                    'Число управления',
                    'Социальные оклики',
                    'Свиток судьбы',
                    'Глубинный портрет'
                ],
                free: true,
                category: 'calculations'
            },
            'forecast_day': {
                icon: 'fas fa-sun',
                name: 'Прогноз на день',
                description: 'Персональный прогноз на конкретный день',
                features: [
                    'Число дня',
                    'Энергетика дня',
                    'Благоприятные направления',
                    'Совет на день'
                ],
                category: 'calculations'
            },
            'forecast_week': {
                icon: 'fas fa-calendar-week',
                name: 'Прогноз на неделю',
                description: 'Прогноз на предстоящую неделю',
                features: [
                    'Разбор по дням',
                    'Ключевые события',
                    'Благоприятные дни',
                    'Советы на неделю'
                ],
                category: 'calculations'
            },
            'forecast_month': {
                icon: 'fas fa-calendar-alt',
                name: 'Прогноз на месяц',
                description: 'Прогноз на месяц вперед',
                features: [
                    'Разбор по неделям',
                    'Важные даты',
                    'Тенденции месяца',
                    'Стратегия на месяц'
                ],
                category: 'calculations'
            },
            'forecast_year': {
                icon: 'fas fa-calendar',
                name: 'Прогноз на год',
                description: 'Годовой прогноз',
                features: [
                    'Разбор по кварталам',
                    'Ключевые месяцы',
                    'Годовые тенденции',
                    'Стратегия на год'
                ],
                category: 'calculations'
            },
            'forecast_full': {
                icon: 'fas fa-crown',
                name: 'Полный расчет',
                description: 'Полный нумерологический анализ + все дополнительные разделы',
                features: [
                    'Все из базового расчета',
                    'Гороскоп',
                    'Фен-шуй',
                    'Карты Таро',
                    'Психологический портрет',
                    'Паттерны личности',
                    'Карьерный анализ',
                    'Семейная гармония',
                    'Любовная совместимость',
                    'Финансовый поток',
                    'Энергия здоровья',
                    'Скрытые таланты'
                ],
                category: 'calculations'
            },
            'compatibility': {
                icon: 'fas fa-heart',
                name: 'Совместимость',
                description: 'Нумерологическая совместимость с партнером',
                features: [
                    'Анализ пары',
                    'Сильные стороны союза',
                    'Зоны роста отношений',
                    'Общие цели'
                ],
                category: 'calculations'
            },
            'subscription_monthly': {
                icon: 'fas fa-gem',
                name: 'Подписка на месяц',
                description: 'Неограниченные прогнозы на день, неделю и месяц в течение 30 дней',
                features: [
                    'Все прогнозы без ограничений',
                    'Экономия до 70%',
                    'Новые расчеты каждый день',
                    'Приоритетная поддержка'
                ],
                category: 'subscriptions'
            },
            'subscription_yearly': {
                icon: 'fas fa-crown',
                name: 'Подписка на год',
                description: 'Неограниченные прогнозы на день, неделю и месяц в течение 365 дней',
                features: [
                    'Все прогнозы без ограничений',
                    'Максимальная выгода',
                    'Экономия более 80%',
                    'VIP поддержка'
                ],
                category: 'subscriptions'
            }
        };

        // Разделяем тарифы на категории
        const calculations = [];
        const subscriptions = [];

        this.tariffs.forEach(tariff => {
            const typeInfo = forecastTypes[tariff.code] || {
                icon: 'fas fa-calculator',
                name: tariff.name,
                description: tariff.description,
                features: ['Все основные расчеты'],
                category: tariff.code.includes('subscription') ? 'subscriptions' : 'calculations'
            };

            // Определяем цену со скидкой для подписчиков
            let price = tariff.price;
            let oldPrice = null;
            let discount = null;

            if (this.activeSubscription && tariff.code !== 'forecast_basic') {
                if (['forecast_day', 'forecast_week', 'forecast_month', 'forecast_year'].includes(tariff.code)) {
                    price = 0;
                    discount = 'По подписке';
                } else if (tariff.code === 'forecast_full') {
                    oldPrice = price;
                    price = Math.round(price * 0.5);
                    discount = '50% по подписке';
                }
            }

            // Определяем класс карточки и обработчик клика
            let cardClass = 'tariff-card';
            let clickHandler = `numerologyApp.selectTariff('${tariff.code}')`;
            let isLocked = false;

            // Для неавторизованных пользователей
            if (!this.user) {
                // Базовый расчет полностью доступен
                if (tariff.code === 'forecast_basic') {
                    cardClass += ' free';
                }
                // Все остальные тарифы - с замочком
                else {
                    cardClass += ' locked';
                    isLocked = true;
                    clickHandler = `numerologyApp.showAuthModal()`;
                }
            }
            // Для авторизованных пользователей
            else {
                // Базовый расчет скрываем полностью
                if (tariff.code === 'forecast_basic') {
                    return; // Пропускаем этот тариф
                }

                // Остальные тарифы доступны
                if (this.activeSubscription && (price === 0 || discount)) {
                    cardClass += ' subscription';
                }
            }

            if (this.selectedTariff?.id === tariff.id) cardClass += ' selected';

            const tariffHtml = `
            <div class="${cardClass}" onclick="${clickHandler}" data-category="${typeInfo.category}">
                ${tariff.code === 'forecast_full' && !this.activeSubscription && !isLocked ? '<span class="popular-badge">Популярное</span>' : ''}
                ${isLocked ? '<div class="lock-overlay-small"><i class="fas fa-lock"></i></div>' : ''}
                <div class="tariff-icon">
                    <i class="${typeInfo.icon}"></i>
                </div>
                <h3 class="tariff-name">${typeInfo.name}</h3>
                <p class="tariff-description">${typeInfo.description}</p>
                
                <div class="tariff-price">
                    ${price === 0 ? '<span class="price-free">Бесплатно</span>' : `<span class="price-current">${price} ₽</span>`}
                    ${oldPrice ? `<span class="price-old">${oldPrice} ₽</span>` : ''}
                </div>
                
                ${discount ? `<div class="discount-badge">${discount}</div>` : ''}
                
                <ul class="tariff-features">
                    ${typeInfo.features ? typeInfo.features.map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('') : '<li>Все основные расчеты</li>'}
                </ul>
                
                <button class="btn-select ${isLocked ? 'locked' : ''}">
                    ${isLocked ? 'Войти и выбрать' : 'Выбрать'}
                </button>
            </div>
        `;

            // Распределяем по категориям
            if (typeInfo.category === 'subscriptions') {
                subscriptions.push(tariffHtml);
            } else {
                calculations.push(tariffHtml);
            }
        });

        // Формируем итоговый HTML с разделением на категории
        let finalHtml = '';

        // Секция с расчетами (если есть)
        if (calculations.length > 0) {
            finalHtml += `
        <div class="tariff-category">
            <h2 class="category-title">РАСЧЕТЫ</h2>
            <div class="tariff-grid">
                ${calculations.join('')}
            </div>
        </div>
    `;
        }

        // Секция с подписками (если есть)
        if (subscriptions.length > 0) {
            finalHtml += `
        <div class="tariff-category subscriptions-category">
            <h2 class="category-title">ПОДПИСКИ</h2>
            <div class="tariff-grid">
                ${subscriptions.join('')}
            </div>
        </div>
    `;
        }

        this.tariffGrid.innerHTML = finalHtml;
    }

// Метод для показа модального окна авторизации
    showAuthModal() {
        const modal = document.createElement('div');
        modal.className = 'auth-modal';
        modal.innerHTML = `
        <div class="auth-modal-content">
            <i class="fas fa-lock modal-lock-icon"></i>
            <h3>Войдите в аккаунт</h3>
            <p>Чтобы получить доступ к платным расчетам, нужно войти или зарегистрироваться</p>
            <div class="auth-modal-actions">
                <a href="/login" class="btn btn-primary">Войти</a>
                <a href="/register" class="btn btn-outline">Создать аккаунт</a>
            </div>
            <button class="auth-modal-close" onclick="this.closest('.auth-modal').remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

        document.body.appendChild(modal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }


    selectTariff(tariffCode) {
        const tariff = this.tariffs.find(t => t.code === tariffCode);
        if (!tariff) return;

        this.selectedTariff = tariff;

        // Обновляем заголовок
        document.getElementById('selectedTariffTitle').textContent = tariff.name;
        document.getElementById('selectedTariffDescription').textContent = tariff.description || '';

        // Показываем/скрываем дополнительные поля
        if (tariffCode === 'compatibility') {
            this.compatibilityFields.style.display = 'block';
            this.targetDateField.style.display = 'none';

            // Скрываем пикеры
            const weekPicker = document.getElementById('weekPickerContainer');
            const monthPicker = document.getElementById('monthPickerContainer');
            const yearPicker = document.getElementById('yearPickerContainer');
            if (weekPicker) weekPicker.style.display = 'none';
            if (monthPicker) monthPicker.style.display = 'none';
            if (yearPicker) yearPicker.style.display = 'none';

        } else if (['forecast_day', 'forecast_week', 'forecast_month', 'forecast_year'].includes(tariffCode)) {
            this.compatibilityFields.style.display = 'none';
            this.targetDateField.style.display = 'block';

            const weekPicker = document.getElementById('weekPickerContainer');
            const monthPicker = document.getElementById('monthPickerContainer');
            const yearPicker = document.getElementById('yearPickerContainer');
            const targetDateInput = document.getElementById('targetDate');

            if (tariffCode === 'forecast_week') {
                if (weekPicker) {
                    weekPicker.style.display = 'block';
                    const today = new Date();
                    const monday = this.getMonday(today);
                    this.updateWeekDisplay(monday);
                }
                if (monthPicker) monthPicker.style.display = 'none';
                if (yearPicker) yearPicker.style.display = 'none';
                if (targetDateInput) targetDateInput.style.display = 'none';

            } else if (tariffCode === 'forecast_month') {
                if (monthPicker) {
                    monthPicker.style.display = 'block';
                    this.updateMonthDisplay(new Date());
                }
                if (weekPicker) weekPicker.style.display = 'none';
                if (yearPicker) yearPicker.style.display = 'none';
                if (targetDateInput) targetDateInput.style.display = 'none';

            } else if (tariffCode === 'forecast_year') {
                if (yearPicker) {
                    yearPicker.style.display = 'block';
                    const currentYear = new Date().getFullYear();
                    this.updateYearDisplay(currentYear);
                }
                if (weekPicker) weekPicker.style.display = 'none';
                if (monthPicker) monthPicker.style.display = 'none';
                if (targetDateInput) {
                    targetDateInput.style.display = 'none';
                    targetDateInput.value = '';
                }
            } else {
                if (weekPicker) weekPicker.style.display = 'none';
                if (monthPicker) monthPicker.style.display = 'none';
                if (yearPicker) yearPicker.style.display = 'none';
                if (targetDateInput) {
                    targetDateInput.style.display = 'block';
                    targetDateInput.value = '';
                }
            }
        } else {
            this.compatibilityFields.style.display = 'none';
            this.targetDateField.style.display = 'none';

            const weekPicker = document.getElementById('weekPickerContainer');
            const monthPicker = document.getElementById('monthPickerContainer');
            const yearPicker = document.getElementById('yearPickerContainer');
            if (weekPicker) weekPicker.style.display = 'none';
            if (monthPicker) monthPicker.style.display = 'none';
            if (yearPicker) yearPicker.style.display = 'none';
        }

        // Обновляем информацию о цене
        this.updatePriceInfo(tariff);

        // Показываем секцию ввода
        this.tariffSection.style.display = 'none';
        this.inputSection.style.display = 'block';

        // Обновляем подсветку в тарифах
        this.renderTariffs();
    }

    getMonday(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    }

    updatePriceInfo(tariff) {
        const priceInfo = document.getElementById('selectedTariffPrice');
        let price = tariff.price;
        let html = '';

        if (this.activeSubscription) {
            if (['forecast_day', 'forecast_week', 'forecast_month', 'forecast_year'].includes(tariff.code)) {
                html = '<span class="price-free">Бесплатно</span> <span class="discount-badge">По подписке</span>';
            } else if (tariff.code === 'forecast_full') {
                const discounted = Math.round(price * 0.5);
                html = `
                    <span class="price-current">${discounted} ₽</span>
                    <span class="price-old">${price} ₽</span>
                    <span class="discount-badge">-50%</span>
                `;
            } else {
                html = `<span class="price-current">${price} ₽</span>`;
            }
        } else {
            html = `<span class="price-current">${price} ₽</span>`;
        }

        priceInfo.innerHTML = html;
    }

    addEventListeners() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        document.getElementById('newCalculationBtn')?.addEventListener('click', () => this.resetForm());
        document.getElementById('upgradeCalculationBtn')?.addEventListener('click', () => this.upgradeToFull());
        document.getElementById('downloadPdfBtn')?.addEventListener('click', () => this.downloadPDFReport());

        // Добавляем обработчики для табов
        this.setupTabListeners();
    }

    setupTabListeners() {
        // Основные табы
        document.querySelectorAll('.tab-btn[data-tab]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (btn.classList.contains('locked')) {
                    e.preventDefault();
                    this.showNotification('🔒 Этот раздел доступен только в полном расчете', 'info');
                    return;
                }

                const tabId = btn.dataset.tab;
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

                btn.classList.add('active');
                const tabContent = document.getElementById('tab' + tabId.charAt(0).toUpperCase() + tabId.slice(1));
                if (tabContent) tabContent.classList.add('active');
            });
        });

        // Табы интерпретаций
        document.querySelectorAll('.interpretation-tabs .tab-btn[data-interpretation]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (btn.classList.contains('locked')) {
                    e.preventDefault();
                    this.showNotification('🔒 Этот раздел доступен только в полном расчете', 'info');
                    return;
                }

                const interpretation = btn.dataset.interpretation;
                document.querySelectorAll('.interpretation-tabs .tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.interpretation-pane').forEach(p => p.classList.remove('active'));

                btn.classList.add('active');
                const pane = document.getElementById('interpretation-' + interpretation);
                if (pane) pane.classList.add('active');
            });
        });
    }

    async handleSubmit(e) {
        e.preventDefault();

        const fullName = document.getElementById('fullName').value.trim();
        const birthDate = document.getElementById('birthDate').value.trim();

        if (!this.validateForm(fullName, birthDate)) return;

        this.showLoading(true);

        try {
            const token = localStorage.getItem('token');
            const headers = {'Content-Type': 'application/json'};
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const requestData = {
                fullName,
                birthDate: this.formatDateForServer(birthDate)
            };

            // Добавляем дополнительные поля
            if (this.selectedTariff?.code === 'compatibility') {
                requestData.partnerName = document.getElementById('partnerName').value.trim();
                requestData.partnerBirthDate = this.formatDateForServer(document.getElementById('partnerBirthDate').value.trim());

                if (!requestData.partnerName || !requestData.partnerBirthDate) {
                    this.showNotification('Заполните данные партнера', 'error');
                    this.showLoading(false);
                    return;
                }
            } else if (['forecast_day', 'forecast_week', 'forecast_month', 'forecast_year'].includes(this.selectedTariff?.code)) {
                let targetDateValue = '';

                if (this.selectedTariff.code === 'forecast_week') {
                    targetDateValue = document.getElementById('selectedWeekStart')?.value;
                    if (!targetDateValue) {
                        this.showNotification('Выберите неделю', 'error');
                        this.showLoading(false);
                        return;
                    }
                    requestData.targetDate = targetDateValue;

                } else if (this.selectedTariff.code === 'forecast_month') {
                    targetDateValue = document.getElementById('targetDate')?.value;
                    if (!targetDateValue) {
                        this.showNotification('Выберите месяц', 'error');
                        this.showLoading(false);
                        return;
                    }
                    requestData.targetDate = targetDateValue;

                } else if (this.selectedTariff.code === 'forecast_year') {
                    targetDateValue = document.getElementById('targetDate')?.value;
                    if (!targetDateValue) {
                        this.showNotification('Выберите год', 'error');
                        this.showLoading(false);
                        return;
                    }
                    requestData.targetDate = targetDateValue;

                } else {
                    const inputDate = document.getElementById('targetDate').value.trim();
                    if (!inputDate) {
                        this.showNotification('Укажите дату прогноза', 'error');
                        this.showLoading(false);
                        return;
                    }
                    requestData.targetDate = this.formatDateForServer(inputDate);
                }
            }

            // Определяем эндпоинт
            let endpoint = '';

            if (this.selectedTariff.code === 'forecast_basic') {
                endpoint = '/api/numerology/calculate/basic';
            } else if (this.selectedTariff.code === 'forecast_full') {
                endpoint = '/api/numerology/calculate/full';
            } else if (this.selectedTariff.code === 'compatibility') {
                endpoint = '/api/numerology/compatibility';
            } else if (this.selectedTariff.code.startsWith('forecast_')) {
                const forecastType = this.selectedTariff.code.replace('forecast_', '');
                endpoint = `/api/numerology/forecast/${forecastType}`;
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                headers,
                body: JSON.stringify(requestData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));

                if (response.status === 401) {
                    this.showNotification('Необходимо авторизоваться', 'error');
                    setTimeout(() => window.location.href = '/login', 2000);
                    return;
                }

                if (response.status === 402) {
                    this.showPaymentModal(errorData);
                    this.showLoading(false);
                    return;
                }

                throw new Error(errorData.error || `Ошибка ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                window.currentNumerologyData = data.data;
                window.currentCalculationId = data.calculationId;
                this.currentCalculation = data.data;

                if (this.selectedTariff.code === 'forecast_week' && data.data.forecast) {
                    const weekStart = document.getElementById('selectedWeekStart')?.value;
                    const weekEnd = document.getElementById('selectedWeekEnd')?.value;

                    if (weekStart && weekEnd) {
                        data.data.forecast.weekRange = {
                            start: weekStart,
                            end: weekEnd
                        };
                    }
                }

                this.displayResults(data.data);
            } else {
                throw new Error(data.error || 'Ошибка расчета');
            }

        } catch (error) {
            console.error('❌ Ошибка:', error);
            this.showNotification(error.message, 'error');
        } finally {
            this.showLoading(false);
        }
    }

    displayResults(data) {
        // Определяем, полный ли это расчет
        const isFull = data.tarot && data.zodiac && data.psychology;
        const isForecast = data.forecast || this.selectedTariff?.code?.startsWith('forecast_');
        const isWeekForecast = this.selectedTariff?.code === 'forecast_week';
        const isMonthForecast = this.selectedTariff?.code === 'forecast_month';
        const isYearForecast = this.selectedTariff?.code === 'forecast_year';
        const isCompatibility = this.selectedTariff?.code === 'compatibility';

        // Обновляем заголовок
        let resultType = '🔮 КОСМОГРАММА ЛИЧНОСТИ';
        let badge = '';

        if (isFull) {
            resultType = '⭐ ПОЛНЫЙ НУМЕРОЛОГИЧЕСКИЙ ОТЧЕТ';
            badge = '<span class="result-badge full">Полный отчет</span>';
        } else if (isYearForecast) {
            resultType = '📅 ПРОГНОЗ НА ГОД';
            badge = '<span class="result-badge forecast">Годовой прогноз</span>';
        } else if (isMonthForecast) {
            resultType = '📅 ПРОГНОЗ НА МЕСЯЦ';
            badge = '<span class="result-badge forecast">Месячный прогноз</span>';
        } else if (isWeekForecast) {
            resultType = '📅 ПРОГНОЗ НА НЕДЕЛЮ';
            badge = '<span class="result-badge forecast">Недельный прогноз</span>';
        } else if (isForecast) {
            const forecastName = this.selectedTariff?.name || 'Прогноз';
            resultType = `📅 ${forecastName.toUpperCase()}`;
            badge = '<span class="result-badge forecast">Прогноз</span>';
        } else if (isCompatibility) {
            resultType = '💑 АНАЛИЗ СОВМЕСТИМОСТИ';
            badge = '<span class="result-badge compatibility">Совместимость</span>';
        } else {
            badge = '<span class="result-badge basic">Базовый расчет</span>';
        }

        document.getElementById('resultType').textContent = resultType;
        document.getElementById('resultBadge').innerHTML = badge;

        // Заполняем базовые данные
        document.getElementById('resultFullName').textContent = data.fullName || this.user?.fullName || '—';
        document.getElementById('resultBirthDate').textContent = data.birthDate || '—';

        // ВСЕГДА отображаем базовые числа, если они есть
        if (data.forecast?.personNumbers) {
            const personNumbers = data.forecast.personNumbers;
            document.getElementById('fateNumber').textContent = personNumbers.fate || '—';
            document.getElementById('nameNumber').textContent = personNumbers.name || '—';
            document.getElementById('surnameNumber').textContent = personNumbers.surname || '—';
            document.getElementById('patronymicNumber').textContent = personNumbers.patronymic || '—';
        } else if (data.numerology?.base) {
            document.getElementById('fateNumber').textContent = data.numerology.base.fate || '—';
            document.getElementById('nameNumber').textContent = data.numerology.base.name || '—';
            document.getElementById('surnameNumber').textContent = data.numerology.base.surname || '—';
            document.getElementById('patronymicNumber').textContent = data.numerology.base.patronymic || '—';
        }

        if (data.numerology?.achilles) {
            document.getElementById('achillesNumber').textContent = data.numerology.achilles.number || '—';
        }

        if (data.numerology?.control) {
            document.getElementById('controlNumber').textContent = data.numerology.control.number || '—';
        }

        if (data.numerology?.calls) {
            document.getElementById('callClose').textContent = data.numerology.calls.close || '—';
            document.getElementById('callSocial').textContent = data.numerology.calls.social || '—';
            document.getElementById('callWorld').textContent = data.numerology.calls.world || '—';

            if (data.numerology.calls.descriptions) {
                document.getElementById('callCloseDesc').textContent = data.numerology.calls.descriptions.close || '';
                document.getElementById('callSocialDesc').textContent = data.numerology.calls.descriptions.social || '';
                document.getElementById('callWorldDesc').textContent = data.numerology.calls.descriptions.world || '';
            }
        }

        // Для прогноза показываем специальный блок
        if (isForecast && data.forecast) {
            // Скрываем ненужные для прогноза элементы
            const specialNumbers = document.querySelector('.special-numbers');
            const callsSection = document.querySelector('.calls-section');
            const additionalSections = document.querySelector('.additional-sections');

            if (specialNumbers) specialNumbers.style.display = 'none';
            if (callsSection) callsSection.style.display = 'none';
            if (additionalSections) additionalSections.style.display = 'none';

            // Показываем соответствующий блок
            if (isYearForecast) {
                this.displayYearForecast(data.forecast);
            } else if (isMonthForecast) {
                this.displayMonthForecast(data.forecast);
            } else if (isWeekForecast) {
                this.displayWeekForecast(data.forecast);
            } else {
                this.displayForecast(data.forecast, data.interpretation, data.deepPortrait);
            }
        } else {
            // Для других типов показываем стандартные элементы
            const specialNumbers = document.querySelector('.special-numbers');
            const callsSection = document.querySelector('.calls-section');
            const additionalSections = document.querySelector('.additional-sections');

            if (specialNumbers) specialNumbers.style.display = 'flex';
            if (callsSection) callsSection.style.display = 'block';
            if (additionalSections) additionalSections.style.display = 'block';
        }

        // Свиток судьбы
        const interpretationText = document.getElementById('interpretationText');
        if (interpretationText) {
            if (data.interpretation) {
                interpretationText.innerHTML = `<p>${data.interpretation.replace(/\n/g, '<br>')}</p>`;
            } else {
                interpretationText.innerHTML = '<p>Интерпретация формируется...</p>';
            }
        }

        // Глубинный портрет
        const deepPortrait = document.getElementById('deepPortrait');
        if (deepPortrait) {
            if (data.deepPortrait) {
                deepPortrait.innerHTML = `<p>${data.deepPortrait.replace(/\n/g, '<br>')}</p>`;
            } else {
                deepPortrait.innerHTML = '<p>Портрет формируется...</p>';
            }
        }

        // Разблокируем расширенные разделы, если это полный расчет
        if (isFull) {
            this.unlockFullSections(data);
        } else {
            this.lockSections();
        }

        // Показываем PDF кнопку для авторизованных
        const downloadPdfBtn = document.getElementById('downloadPdfBtn');
        if (downloadPdfBtn && localStorage.getItem('token')) {
            downloadPdfBtn.style.display = 'block';
        }

        // Показываем кнопку апгрейда для базового расчета
        const upgradeBtn = document.getElementById('upgradeCalculationBtn');
        if (upgradeBtn) {
            if (!isFull && this.selectedTariff?.code !== 'forecast_full' && !isForecast) {
                upgradeBtn.style.display = 'block';
            } else {
                upgradeBtn.style.display = 'none';
            }
        }

        // Скрываем секции ввода и показываем результат
        if (this.tariffSection) this.tariffSection.style.display = 'none';
        if (this.inputSection) this.inputSection.style.display = 'none';
        if (this.resultSection) {
            this.resultSection.style.display = 'block';
            this.resultSection.scrollIntoView({behavior: 'smooth'});
        }
    }

    displayForecast(forecast, interpretation, deepPortrait) {
        if (!forecast) return;

        // Создаем или находим контейнер для прогноза
        let forecastContainer = document.getElementById('forecastResult');
        if (!forecastContainer) {
            forecastContainer = document.createElement('div');
            forecastContainer.id = 'forecastResult';
            forecastContainer.className = 'forecast-result';

            const interpretationDiv = document.querySelector('.full-interpretation');
            if (interpretationDiv) {
                interpretationDiv.before(forecastContainer);
            } else {
                const resultCard = document.querySelector('.result-card');
                if (resultCard) {
                    resultCard.appendChild(forecastContainer);
                }
            }
        }

        const numbers = forecast.numbers || {};
        const desc = forecast.description || {};
        const universal = desc.universal || {};
        const personal = desc.personal || {};
        const expression = desc.expression || {};
        const dateInfo = desc.dateInfo || {};

        let formattedDate = forecast.targetDate || '';
        if (formattedDate && formattedDate.includes('-')) {
            const [year, month, day] = formattedDate.split('-');
            formattedDate = `${day}.${month}.${year}`;
        }

        let html = `
        <div class="forecast-card">
            <div class="forecast-header">
                <div class="forecast-number-large">${numbers.universal || '?'}</div>
                <div class="forecast-title">
                    <h3>${universal.name || 'Прогноз на день'}</h3>
                    <p>${dateInfo.dayOfWeek || ''}, ${formattedDate || ''}</p>
                </div>
            </div>
            
            <div class="forecast-cosmic-code">
                <h4><i class="fas fa-star"></i> КОСМИЧЕСКИЙ КОД ДНЯ</h4>
                <div class="code-grid">
                    <div class="code-item">
                        <span class="label">Универсальное число</span>
                        <span class="value">${numbers.universal || '?'}</span>
                        <span class="desc">${universal.keywords ? universal.keywords.join(', ') : ''}</span>
                    </div>
                    <div class="code-item">
                        <span class="label">Личное число</span>
                        <span class="value">${numbers.personal || '?'}</span>
                        <span class="desc">${personal.influence || ''}</span>
                    </div>
                    <div class="code-item">
                        <span class="label">Число выражения</span>
                        <span class="value">${numbers.expression || '?'}</span>
                        <span class="desc">${expression.meaning || ''}</span>
                    </div>
                </div>
            </div>
            
            <div class="forecast-energy">
                <div class="energy-badge">
                    <span><i class="fas fa-fire"></i> Стихия: ${universal.element || ''}</span>
                    <span><i class="fas fa-globe"></i> Планета: ${universal.planet || ''}</span>
                    <span><i class="fas fa-moon"></i> Лунный день: ${dateInfo.lunarDay || ''}</span>
                </div>
            </div>
            
            <div class="forecast-main">
                <p class="forecast-positive">${universal.positive || ''}</p>
                ${universal.negative ? `<p class="forecast-negative">⚠️ ${universal.negative}</p>` : ''}
            </div>
            
            <div class="forecast-sections">
                <div class="forecast-section">
                    <h4><i class="fas fa-briefcase"></i> Карьера</h4>
                    <p>${universal.career || ''}</p>
                </div>
                
                <div class="forecast-section">
                    <h4><i class="fas fa-heart"></i> Любовь</h4>
                    <p>${universal.love || ''}</p>
                </div>
                
                <div class="forecast-section">
                    <h4><i class="fas fa-leaf"></i> Здоровье</h4>
                    <p>${universal.health || ''}</p>
                </div>
                
                <div class="forecast-section">
                    <h4><i class="fas fa-coins"></i> Финансы</h4>
                    <p>${universal.finance || ''}</p>
                </div>
            </div>
        `;

        if (forecast.tarot) {
            html += `
            <div class="forecast-tarot">
                <h4><i class="fas fa-crown"></i> КАРТА ТАРО ДНЯ: ${forecast.tarot.name || ''}</h4>
                <div class="tarot-mini">
                    <div class="tarot-image-mini">
                        <img src="${forecast.tarot.image || '/images/tarot/back.jpg'}" alt="${forecast.tarot.name || 'Таро'}" onerror="this.src='/images/tarot/back.jpg'">
                    </div>
                    <div class="tarot-desc-mini">
                        <p>${forecast.tarot.description || ''}</p>
                        <p class="tarot-advice"><strong>Совет:</strong> ${forecast.tarot.advice || ''}</p>
                    </div>
                </div>
            </div>
            `;
        }

        html += `<div class="forecast-details-grid">`;

        if (forecast.fengShui?.colors || forecast.colors) {
            const colors = forecast.fengShui?.colors || forecast.colors || [];
            html += `
            <div class="detail-block">
                <h5><i class="fas fa-paint-brush"></i> Цвета дня</h5>
                <p>${Array.isArray(colors) ? colors.join(', ') : colors}</p>
            </div>
            `;
        }

        if (forecast.crystals) {
            html += `
            <div class="detail-block">
                <h5><i class="fas fa-gem"></i> Камни-талисманы</h5>
                <p>${Array.isArray(forecast.crystals) ? forecast.crystals.join(', ') : forecast.crystals}</p>
            </div>
            `;
        }

        if (forecast.scents) {
            html += `
            <div class="detail-block">
                <h5><i class="fas fa-leaf"></i> Ароматы</h5>
                <p>${Array.isArray(forecast.scents) ? forecast.scents.join(', ') : forecast.scents}</p>
            </div>
            `;
        }

        const directions = this.getDirections(numbers.universal);
        if (directions) {
            html += `
            <div class="detail-block">
                <h5><i class="fas fa-compass"></i> Направления</h5>
                <p>${directions.join(', ')}</p>
            </div>
            `;
        }

        if (forecast.favorableHours) {
            html += `
            <div class="detail-block">
                <h5><i class="fas fa-clock"></i> Благоприятные часы</h5>
                <p>${Array.isArray(forecast.favorableHours) ? forecast.favorableHours.join(', ') : forecast.favorableHours}</p>
            </div>
            `;
        }

        html += `</div>`;

        if (forecast.fengShui?.advice) {
            html += `
            <div class="forecast-fengshui">
                <h4><i class="fas fa-wind"></i> Фен-шуй совет</h4>
                <p>${forecast.fengShui.advice}</p>
            </div>
            `;
        }

        if (forecast.affirmation) {
            html += `
            <div class="forecast-affirmation">
                <i class="fas fa-quote-left"></i>
                <p>${forecast.affirmation}</p>
            </div>
            `;
        }

        html += `</div>`;

        forecastContainer.innerHTML = html;
    }

    displayWeekForecast(forecast) {
        if (!forecast) return;

        let forecastContainer = document.getElementById('forecastResult');
        if (!forecastContainer) {
            forecastContainer = document.createElement('div');
            forecastContainer.id = 'forecastResult';
            forecastContainer.className = 'forecast-result';

            const interpretationDiv = document.querySelector('.full-interpretation');
            if (interpretationDiv) {
                interpretationDiv.before(forecastContainer);
            } else {
                const resultCard = document.querySelector('.result-card');
                if (resultCard) {
                    resultCard.appendChild(forecastContainer);
                }
            }
        }

        const weekRange = forecast.weekRange || {};
        const weekAnalysis = forecast.weekAnalysis || {};
        const lifeAreas = forecast.lifeAreas || {};
        const dailyBreakdown = forecast.dailyBreakdown || [];
        const favorableDays = forecast.favorableDays || {};
        const tarot = forecast.tarot || {};
        const fengShui = forecast.fengShui || {};
        const colors = forecast.colors || [];
        const crystals = forecast.crystals || [];
        const scents = forecast.scents || [];
        const affirmation = forecast.affirmation || '';
        const weekRuler = forecast.weekRuler || {};
        const weekEnergy = forecast.weekEnergy || '';

        const formatDate = (dateStr) => {
            if (!dateStr) return '';
            return dateStr;
        };

        const dailyHTML = dailyBreakdown.map(day => {
            const todayClass = day.isToday ? ' today' : '';
            return `
            <div class="week-day-card${todayClass}">
                <div class="day-header">
                    <span class="day-name">${day.dayName}</span>
                    <span class="day-date">${day.date}</span>
                </div>
                <div class="day-numbers">
                    <span class="day-number-large">${day.universalNumber}</span>
                    <span class="day-personal">личн. ${day.personalNumber}</span>
                </div>
                <div class="day-energy">${day.energy}</div>
                <div class="day-focus">${day.focus}</div>
                <div class="day-advice">💫 ${day.advice}</div>
                <div class="day-details">
                    <span><i class="fas fa-clock"></i> ${day.favorableHours ? day.favorableHours[0] : ''}</span>
                    <span><i class="fas fa-palette"></i> ${day.color || ''}</span>
                </div>
            </div>
            `;
        }).join('');

        const favorableHTML = (favorableDays.favorable || []).map(day => `
        <div class="favorable-day-item">
            <span class="day-name">${day.name}</span>
            <span class="day-date">${day.date}</span>
            <span class="day-number">${day.number}</span>
            <span class="day-reason">${day.reason}</span>
        </div>
        `).join('');

        const neutralHTML = (favorableDays.neutral || []).map(day => `
        <div class="neutral-day-item">
            <span class="day-name">${day.name}</span>
            <span class="day-date">${day.date}</span>
            <span class="day-number">${day.number}</span>
            <span class="day-reason">${day.reason}</span>
        </div>
        `).join('');

        let html = `
        <div class="forecast-card week-forecast">
            <div class="forecast-header">
                <div class="forecast-number-large">${forecast.weekNumber || '?'}</div>
                <div class="forecast-title">
                    <h3>ПРОГНОЗ НА НЕДЕЛЮ</h3>
                    <p class="week-range">${formatDate(weekRange.start)} — ${formatDate(weekRange.end)}</p>
                    <div class="week-energy-badge">${weekEnergy}</div>
                </div>
            </div>
            
            <div class="week-ruler-info">
                <span><i class="fas fa-globe"></i> Покровитель: ${weekRuler.planet} (${weekRuler.element})</span>
                <span><i class="fas fa-star"></i> Качество: ${weekRuler.quality}</span>
            </div>
            
            <div class="week-theme">
                <h4>${weekAnalysis.theme}</h4>
                <p>${weekAnalysis.description}</p>
                <div class="personal-note">${weekAnalysis.personalNote}</div>
            </div>
            
            <div class="week-advice">
                <i class="fas fa-quote-left"></i>
                <p>${weekAnalysis.advice}</p>
            </div>
            
            <div class="week-sections">
                <div class="section opportunities">
                    <h5><i class="fas fa-check-circle"></i> Возможности</h5>
                    <ul>
                        ${(weekAnalysis.opportunities || []).map(o => `<li>${o}</li>`).join('')}
                    </ul>
                </div>
                <div class="section challenges">
                    <h5><i class="fas fa-exclamation-triangle"></i> Вызовы</h5>
                    <ul>
                        ${(weekAnalysis.challenges || []).map(c => `<li>${c}</li>`).join('')}
                    </ul>
                </div>
            </div>
            
            <div class="life-areas-grid">
                <div class="life-area career">
                    <i class="fas fa-briefcase"></i>
                    <p>${lifeAreas.career || ''}</p>
                </div>
                <div class="life-area love">
                    <i class="fas fa-heart"></i>
                    <p>${lifeAreas.love || ''}</p>
                </div>
                <div class="life-area health">
                    <i class="fas fa-leaf"></i>
                    <p>${lifeAreas.health || ''}</p>
                </div>
                <div class="life-area finance">
                    <i class="fas fa-coins"></i>
                    <p>${lifeAreas.finance || ''}</p>
                </div>
            </div>
            
            <h4 class="section-title"><i class="fas fa-calendar-alt"></i> ДНЕВНАЯ РАЗБИВКА</h4>
            <div class="week-daily-breakdown">
                ${dailyHTML}
            </div>
            
            <div class="favorable-days-section">
                <h4><i class="fas fa-star"></i> БЛАГОПРИЯТНЫЕ ДНИ</h4>
                <div class="favorable-days-grid">
                    ${favorableHTML}
                </div>
                
                ${neutralHTML ? `
                <h4><i class="fas fa-minus-circle"></i> НЕЙТРАЛЬНЫЕ ДНИ</h4>
                <div class="neutral-days-grid">
                    ${neutralHTML}
                </div>
                ` : ''}
            </div>
            
            ${tarot.name ? `
            <div class="week-tarot">
                <h4><i class="fas fa-crown"></i> КАРТА ТАРО НЕДЕЛИ: ${tarot.name}</h4>
                <div class="tarot-mini">
                    <div class="tarot-image-mini">
                        <img src="${tarot.image || '/images/tarot/back.jpg'}" alt="${tarot.name}">
                    </div>
                    <div class="tarot-desc-mini">
                        <p>${tarot.description || ''}</p>
                        <p class="tarot-advice"><strong>Совет:</strong> ${tarot.advice || ''}</p>
                    </div>
                </div>
            </div>
            ` : ''}
            
            <div class="week-details-grid">
                <div class="detail-block">
                    <h5><i class="fas fa-wind"></i> Фен-шуй</h5>
                    <p><strong>Элемент:</strong> ${fengShui.element}</p>
                    <p><strong>Зона:</strong> ${fengShui.zone}</p>
                    <p><strong>Активация:</strong> ${fengShui.activation}</p>
                    <p class="advice">${fengShui.advice || ''}</p>
                </div>
                
                <div class="detail-block">
                    <h5><i class="fas fa-paint-brush"></i> Цвета недели</h5>
                    <div class="color-chips">
                        ${colors.map(c => `<span class="color-chip" style="background-color: ${this.getColorCode(c)}">${c}</span>`).join('')}
                    </div>
                </div>
                
                <div class="detail-block">
                    <h5><i class="fas fa-gem"></i> Камни</h5>
                    <p>${crystals.join(', ')}</p>
                </div>
                
                <div class="detail-block">
                    <h5><i class="fas fa-leaf"></i> Ароматы</h5>
                    <p>${scents.join(', ')}</p>
                </div>
            </div>
            
            ${affirmation ? `
            <div class="week-affirmation">
                <i class="fas fa-quote-left"></i>
                <p>${affirmation}</p>
            </div>
            ` : ''}
        </div>
        `;

        forecastContainer.innerHTML = html;
    }

    displayMonthForecast(forecast) {
        if (!forecast) return;

        let forecastContainer = document.getElementById('forecastResult');
        if (!forecastContainer) {
            forecastContainer = document.createElement('div');
            forecastContainer.id = 'forecastResult';
            forecastContainer.className = 'forecast-result';

            const interpretationDiv = document.querySelector('.full-interpretation');
            if (interpretationDiv) {
                interpretationDiv.before(forecastContainer);
            } else {
                const resultCard = document.querySelector('.result-card');
                if (resultCard) {
                    resultCard.appendChild(forecastContainer);
                }
            }
        }

        const monthRange = forecast.monthRange || {};
        const monthAnalysis = forecast.monthAnalysis || {};
        const lifeAreas = forecast.lifeAreas || {};
        const weeklyBreakdown = forecast.weeklyBreakdown || [];
        const importantDates = forecast.importantDates || [];
        const tarot = forecast.tarot || {};
        const fengShui = forecast.fengShui || {};
        const colors = forecast.colors || [];
        const crystals = forecast.crystals || [];
        const scents = forecast.scents || [];
        const affirmation = forecast.affirmation || '';
        const monthRuler = forecast.monthRuler || {};
        const monthEnergy = forecast.monthEnergy || '';
        const monthElement = forecast.monthElement || '';

        const formatDate = (dateStr) => {
            if (!dateStr) return '';
            return dateStr;
        };

        const weeklyHTML = weeklyBreakdown.map(week => `
        <div class="month-week-card">
            <div class="week-header">
                <span class="week-number">Неделя ${week.weekNumber}</span>
                <span class="week-dates">${week.startDate} — ${week.endDate}</span>
                <span class="week-energy">${week.energy}</span>
            </div>
            <div class="week-content">
                <div class="week-number-value">Число недели: <strong>${week.weekNumberValue}</strong></div>
                <div class="week-focus">${week.focus}</div>
            </div>
        </div>
        `).join('');

        const importantDatesHTML = importantDates.map(date => `
        <div class="important-date-item">
            <span class="date-day">${date.date}</span>
            <span class="date-dayofweek">${date.dayOfWeek}</span>
            <span class="date-number">${date.dayNumber}</span>
            <span class="date-reason">${date.reason}</span>
        </div>
        `).join('');

        let html = `
        <div class="forecast-card month-forecast">
            <div class="forecast-header">
                <div class="forecast-number-large">${forecast.monthNumber || '?'}</div>
                <div class="forecast-title">
                    <h3>ПРОГНОЗ НА МЕСЯЦ</h3>
                    <p class="month-range">${monthRange.monthName || ''} ${monthRange.year || ''}</p>
                    <p class="month-dates">${formatDate(monthRange.start)} — ${formatDate(monthRange.end)}</p>
                    <div class="month-energy-badge">${monthEnergy}</div>
                </div>
            </div>
            
            <div class="month-ruler-info">
                <span><i class="fas fa-globe"></i> Покровитель: ${monthRuler.planet} (${monthRuler.element})</span>
                <span><i class="fas fa-star"></i> Качество: ${monthRuler.quality}</span>
                <span><i class="fas fa-wind"></i> Стихия: ${monthElement}</span>
            </div>
            
            <div class="month-theme">
                <h4>${monthAnalysis.theme}</h4>
                <p>${monthAnalysis.description}</p>
                <div class="personal-note">${monthAnalysis.personalNote}</div>
            </div>
            
            <div class="month-advice">
                <i class="fas fa-quote-left"></i>
                <p>${monthAnalysis.advice}</p>
            </div>
            
            <div class="month-sections">
                <div class="section opportunities">
                    <h5><i class="fas fa-check-circle"></i> Возможности месяца</h5>
                    <ul>
                        ${(monthAnalysis.opportunities || []).map(o => `<li>${o}</li>`).join('')}
                    </ul>
                </div>
                <div class="section challenges">
                    <h5><i class="fas fa-exclamation-triangle"></i> Вызовы месяца</h5>
                    <ul>
                        ${(monthAnalysis.challenges || []).map(c => `<li>${c}</li>`).join('')}
                    </ul>
                </div>
            </div>
            
            <div class="life-areas-grid">
                <div class="life-area career">
                    <i class="fas fa-briefcase"></i>
                    <p>${lifeAreas.career || ''}</p>
                </div>
                <div class="life-area love">
                    <i class="fas fa-heart"></i>
                    <p>${lifeAreas.love || ''}</p>
                </div>
                <div class="life-area health">
                    <i class="fas fa-leaf"></i>
                    <p>${lifeAreas.health || ''}</p>
                </div>
                <div class="life-area finance">
                    <i class="fas fa-coins"></i>
                    <p>${lifeAreas.finance || ''}</p>
                </div>
            </div>
            
            <h4 class="section-title"><i class="fas fa-calendar-alt"></i> НЕДЕЛЬНАЯ РАЗБИВКА</h4>
            <div class="month-weekly-breakdown">
                ${weeklyHTML}
            </div>
            
            ${importantDatesHTML ? `
            <div class="important-dates-section">
                <h4><i class="fas fa-star"></i> ВАЖНЫЕ ДАТЫ МЕСЯЦА</h4>
                <div class="important-dates-grid">
                    ${importantDatesHTML}
                </div>
            </div>
            ` : ''}
            
            ${tarot.name ? `
            <div class="month-tarot">
                <h4><i class="fas fa-crown"></i> КАРТА ТАРО МЕСЯЦА: ${tarot.name}</h4>
                <div class="tarot-mini">
                    <div class="tarot-image-mini">
                        <img src="${tarot.image || '/images/tarot/back.jpg'}" alt="${tarot.name}">
                    </div>
                    <div class="tarot-desc-mini">
                        <p>${tarot.description || ''}</p>
                        <p class="tarot-advice"><strong>Совет:</strong> ${tarot.advice || ''}</p>
                    </div>
                </div>
            </div>
            ` : ''}
            
            <div class="month-details-grid">
                <div class="detail-block">
                    <h5><i class="fas fa-wind"></i> Фен-шуй</h5>
                    <p><strong>Элемент:</strong> ${fengShui.element}</p>
                    <p><strong>Зона:</strong> ${fengShui.zone}</p>
                    <p><strong>Активация:</strong> ${fengShui.activation}</p>
                    <p class="advice">${fengShui.advice || ''}</p>
                </div>
                
                <div class="detail-block">
                    <h5><i class="fas fa-paint-brush"></i> Цвета месяца</h5>
                    <div class="color-chips">
                        ${colors.map(c => `<span class="color-chip" style="background-color: ${this.getColorCode(c)}">${c}</span>`).join('')}
                    </div>
                </div>
                
                <div class="detail-block">
                    <h5><i class="fas fa-gem"></i> Камни</h5>
                    <p>${crystals.join(', ')}</p>
                </div>
                
                <div class="detail-block">
                    <h5><i class="fas fa-leaf"></i> Ароматы</h5>
                    <p>${scents.join(', ')}</p>
                </div>
            </div>
            
            ${affirmation ? `
            <div class="month-affirmation">
                <i class="fas fa-quote-left"></i>
                <p>${affirmation}</p>
            </div>
            ` : ''}
        </div>
        `;

        forecastContainer.innerHTML = html;
    }

    displayYearForecast(forecast) {
        if (!forecast) return;

        let forecastContainer = document.getElementById('forecastResult');
        if (!forecastContainer) {
            forecastContainer = document.createElement('div');
            forecastContainer.id = 'forecastResult';
            forecastContainer.className = 'forecast-result';

            const interpretationDiv = document.querySelector('.full-interpretation');
            if (interpretationDiv) {
                interpretationDiv.before(forecastContainer);
            } else {
                const resultCard = document.querySelector('.result-card');
                if (resultCard) {
                    resultCard.appendChild(forecastContainer);
                }
            }
        }

        const year = forecast.year || '????';
        const yearNumber = forecast.yearNumber || '?';
        const universalYearNumber = forecast.universalYearNumber || '?';
        const yearTheme = forecast.yearTheme || '🌀 ГОД РАЗВИТИЯ';
        const yearCycle = forecast.yearCycle || {};
        const yearRuler = forecast.yearRuler || {};
        const yearEnergy = forecast.yearEnergy || '🌀 Нейтральный год';
        const yearAnalysis = forecast.yearAnalysis || {};
        const quarterlyBreakdown = forecast.quarterlyBreakdown || [];
        const monthlyHighlights = forecast.monthlyHighlights || [];
        const importantDates = forecast.importantDates || [];
        const tarot = forecast.tarot || {};
        const fengShui = forecast.fengShui || {};
        const colors = forecast.colors || [];
        const crystals = forecast.crystals || [];
        const scents = forecast.scents || [];
        const affirmation = forecast.affirmation || '';
        const personNumbers = forecast.personNumbers || {};

        const chineseAnimal = forecast.yearInfo?.chineseZodiac?.animal ||
            (year === 2024 ? 'Дракон' :
                year === 2025 ? 'Змея' :
                    year === 2026 ? 'Лошадь' : 'Дракон');
        const chineseElement = forecast.yearInfo?.chineseZodiac?.element ||
            (year === 2024 ? 'Дерево' :
                year === 2025 ? 'Дерево' :
                    year === 2026 ? 'Огонь' : 'Земля');
        const chineseScore = forecast.yearInfo?.chineseZodiac?.compatibility?.score || 85;
        const chineseDesc = forecast.yearInfo?.chineseZodiac?.description ||
            `Год ${chineseElement} ${chineseAnimal}. Год благоприятен для развития.`;

        const animalSymbol = this.getChineseZodiacSymbol(chineseAnimal);

        const quarterlyHTML = quarterlyBreakdown.map(quarter => `
        <div class="year-quarter-card">
            <div class="quarter-header">
                <span class="quarter-name">${quarter.season || 'Сезон'}</span>
                <span class="quarter-number">${quarter.number || '?'}</span>
            </div>
            <div class="quarter-months">${(quarter.months || []).join(' • ')}</div>
            <div class="quarter-energy">${quarter.energy || ''}</div>
            <div class="quarter-focus">${quarter.focus || ''}</div>
            <div class="quarter-advice">💫 ${quarter.advice || ''}</div>
        </div>
        `).join('');

        const monthsHTML = monthlyHighlights
            .filter(m => m.importance !== 'обычный')
            .slice(0, 8)
            .map(month => `
            <div class="year-month-item importance-${month.importance || 'обычный'}">
                <span class="month-name">${month.monthName || ''}</span>
                <span class="month-number">${month.number || '?'}</span>
                <span class="month-reason">${month.reason || ''}</span>
            </div>
        `).join('');

        const datesHTML = importantDates.slice(0, 8).map(date => `
        <div class="year-date-item type-${date.type || 'personal'}">
            <span class="date-day">${date.date || ''}</span>
            <span class="date-name">${date.name || ''}</span>
            <span class="date-number">${date.number || '?'}</span>
            <span class="date-reason">${date.reason || ''}</span>
        </div>
        `).join('');

        let html = `
        <div class="forecast-card year-forecast">
            <div class="forecast-header">
                <div class="forecast-number-large">${yearNumber}</div>
                <div class="forecast-title">
                    <h3>ПРОГНОЗ НА ${year} ГОД</h3>
                    <div class="year-theme-badge">${yearTheme}</div>
                </div>
            </div>
            
            <div class="year-universal-number">
                Универсальное число года: <strong>${universalYearNumber}</strong>
            </div>
            
            <div class="year-ruler-info">
                <span><i class="fas fa-globe"></i> Покровитель: ${yearRuler.planet || 'Меркурий'} (${yearRuler.element || 'Воздух'})</span>
                <span><i class="fas fa-star"></i> Качество: ${yearRuler.quality || 'Адаптивность'}</span>
            </div>
            
            <div class="year-cycle">
                <div class="cycle-name">${yearCycle.name || 'Цикл'}</div>
                <div class="cycle-desc">${yearCycle.description || ''}</div>
                <div class="cycle-energy">${yearCycle.energy || ''}</div>
            </div>
            
            <div class="chinese-zodiac">
                <div class="zodiac-animal">${animalSymbol} ${chineseAnimal} (${chineseElement})</div>
                <div class="zodiac-compatibility">Совместимость: ${chineseScore}%</div>
                <div class="zodiac-desc">${chineseDesc}</div>
            </div>
            
            <div class="year-theme">
                <h4>${yearAnalysis.theme || yearTheme}</h4>
                <p>${yearAnalysis.description || 'Год гармоничного развития.'}</p>
                <div class="personal-note">${yearAnalysis.personalNote || ''}</div>
            </div>
            
            <div class="year-advice">
                <i class="fas fa-quote-left"></i>
                <p>${yearAnalysis.advice || 'Будьте внимательны к возможностям.'}</p>
            </div>
            
            <div class="year-sections">
                <div class="section opportunities">
                    <h5><i class="fas fa-check-circle"></i> Возможности</h5>
                    <ul>
                        ${(yearAnalysis.opportunities || ['Новые возможности']).map(o => `<li>${o}</li>`).join('')}
                    </ul>
                </div>
                <div class="section challenges">
                    <h5><i class="fas fa-exclamation-triangle"></i> Вызовы</h5>
                    <ul>
                        ${(yearAnalysis.challenges || ['Неопределенность']).map(c => `<li>${c}</li>`).join('')}
                    </ul>
                </div>
            </div>
            
            <h4 class="section-title"><i class="fas fa-calendar-alt"></i> КВАРТАЛЬНАЯ РАЗБИВКА</h4>
            <div class="year-quarterly-breakdown">
                ${quarterlyHTML || '<p>Нет данных</p>'}
            </div>
            
            <h4 class="section-title"><i class="fas fa-star"></i> КЛЮЧЕВЫЕ МЕСЯЦЫ</h4>
            <div class="year-months-grid">
                ${monthsHTML || '<p>Нет данных</p>'}
            </div>
            
            <h4 class="section-title"><i class="fas fa-calendar-check"></i> ВАЖНЫЕ ДАТЫ</h4>
            <div class="year-dates-grid">
                ${datesHTML || '<p>Нет данных</p>'}
            </div>
            
            ${tarot.name ? `
            <div class="year-tarot">
                <h4><i class="fas fa-crown"></i> КАРТА ТАРО ГОДА: ${tarot.name}</h4>
                <div class="tarot-mini">
                    <div class="tarot-image-mini">
                        <img src="${tarot.image || '/images/tarot/back.jpg'}" alt="${tarot.name}">
                    </div>
                    <div class="tarot-desc-mini">
                        <p>${tarot.description || ''}</p>
                        <p class="tarot-advice"><strong>Совет:</strong> ${tarot.advice || ''}</p>
                    </div>
                </div>
            </div>
            ` : ''}
            
            <div class="year-details-grid">
                <div class="detail-block">
                    <h5><i class="fas fa-wind"></i> Фен-шуй</h5>
                    <p><strong>Элемент:</strong> ${fengShui.element || 'Воздух'}</p>
                    <p><strong>Зона:</strong> ${fengShui.zone || 'Восток'}</p>
                    <p><strong>Активация:</strong> ${fengShui.activation || 'Проветривание'}</p>
                    <p class="advice">${fengShui.advice || ''}</p>
                </div>
                
                <div class="detail-block">
                    <h5><i class="fas fa-paint-brush"></i> Цвета года</h5>
                    <div class="color-chips">
                        ${colors.map(c => `<span class="color-chip" style="background-color: ${this.getColorCode(c)}">${c}</span>`).join('')}
                    </div>
                </div>
                
                <div class="detail-block">
                    <h5><i class="fas fa-gem"></i> Камни</h5>
                    <p>${crystals.join(', ')}</p>
                </div>
                
                <div class="detail-block">
                    <h5><i class="fas fa-leaf"></i> Ароматы</h5>
                    <p>${scents.join(', ')}</p>
                </div>
            </div>
            
            ${affirmation ? `
            <div class="year-affirmation">
                <i class="fas fa-quote-left"></i>
                <p>${affirmation}</p>
            </div>
            ` : ''}
        </div>
        `;

        forecastContainer.innerHTML = html;
    }

    unlockFullSections(data) {
        // Разблокируем все табы
        document.querySelectorAll('.tab-btn.locked').forEach(btn => {
            btn.classList.remove('locked');
            const lockIcon = btn.querySelector('.lock-icon');
            if (lockIcon) lockIcon.remove();
        });

        document.querySelectorAll('.interpretation-tabs .tab-btn.locked').forEach(btn => {
            btn.classList.remove('locked');
            const lockIcon = btn.querySelector('.lock-icon');
            if (lockIcon) lockIcon.remove();
        });

        // Убираем оверлеи
        document.querySelectorAll('.lock-overlay').forEach(overlay => overlay.remove());

        // Заполняем контент
        if (data.zodiac) this.displayZodiac(data.zodiac);
        if (data.fengShui) this.displayFengShui(data.fengShui);
        if (data.tarot) this.displayTarot(data.tarot);
        if (data.psychology) this.displayPsychology(data.psychology);
        if (data.patterns) this.displayPatterns(data.patterns);

        if (data.numerology?.interpretations) {
            this.displayInterpretations(data.numerology.interpretations);
        }

        const firstTab = document.querySelector('.tab-btn:not(.locked)');
        if (firstTab) firstTab.click();
    }

    lockSections() {
        document.querySelectorAll('.tab-btn:not(.locked)').forEach(btn => {
            if (!btn.closest('.result-actions')) {
                btn.classList.add('locked');
                if (!btn.querySelector('.lock-icon')) {
                    const span = document.createElement('span');
                    span.className = 'lock-icon';
                    span.textContent = '🔒';
                    btn.appendChild(span);
                }
            }
        });

        document.querySelectorAll('.interpretation-tabs .tab-btn:not(.locked)').forEach(btn => {
            btn.classList.add('locked');
            if (!btn.querySelector('.lock-icon')) {
                const span = document.createElement('span');
                span.className = 'lock-icon';
                span.textContent = '🔒';
                btn.appendChild(span);
            }
        });
    }

    displayZodiac(zodiac) {
        const tabContent = document.getElementById('tabZodiac');
        if (!tabContent) return;

        tabContent.innerHTML = `
            <div class="zodiac-card">
                <div class="zodiac-header" style="display: flex; align-items: center; gap: 20px; margin-bottom: 20px;">
                    <div style="font-size: 3rem;">${this.getZodiacSymbol(zodiac.name)}</div>
                    <div>
                        <h3 style="margin: 0 0 5px 0; color: var(--accent-gold);">${zodiac.name || 'Знак зодиака'}</h3>
                        <p style="margin: 0; color: var(--text-secondary);">${zodiac.element || ''}</p>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                    <div><strong style="color: var(--accent-gold);">Качество:</strong> <span style="color: var(--text-secondary);">${zodiac.quality || '—'}</span></div>
                    <div><strong style="color: var(--accent-gold);">Планета:</strong> <span style="color: var(--text-secondary);">${zodiac.planet || '—'}</span></div>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <p style="color: var(--text-secondary); line-height: 1.8;">${zodiac.description || ''}</p>
                </div>
                
                <div style="background: rgba(201, 165, 75, 0.05); padding: 15px; border-radius: 12px; margin-bottom: 15px;">
                    <h4 style="color: var(--accent-gold); margin: 0 0 10px 0;">🌟 Сильные стороны</h4>
                    <p style="color: var(--text-secondary); margin: 0;">${zodiac.strengths || ''}</p>
                </div>
                
                <div style="background: rgba(201, 165, 75, 0.05); padding: 15px; border-radius: 12px; margin-bottom: 15px;">
                    <h4 style="color: var(--accent-gold); margin: 0 0 10px 0;">🌙 Зоны роста</h4>
                    <p style="color: var(--text-secondary); margin: 0;">${zodiac.weaknesses || ''}</p>
                </div>
                
                <div style="background: rgba(201, 165, 75, 0.1); padding: 20px; border-radius: 12px; border-left: 3px solid var(--accent-gold);">
                    <h4 style="color: var(--accent-gold); margin: 0 0 10px 0;">🎯 Жизненная миссия</h4>
                    <p style="color: var(--text-primary); font-style: italic; margin: 0;">${zodiac.lifeMission || ''}</p>
                </div>
            </div>
        `;
    }

    displayFengShui(fengShui) {
        const tabContent = document.getElementById('tabFengshui');
        if (!tabContent) return;

        tabContent.innerHTML = `
            <div class="fengshui-card">
                <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 20px;">
                    <div style="font-size: 3rem;">${this.getElementSymbol(fengShui.element)}</div>
                    <div>
                        <h3 style="margin: 0 0 5px 0; color: var(--accent-gold);">${fengShui.element || 'Элемент'}</h3>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px; background: rgba(18, 18, 26, 0.5); padding: 15px; border-radius: 12px;">
                    <div><strong style="color: var(--accent-gold);">Цвет силы:</strong> <span style="color: var(--text-secondary);">${fengShui.color || '—'}</span></div>
                    <div><strong style="color: var(--accent-gold);">Направление:</strong> <span style="color: var(--text-secondary);">${fengShui.direction || '—'}</span></div>
                    <div><strong style="color: var(--accent-gold);">Время активации:</strong> <span style="color: var(--text-secondary);">${fengShui.season || '—'}</span></div>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <p style="color: var(--text-secondary); line-height: 1.8;">${fengShui.description || ''}</p>
                </div>
                
                <div style="background: rgba(201, 165, 75, 0.05); padding: 20px; border-radius: 12px; margin-bottom: 15px;">
                    <h4 style="color: var(--accent-gold); margin: 0 0 10px 0;">✨ Активация энергии</h4>
                    <p style="color: var(--text-secondary); margin: 0;">${fengShui.activation || ''}</p>
                </div>
                
                <div style="background: linear-gradient(135deg, rgba(201, 165, 75, 0.1), rgba(18, 18, 26, 0.5)); padding: 20px; border-radius: 12px;">
                    <h4 style="color: var(--accent-gold); margin: 0 0 10px 0;">🕯️ Аффирмация</h4>
                    <p style="color: var(--text-primary); font-style: italic; font-size: 1.1rem; margin: 0;">"${fengShui.affirmation || 'Я в гармонии с потоками вселенной'}"</p>
                </div>
            </div>
        `;
    }

    displayTarot(tarot) {
        const tabContent = document.getElementById('tabTarot');
        if (!tabContent) return;

        const cards = [
            {type: 'fate', title: 'Карта Судьбы', data: tarot.fate},
            {type: 'personality', title: 'Карта Личности', data: tarot.personality},
            {type: 'control', title: 'Карта Пути', data: tarot.control}
        ];

        let html = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">';

        cards.forEach(card => {
            html += `
                <div style="background: rgba(18, 18, 26, 0.5); border: 1px solid var(--border-color); border-radius: 16px; overflow: hidden;">
                    <div style="position: relative; padding-top: 150%; background: linear-gradient(135deg, var(--bg-card), var(--bg-dark));">
                        <img src="${card.data?.image || '/images/tarot/back.jpg'}" 
                             alt="${card.data?.name || 'Карта Таро'}"
                             style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain;"
                             onerror="this.src='/images/tarot/back.jpg'">
                        <div style="position: absolute; top: 10px; right: 10px; width: 40px; height: 40px; background: var(--gradient-gold); color: var(--bg-dark); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1.2rem;">
                            ${card.data?.number === 0 ? 22 : card.data?.number || '?'}
                        </div>
                    </div>
                    <div style="padding: 20px;">
                        <h4 style="color: var(--accent-gold); margin: 0 0 5px 0;">${card.title}</h4>
                        <h5 style="color: var(--text-primary); margin: 0 0 10px 0;">${card.data?.name || '—'}</h5>
                        <p style="color: var(--text-muted); font-style: italic; margin-bottom: 10px;">${card.data?.keywords || ''}</p>
                        <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 15px;">${card.data?.description || ''}</p>
                        <div style="background: rgba(201, 165, 75, 0.05); padding: 15px; border-radius: 12px; border-left: 3px solid var(--accent-gold);">
                            <p style="color: var(--accent-gold); margin: 0; font-style: italic;">${card.data?.advice || ''}</p>
                        </div>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        tabContent.innerHTML = html;
    }

    displayPsychology(psychology) {
        const tabContent = document.getElementById('tabPsychology');
        if (!tabContent) return;

        let html = '<div style="display: flex; flex-direction: column; gap: 25px;">';

        if (psychology.modality) {
            html += `
                <div style="background: rgba(18, 18, 26, 0.5); border: 1px solid var(--border-color); border-radius: 16px; padding: 20px;">
                    <h3 style="color: var(--accent-gold); margin: 0 0 15px 0;">🧠 НЛП-ПРОФИЛЬ</h3>
                    <h4 style="color: var(--text-primary); margin: 0 0 10px 0;">${psychology.modality.title || ''}</h4>
                    <p style="color: var(--text-secondary); line-height: 1.8; margin-bottom: 15px;">${psychology.modality.description || ''}</p>
                    <div style="background: rgba(201, 165, 75, 0.05); padding: 15px; border-radius: 12px;">
                        <p><strong style="color: var(--accent-gold);">🎯 Предикаты:</strong> <span style="color: var(--text-secondary);">${psychology.modality.predicates?.join(', ') || ''}</span></p>
                        <p><strong style="color: var(--accent-gold);">🔑 Ключи доступа:</strong> <span style="color: var(--text-secondary);">${psychology.modality.accessKeys || ''}</span></p>
                    </div>
                </div>
            `;
        }

        if (psychology.archetype) {
            html += `
                <div style="background: rgba(18, 18, 26, 0.5); border: 1px solid var(--border-color); border-radius: 16px; padding: 20px;">
                    <h3 style="color: var(--accent-gold); margin: 0 0 15px 0;">🏛️ АРХЕТИП ЛИЧНОСТИ</h3>
                    <h4 style="color: var(--text-primary); margin: 0 0 10px 0;">${psychology.archetype.name || ''}</h4>
                    <p style="color: var(--text-secondary); line-height: 1.8; margin-bottom: 15px;">${psychology.archetype.description || ''}</p>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                        <div style="background: rgba(76, 175, 80, 0.1); padding: 15px; border-radius: 12px;">
                            <strong style="color: #4caf50; display: block; margin-bottom: 5px;">🎁 Дар</strong>
                            <span style="color: var(--text-secondary);">${psychology.archetype.gift || ''}</span>
                        </div>
                        <div style="background: rgba(244, 67, 54, 0.1); padding: 15px; border-radius: 12px;">
                            <strong style="color: #f44336; display: block; margin-bottom: 5px;">⚔️ Вызов</strong>
                            <span style="color: var(--text-secondary);">${psychology.archetype.challenge || ''}</span>
                        </div>
                    </div>
                    <div style="background: linear-gradient(135deg, rgba(201, 165, 75, 0.1), rgba(18, 18, 26, 0.5)); padding: 20px; border-radius: 12px;">
                        <p style="color: var(--accent-gold); font-size: 1.1rem; font-style: italic; margin: 0;">"${psychology.archetype.mantra || ''}"</p>
                    </div>
                </div>
            `;
        }

        if (psychology.attachment) {
            html += `
                <div style="background: rgba(18, 18, 26, 0.5); border: 1px solid var(--border-color); border-radius: 16px; padding: 20px;">
                    <h3 style="color: var(--accent-gold); margin: 0 0 15px 0;">🤝 ТИП ПРИВЯЗАННОСТИ</h3>
                    <h4 style="color: var(--text-primary); margin: 0 0 10px 0;">${psychology.attachment.name || ''}</h4>
                    <p style="color: var(--text-secondary); line-height: 1.8;">${psychology.attachment.description || ''}</p>
                </div>
            `;
        }

        html += '</div>';
        tabContent.innerHTML = html;
    }

    displayPatterns(patterns) {
        const tabContent = document.getElementById('tabPatterns');
        if (!tabContent) return;

        let html = '<div style="padding: 20px;">';

        if (patterns && patterns.length > 0) {
            html += '<div style="display: flex; flex-direction: column; gap: 15px;">';
            patterns.forEach(pattern => {
                html += `<div style="background: rgba(201, 165, 75, 0.05); padding: 15px; border-radius: 12px; border-left: 3px solid var(--accent-gold);">
                    <p style="color: var(--text-secondary); margin: 0; line-height: 1.6;">✦ ${pattern}</p>
                </div>`;
            });
            html += '</div>';
        } else {
            html += '<p style="color: var(--text-secondary); text-align: center;">Паттерны формируются...</p>';
        }

        html += '</div>';
        tabContent.innerHTML = html;
    }

    displayInterpretations(interpretations) {
        if (!interpretations) return;

        document.querySelectorAll('.interpretation-tabs .tab-btn.locked').forEach(btn => {
            btn.classList.remove('locked');
            const lockIcon = btn.querySelector('.lock-icon');
            if (lockIcon) lockIcon.remove();
        });

        document.querySelectorAll('.interpretation-pane.locked-pane').forEach(pane => {
            pane.classList.remove('locked-pane');
            const overlay = pane.querySelector('.lock-overlay');
            if (overlay) overlay.remove();
        });

        if (interpretations.career) this.displayCareerInterpretation(interpretations.career);
        if (interpretations.family) this.displayFamilyInterpretation(interpretations.family);
        if (interpretations.love) this.displayLoveInterpretation(interpretations.love);
        if (interpretations.money) this.displayMoneyInterpretation(interpretations.money);
        if (interpretations.health) this.displayHealthInterpretation(interpretations.health);
        if (interpretations.talent) this.displayTalentInterpretation(interpretations.talent);

        const firstTab = document.querySelector('.interpretation-tabs .tab-btn:not(.locked)');
        if (firstTab) {
            setTimeout(() => {
                firstTab.click();
            }, 100);
        }
    }

    displayCareerInterpretation(career) {
        if (!career) return;

        const pane = document.getElementById('interpretation-career');
        if (!pane) return;

        pane.classList.remove('locked-pane');
        const overlay = pane.querySelector('.lock-overlay');
        if (overlay) overlay.remove();

        this.setElementText('careerNumber', career.careerNumber || '--');
        this.setElementText('careerTitle', career.title || 'Карьерный потенциал');
        this.setElementText('careerDescription', career.description || '');

        const detailedDescElement = document.getElementById('careerDetailedDescription');
        if (detailedDescElement) {
            detailedDescElement.innerHTML = career.detailedDescription || career.description || '';
        }

        const strengthsList = document.getElementById('careerStrengths');
        if (strengthsList) {
            strengthsList.innerHTML = '';
            if (career.strengths && career.strengths.length) {
                career.strengths.forEach(s => {
                    const li = document.createElement('li');
                    li.innerHTML = s;
                    strengthsList.appendChild(li);
                });
            } else {
                strengthsList.innerHTML = '<li>—</li>';
            }
        }

        const weaknessesList = document.getElementById('careerWeaknesses');
        if (weaknessesList) {
            weaknessesList.innerHTML = '';
            if (career.weaknesses && career.weaknesses.length) {
                career.weaknesses.forEach(w => {
                    const li = document.createElement('li');
                    li.innerHTML = w;
                    weaknessesList.appendChild(li);
                });
            } else {
                weaknessesList.innerHTML = '<li>—</li>';
            }
        }

        const suitableList = document.getElementById('careerSuitable');
        if (suitableList) {
            suitableList.innerHTML = '';
            if (career.suitable && career.suitable.length) {
                career.suitable.forEach(p => {
                    const li = document.createElement('li');
                    li.innerHTML = p;
                    suitableList.appendChild(li);
                });
            } else {
                suitableList.innerHTML = '<li>—</li>';
            }
        }

        this.setElementText('careerWorkStyle', career.workStyle || '');
        this.setElementText('careerMoneyApproach', career.moneyApproach || '');
        this.setElementText('careerManagementStyle', career.managementStyle || '');
        this.setElementText('careerIdealEnvironment', career.idealEnvironment || '');

        const successFactorsList = document.getElementById('careerSuccessFactors');
        if (successFactorsList) {
            successFactorsList.innerHTML = '';
            if (career.successFactors && career.successFactors.length) {
                career.successFactors.forEach(f => {
                    const li = document.createElement('li');
                    li.innerHTML = f;
                    successFactorsList.appendChild(li);
                });
            } else {
                successFactorsList.innerHTML = '<li>—</li>';
            }
        }

        const failureFactorsList = document.getElementById('careerFailureFactors');
        if (failureFactorsList) {
            failureFactorsList.innerHTML = '';
            if (career.failureFactors && career.failureFactors.length) {
                career.failureFactors.forEach(f => {
                    const li = document.createElement('li');
                    li.innerHTML = f;
                    failureFactorsList.appendChild(li);
                });
            } else {
                failureFactorsList.innerHTML = '<li>—</li>';
            }
        }

        this.setElementText('careerDevelopmentPath', career.developmentPath || career.advice || '');
        this.setElementText('careerSuccessNum', career.successNumber || '--');
        this.setElementText('careerSuccessDesc', career.successDescription || '');
        this.setElementText('careerRealizationNum', career.realizationNumber || '--');
        this.setElementText('careerRealizationDesc', career.realizationDescription || '');
        this.setElementText('careerAdvice', career.advice || '');
    }

    displayFamilyInterpretation(family) {
        if (!family) return;

        const pane = document.getElementById('interpretation-family');
        if (!pane) return;

        pane.classList.remove('locked-pane');
        const overlay = pane.querySelector('.lock-overlay');
        if (overlay) overlay.remove();

        this.setElementText('familyNumber', family.familyNumber || '--');
        this.setElementText('familyTitle', family.title || 'Семейная гармония');
        this.setElementText('familyDescription', family.description || '');

        const detailedDescElement = document.getElementById('familyDetailedDescription');
        if (detailedDescElement) {
            detailedDescElement.innerHTML = family.detailedDescription || family.description || '';
        }

        this.setElementText('familyRole', family.role || '');

        const strengthsList = document.getElementById('familyStrengths');
        if (strengthsList) {
            strengthsList.innerHTML = '';
            if (family.strengths && family.strengths.length) {
                family.strengths.forEach(s => {
                    const li = document.createElement('li');
                    li.innerHTML = s;
                    strengthsList.appendChild(li);
                });
            } else {
                strengthsList.innerHTML = '<li>—</li>';
            }
        }

        const weaknessesList = document.getElementById('familyWeaknesses');
        if (weaknessesList) {
            weaknessesList.innerHTML = '';
            if (family.weaknesses && family.weaknesses.length) {
                family.weaknesses.forEach(w => {
                    const li = document.createElement('li');
                    li.innerHTML = w;
                    weaknessesList.appendChild(li);
                });
            } else {
                weaknessesList.innerHTML = '<li>—</li>';
            }
        }

        this.setElementText('familyStyle', family.familyStyle || '');
        this.setElementText('familyChildrenApproach', family.childrenApproach || '');
        this.setElementText('familyPartnerType', family.partnerType || '');

        const successFactorsList = document.getElementById('familySuccessFactors');
        if (successFactorsList) {
            successFactorsList.innerHTML = '';
            if (family.successFactors && family.successFactors.length) {
                family.successFactors.forEach(f => {
                    const li = document.createElement('li');
                    li.innerHTML = f;
                    successFactorsList.appendChild(li);
                });
            } else {
                successFactorsList.innerHTML = '<li>—</li>';
            }
        }

        const failureFactorsList = document.getElementById('familyFailureFactors');
        if (failureFactorsList) {
            failureFactorsList.innerHTML = '';
            if (family.failureFactors && family.failureFactors.length) {
                family.failureFactors.forEach(f => {
                    const li = document.createElement('li');
                    li.innerHTML = f;
                    failureFactorsList.appendChild(li);
                });
            } else {
                failureFactorsList.innerHTML = '<li>—</li>';
            }
        }

        this.setElementText('familyDevelopmentPath', family.developmentPath || family.advice || '');
        this.setElementText('familyPartnerNum', family.partnerNumber || '--');
        this.setElementText('familyPartnerDesc', family.partnerDescription || '');
        this.setElementText('familyChildrenNum', family.childrenNumber || '--');
        this.setElementText('familyChildrenDesc', family.childrenDescription || '');
        this.setElementText('familyAdvice', family.advice || '');
    }

    displayLoveInterpretation(love) {
        if (!love) return;

        const pane = document.getElementById('interpretation-love');
        if (!pane) return;

        pane.classList.remove('locked-pane');
        const overlay = pane.querySelector('.lock-overlay');
        if (overlay) overlay.remove();

        this.setElementText('loveNumber', love.loveNumber || '--');
        this.setElementText('loveTitle', love.title || 'Любовная совместимость');
        this.setElementText('loveDescription', love.description || '');

        const detailedDescElement = document.getElementById('loveDetailedDescription');
        if (detailedDescElement) {
            detailedDescElement.innerHTML = love.detailedDescription || love.description || '';
        }

        this.setElementText('loveStyle', love.loveStyle || '');

        const strengthsList = document.getElementById('loveStrengths');
        if (strengthsList) {
            strengthsList.innerHTML = '';
            if (love.strengths && love.strengths.length) {
                love.strengths.forEach(s => {
                    const li = document.createElement('li');
                    li.innerHTML = s;
                    strengthsList.appendChild(li);
                });
            } else {
                strengthsList.innerHTML = '<li>—</li>';
            }
        }

        const weaknessesList = document.getElementById('loveWeaknesses');
        if (weaknessesList) {
            weaknessesList.innerHTML = '';
            if (love.weaknesses && love.weaknesses.length) {
                love.weaknesses.forEach(w => {
                    const li = document.createElement('li');
                    li.innerHTML = w;
                    weaknessesList.appendChild(li);
                });
            } else {
                weaknessesList.innerHTML = '<li>—</li>';
            }
        }

        this.setElementText('idealPartner', love.idealPartner || '');
        this.setElementText('lovePartnerType', love.partnerType || '');
        this.setElementText('loveRelationshipPattern', love.relationshipPattern || '');

        const successFactorsList = document.getElementById('loveSuccessFactors');
        if (successFactorsList) {
            successFactorsList.innerHTML = '';
            if (love.successFactors && love.successFactors.length) {
                love.successFactors.forEach(f => {
                    const li = document.createElement('li');
                    li.innerHTML = f;
                    successFactorsList.appendChild(li);
                });
            } else {
                successFactorsList.innerHTML = '<li>—</li>';
            }
        }

        const failureFactorsList = document.getElementById('loveFailureFactors');
        if (failureFactorsList) {
            failureFactorsList.innerHTML = '';
            if (love.failureFactors && love.failureFactors.length) {
                love.failureFactors.forEach(f => {
                    const li = document.createElement('li');
                    li.innerHTML = f;
                    failureFactorsList.appendChild(li);
                });
            } else {
                failureFactorsList.innerHTML = '<li>—</li>';
            }
        }

        this.setElementText('loveDevelopmentPath', love.developmentPath || love.advice || '');

        if (love.compatibility !== undefined) {
            this.setElementText('loveCompatibilityPercent', (love.compatibility || 0) + '%');

            const progressBar = document.getElementById('loveCompatibilityProgress');
            if (progressBar) {
                progressBar.style.width = (love.compatibility || 0) + '%';
            }

            this.setElementText('loveCompatibilityLevel', love.compatibilityLevel || `Совместимость: ${love.compatibility || 0}%`);
        }

        this.setElementText('loveAdvice', love.advice || '');
    }

    displayMoneyInterpretation(money) {
        if (!money) return;

        const pane = document.getElementById('interpretation-money');
        if (!pane) return;

        pane.classList.remove('locked-pane');
        const overlay = pane.querySelector('.lock-overlay');
        if (overlay) overlay.remove();

        this.setElementText('moneyNumber', money.moneyNumber || '--');
        this.setElementText('moneyTitle', money.title || 'Финансовый поток');
        this.setElementText('moneyDescription', money.description || '');

        const detailedDescElement = document.getElementById('moneyDetailedDescription');
        if (detailedDescElement) {
            detailedDescElement.innerHTML = money.detailedDescription || money.description || '';
        }

        this.setElementText('moneyStyle', money.moneyStyle || '');

        const strengthsList = document.getElementById('moneyStrengths');
        if (strengthsList) {
            strengthsList.innerHTML = '';
            if (money.strengths && money.strengths.length) {
                money.strengths.forEach(s => {
                    const li = document.createElement('li');
                    li.innerHTML = s;
                    strengthsList.appendChild(li);
                });
            } else {
                strengthsList.innerHTML = '<li>—</li>';
            }
        }

        const weaknessesList = document.getElementById('moneyWeaknesses');
        if (weaknessesList) {
            weaknessesList.innerHTML = '';
            if (money.weaknesses && money.weaknesses.length) {
                money.weaknesses.forEach(w => {
                    const li = document.createElement('li');
                    li.innerHTML = w;
                    weaknessesList.appendChild(li);
                });
            } else {
                weaknessesList.innerHTML = '<li>—</li>';
            }
        }

        const sourcesList = document.getElementById('moneySources');
        if (sourcesList) {
            sourcesList.innerHTML = '';
            if (money.sources && money.sources.length) {
                money.sources.forEach(s => {
                    const li = document.createElement('li');
                    li.innerHTML = s;
                    sourcesList.appendChild(li);
                });
            } else {
                sourcesList.innerHTML = '<li>—</li>';
            }
        }

        this.setElementText('moneyStrategy', money.moneyStrategy || '');
        this.setElementText('moneyRiskAttitude', money.riskAttitude || '');

        const investmentsList = document.getElementById('moneyInvestments');
        if (investmentsList) {
            investmentsList.innerHTML = '';
            if (money.bestInvestments && money.bestInvestments.length) {
                money.bestInvestments.forEach(i => {
                    const li = document.createElement('li');
                    li.innerHTML = i;
                    investmentsList.appendChild(li);
                });
            } else {
                investmentsList.innerHTML = '<li>—</li>';
            }
        }

        const successFactorsList = document.getElementById('moneySuccessFactors');
        if (successFactorsList) {
            successFactorsList.innerHTML = '';
            if (money.successFactors && money.successFactors.length) {
                money.successFactors.forEach(f => {
                    const li = document.createElement('li');
                    li.innerHTML = f;
                    successFactorsList.appendChild(li);
                });
            } else {
                successFactorsList.innerHTML = '<li>—</li>';
            }
        }

        const failureFactorsList = document.getElementById('moneyFailureFactors');
        if (failureFactorsList) {
            failureFactorsList.innerHTML = '';
            if (money.failureFactors && money.failureFactors.length) {
                money.failureFactors.forEach(f => {
                    const li = document.createElement('li');
                    li.innerHTML = f;
                    failureFactorsList.appendChild(li);
                });
            } else {
                failureFactorsList.innerHTML = '<li>—</li>';
            }
        }

        this.setElementText('moneyDevelopmentPath', money.developmentPath || money.advice || '');
        this.setElementText('moneyAbundanceNum', money.abundanceNumber || '--');
        this.setElementText('moneyAbundanceDesc', money.abundanceDescription || '');
        this.setElementText('moneyAdvice', money.advice || '');
    }

    displayHealthInterpretation(health) {
        if (!health) return;

        const pane = document.getElementById('interpretation-health');
        if (!pane) return;

        pane.classList.remove('locked-pane');
        const overlay = pane.querySelector('.lock-overlay');
        if (overlay) overlay.remove();

        this.setElementText('healthNumber', health.healthNumber || '--');
        this.setElementText('healthTitle', health.title || 'Энергия здоровья');
        this.setElementText('healthDescription', health.description || '');

        const detailedDescElement = document.getElementById('healthDetailedDescription');
        if (detailedDescElement) {
            detailedDescElement.innerHTML = health.detailedDescription || health.description || '';
        }

        if (health.energyLevel !== undefined) {
            const energyProgress = document.getElementById('healthEnergyProgress');
            if (energyProgress) {
                const percent = ((health.energyLevel || 0) / 10) * 100;
                energyProgress.style.width = percent + '%';
            }
            this.setElementText('healthEnergyLevel', `Уровень энергии: ${health.energyLevel || 0}/10`);
        }

        this.setElementText('healthEnergyType', health.energyType || '');

        const strengthsList = document.getElementById('healthStrengths');
        if (strengthsList) {
            strengthsList.innerHTML = '';
            if (health.strengths && health.strengths.length) {
                health.strengths.forEach(s => {
                    const li = document.createElement('li');
                    li.innerHTML = s;
                    strengthsList.appendChild(li);
                });
            } else {
                strengthsList.innerHTML = '<li>—</li>';
            }
        }

        const weaknessesList = document.getElementById('healthWeaknesses');
        if (weaknessesList) {
            weaknessesList.innerHTML = '';
            if (health.weaknesses && health.weaknesses.length) {
                health.weaknesses.forEach(w => {
                    const li = document.createElement('li');
                    li.innerHTML = w;
                    weaknessesList.appendChild(li);
                });
            } else {
                weaknessesList.innerHTML = '<li>—</li>';
            }
        }

        const vulnerableList = document.getElementById('healthVulnerable');
        if (vulnerableList) {
            vulnerableList.innerHTML = '';
            if (health.vulnerable && health.vulnerable.length) {
                health.vulnerable.forEach(v => {
                    const li = document.createElement('li');
                    li.innerHTML = v;
                    vulnerableList.appendChild(li);
                });
            } else {
                vulnerableList.innerHTML = '<li>—</li>';
            }
        }

        const recommendationsList = document.getElementById('healthRecommendations');
        if (recommendationsList) {
            recommendationsList.innerHTML = '';
            if (health.recommendations && health.recommendations.length) {
                health.recommendations.forEach(r => {
                    const li = document.createElement('li');
                    li.innerHTML = r;
                    recommendationsList.appendChild(li);
                });
            } else {
                recommendationsList.innerHTML = '<li>—</li>';
            }
        }

        this.setElementText('healthSeasonalRisks', health.seasonalRisks || '');

        const preventionList = document.getElementById('healthPrevention');
        if (preventionList) {
            preventionList.innerHTML = '';
            if (health.prevention && health.prevention.length) {
                health.prevention.forEach(p => {
                    const li = document.createElement('li');
                    li.innerHTML = p;
                    preventionList.appendChild(li);
                });
            } else {
                preventionList.innerHTML = '<li>—</li>';
            }
        }

        this.setElementText('healthDevelopmentPath', health.developmentPath || health.advice || '');
        this.setElementText('healthAdvice', health.advice || '');
    }

    displayTalentInterpretation(talent) {
        if (!talent) return;

        const pane = document.getElementById('interpretation-talent');
        if (!pane) return;

        pane.classList.remove('locked-pane');
        const overlay = pane.querySelector('.lock-overlay');
        if (overlay) overlay.remove();

        this.setElementText('talentNumber', talent.talentNumber || '--');
        this.setElementText('talentTitle', talent.title || 'Скрытые таланты');
        this.setElementText('talentDescription', talent.description || '');

        const detailedDescElement = document.getElementById('talentDetailedDescription');
        if (detailedDescElement) {
            detailedDescElement.innerHTML = talent.detailedDescription || talent.description || '';
        }

        const talentList = document.getElementById('talentList');
        if (talentList) {
            talentList.innerHTML = '';
            if (talent.talents && talent.talents.length) {
                talent.talents.forEach(t => {
                    const li = document.createElement('li');
                    li.innerHTML = t;
                    talentList.appendChild(li);
                });
            } else {
                talentList.innerHTML = '<li>—</li>';
            }
        }

        const howToDevelopList = document.getElementById('talentHowToDevelop');
        if (howToDevelopList) {
            howToDevelopList.innerHTML = '';
            if (talent.howToDevelop && talent.howToDevelop.length) {
                talent.howToDevelop.forEach(h => {
                    const li = document.createElement('li');
                    li.innerHTML = h;
                    howToDevelopList.appendChild(li);
                });
            } else {
                howToDevelopList.innerHTML = '<li>—</li>';
            }
        }

        const suitableList = document.getElementById('talentSuitable');
        if (suitableList) {
            suitableList.innerHTML = '';
            if (talent.suitable && talent.suitable.length) {
                talent.suitable.forEach(s => {
                    const li = document.createElement('li');
                    li.innerHTML = s;
                    suitableList.appendChild(li);
                });
            } else {
                suitableList.innerHTML = '<li>—</li>';
            }
        }

        this.setElementText('talentCombinations', talent.combinations || '');
        this.setElementText('talentEnvironment', talent.environment || '');

        const successFactorsList = document.getElementById('talentSuccessFactors');
        if (successFactorsList) {
            successFactorsList.innerHTML = '';
            if (talent.successFactors && talent.successFactors.length) {
                talent.successFactors.forEach(f => {
                    const li = document.createElement('li');
                    li.innerHTML = f;
                    successFactorsList.appendChild(li);
                });
            } else {
                successFactorsList.innerHTML = '<li>—</li>';
            }
        }

        const failureFactorsList = document.getElementById('talentFailureFactors');
        if (failureFactorsList) {
            failureFactorsList.innerHTML = '';
            if (talent.failureFactors && talent.failureFactors.length) {
                talent.failureFactors.forEach(f => {
                    const li = document.createElement('li');
                    li.innerHTML = f;
                    failureFactorsList.appendChild(li);
                });
            } else {
                failureFactorsList.innerHTML = '<li>—</li>';
            }
        }

        this.setElementText('talentDevelopmentPath', talent.developmentPath || talent.advice || '');

        if (talent.potential !== undefined) {
            this.setElementText('talentPotentialPercent', (talent.potential || 0) + '%');

            const progressBar = document.getElementById('talentPotentialProgress');
            if (progressBar) {
                progressBar.style.width = (talent.potential || 0) + '%';
            }

            this.setElementText('talentPotentialDescription', talent.potentialDescription || `Потенциал: ${talent.potential || 0}%`);
        }

        this.setElementText('talentAdvice', talent.advice || '');
    }

    setElementText(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value !== undefined && value !== null ? value : '—';
        }
    }

    validateForm(fullName, birthDate) {
        if (!fullName || !birthDate) {
            this.showNotification('Пожалуйста, заполните все поля', 'error');
            return false;
        }

        const nameParts = fullName.trim().split(/\s+/);
        if (nameParts.length < 3) {
            this.showNotification('Введите полное ФИО (фамилия, имя, отчество)', 'error');
            return false;
        }

        if (!this.isValidDate(birthDate)) {
            this.showNotification('Введите дату в формате ДД.ММ.ГГГГ', 'error');
            return false;
        }

        return true;
    }

    isValidDate(dateStr) {
        if (!dateStr) return false;
        const pattern = /^\d{2}\.\d{2}\.\d{4}$/;
        if (!pattern.test(dateStr)) return false;

        const [day, month, year] = dateStr.split('.').map(Number);
        if (month < 1 || month > 12) return false;
        if (day < 1 || day > 31) return false;

        const daysInMonth = new Date(year, month, 0).getDate();
        return day <= daysInMonth;
    }

    formatDateForServer(dateStr) {
        if (!dateStr) return '';
        const [day, month, year] = dateStr.split('.');
        return `${year}-${month}-${day}`;
    }

    getDirections(number) {
        const directions = {
            1: ['Север', 'Восток'],
            2: ['Юго-Запад', 'Запад'],
            3: ['Восток', 'Юго-Восток'],
            4: ['Север', 'Северо-Восток'],
            5: ['Запад', 'Северо-Запад'],
            6: ['Юг', 'Юго-Запад'],
            7: ['Северо-Восток', 'Восток'],
            8: ['Юго-Запад', 'Запад'],
            9: ['Юг', 'Юго-Восток'],
            11: ['Север', 'Восток'],
            22: ['Центр', 'Все направления']
        };
        return directions[number] || ['Восток', 'Север'];
    }

    getZodiacSymbol(signName) {
        const symbols = {
            'Овен': '♈',
            'Телец': '♉',
            'Близнецы': '♊',
            'Рак': '♋',
            'Лев': '♌',
            'Дева': '♍',
            'Весы': '♎',
            'Скорпион': '♏',
            'Стрелец': '♐',
            'Козерог': '♑',
            'Водолей': '♒',
            'Рыбы': '♓'
        };
        return symbols[signName] || '⛤';
    }

    getElementSymbol(element) {
        const elementLower = String(element || '').toLowerCase();
        const symbols = {
            'металл': '⚜️',
            'metal': '⚜️',
            'вода': '🌊',
            'water': '🌊',
            'дерево': '🌳',
            'wood': '🌳',
            'огонь': '🔥',
            'fire': '🔥',
            'земля': '⛰️',
            'earth': '⛰️'
        };
        return symbols[elementLower] || '✨';
    }

    getChineseZodiacSymbol(animal) {
        const symbols = {
            'Крыса': '🐭',
            'Бык': '🐮',
            'Тигр': '🐯',
            'Кролик': '🐰',
            'Дракон': '🐉',
            'Змея': '🐍',
            'Лошадь': '🐴',
            'Коза': '🐐',
            'Обезьяна': '🐵',
            'Петух': '🐔',
            'Собака': '🐶',
            'Свинья': '🐷'
        };
        return symbols[animal] || '🐉';
    }

    getColorCode(colorName) {
        const colorMap = {
            'Красный': '#ff4444',
            'Золотой': '#ffd700',
            'Оранжевый': '#ffa500',
            'Голубой': '#00bfff',
            'Серебряный': '#c0c0c0',
            'Белый': '#ffffff',
            'Желтый': '#ffff00',
            'Зеленый': '#4caf50',
            'Бирюзовый': '#40e0d0',
            'Фиолетовый': '#9c27b0',
            'Синий': '#2196f3',
            'Розовый': '#ff69b4',
            'Коричневый': '#8b4513',
            'Бежевый': '#f5f5dc',
            'Пурпурный': '#800080',
            'Лавандовый': '#e6e6fa',
            'Жемчужный': '#fdeef4',
            'Индиго': '#4b0082'
        };
        return colorMap[colorName] || '#c9a54b';
    }

    showLoading(show) {
        if (this.loadingSpinner) {
            this.loadingSpinner.style.display = show ? 'flex' : 'none';
        }
        if (this.form) {
            this.form.style.opacity = show ? '0.5' : '1';
            this.form.style.pointerEvents = show ? 'none' : 'auto';
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    showPaymentModal(errorData) {
        const modal = document.createElement('div');
        modal.className = 'payment-modal';

        modal.innerHTML = `
            <div class="modal-content">
                <i class="fas fa-coins modal-icon"></i>
                <h3>Недостаточно средств</h3>
                <p class="balance-info">
                    Баланс: <strong>${errorData.balance || 0} ₽</strong><br>
                    Требуется: <strong>${errorData.required || errorData.price || 0} ₽</strong>
                </p>
                <div class="modal-actions">
                    <a href="/cabinet/balance" class="btn btn-primary">Пополнить баланс</a>
                    <button class="btn btn-outline" onclick="this.closest('.payment-modal').remove()">Закрыть</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    resetForm() {
        if (this.resultSection) this.resultSection.style.display = 'none';
        if (this.tariffSection) this.tariffSection.style.display = 'block';
        if (this.inputSection) this.inputSection.style.display = 'none';
        this.selectedTariff = null;

        if (this.form) this.form.reset();
        if (this.compatibilityFields) this.compatibilityFields.style.display = 'none';
        if (this.targetDateField) this.targetDateField.style.display = 'none';

        this.renderTariffs();
    }

    upgradeToFull() {
        this.selectTariff('forecast_full');
        document.getElementById('upgradeCalculationBtn').style.display = 'none';
    }

    async downloadPDFReport() {
        try {
            if (!window.currentNumerologyData || !window.currentCalculationId) {
                this.showNotification('Сначала выполните расчет', 'error');
                return;
            }

            this.showNotification('Генерируем PDF отчет...', 'info');

            const response = await fetch(`/api/numerology/pdf/${window.currentCalculationId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error(`Ошибка ${response.status}`);
            }

            const blob = await response.blob();

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `numerology-report-${window.currentCalculationId}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            this.showNotification('PDF отчет готов!', 'success');

        } catch (error) {
            console.error('❌ Ошибка скачивания PDF:', error);
            this.showNotification('Ошибка при создании PDF', 'error');
        }
    }

    initWeekPicker() {
        const targetDateInput = document.getElementById('targetDate');
        if (!targetDateInput) return;

        const weekPickerContainer = document.createElement('div');
        weekPickerContainer.className = 'week-picker-container';
        weekPickerContainer.id = 'weekPickerContainer';
        weekPickerContainer.style.display = 'none';

        weekPickerContainer.innerHTML = `
            <div class="week-picker-header">
                <button type="button" class="week-nav-btn" id="prevWeekBtn"><i class="fas fa-chevron-left"></i></button>
                <span id="weekDisplay">Текущая неделя</span>
                <button type="button" class="week-nav-btn" id="nextWeekBtn"><i class="fas fa-chevron-right"></i></button>
            </div>
            <div class="week-days-grid" id="weekDaysGrid"></div>
            <input type="hidden" id="selectedWeekStart" value="">
            <input type="hidden" id="selectedWeekEnd" value="">
        `;

        targetDateInput.parentNode.insertBefore(weekPickerContainer, targetDateInput.nextSibling);

        document.getElementById('prevWeekBtn')?.addEventListener('click', () => this.changeWeek(-1));
        document.getElementById('nextWeekBtn')?.addEventListener('click', () => this.changeWeek(1));

        targetDateInput.style.display = 'none';
    }

    changeWeek(delta) {
        const currentStartStr = document.getElementById('selectedWeekStart')?.value;
        if (!currentStartStr) return;

        const currentStart = new Date(currentStartStr);
        currentStart.setDate(currentStart.getDate() + (delta * 7));

        this.updateWeekDisplay(currentStart);
    }

    updateWeekDisplay(startDate) {
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);

        const weekDisplay = document.getElementById('weekDisplay');
        const weekStartInput = document.getElementById('selectedWeekStart');
        const weekEndInput = document.getElementById('selectedWeekEnd');
        const targetDateInput = document.getElementById('targetDate');

        if (!weekDisplay || !weekStartInput || !weekEndInput || !targetDateInput) return;

        const formatDate = (date) => {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}.${month}.${year}`;
        };

        const formatDateForServer = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const startStr = formatDate(startDate);
        const endStr = formatDate(endDate);

        weekDisplay.textContent = `${startStr} — ${endStr}`;
        weekStartInput.value = formatDateForServer(startDate);
        weekEndInput.value = formatDateForServer(endDate);
        targetDateInput.value = formatDateForServer(startDate);

        this.updateWeekDaysGrid(startDate);
    }

    updateWeekDaysGrid(startDate) {
        const grid = document.getElementById('weekDaysGrid');
        if (!grid) return;

        const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let html = '';

        for (let i = 0; i < 7; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);

            const dayNumber = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const dateStr = `${dayNumber}.${month}`;

            const isToday = date.getTime() === today.getTime();
            const isPast = date < today;
            const isFuture = date > today;

            html += `
                <div class="week-day ${isToday ? 'today' : ''} ${isPast ? 'past' : ''} ${isFuture ? 'future' : ''}">
                    <span class="day-name">${days[i]}</span>
                    <span class="day-date">${dateStr}</span>
                </div>
            `;
        }

        grid.innerHTML = html;
    }

    initMonthPicker() {
        const targetDateInput = document.getElementById('targetDate');
        if (!targetDateInput) return;

        const monthPickerContainer = document.createElement('div');
        monthPickerContainer.className = 'month-picker-container';
        monthPickerContainer.id = 'monthPickerContainer';
        monthPickerContainer.style.display = 'none';

        monthPickerContainer.innerHTML = `
            <div class="month-picker-header">
                <button type="button" class="month-nav-btn" id="prevMonthBtn"><i class="fas fa-chevron-left"></i></button>
                <span id="monthDisplay">Март 2026</span>
                <button type="button" class="month-nav-btn" id="nextMonthBtn"><i class="fas fa-chevron-right"></i></button>
            </div>
            <div class="month-calendar" id="monthCalendar"></div>
            <input type="hidden" id="selectedMonth" value="">
            <input type="hidden" id="selectedYear" value="">
        `;

        targetDateInput.parentNode.insertBefore(monthPickerContainer, targetDateInput.nextSibling);

        document.getElementById('prevMonthBtn')?.addEventListener('click', () => this.changeMonth(-1));
        document.getElementById('nextMonthBtn')?.addEventListener('click', () => this.changeMonth(1));

        targetDateInput.style.display = 'none';
    }

    changeMonth(delta) {
        const currentMonthStr = document.getElementById('selectedMonth')?.value;
        const currentYearStr = document.getElementById('selectedYear')?.value;

        let date;

        if (currentMonthStr && currentYearStr) {
            const currentMonth = parseInt(currentMonthStr);
            const currentYear = parseInt(currentYearStr);

            let newMonth = currentMonth + delta;
            let newYear = currentYear;

            if (newMonth > 12) {
                newMonth = 1;
                newYear++;
            } else if (newMonth < 1) {
                newMonth = 12;
                newYear--;
            }

            date = new Date(newYear, newMonth - 1, 1);
        } else {
            date = new Date();
        }

        this.updateMonthDisplay(date);
    }

    updateMonthDisplay(date) {
        const monthDisplay = document.getElementById('monthDisplay');
        const monthInput = document.getElementById('selectedMonth');
        const yearInput = document.getElementById('selectedYear');
        const monthCalendar = document.getElementById('monthCalendar');
        const targetDateInput = document.getElementById('targetDate');

        if (!monthDisplay || !monthInput || !yearInput || !monthCalendar || !targetDateInput) return;

        if (!(date instanceof Date)) {
            date = new Date();
        }

        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

        monthDisplay.textContent = `${monthNames[month - 1]} ${year}`;
        monthInput.value = month;
        yearInput.value = year;

        const formattedMonth = String(month).padStart(2, '0');
        targetDateInput.value = `${year}-${formattedMonth}-01`;

        this.generateMonthCalendar(month, year);
    }

    generateMonthCalendar(month, year) {
        const calendar = document.getElementById('monthCalendar');
        if (!calendar) return;

        const firstDay = new Date(year, month - 1, 1).getDay();
        const daysInMonth = new Date(year, month, 0).getDate();

        const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        const today = new Date();
        const isCurrentMonth = today.getMonth() + 1 === month && today.getFullYear() === year;
        const currentDay = today.getDate();

        let html = `
            <div class="calendar-weekdays">
                ${daysOfWeek.map(day => `<div class="weekday">${day}</div>`).join('')}
            </div>
            <div class="calendar-days">
        `;

        const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
        for (let i = 0; i < adjustedFirstDay; i++) {
            html += `<div class="calendar-day empty"></div>`;
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = isCurrentMonth && day === currentDay;
            const dateStr = `${String(day).padStart(2, '0')}.${String(month).padStart(2, '0')}.${year}`;

            html += `
                <div class="calendar-day ${isToday ? 'today' : ''}" data-date="${dateStr}">
                    <span class="day-number">${day}</span>
                </div>
            `;
        }

        html += '</div>';
        calendar.innerHTML = html;

        calendar.querySelectorAll('.calendar-day:not(.empty)').forEach(dayEl => {
            dayEl.addEventListener('click', () => {
                const date = dayEl.dataset.date;
                console.log('Выбрана дата:', date);
            });
        });
    }

    initYearPicker() {
        const targetDateInput = document.getElementById('targetDate');
        if (!targetDateInput) return;

        const yearPickerContainer = document.createElement('div');
        yearPickerContainer.className = 'year-picker-container';
        yearPickerContainer.id = 'yearPickerContainer';
        yearPickerContainer.style.display = 'none';

        const currentYear = new Date().getFullYear();

        yearPickerContainer.innerHTML = `
            <div class="year-picker-header">
                <button type="button" class="year-nav-btn" id="prevYearBtn"><i class="fas fa-chevron-left"></i></button>
                <span id="yearDisplay">${currentYear}</span>
                <button type="button" class="year-nav-btn" id="nextYearBtn"><i class="fas fa-chevron-right"></i></button>
            </div>
            <div class="year-grid" id="yearGrid"></div>
            <input type="hidden" id="selectedYear" value="${currentYear}">
        `;

        targetDateInput.parentNode.insertBefore(yearPickerContainer, targetDateInput.nextSibling);

        document.getElementById('prevYearBtn')?.addEventListener('click', () => this.changeYear(-1));
        document.getElementById('nextYearBtn')?.addEventListener('click', () => this.changeYear(1));

        this.generateYearGrid(currentYear);

        targetDateInput.style.display = 'none';
    }

    changeYear(delta) {
        const yearDisplay = document.getElementById('yearDisplay');
        const yearInput = document.getElementById('selectedYear');
        const targetDateInput = document.getElementById('targetDate');

        if (!yearDisplay || !yearInput || !targetDateInput) return;

        let currentYear = parseInt(yearDisplay.textContent);
        let newYear = currentYear + delta;

        if (newYear < 1900 || newYear > 2100) return;

        yearDisplay.textContent = newYear;
        yearInput.value = newYear;
        targetDateInput.value = `${newYear}-01-01`;

        this.generateYearGrid(newYear);
    }

    updateYearDisplay(year) {
        const yearDisplay = document.getElementById('yearDisplay');
        const yearInput = document.getElementById('selectedYear');
        const targetDateInput = document.getElementById('targetDate');
        const yearGrid = document.getElementById('yearGrid');

        if (!yearDisplay || !yearInput || !targetDateInput || !yearGrid) return;

        year = parseInt(year) || new Date().getFullYear();

        yearDisplay.textContent = year;
        yearInput.value = year;
        targetDateInput.value = `${year}-01-01`;

        this.generateYearGrid(year);
    }

    generateYearGrid(selectedYear) {
        const yearGrid = document.getElementById('yearGrid');
        if (!yearGrid) return;

        const startYear = selectedYear - 4;
        const endYear = selectedYear + 4;

        let html = '<div class="year-grid-row">';

        for (let year = startYear; year <= endYear; year++) {
            const isSelected = year === selectedYear;
            const isCurrentYear = year === new Date().getFullYear();

            html += `
                <div class="year-grid-item ${isSelected ? 'selected' : ''} ${isCurrentYear ? 'current' : ''}" 
                     data-year="${year}">
                    ${year}
                </div>
            `;

            if ((year - startYear + 1) % 3 === 0 && year < endYear) {
                html += '</div><div class="year-grid-row">';
            }
        }

        html += '</div>';

        yearGrid.innerHTML = html;

        yearGrid.querySelectorAll('.year-grid-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const year = parseInt(e.currentTarget.dataset.year);
                this.updateYearDisplay(year);
            });
        });
    }
}

// Инициализация
const numerologyApp = new NumerologyApp();
window.numerologyApp = numerologyApp;