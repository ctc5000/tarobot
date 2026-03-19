// modules/Core/web/js/cabinet.js

class CabinetApp {
    constructor() {
        this.user = null;
        this.balance = 0;
        this.transactions = [];
        this.calculations = [];
        this.selectedAmount = 500;

        this.init();
    }

    async init() {
        // Проверяем наличие токена
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('❌ Нет токена, редирект на логин');
            window.location.href = '/login';
            return;
        }

        console.log('✅ Токен найден, загружаем данные');
        await this.loadUserData();
        this.initEventListeners();

        // Загружаем данные в зависимости от страницы
        if (window.location.pathname === '/cabinet') {
            this.loadDashboard();
        } else if (window.location.pathname === '/cabinet/profile') {
            this.loadProfile();
        } else if (window.location.pathname === '/cabinet/balance') {
            this.loadBalance();
        } else if (window.location.pathname === '/cabinet/history') {
            this.loadHistory();
        } else if (window.location.pathname === '/cabinet/subscriptions') {
            this.loadSubscriptions();
        }
    }

    initEventListeners() {
        // Обработчик для кастомной суммы
        const customAmount = document.getElementById('customAmount');
        if (customAmount) {
            customAmount.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                if (value && value > 0) {
                    this.selectedAmount = value;
                    this.updateSelectedAmount(value);
                }
            });
        }
    }

    async loadUserData() {
        const token = localStorage.getItem('token');

        try {
            console.log('📡 Запрос к /api/profile');
            const response = await fetch('/api/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('📊 Статус ответа:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Данные пользователя получены');
                this.user = data.data.user;
                this.updateUI();
            } else if (response.status === 401) {
                console.log('❌ Токен недействителен');
                localStorage.removeItem('token');
                window.location.href = '/login';
            } else {
                console.error('❌ Ошибка загрузки:', response.status);
            }
        } catch (error) {
            console.error('❌ Ошибка загрузки данных пользователя:', error);
        }
    }

    updateUI() {
        // Обновляем имя в приветствии
        const welcomeMessage = document.getElementById('welcomeMessage');
        const userStats = document.getElementById('userStats');

        if (welcomeMessage && this.user) {
            const firstName = this.user.fullName.split(' ')[1] || this.user.fullName.split(' ')[0] || this.user.fullName;
            welcomeMessage.textContent = `Добро пожаловать, ${firstName}!`;
        }

        // Обновляем текст статистики
        if (userStats) {
            userStats.textContent = 'Загружаем вашу статистику...';
        }

        // Обновляем баланс в шапке
        const balanceDisplay = document.getElementById('balanceDisplay');
        if (balanceDisplay && this.user) {
            balanceDisplay.innerHTML = `
                <span class="balance-label">Баланс:</span>
                <span class="balance-amount">${this.user.balance?.toLocaleString() || 0} ₽</span>
                <button class="btn btn-primary btn-sm" onclick="window.location.href='/cabinet/balance'">
                    <i class="fas fa-plus"></i> Пополнить
                </button>
            `;
        }

        // Обновляем баланс на странице баланса
        const currentBalance = document.getElementById('currentBalance');
        if (currentBalance && this.user) {
            currentBalance.textContent = `${this.user.balance?.toLocaleString() || 0} ₽`;
        }
    }

    async loadDashboard() {
        try {
            // Обновляем статус загрузки
            const userStats = document.getElementById('userStats');
            if (userStats) {
                userStats.textContent = 'Загружаем вашу статистику...';
            }

            // Загружаем статистику
            const statsResponse = await fetch('/api/transactions/stats', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (statsResponse.ok) {
                const stats = await statsResponse.json();
                this.renderStats(stats.data);

                // Обновляем статус после успешной загрузки
                if (userStats) {
                    userStats.textContent = 'Ваша статистика обновлена';
                    setTimeout(() => {
                        if (userStats) userStats.style.display = 'none';
                    }, 3000);
                }
            } else {
                // Если API не работает, показываем демо-данные
                this.renderStats({
                    currentBalance: this.user?.balance || 35450,
                    totalSpent: 14550,
                    totalPurchases: 29
                });

                if (userStats) {
                    userStats.textContent = 'Статистика загружена (демо-режим)';
                    setTimeout(() => {
                        if (userStats) userStats.style.display = 'none';
                    }, 3000);
                }
            }

            // Загружаем последние расчеты
            const historyResponse = await fetch('/api/calculations?limit=5', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (historyResponse.ok) {
                const history = await historyResponse.json();
                this.renderRecentCalculations(history.data.calculations || []);
            } else {
                // Если API не работает, показываем демо-данные
                this.renderRecentCalculations([]);
            }
        } catch (error) {
            console.error('Error loading dashboard:', error);

            // Показываем демо-данные при ошибке
            this.renderStats({
                currentBalance: this.user?.balance || 35450,
                totalSpent: 14550,
                totalPurchases: 29
            });

            const userStats = document.getElementById('userStats');
            if (userStats) {
                userStats.textContent = 'Ошибка загрузки статистики';
                setTimeout(() => {
                    if (userStats) userStats.style.display = 'none';
                }, 3000);
            }
        }
    }

    // ИСПРАВЛЕННЫЙ МЕТОД ДЛЯ ОТОБРАЖЕНИЯ СТАТИСТИКИ
    renderStats(stats) {
        const statsGrid = document.getElementById('statsGrid');
        if (!statsGrid) return;

        statsGrid.innerHTML = `
            <div class="stat-card">
                <div class="stat-icon" style="background: rgba(33, 150, 243, 0.1)">
                    <i class="fas fa-wallet" style="color: #2196f3"></i>
                </div>
                <div class="stat-content">
                    <span class="stat-value">${stats.currentBalance?.toLocaleString() || 0} ₽</span>
                    <span class="stat-label">Текущий баланс</span>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon" style="background: rgba(76, 175, 80, 0.1)">
                    <i class="fas fa-chart-line" style="color: #4caf50"></i>
                </div>
                <div class="stat-content">
                    <span class="stat-value">${stats.totalSpent?.toLocaleString() || 0} ₽</span>
                    <span class="stat-label">Всего потрачено</span>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon" style="background: rgba(156, 39, 176, 0.1)">
                    <i class="fas fa-calculator" style="color: #9c27b0"></i>
                </div>
                <div class="stat-content">
                    <span class="stat-value">${stats.totalPurchases || 0}</span>
                    <span class="stat-label">Всего расчетов</span>
                </div>
            </div>
        `;
    }

    // ИСПРАВЛЕННЫЙ МЕТОД ДЛЯ ОТОБРАЖЕНИЯ ПОСЛЕДНИХ РАСЧЕТОВ
    renderRecentCalculations(calculations) {
        const container = document.getElementById('recentCalculations');
        if (!container) return;

        if (!calculations || calculations.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calculator"></i>
                    <p>У вас пока нет расчетов</p>
                    <a href="/numerology" class="btn btn-primary">Создать первый расчет</a>
                </div>
            `;
            return;
        }

        container.innerHTML = calculations.map(calc => {
            const typeInfo = this.getCalculationTypeInfo(calc.calculationType);
            const date = new Date(calc.createdAt).toLocaleDateString('ru-RU');

            return `
                <div class="calculation-card" onclick="cabinetApp.viewCalculation('${calc.id}')">
                    <div class="calc-card-header">
                        <div class="calc-card-icon" style="background: ${typeInfo.color}15; color: ${typeInfo.color}">
                            <i class="${typeInfo.icon}"></i>
                        </div>
                        <div class="calc-card-price">${calc.price.toLocaleString()} ₽</div>
                    </div>
                    <div class="calc-card-info">
                        <h4>${typeInfo.name}</h4>
                        <div class="calc-card-meta">
                            <span class="calc-card-date">
                                <i class="fas fa-calendar-alt"></i> ${date}
                            </span>
                            ${calc.targetDate ? `
                                <span class="calc-card-target">
                                    <i class="fas fa-clock"></i> на ${this.formatDate(calc.targetDate)}
                                </span>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Вспомогательный метод для получения информации о типе расчета
    getCalculationTypeInfo(type) {
        const types = {
            'basic': {
                name: 'Базовый расчет',
                icon: 'fas fa-star',
                color: '#c9a54b'
            },
            'full': {
                name: 'Полный расчет',
                icon: 'fas fa-crown',
                color: '#4caf50'
            },
            'day': {
                name: 'Прогноз на день',
                icon: 'fas fa-sun',
                color: '#ff9800'
            },
            'week': {
                name: 'Прогноз на неделю',
                icon: 'fas fa-calendar-week',
                color: '#2196f3'
            },
            'month': {
                name: 'Прогноз на месяц',
                icon: 'fas fa-calendar-alt',
                color: '#9c27b0'
            },
            'year': {
                name: 'Прогноз на год',
                icon: 'fas fa-calendar',
                color: '#f44336'
            },
            'compatibility': {
                name: 'Совместимость',
                icon: 'fas fa-heart',
                color: '#e91e63'
            }
        };
        return types[type] || {
            name: 'Расчет',
            icon: 'fas fa-calculator',
            color: '#6a6a7a'
        };
    }

    // Вспомогательный метод для форматирования даты
    formatDate(dateStr) {
        if (!dateStr) return '';
        const [year, month, day] = dateStr.split('-');
        return `${day}.${month}.${year}`;
    }

    getCalculationIcon(type) {
        const icons = {
            'day': '📅',
            'week': '📆',
            'month': '📊',
            'year': '📈',
            'compatibility': '💑',
            'basic': '🔮',
            'full': '⭐'
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
        return names[calc.calculationType] || 'Расчет';
    }

    viewCalculation(id) {
        // TODO: Открыть модальное окно с деталями расчета
        console.log('View calculation:', id);
    }

    async loadProfile() {
        const form = document.getElementById('profileForm');
        if (!form || !this.user) return;

        // Заполняем форму данными пользователя
        form.querySelector('#fullName').value = this.user.fullName || '';
        form.querySelector('#email').value = this.user.email || '';
        form.querySelector('#phone').value = this.user.phone || '';
        form.querySelector('#birthDate').value = this.user.birthDate || '';

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.updateProfile();
        });

        // Форма смены пароля
        const passwordForm = document.getElementById('passwordForm');
        if (passwordForm) {
            passwordForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.changePassword();
            });
        }
    }

    async updateProfile() {
        const form = document.getElementById('profileForm');
        const data = {
            fullName: form.querySelector('#fullName').value,
            phone: form.querySelector('#phone').value
        };

        try {
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert('Профиль обновлен');
                await this.loadUserData();
            } else {
                alert('Ошибка при обновлении профиля');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Ошибка соединения');
        }
    }

    async changePassword() {
        const form = document.getElementById('passwordForm');
        const currentPassword = form.querySelector('#currentPassword').value;
        const newPassword = form.querySelector('#newPassword').value;
        const confirmPassword = form.querySelector('#confirmPassword').value;

        if (newPassword !== confirmPassword) {
            alert('Новые пароли не совпадают');
            return;
        }

        try {
            const response = await fetch('/api/profile/change-password', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ oldPassword: currentPassword, newPassword })
            });

            if (response.ok) {
                alert('Пароль успешно изменен');
                form.reset();
            } else {
                const data = await response.json();
                alert(data.error || 'Ошибка при смене пароля');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            alert('Ошибка соединения');
        }
    }

    async loadBalance() {
        await this.loadTransactions();
        this.updateSelectedAmount(500);
    }

    async loadTransactions(limit = 10) {
        try {
            const response = await fetch(`/api/transactions?limit=${limit}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.renderTransactions(data.data.transactions);
            }
        } catch (error) {
            console.error('Error loading transactions:', error);
        }
    }

    renderTransactions(transactions) {
        const list = document.getElementById('transactionsList');
        if (!list) return;

        if (!transactions || transactions.length === 0) {
            list.innerHTML = '<p class="empty-message">История транзакций пуста</p>';
            return;
        }

        list.innerHTML = transactions.map(t => `
            <div class="transaction-item ${t.type}">
                <div class="transaction-icon">
                    <i class="fas ${this.getTransactionIcon(t.type)}"></i>
                </div>
                <div class="transaction-info">
                    <div class="transaction-name">${t.description || this.getTransactionName(t)}</div>
                    <div class="transaction-date">${new Date(t.createdAt).toLocaleString()}</div>
                </div>
                <div class="transaction-amount ${t.type}">
                    ${t.type === 'deposit' ? '+' : '-'}${Math.abs(t.amount).toLocaleString()} ₽
                </div>
            </div>
        `).join('');
    }

    getTransactionIcon(type) {
        const icons = {
            'deposit': 'fa-arrow-down',
            'payment': 'fa-arrow-up',
            'refund': 'fa-undo',
            'withdrawal': 'fa-arrow-up'
        };
        return icons[type] || 'fa-circle';
    }

    getTransactionName(transaction) {
        if (transaction.type === 'deposit') return 'Пополнение баланса';
        if (transaction.type === 'payment') return 'Оплата расчета';
        return 'Транзакция';
    }

    // ========== МЕТОДЫ ДЛЯ СТРАНИЦЫ БАЛАНСА ==========

    selectPackage(amount) {
        this.selectedAmount = amount;
        this.updateSelectedAmount(amount);

        // Очищаем кастомное поле
        const customInput = document.getElementById('customAmount');
        if (customInput) customInput.value = '';
    }

    updateSelectedAmount(amount) {
        const span = document.getElementById('selectedAmount');
        if (span) span.textContent = amount.toLocaleString();

        // Подсветка выбранного пакета
        document.querySelectorAll('.package-item').forEach(el => {
            el.classList.remove('selected');
        });

        const selected = Array.from(document.querySelectorAll('.package-item')).find(
            el => el.textContent.includes(amount.toString())
        );
        if (selected) selected.classList.add('selected');
    }

    async processPayment() {
        const amount = this.selectedAmount;
        const method = document.querySelector('input[name="paymentMethod"]:checked')?.value;

        if (!method) {
            alert('Выберите способ оплаты');
            return;
        }

        try {
            // Здесь будет интеграция с платежной системой
            alert(`Пополнение на ${amount.toLocaleString()} ₽ через ${method}`);

            // Временно для теста - просто показываем модалку
            this.showPaymentModal('https://example.com/payment');

        } catch (error) {
            console.error('Error processing payment:', error);
            alert('Ошибка соединения');
        }
    }

    showPaymentModal(url) {
        const modal = document.getElementById('paymentModal');
        const frame = document.getElementById('paymentFrame');

        if (!modal || !frame) return;

        frame.innerHTML = `<iframe src="${url}" style="width:100%; height:500px; border:none;"></iframe>`;
        modal.style.display = 'block';
    }

    closePaymentModal() {
        const modal = document.getElementById('paymentModal');
        if (modal) {
            modal.style.display = 'none';
            const frame = document.getElementById('paymentFrame');
            if (frame) frame.innerHTML = '';

            // Обновляем баланс после закрытия
            setTimeout(() => this.loadUserData(), 1000);
        }
    }

    // ========== МЕТОДЫ ДЛЯ ИСТОРИИ ==========

    async loadHistory(page = 1) {
        try {
            const response = await fetch(`/api/calculations?page=${page}&limit=20`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.renderHistory(data);
            }
        } catch (error) {
            console.error('Error loading history:', error);
        }
    }

    renderHistory(data) {
        // TODO: Реализовать отображение истории с пагинацией
    }

    // ========== МЕТОДЫ ДЛЯ ПОДПИСОК ==========

    async loadSubscriptions() {
        try {
            const response = await fetch('/api/subscriptions', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.renderSubscriptions(data.data);
            }
        } catch (error) {
            console.error('Error loading subscriptions:', error);
        }
    }

    renderSubscriptions(subscriptions) {
        // TODO: Реализовать отображение подписок
    }

    // ========== МЕТОДЫ ВЫХОДА ==========

    logout() {
        localStorage.removeItem('token');
        window.location.href = '/';
    }

    requestDeleteAccount() {
        if (confirm('Вы уверены, что хотите удалить аккаунт? Это действие нельзя отменить.')) {
            // TODO: Реализовать удаление аккаунта
            console.log('Delete account requested');
        }
    }
}

// Инициализация
const cabinetApp = new CabinetApp();
window.cabinetApp = cabinetApp;

// Глобальные функции для onclick в HTML
window.selectPackage = (amount) => cabinetApp.selectPackage(amount);
window.processPayment = () => cabinetApp.processPayment();
window.closePaymentModal = () => cabinetApp.closePaymentModal();
window.showDepositModal = () => {
    // Если нужно показать модалку с другими параметрами
    cabinetApp.selectPackage(500);
};