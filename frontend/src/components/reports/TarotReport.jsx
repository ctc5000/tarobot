import { motion } from 'framer-motion';
import { blockVariants, formatText, renderHtmlContent, renderTarotCard, arcanaColors, positionLabels } from './reportUtils';

export default function TarotReport({ data }) {
  if (!data) return null;

  // Handle both formats:
  // 1. data.tarot = { fate: {...}, control: {...}, personality: {...} }
  // 2. data.cards = [{ card: {...}, position: "..." }]
  // 3. data = { fate: {...}, control: {...}, personality: {...} } (result is tarot itself)

  const tarotData = data.tarot || data;
  const hasNestedCards = tarotData.fate || tarotData.control || tarotData.personality;
  const cards = data.cards || [];

  return (
    <motion.div className="report-container" initial="hidden" animate="visible" variants={{
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
    }}>
      <motion.div className="report-header" variants={blockVariants}>
        <span className="report-header-icon">🎴</span>
        <h2 className="report-title">Расклад Таро</h2>
        <span className="report-badge">Таро расчет</span>
      </motion.div>

      {data.fullName && (
        <motion.div className="report-person-info" variants={blockVariants}>
          <div className="report-person-detail">
            <span className="report-label">Имя:</span>
            <span className="report-value">{data.fullName}</span>
          </div>
          {data.birthDate && (
            <div className="report-person-detail">
              <span className="report-label">Дата рождения:</span>
              <span className="report-value">{data.birthDate}</span>
            </div>
          )}
          {data.question && (
            <div className="report-person-detail">
              <span className="report-label">Вопрос:</span>
              <span className="report-value">"{data.question}"</span>
            </div>
          )}
        </motion.div>
      )}

      {/* Format 1: Nested tarot cards under tarot.fate/control/personality */}
      {hasNestedCards && (
        <motion.div className="report-interpretation-block" variants={blockVariants}>
          <h3 className="report-block-title">
            <span style={{ fontSize: '1.2em' }}>🃏</span>
            Карты Таро
          </h3>
          <div className="report-block-content">
            <div className="report-horizontal-list">
              {Object.entries(tarotData).map(([key, card]) => {
                if (typeof card === 'object' && card !== null && card.name) {
                  const pos = positionLabels[key] || key;
                  return renderTarotCard(card, pos);
                }
                return null;
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* Format 2: cards array */}
      {cards.length > 0 && (
        <motion.div className="report-interpretation-block" variants={blockVariants}>
          <h3 className="report-block-title">
            <span style={{ fontSize: '1.2em' }}>🃏</span>
            Карты в раскладе
          </h3>
          <div className="report-block-content">
            <div className="report-horizontal-list">
              {cards.map((card, i) => {
                const c = card.card || card;
                const pos = card.position || `Позиция ${i + 1}`;
                return renderTarotCard(c, pos);
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* Spread info */}
      {data.spread && (
        <motion.div className="report-interpretation-block" variants={blockVariants}>
          <h3 className="report-block-title">
            <span style={{ fontSize: '1.2em' }}>📐</span>
            Расклад
          </h3>
          <div className="report-block-content">
            <div className="report-horizontal-item" style={{ borderLeft: '3px solid var(--primary)' }}>
              <span className="report-horizontal-label">{data.spread.name || 'Расклад'}</span>
              {data.spread.description && <p className="report-text">{data.spread.description}</p>}
            </div>
          </div>
        </motion.div>
      )}

      {/* Interpretation */}
      {data.interpretation && (
        <motion.div className="report-interpretation-block" variants={blockVariants}>
          <h3 className="report-block-title">
            <span style={{ fontSize: '1.2em' }}>🔮</span>
            Общая интерпретация
          </h3>
          <div className="report-block-content">{renderHtmlContent(data.interpretation)}</div>
        </motion.div>
      )}

      {/* Detailed interpretations */}
      {data.interpretations && Object.keys(data.interpretations).length > 0 && (
        <motion.div className="report-interpretation-block" variants={blockVariants}>
          <h3 className="report-block-title">
            <span style={{ fontSize: '1.2em' }}>📜</span>
            Детальная интерпретация
          </h3>
          <div className="report-block-content">
            {Object.entries(data.interpretations).map(([key, val], i) => (
              <div key={i} className="report-interpretation-item">
                <h4 className="report-interpretation-key">{key}</h4>
                {typeof val === 'string' ? renderHtmlContent(val) : (
                  <div className="report-nested-object">
                    {Object.entries(val).map(([k, v]) => (
                      <div key={k} className="report-nested-row">
                        <span className="report-nested-key">{k}:</span>
                        <span className="report-value">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Advice */}
      {data.advice && (
        <motion.div className="report-interpretation-block" variants={blockVariants}>
          <h3 className="report-block-title">
            <span style={{ fontSize: '1.2em' }}>💫</span>
            Совет
          </h3>
          <div className="report-block-content">{renderHtmlContent(data.advice)}</div>
        </motion.div>
      )}

      {/* Warning */}
      {data.warning && (
        <motion.div className="report-interpretation-block" variants={blockVariants}>
          <h3 className="report-block-title">
            <span style={{ fontSize: '1.2em' }}>⚠️</span>
            Предостережение
          </h3>
          <div className="report-block-content">{renderHtmlContent(data.warning)}</div>
        </motion.div>
      )}

      {/* Recommendations */}
      {data.recommendations && (
        <motion.div className="report-interpretation-block" variants={blockVariants}>
          <h3 className="report-block-title">
            <span style={{ fontSize: '1.2em' }}>💡</span>
            Рекомендации
          </h3>
          <div className="report-block-content">
            {Array.isArray(data.recommendations)
              ? data.recommendations.map((r, i) => <p key={i} className="report-text-line">✦ {r}</p>)
              : renderHtmlContent(data.recommendations)}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}