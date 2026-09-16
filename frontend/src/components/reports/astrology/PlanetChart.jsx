import { motion } from 'framer-motion';
import { useMemo } from 'react';

const PLANET_ICONS = { sun:'☉',moon:'☽',mercury:'☿',venus:'♀',mars:'♂',jupiter:'♃',saturn:'♄',uranus:'♅',neptune:'♆',pluto:'♇' };
const PLANET_COLORS = { sun:'#ffd700',moon:'#c0c0c0',mercury:'#8bc34a',venus:'#e91e63',mars:'#f44336',jupiter:'#ff9800',saturn:'#795548',uranus:'#00bcd4',neptune:'#3f51b5',pluto:'#9c27b0' };
const ZODIAC_SIGNS = ['Овен','Телец','Близнецы','Рак','Лев','Дева','Весы','Скорпион','Стрелец','Козерог','Водолей','Рыбы'];
const ZODIAC_SYMBOLS = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];
const ELEMENT_COLORS = { 'Огонь':'#ff4d4d','Земля':'#4caf50','Воздух':'#4dabf5','Вода':'#4dd0e1' };

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function getSignIndex(deg) {
  return Math.floor((((deg % 360) + 360) % 360) / 30);
}

export default function PlanetChart({ planets }) {
  const cx = 250, cy = 250, chartR = 200;

  const stars = useMemo(() => {
    return Array.from({ length: 80 }, (_, i) => ({
      id: i, x: Math.random() * 500, y: Math.random() * 500,
      r: Math.random() * 2 + 0.5, opacity: Math.random() * 0.6 + 0.2,
      delay: Math.random() * 3
    }));
  }, []);

  const nebulaBlobs = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => ({
      id: i, cx: 100 + Math.random() * 300, cy: 100 + Math.random() * 300,
      r: 60 + Math.random() * 100, color: ['#ff4d4d33','#4caf5033','#4dabf533','#4dd0e133','#9c27b033','#ffd70033'][i],
      delay: i * 0.3
    }));
  }, []);

  const planetData = useMemo(() => {
    if (!planets) return [];
    return Object.entries(planets).map(([key, p]) => {
      const angle = p.longitude || 0;
      const pos = polarToCartesian(cx, cy, chartR - 20, angle);
      const signIdx = getSignIndex(angle);
      return { key, name: p.name, sign: ZODIAC_SIGNS[signIdx], symbol: ZODIAC_SYMBOLS[signIdx], element: p.element, ...pos, color: PLANET_COLORS[key] || '#fff', icon: PLANET_ICONS[key] || '●', meaning: p.planetMeaning || '', signDesc: p.signDescription || '' };
    });
  }, [planets]);

  return (
    <motion.div className="astrology-chart-container"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
    >
      <svg viewBox="0 0 500 500" className="astrology-chart-svg">
        <defs>
          <filter id="nebulaBlur"><feGaussianBlur stdDeviation="30" /></filter>
          <filter id="planetGlow2"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <radialGradient id="bgGrad"><stop offset="0%" stopColor="rgba(201,165,75,0.04)" /><stop offset="100%" stopColor="transparent" /></radialGradient>
        </defs>

        {/* Background */}
        <rect x="0" y="0" width="500" height="500" fill="#0d0d1a" rx="20" />

        {/* Nebula blobs */}
        {nebulaBlobs.map((b) => (
          <motion.circle key={b.id} cx={b.cx} cy={b.cy} r={b.r} fill={b.color} filter="url(#nebulaBlur)"
            initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, delay: b.delay, repeat: Infinity, repeatType: 'mirror' }}
          />
        ))}

        {/* Stars */}
        {stars.map((s) => (
          <motion.circle key={s.id} cx={s.x} cy={s.y} r={s.r} fill="#fff"
            initial={{ opacity: 0 }} animate={{ opacity: s.opacity }}
            transition={{ duration: 1, delay: s.delay, repeat: Infinity, repeatType: 'mirror' }}
          />
        ))}

        {/* Zodiac ring */}
        <circle cx={cx} cy={cy} r={chartR} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = i * 30 + 15;
          const pos = polarToCartesian(cx, cy, chartR + 14, a);
          return (
            <text key={`z-${i}`} x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="central"
              fill="var(--text-muted)" fontSize="12" opacity="0.6">{ZODIAC_SYMBOLS[i]}</text>
          );
        })}

        {/* Inner rings */}
        <circle cx={cx} cy={cy} r={chartR * 0.7} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" strokeDasharray="4,4" />
        <circle cx={cx} cy={cy} r={chartR * 0.4} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" strokeDasharray="4,4" />

        {/* Center glow */}
        <circle cx={cx} cy={cy} r={40} fill="url(#bgGrad)" />

        {/* Planet orbit lines */}
        {planetData.map((p, i) => {
          const r = chartR - 20 - i * 12;
          return (
            <circle key={`orbit-${i}`} cx={cx} cy={cy} r={r}
              fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
          );
        })}

        {/* Planets */}
        {planetData.map((p, i) => (
          <motion.g key={p.key}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 + i * 0.08 }}
          >
            {/* Glow */}
            <circle cx={p.x} cy={p.y} r={14} fill={`${p.color}22`} filter="url(#planetGlow2)" />
            {/* Planet body */}
            <circle cx={p.x} cy={p.y} r={9} fill="#1a1a2e" stroke={p.color} strokeWidth="2" />
            {/* Planet symbol */}
            <text x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central"
              fill={p.color} fontSize="12" fontWeight="700">{p.icon}</text>
            {/* Planet name */}
            <text x={p.x} y={p.y + 20} textAnchor="middle" fill={p.color} fontSize="8" fontWeight="600">{p.name}</text>
            {/* Sign + element */}
            <text x={p.x} y={p.y + 30} textAnchor="middle" fill="var(--text-muted)" fontSize="7">
              {p.sign} {p.symbol} · {p.element}
            </text>
          </motion.g>
        ))}
      </svg>

      {/* Planet details list below */}
      <div className="astrology-planet-list">
        {planetData.map((p, i) => (
          <motion.div key={p.key} className="astrology-planet-item"
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.5 + i * 0.05 }}
            style={{ borderLeftColor: p.color }}
          >
            <div className="astrology-planet-item-icon" style={{ color: p.color }}>{p.icon}</div>
            <div className="astrology-planet-item-info">
              <div className="astrology-planet-item-name" style={{ color: p.color }}>{p.name}</div>
              <div className="astrology-planet-item-sign">{p.sign} {p.symbol} · {p.element}</div>
              <div className="astrology-planet-item-meaning">{p.meaning}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}