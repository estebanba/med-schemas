// Disabled audit schemas for development speed
import { z } from 'zod';

// Minimal stubs to avoid breaking imports
export const AuditActionSchema = z.enum(['VIEW']);
export const AuditResourceSchema = z.enum(['SYSTEM']);
export const AuditSeveritySchema = z.enum(['LOW']);

export const AuditLogFiltersSchema = z.object({
  userId: z.string().optional(),
  patientId: z.string().optional(),
  action: AuditActionSchema.optional(),
  resource: AuditResourceSchema.optional(),
  resourceId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  severity: AuditSeveritySchema.optional(),
  search: z.string().optional(),
  page: z.number().default(1),
  limit: z.number().default(50),
  offset: z.number().optional(),
  sortBy: z.string().default('timestamp'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  includeArchived: z.boolean().optional()
});

export type AuditAction = z.infer<typeof AuditActionSchema>;
export type AuditResource = z.infer<typeof AuditResourceSchema>;
export type AuditSeverity = z.infer<typeof AuditSeveritySchema>;
export type AuditLogFilters = z.infer<typeof AuditLogFiltersSchema>;