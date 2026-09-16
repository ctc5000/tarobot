import { useAuth } from '../../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { calculationsAPI } from '../../api/client';
import CalculationModal from '../../components/CalculationModal';
import { HiChartBar, HiUser, HiCalendar, HiChartSquareBar, HiPresentationChartLine } from 'react-icons/hi';

const cabinetNav = [
  { name: 'Обзор', path: '/cabinet', icon: <HiChartBar size={20} /> },
  { name: 'Мой профиль', path: '/cabinet/profile', icon: <HiUser size={20} /> },
  { name: 'Баланс', path: '/cabinet/balance', icon: <HiChartSquareBar size={20} /> },
  { name: 'История расчетов', path: '/cabinet/history', icon: <HiPresentationChartLine size={20} /> },
  { name: 'Подписки', path: '/cabinet/subscriptions', icon: <HiCalendar size={20} /> },
];

const calculationTypeLabels = {
  basic: 'Базовый расчет',
  full: 'Полный расчет',
  full_report: 'Полный отчет',
  day: 'Прогноз на день',
  week: 'Прогноз на неделю',
  month: 'Прогноз на месяц',
  year: 'Прогноз на год',
  compatibility: 'Совместимость',
};

const calculationTypeIcons = {
  basic: '🔢',
  full: '📊',
  full_report: '📜',
  day: '📅',
  week: '📆',
  month: '📋',
  year: '📈',
  compatibility: '💞',
};

export default function CabinetHistory() {
  const { user } = useAuth();
  const location = useLocation();
  const [calculations, setCalculations] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [selectedCalcId, setSelectedCalcId] = useState(null);

  const limit = 10;

  const fetchCalculations = async (p = 1) => {
    setLoading(true);
    try {
      const params = { limit, page: p };
      if (filterType !== 'all') params.calculationType = filterType;

      const res = await calculationsAPI.getHistory(params);
      const data = res.data?.data || {};
      setCalculations(data.calculations || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Error fetching calculations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalculations(1);
    setPage(1);
  }, [filterType]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchCalculations(newPage);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  const formatPrice = (price) => {
    const num = parseFloat(price || 0);
    return num.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 });
  };

  return (
    <div className="cabinet-page">
      <div className="container">
        <div className="cabinet-header">
          <h1 className="section-title">История <span>расчетов</span></h1>
          <p className="cabinet-subtitle">Все ваши расчеты в одном месте</p>
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
            {/* Filters */}
            <motion.div
              className="history-filters glass-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="filters-grid">
                <div className="filter-group">
                  <label><i className="fas fa-filter"></i> Тип расчета</label>
                  <select
                    className="filter-select"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="all">Все типы</option>
                    {Object.entries(calculationTypeLabels).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="history-stats">
                <i className="fas fa-chart-bar"></i> Всего: <strong>{total}</strong>
              </div>
            </motion.div>

            {/* Calculations List */}
            <motion.div
              className="glass-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="section-header">
                <h2 className="card-title"><i className="fas fa-calculator"></i> Все расчеты</h2>
              </div>

              {loading ? (
                <div className="loading-state">
                  <i className="fas fa-spinner fa-spin"></i> Загрузка истории...
                </div>
              ) : calculations.length === 0 ? (
                <div className="empty-state">
                  <i className="fas fa-inbox"></i>
                  <p>У вас пока нет расчетов</p>
                  <Link to="/numerology" className="mystic-button" style={{ display: 'inline-block', marginTop: '1rem' }}>
                    Сделать первый расчет
                  </Link>
                </div>
              ) : (
                <>
                  <div className="calculations-list">
                    {calculations.map((calc, i) => (
                      <motion.div
                        key={calc.id}
                        className="calculation-item"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        onClick={() => setSelectedCalcId(calc.id)}
                      >
                        <div className="calculation-item-icon">
                          {calculationTypeIcons[calc.calculationType] || '📊'}
                        </div>
                        <div className="calculation-item-info">
                          <span className="calculation-item-name">
                            {calc.service?.name || calculationTypeLabels[calc.calculationType] || 'Расчет'}
                          </span>
                          <span className="calculation-item-type">
                            {calculationTypeLabels[calc.calculationType] || calc.calculationType}
                          </span>
                          <span className="calculation-item-date">{formatDate(calc.createdAt)}</span>
                        </div>
                        <div className="calculation-item-price">{formatPrice(calc.price)}</div>
                        <div className="calculation-item-action">
                          <i className="fas fa-chevron-right"></i>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="pagination">
                      <button
                        className="pagination-btn"
                        disabled={page <= 1}
                        onClick={() => handlePageChange(page - 1)}
                      >
                        <i className="fas fa-chevron-left"></i>
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                          key={p}
                          className={`pagination-btn ${p === page ? 'active' : ''}`}
                          onClick={() => handlePageChange(p)}
                        >
                          {p}
                        </button>
                      ))}
                      <button
                        className="pagination-btn"
                        disabled={page >= totalPages}
                        onClick={() => handlePageChange(page + 1)}
                      >
                        <i className="fas fa-chevron-right"></i>
                      </button>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Calculation Modal */}
      <CalculationModal
        calculationId={selectedCalcId}
        onClose={() => setSelectedCalcId(null)}
      />
    </div>
  );
}