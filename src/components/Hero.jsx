export default function Hero() {
    // Textos blindados - NO MODIFICAR
    const HERO_TITLE = "Nuestros coches te pueden gustar más o menos, pero hay una cosa garantizada: ";
    const HERO_HIGHLIGHT = "Máxima honestidad";
    const HERO_SUBTITLE_END = " y la mejor relación calidad/precio.";
    const HERO_DESCRIPTION = "20 años de experiencia y miles de coches vendidos en Tarragona hablando claro. Si no tenemos lo que buscas, te lo encontramos.";
    const STAT_1_NUMBER = "+1000";
    const STAT_1_LABEL = "de coches vendidos";
    const STAT_2_NUMBER = "4.9/5";
    const STAT_2_LABEL = "Valoración Clientes";

    return (
        <section className="relative bg-white overflow-hidden pt-32 pb-24 lg:pt-48 lg:pb-36">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                    {/* Text Column */}
                    <div className="lg:w-1/2 flex flex-col gap-8 z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 w-fit">
                            <span className="size-2 rounded-full bg-primary animate-pulse"></span>
                            <span className="text-xs font-semibold text-primary tracking-wide uppercase">
                                Honestidad y Transparencia
                            </span>
                        </div>

                        <h1 className="text-[26px] sm:text-[26px] lg:text-[36px] font-extrabold text-[#1F2937] tracking-tight leading-tight">
                            {HERO_TITLE}
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                                {HERO_HIGHLIGHT}
                            </span>
                            {HERO_SUBTITLE_END}
                        </h1>

                        <p className="text-base lg:text-lg text-slate-500 font-normal leading-relaxed max-w-lg">
                            {HERO_DESCRIPTION}
                        </p>

                        <div className="mt-4">
                            <a
                                className="inline-flex bg-[#13C1AC] hover:bg-[#11AE9A] text-white text-base font-bold h-14 px-8 rounded-lg transition-all shadow-lg shadow-teal-500/30 items-center justify-center gap-2"
                                href="https://es.wallapop.com/user/navarroa-334767045"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <span className="material-symbols-outlined">storefront</span>
                                Ver Catálogo en Wallapop
                            </a>
                        </div>

                        <div className="flex items-center gap-8 mt-6 pt-8 border-t border-slate-100">
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

                    {/* Image Column */}
                    <div className="lg:w-1/2 relative z-0">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl drop-shadow-2xl transform hover:scale-105 transition-transform duration-500 max-h-[500px] lg:-mt-32">
                            <img
                                src="/src/assets/images/Gemini_Generated_Image_z0zxu4z0zxu4z0zx.png"
                                alt="Coche de lujo Navarro Automoción"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>
                        {/* Decorative Blob */}
                        <div className="absolute -top-10 -right-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 -z-10 animate-blob"></div>
                        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 -z-10 animate-blob animation-delay-2000"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
