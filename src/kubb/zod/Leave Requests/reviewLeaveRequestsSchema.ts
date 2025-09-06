import { leaveRequestsLeaveRequestsReviewInputSchema } from '../leaveRequests/leaveRequestsReviewInputSchema.ts'
import { z } from 'zod'

/**
 * @description There is no content to send for this request, but the headers may be useful.
 */
export const reviewLeaveRequests204Schema = z.unknown()

/**
 * @description The server could not understand the request due to invalid syntax.
 */
export const reviewLeaveRequests400Schema = z.object({
  message: z.string(),
})

/**
 * @description The server cannot find the requested resource.
 */
export const reviewLeaveRequests404Schema = z.object({
  message: z.string(),
})

/**
 * @description The request conflicts with the current state of the server.
 */
export const reviewLeaveRequests409Schema = z.object({
  message: z.string(),
})

export const reviewLeaveRequestsMutationRequestSchema = z.object({
  data: z
    .array(z.lazy(() => leaveRequestsLeaveRequestsReviewInputSchema))
    .min(1)
    .max(50),
})

export const reviewLeaveRequestsMutationResponseSchema = z.lazy(() => reviewLeaveRequests204Schema)