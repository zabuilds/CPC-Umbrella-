-- CPC authorization regression checks.
-- These are executable SQL assertions for a test database with RLS enabled.
-- The checks use row-count expectations because RLS filters unauthorized rows.

begin;

create temporary table cpc_auth_test_results (
  test_name text primary key,
  passed boolean not null,
  details text
);

-- Anonymous reads must return no CPC domain rows.
set local role anon;

insert into cpc_auth_test_results
select 'anon clients denied', not exists (select 1 from public.clients), 'RLS must filter anonymous clients';
insert into cpc_auth_test_results
select 'anon properties denied', not exists (select 1 from public.properties), 'RLS must filter anonymous properties';
insert into cpc_auth_test_results
select 'anon inspections denied', not exists (select 1 from public.inspections), 'RLS must filter anonymous inspections';
insert into cpc_auth_test_results
select 'anon issues denied', not exists (select 1 from public.issues), 'RLS must filter anonymous issues';
insert into cpc_auth_test_results
select 'anon vendors denied', not exists (select 1 from public.vendors), 'RLS must filter anonymous vendors';
insert into cpc_auth_test_results
select 'anon reports denied', not exists (select 1 from public.inspection_reports), 'RLS must filter anonymous reports';
insert into cpc_auth_test_results
select 'anon contacts denied', not exists (select 1 from public.property_contacts), 'RLS must filter anonymous contacts';
insert into cpc_auth_test_results
select 'anon profiles denied', not exists (select 1 from public.profiles), 'RLS must filter anonymous profiles';

select * from cpc_auth_test_results order by test_name;
select case when bool_and(passed) then 1 else 0 end as all_tests_passed from cpc_auth_test_results;

rollback;
