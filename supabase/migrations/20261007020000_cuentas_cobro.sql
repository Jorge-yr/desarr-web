-- Una credencial de cobro por clínica y por pasarela.
-- Mercado Pago es la primera. Naranja X, Modo u otra se agregan como otra fila.
-- El token solo lo lee el servidor con la clave de servicio.

create table if not exists public.cuentas_cobro (
  id_clinica text not null references public.maestro_administradores (id_clinica),
  pasarela text not null,
  access_token text not null,
  cuenta_externa text,
  activa boolean not null default true,
  updated_at timestamptz not null default now(),
  primary key (id_clinica, pasarela)
);

create unique index if not exists cuentas_cobro_cuenta_externa
on public.cuentas_cobro (pasarela, cuenta_externa);

alter table public.cuentas_cobro enable row level security;
