const Astronomy = require('astronomy-engine');

class NatalChartSimpleService {
    calculate(data) {
        try {
            console.log('Расчет натальной карты для:', data);

            const [day, month, year] = data.birthDate.split('.').map(Number);
            const [hour, minute] = data.birthTime.split(':').map(Number);

            // Создаем дату в UTC
            const date = new Date(Date.UTC(year, month - 1, day, hour, minute));
            const time = new Astronomy.AstroTime(date);

            // Получаем позиции планет
            const planets = this.getPlanetPositions(time);

            // Рассчитываем асцендент (упрощенно через звездное время)
            const ascendant = this.calculateAscendant(time, data.latitude || 55.7558, data.longitude || 37.6173);

            // Рассчитываем дома (равнодомная система)
            const houses = this.calculateHouses(ascendant);

            // Формируем данные для отрисовки
            const chartData = this.formatForDraw(planets, houses);

            return {
                success: true,
                data: {
                    planets,
                    houses,
                    ascendant,
                    chartData
                }
            };
        } catch (error) {
            console.error('Ошибка в сервисе:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    getPlanetPositions(time) {
        const positions = {};

        try {
            // Наблюдатель в центре Земли (для геоцентрических координат)
            const observer = new Astronomy.Observer(0, 0, 0);

            // Солнце
            try {
                const sunVec = Astronomy.GeoVector(Astronomy.Body.Sun, time, true);
                const sunEqu = Astronomy.Equator(Astronomy.Body.Sun, time, observer, true, true);
                positions.sun = {
                    longitude: this.radiansToDegrees(sunEqu.ra),
                    latitude: this.radiansToDegrees(sunEqu.dec),
                    distance: sunVec
                };
                console.log('Солнце:', positions.sun.longitude.toFixed(2) + '°');
            } catch (e) {
                console.warn('Ошибка Солнца:', e.message);
            }

            // Луна
            try {
                const moonVec = Astronomy.GeoMoon(time);
                const moonEqu = Astronomy.Equator(Astronomy.Body.Moon, time, observer, true, true);
                positions.moon = {
                    longitude: this.radiansToDegrees(moonEqu.ra),
                    latitude: this.radiansToDegrees(moonEqu.dec),
                    distance: moonVec.Length()
                };
                console.log('Луна:', positions.moon.longitude.toFixed(2) + '°');
            } catch (e) {
                console.warn('Ошибка Луны:', e.message);
            }

            // Меркурий
            try {
                const mercVec = Astronomy.GeoVector(Astronomy.Body.Mercury, time, true);
                const mercEqu = Astronomy.Equator(Astronomy.Body.Mercury, time, observer, true, true);
                positions.mercury = {
                    longitude: this.radiansToDegrees(mercEqu.ra),
                    latitude: this.radiansToDegrees(mercEqu.dec),
                    distance: mercVec
                };
            } catch (e) {
                console.warn('Ошибка Меркурия:', e.message);
            }

            // Венера
            try {
                const venusVec = Astronomy.GeoVector(Astronomy.Body.Venus, time, true);
                const venusEqu = Astronomy.Equator(Astronomy.Body.Venus, time, observer, true, true);
                positions.venus = {
                    longitude: this.radiansToDegrees(venusEqu.ra),
                    latitude: this.radiansToDegrees(venusEqu.dec),
                    distance: venusVec
                };
            } catch (e) {
                console.warn('Ошибка Венеры:', e.message);
            }

            // Марс
            try {
                const marsVec = Astronomy.GeoVector(Astronomy.Body.Mars, time, true);
                const marsEqu = Astronomy.Equator(Astronomy.Body.Mars, time, observer, true, true);
                positions.mars = {
                    longitude: this.radiansToDegrees(marsEqu.ra),
                    latitude: this.radiansToDegrees(marsEqu.dec),
                    distance: marsVec
                };
            } catch (e) {
                console.warn('Ошибка Марса:', e.message);
            }

            // Юпитер
            try {
                const jupVec = Astronomy.GeoVector(Astronomy.Body.Jupiter, time, true);
                const jupEqu = Astronomy.Equator(Astronomy.Body.Jupiter, time, observer, true, true);
                positions.jupiter = {
                    longitude: this.radiansToDegrees(jupEqu.ra),
                    latitude: this.radiansToDegrees(jupEqu.dec),
                    distance: jupVec
                };
            } catch (e) {
                console.warn('Ошибка Юпитера:', e.message);
            }

            // Сатурн
            try {
                const satVec = Astronomy.GeoVector(Astronomy.Body.Saturn, time, true);
                const satEqu = Astronomy.Equator(Astronomy.Body.Saturn, time, observer, true, true);
                positions.saturn = {
                    longitude: this.radiansToDegrees(satEqu.ra),
                    latitude: this.radiansToDegrees(satEqu.dec),
                    distance: satVec
                };
            } catch (e) {
                console.warn('Ошибка Сатурна:', e.message);
            }

            // Уран (опционально)
            try {
                const uranusVec = Astronomy.GeoVector(Astronomy.Body.Uranus, time, true);
                const uranusEqu = Astronomy.Equator(Astronomy.Body.Uranus, time, observer, true, true);
                positions.uranus = {
                    longitude: this.radiansToDegrees(uranusEqu.ra),
                    latitude: this.radiansToDegrees(uranusEqu.dec),
                    distance: uranusVec
                };
            } catch (e) {
                console.warn('Ошибка Урана:', e.message);
            }

            // Нептун (опционально)
            try {
                const neptuneVec = Astronomy.GeoVector(Astronomy.Body.Neptune, time, true);
                const neptuneEqu = Astronomy.Equator(Astronomy.Body.Neptune, time, observer, true, true);
                positions.neptune = {
                    longitude: this.radiansToDegrees(neptuneEqu.ra),
                    latitude: this.radiansToDegrees(neptuneEqu.dec),
                    distance: neptuneVec
                };
            } catch (e) {
                console.warn('Ошибка Нептуна:', e.message);
            }

            // Плутон (опционально)
            try {
                const plutoVec = Astronomy.GeoVector(Astronomy.Body.Pluto, time, true);
                const plutoEqu = Astronomy.Equator(Astronomy.Body.Pluto, time, observer, true, true);
                positions.pluto = {
                    longitude: this.radiansToDegrees(plutoEqu.ra),
                    latitude: this.radiansToDegrees(plutoEqu.dec),
                    distance: plutoVec
                };
            } catch (e) {
                console.warn('Ошибка Плутона:', e.message);
            }

        } catch (error) {
            console.error('Общая ошибка при расчете планет:', error);
        }

        return positions;
    }

    calculateAscendant(time, lat, lon) {
        try {
            // Получаем звездное время
            const siderealTime = Astronomy.SiderealTime(time);

            // Упрощенный расчет асцендента
            // В реальности нужна более сложная формула, для демо используем приближение
            let ascendant = (siderealTime * 15 + lon) % 360; // Звездное время в часах * 15 = градусы

            // Корректировка на широту (упрощенно)
            ascendant += (lat / 90) * 15;

            return (ascendant + 360) % 360;
        } catch (e) {
            console.warn('Ошибка расчета асцендента:', e.message);
            // Запасной вариант
            const hour = time.date.getUTCHours();
            const minute = time.date.getUTCMinutes();
            const dayOfYear = this.getDayOfYear(time.date);
            return (dayOfYear / 365 * 360 + hour * 15 + minute * 0.25) % 360;
        }
    }

    calculateHouses(ascendant) {
        const houses = [];
        for (let i = 0; i < 12; i++) {
            houses.push({
                number: i + 1,
                cusp: (ascendant + i * 30) % 360
            });
        }
        return houses;
    }

    formatForDraw(planets, houses) {
        const points = [];
        const cusps = [];

        const symbols = {
            sun: '☉', moon: '☽', mercury: '☿', venus: '♀',
            mars: '♂', jupiter: '♃', saturn: '♄',
            uranus: '♅', neptune: '♆', pluto: '♇'
        };

        Object.entries(planets).forEach(([name, data]) => {
            if (data && data.longitude !== undefined) {
                points.push({
                    name: symbols[name] || name.substring(0, 2).toUpperCase(),
                    angle: data.longitude || 0
                });
            }
        });

        houses.forEach(house => {
            cusps.push({ angle: house.cusp });
        });

        return { points, cusps };
    }

    radiansToDegrees(radians) {
        // Если значение уже в градусах (большое число), возвращаем как есть
        if (Math.abs(radians) > 2 * Math.PI) {
            return radians % 360;
        }
        // Иначе конвертируем из радиан в градусы
        return (radians * 180 / Math.PI + 360) % 360;
    }

    getDayOfYear(date) {
        const start = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
        const diff = date - start;
        const oneDay = 1000 * 60 * 60 * 24;
        return Math.floor(diff / oneDay);
    }
}

module.exports = NatalChartSimpleService;