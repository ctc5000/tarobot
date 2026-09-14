import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX } from 'react-icons/hi';

const navItems = [
  { name: 'Нумерология', path: '/numerology' },
  { name: 'Натальная карта', path: '/astrology' },
  { name: 'Астропсихология', path: '/astropsychology' },
  { name: 'Таро', path: '/tarot' },
];

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    return (parts[0]?.charAt(0) || '') + (parts[1]?.charAt(0) || '');
  };

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="logo">
          <span className="logo-icon">⛤</span>
          <span className="logo-text">АЛГОРИТМ СУДЬБЫ</span>
        </Link>

        <nav className="main-nav">
          <Link to="/" className={`nav-link ${isActive('/') && location.pathname === '/' ? 'active' : ''}`}>
            Главная
          </Link>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          {isAuthenticated ? (
            <div className="user-menu">
              <Link to="/cabinet" className="user-avatar" title={user?.fullName || 'Кабинет'}>
                {getInitials(user?.fullName)}
              </Link>
              <button onClick={logout} className="btn btn-sm btn-secondary logout-btn">
                Выйти
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">
              Войти
            </Link>
          )}

          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Меню"
          >
            {mobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              className="mobile-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              className="mobile-menu"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="mobile-menu-header">
                <span className="logo-icon">⛤</span>
                <span className="logo-text">Меню</span>
                <button onClick={() => setMobileMenuOpen(false)} className="mobile-close">
                  <HiX size={24} />
                </button>
              </div>

              <div className="mobile-nav-links">
                <Link to="/" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                  <span className="mobile-nav-icon">🏠</span>
                  <span>Главная</span>
                </Link>

                <div className="mobile-section-title">Практики</div>
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="mobile-nav-link"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="mobile-nav-icon">✦</span>
                    <span>{item.name}</span>
                  </Link>
                ))}

                <div className="mobile-section-title">Аккаунт</div>
                {isAuthenticated ? (
                  <>
                    <Link to="/cabinet" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                      <span className="mobile-nav-icon">👤</span>
                      <span>Личный кабинет</span>
                    </Link>
                    <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="mobile-nav-link logout-btn">
                      <span className="mobile-nav-icon">🚪</span>
                      <span>Выйти</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                      <span className="mobile-nav-icon">🔑</span>
                      <span>Войти</span>
                    </Link>
                    <Link to="/register" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                      <span className="mobile-nav-icon">📝</span>
                      <span>Регистрация</span>
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}