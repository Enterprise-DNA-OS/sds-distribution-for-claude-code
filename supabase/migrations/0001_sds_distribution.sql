create function touch_updated() returns trigger language plpgsql as $$ begin new.updated_at=now(); return new; end $$;
create table products(id uuid primary key default gen_random_uuid(), sku text not null unique check(length(trim(sku))>0), name text not null, supplier text not null, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table sheets(id uuid primary key default gen_random_uuid(), product_id uuid not null references products(id), country text not null check(country in ('NZ','AU')), language text not null default 'en', version text not null, issued_on date not null check(issued_on <= current_date), source_url text not null, owned_url text, sha256 text, archive_path text, status text not null default 'unverified' check(status in ('unverified','approved')), reviewer text, review_ref text, reviewed_on date, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(product_id,country,language,version), check(status='unverified' or (length(trim(reviewer))>0 and length(trim(review_ref))>0 and owned_url like 'https://%' and sha256 ~ '^[a-f0-9]{64}$' and archive_path is not null and reviewed_on is not null)));
create table customers(id uuid primary key default gen_random_uuid(), name text not null unique, contact text not null, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table subscriptions(id uuid primary key default gen_random_uuid(), customer_id uuid not null references customers(id), product_id uuid not null references products(id), country text not null check(country in ('NZ','AU')), language text not null default 'en', first_supplied date not null check(first_supplied<=current_date), created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(customer_id,product_id,country,language));
create table deliveries(id uuid primary key default gen_random_uuid(), subscription_id uuid not null references subscriptions(id), sheet_id uuid not null references sheets(id), delivered_on date not null check(delivered_on<=current_date), evidence text not null check(length(trim(evidence))>0), actor text not null check(length(trim(actor))>0), created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(subscription_id,sheet_id));
create table requests(id uuid primary key default gen_random_uuid(), subscription_id uuid not null references subscriptions(id), due_on date not null, reason text not null, status text not null default 'open' check(status in ('open','closed')), resolution_ref text, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table activity(id uuid primary key default gen_random_uuid(), entity text not null, entity_id uuid, action text not null, actor text not null, note text not null, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table imports(id uuid primary key default gen_random_uuid(), fingerprint text not null unique, source_name text not null, rows_count integer not null, actor text not null, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create index sheets_product on sheets(product_id,country,language,issued_on);
create index deliveries_subscription on deliveries(subscription_id);
create index requests_status on requests(status,due_on);
create view current_sheets as select distinct on(product_id,country,language) * from sheets where status='approved' order by product_id,country,language,issued_on desc,created_at desc,id;
create view distribution_queue as
 select s.id, c.name customer,p.sku,p.name product,s.country,s.language,s.first_supplied,
 sh.id sheet_id,sh.version,sh.issued_on,sh.owned_url,sh.reviewed_on,
 case when sh.id is null then 'No approved sheet'
 when sh.issued_on <= (current_date-interval '5 years')::date then 'Supplier review overdue'
 when d.id is null and exists(select 1 from deliveries old where old.subscription_id=s.id) then 'Revision needs delivery evidence'
 when d.id is null then 'First supply needs delivery evidence'
 else 'Current delivery recorded' end issue
 from subscriptions s join customers c on c.id=s.customer_id join products p on p.id=s.product_id
 left join current_sheets sh on sh.product_id=s.product_id and sh.country=s.country and sh.language=s.language
 left join deliveries d on d.subscription_id=s.id and d.sheet_id=sh.id;
create view review_queue as select sh.id,p.sku,p.name product,sh.country,sh.language,sh.version,sh.status,sh.issued_on,
 case when sh.status='unverified' then 'Verify supplier document and owned copy' else 'Ask supplier for current review' end issue
 from sheets sh join products p on p.id=sh.product_id
 where sh.status='unverified' or sh.issued_on <= (current_date-interval '5 years'+interval '60 days')::date;
create view request_queue as select r.id,c.name customer,p.sku,r.reason,r.due_on,r.status,
 (r.due_on<current_date) overdue from requests r join subscriptions s on s.id=r.subscription_id
 join customers c on c.id=s.customer_id join products p on p.id=s.product_id where r.status='open';
create trigger touch_products before update on products for each row execute function touch_updated();
alter table products enable row level security;
revoke all on products from public;
create trigger touch_sheets before update on sheets for each row execute function touch_updated();
alter table sheets enable row level security;
revoke all on sheets from public;
create trigger touch_customers before update on customers for each row execute function touch_updated();
alter table customers enable row level security;
revoke all on customers from public;
create trigger touch_subscriptions before update on subscriptions for each row execute function touch_updated();
alter table subscriptions enable row level security;
revoke all on subscriptions from public;
create trigger touch_deliveries before update on deliveries for each row execute function touch_updated();
alter table deliveries enable row level security;
revoke all on deliveries from public;
create trigger touch_requests before update on requests for each row execute function touch_updated();
alter table requests enable row level security;
revoke all on requests from public;
create trigger touch_activity before update on activity for each row execute function touch_updated();
alter table activity enable row level security;
revoke all on activity from public;
create trigger touch_imports before update on imports for each row execute function touch_updated();
alter table imports enable row level security;
revoke all on imports from public;
revoke all on current_sheets,distribution_queue,review_queue,request_queue from public;
