-- Lexid Investor Hub v1 · safe, idempotent schema · no destructive statements
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS ir_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,sector TEXT NOT NULL,stage TEXT NOT NULL DEFAULT 'planning',
  priority TEXT NOT NULL DEFAULT 'P2' CHECK (priority IN ('P0','P1','P2','P3')),
  summary TEXT NOT NULL DEFAULT '',public_summary TEXT NOT NULL DEFAULT '',
  repo_url TEXT,deck_url TEXT,website_url TEXT,validation_note TEXT NOT NULL DEFAULT '',
  public_enabled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS ir_investors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),name TEXT NOT NULL,firm TEXT NOT NULL DEFAULT '',
  sector TEXT NOT NULL DEFAULT '',stage TEXT NOT NULL DEFAULT '',website_url TEXT,
  email TEXT,contact_channel TEXT NOT NULL DEFAULT 'manual',
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','qualified','contacted','replied','meeting','inactive')),
  notes TEXT NOT NULL DEFAULT '',created_at TIMESTAMPTZ NOT NULL DEFAULT now(),updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS ir_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),name TEXT NOT NULL UNIQUE,organization TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'accelerator',website_url TEXT NOT NULL,
  deadline DATE,deadline_verified_at DATE,eligibility TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',status TEXT NOT NULL DEFAULT 'review_required',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS ir_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),project_id UUID NOT NULL REFERENCES ir_projects(id),
  investor_id UUID REFERENCES ir_investors(id), program_id UUID REFERENCES ir_programs(id),
  target_name TEXT NOT NULL DEFAULT '',target_url TEXT,
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned','researching','draft','needs_review','submitted','follow_up','meeting','rejected','won','withdrawn')),
  contact_date DATE,follow_up_date DATE,submitted_at TIMESTAMPTZ,
  owner_note TEXT NOT NULL DEFAULT '',evidence_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT ir_application_target CHECK (target_name <> '' OR investor_id IS NOT NULL OR program_id IS NOT NULL)
);
CREATE TABLE IF NOT EXISTS ir_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),project_id UUID NOT NULL REFERENCES ir_projects(id),
  title TEXT NOT NULL,kind TEXT NOT NULL DEFAULT 'pitch_deck',source_type TEXT NOT NULL DEFAULT 'drive',
  source_url TEXT NOT NULL,verified BOOLEAN NOT NULL DEFAULT false,
  confidential BOOLEAN NOT NULL DEFAULT true,
  version_label TEXT NOT NULL DEFAULT '',created_at TIMESTAMPTZ NOT NULL DEFAULT now(),updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT ir_documents_unique UNIQUE(project_id,source_url)
);
CREATE TABLE IF NOT EXISTS ir_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),project_id UUID NOT NULL REFERENCES ir_projects(id),
  title TEXT NOT NULL,description TEXT NOT NULL DEFAULT '',severity TEXT NOT NULL DEFAULT 'P1' CHECK (severity IN ('P0','P1','P2','P3')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','in_review','resolved')),
  evidence_url TEXT,created_at TIMESTAMPTZ NOT NULL DEFAULT now(),updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT ir_issues_unique UNIQUE(project_id,title)
);
CREATE TABLE IF NOT EXISTS ir_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),actor_email TEXT NOT NULL,
  resource TEXT NOT NULL,resource_id UUID,operation TEXT NOT NULL,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ir_applications_project_idx ON ir_applications(project_id,status);
CREATE INDEX IF NOT EXISTS ir_documents_project_idx ON ir_documents(project_id);
CREATE INDEX IF NOT EXISTS ir_issues_project_idx ON ir_issues(project_id,severity);
CREATE INDEX IF NOT EXISTS ir_programs_deadline_idx ON ir_programs(deadline);
-- Re-run safe; prevents duplicate investor records with the same normalized email.
CREATE UNIQUE INDEX IF NOT EXISTS ir_investors_email_unique_idx
  ON ir_investors(lower(email)) WHERE email IS NOT NULL AND trim(email)<>'';
