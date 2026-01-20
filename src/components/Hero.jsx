import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useState } from 'react';

export default function Hero() {
  // Textos blindados - NO MODIFICAR
  const HERO_TITLE =
    'Nuestros coches te pueden gustar más o menos, pero hay una cosa garantizada: ';
  const HERO_HIGHLIGHT = 'Máxima honestidad';
  const HERO_SUBTITLE_END = ' y la mejor relación calidad/precio.';

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
      type: 'stat',
      number: '+20 Años',
      label: '  experiencia',
      color: 'text-[#004A99]',
      delay: 0.2,
    },
    {
      id: 4,
      type: 'stat',
      number: '12 Meses',
      label: 'De garantía',
      color: 'text-[#004A99]',
      delay: 0.3,
    },
  ];

  const springConfig = { stiffness: 100, damping: 20 };

  const gridVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3,
        duration: 0.5,
        type: 'spring',
        ...springConfig,
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

  // 3D Tilt Card Component
  const TiltCard = ({ card, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useSpring(
      useTransform(y, [-100, 100], [10, -10]),
      springConfig,
    );
    const rotateY = useSpring(
      useTransform(x, [-100, 100], [-10, 10]),
      springConfig,
    );

    const handleMouseMove = (event) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      x.set(event.clientX - centerX);
      y.set(event.clientY - centerY);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      x.set(0);
      y.set(0);
    };

    return (
      <div
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/20 flex flex-col items-center justify-center text-center gap-3 relative overflow-hidden will-change-transform transition-transform duration-300 hover:scale-105"
      >
        {/* Stat Card */}
        {card.type === 'stat' && (
          <>
            <p
              className={`text-3xl sm:text-5xl font-black font-satoshi tracking-tighter ${card.color}`}
            >
              {card.number}
            </p>
            <p className="text-xs sm:text-sm font-geist font-bold text-slate-600 uppercase tracking-wide">
              {card.label}
            </p>
          </>
        )}

        {/* Rating Card */}
        {card.type === 'rating' && (
          <>
            <div className="flex items-center gap-2">
              <p
                className={`text-3xl sm:text-5xl font-black font-satoshi tracking-tighter ${card.color}`}
              >
                {card.number}
              </p>
              <span className="text-2xl sm:text-3xl">{card.icon}</span>
            </div>
            <p className="text-xs sm:text-sm font-geist font-bold text-slate-600 uppercase tracking-wide">
              {card.label}
            </p>
          </>
        )}

        {/* Hover glow effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-slate-50/20 opacity-0 rounded-2xl"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>
    );
  };

  return (
    <section className="relative bg-slate-100 overflow-hidden pt-32 pb-24 lg:pt-48 lg:pb-36">
      {/* Subtle Atmospheric Fog - Elegant Mesh Gradients */}
      <motion.div
        className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-300/40 rounded-full blur-[100px] -z-10"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-300/30 rounded-full blur-[100px] -z-10"
        animate={{
          x: [0, -30, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-blue-50/60 rounded-full blur-[100px] -z-10"
        animate={{
          x: [0, -40, 0],
          y: [0, 40, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-24">
          {/* Text Column */}
          <div className="lg:w-1/2 flex flex-col gap-8 relative z-20 w-full">
            {/* Refined Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 backdrop-blur-sm border border-slate-200 shadow-sm w-fit">
              <span className="size-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-xs font-bold font-geist text-primary tracking-wider uppercase">
                Calidad Certificada y Trato Directo
              </span>
            </div>

            <h1 className="text-[26px] sm:text-[26px] lg:text-[36px] font-black font-satoshi text-[#1F2937] tracking-tight leading-tight">
              {HERO_TITLE}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#004A99]">
                {HERO_HIGHLIGHT}
              </span>
              {HERO_SUBTITLE_END}
            </h1>

            {/* Desktop Buttons (Hidden on mobile) */}
            <div className="hidden lg:block">
              <HeroButtons />
            </div>
          </div>

          {/* Trust Grid Column */}
          <div className="lg:w-1/2 relative z-20 w-full">
            {/* Enhanced atmospheric background */}
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-30 -z-10 pointer-events-none"></div>

            <motion.div
              className="grid grid-cols-2 gap-4 h-auto perspective-1000"
              variants={gridVariants}
              initial="hidden"
              animate="visible"
            >
              {trustCards.map((card, index) => (
                <TiltCard key={card.id} card={card} index={index} />
              ))}
            </motion.div>
          </div>

          {/* Mobile Buttons (Visible only on mobile, after Grid) */}
          <div className="lg:hidden w-full">
            <HeroButtons />
          </div>
        </div>
      </div>
    </section>
  );
}
