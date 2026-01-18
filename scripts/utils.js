/**
 * Utility function to sanitize filenames
 * Removes accents, special characters, and normalizes spaces
 */
export function sanitizeFilename(filename) {
    return filename
        .normalize('NFD') // Decompose combined characters
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks (accents)
        .replace(/[^a-zA-Z0-9\s\-_.]/g, '') // Keep only alphanumeric, spaces, hyphens, underscores, dots
        .replace(/\s+/g, ' ') // Normalize multiple spaces to single space
        .trim();
}

/**
 * Extract filename without extension
 */
export function getBaseName(filename) {
    return filename.replace(/\.[^/.]+$/, '');
}

/**
 * Get file extension
 */
export function getExtension(filename) {
    const match = filename.match(/\.([^/.]+)$/);
    return match ? match[1] : '';
}
