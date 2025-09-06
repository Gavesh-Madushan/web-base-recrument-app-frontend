import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { scalarsMoneySchema } from '../scalars/moneySchema.ts'
import { scalarsStr100Schema } from '../scalars/str100Schema.ts'
import { z } from 'zod'

/**
 * @description There is no content to send for this request, but the headers may be useful.
 */
export const updateSalaryRecords204Schema = z.unknown()

/**
 * @description The server cannot find the requested resource.
 */
export const updateSalaryRecords404Schema = z.object({
  message: z.string(),
})

export const updateSalaryRecordsMutationRequestSchema = z.object({
  data: z
    .array(
      z.object({
        id: z.lazy(() => scalarsIdSchema),
        salaryBasic: z.lazy(() => scalarsMoneySchema).optional(),
        salaryBudgeted: z.lazy(() => scalarsMoneySchema).optional(),
        salaryWages: z.lazy(() => scalarsMoneySchema).optional(),
        salaryAllowance: z.lazy(() => scalarsMoneySchema).optional(),
        salaryVehicleAllowance: z.lazy(() => scalarsMoneySchema).optional(),
        salaryTravelAllowance: z.lazy(() => scalarsMoneySchema).optional(),
        salaryBata: z.lazy(() => scalarsMoneySchema).optional(),
        salaryOutstation: z.lazy(() => scalarsMoneySchema).optional(),
        salaryOt: z.lazy(() => scalarsMoneySchema).optional(),
        deductionEpf8: z.lazy(() => scalarsMoneySchema).optional(),
        deductionEpf12: z.lazy(() => scalarsMoneySchema).optional(),
        deductionEtf: z.lazy(() => scalarsMoneySchema).optional(),
        deductionNoPay: z.lazy(() => scalarsMoneySchema).optional(),
        deductionLoan: z.lazy(() => scalarsMoneySchema).optional(),
        deductionAdvance: z.lazy(() => scalarsMoneySchema).optional(),
        deductionPayee: z.lazy(() => scalarsMoneySchema).optional(),
        deductionOther: z.lazy(() => scalarsMoneySchema).optional(),
        comment: z.lazy(() => scalarsStr100Schema).optional(),
      }),
    )
    .min(1)
    .max(50),
})

export const updateSalaryRecordsMutationResponseSchema = z.lazy(() => updateSalaryRecords204Schema)