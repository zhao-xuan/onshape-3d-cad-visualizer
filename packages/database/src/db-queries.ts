import { PoolClient } from 'pg';

export interface CadRevisionData {
  id: string;
  model_id: string;
  document_id: string;
  workspace_id: string;
  version_id: string | null;
  microversion_id: number | null;
  element_id: string | null;
  sync_timestamp: Date;
  source_url: string;
  component_ids: string[];
  structure_hash: string;
  geometry_hash: string;
}

export interface CadOccurrenceData {
  id: string;
  revision_id: string;
  cad_component_id: string;
  occurrence_path: string[];
  parent_occurrence_id: string | null;
  transform: number[];
  bounding_box_min: number[] | null;
  bounding_box_max: number[] | null;
  is_suppressed: boolean;
}

export interface ComponentDefinitionData {
  id: string;
  model_id: string;
  cad_component_id: string | null;
  display_name: string | null;
  part_number: string | null;
  category: string | null;
  tags: string[];
  status: 'draft' | 'published';
  functionality: string | null;
  description: string | null;
}

// CRUD operations for revisions
export async function createRevision(client: PoolClient, data: {
  model_id: string;
  document_id: string;
  workspace_id: string;
  version_id?: string;
  microversion_id?: number;
  element_id?: string;
  source_url: string;
  component_ids: string[];
  structure_hash: string;
}): Promise<string> {
  const query = `
    INSERT INTO cad_revisions (model_id, document_id, workspace_id, version_id, microversion_id, 
      element_id, source_url, component_ids, structure_hash)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING id
  `;
  
  const values = [
    data.model_id,
    data.document_id,
    data.workspace_id,
    data.version_id || null,
    data.microversion_id || null,
    data.element_id || null,
    data.source_url,
    JSON.stringify(data.component_ids),
    data.structure_hash,
  ];

  const result = await client.query<Promise<{ id: string }>>(query, values);
  return result.rows[0].id;
}

export async function getRevision(client: PoolClient, revisionId: string): Promise<CadRevisionData | null> {
  const query = 'SELECT * FROM cad_revisions WHERE id = $1';
  const result = await client.query(query, [revisionId]);
  
  if (result.rows.length === 0) return null;
  
  const revision = result.rows[0];
  return {
    ...revision,
    source_url: JSON.stringify(revision.source_url),
    structure_hash: JSON.stringify(revision.structure_hash),
    geometry_hash: JSON.stringify(revision.geometry_hash),
  };
}

export async function componentIdsExist(client: PoolClient): Promise<boolean> {


