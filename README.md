# Ferretería Los Maestros

Proyecto frontend desarrollado para la Evaluación Parcial 1 de la asignatura
**DSY1104 - Desarrollo Fullstack II**.

## Descripción

Ferretería Los Maestros corresponde a la interfaz web de una tienda de
productos de ferretería. El proyecto busca ofrecer una navegación clara,
presentar un catálogo de productos y permitir la interacción del usuario con
formularios y un carrito de compras simulado.

La solución se desarrolla exclusivamente en el frontend. No utiliza backend,
base de datos ni pagos reales.

## Tecnologías

- HTML5 para la estructura semántica del contenido.
- CSS3 externo para la presentación y el diseño adaptable.
- JavaScript ES6+ para la interacción, validaciones y manejo de datos.
- JSON como fuente local del catálogo de productos.
- Git y GitHub para el control de versiones y el trabajo colaborativo.

## Alcance funcional

El proyecto contempla las siguientes funcionalidades:

- Página de inicio de la tienda.
- Catálogo y detalle de productos.
- Búsqueda y filtrado de productos.
- Carrito de compras simulado.
- Inicio de sesión y registro de usuarios.
- Formularios validados mediante JavaScript.
- Persistencia local de información no sensible mediante `localStorage`.
- Interfaz adaptable para computador, tablet y teléfono móvil.
- Vistas administrativas para la gestión simulada de productos y usuarios.

## Estructura del proyecto

```text
Ferreteria_Api_06/
├── index.html
├── productos.html
├── producto.html
├── carrito.html
├── contacto.html
├── ingreso.html
├── registro.html
├── cuenta.html
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── app.js
│   │   ├── catalogo.js
│   │   └── validaciones.js
│   └── img/
│       ├── construccion.svg
│       ├── electricidad.svg
│       ├── gasfiteria.svg
│       ├── herramientas.svg
│       ├── jardin.svg
│       ├── madera.svg
│       ├── pinturas.svg
│       ├── seguridad.svg
│       └── tornilleria.svg
├── data/
│   └── productos.json
└── README.md
```

- `index.html`: contiene solamente la página de inicio.
- `productos.html`: contiene el catálogo y sus filtros.
- `producto.html`: muestra el detalle del producto seleccionado.
- `carrito.html`: muestra los productos agregados y confirma pedidos simulados.
- `contacto.html`: contiene el formulario de contacto.
- `ingreso.html`: contiene el formulario de inicio de sesión.
- `registro.html`: contiene el formulario de registro simulado.
- `cuenta.html`: muestra el perfil y el panel correspondiente a cada rol.
- `assets/css/styles.css`: reúne los estilos y las reglas responsive.
- `assets/js/app.js`: contiene la navegación y los paneles de usuario.
- `assets/js/catalogo.js`: contiene la lógica de productos y carrito.
- `assets/js/validaciones.js`: contiene las validaciones de formularios.
- `assets/img/`: contiene las imágenes locales del catálogo.
- `data/productos.json`: almacena los datos locales de los productos.

## Ejecución local

1. Descargar o clonar el repositorio.
2. Abrir la carpeta del proyecto en Visual Studio Code.
3. Instalar la extensión **Live Server**.
4. Abrir `index.html` y seleccionar **Open with Live Server**.

También puede utilizarse cualquier servidor web estático. Se recomienda no
abrir el archivo únicamente con doble clic, porque la carga del archivo JSON
puede ser bloqueada por el navegador.

## Consideraciones

- La autenticación corresponde a una simulación frontend.
- No deben ingresarse contraseñas ni datos personales reales.
- El carrito y la sesión simulada pueden almacenarse localmente en el navegador.
- El proyecto no procesa compras, pagos ni despachos reales.

## Integrantes

-
-
-

## Institución

Duoc UC - Escuela de Informática y Telecomunicaciones.
