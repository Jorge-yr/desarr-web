-- Login del administrador: Auth guarda la contraseña.
-- admin_usuarios fija un solo id_clinica por usuario.
-- La configuración del turnero queda en esas dos tablas, con seguridad por fila.

create table if not exists public.admin_usuarios (
  user_id uuid primary key references auth.users (id) on delete cascade,
  id_clinica text not null references public.maestro_administradores (id_clinica),
  email text not null,
  unique (id_clinica, email)
);

alter table public.admin_usuarios enable row level security;

create or replace function public.current_id_clinica()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select id_clinica
  from public.admin_usuarios
  where user_id = auth.uid()
$$;

revoke all on function public.current_id_clinica() from public;
grant execute on function public.current_id_clinica() to authenticated;

create policy admin_usuarios_propia
on public.admin_usuarios
for select
to authenticated
using (user_id = auth.uid());

create table if not exists public.configuracion_turnero (
  id_clinica text not null references public.maestro_administradores (id_clinica),
  id_profesional text not null,
  duracion_turno_min integer not null check (duracion_turno_min between 5 and 240),
  dias_visibles integer not null check (dias_visibles between 1 and 180),
  importe_sena_ars numeric(12, 2) not null check (importe_sena_ars >= 0),
  primary key (id_clinica, id_profesional)
);

create table if not exists public.horarios_profesionales (
  id text primary key default gen_random_uuid()::text,
  id_clinica text not null references public.maestro_administradores (id_clinica),
  id_profesional text not null,
  dia_semana smallint not null check (dia_semana between 1 and 7),
  hora_desde time not null,
  hora_hasta time not null,
  check (hora_hasta > hora_desde)
);

alter table public.configuracion_turnero enable row level security;
alter table public.horarios_profesionales enable row level security;

create policy configuracion_turnero_clinica
on public.configuracion_turnero
for all
to authenticated
using (id_clinica = public.current_id_clinica())
with check (id_clinica = public.current_id_clinica());

create policy horarios_profesionales_clinica
on public.horarios_profesionales
for all
to authenticated
using (id_clinica = public.current_id_clinica())
with check (id_clinica = public.current_id_clinica());
