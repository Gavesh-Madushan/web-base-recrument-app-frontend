import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { scalarsStr50Schema } from '../scalars/str50Schema.ts'
import { z } from 'zod'

/**
 * @description Defines a permission for the {roleId} on the module
 */
export const rolesPermissionSchema = z
  .object({
    module: z.lazy(() => scalarsStr50Schema),
    roleId: z.lazy(() => scalarsIdSchema),
    value: z
      .string()
      .regex(/^[01]{4}$/)
      .describe('The concatenation of boolean permssions for C,R,U,D operations'),
  })
  .describe('Defines a permission for the {roleId} on the module')