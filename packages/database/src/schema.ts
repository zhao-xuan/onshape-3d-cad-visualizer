// Database schema for CAD platform - defines core domain entities using Drizzle ORM
import { pgTable, uuid, text, varchar, boolean, jsonb, timestamp, decimal, index } from 'drizzle-orm/pg-core';

/** Models - Top-level representation of a linked Onshape document to the platform */
export const cadModels = pgTable('cad_models', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 256 }).notNull(),
  slug: varchar('slug', { length: 128 }).notNull().unique(),
  
  description: text('description'),
  
  /** Links to Onshape source */
  cadModelId: uuid('cad_model_id').references(() => cadSources.id),
  
  metadata: jsonb('metadata').$type<Record<string, any>>(),
  
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => {
  return {
    slugIdx: index('cad_models_slug_idx').on(table.slug),
    cadModelIdIdx: index('cad_models_cad_model_id_idx').on(table.cadModelId),
  };
});

/** CAD Sources - Links to Onshape documents or other CAD sources */
export const cadSources = pgTable('cad_sources', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 256 }).notNull(),
  
  /** Source type (onshape, import, etc.) */
  sourceType: varchar('source_type', { length: 32 }).notNull().default('onshape'),
  
  /** OnShape-specific fields */
  documentId: varchar('document_id', { length: 64 }),
  workspaceId: varchar('workspace_id', { length: 32 }),
  baseUrl: varchar('base_url', { length: 1024 }),
  
  connectionMetadata: jsonb('connection_metadata').$type<Record<string, any>>(),
  
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => {
  return {
    docIdx: index('cad_sources_document_id_idx').on(table.documentId),
  };
});

/** CAD Revisions - Each sync creates a new revision capturing a precise snapshot */
export const cadRevisions = pgTable('cad_revisions', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  modelId: uuid('model_id').references(() => cadModels.id, { onDelete: 'cascade' }).notNull(),
  
  /** Source information from CAD file */
  sourceId: text('source_id').notNull(), // Onshape element/doc ID
  
  revisionNumber: varchar('revision_number', { length: 32 }), // microversion/version number as string for compatibility

  metadata: jsonb('metadata').$type<Record<string, any>>().notNull().default({}),
  
  structureHash: text('structure_hash'), // Hash of assembly hierarchy
  
  geometryHash: text('geometry_hash'),  // Hash of combined geometry
  
  syncTimestamp: timestamp('sync_timestamp').notNull().defaultNow(),
  
  sourceUrl: varchar('source_url', { length: 2048 }).notNull(),
}, (table) => {
  return {
    modelIdIdx: index('cad_revisions_model_id_idx').on(table.modelId),
    structureHashIdx: index('cad_revisions_structure_hash_idx').on(table.structureHash),
    syncTimestampIdx: index('cad_revisions_sync_timestamp_idx').on(table.syncTimestamp),
  };
});

/** Component Specifications - Flexible custom specification fields */
export const componentSpecifications = pgTable('component_specifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  /** Link to definition (nullable for orphaned specs in transition) */
  componentDefinitionId: uuid('cad_component_id')
    .references(() => componentDefinitions.id, { onDelete: 'cascade' }),
  
  specificationKey: varchar('specification_key', { length: 64 }).notNull(),
  label: varchar('label', { length: 128 }), // Human-readable label if not from template
  
  /** Specification type determines UI rendering and validation */
  specType: varchar('spec_type', { 
    length: 16, 
    check: "spec_type IN ('text' OR 'number' OR 'boolean' OR 'select' OR 'url' OR 'measurement')" 
  }).notNull().default('text'),
  
  valueText: text('value_text'), // For string/select/url types
  
  valueNumber: decimal('value_number', { precision: 18, scale: 6 }), // For number/measurement types
  
  valueBoolean: boolean('value_boolean'), // For boolean type
  
  options: jsonb('options').$type<string[]>(), // For select dropdowns [option1, option2]
  
  unit: varchar('unit', { length: 16 }), // e.g., 'mm', 'kg', '%'; for measurement types
  
  order: integer('order').notNull().default(0), // Display ordering within spec panel
  
  templateId: text('template_id'), // Reference to standardized spec templates if applicable
}, (table) => {
  return {
    componentDefIdx: index('component_specs_component_idx').on(table.componentDefinitionId),
    keyUnique: pgTable.uniqueConstraints('componentSpecifications', {}).on(
      table.componentDefinitionId,
      table.specificationKey
    ),
    specTypeIdx: index('component_specs_type_idx').on(table.specType)
  };
});

/** Component Definitions - Logical component identity independent of CAD */
export const componentDefinitions = pgTable('component_definitions', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  cadModelId: uuid('cad_model_id').references(() => cadModels.id, { onDelete: 'cascade' }),
  
  /** Human-authored identifiers */
  displayName: varchar('display_name', { length: 128 }).notNull(),
  partNumber: varchar('part_number', { length: 64 }),
  
  category: varchar('category', { length: 64 }),
  tags: jsonb('tags').$type<string[]>().notNull().default([]),
  
  /** Documentation fields */
  shortDescription: text('short_description'),
  description: text('description'),       // Longer form documentation (markdown)
  functionality: text('functionality'),   // What does it do?
  
  /** Manual dimensions - user-entered, never overwritten by sync */
  manualWidth: decimal('manual_width', { precision: 10, scale: 2 }),
  manualHeight: decimal('manual_height', { precision: 10, scale: 2 }),
  manualDepth: decimal('manual_depth', { precision: 10, scale: 2 }),
  manualUnit: varchar('manual_unit', { length: 8 }).notNull().default('mm'),

  /** CAD auto-derived dimensions - from geometry, never overwrite manual */
  cadMinX: decimal('cad_min_x', { precision: 10, scale: 4 }),
  cadMaxX: decimal('cad_max_x', { precision: 10, scale: 4 }),
  cadMinY: decimal('cad_min_y', { precision: 10, scale: 4 }),
  cadMaxY: decimal('cad_max_y', { precision: 10, scale: 4 }),
  cadMinZ: decimal('cad_min_z', { precision: 10, scale: 4 }),
  cadMaxZ: decimal('cad_max_z', { precision: 10, scale: 4 }),

  /** Material and physical info - may be CAD-derived or manual override */
  material: text('material'),                     // Manual/material field
  customMetadata: jsonb('custom_metadata').$type<Record<string, any>>().default({}),
    
  publicationStatus: varchar('publication_status', { length: 16 }).notNull().default('draft'),
  
  featured: boolean('featured').notNull().default(false), // Hotspot indicator for viewer
    
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => {
  return {
    cadModelIdIdx: index('component_definitions_cad_model_id_idx').on(table.cadModelId),
    slugIdx: index('component_definitions_slug_idx').on(
      table.displayName.toLowerCase(),
      table.publicationStatus.eq('published')
    ),
    statusIdx: index('component_definitions_status_idx').on(
      table.publicationStatus,
      table.cadModelId
    ),
  };
});

/** Component Occurrences - Where a component exists within a specific CAD assembly */
export const componentOccurrences = pgTable('component_occurrences', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  cadRevisionId: uuid('cad_revision_id')
    .references(() => cadRevisions.id, { onDelete: 'cascade' })
    .notNull(),
  
  /** Links to ComponentDefinition (optional - can exist independently initially) */
  componentDefinitionId: uuid('component_definition_id').references(
    () => componentDefinitions.id, 
    { onDelete: 'set null', onUpdate: 'cascade' }
  ),
  
  /** CAD identifiers for identification */
  cadComponentId: text('cad_component_id'), // Onshape Part ID or geometry ID
  
  /** Occurrence in assembly hierarchy */
  occurrencePath: jsonb('occurrence_path').$type<string[]>().notNull(),
  parentOccurrenceId: uuid('parent_occurrence_id').references(
    () => componentOccurrences.id, 
    { onDelete: 'cascade' }
  ),
  
  transform: jsonb('transform').$type<number[][] | number[]>().notNull(),
  
  /** Visibility */
  isSuppressed: boolean('is_suppressed').notNull().default(false),
  isVisible: boolean('is_visible').notNull().default(true),
    
  sourceDocumentUrl: text('source_document_url'),
    
}, (table) => {
  return {
    cadRevisionIdIdx: index('component_occurrences_cad_revision_id_idx').on(table.cadRevisionId),
    cadComponentIdIdx: index('component_occurrence_cad_component_id_idx').on(table.cadComponentId),
    parentOccurrenceIdx: index('component_occurances_parent_idx').on(table.parentOccurrenceId),
  };
});

/** Mapping between CAD entities and component definitions (identity resolution) */
export const cadEntityMappings = pgTable('cad_entity_mappings', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  cadRevisionId: uuid('cad_revision_id')
    .references(() => cadRevisions.id, { onDelete: 'cascade' })
    .notNull(),
      
  componentDefinitionId: uuid('component_definition_id')
    .references(() => componentDefinitions.id, { onDelete: 'set null' }),
  
  cadComponentId: text('cad_component_id').notNull(), // The CAD identifier
  
  matchesPreviouslyMapped: boolean('matches_previously_mapped').default(false),
    
  /** Reasonable confidence - set by identity resolution system or manually flagged */
  mappingConfidence: varchar('mapping_confidence', { length: 16 }).$type<'high' | 'medium' | 'low' | null>().default(null),
  notes: text('notes'), // When mapping is ambiguous
  
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => {
  return {
    cadRevisionIdIdx: index('cad_entity_mappings_cad_revision_id_idx').on(table.cadRevisionId),
    componentDefIdx: index('cad_entity_mappings_component_def_idx').on(table.componentDefinitionId),
    cadComponentUnique: pgTable.uniqueConstraints('cadEntityMappings', {}).on(
      table.cadRevisionId, 
      table.cadComponentId
    ),
  };
});
