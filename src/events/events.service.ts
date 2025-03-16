// src/events/events.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../entities/event.entity';
import { Purchase } from '../entities/purchase.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Purchase)
    private readonly purchaseRepository: Repository<Purchase>,
  ) {}

  async findAll(): Promise<Event[]> {
    return this.eventRepository.find();
  }

  async findOne(id: number): Promise<Event | null> {
    return this.eventRepository.findOne({ where: { id } });
  }

  async purchaseTickets(eventId: number, quantity: number): Promise<Purchase> {
    const event = await this.findOne(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    // Check ticket availability
    if (event.ticketsSold + quantity > event.ticketCapacity) {
      throw new Error('Not enough tickets available');
    }

    // Update tickets sold
    event.ticketsSold += quantity;
    await this.eventRepository.save(event);

    // Create purchase record
    const purchase = this.purchaseRepository.create({
      quantity,
      orderNumber: uuidv4(), // generate a unique ID for order
      event,
    });
    return this.purchaseRepository.save(purchase);
  }
}
