import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { scalarsMonthSchema } from '../scalars/monthSchema.ts'
import { scalarsStr10Schema } from '../scalars/str10Schema.ts'
import { scalarsYearSchema } from '../scalars/yearSchema.ts'
import { z } from 'zod'

export const downloadSalaryRecordsQueryParamsSchema = z
  .object({
    searchTerm: z.lazy(() => scalarsStr10Schema).optional(),
    divisionId: z.lazy(() => scalarsIdSchema).optional(),
    userId: z
      .union([z.lazy(() => scalarsIdSchema), z.enum(['@me'])])
      .describe('Only allowed @me. It filters self owned items')
      .optional(),
    year: z.lazy(() => scalarsYearSchema).optional(),
    month: z.lazy(() => scalarsMonthSchema).optional(),
  })
  .optional()

/**
 * @description The request has succeeded.
 */
export const downloadSalaryRecords200Schema = z.string()

/**
 * @description The server could not understand the request due to invalid syntax.
 */
export const downloadSalaryRecords400Schema = z.object({
  message: z.string(),
})

export const downloadSalaryRecordsQueryResponseSchema = z.lazy(() => downloadSalaryRecords200Schema)