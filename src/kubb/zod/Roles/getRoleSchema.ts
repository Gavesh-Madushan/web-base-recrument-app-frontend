import { rolesRoleSchema } from '../roles/roleSchema.ts'
import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { z } from 'zod'

export const getRolePathParamsSchema = z.object({
  id: z.lazy(() => scalarsIdSchema),
})

/**
 * @description The request has succeeded.
 */
export const getRole200Schema = z.lazy(() => rolesRoleSchema)

/**
 * @description The server cannot find the requested resource.
 */
export const getRole404Schema = z.object({
  message: z.string(),
})

export const getRoleQueryResponseSchema = z.lazy(() => getRole200Schema)