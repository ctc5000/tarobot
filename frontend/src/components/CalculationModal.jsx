import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { calculationsAPI } from '../api/client';
import NumerologyReport from './reports/NumerologyReport';
import AstrologyReport from './reports/AstrologyReport';
import AstropsychologyReport from './reports/AstropsychologyReport';
import TarotReport from './reports/TarotReport';
import CombinedReport from './reports/CombinedReport';

const blockVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

function renderNestedValue(val, depth = 0) {
  if (val === null || val === undefined) return <span className="report-value">—</span>;
  if (typeof val === 'string') return <span className="report-value">{val}</span>;
  if (typeof val === 'number') return <span className="report-value">{val}</span>;
  if (typeof val === 'boolean') return <span className="report-value">{val ? 'Да' : 'Нет'}</span>;

  if (Array.isArray(val)) {
    if (val.length === 0) return <span className="report-value">—</span>;
    return (
      <div className="report-nested-list" style={{ paddingLeft: depth > 0 ? '16px' : '0' }}>
        {val.map((item, i) => (
          <div key={i} className="report-nested-item">
            {typeof item === 'object' && item !== null ? renderNestedValue(item, depth + 1) : <span className="report-value">{String(item)}</span>}
          </div>
        ))}
      </div>
    );
  }

  if (typeof val === 'object') {
    const entries = Object.entries(val);
    if (entries.length === 0) return <span className="report-value">—</span>;
    return (
      <div className="report-nested-object" style={{ paddingLeft: depth > 0 ? '16px' : '0' }}>
        {entries.map(([k, v]) => (
          <div key={k} className="report-nested-row">
            <span className="report-nested-key">{k}:</span>
            {renderNestedValue(v, depth + 1)}
          </div>
        ))}
      </div>
    );
  }

  return <span className="report-value">{String(val)}</span>;
}

/**
 * Detect calculation type from the data structure itself.
 * The API may not include service.code, so we check the result keys.
 */
function detectServiceType(result) {
  if (!result || typeof result !== 'object') return 'unknown';

  // Combined cosmogram: has BOTH tarot AND numerology (or zodiac/fengShui)
  const hasTarot = result.tarot && typeof result.tarot === 'object' &&
    Object.values(result.tarot).some(v => v && typeof v === 'object' && v.name);
  const hasNumerology = result.numerology && typeof result.numerology === 'object' &&
    result.numerology.base;
  const hasZodiac = result.zodiac && typeof result.zodiac === 'object';
  const hasFengShui = result.fengShui && typeof result.fengShui === 'object';

  if ((hasTarot && hasNumerology) || (hasTarot && hasZodiac) || (hasNumerology && hasZodiac) || (hasNumerology && hasFengShui)) {
    return 'combined';
  }

  // Tarot: has tarot key with fate/control/personality sub-keys containing name/image
  if (hasTarot) return 'tarot';

  // Numerology: has numerology key with base/calls/control/interpretations
  if (hasNumerology) return 'numerology';

  // Astrology: has planets/houses/aspects keys
  if (result.planets || result.houses || result.aspects) return 'astrology';
  if (result.astroData || result.natalChart) return 'astrology';

  // Astropsychology: has psychologicalTraits or astropsychology key
  if (result.psychologicalTraits || result.astropsychology) return 'astropsychology';
  if (result.psyTraits || result.psyAspects) return 'astropsychology';

  return 'unknown';
}

/**
 * Generate random stars for parallax background
 */
function generateStars(count) {
  const stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.7 + 0.3,
      delay: Math.random() * 3,
      duration: Math.random() * 3 + 2
    });
  }
  return stars;
}

export default function CalculationModal({ calculationId, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const contentRef = useRef(null);
  const stars = useRef(generateStars(60));

  useEffect(() => {
    if (!calculationId) return;
    setLoading(true);
    setError(null);
    calculationsAPI.getById(calculationId)
      .then((res) => {
        setData(res.data?.data || res.data);
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'Не удалось загрузить расчет');
      })
      .finally(() => setLoading(false));
  }, [calculationId]);

  // Scroll-to-top detection
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const handleScroll = () => {
      setShowScrollTop(el.scrollTop > 400);
    };
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDownloadPdf = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/calculations/${calculationId}/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('PDF generation failed');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `calculation-${calculationId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF download error:', err);
      alert('Функция скачивания PDF будет доступна в ближайшее время');
    }
  };

  const getReportComponent = () => {
    if (!data) return null;
    const serviceCode = data.service?.code || data.serviceCode || '';
    const result = data.result || data;

    // Try service code first
    if (serviceCode.includes('numerology')) {
      return <NumerologyReport data={result} />;
    }
    if (serviceCode.includes('astrology') && !serviceCode.includes('astropsychology')) {
      return <AstrologyReport data={result} />;
    }
    if (serviceCode.includes('astropsychology')) {
      return <AstropsychologyReport data={result} />;
    }
    if (serviceCode.includes('tarot')) {
      return <TarotReport data={result} />;
    }

    // Fallback: detect from data structure
    const detectedType = detectServiceType(result);
    if (detectedType === 'combined') {
      return <CombinedReport data={result} />;
    }
    if (detectedType === 'tarot') {
      return <TarotReport data={result} />;
    }
    if (detectedType === 'numerology') {
      return <NumerologyReport data={result} />;
    }
    if (detectedType === 'astrology') {
      return <AstrologyReport data={result} />;
    }
    if (detectedType === 'astropsychology') {
      return <AstropsychologyReport data={result} />;
    }

    // Generic fallback - render all data as styled horizontal blocks
    const skipKeys = ['id', 'createdAt', 'updatedAt', 'userId', 'serviceId', '__v', 'service', 'result'];
    const entries = Object.entries(result).filter(([k]) => !skipKeys.includes(k));

    return (
      <motion.div className="report-container" initial="hidden" animate="visible" variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
      }}>
        <motion.div className="report-header" variants={blockVariants}>
          <span className="report-header-icon">📊</span>
          <h2 className="report-title">Результат расчета</h2>
          <span className="report-badge">{data.service?.name || serviceCode || 'Расчет'}</span>
        </motion.div>

        <motion.div className="report-person-info" variants={blockVariants}>
          <div className="report-person-detail">
            <span className="report-label">Тип расчета:</span>
            <span className="report-value">{data.calculationType || '—'}</span>
          </div>
          <div className="report-person-detail">
            <span className="report-label">Дата:</span>
            <span className="report-value">{data.createdAt ? new Date(data.createdAt).toLocaleDateString('ru-RU') : '—'}</span>
          </div>
        </motion.div>

        {entries.map(([key, val], i) => (
          <motion.div key={key} className="report-interpretation-block" variants={blockVariants}>
            <h3 className="report-block-title">
              <span style={{ fontSize: '1.2em' }}>📋</span>
              {key}
            </h3>
            <div className="report-block-content">
              {renderNestedValue(val)}
            </div>
          </motion.div>
        ))}
      </motion.div>
    );
  };

  return (
    <AnimatePresence>
      {calculationId && (
        <motion.div
          className="modal-fullscreen-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Parallax stars background */}
          <div className="modal-stars-bg">
            {stars.current.map((star) => (
              <motion.div
                key={star.id}
                className="modal-star"
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  width: star.size,
                  height: star.size,
                  opacity: star.opacity,
                }}
                animate={{
                  opacity: [star.opacity, star.opacity * 0.3, star.opacity],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: star.duration,
                  repeat: Infinity,
                  delay: star.delay,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>

          <motion.div
            className="modal-fullscreen-content"
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: 'spring', damping: 20, stiffness: 250 }}
          >
            {/* Header */}
            <div className="modal-fullscreen-header">
              <h2 className="modal-fullscreen-title">
                {data?.service?.name || 'Детали расчета'}
              </h2>
              <div className="modal-fullscreen-actions">
                <button
                  className="mystic-button"
                  onClick={handleDownloadPdf}
                  disabled={loading || !data}
                  style={{ padding: '8px 18px', fontSize: '0.85rem' }}
                >
                  <i className="fas fa-file-pdf"></i> PDF
                </button>
                <button className="modal-fullscreen-close" onClick={onClose}>
                  <span>×</span>
                </button>
              </div>
            </div>

            {/* Body with scroll */}
            <div className="modal-fullscreen-body" ref={contentRef}>
              {loading && (
                <div className="modal-loading">
                  <div className="calculation-loading">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      style={{
                        width: 48,
                        height: 48,
                        border: '3px solid rgba(201,165,75,0.2)',
                        borderTopColor: 'var(--primary)',
                        borderRadius: '50%',
                      }}
                    />
                    <p>Загрузка данных расчета...</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="modal-error">
                  <i className="fas fa-exclamation-circle" style={{ fontSize: '3rem', display: 'block', marginBottom: '16px' }}></i>
                  <span>{error}</span>
                </div>
              )}

              {!loading && !error && data && (
                <div className="calculation-report-wrapper">
                  {getReportComponent()}
                </div>
              )}
            </div>

            {/* Scroll-to-top button */}
            <AnimatePresence>
              {showScrollTop && (
                <motion.button
                  className="modal-scroll-top"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  onClick={scrollToTop}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <i className="fas fa-arrow-up"></i>
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}