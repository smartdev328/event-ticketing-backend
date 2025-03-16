// src/entities/purchase.entity.ts
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Event } from './event.entity';

@ObjectType()
@Entity()
export class Purchase {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column()
  quantity: number;

  @Field()
  @Column()
  orderNumber: string; // a simple string to represent order confirmation

  @ManyToOne(() => Event, (event) => event.purchases)
  event: Event;
}
