import { projectsProjectSchema } from '../projects/projectSchema.ts'
import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { z } from 'zod'

export const endProjectPathParamsSchema = z.object({
  id: z.lazy(() => scalarsIdSchema),
})

/**
 * @description The request has succeeded.
 */
export const endProject200Schema = z.lazy(() => projectsProjectSchema)

/**
 * @description Access is forbidden.
 */
export const endProject403Schema = z.object({
  message: z.string(),
})

/**
 * @description The server cannot find the requested resource.
 */
export const endProject404Schema = z.object({
  message: z.string(),
})

/**
 * @description The request conflicts with the current state of the server.
 */
export const endProject409Schema = z.object({
  message: z.string(),
})

export const endProjectMutationResponseSchema = z.lazy(() => endProject200Schema)