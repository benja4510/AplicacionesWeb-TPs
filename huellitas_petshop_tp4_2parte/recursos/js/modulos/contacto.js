// Página de contacto: valida el formulario de consulta.
// Al enviar, la consulta se manda por WhatsApp y se avisa en la misma página.

import { validarNombre, validarTelefono, validarEdad, validarComentario } from "./validaciones.js";
import { validarFormulario, activarValidacionEnVivo, limpiarErrores } from "./formularios.js";
import { escaparHTML } from "./formato.js";
import { mensajeConsulta, abrirWhatsApp, crearEnlaceWhatsApp } from "./mensajeria.js";

const REGLAS = {
    "id-nombre": validarNombre,
    "id-telefono": validarTelefono,
    "id-edad": validarEdad,
    "id-comentario": validarComentario
};

export function iniciarContacto() {
    const formulario = document.querySelector("#form-contacto");
    const aviso = document.querySelector("#contacto-aviso");

    activarValidacionEnVivo(REGLAS);

    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();
        aviso.hidden = true;

        if (!validarFormulario(REGLAS)) return;

        const selectTamano = document.querySelector("#id-tamaño-mascota");
        const consulta = {
            nombre: document.querySelector("#id-nombre").value.trim(),
            telefono: document.querySelector("#id-telefono").value.trim(),
            tamano: selectTamano.options[selectTamano.selectedIndex].text,
            edad: document.querySelector("#id-edad").value.trim(),
            comentario: document.querySelector("#id-comentario").value.trim()
        };

        const texto = mensajeConsulta(consulta);
        const abierto = abrirWhatsApp(texto);
        const enlace = '<a href="' + crearEnlaceWhatsApp(texto) + '" target="_blank" rel="noopener noreferrer">Abrir WhatsApp</a>';

        formulario.reset();
        aviso.innerHTML = abierto
            ? "¡Gracias, " + escaparHTML(consulta.nombre) + "! Se abrió WhatsApp con tu consulta lista para enviar. " + enlace
            : "¡Gracias, " + escaparHTML(consulta.nombre) + "! No pudimos abrir WhatsApp automáticamente. " + enlace;
        aviso.hidden = false;
    });

    formulario.addEventListener("reset", function () {
        limpiarErrores(REGLAS);
        aviso.hidden = true;
    });
}