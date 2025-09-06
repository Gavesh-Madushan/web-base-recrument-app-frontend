import { z } from 'zod'

/**
 * @description There is no content to send for this request, but the headers may be useful.
 */
export const upsertWorkBehaviorRecords4Salary204Schema = z.unknown()

export const upsertWorkBehaviorRecords4SalaryMutationRequestSchema = z.object({
  data: z.object({
    runAt: z.string().datetime(),
  }),
})

export const upsertWorkBehaviorRecords4SalaryMutationResponseSchema = z.lazy(() => upsertWorkBehaviorRecords4Salary204Schema)