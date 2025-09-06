import { enumsUploadCategorySchema } from '../enums/uploadCategorySchema.ts'
import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { scalarsStr100Schema } from '../scalars/str100Schema.ts'
import { uploadsUploadSchema } from '../uploads/uploadSchema.ts'
import { z } from 'zod'

export const createUploadQueryParamsSchema = z.object({
  userId: z.lazy(() => scalarsIdSchema),
  category: z.lazy(() => enumsUploadCategorySchema),
  name: z.lazy(() => scalarsStr100Schema),
})

/**
 * @description The request has succeeded and a new resource has been created as a result.
 */
export const createUpload201Schema = z.lazy(() => uploadsUploadSchema)

/**
 * @description The server cannot find the requested resource.
 */
export const createUpload404Schema = z.object({
  message: z.string(),
})

/**
 * @description Client error
 */
export const createUpload413Schema = z.object({
  message: z.string(),
})

/**
 * @description Client error
 */
export const createUpload415Schema = z.object({
  message: z.string(),
})

export const createUploadMutationRequestSchema = z.object({
  file: z.string(),
})

export const createUploadMutationResponseSchema = z.lazy(() => createUpload201Schema)