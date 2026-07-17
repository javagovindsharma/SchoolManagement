-- Fix NOT NULL constraints that should be nullable for simple fee collection
-- Run this manually on your database:
-- psql -U postgres -d dps_school_db -f fix_constraints.sql

ALTER TABLE fee_payments ALTER COLUMN fee_structure_id DROP NOT NULL;
ALTER TABLE fee_payments ALTER COLUMN academic_year_id DROP NOT NULL;
ALTER TABLE fee_payments ALTER COLUMN student_id DROP NOT NULL;
