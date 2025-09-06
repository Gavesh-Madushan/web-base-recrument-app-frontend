import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { scalarsStr50Schema } from '../scalars/str50Schema.ts'
import { z } from 'zod'

export const listRolePermissionsPathParamsSchema = z.object({
  id: z.lazy(() => scalarsIdSchema),
})

export const listRolePermissionsQueryParamsSchema = z
  .object({
    pageSize: z.coerce.number().int().min(1).max(50).default(10),
    page: z.coerce.number().int().min(0).optional(),
  })
  .optional()

/**
 * @description The request has succeeded.
 */
export const listRolePermissions200Schema = z.object({
  totalCount: z.coerce.number().int().describe("Will be calculated only if the 'page' parameter is explicitly set to 0").optional(),
  data: z.array(
    z
      .object({
        module: z.lazy(() => scalarsStr50Schema),
        value: z
          .string()
          .regex(/^[01]{4}$/)
          .describe('The concatenation of boolean permssions for C,R,U,D operations'),
      })
      .describe('The template for omitting properties.'),
  ),
})

/**
 * @description The server cannot find the requested resource.
 */
export const listRolePermissions404Schema = z.object({
  message: z.string(),
})

export const listRolePermissionsQueryResponseSchema = z.lazy(() => listRolePermissions200Schema)