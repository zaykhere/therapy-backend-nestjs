import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTherapistProfileTable1742542816610 implements MigrationInterface {
    name = 'AddTherapistProfileTable1742542816610'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "therapist_profiles" ("id" SERIAL NOT NULL, "specialization" character varying, "licenseNumber" character varying, "yearsOfExperience" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "REL_727b50cdd502750ef052abbab1" UNIQUE ("user_id"), CONSTRAINT "PK_f797abb29d988b98c28b933949b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "therapist_profiles" ADD CONSTRAINT "FK_727b50cdd502750ef052abbab1a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "therapist_profiles" DROP CONSTRAINT "FK_727b50cdd502750ef052abbab1a"`);
        await queryRunner.query(`DROP TABLE "therapist_profiles"`);
    }

}
