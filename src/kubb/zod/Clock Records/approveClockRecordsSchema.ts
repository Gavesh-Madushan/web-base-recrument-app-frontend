import { clockRecordsClockRecordApproveInputSchema } from '../clockRecords/clockRecordApproveInputSchema.ts'
import { z } from 'zod'

/**
 * @description There is no content to send for this request, but the headers may be useful.
 */
export const approveClockRecords204Schema = z.unknown()

/**
 * @description The server could not understand the request due to invalid syntax.
 */
export const approveClockRecords400Schema = z.object({
  message: z.string(),
})

/**
 * @description The server cannot find the requested resource.
 */
export const approveClockRecords404Schema = z.object({
  message: z.string(),
})

export const approveClockRecordsMutationRequestSchema = z.object({
  data: z
    .array(z.lazy(() => clockRecordsClockRecordApproveInputSchema))
    .min(1)
    .max(31),
})

export const approveClockRecordsMutationResponseSchema = z.lazy(() => approveClockRecords204Schema)