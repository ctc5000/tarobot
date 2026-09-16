import { motion } from 'framer-motion';
import { useState, useCallback } from 'react';
import { blockVariants, numberColors, AccordionSection, renderHtmlContent } from './reportUtils';

/* ─── Helper: render a single key-number card ─── */
function KeyNumberCard({ item }) {
  if (!item || item.value === undefined || item.value === null) return null;
  const color = numberColors[item.value] || 'var(--primary)';
  return (
    <div
      className="pro-number-card"
      style={{
        '--card-glow': `${color}22`,
        borderLeft: `3px solid ${color}`,
      }}
    >
      <div className="pro-number-value" style={{ color }}>{item.value}</div>
      <div className="pro-number-name">{item.name}</div>
      {item.description && (
        <div className="pro-number-desc">{item.description}</div>
      )}
    </div>
  );
}

/* ─── Helper: letter breakdown table ─── */
function LetterTable({ breakdown, label }) {
  if (!breakdown) return null;
  const entries = Object.values(breakdown);
  if (entries.length === 0) return null;
  return (
    <div className="pro-letter-table-wrapper">
      <h4 className="pro-subtitle">{label}</h4>
      <table className="pro-table">
        <thead>
          <tr>
            <th>Буква</th>
            <th>Значение</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((part, pi) =>
            part.letters.map((l, li) => (
              <tr key={`${pi}-${li}`}>
                <td className="pro-letter-char">{l.letter.toUpperCase()}</td>
                <td className="pro-letter-val">{l.value}</td>
              </tr>
            ))
          )}
        </tbody>
        <tfoot>
          {entries.map((part, pi) => (
            <tr key={`foot-${pi}`}>
              <td colSpan={2} className="pro-letter-sum">
                {part.word}: сумма = {part.sum} → {part.reduced}
              </td>
            </tr>
          ))}
        </tfoot>
      </table>
    </div>
  );
}

/* ─── Helper: intermediate sums accordion ─── */
function IntermediateSumBlock({ data, title, icon }) {
  if (!data) return null;
  return (
    <AccordionSection icon={icon} title={title}>
      <div className="pro-intermediate-content">
        <div className="pro-formula">{data.formula}</div>
        <div className="pro-steps">
          {data.steps.map((step, i) => (
            <div key={i} className="pro-step-row">
              <span className="pro-step-num">{i + 1}.</span>
              <span className="pro-step-desc">{step.description}</span>
              <span className="pro-step-val">{step.value}</span>
            </div>
          ))}
        </div>
        <div className="pro-result">
          Результат: <strong>{data.result}</strong>
        </div>
      </div>
    </AccordionSection>
  );
}

/* ─── Helper: calculation table ─── */
function CalcTable({ rows, label, icon }) {
  if (!rows || rows.length === 0) return null;
  return (
    <AccordionSection icon={icon} title={label}>
      <table className="pro-table pro-table-compact">
        <thead>
          <tr>
            {Object.keys(rows[0]).map((k) => (
              <th key={k}>{k}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {Object.values(row).map((v, j) => (
                <td key={j}>{String(v)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </AccordionSection>
  );
}

/* ─── Helper: Destiny Matrix ─── */
function DestinyMatrix({ matrix }) {
  if (!matrix || !matrix.cells) return null;
  const cellLabels = {
    1: 'Характер', 2: 'Энергия', 3: 'Интерес',
    4: 'Здоровье', 5: 'Логика', 6: 'Труд',
    7: 'Удача', 8: 'Долг', 9: 'Память',
  };
  return (
    <AccordionSection icon="⬜" title="Матрица Судьбы (Квадрат Пифагора)">
      <div className="pro-matrix-grid">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
          const cell = matrix.cells[num];
          const count = cell?.count || 0;
          const color = numberColors[num] || 'var(--primary)';
          return (
            <div
              key={num}
              className="pro-matrix-cell"
              style={{
                border: `1px solid ${color}`,
                background: count > 0 ? `${color}18` : 'transparent',
              }}
            >
              <div className="pro-matrix-num" style={{ color }}>{num}</div>
              <div className="pro-matrix-count">
                {count > 0 ? '█'.repeat(Math.min(count, 5)) : '—'}
              </div>
              <div className="pro-matrix-label">{cellLabels[num]}</div>
              {cell?.description && (
                <div className="pro-matrix-desc">{cell.description}</div>
              )}
            </div>
          );
        })}
      </div>
      {matrix.workings && (
        <div className="pro-matrix-workings">
          <strong>Рабочие числа:</strong>{' '}
          {matrix.workings.first}, {matrix.workings.second}, {matrix.workings.third}, {matrix.workings.fourth}
        </div>
      )}
      {/* Rows / Columns / Diagonals */}
      <div className="pro-matrix-analytics">
        {matrix.rows && Object.entries(matrix.rows).map(([k, v]) => (
          <div key={k} className="pro-matrix-analytic-item">
            <span className="pro-matrix-analytic-label">{v.label}</span>
            <span className="pro-matrix-analytic-sum">{v.sum}</span>
          </div>
        ))}
      </div>
      <div className="pro-matrix-analytics">
        {matrix.columns && Object.entries(matrix.columns).map(([k, v]) => (
          <div key={k} className="pro-matrix-analytic-item">
            <span className="pro-matrix-analytic-label">{v.label}</span>
            <span className="pro-matrix-analytic-sum">{v.sum}</span>
          </div>
        ))}
      </div>
      <div className="pro-matrix-analytics">
        {matrix.diagonals && Object.entries(matrix.diagonals).map(([k, v]) => (
          <div key={k} className="pro-matrix-analytic-item">
            <span className="pro-matrix-analytic-label">{v.label}</span>
            <span className="pro-matrix-analytic-sum">{v.sum}</span>
          </div>
        ))}
      </div>
    </AccordionSection>
  );
}

/* ─── Helper: Karmic Tail ─── */
function KarmicTail({ karmicTail }) {
  if (!karmicTail) return null;
  return (
    <AccordionSection icon="🌀" title="Кармический хвост (Ладини)">
      <div className="pro-karmic-content">
        <div className="pro-karmic-sum">
          Сумма цифр даты: {karmicTail.totalSum?.value} → {karmicTail.totalSum?.reduced}
        </div>
        {karmicTail.karmicTailNumber && (
          <div className="pro-karmic-number">
            <strong>Кармический хвост: {karmicTail.karmicTailNumber.value}</strong>
            <p>{karmicTail.karmicTailNumber.description}</p>
          </div>
        )}
        {karmicTail.karmicNumbers && karmicTail.karmicNumbers.length > 0 && (
          <div className="pro-karmic-debts">
            <h4>Кармические числа</h4>
            {karmicTail.karmicNumbers.map((kn, i) => (
              <div key={i} className="pro-karmic-debt-item">
                <span className="pro-karmic-debt-num">{kn.number}</span>
                <span className="pro-karmic-debt-source">({kn.source})</span>
                <p>{kn.description}</p>
              </div>
            ))}
          </div>
        )}
        {karmicTail.missingDigits && karmicTail.missingDigits.length > 0 && (
          <div className="pro-karmic-missing">
            <h4>Отсутствующие цифры (кармические уроки)</h4>
            <div className="pro-karmic-missing-grid">
              {karmicTail.missingDigits.map((md, i) => (
                <div key={i} className="pro-karmic-missing-item">
                  <span className="pro-karmic-missing-digit">{md.digit}</span>
                  <span>{md.meaning}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {karmicTail.repeatedDigits && karmicTail.repeatedDigits.length > 0 && (
          <div className="pro-karmic-repeated">
            <h4>Повторяющиеся цифры</h4>
            {karmicTail.repeatedDigits.map((rd, i) => (
              <span key={i} className="pro-karmic-repeated-item">
                {rd.digit} (×{rd.count})
              </span>
            ))}
          </div>
        )}
        {karmicTail.karmicTasks && karmicTail.karmicTasks.length > 0 && (
          <div className="pro-karmic-tasks">
            <h4>Кармические задачи</h4>
            {karmicTail.karmicTasks.map((kt, i) => (
              <div key={i} className="pro-karmic-task-item">
                <strong>Цифра {kt.digit}:</strong> {kt.task}
                <br />
                <em>Сфера: {kt.area}</em>
              </div>
            ))}
          </div>
        )}
      </div>
    </AccordionSection>
  );
}

/* ─── Helper: Chakra Analysis ─── */
function ChakraAnalysis({ chakraAnalysis }) {
  if (!chakraAnalysis || !chakraAnalysis.chakras) return null;
  const chakras = Object.values(chakraAnalysis.chakras);
  return (
    <AccordionSection icon="🕉️" title="Чакровый анализ">
      <div className="pro-chakra-grid">
        {chakras.map((ch) => (
          <div
            key={ch.number}
            className={`pro-chakra-card ${ch.isActive ? 'active' : 'inactive'}`}
            style={{
              '--chakra-color': ch.color,
              borderLeft: `3px solid ${ch.isActive ? 'var(--primary)' : 'var(--border-color)'}`,
            }}
          >
            <div className="pro-chakra-header">
              <span className="pro-chakra-num">{ch.number}</span>
              <span className="pro-chakra-name">{ch.name}</span>
            </div>
            <div className="pro-chakra-body">
              <div className="pro-chakra-detail">
                <span className="pro-chakra-detail-label">Цвет</span>
                <span className="pro-chakra-detail-val">{ch.color}</span>
              </div>
              <div className="pro-chakra-detail">
                <span className="pro-chakra-detail-label">Расположение</span>
                <span className="pro-chakra-detail-val">{ch.location}</span>
              </div>
              <div className="pro-chakra-detail">
                <span className="pro-chakra-detail-label">Значение</span>
                <span className="pro-chakra-detail-val">{ch.meaning}</span>
              </div>
              <div className="pro-chakra-detail">
                <span className="pro-chakra-detail-label">Баланс</span>
                <span className="pro-chakra-detail-val">{ch.balance}</span>
              </div>
              {ch.influencingNumbers && ch.influencingNumbers.length > 0 && (
                <div className="pro-chakra-influences">
                  <span className="pro-chakra-detail-label">Влияющие числа:</span>
                  {ch.influencingNumbers.map((inf, i) => (
                    <span key={i} className="pro-chakra-influence-tag">
                      {inf.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {chakraAnalysis.summary && (
        <div className="pro-chakra-summary">{chakraAnalysis.summary}</div>
      )}
      {chakraAnalysis.dominantChakra && (
        <div className="pro-chakra-dominant">
          <strong>Доминирующая чакра:</strong>{' '}
          {chakraAnalysis.dominantChakra.name} ({chakraAnalysis.dominantChakra.number})
        </div>
      )}
    </AccordionSection>
  );
}

/* ─── Helper: Pinnacles with ages ─── */
function PinnaclesBlock({ pinnacles }) {
  if (!pinnacles) return null;
  const items = [pinnacles.first, pinnacles.second, pinnacles.third, pinnacles.fourth];
  return (
    <AccordionSection icon="🏛️" title="Пинакли с возрастными границами">
      <div className="pro-pinnacle-grid">
        {items.map((p, i) =>
          p ? (
            <div key={i} className="pro-pinnacle-card" style={{ borderTop: `3px solid ${numberColors[p.number] || 'var(--primary)'}` }}>
              <div className="pro-pinnacle-period">{p.ageRange}</div>
              <div className="pro-pinnacle-number" style={{ color: numberColors[p.number] }}>{p.number}</div>
              {p.description && <div className="pro-pinnacle-desc">{p.description}</div>}
            </div>
          ) : null
        )}
      </div>
    </AccordionSection>
  );
}

/* ─── Helper: Challenges with ages ─── */
function ChallengesBlock({ challenges }) {
  if (!challenges) return null;
  const items = [challenges.first, challenges.second, challenges.third, challenges.fourth];
  return (
    <AccordionSection icon="⚔️" title="Челленджи с возрастными границами">
      <div className="pro-pinnacle-grid">
        {items.map((c, i) =>
          c ? (
            <div key={i} className="pro-pinnacle-card" style={{ borderTop: `3px solid ${numberColors[c.number] || 'var(--primary)'}` }}>
              <div className="pro-pinnacle-period">{c.ageRange}{c.isMain ? ' (Главный)' : ''}</div>
              <div className="pro-pinnacle-number" style={{ color: numberColors[c.number] }}>{c.number}</div>
              {c.description && <div className="pro-pinnacle-desc">{c.description}</div>}
            </div>
          ) : null
        )}
      </div>
    </AccordionSection>
  );
}

/* ─── Helper: Professional Interpretation ─── */
function ProfessionalInterpretation({ interpretation }) {
  if (!interpretation) return null;
  return (
    <AccordionSection icon="📖" title="Профессиональная интерпретация">
      <div className="pro-interpretation-content">
        {interpretation.interpretations && interpretation.interpretations.map((text, i) => (
          <p key={i} className="pro-interpretation-paragraph">{text}</p>
        ))}
        {interpretation.fullText && !interpretation.interpretations && (
          <p className="pro-interpretation-paragraph">{interpretation.fullText}</p>
        )}
        {interpretation.references && interpretation.references.length > 0 && (
          <div className="pro-references">
            <h4>📚 Источники</h4>
            {interpretation.references.map((ref, i) => (
              <div key={i} className="pro-reference-item">
                <strong>{ref.author}</strong>: {ref.quote}
              </div>
            ))}
          </div>
        )}
      </div>
    </AccordionSection>
  );
}

/* ─── Helper: Metadata ─── */
function MetaBlock({ meta }) {
  if (!meta) return null;
  return (
    <div className="pro-meta">
      <span className="pro-meta-badge">Система: {meta.systemName || meta.system}</span>
      {meta.preserveMasters !== undefined && (
        <span className="pro-meta-badge">Мастер-числа: {meta.preserveMasters ? '✓' : '✗'}</span>
      )}
      {meta.preserveKarmicDebts !== undefined && (
        <span className="pro-meta-badge">Кармические долги: {meta.preserveKarmicDebts ? '✓' : '✗'}</span>
      )}
      {meta.timestamp && (
        <span className="pro-meta-badge">Расчёт: {new Date(meta.timestamp).toLocaleString('ru-RU')}</span>
      )}
    </div>
  );
}

/* ─── Export utilities ─── */
function ExportButtons({ data, fullName, birthDate }) {
  const [exporting, setExporting] = useState(null);

  const exportJSON = useCallback(() => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `numerology_pro_${fullName?.replace(/\s+/g, '_') || 'report'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [data, fullName]);

  const exportCSV = useCallback(() => {
    const rows = [['Параметр', 'Значение', 'Описание']];
    const kn = data?.keyNumbers;
    if (kn) {
      Object.entries(kn).forEach(([key, val]) => {
        if (val && typeof val === 'object' && val.value !== undefined) {
          rows.push([val.name || key, String(val.value), val.description || '']);
        }
      });
    }
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `numerology_pro_${fullName?.replace(/\s+/g, '_') || 'report'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [data, fullName]);

  const exportPDF = useCallback(async () => {
    setExporting('pdf');
    try {
      const { default: jsPDF } = await import('jspdf');
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      let y = 20;
      const margin = 20;
      const pageWidth = doc.internal.pageSize.getWidth();
      const maxWidth = pageWidth - margin * 2;

      doc.setFontSize(18);
      doc.text('Профессиональный нумерологический отчёт', margin, y);
      y += 10;
      doc.setFontSize(12);
      doc.text(`Имя: ${fullName || '—'}`, margin, y);
      y += 7;
      doc.text(`Дата рождения: ${birthDate || '—'}`, margin, y);
      y += 10;

      const kn = data?.keyNumbers;
      if (kn) {
        doc.setFontSize(14);
        doc.text('Ключевые числа:', margin, y);
        y += 8;
        doc.setFontSize(10);
        Object.entries(kn).forEach(([key, val]) => {
          if (val && typeof val === 'object' && val.value !== undefined) {
            const line = `${val.name || key}: ${val.value}`;
            if (y > 270) {
              doc.addPage();
              y = 20;
            }
            doc.text(line, margin + 5, y);
            y += 6;
          }
        });
      }

      doc.save(`numerology_pro_${fullName?.replace(/\s+/g, '_') || 'report'}.pdf`);
    } catch (err) {
      console.error('PDF export error:', err);
    } finally {
      setExporting(null);
    }
  }, [data, fullName, birthDate]);

  const exportSVG = useCallback(() => {
    setExporting('svg');
    try {
      const kn = data?.keyNumbers;
      const svgParts = [];
      svgParts.push(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="${kn ? Object.keys(kn).length * 40 + 100 : 400}" viewBox="0 0 800 ${kn ? Object.keys(kn).length * 40 + 100 : 400}">`);
      svgParts.push(`<rect width="100%" height="100%" fill="#1a1a2e"/>`);
      svgParts.push(`<text x="20" y="30" fill="#e0c080" font-size="20" font-weight="bold">Профессиональный нумерологический отчёт</text>`);
      svgParts.push(`<text x="20" y="55" fill="#aaa" font-size="14">${fullName || ''} | ${birthDate || ''}</text>`);
      if (kn) {
        let y = 85;
        Object.entries(kn).forEach(([key, val]) => {
          if (val && typeof val === 'object' && val.value !== undefined) {
            const color = numberColors[val.value] || '#e0c080';
            svgParts.push(`<text x="20" y="${y}" fill="${color}" font-size="16">${val.name || key}: ${val.value}</text>`);
            y += 35;
          }
        });
      }
      svgParts.push('</svg>');
      const blob = new Blob([svgParts.join('\n')], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `numerology_pro_${fullName?.replace(/\s+/g, '_') || 'report'}.svg`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('SVG export error:', err);
    } finally {
      setExporting(null);
    }
  }, [data, fullName]);

  return (
    <div className="pro-export-buttons">
      <button className="btn btn-sm btn-outline" onClick={exportJSON} disabled={exporting === 'json'}>
        {exporting === 'json' ? '⏳' : '📥'} JSON
      </button>
      <button className="btn btn-sm btn-outline" onClick={exportCSV} disabled={exporting === 'csv'}>
        {exporting === 'csv' ? '⏳' : '📥'} CSV
      </button>
      <button className="btn btn-sm btn-outline" onClick={exportPDF} disabled={exporting === 'pdf'}>
        {exporting === 'pdf' ? '⏳' : '📥'} PDF
      </button>
      <button className="btn btn-sm btn-outline" onClick={exportSVG} disabled={exporting === 'svg'}>
        {exporting === 'svg' ? '⏳' : '📥'} SVG
      </button>
    </div>
  );
}

/* ─── MAIN COMPONENT ─── */
export default function NumerologyProReport({ data, fullName, birthDate }) {
  if (!data) return null;

  const {
    keyNumbers,
    letterBreakdown,
    intermediateSums,
    tables,
    pinnacles,
    challenges,
    destinyMatrix,
    karmicTail,
    chakraAnalysis,
    professionalInterpretation,
    meta,
  } = data;

  return (
    <motion.div
      className="report-container pro-report-container"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
      }}
    >
      {/* ── Header ── */}
      <motion.div className="report-header pro-header" variants={blockVariants}>
        <span className="report-header-icon">🎯</span>
        <h2 className="report-title">Профессиональный нумерологический отчёт</h2>
        <span className="report-badge pro-badge">PRO</span>
      </motion.div>

      {/* ── Person Info ── */}
      <motion.div className="report-person-info" variants={blockVariants}>
        <div className="report-person-detail">
          <span className="report-label">Ищущий:</span>
          <span className="report-value">{fullName || '—'}</span>
        </div>
        <div className="report-person-detail">
          <span className="report-label">Дата рождения:</span>
          <span className="report-value">{birthDate || '—'}</span>
        </div>
      </motion.div>

      {/* ── Export Buttons ── */}
      <motion.div variants={blockVariants}>
        <ExportButtons data={data} fullName={fullName} birthDate={birthDate} />
      </motion.div>

      {/* ── Metadata ── */}
      {meta && (
        <motion.div variants={blockVariants}>
          <MetaBlock meta={meta} />
        </motion.div>
      )}

      {/* ── 1. Key Numbers (15+) ── */}
      {keyNumbers && (
        <motion.div className="report-interpretation-block" variants={blockVariants}>
          <h3 className="report-block-title">
            <span style={{ fontSize: '1.2em' }}>🔢</span>
            15+ ключевых чисел
          </h3>
          <div className="report-block-content">
            <div className="pro-numbers-grid">
              {Object.entries(keyNumbers).map(([key, item]) => {
                // Skip non-number fields
                if (key === 'masterNumbers' || key === 'karmicDebts' || key === 'pythagoreanWorkings' || key === 'totalDateSum') return null;
                if (key.startsWith('pinnacle') || key.startsWith('challenge')) return null;
                return <KeyNumberCard key={key} item={item} />;
              })}
            </div>
            {/* Master Numbers */}
            {keyNumbers.masterNumbers && keyNumbers.masterNumbers.length > 0 && (
              <div className="pro-master-numbers">
                <h4>🌟 Мастер-числа</h4>
                {keyNumbers.masterNumbers.map((mn, i) => (
                  <span key={i} className="pro-master-tag">{mn.name}</span>
                ))}
              </div>
            )}
            {/* Karmic Debts */}
            {keyNumbers.karmicDebts?.hasDebt && (
              <div className="pro-karmic-debts-summary">
                <h4>🌀 Кармические долги</h4>
                {keyNumbers.karmicDebts.lifePath?.hasDebt && (
                  <div>Число Судьбы: {keyNumbers.karmicDebts.lifePath.name} — {keyNumbers.karmicDebts.lifePath.description}</div>
                )}
                {keyNumbers.karmicDebts.expression?.hasDebt && (
                  <div>Число Выражения: {keyNumbers.karmicDebts.expression.name} — {keyNumbers.karmicDebts.expression.description}</div>
                )}
              </div>
            )}
            {/* Pythagorean Workings */}
            {keyNumbers.pythagoreanWorkings && (
              <div className="pro-pythagorean-workings">
                <h4>📐 Рабочие числа (Квадрат Пифагора)</h4>
                <div>
                  1-е: {keyNumbers.pythagoreanWorkings.first}, 2-е: {keyNumbers.pythagoreanWorkings.second},
                  3-е: {keyNumbers.pythagoreanWorkings.third}, 4-е: {keyNumbers.pythagoreanWorkings.fourth}
                </div>
              </div>
            )}
            {/* Total Date Sum */}
            {keyNumbers.totalDateSum && (
              <div className="pro-total-date-sum">
                <h4>📅 Сумма даты рождения</h4>
                <div>{keyNumbers.totalDateSum.raw} → {keyNumbers.totalDateSum.value}</div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* ── 2. Letter Breakdown ── */}
      {letterBreakdown && (
        <motion.div className="report-interpretation-block" variants={blockVariants}>
          <h3 className="report-block-title">
            <span style={{ fontSize: '1.2em' }}>📝</span>
            Разбивка по буквам
          </h3>
          <div className="report-block-content">
            <div className="pro-letter-grid">
              <LetterTable breakdown={{ surname: letterBreakdown.surname }} label="Фамилия" />
              <LetterTable breakdown={{ firstName: letterBreakdown.firstName }} label="Имя" />
              <LetterTable breakdown={{ patronymic: letterBreakdown.patronymic }} label="Отчество" />
            </div>
          </div>
        </motion.div>
      )}

      {/* ── 3. Intermediate Sums ── */}
      {intermediateSums && (
        <motion.div className="report-interpretation-block" variants={blockVariants}>
          <h3 className="report-block-title">
            <span style={{ fontSize: '1.2em' }}>🧮</span>
            Промежуточные суммы
          </h3>
          <div className="report-block-content">
            <IntermediateSumBlock data={intermediateSums.lifePath} title="Число Судьбы (Life Path)" icon="🔢" />
            <IntermediateSumBlock data={intermediateSums.expression} title="Число Выражения (Expression)" icon="📝" />
            <IntermediateSumBlock data={intermediateSums.soulUrge} title="Число Души (Soul Urge)" icon="💖" />
            <IntermediateSumBlock data={intermediateSums.personality} title="Число Личности (Personality)" icon="🎭" />
            <IntermediateSumBlock data={intermediateSums.maturity} title="Число Зрелости (Maturity)" icon="🌳" />
            <IntermediateSumBlock data={intermediateSums.balance} title="Число Баланса (Balance)" icon="⚖️" />
          </div>
        </motion.div>
      )}

      {/* ── 4. Calculation Tables ── */}
      {tables && (
        <motion.div className="report-interpretation-block" variants={blockVariants}>
          <h3 className="report-block-title">
            <span style={{ fontSize: '1.2em' }}>📊</span>
            Таблицы расчёта
          </h3>
          <div className="report-block-content">
            <CalcTable rows={tables.expression} label="Число Выражения (по буквам)" icon="📝" />
            <CalcTable rows={tables.soulUrge} label="Число Души (гласные)" icon="💖" />
            <CalcTable rows={tables.personality} label="Число Личности (согласные)" icon="🎭" />
            <CalcTable rows={tables.pinnacles} label="Пинакли" icon="🏛️" />
            <CalcTable rows={tables.challenges} label="Челленджи" icon="⚔️" />
          </div>
        </motion.div>
      )}

      {/* ── 5. Pinnacles with Ages ── */}
      {pinnacles && (
        <motion.div variants={blockVariants}>
          <PinnaclesBlock pinnacles={pinnacles} />
        </motion.div>
      )}

      {/* ── 6. Challenges with Ages ── */}
      {challenges && (
        <motion.div variants={blockVariants}>
          <ChallengesBlock challenges={challenges} />
        </motion.div>
      )}

      {/* ── 7. Destiny Matrix ── */}
      {destinyMatrix && (
        <motion.div variants={blockVariants}>
          <DestinyMatrix matrix={destinyMatrix} />
        </motion.div>
      )}

      {/* ── 8. Karmic Tail ── */}
      {karmicTail && (
        <motion.div variants={blockVariants}>
          <KarmicTail karmicTail={karmicTail} />
        </motion.div>
      )}

      {/* ── 9. Chakra Analysis ── */}
      {chakraAnalysis && (
        <motion.div variants={blockVariants}>
          <ChakraAnalysis chakraAnalysis={chakraAnalysis} />
        </motion.div>
      )}

      {/* ── 10. Professional Interpretation ── */}
      {professionalInterpretation && (
        <motion.div variants={blockVariants}>
          <ProfessionalInterpretation interpretation={professionalInterpretation} />
        </motion.div>
      )}
    </motion.div>
  );
}