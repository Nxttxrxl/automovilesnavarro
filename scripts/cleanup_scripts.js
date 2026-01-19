import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Scripts to KEEP (essential for maintenance)
const keepScripts = [
    'emergency_restore.js',  // For database recovery
    'refresh_backup.js',     // For refreshing JSON backup
    'verify_all_photos.js',  // For verification
    'list_cars_without_images.js', // For checking status
    'importar_fotos.js',     // Original import script
    'sincronizar_datos.js'   // Original sync script
]

async function cleanupScripts() {
    console.log("🧹 LIMPIANDO SCRIPTS TEMPORALES\n")

    const allFiles = fs.readdirSync(__dirname).filter(f => f.endsWith('.js'))
    console.log(`Total scripts: ${allFiles.length}`)
    console.log(`Scripts a mantener: ${keepScripts.length}\n`)

    let deleted = 0
    const toDelete = allFiles.filter(f => !keepScripts.includes(f) && f !== 'cleanup_scripts.js')

    console.log(`Scripts a eliminar: ${toDelete.length}\n`)

    for (const file of toDelete) {
        const filePath = path.join(__dirname, file)
        try {
            fs.unlinkSync(filePath)
            console.log(`✅ Eliminado: ${file}`)
            deleted++
        } catch (error) {
            console.log(`❌ Error eliminando ${file}: ${error.message}`)
        }
    }

    console.log(`\n📊 RESUMEN:`)
    console.log(`   Eliminados: ${deleted}`)
    console.log(`   Conservados: ${keepScripts.length}`)

    console.log(`\n✅ Scripts esenciales conservados:`)
    keepScripts.forEach(s => console.log(`   - ${s}`))
}

cleanupScripts()
