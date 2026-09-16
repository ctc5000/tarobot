import { motion } from 'framer-motion';
import { useMemo } from 'react';

const ZODIAC_SIGNS = ['Овен','Телец','Близнецы','Рак','Лев','Дева','Весы','Скорпион','Стрелец','Козерог','Водолей','Рыбы'];
const ZODIAC_SYMBOLS = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];
const ELEMENT_COLORS = { 'Огонь':'#ff4d4d','Земля':'#4caf50','Воздух':'#4dabf5','Вода':'#4dd0e1' };
const PLANET_SYMBOLS = { sun:'☉',moon:'☽',mercury:'☿',venus:'♀',mars:'♂',jupiter:'♃',saturn:'♄',uranus:'♅',neptune:'♆',pluto:'♇' };

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function getSignIndex(deg) {
  return Math.floor((((deg % 360) + 360) % 360) / 30);
}

const HOUSE_LABELS = {
  1: 'Личность', 2: 'Финансы', 3: 'Общение', 4: 'Дом',
  5: 'Творчество', 6: 'Работа', 7: 'Партнерство', 8: 'Трансформация',
  9: 'Путешествия', 10: 'Карьера', 11: 'Друзья', 12: 'Подсознание'
};

export default function HouseChart({ houses }) {
  const cx = 250, cy = 250, outerR = 210, innerR = 140;

  const houseArcs = useMemo(() => {
    if (!houses || houses.length === 0) return [];
    return houses.map((h, i) => {
      const startAngle = h.cusp;
      const nextHouse = houses[(i + 1) % 12];
      const endAngle = nextHouse.cusp;
      const midAngle = (startAngle + endAngle) / 2;
      const signIdx = getSignIndex(midAngle);
      const color = ELEMENT_COLORS[h.element] || 'var(--primary)';
      return { ...h, startAngle, endAngle, midAngle, signIdx, sign: ZODIAC_SIGNS[signIdx], symbol: ZODIAC_SYMBOLS[signIdx], color, label: HOUSE_LABELS[h.number] || `Дом ${h.number}` };
    });
  }, [houses]);

  return (
    <motion.div className="astrology-chart-container"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
    >
      <svg viewBox="0 0 500 500" className="astrology-chart-svg">
        <defs>
          <filter id="houseGlow"><feGaussianBlur stdDeviation="2" /></filter>
        </defs>

        {/* Background */}
        <circle cx={cx} cy={cy} r={outerR + 10} fill="rgba(201,165,75,0.03)" />

        {/* House arcs */}
        {houseArcs.map((h, i) => {
          const p1 = polarToCartesian(cx, cy, outerR, h.startAngle);
          const p2 = polarToCartesian(cx, cy, outerR, h.endAngle);
          const p3 = polarToCartesian(cx, cy, innerR, h.endAngle);
          const p4 = polarToCartesian(cx, cy, innerR, h.startAngle);
          const midPos = polarToCartesian(cx, cy, (outerR + innerR) / 2, h.midAngle);
          const labelPos = polarToCartesian(cx, cy, innerR - 20, h.midAngle);
          const isEven = i % 2 === 0;
          return (
            <g key={`ha-${i}`}>
              <motion.path
                d={`M ${p1.x} ${p1.y} A ${outerR} ${outerR} 0 0 1 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${innerR} ${innerR} 0 0 0 ${p4.x} ${p4.y} Z`}
                fill={isEven ? `${h.color}08` : `${h.color}12`}
                stroke={h.color} strokeWidth="1.2" strokeOpacity="0.5"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: i * 0.04 }}
              />
              {/* House number */}
              <text x={midPos.x} y={midPos.y} textAnchor="middle" dominantBaseline="central"
                fill={h.color} fontSize="13" fontWeight="700" opacity="0.9">
                {h.number}
              </text>
              {/* House label inside */}
              <text x={labelPos.x} y={labelPos.y} textAnchor="middle" dominantBaseline="central"
                fill="var(--text-muted)" fontSize="8" opacity="0.7">
                {h.label}
              </text>
              {/* Sign symbol */}
              <text x={midPos.x} y={midPos.y + 18} textAnchor="middle" dominantBaseline="central"
                fill="var(--text-muted)" fontSize="9" opacity="0.5">
                {h.symbol} {h.sign}
              </text>
            </g>
          );
        })}

        {/* Cusp lines */}
        {houseArcs.map((h, i) => {
          const p = polarToCartesian(cx, cy, outerR, h.startAngle);
          return (
            <line key={`cl-${i}`} x1={cx} y1={cy} x2={p.x} y2={p.y}
              stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
          );
        })}

        {/* Center */}
        <circle cx={cx} cy={cy} r={innerR - 10} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="3,3" />
        <text x={cx} y={cy - 4} textAnchor="middle" fill="var(--text-muted)" fontSize="9">Дома</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill="var(--text-muted)" fontSize="9">гороскопа</text>
      </svg>

      {/* House details grid below */}
      <div className="astrology-house-grid">
        {houseArcs.map((h, i) => (
          <motion.div key={h.number} className="astrology-house-card"
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.03 }}
            style={{ borderTop: `2px solid ${h.color}` }}
          >
            <div className="astrology-house-card-header">
              <span className="astrology-house-card-num" style={{ color: h.color }}>{h.number}</span>
              <span className="astrology-house-card-label">{h.label}</span>
            </div>
            <div className="astrology-house-card-sign">
              {h.symbol} {h.sign} · {h.element}
            </div>
            <div className="astrology-house-card-desc">{h.houseDescription}</div>
            {h.planets && h.planets.length > 0 && (
              <div className="astrology-house-card-planets">
                {h.planets.map((pl, j) => (
                  <span key={j} className="astrology-house-planet-tag">{pl}</span>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}