import { Client } from "pg";
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import type { DataSourceOptions } from "typeorm";
import { ParkingPlace } from "./entity/parking-place.entity.js";
import { ParkingMap } from "./entity/parking-map.entity.js";
import { Test, type TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService, registerAs } from "@nestjs/config";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { ParkingMapService } from "./parking-map.service.js";
import { describe, it, afterAll, beforeAll, expect, assert } from "vitest";

describe("parking map service", () => {
  let postgresClient;
  let parkingMapService: ParkingMapService;

  beforeAll(async () => {
    const container = await new PostgreSqlContainer().start();
    postgresClient = new Client({
      connectionString: container.getConnectionUri(),
      ssl: {
        rejectUnauthorized: false,
      },
    });

    await postgresClient.connect();

    const config: DataSourceOptions = {
      type: "postgres",
      host: container.getHost(),
      port: container.getPort(),
      username: container.getUsername(),
      password: container.getPassword(),
      database: container.getDatabase(),
      synchronize: false,
      namingStrategy: new SnakeNamingStrategy(),
      entities: [__dirname + "/../**/*.entity{.ts,.js}"],
      migrations: [__dirname + "/../../db-migrations/*{.ts,.js}"],
      migrationsRun: true,
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [registerAs("typeorm", () => config)],
        }),
        TypeOrmModule.forRootAsync({
          inject: [ConfigService],
          useFactory: async (service: ConfigService) => service.get("typeorm"),
        }),
        TypeOrmModule.forFeature([ParkingPlace, ParkingMap]), // Add this explicitly
      ],
      providers: [ParkingMap, ParkingPlace, ParkingMapService],
    }).compile();

    parkingMapService = module.get(ParkingMapService);
  });

  afterAll(async () => {
    await postgresClient.end();
  });

  describe("getMapList", () => {
    beforeAll(async () => {
      await postgresClient.query(`
        INSERT INTO parking_map (name, group_name, file_type, data)
        VALUES ('Test Map 1', 'testGroup', 'image/png', '');
      `);
      await postgresClient.query(`
        INSERT INTO parking_map (name, group_name, file_type, data)
        VALUES ('Test Map 2', 'testGroup', 'image/png', '');
      `);
      await postgresClient.query(`
        INSERT INTO parking_map (name, group_name, file_type, data)
        VALUES ('Test Map 3', 'testGroup1', 'image/png', '');
      `);
    });

    it("should return empty list if no maps exist", async () => {
      const parkingMaps = await parkingMapService.getMapList("fakeTestGroup");
      expect(parkingMaps.parkingMaps.length).toBe(0);
    });

    it("should return all maps for the group name", async () => {
      const parkingMaps = await parkingMapService.getMapList("testGroup");
      assert.strictEqual(parkingMaps.parkingMaps.length, 2);
      assert.strictEqual(parkingMaps.parkingMaps[0].name, "Test Map 1");
      assert.strictEqual(parkingMaps.parkingMaps[1].name, "Test Map 2");
    });

    it("should return all maps for empty group name", async () => {
      const parkingMaps = await parkingMapService.getMapList();
      expect(parkingMaps.parkingMaps.length).toBe(3);
      expect(parkingMaps.parkingMaps[0].name).toBe("Test Map 1");
      expect(parkingMaps.parkingMaps[0].groupName).toBe("testGroup");
      expect(parkingMaps.parkingMaps[1].name).toBe("Test Map 2");
      expect(parkingMaps.parkingMaps[1].groupName).toBe("testGroup");
      expect(parkingMaps.parkingMaps[2].name).toBe("Test Map 3");
      expect(parkingMaps.parkingMaps[2].groupName).toBe("testGroup1");
    });

    afterAll(async () => {
      await postgresClient.query(`
        DELETE FROM parking_map WHERE name IN ('Test Map 1', 'Test Map 2', 'Test Map 3');
      `);
    });
  });

  describe("findOne", () => {
    beforeAll(async () => {
      await postgresClient.query(`
        INSERT INTO parking_map (id, name, group_name, file_type, data)
        VALUES (0, 'Test Map 1', 'testGroup', 'image/png', '');
      `);
    });

    it("should return a parking map by id", async () => {
      const parkingMap = await parkingMapService.findOne(0);
      expect(parkingMap.name).toBe("Test Map 1");
      expect(parkingMap.groupName).toBe("testGroup");
    });

    it("should throw NotFoundException if parking map does not exist", async () => {
      try {
        await parkingMapService.findOne(999);
        assert.fail("Expected error was not thrown");
      } catch (err) {
        assert.match(err.message, /Missing parking map: 999/);
      }
    });
  });

  describe("create", () => {
    it("should create a new parking map", async () => {
      const mockFile = {
        buffer: Buffer.from("test image data"),
        mimetype: "image/png",
      } as Express.Multer.File;

      const newMapId = await parkingMapService.create(
        mockFile,
        "testGroup",
        "New Parking Map"
      );

      assert.ok(newMapId);

      const createdMap = await parkingMapService.findOne(newMapId);
      assert.strictEqual(createdMap.name, "New Parking Map");
      assert.strictEqual(createdMap.groupName, "testGroup");
    });

    it("should throw an error if the parking map already exists", async () => {
      const mockFile = {
        buffer: Buffer.from("test image data"),
        mimetype: "image/png",
      } as Express.Multer.File;

      try {
        await parkingMapService.create(
          mockFile,
          "testGroup",
          "New Parking Map"
        );
        assert.fail("Expected error was not thrown");
      } catch (err) {
        assert.match(
          err.message,
          /Parking map New Parking Map in group testGroup already exists/
        );
      }
    });

    afterAll(async () => {
      await postgresClient.query(`
        DELETE FROM parking_map WHERE name = 'New Parking Map';
      `);
    });
  });
  describe("deleteMap", () => {
    beforeAll(async () => {
      await parkingMapService.create(
        {
          buffer: Buffer.from("test image data"),
          mimetype: "image/png",
        } as Express.Multer.File,
        "testGroup",
        "Map to Delete"
      );
    });

    it("should delete a parking map by id", async () => {
      const parkingMaps = await parkingMapService.getMapList("testGroup");
      const mapToDelete = parkingMaps.parkingMaps.find(
        (map) => map.name === "Map to Delete"
      );

      assert.ok(mapToDelete);

      await parkingMapService.delete(mapToDelete.id);
      try {
        await parkingMapService.findOne(mapToDelete.id);
        assert.fail("Expected error was not thrown");
      } catch (err) {
        assert.match(
          err.message,
          new RegExp("Missing parking map: " + mapToDelete.id)
        );
      }
    });

    it("should throw NotFoundException if parking map does not exist", async () => {
      try {
        await parkingMapService.delete(999);
        assert.fail("Expected error was not thrown");
      } catch (err) {
        assert.match(err.message, /Missing parking map: 999/);
      }
    });
  });
});
