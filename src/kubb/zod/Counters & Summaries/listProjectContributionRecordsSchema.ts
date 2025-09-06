import { countersAndSummariesProjectContributionRecordSchema } from '../countersAndSummaries/projectContributionRecordSchema.ts'
import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { z } from 'zod'

export const listProjectContributionRecordsQueryParamsSchema = z.object({
  projectId: z.lazy(() => scalarsIdSchema),
  fromDay: z.string().datetime(),
  toDay: z.string().datetime(),
})

/**
 * @description The request has succeeded.
 */
export const listProjectContributionRecords200Schema = z.object({
  totalCount: z.coerce.number().int().describe("Will be calculated only if the 'page' parameter is explicitly set to 0").optional(),
  data: z.array(z.lazy(() => countersAndSummariesProjectContributionRecordSchema)),
})

/**
 * @description The server could not understand the request due to invalid syntax.
 */
export const listProjectContributionRecords400Schema = z.object({
  message: z.string(),
})

export const listProjectContributionRecordsQueryResponseSchema = z.lazy(() => listProjectContributionRecords200Schema)