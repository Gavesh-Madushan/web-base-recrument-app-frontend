import { projectsProjectSchema } from '../projects/projectSchema.ts'
import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { z } from 'zod'

export const startProjectPathParamsSchema = z.object({
  id: z.lazy(() => scalarsIdSchema),
})

/**
 * @description The request has succeeded.
 */
export const startProject200Schema = z.lazy(() => projectsProjectSchema)

/**
 * @description The server cannot find the requested resource.
 */
export const startProject404Schema = z.object({
  message: z.string(),
})

/**
 * @description The request conflicts with the current state of the server.
 */
export const startProject409Schema = z.object({
  message: z.string(),
})

export const startProjectMutationResponseSchema = z.lazy(() => startProject200Schema)