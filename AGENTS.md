ROLE

You are the principal full-stack engineer and technical architect for this project.

Build the complete project from zero to a working production-quality MVP.

You have permission to:

* create and modify files in this repository;
* install dependencies;
* run terminal commands;
* run tests;
* start development servers;
* inspect errors and logs;
* refactor code;
* create Docker configuration;
* create database migrations;
* generate fixture/mock CAD data;
* create the browser extension;
* update documentation.

Do NOT merely explain how to build the project.

Do NOT stop after scaffolding.

Do NOT leave core functionality as TODOs.

Act as an implementation agent: create the code, run it, test it, fix problems, and continue until the acceptance criteria below are satisfied.

If Onshape credentials are unavailable, implement a complete mock mode so that the entire application can be developed and tested without credentials. Do not block development waiting for credentials.

Whenever an Onshape API endpoint, payload, OAuth behaviour, webhook event, tessellation format, or export behaviour is uncertain, consult the CURRENT official Onshape Developer Documentation / API Explorer instead of inventing API contracts.

⸻

1. PRODUCT GOAL

Build a web platform for managing and presenting an Onshape 3D CAD assembly.

The Onshape CAD model contains multiple components.

Each component may have information such as:

* name;
* part number;
* dimensions;
* material;
* weight;
* functionality;
* engineering description;
* user-facing description;
* category;
* status;
* tags;
* technical specifications;
* custom specification fields;
* notes;
* source Onshape information.

Users visiting the public website should be able to freely inspect the 3D CAD model.

When the mouse moves over a component:

* highlight the component;
* optionally show a small tooltip containing its name.

When a component is clicked:

* persist the selection;
* visually highlight the component;
* open a specification panel;
* display the component’s dimensions, functionality, description, and other specs.

I also need a powerful but simple admin interface for managing these component descriptions and specifications.

Finally, build a Chrome browser extension that detects the Onshape model currently open in Chrome and allows me to synchronize that model into this platform and quickly review changed/new components.

The overall experience should feel like a combination of:

* interactive CAD viewer;
* lightweight PDM/product database;
* documentation CMS;
* change-review dashboard.

⸻

2. CORE DESIGN PRINCIPLE

Treat Onshape as the source of truth for CAD structure and geometry.

Treat our own database as the source of truth for human-authored documentation/specification content.

NEVER tightly couple human-authored descriptions to a temporary geometry identifier.

The following two concepts must remain separate:

CAD-derived data

Examples:

* Onshape document;
* workspace/version/microversion;
* element;
* assembly hierarchy;
* occurrence;
* part;
* geometry;
* transform;
* calculated bounding box;
* CAD metadata;
* material if available;
* part number if available.

Human-authored content

Examples:

* functionality;
* description;
* marketing description;
* engineering notes;
* manually entered dimensions;
* tags;
* category;
* custom specifications;
* publication state.

A CAD sync must NEVER accidentally delete human-authored information.

⸻

3. HIGH-LEVEL ARCHITECTURE

Use a TypeScript monorepo.

Preferred structure:

/
  apps/
    web/
    worker/
    extension/
  packages/
    database/
    onshape/
    cad-core/
    shared/
    ui/
  fixtures/
    mock-cad/
  docs/
  docker-compose.yml
  .env.example
  README.md

Recommended technology choices:

Web

Use:

* current stable Next.js;
* React;
* TypeScript;
* Three.js;
* @react-three/fiber;
* @react-three/drei.

Use a modern component library/design system.

Keep the UI professional, restrained and engineering/product oriented.

Database

Use PostgreSQL.

Use a mature TypeScript ORM and migrations.

Do not scatter raw SQL throughout the application.

Background processing

Create a separate Node.js/TypeScript worker.

CAD synchronization can be expensive and should not block browser requests.

Use PostgreSQL-backed job processing so that Redis is not required for the initial version.

The application should support:

queued
processing
completed
failed

sync jobs.

Make synchronization idempotent.

Asset storage

Create an abstraction such as:

interface AssetStore {
  put(...)
  get(...)
  delete(...)
  getPublicUrl(...)
}

Development implementation:

local filesystem

Production implementation:

S3-compatible object storage

Geometry assets must NOT be stored directly as huge blobs in PostgreSQL.

⸻

4. ONSHAPE INTEGRATION

Create a dedicated package:

packages/onshape

All Onshape-specific logic belongs here.

The rest of the application should interact with a clean internal API rather than making raw Onshape requests everywhere.

Example services:

OnshapeClient
OnshapeAuthService
OnshapeDocumentService
OnshapeAssemblyService
OnshapeGeometryService
OnshapeMetadataService
OnshapeWebhookService
OnshapeSyncService

Centralize:

* base URL;
* enterprise Onshape domain support;
* API version;
* authentication;
* rate limiting;
* retry policy;
* error conversion;
* request logging.

Never hard-code credentials.

⸻

5. ONSHAPE AUTHENTICATION

Support two modes.

Development / personal mode

Allow server-side Onshape API credentials using environment variables for local development.

They MUST only exist on the server.

They must NEVER appear in:

* browser JavaScript;
* Next.js client bundles;
* Chrome extension;
* localStorage;
* frontend network payloads.

Production mode

Design the authentication layer so Onshape OAuth2 can be used.

Store tokens securely server-side.

Refresh tokens when required.

Do not expose access tokens to the website or extension.

Create documentation explaining how I can register the Onshape OAuth application later.

⸻

6. ONSHAPE MODEL IDENTIFICATION

The system must understand Onshape URLs.

Create a robust URL parser.

It should recognize at minimum:

documentId
workspaceId
versionId
microversionId
elementId

where applicable.

Create a type similar to:

interface OnshapeContext {
  baseUrl: string;
  documentId: string;
  contextType: "workspace" | "version" | "microversion";
  contextId: string;
  elementId?: string;
}

Unit-test this heavily.

⸻

7. ASSEMBLY MODEL

The initial primary supported model type is an Onshape Assembly.

Retrieve the assembly definition using the officially supported Onshape APIs.

Build an internal normalized assembly tree.

Support:

* top-level assemblies;
* parts;
* subassemblies;
* nested subassemblies;
* repeated instances;
* transforms;
* suppressed components;
* referenced documents where possible.

Do not flatten the hierarchy in the database in a way that loses parent/child relationships.

Expose both:

hierarchical assembly tree

and:

flattened occurrence list

to application code.

⸻

8. COMPONENT IDENTITY

This is a CRITICAL requirement.

Do NOT use a raw Part ID as the only long-term identity for user-authored component information.

Create concepts similar to:

ComponentDefinition
ComponentOccurrence
CadEntityMapping
CadRevision

ComponentDefinition

Represents the logical component.

Example:

M3 motor
PCB
Left enclosure
Camera module
Battery

This contains shared documentation/specification data.

ComponentOccurrence

Represents where that component appears inside a particular assembly.

It should contain information such as:

occurrence identity
assembly path
parent occurrence
transform
CAD source
visibility
suppression state

The same ComponentDefinition may appear multiple times as different occurrences.

Allow occurrence-level overrides later.

CAD mapping

Keep the CAD identifiers used for a particular CAD revision separately from the logical component identity.

When the CAD model changes, attempt to associate new CAD entities with existing logical components.

Where Onshape’s official associativity / ID translation mechanisms apply, use them.

If identity cannot be determined confidently:

DO NOT silently attach a description to the wrong component.

Instead mark it:

NEEDS_REVIEW

and expose the mapping problem in the admin interface.

⸻

9. CAD REVISION MODEL

Every synchronization must create or resolve a CAD revision.

Store information such as:

documentId
workspaceId
versionId
microversionId
elementId
configuration
sync timestamp
source URL

A revision must be immutable after a successful sync.

Maintain history.

I should be able to inspect:

Revision A
Revision B
Revision C

and understand what changed.

⸻

10. CHANGE DETECTION

For every sync compare the new normalized assembly with the previous successful sync.

Classify components as:

NEW
CHANGED
UNCHANGED
REMOVED
NEEDS_REVIEW

Do not simply compare names.

Consider changes such as:

* occurrence added;
* occurrence removed;
* geometry changed;
* source part changed;
* source document changed;
* transform changed;
* configuration changed;
* CAD metadata changed;
* dimensions changed;
* material changed;
* part number changed;
* component renamed.

Create a structured diff.

Example:

interface ComponentChange {
  componentId?: string;
  occurrenceId?: string;
  type:
    | "added"
    | "removed"
    | "geometry"
    | "transform"
    | "metadata"
    | "renamed"
    | "configuration"
    | "identity";
  before?: unknown;
  after?: unknown;
}

Store the diff in the database.

The admin UI should make this easy to review.

⸻

11. GEOMETRY PIPELINE

The public viewer must NOT rely on embedding the normal Onshape website in an iframe.

Build our own Three.js viewer.

Create an independent geometry pipeline.

The implementation must preserve component identity in the resulting scene.

Recommended pipeline:

Onshape assembly
        ↓
assembly definition
        ↓
unique component / part sources
        ↓
Onshape tessellation / supported geometry API
        ↓
normalize triangle mesh
        ↓
apply assembly transforms
        ↓
generate compact browser-friendly GLB
        ↓
store geometry asset
        ↓
Three.js viewer

Cache geometry for identical reused parts.

Do not retrieve identical geometry separately for every occurrence.

Use the assembly occurrence transforms to position instances.

Generate a browser-friendly GLB containing component mapping information.

For example, attach metadata to GLTF nodes:

{
  "componentId": "...",
  "occurrenceId": "...",
  "componentDefinitionId": "..."
}

or use deterministic node naming plus an accompanying manifest.

Create a manifest similar to:

{
  "revisionId": "...",
  "nodes": {
    "node-name": {
      "componentId": "...",
      "occurrenceId": "..."
    }
  }
}

The important requirement is:

When a user clicks a Three.js object, the application must reliably determine the database component represented by that mesh.

Do not depend solely on mesh names unless their mapping has been explicitly generated by our pipeline.

Onshape’s official Assembly/Part Studio glTF export can be investigated as an optimization.

Only depend on exported glTF node identity if the mapping has been verified against current official API behaviour.

Otherwise use our normalized geometry pipeline.

⸻

12. GEOMETRY HASHING

Generate useful hashes to detect changes without relying purely on Onshape IDs.

Where practical calculate:

geometry hash
bounding-box hash
CAD-source hash
metadata hash
assembly-structure hash

The exact hashing algorithm should be deterministic.

Store hashes on revision-specific records.

Avoid false positives caused purely by JSON property ordering.

Normalize data before hashing.

⸻

13. DIMENSIONS

Automatically calculate CAD-derived bounding dimensions from geometry.

Store them separately from manually entered specification dimensions.

Example:

cadDimensions: {
  x: number;
  y: number;
  z: number;
  unit: "mm";
}
manualDimensions?: {
  width?: number;
  height?: number;
  depth?: number;
  unit: string;
}

Never overwrite manually entered dimensions during synchronization.

Clearly distinguish in the UI:

CAD-derived
Manual override

⸻

14. COMPONENT SPEC SYSTEM

Each ComponentDefinition should support at least:

name
displayName
partNumber
category
shortDescription
description
functionality
material
weight
manualDimensions
tags
engineeringNotes
status

Also support flexible custom specifications.

For example:

interface CustomSpec {
  key: string;
  label: string;
  type:
    | "text"
    | "number"
    | "boolean"
    | "select"
    | "url"
    | "measurement";
  value: unknown;
  unit?: string;
  order: number;
}

Do not build a database schema where adding a new type of spec requires a database migration every time.

⸻

15. DRAFT / PUBLISH MODEL

Human-authored component content should support:

DRAFT
PUBLISHED

Synchronizing CAD must NOT automatically publish documentation changes.

New components should initially appear as:

Needs description

Changed components should appear as:

Needs review

An administrator should be able to:

Save draft
Mark reviewed
Publish
Unpublish

The public site displays only published information.

CAD geometry may update independently, but publication state must remain explicit.

⸻

16. PUBLIC 3D VIEWER

Create a route similar to:

/models/[slug]

Layout:

┌─────────────────────────────────────────────────────────┐
│ Model name                    Search         Toolbar     │
├───────────────┬─────────────────────────┬───────────────┤
│               │                         │               │
│ Assembly Tree │      3D Viewer          │ Component     │
│               │                         │ Details       │
│               │                         │               │
└───────────────┴─────────────────────────┴───────────────┘

The visual design should be modern, minimal, premium, and engineering-oriented.

Do not make it look like a generic admin template.

⸻

17. VIEWER INTERACTIONS

Implement:

Camera

* orbit;
* pan;
* zoom;
* fit model;
* reset view.

Hover

When hovering a component:

* highlight the component;
* show its display name;
* synchronize hover with the assembly tree.

Click

When clicking:

* select component;
* keep selection highlighted;
* open component details;
* select matching assembly-tree item.

Assembly tree

When hovering/clicking a tree item:

* highlight/select the corresponding 3D component.

Search

Search by:

* name;
* display name;
* part number;
* category;
* tags.

Selecting a search result should:

* select the component;
* focus it in the viewer;
* expand its tree parents.

Visibility

Provide:

Hide
Show
Isolate
Show all

Focus

Provide:

Focus component

which smoothly adjusts the camera.

Clear selection

Clicking empty scene space clears the selection.

Deep linking

Support:

/models/product-a?component=<component-id>

so a component can be linked directly.

⸻

18. COMPONENT DETAIL PANEL

The component detail panel should display information cleanly.

Example:

Motor Assembly
P/N: MOT-001
FUNCTION
Provides rotational drive for the actuator.
DIMENSIONS
42 × 42 × 68 mm
MATERIAL
Aluminium / Steel
WEIGHT
310 g
SPECIFICATIONS
Voltage        24 V
Rated torque   0.8 Nm
Max RPM        3000

Support Markdown or safe rich-text rendering for longer descriptions.

Do not render raw unsafe HTML.

⸻

19. ADMIN DASHBOARD

Create routes approximately:

/admin
/admin/models
/admin/models/[modelId]
/admin/models/[modelId]/components
/admin/models/[modelId]/changes
/admin/models/[modelId]/revisions
/admin/settings/onshape

Admin authentication is required.

Public viewer routes must remain read-only.

⸻

20. ADMIN MODEL DASHBOARD

Show:

Model name
Onshape source
Last sync
Current microversion/version
Sync status
Component count
New components
Changed components
Needs review
Missing descriptions
Removed components
Published components

Primary actions:

Sync now
Review changes
Edit components
Open public viewer
Open in Onshape

⸻

21. COMPONENT MANAGEMENT UI

This is one of the most important parts of the project.

Build a component table with columns such as:

Component
Part Number
Category
CAD Status
Documentation Status
Dimensions
Last Changed
Published

Allow filtering:

All
New
Changed
Needs Review
Needs Description
Published
Unpublished
Removed

Allow search.

Clicking a component should open an editor.

⸻

22. COMPONENT EDITOR

Create an efficient editing interface.

Suggested layout:

┌───────────────────────┬──────────────────────────────┐
│                       │ Component Name               │
│                       │                              │
│     3D Preview        │ Functionality                │
│                       │ [........................]    │
│                       │                              │
│                       │ Dimensions / specs           │
│                       │                              │
│                       │ Custom specs                 │
│                       │                              │
│                       │ [Save] [Publish]              │
└───────────────────────┴──────────────────────────────┘

The 3D viewer should isolate or emphasize the component being edited.

Support:

* autosave drafts;
* explicit publish;
* add/remove/reorder custom specs;
* tags;
* category;
* markdown description;
* manual dimension override;
* restore previous published content where appropriate.

Warn before discarding unsaved changes.

⸻

23. CHANGE REVIEW UI

After CAD synchronization, provide a dedicated review experience.

Example:

Revision abc123 → def456
12 components changed
+ 3 New
~ 7 Modified
- 2 Removed

For each component show:

component name
change type
previous values
new values
existing description
review status

For geometry changes display:

Geometry changed
Dimensions:
43 × 20 × 8 mm
→
46 × 20 × 8 mm

For renamed components:

Motor Bracket
→
Motor Mount Bracket

Provide actions:

Keep existing description
Edit description
Mark reviewed
Publish
Ignore CAD metadata change

New components should have a prominent:

Add description

action.

⸻

24. REMOVED COMPONENTS

Do NOT permanently delete component documentation simply because the component disappears from the latest CAD model.

Instead:

active = false
removedAt = timestamp

Preserve historical specs.

The admin should be able to view removed components.

If the component returns later and identity can be confidently restored, reconnect its historical documentation.

⸻

25. BROWSER EXTENSION

Build a Chrome Manifest V3 extension in:

apps/extension

Use:

* TypeScript;
* React;
* Vite or equivalent;
* Chrome Side Panel where supported.

The extension must NOT contain Onshape API credentials.

Its job is to connect the Onshape page to OUR backend.

⸻

26. EXTENSION — URL DETECTION

When the active tab is an Onshape document:

Detect:

Onshape hostname
documentId
workspace/version/microversion
elementId

Display something similar to:

Onshape Sync
Document:
Robot Prototype
Context:
Main Workspace
Element:
Main Assembly
Website:
Connected ✓
Last Sync:
3 minutes ago
[ Sync latest model ]
[ Review 4 changes ]
[ Open admin ]

If the document is unknown:

This Onshape model is not connected.
[ Add to website ]

⸻

27. EXTENSION — SYNC FLOW

When I click:

Sync latest model

the extension should:

1. read the current Onshape URL;
2. parse its context;
3. call OUR authenticated backend;
4. create a sync job;
5. display progress;
6. poll OUR backend for job status;
7. display results.

Example:

Sync complete
+ 2 new components
~ 3 changed
- 1 removed
[ Review changes ]

Do not make Onshape API calls directly from the extension.

⸻

28. EXTENSION — QUICK MANAGEMENT

After sync, show changed/new components.

Example:

Needs attention
NEW
Camera Bracket
[ Add description ]
CHANGED
Battery Housing
Dimensions changed
[ Review ]
NEW
USB-C Board
[ Add description ]

Clicking the action should open the appropriate admin page directly.

Optional if straightforward:

Allow editing shortDescription / functionality directly from the extension side panel.

The full component editor should still live in the web admin interface.

⸻

29. EXTENSION AUTHENTICATION

Implement a secure extension connection mechanism.

For MVP, the admin site may generate a revocable extension token.

Example:

Admin → Settings → Browser Extension
[ Generate connection token ]

The extension stores only a token for OUR backend.

Token must be:

* revocable;
* scoped;
* random;
* stored safely using extension storage;
* never an Onshape API secret.

Provide:

Disconnect
Revoke extension

functionality.

⸻

30. AUTOMATIC SYNCHRONIZATION

In addition to manual extension sync, support automatic synchronization through official Onshape webhook mechanisms.

Create a webhook endpoint such as:

POST /api/webhooks/onshape

Handle relevant model lifecycle events.

A model change event should NOT run a massive sync directly inside the webhook HTTP request.

Instead:

Webhook
    ↓
validate
    ↓
enqueue sync
    ↓
HTTP 200
    ↓
worker processes sync

Debounce repeated events.

For example, many edits occurring within a short interval should collapse into one pending sync job.

Prevent duplicate concurrent sync jobs for the same CAD source.

Store webhook event history for debugging.

⸻

31. MANUAL VS AUTOMATIC SYNC

Support both:

Browser Extension → Sync Now
Admin UI → Sync Now
Onshape Webhook → Automatic Sync

All three must use the SAME backend synchronization service.

Do not create separate sync implementations.

⸻

32. API DESIGN

Create a clean internal API.

Example routes:

GET  /api/models
POST /api/models
GET  /api/models/:id
POST /api/models/:id/sync
GET  /api/sync-jobs/:id
GET  /api/models/:id/components
GET  /api/components/:id
PATCH /api/components/:id
POST /api/components/:id/publish
POST /api/components/:id/unpublish
GET /api/models/:id/revisions
GET /api/models/:id/changes
POST /api/extension/register
POST /api/extension/context
POST /api/extension/sync
POST /api/webhooks/onshape

Exact URLs may be adjusted to fit Next.js conventions.

Use schema validation on every mutation endpoint.

Return typed errors.

⸻

33. DATABASE MODEL

Design proper relational tables/entities.

At minimum consider:

User
CadModel
CadSource
CadRevision
ComponentDefinition
ComponentOccurrence
ComponentCadMapping
ComponentSpecRevision
GeometryAsset
SyncJob
SyncEvent
ComponentChange
WebhookRegistration
ExtensionToken
AuditLog

Create foreign keys and indexes deliberately.

Important indexes include likely lookups for:

documentId
elementId
microversionId
modelId
componentDefinitionId
occurrence identity
sync status
publication status

Do not store the entire product as one giant unqueryable JSON object.

JSON/JSONB is acceptable for flexible CAD payload fragments and custom specs where appropriate.

⸻

34. AUDIT HISTORY

Track meaningful human changes.

Example:

Tom updated functionality
Tom published Camera Module
Sync detected Motor Housing geometry change

Store:

actor
action
entity
timestamp
before
after

The first version can expose a simple activity timeline.

⸻

35. MOCK MODE

This is mandatory.

Create:

fixtures/mock-cad

with an example product consisting of roughly 8–15 components.

Include nested assemblies.

Example:

Product
├── Enclosure
│   ├── Front Housing
│   └── Rear Housing
├── Electronics
│   ├── Main PCB
│   ├── USB Board
│   └── Camera Module
├── Battery
└── Mechanical
    ├── Motor
    ├── Motor Mount
    └── Gear

Generate simple geometry programmatically if needed:

* boxes;
* cylinders;
* extruded-like primitives.

Create at least two mock revisions.

Revision 2 should intentionally contain:

1 new component
2 changed components
1 removed component
1 renamed component

This allows the entire change review experience to be tested without Onshape credentials.

⸻

36. PERFORMANCE REQUIREMENTS

The public viewer should feel fast.

Implement:

* geometry caching;
* browser caching;
* lazy loading;
* compressed geometry where practical;
* shared geometry for repeated components;
* reasonable pixel ratio;
* bounding box caching;
* loading progress.

Do not re-render the full React tree on every pointer move.

Hover operations should remain responsive.

Avoid creating unnecessary Three.js materials every frame.

Dispose GPU resources properly.

⸻

37. LARGE MODEL STRATEGY

Design for assemblies that may eventually have hundreds or thousands of occurrences.

The MVP does not need extremely advanced CAD streaming, but the architecture must not assume there are only ten parts.

Keep open the ability to add:

LOD
mesh compression
progressive loading
instancing
server-side geometry optimization

later.

⸻

38. VISUAL QUALITY

The UI should feel like a real product, not a hackathon demo.

Public viewer:

* large 3D viewport;
* restrained neutral background;
* subtle panels;
* excellent typography;
* compact engineering information;
* smooth hover/selection;
* clear hierarchy.

Admin:

* data-dense where appropriate;
* fast navigation;
* clear status badges;
* minimal clicks to edit descriptions;
* strong review workflow.

Avoid:

* giant gradients;
* overly playful UI;
* excessive cards;
* unnecessary animations;
* generic dashboard clutter.

⸻

39. RESPONSIVE DESIGN

Desktop is the primary experience.

However the public model viewer must still work reasonably on:

* laptop;
* tablet;
* mobile.

On mobile:

* assembly tree may become a drawer;
* specification panel may become a bottom sheet;
* touch selection must work.

Admin can prioritize desktop.

⸻

40. SECURITY

Implement basic production-quality security.

Requirements:

* server-side authentication for admin;
* authorization checks on every admin mutation;
* rate limit sensitive endpoints;
* validate all input;
* sanitize rich text;
* secure cookies;
* CSRF protection where relevant;
* never expose Onshape credentials;
* never expose database credentials;
* never trust IDs submitted by extension;
* validate webhook requests;
* verify model ownership before allowing extension sync.

Do not log secrets.

⸻

41. ERROR HANDLING

Create useful user-facing errors.

Examples:

Unable to access Onshape document.
The configured Onshape account may not have permission.
Geometry synchronization failed.
Metadata synchronization succeeded.
Retry geometry sync.
This component could not be confidently matched to its previous version.
Manual review is required.

Avoid generic:

Something went wrong.

when useful information is known.

⸻

42. OBSERVABILITY

Use structured logging.

Every sync job should have a correlation/job ID.

Log major stages:

resolve context
fetch assembly
normalize structure
fetch geometry
build GLB
calculate hashes
perform diff
persist revision
finish

Record timing.

Example:

assembly fetch: 1.2s
geometry: 8.7s
GLB generation: 2.1s
diff: 120ms

Make failed jobs diagnosable.

⸻

43. TESTS

Add automated tests.

Unit tests

At minimum:

* Onshape URL parser;
* normalization;
* deterministic hashing;
* component identity matching;
* revision diff;
* custom specs validation;
* sync idempotency.

Integration tests

Using mock Onshape responses:

* initial import;
* second sync;
* new component;
* removed component;
* changed geometry;
* renamed component;
* failed identity match.

Browser tests

Use Playwright or equivalent.

Test:

1. open public viewer;
2. model appears;
3. select component from assembly tree;
4. detail panel updates;
5. search component;
6. hide/isolate component;
7. open admin;
8. edit functionality;
9. save draft;
10. publish;
11. verify public viewer displays new information.

⸻

44. EXTENSION TESTING

Unit-test:

* Onshape URL parsing;
* unsupported URL detection;
* website API calls;
* token handling.

Create clear documentation for loading the extension locally:

chrome://extensions
→ Developer mode
→ Load unpacked

Ensure the extension build actually produces a valid Manifest V3 package.

⸻

45. LOCAL DEVELOPMENT EXPERIENCE

I want the entire project to be easy to run.

Target workflow:

cp .env.example .env
docker compose up -d
pnpm install
pnpm db:migrate
pnpm db:seed
pnpm dev

Then:

http://localhost:3000

should show the application.

Create scripts where helpful:

pnpm dev
pnpm build
pnpm test
pnpm lint
pnpm typecheck
pnpm db:migrate
pnpm db:seed
pnpm worker
pnpm extension:build

Use workspace scripts so I do not need to manually run commands from five directories.

⸻

46. ENVIRONMENT CONFIGURATION

Create .env.example.

Include clearly documented placeholders such as:

DATABASE_URL=
APP_BASE_URL=
ONSHAPE_BASE_URL=
ONSHAPE_AUTH_MODE=
ONSHAPE_ACCESS_KEY=
ONSHAPE_SECRET_KEY=
ONSHAPE_CLIENT_ID=
ONSHAPE_CLIENT_SECRET=
ONSHAPE_REDIRECT_URI=
ASSET_STORAGE_DRIVER=
ASSET_STORAGE_PATH=
S3_ENDPOINT=
S3_BUCKET=
S3_ACCESS_KEY=
S3_SECRET_KEY=
WEBHOOK_SECRET=

Use the exact final variable names implemented by the project.

Do not include real secrets.

⸻

47. README

Write a genuinely useful README.

Include:

1. product overview;
2. architecture diagram;
3. repository structure;
4. local development;
5. database setup;
6. mock mode;
7. Onshape integration setup;
8. OAuth setup;
9. webhook setup;
10. extension setup;
11. production deployment;
12. troubleshooting.

Include a Mermaid architecture diagram.

Example conceptual architecture:

                  ┌──────────────┐
                  │   Onshape    │
                  └──────┬───────┘
                         │ REST / Webhook
                         ▼
              ┌──────────────────────┐
              │   Backend / Worker   │
              │     Sync Engine      │
              └───────┬───────┬──────┘
                      │       │
                 ┌────▼───┐ ┌─▼─────────┐
                 │Postgres│ │Asset Store│
                 └────┬───┘ └────┬──────┘
                      │           │
                      └─────┬─────┘
                            ▼
                     ┌─────────────┐
                     │   Website   │
                     │ Viewer/CMS  │
                     └──────┬──────┘
                            │
                     ┌──────▼──────┐
                     │Chrome Ext.  │
                     └─────────────┘

⸻

48. DEVELOPMENT PHASES

Implement in this order.

Phase 1 — Foundation

Create:

* monorepo;
* web app;
* database;
* migrations;
* common types;
* Docker Compose;
* authentication;
* mock mode.

Verify the app runs.

Do not proceed with a broken foundation.

Phase 2 — Component CMS

Implement:

* models;
* components;
* specs;
* drafts;
* publishing;
* admin component list;
* component editor.

Verify CRUD and publication.

Phase 3 — 3D Viewer

Implement:

* mock CAD geometry;
* assembly tree;
* Three.js viewer;
* hover;
* click;
* selection;
* details panel;
* isolate/hide;
* search;
* focus.

Verify component-to-mesh mapping.

Phase 4 — Revision System

Implement:

* CAD revisions;
* sync jobs;
* diff engine;
* new/changed/removed status;
* review UI.

Use the two mock revisions to prove this works.

Phase 5 — Onshape Client

Implement server-side:

* auth;
* URL/context support;
* assembly retrieval;
* revision/microversion resolution;
* CAD metadata;
* geometry retrieval.

Use fixture-based tests before live requests.

Phase 6 — Geometry Pipeline

Implement:

* tessellation ingestion;
* mesh normalization;
* transforms;
* GLB creation;
* asset storage;
* manifest generation;
* geometry caching.

Phase 7 — Real Sync

Connect Onshape data to the existing mock-based synchronization abstraction.

Do not duplicate the synchronization engine.

Phase 8 — Browser Extension

Implement:

* Manifest V3;
* side panel;
* Onshape detection;
* backend connection;
* Sync Now;
* status;
* changed component list;
* admin deep links.

Phase 9 — Webhooks

Implement:

* registration support;
* receiver;
* validation;
* event storage;
* debounce;
* sync job enqueue.

Phase 10 — Polish

Run:

lint
typecheck
unit tests
integration tests
browser tests
production build

Fix all significant failures.

⸻

49. DEFINITION OF DONE

The project is NOT complete merely because:

npm run dev

works.

It is complete when the following scenario works end-to-end:

Scenario A — Mock product

1. Start local environment.
2. Open admin.
3. Import mock product Revision 1.
4. See approximately 10 components.
5. Add functionality/specifications to several components.
6. Publish them.
7. Open public viewer.
8. Hover components.
9. Click component.
10. See the correct specification.
11. Navigate using assembly tree.

Scenario B — CAD change

1. Sync mock Revision 2.
2. Existing descriptions remain.
3. Admin shows:
    * new components;
    * changed components;
    * removed component.
4. Changed component displays its diff.
5. New component shows Needs description.
6. Removed component history still exists.
7. Publish reviewed changes.
8. Public viewer displays latest published result.

Scenario C — Extension

1. Build extension.
2. Load unpacked extension.
3. Visit an Onshape-style URL.
4. Extension detects document context.
5. Click Sync latest model.
6. Backend creates sync job.
7. Extension shows job result.
8. Review changes opens correct admin page.

Scenario D — Real Onshape

When credentials are configured:

1. register an Onshape Assembly;
2. retrieve assembly structure;
3. retrieve geometry;
4. produce browser-compatible geometry;
5. display assembly in viewer;
6. click a component;
7. map clicked mesh to the correct database component;
8. run a second synchronization without destroying human content.

⸻

50. IMPORTANT IMPLEMENTATION RULES

Follow these throughout the project.

Rule 1

Do not invent Onshape API endpoints.

Verify against current official Onshape developer documentation.

Rule 2

Do not put Onshape API secrets in browser code.

Rule 3

Do not use a transient geometry ID as the sole permanent component identity.

Rule 4

CAD synchronization must never destroy manually entered specs.

Rule 5

Do not scrape the internal Onshape DOM as the core integration mechanism.

Use supported public APIs.

Rule 6

Every synchronization must be idempotent.

Running the same revision twice must not duplicate components or revisions.

Rule 7

Keep the CAD provider abstraction clean.

In the future I may want another provider such as:

STEP upload
SolidWorks export
Fusion
local GLB

The product-level CMS should not care where geometry came from.

Consider an interface such as:

interface CadProvider {
  resolveContext(...): Promise<CadContext>;
  getAssembly(...): Promise<NormalizedAssembly>;
  getGeometry(...): Promise<GeometryBundle>;
}

with:

OnshapeCadProvider
MockCadProvider

initially.

Rule 8

Prefer simple, understandable engineering over unnecessary abstraction.

Do not create dozens of microservices.

A modular monolith + worker is appropriate.

Rule 9

No core TODO placeholders.

Optional future enhancements may be documented, but the core MVP must function.

Rule 10

After every major phase:

* run tests;
* run typecheck;
* run build;
* fix failures before continuing.

⸻

51. FUTURE-FRIENDLY FEATURES

Do NOT let these delay MVP completion, but structure the project so they can be added later:

* exploded view;
* measurement tool;
* clipping planes;
* annotations/hotspots;
* component comments;
* BOM import/export;
* CSV component editing;
* AI-generated component descriptions;
* version comparison with old/new geometry overlay;
* approval workflow;
* multiple administrators;
* customer-specific specifications;
* public/private model sharing;
* component URLs;
* QR codes;
* mobile AR;
* multiple products;
* multiple Onshape documents;
* STEP upload;
* GLB upload.

Add them to docs/ROADMAP.md, not the MVP critical path.

⸻

52. OPTIONAL HIGH-VALUE FEATURE: EXPLODED VIEW

If the core project is working cleanly and this feature is straightforward, add an exploded-view slider.

Example:

Assembled ─────────────── Exploded
          [────●────────]

Compute explosion direction from component centers relative to assembly center.

Do NOT alter stored CAD transforms.

Explosion is purely a viewer-side presentation transform.

⸻

53. OPTIONAL HIGH-VALUE FEATURE: COMPONENT HOTSPOTS

Allow an administrator to mark a component as:

Featured

Public viewer can show subtle numbered hotspots for featured components.

Clicking the hotspot selects the corresponding component.

Do not show hotspots for every screw/washer by default.

⸻

54. CODE QUALITY

Use strict TypeScript.

Avoid any except at narrow external API boundaries.

Use:

* schemas for runtime validation;
* shared types;
* clear domain naming;
* service boundaries;
* dependency injection where it genuinely helps testing.

Do not overengineer.

Functions should remain testable.

Keep Onshape-specific raw payload types out of UI components.

Normalize external API data first.

⸻

55. SOURCE DATA RETENTION

For debugging, preserve sanitized raw Onshape responses associated with sync jobs where useful.

Do not store secrets or authorization headers.

This will make API compatibility problems easier to diagnose later.

Store either:

JSONB snapshot

or:

compressed asset

depending on size.

⸻

56. FIRST TASK — START IMPLEMENTING NOW

Begin implementation immediately.

First:

1. inspect the repository;
2. determine whether it is empty;
3. initialize the TypeScript monorepo if necessary;
4. create the directory structure;
5. scaffold the web application;
6. create PostgreSQL Docker configuration;
7. create the initial database schema;
8. create mock CAD provider;
9. implement the first mock product;
10. create the basic admin shell;
11. create the first working Three.js viewer.

Then run the application.

Resolve all startup errors.

After the first vertical slice works, continue through the phases above.

Do not stop to give me a large theoretical explanation unless a genuinely blocking design decision requires my input.

When multiple reasonable implementation options exist, choose the simplest robust option and continue.

If an external credential is missing, implement/mock the integration boundary and continue.

At each milestone give me a concise status such as:

Completed:
- PostgreSQL schema
- Mock CAD provider
- Basic assembly viewer
- Component selection
Verified:
- pnpm typecheck
- pnpm test
- pnpm build
Next:
- Component CMS
- revision diff

But continue implementing rather than waiting for confirmation unless absolutely necessary.

The end result should be a repository I can run locally, connect to my real Onshape account, load my assembly, manage component documentation, and publish an interactive 3D product page.