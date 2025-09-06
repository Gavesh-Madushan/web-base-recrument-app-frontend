import { calendarEventsCalendarEventInputSchema } from '../calendarEvents/calendarEventInputSchema.ts'
import { calendarEventsCalendarEventSchema } from '../calendarEvents/calendarEventSchema.ts'
import { z } from 'zod'

/**
 * @description The request has succeeded.
 */
export const upsertCalendarEvent200Schema = z.lazy(() => calendarEventsCalendarEventSchema)

export const upsertCalendarEventMutationRequestSchema = z.object({
  data: z.lazy(() => calendarEventsCalendarEventInputSchema),
})

export const upsertCalendarEventMutationResponseSchema = z.lazy(() => upsertCalendarEvent200Schema)