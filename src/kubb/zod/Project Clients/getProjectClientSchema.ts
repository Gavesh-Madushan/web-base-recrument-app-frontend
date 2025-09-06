import { projectClientsProjectClientSchema } from '../projectClients/projectClientSchema.ts'
import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { z } from 'zod'

export const getProjectClientPathParamsSchema = z.object({
  id: z.lazy(() => scalarsIdSchema),
})

/**
 * @description The request has succeeded.
 */
export const getProjectClient200Schema = z.lazy(() => projectClientsProjectClientSchema)

/**
 * @description The server cannot find the requested resource.
 */
export const getProjectClient404Schema = z.object({
  message: z.string(),
})

export const getProjectClientQueryResponseSchema = z.lazy(() => getProjectClient200Schema)