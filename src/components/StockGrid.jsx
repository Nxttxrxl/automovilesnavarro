import { useEffect, useState, useMemo } from "react";
import { supabase } from "../lib/supabaseClient";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

// Environmental label options and image paths
const LABEL_OPTIONS = [
    { value: '0', label: 'Cero Emisiones', image: '/etiquetas/DistAmbDGT_CeroEmisiones.svg' },
    { value: 'ECO', label: 'ECO', image: '/etiquetas/DistAmbDGT_ECO.svg' },
    { value: 'C', label: 'C', image: '/etiquetas/DistAmbDGT_C.svg' },
    { value: 'B', label: 'B', image: '/etiquetas/DistAmbDGT_B.svg' },
    { value: 'Sin Etiqueta', label: 'Sin Etiqueta', image: null }
];

// Custom slider styles
const sliderStyles = {
    trackStyle: { backgroundColor: '#2563eb', height: 6 },
    handleStyle: {
        borderColor: '#2563eb',
        backgroundColor: '#fff',
        width: 20,
        height: 20,
        marginTop: -7,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
    railStyle: { backgroundColor: '#e5e7eb', height: 6 },
};

export default function StockGrid() {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtersOpen, setFiltersOpen] = useState(true); // Default open on desktop

    // Filter states with range sliders
    const [marcaSeleccionada, setMarcaSeleccionada] = useState("");
    const [precioRango, setPrecioRango] = useState([0, 60000]);
    const [anioRango, setAnioRango] = useState([2000, 2026]);
    const [etiquetaSeleccionada, setEtiquetaSeleccionada] = useState("");

    useEffect(() => {
        async function fetchCars() {
            const { data, error } = await supabase.from("coches").select("*");
            if (error) {
                console.error("Error fetching cars:", error);
            } else {
                setCars(data);
            }
            setLoading(false);
        }

        fetchCars();
    }, []);

    // Get unique brands from DB
    const uniqueBrands = useMemo(() => {
        const brands = [...new Set(cars.map(car => car.marca))];
        return brands.filter(Boolean).sort();
    }, [cars]);

    const getWhatsAppLink = (car) => {
        const year = car.year || 'sin especificar';
        const message = `Hola, estoy interesado en el ${car.marca} ${car.modelo} de ${year} que he visto en vuestra web.`;
        return `https://wa.me/34683646930?text=${encodeURIComponent(message)}`;
    };

    const formatPrice = (price) => {
        if (!price || price === 0) return "Precio a consultar";
        return `${price.toLocaleString('es-ES')}€`;
    };

    // Combined filtering logic with range sliders
    const filteredCars = useMemo(() => {
        return cars.filter(car => {
            // Filter by selected brand
            if (marcaSeleccionada && car.marca !== marcaSeleccionada) {
                return false;
            }

            // Filter by price range - only if car has a price
            if (car.precio != null && (car.precio < precioRango[0] || car.precio > precioRango[1])) {
                return false;
            }

            // Filter by year range - only if car has a year
            if (car.year != null && (car.year < anioRango[0] || car.year > anioRango[1])) {
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
    }, [cars, marcaSeleccionada, precioRango, anioRango, etiquetaSeleccionada]);

    const resetFilters = () => {
        setMarcaSeleccionada("");
        setPrecioRango([0, 60000]);
        setAnioRango([2000, 2026]);
        setEtiquetaSeleccionada("");
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
                            <span className="material-symbols-outlined text-[20px]">tune</span>
                            <span>Filtros / Búsqueda</span>
                        </div>
                        <span className={`material-symbols-outlined transition-transform ${filtersOpen ? 'rotate-180' : ''}`}>
                            expand_more
                        </span>
                    </button>
                </div>

                <div className="md:flex md:gap-8">
                    {/* Filter Bar - Collapsible on mobile, now a sticky sidebar on desktop */}
                    <div className={`bg-white rounded-xl border border-slate-200 p-6 shadow-sm transition-all duration-300 md:w-1/4 md:sticky md:top-24 md:self-start ${filtersOpen ? 'block mb-8' : 'hidden md:block'
                        }`}>
                        <div className="flex flex-col gap-6"> {/* Removed lg:flex-row as it's now a column */}
                            {/* Brand Filter */}
                            <div className="flex-1">
                                <label htmlFor="marca" className="block text-sm font-medium text-slate-700 mb-2">
                                    Marca
                                </label>
                                <select
                                    id="marca"
                                    value={marcaSeleccionada}
                                    onChange={(e) => setMarcaSeleccionada(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                                >
                                    <option value="">Todas las marcas</option>
                                    {uniqueBrands.map(brand => (
                                        <option key={brand} value={brand}>{brand}</option>
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
                                        handleStyle={[sliderStyles.handleStyle, sliderStyles.handleStyle]}
                                        railStyle={sliderStyles.railStyle}
                                    />
                                    <div className="text-sm text-slate-600 mt-3 text-center font-medium">
                                        {precioRango[0].toLocaleString('es-ES')}€ - {precioRango[1].toLocaleString('es-ES')}€
                                    </div>
                                </div>
                            </div>

                            {/* Year Range Slider */}
                            <div className="flex-1">
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
                                        handleStyle={[sliderStyles.handleStyle, sliderStyles.handleStyle]}
                                        railStyle={sliderStyles.railStyle}
                                    />
                                    <div className="text-sm text-slate-600 mt-3 text-center font-medium">
                                        {anioRango[0]} - {anioRango[1]}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Environmental Labels - Pill Design */}
                        <div className="mt-6">
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
                        </div>

                        {/* Reset Button */}
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={resetFilters}
                                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                                Limpiar filtros
                            </button>
                        </div>
                    </div>

                    <div className="md:w-3/4">
                        {/* Results Count */}
                        <div className="mb-6 text-sm text-slate-600">
                            Mostrando <span className="font-semibold text-slate-900">{filteredCars.length}</span> de {cars.length} vehículos
                        </div>

                        {filteredCars.length === 0 ? (
                            <div className="text-center py-20 text-slate-500">
                                <p className="text-lg mb-2">No se encontraron vehículos con estos filtros.</p>
                                <button
                                    onClick={resetFilters}
                                    className="text-primary hover:text-blue-700 font-medium"
                                >
                                    Limpiar filtros
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredCars.map((car) => (
                                    <div
                                        key={car.id}
                                        className="group bg-white rounded-lg overflow-hidden border border-slate-200 hover:border-primary/50 transition-all duration-300 hover:shadow-lg flex flex-col"
                                    >
                                        {/* Image with aspect-video ratio */}
                                        <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-50 relative overflow-hidden flex items-center justify-center border-b border-slate-100">
                                            {car.imagen ? (
                                                <picture>
                                                    <source
                                                        srcSet={`/inventory_webp/${decodeURIComponent(car.imagen.split('/').pop().replace(/\.[^/.]+$/, ""))}.webp`}
                                                        type="image/webp"
                                                    />
                                                    <img
                                                        src={`/inventory_png/${decodeURIComponent(car.imagen.split('/').pop().replace(/\.[^/.]+$/, ""))}.png`}
                                                        alt={`${car.marca} ${car.modelo}`}
                                                        className="w-full h-full object-cover"
                                                        loading="lazy"
                                                        decoding="async"
                                                    />
                                                </picture>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center gap-3 text-slate-300">
                                                    <span className="text-2xl font-black tracking-tighter text-slate-400">NAVARRO</span>
                                                    <span className="material-symbols-outlined text-5xl">directions_car</span>
                                                </div>
                                            )}

                                            {/* Badge Etiqueta */}
                                            {car.etiqueta && (
                                                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm border border-slate-200 px-2.5 py-1 rounded-md text-xs font-bold text-slate-700 uppercase shadow-sm">
                                                    {car.etiqueta}
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-5 flex-grow flex flex-col">
                                            <div className="flex-grow">
                                                <div className="flex items-start justify-between mb-2">
                                                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">
                                                        {car.marca} {car.modelo}
                                                    </h3>
                                                    {car.year && (
                                                        <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-700 rounded">
                                                            {car.year}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-slate-500 mb-4 pb-3 border-b border-slate-100">{car.version}</p>

                                                {/* Price Display */}
                                                <div className="mb-4">
                                                    <p className="text-2xl font-bold text-primary">{formatPrice(car.precio)}</p>
                                                </div>

                                                <div className="grid grid-cols-3 gap-2 text-xs text-slate-600 mb-4">
                                                    <div className="flex flex-col items-center p-2 bg-slate-50 rounded">
                                                        <span className="material-symbols-outlined text-[18px] text-primary mb-1">engineering</span>
                                                        <span className="font-medium text-center">{car.motor || 'N/A'}</span>
                                                    </div>
                                                    <div className="flex flex-col items-center p-2 bg-slate-50 rounded">
                                                        <span className="material-symbols-outlined text-[18px] text-primary mb-1">speed</span>
                                                        <span className="font-medium">{car.cv || 'N/A'} CV</span>
                                                    </div>
                                                    <div className="flex flex-col items-center p-2 bg-slate-50 rounded">
                                                        <span className="material-symbols-outlined text-[18px] text-primary mb-1">add_road</span>
                                                        <span className="font-medium">{car.km?.toLocaleString('es-ES') || 0} km</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <a
                                                href={getWhatsAppLink(car)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-auto w-full bg-primary hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">chat</span>
                                                Consultar disponibilidad
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
