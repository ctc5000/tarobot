// modules/Numerology/web/js/modules/uiHelpers.js
(function() {
    window.UIHelpers = {
        showNotification: function(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            const icon = type === 'error' ? 'exclamation-circle' : type === 'success' ? 'check-circle' : 'info-circle';
            notification.innerHTML = `<i class="fas fa-${icon}"></i><span>${message}</span>`;
            document.body.appendChild(notification);
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        },

        showLoading: function(loaderElement, formElement, isLoading) {
            if (loaderElement) loaderElement.style.display = isLoading ? 'flex' : 'none';
            if (formElement) {
                formElement.style.opacity = isLoading ? '0.5' : '1';
                formElement.style.pointerEvents = isLoading ? 'none' : 'auto';
            }
        },

        setElementText: function(id, value) {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value !== undefined && value !== null ? value : '—';
            }
        },

        showAuthModal: function() {
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
            modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
        },

        showPaymentModal: function(errorData) {
            const modal = document.createElement('div');
            modal.className = 'payment-modal';
            const requiredAmount = errorData.required || errorData.price || 0;
            const message = errorData.discount ? `<p style="color: #4caf50; margin: 10px 0;">✨ Скидка ${errorData.discount}% по подписке!</p>` : '';

            modal.innerHTML = `
                <div class="modal-content">
                    <i class="fas fa-coins modal-icon"></i>
                    <h3>Недостаточно средств</h3>
                    <p class="balance-info">
                        Баланс: <strong>${errorData.balance || 0} ₽</strong><br>
                        Требуется: <strong>${requiredAmount} ₽</strong>
                        ${errorData.oldPrice ? `<br><span class="price-old">Было: ${errorData.oldPrice} ₽</span>` : ''}
                    </p>
                    ${message}
                    <div class="modal-actions">
                        <a href="/cabinet/balance" class="btn btn-primary">Пополнить баланс</a>
                        <button class="btn btn-outline" onclick="this.closest('.payment-modal').remove()">Закрыть</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
        }
    };
})();