import { locationItemSchema } from '../locationItemSchema.ts'
import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { scalarsStr50Schema } from '../scalars/str50Schema.ts'
import { scalarsStr100Schema } from '../scalars/str100Schema.ts'
import { z } from 'zod'

export const summarizeProjectsByClockInLocationQueryParamsSchema = z
  .object({
    pageSize: z.coerce.number().int().min(1).max(50).default(10),
    page: z.coerce.number().int().min(0).optional(),
  })
  .optional()

/**
 * @description The request has succeeded.
 */
export const summarizeProjectsByClockInLocation200Schema = z.object({
  totalCount: z.coerce.number().int().describe("Will be calculated only if the 'page' parameter is explicitly set to 0").optional(),
  data: z.array(
    z.object({
      project: z
        .object({
          id: z.lazy(() => scalarsIdSchema),
          name: z.lazy(() => scalarsStr50Schema),
          location: z.lazy(() => locationItemSchema),
          address: z.lazy(() => scalarsStr100Schema),
        })
        .describe('The template for picking properties.'),
      attendanceRecords: z.array(
        z
          .object({
            createdLocation: z.lazy(() => locationItemSchema),
          })
          .describe('The template for picking properties.'),
      ),
    }),
  ),
})

export const summarizeProjectsByClockInLocationQueryResponseSchema = z.lazy(() => summarizeProjectsByClockInLocation200Schema)