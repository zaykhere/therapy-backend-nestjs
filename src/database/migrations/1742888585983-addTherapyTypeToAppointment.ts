import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTherapyTypeToAppointment1742888585983 implements MigrationInterface {
    name = 'AddTherapyTypeToAppointment1742888585983'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointments" ADD "therapyTypeId" integer`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_81ce46e9ea2db0b97af8b333200" FOREIGN KEY ("therapyTypeId") REFERENCES "therapy_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_81ce46e9ea2db0b97af8b333200"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN "therapyTypeId"`);
    }

}
