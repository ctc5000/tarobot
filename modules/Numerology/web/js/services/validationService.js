// modules/Numerology/web/js/services/validationService.js
(function() {
    window.ValidationService = {
        validateFullName: function(fullName) {
            if (!fullName) {
                return { valid: false, error: 'Введите ФИО' };
            }
            const nameParts = fullName.trim().split(/\s+/);
            if (nameParts.length < 3) {
                return { valid: false, error: 'Введите полное ФИО (фамилия, имя, отчество)' };
            }
            return { valid: true };
        },

        isValidDate: function(dateStr) {
            if (!dateStr) return false;
            const pattern = /^\d{2}\.\d{2}\.\d{4}$/;
            if (!pattern.test(dateStr)) return false;

            const [day, month, year] = dateStr.split('.').map(Number);
            if (month < 1 || month > 12) return false;
            if (day < 1 || day > 31) return false;

            const daysInMonth = new Date(year, month, 0).getDate();
            return day <= daysInMonth;
        },

        validateBirthDate: function(birthDate) {
            if (!birthDate) {
                return { valid: false, error: 'Введите дату рождения' };
            }
            if (!this.isValidDate(birthDate)) {
                return { valid: false, error: 'Введите дату в формате ДД.ММ.ГГГГ' };
            }
            return { valid: true };
        },

        validatePartner: function(partnerName, partnerBirthDate) {
            if (!partnerName || !partnerBirthDate) {
                return { valid: false, error: 'Заполните данные партнера' };
            }
            if (!this.isValidDate(partnerBirthDate)) {
                return { valid: false, error: 'Введите дату рождения партнера в формате ДД.ММ.ГГГГ' };
            }
            return { valid: true };
        },

        validateTargetDate: function(targetDate) {
            if (!targetDate) {
                return { valid: false, error: 'Укажите дату прогноза' };
            }
            if (!this.isValidDate(targetDate)) {
                return { valid: false, error: 'Введите дату в формате ДД.ММ.ГГГГ' };
            }
            return { valid: true };
        }
    };
})();