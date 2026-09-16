import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export const blockVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

/* ─── Accordion Section ─── */
export function AccordionSection({ icon, title, defaultOpen = false, children, accentColor = 'var(--primary)' }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="report-accordion">
      <button
        className="report-accordion-header"
        onClick={() => setOpen(!open)}
        style={{ '--accordion-accent': accentColor }}
      >
        <span className="report-accordion-icon">{icon}</span>
        <span className="report-accordion-title">{title}</span>
        <motion.span
          className="report-accordion-arrow"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >▼</motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="report-accordion-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            <div className="report-accordion-content">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Interpretation Accordion (Love, Money, Career, Family, Health, Talents) ─── */
export function renderInterpretationAccordion(section, key) {
  if (!section || typeof section !== 'object') return null;

  const icons = { career: '💼', family: '👨‍👩‍👧‍👦', love: '❤️', health: '🏥', money: '💰', talent: '🎯' };
  const labels = { career: 'Карьера', family: 'Семья', love: 'Любовь', health: 'Здоровье', money: 'Финансы', talent: 'Таланты' };
  const accentColors = { career: '#ff9800', family: '#4caf50', love: '#e91e63', health: '#2196f3', money: '#ffd700', talent: '#9c27b0' };

  const icon = icons[key] || '📋';
  const label = labels[key] || key;
  const accent = accentColors[key] || 'var(--primary)';

  return (
    <AccordionSection key={key} icon={icon} title={label} accentColor={accent}>
      <div className="report-interpretation-accordion-inner">
        {section.title && (
          <div className="report-interpretation-title-row">
            <span className="report-interpretation-title">{section.title}</span>
          </div>
        )}

        {section.description && (
          <div className="report-interpretation-desc">{section.description}</div>
        )}

        {/* Style / Type badges */}
        {(section.loveStyle || section.moneyStyle || section.workStyle || section.familyStyle || section.energyType) && (
          <div className="report-interpretation-style-row">
            <span className="report-style-badge">
              {section.loveStyle || section.moneyStyle || section.workStyle || section.familyStyle || section.energyType}
            </span>
          </div>
        )}

        {/* Strengths & Weaknesses */}
        {section.strengths && Array.isArray(section.strengths) && section.strengths.length > 0 && (
          <div className="report-interpretation-lists">
            <div className="report-interpretation-list report-list-strengths">
              <div className="report-list-header">🌟 Сильные стороны</div>
              {section.strengths.map((s, i) => <div key={i} className="report-list-item report-list-item-success">✦ {s}</div>)}
            </div>
          </div>
        )}

        {section.weaknesses && Array.isArray(section.weaknesses) && section.weaknesses.length > 0 && (
          <div className="report-interpretation-lists">
            <div className="report-interpretation-list report-list-weaknesses">
              <div className="report-list-header">🌙 Зоны роста</div>
              {section.weaknesses.map((s, i) => <div key={i} className="report-list-item report-list-item-warning">✦ {s}</div>)}
            </div>
          </div>
        )}

        {/* Suitable professions / Income sources */}
        {section.suitable && Array.isArray(section.suitable) && section.suitable.length > 0 && (
          <div className="report-interpretation-tags-section">
            <div className="report-list-header">💼 Подходящие профессии</div>
            <div className="report-tags">
              {section.suitable.map((s, i) => <span key={i} className="report-tag report-tag-career">{s}</span>)}
            </div>
          </div>
        )}

        {section.sources && Array.isArray(section.sources) && section.sources.length > 0 && (
          <div className="report-interpretation-tags-section">
            <div className="report-list-header">🏥 Источники дохода</div>
            <div className="report-tags">
              {section.sources.map((s, i) => <span key={i} className="report-tag report-tag-money">{s}</span>)}
            </div>
          </div>
        )}

        {/* Talents */}
        {section.talents && Array.isArray(section.talents) && section.talents.length > 0 && (
          <div className="report-interpretation-tags-section">
            <div className="report-list-header">🎯 Таланты</div>
            <div className="report-tags">
              {section.talents.map((s, i) => <span key={i} className="report-tag report-tag-talent">{s}</span>)}
            </div>
          </div>
        )}

        {/* Prevention / Recommendations */}
        {section.prevention && Array.isArray(section.prevention) && section.prevention.length > 0 && (
          <div className="report-interpretation-tags-section">
            <div className="report-list-header">🛡️ Профилактика</div>
            <div className="report-tags">
              {section.prevention.map((s, i) => <span key={i} className="report-tag report-tag-health">{s}</span>)}
            </div>
          </div>
        )}

        {section.recommendations && Array.isArray(section.recommendations) && section.recommendations.length > 0 && (
          <div className="report-interpretation-tags-section">
            <div className="report-list-header">✅ Рекомендации</div>
            <div className="report-tags">
              {section.recommendations.map((s, i) => <span key={i} className="report-tag report-tag-health">{s}</span>)}
            </div>
          </div>
        )}

        {/* How to develop */}
        {section.howToDevelop && Array.isArray(section.howToDevelop) && section.howToDevelop.length > 0 && (
          <div className="report-interpretation-tags-section">
            <div className="report-list-header">📚 Как развивать</div>
            <div className="report-tags">
              {section.howToDevelop.map((s, i) => <span key={i} className="report-tag report-tag-talent">{s}</span>)}
            </div>
          </div>
        )}

        {/* Partner info */}
        {section.partnerType && (
          <div className="report-interpretation-info-row">
            <span className="report-info-label">🎭 Тип партнера</span>
            <span className="report-info-value">{section.partnerType}</span>
          </div>
        )}

        {section.idealPartner && (
          <div className="report-interpretation-advice">💑 {section.idealPartner}</div>
        )}

        {/* Compatibility */}
        {section.compatibilityLevel && (
          <div className="report-interpretation-info-row">
            <span className="report-info-label">📊 Совместимость</span>
            <span className="report-info-value">{section.compatibilityLevel}</span>
          </div>
        )}

        {section.compatibility !== undefined && (
          <div className="report-progress-bar">
            <div className="report-progress-fill" style={{ width: `${section.compatibility}%` }} />
            <span className="report-progress-text">{section.compatibility}%</span>
          </div>
        )}

        {/* Detailed description / Full interpretation */}
        {section.detailedDescription && (
          <div className="report-interpretation-detailed">{section.detailedDescription}</div>
        )}

        {section.fullInterpretation && (
          <div className="report-interpretation-detailed">{section.fullInterpretation}</div>
        )}

        {/* Development path */}
        {section.developmentPath && (
          <div className="report-interpretation-advice">🛤️ {section.developmentPath}</div>
        )}

        {/* Advice */}
        {section.advice && (
          <div className="report-interpretation-advice report-advice-glow">💫 {section.advice}</div>
        )}
      </div>
    </AccordionSection>
  );
}

/**
 * Render the deep psychological portrait with styled sections and accents.
 * Strips the title, splits into sections, highlights numbers and bold text.
 */
export function renderPortrait(text) {
  if (!text) return null;
  if (typeof text !== 'string') {
    try { text = String(text); } catch { return null; }
  }

  // Remove the title line "🌟 **ГЛУБИННЫЙ ПСИХОЛОГИЧЕСКИЙ ПОРТРЕТ** 🌟"
  let cleaned = text.replace(/^[🌟✨\s]*\*\*[^*]*ГЛУБИННЫЙ[^*]*ПСИХОЛОГИЧЕСКИЙ[^*]*ПОРТРЕТ[^*]*\*\*[🌟✨\s]*/i, '').trim();

  // Split into sections by double newlines
  const sections = cleaned.split(/\n\n+/).filter(Boolean);

  return (
    <div className="report-portrait-container">
      {sections.map((section, i) => {
        const lines = section.split('\n').filter(Boolean);
        let header = null;
        let bodyLines = lines;

        // First line might be a header like "**КТО ТЫ В ЭТОМ МИРЕ?**"
        if (lines.length > 0 && /^\*\*[^*]+\*\*/.test(lines[0].trim())) {
          header = lines[0].trim().replace(/^\*\*|\*\*$/g, '');
          bodyLines = lines.slice(1);
        }

        const icon = getPortraitIcon(header);

        return (
          <div key={i} className="report-portrait-section">
            {header && (
              <div className="report-portrait-header">
                <span className="report-portrait-icon">{icon}</span>
                <span>{header}</span>
              </div>
            )}
            <div className="report-portrait-body">
              {bodyLines.map((line, j) => {
                if (!line.trim()) return null;
                return (
                  <p key={j} className="report-portrait-line">
                    {renderPortraitLine(line)}
                  </p>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function getPortraitIcon(header) {
  if (!header) return '📋';
  const h = header.toLowerCase();
  if (h.includes('кто ты') || h.includes('этом мире')) return '🔮';
  if (h.includes('боль') || h.includes('сила')) return '⚡';
  if (h.includes('видят') || h.includes('маски') || h.includes('другие')) return '🎭';
  if (h.includes('звездный') || h.includes('код')) return '🌠';
  if (h.includes('энергия') || h.includes('год') || h.includes('рождения')) return '🔥';
  if (h.includes('архетип')) return '🏛️';
  if (h.includes('воспринимаешь') || h.includes('модальность') || h.includes('мир')) return '🎧';
  if (h.includes('привязанности') || h.includes('тип')) return '🔗';
  if (h.includes('важно понять') || h.includes('сейчас')) return '💫';
  return '📋';
}

function renderPortraitLine(line) {
  const parts = [];
  let idx = 0;
  let remaining = line;
  let lastIndex = 0;
  const regex = /(\*\*[^*]+\*\*)|(\b\d+\b)/g;
  let match;

  while ((match = regex.exec(remaining)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={idx++}>{remaining.slice(lastIndex, match.index)}</span>);
    }

    if (match[1]) {
      const boldText = match[1].replace(/^\*\*|\*\*$/g, '');
      if (/^\d+$/.test(boldText.trim())) {
        parts.push(<span key={idx++} className="report-portrait-number">{boldText}</span>);
      } else {
        parts.push(<strong key={idx++} className="report-portrait-bold">{boldText}</strong>);
      }
    } else if (match[2]) {
      parts.push(<span key={idx++} className="report-portrait-number">{match[2]}</span>);
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < remaining.length) {
    parts.push(<span key={idx++}>{remaining.slice(lastIndex)}</span>);
  }

  return parts.length > 0 ? parts : line;
}

/**
 * Check if a string contains HTML tags.
 */
function containsHtml(str) {
  if (typeof str !== 'string') return false;
  return /<[a-z][\s\S]*>/i.test(str);
}

/**
 * Render content that may contain HTML.
 * If the string contains HTML tags, renders it with dangerouslySetInnerHTML.
 * Otherwise, uses the normal formatText paragraph splitting.
 */
export function renderHtmlContent(text) {
  if (!text) return null;
  if (typeof text !== 'string') {
    try { text = String(text); } catch { return <span className="report-value">{'—'}</span>; }
  }
  if (containsHtml(text)) {
    return <div className="report-html-content" dangerouslySetInnerHTML={{ __html: text }} />;
  }
  // Fall back to plain text formatting
  return formatText(text);
}

/**
 * Format text with paragraph separation (splits on double newlines).
 */
export function formatText(text) {
  if (!text) return null;
  if (typeof text !== 'string') {
    try { text = String(text); } catch { return <span className="report-value">{'—'}</span>; }
  }
  const paragraphs = text.split(/\n\n+/);
  return paragraphs.map((para, i) => {
    const lines = para.split('\n').filter(Boolean);
    if (lines.length === 0) return null;
    return (
      <div key={i} className="report-paragraph">
        {lines.map((line, j) => (
          <p key={j} className="report-text-line">{line}</p>
        ))}
      </div>
    );
  });
}

/**
 * Recursively render nested values (objects, arrays, primitives).
 */
export function renderNestedValue(val, depth = 0) {
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
          <div key={k} className="report-nested-row" style={{ marginBottom: '6px' }}>
            <span className="report-nested-key">{k}:</span>
            {typeof v === 'object' && v !== null ? renderNestedValue(v, depth + 1) : <span className="report-value">{String(v)}</span>}
          </div>
        ))}
      </div>
    );
  }

  return <span className="report-value">{String(val)}</span>;
}

export const numberColors = {
  1: '#ff4444', 2: '#ff8c00', 3: '#ffd700',
  4: '#4caf50', 5: '#00bfff', 6: '#2196f3',
  7: '#9c27b0', 8: '#f44336', 9: '#e91e63'
};

export const arcanaColors = {
  'Старшие': '#9c27b0', 'Младшие': '#2196f3',
  'Жезлы': '#f44336', 'Кубки': '#2196f3',
  'Мечи': '#ff9800', 'Пентакли': '#4caf50'
};

export const positionLabels = {
  fate: 'Судьба',
  control: 'Контроль',
  personality: 'Личность',
  past: 'Прошлое',
  present: 'Настоящее',
  future: 'Будущее',
  advice: 'Совет',
  obstacle: 'Препятствие',
  result: 'Итог'
};

/**
 * Render a Tarot card with image, keywords, description, and advice.
 */
export function renderTarotCard(card, position) {
  if (!card || !card.name) return null;
  const imgSrc = card.image || '/images/tarot/back.jpg';
  const arcana = card.arcana || card.type || (card.number <= 22 ? 'Старшие' : 'Младшие');
  const color = arcanaColors[arcana] || 'var(--primary)';
  const isReversed = card.isReversed || card.reversed || false;

  return (
    <motion.div
      className="report-horizontal-item tarot-card-block"
      style={{ borderLeft: `3px solid ${color}` }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="tarot-card-layout">
        <div className="tarot-card-image-wrapper">
          <div className="tarot-card-frame">
            <motion.img
              src={imgSrc}
              alt={card.name}
              className="tarot-card-img"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              onError={(e) => { e.target.src = '/images/tarot/back.jpg'; }}
            />
            <div className="tarot-card-glow" />
          </div>
          {card.number !== undefined && (
            <div className="tarot-card-number-badge">{card.number === 0 ? 22 : card.number}</div>
          )}
        </div>
        <div className="tarot-card-info">
          <span className="report-horizontal-label">{position}: {card.name}</span>
          <span className="report-text" style={{ color }}>Аркан: {arcana}</span>
          {card.element && <span className="report-text">Стихия: {card.element}</span>}
          {isReversed && <span className="report-text" style={{ color: '#ff4444' }}>Перевернута</span>}
          {card.keywords && (
            <div className="report-tags">
              {card.keywords.split(',').map((kw, j) => (
                <span key={j} className="report-tag">{kw.trim()}</span>
              ))}
            </div>
          )}
          {card.description && <p className="report-text">{card.description}</p>}
          {card.advice && <div className="report-advice">💡 {card.advice}</div>}
        </div>
      </div>
    </motion.div>
  );
}