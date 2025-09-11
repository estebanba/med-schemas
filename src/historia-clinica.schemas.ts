import { z } from 'zod';
import { ObjectIdSchema, AuthoringSchema } from './common.schemas.js';

// ===== HISTORIA CLINICA SUB-SCHEMAS =====

export const AntecedentesPersonalesFamiliaresSchema = z.object({
  checkboxes: z.record(z.string(), z.boolean()).default({}),
  valores: z.record(z.string(), z.string()).default({}),
  inmunizaciones: z.array(z.string()).default([]),
  observaciones: z.string().default(''),
});

export const AntecedentesLaboralesSchema = z.object({
  trabajosPrevios: z.string().default(''),
  exposicionRiesgos: z.string().default(''),
  accidentesTrabajo: z.string().default(''),
  incapacidadesSecuelas: z.string().default(''),
});

export const ExamenCheckboxSchema = z.object({
  aptitud: z.enum(["N", "A", ""]).default(""),
});

export const ExamenSchema = z.object({
  valores: z.record(z.string(), z.string()).default({}),
  checkboxes: z.record(z.string(), ExamenCheckboxSchema).default({}),
  observaciones: z.string().default(''),
  numeroRX: z.string().default(''),
});

export const ExamenComplementarioSchema = z.object({
  solicitado: z.boolean().default(false),
  fecha: z.string().default(''),
  n: z.boolean().default(false),
  a: z.boolean().default(false),
  aptitud: z.enum(["N", "A", ""]).default(""),
});

export const ExamenesComplementariosSchema = z.object({
  examenes: z.record(z.string(), ExamenComplementarioSchema).default({}),
  observaciones: z.string().default(''),
});

export const ClasificacionAptitudSchema = z.object({
  aptitud: z.enum(["A", "N", ""]).optional(),
  conPreexistencias: z.enum(["con", "sin", ""]).optional(),
});

export const DeclaracionJuradaSchema = z.object({
  firmas: z.object({
    firmaEmpleado: z.string().default(''),
    firmaMedico: z.string().default(''),
  }).default({
    firmaEmpleado: '',
    firmaMedico: ''
  }),
});

// ===== MAIN HISTORIA CLINICA SCHEMAS =====

// Core domain model - pure business logic only
export const HistoriaClinicaSchema = z.object({
  _id: ObjectIdSchema.optional(),
  fecha: z.string().min(1, "Fecha es requerida"),
  tipoExamen: z.string().optional(),
  
  // Clean ObjectId references only
  paciente: ObjectIdSchema,
  organization: ObjectIdSchema,
  scheduledExam: ObjectIdSchema.optional(), // Optional reference to scheduled exam
  
  // Medical data sections
  antecedentesPersonalesFamiliares: AntecedentesPersonalesFamiliaresSchema.optional(),
  antecedentesLaborales: AntecedentesLaboralesSchema.optional(),
  examen: ExamenSchema.optional(),
  examenesComplementarios: ExamenesComplementariosSchema.optional(),
  tareasDesempenar: z.string().optional(),
  calificacionEmpresarial: z.string().optional(),
  clasificacionAptitud: ClasificacionAptitudSchema.optional(),
  informeHallazgos: z.string().optional(),
  declaracionJurada: DeclaracionJuradaSchema.optional(),
}).merge(AuthoringSchema);


// Schema for creating new Historia Clinica (excludes auto-generated fields)
export const HistoriaClinicaCreateSchema = HistoriaClinicaSchema.omit({
  _id: true,
  organization: true, // Injected by middleware
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  modifiedBy: true,
});

// Schema for updating existing Historia Clinica
export const HistoriaClinicaUpdateSchema = HistoriaClinicaSchema.partial().omit({
  _id: true,
  organization: true, // Cannot change organization
  paciente: true, // Cannot change patient
  createdAt: true,
  createdBy: true,
});

// Schema for database documents (with required _id)
export const HistoriaClinicaDocumentSchema = HistoriaClinicaSchema.extend({
  _id: ObjectIdSchema, // Required for existing documents
});

export const HistoriaClinicaFiltersSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  search: z.string().optional(),
  paciente: ObjectIdSchema.optional(),
  empresa: ObjectIdSchema.optional(),
  tipoExamen: z.string().optional(),
  fechaDesde: z.string().optional(),
  fechaHasta: z.string().optional(),
});

// ===== DOMAIN TYPES =====
export type HistoriaClinica = z.infer<typeof HistoriaClinicaSchema>;
export type HistoriaClinicaDocument = z.infer<typeof HistoriaClinicaDocumentSchema>;
export type HistoriaClinicaCreate = z.infer<typeof HistoriaClinicaCreateSchema>;
export type HistoriaClinicaUpdate = z.infer<typeof HistoriaClinicaUpdateSchema>;
export type HistoriaClinicaFilters = z.infer<typeof HistoriaClinicaFiltersSchema>;

export type AntecedentesPersonalesFamiliares = z.infer<typeof AntecedentesPersonalesFamiliaresSchema>;
export type AntecedentesLaborales = z.infer<typeof AntecedentesLaboralesSchema>;
export type Examen = z.infer<typeof ExamenSchema>;
export type ExamenComplementario = z.infer<typeof ExamenComplementarioSchema>;
export type ExamenesComplementarios = z.infer<typeof ExamenesComplementariosSchema>;
export type ClasificacionAptitud = z.infer<typeof ClasificacionAptitudSchema>;
export type DeclaracionJurada = z.infer<typeof DeclaracionJuradaSchema>;