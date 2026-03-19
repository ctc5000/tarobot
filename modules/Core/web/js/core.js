// modules/Core/web/js/core.js

class CoreApp {
    constructor() {
        this.user = null;
        this.init();
    }

    async init() {
        await this.checkAuth();
        this.initMobileMenu();
        this.renderMainNav();
        this.renderFooter();
    }

    async checkAuth() {
        const token = localStorage.getItem('token');
        if (!token) {
            this.updateAuthUI(false);
            return;
        }

        try {
            const response = await fetch('/api/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.user = data.data.user;
                this.updateAuthUI(true);
            } else {
                localStorage.removeItem('token');
                this.updateAuthUI(false);
            }
        } catch (error) {
            console.error('Auth check error:', error);
            this.updateAuthUI(false);
        }
    }

    updateAuthUI(isAuthenticated) {
        const authLinks = document.getElementById('authLinks');
        const mobileAuthButtons = document.getElementById('mobileAuthButtons');
        const guestBlock = document.getElementById('guestBlock');
        const tariffSection = document.getElementById('tariffSection');

        if (!authLinks) return;

        if (isAuthenticated && this.user) {
            // Десктоп
            const firstName = this.user.fullName.split(' ')[0] || this.user.fullName;
            authLinks.innerHTML = `
                <a href="/cabinet" class="auth-link">
                    <i class="fas fa-user-circle"></i>
                    <span>${firstName}</span>
                </a>
            `;

            // Мобильное меню
            if (mobileAuthButtons) {
                mobileAuthButtons.innerHTML = `
                    <a href="/cabinet" class="mobile-auth-link">
                        <i class="fas fa-user-circle"></i>
                        <span>Личный кабинет</span>
                    </a>
                    <button onclick="coreApp.logout()" class="mobile-auth-link logout">
                        <i class="fas fa-sign-out-alt"></i>
                        <span>Выйти</span>
                    </button>
                `;
            }

            if (guestBlock) guestBlock.style.display = 'none';
            if (tariffSection) tariffSection.style.display = 'block';

        } else {
            // Десктоп
            authLinks.innerHTML = `
                <a href="/login" class="btn btn-primary btn-sm">Войти</a>
                <!--<a href="/register" class="btn btn-primary btn-sm">Регистрация</a>-->
            `;

            // Мобильное меню
            if (mobileAuthButtons) {
                mobileAuthButtons.innerHTML = `
                    <a href="/login" class="mobile-auth-link">
                        <i class="fas fa-sign-in-alt"></i>
                        <span>Войти</span>
                    </a>
                    <a href="/register" class="mobile-auth-link register">
                        <i class="fas fa-user-plus"></i>
                        <span>Регистрация</span>
                    </a>
                `;
            }

            if (guestBlock) guestBlock.style.display = 'block';
            if (tariffSection) tariffSection.style.display = 'none';
        }

        this.renderMainNav();
    }

    renderMainNav() {
        const mainNav = document.getElementById('mainNav');
        if (!mainNav) return;

        const currentPath = window.location.pathname;
        const navItems = [
            { url: '/', name: 'Главная' },
            { url: '/numerology', name: 'Нумерология' },
            { url: '/tarot', name: 'Таро' },
            { url: '/natal-chart', name: 'Натальная карта' }
        ];

        if (this.user) {
            navItems.push({ url: '/cabinet', name: 'Кабинет' });
        }

        mainNav.innerHTML = navItems.map(item => `
            <a href="${item.url}" class="${currentPath === item.url ? 'active' : ''}">
                ${item.name}
            </a>
        `).join('');
    }

    renderFooter() {
        const footerLinks = document.getElementById('footerLinks');
        const footerSocial = document.getElementById('footerSocial');

        if (footerLinks) {
            footerLinks.innerHTML = `
                <a href="/about">О проекте</a>
                <a href="/privacy">Конфиденциальность</a>
                <a href="/contacts">Контакты</a>
            `;
        }

        if (footerSocial) {
            footerSocial.innerHTML = `
                <a href="#" class="social-link"><i class="fab fa-telegram"></i></a>
                <a href="#" class="social-link"><i class="fab fa-vk"></i></a>
                <a href="#" class="social-link"><i class="fab fa-youtube"></i></a>
            `;
        }
    }

    initMobileMenu() {
        const menuBtn = document.getElementById('mobileMenuBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        const closeBtn = document.getElementById('mobileMenuClose');
        const overlay = document.getElementById('menuOverlay');
        const mobileNav = document.getElementById('mobileNav');

        if (!menuBtn || !mobileMenu || !closeBtn || !overlay) return;

        if (mobileNav) {
            const currentPath = window.location.pathname;
            const navItems = [
                { url: '/', name: 'Главная', icon: 'fas fa-home' },
                { url: '/numerology', name: 'Нумерология', icon: 'fas fa-calculator' },
                { url: '/tarot', name: 'Таро', icon: 'fas fa-crown' },
                { url: '/natal-chart', name: 'Натальная карта', icon: 'fas fa-globe' }
            ];

            if (this.user) {
                navItems.push({ url: '/cabinet', name: 'Кабинет', icon: 'fas fa-user' });
            }

            mobileNav.innerHTML = navItems.map(item => `
                <a href="${item.url}" class="mobile-nav-link ${currentPath === item.url ? 'active' : ''}">
                    <i class="${item.icon}"></i>
                    <span>${item.name}</span>
                </a>
            `).join('');
        }

        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        const closeMenu = () => {
            mobileMenu.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        };

        closeBtn.addEventListener('click', closeMenu);
        overlay.addEventListener('click', closeMenu);
    }

    logout() {
        localStorage.removeItem('token');
        window.location.href = '/';
    }
}

// Инициализация
const coreApp = new CoreApp();
window.coreApp = coreApp;