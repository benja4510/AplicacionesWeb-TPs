export async function cargarJSON(url) {
    const respuesta = await fetch(url);

   
    if (!respuesta.ok) {
        throw new Error("No se pudo cargar " + url + " (error " + respuesta.status + ")");
    }

    return respuesta.json();
}