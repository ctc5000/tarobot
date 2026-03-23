// modules/Numerology/web/js/services/dateService.js

(function() {
    window.DateService = {
        formatDateForServer: function(dateStr) {
            if (!dateStr) return '';

            // Если это объект Date
            if (dateStr instanceof Date && !isNaN(dateStr)) {
                const year = dateStr.getFullYear();
                const month = String(dateStr.getMonth() + 1).padStart(2, '0');
                const day = String(dateStr.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            }

            // Если это строка
            if (typeof dateStr === 'string') {
                // Если уже в формате YYYY-MM-DD
                if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
                    return dateStr;
                }
                // Если в формате DD.MM.YYYY
                if (/^\d{2}\.\d{2}\.\d{4}$/.test(dateStr)) {
                    const [day, month, year] = dateStr.split('.');
                    return `${year}-${month}-${day}`;
                }
            }

            // Если ничего не подошло, пробуем создать Date
            const d = new Date(dateStr);
            if (!isNaN(d)) {
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            }

            console.warn('Не удалось преобразовать дату:', dateStr);
            return '';
        },

        formatDateForDisplay: function(date) {
            if (!date) return '';
            if (typeof date === 'string' && date.includes('-')) {
                const [year, month, day] = date.split('-');
                return `${day}.${month}.${year}`;
            }
            if (date instanceof Date) {
                return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;
            }
            if (typeof date === 'string' && date.includes('.')) {
                return date;
            }
            return date;
        },

        getMonday: function(date) {
            const d = new Date(date);
            const day = d.getDay();
            const diff = d.getDate() - day + (day === 0 ? -6 : 1);
            return new Date(d.setDate(diff));
        },

        getWeekRange: function(startDate) {
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 6);
            return { start: startDate, end: endDate };
        },

        getMonthDates: function(targetDate) {
            let year, month, day;

            if (typeof targetDate === 'string') {
                if (targetDate.includes('-')) {
                    [year, month, day] = targetDate.split('-');
                } else if (targetDate.includes('.')) {
                    [day, month, year] = targetDate.split('.');
                }
            } else if (targetDate instanceof Date) {
                year = targetDate.getFullYear();
                month = targetDate.getMonth() + 1;
                day = targetDate.getDate();
            }

            const firstDay = new Date(year, month - 1, 1);
            const lastDay = new Date(year, month, 0);
            const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

            return {
                start: this.formatDateForDisplay(firstDay),
                end: this.formatDateForDisplay(lastDay),
                monthName: monthNames[parseInt(month) - 1],
                year: parseInt(year),
                daysInMonth: lastDay.getDate(),
                firstDayOfWeek: firstDay.getDay()
            };
        }
    };
})();