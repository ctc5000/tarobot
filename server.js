// server.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

// Импорт сервисов
const NumerologyService = require('./services/numerology');
const ZodiacService = require('./services/zodiacService');
const FengShuiService = require('./services/fengShuiService');
const TarotService = require('./services/tarotService');
const PsychologyService = require('./services/psychologyService');
const RodologyService = require('./services/rodologyService');
const IChingService = require('./services/ichingService');
const DaLiuRenService = require('./services/daliurenService');
const HermeticService = require('./services/hermeticService');
const ZoarService = require('./services/zoarService');
const SocionicsService = require('./services/socionicsService');
const AstropsychologyService = require('./services/astropsychologyService');
const RunesService = require('./services/runesService');
const NatalChartSimpleService = require('./services/natalChartSimpleService');
const PDFGeneratorService = require('./services/pdfGeneratorService');
const pdfGenerator = new PDFGeneratorService();

// Инициализация сервисов
const services = {
    numerology: new NumerologyService(),
    zodiac: new ZodiacService(),
    fengShui: new FengShuiService(),
    tarot: new TarotService(),
    psychology: new PsychologyService(),
    rodology: new RodologyService(),
    iching: new IChingService(),
    daliuren: new DaLiuRenService(),
    hermetic: new HermeticService(),
    zoar: new ZoarService(),
    socionics: new SocionicsService(),
    astropsychology: new AstropsychologyService(),
    runes: new RunesService(),
    natalChart: new NatalChartSimpleService()
};

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Статические файлы
app.use(express.static(path.join(__dirname, 'public')));

// ==================== МИДЛВАРЫ ====================

// Мидлвар для определения источника (Telegram/Web)
app.use((req, res, next) => {
    const userAgent = req.get('User-Agent') || '';
    res.locals.isTelegram = userAgent.includes('Telegram') ||
        req.query.telegram === 'true' ||
        req.headers.referer?.includes('t.me');
    next();
});

// Мидлвар для заголовков кеширования
app.use((req, res, next) => {
    if (req.url.endsWith('.html') ||
        req.url === '/' ||
        req.url.startsWith('/api/')) {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
    }
    else if (req.url.match(/\.(css|js)$/)) {
        res.setHeader('Cache-Control', 'public, max-age=300');
    }
    next();
});

// ==================== СТАТИЧЕСКИЕ СТРАНИЦЫ ====================

// Главная страница
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Страницы практик
const pages = [
    'numerology', 'rodology', 'iching', 'daliuren', 'hermetic',
    'zoar', 'socionics', 'astropsychology', 'runes', 'natal-chart', 'tarot'
];

pages.forEach(page => {
    app.get(`/${page}`, (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'pages', `${page}.html`));
    });
});

// ==================== API МАРШРУТЫ ====================
/**
 * API для генерации PDF отчета по нумерологии
 */
app.post('/api/numerology/pdf', async (req, res) => {
    try {
        const { fullName, birthDate, data } = req.body;

        console.log('📄 Запрос на генерацию PDF для:', fullName);

        if (!fullName || !birthDate || !data) {
            return res.status(400).json({
                success: false,
                error: 'Необходимы данные для генерации отчета'
            });
        }

        // Добавляем полное имя и дату в данные
        const reportData = {
            ...data,
            fullName,
            birthDate
        };

        console.log('📄 Генерация PDF...');
        const pdfBuffer = await pdfGenerator.generateNumerologyPDF(reportData);
        console.log('📄 PDF сгенерирован, размер:', pdfBuffer.length, 'байт');

        // Функция для транслитерации
        function transliterate(text) {
            const ru = {
                'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
                'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
                'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
                'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '',
                'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
                'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'E',
                'Ж': 'Zh', 'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M',
                'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U',
                'Ф': 'F', 'Х': 'H', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sch', 'Ъ': '',
                'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya',
                ' ': '_', '-': '_', '.': '_'
            };
            return text.split('').map(char => ru[char] || char).join('');
        }

        // Функция для создания безопасного имени файла
        function createSafeFileName(name) {
            // Транслитерируем
            let safe = transliterate(name);

            // Заменяем все не-буквы и не-цифры на подчеркивание
            safe = safe.replace(/[^a-zA-Z0-9]/g, '_');

            // Убираем множественные подчеркивания
            safe = safe.replace(/_+/g, '_');

            // Убираем подчеркивания в начале и конце
            safe = safe.replace(/^_+|_+$/g, '');

            // Ограничиваем длину
            safe = safe.substring(0, 50);

            // Если имя пустое, используем timestamp
            if (!safe || safe.length === 0) {
                safe = `report-${Date.now()}`;
            }

            return safe;
        }

        // Создаем имя файла
        const safeFileName = createSafeFileName(fullName);
        const fileName = `numerology-${safeFileName}.pdf`;

        console.log('📄 Имя файла для отправки (чистое):', fileName);

        // Отправляем PDF - используем writeHead для большей надежности
        res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${fileName}"`,
            'Content-Length': pdfBuffer.length,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        });

        res.end(pdfBuffer);

        console.log('✅ PDF успешно отправлен');

    } catch (error) {
        console.error('❌ Ошибка генерации PDF:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
/**
 * API для получения версии приложения
 */
app.get('/api/version', (req, res) => {
    res.json({
        version: res.locals.isTelegram ? 'telegram' : 'web',
        timestamp: Date.now(),
        build: process.env.BUILD_NUMBER || '1.0.0'
    });
});

/**
 * API для расчета нумерологии (ПОЛНЫЙ ОТЧЕТ, БЕЗ PREVIEW)
 */
app.post('/api/calculate/numerology', async (req, res) => {
    try {
        const { fullName, birthDate } = req.body;

        // Валидация
        if (!fullName || !birthDate) {
            return res.status(400).json({
                success: false,
                error: 'Необходимо указать ФИО и дату рождения'
            });
        }

        const nameParts = fullName.trim().split(/\s+/);
        if (nameParts.length < 3) {
            return res.status(400).json({
                success: false,
                error: 'Необходимо указать фамилию, имя и отчество'
            });
        }

        const [surname, firstName, patronymic] = nameParts;

        // 1. Базовый нумерологический расчет
        const numerology = services.numerology.calculate(surname, firstName, patronymic, birthDate);

        // 2. Расчет знака зодиака
        const zodiac = services.zodiac.calculate(birthDate);

        // 3. Расчет фен-шуй
        const fengShui = services.fengShui.calculate(birthDate);

        // 4. Расчет карт Таро (ГАРАНТИРОВАННО УНИКАЛЬНЫЕ)
        const tarot = services.tarot.calculateFromNumbers({
            fate: numerology.base.fate,
            name: numerology.base.name,
            surname: numerology.base.surname,
            patronymic: numerology.base.patronymic
        });

        // 5. Психологический портрет (ПОЛНЫЙ)
        const psychology = services.psychology.generatePortrait(numerology, zodiac, fengShui, tarot);

        // 6. Паттерны личности (ПОЛНЫЕ)
        const patterns = services.numerology.generatePatterns(
            numerology,
            zodiac,
            fengShui,
            tarot,
            psychology
        );

        // 7. Дополнительные интерпретации (ПОЛНЫЕ)
        const interpretations = services.numerology.getInterpretations(numerology.base);

        // Формируем ПОЛНЫЙ ответ
        const responseData = {
            success: true,
            data: {
                fullName,
                birthDate,
                numerology: {
                    base: numerology.base,
                    achilles: numerology.achilles,
                    control: numerology.control,
                    calls: numerology.calls,
                    interpretations // ← ПОЛНЫЕ интерпретации
                },
                zodiac,
                fengShui,
                tarot,
                psychology, // ← ПОЛНЫЙ психологический портрет
                patterns // ← ПОЛНЫЕ паттерны
            }
        };

        res.json(responseData);

    } catch (error) {
        console.error('❌ Ошибка в /api/calculate/numerology:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * API для расчета натальной карты
 */
app.post('/api/calculate/natal-chart', (req, res) => {
    try {
        const result = services.natalChart.calculate(req.body);
        res.json(result);
    } catch (error) {
        console.error('❌ Ошибка расчета натальной карты:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * API для гадания на Таро
 */
app.post('/api/tarot/reading', (req, res) => {
    try {
        const { question, spread } = req.body;

        if (!question) {
            return res.status(400).json({
                success: false,
                error: 'Не указан вопрос'
            });
        }

        const result = services.tarot.performReading(question, spread || 'three');
        res.json(result);
    } catch (error) {
        console.error('❌ Ошибка в /api/tarot/reading:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * API для быстрого гадания на Таро (5 карт)
 */
app.post('/api/tarot/quick', (req, res) => {
    try {
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({
                success: false,
                error: 'Не указан вопрос'
            });
        }

        const result = services.tarot.performReading(question, 'five');
        res.json(result);
    } catch (error) {
        console.error('❌ Ошибка в /api/tarot/quick:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * УНИВЕРСАЛЬНЫЙ API для всех остальных практик
 */
app.post('/api/calculate/:practice', (req, res) => {
    try {
        const { practice } = req.params;
        const data = req.body;

        if (!services[practice]) {
            return res.status(404).json({
                success: false,
                error: 'Практика не найдена'
            });
        }

        let result;

        switch(practice) {
            case 'rodology':
                result = services.rodology.calculate(data);
                res.json({ success: true, data: result });
                break;

            case 'iching':
                result = services.iching.calculate(data);
                res.json({ success: true, data: result });
                break;

            case 'daliuren':
                result = services.daliuren.calculate(data);
                res.json({ success: true, data: result });
                break;

            case 'hermetic':
                result = services.hermetic.calculate(data);
                res.json({ success: true, data: result });
                break;

            case 'zoar':
                result = services.zoar.calculate(data);
                res.json({ success: true, data: result });
                break;

            case 'socionics':
                result = services.socionics.calculate(data);
                res.json(result);
                break;

            case 'astropsychology':
                result = services.astropsychology.calculate(data);
                res.json(result);
                break;

            case 'runes':
                result = services.runes.calculate(data);
                res.json({ success: true, data: result });
                break;

            default:
                return res.status(400).json({
                    success: false,
                    error: 'Неизвестная практика'
                });
        }

    } catch (error) {
        console.error(`❌ Ошибка в /api/calculate/${req.params.practice}:`, error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ==================== ОБРАБОТКА 404 ====================

/**
 * Обработка 404 для всех остальных маршрутов
 */
app.use('*', (req, res) => {
    if (req.url.startsWith('/api/')) {
        res.status(404).json({
            success: false,
            error: 'API маршрут не найден'
        });
    } else {
        // Если файл 404.html не существует, отправляем простой текст
        res.status(404).send(`
            <!DOCTYPE html>
            <html lang="ru">
            <head>
                <meta charset="UTF-8">
                <title>404 - Страница не найдена</title>
                <style>
                    body { font-family: Arial; text-align: center; padding: 50px; background: #0a0a0f; color: #e5e5e5; }
                    h1 { color: #c9a54b; font-size: 60px; margin-bottom: 20px; }
                    a { color: #c9a54b; text-decoration: none; }
                </style>
            </head>
            <body>
                <h1>404</h1>
                <p>Страница не найдена</p>
                <a href="/">Вернуться на главную</a>
            </body>
            </html>
        `);
    }
});

// ==================== ЗАПУСК СЕРВЕРА ====================

app.listen(PORT, () => {
    console.log('\n✨ =============================================== ✨');
    console.log(`   🚀 Мистический сервер запущен на порту ${PORT}`);
    console.log(`   🔗 Локальный доступ: http://localhost:${PORT}`);
    console.log('✨ =============================================== ✨\n');

    console.log('📚 Доступные практики:');
    console.log('   ────────────────────────────────────────────────');
    console.log(`   🔢 Нумерология:        http://localhost:${PORT}/numerology`);
    console.log(`   🌠 Натальная карта:    http://localhost:${PORT}/natal-chart`);
    console.log(`   🎴 Таро:               http://localhost:${PORT}/tarot`);
    console.log(`   🧠 Соционика:          http://localhost:${PORT}/socionics`);
    console.log(`   🌞 Астропсихология:    http://localhost:${PORT}/astropsychology`);
    console.log(`   ᚠ Руны:                http://localhost:${PORT}/runes`);
    console.log(`   🌳 Родология:          http://localhost:${PORT}/rodology`);
    console.log(`   📜 И-Цзин:              http://localhost:${PORT}/iching`);
    console.log(`   🌀 Да Лю Жэнь:          http://localhost:${PORT}/daliuren`);
    console.log(`   ⚜️ Герметизм:           http://localhost:${PORT}/hermetic`);
    console.log(`   📖 Зоар:                http://localhost:${PORT}/zoar`);
    console.log('   ────────────────────────────────────────────────\n');

    console.log('📡 API маршруты:');
    console.log('   ────────────────────────────────────────────────');
    console.log('   POST /api/calculate/numerology     - расчет нумерологии (ПОЛНЫЙ ОТЧЕТ)');
    console.log('   POST /api/calculate/natal-chart    - натальная карта');
    console.log('   POST /api/tarot/reading            - гадание на Таро');
    console.log('   POST /api/tarot/quick              - быстрый расклад (5 карт)');
    console.log('   POST /api/calculate/:practice      - универсальный API');
    console.log('   GET  /api/version                   - версия приложения');
    console.log('   ────────────────────────────────────────────────\n');

    console.log('✅ Сервер успешно запущен и готов к работе!\n');
});

// ==================== ОБРАБОТКА ЗАВЕРШЕНИЯ ====================

process.on('SIGINT', () => {
    console.log('\n👋 Получен сигнал SIGINT, останавливаем сервер...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n👋 Получен сигнал SIGTERM, останавливаем сервер...');
    process.exit(0);
});