// Página de servicios: las opciones del select vienen del JSON
// y el formulario de reserva se valida antes de continuar.

import { cargarJSON } from "./api.js";
import { guardarOperacion } from "./almacenamiento.js";
import { validarNombre, validarServicio, validarFecha, validarHora, fechaHoyISO } from "./validaciones.js";
import { validarFormulario, activarValidacionEnVivo } from "./formularios.js";

const URL_SERVICIOS = "./recursos/datos/servicios.json";

const REGLAS = {
    "id-nombre-dueno": validarNombre,
    "id-servicio-tipo": validarServicio,
    "id-fecha": validarFecha,
    "id-hora": validarHora
};

export async function iniciarServicios() {
    const formulario = document.querySelector("#form-reserva");
    const aviso = document.querySelector("#servicios-aviso");
    const selectServicio = document.querySelector("#id-servicio-tipo");
    const inputFecha = document.querySelector("#id-fecha");

    // No deja elegir fechas pasadas en el calendario
    inputFecha.min = fechaHoyISO();

    // Llenar el select con los servicios del JSON
    try {
        const datos = await cargarJSON(URL_SERVICIOS);
        datos.servicios.forEach(function (servicio) {
            selectServicio.add(new Option(servicio.nombre, servicio.id));
        });
    } catch (error) {
        console.error(error);
        aviso.textContent = "No se pudieron cargar los servicios. Probá de nuevo más tarde.";
        aviso.hidden = false;
        return;
    }

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