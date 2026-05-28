create extension if not exists "pgcrypto";

create table if not exists public.decks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.cards (
  id uuid primary key default gen_random_uuid(),
  deck_id uuid not null references public.decks(id) on delete cascade,
  front_content text not null,
  back_content text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.study_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  card_id uuid not null references public.cards(id) on delete cascade,
  interval integer not null default 0 check (interval >= 0),
  ease_factor numeric(4,2) not null default 2.50 check (ease_factor >= 1.30),
  next_review_date date not null default current_date,
  unique (user_id, card_id)
);

alter table public.decks enable row level security;
alter table public.cards enable row level security;
alter table public.study_progress enable row level security;

create policy if not exists decks_select_own on public.decks for select to authenticated using (auth.uid() = user_id);
create policy if not exists decks_insert_own on public.decks for insert to authenticated with check (auth.uid() = user_id);
create policy if not exists decks_update_own on public.decks for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy if not exists decks_delete_own on public.decks for delete to authenticated using (auth.uid() = user_id);

create policy if not exists cards_select_own_deck on public.cards for select to authenticated using (
  exists (select 1 from public.decks d where d.id = cards.deck_id and d.user_id = auth.uid())
);
create policy if not exists cards_insert_own_deck on public.cards for insert to authenticated with check (
  exists (select 1 from public.decks d where d.id = cards.deck_id and d.user_id = auth.uid())
);
create policy if not exists cards_update_own_deck on public.cards for update to authenticated using (
  exists (select 1 from public.decks d where d.id = cards.deck_id and d.user_id = auth.uid())
) with check (
  exists (select 1 from public.decks d where d.id = cards.deck_id and d.user_id = auth.uid())
);
create policy if not exists cards_delete_own_deck on public.cards for delete to authenticated using (
  exists (select 1 from public.decks d where d.id = cards.deck_id and d.user_id = auth.uid())
);

create policy if not exists progress_select_own on public.study_progress for select to authenticated using (auth.uid() = user_id);
create policy if not exists progress_insert_own on public.study_progress for insert to authenticated with check (auth.uid() = user_id);
create policy if not exists progress_update_own on public.study_progress for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy if not exists progress_delete_own on public.study_progress for delete to authenticated using (auth.uid() = user_id);

-- Seed template for unit 1 deck: run this after login in SQL with your user UUID
-- replace <YOUR_USER_ID>
-- insert into public.decks (user_id, title, description)
-- values ('<YOUR_USER_ID>', 'unit 1', 'Vocabulary flashcards from unit-1-sigma');