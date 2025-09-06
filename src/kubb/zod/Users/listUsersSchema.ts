import { enumsActiveStateSchema } from '../enums/activeStateSchema.ts'
import { enumsEmployeeDesignationSchema } from '../enums/employeeDesignationSchema.ts'
import { scalarsEmailSchema } from '../scalars/emailSchema.ts'
import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { scalarsMobileSchema } from '../scalars/mobileSchema.ts'
import { scalarsMoneySchema } from '../scalars/moneySchema.ts'
import { scalarsStr10Schema } from '../scalars/str10Schema.ts'
import { scalarsStr50Schema } from '../scalars/str50Schema.ts'
import { scalarsStr100Schema } from '../scalars/str100Schema.ts'
import { z } from 'zod'

export const listUsersQueryParamsSchema = z
  .object({
    pageSize: z.coerce.number().int().min(1).max(50).default(10),
    page: z.coerce.number().int().min(0).optional(),
    searchTerm: z.lazy(() => scalarsStr10Schema).optional(),
    pendingLeaveRequests: z.boolean().optional(),
    roleId: z.lazy(() => scalarsIdSchema).optional(),
    designation: z.lazy(() => enumsEmployeeDesignationSchema).optional(),
    divisionId: z.lazy(() => scalarsIdSchema).optional(),
    activeState: z.lazy(() => enumsActiveStateSchema).optional(),
    joinRole: z.boolean().default(false),
    joinDivision: z.boolean().default(false),
    countProjectAssignments: z.boolean().default(false),
  })
  .optional()

/**
 * @description The request has succeeded.
 */
export const listUsers200Schema = z.object({
  totalCount: z.coerce.number().int().describe("Will be calculated only if the 'page' parameter is explicitly set to 0").optional(),
  data: z.array(
    z.object({
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
      role: z
        .object({
          name: z.lazy(() => scalarsStr50Schema),
        })
        .describe("Available when 'joinRole' is true")
        .optional(),
      division: z
        .object({
          name: z.lazy(() => scalarsStr50Schema),
        })
        .describe("Available when 'joinDivision' is true")
        .optional(),
    }),
  ),
})

export const listUsersQueryResponseSchema = z.lazy(() => listUsers200Schema)