import { z } from 'zod'

export const enumsLeaveRequestTypeSchema = z.enum(['ANNUAL', 'MEDICAL', 'CASUAL', 'DAY_OFF'])