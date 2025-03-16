/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('GraphQL API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    // Create the testing module using AppModule from the src folder.
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should fetch events', async () => {
    const query = `
      query {
        events {
          id
          name
          date
          ticketCapacity
          ticketsSold
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);

    // Expect the "events" field to be defined (could be an empty array if no data exists)
    expect(response.body.data.events).toBeDefined();
  });

  it('should fetch a single event by id', async () => {
    const query = `
      query getEvent($id: Int!) {
        event(id: $id) {
          id
          name
          date
          ticketCapacity
          ticketsSold
        }
      }
    `;
    const variables = { id: 1 };

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query, variables })
      .expect(200);

    // The event might be null if it doesn't exist; we only ensure the key is present
    expect(response.body.data).toHaveProperty('event');
  });

  it('should return null for a non-existent event', async () => {
    const query = `
      query getEvent($id: Int!) {
        event(id: $id) {
          id
          name
          date
          ticketCapacity
          ticketsSold
        }
      }
    `;
    const variables = { id: 9999 };

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query, variables })
      .expect(200);

    expect(response.body.data.event).toBeNull();
  });
});
