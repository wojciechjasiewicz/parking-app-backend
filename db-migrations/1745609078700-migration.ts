import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1745609078700 implements MigrationInterface {
    name = 'Migration1745609078700'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "office" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_200185316ba169fda17e3b6ba00" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "parking_map" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "file_type" character varying NOT NULL, "data" bytea NOT NULL, "office_id" integer, CONSTRAINT "PK_b4b09975297986db7df1b0c9791" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "parking_place" ("id" SERIAL NOT NULL, "label" character varying(5) NOT NULL, "position_x" integer NOT NULL, "position_y" integer NOT NULL, "parking_map_id" integer, CONSTRAINT "PK_ca572767db8199d4434cc7c0936" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "reservation" ("id" SERIAL NOT NULL, "date" TIMESTAMP NOT NULL, "parking_place_id" integer, "user_id" integer, CONSTRAINT "PK_48b1f9922368359ab88e8bfa525" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "surname" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "parking_map" ADD CONSTRAINT "FK_0c8f41218b04725af686901eba3" FOREIGN KEY ("office_id") REFERENCES "office"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "parking_place" ADD CONSTRAINT "FK_f1b09cbc5e985c9cb15403e11dd" FOREIGN KEY ("parking_map_id") REFERENCES "parking_map"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD CONSTRAINT "FK_dbf8b95d6f256ba80502b179912" FOREIGN KEY ("parking_place_id") REFERENCES "parking_place"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD CONSTRAINT "FK_e219b0a4ff01b85072bfadf3fd7" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservation" DROP CONSTRAINT "FK_e219b0a4ff01b85072bfadf3fd7"`);
        await queryRunner.query(`ALTER TABLE "reservation" DROP CONSTRAINT "FK_dbf8b95d6f256ba80502b179912"`);
        await queryRunner.query(`ALTER TABLE "parking_place" DROP CONSTRAINT "FK_f1b09cbc5e985c9cb15403e11dd"`);
        await queryRunner.query(`ALTER TABLE "parking_map" DROP CONSTRAINT "FK_0c8f41218b04725af686901eba3"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "reservation"`);
        await queryRunner.query(`DROP TABLE "parking_place"`);
        await queryRunner.query(`DROP TABLE "parking_map"`);
        await queryRunner.query(`DROP TABLE "office"`);
    }

}
