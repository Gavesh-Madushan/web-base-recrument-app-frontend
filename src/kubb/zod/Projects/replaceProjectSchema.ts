import { projectsProjectSchema } from '../projects/projectSchema.ts'
import { projectsProjectUpdateSchema } from '../projects/projectUpdateSchema.ts'
import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { z } from 'zod'

export const replaceProjectPathParamsSchema = z.object({
  id: z.lazy(() => scalarsIdSchema),
})

/**
 * @description The request has succeeded.
 */
export const replaceProject200Schema = z.lazy(() => projectsProjectSchema)

/**
 * @description The server cannot find the requested resource.
 */
export const replaceProject404Schema = z.object({
  message: z.string(),
})

export const replaceProjectMutationRequestSchema = z.object({
  data: z.lazy(() => projectsProjectUpdateSchema),
})

export const replaceProjectMutationResponseSchema = z.lazy(() => replaceProject200Schema)