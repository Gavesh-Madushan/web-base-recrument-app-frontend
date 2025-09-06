import { enumsApprovalStateSchema } from '../enums/approvalStateSchema.ts'
import { enumsEmployeeDesignationSchema } from '../enums/employeeDesignationSchema.ts'
import { enumsLeaveRequestPeriodSchema } from '../enums/leaveRequestPeriodSchema.ts'
import { enumsLeaveRequestTypeSchema } from '../enums/leaveRequestTypeSchema.ts'
import { scalarsDaySchema } from '../scalars/daySchema.ts'
import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { scalarsMonthSchema } from '../scalars/monthSchema.ts'
import { scalarsStr10Schema } from '../scalars/str10Schema.ts'
import { scalarsStr50Schema } from '../scalars/str50Schema.ts'
import { scalarsStr100Schema } from '../scalars/str100Schema.ts'
import { scalarsYearSchema } from '../scalars/yearSchema.ts'
import { z } from 'zod'

export const listLeaveRequestsQueryParamsSchema = z
  .object({
    pageSize: z.coerce.number().int().min(1).max(50).default(10),
    page: z.coerce.number().int().min(0).optional(),
    searchTerm: z.lazy(() => scalarsStr10Schema).optional(),
    divisionId: z.lazy(() => scalarsIdSchema).optional(),
    userId: z
      .union([z.lazy(() => scalarsIdSchema), z.enum(['@me'])])
      .describe('Only allowed @me. It filters self owned items')
      .optional(),
    emp1ApprovalState: z.lazy(() => enumsApprovalStateSchema).optional(),
    emp2ApprovalState: z.lazy(() => enumsApprovalStateSchema).optional(),
    type: z.lazy(() => enumsLeaveRequestTypeSchema).optional(),
    year: z.lazy(() => scalarsYearSchema).optional(),
    month: z.lazy(() => scalarsMonthSchema).optional(),
    day: z.lazy(() => scalarsDaySchema).optional(),
    startsFrom: z.string().datetime().optional(),
    startsTo: z.string().datetime().optional(),
    joinUser: z.boolean().default(false),
  })
  .optional()

/**
 * @description The request has succeeded.
 */
export const listLeaveRequests200Schema = z.object({
  totalCount: z.coerce.number().int().describe("Will be calculated only if the 'page' parameter is explicitly set to 0").optional(),
  data: z.array(
    z.object({
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
      user: z
        .object({
          designation: z.lazy(() => enumsEmployeeDesignationSchema),
          employeeNumber: z.lazy(() => scalarsStr50Schema),
          class: z.lazy(() => scalarsStr50Schema),
          nameInitials: z.lazy(() => scalarsStr50Schema),
          profilePicturePath: z.lazy(() => scalarsStr100Schema).nullable(),
        })
        .describe('The template for picking properties.'),
    }),
  ),
})

export const listLeaveRequestsQueryResponseSchema = z.lazy(() => listLeaveRequests200Schema)