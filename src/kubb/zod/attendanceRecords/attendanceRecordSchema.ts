import { enumsAttendanceRecordTypeSchema } from '../enums/attendanceRecordTypeSchema.ts'
import { locationItemSchema } from '../locationItemSchema.ts'
import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { scalarsStr100Schema } from '../scalars/str100Schema.ts'
import { z } from 'zod'

export const attendanceRecordsAttendanceRecordSchema = z.object({
  id: z.lazy(() => scalarsIdSchema),
  divisionId: z.lazy(() => scalarsIdSchema),
  userId: z.lazy(() => scalarsIdSchema),
  projectAssignmentId: z.lazy(() => scalarsIdSchema).nullable(),
  type: z.lazy(() => enumsAttendanceRecordTypeSchema),
  createdLocation: z.lazy(() => locationItemSchema),
  endedLocation: z.lazy(() => locationItemSchema).nullable(),
  createdAt: z.string().datetime(),
  endedAt: z.string().datetime().nullable(),
  lastUpdatedUserId: z.lazy(() => scalarsIdSchema).nullable(),
  comment: z.lazy(() => scalarsStr100Schema).nullable(),
})