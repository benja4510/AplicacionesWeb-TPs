// DATOS DEL CATÁLOGO
// Los productos están en un módulo aparte, separados de la lógica.
// Para agregar o cambiar un producto se hace solo acá: el catálogo
// y el carrito se actualizan solos.

export const productos = [
    {
        id: 1,
        nombre: "Correa Reforzada",
        categoria: "Accesorios",
        descripcion: "Correa de paseo alta durabilidad",
        detalle: "Talles S M L",
        precio: 5000,
        imagen: "./recursos/imagenes/productos/correa.jpg",
        alt: "Perro mediano con Correa"
    },
    {
        id: 2,
        nombre: "Alimento Premium Perro",
        categoria: "Alimentos",
        descripcion: "Alimento balanceado 15kg",
        detalle: "Sabor Pollo y Carne",
        precio: 13500,
        imagen: "./recursos/imagenes/productos/alimento.jpg",
        alt: "Bolsa de alimento para perros"
    },
    {
        id: 3,
        nombre: "Shampoo Neutro Mascota",
        categoria: "Higiene",
        descripcion: "Shampoo para higiene y cuidado de pelaje",
        detalle: "Contenido 500ml",
        precio: 3200,
        imagen: "./recursos/imagenes/productos/shampoo.jpg",
        alt: "Botella de shampoo para mascotas"
    }
];