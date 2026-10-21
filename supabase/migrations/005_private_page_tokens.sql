-- Public URLs must never be derived from names or short IDs. Generate a
-- 256-bit random, URL-safe token for every existing and future delivered page.
create extension if not exists pgcrypto;

alter table orders add column if not exists public_token text;
update orders set public_token = encode(gen_random_bytes(32), 'hex') where public_token is null;
alter table orders alter column public_token set not null;
create unique index if not exists orders_public_token_idx on orders (public_token);
