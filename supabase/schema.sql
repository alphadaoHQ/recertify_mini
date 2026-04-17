create table if not exists profiles (
  wallet_address text primary key,
  name text not null,
  avatar text,
  xp integer not null default 0,
  weekly_xp integer not null default 0,
  streak_xp integer not null default 0,
  level integer not null default 1,
  title text not null default 'New Explorer',
  next_rank text not null default 'Builder',
  xp_to_next_rank integer not null default 500,
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
