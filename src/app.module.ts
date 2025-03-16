import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'my_database',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // only for dev! disable in production
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
