-- AppSheet entra con el profesional, no con admin_usuarios.
-- La clínica de la sesión sale del email del profesional.
-- El administrador de Vercel sigue resolviéndose por admin_usuarios.
-- Esta función no agrega un filtro sobre la tabla profesionales.

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
