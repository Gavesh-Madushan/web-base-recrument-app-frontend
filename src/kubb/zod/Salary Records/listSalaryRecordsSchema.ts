import { enumsEmployeeDesignationSchema } from '../enums/employeeDesignationSchema.ts'
import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { scalarsMoneySchema } from '../scalars/moneySchema.ts'
import { scalarsMonthSchema } from '../scalars/monthSchema.ts'
import { scalarsStr10Schema } from '../scalars/str10Schema.ts'
import { scalarsStr50Schema } from '../scalars/str50Schema.ts'
import { scalarsStr100Schema } from '../scalars/str100Schema.ts'
import { scalarsWSchema } from '../scalars/wSchema.ts'
import { scalarsYearSchema } from '../scalars/yearSchema.ts'
import { z } from 'zod'

export const listSalaryRecordsQueryParamsSchema = z
  .object({
    pageSize: z.coerce.number().int().min(1).max(50).default(10),
    page: z.coerce.number().int().min(0).optional(),
    searchTerm: z.lazy(() => scalarsStr10Schema).optional(),
    divisionId: z.lazy(() => scalarsIdSchema).optional(),
    userId: z
      .union([z.lazy(() => scalarsIdSchema), z.enum(['@me'])])
      .describe('Only allowed @me. It filters self owned items')
      .optional(),
    year: z.lazy(() => scalarsYearSchema).optional(),
    month: z.lazy(() => scalarsMonthSchema).optional(),
    joinUser: z.boolean().default(false),
  })
  .optional()

/**
 * @description The request has succeeded.
 */
export const listSalaryRecords200Schema = z.object({
  totalCount: z.coerce.number().int().describe("Will be calculated only if the 'page' parameter is explicitly set to 0").optional(),
  data: z.array(
    z.object({
      id: z.lazy(() => scalarsIdSchema),
      divisionId: z.lazy(() => scalarsIdSchema),
      userId: z.lazy(() => scalarsIdSchema),
      lastUpdatedUserId: z.lazy(() => scalarsIdSchema).nullable(),
      year: z.lazy(() => scalarsYearSchema),
      month: z.lazy(() => scalarsMonthSchema),
      createdAt: z.string().datetime(),
      salaryBasic: z.lazy(() => scalarsMoneySchema),
      salaryBudgeted: z.lazy(() => scalarsMoneySchema),
      salaryWages: z.lazy(() => scalarsMoneySchema),
      salaryAllowance: z.lazy(() => scalarsMoneySchema),
      salaryVehicleAllowance: z.lazy(() => scalarsMoneySchema),
      salaryTravelAllowance: z.lazy(() => scalarsMoneySchema),
      salaryBata: z.lazy(() => scalarsMoneySchema),
      salaryOutstation: z.lazy(() => scalarsMoneySchema),
      salaryOt: z.lazy(() => scalarsMoneySchema),
      salaryTotal: z.lazy(() => scalarsMoneySchema),
      deductionEpf8: z.lazy(() => scalarsMoneySchema),
      deductionEpf12: z.lazy(() => scalarsMoneySchema),
      deductionEtf: z.lazy(() => scalarsMoneySchema),
      deductionNoPay: z.lazy(() => scalarsMoneySchema),
      deductionLoan: z.lazy(() => scalarsMoneySchema),
      deductionAdvance: z.lazy(() => scalarsMoneySchema),
      deductionPayee: z.lazy(() => scalarsMoneySchema),
      deductionOther: z.lazy(() => scalarsMoneySchema),
      deductionTotal: z.lazy(() => scalarsMoneySchema),
      finalTotal: z.lazy(() => scalarsMoneySchema),
      comment: z.lazy(() => scalarsStr100Schema).nullable(),
      updatedAt: z.string().datetime(),
      user: z
        .object({
          designation: z.lazy(() => enumsEmployeeDesignationSchema),
          employeeNumber: z.lazy(() => scalarsStr50Schema),
          class: z.lazy(() => scalarsStr50Schema),
          nameInitials: z.lazy(() => scalarsStr50Schema),
          profilePicturePath: z.lazy(() => scalarsStr100Schema).nullable(),
        })
        .describe('Only included if joinUser is true'),
      workBehavior: z
        .object({
          workBehaviors: z.lazy(() => scalarsStr100Schema),
          otHrs: z.lazy(() => scalarsWSchema),
          presentDays: z.lazy(() => scalarsWSchema),
          absentDays: z.lazy(() => scalarsWSchema),
          fullyWorkedDays: z.lazy(() => scalarsWSchema),
          fullLeaveDays: z.lazy(() => scalarsWSchema),
          halfLeaveDays: z.lazy(() => scalarsWSchema),
        })
        .describe('The template for picking properties.'),
    }),
  ),
})

export const listSalaryRecordsQueryResponseSchema = z.lazy(() => listSalaryRecords200Schema)