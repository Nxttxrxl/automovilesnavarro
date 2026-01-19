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

async function refreshBackup() {
    console.log("🔄 REFRESCANDO BACKUP DE INVENTARIO...")

    const { data: cars, error } = await supabase
        .from('coches')
        .select('*')
        .order('id', { ascending: true })

    if (error) {
        console.error("❌ Error descargando datos:", error.message)
        return
    }

    const backupPath = path.resolve(__dirname, 'current_inventory.json')
    fs.writeFileSync(backupPath, JSON.stringify(cars, null, 2), 'utf8')

    console.log(`✅ Backup actualizado correctamente: ${cars.length} coches guardados en current_inventory.json`)
}

refreshBackup()
