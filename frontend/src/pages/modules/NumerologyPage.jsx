import { useState } from 'react';
import { numerologyAPI } from '../../api/client';
import CalculationForm from '../../components/CalculationForm';

export default function NumerologyPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleCalculate = async (formData) => {
    setLoading(true);
    setResult(null);

    try {
      const response = await numerologyAPI.calculateBasic({
        fullName: formData.fullName,
        birthDate: formData.birthDate,
      });
      setResult(response.data);
    } catch (error) {
      console.error('Numerology calculation error:', error);
      setResult({ error: error.response?.data?.message || 'Ошибка расчета' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <CalculationForm
      title="Нумерология"
      description="Рассчитайте число судьбы, кармические задачи, таланты и предназначение по дате рождения"
      onSubmit={handleCalculate}
      loading={loading}
      result={result}
    />
  );
}