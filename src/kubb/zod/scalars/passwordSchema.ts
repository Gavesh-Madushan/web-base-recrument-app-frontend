import { z } from 'zod'

/**
 * @description Must contain at least 8 characters, one uppercase, one lowercase, one number and one special character
 */
export const scalarsPasswordSchema = z
  .string()
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*~{}_-])(?=.{8,})/)
  .min(1)
  .max(50)
  .describe('Must contain at least 8 characters, one uppercase, one lowercase, one number and one special character')