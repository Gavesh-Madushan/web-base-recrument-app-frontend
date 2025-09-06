import { z } from 'zod'

export const enumsActiveStateSchema = z.enum(['ACTIVE', 'INACTIVE'])