import { useAuth } from '../../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { balanceAPI } from '../../api/client';
import { HiChartBar, HiUser, HiCalendar, HiChartSquareBar, HiPresentationChartLine } from 'react-icons/hi';

const cabinetNav = [
  { name: 'Обзор', path: '/cabinet', icon: <HiChartBar size={20} /> },
  { name: 'Мой профиль', path: '/cabinet/profile', icon: <HiUser size={20} /> },
  { name: 'Баланс', path: '/cabinet/balance', icon: <HiChartSquareBar size={20} /> },
  { name: 'История расчетов', path: '/cabinet/history', icon: <HiPresentationChartLine size={20} /> },
  { name: 'Подписки', path: '/cabinet/subscriptions', icon: <HiCalendar size={20} /> },
];

const depositPackages = [
  { amount: 500, bonus: 0, label: '500 ₽', popular: false },
  { amount: 1000, bonus: 50, label: '1000 ₽', popular: false },
  { amount: 2000, bonus: 150, label: '2000 ₽', popular: true },
  { amount: 5000, bonus: 500, label: '5000 ₽', popular: false },
];

export default function CabinetBalance() {
  const { user } = useAuth();
  const location = useLocation();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAmount, setSelectedAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [balanceRes, txRes] = await Promise.all([
          balanceAPI.getBalance(),
          balanceAPI.getTransactions({ limit: 20 }),
        ]);
        setBalance(balanceRes.data?.data?.balance ?? 0);
        setTransactions(txRes.data?.data?.transactions || txRes.data?.data || []);
      } catch (err) {
        console.error('Error fetching balance data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatBalance = (val) => {
    const num = parseFloat(val || 0);
    return num.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  const getEffectiveAmount = () => {
    if (customAmount && parseInt(customAmount) > 0) return parseInt(customAmount);
    return selectedAmount;
  };

  const handleProcessPayment = () => {
    const amount = getEffectiveAmount();
    alert(`Оплата на сумму ${amount} ₽ через ${paymentMethod === 'card' ? 'банковскую карту' : paymentMethod === 'sbp' ? 'СБП' : 'криптовалюту'} будет доступна в ближайшее время.`);
  };

  return (
    <div className="cabinet-page">
      <div className="container">
        <div className="cabinet-header">
          <h1 className="section-title">Управление <span>балансом</span></h1>
        </div>

        <div className="cabinet-grid">
          <nav className="cabinet-nav">
            {cabinetNav.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`cabinet-nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                <span className="cabinet-nav-icon">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="cabinet-content">
            {/* Current Balance Card */}
            <motion.div
              className="glass-card balance-main-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="balance-info">
                <span className="balance-label">Текущий баланс</span>
                <span className="balance-amount-large">
                  {loading ? '...' : formatBalance(balance)}
                </span>
              </div>
            </motion.div>

            {/* Deposit Packages */}
            <motion.div
              className="glass-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <h2 className="card-title">Выберите сумму пополнения</h2>
              <div className="packages-grid">
                {depositPackages.map((pkg) => (
                  <div
                    key={pkg.amount}
                    className={`package-item ${pkg.popular ? 'popular' : ''} ${selectedAmount === pkg.amount && !customAmount ? 'selected' : ''}`}
                    onClick={() => { setSelectedAmount(pkg.amount); setCustomAmount(''); }}
                  >
                    <span className="package-amount">{pkg.label}</span>
                    <span className="package-bonus">+{pkg.bonus} ₽</span>
                    {pkg.popular && <span className="package-badge">Популярное</span>}
                  </div>
                ))}
              </div>

              <div className="custom-amount">
                <label>Своя сумма</label>
                <div className="custom-input">
                  <input
                    type="number"
                    min="10"
                    step="10"
                    placeholder="Введите сумму"
                    value={customAmount}
                    onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(0); }}
                  />
                  <span className="currency">₽</span>
                </div>
              </div>

              <div className="payment-methods">
                <h3>Способ оплаты</h3>
                <div className="methods-grid">
                  <label className={`method-item ${paymentMethod === 'card' ? 'active' : ''}`}>
                    <input type="radio" name="paymentMethod" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                    <i className="fas fa-credit-card"></i>
                    <span>Банковская карта</span>
                  </label>
                  <label className={`method-item ${paymentMethod === 'sbp' ? 'active' : ''}`}>
                    <input type="radio" name="paymentMethod" value="sbp" checked={paymentMethod === 'sbp'} onChange={() => setPaymentMethod('sbp')} />
                    <i className="fas fa-mobile-alt"></i>
                    <span>СБП</span>
                  </label>
                  <label className={`method-item ${paymentMethod === 'crypto' ? 'active' : ''}`}>
                    <input type="radio" name="paymentMethod" value="crypto" checked={paymentMethod === 'crypto'} onChange={() => setPaymentMethod('crypto')} />
                    <i className="fab fa-bitcoin"></i>
                    <span>Криптовалюта</span>
                  </label>
                </div>
              </div>

              <button className="mystic-button" onClick={handleProcessPayment}>
                Пополнить на {formatBalance(getEffectiveAmount())}
              </button>
            </motion.div>

            {/* Transaction History */}
            <motion.div
              className="glass-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="section-header">
                <h2 className="card-title">История транзакций</h2>
              </div>

              {transactions.length === 0 ? (
                <p className="empty-state">У вас пока нет транзакций</p>
              ) : (
                <div className="transactions-list">
                  {transactions.map((tx, i) => (
                    <motion.div
                      key={tx.id || i}
                      className="transaction-item"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                    >
                      <div className="transaction-icon">
                        {parseFloat(tx.amount) >= 0 ? (
                          <i className="fas fa-arrow-down transaction-icon-positive"></i>
                        ) : (
                          <i className="fas fa-arrow-up transaction-icon-negative"></i>
                        )}
                      </div>
                      <div className="transaction-info">
                        <span className="transaction-description">{tx.description || tx.type || 'Транзакция'}</span>
                        <span className="transaction-date">{formatDate(tx.createdAt)}</span>
                      </div>
                      <div className={`transaction-amount ${parseFloat(tx.amount) >= 0 ? 'positive' : 'negative'}`}>
                        {parseFloat(tx.amount) >= 0 ? '+' : ''}{formatBalance(tx.amount)}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}