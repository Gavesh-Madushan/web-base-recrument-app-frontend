import { rolesRoleInputSchema } from '../roles/roleInputSchema.ts'
import { rolesRoleSchema } from '../roles/roleSchema.ts'
import { z } from 'zod'

/**
 * @description The request has succeeded and a new resource has been created as a result.
 */
export const createRole201Schema = z.lazy(() => rolesRoleSchema)

export const createRoleMutationRequestSchema = z.object({
  data: z.lazy(() => rolesRoleInputSchema),
})

export const createRoleMutationResponseSchema = z.lazy(() => createRole201Schema)