// modules/Core/web/js/core.js

class CoreApp {
    constructor() {
        this.menuData = null;
        this.mobileMenuData = null;
        this.footerData = null;
        this.init();
    }

    async init() {
        await this.loadMenuData();
        this.initMobileMenu();
        this.checkAuth();
        this.loadPractices();
    }

    async loadMenuData() {
        try {
            // Загружаем меню из JSON файлов
            const [mainMenu, mobileMenu, footerMenu] = await Promise.all([
                fetch('/core/menu.json').then(res => res.json()),
                fetch('/core/mobile-menu.json').then(res => res.json()),
                fetch('/core/menu.json').then(res => res.json()) // footer берем из основного меню
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
            footerLinks.innerHTML = this.footerData.links.map(link =>
                `<a href="${link.url}">${link.name}</a>`
            ).join('');
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

    renderFallbackMenu() {
        // Запасной вариант если JSON не загрузился
        const mainNav = document.getElementById('mainNav');
        if (mainNav) {
            mainNav.innerHTML = `
                <a href="/">Главная</a>
                <a href="/numerology">Нумерология</a>
                <a href="/tarot">Таро</a>
                <a href="/cabinet">Кабинет</a>
            `;
        }
    }

    async checkAuth() {
        const token = localStorage.getItem('token');
        const authLinks = document.querySelector('.auth-links');
        const mobileFooter = document.querySelector('.mobile-menu-footer .auth-buttons');

        if (token) {
            try {
                const response = await fetch('/api/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    this.updateAuthUI(true, data.data.user);
                } else {
                    localStorage.removeItem('token');
                    this.updateAuthUI(false);
                }
            } catch (error) {
                console.error('Auth check error:', error);
                this.updateAuthUI(false);
            }
        } else {
            this.updateAuthUI(false);
        }
    }

    updateAuthUI(isAuthenticated, user = null) {
        const authLinks = document.querySelector('.auth-links');
        const mobileFooter = document.querySelector('.mobile-menu-footer .auth-buttons');

        if (isAuthenticated && user) {
            // Десктоп - только иконки, имя по hover
            if (authLinks) {
                authLinks.innerHTML = `
                <a href="/cabinet" class="btn btn-outline btn-sm" title="${user.fullName}">
                    <i class="fas fa-user"></i>
                </a>
              <!--  <button class="btn btn-primary btn-sm" onclick="coreApp.logout()" title="Выйти">
                    <i class="fas fa-sign-out-alt"></i>
                </button>-->
            `;
            }
        } else {
            if (authLinks) {
                authLinks.innerHTML = `
                <a href="/login" class="btn btn-outline btn-sm" title="Войти">
                    <i class="fas fa-sign-in-alt"></i>
                </a>
                <a href="/register" class="btn btn-primary btn-sm" title="Регистрация">
                    <i class="fas fa-user-plus"></i>
                </a>
            `;
            }
        }
    }

    logout() {
        localStorage.removeItem('token');
        window.location.href = '/';
    }

    async loadPractices() {
        const grid = document.getElementById('practicesGrid');
        if (!grid) return;

        const practices = [
            { icon: '🔢', name: 'Нумерология', desc: 'Магия чисел и коды судьбы', link: '/numerology' },
            { icon: '🌠', name: 'Натальная карта', desc: 'Астрологический портрет личности', link: '/natal-chart' },
            { icon: '🎴', name: 'Таро', desc: 'Древняя система предсказаний', link: '/tarot' },
            { icon: '🧠', name: 'Соционика', desc: 'Типы личности и взаимоотношения', link: '/socionics' },
            { icon: '🌞', name: 'Астропсихология', desc: 'Связь небесных тел и психики', link: '/astropsychology' },
            { icon: 'ᚠ', name: 'Руны', desc: 'Древние символы силы', link: '/runes' },
            { icon: '🌳', name: 'Родология', desc: 'Связь с родом и предками', link: '/rodology' },
            { icon: '📜', name: 'И-Цзин', desc: 'Китайская книга перемен', link: '/iching' }
        ];

        grid.innerHTML = practices.map(p => `
            <a href="${p.link}" class="practice-card">
                <div class="card-icon">${p.icon}</div>
                <h3>${p.name}</h3>
                <p>${p.desc}</p>
                <span class="card-link">Узнать больше →</span>
            </a>
        `).join('');
    }
}

// Инициализация
const coreApp = new CoreApp();
window.coreApp = coreApp;