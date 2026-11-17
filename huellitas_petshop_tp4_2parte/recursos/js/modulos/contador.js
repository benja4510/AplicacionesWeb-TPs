// Actualiza el numerito amarillo que está al lado de "Carrito" en el menú

import { contarProductos } from "./carritoDatos.js";

export function actualizarContador() {
    const total = contarProductos();

    document.querySelectorAll("[data-contador-carrito]").forEach(function (etiqueta) {
        etiqueta.textContent = total;
        etiqueta.hidden = total === 0;   // si no hay nada, se esconde
    });
}