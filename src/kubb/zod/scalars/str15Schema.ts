import { z } from 'zod'

export const scalarsStr15Schema = z
  .string()
  .regex(/^(?!\s).{1,15}(?<!\s)$/)
  .min(1)
  .max(15)