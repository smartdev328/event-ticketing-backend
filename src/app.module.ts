// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';

import { EventsModule } from './events/events.module';
import { graphqlConfig } from './common/graphql-config';
import ormgconfig from './ormconfig';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...ormgconfig,
      type: 'postgres',
    }),
    GraphQLModule.forRoot(graphqlConfig),
    EventsModule,
  ],
})
export class AppModule {}
