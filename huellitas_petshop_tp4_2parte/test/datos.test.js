// Controla que los archivos JSON y las imágenes del catálogo estén bien.
// Sirve para detectar rutas rotas (por ejemplo, diferencias de mayúsculas) antes de publicar.

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

const raiz = new URL("../", import.meta.url);
const leerJSON = (ruta) => JSON.parse(readFileSync(new URL(ruta, raiz), "utf8"));

test("productos.json: ids únicos y campos obligatorios", () => {
    const productos = leerJSON("recursos/datos/productos.json");
    assert.ok(productos.length > 0);
    assert.equal(new Set(productos.map((p) => p.id)).size, productos.length);
    for (const p of productos) {
        assert.equal(typeof p.nombre, "string");
        assert.equal(typeof p.categoria, "string");
        assert.ok(Number.isFinite(p.precio) && p.precio > 0, "precio inválido en " + p.nombre);
    }
});

test("cada producto apunta a una imagen que existe", () => {
    for (const p of leerJSON("recursos/datos/productos.json")) {
        assert.ok(existsSync(new URL(p.imagen, raiz)), "no existe la imagen " + p.imagen);
    }
});

test("servicios.json y mediosPago.json tienen id y nombre", () => {
    for (const archivo of ["servicios.json", "mediosPago.json"]) {
        const lista = leerJSON("recursos/datos/" + archivo);
        assert.ok(lista.length > 0);
        assert.ok(lista.every((x) => x.id && x.nombre), "faltan campos en " + archivo);
    }
});
