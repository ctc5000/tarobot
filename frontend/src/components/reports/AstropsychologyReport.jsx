import { motion } from 'framer-motion';
import { blockVariants, formatText, renderHtmlContent, renderNestedValue, renderInterpretationAccordion } from './reportUtils';

const elementColors = { fire: '#ff5722', earth: '#4caf50', air: '#03a9f4', water: '#2196f3' };
const elementIcons = { fire: '🔥', earth: '🌍', air: '💨', water: '💧' };

export default function AstropsychologyReport({ data }) {
  if (!data) return null;

  const elements = data.elements || {};
  const signs = data.signs || [];
  const planets = data.planets || {};
  const houses = data.houses || [];
  const aspects = data.aspects || [];
  const psychologicalTraits = data.psychologicalTraits || data.traits || {};
  const interpretations = data.interpretations || {};

  return (
    <motion.div className="report-container" initial="hidden" animate="visible" variants={{
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
    }}>
      <motion.div className="report-header" variants={blockVariants}>
        <span className="report-header-icon">🧠</span>
        <h2 className="report-title">Астропсихологический портрет</h2>
        <span className="report-badge">Астропсихологический расчет</span>
      </motion.div>

      <motion.div className="report-person-info" variants={blockVariants}>
        <div className="report-person-detail">
          <span className="report-label">Ищущий:</span>
          <span className="report-value">{data.fullName}</span>
        </div>
        <div className="report-person-detail">
          <span className="report-label">Дата рождения:</span>
          <span className="report-value">{data.birthDate}</span>
        </div>
      </motion.div>

      {Object.keys(elements).length > 0 && (
        <motion.div className="report-interpretation-block" variants={blockVariants}>
          <h3 className="report-block-title">
            <span style={{ fontSize: '1.2em' }}>🌓</span>
            Стихии личности
          </h3>
          <div className="report-block-content">
            <div className="report-horizontal-list">
              {Object.entries(elements).map(([key, val]) => {
                const color = elementColors[key] || 'var(--primary)';
                return (
                  <div key={key} className="report-horizontal-item" style={{ borderLeft: `3px solid ${color}` }}>
                    <span className="report-horizontal-label">{elementIcons[key] || '✦'} {val.name || key}</span>
                    {val.percentage !== undefined && (
                      <div className="report-progress">
                        <div className="report-progress-header">
                          <span className="report-progress-label">Выраженность</span>
                          <span className="report-progress-value" style={{ color }}>{val.percentage}%</span>
                        </div>
                        <div className="report-progress-track">
                          <motion.div className="report-progress-fill" initial={{ width: 0 }} animate={{ width: `${val.percentage}%` }} transition={{ duration: 1, ease: 'easeOut' }} style={{ background: `linear-gradient(90deg, ${color}, ${color}88)` }} />
                        </div>
                      </div>
                    )}
                    {(val.description || val.meaning) && <p className="report-text">{val.description || val.meaning}</p>}
                    {val.strengths && <p className="report-text"><strong>🌟 Сильные стороны:</strong> {val.strengths.slice(0, 4).join(', ')}</p>}
                    {val.weaknesses && <p className="report-text"><strong>🌙 Зоны роста:</strong> {val.weaknesses.slice(0, 4).join(', ')}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {signs.length > 0 && (
        <motion.div className="report-interpretation-block" variants={blockVariants}>
          <h3 className="report-block-title">
            <span style={{ fontSize: '1.2em' }}>♈</span>
            Знаки зодиака
          </h3>
          <div className="report-block-content">
            <div className="report-horizontal-list">
              {signs.map((sign, i) => {
                const color = elementColors[sign.element] || 'var(--primary)';
                return (
                  <div key={i} className="report-horizontal-item" style={{ borderLeft: `3px solid ${color}` }}>
                    <span className="report-horizontal-label" style={{ color }}>{sign.name || sign.sign || '—'}</span>
                    {sign.description && <p className="report-text">{sign.description}</p>}
                    {sign.traits && sign.traits.length > 0 && (
                      <div className="report-tags">
                        {sign.traits.slice(0, 6).map((t, j) => <span key={j} className="report-tag" style={{ borderColor: color + '44', color }}>{t}</span>)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {Object.keys(planets).length > 0 && (
        <motion.div className="report-interpretation-block" variants={blockVariants}>
          <h3 className="report-block-title">
            <span style={{ fontSize: '1.2em' }}>🪐</span>
            Планеты
          </h3>
          <div className="report-block-content">
            <div className="report-horizontal-list">
              {Object.entries(planets).map(([key, val]) => (
                <div key={key} className="report-horizontal-item" style={{ borderLeft: '3px solid var(--primary)' }}>
                  <span className="report-horizontal-label">{val.name || key}</span>
                  {(val.description || val.meaning) && <p className="report-text">{val.description || val.meaning}</p>}
                  {val.traits && val.traits.length > 0 && (
                    <div className="report-tags">{val.traits.slice(0, 5).map((t, j) => <span key={j} className="report-tag">{t}</span>)}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {houses.length > 0 && (
        <motion.div className="report-interpretation-block" variants={blockVariants}>
          <h3 className="report-block-title">
            <span style={{ fontSize: '1.2em' }}>🏠</span>
            Дома
          </h3>
          <div className="report-block-content">
            <div className="report-horizontal-list">
              {houses.map((house, i) => (
                <div key={i} className="report-horizontal-item" style={{ borderLeft: '3px solid var(--primary)' }}>
                  <span className="report-horizontal-label">Дом {house.number || i + 1}</span>
                  <span className="report-text">Знак: {house.name || house.sign || '—'}</span>
                  {(house.description || house.meaning) && <p className="report-text">{house.description || house.meaning}</p>}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {aspects.length > 0 && (
        <motion.div className="report-interpretation-block" variants={blockVariants}>
          <h3 className="report-block-title">
            <span style={{ fontSize: '1.2em' }}>🔗</span>
            Аспекты
          </h3>
          <div className="report-block-content">
            <div className="report-horizontal-list">
              {aspects.map((aspect, i) => {
                const aspectColors = { 'Трин': '#4caf50', 'Секстиль': '#8bc34a', 'Квадратура': '#f44336', 'Оппозиция': '#ff9800', 'Соединение': '#9c27b0' };
                const color = aspectColors[aspect.type] || 'var(--primary)';
                return (
                  <div key={i} className="report-horizontal-item" style={{ borderLeft: `3px solid ${color}` }}>
                    <span className="report-horizontal-label">
                      {aspect.planet1 || aspect.body1 || '—'} ◆ {aspect.planet2 || aspect.body2 || '—'}
                    </span>
                    <span className="report-text" style={{ color }}>Тип: {aspect.type || '—'}</span>
                    <span className="report-text">Орб: {aspect.orb != null ? `${Number(aspect.orb).toFixed(1)}°` : '—'}</span>
                    {(aspect.description || aspect.interpretation) && <p className="report-text">{aspect.description || aspect.interpretation}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {Object.keys(psychologicalTraits).length > 0 && (
        <motion.div className="report-interpretation-block" variants={blockVariants}>
          <h3 className="report-block-title">
            <span style={{ fontSize: '1.2em' }}>🧬</span>
            Психологические характеристики
          </h3>
          <div className="report-block-content">
            {Object.entries(psychologicalTraits).map(([key, val], i) => (
              <div key={i} className="report-nested-row">
                <span className="report-nested-key">{key}:</span>
                <span className="report-value">{typeof val === 'string' ? val : Array.isArray(val) ? val.join(', ') : String(val)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {Object.keys(interpretations).length > 0 && (
        <motion.div className="report-interpretation-block" variants={blockVariants}>
          <h3 className="report-block-title">
            <span style={{ fontSize: '1.2em' }}>📜</span>
            Интерпретации
          </h3>
          <div className="report-block-content report-accordion-group">
            {Object.entries(interpretations).map(([key, section]) =>
              renderInterpretationAccordion(section, key)
            )}
          </div>
        </motion.div>
      )}

      {data.interpretation && (
        <motion.div className="report-interpretation-block" variants={blockVariants}>
          <h3 className="report-block-title">
            <span style={{ fontSize: '1.2em' }}>📖</span>
            Общая интерпретация
          </h3>
          <div className="report-block-content">{renderHtmlContent(data.interpretation)}</div>
        </motion.div>
      )}

      {data.recommendations && (
        <motion.div className="report-interpretation-block" variants={blockVariants}>
          <h3 className="report-block-title">
            <span style={{ fontSize: '1.2em' }}>💡</span>
            Рекомендации
          </h3>
          <div className="report-block-content">
            {Array.isArray(data.recommendations) ? data.recommendations.map((r, i) => <p key={i} className="report-text-line">✦ {r}</p>) : renderHtmlContent(data.recommendations)}
          </div>
        </motion.div>
      )}

      {/* Render any remaining data as horizontal blocks */}
      {Object.entries(data).filter(([k]) => !['elements','signs','planets','houses','aspects','psychologicalTraits','traits','interpretations','fullName','birthDate','interpretation','recommendations','id','createdAt','updatedAt','userId','serviceId','__v'].includes(k)).map(([key, val]) => (
        <motion.div key={key} className="report-interpretation-block" variants={blockVariants}>
          <h3 className="report-block-title">
            <span style={{ fontSize: '1.2em' }}>📋</span>
            {key}
          </h3>
          <div className="report-block-content">{renderNestedValue(val)}</div>
        </motion.div>
      ))}
    </motion.div>
  );
}