import { Link } from 'react-router-dom';

const footerLinks = [
  { name: 'О проекте', url: '/pages/about' },
  { name: 'Конфиденциальность', url: '/pages/privacy' },
  { name: 'Контакты', url: '/pages/contacts' },
];

const socialLinks = [
  { name: 'Telegram', url: 'https://t.me/algoritmsudby', icon: 'fab fa-telegram' },
  { name: 'VK', url: 'https://vk.com/algoritmsudby', icon: 'fab fa-vk' },
  { name: 'YouTube', url: 'https://youtube.com/@algoritmsudby', icon: 'fab fa-youtube' },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="logo-icon">⛤</span>
              <span className="logo-text">АЛГОРИТМ СУДЬБЫ</span>
            </div>
            <p className="footer-description">
              Система автоматических расчетов на основе древних практик и современной науки
            </p>
            <div className="footer-social">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  title={social.name}
                >
                  <i className={social.icon}></i>
                </a>
              ))}
            </div>
          </div>

          <div className="footer-links">
            <h4>Информация</h4>
            {footerLinks.map((link) => (
              <Link key={link.name} to={link.url}>
                {link.name}
              </Link>
            ))}
          </div>

          <div className="footer-links">
            <h4>Практики</h4>
            <Link to="/numerology">Нумерология</Link>
            <Link to="/astrology">Натальная карта</Link>
            <Link to="/astropsychology">Астропсихология</Link>
            <Link to="/tarot">Таро</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 АЛГОРИТМ СУДЬБЫ. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}