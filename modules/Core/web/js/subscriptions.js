// modules/Core/web/js/subscriptions.js

class SubscriptionsApp {
    constructor() {
        this.activeSubscription = null;
        this.availableSubscriptions = [];
        this.history = [];

        this.init();
    }

    async init() {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login';
            return;
        }

        await this.loadUserData();
        await this.loadActiveSubscription();
        await this.loadAvailableSubscriptions();
        await this.loadSubscriptionHistory();
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

    async loadActiveSubscription() {
        const container = document.getElementById('activeSubscriptionContent');
        if (!container) return;

        try {
            const response = await fetch('/api/subscriptions/active', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.activeSubscription = data.data;
                this.renderActiveSubscription();
            } else {
                container.innerHTML = '<p class="no-subscription">У вас нет активной подписки</p>';
            }
        } catch (error) {
            console.error('Error loading active subscription:', error);
            container.innerHTML = '<p class="error-message">Ошибка загрузки</p>';
        }
    }

    renderActiveSubscription() {
        const container = document.getElementById('activeSubscriptionContent');
        if (!container) return;

        if (!this.activeSubscription) {
            container.innerHTML = '<p class="no-subscription">У вас нет активной подписки</p>';
            return;
        }

        const endDate = new Date(this.activeSubscription.endDate);
        const now = new Date();
        const daysLeft = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));

        container.innerHTML = `
            <div class="active-subscription-card">
                <div class="subscription-badge active">Активна</div>
                <h3>${this.activeSubscription.service.name}</h3>
                <p class="subscription-description">${this.activeSubscription.service.description}</p>
                
                <div class="subscription-dates">
                    <div class="date-item">
                        <span class="date-label">Начало:</span>
                        <span class="date-value">${new Date(this.activeSubscription.startDate).toLocaleDateString()}</span>
                    </div>
                    <div class="date-item">
                        <span class="date-label">Окончание:</span>
                        <span class="date-value">${endDate.toLocaleDateString()}</span>
                    </div>
                </div>
                
                <div class="subscription-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${Math.min(100, (daysLeft / 30) * 100)}%"></div>
                    </div>
                    <span class="days-left">Осталось ${daysLeft} дн.</span>
                </div>
                
                <div class="subscription-benefits">
                    <h4>Включено:</h4>
                    <ul>
                        <li>✓ Неограниченные прогнозы на день</li>
                        <li>✓ Неограниченные прогнозы на неделю</li>
                        <li>✓ Неограниченные прогнозы на месяц</li>
                    </ul>
                </div>
                
                <button class="btn btn-outline btn-sm" onclick="subscriptionsApp.cancelSubscription()">
                    Отменить подписку
                </button>
            </div>
        `;
    }

    async loadAvailableSubscriptions() {
        const grid = document.getElementById('subscriptionsGrid');
        if (!grid) return;

        try {
            const response = await fetch('/api/services?category=subscription&active=true', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.availableSubscriptions = data.data;
                this.renderAvailableSubscriptions();
            }
        } catch (error) {
            console.error('Error loading subscriptions:', error);
        }
    }

    renderAvailableSubscriptions() {
        const grid = document.getElementById('subscriptionsGrid');
        if (!grid) return;

        if (!this.availableSubscriptions || this.availableSubscriptions.length === 0) {
            grid.innerHTML = '<p class="empty-message">Нет доступных подписок</p>';
            return;
        }

        grid.innerHTML = this.availableSubscriptions.map(sub => `
            <div class="subscription-card ${sub.duration === 30 ? 'popular' : ''}">
                ${sub.duration === 30 ? '<span class="card-badge">Популярное</span>' : ''}
                
                <h3>${sub.name}</h3>
                <p class="subscription-desc">${sub.description}</p>
                
                <div class="subscription-price">
                    <span class="price-amount">${sub.price} ₽</span>
                    <span class="price-period">/${sub.duration} дн.</span>
                </div>
                
                <ul class="subscription-features">
                    <li>✓ Прогноз на день</li>
                    <li>✓ Прогноз на неделю</li>
                    <li>✓ Прогноз на месяц</li>
                </ul>
                
                <button class="btn btn-primary btn-block" onclick="subscriptionsApp.buySubscription(${sub.id})">
                    Купить подписку
                </button>
            </div>
        `).join('');
    }

    async loadSubscriptionHistory() {
        const list = document.getElementById('subscriptionsList');
        if (!list) return;

        try {
            const response = await fetch('/api/subscriptions', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.history = data.data;
                this.renderSubscriptionHistory();
            }
        } catch (error) {
            console.error('Error loading subscription history:', error);
        }
    }

    renderSubscriptionHistory() {
        const list = document.getElementById('subscriptionsList');
        if (!list) return;

        if (!this.history || this.history.length === 0) {
            list.innerHTML = '<p class="empty-message">История подписок пуста</p>';
            return;
        }

        list.innerHTML = this.history.map(sub => `
            <div class="subscription-history-item ${sub.status}">
                <div class="history-icon">
                    <i class="fas fa-calendar-alt"></i>
                </div>
                <div class="history-info">
                    <div class="history-name">${sub.service.name}</div>
                    <div class="history-dates">
                        ${new Date(sub.startDate).toLocaleDateString()} — 
                        ${new Date(sub.endDate).toLocaleDateString()}
                    </div>
                </div>
                <div class="history-status ${sub.status}">
                    ${sub.status === 'active' ? 'Активна' :
            sub.status === 'expired' ? 'Истекла' : 'Отменена'}
                </div>
                <div class="history-price">${sub.price} ₽</div>
            </div>
        `).join('');
    }

    buySubscription(serviceId) {
        const subscription = this.availableSubscriptions.find(s => s.id === serviceId);

        const modal = document.getElementById('confirmModal');
        const body = document.getElementById('confirmBody');

        body.innerHTML = `
            <p>Вы хотите купить подписку <strong>"${subscription.name}"</strong>?</p>
            <p>Стоимость: <strong>${subscription.price} ₽</strong></p>
            <p>Длительность: <strong>${subscription.duration} дней</strong></p>
            <p class="warning">Средства будут списаны с вашего баланса</p>
        `;

        document.getElementById('confirmActionBtn').onclick = () => {
            this.confirmPurchase(serviceId);
        };

        modal.style.display = 'block';
    }

    async confirmPurchase(serviceId) {
        try {
            const response = await fetch('/api/subscriptions/buy', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ serviceId })
            });

            if (response.ok) {
                alert('Подписка успешно активирована!');
                this.closeConfirmModal();
                await this.loadActiveSubscription();
                await this.loadSubscriptionHistory();
            } else {
                const data = await response.json();
                alert(data.error || 'Ошибка при покупке подписки');
            }
        } catch (error) {
            console.error('Error buying subscription:', error);
            alert('Ошибка соединения');
        }
    }

    async cancelSubscription() {
        if (!confirm('Вы уверены, что хотите отменить подписку?')) return;

        try {
            const response = await fetch(`/api/subscriptions/${this.activeSubscription.id}/cancel`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                alert('Подписка отменена');
                await this.loadActiveSubscription();
                await this.loadSubscriptionHistory();
            } else {
                alert('Ошибка при отмене подписки');
            }
        } catch (error) {
            console.error('Error canceling subscription:', error);
            alert('Ошибка соединения');
        }
    }

    closeConfirmModal() {
        document.getElementById('confirmModal').style.display = 'none';
    }
}

// Инициализация
const subscriptionsApp = new SubscriptionsApp();
window.subscriptionsApp = subscriptionsApp;