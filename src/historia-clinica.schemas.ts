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
  texto: z.string().default(''),
  firmas: z.object({
    firmaEmpleado: z.string().default(''),
    firmaMedico: z.string().default(''),
  }).default({
    firmaEmpleado: '',
    firmaMedico: ''
  }),
});

// ===== MAIN HISTORIA CLINICA SCHEMAS =====

export const HistoriaClinicaSchema = z.object({
  _id: ObjectIdSchema.optional(),
  fecha: z.string().optional(),
  tipoExamen: z.string().optional(),
  
  // Reference to Patient model instead of duplicating data
  paciente: ObjectIdSchema, // Required Patient ID
  
  // Client isolation - Historia Clinica belongs to a client
  client: ObjectIdSchema, // Required Client ID
  
  antecedentesPersonalesFamiliares: AntecedentesPersonalesFamiliaresSchema.optional(),
  antecedentesLaborales: AntecedentesLaboralesSchema.optional(),
  examen: ExamenSchema.optional(),
  examenesComplementarios: ExamenesComplementariosSchema.optional(),
  tareasDesempenar: z.string().optional(),
  calificacionEmpresarial: z.string().optional(),
  clasificacionAptitud: ClasificacionAptitudSchema.optional(),
  informeHallazgos: z.string().optional(),
  declaracionJurada: DeclaracionJuradaSchema.optional(),
  
  // Frontend-specific field for offline/error handling
  error: z.string().optional(),
}).merge(AuthoringSchema);

// Form schema for when patient data is included inline (legacy support)
export const HistoriaClinicaWithPatientSchema = z.object({
  _id: ObjectIdSchema.optional(),
  fecha: z.string().optional(),
  tipoExamen: z.string().optional(),
  
  // Patient data (for forms that include patient data inline)
  apellido: z.string().optional(),
  nombres: z.string().min(1, "Nombres es requerido"),
  empresa: ObjectIdSchema.optional(), // Company ID
  dni: z.string().optional(),
  cuil: z.string().optional(),
  nacionalidad: z.string().optional(),
  edad: z.number().min(0).max(120).optional(),
  fechaNacimiento: z.string().optional(),
  estadoCivil: z.string().optional(),
  hijos: z.array(z.number()).optional(),
  estudios: z.string().optional(),
  titulos: z.string().optional(),
  domicilio: z.string().optional(),
  
  // Historia Clinica data
  antecedentesPersonalesFamiliares: AntecedentesPersonalesFamiliaresSchema.optional(),
  antecedentesLaborales: AntecedentesLaboralesSchema.optional(),
  examen: ExamenSchema.optional(),
  examenesComplementarios: ExamenesComplementariosSchema.optional(),
  tareasDesempenar: z.string().optional(),
  calificacionEmpresarial: z.string().optional(),
  clasificacionAptitud: ClasificacionAptitudSchema.optional(),
  informeHallazgos: z.string().optional(),
  declaracionJurada: DeclaracionJuradaSchema.optional(),
  error: z.string().optional(),
});

export const HistoriaClinicaFormSchema = HistoriaClinicaSchema.omit({
  _id: true,
  client: true, // Injected by middleware
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  modifiedBy: true,
});

// Schema with required _id for existing records
export const HistoriaClinicaDocumentSchema = HistoriaClinicaSchema.extend({
  _id: ObjectIdSchema, // Required for existing documents
});

export const HistoriaClinicaUpdateSchema = HistoriaClinicaSchema.partial().omit({
  client: true, // Cannot change client
  paciente: true, // Cannot change patient
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

// ===== HISTORIA CLINICA TYPES =====
export type HistoriaClinica = z.infer<typeof HistoriaClinicaSchema>;
export type HistoriaClinicaDocument = z.infer<typeof HistoriaClinicaDocumentSchema>;
export type HistoriaClinicaWithPatient = z.infer<typeof HistoriaClinicaWithPatientSchema>;
export type HistoriaClinicaForm = z.infer<typeof HistoriaClinicaFormSchema>;
export type HistoriaClinicaUpdate = z.infer<typeof HistoriaClinicaUpdateSchema>;
export type HistoriaClinicaFilters = z.infer<typeof HistoriaClinicaFiltersSchema>;

export type AntecedentesPersonalesFamiliares = z.infer<typeof AntecedentesPersonalesFamiliaresSchema>;
export type AntecedentesLaborales = z.infer<typeof AntecedentesLaboralesSchema>;
export type Examen = z.infer<typeof ExamenSchema>;
export type ExamenComplementario = z.infer<typeof ExamenComplementarioSchema>;
export type ExamenesComplementarios = z.infer<typeof ExamenesComplementariosSchema>;
export type ClasificacionAptitud = z.infer<typeof ClasificacionAptitudSchema>;
export type DeclaracionJurada = z.infer<typeof DeclaracionJuradaSchema>;