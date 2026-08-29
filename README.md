# Ferretería Los Maestros — EP1 Frontend

Aplicación web académica preparada para la Evaluación Parcial 1 de DSY1104. La solución utiliza únicamente **HTML5 semántico, CSS3 y JavaScript ES6+**, sin React, backend ni base de datos.

## Funcionalidades

- Portada y navegación adaptable a celular, tablet y escritorio.
- Catálogo local de 85 productos.
- Búsqueda por nombre, marca o código.
- Filtro por categoría y disponibilidad.
- Vista de detalle por producto.
- Carrito con cantidades, total y tipo de entrega.
- Inicio de sesión con perfiles de demostración.
- Registro simulado de clientes.
- Historial de pedidos guardado en localStorage.

## Estructura

    frontend-ep1/
    ├── .vscode/
    │   └── extensions.json
    ├── data/
    │   └── productos.json
    ├── docs/
    │   ├── INFORME_COMPLETO_PROYECTO.md
    │   └── PLAN_APRENDIZAJE_GIT.md
    ├── app.js
    ├── index.html
    ├── styles.css
    ├── .gitignore
    └── README.md

## Cómo ejecutar

1. Abre esta carpeta en Visual Studio Code.
2. Instala la extensión recomendada **Live Server** (ritwickdey.LiveServer).
3. Abre index.html.
4. Presiona **Go Live** en la esquina inferior derecha.

No es necesario ejecutar pnpm install, porque esta versión no usa Node.js ni paquetes externos.

## Usuarios de demostración

| Perfil | Correo | Contraseña |
|---|---|---|
| Administrador | admin@losmaestros.cl | demo123 |
| Vendedor | vendedor@losmaestros.cl | demo123 |
| Contratista | contratista@demo.cl | demo123 |

## Documentación

- [Informe técnico y guía de presentación](docs/INFORME_COMPLETO_PROYECTO.md)
- [Plan seguro para aprender Git, commits y pull requests](docs/PLAN_APRENDIZAJE_GIT.md)

## Alcance académico

Los datos, el acceso, el registro y los pedidos son simulados en el navegador. Una versión futura puede reemplazar productos.json y localStorage por una API, Spring Boot y MySQL, pero esos componentes no forman parte de esta entrega frontend.
