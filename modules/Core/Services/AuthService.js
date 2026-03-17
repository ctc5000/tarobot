// modules/Core/Services/AuthService.js
const { models } = require('../../../sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

class AuthService {
    constructor() {
        this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
        this.jwtExpiresIn = '7d';
        this.saltRounds = 10;
    }

    /**
     * Регистрация нового пользователя
     */
    async register(userData) {
        const { email, password, fullName, birthDate, phone } = userData;

        // Проверяем, существует ли пользователь
        const existingUser = await models.User.findOne({
            where: { email }
        });

        if (existingUser) {
            throw new Error('Пользователь с таким email уже существует');
        }

        // Хешируем пароль
        const hashedPassword = await bcrypt.hash(password, this.saltRounds);

        // Создаем пользователя
        const user = await models.User.create({
            email,
            password: hashedPassword,
            fullName,
            birthDate,
            phone: phone || null,
            emailVerificationToken: crypto.randomBytes(32).toString('hex')
        });

        // Удаляем пароль из объекта перед возвратом
        const userResponse = user.toJSON();
        delete userResponse.password;
        delete userResponse.emailVerificationToken;
        delete userResponse.passwordResetToken;
        delete userResponse.passwordResetExpires;

        return {
            user: userResponse,
            message: 'Регистрация успешна. Проверьте email для подтверждения.'
        };
    }

    /**
     * Вход пользователя
     */
    async login(email, password) {
        // Ищем пользователя
        const user = await models.User.findOne({
            where: { email }
        });

        if (!user) {
            throw new Error('Неверный email или пароль');
        }

        // Проверяем пароль
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new Error('Неверный email или пароль');
        }

        // Проверяем, активен ли пользователь
        if (!user.isActive) {
            throw new Error('Пользователь заблокирован');
        }

        // Обновляем время последнего входа
        await user.update({ lastLogin: new Date() });

        // Создаем JWT токен
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                role: user.role
            },
            this.jwtSecret,
            { expiresIn: this.jwtExpiresIn }
        );

        // Удаляем пароль из объекта перед возвратом
        const userResponse = user.toJSON();
        delete userResponse.password;
        delete userResponse.emailVerificationToken;
        delete userResponse.passwordResetToken;
        delete userResponse.passwordResetExpires;

        return {
            user: userResponse,
            token
        };
    }

    /**
     * Вход через Telegram
     */
    async telegramLogin(telegramId, telegramUsername, userData = {}) {
        let user = await models.User.findOne({
            where: { telegramId }
        });

        if (!user) {
            // Если пользователь не найден, создаем нового
            user = await models.User.create({
                telegramId,
                telegramUsername,
                fullName: userData.fullName || `Telegram User ${telegramId}`,
                email: userData.email || `telegram_${telegramId}@temp.local`,
                birthDate: userData.birthDate || '2000-01-01',
                password: await bcrypt.hash(crypto.randomBytes(16).toString('hex'), this.saltRounds),
                emailVerified: true
            });
        }

        // Обновляем время последнего входа
        await user.update({ lastLogin: new Date() });

        // Создаем JWT токен
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                role: user.role
            },
            this.jwtSecret,
            { expiresIn: this.jwtExpiresIn }
        );

        const userResponse = user.toJSON();
        delete userResponse.password;

        return {
            user: userResponse,
            token
        };
    }

    /**
     * Подтверждение email
     */
    async verifyEmail(token) {
        const user = await models.User.findOne({
            where: { emailVerificationToken: token }
        });

        if (!user) {
            throw new Error('Неверный или истекший токен');
        }

        await user.update({
            emailVerified: true,
            emailVerificationToken: null
        });

        return { message: 'Email успешно подтвержден' };
    }

    /**
     * Запрос на сброс пароля
     */
    async requestPasswordReset(email) {
        const user = await models.User.findOne({
            where: { email }
        });

        if (!user) {
            // Не сообщаем, что пользователь не найден (безопасность)
            return { message: 'Если пользователь существует, инструкции отправлены на email' };
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetExpires = new Date(Date.now() + 3600000); // 1 час

        await user.update({
            passwordResetToken: resetToken,
            passwordResetExpires: resetExpires
        });

        // Здесь должен быть код отправки email

        return { message: 'Если пользователь существует, инструкции отправлены на email' };
    }

    /**
     * Сброс пароля
     */
    async resetPassword(token, newPassword) {
        const user = await models.User.findOne({
            where: {
                passwordResetToken: token,
                passwordResetExpires: { [models.Sequelize.Op.gt]: new Date() }
            }
        });

        if (!user) {
            throw new Error('Неверный или истекший токен');
        }

        const hashedPassword = await bcrypt.hash(newPassword, this.saltRounds);

        await user.update({
            password: hashedPassword,
            passwordResetToken: null,
            passwordResetExpires: null
        });

        return { message: 'Пароль успешно изменен' };
    }

    /**
     * Смена пароля (для авторизованного пользователя)
     */
    async changePassword(userId, oldPassword, newPassword) {
        const user = await models.User.findByPk(userId);

        if (!user) {
            throw new Error('Пользователь не найден');
        }

        const isValidPassword = await bcrypt.compare(oldPassword, user.password);
        if (!isValidPassword) {
            throw new Error('Неверный текущий пароль');
        }

        const hashedPassword = await bcrypt.hash(newPassword, this.saltRounds);

        await user.update({ password: hashedPassword });

        return { message: 'Пароль успешно изменен' };
    }

    /**
     * Проверка JWT токена
     */
    verifyToken(token) {
        try {
            const decoded = jwt.verify(token, this.jwtSecret);
            return { valid: true, decoded };
        } catch (error) {
            return { valid: false, error: error.message };
        }
    }

    /**
     * Получение пользователя по токену
     */
    async getUserFromToken(token) {
        try {
            const decoded = jwt.verify(token, this.jwtSecret);
            const user = await models.User.findByPk(decoded.userId);

            if (!user || !user.isActive) {
                return null;
            }

            const userResponse = user.toJSON();
            delete userResponse.password;

            return userResponse;
        } catch (error) {
            return null;
        }
    }
}

module.exports = AuthService;