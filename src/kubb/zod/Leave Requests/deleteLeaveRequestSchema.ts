import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { z } from 'zod'

export const deleteLeaveRequestPathParamsSchema = z.object({
  id: z.lazy(() => scalarsIdSchema),
})

/**
 * @description There is no content to send for this request, but the headers may be useful.
 */
export const deleteLeaveRequest204Schema = z.unknown()

/**
 * @description The server could not understand the request due to invalid syntax.
 */
export const deleteLeaveRequest400Schema = z.object({
  message: z.string(),
})

/**
 * @description The server cannot find the requested resource.
 */
export const deleteLeaveRequest404Schema = z.object({
  message: z.string(),
})

export const deleteLeaveRequestMutationResponseSchema = z.lazy(() => deleteLeaveRequest204Schema)