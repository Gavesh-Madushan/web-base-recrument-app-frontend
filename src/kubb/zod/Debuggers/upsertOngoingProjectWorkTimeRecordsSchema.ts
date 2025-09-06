import { z } from 'zod'

/**
 * @description There is no content to send for this request, but the headers may be useful.
 */
export const upsertOngoingProjectWorkTimeRecords204Schema = z.unknown()

export const upsertOngoingProjectWorkTimeRecordsMutationRequestSchema = z.object({
  data: z.object({
    runAt: z.string().datetime(),
  }),
})

export const upsertOngoingProjectWorkTimeRecordsMutationResponseSchema = z.lazy(() => upsertOngoingProjectWorkTimeRecords204Schema)