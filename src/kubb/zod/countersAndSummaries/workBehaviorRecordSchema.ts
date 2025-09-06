import { enumsEmployeeDesignationSchema } from '../enums/employeeDesignationSchema.ts'
import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { scalarsMonthSchema } from '../scalars/monthSchema.ts'
import { scalarsStr50Schema } from '../scalars/str50Schema.ts'
import { scalarsStr100Schema } from '../scalars/str100Schema.ts'
import { scalarsWSchema } from '../scalars/wSchema.ts'
import { scalarsYearSchema } from '../scalars/yearSchema.ts'
import { z } from 'zod'

export const countersAndSummariesWorkBehaviorRecordSchema = z.object({
  user: z
    .object({
      designation: z.lazy(() => enumsEmployeeDesignationSchema),
      employeeNumber: z.lazy(() => scalarsStr50Schema),
      class: z.lazy(() => scalarsStr50Schema),
      nameInitials: z.lazy(() => scalarsStr50Schema),
      profilePicturePath: z.lazy(() => scalarsStr100Schema).nullable(),
    })
    .describe('The template for picking properties.'),
  divisionId: z.lazy(() => scalarsIdSchema),
  userId: z.lazy(() => scalarsIdSchema),
  year: z.lazy(() => scalarsYearSchema),
  month: z.lazy(() => scalarsMonthSchema),
  workBehaviors: z.lazy(() => scalarsStr100Schema),
  workProjects: z.lazy(() => scalarsStr100Schema),
  otHrs: z.lazy(() => scalarsWSchema),
  presentDays: z.lazy(() => scalarsWSchema),
  absentDays: z.lazy(() => scalarsWSchema),
  fullyWorkedDays: z.lazy(() => scalarsWSchema),
  fullLeaveDays: z.lazy(() => scalarsWSchema),
  halfLeaveDays: z.lazy(() => scalarsWSchema),
})