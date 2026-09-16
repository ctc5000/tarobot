import { useAuth } from '../../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { subscriptionsAPI, servicesAPI } from '../../api/client';
import { HiChartBar, HiUser, HiCalendar, HiChartSquareBar, HiPresentationChartLine } from 'react-icons/hi';

const cabinetNav = [
  { name: 'Обзор', path: '/cabinet', icon: <HiChartBar size={20} /> },
  { name: 'Мой профиль', path: '/cabinet/profile', icon: <HiUser size={20} /> },
  { name: 'Баланс', path: '/cabinet/balance', icon: <HiChartSquareBar size={20} /> },
  { name: 'История расчетов', path: '/cabinet/history', icon: <HiPresentationChartLine size={20} /> },
  { name: 'Подписки', path: '/cabinet/subscriptions', icon: <HiCalendar size={20} /> },
];

export default function CabinetSubscriptions() {
  const { user } = useAuth();
  const location = useLocation();
  const [subscriptions, setSubscriptions] = useState([]);
  const [activeSub, setActiveSub] = useState(null);
  const [availableServices, setAvailableServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subRes, activeRes, servicesRes] = await Promise.allSettled([
          subscriptionsAPI.getAll(),
          subscriptionsAPI.getActive(),
          servicesAPI.getAll(),
        ]);

        if (subRes.status === 'fulfilled') {
          setSubscriptions(subRes.value.data?.data || []);
        }
        if (activeRes.status === 'fulfilled') {
          setActiveSub(activeRes.value.data?.data || null);
        }
        if (servicesRes.status === 'fulfilled') {
          const allServices = servicesRes.value.data?.data || [];
          setAvailableServices(allServices.filter((s) => s.type === 'subscription' && s.isActive !== false));
        }
      } catch (err) {
        console.error('Error fetching subscriptions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleBuySubscription = async (serviceId) => {
    setBuying(serviceId);
    setMessage(null);
    setError(null);
    try {
      const res = await subscriptionsAPI.buy({ serviceId });
      const newSub = res.data?.data?.subscription;
      setActiveSub(newSub);
      setSubscriptions((prev) => [newSub, ...prev]);
      setMessage('Подписка успешно оформлена!');
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка при оформлении подписки');
    } finally {
      setBuying(null);
    }
  };

  const handleCancelSubscription = async (id) => {
    if (!window.confirm('Вы уверены, что хотите отменить подписку?')) return;
    try {
      await subscriptionsAPI.cancel(id);
      setActiveSub(null);
      setSubscriptions((prev) => prev.map((s) => (s.id === id ? { ...s, status: 'cancelled' } : s)));
      setMessage('Подписка отменена');
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка при отмене подписки');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
  };

  const formatPrice = (price) => {
    const num = parseFloat(price || 0);
    return num.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 });
  };

  const getDaysLeft = (endDate) => {
    if (!endDate) return 0;
    const diff = new Date(endDate) - new Date();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  return (
    <div className="cabinet-page">
      <div className="container">
        <div className="cabinet-header">
          <h1 className="section-title">Мои <span>подписки</span></h1>
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
            {message && (
              <motion.div className="cabinet-message success" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <i className="fas fa-check-circle"></i> {message}
              </motion.div>
            )}
            {error && (
              <motion.div className="cabinet-message error" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <i className="fas fa-exclamation-circle"></i> {error}
              </motion.div>
            )}

            {/* Active Subscription */}
            <motion.div
              className="glass-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="card-title">Текущая подписка</h2>
              {loading ? (
                <div className="loading-state"><i className="fas fa-spinner fa-spin"></i> Загрузка...</div>
              ) : activeSub ? (
                <div className="active-subscription-content">
                  <div className="subscription-status-badge active">
                    <i className="fas fa-check-circle"></i> Активна
                  </div>
                  <div className="subscription-details">
                    <div className="subscription-detail">
                      <span className="subscription-detail-label">Тариф:</span>
                      <span className="subscription-detail-value">{activeSub.service?.name || 'Подписка'}</span>
                    </div>
                    <div className="subscription-detail">
                      <span className="subscription-detail-label">Начало:</span>
                      <span className="subscription-detail-value">{formatDate(activeSub.startDate)}</span>
                    </div>
                    <div className="subscription-detail">
                      <span className="subscription-detail-label">Окончание:</span>
                      <span className="subscription-detail-value">{formatDate(activeSub.endDate)}</span>
                    </div>
                    <div className="subscription-detail">
                      <span className="subscription-detail-label">Осталось дней:</span>
                      <span className="subscription-detail-value highlight">{getDaysLeft(activeSub.endDate)}</span>
                    </div>
                  </div>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleCancelSubscription(activeSub.id)}
                  >
                    <i className="fas fa-times"></i> Отменить подписку
                  </button>
                </div>
              ) : (
                <div className="empty-state">
                  <i className="fas fa-calendar-alt"></i>
                  <p>У вас нет активной подписки</p>
                </div>
              )}
            </motion.div>

            {/* Available Subscriptions */}
            <motion.div
              className="glass-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <h2 className="card-title">Доступные подписки</h2>
              {availableServices.length === 0 ? (
                <div className="empty-state">
                  <p>Нет доступных подписок</p>
                </div>
              ) : (
                <div className="subscriptions-grid">
                  {availableServices.map((service, i) => (
                    <motion.div
                      key={service.id}
                      className="subscription-plan-card"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                    >
                      <div className="plan-header">
                        <h3 className="plan-name">{service.name}</h3>
                        <div className="plan-price">{formatPrice(service.price)}</div>
                        {service.duration && (
                          <div className="plan-duration">на {service.duration} дней</div>
                        )}
                      </div>
                      {service.description && (
                        <p className="plan-description">{service.description}</p>
                      )}
                      <button
                        className="mystic-button"
                        onClick={() => handleBuySubscription(service.id)}
                        disabled={buying === service.id}
                      >
                        {buying === service.id ? (
                          <><i className="fas fa-spinner fa-spin"></i> Оформление...</>
                        ) : (
                          <><i className="fas fa-shopping-cart"></i> Оформить</>
                        )}
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Subscription History */}
            <motion.div
              className="glass-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <h2 className="card-title">История подписок</h2>
              {subscriptions.length === 0 ? (
                <div className="empty-state">
                  <p>У вас пока нет истории подписок</p>
                </div>
              ) : (
                <div className="subscriptions-list">
                  {subscriptions.map((sub, i) => (
                    <motion.div
                      key={sub.id}
                      className="subscription-history-item"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                    >
                      <div className="sub-history-info">
                        <span className="sub-history-name">{sub.service?.name || 'Подписка'}</span>
                        <span className="sub-history-date">
                          {formatDate(sub.startDate)} — {formatDate(sub.endDate)}
                        </span>
                      </div>
                      <div className="sub-history-status">
                        <span className={`status-badge ${sub.status}`}>
                          {sub.status === 'active' ? 'Активна' : sub.status === 'cancelled' ? 'Отменена' : sub.status}
                        </span>
                      </div>
                      <div className="sub-history-price">{formatPrice(sub.price)}</div>
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