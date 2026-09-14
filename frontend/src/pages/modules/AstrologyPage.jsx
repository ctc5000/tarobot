import { useState } from 'react';
import { astrologyAPI } from '../../api/client';
import CalculationForm from '../../components/CalculationForm';

export default function AstrologyPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleCalculate = async (formData) => {
    setLoading(true);
    setResult(null);

    try {
      const response = await astrologyAPI.calculate({
        fullName: formData.fullName,
        birthDate: formData.birthDate,
        birthTime: formData.birthTime || '12:00',
        birthPlace: formData.birthPlace,
        calculationType: 'natal',
      });
      setResult(response.data);
    } catch (error) {
      console.error('Astrology calculation error:', error);
      setResult({ error: error.response?.data?.message || 'Ошибка расчета' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <CalculationForm
      title="Натальная карта"
      description="Полный астрологический разбор с положением планет в знаках и домах, аспектами и интерпретацией"
      onSubmit={handleCalculate}
      loading={loading}
      result={result}
    />
  );
}