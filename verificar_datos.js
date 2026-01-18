import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function verificarDatos() {
    console.log('🔍 Verificando datos en Supabase...\n');

    const { data, error } = await supabase
        .from('coches')
        .select('*')
        .limit(3);

    if (error) {
        console.error('❌ Error:', error);
        return;
    }

    console.log('📊 Primeros 3 registros de la base de datos:\n');
    console.log(JSON.stringify(data, null, 2));

    if (data.length > 0) {
        console.log('\n📋 Columnas disponibles:');
        console.log(Object.keys(data[0]).join(', '));
    }
}

verificarDatos().catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
});
