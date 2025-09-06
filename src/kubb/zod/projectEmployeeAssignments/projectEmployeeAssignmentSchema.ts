import { enumsEmployeeDesignationSchema } from '../enums/employeeDesignationSchema.ts'
import { enumsProjectProcessingStateSchema } from '../enums/projectProcessingStateSchema.ts'
import { locationItemSchema } from '../locationItemSchema.ts'
import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { scalarsStr50Schema } from '../scalars/str50Schema.ts'
import { scalarsStr100Schema } from '../scalars/str100Schema.ts'
import { z } from 'zod'

export const projectEmployeeAssignmentsProjectEmployeeAssignmentSchema = z.object({
  id: z.lazy(() => scalarsIdSchema),
  divisionId: z.lazy(() => scalarsIdSchema),
  userId: z.lazy(() => scalarsIdSchema),
  user: z
    .object({
      designation: z.lazy(() => enumsEmployeeDesignationSchema),
      employeeNumber: z.lazy(() => scalarsStr50Schema),
      class: z.lazy(() => scalarsStr50Schema),
      nameInitials: z.lazy(() => scalarsStr50Schema),
      profilePicturePath: z.lazy(() => scalarsStr100Schema).nullable(),
    })
    .describe('The template for picking properties.')
    .optional(),
  projectId: z.lazy(() => scalarsIdSchema),
  project: z
    .object({
      processingState: z.lazy(() => enumsProjectProcessingStateSchema),
      name: z.lazy(() => scalarsStr50Schema),
      location: z.lazy(() => locationItemSchema),
      isOutstation: z.boolean(),
      address: z.lazy(() => scalarsStr100Schema),
    })
    .describe('The template for picking properties.')
    .optional(),
  createdAt: z.string().datetime(),
})