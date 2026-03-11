const axios = require('axios');

class NatalChartApiService {
    constructor() {
        // Бесплатный API для астрологических расчетов
        this.apiUrl = 'https://api.vedicastroapi.com/v3-json/'; // Можно заменить на другое
        // Или используем запасной вариант - local расчет
    }

    /**
     * Расчет натальной карты через API
     */
    async calculate(data) {
        try {
            const [day, month, year] = data.birthDate.split('.').map(Number);
            const [hour, minute] = data.birthTime.split(':').map(Number);

            // Формируем запрос к API
            const response = await axios.get(`${this.apiUrl}natal-chart`, {
                params: {
                    day,
                    month,
                    year,
                    hour,
                    min: minute,
                    lat: data.latitude,
                    lon: data.longitude,
                    tzone: 3, // часовой пояс
                    api_key: 'ваш_ключ' // если нужен ключ
                }
            });

            // Преобразуем ответ в формат для отрисовки
            return this.formatData(response.data);

        } catch (error) {
            console.error('API ошибка, использую fallback:', error);
            // Если API не работает, используем упрощенный локальный расчет
            return this.calculateLocal(data);
        }
    }

    /**
     * Упрощенный локальный расчет (запасной вариант)
     */
    calculateLocal(data) {
        const [day, month, year] = data.birthDate.split('.').map(Number);

        // Упрощенный алгоритм для демонстрации
        // В реальности используем библиотеку без компиляции
        const planets = this.calculatePlanetsSimple(year, month, day);
        const houses = this.calculateHousesSimple(data.latitude, data.longitude, planets);

        return {
            planets,
            houses,
            ascendant: this.calculateAscendant(planets)
        };
    }

    calculatePlanetsSimple(year, month, day) {
        // Упрощенный расчет (только для демонстрации)
        // Основан на приблизительных позициях
        const dayOfYear = this.getDayOfYear(year, month, day);

        return {
            sun: { sign: (dayOfYear / 30) % 12, degree: dayOfYear % 30 },
            moon: { sign: Math.floor(dayOfYear / 2.5) % 12, degree: (dayOfYear * 12) % 30 },
            mercury: { sign: (dayOfYear / 30 + 1) % 12, degree: (dayOfYear + 10) % 30 },
            venus: { sign: (dayOfYear / 30 + 2) % 12, degree: (dayOfYear + 20) % 30 },
            mars: { sign: (dayOfYear / 30 + 3) % 12, degree: (dayOfYear + 30) % 30 },
            jupiter: { sign: (dayOfYear / 30 + 4) % 12, degree: (dayOfYear + 40) % 30 },
            saturn: { sign: (dayOfYear / 30 + 5) % 12, degree: (dayOfYear + 50) % 30 }
        };
    }

    getDayOfYear(year, month, day) {
        return Math.floor((new Date(year, month - 1, day) - new Date(year, 0, 0)) / 86400000);
    }

    formatData(apiData) {
        // Преобразуем данные API в формат для отрисовки
        const points = [];
        const cusps = [];

        // Добавляем планеты
        const planetSymbols = {
            'Sun': '☉', 'Moon': '☽', 'Mercury': '☿', 'Venus': '♀',
            'Mars': '♂', 'Jupiter': '♃', 'Saturn': '♄', 'Uranus': '♅',
            'Neptune': '♆', 'Pluto': '♇'
        };

        if (apiData.planets) {
            Object.entries(apiData.planets).forEach(([name, data]) => {
                points.push({
                    name: planetSymbols[name] || name,
                    angle: data.longitude || data.position || 0
                });
            });
        }

        // Добавляем дома
        if (apiData.houses) {
            apiData.houses.forEach(house => {
                cusps.push({ angle: house.cusp || house.longitude || 0 });
            });
        }

        return { points, cusps };
    }
}

module.exports = NatalChartApiService;