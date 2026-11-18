// Tests unitarios de las validaciones de formularios (recursos/js/modulos/validaciones.js)

import test from "node:test";
import assert from "node:assert/strict";
import {
    validarNombre, validarEmail, validarDireccion, validarTelefono,
    validarEdad, validarFecha, fechaHoyISO
} from "../recursos/js/modulos/validaciones.js";

test("validarNombre acepta nombres válidos y rechaza vacíos, cortos o con números", () => {
    assert.equal(validarNombre("Benjamin Diaz"), "");
    assert.notEqual(validarNombre(""), "");
    assert.notEqual(validarNombre("Al"), "");
    assert.notEqual(validarNombre("Ben123"), "");
});

test("validarEmail controla el formato del correo", () => {
    assert.equal(validarEmail("nombre@correo.com"), "");
    assert.notEqual(validarEmail(""), "");
    assert.notEqual(validarEmail("nombre@correo"), "");
    assert.notEqual(validarEmail("nombre correo.com"), "");
});

test("validarDireccion exige largo mínimo y número de calle", () => {
    assert.equal(validarDireccion("San Lorenzo 600"), "");
    assert.notEqual(validarDireccion("Calle"), "");
    assert.notEqual(validarDireccion("San Lorenzo"), "");
});

test("validarTelefono es opcional y controla la cantidad de números", () => {
    assert.equal(validarTelefono(""), "");
    assert.equal(validarTelefono("351 123-4567"), "");
    assert.notEqual(validarTelefono("123"), "");
    assert.notEqual(validarTelefono("abc12345678"), "");
});

test("validarEdad es opcional y acepta enteros entre 0 y 30", () => {
    assert.equal(validarEdad(""), "");
    assert.equal(validarEdad("3"), "");
    assert.notEqual(validarEdad("2.5"), "");
    assert.notEqual(validarEdad("31"), "");
    assert.notEqual(validarEdad("-1"), "");
});

test("validarFecha rechaza fechas pasadas y acepta hoy", () => {
    assert.notEqual(validarFecha(""), "");
    assert.notEqual(validarFecha("2000-01-01"), "");
    assert.equal(validarFecha(fechaHoyISO()), "");
});
