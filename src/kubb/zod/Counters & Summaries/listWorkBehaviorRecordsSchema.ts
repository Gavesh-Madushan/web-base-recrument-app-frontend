import { countersAndSummariesWorkBehaviorRecordSchema } from '../countersAndSummaries/workBehaviorRecordSchema.ts'
import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { scalarsMonthSchema } from '../scalars/monthSchema.ts'
import { scalarsYearSchema } from '../scalars/yearSchema.ts'
import { z } from 'zod'

export const listWorkBehaviorRecordsQueryParamsSchema = z.object({
  pageSize: z.coerce.number().int().min(1).max(50).default(10),
  page: z.coerce.number().int().min(0).optional(),
  divisionId: z.lazy(() => scalarsIdSchema).optional(),
  userId: z.lazy(() => scalarsIdSchema).optional(),
  year: z.lazy(() => scalarsYearSchema),
  month: z.lazy(() => scalarsMonthSchema),
})

/**
 * @description The request has succeeded.
 */
export const listWorkBehaviorRecords200Schema = z.object({
  totalCount: z.coerce.number().int().describe("Will be calculated only if the 'page' parameter is explicitly set to 0").optional(),
  data: z.array(z.lazy(() => countersAndSummariesWorkBehaviorRecordSchema)),
})

export const listWorkBehaviorRecordsQueryResponseSchema = z.lazy(() => listWorkBehaviorRecords200Schema)