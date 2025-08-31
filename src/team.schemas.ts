import { z } from 'zod';
import { ObjectIdSchema, AuthoringSchema } from './common.schemas.js';

// ===== TEAM SCHEMAS =====

export const TeamSettingsSchema = z.object({
  allowCrossTeamAccess: z.boolean().default(false),
  defaultPermissions: z.array(z.string()).default([]),
  maxMembers: z.number().min(1).optional(),
});

export const TeamSchema = z.object({
  _id: ObjectIdSchema.optional(),
  name: z.string().min(1, "Nombre del equipo es requerido"),
  description: z.string().optional(),
  organization: ObjectIdSchema, // Required - Team belongs to an organization
  isActive: z.boolean().default(true),
  settings: TeamSettingsSchema.optional(),
}).merge(AuthoringSchema);

export const TeamFormSchema = TeamSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  modifiedBy: true,
});

// ===== TEAM TYPES =====
export type Team = z.infer<typeof TeamSchema>;
export type TeamForm = z.infer<typeof TeamFormSchema>;
export type TeamSettings = z.infer<typeof TeamSettingsSchema>;