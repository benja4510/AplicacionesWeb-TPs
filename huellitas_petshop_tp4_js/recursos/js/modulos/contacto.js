// Página de contacto: valida el formulario de consulta.
// Como no hay servidor, al enviar se muestra un mensaje en la misma página.

import { validarNombre, validarTelefono, validarEdad, validarComentario } from "./validaciones.js";
import { validarFormulario, activarValidacionEnVivo, limpiarErrores } from "./formularios.js";
import { escaparHTML } from "./formato.js";

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

        const nombre = document.querySelector("#id-nombre").value.trim();

        // Primero se limpia el formulario y recién después se muestra el mensaje,
        // porque reset() también esconde el mensaje (ver más abajo)
        formulario.reset();
        aviso.innerHTML = "¡Gracias, " + escaparHTML(nombre) + "! Recibimos tu consulta y te vamos a responder pronto.";
        aviso.hidden = false;
    });

    // El botón "Limpiar" también borra los mensajes de error
    formulario.addEventListener("reset", function () {
        limpiarErrores(REGLAS);
        aviso.hidden = true;
    });
}