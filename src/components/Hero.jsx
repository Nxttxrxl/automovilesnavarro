import { motion } from 'framer-motion';
import { ShieldCheck, Wrench } from 'lucide-react';

export default function Hero() {
  // Textos blindados - NO MODIFICAR
  const HERO_TITLE =
    'Nuestros coches te pueden gustar más o menos, pero hay una cosa garantizada: ';
  const HERO_HIGHLIGHT = 'Máxima honestidad';
  const HERO_SUBTITLE_END = ' y la mejor relación calidad/precio.';
  const HERO_DESCRIPTION =
    '20 años seleccionando los mejores vehículos en Tarragona. Revisados a fondo para que tú solo te preocupes de conducir.';

  // Trust Cards Data
  const trustCards = [
    {
      id: 1,
      type: 'stat',
      number: '+1.000',
      label: 'Vehículos entregados',
      color: 'text-[#004A99]',
      delay: 0,
    },
    {
      id: 2,
      type: 'rating',
      number: '4.9/5',
      label: 'Satisfacción Clientes',
      color: 'text-amber-500',
      icon: '⭐',
      delay: 0.1,
    },
    {
      id: 3,
      type: 'guarantee',
      icon: ShieldCheck,
      title: 'Garantía Premium 12 Meses',
      delay: 0.2,
    },
    {
      id: 4,
      type: 'service',
      icon: Wrench,
      title: 'Revisión Certificada 100 Puntos',
      delay: 0.3,
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  // Reusable Buttons Component
  const HeroButtons = () => (
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
  );

  return (
    <section className="relative bg-[#F9FAFB] overflow-hidden pt-32 pb-24 lg:pt-48 lg:pb-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          {/* Text Column */}
          <div className="lg:w-1/2 flex flex-col gap-8 z-10 w-full">
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

            {/* Desktop Buttons (Hidden on mobile) */}
            <div className="hidden lg:block">
              <HeroButtons />
            </div>
          </div>

          {/* Trust Grid Column */}
          <div className="lg:w-1/2 relative z-0 w-full">
            {/* ATMOSPHERE ELEMENTS */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-blue-100/50 blur-3xl opacity-50 rounded-full -z-10 pointer-events-none"></div>
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-20 -z-10 pointer-events-none"></div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="relative z-10"
            >
              <div className="grid grid-cols-2 gap-4 h-auto">
                {trustCards.map((card, index) => (
                  <motion.div
                    key={card.id}
                    variants={cardVariants}
                    animate="animate"
                    whileHover={{
                      scale: 1.05,
                      boxShadow:
                        '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                      transition: { duration: 0.2 },
                    }}
                    className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-md p-6 border border-white/50 flex flex-col items-center justify-center text-center gap-3 relative overflow-hidden"
                    style={{
                      animation: `float-${index} ${3 + index * 0.5}s ease-in-out infinite`,
                    }}
                  >
                    {/* Stat Card */}
                    {card.type === 'stat' && (
                      <>
                        <p
                          className={`text-3xl sm:text-5xl font-black ${card.color}`}
                        >
                          {card.number}
                        </p>
                        <p className="text-xs sm:text-sm text-slate-600 font-medium">
                          {card.label}
                        </p>
                      </>
                    )}

                    {/* Rating Card */}
                    {card.type === 'rating' && (
                      <>
                        <div className="flex items-center gap-2">
                          <p
                            className={`text-3xl sm:text-5xl font-black ${card.color}`}
                          >
                            {card.number}
                          </p>
                          <span className="text-2xl sm:text-3xl">
                            {card.icon}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 font-medium">
                          {card.label}
                        </p>
                      </>
                    )}

                    {/* Icon Cards (Guarantee & Service) */}
                    {(card.type === 'guarantee' || card.type === 'service') && (
                      <>
                        <card.icon
                          className="w-8 h-8 sm:w-12 sm:h-12 text-[#004A99]"
                          strokeWidth={1.5}
                        />
                        <p className="text-xs sm:text-sm text-slate-900 font-bold leading-tight">
                          {card.title}
                        </p>
                      </>
                    )}

                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Mobile Buttons (Visible only on mobile, after Grid) */}
          <div className="lg:hidden w-full">
            <HeroButtons />
          </div>
        </div>
      </div>

      {/* CSS Keyframes for floating animation */}
      <style>{`
                @keyframes float-0 {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-8px); }
                }
                @keyframes float-1 {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                @keyframes float-2 {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-6px); }
                }
                @keyframes float-3 {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-12px); }
                }
            `}</style>
    </section>
  );
}
