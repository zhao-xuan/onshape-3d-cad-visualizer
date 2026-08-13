/** Repository layer for DB access using drizzle-orm */
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.js';

// Type extraction utilities  
export type CadModel = typeof schema.cadModels.$inferSelect;
export type NewCadModel = typeof schema.cadModels.$inferInsert;

export type ComponentDefinitionRow = typeof schema.componentDefinitions.$inferSelect;
export type NewComponentDefinition = typeof schema.componentDefinitions.$inferInsert;

export type ComponentOccurrenceRow = typeof schema.componentOccurrences.$inferSelect;
export type NewComponentOccurrence = typeof schema.componentOccurrences.$inferInsert;

/** Repository operations interface for CadModel */
export interface ICadModelRepository {
  create(data: NewCadModel): Promise<CadModel>;
  getById(id: string): Promise<CadModel | null>;
  list(): Promise<CadModel[]>;
  delete(id: string): Promise<void>;
}

/** Repository operations for component definitions */
export interface IComponentDefinitionRepository {
  create(data: NewComponentDefinition): Promise<ComponentDefinitionRow>;
  getById(id: string): Promise<ComponentDefinitionRow | null>;
  listByModel(modelId: string): Promise<ComponentDefinitionRow[]>;
  updateStatus(id: string, status: 'draft' | 'published'): Promise<void>;
}

/** Cad Model Repository implementation */
export class CadModelRepository {
  private db: ReturnType<typeof drizzle>;
  
  constructor(private readonly sql: postgres.Sql) {
    this.db = drizzle(sql, { schema });
  }
  
  /** Create a new CAD model entry - called when user first registers an Onshape document */
  async create(data: NewCadModel): Promise<CadModel> {
    const [model] = await this.db.insert(schema.cadModels).values(data).returning();
    return JSON.parse(JSON.stringify(model));
  }
  
  /** Get a model by ID - used to load the viewer or admin form */
  async getById(id: string): Promise<CadModel | null> {
    const result = await this.db.query.cadModels.findFirst({
      where: (m, { eq }) => eq(m.id, id)
    });
    
    return result ? JSON.parse(JSON.stringify(result)) : null;
  }
  
  /** List all CAD models - for dashboard/home page */
  async list(): Promise<CadModel[]> {
    const results = await this.db.select().from(schema.cadModels).orderBy(
      (m) => m.createdAt, 
      'desc'
    );
    
    return JSON.parse(JSON.stringify(results));
  }
  
  /** Delete a model and cascade all related data */
  async delete(id: string): Promise<void> {
    await this.db.delete(schema.cadModels).where(
      (m) => schema.cadModels.id.eq(id),     
    );
  }
}

/** Component Repository operations - for managing component definitions independently from CAD geometry */
export class ComponentDefinitionRepository implements IComponentDefinitionRepository {
  private db: ReturnType<typeof drizzle>;
  
  constructor(private readonly sql: postgres.Sql) {
    this.db = drizzle(sql, { schema });
  }
  
  async create(data: NewComponentDefinition): Promise<ComponentDefinitionRow> {
    const [def] = await this.db.insert(schema.componentDefinitions)
      .values({ ...data })
      .returning();
    
    return JSON.parse(JSON.stringify(def));
  }
  
  async getById(id: string): Promise<ComponentDefinitionRow | null> {
    const result = await this.db.query.componentDefinitions.findFirst({
      where: (t, o) => o.eq(t.id, id) 
    });
    return result ? JSON.parse(JSON.stringify(result)) : null;
  }
  
  /** List all component definitions for a specific CAD model */
  async listByModel(modelId: string): Promise<ComponentDefinitionRow[]> {
    const results = await this.db.query.componentDefinitions.findMany({ 
      where: (t, o) => o.eq(t.cadModelId, modelId),
      orderBy: (t) => t.displayName
    });
    
    return JSON.parse(JSON.stringify(results));
  }
  
  /** Update publication status of a component - used by the admin UI */
  async updateStatus(id: string, status: 'draft' | 'published'): Promise<void> {
    await this.db.update(schema.componentDefinitions)
      .set({ 
        publicationStatus: status,
        updatedAt: new Date() 
      })
      .where(schema.componentDefinitions.id.eq(id));
  }
}
