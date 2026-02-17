import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPatientProfileTable1742540652802 implements MigrationInterface {
    name = 'AddPatientProfileTable1742540652802'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "patient_profiles" ("id" SERIAL NOT NULL, "dateOfBirth" TIMESTAMP, "gender" character varying, "phoneNumber" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "REL_e296010b9088277148d109ba75" UNIQUE ("user_id"), CONSTRAINT "PK_7297a6976f065cc75e798674aa8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "patient_profiles" ADD CONSTRAINT "FK_e296010b9088277148d109ba75a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "patient_profiles" DROP CONSTRAINT "FK_e296010b9088277148d109ba75a"`);
        await queryRunner.query(`DROP TABLE "patient_profiles"`);
    }
}
