import { z } from 'zod';
import { ObjectIdSchema } from './common.schemas.js';

// ===== ADMIN SCHEMAS =====

export const AdminStatsSchema = z.object({
  users: z.number().min(0),
  roles: z.number().min(0),
  clients: z.number().min(0),
  teams: z.number().min(0),
  permissions: z.number().min(0),
});

export const DashboardStatsSchema = z.object({
  pacientes: z.number().min(0),
  empresas: z.number().min(0),
  historiasClinicas: z.number().min(0),
  usuarios: z.number().min(0),
  relationships: z.object({
    pacientesByEmpresa: z.array(z.object({
      empresaName: z.string(),
      count: z.number(),
      empresaId: ObjectIdSchema,
    })),
    historiasByPaciente: z.array(z.object({
      pacienteId: ObjectIdSchema,
      pacienteName: z.string(),
      count: z.number(),
    })),
    statsByUser: z.object({
      pacientes: z.array(z.object({
        userId: ObjectIdSchema,
        userName: z.string(),
        count: z.number(),
      })),
      empresas: z.array(z.object({
        userId: ObjectIdSchema,
        userName: z.string(),
        count: z.number(),
      })),
      historias: z.array(z.object({
        userId: ObjectIdSchema,
        userName: z.string(),
        count: z.number(),
      })),
    }),
  }).optional(),
});

export const ActivityLogSchema = z.object({
  _id: ObjectIdSchema.optional(),
  user: ObjectIdSchema,
  action: z.string(),
  resource: z.string(),
  resourceId: ObjectIdSchema.optional(),
  details: z.record(z.any()).optional(),
  timestamp: z.date(),
  ip: z.string().optional(),
  userAgent: z.string().optional(),
  client: ObjectIdSchema, // Client context for activity
});

export const UserManagementFiltersSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(50),
  search: z.string().optional(),
  status: z.enum(['all', 'active', 'inactive']).default('all'),
  role: ObjectIdSchema.optional(),
  team: ObjectIdSchema.optional(),
});

// ===== ADMIN TYPES =====
export type AdminStats = z.infer<typeof AdminStatsSchema>;
export type DashboardStats = z.infer<typeof DashboardStatsSchema>;
export type ActivityLog = z.infer<typeof ActivityLogSchema>;
export type UserManagementFilters = z.infer<typeof UserManagementFiltersSchema>;