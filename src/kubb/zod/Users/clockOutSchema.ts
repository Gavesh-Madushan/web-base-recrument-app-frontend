import { locationItemSchema } from '../locationItemSchema.ts'
import { scalarsStr100Schema } from '../scalars/str100Schema.ts'
import { z } from 'zod'

/**
 * @description There is no content to send for this request, but the headers may be useful.
 */
export const clockOut204Schema = z.unknown()

/**
 * @description Access is forbidden.
 */
export const clockOut403Schema = z.object({
  message: z.string(),
})

export const clockOutMutationRequestSchema = z.object({
  data: z.object({
    endedLocation: z.lazy(() => locationItemSchema),
    comment: z.lazy(() => scalarsStr100Schema).nullable(),
  }),
})

export const clockOutMutationResponseSchema = z.lazy(() => clockOut204Schema)