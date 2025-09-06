import { enumsActiveStateSchema } from '../enums/activeStateSchema.ts'
import { enumsEmployeeDesignationSchema } from '../enums/employeeDesignationSchema.ts'
import { scalarsEmailSchema } from '../scalars/emailSchema.ts'
import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { scalarsMobileSchema } from '../scalars/mobileSchema.ts'
import { scalarsMoneySchema } from '../scalars/moneySchema.ts'
import { scalarsStr50Schema } from '../scalars/str50Schema.ts'
import { scalarsStr100Schema } from '../scalars/str100Schema.ts'
import { z } from 'zod'

export const usersUserSchema = z.object({
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
})