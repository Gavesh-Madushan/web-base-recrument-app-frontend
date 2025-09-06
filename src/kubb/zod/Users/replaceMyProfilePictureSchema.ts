import { scalarsStr100Schema } from '../scalars/str100Schema.ts'
import { z } from 'zod'

/**
 * @description The request has succeeded and a new resource has been created as a result.
 */
export const replaceMyProfilePicture201Schema = z
  .object({
    profilePicturePath: z.lazy(() => scalarsStr100Schema).nullable(),
  })
  .describe('The template for picking properties.')

/**
 * @description The server cannot find the requested resource.
 */
export const replaceMyProfilePicture404Schema = z.object({
  message: z.string(),
})

/**
 * @description Client error
 */
export const replaceMyProfilePicture413Schema = z.object({
  message: z.string(),
})

/**
 * @description Client error
 */
export const replaceMyProfilePicture415Schema = z.object({
  message: z.string(),
})

export const replaceMyProfilePictureMutationRequestSchema = z.object({
  file: z.string(),
})

export const replaceMyProfilePictureMutationResponseSchema = z.lazy(() => replaceMyProfilePicture201Schema)