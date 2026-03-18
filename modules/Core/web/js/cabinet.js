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
        if (welcomeMessage && this.user) {
            welcomeMessage.textContent = `Добро пожаловать, ${this.user.fullName.split(' ')[1]}!`;
        }

        // Обновляем баланс в шапке
        const balanceDisplay = document.getElementById('balanceDisplay');
        if (balanceDisplay && this.user) {
            balanceDisplay.innerHTML = `
                <span class="balance-label">Баланс:</span>
                <span class="balance-amount">${this.user.balance} ₽</span>
                <button class="btn btn-primary btn-sm" onclick="window.location.href='/cabinet/balance'">
                    <i class="fas fa-plus"></i> Пополнить
                </button>
            `;
        }

        // Обновляем баланс на странице баланса
        const currentBalance = document.getElementById('currentBalance');
        if (currentBalance && this.user) {
            currentBalance.textContent = `${this.user.balance} ₽`;
        }
    }

    async loadDashboard() {
        try {
            // Загружаем статистику
            const statsResponse = await fetch('/api/transactions/stats', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (statsResponse.ok) {
                const stats = await statsResponse.json();
                this.renderStats(stats.data);
            }

            // Загружаем последние расчеты
            const historyResponse = await fetch('/api/calculations?limit=5', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (historyResponse.ok) {
                const history = await historyResponse.json();
                this.renderRecentCalculations(history.data);
            }
        } catch (error) {
            console.error('Error loading dashboard:', error);
        }
    }

    renderStats(stats) {
        const statsGrid = document.getElementById('statsGrid');
        if (!statsGrid) return;

        statsGrid.innerHTML = `
            <div class="stat-card">
                <div class="stat-icon blue">
                    <i class="fas fa-wallet"></i>
                </div>
                <div class="stat-info">
                    <h3>Текущий баланс</h3>
                    <div class="stat-number">${stats.currentBalance} ₽</div>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon green">
                    <i class="fas fa-chart-line"></i>
                </div>
                <div class="stat-info">
                    <h3>Всего потрачено</h3>
                    <div class="stat-number">${stats.totalSpent} ₽</div>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon purple">
                    <i class="fas fa-calculator"></i>
                </div>
                <div class="stat-info">
                    <h3>Всего расчетов</h3>
                    <div class="stat-number">${stats.totalPurchases}</div>
                </div>
            </div>
        `;
    }

    renderRecentCalculations(calculations) {
        const list = document.getElementById('recentCalculations');
        if (!list) return;

        if (!calculations || calculations.length === 0) {
            list.innerHTML = '<p class="empty-message">У вас пока нет расчетов</p>';
            return;
        }

        list.innerHTML = calculations.map(calc => `
            <div class="calculation-item">
                <div class="calc-icon">
                    ${this.getCalculationIcon(calc.calculationType)}
                </div>
                <div class="calc-info">
                    <div class="calc-name">${this.getCalculationName(calc)}</div>
                    <div class="calc-date">${new Date(calc.createdAt).toLocaleDateString()}</div>
                </div>
                <div class="calc-price">-${calc.price} ₽</div>
                <button class="btn-view" onclick="cabinetApp.viewCalculation('${calc.id}')">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
        `).join('');
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
                    ${t.type === 'deposit' ? '+' : '-'}${Math.abs(t.amount)} ₽
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
        if (span) span.textContent = amount;

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
            alert(`Пополнение на ${amount} ₽ через ${method}`);

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