import StockGrid from '../components/StockGrid';

export default function Catalogo() {
  return (
    <div className="pt-20 min-h-screen bg-slate-50">
      <div className="bg-white py-12 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-black font-satoshi text-slate-900 tracking-tight">
            Oportunidades para cada etapa
          </h1>
          <p className="mt-4 text-base sm:text-lg font-satoshi font-medium text-slate-600 max-w-2xl mx-auto">
            Desde utilitarios económicos hasta deportivos o SUVs totalmente
            equipados. Sea cual sea tu inversión, cada unidad se entrega
            revisada y puesta a punto con el mismo nivel de exigencia.
          </p>
        </div>
      </div>
      <StockGrid />
    </div>
  );
}
