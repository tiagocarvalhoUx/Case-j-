-- ============================================================
-- Case-já — Migration 0001: schema inicial
-- Entidades: weddings → guests / gifts → contributions
-- Segurança: RLS habilitado em todas as tabelas.
-- Aplicar no Supabase: SQL Editor → colar → Run.
-- ============================================================

-- Extensões -------------------------------------------------
create extension if not exists "pgcrypto";

-- Enums -----------------------------------------------------
do $$ begin
  create type public.rsvp_status as enum ('pending', 'confirmed', 'declined');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.gift_type as enum ('fixed', 'quota');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.payment_status as enum ('pending', 'paid', 'failed', 'refunded');
exception when duplicate_object then null; end $$;

-- updated_at automático -------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================
-- weddings (o casamento de um casal — 1 por owner, mas o
-- modelo permite mais de um por conta no futuro)
-- ============================================================
create table if not exists public.weddings (
  id              uuid primary key default gen_random_uuid(),
  owner_id        uuid not null references auth.users (id) on delete cascade default auth.uid(),
  couple_names    text not null,
  slug            text not null unique,
  wedding_date    date,
  city            text,
  venue           text,
  welcome_message text,
  cover_image_url text,
  theme           text not null default 'classic',
  published       boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists weddings_owner_id_idx on public.weddings (owner_id);
create index if not exists weddings_slug_idx on public.weddings (slug);

drop trigger if exists trg_weddings_updated_at on public.weddings;
create trigger trg_weddings_updated_at
  before update on public.weddings
  for each row execute function public.set_updated_at();

-- Helper: o usuário atual é dono deste casamento?
-- SECURITY DEFINER evita recursão de RLS ao ser usado em
-- políticas de tabelas-filhas.
create or replace function public.is_wedding_owner(wid uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.weddings w
    where w.id = wid and w.owner_id = auth.uid()
  );
$$;

-- ============================================================
-- guests (convidados + RSVP)
-- ============================================================
create table if not exists public.guests (
  id           uuid primary key default gen_random_uuid(),
  wedding_id   uuid not null references public.weddings (id) on delete cascade,
  name         text not null,
  email        text,
  phone        text,
  party_group  text,                 -- ex.: "Família da noiva"
  party_size   integer not null default 1 check (party_size >= 1),
  rsvp         public.rsvp_status not null default 'pending',
  table_number integer,
  notes        text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists guests_wedding_id_idx on public.guests (wedding_id);

drop trigger if exists trg_guests_updated_at on public.guests;
create trigger trg_guests_updated_at
  before update on public.guests
  for each row execute function public.set_updated_at();

-- ============================================================
-- gifts (itens da lista: presente em dinheiro fixo ou cota)
-- ============================================================
create table if not exists public.gifts (
  id            uuid primary key default gen_random_uuid(),
  wedding_id    uuid not null references public.weddings (id) on delete cascade,
  title         text not null,
  description   text,
  image_url     text,
  category      text,
  type          public.gift_type not null default 'fixed',
  price         numeric(10,2) not null default 0 check (price >= 0),   -- valor do presente/da cota
  target_amount numeric(10,2) check (target_amount is null or target_amount >= 0), -- meta total (cotas)
  sort_order    integer not null default 0,
  active        boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists gifts_wedding_id_idx on public.gifts (wedding_id);

drop trigger if exists trg_gifts_updated_at on public.gifts;
create trigger trg_gifts_updated_at
  before update on public.gifts
  for each row execute function public.set_updated_at();

-- ============================================================
-- contributions (um convidado "presenteia" — vira pagamento)
-- O status vira 'paid' via webhook do Asaas (service role).
-- ============================================================
create table if not exists public.contributions (
  id               uuid primary key default gen_random_uuid(),
  wedding_id       uuid not null references public.weddings (id) on delete cascade,
  gift_id          uuid not null references public.gifts (id) on delete cascade,
  guest_name       text not null,
  guest_email      text,
  message          text,
  amount           numeric(10,2) not null check (amount > 0),
  status           public.payment_status not null default 'pending',
  payment_method   text,             -- pix | boleto | credit_card
  asaas_payment_id text,
  created_at       timestamptz not null default now(),
  paid_at          timestamptz
);

create index if not exists contributions_wedding_id_idx on public.contributions (wedding_id);
create index if not exists contributions_gift_id_idx on public.contributions (gift_id);
create index if not exists contributions_asaas_idx on public.contributions (asaas_payment_id);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.weddings      enable row level security;
alter table public.guests        enable row level security;
alter table public.gifts         enable row level security;
alter table public.contributions enable row level security;

-- ---- weddings ----
drop policy if exists "weddings_owner_all" on public.weddings;
create policy "weddings_owner_all" on public.weddings
  for all to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

-- Leitura pública apenas de casamentos publicados (site público).
drop policy if exists "weddings_public_read" on public.weddings;
create policy "weddings_public_read" on public.weddings
  for select to anon, authenticated
  using (published = true);

-- ---- guests (privado ao dono) ----
drop policy if exists "guests_owner_all" on public.guests;
create policy "guests_owner_all" on public.guests
  for all to authenticated
  using (public.is_wedding_owner(wedding_id))
  with check (public.is_wedding_owner(wedding_id));

-- ---- gifts ----
drop policy if exists "gifts_owner_all" on public.gifts;
create policy "gifts_owner_all" on public.gifts
  for all to authenticated
  using (public.is_wedding_owner(wedding_id))
  with check (public.is_wedding_owner(wedding_id));

-- Leitura pública dos presentes ativos de casamentos publicados.
drop policy if exists "gifts_public_read" on public.gifts;
create policy "gifts_public_read" on public.gifts
  for select to anon, authenticated
  using (
    active = true
    and exists (
      select 1 from public.weddings w
      where w.id = gifts.wedding_id and w.published = true
    )
  );

-- ---- contributions ----
-- Dono vê as contribuições do seu casamento.
drop policy if exists "contributions_owner_read" on public.contributions;
create policy "contributions_owner_read" on public.contributions
  for select to authenticated
  using (public.is_wedding_owner(wedding_id));

-- Convidado (anon) pode criar contribuição pendente para presente
-- ativo de casamento publicado. A confirmação de pagamento é feita
-- pelo backend (service role) via webhook do Asaas.
drop policy if exists "contributions_public_insert" on public.contributions;
create policy "contributions_public_insert" on public.contributions
  for insert to anon, authenticated
  with check (
    status = 'pending'
    and exists (
      select 1 from public.gifts g
      join public.weddings w on w.id = g.wedding_id
      where g.id = contributions.gift_id
        and g.wedding_id = contributions.wedding_id
        and g.active = true
        and w.published = true
    )
  );

-- ============================================================
-- Grants (RLS continua sendo o filtro real por linha)
-- ============================================================
grant select, insert, update, delete
  on public.weddings, public.guests, public.gifts, public.contributions
  to authenticated;

grant select on public.weddings, public.gifts to anon;
grant insert on public.contributions to anon;
