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

/** 
 * Coordenadas de la silueta del coche detectadas:
 * x: 302, y: 738, width: 1536, height: 346
 * 
 * Para centrarlo en un cuadrado de 1536x1536 (manteniendo relación de aspecto):
 * Centro Y del coche = 738 + 346/2 = 911
 * Inicio Y del cuadrado = 911 - 1536/2 = 143
 */

const carX = 302;
const carY = 738;
const carW = 1536;
const carH = 346;

// Aplicamos un padding del 10% para que el coche no toque los bordes del icono
// Esto suele mejorar la visualización en las pestañas del navegador.
const paddingPercent = 0.10;
const paddedWidth = carW * (1 + 2 * paddingPercent);
const squareSize = paddedWidth; // Mantenerlo cuadrado

// Cálculo exacto del centrado
const viewBoxX = carX - (carW * paddingPercent);
const viewBoxY = (carY + carH / 2) - (squareSize / 2);

// Crear el SVG con el PNG embebido, recorte y soporte para prefers-color-scheme
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBoxX} ${viewBoxY} ${squareSize} ${squareSize}">
  <defs>
    <clipPath id="car-clip">
      <rect x="${carX}" y="${carY}" width="${carW}" height="${carH}" />
    </clipPath>
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
  <image id="logo-image" href="${dataUri}" width="2000" height="2000" clip-path="url(#car-clip)" />
</svg>`;

// Escribir el archivo SVG
fs.writeFileSync(outputPath, svgContent, 'utf8');

console.log('✅ SVG rediseñado (solo silueta) generado exitosamente en:', outputPath);
console.log('📊 Tamaño del SVG generado:', (Buffer.from(svgContent).length / 1024).toFixed(2), 'KB');
