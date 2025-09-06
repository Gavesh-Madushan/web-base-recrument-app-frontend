import { z } from 'zod'

export const enumsAttendanceRecordTypeSchema = z.enum(['WORK', 'BREAK'])