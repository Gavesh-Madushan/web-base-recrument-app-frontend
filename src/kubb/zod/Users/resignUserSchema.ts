import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { z } from 'zod'

export const resignUserPathParamsSchema = z.object({
  id: z.lazy(() => scalarsIdSchema),
})

/**
 * @description There is no content to send for this request, but the headers may be useful.
 */
export const resignUser204Schema = z.unknown()

export const resignUserMutationResponseSchema = z.lazy(() => resignUser204Schema)