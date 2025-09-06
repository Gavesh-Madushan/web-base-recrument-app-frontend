import { enumsLeaveRequestPeriodSchema } from '../enums/leaveRequestPeriodSchema.ts'
import { enumsLeaveRequestTypeSchema } from '../enums/leaveRequestTypeSchema.ts'
import { scalarsDaySchema } from '../scalars/daySchema.ts'
import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { scalarsMonthSchema } from '../scalars/monthSchema.ts'
import { scalarsStr100Schema } from '../scalars/str100Schema.ts'
import { scalarsYearSchema } from '../scalars/yearSchema.ts'
import { z } from 'zod'

/**
 * @description The request has succeeded and a new resource has been created as a result.
 */
export const createLeaveRequests201Schema = z.unknown()

/**
 * @description The server could not understand the request due to invalid syntax.
 */
export const createLeaveRequests400Schema = z.object({
  message: z.string(),
})

/**
 * @description The server cannot find the requested resource.
 */
export const createLeaveRequests404Schema = z.object({
  message: z.string(),
})

/**
 * @description The request conflicts with the current state of the server.
 */
export const createLeaveRequests409Schema = z.object({
  message: z.string(),
})

export const createLeaveRequestsMutationRequestSchema = z.object({
  data: z
    .array(
      z.object({
        type: z.lazy(() => enumsLeaveRequestTypeSchema),
        period: z.lazy(() => enumsLeaveRequestPeriodSchema),
        year: z.lazy(() => scalarsYearSchema),
        month: z.lazy(() => scalarsMonthSchema),
        day: z.lazy(() => scalarsDaySchema),
        description: z.lazy(() => scalarsStr100Schema).nullable(),
        comment: z.lazy(() => scalarsStr100Schema).nullable(),
        userId: z.union([z.lazy(() => scalarsIdSchema), z.enum(['@me'])]).describe('Only allowed @me. Creates a self owned item'),
      }),
    )
    .min(1)
    .max(40),
})

export const createLeaveRequestsMutationResponseSchema = z.lazy(() => createLeaveRequests201Schema)