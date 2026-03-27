class AstrologyApp {
    constructor() {
        this.user = null;
        this.tariffs = [];
        this.selectedTariff = null;
        this.currentCalculation = null;
        this.chartDraw = null;
        this.init();
    }

    async init() {
        console.log('🔮 AstrologyApp инициализация...');

        this.form = document.getElementById('astrologyForm');
        this.tariffSection = document.getElementById('tariffSection');
        this.inputSection = document.getElementById('inputSection');
        this.resultSection = document.getElementById('resultSection');
        this.guestBlock = document.getElementById('guestBlock');
        this.tariffGrid = document.getElementById('tariffGrid');
        this.loadingSpinner = document.getElementById('loadingSpinner');

        this.initChartDraw();
        await this.loadUserData();
        await this.loadTariffs();
        this.updateAuthUI();
        this.initDateMasks();
        this.initCitySearch();
        this.addEventListeners();
    }

    initChartDraw() {
        const canvas = document.getElementById('natalChartCanvas');
        if (canvas) {
            this.chartDraw = new NatalChartDraw('natalChartCanvas');
        }
    }

    async loadUserData() {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const response = await fetch('/api/profile', { headers: { 'Authorization': `Bearer ${token}` } });
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

    async loadTariffs() {
        try {
            const response = await fetch('/api/astrology/tariffs');
            if (response.ok) {
                const data = await response.json();
                this.tariffs = data.data;
                this.renderTariffs();
            } else {
                this.useFallbackTariffs();
            }
        } catch (error) {
            console.error('Ошибка загрузки тарифов:', error);
            this.useFallbackTariffs();
        }
    }

    useFallbackTariffs() {
        this.tariffs = [
            { code: 'natal_basic', name: 'Базовый портрет', price: 0, description: 'Основные положения планет, асцендент, базовая интерпретация' },
            { code: 'natal_standard', name: 'Стандартный портрет', price: 400, description: 'Полный разбор натальной карты с домами и аспектами' },
            { code: 'natal_full', name: 'Глубокий анализ', price: 700, description: 'Глубокий анализ личности, аспекты, дома, расширенный отчет' },
            { code: 'natal_premium', name: 'Премиум-портрет', price: 1200, description: 'Максимально полный разбор + кармический анализ + PDF отчет' }
        ];
        this.renderTariffs();
    }

    renderTariffs() {
        if (!this.tariffGrid) return;

        let html = '';

        this.tariffs.forEach(tariff => {
            const typeInfo = window.AstroTypes?.[tariff.code] || {
                icon: 'fas fa-star',
                name: tariff.name,
                description: tariff.description,
                features: this.getTariffFeatures(tariff.code),
                category: 'calculations'
            };

            let cardClass = 'tariff-card';
            let isLocked = false;
            let clickHandler = `astrologyApp.selectTariff('${tariff.code}')`;

            if (!this.user && tariff.price > 0) {
                cardClass += ' locked';
                isLocked = true;
                clickHandler = `astrologyApp.showAuthModal()`;
            }
            if (tariff.price === 0) cardClass += ' free';
            if (this.selectedTariff?.code === tariff.code) cardClass += ' selected';

            html += `
            <div class="${cardClass}" onclick="${clickHandler}" data-category="${typeInfo.category}">
                ${isLocked ? '<div class="lock-overlay-small"><i class="fas fa-lock"></i></div>' : ''}
                <div class="tariff-icon"><i class="${typeInfo.icon}"></i></div>
                <h3 class="tariff-name">${typeInfo.name}</h3>
                <p class="tariff-description">${typeInfo.description}</p>
                <div class="tariff-price">${tariff.price === 0 ? '<span class="price-free">Бесплатно</span>' : `<span class="price-current">${tariff.price} ₽</span>`}</div>
                <button class="btn-preview" onclick="event.stopPropagation(); astrologyApp.showPreview('${tariff.code}')">
                    <i class="fas fa-eye"></i> Предпросмотр
                </button>
                <ul class="tariff-features">${typeInfo.features.map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('')}</ul>
                <button class="btn-select ${isLocked ? 'locked' : ''}">${isLocked ? 'Войти и выбрать' : 'Выбрать'}</button>
            </div>
            `;
        });

        this.tariffGrid.innerHTML = html;
    }

    getTariffFeatures(code) {
        const features = {
            'natal_basic': ['Асцендент', 'Солнце (сущность, эго)', 'Луна (эмоции, подсознание)', 'Базовое положение планет', 'Баланс стихий'],
            'natal_standard': ['Всё из базового', 'Все 10 планет в знаках и домах', 'Анализ домов', 'Ключевые аспекты', 'Психологический портрет', 'Рекомендации'],
            'natal_full': ['Всё из стандартного', 'Детальный разбор всех аспектов', 'Пирамида потребностей (Маслоу)', 'Жизненные сценарии', 'Бизнес и карьерные рекомендации', 'Анализ здоровья'],
            'natal_premium': ['Всё из глубокого анализа', 'Кармический анализ', 'Транзитный прогноз на 3 месяца', 'Персональные рекомендации', 'Аффирмация дня', 'Скачивание PDF-отчета']
        };
        return features[code] || ['Все основные расчеты'];
    }

    selectTariff(tariffCode) {
        const tariff = this.tariffs.find(t => t.code === tariffCode);
        if (!tariff) return;
        this.selectedTariff = tariff;

        const titleEl = document.getElementById('selectedTariffTitle');
        const descEl = document.getElementById('selectedTariffDescription');
        const priceEl = document.getElementById('selectedTariffPrice');

        if (titleEl) titleEl.textContent = tariff.name;
        if (descEl) descEl.textContent = tariff.description;
        if (priceEl) {
            priceEl.innerHTML = tariff.price === 0 ?
                '<span class="price-free">Бесплатно</span>' :
                `<span class="price-current">${tariff.price} ₽</span>`;
        }

        if (this.tariffSection) this.tariffSection.style.display = 'none';
        if (this.inputSection) this.inputSection.style.display = 'block';

        this.renderTariffs();
    }

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
                <button class="auth-modal-close" onclick="this.closest('.auth-modal').remove()"><i class="fas fa-times"></i></button>
            </div>
        `;
        document.body.appendChild(modal);
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
    }

    showPreview(tariffCode) {
        if (!window.astrologyPreviewRenderer || !window.astrologyPreviewData) {
            console.error('Preview renderer or data not loaded');
            this.showNotification('Ошибка загрузки предпросмотра', 'error');
            return;
        }

        let demoData = null;
        const dataMap = {
            'natal_basic': window.astrologyPreviewData?.basic,
            'natal_standard': window.astrologyPreviewData?.standard,
            'natal_full': window.astrologyPreviewData?.full,
            'natal_premium': window.astrologyPreviewData?.premium
        };
        demoData = dataMap[tariffCode] || window.astrologyPreviewData?.basic;

        if (!demoData) {
            this.showNotification('Демо-данные для этого тарифа не найдены', 'error');
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'preview-modal preview-full-modal';
        modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); backdrop-filter: blur(10px); z-index: 10000; display: flex; align-items: center; justify-content: center;`;

        const tariffName = window.astrologyPreviewRenderer.getTariffName(tariffCode);

        modal.innerHTML = `
        <div class="preview-content full-report" style="max-width:95%; width:1000px; max-height:90vh; background:linear-gradient(135deg,#12121a,#0a0a0f); border:1px solid rgba(201,165,75,0.3); border-radius:30px; overflow:hidden; display:flex; flex-direction:column;">
            <div class="preview-header" style="padding:20px 30px; background:linear-gradient(135deg,rgba(201,165,75,0.1),rgba(0,0,0,0.3)); border-bottom:1px solid rgba(201,165,75,0.2); display:flex; justify-content:space-between; align-items:center;">
                <div><h3 style="margin:0; color:var(--primary);">${tariffName}</h3><p style="margin:5px 0 0; color:var(--text-muted);">Демонстрационный отчет | ${this.user?.fullName || 'Иванов Иван Иванович'} | 02.06.1993 08:05</p></div>
                <button class="preview-close" style="background:none; border:none; color:var(--text-muted); font-size:28px; cursor:pointer;">&times;</button>
            </div>
            <div class="preview-body" style="padding:20px 30px; overflow-y:auto; flex:1; background:linear-gradient(135deg,#0a0a0f,#12121a);">
                ${window.astrologyPreviewRenderer.generateFullReportHTML(demoData, tariffCode)}
            </div>
            <div class="preview-footer" style="padding:20px 30px; border-top:1px solid rgba(201,165,75,0.2); display:flex; justify-content:center; gap:15px;">
                <button class="btn-select-preview" style="padding:12px 30px; background:var(--primary-gradient); border:none; border-radius:50px; color:var(--dark); font-weight:600; cursor:pointer;" onclick="astrologyApp.selectTariff('${tariffCode}'); document.querySelector('.preview-modal')?.remove()"><i class="fas fa-shopping-cart"></i> Выбрать этот расчет</button>
                <button class="btn-close-preview" style="padding:12px 30px; background:transparent; border:1px solid var(--border-color); border-radius:50px; color:var(--text-secondary); cursor:pointer;">Закрыть</button>
            </div>
        </div>
        `;

        document.body.appendChild(modal);

        // Отрисовка натальной карты в превью
        setTimeout(() => {
            const canvas = modal.querySelector('#previewNatalChartCanvas');
            if (canvas && demoData.data?.chartData) {
                try {
                    const previewDraw = new NatalChartDraw('previewNatalChartCanvas');
                    previewDraw.draw(demoData.data.chartData);
                } catch (error) {
                    console.error('Ошибка отрисовки натальной карты в превью:', error);
                }
            }
        }, 100);

        modal.querySelector('.preview-close')?.addEventListener('click', () => modal.remove());
        modal.querySelector('.btn-close-preview')?.addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
    }

    updateAuthUI() {
        if (this.user) {
            if (this.guestBlock) this.guestBlock.style.display = 'none';
            if (this.tariffSection) this.tariffSection.style.display = 'block';
        } else {
            if (this.guestBlock) this.guestBlock.style.display = 'block';
            if (this.tariffSection) this.tariffSection.style.display = 'block';
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
                autofix: true
            });
        }
    }

    initCitySearch() {
        const birthPlaceInput = document.getElementById('birthPlace');
        const suggestionsContainer = document.getElementById('citySuggestions');
        const latitudeInput = document.getElementById('latitude');
        const longitudeInput = document.getElementById('longitude');
        const searchButton = document.getElementById('searchCity');
        let searchTimeout = null;

        if (birthPlaceInput) {
            birthPlaceInput.addEventListener('input', (e) => {
                const query = e.target.value.trim();
                if (latitudeInput) latitudeInput.value = '';
                if (longitudeInput) longitudeInput.value = '';
                if (searchTimeout) clearTimeout(searchTimeout);
                if (query.length >= 2) {
                    searchTimeout = setTimeout(() => this.searchCity(query), 500);
                } else {
                    if (suggestionsContainer) suggestionsContainer.style.display = 'none';
                }
            });
            document.addEventListener('click', (e) => {
                if (suggestionsContainer && !birthPlaceInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
                    suggestionsContainer.style.display = 'none';
                }
            });
        }
        if (searchButton) {
            searchButton.addEventListener('click', async () => {
                const city = birthPlaceInput?.value.trim();
                if (!city || city.length < 2) { this.showNotification('Введите название города', 'error'); return; }
                await this.searchCity(city);
            });
        }
    }

    async searchCity(query) {
        const suggestionsContainer = document.getElementById('citySuggestions');
        try {
            const response = await fetch(`/api/geocode/search?q=${encodeURIComponent(query)}&limit=5`);
            if (!response.ok) throw new Error('Ошибка сети');
            const data = await response.json();
            if (data && data.length > 0) {
                this.displaySuggestions(data);
            } else {
                if (suggestionsContainer) suggestionsContainer.style.display = 'none';
                this.showNotification('Город не найден', 'error');
            }
        } catch (error) {
            console.error('Ошибка поиска города:', error);
            if (suggestionsContainer) suggestionsContainer.style.display = 'none';
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
            item.innerHTML = `<div class="suggestion-main">${this.escapeHtml(cityName)}</div><div class="suggestion-detail">${this.escapeHtml(region)} ${this.escapeHtml(country)}</div>`;
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

    addEventListeners() {
        if (this.form) this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        document.getElementById('newCalculationBtn')?.addEventListener('click', () => this.resetForm());
        document.getElementById('downloadPdfBtn')?.addEventListener('click', () => this.downloadPDF());
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

        if (!this.user && this.selectedTariff?.price > 0) {
            this.showAuthModal();
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
                houseSystem,
                tariffCode: this.selectedTariff?.code || 'natal_basic'
            };

            const response = await fetch('/api/astrology/calculate', {
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
        const resultTypeEl = document.getElementById('resultType');
        const resultBadgeEl = document.getElementById('resultBadge');

        if (resultTypeEl) {
            resultTypeEl.textContent = `🔮 ${this.selectedTariff?.name || 'Натальная карта'}`;
        }
        if (resultBadgeEl) {
            resultBadgeEl.innerHTML = `<span class="result-badge">${this.selectedTariff?.name || 'Расчет'}</span>`;
        }

        document.getElementById('resultName').textContent = data.fullName || '—';
        document.getElementById('resultDate').textContent = data.birthDate || '—';
        document.getElementById('resultTime').textContent = data.birthTime || '—';

        if (this.chartDraw && data.chartData) {
            this.chartDraw.draw({
                planets: data.planets,
                houses: data.houses,
                aspects: data.aspects,
                chartData: data.chartData
            });
        }

        if (data.htmlBlocks) {
            const enrichedPlanetsInfo = document.getElementById('enrichedPlanetsInfo');
            const enrichedHousesInfo = document.getElementById('enrichedHousesInfo');
            const enrichedAspectsInfo = document.getElementById('enrichedAspectsInfo');
            const planetLegend = document.getElementById('planetLegend');
            const planetPositions = document.getElementById('planetPositions');
            const aspectsList = document.getElementById('aspectsList');
            const natalInterpretation = document.getElementById('natalInterpretation');
            const expandedReport = document.getElementById('expandedReport');

            if (enrichedPlanetsInfo) enrichedPlanetsInfo.innerHTML = data.htmlBlocks.enrichedPlanetsInfo || '';
            if (enrichedHousesInfo) enrichedHousesInfo.innerHTML = data.htmlBlocks.enrichedHousesInfo || '';
            if (enrichedAspectsInfo) enrichedAspectsInfo.innerHTML = data.htmlBlocks.enrichedAspectsInfo || '';
            if (planetLegend) planetLegend.innerHTML = data.htmlBlocks.legend || '';
            if (planetPositions) planetPositions.innerHTML = data.htmlBlocks.planetPositions || '';
            if (aspectsList) aspectsList.innerHTML = data.htmlBlocks.aspectsList || '';
            if (natalInterpretation) natalInterpretation.innerHTML = data.htmlBlocks.interpretation || '';
            if (expandedReport) expandedReport.innerHTML = data.htmlBlocks.expandedReport || '';
        }

        const downloadBtn = document.getElementById('downloadPdfBtn');
        if (downloadBtn && this.user && this.selectedTariff?.price > 0) {
            downloadBtn.style.display = 'inline-flex';
        } else if (downloadBtn) {
            downloadBtn.style.display = 'none';
        }

        if (this.inputSection) this.inputSection.style.display = 'none';
        if (this.resultSection) {
            this.resultSection.style.display = 'block';
            this.resultSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    async downloadPDF() {
        try {
            if (!window.currentCalculationId) {
                this.showNotification('Сначала выполните расчет', 'error');
                return;
            }
            this.showNotification('Генерируем PDF отчет...', 'info');
            const response = await fetch(`/api/astrology/pdf/${window.currentCalculationId}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (!response.ok) throw new Error(`Ошибка ${response.status}`);
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

    resetForm() {
        if (this.resultSection) this.resultSection.style.display = 'none';
        if (this.tariffSection) this.tariffSection.style.display = 'block';
        if (this.inputSection) this.inputSection.style.display = 'none';
        this.selectedTariff = null;
        if (this.form) this.form.reset();
        const timeInput = document.getElementById('birthTime');
        if (timeInput) timeInput.value = '12:00';
        const latInput = document.getElementById('latitude');
        const lonInput = document.getElementById('longitude');
        if (latInput) latInput.value = '';
        if (lonInput) lonInput.value = '';
        this.renderTariffs();
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            return dateStr;
        }
        // Если в формате DD.MM.YYYY, преобразуем
        const [day, month, year] = dateStr.split('.');
        return `${year}-${month}-${day}`;
    }

    showLoading(show) {
        if (this.loadingSpinner) this.loadingSpinner.style.display = show ? 'flex' : 'none';
        if (this.form) {
            this.form.style.opacity = show ? '0.5' : '1';
            this.form.style.pointerEvents = show ? 'none' : 'auto';
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `<i class="fas fa-${type === 'error' ? 'exclamation-circle' : type === 'success' ? 'check-circle' : 'info-circle'}"></i><span>${this.escapeHtml(message)}</span>`;
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
                <p class="balance-info">Баланс: <strong>${errorData.balance || 0} ₽</strong><br>Требуется: <strong>${errorData.required || errorData.price || 0} ₽</strong></p>
                <div class="modal-actions">
                    <a href="/cabinet/balance" class="btn btn-primary">Пополнить баланс</a>
                    <button class="btn btn-outline" onclick="this.closest('.payment-modal').remove()">Закрыть</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
    }

    escapeHtml(str) {
        if (!str) return '';
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
}

const astrologyApp = new AstrologyApp();
window.astrologyApp = astrologyApp;