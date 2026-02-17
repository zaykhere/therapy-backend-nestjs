import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTherapyTypeTable1742544839683 implements MigrationInterface {
    name = 'AddTherapyTypeTable1742544839683'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "therapy_types" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_545fb643b4d3db2c97963071cad" UNIQUE ("name"), CONSTRAINT "PK_952904686b8857cd7781c11fd69" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "therapy_types"`);
    }

}
