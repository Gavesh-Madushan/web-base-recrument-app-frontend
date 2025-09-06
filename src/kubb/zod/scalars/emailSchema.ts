import { z } from 'zod'

export const scalarsEmailSchema = z.string().email().min(1).max(50)