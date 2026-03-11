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
const natalChartService = new NatalChartSimpleService();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

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
    runes: new RunesService()
};
// Определение версии (Telegram или Web)
app.use((req, res, next) => {
    // Проверяем заголовок от Telegram
    const isTelegram = req.headers['x-telegram-init-data'] ||
        req.headers['user-agent']?.includes('Telegram');

    // Сохраняем в locals для использования в шаблонах
    res.locals.isTelegram = isTelegram;

    // Добавляем заголовок для клиента
    res.setHeader('X-App-Version', isTelegram ? 'telegram' : 'web');

    next();
});

// Специальный маршрут для определения версии на клиенте
app.get('/api/version', (req, res) => {
    res.json({
        version: res.locals.isTelegram ? 'telegram' : 'web',
        timestamp: Date.now()
    });
});
// Главная страница
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Страницы практик
app.get('/numerology', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'numerology.html'));
});

app.get('/rodology', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'rodology.html'));
});

app.get('/iching', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'iching.html'));
});

app.get('/daliuren', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'daliuren.html'));
});

app.get('/hermetic', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'hermetic.html'));
});

app.get('/zoar', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'zoar.html'));
});

app.get('/socionics', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'socionics.html'));
});

app.get('/astropsychology', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'astropsychology.html'));
});

app.get('/runes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'runes.html'));
});
app.get('/natal-chart', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'natal-chart.html'));
});

app.post('/api/calculate/natal-chart', (req, res) => {
    try {
        const result = natalChartService.calculate(req.body);
        res.json(result);
    } catch (error) {
        console.error('Ошибка расчета натальной карты:', error);
        res.status(500).json({
            success: false,
            error: 'Внутренняя ошибка сервера'
        });
    }
});

// API маршруты - ЭТОТ ОСТАВЛЯЕМ
app.post('/api/calculate/:practice', (req, res) => {
    try {
        const { practice } = req.params;
        const data = req.body;

        if (!services[practice]) {
            return res.status(404).json({ error: 'Практика не найдена' });
        }

        let result;
        switch(practice) {
            case 'numerology':
                const { fullName, birthDate } = data;
                const nameParts = fullName.trim().split(/\s+/);
                if (nameParts.length < 3) {
                    return res.status(400).json({ error: 'Укажите полное ФИО' });
                }
                const [surname, firstName, patronymic] = nameParts;
                result = services.numerology.calculate(surname, firstName, patronymic, birthDate);

                // Добавляем дополнительные сервисы для полной картины
                const zodiac = services.zodiac.calculate(birthDate);
                const fengShui = services.fengShui.calculate(birthDate);
                const tarot = services.tarot.calculate(result);
                const psychology = services.psychology.generatePortrait(result, zodiac, fengShui, tarot);

                res.json({
                    success: true,
                    data: {
                        fullName,
                        birthDate,
                        numerology: result,
                        zodiac,
                        fengShui,
                        tarot,
                        psychology
                    }
                });
                break;

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
                res.json({ success: true, data: result });
                break;

            case 'astropsychology':
                result = services.astropsychology.calculate(data);
                res.json({ success: true, data: result });
                break;

            case 'runes':
                result = services.runes.calculate(data);
                res.json({ success: true, data: result });
                break;

            default:
                return res.status(400).json({ error: 'Неизвестная практика' });
        }

    } catch (error) {
        console.error('Ошибка расчета:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
});

app.listen(PORT, () => {
    console.log(`✨ Мистический сервер запущен на порту ${PORT}`);
    console.log(`📚 Доступные практики:`);
    console.log(`   - Нумерология: http://localhost:${PORT}/numerology`);
    console.log(`   - Родология: http://localhost:${PORT}/rodology`);
    console.log(`   - 64 гексаграммы: http://localhost:${PORT}/iching`);
    console.log(`   - Да Лю Жэнь: http://localhost:${PORT}/daliuren`);
    console.log(`   - 7 герметических принципов: http://localhost:${PORT}/hermetic`);
    console.log(`   - Зоар: http://localhost:${PORT}/zoar`);
    console.log(`   - 16 типов личности: http://localhost:${PORT}/socionics`);
    console.log(`   - Астропсихология: http://localhost:${PORT}/astropsychology`);
    console.log(`   - Старший Футарк: http://localhost:${PORT}/runes`);
});