# Ferretería Los Maestros

Aplicación web frontend para consultar productos, preparar pedidos y administrar
de forma simulada la operación de una ferretería. El proyecto utiliza solamente
HTML5, CSS3, JavaScript y datos JSON locales.

## Funcionalidades

- Inicio comercial adaptable a computador, tablet y teléfono.
- Catálogo de 85 productos con búsqueda, categorías y filtro de stock.
- Detalle independiente para cada producto.
- Fotografías individuales para los 85 productos del catálogo.
- Carrito persistente y confirmación simulada de pedidos.
- Registro e inicio de sesión con validaciones en JavaScript.
- Cuenta de cliente y contratista con historial, gráfico de compras y calculadora.
- Panel de vendedor con filtros, prioridades, estados e inventario.
- Panel administrativo con gráficos, indicadores y gestión de usuarios y productos.
- Formulario de contacto conectado con las consultas del panel administrativo.
- Sección de consejos con guías sobre pintura y elección de herramientas.
- Persistencia local mediante `localStorage`.

## Perfiles de demostración

| Perfil | Correo | Contraseña |
|---|---|---|
| Administrador | `admin@losmaestros.cl` | `demo123` |
| Vendedor | `vendedor@losmaestros.cl` | `demo123` |
| Contratista | `contratista@demo.cl` | `demo123` |
| Usuario | `cliente@demo.cl` | `demo123` |

La autenticación es una simulación frontend. No se deben utilizar datos ni
contraseñas reales.

## Estructura

```text
Ferreteria_Api_06/
├── README.md
├── docs/
└── frontend/
    ├── index.html
    ├── tienda/
    │   ├── catalogo.html
    │   ├── producto-detalle.html
    │   ├── carrito.html
    │   ├── inicio-sesion.html
    │   ├── registro.html
    │   ├── cuenta.html
    │   ├── nosotros.html
    │   ├── blog-pintura.html
    │   ├── blog-taladro.html
    │   └── contacto.html
    ├── admin/
    │   ├── index.html
    │   ├── usuarios/
    │   │   ├── listado.html
    │   │   ├── nuevo.html
    │   │   ├── editar.html
    │   │   └── detalle.html
    │   └── productos/
    │       ├── listado.html
    │       ├── nuevo.html
    │       ├── editar.html
    │       └── detalle.html
    ├── vendedor/
    │   └── index.html
    ├── assets/
    │   ├── css/
    │   │   └── styles.css
    │   ├── js/
    │   │   ├── app.js
    │   │   ├── compartido/
    │   │   ├── tienda/
    │   │   ├── admin/
    │   │   ├── vendedor/
    │   │   └── validaciones/
    │   ├── img/
    │   │   ├── inicio/
    │   │   ├── consejos/
    │   │   └── productos/originales/
    │   └── logo/
    │       └── los-maestros.svg
    └── data/
        ├── catalogo/
        │   └── productos.json
        ├── demo/
        │   ├── usuarios.json
        │   ├── pedidos.json
        │   └── consultas.json
        └── productos.json
```

## Ejecución local

1. Abrir la carpeta `Ferreteria_Api_06` en Visual Studio Code.
2. Instalar la extensión **Live Server**.
3. Abrir `frontend/index.html`.
4. Seleccionar **Open with Live Server**.

Se recomienda utilizar Live Server porque el navegador puede bloquear la
carga de `productos.json` cuando el HTML se abre directamente con doble clic.

## Tecnologías

- HTML5 para estructura semántica.
- CSS3 para identidad visual y diseño adaptable.
- JavaScript para interacción, validaciones y perfiles.
- JSON como fuente inicial del catálogo.
- Git y GitHub para control de versiones.

## Integrantes

- Joaquin Gonzalez
- Braulio gomez
- Alejandro Maturana

## Institución

Duoc UC — Escuela de Informática y Telecomunicaciones.
