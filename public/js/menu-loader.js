document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Загружаем мобильное меню
        const menuResponse = await fetch('/includes/menu.html');
        const menuHtml = await menuResponse.text();

        // Вставляем меню в начало body
        document.body.insertAdjacentHTML('afterbegin', menuHtml);

        // Загружаем десктопную навигацию
        const navResponse = await fetch('/includes/navigation.html');
        const navHtml = await navResponse.text();

        // Вставляем навигацию в header
        const navPlaceholder = document.querySelector('.header-content');
        if (navPlaceholder) {
            navPlaceholder.insertAdjacentHTML('beforeend', navHtml);
        }

        // Подсвечиваем активную страницу
        highlightActivePage();

        // Инициализируем обработчики меню
        initMenuHandlers();

    } catch (error) {
        console.error('Ошибка загрузки меню:', error);
    }
});

function highlightActivePage() {
    const currentPath = window.location.pathname;
    let page = 'home';

    if (currentPath.includes('/numerology')) page = 'numerology';
    else if (currentPath.includes('/natal-chart')) page = 'natal-chart';
    else if (currentPath.includes('/socionics')) page = 'socionics';
    else if (currentPath.includes('/astropsychology')) page = 'astropsychology';
    else if (currentPath.includes('/tarot')) page = 'tarot';

    document.querySelectorAll('.mobile-nav-link, .main-nav .nav-link').forEach(link => {
        if (link.dataset.page === page) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function initMenuHandlers() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuOverlay = document.querySelector('.menu-overlay');
    const closeBtn = document.querySelector('.mobile-menu-close');

    if (menuToggle && mobileMenu && menuOverlay) {
        const toggleMenu = () => {
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            menuOverlay.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        };

        menuToggle.addEventListener('click', toggleMenu);

        if (closeBtn) {
            closeBtn.addEventListener('click', toggleMenu);
        }

        menuOverlay.addEventListener('click', toggleMenu);

        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', toggleMenu);
        });

        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && mobileMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    }
}