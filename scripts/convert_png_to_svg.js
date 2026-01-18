import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta al PNG
const pngPath = path.join(__dirname, '../public/logo_nuevo_png.png');
const outputPath = path.join(__dirname, '../public/favicon.svg');

// Leer el archivo PNG y convertirlo a base64
const pngBuffer = fs.readFileSync(pngPath);
const base64Data = pngBuffer.toString('base64');
const dataUri = `data:image/png;base64,${base64Data}`;

// Crear el SVG con el PNG embebido y soporte para prefers-color-scheme
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
  <defs>
    <style>
      @media (prefers-color-scheme: dark) {
        #logo-image {
          filter: invert(1) brightness(1.1);
        }
      }
      @media (prefers-color-scheme: light) {
        #logo-image {
          filter: none;
        }
      }
    </style>
  </defs>
  <image id="logo-image" href="${dataUri}" width="600" height="600" />
</svg>`;

// Escribir el archivo SVG
fs.writeFileSync(outputPath, svgContent, 'utf8');

console.log('✅ SVG generado exitosamente en:', outputPath);
console.log('📊 Tamaño del PNG original:', (pngBuffer.length / 1024).toFixed(2), 'KB');
console.log('📊 Tamaño del SVG generado:', (Buffer.from(svgContent).length / 1024).toFixed(2), 'KB');
