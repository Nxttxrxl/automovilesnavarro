import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useState } from 'react';

export default function Hero() {
  // Textos blindados - NO MODIFICAR
  const HERO_TITLE =
    'Nuestros coches te pueden gustar más o menos, pero hay una cosa garantizada: ';
  const HERO_HIGHLIGHT = 'Máxima honestidad';
  const HERO_SUBTITLE_END = ' y la mejor relación calidad/precio.';
  const HERO_DESCRIPTION =
    'Especialistas en la selección de vehículos premium con revisión certificada y trato directo.';

  // Trust Cards Data
  const trustCards = [
    {
      id: 1,
      type: 'stat',
      number: '+1.000',
      label: 'Vehículos entregados',
      color: 'text-[#0F172A]',
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
      label: 'De experiencia',
      color: 'text-[#0F172A]',
      delay: 0.2,
    },
    {
      id: 4,
      type: 'stat',
      number: '12 Meses',
      label: 'De garantía',
      color: 'text-[#0F172A]',
      delay: 0.3,
    },
  ];

  // Spring physics configuration
  const springConfig = { stiffness: 100, damping: 20 };

  // Animation variants with spring
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        ...springConfig,
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
        type: 'spring',
        ...springConfig,
      },
    },
  };

  // Reusable Buttons Component
  const HeroButtons = () => (
    <motion.div
      className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto"
      variants={textVariants}
    >
      <a
        className="inline-flex bg-[#0F172A] hover:bg-[#1e293b] text-white text-base font-bold h-14 px-8 rounded-lg transition-all shadow-lg shadow-slate-900/30 items-center justify-center gap-2"
        href="/catalogo"
      >
        <span className="material-symbols-outlined">search</span>
        Explorar Inventario
      </a>
      <a
        className="inline-flex bg-[#0F172A] hover:bg-[#1e293b] text-white text-base font-bold h-14 px-8 rounded-lg transition-all shadow-lg shadow-slate-900/30 items-center justify-center gap-2"
        href="https://es.wallapop.com/user/navarroa-334767045"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="material-symbols-outlined">storefront</span>
        Ver Catálogo Wallapop
      </a>
    </motion.div>
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
      <motion.div
        variants={cardVariants}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{
          scale: 1.05,
          transition: { type: 'spring', ...springConfig },
        }}
        className="bg-white/30 backdrop-blur-2xl rounded-2xl shadow-lg p-6 border border-white/40 flex flex-col items-center justify-center text-center gap-3 relative overflow-hidden will-change-transform"
      >
        {/* Stat Card */}
        {card.type === 'stat' && (
          <>
            <p className={`text-3xl sm:text-5xl font-black ${card.color}`}>
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
              <p className={`text-3xl sm:text-5xl font-black ${card.color}`}>
                {card.number}
              </p>
              <span className="text-2xl sm:text-3xl">{card.icon}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              {card.label}
            </p>
          </>
        )}

        {/* Hover glow effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-indigo-400/10 via-transparent to-slate-400/10 opacity-0 rounded-2xl"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    );
  };

  return (
    <section className="relative bg-gradient-to-br from-slate-100 via-indigo-50/30 to-white overflow-hidden pt-32 pb-24 lg:pt-48 lg:pb-36">
      {/* Animated Mesh Gradients - Aurora Palette */}
      <motion.div
        className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-slate-200/30 rounded-full blur-3xl"
        animate={{
          x: [0, -30, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute top-1/2 right-0 w-96 h-96 bg-indigo-100/40 rounded-full blur-3xl"
        animate={{
          x: [0, -40, 0],
          y: [0, 40, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 13,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-24">
          {/* Text Column */}
          <motion.div
            className="lg:w-1/2 flex flex-col gap-8 z-10 w-full"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-transparent border-2 border-[#0F172A] w-fit"
              variants={textVariants}
            >
              <span className="size-2 rounded-full bg-[#0F172A] animate-pulse"></span>
              <span className="text-xs font-semibold text-[#0F172A] tracking-wide uppercase">
                Calidad Certificada y Trato Directo
              </span>
            </motion.div>

            <motion.h1
              className="text-[26px] sm:text-[26px] lg:text-[36px] font-extrabold text-[#0F172A] tracking-tight leading-tight"
              variants={textVariants}
            >
              {HERO_TITLE}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0F172A] to-slate-700">
                {HERO_HIGHLIGHT}
              </span>
              {HERO_SUBTITLE_END}
            </motion.h1>

            <motion.p
              className="text-base lg:text-lg text-slate-600 font-normal leading-relaxed max-w-lg"
              variants={textVariants}
            >
              {HERO_DESCRIPTION}
            </motion.p>

            {/* Desktop Buttons (Hidden on mobile) */}
            <div className="hidden lg:block">
              <HeroButtons />
            </div>
          </motion.div>

          {/* Trust Grid Column */}
          <motion.div
            className="lg:w-1/2 relative z-0 w-full"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Enhanced atmospheric background */}
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-30 -z-10 pointer-events-none"></div>

            <div className="grid grid-cols-2 gap-4 h-auto perspective-1000">
              {trustCards.map((card, index) => (
                <TiltCard key={card.id} card={card} index={index} />
              ))}
            </div>
          </motion.div>

          {/* Mobile Buttons (Visible only on mobile, after Grid) */}
          <motion.div
            className="lg:hidden w-full"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <HeroButtons />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
