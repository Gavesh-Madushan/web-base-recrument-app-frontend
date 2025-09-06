import { enumsActiveStateSchema } from '../enums/activeStateSchema.ts'
import { scalarsEmailSchema } from '../scalars/emailSchema.ts'
import { scalarsMobileSchema } from '../scalars/mobileSchema.ts'
import { scalarsStr50Schema } from '../scalars/str50Schema.ts'
import { scalarsStr100Schema } from '../scalars/str100Schema.ts'
import { z } from 'zod'

/**
 * @description The template for omitting properties.
 */
export const projectClientsProjectClientInputSchema = z
  .object({
    activeState: z.lazy(() => enumsActiveStateSchema),
    businessName: z.lazy(() => scalarsStr50Schema),
    businessPhone: z.lazy(() => scalarsMobileSchema).nullable(),
    businessEmail: z.lazy(() => scalarsEmailSchema).nullable(),
    businessAddress: z.lazy(() => scalarsStr100Schema).nullable(),
    personName: z.lazy(() => scalarsStr50Schema).nullable(),
    personPhone: z.lazy(() => scalarsMobileSchema).nullable(),
    description: z
      .lazy(() => scalarsStr100Schema)
      .nullable()
      .nullish(),
  })
  .describe('The template for omitting properties.')