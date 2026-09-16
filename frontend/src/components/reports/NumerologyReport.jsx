import { motion } from 'framer-motion';
import { blockVariants, formatText, renderHtmlContent, renderNestedValue, renderTarotCard, numberColors, renderPortrait, renderInterpretationAccordion } from './reportUtils';

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

const pinnaclePeriods = ['Первый этап (0-35 лет)', 'Второй этап (36-53 года)', 'Третий этап (54+ лет)', 'Четвёртый этап (вся жизнь)'];

const challengePeriods = ['Первый челлендж (0-35 лет)', 'Второй челлендж (36-53 года)', 'Третий челлендж (54+ лет)', 'Главный челлендж (вся жизнь)'];

export default function NumerologyReport({ data }) {
  if (!data) return null;

  const numerology = data.numerology || {};
  const base = numerology.base || {};
  const achilles = numerology.achilles || {};
  const control = numerology.control || {};
  const calls = numerology.calls || {};
  const pinnacles = numerology.pinnacles || {};
  const pythagoreanSquare = numerology.pythagoreanSquare || {};
  const karmicDebt = numerology.karmicDebt || {};
  const interpretations = numerology.interpretations || {};
  const zodiac = data.zodiac;
  const fengShui = data.fengShui;
  const tarot = data.tarot;

  return (
    <motion.div className="report-container" initial="hidden" animate="visible" variants={{
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
    }}>
      <motion.div className="report-header" variants={blockVariants}>
        <span className="report-header-icon">🔮</span>
        <h2 className="report-title">Космограмма личности</h2>
        <span className="report-badge">Нумерологический расчет</span>
      </motion.div>

      <motion.div className="report-person-info" variants={blockVariants}>
        <div className="report-person-detail">
          <span className="report-label">Ищущий:</span>
          <span className="report-value">{data.fullName}</span>
        </div>
        <div className="report-person-detail">
          <span className="report-label">Звездная дата:</span>
          <span className="report-value">{data.birthDate}</span>
        </div>
      </motion.div>

      {/* Базовые числа судьбы */}
      {(base.fate || base.lifePath) && (
        <motion.div className="report-interpretation-block" variants={blockVariants}>
          <h3 className="report-block-title">
            <span style={{ fontSize: '1.2em' }}>🔢</span>
            Числа судьбы
          </h3>
          <div className="report-block-content">
            <div className="report-numbers-grid">
              {[
                { label: 'Число судьбы', num: base.fate || base.lifePath, desc: numberMeanings[base.fate || base.lifePath] || '' },
                { label: 'Число имени', num: base.name, desc: numberMeanings[base.name] || '' },
                { label: 'Число рода', num: base.surname, desc: numberMeanings[base.surname] || '' },
                { label: 'Число предков', num: base.patronymic, desc: numberMeanings[base.patronymic] || '' },
                { label: 'Число дня рождения', num: base.birthDay, desc: base.birthDay ? numberMeanings[base.birthDay] : '' },
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

      {/* Классические числа (Expression, Soul Urge, Personality, Maturity, Balance) */}
      {(base.expression || base.soulUrge || base.personality || base.maturity || base.balance) && (
        <motion.div className="report-interpretation-block" variants={blockVariants}>
          <h3 className="report-block-title">
            <span style={{ fontSize: '1.2em' }}>⭐</span>
            Классические числа
          </h3>
          <div className="report-block-content">
            <div className="report-numbers-grid">
              {[
                { label: 'Число выражения', num: base.expression, desc: base.expression ? numberMeanings[base.expression] : '' },
                { label: 'Число души', num: base.soulUrge, desc: base.soulUrge ? numberMeanings[base.soulUrge] : '' },
                { label: 'Число личности', num: base.personality, desc: base.personality ? numberMeanings[base.personality] : '' },
                { label: 'Число зрелости', num: base.maturity, desc: base.maturity ? numberMeanings[base.maturity] : '' },
                { label: 'Число баланса', num: base.balance, desc: base.balance ? numberMeanings[base.balance] : '' },
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

      {/* Особые числа: Челленджи и Число зрелости */}
      {(achilles.number || control.number) && (
        <motion.div className="report-interpretation-block" variants={blockVariants}>
          <h3 className="report-block-title">
            <span style={{ fontSize: '1.2em' }}>⚡</span>
            Особые числа
          </h3>
          <div className="report-block-content">
            <div className="report-special-numbers">
              {achilles.number !== undefined && (
                <div
                  className="report-special-card"
                  style={{
                    '--special-glow': `${numberColors[achilles.number] || 'rgba(201,165,75,0.06)'}`
                  }}
                >
                  <span className="report-special-label">Главный челлендж</span>
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
                  <span className="report-special-label">Число зрелости</span>
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

      {/* 4 Челленджа (детализация) */}
      {achilles.first !== undefined && (
        <motion.div className="report-interpretation-block" variants={blockVariants}>
          <h3 className="report-block-title">
            <span style={{ fontSize: '1.2em' }}>🏔️</span>
            4 испытания (челленджи)
          </h3>
          <div className="report-block-content">
            <div className="report-calls-grid">
              {[
                { num: achilles.first, label: challengePeriods[0], desc: achilles.allDescriptions?.first, color: numberColors[achilles.first] },
                { num: achilles.second, label: challengePeriods[1], desc: achilles.allDescriptions?.second, color: numberColors[achilles.second] },
                { num: achilles.third, label: challengePeriods[2], desc: achilles.allDescriptions?.third, color: numberColors[achilles.third] },
                { num: achilles.fourth, label: challengePeriods[3], desc: achilles.allDescriptions?.fourth, color: numberColors[achilles.fourth] },
              ].map((item, i) => item.num !== undefined ? (
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

      {/* Социальные оклики */}
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

      {/* 4 Пинакля (жизненные этапы) */}
      {pinnacles.first && (
        <motion.div className="report-interpretation-block" variants={blockVariants}>
          <h3 className="report-block-title">
            <span style={{ fontSize: '1.2em' }}>🏛️</span>
            4 пинакля (жизненные этапы)
          </h3>
          <div className="report-block-content">
            <div className="report-calls-grid">
              {[
                { num: pinnacles.first, label: pinnaclePeriods[0], color: numberColors[pinnacles.first] },
                { num: pinnacles.second, label: pinnaclePeriods[1], color: numberColors[pinnacles.second] },
                { num: pinnacles.third, label: pinnaclePeriods[2], color: numberColors[pinnacles.third] },
                { num: pinnacles.fourth, label: pinnaclePeriods[3], color: numberColors[pinnacles.fourth] },
              ].map((item, i) => item.num ? (
                <div
                  key={i}
                  className="report-call-card"
                  style={{ borderTop: `3px solid ${item.color || 'var(--primary)'}` }}
                >
                  <div className="report-call-number" style={{ color: item.color }}>{item.num}</div>
                  <div className="report-call-label">{item.label}</div>
                </div>
              ) : null)}
            </div>
          </div>
        </motion.div>
      )}

      {/* Квадрат Пифагора */}
      {pythagoreanSquare.cells && (
        <motion.div className="report-interpretation-block" variants={blockVariants}>
          <h3 className="report-block-title">
            <span style={{ fontSize: '1.2em' }}>🔲</span>
            Квадрат Пифагора
          </h3>
          <div className="report-block-content">
            <div className="report-pythagorean-grid">
              {[1,2,3,4,5,6,7,8,9].map(num => {
                const count = pythagoreanSquare.cells[num] || 0;
                const cellLabels = {1:'Характер',2:'Энергия',3:'Интерес',4:'Здоровье',5:'Логика',6:'Труд',7:'Удача',8:'Долг',9:'Память'};
                return (
                  <div key={num} className="report-pythagorean-cell" style={{
                    border: `1px solid ${numberColors[num] || 'var(--border-color)'}`,
                    background: count > 0 ? `${numberColors[num]}22` : 'transparent'
                  }}>
                    <div className="report-pythagorean-num" style={{ color: numberColors[num] }}>{num}</div>
                    <div className="report-pythagorean-count">{count > 0 ? '█'.repeat(Math.min(count, 5)) : '—'}</div>
                    <div className="report-pythagorean-label">{cellLabels[num]}</div>
                  </div>
                );
              })}
            </div>
            {pythagoreanSquare.workings && (
              <div className="report-pythagorean-workings">
                <div className="report-trait-item">
                  <span className="report-trait-name">Рабочие числа:</span>
                  <span className="report-trait-value">
                    {pythagoreanSquare.workings.first}, {pythagoreanSquare.workings.second}, {pythagoreanSquare.workings.third}, {pythagoreanSquare.workings.fourth}
                  </span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Кармические долги */}
      {karmicDebt.hasDebt && (
        <motion.div className="report-interpretation-block" variants={blockVariants}>
          <h3 className="report-block-title">
            <span style={{ fontSize: '1.2em' }}>🌀</span>
            Кармические долги
          </h3>
          <div className="report-block-content">
            <div className="report-special-numbers">
              {karmicDebt.lifePath?.hasDebt && (
                <div className="report-special-card" style={{ '--special-glow': 'rgba(255,100,100,0.1)' }}>
                  <span className="report-special-label">Число судьбы: {karmicDebt.lifePath.name}</span>
                  <span className="report-special-desc">{karmicDebt.lifePath.description}</span>
                </div>
              )}
              {karmicDebt.expression?.hasDebt && (
                <div className="report-special-card" style={{ '--special-glow': 'rgba(255,100,100,0.1)' }}>
                  <span className="report-special-label">Число выражения: {karmicDebt.expression.name}</span>
                  <span className="report-special-desc">{karmicDebt.expression.description}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {data.interpretation && (
        <motion.div className="report-interpretation-block" variants={blockVariants}>
          <h3 className="report-block-title">
            <span style={{ fontSize: '1.2em' }}>📜</span>
            Свиток судьбы
          </h3>
          <div className="report-block-content">{renderHtmlContent(data.interpretation)}</div>
        </motion.div>
      )}

      {data.deepPortrait && (
        <motion.div className="report-interpretation-block" variants={blockVariants}>
          <h3 className="report-block-title">
            <span style={{ fontSize: '1.2em' }}>🌌</span>
            Глубинный портрет
          </h3>
          <div className="report-block-content">{renderPortrait(data.deepPortrait)}</div>
        </motion.div>
      )}

      {/* Знак зодиака */}
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
            {zodiac.lifeMission && (
              <div className="report-advice">🎯 Миссия: {zodiac.lifeMission}</div>
            )}
          </div>
        </motion.div>
      )}

      {/* Фэн-шуй */}
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
          </div>
        </motion.div>
      )}

      {/* Карты Таро */}
      {(tarot || data.fate || data.control || data.personality) && (
        <motion.div className="report-interpretation-block" variants={blockVariants}>
          <h3 className="report-block-title">
            <span style={{ fontSize: '1.2em' }}>🎴</span>
            Карты Таро
          </h3>
          <div className="report-block-content">
            <div className="report-horizontal-list">
              {renderTarotCard(data.fate || tarot?.fate, 'Судьба')}
              {renderTarotCard(data.personality || tarot?.personality, 'Личность')}
              {renderTarotCard(data.control || tarot?.control, 'Путь')}
            </div>
          </div>
        </motion.div>
      )}

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

      {/* Render any remaining data as horizontal blocks */}
      {Object.entries(data).filter(([k]) => !['numerology','zodiac','fengShui','tarot','fullName','birthDate','interpretation','deepPortrait','id','createdAt','updatedAt','userId','serviceId','__v'].includes(k)).map(([key, val]) => (
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