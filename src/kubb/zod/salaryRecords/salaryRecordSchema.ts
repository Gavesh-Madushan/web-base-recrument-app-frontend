import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { scalarsMoneySchema } from '../scalars/moneySchema.ts'
import { scalarsMonthSchema } from '../scalars/monthSchema.ts'
import { scalarsStr100Schema } from '../scalars/str100Schema.ts'
import { scalarsYearSchema } from '../scalars/yearSchema.ts'
import { z } from 'zod'

export const salaryRecordsSalaryRecordSchema = z.object({
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
})