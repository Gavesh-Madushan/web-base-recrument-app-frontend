import { divisionsDivisionSchema } from '../divisions/divisionSchema.ts'
import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { z } from 'zod'

export const getDivisionPathParamsSchema = z.object({
  id: z.lazy(() => scalarsIdSchema),
})

/**
 * @description The request has succeeded.
 */
export const getDivision200Schema = z.lazy(() => divisionsDivisionSchema)

/**
 * @description The server cannot find the requested resource.
 */
export const getDivision404Schema = z.object({
  message: z.string(),
})

export const getDivisionQueryResponseSchema = z.lazy(() => getDivision200Schema)