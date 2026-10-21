alter table sheets drop constraint sheets_status_check;
alter table sheets add constraint sheets_status_check check(status in ('unverified','approved','rejected'));
create or replace view distribution_queue as
 select s.id, c.name customer,p.sku,p.name product,s.country,s.language,s.first_supplied,
 sh.id sheet_id,sh.version,sh.issued_on,sh.owned_url,sh.reviewed_on,
 case when sh.id is null then 'No approved sheet'
 when exists(select 1 from sheets pending where pending.product_id=s.product_id and pending.country=s.country and pending.language=s.language and pending.status='unverified' and pending.issued_on>=sh.issued_on) then 'New revision awaiting review'
 when sh.issued_on <= (current_date-interval '5 years')::date then 'Supplier review overdue'
 when d.id is null and exists(select 1 from deliveries old where old.subscription_id=s.id) then 'Revision needs delivery evidence'
 when d.id is null then 'First supply needs delivery evidence'
 else 'Current delivery recorded' end issue
 from subscriptions s join customers c on c.id=s.customer_id join products p on p.id=s.product_id
 left join current_sheets sh on sh.product_id=s.product_id and sh.country=s.country and sh.language=s.language
 left join deliveries d on d.subscription_id=s.id and d.sheet_id=sh.id;
