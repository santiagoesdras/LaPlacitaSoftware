# Requisitos del parcial: La Placita

Este archivo resume el documento del examen como requisitos verificables. No
contiene código de la entrega anterior.

## Producto

- Sitio de una sola página para el Comedor La Placita.
- Experiencia mobile-first sin desbordamientos ni contenido amontonado.
- Jerarquía visual coherente y apariencia seria.
- Menú editable desde `public/data/menu.json`.
- Filtro del menú por categoría.
- Estados visibles y comprensibles durante la carga y cuando ocurra un error.
- Formulario de contacto o reserva con campos obligatorios y validación de email.

## Accesibilidad

- Estructura semántica con `header`, `nav`, `main`, `section` y `footer`.
- Jerarquía correcta de encabezados.
- Enlace para saltar al contenido principal.
- Navegación completa con teclado y foco visible.
- Texto alternativo útil para imágenes informativas.
- Etiquetas visibles para todos los controles del formulario.
- Contraste suficiente y respeto a `prefers-reduced-motion`.
- Mensajes de carga, error y validación anunciables por tecnologías de asistencia.

## React y datos

- Implementar el menú como componente de React.
- Obtener los datos con `fetch` dentro de `src/components/Menu.jsx`, siguiendo
  el patrón utilizado en clase.
- Administrar platos, categoría, carga y error con estado de React.
- Realizar la carga dentro de `useEffect` con `[]` para ejecutarla al montar.
- Manejar claramente las tres caras: cargando, error y datos.

## Calidad

- Mantener el proyecto en JavaScript con archivos `.jsx`, como la base de clase.
- Ejecutar `npm run lint`, `npm run test` y `npm run build` antes de cada PR.
- Conservar al menos una prueba significativa con Vitest y Testing Library; al
  implementar el menú, cubrir como mínimo el renderizado o el filtro.
- Trabajar mediante ramas y Pull Requests siguiendo `GUIAREPOSITORIO.MD`.

## Alcance actual de la base

La configuración, estructura semántica, estilos fundamentales, archivo de
datos y entorno de pruebas ya están preparados. El diseño
visual final, el menú interactivo y el formulario se dejaron intencionalmente
como puntos de implementación para el equipo.
