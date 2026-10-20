-- Una vez al día, a las 0:01 de Argentina, los turnos web pendientes de más
-- de 24 horas pasan a Cancelado. Así la grilla no recorre ni actualiza
-- pendientes en cada visita del paciente.

create or replace function public.vencer_turnos_pendientes_web()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  n integer;
  corte timestamp;
begin
  corte := (now() at time zone 'America/Argentina/Buenos_Aires') - interval '24 hours';
  update public.historial_turnos
  set estado_turno = 'Cancelado'
  where estado_turno = 'Pendiente en Turnero Web'
    and fecha_hora is not null
    and fecha_hora < corte;
  get diagnostics n = row_count;
  return n;
end;
$$;

revoke all on function public.vencer_turnos_pendientes_web() from public;
grant execute on function public.vencer_turnos_pendientes_web() to postgres;

-- pg_cron corre en UTC. 0:01 ART = 3:01 UTC (Argentina no tiene horario de verano).
-- En el dashboard de Supabase: Database > Extensions > activar pg_cron, y después
-- este bloque. Si la extensión no está, la función igual queda creada.
do $$
begin
  create extension if not exists pg_cron;
  perform cron.unschedule(j.jobid)
  from cron.job j
  where j.jobname = 'vencer-turnos-pendientes-web';
  perform cron.schedule(
    'vencer-turnos-pendientes-web',
    '1 3 * * *',
    $c$select public.vencer_turnos_pendientes_web()$c$
  );
exception
  when others then
    raise notice 'No se pudo programar pg_cron: %', sqlerrm;
end $$;
