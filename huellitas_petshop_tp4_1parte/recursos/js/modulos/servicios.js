// Página de servicios: las opciones del select vienen del módulo de datos
// y el formulario de reserva se valida antes de continuar.

import { servicios } from "../datos/servicios.js";
import { guardarOperacion } from "./almacenamiento.js";
import { validarNombre, validarServicio, validarFecha, validarHora, fechaHoyISO } from "./validaciones.js";
import { validarFormulario, activarValidacionEnVivo } from "./formularios.js";

const REGLAS = {
    "id-nombre-dueno": validarNombre,
    "id-servicio-tipo": validarServicio,
    "id-fecha": validarFecha,
    "id-hora": validarHora
};

export function iniciarServicios() {
    const formulario = document.querySelector("#form-reserva");
    const selectServicio = document.querySelector("#id-servicio-tipo");
    const inputFecha = document.querySelector("#id-fecha");

    // No deja elegir fechas pasadas en el calendario
    inputFecha.min = fechaHoyISO();

    // Llenar el select con los servicios
    servicios.forEach(function (servicio) {
        selectServicio.add(new Option(servicio.nombre, servicio.id));
    });

    activarValidacionEnVivo(REGLAS);

    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();

        if (!validarFormulario(REGLAS)) return;

        guardarOperacion({
            tipo: "turno",
            dueno: document.querySelector("#id-nombre-dueno").value.trim(),
            servicio: selectServicio.options[selectServicio.selectedIndex].text,
            fecha: inputFecha.value,
            hora: document.querySelector("#id-hora").value
        });

        window.location.href = "./confirmacion.html";
    });
}