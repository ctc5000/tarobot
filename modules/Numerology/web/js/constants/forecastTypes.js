// modules/Numerology/web/js/constants/forecastTypes.js
(function() {
    window.ForecastTypes = {
        forecast_basic: {
            icon: 'fas fa-star',
            name: 'Базовый расчет',
            description: 'Основные числа судьбы, свиток судьбы и глубинный портрет',
            features: ['Число судьбы, имени, рода', 'Ахиллесова пята', 'Число управления', 'Социальные оклики', 'Свиток судьбы', 'Глубинный портрет'],
            free: true,
            category: 'calculations'
        },
        forecast_day: {
            icon: 'fas fa-sun',
            name: 'Прогноз на день',
            description: 'Персональный прогноз на конкретный день',
            features: ['Число дня', 'Энергетика дня', 'Благоприятные направления', 'Совет на день'],
            category: 'calculations'
        },
        forecast_week: {
            icon: 'fas fa-calendar-week',
            name: 'Прогноз на неделю',
            description: 'Прогноз на предстоящую неделю',
            features: ['Разбор по дням', 'Ключевые события', 'Благоприятные дни', 'Советы на неделю'],
            category: 'calculations'
        },
        forecast_month: {
            icon: 'fas fa-calendar-alt',
            name: 'Прогноз на месяц',
            description: 'Прогноз на месяц вперед',
            features: ['Разбор по неделям', 'Важные даты', 'Тенденции месяца', 'Стратегия на месяц'],
            category: 'calculations'
        },
        forecast_year: {
            icon: 'fas fa-calendar',
            name: 'Прогноз на год',
            description: 'Годовой прогноз',
            features: ['Разбор по кварталам', 'Ключевые месяцы', 'Годовые тенденции', 'Стратегия на год'],
            category: 'calculations'
        },
        forecast_full: {
            icon: 'fas fa-crown',
            name: 'Полный расчет',
            description: 'Полный нумерологический анализ + все дополнительные разделы',
            features: ['Все из базового расчета', 'Гороскоп', 'Фен-шуй', 'Карты Таро', 'Психологический портрет', 'Паттерны личности', 'Карьерный анализ', 'Семейная гармония', 'Любовная совместимость', 'Финансовый поток', 'Энергия здоровья', 'Скрытые таланты'],
            category: 'calculations'
        },
        compatibility: {
            icon: 'fas fa-heart',
            name: 'Совместимость',
            description: 'Нумерологическая совместимость с партнером',
            features: ['Анализ пары', 'Сильные стороны союза', 'Зоны роста отношений', 'Общие цели'],
            category: 'calculations'
        },
        subscription_monthly: {
            icon: 'fas fa-gem',
            name: 'Подписка на месяц',
            description: 'Неограниченные прогнозы на день, неделю и месяц в течение 30 дней',
            features: ['Все прогнозы без ограничений', 'Экономия до 70%', 'Новые расчеты каждый день', 'Приоритетная поддержка'],
            category: 'subscriptions'
        },
        subscription_yearly: {
            icon: 'fas fa-crown',
            name: 'Подписка на год',
            description: 'Неограниченные прогнозы на день, неделю и месяц в течение 365 дней',
            features: ['Все прогнозы без ограничений', 'Максимальная выгода', 'Экономия более 80%', 'VIP поддержка'],
            category: 'subscriptions'
        }
    };
})();