alter table sheets drop constraint sheets_check;
alter table sheets add constraint sheets_review_evidence check (
 status='unverified' or
 (status='rejected' and coalesce(length(trim(reviewer))>0 and length(trim(review_ref))>0 and reviewed_on is not null,false)) or
 (status='approved' and coalesce(length(trim(reviewer))>0 and length(trim(review_ref))>0 and owned_url like 'https://%' and sha256 ~ '^[a-f0-9]{64}$' and archive_path is not null and reviewed_on is not null,false))
);
