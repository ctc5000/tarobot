// modules/Core/web/js/history.js

class HistoryApp {
    constructor() {
        this.currentPage = 1;
        this.limit = 10;
        this.totalPages = 1;
        this.totalCount = 0;
        this.filters = {
            type: 'all',
            dateFrom: '',
            dateTo: ''
        };
        this.currentCalculation = null;

        this.init();
    }

    async init() {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login';
            return;
        }

        await this.loadUserData();
        this.initEventListeners();
        await this.loadHistory();
    }

    async loadUserData() {
        const token = localStorage.getItem('token');

        try {
            const response = await fetch('/api/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                window.cabinetApp.user = data.data.user;
                window.cabinetApp.updateUI();
            } else if (response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }

    initEventListeners() {
        document.getElementById('filterType')?.addEventListener('change', () => this.applyFilters());
        document.getElementById('filterDateFrom')?.addEventListener('change', () => this.applyFilters());
        document.getElementById('filterDateTo')?.addEventListener('change', () => this.applyFilters());

        window.addEventListener('click', (e) => {
            const modal = document.getElementById('calculationModal');
            if (e.target === modal) {
                this.closeModal();
            }
        });
    }

    async loadHistory() {
        const list = document.getElementById('calculationsList');
        if (!list) return;

        list.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Загрузка...</div>';

        try {
            const params = new URLSearchParams({
                page: this.currentPage,
                limit: this.limit
            });

            if (this.filters.type && this.filters.type !== 'all') {
                params.append('type', this.filters.type);
            }
            if (this.filters.dateFrom) {
                params.append('dateFrom', this.filters.dateFrom);
            }
            if (this.filters.dateTo) {
                params.append('dateTo', this.filters.dateTo);
            }

            const response = await fetch(`/api/calculations?${params}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.renderCalculations(data.data);
            } else {
                list.innerHTML = '<div class="error-message">Ошибка загрузки данных</div>';
            }
        } catch (error) {
            console.error('Error loading history:', error);
            list.innerHTML = '<div class="error-message">Ошибка соединения</div>';
        }
    }

    renderCalculations(data) {
        const list = document.getElementById('calculationsList');
        const totalSpan = document.getElementById('totalCount');

        this.totalCount = data.total;
        this.totalPages = data.totalPages;

        if (totalSpan) totalSpan.textContent = data.total;

        if (!data.calculations || data.calculations.length === 0) {
            list.innerHTML = '<div class="empty-message"><i class="fas fa-history"></i><p>У вас пока нет расчетов</p></div>';
            this.renderPagination();
            return;
        }

        list.innerHTML = data.calculations.map(calc => `
            <div class="calculation-item" onclick="historyApp.viewCalculation('${calc.id}')">
                <div class="calc-icon">
                    ${this.getCalculationIcon(calc.calculationType)}
                </div>
                <div class="calc-info">
                    <div class="calc-name">${this.getCalculationName(calc)}</div>
                    <div class="calc-date">
                        <i class="fas fa-calendar-alt"></i> ${new Date(calc.createdAt).toLocaleString()}
                    </div>
                    ${calc.targetDate ? `
                        <div class="calc-target">
                            <i class="fas fa-clock"></i> На дату: ${this.formatDate(calc.targetDate)}
                        </div>
                    ` : ''}
                </div>
                <div class="calc-price">-${calc.price} ₽</div>
                <button class="btn-view" onclick="event.stopPropagation(); historyApp.viewCalculation('${calc.id}')">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
        `).join('');

        this.renderPagination();
    }

    getCalculationIcon(type) {
        const icons = {
            'basic': '🔮',
            'full': '⭐',
            'day': '📅',
            'week': '📆',
            'month': '📊',
            'year': '📈',
            'compatibility': '💑'
        };
        return icons[type] || '🔮';
    }

    getCalculationName(calc) {
        const names = {
            'basic': 'Базовый расчет',
            'full': 'Полный расчет',
            'day': 'Прогноз на день',
            'week': 'Прогноз на неделю',
            'month': 'Прогноз на месяц',
            'year': 'Прогноз на год',
            'compatibility': 'Совместимость'
        };

        if (calc.service) {
            return calc.service.name || names[calc.calculationType] || 'Расчет';
        }
        return names[calc.calculationType] || 'Расчет';
    }

    formatDate(dateStr) {
        if (!dateStr) return '';
        const [year, month, day] = dateStr.split('-');
        return `${day}.${month}.${year}`;
    }

    renderPagination() {
        const pagination = document.getElementById('pagination');
        if (!pagination) return;

        if (this.totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        let html = '<div class="pagination-controls">';

        html += `<button onclick="historyApp.goToPage(1)" ${this.currentPage === 1 ? 'disabled' : ''}>
            <i class="fas fa-angle-double-left"></i>
        </button>`;

        html += `<button onclick="historyApp.goToPage(${this.currentPage - 1})" ${this.currentPage === 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i>
        </button>`;

        html += `<span class="page-info">${this.currentPage} / ${this.totalPages}</span>`;

        html += `<button onclick="historyApp.goToPage(${this.currentPage + 1})" ${this.currentPage === this.totalPages ? 'disabled' : ''}>
            <i class="fas fa-chevron-right"></i>
        </button>`;

        html += `<button onclick="historyApp.goToPage(${this.totalPages})" ${this.currentPage === this.totalPages ? 'disabled' : ''}>
            <i class="fas fa-angle-double-right"></i>
        </button>`;

        html += '</div>';

        pagination.innerHTML = html;
    }

    goToPage(page) {
        if (page < 1 || page > this.totalPages) return;
        this.currentPage = page;
        this.loadHistory();
    }

    applyFilters() {
        this.filters.type = document.getElementById('filterType')?.value || 'all';
        this.filters.dateFrom = document.getElementById('filterDateFrom')?.value || '';
        this.filters.dateTo = document.getElementById('filterDateTo')?.value || '';
        this.currentPage = 1;
        this.loadHistory();
    }

    resetFilters() {
        document.getElementById('filterType').value = 'all';
        document.getElementById('filterDateFrom').value = '';
        document.getElementById('filterDateTo').value = '';
        this.filters = {
            type: 'all',
            dateFrom: '',
            dateTo: ''
        };
        this.currentPage = 1;
        this.loadHistory();
    }

    async viewCalculation(id) {
        try {
            const response = await fetch(`/api/calculations/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.currentCalculation = data.data;
                this.showFullCalculationModal(data.data);
            }
        } catch (error) {
            console.error('Error loading calculation:', error);
        }
    }

    showFullCalculationModal(calculation) {
        const modal = document.getElementById('calculationModal');
        const body = document.getElementById('modalBody');
        const result = calculation.result || {};

        document.getElementById('modalTitle').textContent = this.getCalculationName(calculation);

        // Определяем тип расчета
        const isFull = calculation.calculationType === 'full' || result.numerology?.interpretations;

        let html = `
            <div class="calculation-details">
                <div class="modal-report-header">
                    <div class="report-badge ${calculation.calculationType}">
                        ${this.getCalculationIcon(calculation.calculationType)} ${this.getCalculationName(calculation)}
                    </div>
                    ${isFull ? `
                        <button class="btn-download-pdf" onclick="historyApp.downloadPDF('${calculation.id}')">
                            <i class="fas fa-file-pdf"></i> Скачать PDF
                        </button>
                    ` : ''}
                </div>
                
                <div class="person-info-grid">
                    <div class="person-info-card">
                        <i class="fas fa-user"></i>
                        <div>
                            <span class="label">Ищущий</span>
                            <span class="value">${result.fullName || 'Не указано'}</span>
                        </div>
                    </div>
                    <div class="person-info-card">
                        <i class="fas fa-calendar-alt"></i>
                        <div>
                            <span class="label">Дата рождения</span>
                            <span class="value">${result.birthDate || this.formatDate(calculation.createdAt) || 'Не указана'}</span>
                        </div>
                    </div>
                    <div class="person-info-card">
                        <i class="fas fa-clock"></i>
                        <div>
                            <span class="label">Дата расчета</span>
                            <span class="value">${new Date(calculation.createdAt).toLocaleString()}</span>
                        </div>
                    </div>
                    ${calculation.targetDate ? `
                    <div class="person-info-card">
                        <i class="fas fa-calendar-check"></i>
                        <div>
                            <span class="label">Дата прогноза</span>
                            <span class="value">${this.formatDate(calculation.targetDate)}</span>
                        </div>
                    </div>
                    ` : ''}
                    <div class="person-info-card">
                        <i class="fas fa-coins"></i>
                        <div>
                            <span class="label">Стоимость</span>
                            <span class="value">${calculation.price} ₽</span>
                        </div>
                    </div>
                </div>
        `;

        // Для полного расчета показываем все данные
        if (isFull && result.numerology) {
            html += this.renderFullReport(result);
        } else {
            // Для других типов показываем базовую информацию
            html += this.renderBasicReport(result);
        }

        html += '</div>';

        body.innerHTML = html;
        modal.style.display = 'block';
    }

    renderFullReport(result) {
        const num = result.numerology;
        let html = '';

        // МАТРИЦА СУДЬБЫ
        html += `
            <div class="report-section">
                <h3 class="section-title">
                    <i class="fas fa-calculator"></i> МАТРИЦА СУДЬБЫ
                </h3>
                <div class="numbers-grid">
                    <div class="number-card">
                        <div class="number-large">${num.base?.fate || '?'}</div>
                        <div class="number-label">Судьба</div>
                    </div>
                    <div class="number-card">
                        <div class="number-large">${num.base?.name || '?'}</div>
                        <div class="number-label">Имя</div>
                    </div>
                    <div class="number-card">
                        <div class="number-large">${num.base?.surname || '?'}</div>
                        <div class="number-label">Род</div>
                    </div>
                    <div class="number-card">
                        <div class="number-large">${num.base?.patronymic || '?'}</div>
                        <div class="number-label">Предки</div>
                    </div>
                </div>
                
                <div class="special-numbers">
                    <div class="special-card">
                        <div class="special-value">${num.achilles?.number || '?'}</div>
                        <div class="special-label">Ахиллесова пята</div>
                        <p class="special-description">${num.achilles?.description || ''}</p>
                    </div>
                    <div class="special-card">
                        <div class="special-value">${num.control?.number || '?'}</div>
                        <div class="special-label">Число управления</div>
                        <p class="special-description">${num.control?.description || ''}</p>
                    </div>
                </div>
                
                <h4 class="subsection-title">Социальные оклики</h4>
                <div class="calls-grid">
                    <div class="call-card">
                        <div class="call-number">${num.calls?.close || '?'}</div>
                        <div class="call-label">Близкий круг</div>
                        <p class="call-description">${num.calls?.descriptions?.close || ''}</p>
                    </div>
                    <div class="call-card">
                        <div class="call-number">${num.calls?.social || '?'}</div>
                        <div class="call-label">Социум</div>
                        <p class="call-description">${num.calls?.descriptions?.social || ''}</p>
                    </div>
                    <div class="call-card">
                        <div class="call-number">${num.calls?.world || '?'}</div>
                        <div class="call-label">Дальний круг</div>
                        <p class="call-description">${num.calls?.descriptions?.world || ''}</p>
                    </div>
                </div>
            </div>
        `;

        // ЗВЕЗДНЫЙ КОД
        if (result.zodiac) {
            html += `
                <div class="report-section">
                    <h3 class="section-title">
                        <i class="fas fa-star"></i> ЗВЕЗДНЫЙ КОД
                    </h3>
                    <div class="zodiac-header">
                        <div class="zodiac-symbol">${this.getZodiacSymbol(result.zodiac.name)}</div>
                        <div>
                            <h4>${result.zodiac.name}</h4>
                            <p>${result.zodiac.element} • ${result.zodiac.planet}</p>
                        </div>
                    </div>
                    <div class="zodiac-description">
                        <p>${result.zodiac.description}</p>
                    </div>
                    <div class="zodiac-details">
                        <div class="detail-item">
                            <strong>🌟 Сильные стороны:</strong>
                            <p>${result.zodiac.strengths}</p>
                        </div>
                        <div class="detail-item">
                            <strong>🌙 Зоны роста:</strong>
                            <p>${result.zodiac.weaknesses}</p>
                        </div>
                        <div class="detail-item">
                            <strong>🎯 Жизненная миссия:</strong>
                            <p>${result.zodiac.lifeMission}</p>
                        </div>
                    </div>
                </div>
            `;
        }

        // ФЕН-ШУЙ
        if (result.fengShui) {
            html += `
                <div class="report-section">
                    <h3 class="section-title">
                        <i class="fas fa-wind"></i> ЭНЕРГИЯ ФЕН-ШУЙ
                    </h3>
                    <div class="fengshui-header">
                        <div class="element-symbol">${this.getElementSymbol(result.fengShui.element)}</div>
                        <h4>${result.fengShui.element}</h4>
                    </div>
                    <div class="fengshui-details">
                        <p><strong>🎨 Цвет силы:</strong> ${result.fengShui.color}</p>
                        <p><strong>🧭 Направление удачи:</strong> ${result.fengShui.direction}</p>
                        <p><strong>⏰ Время активации:</strong> ${result.fengShui.season}</p>
                    </div>
                    <div class="fengshui-description">
                        <p>${result.fengShui.description}</p>
                    </div>
                    <div class="fengshui-affirmation">
                        <p><em>"${result.fengShui.affirmation}"</em></p>
                    </div>
                </div>
            `;
        }

        // ТАРО
        if (result.tarot) {
            html += `
                <div class="report-section">
                    <h3 class="section-title">
                        <i class="fas fa-crown"></i> КАРТЫ ТАРО
                    </h3>
                    <div class="tarot-grid">
                        ${this.renderTarotCard('Судьбы', result.tarot.fate)}
                        ${this.renderTarotCard('Личности', result.tarot.personality)}
                        ${this.renderTarotCard('Пути', result.tarot.control)}
                    </div>
                </div>
            `;
        }

        // ПСИХОЛОГИЯ
        if (result.psychology) {
            html += `
                <div class="report-section">
                    <h3 class="section-title">
                        <i class="fas fa-brain"></i> ПСИХОЛОГИЧЕСКИЙ ПОРТРЕТ
                    </h3>
                    <div class="psychology-section">
                        <h4>НЛП-профиль</h4>
                        <p><strong>${result.psychology.modality?.title}</strong></p>
                        <p>${result.psychology.modality?.description}</p>
                        
                        <h4>Архетип личности</h4>
                        <p><strong>${result.psychology.archetype?.name}</strong></p>
                        <p>${result.psychology.archetype?.description}</p>
                        
                        <h4>Тип привязанности</h4>
                        <p><strong>${result.psychology.attachment?.name}</strong></p>
                        <p>${result.psychology.attachment?.description}</p>
                    </div>
                </div>
            `;
        }

        // ПАТТЕРНЫ
        if (result.patterns && result.patterns.length > 0) {
            html += `
                <div class="report-section">
                    <h3 class="section-title">
                        <i class="fas fa-puzzle-piece"></i> ПАТТЕРНЫ ЛИЧНОСТИ
                    </h3>
                    <div class="patterns-list">
                        ${result.patterns.map(p => `
                            <div class="pattern-item">
                                <p>✦ ${p}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // СВИТОК СУДЬБЫ
        if (result.interpretation) {
            html += `
                <div class="report-section">
                    <h3 class="section-title">
                        <i class="fas fa-scroll"></i> СВИТОК СУДЬБЫ
                    </h3>
                    <div class="scroll-text">
                        ${result.interpretation.split('\n').map(p => `<p>${p}</p>`).join('')}
                    </div>
                </div>
            `;
        }

        // ГЛУБИННЫЙ ПОРТРЕТ
        if (result.deepPortrait) {
            html += `
                <div class="report-section">
                    <h3 class="section-title">
                        <i class="fas fa-moon"></i> ГЛУБИННЫЙ ПОРТРЕТ
                    </h3>
                    <div class="portrait-text">
                        ${result.deepPortrait.split('\n').map(p => `<p>${p}</p>`).join('')}
                    </div>
                </div>
            `;
        }

        // ИНТЕРПРЕТАЦИИ
        if (result.numerology?.interpretations) {
            html += `
        <div class="report-section">
            <h3 class="section-title">
                <i class="fas fa-chart-pie"></i> ПОЛНЫЕ ИНТЕРПРЕТАЦИИ
            </h3>
            <div class="interpretations-grid">
    `;

            const interps = result.numerology.interpretations;

            if (interps.career) {
                html += this.renderInterpretationCard('💼 КАРЬЕРА', interps.career);
            }
            if (interps.family) {
                html += this.renderInterpretationCard('👨‍👩‍👧‍👦 СЕМЬЯ', interps.family);
            }
            if (interps.love) {
                html += this.renderInterpretationCard('❤️ ЛЮБОВЬ', interps.love);
            }
            if (interps.money) {
                html += this.renderInterpretationCard('💰 ФИНАНСЫ', interps.money);
            }
            if (interps.health) {
                html += this.renderInterpretationCard('🌿 ЗДОРОВЬЕ', interps.health);
            }
            if (interps.talent) {
                html += this.renderInterpretationCard('⭐ ТАЛАНТЫ', interps.talent);
            }

            html += '</div></div>';
        }

        return html;
    }

    renderInterpretationCard(title, data) {
        if (!data) return '';

        // Форматирование списков
        const formatList = (items) => {
            if (!items || items.length === 0) return '';
            return items.map(item => `<li>${item}</li>`).join('');
        };

        return `
        <div class="interpretation-card">
            <div class="interpretation-header">
                <span class="interpretation-number-badge">${data.careerNumber || data.familyNumber || data.loveNumber || data.moneyNumber || data.healthNumber || data.talentNumber || '?'}</span>
                <h4>${title}</h4>
            </div>
            
            <div class="interpretation-content">
                <p class="interpretation-description">${data.description || ''}</p>
                
                <div class="interpretation-detailed">
                    <h5>📝 Подробное описание</h5>
                    <p>${data.detailedDescription || data.description || ''}</p>
                </div>
                
                ${data.strengths && data.strengths.length ? `
                <div class="interpretation-section">
                    <h5>🌟 Сильные стороны</h5>
                    <ul class="strengths-list">
                        ${formatList(data.strengths)}
                    </ul>
                </div>
                ` : ''}
                
                ${data.weaknesses && data.weaknesses.length ? `
                <div class="interpretation-section">
                    <h5>🌙 Зоны роста</h5>
                    <ul class="weaknesses-list">
                        ${formatList(data.weaknesses)}
                    </ul>
                </div>
                ` : ''}
                
                ${data.suitable && data.suitable.length ? `
                <div class="interpretation-section">
                    <h5>💼 Подходящие профессии</h5>
                    <ul class="suitable-list">
                        ${formatList(data.suitable)}
                    </ul>
                </div>
                ` : ''}
                
                <div class="interpretation-grid">
                    ${data.workStyle ? `
                    <div class="grid-item">
                        <h5>📊 Стиль работы</h5>
                        <p>${data.workStyle}</p>
                    </div>
                    ` : ''}
                    
                    ${data.moneyApproach ? `
                    <div class="grid-item">
                        <h5>💰 Подход к деньгам</h5>
                        <p>${data.moneyApproach}</p>
                    </div>
                    ` : ''}
                </div>
                
                <div class="interpretation-grid">
                    ${data.managementStyle ? `
                    <div class="grid-item">
                        <h5>👥 Стиль управления</h5>
                        <p>${data.managementStyle}</p>
                    </div>
                    ` : ''}
                    
                    ${data.idealEnvironment ? `
                    <div class="grid-item">
                        <h5>🏢 Идеальная среда</h5>
                        <p>${data.idealEnvironment}</p>
                    </div>
                    ` : ''}
                </div>
                
                <div class="interpretation-grid">
                    ${data.successFactors && data.successFactors.length ? `
                    <div class="grid-item">
                        <h5>✅ Факторы успеха</h5>
                        <ul class="factors-list">
                            ${formatList(data.successFactors)}
                        </ul>
                    </div>
                    ` : ''}
                    
                    ${data.failureFactors && data.failureFactors.length ? `
                    <div class="grid-item">
                        <h5>❌ Факторы риска</h5>
                        <ul class="factors-list">
                            ${formatList(data.failureFactors)}
                        </ul>
                    </div>
                    ` : ''}
                </div>
                
                ${data.developmentPath ? `
                <div class="interpretation-section development-path">
                    <h5>🛤️ Путь развития</h5>
                    <p>${data.developmentPath}</p>
                </div>
                ` : ''}
                
                <div class="interpretation-numbers">
                    ${data.successNumber ? `
                    <div class="number-item">
                        <span class="number-label">📈 Число успеха:</span>
                        <span class="number-value">${data.successNumber}</span>
                        <span class="number-desc">${data.successDescription || ''}</span>
                    </div>
                    ` : ''}
                    
                    ${data.realizationNumber ? `
                    <div class="number-item">
                        <span class="number-label">🎯 Число реализации:</span>
                        <span class="number-value">${data.realizationNumber}</span>
                        <span class="number-desc">${data.realizationDescription || ''}</span>
                    </div>
                    ` : ''}
                </div>
                
                ${data.advice ? `
                <div class="interpretation-advice">
                    <i class="fas fa-quote-left"></i>
                    <p>${data.advice}</p>
                </div>
                ` : ''}
            </div>
        </div>
    `;
    }

    renderTarotCard(title, card) {
        if (!card) return '';
        return `
            <div class="tarot-card">
                <div class="tarot-image-container">
                    <img src="${card.image || '/images/tarot/back.jpg'}" alt="${card.name}" onerror="this.src='/images/tarot/back.jpg'">
                    <div class="tarot-number-badge">${card.number === 0 ? 22 : card.number}</div>
                </div>
                <div class="tarot-content">
                    <h4>Карта ${title}</h4>
                    <h5>${card.name}</h5>
                    <p class="tarot-keywords">${card.keywords}</p>
                    <p class="tarot-description">${card.description}</p>
                    <p class="tarot-advice">${card.advice}</p>
                </div>
            </div>
        `;
    }

    renderBasicReport(result) {
        return `
            <div class="report-section">
                <pre class="result-content">${JSON.stringify(result, null, 2)}</pre>
            </div>
        `;
    }

    getZodiacSymbol(signName) {
        const symbols = {
            'Овен': '♈', 'Телец': '♉', 'Близнецы': '♊', 'Рак': '♋',
            'Лев': '♌', 'Дева': '♍', 'Весы': '♎', 'Скорпион': '♏',
            'Стрелец': '♐', 'Козерог': '♑', 'Водолей': '♒', 'Рыбы': '♓'
        };
        return symbols[signName] || '⛤';
    }

    getElementSymbol(element) {
        const elementLower = String(element || '').toLowerCase();
        const symbols = {
            'металл': '⚜️', 'metal': '⚜️',
            'вода': '🌊', 'water': '🌊',
            'дерево': '🌳', 'wood': '🌳',
            'огонь': '🔥', 'fire': '🔥',
            'земля': '⛰️', 'earth': '⛰️'
        };
        return symbols[elementLower] || '✨';
    }

    async downloadPDF(calculationId) {
        try {
            this.showNotification('📄 Генерируем PDF...', 'info');

            const response = await fetch(`/api/numerology/pdf/${calculationId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Ошибка при генерации PDF');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `numerology-report-${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            this.showNotification('✅ PDF готов!', 'success');

        } catch (error) {
            console.error('Error downloading PDF:', error);
            this.showNotification('❌ Ошибка при создании PDF', 'error');
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    closeModal() {
        document.getElementById('calculationModal').style.display = 'none';
    }
}

// Инициализация
const historyApp = new HistoryApp();
window.historyApp = historyApp;