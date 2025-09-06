import { enumsApprovalStateSchema } from '../enums/approvalStateSchema.ts'
import { enumsLeaveRequestPeriodSchema } from '../enums/leaveRequestPeriodSchema.ts'
import { enumsLeaveRequestTypeSchema } from '../enums/leaveRequestTypeSchema.ts'
import { scalarsDaySchema } from '../scalars/daySchema.ts'
import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { scalarsMonthSchema } from '../scalars/monthSchema.ts'
import { scalarsStr100Schema } from '../scalars/str100Schema.ts'
import { scalarsYearSchema } from '../scalars/yearSchema.ts'
import { z } from 'zod'

export const leaveRequestsLeaveRequestSchema = z.object({
  id: z.lazy(() => scalarsIdSchema),
  userId: z.lazy(() => scalarsIdSchema),
  divisionId: z.lazy(() => scalarsIdSchema),
  createdAt: z.string().datetime(),
  type: z.lazy(() => enumsLeaveRequestTypeSchema),
  period: z.lazy(() => enumsLeaveRequestPeriodSchema),
  year: z.lazy(() => scalarsYearSchema),
  month: z.lazy(() => scalarsMonthSchema),
  day: z.lazy(() => scalarsDaySchema),
  emp1ApprovalState: z.lazy(() => enumsApprovalStateSchema),
  emp2ApprovalState: z.lazy(() => enumsApprovalStateSchema),
  description: z.lazy(() => scalarsStr100Schema).nullable(),
  comment: z.lazy(() => scalarsStr100Schema).nullable(),
})