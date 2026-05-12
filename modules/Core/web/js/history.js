// modules/Core/web/js/history.js

class HistoryApp {
    constructor() {
        this.currentPage = 1;
        this.limit = 10;
        this.totalPages = 1;
        this.totalCount = 0;
        this.filters = {
            type: 'all',
            dateFrom: '',
            dateTo: ''
        };
        this.currentCalculation = null;

        this.init();
    }

    async init() {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login';
            return;
        }

        await this.loadUserData();
        this.initEventListeners();
        await this.loadHistory();
    }

    async loadUserData() {
        const token = localStorage.getItem('token');

        try {
            const response = await fetch('/api/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (window.cabinetApp) {
                    window.cabinetApp.user = data.data.user;
                    window.cabinetApp.updateUI();
                }
            } else if (response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }

    initEventListeners() {
        const filterType = document.getElementById('filterType');
        const filterDateFrom = document.getElementById('filterDateFrom');
        const filterDateTo = document.getElementById('filterDateTo');

        if (filterType) filterType.addEventListener('change', () => this.applyFilters());
        if (filterDateFrom) filterDateFrom.addEventListener('change', () => this.applyFilters());
        if (filterDateTo) filterDateTo.addEventListener('change', () => this.applyFilters());

        window.addEventListener('click', (e) => {
            const modal = document.getElementById('calculationModal');
            if (e.target === modal) {
                this.closeModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    async loadHistory() {
        const list = document.getElementById('calculationsList');
        if (!list) return;

        list.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Загрузка...</div>';

        try {
            const params = new URLSearchParams({
                page: this.currentPage,
                limit: this.limit
            });

            if (this.filters.type && this.filters.type !== 'all') {
                params.append('type', this.filters.type);
            }
            if (this.filters.dateFrom) {
                params.append('dateFrom', this.filters.dateFrom);
            }
            if (this.filters.dateTo) {
                params.append('dateTo', this.filters.dateTo);
            }

            const response = await fetch(`/api/calculations?${params}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.renderCalculations(data.data);
            } else {
                list.innerHTML = '<div class="error-message">Ошибка загрузки данных</div>';
            }
        } catch (error) {
            console.error('Error loading history:', error);
            list.innerHTML = '<div class="error-message">Ошибка соединения</div>';
        }
    }

    renderCalculations(data) {
        const list = document.getElementById('calculationsList');
        const totalSpan = document.getElementById('totalCount');

        this.totalCount = data.total;
        this.totalPages = data.totalPages;

        if (totalSpan) totalSpan.textContent = data.total;

        if (!data.calculations || data.calculations.length === 0) {
            list.innerHTML = '<div class="empty-message"><i class="fas fa-history"></i><p>У вас пока нет расчетов</p></div>';
            this.renderPagination();
            return;
        }

        list.innerHTML = data.calculations.map(calc => `
            <div class="calculation-item" data-calculation-id="${calc.id}" data-calculation-type="${calc.calculationType}">
                <div class="calc-icon">
                    ${this.getCalculationIcon(calc.calculationType)}
                </div>
                <div class="calc-info">
                    <div class="calc-name">${this.getCalculationName(calc)}</div>
                    <div class="calc-date">
                        <i class="fas fa-calendar-alt"></i> ${new Date(calc.createdAt).toLocaleString()}
                    </div>
                    ${calc.targetDate ? `
                        <div class="calc-target">
                            <i class="fas fa-clock"></i> На дату: ${this.formatDate(calc.targetDate)}
                        </div>
                    ` : ''}
                </div>
                <div class="calc-price">-${parseFloat(calc.price).toLocaleString()} ₽</div>
                <button class="btn-view" onclick="event.stopPropagation(); historyApp.viewCalculation('${calc.id}')">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
        `).join('');

        document.querySelectorAll('.calculation-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (e.target.closest('.btn-view')) return;
                const id = item.dataset.calculationId;
                this.viewCalculation(id);
            });
        });

        this.renderPagination();
    }

    getCalculationIcon(type) {
        const icons = {
            'basic': '🔮',
            'full': '⭐',
            'day': '📅',
            'week': '📆',
            'month': '📊',
            'year': '📈',
            'compatibility': '💑'
        };
        return icons[type] || '🔮';
    }

    getCalculationName(calc) {
        const names = {
            'basic': 'Базовый расчет',
            'full': 'Полный расчет',
            'day': 'Прогноз на день',
            'week': 'Прогноз на неделю',
            'month': 'Прогноз на месяц',
            'year': 'Прогноз на год',
            'compatibility': 'Совместимость'
        };

        if (calc.service && calc.service.name) {
            return calc.service.name;
        }
        return names[calc.calculationType] || 'Расчет';
    }

    formatDate(dateStr) {
        if (!dateStr) return '';
        const [year, month, day] = dateStr.split('-');
        return `${day}.${month}.${year}`;
    }

    renderPagination() {
        const pagination = document.getElementById('pagination');
        if (!pagination) return;

        if (this.totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        let html = '<div class="pagination-controls">';

        html += `<button onclick="historyApp.goToPage(1)" ${this.currentPage === 1 ? 'disabled' : ''}>
            <i class="fas fa-angle-double-left"></i>
        </button>`;

        html += `<button onclick="historyApp.goToPage(${this.currentPage - 1})" ${this.currentPage === 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i>
        </button>`;

        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(this.totalPages, this.currentPage + 2);

        for (let i = startPage; i <= endPage; i++) {
            html += `<button onclick="historyApp.goToPage(${i})" ${this.currentPage === i ? 'disabled style="background: var(--primary-gradient); color: #1a1a24;"' : ''}>
                ${i}
            </button>`;
        }

        html += `<button onclick="historyApp.goToPage(${this.currentPage + 1})" ${this.currentPage === this.totalPages ? 'disabled' : ''}>
            <i class="fas fa-chevron-right"></i>
        </button>`;

        html += `<button onclick="historyApp.goToPage(${this.totalPages})" ${this.currentPage === this.totalPages ? 'disabled' : ''}>
            <i class="fas fa-angle-double-right"></i>
        </button>`;

        html += `<span class="page-info">${this.currentPage} / ${this.totalPages}</span>`;
        html += '</div>';

        pagination.innerHTML = html;
    }

    goToPage(page) {
        if (page < 1 || page > this.totalPages) return;
        this.currentPage = page;
        this.loadHistory();
    }

    applyFilters() {
        const filterType = document.getElementById('filterType');
        const filterDateFrom = document.getElementById('filterDateFrom');
        const filterDateTo = document.getElementById('filterDateTo');

        this.filters.type = filterType?.value || 'all';
        this.filters.dateFrom = filterDateFrom?.value || '';
        this.filters.dateTo = filterDateTo?.value || '';
        this.currentPage = 1;
        this.loadHistory();
    }

    resetFilters() {
        const filterType = document.getElementById('filterType');
        const filterDateFrom = document.getElementById('filterDateFrom');
        const filterDateTo = document.getElementById('filterDateTo');

        if (filterType) filterType.value = 'all';
        if (filterDateFrom) filterDateFrom.value = '';
        if (filterDateTo) filterDateTo.value = '';

        this.filters = {
            type: 'all',
            dateFrom: '',
            dateTo: ''
        };
        this.currentPage = 1;
        this.loadHistory();
    }

    async viewCalculation(id) {
        try {
            this.showNotification('Загрузка расчета...', 'info');

            const response = await fetch(`/api/calculations/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.currentCalculation = data.data;
                this.showCalculationModal(data.data);
            } else {
                this.showNotification('Ошибка загрузки расчета', 'error');
            }
        } catch (error) {
            console.error('Error loading calculation:', error);
            this.showNotification('Ошибка соединения', 'error');
        }
    }

    showCalculationModal(calculation) {
        const modal = document.getElementById('calculationModal');
        const body = document.getElementById('modalBody');
        const title = document.getElementById('modalTitle');

        if (!modal || !body) return;

        title.textContent = this.getCalculationName(calculation);

        const result = calculation.result || {};
        const calcType = calculation.calculationType;

        let html = '';

        html += `
            <div class="modal-report-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid var(--border-color); flex-wrap: wrap; gap: 15px;">
                <div class="report-badge ${calcType}" style="display: inline-flex; align-items: center; gap: 8px; padding: 8px 20px; background: linear-gradient(135deg, rgba(201, 165, 75, 0.2), rgba(201, 165, 75, 0.1)); border: 1px solid var(--primary); border-radius: 40px;">
                    ${this.getCalculationIcon(calcType)} ${this.getCalculationName(calculation)}
                </div>
                <button class="btn-download-pdf" onclick="historyApp.downloadPDF('${calculation.id}', '${calcType}')" style="background: transparent; border: 1px solid var(--primary); color: var(--primary); padding: 8px 20px; border-radius: 30px; font-size: 0.9rem; font-weight: 500; cursor: pointer; transition: all 0.3s ease; display: inline-flex; align-items: center; gap: 8px;">
                    <i class="fas fa-file-pdf"></i> Скачать PDF
                </button>
            </div>
        `;

        html += `
            <div class="person-info-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 25px;">
                <div class="person-info-card" style="background: rgba(18, 18, 26, 0.5); padding: 15px; border-radius: 12px; display: flex; align-items: center; gap: 12px;">
                    <i class="fas fa-user" style="color: var(--primary); font-size: 1.2rem;"></i>
                    <div>
                        <div style="color: var(--text-muted); font-size: 0.8rem;">Ищущий</div>
                        <div style="color: var(--text-primary); font-weight: 600;">${result.fullName || 'Не указано'}</div>
                    </div>
                </div>
                <div class="person-info-card" style="background: rgba(18, 18, 26, 0.5); padding: 15px; border-radius: 12px; display: flex; align-items: center; gap: 12px;">
                    <i class="fas fa-calendar-alt" style="color: var(--primary); font-size: 1.2rem;"></i>
                    <div>
                        <div style="color: var(--text-muted); font-size: 0.8rem;">Дата рождения</div>
                        <div style="color: var(--text-primary); font-weight: 600;">${result.birthDate || '—'}</div>
                    </div>
                </div>
                <div class="person-info-card" style="background: rgba(18, 18, 26, 0.5); padding: 15px; border-radius: 12px; display: flex; align-items: center; gap: 12px;">
                    <i class="fas fa-clock" style="color: var(--primary); font-size: 1.2rem;"></i>
                    <div>
                        <div style="color: var(--text-muted); font-size: 0.8rem;">Дата расчета</div>
                        <div style="color: var(--text-primary); font-weight: 600;">${new Date(calculation.createdAt).toLocaleDateString()}</div>
                    </div>
                </div>
                ${calculation.targetDate ? `
                <div class="person-info-card" style="background: rgba(18, 18, 26, 0.5); padding: 15px; border-radius: 12px; display: flex; align-items: center; gap: 12px;">
                    <i class="fas fa-calendar-check" style="color: var(--primary); font-size: 1.2rem;"></i>
                    <div>
                        <div style="color: var(--text-muted); font-size: 0.8rem;">Дата прогноза</div>
                        <div style="color: var(--text-primary); font-weight: 600;">${this.formatDate(calculation.targetDate)}</div>
                    </div>
                </div>
                ` : ''}
                <div class="person-info-card" style="background: rgba(18, 18, 26, 0.5); padding: 15px; border-radius: 12px; display: flex; align-items: center; gap: 12px;">
                    <i class="fas fa-coins" style="color: var(--primary); font-size: 1.2rem;"></i>
                    <div>
                        <div style="color: var(--text-muted); font-size: 0.8rem;">Стоимость</div>
                        <div style="color: var(--text-primary); font-weight: 600;">${parseFloat(calculation.price).toLocaleString()} ₽</div>
                    </div>
                </div>
            </div>
        `;

        if (calcType === 'full' && result.numerology) {
            html += this.renderFullReport(result);
        } else if (calcType === 'day' && result.forecast) {
            html += this.renderDayForecastModal(result);
        } else if (calcType === 'week' && result.forecast) {
            html += this.renderWeekForecastModal(result);
        } else if (calcType === 'month' && result.forecast) {
            html += this.renderMonthForecastModal(result);
        } else if (calcType === 'year' && result.forecast) {
            html += this.renderYearForecastModal(result);
        } else if (calcType === 'compatibility' && result.compatibility) {
            html += this.renderCompatibilityModal(result);
        } else if (result.numerology) {
            html += this.renderBasicReportModal(result);
        } else {
            html += `<pre class="result-content" style="background: rgba(18, 18, 26, 0.5); padding: 20px; border-radius: 16px; overflow-x: auto;">${JSON.stringify(result, null, 2)}</pre>`;
        }

        body.innerHTML = html;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    renderBasicReportModal(result) {
        const numerology = result.numerology || {};
        const base = numerology.base || {};
        const achilles = numerology.achilles || {};
        const control = numerology.control || {};
        const calls = numerology.calls || {};

        let html = `
            <div class="report-section" style="margin-bottom: 30px;">
                <h3 class="section-title" style="color: var(--primary); border-bottom: 1px solid var(--border-color); padding-bottom: 10px; margin-bottom: 20px;">
                    <i class="fas fa-calculator"></i> МАТРИЦА СУДЬБЫ
                </h3>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                    <div style="text-align: center; padding: 20px; background: rgba(18, 18, 26, 0.5); border-radius: 16px;">
                        <div style="font-size: 3rem; font-weight: bold; color: var(--primary);">${base.fate || '?'}</div>
                        <div style="color: var(--text-muted);">Число судьбы</div>
                    </div>
                    <div style="text-align: center; padding: 20px; background: rgba(18, 18, 26, 0.5); border-radius: 16px;">
                        <div style="font-size: 3rem; font-weight: bold; color: var(--primary);">${base.name || '?'}</div>
                        <div style="color: var(--text-muted);">Число имени</div>
                    </div>
                    <div style="text-align: center; padding: 20px; background: rgba(18, 18, 26, 0.5); border-radius: 16px;">
                        <div style="font-size: 3rem; font-weight: bold; color: var(--primary);">${base.surname || '?'}</div>
                        <div style="color: var(--text-muted);">Число рода</div>
                    </div>
                    <div style="text-align: center; padding: 20px; background: rgba(18, 18, 26, 0.5); border-radius: 16px;">
                        <div style="font-size: 3rem; font-weight: bold; color: var(--primary);">${base.patronymic || '?'}</div>
                        <div style="color: var(--text-muted);">Число предков</div>
                    </div>
                </div>
            </div>
            
            <div class="report-section" style="margin-bottom: 30px;">
                <h3 class="section-title" style="color: var(--primary); border-bottom: 1px solid var(--border-color); padding-bottom: 10px; margin-bottom: 20px;">
                    <i class="fas fa-shield-alt"></i> КЛЮЧЕВЫЕ ЧИСЛА
                </h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div style="background: rgba(201, 165, 75, 0.1); border-radius: 20px; padding: 25px; text-align: center;">
                        <div style="font-size: 2.5rem; font-weight: bold; color: var(--primary);">${achilles.number || '?'}</div>
                        <div style="color: var(--text-muted); margin-bottom: 10px;">Ахиллесова пята</div>
                        <div style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6;">${achilles.description || ''}</div>
                    </div>
                    <div style="background: rgba(201, 165, 75, 0.1); border-radius: 20px; padding: 25px; text-align: center;">
                        <div style="font-size: 2.5rem; font-weight: bold; color: var(--primary);">${control.number || '?'}</div>
                        <div style="color: var(--text-muted); margin-bottom: 10px;">Число управления</div>
                        <div style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6;">${control.description || ''}</div>
                    </div>
                </div>
            </div>
            
            <div class="report-section" style="margin-bottom: 30px;">
                <h3 class="section-title" style="color: var(--primary); border-bottom: 1px solid var(--border-color); padding-bottom: 10px; margin-bottom: 20px;">
                    <i class="fas fa-users"></i> СОЦИАЛЬНЫЕ ОКЛИКИ
                </h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px;">
                    <div style="background: rgba(18, 18, 26, 0.5); border-radius: 16px; padding: 20px; text-align: center;">
                        <div style="font-size: 2rem; font-weight: bold; color: var(--primary);">${calls.close || '?'}</div>
                        <div style="color: var(--text-muted); margin-bottom: 10px;">Близкий круг</div>
                        <div style="color: var(--text-secondary); font-size: 0.85rem;">${(calls.descriptions?.close || '').substring(0, 100)}...</div>
                    </div>
                    <div style="background: rgba(18, 18, 26, 0.5); border-radius: 16px; padding: 20px; text-align: center;">
                        <div style="font-size: 2rem; font-weight: bold; color: var(--primary);">${calls.social || '?'}</div>
                        <div style="color: var(--text-muted); margin-bottom: 10px;">Социум</div>
                        <div style="color: var(--text-secondary); font-size: 0.85rem;">${(calls.descriptions?.social || '').substring(0, 100)}...</div>
                    </div>
                    <div style="background: rgba(18, 18, 26, 0.5); border-radius: 16px; padding: 20px; text-align: center;">
                        <div style="font-size: 2rem; font-weight: bold; color: var(--primary);">${calls.world || '?'}</div>
                        <div style="color: var(--text-muted); margin-bottom: 10px;">Дальний круг</div>
                        <div style="color: var(--text-secondary); font-size: 0.85rem;">${(calls.descriptions?.world || '').substring(0, 100)}...</div>
                    </div>
                </div>
            </div>
        `;

        if (result.interpretation) {
            html += `
                <div class="report-section" style="margin-bottom: 30px;">
                    <h3 class="section-title" style="color: var(--primary); border-bottom: 1px solid var(--border-color); padding-bottom: 10px; margin-bottom: 20px;">
                        <i class="fas fa-scroll"></i> СВИТОК СУДЬБЫ
                    </h3>
                    <div style="background: rgba(18, 18, 26, 0.5); padding: 20px; border-radius: 16px; line-height: 1.8; color: var(--text-secondary);">
                        ${result.interpretation.split('\n').map(p => `<p>${p}</p>`).join('')}
                    </div>
                </div>
            `;
        }

        if (result.deepPortrait) {
            html += `
                <div class="report-section">
                    <h3 class="section-title" style="color: var(--primary); border-bottom: 1px solid var(--border-color); padding-bottom: 10px; margin-bottom: 20px;">
                        <i class="fas fa-moon"></i> ГЛУБИННЫЙ ПОРТРЕТ
                    </h3>
                    <div style="background: rgba(18, 18, 26, 0.5); padding: 20px; border-radius: 16px; line-height: 1.8; color: var(--text-secondary);">
                        ${result.deepPortrait.split('\n').map(p => `<p>${p}</p>`).join('')}
                    </div>
                </div>
            `;
        }

        return html;
    }

    renderFullReport(result) {
        const numerology = result.numerology || {};
        const base = numerology.base || {};
        const achilles = numerology.achilles || {};
        const control = numerology.control || {};
        const calls = numerology.calls || {};
        const interpretations = numerology.interpretations || {};
        const zodiac = result.zodiac || {};
        const fengShui = result.fengShui || {};
        const tarot = result.tarot || {};
        const psychology = result.psychology || {};
        const patterns = result.patterns || [];

        let html = `
            <div class="report-section" style="margin-bottom: 30px;">
                <h3 class="section-title" style="color: var(--primary); border-bottom: 1px solid var(--border-color); padding-bottom: 10px; margin-bottom: 20px;">
                    <i class="fas fa-calculator"></i> МАТРИЦА СУДЬБЫ
                </h3>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                    <div style="text-align: center; padding: 20px; background: rgba(18, 18, 26, 0.5); border-radius: 16px;">
                        <div style="font-size: 3rem; font-weight: bold; color: var(--primary);">${base.fate || '?'}</div>
                        <div style="color: var(--text-muted);">Число судьбы</div>
                    </div>
                    <div style="text-align: center; padding: 20px; background: rgba(18, 18, 26, 0.5); border-radius: 16px;">
                        <div style="font-size: 3rem; font-weight: bold; color: var(--primary);">${base.name || '?'}</div>
                        <div style="color: var(--text-muted);">Число имени</div>
                    </div>
                    <div style="text-align: center; padding: 20px; background: rgba(18, 18, 26, 0.5); border-radius: 16px;">
                        <div style="font-size: 3rem; font-weight: bold; color: var(--primary);">${base.surname || '?'}</div>
                        <div style="color: var(--text-muted);">Число рода</div>
                    </div>
                    <div style="text-align: center; padding: 20px; background: rgba(18, 18, 26, 0.5); border-radius: 16px;">
                        <div style="font-size: 3rem; font-weight: bold; color: var(--primary);">${base.patronymic || '?'}</div>
                        <div style="color: var(--text-muted);">Число предков</div>
                    </div>
                </div>
            </div>
            
            <div class="report-section" style="margin-bottom: 30px;">
                <h3 class="section-title" style="color: var(--primary); border-bottom: 1px solid var(--border-color); padding-bottom: 10px; margin-bottom: 20px;">
                    <i class="fas fa-shield-alt"></i> КЛЮЧЕВЫЕ ЧИСЛА
                </h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div style="background: rgba(201, 165, 75, 0.1); border-radius: 20px; padding: 25px; text-align: center;">
                        <div style="font-size: 2.5rem; font-weight: bold; color: var(--primary);">${achilles.number || '?'}</div>
                        <div style="color: var(--text-muted); margin-bottom: 10px;">Ахиллесова пята</div>
                        <div style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6;">${achilles.description || ''}</div>
                    </div>
                    <div style="background: rgba(201, 165, 75, 0.1); border-radius: 20px; padding: 25px; text-align: center;">
                        <div style="font-size: 2.5rem; font-weight: bold; color: var(--primary);">${control.number || '?'}</div>
                        <div style="color: var(--text-muted); margin-bottom: 10px;">Число управления</div>
                        <div style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6;">${control.description || ''}</div>
                    </div>
                </div>
            </div>
            
            <div class="report-section" style="margin-bottom: 30px;">
                <h3 class="section-title" style="color: var(--primary); border-bottom: 1px solid var(--border-color); padding-bottom: 10px; margin-bottom: 20px;">
                    <i class="fas fa-users"></i> СОЦИАЛЬНЫЕ ОКЛИКИ
                </h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px;">
                    <div style="background: rgba(18, 18, 26, 0.5); border-radius: 16px; padding: 20px; text-align: center;">
                        <div style="font-size: 2rem; font-weight: bold; color: var(--primary);">${calls.close || '?'}</div>
                        <div style="color: var(--text-muted); margin-bottom: 10px;">Близкий круг</div>
                        <div style="color: var(--text-secondary); font-size: 0.85rem;">${calls.descriptions?.close || ''}</div>
                    </div>
                    <div style="background: rgba(18, 18, 26, 0.5); border-radius: 16px; padding: 20px; text-align: center;">
                        <div style="font-size: 2rem; font-weight: bold; color: var(--primary);">${calls.social || '?'}</div>
                        <div style="color: var(--text-muted); margin-bottom: 10px;">Социум</div>
                        <div style="color: var(--text-secondary); font-size: 0.85rem;">${calls.descriptions?.social || ''}</div>
                    </div>
                    <div style="background: rgba(18, 18, 26, 0.5); border-radius: 16px; padding: 20px; text-align: center;">
                        <div style="font-size: 2rem; font-weight: bold; color: var(--primary);">${calls.world || '?'}</div>
                        <div style="color: var(--text-muted); margin-bottom: 10px;">Дальний круг</div>
                        <div style="color: var(--text-secondary); font-size: 0.85rem;">${calls.descriptions?.world || ''}</div>
                    </div>
                </div>
            </div>
        `;

        // Зодиак
        if (zodiac.name) {
            html += `
                <div class="report-section" style="margin-bottom: 30px;">
                    <h3 class="section-title" style="color: var(--primary); border-bottom: 1px solid var(--border-color); padding-bottom: 10px; margin-bottom: 20px;">
                        <i class="fas fa-star"></i> ЗВЕЗДНЫЙ КОД
                    </h3>
                    <div style="background: rgba(18, 18, 26, 0.5); border-radius: 20px; padding: 25px;">
                        <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 20px;">
                            <div style="font-size: 3rem;">${this.getZodiacSymbol(zodiac.name)}</div>
                            <div>
                                <h4 style="color: var(--primary); margin: 0;">${zodiac.name}</h4>
                                <p style="color: var(--text-muted); margin: 5px 0 0;">${zodiac.element} • ${zodiac.planet}</p>
                            </div>
                        </div>
                        <p style="color: var(--text-secondary); line-height: 1.8;">${zodiac.description || ''}</p>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 20px;">
                            <div><strong style="color: var(--primary);">Сильные стороны:</strong><br><span style="color: var(--text-secondary);">${zodiac.strengths || ''}</span></div>
                            <div><strong style="color: var(--primary);">Зоны роста:</strong><br><span style="color: var(--text-secondary);">${zodiac.weaknesses || ''}</span></div>
                        </div>
                    </div>
                </div>
            `;
        }

        // Фен-шуй
        if (fengShui.element) {
            html += `
                <div class="report-section" style="margin-bottom: 30px;">
                    <h3 class="section-title" style="color: var(--primary); border-bottom: 1px solid var(--border-color); padding-bottom: 10px; margin-bottom: 20px;">
                        <i class="fas fa-wind"></i> ЭНЕРГИЯ ФЕН-ШУЙ
                    </h3>
                    <div style="background: rgba(18, 18, 26, 0.5); border-radius: 20px; padding: 25px;">
                        <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 20px;">
                            <div style="font-size: 3rem;">${this.getElementSymbol(fengShui.element)}</div>
                            <h4 style="color: var(--primary); margin: 0;">${fengShui.element}</h4>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 20px;">
                            <div><strong style="color: var(--primary);">Цвет силы:</strong><br><span style="color: var(--text-secondary);">${fengShui.color || '—'}</span></div>
                            <div><strong style="color: var(--primary);">Направление:</strong><br><span style="color: var(--text-secondary);">${fengShui.direction || '—'}</span></div>
                            <div><strong style="color: var(--primary);">Время активации:</strong><br><span style="color: var(--text-secondary);">${fengShui.season || '—'}</span></div>
                        </div>
                        <p style="color: var(--text-secondary); line-height: 1.8;">${fengShui.description || ''}</p>
                        <div style="background: linear-gradient(135deg, rgba(201, 165, 75, 0.1), rgba(18, 18, 26, 0.5)); padding: 15px; border-radius: 12px; margin-top: 15px;">
                            <p style="color: var(--primary); font-style: italic; margin: 0;">"${fengShui.affirmation || ''}"</p>
                        </div>
                    </div>
                </div>
            `;
        }

        // Таро
        if (tarot.fate) {
            html += `
                <div class="report-section" style="margin-bottom: 30px;">
                    <h3 class="section-title" style="color: var(--primary); border-bottom: 1px solid var(--border-color); padding-bottom: 10px; margin-bottom: 20px;">
                        <i class="fas fa-crown"></i> КАРТЫ ТАРО
                    </h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
                        ${this.renderTarotCardModal('Судьбы', tarot.fate)}
                        ${this.renderTarotCardModal('Личности', tarot.personality)}
                        ${this.renderTarotCardModal('Пути', tarot.control)}
                    </div>
                </div>
            `;
        }

        // Интерпретации (карьера, семья, любовь, финансы, здоровье, таланты)
        if (interpretations.career) {
            html += this.renderInterpretationCard('КАРЬЕРА', interpretations.career);
        }
        if (interpretations.family) {
            html += this.renderInterpretationCard('СЕМЬЯ', interpretations.family);
        }
        if (interpretations.love) {
            html += this.renderInterpretationCard('ЛЮБОВЬ', interpretations.love);
        }
        if (interpretations.money) {
            html += this.renderInterpretationCard('ФИНАНСЫ', interpretations.money);
        }
        if (interpretations.health) {
            html += this.renderInterpretationCard('ЗДОРОВЬЕ', interpretations.health);
        }
        if (interpretations.talent) {
            html += this.renderInterpretationCard('ТАЛАНТЫ', interpretations.talent);
        }

        // Психология
        if (psychology.modality || psychology.archetype) {
            html += `
                <div class="report-section" style="margin-bottom: 30px;">
                    <h3 class="section-title" style="color: var(--primary); border-bottom: 1px solid var(--border-color); padding-bottom: 10px; margin-bottom: 20px;">
                        <i class="fas fa-brain"></i> ПСИХОЛОГИЧЕСКИЙ ПОРТРЕТ
                    </h3>
            `;

            if (psychology.modality) {
                html += `
                    <div style="background: rgba(18, 18, 26, 0.5); border-radius: 16px; padding: 20px; margin-bottom: 20px;">
                        <h4 style="color: var(--primary);">НЛП-профиль: ${psychology.modality.title || ''}</h4>
                        <p style="color: var(--text-secondary);">${psychology.modality.description || ''}</p>
                    </div>
                `;
            }

            if (psychology.archetype) {
                html += `
                    <div style="background: rgba(18, 18, 26, 0.5); border-radius: 16px; padding: 20px; margin-bottom: 20px;">
                        <h4 style="color: var(--primary);">Архетип: ${psychology.archetype.name || ''}</h4>
                        <p style="color: var(--text-secondary);">${psychology.archetype.description || ''}</p>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
                            <div style="background: rgba(76, 175, 80, 0.1); padding: 10px; border-radius: 8px;">
                                <strong style="color: #4caf50;">Дар:</strong> ${psychology.archetype.gift || ''}
                            </div>
                            <div style="background: rgba(244, 67, 54, 0.1); padding: 10px; border-radius: 8px;">
                                <strong style="color: #f44336;">Вызов:</strong> ${psychology.archetype.challenge || ''}
                            </div>
                        </div>
                    </div>
                `;
            }

            if (psychology.attachment) {
                html += `
                    <div style="background: rgba(18, 18, 26, 0.5); border-radius: 16px; padding: 20px;">
                        <h4 style="color: var(--primary);">Тип привязанности: ${psychology.attachment.name || ''}</h4>
                        <p style="color: var(--text-secondary);">${psychology.attachment.description || ''}</p>
                    </div>
                `;
            }

            html += `</div>`;
        }

        // Паттерны
        if (patterns && patterns.length > 0) {
            html += `
                <div class="report-section" style="margin-bottom: 30px;">
                    <h3 class="section-title" style="color: var(--primary); border-bottom: 1px solid var(--border-color); padding-bottom: 10px; margin-bottom: 20px;">
                        <i class="fas fa-puzzle-piece"></i> ПАТТЕРНЫ ЛИЧНОСТИ
                    </h3>
                    <div style="background: rgba(18, 18, 26, 0.5); border-radius: 16px; padding: 20px;">
                        ${patterns.slice(0, 10).map(p => `<p style="margin: 10px 0; padding-left: 20px; border-left: 2px solid var(--primary); color: var(--text-secondary);">✦ ${p}</p>`).join('')}
                    </div>
                </div>
            `;
        }

        // Свиток судьбы
        if (result.interpretation) {
            html += `
                <div class="report-section" style="margin-bottom: 30px;">
                    <h3 class="section-title" style="color: var(--primary); border-bottom: 1px solid var(--border-color); padding-bottom: 10px; margin-bottom: 20px;">
                        <i class="fas fa-scroll"></i> СВИТОК СУДЬБЫ
                    </h3>
                    <div style="background: rgba(18, 18, 26, 0.5); padding: 20px; border-radius: 16px; line-height: 1.8; color: var(--text-secondary);">
                        ${result.interpretation.split('\n').map(p => `<p>${p}</p>`).join('')}
                    </div>
                </div>
            `;
        }

        // Глубинный портрет
        if (result.deepPortrait) {
            html += `
                <div class="report-section">
                    <h3 class="section-title" style="color: var(--primary); border-bottom: 1px solid var(--border-color); padding-bottom: 10px; margin-bottom: 20px;">
                        <i class="fas fa-moon"></i> ГЛУБИННЫЙ ПОРТРЕТ
                    </h3>
                    <div style="background: rgba(18, 18, 26, 0.5); padding: 20px; border-radius: 16px; line-height: 1.8; color: var(--text-secondary);">
                        ${result.deepPortrait.split('\n').map(p => `<p>${p}</p>`).join('')}
                    </div>
                </div>
            `;
        }

        return html;
    }

    renderInterpretationCard(title, data) {
        if (!data) return '';

        return `
            <div class="report-section" style="margin-bottom: 30px;">
                <h3 class="section-title" style="color: var(--primary); border-bottom: 1px solid var(--border-color); padding-bottom: 10px; margin-bottom: 20px;">
                    <i class="fas fa-chart-line"></i> ${title}
                </h3>
                <div style="background: rgba(18, 18, 26, 0.5); border-radius: 20px; padding: 25px;">
                    <h4 style="color: var(--text-primary); margin-bottom: 15px;">${data.title || ''}</h4>
                    <p style="color: var(--text-secondary); line-height: 1.8; margin-bottom: 20px;">${data.description || ''}</p>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                        <div>
                            <strong style="color: #4caf50;">🌟 Сильные стороны</strong>
                            <ul style="margin-top: 10px; list-style: none; padding-left: 0;">
                                ${(data.strengths || []).map(s => `<li style="color: var(--text-secondary); margin-bottom: 5px;">✓ ${s}</li>`).join('')}
                            </ul>
                        </div>
                        <div>
                            <strong style="color: #ff9800;">🌙 Зоны роста</strong>
                            <ul style="margin-top: 10px; list-style: none; padding-left: 0;">
                                ${(data.weaknesses || []).map(w => `<li style="color: var(--text-secondary); margin-bottom: 5px;">• ${w}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                    
                    ${data.advice ? `
                    <div style="margin-top: 20px; padding: 15px; background: rgba(201, 165, 75, 0.1); border-radius: 12px; border-left: 3px solid var(--primary);">
                        <p style="color: var(--primary); font-style: italic; margin: 0;">💫 ${data.advice}</p>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    renderTarotCardModal(title, card) {
        if (!card) return '';

        const cardNumber = card.number === 0 || card.number === 22 ? 22 : (card.number || '?');
        const imageUrl = card.image || `/images/tarot/${cardNumber}.jpg`;

        return `
            <div class="tarotCard" style="background: rgba(18, 18, 26, 0.5); border-radius: 20px; overflow: hidden; border: 1px solid var(--border-color);">
                <div style="position: relative; padding-top: 140%; background: linear-gradient(135deg, #1a1a24, #0a0a0f); overflow: hidden;">
                    <img src="${imageUrl}" 
                         alt="${card.name}" 
                         style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain;"
                         onerror="this.src='/images/tarot/back.jpg'">
                    <div style="position: absolute; top: 10px; right: 10px; width: 36px; height: 36px; background: linear-gradient(135deg, #c9a54b, #e2b96b); color: #0a0a0f; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
                        ${cardNumber}
                    </div>
                </div>
                <div style="padding: 15px;">
                    <div style="font-weight: bold; font-size: 1rem; color: var(--text-primary); text-align: center; margin-bottom: 5px;">${card.name}</div>
                    <div style="font-size: 0.7rem; color: var(--text-muted); text-align: center; margin-bottom: 10px;">Карта ${title}</div>
                    <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 10px;">${(card.description || '').substring(0, 120)}...</p>
                    <div style="padding: 10px; background: rgba(201, 165, 75, 0.1); border-radius: 12px; border-left: 3px solid var(--primary);">
                        <p style="color: var(--primary); font-style: italic; font-size: 0.8rem; margin: 0;">💫 ${card.advice || ''}</p>
                    </div>
                </div>
            </div>
        `;
    }

    renderDayForecastModal(result) {
        const forecast = result.forecast || {};
        const numbers = forecast.numbers || {};
        const desc = forecast.description || {};
        const universal = desc.universal || {};
        const tarot = forecast.tarot || {};

        return `
            <div class="forecast-card" style="background: rgba(18, 18, 26, 0.5); border-radius: 20px; padding: 20px; margin: 20px 0;">
                <div class="forecast-header" style="display: flex; align-items: center; gap: 20px; margin-bottom: 20px; flex-wrap: wrap;">
                    <div class="forecast-number-large" style="font-size: 3rem; font-weight: bold; color: var(--primary);">${numbers.universal || '?'}</div>
                    <div>
                        <h3 style="color: var(--primary); margin: 0;">${universal.name || 'Прогноз на день'}</h3>
                        <p style="color: var(--text-muted); margin: 5px 0 0;">Дата: ${forecast.targetDate || result.targetDate || '—'}</p>
                    </div>
                </div>
                
                <div class="forecast-cosmic-code" style="margin-bottom: 20px;">
                    <h4 style="color: var(--primary);"><i class="fas fa-star"></i> КОСМИЧЕСКИЙ КОД ДНЯ</h4>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-top: 15px;">
                        <div style="background: rgba(10, 10, 15, 0.5); padding: 12px; border-radius: 12px; text-align: center;">
                            <div style="font-size: 1.8rem; font-weight: bold; color: var(--primary);">${numbers.universal || '?'}</div>
                            <div style="font-size: 0.8rem; color: var(--text-muted);">Универсальное число</div>
                        </div>
                        <div style="background: rgba(10, 10, 15, 0.5); padding: 12px; border-radius: 12px; text-align: center;">
                            <div style="font-size: 1.8rem; font-weight: bold; color: var(--primary);">${numbers.personal || '?'}</div>
                            <div style="font-size: 0.8rem; color: var(--text-muted);">Личное число</div>
                        </div>
                        <div style="background: rgba(10, 10, 15, 0.5); padding: 12px; border-radius: 12px; text-align: center;">
                            <div style="font-size: 1.8rem; font-weight: bold; color: var(--primary);">${numbers.expression || '?'}</div>
                            <div style="font-size: 0.8rem; color: var(--text-muted);">Число выражения</div>
                        </div>
                    </div>
                </div>
                
                <div class="forecast-main" style="margin-bottom: 20px; padding: 15px; background: linear-gradient(135deg, rgba(201, 165, 75, 0.1), rgba(10, 10, 15, 0.5)); border-radius: 16px;">
                    <p style="color: var(--text-primary); line-height: 1.6;">${universal.positive || ''}</p>
                    ${universal.negative ? `<p style="color: #ff6b6b; margin-top: 10px;">⚠️ ${universal.negative}</p>` : ''}
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
                    <div style="background: rgba(10, 10, 15, 0.5); padding: 15px; border-radius: 12px;">
                        <h4 style="color: var(--primary);"><i class="fas fa-briefcase"></i> Карьера</h4>
                        <p style="color: var(--text-secondary); font-size: 0.95rem;">${universal.career || '—'}</p>
                    </div>
                    <div style="background: rgba(10, 10, 15, 0.5); padding: 15px; border-radius: 12px;">
                        <h4 style="color: var(--primary);"><i class="fas fa-heart"></i> Любовь</h4>
                        <p style="color: var(--text-secondary); font-size: 0.95rem;">${universal.love || '—'}</p>
                    </div>
                    <div style="background: rgba(10, 10, 15, 0.5); padding: 15px; border-radius: 12px;">
                        <h4 style="color: var(--primary);"><i class="fas fa-leaf"></i> Здоровье</h4>
                        <p style="color: var(--text-secondary); font-size: 0.95rem;">${universal.health || '—'}</p>
                    </div>
                    <div style="background: rgba(10, 10, 15, 0.5); padding: 15px; border-radius: 12px;">
                        <h4 style="color: var(--primary);"><i class="fas fa-coins"></i> Финансы</h4>
                        <p style="color: var(--text-secondary); font-size: 0.95rem;">${universal.finance || '—'}</p>
                    </div>
                </div>
                
                ${tarot.name ? `
                <div style="background: rgba(201, 165, 75, 0.05); padding: 15px; border-radius: 16px; margin-bottom: 20px;">
                    <h4 style="color: var(--primary);"><i class="fas fa-crown"></i> КАРТА ТАРО: ${tarot.name}</h4>
                    <p style="color: var(--text-secondary);">${tarot.description || ''}</p>
                    <p style="color: var(--primary); margin-top: 10px;"><strong>Совет:</strong> ${tarot.advice || ''}</p>
                </div>
                ` : ''}
                
                ${forecast.affirmation ? `
                <div class="forecast-affirmation" style="padding: 20px; background: linear-gradient(135deg, rgba(201, 165, 75, 0.15), rgba(10, 10, 15, 0.5)); border-radius: 20px; border: 1px solid var(--primary);">
                    <p style="color: var(--text-primary); font-size: 1rem; font-style: italic; margin: 0; text-align: center;">"${forecast.affirmation}"</p>
                </div>
                ` : ''}
            </div>
        `;
    }

    renderWeekForecastModal(result) {
        const forecast = result.forecast || {};
        const weekAnalysis = forecast.weekAnalysis || {};
        const dailyBreakdown = forecast.dailyBreakdown || [];
        const tarot = forecast.tarot || {};

        const dailyHTML = (dailyBreakdown || []).map(day => `
            <div style="background: rgba(10, 10, 15, 0.5); border-radius: 12px; padding: 12px; margin-bottom: 10px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <span style="font-weight: bold; color: var(--primary);">${day.dayName}</span>
                    <span style="font-size: 0.8rem; color: var(--text-muted);">${day.date}</span>
                </div>
                <div style="display: flex; gap: 10px; margin-bottom: 8px; flex-wrap: wrap;">
                    <span style="background: rgba(201, 165, 75, 0.15); padding: 2px 10px; border-radius: 20px; font-size: 0.8rem;">Число: ${day.universalNumber}</span>
                    <span style="background: rgba(201, 165, 75, 0.15); padding: 2px 10px; border-radius: 20px; font-size: 0.8rem;">Энергия: ${day.energy}</span>
                </div>
                <div style="color: var(--text-secondary); font-size: 0.9rem;">${day.focus}</div>
                <div style="color: var(--primary); font-size: 0.85rem; margin-top: 8px;">💫 ${day.advice}</div>
            </div>
        `).join('');

        return `
            <div class="week-forecast" style="margin: 20px 0;">
                <div style="background: rgba(18, 18, 26, 0.5); border-radius: 20px; padding: 20px; margin-bottom: 20px;">
                    <h3 style="color: var(--primary); margin-bottom: 15px;">📅 ${weekAnalysis.theme || 'Прогноз на неделю'}</h3>
                    <p style="color: var(--text-secondary); line-height: 1.6;">${weekAnalysis.description || ''}</p>
                    <p style="color: var(--primary); margin-top: 15px;"><strong>Совет:</strong> ${weekAnalysis.advice || ''}</p>
                </div>
                
                <h4 style="color: var(--primary); margin: 20px 0 15px;"><i class="fas fa-calendar-alt"></i> ДНЕВНАЯ РАЗБИВКА</h4>
                <div style="max-height: 400px; overflow-y: auto;">
                    ${dailyHTML || '<p style="color: var(--text-secondary);">Нет данных</p>'}
                </div>
                
                ${tarot.name ? `
                <div style="background: rgba(201, 165, 75, 0.05); padding: 15px; border-radius: 16px; margin-top: 20px;">
                    <h4 style="color: var(--primary);"><i class="fas fa-crown"></i> КАРТА ТАРО: ${tarot.name}</h4>
                    <p style="color: var(--text-secondary);">${tarot.description || ''}</p>
                    <p style="color: var(--primary); margin-top: 10px;"><strong>Совет:</strong> ${tarot.advice || ''}</p>
                </div>
                ` : ''}
                
                ${forecast.affirmation ? `
                <div style="margin-top: 20px; padding: 20px; background: linear-gradient(135deg, rgba(201, 165, 75, 0.15), rgba(10, 10, 15, 0.5)); border-radius: 20px; border: 1px solid var(--primary);">
                    <p style="color: var(--text-primary); font-size: 1rem; font-style: italic; margin: 0; text-align: center;">"${forecast.affirmation}"</p>
                </div>
                ` : ''}
            </div>
        `;
    }

    renderMonthForecastModal(result) {
        const forecast = result.forecast || {};
        const monthAnalysis = forecast.monthAnalysis || {};
        const weeklyBreakdown = forecast.weeklyBreakdown || [];
        const importantDates = forecast.importantDates || [];
        const tarot = forecast.tarot || {};

        const weeklyHTML = (weeklyBreakdown || []).map(week => `
            <div style="background: rgba(10, 10, 15, 0.5); border-radius: 12px; padding: 15px; margin-bottom: 10px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px; flex-wrap: wrap;">
                    <span style="font-weight: bold; color: var(--primary);">Неделя ${week.weekNumber}</span>
                    <span style="font-size: 0.8rem; color: var(--text-muted);">${week.startDate} — ${week.endDate}</span>
                </div>
                <div><strong>Число недели:</strong> ${week.weekNumberValue}</div>
                <div><strong>Энергия:</strong> ${week.energy || '—'}</div>
                <div><strong>Фокус:</strong> ${week.focus || '—'}</div>
            </div>
        `).join('');

        return `
            <div class="month-forecast" style="margin: 20px 0;">
                <div style="background: rgba(18, 18, 26, 0.5); border-radius: 20px; padding: 20px; margin-bottom: 20px;">
                    <h3 style="color: var(--primary); margin-bottom: 15px;">📅 ${monthAnalysis.theme || 'Прогноз на месяц'}</h3>
                    <p style="color: var(--text-secondary); line-height: 1.6;">${monthAnalysis.description || ''}</p>
                    <p style="color: var(--primary); margin-top: 15px;"><strong>Совет:</strong> ${monthAnalysis.advice || ''}</p>
                </div>
                
                <h4 style="color: var(--primary); margin: 20px 0 15px;"><i class="fas fa-calendar-alt"></i> НЕДЕЛЬНАЯ РАЗБИВКА</h4>
                <div style="max-height: 300px; overflow-y: auto;">
                    ${weeklyHTML || '<p style="color: var(--text-secondary);">Нет данных</p>'}
                </div>
                
                ${importantDates && importantDates.length > 0 ? `
                <h4 style="color: var(--primary); margin: 20px 0 15px;"><i class="fas fa-star"></i> ВАЖНЫЕ ДАТЫ</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 10px;">
                    ${importantDates.map(date => `
                        <div style="background: rgba(201, 165, 75, 0.1); padding: 8px; border-radius: 10px; text-align: center;">
                            <div style="font-weight: bold; color: var(--primary);">${date.date}</div>
                            <div style="font-size: 0.7rem; color: var(--text-muted);">Число ${date.dayNumber}</div>
                        </div>
                    `).join('')}
                </div>
                ` : ''}
                
                ${tarot.name ? `
                <div style="background: rgba(201, 165, 75, 0.05); padding: 15px; border-radius: 16px; margin-top: 20px;">
                    <h4 style="color: var(--primary);"><i class="fas fa-crown"></i> КАРТА ТАРО: ${tarot.name}</h4>
                    <p style="color: var(--text-secondary);">${tarot.description || ''}</p>
                    <p style="color: var(--primary); margin-top: 10px;"><strong>Совет:</strong> ${tarot.advice || ''}</p>
                </div>
                ` : ''}
                
                ${forecast.affirmation ? `
                <div style="margin-top: 20px; padding: 20px; background: linear-gradient(135deg, rgba(201, 165, 75, 0.15), rgba(10, 10, 15, 0.5)); border-radius: 20px; border: 1px solid var(--primary);">
                    <p style="color: var(--text-primary); font-size: 1rem; font-style: italic; margin: 0; text-align: center;">"${forecast.affirmation}"</p>
                </div>
                ` : ''}
            </div>
        `;
    }

    renderYearForecastModal(result) {
        const forecast = result.forecast || {};
        const yearAnalysis = forecast.yearAnalysis || {};
        const quarterlyBreakdown = forecast.quarterlyBreakdown || [];
        const monthlyHighlights = forecast.monthlyHighlights || [];
        const tarot = forecast.tarot || {};

        return `
            <div class="year-forecast" style="margin: 20px 0;">
                <div style="background: rgba(18, 18, 26, 0.5); border-radius: 20px; padding: 20px; margin-bottom: 20px;">
                    <h3 style="color: var(--primary); margin-bottom: 15px;">📅 ${yearAnalysis.theme || 'Прогноз на год'}</h3>
                    <p style="color: var(--text-secondary); line-height: 1.6;">${yearAnalysis.description || ''}</p>
                    <p style="color: var(--primary); margin-top: 15px;"><strong>Совет:</strong> ${yearAnalysis.advice || ''}</p>
                </div>
                
                <h4 style="color: var(--primary); margin: 20px 0 15px;"><i class="fas fa-chart-line"></i> КВАРТАЛЬНАЯ РАЗБИВКА</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 15px;">
                    ${(quarterlyBreakdown || []).map(q => `
                        <div style="background: rgba(10, 10, 15, 0.5); border-radius: 12px; padding: 15px;">
                            <div style="font-weight: bold; color: var(--primary); margin-bottom: 8px;">${q.season}</div>
                            <div style="font-size: 0.9rem; color: var(--text-secondary);">${q.focus || ''}</div>
                            <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 8px;">💫 ${q.advice || ''}</div>
                        </div>
                    `).join('')}
                </div>
                
                ${monthlyHighlights && monthlyHighlights.length > 0 ? `
                <h4 style="color: var(--primary); margin: 20px 0 15px;"><i class="fas fa-star"></i> КЛЮЧЕВЫЕ МЕСЯЦЫ</h4>
                <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                    ${monthlyHighlights.filter(m => m.importance !== 'обычный').slice(0, 6).map(month => `
                        <div style="background: ${month.importance === 'судьбоносный' ? 'rgba(201, 165, 75, 0.2)' : 'rgba(76, 175, 80, 0.1)'}; padding: 8px 15px; border-radius: 20px;">
                            ${month.monthName} (${month.number})
                        </div>
                    `).join('')}
                </div>
                ` : ''}
                
                ${tarot.name ? `
                <div style="background: rgba(201, 165, 75, 0.05); padding: 15px; border-radius: 16px; margin-top: 20px;">
                    <h4 style="color: var(--primary);"><i class="fas fa-crown"></i> КАРТА ТАРО: ${tarot.name}</h4>
                    <p style="color: var(--text-secondary);">${tarot.description || ''}</p>
                    <p style="color: var(--primary); margin-top: 10px;"><strong>Совет:</strong> ${tarot.advice || ''}</p>
                </div>
                ` : ''}
                
                ${forecast.affirmation ? `
                <div style="margin-top: 20px; padding: 20px; background: linear-gradient(135deg, rgba(201, 165, 75, 0.15), rgba(10, 10, 15, 0.5)); border-radius: 20px; border: 1px solid var(--primary);">
                    <p style="color: var(--text-primary); font-size: 1rem; font-style: italic; margin: 0; text-align: center;">"${forecast.affirmation}"</p>
                </div>
                ` : ''}
            </div>
        `;
    }

    renderCompatibilityModal(result) {
        const compatibility = result.compatibility || {};
        const person1 = result.person1 || {};
        const person2 = result.person2 || {};

        return `
            <div style="margin: 20px 0;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
                    <div style="background: rgba(18, 18, 26, 0.5); border-radius: 16px; padding: 20px; text-align: center;">
                        <h4 style="color: var(--primary); margin-bottom: 10px;">${person1.fullName || 'Партнер 1'}</h4>
                        <div style="font-size: 2.5rem; font-weight: bold; color: var(--primary);">${person1.numerology?.fate || '?'}</div>
                        <div style="color: var(--text-muted);">Число судьбы</div>
                        <div style="color: var(--text-secondary); margin-top: 10px;">${person1.birthDate || '—'}</div>
                    </div>
                    <div style="background: rgba(18, 18, 26, 0.5); border-radius: 16px; padding: 20px; text-align: center;">
                        <h4 style="color: var(--primary); margin-bottom: 10px;">${person2.fullName || 'Партнер 2'}</h4>
                        <div style="font-size: 2.5rem; font-weight: bold; color: var(--primary);">${person2.numerology?.fate || '?'}</div>
                        <div style="color: var(--text-muted);">Число судьбы</div>
                        <div style="color: var(--text-secondary); margin-top: 10px;">${person2.birthDate || '—'}</div>
                    </div>
                </div>
                
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="font-size: 3rem; font-weight: bold; color: var(--primary);">${compatibility.score || 0}%</div>
                    <div style="font-size: 1.2rem; color: var(--text-primary);">${compatibility.level || 'Совместимость'}</div>
                    <div style="width: 70%; margin: 15px auto; height: 8px; background: rgba(255,255,255,0.2); border-radius: 4px;">
                        <div style="width: ${compatibility.score || 0}%; height: 100%; background: linear-gradient(90deg, var(--primary), var(--primary-light)); border-radius: 4px;"></div>
                    </div>
                </div>
                
                <div style="background: rgba(76, 175, 80, 0.1); border-radius: 16px; padding: 20px; margin-bottom: 20px;">
                    <h4 style="color: #4caf50;"><i class="fas fa-check-circle"></i> Сильные стороны союза</h4>
                    ${(compatibility.strengths || []).map(s => `<p style="color: var(--text-primary); margin: 10px 0;">• ${s}</p>`).join('')}
                </div>
                
                <div style="background: rgba(244, 67, 54, 0.1); border-radius: 16px; padding: 20px; margin-bottom: 20px;">
                    <h4 style="color: #f44336;"><i class="fas fa-exclamation-triangle"></i> Зоны роста</h4>
                    ${(compatibility.challenges || []).map(c => `<p style="color: var(--text-primary); margin: 10px 0;">• ${c}</p>`).join('')}
                </div>
                
                <div style="background: rgba(201, 165, 75, 0.1); border-radius: 16px; padding: 20px;">
                    <h4 style="color: var(--primary);"><i class="fas fa-lightbulb"></i> Совет</h4>
                    <p style="color: var(--text-primary);">${compatibility.advice || ''}</p>
                </div>
            </div>
        `;
    }

    getZodiacSymbol(signName) {
        const symbols = {
            'Овен': '♈', 'Телец': '♉', 'Близнецы': '♊', 'Рак': '♋',
            'Лев': '♌', 'Дева': '♍', 'Весы': '♎', 'Скорпион': '♏',
            'Стрелец': '♐', 'Козерог': '♑', 'Водолей': '♒', 'Рыбы': '♓'
        };
        return symbols[signName] || '⛤';
    }

    getElementSymbol(element) {
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

    async downloadPDF(calculationId, type) {
        try {
            this.showNotification('📄 Генерируем PDF...', 'info');

            let endpoint = '';
            if (type === 'full') {
                endpoint = `/api/numerology/pdf/${calculationId}`;
            } else if (type === 'day') {
                endpoint = `/api/numerology/pdf/day/${calculationId}`;
            } else if (type === 'week') {
                endpoint = `/api/numerology/pdf/week/${calculationId}`;
            } else if (type === 'month') {
                endpoint = `/api/numerology/pdf/month/${calculationId}`;
            } else if (type === 'year') {
                endpoint = `/api/numerology/pdf/year/${calculationId}`;
            } else if (type === 'compatibility') {
                endpoint = `/api/numerology/pdf/compatibility/${calculationId}`;
            } else {
                endpoint = `/api/numerology/pdf/${calculationId}`;
            }

            const response = await fetch(endpoint, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Ошибка при генерации PDF');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const filename = `${type}-report-${new Date().toISOString().split('T')[0]}.pdf`;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            this.showNotification('✅ PDF готов!', 'success');

        } catch (error) {
            console.error('Error downloading PDF:', error);
            this.showNotification('❌ Ошибка при создании PDF', 'error');
        }
    }

    showNotification(message, type = 'info') {
        // Удаляем старые уведомления
        const oldNotifications = document.querySelectorAll('.notification');
        oldNotifications.forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    closeModal() {
        const modal = document.getElementById('calculationModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }
}

const historyApp = new HistoryApp();
window.historyApp = historyApp;