import { projectEmployeeAssignmentsEmployeeAssignmentInputSchema } from '../projectEmployeeAssignments/employeeAssignmentInputSchema.ts'
import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { z } from 'zod'

export const replaceEmployeeAssignmentsPathParamsSchema = z.object({
  id: z.lazy(() => scalarsIdSchema),
})

/**
 * @description There is no content to send for this request, but the headers may be useful.
 */
export const replaceEmployeeAssignments204Schema = z.unknown()

/**
 * @description The server could not understand the request due to invalid syntax.
 */
export const replaceEmployeeAssignments400Schema = z.object({
  message: z.string(),
})

/**
 * @description The server cannot find the requested resource.
 */
export const replaceEmployeeAssignments404Schema = z.object({
  message: z.string(),
})

/**
 * @description The request conflicts with the current state of the server.
 */
export const replaceEmployeeAssignments409Schema = z.object({
  message: z.string(),
})

export const replaceEmployeeAssignmentsMutationRequestSchema = z.object({
  data: z.lazy(() => projectEmployeeAssignmentsEmployeeAssignmentInputSchema),
})

export const replaceEmployeeAssignmentsMutationResponseSchema = z.lazy(() => replaceEmployeeAssignments204Schema)