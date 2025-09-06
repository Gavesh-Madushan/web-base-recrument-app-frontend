import { projectsProjectInputSchema } from '../projects/projectInputSchema.ts'
import { projectsProjectSchema } from '../projects/projectSchema.ts'
import { z } from 'zod'

/**
 * @description The request has succeeded and a new resource has been created as a result.
 */
export const createProject201Schema = z.lazy(() => projectsProjectSchema)

export const createProjectMutationRequestSchema = z.object({
  data: z.lazy(() => projectsProjectInputSchema),
})

export const createProjectMutationResponseSchema = z.lazy(() => createProject201Schema)