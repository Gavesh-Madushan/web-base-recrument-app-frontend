import { attendanceRecordsAttendanceRecordSchema } from '../attendanceRecords/attendanceRecordSchema.ts'
import { enumsAttendanceRecordTypeSchema } from '../enums/attendanceRecordTypeSchema.ts'
import { locationItemSchema } from '../locationItemSchema.ts'
import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { z } from 'zod'

/**
 * @description The request has succeeded and a new resource has been created as a result.
 */
export const clockIn201Schema = z.lazy(() => attendanceRecordsAttendanceRecordSchema)

/**
 * @description The server could not understand the request due to invalid syntax.
 */
export const clockIn400Schema = z.object({
  message: z.string(),
})

/**
 * @description Access is forbidden.
 */
export const clockIn403Schema = z.object({
  message: z.string(),
})

export const clockInMutationRequestSchema = z.object({
  data: z
    .object({
      projectAssignmentId: z.lazy(() => scalarsIdSchema).nullable(),
      type: z.lazy(() => enumsAttendanceRecordTypeSchema),
      createdLocation: z.lazy(() => locationItemSchema),
    })
    .describe('The template for picking properties.'),
})

export const clockInMutationResponseSchema = z.lazy(() => clockIn201Schema)