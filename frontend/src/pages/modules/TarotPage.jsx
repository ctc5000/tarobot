import { useState } from 'react';
import { motion } from 'framer-motion';

const tarotCards = [
  { id: 0, name: 'Шут', meaning: 'Новые начинания, спонтанность, свобода' },
  { id: 1, name: 'Маг', meaning: 'Мастерство, воля, созидание' },
  { id: 2, name: 'Верховная Жрица', meaning: 'Интуиция, тайна, подсознание' },
  { id: 3, name: 'Императрица', meaning: 'Изобилие, плодородие, природа' },
  { id: 4, name: 'Император', meaning: 'Власть, структура, авторитет' },
  { id: 5, name: 'Иерофант', meaning: 'Традиции, мудрость, духовность' },
  { id: 6, name: 'Влюбленные', meaning: 'Выбор, любовь, гармония' },
  { id: 7, name: 'Колесница', meaning: 'Победа, воля, триумф' },
  { id: 8, name: 'Сила', meaning: 'Внутренняя сила, мужество' },
  { id: 9, name: 'Отшельник', meaning: 'Мудрость, уединение, поиск' },
  { id: 10, name: 'Колесо Фортуны', meaning: 'Судьба, циклы, перемены' },
  { id: 11, name: 'Справедливость', meaning: 'Правда, баланс, закон' },
  { id: 12, name: 'Повешенный', meaning: 'Жертва, новый взгляд, пауза' },
  { id: 13, name: 'Смерть', meaning: 'Трансформация, конец цикла' },
  { id: 14, name: 'Умеренность', meaning: 'Баланс, гармония, терпение' },
  { id: 15, name: 'Дьявол', meaning: 'Искушение, зависимость, страсть' },
  { id: 16, name: 'Башня', meaning: 'Разрушение, кризис, прорыв' },
  { id: 17, name: 'Звезда', meaning: 'Надежда, вдохновение, исцеление' },
  { id: 18, name: 'Луна', meaning: 'Иллюзии, страхи, интуиция' },
  { id: 19, name: 'Солнце', meaning: 'Радость, успех, жизненная сила' },
  { id: 20, name: 'Суд', meaning: 'Возрождение, оценка, призвание' },
  { id: 21, name: 'Мир', meaning: 'Завершение, целостность, гармония' },
];

export default function TarotPage() {
  const [selectedCards, setSelectedCards] = useState([]);
  const [isSpreading, setIsSpreading] = useState(false);
  const [spread, setSpread] = useState(null);

  const doSpread = () => {
    setIsSpreading(true);
    setSpread(null);
    setSelectedCards([]);

    // Simulate card selection animation
    setTimeout(() => {
      const shuffled = [...tarotCards].sort(() => Math.random() - 0.5);
      const picked = shuffled.slice(0, 3);
      setSelectedCards(picked);
      setSpread({
        cards: picked,
        interpretation: 'Расклад показывает текущую ситуацию, препятствия и возможный исход. Доверьтесь своей интуиции при интерпретации.',
      });
      setIsSpreading(false);
    }, 1500);
  };

  return (
    <div className="tarot-page">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="section-badge">Таро</div>
          <h1 className="section-title">Расклад <span>Таро</span></h1>
          <p className="section-description">
            Получите ответы на свои вопросы с помощью древней системы Таро
          </p>
        </motion.div>

        <div className="tarot-actions">
          <motion.button
            className="btn btn-primary btn-lg"
            onClick={doSpread}
            disabled={isSpreading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isSpreading ? 'Расклад...' : 'Сделать расклад'}
          </motion.button>
        </div>

        {isSpreading && (
          <div className="tarot-shuffling">
            <div className="loading-spinner"></div>
            <p>Тасуем карты...</p>
          </div>
        )}

        {spread && (
          <motion.div
            className="tarot-spread"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="tarot-cards-grid">
              {selectedCards.map((card, index) => (
                <motion.div
                  key={card.id}
                  className="tarot-card"
                  initial={{ opacity: 0, rotateY: 180 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <div className="tarot-card-inner">
                    <div className="tarot-card-number">{card.id}</div>
                    <div className="tarot-card-name">{card.name}</div>
                    <div className="tarot-card-meaning">{card.meaning}</div>
                    <div className="tarot-card-position">
                      {index === 0 ? 'Прошлое' : index === 1 ? 'Настоящее' : 'Будущее'}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="tarot-interpretation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <h3>Интерпретация</h3>
              <p>{spread.interpretation}</p>
            </motion.div>
          </motion.div>
        )}

        {!spread && !isSpreading && (
          <motion.div
            className="tarot-placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="placeholder-icon">🎴</span>
            <h3>Нажмите кнопку</h3>
            <p>чтобы получить расклад на текущую ситуацию</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}