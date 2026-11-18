// Tests unitarios de filtrarProductos (recursos/js/modulos/catalogo.js)
// Usa los productos reales del archivo productos.json.

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { filtrarProductos } from "../recursos/js/modulos/catalogo.js";

const productos = JSON.parse(readFileSync(new URL("../recursos/datos/productos.json", import.meta.url), "utf8"));
const sinFiltros = { texto: "", categoria: "todas", orden: "" };

test("sin filtros devuelve todos los productos", () => {
    assert.equal(filtrarProductos(productos, sinFiltros).length, productos.length);
});

test("filtra por texto sin distinguir mayúsculas ni tildes", () => {
    const resultado = filtrarProductos(productos, { ...sinFiltros, texto: "CORREA" });
    assert.equal(resultado.length, 1);
    assert.equal(resultado[0].nombre, "Correa Reforzada");
});

test("filtra por categoría", () => {
    const resultado = filtrarProductos(productos, { ...sinFiltros, categoria: "Higiene" });
    assert.ok(resultado.length >= 1);
    assert.ok(resultado.every((p) => p.categoria === "Higiene"));
});

test("combina texto y categoría y puede no encontrar nada", () => {
    const resultado = filtrarProductos(productos, { texto: "correa", categoria: "Alimentos", orden: "" });
    assert.equal(resultado.length, 0);
});

test("ordena por precio ascendente y descendente", () => {
    const asc = filtrarProductos(productos, { ...sinFiltros, orden: "precio-asc" }).map((p) => p.precio);
    const desc = filtrarProductos(productos, { ...sinFiltros, orden: "precio-desc" }).map((p) => p.precio);
    assert.deepEqual(asc, [...asc].sort((a, b) => a - b));
    assert.deepEqual(desc, [...desc].sort((a, b) => b - a));
});

test("no modifica el arreglo original", () => {
    const antes = productos.map((p) => p.id);
    filtrarProductos(productos, { ...sinFiltros, orden: "precio-desc" });
    assert.deepEqual(productos.map((p) => p.id), antes);
});
