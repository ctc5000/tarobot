// modules/astrology/Services/astrologyPdfService.js
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const writeFileAsync = promisify(fs.writeFile);
const mkdirAsync = promisify(fs.mkdir);
const puppeteer = require('puppeteer');

class AstrologyPdfService {
    constructor() {
        this.tempDir = path.join(__dirname, '../temp');
        this.ensureTempDir();
    }

    async ensureTempDir() {
        try {
            await mkdirAsync(this.tempDir, { recursive: true });
        } catch (error) {
            console.error('Ошибка создания temp директории:', error);
        }
    }

    async generatePdf(calculation) {
        let browser = null;
        try {
            const html = this.generateHTML(calculation);

            browser = await puppeteer.launch({
                headless: 'new',
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });

            const page = await browser.newPage();
            await page.setViewport({ width: 1200, height: 1600 });
            await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });

            const pdf = await page.pdf({
                format: 'A4',
                printBackground: true,
                margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' },
                preferCSSPageSize: true
            });

            return Buffer.from(pdf);

        } catch (error) {
            console.error('Ошибка генерации PDF:', error);
            throw error;
        } finally {
            if (browser) await browser.close();
        }
    }

    generateHTML(calculation) {
        const data = calculation.result;
        const currentDate = new Date().toLocaleDateString('ru-RU');

        const planets = data.planets || {};
        const houses = data.houses || [];
        const aspects = data.aspects || [];
        const ascendant = data.ascendant || {};
        const interpretation = data.interpretation || '';

        let planetsHtml = '';
        const planetOrder = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
        planetOrder.forEach(key => {
            const planet = planets[key];
            if (planet) {
                planetsHtml += `
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid rgba(201,165,75,0.2);">${planet.name}</td>
                    <td style="padding: 8px; border-bottom: 1px solid rgba(201,165,75,0.2);">${planet.sign}</td>
                    <td style="padding: 8px; border-bottom: 1px solid rgba(201,165,75,0.2);">${planet.degreeInSign}°</td>
                    <td style="padding: 8px; border-bottom: 1px solid rgba(201,165,75,0.2);">${Math.floor(planet.longitude / 30) + 1}</td>
                 </tr>
                `;
            }
        });

        let housesHtml = '';
        houses.forEach(house => {
            housesHtml += `
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid rgba(201,165,75,0.2);">${house.number} дом</td>
                <td style="padding: 8px; border-bottom: 1px solid rgba(201,165,75,0.2);">${house.sign}</td>
                <td style="padding: 8px; border-bottom: 1px solid rgba(201,165,75,0.2);">${house.houseDescription || '—'}</td>
             </tr>
            `;
        });

        let aspectsHtml = '';
        aspects.forEach(aspect => {
            aspectsHtml += `
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid rgba(201,165,75,0.2);">${aspect.planet1}</td>
                <td style="padding: 8px; border-bottom: 1px solid rgba(201,165,75,0.2);">${aspect.planet2}</td>
                <td style="padding: 8px; border-bottom: 1px solid rgba(201,165,75,0.2);">${aspect.name}</td>
                <td style="padding: 8px; border-bottom: 1px solid rgba(201,165,75,0.2);">${aspect.orb}°</td>
             </tr>
            `;
        });

        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Натальная карта - ${data.fullName || 'Отчет'}</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: 'Times New Roman', Times, serif; background: #ffffff; color: #000000; line-height: 1.5; font-size: 12pt; }
                .container { max-width: 180mm; margin: 0 auto; }
                .title-page { text-align: center; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; page-break-after: always; }
                .title-page h1 { font-size: 28pt; font-weight: bold; color: #000000; margin-bottom: 10mm; letter-spacing: 2px; text-transform: uppercase; }
                .title-page .name { font-size: 24pt; font-weight: bold; margin: 15mm 0; padding: 10mm 0; border-top: 2px solid #000000; border-bottom: 2px solid #000000; }
                .section-title { font-size: 18pt; font-weight: bold; margin: 10mm 0 5mm 0; padding-bottom: 2mm; border-bottom: 1px solid #000000; }
                .subsection-title { font-size: 14pt; font-weight: bold; margin: 5mm 0 3mm 0; }
                table { width: 100%; border-collapse: collapse; margin: 5mm 0; }
                th, td { border: 1px solid #000000; padding: 3mm; text-align: left; vertical-align: top; }
                th { background: #f0f0f0; font-weight: bold; }
                .description { margin: 3mm 0; text-align: justify; }
                .footer { margin-top: 10mm; text-align: right; font-size: 10pt; color: #666666; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="title-page">
                    <h1>АЛГОРИТМ СУДЬБЫ</h1>
                    <h2>Натальная карта</h2>
                    <div class="name">${data.fullName || '—'}</div>
                    <div class="date">Дата рождения: ${data.birthDate || '—'} в ${data.birthTime || '—'}</div>
                    <div class="stamp">Официальный документ • Дата составления: ${currentDate}</div>
                </div>

                <div style="page-break-after: always;">
                    <h3 class="section-title">1. ОСНОВНАЯ ИНФОРМАЦИЯ</h3>
                    <table>
                        <tr><th style="width: 30%">Параметр</th><th style="width: 70%">Значение</th></tr>
                        <tr><td>Имя</td><td>${data.fullName || '—'}</td></tr>
                        <tr><td>Дата рождения</td><td>${data.birthDate || '—'}</td></tr>
                        <tr><td>Время рождения</td><td>${data.birthTime || '—'}</td></tr>
                        <tr><td>Место рождения</td><td>${data.latitude ? `${data.latitude}, ${data.longitude}` : '—'}</td></tr>
                        <tr><td>Система домов</td><td>${data.houseSystem || 'Плацидус'}</td></tr>
                    </table>

                    <h3 class="section-title">2. АСЦЕНДЕНТ</h3>
                    <div class="description">
                        <p><strong>Знак:</strong> ${ascendant.sign || '—'}</p>
                        <p><strong>Градус:</strong> ${ascendant.degreeInSign || '—'}°</p>
                        <p><strong>Стихия:</strong> ${ascendant.element || '—'}</p>
                        <p><strong>Описание:</strong> ${ascendant.description || '—'}</p>
                    </div>
                </div>

                <div style="page-break-after: always;">
                    <h3 class="section-title">3. ПЛАНЕТЫ В ЗНАКАХ</h3>
                    <table>
                        <thead><tr><th>Планета</th><th>Знак</th><th>Градус</th><th>Дом</th></tr></thead>
                        <tbody>${planetsHtml}</tbody>
                    </table>
                </div>

                <div style="page-break-after: always;">
                    <h3 class="section-title">4. ДОМА</h3>
                    <table>
                        <thead><tr><th>Дом</th><th>Знак на куспиде</th><th>Значение</th></tr></thead>
                        <tbody>${housesHtml}</tbody>
                    </table>
                </div>

                <div style="page-break-after: always;">
                    <h3 class="section-title">5. АСПЕКТЫ</h3>
                    <table>
                        <thead><tr><th>Планета 1</th><th>Планета 2</th><th>Тип аспекта</th><th>Орб</th></tr></thead>
                        <tbody>${aspectsHtml}</tbody>
                    </table>
                </div>

                <div>
                    <h3 class="section-title">6. ИНТЕРПРЕТАЦИЯ</h3>
                    <div class="description">${interpretation.replace(/\n/g, '<br>')}</div>
                    <div class="footer"><p>© 2026 АЛГОРИТМ СУДЬБЫ. Все права защищены.</p></div>
                </div>
            </div>
        </body>
        </html>
        `;
    }
}

module.exports = AstrologyPdfService;