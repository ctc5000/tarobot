import { motion } from 'framer-motion';
import { blockVariants, formatText, renderHtmlContent, renderNestedValue } from './reportUtils';
import NatalChartWheel from './astrology/NatalChartWheel';
import PlanetChart from './astrology/PlanetChart';
import HouseChart from './astrology/HouseChart';
import AspectChart from './astrology/AspectChart';
import ExpandedInterpretation from './astrology/ExpandedInterpretation';

const HOUSE_SYSTEM_NAMES = {
  placidus: 'Плацидус',
  whole: 'Целодомная',
  equal: 'Равнодомная',
  koch: 'Кох',
  porphyry: 'Порфирий',
  regiomontanus: 'Региомонтан',
  campanus: 'Кампанус',
  topocentric: 'Топоцентрическая',
};

export default function AstrologyReport({ data }) {
  if (!data) return null;

  const planets = data.planets || {};
  const houses = data.houses || [];
  const aspects = data.aspects || [];
  const ascendant = data.ascendant || {};
  const chartData = data.chartData || {};
  const houseSystem = data.houseSystem || '';

  return (
    <motion.div className="report-container" initial="hidden" animate="visible" variants={{
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
    }}>
      <motion.div className="report-header" variants={blockVariants}>
        <span className="report-header-icon">🌠</span>
        <h2 className="report-title">Натальная карта</h2>
        <span className="report-badge">Астрологический расчет</span>
      </motion.div>

      <motion.div className="report-person-info" variants={blockVariants}>
        <div className="report-person-detail">
          <span className="report-label">Ищущий:</span>
          <span className="report-value">{data.fullName}</span>
        </div>
        <div className="report-person-detail">
          <span className="report-label">Дата рождения:</span>
          <span className="report-value">{data.birthDate} {data.birthTime ? `в ${data.birthTime}` : ''}</span>
        </div>
        {data.latitude && data.longitude && (
          <div className="report-person-detail">
            <span className="report-label">Координаты:</span>
            <span className="report-value">{data.latitude}, {data.longitude}</span>
          </div>
        )}
        {houseSystem && (
          <div className="report-person-detail">
            <span className="report-label">Система домов:</span>
            <span className="astrology-house-system-badge">
              🏛️ {HOUSE_SYSTEM_NAMES[houseSystem.toLowerCase()] || houseSystem}
            </span>
          </div>
        )}
      </motion.div>

      {/* Natal Chart Wheel */}
      {chartData && chartData.cusps && chartData.cusps.length > 0 && (
        <motion.div className="report-interpretation-block" variants={blockVariants}>
          <h3 className="report-block-title">
            <span style={{ fontSize: '1.2em' }}>🌀</span>
            Натальная карта
          </h3>
          <div className="report-block-content">
            <NatalChartWheel chartData={chartData} planets={planets} houses={houses} ascendant={ascendant} aspects={aspects} />
          </div>
        </motion.div>
      )}

      {/* Ascendant */}
      {ascendant && (ascendant.sign || ascendant.degree !== undefined) && (
        <motion.div className="report-interpretation-block" variants={blockVariants}>
          <h3 className="report-block-title">
            <span style={{ fontSize: '1.2em' }}>⬆️</span>
            Асцендент
          </h3>
          <div className="report-block-content">
            <div className="report-horizontal-item" style={{ borderLeft: '3px solid var(--primary)' }}>
              <span className="report-horizontal-label">Знак асцендента</span>
              <span className="report-horizontal-value">{ascendant.sign || '—'}</span>
              <span className="report-text">Градус: {ascendant.degreeInSign || (ascendant.degree != null ? `${Number(ascendant.degree).toFixed(1)}°` : '—')}</span>
              {ascendant.description && <p className="report-text">{ascendant.description}</p>}
            </div>
          </div>
        </motion.div>
      )}

      {/* Planets - animated SVG chart */}
      {Object.keys(planets).length > 0 && (
        <motion.div className="report-interpretation-block" variants={blockVariants}>
          <h3 className="report-block-title">
            <span style={{ fontSize: '1.2em' }}>🪐</span>
            Положение планет
          </h3>
          <div className="report-block-content">
            <PlanetChart planets={planets} />
          </div>
        </motion.div>
      )}

      {/* Houses - SVG wheel + grid */}
      {houses.length > 0 && (
        <motion.div className="report-interpretation-block" variants={blockVariants}>
          <h3 className="report-block-title">
            <span style={{ fontSize: '1.2em' }}>🏠</span>
            Дома гороскопа
          </h3>
          <div className="report-block-content">
            <HouseChart houses={houses} />
          </div>
        </motion.div>
      )}

      {/* Aspects - styled cards */}
      {aspects.length > 0 && (
        <motion.div className="report-interpretation-block" variants={blockVariants}>
          <h3 className="report-block-title">
            <span style={{ fontSize: '1.2em' }}>🔗</span>
            Аспекты
          </h3>
          <div className="report-block-content">
            <AspectChart aspects={aspects} />
          </div>
        </motion.div>
      )}

      {/* Interpretation */}
      {data.interpretation && (
        <motion.div className="report-interpretation-block" variants={blockVariants}>
          <h3 className="report-block-title">
            <span style={{ fontSize: '1.2em' }}>📜</span>
            Интерпретация
          </h3>
          <div className="report-block-content">{renderHtmlContent(data.interpretation)}</div>
        </motion.div>
      )}

      {/* Expanded Interpretation with animated element bars */}
      {data.expandedInterpretation && (
        <motion.div className="report-interpretation-block" variants={blockVariants}>
          <h3 className="report-block-title">
            <span style={{ fontSize: '1.2em' }}>📖</span>
            Расширенный отчет
          </h3>
          <div className="report-block-content">
            <ExpandedInterpretation data={data} />
          </div>
        </motion.div>
      )}

      {/* Karma Analysis (if not already in expanded) */}
      {data.karmaAnalysis && !data.expandedInterpretation && (
        <motion.div className="report-interpretation-block" variants={blockVariants}>
          <h3 className="report-block-title">
            <span style={{ fontSize: '1.2em' }}>🌀</span>
            Кармический анализ
          </h3>
          <div className="report-block-content">
            {typeof data.karmaAnalysis === 'string' ? renderHtmlContent(data.karmaAnalysis) : renderNestedValue(data.karmaAnalysis)}
          </div>
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
              : renderHtmlContent(data.recommendations)
            }
          </div>
        </motion.div>
      )}

      {/* Transits */}
      {data.transits && (
        <motion.div className="report-interpretation-block" variants={blockVariants}>
          <h3 className="report-block-title">
            <span style={{ fontSize: '1.2em' }}>🔄</span>
            Транзитный прогноз
          </h3>
          <div className="report-block-content">
            {typeof data.transits === 'string' ? renderHtmlContent(data.transits) : renderNestedValue(data.transits)}
          </div>
        </motion.div>
      )}

      {/* Render any remaining data as horizontal blocks (excluding tariffCode, chartData, houseSystem) */}
      {Object.entries(data).filter(([k]) => !['planets','houses','aspects','ascendant','chartData','fullName','birthDate','birthTime','latitude','longitude','interpretation','expandedInterpretation','karmaAnalysis','recommendations','transits','tariffCode','houseSystem','id','createdAt','updatedAt','userId','serviceId','__v'].includes(k)).map(([key, val]) => (
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