// Tests unitarios de los mensajes de WhatsApp (recursos/js/modulos/mensajeria.js)

import test from "node:test";
import assert from "node:assert/strict";
import { mensajePedido, mensajeTurno, mensajeConsulta, crearEnlaceWhatsApp } from "../recursos/js/modulos/mensajeria.js";
import { NUMERO_WHATSAPP } from "../recursos/js/modulos/config.js";

test("mensajePedido incluye productos, total, medio de pago y dirección", () => {
    const texto = mensajePedido({
        numero: 4641,
        productos: ["Correa Reforzada x2", "Shampoo Neutro Mascota x1"],
        total: 13200,
        medioPago: "Efectivo al retirar",
        nombre: "Benjamin Diaz",
        email: "benja@correo.com",
        direccion: "San Lorenzo 600"
    });
    assert.match(texto, /pedido #4641/);
    assert.match(texto, /- Correa Reforzada x2/);
    assert.match(texto, /Total: \$13\.200/);
    assert.match(texto, /Efectivo al retirar/);
    assert.match(texto, /San Lorenzo 600/);
});

test("mensajeTurno muestra la fecha en formato DD/MM/AAAA", () => {
    const texto = mensajeTurno({ dueno: "Benjamin", servicio: "Baño", fecha: "2026-11-18", hora: "10:30" });
    assert.match(texto, /Fecha: 18\/11\/2026/);
    assert.match(texto, /Servicio: Baño/);
});

test("mensajeConsulta omite los datos opcionales vacíos", () => {
    const texto = mensajeConsulta({ nombre: "Benjamin", telefono: "", tamano: "Chico", edad: "", comentario: "" });
    assert.match(texto, /Nombre: Benjamin/);
    assert.doesNotMatch(texto, /Teléfono/);
    assert.doesNotMatch(texto, /Consulta/);
});

test("crearEnlaceWhatsApp arma un enlace wa.me con el texto codificado", () => {
    const enlace = crearEnlaceWhatsApp("Hola mundo\nLínea 2");
    assert.ok(enlace.startsWith("https://wa.me/" + NUMERO_WHATSAPP + "?text="));
    assert.ok(enlace.includes("Hola%20mundo%0AL%C3%ADnea%202"));
});
