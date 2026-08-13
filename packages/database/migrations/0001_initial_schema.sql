-- Create tables for Onshape CAD Visualizer Platform

CREATE TABLE IF NOT EXISTS cad_models (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(256) NOT NULL,
    slug VARCHAR(128) UNIQUE NOT NULL,
    description TEXT,
    cad_model_id UUID REFERENCES cad_sources(id),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cad_sources (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(256) NOT NULL,
    source_type VARCHAR(32) DEFAULT 'onshape' NOT NULL,
    document_id VARCHAR(64),
    workspace_id VARCHAR(32),
    base_url VARCHAR(1024),
    connection_metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cad_revisions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    model_id UUID REFERENCES cad_models(id) ON DELETE CASCADE,
    source_id TEXT NOT NULL,
    revision_number VARCHAR(32),
    metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
    structure_hash TEXT,
    geometry_hash TEXT,
    sync_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    source_url VARCHAR(2048) NOT NULL
);

CREATE TABLE IF NOT EXISTS component_definitions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    cad_model_id UUID REFERENCES cad_models(id) ON DELETE CASCADE,
    display_name VARCHAR(128) NOT NULL,
    part_number VARCHAR(64),
    category VARCHAR(64),
    tags JSONB DEFAULT '[]'::jsonb NOT NULL,
    short_description TEXT,
    description TEXT,
    functionality TEXT,
    material TEXT,
    custom_metadata JSONB DEFAULT '{}'::jsonb,
    publication_status VARCHAR(16) DEFAULT 'draft' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS component_occurrences (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    cad_revision_id UUID REFERENCES cad_revisions(id) ON DELETE CASCADE,
    component_definition_id UUID REFERENCES component_definitions(id) ON DELETE SET NULL,
    cad_component_id TEXT,
    occurrence_path JSONB NOT NULL,
    parent_occurrence_id UUID REFERENCES component_occurrences(id) ON DELETE CASCADE,
    transform JSONB NOT NULL,
    is_suppressed BOOLEAN DEFAULT FALSE NOT NULL,
    is_visible BOOLEAN DEFAULT TRUE NOT NULL,
    source_document_url TEXT
);

CREATE TABLE IF NOT EXISTS cad_entity_mappings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    cad_revision_id UUID REFERENCES cad_revisions(id) ON DELETE CASCADE,
    component_definition_id UUID REFERENCES component_definitions(id) ON DELETE SET NULL,
    cad_component_id TEXT NOT NULL,
    matches_previously_mapped BOOLEAN DEFAULT FALSE,
    mapping_confidence VARCHAR(16),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE (cad_revision_id, cad_component_id)
);

-- Create indexes for performance optimization
CREATE INDEX idx_cad_models_slug ON cad_models(slug);
CREATE INDEX idx_cad_models_cad_model_id ON cad_models(cad_model_id);

CREATE INDEX idx_cad_sources_document_id ON cad_sources(document_id);

CREATE INDEX idx_cad_revisions_model_id ON cad_revisions(model_id);
CREATE INDEX idx_cad_revisions_structure_hash ON cad_revisions(structure_hash);
CREATE INDEX idx_cad_revisions_sync_timestamp ON cad_revisions(sync_timestamp);

CREATE INDEX idx_component_definitions_cad_model_id ON component_definitions(cad_model_id);
CREATE INDEX idx_component_definitions_status ON component_definitions(publication_status, cad_model_id);

CREATE INDEX idx_component_occurrences_cad_revision_id ON component_occurrences(cad_revision_id);
CREATE INDEX idx_component_occurrence_cad_component_id ON component_occurrences(cad_component_id);
CREATE INDEX idx_component_occureances_parent_idx ON component_occurrences(parent_occurrence_id);

CREATE INDEX idx_ecmappings_cad_revision_id ON cad_entity_mappings(cad_revision_id);
CREATE INDEX idx_ecmappings_component_def ON cad_entity_mappings(component_definition_id);

