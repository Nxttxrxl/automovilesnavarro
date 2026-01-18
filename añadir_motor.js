import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csv from 'csv-parser';
import { createObjectCsvWriter } from 'csv-writer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvFilePath = path.join(__dirname, 'inventario_final.csv');

async function añadirColumnaMotor() {
    console.log('🔧 Añadiendo columna MOTOR al CSV...\n');

    const records = [];

    // Leer CSV
    await new Promise((resolve, reject) => {
        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on('data', (data) => records.push(data))
            .on('end', resolve)
            .on('error', reject);
    });

    console.log(`📋 Procesando ${records.length} registros\n`);

    // Añadir campo MOTOR vacío a cada registro
    const processedRecords = records.map((record) => {
        return {
            MATRICULA: record.MATRICULA || '',
            MARCA: record.MARCA || '',
            MODELO: record.MODELO || '',
            AÑO: record.AÑO || '',
            PRECIO: record.PRECIO || '',
            KM: record.KM || '',
            MOTOR: '', // Nueva columna
            CV: record.CV || '',
            COMBUSTIBLE: record.COMBUSTIBLE || '',
            ETIQUETA: record.ETIQUETA || ''
        };
    });

    // Escribir CSV actualizado
    const csvWriter = createObjectCsvWriter({
        path: csvFilePath,
        header: [
            { id: 'MATRICULA', title: 'MATRICULA' },
            { id: 'MARCA', title: 'MARCA' },
            { id: 'MODELO', title: 'MODELO' },
            { id: 'AÑO', title: 'AÑO' },
            { id: 'PRECIO', title: 'PRECIO' },
            { id: 'KM', title: 'KM' },
            { id: 'MOTOR', title: 'MOTOR' },
            { id: 'CV', title: 'CV' },
            { id: 'COMBUSTIBLE', title: 'COMBUSTIBLE' },
            { id: 'ETIQUETA', title: 'ETIQUETA' }
        ]
    });

    await csvWriter.writeRecords(processedRecords);

    console.log('═══════════════════════════════════════');
    console.log('✅ Columna MOTOR añadida correctamente');
    console.log('═══════════════════════════════════════\n');
    console.log('Recarga el archivo CSV en tu editor para ver los cambios.');
}

añadirColumnaMotor().catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
});
