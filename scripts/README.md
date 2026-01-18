# Scripts de Navarro Automoción

Este directorio contiene herramientas para la gestión de datos, migraciones y automatización del inventario.

## 🚀 Scripts Actuales (Mantenimiento)

| Script | Descripción | Uso |
| :--- | :--- | :--- |
| `descargar_respaldo.js` | Descarga todas las fotos de Supabase a la carpeta local `COPIA_SEGURIDAD_FOTOS`. | `node scripts/descargar_respaldo.js` |
| `utils.js` | Funciones de utilidad (sanitización de nombres, etc.). | Requerido por otros scripts. |

## 🛠️ Herramientas de Migración (Usados recientemente)

Estos scripts se utilizaron para la migración al sistema profesional de imágenes y podrían volver a ser útiles en caso de recuperación de datos.

| Script | Descripción |
| :--- | :--- |
| `sync_storage.js` | Sincroniza fotos locales con Supabase Storage (sanitizando nombres). |
| `migrate_image_refs.js` | Convierte URLs completas de Supabase en la DB a solo nombres de archivo limpios. |
| `update_mercedes.js` | Actualización específica de datos del Mercedes E350. |
| `migration_log.json` | Registro detallado de la última migración de imágenes. |

## 📜 Scripts Legado (Históricos)

Scripts utilizados durante la fase inicial del proyecto para importación masiva. Ya no son necesarios para el día a día gracias al Panel de Control.

| Script | Descripción |
| :--- | :--- |
| `importar_fotos.js` | Importación inicial de fotos masivas desde carpetas locales. |
| `sincronizar_datos.js` | Sincroniza datos técnicos desde el archivo CSV. |
| `inventario_final.csv` | Datos maestros utilizados para la sincronización inicial. |
| `arreglar_matriculas_db.js` | Corrigió formatos de matrículas en las etapas tempranas. |
| `añadir_motor.js` | Añadió la columna MOTOR a los registros existentes. |
| `verificar_datos.js` | Utilidad simple para ver los últimos registros en la consola. |
| `INVENTARIO_README.md` | Guía original sobre cómo gestionar el inventario por CSV. |
