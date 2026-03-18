// modules/Core/web/js/auth.js

class AuthApp {
    constructor() {
        this.init();
    }

    init() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const resetForm = document.getElementById('resetForm');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        if (resetForm) {
            resetForm.addEventListener('submit', (e) => this.handleReset(e));
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        const form = e.target;
        const email = form.querySelector('#email').value;
        const password = form.querySelector('#password').value;

        try {
            const response = await fetch('/api/core/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.success) {
                console.log('Токен сохранен:', data.data.token); // Проверь в консоли браузера
                localStorage.setItem('token', data.data.token);
                window.location.href = '/cabinet';
            } else {
                this.showError(data.error || 'Ошибка входа');
            }
        } catch (error) {
            this.showError('Ошибка соединения');
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        const form = e.target;
        const data = {
            email: form.querySelector('#email').value,
            password: form.querySelector('#password').value,
            fullName: form.querySelector('#fullName').value,
            birthDate: form.querySelector('#birthDate').value
        };

        try {
            const response = await fetch('/api/core/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                alert('Регистрация успешна! Теперь вы можете войти.');
                window.location.href = '/login';
            } else {
                this.showError(result.error || 'Ошибка регистрации');
            }
        } catch (error) {
            this.showError('Ошибка соединения');
        }
    }

    showError(message) {
        const errorDiv = document.getElementById('errorMessage') || document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;

        const form = document.querySelector('.auth-form');
        form.prepend(errorDiv);

        setTimeout(() => errorDiv.remove(), 5000);
    }
}

// Инициализация на страницах авторизации
if (window.location.pathname.includes('/login') ||
    window.location.pathname.includes('/register') ||
    window.location.pathname.includes('/reset-password')) {
    new AuthApp();
}