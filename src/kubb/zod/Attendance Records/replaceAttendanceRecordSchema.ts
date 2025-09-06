import { attendanceRecordsAttendanceRecordSchema } from '../attendanceRecords/attendanceRecordSchema.ts'
import { enumsAttendanceRecordTypeSchema } from '../enums/attendanceRecordTypeSchema.ts'
import { locationItemSchema } from '../locationItemSchema.ts'
import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { scalarsStr100Schema } from '../scalars/str100Schema.ts'
import { z } from 'zod'

export const replaceAttendanceRecordPathParamsSchema = z.object({
  id: z.lazy(() => scalarsIdSchema),
})

/**
 * @description The request has succeeded and a new resource has been created as a result.
 */
export const replaceAttendanceRecord201Schema = z.lazy(() => attendanceRecordsAttendanceRecordSchema)

/**
 * @description The server could not understand the request due to invalid syntax.
 */
export const replaceAttendanceRecord400Schema = z.object({
  message: z.string(),
})

/**
 * @description The server cannot find the requested resource.
 */
export const replaceAttendanceRecord404Schema = z.object({
  message: z.string(),
})

/**
 * @description The request conflicts with the current state of the server.
 */
export const replaceAttendanceRecord409Schema = z.object({
  message: z.string(),
})

export const replaceAttendanceRecordMutationRequestSchema = z.object({
  data: z.object({
    divisionId: z.lazy(() => scalarsIdSchema),
    userId: z.lazy(() => scalarsIdSchema),
    projectAssignmentId: z.lazy(() => scalarsIdSchema).nullable(),
    type: z.lazy(() => enumsAttendanceRecordTypeSchema),
    createdLocation: z.lazy(() => locationItemSchema),
    createdAt: z.string().datetime(),
    comment: z.lazy(() => scalarsStr100Schema).nullable(),
    endedAt: z.string().datetime(),
    endedLocation: z.lazy(() => locationItemSchema),
  }),
})

export const replaceAttendanceRecordMutationResponseSchema = z.lazy(() => replaceAttendanceRecord201Schema)