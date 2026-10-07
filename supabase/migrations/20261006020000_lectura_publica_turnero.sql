-- El link público lee el nombre de la clínica, los profesionales y los horarios.
-- No abre pacientes ni turnos.

create policy maestro_administradores_publico
on public.maestro_administradores
for select
to anon
using (true);

create policy profesionales_publico
on public.profesionales
for select
to anon
using (true);

create policy configuracion_turnero_publico
on public.configuracion_turnero
for select
to anon
using (true);

create policy horarios_profesionales_publico
on public.horarios_profesionales
for select
to anon
using (true);
