import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiChartBar, HiUser, HiCalendar, HiChartSquareBar, HiPresentationChartLine } from 'react-icons/hi';

const cabinetNav = [
  { name: 'Обзор', path: '/cabinet', icon: <HiChartBar size={20} /> },
  { name: 'Мой профиль', path: '/cabinet/profile', icon: <HiUser size={20} /> },
  { name: 'Баланс', path: '/cabinet/balance', icon: <HiChartSquareBar size={20} /> },
  { name: 'История расчетов', path: '/cabinet/history', icon: <HiPresentationChartLine size={20} /> },
  { name: 'Подписки', path: '/cabinet/subscriptions', icon: <HiCalendar size={20} /> },
];

export default function CabinetLayout() {
  const { user } = useAuth();

  return (
    <div className="cabinet-page">
      <div className="container">
        <div className="cabinet-header">
          <div>
            <h1 className="section-title">
              Личный <span>кабинет</span>
            </h1>
            <p className="cabinet-greeting">
              Добро пожаловать, {user?.fullName || 'Пользователь'}!
            </p>
          </div>
        </div>

        <div className="cabinet-grid">
          <nav className="cabinet-nav">
            {cabinetNav.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`cabinet-nav-link ${window.location.pathname === item.path ? 'active' : ''}`}
              >
                <span className="cabinet-nav-icon">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="cabinet-content">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="cabinet-dashboard">
                <div className="dashboard-cards">
                  <div className="dashboard-card">
                    <div className="dashboard-card-icon">
                      <HiChartSquareBar />
                    </div>
                    <div className="dashboard-card-info">
                      <span className="dashboard-card-label">Баланс</span>
                      <span className="dashboard-card-value">0 ₽</span>
                    </div>
                  </div>

                  <div className="dashboard-card">
                    <div className="dashboard-card-icon">
                      <HiPresentationChartLine />
                    </div>
                    <div className="dashboard-card-info">
                      <span className="dashboard-card-label">Расчетов</span>
                      <span className="dashboard-card-value">0</span>
                    </div>
                  </div>

                  <div className="dashboard-card">
                    <div className="dashboard-card-icon">
                      <HiCalendar />
                    </div>
                    <div className="dashboard-card-info">
                      <span className="dashboard-card-label">Подписка</span>
                      <span className="dashboard-card-value">Нет</span>
                    </div>
                  </div>
                </div>

                <div className="dashboard-actions">
                  <h3>Быстрые действия</h3>
                  <div className="quick-actions">
                    <Link to="/numerology" className="quick-action-card">
                      <span className="quick-action-icon">🔢</span>
                      <span>Нумерология</span>
                    </Link>
                    <Link to="/astrology" className="quick-action-card">
                      <span className="quick-action-icon">🌠</span>
                      <span>Натальная карта</span>
                    </Link>
                    <Link to="/astropsychology" className="quick-action-card">
                      <span className="quick-action-icon">🧬</span>
                      <span>Астропсихология</span>
                    </Link>
                    <Link to="/tarot" className="quick-action-card">
                      <span className="quick-action-icon">🎴</span>
                      <span>Таро</span>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}