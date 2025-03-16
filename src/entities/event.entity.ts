// src/entities/event.entity.ts
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Purchase } from './purchase.entity';

@ObjectType()
@Entity()
export class Event {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  date: Date;

  @Field(() => Int)
  @Column({ default: 100 }) // default capacity
  ticketCapacity: number;

  @Field(() => Int)
  @Column({ default: 0 })
  ticketsSold: number;

  @OneToMany(() => Purchase, (purchase) => purchase.event)
  purchases: Purchase[];
}
