import { enumsEmployeeDesignationSchema } from '../enums/employeeDesignationSchema.ts'
import { scalarsStr50Schema } from '../scalars/str50Schema.ts'
import { scalarsStr100Schema } from '../scalars/str100Schema.ts'
import { z } from 'zod'

export const countersAndSummariesProjectContributionRecordSchema = z.object({
  day: z.string().datetime(),
  users: z.array(
    z.object({
      designation: z.lazy(() => enumsEmployeeDesignationSchema),
      employeeNumber: z.lazy(() => scalarsStr50Schema),
      class: z.lazy(() => scalarsStr50Schema),
      nameInitials: z.lazy(() => scalarsStr50Schema),
      profilePicturePath: z.lazy(() => scalarsStr100Schema).nullable(),
      workHrs: z.coerce.number(),
    }),
  ),
})