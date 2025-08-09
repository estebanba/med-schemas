import { z } from 'zod';
import { ObjectIdSchema, AuthoringSchema } from './common.schemas.js';

// ===== ROLE SCHEMAS =====

export const PERMISSIONS = {
  // User management
  USER_READ: 'user_read',
  USER_CREATE: 'user_create',
  USER_UPDATE: 'user_update',
  USER_DELETE: 'user_delete',
  
  // Patient management
  PATIENT_READ: 'patient_read',
  PATIENT_CREATE: 'patient_create',
  PATIENT_UPDATE: 'patient_update',
  PATIENT_DELETE: 'patient_delete',
  
  // Company management
  COMPANY_READ: 'company_read',
  COMPANY_CREATE: 'company_create',
  COMPANY_UPDATE: 'company_update',
  COMPANY_DELETE: 'company_delete',
  
  // Historia Clinica management
  HISTORIA_READ: 'historia_read',
  HISTORIA_CREATE: 'historia_create',
  HISTORIA_UPDATE: 'historia_update',
  HISTORIA_DELETE: 'historia_delete',
  
  // Admin functions
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
  USER_MANAGEMENT: 'user_management',
  
  // Reports and analytics
  REPORTS_READ: 'reports_read',
  ANALYTICS_READ: 'analytics_read',
} as const;

export const PermissionSchema = z.enum([
  'user_read', 'user_create', 'user_update', 'user_delete',
  'patient_read', 'patient_create', 'patient_update', 'patient_delete',
  'company_read', 'company_create', 'company_update', 'company_delete',
  'historia_read', 'historia_create', 'historia_update', 'historia_delete',
  'admin', 'super_admin', 'user_management',
  'reports_read', 'analytics_read'
]);

export const RoleSchema = z.object({
  _id: ObjectIdSchema.optional(),
  name: z.string().min(1, "Nombre del rol es requerido"),
  description: z.string().optional(),
  permissions: z.array(PermissionSchema).default([]),
  isActive: z.boolean().default(true),
  isSystem: z.boolean().default(false), // System roles cannot be deleted
}).merge(AuthoringSchema);

export const RoleFormSchema = RoleSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  modifiedBy: true,
  isSystem: true,
});

// ===== ROLE TYPES =====
export type Permission = z.infer<typeof PermissionSchema>;
export type Role = z.infer<typeof RoleSchema>;
export type RoleForm = z.infer<typeof RoleFormSchema>;