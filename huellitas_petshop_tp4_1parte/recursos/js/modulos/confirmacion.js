// Página de confirmación: muestra el resumen de la última compra o reserva
// que se guardó en el navegador.

import { obtenerOperacion } from "./almacenamiento.js";
import { formatearPrecio, formatearFecha, escaparHTML } from "./formato.js";

function crearResumenPedido(p) {
    return `
    <h1>¡Muchas Gracias por tu Compra!</h1>
    <p>Tu pedido fue registrado con éxito. Te enviamos un correo electrónico a ${escaparHTML(p.email)} con los detalles del envío.</p>

    <article class="resumen-confirmacion">
        <h2>Resumen del Pedido #${p.numero}</h2>
        <ul>
            <li><strong>Estado:</strong> En preparación</li>
            <li><strong>Comprador:</strong> ${escaparHTML(p.nombre)}</li>
            <li><strong>Retiro / Envío:</strong> ${escaparHTML(p.direccion)}</li>
            <li><strong>Medio de pago:</strong> ${escaparHTML(p.medioPago)}</li>
            <li><strong>Productos:</strong> ${escaparHTML(p.productos.join(", "))}</li>
            <li><strong>Total:</strong> ${formatearPrecio(p.total)}</li>
            <li><strong>Tiempo estimado:</strong> 24 a 48 horas hábiles</li>
        </ul>
    </article>`;
}

function crearResumenTurno(t) {
    return `
    <h1>¡Tu turno fue reservado!</h1>
    <p>Te esperamos en San Lorenzo 600, Nueva Córdoba.</p>

    <article class="resumen-confirmacion">
        <h2>Resumen de la Reserva</h2>
        <ul>
            <li><strong>Dueño/a:</strong> ${escaparHTML(t.dueno)}</li>
            <li><strong>Servicio:</strong> ${escaparHTML(t.servicio)}</li>
            <li><strong>Fecha:</strong> ${formatearFecha(t.fecha)}</li>
            <li><strong>Horario:</strong> ${t.hora} hs</li>
        </ul>
    </article>`;
}

export function iniciarConfirmacion() {
    const contenido = document.querySelector("#confirmacion-contenido");
    const operacion = obtenerOperacion();
    let html;

    if (operacion && operacion.tipo === "pedido") {
        html = crearResumenPedido(operacion);
    } else if (operacion && operacion.tipo === "turno") {
        html = crearResumenTurno(operacion);
    } else {
        html = `
        <h1>Confirmación</h1>
        <p>Todavía no hay ninguna compra ni reserva para mostrar.</p>`;
    }

    contenido.innerHTML = html + `
    <a class="boton boton--primario" href="./index.html">Volver a la Página Principal</a>`;
}