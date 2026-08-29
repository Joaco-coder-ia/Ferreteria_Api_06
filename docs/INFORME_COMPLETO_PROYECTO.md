# Informe completo — Ferretería Los Maestros EP1

## 1. Identificación del proyecto

- Asignatura: DSY1104 — Full Stack II.
- Entrega: Evaluación Parcial 1, enfocada en frontend.
- Nombre: Ferretería Los Maestros.
- Tipo: aplicación web de una sola página simulada.
- Tecnologías: HTML5, CSS3 y JavaScript ES6+.
- Datos: archivo local data/productos.json.
- Persistencia: localStorage del navegador.
- Entorno recomendado: Visual Studio Code con Live Server.
- Dependencias: ninguna.
- Backend: no incluido en esta entrega.
- Base de datos: no incluida en esta entrega.

## 2. Objetivo

El proyecto permite que una persona consulte los productos de una ferretería, filtre el catálogo, revise cada producto, agregue unidades al carrito, seleccione una forma de entrega, confirme un pedido simulado y consulte su cuenta. Todo se ejecuta dentro del navegador.

La aplicación cumple una función demostrativa: enseña la interfaz y el comportamiento esperado antes de conectar una API real. Por eso las operaciones se guardan localmente y no llegan a un servidor.

## 3. Alcance y límites

### Incluido

- HTML semántico.
- Hoja de estilos externa.
- Diseño adaptable.
- Manipulación del DOM.
- Eventos de clic, cambio, entrada y envío.
- Lectura asíncrona de JSON con fetch.
- Arreglos, objetos, funciones, condiciones y ciclos.
- Búsqueda y filtros.
- Carrito y cálculo de total.
- Perfiles de demostración.
- Registro visual.
- Persistencia local.
- Accesibilidad básica.

### No incluido

- Peticiones a una API real.
- Spring Boot.
- MySQL.
- Contraseñas cifradas.
- Autorización real por roles.
- Pago electrónico.
- Descuento automático de inventario.
- Envío de correos.
- Panel CRUD conectado a base de datos.

Estos límites no son fallas de la EP1: corresponden a etapas posteriores del proyecto full stack.

## 4. Arquitectura general

El flujo principal es:

    index.html crea la estructura visible
          ↓
    styles.css define presentación y adaptación
          ↓
    app.js escucha acciones y modifica el DOM
          ↓
    productos.json entrega los datos del catálogo
          ↓
    localStorage conserva carrito, pedidos y sesión

No hay varias páginas HTML. Las secciones funcionan como vistas: JavaScript coloca o quita el atributo hidden para mostrar una sola vista principal a la vez.

## 5. Estructura de carpetas

    frontend-ep1/
    ├── .vscode/
    │   └── extensions.json
    ├── data/
    │   └── productos.json
    ├── docs/
    │   ├── INFORME_COMPLETO_PROYECTO.md
    │   └── PLAN_APRENDIZAJE_GIT.md
    ├── .gitignore
    ├── app.js
    ├── index.html
    ├── README.md
    └── styles.css

### Función de cada archivo

| Archivo | Función |
|---|---|
| index.html | Estructura, contenido, formularios, navegación y contenedores dinámicos. |
| styles.css | Colores, tamaños, distribución, tarjetas, formularios y responsive. |
| app.js | Datos en memoria, funciones, navegación, filtros, carrito, login y eventos. |
| data/productos.json | Catálogo local con 85 productos. |
| README.md | Presentación rápida, ejecución y credenciales de demostración. |
| .vscode/extensions.json | Recomienda Live Server al abrir la carpeta en VS Code. |
| .gitignore | Evita subir archivos temporales o ajenos a la entrega. |
| docs/INFORME_COMPLETO_PROYECTO.md | Documento técnico y material de exposición. |
| docs/PLAN_APRENDIZAJE_GIT.md | Estrategia segura para reconstruir el proyecto con Git. |

## 6. Cómo ejecutar correctamente

1. Abrir la carpeta frontend-ep1 en Visual Studio Code.
2. Abrir index.html.
3. Instalar Live Server si VS Code lo recomienda.
4. Presionar Go Live.
5. Esperar que el navegador abra una dirección similar a http://127.0.0.1:5500.

No se debe abrir index.html solamente con doble clic cuando se quiera probar fetch. Algunos navegadores bloquean la lectura del JSON bajo el protocolo file. Live Server crea el servidor HTTP local necesario.

No se debe ejecutar pnpm install ni pnpm dev para esta versión. Esos comandos pertenecen a proyectos que usan Node, Vite o React.

## 7. HTML explicado por líneas

Las líneas mencionadas corresponden a la versión ordenada de index.html. Las líneas vacías sólo separan bloques visualmente. Las etiquetas de cierre con barra indican dónde termina el elemento abierto anteriormente.

### Líneas 1 a 12: documento y cabecera

- Línea 1: doctype informa al navegador que el documento usa HTML5.
- Línea 2: html es el elemento raíz; lang igual a es indica contenido en español.
- Línea 3: head abre los metadatos que no forman parte del contenido principal.
- Línea 4: charset UTF-8 permite tildes, eñes y símbolos.
- Línea 5: viewport hace que el ancho se adapte al dispositivo.
- Líneas 6 a 9: description entrega un resumen para buscadores y accesibilidad contextual.
- Línea 10: title define el texto de la pestaña.
- Línea 11: link conecta styles.css; rel igual a stylesheet indica que es una hoja de estilos.
- Línea 12: cierra head.

### Líneas 14 a 47: encabezado

- body contiene todo lo que se ve o ejecuta en la página.
- El comentario de la línea 15 identifica el bloque para quien lee el código.
- header representa la cabecera semántica.
- La clase site-header permite aplicarle estilos.
- El enlace brand vuelve a la vista inicio.
- href mantiene un destino entendible aun sin estilos.
- data-view es un atributo personalizado que JavaScript utiliza para navegar.
- aria-label explica el enlace a tecnologías de asistencia.
- brand-mark contiene el símbolo de la casa.
- aria-hidden evita que un lector de pantalla lea un símbolo decorativo.
- strong destaca el nombre y small presenta el subtítulo.
- menu-button controla la navegación en pantallas pequeñas.
- type button impide que el botón se comporte como envío de formulario.
- aria-expanded comienza en false porque el menú móvil está cerrado.
- aria-controls relaciona el botón con main-nav.
- nav identifica la navegación principal.
- Cada enlace posee un data-view que coincide con una vista de la página.
- cart-count es el contador que JavaScript actualiza.

### Líneas 50 a 96: vista de inicio

- main es el contenido principal.
- id app permite enfocarlo desde JavaScript.
- tabindex igual a -1 permite foco programático sin agregarlo al orden normal del teclado.
- section con id view-inicio es la portada.
- Las clases view y hero-view separan comportamiento y estilo.
- hero-copy agrupa el mensaje principal.
- eyebrow es una frase breve decorativa.
- h1 es el título más importante de la aplicación.
- button-row agrupa llamados a la acción.
- button-primary identifica la acción principal.
- button-outline identifica una acción secundaria sobre fondo oscuro.
- aside representa información complementaria.
- aria-label explica el resumen.
- hero-total, hero-categories y hero-stock reciben cifras desde app.js.
- La raya inicial sirve como valor temporal mientras carga el JSON.

### Líneas 98 a 120: beneficios

- data-home-only marca una sección visible solamente en inicio.
- feature-grid es la cuadrícula de tres beneficios.
- Cada article es una pieza independiente.
- Los números 01, 02 y 03 ordenan visualmente los conceptos.
- Los h3 nombran cada beneficio.
- Los párrafos explican stock, pedido y origen de datos.

### Líneas 122 a 154: catálogo

- hidden evita que la vista aparezca al cargar la página.
- catalog-status comunica carga, cantidad o error.
- filter-form agrupa controles relacionados.
- novalidate evita validaciones automáticas innecesarias en filtros.
- label y for relacionan el texto con cada control.
- search es un input de búsqueda.
- placeholder muestra un ejemplo, pero no reemplaza al label.
- select presenta las categorías.
- La opción Todas permite quitar el filtro de categoría.
- stock-only es un checkbox booleano.
- product-grid parte vacío porque JavaScript crea sus tarjetas.

### Líneas 156 a 163: detalle

- view-detalle contiene la ficha de un producto.
- narrow limita el ancho para mejorar la lectura.
- El botón Volver usa data-view para regresar al catálogo.
- product-detail es llenado con innerHTML cuando se selecciona un código.

### Líneas 164 a 171: carrito

- view-carrito contiene el encabezado y cart-content.
- cart-content parte vacío.
- JavaScript decide si muestra carrito vacío, artículos o confirmación.

### Líneas 173 a 210: acceso

- auth-card crea una tarjeta de autenticación.
- demo-users contiene tres botones que rellenan el formulario.
- data-demo identifica la clave del perfil en el objeto demoUsers.
- login-form agrupa correo, contraseña, error y envío.
- type email activa una validación de formato.
- type password oculta visualmente los caracteres.
- required marca campos obligatorios.
- login-error usa role alert para comunicar un error.
- hidden lo mantiene oculto mientras no exista un problema.
- La clave demo se informa porque no existe autenticación real.
- link-button lleva al formulario de registro.

### Líneas 212 a 244: registro

- register-form captura nombre, correo y contraseña.
- minlength igual a 6 exige seis caracteres como mínimo.
- register-message es un área de mensajes de estado.
- role status permite anunciar cambios sin tratarlos como una alarma crítica.
- El registro es simulado: deja activa una cuenta local, pero no crea un registro en servidor.

### Líneas 246 a 254: cuenta

- view-cuenta presenta perfil e historial.
- account-content parte vacío.
- JavaScript muestra un aviso si no hay sesión o dos tarjetas si la sesión existe.

### Líneas 256 a 265: pie y JavaScript

- footer contiene nombre, contexto académico y ubicación.
- script carga app.js al final del body.
- Al estar al final, los elementos HTML ya existen cuando JavaScript intenta seleccionarlos.
- Las últimas etiquetas cierran body y html.

## 8. CSS explicado por secciones y propiedades

CSS sigue la forma selector, llaves y declaraciones. Un selector elige elementos; cada declaración tiene propiedad, dos puntos, valor y punto y coma. Las llaves delimitan el conjunto de declaraciones.

### Líneas 1 a 60: variables y base

- :root representa el nivel superior y almacena variables reutilizables.
- --ink es el verde oscuro del texto.
- --deep es el fondo principal del encabezado y pie.
- --green es el color de acciones secundarias.
- --cream es el fondo general.
- --paper es el fondo de tarjetas.
- --yellow es el color de acción principal.
- --coral se usa en etiquetas pequeñas.
- --line es el borde suave.
- --muted es el texto secundario.
- font-family define Arial y alternativas del sistema.
- var permite reutilizar una variable, por ejemplo var(--ink).
- El selector universal aplica box-sizing border-box a todos los elementos.
- border-box hace que padding y borde estén incluidos en el ancho.
- scroll-behavior smooth suaviza desplazamientos.
- min-width evita una composición inferior a 320 píxeles.
- margin 0 elimina el margen predeterminado del navegador.
- button, input y select heredan la tipografía.
- :focus-visible crea un contorno cuando se navega con teclado.
- :disabled reduce opacidad y muestra cursor no permitido.
- Los selectores con hidden fuerzan display none.

### Líneas 63 a 156: encabezado y navegación

- position sticky mantiene el encabezado visible al desplazarse.
- top 0 lo fija al borde superior.
- z-index 5 hace que quede delante del contenido.
- display flex coloca marca y controles en una fila.
- align-items center alinea verticalmente.
- justify-content space-between separa los extremos.
- padding usa 5 por ciento para adaptarse al ancho.
- .brand combina icono y texto con gap.
- text-decoration none quita el subrayado del logotipo.
- .brand-mark usa display grid y place-items center para centrar el símbolo.
- border-radius redondea esquinas.
- .main-nav empieza con display none en móvil.
- position absolute ubica el menú bajo el encabezado.
- .main-nav.is-open aparece cuando JavaScript agrega esa clase.
- :hover cambia enlaces a amarillo.
- .menu-button mantiene fondo transparente y borde visible.
- .badge usa un radio alto para formar una cápsula.

### Líneas 159 a 285: portada

- .hero-view usa grid y un degradado de fondo.
- gap separa las columnas o filas.
- .eyebrow transforma el texto a mayúsculas y aumenta el espaciado.
- h1, h2 y h3 comparten margen y altura de línea.
- clamp fija un mínimo, valor adaptable y máximo para el título.
- El combinador > elige un hijo directo.
- :not excluye el párrafo con clase eyebrow.
- flex-wrap permite que los botones bajen de línea.
- .button reúne el aspecto común de enlaces y botones.
- .button-primary y .button-outline representan jerarquía visual.
- .hero-summary usa un blanco con transparencia hexadecimal.
- .summary-grid crea dos columnas iguales.

### Líneas 288 a 464: secciones y catálogo

- max-width 1200px limita el contenido en pantallas grandes.
- margin auto centra horizontalmente.
- Varios selectores separados por comas comparten estilo de tarjeta.
- line-height 1.5 mejora lectura de párrafos.
- .filter-bar es una cuadrícula que comienza en una columna.
- Los controles usan width 100 por ciento para ocupar su celda.
- .check-label cambia a flex para alinear casilla y texto.
- .product-grid usa auto-fit para crear tantas columnas como quepan.
- minmax evita tarjetas menores a 220 píxeles.
- .product-card usa flex-direction column.
- margin-top auto empuja el precio hacia abajo y alinea tarjetas.
- .small-button da estilo a botones generados por JavaScript.
- .narrow limita formularios y detalle.

### Líneas 467 a 524: carrito

- .cart-layout es una cuadrícula que cambia de columnas en tablet.
- .cart-item usa flex para separar descripción y cantidad.
- white-space nowrap evita cortar el subtotal.
- .quantity-input limita el ancho del número.
- height max-content evita que el resumen se estire.
- .summary-total separa nombre y valor total.
- fieldset sin borde agrupa opciones de entrega semánticamente.

### Líneas 527 a 598: acceso y cuenta

- .auth-card centra y limita los formularios.
- .demo-users crea tres columnas.
- .is-selected marca el usuario elegido.
- .auth-card form usa grid para ordenar campos.
- .form-error muestra errores en rojo.
- .form-message presenta estados con fondo verde suave.
- .form-message.is-error cambia el mensaje a colores de error.
- .account-grid distribuye tarjetas de cuenta.
- .empty usa borde discontinuo para estados sin contenido.

### Líneas 601 a 616: pie

- .site-footer utiliza fondo oscuro y texto claro.
- display grid apila las tres líneas.
- strong resalta el nombre de la ferretería.

### Líneas 619 a 669: media queries

- @media aplica reglas sólo desde un ancho mínimo.
- Desde 600px la portada tiene dos columnas.
- Los beneficios tienen tres columnas.
- Los filtros se ordenan en tres espacios.
- El carrito divide productos y resumen.
- La cuenta muestra dos tarjetas.
- Desde 900px se oculta el botón del menú.
- La navegación pasa a ser una fila visible.
- La portada recibe mayor espacio vertical.
- El título alcanza 76 píxeles.

El enfoque es mobile first: primero se diseñan pantallas pequeñas y luego se agregan mejoras para anchos mayores.

## 9. JavaScript explicado por líneas y lógica

### Líneas 1 a 22: usuarios de demostración

- const crea una referencia que no será reasignada.
- demoUsers es un objeto con tres propiedades: admin, vendedor y cliente.
- Cada propiedad contiene otro objeto.
- name es el nombre visible.
- email identifica al perfil.
- role indica su rol demostrativo.
- Las comas separan propiedades.
- Las llaves cierran cada objeto.

### Líneas 25 a 38: loadLocalData

- La palabra function declara una función reutilizable.
- key es el nombre que se buscará en localStorage.
- fallbackValue es el valor alternativo.
- localStorage.getItem devuelve texto o null.
- Si el resultado es null, la función devuelve el valor alternativo.
- try intenta convertir el texto JSON a un dato JavaScript.
- JSON.parse realiza esa conversión.
- catch se ejecuta si el texto guardado está dañado.
- console.warn ayuda a diagnosticar el problema.
- return entrega el resultado y termina la función.

### Líneas 41 a 46: estado

- state concentra datos variables.
- products comienza como arreglo vacío y se llena con fetch.
- cart recupera ep1-cart o usa un arreglo vacío.
- orders recupera ep1-orders o usa un arreglo vacío.
- user recupera ep1-user o usa null.
- null representa ausencia de sesión.

### Líneas 49 a 75: auxiliares

- La función flecha $ envuelve document.querySelector.
- Un selector como #search busca por id.
- formatMoney usa Intl.NumberFormat.
- es-CL define formato chileno.
- currency CLP define pesos chilenos.
- maximumFractionDigits igual a cero elimina decimales.
- saveState usa JSON.stringify para convertir arreglos y objetos a texto.
- reduce recorre el carrito y acumula cantidades.
- sum es el acumulador.
- item es el producto actual.
- textContent actualiza el contador de manera segura.

### Líneas 78 a 117: showView

- viewName recibe el nombre de la vista.
- Si se solicita acceso con una sesión activa, se muestra cuenta.
- return evita continuar con la vista anterior.
- querySelectorAll devuelve todos los elementos con clase view.
- forEach recorre cada vista.
- hidden recibe true cuando el id no coincide.
- Los template strings permiten insertar viewName dentro de texto.
- Otro recorrido oculta elementos data-home-only fuera del inicio.
- El operador ?. ejecuta una acción sólo si el elemento existe.
- classList.remove cierra el menú móvil.
- setAttribute cambia aria-expanded.
- Las condiciones renderizan catálogo, carrito o cuenta cuando corresponde.
- focus mejora el flujo para teclado.
- scrollTo lleva la ventana al inicio suavemente.

### Líneas 120 a 154: createProductCard

- La función recibe un producto.
- El operador ternario elige texto según el stock.
- disabledAttribute contiene disabled cuando no hay unidades.
- return entrega un template string con HTML.
- Las expresiones insertan categoría, nombre, marca, unidad, precio y código.
- data-detail identifica el botón de detalle.
- data-add identifica el botón de agregar.
- type button evita envíos accidentales.
- El atributo disabled impide comprar un producto agotado.

### Líneas 157 a 192: renderCatalog

- trim elimina espacios al inicio y final.
- toLowerCase normaliza la búsqueda.
- checked obtiene true o false del checkbox.
- filter crea un nuevo arreglo.
- searchableText reúne código, nombre y marca.
- includes comprueba si contiene el término.
- matchesText, matchesCategory y matchesStock separan las reglas.
- El operador && exige que todas sean verdaderas.
- textContent informa cuántos resultados hay.
- Si no existen resultados se dibuja un estado vacío y se usa return.
- map transforma cada producto en una tarjeta HTML.
- join une las tarjetas sin comas.
- innerHTML inserta el resultado dentro de product-grid.

### Líneas 195 a 230: renderProductDetail

- find busca el primer elemento cuyo código coincide.
- Si no existe, return protege la función.
- availabilityText y disabledAttribute dependen del stock.
- innerHTML crea la ficha detallada.
- toLowerCase adapta la unidad dentro de una frase.
- Al final showView presenta la sección detalle.

### Líneas 233 a 257: addToCart

- Primero se busca el producto original.
- Se detiene si no existe o no tiene stock.
- Se busca si el producto ya está en el carrito.
- Si existe, Math.min incrementa sin superar stock.
- Si no existe, push agrega una copia con cantidad igual a uno.
- Los tres puntos copian las propiedades del producto.
- saveState persiste el cambio y actualiza el contador.

### Líneas 260 a 343: renderCart

- Si cart está vacío se muestra una invitación al catálogo.
- reduce calcula total como precio por cantidad.
- map crea un article por producto.
- El input number acepta desde cero hasta el stock máximo.
- data-quantity conserva el código del producto.
- El subtotal multiplica precio por cantidad.
- cartItemsHtml guarda el conjunto de artículos.
- El formulario order-form contiene el resumen.
- fieldset y legend agrupan las opciones de entrega.
- Dos radios comparten name delivery, por lo que sólo uno puede estar activo.
- checked selecciona retiro de manera inicial.
- El botón submit dispara el evento de confirmación.

### Líneas 346 a 366: updateCartQuantity

- quantityInput representa el control modificado.
- dataset.quantity lee data-quantity.
- Number convierte el texto del input a número.
- Math.min impide superar stock.
- Math.max impide cantidades negativas.
- filter quita productos cuya cantidad llegó a cero.
- Se guarda el estado y se vuelve a dibujar el carrito.

### Líneas 369 a 395: confirmOrder

- Se calcula nuevamente el total para usar datos actuales.
- FormData lee la opción delivery elegida.
- padStart completa el número del pedido con ceros.
- unshift agrega el pedido al comienzo del historial.
- El pedido guarda id, total y delivery.
- El carrito se reemplaza por un arreglo vacío.
- Se guarda el estado.
- cart-content cambia a un mensaje de confirmación.

### Líneas 398 a 444: renderAccount

- Si user es null se solicita iniciar sesión.
- Si hay usuario se construye ordersHtml.
- El ternario elige entre el historial y el mensaje sin pedidos.
- map transforma cada pedido en una línea.
- join con br crea saltos de línea HTML.
- La primera tarjeta muestra nombre, correo y rol.
- data-logout marca el botón de cierre de sesión.
- La segunda tarjeta muestra cantidad e historial.

### Líneas 447 a 456: fillLoginForm

- userKey puede ser admin, vendedor o cliente.
- Se obtiene el usuario correspondiente.
- Se rellenan correo y contraseña.
- classList.toggle con segundo argumento marca sólo el botón correcto.

### Líneas 459 a 478: login

- Se leen correo y contraseña.
- Object.values convierte los perfiles en un arreglo.
- find busca coincidencia de correo y clave demo.
- Si no existe, se muestra el error y se termina.
- Si existe, se oculta el error y se guarda el usuario.
- reset limpia el formulario.
- showView cuenta abre el perfil.

### Líneas 481 a 503: register

- checkValidity evalúa required, type email y minlength.
- Un formulario inválido muestra un mensaje de error.
- Un formulario válido crea un objeto local con nombre, correo y rol Cliente.
- La contraseña no se guarda.
- Se guarda la sesión, se limpia el formulario y se abre la cuenta.
- Sigue siendo una simulación porque al cerrar la sesión ese usuario no puede autenticarse nuevamente contra un servidor.

### Líneas 506 a 550: clics

- addEventListener registra una función para cada clic del documento.
- event contiene información del clic.
- closest busca el botón o enlace más cercano con el atributo solicitado.
- Este patrón funciona también con HTML creado después mediante innerHTML.
- preventDefault evita el salto normal del enlace.
- Cada if decide si navega, muestra detalle, agrega, cierra sesión, rellena login o abre el menú.
- dataset lee los atributos data.
- classList.toggle agrega o quita is-open.
- String convierte el booleano para aria-expanded.

### Líneas 552 a 574: filtros, cambios y formularios

- input actualiza mientras se escribe.
- change actualiza cuando cambia select o checkbox.
- matches comprueba si el elemento cambiado tiene data-quantity.
- submit se escucha de manera centralizada.
- event.preventDefault impide recargar la página.
- El id del formulario determina si se llama login, register o confirmOrder.

### Líneas 577 a 613: fetch y carga inicial

- fetch solicita data/productos.json por HTTP.
- then recibe la respuesta cuando finaliza la solicitud.
- response.ok confirma un estado HTTP correcto.
- throw crea un error si la respuesta falló.
- response.json convierte el cuerpo a datos JavaScript.
- El segundo then recibe el arreglo de productos.
- state.products guarda el catálogo.
- map extrae categorías.
- Set elimina duplicados.
- Los tres puntos convierten el Set nuevamente en arreglo.
- sort ordena alfabéticamente.
- map crea cada option.
- insertAdjacentHTML agrega opciones sin borrar Todas.
- textContent actualiza las tres cifras de portada.
- filter cuenta productos con stock.
- renderCatalog crea la primera lista.
- catch captura cualquier fallo y presenta un mensaje.
- console.error deja información técnica en la consola.

### Líneas 615 y 616: inicio

- El comentario explica la operación final.
- saveState actualiza el contador apenas se abre la aplicación.

## 10. Archivo productos.json

JSON significa JavaScript Object Notation. El archivo contiene un arreglo, indicado por corchetes. Cada elemento es un objeto, indicado por llaves. Las propiedades se escriben como nombre, dos puntos y valor. Los objetos se separan con comas.

El catálogo contiene:

- 85 productos.
- 85 códigos únicos.
- 9 categorías.
- Electricidad.
- Gasfitería.
- Herramientas.
- Jardín.
- Madera.
- Materiales de construcción.
- Pinturas.
- Seguridad.
- Tornillería.

### Campos de cada producto

| Campo | Tipo | Ejemplo | Uso |
|---|---|---|---|
| codigo | texto | MC001 | Identificador, búsqueda y data attributes. |
| categoria | texto | Mat. Construcción | Filtro principal. |
| subcategoria | texto | Cementos | Detalle más preciso. |
| nombre | texto | Cemento Polpaico gris 25 kg | Título visible. |
| marca | texto | Polpaico | Información y búsqueda. |
| unidad | texto | Saco | Forma de venta. |
| precioCompra | número | 3200 | Dato interno del catálogo; no se muestra al cliente. |
| precioVenta | número | 5990 | Precio visible y cálculo del total. |
| stock | número | 80 | Disponibilidad y límite del carrito. |
| stockMinimo | número | 20 | Referencia para futura gestión de inventario. |

El archivo JSON no admite comentarios. Por eso su explicación se mantiene en este informe.

## 11. localStorage

localStorage es un almacenamiento de texto asociado al sitio en el navegador. Permanece después de cerrar y volver a abrir la pestaña.

Claves utilizadas:

| Clave | Contenido |
|---|---|
| ep1-cart | Arreglo de productos y cantidades. |
| ep1-orders | Arreglo de pedidos confirmados. |
| ep1-user | Usuario con sesión activa o null. |

JSON.stringify convierte datos a texto antes de guardar. JSON.parse reconstruye los datos al leer.

Limitaciones:

- La información queda sólo en ese navegador y origen.
- El usuario puede editarla desde herramientas de desarrollo.
- No reemplaza una base de datos.
- No debe guardar información sensible real.

## 12. Flujos que se deben demostrar

### Buscar un producto

1. Abrir Catálogo.
2. Escribir una palabra, marca o código.
3. renderCatalog normaliza el texto.
4. filter selecciona coincidencias.
5. map crea tarjetas.
6. innerHTML actualiza la cuadrícula.

### Filtrar por categoría

1. Elegir una opción del select.
2. El evento change llama renderCatalog.
3. Se comparan categorías.
4. Se muestran sólo productos coincidentes.

### Agregar al carrito

1. Presionar Agregar.
2. El evento global obtiene data-add.
3. addToCart busca el producto.
4. Incrementa o inserta la cantidad.
5. saveState guarda y actualiza el contador.

### Confirmar pedido

1. Abrir Carrito.
2. Ajustar cantidades.
3. Seleccionar retiro o despacho.
4. Enviar order-form.
5. confirmOrder calcula total.
6. Crea un identificador PED-0001.
7. Guarda el pedido y vacía el carrito.

### Iniciar sesión

1. Abrir Ingresar.
2. Seleccionar un perfil demo.
3. fillLoginForm completa los campos.
4. Enviar el formulario.
5. login busca una coincidencia.
6. state.user recibe el perfil.
7. Se guarda y se muestra Mi cuenta.

## 13. Accesibilidad incluida

- Idioma español declarado.
- Estructura header, nav, main, section, article, aside y footer.
- Labels asociados a inputs.
- Botones con type explícito.
- aria-label en elementos que requieren contexto.
- aria-controls y aria-expanded en menú móvil.
- role alert para errores.
- role status para mensajes.
- Contorno visible para navegación con teclado.
- Contraste alto en navegación y botones.
- Atributo disabled para acciones sin stock.

Mejoras futuras posibles: probar con lector de pantalla, añadir un enlace para saltar al contenido y auditar contraste con herramientas automáticas.

## 14. Diseño adaptable

El sitio utiliza mobile first.

- Menos de 600px: una columna, menú desplegable, tarjetas apiladas.
- Desde 600px: portada en dos columnas, beneficios en tres, carrito dividido.
- Desde 900px: navegación horizontal y portada con mayor tamaño.

Las unidades usadas cumplen funciones diferentes:

- px: medidas controladas como bordes y tamaños mínimos.
- porcentaje: espacio adaptable al ancho.
- fr: proporciones en CSS Grid.
- vw: tamaño relacionado con la ventana.
- clamp: limita el crecimiento tipográfico.

## 15. Decisiones técnicas

- Sin frameworks para mantener el nivel de la materia.
- Un solo HTML para simplificar navegación simulada.
- CSS externo para separar presentación.
- JavaScript externo para separar comportamiento.
- JSON local para representar datos sin backend.
- localStorage para demostrar persistencia.
- Delegación de eventos para botones creados dinámicamente.
- data attributes para conectar HTML y JavaScript sin depender del texto visible.
- Funciones pequeñas para separar responsabilidades.
- Comentarios por sección para facilitar estudio.

## 16. Seguridad y honestidad técnica

La aplicación no debe presentarse como un sistema productivo. La clave demo está visible en el código y el acceso ocurre en el navegador. Esto es aceptable sólo para una maqueta académica frontend.

En una versión real:

- El servidor validaría correo y contraseña.
- La contraseña se almacenaría con hash seguro.
- El servidor emitiría una sesión o token.
- Los permisos se comprobarían en backend.
- Los precios y stock vendrían de la base de datos.
- El pedido se validaría nuevamente antes de guardarse.
- El cliente nunca recibiría precio de compra.

## 17. Pruebas recomendadas

| Prueba | Resultado esperado |
|---|---|
| Abrir con Live Server | Portada visible y resumen cargado. |
| Buscar MC001 | Aparece el cemento correspondiente. |
| Buscar una palabra inexistente | Aparece Sin resultados. |
| Elegir una categoría | Sólo aparecen productos de ella. |
| Marcar Sólo con stock | Se excluyen productos agotados. |
| Abrir detalle | Se muestra categoría, precio y disponibilidad. |
| Agregar dos unidades | Badge y carrito indican dos. |
| Cambiar cantidad a cero | Producto desaparece del carrito. |
| Confirmar retiro | Se crea un pedido y se vacía el carrito. |
| Login demo correcto | Se muestra cuenta y rol. |
| Login incorrecto | Se muestra mensaje de error. |
| Registro incompleto | Se muestra validación. |
| Registro válido | Se crea sesión local de Cliente. |
| Recargar navegador | Persisten carrito, pedidos y sesión. |
| Ancho móvil | Menú se controla con botón. |
| Navegación con Tab | El foco es visible. |

## 18. Guion breve para presentar

“Ferretería Los Maestros es una aplicación frontend creada con HTML5, CSS3 y JavaScript puro. Elegimos estas tecnologías porque corresponden al alcance de la primera evaluación. HTML define vistas semánticas, CSS aplica un diseño mobile first y JavaScript administra datos, filtros, navegación y carrito. El catálogo contiene 85 productos en un archivo JSON local. Como todavía no existe backend, carrito, pedidos y sesión se guardan en localStorage. La solución demuestra el flujo del cliente y queda preparada para conectar una API en una etapa posterior.”

Después del resumen conviene demostrar, en este orden:

1. Adaptación de menú.
2. Búsqueda por código.
3. Filtro de categoría.
4. Detalle.
5. Carrito.
6. Confirmación.
7. Login demo.
8. Historial local.

## 19. Preguntas que podrían hacer

### ¿Por qué no usaron React?

Porque esta entrega evalúa fundamentos de HTML, CSS y JavaScript. React pertenece a una solución más avanzada y no es necesario para cumplir el alcance.

### ¿Por qué hay un JSON?

Permite separar los productos del código y simular una respuesta de API sin backend.

### ¿Qué es el DOM?

Es la representación del HTML que JavaScript puede consultar y modificar.

### ¿Qué hace fetch?

Realiza una solicitud asíncrona para leer productos.json.

### ¿Qué significa asíncrono?

La operación puede tardar y el navegador continúa funcionando mientras espera. Por eso fetch devuelve una promesa y se usa then o catch.

### ¿Qué hace localStorage?

Guarda texto en el navegador para conservar el estado entre recargas.

### ¿Por qué se usa JSON.stringify?

Porque localStorage sólo almacena texto y el carrito es un arreglo de objetos.

### ¿Qué es data-view?

Es un atributo personalizado. JavaScript lo lee mediante dataset para saber qué vista abrir.

### ¿Qué diferencia hay entre id y class?

Un id identifica un elemento particular. Una clase puede repetirse y aplica comportamiento o estilo compartido.

### ¿Qué diferencia hay entre map, filter, find y reduce?

- map transforma todos los elementos.
- filter conserva los que cumplen una condición.
- find devuelve la primera coincidencia.
- reduce combina elementos en un único resultado, como un total.

### ¿Es seguro el login?

No es autenticación real; es una simulación transparente para la etapa frontend.

### ¿Cómo se conectaría un backend?

Se reemplazaría el JSON local y parte de localStorage por solicitudes fetch a endpoints de productos, usuarios y pedidos.

## 20. Orden recomendado para aprender el proyecto

1. Leer index.html y reconocer etiquetas.
2. Abrir el navegador sin JavaScript y observar la estructura.
3. Estudiar variables de color en CSS.
4. Cambiar temporalmente un color y comprobar el resultado.
5. Estudiar Grid y Flexbox.
6. Estudiar demoUsers y state.
7. Practicar querySelector y textContent.
8. Practicar funciones de catálogo.
9. Practicar map, filter, find y reduce por separado.
10. Practicar eventos y data attributes.
11. Practicar localStorage.
12. Practicar fetch y promesas.
13. Reconstruir una función por vez sin copiar.
14. Crear un commit pequeño por función terminada.

## 21. Conclusión

La solución es una maqueta frontend completa y coherente con una primera evaluación. Lo importante al presentarla es distinguir con claridad la estructura HTML, la presentación CSS, el comportamiento JavaScript, los datos JSON y la persistencia local. También se debe reconocer honestamente qué partes son simuladas y cómo evolucionarían en una aplicación full stack real.
