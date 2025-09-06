import { enumsAttendanceRecordTypeSchema } from '../enums/attendanceRecordTypeSchema.ts'
import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { scalarsStr10Schema } from '../scalars/str10Schema.ts'
import { z } from 'zod'

export const downloadAttendanceRecordsQueryParamsSchema = z
  .object({
    searchTerm: z.lazy(() => scalarsStr10Schema).optional(),
    divisionId: z.lazy(() => scalarsIdSchema).optional(),
    userId: z
      .union([z.lazy(() => scalarsIdSchema), z.enum(['@me'])])
      .describe('Only allowed @me. It filters self owned items')
      .optional(),
    projectAssignmentId: z.lazy(() => scalarsIdSchema).optional(),
    type: z.lazy(() => enumsAttendanceRecordTypeSchema).optional(),
    createdFrom: z.string().datetime().optional(),
    createdTo: z.string().datetime().optional(),
    endedFrom: z.string().datetime().optional(),
    endedTo: z.string().datetime().optional(),
  })
  .optional()

/**
 * @description The request has succeeded.
 */
export const downloadAttendanceRecords200Schema = z.string()

/**
 * @description The server could not understand the request due to invalid syntax.
 */
export const downloadAttendanceRecords400Schema = z.object({
  message: z.string(),
})

export const downloadAttendanceRecordsQueryResponseSchema = z.lazy(() => downloadAttendanceRecords200Schema)