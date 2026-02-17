import { MigrationInterface, QueryRunner } from "typeorm";

export class AddResetPasswordFields1743755753393 implements MigrationInterface {
    name = 'AddResetPasswordFields1743755753393'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "resetPasswordToken" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "resetPasswordExpires" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "resetPasswordExpires"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "resetPasswordToken"`);
    }
}
