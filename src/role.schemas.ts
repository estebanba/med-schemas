import { z } from 'zod';
import { ObjectIdSchema, AuthoringSchema } from './common.schemas.js';

// ===== ROLE SCHEMAS =====

/**
 * Permission names use the `resource.action` format (dot-separated, lowercase),
 * e.g. 'patient.create', 'medical_record.read'. Same catalog as
 * med-back/src/constants/permissions.ts.
 *
 * Changed in 1.1.0: the old underscore names ('patient_create', 'historia_read',
 * 'admin', ...) are still accepted by PermissionSchema and converted to the
 * new names (see LEGACY_PERMISSION_MAP), so old data keeps validating.
 */
export const PERMISSIONS = {
  // Organization
  ORGANIZATION_CREATE: 'organization.create',
  ORGANIZATION_READ: 'organization.read',
  ORGANIZATION_UPDATE: 'organization.update',
  ORGANIZATION_DELETE: 'organization.delete',
  ORGANIZATION_SWITCH: 'organization.switch',

  // Users
  USER_CREATE: 'user.create',
  USER_READ: 'user.read',
  USER_UPDATE: 'user.update',
  USER_DELETE: 'user.delete',
  USER_INVITE: 'user.invite',
  USER_ASSIGN_ROLE: 'user.assign_role',
  USER_ASSIGN_ORGANIZATION: 'user.assign_organization',

  // Patients
  PATIENT_CREATE: 'patient.create',
  PATIENT_READ: 'patient.read',
  PATIENT_READ_ALL: 'patient.read_all',
  PATIENT_UPDATE: 'patient.update',
  PATIENT_DELETE: 'patient.delete',
  PATIENT_EXPORT: 'patient.export',

  // Medical records (historias clínicas)
  MEDICAL_RECORD_CREATE: 'medical_record.create',
  MEDICAL_RECORD_READ: 'medical_record.read',
  MEDICAL_RECORD_READ_ALL: 'medical_record.read_all',
  MEDICAL_RECORD_UPDATE: 'medical_record.update',
  MEDICAL_RECORD_DELETE: 'medical_record.delete',
  MEDICAL_RECORD_EXPORT: 'medical_record.export',
  MEDICAL_RECORD_PRINT: 'medical_record.print',

  // Companies (empresas)
  COMPANY_CREATE: 'company.create',
  COMPANY_READ: 'company.read',
  COMPANY_UPDATE: 'company.update',
  COMPANY_DELETE: 'company.delete',

  // Reports & analytics
  REPORTS_VIEW: 'reports.view',
  REPORTS_EXPORT: 'reports.export',
  ANALYTICS_VIEW: 'analytics.view',
  ANALYTICS_ADVANCED: 'analytics.advanced',

  // System
  SYSTEM_ADMIN: 'system.admin',
  AUDIT_LOGS: 'audit.logs',
  SYSTEM_SETTINGS: 'system.settings',

  // Teams
  TEAM_MANAGE: 'team.manage',
  TEAM_VIEW: 'team.view',
} as const;

export type PermissionName = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ALL_PERMISSIONS = Object.values(PERMISSIONS) as [PermissionName, ...PermissionName[]];

/** Pre-1.1.0 names → current names */
export const LEGACY_PERMISSION_MAP: Record<string, PermissionName> = {
  user_read: PERMISSIONS.USER_READ,
  user_create: PERMISSIONS.USER_CREATE,
  user_update: PERMISSIONS.USER_UPDATE,
  user_delete: PERMISSIONS.USER_DELETE,
  patient_read: PERMISSIONS.PATIENT_READ,
  patient_create: PERMISSIONS.PATIENT_CREATE,
  patient_update: PERMISSIONS.PATIENT_UPDATE,
  patient_delete: PERMISSIONS.PATIENT_DELETE,
  company_read: PERMISSIONS.COMPANY_READ,
  company_create: PERMISSIONS.COMPANY_CREATE,
  company_update: PERMISSIONS.COMPANY_UPDATE,
  company_delete: PERMISSIONS.COMPANY_DELETE,
  historia_read: PERMISSIONS.MEDICAL_RECORD_READ,
  historia_create: PERMISSIONS.MEDICAL_RECORD_CREATE,
  historia_update: PERMISSIONS.MEDICAL_RECORD_UPDATE,
  historia_delete: PERMISSIONS.MEDICAL_RECORD_DELETE,
  historia_export: PERMISSIONS.MEDICAL_RECORD_EXPORT,
  admin: PERMISSIONS.SYSTEM_ADMIN,
  super_admin: PERMISSIONS.SYSTEM_ADMIN,
  user_management: PERMISSIONS.USER_ASSIGN_ROLE,
  reports_read: PERMISSIONS.REPORTS_VIEW,
  reports_view: PERMISSIONS.REPORTS_VIEW,
  analytics_read: PERMISSIONS.ANALYTICS_VIEW,
  view_logs: PERMISSIONS.AUDIT_LOGS,
  create_users: PERMISSIONS.USER_CREATE,
};

/**
 * Convert any known permission format (current name, legacy underscore name,
 * or constant key like 'PATIENT_CREATE') to the current name.
 * Returns undefined for unknown names.
 */
export const normalizePermission = (permission: unknown): PermissionName | undefined => {
  if (typeof permission !== 'string') return undefined;
  const value = permission.trim();
  if ((ALL_PERMISSIONS as readonly string[]).includes(value)) return value as PermissionName;
  if (value in PERMISSIONS) return PERMISSIONS[value as keyof typeof PERMISSIONS];
  const lower = value.toLowerCase();
  if ((ALL_PERMISSIONS as readonly string[]).includes(lower)) return lower as PermissionName;
  return LEGACY_PERMISSION_MAP[lower];
};

/** A permission name; legacy names are accepted and converted */
export const PermissionSchema = z.preprocess(
  (value) => normalizePermission(value) ?? value,
  z.enum(ALL_PERMISSIONS)
);

export const RoleSchema = z.object({
  _id: ObjectIdSchema.optional(),
  name: z.string().min(1, "Nombre del rol es requerido"),
  description: z.string().optional(),
  // De-duplicated after normalization (two legacy names can map to one permission)
  permissions: z.array(PermissionSchema).default([]).transform((values) => Array.from(new Set(values))),
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

export const RoleFiltersSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  search: z.string().optional(),
  isActive: z.boolean().optional(),
});

// ===== ROLE TYPES =====
export type Permission = z.infer<typeof PermissionSchema>;
export type Role = z.infer<typeof RoleSchema>;
export type RoleForm = z.infer<typeof RoleFormSchema>;
export type RoleFilters = z.infer<typeof RoleFiltersSchema>;