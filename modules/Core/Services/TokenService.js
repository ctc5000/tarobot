// modules/Core/Services/TokenService.js
const jwt = require('jsonwebtoken');
const { models } = require('../../../sequelize');

class TokenService {
    constructor() {
        this.accessTokenSecret = process.env.JWT_SECRET || 'your-secret-key';
        this.refreshTokenSecret = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
        this.accessTokenExpiresIn = '15m';
        this.refreshTokenExpiresIn = '7d';
    }

    /**
     * Создание access токена
     */
    generateAccessToken(user) {
        return jwt.sign(
            {
                userId: user.id,
                email: user.email,
                role: user.role
            },
            this.accessTokenSecret,
            { expiresIn: this.accessTokenExpiresIn }
        );
    }

    /**
     * Создание refresh токена
     */
    generateRefreshToken(user) {
        return jwt.sign(
            {
                userId: user.id,
                tokenType: 'refresh'
            },
            this.refreshTokenSecret,
            { expiresIn: this.refreshTokenExpiresIn }
        );
    }

    /**
     * Создание пары токенов
     */
    generateTokenPair(user) {
        return {
            accessToken: this.generateAccessToken(user),
            refreshToken: this.generateRefreshToken(user),
            expiresIn: this.accessTokenExpiresIn
        };
    }

    /**
     * Проверка access токена
     */
    verifyAccessToken(token) {
        try {
            const decoded = jwt.verify(token, this.accessTokenSecret);
            return { valid: true, decoded };
        } catch (error) {
            return { valid: false, error: error.message };
        }
    }

    /**
     * Проверка refresh токена
     */
    verifyRefreshToken(token) {
        try {
            const decoded = jwt.verify(token, this.refreshTokenSecret);
            return { valid: true, decoded };
        } catch (error) {
            return { valid: false, error: error.message };
        }
    }

    /**
     * Обновление access токена по refresh токену
     */
    async refreshAccessToken(refreshToken) {
        const verification = this.verifyRefreshToken(refreshToken);

        if (!verification.valid) {
            throw new Error('Invalid refresh token');
        }

        const user = await models.User.findByPk(verification.decoded.userId);

        if (!user || !user.isActive) {
            throw new Error('User not found or inactive');
        }

        return {
            accessToken: this.generateAccessToken(user),
            expiresIn: this.accessTokenExpiresIn
        };
    }

    /**
     * Извлечение токена из заголовка Authorization
     */
    extractTokenFromHeader(authHeader) {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null;
        }

        return authHeader.substring(7);
    }

    /**
     * Получение пользователя из токена
     */
    async getUserFromToken(token) {
        const verification = this.verifyAccessToken(token);

        if (!verification.valid) {
            return null;
        }

        const user = await models.User.findByPk(verification.decoded.userId);

        if (!user || !user.isActive) {
            return null;
        }

        const userResponse = user.toJSON();
        delete userResponse.password;

        return userResponse;
    }

    /**
     * Middleware для проверки авторизации
     */
    authMiddleware(requiredRole = null) {
        return async (req, res, next) => {
            try {
                const authHeader = req.headers.authorization;
                const token = this.extractTokenFromHeader(authHeader);

                if (!token) {
                    return res.status(401).json({
                        success: false,
                        error: 'No token provided'
                    });
                }

                const verification = this.verifyAccessToken(token);

                if (!verification.valid) {
                    return res.status(401).json({
                        success: false,
                        error: 'Invalid or expired token'
                    });
                }

                const user = await models.User.findByPk(verification.decoded.userId);

                if (!user || !user.isActive) {
                    return res.status(401).json({
                        success: false,
                        error: 'User not found or inactive'
                    });
                }

                // Проверка роли
                if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
                    return res.status(403).json({
                        success: false,
                        error: 'Insufficient permissions'
                    });
                }

                req.user = user;
                next();

            } catch (error) {
                return res.status(500).json({
                    success: false,
                    error: error.message
                });
            }
        };
    }
}

module.exports = TokenService;