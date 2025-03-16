// seed.spec.ts
import { AppDataSource, seed } from './seed';
import { Event } from '../entities/event.entity';
import { Purchase } from '../entities/purchase.entity';

describe('Seed Script', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
    const purchaseRepository = AppDataSource.getRepository(Purchase);
    const eventRepository = AppDataSource.getRepository(Event);
    await purchaseRepository.clear();
    await eventRepository.delete({});
    await AppDataSource.destroy();
  });

  it('should seed 5 events into the database', async () => {
    await seed();

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const eventRepository = AppDataSource.getRepository(Event);
    const events = await eventRepository.find();

    expect(events).toHaveLength(5);

    await AppDataSource.destroy();
  });
});
