import { Client } from 'pg';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { ParkingPlacesService } from './parking-places.service';
import { DataSourceOptions } from 'typeorm';
import { ParkingPlace } from './parking-place.entity';
import { ParkingMap } from '../parking-maps/parking-maps.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService, registerAs } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { NotFoundException } from '@nestjs/common';

function getDbMigations() {
  return [
    `CREATE TABLE "office" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_200185316ba169fda17e3b6ba00" PRIMARY KEY ("id"))`,
    `CREATE TABLE "parking_map" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "file_type" character varying NOT NULL, "data" bytea NOT NULL, "office_id" integer, CONSTRAINT "PK_b4b09975297986db7df1b0c9791" PRIMARY KEY ("id"))`,
    `CREATE TABLE "parking_place" ("id" SERIAL NOT NULL, "label" character varying(5) NOT NULL, "position_x" integer NOT NULL, "position_y" integer NOT NULL, "parking_map_id" integer, CONSTRAINT "PK_ca572767db8199d4434cc7c0936" PRIMARY KEY ("id"))`,
    `CREATE TABLE "reservation" ("id" SERIAL NOT NULL, "date" TIMESTAMP NOT NULL, "parking_place_id" integer, "user_id" integer, CONSTRAINT "PK_48b1f9922368359ab88e8bfa525" PRIMARY KEY ("id"))`,
    `CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "surname" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    `ALTER TABLE "parking_map" ADD CONSTRAINT "FK_0c8f41218b04725af686901eba3" FOREIGN KEY ("office_id") REFERENCES "office"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    `ALTER TABLE "parking_place" ADD CONSTRAINT "FK_f1b09cbc5e985c9cb15403e11dd" FOREIGN KEY ("parking_map_id") REFERENCES "parking_map"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    `ALTER TABLE "reservation" ADD CONSTRAINT "FK_dbf8b95d6f256ba80502b179912" FOREIGN KEY ("parking_place_id") REFERENCES "parking_place"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    `ALTER TABLE "reservation" ADD CONSTRAINT "FK_e219b0a4ff01b85072bfadf3fd7" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
  ].join(';');
}

describe('parking place service', () => {
  let service: ParkingPlacesService;

  jest.setTimeout(60000);

  let postgresContainer;
  let postgresClient;

  beforeAll(async () => {
    const container = await new PostgreSqlContainer().start();
    postgresClient = new Client({
      connectionString: container.getConnectionUri(),
    });

    await postgresClient.connect();
    const migrtionsString = getDbMigations();
    await postgresClient.query(migrtionsString);

    const config: DataSourceOptions = {
      type: 'postgres',
      host: container.getHost(),
      port: container.getPort(),
      username: container.getUsername(),
      password: container.getPassword(),
      database: container.getDatabase(),
      synchronize: false,
      namingStrategy: new SnakeNamingStrategy(),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [registerAs('typeorm', () => config)],
        }),
        TypeOrmModule.forRootAsync({
          inject: [ConfigService],
          useFactory: async (service: ConfigService) => service.get('typeorm'),
        }),
        TypeOrmModule.forFeature([ParkingPlace, ParkingMap]), // Add this explicitly
      ],
      providers: [ParkingMap, ParkingPlace, ParkingPlacesService],
    }).compile();

    service = module.get<ParkingPlacesService>(ParkingPlacesService);
    postgresContainer = container;
  });

  afterAll(async () => {
    await postgresClient.end();
    await postgresContainer.stop();
  });

  describe('findAll', () => {
    it('should get 0 places if db is empty ', async () => {
      expect(await service.findAll(2)).toEqual([]);
    });
  });

  describe('getOne', () => {
    it('should throw error id place not found', async () => {
      await expect(() => service.getOne(100)).rejects.toThrow(
        new NotFoundException(`Parking place 100 not found`),
      );
    });

    it('should get specific parking place', async () => {
      await postgresClient.query(
        [
          `INSERT INTO office (id, name) values (1, 'office1')`,
          `INSERT INTO parking_map (id, name, file_type, data, office_id) values (1, 'map1', 'png', 'gfg', 1)`,
          `INSERT INTO parking_place (label, position_x, position_y, parking_map_id) values ('A001', 60, 60, 1)`,
        ].join(';'),
      );

      const parkingPlace = await service.getOne(1);
      expect(parkingPlace).toEqual({
        id: 1,
        label: 'A001',
        positionX: 60,
        positionY: 60,
      });
    });
  });

  describe('createOne', () => {
    it('should throw error id map not found', async () => {
      await expect(() =>
        service.createOne({
          label: 'A003',
          positionX: 50,
          positionY: 50,
          mapId: 100,
        }),
      ).rejects.toThrow(new NotFoundException(`Parking map 100 doesn't exist`));
    });

    it('should create one', async () => {
      const id = await service.createOne({
        label: 'A003',
        positionX: 50,
        positionY: 50,
        mapId: 1,
      });

      const parkingPlace = await service.getOne(id);
      expect(parkingPlace).toEqual({
        id: 2,
        label: 'A003',
        positionX: 50,
        positionY: 50,
      });
    });
  });

  describe('deleteOne', () => {});

  describe('update', () => {});
});
