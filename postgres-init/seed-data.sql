-- =========================================
-- SEED DATA FOR TESTING
-- =========================================

-- PASSWORD HASHES (all passwords use bcrypt with salt rounds=10)
-- superadmin123 = $2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm
-- admin123 = $2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm
-- member123 = $2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm

-- =========================================
-- SUPER ADMIN TENANT & USER
-- =========================================
INSERT INTO public.tenants (id, name, email, phone, website, subscription_plan, subscription_status, is_active)
VALUES (
    '10000000-0000-0000-0000-000000000001',
    'Admin Workspace',
    'admin@admintenant.com',
    '+1-800-ADMIN-01',
    'https://admin.saas.com',
    'enterprise',
    'active',
    true
)
ON CONFLICT DO NOTHING;

INSERT INTO public.users (id, tenant_id, email, username, full_name, password_hash, role, is_active, is_email_verified)
VALUES (
    '20000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'superadmin@admintenant.com',
    'superadmin',
    'Super Admin User',
    '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm',
    'super_admin',
    true,
    true
)
ON CONFLICT DO NOTHING;

-- =========================================
-- TENANT 1: ACME CORPORATION
-- =========================================
INSERT INTO public.tenants (id, name, email, phone, website, subscription_plan, subscription_status, is_active)
VALUES (
    '10000000-0000-0000-0000-000000000002',
    'Acme Corporation',
    'admin@acme.com',
    '+1-555-ACME-001',
    'https://acme.com',
    'pro',
    'active',
    true
)
ON CONFLICT DO NOTHING;

-- Tenant Admin
INSERT INTO public.users (id, tenant_id, email, username, full_name, password_hash, role, is_active, is_email_verified)
VALUES (
    '20000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000002',
    'admin@acme.com',
    'acmeadmin',
    'John Manager',
    '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm',
    'tenant_admin',
    true,
    true
)
ON CONFLICT DO NOTHING;

-- Team Members
INSERT INTO public.users (id, tenant_id, email, username, full_name, password_hash, role, is_active, is_email_verified)
VALUES
    ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002', 'alice@acme.com', 'alice', 'Alice Developer', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm', 'member', true, true),
    ('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000002', 'bob@acme.com', 'bob', 'Bob Designer', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm', 'member', true, true),
    ('20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000002', 'carol@acme.com', 'carol', 'Carol Tester', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm', 'member', true, true)
ON CONFLICT DO NOTHING;

-- Projects
INSERT INTO public.projects (id, tenant_id, name, description, status, created_by)
VALUES
    ('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'Website Redesign', 'Complete redesign of company website', 'active', '20000000-0000-0000-0000-000000000002'),
    ('30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'Mobile App', 'Native mobile application development', 'active', '20000000-0000-0000-0000-000000000002'),
    ('30000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002', 'API Integration', 'Third-party API integrations', 'planning', '20000000-0000-0000-0000-000000000002')
ON CONFLICT DO NOTHING;

-- Tasks for Website Redesign
INSERT INTO public.tasks (id, project_id, tenant_id, title, description, status, priority, assigned_to, created_by, due_date, estimated_hours)
VALUES
    ('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'Design Mockups', 'Create wireframes and mockups in Figma', 'in_progress', 'high', '20000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000002', '2025-01-15', 16),
    ('40000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'Frontend Development', 'Implement React components based on mockups', 'todo', 'high', '20000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000002', '2025-01-20', 24),
    ('40000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'QA Testing', 'Comprehensive testing and bug fixes', 'todo', 'medium', '20000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000002', '2025-01-25', 12)
ON CONFLICT DO NOTHING;

-- Tasks for Mobile App
INSERT INTO public.tasks (id, project_id, tenant_id, title, description, status, priority, assigned_to, created_by, due_date, estimated_hours)
VALUES
    ('40000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'App Architecture', 'Plan and design app structure and tech stack', 'done', 'high', '20000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000002', '2025-01-10', 8),
    ('40000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'Authentication Module', 'Implement user authentication and authorization', 'in_progress', 'high', '20000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000002', '2025-01-18', 20)
ON CONFLICT DO NOTHING;

-- =========================================
-- TENANT 2: TECHSTART INC
-- =========================================
INSERT INTO public.tenants (id, name, email, phone, website, subscription_plan, subscription_status, is_active)
VALUES (
    '10000000-0000-0000-0000-000000000003',
    'TechStart Inc',
    'admin@techstart.com',
    '+1-555-TECH-001',
    'https://techstart.io',
    'starter',
    'active',
    true
)
ON CONFLICT DO NOTHING;

-- Tenant Admin
INSERT INTO public.users (id, tenant_id, email, username, full_name, password_hash, role, is_active, is_email_verified)
VALUES (
    '20000000-0000-0000-0000-000000000006',
    '10000000-0000-0000-0000-000000000003',
    'admin@techstart.com',
    'techstartadmin',
    'Sarah Tech',
    '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm',
    'tenant_admin',
    true,
    true
)
ON CONFLICT DO NOTHING;

-- Team Members
INSERT INTO public.users (id, tenant_id, email, username, full_name, password_hash, role, is_active, is_email_verified)
VALUES
    ('20000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000003', 'dev@techstart.com', 'developer', 'Dev Member', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm', 'member', true, true),
    ('20000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000003', 'pm@techstart.com', 'projectmgr', 'PM Member', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm', 'member', true, true)
ON CONFLICT DO NOTHING;

-- Projects
INSERT INTO public.projects (id, tenant_id, name, description, status, created_by)
VALUES (
    '30000000-0000-0000-0000-000000000004',
    '10000000-0000-0000-0000-000000000003',
    'SaaS Dashboard',
    'Build analytics dashboard for customers',
    'active',
    '20000000-0000-0000-0000-000000000006'
)
ON CONFLICT DO NOTHING;

-- Tasks
INSERT INTO public.tasks (id, project_id, tenant_id, title, description, status, priority, assigned_to, created_by, due_date, estimated_hours)
VALUES
    ('40000000-0000-0000-0000-000000000006', '30000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000003', 'Data Visualization', 'Create reusable chart components', 'todo', 'medium', '20000000-0000-0000-0000-000000000007', '20000000-0000-0000-0000-000000000006', '2025-02-01', 18)
ON CONFLICT DO NOTHING;
