-- Migrations tracking table
CREATE TABLE IF NOT EXISTS public.migrations (
    id SERIAL PRIMARY KEY,
    migration_name VARCHAR(255) UNIQUE NOT NULL,
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Record initial schema migration
INSERT INTO public.migrations (migration_name) 
VALUES ('001_initial_schema')
ON CONFLICT (migration_name) DO NOTHING;
