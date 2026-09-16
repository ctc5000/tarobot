import { motion } from 'framer-motion';
import { useMemo } from 'react';

const ZODIAC_SIGNS = ['Овен','Телец','Близнецы','Рак','Лев','Дева','Весы','Скорпион','Стрелец','Козерог','Водолей','Рыбы'];
const ZODIAC_SYMBOLS = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];
const ELEMENT_COLORS = { 'Огонь':'#ff4d4d','Земля':'#4caf50','Воздух':'#4dabf5','Вода':'#4dd0e1' };
const PLANET_SYMBOLS = { sun:'☉',moon:'☽',mercury:'☿',venus:'♀',mars:'♂',jupiter:'♃',saturn:'♄',uranus:'♅',neptune:'♆',pluto:'♇' };
const PLANET_COLORS = { sun:'#ffd700',moon:'#c0c0c0',mercury:'#8bc34a',venus:'#e91e63',mars:'#f44336',jupiter:'#ff9800',saturn:'#795548',uranus:'#00bcd4',neptune:'#3f51b5',pluto:'#9c27b0' };
const ASPECT_COLORS = { conjunction:'#9c27b0', trine:'#4caf50', sextile:'#8bc34a', square:'#f44336', opposition:'#ff9800' };

function getSignIndex(deg) {
  return Math.floor(((deg % 360) + 360) % 360 / 30);
}

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

/** Map Russian planet name → key used in planets object */
function getPlanetKey(name) {
  const map = { 'Солнце':'sun','Луна':'moon','Меркурий':'mercury','Венера':'venus','Марс':'mars','Юпитер':'jupiter','Сатурн':'saturn','Уран':'uranus','Нептун':'neptune','Плутон':'pluto' };
  return map[name] || name?.toLowerCase();
}

export default function NatalChartWheel({ chartData, planets, houses, ascendant, aspects }) {
  const cx = 250, cy = 250, outerR = 220, innerR = 170, houseR = 195, signR = 205;

  const houseArcs = useMemo(() => {
    if (!houses || houses.length === 0) return [];
    return houses.map((h, i) => {
      const startAngle = h.cusp;
      const nextHouse = houses[(i + 1) % 12];
      const endAngle = nextHouse.cusp;
      const midAngle = (startAngle + endAngle) / 2;
      const signIdx = getSignIndex(midAngle);
      return { ...h, startAngle, endAngle, midAngle, signIdx, sign: ZODIAC_SIGNS[signIdx], symbol: ZODIAC_SYMBOLS[signIdx] };
    });
  }, [houses]);

  const planetPositions = useMemo(() => {
    if (!planets) return [];
    return Object.entries(planets).map(([key, p]) => {
      const angle = p.longitude || 0;
      const pos = polarToCartesian(cx, cy, houseR - 15, angle);
      return { key, name: p.name, angle, ...pos, color: PLANET_COLORS[key] || '#fff', symbol: PLANET_SYMBOLS[key] || '●' };
    });
  }, [planets]);

  const ascPos = useMemo(() => {
    if (!ascendant || ascendant.degree === undefined) return null;
    return polarToCartesian(cx, cy, outerR + 10, ascendant.degree);
  }, [ascendant]);

  /** Build aspect lines: connect two planet positions with a line through the chart */
  const aspectLines = useMemo(() => {
    if (!aspects || aspects.length === 0 || planetPositions.length === 0) return [];
    // Build a lookup: planet name → position object
    const posByKey = {};
    planetPositions.forEach(p => { posByKey[p.key] = p; });
    // Also map Russian names
    const posByName = {};
    planetPositions.forEach(p => { posByName[p.name] = p; });

    return aspects.map((a, i) => {
      const p1Key = getPlanetKey(a.planet1);
      const p2Key = getPlanetKey(a.planet2);
      const p1 = posByKey[p1Key] || posByName[a.planet1];
      const p2 = posByKey[p2Key] || posByName[a.planet2];
      if (!p1 || !p2) return null;
      const type = a.type || 'conjunction';
      const color = ASPECT_COLORS[type] || 'var(--primary)';
      const orb = typeof a.orb === 'number' ? a.orb : parseFloat(a.orb) || 0;
      // Draw line from p1 to p2, passing through the chart
      // Use a slightly inner radius so lines don't overlap planet labels
      const r1 = houseR - 15; // same as planetPositions radius
      const r2 = houseR - 15;
      const p1Pos = polarToCartesian(cx, cy, r1, p1.angle);
      const p2Pos = polarToCartesian(cx, cy, r2, p2.angle);
      return {
        id: i,
        x1: p1Pos.x, y1: p1Pos.y,
        x2: p2Pos.x, y2: p2Pos.y,
        color,
        type,
        orb,
        planet1: a.planet1,
        planet2: a.planet2,
        description: a.description || '',
      };
    }).filter(Boolean);
  }, [aspects, planetPositions]);

  return (
    <motion.div
      className="astrology-chart-container"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <svg viewBox="0 0 500 500" className="astrology-chart-svg">
        <defs>
          <radialGradient id="chartGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(201,165,75,0.06)" />
            <stop offset="100%" stopColor="rgba(201,165,75,0)" />
          </radialGradient>
          <filter id="planetGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="starGlow">
            <feGaussianBlur stdDeviation="1.5" />
          </filter>
        </defs>

        {/* Background glow */}
        <circle cx={cx} cy={cy} r={outerR + 20} fill="url(#chartGlow)" />

        {/* Outer ring - zodiac signs */}
        {Array.from({ length: 12 }).map((_, i) => {
          const startAngle = i * 30;
          const endAngle = (i + 1) * 30;
          const midAngle = startAngle + 15;
          const p1 = polarToCartesian(cx, cy, outerR, startAngle);
          const p2 = polarToCartesian(cx, cy, outerR, endAngle);
          const p3 = polarToCartesian(cx, cy, signR, endAngle);
          const p4 = polarToCartesian(cx, cy, signR, startAngle);
          const labelPos = polarToCartesian(cx, cy, signR + 8, midAngle);
          const isEven = i % 2 === 0;
          return (
            <g key={`sign-${i}`}>
              <path d={`M ${p1.x} ${p1.y} A ${outerR} ${outerR} 0 0 1 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${signR} ${signR} 0 0 0 ${p4.x} ${p4.y} Z`}
                fill={isEven ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.06)'}
                stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"
              />
              <text x={labelPos.x} y={labelPos.y} textAnchor="middle" dominantBaseline="central"
                fill="var(--text-muted)" fontSize="11" fontWeight="500">
                {ZODIAC_SYMBOLS[i]}
              </text>
            </g>
          );
        })}

        {/* House arcs */}
        {houseArcs.map((h, i) => {
          const p1 = polarToCartesian(cx, cy, houseR, h.startAngle);
          const p2 = polarToCartesian(cx, cy, houseR, h.endAngle);
          const p3 = polarToCartesian(cx, cy, innerR, h.endAngle);
          const p4 = polarToCartesian(cx, cy, innerR, h.startAngle);
          const midPos = polarToCartesian(cx, cy, (houseR + innerR) / 2, h.midAngle);
          const color = ELEMENT_COLORS[h.element] || 'var(--primary)';
          return (
            <g key={`house-${i}`}>
              <motion.path
                d={`M ${p1.x} ${p1.y} A ${houseR} ${houseR} 0 0 1 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${innerR} ${innerR} 0 0 0 ${p4.x} ${p4.y} Z`}
                fill="rgba(255,255,255,0.02)"
                stroke={color} strokeWidth="0.8" strokeOpacity="0.4"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
              />
              <text x={midPos.x} y={midPos.y} textAnchor="middle" dominantBaseline="central"
                fill={color} fontSize="10" fontWeight="600" opacity="0.7">
                {h.number}
              </text>
            </g>
          );
        })}

        {/* Inner circle */}
        <circle cx={cx} cy={cy} r={innerR} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        <circle cx={cx} cy={cy} r={30} fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

        {/* Center text */}
        <text x={cx} y={cy - 6} textAnchor="middle" fill="var(--text-muted)" fontSize="9">Натальная</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill="var(--text-muted)" fontSize="9">карта</text>

        {/* Cusp lines */}
        {houseArcs.map((h, i) => {
          const p = polarToCartesian(cx, cy, outerR, h.startAngle);
          return (
            <line key={`cusp-${i}`} x1={cx} y1={cy} x2={p.x} y2={p.y}
              stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
          );
        })}

        {/* Aspect connection lines — criss-cross through the chart */}
        {aspectLines.map((a, i) => (
          <motion.g key={`aspect-line-${a.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.15 + i * 0.03 }}
          >
            {/* Glow under line */}
            <line x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2}
              stroke={a.color} strokeWidth="4" strokeOpacity="0.15"
              strokeLinecap="round"
            />
            {/* Main line */}
            <line x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2}
              stroke={a.color} strokeWidth="1.5" strokeOpacity="0.6"
              strokeLinecap="round" strokeDasharray={a.type === 'sextile' ? '6,4' : a.type === 'trine' ? '4,4' : 'none'}
            />
            {/* Orb label at midpoint */}
            <text
              x={(a.x1 + a.x2) / 2} y={(a.y1 + a.y2) / 2}
              textAnchor="middle" dominantBaseline="central"
              fill={a.color} fontSize="7" opacity="0.5"
            >
              {a.orb.toFixed(1)}°
            </text>
          </motion.g>
        ))}

        {/* Planets */}
        {planetPositions.map((p, i) => (
          <motion.g key={p.key}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.06 }}
          >
            <circle cx={p.x} cy={p.y} r={10} fill={`${p.color}22`} filter="url(#planetGlow)" />
            <circle cx={p.x} cy={p.y} r={7} fill="#1a1a2e" stroke={p.color} strokeWidth="1.5" />
            <text x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central"
              fill={p.color} fontSize="10" fontWeight="700">
              {p.symbol}
            </text>
            <text x={p.x} y={p.y + 16} textAnchor="middle" fill={p.color} fontSize="7" opacity="0.8">
              {p.name}
            </text>
          </motion.g>
        ))}

        {/* Ascendant marker */}
        {ascPos && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
            <line x1={ascPos.x} y1={ascPos.y - 12} x2={ascPos.x} y2={ascPos.y + 12}
              stroke="var(--primary)" strokeWidth="2" />
            <line x1={ascPos.x - 8} y1={ascPos.y} x2={ascPos.x + 8} y2={ascPos.y}
              stroke="var(--primary)" strokeWidth="2" />
            <text x={ascPos.x} y={ascPos.y - 18} textAnchor="middle" fill="var(--primary)" fontSize="9" fontWeight="700">
              ASC
            </text>
          </motion.g>
        )}
      </svg>
    </motion.div>
  );
}