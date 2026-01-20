import { supabase } from '../lib/supabaseClient'

/**
 * Fetch cars for public view
 * - Filters: imagen NOT NULL and NOT empty
 * - Ordering: estado priority (Activo > Reservado > Vendido)
 */
export async function fetchPublicCars() {
    const { data, error } = await supabase
        .from('coches')
        .select('*')
        .not('imagen', 'is', null)
        .neq('imagen', '')
        .order('id', { ascending: true })

    if (error) {
        console.error('Error fetching public cars:', error)
        throw error
    }

    // If estado column exists, sort by it
    if (data && data.length > 0 && data[0].hasOwnProperty('estado')) {
        const estadoPriority = { 'Activo': 1, 'Reservado': 2, 'Vendido': 3 }
        return data.sort((a, b) => {
            const priorityA = estadoPriority[a.estado] || 999
            const priorityB = estadoPriority[b.estado] || 999
            return priorityA - priorityB
        })
    }

    return data
}

/**
 * Fetch all cars for admin view
 * - No filters applied
 * - Returns all 75+ records
 */
export async function fetchAdminCars() {
    const { data, error } = await supabase
        .from('coches')
        .select('*')
        .order('id', { ascending: true })

    if (error) {
        console.error('Error fetching admin cars:', error)
        throw error
    }

    return data
}
