import { z } from 'zod';
import { ObjectIdSchema } from './common.schemas.js';

// ===== AUDIT TRAIL SCHEMAS =====

// Audit action types for medical records
export const AuditActionSchema = z.enum([
  // Data access actions
  'VIEW',           // Viewing patient/historia clinica data
  'SEARCH',         // Searching for records
  'LIST',           // Listing multiple records
  'EXPORT',         // Exporting data
  'PRINT',          // Printing records
  
  // Data modification actions  
  'CREATE',         // Creating new records
  'UPDATE',         // Updating existing records
  'DELETE',         // Deleting records
  'RESTORE',        // Restoring deleted records
  
  // Authentication actions
  'LOGIN',          // User login
  'LOGOUT',         // User logout
  'LOGIN_FAILED',   // Failed login attempt
  'SESSION_EXPIRED', // Session expiration
  
  // Administrative actions
  'USER_CREATE',    // Creating new users
  'USER_UPDATE',    // Updating user data
  'USER_DELETE',    // Deleting users
  'ROLE_CHANGE',    // Changing user roles
  'PERMISSION_CHANGE', // Changing permissions
  
  // Security events
  'UNAUTHORIZED_ACCESS', // Attempted unauthorized access
  'SUSPICIOUS_ACTIVITY', // Suspicious behavior detected
  'DATA_BREACH_ATTEMPT', // Potential data breach
]);

// Resource types being audited
export const AuditResourceSchema = z.enum([
  'HISTORIA_CLINICA',
  'PACIENTE', 
  'EMPRESA',
  'USER',
  'AUTH',
  'SYSTEM',
  'FILE',
  'EXPORT',
]);

// Audit severity levels
export const AuditSeveritySchema = z.enum([
  'LOW',      // Normal operations
  'MEDIUM',   // Important changes
  'HIGH',     // Security-sensitive actions
  'CRITICAL', // Security incidents
]);

// IP geolocation data for security tracking
export const GeolocationSchema = z.object({
  country: z.string().optional(),
  region: z.string().optional(), 
  city: z.string().optional(),
  timezone: z.string().optional(),
  isp: z.string().optional(),
});

// Device/browser information
export const DeviceInfoSchema = z.object({
  userAgent: z.string().optional(),
  browser: z.string().optional(),
  os: z.string().optional(),
  device: z.string().optional(),
  isMobile: z.boolean().optional(),
});

// Main audit log entry schema
export const AuditLogSchema = z.object({
  _id: ObjectIdSchema.optional(),
  
  // What happened
  action: AuditActionSchema,
  resource: AuditResourceSchema,
  resourceId: ObjectIdSchema.optional(), // ID of the affected resource
  description: z.string(), // Human-readable description
  
  // Who did it
  userId: ObjectIdSchema.optional(), // User who performed the action
  userName: z.string().optional(),   // Username for failed logins
  clientId: ObjectIdSchema.optional(), // Client organization
  
  // When and where
  timestamp: z.date().default(() => new Date()),
  ipAddress: z.string(),
  geolocation: GeolocationSchema.optional(),
  deviceInfo: DeviceInfoSchema.optional(),
  
  // Security context
  severity: AuditSeveritySchema.default('LOW'),
  sessionId: z.string().optional(),
  
  // Additional data
  metadata: z.record(z.string(), z.any()).optional(), // Flexible additional data
  oldValues: z.record(z.string(), z.any()).optional(), // Previous values for updates
  newValues: z.record(z.string(), z.any()).optional(), // New values for updates
  
  // HIPAA compliance fields
  patientId: ObjectIdSchema.optional(), // Patient affected (for medical records)
  businessAssociate: z.string().optional(), // Business associate if applicable
  purpose: z.string().optional(), // Purpose of access/modification
  
  // Result tracking
  success: z.boolean().default(true),
  errorMessage: z.string().optional(),
  
  // Retention and cleanup
  retentionDate: z.date().optional(), // When this log can be archived
  archived: z.boolean().default(false),
}).strict();

// Schema for creating audit logs (excludes auto-generated fields)
export const AuditLogCreateSchema = AuditLogSchema.omit({
  _id: true,
  timestamp: true,
  archived: true,
});

// Schema for querying audit logs
export const AuditLogFiltersSchema = z.object({
  // Time range
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  
  // Who
  userId: ObjectIdSchema.optional(),
  clientId: ObjectIdSchema.optional(),
  
  // What
  action: AuditActionSchema.optional(),
  resource: AuditResourceSchema.optional(),
  resourceId: ObjectIdSchema.optional(),
  severity: AuditSeveritySchema.optional(),
  
  // Patient-specific (HIPAA compliance)
  patientId: ObjectIdSchema.optional(),
  
  // Search
  search: z.string().optional(), // Search in description or metadata
  
  // Pagination
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(25),
  
  // Sorting
  sortBy: z.enum(['timestamp', 'severity', 'action', 'user']).default('timestamp'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Summary statistics schema
export const AuditStatsSchema = z.object({
  totalEntries: z.number(),
  timeRange: z.object({
    start: z.date(),
    end: z.date(),
  }),
  actionCounts: z.record(z.string(), z.number()),
  severityCounts: z.record(z.string(), z.number()),
  topUsers: z.array(z.object({
    userId: z.string(),
    userName: z.string(),
    count: z.number(),
  })),
  securityEvents: z.number(), // Count of HIGH/CRITICAL events
  failedLogins: z.number(),
  patientAccess: z.number(), // Medical record access count
});

// ===== AUDIT TYPES =====
export type AuditLog = z.infer<typeof AuditLogSchema>;
export type AuditLogCreate = z.infer<typeof AuditLogCreateSchema>;
export type AuditLogFilters = z.infer<typeof AuditLogFiltersSchema>;
export type AuditStats = z.infer<typeof AuditStatsSchema>;
export type AuditAction = z.infer<typeof AuditActionSchema>;
export type AuditResource = z.infer<typeof AuditResourceSchema>;
export type AuditSeverity = z.infer<typeof AuditSeveritySchema>;
export type Geolocation = z.infer<typeof GeolocationSchema>;
export type DeviceInfo = z.infer<typeof DeviceInfoSchema>;