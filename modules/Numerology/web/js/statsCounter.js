// modules/Numerology/web/js/statsCounter.js
(function() {
    window.StatsCounter = {
        // Базовая статистика
        baseStats: {
            startDate: '2024-02-01', // Дата начала отсчета
            baseCount: 50000,        // Базовое количество
            dailyGrowth: 37          // Ежедневный прирост
        },

        /**
         * Расчет текущего количества расчетов
         * @returns {number} Актуальное количество
         */
        calculateCurrentCount: function() {
            const start = new Date(this.baseStats.startDate);
            const today = new Date();

            // Сбрасываем время для корректного расчета дней
            start.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);

            // Количество дней с начала отсчета
            const daysPassed = Math.floor((today - start) / (1000 * 60 * 60 * 24));

            // Расчет текущего количества
            let currentCount = this.baseStats.baseCount + (daysPassed * this.baseStats.dailyGrowth);

            // Для красоты: округляем до тысяч, сотен или оставляем как есть
            return currentCount;
        },

        /**
         * Форматирование числа с разделителями
         * @param {number} number - Число для форматирования
         * @returns {string} Отформатированное число
         */
        formatNumber: function(number) {
            return Math.floor(number).toLocaleString('ru-RU');
        },

        /**
         * Обновление счетчика на странице
         * @param {string} elementId - ID элемента для обновления
         */
        updateCounter: function(elementId = 'statsCounter') {
            const element = document.getElementById(elementId);
            if (!element) {
                console.warn(`Элемент с id "${elementId}" не найден`);
                return;
            }

            const currentCount = this.calculateCurrentCount();
            const formattedCount = this.formatNumber(currentCount);

            // Анимация обновления (опционально)
            if (element.textContent !== formattedCount) {
                element.style.opacity = '0.5';
                element.textContent = formattedCount;
                setTimeout(() => {
                    element.style.opacity = '1';
                }, 100);
            }
        },

        /**
         * Запуск автоматического обновления счетчика (каждый час)
         * @param {string} elementId - ID элемента для обновления
         * @param {number} intervalMinutes - Интервал обновления в минутах
         */
        startAutoUpdate: function(elementId = 'statsCounter', intervalMinutes = 60) {
            // Первоначальное обновление
            this.updateCounter(elementId);

            // Периодическое обновление
            setInterval(() => {
                this.updateCounter(elementId);
            }, intervalMinutes * 60 * 1000);
        }

    };

})();

