import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const testimonials = [
  {
    text: 'Nuestra experiencia ha sido salvadora. Veníamos de un intento flagrante de engaño por parte de un gran compraventa y aquí encontramos total transparencia.',
    author: 'Hector T.',
    isVerified: true,
  },
  {
    text: 'Gerente muy serio y responsable. No hay trampa ni cartón, muy honesto y muy buen producto y servicio. Me he ido encantada. Repetiremos.',
    author: 'Maria B.',
    isVerified: true,
    vehicle: 'Ford Transit',
  },
  {
    text: 'Compré un Audi A4 hace un mes y va fino como la seda. El trato fue muy cercano y transparente.',
    author: 'Marc S.',
    vehicle: 'Audi A4',
  },
  {
    text: 'Increíble relación calidad precio. A veces comprar coches de ocasión da desconfianza, pero desde el primer momento han respondido genial. ¡A felicitarlos!',
    author: 'Carlos O.',
    isVerified: true,
  },
  {
    text: 'Muy contento con la furgoneta para el trabajo. Fueron honestos con los detalles del vehículo y el precio fue justo.',
    author: 'Omar H.',
  },
  {
    text: 'La verdad es que al principio me costó comunicarme, pero después el trato no ha podido ser más transparente y honesto. No me veo comprando en otro lugar.',
    author: 'Manuel Sosa P.',
    isVerified: true,
  },
  {
    text: 'Increíble e inmejorable trato, repetiré sin duda.',
    author: 'Enrique R.',
    isVerified: true,
    vehicle: 'Ford Focus',
  },
  {
    text: 'Buscaba un coche pequeño para mi hija y me aconsejaron genial. El C3 está impecable. Gestión del cambio de nombre rapidísima.',
    author: 'Elena G.',
    vehicle: 'Citroen C3',
  },
  {
    text: 'Llevo años comprando coches de segunda mano y pocas veces ves esta transparencia. Te dicen lo bueno y lo malo del coche.',
    author: 'Jordi P.',
  },
  {
    text: 'Me urgía el coche y en 24h ya lo tenía. Eficiencia total y el coche estaba limpísimo.',
    author: 'Laura B.',
  },
  {
    text: 'Todo perfecto. GRACIAS Karim.',
    author: 'Jaime P.',
    isVerified: true,
    vehicle: 'Volkswagen Tiguan',
  },
  {
    text: 'Trato de 10. Tuve una pequeña duda post-venta relacionada con el cambio de nombre y me atendieron al momento. Muy recomendables.',
    author: 'David M.',
  },
  {
    text: 'Perfecto. 100% recomendable.',
    author: 'Ramon S.',
    isVerified: true,
    vehicle: 'Alfa Romeo Giulietta',
  },
  {
    text: 'Gran variedad de vehículos. Me ayudaron a elegir el que mejor se adaptaba a mi presupuesto y necesidades.',
    author: 'Carlos R.',
    vehicle: 'Peugeot Partner',
  },
  {
    text: 'El proceso de compra fue muy sencillo y rápido. El coche está en perfectas condiciones, tal cual las fotos.',
    author: 'Marta L.',
  },
  {
    text: 'Excelente servicio posventa. Me resolvieron todas las dudas mecánicas antes y después de la compra.',
    author: 'Sergio T.',
    vehicle: 'BMW Serie 1',
  },
  {
    text: 'Totalmente recomendables. Buscaba seguridad y confianza para mi primer coche y aquí la encontré.',
    author: 'Paula V.',
  },
  {
    text: 'Calidad y precio inmejorables en la zona. El trato personal marca la diferencia.',
    author: 'Ricardo J.',
    vehicle: 'Mercedes-Benz Clase E',
  },
];

function StarRating() {
  return (
    <div className="flex gap-1 mb-4 text-yellow-400">
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className="material-symbols-outlined filled-star text-[20px]"
        >
          star
        </span>
      ))}
    </div>
  );
}

const MeshGradient = ({ color, position, delay }) => (
  <div
    className={`absolute w-[500px] h-[500px] rounded-full blur-[100px] opacity-40 -z-10 ${color} ${position}`}
  />
);

export default function Testimonials() {
  return (
    <section
      className="py-24 bg-slate-100 relative overflow-hidden"
      id="testimonios"
    >
      {/* Atmospheric Background */}
      <MeshGradient color="bg-blue-300" position="-left-40 top-0" />
      <MeshGradient color="bg-indigo-300" position="-right-40 bottom-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black font-satoshi text-[#1F2937] mb-4 tracking-tight">
            Lo que dicen quienes ya nos conocen
          </h2>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={32}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          loop={true}
          breakpoints={{
            640: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 3,
            },
          }}
          className="testimonials-swiper !pb-24"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index} className="flex h-auto">
              <div className="bg-white/60 backdrop-blur-xl p-8 rounded-2xl border border-white/20 shadow-2xl w-full flex flex-col justify-between min-h-[280px] sm:min-h-[300px]">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <StarRating />
                    {testimonial.isVerified && (
                      <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md bg-blue-50 text-blue-600 border border-blue-100">
                        <span className="material-symbols-outlined text-[14px]">
                          verified
                        </span>
                        Verificado
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 mb-6 italic font-satoshi font-medium leading-relaxed">
                    "{testimonial.text}"
                  </p>
                </div>
                <div className="flex items-center justify-between font-satoshi mt-auto border-t border-slate-200/50 pt-4">
                  <span className="font-bold text-slate-900 tracking-tight">
                    — {testimonial.author}
                  </span>
                  {testimonial.vehicle && (
                    <span className="text-[11px] font-medium text-slate-400">
                      {testimonial.vehicle}
                    </span>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
