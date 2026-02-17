import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAppointmentTables1742809892478 implements MigrationInterface {
    name = 'AddAppointmentTables1742809892478'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "appointment_therapists" ("id" SERIAL NOT NULL, "appointmentId" integer, "therapistId" integer, CONSTRAINT "PK_4d97c749569cd8b8f8cf2ef5fba" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "appointments" ("id" SERIAL NOT NULL, "duration" integer NOT NULL, "scheduledAt" TIMESTAMP WITH TIME ZONE NOT NULL, "isCompleted" boolean NOT NULL DEFAULT false, "meetingUrl" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4a437a9a27e948726b8bb3e36ad" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "appointment_patients" ("id" SERIAL NOT NULL, "appointmentId" integer, "patientId" integer, CONSTRAINT "PK_c1be0c3085d18efbdd633b42761" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "appointment_therapists" ADD CONSTRAINT "FK_b30f94836b92c62ee2edfe22a53" FOREIGN KEY ("appointmentId") REFERENCES "appointments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointment_therapists" ADD CONSTRAINT "FK_cc7c6c6110ef8bed32340f4db72" FOREIGN KEY ("therapistId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointment_patients" ADD CONSTRAINT "FK_df998548c2878b724683d44fe63" FOREIGN KEY ("appointmentId") REFERENCES "appointments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointment_patients" ADD CONSTRAINT "FK_9202a6754529f2b2e4f5184b8ec" FOREIGN KEY ("patientId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointment_patients" DROP CONSTRAINT "FK_9202a6754529f2b2e4f5184b8ec"`);
        await queryRunner.query(`ALTER TABLE "appointment_patients" DROP CONSTRAINT "FK_df998548c2878b724683d44fe63"`);
        await queryRunner.query(`ALTER TABLE "appointment_therapists" DROP CONSTRAINT "FK_cc7c6c6110ef8bed32340f4db72"`);
        await queryRunner.query(`ALTER TABLE "appointment_therapists" DROP CONSTRAINT "FK_b30f94836b92c62ee2edfe22a53"`);
        await queryRunner.query(`DROP TABLE "appointment_patients"`);
        await queryRunner.query(`DROP TABLE "appointments"`);
        await queryRunner.query(`DROP TABLE "appointment_therapists"`);
    }

}
