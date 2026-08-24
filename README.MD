# Comedor La Placita

Proyecto del curso de Programación Web para desarrollar el sitio del Comedor
La Placita con React, JavaScript y Vite.

## Distribución del trabajo

1. **Semántica y accesibilidad:** HTML semántico, texto alternativo en imágenes,
   etiquetas en el formulario, contraste y foco visible. Cubre la queja 2.
   Rama: `feature/accesibilidad`.
2. **Javier Gregorio — CSS responsive y diseño visual:** mobile-first,
   Grid/Flexbox, jerarquía visual y tipografía. Cubre las quejas 1 y 7.
   Rama: `feature/responsive-ui`.
3. **Sofía Paiz — menú en React:** `fetch` de `menu.json`, tarjetas de platos y
   filtro por categoría con `useState`. Cubre las quejas 3 y 4.
   Rama: `feature/menu-react`.
4. **Ricardo Guerra — estados y prueba:** estados de carga/error con `useEffect`
   y prueba con Vitest. Cubre las quejas 5 y 8.
   Rama: `feature/estados-y-test`.
5. **Esdras Santiago y Guillermo Contreras — formulario y coordinación Git:**
   validación del formulario de contacto, carta a Don Chente y coordinación del
   orden de integración. Cubre la queja 6. Rama: `feature/formulario`.
6. **Esdras Santiago — menú actualizable:** conexión futura con Google Sheets o,
   si el tiempo lo permite, Supabase.

## Requisitos

- Node.js 18 o posterior.
- npm.

## Primer uso

```bash
npm install
npm run dev
```

Vite mostrará en la terminal la dirección local del proyecto.

## Comandos disponibles en la base

```bash
npm run dev       # servidor de desarrollo
npm run build     # compilación para producción
npm run preview   # vista previa de la compilación
```

Las ramas de pruebas y control de calidad añadirán sus propios comandos cuando
se integren.

## Estructura prevista

```text
public/
  data/menu.json          Datos editables del menú
  images/menu/            Fotografías de los platos
src/
  main.jsx                Arranque de React
  App.jsx                 Composición de la página
  index.css               Estilos globales y responsive
  components/             Componentes de la página
```

## Criterios generales

- Mantener una jerarquía clara de encabezados y elementos HTML semánticos.
- Proporcionar texto alternativo útil para todas las imágenes informativas.
- Asociar una etiqueta visible con cada control de formulario.
- Verificar navegación por teclado, foco visible, contraste y reducción de movimiento.
- Diseñar primero para pantallas pequeñas.
- Mantener el contenido del menú fuera de los componentes de React.
- Incorporar cada funcionalidad mediante una rama y un Pull Request según
  `GUIAREPOSITORIO.MD`.

El inventario completo del examen se encuentra en `docs/REQUISITOS.md`.
