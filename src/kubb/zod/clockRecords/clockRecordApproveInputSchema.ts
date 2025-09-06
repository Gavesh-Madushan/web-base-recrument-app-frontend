import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { scalarsStr100Schema } from '../scalars/str100Schema.ts'
import { z } from 'zod'

export const clockRecordsClockRecordApproveInputSchema = z.object({
  id: z.lazy(() => scalarsIdSchema),
  comment: z.lazy(() => scalarsStr100Schema).nullable(),
})