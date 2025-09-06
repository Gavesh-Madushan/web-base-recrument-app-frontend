import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { scalarsStr50Schema } from '../scalars/str50Schema.ts'
import { z } from 'zod'

export const rolesRoleSchema = z.object({
  id: z.lazy(() => scalarsIdSchema),
  name: z.lazy(() => scalarsStr50Schema),
})