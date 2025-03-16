import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { Event } from '../entities/event.entity';
import { Purchase } from '../entities/purchase.entity';

describe('EventsModule', () => {
  let eventsService: EventsService;

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

    eventsService = module.get<EventsService>(EventsService);
  });

  it('should be defined', () => {
    expect(eventsService).toBeDefined();
  });
});
