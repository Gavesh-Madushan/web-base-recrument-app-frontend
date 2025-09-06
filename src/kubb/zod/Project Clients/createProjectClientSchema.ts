import { projectClientsProjectClientInputSchema } from '../projectClients/projectClientInputSchema.ts'
import { projectClientsProjectClientSchema } from '../projectClients/projectClientSchema.ts'
import { z } from 'zod'

/**
 * @description The request has succeeded and a new resource has been created as a result.
 */
export const createProjectClient201Schema = z.lazy(() => projectClientsProjectClientSchema)

export const createProjectClientMutationRequestSchema = z.object({
  data: z.lazy(() => projectClientsProjectClientInputSchema),
})

export const createProjectClientMutationResponseSchema = z.lazy(() => createProjectClient201Schema)