import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiSparkles, HiStar, HiChartBar, HiShieldCheck, HiLightningBolt, HiHeart } from 'react-icons/hi';

const practices = [
  {
    name: 'Нумерология',
    path: '/numerology',
    icon: '🔢',
    description: 'Расчет числа судьбы, кармических задач, талантов и предназначения по дате рождения',
  },
  {
    name: 'Натальная карта',
    path: '/astrology',
    icon: '🌠',
    description: 'Полный астрологический разбор с положением планет в знаках и домах',
  },
  {
    name: 'Астропсихология',
    path: '/astropsychology',
    icon: '🧬',
    description: 'Психологический портрет личности на основе астрологических данных',
  },
  {
    name: 'Таро',
    path: '/tarot',
    icon: '🎴',
    description: 'Расклады Таро на ситуацию, отношения, карьеру и духовное развитие',
  },
];

const benefits = [
  { icon: <HiSparkles size={32} />, title: '15+ практик', description: 'Нумерология, астрология, Таро, руны, соционика и другие древние системы' },
  { icon: <HiStar size={32} />, title: 'Точные расчеты', description: 'Автоматические алгоритмы на основе многолетних исследований и практики' },
  { icon: <HiChartBar size={32} />, title: 'Прогнозы', description: 'Ежедневные, недельные, месячные и годовые прогнозы по всем практикам' },
  { icon: <HiShieldCheck size={32} />, title: 'Конфиденциальность', description: 'Ваши данные надежно защищены и не передаются третьим лицам' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function HomePage() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-glow"></div>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="hero-badge">✦ 15+ Эзотерических практик</span>
          </motion.div>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Твой личный <span className="hero-title-gradient">навигатор судьбы</span>
          </motion.h1>

          <motion.p
            className="hero-description"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Нумерология, натальная карта, Таро, астропсихология и другие практики самопознания.
            Узнай свои сильные стороны, таланты и предназначение.
          </motion.p>

          <motion.div
            className="hero-stats"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="stat-item">
              <span className="stat-value">15+</span>
              <span className="stat-label">Практик</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">50K+</span>
              <span className="stat-label">Расчетов</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">100%</span>
              <span className="stat-label">Точность</span>
            </div>
          </motion.div>

          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link to="/register" className="btn btn-hero btn-hero-primary">
              <HiLightningBolt />
              Начать бесплатно
            </Link>
            <Link to="/numerology" className="btn btn-hero btn-hero-secondary">
              Попробовать расчет
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="value-proposition">
        <div className="container">
          <motion.div
            className="section-badge"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Почему мы?
          </motion.div>
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Ваш <span>путь к самопознанию</span>
          </motion.h2>
          <motion.p
            className="section-description"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Мы объединили древние знания и современные технологии, чтобы помочь вам лучше понять себя
          </motion.p>

          <motion.div
            className="value-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {benefits.map((benefit, index) => (
              <motion.div key={index} className="value-card" variants={itemVariants}>
                <div className="value-icon">{benefit.icon}</div>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Practices Section */}
      <section className="practices-section">
        <div className="container">
          <motion.div
            className="section-badge"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Наши практики
          </motion.div>
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Выберите <span>свой путь</span>
          </motion.h2>
          <motion.p
            className="section-description"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Каждая практика — это уникальный инструмент для познания себя и своего места в мире
          </motion.p>

          <motion.div
            className="practices-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {practices.map((practice, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Link to={practice.path} className="practice-card">
                  <span className="practice-icon">{practice.icon}</span>
                  <h3>{practice.name}</h3>
                  <p>{practice.description}</p>
                  <span className="practice-link">
                    Узнать больше <span className="arrow">→</span>
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Subscription Benefits */}
      <section className="subscription-benefits">
        <div className="container">
          <motion.div
            className="section-badge"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Преимущества
          </motion.div>
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Откройте <span>полный доступ</span>
          </motion.h2>

          <motion.div
            className="benefits-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div className="benefit-item" variants={itemVariants}>
              <div className="benefit-icon"><HiHeart /></div>
              <h4>Совместимость</h4>
              <p>Анализ совместимости с партнером по всем практикам</p>
            </motion.div>
            <motion.div className="benefit-item" variants={itemVariants}>
              <div className="benefit-icon"><HiChartBar /></div>
              <h4>Прогнозы</h4>
              <p>Персональные прогнозы на день, неделю, месяц и год</p>
            </motion.div>
            <motion.div className="benefit-item" variants={itemVariants}>
              <div className="benefit-icon"><HiLightningBolt /></div>
              <h4>PDF-отчеты</h4>
              <p>Полные отчеты с детальными описаниями в формате PDF</p>
            </motion.div>
            <motion.div className="benefit-item" variants={itemVariants}>
              <div className="benefit-icon"><HiStar /></div>
              <h4>Приоритет</h4>
              <p>Приоритетный доступ к новым практикам и обновлениям</p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}