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

const OLD_NAME = 'MERCEDESBENZ_CLASE_M_2010'
const NEW_NAME = 'MERCEDESBENZ_CLASE_M_2010_V2'

const WEBP_DIR = 'c:/Users/Natt/Desktop/web navarro automocion/COPIA_SEGURIDAD_FOTOS/inventory_webp'
const PNG_DIR = 'c:/Users/Natt/Desktop/web navarro automocion/COPIA_SEGURIDAD_FOTOS/inventory_png'

async function renameAndUpload() {
    console.log('🚀 Renombrando archivos a V2 para evitar caché...')

    const oldWebpPath = path.join(WEBP_DIR, `${OLD_NAME}.webp`)
    const newWebpPath = path.join(WEBP_DIR, `${NEW_NAME}.webp`)

    const oldPngPath = path.join(PNG_DIR, `${OLD_NAME}.png`)
    const newPngPath = path.join(PNG_DIR, `${NEW_NAME}.png`)

    // 1. Rename Local Files
    if (fs.existsSync(oldWebpPath)) {
        fs.renameSync(oldWebpPath, newWebpPath)
        console.log(`✅ Renombrado local WebP a ${NEW_NAME}.webp`)
    } else if (!fs.existsSync(newWebpPath)) {
        console.error('❌ No encuentro el archivo WebP original local')
        return
    }

    if (fs.existsSync(oldPngPath)) {
        fs.renameSync(oldPngPath, newPngPath)
        console.log(`✅ Renombrado local PNG a ${NEW_NAME}.png`)
    } else if (!fs.existsSync(newPngPath)) {
        console.error('❌ No encuentro el archivo PNG original local')
        return
    }

    // 2. Upload NEW files
    console.log('\n📤 Subiendo archivos V2...')

    // WebP
    if (fs.existsSync(newWebpPath)) {
        const webpBuffer = fs.readFileSync(newWebpPath)
        const { error } = await supabase.storage.from('coches').upload(`${NEW_NAME}.webp`, webpBuffer, { contentType: 'image/webp' })
        if (error) console.error('❌ Error subiendo WebP:', error.message)
        else console.log('✅ WebP V2 subido')
    }

    // PNG
    if (fs.existsSync(newPngPath)) {
        const pngBuffer = fs.readFileSync(newPngPath)
        const { error } = await supabase.storage.from('coches').upload(`${NEW_NAME}.png`, pngBuffer, { contentType: 'image/png' })
        if (error) console.error('❌ Error subiendo PNG:', error.message)
        else console.log('✅ PNG V2 subido')
    }

    // 3. Update Database
    console.log('\n🔗 Actualizando base de datos...')
    const { error: dbError } = await supabase
        .from('coches')
        .update({ imagen: `${NEW_NAME}.webp` })
        .eq('id', 1411) // ID for Mercedes Clase M 2010

    if (dbError) console.error('❌ Error DB:', dbError.message)
    else console.log('✅ Base de datos actualizada a la nueva imagen')

    // 4. Clean up OLD files from storage
    console.log('\n🗑️ Limpiando archivos viejos (cacheados) del Storage...')
    await supabase.storage.from('coches').remove([`${OLD_NAME}.webp`, `${OLD_NAME}.png`])
    console.log('✅ Limpieza completada')
}

renameAndUpload()
