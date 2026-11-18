# Huellitas Pet Shop

Sitio front-end de una tienda y peluquería para mascotas (HTML, CSS y JavaScript con módulos ES).

## Cómo probarlo en la computadora

Los datos se cargan con `fetch` desde archivos JSON, por eso **no funciona abriendo el HTML con doble clic** (`file://`). Hay que abrirlo con un servidor local, por ejemplo:

- Extensión **Live Server** de VS Code (clic derecho en `index.html` → *Open with Live Server*), o
- `npx serve .` en la carpeta del proyecto.

## Estructura

```
index.html, catalogo.html, servicios.html, carrito.html, contacto.html, confirmacion.html
recursos/
  css/estilos.css
  imagenes/
  datos/        productos.json, servicios.json, mediosPago.json
  js/
    main.js     punto de entrada (arranca el módulo de cada página)
    modulos/    catalogo, carrito, carritoDatos, servicios, contacto, confirmacion,
                api (fetch), almacenamiento (localStorage), mensajeria (WhatsApp),
                validaciones, formularios, formato, contador, config
```

## Configuración

El número de WhatsApp del local se cambia en `recursos/js/modulos/config.js`
(formato internacional, sin `+`: por ejemplo `5493511234567`).

## Tests unitarios

Se usa el test runner nativo de Node (`node:test` y `node:assert`), sin instalar nada:

```
npm test
```

Los tests están en la carpeta `test/` y cubren: `formato.js`, `validaciones.js`, `filtrarProductos` (catálogo), `carritoDatos.js`, `mensajeria.js` y la integridad de los JSON y las imágenes.

## CI/CD con GitHub Actions

El workflow está en `.github/workflows/ci-cd.yml`, que tiene que estar en la **raíz del repositorio** (GitHub solo lee los workflows de ahí, no de una subcarpeta):

1. **test:** en cada push y pull request a `main` ejecuta `npm test`.
2. **deploy:** si los tests pasan y es un push a `main`, publica en producción en Vercel con la CLI (`vercel pull`, `vercel build`, `vercel deploy --prebuilt`).

Como el despliegue lo hace el workflow, `vercel.json` desactiva los despliegues automáticos de Git (`git.deploymentEnabled: false`) para que Vercel no publique antes de que pasen los tests.

Secrets que hay que cargar en GitHub (*Settings → Secrets and variables → Actions → New repository secret*):

- `VERCEL_TOKEN`: se crea en vercel.com/account/tokens.
- `VERCEL_ORG_ID` y `VERCEL_PROJECT_ID`: están en `.vercel/project.json` después de correr `vercel link` en la raíz del repositorio (también se ven en la configuración del proyecto y del equipo en Vercel).

## Publicación (GitHub + Vercel)

1. Subir esta carpeta a un repositorio de GitHub (con `index.html` en la raíz).
2. En vercel.com → *Add New… → Project* → importar el repositorio.
3. *Framework Preset*: **Other**. No hace falta comando de build ni carpeta de salida.
4. *Deploy*. Cada `git push` a la rama principal vuelve a publicar el sitio.
