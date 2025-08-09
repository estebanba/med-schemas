import { z } from 'zod';

// ===== COMMON SCHEMAS =====

export const ObjectIdSchema = z.string().min(24).max(24);

export const DateStringSchema = z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/));

export const PaginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  total: z.number().min(0).optional(),
  totalPages: z.number().min(0).optional(),
});

export const AuthoringSchema = z.object({
  createdBy: ObjectIdSchema.optional(),
  modifiedBy: z.array(z.object({
    user: ObjectIdSchema,
    updatedAt: z.date(),
    action: z.string().optional(),
  })).optional().default([]),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const ApiResponseSchema = <T extends z.ZodType>(dataSchema: T) => z.object({
  success: z.boolean(),
  data: dataSchema,
  error: z.string().optional(),
  message: z.string().optional(),
});

// ===== COMMON TYPES =====
export type ObjectId = z.infer<typeof ObjectIdSchema>;
export type DateString = z.infer<typeof DateStringSchema>;
export type Pagination = z.infer<typeof PaginationSchema>;
export type Authoring = z.infer<typeof AuthoringSchema>;
export type ApiResponse<T> = {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
};