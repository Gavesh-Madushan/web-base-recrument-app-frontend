import { attendanceRecordsAttendanceRecordSchema } from '../attendanceRecords/attendanceRecordSchema.ts'
import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { z } from 'zod'

export const getAttendanceRecordPathParamsSchema = z.object({
  id: z.lazy(() => scalarsIdSchema),
})

/**
 * @description The request has succeeded.
 */
export const getAttendanceRecord200Schema = z.lazy(() => attendanceRecordsAttendanceRecordSchema)

/**
 * @description The server cannot find the requested resource.
 */
export const getAttendanceRecord404Schema = z.object({
  message: z.string(),
})

export const getAttendanceRecordQueryResponseSchema = z.lazy(() => getAttendanceRecord200Schema)