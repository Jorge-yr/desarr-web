-- Al insertar, nombre, apellido y domicilio quedan con la primera letra de cada
-- palabra en mayúscula, sin espacios de más ni al final.
-- Profesionales no tiene domicilio: se normalizan nombre_completo y apellido_completo.

create or replace function public.normalizar_texto_propio(valor text)
returns text
language sql
immutable
as $$
  select case
    when valor is null then null
    else initcap(regexp_replace(btrim(valor), '\s+', ' ', 'g'))
  end
$$;

create or replace function public.pacientes_normalizar_nombres()
returns trigger
language plpgsql
as $$
begin
  new.nombre := public.normalizar_texto_propio(new.nombre);
  new.apellido := public.normalizar_texto_propio(new.apellido);
  new.domicilio := public.normalizar_texto_propio(new.domicilio);
  return new;
end;
$$;

drop trigger if exists pacientes_normalizar_nombres on public.pacientes;
create trigger pacientes_normalizar_nombres
before insert on public.pacientes
for each row
execute function public.pacientes_normalizar_nombres();

create or replace function public.profesionales_normalizar_nombres()
returns trigger
language plpgsql
as $$
begin
  new.nombre_completo := public.normalizar_texto_propio(new.nombre_completo);
  new.apellido_completo := public.normalizar_texto_propio(new.apellido_completo);
  return new;
end;
$$;

drop trigger if exists profesionales_normalizar_nombres on public.profesionales;
create trigger profesionales_normalizar_nombres
before insert on public.profesionales
for each row
execute function public.profesionales_normalizar_nombres();
