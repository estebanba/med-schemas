import { z } from 'zod';
import { ObjectIdSchema, AuthoringSchema } from './common.schemas.js';

// ===== EMPRESA SCHEMAS =====

export const EmpresaSchema = z.object({
  _id: ObjectIdSchema.optional(),
  nombre: z.string().min(1, "Nombre de la empresa es requerido").transform(val => val.trim()),
  cuit: z.string().optional().transform(val => val && val.trim() || undefined),
  sector: z.enum([
    'construccion',
    'manufactura',
    'servicios',
    'tecnologia',
    'salud',
    'educacion',
    'retail',
    'alimentario',
    'logistica',
    'otros'
  ]).optional(),
  descripcion: z.string().optional().transform(val => val && val.trim() || undefined),
  direccion: z.string().optional().transform(val => val && val.trim() || undefined),
  telefono: z.string().optional().transform(val => val && val.trim() || undefined),
  email: z.string().email().optional().or(z.literal("")).transform(val => val || undefined),
  contacto: z.string().optional().transform(val => val && val.trim() || undefined),
  
  // Client isolation - Empresa belongs to a client
  client: ObjectIdSchema, // Required
  
  activa: z.boolean().default(true),
}).merge(AuthoringSchema);

export const EmpresaFormSchema = EmpresaSchema.omit({
  _id: true,
  client: true, // Injected by middleware
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  modifiedBy: true,
});

export const EmpresaUpdateSchema = EmpresaSchema.partial().omit({
  client: true, // Cannot change client
});

export const EmpresaFiltersSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  search: z.string().optional(),
  sector: z.enum([
    'todos',
    'construccion',
    'manufactura',
    'servicios',
    'tecnologia',
    'salud',
    'educacion',
    'retail',
    'alimentario',
    'logistica',
    'otros'
  ]).optional(),
  activa: z.boolean().optional(),
});

// ===== EMPRESA TYPES =====
export type Empresa = z.infer<typeof EmpresaSchema>;
export type EmpresaForm = z.infer<typeof EmpresaFormSchema>;
export type EmpresaUpdate = z.infer<typeof EmpresaUpdateSchema>;
export type EmpresaFilters = z.infer<typeof EmpresaFiltersSchema>;