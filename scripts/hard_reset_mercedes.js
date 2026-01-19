import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
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

const WEBP_PATH = 'c:/Users/Natt/Desktop/web navarro automocion/COPIA_SEGURIDAD_FOTOS/inventory_webp/MERCEDESBENZ_CLASE_M_2010.webp'
const PNG_PATH = 'c:/Users/Natt/Desktop/web navarro automocion/COPIA_SEGURIDAD_FOTOS/inventory_png/MERCEDESBENZ_CLASE_M_2010.png'

async function hardReset() {
    console.log('🔄 REALIZANDO RESET DURO DE IMÁGENES MERCEDES CLASE M 2010')

    // 1. Verify Local Files
    if (fs.existsSync(PNG_PATH)) {
        const stats = fs.statSync(PNG_PATH)
        console.log(`📁 Archivo Local PNG encontrado: ${(stats.size / 1024 / 1024).toFixed(2)} MB`)
    } else {
        console.error('❌ Error: No encuentro el PNG local')
        return
    }

    if (fs.existsSync(WEBP_PATH)) {
        const stats = fs.statSync(WEBP_PATH)
        console.log(`📁 Archivo Local WebP encontrado: ${(stats.size / 1024 / 1024).toFixed(2)} MB`)
    } else {
        console.error('❌ Error: No encuentro el WebP local')
        return
    }

    // 2. DELETE from Storage
    console.log('🗑️ Eliminando versiones antiguas del Storage...')
    const { error: delError } = await supabase.storage
        .from('coches')
        .remove(['MERCEDESBENZ_CLASE_M_2010.webp', 'MERCEDESBENZ_CLASE_M_2010.png'])

    if (delError) console.error('⚠️ Error al borrar (quizás no existían):', delError.message)
    else console.log('✅ Archivos eliminados del Storage')

    // Wait a moment for consistency
    await new Promise(r => setTimeout(r, 1000))

    // 3. UPLOAD New Files
    console.log('📤 Subiendo versiones nuevas...')

    const webpBuffer = fs.readFileSync(WEBP_PATH)
    const { error: webpError } = await supabase.storage
        .from('coches')
        .upload('MERCEDESBENZ_CLASE_M_2010.webp', webpBuffer, {
            contentType: 'image/webp',
            upsert: false // We deleted them, so insert new
        })

    if (webpError) console.error('❌ Error subiendo WebP:', webpError.message)
    else console.log('✅ WebP subido')

    const pngBuffer = fs.readFileSync(PNG_PATH)
    const { error: pngError } = await supabase.storage
        .from('coches')
        .upload('MERCEDESBENZ_CLASE_M_2010.png', pngBuffer, {
            contentType: 'image/png',
            upsert: false
        })

    if (pngError) console.error('❌ Error subiendo PNG:', pngError.message)
    else console.log('✅ PNG subido')

    // 4. Force Public URL check (cache buster info)
    const { data: { publicUrl } } = supabase.storage.from('coches').getPublicUrl('MERCEDESBENZ_CLASE_M_2010.webp')
    console.log(`\n🌍 URL Pública: ${publicUrl}`)
    console.log(`⚠️ NOTA: Si sigues viendo la imagen vieja en el navegador, es CACHÉ local o del CDN. Intenta abrir la URL en Incógnito.`)
}

hardReset()
