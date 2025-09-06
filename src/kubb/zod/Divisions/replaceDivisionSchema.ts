import { divisionsDivisionInputSchema } from '../divisions/divisionInputSchema.ts'
import { divisionsDivisionSchema } from '../divisions/divisionSchema.ts'
import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { z } from 'zod'

export const replaceDivisionPathParamsSchema = z.object({
  id: z.lazy(() => scalarsIdSchema),
})

/**
 * @description The request has succeeded.
 */
export const replaceDivision200Schema = z.lazy(() => divisionsDivisionSchema)

/**
 * @description The server cannot find the requested resource.
 */
export const replaceDivision404Schema = z.object({
  message: z.string(),
})

export const replaceDivisionMutationRequestSchema = z.object({
  data: z.lazy(() => divisionsDivisionInputSchema),
})

export const replaceDivisionMutationResponseSchema = z.lazy(() => replaceDivision200Schema)