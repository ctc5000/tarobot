import { motion } from 'framer-motion';
import { useMemo } from 'react';

const PLANET_SYMBOLS = { sun:'☉',moon:'☽',mercury:'☿',venus:'♀',mars:'♂',jupiter:'♃',saturn:'♄',uranus:'♅',neptune:'♆',pluto:'♇' };
const PLANET_COLORS = { sun:'#ffd700',moon:'#c0c0c0',mercury:'#8bc34a',venus:'#e91e63',mars:'#f44336',jupiter:'#ff9800',saturn:'#795548',uranus:'#00bcd4',neptune:'#3f51b5',pluto:'#9c27b0' };
const ASPECT_COLORS = { conjunction:'#9c27b0', trine:'#4caf50', sextile:'#8bc34a', square:'#f44336', opposition:'#ff9800' };
const ASPECT_NAMES = { conjunction:'Соединение', trine:'Трин', sextile:'Секстиль', square:'Квадратура', opposition:'Оппозиция' };
const ASPECT_ICONS = { conjunction:'⚡', trine:'✨', sextile:'🔗', square:'✖', opposition:'⟷' };

function getPlanetKey(name) {
  const map = { 'Солнце':'sun','Луна':'moon','Меркурий':'mercury','Венера':'venus','Марс':'mars','Юпитер':'jupiter','Сатурн':'saturn','Уран':'uranus','Нептун':'neptune','Плутон':'pluto' };
  return map[name] || name?.toLowerCase();
}

export default function AspectChart({ aspects }) {
  const aspectData = useMemo(() => {
    if (!aspects || aspects.length === 0) return [];
    return aspects.map((a, i) => {
      const p1Key = getPlanetKey(a.planet1);
      const p2Key = getPlanetKey(a.planet2);
      const type = a.type || 'conjunction';
      return {
        ...a,
        id: i,
        p1Key, p2Key,
        p1Symbol: PLANET_SYMBOLS[p1Key] || '●',
        p2Symbol: PLANET_SYMBOLS[p2Key] || '●',
        p1Color: PLANET_COLORS[p1Key] || '#fff',
        p2Color: PLANET_COLORS[p2Key] || '#fff',
        aspectColor: ASPECT_COLORS[type] || 'var(--primary)',
        aspectName: ASPECT_NAMES[type] || type,
        aspectIcon: ASPECT_ICONS[type] || '◆',
        orb: typeof a.orb === 'number' ? a.orb : parseFloat(a.orb) || 0,
      };
    });
  }, [aspects]);

  if (aspectData.length === 0) return null;

  return (
    <motion.div className="astrology-aspect-container"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
    >
      <div className="astrology-aspect-list">
        {aspectData.map((a, i) => (
          <motion.div key={a.id} className="astrology-aspect-card"
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: i * 0.03 }}
            style={{ borderLeft: `3px solid ${a.aspectColor}` }}
          >
            {/* Left: planet symbols */}
            <div className="astrology-aspect-planets">
              <div className="astrology-aspect-planet" style={{ color: a.p1Color }}>
                <span className="astrology-aspect-planet-symbol">{a.p1Symbol}</span>
                <span className="astrology-aspect-planet-name">{a.planet1}</span>
              </div>
              <div className="astrology-aspect-connector" style={{ color: a.aspectColor }}>
                <span className="astrology-aspect-icon">{a.aspectIcon}</span>
                <span className="astrology-aspect-type" style={{ background: a.aspectColor }}>{a.aspectName}</span>
                <span className="astrology-aspect-orb">орб {a.orb.toFixed(1)}°</span>
              </div>
              <div className="astrology-aspect-planet" style={{ color: a.p2Color }}>
                <span className="astrology-aspect-planet-symbol">{a.p2Symbol}</span>
                <span className="astrology-aspect-planet-name">{a.planet2}</span>
              </div>
            </div>
            {/* Right: description */}
            <div className="astrology-aspect-desc">{a.description}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}