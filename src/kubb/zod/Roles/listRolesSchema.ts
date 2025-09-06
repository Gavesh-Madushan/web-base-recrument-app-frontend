import { rolesRoleSchema } from '../roles/roleSchema.ts'
import { scalarsStr10Schema } from '../scalars/str10Schema.ts'
import { z } from 'zod'

export const listRolesQueryParamsSchema = z
  .object({
    pageSize: z.coerce.number().int().min(1).max(50).default(10),
    page: z.coerce.number().int().min(0).optional(),
    searchTerm: z.lazy(() => scalarsStr10Schema).optional(),
  })
  .optional()

/**
 * @description The request has succeeded.
 */
export const listRoles200Schema = z.object({
  totalCount: z.coerce.number().int().describe("Will be calculated only if the 'page' parameter is explicitly set to 0").optional(),
  data: z.array(z.lazy(() => rolesRoleSchema)),
})

export const listRolesQueryResponseSchema = z.lazy(() => listRoles200Schema)