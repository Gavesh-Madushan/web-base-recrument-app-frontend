import { z } from 'zod'

export const scalarsStr10Schema = z
  .string()
  .regex(/^(?!\s).{1,10}(?<!\s)$/)
  .min(1)
  .max(10)