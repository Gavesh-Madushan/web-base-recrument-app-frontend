import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { z } from 'zod'

export const deleteUploadPathParamsSchema = z.object({
  id: z.lazy(() => scalarsIdSchema),
})

/**
 * @description There is no content to send for this request, but the headers may be useful.
 */
export const deleteUpload204Schema = z.unknown()

export const deleteUploadMutationResponseSchema = z.lazy(() => deleteUpload204Schema)