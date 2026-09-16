import { motion } from 'framer-motion';
import { useMemo } from 'react';

const ELEMENT_CONFIG = {
  fire: { label: 'Огонь', color: '#ff4d4d', icon: '🔥', desc: 'Энергия, страсть, инициатива, лидерство' },
  earth: { label: 'Земля', color: '#4caf50', icon: '🌍', desc: 'Практичность, стабильность, надежность' },
  air: { label: 'Воздух', color: '#4dabf5', icon: '💨', desc: 'Коммуникация, интеллект, гибкость' },
  water: { label: 'Вода', color: '#4dd0e1', icon: '💧', desc: 'Эмоции, интуиция, глубина' },
};

export default function ExpandedInterpretation({ data }) {
  if (!data) return null;

  const expanded = data.expandedInterpretation || '';
  const planets = data.planets || {};

  // Calculate element percentages from planets
  const elementCounts = useMemo(() => {
    const counts = { fire: 0, earth: 0, air: 0, water: 0 };
    Object.values(planets).forEach(p => {
      const el = (p.element || '').toLowerCase();
      if (counts[el] !== undefined) counts[el]++;
    });
    const total = Object.values(counts).reduce((s, v) => s + v, 0) || 1;
    const result = {};
    Object.entries(counts).forEach(([k, v]) => {
      result[k] = { ...ELEMENT_CONFIG[k], count: v, percentage: Math.round((v / total) * 100) };
    });
    return result;
  }, [planets]);

  // Parse expanded HTML for sections
  const sections = useMemo(() => {
    if (!expanded) return [];
    const parts = expanded.split(/<div class="report-section">/);
    return parts.slice(1).map(p => {
      const titleMatch = p.match(/<h4>(.*?)<\/h4>/);
      const content = p.replace(/<h4>.*?<\/h4>/, '').trim();
      return { title: titleMatch ? titleMatch[1] : '', content };
    });
  }, [expanded]);

  return (
    <motion.div className="astrology-expanded-container"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
    >
      {/* Element bars */}
      <div className="astrology-element-bars-section">
        <h4 className="astrology-expanded-title">🔥 Баланс стихий</h4>
        <div className="astrology-element-bars">
          {Object.entries(elementCounts).map(([key, el], i) => (
            <motion.div key={key} className="astrology-element-bar-item"
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className="astrology-element-bar-header">
                <span className="astrology-element-bar-icon">{el.icon}</span>
                <span className="astrology-element-bar-label">{el.label}</span>
                <span className="astrology-element-bar-pct" style={{ color: el.color }}>{el.percentage}%</span>
              </div>
              <div className="astrology-element-bar-track">
                <motion.div className="astrology-element-bar-fill"
                  initial={{ width: 0 }} animate={{ width: `${el.percentage}%` }}
                  transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: 'easeOut' }}
                  style={{ background: `linear-gradient(90deg, ${el.color}, ${el.color}88)` }}
                />
              </div>
              <div className="astrology-element-bar-desc">{el.desc}</div>
              <div className="astrology-element-bar-count">{el.count} планеты</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Sections from expanded interpretation */}
      {sections.map((section, i) => (
        <motion.div key={i} className="astrology-expanded-section"
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 + i * 0.08 }}
        >
          <h4 className="astrology-expanded-section-title">{section.title}</h4>
          <div className="astrology-expanded-section-content"
            dangerouslySetInnerHTML={{ __html: section.content }}
          />
        </motion.div>
      ))}

      {/* Karma analysis */}
      {data.karmaAnalysis && (
        <motion.div className="astrology-expanded-section karma-section"
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.8 }}
        >
          <h4 className="astrology-expanded-section-title">🌀 Кармический анализ</h4>
          <div className="astrology-karma-items">
            {data.karmaAnalysis.currentTask && (
              <div className="astrology-karma-item">
                <span className="astrology-karma-icon">🎯</span>
                <div>
                  <div className="astrology-karma-label">Текущая задача</div>
                  <div className="astrology-karma-value">{data.karmaAnalysis.currentTask}</div>
                </div>
              </div>
            )}
            {data.karmaAnalysis.saturnLesson && (
              <div className="astrology-karma-item">
                <span className="astrology-karma-icon">♄</span>
                <div>
                  <div className="astrology-karma-label">Урок Сатурна</div>
                  <div className="astrology-karma-value">{data.karmaAnalysis.saturnLesson}</div>
                </div>
              </div>
            )}
            {data.karmaAnalysis.pastLifeLessons && (
              <div className="astrology-karma-item">
                <span className="astrology-karma-icon">🌀</span>
                <div>
                  <div className="astrology-karma-label">Прошлые жизни</div>
                  <div className="astrology-karma-value">{data.karmaAnalysis.pastLifeLessons}</div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}