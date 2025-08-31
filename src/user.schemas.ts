import { z } from 'zod';
import { ObjectIdSchema, AuthoringSchema } from './common.schemas.js';

// Forward declarations for populated schemas
const OrganizationRefSchema = z.object({
  _id: ObjectIdSchema.optional(),
  name: z.string(),
}).optional();


const RoleRefSchema = z.object({
  _id: ObjectIdSchema.optional(),
  name: z.string(),
  permissions: z.array(z.string()).optional(),
}).optional();

const TeamRefSchema = z.object({
  _id: ObjectIdSchema.optional(),
  name: z.string(),
}).optional();

// ===== USER SCHEMAS =====

export const UserProfileSchema = z.object({
  avatar: z.string().optional(),
  phone: z.string().optional(),
  department: z.string().optional(),
  position: z.string().optional(),
  bio: z.string().optional(),
  address: z.string().optional(),
  // Additional fields for form compatibility
  name: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().optional(),
  profile: z.object({
    avatar: z.string().optional(),
    phone: z.string().optional(),
    department: z.string().optional(),
    position: z.string().optional(),
    bio: z.string().optional(),
  }).optional(),
});

export const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('light'),
  language: z.string().default('es'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(true),
    sms: z.boolean().default(false),
    browser: z.boolean().default(true), // Legacy compatibility
  }).optional(),
});

export const UserSchema = z.object({
  _id: ObjectIdSchema.optional(),
  userName: z.string().min(1, "Nombre de usuario es requerido"),
  email: z.string().email("Email inválido"),
  password: z.string().optional(), // Only for creation/updates
  name: z.string().min(1, "Nombre es requerido"),
  lastName: z.string().optional(),
  
  // Organizational relationships (can be ObjectId strings or populated objects)
  organizations: z.array(z.union([ObjectIdSchema, OrganizationRefSchema])).optional(),
  team: z.union([ObjectIdSchema, TeamRefSchema]).optional(),
  role: z.union([ObjectIdSchema, RoleRefSchema]).optional(),
  
  // Profile information
  profile: UserProfileSchema.optional(),
  
  // User status and preferences
  isActive: z.boolean().default(true),
  isEmailVerified: z.boolean().default(false),
  isVerified: z.boolean().default(false),
  lastLogin: z.date().optional(),
  
  // User preferences
  preferences: UserPreferencesSchema.optional(),
  settings: UserPreferencesSchema.optional(), // Legacy compatibility
}).merge(AuthoringSchema);

export const UserFormSchema = UserSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  modifiedBy: true,
  lastLogin: true,
});

export const UserPublicSchema = UserSchema.omit({
  password: true,
});

export const UserProfileUpdateSchema = z.object({
  name: z.string().min(1, "Nombre es requerido"),
  lastName: z.string().optional(),
  email: z.string().email("Email inválido"),
  profile: UserProfileSchema.optional(),
  preferences: UserPreferencesSchema.optional(),
  settings: UserPreferencesSchema.optional(), // Legacy compatibility
});

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Contraseña actual es requerida"),
  newPassword: z.string().min(6, "La nueva contraseña debe tener al menos 6 caracteres"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export const LoginSchema = z.object({
  userName: z.string().min(1, "Nombre de usuario es requerido"),
  password: z.string().min(1, "Contraseña es requerida"),
});

export const AuthStateSchema = z.object({
  user: UserPublicSchema.nullable(),
  token: z.string().nullable(),
  isLoading: z.boolean(),
  error: z.string().nullable(),
});

// ===== USER TYPES =====
export type User = z.infer<typeof UserSchema>;
export type UserForm = z.infer<typeof UserFormSchema>;
export type UserPublic = z.infer<typeof UserPublicSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type UserPreferences = z.infer<typeof UserPreferencesSchema>;
export type UserProfileUpdate = z.infer<typeof UserProfileUpdateSchema>;
export type ChangePassword = z.infer<typeof ChangePasswordSchema>;
export type Login = z.infer<typeof LoginSchema>;
export type AuthState = z.infer<typeof AuthStateSchema>;