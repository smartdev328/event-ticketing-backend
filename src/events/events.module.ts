// src/events/events.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { EventsResolver } from './events.resolver';
import { Event } from '../entities/event.entity';
import { Purchase } from '../entities/purchase.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Purchase])],
  providers: [EventsService, EventsResolver],
  exports: [EventsService],
})
export class EventsModule {}
