// src/events/events.resolver.ts
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Event } from '../entities/event.entity';
import { Purchase } from '../entities/purchase.entity';
import { EventsService } from './events.service';

@Resolver(() => Event)
export class EventsResolver {
  constructor(private readonly eventsService: EventsService) {}

  @Query(() => [Event], { name: 'events' })
  async getEvents(): Promise<Event[]> {
    return this.eventsService.findAll();
  }

  @Query(() => Event, { name: 'event', nullable: true })
  async getEvent(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Event | null> {
    return this.eventsService.findOne(id);
  }

  @Mutation(() => Purchase)
  async purchaseTickets(
    @Args('eventId', { type: () => Int }) eventId: number,
    @Args('quantity', { type: () => Int }) quantity: number,
  ): Promise<Purchase> {
    return this.eventsService.purchaseTickets(eventId, quantity);
  }
}
