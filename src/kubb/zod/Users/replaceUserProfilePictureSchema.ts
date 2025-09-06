import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { scalarsStr100Schema } from '../scalars/str100Schema.ts'
import { z } from 'zod'

export const replaceUserProfilePicturePathParamsSchema = z.object({
  id: z.lazy(() => scalarsIdSchema),
})

/**
 * @description The request has succeeded and a new resource has been created as a result.
 */
export const replaceUserProfilePicture201Schema = z
  .object({
    profilePicturePath: z.lazy(() => scalarsStr100Schema).nullable(),
  })
  .describe('The template for picking properties.')

/**
 * @description The server cannot find the requested resource.
 */
export const replaceUserProfilePicture404Schema = z.object({
  message: z.string(),
})

/**
 * @description Client error
 */
export const replaceUserProfilePicture413Schema = z.object({
  message: z.string(),
})

/**
 * @description Client error
 */
export const replaceUserProfilePicture415Schema = z.object({
  message: z.string(),
})

export const replaceUserProfilePictureMutationRequestSchema = z.object({
  file: z.string(),
})

export const replaceUserProfilePictureMutationResponseSchema = z.lazy(() => replaceUserProfilePicture201Schema)