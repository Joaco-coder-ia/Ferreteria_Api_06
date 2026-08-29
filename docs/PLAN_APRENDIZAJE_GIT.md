# Plan seguro para aprender Git, commits y pull requests

## Objetivo

Reconstruir el proyecto con tus propias manos, entender cada cambio y dejar un historial auténtico. No se deben falsificar fechas, autores ni avances. Los commits serán reales desde el momento en que tú escribas y compruebes cada parte.

## Lo que no conviene hacer

- No borrar la única copia completa.
- No trabajar directamente sobre una rama estable sin respaldo.
- No hacer un único commit gigante.
- No crear commits sólo para que el historial parezca más largo.
- No copiar todo de una vez sin comprobarlo.
- No usar git push con force.
- No eliminar ramas hasta verificar que su contenido está respaldado.

## Estrategia recomendada

El repositorio puede conservar dos líneas de trabajo:

- main: construcción progresiva que presentarás.
- respaldo/version-completa: referencia terminada que nunca se modifica.

Como el repositorio fue creado vacío, es posible preparar main como base mínima desde el comienzo y subir la solución actual solamente a respaldo/version-completa. Así no es necesario borrar el historial de main ni fingir que la versión completa nunca existió.

La carpeta original completa del computador también se conserva. No se elimina ningún archivo.

## Base mínima sugerida para main

- README con objetivo y alcance.
- .gitignore.
- Carpetas data y docs cuando tengan contenido.
- index.html con doctype y estructura básica.
- styles.css con comentario de inicio.
- app.js con comentario de inicio.

## Ciclo real de trabajo

Para cada parte:

1. Actualizar main.
2. Crear una rama de funcionalidad.
3. Escribir una parte pequeña.
4. Probarla en Live Server.
5. Revisar git diff.
6. Crear un commit descriptivo.
7. Subir la rama.
8. Abrir un pull request hacia main.
9. Explicar qué cambió y cómo se probó.
10. Fusionar sólo cuando la parte funcione.

## Pull requests sugeridos

### PR 1 — Estructura HTML inicial

Rama: feature/estructura-html

Incluye:

- head y metadatos.
- header y navegación.
- main y vistas vacías.
- footer.
- vínculo a CSS y JavaScript.

Commit sugerido:

    feat: crear estructura semántica inicial

### PR 2 — Portada y catálogo estático

Rama: feature/portada-catalogo

Incluye:

- portada.
- beneficios.
- formulario de filtros.
- contenedor de productos.

Commits sugeridos:

    feat: construir portada de la ferretería
    feat: agregar estructura del catálogo y filtros

### PR 3 — Estilos base y navegación adaptable

Rama: feature/estilos-responsive

Incluye:

- variables CSS.
- estilos generales.
- encabezado.
- portada.
- media queries.

Commits sugeridos:

    style: definir paleta y estilos generales
    style: adaptar navegación para móvil y escritorio

### PR 4 — Datos y carga del catálogo

Rama: feature/datos-productos

Incluye:

- productos.json.
- fetch.
- estado products.
- creación de tarjetas.

Commits sugeridos:

    data: agregar catálogo local de productos
    feat: cargar y mostrar productos desde JSON

### PR 5 — Búsqueda, categorías y detalle

Rama: feature/filtros-detalle

Incluye:

- búsqueda.
- filtro de categoría.
- filtro de stock.
- detalle por código.

Commits sugeridos:

    feat: filtrar catálogo por texto y categoría
    feat: agregar vista de detalle de producto

### PR 6 — Carrito

Rama: feature/carrito

Incluye:

- agregar productos.
- contador.
- edición de cantidades.
- cálculo del total.
- retiro o despacho.

Commits sugeridos:

    feat: implementar carrito y contador
    feat: calcular totales y tipo de entrega

### PR 7 — Acceso, registro y cuenta

Rama: feature/cuenta-cliente

Incluye:

- perfiles demo.
- validación de login.
- registro simulado.
- cuenta e historial.

Commits sugeridos:

    feat: agregar acceso con perfiles demostrativos
    feat: incorporar registro y vista de cuenta

### PR 8 — Persistencia y terminaciones

Rama: feature/persistencia-calidad

Incluye:

- localStorage.
- estados vacíos.
- mensajes de error.
- foco visible.
- documentación final.

Commits sugeridos:

    feat: conservar sesión carrito y pedidos localmente
    fix: mejorar estados vacíos y accesibilidad
    docs: completar guía de ejecución y presentación

## Cómo escribir un buen commit

Un commit debe representar una unidad de trabajo completa y comprobada.

Formato recomendado:

    tipo: descripción breve en infinitivo

Tipos útiles:

| Tipo | Uso |
|---|---|
| feat | Nueva funcionalidad. |
| fix | Corrección de un error. |
| style | Cambio visual o de formato sin nueva lógica. |
| docs | Documentación. |
| refactor | Orden interno sin cambiar el resultado. |
| test | Pruebas. |
| data | Datos del catálogo. |
| chore | Configuración o mantenimiento. |

Antes de confirmar:

    git status
    git diff
    git add archivo-especifico
    git diff --staged
    git commit -m "feat: agregar búsqueda de productos"

Agregar archivos específicos ayuda a evitar que un commit mezcle tareas distintas.

## Plantilla de pull request

    ## Qué incorpora

    - Cambio 1.
    - Cambio 2.

    ## Cómo funciona

    Explicación breve con tus propias palabras.

    ## Cómo lo probé

    1. Abrí el proyecto con Live Server.
    2. Ejecuté el flujo correspondiente.
    3. Verifiqué el resultado esperado.

    ## Evidencia

    Captura de pantalla si corresponde.

    ## Pendiente

    Indicar claramente lo que todavía falta.

## Regla de aprendizaje

Antes de usar una línea del respaldo, intenta escribirla sin mirar. Si te bloqueas:

1. Consulta el informe.
2. Busca solamente la función relacionada.
3. Lee la línea.
4. Cierra la referencia.
5. Escríbela con tus propias manos.
6. Explica verbalmente qué recibe, qué hace y qué devuelve.
7. Pruébala.

## Resultado esperado

Al finalizar, main tendrá una historia progresiva y auténtica. La rama de respaldo seguirá disponible por seguridad. Cada pull request tendrá una función concreta, evidencia de prueba y una explicación escrita por ti.
