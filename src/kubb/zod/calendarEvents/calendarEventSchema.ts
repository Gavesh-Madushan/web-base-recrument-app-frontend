import { scalarsDaySchema } from '../scalars/daySchema.ts'
import { scalarsMonthSchema } from '../scalars/monthSchema.ts'
import { scalarsStr10Schema } from '../scalars/str10Schema.ts'
import { scalarsStr50Schema } from '../scalars/str50Schema.ts'
import { scalarsYearSchema } from '../scalars/yearSchema.ts'
import { z } from 'zod'

export const calendarEventsCalendarEventSchema = z.object({
  year: z.lazy(() => scalarsYearSchema),
  month: z.lazy(() => scalarsMonthSchema),
  day: z.lazy(() => scalarsDaySchema),
  name: z.lazy(() => scalarsStr50Schema),
  emoji: z.lazy(() => scalarsStr10Schema),
})