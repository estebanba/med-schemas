import { z } from 'zod';
import { ObjectIdSchema, AuthoringSchema } from './common.schemas.js';

// ===== CLIENT SCHEMAS =====

export const ClientSettingsSchema = z.object({
  timezone: z.string().default('America/Argentina/Buenos_Aires'),
  language: z.string().default('es'),
  currency: z.string().default('ARS'),
  dateFormat: z.string().default('DD/MM/YYYY'),
  allowCrossClientAccess: z.boolean().default(false),
});

export const ClientSchema = z.object({
  _id: ObjectIdSchema.optional(),
  name: z.string().min(1, "Nombre del cliente es requerido"),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  settings: ClientSettingsSchema.optional(),
}).merge(AuthoringSchema);

export const ClientFormSchema = ClientSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  modifiedBy: true,
});

// ===== CLIENT TYPES =====
export type Client = z.infer<typeof ClientSchema>;
export type ClientForm = z.infer<typeof ClientFormSchema>;
export type ClientSettings = z.infer<typeof ClientSettingsSchema>;