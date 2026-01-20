import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const services = [
  {
    icon: (
      <svg
        fill="none"
        height="32"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="32"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      </svg>
    ),
    title: 'Garantía Flexible',
    description:
      'Hasta 12 meses de cobertura mecánica integral incluida en el precio. Respondemos ante cualquier imprevisto para que tú solo disfrutes del viaje.',
    extra: 'Cobertura Nacional',
  },
  {
    icon: (
      <svg
        fill="none"
        height="32"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="32"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" x2="8" y1="13" y2="13"></line>
        <line x1="16" x2="8" y1="17" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
    ),
    title: 'Gestión Administrativa Completa',
    description:
      'Olvídate del papeleo. Nos encargamos de toda la tramitación del cambio de nombre y gestoría para que te lleves tu coche al instante y sin complicaciones.',
  },
  {
    icon: (
      <svg
        fill="none"
        height="32"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="32"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" x2="16.65" y1="21" y2="16.65"></line>
      </svg>
    ),
    title: 'Localización de Vehículos Premium',
    description:
      '¿Tienes un modelo específico en mente? Localizamos, revisamos y certificamos el coche de tus sueños con total transparencia y rigor técnico.',
  },
];

export default function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const springConfig = { stiffness: 100, damping: 20 };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        ...springConfig,
      },
    },
  };

  return (
    <section
      className="relative py-24 bg-slate-100 border-y border-white/20 overflow-hidden"
      id="servicios"
      ref={ref}
    >
      {/* Animated Mesh Gradients */}
      <motion.div
        className="absolute top-1/4 left-0 w-96 h-96 bg-blue-300/40 rounded-full blur-[100px]"
        animate={{
          x: [0, 40, 0],
          y: [0, -30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-0 w-96 h-96 bg-indigo-300/30 rounded-full blur-[100px]"
        animate={{
          x: [0, -50, 0],
          y: [0, 40, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ type: 'spring', ...springConfig }}
        >
          <h2 className="text-3xl md:text-4xl font-black font-satoshi text-[#1F2937] mb-4 tracking-tight">
            Nuestra Garantía de Confianza
          </h2>
          <p className="text-slate-600 text-lg font-satoshi font-medium">
            Transparencia mecánica en cada vehículo.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{
                y: -8,
                transition: { type: 'spring', ...springConfig },
              }}
              className="bg-white/40 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-2xl transition-shadow duration-300 group relative overflow-hidden"
            >
              {/* Gradient glow on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-transparent to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                initial={false}
              />

              {/* Icon container with gradient background */}
              <motion.div
                className="relative w-16 h-16 bg-gradient-to-br from-[#004A99]/10 to-blue-500/10 text-[#004A99] rounded-2xl flex items-center justify-center mb-8 group-hover:from-[#004A99] group-hover:to-blue-600 group-hover:text-white transition-all duration-300"
                whileHover={{
                  scale: 1.1,
                  rotate: 5,
                  transition: { type: 'spring', ...springConfig },
                }}
              >
                {service.icon}
              </motion.div>

              <h3 className="text-xl font-black font-satoshi text-[#1F2937] mb-4 relative z-10 tracking-tight">
                {service.title}
              </h3>
              <p className="text-slate-600 leading-relaxed mb-4 relative z-10 font-satoshi">
                {service.description}
              </p>
              {service.extra && (
                <div className="mt-auto relative z-10">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold font-geist tracking-wider uppercase bg-blue-50/80 backdrop-blur-sm text-[#004A99] border border-blue-100/50">
                    {service.extra}
                  </span>
                </div>
              )}

              {/* Border glow effect */}
              <motion.div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(0, 74, 153, 0.3) 0%, rgba(99, 102, 241, 0.2) 100%)',
                  filter: 'blur(20px)',
                  transform: 'scale(1.05)',
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
