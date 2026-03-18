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
                window.cabinetApp.user = data.data.user;
                window.cabinetApp.updateUI();
            } else if (response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }

    initEventListeners() {
        document.getElementById('filterType')?.addEventListener('change', () => this.applyFilters());
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
            list.innerHTML = '<div class="empty-message">У вас пока нет расчетов</div>';
            this.renderPagination();
            return;
        }

        list.innerHTML = data.calculations.map(calc => `
            <div class="calculation-item" onclick="historyApp.viewCalculation('${calc.id}')">
                <div class="calc-icon">
                    ${this.getCalculationIcon(calc.calculationType)}
                </div>
                <div class="calc-info">
                    <div class="calc-name">${this.getCalculationName(calc)}</div>
                    <div class="calc-date">${new Date(calc.createdAt).toLocaleString()}</div>
                    ${calc.targetDate ? `<div class="calc-target">На дату: ${calc.targetDate}</div>` : ''}
                </div>
                <div class="calc-price">-${calc.price} ₽</div>
                <button class="btn-view" onclick="event.stopPropagation(); historyApp.viewCalculation('${calc.id}')">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
        `).join('');

        this.renderPagination();
    }

    getCalculationIcon(type) {
        const icons = {
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
            'day': 'Прогноз на день',
            'week': 'Прогноз на неделю',
            'month': 'Прогноз на месяц',
            'year': 'Прогноз на год',
            'compatibility': 'Совместимость'
        };
        return names[calc.calculationType] || 'Расчет';
    }

    renderPagination() {
        const pagination = document.getElementById('pagination');
        if (!pagination) return;

        if (this.totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        let html = '<div class="pagination-controls">';

        html += `<button class="btn btn-secondary btn-sm" onclick="historyApp.goToPage(1)" ${this.currentPage === 1 ? 'disabled' : ''}>
            <i class="fas fa-angle-double-left"></i>
        </button>`;

        html += `<button class="btn btn-secondary btn-sm" onclick="historyApp.goToPage(${this.currentPage - 1})" ${this.currentPage === 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i>
        </button>`;

        html += `<span class="page-info">${this.currentPage} / ${this.totalPages}</span>`;

        html += `<button class="btn btn-secondary btn-sm" onclick="historyApp.goToPage(${this.currentPage + 1})" ${this.currentPage === this.totalPages ? 'disabled' : ''}>
            <i class="fas fa-chevron-right"></i>
        </button>`;

        html += `<button class="btn btn-secondary btn-sm" onclick="historyApp.goToPage(${this.totalPages})" ${this.currentPage === this.totalPages ? 'disabled' : ''}>
            <i class="fas fa-angle-double-right"></i>
        </button>`;

        html += '</div>';

        pagination.innerHTML = html;
    }

    goToPage(page) {
        if (page < 1 || page > this.totalPages) return;
        this.currentPage = page;
        this.loadHistory();
    }

    applyFilters() {
        this.filters.type = document.getElementById('filterType')?.value || 'all';
        this.filters.dateFrom = document.getElementById('filterDateFrom')?.value || '';
        this.filters.dateTo = document.getElementById('filterDateTo')?.value || '';
        this.currentPage = 1;
        this.loadHistory();
    }

    resetFilters() {
        document.getElementById('filterType').value = 'all';
        document.getElementById('filterDateFrom').value = '';
        document.getElementById('filterDateTo').value = '';
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
            const response = await fetch(`/api/calculations/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.showCalculationModal(data.data);
            }
        } catch (error) {
            console.error('Error loading calculation:', error);
        }
    }

    showCalculationModal(calculation) {
        const modal = document.getElementById('calculationModal');
        const body = document.getElementById('modalBody');

        const result = calculation.result || {};

        body.innerHTML = `
            <div class="calculation-details">
                <div class="detail-row">
                    <span class="detail-label">Тип расчета:</span>
                    <span class="detail-value">${this.getCalculationName(calculation)}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Дата расчета:</span>
                    <span class="detail-value">${new Date(calculation.createdAt).toLocaleString()}</span>
                </div>
                
                ${calculation.targetDate ? `
                <div class="detail-row">
                    <span class="detail-label">Дата прогноза:</span>
                    <span class="detail-value">${calculation.targetDate}</span>
                </div>
                ` : ''}
                
                <div class="detail-row">
                    <span class="detail-label">Стоимость:</span>
                    <span class="detail-value">${calculation.price} ₽</span>
                </div>
                
                <div class="detail-section">
                    <h4>Результат расчета</h4>
                    <div class="result-content">
                        ${result.description || JSON.stringify(result, null, 2)}
                    </div>
                </div>
            </div>
        `;

        modal.style.display = 'block';
    }

    closeModal() {
        document.getElementById('calculationModal').style.display = 'none';
    }
}

// Инициализация
const historyApp = new HistoryApp();
window.historyApp = historyApp;