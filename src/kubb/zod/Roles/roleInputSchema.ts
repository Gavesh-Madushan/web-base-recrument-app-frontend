import { scalarsStr50Schema } from '../scalars/str50Schema.ts'
import { z } from 'zod'

/**
 * @description The template for omitting properties.
 */
export const rolesRoleInputSchema = z
  .object({
    name: z.lazy(() => scalarsStr50Schema),
  })
  .describe('The template for omitting properties.')