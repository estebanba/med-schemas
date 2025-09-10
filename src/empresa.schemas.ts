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
  calificacionEmpresarial: z.string().optional().transform(val => val && val.trim() || undefined),
  
  // Organization isolation - Empresa belongs to an organization
  organization: ObjectIdSchema, // Required
  
  activa: z.boolean().default(true),
}).merge(AuthoringSchema);

// Schema for Empresa with patient count (used in lists/reports)
export const EmpresaWithPatientCountSchema = EmpresaSchema.extend({
  patientCount: z.number().default(0),
});

export const EmpresaFormSchema = EmpresaSchema.omit({
  _id: true,
  organization: true, // Injected by middleware
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  modifiedBy: true,
});

export const EmpresaUpdateSchema = EmpresaSchema.partial().omit({
  organization: true, // Cannot change organization
});

export const EmpresaFiltersSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  search: z.string().optional(),
  searchTerm: z.string().optional(), // Legacy compatibility
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
  ]).or(z.literal("")).optional(), // Allow empty string
  activa: z.boolean().optional(),
});

// ===== EMPRESA TYPES =====
export type Empresa = z.infer<typeof EmpresaSchema>;
export type EmpresaWithPatientCount = z.infer<typeof EmpresaWithPatientCountSchema>;
export type EmpresaForm = z.infer<typeof EmpresaFormSchema>;
export type EmpresaUpdate = z.infer<typeof EmpresaUpdateSchema>;
export type EmpresaFilters = z.infer<typeof EmpresaFiltersSchema>;