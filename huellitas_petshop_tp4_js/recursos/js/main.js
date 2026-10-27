// Archivo principal: se carga en todas las páginas.
// Mira en qué página está (atributo data-pagina del <body>)
// y arranca solamente el módulo que corresponde.

import { actualizarContador } from "./modulos/contador.js";
import { iniciarCatalogo } from "./modulos/catalogo.js";
import { iniciarCarrito } from "./modulos/carrito.js";
import { iniciarServicios } from "./modulos/servicios.js";
import { iniciarContacto } from "./modulos/contacto.js";
import { iniciarConfirmacion } from "./modulos/confirmacion.js";

const paginas = {
    catalogo: iniciarCatalogo,
    carrito: iniciarCarrito,
    servicios: iniciarServicios,
    contacto: iniciarContacto,
    confirmacion: iniciarConfirmacion
};

document.addEventListener("DOMContentLoaded", function () {
    actualizarContador();   

    const iniciar = paginas[document.body.dataset.pagina];
    if (iniciar) iniciar();
});