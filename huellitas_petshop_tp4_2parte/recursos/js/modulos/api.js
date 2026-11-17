// Carga de datos desde los archivos JSON con fetch.
// Si algo falla (archivo inexistente, sin conexión, JSON roto) se lanza un
// error con un mensaje claro y cada página decide qué mostrarle a la persona.

const RUTAS = {
    productos: "./recursos/datos/productos.json",
    servicios: "./recursos/datos/servicios.json",
    mediosPago: "./recursos/datos/mediosPago.json"
};

// Guarda lo ya descargado para no pedir dos veces el mismo archivo
const guardados = {};

export async function cargarJSON(ruta) {
    if (guardados[ruta]) return guardados[ruta];

    try {
        const respuesta = await fetch(ruta);

        if (!respuesta.ok) {
            throw new Error("Respuesta " + respuesta.status + " al pedir " + ruta);
        }

        const datos = await respuesta.json();
        guardados[ruta] = datos;
        return datos;
    } catch (error) {
        console.error("No se pudieron cargar los datos de " + ruta, error);
        throw new Error("No se pudieron cargar los datos.");
    }
}

export function obtenerProductos() {
    return cargarJSON(RUTAS.productos);
}

export function obtenerServicios() {
    return cargarJSON(RUTAS.servicios);
}

export function obtenerMediosPago() {
    return cargarJSON(RUTAS.mediosPago);
}
