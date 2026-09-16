import { useAuth } from '../../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { profileAPI } from '../../api/client';
import { HiChartBar, HiUser, HiCalendar, HiChartSquareBar, HiPresentationChartLine } from 'react-icons/hi';

const cabinetNav = [
  { name: 'Обзор', path: '/cabinet', icon: <HiChartBar size={20} /> },
  { name: 'Мой профиль', path: '/cabinet/profile', icon: <HiUser size={20} /> },
  { name: 'Баланс', path: '/cabinet/balance', icon: <HiChartSquareBar size={20} /> },
  { name: 'История расчетов', path: '/cabinet/history', icon: <HiPresentationChartLine size={20} /> },
  { name: 'Подписки', path: '/cabinet/subscriptions', icon: <HiCalendar size={20} /> },
];

export default function CabinetProfile() {
  const { user, updateUser } = useAuth();
  const location = useLocation();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const res = await profileAPI.update({ fullName: formData.fullName, phone: formData.phone });
      const updatedUser = res.data?.data || res.data?.user;
      if (updatedUser) updateUser(updatedUser);
      setMessage('Профиль успешно обновлен');
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка при обновлении профиля');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    setChangingPassword(true);
    setMessage(null);
    setError(null);
    try {
      await profileAPI.changePassword({
        oldPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setMessage('Пароль успешно изменен');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка при смене пароля');
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="cabinet-page">
      <div className="container">
        <div className="cabinet-header">
          <h1 className="section-title">Мой <span>профиль</span></h1>
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

            <motion.div
              className="glass-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="card-title">Личные данные</h2>
              <form onSubmit={handleProfileSubmit} className="cabinet-form">
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={user?.email || ''} disabled className="form-input disabled" />
                  <small className="form-hint">Email нельзя изменить</small>
                </div>
                <div className="form-group">
                  <label>Дата рождения</label>
                  <input type="date" value={user?.birthDate?.split('T')[0] || ''} disabled className="form-input disabled" />
                  <small className="form-hint">Дата рождения используется в расчетах</small>
                </div>
                <div className="form-group">
                  <label>ФИО</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Телефон</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="mystic-button" disabled={saving}>
                    {saving ? 'Сохранение...' : 'Сохранить изменения'}
                  </button>
                </div>
              </form>
            </motion.div>

            <motion.div
              className="glass-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <h2 className="card-title">Изменить пароль</h2>
              <form onSubmit={handlePasswordSubmit} className="cabinet-form">
                <div className="form-group">
                  <label>Текущий пароль</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Новый пароль</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="form-input"
                    required
                    minLength={6}
                  />
                </div>
                <div className="form-group">
                  <label>Подтверждение пароля</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="mystic-button" disabled={changingPassword}>
                    {changingPassword ? 'Изменение...' : 'Изменить пароль'}
                  </button>
                </div>
              </form>
            </motion.div>

            <motion.div
              className="glass-card danger-zone"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <h2 className="card-title">Опасная зона</h2>
              <p>После удаления аккаунта все ваши данные будут безвозвратно удалены.</p>
              <button className="btn btn-danger" onClick={() => {
                if (window.confirm('Вы уверены, что хотите удалить аккаунт? Это действие необратимо.')) {
                  alert('Функция удаления аккаунта будет доступна в ближайшее время');
                }
              }}>
                Удалить аккаунт
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}