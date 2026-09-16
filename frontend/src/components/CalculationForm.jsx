import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NumerologyReport from './reports/NumerologyReport';
import AstrologyReport from './reports/AstrologyReport';
import AstropsychologyReport from './reports/AstropsychologyReport';
import TarotReport from './reports/TarotReport';

const reportComponents = {
  numerology: NumerologyReport,
  astrology: AstrologyReport,
  astropsychology: AstropsychologyReport,
  tarot: TarotReport,
};

export default function CalculationForm({ title, description, onSubmit, loading, result, reportType }) {
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

  const ReportComponent = reportType ? reportComponents[reportType] : null;

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
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  className="calculation-loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="loading-spinner"></div>
                  <p>Выполняется расчет...</p>
                </motion.div>
              ) : result ? (
                <motion.div
                  key="result"
                  className="calculation-result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  {result.error ? (
                    <div className="calculation-error">
                      <span className="calculation-error-icon">⚠️</span>
                      <h3>Ошибка расчета</h3>
                      <p>{result.error}</p>
                    </div>
                  ) : ReportComponent ? (
                    <ReportComponent data={result} />
                  ) : (
                    <motion.div className="report-container" initial="hidden" animate="visible" variants={{
                      hidden: { opacity: 0 },
                      visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
                    }}>
                      <motion.div className="report-header" variants={{
                        hidden: { opacity: 0, y: 30 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                      }}>
                        <span className="report-header-icon">📊</span>
                        <h2 className="report-title">Результат расчета</h2>
                        <span className="report-badge">Расчет</span>
                      </motion.div>
                      {Object.entries(result).filter(([k]) => !['id','createdAt','updatedAt','userId','serviceId','__v'].includes(k)).map(([key, val], i) => (
                        <motion.div key={key} className="report-interpretation-block" variants={{
                          hidden: { opacity: 0, y: 30 },
                          visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08 } }
                        }}>
                          <h3 className="report-block-title">
                            <span style={{ fontSize: '1.2em' }}>📋</span>
                            {key}
                          </h3>
                          <div className="report-block-content">
                            {val === null || val === undefined ? <span className="report-value">—</span> :
                             typeof val === 'string' ? val.split('\n').map((line, j) => <p key={j} className="report-text-line">{line}</p>) :
                             typeof val === 'number' ? <span className="report-value">{val}</span> :
                             Array.isArray(val) ? val.map((item, j) => (
                               <div key={j} className="report-nested-item">
                                 {typeof item === 'object' && item !== null
                                   ? Object.entries(item).map(([k, v]) => <p key={k} className="report-text-line"><strong>{k}:</strong> {String(v)}</p>)
                                   : <span className="report-value">{String(item)}</span>}
                               </div>
                             )) :
                             typeof val === 'object' ? Object.entries(val).map(([k, v]) => (
                               <div key={k} className="report-nested-row">
                                 <span className="report-nested-key">{k}:</span>
                                 <span className="report-value">{typeof v === 'string' ? v : Array.isArray(v) ? v.join(', ') : String(v)}</span>
                               </div>
                             )) :
                             <span className="report-value">{String(val)}</span>
                            }
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  className="calculation-placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <span className="placeholder-icon">✦</span>
                  <h3>Заполните форму</h3>
                  <p>Введите данные для расчета и нажмите "Рассчитать"</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}