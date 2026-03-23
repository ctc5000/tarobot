// modules/Numerology/web/js/modules/forecastRenderer.js

(function() {
    window.ForecastRenderer = {
        getColorCode: function(colorName) {
            const colorMap = {
                'Красный': '#ff4444', 'Золотой': '#ffd700', 'Оранжевый': '#ffa500',
                'Голубой': '#00bfff', 'Серебряный': '#c0c0c0', 'Белый': '#ffffff',
                'Желтый': '#ffff00', 'Зеленый': '#4caf50', 'Бирюзовый': '#40e0d0',
                'Фиолетовый': '#9c27b0', 'Синий': '#2196f3', 'Розовый': '#ff69b4',
                'Коричневый': '#8b4513', 'Бежевый': '#f5f5dc', 'Пурпурный': '#800080'
            };
            return colorMap[colorName] || '#c9a54b';
        },

        getDirections: function(number) {
            const directions = {
                1: ['Север', 'Восток'], 2: ['Юго-Запад', 'Запад'], 3: ['Восток', 'Юго-Восток'],
                4: ['Север', 'Северо-Восток'], 5: ['Запад', 'Северо-Запад'], 6: ['Юг', 'Юго-Запад'],
                7: ['Северо-Восток', 'Восток'], 8: ['Юго-Запад', 'Запад'], 9: ['Юг', 'Юго-Восток'],
                11: ['Север', 'Восток'], 22: ['Центр', 'Все направления']
            };
            return directions[number] || ['Восток', 'Север'];
        },

        renderDayForecast: function(forecast) {
            const numbers = forecast.numbers || {};
            const desc = forecast.description || {};
            const universal = desc.universal || {};
            const personal = desc.personal || {};
            const expression = desc.expression || {};
            const dateInfo = desc.dateInfo || {};

            let formattedDate = forecast.targetDate || '';
            if (formattedDate && formattedDate.includes('-')) {
                const [year, month, day] = formattedDate.split('-');
                formattedDate = `${day}.${month}.${year}`;
            }

            let html = `
            <div class="forecast-card">
                <div class="forecast-header">
                    <div class="forecast-number-large">${numbers.universal || '?'}</div>
                    <div class="forecast-title">
                        <h3>${universal.name || 'Прогноз на день'}</h3>
                        <p>${dateInfo.dayOfWeek || ''}, ${formattedDate || ''}</p>
                    </div>
                </div>
                <div class="forecast-cosmic-code">
                    <h4><i class="fas fa-star"></i> КОСМИЧЕСКИЙ КОД ДНЯ</h4>
                    <div class="code-grid">
                        <div class="code-item">
                            <span class="label">Универсальное число</span>
                            <span class="value">${numbers.universal || '?'}</span>
                            <span class="desc">${universal.keywords ? universal.keywords.join(', ') : ''}</span>
                        </div>
                        <div class="code-item">
                            <span class="label">Личное число</span>
                            <span class="value">${numbers.personal || '?'}</span>
                            <span class="desc">${personal.influence || ''}</span>
                        </div>
                        <div class="code-item">
                            <span class="label">Число выражения</span>
                            <span class="value">${numbers.expression || '?'}</span>
                            <span class="desc">${expression.meaning || ''}</span>
                        </div>
                    </div>
                </div>
                <div class="forecast-energy">
                    <div class="energy-badge">
                        <span><i class="fas fa-fire"></i> Стихия: ${universal.element || ''}</span>
                        <span><i class="fas fa-globe"></i> Планета: ${universal.planet || ''}</span>
                        <span><i class="fas fa-moon"></i> Лунный день: ${dateInfo.lunarDay || ''}</span>
                    </div>
                </div>
                <div class="forecast-main">
                    <p class="forecast-positive">${universal.positive || ''}</p>
                    ${universal.negative ? `<p class="forecast-negative">⚠️ ${universal.negative}</p>` : ''}
                </div>
                <div class="forecast-sections">
                    <div class="forecast-section"><h4><i class="fas fa-briefcase"></i> Карьера</h4><p>${universal.career || ''}</p></div>
                    <div class="forecast-section"><h4><i class="fas fa-heart"></i> Любовь</h4><p>${universal.love || ''}</p></div>
                    <div class="forecast-section"><h4><i class="fas fa-leaf"></i> Здоровье</h4><p>${universal.health || ''}</p></div>
                    <div class="forecast-section"><h4><i class="fas fa-coins"></i> Финансы</h4><p>${universal.finance || ''}</p></div>
                </div>`;

            if (forecast.tarot) {
                html += `
                <div class="forecast-tarot">
                    <h4><i class="fas fa-crown"></i> КАРТА ТАРО ДНЯ: ${forecast.tarot.name || ''}</h4>
                    <div class="tarot-mini">
                        <div class="tarot-image-mini">
                            <img src="${forecast.tarot.image || '/images/tarot/back.jpg'}" alt="${forecast.tarot.name || 'Таро'}" onerror="this.src='/images/tarot/back.jpg'">
                        </div>
                        <div class="tarot-desc-mini">
                            <p>${forecast.tarot.description || ''}</p>
                            <p class="tarot-advice"><strong>Совет:</strong> ${forecast.tarot.advice || ''}</p>
                        </div>
                    </div>
                </div>`;
            }

            html += `<div class="forecast-details-grid">`;
            const colors = forecast.fengShui?.colors || forecast.colors || [];
            if (colors.length) {
                html += `<div class="detail-block"><h5><i class="fas fa-paint-brush"></i> Цвета дня</h5><p>${colors.join(', ')}</p></div>`;
            }
            if (forecast.crystals) {
                html += `<div class="detail-block"><h5><i class="fas fa-gem"></i> Камни-талисманы</h5><p>${forecast.crystals.join(', ')}</p></div>`;
            }
            if (forecast.scents) {
                html += `<div class="detail-block"><h5><i class="fas fa-leaf"></i> Ароматы</h5><p>${forecast.scents.join(', ')}</p></div>`;
            }
            const directions = this.getDirections(numbers.universal);
            if (directions) {
                html += `<div class="detail-block"><h5><i class="fas fa-compass"></i> Направления</h5><p>${directions.join(', ')}</p></div>`;
            }
            if (forecast.favorableHours) {
                html += `<div class="detail-block"><h5><i class="fas fa-clock"></i> Благоприятные часы</h5><p>${forecast.favorableHours.join(', ')}</p></div>`;
            }
            html += `</div>`;

            if (forecast.fengShui?.advice) {
                html += `<div class="forecast-fengshui"><h4><i class="fas fa-wind"></i> Фен-шуй совет</h4><p>${forecast.fengShui.advice}</p></div>`;
            }
            if (forecast.affirmation) {
                html += `<div class="forecast-affirmation"><i class="fas fa-quote-left"></i><p>${forecast.affirmation}</p></div>`;
            }
            html += `</div>`;
            return html;
        },

        renderWeekForecast: function(forecast) {
            // Простой возврат для начала
            return '<div class="forecast-card week-forecast">Недельный прогноз (в разработке)</div>';
        },

        renderMonthForecast: function(forecast) {
            return '<div class="forecast-card month-forecast">Месячный прогноз (в разработке)</div>';
        },

        renderYearForecast: function(forecast) {
            return '<div class="forecast-card year-forecast">Годовой прогноз (в разработке)</div>';
        },

        renderZodiac: function(zodiac) {
            return `
            <div class="zodiac-card">
                <div class="zodiac-header" style="display: flex; align-items: center; gap: 20px; margin-bottom: 20px;">
                    <div style="font-size: 3rem;">${this.getZodiacSymbol(zodiac.name)}</div>
                    <div>
                        <h3 style="margin: 0 0 5px 0; color: var(--accent-gold);">${zodiac.name || 'Знак зодиака'}</h3>
                        <p style="margin: 0; color: var(--text-secondary);">${zodiac.element || ''}</p>
                    </div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                    <div><strong style="color: var(--accent-gold);">Качество:</strong> <span style="color: var(--text-secondary);">${zodiac.quality || '—'}</span></div>
                    <div><strong style="color: var(--accent-gold);">Планета:</strong> <span style="color: var(--text-secondary);">${zodiac.planet || '—'}</span></div>
                </div>
                <div style="margin-bottom: 20px;"><p style="color: var(--text-secondary); line-height: 1.8;">${zodiac.description || ''}</p></div>
                <div style="background: rgba(201, 165, 75, 0.05); padding: 15px; border-radius: 12px; margin-bottom: 15px;">
                    <h4 style="color: var(--accent-gold); margin: 0 0 10px 0;">🌟 Сильные стороны</h4>
                    <p style="color: var(--text-secondary); margin: 0;">${zodiac.strengths || ''}</p>
                </div>
                <div style="background: rgba(201, 165, 75, 0.05); padding: 15px; border-radius: 12px; margin-bottom: 15px;">
                    <h4 style="color: var(--accent-gold); margin: 0 0 10px 0;">🌙 Зоны роста</h4>
                    <p style="color: var(--text-secondary); margin: 0;">${zodiac.weaknesses || ''}</p>
                </div>
                <div style="background: rgba(201, 165, 75, 0.1); padding: 20px; border-radius: 12px; border-left: 3px solid var(--accent-gold);">
                    <h4 style="color: var(--accent-gold); margin: 0 0 10px 0;">🎯 Жизненная миссия</h4>
                    <p style="color: var(--text-primary); font-style: italic; margin: 0;">${zodiac.lifeMission || ''}</p>
                </div>
            </div>`;
        },

        getZodiacSymbol: function(signName) {
            const symbols = {
                'Овен': '♈', 'Телец': '♉', 'Близнецы': '♊', 'Рак': '♋',
                'Лев': '♌', 'Дева': '♍', 'Весы': '♎', 'Скорпион': '♏',
                'Стрелец': '♐', 'Козерог': '♑', 'Водолей': '♒', 'Рыбы': '♓'
            };
            return symbols[signName] || '⛤';
        },

        renderFengShui: function(fengShui) {
            return `
            <div class="fengshui-card">
                <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 20px;">
                    <div style="font-size: 3rem;">${this.getElementSymbol(fengShui.element)}</div>
                    <div><h3 style="margin: 0 0 5px 0; color: var(--accent-gold);">${fengShui.element || 'Элемент'}</h3></div>
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px; background: rgba(18, 18, 26, 0.5); padding: 15px; border-radius: 12px;">
                    <div><strong style="color: var(--accent-gold);">Цвет силы:</strong> <span style="color: var(--text-secondary);">${fengShui.color || '—'}</span></div>
                    <div><strong style="color: var(--accent-gold);">Направление:</strong> <span style="color: var(--text-secondary);">${fengShui.direction || '—'}</span></div>
                    <div><strong style="color: var(--accent-gold);">Время активации:</strong> <span style="color: var(--text-secondary);">${fengShui.season || '—'}</span></div>
                </div>
                <div style="margin-bottom: 20px;"><p style="color: var(--text-secondary); line-height: 1.8;">${fengShui.description || ''}</p></div>
                <div style="background: rgba(201, 165, 75, 0.05); padding: 20px; border-radius: 12px; margin-bottom: 15px;">
                    <h4 style="color: var(--accent-gold); margin: 0 0 10px 0;">✨ Активация энергии</h4>
                    <p style="color: var(--text-secondary); margin: 0;">${fengShui.activation || ''}</p>
                </div>
                <div style="background: linear-gradient(135deg, rgba(201, 165, 75, 0.1), rgba(18, 18, 26, 0.5)); padding: 20px; border-radius: 12px;">
                    <h4 style="color: var(--accent-gold); margin: 0 0 10px 0;">🕯️ Аффирмация</h4>
                    <p style="color: var(--text-primary); font-style: italic; font-size: 1.1rem; margin: 0;">"${fengShui.affirmation || 'Я в гармонии с потоками вселенной'}"</p>
                </div>
            </div>`;
        },

        getElementSymbol: function(element) {
            const elementLower = String(element || '').toLowerCase();
            const symbols = {
                'металл': '⚜️', 'metal': '⚜️', 'вода': '🌊', 'water': '🌊',
                'дерево': '🌳', 'wood': '🌳', 'огонь': '🔥', 'fire': '🔥',
                'земля': '⛰️', 'earth': '⛰️'
            };
            return symbols[elementLower] || '✨';
        },

        renderTarotCards: function(tarot) {
            const cards = [
                {type: 'fate', title: 'Карта Судьбы', data: tarot.fate},
                {type: 'personality', title: 'Карта Личности', data: tarot.personality},
                {type: 'control', title: 'Карта Пути', data: tarot.control}
            ];
            let html = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">';
            cards.forEach(card => {
                html += `
                <div style="background: rgba(18, 18, 26, 0.5); border: 1px solid var(--border-color); border-radius: 16px; overflow: hidden;">
                    <div style="position: relative; padding-top: 150%; background: linear-gradient(135deg, var(--bg-card), var(--bg-dark));">
                        <img src="${card.data?.image || '/images/tarot/back.jpg'}" 
                             alt="${card.data?.name || 'Карта Таро'}"
                             style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain;"
                             onerror="this.src='/images/tarot/back.jpg'">
                        <div style="position: absolute; top: 10px; right: 10px; width: 40px; height: 40px; background: var(--gradient-gold); color: var(--bg-dark); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1.2rem;">
                            ${card.data?.number === 0 ? 22 : card.data?.number || '?'}
                        </div>
                    </div>
                    <div style="padding: 20px;">
                        <h4 style="color: var(--accent-gold); margin: 0 0 5px 0;">${card.title}</h4>
                        <h5 style="color: var(--text-primary); margin: 0 0 10px 0;">${card.data?.name || '—'}</h5>
                        <p style="color: var(--text-muted); font-style: italic; margin-bottom: 10px;">${card.data?.keywords || ''}</p>
                        <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 15px;">${card.data?.description || ''}</p>
                        <div style="background: rgba(201, 165, 75, 0.05); padding: 15px; border-radius: 12px; border-left: 3px solid var(--accent-gold);">
                            <p style="color: var(--accent-gold); margin: 0; font-style: italic;">${card.data?.advice || ''}</p>
                        </div>
                    </div>
                </div>`;
            });
            html += '</div>';
            return html;
        },

        renderPsychology: function(psychology) {
            let html = '<div style="display: flex; flex-direction: column; gap: 25px;">';
            if (psychology.modality) {
                html += `
                <div style="background: rgba(18, 18, 26, 0.5); border: 1px solid var(--border-color); border-radius: 16px; padding: 20px;">
                    <h3 style="color: var(--accent-gold); margin: 0 0 15px 0;">🧠 НЛП-ПРОФИЛЬ</h3>
                    <h4 style="color: var(--text-primary); margin: 0 0 10px 0;">${psychology.modality.title || ''}</h4>
                    <p style="color: var(--text-secondary); line-height: 1.8; margin-bottom: 15px;">${psychology.modality.description || ''}</p>
                    <div style="background: rgba(201, 165, 75, 0.05); padding: 15px; border-radius: 12px;">
                        <p><strong style="color: var(--accent-gold);">🎯 Предикаты:</strong> <span style="color: var(--text-secondary);">${psychology.modality.predicates?.join(', ') || ''}</span></p>
                        <p><strong style="color: var(--accent-gold);">🔑 Ключи доступа:</strong> <span style="color: var(--text-secondary);">${psychology.modality.accessKeys || ''}</span></p>
                    </div>
                </div>`;
            }
            if (psychology.archetype) {
                html += `
                <div style="background: rgba(18, 18, 26, 0.5); border: 1px solid var(--border-color); border-radius: 16px; padding: 20px;">
                    <h3 style="color: var(--accent-gold); margin: 0 0 15px 0;">🏛️ АРХЕТИП ЛИЧНОСТИ</h3>
                    <h4 style="color: var(--text-primary); margin: 0 0 10px 0;">${psychology.archetype.name || ''}</h4>
                    <p style="color: var(--text-secondary); line-height: 1.8; margin-bottom: 15px;">${psychology.archetype.description || ''}</p>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                        <div style="background: rgba(76, 175, 80, 0.1); padding: 15px; border-radius: 12px;">
                            <strong style="color: #4caf50; display: block; margin-bottom: 5px;">🎁 Дар</strong>
                            <span style="color: var(--text-secondary);">${psychology.archetype.gift || ''}</span>
                        </div>
                        <div style="background: rgba(244, 67, 54, 0.1); padding: 15px; border-radius: 12px;">
                            <strong style="color: #f44336; display: block; margin-bottom: 5px;">⚔️ Вызов</strong>
                            <span style="color: var(--text-secondary);">${psychology.archetype.challenge || ''}</span>
                        </div>
                    </div>
                    <div style="background: linear-gradient(135deg, rgba(201, 165, 75, 0.1), rgba(18, 18, 26, 0.5)); padding: 20px; border-radius: 12px;">
                        <p style="color: var(--accent-gold); font-size: 1.1rem; font-style: italic; margin: 0;">"${psychology.archetype.mantra || ''}"</p>
                    </div>
                </div>`;
            }
            if (psychology.attachment) {
                html += `
                <div style="background: rgba(18, 18, 26, 0.5); border: 1px solid var(--border-color); border-radius: 16px; padding: 20px;">
                    <h3 style="color: var(--accent-gold); margin: 0 0 15px 0;">🤝 ТИП ПРИВЯЗАННОСТИ</h3>
                    <h4 style="color: var(--text-primary); margin: 0 0 10px 0;">${psychology.attachment.name || ''}</h4>
                    <p style="color: var(--text-secondary); line-height: 1.8;">${psychology.attachment.description || ''}</p>
                </div>`;
            }
            html += '</div>';
            return html;
        },

        renderPatterns: function(patterns) {
            let html = '<div style="padding: 20px;">';
            if (patterns && patterns.length > 0) {
                html += '<div style="display: flex; flex-direction: column; gap: 15px;">';
                patterns.forEach(pattern => {
                    html += `<div style="background: rgba(201, 165, 75, 0.05); padding: 15px; border-radius: 12px; border-left: 3px solid var(--accent-gold);">
                        <p style="color: var(--text-secondary); margin: 0; line-height: 1.6;">✦ ${pattern}</p>
                    </div>`;
                });
                html += '</div>';
            } else {
                html += '<p style="color: var(--text-secondary); text-align: center;">Паттерны формируются...</p>';
            }
            html += '</div>';
            return html;
        }
    };
})();