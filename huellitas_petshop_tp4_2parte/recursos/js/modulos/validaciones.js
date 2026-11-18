// Reglas de validación.
// Cada función recibe el texto que escribió la persona y devuelve:
//   - un mensaje de error, si hay algo mal
//   - "" (texto vacío), si está todo bien

const SOLO_LETRAS = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]+$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validarNombre(valor) {
    if (valor === "") return "Ingresá el nombre.";
    if (valor.length < 3) return "El nombre tiene que tener al menos 3 letras.";
    if (!SOLO_LETRAS.test(valor)) return "El nombre solo puede tener letras y espacios.";
    return "";
}

export function validarEmail(valor) {
    if (valor === "") return "Ingresá tu correo electrónico.";
    if (!EMAIL.test(valor)) return "Ingresá un correo válido, por ejemplo nombre@correo.com.";
    return "";
}

export function validarDireccion(valor) {
    if (valor === "") return "Ingresá la dirección de entrega.";
    if (valor.length < 5) return "La dirección es muy corta.";
    if (!/\d/.test(valor)) return "Incluí el número de la calle.";
    return "";
}

// El teléfono es opcional: si está vacío no se controla nada
export function validarTelefono(valor) {
    if (valor === "") return "";
    if (!/^[\d\s()+-]+$/.test(valor)) return "Usá solo números, espacios y los símbolos + - ( )";

    const cantidadNumeros = valor.replace(/\D/g, "").length;
    if (cantidadNumeros < 8 || cantidadNumeros > 13) {
        return "El teléfono tiene que tener entre 8 y 13 números.";
    }
    return "";
}

// La edad de la mascota es opcional
export function validarEdad(valor) {
    if (valor === "") return "";

    const numero = Number(valor);
    if (!Number.isInteger(numero)) return "La edad tiene que ser un número entero.";
    if (numero < 0 || numero > 30) return "La edad tiene que estar entre 0 y 30 años.";
    return "";
}

export function validarComentario(valor) {
    if (valor.length > 300) return "El comentario puede tener hasta 300 caracteres.";
    return "";
}

export function validarServicio(valor) {
    return valor === "" ? "Elegí un servicio." : "";
}


export function fechaHoyISO() {
    const hoy = new Date();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");
    return hoy.getFullYear() + "-" + mes + "-" + dia;
}

export function validarFecha(valor) {
    if (valor === "") return "Elegí la fecha del turno.";
    if (valor < fechaHoyISO()) return "La fecha no puede ser anterior a hoy.";
    return "";
}

export function validarHora(valor) {
    return valor === "" ? "Elegí un horario." : "";
}