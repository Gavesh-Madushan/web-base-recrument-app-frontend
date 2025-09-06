import { clockRecordsClockRecordSchema } from '../clockRecords/clockRecordSchema.ts'
import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { z } from 'zod'

export const getClockRecordPathParamsSchema = z.object({
  id: z.lazy(() => scalarsIdSchema),
})

/**
 * @description The request has succeeded.
 */
export const getClockRecord200Schema = z.lazy(() => clockRecordsClockRecordSchema)

/**
 * @description The server cannot find the requested resource.
 */
export const getClockRecord404Schema = z.object({
  message: z.string(),
})

export const getClockRecordQueryResponseSchema = z.lazy(() => getClockRecord200Schema)