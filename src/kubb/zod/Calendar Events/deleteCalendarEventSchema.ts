import { scalarsDaySchema } from '../scalars/daySchema.ts'
import { scalarsMonthSchema } from '../scalars/monthSchema.ts'
import { scalarsYearSchema } from '../scalars/yearSchema.ts'
import { z } from 'zod'

export const deleteCalendarEventQueryParamsSchema = z.object({
  year: z.lazy(() => scalarsYearSchema),
  month: z.lazy(() => scalarsMonthSchema),
  day: z.lazy(() => scalarsDaySchema),
})

/**
 * @description There is no content to send for this request, but the headers may be useful.
 */
export const deleteCalendarEvent204Schema = z.unknown()

/**
 * @description The server could not understand the request due to invalid syntax.
 */
export const deleteCalendarEvent400Schema = z.object({
  message: z.string(),
})

/**
 * @description The server cannot find the requested resource.
 */
export const deleteCalendarEvent404Schema = z.object({
  message: z.string(),
})

export const deleteCalendarEventMutationResponseSchema = z.lazy(() => deleteCalendarEvent204Schema)