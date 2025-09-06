import { enumsAttendanceRecordTypeSchema } from '../enums/attendanceRecordTypeSchema.ts'
import { enumsEmployeeDesignationSchema } from '../enums/employeeDesignationSchema.ts'
import { locationItemSchema } from '../locationItemSchema.ts'
import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { scalarsStr10Schema } from '../scalars/str10Schema.ts'
import { scalarsStr50Schema } from '../scalars/str50Schema.ts'
import { scalarsStr100Schema } from '../scalars/str100Schema.ts'
import { z } from 'zod'

export const listAttendanceRecordsQueryParamsSchema = z
  .object({
    pageSize: z.coerce.number().int().min(1).max(50).default(10),
    page: z.coerce.number().int().min(0).optional(),
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
    joinUser: z.boolean().default(false),
    joinProjectAssignment: z.boolean().default(false),
  })
  .optional()

/**
 * @description The request has succeeded.
 */
export const listAttendanceRecords200Schema = z.object({
  totalCount: z.coerce.number().int().describe("Will be calculated only if the 'page' parameter is explicitly set to 0").optional(),
  data: z.array(
    z.object({
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
      user: z
        .object({
          designation: z.lazy(() => enumsEmployeeDesignationSchema),
          employeeNumber: z.lazy(() => scalarsStr50Schema),
          class: z.lazy(() => scalarsStr50Schema),
          nameInitials: z.lazy(() => scalarsStr50Schema),
          profilePicturePath: z.lazy(() => scalarsStr100Schema).nullable(),
        })
        .describe('Available only if joinUser is true')
        .optional(),
      projectAssignment: z
        .object({
          project: z
            .object({
              name: z.lazy(() => scalarsStr50Schema),
            })
            .describe('The template for picking properties.'),
        })
        .describe('Available only if joinProjectAssignment is true')
        .nullable()
        .nullish(),
    }),
  ),
})

export const listAttendanceRecordsQueryResponseSchema = z.lazy(() => listAttendanceRecords200Schema)