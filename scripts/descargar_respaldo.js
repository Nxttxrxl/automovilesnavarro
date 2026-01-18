import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be defined in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Update these paths to point to your backup location
const BACKUP_BASE_DIR = path.resolve(__dirname, '../../COPIA_SEGURIDAD_FOTOS');
const PNG_DIR = path.join(BACKUP_BASE_DIR, 'inventory_png');
const WEBP_DIR = path.join(BACKUP_BASE_DIR, 'inventory_webp');

/**
 * Downloads all images from Supabase Storage to the backup folders
 */
async function downloadBackup() {
    console.log('🚀 Starting local backup from Supabase Storage...');
    console.log(`📂 Saving to: ${BACKUP_BASE_DIR}\n`);

    // Ensure directories exist
    if (!fs.existsSync(PNG_DIR)) fs.mkdirSync(PNG_DIR, { recursive: true });
    if (!fs.existsSync(WEBP_DIR)) fs.mkdirSync(WEBP_DIR, { recursive: true });

    try {
        // 1. List all files in the 'coches' bucket
        const { data: files, error } = await supabase.storage
            .from('coches')
            .list('', { limit: 500 });

        if (error) throw error;

        console.log(`📊 Found ${files.length} files in Supabase Storage.\n`);

        let downloaded = 0;
        let skipped = 0;

        for (const file of files) {
            const isWebP = file.name.toLowerCase().endsWith('.webp');
            const targetDir = isWebP ? WEBP_DIR : PNG_DIR;
            const targetPath = path.join(targetDir, file.name);

            // Check if file already exists
            if (fs.existsSync(targetPath)) {
                skipped++;
                process.stdout.write(`⏭️  Skipping existing: ${file.name}\r`);
                continue;
            }

            // Download file
            const { data, error: downloadError } = await supabase.storage
                .from('coches')
                .download(file.name);

            if (downloadError) {
                console.error(`\n❌ Error downloading ${file.name}:`, downloadError.message);
                continue;
            }

            // Save to local filesystem
            const buffer = Buffer.from(await data.arrayBuffer());
            fs.writeFileSync(targetPath, buffer);

            downloaded++;
            console.log(`✅ Downloaded: ${file.name}`);
        }

        console.log('\n\n═══════════════════════════════════════');
        console.log('           BACKUP SUMMARY');
        console.log('═══════════════════════════════════════');
        console.log(`✅ New files downloaded: ${downloaded}`);
        console.log(`⏭️  Files already backed up: ${skipped}`);
        console.log('═══════════════════════════════════════\n');

    } catch (error) {
        console.error('❌ Critical Error:', error.message);
    }
}

downloadBackup();
