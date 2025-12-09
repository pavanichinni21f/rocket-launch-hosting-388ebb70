import { z } from 'zod';

export const ticketSchema = z.object({
  subject: z
    .string()
    .min(5, 'Subject must be at least 5 characters')
    .max(120, 'Subject must be 120 characters or less'),
  description: z
    .string()
    .max(2000, 'Description must be 2000 characters or less')
    .nullable()
    .optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
});

export const accountSchema = z.object({
  name: z
    .string()
    .min(3, 'Account name must be at least 3 characters')
    .max(50, 'Account name cannot exceed 50 characters')
    .regex(
      /^[a-zA-Z0-9\- ]+$/,
      'Account name may only contain letters, numbers, spaces and hyphens'
    ),
  server_location: z.enum(['us-east', 'us-west', 'eu-west', 'ap-south']),
});

export type Ticket = z.infer<typeof ticketSchema>;
export type HostingAccount = z.infer<typeof accountSchema>;
