import { sessionsSessionInputSchema } from '../sessions/sessionInputSchema.ts'
import { sessionsSessionSchema } from '../sessions/sessionSchema.ts'
import { z } from 'zod'

/**
 * @description The request has succeeded and a new resource has been created as a result.
 */
export const createSession201Schema = z.lazy(() => sessionsSessionSchema)

/**
 * @description Access is unauthorized.
 */
export const createSession401Schema = z.object({
  message: z.string(),
})

/**
 * @description The server cannot find the requested resource.
 */
export const createSession404Schema = z.object({
  message: z.string(),
})

export const createSessionMutationRequestSchema = z.object({
  data: z.lazy(() => sessionsSessionInputSchema),
})

export const createSessionMutationResponseSchema = z.lazy(() => createSession201Schema)