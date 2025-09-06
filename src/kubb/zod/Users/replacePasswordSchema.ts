import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { structsPasswordInputSchema } from '../structs/passwordInputSchema.ts'
import { z } from 'zod'

export const replacePasswordPathParamsSchema = z.object({
  id: z.lazy(() => scalarsIdSchema),
})

/**
 * @description There is no content to send for this request, but the headers may be useful.
 */
export const replacePassword204Schema = z.unknown()

export const replacePasswordMutationRequestSchema = z.object({
  data: z.lazy(() => structsPasswordInputSchema),
})

export const replacePasswordMutationResponseSchema = z.lazy(() => replacePassword204Schema)