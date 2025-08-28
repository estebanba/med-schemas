// ===== MAIN EXPORT FILE =====
// Single source of truth for all medical system schemas

// Common schemas and types
export * from './common.schemas.js';

// Entity schemas and types
export * from './user.schemas.js';
export * from './client.schemas.js';
export * from './role.schemas.js';
export * from './team.schemas.js';
export * from './invitation.schemas.js';
export * from './paciente.schemas.js';
export * from './empresa.schemas.js';
export * from './historia-clinica.schemas.js';
export * from './admin.schemas.js';
export * from './audit.schemas.js';

// Re-export zod for convenience
export { z } from 'zod';