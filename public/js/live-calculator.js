class LiveCalculator {
    constructor() {
        this.calculationMessages = [
            "🔮 Сканирую энергетическое поле...",
            "✨ Синхронизируюсь со звездами...",
            "🌀 Анализирую вибрации имени...",
            "🌙 Соединяюсь с лунными циклами...",
            "⭐ Читаю линии судьбы...",
            "🔢 Расшифровываю числовые коды...",
            "🎴 Перемешиваю карты Таро...",
            "🌳 Подключаюсь к родовой памяти...",
            "⚡ Активирую древние знания...",
            "📜 Расшифровываю свиток судьбы..."
        ];

        this.thinkingSteps = [
            "• Анализ данных",
            "• Поиск соответствий",
            "• Вычисление вибраций",
            "• Проверка гармонии",
            "• Синтез энергий",
            "• Формирование ответа"
        ];
    }

    async calculateWithEffect(form, button, callback) {
        // Эффект живого расчета
        button.disabled = true;
        button.innerHTML = '<span class="button-text">🔮 Вычисляю...</span>';

        // Показываем магический круг
        const magicCircle = document.createElement('div');
        magicCircle.className = 'magic-circle active';
        document.body.appendChild(magicCircle);

        // Создаем контейнер для статуса
        const statusDiv = document.createElement('div');
        statusDiv.className = 'calculation-status glass-card';
        statusDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            max-width: 300px;
            z-index: 1001;
            padding: 20px;
            background: rgba(26, 15, 36, 0.9);
        `;
        document.body.appendChild(statusDiv);

        // Показываем процесс вычисления
        for (let i = 0; i < this.calculationMessages.length; i++) {
            statusDiv.innerHTML = `
                <h4>🔮 Процесс вычисления:</h4>
                <p class="typing-animation">${this.calculationMessages[i]}</p>
                <div style="margin-top: 15px;">
                    ${this.getProgressBar(i + 1, this.calculationMessages.length)}
                </div>
                <div style="margin-top: 10px; font-size: 0.8rem;">
                    ${this.getThinkingStep(i)}
                </div>
            `;

            // Эффект искр
            this.createSparks();

            // Случайная задержка для имитации реального расчета
            await this.sleep(800 + Math.random() * 700);
        }

        // Финальная анимация
        statusDiv.innerHTML = `
            <h4>✨ Расчет завершен!</h4>
            <p class="pulse" style="color: var(--gold);">Судьба раскрыта...</p>
        `;

        // Создаем финальные искры
        for (let i = 0; i < 20; i++) {
            this.createSparks();
        }

        await this.sleep(1000);

        // Убираем эффекты
        magicCircle.remove();
        statusDiv.remove();

        // Вызываем реальный расчет
        await callback();

        // Восстанавливаем кнопку
        button.disabled = false;
        button.innerHTML = '<span class="button-text">✨ Рассчитать судьбу</span>';
    }

    getProgressBar(current, total) {
        const percent = (current / total) * 100;
        return `
            <div style="
                width: 100%;
                height: 6px;
                background: rgba(255,255,255,0.1);
                border-radius: 3px;
                overflow: hidden;
            ">
                <div style="
                    width: ${percent}%;
                    height: 100%;
                    background: linear-gradient(90deg, var(--accent-violet), var(--gold));
                    transition: width 0.3s;
                "></div>
            </div>
        `;
    }

    getThinkingStep(index) {
        const step = this.thinkingSteps[Math.min(index, this.thinkingSteps.length - 1)];
        return `<span style="color: var(--text-secondary);">${step}</span>`;
    }

    createSparks() {
        const sparkCount = 5;
        for (let i = 0; i < sparkCount; i++) {
            const spark = document.createElement('div');
            spark.className = 'spark';

            const angle = Math.random() * Math.PI * 2;
            const distance = 50 + Math.random() * 100;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;

            spark.style.setProperty('--tx', tx + 'px');
            spark.style.setProperty('--ty', ty + 'px');
            spark.style.left = '50%';
            spark.style.top = '50%';

            document.body.appendChild(spark);

            setTimeout(() => spark.remove(), 1000);
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Создаем глобальный экземпляр
window.liveCalculator = new LiveCalculator();