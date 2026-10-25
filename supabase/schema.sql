-- Auto-generated snapshot — do not edit directly. Run migrations instead.
-- Apply individual files in supabase/migrations/ in order to set up a fresh database.

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  public_token text not null unique,
  status text not null default 'draft'
    check (status in ('draft', 'previewing', 'paid', 'published', 'expired')),
  config jsonb not null,
  price_in_paise integer not null,
  pin_code text not null,
  razorpay_order_id text,
  razorpay_payment_id text,
  owner_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create index if not exists orders_slug_idx on orders (slug);
create index if not exists orders_status_idx on orders (status);
create index if not exists orders_owner_created_idx on orders (owner_id, created_at desc);

-- Row Level Security: no direct client access. All reads/writes go through
-- the server (service role key), so the browser can never query this table
-- directly, even with the anon key.
alter table orders enable row level security;

-- "Build it for me" leads — the manual/concierge fulfillment path that now
-- sits alongside the self-serve builder for every tier (not just Tier 4).
-- Deliberately looser than `orders`: no config jsonb, no pin, no payment
-- columns, because nothing here gets rendered or published automatically —
-- a human reads this row and builds the page by hand.
create table if not exists manual_requests (
  id uuid primary key default gen_random_uuid(),
  tier text not null check (tier in ('tier1', 'tier2', 'tier3', 'tier4')),
  recipient_name text not null,
  contact_email text not null,
  sender_name text,
  occasion text,
  message text,
  notes text,
  status text not null default 'new'
    check (status in ('new', 'in_progress', 'delivered')),
  created_at timestamptz not null default now()
);

create index if not exists manual_requests_status_idx on manual_requests (status);
create index if not exists manual_requests_created_at_idx on manual_requests (created_at desc);

alter table manual_requests enable row level security;

create table if not exists rate_limit_buckets (
  key text not null,
  window_start bigint not null,
  count integer not null default 1,
  primary key (key, window_start)
);

create table if not exists admin_actions (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null,
  action text not null,
  target_type text not null,
  target_id text not null,
  details jsonb,
  created_at timestamptz not null default now()
);

create index if not exists admin_actions_target_idx on admin_actions (target_type, target_id);
create index if not exists admin_actions_created_at_idx on admin_actions (created_at desc);

alter table admin_actions enable row level security;

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  preferred_contact text not null default 'email' check (preferred_contact in ('email', 'phone', 'whatsapp')),
  contact_consent boolean not null default false,
  source text not null default 'checkout',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists customers_email_lower_idx on customers (lower(email));
create index if not exists customers_created_at_idx on customers (created_at desc);
alter table customers enable row level security;

alter table orders add column if not exists customer_id uuid references customers(id) on delete set null;
alter table orders add column if not exists fulfillment_status text not null default 'awaiting_payment'
  check (fulfillment_status in ('awaiting_payment', 'paid', 'in_production', 'needs_customer', 'ready', 'delivered', 'cancelled', 'refunded'));
alter table orders add column if not exists occasion text;
alter table orders add column if not exists relationship text;
alter table orders add column if not exists tone text;
alter table orders add column if not exists preferred_language text;
alter table orders add column if not exists requested_delivery_at timestamptz;
alter table orders add column if not exists special_requests text;
alter table orders add column if not exists internal_notes text;
alter table orders add column if not exists expires_at timestamptz;

alter table manual_requests add column if not exists contact_phone text;
alter table manual_requests add column if not exists preferred_contact text not null default 'email'
  check (preferred_contact in ('email', 'phone', 'whatsapp'));
alter table manual_requests add column if not exists contact_consent boolean not null default false;
alter table manual_requests add column if not exists relationship text;
alter table manual_requests add column if not exists tone text;
alter table manual_requests add column if not exists preferred_language text;
alter table manual_requests add column if not exists requested_delivery_at timestamptz;
alter table manual_requests add column if not exists internal_notes text;

create table if not exists traffic_daily (
  visit_date date primary key,
  page_views integer not null default 0,
  unique_visitors integer not null default 0,
  updated_at timestamptz not null default now()
);
create table if not exists traffic_daily_uniques (
  visit_date date not null,
  visitor_hash text not null,
  created_at timestamptz not null default now(),
  primary key (visit_date, visitor_hash)
);
create table if not exists site_settings (
  key text primary key,
  value jsonb not null,
  updated_by uuid,
  updated_at timestamptz not null default now()
);
alter table traffic_daily enable row level security;
alter table traffic_daily_uniques enable row level security;
alter table site_settings enable row level security;
