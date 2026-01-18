# Scripts de Navarro Automoción

Este directorio contiene herramientas para la gestión de datos, mantenimiento y automatización del inventario.

## 🚀 Mantenimiento y Backup

| Script | Descripción | Uso |
| :--- | :--- | :--- |
| `descargar_respaldo.js` | Descarga todas las fotos de Supabase a la carpeta local `COPIA_SEGURIDAD_FOTOS`. | `node scripts/descargar_respaldo.js` |
| `utils.js` | Funciones de utilidad (sanitización de nombres, etc.). | Requerido por otros scripts. |

## 🛠️ Herramientas de Gestión Masiva

Estos scripts son útiles si necesitas hacer cambios en muchos coches a la vez fuera del Panel de Control.

| Script | Descripción | Uso |
| :--- | :--- | :--- |
| `importar_fotos.js` | Importa fotos masivamente desde carpetas locales a Supabase. | `node scripts/importar_fotos.js` |
| `sincronizar_datos.js` | Sincroniza datos técnicos (precios, km, etc.) desde el CSV. | `node scripts/sincronizar_datos.js` |
| `verificar_datos.js` | Utilidad rápida para ver los últimos registros en la consola. | `node scripts/verificar_datos.js` |

## 📦 Datos y Referencia

| Archivo | Descripción |
| :--- | :--- |
| `inventario_final.csv` | Listado maestro de vehículos para sincronización masiva. |
| `INVENTARIO_README.md` | Guía detallada sobre cómo gestionar el inventario por CSV. |

---
> [!NOTE]
> Se han mantenido los scripts genéricos y de gestión masiva. Solo se han eliminado los scripts de migración únicos (como el de arreglar el Mercedes E350 o la migración de URLs de ayer) que no tienen utilidad recurrente.
