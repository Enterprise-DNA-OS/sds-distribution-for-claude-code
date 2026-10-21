insert into products(id,sku,name,supplier) values
('10000000-0000-4000-8000-000000000001','DEMO-CLEAN','Demo workshop cleaner','Fictional Supply Co'),
('10000000-0000-4000-8000-000000000002','DEMO-COOL','Demo coolant','Fictional Supply Co'),
('10000000-0000-4000-8000-000000000003','DEMO-WASH','Demo wash concentrate','Example Chemicals') on conflict do nothing;
insert into customers(id,name,contact) values
('20000000-0000-4000-8000-000000000001','Example Harbour Depot','operations@example.invalid'),
('20000000-0000-4000-8000-000000000002','Example Valley Warehouse','warehouse@example.invalid'),
('20000000-0000-4000-8000-000000000003','Example Harbour Service','service@example.invalid') on conflict do nothing;
insert into sheets(id,product_id,country,language,version,issued_on,source_url,owned_url,sha256,archive_path,status,reviewer,review_ref,reviewed_on) values
('30000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001','NZ','en','demo-v1',current_date-500,'https://supplier.example.invalid/clean-v1.pdf','https://docs.example.invalid/clean-v1.pdf',repeat('a',64),'DEMO-ONLY','approved','Demo reviewer','DEMO review 1',current_date-490),
('30000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000001','NZ','en','demo-v2',current_date-10,'https://supplier.example.invalid/clean-v2.pdf','https://docs.example.invalid/clean-v2.pdf',repeat('b',64),'DEMO-ONLY','approved','Demo reviewer','DEMO review 2',current_date-9),
('30000000-0000-4000-8000-000000000003','10000000-0000-4000-8000-000000000002','AU','en','demo-old', (current_date-interval '6 years')::date,'https://supplier.example.invalid/cool.pdf','https://docs.example.invalid/cool.pdf',repeat('c',64),'DEMO-ONLY','approved','Demo reviewer','DEMO review 3',current_date-10),
('30000000-0000-4000-8000-000000000004','10000000-0000-4000-8000-000000000003','NZ','en','demo-pending',current_date-20,'https://supplier.example.invalid/wash.pdf',null,null,null,'unverified',null,null,null) on conflict do nothing;
insert into subscriptions(id,customer_id,product_id,country,language,first_supplied) values
('40000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001','NZ','en',current_date-100),
('40000000-0000-4000-8000-000000000002','20000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000001','NZ','en',current_date-2),
('40000000-0000-4000-8000-000000000003','20000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000002','AU','en',current_date-100),
('40000000-0000-4000-8000-000000000004','20000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000003','NZ','en',current_date-5),
('40000000-0000-4000-8000-000000000005','20000000-0000-4000-8000-000000000003','10000000-0000-4000-8000-000000000001','AU','en',current_date-4) on conflict do nothing;
insert into deliveries(id,subscription_id,sheet_id,delivered_on,evidence,actor) values
('50000000-0000-4000-8000-000000000001','40000000-0000-4000-8000-000000000001','30000000-0000-4000-8000-000000000001',current_date-99,'DEMO receipt only','Demo operator') on conflict do nothing;
insert into requests(id,subscription_id,due_on,reason) values
('60000000-0000-4000-8000-000000000001','40000000-0000-4000-8000-000000000001',current_date-2,'Customer asked for current revision'),
('60000000-0000-4000-8000-000000000002','40000000-0000-4000-8000-000000000004',current_date+2,'Supplier document needs review') on conflict do nothing;
