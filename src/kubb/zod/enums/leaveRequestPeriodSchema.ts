import { z } from 'zod'

export const enumsLeaveRequestPeriodSchema = z.enum(['ONE_DAY', 'HALF_DAY_MORNING', 'HALF_DAY_AFTERNOON'])