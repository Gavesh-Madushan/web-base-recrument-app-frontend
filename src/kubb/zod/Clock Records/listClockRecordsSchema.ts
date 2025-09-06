import { enumsApprovalStateSchema } from '../enums/approvalStateSchema.ts'
import { enumsEmployeeDesignationSchema } from '../enums/employeeDesignationSchema.ts'
import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { scalarsMoneySchema } from '../scalars/moneySchema.ts'
import { scalarsStr50Schema } from '../scalars/str50Schema.ts'
import { scalarsStr100Schema } from '../scalars/str100Schema.ts'
import { scalarsWSchema } from '../scalars/wSchema.ts'
import { z } from 'zod'

export const listClockRecordsQueryParamsSchema = z
  .object({
    pageSize: z.coerce.number().int().min(1).max(50).default(10),
    page: z.coerce.number().int().min(0).optional(),
    divisionId: z.lazy(() => scalarsIdSchema).optional(),
    userId: z
      .union([z.lazy(() => scalarsIdSchema), z.enum(['@me'])])
      .describe('Only allowed @me. It filters self owned items')
      .optional(),
    createdFrom: z.string().datetime().optional(),
    createdTo: z.string().datetime().optional(),
    endedFrom: z.string().datetime().optional(),
    endedTo: z.string().datetime().optional(),
    hasOtHrs: z.boolean().optional(),
    approvalState: z.lazy(() => enumsApprovalStateSchema).optional(),
    joinUser: z.boolean().default(false),
    joinAttendanceRecords: z.boolean().default(false),
  })
  .optional()

/**
 * @description The request has succeeded.
 */
export const listClockRecords200Schema = z.object({
  totalCount: z.coerce.number().int().describe("Will be calculated only if the 'page' parameter is explicitly set to 0").optional(),
  data: z.array(
    z.object({
      id: z.lazy(() => scalarsIdSchema),
      userId: z.lazy(() => scalarsIdSchema),
      divisionId: z.lazy(() => scalarsIdSchema),
      createdAt: z.string().datetime(),
      paymentOutstation: z.lazy(() => scalarsMoneySchema),
      otHrs: z.lazy(() => scalarsWSchema),
      endedAt: z.string().datetime().nullable(),
      approvalState: z.lazy(() => enumsApprovalStateSchema),
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
      attendanceRecords: z
        .array(
          z.object({
            createdAt: z.string().datetime(),
            endedAt: z.string().datetime().nullable(),
            projectAssignment: z
              .object({
                project: z
                  .object({
                    name: z.lazy(() => scalarsStr50Schema),
                  })
                  .describe('The template for picking properties.'),
              })
              .nullable()
              .nullish(),
          }),
        )
        .describe('Available only if joinAttendanceRecords is true')
        .optional(),
    }),
  ),
})

export const listClockRecordsQueryResponseSchema = z.lazy(() => listClockRecords200Schema)