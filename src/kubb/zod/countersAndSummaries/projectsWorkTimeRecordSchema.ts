import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { scalarsStr50Schema } from '../scalars/str50Schema.ts'
import { z } from 'zod'

export const countersAndSummariesProjectsWorkTimeRecordSchema = z.object({
  projectId: z.lazy(() => scalarsIdSchema),
  updatedAt: z.string().datetime(),
  workTime: z.string().datetime(),
  project: z
    .object({
      name: z.lazy(() => scalarsStr50Schema),
    })
    .describe('The template for picking properties.'),
})