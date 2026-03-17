// services/pdfGeneratorService.js

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const writeFileAsync = promisify(fs.writeFile);
const mkdirAsync = promisify(fs.mkdir);
const unlinkAsync = promisify(fs.unlink);
const puppeteer = require('puppeteer');

class PDFGeneratorService {
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
    getFullImageUrl(imagePath) {
        if (!imagePath) return '';

        // Если путь уже абсолютный (начинается с http)
        if (imagePath.startsWith('http')) {
            return imagePath;
        }

        // Если путь начинается с /, добавляем базовый URL
        if (imagePath.startsWith('/')) {
            // Здесь нужно указать базовый URL вашего сервера
            // Для локальной разработки:
            return `https://yournumerology.ru${imagePath}`;
            // Для продакшена замените на реальный домен:
            // return `https://ваш-сайт.ru${imagePath}`;
        }

        return imagePath;
    }
    async generateNumerologyPDF(data) {
        let browser = null;
        try {
            const html = this.generateHTML(data);

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

    generateHTML(data) {
        const { fullName, birthDate, numerology, zodiac, fengShui, tarot, psychology, patterns } = data;
        const base = numerology.base;
        const achilles = numerology.achilles;
        const control = numerology.control;
        const calls = numerology.calls;
        const interpretations = numerology.interpretations || {};
        const formattedDate = this.formatDate(birthDate);
        const currentDate = new Date().toLocaleDateString('ru-RU');

        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Нумерологический отчет - ${fullName}</title>
            <style>
                /* ОСНОВНЫЕ СТИЛИ - СТРОГИЙ ДОКУМЕНТ */
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: 'Times New Roman', Times, serif;
                    background: #ffffff;
                    color: #000000;
                    line-height: 1.5;
                    font-size: 12pt;
                }
                
                .container {
                    max-width: 180mm;
                    margin: 0 auto;
                }
                
                /* ТИТУЛЬНАЯ СТРАНИЦА */
                .title-page {
                    text-align: center;
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    page-break-after: always;
                }
                
                .title-page h1 {
                    font-size: 28pt;
                    font-weight: bold;
                    color: #000000;
                    margin-bottom: 10mm;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                }
                
                .title-page h2 {
                    font-size: 18pt;
                    font-weight: normal;
                    margin-bottom: 20mm;
                }
                
                .title-page .name {
                    font-size: 24pt;
                    font-weight: bold;
                    margin: 15mm 0;
                    padding: 10mm 0;
                    border-top: 2px solid #000000;
                    border-bottom: 2px solid #000000;
                }
                
                .title-page .date {
                    font-size: 14pt;
                    margin: 10mm 0;
                }
                
                .title-page .stamp {
                    margin-top: 20mm;
                    font-size: 10pt;
                    color: #666666;
                }
                
                /* ЗАГОЛОВКИ РАЗДЕЛОВ */
                .section-title {
                    font-size: 18pt;
                    font-weight: bold;
                    margin: 10mm 0 5mm 0;
                    padding-bottom: 2mm;
                    border-bottom: 1px solid #000000;
                }
                
                .subsection-title {
                    font-size: 14pt;
                    font-weight: bold;
                    margin: 5mm 0 3mm 0;
                }
                
                /* ТАБЛИЦЫ ДЛЯ ЧИСЕЛ */
                .numbers-grid {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 5mm 0;
                }
                
                .numbers-grid td {
                    border: 1px solid #000000;
                    padding: 3mm;
                    text-align: center;
                    width: 25%;
                }
                
                .numbers-grid .number {
                    font-size: 24pt;
                    font-weight: bold;
                }
                
                .numbers-grid .label {
                    font-size: 10pt;
                    color: #666666;
                }
                
                /* ТАБЛИЦА ДЛЯ ОКЛИКОВ */
                .calls-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 5mm 0;
                }
                
                .calls-table td {
                    border: 1px solid #000000;
                    padding: 3mm;
                    vertical-align: top;
                    width: 33.33%;
                }
                
                .calls-table .call-number {
                    font-size: 18pt;
                    font-weight: bold;
                    text-align: center;
                }
                
                .calls-table .call-label {
                    font-weight: bold;
                    margin: 2mm 0 1mm 0;
                }
                
                /* ТАБЛИЦА ДЛЯ ТАРО */
                .tarot-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 5mm 0;
                }
                
                .tarot-table td {
                    border: 1px solid #000000;
                    padding: 3mm;
                    vertical-align: top;
                }
                
                .tarot-table .card-number {
                    font-size: 16pt;
                    font-weight: bold;
                }
                
                .tarot-table .card-name {
                    font-weight: bold;
                    margin: 2mm 0 1mm 0;
                }
                
                /* КЛЮЧЕВЫЕ ЧИСЛА */
                .key-numbers {
                    display: flex;
                    justify-content: space-around;
                    margin: 5mm 0;
                }
                
                .key-number-item {
                    text-align: center;
                }
                
                .key-number-item .value {
                    font-size: 28pt;
                    font-weight: bold;
                }
                
                .key-number-item .label {
                    font-size: 10pt;
                    color: #666666;
                }
                
                /* ОПИСАНИЯ */
                .description {
                    margin: 3mm 0;
                    text-align: justify;
                }
                
                .description p {
                    margin: 2mm 0;
                }
                
                /* СПИСКИ */
                ul {
                    margin: 2mm 0 2mm 5mm;
                }
                
                li {
                    margin: 1mm 0;
                }
                
                /* КАРТОЧКИ ИНТЕРПРЕТАЦИЙ */
                .interpretation-block {
                    margin: 5mm 0;
                    padding: 3mm;
                    border: 1px solid #cccccc;
                }
                
                .interpretation-block h4 {
                    font-size: 13pt;
                    font-weight: bold;
                    margin-bottom: 2mm;
                }
                
                .number-badge {
                    display: inline-block;
                    background: #f0f0f0;
                    padding: 1mm 3mm;
                    margin-right: 2mm;
                    font-weight: bold;
                }
                
                /* ПРОГРЕСС-БАРЫ */
                .progress-bar {
                    width: 100%;
                    height: 4mm;
                    background: #f0f0f0;
                    margin: 2mm 0;
                    border: 1px solid #cccccc;
                }
                
                .progress-fill {
                    height: 100%;
                    background: #333333;
                }
                
                /* ПОДВАЛ */
                .footer {
                    margin-top: 10mm;
                    text-align: right;
                    font-size: 10pt;
                    color: #666666;
                }
                
                /* ПЕЧАТЬ */
                .print-only {
                    display: none;
                }
                
                @media print {
                    body {
                        background: white;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <!-- ТИТУЛЬНАЯ СТРАНИЦА -->
                <div class="title-page">
                    <h1>АЛГОРИТМ СУДЬБЫ</h1>
                    <h2>Нумерологический отчет</h2>
                    <div class="name">${fullName}</div>
                    <div class="date">Дата рождения: ${formattedDate}</div>
                    <div class="stamp">Официальный документ • Дата составления: ${currentDate}</div>
                </div>

                <!-- СТРАНИЦА 1: МАТРИЦА СУДЬБЫ -->
                <div style="page-break-after: always;">
                    <h3 class="section-title">1. МАТРИЦА СУДЬБЫ</h3>
                    
                    <table class="numbers-grid">
                        <tr>
                            <td>
                                <div class="number">${base.fate}</div>
                                <div class="label">Число судьбы</div>
                            </td>
                            <td>
                                <div class="number">${base.name}</div>
                                <div class="label">Число имени</div>
                            </td>
                            <td>
                                <div class="number">${base.surname}</div>
                                <div class="label">Число рода</div>
                            </td>
                            <td>
                                <div class="number">${base.patronymic}</div>
                                <div class="label">Число предков</div>
                            </td>
                        </tr>
                    </table>

                    <h4 class="subsection-title">1.1. Ключевые числа</h4>
                    <div class="key-numbers">
                        <div class="key-number-item">
                            <div class="value">${achilles.number}</div>
                            <div class="label">Ахиллесова пята</div>
                        </div>
                        <div class="key-number-item">
                            <div class="value">${control.number}</div>
                            <div class="label">Число управления</div>
                        </div>
                    </div>

                    <div class="description">
                        <p><strong>Ахиллесова пята:</strong> ${achilles.description || ''}</p>
                        <p style="margin-top: 3mm;"><strong>Число управления:</strong> ${control.description || ''}</p>
                    </div>

                    <h4 class="subsection-title">1.2. Социальные маски</h4>
                    <table class="calls-table">
                        <tr>
                            <td>
                                <div class="call-number">${calls.close}</div>
                                <div class="call-label">Близкий круг</div>
                                <div class="description">${calls.descriptions?.close || ''}</div>
                            </td>
                            <td>
                                <div class="call-number">${calls.social}</div>
                                <div class="call-label">Социум</div>
                                <div class="description">${calls.descriptions?.social || ''}</div>
                            </td>
                            <td>
                                <div class="call-number">${calls.world}</div>
                                <div class="call-label">Дальний круг</div>
                                <div class="description">${calls.descriptions?.world || ''}</div>
                            </td>
                        </tr>
                    </table>
                </div>

                <!-- СТРАНИЦА 2: ЗВЕЗДНЫЙ КОД -->
                <div style="page-break-after: always;">
                    <h3 class="section-title">2. ЗВЕЗДНЫЙ КОД</h3>
                    
                    <h4 class="subsection-title">2.1. Знак зодиака: ${zodiac.name || ''}</h4>
                    <div class="description">
                        <p><strong>Стихия:</strong> ${zodiac.element || ''}</p>
                        <p><strong>Планета:</strong> ${zodiac.planet || ''}</p>
                        <p><strong>Качество:</strong> ${zodiac.quality || ''}</p>
                        <p style="margin-top: 3mm;">${zodiac.description || ''}</p>
                        <p style="margin-top: 3mm;"><strong>Сильные стороны:</strong> ${zodiac.strengths || ''}</p>
                        <p><strong>Зоны роста:</strong> ${zodiac.weaknesses || ''}</p>
                        <p style="margin-top: 3mm;"><strong>Миссия:</strong> ${zodiac.lifeMission || ''}</p>
                    </div>

                    <h4 class="subsection-title">2.2. Энергия фен-шуй</h4>
                    <div class="description">
                        <p><strong>Стихия года:</strong> ${fengShui.element || ''}</p>
                        <p><strong>Цвет силы:</strong> ${fengShui.color || ''}</p>
                        <p><strong>Направление удачи:</strong> ${fengShui.direction || ''}</p>
                        <p><strong>Время силы:</strong> ${fengShui.season || ''}</p>
                        <p style="margin-top: 3mm;">${fengShui.description || ''}</p>
                        <p style="margin-top: 3mm;"><strong>Активация:</strong> ${fengShui.activation || ''}</p>
                        <p style="margin-top: 3mm;"><strong>Аффирмация:</strong> "${fengShui.affirmation || ''}"</p>
                    </div>
                </div>

                // СТРАНИЦА 3: КАРТЫ ТАРО (с реальными изображениями)
<div style="page-break-after: always;">
    <h3 class="section-title">3. КАРТЫ ТАРО</h3>
    
    <table class="tarot-table" style="width: 100%; border-collapse: collapse; margin: 5mm 0; border: 1px solid #000000;">
        <tr>
            <td style="width: 33.33%; border: 1px solid #000000; padding: 3mm; vertical-align: top; text-align: center;">
                <!-- Карта Судьбы -->
                <div style="margin-bottom: 3mm;">
                    <div style="font-size: 24pt; font-weight: bold; margin-bottom: 2mm;">${tarot.fate?.number === 0 ? 22 : tarot.fate?.number || ''}</div>
                    <div style="font-size: 14pt; font-weight: bold; margin-bottom: 2mm;">${tarot.fate?.name || ''}</div>
                    <div style="width: 100%; height: 120px; margin: 3mm 0; display: flex; align-items: center; justify-content: center; border: 1px solid #cccccc; background: #f5f5f5; overflow: hidden;">
                        <img src="${this.getFullImageUrl(tarot.fate?.image)}" 
                             alt="${tarot.fate?.name || ''}"
                             style="max-width: 100%; max-height: 100%; object-fit: contain;"
                             onerror="this.style.display='none'; this.parentNode.innerHTML='[Изображение не найдено]';">
                    </div>
                    <div style="font-size: 10pt; margin: 2mm 0;"><em>${tarot.fate?.keywords || ''}</em></div>
                    <div style="font-weight: bold; margin-top: 2mm;">Карта Судьбы</div>
                </div>
            </td>
            <td style="width: 33.33%; border: 1px solid #000000; padding: 3mm; vertical-align: top; text-align: center;">
                <!-- Карта Личности -->
                <div style="margin-bottom: 3mm;">
                    <div style="font-size: 24pt; font-weight: bold; margin-bottom: 2mm;">${tarot.personality?.number === 0 ? 22 : tarot.personality?.number || ''}</div>
                    <div style="font-size: 14pt; font-weight: bold; margin-bottom: 2mm;">${tarot.personality?.name || ''}</div>
                    <div style="width: 100%; height: 120px; margin: 3mm 0; display: flex; align-items: center; justify-content: center; border: 1px solid #cccccc; background: #f5f5f5; overflow: hidden;">
                        <img src="${this.getFullImageUrl(tarot.personality?.image)}" 
                             alt="${tarot.personality?.name || ''}"
                             style="max-width: 100%; max-height: 100%; object-fit: contain;"
                             onerror="this.style.display='none'; this.parentNode.innerHTML='[Изображение не найдено]';">
                    </div>
                    <div style="font-size: 10pt; margin: 2mm 0;"><em>${tarot.personality?.keywords || ''}</em></div>
                    <div style="font-weight: bold; margin-top: 2mm;">Карта Личности</div>
                </div>
            </td>
            <td style="width: 33.33%; border: 1px solid #000000; padding: 3mm; vertical-align: top; text-align: center;">
                <!-- Карта Пути -->
                <div style="margin-bottom: 3mm;">
                    <div style="font-size: 24pt; font-weight: bold; margin-bottom: 2mm;">${tarot.control?.number === 0 ? 22 : tarot.control?.number || ''}</div>
                    <div style="font-size: 14pt; font-weight: bold; margin-bottom: 2mm;">${tarot.control?.name || ''}</div>
                    <div style="width: 100%; height: 120px; margin: 3mm 0; display: flex; align-items: center; justify-content: center; border: 1px solid #cccccc; background: #f5f5f5; overflow: hidden;">
                        <img src="${this.getFullImageUrl(tarot.control?.image)}" 
                             alt="${tarot.control?.name || ''}"
                             style="max-width: 100%; max-height: 100%; object-fit: contain;"
                             onerror="this.style.display='none'; this.parentNode.innerHTML='[Изображение не найдено]';">
                    </div>
                    <div style="font-size: 10pt; margin: 2mm 0;"><em>${tarot.control?.keywords || ''}</em></div>
                    <div style="font-weight: bold; margin-top: 2mm;">Карта Пути</div>
                </div>
            </td>
        </tr>
    </table>

    <h4 class="subsection-title" style="margin-top: 5mm;">3.1. ${tarot.fate?.name || ''}</h4>
    <div class="description">
        <p>${tarot.fate?.description || ''}</p>
        <p style="margin-top: 2mm;"><em>Совет: ${tarot.fate?.advice || ''}</em></p>
    </div>

    <h4 class="subsection-title">3.2. ${tarot.personality?.name || ''}</h4>
    <div class="description">
        <p>${tarot.personality?.description || ''}</p>
        <p style="margin-top: 2mm;"><em>Совет: ${tarot.personality?.advice || ''}</em></p>
    </div>

    <h4 class="subsection-title">3.3. ${tarot.control?.name || ''}</h4>
    <div class="description">
        <p>${tarot.control?.description || ''}</p>
        <p style="margin-top: 2mm;"><em>Совет: ${tarot.control?.advice || ''}</em></p>
    </div>
</div>

                <!-- СТРАНИЦА 4: ПСИХОЛОГИЧЕСКИЙ ПОРТРЕТ -->
                <div style="page-break-after: always;">
                    <h3 class="section-title">4. ПСИХОЛОГИЧЕСКИЙ ПОРТРЕТ</h3>
                    
                    <h4 class="subsection-title">4.1. НЛП-профиль</h4>
                    <div class="description">
                        <p><strong>${psychology.modality?.title || ''}</strong></p>
                        <p>${psychology.modality?.description || ''}</p>
                        <p style="margin-top: 2mm;"><strong>Ключи доступа:</strong> ${psychology.modality?.accessKeys || ''}</p>
                    </div>

                    <h4 class="subsection-title">4.2. Архетип личности</h4>
                    <div class="description">
                        <p><strong>${psychology.archetype?.name || ''}</strong></p>
                        <p>${psychology.archetype?.description || ''}</p>
                        <p style="margin-top: 2mm;"><strong>Дар:</strong> ${psychology.archetype?.gift || ''}</p>
                        <p><strong>Вызов:</strong> ${psychology.archetype?.challenge || ''}</p>
                        <p style="margin-top: 2mm;"><em>${psychology.archetype?.mantra || ''}</em></p>
                    </div>

                    <h4 class="subsection-title">4.3. Тип привязанности</h4>
                    <div class="description">
                        <p><strong>${psychology.attachment?.name || ''}</strong></p>
                        <p>${psychology.attachment?.description || ''}</p>
                    </div>
                </div>

                <!-- СТРАНИЦА 5: ПАТТЕРНЫ ЛИЧНОСТИ -->
                <div style="page-break-after: always;">
                    <h3 class="section-title">5. ПАТТЕРНЫ ЛИЧНОСТИ</h3>
                    
                    <div class="description">
                        ${patterns && patterns.length ?
            patterns.map(p => `<p style="margin-bottom: 2mm;">• ${p}</p>`).join('') :
            '<p>Индивидуальные паттерны формируются в момент вашего запроса.</p>'}
                    </div>
                </div>

                <!-- СТРАНИЦЫ С ДОПОЛНИТЕЛЬНЫМИ ИНТЕРПРЕТАЦИЯМИ -->
                ${this.generateInterpretationsPages(interpretations)}

                <!-- СТРАНИЦА: ГЛУБИННЫЙ ПОРТРЕТ -->
                <div style="page-break-after: always;">
                    <h3 class="section-title">ГЛУБИННЫЙ ПСИХОЛОГИЧЕСКИЙ ПОРТРЕТ</h3>
                    
                    <div class="description">
                        ${(psychology.portrait || 'Портрет формируется...').split('\n').map(p => `<p>${p}</p>`).join('')}
                    </div>
                </div>

                <!-- ЗАКЛЮЧИТЕЛЬНАЯ СТРАНИЦА -->
                <div>
                    <h3 class="section-title">ЗАКЛЮЧЕНИЕ</h3>
                    
                    <div class="description" style="text-align: center; margin-top: 20mm;">
                        <p style="font-size: 14pt; margin: 10mm 0;">Ваш нумерологический отчет составлен</p>
                        <p style="font-size: 14pt; margin: 5mm 0;">на основе древних знаний и современных расчетов</p>
                        <p style="margin: 15mm 0;">Дата составления: ${currentDate}</p>
                        <p style="margin-top: 30mm; font-size: 14pt;">АЛГОРИТМ СУДЬБЫ</p>
                        <p style="color: #666666;">система автоматических расчетов</p>
                    </div>
                    
                    <div class="footer">
                        <p>© 2026 АЛГОРИТМ СУДЬБЫ. Все права защищены.</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        `;
    }

    generateInterpretationsPages(interpretations) {
        let html = '';
        const sections = [
            { key: 'career', title: '6. КАРЬЕРНЫЙ ПОТЕНЦИАЛ' },
            { key: 'family', title: '7. СЕМЕЙНАЯ ГАРМОНИЯ' },
            { key: 'love', title: '8. ЛЮБОВНАЯ СОВМЕСТИМОСТЬ' },
            { key: 'money', title: '9. ФИНАНСОВЫЙ ПОТОК' },
            { key: 'health', title: '10. ЭНЕРГИЯ ЗДОРОВЬЯ' },
            { key: 'talent', title: '11. СКРЫТЫЕ ТАЛАНТЫ' }
        ];

        sections.forEach(section => {
            const data = interpretations[section.key];
            if (!data) return;

            html += `<div style="page-break-after: always;"><h3 class="section-title">${section.title}</h3>`;

            switch(section.key) {
                case 'career':
                    html += this.generateCareerHTML(data);
                    break;
                case 'family':
                    html += this.generateFamilyHTML(data);
                    break;
                case 'love':
                    html += this.generateLoveHTML(data);
                    break;
                case 'money':
                    html += this.generateMoneyHTML(data);
                    break;
                case 'health':
                    html += this.generateHealthHTML(data);
                    break;
                case 'talent':
                    html += this.generateTalentHTML(data);
                    break;
            }

            html += `</div>`;
        });

        return html;
    }

    generateCareerHTML(career) {
        return `
            <h4 class="subsection-title">${career.title || ''}</h4>
            <div class="description">
                <p><span class="number-badge">Число ${career.careerNumber || ''}</span></p>
                <p style="margin-top: 3mm;">${career.detailedDescription || career.description || ''}</p>
                
                <p style="margin-top: 3mm;"><strong>Сильные стороны:</strong></p>
                <ul>${(career.strengths || []).map(s => `<li>${s}</li>`).join('')}</ul>
                
                <p style="margin-top: 3mm;"><strong>Зоны роста:</strong></p>
                <ul>${(career.weaknesses || []).map(w => `<li>${w}</li>`).join('')}</ul>
                
                <p style="margin-top: 3mm;"><strong>Подходящие профессии:</strong></p>
                <ul>${(career.suitable || []).map(p => `<li>${p}</li>`).join('')}</ul>
                
                <p style="margin-top: 3mm;"><strong>Число успеха (${career.successNumber}):</strong> ${career.successDescription || ''}</p>
                <p><strong>Число реализации (${career.realizationNumber}):</strong> ${career.realizationDescription || ''}</p>
                
                <p style="margin-top: 3mm;"><em>${career.advice || ''}</em></p>
            </div>
        `;
    }

    generateFamilyHTML(family) {
        return `
            <h4 class="subsection-title">${family.title || ''}</h4>
            <div class="description">
                <p><span class="number-badge">Число ${family.familyNumber || ''}</span>
                   <span class="number-badge">Партнер ${family.partnerNumber || ''}</span>
                   <span class="number-badge">Дети ${family.childrenNumber || ''}</span></p>
                <p style="margin-top: 3mm;">${family.detailedDescription || family.description || ''}</p>
                
                <p style="margin-top: 3mm;"><strong>Ваша роль в семье:</strong> ${family.role || ''}</p>
                
                <p style="margin-top: 3mm;"><strong>Сильные стороны:</strong></p>
                <ul>${(family.strengths || []).map(s => `<li>${s}</li>`).join('')}</ul>
                
                <p style="margin-top: 3mm;"><strong>Зоны роста:</strong></p>
                <ul>${(family.weaknesses || []).map(w => `<li>${w}</li>`).join('')}</ul>
                
                <p style="margin-top: 3mm;"><strong>Идеальный партнер:</strong> ${family.partnerDescription || ''}</p>
                <p><strong>Дети:</strong> ${family.childrenDescription || ''}</p>
                
                <p style="margin-top: 3mm;"><em>${family.advice || ''}</em></p>
            </div>
        `;
    }

    generateLoveHTML(love) {
        const compatibilityPercent = love.compatibility || 0;
        return `
            <h4 class="subsection-title">${love.title || ''}</h4>
            <div class="description">
                <p><span class="number-badge">Число любви ${love.loveNumber || ''}</span></p>
                <p style="margin-top: 3mm;">${love.detailedDescription || love.description || ''}</p>
                
                <p style="margin-top: 3mm;"><strong>Ваш стиль любви:</strong> ${love.loveStyle || ''}</p>
                
                <p style="margin-top: 3mm;"><strong>Сильные стороны:</strong></p>
                <ul>${(love.strengths || []).map(s => `<li>${s}</li>`).join('')}</ul>
                
                <p style="margin-top: 3mm;"><strong>Зоны роста:</strong></p>
                <ul>${(love.weaknesses || []).map(w => `<li>${w}</li>`).join('')}</ul>
                
                <p style="margin-top: 3mm;"><strong>Идеальный партнер:</strong> ${love.idealPartner || ''}</p>
                
                <p style="margin-top: 3mm;"><strong>Совместимость:</strong> ${compatibilityPercent}%</p>
                <div class="progress-bar"><div class="progress-fill" style="width: ${compatibilityPercent}%;"></div></div>
                <p>${love.compatibilityLevel || ''}</p>
                
                <p style="margin-top: 3mm;"><em>${love.advice || ''}</em></p>
            </div>
        `;
    }

    generateMoneyHTML(money) {
        return `
            <h4 class="subsection-title">${money.title || ''}</h4>
            <div class="description">
                <p><span class="number-badge">Финансы ${money.moneyNumber || ''}</span>
                   <span class="number-badge">Изобилие ${money.abundanceNumber || ''}</span></p>
                <p style="margin-top: 3mm;">${money.detailedDescription || money.description || ''}</p>
                
                <p style="margin-top: 3mm;"><strong>Финансовый стиль:</strong> ${money.moneyStyle || ''}</p>
                
                <p style="margin-top: 3mm;"><strong>Сильные стороны:</strong></p>
                <ul>${(money.strengths || []).map(s => `<li>${s}</li>`).join('')}</ul>
                
                <p style="margin-top: 3mm;"><strong>Зоны роста:</strong></p>
                <ul>${(money.weaknesses || []).map(w => `<li>${w}</li>`).join('')}</ul>
                
                <p style="margin-top: 3mm;"><strong>Источники дохода:</strong></p>
                <ul>${(money.sources || []).map(s => `<li>${s}</li>`).join('')}</ul>
                
                <p style="margin-top: 3mm;"><strong>Число изобилия:</strong> ${money.abundanceDescription || ''}</p>
                
                <p style="margin-top: 3mm;"><em>${money.advice || ''}</em></p>
            </div>
        `;
    }

    generateHealthHTML(health) {
        const energyPercent = (health.energyLevel / 10) * 100;
        return `
            <h4 class="subsection-title">${health.title || ''}</h4>
            <div class="description">
                <p><span class="number-badge">Число здоровья ${health.healthNumber || ''}</span></p>
                <p style="margin-top: 3mm;">${health.detailedDescription || health.description || ''}</p>
                
                <p style="margin-top: 3mm;"><strong>Уровень энергии:</strong> ${health.energyLevel}/10</p>
                <div class="progress-bar"><div class="progress-fill" style="width: ${energyPercent}%;"></div></div>
                
                <p style="margin-top: 3mm;"><strong>Тип энергетики:</strong> ${health.energyType || ''}</p>
                
                <p style="margin-top: 3mm;"><strong>Сильные стороны:</strong></p>
                <ul>${(health.strengths || []).map(s => `<li>${s}</li>`).join('')}</ul>
                
                <p style="margin-top: 3mm;"><strong>Зоны роста:</strong></p>
                <ul>${(health.weaknesses || []).map(w => `<li>${w}</li>`).join('')}</ul>
                
                <p style="margin-top: 3mm;"><strong>Уязвимые органы:</strong></p>
                <ul>${(health.vulnerable || []).map(v => `<li>${v}</li>`).join('')}</ul>
                
                <p style="margin-top: 3mm;"><strong>Рекомендации:</strong></p>
                <ul>${(health.recommendations || []).map(r => `<li>${r}</li>`).join('')}</ul>
                
                <p style="margin-top: 3mm;"><em>${health.advice || ''}</em></p>
            </div>
        `;
    }

    generateTalentHTML(talent) {
        return `
            <h4 class="subsection-title">${talent.title || ''}</h4>
            <div class="description">
                <p><span class="number-badge">Число таланта ${talent.talentNumber || ''}</span></p>
                <p style="margin-top: 3mm;">${talent.detailedDescription || talent.description || ''}</p>
                
                <p style="margin-top: 3mm;"><strong>Ваши таланты:</strong></p>
                <ul>${(talent.talents || []).map(t => `<li>${t}</li>`).join('')}</ul>
                
                <p style="margin-top: 3mm;"><strong>Как развивать:</strong></p>
                <ul>${(talent.howToDevelop || []).map(h => `<li>${h}</li>`).join('')}</ul>
                
                <p style="margin-top: 3mm;"><strong>Сферы реализации:</strong></p>
                <ul>${(talent.suitable || []).map(s => `<li>${s}</li>`).join('')}</ul>
                
                <p style="margin-top: 3mm;"><strong>Потенциал реализации:</strong> ${talent.potential || 0}%</p>
                <div class="progress-bar"><div class="progress-fill" style="width: ${talent.potential || 0}%;"></div></div>
                
                <p style="margin-top: 3mm;"><em>${talent.advice || ''}</em></p>
            </div>
        `;
    }

    formatDate(dateStr) {
        if (!dateStr) return '';
        const [day, month, year] = dateStr.split('.');
        return `${day}.${month}.${year}`;
    }
}

module.exports = PDFGeneratorService;