import { enumsLeaveRequestTypeSchema } from '../enums/leaveRequestTypeSchema.ts'
import { z } from 'zod'

/**
 * @description The request has succeeded.
 */
export const listLeaveRequestTypes200Schema = z.array(z.lazy(() => enumsLeaveRequestTypeSchema))

export const listLeaveRequestTypesQueryResponseSchema = z.lazy(() => listLeaveRequestTypes200Schema)