// modules/Numerology/web/js/modules/datePickers.js

(function() {
    window.DatePickers = {
        currentWeekStart: null,
        currentMonth: null,
        currentYear: null,

        initWeekPicker: function(containerId, onSelect) {
            const container = document.getElementById(containerId);
            if (!container) return;

            container.innerHTML = `
                <div class="week-picker-header">
                    <button type="button" class="week-nav-btn" id="prevWeekBtn"><i class="fas fa-chevron-left"></i></button>
                    <span id="weekDisplay">Текущая неделя</span>
                    <button type="button" class="week-nav-btn" id="nextWeekBtn"><i class="fas fa-chevron-right"></i></button>
                </div>
                <div class="week-days-grid" id="weekDaysGrid"></div>
                <input type="hidden" id="selectedWeekStart" value="">
                <input type="hidden" id="selectedWeekEnd" value="">
            `;

            const today = new Date();
            const monday = window.DateService.getMonday(today);
            this.updateWeekDisplay(monday, onSelect);

            document.getElementById('prevWeekBtn')?.addEventListener('click', () => this.changeWeek(-1, onSelect));
            document.getElementById('nextWeekBtn')?.addEventListener('click', () => this.changeWeek(1, onSelect));
        },

        changeWeek: function(delta, onSelect) {
            const currentStartStr = document.getElementById('selectedWeekStart')?.value;
            if (!currentStartStr) return;
            const currentStart = new Date(currentStartStr);
            currentStart.setDate(currentStart.getDate() + (delta * 7));
            this.updateWeekDisplay(currentStart, onSelect);
        },

        updateWeekDisplay: function(startDate, onSelect) {
            // startDate может быть объектом Date или строкой
            let start;
            if (startDate instanceof Date) {
                start = startDate;
            } else if (typeof startDate === 'string') {
                start = new Date(startDate);
            } else {
                start = new Date();
            }

            const endDate = new Date(start);
            endDate.setDate(start.getDate() + 6);

            const weekDisplay = document.getElementById('weekDisplay');
            const weekStartInput = document.getElementById('selectedWeekStart');
            const weekEndInput = document.getElementById('selectedWeekEnd');
            const targetDateInput = document.getElementById('targetDate');

            if (!weekDisplay) return;

            const startStr = window.DateService.formatDateForDisplay(start);
            const endStr = window.DateService.formatDateForDisplay(endDate);
            const startForServer = window.DateService.formatDateForServer(start);

            weekDisplay.textContent = `${startStr} — ${endStr}`;
            if (weekStartInput) weekStartInput.value = startForServer;
            if (weekEndInput) weekEndInput.value = window.DateService.formatDateForServer(endDate);
            if (targetDateInput) targetDateInput.value = startForServer;

            this.updateWeekDaysGrid(start);
            if (onSelect) onSelect(startForServer);
        },

        updateWeekDaysGrid: function(startDate) {
            const grid = document.getElementById('weekDaysGrid');
            if (!grid) return;

            const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            let start;
            if (startDate instanceof Date) {
                start = startDate;
            } else if (typeof startDate === 'string') {
                start = new Date(startDate);
            } else {
                start = new Date();
            }

            let html = '';
            for (let i = 0; i < 7; i++) {
                const date = new Date(start);
                date.setDate(start.getDate() + i);
                const dateStr = `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}`;
                const isToday = date.getTime() === today.getTime();
                const isPast = date < today;
                const isFuture = date > today;

                html += `
                    <div class="week-day ${isToday ? 'today' : ''} ${isPast ? 'past' : ''} ${isFuture ? 'future' : ''}">
                        <span class="day-name">${days[i]}</span>
                        <span class="day-date">${dateStr}</span>
                    </div>`;
            }
            grid.innerHTML = html;
        },

        initMonthPicker: function(containerId, onSelect) {
            const container = document.getElementById(containerId);
            if (!container) return;

            container.innerHTML = `
                <div class="month-picker-header">
                    <button type="button" class="month-nav-btn" id="prevMonthBtn"><i class="fas fa-chevron-left"></i></button>
                    <span id="monthDisplay">Март 2026</span>
                    <button type="button" class="month-nav-btn" id="nextMonthBtn"><i class="fas fa-chevron-right"></i></button>
                </div>
                <div class="month-calendar" id="monthCalendar"></div>
                <input type="hidden" id="selectedMonth" value="">
                <input type="hidden" id="selectedYear" value="">
            `;

            const today = new Date();
            this.updateMonthDisplay(today, onSelect);

            document.getElementById('prevMonthBtn')?.addEventListener('click', () => this.changeMonth(-1, onSelect));
            document.getElementById('nextMonthBtn')?.addEventListener('click', () => this.changeMonth(1, onSelect));
        },

        changeMonth: function(delta, onSelect) {
            const currentMonth = parseInt(document.getElementById('selectedMonth')?.value);
            const currentYear = parseInt(document.getElementById('selectedYear')?.value);
            if (!currentMonth || !currentYear) return;

            let newMonth = currentMonth + delta;
            let newYear = currentYear;
            if (newMonth > 12) { newMonth = 1; newYear++; }
            else if (newMonth < 1) { newMonth = 12; newYear--; }

            this.updateMonthDisplay(new Date(newYear, newMonth - 1, 1), onSelect);
        },

        updateMonthDisplay: function(date, onSelect) {
            const monthDisplay = document.getElementById('monthDisplay');
            const monthInput = document.getElementById('selectedMonth');
            const yearInput = document.getElementById('selectedYear');
            const targetDateInput = document.getElementById('targetDate');

            if (!monthDisplay) return;

            let month, year;
            if (date instanceof Date) {
                month = date.getMonth() + 1;
                year = date.getFullYear();
            } else {
                const d = new Date(date);
                month = d.getMonth() + 1;
                year = d.getFullYear();
            }

            const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

            monthDisplay.textContent = `${monthNames[month - 1]} ${year}`;
            if (monthInput) monthInput.value = month;
            if (yearInput) yearInput.value = year;
            if (targetDateInput) targetDateInput.value = `${year}-${String(month).padStart(2, '0')}-01`;

            this.generateMonthCalendar(month, year);
            if (onSelect) onSelect(`${year}-${String(month).padStart(2, '0')}-01`);
        },

        generateMonthCalendar: function(month, year) {
            const calendar = document.getElementById('monthCalendar');
            if (!calendar) return;

            const firstDay = new Date(year, month - 1, 1).getDay();
            const daysInMonth = new Date(year, month, 0).getDate();
            const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
            const today = new Date();
            const isCurrentMonth = today.getMonth() + 1 === month && today.getFullYear() === year;
            const currentDay = today.getDate();

            let html = `<div class="calendar-weekdays">${daysOfWeek.map(day => `<div class="weekday">${day}</div>`).join('')}</div><div class="calendar-days">`;

            const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
            for (let i = 0; i < adjustedFirstDay; i++) html += `<div class="calendar-day empty"></div>`;

            for (let day = 1; day <= daysInMonth; day++) {
                const isToday = isCurrentMonth && day === currentDay;
                html += `<div class="calendar-day ${isToday ? 'today' : ''}" data-date="${day}.${month}.${year}">
                            <span class="day-number">${day}</span>
                        </div>`;
            }
            html += '</div>';
            calendar.innerHTML = html;
        },

        initYearPicker: function(containerId, onSelect) {
            const container = document.getElementById(containerId);
            if (!container) return;

            const currentYear = new Date().getFullYear();

            container.innerHTML = `
                <div class="year-picker-header">
                    <button type="button" class="year-nav-btn" id="prevYearBtn"><i class="fas fa-chevron-left"></i></button>
                    <span id="yearDisplay">${currentYear}</span>
                    <button type="button" class="year-nav-btn" id="nextYearBtn"><i class="fas fa-chevron-right"></i></button>
                </div>
                <div class="year-grid" id="yearGrid"></div>
                <input type="hidden" id="selectedYear" value="${currentYear}">
            `;

            this.generateYearGrid(currentYear);
            if (onSelect) onSelect(`${currentYear}-01-01`);

            document.getElementById('prevYearBtn')?.addEventListener('click', () => this.changeYear(-1, onSelect));
            document.getElementById('nextYearBtn')?.addEventListener('click', () => this.changeYear(1, onSelect));
        },

        changeYear: function(delta, onSelect) {
            const yearDisplay = document.getElementById('yearDisplay');
            const yearInput = document.getElementById('selectedYear');
            const targetDateInput = document.getElementById('targetDate');

            if (!yearDisplay) return;

            let currentYear = parseInt(yearDisplay.textContent);
            let newYear = currentYear + delta;
            if (newYear < 1900 || newYear > 2100) return;

            yearDisplay.textContent = newYear;
            if (yearInput) yearInput.value = newYear;
            if (targetDateInput) targetDateInput.value = `${newYear}-01-01`;

            this.generateYearGrid(newYear);
            if (onSelect) onSelect(`${newYear}-01-01`);
        },

        generateYearGrid: function(selectedYear) {
            const yearGrid = document.getElementById('yearGrid');
            if (!yearGrid) return;

            const startYear = selectedYear - 4;
            const endYear = selectedYear + 4;
            let html = '<div class="year-grid-row">';

            for (let year = startYear; year <= endYear; year++) {
                const isSelected = year === selectedYear;
                const isCurrentYear = year === new Date().getFullYear();

                html += `<div class="year-grid-item ${isSelected ? 'selected' : ''} ${isCurrentYear ? 'current' : ''}" data-year="${year}">${year}</div>`;
                if ((year - startYear + 1) % 3 === 0 && year < endYear) {
                    html += '</div><div class="year-grid-row">';
                }
            }
            html += '</div>';
            yearGrid.innerHTML = html;

            yearGrid.querySelectorAll('.year-grid-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    const year = parseInt(e.currentTarget.dataset.year);
                    this.updateYearDisplay(year);
                });
            });
        },

        updateYearDisplay: function(year) {
            const yearDisplay = document.getElementById('yearDisplay');
            const yearInput = document.getElementById('selectedYear');
            const targetDateInput = document.getElementById('targetDate');

            if (!yearDisplay) return;

            yearDisplay.textContent = year;
            if (yearInput) yearInput.value = year;
            if (targetDateInput) targetDateInput.value = `${year}-01-01`;
            this.generateYearGrid(year);
        }
    };
})();