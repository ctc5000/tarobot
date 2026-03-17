// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yaml');
const basicAuth = require('express-basic-auth');
const { Umzug, SequelizeStorage } = require('umzug');

// Импорт sequelize
const { sequelize, Sequelize, models } = require('./sequelize');

// Импорт глобального логгера
const logger = require('./logger');

// ==================== ИМПОРТ СЕРВИСОВ (из старого сервера) ====================
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

// ==================== НАСТРОЙКА ====================

process.env.TZ = 'Europe/Samara';

const upload = multer({ dest: '/app/uploads/' });
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(cors());

// ==================== СТАТИЧЕСКИЕ ФАЙЛЫ ====================
// Это должно быть ПЕРЕД маршрутами, но ПОСЛЕ middleware
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

// Мидлвар для CSP (Content Security Policy) - ОБНОВЛЕННЫЙ
app.use((req, res, next) => {
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com https://mc.yandex.ru https://yandex.ru; " +
        "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com; " +
        "font-src 'self' data: https://cdnjs.cloudflare.com https://fonts.gstatic.com; " +
        "img-src 'self' data: https:; " +
        "connect-src 'self' ws: wss: https://mc.yandex.ru;"
    );
    next();
});

// Swagger
try {
    const swaggerFile = fs.readFileSync('./tarot.yaml', 'utf8');
    const swaggerDocument = YAML.parse(swaggerFile);
    app.use('/api-docs', basicAuth({
        users: { 'admin': 'seo123' },
        challenge: true,
        unauthorizedResponse: 'Unauthorized'
    }));
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    console.log('✅ Swagger UI доступен по адресу /api-docs');
} catch (error) {
    console.error('❌ Ошибка загрузки Swagger:', error.message);
}

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================

function makeHandlerAwareOfAsyncErrors(handler) {
    return async function (req, res, next) {
        try {
            await handler(req, res);
        } catch (error) {
            next(error);
        }
    };
}

// ==================== API МАРШРУТЫ (прямые, без модулей) ====================

/**
 * API для получения версии приложения
 */
app.get('/api/version', (req, res) => {
    logger.info('api', 'Запрос версии API', { ip: req.ip });
    res.json({
        version: res.locals.isTelegram ? 'telegram' : 'web',
        timestamp: Date.now(),
        build: process.env.BUILD_NUMBER || '1.0.0'
    });
});

/**
 * API для расчета нумерологии (ПОЛНЫЙ ОТЧЕТ)
 */
app.post('/api/calculate/numerology', async (req, res) => {
    try {
        const { fullName, birthDate } = req.body;

        // Валидация
        if (!fullName || !birthDate) {
            logger.warn('numerology', 'Неполные данные для расчета', { fullName, birthDate });
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

        // 4. Расчет карт Таро
        const tarot = services.tarot.calculateFromNumbers({
            fate: numerology.base.fate,
            name: numerology.base.name,
            surname: numerology.base.surname,
            patronymic: numerology.base.patronymic
        });

        // 5. Психологический портрет
        const psychology = services.psychology.generatePortrait(numerology, zodiac, fengShui, tarot);

        // 6. Паттерны личности
        const patterns = services.numerology.generatePatterns(
            numerology,
            zodiac,
            fengShui,
            tarot,
            psychology
        );

        // 7. Дополнительные интерпретации
        const interpretations = services.numerology.getInterpretations(numerology.base);

        logger.info('numerology', 'Успешный расчет нумерологии', { fullName, birthDate });

        res.json({
            success: true,
            data: {
                fullName,
                birthDate,
                numerology: {
                    base: numerology.base,
                    achilles: numerology.achilles,
                    control: numerology.control,
                    calls: numerology.calls,
                    interpretations
                },
                zodiac,
                fengShui,
                tarot,
                psychology,
                patterns
            }
        });

    } catch (error) {
        logger.error('numerology', 'Ошибка расчета нумерологии', { error: error.message });
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
        logger.info('natal-chart', 'Расчет натальной карты выполнен');
        res.json(result);
    } catch (error) {
        logger.error('natal-chart', 'Ошибка расчета натальной карты', { error: error.message });
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
        logger.info('tarot', 'Гадание на Таро выполнено', { spread });
        res.json(result);
    } catch (error) {
        logger.error('tarot', 'Ошибка гадания на Таро', { error: error.message });
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
        logger.info('tarot', 'Быстрое гадание на Таро выполнено');
        res.json(result);
    } catch (error) {
        logger.error('tarot', 'Ошибка быстрого гадания', { error: error.message });
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
            logger.warn('api', 'Практика не найдена', { practice });
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

        logger.info('api', `Расчет ${practice} выполнен`);

    } catch (error) {
        logger.error('api', `Ошибка расчета ${req.params.practice}`, { error: error.message });
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ==================== ПЛАТЕЖНЫЕ ЭНДПОИНТЫ ====================

const useAmeriaPay = process.env.AMERIAPAY === 'true';

app.get('/api/payments/module', (req, res) => {
    res.json({
        active: useAmeriaPay ? 'ameriabank' : 'youpay',
        ameriapay: useAmeriaPay
    });
});

app.get('/api/payments/create', makeHandlerAwareOfAsyncErrors(async (req, res) => {
    const { id, type = 'card', tips = 0, lang = 'ru' } = req.query;

    if (!id) {
        return res.status(400).json({ success: false, error: 'Order ID is required' });
    }

    try {
        if (useAmeriaPay) {
            const AmeriaBankCntrl = require('./modules/AmeriaBank/Controllers/AmeriaBankCntrl');
            const controller = new AmeriaBankCntrl();
            const result = await controller.createPayment({ id, type, tips, lang });
            res.json(result);
        } else {
            const PaymentsCntrl = require('./modules/Payments/Controllers/PaymentsCntrl');
            const controller = new PaymentsCntrl();
            const result = await controller.CreateLinqFullById({
                id,
                type,
                tips,
                commission: "false"
            });
            res.json(result);
        }
    } catch (error) {
        console.error('Error in universal payment endpoint:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}));

app.get('/api/payments/check', makeHandlerAwareOfAsyncErrors(async (req, res) => {
    const { id, paymentId, orderId } = req.query;
    const checkId = paymentId || id;

    if (!checkId && !orderId) {
        return res.status(400).json({
            success: false,
            error: 'Payment ID or Order ID is required'
        });
    }

    try {
        if (useAmeriaPay) {
            const AmeriaBankCntrl = require('./modules/AmeriaBank/Controllers/AmeriaBankCntrl');
            const controller = new AmeriaBankCntrl();

            if (checkId) {
                const result = await controller.checkTransactionStatus(checkId);
                res.json(result);
            } else if (orderId) {
                const transactions = await controller.getOrderTransactions(orderId);
                if (transactions && transactions.length > 0) {
                    const result = await controller.checkTransactionStatus(transactions[0].paymentId);
                    res.json(result);
                } else {
                    res.json({ success: false, error: 'No transactions found for order' });
                }
            }
        } else {
            const PaymentsCntrl = require('./modules/Payments/Controllers/PaymentsCntrl');
            const controller = new PaymentsCntrl();

            if (orderId) {
                const result = await controller.CheckTransactionByOrder(orderId);
                res.json(result);
            } else {
                res.json({ success: false, error: 'Order ID required for YouPay' });
            }
        }
    } catch (error) {
        console.error('Error in universal check endpoint:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}));

// ==================== ЗАГРУЗКА ФАЙЛОВ ====================

app.post('/api/upload', upload.single('photo'), async (req, res) => {
    const fs = require('fs');
    const path = require('path');
    const { pipeline } = require('stream/promises');
    const { exec } = require('child_process');

    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        const timestamp = Date.now();
        const targetDir = '/img';
        const newFilename = `${timestamp}_${req.file.originalname}`;
        const newPath = path.join(targetDir, newFilename);

        await new Promise((resolve, reject) => {
            exec(`mkdir -p ${targetDir}`, (error) => {
                if (error) reject(error);
                else resolve();
            });
        });

        await pipeline(
            fs.createReadStream(req.file.path),
            fs.createWriteStream(newPath)
        );

        await new Promise((resolve, reject) => {
            fs.unlink(req.file.path, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        return res.json({
            success: true,
            path: `https://${req.headers.host}/img/${newFilename}`
        });

    } catch (err) {
        console.error('Upload failed:', err);

        if (req.file?.path) {
            try {
                await new Promise((resolve) => {
                    fs.unlink(req.file.path, () => resolve());
                });
            } catch (cleanupErr) {
                console.error('Cleanup failed:', cleanupErr);
            }
        }

        return res.status(500).json({
            error: 'Upload failed',
            message: err.message
        });
    }
});

// ==================== МОДУЛЬНАЯ СИСТЕМА ====================

const routes = {};

// Функция проверки миграций модуля
async function checkModuleMigrations(modulePath, moduleName) {
    try {
        const migrationsPath = path.join(modulePath, 'Migrations');
        if (!fs.existsSync(migrationsPath)) {
            return;
        }

        const migrationFiles = fs.readdirSync(migrationsPath)
            .filter(file => file.endsWith('.js'));

        if (migrationFiles.length === 0) {
            return;
        }

        const umzug = new Umzug({
            migrations: {
                glob: path.join(migrationsPath, '*.js').replace(/\\/g, '/'),
                resolve: ({ name, path, context }) => {
                    const migration = require(path);
                    return {
                        name,
                        up: async () => migration.up(context[0], context[1]),
                        down: async () => migration.down(context[0], context[1]),
                    };
                },
            },
            context: [sequelize.getQueryInterface(), Sequelize],
            storage: new SequelizeStorage({
                sequelize,
                modelName: 'SequelizeMeta',
                tableName: 'SequelizeMeta'
            }),
            logger: console,
        });

        // Проверяем, существует ли таблица SequelizeMeta
        try {
            await sequelize.query('SELECT 1 FROM "SequelizeMeta" LIMIT 1');
        } catch (error) {
            await sequelize.query(`
                CREATE TABLE IF NOT EXISTS "SequelizeMeta" (
                    name VARCHAR(255) PRIMARY KEY
                )
            `);
        }

        // Получаем список выполненных миграций
        const [executedRows] = await sequelize.query(
            'SELECT name FROM "SequelizeMeta" ORDER BY name'
        );
        const executedNames = executedRows.map(row => row.name);

        // Определяем, какие миграции нужно выполнить
        const pendingMigrations = migrationFiles.filter(file =>
            !executedNames.includes(file)
        );

        if (pendingMigrations.length > 0) {
            console.log(`[${moduleName}]`, `🟡 Найдено ${pendingMigrations.length} невыполненных миграций`);

            for (const migrationFile of pendingMigrations) {
                try {
                    const migrationPath = path.join(migrationsPath, migrationFile);
                    const migration = require(migrationPath);

                    await migration.up(sequelize.getQueryInterface(), Sequelize);

                    await sequelize.query(
                        'INSERT INTO "SequelizeMeta" (name) VALUES (:name)',
                        {
                            replacements: { name: migrationFile },
                            type: sequelize.QueryTypes.INSERT
                        }
                    );

                    console.log(`[${moduleName}]`, `✅ Миграция ${migrationFile} выполнена`);
                } catch (migrationError) {
                    console.error(`❌ Ошибка миграции ${migrationFile} модуля "${moduleName}":`, migrationError.message);
                    throw migrationError;
                }
            }
        }
    } catch (error) {
        console.error(`🔴 Ошибка выполнения миграций для модуля "${moduleName}":`, error.message);
    }
}

// Функция загрузки модулей
async function loadModules() {
    const modulesPath = path.join(__dirname, 'modules');
    const loadedModules = [];

    const useAmeriaPay = process.env.AMERIAPAY === 'true';
    console.log(`[app.js]`, `💳 Платежный модуль: ${useAmeriaPay ? 'AmeriaBank vPOS 3.1' : 'YouPay'}`);

    // Проверяем, существует ли папка modules
    if (!fs.existsSync(modulesPath)) {
        console.log('⚠️ Папка modules не найдена');
        return loadedModules;
    }

    for (const moduleDir of fs.readdirSync(modulesPath)) {
        const modulePath = path.join(modulesPath, moduleDir);

        if (fs.statSync(modulePath).isDirectory()) {
            // Пропускаем платежные модули (они подключаются отдельно)
            if (moduleDir === 'AmeriaBank' || moduleDir === 'Payments') {
                continue;
            }

            // Чтение description.json
            const descriptionPath = path.join(modulePath, 'description.json');
            let moduleName = moduleDir;
            let moduleOrder = 999;

            if (fs.existsSync(descriptionPath)) {
                try {
                    const description = require(descriptionPath);
                    if (description.moduleName) moduleName = description.moduleName;
                    if (description.order !== undefined) moduleOrder = description.order;
                } catch (e) {
                    console.error(`❌ Ошибка чтения description.json в модуле ${moduleDir}:`, e.message);
                }
            }

            // Выполняем миграции модуля
            await checkModuleMigrations(modulePath, moduleName);

            // Загружаем контроллер
            const controllerPath = path.join(modulePath, 'Controllers', `${moduleDir}View.js`);
            if (fs.existsSync(controllerPath)) {
                const controller = require(controllerPath);
                routes[moduleDir.toLowerCase()] = controller;

                const routePath = path.join(modulePath, `${moduleDir}.route.js`);
                if (fs.existsSync(routePath)) {
                    const route = require(routePath);
                    route(app, moduleDir.toLowerCase(), controller, makeHandlerAwareOfAsyncErrors);
                    console.log(`🔥 Маршруты для ${moduleName} зарегистрированы в ${new Date().toISOString()}`);
                    console.log(`✅ Модуль "${moduleName}" загружен`);

                    loadedModules.push({
                        name: moduleName,
                        dir: moduleDir,
                        path: modulePath,
                        controller,
                        order: moduleOrder
                    });
                }
            }
        }
    }

    // Сортируем модули по order
    loadedModules.sort((a, b) => a.order - b.order);

    console.log(`✅ Загружено ${loadedModules.length} модулей`);
    return loadedModules;
}

// Функция инициализации модулей
async function initModules(loadedModules) {
    console.log('\n🔄 Инициализация модулей...');

    const results = {
        success: [],
        failed: [],
        skipped: []
    };

    for (const module of loadedModules) {
        const initPath = path.join(module.path, `${module.dir}.init.js`);

        if (fs.existsSync(initPath)) {
            try {
                console.log(`🔄 Инициализация модуля "${module.name}"...`);

                const initModule = require(initPath);

                if (typeof initModule === 'function') {
                    await initModule();
                    results.success.push(module.name);
                    console.log(`✅ Модуль "${module.name}" инициализирован`);
                } else if (typeof initModule.init === 'function') {
                    await initModule.init();
                    results.success.push(module.name);
                    console.log(`✅ Модуль "${module.name}" инициализирован`);
                } else if (typeof initModule.initTelegramModule === 'function') {
                    await initModule.initTelegramModule();
                    results.success.push(module.name);
                    console.log(`✅ Модуль "${module.name}" инициализирован`);
                } else {
                    console.log(`⚠️ Модуль "${module.name}" не содержит функцию инициализации`);
                    results.skipped.push(module.name);
                }
            } catch (error) {
                console.error(`❌ Ошибка инициализации модуля "${module.name}":`, error.message);
                results.failed.push(module.name);
            }
        } else {
            results.skipped.push(module.name);
        }
    }

    console.log('\n📊 Статистика инициализации модулей:');
    console.log(`   ✅ Успешно: ${results.success.length}`);
    console.log(`   ⚠️  Пропущено: ${results.skipped.length}`);
    console.log(`   ❌ Ошибки: ${results.failed.length}`);

    return results;
}

// Функция для просмотра всех зарегистрированных маршрутов
function logAllRoutes() {
    console.log('\n📋 ВСЕ ЗАРЕГИСТРИРОВАННЫЕ МАРШРУТЫ:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const routes = [];

    app._router.stack.forEach(middleware => {
        if (middleware.route) {
            const methods = Object.keys(middleware.route.methods).map(m => m.toUpperCase()).join(', ');
            routes.push({
                method: methods,
                path: middleware.route.path
            });
        } else if (middleware.name === 'router' && middleware.handle) {
            const routerPath = middleware.regexp.source
                .replace('\\/?(?=\\/|$)', '')
                .replace(/\\\//g, '/')
                .replace(/\^/g, '')
                .replace(/\?/g, '');

            middleware.handle.stack.forEach(handler => {
                if (handler.route) {
                    const methods = Object.keys(handler.route.methods).map(m => m.toUpperCase()).join(', ');
                    const fullPath = (routerPath + handler.route.path).replace(/\/\//g, '/');
                    routes.push({
                        method: methods,
                        path: fullPath
                    });
                }
            });
        }
    });

    routes.sort((a, b) => a.path.localeCompare(b.path));

    routes.forEach(r => {
        console.log(`   ${r.method.padEnd(8)} ${r.path}`);
    });

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

// ==================== WEBSOCKET ====================

function onConnect(wsClient) {
    console.log(`[WebSocket]`, 'Новый пользователь');

    wsClient.on('message', function (data) {
        console.log(`[WebSocket]`, "Получено сообщение");
    });

    wsClient.on('close', function () {
        console.log(`[WebSocket]`, 'Пользователь отключился');
    });
}

// WaiterWeb инициализация (если есть)
try {
    const waiterWebPath = path.join(__dirname, 'modules/WaiterWeb/Controllers/WaiterWebController.js');
    if (fs.existsSync(waiterWebPath)) {
        const WaiterWebController = require('./modules/WaiterWeb/Controllers/WaiterWebController');
        const WaiterWebRoutes = require('./modules/WaiterWeb/WaiterWeb.route');

        const waiterWebControllerInstance = new WaiterWebController();
        waiterWebControllerInstance.initializeSocket(io);
        global.waiterWebController = waiterWebControllerInstance;
        WaiterWebRoutes(app, 'waiter-web', waiterWebControllerInstance, makeHandlerAwareOfAsyncErrors, io);

        console.log(`[app.js]`, 'WaiterWeb module initialized successfully');
    }
} catch (error) {
    console.error('Error initializing WaiterWeb module:', error);
}

// ==================== ЗАПУСК ====================


async function startServer() {
    try {
        // Подключаемся к базе данных
        await sequelize.authenticate();
        console.log('✅ Подключение к базе данных установлено');

        const loadedModules = await loadModules();
        await initModules(loadedModules);


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
                const filePath = path.join(__dirname, 'public', 'pages', `${page}.html`);
                if (fs.existsSync(filePath)) {
                    res.sendFile(filePath);
                } else {
                    res.status(404).send('Page not found');
                }
            });
        });

        // Логи - веб-интерфейс (С ПРОВЕРКОЙ, ЧТО ЭТО НЕ API)
        app.use('/logs', (req, res, next) => {
            if (req.originalUrl.startsWith('/api/logs')) {
                return next('route');
            }
            express.static(path.join(__dirname, 'modules/Logs/web'))(req, res, next);
        });

        app.get('/logs', (req, res, next) => {
            if (req.originalUrl.startsWith('/api/logs')) {
                return next();
            }
            res.sendFile(path.join(__dirname, 'modules/Logs/web/index.html'));
        });

        app.get('/logs/*', (req, res, next) => {
            if (req.originalUrl.startsWith('/api/logs')) {
                return next();
            }
            res.sendFile(path.join(__dirname, 'modules/Logs/web/index.html'));
        });

        // Показываем все маршруты (для отладки)
        logAllRoutes();

        // 4. ПОСЛЕ ВСЕХ МАРШРУТОВ - обработчик 404
        app.use('*', (req, res) => {
            if (req.url.startsWith('/api/')) {
                res.status(404).json({
                    success: false,
                    error: 'API маршрут не найден'
                });
            } else {
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

        // Запускаем сервер
        const PORT = process.env.PORT || 3000;
        server.listen(PORT, () => {
            console.log('\n✨ =============================================== ✨');
            console.log(`   🚀 Мистический сервер запущен на порту ${PORT}`);
            console.log(`   🔗 http://localhost:${PORT}`);
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
            console.log('   POST /api/calculate/numerology     - расчет нумерологии');
            console.log('   POST /api/calculate/natal-chart    - натальная карта');
            console.log('   POST /api/tarot/reading            - гадание на Таро');
            console.log('   POST /api/tarot/quick              - быстрый расклад');
            console.log('   POST /api/calculate/:practice      - универсальный API');
            console.log('   GET  /api/version                  - версия приложения');
            console.log('   ────────────────────────────────────────────────\n');

            console.log('📊 Модули:');
            console.log('   ────────────────────────────────────────────────');
            console.log(`   📋 API логов:          http://localhost:${PORT}/api/logs`);
            console.log(`   📋 Веб-интерфейс логов: http://localhost:${PORT}/logs`);
            console.log('   ────────────────────────────────────────────────\n');

            console.log('✅ Сервер успешно запущен и готов к работе!\n');
        });

    } catch (error) {
        console.error('❌ Ошибка запуска сервера:', error);
        process.exit(1);
    }
}

// Запускаем сервер
startServer();

// ==================== ОБРАБОТКА ЗАВЕРШЕНИЯ ====================

process.on('SIGINT', async () => {
    console.log('\n👋 Получен сигнал SIGINT, завершаем работу...');
    await sequelize.close();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n👋 Получен сигнал SIGTERM, завершаем работу...');
    await sequelize.close();
    process.exit(0);
});

module.exports = {
    app,
    server,
    io,
    sequelize,
    models
};