-- ============================================================
-- Case-já — Migration 0003: cronograma (tasks) + fornecedores (vendors)
-- Aplicar no Supabase: SQL Editor → colar → Run.
-- ============================================================

-- Enum de status do fornecedor
do $$ begin
  create type public.vendor_status as enum ('researching', 'quoted', 'hired', 'paid');
exception when duplicate_object then null; end $$;

-- ============================================================
-- tasks (cronograma / checklist do casamento)
-- ============================================================
create table if not exists public.tasks (
  id          uuid primary key default gen_random_uuid(),
  wedding_id  uuid not null references public.weddings (id) on delete cascade,
  title       text not null,
  description text,
  category    text,                    -- fase, ex.: "6 meses antes"
  due_date    date,
  done        boolean not null default false,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists tasks_wedding_id_idx on public.tasks (wedding_id);

drop trigger if exists trg_tasks_updated_at on public.tasks;
create trigger trg_tasks_updated_at
  before update on public.tasks
  for each row execute function public.set_updated_at();

-- ============================================================
-- vendors (fornecedores contratados/pesquisados)
-- ============================================================
create table if not exists public.vendors (
  id           uuid primary key default gen_random_uuid(),
  wedding_id   uuid not null references public.weddings (id) on delete cascade,
  name         text not null,
  category     text,                   -- buffet, fotografia, música...
  contact_name text,
  phone        text,
  email        text,
  instagram    text,
  price        numeric(10,2) check (price is null or price >= 0),
  status       public.vendor_status not null default 'researching',
  notes        text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists vendors_wedding_id_idx on public.vendors (wedding_id);

drop trigger if exists trg_vendors_updated_at on public.vendors;
create trigger trg_vendors_updated_at
  before update on public.vendors
  for each row execute function public.set_updated_at();

-- ============================================================
-- RLS: acesso exclusivo do dono do casamento
-- ============================================================
alter table public.tasks   enable row level security;
alter table public.vendors enable row level security;

drop policy if exists "tasks_owner_all" on public.tasks;
create policy "tasks_owner_all" on public.tasks
  for all to authenticated
  using (public.is_wedding_owner(wedding_id))
  with check (public.is_wedding_owner(wedding_id));

drop policy if exists "vendors_owner_all" on public.vendors;
create policy "vendors_owner_all" on public.vendors
  for all to authenticated
  using (public.is_wedding_owner(wedding_id))
  with check (public.is_wedding_owner(wedding_id));

grant select, insert, update, delete on public.tasks, public.vendors to authenticated;
