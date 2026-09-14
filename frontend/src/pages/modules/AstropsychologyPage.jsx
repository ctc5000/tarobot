import { useState } from 'react';
import { astropsychologyAPI } from '../../api/client';
import CalculationForm from '../../components/CalculationForm';

export default function AstropsychologyPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleCalculate = async (formData) => {
    setLoading(true);
    setResult(null);

    try {
      const response = await astropsychologyAPI.calculate('full', {
        fullName: formData.fullName,
        birthDate: formData.birthDate,
        birthTime: formData.birthTime || '12:00',
        birthPlace: formData.birthPlace,
      });
      setResult(response.data);
    } catch (error) {
      console.error('Astropsychology calculation error:', error);
      setResult({ error: error.response?.data?.message || 'Ошибка расчета' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <CalculationForm
      title="Астропсихология"
      description="Психологический портрет личности на основе астрологических данных: характер, таланты, зона роста"
      onSubmit={handleCalculate}
      loading={loading}
      result={result}
    />
  );
}