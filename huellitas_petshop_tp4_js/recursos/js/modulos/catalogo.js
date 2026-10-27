// Página del catálogo: muestra los productos del JSON,
// los filtra y permite agregarlos al carrito.

import { cargarJSON } from "./api.js";
import { formatearPrecio, normalizar } from "./formato.js";
import { agregarProducto } from "./carritoDatos.js";
import { actualizarContador } from "./contador.js";

const URL_PRODUCTOS = "./recursos/datos/productos.json";

// Devuelve solo los productos que cumplen los filtros, en el orden elegido
export function filtrarProductos(productos, filtros) {
    const buscado = normalizar(filtros.texto.trim());

    const resultado = productos.filter(function (p) {
        const coincideTexto = normalizar(p.nombre + " " + p.descripcion).includes(buscado);
        const coincideCategoria = filtros.categoria === "todas" || p.categoria === filtros.categoria;
        return coincideTexto && coincideCategoria;
    });

    if (filtros.orden === "precio-asc") {
        resultado.sort(function (a, b) { return a.precio - b.precio; });
    } else if (filtros.orden === "precio-desc") {
        resultado.sort(function (a, b) { return b.precio - a.precio; });
    } else if (filtros.orden === "nombre") {
        resultado.sort(function (a, b) { return a.nombre.localeCompare(b.nombre, "es"); });
    }

    return resultado;
}

// Arma el HTML de una tarjeta de producto
function crearTarjeta(p) {
    return `
    <article class="tarjeta-producto">
        <h3>${p.nombre}</h3>
        <picture>
            <img src="${p.imagen}" alt="${p.alt}" width="200" loading="lazy">
        </picture>
        <p>${p.descripcion}</p>
        <ul>
            <li>${p.detalle}</li>
            <li class="tarjeta-producto__precio">Precio ${formatearPrecio(p.precio)}</li>
        </ul>
        <button class="boton boton--primario" type="button" data-accion="agregar" data-id="${p.id}" aria-label="Agregar ${p.nombre} al Carrito">Agregar al Carrito</button>
    </article>`;
}

export async function iniciarCatalogo() {
    const grilla = document.querySelector("#catalogo-grilla");
    const mensaje = document.querySelector("#catalogo-mensaje");
    const aviso = document.querySelector("#catalogo-aviso");
    const formulario = document.querySelector("#filtros-form");
    const inputTexto = document.querySelector("#filtro-texto");
    const selectCategoria = document.querySelector("#filtro-categoria");
    const selectOrden = document.querySelector("#filtro-orden");
    const botonLimpiar = document.querySelector("#filtro-limpiar");

    //Trae los productos del JSON
    let productos = [];
    try {
        const datos = await cargarJSON(URL_PRODUCTOS);
        productos = datos.productos;
    } catch (error) {
        console.error(error);
        mensaje.textContent = "No se pudieron cargar los productos. Probá de nuevo más tarde.";
        return;
    }

    // Llenar el filtro de categorías con las que hay en el JSON (sin repetir)
    const categorias = [...new Set(productos.map(function (p) { return p.categoria; }))];
    categorias.forEach(function (categoria) {
        selectCategoria.add(new Option(categoria, categoria));
    });

    //  Mostrar los productos aplicando los filtros
    function actualizar() {
        const lista = filtrarProductos(productos, {
            texto: inputTexto.value,
            categoria: selectCategoria.value,
            orden: selectOrden.value
        });

        grilla.innerHTML = lista.map(crearTarjeta).join("");

        if (lista.length === 0) {
            mensaje.textContent = "No hay productos que coincidan con la búsqueda.";
        } else {
            mensaje.textContent = lista.length + (lista.length === 1 ? " producto encontrado." : " productos encontrados.");
        }
    }
    actualizar();

    // Eventos
    inputTexto.addEventListener("input", actualizar);
    selectCategoria.addEventListener("change", actualizar);
    selectOrden.addEventListener("change", actualizar);

    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();   // para que Enter en el buscador no recargue la página
    });

    botonLimpiar.addEventListener("click", function () {
        formulario.reset();
        actualizar();
    });

    // Un solo evento para todos los botones "Agregar al Carrito"
    grilla.addEventListener("click", function (evento) {
        const boton = evento.target.closest('[data-accion="agregar"]');
        if (!boton) return;

        const producto = productos.find(function (p) { return p.id === Number(boton.dataset.id); });

        agregarProducto(producto.id);
        actualizarContador();
        aviso.textContent = producto.nombre + " se agregó al carrito.";
    });
}