import { divisionsDivisionInputSchema } from '../divisions/divisionInputSchema.ts'
import { divisionsDivisionSchema } from '../divisions/divisionSchema.ts'
import { z } from 'zod'

/**
 * @description The request has succeeded and a new resource has been created as a result.
 */
export const createDivision201Schema = z.lazy(() => divisionsDivisionSchema)

export const createDivisionMutationRequestSchema = z.object({
  data: z.lazy(() => divisionsDivisionInputSchema),
})

export const createDivisionMutationResponseSchema = z.lazy(() => createDivision201Schema)