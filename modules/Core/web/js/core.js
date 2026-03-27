// modules/Core/web/js/core.js

class CoreApp {
    constructor() {
        this.user = null;
        this.init();
    }

    async init() {
        await this.checkAuth();
        this.initMobileMenu();
        this.loadMenuData();
        this.renderMainNav();
        this.renderFooter();
    }

    async loadMenuData() {
        try {
            // Загружаем меню из JSON файлов
            const [mainMenu, mobileMenu, footerMenu] = await Promise.all([fetch('/core/menu.json').then(res => res.json()), fetch('/core/mobile-menu.json').then(res => res.json()), fetch('/core/menu.json').then(res => res.json()) // footer берем из основного меню
            ]);

            this.menuData = mainMenu;
            this.mobileMenuData = mobileMenu;
            this.footerData = mainMenu.footer;

            this.renderMainNav();
            this.renderMobileNav();
            this.renderFooter();
        } catch (error) {
            console.error('Error loading menu data:', error);
            this.renderFallbackMenu();
        }
    }

    renderMainNav() {
        const mainNav = document.getElementById('mainNav');
        if (!mainNav || !this.menuData) return;

        mainNav.innerHTML = this.menuData.mainNav.map(item => `
            <a href="${item.url}" class="${this.isActive(item.url) ? 'active' : ''}">
                ${item.icon ? `<span class="nav-icon">${item.icon}</span>` : ''}
                ${item.name}
            </a>
        `).join('');
    }

    renderMobileNav() {
        const mobileNav = document.getElementById('mobileNav');
        if (!mobileNav || !this.mobileMenuData) return;

        let html = '';

        this.mobileMenuData.sections.forEach(section => {
            html += `<div class="mobile-section">`;
            html += `<h3 class="mobile-section-title">${section.title}</h3>`;

            section.items.forEach(item => {
                // Проверяем, нужно ли показывать пункт в зависимости от авторизации
                if (item.auth && !localStorage.getItem('token')) return;
                if (item.guest && localStorage.getItem('token')) return;

                html += `
                    <a href="${item.url}" class="mobile-nav-link ${this.isActive(item.url) ? 'active' : ''}">
                        <span class="nav-icon">${item.icon}</span>
                        <span class="nav-text">${item.name}</span>
                    </a>
                `;
            });

            html += `</div>`;
        });

        mobileNav.innerHTML = html;
    }

    renderFooter() {
        const footerInfo = document.querySelector('.footer-info p');
        const footerLinks = document.querySelector('.footer-links');
        const footerBottom = document.querySelector('.footer-bottom p');

        if (footerInfo && this.footerData) {
            footerInfo.textContent = this.footerData.description;
        }

        if (footerLinks && this.footerData) {
            footerLinks.innerHTML = this.footerData.links.map(link => `<a href="${link.url}">${link.name}</a>`).join('');
        }

        if (footerBottom && this.footerData) {
            footerBottom.textContent = this.footerData.copyright;
        }

        // Добавляем социальные иконки если есть контейнер
        const socialContainer = document.querySelector('.footer-social');
        if (socialContainer && this.footerData?.social) {
            socialContainer.innerHTML = this.footerData.social.map(social => `
                <a href="${social.url}" target="_blank" rel="noopener" class="social-link">
                    <i class="${social.icon}"></i>
                </a>
            `).join('');
        }
    }

    isActive(url) {
        if (url === '/' && window.location.pathname === '/') return true;
        if (url !== '/' && window.location.pathname.startsWith(url)) return true;
        return false;
    }

    initMobileMenu() {
        const menuToggle = document.getElementById('menuToggle');
        const mobileMenu = document.getElementById('mobileMenu');
        const menuOverlay = document.getElementById('menuOverlay');
        const mobileMenuClose = document.getElementById('mobileMenuClose');

        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                mobileMenu.classList.add('active');
                menuOverlay.classList.add('active');
                menuToggle.classList.add('active');
            });
        }

        if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                menuOverlay.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        }

        if (menuOverlay) {
            menuOverlay.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                menuOverlay.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        }
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
            const firstNameInitial = this.user.fullName.split(' ')[0]?.charAt(0) || '';
            const lastNameInitial = this.user.fullName.split(' ')[1]?.charAt(0) || '';
            const initials = firstNameInitial + lastNameInitial;
            authLinks.innerHTML = `
                <a href="/cabinet" class="auth-link">
                    <i class="fas fa-user-circle"></i>
                    <span>${initials}</span>
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


    logout() {
        localStorage.removeItem('token');
        window.location.href = '/';
    }

    initMetrika() {
        // Проверяем, что Метрика еще не инициализирована
        if (typeof window.ym !== 'undefined') {
            console.log('Yandex.Metrika already initialized');
            return;
        }

        // Создаем скрипт динамически
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = 'https://mc.yandex.ru/metrika/tag.js?id=107722589';

        // Добавляем обработчик загрузки скрипта
        script.onload = () => {
            // Инициализируем счетчик
            if (typeof window.ym === 'function') {
                window.ym(107722589, 'init', {
                    ssr: true,
                    webvisor: true,
                    clickmap: true,
                    ecommerce: "dataLayer",
                    referrer: document.referrer,
                    url: location.href,
                    accurateTrackBounce: true,
                    trackLinks: true
                });
                console.log('Yandex.Metrika initialized');
            }
        };

        script.onerror = (error) => {
            console.error('Failed to load Yandex.Metrika:', error);
        };

        // Добавляем скрипт в head
        document.head.appendChild(script);

        // Добавляем noscript fallback
        const noscript = document.createElement('noscript');
        noscript.innerHTML = `<div><img src="https://mc.yandex.ru/watch/107722589" style="position:absolute; left:-9999px;" alt="" /></div>`;
        document.body.appendChild(noscript);
        console.log("metrika inited");
    }
}

// Инициализация
const coreApp = new CoreApp();
window.coreApp = coreApp;