import StockGrid from "../components/StockGrid";

export default function Catalogo() {
    return (
        <div className="pt-20 min-h-screen bg-slate-50">
            <div className="bg-white py-12 border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                        Nuestro Stock
                    </h1>
                    <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                        Vehículos seleccionados, revisados y con garantía Automoción Navarro.
                    </p>
                </div>
            </div>
            <StockGrid />
        </div>
    );
}
