import { z } from 'zod'

/**
 * @description There is no content to send for this request, but the headers may be useful.
 */
export const recalculateProjectContributionRecords204Schema = z.unknown()

export const recalculateProjectContributionRecordsMutationRequestSchema = z.object({
  data: z.object({
    runAt: z.string().datetime(),
  }),
})

export const recalculateProjectContributionRecordsMutationResponseSchema = z.lazy(() => recalculateProjectContributionRecords204Schema)