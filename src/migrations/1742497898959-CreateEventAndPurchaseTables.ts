import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEventAndPurchaseTables1742497898959
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the "event" table
    await queryRunner.query(`
      CREATE TABLE "event" (
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        "date" TIMESTAMP NOT NULL,
        "ticketCapacity" integer NOT NULL DEFAULT 100,
        "ticketsSold" integer NOT NULL DEFAULT 0,
        CONSTRAINT "PK_event_id" PRIMARY KEY ("id")
      )
    `);

    // Create the "purchase" table with a foreign key to the "event" table
    await queryRunner.query(`
      CREATE TABLE "purchase" (
        "id" SERIAL NOT NULL,
        "quantity" integer NOT NULL,
        "orderNumber" character varying NOT NULL,
        "eventId" integer,
        CONSTRAINT "PK_purchase_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_purchase_event" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order to avoid dependency conflicts
    await queryRunner.query(`DROP TABLE "purchase"`);
    await queryRunner.query(`DROP TABLE "event"`);
  }
}
