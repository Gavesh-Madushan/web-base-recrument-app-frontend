import { enumsActiveStateSchema } from '../enums/activeStateSchema.ts'
import { scalarsEmailSchema } from '../scalars/emailSchema.ts'
import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { scalarsMobileSchema } from '../scalars/mobileSchema.ts'
import { scalarsStr50Schema } from '../scalars/str50Schema.ts'
import { scalarsStr100Schema } from '../scalars/str100Schema.ts'
import { z } from 'zod'

export const projectClientsProjectClientSchema = z.object({
  id: z.lazy(() => scalarsIdSchema),
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