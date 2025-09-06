import { z } from 'zod'

/**
 * @description Must be a whole number
 */
export const scalarsWSchema = z.coerce.number().int().min(0).describe('Must be a whole number')