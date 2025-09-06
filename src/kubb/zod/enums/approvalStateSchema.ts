import { z } from 'zod'

export const enumsApprovalStateSchema = z.enum(['PENDING', 'APPROVED', 'REJECTED'])