import { z } from 'zod';
import { ObjectIdSchema, AuthoringSchema } from './common.schemas.js';

// ===== SCHEDULED EXAM SCHEMAS =====

// Exam status workflow
export const ScheduledExamStatusEnum = z.enum([
  'draft',           // Being created/edited
  'open_registration', // Patients can be assigned
  'closed',          // Registration closed, ready to start
  'in_progress',     // Exams being conducted
  'completed',       // All exams finished
  'cancelled'        // Event cancelled
]);

// Exam types matching Historia Clinica types
export const ExamTypeEnum = z.enum([
  'ingreso',         // Pre-employment
  'periodico',       // Periodic health check
  'egreso',          // Exit exam
  'cambio_sector'    // Sector change
]);

// Patient registration status within a scheduled exam
export const PatientRegistrationStatusEnum = z.enum([
  'registered',      // Patient assigned to exam
  'confirmed',       // Patient confirmed attendance
  'completed',       // Historia Clinica created
  'no_show'         // Patient didn't attend
]);

// Patient registration within scheduled exam
export const PatientRegistrationSchema = z.object({
  patient: ObjectIdSchema,
  status: PatientRegistrationStatusEnum.default('registered'),
  registeredAt: z.date().default(() => new Date()),
  confirmedAt: z.date().optional(),
  completedAt: z.date().optional(),
  notes: z.string().optional(), // Special instructions for this patient
  priority: z.number().default(0), // 0 = normal, higher = priority
});

// Main ScheduledExam schema - simplified
export const ScheduledExamSchema = z.object({
  _id: ObjectIdSchema.optional(),
  
  // Core event information
  name: z.string().min(1, "Nombre del examen programado es requerido"),
  description: z.string().optional(),
  
  // Scheduling details - just date
  examDate: z.union([
    z.date(), 
    z.string().transform((val) => new Date(val))
  ]),
  
  // Location - single field
  location: z.string().min(1, "Ubicación es requerida"),
  
  // Business context
  company: ObjectIdSchema, // Empresa conducting the exam
  examType: ExamTypeEnum,
  
  // Resource allocation
  assignedStaff: z.array(ObjectIdSchema).default([]), // Medical staff assigned
  
  // Patient management
  registeredPatients: z.array(PatientRegistrationSchema).default([]),
  
  // Auto-generated data tracking
  generatedHistorias: z.array(ObjectIdSchema).default([]), // Track created Historia Clinicas
  
  // Organization context (multi-tenant)
  organization: ObjectIdSchema,
  
  // Statistics (computed fields)
  stats: z.object({
    totalRegistered: z.number().default(0),
    totalCompleted: z.number().default(0),
    completionRate: z.number().default(0),
    lastUpdated: z.date().optional(),
  }).optional(),
  
}).merge(AuthoringSchema);

// Forms for creating/updating scheduled exams
export const CreateScheduledExamSchema = ScheduledExamSchema.omit({
  _id: true,
  generatedHistorias: true,
  stats: true,
  organization: true, // Added by backend middleware
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  modifiedBy: true,
});

export const UpdateScheduledExamSchema = CreateScheduledExamSchema.partial();

// Schema for adding/removing patients from scheduled exam
export const ManagePatientsSchema = z.object({
  scheduledExamId: ObjectIdSchema,
  patients: z.array(z.object({
    patientId: ObjectIdSchema,
    action: z.enum(['add', 'remove', 'update']),
    registrationData: PatientRegistrationSchema.omit({ patient: true }).optional(),
  })),
});

// Schema for updating patient registration status
export const UpdatePatientRegistrationSchema = z.object({
  scheduledExamId: ObjectIdSchema,
  patientId: ObjectIdSchema,
  status: PatientRegistrationStatusEnum,
  notes: z.string().optional(),
});

// Schema for generating Historia Clinicas from scheduled exam
export const GenerateHistoriasSchema = z.object({
  scheduledExamId: ObjectIdSchema,
  patientIds: z.array(ObjectIdSchema).optional(), // If not provided, generate for all registered patients
  prefillData: z.object({
    // Data to prefill in generated historias
    fecha: z.string().optional(),
    tipoExamen: z.string().optional(),
    // Add more prefill fields as needed
  }).optional(),
});

// Filters for searching scheduled exams
export const ScheduledExamFiltersSchema = z.object({
  status: ScheduledExamStatusEnum.optional(),
  examType: ExamTypeEnum.optional(),
  company: ObjectIdSchema.optional(),
  assignedStaff: ObjectIdSchema.optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  location: z.string().optional(),
});

// ===== TYPES =====
export type ScheduledExam = z.infer<typeof ScheduledExamSchema>;
export type CreateScheduledExam = z.infer<typeof CreateScheduledExamSchema>;
export type UpdateScheduledExam = z.infer<typeof UpdateScheduledExamSchema>;
export type PatientRegistration = z.infer<typeof PatientRegistrationSchema>;
export type ManagePatients = z.infer<typeof ManagePatientsSchema>;
export type UpdatePatientRegistration = z.infer<typeof UpdatePatientRegistrationSchema>;
export type GenerateHistorias = z.infer<typeof GenerateHistoriasSchema>;
export type ScheduledExamFilters = z.infer<typeof ScheduledExamFiltersSchema>;

export type ScheduledExamStatus = z.infer<typeof ScheduledExamStatusEnum>;
export type ExamType = z.infer<typeof ExamTypeEnum>;
export type PatientRegistrationStatus = z.infer<typeof PatientRegistrationStatusEnum>;