-- Soporte: una fila por correo permite cambiar de clínica sin mover al profesional.
-- current_id_clinica() la consulta antes que admin_usuarios y profesionales.

create table if not exists public.soporte_clinica (
  email text primary key,
  id_clinica text not null references public.maestro_administradores (id_clinica)
);

insert into public.soporte_clinica (email, id_clinica)
values ('jorge.ya02@gmail.com', 'C00001')
on conflict (email) do nothing;

alter table public.soporte_clinica enable row level security;

drop policy if exists soporte_clinica_propia on public.soporte_clinica;
create policy soporte_clinica_propia
on public.soporte_clinica
for all
to authenticated
using (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')))
with check (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));

create or replace function public.current_id_clinica()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (
      select id_clinica
      from public.soporte_clinica
      where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    ),
    (
      select id_clinica
      from public.admin_usuarios
      where user_id = auth.uid()
    ),
    (
      select id_clinica
      from public.profesionales
      where email is not null
        and lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      order by id_profesional
      limit 1
    )
  )
$$;
