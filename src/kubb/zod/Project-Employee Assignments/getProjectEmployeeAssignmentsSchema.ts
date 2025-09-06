import { enumsProjectProcessingStateSchema } from '../enums/projectProcessingStateSchema.ts'
import { projectEmployeeAssignmentsProjectEmployeeAssignmentSchema } from '../projectEmployeeAssignments/projectEmployeeAssignmentSchema.ts'
import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { z } from 'zod'

export const getProjectEmployeeAssignmentsQueryParamsSchema = z
  .object({
    pageSize: z.coerce.number().int().min(1).max(50).default(10),
    page: z.coerce.number().int().min(0).optional(),
    divisionId: z.lazy(() => scalarsIdSchema).optional(),
    userId: z.lazy(() => scalarsIdSchema).optional(),
    projectId: z.lazy(() => scalarsIdSchema).optional(),
    projectProcessingState: z.lazy(() => enumsProjectProcessingStateSchema).optional(),
  })
  .optional()

/**
 * @description The request has succeeded.
 */
export const getProjectEmployeeAssignments200Schema = z.object({
  totalCount: z.coerce.number().int().describe("Will be calculated only if the 'page' parameter is explicitly set to 0").optional(),
  data: z.array(z.lazy(() => projectEmployeeAssignmentsProjectEmployeeAssignmentSchema)),
})

export const getProjectEmployeeAssignmentsQueryResponseSchema = z.lazy(() => getProjectEmployeeAssignments200Schema)