import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Event } from '../entities/event.entity';
import { Purchase } from '../entities/purchase.entity';
import { EventsService } from '../events/events.service';

describe('EventsService', () => {
  let service: EventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        // Initialize TypeORM with a test configuration
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [Event, Purchase],
          synchronize: true,
          logging: false,
        }),
        // Register repositories
        TypeOrmModule.forFeature([Event, Purchase]),
      ],
      providers: [EventsService],
    }).compile();

    service = module.get<EventsService>(EventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('EventsService', () => {
    let service: EventsService;
    let eventRepository: Repository<Event>;
    let purchaseRepository: Repository<Purchase>;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          EventsService,
          {
            provide: getRepositoryToken(Event),
            useClass: Repository,
          },
          {
            provide: getRepositoryToken(Purchase),
            useClass: Repository,
          },
        ],
      }).compile();

      service = module.get<EventsService>(EventsService);
      eventRepository = module.get<Repository<Event>>(
        getRepositoryToken(Event),
      );
      purchaseRepository = module.get<Repository<Purchase>>(
        getRepositoryToken(Purchase),
      );
    });

    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    describe('findAll', () => {
      it('should return an array of events', async () => {
        const eventsArray = [{ id: 1, name: 'Event 1' }];
        jest
          .spyOn(eventRepository, 'find')
          .mockResolvedValue(eventsArray as Event[]);

        expect(await service.findAll()).toBe(eventsArray);
      });
    });

    describe('findOne', () => {
      it('should return a single event', async () => {
        const event = { id: 1, name: 'Event 1' };
        jest
          .spyOn(eventRepository, 'findOne')
          .mockResolvedValue(event as Event);

        expect(await service.findOne(1)).toBe(event);
      });

      it('should return null if event is not found', async () => {
        jest.spyOn(eventRepository, 'findOne').mockResolvedValue(null);

        expect(await service.findOne(999)).toBeNull();
      });
    });

    describe('purchaseTickets', () => {
      it('should throw an error if event is not found', async () => {
        jest.spyOn(service, 'findOne').mockResolvedValue(null);

        await expect(service.purchaseTickets(1, 1)).rejects.toThrow(
          'Event not found',
        );
      });

      it('should throw an error if not enough tickets are available', async () => {
        const event = { id: 1, ticketsSold: 10, ticketCapacity: 10 } as Event;
        jest.spyOn(service, 'findOne').mockResolvedValue(event);

        await expect(service.purchaseTickets(1, 1)).rejects.toThrow(
          'Not enough tickets available',
        );
      });

      it('should update tickets sold and create a purchase record', async () => {
        const event = { id: 1, ticketsSold: 5, ticketCapacity: 10 } as Event;
        const purchase = {
          id: 1,
          quantity: 1,
          orderNumber: uuidv4(),
          event,
        } as Purchase;

        jest.spyOn(service, 'findOne').mockResolvedValue(event);
        jest.spyOn(eventRepository, 'save').mockResolvedValue(event);
        jest.spyOn(purchaseRepository, 'create').mockReturnValue(purchase);
        jest.spyOn(purchaseRepository, 'save').mockResolvedValue(purchase);

        const result = await service.purchaseTickets(1, 1);

        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(eventRepository.save).toHaveBeenCalledWith({
          ...event,
          ticketsSold: 6,
        });
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(purchaseRepository.create).toHaveBeenCalledWith({
          quantity: 1,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          orderNumber: expect.any(String),
          event,
        });
        expect(result).toBe(purchase);
      });
    });
  });
});
