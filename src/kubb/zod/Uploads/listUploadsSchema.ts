import { enumsUploadCategorySchema } from '../enums/uploadCategorySchema.ts'
import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { uploadsUploadSchema } from '../uploads/uploadSchema.ts'
import { z } from 'zod'

export const listUploadsQueryParamsSchema = z
  .object({
    pageSize: z.coerce.number().int().min(1).max(50).default(10),
    page: z.coerce.number().int().min(0).optional(),
    divisionId: z.lazy(() => scalarsIdSchema).optional(),
    userId: z
      .union([z.lazy(() => scalarsIdSchema), z.enum(['@me'])])
      .describe('Only allowed @me. It filters self owned items')
      .optional(),
    category: z.lazy(() => enumsUploadCategorySchema).optional(),
    createdFrom: z.string().datetime().optional(),
    createdTo: z.string().datetime().optional(),
  })
  .optional()

/**
 * @description The request has succeeded.
 */
export const listUploads200Schema = z.object({
  totalCount: z.coerce.number().int().describe("Will be calculated only if the 'page' parameter is explicitly set to 0").optional(),
  data: z.array(z.lazy(() => uploadsUploadSchema)),
})

export const listUploadsQueryResponseSchema = z.lazy(() => listUploads200Schema)