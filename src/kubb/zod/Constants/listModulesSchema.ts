import { scalarsStr50Schema } from '../scalars/str50Schema.ts'
import { z } from 'zod'

/**
 * @description The request has succeeded.
 */
export const listModules200Schema = z.array(z.lazy(() => scalarsStr50Schema))

export const listModulesQueryResponseSchema = z.lazy(() => listModules200Schema)