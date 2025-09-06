import { z } from 'zod'

/**
 * @description There is no content to send for this request, but the headers may be useful.
 */
export const upsertWorkBehaviorRecords204Schema = z.unknown()

export const upsertWorkBehaviorRecordsMutationRequestSchema = z.object({
  data: z.object({
    runAt: z.string().datetime(),
  }),
})

export const upsertWorkBehaviorRecordsMutationResponseSchema = z.lazy(() => upsertWorkBehaviorRecords204Schema)