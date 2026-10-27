// Página del carrito: muestra lo que se agregó, calcula el total
// y valida el formulario de entrega y pago.

import { cargarJSON } from "./api.js";
import { formatearPrecio } from "./formato.js";
import { obtenerCarrito, cambiarCantidad, eliminarProducto, vaciarCarrito } from "./carritoDatos.js";
import { actualizarContador } from "./contador.js";
import { guardarOperacion } from "./almacenamiento.js";
import { validarNombre, validarEmail, validarDireccion } from "./validaciones.js";
import { validarFormulario, activarValidacionEnVivo } from "./formularios.js";

const URL_PRODUCTOS = "./recursos/datos/productos.json";
const URL_MEDIOS_PAGO = "./recursos/datos/mediosPago.json";

// Campo del formulario -> regla que lo controla
const REGLAS = {
    "id-nombre-compra": validarNombre,
    "id-email": validarEmail,
    "id-direccion": validarDireccion
};

// Arma el HTML de un producto del carrito
function crearItem(item) {
    const subtotal = item.precio * item.cantidad;

    return `
    <li>
        <article class="item-carrito">
            <h3>${item.nombre}</h3>
            <p class="item-carrito__cantidad">
                Cantidad:
                <button class="boton boton--secundario boton--chico" type="button" data-accion="restar" data-id="${item.id}" aria-label="Restar una unidad de ${item.nombre}" ${item.cantidad === 1 ? "disabled" : ""}>-</button>
                <span>${item.cantidad}</span>
                <button class="boton boton--secundario boton--chico" type="button" data-accion="sumar" data-id="${item.id}" aria-label="Sumar una unidad de ${item.nombre}">+</button>
            </p>
            <p>Precio unitario: ${formatearPrecio(item.precio)}</p>
            <p class="item-carrito__subtotal">Subtotal: ${formatearPrecio(subtotal)}</p>
            <button class="boton boton--peligro" type="button" data-accion="eliminar" data-id="${item.id}" aria-label="Eliminar ${item.nombre} del carrito">Eliminar</button>
        </article>
    </li>`;
}

export async function iniciarCarrito() {
    const lista = document.querySelector("#carrito-lista");
    const vacio = document.querySelector("#carrito-vacio");
    const estado = document.querySelector("#carrito-estado");
    const cajaTotal = document.querySelector("#carrito-total-caja");
    const textoTotal = document.querySelector("#carrito-total");
    const formulario = document.querySelector("#form-compra");
    const aviso = document.querySelector("#carrito-aviso");
    const selectPago = document.querySelector("#id-metodo-pago");

    //  Trae los datos del JSON
    let productos = [];
    try {
        const datosProductos = await cargarJSON(URL_PRODUCTOS);
        const datosPago = await cargarJSON(URL_MEDIOS_PAGO);

        productos = datosProductos.productos;
        datosPago.mediosPago.forEach(function (medio) {
            selectPago.add(new Option(medio.nombre, medio.id));
        });
    } catch (error) {
        console.error(error);
        estado.textContent = "No se pudo cargar el carrito. Probá de nuevo más tarde.";
        return;
    }

    // Junta lo guardado en el carrito con los datos de cada producto
    function obtenerItems() {
        return obtenerCarrito()
            .map(function (guardado) {
                const producto = productos.find(function (p) { return p.id === guardado.id; });
                return producto ? { ...producto, cantidad: guardado.cantidad } : null;
            })
            .filter(function (item) { return item !== null; });
    }

    function calcularTotal(items) {
        return items.reduce(function (suma, i) { return suma + i.precio * i.cantidad; }, 0);
    }

    //  Dibujar el carrito
    function mostrarCarrito() {
        const items = obtenerItems();

        lista.innerHTML = items.map(crearItem).join("");
        vacio.hidden = items.length > 0;
        cajaTotal.hidden = items.length === 0;
        textoTotal.textContent = formatearPrecio(calcularTotal(items));
        actualizarContador();
    }
    mostrarCarrito();

    //  Botones de cada producto (sumar, restar, eliminar)
    lista.addEventListener("click", function (evento) {
        const boton = evento.target.closest("[data-accion]");
        if (!boton) return;

        const id = Number(boton.dataset.id);
        const accion = boton.dataset.accion;

        if (accion === "sumar") cambiarCantidad(id, 1);
        if (accion === "restar") cambiarCantidad(id, -1);
        if (accion === "eliminar") {
            const producto = productos.find(function (p) { return p.id === id; });
            eliminarProducto(id);
            estado.textContent = producto.nombre + " se eliminó del carrito.";
        }

        mostrarCarrito();
    });

    // Formulario
    activarValidacionEnVivo(REGLAS);

    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault(); o
        aviso.hidden = true;

        const datosValidos = validarFormulario(REGLAS);
        const items = obtenerItems();

        if (items.length === 0) {
            aviso.textContent = "Tu carrito está vacío. Agregá productos desde el catálogo.";
            aviso.hidden = false;
            return;
        }
        if (!datosValidos) return;

        // Todo bien: se guarda el pedido y se pasa a la confirmación
        guardarOperacion({
            tipo: "pedido",
            numero: Math.floor(1000 + Math.random() * 9000),
            nombre: document.querySelector("#id-nombre-compra").value.trim(),
            email: document.querySelector("#id-email").value.trim(),
            direccion: document.querySelector("#id-direccion").value.trim(),
            medioPago: selectPago.options[selectPago.selectedIndex].text,
            productos: items.map(function (i) { return i.nombre + " x" + i.cantidad; }),
            total: calcularTotal(items)
        });

        vaciarCarrito();
        window.location.href = "./confirmacion.html";
    });
}