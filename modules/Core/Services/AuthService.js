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

        // Отправка email с инструкциями
        try {
            await this.sendPasswordResetEmail(user.email, resetToken, user.fullName);
        } catch (error) {
            console.error('Ошибка отправки email:', error);
            // Логируем ошибку, но пользователю не сообщаем (безопасность)
        }

        return { message: 'Если пользователь существует, инструкции отправлены на email' };
    }

// Метод для отправки email с восстановлением пароля
    async sendPasswordResetEmail(email, token, userName) {
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

        // Создаем транспорт для отправки писем
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: process.env.SMTP_PORT || 587,
            secure: false, // true для 465, false для других портов
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            },
            tls: {
                rejectUnauthorized: false // Для некоторых почтовых сервисов
            }
        });

        // HTML шаблон письма
        const htmlTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Восстановление пароля</title>
            <style>
                body {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                    background-color: #0a0a0f;
                    margin: 0;
                    padding: 0;
                    color: #ffffff;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .header {
                    text-align: center;
                    padding: 30px 0;
                    border-bottom: 1px solid rgba(201, 165, 75, 0.3);
                }
                .logo {
                    font-size: 2rem;
                    color: #c9a54b;
                    margin-bottom: 10px;
                }
                .logo-text {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.5rem;
                    font-weight: 600;
                    background: linear-gradient(135deg, #ffffff, #c9a54b);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                .content {
                    background: linear-gradient(135deg, #12121a, #0a0a0f);
                    border: 1px solid rgba(201, 165, 75, 0.2);
                    border-radius: 30px;
                    padding: 40px;
                    margin: 30px 0;
                    text-align: center;
                }
                .greeting {
                    font-size: 1.5rem;
                    color: #c9a54b;
                    margin-bottom: 20px;
                    font-family: 'Playfair Display', serif;
                }
                .message {
                    color: #a0a0b0;
                    line-height: 1.8;
                    margin-bottom: 30px;
                    font-size: 1rem;
                }
                .button {
                    display: inline-block;
                    padding: 16px 32px;
                    background: linear-gradient(135deg, #c9a54b, #e2b96b);
                    color: #0a0a0f;
                    text-decoration: none;
                    border-radius: 50px;
                    font-weight: 600;
                    font-size: 1rem;
                    letter-spacing: 1px;
                    margin: 20px 0;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                .button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 30px rgba(201, 165, 75, 0.3);
                }
                .link-fallback {
                    background: rgba(18, 18, 26, 0.5);
                    border: 1px solid rgba(201, 165, 75, 0.2);
                    border-radius: 12px;
                    padding: 15px;
                    margin: 20px 0;
                    word-break: break-all;
                    color: #c9a54b;
                    font-size: 0.9rem;
                }
                .warning {
                    background: rgba(255, 152, 0, 0.1);
                    border: 1px solid rgba(255, 152, 0, 0.3);
                    border-radius: 12px;
                    padding: 15px;
                    margin: 20px 0;
                    color: #ff9800;
                    font-size: 0.9rem;
                }
                .footer {
                    text-align: center;
                    padding: 20px;
                    color: #6a6a7a;
                    font-size: 0.85rem;
                    border-top: 1px solid rgba(201, 165, 75, 0.2);
                }
                .social-links {
                    margin-top: 15px;
                }
                .social-links a {
                    display: inline-block;
                    margin: 0 10px;
                    color: #6a6a7a;
                    text-decoration: none;
                    transition: color 0.3s ease;
                }
                .social-links a:hover {
                    color: #c9a54b;
                }
            </style>
        
<!-- Yandex.Metrika counter -->
<script type="text/javascript">
    (function(m,e,t,r,i,k,a){
        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
    })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=107722589', 'ym');

    ym(107722589, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
</script>
<noscript><div><img src="https://mc.yandex.ru/watch/107722589" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
<!-- /Yandex.Metrika counter -->
</head>


        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">✦</div>
                    <div class="logo-text">АЛГОРИТМ СУДЬБЫ</div>
                </div>
                
                <div class="content">
                    <div class="greeting">Здравствуйте, ${userName}!</div>
                    
                    <div class="message">
                        Вы запросили восстановление пароля для вашего аккаунта.<br>
                        Для создания нового пароля нажмите на кнопку ниже:
                    </div>
                    
                    <a href="${resetLink}" class="button">ВОССТАНОВИТЬ ПАРОЛЬ</a>
                    
                    <div class="message">
                        Если кнопка не работает, скопируйте и вставьте следующую ссылку в адресную строку браузера:
                    </div>
                    
                    <div class="link-fallback">
                        ${resetLink}
                    </div>
                    
                    <div class="warning">
                        ⚠️ Ссылка действительна в течение 1 часа.<br>
                        Если вы не запрашивали восстановление пароля, просто проигнорируйте это письмо.
                    </div>
                </div>
                
                <div class="footer">
                    <p>© 2026 АЛГОРИТМ СУДЬБЫ. Все права защищены.</p>
                    <p>Это автоматическое письмо, пожалуйста, не отвечайте на него.</p>
                    
                    <div class="social-links">
                        <a href="#"><i class="fab fa-telegram"></i></a>
                        <a href="#"><i class="fab fa-vk"></i></a>
                        <a href="#"><i class="fab fa-youtube"></i></a>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;

        // Текстовая версия письма (для почтовых клиентов без HTML)
        const textTemplate = `
        АЛГОРИТМ СУДЬБЫ - Восстановление пароля
        
        Здравствуйте, ${userName}!
        
        Вы запросили восстановление пароля для вашего аккаунта.
        
        Для создания нового пароля перейдите по ссылке:
        ${resetLink}
        
        Ссылка действительна в течение 1 часа.
        
        Если вы не запрашивали восстановление пароля, просто проигнорируйте это письмо.
        
        © 2026 АЛГОРИТМ СУДЬБЫ
    `;

        // Настройки письма
        const mailOptions = {
            from: `"АЛГОРИТМ СУДЬБЫ" <${process.env.SMTP_FROM || 'noreply@algoritmsudby.ru'}>`,
            to: email,
            subject: 'Восстановление пароля | АЛГОРИТМ СУДЬБЫ',
            html: htmlTemplate,
            text: textTemplate
        };

        // Отправка письма
        return await transporter.sendMail(mailOptions);
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