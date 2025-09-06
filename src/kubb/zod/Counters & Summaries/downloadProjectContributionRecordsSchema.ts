import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { z } from 'zod'

export const downloadProjectContributionRecordsQueryParamsSchema = z.object({
  projectId: z.lazy(() => scalarsIdSchema),
  fromDay: z.string().datetime(),
  toDay: z.string().datetime(),
})

/**
 * @description The request has succeeded.
 */
export const downloadProjectContributionRecords200Schema = z.string()

/**
 * @description The server could not understand the request due to invalid syntax.
 */
export const downloadProjectContributionRecords400Schema = z.object({
  message: z.string(),
})

/**
 * @description The server cannot find the requested resource.
 */
export const downloadProjectContributionRecords404Schema = z.object({
  message: z.string(),
})

export const downloadProjectContributionRecordsQueryResponseSchema = z.lazy(() => downloadProjectContributionRecords200Schema)