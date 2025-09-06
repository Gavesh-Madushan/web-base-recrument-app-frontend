import { scalarsPasswordSchema } from '../scalars/passwordSchema.ts'
import { z } from 'zod'

export const structsPasswordInputSchema = z.object({
  password: z.lazy(() => scalarsPasswordSchema),
})