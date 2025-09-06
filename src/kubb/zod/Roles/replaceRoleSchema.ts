import { rolesRoleInputSchema } from '../roles/roleInputSchema.ts'
import { rolesRoleSchema } from '../roles/roleSchema.ts'
import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { z } from 'zod'

export const replaceRolePathParamsSchema = z.object({
  id: z.lazy(() => scalarsIdSchema),
})

/**
 * @description The request has succeeded.
 */
export const replaceRole200Schema = z.lazy(() => rolesRoleSchema)

/**
 * @description The server cannot find the requested resource.
 */
export const replaceRole404Schema = z.object({
  message: z.string(),
})

export const replaceRoleMutationRequestSchema = z.object({
  data: z.lazy(() => rolesRoleInputSchema),
})

export const replaceRoleMutationResponseSchema = z.lazy(() => replaceRole200Schema)