import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

// Utility function to sanitize filenames
function sanitizeFilename(filename) {
    if (!filename) return "";
    return filename
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9\s\-_.]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

// Utility to convert image to WebP blob
const convertToWebP = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                canvas.toBlob((blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Canvas toBlob failed'));
                    }
                }, 'image/webp', 0.82);
            };
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

export default function Admin() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    // Form state
    const [formData, setFormData] = useState({
        matricula: "",
        marca: "",
        modelo: "",
        version: "",
        precio: "",
        year: "",
        km: "",
        cv: "",
        combustible: "",
        etiqueta: "",
        motor: "",
        descripcion: ""
    });
    const [imageFile, setImageFile] = useState(null);

    // Car management state
    const [cars, setCars] = useState([]);
    const [loadingCars, setLoadingCars] = useState(true);
    const [editingCar, setEditingCar] = useState(null);

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === "navarro2026") {
            setIsAuthenticated(true);
            setMessage({ type: "", text: "" });
        } else {
            setMessage({ type: "error", text: "Contraseña incorrecta" });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const resetForm = () => {
        setFormData({
            matricula: "",
            marca: "",
            modelo: "",
            version: "",
            precio: "",
            year: "",
            km: "",
            cv: "",
            combustible: "",
            etiqueta: "",
            motor: "",
            descripcion: ""
        });
        setImageFile(null);
        // Reset file input
        const fileInput = document.getElementById('imagen');
        if (fileInput) fileInput.value = '';
    };

    const handleEditCar = (car) => {
        setFormData({
            matricula: car.matricula || "",
            marca: car.marca || "",
            modelo: car.modelo || "",
            version: car.version || "",
            precio: car.precio || "",
            year: car.year || "",
            km: car.km || "",
            cv: car.cv || "",
            combustible: car.combustible || "",
            etiqueta: car.etiqueta || "",
            motor: car.motor || "",
            descripcion: car.descripcion || ""
        });
        setEditingCar(car);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setMessage({ type: "", text: "" });
    };

    const handleCancelEdit = () => {
        setEditingCar(null);
        resetForm();
        setMessage({ type: "", text: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: "", text: "" });

        try {
            let finalImageName = editingCar?.imagen || null;

            // 1. Upload images to Supabase Storage if a new one is selected
            if (imageFile) {
                const baseName = sanitizeFilename(`${formData.marca} ${formData.modelo} ${formData.matricula || Date.now()}`);
                const fileExt = imageFile.name.split('.').pop().toLowerCase();
                const originalFullName = `${baseName}.${fileExt}`;
                const webpFullName = `${baseName}.webp`;

                // Upload original file
                const { error: uploadError } = await supabase.storage
                    .from('coches')
                    .upload(originalFullName, imageFile, {
                        cacheControl: '3600',
                        upsert: true
                    });

                if (uploadError) throw new Error(`Error original: ${uploadError.message}`);

                // Generate and upload WebP version
                try {
                    const webpBlob = await convertToWebP(imageFile);
                    await supabase.storage
                        .from('coches')
                        .upload(webpFullName, webpBlob, {
                            cacheControl: '3600',
                            upsert: true
                        });
                } catch (err) {
                    console.warn('WebP conversion/upload failed:', err);
                }

                finalImageName = originalFullName;
            }

            // 3. Prepare car data
            const carData = {
                matricula: formData.matricula || null,
                marca: formData.marca,
                modelo: formData.modelo,
                version: formData.version || null,
                precio: formData.precio ? parseInt(formData.precio) : null,
                year: formData.year ? parseInt(formData.year) : null,
                km: formData.km ? parseInt(formData.km) : null,
                cv: formData.cv ? parseInt(formData.cv) : null,
                combustible: formData.combustible || null,
                etiqueta: formData.etiqueta || null,
                motor: formData.motor || null,
                descripcion: formData.descripcion || null,
                imagen: finalImageName
            };

            if (editingCar) {
                // UPDATE existing car
                const { error: updateError } = await supabase
                    .from('coches')
                    .update(carData)
                    .eq('id', editingCar.id);

                if (updateError) {
                    throw new Error(`Error al actualizar en la base de datos: ${updateError.message}`);
                }

                setMessage({ type: "success", text: "¡Vehículo actualizado correctamente!" });
            } else {
                // INSERT new car
                const { error: insertError } = await supabase
                    .from('coches')
                    .insert([carData]);

                if (insertError) {
                    throw new Error(`Error al guardar en la base de datos: ${insertError.message}`);
                }

                setMessage({ type: "success", text: "¡Coche guardado con éxito!" });
            }

            // Refresh car list
            await fetchCars();

            // Reset form and editing state
            resetForm();
            setEditingCar(null);

        } catch (error) {
            setMessage({ type: "error", text: error.message });
        } finally {
            setLoading(false);
        }
    };

    // Fetch all cars from database
    const fetchCars = async () => {
        setLoadingCars(true);
        const { data, error } = await supabase
            .from('coches')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching cars:', error);
        } else {
            setCars(data || []);
        }
        setLoadingCars(false);
    };

    // Delete car with confirmation and image cleanup
    const handleDeleteCar = async (car) => {
        const confirmed = window.confirm(
            `¿Estás seguro de que quieres borrar este anuncio?\n\n${car.marca} ${car.modelo}${car.year ? ` (${car.year})` : ''}`
        );

        if (!confirmed) return;

        setLoading(true);
        setMessage({ type: "", text: "" });

        try {
            // 1. Delete from database
            const { error: dbError } = await supabase
                .from('coches')
                .delete()
                .eq('id', car.id);

            if (dbError) throw dbError;

            // 2. Delete image from storage (if exists)
            if (car.imagen) {
                try {
                    const fileName = car.imagen.split('/').pop();
                    const decodedFileName = decodeURIComponent(fileName);

                    const { error: storageError } = await supabase
                        .storage
                        .from('coches')
                        .remove([decodedFileName]);

                    if (storageError) {
                        console.warn('Error deleting image from storage:', storageError);
                    }
                } catch (imgError) {
                    console.warn('Error processing image deletion:', imgError);
                }
            }

            // 3. Refresh car list
            await fetchCars();

            setMessage({
                type: 'success',
                text: 'Vehículo eliminado correctamente'
            });
        } catch (error) {
            setMessage({
                type: 'error',
                text: 'Error al eliminar el vehículo: ' + error.message
            });
        } finally {
            setLoading(false);
        }
    };

    // Load cars on component mount
    useEffect(() => {
        if (isAuthenticated) {
            fetchCars();
        }
    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
                <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-8 w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <span className="material-symbols-outlined text-blue-600 text-5xl">lock_person</span>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">Panel de Administración</h1>
                        <p className="text-slate-500">Ingresa la contraseña para continuar</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none"
                                placeholder="Ingresa la contraseña"
                                required
                            />
                        </div>

                        {message.text && (
                            <div className={`p-4 rounded-lg text-sm font-medium ${message.type === 'error' ? 'bg-red-50 border border-red-200 text-red-600' : 'bg-green-50 border border-green-200 text-green-600'}`}>
                                {message.text}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-md active:scale-[0.98]"
                        >
                            Acceder
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-8">
                    <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">Panel de Administración</h1>
                            <p className="text-slate-500">
                                {editingCar
                                    ? `Editando: ${editingCar.marca} ${editingCar.modelo}`
                                    : 'Agregar nuevo vehículo al catálogo'
                                }
                            </p>
                        </div>
                        <button
                            onClick={() => setIsAuthenticated(false)}
                            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-medium rounded-lg transition-all flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-sm">logout</span>
                            Cerrar Sesión
                        </button>
                    </div>

                    {message.text && (
                        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${message.type === 'error' ? 'bg-red-50 border border-red-200 text-red-600' : 'bg-green-50 border border-green-200 text-green-600'}`}>
                            <span className="material-symbols-outlined">
                                {message.type === 'error' ? 'error' : 'check_circle'}
                            </span>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Matrícula */}
                            <div>
                                <label htmlFor="matricula" className="block text-sm font-semibold text-slate-700 mb-2">
                                    Matrícula
                                </label>
                                <input
                                    type="text"
                                    id="matricula"
                                    name="matricula"
                                    value={formData.matricula}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none"
                                    placeholder="Ej: 1234ABC"
                                />
                            </div>

                            {/* Marca */}
                            <div>
                                <label htmlFor="marca" className="block text-sm font-semibold text-slate-700 mb-2">
                                    Marca <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="marca"
                                    name="marca"
                                    value={formData.marca}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none"
                                    placeholder="Ej: Audi"
                                    required
                                />
                            </div>

                            {/* Modelo */}
                            <div>
                                <label htmlFor="modelo" className="block text-sm font-semibold text-slate-700 mb-2">
                                    Modelo <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="modelo"
                                    name="modelo"
                                    value={formData.modelo}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none"
                                    placeholder="Ej: A3"
                                    required
                                />
                            </div>

                            {/* Versión */}
                            <div>
                                <label htmlFor="version" className="block text-sm font-semibold text-slate-700 mb-2">
                                    Versión
                                </label>
                                <input
                                    type="text"
                                    id="version"
                                    name="version"
                                    value={formData.version}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none"
                                    placeholder="Ej: Sportback"
                                />
                            </div>

                            {/* Precio */}
                            <div>
                                <label htmlFor="precio" className="block text-sm font-semibold text-slate-700 mb-2">
                                    Precio (€)
                                </label>
                                <input
                                    type="number"
                                    id="precio"
                                    name="precio"
                                    value={formData.precio}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none"
                                    placeholder="Ej: 15000"
                                />
                            </div>

                            {/* Año */}
                            <div>
                                <label htmlFor="year" className="block text-sm font-semibold text-slate-700 mb-2">
                                    Año
                                </label>
                                <input
                                    type="number"
                                    id="year"
                                    name="year"
                                    value={formData.year}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none"
                                    placeholder="Ej: 2020"
                                    min="1990"
                                    max="2026"
                                />
                            </div>

                            {/* Kilómetros */}
                            <div>
                                <label htmlFor="km" className="block text-sm font-semibold text-slate-700 mb-2">
                                    Kilómetros
                                </label>
                                <input
                                    type="number"
                                    id="km"
                                    name="km"
                                    value={formData.km}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none"
                                    placeholder="Ej: 50000"
                                />
                            </div>

                            {/* CV */}
                            <div>
                                <label htmlFor="cv" className="block text-sm font-semibold text-slate-700 mb-2">
                                    Caballos (CV)
                                </label>
                                <input
                                    type="number"
                                    id="cv"
                                    name="cv"
                                    value={formData.cv}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none"
                                    placeholder="Ej: 150"
                                />
                            </div>

                            {/* Combustible */}
                            <div>
                                <label htmlFor="combustible" className="block text-sm font-semibold text-slate-700 mb-2">
                                    Combustible
                                </label>
                                <select
                                    id="combustible"
                                    name="combustible"
                                    value={formData.combustible}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none"
                                >
                                    <option value="">Seleccionar...</option>
                                    <option value="Gasolina">Gasolina</option>
                                    <option value="Diesel">Diesel</option>
                                    <option value="Híbrido">Híbrido</option>
                                    <option value="Eléctrico">Eléctrico</option>
                                </select>
                            </div>

                            {/* Etiqueta */}
                            <div>
                                <label htmlFor="etiqueta" className="block text-sm font-semibold text-slate-700 mb-2">
                                    Etiqueta Ambiental
                                </label>
                                <select
                                    id="etiqueta"
                                    name="etiqueta"
                                    value={formData.etiqueta}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2.5 bg-white border rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none font-medium ${formData.etiqueta === '0' ? 'border-blue-500' :
                                        formData.etiqueta === 'ECO' ? 'border-green-600' :
                                            formData.etiqueta === 'C' ? 'border-green-500' :
                                                formData.etiqueta === 'B' ? 'border-yellow-500' :
                                                    'border-slate-300'
                                        }`}
                                >
                                    <option value="">Seleccionar etiqueta...</option>
                                    <option value="0" className="text-blue-600 font-bold">0 - Azul</option>
                                    <option value="ECO" className="text-green-700 font-bold">ECO</option>
                                    <option value="C" className="text-green-600 font-bold">C - Verde</option>
                                    <option value="B" className="text-yellow-600 font-bold">B - Amarillo</option>
                                    <option value="Sin etiqueta" className="text-slate-400">Sin etiqueta</option>
                                </select>
                            </div>

                            {/* Motor */}
                            <div>
                                <label htmlFor="motor" className="block text-sm font-semibold text-slate-700 mb-2">
                                    Motor
                                </label>
                                <input
                                    type="text"
                                    id="motor"
                                    name="motor"
                                    value={formData.motor}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none"
                                    placeholder="Ej: 2.0 TDI"
                                />
                            </div>
                        </div>

                        {/* Descripción */}
                        <div>
                            <label htmlFor="descripcion" className="block text-sm font-semibold text-slate-700 mb-2">
                                Descripción
                            </label>
                            <textarea
                                id="descripcion"
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleInputChange}
                                rows="4"
                                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all resize-none outline-none"
                                placeholder="Descripción adicional del vehículo..."
                            ></textarea>
                        </div>

                        {/* Imagen */}
                        <div>
                            <label htmlFor="imagen" className="block text-sm font-semibold text-slate-700 mb-2">
                                Imagen del Vehículo
                            </label>
                            <input
                                type="file"
                                id="imagen"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all cursor-pointer"
                            />
                            {imageFile && (
                                <p className="mt-2 text-sm text-slate-500 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">attach_file</span>
                                    {imageFile.name}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-4 pt-6 border-t border-slate-100">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                                        <span>{editingCar ? 'Actualizando...' : 'Guardando...'}</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined">
                                            {editingCar ? 'edit' : 'save'}
                                        </span>
                                        <span>{editingCar ? 'Actualizar Vehículo' : 'Guardar Vehículo'}</span>
                                    </>
                                )}
                            </button>

                            {editingCar && (
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="px-6 py-3 border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-lg transition-all"
                                >
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>

                    {/* Car Management Section */}
                    <div className="mt-12 border-t border-slate-200 pt-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-blue-600">garage</span>
                            Gestionar anuncios
                        </h2>

                        {loadingCars ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-600 border-t-transparent"></div>
                            </div>
                        ) : cars.length === 0 ? (
                            <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
                                <span className="material-symbols-outlined text-slate-300 text-6xl mb-3">inventory_2</span>
                                <p className="text-slate-500">No hay vehículos registrados</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {cars.map(car => (
                                    <div key={car.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                        {/* Thumbnail Image */}
                                        <div className="aspect-video bg-slate-100 relative overflow-hidden">
                                            {car.imagen ? (
                                                <picture className="w-full h-full">
                                                    <source
                                                        srcSet={`https://abvcgcemjxbfeibmtsxp.supabase.co/storage/v1/object/public/coches/${car.imagen.replace(/\.[^/.]+$/, "")}.webp`}
                                                        type="image/webp"
                                                    />
                                                    <img
                                                        src={`https://abvcgcemjxbfeibmtsxp.supabase.co/storage/v1/object/public/coches/${car.imagen}`}
                                                        alt={`${car.marca} ${car.modelo}`}
                                                        className="w-full h-full object-cover"
                                                        loading="lazy"
                                                        decoding="async"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = '/logo_nuevo_rect_png.png';
                                                        }}
                                                    />
                                                </picture>
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-slate-400">
                                                    <span className="material-symbols-outlined text-5xl">directions_car</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Car Info */}
                                        <div className="p-4">
                                            <h3 className="font-bold text-slate-900 mb-1 truncate">
                                                {car.marca} {car.modelo}
                                            </h3>
                                            {car.version && (
                                                <p className="text-sm text-slate-500 mb-2 truncate">{car.version}</p>
                                            )}
                                            <div className="flex items-center justify-between mb-3">
                                                <p className="text-lg font-bold text-blue-600">
                                                    {car.precio ? `${car.precio.toLocaleString('es-ES')}€` : 'Consultar'}
                                                </p>
                                                {car.year && (
                                                    <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-700 rounded">
                                                        {car.year}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEditCar(car)}
                                                    disabled={loading}
                                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">edit</span>
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCar(car)}
                                                    disabled={loading}
                                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                                    Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
