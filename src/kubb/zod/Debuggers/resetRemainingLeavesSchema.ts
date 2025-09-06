import { z } from 'zod'

/**
 * @description There is no content to send for this request, but the headers may be useful.
 */
export const resetRemainingLeaves204Schema = z.unknown()

export const resetRemainingLeavesMutationRequestSchema = z.object({
  data: z.object({
    runAt: z.string().datetime(),
  }),
})

export const resetRemainingLeavesMutationResponseSchema = z.lazy(() => resetRemainingLeaves204Schema)