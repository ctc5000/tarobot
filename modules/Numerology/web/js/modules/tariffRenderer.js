// modules/Numerology/web/js/modules/tariffRenderer.js
(function() {
    window.TariffRenderer = {
        renderTariffs: function(tariffs, user, activeSubscription, selectedTariff) {
            const calculations = [];
            const subscriptions = [];

            tariffs.forEach(tariff => {
                if (tariff.section != "numerology") return;
                if (user && tariff.code == "forecast_basic") return;

                const typeInfo = window.ForecastTypes[tariff.code] || {
                    icon: 'fas fa-calculator',
                    name: tariff.name,
                    description: tariff.description,
                    features: ['Все основные расчеты'],
                    category: tariff.code.includes('subscription') ? 'subscriptions' : 'calculations'
                };

                let price = tariff.price;
                let oldPrice = null;
                let discountText = null;
                let isFreeForSubscribers = false;

                if (activeSubscription && tariff.code !== 'forecast_basic') {
                    if (['forecast_day', 'forecast_week', 'forecast_month'].includes(tariff.code)) {
                        price = 0;
                        isFreeForSubscribers = true;
                        discountText = 'Бесплатно по подписке';
                    } else if (['forecast_year', 'forecast_full', 'compatibility'].includes(tariff.code)) {
                        oldPrice = price;
                        price = Math.round(price * 0.5);
                        discountText = '50% по подписке';
                    }
                }

                let cardClass = 'tariff-card';
                let clickHandler = `numerologyApp.selectTariff('${tariff.code}')`;
                let isLocked = false;

                if (!user) {
                    if (tariff.code === 'forecast_basic') {
                        cardClass += ' free';
                    } else {
                        cardClass += ' locked';
                        isLocked = true;
                        clickHandler = `numerologyApp.showAuthModal()`;
                    }
                } else {
                    if (tariff.code === 'forecast_basic') return;
                    if (activeSubscription && (price === 0 || discountText)) {
                        cardClass += ' subscription';
                    }
                }

                if (selectedTariff?.id === tariff.id) cardClass += ' selected';

                let priceHtml = '';
                if (price === 0 && isFreeForSubscribers) {
                    priceHtml = '<span class="price-free">Бесплатно</span> <span class="discount-badge">По подписке</span>';
                } else if (price === 0) {
                    priceHtml = '<span class="price-free">Бесплатно</span>';
                } else {
                    priceHtml = `<span class="price-current">${price} ₽</span>`;
                    if (oldPrice) priceHtml += `<span class="price-old">${oldPrice} ₽</span>`;
                    if (discountText && !isFreeForSubscribers) {
                        priceHtml += `<span class="discount-badge">${discountText}</span>`;
                    }
                }

                const tariffHtml = `
                <div class="${cardClass}" onclick="${clickHandler}" data-category="${typeInfo.category}">
                    ${tariff.code === 'forecast_full' && !activeSubscription && !isLocked ? '<span class="popular-badge">Популярное</span>' : ''}
                    ${isLocked ? '<div class="lock-overlay-small"><i class="fas fa-lock"></i></div>' : ''}
                    <div class="tariff-icon"><i class="${typeInfo.icon}"></i></div>
                    <h3 class="tariff-name">${typeInfo.name}</h3>
                    <p class="tariff-description">${typeInfo.description}</p>
                    <div class="tariff-price">${priceHtml}</div>
                  <button class="btn-preview" onclick="event.stopPropagation(); numerologyApp.showPreview('${tariff.code}')">
    <i class="fas fa-eye"></i> Предпросмотр
</button>
                    <ul class="tariff-features">
                        ${typeInfo.features ? typeInfo.features.map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('') : '<li>Все основные расчеты</li>'}
                    </ul>
                    <button class="btn-select ${isLocked ? 'locked' : ''}">
                        ${isLocked ? 'Войти и выбрать' : 'Выбрать'}
                    </button>
                </div>`;

                if (typeInfo.category === 'subscriptions') {
                    subscriptions.push(tariffHtml);
                } else {
                    calculations.push(tariffHtml);
                }
            });

            let finalHtml = '';
            if (calculations.length > 0) {
                finalHtml += `<div class="tariff-category"><h2 class="category-title">РАСЧЕТЫ</h2><div class="tariff-grid">${calculations.join('')}</div></div>`;
            }
            if (subscriptions.length > 0) {
                finalHtml += `<div class="tariff-category subscriptions-category"><h2 class="category-title">ПОДПИСКИ</h2><div class="tariff-grid">${subscriptions.join('')}</div></div>`;
            }
            return finalHtml;
        }
    };
})();