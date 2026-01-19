# Scripts de Navarro Automoción

Este directorio contiene herramientas para la gestión de datos, mantenimiento y automatización del inventario.

## 🚀 Mantenimiento y Emergencias

| Script | Descripción | Uso |
| :--- | :--- | :--- |
| `emergency_restore.js` | Restauración completa de la DB desde `current_inventory.json`. | `node scripts/emergency_restore.js` |
| `refresh_backup.js` | Actualiza `current_inventory.json` con los datos actuales de la DB. | `node scripts/refresh_backup.js` |
| `verify_all_photos.js` | Verifica la integridad entre local, Storage y Base de Datos. | `node scripts/verify_all_photos.js` |
| `list_cars_without_images.js` | Lista todos los vehículos que no tienen imagen vinculada. | `node scripts/list_cars_without_images.js` |

## 🛠️ Herramientas de Gestión Masiva

| Script | Descripción | Uso |
| :--- | :--- | :--- |
| `importar_fotos.js` | Importa fotos masivamente desde carpetas locales a Supabase. | `node scripts/importar_fotos.js` |
| `sincronizar_datos.js` | Sincroniza datos técnicos (precios, km, etc.) desde el CSV. | `node scripts/sincronizar_datos.js` |

## 📦 Datos

| Archivo | Descripción |
| :--- | :--- |
| `current_inventory.json` | Backup de seguridad de la tabla `coches`. |
| `inventario_final.csv` | Listado maestro de vehículos para sincronización masiva. |

---
> [!NOTE]
> Se han eliminado todos los scripts temporales y de migración única para mantener la limpieza del proyecto. Solo se conservan las herramientas esenciales de mantenimiento.
