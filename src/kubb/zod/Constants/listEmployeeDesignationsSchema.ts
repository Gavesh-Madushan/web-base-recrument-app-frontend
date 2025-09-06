import { enumsEmployeeDesignationSchema } from '../enums/employeeDesignationSchema.ts'
import { z } from 'zod'

/**
 * @description The request has succeeded.
 */
export const listEmployeeDesignations200Schema = z.array(z.lazy(() => enumsEmployeeDesignationSchema))

export const listEmployeeDesignationsQueryResponseSchema = z.lazy(() => listEmployeeDesignations200Schema)