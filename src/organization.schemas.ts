import { z } from 'zod';
import { ObjectIdSchema, AuthoringSchema } from './common.schemas.js';

// ===== ORGANIZATION SCHEMAS =====

export const OrganizationSettingsSchema = z.object({
  timezone: z.string().default('America/Argentina/Buenos_Aires'),
  language: z.string().default('es'),
  currency: z.string().default('ARS'),
  dateFormat: z.string().default('DD/MM/YYYY'),
  allowCrossOrganizationAccess: z.boolean().default(false),
});

export const OrganizationSchema = z.object({
  _id: ObjectIdSchema.optional(),
  name: z.string().min(1, "Nombre de la organización es requerido"),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  settings: OrganizationSettingsSchema.optional(),
}).merge(AuthoringSchema);

export const OrganizationFormSchema = OrganizationSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  modifiedBy: true,
});

// ===== ORGANIZATION TYPES =====
export type Organization = z.infer<typeof OrganizationSchema>;
export type OrganizationForm = z.infer<typeof OrganizationFormSchema>;
export type OrganizationSettings = z.infer<typeof OrganizationSettingsSchema>;