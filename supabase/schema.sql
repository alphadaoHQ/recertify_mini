-- =============================================
-- TABLES
-- =============================================

create table if not exists profiles (
  wallet_address text primary key,
  name text not null,
  username text unique,
  avatar text,
  xp integer not null default 0,
  weekly_xp integer not null default 0,
  streak_xp integer not null default 0,
  level integer not null default 1,
  title text not null default 'New Explorer',
  next_rank text not null default 'Builder',
  xp_to_next_rank integer not null default 500,
  whitelist_eligible boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists course_progress (
  wallet_address text not null references profiles(wallet_address) on delete cascade,
  module_id text not null,
  completed boolean not null default false,
  reward_claimed boolean not null default false,
  selected_answer text,
  xp_earned integer not null default 0,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (wallet_address, module_id)
);

create table if not exists task_claims (
  wallet_address text not null references profiles(wallet_address) on delete cascade,
  task_id text not null,
  claimed boolean not null default false,
  xp_earned integer not null default 0,
  claimed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (wallet_address, task_id)
);

create table if not exists reward_claims (
  wallet_address text not null references profiles(wallet_address) on delete cascade,
  reward_id text not null,
  reward_type text not null,
  title text not null,
  rarity text,
  image text,
  module_id text,
  xp_earned integer not null default 0,
  claimed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  primary key (wallet_address, reward_id)
);

create table if not exists whitelist (
  wallet_address text primary key references profiles(wallet_address) on delete cascade,
  username text,
  rank integer not null,
  total_xp integer not null default 0,
  tasks_completed integer not null default 0,
  modules_completed integer not null default 0,
  eligible_at timestamptz not null default now(),
  status text not null default 'eligible'
);

-- =============================================
-- ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- =============================================

alter table profiles enable row level security;
alter table course_progress enable row level security;
alter table task_claims enable row level security;
alter table reward_claims enable row level security;
alter table whitelist enable row level security;

-- =============================================
-- RLS POLICIES — Allow anon key full access
-- (Since the app uses wallet addresses, not Supabase Auth,
--  we need open policies for the anon key to work.)
-- =============================================

-- profiles
create policy "Allow public read on profiles"
  on profiles for select
  to anon using (true);

create policy "Allow public insert on profiles"
  on profiles for insert
  to anon with check (true);

create policy "Allow public update on profiles"
  on profiles for update
  to anon using (true) with check (true);

-- course_progress
create policy "Allow public read on course_progress"
  on course_progress for select
  to anon using (true);

create policy "Allow public insert on course_progress"
  on course_progress for insert
  to anon with check (true);

create policy "Allow public update on course_progress"
  on course_progress for update
  to anon using (true) with check (true);

-- task_claims
create policy "Allow public read on task_claims"
  on task_claims for select
  to anon using (true);

create policy "Allow public insert on task_claims"
  on task_claims for insert
  to anon with check (true);

create policy "Allow public update on task_claims"
  on task_claims for update
  to anon using (true) with check (true);

-- reward_claims
create policy "Allow public read on reward_claims"
  on reward_claims for select
  to anon using (true);

create policy "Allow public insert on reward_claims"
  on reward_claims for insert
  to anon with check (true);

create policy "Allow public update on reward_claims"
  on reward_claims for update
  to anon using (true) with check (true);

-- whitelist
create policy "Allow public read on whitelist"
  on whitelist for select
  to anon using (true);

create policy "Allow public insert on whitelist"
  on whitelist for insert
  to anon with check (true);

create policy "Allow public update on whitelist"
  on whitelist for update
  to anon using (true) with check (true);

-- =============================================
-- ADMIN-MANAGED CONTENT TABLES
-- =============================================

create table if not exists courses (
  id text primary key,
  title text not null,
  subtitle text,
  icon text not null default 'sparkles',
  image text,
  mission_title text,
  mission_label text default 'Project Mission',
  mission_copy jsonb default '[]'::jsonb,
  step integer default 1,
  total_steps integer default 5,
  reward_xp integer not null default 100,
  nft_reward_id text,
  nft_reward_title text,
  nft_reward_rarity text,
  nft_reward_image text,
  question text,
  answers jsonb default '[]'::jsonb,
  sort_order integer default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists tasks (
  id text primary key,
  title text not null,
  description text,
  reward_xp integer not null default 50,
  reward_label text,
  status text default 'Instant',
  icon text default 'send',
  sort_order integer default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table courses enable row level security;
alter table tasks enable row level security;

-- courses
create policy "Allow public read on courses"
  on courses for select to anon using (true);
create policy "Allow public insert on courses"
  on courses for insert to anon with check (true);
create policy "Allow public update on courses"
  on courses for update to anon using (true) with check (true);
create policy "Allow public delete on courses"
  on courses for delete to anon using (true);

-- tasks
create policy "Allow public read on tasks"
  on tasks for select to anon using (true);
create policy "Allow public insert on tasks"
  on tasks for insert to anon with check (true);
create policy "Allow public update on tasks"
  on tasks for update to anon using (true) with check (true);
create policy "Allow public delete on tasks"
  on tasks for delete to anon using (true);

-- allow deletes on profiles (for admin user removal)
create policy "Allow public delete on profiles"
  on profiles for delete to anon using (true);
create policy "Allow public delete on course_progress"
  on course_progress for delete to anon using (true);
create policy "Allow public delete on task_claims"
  on task_claims for delete to anon using (true);
create policy "Allow public delete on reward_claims"
  on reward_claims for delete to anon using (true);
create policy "Allow public delete on whitelist"
  on whitelist for delete to anon using (true);
