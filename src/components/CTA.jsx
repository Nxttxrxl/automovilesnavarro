export default function CTA() {
    return (
        <section className="py-20 bg-[#F9FAFB] border-t border-slate-100">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl font-bold text-[#1F2937] mb-6">
                    ¿No encuentras el coche que buscas?
                </h2>
                <p className="text-lg text-slate-500 mb-8 leading-relaxed max-w-2xl mx-auto">
                    Dinos qué modelo tienes en mente. Nosotros lo localizamos, lo
                    revisamos de arriba a abajo y te lo entregamos con nuestra garantía de
                    12 meses. Sin complicaciones y con total transparencia.
                </p>
                <a
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-8 rounded-lg transition-all shadow-lg shadow-primary/20"
                    href="tel:+34683646930"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <svg
                        fill="none"
                        height="20"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                    Contactar para un encargo
                </a>
            </div>
        </section>
    );
}
