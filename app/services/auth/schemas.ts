import { z } from 'zod'

export const AuthFormLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const AuthFormRegisterSchema = AuthFormLoginSchema.extend({
  name: z.string().min(1),
  confirmPassword: z.string().min(8),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Password does not match.',
  path: ['confirmPassword'],
})
