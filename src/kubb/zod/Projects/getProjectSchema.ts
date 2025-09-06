import { enumsProjectProcessingStateSchema } from '../enums/projectProcessingStateSchema.ts'
import { locationItemSchema } from '../locationItemSchema.ts'
import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { scalarsStr50Schema } from '../scalars/str50Schema.ts'
import { scalarsStr100Schema } from '../scalars/str100Schema.ts'
import { z } from 'zod'

export const getProjectPathParamsSchema = z.object({
  id: z.lazy(() => scalarsIdSchema),
})

/**
 * @description The request has succeeded.
 */
export const getProject200Schema = z.object({
  id: z.lazy(() => scalarsIdSchema),
  processingState: z.lazy(() => enumsProjectProcessingStateSchema),
  name: z.lazy(() => scalarsStr50Schema),
  location: z.lazy(() => locationItemSchema),
  divisionId: z.lazy(() => scalarsIdSchema),
  clientId: z.lazy(() => scalarsIdSchema).nullable(),
  isOutstation: z.boolean(),
  address: z.lazy(() => scalarsStr100Schema),
  createdAt: z.string().datetime(),
  startedAt: z.string().datetime().nullable(),
  endedAt: z.string().datetime().nullable(),
  description: z.lazy(() => scalarsStr100Schema).nullable(),
  division: z
    .object({
      name: z.lazy(() => scalarsStr50Schema),
    })
    .describe('The template for picking properties.'),
  client: z
    .object({
      businessName: z.lazy(() => scalarsStr50Schema),
    })
    .describe('The template for picking properties.')
    .nullable(),
})

/**
 * @description The server cannot find the requested resource.
 */
export const getProject404Schema = z.object({
  message: z.string(),
})

export const getProjectQueryResponseSchema = z.lazy(() => getProject200Schema)