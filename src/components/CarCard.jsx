import PropTypes from 'prop-types';
import { supabase } from '../lib/supabaseClient';

/**
 * CarCard Component - Professional car inventory card with state-based styling
 * @param {Object} car - Car data object from Supabase
 * @param {Boolean} isAdminMode - Toggle admin features (matricula display, placeholder images)
 */
export default function CarCard({ car, isAdminMode = false }) {
  // Handle missing images
  if (!car.imagen || car.imagen.trim() === '') {
    if (!isAdminMode) return null;

    return (
      <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center h-64">
        <div className="text-6xl mb-2">📸</div>
        <p className="text-gray-500 font-medium">Pendiente: {car.matricula}</p>
      </div>
    );
  }

  // Get image URL from Supabase Storage
  const {
    data: { publicUrl },
  } = supabase.storage.from('coches').getPublicUrl(car.imagen);

  // Estado badge configuration
  const estadoConfig = {
    Vendido: { color: 'bg-red-500', text: 'VENDIDO' },
    Reservado: { color: 'bg-orange-500', text: 'RESERVADO' },
    Activo: { color: 'bg-green-500', text: 'EN STOCK' },
  };

  const badge = estadoConfig[car.estado] || estadoConfig['Activo'];
  const isVendido = car.estado === 'Vendido';

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 relative">
      {/* Estado Badge */}
      <div
        className={`absolute top-3 right-3 ${badge.color} text-white px-3 py-1 rounded-full text-xs font-bold font-geist tracking-wide z-10 shadow-md uppercase`}
      >
        {badge.text}
      </div>

      {/* Admin: Matricula Display */}
      {isAdminMode && (
        <div className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-mono z-10 shadow-md">
          {car.matricula}
        </div>
      )}

      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={publicUrl}
          alt={`${car.marca} ${car.modelo}`}
          className={`w-full h-full object-cover transition-transform duration-300 hover:scale-105 ${
            isVendido ? 'grayscale opacity-70' : ''
          }`}
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Header */}
        <h3 className="text-xl font-black font-satoshi text-gray-900 mb-2 tracking-tight">
          {car.marca} <span className="font-bold">{car.modelo}</span>
          <span className="text-sm font-bold font-geist text-gray-500 ml-2">
            ({car.year})
          </span>
        </h3>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-2 text-sm font-geist font-medium text-gray-600 mb-3">
          {car.motor && (
            <div className="flex items-center">
              <span className="font-semibold mr-1">Motor:</span>
              <span>{car.motor}</span>
            </div>
          )}
          {car.cv && (
            <div className="flex items-center">
              <span className="font-semibold mr-1">CV:</span>
              <span>{car.cv}</span>
            </div>
          )}
          {car.km && (
            <div className="flex items-center">
              <span className="font-semibold mr-1">KM:</span>
              <span>{car.km.toLocaleString()}</span>
            </div>
          )}
          {car.combustible && (
            <div className="flex items-center">
              <span className="font-semibold mr-1">Combustible:</span>
              <span>{car.combustible}</span>
            </div>
          )}
          {car.transmision && (
            <div className="flex items-center col-span-2">
              <span className="font-semibold mr-1">Transmisión:</span>
              <span>{car.transmision}</span>
            </div>
          )}
        </div>

        {/* Price */}
        {car.precio && (
          <div className="text-2xl font-black font-satoshi tracking-tighter text-blue-600">
            {car.precio.toLocaleString()}€
          </div>
        )}
      </div>
    </div>
  );
}

CarCard.propTypes = {
  car: PropTypes.shape({
    id: PropTypes.number.isRequired,
    matricula: PropTypes.string.isRequired,
    marca: PropTypes.string.isRequired,
    modelo: PropTypes.string.isRequired,
    imagen: PropTypes.string,
    motor: PropTypes.string,
    precio: PropTypes.number,
    year: PropTypes.number,
    km: PropTypes.number,
    cv: PropTypes.number,
    combustible: PropTypes.string,
    etiqueta: PropTypes.string,
    transmision: PropTypes.string,
    descripcion: PropTypes.string,
    estado: PropTypes.oneOf(['Activo', 'Reservado', 'Vendido']),
  }).isRequired,
  isAdminMode: PropTypes.bool,
};
