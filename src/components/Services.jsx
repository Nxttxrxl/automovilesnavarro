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
        title: "Garantía mecánica de 12 meses",
        description:
            "12 meses de cobertura real. Revisamos cada detalle para que tu única preocupación sea conducir.",
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
        title: "Cambio de nombre incluido",
        description:
            "Nos encargamos de todo el proceso de cambio de nombre para que tú no tengas que preocuparte por nada.",
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
        title: "Búsqueda a la Carta",
        description:
            "¿Buscas un modelo específico? Cuéntanos qué necesitas y lo localizamos y revisamos por ti con total transparencia.",
    },
];

export default function Services() {
    return (
        <section
            className="py-24 bg-[#E5E7EB] border-y border-gray-100"
            id="servicios"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold text-[#1F2937] mb-4 tracking-tight">
                        Es nuestro Compromiso
                    </h2>
                    <p className="text-slate-500 text-lg">
                        Transparencia absoluta en cada paso.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl p-8 shadow-card border border-slate-100 hover:shadow-soft transition-all hover:-translate-y-1 group"
                        >
                            <div className="w-14 h-14 bg-[#5877C6]/10 text-[#5877C6] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#5877C6] group-hover:text-white transition-colors">
                                {service.icon}
                            </div>
                            <h3 className="text-xl font-bold text-[#1F2937] mb-3">
                                {service.title}
                            </h3>
                            <p className="text-slate-500 leading-relaxed">
                                {service.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
