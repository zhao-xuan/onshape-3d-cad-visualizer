// Demo data seed for initial MVP testing - creates mock model with existing component descriptions
import { Pool } from 'pg';

const DEMO_MODEL_SLUG = "product-alpha";

export async function seedDemoData(pool: Pool): Promise<void> {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Create the main model - Product Alpha assembly
    const modelResult = await client.query(`
      INSERT INTO cad_models (name, slug, description)
      VALUES ($1, $2, $3)
      ON CONFLICT (slug) DO UPDATE SET updated_at = NOW()
      RETURNING id
    `, ["Product Alpha Assembly", DEMO_MODEL_SLUG, "Demo 3D CAD assembly for platform testing"]);

    const modelId = modelResult.rows[0].id;

    // Parse the actual revision fixtures and create them in the database
    
    // Revision 1 - base sync with all components
    await client.query(`
      INSERT INTO cad_revisions (model_id, source_id, structure_hash, geometry_hash, sync_timestamp, source_url)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT DO NOTHING
      RETURNING id
    `, [
      modelId, 
      "PART_001_base_plate|VERSION:revisions/7e9a8c/bd9b5f", // Mock element ID based on first part
      `structure_hash_rev1_${Date.now()}`,
      `geometry_hash_rev1_${Date.now()}`,
      new Date('2024-01-15T10:00:00Z'),
      'https://cadplatform.io/models/product-alpha'
    ]);

    // Create initial component definitions with mock descriptions (human-authored)
    const componentDefs = [
      { displayName: "Base Plate", partNumber: "BP-001", category: "Enclosure", tags: ["structural", "base"], functionality: "Main structural base plate that supports all other components", description: "The foundational plate of the assembly, providing mechanical support and mounting surface for brackets and subcomponents.", publicationStatus: 'published' as const },
      { displayName: "Front Bracket", partNumber: "FB-021", category: "Fixture", tags: ["mounting", "bracket"], functionality: "Mounts front component to base plate with adjustable support", description: "Front-side bracket for mounting and supporting electronic components. Includes alignment features.", publicationStatus: 'published' as const },
      { displayName: "Main PCB", partNumber: "PCBA-101A", category: "Electronics", tags: ["pcb", "electronics"], functionality: "Primary circuit board with processing, I/O interfaces and power regulation", description: "Printed circuit board assembly containing main processor, memory, connectivity modules, and all electrical interconnections.", publicationStatus: 'published' as const },
      { displayName: "Camera Module", partNumber: "CAM-201V3", category: "Sensors", tags: ["camera", "sensor"], functionality: "High-resolution optical sensor system with lens mount assembly", description: "Optical camera module integrated into top cover assembly. Used for visual inspection and tracking applications.", publicationStatus: 'draft' as const },
      { displayName: "M1 Motor Assembly", partNumber: "MA-011A", category: "Mechanical System", tags: ["motor", "actuation"], functionality: "Primary drive motor with housing and mounting interface for main axis rotation", description: "Servo motor assembly providing rotational actuation. Integrated encoder feedback and thermal sensing.", publicationStatus: 'published' as const },
    ];

    for (const comp of componentDefs) {
      await client.query(`
        INSERT INTO component_definitions 
          (cad_model_id, display_name, part_number, category, tags, functionality, description, publication_status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (display_name, cad_model_id) DO NOTHING
      `, [modelId, comp.displayName, comp.partNumber, comp.category, JSON.stringify(comp.tags), comp.functionality, comp.description, comp.publicationStatus]);
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Failed to seed demo data:", error);
    throw error;
  } finally {
    client.release();
  }
}
