import { projectClientsProjectClientInputSchema } from '../projectClients/projectClientInputSchema.ts'
import { projectClientsProjectClientSchema } from '../projectClients/projectClientSchema.ts'
import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { z } from 'zod'

export const replaceProjectClientPathParamsSchema = z.object({
  id: z.lazy(() => scalarsIdSchema),
})

/**
 * @description The request has succeeded.
 */
export const replaceProjectClient200Schema = z.lazy(() => projectClientsProjectClientSchema)

/**
 * @description The server cannot find the requested resource.
 */
export const replaceProjectClient404Schema = z.object({
  message: z.string(),
})

export const replaceProjectClientMutationRequestSchema = z.object({
  data: z.lazy(() => projectClientsProjectClientInputSchema),
})

export const replaceProjectClientMutationResponseSchema = z.lazy(() => replaceProjectClient200Schema)