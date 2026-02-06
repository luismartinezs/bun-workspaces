// src/modules/tracker/record-sighting.schema.ts
import { z } from 'zod';

export const recordSightingSchema = z.object({
  species: z.string().min(1, 'Species name is required'),
  rarity: z.enum(['common', 'rare'])
});

export type RecordSightingInput = z.infer<typeof recordSightingSchema>;
