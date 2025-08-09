import { z } from 'zod';
import { ObjectIdSchema, AuthoringSchema } from './common.schemas.js';

// ===== PACIENTE SCHEMAS =====

export const HijoSchema = z.object({
  edad: z.number().min(0).max(50),
  observaciones: z.string().optional(),
});

export const PacienteSchema = z.object({
  _id: ObjectIdSchema.optional(),
  apellido: z.string().min(1, "Apellido es requerido").transform(val => val.trim()),
  nombres: z.string().min(1, "Nombres es requerido").transform(val => val.trim()),
  dni: z.string().optional().transform(val => val && val.trim() || undefined),
  cuil: z.string().optional().transform(val => val && val.trim() || undefined),
  nacionalidad: z.string().optional().transform(val => val && val.trim() || undefined),
  fechaNacimiento: z.string().optional().transform(val => val && val.trim() || undefined),
  edad: z.number().min(0).max(120).optional(),
  sexo: z.enum(['M', 'F', 'Otro']).optional(),
  estadoCivil: z.enum(['Soltero/a', 'Casado/a', 'Divorciado/a', 'Viudo/a', 'Unión Civil']).optional(),
  domicilio: z.string().optional().transform(val => val && val.trim() || undefined),
  telefono: z.string().optional().transform(val => val && val.trim() || undefined),
  email: z.string().email().optional().or(z.literal("")).transform(val => val || undefined),
  puesto: z.string().optional().transform(val => val && val.trim() || undefined),
  fechaIngreso: z.string().optional().transform(val => val && val.trim() || undefined),
  hijos: z.array(HijoSchema).optional().default([]),
  estudios: z.string().optional().transform(val => val && val.trim() || undefined),
  titulos: z.string().optional().transform(val => val && val.trim() || undefined),
  
  // Reference to Company
  empresa: ObjectIdSchema.optional(),
  
  // Client isolation - Paciente belongs to a client
  client: ObjectIdSchema, // Required
  
  activo: z.boolean().default(true),
}).merge(AuthoringSchema);

export const PacienteFormSchema = PacienteSchema.omit({
  _id: true,
  client: true, // Injected by middleware
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  modifiedBy: true,
});

export const PacienteUpdateSchema = PacienteSchema.partial().omit({
  client: true, // Cannot change client
});

export const PacienteFiltersSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  search: z.string().optional(),
  empresa: ObjectIdSchema.optional(),
  activo: z.boolean().optional(),
  sexo: z.enum(['M', 'F', 'Otro']).optional(),
});

// ===== PACIENTE TYPES =====
export type Paciente = z.infer<typeof PacienteSchema>;
export type PacienteForm = z.infer<typeof PacienteFormSchema>;
export type PacienteUpdate = z.infer<typeof PacienteUpdateSchema>;
export type PacienteFilters = z.infer<typeof PacienteFiltersSchema>;
export type Hijo = z.infer<typeof HijoSchema>;