export default function Footer() {
  return (
    <footer className="bg-[#0e172a] text-white py-16" id="contacto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <span className="font-black font-satoshi text-xl tracking-tight">
                Automoción Navarro
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Honestidad, experiencia y compromiso. Tu concesionario de
              confianza en Tarragona para vehículos de ocasión seleccionados.
            </p>
            <div className="flex gap-4">
              <a
                className="size-9 rounded-full bg-white/5 hover:text-[#004A99] flex items-center justify-center transition-all"
                href="https://www.instagram.com/navarroautomocion/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                className="size-9 rounded-full bg-white/5 hover:text-blue-600 flex items-center justify-center transition-all"
                href="https://www.facebook.com/navarroautomocion/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Location */}
          <div className="col-span-1">
            <h3 className="font-bold font-satoshi text-lg mb-6">
              Dónde Estamos
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-400 text-sm">
                <span className="material-symbols-outlined text-primary mt-0.5 text-[20px]">
                  location_on
                </span>
                <span>
                  TV-7211, km. 9 (Área de servicio Cepsa), 43120, Constantí
                </span>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <span className="material-symbols-outlined text-primary text-[20px]">
                  call
                </span>
                <span className="font-geist">+34 683 646 930</span>
              </li>
            </ul>
          </div>

          {/* Schedule */}
          <div className="col-span-1">
            <h3 className="font-bold font-satoshi text-lg mb-6">Horario</h3>
            <ul className="space-y-3">
              <li className="flex justify-between text-slate-400 text-sm">
                <span>Lunes a Viernes:</span>
                <span className="text-white font-geist">16:00 - 18:30</span>
              </li>
              <li className="flex justify-between text-slate-400 text-sm">
                <span>Sábados y Domingos:</span>
                <span className="text-white text-right">Cerrado</span>
              </li>
            </ul>
          </div>

          {/* Map */}
          <a
            href="https://www.google.com/maps/place/Navarro+Automoci%C3%B3n/@41.1477581,1.2153251,17z/data=!3m1!4b1!4m6!3m5!1s0x12a3fde1157f7973:0x3fc1290a410c6586!8m2!3d41.1477581!4d1.2153251!16s%2Fg%2F11j259xz4j?hl=es&entry=ttu&g_ep=EgoyMDI2MDExMy4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            className="col-span-1 h-48 rounded-xl overflow-hidden relative bg-slate-800 border border-slate-700 block active:scale-[0.98] transition-transform"
          >
            <div
              className="w-full h-full bg-cover bg-center opacity-80 hover:opacity-100 transition-opacity"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDxTZbdbSfItKDAWB_u3jISUkMJ3oKPKyvOrToZixtXnULdeBzA74dcwJwtp_g7eOcka3ptoakVdDpnwWmCX3MEDCjvX5j5QyLRQorTBH9Uj1lWKA6eNDdx9Qku4uUn2AqvzEQ4v9E0lcSfzg8AQLe2tMj3421xUeUBfp6gXjULVhyLjpvFChdX0UBYpRUczs7l9mRvGHet6D_9v9oWdijkM6t95Kvjr2yFMeiU7NYPzsU3pM3lnihYfn67hrdsJErhJ7ZyteUKBhw')",
              }}
            ></div>
            <div className="absolute bottom-3 left-3">
              <span className="bg-slate-900/90 text-white px-3 py-1.5 rounded text-xs font-bold shadow-lg flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">
                  map
                </span>
                Ver en mapa
              </span>
            </div>
          </a>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© 2025 Automoción Navarro. 20 años de servicio.</p>
          <div className="flex gap-6">
            <a className="hover:text-white transition-colors" href="#">
              Aviso Legal
            </a>
            <a className="hover:text-white transition-colors" href="#">
              Privacidad
            </a>
            <a className="hover:text-white transition-colors" href="#">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
