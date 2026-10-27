// Funciones que usan las validaciones sobre el HTML:
// muestran o borran los mensajes de error de cada campo.
//
// Cada campo tiene su mensaje en un <p id="error-ID-DEL-CAMPO">.

function mostrarError(campo, mensaje) {
    const error = document.getElementById("error-" + campo.id);
    if (error) error.textContent = mensaje;

    // El CSS usa este atributo para pintar el borde rojo
    campo.setAttribute("aria-invalid", "true");
}

function limpiarError(campo) {
    const error = document.getElementById("error-" + campo.id);
    if (error) error.textContent = "";

    campo.removeAttribute("aria-invalid");
}

// Valida un solo campo. Devuelve true si está bien.
function validarCampo(campo, regla) {
    const mensaje = regla(campo.value.trim());

    if (mensaje) {
        mostrarError(campo, mensaje);
    } else {
        limpiarError(campo);
    }
    return mensaje === "";
}

// Valida todos los campos del formulario.
// "reglas" es un objeto así: { "id-del-campo": funcionDeValidacion }
export function validarFormulario(reglas) {
    let formularioValido = true;
    let primerCampoMalo = null;

    for (const id in reglas) {
        const campo = document.getElementById(id);
        const esValido = validarCampo(campo, reglas[id]);

        if (!esValido) {
            formularioValido = false;
            if (!primerCampoMalo) primerCampoMalo = campo;
        }
    }

    // Se lleva el cursor al primer campo con error
    if (primerCampoMalo) primerCampoMalo.focus();

    return formularioValido;
}

// Valida cada campo cuando la persona sale de él (blur),
// y lo va corrigiendo mientras escribe si ya tenía un error.
export function activarValidacionEnVivo(reglas) {
    for (const id in reglas) {
        const campo = document.getElementById(id);

        campo.addEventListener("blur", function () {
            validarCampo(campo, reglas[id]);
        });

        campo.addEventListener("input", function () {
            if (campo.hasAttribute("aria-invalid")) {
                validarCampo(campo, reglas[id]);
            }
        });
    }
}

export function limpiarErrores(reglas) {
    for (const id in reglas) {
        limpiarError(document.getElementById(id));
    }
}