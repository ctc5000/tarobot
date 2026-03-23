// modules/Numerology/web/js/numerology.js

class NumerologyApp {
    constructor() {
        this.user = null;
        this.activeSubscription = null;
        this.tariffs = [];
        this.selectedTariff = null;
        this.currentCalculation = null;

        // Ждем полной загрузки DOM и зависимостей
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    async init() {
        console.log('🔮 NumerologyApp инициализация...');

        // Проверяем наличие всех необходимых зависимостей
        if (!this.checkDependencies()) {
            console.error('❌ Не все зависимости загружены, повторная попытка через 500ms');
            setTimeout(() => this.init(), 500);
            return;
        }

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

        await this.loadData();
        this.initDatePickers();
        this.updateUI();
        this.addEventListeners();

        if (this.user?.fullName) {
            const fullNameInput = document.getElementById('fullName');
            if (fullNameInput) fullNameInput.value = this.user.fullName;
        }
    }

    checkDependencies() {
        const required = ['ApiService', 'ValidationService', 'DateService', 'UIHelpers', 'TariffRenderer', 'DatePickers', 'ForecastRenderer'];
        const missing = [];

        for (const dep of required) {
            if (!window[dep]) {
                missing.push(dep);
            }
        }

        if (missing.length > 0) {
            console.warn('⚠️ Отсутствуют зависимости:', missing);
            return false;
        }

        console.log('✅ Все зависимости загружены');
        return true;
    }

    async loadData() {
        await this.loadUser();
        await this.loadTariffs();
        await this.loadSubscription();
    }

    async loadUser() {
        try {
            if (window.ApiService && typeof window.ApiService.fetchProfile === 'function') {
                this.user = await window.ApiService.fetchProfile();
                console.log('👤 Пользователь загружен:', this.user);
            } else {
                console.warn('ApiService не доступен');
                this.user = null;
            }
        } catch (error) {
            console.error('Ошибка загрузки пользователя:', error);
            this.user = null;
        }
    }

    async loadTariffs() {
        try {
            if (window.ApiService && typeof window.ApiService.fetchTariffs === 'function') {
                this.tariffs = await window.ApiService.fetchTariffs();
                console.log('📦 Загружено тарифов:', this.tariffs.length);
                this.renderTariffs();
            } else {
                console.warn('ApiService не доступен');
                if (this.tariffGrid) {
                    this.tariffGrid.innerHTML = '<p class="error-message">Ошибка загрузки тарифов</p>';
                }
            }
        } catch (error) {
            console.error('Ошибка загрузки тарифов:', error);
            if (this.tariffGrid) {
                this.tariffGrid.innerHTML = '<p class="error-message">Ошибка загрузки тарифов</p>';
            }
        }
    }

    async loadSubscription() {
        try {
            if (window.ApiService && typeof window.ApiService.fetchActiveSubscription === 'function') {
                this.activeSubscription = await window.ApiService.fetchActiveSubscription();
                if (this.activeSubscription) {
                    console.log('✅ Активная подписка:', this.activeSubscription);
                    this.renderSubscriptionInfo();
                    this.renderTariffs(); // перерисовываем тарифы с учетом подписки
                }
            } else {
                console.warn('ApiService не доступен');
            }
        } catch (error) {
            console.error('Ошибка проверки подписки:', error);
        }
    }

    renderTariffs() {
        if (!this.tariffGrid) return;
        if (window.TariffRenderer && typeof window.TariffRenderer.renderTariffs === 'function') {
            const html = window.TariffRenderer.renderTariffs(
                this.tariffs, this.user, this.activeSubscription, this.selectedTariff
            );
            this.tariffGrid.innerHTML = html;
        } else {
            console.warn('TariffRenderer не доступен');
            this.tariffGrid.innerHTML = '<p class="error-message">Ошибка рендеринга тарифов</p>';
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
                <span class="benefit-tag discount"><i class="fas fa-tag"></i> Скидка 50% на годовой прогноз</span>
                <span class="benefit-tag discount"><i class="fas fa-tag"></i> Скидка 50% на полный отчет</span>
                <span class="benefit-tag discount"><i class="fas fa-tag"></i> Скидка 50% на совместимость</span>
            </div>
        `;
    }

    initDatePickers() {
        if (!window.DatePickers) {
            console.warn('DatePickers не доступен');
            return;
        }

        const targetDateInput = document.getElementById('targetDate');
        if (!targetDateInput) return;

        const weekContainer = document.createElement('div');
        weekContainer.id = 'weekPickerContainer';
        weekContainer.style.display = 'none';
        targetDateInput.parentNode.insertBefore(weekContainer, targetDateInput.nextSibling);

        const monthContainer = document.createElement('div');
        monthContainer.id = 'monthPickerContainer';
        monthContainer.style.display = 'none';
        targetDateInput.parentNode.insertBefore(monthContainer, targetDateInput.nextSibling);

        const yearContainer = document.createElement('div');
        yearContainer.id = 'yearPickerContainer';
        yearContainer.style.display = 'none';
        targetDateInput.parentNode.insertBefore(yearContainer, targetDateInput.nextSibling);

        if (window.DatePickers.initWeekPicker) {
            window.DatePickers.initWeekPicker('weekPickerContainer', (date) => {
                const targetInput = document.getElementById('targetDate');
                if (targetInput) targetInput.value = date;
            });
        }

        if (window.DatePickers.initMonthPicker) {
            window.DatePickers.initMonthPicker('monthPickerContainer', (date) => {
                const targetInput = document.getElementById('targetDate');
                if (targetInput) targetInput.value = date;
            });
        }

        if (window.DatePickers.initYearPicker) {
            window.DatePickers.initYearPicker('yearPickerContainer', (date) => {
                const targetInput = document.getElementById('targetDate');
                if (targetInput) targetInput.value = date;
            });
        }
    }

    updateUI() {
        if (this.user) {
            if (this.guestBlock) this.guestBlock.style.display = 'none';
            if (this.tariffSection) this.tariffSection.style.display = 'block';
        } else {
            if (this.guestBlock) this.guestBlock.style.display = 'block';
            if (this.tariffSection) this.tariffSection.style.display = 'block';
        }
    }

    addEventListeners() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        const newBtn = document.getElementById('newCalculationBtn');
        if (newBtn) newBtn.addEventListener('click', () => this.resetForm());

        const upgradeBtn = document.getElementById('upgradeCalculationBtn');
        if (upgradeBtn) upgradeBtn.addEventListener('click', () => this.upgradeToFull());

        const downloadBtn = document.getElementById('downloadPdfBtn');
        if (downloadBtn) downloadBtn.addEventListener('click', () => this.downloadPDFReport());

        this.setupTabListeners();
    }

    setupTabListeners() {
        // Основные табы
        document.querySelectorAll('.tab-btn[data-tab]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (btn.classList.contains('locked')) {
                    e.preventDefault();
                    if (window.UIHelpers) {
                        window.UIHelpers.showNotification('🔒 Этот раздел доступен только в полном расчете', 'info');
                    }
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
                    if (window.UIHelpers) {
                        window.UIHelpers.showNotification('🔒 Этот раздел доступен только в полном расчете', 'info');
                    }
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

    selectTariff(tariffCode) {
        const tariff = this.tariffs.find(t => t.code === tariffCode);
        if (!tariff) return;

        this.selectedTariff = tariff;

        const titleEl = document.getElementById('selectedTariffTitle');
        const descEl = document.getElementById('selectedTariffDescription');
        if (titleEl) titleEl.textContent = tariff.name;
        if (descEl) descEl.textContent = tariff.description || '';

        this.updatePriceInfo(tariff);
        this.showInputFields(tariffCode);

        if (this.tariffSection) this.tariffSection.style.display = 'none';
        if (this.inputSection) this.inputSection.style.display = 'block';
        this.renderTariffs();
    }

    updatePriceInfo(tariff) {
        const priceInfo = document.getElementById('selectedTariffPrice');
        let price = tariff.price;
        let oldPrice = null;
        let discountText = '';
        let isFree = false;

        if (this.activeSubscription) {
            if (['forecast_day', 'forecast_week', 'forecast_month'].includes(tariff.code)) {
                price = 0;
                isFree = true;
                discountText = 'Бесплатно по подписке';
            } else if (['forecast_year', 'forecast_full', 'compatibility'].includes(tariff.code)) {
                oldPrice = price;
                price = Math.round(price * 0.5);
                discountText = '-50% по подписке';
            }
        }

        let html = '';
        if (price === 0 && isFree) {
            html = '<span class="price-free">Бесплатно</span> <span class="discount-badge">По подписке</span>';
        } else if (price === 0) {
            html = '<span class="price-free">Бесплатно</span>';
        } else {
            html = `<span class="price-current">${price} ₽</span>`;
            if (oldPrice) html += `<span class="price-old">${oldPrice} ₽</span>`;
            if (discountText) html += `<span class="discount-badge">${discountText}</span>`;
        }

        if (priceInfo) priceInfo.innerHTML = html;
    }

    showInputFields(tariffCode) {
        const weekPicker = document.getElementById('weekPickerContainer');
        const monthPicker = document.getElementById('monthPickerContainer');
        const yearPicker = document.getElementById('yearPickerContainer');
        const targetDateInput = document.getElementById('targetDate');

        if (tariffCode === 'compatibility') {
            if (this.compatibilityFields) this.compatibilityFields.style.display = 'block';
            if (this.targetDateField) this.targetDateField.style.display = 'none';
            if (weekPicker) weekPicker.style.display = 'none';
            if (monthPicker) monthPicker.style.display = 'none';
            if (yearPicker) yearPicker.style.display = 'none';
        } else if (['forecast_day', 'forecast_week', 'forecast_month', 'forecast_year'].includes(tariffCode)) {
            if (this.compatibilityFields) this.compatibilityFields.style.display = 'none';
            if (this.targetDateField) this.targetDateField.style.display = 'block';

            if (tariffCode === 'forecast_week') {
                if (weekPicker) weekPicker.style.display = 'block';
                if (monthPicker) monthPicker.style.display = 'none';
                if (yearPicker) yearPicker.style.display = 'none';
                if (targetDateInput) targetDateInput.style.display = 'none';
                if (window.DatePickers && window.DateService) {
                    const today = new Date();
                    window.DatePickers.updateWeekDisplay(window.DateService.getMonday(today));
                }
            } else if (tariffCode === 'forecast_month') {
                if (monthPicker) monthPicker.style.display = 'block';
                if (weekPicker) weekPicker.style.display = 'none';
                if (yearPicker) yearPicker.style.display = 'none';
                if (targetDateInput) targetDateInput.style.display = 'none';
                if (window.DatePickers) {
                    window.DatePickers.updateMonthDisplay(new Date());
                }
            } else if (tariffCode === 'forecast_year') {
                if (yearPicker) yearPicker.style.display = 'block';
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
            if (this.compatibilityFields) this.compatibilityFields.style.display = 'none';
            if (this.targetDateField) this.targetDateField.style.display = 'none';
            if (weekPicker) weekPicker.style.display = 'none';
            if (monthPicker) monthPicker.style.display = 'none';
            if (yearPicker) yearPicker.style.display = 'none';
        }
    }

    async handleSubmit(e) {
        e.preventDefault();

        const fullName = document.getElementById('fullName')?.value.trim() || '';
        const birthDate = document.getElementById('birthDate')?.value.trim() || '';

        if (window.ValidationService) {
            const nameValidation = window.ValidationService.validateFullName(fullName);
            if (!nameValidation.valid) {
                if (window.UIHelpers) window.UIHelpers.showNotification(nameValidation.error, 'error');
                return;
            }

            const dateValidation = window.ValidationService.validateBirthDate(birthDate);
            if (!dateValidation.valid) {
                if (window.UIHelpers) window.UIHelpers.showNotification(dateValidation.error, 'error');
                return;
            }
        } else {
            if (!fullName || !birthDate) {
                if (window.UIHelpers) window.UIHelpers.showNotification('Пожалуйста, заполните все поля', 'error');
                return;
            }
        }

        if (window.UIHelpers) {
            window.UIHelpers.showLoading(this.loadingSpinner, this.form, true);
        }

        try {
            const requestData = {
                fullName,
                birthDate: window.DateService ? window.DateService.formatDateForServer(birthDate) : birthDate
            };

            if (this.selectedTariff?.code === 'compatibility') {
                const partnerName = document.getElementById('partnerName')?.value.trim() || '';
                const partnerBirthDate = document.getElementById('partnerBirthDate')?.value.trim() || '';

                if (!partnerName || !partnerBirthDate) {
                    if (window.UIHelpers) window.UIHelpers.showNotification('Заполните данные партнера', 'error');
                    if (window.UIHelpers) window.UIHelpers.showLoading(this.loadingSpinner, this.form, false);
                    return;
                }
                requestData.partnerName = partnerName;
                requestData.partnerBirthDate = window.DateService ? window.DateService.formatDateForServer(partnerBirthDate) : partnerBirthDate;
            } else if (this.selectedTariff?.code.startsWith('forecast_')) {
                let targetDate = '';

                if (this.selectedTariff.code === 'forecast_week') {
                    targetDate = document.getElementById('selectedWeekStart')?.value;
                    if (!targetDate) {
                        // Если нет выбранной недели, берем текущую
                        const today = new Date();
                        const monday = window.DateService ? window.DateService.getMonday(today) : today;
                        targetDate = window.DateService ? window.DateService.formatDateForServer(monday) : monday.toISOString().split('T')[0];
                    }
                } else if (this.selectedTariff.code === 'forecast_month') {
                    const month = document.getElementById('selectedMonth')?.value;
                    const year = document.getElementById('selectedYear')?.value;
                    if (month && year) {
                        targetDate = `${year}-${String(month).padStart(2, '0')}-01`;
                    } else {
                        const dateInput = document.getElementById('targetDate')?.value;
                        if (dateInput) {
                            targetDate = window.DateService ? window.DateService.formatDateForServer(dateInput) : dateInput;
                        } else {
                            // По умолчанию текущий месяц
                            const now = new Date();
                            targetDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
                        }
                    }
                } else if (this.selectedTariff.code === 'forecast_year') {
                    const year = document.getElementById('selectedYear')?.value;
                    if (year) {
                        targetDate = `${year}-01-01`;
                    } else {
                        const dateInput = document.getElementById('targetDate')?.value;
                        if (dateInput) {
                            targetDate = window.DateService ? window.DateService.formatDateForServer(dateInput) : dateInput;
                        } else {
                            // По умолчанию текущий год
                            targetDate = `${new Date().getFullYear()}-01-01`;
                        }
                    }
                } else {
                    // forecast_day
                    const inputDate = document.getElementById('targetDate')?.value.trim();
                    if (!inputDate) {
                        // Если дата не указана, берем сегодняшнюю
                        const today = new Date();
                        targetDate = window.DateService ? window.DateService.formatDateForServer(today) : today.toISOString().split('T')[0];
                    } else {
                        targetDate = window.DateService ? window.DateService.formatDateForServer(inputDate) : inputDate;
                    }
                }

                // Проверяем, что targetDate валидная
                if (!targetDate || targetDate === 'Invalid date') {
                    // Используем сегодняшнюю дату как fallback
                    const today = new Date();
                    targetDate = window.DateService ? window.DateService.formatDateForServer(today) : today.toISOString().split('T')[0];
                    console.warn('⚠️ Невалидная дата, используем сегодняшнюю:', targetDate);
                }

                requestData.targetDate = targetDate;
            }

            let endpoint = this.getEndpoint();
            if (!endpoint) {
                throw new Error('Неизвестный тип расчета');
            }

            console.log('📤 Отправка запроса:', endpoint, requestData);

            const response = await window.ApiService.calculate(endpoint, requestData);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                if (response.status === 401) {
                    if (window.UIHelpers) window.UIHelpers.showNotification('Необходимо авторизоваться', 'error');
                    setTimeout(() => window.location.href = '/login', 2000);
                } else if (response.status === 402) {
                    if (window.UIHelpers) window.UIHelpers.showPaymentModal(errorData);
                } else {
                    throw new Error(errorData.error || `Ошибка ${response.status}`);
                }
                if (window.UIHelpers) window.UIHelpers.showLoading(this.loadingSpinner, this.form, false);
                return;
            }

            const data = await response.json();
            if (data.success) {
                window.currentNumerologyData = data.data;
                window.currentCalculationId = data.calculationId;
                this.currentCalculation = data.data;
                this.displayResults(data.data);
            } else {
                throw new Error(data.error || 'Ошибка расчета');
            }

        } catch (error) {
            console.error('❌ Ошибка:', error);
            if (window.UIHelpers) window.UIHelpers.showNotification(error.message, 'error');
        } finally {
            if (window.UIHelpers) window.UIHelpers.showLoading(this.loadingSpinner, this.form, false);
        }
    }

    getEndpoint() {
        if (!this.selectedTariff) return '';
        if (this.selectedTariff.code === 'forecast_basic') return '/api/numerology/calculate/basic';
        if (this.selectedTariff.code === 'forecast_full') return '/api/numerology/calculate/full';
        if (this.selectedTariff.code === 'compatibility') return '/api/numerology/compatibility';
        if (this.selectedTariff.code === 'forecast_day') return '/api/numerology/forecast/day';
        if (this.selectedTariff.code === 'forecast_week') return '/api/numerology/forecast/week';
        if (this.selectedTariff.code === 'forecast_month') return '/api/numerology/forecast/month';
        if (this.selectedTariff.code === 'forecast_year') return '/api/numerology/forecast/year';
        return '';
    }

    displayResults(data) {
        // Определяем тип расчета
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

        const resultTypeEl = document.getElementById('resultType');
        const resultBadgeEl = document.getElementById('resultBadge');
        if (resultTypeEl) resultTypeEl.textContent = resultType;
        if (resultBadgeEl) resultBadgeEl.innerHTML = badge;

        // Заполняем базовые данные
        const resultFullNameEl = document.getElementById('resultFullName');
        const resultBirthDateEl = document.getElementById('resultBirthDate');
        if (resultFullNameEl) resultFullNameEl.textContent = data.fullName || this.user?.fullName || '—';
        if (resultBirthDateEl) resultBirthDateEl.textContent = data.birthDate || '—';

        // Отображаем базовые числа
        if (data.forecast?.personNumbers) {
            const personNumbers = data.forecast.personNumbers;
            const fateEl = document.getElementById('fateNumber');
            const nameEl = document.getElementById('nameNumber');
            const surnameEl = document.getElementById('surnameNumber');
            const patronymicEl = document.getElementById('patronymicNumber');
            if (fateEl) fateEl.textContent = personNumbers.fate || '—';
            if (nameEl) nameEl.textContent = personNumbers.name || '—';
            if (surnameEl) surnameEl.textContent = personNumbers.surname || '—';
            if (patronymicEl) patronymicEl.textContent = personNumbers.patronymic || '—';
        } else if (data.numerology?.base) {
            const fateEl = document.getElementById('fateNumber');
            const nameEl = document.getElementById('nameNumber');
            const surnameEl = document.getElementById('surnameNumber');
            const patronymicEl = document.getElementById('patronymicNumber');
            if (fateEl) fateEl.textContent = data.numerology.base.fate || '—';
            if (nameEl) nameEl.textContent = data.numerology.base.name || '—';
            if (surnameEl) surnameEl.textContent = data.numerology.base.surname || '—';
            if (patronymicEl) patronymicEl.textContent = data.numerology.base.patronymic || '—';
        }

        const achillesEl = document.getElementById('achillesNumber');
        const controlEl = document.getElementById('controlNumber');
        if (achillesEl && data.numerology?.achilles) achillesEl.textContent = data.numerology.achilles.number || '—';
        if (controlEl && data.numerology?.control) controlEl.textContent = data.numerology.control.number || '—';

        if (data.numerology?.calls) {
            const callCloseEl = document.getElementById('callClose');
            const callSocialEl = document.getElementById('callSocial');
            const callWorldEl = document.getElementById('callWorld');
            const callCloseDescEl = document.getElementById('callCloseDesc');
            const callSocialDescEl = document.getElementById('callSocialDesc');
            const callWorldDescEl = document.getElementById('callWorldDesc');

            if (callCloseEl) callCloseEl.textContent = data.numerology.calls.close || '—';
            if (callSocialEl) callSocialEl.textContent = data.numerology.calls.social || '—';
            if (callWorldEl) callWorldEl.textContent = data.numerology.calls.world || '—';
            if (callCloseDescEl && data.numerology.calls.descriptions) callCloseDescEl.textContent = data.numerology.calls.descriptions.close || '';
            if (callSocialDescEl && data.numerology.calls.descriptions) callSocialDescEl.textContent = data.numerology.calls.descriptions.social || '';
            if (callWorldDescEl && data.numerology.calls.descriptions) callWorldDescEl.textContent = data.numerology.calls.descriptions.world || '';
        }

        // Для прогноза показываем специальный блок
        if (isForecast && data.forecast) {
            const specialNumbers = document.querySelector('.special-numbers');
            const callsSection = document.querySelector('.calls-section');
            const additionalSections = document.querySelector('.additional-sections');
            if (specialNumbers) specialNumbers.style.display = 'none';
            if (callsSection) callsSection.style.display = 'none';
            if (additionalSections) additionalSections.style.display = 'none';

            if (isYearForecast) {
                this.displayYearForecast(data.forecast);
            } else if (isMonthForecast) {
                this.displayMonthForecast(data.forecast);
            } else if (isWeekForecast) {
                this.displayWeekForecast(data.forecast);
            } else {
                this.displayDayForecast(data.forecast);
            }
        } else {
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

        // Разблокируем расширенные разделы для полного расчета
        if (isFull) {
            this.unlockFullSections(data);
        } else {
            this.lockSections();
        }

        // Показываем PDF кнопку
        const downloadPdfBtn = document.getElementById('downloadPdfBtn');
        if (downloadPdfBtn && localStorage.getItem('token')) {
            downloadPdfBtn.style.display = 'block';
        }

        // Показываем кнопку апгрейда
        const upgradeBtn = document.getElementById('upgradeCalculationBtn');
        if (upgradeBtn) {
            if (!isFull && this.selectedTariff?.code !== 'forecast_full' && !isForecast) {
                upgradeBtn.style.display = 'block';
            } else {
                upgradeBtn.style.display = 'none';
            }
        }

        // Показываем результат
        if (this.tariffSection) this.tariffSection.style.display = 'none';
        if (this.inputSection) this.inputSection.style.display = 'none';
        if (this.resultSection) {
            this.resultSection.style.display = 'block';
            this.resultSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    displayDayForecast(forecast) {
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
                if (resultCard) resultCard.appendChild(forecastContainer);
            }
        }

        if (window.ForecastRenderer && window.ForecastRenderer.renderDayForecast) {
            forecastContainer.innerHTML = window.ForecastRenderer.renderDayForecast(forecast);
        } else {
            forecastContainer.innerHTML = '<p class="error-message">Ошибка отображения прогноза</p>';
        }
    }

    displayWeekForecast(forecast) {
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
                if (resultCard) resultCard.appendChild(forecastContainer);
            }
        }

        if (window.ForecastRenderer && window.ForecastRenderer.renderWeekForecast) {
            forecastContainer.innerHTML = window.ForecastRenderer.renderWeekForecast(forecast);
        } else {
            forecastContainer.innerHTML = '<p class="error-message">Ошибка отображения недельного прогноза</p>';
        }
    }

    displayMonthForecast(forecast) {
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
                if (resultCard) resultCard.appendChild(forecastContainer);
            }
        }

        if (window.ForecastRenderer && window.ForecastRenderer.renderMonthForecast) {
            forecastContainer.innerHTML = window.ForecastRenderer.renderMonthForecast(forecast);
        } else {
            forecastContainer.innerHTML = '<p class="error-message">Ошибка отображения месячного прогноза</p>';
        }
    }

    displayYearForecast(forecast) {
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
                if (resultCard) resultCard.appendChild(forecastContainer);
            }
        }

        if (window.ForecastRenderer && window.ForecastRenderer.renderYearForecast) {
            forecastContainer.innerHTML = window.ForecastRenderer.renderYearForecast(forecast);
        } else {
            forecastContainer.innerHTML = '<p class="error-message">Ошибка отображения годового прогноза</p>';
        }
    }

    unlockFullSections(data) {
        const lockedTabs = document.querySelectorAll('.tab-btn.locked');
        const interpretationTabs = document.querySelectorAll('.interpretation-tabs .tab-btn.locked');

        lockedTabs.forEach(btn => {
            btn.classList.remove('locked');
            const lockIcon = btn.querySelector('.lock-icon');
            if (lockIcon) lockIcon.remove();
        });

        interpretationTabs.forEach(btn => {
            btn.classList.remove('locked');
            const lockIcon = btn.querySelector('.lock-icon');
            if (lockIcon) lockIcon.remove();
        });

        const overlays = document.querySelectorAll('.lock-overlay');
        overlays.forEach(overlay => overlay.remove());

        if (data.zodiac && window.ForecastRenderer) this.displayZodiac(data.zodiac);
        if (data.fengShui && window.ForecastRenderer) this.displayFengShui(data.fengShui);
        if (data.tarot && window.ForecastRenderer) this.displayTarot(data.tarot);
        if (data.psychology && window.ForecastRenderer) this.displayPsychology(data.psychology);
        if (data.patterns && window.ForecastRenderer) this.displayPatterns(data.patterns);
        if (data.numerology?.interpretations) {
            this.displayInterpretations(data.numerology.interpretations);
        }

        const firstTab = document.querySelector('.tab-btn:not(.locked)');
        if (firstTab) firstTab.click();
    }

    lockSections() {
        const tabs = document.querySelectorAll('.tab-btn:not(.locked)');
        const interpretationTabs = document.querySelectorAll('.interpretation-tabs .tab-btn:not(.locked)');

        tabs.forEach(btn => {
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

        interpretationTabs.forEach(btn => {
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
        if (tabContent && window.ForecastRenderer) {
            tabContent.innerHTML = window.ForecastRenderer.renderZodiac(zodiac);
        }
    }

    displayFengShui(fengShui) {
        const tabContent = document.getElementById('tabFengshui');
        if (tabContent && window.ForecastRenderer) {
            tabContent.innerHTML = window.ForecastRenderer.renderFengShui(fengShui);
        }
    }

    displayTarot(tarot) {
        const tabContent = document.getElementById('tabTarot');
        if (tabContent && window.ForecastRenderer) {
            tabContent.innerHTML = window.ForecastRenderer.renderTarotCards(tarot);
        }
    }

    displayPsychology(psychology) {
        const tabContent = document.getElementById('tabPsychology');
        if (tabContent && window.ForecastRenderer) {
            tabContent.innerHTML = window.ForecastRenderer.renderPsychology(psychology);
        }
    }

    displayPatterns(patterns) {
        const tabContent = document.getElementById('tabPatterns');
        if (tabContent && window.ForecastRenderer) {
            tabContent.innerHTML = window.ForecastRenderer.renderPatterns(patterns);
        }
    }

    displayInterpretations(interpretations) {
        if (!interpretations) return;

        const lockedTabs = document.querySelectorAll('.interpretation-tabs .tab-btn.locked');
        const lockedPanes = document.querySelectorAll('.interpretation-pane.locked-pane');

        lockedTabs.forEach(btn => {
            btn.classList.remove('locked');
            const lockIcon = btn.querySelector('.lock-icon');
            if (lockIcon) lockIcon.remove();
        });

        lockedPanes.forEach(pane => {
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
            setTimeout(() => firstTab.click(), 100);
        }
    }

    displayCareerInterpretation(career) {
        const pane = document.getElementById('interpretation-career');
        if (!pane) return;

        pane.classList.remove('locked-pane');
        const overlay = pane.querySelector('.lock-overlay');
        if (overlay) overlay.remove();

        this.setElementText('careerNumber', career.careerNumber || '--');
        this.setElementText('careerTitle', career.title || 'Карьерный потенциал');
        this.setElementText('careerDescription', career.description || '');

        const detailedDesc = document.getElementById('careerDetailedDescription');
        if (detailedDesc) detailedDesc.innerHTML = career.detailedDescription || career.description || '';

        this.fillList('careerStrengths', career.strengths);
        this.fillList('careerWeaknesses', career.weaknesses);
        this.fillList('careerSuitable', career.suitable);

        this.setElementText('careerWorkStyle', career.workStyle || '');
        this.setElementText('careerMoneyApproach', career.moneyApproach || '');
        this.setElementText('careerManagementStyle', career.managementStyle || '');
        this.setElementText('careerIdealEnvironment', career.idealEnvironment || '');
        this.fillList('careerSuccessFactors', career.successFactors);
        this.fillList('careerFailureFactors', career.failureFactors);
        this.setElementText('careerDevelopmentPath', career.developmentPath || career.advice || '');
        this.setElementText('careerSuccessNum', career.successNumber || '--');
        this.setElementText('careerSuccessDesc', career.successDescription || '');
        this.setElementText('careerRealizationNum', career.realizationNumber || '--');
        this.setElementText('careerRealizationDesc', career.realizationDescription || '');
        this.setElementText('careerAdvice', career.advice || '');
    }

    displayFamilyInterpretation(family) {
        const pane = document.getElementById('interpretation-family');
        if (!pane) return;

        pane.classList.remove('locked-pane');
        const overlay = pane.querySelector('.lock-overlay');
        if (overlay) overlay.remove();

        this.setElementText('familyNumber', family.familyNumber || '--');
        this.setElementText('familyTitle', family.title || 'Семейная гармония');
        this.setElementText('familyDescription', family.description || '');

        const detailedDesc = document.getElementById('familyDetailedDescription');
        if (detailedDesc) detailedDesc.innerHTML = family.detailedDescription || family.description || '';

        this.setElementText('familyRole', family.role || '');
        this.fillList('familyStrengths', family.strengths);
        this.fillList('familyWeaknesses', family.weaknesses);
        this.setElementText('familyStyle', family.familyStyle || '');
        this.setElementText('familyChildrenApproach', family.childrenApproach || '');
        this.setElementText('familyPartnerType', family.partnerType || '');
        this.fillList('familySuccessFactors', family.successFactors);
        this.fillList('familyFailureFactors', family.failureFactors);
        this.setElementText('familyDevelopmentPath', family.developmentPath || family.advice || '');
        this.setElementText('familyPartnerNum', family.partnerNumber || '--');
        this.setElementText('familyPartnerDesc', family.partnerDescription || '');
        this.setElementText('familyChildrenNum', family.childrenNumber || '--');
        this.setElementText('familyChildrenDesc', family.childrenDescription || '');
        this.setElementText('familyAdvice', family.advice || '');
    }

    displayLoveInterpretation(love) {
        const pane = document.getElementById('interpretation-love');
        if (!pane) return;

        pane.classList.remove('locked-pane');
        const overlay = pane.querySelector('.lock-overlay');
        if (overlay) overlay.remove();

        this.setElementText('loveNumber', love.loveNumber || '--');
        this.setElementText('loveTitle', love.title || 'Любовная совместимость');
        this.setElementText('loveDescription', love.description || '');

        const detailedDesc = document.getElementById('loveDetailedDescription');
        if (detailedDesc) detailedDesc.innerHTML = love.detailedDescription || love.description || '';

        this.setElementText('loveStyle', love.loveStyle || '');
        this.fillList('loveStrengths', love.strengths);
        this.fillList('loveWeaknesses', love.weaknesses);
        this.setElementText('idealPartner', love.idealPartner || '');
        this.setElementText('lovePartnerType', love.partnerType || '');
        this.setElementText('loveRelationshipPattern', love.relationshipPattern || '');
        this.fillList('loveSuccessFactors', love.successFactors);
        this.fillList('loveFailureFactors', love.failureFactors);
        this.setElementText('loveDevelopmentPath', love.developmentPath || love.advice || '');

        if (love.compatibility !== undefined) {
            this.setElementText('loveCompatibilityPercent', (love.compatibility || 0) + '%');
            const progressBar = document.getElementById('loveCompatibilityProgress');
            if (progressBar) progressBar.style.width = (love.compatibility || 0) + '%';
            this.setElementText('loveCompatibilityLevel', love.compatibilityLevel || `Совместимость: ${love.compatibility || 0}%`);
        }
        this.setElementText('loveAdvice', love.advice || '');
    }

    displayMoneyInterpretation(money) {
        const pane = document.getElementById('interpretation-money');
        if (!pane) return;

        pane.classList.remove('locked-pane');
        const overlay = pane.querySelector('.lock-overlay');
        if (overlay) overlay.remove();

        this.setElementText('moneyNumber', money.moneyNumber || '--');
        this.setElementText('moneyTitle', money.title || 'Финансовый поток');
        this.setElementText('moneyDescription', money.description || '');

        const detailedDesc = document.getElementById('moneyDetailedDescription');
        if (detailedDesc) detailedDesc.innerHTML = money.detailedDescription || money.description || '';

        this.setElementText('moneyStyle', money.moneyStyle || '');
        this.fillList('moneyStrengths', money.strengths);
        this.fillList('moneyWeaknesses', money.weaknesses);
        this.fillList('moneySources', money.sources);
        this.setElementText('moneyStrategy', money.moneyStrategy || '');
        this.setElementText('moneyRiskAttitude', money.riskAttitude || '');
        this.fillList('moneyInvestments', money.bestInvestments);
        this.fillList('moneySuccessFactors', money.successFactors);
        this.fillList('moneyFailureFactors', money.failureFactors);
        this.setElementText('moneyDevelopmentPath', money.developmentPath || money.advice || '');
        this.setElementText('moneyAbundanceNum', money.abundanceNumber || '--');
        this.setElementText('moneyAbundanceDesc', money.abundanceDescription || '');
        this.setElementText('moneyAdvice', money.advice || '');
    }

    displayHealthInterpretation(health) {
        const pane = document.getElementById('interpretation-health');
        if (!pane) return;

        pane.classList.remove('locked-pane');
        const overlay = pane.querySelector('.lock-overlay');
        if (overlay) overlay.remove();

        this.setElementText('healthNumber', health.healthNumber || '--');
        this.setElementText('healthTitle', health.title || 'Энергия здоровья');
        this.setElementText('healthDescription', health.description || '');

        const detailedDesc = document.getElementById('healthDetailedDescription');
        if (detailedDesc) detailedDesc.innerHTML = health.detailedDescription || health.description || '';

        if (health.energyLevel !== undefined) {
            const energyProgress = document.getElementById('healthEnergyProgress');
            if (energyProgress) {
                const percent = ((health.energyLevel || 0) / 10) * 100;
                energyProgress.style.width = percent + '%';
            }
            this.setElementText('healthEnergyLevel', `Уровень энергии: ${health.energyLevel || 0}/10`);
        }

        this.setElementText('healthEnergyType', health.energyType || '');
        this.fillList('healthStrengths', health.strengths);
        this.fillList('healthWeaknesses', health.weaknesses);
        this.fillList('healthVulnerable', health.vulnerable);
        this.fillList('healthRecommendations', health.recommendations);
        this.setElementText('healthSeasonalRisks', health.seasonalRisks || '');
        this.fillList('healthPrevention', health.prevention);
        this.setElementText('healthDevelopmentPath', health.developmentPath || health.advice || '');
        this.setElementText('healthAdvice', health.advice || '');
    }

    displayTalentInterpretation(talent) {
        const pane = document.getElementById('interpretation-talent');
        if (!pane) return;

        pane.classList.remove('locked-pane');
        const overlay = pane.querySelector('.lock-overlay');
        if (overlay) overlay.remove();

        this.setElementText('talentNumber', talent.talentNumber || '--');
        this.setElementText('talentTitle', talent.title || 'Скрытые таланты');
        this.setElementText('talentDescription', talent.description || '');

        const detailedDesc = document.getElementById('talentDetailedDescription');
        if (detailedDesc) detailedDesc.innerHTML = talent.detailedDescription || talent.description || '';

        this.fillList('talentList', talent.talents);
        this.fillList('talentHowToDevelop', talent.howToDevelop);
        this.fillList('talentSuitable', talent.suitable);
        this.setElementText('talentCombinations', talent.combinations || '');
        this.setElementText('talentEnvironment', talent.environment || '');
        this.fillList('talentSuccessFactors', talent.successFactors);
        this.fillList('talentFailureFactors', talent.failureFactors);
        this.setElementText('talentDevelopmentPath', talent.developmentPath || talent.advice || '');

        if (talent.potential !== undefined) {
            this.setElementText('talentPotentialPercent', (talent.potential || 0) + '%');
            const progressBar = document.getElementById('talentPotentialProgress');
            if (progressBar) progressBar.style.width = (talent.potential || 0) + '%';
            this.setElementText('talentPotentialDescription', talent.potentialDescription || `Потенциал: ${talent.potential || 0}%`);
        }
        this.setElementText('talentAdvice', talent.advice || '');
    }

    fillList(elementId, items) {
        const element = document.getElementById(elementId);
        if (!element) return;
        element.innerHTML = '';
        if (items && items.length) {
            items.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = item;
                element.appendChild(li);
            });
        } else {
            element.innerHTML = '<li>—</li>';
        }
    }

    setElementText(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value !== undefined && value !== null ? value : '—';
        }
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
        const upgradeBtn = document.getElementById('upgradeCalculationBtn');
        if (upgradeBtn) upgradeBtn.style.display = 'none';
    }

    async downloadPDFReport() {
        try {
            if (!window.currentCalculationId) {
                if (window.UIHelpers) window.UIHelpers.showNotification('Сначала выполните расчет', 'error');
                return;
            }
            if (window.UIHelpers) window.UIHelpers.showNotification('Генерируем PDF отчет...', 'info');
            const blob = await window.ApiService.downloadPDF(window.currentCalculationId);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `numerology-report-${window.currentCalculationId}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            if (window.UIHelpers) window.UIHelpers.showNotification('PDF отчет готов!', 'success');
        } catch (error) {
            console.error('❌ Ошибка скачивания PDF:', error);
            if (window.UIHelpers) window.UIHelpers.showNotification('Ошибка при создании PDF', 'error');
        }
    }

    showAuthModal() {
        if (window.UIHelpers) window.UIHelpers.showAuthModal();
    }

    showPreview(tariffCode) {
        if (!window.previewRenderer) {
            if (window.UIHelpers) window.UIHelpers.showNotification('Ошибка загрузки демо-данных', 'error');
            return;
        }

        let demoData = null;
        const dataMap = {
            'forecast_basic': window.previewData?.basic,
            'forecast_full': window.previewData?.full,
            'forecast_day': window.previewData?.dayForecast,
            'forecast_week': window.previewData?.weekForecast,
            'forecast_month': window.previewData?.monthForecast,
            'forecast_year': window.previewData?.yearForecast,
            'compatibility': window.previewData?.compatibility
        };
        demoData = dataMap[tariffCode] || window.previewData?.basic;

        if (!demoData) {
            if (window.UIHelpers) window.UIHelpers.showNotification('Демо-данные для этого тарифа не найдены', 'error');
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'preview-modal preview-full-modal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); backdrop-filter: blur(10px); z-index: 10000; display: flex; align-items: center; justify-content: center;`;
        modal.innerHTML = `
            <div class="preview-content full-report" style="max-width:95%; width:1200px; max-height:90vh; background:linear-gradient(135deg,#12121a,#0a0a0f); border:1px solid rgba(201,165,75,0.3); border-radius:30px; overflow:hidden; display:flex; flex-direction:column;">
                <div class="preview-header" style="padding:20px 30px; background:linear-gradient(135deg,rgba(201,165,75,0.1),rgba(0,0,0,0.3)); border-bottom:1px solid rgba(201,165,75,0.2); display:flex; justify-content:space-between; align-items:center;">
                    <div><h3 style="margin:0; color:var(--primary);">${this.getTariffName(tariffCode)}</h3><p style="margin:5px 0 0; color:var(--text-muted);">Демонстрационный отчет | Иванов Иван Иванович | 02.07.1993</p></div>
                    <button class="preview-close" style="background:none; border:none; color:var(--text-muted); font-size:28px; cursor:pointer;">&times;</button>
                </div>
                <div class="preview-body" style="padding:20px 30px; overflow-y:auto; flex:1; background:linear-gradient(135deg,#0a0a0f,#12121a);">
                    ${window.previewRenderer.generateFullReportHTML(demoData, tariffCode)}
                </div>
                <div class="preview-footer" style="padding:20px 30px; border-top:1px solid rgba(201,165,75,0.2); display:flex; justify-content:center; gap:15px;">
                    <button class="btn-select-preview" style="padding:12px 30px; background:var(--primary-gradient); border:none; border-radius:50px; color:var(--dark); font-weight:600; cursor:pointer;" onclick="numerologyApp.selectTariff('${tariffCode}'); document.querySelector('.preview-modal')?.remove()"><i class="fas fa-shopping-cart"></i> Выбрать этот расчет</button>
                    <button class="btn-close-preview" style="padding:12px 30px; background:transparent; border:1px solid var(--border-color); border-radius:50px; color:var(--text-secondary); cursor:pointer;">Закрыть</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.querySelector('.preview-close')?.addEventListener('click', () => modal.remove());
        modal.querySelector('.btn-close-preview')?.addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
    }

    getTariffName(code) {
        const names = {
            'forecast_basic': '🔮 БАЗОВЫЙ НУМЕРОЛОГИЧЕСКИЙ РАСЧЕТ',
            'forecast_full': '⭐ ПОЛНЫЙ НУМЕРОЛОГИЧЕСКИЙ ОТЧЕТ',
            'forecast_day': '📅 ПРОГНОЗ НА ДЕНЬ',
            'forecast_week': '📅 ПРОГНОЗ НА НЕДЕЛЮ',
            'forecast_month': '📅 ПРОГНОЗ НА МЕСЯЦ',
            'forecast_year': '📅 ПРОГНОЗ НА ГОД',
            'compatibility': '💑 АНАЛИЗ СОВМЕСТИМОСТИ'
        };
        return names[code] || '🔮 НУМЕРОЛОГИЧЕСКИЙ РАСЧЕТ';
    }
}

// Инициализация
const numerologyApp = new NumerologyApp();
window.numerologyApp = numerologyApp;