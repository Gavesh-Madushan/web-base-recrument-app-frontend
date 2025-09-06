import { enumsApprovalStateSchema } from '../enums/approvalStateSchema.ts'
import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { scalarsMoneySchema } from '../scalars/moneySchema.ts'
import { scalarsStr100Schema } from '../scalars/str100Schema.ts'
import { scalarsWSchema } from '../scalars/wSchema.ts'
import { z } from 'zod'

export const clockRecordsClockRecordSchema = z.object({
  id: z.lazy(() => scalarsIdSchema),
  userId: z.lazy(() => scalarsIdSchema),
  divisionId: z.lazy(() => scalarsIdSchema),
  createdAt: z.string().datetime(),
  paymentOutstation: z.lazy(() => scalarsMoneySchema),
  otHrs: z.lazy(() => scalarsWSchema),
  endedAt: z.string().datetime().nullable(),
  approvalState: z.lazy(() => enumsApprovalStateSchema),
  comment: z.lazy(() => scalarsStr100Schema).nullable(),
})