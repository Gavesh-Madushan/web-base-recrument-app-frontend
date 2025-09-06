import { enumsProjectProcessingStateSchema } from '../enums/projectProcessingStateSchema.ts'
import { locationItemSchema } from '../locationItemSchema.ts'
import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { scalarsStr10Schema } from '../scalars/str10Schema.ts'
import { scalarsStr50Schema } from '../scalars/str50Schema.ts'
import { scalarsStr100Schema } from '../scalars/str100Schema.ts'
import { z } from 'zod'

export const listProjectsQueryParamsSchema = z
  .object({
    pageSize: z.coerce.number().int().min(1).max(50).default(10),
    page: z.coerce.number().int().min(0).optional(),
    searchTerm: z.lazy(() => scalarsStr10Schema).optional(),
    divisionId: z.lazy(() => scalarsIdSchema).optional(),
    isOutstation: z.boolean().optional(),
    clientId: z.lazy(() => scalarsIdSchema).optional(),
    processingState: z.lazy(() => enumsProjectProcessingStateSchema).optional(),
    startedFrom: z.string().datetime().optional(),
    startedTo: z.string().datetime().optional(),
    endedFrom: z.string().datetime().optional(),
    endedTo: z.string().datetime().optional(),
    joinClient: z.boolean().default(false),
    joinDivision: z.boolean().default(false),
  })
  .optional()

/**
 * @description The request has succeeded.
 */
export const listProjects200Schema = z.object({
  totalCount: z.coerce.number().int().describe("Will be calculated only if the 'page' parameter is explicitly set to 0").optional(),
  data: z.array(
    z.object({
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
      client: z
        .object({
          businessName: z.lazy(() => scalarsStr50Schema),
        })
        .describe("Available when 'joinClient' is true")
        .nullable()
        .nullish(),
      division: z
        .object({
          name: z.lazy(() => scalarsStr50Schema),
        })
        .describe("Available when 'joinDivision' is true")
        .optional(),
    }),
  ),
})

export const listProjectsQueryResponseSchema = z.lazy(() => listProjects200Schema)