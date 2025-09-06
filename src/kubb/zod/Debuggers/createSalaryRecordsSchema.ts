import { z } from 'zod'

/**
 * @description There is no content to send for this request, but the headers may be useful.
 */
export const createSalaryRecords204Schema = z.unknown()

export const createSalaryRecordsMutationRequestSchema = z.object({
  data: z.object({
    runAt: z.string().datetime(),
  }),
})

export const createSalaryRecordsMutationResponseSchema = z.lazy(() => createSalaryRecords204Schema)