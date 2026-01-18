import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csv from 'csv-parser';
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

// Path to the CSV file
const csvFilePath = path.join(__dirname, 'inventario_final.csv');

// Function to parse CSV and return records
function readCSV() {
    return new Promise((resolve, reject) => {
        const results = [];

        if (!fs.existsSync(csvFilePath)) {
            reject(new Error(`El archivo inventario_final.csv no existe en ${csvFilePath}`));
            return;
        }

        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error));
    });
}

// Main function
async function sincronizarDatos() {
    console.log('🔄 Iniciando sincronización de datos...\n');

    try {
        // Read CSV file
        const records = await readCSV();

        if (records.length === 0) {
            console.error('❌ El archivo CSV está vacío');
            process.exit(1);
        }

        console.log(`📋 Encontrados ${records.length} registros en el CSV\n`);

        let updatedCount = 0;
        let errorCount = 0;
        let skippedCount = 0;

        // Process each record
        for (const record of records) {
            const matricula = record.MATRICULA?.trim();

            if (!matricula) {
                console.log('⚠️  Registro sin matrícula, saltando...');
                skippedCount++;
                continue;
            }

            console.log(`  🚗 Procesando: ${matricula}`);

            // Prepare update data (only include non-empty fields)
            const updateData = {
                matricula: matricula
            };

            // Add fields only if they have values
            if (record.MARCA?.trim()) updateData.marca = record.MARCA.trim();
            if (record.MODELO?.trim()) updateData.modelo = record.MODELO.trim();
            if (record.YEAR?.trim()) {
                const year = parseInt(record.YEAR.trim());
                if (!isNaN(year)) updateData.year = year;
            }
            if (record.PRECIO?.trim()) {
                const precio = parseFloat(record.PRECIO.trim().replace(/[€,]/g, ''));
                if (!isNaN(precio)) updateData.precio = precio;
            }
            if (record.KM?.trim()) {
                const km = parseInt(record.KM.trim().replace(/[,.]/g, ''));
                if (!isNaN(km)) updateData.km = km;
            }
            if (record.MOTOR?.trim()) updateData.motor = record.MOTOR.trim();
            if (record.CV?.trim()) {
                const cv = parseInt(record.CV.trim());
                if (!isNaN(cv)) updateData.cv = cv;
            }
            if (record.COMBUSTIBLE?.trim()) updateData.combustible = record.COMBUSTIBLE.trim();
            if (record.ETIQUETA?.trim()) updateData.etiqueta = record.ETIQUETA.trim();

            try {
                // Update the record in Supabase
                const { data, error } = await supabase
                    .from('coches')
                    .update(updateData)
                    .eq('matricula', matricula);

                if (error) {
                    throw error;
                }

                console.log(`     ✅ Actualizado correctamente`);
                updatedCount++;

            } catch (error) {
                console.error(`     ❌ Error: ${error.message}`);
                errorCount++;
            }

            console.log('');
        }

        // Summary
        console.log('═══════════════════════════════════════');
        console.log('           RESUMEN');
        console.log('═══════════════════════════════════════');
        console.log(`✅ Registros actualizados: ${updatedCount}`);
        console.log(`⚠️  Registros saltados: ${skippedCount}`);
        console.log(`❌ Errores: ${errorCount}`);
        console.log(`📝 Total procesado: ${records.length}`);
        console.log('═══════════════════════════════════════\n');

        console.log('✨ Sincronización completada');
        console.log('💡 Verifica los datos en tu panel de Supabase');
        console.log('');

    } catch (error) {
        console.error('❌ Error al leer el CSV:', error.message);
        console.log('\n💡 Asegúrate de que:');
        console.log('   1. El archivo inventario_final.csv existe');
        console.log('   2. Has rellenado los datos en el CSV');
        console.log('   3. El formato del CSV es correcto');
        process.exit(1);
    }
}

// Run the script
sincronizarDatos().catch(error => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
});
