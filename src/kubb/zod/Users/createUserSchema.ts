import { enumsActiveStateSchema } from '../enums/activeStateSchema.ts'
import { enumsEmployeeDesignationSchema } from '../enums/employeeDesignationSchema.ts'
import { scalarsEmailSchema } from '../scalars/emailSchema.ts'
import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { scalarsMobileSchema } from '../scalars/mobileSchema.ts'
import { scalarsMoneySchema } from '../scalars/moneySchema.ts'
import { scalarsPasswordSchema } from '../scalars/passwordSchema.ts'
import { scalarsStr50Schema } from '../scalars/str50Schema.ts'
import { usersUserSchema } from '../users/userSchema.ts'
import { z } from 'zod'

/**
 * @description The request has succeeded and a new resource has been created as a result.
 */
export const createUser201Schema = z.lazy(() => usersUserSchema)

/**
 * @description The server cannot find the requested resource.
 */
export const createUser404Schema = z.object({
  message: z.string(),
})

/**
 * @description The request conflicts with the current state of the server.
 */
export const createUser409Schema = z.object({
  message: z.string(),
})

export const createUserMutationRequestSchema = z.object({
  data: z.object({
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
    entitledLeaveDaysAnnual: z.coerce.number(),
    entitledLeaveDaysMedical: z.coerce.number(),
    entitledLeaveDaysCasual: z.coerce.number(),
    createdAt: z.string().datetime(),
    resignedAt: z.string().datetime().nullable(),
    password: z.lazy(() => scalarsPasswordSchema),
  }),
})

export const createUserMutationResponseSchema = z.lazy(() => createUser201Schema)