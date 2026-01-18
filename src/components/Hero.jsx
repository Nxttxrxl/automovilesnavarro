import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Hero() {
    const [featuredCars, setFeaturedCars] = useState([]);

    useEffect(() => {
        async function fetchFeaturedCars() {
            // Fetch all cars and filter for those with real Spanish license plates
            const { data } = await supabase
                .from("coches")
                .select("*");

            if (data) {
                // Filter cars with Spanish license plate format (4 digits + 3 letters)
                // This ensures photos show uncensored plates
                const carsWithRealPlates = data.filter(car => {
                    if (!car.matricula) return false;
                    // Spanish plate format: 1234ABC
                    const plateRegex = /^\d{4}[A-Z]{3}$/;
                    return plateRegex.test(car.matricula);
                });

                // Get 3 random cars from those with real plates
                const shuffled = carsWithRealPlates.sort(() => 0.5 - Math.random());
                setFeaturedCars(shuffled.slice(0, 3));
            }
        }
        fetchFeaturedCars();
    }, []);

    // Textos blindados - NO MODIFICAR
    const HERO_TITLE = "Nuestros coches te pueden gustar más o menos, pero hay una cosa garantizada: ";
    const HERO_HIGHLIGHT = "Máxima honestidad";
    const HERO_SUBTITLE_END = " y la mejor relación calidad/precio.";
    const HERO_DESCRIPTION = "20 años seleccionando los mejores vehículos en Tarragona. Revisados a fondo para que tú solo te preocupes de conducir.";
    const STAT_1_NUMBER = "+1000";
    const STAT_1_LABEL = "de coches vendidos";
    const STAT_2_NUMBER = "4.9/5";
    const STAT_2_LABEL = "Valoración Clientes";

    return (
        <section className="relative bg-[#F9FAFB] overflow-hidden pt-32 pb-24 lg:pt-48 lg:pb-36">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                    {/* Text Column */}
                    <div className="lg:w-1/2 flex flex-col gap-8 z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 w-fit">
                            <span className="size-2 rounded-full bg-primary animate-pulse"></span>
                            <span className="text-xs font-semibold text-primary tracking-wide uppercase">
                                Calidad Certificada y Trato Directo
                            </span>
                        </div>

                        <h1 className="text-[26px] sm:text-[26px] lg:text-[36px] font-extrabold text-[#1F2937] tracking-tight leading-tight">
                            {HERO_TITLE}
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#004A99]">
                                {HERO_HIGHLIGHT}
                            </span>
                            {HERO_SUBTITLE_END}
                        </h1>

                        <p className="text-base lg:text-lg text-slate-500 font-normal leading-relaxed max-w-lg">
                            {HERO_DESCRIPTION}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
                            <a
                                className="inline-flex bg-[#004A99] hover:bg-[#003d7a] text-white text-base font-bold h-14 px-8 rounded-lg transition-all shadow-lg shadow-[#004A99]/30 items-center justify-center gap-2"
                                href="/catalogo"
                            >
                                <span className="material-symbols-outlined">search</span>
                                Explorar Inventario
                            </a>
                            <a
                                className="inline-flex bg-[#13C1AC] hover:bg-[#11AE9A] text-white text-base font-bold h-14 px-8 rounded-lg transition-all shadow-lg shadow-teal-500/30 items-center justify-center gap-2"
                                href="https://es.wallapop.com/user/navarroa-334767045"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <span className="material-symbols-outlined">storefront</span>
                                Ver Catálogo Wallapop
                            </a>
                        </div>

                        <div className="flex items-center gap-8 mt-6 pt-8 border-t border-slate-200">
                            <div>
                                <p className="text-3xl font-bold text-[#1F2937]">{STAT_1_NUMBER}</p>
                                <p className="text-sm text-slate-500">{STAT_1_LABEL}</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-[#1F2937]">{STAT_2_NUMBER}</p>
                                <p className="text-sm text-slate-500">{STAT_2_LABEL}</p>
                            </div>
                        </div>
                    </div>

                    {/* Bento Grid Column */}
                    <div className="lg:w-1/2 relative z-0">
                        <div className="grid grid-cols-2 gap-4 h-[500px]">
                            {/* Top Left - Car 1 */}
                            <div className="relative rounded-xl overflow-hidden shadow-lg group bg-slate-200">
                                {featuredCars[0] && (
                                    <>
                                        <img
                                            src={`https://abvcgcemjxbfeibmtsxp.supabase.co/storage/v1/object/public/coches/${featuredCars[0].imagen}`}
                                            alt={`${featuredCars[0].marca} ${featuredCars[0].modelo}`}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                        <div className="absolute bottom-4 left-4 text-white">
                                            <p className="font-bold text-lg">{featuredCars[0].marca} {featuredCars[0].modelo}</p>
                                            <p className="text-sm opacity-90">{featuredCars[0].precio?.toLocaleString('es-ES')}€</p>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Top Right - Car 2 */}
                            <div className="relative rounded-xl overflow-hidden shadow-lg group bg-slate-200">
                                {featuredCars[1] && (
                                    <>
                                        <img
                                            src={`https://abvcgcemjxbfeibmtsxp.supabase.co/storage/v1/object/public/coches/${featuredCars[1].imagen}`}
                                            alt={`${featuredCars[1].marca} ${featuredCars[1].modelo}`}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                        <div className="absolute bottom-4 left-4 text-white">
                                            <p className="font-bold text-lg">{featuredCars[1].marca} {featuredCars[1].modelo}</p>
                                            <p className="text-sm opacity-90">{featuredCars[1].precio?.toLocaleString('es-ES')}€</p>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Bottom Full Width - Car 3 */}
                            <div className="col-span-2 relative rounded-xl overflow-hidden shadow-lg group bg-slate-200">
                                {featuredCars[2] && (
                                    <>
                                        <img
                                            src={`https://abvcgcemjxbfeibmtsxp.supabase.co/storage/v1/object/public/coches/${featuredCars[2].imagen}`}
                                            alt={`${featuredCars[2].marca} ${featuredCars[2].modelo}`}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                        <div className="absolute bottom-4 left-4 text-white">
                                            <p className="font-bold text-lg">{featuredCars[2].marca} {featuredCars[2].modelo}</p>
                                            <p className="text-sm opacity-90">{featuredCars[2].precio?.toLocaleString('es-ES')}€</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
