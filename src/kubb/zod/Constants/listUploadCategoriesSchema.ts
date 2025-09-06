import { enumsUploadCategorySchema } from '../enums/uploadCategorySchema.ts'
import { z } from 'zod'

/**
 * @description The request has succeeded.
 */
export const listUploadCategories200Schema = z.array(z.lazy(() => enumsUploadCategorySchema))

export const listUploadCategoriesQueryResponseSchema = z.lazy(() => listUploadCategories200Schema)