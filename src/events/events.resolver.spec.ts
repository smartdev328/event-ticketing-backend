// src/events/events.resolver.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { EventsResolver } from './events.resolver';
import { EventsService } from './events.service';
import { Event } from '../entities/event.entity';
import { Purchase } from '../entities/purchase.entity';

describe('EventsResolver', () => {
  let resolver: EventsResolver;
  let service: EventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsResolver,
        {
          provide: EventsService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            purchaseTickets: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<EventsResolver>(EventsResolver);
    service = module.get<EventsService>(EventsService);
  });

  describe('getEvents', () => {
    it('should return an array of events', async () => {
      const events: Event[] = [
        {
          id: 1,
          name: 'Test Event 1',
          date: new Date(),
          ticketCapacity: 100,
          ticketsSold: 10,
          purchases: [],
        },
        {
          id: 2,
          name: 'Test Event 2',
          date: new Date(),
          ticketCapacity: 200,
          ticketsSold: 20,
          purchases: [],
        },
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(events);

      const result = await resolver.getEvents();
      expect(result).toEqual(events);
    });

    it('should throw an error when findAll fails', async () => {
      const error = new Error('findAll error');
      jest.spyOn(service, 'findAll').mockRejectedValue(error);

      await expect(resolver.getEvents()).rejects.toThrow('findAll error');
    });
  });

  describe('getEvent', () => {
    it('should return a single event when found', async () => {
      const event: Event = {
        id: 1,
        name: 'Test Event',
        date: new Date(),
        ticketCapacity: 100,
        ticketsSold: 50,
        purchases: [],
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(event);

      const result = await resolver.getEvent(1);
      expect(result).toEqual(event);
    });

    it('should return null when event is not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      const result = await resolver.getEvent(999);
      expect(result).toBeNull();
    });

    it('should throw an error when findOne fails', async () => {
      const error = new Error('findOne error');
      jest.spyOn(service, 'findOne').mockRejectedValue(error);

      await expect(resolver.getEvent(1)).rejects.toThrow('findOne error');
    });
  });

  describe('purchaseTickets', () => {
    it('should return a purchase object when successful', async () => {
      const dummyEvent: Event = {
        id: 1,
        name: 'Test Event',
        date: new Date(),
        ticketCapacity: 100,
        ticketsSold: 50,
        purchases: [],
      };
      const purchase: Purchase = {
        id: 1,
        event: dummyEvent,
        quantity: 2,
        orderNumber: 'order123',
      };
      jest.spyOn(service, 'purchaseTickets').mockResolvedValue(purchase);

      const result = await resolver.purchaseTickets(1, 2);
      expect(result).toEqual(purchase);
    });

    it('should throw an error when purchaseTickets fails', async () => {
      const error = new Error('purchaseTickets error');
      jest.spyOn(service, 'purchaseTickets').mockRejectedValue(error);

      await expect(resolver.purchaseTickets(1, 2)).rejects.toThrow(
        'purchaseTickets error',
      );
    });
  });
});
