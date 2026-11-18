// Tests unitarios de las funciones de formato (recursos/js/modulos/formato.js)
// Se ejecutan con el test runner nativo de Node: node --test

import test from "node:test";
import assert from "node:assert/strict";
import { formatearPrecio, normalizar, escaparHTML, formatearFecha } from "../recursos/js/modulos/formato.js";

test("formatearPrecio agrega el signo $ y el punto de miles", () => {
    assert.equal(formatearPrecio(13500), "$13.500");
    assert.equal(formatearPrecio(5000), "$5.000");
    assert.equal(formatearPrecio(950), "$950");
});

test("normalizar saca tildes y pasa a minúsculas", () => {
    assert.equal(normalizar("HIGIÉNE"), "higiene");
    assert.equal(normalizar("Peluquería"), "peluqueria");
    assert.equal(normalizar("Baño"), "bano");
});

test("escaparHTML evita que un texto se lea como HTML", () => {
    assert.equal(escaparHTML("<b>hola</b>"), "&lt;b&gt;hola&lt;/b&gt;");
    assert.equal(escaparHTML('a & "b"'), "a &amp; &quot;b&quot;");
});

test("formatearFecha pasa de AAAA-MM-DD a DD/MM/AAAA", () => {
    assert.equal(formatearFecha("2026-11-18"), "18/11/2026");
});
