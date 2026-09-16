import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { numerologyAPI } from '../../api/client';
import NumerologyReport from '../../components/reports/NumerologyReport';
import NumerologyProReport from '../../components/reports/NumerologyProReport';

const CALCULATION_STEPS = [
  { label: 'Сверяем таблицы', icon: '📊' },
  { label: 'Проверяем систему', icon: '⚙️' },
  { label: 'Уточняем числа', icon: '🔢' },
  { label: 'Смотрим расклад карт по личности', icon: '🎴' },
];

const PRO_STEPS = [
  { label: 'Анализируем буквы', icon: '📝' },
  { label: 'Вычисляем промежуточные суммы', icon: '🧮' },
  { label: 'Строим матрицу судьбы', icon: '⬜' },
  { label: 'Рассчитываем кармический хвост', icon: '🌀' },
  { label: 'Анализируем чакры', icon: '🕉️' },
  { label: 'Формируем профессиональный отчёт', icon: '📊' },
];

const STEP_DURATION = 1250;

const METHOD_OPTIONS = [
  { value: 'pythagorean', label: 'Пифагорейская', icon: '📐' },
  { value: 'vedic', label: 'Ведическая', icon: '🕉️' },
  { value: 'chaldean', label: 'Халдейская', icon: '⭐' },
  { value: 'kabbalah', label: 'Каббалистическая', icon: '✡️' },
];

export default function NumerologyPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    birthDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [showAnimation, setShowAnimation] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [mode, setMode] = useState('basic');
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState('pythagorean');
  const [servicesLoading, setServicesLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const animationTimerRef = useRef(null);
  const stepTimerRef = useRef(null);

  // Fetch available tariffs on mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setServicesLoading(true);
        const res = await numerologyAPI.getServices();
        const list = res.data?.data || [];
        setServices(list);
        // Select the professional tariff by default
        const prof = list.find(s => s.code === 'numerology_professional');
        if (prof) setSelectedService(prof);
        else if (list.length > 0) setSelectedService(list[0]);
      } catch (err) {
        console.error('Failed to load numerology services:', err);
        // Fallback: use hardcoded defaults
        const defaults = [
          { code: 'numerology_basic', name: 'Базовый расчет', price: 0, description: 'Бесплатный базовый расчет' },
          { code: 'numerology_full_report', name: 'Полный отчет', price: 500, description: 'Детальный анализ личности' },
          { code: 'numerology_professional', name: 'Профессиональный расчет', price: 1500, description: 'Полный профессиональный расчет' },
        ];
        setServices(defaults);
        setSelectedService(defaults[2]);
      } finally {
        setServicesLoading(false);
      }
    };
    fetchServices();
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (animationTimerRef.current) clearTimeout(animationTimerRef.current);
      if (stepTimerRef.current) clearInterval(stepTimerRef.current);
    };
  }, []);

  const startAnimation = () => {
    setShowAnimation(true);
    setCurrentStep(0);
    setShowResult(false);

    const steps = mode === 'professional' ? PRO_STEPS : CALCULATION_STEPS;

    stepTimerRef.current = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        return prev;
      });
    }, STEP_DURATION);

    animationTimerRef.current = setTimeout(() => {
      if (stepTimerRef.current) clearInterval(stepTimerRef.current);
      setShowAnimation(false);
      setShowResult(true);
    }, steps.length * STEP_DURATION);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    startAnimation();

    try {
      let response;
      if (mode === 'professional') {
        response = await numerologyAPI.calculateProfessional({
          fullName: formData.fullName,
          birthDate: formData.birthDate,
          options: {
            system: selectedMethod,
            preserveMasters: true,
            preserveKarmicDebts: true,
          },
          serviceCode: selectedService?.code || 'numerology_professional',
        });
      } else {
        response = await numerologyAPI.calculateBasic({
          fullName: formData.fullName,
          birthDate: formData.birthDate,
        });
      }
      setResult(response.data);
    } catch (err) {
      console.error('Numerology calculation error:', err);
      const errData = err.response?.data;
      if (errData?.requiresPayment) {
        setError(`Недостаточно средств. Баланс: ${errData.balance} ₽, требуется: ${errData.price} ₽. Пополните баланс в личном кабинете.`);
      } else {
        setError(errData?.error || errData?.message || 'Ошибка расчета');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (animationTimerRef.current) clearTimeout(animationTimerRef.current);
    if (stepTimerRef.current) clearInterval(stepTimerRef.current);
    setShowAnimation(false);
    setShowResult(false);
    setResult(null);
    setError(null);
    setCurrentStep(0);
  };

  const steps = mode === 'professional' ? PRO_STEPS : CALCULATION_STEPS;

  const formatPrice = (price) => {
    const num = parseFloat(price);
    return num === 0 ? 'Бесплатно' : `${num.toLocaleString('ru-RU')} ₽`;
  };

  return (
    <div className="calculation-page">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="section-badge">Расчет</div>
          <h1 className="section-title">Нумерология</h1>
          <p className="section-description">
            Рассчитайте число судьбы, кармические задачи, таланты и предназначение по дате рождения
          </p>
        </motion.div>

        {/* Mode Toggle */}
        <motion.div
          className="mode-toggle"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <button
            className={`mode-btn ${mode === 'basic' ? 'active' : ''}`}
            onClick={() => setMode('basic')}
          >
            🔮 Базовый
          </button>
          <button
            className={`mode-btn ${mode === 'professional' ? 'active' : ''}`}
            onClick={() => setMode('professional')}
          >
            🎯 Профессиональный
          </button>
        </motion.div>

        {/* Tariff Selector — shown in professional mode */}
        {mode === 'professional' && (
          <motion.div
            className="tariff-selector"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
          >
            <div className="tariff-selector-header">
              <span>💰 Выберите тариф</span>
            </div>
            {servicesLoading ? (
              <div className="tariff-loading">Загрузка тарифов...</div>
            ) : (
              <div className="tariff-cards">
                {services.map((service) => (
                  <motion.div
                    key={service.code}
                    className={`tariff-card ${selectedService?.code === service.code ? 'active' : ''}`}
                    onClick={() => setSelectedService(service)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="tariff-card-header">
                      <span className="tariff-name">{service.name}</span>
                      <span className="tariff-price">{formatPrice(service.price)}</span>
                    </div>
                    <p className="tariff-description">{service.description}</p>
                    {parseFloat(service.price) === 0 && (
                      <span className="tariff-badge-free">Бесплатно</span>
                    )}
                  </motion.div>
                ))}
              </div>
            )}

            {/* Method Selector */}
            <div className="method-selector">
              <div className="method-selector-header">
                <span>🔧 Выберите метод расчета</span>
              </div>
              <div className="method-options">
                {METHOD_OPTIONS.map((method) => (
                  <button
                    key={method.value}
                    className={`method-btn ${selectedMethod === method.value ? 'active' : ''}`}
                    onClick={() => setSelectedMethod(method.value)}
                  >
                    <span className="method-icon">{method.icon}</span>
                    <span className="method-label">{method.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Professional Settings Panel */}
        {mode === 'professional' && (
          <motion.div
            className="pro-settings-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="pro-settings-header"
              onClick={() => setShowSettings(!showSettings)}
            >
              <span>⚙️ Дополнительные настройки</span>
              <span className={`pro-settings-toggle ${showSettings ? 'open' : ''}`}>▼</span>
            </div>
            {showSettings && (
              <div className="pro-settings-body">
                <div className="pro-settings-grid">
                  <div className="pro-setting">
                    <label>Мастер-числа</label>
                    <label className="pro-toggle">
                      <input type="checkbox" defaultChecked />
                      <span>Сохранять мастер-числа (11, 22, 33)</span>
                    </label>
                  </div>
                  <div className="pro-setting">
                    <label>Кармические долги</label>
                    <label className="pro-toggle">
                      <input type="checkbox" defaultChecked />
                      <span>Выделять кармические долги (13, 14, 16, 19)</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* FORM */}
        <AnimatePresence mode="wait">
          {!showAnimation && !showResult && !result && !error && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="calculation-grid">
                <motion.div
                  className="calculation-form-card"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <form onSubmit={handleSubmit} className="calculation-form">
                    <div className="form-group">
                      <label>ФИО</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Иванов Иван Иванович"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Дата рождения</label>
                      <input
                        type="date"
                        className="form-input"
                        value={formData.birthDate}
                        onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                        required
                      />
                    </div>

                    {mode === 'professional' && selectedService && (
                      <div className="form-group tariff-summary">
                        <div className="tariff-summary-row">
                          <span>Тариф:</span>
                          <strong>{selectedService.name}</strong>
                        </div>
                        <div className="tariff-summary-row">
                          <span>Метод:</span>
                          <strong>{METHOD_OPTIONS.find(m => m.value === selectedMethod)?.label || selectedMethod}</strong>
                        </div>
                        <div className="tariff-summary-row tariff-summary-price">
                          <span>Стоимость:</span>
                          <strong>{formatPrice(selectedService.price)}</strong>
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      disabled={loading}
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      {loading ? (
                        <span className="loading-spinner-sm" />
                      ) : mode === 'professional' ? (
                        selectedService && parseFloat(selectedService.price) > 0
                          ? `🎯 Профессиональный расчет — ${formatPrice(selectedService.price)}`
                          : '🎯 Профессиональный расчет'
                      ) : (
                        'Рассчитать'
                      )}
                    </button>
                  </form>
                </motion.div>

                <motion.div
                  className="calculation-result-card"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <div className="calculation-placeholder">
                    <span className="placeholder-icon">✦</span>
                    <h3>Заполните форму</h3>
                    <p>Введите данные для расчета и нажмите "Рассчитать"</p>
                    {mode === 'professional' && (
                      <div className="pro-features-preview">
                        <h4>Профессиональный режим включает:</h4>
                        <ul>
                          <li>📝 Разбивка по буквам</li>
                          <li>🧮 Промежуточные суммы</li>
                          <li>🔢 15+ ключевых чисел</li>
                          <li>🏔️ Пинакли с возрастами</li>
                          <li>⚔️ Челленджи с возрастами</li>
                          <li>⬜ Матрица Судьбы</li>
                          <li>🌀 Кармический хвост (Ладини)</li>
                          <li>🕉️ Чакровый анализ</li>
                          <li>📊 Таблицы расчёта</li>
                          <li>📖 Профессиональная интерпретация</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CALCULATION ANIMATION */}
        <AnimatePresence mode="wait">
          {showAnimation && (
            <motion.div
              key="animation"
              className="numerology-animation-container"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              <div className="numerology-animation-inner">
                <div className="numerology-animation-spinner">
                  <motion.div
                    className="numerology-animation-icon"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  >
                    {mode === 'professional' ? '🎯' : '🔮'}
                  </motion.div>
                </div>

                <div className="numerology-animation-steps">
                  {steps.map((step, index) => (
                    <motion.div
                      key={index}
                      className={`numerology-step ${index <= currentStep ? 'active' : ''} ${index === currentStep ? 'current' : ''}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{
                        opacity: index <= currentStep ? 1 : 0.4,
                        x: 0,
                        scale: index === currentStep ? 1.05 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className="numerology-step-icon">{step.icon}</span>
                      <span className="numerology-step-label">{step.label}</span>
                      {index <= currentStep && (
                        <motion.span
                          className="numerology-step-check"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          {index < currentStep ? '✅' : '⏳'}
                        </motion.span>
                      )}
                    </motion.div>
                  ))}
                </div>

                <div className="numerology-progress-bar">
                  <motion.div
                    className="numerology-progress-fill"
                    initial={{ width: '0%' }}
                    animate={{
                      width: `${((currentStep + 1) / steps.length) * 100}%`,
                    }}
                    transition={{ duration: 0.4 }}
                  />
                </div>

                <p className="numerology-animation-hint">
                  {mode === 'professional'
                    ? 'Выполняется профессиональный нумерологический анализ...'
                    : 'Производится расчет космограммы личности...'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* RESULT */}
        <AnimatePresence mode="wait">
          {showResult && (result || error) && (
            <motion.div
              key="result"
              className="numerology-result-container"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {error ? (
                <div className="calculation-error">
                  <span className="calculation-error-icon">⚠️</span>
                  <h3>Ошибка расчета</h3>
                  <p>{error}</p>
                  <button
                    className="btn btn-primary"
                    onClick={handleReset}
                    style={{ marginTop: '20px' }}
                  >
                    Попробовать снова
                  </button>
                </div>
              ) : result ? (
                <>
                  {mode === 'professional' ? (
                    <NumerologyProReport
                      data={result}
                      fullName={formData.fullName}
                      birthDate={formData.birthDate}
                    />
                  ) : (
                    <NumerologyReport data={result} />
                  )}
                  <motion.div
                    className="numerology-result-actions"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <button
                      className="btn btn-outline"
                      onClick={handleReset}
                    >
                      ← Новый расчет
                    </button>
                  </motion.div>
                </>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}