import { rolesPermissionInputSchema } from '../roles/permissionInputSchema.ts'
import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { z } from 'zod'

export const replaceRolePermissionsPathParamsSchema = z.object({
  id: z.lazy(() => scalarsIdSchema),
})

/**
 * @description There is no content to send for this request, but the headers may be useful.
 */
export const replaceRolePermissions204Schema = z.unknown()

/**
 * @description Access is forbidden.
 */
export const replaceRolePermissions403Schema = z.object({
  message: z.string(),
})

/**
 * @description The server cannot find the requested resource.
 */
export const replaceRolePermissions404Schema = z.object({
  message: z.string(),
})

/**
 * @description Server error
 */
export const replaceRolePermissions500Schema = z.object({
  message: z.string(),
})

export const replaceRolePermissionsMutationRequestSchema = z.object({
  data: z.array(z.lazy(() => rolesPermissionInputSchema)).max(50),
})

export const replaceRolePermissionsMutationResponseSchema = z.lazy(() => replaceRolePermissions204Schema)