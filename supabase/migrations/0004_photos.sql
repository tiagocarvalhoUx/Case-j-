-- ============================================================
-- Case-já — Migration 0004: galeria de fotos do casal (photos)
-- Aplicar no Supabase: SQL Editor → colar → Run.
-- ============================================================

create table if not exists public.photos (
  id         uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings (id) on delete cascade,
  url        text not null,
  caption    text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists photos_wedding_id_idx on public.photos (wedding_id);

alter table public.photos enable row level security;

-- Dono: acesso total
drop policy if exists "photos_owner_all" on public.photos;
create policy "photos_owner_all" on public.photos
  for all to authenticated
  using (public.is_wedding_owner(wedding_id))
  with check (public.is_wedding_owner(wedding_id));

-- Convidados: leitura pública apenas de casamentos publicados
drop policy if exists "photos_public_read" on public.photos;
create policy "photos_public_read" on public.photos
  for select to anon, authenticated
  using (
    exists (
      select 1 from public.weddings w
      where w.id = photos.wedding_id and w.published = true
    )
  );

grant select, insert, update, delete on public.photos to authenticated;
grant select on public.photos to anon;
