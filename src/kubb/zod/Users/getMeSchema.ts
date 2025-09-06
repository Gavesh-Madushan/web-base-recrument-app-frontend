import { enumsActiveStateSchema } from '../enums/activeStateSchema.ts'
import { enumsAttendanceRecordTypeSchema } from '../enums/attendanceRecordTypeSchema.ts'
import { enumsEmployeeDesignationSchema } from '../enums/employeeDesignationSchema.ts'
import { leaveRequestsLeaveRequestSchema } from '../leaveRequests/leaveRequestSchema.ts'
import { locationItemSchema } from '../locationItemSchema.ts'
import { scalarsEmailSchema } from '../scalars/emailSchema.ts'
import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { scalarsMobileSchema } from '../scalars/mobileSchema.ts'
import { scalarsMoneySchema } from '../scalars/moneySchema.ts'
import { scalarsStr50Schema } from '../scalars/str50Schema.ts'
import { scalarsStr100Schema } from '../scalars/str100Schema.ts'
import { uploadsUploadSchema } from '../uploads/uploadSchema.ts'
import { z } from 'zod'

export const getMeQueryParamsSchema = z
  .object({
    pageSize: z.coerce.number().int().min(1).max(50).default(10),
    page: z.coerce.number().int().min(0).optional(),
    joinAttendanceRecords: z.boolean().default(false),
    joinLeaveRequests: z.boolean().default(false),
    joinUploads: z.boolean().default(false),
  })
  .optional()

/**
 * @description The request has succeeded.
 */
export const getMe200Schema = z.object({
  id: z.lazy(() => scalarsIdSchema),
  mobile: z.lazy(() => scalarsMobileSchema),
  roleId: z.lazy(() => scalarsIdSchema),
  divisionId: z.lazy(() => scalarsIdSchema),
  designation: z.lazy(() => enumsEmployeeDesignationSchema),
  activeState: z.lazy(() => enumsActiveStateSchema),
  employeeNumber: z.lazy(() => scalarsStr50Schema),
  name: z.lazy(() => scalarsStr50Schema),
  class: z.lazy(() => scalarsStr50Schema),
  nameInitials: z.lazy(() => scalarsStr50Schema),
  nic: z.lazy(() => scalarsStr50Schema),
  email: z.lazy(() => scalarsEmailSchema).nullable(),
  profilePicturePath: z.lazy(() => scalarsStr100Schema).nullable(),
  address: z.lazy(() => scalarsStr50Schema),
  birthDate: z.string().datetime(),
  salaryBasic: z.lazy(() => scalarsMoneySchema),
  salaryBudgeted: z.lazy(() => scalarsMoneySchema),
  salaryWages: z.lazy(() => scalarsMoneySchema),
  salaryAllowance: z.lazy(() => scalarsMoneySchema),
  salaryVehicleAllowance: z.lazy(() => scalarsMoneySchema),
  salaryTravelAllowance: z.lazy(() => scalarsMoneySchema),
  salaryOtPerHour: z.lazy(() => scalarsMoneySchema),
  salaryBata: z.lazy(() => scalarsMoneySchema),
  salaryOutstationPerDay: z.lazy(() => scalarsMoneySchema),
  percentageEpf8: z.coerce.number(),
  percentageEpf12: z.coerce.number(),
  percentageEtf: z.coerce.number(),
  remainingLeaveDaysAnnual: z.coerce.number(),
  entitledLeaveDaysAnnual: z.coerce.number(),
  remainingLeaveDaysMedical: z.coerce.number(),
  entitledLeaveDaysMedical: z.coerce.number(),
  remainingLeaveDaysCasual: z.coerce.number(),
  entitledLeaveDaysCasual: z.coerce.number(),
  createdAt: z.string().datetime(),
  resignedAt: z.string().datetime().nullable(),
  division: z
    .object({
      name: z.lazy(() => scalarsStr50Schema),
    })
    .describe('The template for picking properties.'),
  attendanceRecords: z
    .array(
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
    )
    .describe("Available when 'joinAttendanceRecords' is true"),
  leaveRequests: z.array(z.lazy(() => leaveRequestsLeaveRequestSchema)).describe("Available when 'joinLeaveRequests' is true"),
  uploads: z.array(z.lazy(() => uploadsUploadSchema)).describe("Available when 'joinUploads' is true"),
})

/**
 * @description The server cannot find the requested resource.
 */
export const getMe404Schema = z.object({
  message: z.string(),
})

export const getMeQueryResponseSchema = z.lazy(() => getMe200Schema)