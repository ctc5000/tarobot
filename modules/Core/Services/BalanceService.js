// modules/Core/Services/BalanceService.js
const { models, sequelize } = require('../../../sequelize');
const { Op, fn, literal, col } = require('sequelize');

class BalanceService {
    /**
     * Проверка достаточности средств
     */
    async hasEnoughBalance(userId, serviceCode) {
        try {
            const user = await models.User.findByPk(userId);
            const service = await models.Service.findOne({
                where: { code: serviceCode, isActive: true }
            });

            if (!user || !service) {
                return {
                    success: false,
                    error: 'Пользователь или услуга не найдены'
                };
            }

            const hasEnough = parseFloat(user.balance) >= parseFloat(service.price);

            return {
                success: hasEnough,
                balance: parseFloat(user.balance),
                price: parseFloat(service.price),
                required: hasEnough ? 0 : parseFloat(service.price) - parseFloat(user.balance),
                user,
                service
            };
        } catch (error) {
            console.error('Error in hasEnoughBalance:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Списание средств за услугу
     */
    async chargeForService(userId, serviceCode, metadata = {}) {
        const transaction = await sequelize.transaction();

        try {
            // Блокируем запись пользователя
            const user = await models.User.findByPk(userId, {
                transaction,
                lock: transaction.LOCK.UPDATE
            });

            const service = await models.Service.findOne({
                where: { code: serviceCode, isActive: true },
                transaction
            });

            if (!user || !service) {
                await transaction.rollback();
                return {
                    success: false,
                    error: 'Пользователь или услуга не найдены'
                };
            }

            const balance = parseFloat(user.balance);
            const price = parseFloat(service.price);

            if (balance < price) {
                await transaction.rollback();
                return {
                    success: false,
                    error: 'Недостаточно средств',
                    required: price - balance,
                    balance,
                    price
                };
            }

            // Обновляем баланс пользователя
            const newBalance = balance - price;
            await user.update({ balance: newBalance }, { transaction });

            // Создаем запись транзакции
            const paymentTransaction = await models.Transaction.create({
                userId,
                type: 'payment',
                amount: -price,
                balanceBefore: balance,
                balanceAfter: newBalance,
                description: `Оплата услуги: ${service.name}`,
                status: 'completed',
                meta: {
                    serviceCode,
                    serviceName: service.name,
                    ...metadata
                }
            }, { transaction });

            await transaction.commit();

            return {
                success: true,
                transaction: paymentTransaction,
                newBalance,
                service
            };

        } catch (error) {
            await transaction.rollback();
            console.error('Error in chargeForService:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Списание средств за услугу с учетом подписки
     */
    async chargeForServiceWithSubscription(userId, serviceCode, metadata = {}) {
        const transaction = await sequelize.transaction();

        try {
            // Проверяем наличие активной подписки
            const hasSubscription = await this.hasActiveSubscription(userId);

            if (hasSubscription && ['forecast_day', 'forecast_week', 'forecast_month', 'forecast_year'].includes(serviceCode)) {
                // Для подписчиков прогнозы бесплатны
                await transaction.commit();
                return {
                    success: true,
                    free: true,
                    message: 'Услуга предоставлена бесплатно по подписке',
                    newBalance: null,
                    service: null
                };
            }

            // Проверяем, есть ли скидка по подписке для полного расчета
            let price = null;
            let service = await models.Service.findOne({
                where: { code: serviceCode, isActive: true },
                transaction
            });

            if (!service) {
                await transaction.rollback();
                return {
                    success: false,
                    error: 'Услуга не найдена'
                };
            }

            price = parseFloat(service.price);

            // Если есть подписка и это полный расчет - скидка 50%
            if (hasSubscription && serviceCode === 'forecast_full') {
                price = price * 0.5;
            }

            // Блокируем запись пользователя
            const user = await models.User.findByPk(userId, {
                transaction,
                lock: transaction.LOCK.UPDATE
            });

            if (!user) {
                await transaction.rollback();
                return {
                    success: false,
                    error: 'Пользователь не найден'
                };
            }

            const balance = parseFloat(user.balance);

            if (balance < price) {
                await transaction.rollback();
                return {
                    success: false,
                    error: 'Недостаточно средств',
                    required: price - balance,
                    balance,
                    price
                };
            }

            // Обновляем баланс пользователя
            const newBalance = balance - price;
            await user.update({ balance: newBalance }, { transaction });

            // Создаем запись транзакции
            const paymentTransaction = await models.Transaction.create({
                userId,
                type: 'payment',
                amount: -price,
                balanceBefore: balance,
                balanceAfter: newBalance,
                description: `Оплата услуги: ${service.name}${hasSubscription && serviceCode === 'forecast_full' ? ' (скидка 50%)' : ''}`,
                status: 'completed',
                meta: {
                    serviceCode,
                    serviceName: service.name,
                    originalPrice: parseFloat(service.price),
                    discount: hasSubscription && serviceCode === 'forecast_full' ? 50 : 0,
                    hasSubscription,
                    ...metadata
                }
            }, { transaction });

            await transaction.commit();

            return {
                success: true,
                transaction: paymentTransaction,
                newBalance,
                service,
                discount: hasSubscription && serviceCode === 'forecast_full' ? 50 : 0,
                originalPrice: parseFloat(service.price)
            };

        } catch (error) {
            await transaction.rollback();
            console.error('Error in chargeForServiceWithSubscription:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Пополнение баланса
     */
    async deposit(userId, amount, paymentMethod, paymentId, paymentDetails = {}) {
        const transaction = await sequelize.transaction();

        try {
            const user = await models.User.findByPk(userId, {
                transaction,
                lock: transaction.LOCK.UPDATE
            });

            if (!user) {
                await transaction.rollback();
                return {
                    success: false,
                    error: 'Пользователь не найден'
                };
            }

            const balanceBefore = parseFloat(user.balance);
            const depositAmount = parseFloat(amount);
            const balanceAfter = balanceBefore + depositAmount;

            await user.update({ balance: balanceAfter }, { transaction });

            const paymentTransaction = await models.Transaction.create({
                userId,
                type: 'deposit',
                amount: depositAmount,
                balanceBefore,
                balanceAfter,
                paymentMethod,
                paymentId,
                paymentDetails,
                description: `Пополнение баланса на ${depositAmount} руб.`,
                status: 'completed'
            }, { transaction });

            await transaction.commit();

            return {
                success: true,
                transaction: paymentTransaction,
                newBalance: balanceAfter
            };

        } catch (error) {
            await transaction.rollback();
            console.error('Error in deposit:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Получение истории транзакций пользователя
     */
    async getUserTransactions(userId, limit = 50, offset = 0) {
        try {
            const transactions = await models.Transaction.findAndCountAll({
                where: { userId },
                order: [['createdAt', 'DESC']],
                limit: parseInt(limit),
                offset: parseInt(offset),
                include: [
                    {
                        model: models.Calculation,
                        as: 'calculation',
                        required: false,
                        include: [
                            {
                                model: models.Service,
                                as: 'service',
                                attributes: ['id', 'name', 'code']
                            }
                        ]
                    }
                ]
            });

            return {
                total: transactions.count,
                transactions: transactions.rows,
                limit: parseInt(limit),
                offset: parseInt(offset)
            };
        } catch (error) {
            console.error('Error in getUserTransactions:', error);
            throw error;
        }
    }

    /**
     * Получение статистики по транзакциям
     */
    async getUserTransactionStats(userId) {
        try {
            const stats = await models.Transaction.findOne({
                where: { userId },
                attributes: [
                    [fn('SUM', literal("CASE WHEN type = 'deposit' THEN amount ELSE 0 END")), 'totalDeposits'],
                    [fn('SUM', literal("CASE WHEN type = 'payment' THEN ABS(amount) ELSE 0 END")), 'totalSpent'],
                    [fn('COUNT', literal("CASE WHEN type = 'payment' THEN 1 END")), 'totalPurchases'],
                    [fn('MAX', col('createdAt')), 'lastTransaction']
                ],
                raw: true
            });

            const user = await models.User.findByPk(userId, {
                attributes: ['balance']
            });

            return {
                currentBalance: user ? parseFloat(user.balance) : 0,
                totalDeposits: parseFloat(stats?.totalDeposits) || 0,
                totalSpent: parseFloat(stats?.totalSpent) || 0,
                totalPurchases: parseInt(stats?.totalPurchases) || 0,
                lastTransaction: stats?.lastTransaction || null
            };
        } catch (error) {
            console.error('Error in getUserTransactionStats:', error);
            throw error;
        }
    }

    /**
     * Проверка активной подписки
     */
    async hasActiveSubscription(userId, serviceCode = null) {
        try {
            const where = {
                userId,
                status: 'active',
                endDate: { [Op.gte]: new Date() }
            };

            const include = [
                {
                    model: models.Service,
                    as: 'service',
                    required: true
                }
            ];

            if (serviceCode) {
                include[0].where = { code: serviceCode };
            }

            const subscription = await models.Subscription.findOne({
                where,
                include
            });

            return !!subscription;
        } catch (error) {
            console.error('Error in hasActiveSubscription:', error);
            return false;
        }
    }

    /**
     * Получение активной подписки пользователя
     */
    async getActiveSubscription(userId) {
        try {
            const subscription = await models.Subscription.findOne({
                where: {
                    userId,
                    status: 'active',
                    endDate: { [Op.gte]: new Date() }
                },
                include: [
                    {
                        model: models.Service,
                        as: 'service',
                        required: true
                    }
                ]
            });

            return subscription;
        } catch (error) {
            console.error('Error in getActiveSubscription:', error);
            return null;
        }
    }

    /**
     * Активация подписки
     */
    async activateSubscription(userId, serviceId, paymentId = null) {
        const transaction = await sequelize.transaction();

        try {
            const service = await models.Service.findByPk(serviceId, { transaction });

            if (!service || service.type !== 'subscription' || !service.isActive) {
                await transaction.rollback();
                return {
                    success: false,
                    error: 'Неверная услуга подписки'
                };
            }

            // Деактивируем предыдущие активные подписки
            await models.Subscription.update(
                { status: 'cancelled' },
                {
                    where: {
                        userId,
                        status: 'active'
                    },
                    transaction
                }
            );

            // Создаем новую подписку
            const startDate = new Date();
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + service.duration);

            const subscription = await models.Subscription.create({
                userId,
                serviceId,
                startDate,
                endDate,
                status: 'active',
                price: service.price,
                paymentMethod: paymentId ? 'payment_system' : null,
                meta: { paymentId }
            }, { transaction });

            await transaction.commit();

            return {
                success: true,
                subscription,
                endDate
            };

        } catch (error) {
            await transaction.rollback();
            console.error('Error in activateSubscription:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Отмена подписки
     */
    async cancelSubscription(subscriptionId, userId) {
        try {
            const subscription = await models.Subscription.findOne({
                where: {
                    id: subscriptionId,
                    userId,
                    status: 'active'
                }
            });

            if (!subscription) {
                return {
                    success: false,
                    error: 'Активная подписка не найдена'
                };
            }

            await subscription.update({
                status: 'cancelled',
                cancelledAt: new Date()
            });

            return {
                success: true,
                subscription
            };
        } catch (error) {
            console.error('Error in cancelSubscription:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Обработка возврата средств
     */
    async refund(userId, originalTransactionId, amount, reason) {
        const transaction = await sequelize.transaction();

        try {
            const originalTransaction = await models.Transaction.findByPk(originalTransactionId, { transaction });

            if (!originalTransaction || originalTransaction.userId !== userId) {
                await transaction.rollback();
                return {
                    success: false,
                    error: 'Исходная транзакция не найдена'
                };
            }

            const user = await models.User.findByPk(userId, {
                transaction,
                lock: transaction.LOCK.UPDATE
            });

            if (!user) {
                await transaction.rollback();
                return {
                    success: false,
                    error: 'Пользователь не найден'
                };
            }

            const balanceBefore = parseFloat(user.balance);
            const refundAmount = parseFloat(amount);
            const balanceAfter = balanceBefore + refundAmount;

            await user.update({ balance: balanceAfter }, { transaction });

            const refundTransaction = await models.Transaction.create({
                userId,
                type: 'refund',
                amount: refundAmount,
                balanceBefore,
                balanceAfter,
                description: `Возврат средств: ${reason}`,
                status: 'completed',
                meta: {
                    originalTransactionId,
                    reason
                }
            }, { transaction });

            await transaction.commit();

            return {
                success: true,
                transaction: refundTransaction,
                newBalance: balanceAfter
            };

        } catch (error) {
            await transaction.rollback();
            console.error('Error in refund:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

module.exports = BalanceService;