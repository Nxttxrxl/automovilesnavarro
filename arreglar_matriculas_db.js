import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const csvFilePath = path.join(__dirname, 'inventario_final.csv');

function extractMatriculaReal(text) {
    const matriculaMatch = text.match(/\b\d{4}[A-Z]{3}\b/i);
    if (matriculaMatch) {
        return matriculaMatch[0].toUpperCase();
    }
    return text; // Si no hay matrícula, usar el texto completo
}

async function arreglarMatriculas() {
    console.log('🔧 Arreglando matrículas en Supabase...\n');

    // Obtener todos los registros
    const { data: coches, error } = await supabase
        .from('coches')
        .select('id, matricula');

    if (error) {
        console.error('❌ Error:', error);
        return;
    }

    console.log(`📋 Encontrados ${coches.length} registros en Supabase\n`);

    let actualizados = 0;
    let errores = 0;

    for (const coche of coches) {
        const matriculaOriginal = coche.matricula;
        const matriculaLimpia = extractMatriculaReal(matriculaOriginal);

        if (matriculaOriginal !== matriculaLimpia) {
            console.log(`🔄 "${matriculaOriginal}" → "${matriculaLimpia}"`);

            const { error: updateError } = await supabase
                .from('coches')
                .update({ matricula: matriculaLimpia })
                .eq('id', coche.id);

            if (updateError) {
                console.error(`   ❌ Error actualizando:`, updateError.message);
                errores++;
            } else {
                console.log(`   ✅ Actualizado`);
                actualizados++;
            }
        } else {
            console.log(`✓ "${matriculaOriginal}" - Ya está correcta`);
        }
    }

    console.log('\n═══════════════════════════════════════');
    console.log('RESUMEN');
    console.log('═══════════════════════════════════════');
    console.log(`✅ Actualizados: ${actualizados}`);
    console.log(`❌ Errores: ${errores}`);
    console.log(`📝 Sin cambios: ${coches.length - actualizados - errores}`);
    console.log('═══════════════════════════════════════\n');
}

arreglarMatriculas().catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
});
