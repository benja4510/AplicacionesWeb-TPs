// Funciones chicas para dar formato a textos y precios

// 13500 -> "$13.500"
export function formatearPrecio(numero) {
    return "$" + numero.toLocaleString("es-AR");
}

// Pasa el texto a minúsculas y le saca las tildes,
// así la búsqueda no distingue mayúsculas ni tildes
export function normalizar(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// Evita que un texto escrito por el usuario se lea como HTML
export function escaparHTML(texto) {
    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}


export function formatearFecha(fechaISO) {
    const [anio, mes, dia] = fechaISO.split("-");
    return dia + "/" + mes + "/" + anio;
}