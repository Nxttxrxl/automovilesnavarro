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

async function addEstadoColumn() {
    console.log('🔧 Añadiendo columna "estado" a la tabla coches...')

    // Note: Supabase JS client doesn't support ALTER TABLE directly
    // We need to use the SQL editor in Supabase Dashboard or use a migration

    // For now, let's verify if the column exists and update all records
    try {
        // Try to fetch with estado column
        const { data: testData, error: testError } = await supabase
            .from('coches')
            .select('id, estado')
            .limit(1)

        if (testError) {
            console.error('❌ Error: La columna "estado" no existe aún.')
            console.log('\n📋 INSTRUCCIONES:')
            console.log('1. Ve a tu panel de Supabase: https://supabase.com/dashboard')
            console.log('2. Selecciona tu proyecto')
            console.log('3. Ve a "SQL Editor"')
            console.log('4. Ejecuta este comando SQL:\n')
            console.log('ALTER TABLE coches ADD COLUMN estado TEXT DEFAULT \'Activo\';')
            console.log('\n5. Luego ejecuta este script de nuevo.')
            return
        }

        // Column exists, update all NULL values to 'Activo'
        const { data: allCars } = await supabase
            .from('coches')
            .select('id, estado')

        const carsToUpdate = allCars.filter(c => !c.estado || c.estado.trim() === '')

        console.log(`📊 Encontrados ${carsToUpdate.length} coches sin estado definido`)

        if (carsToUpdate.length > 0) {
            // Update in batches
            for (const car of carsToUpdate) {
                await supabase
                    .from('coches')
                    .update({ estado: 'Activo' })
                    .eq('id', car.id)
            }
            console.log(`✅ ${carsToUpdate.length} coches actualizados a estado "Activo"`)
        } else {
            console.log('✅ Todos los coches ya tienen estado definido')
        }

        // Show summary
        const { data: summary } = await supabase
            .from('coches')
            .select('estado')

        const counts = summary.reduce((acc, car) => {
            acc[car.estado || 'Sin definir'] = (acc[car.estado || 'Sin definir'] || 0) + 1
            return acc
        }, {})

        console.log('\n📊 Resumen de estados:')
        Object.entries(counts).forEach(([estado, count]) => {
            console.log(`   ${estado}: ${count} coches`)
        })

    } catch (error) {
        console.error('❌ Error:', error.message)
    }
}

addEstadoColumn()
