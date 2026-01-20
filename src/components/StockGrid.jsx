import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { fetchPublicCars } from '../services/carService';
import { generateSlug } from '../utils/slugUtils';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

// Environmental label options and image paths
const LABEL_OPTIONS = [
  {
    value: '0',
    label: 'Cero Emisiones',
    image: '/etiquetas/DistAmbDGT_CeroEmisiones.svg',
  },
  { value: 'ECO', label: 'ECO', image: '/etiquetas/DistAmbDGT_ECO.svg' },
  { value: 'C', label: 'C', image: '/etiquetas/DistAmbDGT_C.svg' },
  { value: 'B', label: 'B', image: '/etiquetas/DistAmbDGT_B.svg' },
  { value: 'Sin Etiqueta', label: 'Sin Etiqueta', image: null },
];

// Custom slider styles - Premium Edition
const sliderStyles = {
  trackStyle: {
    backgroundColor: '#004A99',
    height: 8,
    borderRadius: 4,
  },
  handleStyle: {
    borderColor: '#004A99',
    backgroundColor: '#fff',
    width: 24,
    height: 16,
    borderRadius: 4,
    marginTop: -4,
    boxShadow: '0 2px 8px rgba(0, 74, 153, 0.3)',
  },
  railStyle: {
    backgroundColor: '#e5e7eb',
    height: 8,
    borderRadius: 4,
  },
};

export default function StockGrid() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(true); // Default open on desktop
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortOption, setSortOption] = useState('destacados'); // Sort option
  const [currentPage, setCurrentPage] = useState(1); // Current page

  const itemsPerPage = viewMode === 'grid' ? 10 : 20; // 10 in grid (quadricula), 20 in list (lista)

  // Filter states with range sliders
  const [marcaSeleccionada, setMarcaSeleccionada] = useState('');
  const [precioRango, setPrecioRango] = useState([0, 60000]);
  const [anioRango, setAnioRango] = useState([2000, 2026]);
  const [kmRango, setKmRango] = useState([0, 350000]);
  const [cvRango, setCvRango] = useState([60, 500]);
  const [combustibleSeleccionado, setCombustibleSeleccionado] = useState('');
  const [etiquetaSeleccionada, setEtiquetaSeleccionada] = useState('');

  useEffect(() => {
    async function loadCars() {
      try {
        const data = await fetchPublicCars();
        setCars(data);
      } catch (error) {
        console.error('Error fetching cars:', error);
      } finally {
        setLoading(false);
      }
    }

    loadCars();
  }, []);

  // Get unique brands from DB
  const uniqueBrands = useMemo(() => {
    const brands = [...new Set(cars.map((car) => car.marca))];
    return brands.filter(Boolean).sort();
  }, [cars]);

  const getWhatsAppLink = (car, isReserva = false) => {
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

  // Combined filtering logic with range sliders
  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      // Filter by selected brand
      if (marcaSeleccionada && car.marca !== marcaSeleccionada) {
        return false;
      }

      // Filter by price range - only if car has a price
      if (
        car.precio != null &&
        (car.precio < precioRango[0] || car.precio > precioRango[1])
      ) {
        return false;
      }

      // Filter by year range - only if car has a year
      if (
        car.year != null &&
        (car.year < anioRango[0] || car.year > anioRango[1])
      ) {
        return false;
      }

      // Filter by kilometraje range
      if (car.km != null && (car.km < kmRango[0] || car.km > kmRango[1])) {
        return false;
      }

      // Filter by potencia (CV) range
      if (car.cv != null && (car.cv < cvRango[0] || car.cv > cvRango[1])) {
        return false;
      }

      // Filter by combustible type
      if (
        combustibleSeleccionado &&
        car.combustible !== combustibleSeleccionado
      ) {
        return false;
      }

      // Filter by environmental label
      if (etiquetaSeleccionada) {
        if (etiquetaSeleccionada === 'Sin Etiqueta') {
          if (car.etiqueta) return false;
        } else {
          if (car.etiqueta !== etiquetaSeleccionada) return false;
        }
      }

      return true;
    });
  }, [
    cars,
    marcaSeleccionada,
    precioRango,
    anioRango,
    kmRango,
    cvRango,
    combustibleSeleccionado,
    etiquetaSeleccionada,
  ]);

  // Sorting logic
  const sortedCars = useMemo(() => {
    const sorted = [...filteredCars];

    switch (sortOption) {
      case 'precio-asc':
        return sorted.sort((a, b) => (a.precio || 0) - (b.precio || 0));
      case 'precio-desc':
        return sorted.sort((a, b) => (b.precio || 0) - (a.precio || 0));
      case 'anio-desc':
        return sorted.sort((a, b) => (b.year || 0) - (a.year || 0));
      case 'km-asc':
        return sorted.sort((a, b) => (a.km || 0) - (b.km || 0));
      case 'destacados':
      default:
        return sorted;
    }
  }, [filteredCars, sortOption]);

  // Pagination logic
  const paginatedCars = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedCars.slice(startIndex, endIndex);
  }, [sortedCars, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedCars.length / itemsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    marcaSeleccionada,
    precioRango,
    anioRango,
    kmRango,
    cvRango,
    combustibleSeleccionado,
    etiquetaSeleccionada,
    sortOption,
  ]);

  const resetFilters = () => {
    setMarcaSeleccionada('');
    setPrecioRango([0, 60000]);
    setAnioRango([2000, 2026]);
    setKmRango([0, 350000]);
    setCvRango([60, 500]);
    setCombustibleSeleccionado('');
    setEtiquetaSeleccionada('');
    setSortOption('destacados');
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <section className="py-10 bg-slate-50" id="stock">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Filter Toggle Button */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-lg shadow-sm font-medium text-slate-700 hover:bg-slate-50 transition-all"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">
                tune
              </span>
              <span>Filtros / Búsqueda</span>
            </div>
            <span
              className={`material-symbols-outlined transition-transform ${filtersOpen ? 'rotate-180' : ''}`}
            >
              expand_more
            </span>
          </button>
        </div>

        <div className="md:flex md:gap-8">
          {/* Filter Bar - Collapsible on mobile, now a sticky sidebar on desktop */}
          <div
            className={`bg-white rounded-xl border border-slate-200 p-6 transition-all duration-300 md:w-1/4 md:sticky md:top-24 md:self-start ${
              filtersOpen ? 'block mb-8' : 'hidden md:block'
            }`}
            style={{
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              borderRadius: '12px',
            }}
          >
            <div className="flex flex-col gap-6">
              {' '}
              {/* Removed lg:flex-row as it's now a column */}
              {/* Brand Filter */}
              <div className="flex-1">
                <label
                  htmlFor="marca"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Marca
                </label>
                <select
                  id="marca"
                  value={marcaSeleccionada}
                  onChange={(e) => setMarcaSeleccionada(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                >
                  <option value="">Todas las marcas</option>
                  {uniqueBrands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>
              {/* Price Range Slider */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Rango de Precio
                </label>
                <div className="px-2 pt-2">
                  <Slider
                    range
                    min={0}
                    max={60000}
                    step={1000}
                    value={precioRango}
                    onChange={setPrecioRango}
                    trackStyle={[sliderStyles.trackStyle]}
                    handleStyle={[
                      sliderStyles.handleStyle,
                      sliderStyles.handleStyle,
                    ]}
                    railStyle={sliderStyles.railStyle}
                  />
                  <div className="text-sm text-slate-600 mt-3 text-center font-medium">
                    {precioRango[0].toLocaleString('es-ES')}€ -{' '}
                    {precioRango[1].toLocaleString('es-ES')}€
                  </div>
                </div>
              </div>
              {/* Year Range Slider */}
              <div className="flex-1" style={{ paddingBottom: '1.5rem' }}>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Rango de Año
                </label>
                <div className="px-2 pt-2">
                  <Slider
                    range
                    min={2000}
                    max={2026}
                    step={1}
                    value={anioRango}
                    onChange={setAnioRango}
                    trackStyle={[sliderStyles.trackStyle]}
                    handleStyle={[
                      sliderStyles.handleStyle,
                      sliderStyles.handleStyle,
                    ]}
                    railStyle={sliderStyles.railStyle}
                  />
                  <div className="text-sm text-slate-600 mt-3 text-center font-medium">
                    {anioRango[0]} - {anioRango[1]}
                  </div>
                </div>
              </div>
              {/* Kilometraje Range Slider */}
              <div className="flex-1" style={{ paddingBottom: '1.5rem' }}>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Kilometraje
                </label>
                <div className="px-2 pt-2">
                  <Slider
                    range
                    min={0}
                    max={350000}
                    step={5000}
                    value={kmRango}
                    onChange={setKmRango}
                    trackStyle={[sliderStyles.trackStyle]}
                    handleStyle={[
                      sliderStyles.handleStyle,
                      sliderStyles.handleStyle,
                    ]}
                    railStyle={sliderStyles.railStyle}
                  />
                  <div className="text-sm text-slate-600 mt-3 text-center font-medium">
                    {kmRango[0].toLocaleString('es-ES')} km -{' '}
                    {kmRango[1] >= 350000
                      ? '350,000+'
                      : kmRango[1].toLocaleString('es-ES')}{' '}
                    km
                  </div>
                </div>
              </div>
              {/* Potencia (CV) Range Slider */}
              <div className="flex-1" style={{ paddingBottom: '1.5rem' }}>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Potencia (CV)
                </label>
                <div className="px-2 pt-2">
                  <Slider
                    range
                    min={60}
                    max={500}
                    step={10}
                    value={cvRango}
                    onChange={setCvRango}
                    trackStyle={[sliderStyles.trackStyle]}
                    handleStyle={[
                      sliderStyles.handleStyle,
                      sliderStyles.handleStyle,
                    ]}
                    railStyle={sliderStyles.railStyle}
                  />
                  <div className="text-sm text-slate-600 mt-3 text-center font-medium">
                    {cvRango[0]} CV - {cvRango[1] >= 500 ? '500+' : cvRango[1]}{' '}
                    CV
                  </div>
                </div>
              </div>
              {/* Combustible Filter */}
              <div className="flex-1" style={{ paddingBottom: '1.5rem' }}>
                <label
                  htmlFor="combustible"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Combustible
                </label>
                <select
                  id="combustible"
                  value={combustibleSeleccionado}
                  onChange={(e) => setCombustibleSeleccionado(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#004A99] focus:border-transparent transition-all"
                >
                  <option value="">Cualquiera</option>
                  <option value="Diésel">Diésel</option>
                  <option value="Gasolina">Gasolina</option>
                  <option value="Híbrido">Híbrido</option>
                  <option value="Eléctrico">Eléctrico</option>
                </select>
              </div>
            </div>

            {/* Environmental Labels - Pill Design */}
            {/* TEMPORARILY DISABLED - Filter section commented out for UI simplification */}
            {/* <div className="mt-6">
                            <label className="block text-sm font-medium text-slate-700 mb-3">
                                Etiqueta Ambiental
                            </label>
                            <div className="flex flex-wrap gap-3">
                                {LABEL_OPTIONS.map(option => {
                                    const isActive = etiquetaSeleccionada === option.value;

                                    // For "Sin Etiqueta" (no badge image)
                                    if (!option.image) {
                                        return (
                                            <button
                                                key={option.value}
                                                onClick={() => setEtiquetaSeleccionada(isActive ? "" : option.value)}
                                                className={`w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold transition-all ${isActive
                                                    ? 'bg-slate-500 text-white ring-4 ring-blue-600 scale-110'
                                                    : 'bg-slate-200 text-slate-600 opacity-50 hover:opacity-75'
                                                    }`}
                                                title={option.label}
                                            >
                                                Sin
                                            </button>
                                        );
                                    }

                                    // For badges with images
                                    return (
                                        <button
                                            key={option.value}
                                            onClick={() => setEtiquetaSeleccionada(isActive ? "" : option.value)}
                                            className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all ${isActive
                                                ? 'ring-4 ring-[#1D4ED8] scale-110'
                                                : 'opacity-50 hover:opacity-75'
                                                }`}
                                            title={option.label}
                                        >
                                            <img
                                                src={option.image}
                                                alt={option.label}
                                                className="w-full h-full object-contain"
                                            />
                                        </button>
                                    );
                                })}
                            </div>
                        </div> */}

            {/* Reset Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={resetFilters}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">
                  restart_alt
                </span>
                Reiniciar búsqueda
              </button>
            </div>
          </div>

          <div className="md:w-3/4">
            {/* Results Count, Sort and View Toggle */}
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="text-sm text-slate-600">
                <span className="font-semibold text-slate-900">
                  {sortedCars.length}
                </span>{' '}
                unidades disponibles para entrega inmediata
              </div>

              <div className="flex w-full sm:w-auto items-center justify-between sm:justify-start gap-3">
                {/* Sort Dropdown */}
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 focus:ring-2 focus:ring-[#004A99] focus:border-transparent transition-all bg-white"
                >
                  <option value="destacados">Destacados</option>
                  <option value="precio-asc">Precio: Menor a Mayor</option>
                  <option value="precio-desc">Precio: Mayor a Menor</option>
                  <option value="anio-desc">Más nuevos</option>
                  <option value="km-asc">Menos kilómetros</option>
                </select>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1">
                  <button
                    onClick={() => {
                      setViewMode('grid');
                      setCurrentPage(1);
                    }}
                    className={`p-2 rounded transition-all ${
                      viewMode === 'grid'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                    title="Vista en cuadrícula"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      grid_view
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setViewMode('list');
                      setCurrentPage(1);
                    }}
                    className={`p-2 rounded transition-all ${
                      viewMode === 'list'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                    title="Vista en lista"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      view_list
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {sortedCars.length === 0 ? (
              <div className="text-center py-20 text-slate-500">
                <p className="text-lg mb-2">
                  No se encontraron vehículos con estos filtros.
                </p>
                <button
                  onClick={resetFilters}
                  className="text-primary hover:text-blue-700 font-medium"
                >
                  Reiniciar búsqueda
                </button>
              </div>
            ) : (
              <>
                <div
                  className={`transition-all duration-300 ${
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                      : 'flex flex-col gap-6'
                  }`}
                >
                  {paginatedCars.map((car) => {
                    const slug = generateSlug(car);
                    return (
                      <div
                        key={car.id}
                        className={`group bg-white rounded-lg overflow-hidden border border-slate-200 hover:border-primary/50 transition-all duration-300 hover:shadow-lg ${
                          viewMode === 'grid'
                            ? 'flex flex-col'
                            : 'flex flex-row'
                        }`}
                      >
                        {/* Clickable Image that links to detail page */}
                        <Link
                          to={`/catalogo/${slug}`}
                          className={`bg-gradient-to-br from-slate-100 to-slate-50 relative overflow-hidden border-b md:border-b-0 border-slate-100 shrink-0 ${
                            viewMode === 'grid'
                              ? 'aspect-video w-full'
                              : 'w-32 sm:w-48 md:w-80 lg:w-96 aspect-[4/3] border-r self-start'
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
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = '/logo_nuevo_rect_png.png';
                                }}
                              />
                            </picture>
                          ) : (
                            <div className="flex flex-col items-center justify-center gap-3 text-slate-300">
                              <span className="text-2xl font-black tracking-tighter text-slate-400">
                                AUTOMOCIÓN
                              </span>
                              <span className="material-symbols-outlined text-5xl">
                                directions_car
                              </span>
                            </div>
                          )}

                          {/* Badge Estado */}
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
                        </Link>

                        {/* Content */}
                        <div
                          className={`${viewMode === 'list' ? 'p-3 sm:p-4' : 'p-4'} flex-grow flex flex-col`}
                        >
                          <div className="flex-grow">
                            <Link to={`/catalogo/${slug}`}>
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">
                                  {car.marca} {car.modelo}
                                </h3>
                                {car.year && (
                                  <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-700 rounded">
                                    {car.year}
                                  </span>
                                )}
                              </div>
                            </Link>
                            <p className="text-sm text-slate-500 mb-2 pb-2 border-b border-slate-100 truncate">
                              {car.version}
                            </p>

                            {/* Price Display */}
                            <div className="mb-3">
                              <p className="text-2xl font-bold text-primary">
                                {formatPrice(car.precio)}
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-3">
                              <div className="flex flex-col items-center p-1.5 bg-slate-50 rounded">
                                <span className="material-symbols-outlined text-[18px] text-primary mb-1">
                                  engineering
                                </span>
                                <span className="font-medium text-center">
                                  {car.motor || 'N/A'}
                                </span>
                              </div>
                              <div className="flex flex-col items-center p-1.5 bg-slate-50 rounded">
                                <span className="material-symbols-outlined text-[18px] text-primary mb-1">
                                  speed
                                </span>
                                <span className="font-medium">
                                  {car.cv || 'N/A'} CV
                                </span>
                              </div>
                              <div className="flex flex-col items-center p-1.5 bg-slate-50 rounded">
                                <span className="material-symbols-outlined text-[18px] text-primary mb-1">
                                  settings_suggest
                                </span>
                                <span className="font-medium">
                                  {car.transmision || 'Manual'}
                                </span>
                              </div>
                              <div className="flex flex-col items-center p-1.5 bg-slate-50 rounded">
                                <span className="material-symbols-outlined text-[18px] text-primary mb-1">
                                  local_gas_station
                                </span>
                                <div className="flex items-center justify-center gap-1.5 w-full">
                                  <span className="font-medium truncate">
                                    {car.combustible || 'N/A'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Dual Buttons */}
                          <div className="mt-auto grid grid-cols-2 gap-2">
                            <a
                              href={getWhatsAppLink(car, true)}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md"
                            >
                              <span className="material-symbols-outlined text-[20px]">
                                bookmark
                              </span>
                              <span className="hidden sm:inline">Reservar</span>
                            </a>
                            <a
                              href={getWhatsAppLink(car, false)}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="bg-primary hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md"
                            >
                              <span className="material-symbols-outlined text-[20px]">
                                chat
                              </span>
                              <span className="hidden sm:inline">
                                Consultar
                              </span>
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        currentPage === 1
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-white border border-slate-300 text-slate-700 hover:bg-[#004A99] hover:text-white hover:border-[#004A99]'
                      }`}
                    >
                      Anterior
                    </button>

                    <div className="flex items-center gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-10 h-10 rounded-lg font-medium transition-all ${
                              currentPage === page
                                ? 'bg-[#004A99] text-white shadow-md'
                                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            {page}
                          </button>
                        ),
                      )}
                    </div>

                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        currentPage === totalPages
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-white border border-slate-300 text-slate-700 hover:bg-[#004A99] hover:text-white hover:border-[#004A99]'
                      }`}
                    >
                      Siguiente
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
