import { useState } from 'react';
import { motion } from 'framer-motion';

export default function CalculationForm({ title, description, onSubmit, loading, result }) {
  const [formData, setFormData] = useState({
    fullName: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="calculation-page">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="section-badge">Расчет</div>
          <h1 className="section-title">{title}</h1>
          <p className="section-description">{description}</p>
        </motion.div>

        <div className="calculation-grid">
          <motion.div
            className="calculation-form-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="calculation-form">
              <div className="form-group">
                <label>Имя и фамилия</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Иван Иванов"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Дата рождения</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Время рождения</label>
                <input
                  type="time"
                  className="form-input"
                  value={formData.birthTime}
                  onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Место рождения</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Город"
                  value={formData.birthPlace}
                  onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={loading}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {loading ? <span className="loading-spinner-sm" /> : 'Рассчитать'}
              </button>
            </form>
          </motion.div>

          <motion.div
            className="calculation-result-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {loading ? (
              <div className="calculation-loading">
                <div className="loading-spinner"></div>
                <p>Выполняется расчет...</p>
              </div>
            ) : result ? (
              <div className="calculation-result">
                <h2>Результат расчета</h2>
                <div className="result-content">
                  {typeof result === 'string' ? (
                    <p>{result}</p>
                  ) : (
                    <pre>{JSON.stringify(result, null, 2)}</pre>
                  )}
                </div>
              </div>
            ) : (
              <div className="calculation-placeholder">
                <span className="placeholder-icon">✦</span>
                <h3>Заполните форму</h3>
                <p>Введите данные для расчета и нажмите "Рассчитать"</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}