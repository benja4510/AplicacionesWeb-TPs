// Página de servicios: las opciones del select vienen del módulo de datos
// y el formulario de reserva se valida antes de continuar.

import { obtenerServicios } from "./api.js";
import { guardarOperacion } from "./almacenamiento.js";
import { mensajeTurno, abrirWhatsApp } from "./mensajeria.js";
import { validarNombre, validarServicio, validarFecha, validarHora, fechaHoyISO } from "./validaciones.js";
import { validarFormulario, activarValidacionEnVivo } from "./formularios.js";

const REGLAS = {
    "id-nombre-dueno": validarNombre,
    "id-servicio-tipo": validarServicio,
    "id-fecha": validarFecha,
    "id-hora": validarHora
};

export async function iniciarServicios() {
    const formulario = document.querySelector("#form-reserva");
    const selectServicio = document.querySelector("#id-servicio-tipo");
    const inputFecha = document.querySelector("#id-fecha");
    const aviso = document.querySelector("#servicios-aviso");

    // No deja elegir fechas pasadas en el calendario
    inputFecha.min = fechaHoyISO();

    // Llenar el select con los servicios, que se piden al JSON con fetch
    try {
        const servicios = await obtenerServicios();
        servicios.forEach(function (servicio) {
            selectServicio.add(new Option(servicio.nombre, servicio.id));
        });
    } catch (error) {
        aviso.textContent = "No pudimos cargar la lista de servicios. Probá recargar la página en unos minutos.";
        aviso.hidden = false;
    }

    activarValidacionEnVivo(REGLAS);

    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();

        if (!validarFormulario(REGLAS)) return;

        const turno = {
            tipo: "turno",
            dueno: document.querySelector("#id-nombre-dueno").value.trim(),
            servicio: selectServicio.options[selectServicio.selectedIndex].text,
            fecha: inputFecha.value,
            hora: document.querySelector("#id-hora").value
        };

        guardarOperacion(turno);
        abrirWhatsApp(mensajeTurno(turno));

        window.location.href = "./confirmacion.html";
    });
}