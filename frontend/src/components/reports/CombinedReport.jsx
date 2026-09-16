import { motion } from 'framer-motion';
import { blockVariants, formatText, renderHtmlContent, renderNestedValue, renderTarotCard, numberColors, positionLabels, renderPortrait, renderInterpretationAccordion } from './reportUtils';

const zodiacSymbols = {
  'Овен': '♈', 'Телец': '♉', 'Близнецы': '♊', 'Рак': '♋',
  'Лев': '♌', 'Дева': '♍', 'Весы': '♎', 'Скорпион': '♏',
  'Стрелец': '♐', 'Козерог': '♑', 'Водолей': '♒', 'Рыбы': '♓'
};

const elementIcons = {
  'Огонь': '🔥', 'Земля': '🌍', 'Воздух': '💨', 'Вода': '💧'
};

const fengShuiIcons = {
  element: '🌿', color: '🎨', direction: '🧭', season: '🌺'
};

const numberMeanings = {
  1: 'Лидерство, независимость, начало',
  2: 'Гармония, сотрудничество, баланс',
  3: 'Творчество, самовыражение, радость',
  4: 'Стабильность, порядок, труд',
  5: 'Свобода, перемены, приключения',
  6: 'Ответственность, любовь, семья',
  7: 'Мудрость, духовность, анализ',
  8: 'Власть, успех, изобилие',
  9: 'Завершение, гуманизм, мудрость'
};

export default function CombinedReport({ data }) {
  if (!data) return null;

  const tarot = data.tarot || {};
  const numerology = data.numerology || {};
  const base = numerology.base || {};
  const achilles = numerology.achilles || {};
  const control = numerology.control || {};
  const calls = numerology.calls || {};
  const interpretations = numerology.interpretations || {};
  const zodiac = data.zodiac;
  const fengShui = data.fengShui;
  const psychology = data.psychology || {};

  return (
    <motion.div className="report-container" initial="hidden" animate="visible" variants={{
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
    }}>
      <motion.div className="report-header" variants={blockVariants}>
        <span className="report-header-icon">🌌</span>
        <h2 className="report-title">Космограмма личности</h2>
        <span className="report-badge">Полный расчет</span>
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
        </motion.div>
      )}

      {/* TAROT CARDS */}
      {Object.values(tarot).some(v => v && typeof v === 'object' && v.name) && (
        <motion.div className="report-interpretation-block" variants={blockVariants}>
          <h3 className="report-block-title">
            <span style={{ fontSize: '1.2em' }}>🎴</span>
            Карты Таро
          </h3>
          <div className="report-block-content">
            <div className="report-horizontal-list">
              {Object.entries(tarot).map(([key, card]) => {
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

      {/* TASK 2: NUMEROLOGY BASE NUMBERS - stylish grid */}
      {base.fate && (
        <motion.div className="report-interpretation-block" variants={blockVariants}>
          <h3 className="report-block-title">
            <span style={{ fontSize: '1.2em' }}>🔢</span>
            Числа судьбы
          </h3>
          <div className="report-block-content">
            <div className="report-numbers-grid">
              {[
                { label: 'Число судьбы', num: base.fate, desc: numberMeanings[base.fate] || '' },
                { label: 'Число имени', num: base.name, desc: numberMeanings[base.name] || '' },
                { label: 'Число рода', num: base.surname, desc: numberMeanings[base.surname] || '' },
                { label: 'Число предков', num: base.patronymic, desc: numberMeanings[base.patronymic] || '' },
              ].map((item, i) => item.num ? (
                <div
                  key={i}
                  className="report-number-card"
                  style={{
                    '--card-glow-color': `${numberColors[item.num]}33`,
                    '--card-border-color': numberColors[item.num],
                    borderLeft: `3px solid ${numberColors[item.num] || 'var(--primary)'}`
                  }}
                >
                  <div className="report-number-value" style={{ color: numberColors[item.num] }}>
                    {item.num}
                  </div>
                  <div className="report-number-label">{item.label}</div>
                  {item.desc && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', lineHeight: '1.4' }}>
                      {item.desc}
                    </div>
                  )}
                </div>
              ) : null)}
            </div>
          </div>
        </motion.div>
      )}

      {/* TASK 3: SPECIAL NUMBERS - big number left, explanation right */}
      {(achilles.number || control.number) && (
        <motion.div className="report-interpretation-block" variants={blockVariants}>
          <h3 className="report-block-title">
            <span style={{ fontSize: '1.2em' }}>⚡</span>
            Особые числа
          </h3>
          <div className="report-block-content">
            <div className="report-special-numbers">
              {achilles.number && (
                <div
                  className="report-special-card"
                  style={{
                    '--special-glow': `${numberColors[achilles.number] || 'rgba(201,165,75,0.06)'}`
                  }}
                >
                  <span className="report-special-label">Ахиллесова пята</span>
                  <span className="report-special-value" style={{ color: numberColors[achilles.number] }}>
                    {achilles.number}
                  </span>
                  {achilles.description && (
                    <span className="report-special-desc">{achilles.description}</span>
                  )}
                </div>
              )}
              {control.number && (
                <div
                  className="report-special-card"
                  style={{
                    '--special-glow': `${numberColors[control.number] || 'rgba(201,165,75,0.06)'}`
                  }}
                >
                  <span className="report-special-label">Число управления</span>
                  <span className="report-special-value" style={{ color: numberColors[control.number] }}>
                    {control.number}
                  </span>
                  {control.description && (
                    <span className="report-special-desc">{control.description}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* TASK 4: SOCIAL CALLS - stylish grid */}
      {calls.close && (
        <motion.div className="report-interpretation-block" variants={blockVariants}>
          <h3 className="report-block-title">
            <span style={{ fontSize: '1.2em' }}>👥</span>
            Социальные оклики
          </h3>
          <div className="report-block-content">
            <div className="report-calls-grid">
              {[
                { num: calls.close, label: 'Близкий круг', desc: calls.descriptions?.close, color: numberColors[calls.close] },
                { num: calls.social, label: 'Социум', desc: calls.descriptions?.social, color: numberColors[calls.social] },
                { num: calls.world, label: 'Дальний круг', desc: calls.descriptions?.world, color: numberColors[calls.world] },
              ].map((item, i) => item.num ? (
                <div
                  key={i}
                  className="report-call-card"
                  style={{ borderTop: `3px solid ${item.color || 'var(--primary)'}` }}
                >
                  <div className="report-call-number" style={{ color: item.color }}>{item.num}</div>
                  <div className="report-call-label">{item.label}</div>
                  {item.desc && <div className="report-call-desc">{item.desc}</div>}
                </div>
              ) : null)}
            </div>
          </div>
        </motion.div>
      )}

      {/* TASK 5: PATTERNS - styled with paragraph separation */}
      {data.patterns && (
        <motion.div className="report-interpretation-block" variants={blockVariants}>
          <h3 className="report-block-title">
            <span style={{ fontSize: '1.2em' }}>🌀</span>
            Энергетические паттерны
          </h3>
          <div className="report-block-content">
            <div className="report-patterns-content">
              {renderHtmlContent(data.patterns)}
            </div>
          </div>
        </motion.div>
      )}

      {/* TASK 6: PSYCHOLOGY - fixed duplicate deep portrait */}
      {Object.keys(psychology).length > 0 && (
        <motion.div className="report-interpretation-block" variants={blockVariants}>
          <h3 className="report-block-title">
            <span style={{ fontSize: '1.2em' }}>🧠</span>
            Психологический портрет
          </h3>
          <div className="report-block-content">
            {Object.entries(psychology).map(([key, val]) => {
              if (!val) return null;
              const labels = {
                modality: 'Модальность',
                archetype: 'Архетип',
                attachment: 'Тип привязанности',
                temperament: 'Темперамент',
                deepPortrait: 'Глубинный портрет',
                portrait: 'Глубинный портрет'
              };
              return (
                <div key={key} className="report-interpretation-block" style={{ marginBottom: '12px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <h4 style={{ color: 'var(--primary)', fontSize: '0.95rem', fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.1em' }}>
                      {key === 'deepPortrait' || key === 'portrait' ? '🌌' : key === 'modality' ? '🎭' : key === 'archetype' ? '🏛️' : key === 'attachment' ? '🔗' : key === 'temperament' ? '⚖️' : '📋'}
                    </span>
                    {labels[key] || key}
                  </h4>
                  {key === 'portrait' || key === 'deepPortrait' ? renderPortrait(val) : typeof val === 'string' ? renderHtmlContent(val) : renderNestedValue(val)}
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* TASK 6: REMOVED duplicate deep portrait block - no longer needed since psychology.deepPortrait is handled above */}

      {/* TASK 7: ZODIAC - redesigned with symbol, elements, highlighted strengths/weaknesses */}
      {zodiac && (
        <motion.div className="report-interpretation-block" variants={blockVariants}>
          <h3 className="report-block-title">
            <span style={{ fontSize: '1.2em' }}>🌠</span>
            Знак зодиака
          </h3>
          <div className="report-block-content">
            <div className="report-signs-grid">
              <div className="report-sign-card" style={{ textAlign: 'center', padding: '24px' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '8px' }}>
                  {zodiacSymbols[zodiac.name] || '♈'}
                </div>
                <div className="report-sign-name" style={{ fontSize: '1.4rem' }}>{zodiac.name}</div>
                <div style={{ fontSize: '2rem', marginTop: '8px' }}>
                  {elementIcons[zodiac.element] || '🌟'}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
                  Стихия: {zodiac.element}
                </div>
              </div>
              <div className="report-sign-card">
                <div className="report-sign-header">
                  <span style={{ fontSize: '1.2rem' }}>📋</span>
                  <span className="report-sign-name">Характеристики</span>
                </div>
                <div className="report-sign-body">
                  <div className="report-trait-item">
                    <span className="report-trait-name">Планета</span>
                    <span className="report-trait-value">{zodiac.planet}</span>
                  </div>
                  <div className="report-trait-item">
                    <span className="report-trait-name">Качество</span>
                    <span className="report-trait-value">{zodiac.quality}</span>
                  </div>
                  {zodiac.strengths && (
                    <div className="report-trait-item">
                      <span className="report-trait-name" style={{ color: '#66bb6a' }}>🌟 Сильные стороны</span>
                      <span className="report-trait-value">{zodiac.strengths}</span>
                    </div>
                  )}
                  {zodiac.weaknesses && (
                    <div className="report-trait-item">
                      <span className="report-trait-name" style={{ color: '#ffa726' }}>🌙 Слабые стороны</span>
                      <span className="report-trait-value">{zodiac.weaknesses}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {zodiac.description && (
              <p className="report-text" style={{ marginTop: '12px' }}>{zodiac.description}</p>
            )}
            {zodiac.deepInsight && (
              <div className="report-advice">🔮 {zodiac.deepInsight}</div>
            )}
            {zodiac.lifeMission && (
              <div className="report-advice">🎯 Миссия: {zodiac.lifeMission}</div>
            )}
          </div>
        </motion.div>
      )}

      {/* TASK 8: FENG SHUI - redesigned as element grid with icons */}
      {fengShui && (
        <motion.div className="report-interpretation-block" variants={blockVariants}>
          <h3 className="report-block-title">
            <span style={{ fontSize: '1.2em' }}>🏮</span>
            Фэн-шуй
          </h3>
          <div className="report-block-content">
            <div className="report-elements-grid">
              <div className="report-element-card">
                <div className="report-element-header">
                  <span className="report-element-icon">{fengShuiIcons.element}</span>
                  <span className="report-element-name">Стихия</span>
                </div>
                <div className="report-element-body">
                  <span style={{ fontSize: '1.8rem', color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>
                    {fengShui.element}
                  </span>
                </div>
              </div>
              <div className="report-element-card">
                <div className="report-element-header">
                  <span className="report-element-icon">{fengShuiIcons.color}</span>
                  <span className="report-element-name">Цвет</span>
                </div>
                <div className="report-element-body">
                  <span style={{ fontSize: '1.8rem', color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>
                    {fengShui.color}
                  </span>
                </div>
              </div>
              <div className="report-element-card">
                <div className="report-element-header">
                  <span className="report-element-icon">{fengShuiIcons.direction}</span>
                  <span className="report-element-name">Направление</span>
                </div>
                <div className="report-element-body">
                  <span style={{ fontSize: '1.8rem', color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>
                    {fengShui.direction}
                  </span>
                </div>
              </div>
              <div className="report-element-card">
                <div className="report-element-header">
                  <span className="report-element-icon">{fengShuiIcons.season}</span>
                  <span className="report-element-name">Сезон</span>
                </div>
                <div className="report-element-body">
                  <span style={{ fontSize: '1.8rem', color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>
                    {fengShui.season}
                  </span>
                </div>
              </div>
            </div>
            {fengShui.description && (
              <p className="report-text" style={{ marginTop: '12px' }}>{fengShui.description}</p>
            )}
            {fengShui.activation && (
              <p className="report-text"><strong>Активация:</strong> {fengShui.activation}</p>
            )}
            {fengShui.affirmation && (
              <div className="report-advice">🙏 Аффирмация: {fengShui.affirmation}</div>
            )}
            {fengShui.personalAdvice && (
              <div className="report-advice">💫 {fengShui.personalAdvice}</div>
            )}
          </div>
        </motion.div>
      )}

      {/* INTERPRETATIONS (love, money, career, etc.) — accordion style */}
      {interpretations && Object.keys(interpretations).length > 0 && (
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

      {/* ANY REMAINING DATA */}
      {Object.entries(data).filter(([k]) => !['tarot','numerology','zodiac','fengShui','fullName','birthDate','patterns','psychology','deepPortrait','id','createdAt','updatedAt','userId','serviceId','__v','question','interpretation','advice','warning','recommendations'].includes(k)).map(([key, val]) => (
        <motion.div key={key} className="report-interpretation-block" variants={blockVariants}>
          <h3 className="report-block-title">
            <span style={{ fontSize: '1.2em' }}>📋</span>
            {key}
          </h3>
          <div className="report-block-content">
            {typeof val === 'string' ? renderHtmlContent(val) : renderNestedValue(val)}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}