import { scalarsMobileSchema } from '../scalars/mobileSchema.ts'
import { scalarsPasswordSchema } from '../scalars/passwordSchema.ts'
import { z } from 'zod'

export const sessionsSessionInputSchema = z.object({
  mobile: z.lazy(() => scalarsMobileSchema),
  password: z.lazy(() => scalarsPasswordSchema),
})