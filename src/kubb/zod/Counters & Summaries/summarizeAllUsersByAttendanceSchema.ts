import { enumsEmployeeDesignationSchema } from '../enums/employeeDesignationSchema.ts'
import { enumsLeaveRequestTypeSchema } from '../enums/leaveRequestTypeSchema.ts'
import { locationItemSchema } from '../locationItemSchema.ts'
import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { scalarsStr50Schema } from '../scalars/str50Schema.ts'
import { scalarsStr100Schema } from '../scalars/str100Schema.ts'
import { scalarsWSchema } from '../scalars/wSchema.ts'
import { z } from 'zod'

export const summarizeAllUsersByAttendanceQueryParamsSchema = z.object({
  day: z.string().datetime(),
  calculateCounts: z.boolean().default(false),
  fetchClockedInNotClockedOutUsers: z.boolean().default(false),
  fetchClockedInAndClockedOutUsers: z.boolean().default(false),
  fetchOnLeaveUsers: z.boolean().default(false),
  fetchLateUsers: z.boolean().default(false),
  pageSize: z.coerce.number().int().min(1).max(50).default(10),
  page: z.coerce.number().int().min(0).optional(),
})

/**
 * @description The request has succeeded.
 */
export const summarizeAllUsersByAttendance200Schema = z.object({
  clockedInNotClockedOutUsers: z
    .array(
      z.object({
        id: z.lazy(() => scalarsIdSchema),
        designation: z.lazy(() => enumsEmployeeDesignationSchema),
        employeeNumber: z.lazy(() => scalarsStr50Schema),
        class: z.lazy(() => scalarsStr50Schema),
        nameInitials: z.lazy(() => scalarsStr50Schema),
        profilePicturePath: z.lazy(() => scalarsStr100Schema).nullable(),
        attendanceRecords: z.array(
          z.object({
            createdAt: z.string().datetime(),
            createdLocation: z.lazy(() => locationItemSchema),
            endedAt: z.string().datetime().nullable(),
            endedLocation: z.lazy(() => locationItemSchema).nullable(),
            projectAssignment: z
              .object({
                project: z
                  .object({
                    name: z.lazy(() => scalarsStr50Schema),
                  })
                  .describe('The template for picking properties.'),
              })
              .nullable(),
          }),
        ),
      }),
    )
    .optional(),
  clockedInNotClockedOutUsersCount: z.lazy(() => scalarsWSchema).optional(),
  clockedInAndClockedOutUsers: z
    .array(
      z.object({
        id: z.lazy(() => scalarsIdSchema),
        designation: z.lazy(() => enumsEmployeeDesignationSchema),
        employeeNumber: z.lazy(() => scalarsStr50Schema),
        class: z.lazy(() => scalarsStr50Schema),
        nameInitials: z.lazy(() => scalarsStr50Schema),
        profilePicturePath: z.lazy(() => scalarsStr100Schema).nullable(),
        attendanceRecords: z.array(
          z.object({
            createdAt: z.string().datetime(),
            createdLocation: z.lazy(() => locationItemSchema),
            endedAt: z.string().datetime().nullable(),
            endedLocation: z.lazy(() => locationItemSchema).nullable(),
            projectAssignment: z
              .object({
                project: z
                  .object({
                    name: z.lazy(() => scalarsStr50Schema),
                  })
                  .describe('The template for picking properties.'),
              })
              .nullable(),
          }),
        ),
      }),
    )
    .optional(),
  clockedInAndClockedOutUsersCount: z.lazy(() => scalarsWSchema).optional(),
  onLeaveUsersCount: z.lazy(() => scalarsWSchema).optional(),
  onLeaveUsers: z
    .array(
      z.object({
        id: z.lazy(() => scalarsIdSchema),
        designation: z.lazy(() => enumsEmployeeDesignationSchema),
        employeeNumber: z.lazy(() => scalarsStr50Schema),
        class: z.lazy(() => scalarsStr50Schema),
        nameInitials: z.lazy(() => scalarsStr50Schema),
        profilePicturePath: z.lazy(() => scalarsStr100Schema).nullable(),
        leaveRequests: z.array(
          z
            .object({
              type: z.lazy(() => enumsLeaveRequestTypeSchema),
            })
            .describe('The template for picking properties.'),
        ),
      }),
    )
    .optional(),
  lateUsersCount: z.lazy(() => scalarsWSchema).optional(),
  lateUsers: z
    .array(
      z
        .object({
          id: z.lazy(() => scalarsIdSchema),
          employeeNumber: z.lazy(() => scalarsStr50Schema),
          class: z.lazy(() => scalarsStr50Schema),
        })
        .describe('The template for picking properties.'),
    )
    .optional(),
})

export const summarizeAllUsersByAttendanceQueryResponseSchema = z.lazy(() => summarizeAllUsersByAttendance200Schema)