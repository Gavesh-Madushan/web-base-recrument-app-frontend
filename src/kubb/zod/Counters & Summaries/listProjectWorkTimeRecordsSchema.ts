import { countersAndSummariesProjectsWorkTimeRecordSchema } from '../countersAndSummaries/projectsWorkTimeRecordSchema.ts'
import { enumsProjectProcessingStateSchema } from '../enums/projectProcessingStateSchema.ts'
import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { z } from 'zod'

export const listProjectWorkTimeRecordsQueryParamsSchema = z.object({
  projectId: z.lazy(() => scalarsIdSchema),
  projectProcessingState: z.lazy(() => enumsProjectProcessingStateSchema),
  pageSize: z.coerce.number().int().min(1).max(50).default(10),
  page: z.coerce.number().int().min(0).optional(),
})

/**
 * @description The request has succeeded.
 */
export const listProjectWorkTimeRecords200Schema = z.object({
  totalCount: z.coerce.number().int().describe("Will be calculated only if the 'page' parameter is explicitly set to 0").optional(),
  data: z.array(z.lazy(() => countersAndSummariesProjectsWorkTimeRecordSchema)),
})

export const listProjectWorkTimeRecordsQueryResponseSchema = z.lazy(() => listProjectWorkTimeRecords200Schema)