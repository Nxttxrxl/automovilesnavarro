import { useState, useMemo } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

// ⚙️ CONFIGURACIÓN: Año mínimo para financiación
const MIN_FINANCE_YEAR = 2014; // NOTA: Cambiar a 2010 o 2015 según se confirme

const INTEREST_RATE = 0.089; // 8.9% TIN
const TERM_OPTIONS = [24, 36, 48, 60, 72]; // Meses disponibles

export default function FinanceCalculator({ car }) {
  const [downPayment, setDownPayment] = useState(0);
  const [selectedTerm, setSelectedTerm] = useState(48);

  // Verificar si el coche cumple requisitos de antigüedad
  const isEligible = car.year >= MIN_FINANCE_YEAR;

  // Calcular límites de entrada
  const maxDownPayment = Math.floor(car.precio * 0.5);

  // Calcular cuota mensual
  const monthlyPayment = useMemo(() => {
    if (!isEligible || !car.precio) return 0;

    const amountToFinance = car.precio - downPayment;
    const years = selectedTerm / 12;
    const totalWithInterest = amountToFinance * (1 + INTEREST_RATE * years);
    const monthly = totalWithInterest / selectedTerm;

    return Math.round(monthly);
  }, [car.precio, downPayment, selectedTerm, isEligible]);

  // Generar mensaje WhatsApp
  const whatsappMessage = `Hola, quiero información del ${car.marca} ${car.modelo}. He calculado una cuota de ${monthlyPayment}€/mes con ${downPayment}€ de entrada a ${selectedTerm} meses.`;
  const whatsappLink = `https://wa.me/34683646930?text=${encodeURIComponent(whatsappMessage)}`;

  if (!isEligible) {
    return (
      <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl p-8 border border-orange-200 shadow-xl flex items-center justify-center min-h-[160px]">
        <div className="flex items-center gap-6">
          <span className="material-symbols-outlined text-orange-600 text-4xl shrink-0">
            info
          </span>
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">
              Financiación No Disponible
            </h3>
            <p className="text-slate-700 leading-relaxed font-medium">
              Este vehículo no cumple los requisitos de antigüedad para
              financiación estándar.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <span className="material-symbols-outlined text-primary text-3xl">
          calculate
        </span>
        <h3 className="text-2xl font-bold text-slate-900">
          Calculadora de Financiación
        </h3>
      </div>

      {/* Entrada Inicial */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-slate-700">
            Entrada Inicial
          </label>
          <span className="text-2xl font-bold text-primary">
            {downPayment.toLocaleString('es-ES')}€
          </span>
        </div>
        <Slider
          min={0}
          max={maxDownPayment}
          value={downPayment}
          onChange={setDownPayment}
          step={100}
          styles={{
            track: { backgroundColor: '#004A99', height: 8 },
            handle: {
              backgroundColor: '#004A99',
              borderColor: '#004A99',
              width: 24,
              height: 24,
              marginTop: -8,
              opacity: 1,
              boxShadow: '0 2px 8px rgba(0, 74, 153, 0.3)',
            },
            rail: { backgroundColor: '#e2e8f0', height: 8 },
          }}
        />
        <div className="flex justify-between mt-2 text-xs text-slate-500">
          <span>0€</span>
          <span>{maxDownPayment.toLocaleString('es-ES')}€ (50%)</span>
        </div>
      </div>

      {/* Plazo */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-slate-700 mb-3">
          Plazo de Financiación
        </label>
        <div className="grid grid-cols-5 gap-2">
          {TERM_OPTIONS.map((term) => (
            <button
              key={term}
              onClick={() => setSelectedTerm(term)}
              className={`py-3 px-2 rounded-lg font-bold text-sm transition-all ${
                selectedTerm === term
                  ? 'bg-primary text-white shadow-lg scale-105'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {term} m
            </button>
          ))}
        </div>
      </div>

      {/* Resultado */}
      <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl p-6 mb-6 border border-blue-100">
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-600 mb-2">
            Tu cuota mensual
          </p>
          <p className="text-4xl font-bold text-primary mb-1">
            {monthlyPayment.toLocaleString('es-ES')}€
            <span className="text-xl text-slate-500">/mes</span>
          </p>
          <p className="text-xs text-slate-500">
            TIN {(INTEREST_RATE * 100).toFixed(1)}% • {selectedTerm} meses
          </p>
        </div>
      </div>

      {/* Desglose */}
      <div className="bg-slate-50 rounded-xl p-4 mb-6 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-600">Precio del vehículo</span>
          <span className="font-semibold text-slate-900">
            {car.precio.toLocaleString('es-ES')}€
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">Entrada inicial</span>
          <span className="font-semibold text-slate-900">
            -{downPayment.toLocaleString('es-ES')}€
          </span>
        </div>
        <div className="border-t border-slate-200 pt-2 flex justify-between">
          <span className="text-slate-600">A financiar</span>
          <span className="font-bold text-slate-900">
            {(car.precio - downPayment).toLocaleString('es-ES')}€
          </span>
        </div>
        <div className="flex justify-between text-xs text-slate-500">
          <span>Total a pagar</span>
          <span>
            {(monthlyPayment * selectedTerm + downPayment).toLocaleString(
              'es-ES',
            )}
            €
          </span>
        </div>
      </div>

      {/* CTA WhatsApp */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        data-finance-trigger
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
      >
        <svg
          className="w-6 h-6 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        <span>Solicitar financiación</span>
      </a>

      {/* Disclaimer */}
      <p className="text-xs text-slate-500 text-center mt-4 leading-relaxed">
        * Cálculo orientativo. Sujeto a aprobación de la entidad financiera. TIN{' '}
        {(INTEREST_RATE * 100).toFixed(1)}% sin comisiones ni gastos
        adicionales.
      </p>
    </div>
  );
}
