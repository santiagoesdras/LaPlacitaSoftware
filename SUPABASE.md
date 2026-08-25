# Integración de Supabase — La Placita

La aplicación utiliza Supabase directamente desde React para autenticación,
lectura y escritura de datos, y almacenamiento de imágenes. No utiliza Edge
Functions, funciones RPC, TypeScript ni un backend adicional.

## Modelo de datos

### `categorias`

| Campo | Tipo | Uso |
|---|---|---|
| `id` | `uuid` | Identificador interno |
| `nombre` | `text` | Nombre visible de la categoría |
| `activo` | `boolean` | Controla si la categoría aparece públicamente |
| `orden` | `integer` | Orden de presentación |
| `creado_en` | `timestamptz` | Fecha de creación |
| `actualizado_en` | `timestamptz` | Fecha de última edición |

### `productos`

| Campo | Tipo | Uso |
|---|---|---|
| `id` | `uuid` | Identificador interno |
| `categoria_id` | `uuid` | Categoría del producto |
| `nombre` | `text` | Nombre del plato o bebida |
| `descripcion` | `text` | Descripción pública |
| `precio` | `numeric(10,2)` | Precio en quetzales |
| `imagen_path` | `text` | Ruta del archivo en Supabase Storage |
| `alt` | `text` | Descripción accesible de la fotografía |
| `disponible` | `boolean` | Controla si aparece en el menú público |
| `orden` | `integer` | Orden dentro del menú |
| `creado_en` | `timestamptz` | Fecha de creación |
| `actualizado_en` | `timestamptz` | Fecha de última edición |

No existe una tabla de roles. Todas las cuentas permanentes creadas manualmente
en Supabase Auth se consideran administradoras. Por este motivo debe mantenerse
deshabilitado el registro público.

## Crear la base de datos

Crear un proyecto nuevo de Supabase para La Placita. En **SQL Editor**, ejecutar
el siguiente bloque completo una sola vez:

```sql
create extension if not exists pgcrypto;

create table public.categorias (
  id uuid primary key default gen_random_uuid(),
  nombre text not null unique check (length(trim(nombre)) between 1 and 80),
  activo boolean not null default true,
  orden integer not null default 0 check (orden >= 0),
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

create table public.productos (
  id uuid primary key default gen_random_uuid(),
  categoria_id uuid not null references public.categorias(id),
  nombre text not null check (length(trim(nombre)) between 1 and 120),
  descripcion text not null default '',
  precio numeric(10,2) not null check (precio > 0),
  imagen_path text,
  alt text not null default '',
  disponible boolean not null default true,
  orden integer not null default 0 check (orden >= 0),
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

create index productos_categoria_idx on public.productos(categoria_id);
create index productos_publicos_idx on public.productos(disponible, orden);
create index categorias_publicas_idx on public.categorias(activo, orden);

alter table public.categorias enable row level security;
alter table public.productos enable row level security;

revoke all on table public.categorias from anon, authenticated;
revoke all on table public.productos from anon, authenticated;

grant select on table public.categorias to anon;
grant select on table public.productos to anon;
grant select, insert, update, delete on table public.categorias to authenticated;
grant select, insert, update, delete on table public.productos to authenticated;

create policy "categorias publicas visibles"
on public.categorias for select to anon
using (activo = true);

create policy "productos publicos visibles"
on public.productos for select to anon
using (disponible = true);

create policy "administrador lee categorias"
on public.categorias for select to authenticated
using (
  (select auth.uid()) is not null
  and coalesce((select (auth.jwt() ->> 'is_anonymous')::boolean), false) = false
);

create policy "administrador crea categorias"
on public.categorias for insert to authenticated
with check (
  (select auth.uid()) is not null
  and coalesce((select (auth.jwt() ->> 'is_anonymous')::boolean), false) = false
);

create policy "administrador actualiza categorias"
on public.categorias for update to authenticated
using (
  (select auth.uid()) is not null
  and coalesce((select (auth.jwt() ->> 'is_anonymous')::boolean), false) = false
)
with check (
  (select auth.uid()) is not null
  and coalesce((select (auth.jwt() ->> 'is_anonymous')::boolean), false) = false
);

create policy "administrador elimina categorias"
on public.categorias for delete to authenticated
using (
  (select auth.uid()) is not null
  and coalesce((select (auth.jwt() ->> 'is_anonymous')::boolean), false) = false
);

create policy "administrador lee productos"
on public.productos for select to authenticated
using (
  (select auth.uid()) is not null
  and coalesce((select (auth.jwt() ->> 'is_anonymous')::boolean), false) = false
);

create policy "administrador crea productos"
on public.productos for insert to authenticated
with check (
  (select auth.uid()) is not null
  and coalesce((select (auth.jwt() ->> 'is_anonymous')::boolean), false) = false
);

create policy "administrador actualiza productos"
on public.productos for update to authenticated
using (
  (select auth.uid()) is not null
  and coalesce((select (auth.jwt() ->> 'is_anonymous')::boolean), false) = false
)
with check (
  (select auth.uid()) is not null
  and coalesce((select (auth.jwt() ->> 'is_anonymous')::boolean), false) = false
);

create policy "administrador elimina productos"
on public.productos for delete to authenticated
using (
  (select auth.uid()) is not null
  and coalesce((select (auth.jwt() ->> 'is_anonymous')::boolean), false) = false
);
```

Las políticas públicas solo permiten leer productos disponibles y categorías
activas. Las operaciones de escritura necesitan una sesión permanente de
Supabase Auth.

## Configurar Supabase Storage

En **SQL Editor**, ejecutar:

```sql
insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'menu-images',
  'menu-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "administrador sube imagenes del menu"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'menu-images'
  and (select auth.uid()) is not null
  and coalesce((select (auth.jwt() ->> 'is_anonymous')::boolean), false) = false
);

create policy "administrador actualiza imagenes del menu"
on storage.objects for update to authenticated
using (
  bucket_id = 'menu-images'
  and (select auth.uid()) is not null
  and coalesce((select (auth.jwt() ->> 'is_anonymous')::boolean), false) = false
)
with check (
  bucket_id = 'menu-images'
  and (select auth.uid()) is not null
  and coalesce((select (auth.jwt() ->> 'is_anonymous')::boolean), false) = false
);

create policy "administrador elimina imagenes del menu"
on storage.objects for delete to authenticated
using (
  bucket_id = 'menu-images'
  and (select auth.uid()) is not null
  and coalesce((select (auth.jwt() ->> 'is_anonymous')::boolean), false) = false
);
```

El bucket es público porque las fotografías forman parte del menú visible. Las
políticas siguen protegiendo la subida, modificación y eliminación de archivos.

## Crear la cuenta de Don Chente

1. Ir a **Authentication → Sign In / Providers → Email**.
2. Deshabilitar **Allow new users to sign up**.
3. No habilitar inicio de sesión anónimo.
4. Ir a **Authentication → Users → Add user**.
5. Crear manualmente la cuenta del propietario y marcar el correo como confirmado.

Al no existir roles, cualquier cuenta permanente creada en Auth podrá entrar al
panel. Solo deben crearse cuentas para personas autorizadas.

## Configurar variables locales

En Supabase, abrir **Connect** y copiar la **Project URL** y la **Publishable
key**. Nunca utilizar la clave `service_role` en este proyecto.

En PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Completar `.env.local`:

```dotenv
VITE_SUPABASE_URL=https://ID-DEL-PROYECTO.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_REEMPLAZAR
```

`.env.local` está ignorado por Git y no debe subirse al repositorio.

## Ejecutar en local

```powershell
npm install
npm run dev
```

Abrir la dirección indicada por Vite. El sitio público se encuentra en `/` y el
acceso administrativo en `/admin/login`.

Comprobación mínima:

1. Crear una categoría desde `/admin/categorias`.
2. Crear un producto con fotografía desde `/admin/productos`.
3. Cerrar sesión.
4. Confirmar que el producto aparece en `/`.
5. Ocultar el producto y verificar que deja de aparecer públicamente.
6. Confirmar que una persona sin sesión no puede abrir `/admin`.

## Preparar Vercel

El repositorio incluye `vercel.json` para que las rutas internas del panel
funcionen al recargar la página. Al desplegar:

1. Agregar `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY` en **Project
   Settings → Environment Variables**.
2. Aplicarlas a Production, Preview y Development según corresponda.
3. Ejecutar un nuevo despliegue después de guardar las variables.

La clave publicable puede estar en el frontend; la seguridad depende de los
grants y políticas RLS. La clave `service_role` nunca debe agregarse a Vercel ni
al código del navegador.
