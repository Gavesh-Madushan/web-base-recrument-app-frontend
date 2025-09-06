import { enumsApprovalStateSchema } from '../enums/approvalStateSchema.ts'
import { enumsEmployeeDesignationSchema } from '../enums/employeeDesignationSchema.ts'
import { enumsLeaveRequestPeriodSchema } from '../enums/leaveRequestPeriodSchema.ts'
import { enumsLeaveRequestTypeSchema } from '../enums/leaveRequestTypeSchema.ts'
import { scalarsDaySchema } from '../scalars/daySchema.ts'
import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { scalarsMonthSchema } from '../scalars/monthSchema.ts'
import { scalarsStr50Schema } from '../scalars/str50Schema.ts'
import { scalarsStr100Schema } from '../scalars/str100Schema.ts'
import { scalarsYearSchema } from '../scalars/yearSchema.ts'
import { z } from 'zod'

export const getLeaveRequestPathParamsSchema = z.object({
  id: z.lazy(() => scalarsIdSchema),
})

/**
 * @description The request has succeeded.
 */
export const getLeaveRequest200Schema = z.object({
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
  division: z
    .object({
      name: z.lazy(() => scalarsStr50Schema),
    })
    .describe('The template for picking properties.'),
  user: z
    .object({
      designation: z.lazy(() => enumsEmployeeDesignationSchema),
      employeeNumber: z.lazy(() => scalarsStr50Schema),
      class: z.lazy(() => scalarsStr50Schema),
      nameInitials: z.lazy(() => scalarsStr50Schema),
      profilePicturePath: z.lazy(() => scalarsStr100Schema).nullable(),
      remainingLeaveDaysAnnual: z.coerce.number(),
      entitledLeaveDaysAnnual: z.coerce.number(),
      remainingLeaveDaysMedical: z.coerce.number(),
      entitledLeaveDaysMedical: z.coerce.number(),
      remainingLeaveDaysCasual: z.coerce.number(),
      entitledLeaveDaysCasual: z.coerce.number(),
    })
    .describe('The template for picking properties.'),
  approvedBy: z
    .object({
      designation: z.lazy(() => enumsEmployeeDesignationSchema),
      employeeNumber: z.lazy(() => scalarsStr50Schema),
      class: z.lazy(() => scalarsStr50Schema),
      nameInitials: z.lazy(() => scalarsStr50Schema),
      profilePicturePath: z.lazy(() => scalarsStr100Schema).nullable(),
    })
    .describe('The template for picking properties.')
    .nullable(),
})

/**
 * @description The server cannot find the requested resource.
 */
export const getLeaveRequest404Schema = z.object({
  message: z.string(),
})

export const getLeaveRequestQueryResponseSchema = z.lazy(() => getLeaveRequest200Schema)