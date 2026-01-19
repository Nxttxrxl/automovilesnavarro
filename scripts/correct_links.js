import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const envPath = path.resolve(__dirname, '../.env.local')

if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath))
    for (const k in envConfig) {
        process.env[k] = envConfig[k]
    }
}

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)

async function correctLinks() {
    console.log('🚑 Corrigiendo asignaciones de imágenes cruzadas...')

    // 1. Peugeot 207 (ID 1377) -> SIN FOTO
    await supabase.from('coches').update({ imagen: null }).eq('id', 1377)
    console.log('✅ Peugeot 207 (1377): Imagen eliminada (NULL)')

    // 2. Audi A4 (ID 1414) -> AUDI_A4_2019.webp
    await supabase.from('coches').update({ imagen: 'AUDI_A4_2019.webp' }).eq('id', 1414)
    console.log('✅ Audi A4 (1414): Imagen corregida a AUDI_A4_2019.webp')

    // 3. Mercedes Clase E (ID 1410) -> MERCEDESBENZ_CLASE_E_2013.webp
    // (Asignar la foto que se puso por error al Peugeot)
    await supabase.from('coches').update({ imagen: 'MERCEDESBENZ_CLASE_E_2013.webp' }).eq('id', 1410)
    console.log('✅ Mercedes Clase E (1410): Imagen asignada (MERCEDESBENZ_CLASE_E_2013.webp)')

    // 4. Suzuki Grand Vitara (ID 1432) -> SUZUKI_VITARA_2008.webp
    // (Asignar la foto que se puso por error al Audi)
    await supabase.from('coches').update({ imagen: 'SUZUKI_VITARA_2008.webp' }).eq('id', 1432)
    console.log('✅ Suzuki Grand Vitara (1432): Imagen asignada (SUZUKI_VITARA_2008.webp)')

    // Refresh Catalog
    const { data: allCars } = await supabase.from('coches').select('*')
    const visible = allCars.filter(c => c.imagen && c.imagen.length > 5)
    await supabase.from('catalogo_web').delete().neq('id', 0)
    await supabase.from('catalogo_web').insert(visible)
    console.log(`\n📊 Catálogo Web actualizado: ${visible.length} coches visibles.`)
}

correctLinks()
