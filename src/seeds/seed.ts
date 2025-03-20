// seed.ts

import AppDataSource from '../data-source';
import { Event } from '../entities/event.entity';

export async function seed(): Promise<void> {
  try {
    await AppDataSource.initialize();

    const eventRepository = AppDataSource.getRepository(Event);

    // Define sample events
    const events = [
      {
        name: 'Music Concert',
        date: new Date('2025-06-15T20:00:00Z'),
        ticketCapacity: 5,
        ticketsSold: 0,
      },
      {
        name: 'Art Exhibition',
        date: new Date('2025-07-20T18:00:00Z'),
        ticketCapacity: 2,
        ticketsSold: 0,
      },
      {
        name: 'Tech Conference',
        date: new Date('2025-08-10T09:00:00Z'),
        ticketCapacity: 3,
        ticketsSold: 0,
      },
      {
        name: 'Food Festival',
        date: new Date('2025-09-05T11:00:00Z'),
        ticketCapacity: 4,
        ticketsSold: 0,
      },
      {
        name: 'Film Screening',
        date: new Date('2025-10-01T19:00:00Z'),
        ticketCapacity: 1,
        ticketsSold: 0,
      },
    ];

    for (const eventData of events) {
      const event = eventRepository.create(eventData);
      await eventRepository.save(event);
      console.log(`Seeded event: ${event.name}`);
    }

    // Destroy the connection only if not in a test environment.
    if (process.env.NODE_ENV !== 'test') {
      await AppDataSource.destroy();
      console.log('Seeding complete.');
    }
  } catch (error) {
    console.error('Seeding error:', error);
  }
}

if (require.main === module) {
  seed();
}
export { AppDataSource };

