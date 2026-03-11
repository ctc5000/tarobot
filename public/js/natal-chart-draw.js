class NatalChartDraw {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error('Canvas not found:', canvasId);
            return;
        }
        this.ctx = this.canvas.getContext('2d');

        // Определяем размер в зависимости от экрана
        this.updateDimensions();

        // Цвета для аспектов
        this.aspectColors = {
            conjunction: '#ff4d4d',
            opposition: '#4d4dff',
            trine: '#4dff4d',
            square: '#ff4dff',
            sextile: '#ffff4d'
        };

        window.addEventListener('resize', () => this.updateDimensions());
    }

    updateDimensions() {
        const container = this.canvas.parentElement;
        const containerWidth = container?.clientWidth || 400;

        // На мобильных делаем компактнее
        if (containerWidth < 500) {
            this.width = 350;
            this.height = 350;
            this.centerX = 175;
            this.centerY = 175;
            this.outerRadius = 140;
            this.signRadius = 125;
            this.houseRadius = 115;
            this.planetRadius = 95;
            this.innerRadius = 35;
        } else {
            this.width = 700;
            this.height = 700;
            this.centerX = 350;
            this.centerY = 350;
            this.outerRadius = 280;
            this.signRadius = 245;
            this.houseRadius = 225;
            this.planetRadius = 190;
            this.innerRadius = 70;
        }

        this.setCanvasSize();
    }

    setCanvasSize() {
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = this.width * dpr;
        this.canvas.height = this.height * dpr;
        this.canvas.style.width = this.width + 'px';
        this.canvas.style.height = this.height + 'px';
        this.ctx.scale(dpr, dpr);

        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
    }

    draw(data) {
        if (!this.ctx) return;

        this.ctx.clearRect(0, 0, this.width, this.height);

        this.drawBackground();

        if (data.houses) {
            this.drawHouses(data.houses);
        }

        this.drawSigns();

        if (data.aspects && data.planets) {
            this.drawAspects(data.aspects, data.planets);
        }

        if (data.planets) {
            this.drawPlanets(data.planets);
        }

        this.drawCenter();
    }

    drawBackground() {
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.outerRadius, 0, 2 * Math.PI);
        this.ctx.strokeStyle = '#c9a54b';
        this.ctx.lineWidth = this.width < 500 ? 1 : 1.5;
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.innerRadius, 0, 2 * Math.PI);
        this.ctx.strokeStyle = 'rgba(201, 165, 75, 0.5)';
        this.ctx.lineWidth = this.width < 500 ? 0.5 : 1;
        this.ctx.stroke();

        [this.planetRadius, this.houseRadius, this.signRadius].forEach(radius => {
            this.ctx.beginPath();
            this.ctx.arc(this.centerX, this.centerY, radius, 0, 2 * Math.PI);
            this.ctx.strokeStyle = 'rgba(201, 165, 75, 0.2)';
            this.ctx.lineWidth = 0.5;
            this.ctx.stroke();
        });
    }

    drawHouses(houses) {
        this.ctx.strokeStyle = '#c9a54b';
        this.ctx.lineWidth = this.width < 500 ? 0.8 : 1;

        houses.forEach((house) => {
            const angle = ((house.cusp - 90) * Math.PI) / 180;

            const x1 = this.centerX + this.innerRadius * Math.cos(angle);
            const y1 = this.centerY + this.innerRadius * Math.sin(angle);
            const x2 = this.centerX + this.outerRadius * Math.cos(angle);
            const y2 = this.centerY + this.outerRadius * Math.sin(angle);

            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();

            // Номер дома
            const labelX = this.centerX + (this.outerRadius - (this.width < 500 ? 15 : 25)) * Math.cos(angle);
            const labelY = this.centerY + (this.outerRadius - (this.width < 500 ? 15 : 25)) * Math.sin(angle);

            this.ctx.fillStyle = '#c9a54b';
            this.ctx.font = this.width < 500 ? 'bold 8px "Inter"' : 'bold 11px "Inter"';
            this.ctx.fillText(house.number.toString(), labelX - 4, labelY - 4);
        });
    }

    drawSigns() {
        const signs = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

        this.ctx.fillStyle = '#c9a54b';
        this.ctx.font = this.width < 500 ? 'bold 12px "Arial"' : 'bold 18px "Arial"';

        for (let i = 0; i < 12; i++) {
            const angle = ((i * 30 + 15 - 90) * Math.PI) / 180;
            const x = this.centerX + (this.outerRadius + (this.width < 500 ? 10 : 20)) * Math.cos(angle);
            const y = this.centerY + (this.outerRadius + (this.width < 500 ? 10 : 20)) * Math.sin(angle);

            this.ctx.fillText(signs[i], x - 6, y - 6);
        }
    }

    drawAspects(aspects, planets) {
        if (!aspects || aspects.length === 0) return;

        const positions = {};
        Object.entries(planets).forEach(([key, planet]) => {
            const angle = ((planet.longitude - 90) * Math.PI) / 180;
            positions[key] = {
                x: this.centerX + this.planetRadius * Math.cos(angle),
                y: this.centerY + this.planetRadius * Math.sin(angle)
            };
        });

        aspects.forEach(aspect => {
            const p1 = this.getPlanetKey(aspect.planet1);
            const p2 = this.getPlanetKey(aspect.planet2);

            if (positions[p1] && positions[p2]) {
                this.ctx.beginPath();
                this.ctx.moveTo(positions[p1].x, positions[p1].y);
                this.ctx.lineTo(positions[p2].x, positions[p2].y);
                this.ctx.strokeStyle = this.aspectColors[aspect.type] || '#ffffff';
                this.ctx.lineWidth = aspect.type === 'conjunction' ? 1.5 : 1;

                if (aspect.type === 'opposition') {
                    this.ctx.setLineDash([4, 3]);
                } else {
                    this.ctx.setLineDash([]);
                }

                this.ctx.stroke();
                this.ctx.setLineDash([]);
            }
        });
    }

    getPlanetKey(name) {
        const map = {
            'Солнце': 'sun',
            'Луна': 'moon',
            'Меркурий': 'mercury',
            'Венера': 'venus',
            'Марс': 'mars',
            'Юпитер': 'jupiter',
            'Сатурн': 'saturn'
        };
        return map[name] || name.toLowerCase();
    }

    drawPlanets(planets) {
        const symbols = {
            sun: '☉', moon: '☽', mercury: '☿', venus: '♀',
            mars: '♂', jupiter: '♃', saturn: '♄'
        };

        Object.entries(planets).forEach(([key, planet]) => {
            const angle = ((planet.longitude - 90) * Math.PI) / 180;
            const x = this.centerX + this.planetRadius * Math.cos(angle);
            const y = this.centerY + this.planetRadius * Math.sin(angle);

            // Кружок под планетой
            this.ctx.beginPath();
            this.ctx.arc(x, y, this.width < 500 ? 6 : 9, 0, 2 * Math.PI);
            this.ctx.fillStyle = 'rgba(18, 18, 26, 0.8)';
            this.ctx.fill();
            this.ctx.strokeStyle = '#c9a54b';
            this.ctx.lineWidth = 0.5;
            this.ctx.stroke();

            // Символ планеты
            this.ctx.fillStyle = '#c9a54b';
            this.ctx.font = this.width < 500 ? 'bold 10px "Arial"' : 'bold 16px "Arial"';
            this.ctx.fillText(symbols[key] || '●', x - (this.width < 500 ? 5 : 8), y - (this.width < 500 ? 5 : 8));
        });
    }

    drawCenter() {
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.width < 500 ? 5 : 7, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#c9a54b';
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.width < 500 ? 2 : 3, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fill();
    }
}