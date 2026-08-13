/** Database client - exports schema types and SQL primitives from drizzle-orm */
export * as schema from './schema';
export { CadModelRepository } from './db-repository';
export { initDatabase, query, getClient } from './connection';

// Re-export all drizzle types for convenience in apps
export type { 
  cadModels, 
  cadSources, 
  cadRevisions,
  componentDefinitions, 
  componentOccurrences, 
  cadEntityMappings,
  componentSpecifications
} from './schema';
