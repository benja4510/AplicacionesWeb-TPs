// Envío de pedidos, reservas y consultas por WhatsApp.
// Se arma un texto con los datos y se abre un enlace wa.me con el mensaje
// ya escrito; la persona solo tiene que apretar "Enviar" en WhatsApp.

import { NUMERO_WHATSAPP, NOMBRE_LOCAL } from "./config.js";
import { formatearPrecio, formatearFecha } from "./formato.js";

export function mensajePedido(p) {
    const lineas = [
        "Hola " + NOMBRE_LOCAL + "! Quiero confirmar mi pedido #" + p.numero + ":",
        ""
    ];

    p.productos.forEach(function (producto) {
        lineas.push("- " + producto);
    });

    lineas.push(
        "",
        "Total: " + formatearPrecio(p.total),
        "Medio de pago: " + p.medioPago,
        "",
        "Nombre: " + p.nombre,
        "Email: " + p.email,
        "Dirección de entrega: " + p.direccion
    );
    return lineas.join("\n");
}

export function mensajeTurno(t) {
    return [
        "Hola " + NOMBRE_LOCAL + "! Quiero reservar un turno:",
        "",
        "Dueño/a: " + t.dueno,
        "Servicio: " + t.servicio,
        "Fecha: " + formatearFecha(t.fecha),
        "Horario: " + t.hora + " hs"
    ].join("\n");
}

export function mensajeConsulta(c) {
    const lineas = [
        "Hola " + NOMBRE_LOCAL + "! Les escribo desde la web:",
        "",
        "Nombre: " + c.nombre
    ];

    if (c.telefono) lineas.push("Teléfono: " + c.telefono);
    lineas.push("Tamaño de mascota: " + c.tamano);
    if (c.edad) lineas.push("Edad de la mascota: " + c.edad + " años");
    if (c.comentario) lineas.push("", "Consulta: " + c.comentario);

    return lineas.join("\n");
}

export function crearEnlaceWhatsApp(texto) {
    return "https://wa.me/" + NUMERO_WHATSAPP + "?text=" + encodeURIComponent(texto);
}

// Abre WhatsApp en otra pestaña. Devuelve true si el navegador la abrió
// y false si la bloqueó (por ejemplo, por las ventanas emergentes).
export function abrirWhatsApp(texto) {
    try {
        const ventana = window.open(crearEnlaceWhatsApp(texto), "_blank");
        if (ventana) ventana.opener = null;
        return ventana !== null;
    } catch (error) {
        console.error("No se pudo abrir WhatsApp", error);
        return false;
    }
}
