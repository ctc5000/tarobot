// modules/Astrology/web/js/astrology.js

class AstrologyApp {
    constructor() {
        this.user = null;
        this.currentCalculation = null;
        this.chartDraw = null;

        this.init();
    }

    async init() {
        console.log('🔮 AstrologyApp инициализация...');

        this.form = document.getElementById('astrologyForm');
        this.inputSection = document.getElementById('inputSection');
        this.resultSection = document.getElementById('resultSection');
        this.guestBlock = document.getElementById('guestBlock');
        this.loadingSpinner = document.getElementById('loadingSpinner');

        this.initChartDraw();
        this.initDateMasks();
        await this.loadUserData();
        this.updateAuthUI();
        this.addEventListeners();
        this.initCitySearch();
    }

    initChartDraw() {
        const canvas = document.getElementById('natalChartCanvas');
        if (canvas) {
            this.chartDraw = new NatalChartDraw('natalChartCanvas');
        }
    }

    initDateMasks() {
        const birthDateInput = document.getElementById('birthDate');
        if (birthDateInput && typeof IMask !== 'undefined') {
            IMask(birthDateInput, {
                mask: Date,
                pattern: 'd{.}`m{.}`Y',
                blocks: {
                    d: { mask: IMask.MaskedRange, from: 1, to: 31, maxLength: 2 },
                    m: { mask: IMask.MaskedRange, from: 1, to: 12, maxLength: 2 },
                    Y: { mask: IMask.MaskedRange, from: 1900, to: 2100, maxLength: 4 }
                },
                format: function(date) {
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const year = date.getFullYear();
                    return `${day}.${month}.${year}`;
                },
                parse: function(str) {
                    const [day, month, year] = str.split('.');
                    return new Date(year, month - 1, day);
                },
                lazy: false,
                autofix: true,
                placeholderChar: '_'
            });
        }
    }

    initCitySearch() {
        const birthPlaceInput = document.getElementById('birthPlace');
        const suggestionsContainer = document.getElementById('citySuggestions');
        const searchButton = document.getElementById('searchCity');
        const latitudeInput = document.getElementById('latitude');
        const longitudeInput = document.getElementById('longitude');

        let searchTimeout = null;

        if (birthPlaceInput) {
            birthPlaceInput.addEventListener('input', (e) => {
                const query = e.target.value.trim();

                if (latitudeInput) latitudeInput.value = '';
                if (longitudeInput) longitudeInput.value = '';

                if (searchTimeout) clearTimeout(searchTimeout);

                if (query.length >= 2) {
                    searchTimeout = setTimeout(() => {
                        this.searchCity(query);
                    }, 500);
                } else {
                    if (suggestionsContainer) {
                        suggestionsContainer.style.display = 'none';
                    }
                }
            });

            document.addEventListener('click', (e) => {
                if (suggestionsContainer &&
                    !birthPlaceInput.contains(e.target) &&
                    !suggestionsContainer.contains(e.target)) {
                    suggestionsContainer.style.display = 'none';
                }
            });
        }

        if (searchButton) {
            searchButton.addEventListener('click', async () => {
                const city = birthPlaceInput?.value.trim();
                if (!city || city.length < 2) {
                    this.showNotification('Введите название города', 'error');
                    return;
                }
                await this.searchCity(city);
            });
        }
    }

    async searchCity(query) {
        const suggestionsContainer = document.getElementById('citySuggestions');
        const latitudeInput = document.getElementById('latitude');
        const longitudeInput = document.getElementById('longitude');

        try {
            const response = await fetch(`/api/geocode/search?q=${encodeURIComponent(query)}&limit=5`);

            if (!response.ok) {
                throw new Error('Ошибка сети');
            }

            const data = await response.json();

            if (data && data.length > 0) {
                this.displaySuggestions(data);
            } else {
                if (suggestionsContainer) {
                    suggestionsContainer.style.display = 'none';
                }
                this.showNotification('Город не найден', 'error');
            }
        } catch (error) {
            console.error('Ошибка поиска города:', error);
            if (suggestionsContainer) {
                suggestionsContainer.style.display = 'none';
            }
            this.showNotification('Ошибка при поиске города', 'error');
        }
    }

    displaySuggestions(cities) {
        const suggestionsContainer = document.getElementById('citySuggestions');
        const latitudeInput = document.getElementById('latitude');
        const longitudeInput = document.getElementById('longitude');
        const birthPlaceInput = document.getElementById('birthPlace');

        if (!suggestionsContainer) return;

        suggestionsContainer.innerHTML = '';

        cities.forEach(city => {
            const cityName = city.display_name.split(',')[0];
            const country = city.address?.country || '';
            const region = city.address?.state || city.address?.region || '';

            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.innerHTML = `
                <div class="suggestion-main">${this.escapeHtml(cityName)}</div>
                <div class="suggestion-detail">${this.escapeHtml(region)} ${this.escapeHtml(country)}</div>
            `;

            item.addEventListener('click', () => {
                if (birthPlaceInput) birthPlaceInput.value = cityName;
                if (latitudeInput) latitudeInput.value = parseFloat(city.lat).toFixed(6);
                if (longitudeInput) longitudeInput.value = parseFloat(city.lon).toFixed(6);
                suggestionsContainer.style.display = 'none';
                this.showNotification(`✅ Выбран город: ${cityName}`, 'success');
            });

            suggestionsContainer.appendChild(item);
        });

        suggestionsContainer.style.display = 'block';
    }

    async loadUserData() {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch('/api/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                this.user = data.data.user;

                const fullNameInput = document.getElementById('fullName');
                if (fullNameInput && this.user.fullName) {
                    fullNameInput.value = this.user.fullName;
                }
            }
        } catch (error) {
            console.error('Ошибка загрузки пользователя:', error);
        }
    }

    updateAuthUI() {
        const authLinks = document.getElementById('authLinks');
        const mobileAuthButtons = document.getElementById('mobileAuthButtons');

        if (!authLinks) return;

        if (this.user) {
            if (this.guestBlock) this.guestBlock.style.display = 'none';
            if (this.inputSection) this.inputSection.style.display = 'block';

        } else {
            if (this.guestBlock) this.guestBlock.style.display = 'block';
            if (this.inputSection) this.inputSection.style.display = 'block';
        }

    }

    updateNavigation(mainNav, mobileNav) {
        const currentPath = window.location.pathname;
        const navItems = [
            { url: '/', name: 'Главная' },
            { url: '/numerology', name: 'Нумерология' },
            { url: '/astrology', name: 'Натальная карта' },
            { url: '/tarot', name: 'Таро' }
        ];

        if (this.user) {
            navItems.push({ url: '/cabinet', name: 'Кабинет' });
        }

        if (mainNav) {
            mainNav.innerHTML = navItems.map(item => `
                <a href="${item.url}" class="${currentPath === item.url ? 'active' : ''}">
                    ${item.name}
                </a>
            `).join('');
        }

        if (mobileNav) {
            const mobileNavItems = [
                { url: '/', name: 'Главная', icon: 'fas fa-home' },
                { url: '/numerology', name: 'Нумерология', icon: 'fas fa-calculator' },
                { url: '/astrology', name: 'Натальная карта', icon: 'fas fa-chart-line' },
                { url: '/tarot', name: 'Таро', icon: 'fas fa-crown' }
            ];

            if (this.user) {
                mobileNavItems.push({ url: '/cabinet', name: 'Кабинет', icon: 'fas fa-user' });
            }

            mobileNav.innerHTML = mobileNavItems.map(item => `
                <a href="${item.url}" class="mobile-nav-link ${currentPath === item.url ? 'active' : ''}">
                    <i class="${item.icon}"></i>
                    <span>${item.name}</span>
                </a>
            `).join('');
        }
    }

    logout() {
        localStorage.removeItem('token');
        window.location.href = '/';
    }

    addEventListeners() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        document.getElementById('newCalculationBtn')?.addEventListener('click', () => this.resetForm());
        document.getElementById('savePdfBtn')?.addEventListener('click', () => this.saveToPDF());
    }

    async handleSubmit(e) {
        e.preventDefault();

        const fullName = document.getElementById('fullName').value.trim();
        const birthDate = document.getElementById('birthDate').value.trim();
        const birthTime = document.getElementById('birthTime').value;
        const latitude = parseFloat(document.getElementById('latitude').value) || 55.7558;
        const longitude = parseFloat(document.getElementById('longitude').value) || 37.6173;
        const houseSystem = document.getElementById('houseSystem').value;

        if (!fullName || !birthDate || !birthTime) {
            this.showNotification('Пожалуйста, заполните все поля', 'error');
            return;
        }

        if (!this.isValidDate(birthDate)) {
            this.showNotification('Введите дату в формате ДД.ММ.ГГГГ', 'error');
            return;
        }

        this.showLoading(true);

        try {
            const token = localStorage.getItem('token');
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const requestData = {
                fullName,
                birthDate: this.formatDateForServer(birthDate),
                birthTime,
                latitude,
                longitude,
                houseSystem
            };

            const response = await fetch('/api/astrology/natal-chart', {
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

            const result = await response.json();

            if (result.success) {
                this.currentCalculation = result.data;
                window.currentCalculationId = result.calculationId;
                this.displayResults(result.data);
            } else {
                throw new Error(result.error || 'Ошибка расчета');
            }

        } catch (error) {
            console.error('❌ Ошибка:', error);
            this.showNotification(error.message, 'error');
        } finally {
            this.showLoading(false);
        }
    }

    displayResults(data) {
        // Основная информация
        document.getElementById('resultName').textContent = data.fullName || '—';
        document.getElementById('resultDate').textContent = data.birthDate || '—';
        document.getElementById('resultTime').textContent = data.birthTime || '—';

        // Отрисовка карты
        if (this.chartDraw && data.chartData) {
            this.chartDraw.draw({
                planets: data.planets,
                houses: data.houses,
                aspects: data.aspects,
                chartData: data.chartData
            });
        }

        // Вставляем готовые HTML блоки с сервера
        if (data.htmlBlocks) {
            document.getElementById('enrichedPlanetsInfo').innerHTML = data.htmlBlocks.enrichedPlanetsInfo || '';
            document.getElementById('enrichedHousesInfo').innerHTML = data.htmlBlocks.enrichedHousesInfo || '';
            document.getElementById('enrichedAspectsInfo').innerHTML = data.htmlBlocks.enrichedAspectsInfo || '';
            document.getElementById('planetLegend').innerHTML = data.htmlBlocks.legend || '';
            document.getElementById('planetPositions').innerHTML = data.htmlBlocks.planetPositions || '';
            document.getElementById('aspectsList').innerHTML = data.htmlBlocks.aspectsList || '';
            document.getElementById('natalInterpretation').innerHTML = data.htmlBlocks.interpretation || '';
            document.getElementById('expandedReport').innerHTML = data.htmlBlocks.expandedReport || '';
        }

        // Показываем кнопку PDF
        const savePdfBtn = document.getElementById('savePdfBtn');
        if (savePdfBtn && localStorage.getItem('token')) {
            savePdfBtn.style.display = 'inline-flex';
        }

        // Скрываем форму ввода, показываем результат
        if (this.inputSection) this.inputSection.style.display = 'none';
        if (this.resultSection) {
            this.resultSection.style.display = 'block';
            this.resultSection.scrollIntoView({ behavior: 'smooth' });
        }
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
            <span>${this.escapeHtml(message)}</span>
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
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    resetForm() {
        if (this.resultSection) this.resultSection.style.display = 'none';
        if (this.inputSection) this.inputSection.style.display = 'block';
        if (this.form) this.form.reset();

        const timeInput = document.getElementById('birthTime');
        if (timeInput) timeInput.value = '12:00';

        const latInput = document.getElementById('latitude');
        const lonInput = document.getElementById('longitude');
        if (latInput) latInput.value = '';
        if (lonInput) lonInput.value = '';

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    async saveToPDF() {
        try {
            if (!this.currentCalculation) {
                this.showNotification('Сначала выполните расчет', 'error');
                return;
            }

            this.showNotification('Создаю официальный отчет...', 'info');

            const response = await fetch(`/api/astrology/pdf/${window.currentCalculationId}`, {
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
            a.download = `natal-chart-${window.currentCalculationId}.pdf`;
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

    escapeHtml(str) {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
}

// Инициализация
const astrologyApp = new AstrologyApp();
window.astrologyApp = astrologyApp;