import { enumsUploadCategorySchema } from '../enums/uploadCategorySchema.ts'
import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { scalarsNSchema } from '../scalars/nSchema.ts'
import { scalarsStr100Schema } from '../scalars/str100Schema.ts'
import { z } from 'zod'

export const uploadsUploadSchema = z.object({
  id: z.lazy(() => scalarsIdSchema),
  userId: z.lazy(() => scalarsIdSchema),
  divisionId: z.lazy(() => scalarsIdSchema),
  name: z.lazy(() => scalarsStr100Schema),
  category: z.lazy(() => enumsUploadCategorySchema),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  contentType: z.string(),
  staticPath: z.string(),
  size: z.lazy(() => scalarsNSchema).describe('File size in bytes'),
})