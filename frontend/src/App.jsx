import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import CabinetDashboard from './pages/cabinet/CabinetDashboard';
import CabinetProfile from './pages/cabinet/CabinetProfile';
import CabinetBalance from './pages/cabinet/CabinetBalance';
import CabinetHistory from './pages/cabinet/CabinetHistory';
import CabinetSubscriptions from './pages/cabinet/CabinetSubscriptions';
import NumerologyPage from './pages/modules/NumerologyPage';
import AstrologyPage from './pages/modules/AstrologyPage';
import AstropsychologyPage from './pages/modules/AstropsychologyPage';
import TarotPage from './pages/modules/TarotPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
          <Route path="cabinet" element={<CabinetDashboard />} />
          <Route path="cabinet/profile" element={<CabinetProfile />} />
          <Route path="cabinet/balance" element={<CabinetBalance />} />
          <Route path="cabinet/history" element={<CabinetHistory />} />
          <Route path="cabinet/subscriptions" element={<CabinetSubscriptions />} />
          <Route path="numerology" element={<NumerologyPage />} />
          <Route path="astrology" element={<AstrologyPage />} />
          <Route path="astropsychology" element={<AstropsychologyPage />} />
          <Route path="tarot" element={<TarotPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
