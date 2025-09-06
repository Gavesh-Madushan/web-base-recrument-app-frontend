import { z } from 'zod'

export const scalarsStr100Schema = z
  .string()
  .regex(/^(?!\s).{1,100}(?<!\s)$/)
  .min(1)
  .max(100)