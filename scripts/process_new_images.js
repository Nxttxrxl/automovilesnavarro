import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { exec } from 'child_process'
import util from 'util'

const execPromise = util.promisify(exec)
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

const WEBP_DIR = 'c:/Users/Natt/Desktop/web navarro automocion/COPIA_SEGURIDAD_FOTOS/inventory_webp'
const PNG_DIR = 'c:/Users/Natt/Desktop/web navarro automocion/COPIA_SEGURIDAD_FOTOS/inventory_png'

async function processNewImages() {
    console.log("🚀 Procesando nuevas imágenes...\n")

    // 1. Identify new files (PNGs without corresponding WebP)
    const pngFiles = fs.readdirSync(PNG_DIR).filter(f => f.endsWith('.png'))
    const webpFiles = new Set(fs.readdirSync(WEBP_DIR).filter(f => f.endsWith('.webp')).map(f => path.parse(f).name))

    const newFiles = pngFiles.filter(f => !webpFiles.has(path.parse(f).name))

    console.log(`📂 Detectados ${newFiles.length} archivos nuevos para procesar`)

    if (newFiles.length === 0) {
        console.log("✅ No hay archivos nuevos por procesar.")
        return
    }

    // 2. Convert to WebP
    console.log("\n🔄 Convirtiendo a WebP...")
    for (const file of newFiles) {
        const name = path.parse(file).name
        const input = path.join(PNG_DIR, file)
        const output = path.join(WEBP_DIR, `${name}.webp`)

        console.log(`   - Convirtiendo: ${file}`)
        try {
            await execPromise(`npx sharp-cli -i "${input}" -o "${output}" -f webp -q 80`)
        } catch (e) {
            console.error(`❌ Error convirtiendo ${file}:`, e.message)
        }
    }

    // 3. Upload to Storage
    console.log("\n📤 Subiendo a Supabase Storage...")
    let uploaded = 0
    for (const file of newFiles) {
        const name = path.parse(file).name

        // Upload WebP
        const webpPath = path.join(WEBP_DIR, `${name}.webp`)
        if (fs.existsSync(webpPath)) {
            const buffer = fs.readFileSync(webpPath)
            const { error } = await supabase.storage.from('coches').upload(`${name}.webp`, buffer, { contentType: 'image/webp', upsert: true })
            if (error) console.error(`❌ Error subiendo ${name}.webp:`, error.message)
        }

        // Upload PNG
        const pngPath = path.join(PNG_DIR, file)
        const buffer = fs.readFileSync(pngPath)
        const { error } = await supabase.storage.from('coches').upload(file, buffer, { contentType: 'image/png', upsert: true })

        if (!error) uploaded++
        else console.error(`❌ Error subiendo ${file}:`, error.message)
    }

    // 4. Link to Database
    console.log("\n🔗 Vinculando a Base de Datos...")
    const { data: dbCars } = await supabase.from('coches').select('*')

    let linked = 0
    for (const file of newFiles) {
        const name = path.parse(file).name // e.g., AUDI_A3_2006_7500
        const fileNameWebp = `${name}.webp`

        // Search logic
        let match = null

        // SPECIAL CASE: Audi A3 matched by price
        if (name.includes('7500')) {
            // Look for Audi A3 priced 7500
            match = dbCars.find(c =>
                (c.marca === 'Audi' || c.marca === 'AUDI') &&
                c.modelo.includes('A3') &&
                Math.abs(c.precio - 7500) < 100 // Tolerance just in case
            )
            if (match) console.log(`   ⭐ MATCH ESPECIAL (Precio): ${name} -> ID ${match.id} (Precio: ${match.precio})`)
        } else {
            // Fuzzy match for others
            const normalizedName = name.toLowerCase().replace(/_/g, ' ')
            match = dbCars.find(c => {
                // Skip cars that already have an image assigned (optional, but safer)
                if (c.imagen && c.imagen.includes('.webp')) return false

                if (!c.marca || !c.modelo) return false
                const marcaMatch = normalizedName.includes(c.marca.toLowerCase())
                const modeloMatch = normalizedName.includes(c.modelo.toLowerCase())
                const yearMatch = normalizedName.includes(c.year?.toString())
                return (marcaMatch && modeloMatch && yearMatch)
            })
        }

        if (match) {
            await supabase.from('coches').update({ imagen: fileNameWebp }).eq('id', match.id)
            console.log(`   ✅ Vinculado: ${name} -> ${match.marca} ${match.modelo} (${match.year})`)
            linked++
        } else {
            console.log(`   ⚠️ No se encontró match para: ${name}`)
        }
    }

    // 5. Update Catalog
    const { data: allCars } = await supabase.from('coches').select('*')
    const visible = allCars.filter(c => c.imagen && c.imagen.length > 5)
    await supabase.from('catalogo_web').delete().neq('id', 0)
    await supabase.from('catalogo_web').insert(visible)

    console.log(`\n📊 RESUMEN:`)
    console.log(`   - Imágenes procesadas: ${newFiles.length}`)
    console.log(`   - Subidas: ${uploaded}`)
    console.log(`   - Vinculadas: ${linked}`)
    console.log(`   - Total coches visibles en web: ${visible.length}`)
}

processNewImages()
