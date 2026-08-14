-- CPC authorization regression tests.
-- Execute against a disposable/test Supabase database with the approved auth fixtures.
-- These tests intentionally assert deny-by-default boundaries; they do not weaken RLS.

begin;

-- Anonymous callers must not read CPC domain tables.
set local role anon;
select plan(8);
select throws_ok($$select * from public.clients limit 1$$, '42501', null, 'anonymous client access denied');
select throws_ok($$select * from public.properties limit 1$$, '42501', null, 'anonymous property access denied');
select throws_ok($$select * from public.inspections limit 1$$, '42501', null, 'anonymous inspection access denied');
select throws_ok($$select * from public.issues limit 1$$, '42501', null, 'anonymous issue access denied');
select throws_ok($$select * from public.vendors limit 1$$, '42501', null, 'anonymous vendor access denied');
select throws_ok($$select * from public.inspection_reports limit 1$$, '42501', null, 'anonymous report access denied');
select throws_ok($$select * from public.property_contacts limit 1$$, '42501', null, 'anonymous contact access denied');
select throws_ok($$select * from public.profiles limit 1$$, '42501', null, 'anonymous profile access denied');
select * from finish();

rollback;
