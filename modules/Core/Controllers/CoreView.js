// modules/Core/Controllers/CoreView.js
const AuthService = require('../Services/AuthService');
const BalanceService = require('../Services/BalanceService');
const TokenService = require('../Services/TokenService');
const { models } = require('../../../sequelize');

const authService = new AuthService();
const balanceService = new BalanceService();
const tokenService = new TokenService();

// ========== АВТОРИЗАЦИЯ ==========

async function register(req, res) {
    try {
        const result = await authService.register(req.body);
        res.status(201).json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Error in register:', error);
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required'
            });
        }

        const result = await authService.login(email, password);
        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Error in login:', error);
        res.status(401).json({
            success: false,
            error: error.message
        });
    }
}

async function telegramLogin(req, res) {
    try {
        const { telegramId, telegramUsername, ...userData } = req.body;

        if (!telegramId) {
            return res.status(400).json({
                success: false,
                error: 'telegramId is required'
            });
        }

        const result = await authService.telegramLogin(telegramId, telegramUsername, userData);
        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Error in telegramLogin:', error);
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
}

async function refreshToken(req, res) {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                error: 'refreshToken is required'
            });
        }

        const result = await tokenService.refreshAccessToken(refreshToken);
        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Error in refreshToken:', error);
        res.status(401).json({
            success: false,
            error: error.message
        });
    }
}

async function verifyEmail(req, res) {
    try {
        const { token } = req.params;

        if (!token) {
            return res.status(400).json({
                success: false,
                error: 'Token is required'
            });
        }

        const result = await authService.verifyEmail(token);
        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Error in verifyEmail:', error);
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
}

async function requestPasswordReset(req, res) {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                error: 'Email is required'
            });
        }

        const result = await authService.requestPasswordReset(email);
        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Error in requestPasswordReset:', error);
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
}

async function resetPassword(req, res) {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({
                success: false,
                error: 'Token and newPassword are required'
            });
        }

        const result = await authService.resetPassword(token, newPassword);
        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Error in resetPassword:', error);
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
}

async function changePassword(req, res) {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user.id;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                error: 'oldPassword and newPassword are required'
            });
        }

        const result = await authService.changePassword(userId, oldPassword, newPassword);
        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Error in changePassword:', error);
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
}

async function getCurrentUser(req, res) {
    try {
        const userResponse = req.user.toJSON();
        delete userResponse.password;

        res.json({
            success: true,
            data: {
                user: userResponse
            }
        });
    } catch (error) {
        console.error('Error in getCurrentUser:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

// ========== УПРАВЛЕНИЕ ПОЛЬЗОВАТЕЛЯМИ ==========

async function getUsers(req, res) {
    try {
        const { page = 1, limit = 20, search, role } = req.query;

        const where = {};

        if (search) {
            where[models.Sequelize.Op.or] = [
                { email: { [models.Sequelize.Op.iLike]: `%${search}%` } },
                { fullName: { [models.Sequelize.Op.iLike]: `%${search}%` } }
            ];
        }

        if (role) {
            where.role = role;
        }

        const offset = (parseInt(page) - 1) * parseInt(limit);

        const users = await models.User.findAndCountAll({
            where,
            attributes: { exclude: ['password', 'emailVerificationToken', 'passwordResetToken', 'passwordResetExpires'] },
            limit: parseInt(limit),
            offset,
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            data: {
                users: users.rows,
                total: users.count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(users.count / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Error in getUsers:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

async function getUserById(req, res) {
    try {
        const { id } = req.params;

        const user = await models.User.findByPk(id, {
            attributes: { exclude: ['password', 'emailVerificationToken', 'passwordResetToken', 'passwordResetExpires'] }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Error in getUserById:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

async function updateUser(req, res) {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Запрещаем обновление чувствительных полей через этот метод
        delete updates.password;
        delete updates.emailVerificationToken;
        delete updates.passwordResetToken;
        delete updates.passwordResetExpires;
        delete updates.balance;

        const user = await models.User.findByPk(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        await user.update(updates);

        const userResponse = user.toJSON();
        delete userResponse.password;

        res.json({
            success: true,
            data: userResponse
        });
    } catch (error) {
        console.error('Error in updateUser:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

async function deleteUser(req, res) {
    try {
        const { id } = req.params;

        const user = await models.User.findByPk(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        // Мягкое удаление
        await user.destroy();

        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Error in deleteUser:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

async function toggleUserStatus(req, res) {
    try {
        const { id } = req.params;

        const user = await models.User.findByPk(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        await user.update({ isActive: !user.isActive });

        res.json({
            success: true,
            data: {
                id: user.id,
                isActive: user.isActive
            }
        });
    } catch (error) {
        console.error('Error in toggleUserStatus:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

// ========== БАЛАНС ==========

async function getBalance(req, res) {
    try {
        const userId = req.user.id;

        const user = await models.User.findByPk(userId, {
            attributes: ['balance']
        });

        res.json({
            success: true,
            data: {
                balance: user.balance
            }
        });
    } catch (error) {
        console.error('Error in getBalance:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

async function getTransactions(req, res) {
    try {
        const userId = req.user.id;
        const { limit = 50, offset = 0 } = req.query;

        const result = await balanceService.getUserTransactions(
            userId,
            parseInt(limit),
            parseInt(offset)
        );

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Error in getTransactions:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

async function getTransactionStats(req, res) {
    try {
        const userId = req.user.id;

        const stats = await balanceService.getUserTransactionStats(userId);

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error in getTransactionStats:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

async function adminAdjustBalance(req, res) {
    try {
        const { userId, amount, reason } = req.body;

        if (!userId || !amount || !reason) {
            return res.status(400).json({
                success: false,
                error: 'userId, amount and reason are required'
            });
        }

        const sequelize = require('../../../sequelize');
        const transaction = await sequelize.transaction();

        try {
            const user = await models.User.findByPk(userId, {
                transaction,
                lock: transaction.LOCK.UPDATE
            });

            if (!user) {
                await transaction.rollback();
                return res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            }

            const balanceBefore = parseFloat(user.balance);
            const balanceAfter = balanceBefore + parseFloat(amount);

            await user.update({ balance: balanceAfter }, { transaction });

            const paymentTransaction = await models.Transaction.create({
                userId,
                type: parseFloat(amount) >= 0 ? 'deposit' : 'withdrawal',
                amount: parseFloat(amount),
                balanceBefore,
                balanceAfter,
                description: `Административная корректировка: ${reason}`,
                status: 'completed',
                meta: {
                    adminId: req.user.id,
                    reason
                }
            }, { transaction });

            await transaction.commit();

            res.json({
                success: true,
                data: {
                    userId,
                    previousBalance: balanceBefore,
                    newBalance: balanceAfter,
                    adjustment: parseFloat(amount),
                    transaction: paymentTransaction
                }
            });

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    } catch (error) {
        console.error('Error in adminAdjustBalance:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

// ========== УСЛУГИ ==========

async function getServices(req, res) {
    try {
        const { category, type, active } = req.query;

        const where = {};

        if (category) {
            where.category = category;
        }

        if (type) {
            where.type = type;
        }

        if (active !== undefined) {
            where.isActive = active === 'true';
        }

        const services = await models.Service.findAll({
            where,
            order: [['sortOrder', 'ASC'], ['name', 'ASC']]
        });

        res.json({
            success: true,
            data: services
        });
    } catch (error) {
        console.error('Error in getServices:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

async function getServiceByCode(req, res) {
    try {
        const { code } = req.params;

        const service = await models.Service.findOne({
            where: { code }
        });

        if (!service) {
            return res.status(404).json({
                success: false,
                error: 'Service not found'
            });
        }

        res.json({
            success: true,
            data: service
        });
    } catch (error) {
        console.error('Error in getServiceByCode:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

async function createService(req, res) {
    try {
        const serviceData = req.body;

        const existingService = await models.Service.findOne({
            where: { code: serviceData.code }
        });

        if (existingService) {
            return res.status(400).json({
                success: false,
                error: 'Service with this code already exists'
            });
        }

        const service = await models.Service.create(serviceData);

        res.status(201).json({
            success: true,
            data: service
        });
    } catch (error) {
        console.error('Error in createService:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

async function updateService(req, res) {
    try {
        const { id } = req.params;

        const service = await models.Service.findByPk(id);

        if (!service) {
            return res.status(404).json({
                success: false,
                error: 'Service not found'
            });
        }

        await service.update(req.body);

        res.json({
            success: true,
            data: service
        });
    } catch (error) {
        console.error('Error in updateService:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

async function deleteService(req, res) {
    try {
        const { id } = req.params;

        const service = await models.Service.findByPk(id);

        if (!service) {
            return res.status(404).json({
                success: false,
                error: 'Service not found'
            });
        }

        // Проверяем, есть ли связанные расчеты
        const calculationsCount = await models.Calculation.count({
            where: { serviceId: id }
        });

        if (calculationsCount > 0) {
            return res.status(400).json({
                success: false,
                error: 'Cannot delete service with existing calculations'
            });
        }

        await service.destroy();

        res.json({
            success: true,
            message: 'Service deleted successfully'
        });
    } catch (error) {
        console.error('Error in deleteService:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

// ========== ПОДПИСКИ ==========

async function getSubscriptions(req, res) {
    try {
        const userId = req.user.id;
        const { active } = req.query;

        const where = { userId };

        if (active === 'true') {
            where.status = 'active';
            where.endDate = { [models.Sequelize.Op.gt]: new Date() };
        }

        const subscriptions = await models.Subscription.findAll({
            where,
            include: [
                {
                    model: models.Service,
                    as: 'service',
                    required: true
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            data: subscriptions
        });
    } catch (error) {
        console.error('Error in getSubscriptions:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

async function getActiveSubscription(req, res) {
    try {
        const userId = req.user.id;

        const subscription = await models.Subscription.findOne({
            where: {
                userId,
                status: 'active',
                endDate: { [models.Sequelize.Op.gt]: new Date() }
            },
            include: [
                {
                    model: models.Service,
                    as: 'service',
                    required: true
                }
            ]
        });

        res.json({
            success: true,
            data: subscription || null
        });
    } catch (error) {
        console.error('Error in getActiveSubscription:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

async function cancelSubscription(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const result = await balanceService.cancelSubscription(id, userId);

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Error in cancelSubscription:', error);
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
}

// ========== ЭКСПОРТ ==========

module.exports = {
    // Авторизация
    register,
    login,
    telegramLogin,
    refreshToken,
    verifyEmail,
    requestPasswordReset,
    resetPassword,
    changePassword,
    getCurrentUser,

    // Управление пользователями
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    toggleUserStatus,

    // Баланс
    getBalance,
    getTransactions,
    getTransactionStats,
    adminAdjustBalance,

    // Услуги
    getServices,
    getServiceByCode,
    createService,
    updateService,
    deleteService,

    // Подписки
    getSubscriptions,
    getActiveSubscription,
    cancelSubscription
};