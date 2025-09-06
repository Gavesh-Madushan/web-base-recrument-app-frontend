import { enumsEmployeeDesignationSchema } from '../enums/employeeDesignationSchema.ts'
import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { scalarsStr50Schema } from '../scalars/str50Schema.ts'
import { scalarsStr100Schema } from '../scalars/str100Schema.ts'
import { z } from 'zod'

export const sessionsSessionSchema = z.object({
  jwt: z.string(),
  expiresAt: z.string().datetime(),
  user: z
    .object({
      id: z.lazy(() => scalarsIdSchema),
      roleId: z.lazy(() => scalarsIdSchema),
      divisionId: z.lazy(() => scalarsIdSchema),
      designation: z.lazy(() => enumsEmployeeDesignationSchema),
      class: z.lazy(() => scalarsStr50Schema),
      nameInitials: z.lazy(() => scalarsStr50Schema),
      profilePicturePath: z.lazy(() => scalarsStr100Schema).nullable(),
      remainingLeaveDaysAnnual: z.coerce.number(),
      remainingLeaveDaysMedical: z.coerce.number(),
      remainingLeaveDaysCasual: z.coerce.number(),
    })
    .describe('The template for picking properties.'),
})