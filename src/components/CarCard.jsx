import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { generateSlug } from '../utils/slugUtils';

// CSS Class Constants for Reusability (Matching StockGrid exactly)
const BUTTON_BASE_CLASSES =
  'font-bold rounded flex items-center justify-center gap-1 shadow-sm transition-all';
const BUTTON_RESERVAR_CLASSES = 'bg-green-600 hover:bg-green-700 text-white';
const BUTTON_CONTACTAR_CLASSES = 'bg-primary hover:bg-blue-700 text-white';
const BUTTON_MOBILE_CLASSES = 'text-xs py-2 px-2';
const BUTTON_DESKTOP_CLASSES =
  'font-semibold py-3 px-4 rounded-lg gap-2 hover:shadow-md h-full';
const ICON_MOBILE_SIZE = 'text-[16px]';
const ICON_DESKTOP_SIZE = 'text-[20px]';

/**
 * CarCard Component - Spotlight Border Effect with EXACT Original Style
 */
export default function CarCard({ car, viewMode = 'grid' }) {
  const cardRef = useRef(null);
  const slug = generateSlug(car);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const { left, top } = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty('--x', `${e.clientX - left}px`);
    cardRef.current.style.setProperty('--y', `${e.clientY - top}px`);
  };

  const getWhatsAppLink = (isReserva = false) => {
    const year = car.year || 'sin especificar';
    const price = car.precio
      ? `${car.precio.toLocaleString('es-ES')}€`
      : 'a consultar';

    if (isReserva) {
      const message = `Hola! Me gustaría reservar el ${car.marca} ${car.modelo} de ${price} que he visto en vuestra web.`;
      return `https://wa.me/34683646930?text=${encodeURIComponent(message)}`;
    }

    const message = `Hola, estoy interesado en el ${car.marca} ${car.modelo} de ${year} que he visto en vuestra web.`;
    return `https://wa.me/34683646930?text=${encodeURIComponent(message)}`;
  };

  const formatPrice = (price) => {
    if (!price || price === 0) return 'Precio a consultar';
    return `${price.toLocaleString('es-ES')}€`;
  };

  // Internal ActionButton component to match StockGrid logic
  const ActionButton = ({ isReserva, isMobile, className = '' }) => {
    const isReservaBtn = isReserva;
    const baseClasses = isMobile
      ? BUTTON_MOBILE_CLASSES
      : BUTTON_DESKTOP_CLASSES;
    const colorClasses = isReservaBtn
      ? BUTTON_RESERVAR_CLASSES
      : BUTTON_CONTACTAR_CLASSES;
    const iconSize = isMobile ? ICON_MOBILE_SIZE : ICON_DESKTOP_SIZE;
    const icon = isReservaBtn ? 'bookmark' : 'chat';
    const label = isReservaBtn ? 'Reservar' : 'Contactar';

    return (
      <a
        href={getWhatsAppLink(isReservaBtn)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className={`${BUTTON_BASE_CLASSES} ${colorClasses} ${baseClasses} ${className}`}
      >
        <span className={`material-symbols-outlined ${iconSize}`}>{icon}</span>
        {label}
      </a>
    );
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onMouseEnter={() => cardRef.current?.style.setProperty('--opacity', '1')}
      onMouseLeave={() => cardRef.current?.style.setProperty('--opacity', '0')}
      className={`group relative bg-white rounded-lg overflow-hidden border border-slate-200 transition-all duration-300 hover:shadow-lg flex flex-col`}
      style={{ '--x': '0px', '--y': '0px', '--opacity': '0' }}
    >
      {/* Spotlight Surface Glow - Follows mouse */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[var(--opacity)] transition-opacity duration-300 z-10"
        style={{
          background: `radial-gradient(400px circle at var(--x) var(--y), rgba(0,74,153,0.08), transparent 80%)`,
        }}
      />

      {/* Spotlight Border Tracking - Sharp highlight on edges */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[var(--opacity)] transition-opacity duration-300 z-50 rounded-lg pointer-events-none"
        style={{
          border: '2px solid transparent',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMask:
            'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          background: `radial-gradient(150px circle at var(--x) var(--y), rgba(0,74,153,1), transparent) border-box`,
        }}
      />

      {/* Top Section: Image + Info */}
      <div
        className={`${viewMode === 'list' ? 'flex flex-row' : 'flex flex-col'}`}
      >
        {/* Image Column */}
        <div
          className={`${viewMode === 'list' ? 'w-36 xs:w-40 md:w-80 lg:w-96 shrink-0' : 'w-full'}`}
        >
          <div className={`${viewMode === 'list' ? 'px-2 py-2' : ''}`}>
            <a
              href={`/catalogo/${slug}`}
              className={`bg-gradient-to-br from-slate-100 to-slate-50 relative overflow-hidden block rounded-lg ${
                viewMode === 'grid'
                  ? 'aspect-video w-full'
                  : 'w-full aspect-[4/3]'
              }`}
            >
              {car.imagen ? (
                <picture className="w-full h-full">
                  <source
                    srcSet={`https://abvcgcemjxbfeibmtsxp.supabase.co/storage/v1/object/public/coches/${car.imagen.replace(/\.[^/.]+$/, '')}.webp`}
                    type="image/webp"
                  />
                  <img
                    src={`https://abvcgcemjxbfeibmtsxp.supabase.co/storage/v1/object/public/coches/${car.imagen}`}
                    alt={`${car.marca} ${car.modelo}`}
                    className={`w-full h-full object-cover transition-all ${car.estado === 'Vendido' ? 'grayscale opacity-70' : ''}`}
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 text-slate-300 h-full">
                  <span className="text-2xl font-black tracking-tighter text-slate-400 uppercase">
                    Automoción
                  </span>
                  <span className="material-symbols-outlined text-5xl">
                    directions_car
                  </span>
                </div>
              )}

              {/* Status Badge */}
              {car.estado && car.estado !== 'Activo' && (
                <div
                  className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow-lg z-10 ${
                    car.estado === 'Vendido'
                      ? 'bg-red-500 text-white'
                      : car.estado === 'Reservado'
                        ? 'bg-orange-500 text-white'
                        : 'bg-green-500 text-white'
                  }`}
                >
                  {car.estado.toUpperCase()}
                </div>
              )}
            </a>
          </div>
        </div>

        {/* Content Column */}
        <div
          className={`${viewMode === 'list' ? 'p-3 flex-grow flex flex-col' : 'p-4 flex-grow flex flex-col'}`}
        >
          <div className="flex-grow">
            <a href={`/catalogo/${slug}`}>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-black font-satoshi text-slate-900 group-hover:text-primary transition-colors tracking-tight leading-tight">
                  {car.marca} {car.modelo}
                </h3>
                {car.year && (
                  <span className="text-xs font-bold font-geist px-2 py-1 bg-slate-100 text-slate-700 rounded shrink-0 ml-2">
                    {car.year}
                  </span>
                )}
              </div>
            </a>
            <p className="text-sm text-slate-500 mb-2 pb-2 border-b border-slate-100 truncate">
              {car.version}
            </p>

            {/* Price section */}
            <div className="mb-3">
              <p className="text-2xl font-black font-satoshi text-primary">
                {formatPrice(car.precio)}
              </p>
            </div>

            {/* Icons Grid (EXACT original style) */}
            <div
              className={`${viewMode === 'list' ? 'hidden md:grid' : 'grid'} grid-cols-2 gap-2 text-xs text-slate-600 mb-3`}
            >
              <div className="flex flex-col items-center p-1.5 bg-slate-50 rounded">
                <span className="material-symbols-outlined text-[18px] text-primary mb-1">
                  engineering
                </span>
                <span className="font-bold font-satoshi text-center">
                  {car.motor || 'N/A'}
                </span>
              </div>
              <div className="flex flex-col items-center p-1.5 bg-slate-50 rounded">
                <span className="material-symbols-outlined text-[18px] text-primary mb-1">
                  speed
                </span>
                <span className="font-bold font-satoshi">
                  {car.cv || 'N/A'} CV
                </span>
              </div>
              <div className="flex flex-col items-center p-1.5 bg-slate-50 rounded">
                <span className="material-symbols-outlined text-[18px] text-primary mb-1">
                  settings_suggest
                </span>
                <span className="font-bold font-satoshi">
                  {car.transmision || 'Manual'}
                </span>
              </div>
              <div className="flex flex-col items-center p-1.5 bg-slate-50 rounded">
                <span className="material-symbols-outlined text-[18px] text-primary mb-1">
                  local_gas_station
                </span>
                <span className="font-bold font-satoshi truncate w-full text-center">
                  {car.combustible || 'N/A'}
                </span>
              </div>
            </div>

            {/* Mobile List compact specs */}
            <div
              className={`${viewMode === 'list' ? 'block md:hidden' : 'hidden'} mb-3`}
            >
              <p className="text-xs text-slate-500 font-medium flex flex-wrap gap-2 items-center">
                <span>{car.year}</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                <span>{car.cv} CV</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                <span className="truncate">{car.combustible}</span>
              </p>
            </div>
          </div>

          {/* Desktop/Tablet Buttons */}
          <div
            className={`mt-auto grid grid-cols-2 gap-2 ${viewMode === 'list' ? 'hidden md:grid' : 'grid'}`}
          >
            <ActionButton isReserva={true} isMobile={false} />
            <ActionButton isReserva={false} isMobile={false} />
          </div>
        </div>
      </div>

      {/* Mobile Row Buttons (List view specific) */}
      {viewMode === 'list' && (
        <div className="md:hidden flex w-full gap-2 p-2 bg-slate-50 border-t border-slate-100">
          <ActionButton isReserva={true} isMobile={true} className="flex-1" />
          <ActionButton isReserva={false} isMobile={true} className="flex-1" />
        </div>
      )}
    </motion.div>
  );
}
