import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsConfirmedToAppointmentTable1742815566362 implements MigrationInterface {
    name = 'AddIsConfirmedToAppointmentTable1742815566362'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointments" ADD "isConfirmed" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN "isConfirmed"`);
    }

}
