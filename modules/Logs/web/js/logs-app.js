class LogsApp {
    constructor() {
        this.currentPage = 'dashboard';
        this.logs = [];
        this.selectedLogs = new Set();
        this.currentPageNum = 1;
        this.pageSize = 50;
        this.totalPages = 1;
        this.totalLogs = 0;
        this.filters = {};
        this.stats = {};

        this.init();
    }

    async init() {
        this.initEventListeners();
        await this.loadPage('dashboard');
        this.startAutoRefresh();
    }

    initEventListeners() {
        // Навигация по меню
        document.querySelectorAll('.sidebar-nav li').forEach(item => {
            item.addEventListener('click', () => {
                const page = item.dataset.page;
                this.loadPage(page);

                document.querySelectorAll('.sidebar-nav li').forEach(li => li.classList.remove('active'));
                item.classList.add('active');
            });
        });

        // Кнопка обновления
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.loadPage(this.currentPage);
        });

        // Фильтры по дате
        document.getElementById('dateFrom').addEventListener('change', () => this.applyDateFilter());
        document.getElementById('dateTo').addEventListener('change', () => this.applyDateFilter());

        // Закрытие модального окна
        document.querySelector('.close').addEventListener('click', () => {
            document.getElementById('logModal').style.display = 'none';
        });

        document.getElementById('modalCloseBtn').addEventListener('click', () => {
            document.getElementById('logModal').style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === document.getElementById('logModal')) {
                document.getElementById('logModal').style.display = 'none';
            }
        });
    }

    async loadPage(page) {
        this.currentPage = page;
        document.getElementById('pageTitle').textContent = this.getPageTitle(page);

        switch(page) {
            case 'dashboard':
                await this.loadDashboard();
                break;
            case 'logs':
                await this.loadLogsList();
                break;
            case 'errors':
                this.filters = { level: 'error' };
                await this.loadLogsList();
                break;
            case 'payments':
                this.filters = { type: 'payment' };
                await this.loadLogsList();
                break;
            case 'orders':
                this.filters = { type: 'orders' };
                await this.loadLogsList();
                break;
            case 'api':
                this.filters = { type: 'http' };
                await this.loadLogsList();
                break;
            case 'users':
                this.filters = { type: 'user' };
                await this.loadLogsList();
                break;
        }
    }

    getPageTitle(page) {
        const titles = {
            'dashboard': 'Дашборд логов',
            'logs': 'Все логи',
            'errors': 'Ошибки',
            'payments': 'Логи платежей',
            'orders': 'Логи заказов',
            'api': 'API запросы',
            'users': 'Действия пользователей'
        };
        return titles[page] || page;
    }

    async loadDashboard() {
        const content = document.getElementById('contentBody');
        content.innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Загрузка статистики...</p>
            </div>
        `;

        try {
            await this.loadStats();

            const response = await fetch(`/api/logs?limit=10&order=createdAt,DESC`);
            const data = await response.json();
            const recentLogs = data.data || [];

            content.innerHTML = `
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon blue">
                            <i class="fas fa-database"></i>
                        </div>
                        <div class="stat-info">
                            <h3>Всего логов</h3>
                            <div class="stat-number">${this.stats.total || 0}</div>
                            <div class="stat-label">за все время</div>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon green">
                            <i class="fas fa-info-circle"></i>
                        </div>
                        <div class="stat-info">
                            <h3>Info</h3>
                            <div class="stat-number">${this.getLevelCount('info')}</div>
                            <div class="stat-label">информационные</div>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon yellow">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                        <div class="stat-info">
                            <h3>Warning</h3>
                            <div class="stat-number">${this.getLevelCount('warning')}</div>
                            <div class="stat-label">предупреждения</div>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon orange">
                            <i class="fas fa-bug"></i>
                        </div>
                        <div class="stat-info">
                            <h3>Error</h3>
                            <div class="stat-number">${this.getLevelCount('error')}</div>
                            <div class="stat-label">ошибки</div>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon red">
                            <i class="fas fa-skull-crosswalk"></i>
                        </div>
                        <div class="stat-info">
                            <h3>Critical</h3>
                            <div class="stat-number">${this.getLevelCount('critical')}</div>
                            <div class="stat-label">критические</div>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon purple">
                            <i class="fas fa-chart-line"></i>
                        </div>
                        <div class="stat-info">
                            <h3>За 7 дней</h3>
                            <div class="stat-number">${this.stats.total || 0}</div>
                            <div class="stat-label">последняя неделя</div>
                        </div>
                    </div>
                </div>

                <div class="table-container">
                    <h3 style="margin-bottom: 20px;">Последние записи</h3>
                    ${this.renderLogsTable(recentLogs)}
                </div>
            `;
        } catch (error) {
            console.error('Error loading dashboard:', error);
            content.innerHTML = '<div class="loading">Ошибка загрузки данных</div>';
        }
    }

    async loadLogsList() {
        const content = document.getElementById('contentBody');

        content.innerHTML = `
            <div class="filters-section">
                <div class="filters-grid">
                    <div class="filter-group">
                        <label>Уровень</label>
                        <select id="filterLevel" class="filter-select">
                            <option value="">Все уровни</option>
                            <option value="debug">Debug</option>
                            <option value="info">Info</option>
                            <option value="warning">Warning</option>
                            <option value="error">Error</option>
                            <option value="critical">Critical</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label>Тип</label>
                        <select id="filterType" class="filter-select">
                            <option value="">Все типы</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label>Модуль</label>
                        <select id="filterModule" class="filter-select">
                            <option value="">Все модули</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label>Поиск</label>
                        <input type="text" id="filterSearch" class="filter-input" placeholder="Поиск по сообщению...">
                    </div>
                </div>
                <div class="filters-actions">
                    <div>
                        <button id="markReadBtn" class="btn btn-success" style="display: none;">
                            <i class="fas fa-check"></i> Прочитано
                        </button>
                        <button id="markResolvedBtn" class="btn btn-primary" style="display: none;">
                            <i class="fas fa-check-double"></i> Решено
                        </button>
                        <button id="deleteSelectedBtn" class="btn btn-danger" style="display: none;">
                            <i class="fas fa-trash"></i> Удалить
                        </button>
                    </div>
                    <div>
                        <button id="applyFiltersBtn" class="btn btn-primary">
                            <i class="fas fa-search"></i> Применить
                        </button>
                        <button id="resetFiltersBtn" class="btn btn-secondary">
                            <i class="fas fa-undo"></i> Сбросить
                        </button>
                    </div>
                </div>
            </div>

            <div class="table-container" id="logsTable">
                <div class="loading">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>Загрузка логов...</p>
                </div>
            </div>

            <div class="pagination">
                <button id="prevPage" class="btn btn-secondary" disabled>
                    <i class="fas fa-chevron-left"></i>
                </button>
                <span class="page-info" id="pageInfo">Страница 1 из 1</span>
                <button id="nextPage" class="btn btn-secondary" disabled>
                    <i class="fas fa-chevron-right"></i>
                </button>
                <select id="pageSize" class="page-size">
                    <option value="25">25</option>
                    <option value="50" selected>50</option>
                    <option value="100">100</option>
                    <option value="200">200</option>
                </select>
            </div>
        `;

        await this.loadFilters();

        document.getElementById('applyFiltersBtn').addEventListener('click', () => this.applyFilters());
        document.getElementById('resetFiltersBtn').addEventListener('click', () => this.resetFilters());
        document.getElementById('prevPage').addEventListener('click', () => this.prevPage());
        document.getElementById('nextPage').addEventListener('click', () => this.nextPage());
        document.getElementById('pageSize').addEventListener('change', (e) => {
            this.pageSize = parseInt(e.target.value);
            this.currentPageNum = 1;
            this.loadLogsData();
        });

        document.getElementById('markReadBtn').addEventListener('click', () => {
            this.markRead(Array.from(this.selectedLogs));
        });

        document.getElementById('markResolvedBtn').addEventListener('click', () => {
            this.markResolved(Array.from(this.selectedLogs));
        });

        document.getElementById('deleteSelectedBtn').addEventListener('click', () => {
            this.deleteLogs(Array.from(this.selectedLogs));
        });

        await this.loadLogsData();
    }

    async loadFilters() {
        try {
            const response = await fetch('/api/logs/filters');
            const filters = await response.json();

            this.populateSelect('filterType', filters.types);
            this.populateSelect('filterModule', filters.modules);
        } catch (error) {
            console.error('Failed to load filters:', error);
        }
    }

    populateSelect(elementId, options) {
        const select = document.getElementById(elementId);
        if (!select) return;

        select.innerHTML = '<option value="">Все</option>';
        options.forEach(option => {
            if (option) {
                const opt = document.createElement('option');
                opt.value = option;
                opt.textContent = option;
                select.appendChild(opt);
            }
        });
    }

    async loadLogsData() {
        try {
            const params = new URLSearchParams({
                page: this.currentPageNum,
                limit: this.pageSize,
                ...this.filters
            });

            if (this.filters.dateFrom) params.append('dateFrom', this.filters.dateFrom);
            if (this.filters.dateTo) params.append('dateTo', this.filters.dateTo);

            const response = await fetch(`/api/logs?${params}`);
            const data = await response.json();

            this.logs = data.data || [];
            this.totalPages = data.totalPages || 1;
            this.totalLogs = data.total || 0;

            document.getElementById('logsTable').innerHTML = this.renderLogsTable(this.logs);
            document.getElementById('pageInfo').textContent = `Страница ${data.page || 1} из ${this.totalPages}`;

            document.getElementById('prevPage').disabled = this.currentPageNum === 1;
            document.getElementById('nextPage').disabled = this.currentPageNum === this.totalPages;

            this.updateBulkActions();
        } catch (error) {
            console.error('Error loading logs:', error);
            document.getElementById('logsTable').innerHTML =
                '<div class="loading">Ошибка загрузки</div>';
        }
    }

    renderLogsTable(logs) {
        if (!logs.length) {
            return '<div class="loading">Нет записей</div>';
        }

        return `
            <table class="logs-table">
                <thead>
                    <tr>
                        <th><input type="checkbox" id="selectAll" class="log-checkbox"></th>
                        <th>ID</th>
                        <th>Уровень</th>
                        <th>Тип</th>
                        <th>Модуль</th>
                        <th>Сообщение</th>
                        <th>Время</th>
                        <th>Статус</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    ${logs.map(log => {
            const levelClass = `level-badge level-${log.level}`;
            const readClass = log.isRead ? 'status-read' : 'status-unread';
            const resolvedClass = log.isResolved ? 'status-resolved' : 'status-unresolved';
            const selected = this.selectedLogs.has(log.id) ? 'selected' : '';

            return `
                            <tr class="${selected}" data-id="${log.id}">
                                <td><input type="checkbox" class="log-checkbox" value="${log.id}" ${this.selectedLogs.has(log.id) ? 'checked' : ''}></td>
                                <td>${log.id}</td>
                                <td><span class="${levelClass}">${log.level}</span></td>
                                <td>${log.type || '-'}</td>
                                <td>${log.module || '-'}</td>
                                <td class="message-cell" title="${log.message.replace(/"/g, '&quot;')}">${log.message}</td>
                                <td>${new Date(log.createdAt).toLocaleString()}</td>
                                <td>
                                    <span class="status-badge ${readClass}">${log.isRead ? 'Прочитано' : 'Новое'}</span>
                                    ${log.level === 'error' || log.level === 'critical' ? `
                                        <span class="status-badge ${resolvedClass}">${log.isResolved ? 'Решено' : 'Не решено'}</span>
                                    ` : ''}
                                </td>
                                <td>
                                    <button class="action-btn action-view" onclick="app.viewLog(${log.id})" title="Просмотр">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    ${!log.isRead ? `
                                        <button class="action-btn action-read" onclick="app.markRead([${log.id}])" title="Отметить прочитанным">
                                            <i class="fas fa-check"></i>
                                        </button>
                                    ` : ''}
                                    ${(log.level === 'error' || log.level === 'critical') && !log.isResolved ? `
                                        <button class="action-btn action-resolve" onclick="app.markResolved([${log.id}])" title="Отметить решенным">
                                            <i class="fas fa-check-double"></i>
                                        </button>
                                    ` : ''}
                                    <button class="action-btn action-delete" onclick="app.deleteLogs([${log.id}])" title="Удалить">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `;
        }).join('')}
                </tbody>
            </table>
        `;
    }

    async viewLog(id) {
        try {
            const response = await fetch(`/api/logs/${id}`);
            const log = await response.json();

            this.showLogModal(log);
        } catch (error) {
            this.showNotification('Ошибка загрузки лога', 'error');
        }
    }

    showLogModal(log) {
        document.getElementById('modalTitle').textContent = `Лог #${log.id}`;

        // Форматируем JSON с отступами
        const formattedDetails = log.details ?
            JSON.stringify(log.details, null, 2) : 'null';

        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div class="log-detail">
                <div class="log-detail-row">
                    <span class="log-detail-label">ID:</span>
                    <span class="log-detail-value"><code>${log.id}</code></span>
                </div>
                <div class="log-detail-row">
                    <span class="log-detail-label">Уровень:</span>
                    <span class="log-detail-value">
                        <span class="level-badge level-${log.level}">${log.level.toUpperCase()}</span>
                    </span>
                </div>
                <div class="log-detail-row">
                    <span class="log-detail-label">Тип:</span>
                    <span class="log-detail-value"><code>${log.type || '-'}</code></span>
                </div>
                <div class="log-detail-row">
                    <span class="log-detail-label">Модуль:</span>
                    <span class="log-detail-value"><code>${log.module || '-'}</code></span>
                </div>
                <div class="log-detail-row">
                    <span class="log-detail-label">Сообщение:</span>
                    <span class="log-detail-value">${log.message}</span>
                </div>
                <div class="log-detail-row">
                    <span class="log-detail-label">Пользователь:</span>
                    <span class="log-detail-value">${log.user?.displayName || log.userId || '-'}</span>
                </div>
                <div class="log-detail-row">
                    <span class="log-detail-label">Заказ:</span>
                    <span class="log-detail-value">${log.orderId ? `#${log.orderId}` : '-'}</span>
                </div>
                <div class="log-detail-row">
                    <span class="log-detail-label">IP:</span>
                    <span class="log-detail-value"><code>${log.ip || '-'}</code></span>
                </div>
                <div class="log-detail-row">
                    <span class="log-detail-label">URL:</span>
                    <span class="log-detail-value">${log.method || ''} <code>${log.url || '-'}</code></span>
                </div>
                <div class="log-detail-row">
                    <span class="log-detail-label">Статус:</span>
                    <span class="log-detail-value"><code>${log.statusCode || '-'}</code> (${log.responseTime || '-'}ms)</span>
                </div>
                <div class="log-detail-row">
                    <span class="log-detail-label">Создан:</span>
                    <span class="log-detail-value">${new Date(log.createdAt).toLocaleString()}</span>
                </div>
                <div class="log-detail-row">
                    <span class="log-detail-label">Обновлен:</span>
                    <span class="log-detail-value">${new Date(log.updatedAt).toLocaleString()}</span>
                </div>
                ${log.resolvedAt ? `
                <div class="log-detail-row">
                    <span class="log-detail-label">Решен:</span>
                    <span class="log-detail-value">${new Date(log.resolvedAt).toLocaleString()} ${log.resolver ? `(${log.resolver.displayName})` : ''}</span>
                </div>
                ` : ''}
                ${log.resolutionComment ? `
                <div class="log-detail-row">
                    <span class="log-detail-label">Комментарий:</span>
                    <span class="log-detail-value">${log.resolutionComment}</span>
                </div>
                ` : ''}
            </div>
            
            <div class="log-detail">
                <div class="json-header">
                    <span class="log-detail-label">Детали (JSON):</span>
                    <button class="btn-copy" onclick="app.copyJson(${log.id})" id="copyBtn-${log.id}">
                        <i class="fas fa-copy"></i> Копировать
                    </button>
                </div>
                <div class="json-viewer">
                    <pre><code class="language-json">${this.escapeHtml(formattedDetails)}</code></pre>
                </div>
            </div>
        `;

        // Подсвечиваем JSON
        document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
        });

        document.getElementById('logModal').style.display = 'block';
    }

    // Экранирование HTML специальных символов
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Копирование JSON в буфер обмена
    async copyJson(logId) {
        const log = this.logs.find(l => l.id === logId);
        if (!log || !log.details) return;

        const jsonStr = JSON.stringify(log.details, null, 2);

        try {
            await navigator.clipboard.writeText(jsonStr);

            const btn = document.getElementById(`copyBtn-${logId}`);
            const originalHtml = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Скопировано!';
            btn.classList.add('copied');

            setTimeout(() => {
                btn.innerHTML = originalHtml;
                btn.classList.remove('copied');
            }, 2000);

            this.showNotification('JSON скопирован в буфер обмена', 'success');
        } catch (err) {
            this.showNotification('Ошибка при копировании', 'error');
        }
    }

    async loadStats() {
        try {
            const response = await fetch('/api/logs/stats?days=7');
            this.stats = await response.json();
        } catch (error) {
            console.error('Failed to load stats:', error);
        }
    }

    getLevelCount(level) {
        if (!this.stats.byLevel) return 0;
        const levelStat = this.stats.byLevel.find(l => l.level === level);
        return levelStat ? parseInt(levelStat.count) : 0;
    }

    applyFilters() {
        this.filters = {
            level: document.getElementById('filterLevel').value || undefined,
            type: document.getElementById('filterType').value || undefined,
            module: document.getElementById('filterModule').value || undefined,
            search: document.getElementById('filterSearch').value || undefined
        };

        this.currentPageNum = 1;
        this.loadLogsData();
    }

    resetFilters() {
        document.getElementById('filterLevel').value = '';
        document.getElementById('filterType').value = '';
        document.getElementById('filterModule').value = '';
        document.getElementById('filterSearch').value = '';
        this.filters = {};
        this.currentPageNum = 1;
        this.loadLogsData();
    }

    applyDateFilter() {
        const dateFrom = document.getElementById('dateFrom').value;
        const dateTo = document.getElementById('dateTo').value;

        if (dateFrom) this.filters.dateFrom = dateFrom;
        if (dateTo) this.filters.dateTo = dateTo;

        if (this.currentPage === 'logs') {
            this.loadLogsData();
        } else {
            this.loadPage(this.currentPage);
        }
    }

    prevPage() {
        if (this.currentPageNum > 1) {
            this.currentPageNum--;
            this.loadLogsData();
        }
    }

    nextPage() {
        if (this.currentPageNum < this.totalPages) {
            this.currentPageNum++;
            this.loadLogsData();
        }
    }

    async markRead(logIds) {
        try {
            const response = await fetch('/api/logs/mark-read', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ logIds })
            });

            const result = await response.json();

            if (result.success) {
                this.showNotification(`Отмечено ${result.count} логов как прочитанные`, 'success');
                this.loadLogsData();
                this.selectedLogs.clear();
                this.updateBulkActions();
            }
        } catch (error) {
            this.showNotification('Ошибка', 'error');
        }
    }

    async markResolved(logIds) {
        const comment = prompt('Введите комментарий к решению (необязательно):');

        try {
            const response = await fetch('/api/logs/mark-resolved', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ logIds, comment })
            });

            const result = await response.json();

            if (result.success) {
                this.showNotification(`Отмечено ${result.count} ошибок как решенные`, 'success');
                this.loadLogsData();
                this.selectedLogs.clear();
                this.updateBulkActions();
            }
        } catch (error) {
            this.showNotification('Ошибка', 'error');
        }
    }

    async deleteLogs(logIds) {
        if (!confirm(`Удалить ${logIds.length} записей?`)) return;

        try {
            const response = await fetch('/api/logs', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ logIds })
            });

            const result = await response.json();

            if (result.success) {
                this.showNotification(`Удалено ${result.count} записей`, 'success');
                this.loadLogsData();
                this.selectedLogs.clear();
                this.updateBulkActions();
            }
        } catch (error) {
            this.showNotification('Ошибка', 'error');
        }
    }

    updateBulkActions() {
        const count = this.selectedLogs.size;
        const markReadBtn = document.getElementById('markReadBtn');
        const markResolvedBtn = document.getElementById('markResolvedBtn');
        const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');

        if (count > 0) {
            if (markReadBtn) markReadBtn.style.display = 'inline-flex';
            if (markResolvedBtn) markResolvedBtn.style.display = 'inline-flex';
            if (deleteSelectedBtn) deleteSelectedBtn.style.display = 'inline-flex';

            const selectAll = document.getElementById('selectAll');
            if (selectAll) selectAll.checked = this.logs.length === count;
        } else {
            if (markReadBtn) markReadBtn.style.display = 'none';
            if (markResolvedBtn) markResolvedBtn.style.display = 'none';
            if (deleteSelectedBtn) deleteSelectedBtn.style.display = 'none';

            const selectAll = document.getElementById('selectAll');
            if (selectAll) selectAll.checked = false;
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    startAutoRefresh() {
        setInterval(() => {
            if (this.currentPage === 'dashboard') {
                this.loadDashboard();
            } else if (this.currentPage !== 'logs' || !document.hidden) {
                this.loadLogsData();
            }
        }, 30000);
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    window.app = new LogsApp();
});