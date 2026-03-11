const Astronomy = require('astronomy-engine');

class NatalChartSimpleService {
    calculate(data) {
        const [day, month, year] = data.birthDate.split('.').map(Number);
        const [hour, minute] = data.birthTime.split(':').map(Number);

        // Создаем дату
        const date = new Date(Date.UTC(year, month - 1, day, hour, minute));

        // Получаем позиции планет
        const planets = this.getPlanetPositions(date);

        // Рассчитываем дома (упрощенно)
        const houses = this.calculateHouses(planets, data.latitude, data.longitude, date);

        // Формируем данные для отрисовки
        const chartData = this.formatForAstrochart(planets, houses);

        return {
            planets,
            houses,
            chartData
        };
    }

    getPlanetPositions(date) {
        const positions = {};

        // Солнце
        const sun = Astronomy.SunPosition(date);
        positions.sun = {
            longitude: sun.elon, // эклиптическая долгота
            latitude: sun.elat,
            distance: sun.vec?.Length() || 0
        };

        // Луна
        const moon = Astronomy.GeoMoon(date);
        positions.moon = {
            longitude: Astronomy.ECLIPTIC_LONGITUDE(moon),
            latitude: Astronomy.ECLIPTIC_LATITUDE(moon),
            distance: moon.Length()
        };

        // Меркурий
        const mercury = Astronomy.HelioEarthPlanet(Astronomy.Planet.Mercury, date);
        positions.mercury = {
            longitude: mercury.elon,
            latitude: mercury.elat
        };

        // Венера
        const venus = Astronomy.HelioEarthPlanet(Astronomy.Planet.Venus, date);
        positions.venus = {
            longitude: venus.elon,
            latitude: venus.elat
        };

        // Марс
        const mars = Astronomy.HelioEarthPlanet(Astronomy.Planet.Mars, date);
        positions.mars = {
            longitude: mars.elon,
            latitude: mars.elat
        };

        // Юпитер
        const jupiter = Astronomy.HelioEarthPlanet(Astronomy.Planet.Jupiter, date);
        positions.jupiter = {
            longitude: jupiter.elon,
            latitude: jupiter.elat
        };

        // Сатурн
        const saturn = Astronomy.HelioEarthPlanet(Astronomy.Planet.Saturn, date);
        positions.saturn = {
            longitude: saturn.elon,
            latitude: saturn.elat
        };

        return positions;
    }

    calculateHouses(planets, lat, lon, date) {
        const houses = [];

        // Упрощенный расчет домов (равнодомная система)
        const ascendant = planets.sun.longitude; // упрощенно

        for (let i = 0; i < 12; i++) {
            houses.push({
                number: i + 1,
                cusp: (ascendant + i * 30) % 360
            });
        }

        return houses;
    }

    formatForAstrochart(planets, houses) {
        const points = [];
        const cusps = [];

        const symbols = {
            sun: '☉', moon: '☽', mercury: '☿', venus: '♀',
            mars: '♂', jupiter: '♃', saturn: '♄'
        };

        Object.entries(planets).forEach(([name, data]) => {
            points.push({
                name: symbols[name] || name,
                angle: data.longitude || 0
            });
        });

        houses.forEach(house => {
            cusps.push({ angle: house.cusp });
        });

        return { points, cusps };
    }
}

module.exports = NatalChartSimpleService;