import { z } from 'zod'

export const scalarsMobileSchema = z
  .string()
  .regex(/^0\d{9}$/)
  .min(1)
  .max(10)