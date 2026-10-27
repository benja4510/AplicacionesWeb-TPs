// Maneja los productos del carrito.
// Cada producto se guarda como { id, cantidad }; el resto de los datos
// (nombre, precio) se buscan después en productos.json.

import { leer, guardar } from "./almacenamiento.js";

const CLAVE_CARRITO = "huellitas_carrito";

export function obtenerCarrito() {
    return leer(CLAVE_CARRITO, []);
}

export function agregarProducto(id) {
    const carrito = obtenerCarrito();
    const item = carrito.find(function (i) { return i.id === id; });

    if (item) {
        item.cantidad += 1;
    } else {
        carrito.push({ id: id, cantidad: 1 });
    }
    guardar(CLAVE_CARRITO, carrito);
}

// cambio puede ser +1 o -1. La cantidad mínima es 1.
export function cambiarCantidad(id, cambio) {
    const carrito = obtenerCarrito();
    const item = carrito.find(function (i) { return i.id === id; });

    if (item) {
        item.cantidad = Math.max(1, item.cantidad + cambio);
        guardar(CLAVE_CARRITO, carrito);
    }
}

export function eliminarProducto(id) {
    const carrito = obtenerCarrito().filter(function (i) { return i.id !== id; });
    guardar(CLAVE_CARRITO, carrito);
}

export function vaciarCarrito() {
    guardar(CLAVE_CARRITO, []);
}

// Cantidad total de unidades (para el numerito del menú)
export function contarProductos() {
    return obtenerCarrito().reduce(function (total, i) { return total + i.cantidad; }, 0);
}