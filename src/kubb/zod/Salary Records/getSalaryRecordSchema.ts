import { salaryRecordsSalaryRecordSchema } from '../salaryRecords/salaryRecordSchema.ts'
import { scalarsIdSchema } from '../scalars/idSchema.ts'
import { z } from 'zod'

export const getSalaryRecordPathParamsSchema = z.object({
  id: z.lazy(() => scalarsIdSchema),
})

/**
 * @description The request has succeeded.
 */
export const getSalaryRecord200Schema = z.lazy(() => salaryRecordsSalaryRecordSchema)

/**
 * @description The server cannot find the requested resource.
 */
export const getSalaryRecord404Schema = z.object({
  message: z.string(),
})

export const getSalaryRecordQueryResponseSchema = z.lazy(() => getSalaryRecord200Schema)