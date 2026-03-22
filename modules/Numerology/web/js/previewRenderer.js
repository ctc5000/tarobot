// modules/Numerology/web/js/previewRenderer.js

class PreviewRenderer {
    constructor() {
        this.userName = 'Иванов Иван Иванович';
        this.birthDate = '02.07.1993';
    }

    /**
     * Получение кода цвета по названию
     */
    getColorCode(colorName) {
        const colorMap = {
            'Красный': '#ff4444',
            'Золотой': '#ffd700',
            'Оранжевый': '#ffa500',
            'Голубой': '#00bfff',
            'Серебряный': '#c0c0c0',
            'Белый': '#ffffff',
            'Желтый': '#ffff00',
            'Зеленый': '#4caf50',
            'Бирюзовый': '#40e0d0',
            'Фиолетовый': '#9c27b0',
            'Синий': '#2196f3',
            'Розовый': '#ff69b4',
            'Коричневый': '#8b4513',
            'Бежевый': '#f5f5dc',
            'Пурпурный': '#800080',
            'Лавандовый': '#e6e6fa',
            'Жемчужный': '#fdeef4',
            'Индиго': '#4b0082'
        };
        return colorMap[colorName] || '#c9a54b';
    }

    /**
     * Генерация полного HTML отчета для превью
     */
    generateFullReportHTML(data, tariffCode) {
        if (tariffCode === 'forecast_basic') {
            return this.generateBasicReportPreview(data);
        }
        if (tariffCode === 'forecast_full') {
            return this.generateFullReportPreview(data);
        }
        if (tariffCode === 'forecast_day') {
            return this.generateDayForecastPreview(data);
        }
        if (tariffCode === 'forecast_week') {
            return this.generateWeekForecastPreview(data);
        }
        if (tariffCode === 'forecast_month') {
            return this.generateMonthForecastPreview(data);
        }
        if (tariffCode === 'forecast_year') {
            return this.generateYearForecastPreview(data);
        }
        if (tariffCode === 'compatibility') {
            return this.generateCompatibilityPreview(data);
        }
        return '<p style="color: var(--text-secondary); text-align: center; padding: 40px;">Отчет формируется...</p>';
    }

    /**
     * Генерация превью базового расчета
     */
    generateBasicReportPreview(data) {
        const base = data.numerology?.base || { fate: 7, name: 5, surname: 3, patronymic: 1 };
        const achilles = data.numerology?.achilles || { number: 6, description: 'Чувство вины — ваш вечный спутник...' };
        const control = data.numerology?.control || { number: 8, description: 'Вы — хранитель равновесия...' };
        const calls = data.numerology?.calls || {
            close: 4, social: 7, world: 9,
            descriptions: {
                close: 'В кругу семьи вы — надежный партнер, строитель, опора для окружающих.',
                social: 'В коллективе вас видят как целеустремленного, победителя, преодолевающего препятствия.',
                world: 'Незнакомцы воспринимают вас как мудрого, загадочного, немного отстраненного наблюдателя.'
            }
        };
        const interpretation = data.interpretation || this.generateBasicInterpretationText(base, achilles, control, calls);
        const deepPortrait = data.deepPortrait || this.generateBasicDeepPortraitText(base, achilles, control, calls);

        return `
            <div class="result-card" style="background: transparent;">
                <div class="result-header">
                    <h2>🔮 КОСМОГРАММА ЛИЧНОСТИ</h2>
                    <span class="result-badge basic">Базовый расчет</span>
                </div>
                
                <div class="result-person-info">
                    <div class="person-detail">
                        <span class="label">Ищущий:</span>
                        <span class="value">${this.userName}</span>
                    </div>
                    <div class="person-detail">
                        <span class="label">Звездная дата:</span>
                        <span class="value">${this.birthDate}</span>
                    </div>
                </div>
                
                <div class="numbers-grid">
                    <div class="number-card">
                        <div class="number-large">${base.fate}</div>
                        <div class="number-label">Судьба</div>
                    </div>
                    <div class="number-card">
                        <div class="number-large">${base.name}</div>
                        <div class="number-label">Имя</div>
                    </div>
                    <div class="number-card">
                        <div class="number-large">${base.surname}</div>
                        <div class="number-label">Род</div>
                    </div>
                    <div class="number-card">
                        <div class="number-large">${base.patronymic}</div>
                        <div class="number-label">Предки</div>
                    </div>
                </div>
                
                <div class="special-numbers">
                    <div class="special-card">
                        <span class="special-label">Ахиллесова пята</span>
                        <span class="special-value">${achilles.number}</span>
                    </div>
                    <div class="special-card">
                        <span class="special-label">Число управления</span>
                        <span class="special-value">${control.number}</span>
                    </div>
                </div>
                
                <div class="calls-section">
                    <h3>Социальные оклики</h3>
                    <div class="calls-grid">
                        <div class="call-card">
                            <div class="call-number">${calls.close}</div>
                            <div class="call-label">Близкий круг</div>
                            <div class="call-desc">${calls.descriptions?.close || ''}</div>
                        </div>
                        <div class="call-card">
                            <div class="call-number">${calls.social}</div>
                            <div class="call-label">Социум</div>
                            <div class="call-desc">${calls.descriptions?.social || ''}</div>
                        </div>
                        <div class="call-card">
                            <div class="call-number">${calls.world}</div>
                            <div class="call-label">Дальний круг</div>
                            <div class="call-desc">${calls.descriptions?.world || ''}</div>
                        </div>
                    </div>
                </div>
                
                <div class="full-interpretation">
                    <h3><i class="fas fa-scroll"></i> СВИТОК СУДЬБЫ</h3>
                    <div class="interpretation-text">
                        <p>${interpretation.replace(/\n/g, '<br>')}</p>
                    </div>
                </div>
                
                <div class="deep-portrait">
                    <h3><i class="fas fa-moon"></i> ГЛУБИННЫЙ ПОРТРЕТ</h3>
                    <div class="portrait-text">
                        <p>${deepPortrait.replace(/\n/g, '<br>')}</p>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Генерация превью полного отчета (расширенная версия)
     */
    generateFullReportPreview(data) {
        // Проверяем, что data существует
        if (!data || !data.data) {
            console.error('Нет данных для полного отчета');
            return '<p style="color: var(--text-secondary); text-align: center; padding: 40px;">Ошибка загрузки данных</p>';
        }

        const reportData = data.data;
        const numerology = reportData.numerology || {};
        const base = numerology.base || { fate: 7, name: 5, surname: 3, patronymic: 1 };
        const achilles = numerology.achilles || { number: 6, description: 'Чувство вины — ваш вечный спутник...' };
        const control = numerology.control || { number: 8, description: 'Вы — хранитель равновесия...' };
        const calls = numerology.calls || {
            close: 4, social: 7, world: 9,
            descriptions: {
                close: 'В кругу семьи вы — надежный партнер, строитель, опора для окружающих.',
                social: 'В коллективе вас видят как целеустремленного, победителя, преодолевающего препятствия.',
                world: 'Незнакомцы воспринимают вас как мудрого, загадочного, немного отстраненного наблюдателя.'
            }
        };

        const interpretations = numerology.interpretations || {};
        const zodiac = reportData.zodiac || {
            name: 'Рак',
            element: 'Вода',
            planet: 'Луна',
            quality: 'Кардинальный',
            description: 'Раки — глубоко эмоциональные и чувствительные люди. Ваша интуиция редко вас подводит.',
            strengths: 'Преданность, заботливость, интуиция, воображение',
            weaknesses: 'Обидчивость, перепады настроения, склонность к унынию',
            lifeMission: 'Создавать уют и безопасность для близких'
        };

        const fengShui = reportData.fengShui || {
            element: 'Вода',
            color: 'Синий, голубой, серебряный',
            direction: 'Север',
            season: 'Зима',
            description: 'Ваша стихия — Вода. Вы текучи, адаптивны, способны находить обходные пути.',
            activation: 'Фонтаны, аквариумы, зеркала, плавные линии',
            affirmation: 'Я теку в потоке жизни, доверяя своей интуиции'
        };

        const tarot = reportData.tarot || {
            fate: { number: 7, name: 'Колесница', keywords: 'Воля, победа, контроль', description: 'Карта Колесницы символизирует победу через силу воли.', advice: 'Контролируйте эмоции, действуйте решительно.' },
            personality: { number: 1, name: 'Маг', keywords: 'Сила воли, мастерство', description: 'Маг наделяет вас способностью воплощать желания в реальность.', advice: 'Действуйте, у вас есть все ресурсы.' },
            control: { number: 9, name: 'Отшельник', keywords: 'Мудрость, поиск', description: 'Отшельник говорит о необходимости иногда уединяться.', advice: 'Уйдите в себя для поиска ответов.' }
        };

        const psychology = reportData.psychology || {};
        const patterns = reportData.patterns || [];
        const interpretation = reportData.interpretation || '';
        const deepPortrait = reportData.deepPortrait || '';

        // Генерация HTML для интерпретаций
        const careerHTML = interpretations.career ? `
    <div class="interpretation-block" style="margin: 15px 0; padding: 20px; background: rgba(0,0,0,0.3); border-radius: 16px;">
        <h4 style="color: var(--primary); margin-bottom: 10px;">💼 КАРЬЕРА</h4>
        <p><strong style="font-size: 1.1rem;">${interpretations.career.title || ''}</strong></p>
        <p style="color: var(--text-secondary); margin: 10px 0;">${interpretations.career.description || ''}</p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 15px 0;">
            <div>
                <strong style="color: #4caf50;">🌟 Сильные стороны</strong>
                <ul style="margin-top: 8px; list-style: none; padding-left: 0;">${(interpretations.career.strengths || []).slice(0, 4).map(s => `<li style="color: var(--text-secondary); margin-bottom: 5px;">✦ ${s}</li>`).join('')}</ul>
            </div>
            <div>
                <strong style="color: #f44336;">🌙 Зоны роста</strong>
                <ul style="margin-top: 8px; list-style: none; padding-left: 0;">${(interpretations.career.weaknesses || []).slice(0, 4).map(w => `<li style="color: var(--text-secondary); margin-bottom: 5px;">✦ ${w}</li>`).join('')}</ul>
            </div>
        </div>
        <p><strong>💼 Подходящие профессии:</strong> ${(interpretations.career.suitable || []).slice(0, 4).join(', ')}</p>
        <p style="margin-top: 15px; padding: 12px; background: rgba(201, 165, 75, 0.1); border-radius: 12px; font-style: italic;">💫 ${interpretations.career.advice || ''}</p>
    </div>
    ` : '';

        const familyHTML = interpretations.family ? `
    <div class="interpretation-block" style="margin: 15px 0; padding: 20px; background: rgba(0,0,0,0.3); border-radius: 16px;">
        <h4 style="color: var(--primary); margin-bottom: 10px;">👨‍👩‍👧‍👦 СЕМЬЯ</h4>
        <p><strong style="font-size: 1.1rem;">${interpretations.family.title || ''}</strong></p>
        <p style="color: var(--text-secondary); margin: 10px 0;">${interpretations.family.description || ''}</p>
        <p><strong>Ваша роль в семье:</strong> ${interpretations.family.role || ''}</p>
        <p><strong>Идеальный партнер:</strong> ${interpretations.family.partnerType || ''}</p>
        <p style="margin-top: 15px; padding: 12px; background: rgba(201, 165, 75, 0.1); border-radius: 12px; font-style: italic;">💫 ${interpretations.family.advice || ''}</p>
    </div>
    ` : '';

        const loveHTML = interpretations.love ? `
    <div class="interpretation-block" style="margin: 15px 0; padding: 20px; background: rgba(0,0,0,0.3); border-radius: 16px;">
        <h4 style="color: var(--primary); margin-bottom: 10px;">❤️ ЛЮБОВЬ</h4>
        <p><strong style="font-size: 1.1rem;">${interpretations.love.title || ''}</strong></p>
        <p style="color: var(--text-secondary); margin: 10px 0;">${interpretations.love.description || ''}</p>
        <p><strong>Ваш стиль любви:</strong> ${interpretations.love.loveStyle || ''}</p>
        <div class="compatibility-bar" style="margin: 15px 0;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>Совместимость</span>
                <span style="color: var(--primary); font-weight: bold;">${interpretations.love.compatibility || 85}%</span>
            </div>
            <div style="width: 100%; height: 8px; background: rgba(255,255,255,0.2); border-radius: 4px;">
                <div style="width: ${interpretations.love.compatibility || 85}%; height: 100%; background: var(--primary); border-radius: 4px;"></div>
            </div>
        </div>
        <p style="margin-top: 15px; padding: 12px; background: rgba(201, 165, 75, 0.1); border-radius: 12px; font-style: italic;">💫 ${interpretations.love.advice || ''}</p>
    </div>
    ` : '';

        const moneyHTML = interpretations.money ? `
    <div class="interpretation-block" style="margin: 15px 0; padding: 20px; background: rgba(0,0,0,0.3); border-radius: 16px;">
        <h4 style="color: var(--primary); margin-bottom: 10px;">💰 ФИНАНСЫ</h4>
        <p><strong style="font-size: 1.1rem;">${interpretations.money.title || ''}</strong></p>
        <p style="color: var(--text-secondary); margin: 10px 0;">${interpretations.money.description || ''}</p>
        <p><strong>Финансовый стиль:</strong> ${interpretations.money.moneyStyle || ''}</p>
        <p><strong>Источники дохода:</strong> ${(interpretations.money.sources || []).slice(0, 3).join(', ')}</p>
        <p style="margin-top: 15px; padding: 12px; background: rgba(201, 165, 75, 0.1); border-radius: 12px; font-style: italic;">💫 ${interpretations.money.advice || ''}</p>
    </div>
    ` : '';

        const healthHTML = interpretations.health ? `
    <div class="interpretation-block" style="margin: 15px 0; padding: 20px; background: rgba(0,0,0,0.3); border-radius: 16px;">
        <h4 style="color: var(--primary); margin-bottom: 10px;">🌿 ЗДОРОВЬЕ</h4>
        <p><strong style="font-size: 1.1rem;">${interpretations.health.title || ''}</strong></p>
        <p style="color: var(--text-secondary); margin: 10px 0;">${interpretations.health.description || ''}</p>
        <div class="energy-bar-container" style="margin: 10px 0;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>Уровень энергии</span>
                <span style="color: var(--primary); font-weight: bold;">${interpretations.health.energyLevel || 8}/10</span>
            </div>
            <div style="width: 100%; height: 8px; background: rgba(255,255,255,0.2); border-radius: 4px;">
                <div style="width: ${(interpretations.health.energyLevel || 8) * 10}%; height: 100%; background: var(--primary); border-radius: 4px;"></div>
            </div>
        </div>
        <p><strong>🔍 Уязвимые органы:</strong> ${(interpretations.health.vulnerable || []).join(', ')}</p>
        <p style="margin-top: 15px; padding: 12px; background: rgba(201, 165, 75, 0.1); border-radius: 12px; font-style: italic;">💫 ${interpretations.health.advice || ''}</p>
    </div>
    ` : '';

        const talentHTML = interpretations.talent ? `
    <div class="interpretation-block" style="margin: 15px 0; padding: 20px; background: rgba(0,0,0,0.3); border-radius: 16px;">
        <h4 style="color: var(--primary); margin-bottom: 10px;">⭐ ТАЛАНТЫ</h4>
        <p><strong style="font-size: 1.1rem;">${interpretations.talent.title || ''}</strong></p>
        <p style="color: var(--text-secondary); margin: 10px 0;">${interpretations.talent.description || ''}</p>
        <p><strong>Ваши таланты:</strong> ${(interpretations.talent.talents || []).slice(0, 4).join(', ')}</p>
        <p><strong>Сферы реализации:</strong> ${(interpretations.talent.suitable || []).slice(0, 4).join(', ')}</p>
        <div style="margin: 15px 0;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>Потенциал реализации</span>
                <span style="color: var(--primary); font-weight: bold;">${interpretations.talent.potential || 95}%</span>
            </div>
            <div style="width: 100%; height: 8px; background: rgba(255,255,255,0.2); border-radius: 4px;">
                <div style="width: ${interpretations.talent.potential || 95}%; height: 100%; background: var(--primary); border-radius: 4px;"></div>
            </div>
        </div>
        <p style="margin-top: 15px; padding: 12px; background: rgba(201, 165, 75, 0.1); border-radius: 12px; font-style: italic;">💫 ${interpretations.talent.advice || ''}</p>
    </div>
    ` : '';

        // Генерация паттернов
        const patternsHTML = patterns.length > 0 ? `
    <div class="patterns-section" style="margin: 20px 0;">
        <h3 style="color: var(--primary); margin-bottom: 15px;"><i class="fas fa-puzzle-piece"></i> ПАТТЕРНЫ ЛИЧНОСТИ</h3>
        ${patterns.slice(0, 8).map(p => `<p style="margin: 12px 0; padding-left: 20px; border-left: 2px solid var(--primary); color: var(--text-secondary);">✦ ${p}</p>`).join('')}
    </div>
    ` : '';

        // Психологический портрет
        const psychologyHTML = (psychology.modality || psychology.archetype || psychology.attachment || psychology.portrait) ? `
    <div class="psychology-section" style="margin: 20px 0;">
        <h3 style="color: var(--primary); margin-bottom: 15px;"><i class="fas fa-brain"></i> ПСИХОЛОГИЧЕСКИЙ ПОРТРЕТ</h3>
        ${psychology.modality ? `
        <div style="margin: 15px 0; padding: 20px; background: rgba(0,0,0,0.3); border-radius: 16px;">
            <h4 style="color: var(--primary);">🧠 НЛП-ПРОФИЛЬ</h4>
            <p><strong>${psychology.modality.title || ''}</strong></p>
            <p style="color: var(--text-secondary);">${psychology.modality.description || ''}</p>
            <p><strong>Ключи доступа:</strong> ${psychology.modality.accessKeys || ''}</p>
        </div>
        ` : ''}
        ${psychology.archetype ? `
        <div style="margin: 15px 0; padding: 20px; background: rgba(0,0,0,0.3); border-radius: 16px;">
            <h4 style="color: var(--primary);">🏛️ АРХЕТИП ЛИЧНОСТИ</h4>
            <p><strong>${psychology.archetype.name || ''}</strong></p>
            <p style="color: var(--text-secondary);">${psychology.archetype.description || ''}</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
                <div><strong style="color: #4caf50;">🎁 Дар:</strong> ${psychology.archetype.gift || ''}</div>
                <div><strong style="color: #f44336;">⚔️ Вызов:</strong> ${psychology.archetype.challenge || ''}</div>
            </div>
            <p style="margin-top: 15px; font-style: italic; color: var(--primary);">"${psychology.archetype.mantra || ''}"</p>
        </div>
        ` : ''}
        ${psychology.attachment ? `
        <div style="margin: 15px 0; padding: 20px; background: rgba(0,0,0,0.3); border-radius: 16px;">
            <h4 style="color: var(--primary);">🤝 ТИП ПРИВЯЗАННОСТИ</h4>
            <p><strong>${psychology.attachment.name || ''}</strong></p>
            <p style="color: var(--text-secondary);">${psychology.attachment.description || ''}</p>
        </div>
        ` : ''}
        ${psychology.portrait ? `
        <div style="margin: 15px 0; padding: 20px; background: rgba(0,0,0,0.3); border-radius: 16px;">
            <p style="color: var(--text-secondary); line-height: 1.8;">${psychology.portrait}</p>
        </div>
        ` : ''}
    </div>
    ` : '';

        return `
        <div class="result-card" style="background: transparent;">
            <div class="result-header">
                <h2>⭐ ПОЛНЫЙ НУМЕРОЛОГИЧЕСКИЙ ОТЧЕТ</h2>
                <span class="result-badge full">Полный отчет</span>
            </div>
            
            <div class="result-person-info">
                <div class="person-detail">
                    <span class="label">Ищущий:</span>
                    <span class="value">${this.userName}</span>
                </div>
                <div class="person-detail">
                    <span class="label">Звездная дата:</span>
                    <span class="value">${this.birthDate}</span>
                </div>
            </div>
            
            <!-- Базовые числа -->
            <div class="numbers-grid">
                <div class="number-card">
                    <div class="number-large">${base.fate}</div>
                    <div class="number-label">Судьба</div>
                </div>
                <div class="number-card">
                    <div class="number-large">${base.name}</div>
                    <div class="number-label">Имя</div>
                </div>
                <div class="number-card">
                    <div class="number-large">${base.surname}</div>
                    <div class="number-label">Род</div>
                </div>
                <div class="number-card">
                    <div class="number-large">${base.patronymic}</div>
                    <div class="number-label">Предки</div>
                </div>
            </div>
            
            <!-- Специальные числа -->
            <div class="special-numbers">
                <div class="special-card">
                    <span class="special-label">Ахиллесова пята</span>
                    <span class="special-value">${achilles.number}</span>
                    <div class="special-desc" style="font-size: 0.8rem; color: var(--text-muted); margin-top: 5px;">${achilles.description?.substring(0, 100)}...</div>
                </div>
                <div class="special-card">
                    <span class="special-label">Число управления</span>
                    <span class="special-value">${control.number}</span>
                    <div class="special-desc" style="font-size: 0.8rem; color: var(--text-muted); margin-top: 5px;">${control.description?.substring(0, 100)}...</div>
                </div>
            </div>
            
            <!-- Социальные оклики -->
            <div class="calls-section">
                <h3>Социальные оклики</h3>
                <div class="calls-grid">
                    <div class="call-card">
                        <div class="call-number">${calls.close}</div>
                        <div class="call-label">Близкий круг</div>
                        <div class="call-desc">${calls.descriptions?.close || ''}</div>
                    </div>
                    <div class="call-card">
                        <div class="call-number">${calls.social}</div>
                        <div class="call-label">Социум</div>
                        <div class="call-desc">${calls.descriptions?.social || ''}</div>
                    </div>
                    <div class="call-card">
                        <div class="call-number">${calls.world}</div>
                        <div class="call-label">Дальний круг</div>
                        <div class="call-desc">${calls.descriptions?.world || ''}</div>
                    </div>
                </div>
            </div>
            
            <!-- Зодиак -->
            <div class="zodiac-section" style="margin: 20px 0; padding: 20px; background: rgba(201, 165, 75, 0.05); border-radius: 20px;">
                <h3><i class="fas fa-star"></i> ЗНАК ЗОДИАКА: ${zodiac.name} (${zodiac.element})</h3>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 15px 0;">
                    <div><strong>Планета:</strong> ${zodiac.planet}</div>
                    <div><strong>Качество:</strong> ${zodiac.quality}</div>
                    <div><strong>Стихия:</strong> ${zodiac.element}</div>
                </div>
                <p style="color: var(--text-secondary);">${zodiac.description}</p>
                <div style="margin-top: 15px;">
                    <strong>🌟 Сильные стороны:</strong> ${zodiac.strengths}<br>
                    <strong>🌙 Зоны роста:</strong> ${zodiac.weaknesses}<br>
                    <strong>🎯 Жизненная миссия:</strong> ${zodiac.lifeMission}
                </div>
            </div>
            
            <!-- Фен-шуй -->
            <div class="fengshui-section" style="margin: 20px 0; padding: 20px; background: rgba(201, 165, 75, 0.05); border-radius: 20px;">
                <h3><i class="fas fa-wind"></i> ЭНЕРГИЯ ФЕН-ШУЙ</h3>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                    <div><strong>Стихия года:</strong> ${fengShui.element}</div>
                    <div><strong>Цвет силы:</strong> ${fengShui.color}</div>
                    <div><strong>Направление удачи:</strong> ${fengShui.direction}</div>
                    <div><strong>Время силы:</strong> ${fengShui.season}</div>
                </div>
                <p style="margin-top: 15px; color: var(--text-secondary);">${fengShui.description}</p>
                <p><strong>Активация:</strong> ${fengShui.activation}</p>
                <p><em>Аффирмация: "${fengShui.affirmation}"</em></p>
            </div>
            
            <!-- Карты Таро -->
            <div class="tarot-cards" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 20px 0;">
                <div style="background: rgba(18, 18, 26, 0.8); padding: 20px; border-radius: 16px; text-align: center;">
                    <div style="font-size: 2.5rem; font-weight: bold; color: var(--primary);">${tarot.fate.number === 0 ? 22 : tarot.fate.number}</div>
                    <div style="font-weight: bold; font-size: 1.1rem;">${tarot.fate.name}</div>
                    <div style="font-size: 0.85rem; color: var(--text-muted);">Карта Судьбы</div>
                    <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 8px;">${tarot.fate.keywords || ''}</div>
                    <p style="margin-top: 12px; font-size: 0.9rem; color: var(--text-secondary);">${tarot.fate.description?.substring(0, 100)}...</p>
                    <p style="margin-top: 12px; font-style: italic; color: var(--primary);">${tarot.fate.advice}</p>
                </div>
                <div style="background: rgba(18, 18, 26, 0.8); padding: 20px; border-radius: 16px; text-align: center;">
                    <div style="font-size: 2.5rem; font-weight: bold; color: var(--primary);">${tarot.personality.number === 0 ? 22 : tarot.personality.number}</div>
                    <div style="font-weight: bold; font-size: 1.1rem;">${tarot.personality.name}</div>
                    <div style="font-size: 0.85rem; color: var(--text-muted);">Карта Личности</div>
                    <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 8px;">${tarot.personality.keywords || ''}</div>
                    <p style="margin-top: 12px; font-size: 0.9rem; color: var(--text-secondary);">${tarot.personality.description?.substring(0, 100)}...</p>
                    <p style="margin-top: 12px; font-style: italic; color: var(--primary);">${tarot.personality.advice}</p>
                </div>
                <div style="background: rgba(18, 18, 26, 0.8); padding: 20px; border-radius: 16px; text-align: center;">
                    <div style="font-size: 2.5rem; font-weight: bold; color: var(--primary);">${tarot.control.number === 0 ? 22 : tarot.control.number}</div>
                    <div style="font-weight: bold; font-size: 1.1rem;">${tarot.control.name}</div>
                    <div style="font-size: 0.85rem; color: var(--text-muted);">Карта Пути</div>
                    <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 8px;">${tarot.control.keywords || ''}</div>
                    <p style="margin-top: 12px; font-size: 0.9rem; color: var(--text-secondary);">${tarot.control.description?.substring(0, 100)}...</p>
                    <p style="margin-top: 12px; font-style: italic; color: var(--primary);">${tarot.control.advice}</p>
                </div>
            </div>
            
            <!-- Психологический портрет -->
            ${psychologyHTML}
            
            <!-- Все интерпретации -->
            <div class="interpretations-section">
                <h3 style="color: var(--primary); margin-bottom: 15px;"><i class="fas fa-chart-line"></i> АНАЛИЗ ПО СФЕРАМ ЖИЗНИ</h3>
                ${careerHTML}
                ${familyHTML}
                ${loveHTML}
                ${moneyHTML}
                ${healthHTML}
                ${talentHTML}
            </div>
            
            <!-- Паттерны -->
            ${patternsHTML}
            
            <!-- Свиток судьбы -->
            <div class="full-interpretation">
                <h3><i class="fas fa-scroll"></i> СВИТОК СУДЬБЫ</h3>
                <div class="interpretation-text" style="background: rgba(0,0,0,0.2); padding: 20px; border-radius: 16px;">
                    <p style="color: var(--text-secondary); line-height: 1.8; white-space: pre-line;">${interpretation}</p>
                </div>
            </div>
            
            <!-- Глубинный портрет -->
            <div class="deep-portrait">
                <h3><i class="fas fa-moon"></i> ГЛУБИННЫЙ ПОРТРЕТ</h3>
                <div class="portrait-text" style="background: rgba(0,0,0,0.2); padding: 20px; border-radius: 16px;">
                    <p style="color: var(--text-secondary); line-height: 1.8; white-space: pre-line;">${deepPortrait}</p>
                </div>
            </div>
        </div>
    `;
    }

    /**
     * Генерация превью прогноза на день
     */
    generateDayForecastPreview(data) {
        const forecast = data.forecast || data;
        const numbers = forecast.numbers || { universal: 8, personal: 6 };
        const desc = forecast.description || {};
        const universal = desc.universal || {
            name: 'Восьмерка',
            element: 'Земля',
            planet: 'Сатурн',
            keywords: ['Власть', 'Успех', 'Изобилие', 'Достижения'],
            positive: 'День успеха и достижений. Хорошо для карьерных вопросов, финансовых операций, важных решений.',
            negative: 'Избегайте властности и меркантильности. Не ставьте деньги выше отношений.',
            career: 'Успех в бизнесе, финансах, управлении. Отличный день для заключения сделок.',
            love: 'Статус и отношения. Хороший день для обсуждения совместных целей и планов.',
            health: 'Обратите внимание на позвоночник и суставы. Полезны умеренные физические нагрузки.',
            finance: 'День больших денег. Удачное время для инвестиций, крупных покупок, финансовых операций.'
        };
        const tarot = forecast.tarot || {
            name: 'Колесница',
            description: 'Карта Колесницы символизирует победу через силу воли и контроль над эмоциями.',
            advice: 'Контролируйте эмоции, но не подавляйте их. Действуйте решительно.'
        };
        const affirmation = forecast.affirmation || 'Я, Иван, достигаю успеха. Изобилие приходит ко мне.';
        const targetDate = forecast.targetDate || '23.03.2026';
        const interpretation = data.interpretation || this.generateDayInterpretationText(forecast, numbers, universal, targetDate);
        const deepPortrait = data.deepPortrait || this.generateDayDeepPortraitText(forecast, numbers, universal, tarot, targetDate);

        return `
            <div class="forecast-card" style="background: transparent;">
                <div class="forecast-header">
                    <div class="forecast-number-large">${numbers.universal}</div>
                    <div class="forecast-title">
                        <h3>ПРОГНОЗ НА ДЕНЬ</h3>
                        <p>${targetDate}</p>
                    </div>
                </div>
                
                <div class="forecast-cosmic-code">
                    <h4><i class="fas fa-star"></i> КОСМИЧЕСКИЙ КОД ДНЯ</h4>
                    <div class="code-grid">
                        <div class="code-item">
                            <span class="label">Универсальное число</span>
                            <span class="value">${numbers.universal}</span>
                            <span class="desc">${universal.keywords?.join(', ') || ''}</span>
                        </div>
                        <div class="code-item">
                            <span class="label">Личное число</span>
                            <span class="value">${numbers.personal || 6}</span>
                            <span class="desc">${desc.personal?.influence || 'Ваше число судьбы усиливает лидерские качества'}</span>
                        </div>
                    </div>
                </div>
                
                <div class="forecast-energy">
                    <div class="energy-badge">
                        <span><i class="fas fa-fire"></i> Стихия: ${universal.element}</span>
                        <span><i class="fas fa-globe"></i> Планета: ${universal.planet}</span>
                    </div>
                </div>
                
                <div class="forecast-main">
                    <p class="forecast-positive">${universal.positive}</p>
                    ${universal.negative ? `<p class="forecast-negative">⚠️ ${universal.negative}</p>` : ''}
                </div>
                
                <div class="forecast-sections">
                    <div class="forecast-section">
                        <h4><i class="fas fa-briefcase"></i> Карьера</h4>
                        <p>${universal.career}</p>
                    </div>
                    <div class="forecast-section">
                        <h4><i class="fas fa-heart"></i> Любовь</h4>
                        <p>${universal.love}</p>
                    </div>
                    <div class="forecast-section">
                        <h4><i class="fas fa-leaf"></i> Здоровье</h4>
                        <p>${universal.health}</p>
                    </div>
                    <div class="forecast-section">
                        <h4><i class="fas fa-coins"></i> Финансы</h4>
                        <p>${universal.finance}</p>
                    </div>
                </div>
                
                <div class="forecast-tarot">
                    <h4><i class="fas fa-crown"></i> КАРТА ТАРО ДНЯ: ${tarot.name}</h4>
                    <div class="tarot-mini">
                        <div class="tarot-desc-mini">
                            <p>${tarot.description}</p>
                            <p class="tarot-advice"><strong>Совет:</strong> ${tarot.advice}</p>
                        </div>
                    </div>
                </div>
                
                <div class="forecast-affirmation">
                    <i class="fas fa-quote-left"></i>
                    <p>${affirmation}</p>
                </div>
            </div>
            
            <div class="full-interpretation">
                <h3><i class="fas fa-scroll"></i> СВИТОК СУДЬБЫ</h3>
                <div class="interpretation-text">
                    <p>${interpretation.replace(/\n/g, '<br>')}</p>
                </div>
            </div>
            
            <div class="deep-portrait">
                <h3><i class="fas fa-moon"></i> ГЛУБИННЫЙ ПОРТРЕТ</h3>
                <div class="portrait-text">
                    <p>${deepPortrait.replace(/\n/g, '<br>')}</p>
                </div>
            </div>
        `;
    }

    /**
     * Генерация превью прогноза на неделю
     */
    generateWeekForecastPreview(data) {
        const forecast = data.forecast || data;
        const weekRange = forecast.weekRange || { start: '23.03.2026', end: '29.03.2026' };
        const weekAnalysis = forecast.weekAnalysis || {
            theme: '🤝 ГАРМОНИЯ И ПАРТНЕРСТВО',
            description: 'Неделя сотрудничества и дипломатии. Удачное время для переговоров, укрепления отношений и командной работы.',
            advice: 'Слушайте партнеров, ищите компромиссы. Вместе вы сильнее.',
            personalNote: 'Число имени 2 помогает в дипломатии и партнерстве.',
            opportunities: ['Партнерства', 'Переговоры', 'Командные проекты'],
            challenges: ['Нерешительность', 'Зависимость от чужого мнения']
        };
        const lifeAreas = forecast.lifeAreas || {
            career: '🤝 Карьера: Успех в командной работе. Проводите переговоры, ищите партнеров.',
            love: '💕 Любовь: Время для романтики и чувственных разговоров. Укрепляйте связь с партнером.',
            health: '💧 Здоровье: Обратите внимание на эмоциональное состояние. Водные процедуры, медитация.',
            finance: '📊 Финансы: Консультируйтесь со специалистами. Избегайте рискованных вложений.'
        };
        const weekRuler = forecast.weekRuler || { planet: 'Луна', element: 'Вода', quality: 'Чувствительность, интуиция' };
        const weekEnergy = forecast.weekEnergy || '🔵 Неделя гармонии и сотрудничества';
        const tarot = forecast.tarot || {
            name: 'Повешенный',
            description: 'Повешенный — это время остановиться и посмотреть на мир иначе. Вы в подвешенном состоянии, но именно сейчас открывается истина.',
            advice: 'Не боитесь с течением. Примите паузу. Смените угол зрения — ответ придет оттуда, откуда не ждали.'
        };
        const fengShui = forecast.fengShui || {
            element: 'Вода',
            zone: 'Север',
            activation: 'Синий цвет, вода, зеркала',
            advice: 'На этой неделе активируйте Север сектор. Используйте Синий цвет, вода, зеркала. Ваше число судьбы 3 усилит эффект.'
        };
        const colors = forecast.colors || ['Голубой', 'Серебряный', 'Белый'];
        const crystals = forecast.crystals || ['Лунный камень', 'Жемчуг', 'Аквамарин'];
        const scents = forecast.scents || ['Лаванда', 'Роза', 'Ромашка'];
        const affirmation = forecast.affirmation || 'Я, Иван, в гармонии с собой и миром. Я доверяю своей интуиции в партнерстве.';
        const personNumbers = forecast.personNumbers || { fate: 7, name: 5, surname: 3, patronymic: 1 };

        const dailyBreakdown = forecast.dailyBreakdown || [
            { dayName: 'Понедельник', date: '23.03.2026', universalNumber: 9, personalNumber: 3, energy: '⚡⚡⚡ Умеренная', focus: 'Завершение и отпускание. Число судьбы 3 помогает трансформироваться.', advice: 'Отпускайте с благодарностью. Освобождайте место.', color: 'Белый', crystal: 'Горный хрусталь', favorableHours: ['10:00 - 12:00', '16:00 - 18:00'], isToday: true },
            { dayName: 'Вторник', date: '24.03.2026', universalNumber: 1, personalNumber: 4, energy: '⚡⚡⚡⚡⚡ Высокая', focus: 'Лидерство и новые начинания. Число судьбы 3 усиливает инициативу.', advice: 'Действуйте смело, но не давите на других.', color: 'Красный', crystal: 'Рубин', favorableHours: ['11:00 - 13:00', '15:00 - 17:00'], isToday: false },
            { dayName: 'Среда', date: '25.03.2026', universalNumber: 2, personalNumber: 5, energy: '⚡⚡⚡ Средняя', focus: 'Партнерство и дипломатия. Число имени 2 помогает в общении.', advice: 'Слушайте и слышьте. Дипломатия - ключ к успеху.', color: 'Голубой', crystal: 'Лунный камень', favorableHours: ['09:00 - 11:00', '14:00 - 16:00'], isToday: false },
            { dayName: 'Четверг', date: '26.03.2026', universalNumber: 3, personalNumber: 6, energy: '⚡⚡⚡⚡ Высокая', focus: 'Творчество и самовыражение. Ваша креативность на высоте.', advice: 'Творите и делитесь. Ваши идеи вдохновляют.', color: 'Желтый', crystal: 'Цитрин', favorableHours: ['10:00 - 12:00', '16:00 - 18:00'], isToday: false },
            { dayName: 'Пятница', date: '27.03.2026', universalNumber: 4, personalNumber: 7, energy: '⚡⚡⚡ Средняя', focus: 'Порядок и структура. Число фамилии 8 дает организованность.', advice: 'Порядок создает свободу. Организуйте пространство.', color: 'Зеленый', crystal: 'Изумруд', favorableHours: ['08:00 - 10:00', '13:00 - 15:00'], isToday: false },
            { dayName: 'Суббота', date: '28.03.2026', universalNumber: 5, personalNumber: 8, energy: '⚡⚡⚡⚡ Высокая', focus: 'Перемены и свобода. Число судьбы 3 зовет к приключениям.', advice: 'Будьте открыты новому. Перемены ведут к росту.', color: 'Бирюзовый', crystal: 'Бирюза', favorableHours: ['11:00 - 13:00', '15:00 - 17:00'], isToday: false },
            { dayName: 'Воскресенье', date: '29.03.2026', universalNumber: 6, personalNumber: 9, energy: '⚡⚡⚡⚡ Гармоничная', focus: 'Забота и гармония. Число отчества 17 усиливает эмпатию.', advice: 'Забота о других вернется сторицей.', color: 'Розовый', crystal: 'Розовый кварц', favorableHours: ['10:00 - 12:00', '17:00 - 19:00'], isToday: false }
        ];

        const favorableDays = forecast.favorableDays || {
            favorable: [
                { name: 'Вторник', date: '24.03.2026', number: 1, reason: 'День новых начинаний' },
                { name: 'Четверг', date: '26.03.2026', number: 3, reason: 'Творческий день' },
                { name: 'Воскресенье', date: '29.03.2026', number: 6, reason: 'Гармоничный день' }
            ],
            neutral: [
                { name: 'Среда', date: '25.03.2026', number: 2, reason: 'День партнерства' },
                { name: 'Пятница', date: '27.03.2026', number: 4, reason: 'День порядка' }
            ],
            challenging: [
                { name: 'Понедельник', date: '23.03.2026', number: 9, reason: 'День завершения' },
                { name: 'Суббота', date: '28.03.2026', number: 5, reason: 'День перемен' }
            ]
        };

        const interpretation = data.interpretation || this.generateWeekInterpretationText(forecast, weekRange, weekAnalysis, lifeAreas, dailyBreakdown, personNumbers);
        const deepPortrait = data.deepPortrait || this.generateWeekDeepPortraitText(forecast, weekRange, weekAnalysis, dailyBreakdown, personNumbers, tarot);

        const dailyHTML = dailyBreakdown.map(day => {
            const todayClass = day.isToday ? ' today' : '';
            return `
            <div class="week-day-card${todayClass}">
                <div class="day-header">
                    <span class="day-name">${day.dayName}</span>
                    <span class="day-date">${day.date}</span>
                </div>
                <div class="day-numbers">
                    <span class="day-number-large">${day.universalNumber}</span>
                    <span class="day-personal">личн. ${day.personalNumber}</span>
                </div>
                <div class="day-energy">${day.energy}</div>
                <div class="day-focus">${day.focus}</div>
                <div class="day-advice">💫 ${day.advice}</div>
                <div class="day-details">
                    <span><i class="fas fa-clock"></i> ${day.favorableHours ? day.favorableHours[0] : ''}</span>
                    <span><i class="fas fa-palette"></i> ${day.color || ''}</span>
                </div>
            </div>
            `;
        }).join('');

        const favorableHTML = (favorableDays.favorable || []).map(day => `
        <div class="favorable-day-item">
            <span class="day-name">${day.name}</span>
            <span class="day-date">${day.date}</span>
            <span class="day-number">${day.number}</span>
            <span class="day-reason">${day.reason}</span>
        </div>
        `).join('');

        const neutralHTML = (favorableDays.neutral || []).map(day => `
        <div class="neutral-day-item">
            <span class="day-name">${day.name}</span>
            <span class="day-date">${day.date}</span>
            <span class="day-number">${day.number}</span>
            <span class="day-reason">${day.reason}</span>
        </div>
        `).join('');

        const challengingHTML = (favorableDays.challenging || []).map(day => `
        <div class="neutral-day-item">
            <span class="day-name">${day.name}</span>
            <span class="day-date">${day.date}</span>
            <span class="day-number">${day.number}</span>
            <span class="day-reason">${day.reason}</span>
        </div>
        `).join('');

        return `
            <div class="forecast-card week-forecast">
                <div class="forecast-header">
                    <div class="forecast-number-large">${forecast.weekNumber || 2}</div>
                    <div class="forecast-title">
                        <h3>ПРОГНОЗ НА НЕДЕЛЮ</h3>
                        <p class="week-range">${weekRange.start} — ${weekRange.end}</p>
                        <div class="week-energy-badge">${weekEnergy}</div>
                    </div>
                </div>
                
                <div class="week-ruler-info">
                    <span><i class="fas fa-globe"></i> Покровитель: ${weekRuler.planet} (${weekRuler.element})</span>
                    <span><i class="fas fa-star"></i> Качество: ${weekRuler.quality}</span>
                </div>
                
                <div class="week-theme">
                    <h4>${weekAnalysis.theme}</h4>
                    <p>${weekAnalysis.description}</p>
                    <div class="personal-note">${weekAnalysis.personalNote}</div>
                </div>
                
                <div class="week-advice">
                    <i class="fas fa-quote-left"></i>
                    <p>${weekAnalysis.advice}</p>
                </div>
                
                <div class="week-sections">
                    <div class="section opportunities">
                        <h5><i class="fas fa-check-circle"></i> Возможности</h5>
                        <ul>
                            ${weekAnalysis.opportunities.map(o => `<li>${o}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="section challenges">
                        <h5><i class="fas fa-exclamation-triangle"></i> Вызовы</h5>
                        <ul>
                            ${weekAnalysis.challenges.map(c => `<li>${c}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                
                <div class="life-areas-grid">
                    <div class="life-area career">
                        <i class="fas fa-briefcase"></i>
                        <p>${lifeAreas.career}</p>
                    </div>
                    <div class="life-area love">
                        <i class="fas fa-heart"></i>
                        <p>${lifeAreas.love}</p>
                    </div>
                    <div class="life-area health">
                        <i class="fas fa-leaf"></i>
                        <p>${lifeAreas.health}</p>
                    </div>
                    <div class="life-area finance">
                        <i class="fas fa-coins"></i>
                        <p>${lifeAreas.finance}</p>
                    </div>
                </div>
                
                <h4 class="section-title"><i class="fas fa-calendar-alt"></i> ДНЕВНАЯ РАЗБИВКА</h4>
                <div class="week-daily-breakdown">
                    ${dailyHTML}
                </div>
                
                <div class="favorable-days-section">
                    <h4><i class="fas fa-star"></i> БЛАГОПРИЯТНЫЕ ДНИ</h4>
                    <div class="favorable-days-grid">
                        ${favorableHTML}
                    </div>
                    
                    ${neutralHTML ? `
                    <h4><i class="fas fa-minus-circle"></i> НЕЙТРАЛЬНЫЕ ДНИ</h4>
                    <div class="neutral-days-grid">
                        ${neutralHTML}
                    </div>
                    ` : ''}
                    
                    ${challengingHTML ? `
                    <h4><i class="fas fa-exclamation-circle"></i> СЛОЖНЫЕ ДНИ</h4>
                    <div class="neutral-days-grid">
                        ${challengingHTML}
                    </div>
                    ` : ''}
                </div>
                
                <div class="week-tarot">
                    <h4><i class="fas fa-crown"></i> КАРТА ТАРО НЕДЕЛИ: ${tarot.name}</h4>
                    <div class="tarot-mini">
                        <div class="tarot-desc-mini">
                            <p>${tarot.description}</p>
                            <p class="tarot-advice"><strong>Совет:</strong> ${tarot.advice}</p>
                        </div>
                    </div>
                </div>
                
                <div class="week-details-grid">
                    <div class="detail-block">
                        <h5><i class="fas fa-wind"></i> Фен-шуй</h5>
                        <p><strong>Элемент:</strong> ${fengShui.element}</p>
                        <p><strong>Зона:</strong> ${fengShui.zone}</p>
                        <p><strong>Активация:</strong> ${fengShui.activation}</p>
                        <p class="advice">${fengShui.advice}</p>
                    </div>
                    
                    <div class="detail-block">
                        <h5><i class="fas fa-paint-brush"></i> Цвета недели</h5>
                        <div class="color-chips">
                            ${colors.map(c => `<span class="color-chip" style="background-color: ${this.getColorCode(c)}">${c}</span>`).join('')}
                        </div>
                    </div>
                    
                    <div class="detail-block">
                        <h5><i class="fas fa-gem"></i> Камни</h5>
                        <p>${crystals.join(', ')}</p>
                    </div>
                    
                    <div class="detail-block">
                        <h5><i class="fas fa-leaf"></i> Ароматы</h5>
                        <p>${scents.join(', ')}</p>
                    </div>
                </div>
                
                <div class="week-affirmation">
                    <i class="fas fa-quote-left"></i>
                    <p>${affirmation}</p>
                </div>
            </div>
            
            <div class="full-interpretation">
                <h3><i class="fas fa-scroll"></i> СВИТОК СУДЬБЫ</h3>
                <div class="interpretation-text">
                    <p>${interpretation.replace(/\n/g, '<br>')}</p>
                </div>
            </div>
            
            <div class="deep-portrait">
                <h3><i class="fas fa-moon"></i> ГЛУБИННЫЙ ПОРТРЕТ</h3>
                <div class="portrait-text">
                    <p>${deepPortrait.replace(/\n/g, '<br>')}</p>
                </div>
            </div>
        `;
    }

    /**
     * Генерация превью прогноза на месяц
     */
    generateMonthForecastPreview(data) {
        const forecast = data.forecast || data;
        const monthRange = forecast.monthRange || { start: '01.03.2026', end: '31.03.2026', monthName: 'Март', year: 2026 };
        const monthAnalysis = forecast.monthAnalysis || {
            theme: '⚖️ УСПЕХ И ИЗОБИЛИЕ',
            description: 'Март — месяц достижений и материального благополучия. Энергия успеха и изобилия будет сопровождать вас во всех начинаниях.',
            advice: 'Действуйте решительно. Ваши усилия приведут к материальным результатам.',
            personalNote: 'Ваше число судьбы 7 усиливает аналитические способности.',
            opportunities: ['Финансовые вопросы', 'Карьерный рост', 'Крупные сделки', 'Инвестиции'],
            challenges: ['Властность', 'Меркантильность', 'Выгорание']
        };
        const lifeAreas = forecast.lifeAreas || {
            career: '💼 Карьера: Успех в бизнесе, финансах, управлении. Заключайте сделки.',
            love: '💍 Любовь: Статус и отношения. Обсуждайте совместные цели.',
            health: '🧘‍♂️ Здоровье: Обратите внимание на позвоночник и суставы.',
            finance: '💰 Финансы: Крупные деньги. Инвестиции, крупные покупки.'
        };
        const monthRuler = forecast.monthRuler || { planet: 'Сатурн', element: 'Земля', quality: 'Дисциплина, карма' };
        const monthEnergy = forecast.monthEnergy || '💰 Месяц успеха и изобилия';
        const monthElement = forecast.monthElement || 'Земля';
        const tarot = forecast.tarot || {
            name: 'Сила',
            description: 'Карта Силы говорит о внутренней мощи и способности управлять своими страстями.',
            advice: 'Действуйте из любви, а не из страха.'
        };
        const fengShui = forecast.fengShui || {
            element: 'Земля',
            zone: 'Северо-Восток',
            activation: 'Терракотовый цвет, кристаллы',
            advice: 'В этом месяце активируйте Северо-Восточный сектор.'
        };
        const colors = forecast.colors || ['Золотой', 'Коричневый', 'Оранжевый'];
        const crystals = forecast.crystals || ['Тигровый глаз', 'Оникс', 'Гематит'];
        const scents = forecast.scents || ['Кедр', 'Сосна', 'Пачули'];
        const affirmation = forecast.affirmation || 'Я, Иван, достигаю успеха. Изобилие приходит ко мне в этом месяце.';

        const weeklyBreakdown = forecast.weeklyBreakdown || [
            { weekNumber: 1, weekNumberValue: 6, startDate: '02.03.2026', endDate: '08.03.2026', focus: 'Забота и гармония. Уделите время семье.', energy: '⚡⚡⚡⚡ Гармоничная' },
            { weekNumber: 2, weekNumberValue: 8, startDate: '09.03.2026', endDate: '15.03.2026', focus: 'Успех и достижения. Время для финансовых решений.', energy: '⚡⚡⚡⚡⚡ Максимальная' },
            { weekNumber: 3, weekNumberValue: 3, startDate: '16.03.2026', endDate: '22.03.2026', focus: 'Творчество и самовыражение. Генерируйте идеи.', energy: '⚡⚡⚡⚡ Высокая' },
            { weekNumber: 4, weekNumberValue: 2, startDate: '23.03.2026', endDate: '29.03.2026', focus: 'Партнерство и дипломатия. Завершайте начатое.', energy: '⚡⚡⚡ Средняя' }
        ];

        const importantDates = forecast.importantDates || [
            { date: '08.03.2026', dayNumber: 6, dayOfWeek: 'Воскресенье', reason: 'Гармоничный день для семьи', isWeekend: true },
            { date: '21.03.2026', dayNumber: 8, dayOfWeek: 'Суббота', reason: 'День успеха и финансовых решений', isWeekend: true },
            { date: '25.03.2026', dayNumber: 5, dayOfWeek: 'Среда', reason: 'День перемен и новых возможностей', isWeekend: false }
        ];

        const interpretation = data.interpretation || this.generateMonthInterpretationText(forecast, monthRange, monthAnalysis, lifeAreas, weeklyBreakdown, importantDates);
        const deepPortrait = data.deepPortrait || this.generateMonthDeepPortraitText(forecast, monthRange, monthAnalysis, weeklyBreakdown, tarot);

        const weeklyHTML = weeklyBreakdown.map(week => `
        <div class="month-week-card">
            <div class="week-header">
                <span class="week-number">Неделя ${week.weekNumber}</span>
                <span class="week-dates">${week.startDate} — ${week.endDate}</span>
                <span class="week-energy">${week.energy}</span>
            </div>
            <div class="week-content">
                <div class="week-number-value">Число недели: <strong>${week.weekNumberValue}</strong></div>
                <div class="week-focus">${week.focus}</div>
            </div>
        </div>
        `).join('');

        const importantDatesHTML = importantDates.map(date => `
        <div class="important-date-item">
            <span class="date-day">${date.date}</span>
            <span class="date-dayofweek">${date.dayOfWeek}</span>
            <span class="date-number">${date.dayNumber}</span>
            <span class="date-reason">${date.reason}</span>
        </div>
        `).join('');

        return `
            <div class="forecast-card month-forecast">
                <div class="forecast-header">
                    <div class="forecast-number-large">${forecast.monthNumber || 8}</div>
                    <div class="forecast-title">
                        <h3>ПРОГНОЗ НА МЕСЯЦ</h3>
                        <p class="month-range">${monthRange.monthName} ${monthRange.year}</p>
                        <p class="month-dates">${monthRange.start} — ${monthRange.end}</p>
                        <div class="month-energy-badge">${monthEnergy}</div>
                    </div>
                </div>
                
                <div class="month-ruler-info">
                    <span><i class="fas fa-globe"></i> Покровитель: ${monthRuler.planet} (${monthRuler.element})</span>
                    <span><i class="fas fa-star"></i> Качество: ${monthRuler.quality}</span>
                    <span><i class="fas fa-wind"></i> Стихия: ${monthElement}</span>
                </div>
                
                <div class="month-theme">
                    <h4>${monthAnalysis.theme}</h4>
                    <p>${monthAnalysis.description}</p>
                    <div class="personal-note">${monthAnalysis.personalNote}</div>
                </div>
                
                <div class="month-advice">
                    <i class="fas fa-quote-left"></i>
                    <p>${monthAnalysis.advice}</p>
                </div>
                
                <div class="month-sections">
                    <div class="section opportunities">
                        <h5><i class="fas fa-check-circle"></i> Возможности месяца</h5>
                        <ul>
                            ${monthAnalysis.opportunities.map(o => `<li>${o}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="section challenges">
                        <h5><i class="fas fa-exclamation-triangle"></i> Вызовы месяца</h5>
                        <ul>
                            ${monthAnalysis.challenges.map(c => `<li>${c}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                
                <div class="life-areas-grid">
                    <div class="life-area career">
                        <i class="fas fa-briefcase"></i>
                        <p>${lifeAreas.career}</p>
                    </div>
                    <div class="life-area love">
                        <i class="fas fa-heart"></i>
                        <p>${lifeAreas.love}</p>
                    </div>
                    <div class="life-area health">
                        <i class="fas fa-leaf"></i>
                        <p>${lifeAreas.health}</p>
                    </div>
                    <div class="life-area finance">
                        <i class="fas fa-coins"></i>
                        <p>${lifeAreas.finance}</p>
                    </div>
                </div>
                
                <h4 class="section-title"><i class="fas fa-calendar-alt"></i> НЕДЕЛЬНАЯ РАЗБИВКА</h4>
                <div class="month-weekly-breakdown">
                    ${weeklyHTML}
                </div>
                
                <div class="important-dates-section">
                    <h4><i class="fas fa-star"></i> ВАЖНЫЕ ДАТЫ МЕСЯЦА</h4>
                    <div class="important-dates-grid">
                        ${importantDatesHTML}
                    </div>
                </div>
                
                <div class="month-tarot">
                    <h4><i class="fas fa-crown"></i> КАРТА ТАРО МЕСЯЦА: ${tarot.name}</h4>
                    <div class="tarot-mini">
                        <div class="tarot-desc-mini">
                            <p>${tarot.description}</p>
                            <p class="tarot-advice"><strong>Совет:</strong> ${tarot.advice}</p>
                        </div>
                    </div>
                </div>
                
                <div class="month-details-grid">
                    <div class="detail-block">
                        <h5><i class="fas fa-wind"></i> Фен-шуй</h5>
                        <p><strong>Элемент:</strong> ${fengShui.element}</p>
                        <p><strong>Зона:</strong> ${fengShui.zone}</p>
                        <p><strong>Активация:</strong> ${fengShui.activation}</p>
                        <p class="advice">${fengShui.advice}</p>
                    </div>
                    
                    <div class="detail-block">
                        <h5><i class="fas fa-paint-brush"></i> Цвета месяца</h5>
                        <div class="color-chips">
                            ${colors.map(c => `<span class="color-chip" style="background-color: ${this.getColorCode(c)}">${c}</span>`).join('')}
                        </div>
                    </div>
                    
                    <div class="detail-block">
                        <h5><i class="fas fa-gem"></i> Камни</h5>
                        <p>${crystals.join(', ')}</p>
                    </div>
                    
                    <div class="detail-block">
                        <h5><i class="fas fa-leaf"></i> Ароматы</h5>
                        <p>${scents.join(', ')}</p>
                    </div>
                </div>
                
                <div class="month-affirmation">
                    <i class="fas fa-quote-left"></i>
                    <p>${affirmation}</p>
                </div>
            </div>
            
            <div class="full-interpretation">
                <h3><i class="fas fa-scroll"></i> СВИТОК СУДЬБЫ</h3>
                <div class="interpretation-text">
                    <p>${interpretation.replace(/\n/g, '<br>')}</p>
                </div>
            </div>
            
            <div class="deep-portrait">
                <h3><i class="fas fa-moon"></i> ГЛУБИННЫЙ ПОРТРЕТ</h3>
                <div class="portrait-text">
                    <p>${deepPortrait.replace(/\n/g, '<br>')}</p>
                </div>
            </div>
        `;
    }

    /**
     * Генерация превью прогноза на год
     */
    generateYearForecastPreview(data) {
        const forecast = data.forecast || data;
        const yearInfo = data.yearInfo || { year: 2026, universalYearNumber: 9 };
        const yearCycle = forecast.yearCycle || {
            name: 'Цикл Экспансии',
            description: 'Год расширения и новых связей. Время для коммуникации, творчества и самореализации.',
            energy: '🦋 Энергия расширения'
        };
        const yearAnalysis = forecast.yearAnalysis || {
            theme: '🎨 ТВОРЧЕСТВО И РАДОСТЬ',
            description: '2026 год — год творческого подъема и новых возможностей. Вдохновение и оптимизм будут вашими постоянными спутниками.',
            advice: 'Творите, общайтесь, делитесь идеями. Радость притягивает удачу.',
            personalNote: 'Ваше число судьбы 7 в год творчества дает уникальное сочетание глубины и легкости.',
            opportunities: ['Творческие проекты', 'Новые знакомства', 'Презентации', 'Путешествия'],
            challenges: ['Поверхностность', 'Разбросанность', 'Легкомыслие']
        };
        const yearRuler = forecast.yearRuler || { planet: 'Юпитер', element: 'Воздух', quality: 'Экспансия, оптимизм' };
        const yearEnergy = forecast.yearEnergy || '🟡 Творческий год';
        const yearTheme = forecast.yearTheme || '🎨 ГОД ТВОРЧЕСТВА И РАЗВИТИЯ';
        const tarot = forecast.tarot || {
            name: 'Императрица',
            description: 'Карта Императрицы символизирует плодородие, творчество и изобилие.',
            advice: 'Сейте семена желаний. Все, что вы начнете в этом году, имеет потенциал вырасти во что-то великое.'
        };
        const fengShui = forecast.fengShui || {
            element: 'Воздух',
            zone: 'Восток',
            activation: 'Зеленый цвет, растения',
            advice: 'В этом году активируйте Восточный сектор. Используйте зеленый цвет и растения.'
        };
        const colors = forecast.colors || ['Желтый', 'Зеленый', 'Бирюзовый'];
        const crystals = forecast.crystals || ['Цитрин', 'Топаз', 'Аметист'];
        const scents = forecast.scents || ['Цитрус', 'Мята', 'Бергамот'];
        const affirmation = forecast.affirmation || 'Я, Иван, выражаю себя свободно. Моя креативность безгранична в 2026 году.';
        const chineseZodiac = yearInfo.chineseZodiac || {
            animal: 'Лошадь',
            element: 'Огонь',
            description: 'Год Огненной Лошади — время движения, активности и перемен.'
        };

        const quarterlyBreakdown = forecast.quarterlyBreakdown || [
            { season: 'Весна', months: ['Март', 'Апрель', 'Май'], element: 'Воздух', energy: 'Рост и обновление', number: 6, focus: 'Семья и гармония', advice: 'Сажайте семена будущих проектов.' },
            { season: 'Лето', months: ['Июнь', 'Июль', 'Август'], element: 'Огонь', energy: 'Активность и страсть', number: 9, focus: 'Творчество и самовыражение', advice: 'Действуйте активно.' },
            { season: 'Осень', months: ['Сентябрь', 'Октябрь', 'Ноябрь'], element: 'Земля', energy: 'Сбор урожая', number: 3, focus: 'Обучение и развитие', advice: 'Собирайте плоды.' },
            { season: 'Зима', months: ['Декабрь', 'Январь', 'Февраль'], element: 'Вода', energy: 'Покой и накопление', number: 7, focus: 'Анализ и планирование', advice: 'Отдыхайте и планируйте.' }
        ];

        const monthlyHighlights = forecast.monthlyHighlights || [
            { monthName: 'Март', number: 8, importance: 'важный', reason: 'Месяц финансового успеха' },
            { monthName: 'Май', number: 1, importance: 'важный', reason: 'Новые начинания' },
            { monthName: 'Июнь', number: 3, importance: 'творческий', reason: 'Творческий подъем' },
            { monthName: 'Ноябрь', number: 11, importance: 'судьбоносный', reason: 'Месяц прозрения' }
        ];

        const importantDates = forecast.importantDates || [
            { date: '01.01.2026', name: 'Новый год', number: 8, reason: 'Планетарный новый год. Время загадывать желания.', type: 'astronomical' },
            { date: '20.03.2026', name: 'Весеннее равноденствие', number: 5, reason: 'Баланс дня и ночи, время для начинаний', type: 'astronomical' },
            { date: '02.07.2026', name: 'Ваш день рождения', number: 7, reason: 'Начало вашего персонального года', type: 'personal' }
        ];

        const interpretation = data.interpretation || this.generateYearInterpretationText(forecast, yearInfo, yearAnalysis, quarterlyBreakdown, monthlyHighlights, importantDates);
        const deepPortrait = data.deepPortrait || this.generateYearDeepPortraitText(forecast, yearInfo, yearCycle, yearAnalysis, quarterlyBreakdown, tarot);

        const quarterlyHTML = quarterlyBreakdown.map(q => `
        <div class="year-quarter-card">
            <div class="quarter-header">
                <span class="quarter-name">${q.season}</span>
                <span class="quarter-number">${q.number}</span>
            </div>
            <div class="quarter-months">${q.months.join(' • ')}</div>
            <div class="quarter-energy">${q.energy}</div>
            <div class="quarter-focus">${q.focus}</div>
            <div class="quarter-advice">💫 ${q.advice}</div>
        </div>
        `).join('');

        const monthsHTML = monthlyHighlights.map(month => `
        <div class="year-month-item importance-${month.importance}">
            <span class="month-name">${month.monthName}</span>
            <span class="month-number">${month.number}</span>
            <span class="month-reason">${month.reason}</span>
        </div>
        `).join('');

        const datesHTML = importantDates.map(date => `
        <div class="year-date-item type-${date.type}">
            <span class="date-day">${date.date}</span>
            <span class="date-name">${date.name}</span>
            <span class="date-number">${date.number}</span>
            <span class="date-reason">${date.reason}</span>
        </div>
        `).join('');

        return `
            <div class="forecast-card year-forecast">
                <div class="forecast-header">
                    <div class="forecast-number-large">${forecast.yearNumber || 3}</div>
                    <div class="forecast-title">
                        <h3>ПРОГНОЗ НА ${yearInfo.year} ГОД</h3>
                        <div class="year-theme-badge">${yearTheme}</div>
                    </div>
                </div>
                
                <div class="year-universal-number">
                    Универсальное число года: <strong>${yearInfo.universalYearNumber}</strong>
                </div>
                
                <div class="year-ruler-info">
                    <span><i class="fas fa-globe"></i> Покровитель: ${yearRuler.planet} (${yearRuler.element})</span>
                    <span><i class="fas fa-star"></i> Качество: ${yearRuler.quality}</span>
                </div>
                
                <div class="year-cycle">
                    <div class="cycle-name">${yearCycle.name}</div>
                    <div class="cycle-desc">${yearCycle.description}</div>
                    <div class="cycle-energy">${yearCycle.energy}</div>
                </div>
                
                <div class="chinese-zodiac">
                    <div class="zodiac-animal">🐴 ${chineseZodiac.animal} (${chineseZodiac.element})</div>
                    <div class="zodiac-desc">${chineseZodiac.description}</div>
                </div>
                
                <div class="year-theme">
                    <h4>${yearAnalysis.theme}</h4>
                    <p>${yearAnalysis.description}</p>
                    <div class="personal-note">${yearAnalysis.personalNote}</div>
                </div>
                
                <div class="year-advice">
                    <i class="fas fa-quote-left"></i>
                    <p>${yearAnalysis.advice}</p>
                </div>
                
                <div class="year-sections">
                    <div class="section opportunities">
                        <h5><i class="fas fa-check-circle"></i> Возможности</h5>
                        <ul>
                            ${yearAnalysis.opportunities.map(o => `<li>${o}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="section challenges">
                        <h5><i class="fas fa-exclamation-triangle"></i> Вызовы</h5>
                        <ul>
                            ${yearAnalysis.challenges.map(c => `<li>${c}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                
                <h4 class="section-title"><i class="fas fa-calendar-alt"></i> КВАРТАЛЬНАЯ РАЗБИВКА</h4>
                <div class="year-quarterly-breakdown">
                    ${quarterlyHTML}
                </div>
                
                <h4 class="section-title"><i class="fas fa-star"></i> КЛЮЧЕВЫЕ МЕСЯЦЫ</h4>
                <div class="year-months-grid">
                    ${monthsHTML}
                </div>
                
                <h4 class="section-title"><i class="fas fa-calendar-check"></i> ВАЖНЫЕ ДАТЫ</h4>
                <div class="year-dates-grid">
                    ${datesHTML}
                </div>
                
                <div class="year-tarot">
                    <h4><i class="fas fa-crown"></i> КАРТА ТАРО ГОДА: ${tarot.name}</h4>
                    <div class="tarot-mini">
                        <div class="tarot-desc-mini">
                            <p>${tarot.description}</p>
                            <p class="tarot-advice"><strong>Совет:</strong> ${tarot.advice}</p>
                        </div>
                    </div>
                </div>
                
                <div class="year-details-grid">
                    <div class="detail-block">
                        <h5><i class="fas fa-wind"></i> Фен-шуй</h5>
                        <p><strong>Элемент:</strong> ${fengShui.element}</p>
                        <p><strong>Зона:</strong> ${fengShui.zone}</p>
                        <p><strong>Активация:</strong> ${fengShui.activation}</p>
                        <p class="advice">${fengShui.advice}</p>
                    </div>
                    
                    <div class="detail-block">
                        <h5><i class="fas fa-paint-brush"></i> Цвета года</h5>
                        <div class="color-chips">
                            ${colors.map(c => `<span class="color-chip" style="background-color: ${this.getColorCode(c)}">${c}</span>`).join('')}
                        </div>
                    </div>
                    
                    <div class="detail-block">
                        <h5><i class="fas fa-gem"></i> Камни</h5>
                        <p>${crystals.join(', ')}</p>
                    </div>
                    
                    <div class="detail-block">
                        <h5><i class="fas fa-leaf"></i> Ароматы</h5>
                        <p>${scents.join(', ')}</p>
                    </div>
                </div>
                
                <div class="year-affirmation">
                    <i class="fas fa-quote-left"></i>
                    <p>${affirmation}</p>
                </div>
            </div>
            
            <div class="full-interpretation">
                <h3><i class="fas fa-scroll"></i> СВИТОК СУДЬБЫ</h3>
                <div class="interpretation-text">
                    <p>${interpretation.replace(/\n/g, '<br>')}</p>
                </div>
            </div>
            
            <div class="deep-portrait">
                <h3><i class="fas fa-moon"></i> ГЛУБИННЫЙ ПОРТРЕТ</h3>
                <div class="portrait-text">
                    <p>${deepPortrait.replace(/\n/g, '<br>')}</p>
                </div>
            </div>
        `;
    }

    /**
     * Генерация превью совместимости
     */
    generateCompatibilityPreview(data) {
        const compatibility = data.compatibility || {
            score: 85,
            level: '💫 Высокая совместимость',
            strengths: [
                '💑 **Глубокое взаимопонимание** — вы чувствуете друг друга на интуитивном уровне',
                '✨ **Общие ценности** — оба цените семью и стабильность',
                '🔄 **Дополнение друг друга** — ваши сильные стороны компенсируют слабости партнера'
            ],
            challenges: [
                '⚠️ **Разный темп жизни** — один из вас более активен, другой — спокоен',
                '💭 **Разные способы выражения чувств** — важно научиться понимать язык любви друг друга'
            ],
            advice: 'Ваш союз имеет высокий потенциал для гармоничных отношений. Главное — научиться принимать различия и видеть в них не недостатки, а преимущества.'
        };

        const person1 = data.person1 || {
            fullName: this.userName,
            birthDate: this.birthDate,
            numerology: { fate: 7, name: 5, surname: 3, patronymic: 1 }
        };

        const person2 = data.person2 || {
            fullName: 'Петрова Анна Сергеевна',
            birthDate: '15.11.1995',
            numerology: { fate: 3, name: 8, surname: 4, patronymic: 6 }
        };

        const interpretation = data.interpretation || this.generateCompatibilityInterpretationText(compatibility, person1, person2);
        const deepPortrait = data.deepPortrait || this.generateCompatibilityDeepPortraitText(compatibility, person1, person2);

        return `
            <div class="result-card" style="background: transparent;">
                <div class="result-header">
                    <h2>💑 АНАЛИЗ СОВМЕСТИМОСТИ</h2>
                    <span class="result-badge compatibility">Совместимость</span>
                </div>
                
                <div class="result-person-info" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div class="person-detail" style="background: rgba(18, 18, 26, 0.5); padding: 15px; border-radius: 16px;">
                        <h4 style="color: var(--primary); margin: 0 0 10px 0;">${person1.fullName}</h4>
                        <div class="label">Число судьбы: <strong style="color: var(--primary);">${person1.numerology.fate}</strong></div>
                        <div class="label">Число имени: ${person1.numerology.name}</div>
                        <div class="label">Дата рождения: ${person1.birthDate}</div>
                    </div>
                    <div class="person-detail" style="background: rgba(18, 18, 26, 0.5); padding: 15px; border-radius: 16px;">
                        <h4 style="color: var(--primary); margin: 0 0 10px 0;">${person2.fullName}</h4>
                        <div class="label">Число судьбы: <strong style="color: var(--primary);">${person2.numerology.fate}</strong></div>
                        <div class="label">Число имени: ${person2.numerology.name}</div>
                        <div class="label">Дата рождения: ${person2.birthDate}</div>
                    </div>
                </div>
                
                <div class="compatibility-score" style="text-align: center; margin: 30px 0;">
                    <div style="font-size: 3rem; font-weight: bold; color: var(--primary);">${compatibility.score}%</div>
                    <div style="font-size: 1.2rem; color: var(--text-primary);">${compatibility.level}</div>
                    <div class="compatibility-bar" style="width: 80%; margin: 15px auto; height: 10px; background: rgba(255,255,255,0.2); border-radius: 5px;">
                        <div class="compatibility-progress" style="width: ${compatibility.score}%; height: 100%; background: var(--primary); border-radius: 5px;"></div>
                    </div>
                </div>
                
                <div class="strengths-section" style="margin: 20px 0; padding: 20px; background: rgba(76, 175, 80, 0.1); border-radius: 16px;">
                    <h4 style="color: #4caf50;">🌟 Сильные стороны союза</h4>
                    ${compatibility.strengths.map(s => `<p style="color: var(--text-primary);">${s}</p>`).join('')}
                </div>
                
                <div class="challenges-section" style="margin: 20px 0; padding: 20px; background: rgba(244, 67, 54, 0.1); border-radius: 16px;">
                    <h4 style="color: #f44336;">🌙 Зоны роста</h4>
                    ${compatibility.challenges.map(c => `<p style="color: var(--text-primary);">${c}</p>`).join('')}
                </div>
                
                <div class="advice-section" style="margin: 20px 0; padding: 20px; background: rgba(201, 165, 75, 0.1); border-radius: 16px;">
                    <h4 style="color: var(--primary);">💫 Совет по совместимости</h4>
                    <p style="color: var(--text-primary);">${compatibility.advice}</p>
                </div>
            </div>
            
            <div class="full-interpretation">
                <h3><i class="fas fa-scroll"></i> СВИТОК СУДЬБЫ</h3>
                <div class="interpretation-text">
                    <p>${interpretation.replace(/\n/g, '<br>')}</p>
                </div>
            </div>
            
            <div class="deep-portrait">
                <h3><i class="fas fa-moon"></i> ГЛУБИННЫЙ ПОРТРЕТ</h3>
                <div class="portrait-text">
                    <p>${deepPortrait.replace(/\n/g, '<br>')}</p>
                </div>
            </div>
        `;
    }

    // ========== ТЕКСТОВЫЕ ИНТЕРПРЕТАЦИИ ==========

    generateBasicInterpretationText(base, achilles, control, calls) {
        return `
🔮 **КОСМОГРАММА ЛИЧНОСТИ**

Ваше число судьбы ${base.fate} указывает на глубинный аналитический ум и склонность к познанию. Вы прирожденный исследователь, ищущий истину во всем.

Число имени ${base.name} говорит о вашей подвижности, любознательности и жажде свободы. Вы легко адаптируетесь к любым изменениям.

Число рода ${base.surname} наделяет вас творческой жилкой и умением радоваться жизни.

Число предков ${base.patronymic} дает вам лидерские качества и способность начинать новое.

Ваша ахиллесова пята (число ${achilles.number}) — ${achilles.description}

Число управления (${control.number}) — ${control.description}

Социальные оклики:
- В кругу семьи: ${calls.descriptions?.close || 'надежный партнер'}
- В коллективе: ${calls.descriptions?.social || 'целеустремленный победитель'}
- С незнакомцами: ${calls.descriptions?.world || 'мудрый наблюдатель'}
        `;
    }

    generateBasicDeepPortraitText(base, achilles, control, calls) {
        return `
🌌 **ГЛУБИННЫЙ ПСИХОЛОГИЧЕСКИЙ ПОРТРЕТ**

Вы — уникальная комбинация семерки-исследователя и пятерки-путешественника. Вас тянет к познанию неизведанного, но при этом вы не замыкаетесь в себе — вы ищете контакты с миром. Ваша личность сочетает глубину мысли и легкость общения.

Ваш психологический тип — "Мыслитель-Исследователь". Вы постоянно находитесь в поиске новых знаний и впечатлений. Это делает вас интересным собеседником, но иногда мешает сосредоточиться на одном деле.

В отношениях вы ищете партнера, который разделит вашу жажду познания и приключений. Вам нужен не просто спутник жизни, а соратник, с которым можно путешествовать по миру и по жизни.
        `;
    }

    generateFullInterpretationText(base, zodiac, interpretations) {
        return `
🔮 **ПОЛНЫЙ НУМЕРОЛОГИЧЕСКИЙ ОТЧЕТ**

Ваше число судьбы ${base.fate} указывает на глубинный аналитический ум и склонность к познанию. Вы прирожденный исследователь, ищущий истину во всем.

Ваш знак зодиака — ${zodiac.name}. Это усиливает вашу эмоциональную глубину и интуицию. Вы чувствуете людей на уровне подсознания.

${interpretations.career ? `💼 **КАРЬЕРА**: ${interpretations.career.description}` : ''}

${interpretations.love ? `❤️ **ЛЮБОВЬ**: ${interpretations.love.description}` : ''}

Вы способны на многое, главное — не бояться проявлять себя и доверять своей интуиции.
        `;
    }

    generateFullDeepPortraitText(base, interpretations) {
        return `
🌌 **ГЛУБИННЫЙ ПСИХОЛОГИЧЕСКИЙ ПОРТРЕТ**

Вы — уникальная комбинация семерки-исследователя и пятерки-путешественника. Вас тянет к познанию неизведанного, но при этом вы не замыкаетесь в себе — вы ищете контакты с миром.

Ваш психологический тип — "Мыслитель-Исследователь". Вы постоянно находитесь в поиске новых знаний и впечатлений.

В отношениях вы ищете партнера, который разделит вашу жажду познания и приключений. Вам нужен не просто спутник жизни, а соратник.
        `;
    }

    generateDayInterpretationText(forecast, numbers, universal, targetDate) {
        return `
📜 **СВИТОК СУДЬБЫ НА ${targetDate}**

🌟 **ДЛЯ ИВАНОВА ИВАНА ИВАНОВИЧА**

🔢 **ЧИСЛО ДНЯ: ${numbers.universal}**

${universal.name} — ${universal.positive}

${universal.negative ? `⚠️ ${universal.negative}` : ''}

💼 **КАРЬЕРА И ДЕЛА**
${universal.career}

❤️ **ЛЮБОВЬ И ОТНОШЕНИЯ**
${universal.love}

🌿 **ЗДОРОВЬЕ И ЭНЕРГИЯ**
${universal.health}

💰 **ФИНАНСЫ**
${universal.finance}

💫 **СОВЕТ НА ДЕНЬ**
Действуйте решительно, но не забывайте о людях. Ваш успех — это не только ваша заслуга, но и поддержка тех, кто рядом.
        `;
    }

    generateDayDeepPortraitText(forecast, numbers, universal, tarot, targetDate) {
        const firstName = 'Иван';
        return `
🌌 **ГЛУБИННЫЙ ПОРТРЕТ ДНЯ ${targetDate}**

**ДЛЯ: ${this.userName}**

🌟 **ВАША УНИКАЛЬНАЯ ЭНЕРГЕТИКА НА ЭТОТ ДЕНЬ**
${universal.element}, ${universal.planet}

🔮 **АРХЕТИП ДНЯ**
Этот день активирует в вас архетип ${universal.name === 'Восьмерка' ? 'Магната' : universal.name === 'Единица' ? 'Лидера' : 'Искателя'}.

🎴 **АРХЕТИПИЧЕСКОЕ ПОСЛАНИЕ**
Карта Таро дня — **${tarot.name}** — призывает вас: "${tarot.advice.toLowerCase()}"
Для вас, ${firstName}, это означает, что сегодня особенно важно доверять своей интуиции.

Помните: каждый день уникален. Проживите его осознанно, и вы увидите, как синхронизируетесь с ритмами вселенной.
        `;
    }

    generateWeekInterpretationText(forecast, weekRange, weekAnalysis, lifeAreas, dailyBreakdown, personNumbers) {
        const firstName = 'Иван';
        const weekStart = weekRange.start;
        const weekEnd = weekRange.end;
        const weekNumber = forecast.weekNumber || 2;

        let dailyBreakdownText = '';
        dailyBreakdown.forEach(day => {
            const todayMarker = day.isToday ? ' (СЕГОДНЯ)' : '';
            dailyBreakdownText += `
${day.dayName}${todayMarker} (${day.date})
• Число дня: ${day.universalNumber} (личное: ${day.personalNumber})
• Энергия: ${day.energy}
• Фокус: ${day.focus}
• Совет: ${day.advice}
• Цвет: ${day.color}
• Камень: ${day.crystal}
• Благоприятные часы: ${day.favorableHours ? day.favorableHours.join(', ') : ''}
`;
        });

        const favorableDaysList = dailyBreakdown.filter(day => [1, 3, 6, 8, 11, 22].includes(day.universalNumber));
        const favorableDaysText = favorableDaysList.map(day => `• ${day.dayName} (${day.date}) — число ${day.universalNumber}`).join('\n');

        return `
📜 **СВИТОК СУДЬБЫ НА НЕДЕЛЮ**
🗓️ **${weekStart} — ${weekEnd}**

🌟 **ДЛЯ ${this.userName.toUpperCase()}**

🔢 **ЧИСЛО НЕДЕЛИ: ${weekNumber}**
${weekAnalysis.theme}

📊 **ОБЩИЙ ПРОГНОЗ**
${weekAnalysis.description}

💫 **ПЕРСОНАЛЬНАЯ НОТА**
${weekAnalysis.personalNote}

${weekAnalysis.advice}

🌅 **ПРОГНОЗ ПО СФЕРАМ ЖИЗНИ**
${lifeAreas.career}
${lifeAreas.love}
${lifeAreas.health}
${lifeAreas.finance}

📅 **КЛЮЧЕВЫЕ ВОЗМОЖНОСТИ НЕДЕЛИ**
${weekAnalysis.opportunities.map(o => `• ${o}`).join('\n')}

⚠️ **НА ЧТО ОБРАТИТЬ ВНИМАНИЕ**
${weekAnalysis.challenges.map(c => `• ${c}`).join('\n')}

🗓️ **ДНЕВНАЯ РАЗБИВКА**
${dailyBreakdownText}

🌟 **НАИБОЛЕЕ БЛАГОПРИЯТНЫЕ ДНИ**
${favorableDaysText || 'Нет данных'}

💫 **СОВЕТ НА НЕДЕЛЮ**
${weekAnalysis.advice}

🔮 **ИНТУИТИВНОЕ ПОСЛАНИЕ**
На этой неделе ваша задача — интегрировать энергию числа ${weekNumber} в свою жизнь. 
Учитывая ваши личные числа (${personNumbers.fate}-${personNumbers.name}-${personNumbers.surname}-${personNumbers.patronymic}), 
наиболее гармонично это проявится в сферах, где вы можете использовать свои сильные стороны.
        `;
    }

    generateWeekDeepPortraitText(forecast, weekRange, weekAnalysis, dailyBreakdown, personNumbers, tarot) {
        const firstName = 'Иван';
        const weekStart = weekRange.start;
        const weekEnd = weekRange.end;
        const weekNumber = forecast.weekNumber || 2;
        const weekEnergy = forecast.weekEnergy || '🔵 Неделя гармонии и сотрудничества';

        const maxEnergyDay = dailyBreakdown.reduce((max, day) =>
            (day.universalNumber === 8 || day.universalNumber === 1) ? day : max, dailyBreakdown[0] || {});

        const restDay = dailyBreakdown.find(day => day.universalNumber === 7) || dailyBreakdown[6] || {};

        const archetypes = {
            1: 'Лидера', 2: 'Дипломата', 3: 'Творца', 4: 'Строителя',
            5: 'Исследователя', 6: 'Заботливого', 7: 'Мудреца', 8: 'Магната',
            9: 'Завершителя', 11: 'Проводника', 22: 'Архитектора реальности'
        };
        const archetype = archetypes[weekNumber] || 'Искателя';

        const archetypeDescriptions = {
            1: `${firstName}, проявлять инициативу и вести за собой других.`,
            2: `${firstName}, быть дипломатичным и создавать гармонию вокруг.`,
            3: `${firstName}, творить и выражать себя через творчество.`,
            4: `${firstName}, создавать структуры и наводить порядок.`,
            5: `${firstName}, исследовать новое и быть открытым переменам.`,
            6: `${firstName}, заботиться о близких и создавать уют.`,
            7: `${firstName}, углубляться в знания и искать мудрость.`,
            8: `${firstName}, достигать успеха и управлять ресурсами.`,
            9: `${firstName}, завершать циклы и отпускать прошлое.`,
            11: `${firstName}, слушать интуицию и вдохновлять других.`,
            22: `${firstName}, воплощать мечты в реальность и строить будущее.`
        };
        const archetypeDesc = archetypeDescriptions[weekNumber] || `${firstName}, следовать своей уникальной природе.`;

        return `
🌌 **ГЛУБИННЫЙ ПОРТРЕТ НЕДЕЛИ**
🗓️ **${weekStart} — ${weekEnd}**

**ДЛЯ: ${this.userName}**

🌟 **ВАША УНИКАЛЬНАЯ ЭНЕРГЕТИКА НА ЭТУ НЕДЕЛЮ**
${weekEnergy}

🔮 **АРХЕТИП НЕДЕЛИ**
Эта неделя активирует в вас архетип ${archetype}. 
Это значит, что вам предстоит ${archetypeDesc}

⚡ **ПИК ЭНЕРГИИ**
Наибольший энергетический подъем ожидает вас в **${maxEnergyDay.dayName || 'Вторник'} (${maxEnergyDay.date || ''})**. 
В этот день ваша продуктивность будет максимальной.

🕊️ **ДЛЯ ВОССТАНОВЛЕНИЯ**
${restDay.dayName || 'Воскресенье'} (${restDay.date || ''}) — лучший день для отдыха и восстановления.

🎴 **АРХЕТИПИЧЕСКОЕ ПОСЛАНИЕ**
Карта Таро недели — **${tarot.name}** — призывает вас: "${tarot.advice.toLowerCase()}"

💫 **ИНТЕГРАЛЬНЫЙ СОВЕТ**
${firstName}, на этой неделе ваша уникальная комбинация чисел (${personNumbers.fate}-${personNumbers.name}-${personNumbers.surname}-${personNumbers.patronymic}) 
создает особый паттерн возможностей. Главная тема недели: ${weekAnalysis.theme.toLowerCase()}.

Помните: неделя — это мини-жизненный цикл. Проживите его осознанно.
        `;
    }

    generateMonthInterpretationText(forecast, monthRange, monthAnalysis, lifeAreas, weeklyBreakdown, importantDates) {
        const monthName = monthRange.monthName;
        const year = monthRange.year;
        const monthNumber = forecast.monthNumber || 8;

        return `
📜 **СВИТОК СУДЬБЫ НА ${monthName} ${year}**
🗓️ **${monthRange.start} — ${monthRange.end}**

🌟 **ДЛЯ ${this.userName.toUpperCase()}**

🔢 **ЧИСЛО МЕСЯЦА: ${monthNumber}**
${monthAnalysis.theme}

📊 **ОБЩИЙ ПРОГНОЗ**
${monthAnalysis.description}

💫 **ПЕРСОНАЛЬНАЯ НОТА**
${monthAnalysis.personalNote}

${monthAnalysis.advice}

🌅 **ПРОГНОЗ ПО СФЕРАМ ЖИЗНИ**
${lifeAreas.career}
${lifeAreas.love}
${lifeAreas.health}
${lifeAreas.finance}

📊 **НЕДЕЛЬНАЯ РАЗБИВКА**
${weeklyBreakdown.map(w => `• Неделя ${w.weekNumber} (${w.startDate}-${w.endDate}): ${w.focus}`).join('\n')}

⭐ **ВАЖНЫЕ ДАТЫ МЕСЯЦА**
${importantDates.map(d => `• ${d.date} — число ${d.dayNumber}: ${d.reason}`).join('\n')}

💫 **СОВЕТ НА МЕСЯЦ**
${monthAnalysis.advice}
        `;
    }

    generateMonthDeepPortraitText(forecast, monthRange, monthAnalysis, weeklyBreakdown, tarot) {
        const monthName = monthRange.monthName;
        const year = monthRange.year;
        const monthNumber = forecast.monthNumber || 8;
        const monthEnergy = forecast.monthEnergy || '💰 Месяц успеха и изобилия';

        const maxEnergyWeek = weeklyBreakdown.reduce((max, w) =>
            (w.weekNumberValue === 8 || w.weekNumberValue === 1) ? w : max, weeklyBreakdown[0] || {});

        return `
🌌 **ГЛУБИННЫЙ ПОРТРЕТ ${monthName} ${year}**
🗓️ **${monthRange.start} — ${monthRange.end}**

**ДЛЯ: ${this.userName}**

🌟 **ВАША УНИКАЛЬНАЯ ЭНЕРГЕТИКА В ЭТОМ МЕСЯЦЕ**
${monthEnergy}

🔮 **АРХЕТИП МЕСЯЦА**
Этот месяц активирует в вас архетип ${monthNumber === 8 ? 'Магната' : monthNumber === 1 ? 'Лидера' : 'Искателя'}.

⚡ **ПИК ЭНЕРГИИ**
Наибольший энергетический подъем ожидает вас в **${maxEnergyWeek.weekNumber || 'третью'} неделю (${maxEnergyWeek.startDate || ''}—${maxEnergyWeek.endDate || ''})**.

🎴 **АРХЕТИПИЧЕСКОЕ ПОСЛАНИЕ**
Карта Таро месяца — **${tarot.name}** — призывает вас: "${tarot.advice.toLowerCase()}"

💫 **ИНТЕГРАЛЬНЫЙ СОВЕТ**
Главная тема месяца: ${monthAnalysis.theme.toLowerCase()}.

Помните: месяц — это важный цикл в вашей жизни. Проживите его осознанно.
        `;
    }

    generateYearInterpretationText(forecast, yearInfo, yearAnalysis, quarterlyBreakdown, monthlyHighlights, importantDates) {
        const year = yearInfo.year;
        const yearNumber = forecast.yearNumber || 3;

        return `
📜 **СВИТОК СУДЬБЫ НА ${year} ГОД**

🌟 **ДЛЯ ${this.userName.toUpperCase()}**

🔢 **ЧИСЛО ГОДА: ${yearNumber}**
${yearAnalysis.theme}

🌍 **УНИВЕРСАЛЬНОЕ ЧИСЛО ГОДА: ${yearInfo.universalYearNumber}**

📊 **ОБЩИЙ ПРОГНОЗ**
${yearAnalysis.description}

💫 **ПЕРСОНАЛЬНАЯ НОТА**
${yearAnalysis.personalNote}

💡 **ГЛАВНЫЙ СОВЕТ НА ГОД**
${yearAnalysis.advice}

🗓️ **КВАРТАЛЬНАЯ РАЗБИВКА**
${quarterlyBreakdown.map(q => `• ${q.season}: ${q.focus}`).join('\n')}

📅 **КЛЮЧЕВЫЕ МЕСЯЦЫ**
${monthlyHighlights.map(m => `• ${m.monthName}: ${m.reason}`).join('\n')}

⭐ **ВАЖНЫЕ ДАТЫ ГОДА**
${importantDates.map(d => `• ${d.date} — ${d.name}: ${d.reason}`).join('\n')}

💫 **ГЛАВНЫЙ СОВЕТ НА ГОД**
${yearAnalysis.advice}
        `;
    }

    generateYearDeepPortraitText(forecast, yearInfo, yearCycle, yearAnalysis, quarterlyBreakdown, tarot) {
        const year = yearInfo.year;
        const yearNumber = forecast.yearNumber || 3;
        const yearEnergy = forecast.yearEnergy || '🟡 Творческий год';

        return `
🌌 **ГЛУБИННЫЙ ПОРТРЕТ ${year} ГОДА**

**ДЛЯ: ${this.userName}**

🌟 **ВАША УНИКАЛЬНАЯ ЭНЕРГЕТИКА В ЭТОМ ГОДУ**
${yearEnergy}

🔄 **9-ЛЕТНИЙ ЦИКЛ**
${yearCycle.name}: ${yearCycle.description}
Энергия цикла: ${yearCycle.energy}

🔮 **АРХЕТИП ГОДА**
Этот год активирует в вас архетип ${yearNumber === 3 ? 'Творца' : yearNumber === 1 ? 'Лидера' : 'Искателя'}.

🎴 **АРХЕТИПИЧЕСКОЕ ПОСЛАНИЕ**
Карта Таро года — **${tarot.name}** — призывает вас: "${tarot.advice.toLowerCase()}"

⚡ **ГЛАВНЫЙ ВЫЗОВ ГОДА**
Не распыляться на множество проектов, найти фокус.

✨ **ГЛАВНАЯ ВОЗМОЖНОСТЬ ГОДА**
Раскрыть свой творческий потенциал.

💫 **ИНТЕГРАЛЬНЫЙ СОВЕТ**
Главная тема года: ${yearAnalysis.theme.toLowerCase()}.

Помните: год — это важный этап вашего жизненного пути.
        `;
    }

    generateCompatibilityInterpretationText(compatibility, person1, person2) {
        return `
💑 **АНАЛИЗ СОВМЕСТИМОСТИ**

✨ **ОБЩИЙ УРОВЕНЬ СОВМЕСТИМОСТИ: ${compatibility.score}%**
${compatibility.level}

🔢 **АНАЛИЗ ПО ЧИСЛАМ**

${person1.fullName} (Число судьбы ${person1.numerology.fate}): Глубокий аналитик, ищущий истину. Ценит уединение и интеллектуальную близость.

${person2.fullName} (Число судьбы ${person2.numerology.fate}): Творческая, оптимистичная, общительная. Приносит в отношения радость и легкость.

Ваши числа судьбы (${person1.numerology.fate} и ${person2.numerology.fate}) создают уникальную динамику.

❤️ **СИЛЬНЫЕ СТОРОНЫ СОЮЗА**
${compatibility.strengths.map(s => s).join('\n')}

🌙 **ЗОНЫ РОСТА**
${compatibility.challenges.map(c => c).join('\n')}

💫 **СОВЕТ ПО СОВМЕСТИМОСТИ**
${compatibility.advice}
        `;
    }

    generateCompatibilityDeepPortraitText(compatibility, person1, person2) {
        return `
🌌 **ГЛУБИННЫЙ АНАЛИЗ ОТНОШЕНИЙ**

**ДЛЯ ПАРЫ: Иван и Анна**

🔮 **ЭНЕРГЕТИЧЕСКАЯ СОВМЕСТИМОСТЬ**

Ваши энергии создают уникальный баланс. Иван (число ${person1.numerology.fate}) — глубокий, аналитичный, ищущий смыслы. Анна (число ${person2.numerology.fate}) — легкая, творческая, приносящая радость. Вместе вы создаете то, чего не хватает каждому по отдельности.

💖 **КАРМИЧЕСКАЯ СВЯЗЬ**

Ваша встреча не случайна. Кармические числа (${person1.numerology.fate} и ${person2.numerology.fate}) указывают на то, что вы пришли в этот мир, чтобы научить друг друга чему-то важному.

🌟 **ПОТЕНЦИАЛ РАЗВИТИЯ**

Ваш союз имеет потенциал стать не просто отношениями, а настоящим партнерством, где каждый раскрывает лучшие качества другого.

💫 **СОВЕТ НА БУДУЩЕЕ**
Учитесь принимать различия как дар, а не как проблему. Ваша разность — это не недостаток, а возможность стать более полными, целостными людьми.
        `;
    }
}

// Создаем глобальный экземпляр
window.previewRenderer = new PreviewRenderer();