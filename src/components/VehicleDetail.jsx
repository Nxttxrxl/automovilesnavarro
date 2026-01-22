import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { extractIdFromSlug } from '../utils/slugUtils';
import FinanceCalculator from '../components/FinanceCalculator';

// Environmental label options
const LABEL_OPTIONS = [
  {
    value: '0',
    label: 'Cero Emisiones',
    image: '/etiquetas/DistAmbDGT_CeroEmisiones.svg',
  },
  { value: 'ECO', label: 'ECO', image: '/etiquetas/DistAmbDGT_ECO.svg' },
  { value: 'C', label: 'C', image: '/etiquetas/DistAmbDGT_C.svg' },
  { value: 'B', label: 'B', image: '/etiquetas/DistAmbDGT_B.svg' },
];

export default function VehicleDetail({ slug }) {
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    async function fetchCar() {
      // Extract ID from slug (only numeric ID is used for DB search)
      const carId = extractIdFromSlug(slug);

      if (!carId) {
        console.error('Invalid slug format');
        window.location.href = '/catalogo';
        return;
      }

      const { data, error } = await supabase
        .from('coches')
        .select('*')
        .eq('id', carId)
        .single();

      if (error || !data) {
        console.error('Error fetching car:', error);
        window.location.href = '/catalogo';
      } else {
        setCar(data);
      }
      setLoading(false);
    }

    fetchCar();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 pt-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!car) {
    return null; // Will redirect via useEffect
  }

  // Generate WhatsApp links
  const contactMessage = `Hola, estoy interesado en el ${car.marca} ${car.modelo} de ${car.year || ''} que he visto en vuestra web.`;
  const contactLink = `https://wa.me/34683646930?text=${encodeURIComponent(contactMessage)}`;

  const reservaMessage = `Hola! Me gustaría reservar el ${car.marca} ${car.modelo} que he visto en vuestra web.`;
  const reservaLink = `https://wa.me/34683646930?text=${encodeURIComponent(reservaMessage)}`;

  // Format price
  const formatPrice = (price) => {
    if (!price || price === 0) return 'Precio a consultar';
    return `${price.toLocaleString('es-ES')}€`;
  };

  // Generate SEO meta tags
  const pageTitle = `${car.marca} ${car.modelo}${car.year ? ` ${car.year}` : ''} en Tarragona | Automóviles Navarro`;
  const pageDescription = `${car.marca} ${car.modelo}${car.year ? ` del ${car.year}` : ''} con ${car.km?.toLocaleString('es-ES') || 0} km. ${formatPrice(car.precio)}. Revisado y con garantía de 12 meses en Automóviles Navarro.`;

  // JSON-LD Structured Data for SEO - Exhaustive Version
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Car',
    name: `${car.marca} ${car.modelo} ${car.version || ''}`,
    brand: {
      '@type': 'Brand',
      name: car.marca,
    },
    model: car.modelo,
    vehicleModelDate: car.year,
    vehicleConfiguration: car.version,
    mileageFromOdometer: {
      '@type': 'QuantitativeValue',
      value: car.km,
      unitCode: 'KMT',
    },
    fuelType: car.combustible,
    vehicleEngine: {
      '@type': 'EngineSpecification',
      name: car.motor || 'N/A',
      enginePower: {
        '@type': 'QuantitativeValue',
        value: car.cv,
        unitText: 'CV',
      },
    },
    vehicleTransmission: car.transmision || 'Manual',
    description: car.descripcion || pageDescription,
    image: car.imagen
      ? `https://abvcgcemjxbfeibmtsxp.supabase.co/storage/v1/object/public/coches/${car.imagen}`
      : null,
    offers: {
      '@type': 'Offer',
      price: car.precio,
      priceCurrency: 'EUR',
      availability:
        car.estado === 'Activo'
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      url:
        typeof window !== 'undefined'
          ? window.location.href
          : `https://automovilesnavarro.com/catalogo/${slug}`,
    },
  };

  // Get environmental label
  const labelOption = LABEL_OPTIONS.find((opt) => opt.value === car.etiqueta);

  // Image gallery (for future multi-image support, currently single image)
  const images = car.imagen ? [car.imagen] : [];

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-slate-600">
            <a href="/" className="hover:text-primary transition-colors">
              Inicio
            </a>
            <span>/</span>
            <a
              href="/catalogo"
              className="hover:text-primary transition-colors"
            >
              Catálogo
            </a>
            <span>/</span>
            <span className="text-slate-900 font-medium">
              {car.marca} {car.modelo}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Header (Visible only on mobile) */}
        <div className="lg:hidden bg-white rounded-xl p-6 border border-slate-200 shadow-sm mb-6">
          <div className="flex items-baseline gap-3 mb-2">
            <h1 className="text-2xl font-black font-satoshi text-slate-900 leading-tight tracking-tight">
              {car.marca} {car.modelo}
            </h1>
            {car.year && (
              <span className="text-xl font-bold font-geist text-slate-800 shrink-0">
                {car.year}
              </span>
            )}
          </div>
          {car.version && (
            <p className="text-slate-600 text-sm mb-4">{car.version}</p>
          )}
          <div className="text-3xl font-black font-satoshi tracking-tighter text-primary">
            {formatPrice(car.precio)}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column - Image Gallery (Wider: col-span-3 = 60%) */}
          <div className="lg:col-span-3 space-y-6">
            <div className="space-y-4">
              {/* Main Image */}
              <div className="bg-gradient-to-br from-slate-100 to-slate-50 rounded-xl overflow-hidden border border-slate-200 aspect-video relative shadow-sm">
                {car.imagen ? (
                  <picture className="w-full h-full">
                    <source
                      srcSet={`https://abvcgcemjxbfeibmtsxp.supabase.co/storage/v1/object/public/coches/${car.imagen.replace(/\.[^/.]+$/, '')}.webp`}
                      type="image/webp"
                    />
                    <img
                      src={`https://abvcgcemjxbfeibmtsxp.supabase.co/storage/v1/object/public/coches/${car.imagen}`}
                      alt={`${car.marca} ${car.modelo} - Automóviles Navarro`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/logo_nuevo_rect_png.png';
                      }}
                    />
                  </picture>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-300">
                    <span className="text-2xl font-black tracking-tighter text-slate-400">
                      AUTOMOCIÓN
                    </span>
                    <span className="material-symbols-outlined text-6xl">
                      directions_car
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                        currentImageIndex === index
                          ? 'border-primary'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={`https://abvcgcemjxbfeibmtsxp.supabase.co/storage/v1/object/public/coches/${img}`}
                        alt={`Vista ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Technical Grid (Moved here) */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <h2 className="text-[12px] font-black font-satoshi text-slate-500 mb-4 uppercase tracking-[0.15em]">
                Especificaciones
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {/* 1. Motor */}
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <span className="material-symbols-outlined text-primary text-2xl">
                    engineering
                  </span>
                  <div className="flex flex-col">
                    <div className="text-[14px] font-bold font-geist text-slate-700 leading-tight">
                      Motor
                    </div>
                    <div className="text-[12px] font-medium font-satoshi text-slate-900">
                      {car.motor || 'N/A'}
                    </div>
                  </div>
                </div>

                {/* 2. Combustible */}
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <span className="material-symbols-outlined text-primary text-2xl">
                    local_gas_station
                  </span>
                  <div className="flex flex-col">
                    <div className="text-[14px] font-bold font-geist text-slate-700 leading-tight">
                      Combustible
                    </div>
                    <div className="text-[12px] font-medium font-satoshi text-slate-900">
                      {car.combustible || 'N/A'}
                    </div>
                  </div>
                </div>

                {/* 3. Potencia */}
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <span className="material-symbols-outlined text-primary text-2xl">
                    speed
                  </span>
                  <div className="flex flex-col">
                    <div className="text-[14px] font-bold font-geist text-slate-700 leading-tight">
                      Potencia
                    </div>
                    <div className="text-[12px] font-medium font-satoshi text-slate-900">
                      {car.cv || 'N/A'} CV
                    </div>
                  </div>
                </div>

                {/* 4. Transmisión */}
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <span className="material-symbols-outlined text-primary text-2xl">
                    settings_suggest
                  </span>
                  <div className="flex flex-col">
                    <div className="text-[14px] font-bold font-geist text-slate-700 leading-tight">
                      Transmisión
                    </div>
                    <div className="text-[12px] font-medium font-satoshi text-slate-900">
                      {car.transmision || 'Manual'}
                    </div>
                  </div>
                </div>

                {/* 5. Kilometraje */}
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <span className="material-symbols-outlined text-primary text-2xl">
                    add_road
                  </span>
                  <div className="flex flex-col">
                    <div className="text-[14px] font-bold font-geist text-slate-700 leading-tight">
                      Kilometraje
                    </div>
                    <div className="text-[12px] font-medium font-satoshi text-slate-900">
                      {car.km?.toLocaleString('es-ES') || 0} km
                    </div>
                  </div>
                </div>

                {/* 6. Etiqueta Ambiental */}
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <span className="material-symbols-outlined text-primary text-2xl">
                    eco
                  </span>
                  <div className="flex flex-col">
                    <div className="text-[14px] font-bold font-geist text-slate-700 leading-tight">
                      Etiqueta
                    </div>
                    <div className="text-[12px] font-medium font-satoshi text-slate-900">
                      {car.etiqueta || 'Sin Etiqueta'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Section */}
            {car.descripcion && (
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <h2 className="text-[12px] font-black font-satoshi text-slate-500 mb-4 uppercase tracking-[0.15em] flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">
                    description
                  </span>
                  Descripción
                </h2>
                <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                  {car.descripcion}
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Vehicle Info (Narrower: col-span-2 = 40%) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header (Hidden on Mobile, Visible on Desktop with lg:block) */}
            <div className="hidden lg:block bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-baseline gap-3 mb-2">
                <h1 className="text-2xl font-black font-satoshi text-slate-900 leading-tight tracking-tight">
                  {car.marca} {car.modelo}
                </h1>
                {car.year && (
                  <span className="text-xl font-bold font-geist text-slate-500 shrink-0">
                    {car.year}
                  </span>
                )}
              </div>
              {car.version && (
                <p className="text-slate-600 text-sm mb-4">{car.version}</p>
              )}
              <div className="text-3xl font-black font-satoshi tracking-tighter text-primary">
                {formatPrice(car.precio)}
              </div>
            </div>

            {/* Compromiso Navarro Section (Moved here) */}
            <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl p-6 border border-blue-100 shadow-sm">
              <h2 className="text-[12px] font-black font-satoshi text-slate-500 mb-4 flex items-center gap-2 uppercase tracking-[0.15em]">
                <span className="material-symbols-outlined text-primary text-xl">
                  verified
                </span>
                Compromiso Navarro
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-green-600 text-xl mt-0.5">
                    check_circle
                  </span>
                  <div>
                    <div className="font-bold font-satoshi text-slate-900 text-sm">
                      Revisión Certificada
                    </div>
                    <div className="text-xs font-medium font-satoshi text-slate-600">
                      Puesta a punto completa
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-green-600 text-xl mt-0.5">
                    check_circle
                  </span>
                  <div>
                    <div className="font-bold font-satoshi text-slate-900 text-sm">
                      Garantía de 12 meses
                    </div>
                    <div className="text-xs font-medium font-satoshi text-slate-600">
                      Cobertura nacional incluida
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-green-600 text-xl mt-0.5">
                    check_circle
                  </span>
                  <div>
                    <div className="font-bold font-satoshi text-slate-900 text-sm">
                      Transparencia Total
                    </div>
                    <div className="text-xs font-medium font-satoshi text-slate-600">
                      Sin costes ocultos ni sorpresas
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3">
              <a
                href={contactLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-primary hover:bg-primary-hover text-white font-bold font-satoshi tracking-wide py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-[22px]">
                  chat
                </span>
                <span>Contactar</span>
              </a>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href={reservaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 hover:bg-green-700 text-white font-bold font-satoshi py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    bookmark
                  </span>
                  <span>Reservar</span>
                </a>

                <a
                  href="/catalogo"
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold font-satoshi py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    arrow_back
                  </span>
                  <span>Volver</span>
                </a>
              </div>
            </div>

            {/* Finance Calculator */}
            <FinanceCalculator car={car} />
          </div>
        </div>
      </div>
    </div>
  );
}
