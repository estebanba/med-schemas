import { z } from 'zod';
import { ObjectIdSchema, AuthoringSchema } from './common.schemas.js';

// ===== INVITATION SCHEMAS =====

export const InvitationStatusEnum = z.enum([
  'pending',
  'accepted',
  'declined',
  'expired'
]);

export const InvitationRoleEnum = z.enum([
  'admin',
  'user',
  'viewer'
]);

export const InvitationSchema = z.object({
  _id: ObjectIdSchema.optional(),
  
  // Invitation details
  email: z.string().email("Email inválido"),
  invitedBy: ObjectIdSchema, // User who sent the invitation
  client: ObjectIdSchema.optional(), // Legacy client field
  organization: ObjectIdSchema.optional(), // New organization field
  role: InvitationRoleEnum.default('user'),
  
  // Invitation status
  status: InvitationStatusEnum.default('pending'),
  
  // Optional message from inviter
  message: z.string().optional(),
  
  // Invitation lifecycle
  sentAt: z.date().default(() => new Date()),
  expiresAt: z.date(), // Calculated: sentAt + 7 days
  respondedAt: z.date().optional(),
  
  // User who accepted/declined (if registered)
  respondedBy: ObjectIdSchema.optional(),
  
  // Token for email links
  invitationToken: z.string(),
  
}).merge(AuthoringSchema);

export const CreateInvitationSchema = InvitationSchema.omit({
  _id: true,
  status: true,
  sentAt: true,
  respondedAt: true,
  respondedBy: true,
  invitationToken: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  modifiedBy: true,
});

export const RespondToInvitationSchema = z.object({
  invitationToken: z.string(),
  response: z.enum(['accept', 'decline']),
});

// ===== NOTIFICATION SCHEMAS =====

export const NotificationTypeEnum = z.enum([
  'invitation_received',
  'invitation_accepted',
  'invitation_declined',
  'user_joined_client',
  'user_joined_organization', // New organization type
  'user_left_client',
  'client_created',
  'organization_created', // New organization type
  'role_changed'
]);

export const NotificationSchema = z.object({
  _id: ObjectIdSchema.optional(),
  
  // Notification target
  userId: ObjectIdSchema, // User who will receive the notification
  
  // Notification content
  type: NotificationTypeEnum,
  title: z.string(),
  message: z.string(),
  
  // Related entities
  relatedId: ObjectIdSchema.optional(), // ID of related entity (invitation, user, organization)
  relatedType: z.enum(['invitation', 'user', 'client', 'organization']).optional(),
  
  // Notification state
  isRead: z.boolean().default(false),
  readAt: z.date().optional(),
  
  // Action button (optional)
  actionLabel: z.string().optional(),
  actionUrl: z.string().optional(),
  
}).merge(AuthoringSchema);

export const CreateNotificationSchema = NotificationSchema.omit({
  _id: true,
  isRead: true,
  readAt: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  modifiedBy: true,
});

export const MarkNotificationReadSchema = z.object({
  notificationId: ObjectIdSchema,
});

// ===== TYPES =====

export type Invitation = z.infer<typeof InvitationSchema>;
export type CreateInvitation = z.infer<typeof CreateInvitationSchema>;
export type RespondToInvitation = z.infer<typeof RespondToInvitationSchema>;
export type InvitationStatus = z.infer<typeof InvitationStatusEnum>;
export type InvitationRole = z.infer<typeof InvitationRoleEnum>;

export type Notification = z.infer<typeof NotificationSchema>;
export type CreateNotification = z.infer<typeof CreateNotificationSchema>;
export type NotificationType = z.infer<typeof NotificationTypeEnum>;
export type MarkNotificationRead = z.infer<typeof MarkNotificationReadSchema>;