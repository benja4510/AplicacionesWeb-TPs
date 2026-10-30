// Guarda y lee datos en el navegador (localStorage).
// Los datos se guardan como texto, por eso uso JSON.stringify y JSON.parse.

const CLAVE_OPERACION = "huellitas_operacion";

export function leer(clave, valorPorDefecto) {
    try {
        const texto = localStorage.getItem(clave);
        return texto ? JSON.parse(texto) : valorPorDefecto;
    } catch (error) {
        console.error("No se pudo leer " + clave, error);
        return valorPorDefecto;
    }
}

export function guardar(clave, valor) {
    try {
        localStorage.setItem(clave, JSON.stringify(valor));
    } catch (error) {
        console.error("No se pudo guardar " + clave, error);
    }
}


export function guardarOperacion(operacion) {
    guardar(CLAVE_OPERACION, operacion);
}

export function obtenerOperacion() {
    return leer(CLAVE_OPERACION, null);
}