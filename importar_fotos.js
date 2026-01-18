import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createObjectCsvWriter } from 'csv-writer';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY deben estar definidos en .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Directory containing the images
const inventoryDir = path.join(__dirname, 'public', 'inventory');

// Function to extract license plate from filename
function extractMatricula(filename) {
    // Remove file extension
    const nameWithoutExt = path.parse(filename).name;

    // Try to match common Spanish license plate patterns
    // Examples: 1234ABC, 1234-ABC, ABC1234, etc.
    const match = nameWithoutExt.match(/([0-9]{4}[A-Z]{3}|[A-Z]{1,2}[0-9]{4}[A-Z]{2}|[0-9]{4}-?[A-Z]{3})/i);

    if (match) {
        return match[1].toUpperCase().replace('-', '');
    }

    // If no pattern matches, use the whole filename without extension
    return nameWithoutExt.toUpperCase();
}

// Main function
async function importarFotos() {
    console.log('🚗 Iniciando importación de fotos...\n');

    // Check if inventory directory exists
    if (!fs.existsSync(inventoryDir)) {
        console.error(`❌ Error: El directorio ${inventoryDir} no existe.`);
        console.log('💡 Crea la carpeta public/inventory y añade las fotos.');
        process.exit(1);
    }

    // Read all files in the directory
    const files = fs.readdirSync(inventoryDir).filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
    });

    if (files.length === 0) {
        console.error('❌ No se encontraron imágenes en public/inventory');
        process.exit(1);
    }

    console.log(`📁 Encontradas ${files.length} imágenes\n`);

    const results = [];
    let uploadedCount = 0;
    let errorCount = 0;

    for (const file of files) {
        // Use filename without extension as matricula (this will preserve the full name)
        const matricula = path.parse(file).name;
        const filePath = path.join(inventoryDir, file);
        const fileBuffer = fs.readFileSync(filePath);

        console.log(`  📸 Procesando: ${file}`);
        console.log(`     Guardando como: ${matricula}`);

        try {
            // Upload image to Supabase Storage
            const storagePath = `${matricula}${path.extname(file)}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('coches')
                .upload(storagePath, fileBuffer, {
                    contentType: `image/${path.extname(file).substring(1)}`,
                    upsert: true // Overwrite if exists
                });

            if (uploadError) {
                throw uploadError;
            }

            // Get public URL
            const { data: urlData } = supabase.storage
                .from('coches')
                .getPublicUrl(storagePath);

            const imageUrl = urlData.publicUrl;

            // Insert record into database
            const { data: insertData, error: insertError } = await supabase
                .from('coches')
                .upsert([
                    {
                        matricula: matricula,
                        imagen: imageUrl,
                        // Leave other fields null - they will be filled manually via CSV
                        marca: null,
                        modelo: null,
                        year: null,
                        precio: null,
                        km: null,
                        cv: null,
                        combustible: null,
                        etiqueta: null,
                        descripcion: null
                    }
                ], {
                    onConflict: 'matricula' // Update if matricula already exists
                });

            if (insertError) {
                throw insertError;
            }

            console.log(`     ✅ Subido exitosamente`);
            uploadedCount++;

            // Add to results for CSV
            results.push({
                MATRICULA: matricula,
                MARCA: '',
                MODELO: '',
                AÑO: '',
                PRECIO: '',
                KM: '',
                CV: '',
                COMBUSTIBLE: '',
                ETIQUETA: ''
            });

        } catch (error) {
            console.error(`     ❌ Error: ${error.message}`);
            errorCount++;
        }

        console.log('');
    }

    // Generate CSV file
    if (results.length > 0) {
        const csvWriter = createObjectCsvWriter({
            path: path.join(__dirname, 'inventario_final.csv'),
            header: [
                { id: 'MATRICULA', title: 'MATRICULA' },
                { id: 'MARCA', title: 'MARCA' },
                { id: 'MODELO', title: 'MODELO' },
                { id: 'AÑO', title: 'AÑO' },
                { id: 'PRECIO', title: 'PRECIO' },
                { id: 'KM', title: 'KM' },
                { id: 'CV', title: 'CV' },
                { id: 'COMBUSTIBLE', title: 'COMBUSTIBLE' },
                { id: 'ETIQUETA', title: 'ETIQUETA' }
            ]
        });

        await csvWriter.writeRecords(results);
        console.log('📄 Archivo inventario_final.csv generado correctamente\n');
    }

    // Summary
    console.log('═══════════════════════════════════════');
    console.log('           RESUMEN');
    console.log('═══════════════════════════════════════');
    console.log(`✅ Fotos subidas: ${uploadedCount}`);
    console.log(`❌ Errores: ${errorCount}`);
    console.log(`📝 Total procesado: ${files.length}`);
    console.log('═══════════════════════════════════════\n');

    console.log('📋 SIGUIENTE PASO:');
    console.log('   1. Abre inventario_final.csv');
    console.log('   2. Rellena los datos de cada coche (MARCA, MODELO, etc.)');
    console.log('   3. Ejecuta: node sincronizar_datos.js');
    console.log('');
}

// Run the script
importarFotos().catch(error => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
});
