# Ferretería Los Maestros Frontend React

Aplicación web de comercio electrónico desarrollada para la Evaluación Parcial 2 de Desarrollo FullStack II. El frontend migra las vistas de la primera evaluación a React y Vite, incorpora React Bootstrap, persistencia local, CRUD de productos y pruebas unitarias con Vitest.

## Requisitos

- Node.js 20 o superior.
- npm 10 o superior, o pnpm compatible.

## Instalación y ejecución

```powershell
npm install
npm run dev
```

Vite mostrará la dirección local, normalmente `http://localhost:5173`.

## Pruebas

```powershell
npm test
npm run test:run
npm run coverage
```

- `npm test` mantiene Vitest en modo vigilancia.
- `npm run test:run` ejecuta toda la batería una vez.
- `npm run coverage` genera el informe de cobertura en `coverage/index.html`.

La versión validada contiene 41 pruebas distribuidas en 11 archivos. Se prueban props, eventos, estado, renderizado condicional, rutas protegidas, filtros, carrito, checkout, CRUD, persistencia y servicios simulados.

## Arquitectura

La carpeta `src` aplica Atomic Design y el patrón Container/Presentational:

```text
src/
├── components/
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   ├── templates/
│   └── pages/
├── containers/
├── data/
├── services/
├── test/
├── utils/
├── App.jsx
├── main.jsx
└── setupTests.js
```

Los componentes presentacionales reciben datos mediante props y comunican acciones con callbacks. Los containers administran estado, efectos y acceso a datos. El catálogo local simula la base de datos y se persiste mediante `localStorage`.

## Funcionalidades

- Catálogo con búsqueda, categorías, stock y ofertas.
- Detalle de producto y carrito persistente.
- Checkout con vistas de compra exitosa y fallida.
- Registro, acceso por perfiles y rutas protegidas.
- Cuenta del contratista e historial de pedidos.
- Inventario para vendedor y administración para el rol administrador.
- CRUD local de productos con persistencia.

## Accesos de demostración

| Perfil | Correo | Contraseña |
| --- | --- | --- |
| Administrador | admin@losmaestros.cl | demo123 |
| Vendedor | vendedor@losmaestros.cl | demo123 |
| Contratista | contratista@demo.cl | demo123 |

La autenticación y el pago son simulaciones frontend apropiadas para esta etapa del proyecto. La integración con servicios REST se habilita mediante variables de entorno cuando el backend esté disponible.
