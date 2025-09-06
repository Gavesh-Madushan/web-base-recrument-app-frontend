import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { z } from 'zod'

export const projectEmployeeAssignmentsEmployeeAssignmentInputSchema = z.object({
  userIds: z.array(z.lazy(() => scalarsIdSchema)).max(25),
})