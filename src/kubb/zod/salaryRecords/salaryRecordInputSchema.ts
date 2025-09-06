import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { scalarsMoneySchema } from '../scalars/moneySchema.ts'
import { scalarsMonthSchema } from '../scalars/monthSchema.ts'
import { scalarsYearSchema } from '../scalars/yearSchema.ts'
import { z } from 'zod'

/**
 * @description The template for picking properties.
 */
export const salaryRecordsSalaryRecordInputSchema = z
  .object({
    userId: z.lazy(() => scalarsIdSchema),
    year: z.lazy(() => scalarsYearSchema),
    month: z.lazy(() => scalarsMonthSchema),
    deductionNoPay: z.lazy(() => scalarsMoneySchema),
  })
  .describe('The template for picking properties.')