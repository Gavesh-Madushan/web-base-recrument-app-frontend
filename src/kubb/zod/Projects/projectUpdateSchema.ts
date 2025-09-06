import { locationItemSchema } from '../locationItemSchema.ts'
import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { scalarsStr50Schema } from '../scalars/str50Schema.ts'
import { scalarsStr100Schema } from '../scalars/str100Schema.ts'
import { z } from 'zod'

/**
 * @description The template for omitting properties.
 */
export const projectsProjectUpdateSchema = z
  .object({
    name: z.lazy(() => scalarsStr50Schema),
    location: z.lazy(() => locationItemSchema),
    clientId: z.lazy(() => scalarsIdSchema).nullable(),
    address: z.lazy(() => scalarsStr100Schema),
    description: z.lazy(() => scalarsStr100Schema).nullable(),
  })
  .describe('The template for omitting properties.')