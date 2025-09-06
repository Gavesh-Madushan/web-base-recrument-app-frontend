import { scalarsStr50Schema } from '../scalars/str50Schema.ts'
import { z } from 'zod'

/**
 * @description The template for omitting properties.
 */
export const rolesPermissionInputSchema = z
  .object({
    module: z.lazy(() => scalarsStr50Schema),
    value: z
      .string()
      .regex(/^[01]{4}$/)
      .describe('The concatenation of boolean permssions for C,R,U,D operations'),
  })
  .describe('The template for omitting properties.')