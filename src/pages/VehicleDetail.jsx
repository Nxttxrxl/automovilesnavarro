import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
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

export default function VehicleDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    async function fetchCar() {
      // Extract ID from slug (only numeric ID is used for DB search)
      const carId = extractIdFromSlug(slug);

      if (!carId) {
        console.error('Invalid slug format');
        navigate('/catalogo');
        return;
      }

      const { data, error } = await supabase
        .from('coches')
        .select('*')
        .eq('id', carId)
        .single();

      if (error || !data) {
        console.error('Error fetching car:', error);
        navigate('/catalogo');
      } else {
        setCar(data);
      }
      setLoading(false);
    }

    fetchCar();
  }, [slug, navigate]);

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

  // Generate WhatsApp message
  const whatsappMessage = `Hola, me interesa el ${car.marca} ${car.modelo} con referencia ${car.id} que he visto en la web.`;
  const whatsappLink = `https://wa.me/34683646930?text=${encodeURIComponent(whatsappMessage)}`;

  // Format price
  const formatPrice = (price) => {
    if (!price || price === 0) return 'Precio a consultar';
    return `${price.toLocaleString('es-ES')}€`;
  };

  // Generate SEO meta tags
  const pageTitle = `${car.marca} ${car.modelo}${car.year ? ` ${car.year}` : ''} en Tarragona | Automoción Navarro`;
  const pageDescription = `${car.marca} ${car.modelo}${car.year ? ` del ${car.year}` : ''} con ${car.km?.toLocaleString('es-ES') || 0} km. ${formatPrice(car.precio)}. Revisado y con garantía de 12 meses en Automoción Navarro.`;

  // Get environmental label
  const labelOption = LABEL_OPTIONS.find((opt) => opt.value === car.etiqueta);

  // Image gallery (for future multi-image support, currently single image)
  const images = car.imagen ? [car.imagen] : [];

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="product" />
        {car.imagen && (
          <meta
            property="og:image"
            content={`https://abvcgcemjxbfeibmtsxp.supabase.co/storage/v1/object/public/coches/${car.imagen}`}
          />
        )}
      </Helmet>

      <div className="min-h-screen bg-slate-50 pt-20">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center gap-2 text-sm text-slate-600">
              <Link to="/" className="hover:text-primary transition-colors">
                Inicio
              </Link>
              <span>/</span>
              <Link
                to="/catalogo"
                className="hover:text-primary transition-colors"
              >
                Catálogo
              </Link>
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
                        alt={`${car.marca} ${car.modelo}`}
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

                  {/* Environmental Badge Overlay */}
                  {labelOption?.image && (
                    <div className="absolute bottom-4 left-4">
                      <img
                        src={labelOption.image}
                        alt={`Etiqueta ${car.etiqueta}`}
                        className="h-12 w-auto drop-shadow-lg"
                        title={labelOption.label}
                      />
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
                <h2 className="text-sm font-bold font-satoshi text-slate-900 mb-4 uppercase tracking-wide">
                  Especificaciones
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* 1. Motor */}
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <span className="material-symbols-outlined text-primary text-2xl">
                      engineering
                    </span>
                    <div>
                      <div className="text-xs font-geist text-slate-500">
                        Motor
                      </div>
                      <div className="font-bold font-geist text-slate-900">
                        {car.motor || 'N/A'}
                      </div>
                    </div>
                  </div>

                  {/* 2. Combustible */}
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <span className="material-symbols-outlined text-primary text-2xl">
                      local_gas_station
                    </span>
                    <div>
                      <div className="text-xs text-slate-500">Combustible</div>
                      <div className="font-semibold text-slate-900">
                        {car.combustible || 'N/A'}
                      </div>
                    </div>
                  </div>

                  {/* 3. Potencia */}
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <span className="material-symbols-outlined text-primary text-2xl">
                      speed
                    </span>
                    <div>
                      <div className="text-xs text-slate-500">Potencia</div>
                      <div className="font-semibold text-slate-900">
                        {car.cv || 'N/A'} CV
                      </div>
                    </div>
                  </div>

                  {/* 4. Transmisión */}
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <span className="material-symbols-outlined text-primary text-2xl">
                      settings_suggest
                    </span>
                    <div>
                      <div className="text-xs text-slate-500">Transmisión</div>
                      <div className="font-semibold text-slate-900">
                        {car.transmision || 'Manual'}
                      </div>
                    </div>
                  </div>

                  {/* 5. Kilometraje */}
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <span className="material-symbols-outlined text-primary text-2xl">
                      add_road
                    </span>
                    <div>
                      <div className="text-xs text-slate-500">Kilometraje</div>
                      <div className="font-semibold text-slate-900">
                        {car.km?.toLocaleString('es-ES') || 0} km
                      </div>
                    </div>
                  </div>

                  {/* 6. Etiqueta Ambiental */}
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <span className="material-symbols-outlined text-primary text-2xl">
                      eco
                    </span>
                    <div>
                      <div className="text-xs text-slate-500">Etiqueta</div>
                      <div className="font-semibold text-slate-900">
                        {car.etiqueta || 'Sin Etiqueta'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description Section */}
              {car.descripcion && (
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                  <h2 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wide flex items-center gap-2">
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
                <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-wide">
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
                      <div className="font-semibold text-slate-900 text-sm">
                        Revisión Certificada
                      </div>
                      <div className="text-xs text-slate-600">
                        Puesta a punto completa
                      </div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-green-600 text-xl mt-0.5">
                      check_circle
                    </span>
                    <div>
                      <div className="font-semibold text-slate-900 text-sm">
                        Garantía de 12 meses
                      </div>
                      <div className="text-xs text-slate-600">
                        Cobertura nacional incluida
                      </div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-green-600 text-xl mt-0.5">
                      check_circle
                    </span>
                    <div>
                      <div className="font-semibold text-slate-900 text-sm">
                        Transparencia Total
                      </div>
                      <div className="text-xs text-slate-600">
                        Sin costes ocultos ni sorpresas
                      </div>
                    </div>
                  </li>
                </ul>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/catalogo"
                    className="bg-slate-200 hover:bg-slate-300 text-slate-900 font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      arrow_back
                    </span>
                    <span>Volver</span>
                  </Link>

                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      bookmark
                    </span>
                    <span>Reservar</span>
                  </a>
                </div>

                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#004A99] hover:bg-blue-800 text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
                >
                  <span className="material-symbols-outlined text-[24px]">
                    chat
                  </span>
                  <span>Consultar / Contactar</span>
                </a>
              </div>

              {/* Finance Calculator */}
              <FinanceCalculator car={car} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
