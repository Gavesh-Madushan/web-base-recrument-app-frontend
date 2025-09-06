import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { scalarsStr100Schema } from '../scalars/str100Schema.ts'
import { z } from 'zod'

export const leaveRequestsLeaveRequestsReviewInputSchema = z.object({
  id: z.lazy(() => scalarsIdSchema),
  approvalState: z.enum(['APPROVED', 'REJECTED']),
  comment: z.lazy(() => scalarsStr100Schema).nullable(),
})