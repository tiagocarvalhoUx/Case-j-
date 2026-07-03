-- ============================================================
-- Case-já — Migration 0002: RSVP público
-- Permite que convidados (anônimos) confirmem/recusem presença
-- em casamentos PUBLICADOS, inserindo uma linha em `guests`.
-- Aplicar no Supabase: SQL Editor → colar → Run.
-- ============================================================

-- INSERT público de RSVP: apenas status confirmado/recusado e
-- somente para casamentos publicados. Convidados não conseguem LER
-- a lista (não há policy de SELECT para anon), apenas inserir a sua.
drop policy if exists "guests_public_rsvp" on public.guests;
create policy "guests_public_rsvp" on public.guests
  for insert to anon, authenticated
  with check (
    rsvp in ('confirmed', 'declined')
    and exists (
      select 1 from public.weddings w
      where w.id = guests.wedding_id and w.published = true
    )
  );
