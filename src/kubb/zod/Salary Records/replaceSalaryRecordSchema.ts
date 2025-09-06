import { salaryRecordsSalaryRecordSchema } from '../salaryRecords/salaryRecordSchema.ts'
import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { scalarsMoneySchema } from '../scalars/moneySchema.ts'
import { scalarsStr100Schema } from '../scalars/str100Schema.ts'
import { z } from 'zod'

export const replaceSalaryRecordPathParamsSchema = z.object({
  id: z.lazy(() => scalarsIdSchema),
})

/**
 * @description The request has succeeded.
 */
export const replaceSalaryRecord200Schema = z.lazy(() => salaryRecordsSalaryRecordSchema)

/**
 * @description The server could not understand the request due to invalid syntax.
 */
export const replaceSalaryRecord400Schema = z.object({
  message: z.string(),
})

/**
 * @description The server cannot find the requested resource.
 */
export const replaceSalaryRecord404Schema = z.object({
  message: z.string(),
})

export const replaceSalaryRecordMutationRequestSchema = z.object({
  data: z.object({
    salaryBasic: z.lazy(() => scalarsMoneySchema),
    salaryBudgeted: z.lazy(() => scalarsMoneySchema),
    salaryWages: z.lazy(() => scalarsMoneySchema),
    salaryAllowance: z.lazy(() => scalarsMoneySchema),
    salaryVehicleAllowance: z.lazy(() => scalarsMoneySchema),
    salaryTravelAllowance: z.lazy(() => scalarsMoneySchema),
    salaryBata: z.lazy(() => scalarsMoneySchema),
    salaryOutstation: z.lazy(() => scalarsMoneySchema),
    salaryOt: z.lazy(() => scalarsMoneySchema),
    deductionEpf8: z.lazy(() => scalarsMoneySchema),
    deductionEpf12: z.lazy(() => scalarsMoneySchema),
    deductionEtf: z.lazy(() => scalarsMoneySchema),
    deductionNoPay: z.lazy(() => scalarsMoneySchema),
    deductionLoan: z.lazy(() => scalarsMoneySchema),
    deductionAdvance: z.lazy(() => scalarsMoneySchema),
    deductionPayee: z.lazy(() => scalarsMoneySchema),
    deductionOther: z.lazy(() => scalarsMoneySchema),
    comment: z.lazy(() => scalarsStr100Schema),
  }),
})

export const replaceSalaryRecordMutationResponseSchema = z.lazy(() => replaceSalaryRecord200Schema)