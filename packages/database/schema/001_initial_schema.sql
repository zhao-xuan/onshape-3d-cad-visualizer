CREATE TABLE IF NOT EXISTS models (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  onshape_document_id VARCHAR(100),
  source_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cad_revisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  model_id UUID REFERENCES models(id) ON DELETE CASCADE,
  document_id VARCHAR(100) NOT NULL,
  workspace_id VARCHAR(100) NOT NULL,
  version_id VARCHAR(100),
  microversion_id INTEGER,
  element_id TEXT,
  sync_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  source_url TEXT NOT NULL,
  component_ids TEXT[] NOT NULL DEFAULT '{}',
  structure_hash VARCHAR(64) NOT NULL,
  geometry_hash VARCHAR(64) NOT NULL,
  raw_snapshot JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cad_occurrences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  revision_id UUID REFERENCES cad_revisions(id) ON DELETE CASCADE,
  cad_component_id VARCHAR(100) NOT NULL,
  occurrence_path TEXT[] NOT NULL,
  parent_occurrence_id UUID REFERENCES cad_occurrences(id) ON DELETE SET NULL,
  transform FLOAT[16] NOT NULL DEFAULT '{1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1}',
  bounding_box_min FLOAT[3],
  bounding_box_max FLOAT[3],
  is_suppressed BOOLEAN DEFAULT FALSE,
  source_document_id VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS component_definitions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  model_id UUID REFERENCES models(id) ON DELETE CASCADE,
  cad_component_id TEXT, -- Optional mapping to CAD entity
  display_name VARCHAR(255),
  part_number VARCHAR(100),
  category VARCHAR(100),
  tags TEXT[] DEFAULT '{}',
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  functionality TEXT,
  description TEXT,
  material VARCHAR(255),
  weight_grams DECIMAL(10,2),
  manual_dimensions JSONB, -- {width, height, depth, unit}
  custom_specs JSONB DEFAULT '{}', -- Array of spec objects
  engineering_notes TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cad_entity_mappings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  model_id UUID REFERENCES models(id) ON DELETE CASCADE,
  cad_component_id TEXT NOT NULL,
  component_definition_id UUID REFERENCES component_definitions(id) ON DELETE SET NULL,
  is_confident BOOLEAN DEFAULT FALSE,
  review_required BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sync_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  model_id UUID REFERENCES models(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'completed', 'failed')),
  error_message TEXT,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS component_changes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  revision_id UUID REFERENCES cad_revisions(id) ON DELETE CASCADE,
  occurrence_id UUID REFERENCES cad_occurrences(id) ON DELETE SET NULL,
  component_definition_id UUID REFERENCES component_definitions(id) ON DELETE SET NULL,
  change_type VARCHAR(30) NOT NULL CHECK (change_type IN ('added', 'removed', 'geometry', 'transform', 'metadata', 'renamed')),
  previous_value JSONB,
  new_value JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_models_slug ON models(slug);
CREATE INDEX idx_revisions_model_id ON cad_revisions(model_id);
CREATE INDEX idx_occurrences_revision_id ON cad_occurrences(revision_id);
CREATE INDEX idx_component_definitions_model_status ON component_definitions(model_id, status);
CREATE INDEX idx_entity_mappings_cad_component ON cad_entity_mappings(cad_component_id);
CREATE INDEX idx_sync_jobs_model_status ON sync_jobs(model_id, status);
