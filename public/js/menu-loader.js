/**
 * Загрузчик меню для всех страниц
 * Автоматически загружает меню и подсвечивает активную страницу
 */
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Загружаем меню
        await loadMenu();

        // Подсвечиваем активную страницу
        highlightActivePage();

        // Инициализируем обработчики меню
        initMenuHandlers();

    } catch (error) {
        console.error('Ошибка загрузки меню:', error);
    }
});

/**
 * Загрузка меню из файлов
 */
async function loadMenu() {
    // Загружаем мобильное меню
    const mobileResponse = await fetch('/includes/menu.html');
    const mobileHtml = await mobileResponse.text();

    // Загружаем десктопную навигацию
    const desktopResponse = await fetch('/includes/navigation.html');
    const desktopHtml = await desktopResponse.text();

    // Вставляем меню в нужные места
    // Мобильное меню вставляем после открывающего body
    const body = document.body;
    body.insertAdjacentHTML('afterbegin', mobileHtml);

    // Десктопную навигацию вставляем в header
    const header = document.querySelector('.mystic-header');
    if (header) {
        header.insertAdjacentHTML('beforeend', desktopHtml);
    }
}

/**
 * Подсветка активной страницы
 */
function highlightActivePage() {
    const currentPath = window.location.pathname;
    let page = 'home';

    // Определяем текущую страницу
    if (currentPath.includes('/numerology')) page = 'numerology';
    else if (currentPath.includes('/natal-chart')) page = 'natal-chart';
    else if (currentPath.includes('/rodology')) page = 'rodology';
    else if (currentPath.includes('/iching')) page = 'iching';
    else if (currentPath.includes('/daliuren')) page = 'daliuren';
    else if (currentPath.includes('/hermetic')) page = 'hermetic';
    else if (currentPath.includes('/zoar')) page = 'zoar';
    else if (currentPath.includes('/socionics')) page = 'socionics';
    else if (currentPath.includes('/astropsychology')) page = 'astropsychology';
    else if (currentPath.includes('/runes')) page = 'runes';

    // Подсвечиваем ссылки в мобильном меню
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        if (link.dataset.page === page) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Подсвечиваем ссылки в десктопной навигации
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.dataset.page === page) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * Инициализация обработчиков меню
 */
function initMenuHandlers() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuOverlay = document.querySelector('.menu-overlay');

    if (menuToggle && mobileMenu && menuOverlay) {
        function toggleMenu() {
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            menuOverlay.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        }

        menuToggle.addEventListener('click', toggleMenu);
        menuOverlay.addEventListener('click', toggleMenu);

        // Закрываем меню при клике на ссылку
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', toggleMenu);
        });

        // Закрываем меню при изменении размера окна
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && mobileMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    }
}