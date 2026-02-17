import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPaymentTable1743147380986 implements MigrationInterface {
    name = 'AddPaymentTable1743147380986'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "therapist_notes" ("id" SERIAL NOT NULL, "note" text NOT NULL, "isVisibleToPatient" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "appointmentId" integer, "therapistId" integer, CONSTRAINT "PK_11c07158939eb9dcb51a6cdb867" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "payments" ("id" SERIAL NOT NULL, "provider" integer NOT NULL, "status" integer NOT NULL, "amount" numeric(10,2) NOT NULL, "paymentIntentId" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "patientId" integer, "appointmentId" integer, CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "therapist_notes" ADD CONSTRAINT "FK_acd83f0003cfdc6f39d913b9c7e" FOREIGN KEY ("appointmentId") REFERENCES "appointments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "therapist_notes" ADD CONSTRAINT "FK_110b6261e7a2d4b95b69653752e" FOREIGN KEY ("therapistId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_e1f738d342393a3c19867610f20" FOREIGN KEY ("patientId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_90213a20c94916e46cd2131364f" FOREIGN KEY ("appointmentId") REFERENCES "appointments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_90213a20c94916e46cd2131364f"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_e1f738d342393a3c19867610f20"`);
        await queryRunner.query(`ALTER TABLE "therapist_notes" DROP CONSTRAINT "FK_110b6261e7a2d4b95b69653752e"`);
        await queryRunner.query(`ALTER TABLE "therapist_notes" DROP CONSTRAINT "FK_acd83f0003cfdc6f39d913b9c7e"`);
        await queryRunner.query(`DROP TABLE "payments"`);
        await queryRunner.query(`DROP TABLE "therapist_notes"`);
    }

}
