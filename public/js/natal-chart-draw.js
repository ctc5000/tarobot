class NatalChartDraw {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error('Canvas not found:', canvasId);
            return;
        }
        this.ctx = this.canvas.getContext('2d');
        this.width = 500;
        this.height = 500;
        this.centerX = 250;
        this.centerY = 250;
        this.radius = 200;

        // Настройки размеров
        this.setCanvasSize();
    }

    setCanvasSize() {
        // Устанавливаем размер канваса с учетом Retina дисплеев
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = this.width * dpr;
        this.canvas.height = this.height * dpr;
        this.canvas.style.width = this.width + 'px';
        this.canvas.style.height = this.height + 'px';
        this.ctx.scale(dpr, dpr);

        // Настройки для красивых линий
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
    }

    draw(data) {
        if (!this.ctx) return;

        // Очищаем канвас
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Рисуем фон
        this.drawBackground();

        // Рисуем круг
        this.drawCircle();

        // Рисуем дома (линии от центра к окружности)
        if (data.houses) {
            this.drawHouses(data.houses);
        }

        // Рисуем знаки зодиака
        this.drawSigns();

        // Рисуем планеты
        if (data.planets) {
            this.drawPlanets(data.planets);
        }

        // Рисуем центр
        this.drawCenter();

        // Добавляем метки домов
        this.drawHouseNumbers();
    }

    drawBackground() {
        // Радиальный градиент для фона
        const gradient = this.ctx.createRadialGradient(
            this.centerX, this.centerY, 0,
            this.centerX, this.centerY, this.radius
        );
        gradient.addColorStop(0, 'rgba(45, 27, 74, 0.3)');
        gradient.addColorStop(1, 'rgba(26, 15, 36, 0.5)');

        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
    }

    drawCircle() {
        // Внешний круг
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
        this.ctx.strokeStyle = 'rgba(212, 175, 55, 0.6)';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Внутренний круг
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.radius * 0.2, 0, 2 * Math.PI);
        this.ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();

        // Декоративные точки по кругу
        this.ctx.fillStyle = 'rgba(212, 175, 55, 0.3)';
        for (let i = 0; i < 12; i++) {
            const angle = (i * 30 * Math.PI) / 180;
            const x = this.centerX + this.radius * Math.cos(angle);
            const y = this.centerY + this.radius * Math.sin(angle);

            this.ctx.beginPath();
            this.ctx.arc(x, y, 3, 0, 2 * Math.PI);
            this.ctx.fill();
        }
    }

    drawHouses(houses) {
        // Сортируем дома по куспидам
        const sortedHouses = [...houses].sort((a, b) => a.cusp - b.cusp);

        // Рисуем линии домов
        this.ctx.strokeStyle = 'rgba(212, 175, 55, 0.8)';
        this.ctx.lineWidth = 2;

        houses.forEach((house) => {
            // Конвертируем угол из астрологической системы (0° = Овен) в математическую (0° = право)
            // В астрологии 0° = Овен (на 9 часов), в математике 0° = 3 часа
            const angle = ((house.cusp - 90) * Math.PI) / 180;

            const x = this.centerX + this.radius * Math.cos(angle);
            const y = this.centerY + this.radius * Math.sin(angle);

            // Рисуем линию от центра к краю
            this.ctx.beginPath();
            this.ctx.moveTo(this.centerX, this.centerY);
            this.ctx.lineTo(x, y);
            this.ctx.stroke();

            // Добавляем небольшую точку на конце линии
            this.ctx.beginPath();
            this.ctx.arc(x, y, 4, 0, 2 * Math.PI);
            this.ctx.fillStyle = 'rgba(212, 175, 55, 0.8)';
            this.ctx.fill();
        });

        // Рисуем дополнительную окружность для аспектов (опционально)
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.radius * 0.8, 0, 2 * Math.PI);
        this.ctx.strokeStyle = 'rgba(212, 175, 55, 0.2)';
        this.ctx.setLineDash([5, 5]);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }

    drawSigns() {
        const signs = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
        const signNames = ['Овен', 'Телец', 'Близнецы', 'Рак', 'Лев', 'Дева',
            'Весы', 'Скорпион', 'Стрелец', 'Козерог', 'Водолей', 'Рыбы'];

        this.ctx.font = 'bold 20px "Arial", sans-serif';
        this.ctx.fillStyle = 'rgba(212, 175, 55, 0.9)';
        this.ctx.shadowColor = '#d4af37';
        this.ctx.shadowBlur = 10;

        signs.forEach((sign, i) => {
            // Угол для знака (каждый знак занимает 30°)
            const angle = ((i * 30 + 15 - 90) * Math.PI) / 180; // +15 чтобы центрировать в знаке
            const x = this.centerX + (this.radius + 30) * Math.cos(angle);
            const y = this.centerY + (this.radius + 30) * Math.sin(angle);

            // Рисуем символ знака
            this.ctx.save();
            this.ctx.translate(x, y);
            this.ctx.rotate(angle + Math.PI/2); // Поворачиваем текст по радиусу
            this.ctx.fillText(sign, -10, -10);
            this.ctx.restore();

            // Добавляем маленькие точки для градусов
            for (let d = 0; d < 30; d += 10) {
                const degreeAngle = ((i * 30 + d - 90) * Math.PI) / 180;
                const dotX = this.centerX + (this.radius - 5) * Math.cos(degreeAngle);
                const dotY = this.centerY + (this.radius - 5) * Math.sin(degreeAngle);

                this.ctx.beginPath();
                this.ctx.arc(dotX, dotY, 1, 0, 2 * Math.PI);
                this.ctx.fillStyle = 'rgba(212, 175, 55, 0.3)';
                this.ctx.shadowBlur = 0;
                this.ctx.fill();
            }
        });

        this.ctx.shadowBlur = 0;
    }

    drawPlanets(planets) {
        this.ctx.font = 'bold 18px "Arial", sans-serif';
        this.ctx.shadowColor = '#d4af37';
        this.ctx.shadowBlur = 15;

        Object.entries(planets).forEach(([name, data]) => {
            // Конвертируем угол
            const angle = ((data.longitude - 90) * Math.PI) / 180;

            // Планеты располагаются на разном расстоянии от центра для наглядности
            const planetDistances = {
                sun: 0.85, moon: 0.75, mercury: 0.7, venus: 0.65,
                mars: 0.6, jupiter: 0.55, saturn: 0.5
            };

            const distance = this.radius * (planetDistances[name] || 0.7);
            const x = this.centerX + distance * Math.cos(angle);
            const y = this.centerY + distance * Math.sin(angle);

            // Рисуем планету
            this.ctx.fillStyle = '#d4af37';
            this.ctx.fillText(data.symbol, x - 12, y - 12);

            // Добавляем маленький кружок под планетой
            this.ctx.beginPath();
            this.ctx.arc(x, y, 12, 0, 2 * Math.PI);
            this.ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
            this.ctx.lineWidth = 1;
            this.ctx.stroke();

            // Добавляем название планеты (сокращенно)
            this.ctx.font = 'bold 10px "Arial", sans-serif';
            this.ctx.fillStyle = 'rgba(212, 175, 55, 0.8)';
            this.ctx.fillText(name === 'sun' ? 'Солнце' :
                name === 'moon' ? 'Луна' :
                    name.charAt(0).toUpperCase() + name.slice(1, 3),
                x - 15, y + 20);
        });

        this.ctx.shadowBlur = 0;
    }

    drawCenter() {
        // Рисуем центр
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, 8, 0, 2 * Math.PI);
        this.ctx.fillStyle = 'rgba(212, 175, 55, 0.9)';
        this.ctx.shadowBlur = 15;
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, 4, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fill();

        this.ctx.shadowBlur = 0;
    }

    drawHouseNumbers() {
        this.ctx.font = 'bold 14px "Arial", sans-serif';
        this.ctx.fillStyle = 'rgba(212, 175, 55, 0.9)';
        this.ctx.shadowBlur = 5;

        for (let i = 1; i <= 12; i++) {
            // Каждый дом занимает 30°, ставим номер в середине дома
            const angle = ((i * 30 - 15 - 90) * Math.PI) / 180;
            const x = this.centerX + (this.radius - 25) * Math.cos(angle);
            const y = this.centerY + (this.radius - 25) * Math.sin(angle);

            this.ctx.fillText(i.toString(), x - 7, y - 7);
        }

        this.ctx.shadowBlur = 0;
    }
}