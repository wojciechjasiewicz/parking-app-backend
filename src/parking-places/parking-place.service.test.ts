import { describe, test, before, after } from 'node:test';
import assert from 'node:assert';

import { Client } from 'pg';
import { ParkingPlacesService } from './parking-places.service';
import { GenericContainer, StartedTestContainer } from 'testcontainers';

import { DataSource } from 'typeorm';
import { ParkingPlace } from './parking-place.entity';

async function createParkingPlaceTable(client) {
  const sql = `CREATE TABLE IF NOT EXISTS parking_place (
        id serial4 NOT NULL,
        "label" varchar(5) NOT NULL,
	    position_x int4 NOT NULL,
	    position_y int4 NOT NULL,
	    parking_map_id int4 NULL
    )`;

  await client.query(sql);
}

async function createCustomer(client, parkinPlace) {
  const sql =
    'INSERT INTO parking_place (label, position_x, position_y, parking_map_id) VALUES($1, $2, $3, $4, $5)';
  await client.query(sql, [
    parkinPlace.id,
    parkinPlace.label,
    parkinPlace.positionX,
    parkinPlace.positionY,
    parkinPlace.parkingMapId,
  ]);
}

describe('parking-place-serivce', () => {
  let postgresContainer: StartedTestContainer;
  let postgresClient;
  let databaseUrl: string;
  let dataSource: DataSource;

  before(async () => {
    postgresContainer = await new GenericContainer('postgres')
      .withEnvironment({
        POSTGRES_USER: 'test',
        POSTGRES_PASSWORD: 'test',
        POSTGRES_DB: 'testdb',
      })
      .withExposedPorts(5432)
      .start();
    const port = postgresContainer.getMappedPort(5432);
    databaseUrl = `postgres://test:test@localhost:${port}/testdb`;
    postgresClient = new Client({
      connectionString: databaseUrl,
    });
    const dataSource = new DataSource({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'test',
      password: 'test',
      database: 'testdb',
      entities: [ParkingPlace],
      synchronize: true,
    });
    await dataSource.initialize();
    await postgresClient.connect();
    await createParkingPlaceTable(postgresClient);
  });

  after(async () => {
    await postgresClient.end();
    await postgresContainer.stop();
  });

  test('getOne', async () => {
    assert.strictEqual(2, 2);
    const parkingPlaceRepo = dataSource.getRepository(ParkingPlace);
    const parkingPlacesService = new ParkingPlacesService(
      parkingPlaceRepo,
      null,
    );
    await createCustomer(postgresClient, {
      id: 2,
      label: 'TEST',
      postionX: 70,
      positionY: 70,
      parkingMapId: 1,
    });
    const place = await parkingPlacesService.getOne(2);
    assert.strictEqual(place.label, 'TEST');
  });
});
