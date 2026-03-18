// modules/Core/Services/BalanceService.js
const { models } = require('../../../sequelize');
const { Op, fn, literal, col} = require('sequelize');

class BalanceService {
    /**
     * Проверка достаточности средств
     */
    async hasEnoughBalance(userId, serviceCode) {
        const user = await models.User.findByPk(userId);
        const service = await models.Service.findOne({
            where: { code: serviceCode, isActive: true }
        });

        if (!user || !service) {
            return { success: false, error: 'User or service not found' };
        }

        const hasEnough = parseFloat(user.balance) >= parseFloat(service.price);
        return {
            success: hasEnough,
            balance: user.balance,
            price: service.price,
            required: parseFloat(service.price) - parseFloat(user.balance)
        };
    }

    /**
     * Списание средств за услугу
     */
    async chargeForService(userId, serviceCode, metadata = {}) {
        const sequelize = require('../../../sequelize');
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
                throw new Error('User or service not found');
            }

            const balance = parseFloat(user.balance);
            const price = parseFloat(service.price);

            if (balance < price) {
                throw new Error('Insufficient balance');
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
        const sequelize = require('../../../sequelize');
        const transaction = await sequelize.transaction();

        try {
            const user = await models.User.findByPk(userId, {
                transaction,
                lock: transaction.LOCK.UPDATE
            });

            if (!user) {
                throw new Error('User not found');
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
        const transactions = await models.Transaction.findAndCountAll({
            where: { userId },
            order: [['createdAt', 'DESC']],
            limit,
            offset,
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
            limit,
            offset
        };
    }

    /**
     * Получение статистики по транзакциям
     */
    async getUserTransactionStats(userId) {
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
            currentBalance: user ? user.balance : 0,
            totalDeposits: parseFloat(stats.totalDeposits) || 0,
            totalSpent: parseFloat(stats.totalSpent) || 0,
            totalPurchases: parseInt(stats.totalPurchases) || 0,
            lastTransaction: stats.lastTransaction
        };
    }

    /**
     * Проверка активной подписки
     */
    async hasActiveSubscription(userId, serviceCode = null) {
        const where = {
            userId,
            status: 'active',
            endDate: { [Op.gte]: new Date() }
        };

        if (serviceCode) {
            where['$service.code$'] = serviceCode;
        }

        const subscription = await models.Subscription.findOne({
            where,
            include: [
                {
                    model: models.Service,
                    as: 'service',
                    required: true
                }
            ]
        });

        return !!subscription;
    }

    /**
     * Активация подписки
     */
    async activateSubscription(userId, serviceId, paymentId = null) {
        const sequelize = require('../../../sequelize');
        const transaction = await sequelize.transaction();

        try {
            const service = await models.Service.findByPk(serviceId, { transaction });

            if (!service || service.type !== 'subscription' || !service.isActive) {
                throw new Error('Invalid subscription service');
            }

            // Деактивируем предыдущие активные подписки того же типа
            await models.Subscription.update(
                { status: 'cancelled' },
                {
                    where: {
                        userId,
                        status: 'active',
                        '$service.category$': service.category
                    },
                    include: [
                        {
                            model: models.Service,
                            as: 'service',
                            required: true
                        }
                    ],
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
        const subscription = await models.Subscription.findOne({
            where: {
                id: subscriptionId,
                userId,
                status: 'active'
            }
        });

        if (!subscription) {
            throw new Error('Active subscription not found');
        }

        await subscription.update({
            status: 'cancelled',
            cancelledAt: new Date()
        });

        return {
            success: true,
            subscription
        };
    }

    /**
     * Обработка возврата средств
     */
    async refund(userId, originalTransactionId, amount, reason) {
        const sequelize = require('../../../sequelize');
        const transaction = await sequelize.transaction();

        try {
            const originalTransaction = await models.Transaction.findByPk(originalTransactionId, { transaction });

            if (!originalTransaction || originalTransaction.userId !== userId) {
                throw new Error('Original transaction not found');
            }

            const user = await models.User.findByPk(userId, {
                transaction,
                lock: transaction.LOCK.UPDATE
            });

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
            return {
                success: false,
                error: error.message
            };
        }
    }
}

module.exports = BalanceService;