// Página del catálogo: JavaScript dibuja toda la sección
// (título, filtros, mensajes y productos) y maneja sus eventos.

import { productos } from "../datos/productos.js";
import { formatearPrecio, normalizar } from "./formato.js";
import { agregarProducto } from "./carritoDatos.js";
import { actualizarContador } from "./contador.js";

// Devuelve solo los productos que cumplen los filtros, en el orden elegido
export function filtrarProductos(lista, filtros) {
    const buscado = normalizar(filtros.texto.trim());

    const resultado = lista.filter(function (p) {
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

// Arma el formulario de filtros. Las categorías salen de los datos.
function crearFiltros(categorias) {
    const opciones = categorias.map(function (categoria) {
        return `<option value="${categoria}">${categoria}</option>`;
    }).join("");

    return `
    <form class="filtros-catalogo" id="filtros-form" aria-label="Filtrar productos">
        <div>
            <label for="filtro-texto">Buscar:</label>
            <input type="search" id="filtro-texto" placeholder="Ej: correa">
        </div>

        <div>
            <label for="filtro-categoria">Categoría:</label>
            <select id="filtro-categoria">
                <option value="todas">Todas</option>
                ${opciones}
            </select>
        </div>

        <div>
            <label for="filtro-orden">Ordenar por:</label>
            <select id="filtro-orden">
                <option value="">Sin orden</option>
                <option value="precio-asc">Precio: menor a mayor</option>
                <option value="precio-desc">Precio: mayor a menor</option>
                <option value="nombre">Nombre (A-Z)</option>
            </select>
        </div>

        <button class="boton boton--secundario" type="button" id="filtro-limpiar">Limpiar filtros</button>
    </form>`;
}

// Arma toda la sección del catálogo
function crearSeccion(categorias) {
    return `
    <h2>Productos</h2>
    ${crearFiltros(categorias)}
    <p class="catalogo-resultados" id="catalogo-mensaje" role="status" aria-live="polite"></p>
    <p class="catalogo-aviso" id="catalogo-aviso" role="status" aria-live="polite"></p>
    <div class="grilla-productos" id="catalogo-grilla"></div>`;
}

export function iniciarCatalogo() {
    const seccion = document.querySelector("#catalogo-seccion");

    //  Dibujar la sección completa (las categorías salen de los productos, sin repetir)
    const categorias = [...new Set(productos.map(function (p) { return p.categoria; }))];
    seccion.innerHTML = crearSeccion(categorias);

    const grilla = document.querySelector("#catalogo-grilla");
    const mensaje = document.querySelector("#catalogo-mensaje");
    const aviso = document.querySelector("#catalogo-aviso");
    const formulario = document.querySelector("#filtros-form");
    const inputTexto = document.querySelector("#filtro-texto");
    const selectCategoria = document.querySelector("#filtro-categoria");
    const selectOrden = document.querySelector("#filtro-orden");
    const botonLimpiar = document.querySelector("#filtro-limpiar");

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