-- Registro de la seña cobrada por Mercado Pago.
-- El webhook escribe con la clave de servicio. La clínica solo lee las suyas.

create table if not exists public.senas_pagos (
  id text primary key,
  id_clinica text not null references public.maestro_administradores (id_clinica),
  id_profesional text,
  inicio_turno timestamptz,
  dni text,
  nombre text,
  apellido text,
  whatsapp text,
  importe numeric(12, 2),
  mp_payment_id text unique,
  estado text not null,
  created_at timestamptz not null default now()
);

alter table public.senas_pagos enable row level security;

create policy senas_pagos_clinica
on public.senas_pagos
for select
to authenticated
using (id_clinica = public.current_id_clinica());
