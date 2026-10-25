-- Customer operations, fulfillment tracking, and privacy-conscious traffic analytics.

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  preferred_contact text not null default 'email'
    check (preferred_contact in ('email', 'phone', 'whatsapp')),
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

create index if not exists orders_customer_idx on orders (customer_id);
create index if not exists orders_fulfillment_idx on orders (fulfillment_status, created_at desc);

alter table manual_requests add column if not exists contact_phone text;
alter table manual_requests add column if not exists preferred_contact text not null default 'email'
  check (preferred_contact in ('email', 'phone', 'whatsapp'));
alter table manual_requests add column if not exists contact_consent boolean not null default false;
alter table manual_requests add column if not exists relationship text;
alter table manual_requests add column if not exists tone text;
alter table manual_requests add column if not exists preferred_language text;
alter table manual_requests add column if not exists requested_delivery_at timestamptz;
alter table manual_requests add column if not exists internal_notes text;

-- Aggregates remain durable while daily salted hashes prevent storing raw IPs
-- or a long-lived browsing history.
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

insert into site_settings (key, value)
values ('visitor_count', '{"mode":"actual","customCount":0}'::jsonb)
on conflict (key) do nothing;

alter table traffic_daily enable row level security;
alter table traffic_daily_uniques enable row level security;
alter table site_settings enable row level security;

create or replace function increment_traffic(p_visit_date date, p_is_unique boolean)
returns void
language sql
security definer
set search_path = public
as $$
  insert into traffic_daily (visit_date, page_views, unique_visitors, updated_at)
  values (p_visit_date, 1, case when p_is_unique then 1 else 0 end, now())
  on conflict (visit_date) do update set
    page_views = traffic_daily.page_views + 1,
    unique_visitors = traffic_daily.unique_visitors + case when p_is_unique then 1 else 0 end,
    updated_at = now();
$$;
