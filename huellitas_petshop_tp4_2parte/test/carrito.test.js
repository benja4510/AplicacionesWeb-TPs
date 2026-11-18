// Tests unitarios del carrito (recursos/js/modulos/carritoDatos.js)
// Node no tiene localStorage, así que se simula con un objeto en memoria.

import test, { beforeEach } from "node:test";
import assert from "node:assert/strict";
import {
    obtenerCarrito, agregarProducto, cambiarCantidad,
    eliminarProducto, vaciarCarrito, contarProductos
} from "../recursos/js/modulos/carritoDatos.js";

beforeEach(() => {
    const memoria = new Map();
    globalThis.localStorage = {
        getItem: (clave) => (memoria.has(clave) ? memoria.get(clave) : null),
        setItem: (clave, valor) => memoria.set(clave, String(valor)),
        removeItem: (clave) => memoria.delete(clave)
    };
});

test("el carrito empieza vacío", () => {
    assert.deepEqual(obtenerCarrito(), []);
    assert.equal(contarProductos(), 0);
});

test("agregarProducto suma una unidad si el producto ya estaba", () => {
    agregarProducto(1);
    agregarProducto(1);
    agregarProducto(2);
    assert.deepEqual(obtenerCarrito(), [{ id: 1, cantidad: 2 }, { id: 2, cantidad: 1 }]);
    assert.equal(contarProductos(), 3);
});

test("cambiarCantidad respeta el mínimo de 1 unidad", () => {
    agregarProducto(1);
    cambiarCantidad(1, 1);
    assert.equal(obtenerCarrito()[0].cantidad, 2);
    cambiarCantidad(1, -5);
    assert.equal(obtenerCarrito()[0].cantidad, 1);
});

test("eliminarProducto y vaciarCarrito quitan productos", () => {
    agregarProducto(1);
    agregarProducto(2);
    eliminarProducto(1);
    assert.deepEqual(obtenerCarrito(), [{ id: 2, cantidad: 1 }]);
    vaciarCarrito();
    assert.deepEqual(obtenerCarrito(), []);
});
