// Disabled audit schemas for development speed
import { z } from 'zod';

// Minimal stubs to avoid breaking imports
export const AuditActionSchema = z.enum(['VIEW']);
export const AuditResourceSchema = z.enum(['SYSTEM']);
export const AuditSeveritySchema = z.enum(['LOW']);

export type AuditAction = z.infer<typeof AuditActionSchema>;
export type AuditResource = z.infer<typeof AuditResourceSchema>;
export type AuditSeverity = z.infer<typeof AuditSeveritySchema>;