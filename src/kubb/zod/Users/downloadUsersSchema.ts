import { enumsActiveStateSchema } from '../enums/activeStateSchema.ts'
import { enumsEmployeeDesignationSchema } from '../enums/employeeDesignationSchema.ts'
import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { scalarsStr10Schema } from '../scalars/str10Schema.ts'
import { scalarsStr50Schema } from '../scalars/str50Schema.ts'
import { z } from 'zod'

export const downloadUsersQueryParamsSchema = z
  .object({
    searchTerm: z.lazy(() => scalarsStr10Schema).optional(),
    pendingLeaveRequests: z.boolean().optional(),
    roleId: z.lazy(() => scalarsIdSchema).optional(),
    designation: z.lazy(() => enumsEmployeeDesignationSchema).optional(),
    divisionId: z.lazy(() => scalarsIdSchema).optional(),
    activeState: z.lazy(() => enumsActiveStateSchema).optional(),
  })
  .optional()

/**
 * @description The request has succeeded.
 */
export const downloadUsers200Schema = z.string()

/**
 * @description The server could not understand the request due to invalid syntax.
 */
export const downloadUsers400Schema = z.object({
  message: z.string(),
})

export const downloadUsersMutationRequestSchema = z.object({
  data: z.object({
    columns2Include: z
      .array(z.lazy(() => scalarsStr50Schema))
      .min(1)
      .max(50),
  }),
})

export const downloadUsersMutationResponseSchema = z.lazy(() => downloadUsers200Schema)