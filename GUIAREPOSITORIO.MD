# Guía de trabajo con Git y GitHub — La Placita

Esta guía explica el flujo de trabajo del repositorio desde cero. Está pensada para quienes están empezando a utilizar Git.

## 1. La idea principal

En este proyecto utilizamos las siguientes ramas:

- `main`: contiene la versión estable. Está protegida y requiere **2 aprobaciones** para integrar cambios.
- `dev`: contiene los cambios que se están integrando y probando. Está protegida y requiere **1 aprobación**.
- Ramas de trabajo: se crea una por cada funcionalidad, corrección u otro cambio.

```text
main (versión estable)
  ↑ Pull Request + 2 aprobaciones
dev (integración y pruebas)
  ↑ Pull Request + 1 aprobación
feature/..., fix/..., refactor/..., docs/..., test/...
```

> **Regla más importante:** nunca se debe trabajar directamente ni hacer `push` a `main` o `dev`. Todo cambio llega mediante un Pull Request (PR), y nada llega a `main` sin pasar primero por `dev`.

---

## 2. Nombres de las ramas

El nombre debe indicar el tipo de cambio y describirlo brevemente. Utiliza minúsculas y guiones medios; no uses espacios, tildes ni `ñ`.

| Tipo | Cuándo se usa | Ejemplo |
|---|---|---|
| `feature/` | Nueva funcionalidad | `feature/login` |
| `fix/` | Corrección de un error | `fix/login-validation` |
| `refactor/` | Cambio interno sin modificar el comportamiento | `refactor/user-service` |
| `docs/` | Documentación | `docs/api-documentation` |
| `test/` | Pruebas | `test/login` |

Una rama debe atender un solo objetivo. Si el trabajo no está relacionado, debe ir en otra rama y otro PR.

---

## 3. Preparación inicial (solo la primera vez)

### 3.1 Configurar tu identidad

Git utiliza estos datos para identificar tus commits:

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu-correo@ejemplo.com"
```

### 3.2 Clonar el repositorio

```bash
git clone https://github.com/santiagoesdras/LaPlacitaSoftware.git
cd LaPlacitaSoftware
git switch dev
git pull --ff-only origin dev
```

El último comando descarga la versión más reciente de `dev`.

---

## 4. Flujo principal: desarrollar un cambio

### Paso 1. Revisar que no tengas cambios pendientes

Antes de cambiar de rama, ejecuta:

```bash
git status
```

Lo ideal es ver `working tree clean`. Si aparecen archivos modificados, termina y guarda ese trabajo antes de continuar. No mezcles cambios de tareas diferentes.

### Paso 2. Actualizar `dev`

Toda rama nueva debe crearse desde la versión más reciente de `dev`:

```bash
git switch dev
git pull --ff-only origin dev
```

> Ejecuta estos comandos cada vez que vayas a comenzar una funcionalidad, corrección o tarea nueva.

### Paso 3. Crear la rama de trabajo

Ejemplo para una funcionalidad de inicio de sesión:

```bash
git switch -c feature/login
```

Comprueba la rama activa:

```bash
git branch --show-current
```

Debe mostrar `feature/login`. A partir de aquí, todo el trabajo de esa tarea se realiza en esta rama.

### Paso 4. Trabajar y revisar los cambios

Después de modificar el código, revisa qué cambió:

```bash
git status
git diff
```

Antes de guardar un commit:

- ejecuta las pruebas disponibles;
- comprueba que el proyecto funciona;
- elimina código temporal, archivos generados y datos sensibles;
- confirma que los archivos pertenecen a la misma tarea.

### Paso 5. Añadir los archivos al próximo commit

Es preferible añadir únicamente los archivos relacionados:

```bash
git add ruta/del/archivo
```

Si comprobaste que **todos** los cambios mostrados por `git status` pertenecen a la tarea, puedes usar:

```bash
git add .
```

Revisa lo que quedará guardado:

```bash
git diff --staged
```

### Paso 6. Crear un commit

```bash
git commit -m "feat: agregar formulario de inicio de sesion"
```

Utiliza mensajes breves y descriptivos:

- `feat: agregar recuperacion de contrasena`
- `fix: corregir validacion del correo`
- `refactor: simplificar servicio de usuarios`
- `docs: documentar endpoints de autenticacion`
- `test: agregar pruebas del inicio de sesion`

Haz commits pequeños y funcionales. Puedes repetir los pasos 4, 5 y 6 mientras desarrollas la tarea.

### Paso 7. Publicar la rama en GitHub

La primera vez que publiques la rama:

```bash
git push -u origin feature/login
```

Después del primer `push`, para subir commits adicionales basta con:

```bash
git push
```

> Sustituye `feature/login` por el nombre real de tu rama.

---

## 5. Actualizar tu rama con los últimos cambios de `dev`

Haz esto antes de abrir el PR. Si el PR permanece abierto y `dev` sigue cambiando, repítelo antes de integrarlo:

```bash
git switch feature/login
git status
git fetch origin
git merge origin/dev
```

Si Git completa el `merge` sin conflictos, ejecuta las pruebas y publica la actualización:

```bash
git push
```

### Si aparecen conflictos

No te asustes: Git detendrá el proceso para que elijas qué contenido conservar.

1. Ejecuta `git status` para ver los archivos en conflicto.
2. Abre cada archivo y busca los marcadores `<<<<<<<`, `=======` y `>>>>>>>`.
3. Conserva el contenido correcto y elimina todos los marcadores.
4. Prueba nuevamente el proyecto.
5. Guarda la resolución:

```bash
git add ruta/del/archivo-resuelto
git commit -m "merge: resolver conflictos con dev"
git push
```

Si no sabes qué versión conservar, pide ayuda a la persona que modificó ese código. Para cancelar el intento de integración y volver al estado anterior, utiliza:

```bash
git merge --abort
```

---

## 6. Abrir el Pull Request hacia `dev`

En GitHub, abre un Pull Request con esta dirección:

```text
base: dev  ←  compare: feature/login
```

Comprueba con atención que la rama base sea `dev`, no `main`.

El PR debe incluir:

- un título claro;
- una explicación breve del cambio y su motivo;
- instrucciones para probarlo;
- capturas de pantalla si cambia la interfaz;
- referencia a la tarea o incidencia, si existe.

Ejemplo:

```markdown
## ¿Qué cambia?
- Agrega el formulario de inicio de sesión.
- Valida correo y contraseña.

## ¿Cómo probarlo?
1. Iniciar la aplicación.
2. Abrir la pantalla de inicio de sesión.
3. Probar credenciales válidas e inválidas.

## Evidencia
Adjuntar capturas si corresponde.
```

### Revisión e integración

1. Solicita la revisión de al menos una persona.
2. Atiende los comentarios en la misma rama, creando nuevos commits y ejecutando `git push`.
3. Espera que las pruebas automáticas terminen correctamente, si están configuradas.
4. El PR hacia `dev` necesita **1 aprobación** antes de integrarse.
5. No integres el PR si hay conversaciones sin resolver, pruebas fallidas o conflictos.

---

## 7. Después de integrar el PR

Cuando GitHub indique que el PR fue integrado, elimina la rama remota con el botón **Delete branch** del PR. Luego limpia y actualiza tu copia local:

```bash
git switch dev
git pull --ff-only origin dev
git branch -d feature/login
git fetch --prune
```

No reutilices una rama ya integrada. Para la siguiente tarea, actualiza `dev` y crea una rama nueva.

---

## 8. Llevar cambios de `dev` a `main`

Este flujo debe realizarlo la persona encargada de preparar la entrega o versión estable:

1. Verificar en `dev` que los cambios estén integrados y probados.
2. Abrir un PR con esta dirección:

   ```text
   base: main  ←  compare: dev
   ```

3. Esperar las pruebas y resolver cualquier observación.
4. Obtener **2 aprobaciones**.
5. Integrar únicamente cuando todo esté aprobado y correcto.

No se abre un PR directo desde una rama `feature/`, `fix/`, `refactor/`, `docs/` o `test/` hacia `main`.

---

## 9. Resumen de comandos del día a día

### Comenzar una tarea

```bash
git status
git switch dev
git pull --ff-only origin dev
git switch -c feature/nombre-de-la-funcionalidad
```

### Guardar y publicar el trabajo

```bash
git status
git diff
git add ruta/del/archivo
git diff --staged
git commit -m "feat: descripcion breve"
git push -u origin feature/nombre-de-la-funcionalidad
```

### Actualizar la rama antes del PR

```bash
git switch feature/nombre-de-la-funcionalidad
git status
git fetch origin
git merge origin/dev
git push
```

### Limpiar después de integrar el PR

```bash
git switch dev
git pull --ff-only origin dev
git branch -d feature/nombre-de-la-funcionalidad
git fetch --prune
```

---

## 10. Comandos de ayuda y errores comunes

### Ver el estado actual

```bash
git status
```

Ejecuta este comando siempre que tengas dudas: muestra la rama activa y los pasos pendientes.

### Ver las ramas

```bash
git branch
git branch --all
```

### Deshacer un archivo añadido por accidente, sin borrar su contenido

```bash
git restore --staged ruta/del/archivo
```

### Descartar cambios locales de un archivo

```bash
git restore ruta/del/archivo
```

> **Cuidado:** este último comando elimina cambios que todavía no están en un commit.

### Corregir el último mensaje de commit antes de publicarlo

```bash
git commit --amend -m "tipo: mensaje corregido"
```

### Errores que debemos evitar

- Trabajar directamente en `main` o `dev`.
- Crear una rama desde una `dev` desactualizada.
- Utilizar `git add .` sin revisar antes `git status`.
- Mezclar varias tareas no relacionadas en una rama o PR.
- Subir contraseñas, tokens, archivos `.env` o llaves privadas.
- Usar `git push --force` sin autorización del equipo.
- Resolver un conflicto sin entender qué código debe conservarse.

Cuando no estés seguro, detente, ejecuta `git status` y pide ayuda antes de continuar.
