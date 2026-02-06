// src/modules/tracker/record-sighting.command.ts (COMMAND PATTERN)
import { eventBus } from '../../shared/event-bus';
import { recordSightingSchema, RecordSightingInput } from './record-sighting.schema';

export const createRecordSightingCommand = (rawData: unknown) => {
  return {
    name: 'RecordSighting',
    execute: async () => {
      // Validate input with Zod schema
      const data = recordSightingSchema.parse(rawData) as RecordSightingInput;

      console.log(`[Database] Saving ${data.species} to the logs...`);

      // Notify the rest of the system something happened
      eventBus.emit('BIRD_SPOTTED', {
        species: data.species,
        rarity: data.rarity,
        location: 'Park'
      });
    }
  };
};
