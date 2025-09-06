import { z } from 'zod'

export const enumsProjectProcessingStateSchema = z.enum(['PENDING', 'ONGOING', 'COMPLETED'])