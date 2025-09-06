import { z } from 'zod'

/**
 * @description Must be a natural number
 */
export const scalarsNSchema = z.coerce.number().int().min(1).describe('Must be a natural number')