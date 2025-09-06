import { z } from 'zod'

export const scalarsStr20Schema = z
  .string()
  .regex(/^(?!\s).{1,20}(?<!\s)$/)
  .min(1)
  .max(20)