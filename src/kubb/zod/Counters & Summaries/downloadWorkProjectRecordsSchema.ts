import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { scalarsMonthSchema } from '../scalars/monthSchema.ts'
import { scalarsYearSchema } from '../scalars/yearSchema.ts'
import { z } from 'zod'

export const downloadWorkProjectRecordsQueryParamsSchema = z.object({
  divisionId: z.lazy(() => scalarsIdSchema).optional(),
  userId: z.lazy(() => scalarsIdSchema).optional(),
  year: z.lazy(() => scalarsYearSchema),
  month: z.lazy(() => scalarsMonthSchema),
})

/**
 * @description The request has succeeded.
 */
export const downloadWorkProjectRecords200Schema = z.string()

/**
 * @description The server could not understand the request due to invalid syntax.
 */
export const downloadWorkProjectRecords400Schema = z.object({
  message: z.string(),
})

export const downloadWorkProjectRecordsQueryResponseSchema = z.lazy(() => downloadWorkProjectRecords200Schema)