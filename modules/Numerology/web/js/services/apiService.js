// modules/Numerology/web/js/services/apiService.js
(function() {
    window.ApiService = {
        getHeaders: function() {
            const headers = { 'Content-Type': 'application/json' };
            const token = localStorage.getItem('token');
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            return headers;
        },

        async get(url) {
            const response = await fetch(url, { headers: this.getHeaders() });
            return response.json();
        },

        async post(url, data) {
            const response = await fetch(url, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(data)
            });
            return response;
        },

        async fetchProfile() {
            const response = await this.get('/api/profile');
            return response.data?.user || null;
        },

        async fetchTariffs() {
            const response = await this.get('/api/services?active=true');
            return response.data || [];
        },

        async fetchActiveSubscription() {
            const token = localStorage.getItem('token');
            if (!token) return null;
            const response = await this.get('/api/subscriptions/active');
            return response.data || null;
        },

        async calculate(endpoint, data) {
            return this.post(endpoint, data);
        },

        async downloadPDF(calculationId) {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/numerology/pdf/${calculationId}`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.blob();
        },

        /**
         * Скачать PDF для расчета по ID и типу
         * @param {string} calculationId - ID расчета
         * @param {string} type - тип расчета (day, week, month, year, compatibility, full)
         */
        async downloadPDFByType(calculationId, type = 'full') {
            const token = localStorage.getItem('token');
            let endpoint = `/api/numerology/pdf/${type}/${calculationId}`;

            // Для обратной совместимости
            if (type === 'full') {
                endpoint = `/api/numerology/pdf/${calculationId}`;
            }

            const response = await fetch(endpoint, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error(`Ошибка загрузки PDF: ${response.status}`);
            }

            return response.blob();
        }

    };
})();