-- Límites del turnero público.
-- turnero_reservas_web: de qué conexión salió cada turno web (se guarda un hash, no la IP).
-- turnero_intentos: consultas de DNI que no existe, por conexión.
-- Solo las lee el servidor con la clave de servicio: no tienen políticas.

create table if not exists public.turnero_reservas_web (
  id_turno text primary key,
  ip_hash text not null,
  creado_en timestamptz not null default now()
);

create index if not exists turnero_reservas_web_ip
on public.turnero_reservas_web (ip_hash, creado_en desc);

create table if not exists public.turnero_intentos (
  id bigint generated always as identity primary key,
  ip_hash text not null,
  creado_en timestamptz not null default now()
);

create index if not exists turnero_intentos_ip
on public.turnero_intentos (ip_hash, creado_en desc);

alter table public.turnero_reservas_web enable row level security;
alter table public.turnero_intentos enable row level security;

notify pgrst, 'reload schema';
