import { scalarsPasswordSchema } from '../scalars/passwordSchema.ts'
import { z } from 'zod'

/**
 * @description There is no content to send for this request, but the headers may be useful.
 */
export const replaceMyPassword204Schema = z.unknown()

/**
 * @description The server could not understand the request due to invalid syntax.
 */
export const replaceMyPassword400Schema = z.object({
  message: z.string(),
})

export const replaceMyPasswordMutationRequestSchema = z.object({
  data: z.object({
    oldPassword: z.lazy(() => scalarsPasswordSchema),
    newPassword: z.lazy(() => scalarsPasswordSchema),
  }),
})

export const replaceMyPasswordMutationResponseSchema = z.lazy(() => replaceMyPassword204Schema)