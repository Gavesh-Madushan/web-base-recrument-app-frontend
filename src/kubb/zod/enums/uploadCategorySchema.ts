import { z } from 'zod'

export const enumsUploadCategorySchema = z.enum(['PHOTO', 'CV', 'LETTER', 'OTHER'])