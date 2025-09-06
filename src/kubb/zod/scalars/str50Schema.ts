import { z } from 'zod'

export const scalarsStr50Schema = z
  .string()
  .regex(/^(?!\s).{1,50}(?<!\s)$/)
  .min(1)
  .max(50)