import { calendarEventsCalendarEventSchema } from '../calendarEvents/calendarEventSchema.ts'
import { scalarsDaySchema } from '../scalars/daySchema.ts'
import { scalarsMonthSchema } from '../scalars/monthSchema.ts'
import { scalarsYearSchema } from '../scalars/yearSchema.ts'
import { z } from 'zod'

export const listCalendarEventsQueryParamsSchema = z.object({
  page: z.coerce.number().int().min(0).optional(),
  pageSize: z.coerce.number().int().min(1).max(366).default(10),
  year: z.lazy(() => scalarsYearSchema),
  month: z.lazy(() => scalarsMonthSchema).optional(),
  day: z.lazy(() => scalarsDaySchema).optional(),
})

/**
 * @description The request has succeeded.
 */
export const listCalendarEvents200Schema = z.object({
  totalCount: z.coerce.number().int().describe("Will be calculated only if the 'page' parameter is explicitly set to 0").optional(),
  data: z.array(z.lazy(() => calendarEventsCalendarEventSchema)),
})

export const listCalendarEventsQueryResponseSchema = z.lazy(() => listCalendarEvents200Schema)